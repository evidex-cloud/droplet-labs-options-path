export default {
  id: "what-is-perp",
  stage: 12,
  order: 1,
  title: "What Is a Perp: A Linear Swap With No Expiry",
  difficulty: 1,
  prereqs: ["options-vs-others"],

  oneLiner:
    "A perpetual future (perp) is a **linear swap with no delivery date**: you post margin to track the underlying; the clock is not expiry but **funding**. It looks like a future, but it is not a CME dated future and it is not an option.",

  intuition: `
Stage 0.4 drew stocks, dated futures, and options as three payoff shapes. In 2026 crypto, the linear leveraged product retail actually meets is usually the **perp** — no expiry, funding settlements, mark-price margining.

Teaching notional (not a live coin price): **1 coin or a USDT face**, index entry 100.

- **Spot**: buy 1 coin fully funded; +1 in price is +1 in P&L; to zero you lose the capital; no funding.
- **Dated future** (e.g. CME BTC): still a straight line, but on margin; it delivers or you roll. The clock is the **delivery date**.
- **Perp**: also a line, also margin, also liquidatable; **no delivery**. Longs and shorts pay each other funding so the contract cannot sit away from spot forever. Positive funding = longs pay shorts.
- **Long call** (Stage 1.1): hockey-stick, buyer loses at most the premium, Theta applies.

One line: **perp = linear + leverage + no expiry + a funding clock.** It is not a fake future and not an option. Do not multiply by the equity-options **×100** — perps are usually **1-coin or USDT notional**.

**This lesson splits the perp into five pieces:**

- **① A linear swap, not a right**
- **② The clock is funding, not delivery**
- **③ How it differs from a CME dated future**
- **④ How it differs from an option (convexity, premium, Theta)**
- **⑤ Notional: 1 coin / USDT, not ×100**
`,

  mechanics: `
### ① A linear swap, not a right

For a long, schematic P&L is:

$$PnL ≈ (mark − entry) × notional − cumulative funding
$$shorts flip the sign. No max(·,0), no kink.

Like the future in Stage 0.4 this is a **straight-line obligation**: both sides post margin. A wrong move can wipe the margin and then walk the waterfall in Stage 12.5 (insurance fund, ADL). There is no “I only bought a right.”

### ② The clock is funding, not delivery

Dated futures pin futures to spot with delivery. Perps cancel delivery and use **funding**: when the perp trades rich to the spot basket, longs pay shorts, which nudges people to fade the rich print. Cheap perp, the other way.

Cadence differs by venue (Stage 12.3): Binance USDM is typically **8 hours** (sometimes 4h on some markets); Hyperliquid is usually **hourly**. The on-screen % is **not comparable** until you normalize.

### ③ Versus CME dated futures

CME bitcoin futures are **dated, regulated** contracts — different margin, settlement, and users. You can roll, but each contract still has a last trade date.

Perps bake “always roll” into the product. Both are linear. **Do not paste offshore funding logic onto a CME quarterly**, and do not treat CME as a perp venue. Map: Stage 12.6.

### ④ Versus options

Recall Stage 1.1 and Stage 5.4: option buyers pay premium, the payoff kinks, the bleed is Theta, and a long option can expire to zero **without a last-price liquidation putting you in debt** (the buyer). Perps have no premium floor, a liq price, and funding.

How to pick among three bullish tools is Stage 12.7: BTC perp, Deribit coin options, IBIT equity options.

### ⑤ Notional

Say **1-coin notional** or **N USDT notional**. Entry 100, mark 110, 1-coin long makes 10 quote units before funding. Do not auto-×100 — that is the equity-option multiplier (Stage 1.4).

> Every number here is schematic. Not investment advice. No “right now” BTC price or live funding print.
`,

  demo: "perp-vs-future",

  analogy: `
Four ways to track a house price:

- **Spot**: buy the house.
- **Dated future**: agree to settle in a named month; post a deposit (margin).
- **Perp**: an open-ended position that tracks the house, with a **balancing rent** (funding) every few hours.
- **Call**: a small deposit for the *right* to buy; worst case you lose the deposit (Stage 1.1).

The trap: “no expiry, I can hold forever” — while rent (funding) and eviction (liquidation) are still on the lease.
`,

  misconceptions: [
    "**“Perps have no risk because they never expire.”** — No delivery date is not no cost. Positive funding taxes longs; leverage can liquidate you first. Stages 12.3 and 12.4.",
    "**“A perp is just a future, and options are similar derivatives.”** — Shape differs. Perps/dated futures are line obligations; options are kinked rights. Stage 0.4 still holds; crypto retail simply added a no-expiry line.",
    "**“Perp P&L should be ×100 like US equity options.”** — No. Usually 1-coin or USDT notional. ×100 is the equity multiplier.",
    "**“Dated bitcoin futures are obsolete.”** — CME-style dated futures still exist. Perps are a different product line.",
  ],

  quiz: [
    {
      q: "The core product difference between a perp and a traditional dated future is?",
      options: ["Perps have no risk", "Perps use funding instead of a delivery date to pin to spot", "Perps are options so they have Theta", "Perps guarantee a positive return"],
      answer: 1,
      explain: "Perps cancel delivery and use funding to anchor to a spot basket. No expiry ≠ no risk.",
    },
    {
      q: "Teaching notional 1 coin, entry 100, ignore funding. Index to 110. Approximate long uPnL?",
      options: ["+10 ×100 = 1000 (options multiplier)", "+10 (1-coin notional)", "0, because no expiry means no P&L", "Equal to the premium"],
      answer: 1,
      explain: "Linear 1-coin notional: a 10-point move is 10 quote units. Do not paste equity-option ×100.",
    },
    {
      q: "Positive funding usually means?",
      options: ["The exchange pays you a salary", "Shorts pay longs", "Longs pay shorts", "Mark equals last"],
      answer: 2,
      explain: "Convention: positive funding = longs pay shorts (typical when the perp is rich to spot). Clamp and cadence: Stage 12.3.",
    },
    {
      q: "Biggest shape difference between a long call and a long perp?",
      options: ["Both are straight lines", "The call is a hook with buyer loss capped; the perp is a line that can liquidate", "Perps have Theta and calls do not", "No difference"],
      answer: 1,
      explain: "A call buyer loses at most premium (Stage 1.1); a perp is a margined linear product — liq and funding apply.",
    },
  ],

  further: [
    { label: "CoinGlass: what is funding rate (secondary aggregator — watch cadence)", url: "https://www.coinglass.com/learn/what-is-funding-rate" },
    { label: "CME: Bitcoin futures (dated, not a perp)", url: "https://www.cmegroup.com/markets/cryptocurrencies/bitcoin/bitcoin.html" },
    { label: "Investopedia: futures vs options", url: "https://www.investopedia.com/ask/answers/difference-between-options-and-futures/" },
  ],
};
