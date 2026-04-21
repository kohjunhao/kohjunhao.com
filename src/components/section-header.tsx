import Link from "next/link";

export function SectionHeader({
  index,
  title,
  href,
  right,
}: {
  index: string;
  title: string;
  href?: string;
  right?: React.ReactNode;
}) {
  const inner = (
    <span className="flex items-baseline gap-3">
      <span className="mono text-accent text-[0.75rem] tracking-wider">
        {index} /
      </span>
      <span className="font-serif text-[1.3rem] font-medium tracking-tight">
        {title}
      </span>
    </span>
  );

  return (
    <div className="flex items-baseline justify-between gap-4">
      {href ? (
        <Link href={href} className="group hover:opacity-80 transition-opacity">
          {inner}
        </Link>
      ) : (
        inner
      )}
      {right && (
        <span className="mono text-[0.7rem] text-muted tracking-wider uppercase">
          {right}
        </span>
      )}
    </div>
  );
}
