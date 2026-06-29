export default {
  id: "term-structure-surface",
  stage: 4,
  order: 4,
  title: "Term Structure & the Vol Surface",
  difficulty: 3,
  prereqs: ["vol-smile-skew"],

  oneLiner:
    "Spread implied volatility out along the **expiry direction** and you get the **term structure**: in calm times near months are low and far months high (contango), in panic near months spike and the curve inverts (backwardation). Stitch \"the skew across strikes\" together with \"the term structure across expiries\" and you get a two-dimensional **volatility surface** σ(K, T) — what market makers use to price the entire option chain consistently.",

  intuition: `
Last lesson (Stage 4.3) we fixed **one expiry date** and looked at IV along the **strike** direction, getting a smile/skew curve. Now flip the direction: fix **one strike** (usually at-the-money, ATM) and look at IV along the **expiry** direction — near month, next month, quarterly, six months, one year… connect them and the curve you get is the **volatility term structure**.

The term structure answers a very natural question: **does the market think volatility over "the next month" or "the next year" will be more violent?** The answer shifts with market conditions, in two typical shapes:

- **Calm market — contango**: near-month IV low, far-month IV high, the curve **sloping up**. The logic: right now it's tranquil, but the further out you look the more uncertainty there is (more earnings to cross, more macro events), so the far-month volatility expectation is higher. This is the **norm.**
- **Panic market — backwardation**: near-month IV spikes above the far months, the curve **sloping down, even plunging.** The logic: there's a big event detonating right now (a crash, earnings, a black swan), and the market's fear of **immediate** volatility far exceeds its worry about "a year from now" — and everyone believes the storm is temporary and the long run will revert to the mean (Stage 4.2). **VIX futures invert most violently in a crash** (Stage 4.5).

A numerical intuition (ATM IV):

- **In calm**: 30 days 18% → 60 days 19% → 90 days 20% → 180 days 21% → 1 year 22%. Gently upward-sloping, contango.
- **In panic**: 30 days 45% → 60 days 38% → 90 days 33% → 180 days 28% → 1 year 25%. Near month spikes, sloping down sharply, backwardation.

Now spread out **both** directions at once: looking across is the **skew over strikes** (Stage 4.3), looking down is the **term structure over expiries**. Stitch the two dimensions and IV is no longer a line but a two-dimensional **surface** σ(K, T) — this is the **vol surface**, the single most central chart on a market maker's and quant's desk. Each point on the surface is the implied volatility of the option at "some strike × some expiry"; market makers rely on it to price hundreds or thousands of contracts across the **entire option chain consistently and arbitrage-free.**

Why must it be "consistent"? Because these options aren't isolated — put-call parity (Stage 3.2), calendar spreads, and the relationships between different expiries all impose **no-arbitrage constraints.** If the surface's pricing at one spot is out of step with another, an arbitrage gap appears. The surface stitches all these options' IVs into a smooth, arbitrage-free "topographic map," ensuring the price you quote at any point stays consistent with its neighbors.

**In this lesson we break term structure and the surface into five pieces:**

- **① What term structure is: fix the strike, look at IV along expiry**
- **② Contango (normal) vs Backwardation (panic): two slopes of the curve**
- **③ From two curves to one surface: how σ(K, T) is stitched together**
- **④ How market makers use the surface: consistent pricing, no-arbitrage, calendar spreads**
- **⑤ How the surface moves, and how stochastic volatility models replicate it (Stage 9.3)**
`,

  mechanics: `
### ① Term structure: fix the strike, look at IV along expiry

Pin the strike at-the-money (ATM), let expiry T vary, and plot ATM IV against T — that's the term structure. It measures the market's expectation of volatility over **different time horizons.**

A key conversion, callback Stage 4.2: to turn annualized IV into "how much it's expected to move over this period," multiply by **√(days/365)**. So the same 20% annualized IV corresponds to an expected move of 20%×√(30/365) ≈ 5.7% over 30 days, and ≈ 9.9% over 90 days. The term structure tells you how the **annualized** IV varies with horizon, and the actual move magnitude is then further scaled by √time.

> Be careful to distinguish two things: the **term structure** describes "how IV (annualized) varies with expiry"; **√time scaling** describes "given an annualized IV, how the actual move scales with holding period." The former is the shape of market expectations, the latter is a mathematical conversion.

### ② Contango vs Backwardation: two slopes

The slope of the term structure is a thermometer of market conditions:

- **Contango (upward-sloping) = the norm.** Near-month IV < far-month IV. Right now is calm, but the far term must traverse more unknowns (earnings season, FOMC meetings, elections), uncertainty accumulating with time, so far-month volatility expectations are higher. Here, those **shorting volatility** prefer to sell far months (capturing the higher IV), or run **calendar spreads** (sell near, buy far) to ride the faster time decay of the near month.
- **Backwardation (inverted, downward-sloping) = stress.** Near-month IV > far-month IV. There's a bomb going off right now (a crash, a sudden risk), and the market's fear of **immediate** volatility overwhelms everything; at the same time it believes volatility will **revert to the mean**, so the far months stay relatively calm. The steeper the curve, the deeper the panic.

Why is inversion always bound to panic? Because volatility is **mean-reverting and clusters** (Stage 4.2, Stage 9.3): a shock launches near-month IV sky-high, but the market expects it to fall back eventually, so far-month IV lifts far less — high near, low far, and the curve inverts. **This is exactly the core trading logic of VIX futures** (Stage 4.5): normally contango (holding long VIX costs a "roll"), instantly backwardation in a crash.

### ③ From two curves to one surface σ(K, T)

Combine the dimensions:

- **One direction**: fix T, vary K → the skew curve σ(K) (Stage 4.3).
- **The other direction**: fix K (usually ATM), vary T → the term structure σ(T).
- **Both directions together**: σ becomes a two-dimensional function of (K, T) → the **volatility surface.**

Visually, the surface is a 3D topographic map: x-axis the strike (or more commonly moneyness / delta), y-axis the expiry, z-axis (height/color) the IV. A horizontal cut (fixed T) gives the skew, a vertical cut (fixed K) gives the term structure. In practice the surface isn't drawn from thin air, but **anchored to the IVs of options actually traded in the market, then smoothly interpolated between them with a spline or parametric model**, subject to no-arbitrage constraints (no negative local variance, no calendar-arbitrage violations).

> The industry often uses **delta** (e.g., 25Δ put, ATM, 25Δ call) rather than absolute strike for the surface's horizontal axis — this lets surfaces for different underlyings at different price levels be aligned and compared, and it's closer to the quoting conventions for "risk reversals / butterflies" (Stage 4.3).

### ④ How market makers use the surface

The surface is the market maker's (Stage 8.5) "pricing base map," with three core uses:

- **Pricing the whole chain consistently**: a market maker doesn't quote each contract off the cuff individually; instead they first **calibrate a smooth surface**, then read off the IV for each (K, T) from the surface and feed it back into Black-Scholes to get the price. This way the quotes for hundreds or thousands of contracts are naturally consistent and non-contradictory.
- **Plugging no-arbitrage gaps**: the surface must satisfy constraints across strikes (butterflies can't be negative → the implied probability density is non-negative) and across expiries (calendars can't be negative → far-month total variance ≥ near-month). Once a calibrated surface deviates from market price somewhere, it's either an arbitrage opportunity or a data error — the surface is the tool for spotting both.
- **Managing risk and hedging**: a portfolio's Vega (Stage 5.5) is not a single number but **a map of exposure distributed across the surface** — you might be long Vega in the near-month ATM and short Vega in far-month puts. Market makers watch how "the surface as a whole **shifts, steepens, or twists**," and hedge higher-order risks like Vanna/Volga accordingly (Stage 5.7).

The **calendar spread** (Stage 7.4) is the strategy that directly trades the surface's vertical shape: sell near, buy far at the same strike, essentially betting on the slope of the term structure (betting contango holds, or that near-month IV falls back relative to the far month).

### ⑤ How the surface moves, and how stochastic volatility replicates it

The surface is not static terrain — it **breathes as a whole**, with three typical deformations:

- **Level**: the whole surface shifts up or down — the market's overall IV rising or falling (corresponding to Vega exposure).
- **Slope / term twist**: the near month rises or falls relative to the far month — switching between contango and backwardation (the near-month end lifting sharply when panic strikes).
- **Skew/curvature**: the skew direction steepens or flattens (corresponding to Vanna and the like, Stage 5.7).

Here lies a deep theoretical gap: **Black-Scholes has only one constant σ and can't generate a surface at all** — its "surface" is a flat board. What naturally produces a whole curved, moving surface is the **stochastic volatility model**: modeling volatility itself as a random process. The most famous is the **Heston model** (Stage 9.3), which lets volatility follow a mean-reverting random process negatively correlated with the stock price — this negative correlation generates exactly the equity **reverse skew**, while the mean reversion generates the **term structure.** So the surface isn't just "observed data" — it's also a **yardstick for testing how good a pricing model is**: a model that can't replicate the shape of the market surface can't be used to price exotic options (Stage 9.4). GARCH (Stage 9.3), local volatility, even learning the surface with neural networks (Stage 10.1) are all steps along this road.

Stringing the five pieces together: **term structure is the slice of IV along expiry, contango being the norm and backwardation panic; stitch it with the skew across strikes and you get the two-dimensional surface σ(K, T); market makers use the surface to price the whole chain consistently and arbitrage-free and to manage Vega/Vanna exposure; the surface shifts, twists, and steepens, and what can replicate this whole living map is a stochastic volatility model (Stage 9.3), not the single-constant-σ Black-Scholes.** Next lesson we look at the most famous "volatility reading" — the VIX fear index, which compresses the entire SPX curve into a single number (Stage 4.5).
`,

  demo: "vol-surface",

  analogy: `
The volatility surface is like a **"time × location" panoramic weather forecast.**

Returning to last lesson's "weather forecast = implied volatility" analogy, this time turn it into a complete forecasting system:

- **Along the "location" direction (strikes)**: within the same time window, the chance of a downpour differs by district — the low-lying river valley (low-strike puts) gets the fiercest forecast, the hilltop (high-strike calls) the mildest. This is the horizontal-cut **skew** (Stage 4.3).
- **Along the "time" direction (expiries)**: at the same location, the weather expectation differs across future horizons. **Normally**, tomorrow is probably clear (low near-month IV), but "a year from now" no one can say, so you have to factor in the whole typhoon season (high far-month IV) — this is **contango.** But the moment **a typhoon warning is already up**, the next three days are howling wind and rain (near-month IV spikes) while a year out has long since cleared (the far month calm) — the curve **inverts**, this is **backwardation.**

Spread these two directions, "location × time," into a whole 3D topographic map and you have the **volatility surface**: every (location, time) cell is labeled with the "expected downpour intensity" for that moment and that place. The weather bureau (market maker) relies on this panorama to price **every** umbrella-insurance policy (every option) consistently and without contradiction — never letting an arbitrage gap slip through like "same cloud, district A forecasts a downpour while adjacent district B forecasts sun." And a crude instrument that can only report "the same weather everywhere, all year" (the single-constant-σ Black-Scholes) simply can't draw this living map that heaves with the typhoon.
`,

  misconceptions: [
    "**\"Implied volatility varies only with strike, not with expiry.\"** — Wrong. Fix the strike and look along expiry, and IV varies too — that's the **term structure.** It and the skew across strikes are two independent dimensions; together they form the complete volatility surface σ(K, T).",
    "**\"The term structure always has higher far-month IV (contango).\"** — That's only the **norm.** When the market panics, near-month IV spikes above the far months and the curve **inverts (backwardation)** — the near-term storm expectation overwhelming the long term. VIX futures invert most clearly in a crash (Stage 4.5).",
    "**\"The volatility surface is just historical volatility plotted in 3D.\"** — No. The surface plots **implied volatility** (backed out of option market prices, looking to the future), spread across the two dimensions of strike and expiry. Historical volatility is a single rearview-mirror reading and doesn't form a surface.",
    "**\"Black-Scholes can compute the whole volatility surface by itself.\"** — Precisely not. BS has only **one constant σ**, so its 'surface' is a flat board. What naturally generates a curved, moving surface is a **stochastic volatility model** (like Heston, Stage 9.3). The market surface is exactly the yardstick used to test such models.",
    "**\"Once the surface is calibrated, you're done forever — no need to update.\"** — The surface **breathes as a whole**: it shifts (overall IV rising/falling), twists (contango↔backwardation), and steepens (skew changes). What market makers watch every day is how the surface moves, and they hedge Vega/Vanna accordingly (Stage 5.7).",
  ],

  quiz: [
    {
      q: "What does the **volatility term structure** describe?",
      options: [
        "How implied volatility varies with strike (fixed expiry)",
        "How implied volatility varies with expiry date (fixed strike)",
        "How historical volatility varies with time",
        "How the underlying price varies with time",
      ],
      answer: 1,
      explain: "Term structure = fix the strike (usually ATM) and look at IV along the **expiry** direction. Looking along the strike direction is the skew (Stage 4.3). The two are orthogonal slices of the volatility surface.",
    },
    {
      q: "A crash erupts suddenly and panic spikes. At this moment, what does the **term structure** of ATM implied volatility most likely look like?",
      options: [
        "Contango: near-month IV low, far-month IV high, the curve sloping up",
        "Backwardation: near-month IV spikes above the far months, the curve inverted",
        "Perfectly flat: IV equal across all expiries",
        "Both near- and far-month IV dropping to zero",
      ],
      answer: 1,
      explain: "In panic the market's fear of **immediate** volatility overwhelms its worry about the far term, and it expects volatility to revert to the mean, so near-month IV spikes above the far months — the curve **inverts (backwardation).** In calm it's the reverse, showing contango (upward-sloping).",
    },
    {
      q: "How is the **volatility surface** σ(K, T) constructed?",
      options: [
        "By connecting IVs across strikes into a single line only",
        "By merging the two dimensions of \"skew across strikes\" and \"term structure across expiries\" into a two-dimensional IV surface",
        "By plotting the underlying's historical prices in 3D",
        "It's a single constant output directly by the Black-Scholes formula",
      ],
      answer: 1,
      explain: "The surface = the strike dimension (skew) × the expiry dimension (term structure). A horizontal cut gives the skew, a vertical cut gives the term structure. Market makers use it to price the whole chain **consistently and arbitrage-free.**",
    },
    {
      q: "Why can't Black-Scholes generate the market-observed volatility surface by itself, requiring a stochastic volatility model (like Heston, Stage 9.3)?",
      options: [
        "Because BS computes too slowly",
        "Because BS has only one constant volatility and can't generate a surface that curves across strikes and expiries",
        "Because BS doesn't need a strike input",
        "Because BS can only price American options",
      ],
      answer: 1,
      explain: "BS's σ is a single constant, so its \"surface\" is a flat board that can't reproduce skew and term structure. **Stochastic volatility** models σ itself as a random process (negatively correlated with the stock), naturally generating the reverse skew and term structure — the surface thus becomes the yardstick for testing models.",
    },
  ],

  further: [
    { label: "Investopedia: Volatility Surface", url: "https://www.investopedia.com/articles/stock-analysis/081916/volatility-surface-explained.asp" },
    { label: "Investopedia: Term Structure of Volatility", url: "https://www.investopedia.com/terms/v/volatility.asp" },
    { label: "Wikipedia: Volatility smile (incl. surface and term structure)", url: "https://en.wikipedia.org/wiki/Volatility_smile" },
  ],
};
