import { Activity } from "@/components/activity";
import { Departures } from "@/components/departures";
import { Hero } from "@/components/hero";
import { LogFeed } from "@/components/log-feed";
import { ShelfStrip } from "@/components/shelf-strip";
import { log } from "@/content/log";
import { buildCalendar } from "@/lib/calendar";
import { investments } from "@/lib/stock";

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero latest={log[0]} companies={investments.length} />
        <Departures entries={log} />

        <div className="v3-rule" aria-hidden />
        <Activity calendar={buildCalendar()} shipped={log.length} />

        <div className="v3-rule" aria-hidden />
        <ShelfStrip />

        <div className="v3-rule" aria-hidden />
        <LogFeed entries={log} />
      </main>

      <div className="v3-rule" aria-hidden />
    </>
  );
}
