export default {
  id: "gamma",
  stage: 5,
  order: 3,
  title: "Gamma: The Acceleration of Delta",
  difficulty: 3,
  prereqs: ["delta"],

  oneLiner:
    "**Gamma** is Delta's rate of change — how much Delta itself moves for every 1 the underlying moves. It's the **curvature (convexity)** of the option-price curve. The buyer's Gamma is positive (the more the underlying moves in your favor, the faster you make money — a good thing), the seller's is negative (dangerous: losing faster and faster when the underlying moves big). Gamma is **largest at-the-money** and **explodes near expiry** — the most underrated piece of option risk.",

  intuition: `
Last lesson (Stage 5.2) we found Delta is **not constant**: it climbs an S-shaped curve from the OTM 0 to the ITM 1. So the natural next question is — **how fast does Delta change?** That's **Gamma.**

In one sentence: **Delta is speed, Gamma is acceleration.**

- Delta tells you "the underlying moves 1, the option moves how much."
- Gamma tells you "the underlying moves 1, **Delta itself moves how much.**"

Example (K=100, 30 days, σ=20% call, computed by the engine): at-the-money, Delta ≈ 0.53 and Gamma ≈ **0.069.** That means:

- The underlying **rises from 100 to 101**, and Delta rises from about 0.53 to 0.53 + 0.069 ≈ **0.60.**
- The underlying rises further to 102, and Delta rises by about 0.069 again…

See the magic? **The more the underlying rises, the larger your Delta, so you make money faster and faster**; the more it falls, the smaller Delta, so you lose slower and slower. This "accelerate with the wind, decelerate against it" property is called **convexity**, and Gamma is precisely the measure of convexity. For the **buyer**, this is a tremendous good thing — your P&L curve bends upward.

But convexity isn't free. Remember the sign convention from Stage 5.1? **A long option is +Gamma, +Vega, −Theta.** The "acceleration" you enjoy, you pay rent for every day in **Theta (time decay).** **Gamma and Theta are two sides of one coin**: you pay out time value, and what you buy is this convexity (Stage 5.4 looks at it again from the Theta side).

For the **seller**, the signs flip — **−Gamma is one of the most dangerous things in options.** An option seller's P&L curve bends downward: when the underlying moves a little, slowly collecting rent via Theta feels great, but the moment the underlying jumps violently, negative Gamma drives their Delta sharply toward the **loss** direction, and losses accelerate. Many accounts "steadily collecting rent by selling options" get blown up overnight by one gapping move's negative Gamma.

And the most counterintuitive, most important point: **Gamma explodes near expiry.** For the same ATM call:

- 90 days to expiry: Gamma ≈ **0.040**
- 30 days: Gamma ≈ **0.069**
- 7 days: Gamma ≈ **0.144**
- 1 day: Gamma ≈ **0.381**!

The night before expiry, an ATM option's Delta flips violently on the slightest underlying flutter — this is the source of near-expiry "gamma risk," and the breeding ground for pin risk and dealer hedging flows (Stage 8.5).

**In this lesson we break Gamma into five pieces:**

- **① Gamma = Delta's rate of change = the curvature (convexity) of the price curve**
- **② Long +Gamma is good (accelerated gains), short −Gamma is dangerous (accelerated losses)**
- **③ Gamma is largest at-the-money, trending to 0 deep ITM/OTM**
- **④ Gamma explodes near expiry: 90 days vs 7 days compared**
- **⑤ A preview of Gamma scalping (Stage 8.2) and dealer Gamma (Stage 8.5)**
`,

  mechanics: `
### ① Gamma's definition: the slope of the slope

If Delta is the slope of the price curve V(S), then **Gamma is the slope of the Delta curve** — that is, the **second derivative** of the price, the degree of curvature:

$$Delta = ΔV / ΔS        (the slope of the price curve)
$$Gamma = ΔDelta / ΔS    (the slope of the Delta curve = the price's second derivative)
$$This course's units: **Gamma = the change in Delta per 1 the underlying moves.** It is **exactly the same and always positive** for calls and puts (for the buyer) — because the call and put at the same strike differ in Delta only by a constant 1 (Stage 5.2), their "rate of change" is the same curve.

Gamma lets us make a second-order price estimate (Taylor expansion): for an underlying move of ΔS,

$$ΔV ≈ Delta·ΔS + ½·Gamma·(ΔS)²
$$The first term is Delta's linear contribution; **the second term ½·Gamma·(ΔS)² is always ≥ 0 (for the long)** — this is the "extra gain" convexity brings: whether the underlying rises or falls, this term is positive, exactly the value of +Gamma. The larger ΔS, the more pronounced this term, so **Gamma truly comes into force in big moves.**

### ② Long +Gamma vs short −Gamma

Match the signs to the P&L shapes:

- **A long option (+Gamma)**: the P&L curve **bends upward (convex).** The underlying moves in your favor, Delta automatically grows, gains accelerate; it moves against you, Delta automatically shrinks, losses decelerate. This is "good asymmetry." The cost is the daily −Theta.
- **A short option (−Gamma)**: the P&L curve **bends downward (concave).** No matter which way the underlying moves big, your Delta worsens toward the **loss** direction — losses accelerate. The seller normally collects time rent via +Theta, but negative Gamma is the sword hanging overhead: **one big gap can swallow months of rent.**

> This is why "selling options is like picking up coins" — picking them up penny by penny in normal times (Theta), occasionally run over by a truck (a big move with negative Gamma). Market makers know this well, so after selling options they dynamically hedge with the underlying to flatten directional risk, but **negative Gamma means the hedge "buys high and sells low"**, losing money in itself — money they cover with the premium (Theta) they collected (Stage 8.5).

### ③ Gamma's distribution along the underlying: highest at-the-money

Plot Gamma against the underlying S and you get a **bell-shaped peak**, summiting right at-the-money (S≈K):

- **At-the-money (ATM)**: Gamma is largest. Because this is the "gear-shift zone" where Delta charges from 0 toward 1, Delta is most sensitive to the underlying, so its rate of change (Gamma) is highest.
- **Deep ITM / deep OTM**: Gamma → 0. A deep-ITM option's Delta is already near 1 and a deep-OTM's near 0; however much the underlying moves, Delta barely changes, the curve flattens and curvature vanishes.

A computed comparison (30-day call): at ATM S=100, Gamma ≈ 0.069, while at OTM S=110 only ≈ 0.014, and at S=120 nearly 0. **Gamma is highly concentrated in a small band near ATM** — which is also why traders care most about the Gamma of the few strikes "near the current price."

### ④ Gamma explodes near expiry

This is Gamma's most important — and most easily painful — property. For **ATM** options, Gamma **rises sharply** as expiry approaches:

$$ATM call Gamma (K=100, σ=20%) by days to expiry:
$$180d ≈ 0.028   90d ≈ 0.040   30d ≈ 0.069   7d ≈ 0.144   1d ≈ 0.381
$$Why? Because near expiry, that S-shaped Delta curve **narrows sharply, trending toward a step function**: on the expiration day ITM Delta = 1, OTM Delta = 0, with almost no transition in between. ATM sits right on this "cliff edge," where the slightest underlying flutter flips Delta violently between near 0 and near 1 — that's the astronomical Gamma.

The consequences are very real:

- **Near-expiry ATM options are "high-Gamma dynamite"**: buyers can use a tiny underlying move to lever Delta and chase explosive gains (also the thrill of 0DTE options); sellers face a Delta that turns on a dime, making hedging extremely hard.
- **Pin risk**: at expiry the underlying lands right near the strike, and the seller's Delta whipsaws between 0 and ±1, with no idea how much to hedge or whether they'll be assigned. This is the direct manifestation of high Gamma on expiration day.

> The control group: **deep OTM** options' Gamma instead **collapses toward 0** near expiry (a 7-day call at S=100, K=110 has Gamma ≈ 0.0004), because it's essentially hopeless and Delta has long been locked at 0. So "Gamma explodes at expiry" refers specifically to **near ATM.**

### ⑤ How to use Gamma: scalping and market makers

Gamma isn't just a risk metric — it can itself be "traded":

- **Gamma scalping (Stage 8.2)**: hold a positive-Gamma long (say, buy a straddle) and **continuously Delta-hedge.** When the underlying chops back and forth, positive Gamma lets you "sell high and buy low" each time — the underlying rises, Delta grows, you sell some underlying to lock in profit; the underlying falls, Delta shrinks, you buy some. The money earned on this round trip offsets the daily Theta you pay. **You're really betting "realized volatility > implied volatility"**: if the chop is big enough, scalping gains exceed the time rent.
- **Dealer Gamma and market reflexivity (Stage 8.5)**: the dealers' aggregate net Gamma position affects the market. When they're **net short Gamma** (having sold lots of options), their hedging moves **with** the market (buy as it rises, sell as it falls), amplifying volatility; when they're **net long Gamma**, hedging moves **against** the market (sell as it rises, buy as it falls), dampening volatility. A **gamma squeeze** (the 2021 meme stocks) is an extreme case where heavy call buying forced dealers to buy stock to hedge, self-reinforcing the rally. Vanna and Charm, which describe how the hedge drifts with time/volatility, are second-order Greeks (Stage 5.7).

Stringing the five pieces together: **Gamma is Delta's rate of change, the convexity of the price curve; long +Gamma enjoys "accelerate with the wind" (at the cost of paying Theta), short −Gamma faces the danger of "accelerated losses in a big move"; Gamma is highest at ATM and trends to zero deep ITM/OTM; it explodes as expiry approaches (ATM can reach 0.38 at 1 day), creating pin risk and hedging nightmares; and it can itself be actively traded — positive-Gamma scalping bets on realized volatility, while dealers' net Gamma conversely levers the market.** Just how expensive is that Theta you pay, and how fast does it decay — the star of the next lesson (Stage 5.4).
`,

  demo: "gamma-curve",

  analogy: `
Gamma is like **how "responsive" your steering wheel is** — turn the wheel the same little bit (the underlying moves a bit), and how much the car's nose actually swings.

- **Deep ITM or deep OTM (low Gamma)**: like cruising on an open highway, the wheel is very "numb." Turn it a bit and the nose barely shifts — Delta is rock-steady (hugging either 1 or 0), the road feel flat.
- **At-the-money (high Gamma)**: like a hairpin turn on a slick mountain road, the wheel is extremely "twitchy." A light touch and the nose snaps over — Delta changes violently. The most thrilling and the most dangerous spot.
- **Near-expiry ATM (Gamma explodes)**: the wheel is now so sensitive that "the weight of a single hair swings the nose half a turn." The slightest flutter of the underlying flips Delta wildly between 0 and 1.

For the **buyer**, this "twitchiness" is good: once the road bends in the direction you want, the nose whips around to follow and you race ahead with the wind. For the **seller**, it's a nightmare: you desperately want the car to go straight (Delta-neutral hedging), but the wheel is too twitchy — you just straighten it and it veers again — forcing you to "chase the wheel" endlessly, and every chase loses money buying high and selling low. This is why near-expiry high Gamma is, for the seller, "holding a nuclear bomb to pick up coins."
`,

  misconceptions: [
    "**\"Gamma is about the same as Delta — both measure direction.\"** — No. Delta measures **directional exposure** (first-order, the price's slope vs the underlying); Gamma measures **Delta's rate of change** (second-order, the slope of the slope, the curve's curvature). Delta is speed, Gamma is acceleration — they govern different levels.",
    "**\"Gamma is always good, because it makes me money faster.\"** — Only true for the **buyer (+Gamma).** The **seller is −Gamma**: in a big move Delta worsens toward the loss direction with acceleration, and one gap can wipe out months of time rent. Whether Gamma is good or bad depends entirely on whether you're long or short.",
    "**\"The further from expiry, the more time, so Gamma should be larger.\"** — Backwards. **ATM Gamma explodes as expiry approaches** (1 day can be nearly 10× the 90-day value), because the Delta curve steepens sharply and trends to a step near expiry. A long-dated option's Delta changes gently, so its Gamma is actually small.",
    "**\"A deep-OTM lottery ticket's Gamma gets large near expiry.\"** — It doesn't. \"Gamma explodes at expiry\" happens only near **ATM.** A deep-OTM option's Gamma instead **collapses toward 0** near expiry (it's basically hopeless, Delta long locked at 0). High Gamma is concentrated in the few strikes near the current price.",
    "**\"I've made it Delta-neutral, so I have no risk.\"** — Delta-neutral only strips out **instantaneous directional** risk; you're still exposed to **Gamma and Vega.** The moment the underlying moves big, negative Gamma quickly unbalances your \"neutral\" position into a loss (the Gamma risk of Stage 8.2). Neutrality is dynamic and fragile, not a get-out-of-jail-free card.",
  ],

  quiz: [
    {
      q: "An ATM call currently has **Delta = 0.50, Gamma = 0.07.** If the underlying rises from 100 to 102 (everything else unchanged), use Gamma to estimate the new Delta. Approximately?",
      options: ["About 0.50", "About 0.57", "About 0.64", "About 0.07"],
      answer: 2,
      explain: "Gamma is \"how much Delta changes per 1 the underlying moves.\" The underlying rose 2, so Delta increases by about 0.07 × 2 = 0.14, and the new Delta ≈ 0.50 + 0.14 = **0.64.** (In reality Gamma itself also changes; this is a local approximation.)",
    },
    {
      q: "Which statement about **selling** options (short, −Gamma) is correct?",
      options: [
        "Large underlying moves favor the seller, because negative Gamma accelerates the profit",
        "Large underlying moves hurt the seller, because negative Gamma drives Delta toward the loss direction with acceleration",
        "The seller has no Gamma exposure",
        "The seller's Gamma is smallest at-the-money",
      ],
      answer: 1,
      explain: "A short is **−Gamma**: the P&L curve bends downward, and whether the underlying rises or falls big, Delta worsens toward the loss direction and losses accelerate. The seller normally collects rent via +Theta, but one big gap's negative Gamma can swallow months of gains. This is the seller's most central risk.",
    },
    {
      q: "All else equal, which of the following options has the **largest Gamma**?",
      options: [
        "A deep-ITM call with 1 year to expiry",
        "A deep-OTM call with 1 year to expiry",
        "An ATM call with 90 days to expiry",
        "An ATM call with 2 days to expiry",
      ],
      answer: 3,
      explain: "Gamma is largest **at-the-money** and **near expiry.** A 2-day ATM call has an already extremely steep Delta curve trending to a step, where the slightest underlying move flips Delta violently — Gamma explodes. Deep ITM/OTM or long-dated options have far smaller Gamma.",
    },
    {
      q: "A trader buys an ATM straddle (buy a call and a put simultaneously), then **continuously trades the underlying to keep the portfolio Delta at 0**, profiting from the underlying's back-and-forth chop. What is this strategy called, and what is it betting on?",
      options: [
        "Covered call; betting the underlying doesn't move",
        "Gamma scalping; betting realized volatility is higher than implied volatility",
        "Delta-neutral arbitrage; betting rates fall",
        "Selling volatility; betting on an IV crash",
      ],
      answer: 1,
      explain: "This is **Gamma scalping (Stage 8.2)**: hold positive Gamma and dynamically Delta-hedge, selling high and buying low as the underlying chops to earn the spread, offsetting the daily Theta. It's essentially **betting realized volatility > implied volatility** — if the chop is big enough, scalping gains exceed the time rent.",
    },
  ],

  further: [
    { label: "Investopedia: Gamma (Delta's rate of change and convexity)", url: "https://www.investopedia.com/terms/g/gamma.asp" },
    { label: "Investopedia: Gamma Scalping", url: "https://www.investopedia.com/terms/g/gamma-hedging.asp" },
    { label: "Wikipedia: Greeks (finance) — Gamma", url: "https://en.wikipedia.org/wiki/Greeks_(finance)#Gamma" },
  ],
};
