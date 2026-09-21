export default {
  id: "insurance-adl",
  stage: 12,
  order: 5,
  title: "Insurance Fund and ADL: Who Pays After Bankruptcy",
  difficulty: 3,
  prereqs: ["margin-liquidation"],

  oneLiner:
    "The liquidation waterfall is **position margin → insurance fund → auto-deleveraging (ADL) of profitable opposite accounts**. ADL does not “only hit the bankrupt account” — that account is already empty.",

  intuition: `
Linear leverage has a problem option buyers do not: a gap move can fill the close worse than bankruptcy, leaving **negative equity**. Someone must fill the hole or the two sides of the venue do not match.

Teaching waterfall (schematic, **not** a live fund balance):

1. Burn remaining margin in the position.
2. Tap the **insurance fund** (historical liq surplus, fee share, etc.).
3. If the fund is short, **ADL**: forcibly reduce **profitable opposite** accounts and use their mark-to-market to plug the hole.
4. Some designs then **socialize** leftover loss. Not every venue goes there.

**ADL hits surviving profitable counterparties**, not “the bankrupt name one more time.” If you think “ADL only hits the bankrupt account,” you have not understood the mechanism.

Teach FTX (**Nov 2022**) as **counterparty failure + a risk engine that did not isolate customer assets**, not as “perps are fake.” ADL exists so **remaining traders** eat bankrupt counterparties when the insurance fund is not enough.

**Four pieces:**

- **① Why a hole exists**
- **② The insurance fund is a buffer, not a mint**
- **③ ADL queue: who is cut first**
- **④ FTX: a failed venue, not a failed definition**
`,

  mechanics: `
### ① The hole

After mark trips liquidation, the engine must market-out the risk. Air pockets, cascades, latency — fills can be worse than the bankruptcy price. Linear obligation has no premium cap (Stages 1.1, 12.7).

Hole ≈ gap between bankruptcy and actual unwind, after fees.

### ② Insurance fund

A healthy venue parks some liquidation penalties and some fees into a fund so ordinary holes do not immediately ADL. The fund’s size moves; **this lesson does not quote a live TVL/fund print**. Demo 400 and 800 are slider fiction.

### ③ ADL

Typical priority: high leverage, high profit, accounts that “use” more of the venue’s insurance, on the opposite side. You can be right and still be flattened in a squeeze. That tail is native to perps; it is not the same as option assignment (Stage 2.4).

Older or emergency clauses may **socialize** residual loss across remaining positions. Read the rulebook; do not assume “worst case is my own margin.”

### ④ The FTX lesson

“So perps are a scam” is the wrong sentence. The right one: your linear book depends on the **venue’s risk engine, asset segregation, and fund governance**. An on-chain CLOB (Stage 12.6) changes some custody shape; oracles, validators, and bridges are still counterparty in another font.
`,

  demo: "adl-waterfall",

  analogy: `
The insurance fund is the building’s repair pot. Small holes come from the pot. When the pot is empty, the super **cuts the most profitable, highest-leverage opposite units** to patch the wall — that is ADL.

FTX was the super mixing the repair pot with the owner’s casino, and the lock was decorative. That is custody and governance, not “rent (funding) is a fake idea.”
`,

  misconceptions: [
    "**“ADL only hits the bankrupt account.”** — The bankrupt account is empty. ADL cuts profitable opposite accounts.",
    "**“An insurance fund means no ADL.”** — The fund is finite. Squeezes can empty it.",
    "**“FTX proved perps are fake.”** — FTX was counterparty and risk-engine failure. Learn the waterfall; do not undefine the product.",
    "**“I only sit on the winning side, so I cannot be ADL’d.”** — Winning *and opposite* is exactly the ADL gun-sight.",
    "**“DEX perps will never cut my position.”** — Depends on design. No boss ≠ no deleverage/socialization, and ≠ no oracle risk.",
  ],

  quiz: [
    {
      q: "When the insurance fund cannot cover a bankruptcy hole, whom does ADL typically cut?",
      options: ["Only the already-bankrupt account", "Profitable opposite accounts, by rule", "All option buyers", "CME dated futures"],
      answer: 1,
      explain: "The bankrupt account has nothing left. ADL rematches the book by cutting still-green opposite positions.",
    },
    {
      q: "Usual waterfall order?",
      options: ["ADL → margin → fund", "Margin → insurance fund → ADL (some designs then socialize)", "Only penalize market makers", "Confiscate premium first"],
      answer: 1,
      explain: "Burn local margin, then the fund, then ADL. Socialized loss is a last rung on some designs.",
    },
    {
      q: "The more accurate reading of FTX Nov 2022 is?",
      options: ["Funding math is false", "Counterparty + risk-engine / segregation failure", "Proof that mark equals last", "Proof Hyperliquid replaced Binance"],
      answer: 1,
      explain: "Teach venue failure, not a cancellation of the perp definition. The last two are stage rumors as well.",
    },
    {
      q: "“Perps have no risk because they never expire” fails in the waterfall because?",
      options: ["You may be ADL’d, or your profit used to fill someone else’s hole", "Dividends", "Perp buyers have a premium floor", "It does not fail"],
      answer: 0,
      explain: "No expiry still walks margin → fund → ADL. Green positions get named.",
    },
  ],

  further: [
    { label: "Binance: insurance fund and ADL", url: "https://www.binance.com/en/support/faq/auto-deleverage-adl-360033525272" },
    { label: "CFTC: FTX-related materials (venue failure, not product definition)", url: "https://www.cftc.gov/" },
  ],
};
