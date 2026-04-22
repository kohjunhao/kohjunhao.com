/* Card, Chip, basic visual atoms */

const SUIT_GLYPH = { S: '♠', H: '♥', D: '♦', C: '♣' };
const SUIT_COLOR = { S: 'suit-black', H: 'suit-red', D: 'suit-red', C: 'suit-black' };

function PlayingCard({ card, faceDown, style, dealIndex = 0, small = false, variant = 'classic' }) {
  if (faceDown) {
    return (
      <div
        className={`playing-card back card-anim`}
        style={{
          animationDelay: `${dealIndex * 90}ms`,
          '--fx': '-220px', '--fy': '-340px', '--fr': '-16deg',
          width: small ? 62 : 92,
          height: small ? 88 : 130,
          ...style,
        }}
      />
    );
  }
  const colorClass = SUIT_COLOR[card.s];
  const rankDisplay = card.r === 'T' ? '10' : card.r;
  return (
    <div
      className={`playing-card card-anim style-${variant}`}
      style={{
        animationDelay: `${dealIndex * 90}ms`,
        '--fx': '-220px', '--fy': '-340px', '--fr': '-10deg',
        width: small ? 62 : 92,
        height: small ? 88 : 130,
        ...style,
      }}
    >
      <div className={`corner tl ${colorClass}`}>
        <div className="r" style={{ fontSize: small ? 13 : 18 }}>{rankDisplay}</div>
        <div className="s" style={{ fontSize: small ? 10 : 13 }}>{SUIT_GLYPH[card.s]}</div>
      </div>
      <div className={`center ${colorClass}`} style={{ fontSize: small ? 30 : (variant === 'mono' ? 56 : 50) }}>
        {SUIT_GLYPH[card.s]}
      </div>
      <div className={`corner br ${colorClass}`}>
        <div className="r" style={{ fontSize: small ? 13 : 18 }}>{rankDisplay}</div>
        <div className="s" style={{ fontSize: small ? 10 : 13 }}>{SUIT_GLYPH[card.s]}</div>
      </div>
    </div>
  );
}

function CardSlot({ children, style }) {
  return <div className="card-slot" style={{ position: 'relative', ...style }}>{children}</div>;
}

function StrategyHint({ action, compact }) {
  if (!action) return null;
  const label = ACTION_LABEL[action] || action;
  const color = action === 'H' ? 'var(--green)' :
                action === 'S' ? 'var(--red)' :
                action === 'D' || action === 'Ds' ? 'var(--amber)' :
                action === 'P' ? 'var(--violet)' :
                action.startsWith('R') ? 'var(--cyan)' :
                'var(--ink-1)';
  return (
    <div className="fade-up" style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 9px',
      borderRadius: 999,
      background: 'rgba(10,14,20,0.72)',
      backdropFilter: 'blur(8px)',
      border: `1px solid ${color}`,
      boxShadow: `0 0 14px ${color.replace(')', ' / 0.25)').replace('var(--', 'oklch(from var(--').replace(/$/, '')}`,
      fontSize: compact ? 9 : 10,
      fontFamily: 'JetBrains Mono, monospace',
      fontWeight: 600,
      letterSpacing: '0.12em',
      color,
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 4, height: 4, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
      {label}
    </div>
  );
}

function Hand({ cards, dealerHoleHidden, small, result, label, value, active, doubled, strategy, soft, cardVariant }) {
  // cards: array of card objects. If dealerHoleHidden, second card rendered face down.
  // result: 'win' | 'loss' | 'push' | 'bust' | 'bj' | null
  const resultLabel = {
    win: 'WIN', loss: 'LOSS', push: 'PUSH', bust: 'BUST', bj: 'BLACKJACK', surrender: 'SURRENDER',
  }[result];
  const resultClass = {
    win: 'result-win', loss: 'result-loss', push: 'result-push',
    bust: 'result-bust', bj: 'result-bj', surrender: 'result-surrender',
  }[result];

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      {result && <div className={`result-badge ${resultClass}`}>{resultLabel}</div>}
      <div className="hand-row" style={{
        padding: active ? '6px' : '6px',
        borderRadius: 14,
        background: active ? 'radial-gradient(ellipse at center, oklch(0.78 0.18 155 / 0.12), transparent 70%)' : 'transparent',
        transition: 'background 200ms ease',
      }}>
        {cards.map((c, i) => (
          <CardSlot key={c?.id || i} style={{ zIndex: i }}>
            <PlayingCard
              card={c}
              faceDown={dealerHoleHidden && i === 1}
              dealIndex={i}
              small={small}
              variant={cardVariant}
            />
          </CardSlot>
        ))}
      </div>
      {label && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {typeof value === 'number' && (
              <div className="mono" style={{
                fontSize: 13,
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 7,
                background: active ? 'var(--green)' : 'var(--bg-2)',
                color: active ? '#041009' : 'var(--ink-0)',
                border: active ? '1px solid oklch(0.52 0.15 155)' : '1px solid var(--line)',
                minWidth: 32,
                textAlign: 'center',
                boxShadow: active ? '0 0 18px var(--green-glow)' : 'none',
                letterSpacing: '-0.02em',
              }}>
                {value}{soft ? ' ·' : ''}
              </div>
            )}
            {doubled && <div className="pill" style={{ fontSize: 9, padding: '2px 7px', fontWeight: 700 }}>2×</div>}
            {soft && <span className="label-micro" style={{ fontSize: 9, color: 'var(--ink-3)' }}>SOFT</span>}
          </div>
          {active && strategy && <StrategyHint action={strategy} />}
        </div>
      )}
    </div>
  );
}

function Chip({ value, size = 34, onClick, disabled, label, variant = 'casino' }) {
  let bg, text, edge;
  if (variant === 'mono') {
    const tier = value >= 1000 ? 4 : value >= 500 ? 3 : value >= 100 ? 2 : value >= 25 ? 1 : 0;
    const shades = ['#2a3040', '#3a4052', '#4a5166', '#5c6479', '#7b8396'];
    bg = shades[tier]; edge = '#0f141c'; text = '#f4f7fc';
  } else if (variant === 'neon') {
    const hues = [240, 200, 155, 75, 300];
    const tier = value >= 1000 ? 4 : value >= 500 ? 3 : value >= 100 ? 2 : value >= 25 ? 1 : 0;
    bg = `oklch(0.5 0.14 ${hues[tier]})`;
    edge = `oklch(0.75 0.18 ${hues[tier]})`;
    text = '#fff';
  } else {
    if (value >= 1000) { bg = 'oklch(0.6 0.17 295)'; edge = 'oklch(0.4 0.15 295)'; text = '#fff'; }
    else if (value >= 500) { bg = 'oklch(0.7 0.18 75)'; edge = 'oklch(0.5 0.14 75)'; text = '#1a0e00'; }
    else if (value >= 100) { bg = 'oklch(0.7 0.17 25)'; edge = 'oklch(0.45 0.15 25)'; text = '#fff'; }
    else if (value >= 25) { bg = 'oklch(0.7 0.17 155)'; edge = 'oklch(0.45 0.14 155)'; text = '#031108'; }
    else { bg = '#2a3546'; edge = '#1a2230'; text = '#d6dde8'; }
  }
  const borderStyle = variant === 'neon' ? `2px solid ${edge}` : `2px dashed ${edge}`;
  const boxShadow = variant === 'neon'
    ? `0 0 12px ${edge}, 0 8px 20px rgba(0,0,0,0.55), 0 0 0 2px rgba(0,0,0,0.3) inset`
    : '0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 20px rgba(0,0,0,0.55), 0 0 0 2px rgba(0,0,0,0.25) inset';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        position: 'relative',
        width: size, height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, ${bg} 0%, ${bg} 40%, ${edge} 100%)`,
        border: borderStyle,
        color: text,
        fontFamily: 'JetBrains Mono, monospace',
        fontWeight: 700,
        fontSize: size >= 36 ? 11 : 9,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: onClick && !disabled ? 'pointer' : 'default',
        boxShadow,
        opacity: disabled ? 0.4 : 1,
        transition: 'transform 100ms ease',
      }}
      onMouseEnter={e => { if (onClick && !disabled) e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
    >
      {label ?? formatChip(value)}
    </button>
  );
}

function formatChip(v) {
  if (v >= 1000) return `${(v/1000).toFixed(v % 1000 === 0 ? 0 : 1)}K`;
  return String(v);
}

function formatMoney(v, opts = {}) {
  const sign = v < 0 ? '-' : opts.plus && v > 0 ? '+' : '';
  const abs = Math.abs(v);
  let body;
  if (abs >= 1_000_000) body = (abs/1_000_000).toFixed(2) + 'M';
  else if (abs >= 10_000) body = Math.round(abs).toLocaleString('en-US');
  else if (abs >= 1) body = abs.toLocaleString('en-US', { maximumFractionDigits: 2 });
  else body = abs.toFixed(2);
  return `${sign}$${body}`;
}

function ChipStack({ amount, max = 8, variant = 'casino' }) {
  if (!amount) return null;
  const denoms = [1000, 500, 100, 25, 5, 1];
  const out = [];
  let rem = amount;
  for (const d of denoms) {
    while (rem >= d && out.length < max) {
      out.push(d);
      rem -= d;
    }
  }
  return (
    <div style={{ position: 'relative', width: 36, height: 36 + out.length * 3 }}>
      {out.map((d, i) => (
        <div key={i} className="chip-pop" style={{
          position: 'absolute',
          bottom: i * 3,
          left: 0,
          animationDelay: `${i * 40}ms`,
        }}>
          <Chip value={d} size={34} variant={variant} />
        </div>
      ))}
    </div>
  );
}

function AnimatedNumber({ value, format = (v) => v, className = '', style }) {
  const [display, setDisplay] = React.useState(value);
  const prev = React.useRef(value);
  React.useEffect(() => {
    if (prev.current === value) return;
    const start = prev.current;
    const delta = value - start;
    const duration = 420;
    const t0 = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(start + delta * e);
      if (p < 1) raf = requestAnimationFrame(tick);
      else { setDisplay(value); prev.current = value; }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span className={className} style={style}>{format(display)}</span>;
}

Object.assign(window, {
  PlayingCard, CardSlot, Hand, Chip, ChipStack, StrategyHint,
  formatChip, formatMoney, AnimatedNumber,
  SUIT_GLYPH, SUIT_COLOR,
});
