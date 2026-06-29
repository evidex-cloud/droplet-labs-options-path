export default {
  id: "binomial-model",
  stage: 3,
  order: 4,
  title: "The Binomial Model: Pricing Step by Step",
  difficulty: 3,
  prereqs: ["no-arbitrage"],

  oneLiner:
    "The **binomial tree** chops the time to expiry into slices where the price can only go up or down each slice; take the expectation of the payoff under a set of **risk-neutral probabilities** and discount backward slice by slice, and you can value any option — it even handles American early exercise, and refining the steps converges to Black-Scholes.",

  intuition: `
Last lesson (Stage 3.3), in a "one-step world," we used **replication** to price a call: $5, with no probability used. But the real world doesn't reach expiry in one step — the stock walks there one up-and-down move at a time. What to do? **Repeat the one step many times**, and you get the **binomial tree**: the most intuitive slide rule in option pricing.

The binomial tree's setup is simple enough to sketch on a napkin: chop "now to expiry" into N small steps, and **each small step the stock is allowed only two things — rise by a factor (× u) or fall by a factor (× d).** So all the price's possible paths grow into a continually branching tree. For instance S₀=100, u=1.2, d=0.8: one step out is 120 or 80; two steps out is 144, 96, or 64 …

The pricing algorithm runs **backward**, called **backward induction**:
1. **Start at the far right (expiry)**: each terminal node's stock price is fixed, so the option payoff max(S−K, 0) (a call) is fixed too.
2. **Step back one slice to the left**: each node's option price = "its two child nodes' values, taken as a weighted average under a special probability p, then discounted one step."
3. **Induct all the way back to the root node**, and the root's value is **today's option price**.

That "special probability p" is the key, called the **risk-neutral probability**:

$$p = (e^{rΔt} − d) / (u − d)

It is **not** the real probability of the stock rising, but a "pseudo-probability" backed out of no-arbitrage (replication) — the next lesson (Stage 3.5) is devoted to why it looks this way and why it works. For this lesson you only need to know how to **use** it: each node's option price = e^(−rΔt)·[ p·(up child's value) + (1−p)·(down child's value) ], inducted to the bottom.

An example one step (S₀=100, u=1.2, d=0.8, r=5%, one step = 1 year, call K=100):
- Terminal: up to 120 → payoff 20; down to 80 → payoff 0.
- Risk-neutral probability p = (e^0.05 − 0.8)/(1.2 − 0.8) ≈ **0.628**.
- Today's call price = e^(−0.05)·[0.628×20 + 0.372×0] ≈ **$11.95**.

That simple. Push the number of steps from 1 to 2, 5, 50 … and this tree gets finer and finer, more and more like a real continuous price path, and the computed price **converges to Black-Scholes (Stage 4.1)**, that continuous formula. The binomial tree is BS's "discrete rehearsal" — and it has one trick BS can't do: **check slice by slice whether to exercise early**, so it can price **American options (Stage 9.5)**.

**In this lesson we break the binomial tree into five pieces:**

- **① One step, two states: how u, d build a tree**
- **② The risk-neutral probability p: the "pseudo-probability" backed out of no-arbitrage**
- **③ Backward induction: computing back from expiry to today**
- **④ A two-step tree: working it through fully**
- **⑤ Refine the steps → converge to BS; check slice by slice → American exercise**
`,

  mechanics: `
### ① One step, two states: building a tree

The binomial tree's smallest unit is **one step, two states**: at the current price S, one step out there are only two possibilities —

$$up:   S·u   (u > 1)
$$down: S·d   (d < 1, usually d = 1/u)

where u, d are the **up/down factors**. How are they set? The most common is the **CRR (Cox–Ross–Rubinstein)** calibration, making the tree's swing match the real volatility σ:

$$u = e^{σ·√Δt},  d = 1/u = e^{−σ·√Δt}

Here Δt = T/N is the length of each step (in years). The greater the volatility σ, the further u is from 1, and the wider the tree spreads — **this is exactly how volatility enters the binomial tree** (echoing Stage 3.1: σ is the pricing protagonist). Repeat the unit N steps, fanning upward into a tree with N+1 terminal nodes.

### ② The risk-neutral probability p: a product of no-arbitrage

Each step weights its two branches with the same set of probabilities, and this set is the **risk-neutral probability**:

$$p = (e^{rΔt} − d) / (u − d),   1 − p = (u − e^{rΔt}) / (u − d)

Where does it come from? **It's the same thing as the previous lesson's replication, said two ways.** In the replication argument we solved for Δ shares + a loan to price; rearrange the algebra and that pricing formula happens to be writable as "take the expectation of the payoff under p, then discount." So p is **not** the real up/down probability, but the **pseudo-probability** that makes "the expected growth rate exactly equal the risk-free rate r" (Stage 3.5 explains in detail).

- It must fall within (0,1), or there's arbitrage — which requires **d < e^(rΔt) < u** (the no-arbitrage boundary condition).
- Example: u=1.2, d=0.8, r=5%, Δt=1 → p = (e^0.05 − 0.8)/(1.2 − 0.8) = (1.0513 − 0.8)/0.4 ≈ **0.628**.

> Key reminder: **don't treat p as the "real probability of the stock rising."** It's purely a pricing tool. The real probability might be 70%, but as long as you can replicate, pricing uses p, not the real probability — this is the spot the whole theory is most easily misunderstood (Stage 3.5).

### ③ Backward induction: computing back from expiry

With u, d, p in hand, pricing is **inducting from right (expiry) to left (today)**:

$$node value = e^{−rΔt}·[ p·V_up + (1−p)·V_down ]

where V_up, V_down are the option prices at that node's up and down child nodes. The procedure:
1. **Terminal nodes**: the stock price is fixed, so the option price = the payoff function (call max(S−K, 0), put max(K−S, 0)).
2. **Induct each layer back**: for each node, apply the "expectation × discount" formula above, computing itself from its two child nodes' values.
3. **Until the root node**: the root's value = **today's theoretical option price**.

This "fill in expiry first, then fill back layer by layer" process is dynamic programming. Each step's discount factor e^(−rΔt) pulls future money back to the present — that r is Stage 3.1's rate dial showing up in the tree.

### ④ A two-step tree: working it through fully

Extend one step to two to see backward induction in action. Let **S₀=100, u=1.2, d=0.8, r=5%, call K=100**, two steps, each Δt=1 year, p≈0.628 (as above).

**Step 0 (today)**: 100.
**Step 1**: up → 120; down → 80.
**Step 2 (expiry, terminal payoffs)**:
- up-up: 100·1.2·1.2 = 144 → payoff max(144−100, 0) = **44**
- up-down/down-up: 100·1.2·0.8 = 96 → payoff max(96−100, 0) = **0**
- down-down: 100·0.8·0.8 = 64 → payoff **0**

**Induct back to step 1** (each node = e^(−0.05)·[p·up child + (1−p)·down child]):
- Up node (120) = e^(−0.05)·[0.628·44 + 0.372·0] ≈ 0.9512·27.63 ≈ **26.28**
- Down node (80) = e^(−0.05)·[0.628·0 + 0.372·0] = **0**

**Induct back to the root (today)**:
$$C = e^{−0.05}·[0.628·26.28 + 0.372·0] ≈ 0.9512·16.50 ≈ 15.70

> So this two-step call is worth about **$15.7** today. Note each step is just the mechanical repetition of "weight two child values, discount one slice" — even a deeper tree is the same action brushed many times over, especially suited to handing off to a computer (or even an AI agent) for batch computation. The demo on the right lets you set the steps to 1/2/3, watch the tree grow, and watch the price change with the step count.

### ⑤ Converging to BS and American exercise

The binomial tree's two great values both come from "adjustable steps" and "checkable slice by slice":

**(a) Refine the steps → converge to Black-Scholes.** Increase N (each step Δt=T/N shrinks, using CRR's u=e^(σ√Δt)), and this tree gets finer and finer, approaching continuous price movement, with the price approaching the BS formula (Stage 4.1). Example: a call with S=100, K=100, T=1, r=5%, σ=20%, the BS exact price is **10.45**; the binomial tree gives about 10.25 at N=10, about 10.41 at N=50, about 10.44 at N=200 — **converging steadily.** This shows BS didn't fall from the sky — it's the limit of the binomial tree.

**(b) Check slice by slice → American early exercise.** The Black-Scholes formula prices only **European** options (exercisable only at expiry). But during induction, the binomial tree can do one extra comparison at **every node**:

$$node value = max( payoff of immediate exercise,  discounted expectation of holding )

As long as "exercise now" is worth more than "keep waiting," exercise at that node. With this one change, the binomial tree can instantly price **American options (Stage 9.5)** — its killer feature relative to the BS formula, especially crucial for American calls on dividend-paying stocks and deep ITM American puts. Checking the optimal exercise slice by slice is also the source of later numerical methods like **finite differences and optimal stopping**.

Stringing these five pieces together: **build the tree (u, d) → back out the risk-neutral probability p → backward-induct discounting from expiry to today**; refine the steps and you approach BS, check slice by slice and you nail American options. Next lesson we circle back to that ever-unexplained p — **what exactly the risk-neutral probability is, and why the price computed with it is right** (Stage 3.5).
`,

  demo: "binomial-tree",

  analogy: `
Binomial-tree pricing is like **solving a branching maze by "filling in the cells backward."**

Picture a maze where every step has only two forks: left (down) or right (up). You want to compute "starting from the entrance, what's the expected prize you can collect."

The smart way isn't to guess forward from the entrance, but to **fill in backward from the exits**:
- **Stand at all the exits first**: each exit's prize is hard-coded and plain to see (the expiry payoff max(S−K, 0)).
- **Step back to each junction in the second-to-last row**: this junction's value = "the prizes of the two exits it leads to, averaged with a set of weights p, then given a time discount."
- **Step back row by row**, computing each junction from the two junctions ahead of it, until you step back to the entrance — **the entrance's value is today's option price.**

This is **backward induction**: the future is fixed (exit prizes are known), so inducting from the future back to the present is far more reliable than blindly guessing the future from the present. And that set of weights p (the **risk-neutral probability**) isn't "the real probability of going right," but a set of "accounting weights" that keep the books always balanced and arbitrage-free.

The finer you slice the maze (the more steps), the more precisely you capture the real path, and the more accurate the expected prize — slice it to the limit and it's the **Black-Scholes** continuous formula. And the binomial tree has one extra trick over the formula: at **every junction** it can ask "do I take the money and walk now?" — which is exactly why it can price **American options.**
`,

  misconceptions: [
    "**\"The risk-neutral probability p is the real probability of the stock rising.\"** — No. p=(e^(rΔt)−d)/(u−d) is a \"pseudo-probability\" backed out of **no-arbitrage**, making the expected growth rate exactly equal the risk-free rate. The real probability might be 70%, but pricing uses only p (Stage 3.5 explains in detail).",
    "**\"The binomial tree is too crude, just a toy, no match for Black-Scholes.\"** — Quite the opposite. Refine the steps and the binomial tree **converges to BS** (already to two decimals at N=200); and it can do what BS can't — price **American options** (Stage 9.5) and structures with early exercise.",
    "**\"When inducting, just take the plain average of the two child nodes.\"** — That drops two steps: you must weight by the **risk-neutral weight p (not 50/50)**, and also **discount one slice e^(−rΔt)**. Miss the discount or use the wrong probability and the price is off.",
    "**\"The binomial tree can only price European options.\"** — Its biggest advantage is precisely that it **can handle American**: at each node, take the max of \"immediate-exercise payoff\" and \"discounted expectation of holding.\" This is its killer feature relative to the BS formula (Stage 9.5).",
    "**\"The up factor u can be any number.\"** — u, d must be calibrated so the tree's swing matches the real volatility, commonly CRR's **u=e^(σ√Δt), d=1/u**. Volatility σ enters the binomial tree precisely through u, d — the greater σ, the wider the tree spreads (Stage 3.1).",
  ],

  quiz: [
    {
      q: "Which of the following is the formula for the **risk-neutral probability** p in a binomial tree?",
      options: [
        "p = (u − d) / (u + d)",
        "p = (e^(rΔt) − d) / (u − d)",
        "p = u / (u + d)",
        "p = the real probability of a rise",
      ],
      answer: 1,
      explain: "p = (e^(rΔt) − d) / (u − d). It's backed out of no-arbitrage, making the expected growth rate equal the risk-free rate r — **not** the real probability of a rise. It must fall within (0,1), or there's arbitrage.",
    },
    {
      q: "One-step tree: S₀=100, u=1.2, d=0.8, r=5%, Δt=1 year. Roughly what's the risk-neutral probability p? (e^0.05≈1.0513)",
      options: ["0.50", "0.55", "0.63", "0.80"],
      answer: 2,
      explain: "p=(e^(rΔt)−d)/(u−d)=(1.0513−0.8)/(1.2−0.8)=0.2513/0.4≈**0.628**. Note it doesn't equal 0.5, and it has nothing to do with whatever \"real probability of a rise\" you have in mind.",
    },
    {
      q: "Continuing (p≈0.628). A call K=100, with the terminal up to 120 (payoff 20) or down to 80 (payoff 0). Roughly what's its price **today**?",
      options: ["$10.0", "$11.95", "$12.56", "$20.0"],
      answer: 1,
      explain: "Node value = e^(−rΔt)·[p·V_up+(1−p)·V_down] = e^(−0.05)·[0.628·20+0.372·0] = 0.9512·12.56 ≈ **$11.95**. Take the risk-neutral expectation first, then discount one slice.",
    },
    {
      q: "What's the most crucial extra capability of the binomial tree relative to the Black-Scholes formula?",
      options: [
        "It computes faster",
        "It can judge at each node whether to exercise early, thereby pricing American options",
        "It doesn't need to know the volatility",
        "It guarantees the option will be profitable",
      ],
      answer: 1,
      explain: "The BS formula prices only European options. During induction the binomial tree can take max(immediate-exercise payoff, discounted expectation of holding) at each node, so it can price **American options** (Stage 9.5). Refine the steps and it also converges to BS (Stage 4.1).",
    },
  ],

  further: [
    { label: "Investopedia: Binomial Option Pricing Model", url: "https://www.investopedia.com/terms/b/binomialoptionpricing.asp" },
    { label: "Wikipedia: Binomial options pricing model", url: "https://en.wikipedia.org/wiki/Binomial_options_pricing_model" },
    { label: "OIC: Option Pricing Models (binomial and BS)", url: "https://www.optionseducation.org/" },
  ],
};
