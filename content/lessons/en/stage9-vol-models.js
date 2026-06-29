export default {
  id: "vol-models",
  stage: 9,
  order: 3,
  title: "Vol Modeling: GARCH, Local & Stochastic (Heston)",
  difficulty: 3,
  prereqs: ["vol-smile-skew"],

  oneLiner:
    "Black-Scholes assumes volatility is a **constant** — but in real markets volatility **clusters**, and the implied volatilities across strikes connect into a **smile (Stage 4.3)**. This lesson introduces three \"patches\": **GARCH** (forecasting the realized volatility that clusters), **local volatility** (Dupire, letting σ vary with price and time to fit today's surface), and **stochastic volatility Heston** (letting σ itself be random, naturally growing a smile), plus **jumps**.",

  intuition: `
Throughout Chapter 4 we repeatedly poked at one soft spot of Black-Scholes: it assumes volatility σ is a **fixed, unchanging constant**, the same across all strikes and all expiries (one of the assumptions in Stage 4.1). But the market slaps it with two iron-clad facts:

- **Volatility "clusters" (volatility clustering).** A string of calm days, then suddenly a violent stretch of turbulence — big moves often follow big moves, and calm often follows calm. Volatility is clearly **not constant**; it has "weather," with calm periods and storm periods.
- **Implied volatility curves with strike.** For the same underlying and same expiry, the implied volatilities backed out from different strikes are not equal, and drawn out they form a **smile/skew (Stage 4.3)**. If σ were truly constant, this line should be horizontal — but it never is.

These two facts show: **to price options more realistically and forecast volatility better, you must model volatility itself rather than stuff in a dead number.** This lesson introduces the quant world's three mainstream "volatility models," progressing by "σ's degrees of freedom":

- **GARCH — models and forecasts "realized volatility."** It directly captures "volatility clusters": tomorrow's variance = a bit of long-run mean + a bit of yesterday's variance + a bit of the square of yesterday's shock. So after a big drop, the volatility it forecasts automatically rises and slowly falls back. It mainly answers "**how large will future actual volatility be**" (the HV of Stage 4.2), a common tool in risk management and volatility trading.
- **Local volatility (Dupire) — lets σ vary with "price and time" to fit today's surface.** It asks: "Can we find a deterministic function σ(S,t) that makes the option prices the model computes **exactly equal** to today's market quotes across all strikes and expiries?" The Dupire formula gives this σ_local(S,t). It's the standard tool for market makers to make pricing fully consistent with the **entire volatility surface (Stage 4.4)**.
- **Stochastic volatility (Heston) — lets σ itself become a random variable.** It goes a step further: volatility is no longer a deterministic function of S and t but **fluctuates randomly on its own** (with its own mean reversion, its own "volatility of volatility," and a negative correlation with the stock price). This setup **naturally and endogenously** grows the smile and skew the market observes — exactly its most fascinating feature.
- Finally, a piece on **jumps**: stock prices aren't smoothly continuous; earnings and breaking news make them **gap instantly**, creating fat tails and steep short-term skew.

The demo on the right uses a simple GARCH-style recursion to generate a return series with **volatility clustering**, side by side with "constant volatility" — you can see at a glance how storms cluster.

**In this lesson we break volatility modeling into five pieces:**

- **① Why constant volatility isn't enough: clustering + the smile**
- **② GARCH: modeling volatility clustering, forecasting realized volatility**
- **③ Local volatility (Dupire): σ(S,t) fitting today's surface exactly**
- **④ Stochastic volatility (Heston): σ itself random, endogenously growing the smile**
- **⑤ Jumps and fat tails: patching in the "instant gap"**
`,

  mechanics: `
### ① Why constant volatility isn't enough

Black-Scholes' σ is a scalar, implying two claims that contradict reality:

- **Constant over time**: but return volatility **clusters** — plot any stock index's daily returns and the calm and violent stretches are clearly segmented. Statistically, the absolute value or square of returns has strong **autocorrelation**: big volatility today, likely big tomorrow. A constant σ can't capture this at all.
- **Constant across strikes**: but the market prices different strikes with different implied volatilities, drawing a **smile/skew (Stage 4.3)**. Low-strike puts (crash protection) are systematically more expensive, corresponding to higher implied volatility.

> One line: **BS's σ is "a number," while real volatility is "a moving curve with its own temperament."** The three model classes below are three patches arranged from least to most "freedom given to σ."

### ② GARCH: modeling volatility clustering

**GARCH (Generalized Autoregressive Conditional Heteroskedasticity)** directly models the fact that "volatility clusters." The most common GARCH(1,1) writes tomorrow's conditional variance σ²_t as the weighted sum of three pieces:

$$σ²_t = ω + α·r²_{t−1} + β·σ²_{t−1}

Read it:
- \`ω\`: a constant, corresponding to the **long-run average variance** (the anchor of mean reversion).
- \`α·r²_{t−1}\`: **the square of yesterday's shock**. A big move yesterday pushes today's forecast volatility up — this is "big volatility follows big volatility."
- \`β·σ²_{t−1}\`: **yesterday's variance itself**, providing persistence (volatility's "inertia"). The closer α+β is to 1, the slower the shock decays and the more persistent the clustering.

GARCH's output is a forecast of **future realized volatility (HV, Stage 4.2)**: after a big drop, the volatility it forecasts automatically jumps up, then slowly falls back to the long-run mean. It's the main tool for risk management (VaR), volatility timing, and providing "how much realized volatility will materialize" estimates for volatility trading (Stage 8.3). The GARCH-style recursion in the demo on the right uses exactly this σ²_t=ω+α·r²+β·σ² logic (**generated deterministically by index, non-random**) to let you see the shape of clustering.

> Note the division of labor: GARCH models the **real-world** realized volatility (for forecasting and risk control); the local/stochastic volatility below models the **risk-neutral** pricing volatility (for consistency with option market prices). The two have different purposes — don't mix them.

### ③ Local volatility (Dupire): σ(S,t) fitting the surface

Local volatility upgrades BS's constant σ to a **deterministic function** σ_local(S,t) — volatility depends on **the current stock price and current time**, but given (S,t) it's deterministic (not random).

The problem it solves is very practical: a market maker faces the **entire volatility surface (Stage 4.4)** — hundreds or thousands of quotes across different strikes and different expiries. They need a model whose computed prices **pass exactly through** all these market quotes, or internal arbitrage appears. **Dupire (1994)** proved that there exists a unique σ_local(S,t) that makes the model **perfectly match** the entire surface observed today, and gave the Dupire formula to back it out from the surface.

- **Advantage**: **perfectly calibrated** to today's market, the standard practice for guaranteeing "consistency with vanilla prices" when pricing exotic options (Stage 9.4).
- **Limitation**: it's a **pure fit** — it can replicate today's surface, but its forecasts of how the surface **evolves in the future** are often unrealistic (e.g. it predicts the forward smile flattens too fast). It knows the what, not the why.

### ④ Stochastic volatility (Heston): σ itself random

Stochastic volatility goes a step further: **volatility is no longer any deterministic function but is itself a random process.** The Heston (1993) model lets the variance v_t follow a mean-reverting random process, while the stock price's diffusion uses this random v_t:

$$dS = rS·dt + √v_t·S·dW₁
$$dv = κ(θ − v_t)·dt + ξ·√v_t·dW₂,   corr(dW₁, dW₂) = ρ

Each parameter has a clear meaning:
- \`κ\`: the variance's **reversion speed** (how fast it's pulled back to the long-run level).
- \`θ\`: the **long-run variance** level (the anchor of mean reversion).
- \`ξ\` (vol-of-vol): the **"volatility of volatility"** — how hard the variance itself shakes, mainly controlling the smile's **convexity** (how high the two ends turn up).
- \`ρ\`: the **correlation coefficient** between stock price and volatility, usually **significantly negative** in stocks (volatility spikes when it falls). It's exactly this negative ρ that creates the stock's typical **negative skew** (low on the left, high on the right).

Heston's most fascinating feature: **it doesn't need a smile curve stuffed in by hand; the smile grows endogenously from "σ random + negative correlation."** Vol-of-vol holds up the two ends, and the negative correlation tilts the curve down — highly consistent with the skew shape the market observes (Stage 4.3), and its characterization of how the smile **evolves in the future** is more reasonable than local volatility. The price is that it has no simple closed-form solution, and pricing often relies on **Monte Carlo (Stage 9.1)** or semi-analytic Fourier methods.

### ⑤ Jumps and fat tails

Continuous-diffusion models (constant, local, or stochastic volatility alike) all assume the price **moves continuously**, never jumping instantly. But in reality:

- **Earnings, breaking news, policy, flash crashes** make the price **gap (jump)** — an overnight −10% isn't a continuous slide down.
- Jumps create **fat tails**: extreme moves are far more frequent than lognormal predicts (the 1987 single-day −22% is nearly impossible in a constant-BS world, yet reality sees it every few decades).
- Jumps especially affect **short-expiry, deep-OTM** options — they explain why short-term skew is especially steep (pure diffusion models can't draw a smile that steep at short maturities).

Models like **Merton jump-diffusion** and **Bates (Heston + jumps)** layer a Poisson jump term on top of diffusion to patch this in. In practice, jumps are nearly inescapable when pricing short-term, deep-OTM options (such as the deep-OTM puts used for tail hedging, Stage 8.4).

Stringing these five together: **constant volatility can't capture clustering and the smile → GARCH models "realized volatility that clusters" for forecasting → local volatility σ(S,t) fits today's surface exactly → stochastic volatility Heston lets σ be random, endogenously growing the smile and skew → jumps patch in the instant gap and fat tails.** This "model volatility itself" chain is the key link connecting Black-Scholes (Stage 4.1) with modern exotic-option pricing (Stage 9.4), and the starting point for **forecasting volatility (Stage 10.1)** with machine learning in AI quant — what the neural network learns is precisely the volatility dynamics these models try to characterize.
`,

  demo: "vol-model",

  analogy: `
Modeling volatility is like **upgrading from "assume the weather is a constant temperature" to actually forecasting the weather**.

Black-Scholes' constant volatility is like a weather station announcing: "Local temperature is a constant 20°C all year." It sounds easy to compute, but anyone knows it's wildly wrong — weather has calm sunny days and clustered stormy seasons. The three volatility-model classes correspond to three increasingly serious "views of the weather":

- **GARCH** is like a **local forecaster inferring today from yesterday**: he notices "storms tend to come in a row" (volatility clustering), so his rule is simple — strong winds yesterday, raise today's forecast wind speed, then slowly let it fall back to the long-run mean. He's good at answering "**roughly how windy the next few days will be**" (forecasting realized volatility).
- **Local volatility (Dupire)** is like a **temperature map precise to every location and every moment**: it's calibrated to fit **exactly** all of today's weather-station readings. Ask "how many degrees here and now" and it answers to the decimal — but ask it to project the weather's evolution a week out and it's unreliable (it only fits the present, not the underlying mechanism).
- **Stochastic volatility (Heston)** is like a **true climate-dynamics model**: it doesn't directly prescribe each location's temperature but acknowledges that "the weather system itself evolves randomly," with built-in "sharp temperature drops often accompanied by strong winds" (the negative correlation of falling stock, rising volatility). So it **naturally generates** the observed weather patterns (the smile/skew) rather than having them drawn in by hand.

Finally, **jumps** are like acknowledging "there will be instant upheavals like earthquakes and tsunamis" — even the smoothest climate model must set aside an extra allowance for these "gaps," or it systematically underestimates extreme disasters (fat tails). This whole set is the process of quant gradually swapping the "constant-temperature assumption" for "real weather."
`,

  misconceptions: [
    "**\"GARCH and Heston do the same thing — pricing the smile.\"** — They don't. **GARCH** models **real-world** realized volatility, for **forecasting and risk control**; **Heston/local volatility** model **risk-neutral** pricing volatility, for **consistency with option market prices**. One governs \"how much it will actually move,\" one governs \"what the option should be worth\" — different purposes.",
    "**\"In local volatility σ(S,t), σ is random.\"** — It isn't. Local volatility is a **deterministic function**: given the stock price S and time t, σ is uniquely determined, with no randomness. What truly makes σ **itself random** is **stochastic volatility (Heston)** — that's exactly the fundamental difference between the two.",
    "**\"The Heston model requires a smile curve stuffed in by hand.\"** — Quite the opposite, the smile is **endogenous**: let the variance be random (vol-of-vol holding up the two ends) and negatively correlated with the stock (ρ<0 tilting the curve down), and the market-observed skew **grows automatically**, with no hand-drawing. This is stochastic volatility's most fascinating feature (Stage 4.3).",
    "**\"Volatility clustering means volatility will keep rising forever.\"** — It won't. Clustering only says \"big volatility often follows big, calm often follows calm,\" but GARCH has built-in **mean reversion** (ω/long-run variance is the anchor): after a spike, volatility gradually falls back to the long-run level rather than rising monotonically.",
    "**\"With a stochastic volatility model, jumps no longer need separate consideration.\"** — Not enough. Continuous stochastic volatility still assumes the price is **continuous and doesn't jump**, can't draw a sufficiently steep **short-term skew**, and underestimates extreme fat tails. The **instant gaps** caused by earnings/flash crashes require an extra jump term (Merton/Bates) to capture, especially important for short-term, deep-OTM options (Stage 8.4).",
  ],

  quiz: [
    {
      q: "The GARCH(1,1) model σ²_t = ω + α·r²_{t−1} + β·σ²_{t−1} mainly captures which feature of returns?",
      options: [
        "Volatility being equal across all strikes",
        "Volatility clustering — big moves often follow big moves, with mean reversion",
        "The stock price necessarily following a normal distribution",
        "The option price always equaling intrinsic value",
      ],
      answer: 1,
      explain: "GARCH uses \"yesterday's shock squared r²\" and \"yesterday's variance σ²\" to infer today's variance, exactly characterizing **volatility clustering** (big moves follow big moves), while ω/long-run variance provides **mean reversion**. It's mainly used to forecast future realized volatility (Stage 4.2).",
    },
    {
      q: "What is the most essential difference between \"local volatility (Dupire)\" and \"stochastic volatility (Heston)\"?",
      options: [
        "Local volatility is for calls, stochastic volatility is for puts",
        "In local volatility, σ is a deterministic function of (S,t); in stochastic volatility, σ itself is a random process",
        "Local volatility needs no market data, stochastic volatility does",
        "The two are actually fully equivalent",
      ],
      answer: 1,
      explain: "**Local volatility** σ(S,t) is a **deterministic function** — uniquely determined given the stock price and time; **stochastic volatility (Heston)** lets the variance **evolve randomly on its own** (with vol-of-vol and correlation with the stock). This is the fundamental divide between the two model classes.",
    },
    {
      q: "In the Heston model, the correlation coefficient ρ between stock price and volatility is usually significantly negative in equity markets. What market phenomenon does this mainly explain?",
      options: [
        "Volatility being always positive",
        "The stock's typical negative skew (low-strike put IV being higher)",
        "Options always being profitable",
        "The effect of interest rates on the option price",
      ],
      answer: 1,
      explain: "A negative ρ means \"volatility rises when the stock falls,\" which **tilts the implied-volatility curve into a negative skew, high on the left and low on the right** — exactly the typical skew of stock/equity-index markets (Stage 4.3). Vol-of-vol (ξ) instead mainly controls the smile's convexity.",
    },
    {
      q: "Why, beyond continuous-diffusion models (including stochastic volatility), is a \"jumps\" term often still added?",
      options: [
        "To make the model simpler",
        "Because the price gaps instantly on earnings/breaking news, creating fat tails and a steep short-term skew that continuous models can't draw",
        "Because jumps eliminate all risk",
        "Because Delta can't be computed without jumps",
      ],
      answer: 1,
      explain: "Continuous models assume the price is smooth and doesn't jump, but earnings/flash crashes make the price **gap instantly**, creating **fat tails** and an especially **steep short-term skew** — which pure diffusion (even stochastic volatility) can't replicate. Jump-diffusion (Merton/Bates) patches this in, especially crucial for short-term, deep-OTM options (Stage 8.4).",
    },
  ],

  further: [
    { label: "Wikipedia: Heston model (stochastic volatility)", url: "https://en.wikipedia.org/wiki/Heston_model" },
    { label: "Wikipedia: Local volatility (Dupire local volatility)", url: "https://en.wikipedia.org/wiki/Local_volatility" },
    { label: "Investopedia: GARCH Process", url: "https://www.investopedia.com/terms/g/garch.asp" },
  ],
};
