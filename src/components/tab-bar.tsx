import Link from "next/link";
import type { ReactNode } from "react";
import { int } from "@/sheet/format";
import type { Tab, TabId } from "@/sheet/tabs";

export function TabBar({ tabs, active, children }: { tabs: Tab[]; active?: TabId; children?: ReactNode }) {
  return (
    <footer className="tabbar">
      <nav className="tabs" aria-label="Sheets">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={tab.id === active ? "tab on" : "tab"}
            aria-current={tab.id === active ? "page" : undefined}
          >
            {tab.name}
            {tab.count !== undefined && <small>{int(tab.count)}</small>}
          </Link>
        ))}
      </nav>
      {children && <div className="stats">{children}</div>}
    </footer>
  );
}
