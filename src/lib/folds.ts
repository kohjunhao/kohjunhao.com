/** The home page's sections. Each nav link opens and scrolls to one; other pages link to `/#id`. */
export const FOLDS = [
  { id: "log", name: "Log" },
  { id: "portfolio", name: "Portfolio" },
  { id: "shelf", name: "Shelf" },
  { id: "writing", name: "Writing" },
  { id: "contact", name: "Contact" },
] as const;

export type FoldId = (typeof FOLDS)[number]["id"];

export const foldName = (id: FoldId) => FOLDS.find((f) => f.id === id)!.name;
