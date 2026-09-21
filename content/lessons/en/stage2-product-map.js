export default {
  id: "product-map-2026",
  stage: 2,
  order: 7,
  title: "2026 Product Map: SPY / SPX / XSP / IBIT / Deribit",
  difficulty: 2,
  prereqs: ["exercise-assignment", "zerodte-spx"],

  oneLiner:
    "Under the same phrase “index options” sit **different settlement, exercise, multipliers, and venues**: SPY American physical, SPX European cash, XSP mini, IBIT shares ≠ bitcoin, Deribit crypto options (Coinbase already closed the deal). Every figure is dated; CoinGlass is labeled **secondary**.",

  intuition: `
Stage 2.4 covered American/European and cash/physical; Stage 2.6 covered SPX 0DTE as the main tape. This lesson lays out the **names you actually click in a broker menu** as a **bullet map** (the renderer has no tables).

Three standing rules:

- **Snapshots carry dates**; do not freeze live AUM / OI / funding.
- **Aggregators like CoinGlass are secondary.**
- **No invented tax rates**: SPX is often 1256 — ask a tax person.

**In this lesson we break the product map into six pieces:**

- **① SPY: American, physical, ×100**
- **② SPX: European, cash, ×100 — AM vs PM is not the same print**
- **③ XSP: mini-SPX (July 2026 ADV snapshot)**
- **④ IBIT options: shares ≠ BTC (record prints are not typical)**
- **⑤ Deribit and crypto-options venues (deal, CIE migration, H1 share secondary)**
- **⑥ OCC scale: index small by count, huge by notional**
`,

  mechanics: `
### ① SPY: American, physical, ×100

- **Exercise**: American — any trading day before expiry.
- **Settlement**: physical, one contract = **100 shares** of SPY. Sellers can be assigned early (especially into an ex-dividend, Stage 2.4).
- **Intuition**: it follows ETF shares, equity-style assignment, not an index cash print.

### ② SPX: European, cash, ×100

- **Exercise**: European, expiry only.
- **Settlement**: cash, multiplier **100** ($100 per point).
- **Which print**: monthly SPX is often **AM / SOQ**; most weeklies and **0DTE are PM** (Stage 2.4). You thought you were hedging Friday's close; the other side settles the morning open print — a real footgun.
- **Tax**: these index options are often **1256** in the U.S. This course **does not invent rates or holding periods**. Ask a tax person.

### ③ XSP: mini-SPX

- European, cash, notionally about one-tenth of SPX — same index logic, smaller ticket.
- Cboe IR **July 2026** highlights: XSP monthly ADV **record 238k**, of which 0DTE ADV **138k**. Monthly snapshot.

### ④ IBIT options: shares ≠ BTC

IBIT is a spot-bitcoin **ETF share**. Options on IBIT:

- Typically American, physical, ×100 shares — you deliver **fund shares**, not a coin, not a Deribit BTC option, not a BTC perp (Stage 12).
- **Do not freeze AUM.**
- Volume can gap to extremes; those are **record sessions**, not a typical day: Goldman (via CryptoBriefing, **24 Aug 2026**) cited **1.58 million IBIT call contracts** in one session (RECORD); OptiView **28 Aug 2026** that session **1,082,676** contracts. Treating the record as “every day” mis-sizes the book.

### ⑤ Deribit and crypto options (label secondary share)

- **Coinbase closed the Deribit acquisition on 14 Aug 2025.** Teaching “independent Dutch boutique” is already stale.
- **CIE's institutional book is scheduled onto Deribit on 9 Sep 2026** ([Coinbase Help](https://help.coinbase.com/en/international-exchange/deribit/institutional-faqs)).
- H1 2026 crypto-options notional (**CoinGlass, secondary**): Deribit **49.3%** ($425.9B), Bybit 22.3%, Binance 13.4%, OKX 13.3%. Deribit still leads **BTC** options ~**55.3%**; Bybit leads **ETH** ~**38%** vs Deribit 29%. CME options share cited **1.7%** (down from 4.1% in Jul 2025). **Do not freeze this as the 31 Aug tape, and do not write that Hyperliquid replaced Binance.**
- Margin: **coin-margined / inverse** vs **USD stablecoin** — not OCC dollar ×100 liquidation rules. Linear perps (funding, ADL) live in **Stage 12**. Do not mix the names.

### ⑥ OCC scale

OCC **July 2026** (Mondo Visione): YTD options ADV **70,820,829** (equity 35.2M / ETF 29.3M / index 6.3M); July total options **1.55B** contracts, **+25.7%** YoY.

Index is the smallest slice by **contract count** and often the largest by **notional** — one SPX ×100 point-value is not a $20 stock option. 0DTE enters the macro conversation because of that notional, not because “index ADV looks small.”

String the six: **ask settlement and exercise first, then multiplier and venue.** SPY physical American; SPX/XSP cash European (then ask AM vs PM); IBIT is shares; Deribit is a crypto-options venue (already inside Coinbase). Put “index / 0DTE / IBIT coverage” on the broker checklist (Stage 11.1).
`,

  demo: "product-selector",

  analogy: `
Think of these contracts as **different tickets on the same river**:

- SPY is the ticket that **lands cargo on the dock** (physical shares).
- SPX is the **big boat that only settles the difference** (cash ×100), and you still have to ask whether the water mark is morning (AM/SOQ) or evening (PM).
- XSP is a **smaller boat on the same route**.
- IBIT is a **ticket to a bitcoin-themed park**, not bitcoin itself.
- Deribit is **another port's rulebook** (coin margin, another clearer) — not the OCC stamp.

The wrong ticket is not “you called the direction wrong.” It is **on delivery day you are holding a different object than you thought.**
`,

  misconceptions: [
    "**\"SPY and SPX are both S&P 500, so the hedge is the same.\"** — American physical vs European cash, plus AM vs PM prints. Hedging Friday's close and getting the morning SOQ is a classic footgun (Stage 2.4).",
    "**\"IBIT options are bitcoin options.\"** — The underlying is ETF **shares**. ≠ Deribit BTC options ≠ CME ≠ a perp. Do not freeze AUM.",
    "**\"Deribit is still an independent Dutch exchange.\"** — Coinbase **closed 14 Aug 2025**; CIE institutional book **9 Sep 2026** (Coinbase Help).",
    "**\"CoinGlass's 49.3% is live share right now.\"** — **H1 2026, secondary aggregator.** Do not freeze it as the 31 Aug tape, and do not say anyone replaced Binance.",
    "**\"Index options ADV is only 6.3M, so they don't matter.\"** — Small by count, large by notional. OCC July splits equity/ETF/index; the 0DTE conversation rides notional (Stage 2.6).",
  ],

  quiz: [
    {
      q: "What is the key structural difference between SPY options and SPX options?",
      options: [
        "Both are European cash; only the ticker differs",
        "SPY is American physical (×100 shares); SPX is European cash (×100 points), with monthlies often AM and 0DTE mostly PM",
        "SPX delivers a basket of stocks",
        "SPY has no Gamma",
      ],
      answer: 1,
      explain: "SPY: American, physical, equity-style assignment. SPX: European, cash; then layer AM vs PM settlement prints. Mixing hedge points is the footgun.",
    },
    {
      q: "Which sentence about IBIT options is correct?",
      options: [
        "Exercise delivers spot bitcoin",
        "The underlying is ETF shares, and shares ≠ BTC; 1.58M calls on 24 Aug 2026 is a record, not typical, and this course does not freeze AUM",
        "It is the same contract as Deribit BTC options",
        "AUM is written here as an eternal constant",
      ],
      answer: 1,
      explain: "IBIT options are on **fund shares**. Label record prints as RECORD. Do not freeze AUM. Do not mix three toolkits.",
    },
    {
      q: "Coinbase and Deribit: which matches the public timeline?",
      options: [
        "Deribit is still a fully independent Dutch exchange in 2026",
        "Coinbase closed the acquisition on 14 Aug 2025; CIE's institutional book is scheduled onto Deribit on 9 Sep 2026",
        "Hyperliquid has replaced Binance as #1 in options",
        "CME options are more than half of crypto options",
      ],
      answer: 1,
      explain: "Deal closed **14 Aug 2025**; CIE→Deribit **9 Sep 2026**. In the H1 CoinGlass secondary print, CME options share is cited at 1.7%, and do **not** write that Hyperliquid replaced Binance.",
    },
    {
      q: "OCC July 2026: index options ADV ~6.3M, far below equity+ETF. The right reading is?",
      options: [
        "Index options can be ignored",
        "Small by contract count, often huge by notional; 0DTE/SPX macro impact comes from notional, not count",
        "This proves 0DTE does not exist",
        "YTD ADV 70,820,829 is live OI",
      ],
      answer: 1,
      explain: "OCC July YTD ADV **70,820,829** (equity 35.2M / ETF 29.3M / index 6.3M) is a **monthly snapshot**. Index: small count, large notional.",
    },
  ],

  further: [
    { label: "Mondo Visione: OCC July 2026 volume", url: "https://mondovisione.com/news/occ-july-2026-monthly-volume-data-202686/" },
    { label: "Coinbase Help: CIE institutional migration onto Deribit (9 Sep 2026)", url: "https://help.coinbase.com/en/international-exchange/deribit/institutional-faqs" },
    { label: "Cboe IR: July 2026 highlights (XSP ADV)", url: "https://ir.cboe.com/" },
  ],
};
