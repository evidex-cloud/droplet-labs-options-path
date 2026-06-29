export default {
  id: "vega",
  stage: 5,
  order: 5,
  title: "Vega: You're Really Trading Volatility",
  difficulty: 2,
  prereqs: ["greeks-overview"],

  oneLiner:
    "**Vega** measures how much the option price changes for every 1 percentage point move in implied volatility. It exposes a truth: **buying an option = buying volatility.** The buyer's Vega is always positive (hoping IV rises), and Vega is largest at-the-money and for long-dated options. Understand Vega and you finally see the pre-earnings \"IV ramp\" and the post-earnings \"IV crush\" — why you can get the direction right and still lose money because volatility collapsed.",

  intuition: `
So far, Delta, Gamma, and Theta have all been about "how the underlying moves, how time passes." But an option has one more exposure that beginners completely ignore yet is often the most lethal: **the change in implied volatility (IV) itself.** What measures it is **Vega.**

In one sentence: **Vega = how much the option rises for every 1 percentage point IV rises.**

Recall Black-Scholes (Stage 4.1): the larger σ (volatility), the more expensive **both** call **and** put — because for the buyer whose loss is capped and upside is open, more uncertainty is good. Vega is the sensitivity of this effect. Compute it with the engine (K=100, 90 days, σ=20% ATM call): Vega ≈ **0.196/1%.** That means:

- IV rises from 20% **to 21%** (up 1 percentage point), and this option (per share) rises about **0.196.**
- IV rises from 20% **to 25%** (up 5 percentage points), and it rises about 0.196 × 5 ≈ **0.98** — the underlying **doesn't move at all**, and just from volatility rising you make almost 1.

This is the key insight: **when you buy an option, you're not just betting on direction — you're simultaneously long volatility.** Even if the underlying stands still, as long as the market's expectation of "becoming more turbulent in the future" heats up (IV rises), your option appreciates; conversely, if IV collapses, you can lose even when your direction was right.

The most classic scenario is **earnings:**

- **Before** earnings, the market knows a big news drop is imminent, the expectation of future volatility soars, and IV is pushed very high — options become expensive (you pay a premium for high Vega).
- **After** earnings, the uncertainty is released all at once, IV **collapses instantly**, and this is called **IV crush (a volatility collapse).** Many people buy a straddle before earnings betting "it'll move big," and the stock indeed moves, but **not big enough**, so the Vega loss from the IV crush overwhelms the Delta gain — **the direction was right, and they still lose.**

Vega also has two "largests" to remember (both from computation):

- **Vega is largest at-the-money**: at S=100 Vega is 0.196, while OTM at S=120 only 0.033 remains.
- **The longer-dated, the larger Vega**: 30 days 0.114, 90 days 0.196, 180 days 0.274, 365 days 0.381 — long-dated options are far more sensitive to volatility.

**In this lesson we break Vega into five pieces:**

- **① What Vega is: the option's change per 1% IV move (memorize the units)**
- **② "Buying an option = buying volatility": the essence Vega reveals (leading to Stage 4.2/4.3)**
- **③ Vega is largest at-the-money and for long-dated options; collapses toward 0 near expiry**
- **④ Earnings and IV crush: why the direction is right and you still lose**
- **⑤ Vega risk and volatility trading: the tools for going long/short volatility**
`,

  mechanics: `
### ① Vega's definition and units

Vega is the option price's sensitivity to **implied volatility** — the price curve's slope vs σ:

$$Vega = ΔV / Δσ   (as IV moves, how the price changes; always positive for the buyer)
$$**The units must be memorized**: this course's engine (\`_bs.js\`) uses the price change per **+1 percentage point** move (i.e., σ moves +0.01, e.g., 20%→21%). So Vega = 0.196 reads directly as "**per 1 point IV rises, up 0.196 per share.**" ⚠️ Never misread it as "per +100%" — that's off by 100×. Some textbooks define Vega as "per 1.00 (i.e., 100 percentage points)," with much larger numbers; trading desks generally use "per 1%," consistent with this course.

The usual ×100: per-share Vega 0.196 → one contract's Vega ≈ **19.6 per 1%** (IV up 1 point, one contract makes about 19.6).

> Note "vega" strictly speaking **isn't a Greek letter** (there's no such letter in the Greek alphabet), but by trading convention it's treated as the fifth Greek. The name doesn't matter; the "volatility sensitivity" it measures is one of an option's most central exposures.

### ② "Buying an option = buying volatility"

This is the most important worldview shift Vega gives you. Back to Black-Scholes: of the five inputs, **only σ (volatility) is not directly observable and must be backed out of the market quote** (this is implied volatility, Stage 4.2). The rest — S, K, T, r — are all plain to see. So when you trade options, the quantity the market is truly contesting and "quoting" **is implied volatility.** Option traders don't even say "this option is worth a few dollars," they say "its IV is so many points" (Stage 4.2).

Therefore:

- **Buying an option (+Vega) = going long volatility**: you bet IV rises, or that realized volatility will materialize higher than the current IV.
- **Selling an option (−Vega) = going short volatility**: you bet IV falls or stays low. Seller strategies (iron condors, short straddles) are essentially **selling volatility**, earning the variance risk premium (Stage 8.3).

And since the IVs of different strikes and different expiries aren't equal (**the volatility smile/skew**, Stage 4.3; **term structure and surface**, Stage 4.4), your Vega exposure is actually distributed across the whole curve, the whole surface — what a professional volatility trader manages isn't one Vega number, but **the Vega sensitivity to different points on the surface.**

### ③ Vega's distribution across moneyness and expiry

Two rules, memorize them cold:

- **At-the-money (ATM) Vega is largest**: plot Vega against the underlying S and you get a bell-shaped peak topping at ATM. Computed (90-day call): 0.018 at S=80, 0.118 at S=90, **0.196 at S=100 (highest)**, 0.118 at S=110, 0.033 at S=120. Intuition: an ATM option is "least sure whether it'll be in-the-money," so it's most sensitive to changes in "the size of uncertainty"; deep ITM/OTM fates are largely sealed, and they barely care how IV moves.
- **Long-dated Vega large, short-dated Vega small**: Vega is roughly ∝ **√T.** Computed (ATM): 30 days 0.114, 90 days 0.196, 180 days 0.274, 365 days 0.381. Intuition: the further the expiry, the longer volatility has to "play out," and the more room σ's changes have to be amplified. Near expiry, Vega **collapses toward 0** — an option expiring tomorrow barely cares how the long-run volatility expectation changes.

> Contrast with Gamma (Stage 5.3): Gamma **explodes** near expiry, Vega **vanishes** near expiry. This pair of "opposite brothers" sets the risk profiles of options of different expiries — **short-dated options are a Gamma game (betting on immediate volatility), long-dated options are a Vega game (betting on the volatility level).** This also echoes the term structure of Stage 4.4: trading different expiries is trading different positions on the surface.

### ④ Earnings and IV crush

Nail down Vega's practical meaning in the most classic scenario — **the IV collapse around earnings:**

- **Before earnings**: a known big event looms, the market's expectation of volatility over the next few days soars, and IV is pushed up (sometimes ATM IV ramps from 30% to 80%+). Options become **very expensive**, because your high-Vega position is stuffed with a premium for "the big move about to come."
- **After earnings**: the news drops, the uncertainty **vanishes all at once**, and IV plunges back to normal — this is **IV crush.**

The lethal part: suppose you bought an ATM straddle before earnings (large Vega), betting "it'll move big." Earnings drop, and the stock indeed jumps 5% — your Delta makes a bit. But IV collapses from 80% back to 30% (down 50 points), and both your high-Vega legs take a huge loss. **The net result is often a loss**: the stock moved, but **not enough** to overcome the Vega loss from the IV crush. This is the truth behind countless beginners' "got the earnings direction right, and the option still lost" — what they bought wasn't direction, it was **overpriced volatility.**

A computed magnitude (ATM 30-day call): worth 2.45 at IV=20%, 4.73 at IV=40%, 7.01 at IV=60%. **IV crashing from 60% to 20% takes the price from 7.01 to 2.45, evaporating nearly 4.6 per share** — and during this the underlying can stand perfectly still.

> The lesson: at high IV (before earnings, in a panic), **buying** options demands extra caution about Vega risk; conversely, high IV is exactly the seller's (short straddle, sell spread) opportunity — sell the inflated volatility and profit after the IV crush. But the seller must shoulder the −Gamma directional risk (Stage 5.3).

### ⑤ Vega risk and volatility trading

Vega isn't just a passive risk — it defines a whole class of trades, **volatility trading (vol trading)**, i.e., buying and selling volatility itself as an asset (Stage 8.3):

- **Going long volatility (+Vega)**: buy straddles/strangles, buy calendar spreads (net +Vega), or directly buy VIX-related products. Bet IV rises or realized volatility expands. Often used before events, or when IV is at a historic low.
- **Going short volatility (−Vega)**: sell straddles, iron condors, sell spreads. Bet IV falls or stays low, collecting the variance risk premium (Stage 8.3) — a strategy with positive long-run expectation, but carrying the "picking up coins, run over by a truck" tail risk.
- **Vega-neutral + trading skew/term**: advanced players hedge out net Vega and specifically trade **changes in the shape** of the IV surface (the smile steepening/flattening, the term structure inverting), e.g., risk reversals, calendar spreads. This requires second-order Greeks like **Volga** (Vega's sensitivity to IV) and **Vanna** (Delta's sensitivity to IV) (Stage 5.7).

Stringing the five pieces together: **Vega is the price change per 1% IV move (units: per 1 percentage point, don't read it as per 100%); it reveals "buying an option = buying volatility," because IV is the quantity options are truly quoted on (Stage 4.2/4.3); Vega is largest at-the-money and for long-dated options, collapsing toward 0 near expiry (the exact opposite of Gamma); the pre-earnings IV ramp and post-earnings IV crush explain "the direction was right and you still lost"; and Vega turns volatility into a tradeable asset, with tools and risks for going long and short.** One last first-order Greek remains — the usually most-ignored Rho, which surfaces on long-dated options and dividend stocks, and dividends (Stage 5.6).
`,

  demo: "vega-curve",

  analogy: `
Vega is like **how sensitive your asset is to "the uncertainty in the weather forecast"** — note, sensitive to **the forecast's range of variability**, not to whether it's sunny or rainy (that's Delta).

Imagine you hold a lottery ticket on "**it'll pour this week**" (an option). The ticket's value depends on the weather bureau's official broadcast of "how hard the week's weather is to predict" (implied volatility, IV):

- **The bureau raises its uncertainty warning** (IV rises): even before the weather changes, the moment officials say "extreme-weather probability surges this week," your "betting on a downpour" ticket appreciates instantly — this is **+Vega.**
- **The bureau lowers the warning** (IV falls): officials say "calm waters this week," and your ticket depreciates — even if it does later rain a bit.

**Earnings is the moment of "the bureau about to issue a major forecast"**: before release, everyone knows big news is imminent, the uncertainty warning is maxed out (IV soars), and the ticket is bid up expensive; after release, the forecast is settled, the uncertainty vanishes, the warning is withdrawn instantly (**IV crush**), and the ticket can plunge even if it "bet the weather right" — because you bought it when the warning was highest and the ticket most expensive.

And "an ATM ticket's Vega is largest" is easy to see too: betting on "exactly borderline" weather (ATM), you're most sensitive to "just how hard it is to predict"; a ticket betting on "definitely sunny" or "definitely a massive downpour" (deep OTM/ITM) has an all-but-settled outcome, and barely cares how the forecast's uncertainty changes.
`,

  misconceptions: [
    "**\"Vega measures how much the underlying moved.\"** — No. Vega measures the sensitivity to changes in **implied volatility (IV)**, which is the market's expectation of **future** volatility, backed out of option prices (Stage 4.2). How much the underlying actually moves affects the Gamma line (through realization), not what Vega directly measures.",
    "**\"As long as the underlying moves in the direction I bet, the option I bought is sure to make money.\"** — Not necessarily. If an **IV crush** also occurs (as after earnings), the high-Vega loss can overwhelm the Delta gain — **the direction is right and you still lose.** This is the most common, most painful pit for beginners during earnings season.",
    "**\"Vega = 0.20 means IV doubling makes the option rise 0.20.\"** — Wrong units. This course's Vega is \"per **+1 percentage point**\" (20%→21%). IV rising 1 point makes it rise about 0.20; rising 5 points about 1.0. Mistaking it for \"per 100%\" is off by 100×.",
    "**\"Long-dated and short-dated options are equally sensitive to volatility.\"** — No. Vega is roughly ∝ √T, so **long-dated Vega is far larger** (365 days about 3× the 30-day value); near expiry Vega collapses toward 0. So **short-dated options are a Gamma game, long-dated options a Vega game** — the exact opposite of Gamma exploding near expiry.",
    "**\"High IV is definitely a buying opportunity, because the option 'has action.'\"** — Dangerous. High IV means the Vega position you're buying is **expensive**, and likely facing the headwind of IV falling back (crush). High IV is often the **seller's** opportunity (selling overpriced volatility), not a mindless buy. Rich-or-cheap depends on IV's percentile relative to its history (Stage 4.2).",
  ],

  quiz: [
    {
      q: "An option has **Vega = 0.15 (this course's units: per +1% IV).** If implied volatility falls from 30% to 24% with everything else unchanged, roughly how does this option (per share) change?",
      options: ["Falls about 0.15", "Falls about 0.90", "Rises about 0.90", "Falls about 9"],
      answer: 1,
      explain: "IV fell 6 percentage points (30→24). Vega is positive, so as IV falls the option price falls, by about 0.15 × 6 = **a fall of 0.90 per share** (one contract ×100 ≈ 90). Note the units are per 1%; multiply the IV change in \"percentage points\" by Vega.",
    },
    {
      q: "All else equal, which option has the **largest Vega** (most sensitive to volatility)?",
      options: [
        "A deep-OTM call with 7 days to expiry",
        "An ATM call with 1 year to expiry",
        "A deep-ITM call with 7 days to expiry",
        "An ATM call with 2 days to expiry",
      ],
      answer: 1,
      explain: "Vega is largest **at-the-money** and **long-dated** (Vega ∝ √T, highest at ATM). A 1-year ATM call is most sensitive to volatility. Near-expiry (2-day) or deep ITM/OTM Vega is all small — the exact opposite of Gamma exploding near expiry.",
    },
    {
      q: "You buy an ATM straddle (call + put, large Vega) **before** earnings, betting it'll \"move big\" afterward. After earnings the stock jumps 4%, but IV collapses from 75% back to 35%. You will most likely:",
      options: [
        "Profit for sure, because the stock did move",
        "Possibly lose, because the Vega loss from the IV crush overwhelms the Delta gain (direction right, still a loss)",
        "Be unaffected, because a straddle isn't sensitive to IV",
        "Vega becomes a positive contribution after earnings, so you profit extra",
      ],
      answer: 1,
      explain: "This is a classic **IV crush**: IV crashed 40 points, both your high-Vega legs take a huge loss, and the Delta gain from the stock's 4% move often isn't enough to cover it. **The direction was right and you still lose** — what you bought before earnings was really overpriced volatility. Buying options at high IV demands extra care about Vega risk.",
    },
    {
      q: "Which comparison of **how Gamma and Vega change with expiry** is correct?",
      options: [
        "Both increase as expiry approaches",
        "Both decrease as expiry approaches",
        "Gamma explodes upward as expiry approaches, Vega collapses toward 0 as expiry approaches",
        "Gamma collapses toward 0 as expiry approaches, Vega explodes upward as expiry approaches",
      ],
      answer: 2,
      explain: "This pair of \"opposite brothers\": ATM **Gamma explodes near expiry** (betting on immediate volatility), while **Vega collapses toward 0 near expiry** (only long-dated options are sensitive to the volatility level). So short-dated options are a **Gamma game**, long-dated options a **Vega game.**",
    },
  ],

  further: [
    { label: "Investopedia: Vega (volatility sensitivity explained)", url: "https://www.investopedia.com/terms/v/vega.asp" },
    { label: "Investopedia: Volatility Crush (IV crush)", url: "https://www.investopedia.com/terms/v/volatility-crush.asp" },
    { label: "Wikipedia: Greeks (finance) — Vega", url: "https://en.wikipedia.org/wiki/Greeks_(finance)#Vega" },
  ],
};
