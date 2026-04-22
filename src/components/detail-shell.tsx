/**
 * Shared presentation for entity detail bodies. Eyebrow / meta / title /
 * subtitle / body block. Works inside the Modal (intercepted) OR as a
 * full-page surface.
 */
export function DetailShell({
  eyebrow,
  meta,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  meta?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <article className="w-full">
      {eyebrow && (
        <div className="mono text-[0.6rem] tracking-[0.24em] uppercase text-accent mb-3">
          {eyebrow}
        </div>
      )}
      <h1 className="font-serif text-[clamp(1.6rem,3.5vw,2rem)] font-medium tracking-[-0.015em] leading-[1.18] text-ink">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 font-serif italic text-[1rem] text-muted leading-[1.45]">
          {subtitle}
        </p>
      )}
      {meta && (
        <div className="mt-4 mono text-[0.6rem] tracking-[0.22em] uppercase text-muted">
          {meta}
        </div>
      )}
      <div className="my-6 h-px bg-rule" aria-hidden />
      {children}
    </article>
  );
}

export function DetailEmpty({ prompt }: { prompt: string }) {
  return (
    <div className="py-14 px-4 text-center">
      <div className="mono text-[0.62rem] tracking-[0.22em] uppercase text-muted">
        notes
      </div>
      <div className="font-serif italic text-[1.1rem] text-muted mt-4">
        ─ no notes yet ─
      </div>
      <p className="font-serif text-[0.9rem] text-muted mt-2 max-w-sm mx-auto">
        {prompt}
      </p>
    </div>
  );
}

export function DetailProse({ text }: { text: string }) {
  return (
    <p className="font-serif text-[1.02rem] leading-[1.7] text-ink italic border-l-2 border-accent pl-5">
      {text}
    </p>
  );
}
