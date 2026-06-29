export default {
  id: "deep-hedging",
  stage: 10,
  order: 2,
  title: "Deep Hedging: Teaching a Network to Hedge",
  difficulty: 3,
  prereqs: ["delta-hedging"],

  oneLiner:
    "The textbook's **Black-Scholes Delta hedge** (Stage 8.2) rests on a set of fairy-tale assumptions: **no transaction costs, you can buy and sell continuously and nonstop, and prices don't gap**. In reality these are all false — so \"perfect hedging\" simply doesn't exist, and grinding away at the Delta instead bleeds you with fees and slippage. **Deep hedging (Buehler et al. 2019)** takes a different tack: instead of first solving for the theoretical Delta, it directly trains a **neural network** to learn a hedging **policy** under **real frictions** — it learns on its own to \"trade less when costs are high and tolerate a bit of residual risk,\" and in a world with costs it **outperforms the mechanical Delta hedge**.",

  intuition: `
Recall Stage 8.2: after selling an option, a market maker uses the underlying stock to drive net Delta to 0, and rebalances whenever Delta drifts. Behind that logic hide three of Black-Scholes' **fairy-tale assumptions**:

- **No transaction costs**: buying and selling stock costs nothing — no bid-ask spread, no slippage.
- **Continuous hedging**: you can fine-tune your position at every instant, infinitely often.
- **Continuous prices, no gaps**: the stock price moves like a smooth line and never jumps from 100 to 85 overnight.

In this fairy-tale world, Delta hedging is **perfect** — residual risk can be driven to zero, and the option's price is its replication cost (Stage 3.3). **But all three are false.** In reality: every trade pays the spread and commissions; you can only rebalance discretely (daily, every few hours); earnings and black swans make prices **gap** outright, and Delta hedging is helpless in the face of a gap.

So an awkward situation arises: **the more faithfully you rebalance frequently per the BS Delta, the more transaction costs you pay.** Picture a high-transaction-cost environment where you mechanically reset Delta to exactly 0 every day — over a month the fees devour a large chunk of the premium. You've hedged "very precisely" yet lost badly. **Perfect directional neutrality is unaffordable.**

What would a seasoned trader do? They wouldn't be dogmatic. They would **weigh the trade-off**: "Delta is only slightly off right now, and trading is expensive — so let's **not move**, carry this bit of directional risk for a while, and adjust once it drifts far enough or the cost timing improves." They strike a smart compromise between **hedging precision** and **transaction cost**. The question is: what does the **optimal policy** for this trade-off actually look like? Where do you set the thresholds? When should you tolerate the residual, and when must you act? The BS formula **won't tell you** — it lives in a costless fairy tale.

**Deep hedging exists to answer this question.** Its idea is extremely clean: **stop starting from the theoretical Delta. Treat hedging as a decision problem and let a neural network learn the optimal hedging actions directly.**

- Show the network the **state** (current stock price, time to expiry, how many shares you already hold, volatility…);
- Let it output an **action** (how many shares to buy/sell this step);
- Run thousands upon thousands of paths in a **simulator with real frictions** (transaction costs, discrete time, even jumps), letting it walk each path to the end;
- Score the final hedged P&L with a **risk measure** (say, the variance of P&L, or the more refined CVaR tail risk), and **backpropagate** to adjust the network's parameters so that this risk is minimized.

After enough rounds, the network **figures out on its own** that seasoned trader's wisdom: stand pat when costs are high and tolerate small residuals, act decisively when costs are low or risk is large. What it learns is not a formula but a **policy.** And Buehler et al.'s key result is: **when transaction costs are non-negligible, the learned policy systematically beats the mechanical BS Delta hedge on the combined "risk + cost" criterion.** The demo on the right uses an extremely simple "cost-aware" policy so you can see intuitively how this gap arises.

**In this lesson we break deep hedging into five pieces:**

- **① The three fairy-tale assumptions of BS Delta hedging, and why they fail**
- **② How transaction costs punish "hedging too diligently"**
- **③ The deep-hedging paradigm: state → action → risk measure, learning a policy end-to-end**
- **④ What it actually learns: trade less when costs are high, tolerate residual risk**
- **⑤ Why it's a big step toward "model-free," and its limits and pitfalls**
`,

  mechanics: `
### ① The three fairy-tale assumptions of BS Delta hedging

Black-Scholes' perfect replication (Stages 3.3, 8.2) relies on three idealized premises, none of which can be dropped:

- **Zero transaction costs**: buying and selling the underlying costs not a cent of friction. In reality there are **bid-ask spreads, commissions, market impact, and slippage** (Stage 10.6), and the option's own spread is quite wide.
- **Continuous rebalancing**: you can adjust your position infinitely often at any instant. In reality you can only hedge **discretely**, and between two adjustments Delta has already drifted, leaving a residual (this is exactly the source of the Gamma term in Stage 8.2).
- **Continuous paths (no jumps)**: the stock price diffuses continuously and doesn't gap. In reality **earnings gaps and black-swan gaps** make Delta hedging fail completely at the moment of the gap — you can't adjust in time.

Put these three back into the real world and **the very concept of "perfect hedging" collapses**: residual risk can't be zeroed, and the option no longer has a unique "replication cost." Hedging turns from a **solving problem** (solve for the unique Delta) into an **optimization/trade-off problem** (find the optimum between risk and cost). BS can't give the answer to this trade-off, because its assumptions contain no "cost" variable at all.

### ② How transaction costs punish "hedging too diligently"

Write transaction costs explicitly into the P&L. Suppose each stock trade costs an amount proportional to the trade size (spread/commission rate k):

$$single-step transaction cost ≈ k · |Δshares| · S

Every rebalance pays such a "toll." So a **direct conflict** arises:

- **More frequent / more precise hedging** → smaller residual directional risk, **but** Δshares is adjusted more often and cumulative transaction costs are higher.
- **Sparser / coarser hedging** → lower transaction costs, **but** net Delta often deviates from 0 and residual risk (P&L volatility) is higher.

This is the core trade-off of **hedging precision vs. transaction cost.** In the zero-cost fairy tale, the answer is "hedge infinitely often"; once k > 0, **"rebalancing precisely to the BS Delta" is no longer optimal** — it is desperately shaving down a risk you could actually tolerate a bit, at an ever-rising cost.

> The key pivot: **with costs, optimal hedging no longer equals "eliminate all Delta," but rather "find the balance between the cost of residual risk vs. the cost of transactions."** That balance point depends on how large k is, how large Gamma is, how far from expiry you are, and how risk-averse you are — a multi-dimensional decision a BS formula can't hold. This is exactly what the machine comes to learn.

### ③ The deep-hedging paradigm: learning a policy end-to-end

Buehler, Gonon, Teichmann, Wood (2019)'s **deep hedging** restates hedging as a **reinforcement-learning-style optimal control problem**, solved end-to-end with a neural network:

- **State** sₜ: the information the network can see at each rebalancing point — current underlying price S, time to expiry τ, **current position** (how many shares already hedged, which is crucial because switching costs money), volatility/market features, and so on.
- **Policy** δ = NN(sₜ): a neural network mapping the state to **the hedging position to hold this step** (or the increment to trade). All actions along the entire path are given by the same network.
- **Environment (simulator)**: a market simulation **with real frictions** — it can be a GBM, a model with jumps, or stochastic volatility (Stage 9.3); **the key is to put transaction costs, discrete time, and jumps in it.**
- **Objective (risk measure)**: for each path, compute the **total P&L at expiry** = option liability + hedge-account P&L − cumulative transaction costs. Then score the whole batch's P&L distribution with a **convex risk measure** — it can be variance (mean-variance), but more modern is **CVaR / expected shortfall** (directly penalizing the left-tail blowups, Stage 8.4).

Training is then: run a large number of paths in the simulator, **minimize this risk measure**, and adjust the network's parameters with **backpropagation / gradient descent.** Once converged, the network is a hedging policy — give it any state and it tells you how many shares to hold.

> One line to grasp the paradigm shift: **the classic route is "price first (solve for Delta), then hedge"; deep hedging is "learn to hedge directly, and the price emerges as a by-product."** It unifies pricing and hedging into the same optimization problem — finding a **truly executable** (cost-aware, discrete) policy under the risk measure you **actually care about.**

### ④ What it actually learns

The most fascinating part: **no one hand-writes the rules, yet the network learns the trader's intuition on its own.** In cost-aware training, these behaviors emerge:

- **Setting a "no-trade band"**: when net Delta is only slightly off, it **simply doesn't trade** — saving the toll and tolerating that small residual. Only when Delta drifts far enough, crossing some boundary, does it act. **The width of this band is set automatically by costs and risk aversion**, which is exactly the conclusion of the classic "banded hedging (Whalley-Wilmott)" theory — and the network learns it **by itself.**
- **The higher the cost, the wider the band**: the more expensive trading is, the lazier it is to move, tolerating a larger residual.
- **More active near expiry / at high Gamma**: Delta drifts fast and risk is large, worth paying a bit more cost to suppress.
- **In the face of jump risk, it may hold a position different from the BS-Delta**: because it optimizes the entire P&L distribution (including the tail), not local first-order neutrality.

The result (Buehler et al.'s core conclusion): **when transaction costs are significant, the deep-hedging policy beats the mechanical BS Delta hedge on the "risk vs. cost" frontier** — either lower cost at the same risk, or smaller tail risk at the same cost. The demo on the right uses a hand-written, extremely simple "cost-aware" rule (stand pat when costs are high) to approximate this idea, and you'll see: at low cost it's almost identical to the BS Delta, **but once cost is high, its P&L mean-variance is clearly better.**

### ⑤ Why it's a big step, and its limits

The real significance of deep hedging is that it is **"model-free / model-agnostic":**

- **It doesn't depend on a specific pricing model to give the Delta** — as long as you can **simulate** paths with all kinds of frictions, jumps, and stochastic volatility, the network can learn to hedge directly, sidestepping the "must have an analytic Delta first" premise.
- **It can hedge exotic, path-dependent structures** (Stage 9.4), which often have no clean hedging formula.
- **It optimizes the risk measure you actually care about** (CVaR tail, cost-aware real P&L), rather than an idealized variance.
- It shares the same "state → action → reward/risk" language as **reinforcement-learning market making/execution (Stage 10.3).**

But you must stay clear-eyed about its **limits and pitfalls**, or you fall back into AI mysticism:

- **It is only optimal inside your simulator.** The learned policy is **highly sensitive** to the simulator's assumptions (volatility structure, jump distribution, cost model) — if the simulator is wrong, the policy is wrong. This is the ever-present **sim-to-real gap (Stage 10.3).**
- **It may overfit** to the market regimes seen during training, and behave unpredictably in unseen states (a true black swan); **interpretability is poor**, making it hard for risk control to audit.
- **It doesn't conjure money from thin air**: transaction costs and jump risk that should lose money still lose money; deep hedging only manages these **unavoidable costs/risks** better, not eliminates them.

> The honest conclusion: **deep hedging is not "AI computed the perfect hedge," but "when the world has frictions and perfect hedging doesn't exist, let the machine learn a better compromise under the criterion you actually care about."** It turns hedging from a formula problem shackled by fairy-tale assumptions back into the trade-off decision a seasoned trader has always made — only handed to a network that can drill it on millions of paths.

Stringing the five pieces together: **BS Delta hedging relies on the fairy tale of zero-cost/continuous/no-jump, all of which fail in reality; with transaction costs, "hedging too diligently" gets bled instead, and optimal hedging becomes a "precision vs. cost" trade-off; deep hedging uses a neural network to learn this trade-off end-to-end in a real-friction simulator under the risk measure you truly care about, spontaneously learning the no-trade-band wisdom of "trade less when costs are high, tolerate the residual," and beating the mechanical Delta when costs exist; it is a big step toward model-free, but is only optimal inside the simulator and is bounded by the sim-to-real gap and overfitting.** In the next lesson, we apply the same "state-action-reward" reinforcement-learning language to market-making quotes and optimal execution (Stage 10.3).
`,

  demo: "deep-hedging",

  analogy: `
Deep hedging is like **learning to drive a manual car down a mountain, rather than clinging to driving-school mantras.**

Driving school teaches you one "perfect" rule (≈ Black-Scholes Delta): **keep the car's speed precisely at some value at all times, and brake to correct the instant it deviates.** On an imaginary, perfectly smooth, infinitely long downhill with brake pads that never wear (≈ the costless, continuous-hedging fairy tale), this rule really is optimal.

But a real mountain road has friction: **every press of the brake wears the pads and "pays a fee" (≈ transaction cost).** A novice who dogmatically follows the mantra, **braking once a second** on a long downhill, reaches the bottom with the pads burned through and their head spinning — they "controlled the speed precisely," but at a brutal cost.

How does an **experienced driver** (≈ the policy learned by deep hedging) drive? They **don't brake so often**: when the speed is only slightly off and the slope isn't too steep, they **ease off and carry it a while** (tolerating residual risk), saving the pads; only when speed drifts far enough, or a sharp curve looms ahead (≈ high Gamma, near expiry, large risk), do they brake firmly. In their head is a **"no-correction band"** — how wide it is depends on how expensive the pads are and how treacherous this stretch is.

And the essence of "deep hedging" is this: **no one writes the experienced driver's judgment into rules to teach the network.** You just let it drive a **friction-laden simulated mountain road** millions of times, scoring each run by "did it get to the bottom safely and economically," and it **figures out that no-correction band on its own** — the more expensive the road, the wider the band; the sharper the curve, the more decisive. What it learns isn't a mantra; it's **judgment.**

> One line: on a fairy-tale road, clinging to the mantra is optimal; but once the road has friction, **an experienced driver who knows "when not to act" beats a novice who corrects constantly** — which is exactly why, when transaction costs exist, deep hedging beats the mechanical Delta hedge.
`,

  misconceptions: [
    "**\"Deep hedging computed the 'perfect hedge' and can eliminate risk.\"** — Exactly the opposite. Its **premise** is precisely to admit that perfect hedging **doesn't exist** in reality (there are costs, discreteness, gaps). What it does is find a better **compromise** on \"risk vs. cost\" under these **unavoidable** frictions — not zero out risk.",
    "**\"Since there's a neural network, you don't need to understand Black-Scholes and Delta anymore.\"** — No. The BS Delta is the **baseline and source of intuition**: the policy deep hedging learns **converges back to the BS Delta** in the zero-cost limit, and forms a \"no-trade band\" around it when costs exist. Without understanding classic hedging (Stage 8.2), you can't judge whether the network learned correctly.",
    "**\"More frequent hedging is of course better — the more frequent, the safer.\"** — Only in the **zero-transaction-cost** fairy tale. Once there are spreads/commissions/slippage, over-frequent rebalancing gets bled by costs; the optimum trades off **residual risk vs. cost**, often appearing as a \"no-trade band\" — act only when Delta drifts outside the band.",
    "**\"The policy deep hedging learns will surely win in the real market.\"** — A dangerous illusion. It is **only optimal inside your simulator**, highly sensitive to the simulator's volatility/jump/cost assumptions; it may fail in unseen states — this is the **sim-to-real gap (Stage 10.3)**. If the simulator is wrong, the policy is wrong; going live demands strict out-of-sample validation and risk control.",
    "**\"Deep hedging is just using AI to predict the stock's direction in order to hedge.\"** — No. It **doesn't predict direction**, and like classic hedging it strips out directional risk; it learns the control policy of **how to adjust the position in a friction-laden world**, optimizing the cost-aware P&L distribution and tail risk (such as CVaR, Stage 8.4), not a directional bet.",
  ],

  quiz: [
    {
      q: "Black-Scholes' \"perfect Delta hedge\" relies on a set of idealized assumptions. Which set **most accurately** summarizes why it fails in reality?",
      options: [
        "Assumes interest rates are zero, dividends are zero, volatility is known",
        "Assumes no transaction costs, the ability to rebalance continuously and nonstop, and continuous price paths with no gaps — and in reality none of the three hold",
        "Assumes investors are risk-neutral and markets are efficient",
        "Assumes options are European and the underlying is a stock",
      ],
      answer: 1,
      explain: "Perfect replication relies on **zero transaction costs + continuous rebalancing + continuous prices (no jumps)**. In reality there are spreads/commissions/slippage, you can only hedge discretely, and prices gap — so residual risk can't be zeroed, \"perfect hedging\" collapses, and hedging turns from a solving problem into a risk-cost **trade-off** problem.",
    },
    {
      q: "In a world with transaction costs, why is \"strictly following the BS Delta, resetting net Delta precisely to 0 every day\" often **not** optimal?",
      options: [
        "Because it makes Delta never equal zero",
        "Because every rebalance pays the spread/commission; the cumulative cost of over-frequent hedging erodes P&L; the optimum trades off residual risk against transaction cost, often appearing as a \"no-trade band\" that tolerates small residuals",
        "Because the BS Delta computes the direction wrong when costs exist",
        "Because transaction costs make Gamma turn negative",
      ],
      answer: 1,
      explain: "Single-step cost ≈ k·|Δshares|·S, and every adjustment pays a toll. The more precise the hedge → the more frequent the trading → the higher the cost. Once k > 0, the optimum is no longer \"eliminate all Delta\" but to **weigh residual risk vs. cost**, usually forming a \"no-trade band\": act only when Delta drifts outside the band.",
    },
    {
      q: "Which description most accurately captures how deep hedging (Buehler et al.) trains the neural network?",
      options: [
        "Train the network on historical data to **predict the stock's direction**, and trade on that basis",
        "First compute the Delta with BS, then have the network fit that Delta",
        "Run a large number of paths in a **simulator with real frictions (cost/discrete/jumps)**, let the network output a hedging action from the state (price/expiry/position…), and **minimize a risk measure** (such as P&L variance or CVaR) to learn the policy end-to-end",
        "Buy and sell stock randomly until a no-loss combination is stumbled upon",
      ],
      answer: 2,
      explain: "Deep hedging treats hedging as **optimal control**: state → (neural network) → hedging position, run paths in a simulator with cost/discreteness/jumps, score the P&L distribution with a **convex risk measure** (variance, CVaR/expected shortfall), and backpropagate. It **doesn't predict direction**, and the price emerges as a by-product of the hedging optimization.",
    },
    {
      q: "Regarding the policy deep hedging learns, which statement is **incorrect**?",
      options: [
        "The higher the transaction cost, the wider the \"no-trade band\" it tends to set, tolerating a larger residual to save cost",
        "In the zero-cost limit, it converges back to the classic BS Delta hedge",
        "It is sure to win in the real market, because it is an optimal policy learned by AI",
        "It is only optimal under the assumptions of the simulator it trained on; there is a sim-to-real gap, and it is sensitive to the simulator's cost/jump assumptions",
      ],
      answer: 2,
      explain: "\"Sure to win in the real market\" is the wrong illusion. Deep hedging is **only optimal inside its simulator**, highly sensitive to the volatility/jump/cost assumptions, and may fail in unseen states (the **sim-to-real gap**, Stage 10.3). The other three are all correct: high cost → wider band, zero cost → back to BS Delta, and it needs strict validation and risk control.",
    },
  ],

  further: [
    { label: "Buehler, Gonon, Teichmann, Wood (2019): Deep Hedging (the original paper)", url: "https://arxiv.org/abs/1802.03042" },
    { label: "Quantitative Finance: Deep Hedging (journal version)", url: "https://www.tandfonline.com/doi/full/10.1080/14697688.2019.1571683" },
    { label: "Whalley & Wilmott: the \"no-trade band\" asymptotic theory of hedging with transaction costs", url: "https://onlinelibrary.wiley.com/doi/10.1111/1467-9965.00034" },
  ],
};
