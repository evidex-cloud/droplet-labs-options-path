export default {
  id: "delta",
  stage: 5,
  order: 2,
  title: "Delta: Directional Exposure & Hedge Ratio",
  difficulty: 2,
  prereqs: ["greeks-overview"],

  oneLiner:
    "**Delta** is the option's most important Greek, with three faces fused into one: ① how much the option moves for every 1 the underlying rises (**directional exposure**); ② how many shares of the underlying you need to replicate/hedge the option (**hedge ratio**); ③ the option's **approximate probability of finishing in-the-money.** Call Delta runs 0 to +1, put −1 to 0, ATM about ±0.5 — and Delta itself moves as the underlying moves, which is the next lesson's Gamma.",

  intuition: `
If you can only remember one Greek, remember **Delta.** It answers the question you ask every day: **the underlying moved, how much did my option move?**

Let's nail down the most direct face first. Suppose you hold a call with Delta = **0.53.** That means:

- The underlying **rises 1**, this call (per share) rises about **0.53**; one contract (×100) makes about **53.**
- The underlying **falls 1**, it falls about **0.53.**

So Delta is the option's "**instantaneous co-movement ratio** with the underlying." A call's Delta is positive (the underlying rises, it rises), a put's Delta is negative (the underlying rises, it falls instead).

Delta's range is naturally locked into an interval:

- **Call: 0 to +1.** Deep out-of-the-money (underlying far below strike) means Delta ≈ 0 — a small underlying move and this near-worthless option just ignores it; deep in-the-money (underlying far above strike) means Delta ≈ +1 — it moves nearly 1:1 with the underlying, like "half a share." ATM is about **+0.5.**
- **Put: −1 to 0.** Deep ITM put ≈ −1, deep OTM ≈ 0, ATM about **−0.5.**

Use the engine to compute a set (K=100, 30 days, σ=20% call) and feel this "S-shaped" curve:

- S=90 (OTM): Delta ≈ **0.04** — barely moves.
- S=95: Delta ≈ **0.21.**
- S=100 (ATM): Delta ≈ **0.53.**
- S=105: Delta ≈ **0.83.**
- S=110 (ITM): Delta ≈ **0.96** — already moving almost 1:1 with the stock.

Note: Delta is **not constant.** Climbing all the way from 0.04 to 0.96, it slides as the underlying moves — how much Delta increases for every 1 the underlying rises is **Gamma** (Stage 5.3). This lesson first explains Delta's "three faces" thoroughly, and the next covers how it changes.

**In this lesson we break Delta into five pieces:**

- **① Face one: directional exposure — the underlying moves 1, the option moves Delta**
- **② Face two: hedge ratio — one option ≈ how many shares (leading to Stage 8.2)**
- **③ Face three: ≈ the probability of finishing in-the-money (careful, it's only an approximation)**
- **④ Delta's S-shaped curve: OTM≈0, ATM≈±0.5, ITM≈±1**
- **⑤ Delta changes: with the underlying (Gamma), with time, with volatility**
`,

  mechanics: `
### ① Face one: directional exposure (dollar delta)

The most practical reading: treat Delta as "**how many shares of the underlying this option equals in directional exposure.**"

A call with Delta = 0.53 represents a directional exposure of one contract (100 shares) ≈ 0.53 × 100 = **53 shares of the underlying.** The underlying rises 1, this contract makes about 53 — the same instantaneous P&L as holding 53 shares. This is called **dollar delta = Delta × 100 × number of contracts**, the universal language for translating option exposure into "equivalent shares."

- Holding **3 contracts** of Delta-0.53 calls → equivalent to a **+159-share** long exposure (3 × 0.53 × 100 ≈ 159).
- Simultaneously holding **2 contracts** of Delta-(−0.40) puts → equivalent to **−80 shares** (2 × (−0.40) × 100 = −80).
- The net exposure of the two ≈ +159 − 80 = **+79 shares.** The portfolio's directional risk is thus summed into one intuitive "equivalent share count" (the portfolio Delta of Stage 5.7 is computed exactly this way).

### ② Face two: hedge ratio

Delta's second face is a direct product of the Black-Scholes replication argument (Stage 4.1): **to hedge an option's directional risk, you need to hold Delta × 100 shares of the underlying in the opposite direction.**

- You **sell** 1 call (Delta 0.53), so you have a −53-share equivalent short exposure. To **offset** it and become directionally neutral, you buy **53 shares** of the underlying. Now the instantaneous effect of the underlying's moves on this combined position ≈ 0 — you've **Delta-hedged.**
- This is exactly the market maker's daily routine: they sell options to earn the spread, then use the underlying to push net Delta near 0, stripping out direction and keeping only the volatility exposure they want (Stage 8.2 details Delta hedging and Gamma scalping).

> The catch: Delta changes as the underlying moves (Gamma), so this hedge is **not set-and-forget.** The moment the underlying moves, 53 shares no longer hedge exactly, and you have to **dynamically rebalance.** The more frequent and precise the hedge, the higher the transaction costs — this tension is the core of Stage 8.2 and deep hedging (Stage 10.2).

### ③ Face three: ≈ the probability of finishing in-the-money

The third face is the most fascinating and the most easily misused: **a call's Delta value approximately equals its probability of finishing in-the-money (S_T > K).**

- A Delta-0.53 ATM call ≈ has a **53%** chance of finishing in-the-money.
- A Delta-0.04 OTM call ≈ has only a **4%** chance of finishing in-the-money — no wonder it's nearly worthless.
- A Delta-0.96 ITM call ≈ has a **96%** chance of finishing in-the-money, all but a done deal.

Where does this approximation come from? Recall Black-Scholes: a call's Delta = N(d1), while the (risk-neutral) probability of finishing in-the-money is N(d2) (Stage 4.1). The two are very close but **not exactly equal** (N(d1) is slightly larger than N(d2)). So remember three caveats: **(a) it's an approximation**, using N(d1) as N(d2); **(b) it's a risk-neutral probability, not a real-world one** (the distinction Stage 3.5 hammers home); **(c) it doesn't include corrections like dividends.** Traders love it for quick mental math ("this 0.30-Delta OTM put has about a 30% chance of being assigned"), but don't treat it as a precise statistical truth.

### ④ Delta's S-shaped curve

Plot Delta against the underlying S and you get a smooth **S-shaped (sigmoid)** curve:

$$Call Delta = N(d1), climbing monotonically from 0 (deep OTM) to 1 (deep ITM)
$$Put Delta = N(d1) − 1, climbing from −1 to 0
$$Steepest near ATM (where Gamma is largest), flattening at both ends
$$A few properties to remember:

- **ATM is the "gear-shift zone"**: the curve is steepest near S≈K, where Delta changes fastest — which is why ATM options have the largest Gamma (Stage 5.3).
- **Call Delta − put Delta ≈ 1**: for the same strike and expiry, the call and put Deltas always differ by about 1 (precisely, with no dividends, callΔ − putΔ = 1). Example: at S=100, call 0.53 and put about −0.47 differ by 1. This is put-call parity (Stage 3.2) projected onto Delta.
- **Near expiry, the S-curve becomes a step**: on the expiration day, ITM Delta jumps to ±1 and OTM jumps to 0, with the transition band sharply narrowing — which is also why ATM options' Gamma explodes near expiry (Stage 5.3).

### ⑤ Delta changes: three drivers

Delta is the slope "right now," and it itself drifts with three things:

- **With the underlying S (this is Gamma)**: the underlying rises, call Delta increases (closer to 1), put Delta also increases (closer to 0). How much Delta changes per 1 the underlying moves = Gamma (Stage 5.3). This is Delta's main source of change.
- **With time t (this is Charm / delta decay)**: the passage of time pushes Delta toward the extremes. An OTM option's Delta trends toward 0 with time (less and less hope), an ITM option's toward ±1. This "drift of Delta with time" is called **Charm**, a second-order Greek (Stage 5.7), and market makers care about it especially near expiry/over weekends.
- **With volatility σ (this is Vanna)**: rising volatility pulls Delta toward 0.5 (as uncertainty grows, even deep ITM/OTM options become "less certain"). Delta's sensitivity to volatility is called **Vanna** (Stage 5.7).

Stringing the five pieces together: **Delta wears three hats — directional exposure (move 1, make Delta), hedge ratio (one contract ≈ Delta×100 shares, the basis of Delta hedging, leading to Stage 8.2), ≈ the probability of finishing in-the-money (a risk-neutral approximation, not the truth); it walks an S-shaped curve from the OTM 0 to the ITM ±1, about ±0.5 and steepest at ATM; and Delta itself drifts with the underlying (Gamma), time (Charm), and volatility (Vanna).** Since Delta is always changing, "how fast it changes" becomes the next quantity to master — Gamma (Stage 5.3).
`,

  demo: "delta-curve",

  analogy: `
Delta is like **how far down the gas pedal is pressed** — how much you press it sets the ratio at which the underlying's "throttle" transmits to your P&L.

- **A deep OTM option (Delta ≈ 0)**: the pedal is barely pressed. The engine (the underlying) roars (rises and falls), but the drivetrain is nearly disconnected, and your car (the option) doesn't budge.
- **An ATM option (Delta ≈ 0.5)**: the pedal is halfway down. The underlying moves 1, you move half a step — power is partially engaged. And here the pedal is most "twitchy": a light touch changes the throttle a lot (this is high Gamma).
- **A deep ITM option (Delta ≈ 1)**: the pedal is floored. The underlying moves 1, you move almost 1 too — your option is now nearly "a car in sync with the stock," except it was cheaper to buy (you used leverage).

And the "hedge ratio" face is like **pressing the brake in reverse to offset the gas**: you sold a Delta-0.53 call (like having 53% reverse throttle pressed), so you buy 53 shares of the underlying (press 53% forward throttle back) to flatten it, holding the whole car "still" directionally. The trouble is the throttle position (Delta) keeps changing with road conditions (the underlying's position), so you have to **keep fine-tuning the brake** — exactly the dynamic Delta hedging a market maker does every day.
`,

  misconceptions: [
    "**\"Delta = 0.30 means the underlying rises 1 and the option rises 30%.\"** — It's not a percentage, it's an **absolute dollar amount.** Delta 0.30 means the underlying rises 1 and the option (per share) rises about **0.30.** It's the \"dollar co-movement ratio,\" not a rate of return.",
    "**\"Delta is the exact probability of finishing in-the-money.\"** — It's only an **approximation.** A call's Delta = N(d1), while the in-the-money probability is N(d2) — close but not equal (N(d1) slightly larger); and that's a **risk-neutral probability**, not a real one (Stage 3.5). Fine for quick mental math, not for precise statistics.",
    "**\"Delta is fixed — compute it once when you open the position and you're done.\"** — Delta is **changing every moment**: with the underlying (Gamma), with the passage of time (Charm), with volatility changes (Vanna). This is exactly why Delta hedging must **dynamically rebalance** rather than being set-and-forget (Stage 8.2).",
    "**\"Call Delta 0.6 and put Delta −0.6 add up to direction-neutral.\"** — Misleading. A same-underlying call +0.6 and put −0.6 have directional exposures of +0.6 and −0.6, netting to 0, true; but if it's \"buy call + buy put\" (a straddle), the two legs' Deltas (one positive, one negative) can indeed be near-neutral, yet you still hold huge **+Gamma, +Vega** — direction-neutral ≠ risk-free (Stage 5.7).",
    "**\"An ITM option's Delta is near 1, so it's no different from buying the stock outright.\"** — Directionally an instantaneous approximation, but the option still has **Theta (time decay), Vega (volatility exposure), and an expiry**, plus built-in leverage and a limited-risk structure. Delta≈1 only means \"directional sensitivity right now is near the stock's,\" not that the risk profile is the same.",
  ],

  quiz: [
    {
      q: "You hold **5 contracts** of call options, each with Delta = 0.40. This position's directional exposure is approximately equivalent to holding how many shares of the underlying?",
      options: ["2 shares", "40 shares", "200 shares", "2000 shares"],
      answer: 2,
      explain: "Equivalent shares = Delta × 100 × number of contracts = 0.40 × 100 × 5 = **200 shares.** The underlying rises 1, this set of calls makes about 200 — the same instantaneous P&L as holding 200 shares. This is Delta's \"directional exposure\" face.",
    },
    {
      q: "A market maker **sells** 1 call option (Delta = 0.60). To hedge this option's directional risk to neutral, what should they do?",
      options: [
        "Buy 60 shares of the underlying",
        "Sell 60 shares of the underlying",
        "Buy 100 shares of the underlying",
        "Do nothing; selling the option is itself neutral",
      ],
      answer: 0,
      explain: "Selling a call = −0.60 × 100 = −60 shares of equivalent short exposure. To offset it and become Delta-neutral, they need to **buy 60 shares** of the underlying (Delta × 100). Note that the moment the underlying moves Delta changes (Gamma), so this hedge must be maintained dynamically (Stage 8.2).",
    },
    {
      q: "An OTM put has Delta = −0.25. Using the \"Delta ≈ probability of finishing in-the-money\" face, what is its approximate probability of finishing in-the-money (being exercised)?",
      options: ["About 25%", "About 75%", "About 50%", "About 0%"],
      answer: 0,
      explain: "The **absolute value** of a put's Delta ≈ the approximate probability of finishing in-the-money, so about **25%.** This is a risk-neutral approximation (using N(d1) for N(d2)); traders often use it to quickly gauge \"the chance this gets assigned,\" but it's not a precise truth.",
    },
    {
      q: "For the **call and put** on the same underlying, same strike, and same expiry, what is the relationship between their Deltas (with no dividends)?",
      options: [
        "Call Delta + put Delta = 0",
        "Call Delta − put Delta ≈ 1",
        "The two Deltas are always equal",
        "Their sum is always 2",
      ],
      answer: 1,
      explain: "With no dividends, **call Delta − put Delta = 1** (example: call +0.53, put −0.47, difference = 1). This is put-call parity (Stage 3.2) projected onto Delta: a synthetic long (buy call + sell put) has a Delta of exactly 1, just like holding 1 share of the underlying.",
    },
  ],

  further: [
    { label: "Investopedia: Delta (definition, hedge ratio, probability reading)", url: "https://www.investopedia.com/terms/d/delta.asp" },
    { label: "Options Industry Council (OIC): Delta", url: "https://www.optionseducation.org/advancedconcepts/the-greeks" },
    { label: "Wikipedia: Greeks (finance) — Delta", url: "https://en.wikipedia.org/wiki/Greeks_(finance)#Delta" },
  ],
};
