export default {
  id: "rl-market-making",
  stage: 10,
  order: 3,
  title: "RL for Market Making & Optimal Execution",
  difficulty: 3,
  prereqs: ["dealer-flows"],

  oneLiner:
    "Market making and large-order execution are both, at their core, **a chain of interconnected decisions**: what price to quote, how much to offload now, when to leave the rest. This is exactly **reinforcement learning (RL)**'s home turf — an agent observes a **state** (inventory, price, spread, time remaining), chooses an **action** (a quote or child-order size), receives a **reward** (P&L minus a risk penalty), and learns a policy through trial and error. The classic solutions (market making's **Avellaneda-Stoikov**, execution's **Almgren-Chriss**) give beautiful mathematical benchmarks, while RL can approach the optimum in more complex, more realistic environments — just don't forget the unavoidable **sim-to-real gap (Stage 10.2)**.",

  intuition: `
Back in Stage 8.5 we saw that a market maker doesn't bet on direction — they **quote a bid and an ask, earn the spread, and manage inventory with Delta hedging.** But hidden here is a puzzle we never spelled out: **where exactly should they place the bid and the ask?** Quote too tight (close to the mid) and you fill fast and earn more, but the risk of inventory piling up out of control is large; quote too wide and you're safe but no one trades with you and you earn no spread. And every fill **changes their inventory**, so the next moment's optimal quote has to change with it. **This is an interlocking, continuously-changing sequential decision problem.**

Now look at another scenario: you (or a fund) need to **sell a large position** — say 100,000 shares, or a big batch of options. Dump it all out in one market order? You'll **smash through** the price and eat enormous **market impact cost (Stage 10.6)** yourself. So sell slowly, breaking it into many small orders spread over several hours? Impact is smaller, but the longer you drag it out, the greater the risk of a random price **drift** — if the market crashes midway, the unsold portion takes a huge loss; this is **timing risk.** **So you face a classic trade-off: sell too fast → high impact cost; sell too slow → high timing risk. The optimal selling pace lies between the two.**

Spotted the shared skeleton of these two problems?

- Both are **sequential decisions**: this step's choice changes the next step's situation (a fill changes inventory; selling changes the remaining quantity and the price).
- Both have a **state**: current inventory, price, spread, how much time/quantity is left.
- Both must **trade off return against risk**: earning the spread / saving on impact vs. inventory risk / timing risk.
- Neither has a **simple one-shot formula** — you have to plan an entire path.

This kind of problem — "make decisions sequentially in a changing environment to maximize long-run return" — is exactly what the machine-learning paradigm of **reinforcement learning (RL)** was born to solve. Its language fits perfectly:

- **Agent** = the market maker / the execution algorithm;
- **State** = inventory, price, spread, time remaining…
- **Action** = what bid/ask to quote / how many shares to offload this step;
- **Reward** = the spread earned or cost saved, **minus** a penalty for inventory or timing risk;
- **Policy** = the mapping from "state" to "action," which is what the agent has to learn.

The agent does trial and error repeatedly in a **market simulator**: it tries different quotes/selling paces, watches the long-run cumulative reward, and gradually learns a good policy. And before RL arrived, academia had already solved two **benchmark solutions** with elegant stochastic optimal control: market making's **Avellaneda-Stoikov** and optimal execution's **Almgren-Chriss.** They assume idealized conditions, can be solved analytically, and are the gold standard for understanding the structure of the problem; RL then **approaches** the optimum in the real complexity they can't reach (nonlinear impact, a discrete order book, adversarial behavior).

But keep one sentence carved in mind throughout: **all of this optimality holds only inside the "simulator."** The gap between the simulator and the real market (the sim-to-real gap) is RL's biggest roadblock in trading — we'll detail this at the end.

**In this lesson we break RL market making and execution into five pieces:**

- **① Translating the problem into RL: state / action / reward / policy**
- **② Market making: the quoting intuition of Avellaneda-Stoikov (how inventory shifts the quote)**
- **③ Optimal execution: Almgren-Chriss's "impact vs. timing" trade-off**
- **④ Why RL fits: sequential, long-horizon, can approach the optimum in complex environments**
- **⑤ The sim-to-real gap: RL's biggest pitfall in real trading**
`,

  mechanics: `
### ① Translating the problem into the language of RL

Reinforcement learning studies the **Markov decision process**: in state sₜ the agent chooses action aₜ, the environment returns reward rₜ and transitions to a new state sₜ₊₁, and the goal is to maximize **long-run cumulative reward** (not just the immediate step). Fit market making/execution into it:

- **State s**: the observable market and own situation — **inventory (position)**, current price, **bid-ask spread**, order-book depth, **time remaining**, quantity left to execute, recent volatility, and so on. Inventory and time remaining are almost always core state variables.
- **Action a**: in market making, the **bid/ask quoted** (the offset from the mid, i.e., the half-spread); in execution, the **child-order size to send in this time slice.**
- **Reward r**: the economic gain realized this step **minus a risk penalty.** Market making: spread earned − λ·inventory², an **inventory penalty** (the bigger the inventory, the more dangerous); execution: the impact cost saved/paid this step, with a penalty on the final unexecuted quantity or P&L variance.
- **Policy π(s)→a**: the "see the state, output an action" function the agent has to learn. RL's goal is to find the **optimal policy π\* that maximizes long-run reward.**

> One line to place it: **market making and execution are not "predict the price" but "sequentially choose quotes or child orders under constantly-changing inventory/time constraints, trading off return against risk."** This sequential + trade-off + long-horizon structure is exactly where RL (rather than ordinary supervised learning) earns its keep.

### ② Market making: the quoting intuition of Avellaneda-Stoikov

**Avellaneda-Stoikov (2008)** is the classic stochastic-control solution for market making. It answers "where to place the bid and ask," with two core intuitions, both deeply consistent with trading common sense:

- **Quote around a "reservation price," not the mid.** When your **inventory is positive (you're long extra stock)**, you fear it keeps rising (you'd buy too dear) and fear it falling even more, so you shift your quotes **down across the board** — more eager to sell, more reluctant to buy, to push inventory back toward neutral. Negative inventory shifts the other way, up. **Reservation price = mid − (inventory × risk aversion × volatility² × time remaining)**; inventory pulls the center of your quotes toward the "able-to-offload" direction.
- **The spread (how wide to quote) depends on risk aversion, volatility, and time remaining, plus order-arrival intensity.** The more risk-averse you are and the higher the volatility, the wider the spread you quote (you demand more compensation); when you must clear inventory near the close, the behavior changes accordingly.

Wire it back to Stage 8.5: a market maker's quotes aren't static but **shift dynamically with inventory** — this is exactly the micro-mechanism of "inventory management." Avellaneda-Stoikov gives it a clean closed-form approximation. RL's role is, when real order books, nonlinear impact, counterparties sniping for the same orders, and the like make the closed-form solution fail, to **learn a better-fitting quoting policy directly from simulated interaction.**

### ③ Optimal execution: Almgren-Chriss's "impact vs. timing"

**Almgren-Chriss (2000)** is the cornerstone of optimal execution, turning that intuitive trade-off into optimizable mathematics. To sell X shares within time T, split the total cost into two parts:

$$total execution cost ≈ market impact cost (selling too fast) + timing risk (selling too slow, the variance of price drift)

- **Market impact cost**: the larger the quantity you sell per time slice, the larger the **impact** on the price (temporary impact is often modeled as proportional/superlinear to the selling rate). **The harder you slam it, the lower you push your own price, and the more you lose.**
- **Timing risk**: the longer execution drags on, the greater the uncertainty from random price moves over that period (variance ∝ holding time). **The slower you sell, the longer you're exposed to the market turning on you.**

The optimal solution balances the two, giving an **optimal execution trajectory**: usually selling **front-loaded then slowing, or steadily decreasing** (depending on risk aversion). Two famous extremes are the endpoints of this trade-off:

- **TWAP (time-weighted average)**: spread the order **evenly** across each time slice — simple, robust, the special case of Almgren-Chriss under risk neutrality.
- **VWAP (volume-weighted average)**: allocate by the market's **volume rhythm** — send more when volume is high, less when low — aiming to track the market's average price.
- **Implementation shortfall**: optimize directly against the difference between "the decision price vs. the actual average fill price" — Almgren-Chriss's true colors.

> One line to grasp it: **optimal execution = planning a selling-pace curve between "the impact cost of slamming the market" and "the timing risk of dragging it out."** Slamming it all at once has the most impact and the least timing risk; selling infinitely slowly is the reverse; the optimum is in the middle. The demo on the right lets you switch between "slam at once / steady TWAP / adaptive" and see this trade-off with your own eyes.

### ④ Why RL fits

The classic solutions are elegant, but all rest on **idealized assumptions** (linear/simple impact, the price is Brownian motion, no adversarial counterparties). The real market is a discrete limit-order book, impact is nonlinear and has memory, and other algorithms are playing against you. Here RL's advantages show:

- **Inherently sequential, oriented to the long run**: RL optimizes exactly the **cumulative reward over the entire path**, not a one-step local optimum — completely isomorphic to "planning an execution/quoting trajectory."
- **Can handle complex, nonlinear, analytically intractable environments**: as long as you can **simulate** (or replay historical order books), RL can learn from interaction, sidestepping the "must have a closed-form solution" constraint (same lineage as deep hedging, Stage 10.2).
- **Can incorporate the real state**: order-book depth, recent flow, and volatility regime can all be stuffed into the state vector, letting the policy adapt to market conditions — exactly where "adaptive execution" beats rigid TWAP.
- **A unified framework**: market making, execution, and hedging (Stage 10.2) can all be expressed with the same "state-action-reward," sharing algorithms (policy gradient, Q-learning, actor-critic, etc.).

In practice, a **hybrid** is common: use Almgren-Chriss / Avellaneda-Stoikov as a **benchmark and prior**, and have RL learn a **residual-style adaptive adjustment** on top (deviate from the benchmark to grab a little when conditions are good, return to the robust benchmark when they're bad). Pure black-box RL going straight to production is rare and dangerous.

### ⑤ The sim-to-real gap: the biggest pitfall

This is the one most worth carving into your bones in the whole lesson, or you easily fall into the illusion that "RL can win the market lying down." **The policy RL learns is only optimal in the very simulator it trained on.** And a trading simulator is extremely hard to get right:

- **Market impact is hard to model**: your real orders **change** the market (others react, follow, hunt against you), while most simulators treat the market as a "replay" unaffected by you, severely underestimating real impact. Once live, the "free lunch" the policy learned often evaporates.
- **Non-stationarity**: market structure, volatility, and participants change. An optimal market-making policy learned on 2019 data could fail catastrophically in March 2020 (distribution drift).
- **Counterparties are adaptive**: you're not playing against a static environment but against other algorithms that **learn and adversarially adapt** — beyond the assumptions of standard single-agent RL.
- **Overfitting and fragility**: RL very easily overfits the simulator's quirks and behaves unpredictably in unseen states; interpretability is poor, making risk control and compliance hard to audit.
- **Sample efficiency and stability**: training may need vast interaction, be sensitive to hyperparameters, and be hard to reproduce.

> The honest conclusion: **RL is a powerful tool for market making and execution, already adopted in practice by the industry (including big banks and market makers), but it is not turning lead into gold.** Its value lies in **approaching optimal control in complex, real environments and making more adaptive decisions than static rules**; its danger lies in the **sim-to-real gap** — if the simulator is wrong, the policy is wrong. **Anchor your intuition with the classic solutions, use RL for adaptive increments, and backstop with strict out-of-sample and small-size live validation** — that is the responsible posture.

Stringing the five pieces together: **market making and execution are both 'state (inventory/price/spread/time remaining) → action (quote/child order) → reward (return − risk penalty)' sequential decisions; the classic solutions Avellaneda-Stoikov (inventory pulls quotes toward offloading) and Almgren-Chriss (the impact vs. timing trade-off, with TWAP/VWAP/implementation shortfall as special cases) give gold-standard benchmarks; RL approaches the optimum in more complex, real environments and makes adaptive decisions, sharing the same language as deep hedging (Stage 10.2); but it is only optimal inside the simulator, and the sim-to-real gap is the biggest pitfall.** In the next lesson we turn to another class of signal source — mining alpha from news and earnings text (Stage 10.4).
`,

  demo: "rl-execution",

  analogy: `
Optimal execution is like **selling off a warehouse of ice cream before a blizzard hits.**

You have **a huge batch of ice cream** (= a large position to sell) and must clear it **before nightfall** (= the execution deadline T). Both extremes are terrible:

- **Dump it all at once (= a market order slamming the book)**: you rush to the square shouting "Everything half price!" — yes, cleared in minutes, **no risk of dragging on (timing risk minimized).** But you've **smashed your own selling price**: buyers see you're desperate to dump and lowball you in droves, and you bleed badly. This is **market impact cost** — your very act of selling pushes the price down.
- **Sell one cone at a time (= infinitely slow)**: you tend your stall, selling one cone at a time at a good price, **barely depressing the price (minimal impact).** But it's too slow — **the blizzard could strike early at any moment** (= a random price crash), and by then half the warehouse of ice cream is still piled up and melts, a huge loss. This is **timing risk**: the longer you drag it out, the longer you're exposed to the weather turning.

What does a smart vendor (= optimal execution / Almgren-Chriss) do? **Find a pace between the two**: open a few stalls and offload steadily at a rate that doesn't depress prices much, balancing "don't smash the price" against "don't drag on until the weather turns," computing an **optimal offloading curve** (often fast at first, then slower).

And the **"adaptive"** setting goes a step further, like a **weather-watching, seasoned vendor**: they **watch the sky (= the market state: volatility, depth, flow)** and adjust constantly — lay out more when it's still clear and buyers are eager; accelerate the clearance the moment dark clouds gather and the buying thins. **They don't follow a rigid predetermined curve but decide sequentially based on the situation at hand** — exactly what **reinforcement learning** learns: an adaptive policy from "state" to "action," with the goal of the **highest total return and lowest total risk** for the whole sell-off.

> One line: dumping at once saves timing risk but bleeds on impact; selling slowly saves impact but gambles on the weather; **optimal execution plans a pace between the two, and RL makes that pace "read the sky and act."**
`,

  misconceptions: [
    "**\"Market-making/execution algorithms are just predicting whether the price goes up or down.\"** — No. They **don't bet on direction**; they solve a **sequential control** problem: under inventory and time-remaining constraints, trading off 'earn the spread / save on impact' against 'inventory risk / timing risk,' and planning a quoting or selling pace. RL optimizes this policy, not a directional forecast.",
    "**\"To sell a large order, either dump it all at once or sell as slowly as possible — there's nothing to it.\"** — Both are terrible extremes. Slamming = maximizing impact cost; infinitely slow = maximizing timing risk. **The optimum is in the middle**: Almgren-Chriss finds an optimal trajectory between 'impact vs. timing,' and TWAP/VWAP are common special cases (Stage 10.6).",
    "**\"A market maker's bid and ask are placed symmetrically and fixed on either side of the mid.\"** — No. Quotes **shift dynamically with inventory**: positive inventory shifts everything down (eager to offload), negative shifts up. Avellaneda-Stoikov's 'reservation price' pulls the center of the quotes toward the direction that reduces inventory risk, while the spread width varies with volatility and risk aversion (Stage 8.5).",
    "**\"RL made a killing in simulation, so it'll steadily crush the market once live.\"** — The most dangerous illusion. RL is only optimal in its **simulator**, and trading simulation is extremely hard to get right: real orders **change the market** (impact is underestimated), the market is **non-stationary**, and counterparties **adapt.** This is the **sim-to-real gap** — if the simulator is wrong, the policy is wrong; it must be backstopped by small-size live and out-of-sample validation.",
    "**\"With RL, you no longer need classic models like Almgren-Chriss / Avellaneda-Stoikov.\"** — Exactly the opposite. The classic solutions are the **intuition anchor and benchmark/prior**: understanding the problem structure, serving as RL's starting point and backstop. In practice it's mostly a **hybrid** — classic solution as the base, RL learning the adaptive increment; pure black-box RL going straight to production is both rare and dangerous.",
  ],

  quiz: [
    {
      q: "Expressing \"optimal execution (selling a large position within a fixed time)\" as a reinforcement learning problem, which set of correspondences fits best?",
      options: [
        "State = up or down tomorrow; action = buy or sell; reward = guessing direction right",
        "State = remaining quantity to sell / price / time remaining / volatility, etc.; action = how much to sell this time slice; reward = the return realized this step minus penalties for impact and timing risk",
        "State = the option Greeks; action = exercise or not; reward = intrinsic value",
        "State = interest rate; action = adjust Black-Scholes parameters; reward = pricing error",
      ],
      answer: 1,
      explain: "Execution is **sequential control**: the state includes **remaining quantity, price, time remaining**, etc., the action is **how large a child order to send this slice**, and the reward is the return realized **minus** penalties for market impact and timing risk. The goal is to maximize the cumulative reward over the **entire path** — exactly RL's structure (not directional prediction).",
    },
    {
      q: "In the Almgren-Chriss framework, when selling a large position, what is the main cost of \"selling too fast\" versus \"selling too slow\"?",
      options: [
        "Too fast = high timing risk; too slow = high impact cost",
        "Too fast = high market impact cost; too slow = high timing risk (the uncertainty of price drift)",
        "Both only add commissions, with no other difference",
        "Too fast = high Theta decay; too slow = high Vega decay",
      ],
      answer: 1,
      explain: "**Sell too fast → high market impact cost** (you smash your own price); **sell too slow → high timing risk** (the longer you're exposed to random price drift, the greater the variance). Optimal execution finds a balanced trajectory between the two; TWAP (even), VWAP (by volume), and implementation shortfall are all schemes on this trade-off (Stage 10.6).",
    },
    {
      q: "Regarding the Avellaneda-Stoikov market-making model, which statement best matches its core intuition?",
      options: [
        "The bid and ask are always placed symmetrically on both sides of the mid and don't change with inventory",
        "When the market maker's inventory is positive (long extra stock), the quotes shift down across the board to be more eager to sell and less to buy, pushing inventory back to neutral; the spread width varies with volatility and risk aversion",
        "The market maker should predict the price direction and quote one-sided on that basis",
        "The larger the inventory, the tighter they should quote to fill more quickly",
      ],
      answer: 1,
      explain: "Its core is the **reservation price** shifting with inventory: positive inventory → the center of quotes shifts down (eager to offload), negative → shifts up; the spread is set by risk aversion, volatility, time remaining, etc. This is the micro-mechanism by which a market maker **manages inventory with quotes** (Stage 8.5), not predicting direction or just quoting tight.",
    },
    {
      q: "Why is the sim-to-real (simulation-to-reality) gap said to be RL's biggest pitfall in real trading?",
      options: [
        "Because the real market's commissions are lower than the simulator's",
        "Because the policy RL learns is only optimal in the simulator it trained on, while real orders change the market (impact is underestimated), the market is non-stationary, and counterparties adapt — so the edge seen in simulation often evaporates once live",
        "Because RL is sure to learn nothing useful in simulation",
        "Because the real market has no concept of inventory or spread",
      ],
      answer: 1,
      explain: "RL's optimality is **bound to the simulator's assumptions.** Trading simulation is extremely hard to get right: your real orders **change** the market (most simulations treat it as an unaffected replay and underestimate impact), the market is **non-stationary**, and counterparties **learn and adversarially adapt.** So the edge from simulation easily evaporates live — it must be backstopped by the classic solutions and validated with small-size live and out-of-sample testing (Stages 10.2, 9.6).",
    },
  ],

  further: [
    { label: "Avellaneda & Stoikov (2008): High-frequency trading in a limit order book (the market-making classic)", url: "https://www.math.nyu.edu/~avellane/HighFrequencyTrading.pdf" },
    { label: "Almgren & Chriss (2000): Optimal Execution of Portfolio Transactions (the cornerstone of optimal execution)", url: "https://www.smallake.kr/wp-content/uploads/2016/03/optliq.pdf" },
    { label: "Investopedia: TWAP / VWAP (execution benchmarks)", url: "https://www.investopedia.com/terms/v/vwap.asp" },
  ],
};
