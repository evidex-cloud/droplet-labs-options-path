export default {
  id: "portfolio-greeks",
  stage: 5,
  order: 7,
  title: "Portfolio Greeks & Second-Order (Vanna/Charm)",
  difficulty: 3,
  prereqs: ["delta", "gamma", "theta", "vega"],

  oneLiner:
    "The Greeks' most powerful property: **they add directly across an entire position/account.** Sum each leg's Greek × number of contracts × 100 (negative for shorts) and you get the portfolio's **net Delta / Gamma / Theta / Vega** — the risk you're actually carrying. This lesson teaches managing a multi-leg portfolio by net Greeks (and shows that **a Delta-neutral position can still have huge Gamma/Vega**), then glimpses the **second-order Greeks: Vanna, Charm, Volga** that market makers can't do without (leading to Stage 8.5).",

  intuition: `
The last five lessons unpacked a single option's five Greeks one by one. But in real trading, you almost never hold just one option — you hold a **portfolio**: maybe 100 shares of stock + sell 1 call (covered call), maybe buy a call + buy a put (straddle), maybe several legs stitched into an iron condor. Now the question is no longer "what's this option's Delta," but — **what's my whole portfolio's net risk?**

The good news is the Greeks have an almost magical property: **they add directly.**

Take each leg's (each option's, each stock's) Greek, multiply by **× number of contracts × the contract multiplier (×100), with a negative sign for shorts**, and sum it all up — that's the whole portfolio's net exposure on that dimension. Delta plus Delta, Gamma plus Gamma, Vega plus Vega, Theta plus Theta — each governs its own dimension, without interfering. This is why the Greeks are the **common language of modern risk management**: however complex the portfolio, it compresses into a few numbers — net Delta, net Gamma, net Theta, net Vega.

Take the most classic example — **a long ATM straddle** (buy 1 call + buy 1 put, K=100, 30 days, σ=20%, computed by the engine, per-share basis):

- Call: Delta +0.534, Gamma 0.069, Theta −0.044, Vega 0.114
- Put: Delta −0.466, Gamma 0.069, Theta −0.033, Vega 0.114
- **Portfolio net**: Delta **+0.068 ≈ 0**, Gamma **0.139**, Theta **−0.076**, Vega **0.228**

See the most important lesson? This straddle's **net Delta is nearly 0** — it's **almost insensitive** to small underlying moves, looking like it has "no directional risk." But its **Gamma and Vega are double a single leg's**! In other words:

> **Delta-neutral ≠ no risk.** This straddle doesn't bet on direction, but it's a huge **+Gamma, +Vega, −Theta** position — it bets "**the underlying will move big / volatility will rise**," paying double Theta every day while it waits.

This is precisely the core power of portfolio Greeks: it lets you see through a position that "looks directionless" to **where the real exposure hides.** A trader never manages single legs — they compress the whole book into these few net numbers, then decide which to shore up, which to hedge.

Finally, when you want to manage these net exposures finely, you'll find the first-order Greeks themselves are changing — **Delta changes with volatility (Vanna) and with time (Charm).** These "Greeks of the Greeks" are the **second-order Greeks**, and market-maker hedging can't do without them (Stage 8.5).

**In this lesson we break portfolio Greeks into five pieces:**

- **① The Greeks are additive: portfolio net exposure = Σ(each leg × contracts ×100, negative for shorts)**
- **② Reading three classic portfolios by net Greeks (straddle, covered call, spread)**
- **③ Delta-neutral can still have huge Gamma/Vega — the "no direction" trap**
- **④ Second-order Greeks: Vanna (Delta vs IV), Charm (Delta vs time), Volga**
- **⑤ Why market makers obsess over second-order Greeks (leading to Stage 8.5)**
`,

  mechanics: `
### ① The Greeks are additive: how to compute net portfolio exposure

Mathematically, the Greeks are partial derivatives, and **differentiation is linear** — the derivative of a portfolio equals the sum of its parts' derivatives. So for a Greek G of any dimension:

$$Portfolio net G = Σ_legs ( direction × contracts × 100 × per-share G of the leg )
$$where **direction = +1 (buy/long) or −1 (sell/short)**, ×100 is the contract multiplier (U.S. single-stock options), and a stock leg counts in as "per-share Delta = ±1, all other Greeks = 0."

Compute dimension by dimension to get the portfolio's **(net Delta, net Gamma, net Theta, net Vega, net Rho).** A few practical points:

- **Stock is pure Delta**: 100 shares long = Delta **+100** (dollar delta), with Gamma/Theta/Vega/Rho all 0. It's the "pure directional tool" that pulls portfolio Delta positive/negative without touching the other Greeks — which is also why stock is used to Delta-hedge (Stage 8.2): it moves only Delta, without contaminating Gamma/Vega.
- **Shorts go negative**: selling 1 call (per-share Delta 0.53) contributes **−0.53 × 100 = −53** of net Delta, plus −Gamma, −Vega, +Theta (the sign convention from Stage 5.1 holds at the portfolio level too).
- **Units must be uniform**: either sum everything in "per-share" terms then ×100, or sum directly in "one-contract" terms (already ×100). Don't mix a per-share call Delta with a ×100 stock Delta.

### ② Reading three classic portfolios by net Greeks

Land the abstract "additivity" onto three structures you'll meet over and over (all computed by the engine, K/expiry in parentheses):

**(a) Long straddle (buy 1 call + buy 1 put, K=100, 30 days)** — see the intuition section: net Delta ≈ +0.07 (≈ neutral), net Gamma 0.139, net Theta −0.076, net Vega 0.228. **Reading**: a pure volatility long "betting on a big move / betting IV rises," not betting on direction, but bearing double Theta.

**(b) Covered call (long 100 shares + short 1 K=105 call, 30 days)** — the short K=105 call per share: Delta 0.222, Gamma 0.052, Theta −0.031, Vega 0.085. The portfolio in one-contract terms (×100):
- Net Delta = +100 (stock) − 0.222×100 = **+77.8**: still a **mild long**, but "blunter" than holding 100 shares naked — on a rally the sold call drags on you (Delta cut to the sensitivity of 0.78 shares).
- Net Gamma = 0 − 0.052×100 = **−5.2**: **negative Gamma** — you've become a seller of convexity, "falling behind" more and more as the underlying surges.
- Net Theta = 0 − (−0.031)×100 = **+3.1**: **positive Theta** — exactly the covered call's income source, collecting time rent every day.
- Net Vega = 0 − 0.085×100 = **−8.5**: **negative Vega** — a fall in IV favors you.
> In one line: **a covered call = a mild long + selling volatility (−Gamma, −Vega, +Theta).** You trade away upside convexity for collecting Theta daily (echoing Stage 6.2).

**(c) Vertical spread (e.g., a bull call spread: buy low-K call + sell high-K call)**: the two legs' Gamma, Vega, and Theta **largely hedge out**, and the net exposure is far smaller than a single leg — exactly why a spread has "risk locked and the Greeks tamed" (Stage 6.5). Net Delta is positive (the call direction), but net Gamma/Vega/Theta are all whittled small, making it a "clean directional bet."

### ③ Delta-neutral can still have huge Gamma/Vega

Distill the straddle lesson above into a risk-control principle that **must be burned into your brain**: **net Delta = 0 only means "insensitive to the underlying's instantaneous small moves" — it says nothing about exposure on the other dimensions.**

A Delta-neutral portfolio can perfectly well be:

- **Huge +Gamma + huge +Vega** (like a long straddle): surface-directionless, but heavily betting on "a big move + IV rising," burning Theta every day.
- **Huge −Gamma + huge −Vega** (like a short straddle / iron condor made Delta-neutral): surface-directionless, but heavily betting on "no move + IV falling," living off collected Theta — but the moment the underlying moves big or IV spikes, negative Gamma/Vega makes the "neutral" position **bleed out.** In February 2018's "Volmageddon," countless Delta-neutral volatility-selling accounts blew up instantly for exactly this reason.

So professional risk control is never satisfied with "flattening Delta." They look at the **whole Greek table**: net Delta governs direction, net Gamma governs "how fast directional risk changes," net Vega governs volatility, net Theta governs time P&L. Delta hedging (Stage 8.2) is only the first step; after stripping out direction, **the remaining Gamma/Vega exposure is what you're really betting on.**

> Remember: **"I'm Delta-neutral so I have no risk" is one of the most dangerous illusions in option trading.** What's neutral is direction; what's bet is the second order.

### ④ Second-order Greeks: Vanna, Charm, Volga

When you want to **dynamically manage** these net exposures, the first-order Greeks themselves are moving. What describes "how the Greeks change" is the **second-order Greeks** (mentioned in Stage 5.1, also in the glossary). Gamma is in fact one of them (Delta's change vs the underlying). The three other most important ones:

- **Vanna = ∂Delta/∂σ = ∂Vega/∂S**: Delta's sensitivity to **volatility** (also equal to Vega's sensitivity to the underlying). The moment IV moves, the Delta you carefully flattened drifts. A portfolio with skew (Stage 4.3) has especially large Vanna — it's the bridge connecting the two worlds of "direction" and "volatility."
- **Charm = ∂Delta/∂t (also called delta decay)**: Delta's drift with **time.** Even if the underlying doesn't move, just from a day (or a weekend) passing, your Delta changes — an OTM option's Delta drifts toward 0, an ITM's toward ±1 (mentioned in Stage 5.2). Near expiry and over weekends, Charm makes a hedged portfolio "drift off on its own."
- **Volga (= Vomma) = ∂Vega/∂σ**: Vega's sensitivity to IV itself (Vega's "convexity"). It determines whether your volatility exposure stays linear when IV moves big — anyone trading the shape of the volatility smile/surface (Stage 4.3/4.4) must watch it.

These quantities are small in normal times, but in portfolios that are **near expiry, with IV in violent flux, with skew**, they dominate the P&L. You don't have to compute them by hand, but you must know: **the first-order Greeks you flattened get quietly pushed off by the second-order Greeks** — the deep reason hedging must be continuous.

### ⑤ Why market makers obsess over second-order Greeks

For retail, second-order Greeks are an "advanced elective"; for **market makers**, they're a lifeline (Stage 8.5). Market makers hold massive option positions and strive to stay Delta-neutral, but:

- **Charm (Delta's time drift)** tells them: even if the market doesn't move, **Delta changes by the next morning's open**, and they must adjust the hedge ahead of time — especially on Fridays and quarterly expiries when huge amounts of options expire.
- **Vanna (Delta vs IV)** tells them: **the moment IV moves, the whole account's Delta drifts collectively.** On a negatively-skewed index, a market decline often comes with rising IV, and Vanna makes the market makers' hedging demand self-reinforcing, **amplifying the decline** — this is the "Vanna flow."
- Quant research shows that **hedging flows driven by Vanna and Charm** can systematically push an index. On 2026 SPX this mostly happens **intraday in 0DTE** (Stage 2.6), not only in monthly expiry week — which is now the main exhibit of Stage 8.5.

Stringing the five pieces together: **the Greeks are additive — portfolio net exposure = Σ(each leg × contracts ×100, negative for shorts), compressing any complex portfolio into net Delta/Gamma/Theta/Vega; use it to read the straddle (betting on volatility), the covered call (a mild long + selling volatility), the spread (a tamed directional bet) and see through to the real risk at a glance; remember Delta-neutral ≠ risk-free, what's neutral is direction and what's bet is Gamma/Vega; and the first-order Greeks themselves get pushed off by the second-order Greeks Vanna (vs IV), Charm (vs time), Volga (Vega's convexity) — the root of why market makers continuously hedge and in turn move markets (Stage 8.5).** With that, this whole dashboard of the Greeks is read — you can now decompose any option position into every share of risk it actually carries. Next (from Chapter 6 on), we'll use this language to build and evaluate real strategies.
`,

  demo: "portfolio-greeks",

  analogy: `
Portfolio Greeks are like **settling a "combined ability score" for your whole team, rather than looking at one player.**

Each player (each leg) has several separate ability ratings: speed (Delta), explosiveness (Gamma), stamina drain (Theta), adaptation to weather (Vega). What the coach truly cares about isn't any one player's single rating, but **the net of these ratings summed across the whole team** — and abilities can add and cancel: a forward sprinting down the left wing (+Delta) paired with a defender tracking back (−Delta) can leave the team's "net speed" near 0.

This leads to the most critical trap: **"the team's net speed is 0" by no means equals "this team has no character, no risk."** That net-Delta≈0 straddle team isn't biased left or right in speed (not betting on direction), but its **explosiveness (Gamma) and resilience (Vega) are off the charts** — it's a team built for "chaotic, all-out attacking shootouts," hoping the match spirals out of control (the underlying moves big / IV spikes), at the cost of draining stamina (Theta) twice as fast. A coach who sees only "net speed 0" and assumes safety will be stunned by a storm of a match.

And the **second-order Greeks** are like "a player's ability ratings also changing over the course of the match": once stamina drops, speed changes too (Charm: Delta drifts with time), and once the pitch turns slick everyone's explosiveness is affected (Vanna: Delta drifts with IV). A top coach (market maker) not only watches the current combined ability score but also anticipates **how these numbers will drift on their own in the second half**, substituting and adjusting ahead of time — exactly why hedging must never stop.
`,

  misconceptions: [
    "**\"My portfolio's Delta is 0, so I have no risk.\"** — The most dangerous illusion in options. Delta-neutral only strips out **instantaneous directional** risk; the portfolio can still have **huge net Gamma and net Vega** (like a straddle). What's neutral is direction; what you're really betting is second-order exposure — a big underlying move or violent IV swing will still make you bleed.",
    "**\"A multi-leg portfolio's Greeks are too complex to compute simply.\"** — Quite the opposite, **the Greeks add directly.** Net G = Σ(each leg × contracts ×100, negative for shorts). However complex the portfolio, it compresses into a few net numbers — net Delta/Gamma/Theta/Vega — exactly its power as a risk language.",
    "**\"A covered call is just a mild long, with nothing special about its Greeks.\"** — It's actually a **mild long + selling volatility**: net Delta positive but weakened, net **−Gamma, −Vega, +Theta.** You make money collecting Theta, at the cost of giving up upside convexity and suffering when IV rises (Stage 6.2).",
    "**\"Second-order Greeks are academic toys, useless in real trading.\"** — For retail maybe an elective, but for **market makers a lifeline.** Hedging flows driven by Charm (Delta's time drift) and Vanna (Delta's IV drift) can systematically push an index's path (Stage 8.5). The first-order Greeks you flattened are exactly what they quietly push off.",
    "**\"When summing different legs' Greeks, you can mix per-share values with ×100 values.\"** — You can't, you'll be off by tens of times. **Unify the units first**: either sum all per-share values then ×100, or take each leg ×100×contracts (negative for shorts) first then sum. Remember to count a stock leg as Delta=±1/share with all other Greeks 0.",
  ],

  quiz: [
    {
      q: "You hold a portfolio: **buy 3 contracts** of calls (each Delta 0.50) **and sell 2 contracts** of calls (each Delta 0.30). What is this portfolio's **net Delta** (in equivalent shares, ×100)?",
      options: ["+90 shares", "+150 shares", "+210 shares", "+24 shares"],
      answer: 0,
      explain: "Net Delta = (+3 × 0.50 × 100) + (−2 × 0.30 × 100) = +150 − 60 = **+90 shares.** Buys positive, sells negative, each leg × contracts ×100 then summed. This is a direct application of the Greeks' additivity.",
    },
    {
      q: "A **long ATM straddle** (buy 1 call + buy 1 put, same K, same expiry) has net Delta near 0. Which statement about its risk is correct?",
      options: [
        "Net Delta≈0, so it has no risk at all",
        "It has huge positive Gamma and positive Vega, betting on a big underlying move or rising IV, and pays double Theta every day",
        "It's a purely directional long",
        "Its Gamma and Vega are also near 0",
      ],
      answer: 1,
      explain: "The straddle's two legs' Deltas (one positive, one negative) cancel (≈ neutral), but **Gamma and Vega add with the same sign** (about double a single leg), and Theta also adds up negative. So it's a pure volatility long, **+Gamma, +Vega, −Theta** — **Delta-neutral by no means equals no risk.**",
    },
    {
      q: "What is the most accurate description of the net Greeks of a **covered call** (hold 100 shares + sell 1 OTM call)?",
      options: [
        "Net +Delta, +Gamma, +Vega, −Theta",
        "Net +Delta (weakened), −Gamma, −Vega, +Theta",
        "Net Delta 0, with the other Greeks also 0",
        "Net −Delta, −Gamma, +Vega, +Theta",
      ],
      answer: 1,
      explain: "Stock gives +Delta and zero other Greeks; selling the call gives −Delta, −Gamma, −Vega, +Theta. Together it's a **mild long (net +Delta but weakened) + selling volatility (−Gamma, −Vega, +Theta).** You make money collecting Theta, at the cost of giving up upside convexity and suffering when IV rises.",
    },
    {
      q: "Which **second-order Greek** measures \"**how Delta changes with implied volatility**\" and drives market makers' hedging flows on a negatively-skewed index (Stage 8.5)?",
      options: [
        "Charm",
        "Vanna",
        "Volga (Vomma)",
        "Rho",
      ],
      answer: 1,
      explain: "**Vanna = ∂Delta/∂σ** (also equal to ∂Vega/∂S): the moment IV moves, the whole account's Delta drifts. On a negatively-skewed index, a decline often comes with rising IV, and Vanna makes hedging demand self-reinforcing, amplifying the decline (the \"Vanna flow,\" Stage 8.5). Charm is Delta drifting with **time**, Volga is Vega drifting with **IV.**",
    },
  ],

  further: [
    { label: "Investopedia: Position Greeks / Vanna & Charm", url: "https://www.investopedia.com/terms/v/vanna.asp" },
    { label: "Wikipedia: Greeks (finance) — Second-order Greeks", url: "https://en.wikipedia.org/wiki/Greeks_(finance)#Second-order_Greeks" },
    { label: "spotgamma / SqueezeMetrics: Vanna & Charm and dealer hedging flows (background reading)", url: "https://squeezemetrics.com/monitor/download/pdf/white_paper.pdf" },
  ],
};
