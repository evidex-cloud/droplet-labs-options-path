export default {
  id: "margin-liquidation",
  stage: 12,
  order: 4,
  title: "Margin and Liquidation: Isolated, Cross, Maintenance",
  difficulty: 2,
  prereqs: ["mark-index-last"],

  oneLiner:
    "Leverage eats the buffer: **initial margin** opens the trade, **maintenance margin** is the tripwire, breach it and you are liquidated on **mark**. Isolated blows up one position; **cross can drain the rest of the account.**",

  intuition: `
A perp is a margin product. Teaching formulas (USDT-m linear, no extra margin):

$$long liq ≈ entry × (1 − 1/leverage + MMR)
$$short liq ≈ entry × (1 + 1/leverage − MMR)

Entry 100, 10×, MMR=0.5%: long liq ≈ **90.5**, about 9.5% away. At 50× the buffer is ~**2.5%** — ordinary noise can retire you.

Notional is **1 coin or a USDT face**, not ×100.

- **Initial margin IM**: equity locked to open, roughly 1/leverage.
- **Maintenance margin MMR**: when equity hits this line, the engine starts.
- **Isolated**: margin is fenced in this position.
- **Cross**: account equity is shared. One hole can siphon hedges, spot balances, other coins.

Liquidation tests **mark** (Stage 12.2), not the candle wick.

**Four pieces:**

- **① IM vs MMR**
- **② Teaching liq price**
- **③ Isolated vs cross**
- **④ Leverage is not free convexity**
`,

  mechanics: `
### ① Initial vs maintenance

IM sizes what you can open; MMR sizes how far you can sink. MMR often steps up with leverage tier and notional. The demo’s 0.5% is a **teaching default**, not a live schedule.

Simplified equity ≈ margin ± mark-to-mark uPnL − fees. When equity ≤ MMR × notional, liquidation starts.

### ② Teaching liq price

The closed form assumes no extra margin, linear USDT, one-way. Live venues also chip fees, funding, and insurance-fund rates. Funding flowing out while you are “right” can walk the liq line toward you (Stage 12.3).

### ③ Isolated vs cross

Isolated: a ring-fenced pile. If it dies, loss is usually that pile (a hole can still enter the waterfall, Stage 12.5).

Cross: looks “harder to blow up” because the buffer is bigger; the cost is that **uncorrelated positions get drafted**. Hedgers especially lose the protection leg inside cross.

### ④ Not option leverage

A call buyer’s leverage is convexity with a premium floor (Stage 1.1). Perp leverage **steepens a line** with no floor. Treating 20× perp as a “cheap call” is a Stage 12.8 classic.
`,

  demo: "liq-price",

  analogy: `
Isolated is insuring each car alone. Cross is parking the family fortune in one garage — one fire can take the hedge car too.

Leverage shortens braking distance. 50× is a two-metre gap on a highway: not skill, physics.
`,

  misconceptions: [
    "**“Cross is safer because it is harder to liquidate.”** — Harder to liquidate *this* ticket; easier to lose the whole account. Hedges can be drained.",
    "**“Liq price is the candle low.”** — Usually mark (Stage 12.2).",
    "**“10× perp equals a long call: loss stops at the stake.”** — No premium floor; a hole can go to ADL.",
    "**“Maintenance margin equals initial margin.”** — MMR is lower. The band between them is your air.",
  ],

  quiz: [
    {
      q: "Teaching: entry 100, 20× long, MMR=0.5%, no extra margin. Reference liq ≈ ?",
      options: ["80", "95.5", "100.5", "120"],
      answer: 1,
      explain: "100 × (1 − 1/20 + 0.005) = 100 × 0.955 = **95.5**.",
    },
    {
      q: "The fact to remember about cross vs isolated?",
      options: ["Cross never liquidates", "Losses can tap equity from other positions in the account", "Cross has no funding", "Cross liquidates on last"],
      answer: 1,
      explain: "Cross shares equity: one pit can empty another book.",
    },
    {
      q: "How should perp notional usually be read?",
      options: ["Always ×100 like US equity options", "1 coin or a USDT face (do not blindly ×100)", "Always equal to premium", "Equal to the VIX"],
      answer: 1,
      explain: "Linear crypto perps are not equity-option multiplier products.",
    },
    {
      q: "“Perps have no risk because they never expire” ignores what?",
      options: ["Dividends", "Leveraged liquidation and margin", "The earnings calendar", "American early exercise"],
      answer: 1,
      explain: "The clock became funding; bust risk is still there and can arrive faster.",
    },
  ],

  further: [
    { label: "Binance: liquidation and margin", url: "https://www.binance.com/en/support/faq/liquidation-and-margin-360033525431" },
    { label: "CME: futures margin (dated-future contrast)", url: "https://www.cmegroup.com/education/courses/introduction-to-futures/margin-know-what-is-needed.html" },
  ],
};
