/* Monte Carlo lab — empirical RTP + session-ruin proof.

   Auto-plays thousands of hands with flat bet + basic strategy so the real
   realized house edge can be measured against the expected ~0.5%. Second
   mode runs thousands of fixed-bankroll sessions and reports what fraction
   ever reach 2× bankroll vs go bust — the answer to "why haven't I hit $2k
   in 10 tries". */

const { useState: useLS, useEffect: useLE } = React;

// ─────────────────────────────────────────────────────────────
// Core sim — reuses engine functions from engine.jsx
// ─────────────────────────────────────────────────────────────

function mcDealerPlay(cards, shoe, h17) {
  const out = [...cards];
  while (true) {
    const { total, soft } = handValue(out);
    if (total < 17) { out.push(shoe.shift()); continue; }
    if (total === 17 && soft && h17) { out.push(shoe.shift()); continue; }
    break;
  }
  return out;
}

function mcPlayPlayerHand(ctx) {
  const { bet, shoe, dealerUp, decks, h17, das, allowSplit, allowDouble, allowSurrender, splitFromAce } = ctx;
  let { cards } = ctx;
  if (splitFromAce) {
    // Split aces: one card only, forced stand.
    return [{ cards, stake: bet, busted: false, surrendered: false }];
  }
  while (true) {
    const v = handValue(cards);
    if (v.total >= 21) break;
    const action = basicStrategy(cards, dealerUp, {
      canDouble: cards.length === 2 && allowDouble,
      canSplit: allowSplit && cards.length === 2 && cards[0].r === cards[1].r,
      canSurrender: allowSurrender && cards.length === 2,
      h17, decks, das,
    });
    if (action === 'H') { cards = [...cards, shoe.shift()]; continue; }
    if (action === 'S') break;
    if (action === 'D') {
      if (cards.length === 2 && allowDouble) {
        cards = [...cards, shoe.shift()];
        const busted = handValue(cards).total > 21;
        return [{ cards, stake: bet * 2, busted, surrendered: false }];
      }
      cards = [...cards, shoe.shift()]; continue;
    }
    if (action === 'Ds') {
      if (cards.length === 2 && allowDouble) {
        cards = [...cards, shoe.shift()];
        const busted = handValue(cards).total > 21;
        return [{ cards, stake: bet * 2, busted, surrendered: false }];
      }
      break; // stand if can't double
    }
    if (action === 'P') {
      const c1 = shoe.shift();
      const c2 = shoe.shift();
      const isAces = cards[0].r === 'A';
      const h1 = mcPlayPlayerHand({
        cards: [cards[0], c1], bet, shoe, dealerUp, decks, h17, das,
        allowSplit: false, allowDouble: das && !isAces, allowSurrender: false,
        splitFromAce: isAces,
      });
      const h2 = mcPlayPlayerHand({
        cards: [cards[1], c2], bet, shoe, dealerUp, decks, h17, das,
        allowSplit: false, allowDouble: das && !isAces, allowSurrender: false,
        splitFromAce: isAces,
      });
      return [...h1, ...h2];
    }
    if (action === 'R' || action === 'Rh' || action === 'Rs') {
      if (allowSurrender && cards.length === 2) {
        return [{ cards, stake: bet, busted: false, surrendered: true }];
      }
      if (action === 'Rs') break;
      cards = [...cards, shoe.shift()]; continue;
    }
    break;
  }
  const busted = handValue(cards).total > 21;
  return [{ cards, stake: bet, busted, surrendered: false }];
}

function mcPlayRound(shoe, bet, opts) {
  const { decks, h17, das, surrender: allowSurrender } = opts;
  const p = [shoe.shift(), shoe.shift()];
  const d = [shoe.shift(), shoe.shift()];
  const pNatural = isBlackjack(p);
  const dPeek = d[0].r === 'A' || RANK_VALUE[d[0].r] === 10;
  const dNatural = dPeek && isBlackjack(d);

  if (dNatural) {
    // Player never takes insurance in basic strategy.
    return { net: pNatural ? 0 : -bet, wagered: bet, hands: 1, natural: pNatural ? 1 : 0, dealerBJ: 1 };
  }
  if (pNatural) {
    return { net: bet * 1.5, wagered: bet, hands: 1, natural: 1, dealerBJ: 0 };
  }

  const playerHands = mcPlayPlayerHand({
    cards: p, bet, shoe, dealerUp: d[0], decks, h17, das,
    allowSplit: true, allowDouble: true, allowSurrender, splitFromAce: false,
  });
  const anyAlive = playerHands.some((h) => !h.busted && !h.surrendered);
  const dealerFinal = anyAlive ? mcDealerPlay(d, shoe, h17) : d;

  let net = 0, wagered = 0;
  const dv = handValue(dealerFinal).total;
  for (const h of playerHands) {
    wagered += h.stake;
    if (h.surrendered) { net -= h.stake / 2; continue; }
    if (h.busted) { net -= h.stake; continue; }
    const pv = handValue(h.cards).total;
    if (dv > 21 || pv > dv) net += h.stake;
    else if (pv < dv) net -= h.stake;
  }
  return { net, wagered, hands: playerHands.length, natural: 0, dealerBJ: 0 };
}

function freshShoe(decks) { return makeShoe(decks); }

function shouldReshuffle(shoe, decks, pen) {
  return shoe.length < decks * 52 * (1 - pen) || shoe.length < 20;
}

// ─────────────────────────────────────────────────────────────
// Chunked runner so the UI doesn't freeze
// ─────────────────────────────────────────────────────────────

async function runRTPTest({ hands, bet, decks, h17, das, surrender, onProgress, signal }) {
  const pen = 0.75;
  let shoe = freshShoe(decks);
  let totalNet = 0, totalWagered = 0, totalInitialBet = 0;
  let resolvedHands = 0, rounds = 0, naturals = 0, dealerBJs = 0;
  let balance = 0;                     // running P/L
  let peak = 0, maxDrawdown = 0;
  const sampleEvery = Math.max(1, Math.floor(hands / 240));
  const curve = [0];

  const chunk = 2000;
  let done = 0;
  while (done < hands) {
    const n = Math.min(chunk, hands - done);
    for (let i = 0; i < n; i++) {
      if (shouldReshuffle(shoe, decks, pen)) shoe = freshShoe(decks);
      const r = mcPlayRound(shoe, bet, { decks, h17, das, surrender });
      totalNet += r.net;
      totalWagered += r.wagered;
      totalInitialBet += bet;
      resolvedHands += r.hands;
      rounds++;
      naturals += r.natural;
      dealerBJs += r.dealerBJ;
      balance += r.net;
      if (balance > peak) peak = balance;
      const dd = peak - balance;
      if (dd > maxDrawdown) maxDrawdown = dd;
      if ((done + i) % sampleEvery === 0) curve.push(balance);
    }
    done += n;
    if (onProgress) onProgress(done / hands);
    if (signal?.aborted) throw new Error('aborted');
    await new Promise((r) => setTimeout(r, 0));
  }
  curve.push(balance);

  return {
    rounds,
    resolvedHands,
    totalWagered,
    totalInitialBet,
    totalNet,
    rtp: (totalInitialBet + totalNet) / totalInitialBet,
    rtpOfTurnover: (totalWagered + totalNet) / totalWagered,
    houseEdge: -totalNet / totalInitialBet,
    edgePerResolvedHand: -totalNet / totalWagered,
    naturals,
    dealerBJs,
    maxDrawdown,
    finalBalance: balance,
    curve,
    bet,
  };
}

async function runSessionTest({ sessions, handsPerSession, startBalance, bet, decks, h17, das, surrender, onProgress, signal }) {
  const pen = 0.75;
  let doubled = 0, busted = 0, survivedPositive = 0, survivedNegative = 0;
  const endings = [];
  const pnls = [];
  const chunk = 25;
  let done = 0;
  while (done < sessions) {
    const n = Math.min(chunk, sessions - done);
    for (let s = 0; s < n; s++) {
      let shoe = freshShoe(decks);
      let bal = startBalance;
      let outcome = null;
      for (let i = 0; i < handsPerSession; i++) {
        if (shouldReshuffle(shoe, decks, pen)) shoe = freshShoe(decks);
        if (bal < bet) { outcome = 'bust'; break; }
        const r = mcPlayRound(shoe, bet, { decks, h17, das, surrender });
        bal += r.net;
        if (bal >= startBalance * 2) { outcome = 'doubled'; break; }
        if (bal <= 0) { outcome = 'bust'; break; }
      }
      if (outcome === 'doubled') doubled++;
      else if (outcome === 'bust') busted++;
      else if (bal >= startBalance) survivedPositive++;
      else survivedNegative++;
      endings.push(bal);
      pnls.push(bal - startBalance);
    }
    done += n;
    if (onProgress) onProgress(done / sessions);
    if (signal?.aborted) throw new Error('aborted');
    await new Promise((r) => setTimeout(r, 0));
  }

  endings.sort((a, b) => a - b);
  const median = endings[Math.floor(endings.length / 2)];
  const mean = pnls.reduce((a, b) => a + b, 0) / pnls.length;
  return {
    sessions, handsPerSession, startBalance, bet,
    doubled, busted, survivedPositive, survivedNegative,
    medianEnding: median,
    meanPnL: mean,
    endings,
  };
}

// ─────────────────────────────────────────────────────────────
// UI
// ─────────────────────────────────────────────────────────────

function fmtMoneyMC(n) {
  const v = Math.round(n);
  const sign = v < 0 ? '-' : v > 0 ? '+' : '';
  const abs = Math.abs(v).toLocaleString();
  return `${sign}$${abs}`;
}
function fmtPct(n, digits = 2) { return (n * 100).toFixed(digits) + '%'; }

function CurveChart({ curve }) {
  // Minimal SVG line chart; curve is an array of cumulative P/L.
  if (!curve || curve.length < 2) return null;
  const W = 560, H = 140;
  const minV = Math.min(0, ...curve);
  const maxV = Math.max(0, ...curve);
  const range = Math.max(1, maxV - minV);
  const pts = curve.map((v, i) => {
    const x = (i / (curve.length - 1)) * W;
    const y = H - ((v - minV) / range) * H;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const zeroY = H - ((0 - minV) / range) * H;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 140, display: 'block' }}>
      <line x1="0" y1={zeroY} x2={W} y2={zeroY} stroke="var(--line-2)" strokeDasharray="3 4" />
      <polyline points={pts} fill="none" stroke="var(--green)" strokeWidth="1.3" />
    </svg>
  );
}

function Row({ label, value, tone }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '7px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-2)' }}>
        {label}
      </div>
      <div className="mono" style={{ fontSize: 14, fontWeight: 600, color: tone === 'good' ? 'var(--green)' : tone === 'bad' ? 'var(--red)' : 'var(--ink-0)' }}>
        {value}
      </div>
    </div>
  );
}

function LabPanel({ open, onClose, tweaks }) {
  const [mode, setMode] = useLS('rtp');
  const [running, setRunning] = useLS(false);
  const [progress, setProgress] = useLS(0);
  const [rtp, setRtp] = useLS(null);
  const [sess, setSess] = useLS(null);
  const [rtpHands, setRtpHands] = useLS(10000);
  const [sessN, setSessN] = useLS(1000);
  const [sessHands, setSessHands] = useLS(200);
  const [sessStart, setSessStart] = useLS(1000);
  const [sessBet, setSessBet] = useLS(100);

  const decks = 6;
  const h17 = tweaks?.dealerHitsSoft17 ?? true;
  const das = true;
  const surrender = tweaks?.enableSurrender ?? true;

  const runRTP = async () => {
    setRtp(null); setRunning(true); setProgress(0);
    try {
      const res = await runRTPTest({ hands: rtpHands, bet: 100, decks, h17, das, surrender, onProgress: setProgress });
      setRtp(res);
    } finally { setRunning(false); setProgress(0); }
  };
  const runSessions = async () => {
    setSess(null); setRunning(true); setProgress(0);
    try {
      const res = await runSessionTest({ sessions: sessN, handsPerSession: sessHands, startBalance: sessStart, bet: sessBet, decks, h17, das, surrender, onProgress: setProgress });
      setSess(res);
    } finally { setRunning(false); setProgress(0); }
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(7,9,13,0.88)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        width: 'min(720px, 100%)', maxHeight: '92vh', overflow: 'auto',
        background: 'var(--bg-1)', border: '1px solid var(--line-2)', borderRadius: 4,
        padding: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 4 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--green)' }}>
            monte carlo lab
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn btn-xs btn-ghost" onClick={onClose}>close ×</button>
        </div>
        <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink-0)', marginBottom: 4 }}>
          Empirical RTP · basic-strategy auto-play
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 20, lineHeight: 1.5 }}>
          Deals hands against the same engine this game uses — no animation, no
          side bets, always optimal play. H17 · 6-deck · DAS · late surrender
          (toggled in Tweaks).
        </div>

        <div className="seg" style={{ marginBottom: 20 }}>
          <div className={`seg-btn ${mode === 'rtp' ? 'active' : ''}`} onClick={() => setMode('rtp')}>
            RTP test
          </div>
          <div className={`seg-btn ${mode === 'sess' ? 'active' : ''}`} onClick={() => setMode('sess')}>
            Session test
          </div>
        </div>

        {mode === 'rtp' && (
          <div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
              <div className="label-micro">Hands</div>
              {[1000, 10000, 100000, 500000].map((n) => (
                <button
                  key={n}
                  className={`btn btn-xs ${rtpHands === n ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setRtpHands(n)}
                >
                  {n.toLocaleString()}
                </button>
              ))}
              <div style={{ flex: 1 }} />
              <button className="btn btn-primary" onClick={runRTP} disabled={running}>
                {running ? `running… ${Math.round(progress * 100)}%` : 'RUN'}
              </button>
            </div>

            {rtp && (
              <div>
                <CurveChart curve={rtp.curve} />
                <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                  <div>
                    <Row label="Hands played" value={rtp.rounds.toLocaleString()} />
                    <Row
                      label="RTP (initial bet)"
                      value={fmtPct(rtp.rtp, 3)}
                      tone={rtp.rtp >= 0.99 ? 'good' : 'bad'}
                    />
                    <Row
                      label="House edge"
                      value={fmtPct(rtp.houseEdge, 3)}
                      tone={rtp.houseEdge < 0.01 ? 'good' : 'bad'}
                    />
                    <Row
                      label="Final P&L"
                      value={fmtMoneyMC(rtp.totalNet)}
                      tone={rtp.totalNet >= 0 ? 'good' : 'bad'}
                    />
                  </div>
                  <div>
                    <Row label="Hands resolved" value={rtp.resolvedHands.toLocaleString()} />
                    <Row label="Player BJs" value={rtp.naturals.toLocaleString()} />
                    <Row label="Dealer BJs" value={rtp.dealerBJs.toLocaleString()} />
                    <Row label="Max drawdown" value={fmtMoneyMC(-rtp.maxDrawdown)} />
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 12, lineHeight: 1.6 }}>
                  Expected house edge with H17 · 6-deck · DAS · basic strategy:
                  ~0.56%. Over {rtp.rounds.toLocaleString()} hands, the 95%
                  confidence interval is roughly ±{(1.96 * 1.15 / Math.sqrt(rtp.rounds) * 100).toFixed(2)}%.
                  If realized edge is inside that band, the engine is fair.
                </div>
              </div>
            )}
          </div>
        )}

        {mode === 'sess' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <div className="label-micro" style={{ marginBottom: 4 }}>Sessions</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[100, 1000, 10000].map((n) => (
                    <button
                      key={n}
                      className={`btn btn-xs ${sessN === n ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setSessN(n)}
                    >
                      {n.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="label-micro" style={{ marginBottom: 4 }}>Hands / session (cap)</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[100, 200, 500, 1000].map((n) => (
                    <button
                      key={n}
                      className={`btn btn-xs ${sessHands === n ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setSessHands(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="label-micro" style={{ marginBottom: 4 }}>Buy-in</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[500, 1000, 2000, 5000].map((n) => (
                    <button
                      key={n}
                      className={`btn btn-xs ${sessStart === n ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setSessStart(n)}
                    >
                      ${n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="label-micro" style={{ marginBottom: 4 }}>Bet / hand</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[25, 50, 100, 250].map((n) => (
                    <button
                      key={n}
                      className={`btn btn-xs ${sessBet === n ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setSessBet(n)}
                    >
                      ${n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                Each session stops when you double your buy-in, go bust, or hit the hand cap.
              </div>
              <div style={{ flex: 1 }} />
              <button className="btn btn-primary" onClick={runSessions} disabled={running}>
                {running ? `running… ${Math.round(progress * 100)}%` : 'RUN'}
              </button>
            </div>

            {sess && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }}>
                  <OutcomeTile
                    label="Doubled"
                    value={sess.doubled}
                    pct={sess.doubled / sess.sessions}
                    tone="good"
                  />
                  <OutcomeTile
                    label="Busted"
                    value={sess.busted}
                    pct={sess.busted / sess.sessions}
                    tone="bad"
                  />
                  <OutcomeTile
                    label="Ended up"
                    value={sess.survivedPositive}
                    pct={sess.survivedPositive / sess.sessions}
                  />
                  <OutcomeTile
                    label="Ended down"
                    value={sess.survivedNegative}
                    pct={sess.survivedNegative / sess.sessions}
                  />
                </div>
                <Row
                  label="Median ending balance"
                  value={fmtMoneyMC(sess.medianEnding)}
                  tone={sess.medianEnding >= sess.startBalance ? 'good' : 'bad'}
                />
                <Row label="Mean session P&L" value={fmtMoneyMC(sess.meanPnL)} tone={sess.meanPnL >= 0 ? 'good' : 'bad'} />
                <Row label="Sessions simulated" value={sess.sessions.toLocaleString()} />
                <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 12, lineHeight: 1.6 }}>
                  You played ~10 sessions — simulating {sess.sessions.toLocaleString()} is the
                  expected-value version of that experience. If &ldquo;doubled&rdquo;
                  looks closer to 40% than 50%, that&rsquo;s the house edge
                  doing its quiet work on a small bankroll.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function OutcomeTile({ label, value, pct, tone }) {
  const color = tone === 'good' ? 'var(--green)' : tone === 'bad' ? 'var(--red)' : 'var(--ink-0)';
  return (
    <div style={{ border: '1px solid var(--line)', padding: 12, background: 'var(--bg-2)' }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 4 }}>
        {label}
      </div>
      <div className="mono" style={{ fontSize: 22, fontWeight: 700, color, letterSpacing: '-0.02em' }}>
        {value.toLocaleString()}
      </div>
      <div className="mono" style={{ fontSize: 10, color: 'var(--ink-2)', marginTop: 2 }}>
        {fmtPct(pct, 1)}
      </div>
    </div>
  );
}

Object.assign(window, { LabPanel });
