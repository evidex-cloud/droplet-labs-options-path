export default {
  id: "perp-venues-2026",
  stage: 12,
  order: 6,
  title: "Perp Venues in 2026: CEXs, Hyperliquid, CME",
  difficulty: 2,
  prereqs: ["what-is-perp"],

  oneLiner:
    "Volume is still led by **Binance / OKX / Bybit**-class CEXs; **Hyperliquid** is a real 2026 on-chain order-book competitor, not a toy, and it **did not replace Binance**. CME lists dated crypto futures — do not fold them into offshore perps.",

  intuition: `
A venue is your counterparty and your rulebook. Speak with **dated snapshots**, not “OI right now.”

CoinGlass *2026 Q1 market-share report* (**secondary aggregator**, as-of that quarter):

- Crypto derivatives volume ~**$18.6T**, spot ~**$1.94T**.
- Binance derivatives ~**$4.9T**, ~**35%** of a top-10 slice.
- Hyperliquid volume ~**$492.7B**, average OI ~**$6.0B**, entered a top-10 list.

Secondary press (must be labeled):

- Hyperliquid record **7.6%** of *all-exchange perp volume* on **2026-06-08** (The Block / Buildix, secondary).
- Versus Binance, May 2026 volume ratio **14.4%** (Gate News, secondary).
- HIP-3 builder-deployed markets: May volume reported **>$62B**, OI ~**$3B** at time of writing (Gate) — **early/uncertain**, not a new standard.

Stop the sentence here: **CEXs still dominate; HL is a size competitor; not a coronation.**

**Five pieces:**

- **① CEX perps remain the flow center**
- **② Hyperliquid: an on-chain CLOB, not an AMM toy**
- **③ HIP-3 / equity-like / pre-IPO perps: early**
- **④ CME: dated, regulated, not an offshore perp**
- **⑤ DEX ≠ no counterparty risk**
`,

  mechanics: `
### ① CEXs

Binance, OKX, Bybit and peers still take most volume. Custody, KYC, risk engine, insurance fund, liq queue — centralized rules. Depth is the feature; FTX-style custody failure is the cost (Stage 12.5).

### ② Hyperliquid

An **on-chain central limit order book**, not a 2020 AMM perp toy. Q1 2026 CoinGlass numbers mean it belongs in the venue lesson. Funding is usually **hourly** (Stage 12.3); normalize before comparing to Binance’s 8h.

Do not write “HL replaced Binance”: $4.9T vs $0.49T is still an order of magnitude on that Q1 slice (secondary aggregator).

### ③ HIP-3 and equity-like perps

Builder-deployed markets and equity/pre-IPO-style linear contracts are a 2026 experiment layer. Gate-style volume/OI prints are **not audited facts**. They are **not stock**: no shareholder rights, no dividend claim, hedge paths that are not stock borrow. Stage 12.8 hits this again.

### ④ CME

CME BTC/ETH contracts are **dated futures** — different users, margin, delivery, regulation. In the options-venue news, Coinbase acquired Deribit (**14 Aug 2025**) and CIE institutional options migrate onto Deribit (**9 Sep 2026**). That belongs in Stage 12.7, not on a perp volume podium.

### ⑤ Counterparty in another font

An on-chain book removes “the boss absconds” as one shape. Remaining: oracle/index composition, mark formula, validator set, bridges, upgrade keys. A quiz that says DEX perps have “no counterparty risk” is wrong.
`,

  demo: "venue-map",

  analogy: `
CEXs are the giant round-the-clock market. Hyperliquid is a 2026 hall that actually has shouting and filling — not a play stall. CME is the wholesale hall with a bell and a regulator, still selling *which-month* contracts, not infinite leases.

HIP-3 is a corner board quoting “the price of an unlisted company.” You can trade the number. You did not buy the shares.
`,

  misconceptions: [
    "**“Hyperliquid replaced Binance.”** — Q1 2026 CoinGlass: Binance derivatives ~$4.9T, HL ~$492.7B. Competitor, not a crown.",
    "**“DEX perps have no counterparty risk.”** — Oracles, mark, validators, bridges remain.",
    "**“CoinGlass numbers are venue-official volume.”** — Secondary aggregator; keep as-of and source.",
    "**“CME bitcoin futures are perps.”** — Dated futures.",
    "**“HIP-3 volume is already the market standard.”** — Early prints, uncertain.",
  ],

  quiz: [
    {
      q: "Which statement matches 2026 Q1 (CoinGlass, secondary aggregator)?",
      options: ["Hyperliquid derivatives volume already exceeds Binance", "Binance derivatives ~$4.9T, HL ~$492.7B, CEXs still dominate", "Spot volume exceeds derivatives", "These are live OI and need no date"],
      answer: 1,
      explain: "Snapshot: derivatives ≫ spot; Binance still the large slice; HL is in the top tier but an order of magnitude smaller. Not a live feed.",
    },
    {
      q: "Why is “DEX perps have no counterparty risk” false?",
      options: ["They are actually options", "Oracle / mark / validator / bridge risks remain", "CME forbids it", "They have no order book"],
      answer: 1,
      explain: "You swapped the custody boss, not the price source or the infrastructure.",
    },
    {
      q: "Correct classification of CME bitcoin contracts in this module?",
      options: ["Offshore perps", "Regulated dated futures; the clock is delivery, not funding", "HIP-3 equity perps", "Deribit options"],
      answer: 1,
      explain: "Different product. Deribit is the options venue (Stage 12.7).",
    },
    {
      q: "The safest sentence about HIP-3 / equity-like perps today?",
      options: ["Same as owning the stock", "Early experiment; label reported data uncertain; not shareholder rights", "Already replaced CME", "Riskless because on-chain"],
      answer: 1,
      explain: "Linear price exposure ≠ equity. Data is early.",
    },
  ],

  further: [
    { label: "CoinGlass: 2026 Q1 market-share report (EN)", url: "https://www.coinglass.com/learn/2026-q1-mktshare-report-en" },
    { label: "Hyperliquid docs", url: "https://hyperliquid.gitbook.io/hyperliquid-docs" },
    { label: "CME bitcoin futures", url: "https://www.cmegroup.com/markets/cryptocurrencies/bitcoin/bitcoin.html" },
  ],
};
