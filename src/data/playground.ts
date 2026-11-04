/** Fictional interface studies, not shipped projects or personal achievements. */
export const experiments = [
  {
    id: "marginalia",
    number: "01",
    name: "Marginalia",
    category: "Reading interface",
    style: "paper",
    headline: "A little space\nto get lost in a book.",
    description:
      "A fictional reading app concept: generous margins, quiet controls and a place for the lines worth keeping.",
    detail:
      "Try the reading-size controls below. This study explores hierarchy and reading comfort; it is not a released product.",
  },
  {
    id: "commonplace",
    number: "02",
    name: "Commonplace",
    category: "Knowledge garden",
    style: "garden",
    headline: "Collect the dots.\nFind the connections.",
    description:
      "A fictional collection of notes, ideas and references, arranged like a small, connected garden.",
    detail:
      "The connected cards are an original CSS illustration, not a screenshot of a working app. No accounts or saved collections are available.",
  },
] as const;

export const sampleNote = {
  title: "A quieter corner of the internet",
  intro:
    "A sample essay about making room for attention. Written to demonstrate typography, not to describe a personal experience.",
  paragraphs: [
    "A page can be full of things and still leave room to breathe. A generous margin, a clear heading and a link that says where it goes are small decisions. Together, they make the next step feel easier.",
    "Imagine a reading room with one comfortable chair. Nothing flashes in the corner. There is no countdown, no insistence that you hurry. The words can simply be words, and the reader can set the pace.",
    "That is the idea behind this little interface study: fewer competing signals, more useful detail. Not empty space for its own sake, but space that helps the important things belong together.",
  ],
};
