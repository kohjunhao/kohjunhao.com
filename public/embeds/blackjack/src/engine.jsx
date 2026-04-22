/* Blackjack engine — pure logic, no React */

const SUITS = ['S', 'H', 'D', 'C']; // spades, hearts, diamonds, clubs
const RANKS = ['A','2','3','4','5','6','7','8','9','T','J','Q','K'];
const RANK_VALUE = { 'A': 11, '2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'T':10,'J':10,'Q':10,'K':10 };

function makeShoe(numDecks = 6) {
  const shoe = [];
  for (let d = 0; d < numDecks; d++) {
    for (const s of SUITS) {
      for (const r of RANKS) {
        shoe.push({ r, s, id: `${d}-${s}${r}-${Math.random().toString(36).slice(2, 7)}` });
      }
    }
  }
  // Fisher-Yates
  for (let i = shoe.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shoe[i], shoe[j]] = [shoe[j], shoe[i]];
  }
  return shoe;
}

function handValue(cards) {
  // returns { total, soft } where soft means an ace counted as 11
  let total = 0;
  let aces = 0;
  for (const c of cards) {
    total += RANK_VALUE[c.r];
    if (c.r === 'A') aces++;
  }
  let soft = aces > 0;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
    if (aces === 0) soft = false;
  }
  // still soft only if at least one ace remains counted as 11
  if (soft) {
    // verify
    let check = 0, a = 0;
    for (const c of cards) { check += RANK_VALUE[c.r]; if (c.r === 'A') a++; }
    // if removing tens still leaves one ace as 11 within total
    soft = (total <= 21 && cards.some(c => c.r === 'A') && total !== cards.reduce((s,c) => s + (c.r==='A'?1:RANK_VALUE[c.r]), 0));
  }
  return { total, soft };
}

function isBlackjack(cards) {
  if (cards.length !== 2) return false;
  const hasAce = cards.some(c => c.r === 'A');
  const hasTen = cards.some(c => RANK_VALUE[c.r] === 10);
  return hasAce && hasTen;
}

/* Probability of busting on next hit given a hand total and shoe composition (approx).
   We treat shoe as infinite-ish: use remaining shoe counts for accuracy. */
function bustProbability(cards, shoe) {
  const { total, soft } = handValue(cards);
  if (total >= 21) return soft ? 0 : 1;
  if (total <= 11) return 0;
  // remaining counts per value
  const counts = {};
  let tot = 0;
  for (const c of shoe) {
    const v = RANK_VALUE[c.r];
    counts[v] = (counts[v] || 0) + 1;
    tot++;
  }
  if (tot === 0) return 0;
  let bustWays = 0;
  for (let v = 2; v <= 11; v++) {
    const n = counts[v] || 0;
    // If drawing value v causes bust
    // If hand is soft, an ace can convert, so treat ace value as 1 when in soft mode
    let newTotal;
    if (soft) {
      // current total has ace counted as 11, so if new card makes >21 we convert ace -> 1 -> total -10
      newTotal = total + (v === 11 ? 1 : v); // drawn ace becomes 1
      if (newTotal > 21) newTotal -= 10; // convert our original ace
    } else {
      newTotal = total + (v === 11 ? 1 : v);
    }
    if (newTotal > 21) bustWays += n;
  }
  return bustWays / tot;
}

/* Side bet evaluation */
function rankIndex(r) { return RANKS.indexOf(r); }

function evalPerfectPairs(p1, p2) {
  // returns multiplier (0 if no pair, 5 mixed, 10 colored, 25 perfect) — common paytable
  if (p1.r !== p2.r) return 0;
  if (p1.s === p2.s) return 25; // perfect pair (same suit)
  const redSuits = ['H','D'];
  const blackSuits = ['S','C'];
  const sameColor = (redSuits.includes(p1.s) && redSuits.includes(p2.s)) ||
                    (blackSuits.includes(p1.s) && blackSuits.includes(p2.s));
  return sameColor ? 10 : 5;
}

function evalTwentyOnePlusThree(p1, p2, dealerUp) {
  // p1, p2 player's first two; dealerUp = dealer's up card. Returns multiplier.
  const cards = [p1, p2, dealerUp];
  const suits = cards.map(c => c.s);
  const ranks = cards.map(c => c.r);
  const allSameSuit = suits.every(s => s === suits[0]);
  const rankVals = ranks.map(rankIndex).sort((a,b)=>a-b);
  const isStraight =
    (rankVals[2] - rankVals[1] === 1 && rankVals[1] - rankVals[0] === 1) ||
    // Ace-low straight: A,2,3 -> indices 0,1,2 already handled; Q,K,A -> 11,12,0 -> special
    (rankVals[0] === 0 && rankVals[1] === 11 && rankVals[2] === 12);
  const counts = {};
  for (const r of ranks) counts[r] = (counts[r] || 0) + 1;
  const isThreeKind = Object.values(counts).some(c => c === 3);

  // paytable (common): Suited three of a kind 100, Straight flush 40, Three of a kind 30, Straight 10, Flush 5
  if (isThreeKind && allSameSuit) return 100;
  if (isStraight && allSameSuit) return 40;
  if (isThreeKind) return 30;
  if (isStraight) return 10;
  if (allSameSuit) return 5;
  return 0;
}

/* Dealer plays: hits on soft 17 (H17) by default */
function dealerPlay(dealerCards, shoe, hitSoft17 = true) {
  const out = [...dealerCards];
  let used = 0;
  while (true) {
    const { total, soft } = handValue(out);
    if (total < 17) {
      out.push(shoe[used++]);
      continue;
    }
    if (total === 17 && soft && hitSoft17) {
      out.push(shoe[used++]);
      continue;
    }
    break;
  }
  return { cards: out, consumed: used };
}

/* Settle one hand vs dealer, returning payout multiplier on stake.
   Blackjack pays 3:2 (i.e. 1.5x stake + stake back = 2.5x return). We return NET win (excludes stake) so:
   - blackjack = +1.5 * stake
   - regular win = +1 * stake
   - push = 0
   - loss/bust = -1 * stake
   - doubled hand wins/losses: the stake is 2x the base bet (handled at call site: pass stake = baseBet * (doubled ? 2 : 1))
*/
function settleHand(playerCards, dealerCards, opts = {}) {
  const pv = handValue(playerCards).total;
  const dv = handValue(dealerCards).total;
  const pBJ = opts.naturalBJ; // caller marks if this hand was a natural (not from split)
  const dBJ = isBlackjack(dealerCards);

  if (pv > 21) return { outcome: 'bust', net: -1 };
  if (pBJ && !dBJ) return { outcome: 'bj', net: 1.5 };
  if (dBJ && !pBJ) return { outcome: 'loss', net: -1 };
  if (pBJ && dBJ) return { outcome: 'push', net: 0 };
  if (dv > 21) return { outcome: 'win', net: 1 };
  if (pv > dv) return { outcome: 'win', net: 1 };
  if (pv < dv) return { outcome: 'loss', net: -1 };
  return { outcome: 'push', net: 0 };
}

/* Basic-strategy advisor — rule-aware (H17/S17, decks, DAS) */
function basicStrategy(playerCards, dealerUp, opts = {}) {
  const canDouble = opts.canDouble ?? true;
  const canSplit = opts.canSplit ?? true;
  const canSurrender = opts.canSurrender ?? true;
  const h17 = opts.h17 ?? true;                   // dealer hits soft 17
  const decks = opts.decks ?? 6;                  // 1 = single deck, >=4 multi
  const das = opts.das ?? true;                   // double after split allowed
  const singleDeck = decks === 1;

  const dv = RANK_VALUE[dealerUp.r];
  const { total, soft } = handValue(playerCards);
  const isPair = playerCards.length === 2 && playerCards[0].r === playerCards[1].r;

  // Pair splitting (multi-deck, H17, DAS — most common)
  if (isPair && canSplit) {
    const r = playerCards[0].r;
    if (r === 'A' || r === '8') return 'P';
    if (r === '9') { if (dv !== 7 && dv !== 10 && dv !== 11) return 'P'; }
    else if (r === '7') { if (dv <= 7) return 'P'; }
    else if (r === '6') { if (dv >= 2 && dv <= 6) return 'P'; if (dv === 2 && !das) { /* hit */ } }
    else if (r === '4') { if (das && (dv === 5 || dv === 6)) return 'P'; }
    else if (r === '3' || r === '2') { if (dv >= 2 && dv <= 7) return 'P'; if (dv <= 3 && !das) { /* hit */ } }
    // 10s/5s never split
  }

  // Soft totals
  if (soft) {
    if (total >= 20) return 'S';
    if (total === 19) { if (h17 && dv === 6 && canDouble) return 'Ds'; return 'S'; }
    if (total === 18) {
      if (dv >= 2 && dv <= 6 && canDouble) return 'Ds';
      if (dv >= 9) return 'H';
      return 'S';
    }
    if (total === 17) { if (dv >= 3 && dv <= 6 && canDouble) return 'D'; return 'H'; }
    if (total === 16 || total === 15) { if (dv >= 4 && dv <= 6 && canDouble) return 'D'; return 'H'; }
    if (total === 14 || total === 13) { if (dv >= 5 && dv <= 6 && canDouble) return 'D'; return 'H'; }
    return 'H';
  }

  // Hard totals — surrender rules change by H17/S17 and single-deck
  if (canSurrender && !singleDeck) {
    if (total === 16 && (dv === 9 || dv === 10 || dv === 11)) return 'Rh';
    if (total === 15 && dv === 10) return 'Rh';
    if (h17 && total === 15 && dv === 11) return 'Rh';
    if (h17 && total === 17 && dv === 11) return 'Rs';
    if (h17 && total === 16 && dv === 11) return 'Rh';
  }

  if (total >= 17) return 'S';
  if (total >= 13 && total <= 16) return dv <= 6 ? 'S' : 'H';
  if (total === 12) return (dv >= 4 && dv <= 6) ? 'S' : 'H';
  if (total === 11) {
    if (singleDeck || (h17 && dv !== 11) || (!h17 && dv <= 10)) return canDouble ? 'D' : 'H';
    return canDouble ? 'D' : 'H';
  }
  if (total === 10) return (dv <= 9 && canDouble) ? 'D' : 'H';
  if (total === 9) {
    if (singleDeck && dv === 2 && canDouble) return 'D';
    return (dv >= 3 && dv <= 6 && canDouble) ? 'D' : 'H';
  }
  if (singleDeck && total === 8 && dv >= 5 && dv <= 6 && canDouble) return 'D';
  return 'H';
}

const ACTION_LABEL = {
  H: 'HIT', S: 'STAND', D: 'DOUBLE', Ds: 'DOUBLE / STAND',
  P: 'SPLIT', R: 'SURRENDER', Rh: 'SURRENDER / HIT', Rs: 'SURRENDER / STAND',
};

Object.assign(window, {
  SUITS, RANKS, RANK_VALUE,
  makeShoe, handValue, isBlackjack, bustProbability,
  evalPerfectPairs, evalTwentyOnePlusThree,
  dealerPlay, settleHand,
  basicStrategy, ACTION_LABEL,
});
