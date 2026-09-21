export default {
  id: "zerodte-spx",
  stage: 2,
  order: 6,
  title: "0DTE: Same-Day SPX Options Are Now the Tape",
  difficulty: 2,
  prereqs: ["exercise-assignment", "orders-margin"],

  oneLiner:
    "**0DTE** is not a footnote: in Cboe's **July 2026** volume, **0DTE was 66.2% of SPX options** (TradeInformer citing Cboe July volume). Most of it is **capped-risk** (longs or spreads), not a casino slogan; Gamma explodes by the hour, and **pin, cutoffs, and gaps happen the same day** — defined-risk is still not free.",

  intuition: `
After exercise/assignment (Stage 2.4) and orders/margin (Stage 2.5), you can read a contract with weeks left. On the 2026 SPX tape, **the biggest slice of volume expires today**. That is not a retail-lottery corner; it is the index-options main tape.

Pin the numbers to dates (snapshots, not a live feed):

- **July 2026**: 0DTE = **66.2%** of SPX options volume (Cboe July volume, via [TradeInformer](https://tradeinformer.com/institutional-trading/cboe-reports-july-options-and-fx-growth-as-0dte-reaches-66-2-of-spx-volume)).
- **June 2026**: SPX 0DTE monthly ADV ~**3.3 million** contracts (Cboe via Concretum / GFdaily).
- Cboe “0DTEs Decoded”: **>95%** of SPX 0DTE is capped-risk (longs or spreads); naked shorts ~**4%**. Retail share of SPX 0DTE estimated ~**57%** in June 2026 (Cboe commentary via Concretum) — **label that an estimate**.

Vilkov-style results: 0DTE has **not obviously raised intraday vol**; dealer hedging is often **net long gamma** → **mean reversion**, not chase-the-tape. **Do not teach 0DTE as a 2026 crash button or casino-only.**

It is still dangerous, in a boring way: **it expires today**. Pin is a last-minutes-of-the-close problem; brokers have cutoffs; a defined-risk spread still pays spread, Theta, and gaps. Dealer flows: Stage 8.5. Traps: Stage 11.6. SPY / SPX / XSP: next lesson 2.7.

**In this lesson we break 0DTE into five pieces:**

- **① How big: dated mid-2026 volume snapshots**
- **② Who trades it: capped-risk is the bulk (estimates labeled)**
- **③ Gamma explodes by the hour: same-day pin and Charm**
- **④ Not a crash machine: dealers are often long gamma**
- **⑤ Defined-risk is still not free: spread, Theta, gaps, cutoffs**
`,

  mechanics: `
### ① How big: dated snapshots

Pull 0DTE out of the weeklys footnote. Cboe's own July tape finishes the sentence: **two-thirds of SPX options volume settles today.** The June ADV ~3.3 million is a **monthly average daily volume**, not the OI on your screen right now.

OCC's July 2026 market-wide print (expanded in Stage 2.7): index options are small by **contract count**, huge by **notional**. “Index ADV is only a few million” and “SPX 0DTE hedging moves the cash” can both be true.

> Rule: **every volume/ADV figure carries a month and a source.** This course does not refresh live OI.

### ② Who trades it, and how

Cboe’s structure split: **>95% longs or spreads (capped)**, naked shorts ~4%. Retail share ~57% (June 2026, **estimate**). Read them together:

- The main tape is not “unlimited naked shorts betting one day.”
- A high retail share does not automatically mean “casino” — hedges and spreads live on the same tape.

SPX 0DTE is **European, cash, typically PM-settled** (Stage 2.4 AM vs PM: monthly SPX is often AM/SOQ; weeklies/0DTE are typically PM). Do not import SPY American-physical assignment intuition.

### ③ Gamma explodes by the hour

Stage 5.3 already showed ATM Gamma exploding into expiry. 0DTE changes “near expiry” from days to **hours**. The slider on the right is a teaching BS curve (S=K=5500, σ=16%): **not a live Cboe chain**, same math — shrink T by the hour, Gamma and |Theta| steepen together.

Same day, **Charm**: even if the index sits still, delta drifts toward 0 or ±1 and dealers rebalance **intraday**. That is why Stage 8.5 replaces the main exhibit “monthly OPEX / 2021 meme” with **“every day is OPEX for SPX.”**

**Pin** is no longer a Friday-night legend: the close prints near a strike, cash settlement uses a print (PM close vs the hedge you thought you had), and one print changes the P&L.

### ④ Not a crash machine

Internet copy paints 0DTE as “retail holding the crash button.” The empirical tone (Vilkov-style) is calmer:

- No clean evidence it **systematically raised intraday realized vol**.
- When customers buy options/spreads, dealers are often **net long gamma** → hedges buy dips and sell rallies → **mean reversion**, vol damped.

Short-gamma days exist (the gas/brake of Stage 8.5). The 2021 meme gamma squeeze stays as **history**. The 2026 SPX default story is **daily expiry Gamma/Charm**, not GME.

**GEX still does not forecast direction** — at most it describes “sticky vs explosive.” Treating GEX as a directional oracle is the trap Stage 8.5 quizzes.

### ⑤ Defined-risk is still not free

A debit spread or a same-day long call can cap max loss at the premium or the wing. That is **not** the same as cheap or riskless:

- **Spread**: short-dated markets can gap wide; round-trip slippage first (Stages 2.1, 10.6 TCA).
- **Theta**: billed by the hour, not by the week.
- **Gaps**: an afternoon print, index futures jump, your “expires today” does not get to wait for mean reversion.
- **Cutoffs**: broker / exercise / do-not-exercise times are **today**; miss them and you get the settlement print.

String the five: **mid-2026 SPX volume is mostly 0DTE (July 66.2% snapshot); structurally mostly capped-risk, naked shorts a minority; Gamma/Charm finish in one session what monthly OPEX used to do in a week; the research does not support “0DTE = crash machine”; defined-risk still pays spread, Theta, gaps, and cutoffs.** How dealers write those flows into the index: Stage 8.5. The pits: Stage 11.6. SPY / XSP / IBIT / Deribit: Stage 2.7. Do not mix the name with perps — Stage 12.
`,

  demo: "zerodte-gamma",

  analogy: `
0DTE is a **same-day meal voucher**, not a weekend-expiry annual pass.

An annual pass (a far-dated option) can wait; the meal voucher (0DTE) is void after dinner. If the kitchen (dealers) is long the other side of those vouchers, they often **buy food when guests flee and sell when they crowd in** — mean-reverting the line, not bombing the restaurant.

The voucher is still not free: queue spreads, hourly melt, a surprise health inspection (a data gap), and the “kitchen closes at 16:00” cutoff. **A capped combo (a spread) still gets a bill.**
`,

  misconceptions: [
    "**\"0DTE is a casino that only manufactures crashes.\"** — Don't teach that. Cboe structure: >95% capped-risk; Vilkov-style results do not show a clear lift in intraday vol. Dealers are often net long gamma (brakes). Short-gamma days exist; they are not the definition.",
    "**\"I bought a spread / a same-day call, so risk is zero.\"** — Max loss can be capped, but spread, Theta, gaps, same-day cutoffs and pin remain. Defined-risk ≠ free (Stage 11.6).",
    "**\"0DTE will always be 66.2% of volume.\"** — That is a **July 2026** Cboe volume snapshot. Next month moves. This course does not refresh live OI.",
    "**\"Retail is 57%, so this is retail naked-shorting the index.\"** — 57% is a June 2026 **estimate**; structurally naked shorts are ~4%. Retail can buy spreads and hedges.",
    "**\"GEX / 0DTE flow tells me whether tomorrow is up or down.\"** — It doesn't. GEX describes volatility character (stable/explosive), not direction (Stage 8.5).",
  ],

  quiz: [
    {
      q: "On July 2026 SPX options volume, which matches the Cboe snapshot (via TradeInformer)?",
      options: [
        "0DTE is a negligible leftover of volume",
        "0DTE was 66.2% of SPX options volume (that month's snapshot)",
        "0DTE has replaced all longer-dated options",
        "The figure is live OI right now and an eternal constant",
      ],
      answer: 1,
      explain: "**July 2026** Cboe volume: 0DTE = **66.2%** of SPX options. Dated snapshot, not live OI, and not “far dates vanished.”",
    },
    {
      q: "Which best matches Cboe “0DTEs Decoded” on SPX 0DTE structure?",
      options: [
        "Almost all of it is unlimited-risk naked shorts",
        "More than 95% is capped-risk (longs or spreads); naked shorts ~4%",
        "It is 100% institutional; no retail",
        "Cash settlement means there is no Gamma",
      ],
      answer: 1,
      explain: "Structurally **>95% capped-risk**, naked shorts ~**4%**. Retail share ~57% (June 2026) is an **estimate**. Cash settlement does not cancel Gamma.",
    },
    {
      q: "On 0DTE and market volatility, which is closest to this lesson's research stance?",
      options: [
        "0DTE has been proven to cause every 2026 crash",
        "No clean evidence it systematically raised intraday vol; dealer hedges are often net long gamma, tilting toward mean reversion",
        "Index variance is always larger on 0DTE days",
        "When GEX is positive the market must rally tomorrow",
      ],
      answer: 1,
      explain: "Vilkov-style: **not an obvious lift in intraday vol**; when customers buy, dealers are often **long gamma → buy dips, sell rallies**. GEX does **not** forecast direction (Stage 8.5).",
    },
    {
      q: "You buy a same-day SPX call spread. Which sentence is correct?",
      options: [
        "Risk is already zero because it is defined-risk",
        "Max loss can be locked to the wing / net premium, but you still pay spread, Theta, and gaps, and you still watch same-day cutoffs and pin",
        "European cash settlement means there is no pin",
        "You can let an LLM auto-market-out the spread before the close",
      ],
      answer: 1,
      explain: "Capped ≠ free. Spread, Theta, gaps, cutoffs, pin remain. European cash still has a settlement-print risk. Do **not** let an LLM auto-send 0DTE (Stage 10.5).",
    },
  ],

  further: [
    { label: "TradeInformer: Cboe July 2026 volume, 0DTE 66.2% of SPX", url: "https://tradeinformer.com/institutional-trading/cboe-reports-july-options-and-fx-growth-as-0dte-reaches-66-2-of-spx-volume" },
    { label: "Cboe: 0DTEs Decoded (capped-risk vs naked shorts)", url: "https://www.cboe.com/" },
    { label: "Cboe Investor Relations: July 2026 highlights (XSP / GTH)", url: "https://ir.cboe.com/" },
  ],
};
