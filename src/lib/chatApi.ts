// Client for the chat.pablo.one backend (Next.js API on Lambda + Bedrock).
// Endpoints: GET /api/greeting, POST /api/chat, POST /api/search.
import { countVisit } from "./visits";

export const CHAT_API = (import.meta.env.VITE_CHAT_API as string | undefined) ?? "https://chat.pablo.one";
export const CHAT_SITE = "https://chat.pablo.one";
export const MAX_CHARS = 1600;

/** Appended by the backend when a Bedrock guardrail refused the turn. */
const BLOCKED = "\u0000guardrail-blocked\u0000";
const VISITS_KEY = "pablo.one.visits";

export type Role = "user" | "assistant";
export type Source = { url: string; title: string; section: string; score: number };
export type Visitor = Record<string, unknown>;
export type Message = {
  role: Role;
  content: string;
  pending?: boolean;
  blocked?: boolean;
  error?: boolean;
  sources?: Source[];
};
export type SearchResult = {
  url: string;
  title: string;
  description: string;
  section: string;
  score: number;
  snippet: string;
};

function decodeHeader<T>(res: Response, name: string): T | undefined {
  const raw = res.headers.get(name);
  if (!raw) return undefined;
  try {
    return JSON.parse(decodeURIComponent(raw)) as T;
  } catch {
    return undefined;
  }
}

async function readStream(res: Response, onText: (t: string) => void) {
  const reader = res.body!.getReader();
  const dec = new TextDecoder();
  let text = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    text += dec.decode(value, { stream: true });
    onText(text);
  }
  return text;
}

async function errorOf(res: Response) {
  const body = await res.json().catch(() => ({}) as { error?: string });
  return (body as { error?: string }).error ?? `Request failed (${res.status})`;
}

/** Same visitor hints chat.pablo.one sends, so the greeting is personalised the same way. */
function greetingParams(total: number | null) {
  const q = new URLSearchParams();
  const set = (k: string, v: unknown) => {
    if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
  };
  try {
    set("tz", Intl.DateTimeFormat().resolvedOptions().timeZone);
    set("lang", navigator.language);
    set("cores", navigator.hardwareConcurrency);
    set("mem", (navigator as Navigator & { deviceMemory?: number }).deviceMemory);
    set("sw", screen.width);
    set("sh", screen.height);
    set("dpr", Math.round(devicePixelRatio * 100) / 100);
    set("dark", matchMedia("(prefers-color-scheme: dark)").matches ? "1" : "0");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) set("rm", "1");
    set("ref", document.referrer);
    const seen = Number(localStorage.getItem(VISITS_KEY) ?? "0");
    const visits = Number.isFinite(seen) && seen > 0 ? Math.min(seen, 9999) : 0;
    set("visits", visits);
    localStorage.setItem(VISITS_KEY, String(visits + 1));
  } catch {
    /* hints are optional */
  }
  if (total !== null) set("total", total);
  return q;
}

export async function streamGreeting(onText: (t: string, visitor?: Visitor) => void, signal?: AbortSignal) {
  const total = await countVisit();
  const res = await fetch(`${CHAT_API}/api/greeting?${greetingParams(total)}`, { signal });
  if (!res.ok || !res.body) throw new Error("greeting failed");
  const visitor = decodeHeader<Visitor>(res, "x-visitor");
  return readStream(res, (t) => onText(t, visitor));
}

export async function streamChat(
  history: Message[],
  onUpdate: (m: Message) => void,
  signal?: AbortSignal,
): Promise<Message> {
  const messages = history
    .filter((m) => !m.error && !m.pending)
    .map(({ role, content, blocked }) => ({ role, content, ...(blocked ? { blocked } : {}) }));
  let lang = "";
  try {
    lang = `?lang=${encodeURIComponent(navigator.language)}`;
  } catch {
    /* ignore */
  }
  const res = await fetch(`${CHAT_API}/api/chat${lang}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
    signal,
  });
  if (!res.ok || !res.body) throw new Error(await errorOf(res));

  const sources = decodeHeader<Source[]>(res, "x-sources") ?? [];
  const text = await readStream(res, (t) =>
    onUpdate({ role: "assistant", content: t.split(BLOCKED).join(""), pending: true, sources }),
  );
  if (text.includes(BLOCKED)) {
    return {
      role: "assistant",
      content:
        "That one's outside what I can help with here. Ask me about my work, my projects, my certifications, or the events I've worked on.",
      blocked: true,
    };
  }
  return { role: "assistant", content: text.trim() || "(no answer)", sources };
}

export async function search(query: string, topPages = 6, signal?: AbortSignal): Promise<SearchResult[]> {
  const res = await fetch(`${CHAT_API}/api/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, topPages }),
    signal,
  });
  if (!res.ok) throw new Error(await errorOf(res));
  return ((await res.json()) as { results: SearchResult[] }).results ?? [];
}

/** True when the browser blocked the call (CORS or offline), not when the API answered with an error. */
export function isNetworkError(e: unknown) {
  return e instanceof TypeError;
}
