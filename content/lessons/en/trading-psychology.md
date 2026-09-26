---
id: trading-psychology
prereqs: probability-ev, covered-call, cash-secured-put, position-sizing, variance-risk-premium, portfolio-risk
demo: trading-psychology
---

# Psychology, Discipline & the Trade Journal

## @hook
Kai made 12 options trades and won 9 — a 75% win rate — yet the account is down. The problem is not the math but two “just wait, it'll come back” decisions. This lesson covers the most common psychological biases in trading and the things that keep them in check: a plan, rules, and an honest trade journal.

## @bridge
This is the last lesson of “Running an Options Book”. So far you have learned to compute expected value ([[probability-ev]]), size positions ([[position-sizing]]), understand the tail in selling volatility ([[variance-risk-premium]]) and read a whole book through a scenario grid ([[portfolio-risk]]). But however good the tools, a person executes them. This lesson builds Idea ④ — risk: when leverage bites and whether you survive — because very often what bites is not the market but our own decisions.

## @intuition
Start with Kai's trade journal.

> [!KAI] Kai's 12 trades
> Over the past few months Kai has mostly done two things: selling covered calls on the shares ([[covered-call]]) and selling puts “to buy the dip” ([[cash-secured-put]]), plus the occasional cheap out-of-the-money call as a flutter.
> - 9 trades made money, **+$60** on average;
> - 3 trades lost money, **−$228** on average; two of them were short puts that broke their strike, where Kai did not close as planned but “rolled it out”, finally losing $380 and $290.
>
> Win rate 75%; total P&L **−$144**.

Kai's feeling is “I'm right most of the time.” But the account recognizes one number only: **how much each trade makes on average** — the **expectancy**:

$$
E = p\,\bar W - (1-p)\,\bar L = 0.75 \times 60 - 0.25 \times 228 = 45 - 57 = -12
$$

\(p\) is the win rate, \(\bar W\) the average win and \(\bar L\) the average loss (as a positive number). Each trade loses $12 on average. The win rate is high, but each loss is almost four times each win.

::demo[trading-psychology-expectancy]

Where did the two big losses come from? Not from bad arithmetic, but from some very human reactions:

- **Loss aversion**: losing $100 hurts far more than winning $100 pleases, so people go to great lengths to keep a loss from becoming “real”;
- **Sunk cost**: “I'm already down $300; giving up now would be a waste”;
- **Recency bias**: after months of winning, it feels like this one will come back too;
- **Overconfidence**: after a winning streak, the size goes from 1 contract to 3 — right on the trade that loses.

Options amplify these biases. Selling options has a high win rate, which feels “safe”; out-of-the-money options are cheap, which feels like “small money for a big prize”; and options can be rolled again and again, so there is always a way to “wait a little longer”.

The answer is not willpower but **process**: write the plan and the maximum loss before the trade, record honestly afterwards, and review regularly.

<figure>
<svg viewBox="0 0 640 300" role="img" aria-label="The trading process loop">
<defs><marker id="trading-psychology-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="245" y="18" width="150" height="48" rx="8" class="fx-hl"/>
<text x="320" y="38" text-anchor="middle" class="fx-t-b">① Plan</text>
<text x="320" y="56" text-anchor="middle" class="fx-t-sm">view, structure, max loss</text>
<rect x="445" y="72" width="170" height="48" rx="8" class="fx-box"/>
<text x="530" y="92" text-anchor="middle" class="fx-t-b">② Pre-mortem</text>
<text x="530" y="110" text-anchor="middle" class="fx-t-sm">“if it lost it all, why?”</text>
<rect x="445" y="178" width="170" height="48" rx="8" class="fx-box"/>
<text x="530" y="198" text-anchor="middle" class="fx-t-b">③ Size</text>
<text x="530" y="216" text-anchor="middle" class="fx-t-sm">contracts by rule</text>
<rect x="245" y="232" width="150" height="48" rx="8" class="fx-box"/>
<text x="320" y="252" text-anchor="middle" class="fx-t-b">④ Execute &amp; manage</text>
<text x="320" y="270" text-anchor="middle" class="fx-t-sm">limit orders, planned exits</text>
<rect x="25" y="178" width="170" height="48" rx="8" class="fx-box"/>
<text x="110" y="198" text-anchor="middle" class="fx-t-b">⑤ Record</text>
<text x="110" y="216" text-anchor="middle" class="fx-t-sm">journal: numbers + mood</text>
<rect x="25" y="72" width="170" height="48" rx="8" class="fx-box"/>
<text x="110" y="92" text-anchor="middle" class="fx-t-b">⑥ Review</text>
<text x="110" y="110" text-anchor="middle" class="fx-t-sm">grade process, not outcome</text>
<line x1="395" y1="48" x2="480" y2="70" class="fx-line" marker-end="url(#trading-psychology-ah)"/>
<line x1="530" y1="120" x2="530" y2="176" class="fx-line" marker-end="url(#trading-psychology-ah)"/>
<line x1="480" y1="226" x2="397" y2="250" class="fx-line" marker-end="url(#trading-psychology-ah)"/>
<line x1="245" y1="250" x2="162" y2="228" class="fx-line" marker-end="url(#trading-psychology-ah)"/>
<line x1="110" y1="178" x2="110" y2="122" class="fx-line" marker-end="url(#trading-psychology-ah)"/>
<line x1="162" y1="70" x2="243" y2="48" class="fx-line" marker-end="url(#trading-psychology-ah)"/>
<text x="320" y="150" text-anchor="middle" class="fx-t-hl">rules are written before the trade,</text>
<text x="320" y="170" text-anchor="middle" class="fx-t-hl">not after the loss</text>
</svg>
<figcaption>Figure 1 · The trading process loop. Biases strike hardest at “execute and manage”, so the key decisions — maximum loss, when to exit, whether rolling is allowed — must be written down calmly in steps ①, ② and ③; steps ⑤ and ⑥ then use the journal to check whether you followed them.</figcaption>
</figure>

We'll take it in six parts:

- **① Expectancy**: the win rate isn't everything
- **② Loss aversion and “rolling losers”**
- **③ Lottery preference and overconfidence**
- **④ Recency bias**: after a run of short-volatility wins
- **⑤ Process**: plan, pre-mortem, sizing rules
- **⑥ The trade journal and review cadence**

## @mechanics
### ① Expectancy: the win rate isn't everything

Expectancy puts the win rate and the size of wins and losses together:

$$
E = p\,\bar W - (1-p)\,\bar L, \qquad p^* = \frac{\bar L}{\bar W + \bar L}
$$

\(E\) is the average P&L per trade, and \(p^*\) is the **break-even win rate** that makes \(E = 0\). Only a win rate above \(p^*\) gives a positive expectancy.

> [!EXAMPLE] What win rate does Kai need?
> \(\bar W = 60,\ \bar L = 228\): \(p^* = \dfrac{228}{60 + 228} = 79.2\%\). Kai's 75% is not enough.
> Had the two puts been closed as planned at a loss of about $120 each, the average loss would fall to about $85 and \(p^* = 85/145 \approx 59\%\) — a 75% win rate would be plenty. Same judgment, different discipline, and the result turns from losing to winning.

Two more common measures: the **payoff ratio** \(\bar W / \bar L\), and the **profit factor** = total gains ÷ total losses, which must exceed 1 to make money. Kai's profit factor is \(540 / 684 \approx 0.79\).

One more point is often ignored: **small samples**. A win rate from 12 trades is astonishingly uncertain. Its standard error is about \(\sqrt{p(1-p)/n}\): with \(p = 0.75,\ n = 12\) that is about 12.5 percentage points — a true win rate anywhere from 50% to 100% would be unsurprising. Try it in the inline demo above. At Kai's actual numbers (negative expectancy), three of the eight 50-trade paths still end in profit; pull the average loss down to $120 (a positive expectancy of $15 a trade) and one path still ends in the red. Judging a method by a handful of trades is another way of fooling yourself.

### ② Loss aversion and “rolling losers”

Kahneman and Tversky's **prospect theory** (1979) found that people feel gains and losses as **changes** relative to a reference point, and that a loss hurts more than an equal gain pleases. Tversky and Kahneman (1992) fitted experimental data with this value function:

$$
v(x) = \begin{cases} x^{\alpha}, & x \ge 0 \\ -\lambda\,(-x)^{\alpha}, & x < 0 \end{cases} \qquad \alpha \approx 0.88,\ \lambda \approx 2.25
$$

\(x\) is the gain or loss relative to the reference point, \(\alpha < 1\) means feelings grow less than proportionally with the amount, and \(\lambda\) is the **loss-aversion coefficient**: for the same amount, a loss “weighs” about 2.25 times a gain. On this function, winning $100 feels like about +58 and losing $100 like about −129.

<figure>
<svg viewBox="0 0 640 290" role="img" aria-label="The prospect-theory value function">
<line x1="50" y1="130" x2="600" y2="130" class="fx-axis"/>
<line x1="320" y1="40" x2="320" y2="285" class="fx-axis"/>
<polyline points="60.0,272.4 73.0,266.1 86.0,259.8 99.0,253.4 112.0,247.0 125.0,240.6 138.0,234.1 151.0,227.5 164.0,220.9 177.0,214.2 190.0,207.4 203.0,200.5 216.0,193.6 229.0,186.5 242.0,179.4 255.0,172.0 268.0,164.6 281.0,156.8 294.0,148.8 307.0,140.2 320.0,130.0 333.0,125.5 346.0,121.7 359.0,118.1 372.0,114.6 385.0,111.3 398.0,108.1 411.0,104.9 424.0,101.7 437.0,98.7 450.0,95.6 463.0,92.6 476.0,89.6 489.0,86.7 502.0,83.8 515.0,80.9 528.0,78.0 541.0,75.1 554.0,72.3 567.0,69.5 580.0,66.7" class="fx-line-thick"/>
<line x1="580" y1="66.7" x2="580" y2="130" class="fx-line-ok fx-dash"/>
<line x1="60" y1="130" x2="60" y2="272.4" class="fx-line-bad fx-dash"/>
<circle cx="580" cy="66.7" r="5" class="fx-fill-green"/>
<circle cx="60" cy="272.4" r="5" class="fx-fill-red"/>
<text x="575" y="56" text-anchor="end" class="fx-t-ok">win $100: feels like ≈ +58</text>
<text x="70" y="280" class="fx-t-bad">lose $100: feels like ≈ −129</text>
<text x="312" y="52" text-anchor="end" class="fx-t-sm">feeling (subjective value)</text>
<text x="596" y="148" text-anchor="end" class="fx-t-sm">gains →</text>
<text x="68" y="148" class="fx-t-sm">← losses</text>
<text x="360" y="200" class="fx-t">the loss side is steeper: about 2.25×</text>
<text x="360" y="220" class="fx-t-sm">so people would rather “wait” than make a loss real</text>
</svg>
<figcaption>Figure 2 · The prospect-theory value function (\(\alpha = 0.88,\ \lambda = 2.25\)). For the same $100, the pain of a loss is more than twice the pleasure of a gain. The curve has a kink at zero — that kink is loss aversion.</figcaption>
</figure>

In trading it shows up as the **disposition effect**: selling winners too early and riding losers too long. Shefrin and Statman (1985) named the pattern, and Odean (1998) found in brokerage-account data that individual investors were noticeably more inclined to sell winning stocks than losing ones.

Options give this tendency an especially convenient outlet: the **roll**.

> [!WARN] How a roll turns $654 into a bigger risk
> Here is how such a roll typically unfolds (illustrative numbers, XYZ as usual). Kai sold the 30-day 95 put for $51. Ten days later XYZ has fallen to 88, implied volatility has risen to 25%, and the put is worth about **$7.05** — a paper loss of about $654.
> Not wanting to take the loss, Kai buys it back and sells **2** 60-day puts struck at 90 (about $4.33 each), for a “net credit” of $1.62. It looks like being paid to roll, but in fact:
> - the $654 already lost is still lost;
> - the exposure has doubled: if XYZ is at 80 at expiry, the two new puts lose another \(2 \times (10 - 4.33) \times 100 \approx \$1{,}134\), about −$1,788 in all; holding the original put to expiry would have lost \((95 - 80 - 0.51) \times 100 = \$1{,}449\), and a planned exit even less.

Rolling in itself isn't wrong — sometimes it is a sensible adjustment. The danger is **rolling to avoid admitting a loss, and adding size when you roll**. A simple test: **“If this position weren't already in my account, would I open this new one today?”** If not, the sunk cost is making the decision for you.

### ③ Lottery preference and overconfidence

**Lottery preference.** XYZ's 30-day call struck at 110 costs just $0.14, or $14 a contract. Its risk-neutral chance of finishing in the money is about 5%. Cheap, with tempting odds, “what if…” — people naturally overweight small chances of a big prize (another part of prospect theory: small probabilities get extra weight). The market prices of out-of-the-money options already reflect this demand. Buying a lottery ticket is not necessarily wrong; the mistakes are sizing by “cheapness” rather than by risk and buying many at once, sizing up after a rare hit, and doubling up after a string of losses to “win it back”. The “lottery buyer” journal in the main demo shows the sizing-up pattern: a 17% win rate, and each win lifts the size, from 2 to 5 to 10 contracts, so the final losses come on the biggest positions.

**Overconfidence.** After a few wins, people overrate their judgment and increase size. Barber and Odean's research on individual investors found that the more actively an account traded, the worse its returns after costs tended to be. Kai's journal shows the same signal: an average of 1.9 contracts after a win and just 1 after a loss — and both big losses came at 3 contracts.

> [!THINK] Kai has won five short-put trades in a row and plans to size the next one up to 3 contracts. How much truth is there in “I've been reading XYZ really well lately”?
> Think first: for a strategy that already wins most of the time — selling out-of-the-money puts — what do five straight wins prove?
> ---
> Almost nothing. The risk-neutral chance that a 30-day 95 put expires unexercised is about 82%, so five wins in a row have a probability of roughly \(0.82^5 \approx 37\%\) — better than one in three even with no judgment at all. Winning streaks are this strategy's normal state, not evidence of skill. Size should change only by rule (account size, risk budget), never by recent results.

### ④ Recency bias: after a run of short-volatility wins

**Recency bias** is treating what just happened as what will happen. It is especially dangerous in selling volatility: in [[variance-risk-premium]], the seller made money in roughly seven months out of ten, and a calm year is common. After a year without trouble, people tend to:

- decide the risk “isn't really that big” and add leverage;
- loosen their exit rules (“last time it broke the strike and came back”);
- treat the crash that isn't in their sample as a crash that won't happen.

But the chance of a crash doesn't shrink because things have been calm; if anything, long calm stretches lead more people to lever up the same way, making the next shock more violent. The inverse VIX products of February 2018 collapsed after a long period of low volatility. For a volatility seller, the most dangerous moment is often the one that feels safest.

### ⑤ Process: plan, pre-mortem, sizing rules

Good process moves the key decisions to **calm moments**. Before each trade, write down:

| Plan item | What Kai should have written when selling the 95 put (example) |
|---|---|
| View | XYZ won't fall below 95 within 30 days; happy to own it below 95 |
| Structure and price | Sell 1 × 30-day 95 put, limit 0.51 |
| Maximum loss / risk budget | Stress (XYZ −15% instantly, implied vol to 30%) loses about $960, inside the 5% stress limit ($1,000) of the $20,000 account from [[position-sizing]] |
| Exit rule | Close if the loss reaches 2× the credit; or take assignment as planned — no rolling for size |
| Invalidation | Reassess before earnings, if implied vol jumps, or if the fundamentals change |

The **pre-mortem**, a method proposed by the psychologist Gary Klein, asks you before opening to imagine that “a month from now this trade has lost the maximum”, and to write down the most likely reasons. It forces you to see the risks before you are emotionally invested — “earnings fall three days before expiry”, say, or “this stock is highly correlated with three of my other positions”.

Some common personal rules (describing common practice, not advice):

- Maximum loss per trade of 1–2% of the account; positions sharing a direction and a risk count as one;
- Exit rules written at entry and not changed in the heat of the moment;
- No rolling to avoid a loss, and no adding size when rolling;
- After a set number or amount of consecutive losses, pause trading and review;
- Adjust size by rule, not by recent results.

### ⑥ The trade journal and review cadence

A trade journal is not a ledger; it is **evidence for your future self**. Common fields:

| Field | Why record it |
|---|---|
| Date, underlying, structure, contracts | The basic facts |
| Reason for entry, implied and realized vol at the time | Check whether the “why” holds up |
| Greeks and maximum loss at entry | Compare the risk with what you expected |
| Planned exit versus actual exit | Check discipline: did you follow it? |
| Rolled or not, contracts after rolling | Expose a “never admit a loss” habit |
| Mood score (1–5), mistake tags | Find your own bias patterns |

**In review, grade the process, not the outcome.**

| | Good outcome | Bad outcome |
|---|---|---|
| **Good process** | Deserved success | Bad luck — do it again |
| **Bad process** | Dumb luck — the most dangerous, it rewards bad habits | Deserved lesson |

A common cadence: finish the journal entry the day a trade closes; once a week, check for rule violations; every month or every 20–30 trades, compute win rate, payoff ratio, expectancy and longest losing streak by strategy, as the main demo does; once a quarter, decide whether to change the rules (calmly — never on the day of a loss).

> [!FACT] Retail traders' weight in the options market (as of February 2026)
> According to a Cboe estimate reported by Traders Magazine in February 2026, retail broker order flow accounts for about half of total US options volume. How retail traders behave affects the whole market — a topic for [[retail-flows]].

More practical pitfalls are collected in [[common-traps]]; for all of this stage's tools strung together into one complete trading decision, see [[capstone]].

## @analogy
Think of trading discipline as **a pilot's checklist**.

Pilots don't use checklists because they can't remember the steps; they use them because they know people make mistakes under pressure. Rushed, tired or overconfident, even the most skilled pilot can skip a step. So before take-off and before landing they read and confirm each item; when something goes wrong, they follow the manual first rather than their gut.

- The trade plan = the pre-flight checklist;
- The pre-mortem = the “what if an engine fails” drill;
- Sizing rules = the maximum take-off weight: over it, you don't fly;
- The trade journal = the flight recorder, replayed afterwards;
- The review = the accident investigation: which step of the process failed, not just “did we crash this time”.

The analogy misleads in one place: an aircraft's failure rates can be measured precisely, while the market's “failure rate” shifts and your own judgment is hard to measure. So a trading checklist can't just be followed; it must be tested and revised regularly against the journal's data — but revised on the ground, never in the air.

## @misconceptions
- **“A high win rate means I'm doing well.”** — The win rate only counts alongside the payoff ratio. Kai wins 75% of the time, but the average loss is nearly four times the average win, break-even needs about 79%, and the expectancy is negative.
- **“The roll paid a net credit, so the loss is gone.”** — The loss that already happened is still there; rolling only postpones the risk, and adding contracts when you roll doubles it.
- **“A winning streak shows I read this stock well.”** — For a high-win-rate strategy like selling out-of-the-money puts, five straight wins happen by chance more than a third of the time. Results are no substitute for rules.
- **“That trade lost because of bad luck.”** — Maybe, or maybe the process failed. Only by recording both the plan and what you actually did can you tell “bad luck” from “didn't follow the plan”.
- **“With enough willpower you don't need rules.”** — Biases are strongest under pressure. Rules let your calm self decide for your pressured self.

## @takeaways
- The account only recognizes expectancy \(E = p\,\bar W - (1-p)\,\bar L\): the win rate must exceed the break-even rate \(p^* = \bar L/(\bar W + \bar L)\) to make money.
- Loss aversion (a loss weighs about 2.25 times a gain) makes people reluctant to take losses; the option “roll” makes that tendency especially easy to turn into bigger risk.
- Lottery preference, overconfidence and recency bias all change position size after losing or winning streaks — size should be set only by rules.
- Process beats willpower: before opening, write the plan, the maximum loss and the exit rule, and run a pre-mortem.
- The trade journal is evidence for your future self: record plan versus reality, rolls and moods, and grade the process, not the outcome.

## @quiz
1. Kai's 12 trades: win rate 75%, average win $60, average loss $228. What is the expectancy per trade?
   - [ ] +$45
   - [x] −$12
   - [ ] +$33
   - [ ] −$57
   > \(E = 0.75 \times 60 - 0.25 \times 228 = 45 - 57 = -12\). $45 counts only the winning side and $57 only the losing side.
2. With an average win of $60 and an average loss of $228, what win rate is needed to break even?
   - [ ] 50%
   - [ ] 75%
   - [ ] 21%
   - [x] About 79%
   > \(p^* = \bar L/(\bar W + \bar L) = 228/288 \approx 79.2\%\). 21% is \(\bar W/(\bar W + \bar L)\), with the numerator the wrong way round.
3. Kai's short 95 put shows a $654 paper loss, so Kai buys it back and sells 2 puts at a lower strike and a later expiry, collecting a small net credit. What is the biggest problem with this?
   - [ ] The net credit is too small; Kai should sell more
   - [ ] Rolling always breaks exchange rules
   - [x] The loss already incurred is unchanged while the exposure has doubled, and the motive is “not wanting to admit the loss”
   - [ ] The new puts have a lower strike, so they are sure to lose more
   > A roll can't erase a realized loss; selling 2 doubles the exposure, so if XYZ keeps falling the loss will be much larger than planned. The test: “If this position weren't in my account today, would I open this new one?”
4. Under prospect theory (\(\lambda \approx 2.25\)), which behavior best fits “loss aversion”?
   - [x] Selling winning positions too early while holding on to losing ones
   - [ ] Closing a position at the planned maximum loss
   - [ ] Risking only 1% of the account per trade
   - [ ] Using limit orders instead of market orders
   > This is the disposition effect: a loss hurts about twice as much as an equal gain pleases, so people postpone making a loss “real”. The other choices are disciplined habits that counter the bias.
5. In review, a trade had a bad process (no maximum loss set, size added on impulse) but made money. In the process × outcome framework, what is it?
   - [ ] Deserved success — do it again
   - [ ] Bad luck
   - [x] Dumb luck — the most dangerous kind, because it reinforces bad habits
   - [ ] A deserved lesson
   > A bad process with a good outcome is luck hiding a problem. Grade by outcome and you reward the bad habit — until a real tail event makes it very expensive.

## @further
- [Prospect theory (Wikipedia)](https://en.wikipedia.org/wiki/Prospect_theory) — Kahneman and Tversky's prospect theory, loss aversion and later research in one place.
- [Disposition effect (Wikipedia)](https://en.wikipedia.org/wiki/Disposition_effect) — selling winners too early and riding losers too long, with the empirical evidence.
- [FINRA: risks of short-dated options trading](https://www.finra.org/investors/insights/zeroing-in-options-trading-strategy) — FINRA's investor insight on the risks of very short-dated options.
- [Options Industry Council (OIC)](https://www.optionseducation.org/) — options education backed by the OCC, including introductions to trade planning and risk management.
- [Strategy Path](https://evidex-cloud.github.io/droplet-labs-strategy-path/) — the sister course on decisions, games and behavior under uncertainty.

## @next
You can now run an options book from the trader's seat: sizing, hedging, understanding premium and tails, seeing the whole book's risk, and managing yourself. But on the other side of every trade stands someone — usually a market maker. How do they quote, how do they hedge, how do they make money, and when do they lose it? The next stage starts with [[market-makers]]: who is on the other side.
