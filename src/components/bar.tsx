import Link from "next/link";
import { FOLDS } from "@/lib/folds";
import { site } from "@/lib/site";
import { FoldLink } from "./fold-link";

export function Bar() {
  return (
    <header className="bar">
      <Link href="/" className="me">
        {site.name}
      </Link>
      <nav>
        {FOLDS.map((f) => (
          <FoldLink key={f.id} fold={f.id} />
        ))}
      </nav>
    </header>
  );
}
