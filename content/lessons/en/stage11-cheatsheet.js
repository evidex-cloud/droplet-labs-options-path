export default {
  id: "cheatsheet",
  stage: 11,
  order: 7,
  title: "Appendix: Formula & Numbers Cheat Sheet",
  difficulty: 1,
  prereqs: [],

  oneLiner:
    "A one-page quick reference: **P&L and breakeven formulas** (calls/puts, verticals, straddle, iron condor), **the five Greeks and their signs**, **Black-Scholes and put-call parity**, **key conventions** (×100, IV, moneyness), **strategy-by-market-view**, and the stage each item links back to. Treat it as the map you flip to whenever you trade.",

  intuition: `
This is the **quick-reference appendix** for the whole course. Every concept was taught earlier in plain language with numerical examples; here the most-consulted formulas, signs, and conventions are **condensed onto one page** so you can check them at a glance while trading.

It teaches nothing new — it gathers the "hard knowledge" scattered across ten stages into one map, with **each block tagged with the stage it links back to**, so if something doesn't click you can jump back and review. Bookmark this lesson and return to it during real trading. The demo on the right lets you filter by [P&L formulas / Greeks / Pricing / Strategy selection] to find the card you need fast.

**This cheat sheet contains five blocks:**

- **① P&L and breakeven formulas (per share; multiply money by ×100)**
- **② The five Greeks and their signs**
- **③ Black-Scholes and put-call parity**
- **④ Key conventions and definitions**
- **⑤ Strategy by market view + next steps**
`,

  mechanics: `
### ① P&L and breakeven formulas

**Convention**: everything below is **at expiry, per share**; to reach real money, **× the contract multiplier 100 × the number of contracts** (callback 1.4, 2.5). S = underlying at expiry, K = strike, c = call premium, p = put premium.

**Long call (callback 1.1)**

$$P&L = max(S − K, 0) − c
$$Max loss = c　Max profit = unlimited
$$Breakeven BE = K + c

**Long put (callback 1.2)**

$$P&L = max(K − S, 0) − p
$$Max loss = p　Max profit = K − p (underlying to zero)
$$Breakeven BE = K − p

**Short call/put (callback 2.5)**: negate the above; **max profit = the premium, max loss can be huge** (a naked short call is theoretically unlimited), and margin is required.

**Bull call spread (debit; callback 6.5)**: buy the lower-strike K1 call, sell the higher-strike K2 call, for a net premium paid D.

$$Max loss = D　Max profit = (K2 − K1) − D
$$Breakeven BE = K1 + D

**Bull put spread / credit spread (callback 6.5, 11.2)**: sell the higher-strike K2 put, buy the lower-strike K1 put, for a net premium received Cr, width W = K2 − K1.

$$Max profit = Cr　Max loss = W − Cr
$$Breakeven BE = K2 − Cr

**Long straddle (callback 7.1)**: buy a call + a put at the same K, total cost = c + p.

$$Max loss = c + p (S closes at K)
$$Two breakevens = K ± (c + p)

**Iron condor (callback 7.3)**: sell an OTM call spread + an OTM put spread, net credit Cr, one-side width W.

$$Max profit = Cr　Max loss = W − Cr
$$Profit zone = between the two short strikes (plus the Cr buffer)

> One universal check: **for credit structures (you receive premium), max profit = the premium received; for debit structures (you pay premium), max loss = the premium paid.** If you remember nothing else, remember this.

### ② The five Greeks and their signs

The Greeks are an option's sensitivities to each factor (callback 5.1). The common trading conventions and the **signs for a long (buyer) position**:

- **Delta**: how much the option price moves per ±1 in the underlying. Call 0→+1, put −1→0; also approximates the "probability of finishing ITM." callback 5.2.
- **Gamma**: the rate of change of Delta (acceleration). **Always positive for the buyer**, largest at-the-money near expiry. callback 5.3.
- **Theta**: the time value lost per day. **Negative for the buyer (time is the enemy), positive for the seller**. callback 5.4.
- **Vega**: how much the price moves per ±1% in IV. **Positive for the buyer**, largest for far-dated, at-the-money options. callback 5.5.
- **Rho**: the effect per ±1% in rates. Significant only for long-dated options, the most ignored. callback 5.6.

$$Long option signs: Delta call +/put −, Gamma +, Theta −, Vega +
$$Short option signs: all reversed (Gamma −, Theta +, Vega −)

### ③ Black-Scholes and put-call parity

**Black-Scholes European pricing (callback 4.1)**:

$$d1 = [ln(S/K) + (r + σ²/2)·T] / (σ·√T)
$$d2 = d1 − σ·√T
$$Call = S·N(d1) − K·e^(−rT)·N(d2)
$$Put = K·e^(−rT)·N(−d2) − S·N(−d1)

where N(·) is the standard normal cumulative distribution; inputs are S, K, T (years), r, σ. Code implementation in Stage 11.3.

**Classic benchmark (memorize it as a reconciliation anchor)**: S=K=100, T=1, r=5%, σ=20% → **Call ≈ 10.45**, Delta ≈ 0.64.

**Put-call parity (callback 3.2)**:

$$C − P = S − K·e^(−rT)
$$i.e. long call + short put ≈ holding the underlying (same K, same expiry)

Parity binds calls, puts, the underlying, and cash together — the foundation of synthetic positions (callback 7.5) and no-arbitrage pricing.

### ④ Key conventions and definitions

- **Contract multiplier ×100**: one US equity option = 100 shares. A 2.50 quote → **$250** per contract. Multiply every P&L by ×100 after computing (callback 1.4). **Miss it and your math is 100× too small.**
- **Intrinsic / time value**: intrinsic = max(S−K,0) (call) or max(K−S,0) (put); premium − intrinsic = **time value**, decaying to zero at expiry (callback 1.6).
- **Moneyness (callback 1.5)**: ITM (has intrinsic value) / ATM (S≈K) / OTM (no intrinsic value). Time value, Gamma, and Theta are largest at-the-money.
- **Implied volatility IV (callback 4.2)**: the volatility backed out of the market price, an option's real "price gauge." For the same underlying, higher IV means a pricier option.
- **bid/ask and the mid (callback 2.5)**: buy at the ask, sell at the bid; mid = (bid+ask)/2, anchor your limit there; spread cost = (ask−bid)×100.
- **Breakeven BE**: the underlying price at expiry where you neither gain nor lose (per structure in ①).

### ⑤ Strategy by market view + next steps

**Common structures matched to your view on direction and volatility** (details in each stage):

- **Strongly bullish**: long call (callback 6.1) / bull call spread (callback 6.5, lower cost, capped).
- **Mildly bullish / neutral-to-long**: bull put spread (credit, callback 11.2) / cash-secured put (callback 6.3).
- **Income on a holding**: covered call (callback 6.2).
- **Bearish / protecting a holding**: long put, protective put (callback 6.4) / collar (callback 6.6).
- **Betting on a big move (direction unknown)**: straddle / strangle (callback 7.1) — mind the earnings IV collapse (callback 11.6).
- **Betting on a range (renting the range)**: iron condor (callback 7.3) / butterfly (callback 7.2).
- **Trading time / term structure**: calendar spread (callback 7.4).

**Next steps (turn the cheat sheet into capability)**:

- Use **Python** to run these formulas and plot the Greeks (Stage 11.3).
- **Backtest** a strategy yourself and deduct costs honestly (Stage 11.4).
- Build an **AI-assisted workflow**: AI accelerates, you adjudicate (Stage 11.5).
- Always **paper trade** first, then go small live, writing every trap (Stage 11.6) into your pre-entry checklist (Stage 8.6).

Congratulations on getting here — from "what is a derivative" to being able to price, backtest, and run a quant workflow independently in the AI era. **All of this is educational content, not investment advice; options are high-risk, so start small, control your size, and survive before you talk returns.**
`,

  demo: "formula-sheet",

  analogy: `
This cheat sheet is the **folding map under the glass on your trading desk**.

Learning each concept earlier was like living in different cities and learning their streets one by one (each stage); but when you actually hit the road, what you need isn't ten thick city guides — it's **one folding map** that gathers every key intersection (formula), road sign (Greek), and scale convention (×100, IV) onto a single page you can spread out and orient instantly.

- **P&L formulas** = each route's **start, end, and toll booths** (max gain/loss, breakeven).
- **Greek signs** = the map's **legend** (+/− tells you which way is uphill or downhill).
- **Black-Scholes and parity** = the **scale and coordinate system** (converting price, probability, and time together).
- **The strategy-selection table** = the **index of "want to go there, take this road"** (bullish this way, range that way).

The map doesn't drive for you (it doesn't judge for you), but it lets you **quickly confirm where you are and what the next intersection is, any time.** Bookmark it; the more you use it the more fluent you get — this is the sheet every veteran has on the desk and beginners always forget to bring.
`,

  misconceptions: [
    "**\"A 2.50 quote means I pay $2.50 for one option.\"** — You missed the **contract multiplier ×100**: one contract = $250. Every P&L, cost, and gain is ×100 × contracts after computing, or your math is a full 100× too small (callback 1.4).",
    "**\"Finishing in-the-money always means a profit.\"** — No. A long call truly breaks even only past the **breakeven = K + c** (a put at K − p). ITM only means \"worth exercising\" — it's still a premium short of breaking even (callback 1.1, 2.3).",
    "**\"You have to memorize the max gain/loss of credit and debit spreads separately.\"** — There's a shortcut: **for credit structures max profit = the premium received, for debit structures max loss = the premium paid**; the other end is just width W minus that. Remember this and you can derive most spreads on the fly (callback 6.5, 11.2).",
    "**\"The Greek signs are about the same for buyers and sellers.\"** — Exactly the opposite. The buyer is Gamma +/Theta −/Vega +, and the **seller is all reversed** (Gamma −, Theta +, Vega −). Time is the seller's friend and the buyer's enemy; flip the signs and the whole risk profile changes (callback 5.1).",
    "**\"Put-call parity is just a theoretical formula, useless in trading.\"** — It's the hard constraint C − P = S − K·e^(−rT) that underpins **synthetic positions** and no-arbitrage pricing (callback 3.2, 7.5). With it you can \"synthesize\" any single leg, and spot quotes that stray from fair value.",
  ],

  quiz: [
    {
      q: "You buy a **bull call spread** for a net premium of 1.20 (buy the 100 call, sell the 105 call). What is its **max profit** (per share)?",
      options: ["1.20", "3.80", "5.00", "Unlimited"],
      answer: 1,
      explain: "A debit bull call spread's max profit = (high K − low K) − net premium = (105 − 100) − 1.20 = **3.80** (per share, ×100 = $380). Max loss = the 1.20 paid, breakeven = 100 + 1.20 = 101.20 (callback 6.5).",
    },
    {
      q: "Regarding the Greek signs of a **short option position**, which set is correct?",
      options: [
        "Gamma positive, Theta negative, Vega positive",
        "Gamma negative, Theta positive, Vega negative",
        "All positive",
        "All zero",
      ],
      answer: 1,
      explain: "The buyer is Gamma +/Theta −/Vega +; the **seller is all reversed**: Gamma negative, **Theta positive (time is a friend)**, Vega negative. This is exactly why sellers collect rent from time decay yet fear big moves (callback 5.1, 5.4).",
    },
    {
      q: "Which of these is the **put-call parity** relationship?",
      options: [
        "C + P = S − K·e^(−rT)",
        "C − P = S − K·e^(−rT)",
        "C − P = K − S",
        "C × P = S × K",
      ],
      answer: 1,
      explain: "Parity is **C − P = S − K·e^(−rT)**: long call + short put ≈ holding the underlying (same K, same expiry). It locks calls, puts, the underlying, and cash together — the foundation of synthetic positions and no-arbitrage (callback 3.2).",
    },
    {
      q: "You think an underlying will **chop in a range** over the next month (neither rallying nor falling much). Which structure on the cheat sheet fits best?",
      options: ["Long straddle", "Iron condor", "Long call", "Protective put"],
      answer: 1,
      explain: "Betting on \"chop / renting the range\" matches the **iron condor** (or butterfly) best: sell an OTM call spread + put spread, collecting time decay within a range, with max loss capped by the spreads (callback 7.3). A straddle is the opposite — a bet on a big move.",
    },
  ],

  further: [
    { label: "OIC: Options Strategies quick reference (by market view)", url: "https://www.optionseducation.org/strategies" },
    { label: "Investopedia: Option Greeks master table", url: "https://www.investopedia.com/trading/getting-to-know-the-greeks/" },
    { label: "CBOE: Options Education (authoritative source for formulas and conventions)", url: "https://www.cboe.com/education/" },
  ],
};
