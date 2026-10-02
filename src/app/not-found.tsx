import Link from "next/link";
import { TopBar } from "@/components/top-bar";

export default function NotFound() {
  return (
    <>
      <TopBar />
      <div className="v3-rule" aria-hidden />
      <main id="main" className="v3-frame v3-intro">
        <div>
          <h1 className="v3-label">Not found</h1>
          <p className="v3-line">Nothing at this address.</p>
          <p className="v3-facts">
            The page may have moved when the site was rebuilt. <Link href="/">Start from the log</Link>.
          </p>
        </div>
      </main>
      <div className="v3-rule" aria-hidden />
    </>
  );
}
