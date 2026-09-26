---
id: rl-market-making
prereqs: market-makers, execution-tca, deep-hedging
demo: rl-market-making
---

# Reinforcement Learning for Market Making & Execution

## @hook
A market maker has to choose two numbers, a bid and an ask, and choose them again after every fill, because every fill changes its inventory. Avellaneda and Stoikov solved a clean version of this problem with a formula in 2008. Reinforcement learning tries to learn the answer by trial and error instead. In our test the learner only *matches* the formula in the formula's own world — and beats it when the world has a feature the formula leaves out.

## @bridge
[[market-makers]] showed dealers quoting around a fair value, managing inventory and losing to informed flow, and previewed the Avellaneda–Stoikov reservation price. [[execution-tca]] measured what trading costs and introduced the Almgren–Chriss trade-off between impact and risk. [[deep-hedging]] treated hedging as a policy to be optimized. This lesson takes the last step: problems where **each action changes the situation the next action faces** — the home ground of reinforcement learning (RL). It builds Idea ④ (risk: inventory is risk you did not choose, and the quote is how you manage it).

## @intuition
Start with a trade you have seen from Kai's side.

> [!KAI] Kai's covered call lands in someone's inventory
> Kai sells the XYZ 30-day 105 call for $0.71 to write a covered call. The market maker who buys it is now long a call it did not ask for. Until that risk is hedged or offset, the dealer would rather *sell* than buy more — so it nudges both its bid and its ask down a little. The next seller gets a slightly worse price; the next buyer a slightly better one. That nudge, repeated after every fill, is the whole problem of this lesson.

A market maker quoting all day faces three forces at once:

- **Earn the spread.** Quote close to the mid price and you trade often, earning a little each time. Quote far away and you rarely trade.
- **Control inventory.** Every fill adds to or subtracts from your position. A big position loses money when the price moves against it.
- **Avoid being picked off.** Some counterparties know something. They trade with you just before the price moves against you — **adverse selection**.

The choice is *sequential*: today's quote decides which fills you get, the fills decide your inventory, and the inventory decides tomorrow's best quote. There is no single “right quote”; there is a right **rule** for choosing quotes in every situation. In RL language that rule is a **policy**, and RL is a family of methods for learning a policy from experience.

<figure>
<svg viewBox="0 0 680 250" role="img" aria-label="The reinforcement-learning loop for a market maker">
<defs><marker id="rl-market-making-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="30" y="80" width="200" height="90" rx="10" class="fx-hl"/>
<text x="130" y="110" text-anchor="middle" class="fx-t-b">Agent (market maker)</text>
<text x="130" y="130" text-anchor="middle" class="fx-t-sm">policy: state → quotes</text>
<text x="130" y="148" text-anchor="middle" class="fx-t-sm">learns a table Q(state, action)</text>
<rect x="440" y="80" width="210" height="90" rx="10" class="fx-box2"/>
<text x="545" y="110" text-anchor="middle" class="fx-t-b">Environment (market)</text>
<text x="545" y="130" text-anchor="middle" class="fx-t-sm">orders arrive, some fill,</text>
<text x="545" y="148" text-anchor="middle" class="fx-t-sm">the mid price moves</text>
<path d="M230,100 C320,40 360,40 440,100" class="fx-line" fill="none" marker-end="url(#rl-market-making-ah)"/>
<text x="335" y="42" text-anchor="middle" class="fx-t-hl">action: bid and ask offsets</text>
<path d="M440,150 C360,210 320,210 230,150" class="fx-line" fill="none" marker-end="url(#rl-market-making-ah)"/>
<text x="335" y="218" text-anchor="middle" class="fx-t-ok">reward: spread earned − inventory penalty</text>
<text x="335" y="236" text-anchor="middle" class="fx-t-sm">new state: inventory q, time left</text>
<rect x="430" y="68" width="230" height="114" rx="14" class="fx-line-muted fx-dash" fill="none"/>
<text x="545" y="52" text-anchor="middle" class="fx-t-bad">simulated ≠ real (sim-to-real gap)</text>
</svg>
<figcaption>Figure 1 · The loop RL learns from. The agent quotes, the market answers with fills and price moves, and the agent receives a reward and a new state. Repeat millions of times in a simulator. The dashed outline is the catch: the agent learns about the simulated market, not the real one.</figcaption>
</figure>

Before RL arrived, the problem had a mathematical answer for a stylized market. **Avellaneda and Stoikov (2008)** assumed the mid price wanders randomly, that the chance of a fill falls off exponentially as your quote moves away from the mid, and that the dealer is risk-averse about its end-of-day wealth. Their solution has two parts: shift the centre of your quotes away from the mid in proportion to your inventory, and set the width from your risk aversion and how quickly fills dry up.

In the main demo, a tabular **Q-learning** agent plays 20,000 simulated trading sessions — four million quoting decisions — and learns only from its rewards. In the model's own world it ends up within about 1% of the formula, never clearly ahead. In a world where every fill is followed by a price move against the dealer (“toxic” flow), it learns to quote wider and beats the formula by about 19%.

> [!THINK] In the Avellaneda–Stoikov model's own simulated world, should a well-trained RL agent beat the formula?
> Predict before you open the answer.
> ---
> No — at best it should tie. The formula is (approximately) optimal *for that exact world*, so the most any learner can do is rediscover it. Our agent reaches a risk-adjusted P&L of 64.3 per session against the formula's 64.7. When a learner “beats” an optimal benchmark inside the benchmark's own model, suspect a bug, noise or a different scoring rule before you suspect genius.

We'll take it in five parts:

- **① RL in one page: states, actions, rewards, Q-learning**
- **② The Avellaneda–Stoikov baseline**
- **③ The experiment: when learning helps and when it cannot**
- **④ Execution: Almgren–Chriss and RL**
- **⑤ Sim-to-real, reward hacking and what the evidence shows**

## @mechanics
### ① RL in one page: states, actions, rewards, Q-learning

RL problems are described as a **Markov decision process**: at each step the agent sees a **state** \(s\), picks an **action** \(a\), receives a **reward** \(r\) and lands in a new state \(s'\). The goal is to maximize the total reward over time, not just the next one. In the demo:

- **state** = the dealer's inventory \(q\), from −8 to +8 shares;
- **action** = one of 28 quote pairs: four half-spreads (0.6, 0.9, 1.2, 1.5) times seven skews that shift both quotes up or down;
- **reward** per step = spread earned on fills − losses from adverse moves − an inventory penalty \(\tfrac12\gamma\sigma^2 q^2\,\Delta t\).

**Q-learning** keeps a table \(Q(s, a)\): an estimate of the total future reward from taking action \(a\) in state \(s\) and acting well afterwards. After every step it nudges the entry toward what just happened:

$$
Q(s,a) \leftarrow Q(s,a) + \alpha\Big[\, r + \beta \max_{a'} Q(s', a') - Q(s,a) \,\Big]
$$

where \(\alpha\) is the learning rate (how far to move the estimate, here shrinking from 1 toward 0.01 as a cell is visited more), \(\beta = 0.99\) is the discount factor (how much tomorrow's rewards count today), and the bracket is the **surprise**: the reward just received plus the best value available from the new state, minus what the table expected.

> [!EXAMPLE] One update
> The agent holds \(q = +2\) and its table says \(Q = 8.00\) for quoting “half-spread 0.9, both quotes shifted 0.4 down” there. That action means a bid 1.3 below the mid and an ask only 0.5 above it — keen to sell. The ask is lifted, earning 0.5; inventory drops to +1, and the step's inventory penalty is \(\tfrac12 \times 0.1 \times 4 \times 1^2 \times 0.005 = 0.001\), so \(r = 0.499\). At \(q = +1\) the best action is worth 7.10. With \(\alpha = 0.05\): the surprise is \(0.499 + 0.99 \times 7.10 - 8.00 = -0.472\), so the entry becomes \(8.00 + 0.05 \times (-0.472) = 7.976\). The action did a little worse than the table expected, so its value is marked down a little. Four million such nudges make the table.

To learn, the agent must also *explore*: early on it picks random actions most of the time, later almost always the best-known one (an “ε-greedy” schedule, ε falling from 100% to 5%). Exploration is expensive in a simulator and unthinkable with real money — one reason RL for trading lives in simulators.

### ② The Avellaneda–Stoikov baseline

Avellaneda and Stoikov modeled fills with an intensity that decays exponentially in the distance \(\delta\) between your quote and the mid price, \(\lambda(\delta) = A e^{-k\delta}\), and found that the optimal quotes centre on a **reservation price** \(r\), with a total spread that does not depend on inventory:

$$
r = s - q\,\gamma\sigma^2(T - t), \qquad \delta^a + \delta^b = \gamma\sigma^2(T - t) + \frac{2}{\gamma}\ln\!\Big(1 + \frac{\gamma}{k}\Big)
$$

where \(s\) is the mid price, \(q\) the inventory (positive = long), \(\gamma\) the dealer's risk aversion, \(\sigma\) the volatility of the mid price per unit of time, \(T - t\) the time left in the session, \(k\) how fast fills dry up as you quote wider, and \(\delta^a, \delta^b\) the distances of the ask and the bid from the mid price, so their sum is the total spread. The two quotes sit half that spread either side of \(r\). In words: **inventory moves the centre, risk and fill rates set the width.**

> [!EXAMPLE] The demo's market at the open
> \(s = 100,\ \sigma = 2,\ \gamma = 0.1,\ k = 1.5,\ T - t = 1\).
> Width: \(0.1 \times 4 \times 1 + \tfrac{2}{0.1}\ln(1 + 0.1/1.5) = 0.40 + 1.29 = 1.69\), so the half-spread is 0.845.
> Flat (\(q = 0\)): bid 99.155, ask 100.845.
> Long two shares (\(q = +2\)): \(r = 100 - 2 \times 0.1 \times 4 \times 1 = 99.20\); bid \(99.20 - 0.845 = 98.355\), ask \(99.20 + 0.845 = 100.045\) — the ask sits almost at the mid, eager to sell; the bid is far away, reluctant to buy more.

<figure>
<svg viewBox="0 0 660 230" role="img" aria-label="Avellaneda-Stoikov quotes for three inventory levels">
<line x1="370" y1="20" x2="370" y2="68" class="fx-line-muted fx-dash"/>
<line x1="370" y1="100" x2="370" y2="128" class="fx-line-muted fx-dash"/>
<line x1="370" y1="160" x2="370" y2="188" class="fx-line-muted fx-dash"/>
<text x="370" y="14" text-anchor="middle" class="fx-t-sm">mid 100</text>
<text x="20" y="60" class="fx-t-b">q = −2</text>
<line x1="120" y1="56" x2="620" y2="56" class="fx-axis"/>
<circle cx="366" cy="56" r="6" class="fx-fill-green"/>
<circle cx="535" cy="56" r="6" class="fx-fill-red"/>
<line x1="450" y1="44" x2="450" y2="68" class="fx-line-blue"/>
<text x="366" y="82" text-anchor="middle" class="fx-t-ok">bid 99.96</text>
<text x="535" y="82" text-anchor="middle" class="fx-t-bad">ask 101.65</text>
<text x="450" y="82" text-anchor="middle" class="fx-t-blue">r = 100.80</text>
<text x="20" y="120" class="fx-t-b">q = 0</text>
<line x1="120" y1="116" x2="620" y2="116" class="fx-axis"/>
<circle cx="286" cy="116" r="6" class="fx-fill-green"/>
<circle cx="455" cy="116" r="6" class="fx-fill-red"/>
<line x1="370" y1="104" x2="370" y2="128" class="fx-line-blue"/>
<text x="370" y="142" text-anchor="middle" class="fx-t-blue">r = 100</text>
<text x="286" y="142" text-anchor="middle" class="fx-t-ok">bid 99.16</text>
<text x="455" y="142" text-anchor="middle" class="fx-t-bad">ask 100.85</text>
<text x="20" y="180" class="fx-t-b">q = +2</text>
<line x1="120" y1="176" x2="620" y2="176" class="fx-axis"/>
<circle cx="206" cy="176" r="6" class="fx-fill-green"/>
<circle cx="375" cy="176" r="6" class="fx-fill-red"/>
<line x1="290" y1="164" x2="290" y2="188" class="fx-line-blue"/>
<text x="206" y="202" text-anchor="middle" class="fx-t-ok">bid 98.36</text>
<text x="375" y="202" text-anchor="middle" class="fx-t-bad">ask 100.05</text>
<text x="290" y="202" text-anchor="middle" class="fx-t-blue">r = 99.20</text>
<text x="120" y="222" class="fx-t-sm">97.5</text>
<text x="620" y="222" text-anchor="end" class="fx-t-sm">102.5</text>
</svg>
<figcaption>Figure 2 · Avellaneda–Stoikov quotes at the open for three inventories. The pair of quotes keeps the same width (1.69) but slides: long inventory pushes it down (sell more, buy less), short inventory pushes it up. The violet tick is the reservation price — what the position is "worth to this dealer" given its risk.</figcaption>
</figure>

::demo[rl-market-making-as]

The formula is a baseline, not a trading system. It assumes a random-walk price, one instrument, fills that depend only on distance, and no informed traders. Real dealers — especially options dealers, who quote hundreds of strikes and hedge with the underlying ([[market-makers]]) — face a much messier world. That mess is exactly where learning methods hope to help.

### ③ The experiment: when learning helps and when it cannot

The main demo tests the agent on 1,000 fresh sessions (different random numbers from training) and reports mean P&L, its standard deviation, the risk-adjusted P&L (P&L minus the accumulated inventory penalty, the score everyone is trying to maximize) and the average inventory left at the close:

| World and policy | Mean P&L | Std. dev. | Risk-adjusted | Closing \(\lvert q\rvert\) |
|---|---|---|---|---|
| AS world · symmetric quote (ignores inventory) | 66.2 | 11.2 | 62.6 | 4.17 |
| AS world · AS formula | 65.1 | 6.6 | **64.7** | 2.38 |
| AS world · Q-learning, 20,000 sessions | 65.2 | 6.8 | 64.3 | 1.67 |
| Toxic world · AS formula | 31.3 | 7.1 | 30.9 | 2.38 |
| Toxic world · Q-learning, 20,000 sessions | 37.2 | 6.1 | **36.8** | 1.09 |

Three lessons sit in this table.

- **Inventory control is the point of the formula.** The symmetric quote makes slightly more on average but with nearly twice the risk; after the penalty the formula wins.
- **In the model's own world, learning only catches up.** After 20,000 sessions the agent is within 1% of the formula. After 5,000 it is well behind (57.8) and its policy is erratic.
- **Learning helps where the model is wrong.** In the toxic world, every fill is followed by a 0.8 move against the dealer. The formula does not know, keeps its half-spread at 0.75 mid-session and is picked off. The agent, learning only from rewards, widens its flat-inventory half-spread to 0.9 and earns about 19% more.

> [!WARN] What the agent “discovered” was one missing line
> A human who measured the toxicity — how far the price moves after the dealer's fills — could widen the formula's quotes by hand and recover most of the gap. RL did not find new economics; it compensated for a feature the model left out, without being told what the feature was. That is valuable when the missing features are many and hard to name, and unimpressive when one line of analysis would do.

### ④ Execution: Almgren–Chriss and RL

The same trade-off appears when a fund must *sell* a large position. Sell it all now and you push the price down (impact cost); sell slowly and the price may drift against you (risk). [[execution-tca]] derived the Almgren–Chriss (2000) answer, which minimizes expected cost plus \(\lambda\) times its variance: hold \(x(t) = X\sinh\big(\kappa(T-t)\big)/\sinh(\kappa T)\) shares at time \(t\), with \(\kappa = \sqrt{\lambda\sigma^2/\eta}\), where \(\eta\) is the temporary-impact coefficient. With \(\lambda \to 0\) the schedule becomes a straight line (TWAP, an even split over time); larger \(\lambda\) front-loads the selling. The second tab of the inline demo above draws it; here it serves as the yardstick for learned execution.

> [!EXAMPLE] Selling 50,000 XYZ shares in one day
> XYZ at $100 with 20% volatility moves about \(100 \times 0.20/\sqrt{252} \approx \$1.26\) per share per trading day. Split the day into 10 slices and set the impact so that an even split costs $5,000 (0.1% of the $5 million notional). Then:
> - even split (TWAP): expected cost **$5,000**, standard deviation of proceeds **$33,633**;
> - \(\lambda = 10^{-5}\): cost **$7,317**, standard deviation **$22,426** — paying about $2,300 to cut the risk by a third;
> - dumping everything in the first slice: cost **$50,000**.

RL for execution replaces the fixed formula with a policy that reacts to what it sees — the spread, the depth of the order book, the recent fill rate — and is usually judged against exactly these baselines: TWAP, a volume-weighted schedule, and Almgren–Chriss ([[execution-tca]]). As with market making, the honest question is not “does the learner trade well?” but “does it beat a well-tuned classic schedule, after costs, out of sample?”

### ⑤ Sim-to-real, reward hacking and what the evidence shows

Three problems decide whether any of this survives contact with a real market.

**The sim-to-real gap.** The agent learns the simulator's market. Our simulator's order arrivals ignore our quotes' history, other dealers never react, and the price has no memory. Learning from *replayed* historical data has a different flaw: history cannot respond to your orders, so a strategy that would have moved the market looks free. Research simulators with many interacting agents narrow the gap but never close it.

**Reward hacking.** An agent maximizes exactly the reward it is given, including its loopholes. If the simulator values the closing inventory at the mid price for free, the agent may learn to end the day with a large position that a real market would charge a spread to unwind. If fills in the simulator are too generous at the touch, it learns to quote where real queues would never reach it. Every shortcut in the reward is an invitation.

**Non-stationarity and adversaries.** Markets change regime, and other participants adapt to predictable quoting. A policy that exploits a pattern teaches others the pattern.

> [!KEY] What the public evidence does and does not show
> Published RL market-making and execution studies report results mostly in simulators or on replayed historical order-book data. A typical example: Spooner, Fearnley, Savani and Koukorinis (2018) trained a temporal-difference agent in a simulator driven by historical limit-order-book data and reported that it beat simple benchmark strategies — inside that simulator. Firms that use learning methods in production rarely publish what they run, so there is little public, out-of-sample evidence that RL beats well-tuned classical methods after costs. The fair summary: a promising tool for complex, many-feature problems, with baselines like Avellaneda–Stoikov and Almgren–Chriss still the yardstick.

What survives, whichever way the evidence goes, is the discipline this framing forces: state what the agent can see, what it can do, and what it is paid for — then check that the payment matches what you actually want. The next lesson turns from quoting to *reading*: can language models turn news and earnings calls into signals, and how easily do such signals fool their authors ([[llm-signals]])? And when an AI system is allowed to act on its own, which guardrails keep it safe ([[ai-agents]])?

## @analogy
Go back to the airport currency booth from [[market-makers]]. When the booth has too many euros, the clerk lowers both prices: euros become cheaper for travelers to buy and less attractive to sell to the booth. When euros run short, both prices go up. How far to move them depends on how nervous the clerk is about the exchange rate moving overnight and how price-sensitive travelers are. That is Avellaneda–Stoikov: inventory shifts the centre, risk and customer sensitivity set the width.

Now train a new clerk by simulation: thousands of imaginary days with imaginary travelers, a score for each day's profit minus a penalty for holding too many euros at night. The new clerk ends up with rules much like the old hand's. If the simulation also includes travelers who rush in just before a devaluation is announced, the new clerk learns to widen the prices on busy news days — the habit the old hand picked up the hard way, now found without anyone ever naming the danger.

Where the analogy breaks: travelers do not study the booth's pricing rule and exploit it; market participants do. And a simulated airport never surprises you — a real one does, on the day the simulation did not imagine.

## @misconceptions
- **“RL discovers strategies humans could never find.”** — In the model's own world the formula is optimal and the agent only catches up (64.3 against 64.7). Its edge in the toxic world came from a feature a human could also have modeled. RL's advantage is handling many unnamed features at once, not magic.
- **“You can train a trading agent by replaying historical market data.”** — Replayed history cannot react to your orders, so impact and queue position are ignored. Agents learn in simulators, which have their own gap from reality.
- **“Tighter quotes always mean more profit.”** — Tighter quotes mean more fills, but also more inventory risk and more adverse selection. In the toxic world the winning move was to quote *wider*.
- **“More training always gives a better policy.”** — It gives a policy that fits the simulator better. Past a point, extra training mostly tunes the agent to the simulator's quirks.
- **“Avellaneda–Stoikov is how real market makers quote.”** — It is a stylized baseline. Real options dealers quote many strikes, hedge with the underlying and model informed flow, but the structure — skew with inventory, width from risk and fill rates — carries over.

## @takeaways
- Market making and execution are sequential decisions: each action changes the state the next action faces, which is the setting RL is built for.
- Q-learning estimates the value of each action in each state from experience, using \(Q \leftarrow Q + \alpha\,[\,r + \beta\max Q' - Q\,]\).
- Avellaneda–Stoikov: centre the quotes on \(r = s - q\gamma\sigma^2(T-t)\) and set the width from risk aversion and fill rates; Almgren–Chriss: front-load selling more as risk aversion rises.
- In the model's own world, a learner can at best match the formula; it adds value only where the world has features the formula lacks.
- Simulators, reward design and adaptive opponents decide whether learned policies survive; public out-of-sample evidence of RL beating classic baselines is limited.

## @quiz
1. Why is market making a natural reinforcement-learning problem rather than a one-off prediction problem?
   - [ ] Because market makers need to predict the direction of the price
   - [x] Because each quote changes the inventory, which changes what the best next quote is — a chain of dependent decisions
   - [ ] Because the bid-ask spread is fixed by the exchange
   - [ ] Because RL does not need a simulator
   > RL is built for sequential decisions whose actions change future states. Market makers mostly avoid directional bets; they manage inventory created by their own fills.
2. Under Avellaneda–Stoikov with \(s = 100\), \(\gamma = 0.1\), \(\sigma = 2\), \(T - t = 1\) and a half-spread of 0.845, a dealer long two shares quotes about:
   - [ ] bid 99.155, ask 100.845
   - [ ] bid 100.645, ask 102.335
   - [x] bid 98.355, ask 100.045
   - [ ] bid 99.20, ask 99.20
   > The reservation price is \(100 - 2 \times 0.1 \times 4 \times 1 = 99.20\); the quotes sit 0.845 either side. Inventory shifts the centre, not the width. The first option is the flat-inventory quote.
3. In the demo's AS world, the trained agent scores 64.3 against the formula's 64.7. What is the right interpretation?
   - [ ] RL is useless for market making
   - [ ] The agent needs a bigger neural network to win
   - [x] The formula is near-optimal in its own world, so a learner can at best match it; RL's value must come from worlds the formula does not describe
   - [ ] The formula is overfitted to the simulator
   > The formula was derived for that exact world. Matching it shows the learner works; beating it there would be suspicious.
4. In the toxic-flow world, every fill is followed by a price move against the dealer. What did the Q-learning agent learn that the formula did not?
   - [ ] To stop quoting altogether
   - [ ] To quote tighter so it gets more fills
   - [ ] To ignore its inventory
   - [x] To quote wider, so each fill earns enough to cover the adverse move
   > The agent widened its flat half-spread from the formula's 0.75 to 0.9 and earned about 19% more risk-adjusted P&L. A human who measured the toxicity could add the same adjustment by hand.
5. A team trains an execution agent on replayed historical order-book data and reports that it beats TWAP by a wide margin. What is the first thing to check?
   - [ ] Whether the network has enough layers
   - [x] Whether the replay ignores the agent's own market impact and queue position, which history cannot react to
   - [ ] Whether TWAP was computed in calendar or trading time
   - [ ] Whether the agent used Q-learning or another algorithm
   > Replayed data cannot respond to the agent's orders, so impact and fill realizm are the usual sources of an illusory edge. Always compare with Almgren–Chriss and TWAP under the same cost model, out of sample.

## @further
- [Avellaneda & Stoikov (2008), High-frequency trading in a limit order book](https://www.math.nyu.edu/~avellane/HighFrequencyTrading.pdf) — the reservation price and optimal spread used as the baseline here.
- [Almgren & Chriss (2000), Optimal Execution of Portfolio Transactions](https://www.smallake.kr/wp-content/uploads/2016/03/optliq.pdf) — the impact–risk trade-off and the sinh schedule.
- [Spooner, Fearnley, Savani & Koukorinis (2018), Market Making via Reinforcement Learning (arXiv)](https://arxiv.org/abs/1804.04216) — an RL market maker trained on a historical order-book simulator; read its results as simulator results.
- [Sutton & Barto, Reinforcement Learning: An Introduction (2nd ed., official page)](http://incompleteideas.net/book/the-book-2nd.html) — the standard textbook, free online; Q-learning is in chapter 6.
- [Q-learning (Wikipedia)](https://en.wikipedia.org/wiki/Q-learning) — the update rule, exploration and convergence conditions.

## @next
Hedging, pricing and quoting all turn numbers into decisions. The next lesson starts from words: can a language model read headlines and earnings calls and produce a signal worth trading — and how does a model that has already “read the future” fool the person testing it? That is [[llm-signals]].
