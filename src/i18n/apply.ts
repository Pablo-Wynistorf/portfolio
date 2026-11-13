// Puts translated text into the English content objects, in place.
// No imports, so both the browser bundle and the Node build scripts can use it.

/** Deep merge; arrays merge by index, so a translation only lists the fields it changes. */
export function merge(target: any, src: any) {
  for (const k of Object.keys(src)) {
    const v = src[k];
    if (v && typeof v === "object" && target[k] && typeof target[k] === "object") merge(target[k], v);
    else target[k] = v;
  }
  return target;
}

type Translation = {
  categories: Record<string, string>;
  tags: Record<string, string>;
  data: { projects: Record<string, any>; certifications: Record<string, any>; [k: string]: any };
};

/** `c` holds the content exports (profile, about, projects, …). */
export function applyTranslation(c: any, tr: Translation) {
  const { projects, certifications, ...rest } = tr.data;
  for (const k of Object.keys(rest)) merge(c[k], rest[k]);
  for (const p of c.projects) {
    if (projects[p.slug]) merge(p, projects[p.slug]);
    p.category = tr.categories[p.category] ?? p.category;
    p.tags = p.tags.map((t: string) => tr.tags[t] ?? t);
  }
  for (const x of c.certifications) if (certifications[x.slug]) merge(x, certifications[x.slug]);
  return c;
}
