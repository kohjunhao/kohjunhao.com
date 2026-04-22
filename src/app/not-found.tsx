import Link from "next/link";
import { HankoSeal } from "@/components/hanko-seal";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 sm:px-10 min-h-screen flex flex-col items-center justify-center text-center relative py-24">
      <HankoSeal size={128} wobble />
      <div className="h-10" />
      <h1 className="font-serif text-[clamp(1.8rem,5vw,2.5rem)] font-medium text-ink tracking-[-0.01em]">
        この道はない。
      </h1>
      <p className="font-serif italic text-[1.05rem] text-muted mt-2">
        This path does not exist.
      </p>
      <div className="h-8" />
      <Link
        href="/"
        className="group relative mono text-[0.7rem] tracking-[0.2em] uppercase text-accent active:scale-[0.96] transition-transform duration-150"
      >
        ← return to index
        <span className="absolute left-0 right-0 -bottom-1 h-px bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)]" />
      </Link>
      <div className="absolute bottom-7 mono text-[0.58rem] tracking-[0.2em] uppercase text-muted opacity-60">
        error 404 · last dispatch {site.lastUpdated}
      </div>
    </div>
  );
}
