// Same visitor counter the Hugo site and chat.pablo.one use. One POST per page
// load, shared by the footer and the chat greeting.
let visit: Promise<number | null> | null = null;

export function countVisit() {
  visit ??= fetch("https://count.onedns.ch", {
    method: "POST",
    mode: "cors",
    credentials: "omit",
    cache: "no-store",
  })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => (typeof d?.count === "number" && Number.isFinite(d.count) && d.count >= 0 ? Math.floor(d.count) : null))
    .catch(() => null);
  return visit;
}
