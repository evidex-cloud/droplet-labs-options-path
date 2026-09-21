export default {
  id: "funding-rate",
  stage: 12,
  order: 3,
  title: "Funding: Premium, Clamp, 8h vs 1h",
  difficulty: 2,
  prereqs: ["what-is-perp"],

  oneLiner:
    "Funding is the perp’s **rent**: positive rates, longs pay shorts. Ask “how many hours per print” before you compare %; annualizing one interval into an APR is the usual self-deception.",

  intuition: `
Perps must live forever and still hug spot, so they invented funding. Intuition:

- Perp **rich** to spot → crowded longs → **positive rate** → longs pay shorts.
- Perp **cheap** → negative rate → shorts pay longs.

Teaching example (**labeled teaching, not a measurement**): hold **1-coin notional** 7 days at **+0.01% per 8h**.

- 3 times a day × 7 = **21** settlements.
- Each pays 0.0001 × notional. Using a **teaching USDT notional of 100,000** (not a live coin price): 21 × 0.0001 × 100,000 = **$210**.
- In 1-coin units: **0.0021 coin** paid.

The same 0.01% on a **1h** venue is 24 times a day, not 3 — eight times more expensive. Binance USDM typically 8h (sometimes 4h); Hyperliquid usually hourly.

**Five pieces:**

- **① Where the premium index comes from**
- **② Clamps stop cartoon rates**
- **③ 8h vs 1h: normalize first**
- **④ Teaching ledger: 7 days at +0.01%/8h**
- **⑤ Snapshot annualization is a trap**
`,

  mechanics: `
### ① Premium index

Venues differ in coefficients; the skeleton is: take perp richness versus mark/index, mix in an interest term, produce the next funding print. Rich perp, positive funding. Do not memorize a 2026 coefficient table in this lesson — read the venue doc.

### ② Clamp

To stop a squeeze printing absurd single-interval rates, venues often **clamp** funding. Clamp means you must not assume “crowding pays shorts without bound.” The screen rate is already trimmed.

### ③ Cadence is not comparable

$$hourly-equivalent ≈ quoted rate / hours in the interval

Comparing Binance vs Hyperliquid “who has higher funding” without converting units is a category error. Stage 12.6’s venue differences are partly this clock.

### ④ Teaching ledger

7 days, +0.01%/8h, teaching notional $100,000:

$$n = 7 × 24 / 8 = 21
$$long pays = 100000 × 0.0001 × 21 = 210

1-coin notional: 0.0021 coin. Lesson numbers. **Do not write them as a live print.**

### ⑤ Fake APR

+0.01%/8h × 3 × 365 ≈ **10.95%** is “if the rate never moves and never flips.” It will. The demo contrasts **fake APR** with **realized cash over the hold**.

Recall Stage 5.4: the option buyer’s clock is Theta; the perp long’s clock under positive funding is rent. Neither is “hold and it goes up.”
`,

  demo: "funding-cost",

  analogy: `
A perp is an open-ended share-house. Rent (funding) posts every 8 hours or every hour depending on the landlord.

The app’s “11% APR” is **this bill × 365**. You would not take a utility bill to the bank as a CD. Funding APR is the same trick.
`,

  misconceptions: [
    "**“The funding APR on screen is locked yield.”** — Snapshot annualization. Cash = counts × print × notional. The sign can flip.",
    "**“Perps have no risk because they never expire.”** — Positive funding can leak while you are right; leverage can liquidate you first.",
    "**“Both venues show 0.01%, so they cost the same.”** — Ask the interval. 1h vs 8h is 8×.",
    "**“Negative funding makes a long free.”** — The rate can flip; you still have liq, slippage, and venue/engine risk (Stage 12.5).",
    "**“Annualized funding is comparable to a Treasury.”** — No. One is an optional, clamped swap rent.",
  ],

  quiz: [
    {
      q: "Teaching: +0.01% per 8h, hold 7 days, teaching notional $100,000. Approximate funding the long pays?",
      options: ["$7", "$210", "$10,950 (treat it as APR)", "$0 because there is no expiry"],
      answer: 1,
      explain: "21 × 0.0001 × 100,000 = **$210**. Teaching example. Annualizing 0.01% to ~11% then multiplying notional is the fake-APR trap.",
    },
    {
      q: "Positive funding usually means?",
      options: ["Shorts pay longs", "Longs pay shorts", "The venue subsidizes everyone", "Mark = last"],
      answer: 1,
      explain: "Positive = longs pay shorts.",
    },
    {
      q: "Why not compare a Binance funding % to a Hyperliquid % at face value?",
      options: ["One is an option", "Settlement intervals differ (typically 8h vs 1h); normalize first", "Hyperliquid replaced Binance", "Both numbers are fake"],
      answer: 1,
      explain: "Different clocks. And HL did not replace Binance (Stage 12.6).",
    },
    {
      q: "A one-interval rate times the number of intervals in a year should be read as?",
      options: ["Locked risk-free yield", "A snapshot annualization, not a promise", "Option implied vol", "Insurance-fund balance"],
      answer: 1,
      explain: "APR prints one receipt into a year. The market will not pin the rate for you.",
    },
  ],

  further: [
    { label: "Binance: USD-M funding", url: "https://www.binance.com/en/support/faq/360033525271" },
    { label: "CoinGlass funding page (secondary; watch interval)", url: "https://www.coinglass.com/FundingRate" },
  ],
};
