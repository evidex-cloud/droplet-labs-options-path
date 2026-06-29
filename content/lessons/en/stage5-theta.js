export default {
  id: "theta",
  stage: 5,
  order: 4,
  title: "Theta: Time Is Melting Your Option",
  difficulty: 2,
  prereqs: ["greeks-overview"],

  oneLiner:
    "**Theta** is time decay: with everything else unchanged, how much value an option loses from just one day passing. The buyer's Theta is **negative** (time is the enemy, time value melting day by day), the seller's is **positive** (time is the friend, collecting rent every day). An ATM option's Theta **accelerates** near expiry — that famous \"time-value melting curve.\" And the Theta you pay buys exactly the convexity of Gamma (Stage 5.3).",

  intuition: `
Options and stocks have a fundamental difference: **options expire.** An option that finishes out-of-the-money at expiry is worth nothing (Stage 1.1). This means the "time value" in an option (Stage 1.6) **bleeds away to zero** as expiry approaches, day by day. How much it bleeds each day is **Theta.**

In one sentence: **Theta = how much money your option evaporates for each day that passes.**

Feel it with engine-computed numbers (K=100, σ=20% ATM call):

- At 90 days to expiry, price ≈ 4.45, Theta ≈ **−0.027/day**: with nothing moving today, tomorrow it's worth about 0.027 less (one contract ×100 ≈ −2.7).
- At 30 days, price ≈ 2.45, Theta ≈ **−0.044/day.**
- At 7 days, price ≈ 1.14, Theta ≈ **−0.084/day.**
- At 1 day, Theta ≈ **−0.214/day**!

See that curve? **The closer to expiry, the faster an ATM option's time value bleeds** — not a steady leak, but **leaking faster and faster**, breaking like a dam near expiry. Plot the ATM option's value against "days remaining" and you get a curve that **collapses with acceleration** — one of the most famous charts in option trading: the **theta decay curve.**

Why is time the enemy for the buyer? Because the premium you paid when buying the option includes a slice of "time value" — money paid for the **possibility** of "still becoming more valuable before expiry" (Stage 1.6). Each day that passes, there's one less day of possibility, and this value shrinks a bit. At the moment of expiry, time value necessarily goes to zero, leaving only intrinsic value.

But immediately remember the other side of the coin (the sign convention from Stage 5.1): **a long is −Theta, in exchange for +Gamma and +Vega.** The time rent you pay every day buys the convexity of Gamma's "accelerate with the wind." So **Theta isn't pure loss, it's the cost of holding convexity** — this is the Gamma-Theta tradeoff, the single most important sentence of this lesson and the last combined:

> **You pay Theta to "rent" Gamma.** If the underlying's actual movement is big enough, Gamma's gains exceed Theta's rent and the buyer makes money; if the underlying is dead still, Theta is paid for nothing and the buyer is slowly ground down by time.

For the **seller**, Theta is positive — they collect this rent every day, the profit engine of seller strategies like covered calls, short straddles, and iron condors (Chapters 6, 7). The cost, of course, is bearing the risk of −Gamma and −Vega.

**In this lesson we break Theta into five pieces:**

- **① What Theta is: the (time) value lost for each day that passes**
- **② Buyer −Theta (time is the enemy) vs seller +Theta (time is the friend)**
- **③ The time decay curve: why ATM melts with acceleration near expiry**
- **④ Theta vs Gamma: you pay time rent, you buy convexity**
- **⑤ Decay shapes across moneyness: ATM fiercest, OTM collapses early**
`,

  mechanics: `
### ① Theta's definition and units

Theta is the option price's sensitivity to **the passage of time** — the price curve's slope vs time:

$$Theta = ΔV / Δt   (as time passes, how the price changes; usually negative)
$$**The units are crucial**: this course's engine (\`_bs.js\`) uses the price change for **1 calendar day** passing (annualized Theta already divided by 365). So Theta = −0.044 reads directly as "**per day** worth 0.044 less per share." Note some platforms use "per year" or "per trading day," where the numbers differ a lot — always align units before comparing.

There's also the ×100: per-share Theta −0.044 → about **−4.4 per contract per day.** Holding 10 contracts is about −44 per day evaporating, rain or shine, even if the underlying doesn't budge.

> An often-overlooked detail: **weekends decay too.** Options accrue Theta by calendar day; buy Friday, look Monday, and three days of time value are gone — but the market traded… zero days. This is why many buyers "find a loss the moment Monday opens" — the weekend's Theta gets collected all the same.

### ② Buyer −Theta vs seller +Theta

Theta's sign is set by whether you "hold possibility" or "sell possibility":

- **Buyer (−Theta, time is the enemy)**: you paid premium to buy time value, and it bleeds away each day, so your Theta is negative. You're racing the clock — the underlying must move **far enough** in your favor **soon enough**, or time grinds you down. Buying OTM lottery tickets is especially brutal: it's almost all time value, decaying fast.
- **Seller (+Theta, time is the friend)**: you collected premium, and the time value you sold "melts into your pocket" each day. As long as the underlying doesn't move wildly and IV doesn't spike, you collect rent day by day via Theta. This is the core profit source of **all positive-Theta strategies** (covered calls, cash-secured puts, iron condors, short straddles) — essentially collecting the **variance risk premium** (Stage 8.3).

This symmetry again confirms the master switch from Stage 5.1: **the time rent one side collects is exactly what the other pays for convexity.** No one's Theta arises from nothing.

### ③ The time decay curve: why it accelerates

The most classic chart: plot the **ATM** option's value against "days remaining" and you get a curve that's **convex downward, collapsing with acceleration.** Roughly, an ATM option's time value shrinks about as **√T**:

$$ATM time value ∝ σ·S·√T   (√T sets the "accelerating" shape of the decay)
$$What √T means: halve the time remaining and time value drops **only** about 30% (because √0.5 ≈ 0.71), not by half. In other words, **the time far out isn't worth much, and the time near in is precious** — the last few days concentrate a large amount of value, so decay is fiercest near expiry.

Confirmed by computation (ATM call value): 90 days 4.45 → 60 days 3.56 → 30 days 2.45 → 14 days 1.64 → 7 days 1.14 → 1 day 0.42. Note from 90 to 60 days (30 days passing) it only dropped 0.89, while from 30 to 1 day (29 days passing) it dropped a full 2.03 — **the same month passing, the closer to expiry, the harder the fall.** The corresponding Theta accelerates from −0.027 all the way to −0.214.

> Practical implication: **buyers who want time shouldn't buy too short** (short options' Theta is too heavy); **sellers who want to collect Theta love selling near expiry** (decay fastest, with the 30–45-day stretch often considered the best value). But selling the near month costs you high Gamma (Stage 5.3) — back to that tradeoff.

### ④ Theta vs Gamma: two sides of one coin

This is the chapter's "crux." For the **buyer**, Theta and Gamma have opposite signs yet are tightly bound: **+Gamma necessarily comes with −Theta.** In the Black-Scholes world there's an exact relationship between them (with no dividends and the rate term dropped):

$$Theta ≈ −½ · Gamma · S² · σ²
$$Read this: **the larger Gamma (the stronger the convexity), the more Theta you pay each day.** A high-Gamma near-month ATM option also has the heaviest Theta — there's no free convexity. This welds the last lesson and this one into one sentence:

> **Holding an option = long Gamma, short Theta.** Every day you pay time rent (Theta) to buy the convexity gains from the underlying's movement (Gamma). Who wins depends on **realized vs implied volatility**: if the underlying's realized volatility exceeds the IV-implied volatility, Gamma gains > Theta cost and the buyer wins (exactly the logic of Gamma scalping, Stage 8.2); otherwise the seller wins (collecting the variance risk premium, Stage 8.3).

So "Theta is negative" by no means equals "buying options always loses." It's only one side of the cost; the other side is the potential gains from Gamma and Vega. Only by looking at both sides together do you get the complete account.

### ⑤ Decay shapes across moneyness

Time decay isn't the same for all options:

- **At-the-money (ATM)**: time value is **largest in absolute terms**, and decays **fiercest** near expiry (that signature collapsing curve). The seller's main battlefield for collecting Theta.
- **Deep in-the-money (ITM)**: most value is intrinsic, time value is a small fraction, so Theta is relatively mild; the rate term also makes deep-ITM Theta behavior slightly more complex.
- **Deep out-of-the-money (OTM)**: time value is small but makes up the entire price. It decays toward zero **early and relatively gently** — not plunging only at the end like ATM, but bleeding slowly the whole way (a call at S=100, K=110: worth 1.12 at 90 days, only 0.14 at 30 days, nearly 0 at 7 days). Buying an OTM lottery ticket, most of the time you're not "losing only on the last day" but **losing slowly every day.**

Stringing the five pieces together: **Theta is the time value lost for each day that passes; the buyer is −Theta (time is the enemy), the seller +Theta (time is the friend), one side's rent the other's cost; an ATM option's time value melts with acceleration as √T, that collapsing curve steepest near expiry; and Theta and Gamma are the same coin — you pay time rent to buy convexity, with the win or loss depending on realized vs implied volatility; decay shapes vary across moneyness, ATM fiercest and OTM bleeding slowly.** Theta and Gamma speak of "time" and "the underlying," but there's a bigger exposure we've kept mentioning without unpacking — when you buy an option, you're really buying **volatility** itself. That's Vega (Stage 5.5).
`,

  demo: "theta-decay",

  analogy: `
Theta is like **holding a block of ice that's melting in your hand.**

You paid money for a block of ice (the option's time value). From the moment you bought it, it's melting — and **the closer it gets to "fully melted," the faster it melts**:

- **Far from expiry (90 days)**: the block is big, kept in the shade, dripping only a few drops a day. Theta is small, you don't mind much.
- **Near expiry (the last week)**: the block is already small and now moved into the sun, **melting fast.** Theta grows sharply, and you watch it shrink before your eyes.
- **On expiration day**: the last bit of ice melts away in an instant — time value goes to zero, leaving only the puddle at the bottom that was already yours (intrinsic value).

This explains several things: **why buyers shouldn't buy too-short ice** (a small block melts too fast, Theta too heavy); **why sellers love selling near-expiry ice** (in this stretch the ice melts fastest, and the melted water all goes into the seller's pocket — they collect +Theta).

But don't forget the other side of the coin: you bought this ice not just to clutch it (that only loses), but to **wait for a possible big rain (a big underlying move, Gamma)** — if the rain is big enough, the water you catch far exceeds the melting loss and you make money. The water the ice drips each day (Theta) is the entry fee you pay for "waiting for rain" (Gamma). This is the Gamma-Theta tradeoff.
`,

  misconceptions: [
    "**\"Theta is negative, so buying options loses long-run for sure.\"** — One-sided. The buyer's −Theta is in exchange for **+Gamma and +Vega.** As long as the gains from the underlying's actual movement (or a rise in IV) exceed the time rent, the buyer makes money. Theta is only one side of the cost, not the whole account (the tradeoff of Stage 5.3).",
    "**\"Time value bleeds away at a steady linear rate.\"** — No. An ATM option's time value decays roughly as **√T**, **accelerating sharply near expiry** (that collapsing curve). Halve the time remaining and value drops only about 30%; the plunge concentrates in the last few days.",
    "**\"Weekends don't trade, so there's no decay over the weekend.\"** — It decays all the same. Theta accrues by **calendar day**; from Friday to Monday three calendar days pass, and three days of time value bleed away. Many buyers \"find a loss the moment Monday opens\" — the culprit is the weekend's Theta.",
    "**\"All options have the same Theta decay shape.\"** — Different. **ATM** has the largest time value and the fiercest decay near expiry; **deep OTM** bleeds slowly the whole way and goes to zero early; **deep ITM**, with intrinsic value dominant, has relatively mild Theta. The main battlefield for selling Theta is the near-month ATM.",
    "**\"To collect more Theta, just sell the nearest-expiry option — no cost.\"** — A big cost. Near-expiry Theta is fattest, but **Gamma is largest too** (Stage 5.3) — one underlying jump, and the loss from negative Gamma can instantly swallow the rent you slowly collected. High Theta is forever bound to high Gamma risk.",
  ],

  quiz: [
    {
      q: "A call option has **Theta = −0.05 (per day, per share).** With the underlying, IV, and rates all completely unchanged, after **3 calendar days** (including one weekend) pass, roughly how much time value does this option (per share) lose?",
      options: ["About 0.05", "About 0.15", "About 0.50", "Nothing, because weekends don't trade"],
      answer: 1,
      explain: "Theta accrues by calendar day, so 3 days ≈ 0.05 × 3 = **0.15 per share** (one contract ×100 ≈ 15). Weekends decay all the same — a common pit buyers fall into.",
    },
    {
      q: "Which description of **ATM-option time decay** is correct?",
      options: [
        "Time value bleeds at a steady linear rate, losing the same each day",
        "Time value decays about as √T, accelerating sharply near expiry",
        "The closer to expiry, the slower the decay",
        "ATM options have no time value, so no Theta",
      ],
      answer: 1,
      explain: "ATM time value is roughly ∝ **√T**, so it **melts with acceleration near expiry** (90→30 days drops 2, 30→1 day can drop even more). That accelerating, collapsing curve is one of the most signature charts in option trading. ATM is precisely where time value is largest.",
    },
    {
      q: "Why is it said that \"the buyer pays Theta and what they buy is Gamma\"? What is the tradeoff behind this sentence?",
      options: [
        "Because Theta and Gamma are the same number",
        "Because a long option is born +Gamma bound with −Theta; you pay time rent in exchange for convexity, and the win or loss depends on realized vs implied volatility",
        "Because the larger Theta, the smaller Gamma",
        "Because only the seller holds both Gamma and Theta at once",
      ],
      answer: 1,
      explain: "A long option binds **+Gamma, −Theta** (in BS, Theta ≈ −½·Gamma·S²·σ²). You pay Theta each day to \"rent\" Gamma's convexity; if the underlying's **realized volatility > implied volatility**, Gamma gains exceed the Theta cost and the buyer wins (Gamma scalping, Stage 8.2), otherwise the seller wins (the variance risk premium, Stage 8.3).",
    },
    {
      q: "A seller wants to collect rent via Theta. Which option's **time decay is fastest, with the fattest Theta collected per unit time** (but also the highest Gamma risk)?",
      options: [
        "A deep-OTM call with 1 year to expiry",
        "An ATM option with a few days to expiry",
        "A deep-ITM call with half a year to expiry",
        "All options have the same Theta",
      ],
      answer: 1,
      explain: "**ATM + near expiry** has the fiercest time-value decay and the largest absolute Theta — the main battlefield for selling Theta. But the cost is that this kind of option has the **largest Gamma too** (Stage 5.3) — one underlying jump, and negative Gamma can instantly swallow the rent collected. High Theta is forever bound to high Gamma.",
    },
  ],

  further: [
    { label: "Investopedia: Theta (time decay explained)", url: "https://www.investopedia.com/terms/t/theta.asp" },
    { label: "Investopedia: Time Decay (the time-value decay curve)", url: "https://www.investopedia.com/terms/t/timedecay.asp" },
    { label: "Wikipedia: Greeks (finance) — Theta", url: "https://en.wikipedia.org/wiki/Greeks_(finance)#Theta" },
  ],
};
