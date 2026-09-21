export default {
  id: "perps-vs-options",
  stage: 12,
  order: 7,
  title: "Perps vs Options: Linear, Convex, Three Toolkits",
  difficulty: 2,
  prereqs: ["what-is-perp"],

  oneLiner:
    "The same word “bullish” can be a **BTC perp** (linear, funding, liquidatable), a **Deribit coin option** (convex, Theta, buyer loses premium), or an **IBIT equity option** (shares, ×100). Three tools, not three nicknames.",

  intuition: `
Reuse Stage 0.4’s shape lesson, plus crypto’s actual menus:

- **Perp**: straight line; clock = funding; worst case = margin, liq, ADL; underlying = linear swap on the coin.
- **Coin option**: hockey stick; clock = expiry / Theta; buyer’s worst = premium; underlying = the coin.
- **IBIT call**: hockey stick; clock = expiry / Theta; buyer’s worst = premium ×100 per contract; underlying = ETF shares.

Deribit is the crypto-options home: Coinbase acquired it **14 Aug 2025**; CIE institutional migration onto Deribit is dated **9 Sep 2026**. This module is perps; the options venue is a contrast, not a volume ranking.

IBIT is a listed bitcoin spot ETF. Its options are **equity options**: 1 contract is usually **100 shares**, money ×100 (Stage 1.4). You are on shares, not on-chain coin, not a USDT perp.

**Four pieces:**

- **① Linear vs convex**
- **② Funding vs Theta**
- **③ Liquidation vs buyer max-loss**
- **④ Three tools (teaching, not advice)**
`,

  mechanics: `
### ① Linear vs convex

A perp’s Delta is roughly ±1 (times leverage), no option-style Gamma that bends with the underlying. +1 in price is +1 in P&L (minus funding). A call is sleepy left of strike and steep past it — Stages 5.2–5.3.

Hedgers: linear hedge of spot → perp; disaster convexity → option. Using 20× perp as “insurance” is buying the wrong shape (Stage 8.4 tail hedges speak option).

### ② Funding vs Theta

Both leak if you sit. The physics differs. Funding can flip sign — shorts can collect when longs are crowded; Theta is almost always a tax on the buyer. Treating funding APR as option implied carry is Stage 12.3’s trap.

### ③ Liq vs premium

An option buyer who paid premium has no perp-style liq line (sellers are another story — they post margin). Perps, long or short, can be sent away by mark, then the waterfall (Stage 12.5).

### ④ Three tools

Teaching scene — all bullish, none of it advice:

- Want linear, shortable, will accept funding and liq: coin perp.
- Want coin convexity, will accept expiry: Deribit-style coin options.
- Want a securities account, ETF shares, remember ×100: IBIT options.

Do not treat HIP-3 equity-like perps (Stage 12.6) as a fourth kind of stock. They are price swaps.
`,

  demo: "convexity-choice",

  analogy: `
A perp is a leveraged straight rail: fast, and off the rail you roll. An option is a ticket for an up-only escalator: the ticket expires (Theta), but a tremor does not let the landlord seize the building.

An IBIT option is a ticket on a **listed fund of house prices** — stock-exchange rules, 100-share multiplier, not one coin.
`,

  misconceptions: [
    "**“Perps and options are both derivatives, so the risk is the same.”** — Line obligation vs kinked right. Funding vs Theta. Liq vs premium.",
    "**“IBIT options are bitcoin perps.”** — IBIT is an ETF-share option, ×100; a perp is a linear swap on the coin.",
    "**“Deribit is mainly a perp venue now.”** — This lesson uses it as the options contrast. Perp flow sits on CEXs and HL (Stage 12.6).",
    "**“A long perp’s max loss equals the premium.”** — Perps have no such floor.",
  ],

  quiz: [
    {
      q: "On a bullish view, which does a perp have that a long call usually does not?",
      options: ["Theta decay", "Mark-price liquidation and ADL", "Premium as max loss", "A fixed ×100 multiplier"],
      answer: 1,
      explain: "Perps are margined linear products. A long call’s max loss is premium; ×100 is an equity-option habit, not the coin-perp default.",
    },
    {
      q: "The crucial underlying difference between an IBIT call and a BTC perp?",
      options: ["None", "ETF-share option (often ×100) vs linear swap on the coin", "IBIT settles funding", "Perps have a strike"],
      answer: 1,
      explain: "Shares vs coin swap. Rules, multiplier, venue — all different.",
    },
    {
      q: "Funding vs Theta: what is comparable and what is not?",
      options: ["They are the same Greek", "Both are holding costs, but one can flip sign, Theta is usually a buyer tax, and only options are convex", "Theta exists only on perps", "Funding exists only on IBIT"],
      answer: 1,
      explain: "Same family (a clock cost), different mechanism and sign.",
    },
    {
      q: "Coinbase’s acquisition of Deribit (14 Aug 2025) mainly moves which toolkit in this course?",
      options: ["CME dated-future rules", "Crypto-options venue map (contrast only; this module is still perps)", "Turns all perps into options", "Cancels funding"],
      answer: 1,
      explain: "Options-venue news. CIE → Deribit institutional migration public date 9 Sep 2026.",
    },
  ],

  further: [
    { label: "Deribit insights (crypto options)", url: "https://insights.deribit.com/" },
    { label: "CBOE: listed-options basics (IBIT-style equity options)", url: "https://www.cboe.com/education/" },
    { label: "Investopedia: options vs futures", url: "https://www.investopedia.com/ask/answers/difference-between-options-and-futures/" },
  ],
};
