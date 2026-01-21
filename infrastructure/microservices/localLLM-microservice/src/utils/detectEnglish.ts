export function looksLikeEnglish(text: string): boolean {
  const t = (text ?? "").trim();
  if (t.length < 5) return true;

  // Heuristic: if too many non-ascii letters, likely not English
  const nonAscii = [...t].filter((c) => c.charCodeAt(0) > 127).length;
  if (nonAscii / t.length > 0.08) return false;

  // Heuristic: presence of common English words
  const lower = t.toLowerCase();
  const common = [" the ", " and ", " is ", " are ", " you ", " i ", " we ", " to ", " of ", " in "];
  const hits = common.reduce((acc, w) => acc + (lower.includes(w) ? 1 : 0), 0);

  return hits >= 1 || t.length < 40;
}
