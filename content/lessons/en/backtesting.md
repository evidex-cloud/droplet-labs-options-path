---
id: backtesting
prereqs: options-data, liquidity-spreads, exercise-assignment, cash-secured-put, variance-risk-premium, position-sizing
demo: backtesting
---

# Backtesting Options Strategies: The Pitfalls

## @hook
A backtest is a story about the past told by your own code, and code is a generous storyteller. The same put-writing strategy on the same simulated market shows a Sharpe ratio of 4.8 or 0.2 depending on five choices you might not notice you made. This lesson names the five, prices each one, and shows how to build a test that is hard to fool.

## @bridge
[[options-data]] turned raw quotes into clean prices. [[cash-secured-put]] and [[variance-risk-premium]] explained why selling options earns a small premium most months and loses a lot in a few. Put the two together and the obvious next step is to test a premium-selling rule on history — and that is where most research goes wrong. This lesson builds Idea ③ (the volatility premium is real but small, so errors of a few percent swamp it) and Idea ④ (the risk sits in the tail that short samples never show). It hands its checklist to [[systematic-vol]], [[vol-forecasting]] and the code in [[python-backtest]].

## @intuition
Kai wants to earn income on cash while waiting to buy more XYZ. The rule is a classic from [[cash-secured-put]]: **every month, sell the 30-day put struck 5% below the stock, with enough cash to buy the shares if assigned.** With XYZ at $100, that is the 95 put at about $0.51 — $51 of premium on $9,500 of cash, every month.

> [!KAI] Kai's first backtest
> Kai tests the rule on five stocks over three calm years of a simulated history and gets a result that looks like a gift: **11.3% a year, a Sharpe ratio of 4.8, a worst drawdown of 0.6%**. Kai is ready to put real money in. Then Kai extends the test to ten years, keeps a stock that was later delisted, removes one line that peeked at the future, and charges the bid-ask spread and fees. The same strategy now shows **5.0% a year, a Sharpe ratio of 0.19 and a 13.4% drawdown** — barely better than holding Treasury bills at 4%.

Nothing about the strategy changed. What changed were the *assumptions of the test*. Each assumption looked harmless, each one flattered the result, and they multiply.

<figure>
<svg viewBox="0 0 660 260" role="img" aria-label="Equity curves of an honest backtest and a backtest with four pitfalls">
<line x1="70" y1="200" x2="600" y2="200" class="fx-axis"/>
<line x1="70" y1="30" x2="70" y2="200" class="fx-axis"/>
<line x1="70" y1="189" x2="600" y2="189" class="fx-grid"/>
<line x1="70" y1="132" x2="600" y2="132" class="fx-grid"/>
<line x1="70" y1="75" x2="600" y2="75" class="fx-grid"/>
<text x="62" y="193" text-anchor="end" class="fx-t-sm">1.0</text>
<text x="62" y="136" text-anchor="end" class="fx-t-sm">1.5</text>
<text x="62" y="79" text-anchor="end" class="fx-t-sm">2.0</text>
<rect x="235" y="30" width="17" height="170" class="fx-area-bad"/>
<rect x="372" y="30" width="6" height="170" class="fx-area-blue"/>
<text x="243" y="24" text-anchor="middle" class="fx-t-bad">sell-off</text>
<text x="380" y="24" text-anchor="middle" class="fx-t-blue">delisting</text>
<polyline points="70,189 79,186 87,184 96,182 105,180 113,178 122,175 131,173 139,170 148,168 157,166 165,163 174,160 183,158 191,156 200,153 209,153 217,149 226,146 235,144 243,143 252,142 261,137 269,134 278,139 287,136 295,132 304,128 313,125 321,121 330,120 339,117 347,114 356,111 365,107 373,102 382,100 391,95 399,91 408,87 417,83 425,78 434,73 443,68 451,63 460,60 469,59 477,61 486,56 495,53 503,50 512,58 521,54 529,50 538,44 547,41 555,39 564,40 573,39 581,36 590,32" class="fx-line-bad"/>
<polyline points="70,189 79,186 87,184 96,182 105,180 113,178 122,176 131,174 139,171 148,169 157,167 165,164 174,161 183,159 191,158 200,158 209,157 217,153 226,150 235,149 243,169 252,167 261,163 269,161 278,166 287,164 295,162 304,159 313,156 321,153 330,153 339,150 347,147 356,146 365,143 373,139 382,156 391,153 399,151 408,149 417,146 425,144 434,141 443,138 451,135 460,134 469,133 477,134 486,131 495,129 503,128 512,132 521,130 529,127 538,124 547,123 555,121 564,122 573,121 581,119 590,117" class="fx-line-thick"/>
<text x="80" y="50" class="fx-t-bad">four pitfalls: 9.1%/yr, Sharpe 1.84</text>
<text x="440" y="108" class="fx-t-b">honest: 5.0%/yr, Sharpe 0.19</text>
<text x="70" y="220" class="fx-t-sm">year 0</text>
<text x="330" y="220" text-anchor="middle" class="fx-t-sm">year 5</text>
<text x="590" y="220" text-anchor="end" class="fx-t-sm">year 10</text>
<text x="330" y="246" text-anchor="middle" class="fx-t-sm">equity of a 5-stock monthly put-write, start = 1 (simulated, illustrative)</text>
</svg>
<figcaption>Figure 1 · The same strategy on the same simulated market. The red curve fills at the mid, ignores fees, uses one line of look-ahead and drops the stock that was delisted; the black curve does none of these. Notice where the curves part: in the sell-off (red band) and at the delisting (violet band) — the pitfalls hide exactly the months that matter.</figcaption>
</figure>

A backtest has one job: to estimate what *would have happened* if you had run the rule in real time, with the information and prices available at each moment. Every pitfall in this lesson is a way of quietly giving the past version of you something the real one would not have had — a better price, tomorrow's news, a list of survivors, or a hundred tries at the answer.

::demo[backtesting-overfit]

The demo above makes the last of those concrete. Every "strategy" in it is pure noise with a true Sharpe of zero, yet if you try a hundred of them on five years of data, the best one shows a Sharpe ratio above 1 by luck alone.

We'll take it in six parts:

- **① What a backtest measures**: returns, the Sharpe ratio and the denominator
- **② Fills and costs**: mid fills, spreads, fees and the cost drag
- **③ Information leaks**: look-ahead, survivorship and stale data
- **④ Options mechanics**: early assignment, expiry, dividends and margin
- **⑤ Overfitting and multiple testing**: the deflated Sharpe ratio
- **⑥ Regimes, tails and an honest protocol**: walk-forward and the checklist

## @mechanics
### ① What a backtest measures

For a monthly strategy, the backtest produces a list of monthly returns \(r_1, r_2, \dots, r_n\). The headline statistic is the **Sharpe ratio**: average excess return per unit of volatility, annualized.

$$
\text{SR} = \frac{\bar r - r_f}{s}\,\sqrt{12}
$$

where \(\bar r\) is the average monthly return, \(r_f\) the monthly risk-free return, \(s\) the standard deviation of monthly returns and \(\sqrt{12}\) converts a monthly ratio into an annual one (returns add up over 12 months; volatility grows only with \(\sqrt{12}\)).

> [!EXAMPLE] Kai's honest Sharpe
> In the ten-year honest run the average monthly return is 0.423% with a standard deviation of 1.640%, and cash earns \(e^{0.04/12} - 1 = 0.334\%\) a month:
> $$
> \text{SR} = \frac{0.423\% - 0.334\%}{1.640\%} \times \sqrt{12} = 0.054 \times 3.464 \approx 0.19
> $$
> The numerator is tiny: the strategy beats cash by less than a tenth of a percent a month. **When the edge is that thin, a pitfall worth 0.1% a month doubles or erases it.** The monthly returns also have a skew of about −4.9: many small gains, a few large losses.

Two things to check before believing any Sharpe ratio. First, **the denominator of the return**. Kai's returns are on fully cash-secured capital ($9,500 per put). The same trades measured on a Reg T margin requirement — a fraction of that — would show several times the return, and several times the drawdown ([[margin-approval]]). Second, **the shape of the returns**. A short option strategy has many small gains and a few large losses: negative skew and fat tails. The Sharpe ratio, which only sees the average and the standard deviation, flatters such strategies until the tail arrives. Report the worst month, the maximum drawdown and the skew alongside it.

### ② Fills and costs: the price you could really get

The most common options backtest assumes you sold every put at the **mid**. You cannot sell at the mid; you sell at the bid, or somewhere between bid and mid if you are patient ([[liquidity-spreads]], [[execution-tca]]). On a $0.51 option a typical quote might be $0.46 / $0.56 — half a spread of $0.05 is **10% of the premium**, paid on every trade.

$$
\text{cost drag per year} = \frac{n\,(h + f)}{C}
$$

where \(n\) is the number of trades a year, \(h\) the half-spread you give up per share, \(f\) the fee per share and \(C\) the capital per share.

> [!EXAMPLE] What costs do to Kai's put-write
> Monthly, \(n = 12\), \(h = 0.05\), fee $0.65 per contract so \(f = 0.0065\), capital \(C = 95\):
> $$
> \text{drag} = \frac{12 \times (0.05 + 0.0065)}{95} = \frac{0.678}{95} = 0.71\% \text{ a year}
> $$
> Gross premium is \(12 \times 0.51 = 6.12\), or 6.44% of the capital, so costs take **11% of the income before a single loss**. Switch to a weekly version — the 7-day 97.5 put at about $0.25 with the same $0.05 half-spread — and the drag becomes \(52 \times 0.0565 / 97.5 = 3.0\%\) a year, about **22% of the premium**. Higher frequency multiplies the spread you pay; it does not multiply the edge.

In the main demo, switching "fill at mid" on lifts the Sharpe ratio from 0.19 to 0.32 — the single cheapest way to fool yourself. Fees on their own barely register for a monthly strategy (0.19 → 0.20); for listed options, **the spread is the cost that matters, not the commission**. Illiquid strikes add a second problem: a backtest may "fill" a hundred contracts at a quote that was good for five. Cap the traded size at a fraction of displayed size or of daily volume.

### ③ Information leaks: look-ahead, survivorship, stale data

**Look-ahead bias** means the backtest used information at time \(t\) that only became available after \(t\). It is rarely deliberate; it is usually one misaligned index.

> [!THINK] Kai adds a filter: "don't sell puts in months when volatility is high." In the code, the volatility at month \(t\) is computed from the returns *of month \(t\)*. What happens to the backtest?
> Predict: better, worse or the same?
> ---
> It looks better — the Sharpe ratio rises from 0.19 to 0.56 in the demo — because the filter "knows" which month will be violent and steps aside. It is using the month's own returns to decide whether to trade at the start of that month. The honest version, using *last* month's volatility (the demo's separate “honest filter” button), earns 0.18: no better than no filter at all, because the sell-offs arrive after calm months. An off-by-one index created the entire improvement.

Common leaks in options research: trading at the close on a signal computed from that close; using open interest before it was published ([[options-data]]); pairing a 16:15 option quote with a 16:00 stock price; normalizing a signal with the mean and standard deviation of the *whole* sample, future included; using dividend or earnings dates as later revised. The cure is **point-in-time** discipline: every input carries the timestamp at which it became known, and the backtest may only read inputs stamped before the decision.

**Survivorship bias** means the test universe contains only names that survived to the end. In the demo, one of the five stocks falls 65% and is delisted in year 6. Drop it — as a database of "today's optionable stocks" would — and the Sharpe ratio jumps from 0.19 to 1.03 and the drawdown shrinks from 13.4% to 5.1%. Put-sellers own precisely the stocks that collapse, so survivorship hurts them more than almost anyone.

**Stale data** is the options-specific cousin. In a crash, quotes on illiquid strikes lag; marking your short puts at yesterday's implied vol makes the drawdown look smaller than it was, and hides the margin call you would have received.

### ④ Options mechanics: assignment, expiry, dividends, margin

Stock backtests can ignore contract mechanics; options backtests cannot ([[exercise-assignment]]).

- **Early assignment.** Short American puts that go deep in the money can be exercised before expiry. With XYZ at $85 and 10 days left, the European value of the 95 put is $9.90 — *below* its $10.00 intrinsic value, because interest on the $95 strike (about $0.10) exceeds the remaining time value. A rational holder exercises now, and Kai owns the shares ten days early. A backtest that settles everything at expiry misses the stock position, its overnight risk and the margin it uses.
- **Short calls before ex-dividend.** Covered calls and short calls in spreads are at risk of assignment the day before the stock goes ex-dividend, when the dividend exceeds the call's remaining time value.
- **Expiry.** Options at least $0.01 in the money are exercised automatically by the OCC unless instructed otherwise; a short put that expires a cent in the money turns into 100 shares over the weekend. Pin risk near the strike makes the outcome uncertain until after the close.
- **Margin.** Short options tie up margin that changes with the market. A backtest on margin capital must simulate margin calls and forced liquidations at the worst prices, not just the P&L.

In the main demo the puts are cash-settled at expiry, which is a simplification; a production test (see [[python-backtest]]) should model assignment and the resulting stock position.

### ⑤ Overfitting and multiple testing

Suppose Kai tries strike distances of 3%, 5% and 10%, tenors of 7, 30 and 45 days, three profit-taking rules, two stop-losses and a volatility filter on or off: \(3 \times 3 \times 3 \times 2 \times 2 = 108\) variants. Kai reports the best one. How good would the best one look **if none of them had any edge**?

For \(N\) independent trials with true Sharpe ratio zero over \(Y\) years, the expected best estimated Sharpe ratio is approximately

$$
\E\Big[\max_{n \le N} \widehat{\text{SR}}_n\Big] \approx \frac{1}{\sqrt{Y}}\Big[(1-\gamma)\,Z^{-1}\big(1 - \tfrac1N\big) + \gamma\,Z^{-1}\big(1 - \tfrac{1}{Ne}\big)\Big]
$$

where \(Z^{-1}\) is the inverse of the standard normal distribution function \(\N\) (written \(Z^{-1}\), as in Bailey and López de Prado, so it is not confused with the number of trials \(N\)), \(\gamma \approx 0.5772\) is the Euler–Mascheroni constant, \(e \approx 2.718\), and \(1/\sqrt{Y}\) is roughly the standard error of an annualized Sharpe ratio estimated over \(Y\) years. The formula is from Bailey and López de Prado's work on the deflated Sharpe ratio.

> [!EXAMPLE] The luck you should expect
> \(N = 100\) variants, \(Y = 5\) years: \(Z^{-1}(0.99) = 2.326\) and \(Z^{-1}(1 - 1/(100e)) = 2.680\), so the bracket is \(0.4228 \times 2.326 + 0.5772 \times 2.680 = 2.53\), and
> $$
> \E[\max \widehat{\text{SR}}] \approx \frac{2.53}{\sqrt{5}} = 1.13
> $$
> **The best of 100 worthless strategies is expected to show a Sharpe ratio of about 1.1 over five years.** With 10 variants it is 0.70; with 1,000 it is 1.46. A reported Sharpe of 1.2 after trying 100 ideas is no evidence of skill at all.

> [!DEEP] The deflated Sharpe ratio
> Bailey and López de Prado turn this into a test. The **probabilistic Sharpe ratio** asks how likely the true Sharpe is above a benchmark \(\text{SR}^*\), given \(n\) observations and the returns' skewness \(\hat\gamma_3\) and kurtosis \(\hat\gamma_4\) (all per period, here per month):
> $$
> \text{PSR} = \N\!\left(\frac{(\widehat{\text{SR}} - \text{SR}^*)\sqrt{n-1}}{\sqrt{1 - \hat\gamma_3\,\widehat{\text{SR}} + \tfrac{\hat\gamma_4 - 1}{4}\,\widehat{\text{SR}}^2}}\right)
> $$
> The **deflated** Sharpe ratio sets \(\text{SR}^*\) equal to the expected maximum from the trials above. Example: an annual Sharpe of 1.5 over 60 months (0.433 per month), skew −1 and kurtosis 6 (typical of short-vol), after 100 trials (\(\text{SR}^* = 1.13\) annual, 0.327 monthly): \(z = (0.433 - 0.327)\sqrt{59}/\sqrt{1 + 0.433 + 1.25 \times 0.1875} = 0.63\), so the DSR is \(\N(0.63) = 0.74\). Against zero the same strategy looks 99.5% certain; against the luck of 100 trials, only 74% — short of the usual 95%. Negative skew makes it worse: short-vol returns need a *higher* Sharpe ratio to prove the same thing.

Defences, in order of power: **decide the rule before looking** (write it down); **count every variant you tried** and deflate; **hold out** a final test period you look at once; prefer rules with an economic reason (the variance risk premium) over rules that only fit.

### ⑥ Regimes, tails and an honest protocol

The calm-years test in Kai's story (Sharpe 4.8) did not contain a single bad month. That is the signature of every short-volatility backtest over a quiet sample: **the strategy looks best right before the tail**.

> [!WARN] February 2018
> Before February 2018, strategies that sold VIX futures or volatility had years of smooth returns. On **February 5, 2018** the VIX rose **20.01 points (+115.6%)** to close at **37.32**, its largest one-day percentage rise. The XIV exchange-traded note, a daily inverse-VIX-futures product with about $1.9 billion of assets the previous Friday, lost about **96%**; Credit Suisse announced an acceleration (termination) event on February 6. A backtest of short volatility ending in 2017 would have reported excellent risk-adjusted returns right up to that day ([[variance-risk-premium]], [[vix]]).

Regime dependence has no statistical fix; only coverage fixes it. Test over samples that include stress (1987, 2008, 2020, 2018, the April 2025 tariff shock) or, for synthetic tests, inject crashes deliberately. Then use **walk-forward** testing: choose parameters on a window, test on the next unseen window, roll forward, and stitch only the out-of-sample pieces together.

<figure>
<svg viewBox="0 0 660 200" role="img" aria-label="Walk-forward testing windows">
<text x="20" y="30" class="fx-t-b">walk-forward</text>
<rect x="120" y="45" width="200" height="22" rx="4" class="fx-box2"/>
<rect x="320" y="45" width="60" height="22" rx="4" class="fx-hl"/>
<rect x="180" y="80" width="200" height="22" rx="4" class="fx-box2"/>
<rect x="380" y="80" width="60" height="22" rx="4" class="fx-hl"/>
<rect x="240" y="115" width="200" height="22" rx="4" class="fx-box2"/>
<rect x="440" y="115" width="60" height="22" rx="4" class="fx-hl"/>
<rect x="300" y="150" width="200" height="22" rx="4" class="fx-box2"/>
<rect x="500" y="150" width="60" height="22" rx="4" class="fx-hl"/>
<text x="220" y="61" text-anchor="middle" class="fx-t-sm">choose parameters</text>
<text x="350" y="61" text-anchor="middle" class="fx-t-sm">test</text>
<text x="410" y="96" text-anchor="middle" class="fx-t-sm">test</text>
<text x="470" y="131" text-anchor="middle" class="fx-t-sm">test</text>
<text x="530" y="166" text-anchor="middle" class="fx-t-sm">test</text>
<line x1="120" y1="190" x2="620" y2="190" class="fx-axis"/>
<text x="620" y="184" text-anchor="end" class="fx-t-sm">time →</text>
<text x="20" y="84" class="fx-t-hl">only the blue</text>
<text x="20" y="101" class="fx-t-hl">pieces are</text>
<text x="20" y="118" class="fx-t-hl">reported</text>
</svg>
<figcaption>Figure 2 · Walk-forward testing. Parameters are chosen on a window (grey) and tested on the following window (blue) that the choice never saw; the window then rolls forward. The reported result is the chain of blue pieces — each one a genuine out-of-sample test.</figcaption>
</figure>

Put everything together and the honest protocol for an options backtest is a checklist:

| Step | Question | Kai's demo |
|---|---|---|
| Data | Point-in-time, cleaned, with delisted names? | survivorship: 1.03 → 0.19 |
| Fills | Bid/ask (or worse), size capped by liquidity? | mid fills: 0.32 → 0.19 |
| Information | Every input stamped before the decision? | look-ahead: 0.56 → 0.19 |
| Mechanics | Assignment, expiry, dividends, margin modeled? | cash settlement (simplified) |
| Trials | How many variants tried; deflated? | 100 trials → luck ≈ 1.1 |
| Regimes | Stress periods included; walk-forward? | calm-only: 3.87 → 0.19 |

<figure>
<svg viewBox="0 0 660 250" role="img" aria-label="Sharpe ratio falling as each pitfall is removed">
<line x1="50" y1="200" x2="630" y2="200" class="fx-axis"/>
<rect x="70" y="57" width="80" height="143" class="fx-fill-red"/>
<rect x="190" y="145" width="80" height="55" class="fx-fill-orange"/>
<rect x="310" y="178" width="80" height="22" class="fx-fill-orange"/>
<rect x="430" y="190" width="80" height="10" class="fx-fill-orange"/>
<rect x="550" y="194" width="80" height="6" class="fx-fill-ink"/>
<line x1="150" y1="57" x2="190" y2="57" class="fx-line-muted fx-dash"/>
<line x1="270" y1="145" x2="310" y2="145" class="fx-line-muted fx-dash"/>
<line x1="390" y1="178" x2="430" y2="178" class="fx-line-muted fx-dash"/>
<line x1="510" y1="190" x2="550" y2="190" class="fx-line-muted fx-dash"/>
<text x="110" y="49" text-anchor="middle" class="fx-t-b">4.77</text>
<text x="230" y="137" text-anchor="middle" class="fx-t-b">1.84</text>
<text x="350" y="170" text-anchor="middle" class="fx-t-b">0.74</text>
<text x="470" y="182" text-anchor="middle" class="fx-t-b">0.34</text>
<text x="590" y="186" text-anchor="middle" class="fx-t-b">0.19</text>
<text x="110" y="218" text-anchor="middle" class="fx-t-sm">all five on</text>
<text x="230" y="218" text-anchor="middle" class="fx-t-sm">+ full 10 years</text>
<text x="350" y="218" text-anchor="middle" class="fx-t-sm">+ delisted stock</text>
<text x="470" y="218" text-anchor="middle" class="fx-t-sm">− look-ahead</text>
<text x="590" y="218" text-anchor="middle" class="fx-t-sm">+ spreads, fees</text>
<text x="340" y="244" text-anchor="middle" class="fx-t-sm">Sharpe ratio of the same put-write as each pitfall is removed (simulated)</text>
</svg>
<figcaption>Figure 3 · A Sharpe-ratio waterfall. Starting from the "perfect" backtest (all five pitfalls on), each fix removes part of the result. The largest single drop comes from testing the full history instead of three calm years — the regime pitfall — and the last bar is the honest answer.</figcaption>
</figure>

A few lines of Python show the shape of an honest loop — decisions use only data up to the decision date, fills use the bid:

```python
for t, date in enumerate(dates[:-1]):
    snap = chain_at(date)                      # point-in-time snapshot, cleaned
    vol_signal = realized_vol(prices[:t + 1])  # only data up to today
    if vol_signal > vol_cap:                   # an honest filter
        continue
    put = pick_strike(snap, moneyness=0.95, dte=30)
    credit = put.bid - fee_per_share           # sell at the bid, not the mid
    settle = settle_or_assign(put, path_until_expiry(date))
    pnl.append((credit - settle) / put.strike + cash_return(date))
```

## @analogy
A backtest is like **a chess player replaying last year's tournament games at home**. Replaying is how you learn. But at home the player can take moves back, can glance at how the game ended, can skip the games they lost, and can replay the same opening a hundred ways until one of them wins. The result is a spotless record that says nothing about next year's tournament.

The pitfalls map one to one. **Mid fills** are replaying without the clock: every move made at leisure, at the ideal price. **Look-ahead** is glancing at the final position before choosing a move. **Survivorship** is skipping the games you lost. **Multiple testing** is replaying the opening a hundred ways and keeping the winner. **A calm sample** is only replaying games against weak opponents.

An honest backtest is a **simulated tournament**: a clock, no take-backs, no peeking, every game counted, and opponents of every strength. The analogy breaks in one important way: a chess player's past games at least follow the same rules as future ones. Markets change their rules — the volatility premium can shrink, liquidity can vanish, and a crash can be larger than anything in your sample. Even a perfect backtest estimates the past; it does not certify the future.

## @misconceptions
- **"A higher Sharpe ratio in the backtest means a better strategy."** — Only if the test is honest and the number of trials is counted. The best of 100 zero-edge variants shows a Sharpe of about 1.1 over five years; a short-vol backtest over a calm sample can show 4.
- **"Commissions are the main trading cost."** — For listed options the bid-ask spread dominates. On Kai's monthly put, half a spread is 10% of the premium, while the commission is about 1%.
- **"If the code never reads future prices, there's no look-ahead."** — Leaks come from timestamps: signals computed on the same close you trade at, open interest published the next morning, whole-sample normalization, revised data. One off-by-one index turned Kai's useless filter into an apparent improvement from 0.19 to 0.56.
- **"Ten years of data is enough to judge a short-volatility strategy."** — Only if those ten years include a real stress event. Short-vol strategies look best right before the tail; February 2018 ended years of smooth short-VIX returns in a day.
- **"Walk-forward testing removes overfitting."** — It removes the most direct form, but if you rerun walk-forward many times with different designs and keep the best, you have overfitted the walk-forward. Count all trials.

## @takeaways
- A backtest estimates what the rule would have earned in real time; every pitfall gives the past a price, a fact or a try it never had.
- For options, the spread is the big cost: selling at the bid instead of the mid can take 10–20% of the premium, more at higher frequency.
- Point-in-time discipline — every input timestamped before the decision — prevents look-ahead; point-in-time universes prevent survivorship.
- With \(N\) variants tried, luck alone produces a best Sharpe near \(\frac{1}{\sqrt{Y}}[(1-\gamma)Z^{-1}(1-\frac1N) + \gamma\,Z^{-1}(1-\frac{1}{Ne})]\); deflate reported results.
- Short-volatility backtests are only meaningful if they include stress; use walk-forward and report worst month, drawdown and skew next to the Sharpe ratio.

## @quiz
1. Kai's monthly put sells for $0.51 with a quote of $0.46 / $0.56. The backtest assumes fills at the mid. Roughly what share of the premium does this assumption hand Kai for free on each trade?
   - [ ] None — the mid is the fair price
   - [x] About 10%: half the $0.10 spread is $0.05 on a $0.51 premium
   - [ ] About 50%, because the spread is split in two
   - [ ] About 1%, the size of the commission
   > Selling means hitting the bid ($0.46), not the mid ($0.51). The $0.05 difference is about 10% of the premium on every trade — before fees, which are only about 1%.
2. Which of these is a look-ahead leak?
   - [ ] Selling puts at the bid instead of the mid
   - [ ] Including delisted stocks in the universe
   - [ ] Using last month's realized volatility to decide whether to trade this month
   - [x] Using this month's realized volatility to decide whether to sell a put at the start of this month
   > This month's volatility is only known at the end of the month. Using it at the start is look-ahead; the demo shows it turning a useless filter (Sharpe 0.18 honestly) into an apparent improvement to 0.56.
3. In the demo, dropping the delisted stock raises the Sharpe ratio from 0.19 to 1.03. Why does survivorship hurt put-sellers so much?
   - [x] Put-sellers are forced to buy exactly the stocks that collapse, so removing collapsed stocks removes their worst losses
   - [ ] Delisted stocks have no options, so they can't affect the result
   - [ ] Survivorship only affects dividends
   - [ ] Delisted stocks usually rise before delisting
   > A short put is a promise to buy after a fall. The names that fall hardest — and are later delisted — produce the largest losses. A survivors-only universe deletes them.
4. Kai tried 100 variants of a strategy on five years of data and the best shows an annual Sharpe of 1.2. What is the fairest reading?
   - [ ] Strong evidence of skill: a Sharpe above 1 is rare
   - [ ] Weak evidence, but a longer test would certainly confirm it
   - [x] Almost no evidence: the best of 100 zero-edge variants is expected to show about 1.1 by luck
   - [ ] The result is invalid because Sharpe ratios can't exceed 1
   > \(\E[\max \widehat{\text{SR}}] \approx 2.53/\sqrt{5} = 1.13\) for 100 trials over 5 years. A 1.2 is barely above what luck delivers; the deflated Sharpe ratio would be low.
5. A short-strangle backtest over the three calmest recent years shows a Sharpe ratio near 4 with a 1% drawdown. What is the most useful next step?
   - [ ] Increase leverage, since drawdowns are tiny
   - [x] Test over samples that include stress events, walk-forward, and report worst month and drawdown with the Sharpe ratio
   - [ ] Optimize the strike distance further on the same three years
   - [ ] Switch from monthly to daily options to earn more premium
   > Short-vol strategies look best right before the tail. Only samples that contain stress (or injected crashes) reveal the risk; more optimization on the same calm window just overfits, and higher frequency multiplies costs.

## @further
- [Bailey & López de Prado (2014), The Deflated Sharpe Ratio](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2460551) — the correction for selection bias, multiple testing and non-normal returns used in this lesson.
- [Cboe PutWrite Index white paper (Bondarenko)](https://cdn.cboe.com/resources/education/research_publications/PutWriteCBOE19_v14_by_Prof_Oleg_Bondarenko_as_of_June_14.pdf) — a long-horizon study of systematic put-writing, a benchmark for your own tests.
- [BIS Quarterly Review, March 2018: the VIX spike of February 2018](https://www.bis.org/publ/qtrpdf/r_qt1803t.htm) — what happened to short-volatility products when the calm ended.
- [OIC: options exercise FAQ](https://www.optionseducation.org/referencelibrary/faq/options-exercise) — automatic exercise and early-assignment rules a backtest must model.

## @next
Once a test is honest, which short-volatility strategies survive it — and why? The next lesson surveys the systematic families that institutions actually run: put-writing and buy-writes, hedged volatility selling, dispersion and skew trades, VIX-futures carry — and the crowding that links their worst days.
