---
id: vol-forecasting
prereqs: random-walk, realized-vol, implied-vol, variance-risk-premium, backtesting, systematic-vol
demo: vol-forecasting
---

# Volatility Forecasting: GARCH, HAR & Machine Learning

## @hook
Nobody can reliably say whether XYZ will be up or down tomorrow. But after a 3% drop, you can say with some confidence that tomorrow's move will probably be *bigger than usual* — and that this effect will fade over about a month. Volatility clusters and mean-reverts, so it can be forecast. A forecast of realized volatility, set against implied volatility, is how an options trader decides whether the premium is fat or thin.

## @bridge
[[realized-vol]] measured how much prices moved in the past; [[implied-vol]] read the price the market charges for future movement; [[systematic-vol]] harvested the gap between them on average. This lesson asks the sharper question: *how much will XYZ actually move over the next month?* It builds Idea ③ — implied vol is the quote, realized vol is the bill — by building the tools that estimate the bill in advance: EWMA, GARCH(1,1), HAR-RV and machine learning, judged with the right loss function. The same forecasting discipline returns in the AI lessons, [[neural-pricing]] and [[llm-signals]].

## @intuition
Look at any long chart of daily returns and one pattern jumps out: calm days come in stretches, wild days come in clusters. A large move today makes a large move tomorrow more likely — in either direction. That is **volatility clustering**. A second pattern is slower: after a storm, volatility drifts back toward a normal level. That is **mean reversion**.

> [!KAI] Kai's shock
> XYZ has been trading at its usual 20% annual volatility — a typical daily move of about \(0.20/\sqrt{252} \approx 1.26\%\). Today it falls **3%**. Kai's 30-day options are still priced at 20% implied. Two questions follow: how volatile will XYZ be tomorrow, and how volatile over the next month? A GARCH model with typical parameters answers **about 23.4%** for tomorrow and **about 22.9%** on average over the next 21 trading days — then slowly back toward 20%.

That is the whole game: use what just happened to estimate what will happen, and compare the estimate with what the options market charges. Direction stays a coin flip; *size* has memory.

<figure>
<svg viewBox="0 0 660 260" role="img" aria-label="Forecasts of volatility against the volatility later realized">
<line x1="60" y1="200" x2="620" y2="200" class="fx-axis"/>
<line x1="60" y1="30" x2="60" y2="200" class="fx-axis"/>
<line x1="60" y1="143" x2="620" y2="143" class="fx-grid"/>
<line x1="60" y1="87" x2="620" y2="87" class="fx-grid"/>
<line x1="60" y1="30" x2="620" y2="30" class="fx-grid"/>
<text x="52" y="204" text-anchor="end" class="fx-t-sm">10%</text>
<text x="52" y="147" text-anchor="end" class="fx-t-sm">20%</text>
<text x="52" y="91" text-anchor="end" class="fx-t-sm">30%</text>
<text x="52" y="34" text-anchor="end" class="fx-t-sm">40%</text>
<polyline points="60,110 69,88 79,92 88,72 97,69 107,83 116,74 125,77 135,93 144,104 153,106 163,127 172,118 181,118 191,116 200,121 209,132 219,112 228,100 237,100 247,79 256,67 265,55 275,86 284,86 293,125 303,131 312,134 321,128 331,102 340,84 349,74 359,80 368,62 377,89 387,107 396,114 405,137 415,156 424,163 433,160 443,158 452,165 461,154 471,160 480,168 489,167 499,165 508,161 517,170 527,165 536,153 545,155 555,152 564,148 573,146 583,158 592,161 601,167 611,178" class="fx-line-thick"/>
<polyline points="60,157 69,166 79,153 88,146 97,132 107,111 116,93 125,94 135,79 144,72 153,75 163,61 172,78 181,80 191,100 200,102 209,127 219,121 228,117 237,114 247,114 256,122 265,132 275,104 284,103 293,79 303,65 312,57 321,86 331,86 340,103 349,124 359,134 368,137 377,100 387,84 396,75 405,76 415,68 424,88 433,106 443,113 452,137 461,161 471,156 480,154 489,155 499,165 508,156 517,159 527,166 536,169 545,166 555,159 564,161 573,171 583,154 592,155 601,153 611,150" class="fx-line-bad fx-dash"/>
<polyline points="60,135 69,144 79,140 88,134 97,126 107,89 116,81 125,101 135,82 144,77 153,81 163,63 172,93 181,105 191,108 200,106 209,100 219,117 228,115 237,108 247,117 256,129 265,132 275,85 284,107 293,61 303,67 312,74 321,100 331,115 340,126 349,120 359,103 368,125 377,85 387,79 396,88 405,83 415,87 424,97 433,115 443,130 452,133 461,150 471,138 480,140 489,143 499,154 508,148 517,141 527,151 536,161 545,158 555,141 564,148 573,160 583,142 592,145 601,144 611,143" class="fx-line-hl"/>
<text x="340" y="222" text-anchor="middle" class="fx-t-sm">240 trading days of simulated GARCH data (out of sample)</text>
<text x="70" y="248" class="fx-t-b">— realized, next 21 days</text>
<text x="280" y="248" class="fx-t-hl">— GARCH(1,1) forecast</text>
<text x="470" y="248" class="fx-t-bad">- - past 21 days</text>
</svg>
<figcaption>Figure 1 · Forecasting on simulated data. The black line is what actually happened over the *next* 21 days; the dashed red line simply repeats the *last* 21 days, so it lags every turn by about a month; the blue GARCH forecast looks similar but turns a little sooner and is pulled toward the long-run level (late in the sample it stays near 20% while the others sag). Both trail the black line: no forecast catches every wiggle, because realized volatility is itself noisy.</figcaption>
</figure>

Why should an options trader care? Because option prices are set in implied volatility, and profits from holding or hedging options come from realized volatility ([[delta-hedging]]). If your forecast of realized says 23% while the market charges 20%, options look cheap *relative to your forecast*; if it says 16%, they look rich. The forecast does not tell you what to do — the [[variance-risk-premium]] means implied has usually sat above realized — but it tells you where today sits relative to the average.

We'll take it in six parts:

- **① What to forecast**: the target, the horizon and the units
- **② EWMA**: yesterday's estimate plus today's surprise
- **③ GARCH(1,1)**: adding a long-run level and mean reversion
- **④ Realized measures and HAR**: intraday data and three horizons
- **⑤ Implied vol, machine learning and honest evaluation**: QLIKE and leakage
- **⑥ Using a forecast**: against implied vol, events and regimes

## @mechanics
### ① What to forecast

Volatility is not observed directly, so first define the target. The standard choice is the **realized variance** over the horizon \(h\) you care about:

$$
\text{RV}_{t \to t+h} = \frac{252}{h}\sum_{i=1}^{h} r_{t+i}^2
$$

where \(r_{t+i}\) are the daily log returns over the next \(h\) trading days, and 252 annualizes (this lesson uses trading days throughout; the pricing lessons use calendar days/365 for \(T\) — say which you mean). The daily mean is usually set to zero; over a day it is tiny next to the squared moves. Realized *vol* is \(\sqrt{\text{RV}}\).

Two choices matter more than they seem. **Horizon:** to compare with a 30-day option, forecast about 21 trading days ahead, not one day. **Units:** forecast *variance* and take the square root at the end. Variance adds over time and is what option P&L depends on (\(\tfrac12\Gamma S^2\sigma^2\)); averaging vols instead of variances understates the average, because of Jensen's inequality ([[linear-vs-convex]]).

Every model below produces the same kind of object: an estimate of tomorrow's variance, \(\sigma_{t+1}^2\), plus a rule for extending it to longer horizons.

### ② EWMA: yesterday's estimate plus today's surprise

The simplest serious forecaster is the **exponentially weighted moving average**:

$$
\sigma_{t+1}^2 = \lambda\,\sigma_t^2 + (1 - \lambda)\,r_t^2
$$

where \(\sigma_t^2\) is yesterday's variance estimate, \(r_t\) today's return and \(\lambda\) (between 0 and 1) the memory: the weight on the past. Unrolled, it is a weighted average of all past squared returns, with weights shrinking by a factor \(\lambda\) per day. The RiskMetrics convention for daily data is \(\lambda = 0.94\), a memory with a half-life of about 11 days (\(\ln 0.5/\ln 0.94\)).

Apply it to Kai's day. Daily variance at 20% a year is \(0.20^2/252 = 1.587 \times 10^{-4}\); with \(r_t = -0.03\),

$$
\sigma_{t+1}^2 = 0.94 \times 1.587\times 10^{-4} + 0.06 \times 0.0009 = 2.032 \times 10^{-4}
$$

which annualizes to \(\sqrt{2.032\times 10^{-4} \times 252} = 22.6\%\).

EWMA has one blind spot: it has **no long-run level**. Its forecast for every future day is the same number — 22.6% tomorrow, 22.6% a year from now. That is fine for short-horizon risk, but wrong for pricing a 1-year option after a shock, when volatility is very likely to have calmed down.

### ③ GARCH(1,1): mean reversion built in

Bollerslev's **GARCH(1,1)** (1986) adds a constant that pulls the variance toward a long-run level:

$$
\sigma_{t+1}^2 = \omega + \alpha\,\varepsilon_t^2 + \beta\,\sigma_t^2
$$

where \(\varepsilon_t\) is today's return shock (here just \(r_t\)), \(\alpha\) is the reaction to news, \(\beta\) the memory, and \(\omega > 0\) sets the anchor. When \(\alpha + \beta < 1\), the variance reverts to

$$
\bar\sigma^2 = \frac{\omega}{1 - \alpha - \beta}, \qquad \E_t\big[\sigma_{t+h}^2\big] = \bar\sigma^2 + (\alpha + \beta)^{h-1}\big(\sigma_{t+1}^2 - \bar\sigma^2\big)
$$

The sum \(\alpha + \beta\) is the **persistence**: how much of today's excess variance survives each day. Its half-life is \(\ln 0.5 / \ln(\alpha + \beta)\) days. EWMA is the special case \(\omega = 0\), \(\alpha + \beta = 1\): infinite persistence, no anchor.

> [!EXAMPLE] GARCH after Kai's −3% day
> Take typical daily parameters \(\alpha = 0.08\), \(\beta = 0.90\) and a long-run level of 20% a year, so \(\bar\sigma^2 = 1.587\times 10^{-4}\) and \(\omega = \bar\sigma^2(1 - 0.98) = 3.17\times 10^{-6}\). Starting from the long-run level:
> $$
> \sigma_{t+1}^2 = 3.17\times 10^{-6} + 0.08 \times 0.0009 + 0.90 \times 1.587\times 10^{-4} = 2.180\times 10^{-4}
> $$
> That is **23.4%** annualized for tomorrow. The persistence is 0.98, so the half-life is \(\ln 0.5/\ln 0.98 = 34\) trading days. The forecast for day 21 is 22.4%, for day 63 21.0%, for day 252 20.0%; averaged over the next 21 days, **22.9%**.

<figure>
<svg viewBox="0 0 660 250" role="img" aria-label="GARCH forecast decaying to the long-run level while EWMA stays flat">
<line x1="70" y1="200" x2="620" y2="200" class="fx-axis"/>
<line x1="70" y1="30" x2="70" y2="200" class="fx-axis"/>
<text x="62" y="204" text-anchor="end" class="fx-t-sm">19%</text>
<text x="62" y="172" text-anchor="end" class="fx-t-sm">20%</text>
<text x="62" y="108" text-anchor="end" class="fx-t-sm">22%</text>
<text x="62" y="44" text-anchor="end" class="fx-t-sm">24%</text>
<line x1="70" y1="168" x2="620" y2="168" class="fx-line-muted fx-dash"/>
<line x1="70" y1="84" x2="620" y2="84" class="fx-line-blue fx-dash"/>
<polyline points="70,58 77,64 83,70 90,75 96,80 103,85 109,90 116,94 122,98 129,102 135,106 142,109 148,113 155,116 176,125 198,133 220,139 241,144 263,148 285,152 306,155 328,157 350,159 371,161 393,162 415,163 437,164 458,165 480,165 502,166 523,166 545,167 567,167 588,167 610,167" class="fx-line-thick"/>
<line x1="142" y1="109" x2="142" y2="200" class="fx-line fx-dash"/>
<text x="148" y="190" class="fx-t-sm">half-life ≈ 34 days</text>
<text x="400" y="78" class="fx-t-blue">EWMA: 22.6% at every horizon</text>
<text x="400" y="186" class="fx-t-sm">long-run level 20%</text>
<text x="160" y="58" class="fx-t-b">GARCH: 23.4% → 20%</text>
<text x="70" y="220" class="fx-t-sm">1 day</text>
<text x="345" y="220" text-anchor="middle" class="fx-t-sm">125</text>
<text x="610" y="220" text-anchor="end" class="fx-t-sm">250 trading days</text>
<text x="345" y="242" text-anchor="middle" class="fx-t-sm">forecast horizon h, after a −3% day (α = 0.08, β = 0.90)</text>
</svg>
<figcaption>Figure 2 · Same shock, two term structures. GARCH forecasts elevated vol tomorrow and lets it decay toward the long-run 20%, halving the excess every 34 days; EWMA carries 22.6% to every horizon. For a 1-year option the difference is about two vol points (22.6% against a GARCH year-average of 20.7%).</figcaption>
</figure>

::demo[vol-forecasting-meanrev]

> [!THINK] A 1-year XYZ option after the −3% day: EWMA says 22.6%, GARCH says tomorrow's vol is 23.4%. Which number is closer to GARCH's forecast for the average vol over the whole year?
> Guess before reading: above 22.6%, between 20% and 22.6%, or below 20%?
> ---
> Between — and much closer to 20%. The excess variance halves every 34 days, so over 252 days most of the shock has faded; the year's average variance comes out at about 20.7% in vol terms. EWMA's flat 22.6% would overprice a 1-year option by about two vol points. This is why term-structure models (and the market's own implied term structure, [[term-structure]]) matter after shocks.

GARCH parameters are estimated by **maximum likelihood**. Many extensions exist; the most useful for equities adds the **leverage effect** — falls raise volatility more than rises of the same size — by giving negative shocks an extra coefficient (GJR-GARCH, EGARCH).

> [!DEEP] Fitting GARCH by maximum likelihood
> If \(r_t = \sigma_t z_t\) with \(z_t\) standard normal, the log-likelihood of a return series is
> $$
> \ell(\omega,\alpha,\beta) = -\tfrac12\sum_t\Big(\ln\sigma_t^2 + \frac{r_t^2}{\sigma_t^2}\Big) + \text{const}
> $$
> with \(\sigma_t^2\) built by the recursion. Maximize it subject to \(\omega > 0\), \(\alpha, \beta \ge 0\), \(\alpha + \beta < 1\). A common shortcut, **variance targeting**, fixes \(\omega = \hat\sigma^2(1 - \alpha - \beta)\) using the sample variance, leaving a two-parameter search — the main demo does this with a small grid. In code the `arch` package in Python does the whole job; the engine's `garch11` in this course filters a series once the parameters are known.

### ④ Realized measures and HAR-RV

Daily squared returns are a very noisy measure of a day's variance: a stock can swing 3% intraday and close unchanged. With intraday data you can do much better. The **realized variance** of one day sums squared intraday returns:

$$
\text{RV}_t = \sum_{j=1}^{m} r_{t,j}^2
$$

where \(r_{t,j}\) are the \(m\) intraday returns (for example \(m = 78\) five-minute returns in a 6.5-hour session). Seventy-eight five-minute moves of about 0.14% each give \(78 \times 0.0014^2 = 1.53\times 10^{-4}\), a daily vol of 1.24%, or \(19.6\%\) annualized. Sampling faster is not always better: at very high frequency, bid-ask bounce adds noise ("microstructure noise"), which is why 5-minute sampling became a common compromise.

With a good daily RV series, a remarkably strong forecaster is Corsi's **HAR-RV** model (2009): regress tomorrow's variance on today's, this week's and this month's:

$$
\text{RV}_{t+1} = b_0 + b_d\,\text{RV}_t + b_w\,\text{RV}_t^{(w)} + b_m\,\text{RV}_t^{(m)} + \epsilon_{t+1}
$$

where \(\text{RV}_t^{(w)}\) is the average over the last 5 days and \(\text{RV}_t^{(m)}\) over the last 22. The intuition is a market of traders with different horizons — day traders, weekly rebalancers, monthly allocators — each reacting to volatility at their own scale. Three terms mimic the long memory that GARCH's single exponential decay misses, and the model is estimated by ordinary least squares.

> [!EXAMPLE] A HAR forecast with illustrative coefficients
> Suppose (for illustration, not estimates) \(b_0 = 0.002\), \(b_d = 0.35\), \(b_w = 0.35\), \(b_m = 0.25\), all in annualized variance units. Today's RV corresponds to 30% vol (0.09), this week's to 25% (0.0625), this month's to 18% (0.0324):
> $$
> \widehat{\text{RV}}_{t+1} = 0.002 + 0.35 \times 0.09 + 0.35 \times 0.0625 + 0.25 \times 0.0324 = 0.0635
> $$
> a forecast of \(\sqrt{0.0635} = 25.2\%\). The coefficients sum to 0.95, so the model reverts to \(b_0/(1 - 0.95) = 0.04\), i.e. 20% vol.

### ⑤ Implied vol, machine learning and honest evaluation

**Implied vol as a forecaster.** The market's own forecast is free: the 30-day implied vol. It reacts instantly to news and scheduled events. It is also biased upward on average, because it includes the variance risk premium — the S&P 500 average VIX of 19.6% against 15.5% subsequent realized volatility (1990 to about 2024) is exactly that bias. Forecasting practice therefore often combines both: regress future RV on HAR terms *and* implied variance, and let the data decide the weights.

**Machine learning.** Gradient-boosted trees and neural networks can use many more inputs — lagged RVs at several horizons, implied vol and skew, volume, earnings dates, macro calendars — and capture non-linear effects. On volatility the gains over a well-built HAR-with-IV model are usually modest, and they vanish quickly if evaluation is sloppy. The two classic mistakes:

> [!WARN] Leakage in volatility ML
> A 21-day forward target at day \(t\) uses returns from \(t+1\) to \(t+21\). Neighboring training rows therefore share 20 of their 21 target days, and if the test period starts right after the training period, the last training targets overlap the first test days. **Purge** training rows whose target window reaches into the test period, add an **embargo** gap, and use **walk-forward** splits ([[backtesting]]). The second mistake is normalizing features with the mean and standard deviation of the whole sample — future included. Compute scalers on the training window only.

**Choosing a loss function.** The realized-variance target is noisy, so the loss function must rank forecasts correctly *despite* that noise. Two losses are known to do so for variance forecasts (Patton, 2011): the mean squared error on variance, and **QLIKE**:

$$
\text{QLIKE}(\hat\sigma^2, \text{RV}) = \frac{\text{RV}}{\hat\sigma^2} - \ln\frac{\text{RV}}{\hat\sigma^2} - 1
$$

where \(\hat\sigma^2\) is the forecast and \(\text{RV}\) the realized variance; it is zero for a perfect forecast and positive otherwise. QLIKE is asymmetric: it punishes under-forecasting more than over-forecasting, which suits risk management and option selling, where underestimating volatility is the costly mistake.

> [!EXAMPLE] QLIKE vs MSE on one day
> Realized variance 0.04 (20% vol). Forecast A: 0.03 (17.3%). Forecast B: 0.05 (22.4%). Both miss by 0.01, so MSE scores them equally: \(0.01^2 = 10^{-4}\). QLIKE does not: A scores \(1.333 - \ln 1.333 - 1 = 0.0457\); B scores \(0.8 - \ln 0.8 - 1 = 0.0231\). **The under-forecast costs twice as much.**

The main demo runs this horse race on simulated GARCH data: a 21-day historical window, EWMA, GARCH fitted on the first half, and HAR fitted by least squares, scored out of sample with both losses. Because the data really is GARCH, GARCH usually wins — but not always, and never by much. Even with the right model, a 750-day test sample leaves plenty of noise in the ranking.

### ⑥ Using a forecast: against implied vol, events and regimes

A forecast becomes useful when set against a price. After Kai's shock, the GARCH average for the next 21 days is 22.9%. If the 30-day straddle still trades at 20% implied ($4.57), it would be worth $5.24 at 22.9%. That gap is a *measurement*, not a trade signal on its own: the variance risk premium says implied usually exceeds realized, so a forecast above implied is unusual and deserves scrutiny — is the model overreacting to one day, or is the market slow?

Three practical adjustments separate working forecasts from textbook ones:

- **Scheduled events.** Earnings, central-bank meetings and economic releases create known jumps. Time-series models don't see them coming; add event variance explicitly, as in [[earnings-events]], and forecast the "ex-event" diffusion separately.
- **Regimes and jumps.** GARCH-type models adapt within days, but a structural shift (a new policy regime, a crisis) can change the long-run level itself. Re-estimate on rolling windows and watch the fitted persistence: estimates creeping toward 1 often signal a regime change rather than a slow decay.
- **Horizon matching.** Forecast the variance over the life of the option you are comparing with, not tomorrow's variance.

A final caution: better volatility forecasts shrink errors but don't remove them. Out-of-sample improvements over simple benchmarks are typically modest, and what matters economically is whether the improvement survives costs and sizing ([[execution-tca]], [[position-sizing]]).

## @analogy
Volatility forecasting is **weather forecasting**, not lottery prediction. Whether it rains on one particular street at 3 p.m. tomorrow is close to a coin flip; whether tomorrow will be stormy, given that today was stormy, is not. Storm systems persist for days and then blow over — clustering and mean reversion.

EWMA is the forecaster who says "tomorrow will be like the last week or two". GARCH adds climate: "stormy now, but this region averages mild weather, and storms here usually halve in strength every few weeks". HAR listens to three forecasters with different horizons — tomorrow's, this week's, this month's — and blends them. The implied vol is the price of storm insurance quoted by the market, which includes the insurer's margin; the variance risk premium is that margin. Machine learning is a forecaster with satellite images and many more instruments — useful, but only if they check their forecasts against days they haven't seen.

The analogy breaks in one place: the weather doesn't read the forecast. Markets do. If many traders sell options whenever their models predict calm, their selling can itself change the volatility that follows.

## @misconceptions
- **"If returns are unpredictable, volatility must be too."** — The sign of tomorrow's return is close to unpredictable, but its size is not: large moves cluster and fade gradually. That is why GARCH and HAR forecasts beat a constant.
- **"A longer history window always gives a better volatility estimate."** — A long window reacts slowly and lags every turn by about half its length. The best models weight recent data more (EWMA, GARCH) and add a long-run anchor.
- **"EWMA and GARCH are basically the same."** — For tomorrow they are close; for longer horizons they are not. EWMA has no long-run level, so after a shock it overstates the 1-year average by about two vol points in Kai's example (22.6% vs 20.7%).
- **"Implied vol is the best forecast, so there's nothing to add."** — Implied vol is informative but biased upward by the variance risk premium, and it can lag after sudden moves. Combining implied vol with realized-based terms usually does better than either alone.
- **"Lower mean squared error means a better forecast."** — Only with a robust loss and an honest test. MSE on noisy proxies can reward the wrong model on vols, and scores computed with overlapping targets or leaked features mean nothing. Use MSE on variance or QLIKE, walk-forward, purged.

## @takeaways
- Forecast realized *variance* over the horizon of the option you compare with, then take the square root.
- EWMA \(\sigma_{t+1}^2 = \lambda\sigma_t^2 + (1-\lambda)r_t^2\) reacts to news but has no long-run level.
- GARCH(1,1) adds mean reversion: long-run \(\omega/(1-\alpha-\beta)\), half-life \(\ln 0.5/\ln(\alpha+\beta)\); after a −3% day it forecasts 23.4% tomorrow and 22.9% over the next month.
- HAR-RV blends daily, weekly and monthly realized variance; with intraday data it is a strong, simple benchmark.
- Implied vol is informative but carries the variance risk premium; combine it with realized-based terms.
- Judge forecasts with MSE on variance or QLIKE, out of sample, with purged walk-forward splits.

## @quiz
1. A GARCH(1,1) model has \(\alpha = 0.08\) and \(\beta = 0.90\). After a shock, roughly how long until half of the excess variance has faded?
   - [ ] About 1 day
   - [x] About 34 trading days
   - [ ] About 250 trading days
   - [ ] It never fades
   > The persistence is \(\alpha + \beta = 0.98\), so the half-life is \(\ln 0.5/\ln 0.98 \approx 34\) days. It would never fade only if \(\alpha + \beta = 1\), as in EWMA.
2. After Kai's −3% day, EWMA (\(\lambda = 0.94\)) forecasts 22.6% and GARCH forecasts 23.4% for tomorrow. What do they say about the average vol over the next year?
   - [ ] Both forecast about 23% for the whole year
   - [ ] EWMA forecasts a decline to 20%; GARCH stays at 23.4%
   - [ ] Both forecast exactly 20%
   - [x] EWMA keeps 22.6% at every horizon, while GARCH decays toward its 20% long-run level, averaging close to 20% over a year
   > EWMA has no long-run anchor, so its term structure is flat. GARCH's excess variance halves every 34 days, so most of the shock is gone within a year.
3. Realized variance turns out to be 0.04. Forecast A was 0.03 and forecast B was 0.05. Which statement is true?
   - [x] MSE scores them equally, but QLIKE penalizes A (the under-forecast) about twice as much as B
   - [ ] Both losses prefer A because it is lower
   - [ ] QLIKE scores them equally because both miss by 0.01
   - [ ] MSE penalizes B more because it is larger
   > Both miss by 0.01, so the squared errors are equal. QLIKE gives A 0.0457 and B 0.0231: under-forecasting variance is punished more.
4. An ML model predicts 21-day forward realized vol. The data is split randomly into training and test rows. What is the main problem?
   - [ ] Random splits make the model too simple
   - [ ] 21 days is too short for machine learning
   - [x] Neighboring rows share most of their target window, so random splits leak the test targets into training; use purged walk-forward splits
   - [ ] Nothing, as long as the test set is large
   > A 21-day target at day \(t\) overlaps the targets of days \(t \pm 1, \dots, t \pm 20\). Random splits put near-duplicates on both sides; purging and walk-forward splits prevent it.
5. Over 1990 to about 2024 the average VIX was 19.6% while subsequent realized S&P 500 volatility averaged 15.5%. What does this say about implied vol as a forecaster?
   - [ ] Implied vol is useless as a forecast
   - [x] It is informative but biased upward on average, because it includes the variance risk premium
   - [ ] Implied vol is always exactly right; realized vol is measured wrongly
   - [ ] The gap shows implied vol is biased downward
   > The 4-point gap is the variance risk premium. Implied vol still moves with future realized vol, which is why forecasting models often combine it with realized-based terms.

## @further
- [Corsi (2009), A Simple Approximate Long-Memory Model of Realized Volatility](https://academic.oup.com/jfec/article/7/2/174/856522) — the HAR-RV paper: three horizons, least squares, and a benchmark that is hard to beat.
- [Bollerslev (1986), Generalized Autoregressive Conditional Heteroskedasticity](https://doi.org/10.1016/0304-4076%2886%2990063-1) — the original GARCH paper.
- [CFA Institute: How well does the market predict volatility?](https://blogs.cfainstitute.org/investor/2024/07/31/how-well-does-the-market-predict-volatility/) — VIX against realized volatility, the bias of implied vol in numbers.
- [Autoregressive conditional heteroskedasticity (Wikipedia)](https://en.wikipedia.org/wiki/Autoregressive_conditional_heteroskedasticity) — ARCH, GARCH and their many variants in one place.

## @next
Every model here was fitted to a price series and then trusted to price or trade. In the final lesson of this stage the question becomes practical: once you know what to trade, how do you get it done without the market eating your edge — slippage, spreads, auctions and the Almgren–Chriss trade-off between speed and risk.
