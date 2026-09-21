export default {
  id: "mark-index-last",
  stage: 12,
  order: 2,
  title: "Index, Mark, Last: Which Price Counts",
  difficulty: 2,
  prereqs: ["what-is-perp"],

  oneLiner:
    "**Index** is a spot basket, **mark** is what uPnL and liquidation usually use, **last** is just the latest trade — and last can wick. Liquidating on last is how books get hunted.",

  intuition: `
A perp screen shows at least three “prices.” Mixing them is how accounts die.

- **Index**: a basket of spot venues (weighted, outliers clipped). It answers “what is the coin roughly worth” without a single spot venue dictating it.
- **Mark**: typically index plus a smoothed basis/funding premium. Venues use it for **unrealized P&L** and **whether you hit liquidation**.
- **Last**: the last print on the book. In thin liquidity, a small clip can wick last far from index.

Teaching scene (schematic): entry 100, 20× long, teaching liq ~95.5. Last wicks to 94.5, mark still 100. Engine on last: you are gone. Engine on mark: you are still there. Stage 12.4 writes the liq formula.

**Four pieces:**

- **① Index: a spot basket, not the perp itself**
- **② Mark: the risk-engine price**
- **③ Last: a printable wick**
- **④ Why hunt books that liq on last**
`,

  mechanics: `
### ① Index

Index is **spot** composite. Constituents, weights, and outlier rules differ by venue. A manipulated or crashed constituent is oracle risk that even on-chain perps do not delete (Stage 12.6). Index is usually **not** the perp’s last trade.

### ② Mark

Mark exists so risk is not triggered by one thin print. A common skeleton:

$$mark ≈ index + smoothed basis (tied to the funding premium)

uPnL, liquidation tests, and sometimes the premium index for funding hang off mark. **Mark ≠ last.**

### ③ Last

Last is where trades happen and where candle wicks come from. In size, last hugs mark; in a vacuum, or with a deliberate smash, last teleports. **Your fill** is still your order price; **whether the position is liquidated** should not hang on that one print.

### ④ Hunts

If a venue (or a historical design) liquidates on last, an attacker can spend modest notional to run a string of high-leverage liq prices and cascade. Modern books use mark to split “wick” from “bust.” Toggle last vs mark in the demo.

> Formula and leverage: Stage 12.4. Insurance and ADL: Stage 12.5.
`,

  demo: "mark-vs-last",

  analogy: `
Index is the city-wide listing average, mark is the **appraisal the bank uses**, last is a tout’s shout on the corner.

The bank forecloses on the appraisal, not on the shout. A perp that liquidates on the shout hands the wick a rifle.
`,

  misconceptions: [
    "**“Mark = last.”** — No. Last wicks; mark is for P&L and liq. Keep the three names apart.",
    "**“The candle low is my liquidation trigger.”** — Candles often follow last. If liq uses mark, a wick can pierce your mental line while the position lives.",
    "**“On-chain books cannot wick.”** — Thin books wick. On-chain adds oracle/mark-source issues.",
    "**“Index manipulation is irrelevant; I trade the perp.”** — Mark usually anchors to index. A bad basket poisons risk prices.",
  ],

  quiz: [
    {
      q: "Which price do venues typically use to decide perp liquidation?",
      options: ["Last trade", "Mark price", "Your entry", "A dot on a social liq map"],
      answer: 1,
      explain: "Mainstream design uses mark for uPnL and liq so last-wicks cannot hunt the book. Always read the rulebook — history has exceptions.",
    },
    {
      q: "Index price mainly represents?",
      options: ["The perp’s own prints", "A spot basket", "Annualized funding", "Option implied vol"],
      answer: 1,
      explain: "Index is a spot composite used to anchor the perp; it is not perp last.",
    },
    {
      q: "Last wicks below the liq line, mark stays above. On a mark engine the teaching result is?",
      options: ["Always liquidated", "Typically not liquidated (survives)", "Always ADL", "Premium goes to zero"],
      answer: 1,
      explain: "That is why mark exists. The demo toggles both engines.",
    },
    {
      q: "“Perps have no risk because they never expire” also ignores which price risk?",
      options: ["Dividends", "Wicks vs mark, plus leveraged liquidation", "Stock splits", "It is correct"],
      answer: 1,
      explain: "No expiry still leaves funding, liq, and mark-source risk. Treating last as mark makes it worse.",
    },
  ],

  further: [
    { label: "Binance: mark price and index price", url: "https://www.binance.com/en/support/faq/how-to-mark-price-and-index-price-360033525071" },
    { label: "Hyperliquid docs: mark and liquidation (defer to official text)", url: "https://hyperliquid.gitbook.io/hyperliquid-docs" },
  ],
};
