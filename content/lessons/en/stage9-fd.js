export default {
  id: "finite-difference",
  stage: 9,
  order: 2,
  title: "Finite Differences & the PDE Approach",
  difficulty: 3,
  prereqs: ["black-scholes"],

  oneLiner:
    "**Finite differences** doesn't simulate paths — it lays the Black-Scholes **partial differential equation (PDE)** on a \"price × time\" grid: first write the payoff on the expiry boundary, then use difference formulas to **solve the grid backward layer by layer from expiry to today**. It's a close relative of the binomial tree, especially good at **American early exercise (Stage 9.5)**, and can read Delta, Gamma, and other Greeks directly off the grid.",

  intuition: `
The previous lesson's Monte Carlo (Stage 9.1) approximates the option price by "scattering sample points." This lesson is the **other pillar** of numerical pricing, taking a completely different route: **finite differences**. It doesn't care about individual random paths but returns to the **source** of Black-Scholes — the **partial differential equation** that pins the option price down — and uses a computer to "brute-force" solve it.

Recall how Black-Scholes came about (Stage 4.1): continuously replicate the option with the underlying and cash, the portfolio is risk-free and earns only the rate r, and following this no-arbitrage thread, the option price V(S,t) must satisfy a **partial differential equation (PDE)**:

$$∂V/∂t + ½σ²S²·∂²V/∂S² + rS·∂V/∂S − rV = 0

Don't be scared by it — it merely says "how the option price must change with time and stock price to guarantee no arbitrage." In 1973 Black, Scholes, and Merton **solved it by hand** for **plain European** options — that's the closed-form formula. But for many options (American, with weird boundaries, with time-varying parameters), this PDE has **no closed-form solution**. What to do? **Don't seek the exact solution, seek a numerical approximation** — that's finite differences.

The idea is like "filling in a table": discretize the continuous (stock price S, time t) plane **into a grid** — chop the horizontal axis into several time cells and the vertical axis into several price levels. Then:
1. **First fill in the rightmost column (expiry t=T)**: the option price at each price level = the expiry payoff (call max(S−K,0), put max(K−S,0)). This is the **boundary condition**, plainly given.
2. **Then push one column left with difference formulas**: the derivatives in the PDE (∂V/∂t, ∂V/∂S, ∂²V/∂S²) are all approximated by **difference quotients** of neighboring grid points, so "this column's grid points today" can be computed from "the known grid points in the column to its right."
3. **Roll back column by column to the left**, until the first column t=0; find the cell at the current stock price S₀, and **its value is the option price today**.

Look familiar? **This is precisely the continuous version of the binomial tree's (Stage 3.4) backward induction** — both "fill in expiry first, then compute back layer by layer." The difference: the binomial tree probability-weights two child nodes, while finite differences links neighboring grid points with difference formulas. The two compute the same thing, arriving by different roads.

It has three advantages the BS closed-form can't give: **①** at every grid point you can make one extra "should I exercise early" comparison, so it naturally prices **American options (Stage 9.5)**; **②** subtracting neighboring grid points on the grid **directly gives Delta, Gamma, Theta**, with no separate differentiation needed; **③** boundary conditions can be customized at will, so barriers and early-exercise boundaries can all be packed into the grid.

**In this lesson we break finite differences into five pieces:**

- **① The Black-Scholes PDE: the equation written from no-arbitrage**
- **② Discretization: chopping the "price × time" plane into a grid**
- **③ Backward solve: advancing column by column from the expiry boundary to today (the continuous version of backward induction)**
- **④ Explicit vs implicit: two advancement schemes and stability (conceptual)**
- **⑤ Its home turf: American options + reading Greeks directly off the grid**
`,

  mechanics: `
### ① The Black-Scholes PDE: the equation written from no-arbitrage

Everything starts with this equation. Let the option price be a function of stock price and time V(S,t); no-arbitrage requires it to satisfy:

$$∂V/∂t + ½σ²S²·∂²V/∂S² + rS·∂V/∂S − rV = 0

Read its "physical meaning" term by term:
- \`∂V/∂t\`: the change in option price with the passage of time (same origin as **Theta**, Stage 5.4).
- \`½σ²S²·∂²V/∂S²\`: the curvature term, where \`∂²V/∂S²\` is **Gamma** (Stage 5.3), and the larger σ, the heavier this term — volatility enters the equation right here.
- \`rS·∂V/∂S\`: the drift term, where \`∂V/∂S\` is **Delta** (Stage 5.2).
- \`−rV\`: the discount term, corresponding to "money has time value."

This PDE holds for **all** options satisfying the GBM assumption — European, American, exotic — differing only in **boundary conditions** (expiry payoff, whether early exercise is allowed, barrier levels). Plain European boundaries are simple enough to solve by hand into the Black-Scholes formula; everything else goes to numerical methods.

> Key insight: **the BS formula is just one particular solution of this PDE under "European boundaries."** Change the boundary (e.g. American early exercise) and the equation is still the same, but the solution no longer has a closed form — it must be solved numerically. Finite differences is the most direct numerical solver.

### ② Discretization: chopping the plane into a grid

The first step of finite differences is to discretize the continuous (S, t) plane **into a grid**:

- **Price axis**: from 0 (or some lower bound) to a sufficiently high upper bound S_max, chopped into M equal levels, each of size ΔS.
- **Time axis**: from today 0 to expiry T, chopped into N equal steps, each of size Δt = T/N.

So the plane becomes (M+1)×(N+1) **grid points**, each point (i, j) corresponding to a stock price S_i and a time t_j, and what we want is the option price V[i][j] at each grid point.

Next, replace the derivatives in the PDE with **difference quotients** (difference approximations) — the origin of the name "finite difference":
- First derivative (Delta): use the central difference quotient \`∂V/∂S ≈ (V[i+1] − V[i−1]) / (2ΔS)\`.
- Second derivative (Gamma): \`∂²V/∂S² ≈ (V[i+1] − 2V[i] + V[i−1]) / ΔS²\`.
- Time derivative: use the difference of two adjacent time layers \`(V[j+1] − V[j]) / Δt\`.

Substitute these back into the PDE, and the equation turns from a "continuous differential relation" into an "algebraic relation between grid points" — a table the computer can fill cell by cell.

### ③ Backward solve: advancing from the expiry boundary to today

Like the binomial tree, finite differences **solves backward from the future**. Three kinds of known information "frame" the grid:

- **Expiry boundary (rightmost column, j=N)**: each price level's value = the expiry payoff. Call V[i][N]=max(S_i−K,0), put V[i][N]=max(K−S_i,0).
- **Upper/lower boundaries (top, bottom rows)**: the asymptotic behavior of the option price when the stock is extremely high/low is also known (e.g. a call is about S_max−K·e^(−r(T−t)) at S_max, and 0 at S=0).
- **Roll back interior grid points**: starting from the rightmost column, use the difference relations of step ② to compute column j from column j+1, advancing column by column to the left until j=0.

After rolling back to the t=0 column, find the grid point at the current stock price S₀ on the price axis, and **its value is the option's theoretical price today**. If S₀ falls between two cells, interpolate linearly.

> This is the continuous version of "backward induction" (Stage 3.4). The binomial tree is "two child nodes weighted by p + discounted," and finite differences is "three neighboring grid points combined by difference coefficients" — in essence both propagate known future values back. The demo on the right uses a coarse grid to let you watch, step by step, how the color of the end boundary "flows" left back to today's cell.

### ④ Explicit vs implicit: two advancement schemes

"Computing column j from column j+1" has several concrete schemes, differing in stability and computational cost (here only the intuition, no matrix detail):

- **Explicit scheme**: each grid point in column j is computed by **directly substituting** the three **known** neighboring grid points in column j+1. Simple, intuitive like a binomial tree, but with a pitfall — **when the step size violates the stability condition, it blows up numerically** (errors amplified into garbage). It requires Δt small enough (tied to ΔS²), or it's unstable. The demo uses exactly this explicit advancement on a coarse grid, convenient for visualization.
- **Implicit scheme**: column j's grid points are **coupled** with each other, and advancing one step requires solving a linear system (a tridiagonal matrix, quickly solvable). Slightly heavier to compute, but **unconditionally stable** — the step size can be enlarged without blowing up.
- **Crank–Nicolson**: the average of half explicit and half implicit, balancing stability with **second-order accuracy**, the most commonly used scheme in practice.

> One line: **explicit is simple but picky about step size, implicit is robust but requires solving a system, and Crank–Nicolson is the engineering sweet spot.** Which to choose is a trade-off among accuracy, stability, and compute — the same trade-off seen everywhere in numerical computation.

### ⑤ Home turf: American options + reading Greeks directly

Finite differences' two killer features over the BS closed-form both come from "having a value at every grid point":

**(a) American early exercise (Stage 9.5).** The exact same little move as the binomial tree: after solving a grid point's "continuation value," take the max against the "immediate-exercise payoff" —

$$V[i][j] = max( immediate-exercise payoff,  the continuation value from the difference roll-back )

Just insert this comparison at each column's advancement and finite differences immediately prices **American options**, naturally drawing the **early-exercise boundary** (the dividing line on the grid between "exercising is better" and "continuing to hold is better"). This is a major advantage over Monte Carlo — pure Monte Carlo handles American options awkwardly (requiring regression tricks like Longstaff–Schwartz), while finite differences does it natively.

**(b) Greeks for free.** After solving the grid, subtracting neighboring grid points gives the derivatives:
- **Delta** ≈ (V[i+1]−V[i−1])/(2ΔS), **Gamma** ≈ (V[i+1]−2V[i]+V[i−1])/ΔS², **Theta** ≈ (V[j]−V[j−1])/Δt.

No need to re-simulate perturbed scenarios like Monte Carlo — the Greeks are **read directly off the same grid**, fast and stable. Market makers (Stage 8.5) quoting and hedging a large batch of American options continuously find the finite-difference grid's "solve the price + the full set of Greeks in one pass" property extremely practical.

Stringing these five together: **finite differences = discretizing the BS PDE onto a "price × time" grid, solving backward column by column from the expiry boundary to today (the continuous version of backward induction); explicit / implicit / Crank–Nicolson are stability trade-offs among different advancement schemes; its home turf is American options (Stage 9.5) and reading Greeks directly off the grid.** It complements Monte Carlo (Stage 9.1) — one "lays out a grid to solve the PDE," one "scatters sample points for the expectation"; the former excels at low dimension + American + Greeks, the latter at high dimension + path dependence (Stage 9.4). With both tools in hand, quant can price almost any option.
`,

  demo: "fd-grid",

  analogy: `
Finite-difference pricing is like **using a "temperature grid" to predict how heat spreads across a metal plate**.

Imagine a square metal plate. You know the temperature at every point on the **plate's edges** (this is the "boundary condition" — the payoff for each stock price at expiry, and the asymptotic values when the stock is extremely high or low, all fixed). You want to know the temperature at some point **inside** the plate.

Physics tells you: each interior point's temperature is determined by its **neighboring points above, below, left, and right** following a rule (the heat-conduction equation, mathematically the same kind as the BS PDE). So you divide the plate into a fine grid, start from the known edges, and **compute inward ring by ring, layer by layer** until the whole grid is filled — and the interior-point temperature you wanted emerges.

In option pricing:
- **The metal plate** = the "stock price × time" plane; **temperature** = the option price.
- **The plate's right edge** (the expiry column) = the expiry payoff, plainly given.
- **The heat-conduction rule** = the Black-Scholes PDE, specifying how neighboring grid points' option prices relate.
- **Filling the grid inward from the edges** = solving backward column by column from expiry to today, finally reading off today's cell at the current stock price.

This grid also hands you two things for free: the **temperature difference between neighboring points** on the plate is the "heat gradient" — corresponding to the option's Delta and Gamma (read directly off the grid); and asking at each grid point "is it worth taking the heat away (exercising) now" handles **American options**. That's why finite differences can price, produce the full set of Greeks, and excel at early exercise all at once.
`,

  misconceptions: [
    "**\"Finite differences and Black-Scholes are two competing theories.\"** — They aren't. They share the **same PDE**: the BS formula is the closed-form particular solution of this equation under European boundaries; finite differences is the **numerical solution method** of the same equation. Change the boundary (e.g. American) and the closed form vanishes, leaving only numerical solving — the two are \"same origin, different method.\"",
    "**\"Finite differences simulates random price paths like Monte Carlo.\"** — Not at all. Monte Carlo **scatters sample points** to approximate the expectation (Stage 9.1); finite differences **lays out a grid to solve** that deterministic PDE, with no random numbers whatsoever. One random, one deterministic — two different routes of numerical pricing.",
    "**\"The finer the grid, the more accurate and better the result, always.\"** — Not necessarily. For the **explicit scheme**, the time step Δt must match ΔS² to satisfy the **stability condition**, otherwise densifying the price levels will instead make the values **blow up** into garbage. Stability, not just accuracy, is the hurdle finite differences must clear first (only implicit / Crank–Nicolson are unconditionally stable).",
    "**\"Finite differences can only handle European options; American needs another approach.\"** — Quite the opposite, American is its **home turf**: just take max of \"continuation value\" and \"immediate-exercise payoff\" at each grid point and it natively prices American options and draws the early-exercise boundary (Stage 9.5). Pure Monte Carlo handles American more laboriously instead.",
    "**\"After computing the price you still need to differentiate separately to get the Greeks.\"** — No need. After solving the grid, **subtracting neighboring grid points** directly gives Delta, Gamma, Theta. This is a major convenience of finite differences over Monte Carlo: one grid produces both the price and the full set of Greeks, especially practical for market makers' batch quoting (Stage 8.5).",
  ],

  quiz: [
    {
      q: "When the finite-difference method solves for the option price, the grid's \"starting point\" — the first batch of known values written down — is?",
      options: [
        "All grid points in today's t=0 column",
        "The expiry t=T column: the option price at each stock-price level = the expiry payoff",
        "The grid point at the very center",
        "Several randomly chosen grid points initialized by Monte Carlo",
      ],
      answer: 1,
      explain: "Like the binomial tree, first write the certain expiry payoffs on the **expiry boundary** (rightmost column t=T) (call max(S−K,0), put max(K−S,0)), then **roll back column by column toward today** with difference formulas. This is the \"continuous version of backward induction.\"",
    },
    {
      q: "In the Black-Scholes PDE, the term `½σ²S²·∂²V/∂S²` contains the second derivative ∂²V/∂S² — which Greek does it correspond to?",
      options: ["Delta", "Gamma", "Theta", "Vega"],
      answer: 1,
      explain: "∂²V/∂S² (the option price's second derivative with respect to the underlying) is precisely **Gamma** (Stage 5.3); the first derivative ∂V/∂S is Delta, and ∂V/∂t shares the same origin as Theta. After solving the grid these derivatives can be read directly by subtracting neighboring grid points.",
    },
    {
      q: "Regarding the \"explicit scheme,\" which statement is correct?",
      options: [
        "It is unconditionally stable, and the step size can be enlarged freely",
        "It computes the current layer directly from the known grid points of the next time layer, simple and intuitive, but an improper step size makes it blow up numerically",
        "It must solve a large linear system at each step",
        "It applies only to Monte Carlo simulation",
      ],
      answer: 1,
      explain: "The **explicit scheme** substitutes the known grid points of column j+1 directly to compute column j, simple like a binomial tree, but **conditionally stable**: Δt must match ΔS², otherwise errors are amplified into garbage. The unconditionally stable scheme that requires solving a system is the **implicit** scheme; the compromise between the two is Crank–Nicolson.",
    },
    {
      q: "Compared to pure Monte Carlo, in which respect does finite differences (the grid method) have an advantage?",
      options: [
        "Pricing high-dimensional options depending on a basket of dozens of stocks",
        "Pricing American options and reading Delta/Gamma and other Greeks directly off the grid",
        "Handling Asian options whose payoff depends on the entire path",
        "Pricing without writing any boundary conditions",
      ],
      answer: 1,
      explain: "Finite differences naturally excels at **American early exercise** (max(exercise, hold) at each cell) and can **read the Greeks directly** (subtracting neighboring grid points). High dimension and path dependence (Asians) are instead **Monte Carlo's** home turf (Stage 9.1/9.4) — the two methods complement each other.",
    },
  ],

  further: [
    { label: "Wikipedia: Finite difference methods for option pricing", url: "https://en.wikipedia.org/wiki/Finite_difference_methods_for_option_pricing" },
    { label: "Investopedia: Black-Scholes Model (with PDE background)", url: "https://www.investopedia.com/terms/b/blackscholes.asp" },
    { label: "Wilmott: Finite-Difference Methods (a classic exposition of numerical pricing)", url: "https://www.wilmott.com/" },
  ],
};
