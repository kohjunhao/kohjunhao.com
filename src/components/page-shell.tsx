import { TopBar } from "./top-bar";

export function PageShell({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <>
      <TopBar />
      <div className="v3-rule" aria-hidden />
      <div className="v3-frame">
        <div className={wide ? "mx-auto w-full max-w-7xl" : "mx-auto w-full max-w-4xl"}>
          <main id="main" className="py-14">
            {children}
          </main>
        </div>
      </div>
      <div className="v3-rule" aria-hidden />
    </>
  );
}
