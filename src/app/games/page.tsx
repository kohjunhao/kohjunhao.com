import type { Metadata } from "next";
import { Tile } from "@/components/tile";
import { TopBar } from "@/components/top-bar";
import { boardGames, byTitle, games } from "@/lib/shelf";

export const metadata: Metadata = {
  title: "Games",
  description: "The video games and board games I have played.",
};

export default function GamesPage() {
  const video = [...games].sort(byTitle);
  const board = [...boardGames].sort(byTitle);

  return (
    <>
      <TopBar />
      <div className="v3-rule" aria-hidden />

      <main id="main" className="v3-frame v3-shelf">
        <section id="video" aria-labelledby="video-head">
          <header className="v3-shelf-head">
            <h1 id="video-head" className="v3-label">
              Video games <span className="v3-row-count">{video.length}</span>
            </h1>
          </header>
          <div className="v3-wall">
            {video.map((g) => (
              <Tile key={g.slug} kind="games" slug={g.slug} title={g.title} />
            ))}
          </div>
        </section>

        <section id="board" aria-labelledby="board-head">
          <header className="v3-shelf-head">
            <h2 id="board-head" className="v3-label">
              Board games <span className="v3-row-count">{board.length}</span>
            </h2>
          </header>
          <div className="v3-wall" data-ratio="landscape">
            {board.map((g) => (
              <Tile key={g.slug} kind="boardGames" slug={g.slug} title={g.title} ratio="landscape" />
            ))}
          </div>
        </section>

        <p className="v3-credit">Covers from Wikipedia, Open Library and the Steam store</p>
      </main>

      <div className="v3-rule" aria-hidden />
    </>
  );
}
