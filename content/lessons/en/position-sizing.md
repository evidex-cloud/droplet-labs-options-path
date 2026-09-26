---
id: position-sizing
prereqs: probability-ev, vertical-spreads, iron-condor, straddle-strangle
demo: position-sizing
---

# Position Sizing, the Kelly Criterion & Risk of Ruin

## @hook
Take one trade with a genuine edge. The person who stakes 5% each time grows steadily; the person who stakes 30% each time is left with a fifth of the account after a hundred bets. What decides your fate is often not *what* you bet on but *how much*. This lesson gives you three rulers: maximum loss, the Kelly criterion, and risk of ruin.

## @bridge
The strategy lessons gave you a toolbox of structures — [[vertical-spreads]], [[iron-condor]], [[straddle-strangle]] and more — each with its own maximum loss and win rate, and [[probability-ev]] taught you to compute a trade's expected value. [[earnings-events]] ended with a blunt question: is a $398 worst case too much for Kai's account? A positive expected value only says a trade is *worth doing*; it doesn't say *how big*. This is the first lesson of “Running an Options Book”, and it builds Idea ④ — risk: when leverage bites decides survival. Learn to survive first; [[delta-hedging]], [[variance-risk-premium]] and [[portfolio-risk]] only matter to someone who is still in the game.

## @intuition
Start with an experiment that overturns intuition.

Here is a bet with a **real edge**: you win 55% of the time; a win pays your stake, a loss costs your stake (1:1). Every $1 staked earns \(0.55 - 0.45 = 0.10\) dollars on average. One question is left: **what percentage of your money do you stake each time?**

Intuition says “you have an edge, so bet big.” Let the engine simulate 4,000 people who each bet 100 times, changing only the fraction staked, and look at the typical (median) outcome:

| Stake per bet | Median wealth after 100 bets | Share who were cut in half along the way |
|---|---|---|
| 2.5% | × 1.24 | about 0% |
| 5% | × 1.46 | about 11% |
| 10% | **× 1.65** (fastest) | about 70% |
| 20% | × 0.99 (going nowhere) | almost 100% |
| 30% | × 0.20 (80% gone) | 100% |

Same edge, same distribution of luck — and betting too heavily loses money. The edge did not disappear. **Losses multiply**: lose 50% and you then need +100% just to get back to where you started.

<figure>
<svg viewBox="0 0 640 230" role="img" aria-label="Drawdowns and the gain needed to recover">
<text x="130" y="28" text-anchor="middle" class="fx-t-b">Loss</text>
<text x="330" y="28" text-anchor="middle" class="fx-t-b">Gain needed to recover</text>
<line x1="235" y1="38" x2="235" y2="205" class="fx-line"/>
<rect x="215" y="45" width="20" height="26" class="fx-fill-red"/>
<rect x="235" y="45" width="13" height="26" class="fx-fill-green"/>
<text x="208" y="63" text-anchor="end" class="fx-t">−10%</text>
<text x="254" y="63" class="fx-t-ok">+11%</text>
<rect x="185" y="87" width="50" height="26" class="fx-fill-red"/>
<rect x="235" y="87" width="40" height="26" class="fx-fill-green"/>
<text x="178" y="105" text-anchor="end" class="fx-t">−25%</text>
<text x="281" y="105" class="fx-t-ok">+33%</text>
<rect x="135" y="129" width="100" height="26" class="fx-fill-red"/>
<rect x="235" y="129" width="120" height="26" class="fx-fill-green"/>
<text x="128" y="147" text-anchor="end" class="fx-t">−50%</text>
<text x="361" y="147" class="fx-t-ok">+100%</text>
<rect x="85" y="171" width="150" height="26" class="fx-fill-red"/>
<rect x="235" y="171" width="360" height="26" class="fx-fill-green"/>
<text x="78" y="189" text-anchor="end" class="fx-t">−75%</text>
<text x="590" y="189" text-anchor="end" class="fx-t-inv">+300%</text>
<text x="600" y="222" text-anchor="end" class="fx-t-sm">gain to recover = L ÷ (1 − L)</text>
</svg>
<figcaption>Figure 1 · The asymmetry of losses. Red bars are the share lost; green bars are the gain needed to get back to the start. The deeper the hole, the faster the green bar grows — a 75% loss needs a 300% gain. This is the arithmetic of how oversized bets drag you into a pit.</figcaption>
</figure>

> [!KAI] Kai's first rule
> Kai has opened a separate **$20,000** options account (an illustration). Bullish on XYZ, Kai wants the 30-day $100-strike call at **$245** per contract.
> Kai sets a rule: **no single trade may lose more than 2% of the account in the worst case** — \(20{,}000 \times 2\% = \$400\). One call can lose at most $245, so the answer is **one contract**. Three contracts ($735) would break the rule, however “sure” Kai feels.

The rule never mentions a win rate — only how much can be lost. Its virtue: even after ten wrong calls in a row, more than 80% of the account is still there, and Kai is still at the table.

Is there an *optimal* fraction? Yes — the **Kelly criterion**: given a known win probability and payoff, the fraction that makes long-run wealth grow fastest. For the bet above it is 10%, exactly the fastest-growing row in the table. But you also saw that row's 70% chance of being cut in half on the way. Kelly is a **ceiling**, not a recommendation.

::demo[position-sizing-ruin]

Options make this subtler. Buying out-of-the-money options is like buying lottery tickets: low win rate, high payoff, and long losing streaks are normal. Selling premium has a high win rate and a small payoff; it looks safe, yet a small error in your win-rate estimate flips it from “bet big” to “don't trade at all.”

We'll take it in five parts:

- **① From maximum loss to number of contracts**: the risk budget
- **② The Kelly criterion**: where the fastest-growing fraction comes from
- **③ Fractional Kelly and risk of ruin**: why professionals use half or less
- **④ Skewed option payoffs and correlated short-premium positions**
- **⑤ Sizing by Greeks and stress tests**

## @mechanics
### ① From maximum loss to number of contracts

The plainest and most widely used sizing method needs two numbers: how much of the account you are willing to risk on this trade, and the worst-case loss per contract.

$$
\text{contracts} = \left\lfloor \frac{\text{account equity} \times \text{risk per trade}}{\text{maximum loss per contract}} \right\rfloor
$$

Here \(\lfloor \cdot \rfloor\) means round down. The maximum loss per contract is the premium × 100 for a buyer, the net debit × 100 for a debit spread, and (width − credit) × 100 for a credit spread.

> [!EXAMPLE] Kai's $20,000 account at 1% or 2% risk per trade
> With XYZ's standard numbers (30 days, σ = 20%, r = 4%):
>
> | Structure | Max loss per contract | At 1% ($200) | At 2% ($400) |
> |---|---|---|---|
> | Buy the 100 call | \(2.45 \times 100 = \$245\) | 0 contracts | 1 contract |
> | 100/105 bull call spread | \((2.45 - 0.71) \times 100 = \$174\) | 1 contract | 2 contracts |
> | Sell the 95/90 put spread (0.45 credit) | \((5 - 0.45) \times 100 = \$455\) | 0 contracts | 0 contracts |
> | 90/95/105/110 iron condor (1.02 credit) | \((5 - 1.02) \times 100 = \$398\) | 0 contracts | 1 contract |
>
> The credit rows are the ones people misread: the put spread pays only $45 but can lose $455. **Size by the worst-case loss, not by the premium collected.** And the $398 condor from [[iron-condor]]? At 2% it just fits, one contract; at 1% it does not.

Spreads pin down the maximum loss, which is why this method suits them so well ([[vertical-spreads]]). Naked short options have no such cap: sell one 95 put and the theoretical worst case is XYZ going to zero, a loss of \((95 - 0.51) \times 100 = \$9{,}449\). For those positions, size with the stress tests of part ⑤.

Why insist on small numbers like 1–2%? Because drawdowns multiply (Figure 1). After losing a fraction \(L\), the gain needed to recover is:

$$
G = \frac{1}{1-L} - 1 = \frac{L}{1-L}
$$

\(L\) is the fraction lost and \(G\) the gain needed to get back to the start. \(L = 10\%\) gives \(G = 11.1\%\); \(L = 50\%\) gives \(G = 100\%\); \(L = 80\%\) gives \(G = 400\%\). Risk 2% per trade and ten straight losses leave \(0.98^{10} \approx 81.7\%\) of the account, which needs only about a 22% gain to recover.

### ② The Kelly criterion: the fastest-growing fraction

Suppose you stake a fraction \(f\) of your wealth each time; with probability \(p\) you gain \(f \times b\), otherwise you lose \(f\). Over the long run, wealth grows at the **expected log growth per bet**:

$$
g(f) = p\,\ln(1 + f\,b) + (1-p)\,\ln(1 - f)
$$

Here \(p\) is the win probability, \(b\) the payoff ratio (average win ÷ average loss), and \(\ln\) the natural logarithm. Logs appear because wealth compounds by multiplication: after \(n\) bets the typical wealth is about \(e^{n\,g(f)}\). Set the derivative with respect to \(f\) to zero and you get the fraction that maximizes \(g\):

$$
f^* = p - \frac{1-p}{b}
$$

Read it simply: **the Kelly fraction = expected profit per $1 staked ÷ the payoff ratio**, because \(p - \frac{1-p}{b} = \frac{p\,b - (1-p)}{b}\). When the expected profit is ≤ 0, \(f^* \le 0\): no edge, and the right size is zero.

> [!EXAMPLE] 55% win rate, 1:1 payoff
> \(f^* = 0.55 - \dfrac{0.45}{1} = 0.10\). The expected log growth per bet is then
> $$
> g(0.10) = 0.55\ln 1.1 + 0.45\ln 0.9 = 0.0524 - 0.0474 = 0.0050
> $$
> After 100 bets the typical wealth is \(e^{100 \times 0.0050} = e^{0.50} \approx 1.65\) times the start — the 10% row of the opening table. With a 2:1 payoff (\(b = 2\)), \(f^* = 0.55 - 0.45/2 = 0.325\): better odds allow a bigger stake.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Kelly growth curve">
<polygon points="420.0,77.6 429.0,82.2 438.0,86.0 447.0,90.0 456.0,94.2 465.0,98.6 474.0,103.1 483.0,107.9 492.0,112.9 501.0,118.0 510.0,123.4 519.0,128.9 528.0,134.6 537.0,140.6 546.0,146.7 555.0,153.0 564.0,159.6 573.0,166.3 582.0,173.3 591.0,180.4 600.0,187.8 600,77.6" class="fx-area-bad"/>
<line x1="60" y1="200" x2="610" y2="200" class="fx-axis"/>
<line x1="60" y1="25" x2="60" y2="200" class="fx-axis"/>
<line x1="60" y1="77.6" x2="610" y2="77.6" class="fx-line-muted fx-dash"/>
<polyline points="60.0,77.6 69.0,74.3 78.0,71.1 87.0,68.2 96.0,65.4 105.0,62.7 114.0,60.3 123.0,58.0 132.0,55.8 141.0,53.9 150.0,52.1 159.0,50.5 168.0,49.0 177.0,47.7 186.0,46.6 195.0,45.7 204.0,44.9 213.0,44.3 222.0,43.9 231.0,43.6 240.0,43.5 249.0,43.6 258.0,43.9 267.0,44.3 276.0,44.9 285.0,45.7 294.0,46.6 303.0,47.8 312.0,49.1 321.0,50.5 330.0,52.2 339.0,54.0 348.0,56.0 357.0,58.2 366.0,60.6 375.0,63.1 384.0,65.8 393.0,68.7 402.0,71.8 411.0,75.1 420.0,78.5 429.0,82.2 438.0,86.0 447.0,90.0 456.0,94.2 465.0,98.6 474.0,103.1 483.0,107.9 492.0,112.9 501.0,118.0 510.0,123.4 519.0,128.9 528.0,134.6 537.0,140.6 546.0,146.7 555.0,153.0 564.0,159.6 573.0,166.3 582.0,173.3 591.0,180.4 600.0,187.8" class="fx-line-thick"/>
<line x1="240" y1="43.5" x2="240" y2="200" class="fx-line-hl fx-dash"/>
<circle cx="240" cy="43.5" r="5" class="fx-fill-orange"/>
<circle cx="150" cy="52.1" r="5" class="fx-fill-green"/>
<circle cx="420" cy="77.6" r="5" class="fx-fill-red"/>
<text x="248" y="32" class="fx-t-hl">Kelly f* = 10%: fastest growth</text>
<text x="70" y="16" class="fx-t-ok">half Kelly 5%:</text>
<text x="70" y="32" class="fx-t-ok">75% of the growth</text>
<text x="428" y="68" class="fx-t-bad">2× Kelly 20%: growth ≈ 0</text>
<text x="535" y="182" text-anchor="end" class="fx-t-bad">past 2× Kelly: long-run loser</text>
<text x="54" y="47" text-anchor="end" class="fx-t-sm">0.005</text>
<text x="54" y="81" text-anchor="end" class="fx-t-sm">0</text>
<text x="54" y="149" text-anchor="end" class="fx-t-sm">−0.010</text>
<text x="60" y="216" text-anchor="middle" class="fx-t-sm">0</text>
<text x="150" y="216" text-anchor="middle" class="fx-t-sm">5%</text>
<text x="240" y="216" text-anchor="middle" class="fx-t-sm">10%</text>
<text x="330" y="216" text-anchor="middle" class="fx-t-sm">15%</text>
<text x="420" y="216" text-anchor="middle" class="fx-t-sm">20%</text>
<text x="510" y="216" text-anchor="middle" class="fx-t-sm">25%</text>
<text x="600" y="216" text-anchor="middle" class="fx-t-sm">30%</text>
<text x="600" y="238" text-anchor="end" class="fx-t-sm">fraction of wealth per bet f (55% win rate, 1:1 payoff)</text>
</svg>
<figcaption>Figure 2 · Expected log growth \(g(f)\) against the fraction staked. The curve peaks at the Kelly fraction; half Kelly gives up only a quarter of the growth; at twice Kelly growth falls to zero; further right, in the red region, a bet *with an edge* loses money in the long run.</figcaption>
</figure>

> [!DEEP] The continuous version: \(f^* = \mu/\sigma^2\)
> If returns are roughly normal rather than win-or-lose (excess expected return \(\mu\), volatility \(\sigma\)), then \(g(f) \approx f\mu - \tfrac12 f^2\sigma^2\) and the optimal leverage is \(f^* = \mu/\sigma^2\). Example: 5% excess return and 20% volatility give \(f^* = 0.05/0.04 = 1.25\) times leverage. The criterion comes from Kelly's 1956 paper on information rates. Note the \(-\tfrac12 f^2\sigma^2\) term: it is the same thing as “geometric mean \(\approx \mu - \tfrac12\sigma^2\)” in [[tail-hedging]].

### ③ Fractional Kelly and risk of ruin

Kelly grows fastest on paper, but almost nobody uses all of it. Three reasons:

1. **The drawdowns are brutal.** In the opening simulation, about 70% of full-Kelly bettors were cut in half at some point within 100 bets; at half Kelly, about 11%.
2. **The inputs are estimates.** Suppose you think your win rate is 55% (Kelly 10%) but it is really 52% (true Kelly 4%). Staking 10% is then 2.5 times Kelly: \(g = 0.52\ln 1.1 + 0.48\ln 0.9 = -0.0010\), **a long-run loser**. Overestimate the edge and full Kelly becomes overbetting.
3. **Diminishing returns.** Dropping from full to half Kelly costs only about 25% of the growth (\(0.00375\) vs \(0.00501\)), while volatility and drawdowns fall sharply.

So the common practice is **fractional Kelly**: bet ½ or ¼ of the Kelly fraction, with a hard cap such as 1–2% of the account at risk per trade.

In the idealized continuous-time model, betting \(c\) times the Kelly fraction, the probability that wealth *ever* falls to \(x\) times its starting value is \(x^{2/c-1}\). At full Kelly (\(c = 1\)) the chance of ever being halved is simply \(0.5\); at half Kelly (\(c = 0.5\)) it is \(0.5^3 = 12.5\%\). “Bet half as much and your odds of being halved drop by three-quarters” is the cleanest argument for fractional Kelly.

**Risk of ruin** here means the probability of falling to a level you cannot tolerate — halved, or a margin call — before “the long run” arrives. The inline demo above shows how steeply it climbs with the risk per trade. The main demo under “Try it yourself” lets you move the Kelly curve and twenty wealth paths together.

### ④ Skewed option payoffs and correlated short-premium positions

Option payoffs are rarely a symmetric 1:1, and that leads Kelly to some counter-intuitive answers.

**Buyers (lottery tickets).** Say an out-of-the-money call trade has a 20% chance of paying 5 times the premium and otherwise expires worthless (\(p = 0.2,\ b = 5\)). Each $1 staked earns \(0.2 \times 5 - 0.8 = 0.20\) dollars on average — a big edge — yet Kelly is only \(f^* = 0.2 - 0.8/5 = 4\%\). With a low win rate, losing streaks are long: ten losses in a row happen with probability \(0.8^{10} \approx 10.7\%\). The inline demo shows that even at 2% per trade (half Kelly), about 22% of such traders are cut in half at some point within 200 trades.

**Sellers (collecting rent).** Sell the 95/90 put spread: collect 0.45, risk 4.55. Treated crudely as all-or-nothing, \(b = 0.45/4.55 \approx 0.099\), and the break-even win rate is \(\frac{4.55}{5} = 91\%\). Kelly is extremely sensitive to the win rate here:

| Your estimated win rate | 90% | 92% | 95% |
|---|---|---|---|
| Kelly fraction \(f^*\) | negative (don't trade) | 11.1% | 44% |

Two or three points of win rate swing the answer from “not a single contract” to “stake almost half.” Meanwhile the risk-neutral probability implied by option prices that XYZ is still above 95 in 30 days is about 82%. **A high win rate is not an edge**; high-win-rate strategies call for sizes far below Kelly.

**Correlation.** Selling put spreads on five tech stocks feels like five separate bets, but in a sell-off they lose together. \(N\) equal positions with pairwise correlation \(\rho\) behave like roughly this many independent bets:

$$
N_{\text{eff}} = \frac{N}{1 + (N-1)\,\rho}
$$

With \(N = 5\) and \(\rho = 0.8\), \(N_{\text{eff}} = 5/(1 + 4 \times 0.8) \approx 1.2\): five trades are really **one slightly bigger bet**. Worse, correlations rise in crashes — exactly when short-premium positions need diversification most. This theme returns in [[variance-risk-premium]] and [[tail-hedging]].

> [!THINK] In Kai's $20,000 account, Kai sells put spreads on five different tech stocks, each with a $400 worst case (2% each). Is the “total risk” 2% or 10%?
> Think first: when would all five lose at once?
> ---
> In the worst case it is 10%. On ordinary days they move independently and look like five 2% bets; but on the day tech sells off as a group, all five spreads go to maximum loss together — with a correlation of 0.8 there are only about 1.2 independent bets. When sizing, add up positions that share one direction and one risk, and treat them as a single trade.

### ⑤ Sizing by Greeks and stress tests

Naked short options and short straddles have no fixed maximum loss, so the denominator “max loss per contract” does not exist. Professionals budget risk instead: a **vega budget** (dollars lost per vol point), a **gamma budget** (how much delta changes per $1 move), and **stress tests** (the loss after a large joint move in price and volatility).

> [!EXAMPLE] Selling one 30-day at-the-money XYZ straddle
> Credit \(2.45 + 2.12 = 4.57\), i.e. $457. Risk per contract (×100):
> - Vega: \(-(0.114 + 0.114) \times 100 \approx -\$22.8\) per vol point. If implied vol jumps from 20% to 30%, the position loses about $228 on the spot.
> - Gamma: \(-(0.069 + 0.069) \times 100 \approx -13.9\) shares per $1. An instant rise of one 30-day standard deviation ($5.73) reprices to a loss of about $241.
> - Stress: spot −15% with implied vol jumping to 30% loses about **$1,030**; spot +15% with vol at 30% loses about $1,112.
>
> If Kai's rule is “no stress scenario may cost more than 5% of the account ($1,000)”, even one straddle is slightly over the limit.

This scenario-first sizing leads straight to putting a whole book into a spot × volatility grid and reading it next to margin ([[portfolio-risk]]). The sizing rule itself is also a matter of discipline: raising size after a winning streak, or doubling up to win back a loss, turns a good rule into decoration ([[trading-psychology]]).

> [!WARN] A stop order is not a maximum loss
> “I have a 20% stop, so I can lose at most 20%” holds only if prices move continuously. A gap (earnings, overnight news) jumps straight past the stop, and option bid-ask spreads widen in a panic, so the fill can be far worse than planned. The maximum loss you size with should be the **structure's** own maximum loss or its loss under stress, never the number on a stop order.

## @analogy
Think of your account as a professional poker player's **bankroll**.

A good player has an edge: over many hands they win a little on average. But poker swings wildly, and losing a dozen hands in a night is normal. So professionals follow an iron rule: never bring more than a small slice of the bankroll to any one table. Even after the worst night imaginable, they can sit down again tomorrow and let the edge play out.

- How much to bring to a table = the risk per trade;
- The math that says how much is optimal = the Kelly criterion;
- Bringing only half of that = fractional Kelly;
- Losing the bankroll and never sitting down again = ruin.

The analogy misleads in two places. First, card probabilities are known, while market win rates and payoffs are estimates that drift; estimate them wrong and Kelly makes you bet too much. Second, poker tables are mostly independent of each other, while option positions lose together in a crash — five tables may really be one.

## @misconceptions
- **“An 80% win-rate strategy is safe, so I can size it big.”** — A high win rate usually comes with a small payoff. Selling the 95/90 put spread needs better than 91% just to break even; misjudge the win rate by a few points and the Kelly fraction flips from positive to negative.
- **“Kelly is optimal, so I should bet full Kelly.”** — Kelly is optimal only when the win rate and payoff are known exactly, and full Kelly has a high chance of halving the account along the way. If you overestimate the edge, full Kelly becomes overbetting and loses money in the long run.
- **“Being right on direction is what matters; size is a detail.”** — With the same 55% edge, staking 10% takes typical wealth to 1.65 times; staking 30% leaves 0.2 times. Size decides whether an edge becomes wealth or zero.
- **“I'm spread over five stocks, so my risk is a fifth.”** — Only if they are uncorrelated. At a correlation of 0.8, five trades are about 1.2 independent bets, and correlations rise in a crash.
- **“A small premium means a small risk.”** — Size by the worst case: a spread that pays $45 can lose $455, and a naked short put can lose far more, which is why it needs a stress test.

## @takeaways
- Survive first, then grow: derive the number of contracts from the maximum loss per contract and the risk per trade; 1–2% of the account is a common cap.
- Losses multiply: losing \(L\) needs a gain of \(L/(1-L)\) to recover, so a 50% loss needs 100%.
- The Kelly fraction \(f^* = p - (1-p)/b\) is the growth-maximizing ceiling; at twice Kelly growth is about zero, and beyond that you lose in the long run.
- In practice use half Kelly or less: you give up about a quarter of the growth, cut the chance of being halved sharply, and survive an overestimated edge.
- Option payoffs are skewed: lottery-style trades have long losing streaks, premium-selling trades are hypersensitive to the win rate; add up correlated short positions, and size naked positions with vega budgets and stress tests.

## @quiz
1. A trade wins 55% of the time with a 1:1 payoff. What fraction of wealth does the Kelly criterion stake?
   - [ ] 55%
   - [ ] 5%
   - [x] 10%
   - [ ] 45%
   > \(f^* = p - (1-p)/b = 0.55 - 0.45 = 0.10\). 55% is the win rate itself; 5% is half Kelly, a common practical choice, but not the Kelly fraction.
2. For the same bet, what happens in the long run if you always stake twice the Kelly fraction (20%)?
   - [ ] Wealth grows twice as fast as at Kelly
   - [x] Long-run growth falls to about zero: typical wealth goes nowhere while drawdowns are huge
   - [ ] The same as Kelly, just a bit more volatile
   - [ ] You are certain to be wiped out within 10 bets
   > \(g(0.2) = 0.55\ln 1.2 + 0.45\ln 0.8 \approx 0\). The growth curve peaks at Kelly and returns to zero at twice Kelly; beyond that it is negative. Ruin is not certain, but the median path stops growing.
3. Kai's account is $20,000 with a 2% risk cap per trade. Selling one 95/90 put spread collects 0.45. How many can Kai sell?
   - [ ] 8, because \(400 \div 45 \approx 8.9\)
   - [x] None, because each can lose $455, more than the $400 budget
   - [ ] One, because the premium is small
   - [ ] Unlimited, because a spread's risk is capped
   > Size by the worst case, \((5 - 0.45) \times 100 = \$455\), not by the $45 collected. Capped risk is not the same as small risk.
4. An account has lost 50%. What gain does it need to get back to the start?
   - [ ] 50%
   - [ ] 75%
   - [x] 100%
   - [ ] 150%
   > \(G = L/(1-L) = 0.5/0.5 = 100\%\). The remaining half has to double — which is why sizing starts by avoiding deep drawdowns.
5. You have sold put spreads on five tech stocks whose pairwise correlation is about 0.8. Roughly how many independent bets is that?
   - [ ] 5
   - [ ] 4
   - [ ] 2.5
   - [x] About 1.2
   > \(N_{\text{eff}} = 5/(1 + 4 \times 0.8) \approx 1.2\). Highly correlated short positions lose together in a sell-off and should be sized as one trade.

## @further
- [Kelly (1956), A New Interpretation of Information Rate](https://doi.org/10.1002/j.1538-7305.1956.tb03809.x) — the original paper, derived from information theory.
- [Kelly criterion (Wikipedia)](https://en.wikipedia.org/wiki/Kelly_criterion) — derivation, fractional Kelly and common misuses in one place.
- [Risk of ruin (Wikipedia)](https://en.wikipedia.org/wiki/Risk_of_ruin) — definitions and the classic calculations.
- [Options Industry Council (OIC)](https://www.optionseducation.org/) — free options education backed by the OCC, with risk descriptions for every structure.
- [Strategy Path](https://evidex-cloud.github.io/droplet-labs-strategy-path/) — the sister course on decisions and games under uncertainty.

## @next
With size decided, you know *how much* risk you carry. Market makers sell thousands of options a day yet barely bet on direction — how do they hedge away delta, and what is left once they do? The next lesson, [[delta-hedging]], finds a pure bet on volatility underneath: gamma's gains against theta's bill.
