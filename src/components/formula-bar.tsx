import type { ReactNode } from "react";

export function FormulaBar({
  nameBox,
  text,
  finding = false,
  children,
}: {
  nameBox: string;
  text: string;
  finding?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={finding ? "fxbar finding" : "fxbar"}>
      <div className="namebox">{nameBox}</div>
      <div className="fx" aria-hidden="true">
        fx
      </div>
      <div className="fxtext" aria-live="polite">
        {text}
      </div>
      {children}
    </div>
  );
}
