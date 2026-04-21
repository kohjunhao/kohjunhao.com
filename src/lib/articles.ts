export type Article = {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  dateLabel: string;
  venue: "Paragraph" | "kohjunhao.com";
  venueUrl?: string;
  tags: string[];
  excerpt: string;
  body: string;
};

export const articles: Article[] = [
  {
    slug: "convex-writeup",
    title: "A Write-up on Convex",
    subtitle: "Curve AMM, the ve-model, and how Convex captured bribes",
    date: "2022-06-30",
    dateLabel: "2022.06.30",
    venue: "Paragraph",
    venueUrl: "https://paragraph.com/@0xvega",
    tags: ["defi", "curve", "convex", "tokenomics"],
    excerpt:
      "Curve is an Automated Market Maker (AMM) that focuses on pools with similar asset types. The ve-model reshaped how yield and governance compound on top of each other — and Convex built the most efficient wrapper for capturing that value.",
    body: `Curve is an Automated Market Maker (AMM) that focuses on pools with similar asset types — stablecoins, wrapped BTC pairs, and liquid staking derivatives. Because the pool's invariant minimizes slippage between correlated assets, it became the dominant venue for stablecoin swaps and liquid-staking unwinds.

## The ve-model, briefly

Curve introduced vote-escrowed tokens (veCRV). Locking CRV for up to four years grants voting weight over which pools receive CRV emissions, plus a share of protocol fees. The design rewards long-term alignment and makes governance expensive to attack.

## What Convex changed

Convex aggregates CRV locked by holders, pools the voting power, and redirects emissions to its own wrapped pools. For CRV holders, Convex offers:

- Liquid exposure (cvxCRV) instead of a 4-year lock
- Boosted yield via Convex's aggregated veCRV
- A share of bribes paid by other protocols chasing Curve emissions

The mechanism is elegant: Convex sits one layer above Curve, extracting coordination rents that individual holders couldn't capture alone.

## Valuation notes

The relevant multiples aren't P/E ratios — they're *bribe revenue per locked unit* and *emission capture rate*. These moved unpredictably during the bribe-market build-out of 2021–22, and any valuation model had to account for the reflexivity between CVX price and voting power accrual.`,
  },
  {
    slug: "web3-state-and-improvements",
    title: "Web3's Current State and Improvements",
    subtitle: "Where the stack is actually shipping, and where it's hand-waving",
    date: "2022-06-25",
    dateLabel: "2022.06.25",
    venue: "Paragraph",
    venueUrl: "https://paragraph.com/@0xvega",
    tags: ["web3", "protocols", "infrastructure"],
    excerpt:
      "Mirror Protocol is a decentralized alternative to publishing apps like Substack and Medium. The broader Web3 stack has matured in places most headlines miss — storage, identity, and publishing are all further along than people assume.",
    body: `Mirror Protocol is a decentralized alternative to publishing apps like Substack and Medium. It stores posts on Arweave, uses ENS for identity, and lets writers tokenize their work through crowdfunds and editions.

## The layers that are actually working

Three stacks have matured past vaporware:

**Storage.** Arweave and IPFS+Filecoin have shipped real permanence for real content. Publishers and indexers rely on them daily. The UX is still fiddly, but the primitive works.

**Identity.** ENS reshaped how wallets present themselves. "Send to vitalik.eth" is a better UX than "Send to 0x..." and the name service doubles as a lightweight profile layer.

**Publishing.** Mirror, Paragraph, and friends let writers own their distribution list (a wallet subscription, not an email) and monetize without a platform gatekeeper.

## The layers still hand-waving

Social graphs remain mostly centralized. On-chain reputation is more demo than product. "Decentralized compute" still means "expensive single-machine verification" in nearly every live system.

The pattern: Web3 wins where permanence and ownership of an asset matter. It loses where low-latency coordination matters. That's not a permanent limitation, but it's the one to plan around in 2022.`,
  },
  {
    slug: "new-protocols-q2-2022",
    title: "New Protocols to Look Out For: Q2 2022",
    subtitle: "A roundup of launches worth tracking this quarter",
    date: "2022-04-25",
    dateLabel: "2022.04.25",
    venue: "Paragraph",
    venueUrl: "https://paragraph.com/@0xvega",
    tags: ["protocols", "launches", "research"],
    excerpt:
      "Retrograde aims to be the Convex model in the Terra ecosystem. A curated list of launches worth watching, with honest notes on what's novel and what's a re-skin.",
    body: `Most "new" protocols in any given quarter are re-skins of something that worked last quarter. A few are structurally different. Here are the ones worth tracking in Q2 2022.

## Retrograde

Aims to be the Convex model in the Terra ecosystem — aggregate locked ASTRO, redirect emissions, capture bribes. The strategy is proven; the question is whether Terra's bribe market becomes large enough to matter.

## Multichain-native protocols

A handful of teams are launching on several L2s simultaneously, treating each chain as a distribution surface rather than a home. Watch how they handle liquidity fragmentation — the ones solving it well will compound advantages.

## Retroactive rewards

Optimism's retroactive public goods funding inspired a wave of similar programs. Read the design docs carefully — "retroactive" covers everything from genuinely-retroactive-grants to thinly-disguised pre-mines.

## What I'm not tracking

Yield optimizers that just wrap existing vaults. Fork-of-a-fork DEXs. NFT launches whose thesis is "what if bored apes but different theme." None of these are bad, but none will matter in twelve months.`,
  },
  {
    slug: "defi-1-problems-and-road-back",
    title: "DeFi 1.0: The Problems and the Road Back Up",
    subtitle: "Why the DPI is underperforming — and what has to change",
    date: "2022-04-25",
    dateLabel: "2022.04.25",
    venue: "Paragraph",
    venueUrl: "https://paragraph.com/@0xvega",
    tags: ["defi", "market", "analysis"],
    excerpt:
      "The DPI (DeFi Pulse Index) has underperformed the broader crypto market through this cycle. Some of that is macro — but most of it is structural: fee capture, token utility, and the end of mercenary liquidity.",
    body: `The DeFi Pulse Index has underperformed the broader crypto market through this cycle. Some of that is macro — rates, risk-off, deleveraging. But a larger share is structural, and it's worth naming.

## Three structural drags

**Fee capture disconnects from token value.** Many DeFi 1.0 tokens accrue governance rights but not cash flow. "Fee switch" debates have dragged on for years with no activation. Tokenholders earn emissions, not revenue.

**Utility is mostly incentive-seeking.** When emissions normalize, the natural demand for the token (beyond governance) is small. Liquidity evaporates the quarter after rewards halve.

**Mercenary liquidity leaves first.** TVL headlines masked how much of it was emission-farmed, wrapped, re-deposited, and double-counted. The honest TVL of DeFi 1.0 in late 2022 is a small fraction of the peak number.

## The road back

Tokens that directly accrue fees. Protocols that route revenue to holders without governance theater. Less flashy launches, more durable cash flow. A slower, quieter cycle of building out real utility rather than mercenary yield.

Nothing in this list is novel. All of it is overdue.`,
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
