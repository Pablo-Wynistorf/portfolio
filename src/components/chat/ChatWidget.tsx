import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, ExternalLink, Loader2, Plus, Search, X } from "lucide-react";
import { MessageContent } from "./MessageContent";
import {
  CHAT_SITE,
  MAX_CHARS,
  isNetworkError,
  search,
  streamChat,
  streamGreeting,
  type Message,
  type SearchResult,
} from "@/lib/chatApi";
import { profile } from "@/data/content";
import { t } from "@/i18n/t";
import { cn } from "@/lib/utils";

const STORE = "pablo.one.chat";
const OPEN_EVENT = "pablo:open-chat";

/** Open the chat from anywhere, optionally sending a question right away. */
export function openChat(question?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: question }));
}

function load(): Message[] {
  try {
    return JSON.parse(sessionStorage.getItem(STORE) ?? "[]") as Message[];
  } catch {
    return [];
  }
}

function internal(url: string) {
  try {
    const u = new URL(url);
    return u.hostname === "pablo.one" || u.hostname === "www.pablo.one" ? u.pathname + u.hash : null;
  } catch {
    return null;
  }
}

function SourceChip({ url, title }: { url: string; title: string }) {
  const to = internal(url);
  const cls =
    "inline-flex max-w-[14rem] items-center gap-1 truncate border border-ink/20 px-2 py-1 font-mono text-[10px] uppercase text-muted transition hover:border-ink hover:text-ink";
  return to ? (
    <Link to={to} className={cls} title={url}>
      <span className="truncate">{title}</span>
    </Link>
  ) : (
    <a href={url} target="_blank" rel="noopener noreferrer" className={cls} title={url}>
      <span className="truncate">{title}</span>
      <ExternalLink className="h-3 w-3 shrink-0" />
    </a>
  );
}

function Typing() {
  return (
    <span className="inline-flex gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 bg-red"
          animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"chat" | "search">("chat");
  const [messages, setMessages] = useState<Message[]>(load);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const greeted = useRef(messages.length > 0);
  const abort = useRef<AbortController | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!messages.some((m) => m.pending)) sessionStorage.setItem(STORE, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, results]);

  const greet = useCallback(async () => {
    if (greeted.current) return;
    greeted.current = true;
    setMessages([{ role: "assistant", content: "", pending: true }]);
    try {
      const text = await streamGreeting((t) => setMessages([{ role: "assistant", content: t, pending: true }]));
      setMessages([{ role: "assistant", content: text.trim() || t.chat.greet }]);
    } catch {
      setMessages([{ role: "assistant", content: t.chat.greetFallback }]);
    }
  }, []);

  const send = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || busy || q.length > MAX_CHARS) return;
      setInput("");
      setBusy(true);
      const history: Message[] = [...messages.filter((m) => !m.pending), { role: "user", content: q }];
      setMessages([...history, { role: "assistant", content: "", pending: true }]);
      abort.current = new AbortController();
      try {
        const final = await streamChat(history, (m) => setMessages([...history, m]), abort.current.signal);
        setMessages(() => {
          const h = [...history];
          if (final.blocked) h[h.length - 1] = { ...h[h.length - 1], blocked: true };
          return [...h, final];
        });
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        const msg = isNetworkError(e) ? t.chat.unreachable : (e as Error).message;
        setMessages([...history, { role: "assistant", content: msg, error: true }]);
      } finally {
        setBusy(false);
        abort.current = null;
      }
    },
    [busy, messages],
  );

  const runSearch = useCallback(async (text: string) => {
    const q = text.trim();
    if (!q) return;
    setBusy(true);
    setSearchError(null);
    setResults(null);
    try {
      setResults(await search(q));
    } catch (e) {
      setSearchError(isNetworkError(e) ? t.chat.unreachable : (e as Error).message);
    } finally {
      setBusy(false);
    }
  }, []);

  // open from anywhere (hero button, dock, ⌘K)
  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true);
      setMode("chat");
      const q = (e as CustomEvent<string | undefined>).detail;
      if (q) {
        greeted.current = true;
        send(q);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, [send]);

  // On phones the panel is a full-screen sheet: stop the page behind it from scrolling.
  useEffect(() => {
    if (!open || !window.matchMedia("(max-width: 767px)").matches) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open && mode === "chat") greet();
    if (open && window.matchMedia("(pointer: fine)").matches) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open, mode, greet]);

  const reset = () => {
    abort.current?.abort();
    setBusy(false);
    greeted.current = false;
    setMessages([]);
    setResults(null);
    sessionStorage.removeItem(STORE);
    greet();
  };

  const submit = () => (mode === "chat" ? send(input) : runSearch(input));
  const over = input.length > MAX_CHARS;
  const showSuggestions = mode === "chat" && !messages.some((m) => m.role === "user");

  return (
    <>
      {/* launcher */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? t.chat.close : t.chat.open}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 15 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className={cn("fixed bottom-4 right-4 z-[70] h-11", open ? "hidden md:flex" : "flex", " items-center gap-2 rounded-full bg-ink pl-4 pr-4 text-sm font-medium md:h-12 md:pr-5 text-paper shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition-colors hover:bg-red md:bottom-6 md:right-8")}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-75 [animation-duration:2s]" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red" />
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "chat"}
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: 90, scale: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            {open ? t.chat.closeShort : (
              <>
                <span className="md:hidden">{t.chat.askShort}</span>
                <span className="hidden md:inline">{t.chat.askLong}</span>
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={t.chat.open}
            initial={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed inset-0 z-[90] flex h-[100dvh] flex-col overflow-hidden bg-paper text-ink md:inset-auto md:z-[70] md:border md:border-ink md:shadow-[12px_12px_0_0_#121212] md:bottom-24 md:right-8 md:h-[640px] md:max-h-[calc(100vh-8rem)] md:w-[420px]"
          >

            {/* header */}
            <div className="flex items-center gap-3 border-b border-ink bg-ink px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] text-paper">
              <div className="relative">
                <img src={profile.avatar} alt="" className="h-10 w-10 object-cover grayscale" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-ink bg-red" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{t.chat.title}</div>
                <div className="truncate font-mono text-[10px] uppercase tracking-wider text-paper/50">{t.chat.subtitle}</div>
              </div>
              <button
                onClick={reset}
                title={t.chat.newChat}
                aria-label={t.chat.newChatLabel}
                className="p-2 text-paper/60 transition hover:text-paper"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label={t.chat.close}
                className="p-2 text-paper/60 transition hover:text-paper"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* mode switch */}
            <div className="flex gap-1 border-b border-ink px-4 py-2.5">
              {(["chat", "search"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "relative flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition",
                    mode === m ? "text-paper" : "text-muted hover:text-ink",
                  )}
                >
                  {mode === m && (
                    <motion.span layoutId="chat-mode" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    {m === "chat" ? t.chat.modeAsk : t.chat.modeSearch}
                  </span>
                </button>
              ))}
              <span className="ml-auto hidden items-center font-mono text-[10px] text-muted md:flex">⌘K</span>
            </div>

            {/* body */}
            <div ref={scroller} className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 [scrollbar-width:thin]">
              {mode === "chat" ? (
                <>
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[88%] text-sm leading-relaxed",
                          m.role === "user"
                            ? "rounded-2xl rounded-br-sm bg-ink px-4 py-2.5 text-paper"
                            : "border-l-2 border-ink pl-3 text-ink-2",
                          m.error && "border-red text-red",
                          m.blocked && m.role === "user" && "opacity-50",
                        )}
                      >
                        {m.role === "user" ? (
                          <span className="whitespace-pre-wrap">{m.content}</span>
                        ) : m.pending && !m.content ? (
                          <Typing />
                        ) : (
                          <MessageContent text={m.content} />
                        )}
                        {m.error && (
                          <a href={CHAT_SITE} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] uppercase text-ink underline underline-offset-4 hover:text-red">
                            {t.chat.openSite} <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {!m.pending && m.sources && m.sources.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {m.sources.slice(0, 4).map((s) => (
                              <SourceChip key={s.url} url={s.url} title={s.title} />
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {showSuggestions && (
                    <motion.div
                      initial="hidden"
                      animate="show"
                      variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
                      className="grid grid-cols-2 gap-2 pt-2"
                    >
                      {t.chat.suggestions.map((s) => (
                        <motion.button
                          key={s.q}
                          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                          onClick={() => send(s.q)}
                          disabled={busy}
                          className="border border-ink/20 px-3 py-2.5 text-left text-xs transition hover:border-ink hover:bg-ink hover:text-paper disabled:opacity-50"
                        >
                          {s.label}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="space-y-2">
                  {!results && !busy && !searchError && (
                    <p className="pt-6 text-center text-sm text-muted">
                      {t.chat.searchHint}
                    </p>
                  )}
                  {busy && <Loader2 className="mx-auto mt-6 h-5 w-5 animate-spin text-red" />}
                  {searchError && <p className="border-l-2 border-red pl-3 text-sm text-red">{searchError}</p>}
                  {results?.length === 0 && <p className="pt-6 text-center text-sm text-muted">{t.chat.nothing}</p>}
                  {results?.map((r, i) => {
                    const to = internal(r.url);
                    const body = (
                      <>
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold">{r.title}</span>
                          <span className="shrink-0 font-mono text-[10px] uppercase text-muted">{r.section}</span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-muted">{r.snippet || r.description}</p>
                      </>
                    );
                    const cls = "block border-b border-ink/20 py-3 transition hover:text-red";
                    return (
                      <motion.div key={r.url} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                        {to ? (
                          <Link to={to} className={cls} onClick={() => setOpen(false)}>
                            {body}
                          </Link>
                        ) : (
                          <a href={r.url} target="_blank" rel="noopener noreferrer" className={cls}>
                            {body}
                          </a>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="border-t border-ink p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            >
              <div className="flex items-end gap-2 border border-ink bg-paper p-1.5 focus-within:shadow-[3px_3px_0_0_#e1251b]">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  placeholder={mode === "chat" ? t.chat.placeholderChat : t.chat.placeholderSearch}
                  aria-label={mode === "chat" ? t.chat.labelChat : t.chat.labelSearch}
                  className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent px-2.5 py-2 text-base text-ink md:text-sm placeholder:text-muted focus:outline-none focus-visible:outline-none"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim() || over}
                  aria-label={t.chat.send}
                  className="flex h-10 w-10 shrink-0 items-center justify-center bg-ink text-paper transition hover:bg-red disabled:opacity-30"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "chat" ? <ArrowUp className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-1.5 flex justify-between px-1 font-mono text-[10px] uppercase text-muted">
                <span>{t.chat.disclaimer}</span>
                {input.length > MAX_CHARS - 200 && (
                  <span className={over ? "text-red" : ""}>{MAX_CHARS - input.length}</span>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
