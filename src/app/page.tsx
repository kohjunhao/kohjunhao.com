import { PageShell } from "@/components/page-shell";
import { Totem } from "@/components/totem";
import { HomeLedger, type HomeLedgerEntry } from "@/components/home-ledger";
import { RevealStack, RevealChild } from "@/components/reveal";
import { articles } from "@/lib/articles";
import {
  investments,
  books,
  movies,
  games,
  projects,
  curated,
} from "@/lib/stock";

export default function Home() {
  const count = (n: number) => (n > 0 ? String(n).padStart(2, "0") : "·");

  const entries: HomeLedgerEntry[] = [
    { index: "01", label: "Articles", note: "Long-form DeFi research", count: count(articles.length), href: "/articles" },
    { index: "02", label: "Projects", note: "What I'm building", count: count(projects.length), href: "/projects" },
    { index: "03", label: "Investments", note: "Angel portfolio", count: count(investments.length), href: "/investments" },
    { index: "04", label: "Books", note: "A public shelf", count: count(books.length), href: "/books" },
    { index: "05", label: "Movies", note: "A public film log", count: count(movies.length), href: "/movies" },
    { index: "06", label: "Games", note: "Steam · Switch · PS5", count: count(games.length), href: "/games" },
    { index: "07", label: "Curated", note: "Objects worth keeping", count: count(curated.length), href: "/curated" },
    { index: "08", label: "Design", note: "The system, in-product", count: "·", href: "/design" },
  ];

  return (
    <PageShell>
      <section className="pb-10 pt-2">
        <div className="grid gap-10 md:gap-14 lg:gap-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center">
          {/* LEFT — totem + tagline */}
          <RevealStack className="flex flex-col items-center md:items-center">
            <RevealChild>
              <Totem cols={30} rows={24} cellW={10} cellH={12} />
            </RevealChild>
            <RevealChild className="mt-8 w-full max-w-[22rem]">
              <p className="font-serif italic text-[clamp(1.55rem,3vw,1.9rem)] leading-[1.25] tracking-[-0.01em] text-ink text-center md:text-left">
                Reading, writing,
                <br />
                writing cheques.
              </p>
            </RevealChild>
          </RevealStack>

          {/* RIGHT — the ledger */}
          <div className="min-w-0">
            <HomeLedger entries={entries} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
