/* Main app: game state machine, stage layout, control bar */

const { useState, useEffect, useRef, useCallback, useMemo } = React;

const LS_KEY = 'bj_simulator_v1';
const DEFAULT_DECKS = 6;
const PENETRATION = 0.75; // reshuffle when 75% dealt

const SIDE_BET_PRESETS = [0, 5, 10, 25, 50];

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}
function saveState(s) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {}
}

function App() {
  const persisted = loadState();
  const [phase, setPhase] = useState(persisted?.balance ? 'betting' : 'buyin');
  const [balance, setBalance] = useState(persisted?.balance ?? 0);
  const [buyIn, setBuyIn] = useState(persisted?.buyIn ?? 0);
  const [sessionPnL, setSessionPnL] = useState(persisted?.sessionPnL ?? 0);
  const [sessionHands, setSessionHands] = useState(persisted?.sessionHands ?? 0);
  const [history, setHistory] = useState(persisted?.history ?? []);
  const [historyOpen, setHistoryOpen] = useState(false);

  const [numDecks, setNumDecks] = useState(persisted?.numDecks ?? DEFAULT_DECKS);
  const shoeSize = numDecks * 52;
  const [shoe, setShoe] = useState(() => makeShoe(persisted?.numDecks ?? DEFAULT_DECKS));

  const [activeBoxes, setActiveBoxes] = useState(1);
  const [bets, setBets] = useState([100, 100, 100]);
  const [ppBets, setPpBets] = useState([0, 0, 0]);
  const [tpBets, setTpBets] = useState([0, 0, 0]);
  const [currentBet, setCurrentBet] = useState(100);

  const [dealer, setDealer] = useState([]);
  const [hands, setHands] = useState([]);
  const [activeHandIdx, setActiveHandIdx] = useState(-1);
  const [dealerHoleHidden, setDealerHoleHidden] = useState(true);
  const [outcomes, setOutcomes] = useState([]);
  const [sideResults, setSideResults] = useState([]);

  // Insurance state
  const [insuranceOffered, setInsuranceOffered] = useState(false);
  const [insuranceBets, setInsuranceBets] = useState([0, 0, 0]);

  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const showToast = (msg, tone) => {
    setToast({ msg, tone });
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 1600);
  };

  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [labOpen, setLabOpen] = useState(false);
  const [tweaks, setTweaks] = useState({
    showHud: true,
    showStrategy: true,
    dealerHitsSoft17: true,
    enableSideBets: true,
    enableInsurance: true,
    enableSurrender: true,
    quickPlay: false,
    cardStyle: 'classic', // classic | mono | neon | glass
    chipStyle: 'casino',  // casino | mono | neon
  });

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  useEffect(() => {
    saveState({ balance, buyIn, sessionPnL, sessionHands, history: history.slice(0, 50), numDecks });
  }, [balance, buyIn, sessionPnL, sessionHands, history, numDecks]);

  useEffect(() => {
    if (shoe.length < shoeSize * (1 - PENETRATION)) {
      const fresh = makeShoe(numDecks);
      setShoe(fresh);
      showToast('Shoe reshuffled', 'info');
    }
  }, [shoe, numDecks, shoeSize]);

  const totalBet = useMemo(() => {
    let t = 0;
    for (let i = 0; i < activeBoxes; i++) {
      t += bets[i] + (tweaks.enableSideBets ? ppBets[i] + tpBets[i] : 0);
    }
    return t;
  }, [activeBoxes, bets, ppBets, tpBets, tweaks.enableSideBets]);

  const canDeal = phase === 'betting' && totalBet > 0 && totalBet <= balance;

  const handleBuyIn = (amount) => {
    setBalance(amount);
    setBuyIn(amount);
    setSessionPnL(0);
    setSessionHands(0);
    setHistory([]);
    setPhase('betting');
    const initialBet = Math.max(10, Math.min(100, Math.round(amount * 0.02)));
    setCurrentBet(initialBet);
    setBets([initialBet, initialBet, initialBet]);
  };

  const handleChangeDecks = (n) => {
    setNumDecks(n);
    setShoe(makeShoe(n));
    showToast(`New shoe · ${n} deck${n > 1 ? 's' : ''}`, 'info');
  };

  const applyBetToAllBoxes = (v) => {
    setBets(prev => prev.map((b, i) => i < activeBoxes ? v : b));
    setCurrentBet(v);
  };
  const setBetForBox = (i, v) => {
    setBets(prev => { const n = [...prev]; n[i] = v; return n; });
  };

  const doDeal = () => {
    if (!canDeal) return;
    setBalance(b => b - totalBet);

    const shoeCopy = [...shoe];
    const newHands = [];
    for (let b = 0; b < activeBoxes; b++) {
      newHands.push({
        boxIndex: b, cards: [], bet: bets[b],
        doubled: false, stood: false, busted: false,
        natural: false, split: false, splitFromAce: false, surrendered: false,
      });
    }
    const newDealer = [];
    for (let r = 0; r < 2; r++) {
      for (const h of newHands) h.cards.push(shoeCopy.shift());
      newDealer.push(shoeCopy.shift());
    }
    const sideRes = newHands.map(h => ({
      pp: evalPerfectPairs(h.cards[0], h.cards[1]),
      tp: evalTwentyOnePlusThree(h.cards[0], h.cards[1], newDealer[0]),
    }));
    for (const h of newHands) if (isBlackjack(h.cards)) h.natural = true;

    setShoe(shoeCopy);
    setDealer(newDealer);
    setHands(newHands);
    setOutcomes(new Array(newHands.length).fill(null));
    setSideResults(sideRes);
    setInsuranceBets([0,0,0]);
    setDealerHoleHidden(true);
    setPhase('dealing');

    setTimeout(() => {
      // Insurance check: dealer shows Ace
      if (tweaks.enableInsurance && newDealer[0].r === 'A') {
        setInsuranceOffered(true);
        setPhase('insurance');
        return;
      }
      continueAfterInsurance(newHands, newDealer, shoeCopy, sideRes);
    }, 900);
  };

  const continueAfterInsurance = (handsSnap, dealerSnap, shoeSnap, sideRes) => {
    // Check dealer blackjack peek if they had T/A up
    const dealerUp = dealerSnap[0];
    if (dealerUp.r === 'A' || RANK_VALUE[dealerUp.r] === 10) {
      if (isBlackjack(dealerSnap)) {
        // reveal, settle
        setDealerHoleHidden(false);
        setPhase('dealer');
        setTimeout(() => settleAll(handsSnap, dealerSnap, shoeSnap, sideRes), 700);
        return;
      }
    }
    setPhase('playing');
    const firstActive = handsSnap.findIndex(h => !h.natural);
    if (firstActive === -1) {
      setActiveHandIdx(-1);
      setTimeout(() => runDealer(handsSnap, dealerSnap, shoeSnap, sideRes), 200);
    } else {
      setActiveHandIdx(firstActive);
    }
  };

  const takeInsurance = (accept) => {
    // Insurance bet = half main bet per box with natural-eligible (anyone can take)
    // Cost per box: 0.5 * box bet. Pays 2:1 if dealer has BJ.
    if (accept) {
      let totalIns = 0;
      const next = [0,0,0];
      for (let b = 0; b < activeBoxes; b++) {
        next[b] = Math.floor(bets[b] / 2);
        totalIns += next[b];
      }
      if (totalIns > balance) {
        showToast('Insufficient balance for full insurance', 'warn');
        // reduce proportionally
      }
      setInsuranceBets(next);
      setBalance(b => b - Math.min(totalIns, b));
    }
    setInsuranceOffered(false);
    continueAfterInsurance(hands, dealer, shoe, sideResults);
  };

  const nextFrom = (handsSnap, startIdx) => {
    for (let i = startIdx + 1; i < handsSnap.length; i++) {
      const h = handsSnap[i];
      if (!h.stood && !h.busted && !h.natural && !h.surrendered) return i;
    }
    return -1;
  };

  const doHit = () => {
    if (phase !== 'playing' || activeHandIdx < 0) return;
    const shoeCopy = [...shoe];
    const drawn = shoeCopy.shift();
    setShoe(shoeCopy);
    setHands(prev => {
      const next = prev.map((h, i) => i === activeHandIdx ? { ...h, cards: [...h.cards, drawn] } : h);
      const h = next[activeHandIdx];
      const { total } = handValue(h.cards);
      if (total > 21) {
        h.busted = true; h.stood = true;
        setTimeout(() => {
          const ni = nextFrom(next, activeHandIdx);
          if (ni === -1) { setActiveHandIdx(-1); setTimeout(() => runDealer(next, dealer, shoeCopy), 280); }
          else setActiveHandIdx(ni);
        }, 400);
      } else if (total === 21) {
        h.stood = true;
        setTimeout(() => {
          const ni = nextFrom(next, activeHandIdx);
          if (ni === -1) { setActiveHandIdx(-1); setTimeout(() => runDealer(next, dealer, shoeCopy), 280); }
          else setActiveHandIdx(ni);
        }, 300);
      }
      return next;
    });
  };

  const doStand = () => {
    if (phase !== 'playing' || activeHandIdx < 0) return;
    setHands(prev => {
      const next = prev.map((h, i) => i === activeHandIdx ? { ...h, stood: true } : h);
      const ni = nextFrom(next, activeHandIdx);
      if (ni === -1) { setActiveHandIdx(-1); setTimeout(() => runDealer(next, dealer, shoe), 250); }
      else setActiveHandIdx(ni);
      return next;
    });
  };

  const doDouble = () => {
    if (phase !== 'playing' || activeHandIdx < 0) return;
    const h = hands[activeHandIdx];
    if (!h || h.cards.length !== 2) return;
    if (balance < h.bet) { showToast('Insufficient balance', 'warn'); return; }
    setBalance(b => b - h.bet);
    const shoeCopy = [...shoe];
    const drawn = shoeCopy.shift();
    setShoe(shoeCopy);
    setHands(prev => {
      const next = prev.map((hh, i) => i === activeHandIdx ? {
        ...hh,
        cards: [...hh.cards, drawn],
        doubled: true, stood: true,
        busted: handValue([...hh.cards, drawn]).total > 21,
      } : hh);
      setTimeout(() => {
        const ni = nextFrom(next, activeHandIdx);
        if (ni === -1) { setActiveHandIdx(-1); setTimeout(() => runDealer(next, dealer, shoeCopy), 340); }
        else setActiveHandIdx(ni);
      }, 500);
      return next;
    });
  };

  const canSplit = () => {
    if (phase !== 'playing' || activeHandIdx < 0) return false;
    const h = hands[activeHandIdx];
    if (!h || h.cards.length !== 2) return false;
    if (RANK_VALUE[h.cards[0].r] !== RANK_VALUE[h.cards[1].r]) return false;
    if (balance < h.bet) return false;
    const handsInBox = hands.filter(x => x.boxIndex === h.boxIndex).length;
    return handsInBox < 4;
  };

  const canSurrender = () => {
    if (!tweaks.enableSurrender) return false;
    if (phase !== 'playing' || activeHandIdx < 0) return false;
    const h = hands[activeHandIdx];
    if (!h || h.cards.length !== 2) return false;
    if (h.split) return false;
    return true;
  };

  const doSurrender = () => {
    if (!canSurrender()) return;
    const h = hands[activeHandIdx];
    // Return half the bet immediately
    setBalance(b => b + Math.floor(h.bet / 2));
    setHands(prev => {
      const next = prev.map((hh, i) => i === activeHandIdx ? { ...hh, surrendered: true, stood: true } : hh);
      setTimeout(() => {
        const ni = nextFrom(next, activeHandIdx);
        if (ni === -1) { setActiveHandIdx(-1); setTimeout(() => runDealer(next, dealer, shoe), 260); }
        else setActiveHandIdx(ni);
      }, 260);
      return next;
    });
  };

  const doSplit = () => {
    if (!canSplit()) return;
    const h = hands[activeHandIdx];
    setBalance(b => b - h.bet);
    const shoeCopy = [...shoe];
    const c1 = shoeCopy.shift();
    const c2 = shoeCopy.shift();
    setShoe(shoeCopy);
    setHands(prev => {
      const next = [...prev];
      const isAces = h.cards[0].r === 'A';
      const h1 = { ...h, cards: [h.cards[0], c1], split: true, splitFromAce: isAces, natural: false, stood: isAces };
      const h2 = { ...h, cards: [h.cards[1], c2], split: true, splitFromAce: isAces, natural: false, stood: isAces };
      next.splice(activeHandIdx, 1, h1, h2);
      setOutcomes(o => { const oo = [...o]; oo.splice(activeHandIdx, 1, null, null); return oo; });
      setSideResults(sr => { const nsr = [...sr]; nsr.splice(activeHandIdx, 1, nsr[activeHandIdx], { pp: 0, tp: 0 }); return nsr; });
      if (isAces) {
        setTimeout(() => {
          const ni = nextFrom(next, activeHandIdx + 1);
          if (ni === -1) { setActiveHandIdx(-1); setTimeout(() => runDealer(next, dealer, shoeCopy), 300); }
          else setActiveHandIdx(ni);
        }, 300);
      }
      return next;
    });
  };

  const runDealer = (handsSnap, dealerCards, shoeCopy, sideRes) => {
    sideRes = sideRes || sideResults;
    setDealerHoleHidden(false);
    setPhase('dealer');
    const anyAlive = handsSnap.some(h => !h.busted && !h.surrendered);
    let finalDealer = [...dealerCards];
    let consumed = 0;
    if (anyAlive) {
      const res = dealerPlay(dealerCards, shoeCopy, tweaks.dealerHitsSoft17);
      finalDealer = res.cards; consumed = res.consumed;
    }
    const drawDelay = tweaks.quickPlay ? 260 : 520;
    const revealDelay = 500; // let hole flip land before first draw
    const steps = finalDealer.length - dealerCards.length;
    if (steps <= 0) {
      setTimeout(() => settleAll(handsSnap, finalDealer, shoeCopy.slice(consumed), sideRes), revealDelay + 300);
    } else {
      for (let i = 1; i <= steps; i++) {
        setTimeout(() => {
          setDealer(prev => [...prev, finalDealer[dealerCards.length + i - 1]]);
        }, revealDelay + i * drawDelay);
      }
      // settle only AFTER final card has fully animated in
      setTimeout(() => {
        setShoe(shoeCopy.slice(consumed));
        settleAll(handsSnap, finalDealer, shoeCopy.slice(consumed), sideRes);
      }, revealDelay + steps * drawDelay + 650);
    }
  };

  const settleAll = (handsSnap, dealerFinal, newShoe, sideRes) => {
    const outs = [];
    let totalNet = 0;
    let payoutsToBalance = 0;
    const dealerBJ = isBlackjack(dealerFinal);

    // Insurance settlement
    for (let b = 0; b < activeBoxes; b++) {
      if (insuranceBets[b] > 0) {
        if (dealerBJ) {
          payoutsToBalance += insuranceBets[b] * 3; // 2:1 payout + stake back
          totalNet += insuranceBets[b] * 2;
        } else {
          totalNet -= insuranceBets[b];
        }
      }
    }

    for (let i = 0; i < handsSnap.length; i++) {
      const h = handsSnap[i];
      if (h.surrendered) {
        outs.push('surrender');
        totalNet -= Math.ceil(h.bet / 2);
        continue;
      }
      const stake = h.bet * (h.doubled ? 2 : 1);
      const res = settleHand(h.cards, dealerFinal, { naturalBJ: h.natural });
      outs.push(res.outcome);
      const net = res.net * stake;
      totalNet += net;
      payoutsToBalance += stake + net;
      if (tweaks.enableSideBets) {
        const sr = sideRes[i] || { pp: 0, tp: 0 };
        if (ppBets[h.boxIndex] && !h.split) {
          if (sr.pp > 0) { payoutsToBalance += ppBets[h.boxIndex] * sr.pp + ppBets[h.boxIndex]; totalNet += ppBets[h.boxIndex] * sr.pp; }
          else totalNet -= ppBets[h.boxIndex];
        }
        if (tpBets[h.boxIndex] && !h.split) {
          if (sr.tp > 0) { payoutsToBalance += tpBets[h.boxIndex] * sr.tp + tpBets[h.boxIndex]; totalNet += tpBets[h.boxIndex] * sr.tp; }
          else totalNet -= tpBets[h.boxIndex];
        }
      }
    }
    setOutcomes(outs);
    setBalance(b => b + payoutsToBalance);
    setSessionPnL(p => p + totalNet);
    setSessionHands(n => n + 1);

    const histEntry = {
      id: `h-${Date.now()}`,
      at: Date.now(),
      hands: handsSnap.map((h, i) => ({
        playerTotal: handValue(h.cards).total,
        outcome: outs[i],
        doubled: h.doubled,
        split: h.split,
        bet: h.bet,
      })),
      dealerTotal: handValue(dealerFinal).total,
      totalNet,
    };
    setHistory(prev => [histEntry, ...prev].slice(0, 50));
    setPhase('settled');
    if (totalNet > 0) showToast(`+${formatMoney(totalNet).replace(/^[+\-]/, '')}`, 'win');
    else if (totalNet < 0) showToast(`${formatMoney(totalNet)}`, 'loss');
    else showToast('Push', 'neutral');
  };

  const nextRound = () => {
    setDealer([]); setHands([]); setOutcomes([]); setSideResults([]);
    setActiveHandIdx(-1); setDealerHoleHidden(true);
    setInsuranceBets([0,0,0]); setInsuranceOffered(false);
    setPhase('betting');
  };

  const resetSession = () => {
    if (!confirm('Reset session, cash out, and reshuffle the shoe?')) return;
    localStorage.removeItem(LS_KEY);
    setPhase('buyin');
    setBalance(0); setBuyIn(0); setSessionPnL(0); setSessionHands(0);
    setHistory([]);
    setDealer([]); setHands([]); setOutcomes([]);
    setShoe(makeShoe(numDecks));
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (phase === 'betting' && e.code === 'Space') { e.preventDefault(); doDeal(); }
      if (phase === 'playing') {
        if (e.key === 'h' || e.key === 'H') doHit();
        else if (e.key === 's' || e.key === 'S') doStand();
        else if (e.key === 'd' || e.key === 'D') doDouble();
        else if (e.key === 'p' || e.key === 'P') doSplit();
        else if (e.key === 'r' || e.key === 'R') doSurrender();
      }
      if (phase === 'settled' && e.code === 'Space') { e.preventDefault(); nextRound(); }
      if (phase === 'insurance') {
        if (e.key === 'y' || e.key === 'Y') takeInsurance(true);
        else if (e.key === 'n' || e.key === 'N') takeInsurance(false);
      }
      if (e.key === 'l' || e.key === 'L') setLabOpen(v => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, activeHandIdx, hands, dealer, shoe, balance, bets, insuranceBets]);

  const activeHand = activeHandIdx >= 0 ? hands[activeHandIdx] : null;
  const activeBustProb = activeHand ? bustProbability(activeHand.cards, shoe) : 0;
  const dealerTrend = history.slice(0, 10).map(h => h.dealerTotal);

  const strategyForHand = (h) => {
    if (!tweaks.showStrategy || !h || dealer.length === 0) return null;
    if (h.stood || h.busted || h.surrendered) return null;
    return basicStrategy(h.cards, dealer[0], {
      canDouble: h.cards.length === 2 && !h.splitFromAce && balance >= h.bet,
      canSplit: canSplit() && activeHandIdx === hands.indexOf(h),
      canSurrender: tweaks.enableSurrender && h.cards.length === 2 && !h.split,
      h17: tweaks.dealerHitsSoft17,
      decks: numDecks,
      das: true,
    });
  };

  const handsByBox = useMemo(() => {
    const m = {};
    for (let i = 0; i < hands.length; i++) {
      const h = hands[i];
      if (!m[h.boxIndex]) m[h.boxIndex] = [];
      m[h.boxIndex].push({ ...h, idx: i });
    }
    return m;
  }, [hands]);

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <div className="stage-bg" />

      <Header
        balance={balance}
        sessionPnL={sessionPnL}
        sessionHands={sessionHands}
        historyOpen={historyOpen}
        onToggleHistory={() => setHistoryOpen(v => !v)}
        onReset={resetSession}
        shoeRemaining={shoe.length}
        shoeSize={shoeSize}
        numDecks={numDecks}
        onChangeDecks={handleChangeDecks}
        onShowInfo={() => setInfoOpen(true)}
      />

      {tweaks.showHud && phase === 'playing' && activeHand && (
        <HudOverlay bustProb={activeBustProb} dealerTrend={dealerTrend} />
      )}

      <div style={{
        position: 'absolute',
        top: 60, left: 0, right: historyOpen ? 380 : 0, bottom: 0,
        display: 'flex', flexDirection: 'column',
        transition: 'right 280ms cubic-bezier(.22,.9,.24,1)',
      }}>
        <GameStage
          phase={phase}
          dealer={dealer}
          dealerHoleHidden={dealerHoleHidden}
          hands={hands}
          handsByBox={handsByBox}
          activeHandIdx={activeHandIdx}
          outcomes={outcomes}
          activeBoxes={activeBoxes}
          bets={bets}
          ppBets={ppBets}
          tpBets={tpBets}
          insuranceBets={insuranceBets}
          sideResults={sideResults}
          enableSideBets={tweaks.enableSideBets}
          strategyForHand={strategyForHand}
          showStrategy={tweaks.showStrategy}
          cardVariant={tweaks.cardStyle}
          chipVariant={tweaks.chipStyle}
        />

        <ControlBar
          phase={phase}
          activeBoxes={activeBoxes}
          setActiveBoxes={setActiveBoxes}
          bets={bets}
          setBetForBox={setBetForBox}
          currentBet={currentBet}
          setCurrentBet={applyBetToAllBoxes}
          ppBets={ppBets}
          setPpBets={setPpBets}
          tpBets={tpBets}
          setTpBets={setTpBets}
          totalBet={totalBet}
          balance={balance}
          canDeal={canDeal}
          doDeal={doDeal}
          doHit={doHit}
          doStand={doStand}
          doDouble={doDouble}
          doSplit={doSplit}
          doSurrender={doSurrender}
          takeInsurance={takeInsurance}
          canSplit={canSplit()}
          canSurrender={canSurrender()}
          canDouble={phase === 'playing' && activeHand && activeHand.cards.length === 2 && balance >= activeHand.bet && !activeHand.splitFromAce}
          nextRound={nextRound}
          enableSideBets={tweaks.enableSideBets}
        />
      </div>

      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        sessionPnL={sessionPnL}
        onClear={() => { if (confirm('Clear history?')) setHistory([]); }}
      />

      {phase === 'buyin' && <BuyInSplash onBuyIn={handleBuyIn} />}

      {toast && (
        <div className={`toast fade-up`} style={{
          borderColor: toast.tone === 'win' ? 'oklch(0.5 0.15 155)' :
                       toast.tone === 'loss' ? 'oklch(0.45 0.15 25)' :
                       'var(--line-2)',
          color: toast.tone === 'win' ? 'var(--green)' :
                 toast.tone === 'loss' ? 'oklch(0.78 0.17 25)' :
                 'var(--ink-0)',
        }}>
          {toast.msg}
        </div>
      )}

      {tweaksOpen && (
        <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} onClose={() => setTweaksOpen(false)} />
      )}

      {infoOpen && (
        <InfoModal
          numDecks={numDecks}
          dealerHitsSoft17={tweaks.dealerHitsSoft17}
          enableSideBets={tweaks.enableSideBets}
          enableSurrender={tweaks.enableSurrender}
          onClose={() => setInfoOpen(false)}
        />
      )}

      <button
        onClick={() => setLabOpen(true)}
        title="Monte Carlo lab (L)"
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 60,
          padding: '8px 14px',
          background: 'var(--bg-2)',
          border: '1px solid var(--line-2)',
          color: 'var(--green)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          borderRadius: 2,
        }}
      >
        ⚡ lab
      </button>

      {labOpen && <LabPanel open={labOpen} onClose={() => setLabOpen(false)} tweaks={tweaks} />}
    </div>
  );
}

function GameStage({ phase, dealer, dealerHoleHidden, hands, handsByBox, activeHandIdx, outcomes, activeBoxes, bets, ppBets, tpBets, insuranceBets, sideResults, enableSideBets, strategyForHand, showStrategy, cardVariant, chipVariant }) {
  const dealerValue = dealer.length > 0
    ? (dealerHoleHidden ? RANK_VALUE[dealer[0].r] : handValue(dealer).total)
    : null;
  const dealerSoft = !dealerHoleHidden && dealer.length > 0 ? handValue(dealer).soft : false;

  return (
    <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '36px 0 12px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: phase === 'dealer' ? 'var(--green)' : 'var(--ink-4)',
            boxShadow: phase === 'dealer' ? '0 0 10px var(--green-glow)' : 'none' }} />
          <div className="label-micro" style={{ letterSpacing: '0.22em' }}>Dealer</div>
        </div>
        {dealer.length > 0 ? (
          <Hand
            cards={dealer}
            dealerHoleHidden={dealerHoleHidden}
            value={dealerValue}
            label="DEALER"
            active={phase === 'dealer'}
            soft={dealerSoft}
            cardVariant={cardVariant}
          />
        ) : (
          <EmptyShoe />
        )}
      </div>

      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end', justifyContent: 'center', flexWrap: 'nowrap', padding: '0 32px' }}>
        {Array.from({ length: activeBoxes }).map((_, b) => {
          const boxHands = handsByBox[b] || [];
          const firstIdx = boxHands[0]?.idx;
          const sr = firstIdx !== undefined ? sideResults[firstIdx] : null;
          return (
            <div key={b} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, minWidth: 190 }}>
              {boxHands.length > 0 ? (
                <div style={{ display: 'flex', gap: boxHands.length > 1 ? 20 : 0, alignItems: 'flex-end' }}>
                  {boxHands.map(h => {
                    const v = handValue(h.cards);
                    const isActive = activeHandIdx === h.idx;
                    const strat = isActive && showStrategy ? strategyForHand(h) : null;
                    return (
                      <Hand
                        key={h.idx}
                        cards={h.cards}
                        small={boxHands.length > 1}
                        value={v.total}
                        label="HAND"
                        soft={v.soft}
                        active={isActive}
                        doubled={h.doubled}
                        strategy={strat}
                        cardVariant={cardVariant}
                        result={outcomes[h.idx] || (h.busted ? 'bust' : h.surrendered ? 'surrender' : h.natural && phase === 'settled' ? 'bj' : null)}
                      />
                    );
                  })}
                </div>
              ) : (
                <BetSpot />
              )}

              {bets[b] > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ChipStack amount={bets[b]} variant={chipVariant} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="label-micro">Wager</div>
                    <div className="mono" style={{ fontWeight: 600, fontSize: 14 }}>{formatMoney(bets[b])}</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                {enableSideBets && ppBets[b] > 0 && (
                  <div className="pill mono" style={{
                    fontSize: 10,
                    background: sr?.pp > 0 ? 'oklch(0.35 0.13 295)' : 'var(--bg-2)',
                    color: sr?.pp > 0 ? 'oklch(0.92 0.1 295)' : 'var(--ink-2)',
                    borderColor: sr?.pp > 0 ? 'oklch(0.5 0.15 295)' : 'var(--line)',
                  }}>
                    PP {formatMoney(ppBets[b])}{sr?.pp > 0 && ` · ${sr.pp}×`}
                  </div>
                )}
                {enableSideBets && tpBets[b] > 0 && (
                  <div className="pill mono" style={{
                    fontSize: 10,
                    background: sr?.tp > 0 ? 'oklch(0.35 0.13 75)' : 'var(--bg-2)',
                    color: sr?.tp > 0 ? 'oklch(0.92 0.1 75)' : 'var(--ink-2)',
                    borderColor: sr?.tp > 0 ? 'oklch(0.5 0.14 75)' : 'var(--line)',
                  }}>
                    21+3 {formatMoney(tpBets[b])}{sr?.tp > 0 && ` · ${sr.tp}×`}
                  </div>
                )}
                {insuranceBets[b] > 0 && (
                  <div className="pill mono" style={{
                    fontSize: 10, background: 'oklch(0.3 0.1 240)',
                    color: 'oklch(0.88 0.1 240)',
                    borderColor: 'oklch(0.45 0.12 240)',
                  }}>
                    INS {formatMoney(insuranceBets[b])}
                  </div>
                )}
              </div>

              <div className="label-micro" style={{ color: 'var(--ink-4)', fontSize: 9 }}>BOX {b + 1}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BetSpot() {
  return (
    <div style={{
      width: 150, height: 150,
      borderRadius: '50%',
      border: '1.5px dashed var(--ink-4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--ink-4)',
      fontSize: 9,
      fontFamily: 'JetBrains Mono, monospace',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      background: 'radial-gradient(circle, rgba(255,255,255,0.015) 0%, transparent 70%)',
    }}>
      BET HERE
    </div>
  );
}

function EmptyShoe() {
  return (
    <div style={{
      height: 130, width: 92,
      borderRadius: 11,
      border: '1.5px dashed var(--ink-4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--ink-4)',
      fontSize: 9,
      fontFamily: 'JetBrains Mono, monospace',
      letterSpacing: '0.2em',
    }}>SHOE</div>
  );
}

function ControlBar(props) {
  const {
    phase, activeBoxes, setActiveBoxes, bets, setBetForBox,
    currentBet, setCurrentBet, ppBets, setPpBets, tpBets, setTpBets,
    totalBet, balance, canDeal, doDeal, doHit, doStand, doDouble, doSplit, doSurrender, takeInsurance,
    canSplit, canDouble, canSurrender, nextRound, enableSideBets,
  } = props;

  return (
    <div style={{
      borderTop: '1px solid var(--line)',
      background: 'linear-gradient(180deg, rgba(12,16,22,0.6), var(--bg-0))',
      backdropFilter: 'blur(8px)',
      padding: '14px 22px 16px',
    }}>
      {phase === 'betting' && (
        <BettingControls
          activeBoxes={activeBoxes} setActiveBoxes={setActiveBoxes}
          bets={bets} setBetForBox={setBetForBox}
          currentBet={currentBet} setCurrentBet={setCurrentBet}
          ppBets={ppBets} setPpBets={setPpBets}
          tpBets={tpBets} setTpBets={setTpBets}
          totalBet={totalBet} balance={balance} canDeal={canDeal} doDeal={doDeal}
          enableSideBets={enableSideBets}
        />
      )}
      {phase === 'playing' && (
        <PlayingControls
          doHit={doHit} doStand={doStand}
          doDouble={doDouble} doSplit={doSplit}
          doSurrender={doSurrender}
          canSplit={canSplit} canDouble={canDouble} canSurrender={canSurrender}
        />
      )}
      {phase === 'insurance' && <InsuranceControls takeInsurance={takeInsurance} />}
      {(phase === 'dealing' || phase === 'dealer') && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60 }}>
          <div className="pill" style={{ background: 'var(--bg-1)' }}>
            <div className="pill-dot" style={{ background: 'var(--amber)', animation: 'pulseGlow 1.2s ease-in-out infinite' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.15em' }}>
              {phase === 'dealing' ? 'DEALING' : 'DEALER DRAWING'}
            </span>
          </div>
        </div>
      )}
      {phase === 'settled' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, height: 60 }}>
          <button className="btn btn-ghost" onClick={nextRound}>Change Bet</button>
          <button className="btn btn-primary btn-lg" onClick={nextRound} style={{ minWidth: 200 }}>
            NEXT HAND
            <span className="kbd" style={{ background: 'rgba(0,0,0,0.18)', borderColor: 'rgba(0,0,0,0.25)', color: '#041007' }}>Space</span>
          </button>
        </div>
      )}
    </div>
  );
}

function InsuranceControls({ takeInsurance }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60, gap: 14 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Dealer shows Ace</div>
        <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Insurance pays 2:1 · costs ½ bet
        </div>
      </div>
      <button className="btn btn-lg" onClick={() => takeInsurance(false)} style={{ minWidth: 130 }}>
        DECLINE
        <span className="kbd">N</span>
      </button>
      <button className="btn btn-warning btn-lg" onClick={() => takeInsurance(true)} style={{ minWidth: 140 }}>
        TAKE INSURANCE
        <span className="kbd" style={{ background: 'rgba(0,0,0,0.15)', borderColor: 'rgba(0,0,0,0.2)', color: '#1a0e00' }}>Y</span>
      </button>
    </div>
  );
}

function BettingControls({ activeBoxes, setActiveBoxes, bets, setBetForBox, currentBet, setCurrentBet, ppBets, setPpBets, tpBets, setTpBets, totalBet, balance, canDeal, doDeal, enableSideBets }) {
  const maxBet = Math.min(50000, Math.max(10, Math.floor(balance / activeBoxes)));
  const quickBets = [10, 25, 100, 500, 1000];

  const adjustSideBet = (setter, box, val) => {
    setter(prev => { const n = [...prev]; n[box] = Math.max(0, Math.min(val, Math.floor(balance / 4))); return n; });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr auto', gap: 24, alignItems: 'center' }}>
      <div>
        <div className="label-micro" style={{ marginBottom: 6 }}>Hands</div>
        <div className="seg">
          {[1,2,3].map(n => (
            <div key={n} className={`seg-btn ${activeBoxes === n ? 'active' : ''}`} onClick={() => setActiveBoxes(n)}>
              {n} box{n > 1 ? 'es' : ''}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6, gap: 12 }}>
          <div className="label-micro">Bet (per box)</div>
          <div style={{ flex: 1 }} />
          <div className="mono" style={{ fontSize: 12, color: 'var(--ink-2)' }}>
            Total <span style={{ color: totalBet > balance ? 'var(--red)' : 'var(--ink-0)', fontWeight: 600 }}>{formatMoney(totalBet)}</span>
            <span style={{ color: 'var(--ink-3)' }}> / {formatMoney(balance)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            type="range" min={10} max={maxBet} step={10}
            value={Math.min(currentBet, maxBet)}
            onChange={e => setCurrentBet(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <div className="mono" style={{ minWidth: 96, textAlign: 'right', fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>
            {formatMoney(currentBet)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {quickBets.filter(q => q <= maxBet).map(q => (
            <button key={q} className="btn btn-xs btn-ghost" onClick={() => setCurrentBet(q)}>{formatMoney(q)}</button>
          ))}
          <button className="btn btn-xs btn-ghost" onClick={() => setCurrentBet(Math.max(10, Math.round(currentBet / 2 / 10) * 10))}>½</button>
          <button className="btn btn-xs btn-ghost" onClick={() => setCurrentBet(Math.min(maxBet, currentBet * 2))}>2×</button>
          <button className="btn btn-xs btn-ghost" onClick={() => setCurrentBet(maxBet)}>MAX</button>
          {enableSideBets && (
            <>
              <div className="divider-v" style={{ height: 16, margin: '0 4px' }} />
              <SideBetControl label="PP" title="Perfect Pairs" boxes={activeBoxes} bets={ppBets} onSet={(b,v) => adjustSideBet(setPpBets, b, v)} color="oklch(0.65 0.15 295)" />
              <SideBetControl label="21+3" title="21+3" boxes={activeBoxes} bets={tpBets} onSet={(b,v) => adjustSideBet(setTpBets, b, v)} color="oklch(0.72 0.14 75)" />
            </>
          )}
        </div>
      </div>

      <button className="btn btn-primary btn-lg" disabled={!canDeal} onClick={doDeal} style={{ minWidth: 200, height: 64, fontSize: 15, letterSpacing: '0.04em' }}>
        DEAL
        <span className="kbd" style={{ background: 'rgba(0,0,0,0.18)', borderColor: 'rgba(0,0,0,0.25)', color: '#041007' }}>Space</span>
      </button>
    </div>
  );
}

function SideBetControl({ label, title, boxes, bets, onSet, color }) {
  const [open, setOpen] = useState(false);
  const activeAny = bets.slice(0, boxes).some(b => b > 0);
  return (
    <div style={{ position: 'relative' }}>
      <button className="btn btn-xs" style={{
        background: activeAny ? color : 'var(--bg-2)',
        color: activeAny ? '#0a0612' : 'var(--ink-1)',
        border: `1px solid ${activeAny ? color : 'var(--line)'}`,
        fontWeight: 600,
      }} onClick={() => setOpen(v => !v)}>{label}</button>
      {open && (
        <div className="panel fade-up" style={{ position: 'absolute', bottom: 32, left: 0, zIndex: 30, padding: 12, minWidth: 260, boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <div className="label-micro">{title}</div>
            <div style={{ flex: 1 }} />
            <button className="btn btn-xs btn-ghost" onClick={() => setOpen(false)}>Done</button>
          </div>
          {Array.from({ length: boxes }).map((_, b) => (
            <div key={b} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
              <div className="label-micro" style={{ width: 40 }}>Box {b+1}</div>
              <input type="number" value={bets[b] || 0} onChange={e => onSet(b, Number(e.target.value) || 0)} style={{ width: 80, fontSize: 12, padding: '4px 8px' }} min="0" step="5" />
              {SIDE_BET_PRESETS.map(p => (
                <button key={p} className="btn btn-xs btn-ghost" onClick={() => onSet(b, p)}>{p || 'off'}</button>
              ))}
            </div>
          ))}
          <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 8, lineHeight: 1.5 }}>
            {label === 'PP' ? 'Mixed 5× · Colored 10× · Perfect 25×' :
             'Flush 5× · Straight 10× · 3oK 30× · Straight Flush 40× · Suited 3oK 100×'}
          </div>
        </div>
      )}
    </div>
  );
}

function PlayingControls({ doHit, doStand, doDouble, doSplit, doSurrender, canSplit, canDouble, canSurrender }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', height: 60 }}>
      <button className="btn btn-primary btn-lg" onClick={doHit} style={{ minWidth: 130 }}>
        HIT
        <span className="kbd" style={{ background: 'rgba(0,0,0,0.15)', borderColor: 'rgba(0,0,0,0.2)', color: '#041007' }}>H</span>
      </button>
      <button className="btn btn-danger btn-lg" onClick={doStand} style={{ minWidth: 130 }}>
        STAND
        <span className="kbd" style={{ background: 'rgba(0,0,0,0.22)', borderColor: 'rgba(0,0,0,0.3)', color: '#fff' }}>S</span>
      </button>
      <button className="btn btn-warning btn-lg" onClick={doDouble} disabled={!canDouble} style={{ minWidth: 118 }}>
        DOUBLE
        <span className="kbd" style={{ background: 'rgba(0,0,0,0.15)', borderColor: 'rgba(0,0,0,0.2)', color: '#1a0e00' }}>D</span>
      </button>
      <button className="btn btn-lg" onClick={doSplit} disabled={!canSplit} style={{ minWidth: 118 }}>
        SPLIT
        <span className="kbd">P</span>
      </button>
      <button className="btn btn-lg" onClick={doSurrender} disabled={!canSurrender} style={{ minWidth: 130 }}>
        SURRENDER
        <span className="kbd">R</span>
      </button>
    </div>
  );
}

function TweaksPanel({ tweaks, setTweaks, onClose }) {
  const toggle = (k) => setTweaks(t => ({ ...t, [k]: !t[k] }));
  const setKey = (k, v) => setTweaks(t => ({ ...t, [k]: v }));
  const items = [
    ['showHud', 'HUD overlay (bust %)'],
    ['showStrategy', 'Basic-strategy hint'],
    ['dealerHitsSoft17', 'Dealer hits soft 17'],
    ['enableSideBets', 'Side bets (PP, 21+3)'],
    ['enableInsurance', 'Insurance on dealer Ace'],
    ['enableSurrender', 'Late surrender'],
    ['quickPlay', 'Quick play (faster dealer)'],
  ];
  const cardStyles = ['classic', 'mono', 'neon', 'glass'];
  const chipStyles = ['casino', 'mono', 'neon'];
  return (
    <div className="tweaks-panel fade-up">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Tweaks</div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-xs btn-ghost" onClick={onClose}>×</button>
      </div>
      {items.map(([k, label]) => (
        <div key={k} className="tweak-row">
          <div style={{ fontSize: 12 }}>{label}</div>
          <div className={`switch ${tweaks[k] ? 'on' : ''}`} onClick={() => toggle(k)} />
        </div>
      ))}
      <div style={{ borderTop: '1px solid var(--line)', margin: '10px 0 8px' }} />
      <div className="label-micro" style={{ marginBottom: 6 }}>Card face</div>
      <div className="seg" style={{ marginBottom: 10 }}>
        {cardStyles.map(s => (
          <button key={s} className={`seg-btn ${tweaks.cardStyle === s ? 'on' : ''}`} onClick={() => setKey('cardStyle', s)}>
            {s}
          </button>
        ))}
      </div>
      <div className="label-micro" style={{ marginBottom: 6 }}>Chip style</div>
      <div className="seg">
        {chipStyles.map(s => (
          <button key={s} className={`seg-btn ${tweaks.chipStyle === s ? 'on' : ''}`} onClick={() => setKey('chipStyle', s)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
