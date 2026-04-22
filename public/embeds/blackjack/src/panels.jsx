/* Header, history panel, HUD, buy-in splash */

function Header({ balance, sessionPnL, sessionHands, onToggleHistory, historyOpen, onReset, shoeRemaining, shoeSize, numDecks, onChangeDecks, onShowInfo }) {
  const [deckMenuOpen, setDeckMenuOpen] = React.useState(false);
  const pct = (shoeRemaining / shoeSize) * 100;
  return (
    <div style={{
      position: 'relative',
      height: 60,
      borderBottom: '1px solid var(--line)',
      background: 'linear-gradient(180deg, var(--bg-1) 0%, rgba(12,16,22,0.92) 100%)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, oklch(0.82 0.18 155) 0%, oklch(0.52 0.14 155) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 13, color: '#031108',
          boxShadow: '0 0 24px var(--green-glow), 0 1px 0 rgba(255,255,255,0.3) inset',
          fontFamily: 'JetBrains Mono, monospace',
          letterSpacing: '-0.03em',
        }}>21</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.015em' }}>Blackjack</div>
          <div className="mono" style={{ fontSize: 9.5, color: 'var(--ink-3)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Simulator
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line)', borderRadius: 11, background: 'var(--bg-2)', boxShadow: '0 1px 0 rgba(255,255,255,0.03) inset' }}>
        <div className="hud-stat">
          <div className="label-micro">Balance</div>
          <div className="mono" style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>
            <AnimatedNumber value={balance} format={formatMoney} />
          </div>
        </div>
        <div className="hud-stat">
          <div className="label-micro">Session P&L</div>
          <div className="mono" style={{
            fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em',
            color: sessionPnL > 0 ? 'var(--green)' : sessionPnL < 0 ? 'var(--red)' : 'var(--ink-1)',
          }}>
            <AnimatedNumber value={sessionPnL} format={(v) => formatMoney(v, { plus: true })} />
          </div>
        </div>
        <div className="hud-stat">
          <div className="label-micro">Hands</div>
          <div className="mono" style={{ fontWeight: 700, fontSize: 16 }}>{sessionHands}</div>
        </div>
        <div className="hud-stat" style={{ position: 'relative' }}>
          <div className="label-micro">Shoe · {numDecks}D</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 72, height: 5, background: 'var(--bg-3)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
              <div style={{
                width: `${pct}%`, height: '100%',
                background: pct > 30 ? 'linear-gradient(90deg, var(--green-dim), var(--green))' : 'linear-gradient(90deg, var(--amber-dim), var(--amber))',
                transition: 'width 400ms ease',
                boxShadow: `0 0 8px ${pct > 30 ? 'var(--green-glow)' : 'var(--amber)'}`,
              }} />
            </div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-2)', fontWeight: 600, minWidth: 26, textAlign: 'right' }}>
              {Math.round(pct)}%
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setDeckMenuOpen(v => !v)} title="Change shoe size">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="4" width="9" height="10" rx="1.5" /><rect x="5" y="2" width="9" height="10" rx="1.5" />
            </svg>
            <span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{numDecks}D</span>
          </button>
          {deckMenuOpen && (
            <div className="panel fade-up" style={{ position: 'absolute', top: 36, right: 0, zIndex: 40, padding: 8, minWidth: 160, boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
              <div className="label-micro" style={{ padding: '4px 8px 6px' }}>Decks in shoe</div>
              {[1, 2, 4, 6, 8].map(n => (
                <div
                  key={n}
                  onClick={() => { onChangeDecks(n); setDeckMenuOpen(false); }}
                  style={{
                    padding: '7px 10px', borderRadius: 6, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: numDecks === n ? 'var(--bg-3)' : 'transparent',
                    fontSize: 12,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-3)'}
                  onMouseLeave={e => e.currentTarget.style.background = numDecks === n ? 'var(--bg-3)' : 'transparent'}
                >
                  <span className="mono" style={{ fontWeight: 600 }}>{n} deck{n > 1 ? 's' : ''}</span>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{n*52}</span>
                </div>
              ))}
              <div style={{ fontSize: 10, color: 'var(--ink-3)', padding: '8px 8px 4px', borderTop: '1px dashed var(--line)', marginTop: 6 }}>
                Changing decks reshuffles the shoe
              </div>
            </div>
          )}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onReset} title="Reset session">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M2 8a6 6 0 1 0 6-6" strokeLinecap="round" /><path d="M2 3v4h4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Reset
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onShowInfo} title="Rules &amp; house edge">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="8" cy="8" r="6.5" /><path d="M8 7v4" strokeLinecap="round" /><circle cx="8" cy="4.8" r="0.6" fill="currentColor" stroke="none" />
          </svg>
          Info
        </button>
        <button
          className={`btn btn-sm ${historyOpen ? '' : 'btn-ghost'}`}
          onClick={onToggleHistory}
          style={historyOpen ? { background: 'var(--bg-3)', borderColor: 'var(--line-2)' } : null}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 2" strokeLinecap="round" />
          </svg>
          History
        </button>
      </div>
    </div>
  );
}

function HistoryPanel({ open, onClose, history, sessionPnL, onClear }) {
  if (!open) return null;

  // aggregate dealer last 10
  const dealerLast10 = history.slice(0, 10).map(h => h.dealerTotal);
  const winCount = history.filter(h => h.totalNet > 0).length;
  const lossCount = history.filter(h => h.totalNet < 0).length;
  const pushCount = history.filter(h => h.totalNet === 0).length;

  // chart data: last 20 net
  const chartData = history.slice(0, 20).reverse();
  const maxAbs = Math.max(1, ...chartData.map(h => Math.abs(h.totalNet)));

  return (
    <div className="slide-in" style={{
      position: 'absolute',
      top: 56, right: 0, bottom: 0,
      width: 360,
      background: 'var(--bg-1)',
      borderLeft: '1px solid var(--line)',
      display: 'flex', flexDirection: 'column',
      zIndex: 50,
    }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Session History</div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {history.length} Hands · {formatMoney(sessionPnL, { plus: true })}
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-xs btn-ghost" onClick={onClear}>Clear</button>
        <button className="btn btn-xs btn-ghost" style={{ marginLeft: 6 }} onClick={onClose}>
          <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.4">
            <path d="M1 1L9 9M9 1L1 9" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* stats */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <StatCell label="Wins" value={winCount} tone="green" />
        <StatCell label="Losses" value={lossCount} tone="red" />
        <StatCell label="Pushes" value={pushCount} tone="neutral" />
      </div>

      {/* Win rate bar */}
      {history.length > 0 && (
        <div style={{ padding: '0 16px 14px', borderBottom: '1px solid var(--line)' }}>
          <div className="label-micro" style={{ marginBottom: 6 }}>Win Rate</div>
          <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', background: 'var(--bg-2)' }}>
            <div style={{ width: `${(winCount/history.length)*100}%`, background: 'var(--green)' }} />
            <div style={{ width: `${(pushCount/history.length)*100}%`, background: 'var(--ink-3)' }} />
            <div style={{ width: `${(lossCount/history.length)*100}%`, background: 'var(--red)' }} />
          </div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--ink-2)', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
            <span>{((winCount/history.length)*100).toFixed(1)}% W</span>
            <span>{((pushCount/history.length)*100).toFixed(1)}% P</span>
            <span>{((lossCount/history.length)*100).toFixed(1)}% L</span>
          </div>
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>
          <div className="label-micro" style={{ marginBottom: 8 }}>Net per hand (last 20)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 40 }}>
            {chartData.map((h, i) => {
              const hgt = (Math.abs(h.totalNet) / maxAbs) * 18;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  {h.totalNet > 0 ? (
                    <>
                      <div className="chart-bar" style={{ width: '100%', height: hgt || 1 }} />
                      <div style={{ width: '100%', height: 18 }} />
                    </>
                  ) : h.totalNet < 0 ? (
                    <>
                      <div style={{ width: '100%', height: 18 }} />
                      <div className="chart-bar loss" style={{ width: '100%', height: hgt || 1, borderRadius: '0 0 2px 2px' }} />
                    </>
                  ) : (
                    <div style={{ width: '100%', height: 2, background: 'var(--ink-3)' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dealer last 10 */}
      {dealerLast10.length > 0 && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>
          <div className="label-micro" style={{ marginBottom: 8 }}>Dealer — last 10</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {dealerLast10.map((d, i) => (
              <div key={i} className="mono" style={{
                width: 26, height: 26, borderRadius: 5,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600,
                background: d > 21 ? 'oklch(0.35 0.14 25)' : 'var(--bg-2)',
                border: '1px solid var(--line)',
                color: d > 21 ? '#ffb3ab' : 'var(--ink-1)',
              }}>
                {d > 21 ? 'X' : d}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {history.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--ink-3)', fontSize: 12 }}>
            No hands played yet
          </div>
        )}
        {history.map((h, i) => <HistoryRow key={h.id} hand={h} />)}
      </div>
    </div>
  );
}

function StatCell({ label, value, tone }) {
  const color = tone === 'green' ? 'var(--green)' : tone === 'red' ? 'var(--red)' : 'var(--ink-1)';
  return (
    <div style={{
      padding: '10px 12px',
      background: 'var(--bg-2)',
      border: '1px solid var(--line)',
      borderRadius: 9,
    }}>
      <div className="label-micro">{label}</div>
      <div className="mono" style={{ fontWeight: 600, fontSize: 18, color }}>{value}</div>
    </div>
  );
}

function HistoryRow({ hand }) {
  const winColor = hand.totalNet > 0 ? 'var(--green)' : hand.totalNet < 0 ? 'var(--red)' : 'var(--ink-2)';
  const time = new Date(hand.at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  return (
    <div style={{
      padding: '10px 16px',
      borderBottom: '1px solid var(--line)',
      display: 'flex', alignItems: 'center', gap: 10,
      fontSize: 12,
    }}>
      <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', width: 36 }}>{time}</div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {hand.hands.map((h, i) => (
          <div key={i} className="mono" style={{
            padding: '2px 6px',
            borderRadius: 4,
            background: h.outcome === 'bj' ? 'oklch(0.4 0.12 80)' :
                        h.outcome === 'win' ? 'oklch(0.38 0.1 155)' :
                        h.outcome === 'bust' || h.outcome === 'loss' ? 'oklch(0.35 0.12 25)' :
                        'var(--bg-3)',
            color: h.outcome === 'bj' ? 'oklch(0.9 0.1 80)' :
                   h.outcome === 'win' ? 'oklch(0.9 0.12 155)' :
                   h.outcome === 'bust' || h.outcome === 'loss' ? 'oklch(0.85 0.1 25)' :
                   'var(--ink-1)',
            fontSize: 10,
            fontWeight: 600,
          }}>
            {h.playerTotal > 21 ? 'BUST' : h.playerTotal}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
        <div className="mono" style={{ color: 'var(--ink-3)', fontSize: 10 }}>
          vs {hand.dealerTotal > 21 ? 'BUST' : hand.dealerTotal}
        </div>
        <div className="mono" style={{ fontWeight: 600, color: winColor, minWidth: 60, textAlign: 'right' }}>
          {formatMoney(hand.totalNet, { plus: true })}
        </div>
      </div>
    </div>
  );
}

function BuyInSplash({ onBuyIn }) {
  const [custom, setCustom] = React.useState('');
  const presets = [1000, 5000, 25000, 100000];

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(6, 9, 13, 0.7)',
      backdropFilter: 'blur(10px)',
      zIndex: 500,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div className="panel fade-up" style={{
        width: 480, padding: 32,
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: 'linear-gradient(135deg, oklch(0.78 0.18 155), oklch(0.55 0.14 155))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 14, color: '#031108',
          }}>
            <span className="mono">21</span>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>Buy In</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Select starting capital
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {presets.map(p => (
            <button
              key={p}
              className="btn btn-lg"
              onClick={() => onBuyIn(p)}
              style={{ justifyContent: 'space-between' }}
            >
              <span className="mono" style={{ fontWeight: 600, fontSize: 16 }}>{formatMoney(p)}</span>
              <span className="label-micro">
                {p === 1000 ? 'CASUAL' : p === 5000 ? 'STANDARD' : p === 25000 ? 'HIGH' : 'WHALE'}
              </span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span className="mono" style={{ position: 'absolute', left: 10, top: 10, color: 'var(--ink-3)', pointerEvents: 'none' }}>$</span>
            <input
              type="number"
              placeholder="Custom amount"
              value={custom}
              onChange={e => setCustom(e.target.value)}
              style={{ width: '100%', paddingLeft: 22 }}
              min="100"
            />
          </div>
          <button
            className="btn btn-primary btn-lg"
            disabled={!custom || Number(custom) < 100}
            onClick={() => onBuyIn(Number(custom))}
          >
            Start
          </button>
        </div>

        <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px dashed var(--line)', display: 'flex', gap: 12, fontSize: 11, color: 'var(--ink-3)' }}>
          <div><span className="kbd">H</span> Hit</div>
          <div><span className="kbd">S</span> Stand</div>
          <div><span className="kbd">D</span> Double</div>
          <div><span className="kbd">P</span> Split</div>
          <div><span className="kbd">Space</span> Deal</div>
        </div>
      </div>
    </div>
  );
}

function HudOverlay({ bustProb, dealerUp, dealerTrend, currentHandValue }) {
  return (
    <div style={{
      position: 'absolute',
      top: 12, left: 12,
      display: 'flex', flexDirection: 'column', gap: 6,
      pointerEvents: 'none',
      fontSize: 11,
    }}>
      <div className="pill" style={{ background: 'rgba(15,20,28,0.6)', backdropFilter: 'blur(6px)' }}>
        <span className="label-micro" style={{ color: 'var(--ink-3)' }}>Bust prob</span>
        <span className="mono" style={{
          fontWeight: 600,
          color: bustProb > 0.5 ? 'var(--red)' : bustProb > 0.25 ? 'var(--amber)' : 'var(--green)',
        }}>
          {(bustProb * 100).toFixed(1)}%
        </span>
      </div>
      {dealerTrend && dealerTrend.length > 0 && (
        <div className="pill" style={{ background: 'rgba(15,20,28,0.6)', backdropFilter: 'blur(6px)' }}>
          <span className="label-micro" style={{ color: 'var(--ink-3)' }}>Dealer avg (10)</span>
          <span className="mono" style={{ fontWeight: 600 }}>
            {(dealerTrend.reduce((a,b)=>a+Math.min(b,22),0) / dealerTrend.length).toFixed(1)}
          </span>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Header, HistoryPanel, BuyInSplash, HudOverlay, InfoModal });

function InfoModal({ numDecks, dealerHitsSoft17, enableSideBets, enableSurrender, onClose }) {
  const rows = [
    { label: 'Base (6-deck, BJ pays 3:2)', bp: 54 },
    numDecks === 1 ? { label: 'Single deck', bp: -48 } :
    numDecks === 2 ? { label: 'Double deck', bp: -19 } :
    numDecks === 4 ? { label: '4-deck shoe', bp: -6 } :
    numDecks === 8 ? { label: '8-deck shoe', bp: +2 } :
    { label: '6-deck shoe', bp: 0 },
    { label: dealerHitsSoft17 ? 'Dealer hits soft 17 (H17)' : 'Dealer stands soft 17 (S17)', bp: dealerHitsSoft17 ? +22 : 0 },
    { label: 'Double after split (DAS) allowed', bp: -14 },
    enableSurrender ? { label: 'Late surrender offered', bp: -8 } : { label: 'No surrender', bp: 0 },
  ];
  const totalBp = rows.reduce((a, r) => a + r.bp, 0);
  const edgePct = (totalBp / 100).toFixed(2);
  const rtp = (100 - totalBp / 100).toFixed(2);

  const sideEdges = [
    { label: 'Perfect Pairs (6-deck)', edge: '~5.9%', rtp: '~94.1%' },
    { label: '21+3 (6-deck)', edge: '~3.2%', rtp: '~96.8%' },
    { label: 'Insurance (10-balanced shoe)', edge: '~7.4%', rtp: '~92.6%' },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(2,4,7,0.72)', backdropFilter: 'blur(6px)',
        zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fade-in 180ms ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="fade-up"
        style={{
          width: 540, maxWidth: '90vw', maxHeight: '86vh', overflow: 'auto',
          background: 'var(--bg-1)', border: '1px solid var(--line-2)', borderRadius: 16,
          boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03) inset',
        }}
      >
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Rules &amp; House Edge</div>
            <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2 }}>
              Basic-strategy player · current ruleset
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn btn-xs btn-ghost" onClick={onClose}>×</button>
        </div>

        <div style={{ padding: '16px 22px' }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 16,
            padding: '14px 16px', background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 10,
            marginBottom: 18,
          }}>
            <div>
              <div className="label-micro">House edge</div>
              <div className="mono" style={{ fontSize: 26, fontWeight: 700, color: totalBp > 30 ? 'var(--amber)' : 'var(--green)', letterSpacing: '-0.02em' }}>
                {edgePct}%
              </div>
            </div>
            <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--line)' }} />
            <div>
              <div className="label-micro">RTP</div>
              <div className="mono" style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>
                {rtp}%
              </div>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ fontSize: 11, color: 'var(--ink-3)', maxWidth: 170, textAlign: 'right', lineHeight: 1.45 }}>
              With perfect basic-strategy play on the main wager
            </div>
          </div>

          <div className="label-micro" style={{ marginBottom: 8 }}>Rule contributions</div>
          <div style={{ border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden', marginBottom: 22 }}>
            {rows.map((r, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', padding: '10px 14px',
                borderBottom: i < rows.length - 1 ? '1px solid var(--line)' : 'none',
                background: i % 2 ? 'var(--bg-1)' : 'var(--bg-2)',
              }}>
                <div style={{ fontSize: 12.5 }}>{r.label}</div>
                <div style={{ flex: 1 }} />
                <div className="mono" style={{
                  fontSize: 12, fontWeight: 600,
                  color: r.bp > 0 ? 'var(--red)' : r.bp < 0 ? 'var(--green)' : 'var(--ink-3)',
                }}>
                  {r.bp > 0 ? '+' : ''}{(r.bp / 100).toFixed(2)}%
                </div>
              </div>
            ))}
          </div>

          {enableSideBets && (
            <>
              <div className="label-micro" style={{ marginBottom: 8 }}>Side bets</div>
              <div style={{ border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden', marginBottom: 22 }}>
                {sideEdges.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', padding: '10px 14px',
                    borderBottom: i < sideEdges.length - 1 ? '1px solid var(--line)' : 'none',
                    background: i % 2 ? 'var(--bg-1)' : 'var(--bg-2)',
                  }}>
                    <div style={{ fontSize: 12.5 }}>{s.label}</div>
                    <div style={{ flex: 1 }} />
                    <div className="mono" style={{ fontSize: 11, color: 'var(--ink-2)' }}>RTP {s.rtp}</div>
                    <div className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--red)', marginLeft: 14, minWidth: 60, textAlign: 'right' }}>
                      {s.edge}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="label-micro" style={{ marginBottom: 8 }}>Payouts</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
            {[
              ['Blackjack', '3 : 2'],
              ['Winning hand', '1 : 1'],
              ['Insurance', '2 : 1'],
              ['Surrender', 'Lose ½ bet'],
              ['PP Mixed / Coloured / Perfect', '6× / 12× / 25×'],
              ['21+3 Flush / Str / 3-kind / Str. flush / Suited', '5× / 10× / 30× / 40× / 100×'],
            ].map(([k, v], i) => (
              <div key={i} style={{ padding: '8px 12px', background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 8 }}>
                <div className="label-micro" style={{ marginBottom: 2 }}>{k}</div>
                <div className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.55, padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 8, border: '1px dashed var(--line-2)' }}>
            Figures are standard industry approximations for basic-strategy play. Session results vary due to variance — track your realised RTP on the History panel.
          </div>
        </div>
      </div>
    </div>
  );
}
