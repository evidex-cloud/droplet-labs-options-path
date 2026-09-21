export default {
  id: "perp-traps",
  stage: 12,
  order: 8,
  title: "Perp Traps: Funding Drag, Hidden Leverage, ADL, Fake APR",
  difficulty: 2,
  prereqs: ["funding-rate", "margin-liquidation", "insurance-adl"],

  oneLiner:
    "Flip slogans into testable sentences: **no expiry ≠ no risk**, **screen APR ≠ locked yield**, **HL ≠ replaced Binance**, **ADL ≠ only the bankrupt account**, **mark ≠ last**.",

  intuition: `
The first seven lessons each punch a hole. This one lines the holes into a checklist; the demo flips “unsafe” to “safer.”

Eight recurring pits:

1. **Hold forever**: positive funding taxes longs; leverage liquidates first.
2. **Fake APR**: one print × periods in a year.
3. **HL coronation**: on the Q1 2026 slice Binance is still an order of magnitude larger (CoinGlass, secondary).
4. **ADL hits the bankrupt name**: it hits profitable opposite accounts.
5. **Mark = last**: wick hunts.
6. **HIP-3 = stock**: linear price, not equity.
7. **Hidden leverage**: 10× plus option-premium averaging.
8. **Social liq maps as research**: entertainment, lag, performable.

**Four pieces:**

- **① Holding-cost traps**
- **② Venue and narrative traps**
- **③ Risk-engine traps**
- **④ How to use the checklist**
`,

  mechanics: `
### ① Holding cost

“Perps have no risk because they never expire” hid the clock. Recompute the teaching example (Stage 12.3): +0.01%/8h × 7 days × $100,000 notional = $210. Being right on direction is not being ahead of rent. That 10.95% annualization is not a Treasury.

### ② Narrative

Volume tables get an as-of date and a secondary label. Do not promote a 7.6% single-day all-exchange share (2026-06-08, secondary) into “already won.” HIP-3’s >$62B / ~$3B OI reports stay **uncertain**. CME is still dated futures.

### ③ Risk engine

Last-wicks, cross contagion, ADL of green books, empty insurance funds — linear leverage tails. Social liquidation maps turn other people’s corpses into content: lagged, gameable. Entertainment, not a research process.

### ④ Checklist

Five questions before you click: 1-coin or USDT notional? Teaching liq distance at this leverage? Funding interval and sign? Isolated or cross? If someone bankrupt, am I ADL fodder or ADL’d?

Not investment advice. Flipping the board only means you replaced slogans with sentences.
`,

  demo: "trap-board",

  analogy: `
A pre-flight checklist: fuel (margin buffer), wind (funding sign), alternate airport (isolated fences), and “do not treat the airport ad as radar” (liq maps, fake APR, coronation stories).

The list will not turn the plane into a car — a perp is still linear leverage. It only stops you flying as if “no expiry means we cannot crash.”
`,

  misconceptions: [
    "**“Perps have no risk because they never expire.”** — Funding, liq, ADL, mark source remain.",
    "**“The funding APR on screen is locked yield.”** — Snapshot annualization.",
    "**“Hyperliquid replaced Binance.”** — Not on the Q1 2026 slice.",
    "**“ADL only hits the bankrupt account.”** — It cuts profitable opposite accounts.",
    "**“Mark equals last; HIP-3 equals stock.”** — Both false; Stages 12.2 and 12.6.",
  ],

  quiz: [
    {
      q: "Which sentence is the safer phrasing?",
      options: ["Perps have no risk because they never expire", "No expiry still leaves funding and liquidation; APR is a snapshot, not locked yield", "Hyperliquid replaced Binance", "ADL only hits the bankrupt account"],
      answer: 1,
      explain: "The other three are this stage’s named slogans.",
    },
    {
      q: "One interval of +0.01%/8h times 3×365 ≈ 11% should be labeled as?",
      options: ["Realized risk-free return", "Fake APR / snapshot annualization, not a promise", "Deribit implied vol", "CME delivery price"],
      answer: 1,
      explain: "Stage 12.3’s core trap.",
    },
    {
      q: "The most honest use of a social liquidation map?",
      options: ["Treat it as live positioning and copy it", "Entertainment / lagged visualization, not a research conclusion", "Proof DEX perps have no counterparty risk", "A way to price HIP-3 as stock"],
      answer: 1,
      explain: "Maps can be performed and delayed; they are not the ledger.",
    },
    {
      q: "Why is mark = last wrong?",
      options: ["They are the same field", "Last can wick; liq and uPnL usually use mark", "Index equals premium", "Last does not exist"],
      answer: 1,
      explain: "Stage 12.2. Mixing them is hunting yourself.",
    },
  ],

  further: [
    { label: "CoinGlass Q1 2026 market-share report (check venue narratives)", url: "https://www.coinglass.com/learn/2026-q1-mktshare-report-en" },
    { label: "Binance: ADL explainer", url: "https://www.binance.com/en/support/faq/auto-deleverage-adl-360033525272" },
    { label: "Investopedia: options vs futures (shape contrast)", url: "https://www.investopedia.com/ask/answers/difference-between-options-and-futures/" },
  ],
};
