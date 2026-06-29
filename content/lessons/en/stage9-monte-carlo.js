export default {
  id: "monte-carlo",
  stage: 9,
  order: 1,
  title: "Monte Carlo Pricing: Valuing by Simulation",
  difficulty: 3,
  prereqs: ["risk-neutral", "black-scholes"],

  oneLiner:
    "**Monte Carlo** uses a computer to generate thousands of risk-neutral random price paths, computes each path's expiry payoff, discounts, and averages — that average is the option price. It prices not by formula but by the **law of large numbers**; the error shrinks as 1/√N, and its greatest power is pricing **path-dependent exotic options (Stage 9.4)** that have no closed-form solution.",

  intuition: `
We already have two pricing rulers: the **binomial tree** (Stage 3.4) chops time into cells and rolls back cell by cell, and **Black-Scholes** (Stage 4.1) gives a closed-form formula directly. Both are elegant, but both have limits — the binomial tree's node count explodes with dimension, and the BS formula only holds for European plain-vanilla calls and puts. **Once you hit an option whose expiry payoff depends on the entire price path (say the average price, or whether a level was touched), these two rulers fall short.** Enter the most down-to-earth and most universal trick in quantitative pricing: **Monte Carlo simulation**.

Its idea is so plain it's almost "brute force": **if you can't compute the expectation, then "sample" it out.** Risk-neutral valuation (Stage 3.5) tells us that any option's fair price today = **the expectation of the expiry payoff in the risk-neutral world, discounted at the risk-free rate**:

$$C = e^{−rT}·E*[ payoff(path) ]

That expectation E*[·] is usually a high-dimensional integral, hard to compute. Monte Carlo says: **forget the integral, just simulate.** I randomly generate one expiry stock price S_T following the risk-neutral law and compute its payoff; then generate a second, a third… generate N of them, and **average and discount** the N payoffs to get an estimate of the true price. The larger N, the more accurate the estimate — this is the **law of large numbers**: the sample mean converges to the true expectation.

How do you generate one "risk-neutral" path? The stock follows **geometric Brownian motion (GBM)**, and in the risk-neutral world its drift is exactly the risk-free rate r. The analytic solution stepping directly to expiry is:

$$S_T = S_0·exp[ (r − σ²/2)·T + σ·√T·Z ],  Z ~ N(0,1)

Each standard normal random number Z gives one expiry price S_T. Note that **−σ²/2** is not a typo — it's the **convexity correction** of the lognormal distribution (the extra half σ²T in d1 in Stage 4.1 is its close cousin); without it, the simulated average growth rate would be systematically too high.

Land it immediately with the classic set of numbers (S₀=K=100, T=1 year, r=5%, σ=20% **call**): the BS closed-form price is **10.45**. Monte Carlo simulating 100 paths might give 11.6 (still a large error); 1,000 paths about 10.9; 5,000 paths about 10.5 — **converging steadily toward 10.45**, and each sampling comes with an "error bar" telling you how far off you still are. The demo on the right lets you drag N yourself and watch the paths draw, the price converge, and the error band narrow.

**In this lesson we break Monte Carlo into five pieces:**

- **① The core idea: replacing integration with sampling (discounted risk-neutral expectation)**
- **② How to generate one path: the exact GBM solution S_T = S₀·exp(...)**
- **③ The estimator and convergence: average the payoffs, discount, the law of large numbers**
- **④ Standard error ~ 1/√N: the price of precision, and its "slowness"**
- **⑤ Why you need it: path dependence and exotic options + variance reduction**
`,

  mechanics: `
### ① The core idea: replacing integration with sampling

Risk-neutral valuation gives a clean formula (Stage 3.5):

$$price today = e^{−rT}·E*[ expiry payoff ]

The difficulty is all in that expectation E*[·]. For a plain European call, this integral can be done by hand — the result is Black-Scholes. But the moment the payoff function gets a little more complex (depending on the path's maximum, average, or whether a level was touched), the integral's dimension goes up and the closed-form solution vanishes.

Monte Carlo's answer is: **the expectation is "the average of infinitely many trials," so I'll do a finite number of trials and average them to approximate it.** Three concrete steps:
1. **Simulate**: following the risk-neutral law, randomly generate the i-th price path and obtain its expiry payoff payoff_i.
2. **Average**: take the arithmetic mean of the N payoffs to estimate the expected payoff \`(1/N)·Σ payoff_i\`.
3. **Discount**: multiply by e^(−rT) to get the estimated option price today.

> One line to memorize: **the binomial tree "enumerates" all nodes, BS "integrates" out the expectation, and Monte Carlo "samples" out the expectation.** All three compute the same discounted risk-neutral expectation, just by different means. The sampling route is the slowest, but the least picky about the shape of the payoff function — that's its killer feature.

### ② How to generate one path: the exact GBM solution

In the risk-neutral world the stock follows **geometric Brownian motion**, and its log-increment is normally distributed. Jumping directly from today to expiry (if the payoff only looks at S_T, e.g. European options), there's an **exact solution**, one-shot with no discretization error:

$$S_T = S_0·exp[ (r − σ²/2)·T + σ·√T·Z ],  Z ~ N(0,1)

Break the exponent into two parts:
- \`(r − σ²/2)·T\` is the **drift**. The risk-neutral growth rate is r, but because we're simulating a lognormal variable, you subtract **σ²/2** as the convexity correction so that E*[S_T] exactly equals S₀·e^(rT) (the forward price). Omitting it is the most common beginner bug.
- \`σ·√T·Z\` is the **diffusion**. Z is a standard normal random number (generated from uniform random numbers via methods like Box–Muller), and σ·√T is the volatility magnitude accumulated up to expiry.

If the payoff **depends on the entire path** (e.g. average price, barriers), you can't jump in one step — you chop [0,T] into m small steps and advance step by step:

$$S_{t+Δt} = S_t·exp[ (r − σ²/2)·Δt + σ·√Δt·Z_t ]

Each step draws a new Z_t, stringing into a piecewise-linear trajectory. The thin lines drawn in the demo on the right are each generated this way (about 30 sample paths traced with the \`.path-mc\` class).

### ③ The estimator and convergence: the law of large numbers

Discounting and averaging the payoffs of N paths gives the **Monte Carlo estimator**:

$$Ĉ = e^{−rT}·(1/N)·Σ_{i=1}^{N} payoff_i

The **law of large numbers** guarantees: as N→∞, the sample mean Ĉ **converges to the true expectation** C. That is, the more paths you simulate, the closer the estimate gets to that true value you couldn't compute. It's also **unbiased** — on average neither too high nor too low, just noisy on a single estimate.

Back to the baseline numbers (S₀=K=100, T=1, r=5%, σ=20% call, true value BS=10.45):
- N=100: the estimate might be **11.6**, wildly high — too few samples, pure luck.
- N=1000: about **10.9**, starting to be reliable.
- N=5000: about **10.5**, already approaching the true value.

Note it approaches **randomly from above or below**, not monotonically like a binomial tree. Every 10× more paths visibly hugs the BS horizontal line closer.

### ④ Standard error ~ 1/√N: the price of precision

Monte Carlo's most crucial "constitution" is its **convergence speed**. By the central limit theorem, the estimator's **standard error** is:

$$SE = σ_payoff / √N

where σ_payoff is the standard deviation of a single path's payoff. This formula has two implications you'll both love and hate:

- **The error shrinks as 1/√N.** To halve the error, N must become **4×**; to gain one more significant digit (error ÷10), N must be **×100**. This is the root of Monte Carlo's "slowness" — it converges steadily but is very compute-hungry. In the baseline example N=100 has SE≈1.4, dropping to ≈0.2 at N=5000, exactly about a √50≈7× improvement.
- **It comes with its own error bar.** This is one of Monte Carlo's big advantages over other numerical methods: along with the price you get a **free confidence interval** (roughly price ± 2·SE for a 95% interval). You always know "how far this price still is from being trustworthy." The gray error band in the demo on the right draws ±2·SE, visibly narrowing as N grows.

> Practical note: the slowness of 1/√N spawned a whole set of **variance-reduction** techniques (see piece ⑤), as well as **Quasi-Monte Carlo** using low-discrepancy sequences. In AI quant, Monte Carlo is also the standard "simulator" for training **deep hedging (Stage 10.2)** — the neural network learns to hedge on exactly these random paths.

### ⑤ Why you need it: path dependence + variance reduction

If Monte Carlo were merely slower than BS, it wouldn't need to exist. Its truly irreplaceable use case is: **options whose payoff function depends on the entire path and have no closed-form solution.**

**(a) Path dependence and exotic options (Stage 9.4).** This is Monte Carlo's home turf:
- **Asian options**: the payoff looks at the **average price** along the path, max(avg−K,0). Averaging "smooths out" volatility, so an Asian is **cheaper** than a comparable plain option. Under baseline conditions the plain call is MC≈10.4, the Asian only ≈5.8.
- **Barrier options**: only take effect or expire depending on whether the price **touches/doesn't touch** a level. For example a down-and-out call (voided if it breaks below 85) is MC≈10.0, cheaper than the plain 10.4 — because it gives up some scenarios.
- **Lookbacks, digitals**, and the like work the same way; the payoff is embedded in the path, the BS formula is helpless, and Monte Carlo only needs to change one line of the payoff function to compute.

**(b) High dimension.** Options on a basket of stocks, structures depending on multiple underlyings — as the dimension rises, the binomial-tree / finite-difference (Stage 9.2) grid explodes exponentially, while Monte Carlo's cost grows only **linearly** with dimension — making it almost the only feasible method in high dimensions.

**(c) Variance reduction: speeding up 1/√N.** Since the error = σ_payoff/√N, besides increasing N you can also **lower the numerator σ_payoff**. The most common is the **antithetic variates** method: each time you draw a Z, **generate one path with +Z and one with −Z simultaneously**, and average the pair's payoffs. Because the two paths are negatively correlated, the paired variance is smaller — in the baseline example, with the same total sampling, the antithetic SE drops further from levels like ≈0.16, equivalent to free extra precision. Others include control variates and importance sampling, all with the idea of "making the payoff 'quieter' without introducing bias."

Stringing these five together: **Monte Carlo = approximating the discounted risk-neutral expectation by sampling; generate paths via S_T=S₀·exp((r−σ²/2)T+σ√T·Z), and the average discounted payoff is the price; the error ~1/√N (slow but with a built-in confidence interval); its value lies in pricing path-dependent exotic options (Stage 9.4) and high-dimensional problems, with variance reduction speeding it up.** It and finite differences (Stage 9.2) are the two pillars of numerical pricing — one "scatters sample points," one "lays out a grid to solve" — and the next lesson looks at the latter.
`,

  demo: "monte-carlo",

  analogy: `
Monte Carlo pricing is like **estimating the area of an irregular pond by throwing darts**.

Before you is an oddly shaped pond, and no formula can compute its area directly (like an exotic option payoff with no closed form). But you can: frame the pond inside a box of known area, then **throw many darts randomly into the box with your eyes closed** and count how many landed in the water. The fraction landing in water × the box area approximates the pond area.

- **The more you throw, the more accurate the estimate** — this is the law of large numbers. Throw 100 darts and the estimate might be wild; throw a million and it's very close to the truth.
- **But precision improvement is "dart-hungry"**: to halve the error you must throw **4×** as many darts (error ~ 1/√N). This is exactly Monte Carlo's "steady but slow" temperament.
- **You always know how accurate your estimate is**: from the scatter of the darts in water, you can compute an error range — Monte Carlo likewise gives you a free confidence interval.

In option pricing, the "darts" are the randomly simulated price paths, "landing in water" is the computed expiry payoff, and the "pond area" is that risk-neutral expectation you couldn't integrate. When the pond's shape is especially odd (the payoff depends on the entire path, e.g. the average price or whether a level was touched), **throwing darts is almost the only feasible approach** — that's why exotic options (Stage 9.4) are almost all priced by Monte Carlo.
`,

  misconceptions: [
    "**\"Monte Carlo uses the stock's real upward probability / real drift.\"** — It doesn't. It simulates in the **risk-neutral world**, with drift set to the risk-free rate r (paths are S₀·exp((r−σ²/2)T+σ√T·Z)), not the stock's real expected return. It's the same logic as the binomial tree's risk-neutral probabilities (Stage 3.5).",
    "**\"The more paths you simulate, the more the estimate skews high (or low).\"** — The Monte Carlo estimator is **unbiased**, with no skew on average. It's merely **random noise**: with small N a single estimate may be high or low, and as N grows the noise (standard error) narrows as 1/√N, converging to the true value rather than drifting in some direction.",
    "**\"The error is inversely proportional to N, so doubling the paths halves the error.\"** — Wrong. The standard error ~ **1/√N**, not 1/N. To halve the error, the path count must become **4×**; one more significant digit takes ×100. This is exactly why practice relies on variance reduction (antithetic variates, etc.) to speed things up.",
    "**\"The −σ²/2 in the exponent is optional and doesn't affect the result.\"** — It's the **lognormal convexity correction**, indispensable. Without it, the simulated E*[S_T] would be systematically above the forward price S₀·e^(rT), pricing everything too expensive. It's the same origin as the extra half σ²T in d1 in the Black-Scholes formula (Stage 4.1).",
    "**\"Monte Carlo is just a slow toy, inferior to Black-Scholes.\"** — For plain European options you should indeed use BS. But Monte Carlo can compute what BS **simply can't**: path-dependent Asians/barriers/lookbacks (Stage 9.4), high-dimensional basket options, and it's also the standard simulator for training deep hedging (Stage 10.2). It's \"universal,\" not \"redundant.\"",
  ],

  quiz: [
    {
      q: "When Monte Carlo prices a plain European call, by which formula should a single path's expiry stock price be generated (risk-neutral, Z~N(0,1))?",
      options: [
        "S_T = S₀·exp[(μ − σ²/2)·T + σ·√T·Z], μ being the stock's real expected return",
        "S_T = S₀·exp[(r − σ²/2)·T + σ·√T·Z]",
        "S_T = S₀·(1 + r·T + σ·Z)",
        "S_T = S₀·exp[(r + σ²/2)·T + σ·√T·Z]",
      ],
      answer: 1,
      explain: "Under risk-neutrality the drift uses the risk-free rate **r** (not the real μ), with the **−σ²/2** lognormal convexity correction: S_T=S₀·exp[(r−σ²/2)T+σ√T·Z]. Option A uses the real return (wrong), and D writes the correction term's sign backward (would skew systematically high).",
    },
    {
      q: "Estimating an option price by Monte Carlo, the standard error at N=2500 paths is about 0.40. To bring the standard error down to about 0.20, roughly how many paths are needed?",
      options: ["About 5,000 paths", "About 10,000 paths", "About 25,000 paths", "About 1,250 paths"],
      answer: 1,
      explain: "The standard error ~ σ/√N, proportional to 1/√N. Halving the error → √N doubles → **N becomes 4×** = 2500×4 = **10,000 paths**. This is exactly the root of Monte Carlo being \"steady but slow.\"",
    },
    {
      q: "Which option **most needs** Monte Carlo (rather than directly applying the Black-Scholes formula) for pricing?",
      options: [
        "A standard European call option",
        "A standard European put option",
        "An Asian option (payoff depends on the average price over a period)",
        "A put derivable from a call via put-call parity",
      ],
      answer: 2,
      explain: "An **Asian option**'s payoff depends on the path's average price, has no neat closed-form solution, and is a typical home turf of Monte Carlo (Stage 9.4). Plain European calls/puts use BS directly, and a put can be derived from parity (Stage 3.2) — neither needs simulation.",
    },
    {
      q: "Regarding the \"antithetic variates\" method, which statement is correct?",
      options: [
        "It reduces error by increasing N",
        "It generates one path each with +Z and −Z and averages the pair, using the negative correlation to lower variance and improve precision",
        "It makes the estimate biased but faster",
        "It works only for American options",
      ],
      answer: 1,
      explain: "Antithetic variates uses two negatively correlated paths with **+Z and −Z** in pairs and averages them, lowering the payoff variance (σ_payoff↓) **without introducing bias**, thereby achieving a smaller standard error for the same sampling — a common variance-reduction technique.",
    },
  ],

  further: [
    { label: "Investopedia: Monte Carlo Simulation", url: "https://www.investopedia.com/terms/m/montecarlosimulation.asp" },
    { label: "Wikipedia: Monte Carlo methods for option pricing", url: "https://en.wikipedia.org/wiki/Monte_Carlo_methods_for_option_pricing" },
    { label: "Glasserman: Monte Carlo Methods in Financial Engineering (the classic text)", url: "https://link.springer.com/book/10.1007/978-0-387-21617-1" },
  ],
};
