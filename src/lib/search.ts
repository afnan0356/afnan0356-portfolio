import type { SearchEntry } from "./search-index";
export function findEntries(
  entries: SearchEntry[],
  query: string,
): SearchEntry[] {
  const words = query
    .normalize("NFKC")
    .toLocaleLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return [];
  return entries
    .map((entry) => ({
      entry,
      score: words.reduce(
        (score, word) =>
          score + (entry.title.toLocaleLowerCase().includes(word) ? 3 : 0),
        0,
      ),
    }))
    .filter(({ entry }) =>
      words.every((word) =>
        `${entry.title} ${entry.text} ${entry.kind}`
          .normalize("NFKC")
          .toLocaleLowerCase()
          .includes(word),
      ),
    )
    .sort(
      (a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title),
    )
    .map(({ entry }) => entry)
    .slice(0, 20);
}
