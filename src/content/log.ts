export const KINDS = {
  build: "Build",
  write: "Write",
  research: "Research",
  print: "Print",
  video: "Video",
  home: "Home",
  invest: "Invest",
} as const;

export type Kind = keyof typeof KINDS;

export type LogEntry = {
  /** ISO day the thing shipped. For work that ran several days, the first day. */
  date: string;
  /** Last day, for work that ran several days. */
  until?: string;
  kind: Kind;
  title: string;
  deck: string;
  /** A public link, when one exists. */
  href?: string;
  /** File name under /public/log, without the extension. */
  image?: string;
};

const FULLMARKS = "https://fullmarks.sg";

// Newest first. Every line here has to be true and safe to publish:
// no client or operator names, no money, health or address details.
export const log: LogEntry[] = [
  {
    date: "2026-10-01",
    kind: "build",
    title: "This site gets rebuilt",
    deck: "The old front page listed eight sections next to a spinning top. This one lists what was made, by date.",
  },
  {
    date: "2026-10-01",
    kind: "build",
    title: "FullMarks lets strangers try it first",
    deck: "FullMarks marks Singapore exam answers against the mark scheme. Anyone can now have an answer marked before making an account. Four more subject pages and three chapter guides went up the same day.",
    href: FULLMARKS,
    image: "fullmarks",
  },
  {
    date: "2026-10-01",
    kind: "invest",
    title: "Five more names on the portfolio page",
    deck: "Nous Research, Dyna Robotics, Acier, Replit and Atoms join the portfolio page.",
    href: "/investments",
  },
  {
    date: "2026-09-30",
    kind: "build",
    title: "Every coding agent on the Mac now reads the same rules",
    deck: "One instructions file and one skills folder, linked into each tool. One copy, so there is one place to edit.",
  },
  {
    date: "2026-09-27",
    until: "2026-09-28",
    kind: "build",
    title: "Groundcrew Robotics gets a 40 second film and a research hub",
    deck: "Groundcrew is building the distribution layer for robotics in Southeast Asia. The site and logo went up two weeks earlier.",
    href: "https://groundcrewrobotics.com",
    image: "groundcrew",
  },
  {
    date: "2026-09-26",
    until: "2026-09-30",
    kind: "print",
    title: "Cable winder, hanger organiser and two more models queued for the printer",
    deck: "Prepared for a Bambu P2S between 26 and 30 Sep.",
  },
  {
    date: "2026-09-25",
    kind: "write",
    title: "A robotics primer, from the joint up",
    deck: "How humanoids and service robots work, who builds them and what the parts cost. Eighteen chapters with original drawings and sourced numbers.",
    href: "https://groundcrewrobotics.com/research/primer",
    image: "robotics-primer",
  },
  {
    date: "2026-09-24",
    kind: "video",
    title: "Yuzu Money gets a 30 second launch video",
    deck: "Six scenes, cut on the bar lines of a 128 BPM track.",
    href: "https://yuzu.money",
    image: "yuzu-video",
  },
  {
    date: "2026-09-17",
    kind: "build",
    title: "A downloader for a very long list of saved videos",
    deck: "Paste the links. It checks each one, downloads what it finds and reports back per link.",
  },
  {
    date: "2026-09-09",
    until: "2026-09-11",
    kind: "build",
    title: "Two chance games that run in a browser tab",
    deck: "Each game is plain maths first, so a simulator can prove the house edge before anyone plays a round.",
  },
  {
    date: "2026-09-07",
    kind: "build",
    title: "A bot that forwards X posts to Telegram",
    deck: "Tell it which accounts to watch and new posts arrive in the chat. Every chat keeps its own list.",
  },
  {
    date: "2026-09-06",
    kind: "build",
    title: "The memecoin bot gets rebuilt",
    deck: "The trading rules live in a written playbook. The bot follows it.",
  },
  {
    date: "2026-09-04",
    kind: "build",
    title: "NKHY launches",
    deck: "A memecoin paired to a stock, with its own site.",
    href: "https://nkhynix.com",
    image: "nkhy",
  },
  {
    date: "2026-08-29",
    kind: "home",
    title: "Home wifi, tuned",
    deck: "One router, retuned.",
  },
  {
    date: "2026-08-28",
    kind: "research",
    title: "Went looking for the 52 hertz whale. Stopped at day 396.",
    deck: "396 days of open hydrophone recordings from Monterey Bay were banked before the download was paused. The call has drifted lower since it was first heard, so the search has to match the shape of the call.",
  },
  {
    date: "2026-08-28",
    kind: "research",
    title: "Six theories of eel navigation meet 106 real eels",
    deck: "Pure drift is ruled out. A fixed compass heading ties with steering for a goal.",
    image: "eel",
  },
  {
    date: "2026-08-28",
    kind: "home",
    title: "A home lab corner, drawn before anything is bought",
    deck: "A 3D technical drawing you can orbit, with an exact parts list.",
  },
  {
    date: "2026-08-26",
    kind: "write",
    title: "Eight field manuals for the admin of adult life",
    deck: "Retirement savings, tax, estates, cars, renovation, banking and healthcare among them. Every figure checked against an official source.",
  },
  {
    date: "2026-08-25",
    kind: "write",
    title: "Insurance, audited without an agent",
    deck: "Every policy in the folder audited, then written up as a guide to doing the same.",
  },
  {
    date: "2026-08-25",
    kind: "build",
    title: "The phone becomes a trackpad for the Mac",
    deck: "A web page on the phone moves the cursor, types, controls media and takes dictation. Nothing to install on the phone.",
  },
  {
    date: "2026-08-24",
    kind: "build",
    title: "The wall TV now takes orders from a terminal",
    deck: "One command switches it on, sets the volume or puts a dashboard on screen.",
  },
  {
    date: "2026-08-21",
    kind: "build",
    title: "FullMarks adds General Paper and H2 Economics",
    deck: "470 General Paper essays and the Economics essay paper went live on the same day.",
    href: FULLMARKS,
  },
  {
    date: "2026-08-19",
    kind: "build",
    title: "FullMarks opens to primary school",
    deck: "PSLE Maths and Science go live.",
    href: FULLMARKS,
  },
  {
    date: "2026-08-17",
    kind: "write",
    title: "A teardown of fast casino games, in two languages",
    deck: "A slide deck in English and Chinese. Each language builds from a script, so neither is edited by hand.",
  },
  {
    date: "2026-08-14",
    kind: "home",
    title: "The home folder gets tidied by a script",
    deck: "Code in one place, data in another, finished one-offs archived. A second script undoes all of it.",
  },
  {
    date: "2026-08-12",
    kind: "research",
    title: "Rank 1 on Paradigm's RSI Simulator, for a while",
    deck: "On 12 Aug a run of 127.70 months beat the previous record by 12.5 months, played as @0xVega. The board has moved on since.",
    href: "https://www.paradigm.xyz/puzzles/rsi",
  },
  {
    date: "2026-08-06",
    until: "2026-08-14",
    kind: "print",
    title: "Man prints butterfly knife trainer. It fails again.",
    deck: "A plastic practice knife. Six versions of the print file exist. Cat toys and a dock were on the print list the same month.",
  },
  {
    date: "2026-08-06",
    kind: "build",
    title: "FullMarks gets homework",
    deck: "Teachers set it and sign off the marking.",
    href: FULLMARKS,
  },
  {
    date: "2026-07-31",
    kind: "build",
    title: "A logger for custody transfers and their compliance checks",
    deck: "Built to write each transfer and its screening result as one row in a spreadsheet.",
  },
  {
    date: "2026-07-30",
    until: "2026-07-31",
    kind: "write",
    title: "Ten primers, started in one night",
    deck: "Cars, home robotics, gardening, astronomy, materials, energy, control systems, distribution, building science and capital structure. The folders were created between 23:55 and 02:35. Each one was written to learn the subject.",
    href: "https://garden-primer.vercel.app",
    image: "primer-garden",
  },
  {
    date: "2026-07-27",
    kind: "build",
    title: "An upstream fix for a mouse that would not connect",
    deck: "An open source driver could not see the mouse over Bluetooth. One lost message was aborting a handshake of about 35 steps. Pull request 469, merged on 10 Aug.",
    href: "https://github.com/AprilNEA/OpenLogi/pull/469",
    image: "openlogi",
  },
  {
    date: "2026-07-18",
    kind: "build",
    title: "FullMarks gets a 20 second landing animation",
    deck: "It plays in the page itself. There is no video file.",
    href: FULLMARKS,
  },
  {
    date: "2026-07-16",
    kind: "research",
    title: "Who deposits into crypto casinos",
    deck: "An on-chain study of depositor wallets at six large casinos: which exchanges fund them, which bridges they cross and how much the crowds overlap.",
  },
  {
    date: "2026-07-06",
    kind: "write",
    title: "Humanity's Last Ledger",
    deck: "Four long essays on trustless money, read over a coin made of points.",
    href: "https://last-ledger.vercel.app",
    image: "last-ledger",
  },
  {
    date: "2026-06-25",
    kind: "invest",
    title: "The portfolio page reaches 82 companies",
    deck: "Eleven holdings added in one commit.",
    href: "/investments",
  },
  {
    date: "2026-06-24",
    kind: "write",
    title: "A fundamental view of the robotics landscape",
    deck: "A feature essay, published as a site and a PDF.",
    href: "https://robotics-landscape.vercel.app",
    image: "robotics-landscape",
  },
  {
    date: "2026-05-25",
    kind: "build",
    title: "State of the World: fifty indicators on one page",
    deck: "Small charts, side by side, across eight domains.",
    href: "/projects/state-of-world",
    image: "state-of-world",
  },
  {
    date: "2026-04-22",
    until: "2026-04-23",
    kind: "build",
    title: "A blackjack simulator with a Monte Carlo lab",
    deck: "It runs millions of hands against a chosen rule set and plots what happens to the bankroll.",
    href: "/projects/blackjack",
    image: "blackjack",
  },
  {
    date: "2026-04-22",
    kind: "build",
    title: "kohjunhao.com, first version",
    deck: "Nine routes on day one. Version 12 by the next day.",
  },
];
