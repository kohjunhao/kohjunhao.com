import { PageShell } from "@/components/page-shell";
import { AsciiHero } from "@/components/ascii-hero";
import { HomeLedger, type HomeLedgerEntry } from "@/components/home-ledger";
import { RevealStack, RevealChild } from "@/components/reveal";
import { articles } from "@/lib/articles";
import { investments, books, movies, games, blogPosts } from "@/lib/stock";

export default function Home() {
  const count = (n: number) => (n > 0 ? String(n).padStart(2, "0") : "·");

  const entries: HomeLedgerEntry[] = [
    {
      index: "01",
      label: "Articles",
      note: "Long-form DeFi research",
      count: count(articles.length),
      href: "/articles",
    },
    {
      index: "02",
      label: "Blog",
      note: "Public notes",
      count: count(blogPosts.length),
      href: "/blog",
    },
    {
      index: "03",
      label: "Games",
      note: "What I'm playing",
      count: count(games.length),
      href: "/games",
    },
    {
      index: "04",
      label: "Investments",
      note: "Angel portfolio",
      count: count(investments.length),
      href: "/investments",
    },
    {
      index: "05",
      label: "Books",
      note: "A public shelf",
      count: count(books.length),
      href: "/books",
    },
    {
      index: "06",
      label: "Movies",
      note: "A public film log",
      count: count(movies.length),
      href: "/movies",
    },
    {
      index: "07",
      label: "Resume",
      note: "Background",
      count: "·",
      href: "/resume",
    },
  ];

  return (
    <PageShell>
      {/* HeroSplitTotem — totem + tagline on the left, 7-row ledger on the right */}
      <section className="pb-14 pt-4">
        <div className="grid gap-10 md:gap-14 lg:gap-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center">
          {/* LEFT — totem + tagline */}
          <RevealStack className="flex flex-col items-center md:items-start">
            <RevealChild className="self-center">
              <AsciiHero size={240} />
            </RevealChild>
            <RevealChild className="mt-8 w-full">
              <p className="font-serif italic text-[clamp(1.45rem,3vw,1.75rem)] leading-[1.3] tracking-[-0.01em] text-ink text-center md:text-left">
                Reading, writing,
                <br />
                writing cheques.
              </p>
            </RevealChild>
            <RevealChild className="mt-4">
              <div className="mono text-[0.62rem] tracking-[0.24em] uppercase text-muted">
                figure i · totem
              </div>
            </RevealChild>
          </RevealStack>

          {/* RIGHT — ledger */}
          <div className="min-w-0">
            <HomeLedger entries={entries} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
