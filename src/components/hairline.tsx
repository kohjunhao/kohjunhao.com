import { SelfDrawingRule } from "./reveal";

export function Hairline({
  className = "",
  animated = true,
  delay = 0,
}: {
  className?: string;
  animated?: boolean;
  delay?: number;
}) {
  if (!animated) {
    return <div className={`hairline ${className}`} aria-hidden />;
  }
  return <SelfDrawingRule className={className} delay={delay} />;
}
