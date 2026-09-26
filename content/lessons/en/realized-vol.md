---
id: realized-vol
prereqs: random-walk, black-scholes, bs-assumptions
demo: realized-vol
---

# Realized Volatility: Measuring How Much Prices Move

## @hook
Black-Scholes needs one number nobody can see: σ, how hard the price shakes. Before we ask what the market *expects*, we measure what the price *did*: take daily log returns, compute their standard deviation, and scale it to a year. For XYZ, “20% volatility” turns out to mean a typical day of about 1.26%.

## @bridge
In [[random-walk]] σ was the width of the random walk, growing like \(\sqrt{T}\). In [[black-scholes]] it was the only one of the five inputs you cannot read off a screen, and [[bs-assumptions]] showed it is not even constant: calm weeks and stormy weeks alternate. This lesson answers a practical question: **given a price history, how do you put a number on how much it moved, and how much should you trust that number?** It builds Idea ③ — volatility. Realized volatility is the *bill* that the next lesson's *quote*, [[implied-vol]], is compared against.

## @intuition
Start with a picture. Below are two 20-day price paths. Both start at $100 and both end at $102 — the same 2% return. Yet nobody would call them the same stock.

<figure>
<svg viewBox="0 0 640 220" role="img" aria-label="Two price paths with the same start and end but different volatility">
<line x1="60" y1="190" x2="600" y2="190" class="fx-axis"/>
<line x1="60" y1="30" x2="60" y2="190" class="fx-axis"/>
<line x1="60" y1="175" x2="600" y2="175" class="fx-grid"/>
<line x1="60" y1="135" x2="600" y2="135" class="fx-grid"/>
<line x1="60" y1="95" x2="600" y2="95" class="fx-grid"/>
<line x1="60" y1="55" x2="600" y2="55" class="fx-grid"/>
<text x="52" y="179" text-anchor="end" class="fx-t-sm">95</text>
<text x="52" y="139" text-anchor="end" class="fx-t-sm">100</text>
<text x="52" y="99" text-anchor="end" class="fx-t-sm">105</text>
<text x="52" y="59" text-anchor="end" class="fx-t-sm">110</text>
<polyline points="70,135.0 95,157.2 120,145.7 145,159.3 170,140.8 195,172.2 220,156.0 245,138.1 270,136.6 295,131.0 320,135.9 345,108.7 370,96.9 395,80.8 420,79.4 445,100.2 470,64.8 495,38.0 520,49.9 545,80.9 570,119.0" class="fx-line-bad"/>
<polyline points="70,135.0 95,135.0 120,132.3 145,123.7 170,118.3 195,126.1 220,125.6 245,113.1 270,114.0 295,114.9 320,118.6 345,120.2 370,116.4 395,112.5 420,114.4 445,113.7 470,118.5 495,124.3 520,122.9 545,118.3 570,119.0" class="fx-line-hl"/>
<circle cx="70" cy="135" r="5" class="fx-fill-ink"/>
<circle cx="570" cy="119" r="5" class="fx-fill-ink"/>
<text x="578" y="123" class="fx-t-sm">102</text>
<text x="330" y="208" text-anchor="middle" class="fx-t-sm">trading days (20)</text>
<text x="360" y="182" class="fx-t-hl">calm path: realized vol ≈ 9%</text>
<text x="250" y="52" class="fx-t-bad">stormy path: realized vol ≈ 41%</text>
</svg>
<figcaption>Figure 1 · Same start ($100), same end ($102), same 2% return — but the red path moves about four times as much each day. Realized volatility measures the size of the daily steps and ignores where the path ends up.</figcaption>
</figure>

Volatility is about the **size of the steps**, not the direction of the trip. The recipe has three moves, and you can do it with a calculator.

**Step 1 — turn prices into daily returns.** Here are six daily closes for XYZ (illustrative): 100, 101.20, 99.90, 100.80, 99.50, 100.40. We use *log returns*, \(r = \ln(P_{\text{today}}/P_{\text{yesterday}})\), which for small moves are almost the same as percentage changes:

| Day | Close | Log return | Minus the average (0.080%) |
|---|---|---|---|
| 1 | 101.20 | +1.193% | +1.113% |
| 2 | 99.90 | −1.293% | −1.373% |
| 3 | 100.80 | +0.897% | +0.817% |
| 4 | 99.50 | −1.298% | −1.378% |
| 5 | 100.40 | +0.900% | +0.821% |

**Step 2 — take the standard deviation.** Square each deviation, add them up, divide by \(n - 1 = 4\), and take the square root. That gives a **daily** volatility of about 1.26%.

**Step 3 — scale to a year.** Variance (the square of volatility) adds up over independent days, so volatility grows with the square root of time. With about 252 trading days a year, multiply by \(\sqrt{252} \approx 15.87\): \(1.26\% \times 15.87 \approx 20.0\%\). That is XYZ's realized volatility over this week — exactly the 20% the course uses for pricing.

> [!KAI] What “20%” means for Kai's shares
> Kai owns 100 XYZ at $100. At 20% annual volatility, a typical trading day moves XYZ about \(20\% / \sqrt{252} \approx 1.26\%\), or roughly $1.26 per share and $126 on the position. Over the 30 calendar days until earnings, one standard deviation is \(100 \times 0.20 \times \sqrt{30/365} \approx \$5.73\) per share. About two months in three, XYZ should finish that month within ±$5.73 of where it started — *if* the next month shakes like the last one did.

> [!THINK] XYZ goes +1% one day and −1% the next, over and over, for a month. What is its realized volatility — and its return?
> Predict both numbers before you open the answer.
> ---
> The daily standard deviation is 1%, so realized vol is \(1\% \times \sqrt{252} \approx 15.9\%\) — a perfectly ordinary number. The return is almost zero, in fact slightly negative: \(1.01 \times 0.99 = 0.9999\) per pair of days. Volatility and return are different questions; a stock can go nowhere and still be volatile (and volatility itself drags compound returns down a little — the \(\tfrac12\sigma^2\) of [[random-walk]]).

That three-step recipe is the whole idea. The rest of the lesson is about doing it well: which returns to use, how to scale them, how long a window to take, how to squeeze more information out of each day, and how to cope with the fact that volatility itself keeps changing.

We'll take it in six parts:

- **① The close-to-close estimator**: the formula behind the recipe
- **② Annualizing**: the square-root-of-time rule, 252 vs 365, and the rule of 16
- **③ Window length and sampling error**: why a one-month number is fuzzy, and the vol cone
- **④ Using the whole day**: the Parkinson high–low estimator
- **⑤ Volatility clusters**: EWMA and the road to GARCH
- **⑥ Typical levels, and why the bill matters**

## @mechanics
### ① The close-to-close estimator

Written as a formula, the recipe from the intuition is the **close-to-close estimator** of annualized volatility:

$$
\hat\sigma = \sqrt{\frac{252}{n-1}\sum_{i=1}^{n}\left(r_i - \bar r\right)^2}, \qquad r_i = \ln\frac{P_i}{P_{i-1}}
$$

where:

- \(P_i\) is the closing price on day \(i\), and \(r_i\) the log return from one close to the next;
- \(\bar r\) is the average return over the window, and \(n\) the number of returns (one fewer than the number of prices);
- dividing by \(n-1\) instead of \(n\) is the usual small-sample correction for having estimated \(\bar r\) from the same data;
- 252 is the number of trading days per year, so the result is an **annualized** volatility; the hat on \(\hat\sigma\) says “estimate”.

> [!EXAMPLE] XYZ's week, in full
> The squared deviations from the table are (in units of \(10^{-4}\)): 1.239, 1.884, 0.668, 1.899, 0.673. Their sum is \(6.363 \times 10^{-4}\).
> $$
> \hat\sigma = \sqrt{\frac{252}{4} \times 6.363 \times 10^{-4}} = \sqrt{0.0401} \approx 0.200 = 20.0\%
> $$
> With only five returns the answer is fragile: dividing by \(n = 5\) instead of \(n - 1 = 4\) gives 17.9%. Small samples swing on small choices — section ③ puts a number on how much.

Three practical details:

- **Why log returns?** They add over time (\(\ln(P_2/P_0) = r_1 + r_2\)), which is what makes “variance adds up” work, and they match the lognormal model of [[random-walk]]. For daily moves of a few percent, log and simple returns differ by a rounding error.
- **Drop the mean?** Over short windows the average daily return is tiny compared with its own noise, so many desks set \(\bar r = 0\) and divide by \(n\). Variance swaps, the contracts that pay realized variance ([[variance-risk-premium]]), are written this way.
- **Clean the data.** Splits, special dividends and bad prints create fake returns. One wrong close can add several vol points to a one-month estimate.

### ② Annualizing: the square-root-of-time rule

If daily returns are independent, their variances add: 252 days of daily variance \(\sigma_{\text{d}}^2\) make an annual variance \(252\,\sigma_{\text{d}}^2\). Taking square roots:

$$
\sigma_{\text{annual}} = \sigma_{\text{daily}} \times \sqrt{252}, \qquad \sigma_{\text{over } h \text{ years}} = \sigma_{\text{annual}} \times \sqrt{h}
$$

Here \(\sigma_{\text{daily}}\) is the standard deviation of one day's return and \(h\) any horizon measured in years. The same rule scales down as well as up:

| Annual vol | Per trading day (\(\div\sqrt{252}\)) | Per calendar day (\(\div\sqrt{365}\)) | Over 30 calendar days (\(\times\sqrt{30/365}\)) |
|---|---|---|---|
| 16% | 1.01% | 0.84% | 4.59% |
| 20% (XYZ) | 1.26% | 1.05% | 5.73% |
| 50% (illustrative BTC) | 3.15% | 2.62% | 14.33% |

Since \(\sqrt{252} \approx 15.9\), traders use the **rule of 16**: divide an annual vol by 16 to get a typical trading-day move. 16% vol is “about 1% a day”; XYZ's 20% is “about 1.25% a day”.

> [!WARN] 252 or 365? Say which, and don't mix them
> This course prices options with calendar time, \(T = \text{days}/365\), so XYZ's one-day standard move in the pricing formulas is \(100 \times 0.2/\sqrt{365} \approx \$1.05\). Realized vol is conventionally computed on trading days with \(\sqrt{252}\), giving about $1.26 per *trading* day. Both describe the same annual variance: the market does most of its moving on the 252 days it is open, and weekends are quiet. The trap is mixing conventions — computing realized vol with \(\sqrt{252}\) and then scaling a “per calendar day” move with the same number. Crypto trades every day, so its realized vol is usually annualized with \(\sqrt{365}\); a 2.6% daily standard deviation is about 50% a year that way, but only 41% with \(\sqrt{252}\).

The square-root rule rests on independence. If returns trend (positive autocorrelation) the true long-horizon vol is larger than \(\sqrt{h}\) scaling suggests; if they mean-revert day to day, it is smaller. For liquid stocks and indexes daily autocorrelation is small, so the rule is a good first approximation — but it is an approximation.

### ③ Window length and sampling error

How many days should go into the estimate? Short windows react quickly but are noisy; long windows are stable but slow, and may average across two different regimes. The noise has a simple size. If returns are normal with true volatility \(\sigma\), the standard error of a volatility estimate from \(n\) returns is roughly

$$
\operatorname{SE}(\hat\sigma) \approx \frac{\sigma}{\sqrt{2n}}
$$

where \(\sigma\) is the true volatility and \(n\) the number of returns in the window. The \(\sqrt{2n}\) says precision improves slowly: four times the data halves the error.

| Window | Returns \(n\) | SE when true vol is 20% | Rough 95% range of the estimate |
|---|---|---|---|
| two weeks | 10 | 4.5 vol points | 11% – 29% |
| one month | 21 | 3.1 | 14% – 26% |
| three months | 63 | 1.8 | 16% – 24% |
| one year | 252 | 0.9 | 18% – 22% |

So a stock with a constant true vol of 20% can easily print a one-month realized vol of 15% or 25% **by pure chance**. Real returns have fat tails, which makes the error larger still. Try it:

::demo[realized-vol-window]

Traders summarize this with a **volatility cone**: for each window length, compute the rolling realized vol over a long history and plot its range (minimum, a middle band, maximum). Short windows fan out wide; long windows pinch toward the long-run level.

<figure>
<svg viewBox="0 0 640 270" role="img" aria-label="Volatility cone by window length">
<line x1="60" y1="240" x2="610" y2="240" class="fx-axis"/>
<line x1="60" y1="30" x2="60" y2="240" class="fx-axis"/>
<line x1="60" y1="200" x2="610" y2="200" class="fx-grid"/>
<line x1="60" y1="160" x2="610" y2="160" class="fx-grid"/>
<line x1="60" y1="120" x2="610" y2="120" class="fx-grid"/>
<line x1="60" y1="80" x2="610" y2="80" class="fx-grid"/>
<text x="52" y="204" text-anchor="end" class="fx-t-sm">10%</text>
<text x="52" y="164" text-anchor="end" class="fx-t-sm">20%</text>
<text x="52" y="124" text-anchor="end" class="fx-t-sm">30%</text>
<text x="52" y="84" text-anchor="end" class="fx-t-sm">40%</text>
<polygon points="100,198.4 190,194 280,190.8 350,187.2 450,183.2 560,180.4 560,160 450,153.2 350,148.8 280,147.6 190,146.4 100,139.6" class="fx-area-hl"/>
<polyline points="100,55.6 190,94.4 280,119.2 350,131.2 450,140.4 560,152" class="fx-line-bad fx-dash"/>
<polyline points="100,219.2 190,208.4 280,202 350,200 450,191.2 560,186.8" class="fx-line-ok fx-dash"/>
<polyline points="100,175.2 190,173.6 280,173.6 350,173.2 450,172.4 560,169.2" class="fx-line-thick"/>
<circle cx="190" cy="140" r="6" class="fx-fill-blue"/>
<text x="200" y="158" class="fx-t-blue">a 1-month implied vol of 25%</text>
<text x="100" y="258" text-anchor="middle" class="fx-t-sm">10 days</text>
<text x="190" y="258" text-anchor="middle" class="fx-t-sm">21</text>
<text x="280" y="258" text-anchor="middle" class="fx-t-sm">42</text>
<text x="350" y="258" text-anchor="middle" class="fx-t-sm">63</text>
<text x="450" y="258" text-anchor="middle" class="fx-t-sm">126</text>
<text x="560" y="258" text-anchor="middle" class="fx-t-sm">252</text>
<text x="470" y="122" class="fx-t-bad">maximum</text>
<text x="470" y="210" class="fx-t-ok">minimum</text>
<text x="470" y="166" class="fx-t-b">median</text>
<text x="380" y="96" class="fx-t-hl">shaded: 10th–90th percentile</text>
<text x="70" y="24" class="fx-t-sm">rolling realized vol, 10 simulated years (long-run vol ≈ 18%)</text>
</svg>
<figcaption>Figure 2 · A volatility cone from ten simulated years of a clustering (GARCH-type) return series. Over 10-day windows realized vol ranged from 5% to 46%; over one-year windows only from 13% to 22%. A 1-month implied vol of 25% (violet dot) sits above the 90th percentile of past 1-month realized vol — a question worth asking, not an automatic trade.</figcaption>
</figure>

### ④ Using the whole day: the Parkinson high–low estimator

A close-to-close return throws away almost everything that happened during the day. A stock that closes unchanged after swinging from $97 to $103 was not calm. The daily **high and low** capture that swing. Parkinson (1980) showed that, for a random walk without drift, the squared log range estimates the variance:

$$
\hat\sigma_{P} = \sqrt{\frac{252}{4n\ln 2}\sum_{i=1}^{n}\left(\ln\frac{H_i}{L_i}\right)^2}
$$

where \(H_i\) and \(L_i\) are day \(i\)'s high and low, \(n\) the number of days, and \(4\ln 2 \approx 2.77\) the constant that makes the estimate unbiased for a continuous random walk.

One day is already informative. Suppose XYZ trades between a high of $101.50 and a low of $99.30: \(\ln(101.5/99.3) = 0.0219\), squared \(4.80 \times 10^{-4}\); divide by 2.77 and multiply by 252 to get 0.0437, whose square root is **about 20.9%**. A single close-to-close return could have been anything from zero to 2%.

For an ideal random walk the range estimator is about **five times more efficient** than close-to-close: 21 days of highs and lows carry roughly the information of 100 days of closes. In practice it runs low for two reasons:

- **Gaps.** The range only sees trading hours. News that moves the price overnight (earnings, macro releases, weekends) shows up in close-to-close returns but not in the intraday range. The main demo has an “overnight gaps” switch to show the bias.
- **Discrete trading.** The recorded high and low are the extremes of actual trades, which slightly understate the true extremes of the price process.

Refinements fix these one at a time: Garman–Klass adds the open and close, Rogers–Satchell allows drift, and Yang–Zhang combines an overnight component with an intraday one. With intraday data you can go further and add up squared 5-minute returns (“realized variance”), the input to the forecasting models of [[vol-forecasting]].

### ⑤ Volatility clusters: EWMA and the road to GARCH

Look at any long return series and you'll see that **big moves come in bunches**. Calm weeks follow calm weeks; one violent day is usually followed by more. This is **volatility clustering**, and it is why a single “the vol of this stock” number is always a snapshot.

<figure>
<svg viewBox="0 0 640 300" role="img" aria-label="Daily returns with clustering and rolling volatility estimates">
<text x="50" y="14" class="fx-t-sm">daily returns (simulated)</text>
<line x1="50" y1="72" x2="610" y2="72" class="fx-axis"/>
<path d="M50.0,72v-14.6M52.2,72v-6.0M54.5,72v0.4M56.7,72v1.1M59.0,72v5.0M61.2,72v-3.4M63.4,72v-0.4M65.7,72v-6.5M67.9,72v0.7M70.2,72v5.7M72.4,72v-4.9M74.6,72v-7.2M76.9,72v3.9M79.1,72v0.4M81.4,72v6.4M83.6,72v-7.0M85.8,72v8.1M88.1,72v1.8M90.3,72v-8.2M92.6,72v1.1M94.8,72v-6.4M97.0,72v6.1M99.3,72v-6.0M101.5,72v-7.6M103.8,72v2.6M106.0,72v-9.9M108.2,72v-0.4M110.5,72v5.8M112.7,72v-10.3M115.0,72v6.3M117.2,72v4.2M119.4,72v4.0M121.7,72v-4.5M123.9,72v1.0M126.2,72v-4.5M128.4,72v2.4M130.6,72v-3.2M132.9,72v-0.8M135.1,72v6.2M137.4,72v-7.7M139.6,72v-6.9M141.8,72v-0.9M144.1,72v-1.3M146.3,72v11.6M148.6,72v6.7M150.8,72v-3.3M153.0,72v-6.1M155.3,72v2.2M157.5,72v1.7M159.8,72v4.1M162.0,72v4.9M164.2,72v-6.2M166.5,72v-7.0M168.7,72v-7.8M171.0,72v1.0M173.2,72v-2.0M175.4,72v6.5M177.7,72v7.1M179.9,72v-7.5M182.2,72v-2.1M184.4,72v-4.1M186.6,72v2.2M188.9,72v-2.7M191.1,72v5.1M193.4,72v-4.3M195.6,72v2.3M197.8,72v10.8M200.1,72v2.0M202.3,72v-3.8M204.6,72v3.1M206.8,72v-0.8M209.0,72v1.3M211.3,72v-5.3M213.5,72v1.2M215.8,72v1.3M218.0,72v0.4M220.2,72v-3.3M222.5,72v-0.1M224.7,72v2.9M227.0,72v-5.4M229.2,72v4.0M231.4,72v1.3M233.7,72v-3.9M235.9,72v0.6M238.2,72v-2.5M240.4,72v5.1M242.6,72v4.3M244.9,72v5.4M247.1,72v3.9M249.4,72v1.3M251.6,72v-0.7M253.8,72v-8.0M256.1,72v-16.0M258.3,72v-2.4M260.6,72v-0.9M262.8,72v1.6M265.0,72v-5.1M267.3,72v-0.5M269.5,72v4.3M271.8,72v2.9M274.0,72v-16.2M276.2,72v0.5M278.5,72v-31.6M280.7,72v2.7M283.0,72v-6.2M285.2,72v17.3M287.4,72v-9.3M289.7,72v16.9M291.9,72v-39.4M294.2,72v1.4M296.4,72v21.1M298.6,72v9.4M300.9,72v30.1M303.1,72v-23.0M305.4,72v-13.6M307.6,72v32.3M309.8,72v1.0M312.1,72v10.8M314.3,72v-18.1M316.6,72v1.1M318.8,72v1.7M321.0,72v19.7M323.3,72v6.0M325.5,72v-0.4M327.8,72v29.4M330.0,72v17.1M332.2,72v-8.2M334.5,72v10.7M336.7,72v34.0M339.0,72v12.2M341.2,72v23.8M343.4,72v3.9M345.7,72v0.1M347.9,72v-36.7M350.2,72v25.2M352.4,72v-3.6M354.6,72v-37.3M356.9,72v-0.8M359.1,72v-36.7M361.4,72v-5.6M363.6,72v-29.9M365.8,72v28.6M368.1,72v-3.2M370.3,72v-1.2M372.6,72v27.3M374.8,72v-18.1M377.0,72v2.2M379.3,72v19.1M381.5,72v14.3M383.8,72v-16.8M386.0,72v2.5M388.2,72v9.7M390.5,72v9.4M392.7,72v1.7M395.0,72v7.8M397.2,72v-4.7M399.4,72v3.7M401.7,72v-13.1M403.9,72v-2.3M406.2,72v13.5M408.4,72v0.4M410.6,72v-26.0M412.9,72v-3.3M415.1,72v6.0M417.4,72v7.0M419.6,72v-3.2M421.8,72v-13.1M424.1,72v7.1M426.3,72v10.7M428.6,72v-12.5M430.8,72v-5.7M433.0,72v10.1M435.3,72v-12.4M437.5,72v2.0M439.8,72v9.1M442.0,72v-3.8M444.2,72v12.5M446.5,72v2.9M448.7,72v-9.9M451.0,72v8.7M453.2,72v-8.7M455.4,72v0.8M457.7,72v4.7M459.9,72v-0.1M462.2,72v3.2M464.4,72v9.4M466.6,72v2.7M468.9,72v0.9M471.1,72v-3.6M473.4,72v-5.7M475.6,72v4.8M477.8,72v-3.9M480.1,72v-4.4M482.3,72v5.5M484.6,72v2.7M486.8,72v-9.2M489.0,72v6.1M491.3,72v13.6M493.5,72v-5.2M495.8,72v1.2M498.0,72v0.6M500.2,72v-9.9M502.5,72v2.8M504.7,72v14.7M507.0,72v-0.5M509.2,72v2.4M511.4,72v-3.8M513.7,72v0.9M515.9,72v-10.7M518.2,72v1.4M520.4,72v9.5M522.6,72v2.3M524.9,72v1.9M527.1,72v8.1M529.4,72v3.2M531.6,72v3.1M533.8,72v3.5M536.1,72v3.3M538.3,72v0.8M540.6,72v-6.0M542.8,72v3.5M545.0,72v-0.4M547.3,72v2.0M549.5,72v11.4M551.8,72v6.7M554.0,72v2.6M556.2,72v-4.8M558.5,72v4.1M560.7,72v-1.0M563.0,72v-1.5M565.2,72v2.8M567.4,72v-11.8M569.7,72v5.0M571.9,72v-4.0M574.2,72v-1.5M576.4,72v1.9M578.6,72v-5.3M580.9,72v3.4M583.1,72v8.9M585.4,72v-0.4M587.6,72v1.0M589.8,72v1.9M592.1,72v1.9M594.3,72v-3.2M596.6,72v-2.4M598.8,72v0.5M601.0,72v-3.2M603.3,72v-0.1M605.5,72v-0.2M607.8,72v10.4" class="fx-line"/>
<line x1="50" y1="255" x2="610" y2="255" class="fx-axis"/>
<line x1="50" y1="219" x2="610" y2="219" class="fx-grid"/>
<line x1="50" y1="183" x2="610" y2="183" class="fx-grid"/>
<line x1="50" y1="147" x2="610" y2="147" class="fx-grid"/>
<text x="44" y="259" text-anchor="end" class="fx-t-sm">0%</text>
<text x="44" y="223" text-anchor="end" class="fx-t-sm">20%</text>
<text x="44" y="187" text-anchor="end" class="fx-t-sm">40%</text>
<text x="44" y="151" text-anchor="end" class="fx-t-sm">60%</text>
<polyline points="50,233 54,233 59,233 63,233 68,233 72,233 77,233 81,233 86,233 90,233 95,233 99,233 104,233 108,233 113,233 117,233 122,233 126,233 131,233 135,233 140,233 144,233 149,233 153,233 158,233 162,233 166,233 171,233 175,233 180,233 184,233 189,233 193,233 198,233 202,233 207,233 211,233 216,233 220,233 225,233 229,233 234,233 238,233 243,233 247,233 252,233 256,233 261,233 265,233 270,233 274,174 278,174 283,174 287,174 292,174 296,174 301,174 305,174 310,174 314,174 319,174 323,174 328,174 332,174 337,174 341,174 346,174 350,174 355,174 359,174 364,174 368,179 373,183 377,187 382,190 386,194 390,197 395,199 399,202 404,204 408,207 413,209 417,211 422,212 426,214 431,216 435,217 440,218 444,219 449,220 453,221 458,222 462,223 467,224 471,225 476,225 480,226 485,227 489,227 494,228 498,228 502,228 507,229 511,229 516,229 520,230 525,230 529,230 534,231 538,231 543,231 547,231 552,231 556,231 561,232 565,232 570,232 574,232 579,232 583,232 588,232 592,232 597,232 601,233 606,233" class="fx-line-muted fx-dash"/>
<polyline points="95,231 99,234 104,233 108,232 113,230 117,230 122,230 126,230 131,231 135,232 140,232 144,233 149,231 153,232 158,232 162,234 166,233 171,233 175,232 180,230 184,232 189,232 193,234 198,233 202,233 207,234 211,234 216,237 220,236 225,238 229,239 234,239 238,239 243,239 247,241 252,242 256,234 261,235 265,234 270,234 274,230 278,219 283,218 287,214 292,200 296,196 301,189 305,186 310,180 314,178 319,178 323,177 328,180 332,179 337,176 341,188 346,188 350,183 355,178 359,170 364,167 368,165 373,162 377,165 382,164 386,169 390,171 395,177 399,180 404,187 408,196 413,203 417,203 422,210 426,212 431,215 435,213 440,213 444,212 449,213 453,214 458,221 462,221 467,221 471,223 476,226 480,228 485,230 489,229 494,228 498,231 502,231 507,228 511,229 516,227 520,227 525,227 529,227 534,229 538,232 543,231 547,234 552,235 556,234 561,235 565,238 570,235 574,235 579,234 583,233 588,234 592,234 597,236 601,237 606,238 608,235" class="fx-line-hl"/>
<polyline points="50,233 54,230 59,231 63,232 68,232 72,233 77,232 81,233 86,233 90,232 95,232 99,232 104,231 108,231 113,231 117,230 122,231 126,232 131,233 135,234 140,233 144,233 149,231 153,231 158,232 162,233 166,233 171,232 175,233 180,232 184,232 189,233 193,234 198,234 202,233 207,234 211,235 216,235 220,237 225,237 229,237 234,238 238,238 243,238 247,238 252,239 256,238 261,232 265,234 270,234 274,235 278,230 283,217 287,214 292,212 296,200 301,198 305,190 310,185 314,188 319,190 323,190 328,194 332,189 337,191 341,186 346,186 350,180 355,180 359,176 364,173 368,167 373,173 377,171 382,174 386,176 390,180 395,184 399,187 404,190 408,192 413,191 417,194 422,197 426,199 431,200 435,202 440,204 444,206 449,207 453,208 458,210 462,213 467,214 471,216 476,218 480,220 485,221 489,222 494,220 498,222 502,222 507,221 511,223 516,225 520,225 525,225 529,225 534,227 538,228 543,229 547,230 552,229 556,230 561,230 565,232 570,230 574,231 579,232 583,233 588,232 592,233 597,234 601,236 606,236" class="fx-line-blue"/>
<text x="50" y="135" class="fx-t-sm">volatility, annualized</text>
<text x="440" y="150" class="fx-t-hl">21-day close-to-close</text>
<text x="440" y="166" class="fx-t-blue">EWMA, λ = 0.94</text>
<text x="440" y="182" class="fx-t-sm">dashed: true vol</text>
<text x="274" y="290" text-anchor="middle" class="fx-t-sm">day 100: the storm starts</text>
<text x="600" y="290" text-anchor="end" class="fx-t-sm">250 trading days</text>
</svg>
<figcaption>Figure 3 · A simulated year: true vol is 12% for 100 days, jumps to 45% for 40 days, then decays back. Big bars bunch together (clustering). Both estimators trail the true vol by a couple of weeks, when the storm starts and again when it ends. The 21-day window keeps each big day at full weight for exactly 21 days and then drops it at once, so its line lurches; EWMA lets each day fade gradually, so its line is smoother.</figcaption>
</figure>

A fixed window treats a return from 20 days ago exactly like yesterday's, then forgets it completely on day 22. The **exponentially weighted moving average (EWMA)** instead gives every past return a weight that fades geometrically:

$$
\sigma_t^2 = \lambda\,\sigma_{t-1}^2 + (1-\lambda)\,r_{t-1}^2
$$

where \(\sigma_t^2\) is today's estimate of the daily variance, \(r_{t-1}\) yesterday's return, and \(\lambda\) (between 0 and 1) the decay factor. The RiskMetrics convention for daily data is \(\lambda = 0.94\): yesterday's squared return gets 6% of the weight, and a return's influence halves about every 11 days.

> [!EXAMPLE] One −3% day
> XYZ's vol is 20%, so the daily variance is \(0.20^2/252 = 1.587 \times 10^{-4}\). Then XYZ falls 3%:
> $$
> \sigma_t^2 = 0.94 \times 1.587 \times 10^{-4} + 0.06 \times 0.03^2 = 2.032 \times 10^{-4}
> $$
> Annualized: \(\sqrt{2.032 \times 10^{-4} \times 252} \approx 22.6\%\). One shock lifts the estimate by 2.6 vol points. If the next day is flat, it eases to 21.9%, and it keeps decaying unless more shocks arrive.

EWMA has one weakness: it never pulls volatility back toward a long-run level; it just remembers less and less. **GARCH(1,1)** adds that anchor, \(\sigma_{t+1}^2 = \omega + \alpha\varepsilon_t^2 + \beta\sigma_t^2\), so forecasts drift back to a long-run average. That — plus HAR models and machine learning — is the subject of [[vol-forecasting]].

> [!HISTORY] From an observation to a Nobel
> Benoît Mandelbrot noticed in 1963 that large price changes tend to be followed by large changes, of either sign. Robert Engle turned the observation into a model in 1982 (ARCH: today's variance depends on yesterday's squared shocks), and Tim Bollerslev generalized it in 1986 (GARCH). Engle shared the 2003 Nobel Prize in economics for this work. Clustering is now one of the best-documented facts about financial returns.

### ⑥ Typical levels, and why the bill matters

What counts as “high”? Only relative to the asset's own history — and the level differs a lot across asset types:

- **Broad equity indexes** are the calm end, because diversification cancels much of each company's own news. Over 1990 to about 2024 the S&P 500's average 30-day realized volatility was about 15.5% (see the FACT below).
- **Single stocks** usually run well above their index — company news (earnings, drug trials, lawsuits) does not diversify away — and jump around earnings dates.
- **Bitcoin** is in another range; this course uses an illustrative 50%. Because crypto trades around the clock, annualize with 365 days: 50% vol is about 2.6% a day.

> [!FACT] Implied tends to sit above realized — on average
> From 1990 to about 2024, the VIX (the market's 30-day implied vol for the S&P 500) averaged about 19.6%, while the S&P 500's subsequent 30-day realized vol averaged about 15.5% — a gap of roughly 4 vol points (CFA Institute Enterprising Investor, July 2024). The gap turns negative in crashes, when realized vol overshoots what was priced. That gap is the [[variance-risk-premium]].

Why should an options trader care about a backward-looking number? Because **realized volatility is the bill that gets paid**. An option seller who hedges the stock daily collects implied vol up front and then pays out, day by day, in proportion to how much the stock actually moves; the hedged P&L is roughly \(\tfrac12\Gamma S^2(\sigma_{\text{imp}}^2 - \sigma_{\text{real}}^2)\) per unit of time ([[delta-hedging]]). A straddle buyer ([[straddle-strangle]]) profits when realized beats implied. Every vol trade is a bet on the gap between the quote and the bill — and the quote is the next lesson.

## @analogy
Realized volatility is like a **road-roughness meter** in a car. You drive a stretch of road and the meter records how hard each bump shook you. It doesn't care whether the road went uphill or downhill — only how bumpy it was.

- The **close-to-close** estimator checks the meter once a day, at the same milestone. Cheap, but it misses the pothole you hit at lunchtime and bounced out of.
- The **high–low** estimator notes the worst jolt and the calmest moment of each day. Much more information per day — but it misses the bumps on the ferry ride overnight (the gaps).
- The **window** is how many days of readings you average. A week tells you about the road right here; a year tells you about the region.
- **EWMA** weights today's jolts most and lets old ones fade, which suits roads where rough stretches come in clusters — a pothole-ridden district is usually followed by more potholes.
- The **square-root rule** is how you convert “bumpiness per mile” into “expected total jolting over a trip”: jolts partly cancel, so ten times the distance means about three times (\(\sqrt{10}\)) the total wander, not ten times.

Where the analogy breaks: a road stays where it is, so last week's reading is a decent guide to this week. Markets change their roughness abruptly, and the most expensive bumps — crashes and gaps — are exactly the ones a backward-looking meter hasn't seen yet. That's why the market's own forward-looking estimate, implied volatility, exists alongside this one.

## @misconceptions
- **“A 20% volatility stock will move about 20% this year.”** — 20% is one standard deviation of the annual log return. Roughly two years in three the move lands within ±20% (a normal approximation), and a quiet year near 0% is perfectly consistent with it. Per trading day it means about 1.26%.
- **“A stock that went straight up had high volatility.”** — Volatility measures the size of day-to-day steps around the trend, not the trend. A steady climb of 0.1% a day has very low realized vol; a stock that ends flat after violent swings has high realized vol.
- **“Last month's realized vol is the stock's true volatility.”** — It is one noisy sample from a quantity that keeps changing. With 21 returns the standard error is about 3 vol points even if the true vol never moved, and clustering means next month can look very different.
- **“Just multiply daily vol by 365.”** — Volatility scales with the square root of time: multiply by \(\sqrt{252}\) for trading days (about 15.9) or \(\sqrt{365}\) for calendar days (about 19.1). Multiplying by 252 or 365 confuses volatility with variance.
- **“The high–low estimator is always better.”** — It uses more information per day, but it misses overnight gaps and understates ranges when trading is sparse. For stocks with frequent news gaps, close-to-close or a combined estimator like Yang–Zhang is safer.

## @takeaways
- Realized volatility = standard deviation of log returns, annualized: \(\hat\sigma = \sigma_{\text{daily}} \times \sqrt{252}\) on trading days (\(\sqrt{365}\) for 24/7 markets like crypto).
- XYZ's 20% means about 1.26% per trading day (rule of 16) and about $5.73 per share over 30 calendar days.
- Every estimate is noisy: the standard error is about \(\sigma/\sqrt{2n}\), so a one-month number carries roughly ±3 vol points of pure chance; the vol cone shows the normal range for each window.
- High–low (Parkinson) estimators squeeze more out of each day but miss overnight gaps; EWMA follows volatility clusters by letting old returns fade.
- Realized vol is the bill; implied vol is the quote. Hedged option P&L depends on the gap between them.

## @quiz
1. XYZ's daily log returns have a standard deviation of 1.0% over the last three months. What is its annualized realized volatility, using trading days?
   - [ ] About 1%
   - [x] About 16%
   - [ ] About 25%
   - [ ] About 252%
   > Annualized vol \(= 1.0\% \times \sqrt{252} \approx 1.0\% \times 15.9 \approx 15.9\%\) — the rule of 16 in reverse. Volatility scales with the square root of time; multiplying by 252 would give a variance-like number, not a volatility.
2. Stock A and stock B both rose exactly 5% last month. A rose a little almost every day; B swung up and down by 2–3% daily. What can you say about their realized volatility?
   - [ ] They are equal, because the returns are equal
   - [ ] A's is higher, because it rose more consistently
   - [ ] It can't be computed without knowing the stocks' betas
   - [x] B's is much higher, because realized vol measures the size of daily moves, not the net return
   > Realized vol is the standard deviation of daily returns around their average. The same monthly return can come from tiny steady steps (low vol) or large offsetting swings (high vol).
3. A stock's true volatility is a constant 20%. You estimate it from the last 10 daily returns and get 27%. What is the most reasonable reading?
   - [x] That is within normal sampling noise — a 10-day estimate has a standard error of about 4.5 vol points
   - [ ] The stock's volatility must have risen to 27%
   - [ ] The formula must be wrong; with a constant true vol the estimate always equals 20%
   - [ ] You should have annualized with 365 days instead of 252
   > The standard error is roughly \(\sigma/\sqrt{2n} = 20\%/\sqrt{20} \approx 4.5\) points, so 27% is only about 1.6 standard errors high. Short windows are noisy even when nothing has changed.
4. XYZ has been at 20% vol (EWMA, \(\lambda = 0.94\)) and then drops 3% in one day. Roughly where does the EWMA estimate move?
   - [ ] It stays at 20%, because one day doesn't matter
   - [ ] To about 48%, because a 3% day annualizes to \(3\% \times 15.9\)
   - [x] To about 22.6%
   - [ ] To about 21%, because only 1% of the weight goes to the new day
   > New daily variance \(= 0.94 \times 0.2^2/252 + 0.06 \times 0.03^2 = 2.03 \times 10^{-4}\), which annualizes to \(\sqrt{2.03 \times 10^{-4} \times 252} \approx 22.6\%\). The new day gets 6% of the weight: enough to move the estimate, not to take it over.
5. A crypto asset shows a daily return standard deviation of 2.6%, and it trades every day of the year. What annualized volatility should you report, and why?
   - [ ] About 41%, using \(\sqrt{252}\), because that is the market standard for all assets
   - [x] About 50%, using \(\sqrt{365}\), because the asset moves on all 365 days
   - [ ] About 949%, using \(2.6\% \times 365\)
   - [ ] About 2.6%, because volatility is already a daily number
   > Annualize with the number of periods in which the price can move: \(2.6\% \times \sqrt{365} \approx 49.7\%\). Using \(\sqrt{252}\) (about 41%) understates a 24/7 market's annual variance; multiplying by 365 confuses volatility with variance.

## @further
- [Volatility (finance) — Wikipedia](https://en.wikipedia.org/wiki/Volatility_(finance)) — definitions, the square-root-of-time rule and its caveats in one place.
- [Parkinson (1980), The Extreme Value Method for Estimating the Variance of the Rate of Return](https://doi.org/10.1086/296071) — the original high–low estimator and its efficiency argument.
- [Autoregressive conditional heteroskedasticity — Wikipedia](https://en.wikipedia.org/wiki/Autoregressive_conditional_heteroskedasticity) — ARCH and GARCH, the models built on volatility clustering.
- [How well does the market predict volatility? (CFA Institute, 2024)](https://blogs.cfainstitute.org/investor/2024/07/31/how-well-does-the-market-predict-volatility/) — VIX versus subsequent realized S&P 500 volatility since 1990.
- [Corsi (2009), A Simple Approximate Long-Memory Model of Realized Volatility](https://academic.oup.com/jfec/article/7/2/174/856522) — the HAR model that builds forecasts from daily, weekly and monthly realized vol.

## @next
Realized vol looks in the rear-view mirror. The option market publishes a forward-looking number every second, hidden inside every option price. How do you pull it out — and why do traders quote options in volatility instead of dollars?
