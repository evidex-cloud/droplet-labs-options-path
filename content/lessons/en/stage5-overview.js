export default {
  id: "greeks-overview",
  stage: 5,
  order: 1,
  title: "The Greeks Overview: Your Dashboard",
  difficulty: 2,
  prereqs: ["black-scholes"],

  oneLiner:
    "**The Greeks** are an option price's sensitivities to each of its inputs — how much the price changes when the underlying moves a bit, a day passes, or volatility ticks up. They're a set of **dashboard gauges**: buy any option and you're not just betting on direction, you're simultaneously holding a basket of **Delta (direction), Gamma (acceleration), Theta (time), Vega (volatility), Rho (rates)** exposures. Read these five gauges and you finally know what risk you're really taking.",

  intuition: `
You already know how to use Black-Scholes (Stage 4.1) to compute an option's theoretical price from five inputs. But in real trading, what you care about is usually not "what's it worth now," but — **if something changes next, how will my option move?**

- The stock rises 1, how much does my call make?
- Another day passes, how much time value melts away?
- Implied volatility collapses 10 points after earnings, how much do I lose?

These "**how much**" questions are the Greeks. They're named with Greek letters (Delta, Gamma, Theta, Vega, Rho), and each answers "how large is the price's sensitivity to one particular factor."

An analogy: the option price is like a car's position, and the Greeks are the various needles on the dashboard. **Delta is the speedometer** (the underlying moves a notch, how fast do you move), **Gamma is the accelerometer** (how fast the speed itself changes), **Theta is the fuel gauge** (time burns away your time value day by day), **Vega is the road-conditions gauge** (the effect of volatility changes on you), and **Rho is a small gauge that barely moves** (the effect of rates, usually negligible, important only for long-dated options). When you drive you watch the dashboard; **to manage an option you watch the Greeks.**

Take a concrete set of numbers (S=K=100, 90 days to expiry, rate 4%, implied volatility 20%, a **call**, computed by the engine):

- **Delta ≈ 0.56**: the underlying rises 1, this call rises about 0.56 (per share; ×100 for the contract is about 56).
- **Gamma ≈ 0.040**: for every 1 the underlying rises, Delta itself increases by about 0.040.
- **Theta ≈ −0.027 /day**: with nothing moving, just one day passing, this option loses about 0.027 in value.
- **Vega ≈ 0.196 /1%**: for every 1 percentage point implied volatility rises (20%→21%), the option rises about 0.196.
- **Rho ≈ 0.127 /1%**: for every 1 percentage point rates rise, the option rises about 0.127.

See the key point? When you buy this call, you're **by no means just "betting it rises."** You're simultaneously "**short Theta**" (time collects rent from you every day), "**long Vega**" (you hope volatility rises), and "**long Gamma**" (you hope it moves a lot). Many people lose money because they got the direction right but were quietly drained by these two gauges they never noticed — Theta and Vega.

**In this lesson we break this dashboard of "the Greeks" into five pieces:**

- **① What a sensitivity is: saying "how much it changes" clearly (it's just a slope)**
- **② The five-Greek overview table: what each measures and in what units**
- **③ Sign conventions: a buyer is born +Gamma +Vega −Theta, with Delta by direction**
- **④ This course's units: vega/per 1%, theta/per day, rho/per 1% (memorize these)**
- **⑤ Why you should "manage positions by the Greeks" rather than just watching price**
`,

  mechanics: `
### ① What a sensitivity is: it's just a "slope"

Each Greek is, at its core, the **slope** of the option-price curve with respect to some input (mathematically a partial derivative, but you can simply remember "slope").

Think of the option price V as a function: \`V = f(S, t, σ, r)\` (underlying price, time, volatility, rate). Hold the others fixed and let just one of them move a tiny bit; the ratio of the price change is the corresponding Greek:

$$Delta = ΔV / ΔS    (the price's slope vs the underlying)
$$Theta = ΔV / Δt    (the price's slope vs time, usually negative)
$$Vega  = ΔV / Δσ    (the price's slope vs volatility)
$$Rho   = ΔV / Δr    (the price's slope vs the rate)
$$And **Gamma is special**: it's Delta's slope vs the underlying, i.e., "the slope of the slope" — the **curvature** of the price curve (the second derivative). Precisely because the option-price curve is curved (recall that hockey stick in Stage 1.1), Delta changes as the underlying moves, and that "change" is measured by Gamma (Stage 5.3 covers it in depth).

> Key intuition: the Greeks are a **local linear approximation.** They tell you how the price moves "near the current point, for small changes." Once the underlying moves a lot, the old Delta is no longer accurate — which is exactly the point of Gamma: use it to correct Delta's change.

### ② The five-Greek overview

Put the five protagonists side by side (the values use the same S=K=100, 90-day, σ=20% call computed above, to build a sense of magnitude):

- **Delta (Δ) — direction**: how much the option price changes for every 1 the underlying moves. Call 0→+1, put −1→0, ATM about ±0.5. It also has two other identities: ≈ "the probability of finishing in-the-money," and = "the number of shares of the underlying needed to hedge this option" (Stage 5.2). Example value: **+0.56.**
- **Gamma (Γ) — acceleration**: how much Delta changes for every 1 the underlying moves. Always positive for the buyer (convexity), largest at-the-money and near expiry. Example value: **+0.040.**
- **Theta (Θ) — time**: how much the option price changes for every 1 day that passes. Negative for the buyer (time is the enemy), positive for the seller. Decays fastest at-the-money near expiry. Example value: **−0.027/day.**
- **Vega (ν) — volatility**: how much the option price changes for every 1 percentage point of implied volatility. Always positive for the buyer, largest at-the-money and for long-dated options. Example value: **+0.196/1%.**
- **Rho (ρ) — rate**: how much the option price changes for every 1 percentage point the risk-free rate moves. Positive for calls, negative for puts, significant only for long-dated options (LEAPS). Example value: **+0.127/1%.**

There's also a class of **second-order Greeks** (Vanna, Charm, Volga, etc.) that measure "the rate of change of the Greeks themselves," fine-grained tools for market-maker hedging that we leave for Stage 5.7.

### ③ Sign conventions: the buyer's "born position"

This is the one thing that should be burned into muscle memory. **Simply buying an option (call or put alike)**, you're born holding these Greek signs:

$$Long option: +Gamma   +Vega   −Theta
$$(Delta's sign depends on the type: positive for a call, negative for a put)
$$- **+Gamma**: your position is "convex" — the more the underlying moves in your favor, the faster you make money; the more it moves against you, the slower you lose. Convexity is good for the buyer.
- **+Vega**: rising volatility makes you money. Buying an option = buying volatility (Stage 5.5).
- **−Theta**: here's the cost. Convexity and volatility exposure aren't free — every day you "rent" them by paying out the bleed of time value (negative Theta).

**The seller's (short position) signs are all flipped**: −Gamma, −Vega, +Theta. The seller makes money by collecting Theta (time decay), at the cost of bearing dangerous negative Gamma (losing faster and faster when the underlying moves big) and negative Vega (losing the moment volatility rises). This symmetry is the master switch for understanding the risk of every option strategy — remember: **the time rent one person collects is exactly what another pays for convexity.**

> Memorize this one line: **buying an option = long "volatility and convexity," short "time"; selling an option = the reverse.** The direction you profit from and the second-order risk you bear are often not the same thing.

### ④ This course's units (memorize these)

The "units" of the Greeks follow several conventions, and a mismatch can throw the numbers off by tens of times. **This course's engine (\`_bs.js\`) and all demos uniformly adopt the conventions most common on a trading desk:**

- **Delta**: per-share basis, the price change for the underlying moving **1** (dimensionless, in the 0–1 range).
- **Gamma**: the Delta change for the underlying moving **1.**
- **Theta**: the price change for **1 calendar day** passing (not per year; already divided by 365).
- **Vega**: the price change for implied volatility moving **+1 percentage point** (i.e., +0.01) — **not per +100%.**
- **Rho**: the price change for the risk-free rate moving **+1 percentage point.**

There's also the inescapable **contract multiplier ×100**: the above are all **per-share** values, and one U.S. equity option represents 100 shares, so to convert to "the dollar Greek of one contract" you multiply by 100 again. For example, Theta −0.027/day → about **−2.7 per contract per day.** At the portfolio level, multiply each leg's Greek by the number of contracts and ×100, then sum — that's the portfolio Greeks of Stage 5.7.

### ⑤ Why manage positions by the Greeks

Beginners watch "is this option making money right now"; professional traders watch **the whole set of Greeks.** Three reasons:

- **Decompose the source of risk**: the same 500 loss — is it the underlying moving against you (Delta), time running out (Theta), or volatility collapsing (Vega)? The Greeks break a vague P&L into several separately manageable exposures. From them you can judge "should I shore up direction, or cut volatility exposure."
- **Additive, hedgeable**: the Greeks **add linearly** across the whole account (Stage 5.7). Market makers strip out directional risk precisely by tuning net Delta to 0 (**Delta hedging**, Stage 8.2), keeping only the volatility exposure they want. Without the Greeks there's no modern risk management.
- **The interface to quant and AI**: the Greeks are the "sensors" between model and reality. Quant strategies use them for risk budgeting, market makers use Vanna/Charm to forecast hedging flows (Stage 8.5), and "deep hedging" (Stage 10.2) simply uses a neural network to learn the optimal hedge directly — but the starting point of all of it is reading these five gauges.

Stringing the five pieces together: **the Greeks = an option price's slopes vs each input (Gamma is the slope of the slope); the five protagonists Delta/Gamma/Theta/Vega/Rho each govern one dimension; a buyer is born +Gamma +Vega −Theta; this course's units are vega/per 1%, theta/per day, rho/per 1%, plus the ×100 contract multiplier; learn to decompose, sum, and hedge by the Greeks and you finally truly "see" an option position.** Over the next five lessons we'll tighten each gauge to the limit — starting with the most important, Delta (Stage 5.2).
`,

  demo: "greeks-dashboard",

  analogy: `
The Greeks are like **a row of instruments in an airplane cockpit.**

A pilot doesn't just watch "where is the plane now," they watch a whole row of gauges:

- **The airspeed indicator (≈ Delta)**: how fast you're "moving" directionally — the underlying moves a bit, how much your P&L moves.
- **Acceleration / attitude change (≈ Gamma)**: how fast that speed itself is changing — especially deadly in a big move.
- **The fuel gauge (≈ Theta)**: fuel is continuously consumed, time ticks away second by second, your time value burns.
- **The weather radar (≈ Vega)**: the strengthening or weakening of turbulence ahead (volatility) violently rocks your plane.
- **A rarely-checked small gauge (≈ Rho)**: barely moves in normal times, worth a glance only on a long-haul flight (long-dated options).

A pilot who only watches "where is the plane" will eventually crash; so will a trader who only watches "is the option making money." **A true expert reads the combination of the whole instrument row** — knowing fuel is almost out (high Theta), passing through turbulence (high Vega), and so adjusting ahead of time even if the direction is right. Each of the following lessons in this chapter walks you through reading these gauges one by one.
`,

  misconceptions: [
    "**\"Buying options just needs the direction right; the Greeks are for quants.\"** — Quite the opposite. Getting the direction right yet losing money — the most common culprit is the ignored **Theta (time decay) and Vega (a drop in volatility).** The Greeks are the \"risk disclosure\" every option buyer should read.",
    "**\"The Greeks are fixed numbers.\"** — They're **changing every moment.** Delta moves with the underlying (that's Gamma), Theta accelerates near expiry, Vega shrinks as expiry approaches. They're the local slope of \"this moment, for small changes,\" not constants.",
    "**\"Vega is a Greek letter (it isn't even a Greek letter).\"** — Nominally true, \"vega\" isn't a letter in the Greek alphabet, but by trading convention it's treated as the fifth Greek. The point isn't the name but that it measures **sensitivity to volatility** — one of an option's most central exposures.",
    "**\"Theta is negative, so buying options is always a losing game.\"** — Wrong. A buyer pays Theta to get **+Gamma and +Vega.** As long as the gains from the underlying's actual movement (or a rise in IV) exceed the time rent paid, the buyer makes money — this is exactly the Gamma-Theta tradeoff (Stage 5.4).",
    "**\"The Greek values should be the same across different platforms.\"** — Not necessarily. Theta has \"per day vs per year,\" Vega has \"per 1% vs per 100%,\" and different models (with or without dividends, which rate is used) also differ. **Confirm the units before comparing** — this course uniformly uses vega/per 1%, theta/per day, rho/per 1%.",
  ],

  quiz: [
    {
      q: "You simply **buy** a call option (with no hedging at all). Which set of Greek signs is correct?",
      options: [
        "−Gamma, −Vega, +Theta, Delta positive",
        "+Gamma, +Vega, −Theta, Delta positive",
        "+Gamma, −Vega, −Theta, Delta negative",
        "−Gamma, +Vega, +Theta, Delta negative",
      ],
      answer: 1,
      explain: "**A long option is born +Gamma, +Vega, −Theta**; a call's Delta is positive (a put's is negative). You're long convexity and volatility, short time — paying Theta every day to \"rent\" Gamma and Vega. The seller's signs are all flipped.",
    },
    {
      q: "A call has **Vega = 0.20** (this course's units: per +1% implied volatility). If IV rises from 25% to 28% with everything else unchanged, roughly how much does this option's (per-share) price change?",
      options: ["Rises about 0.06", "Rises about 0.20", "Rises about 0.60", "Rises about 6"],
      answer: 2,
      explain: "Vega is the change \"per +1% IV.\" IV rose 3 percentage points (25→28), so the price changes about 0.20 × 3 = **0.60 per share** (one contract ×100 ≈ 60). Note the units are per 1%, not per 100%.",
    },
    {
      q: "Which description of **Gamma** is the most accurate?",
      options: [
        "It measures the option price's sensitivity to time",
        "It measures Delta's sensitivity to changes in the underlying price, i.e., the curvature (convexity) of the price curve",
        "It measures the option price's sensitivity to interest rates",
        "It and Delta are two names for the same thing",
      ],
      answer: 1,
      explain: "**Gamma is Delta's rate of change** (the price's second derivative, the curve's curvature). Because the price curve is curved, Delta changes as the underlying moves, and that change is measured by Gamma (Stage 5.3). It's not a time or rate sensitivity, nor is it equal to Delta.",
    },
    {
      q: "A call in this course's engine has **Theta = −0.027 (per day, per share).** Converted to \"the dollar time decay of one contract in one day,\" roughly how much is it?",
      options: ["−0.027", "−2.7", "−27", "−270"],
      answer: 1,
      explain: "The per-share Theta is −0.027/day, and one U.S. equity option = **100 shares**, so ×100 ≈ **−2.7/day.** Don't forget the contract multiplier: every per-share Greek must be ×100 to get the dollar amount for one contract.",
    },
  ],

  further: [
    { label: "Investopedia: Option Greeks (overview of the five Greeks)", url: "https://www.investopedia.com/trading/getting-to-know-the-greeks/" },
    { label: "Options Industry Council (OIC): The Greeks", url: "https://www.optionseducation.org/advancedconcepts/the-greeks" },
    { label: "Wikipedia: Greeks (finance)", url: "https://en.wikipedia.org/wiki/Greeks_(finance)" },
  ],
};
