import { Fragment, type ReactNode } from "react";
import { Link } from "react-router";

// Same link allowlist as chat.pablo.one: the model can only link to these hosts.
const ALLOWED = new Set([
  "pablo.one",
  "www.pablo.one",
  "github.com",
  "www.github.com",
  "raw.githubusercontent.com",
  "linkedin.com",
  "www.linkedin.com",
  "credly.com",
  "www.credly.com",
]);
const SITE = new Set(["pablo.one", "www.pablo.one"]);
const INLINE = /\[[^\]\n]+\]\([^()\s]+\)|\*\*[^*\n]+\*\*|`[^`\n]+`|\*[^*\s][^*\n]*\*/g;
const LINK = /^\[([^\]]+)\]\(([^()\s]+)\)$/;

function link(label: string, href: string, key: string): ReactNode {
  let u: URL;
  try {
    u = new URL(href, "https://www.pablo.one");
  } catch {
    return label;
  }
  if (u.protocol !== "https:" || !ALLOWED.has(u.hostname)) return label;
  const cls = "underline decoration-red decoration-1 underline-offset-2 hover:text-red";
  if (SITE.has(u.hostname)) {
    return (
      <Link key={key} to={u.pathname + u.hash} className={cls}>
        {label}
      </Link>
    );
  }
  return (
    <a key={key} href={u.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {label}
    </a>
  );
}

function inline(text: string, prefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(INLINE)) {
    const tok = m[0];
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    last = at + tok.length;
    const key = `${prefix}-${i++}`;
    const l = LINK.exec(tok);
    if (l) out.push(link(l[1], l[2], key));
    else if (tok.startsWith("**")) out.push(<strong key={key} className="font-semibold text-ink">{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("`")) out.push(<code key={key} className="bg-paper-2 px-1 py-0.5 font-mono text-[0.85em]">{tok.slice(1, -1)}</code>);
    else out.push(<em key={key}>{tok.slice(1, -1)}</em>);
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function prose(text: string, prefix: string) {
  return text.split(/\n{2,}/).map((block, b) => {
    const lines = block.split("\n");
    const isList = lines.every((l) => /^\s*([-*]|\d+\.)\s+/.test(l));
    if (isList) {
      return (
        <ul key={`${prefix}-${b}`} className="my-2 list-disc space-y-1 pl-5">
          {lines.map((l, i) => (
            <li key={i}>{inline(l.replace(/^\s*([-*]|\d+\.)\s+/, ""), `${prefix}-${b}-${i}`)}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={`${prefix}-${b}`} className="my-2 first:mt-0 last:mb-0">
        {lines.map((l, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {inline(l, `${prefix}-${b}-${i}`)}
          </Fragment>
        ))}
      </p>
    );
  });
}

/** Renders the model's markdown subset: fenced code, lists, links, bold, italic, inline code. */
export function MessageContent({ text }: { text: string }) {
  const parts = text.split(/```([A-Za-z0-9_+#-]*)[ \t]*\r?\n?/);
  // split with one capture group: [prose, lang, code, lang, prose, ...]
  const out: ReactNode[] = [];
  let inCode = false;
  for (let i = 0; i < parts.length; i++) {
    if (!inCode) {
      if (parts[i]) out.push(...prose(parts[i], `p${i}`));
      if (i + 1 < parts.length) {
        inCode = true;
        i++; // skip lang
      }
    } else {
      out.push(
        <pre key={`c${i}`} className="my-3 overflow-x-auto bg-ink p-3 font-mono text-xs leading-relaxed text-paper">
          <code>{parts[i].replace(/\n$/, "")}</code>
        </pre>,
      );
      inCode = false;
      i++; // skip the closing fence's (empty) lang
    }
  }
  return <>{out}</>;
}
