import { TopBar } from "./nav";
import { StatusFooter } from "./status-footer";

export function PageShell({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={
        wide
          ? "mx-auto w-full max-w-7xl px-6 sm:px-10"
          : "mx-auto w-full max-w-4xl px-6 sm:px-10"
      }
    >
      <TopBar />
      <main id="main">{children}</main>
      <StatusFooter />
    </div>
  );
}
