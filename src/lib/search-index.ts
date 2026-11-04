import {
  getProjects,
  getPosts,
  getAllWriting,
  getVaultItems,
  chapterSlug,
} from "./content";
export interface SearchEntry {
  title: string;
  text: string;
  kind: string;
  href: string;
}
const plain = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#*`_\[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const strings = (value: unknown): string =>
  typeof value === "string"
    ? value
    : Array.isArray(value)
      ? value.map(strings).join(" ")
      : value && typeof value === "object"
        ? Object.values(value).map(strings).join(" ")
        : "";
export async function searchIndex(): Promise<SearchEntry[]> {
  const [projects, posts, writing, vault] = await Promise.all([
    getProjects(),
    getPosts(),
    getAllWriting(),
    getVaultItems(),
  ]);
  const live = <T extends { data: { draft: boolean; demo: boolean } }>(
    rows: T[],
  ) => rows.filter((e) => !e.data.draft && !e.data.demo);
  return [
    ...live(projects).map((e) => ({
      title: e.data.title,
      text: plain(
        `${e.data.summary} ${strings(e.data.caseStudy)} ${e.body ?? ""}`,
      ),
      kind: "Project",
      href: `/projects/${e.id}/`,
    })),
    ...live(posts).map((e) => ({
      title: e.data.title,
      text: plain(`${e.data.description} ${e.body ?? ""}`),
      kind: "Blog",
      href: `/blog/${e.id}/`,
    })),
    ...live(writing).map((e) => ({
      title: e.data.title,
      text: plain(`${e.data.description} ${e.body ?? ""}`),
      kind: "Writing",
      href:
        e.data.chapter !== undefined
          ? `/writing/book/${e.data.book}/chapter/${chapterSlug(e)}/`
          : e.data.kind === "book"
            ? `/writing/book/${e.data.book}/`
            : `/writing/${e.id}/`,
    })),
    ...live(vault).map((e) => ({
      title: e.data.title,
      text: plain(`${e.data.description} ${e.body ?? ""}`),
      kind: "Vault",
      href: `/vault/category/${e.data.category}/`,
    })),
  ];
}
