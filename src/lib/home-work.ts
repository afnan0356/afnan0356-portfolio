/** A named primary feature must never wrap a multi-project list. No fixture
 * content is introduced into collections to exercise the secondary branch. */
export function selectHomeWork<
  T extends { id: string; data: { featured: boolean } },
>(projects: T[]) {
  const primary =
    projects.find((project) => project.id === "nyayota") ??
    projects.find((project) => project.data.featured) ??
    projects[0];
  return {
    primary,
    secondary: projects.filter(
      (project) => project.id !== primary?.id && project.data.featured,
    ),
  };
}
