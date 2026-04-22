import { TopBar } from "./nav";
import { StatusFooter } from "./status-footer";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 sm:px-10">
      <TopBar />
      <main id="main">{children}</main>
      <StatusFooter />
    </div>
  );
}
