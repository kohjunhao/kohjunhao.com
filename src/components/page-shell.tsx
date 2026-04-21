import { TopBar, SiteNav } from "./nav";
import { StatusFooter } from "./status-footer";

export function PageShell({
  children,
  showNav = true,
}: {
  children: React.ReactNode;
  showNav?: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 sm:px-10">
      <TopBar />
      {showNav && <SiteNav />}
      <main>{children}</main>
      <StatusFooter />
    </div>
  );
}
