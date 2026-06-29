export default {
  id: "black-scholes",
  stage: 4,
  order: 1,
  title: "Black-Scholes: From Intuition to Formula",
  difficulty: 3,
  prereqs: ["binomial-model", "risk-neutral"],

  oneLiner:
    "**Black-Scholes** is what the binomial tree becomes when you crank the number of steps to infinity: in a risk-neutral world, take the expectation of the payoff at expiry and discount it back to today. It turns five inputs into one theoretical price, and `N(d1)` and `N(d2)` each carry a clear meaning — while its few elegant-but-false assumptions are exactly why the volatility smile (Stage 4.3) exists.",

  intuition: `
Last chapter you learned to value an option with a **binomial tree** (Stage 3.4): slice the time to expiry into N steps, let the price move only up (×u) or down (×d) at each step, weight the payoffs by the **risk-neutral probability**, and discount cell by cell back to today. We also made one key remark — **push the number of steps N higher and the tree gets finer and finer, and the price converges to a continuous formula**. That formula is the 1973 **Black-Scholes** (more completely, Black–Scholes–Merton, or BSM), the bedrock of modern option pricing.

Why jump from the discrete tree to a continuous formula? Because real stock prices don't move twice a year — they **jiggle continuously, every instant**. If you push the binomial steps to infinity and let each step length Δt → 0, the discrete "up/down two-state" world mathematically merges into a single continuous random path — what finance calls **geometric Brownian motion** (the log of the price is normally distributed, so the price itself is **lognormally distributed**). Black and Scholes proved, with a brilliant argument: if you can replicate the option **continuously** with the underlying and cash (the continuous version of the replication argument from Stage 3.3), then that replicating portfolio is riskless, and it must earn only the **risk-free rate r** — follow this no-arbitrage thread and the option's fair price gets locked down by a partial differential equation, whose solution is the BS formula.

Don't let the formula scare you. **It is essentially the continuous version of that one binomial sentence:**

$$Call price C = (today's underlying, scaled by "the probability-weight of finishing in-the-money") − (the strike you must pay, discounted by "the probability of being exercised" and the interest rate)
$$Putting it into symbols gives the star of this lesson:

$$C = S·N(d1) − K·e^(−rT)·N(d2)
$$where S is the spot price, K the strike, T the time to expiry (in years), r the risk-free rate, and the two \`d\` terms are fixed by the fifth and most important input — **volatility σ**. \`N(·)\` is the cumulative probability of the standard normal distribution (a number between 0 and 1). Intuitively: **N(d2) is "the probability, in the risk-neutral world, of finishing in-the-money"**, and **S·N(d1) is "the (discounted) expectation of the slice of the underlying's value you'd collect if it truly finishes in-the-money."** Call price = the underlying you expect to receive − the cash you expect to pay out. That's all it is.

Let's ground it immediately with a memorable set of numbers (S=K=100, T=1 year, r=5%, σ=20%, a **call**): it works out to **C ≈ 10.45** (per share; one contract ×100 = 1,045). The **put** under the same conditions is about **5.57**. You can reproduce both of these with one click in the demo below.

**In this lesson we break Black-Scholes into five pieces:**

- **① From tree to continuous: BS is the tree's limit + a risk-neutral expectation**
- **② The formula itself: C = S·N(d1) − K·e^(−rT)·N(d2), and where d1/d2 come from**
- **③ What N(d1) and N(d2) actually each mean**
- **④ The five inputs: how each one pushes the price (echoing Stage 3.1)**
- **⑤ The four assumptions and their cracks — why there is a volatility smile (Stage 4.3)**
`,

  mechanics: `
### ① From tree to continuous: the limit + a risk-neutral expectation

The core move of the binomial tree (Stage 3.4) is: **node value = e^(−rΔt)·[ p·up-child + (1−p)·down-child ]**, where p is the risk-neutral probability. Push the steps N → ∞ and each step Δt = T/N → 0, calibrate with CRR using u = e^(σ√Δt), d = 1/u so the tree's swing always matches volatility σ. As the steps go to infinity, the discrete binomial distribution **converges to the normal distribution** (central limit theorem), and that whole string of "weight, sum, and discount" operations becomes a single **continuous risk-neutral expectation**:

$$C = e^(−rT)·E*[ max(S_T − K, 0) ]
$$Here E*[·] is the expectation under the **risk-neutral measure** (Stage 3.5): pretend the underlying's expected growth rate is just the risk-free rate r, and the price is lognormally distributed. Carry out that integral and the result is the closed-form Black-Scholes formula. So BS **didn't fall out of the sky** — it's the binomial tree you already understand, with the steps pushed to the limit and the discrete expectation swapped for a continuous integral. This also explains why a tree with N=200 already matches BS to two decimal places.

> Memorize this one line: **the binomial tree is the "discrete rehearsal" of BS, and BS is the "continuous limit" of the tree.** Both compute the same thing — a discounted risk-neutral expectation.

### ② The formula itself: where d1 and d2 come from

Write out the full Black-Scholes for a European option (the European/American distinction from Stage 2.4):

$$Call C = S·N(d1) − K·e^(−rT)·N(d2)
$$Put  P = K·e^(−rT)·N(−d2) − S·N(−d1)
$$where the two d terms are defined as:

$$d1 = [ ln(S/K) + (r + σ²/2)·T ] / ( σ·√T )
$$d2 = d1 − σ·√T
$$Take apart the numerator of d1: \`ln(S/K)\` is the current "in-the-money/out-of-the-money degree" (moneyness in log form), and \`(r+σ²/2)·T\` is the risk-neutral drift plus the convexity correction from volatility; the denominator \`σ·√T\` is the cumulative swing (standard deviation) accumulated up to expiry. So **d1 and d2 are essentially "z-scores" — they standardize "how far the spot is from the strike" by volatility**: the deeper in-the-money and the smaller the volatility, the larger d is and the closer N(d) gets to 1.

Plug in that set of numbers (S=K=100, T=1, r=5%, σ=20%): d1 = (0 + (0.05+0.02)·1)/(0.2·1) = **0.35**, d2 = 0.35 − 0.2 = **0.15**. From the standard normal table: N(0.35) ≈ **0.6368**, N(0.15) ≈ **0.5596**. So C = 100·0.6368 − 100·e^(−0.05)·0.5596 ≈ 63.68 − 53.23 = **10.45**. The put follows from P = C − S + K·e^(−rT) (put-call parity, Stage 3.2) = 10.45 − 100 + 95.12 ≈ **5.57**. The demo on the right is exactly this calculator — drag any of the five sliders and the price and all five Greeks refresh in real time.

### ③ What N(d1) and N(d2) each mean

These two N's are constantly conflated, but their jobs are quite distinct:

- **N(d2) = the probability, in the risk-neutral world, that the option finishes in-the-money (S_T > K).** It answers "what's the chance it's worth exercising." In that set of numbers N(d2) = 0.56, meaning this ATM call has roughly a 56% risk-neutral probability of finishing in-the-money. **Note this is a risk-neutral probability, not a real-world one** (the distinction Stage 3.5 hammers home).
- **N(d1) = the call option's Delta** (Stage 5.2 covers this in depth). It measures "the underlying rises 1, the option rises how much." At the same time, S·N(d1) is "the (risk-neutral, discounted) expectation of the underlying value you'd collect if it finishes in-the-money." N(d1) is always ≥ N(d2), because it additionally counts "the part where, in-the-money, the underlying might rise even more."

Reading the formula by linking the two terms makes it flow: **C = S·N(d1) (the underlying you expect to receive) − K·e^(−rT)·N(d2) (the cash you expect to pay, discounted to today).** N(d1) governs the "asset leg," N(d2) governs the "cash leg," and the difference is what this right is worth today.

> This decomposition also conveniently explains why an ATM call's Delta is slightly above 0.5 rather than exactly 0.5 — because d1 has half a σ²T of extra positive drift over d2, nudging N(d1) past 0.5.

### ④ The five inputs: how each one pushes the price

Black-Scholes breaks the premium into five observable (or estimable) inputs. They are exactly five of the "six pricing factors" from Stage 3.1 (all except dividends); here's how each enters the formula:

- **Spot S↑** → call↑, put↓ (the most direct; Delta measures its sensitivity).
- **Strike K↑** → call↓, put↑ (the higher the strike, the less the right to buy is worth).
- **Time to expiry T↑** → usually both ↑ (more time means more variability and thicker time value; Theta, Stage 5.4, is its flip side).
- **Volatility σ↑** → **both** call and put ↑. This is the subtlest and most important one: σ enters only d1 and d2, and **it measures uncertainty, and uncertainty is good for the option buyer whose loss is capped but upside is open.** σ is the star of this whole chapter, and the quantity Vega (Stage 5.5) measures.
- **Risk-free rate r↑** → call↑, put↓ (it pushes down the present value of the strike; Rho measures it, significant only for long-dated options).

The one factor not among these five but unavoidable in real markets is the **dividend q**: payouts depress the forward price, making calls cheaper and puts more expensive. The \`_bs.js\` engine carries a q parameter, and the demo gives you a dividend-yield slider too.

### ⑤ The four assumptions and their cracks

The BS formula is elegant because it makes a few **idealizing assumptions**. Understanding where these assumptions break down matters far more than memorizing the formula — because nearly everything later in this chapter (smile, skew, surface, stochastic volatility) is about **patching these cracks**:

**(a) Volatility σ is constant.** In the formula σ is a single fixed number, the same for all strikes and all expiries. But in real markets, the implied volatilities backed out from different strikes are **not equal** — plotted, they trace a curved **volatility smile/skew** (Stage 4.3). This is direct evidence that the "σ is constant" assumption is bankrupt, and the pivot point of the whole chapter.

**(b) Prices move continuously, with no gaps.** Geometric Brownian motion assumes the price walks smoothly, never jumping instantaneously. But earnings, breaking news, and flash crashes make prices **gap (jump)**. Gaps mean extreme moves happen more often than the lognormal predicts — that's **fat tails**, and the reason deep out-of-the-money options (especially puts) are systematically expensive (Stage 8.4, tail risk).

**(c) Returns are normally distributed (prices lognormal).** Real return distributions are **more peaked with fatter tails** (leptokurtic). Crashes happen far more often than a bell curve predicts — 1987's −22% single day is a "once in billions of years" event in the standard BS world, yet reality serves one up every few decades.

**(d) Frictionless, continuously hedgeable, constant rates.** Reality has bid-ask spreads, transaction costs, no truly continuous hedging, and rates that move. Market makers (Stage 8.5) face exactly these frictions every day — which is also what gave rise to **deep hedging** (Stage 10.2), where a neural network learns the optimal hedge directly.

Stringing the five pieces together: **BS = the tree's limit = a discounted risk-neutral expectation; the formula uses d1/d2 to standardize moneyness by volatility, N(d1) governs the asset leg and N(d2) the cash leg; the five inputs each push the price; and the breakdown of "σ constant + normal + no gaps" directly gives birth to the implied volatility the next lesson quantifies, and to the Stage 4.3 volatility smile.** Put another way, BS's biggest contribution isn't just a price — it's that it gave the market a **common language**: people no longer quote "this option is worth a few dollars," they quote its **implied volatility** (Stage 4.2).
`,

  demo: "bs-calculator",

  analogy: `
Black-Scholes is like an **actuarial machine for pricing an uncertain future**.

Imagine pricing a **one-year right to buy a house at today's price** (you pay a fee to lock in "the right to buy this house within a year at today's price"). An actuary wouldn't try to guess exactly how high the house price will go — they'd ask five things:

- **What's the house worth now (S)** and **what buy price did you lock in (K)** — the gap between the two sets how much the right "is worth right now";
- **How long is the term (T)** — the longer the time, the more room for the price to run;
- **How violently do prices swing in this neighborhood (σ)** — over the same year, this right is worth wildly different amounts in a calm subdivision versus a boom-and-bust district;
- **The time value of money (r)** — paying that buy price a year later means you only need its present value today.

The actuary feeds these five numbers into a formula and out comes a fair price. That's exactly what Black-Scholes does, except its "house" is a stock, and it gives volatility σ a central seat: **it doesn't predict the direction of the move, it prices the "uncertainty" itself.**

But this actuarial machine has a blind spot: it **assumes the neighborhood's volatility is a single fixed number.** In reality, people fear a "price crash" far more than a "price spike," so they bid up the price of "downside protection" extraordinarily high — the machine can't compute this asymmetric fear, so the market compensates with a higher implied volatility. That compensation curve is the volatility skew (Stage 4.3).
`,

  misconceptions: [
    "**\"Black-Scholes can predict whether the stock will rise or fall.\"** — It absolutely cannot. The formula contains **no real-world directional probability** at all; it operates in a risk-neutral world, pretending every asset earns only the risk-free rate. It prices \"uncertainty,\" not direction (Stage 3.5).",
    "**\"N(d1) and N(d2) are the same thing — both the probability of finishing in-the-money.\"** — No. **N(d2)** is the risk-neutral probability of finishing in-the-money; **N(d1)** is the call's **Delta**, and S·N(d1) is the expectation of the underlying value collected when in-the-money. N(d1) is always ≥ N(d2).",
    "**\"BS gives you the absolutely correct 'true value.'\"** — It's correct only under those few idealized assumptions (σ constant, lognormal, no gaps, frictionless). Real markets deviate from these, so the implied volatilities backed out from different strikes of the same underlying aren't equal — that's the volatility smile (Stage 4.3).",
    "**\"The larger volatility σ is, the less the option is worth, because risk is higher.\"** — Backwards. The larger σ is, the **more expensive both** calls **and** puts become. Because the option buyer's loss is capped and upside is open, more uncertainty means more potential gain without deepening the loss — volatility is the option buyer's friend (Vega is positive, Stage 5.5).",
    "**\"BS can only use historical volatility as the σ input.\"** — In practice it's exactly the reverse: the σ you **back out** by plugging the market price into the formula is called implied volatility (Stage 4.2), and it's the metric traders actually quote and compare on. Historical volatility is just a reference frame.",
  ],

  quiz: [
    {
      q: "In the Black-Scholes formula C = S·N(d1) − K·e^(−rT)·N(d2), what is the most accurate meaning of **N(d2)**?",
      options: [
        "The call option's Delta",
        "The probability, in the risk-neutral world, that the option finishes in-the-money (S_T > K)",
        "The probability the underlying truly rises",
        "The option's time-value fraction",
      ],
      answer: 1,
      explain: "**N(d2)** is the risk-neutral probability of finishing in-the-money (it governs the \"cash leg\": whether you pay the strike). The call's Delta is **N(d1)**. Neither is a real-world probability — BS operates entirely in the risk-neutral world (Stage 3.5).",
    },
    {
      q: "Holding everything else fixed and only **raising volatility σ**, how do the theoretical prices of a European call and put change?",
      options: ["Call↑, put↓", "Call↓, put↑", "Both ↑", "Both ↓"],
      answer: 2,
      explain: "σ enters only d1 and d2, and more uncertainty is good for the option buyer whose loss is capped but upside is open, so **both** call and put get more expensive. This is exactly why Vega is positive (Stage 5.5).",
    },
    {
      q: "For a European call with S=K=100, T=1 year, r=5%, σ=20%, with d1=0.35, d2=0.15, N(0.35)≈0.637, N(0.15)≈0.560. What is its theoretical price approximately? (e^(−0.05)≈0.951)",
      options: ["About 5.6", "About 10.5", "About 16.0", "About 20.0"],
      answer: 1,
      explain: "C = 100·0.637 − 100·0.951·0.560 ≈ 63.7 − 53.2 = **10.5** (per share; one contract ×100 ≈ 1,045). This is the most classic BS benchmark number, reproducible with one click in the demo.",
    },
    {
      q: "Which of the following is **not** a core assumption of Black-Scholes (and therefore becomes a crack to patch in reality)?",
      options: [
        "Volatility σ is constant across all strikes and expiries",
        "Prices move continuously, with no gaps",
        "Returns are normally distributed (prices lognormal)",
        "Volatility forms a smile curve across strikes",
      ],
      answer: 3,
      explain: "The \"volatility smile\" is precisely the **result** of BS's assumptions breaking down, not one of its assumptions. BS assumes σ is constant (option A), but in real markets the implied volatilities backed out from different strikes aren't equal — plotted, they form the smile/skew (Stage 4.3).",
    },
  ],

  further: [
    { label: "Investopedia: Black-Scholes Model (formula and inputs in detail)", url: "https://www.investopedia.com/terms/b/blackscholes.asp" },
    { label: "Wikipedia: Black–Scholes model", url: "https://en.wikipedia.org/wiki/Black%E2%80%93Scholes_model" },
    { label: "OIC: Option Pricing Theory and Models", url: "https://www.optionseducation.org/" },
  ],
};
