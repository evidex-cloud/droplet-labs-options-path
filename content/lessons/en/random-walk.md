---
id: random-walk
prereqs: probability-ev, binomial-trees, risk-neutral
demo: random-walk
---

# Random Walks, Lognormal Prices & the √T Rule

## @hook
How far might XYZ move in a day, a month, a year? A typical move (one standard deviation) is about $1.05, $5.73 and $20. A year is 365 times longer than a day, but the typical move is only about 19 times bigger. Uncertainty grows like the **square root of time**. That rule, plus “model returns, not prices”, is the third and last ingredient of Black-Scholes.

## @bridge
[[binomial-trees]] converged because many small up-and-down steps of size \(\pm\sigma\sqrt{\Delta t}\) add up to a bell curve in log-price. [[risk-neutral]] told us that for pricing, that bell curve drifts at \(r\). [[probability-ev]] already used the lognormal distribution to talk about the odds of finishing in the money. This lesson opens the box: what the random walk is, why it spreads like \(\sqrt{T}\), and why prices come out lognormal (skewed, never below zero). It builds Idea ③ (volatility): \(\sigma\sqrt{T}\) is the width of the future, and the width is what options are priced on. Next, [[black-scholes]] puts all three ingredients together.

## @intuition
Picture XYZ's price one trading day at a time. Each day news arrives, buyers and sellers push, and the price closes a little up or a little down. No one can predict the sign. The simplest honest model is a **random walk**: every day a fresh, independent random shock.

Two questions shape the whole model.

**First: shocks to what, the price or the percentage?** A $1 drop means something very different for a $10 stock and a $1,000 stock. What stays comparable is the *percentage* move. So we model **returns**. Better still, **log returns**, \(\ln(S_{\text{today}}/S_{\text{yesterday}})\), because they simply add up over time. Up 10% then down 10% does *not* bring you back to even: \(1.10 \times 0.90 = 0.99\), a 1% loss. In logs it's clean: \(\ln 1.10 + \ln 0.90 = 0.0953 - 0.1054 = -0.0101\). Log returns add; simple returns don't.

**Second: how does the spread grow with time?** If each day's shock is independent, the *variances* add. Thirty days of shocks have 30 times the variance of one day, so the typical size (the standard deviation, the square root of variance) is \(\sqrt{30} \approx 5.5\) times one day's. Not 30 times. That's the **square-root-of-time rule**.

For XYZ, with 20% volatility (and the course's calendar-day convention, \(T = \text{days}/365\)):

| Horizon | \(\sqrt{T}\) | Typical move \(S\sigma\sqrt{T}\) | vs one day |
|---|---|---|---|
| 1 day | 0.052 | $1.05 | ×1 |
| 7 days | 0.138 | $2.77 | ×2.6 |
| 30 days | 0.287 | $5.73 | ×5.5 |
| 91 days | 0.499 | $9.99 | ×9.5 |
| 1 year | 1.000 | $20.00 | ×19.1 |

<figure>
<svg viewBox="0 0 690 260" role="img" aria-label="Simulated XYZ paths inside the square-root-of-time cone">
<defs><marker id="random-walk-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<polygon points="60,149 82,135 104,129 127,124 149,120 171,116 193,113 215,109 238,106 260,103 282,100 304,97 326,95 348,92 371,89 393,87 415,84 437,82 459,80 482,77 504,75 526,72 548,70 570,68 593,66 600,65 600,200 593,200 570,199 548,198 526,197 504,197 482,196 459,195 437,194 415,192 393,191 371,190 348,189 326,188 304,186 282,185 260,183 238,181 215,180 193,178 171,175 149,173 127,170 104,166 82,162 60,149" class="fx-area-blue"/>
<polygon points="60,149 82,142 104,139 127,137 149,135 171,133 193,131 215,130 238,128 260,127 282,126 304,124 326,123 348,122 371,121 393,119 415,118 437,117 459,116 482,115 504,114 526,113 548,112 570,111 593,110 600,110 600,176 593,176 570,175 548,175 526,174 504,174 482,173 459,173 437,172 415,172 393,171 371,170 348,170 326,169 304,168 282,167 260,167 238,166 215,165 193,164 171,163 149,161 127,160 104,158 82,156 60,149" class="fx-area-hl"/>
<polyline points="60,149 82,149 104,149 127,149 149,149 171,149 193,148 215,148 238,148 260,148 282,148 304,148 326,148 348,147 371,147 393,147 415,147 437,147 459,147 482,147 504,147 526,146 548,146 570,146 593,146 600,146" class="fx-line-muted fx-dash"/>
<polyline points="60,149 75,156 90,153 105,159 120,154 135,149 150,153 165,154 180,152 195,150 210,157 225,162 240,154 255,157 270,152 285,142 300,148 315,156 330,159 345,156 360,155 375,154 390,148 405,154 420,152 435,158 450,167 465,164 480,166 495,170 510,172 525,176 540,169 555,171 570,165 585,169 600,167" class="fx-line"/>
<polyline points="60,149 75,142 90,146 105,145 120,151 135,145 150,152 165,151 180,153 195,149 210,145 225,139 240,136 255,138 270,150 285,148 300,155 315,153 330,145 345,142 360,146 375,131 390,129 405,125 420,113 435,112 450,119 465,108 480,110 495,100 510,107 525,107 540,105 555,94 570,93 585,92 600,107" class="fx-line"/>
<polyline points="60,149 75,150 90,153 105,156 120,149 135,158 150,156 165,156 180,152 195,148 210,142 225,146 240,143 255,155 270,159 285,160 300,159 315,159 330,166 345,163 360,156 375,154 390,158 405,152 420,155 435,148 450,146 465,141 480,141 495,136 510,135 525,138 540,141 555,150 570,151 585,150 600,147" class="fx-line"/>
<polyline points="60,149 75,154 90,152 105,157 120,161 135,159 150,159 165,162 180,160 195,163 210,165 225,167 240,169 255,167 270,170 285,167 300,171 315,165 330,163 345,162 360,153 375,149 390,146 405,150 420,147 435,148 450,146 465,151 480,148 495,154 510,144 525,143 540,137 555,129 570,126 585,118 600,126" class="fx-line"/>
<line x1="50" y1="230" x2="620" y2="230" class="fx-axis" marker-end="url(#random-walk-ah)"/>
<line x1="60" y1="240" x2="60" y2="30" class="fx-axis" marker-end="url(#random-walk-ah)"/>
<text x="54" y="218" text-anchor="end" class="fx-t-sm">60</text>
<text x="54" y="153" text-anchor="end" class="fx-t-sm">100</text>
<text x="54" y="89" text-anchor="end" class="fx-t-sm">140</text>
<text x="195" y="246" text-anchor="middle" class="fx-t-sm">3 mo</text>
<text x="329" y="246" text-anchor="middle" class="fx-t-sm">6 mo</text>
<text x="464" y="246" text-anchor="middle" class="fx-t-sm">9 mo</text>
<text x="600" y="246" text-anchor="middle" class="fx-t-sm">1 yr</text>
<text x="606" y="69" class="fx-t-sm">+2σ 152</text>
<text x="606" y="113" class="fx-t-sm">+1σ 125</text>
<text x="606" y="150" class="fx-t-sm">median 102</text>
<text x="606" y="180" class="fx-t-sm">−1σ 84</text>
<text x="606" y="204" class="fx-t-sm">−2σ 68</text>
<text x="70" y="40" class="fx-t-b">XYZ, σ = 20%: four simulated years</text>
<text x="70" y="58" class="fx-t-sm">inner band: about 68% of outcomes · outer band: about 95%</text>
</svg>
<figcaption>Figure 1 · Four simulated years of XYZ (drift 4%, volatility 20%) inside the ±1σ and ±2σ bands. The bands open fast at first and then more slowly, like \(\sqrt{t}\), not like a straight wedge. They're also lopsided: +1σ is 25 dollars up but −1σ only 16 dollars down, because the bands are symmetric in *log* price.</figcaption>
</figure>

> [!KAI] What “normal” looks like before earnings
> Kai's earnings date is about three weeks (21 days) away. With XYZ at 20% volatility, the typical move over that stretch is \(100 \times 0.20 \times \sqrt{21/365} \approx \$4.80\). So in roughly two out of three ordinary three-week stretches XYZ ends within about $4.80 of where it started, and a $10 move is a two-standard-deviation event. An earnings day, though, isn't an ordinary day. The market usually prices extra volatility for it ([[earnings-events]]), and [[bs-assumptions]] shows why single-day jumps break the smooth random walk.

> [!THINK] XYZ's typical one-day move is $1.05. What is the typical move over four days: $4.20, $2.10 or $1.05?
> Predict before opening.
> ---
> About $2.10. Four independent days have four times the variance, so the standard deviation is \(\sqrt{4} = 2\) times one day's: \(2 \times 1.05 = 2.10\). To double the typical move you need four times the time; to triple it, nine times. That's why a 1-year option isn't 12 times the price of a 1-month one: at zero interest the at-the-money ratio is about \(\sqrt{12} \approx 3.5\). With XYZ's 4% rate it's 9.93 vs 2.45, a little over 4, because interest adds more to the long-dated option.

Slide the horizon and watch how slowly the typical move grows:

::demo[random-walk-sqrt]

We'll take it in five parts:

- **① Returns and log returns**: why logs add up
- **② The \(\sqrt{T}\) rule and annualising**: 365 vs 252 days, and the rule of 16
- **③ Geometric Brownian motion and the lognormal**
- **④ Volatility drag**: why the typical outcome trails the average
- **⑤ From the walk to Black-Scholes**, and where the walk goes wrong

## @mechanics
### ① Returns and log returns

For a price series \(S_0, S_1, \dots, S_N\) (one point per day, say), define each period's log return and add them up:

$$
r_t = \ln\frac{S_t}{S_{t-1}}, \qquad \ln\frac{S_N}{S_0} = r_1 + r_2 + \dots + r_N
$$

Where \(r_t\) is the continuously compounded return in period \(t\), and the second equation says that the log return over the whole stretch is just the sum of the daily ones. The logarithms telescope. That additivity is why every model in this course works with log returns.

For small moves, log and simple returns are nearly the same: +1% simple is \(\ln 1.01 = 0.995\%\) in logs. For big moves they differ a lot: +50% is \(\ln 1.5 = 40.5\%\), and −50% is \(\ln 0.5 = -69.3\%\). Logs also have no floor. A log return can be any number, but the price \(S_0 e^{r}\) is always positive, which is how the model keeps prices above zero.

### ② The \(\sqrt{T}\) rule and annualising

Model each period's log return as independent, with the same variance \(\sigma^2 \Delta t\). Independent variances add, so over a horizon \(T\):

$$
\begin{gathered}
\operatorname{Var}\!\left[\ln\frac{S_T}{S_0}\right] = \sigma^2 T \\
\text{typical move (1 s.d.)} = \sigma\sqrt{T} \ \text{in log terms} \ \approx\ S\sigma\sqrt{T} \ \text{in dollars}
\end{gathered}
$$

Where \(\sigma\) is the **annualised volatility**, the standard deviation of one year's log return, and \(T\) is in years. The dollar version is a good approximation for short horizons. About 68% of outcomes land within ±1 standard deviation and about 95% within ±2, if the bell curve is right (section ⑤ checks that).

**Which “day” counts?** There are two conventions, and you must say which one you use:

- **Calendar days**, \(T = \text{days}/365\). This course uses it for option expiries. XYZ's one-day move is \(20\%/\sqrt{365} = 1.05\%\).
- **Trading days**, \(T = \text{days}/252\), since markets are open about 252 days a year. It's used when measuring volatility from daily closing prices ([[realized-vol]]). The one-day move becomes \(20\%/\sqrt{252} = 1.26\%\), because the year's variance is spread over fewer days.

> [!EXAMPLE] The rule of 16
> \(\sqrt{252} = 15.87 \approx 16\). So on trading days, **annual volatility ÷ 16 ≈ typical daily move**. XYZ at 20% moves about \(20/16 = 1.25\%\) a day, around $1.25. An index with 16% volatility moves about 1% a day, which is why traders read a [[vix]] of 16 as “about 1% a day”. And back the other way: if a stock's typical day is 3%, its annualised volatility is about \(3 \times 16 = 48\%\).

The \(\sqrt{T}\) rule is everywhere in options. The at-the-money price rule \(C \approx 0.4\,S\sigma\sqrt{T}\) from [[black-scholes]] is just a constant times the typical move. The 30-day straddle ≈ \(0.8 \times 5.73 = 4.58\) (exact 4.57) prices “the average absolute move” ([[straddle-strangle]]). And a trader who wants to compare a 1-week and a 1-year option first asks: how many \(\sigma\sqrt{T}\) away is the strike?

### ③ Geometric Brownian motion and the lognormal

Shrink the steps to zero and the random walk in log-price becomes **geometric Brownian motion** (GBM), the model behind Black-Scholes:

$$
\frac{\dd S}{S} = \mu\,\dd t + \sigma\,\dd W, \qquad \ln S_T \sim \mathcal{N}\!\Big(\ln S_0 + \big(\mu - \tfrac12\sigma^2\big)T,\ \ \sigma^2 T\Big)
$$

Where:

- \(\dd S/S\) is the return over an instant \(\dd t\);
- \(\mu\) is the drift, the expected return per year (in pricing, \(\mu\) is replaced by \(r\), as [[risk-neutral]] explained);
- \(\sigma\,\dd W\) is the random shock: \(\dd W\) has mean 0 and variance \(\dd t\), the continuous version of the tree's \(\pm\sqrt{\Delta t}\) step;
- \(\mathcal{N}(m, v)\) is a normal distribution with mean \(m\) and variance \(v\). The *log* price is normal, so the price itself is **lognormal**.

> [!EXAMPLE] XYZ one year out (drift 4%, σ 20%)
> \(\ln S_T\) is normal with mean \(\ln 100 + (0.04 - 0.02) = 4.625\) and standard deviation 0.20. So:
> - **median** \(= 100e^{0.02} = 102.02\) (half the outcomes above, half below);
> - **mean** \(= 100e^{0.04} = 104.08\), pulled up by the long right tail;
> - **±1σ band** \(= 100e^{0.02 \pm 0.20}\): from 83.53 to 124.61, that's +24.61 up but only −16.47 down;
> - **chance of ending below 100** \(= \N(-0.10) = 46\%\): slightly less than half, because of the drift.

Three features of the lognormal matter for options:

- **Never below zero.** A stock can lose everything but not more; a lognormal price can get close to 0 but never cross it. That fits stocks. It doesn't fit things that can go negative (spreads, some futures), a point [[bs-assumptions]] returns to.
- **Skewed upward.** Up moves are bigger in dollars than down moves of the same probability. With \(\sigma\sqrt{T}\) small the skew is mild; with a long horizon or high volatility it's strong. The figure shows ten years of XYZ.
- **The width is \(\sigma\sqrt{T}\).** Everything about the shape (skew, spread, the gap between mean and median) is governed by that one number.

<figure>
<svg viewBox="0 0 660 250" role="img" aria-label="Lognormal distribution of XYZ after one year and after ten years">
<defs><marker id="random-walk-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<polyline points="53,200 64,200 75,200 86,200 98,200 109,200 120,199 131,195 142,178 154,143 165,98 176,61 187,48 198,59 210,86 221,116 232,144 243,165 254,179 266,188 277,194 288,197 299,198 310,199 322,200 333,200 344,200 355,200 366,200 378,200 389,200 400,200 411,200 422,200 434,200 445,200 456,200 467,200 478,200 490,200 501,200 512,200 523,200 534,200 546,200 557,200 568,200 579,200 590,200 602,200" class="fx-line-hl"/>
<polygon points="53,200 64,200 75,197 86,191 98,182 109,172 120,165 131,159 142,155 154,153 165,152 176,152 187,154 198,156 210,158 221,161 232,163 243,166 254,168 266,171 277,173 288,175 299,177 310,179 322,181 333,183 344,184 355,186 366,187 378,188 389,189 400,190 411,191 422,192 434,192 445,193 456,193 467,194 478,195 490,195 501,195 512,196 523,196 534,196 546,197 557,197 568,197 579,197 590,198 602,198 602,200" class="fx-area-blue"/>
<polyline points="53,200 64,200 75,197 86,191 98,182 109,172 120,165 131,159 142,155 154,153 165,152 176,152 187,154 198,156 210,158 221,161 232,163 243,166 254,168 266,171 277,173 288,175 299,177 310,179 322,181 333,183 344,184 355,186 366,187 378,188 389,189 400,190 411,191 422,192 434,192 445,193 456,193 467,194 478,195 490,195 501,195 512,196 523,196 534,196 546,197 557,197 568,197 579,197 590,198 602,198" class="fx-line-blue"/>
<line x1="40" y1="200" x2="625" y2="200" class="fx-axis" marker-end="url(#random-walk-ah2)"/>
<line x1="221" y1="140" x2="221" y2="200" class="fx-line-blue fx-dash"/>
<line x1="259" y1="150" x2="259" y2="200" class="fx-line-blue fx-dash"/>
<text x="50" y="218" text-anchor="middle" class="fx-t-sm">0</text>
<text x="190" y="218" text-anchor="middle" class="fx-t-sm">100</text>
<text x="330" y="218" text-anchor="middle" class="fx-t-sm">200</text>
<text x="470" y="218" text-anchor="middle" class="fx-t-sm">300</text>
<text x="610" y="218" text-anchor="middle" class="fx-t-sm">400</text>
<text x="620" y="240" text-anchor="end" class="fx-t-sm">XYZ price</text>
<text x="205" y="44" class="fx-t-hl">1 year: narrow, nearly symmetric</text>
<text x="205" y="62" class="fx-t-sm">median 102, mean 104</text>
<text x="300" y="128" class="fx-t-blue">10 years: wide, long right tail</text>
<text x="300" y="146" class="fx-t-sm">median 122 (dashed left), mean 149 (dashed right)</text>
<text x="300" y="164" class="fx-t-sm">38% of outcomes still end below 100</text>
</svg>
<figcaption>Figure 2 · The same random walk (drift 4%, σ 20%) seen after one year and after ten. After one year \(\sigma\sqrt{T} = 0.20\) and the lognormal looks almost like a bell. After ten years \(\sigma\sqrt{T} = 0.63\): the curve is flat and skewed, the mean (149) runs well ahead of the median (122), and a few very large outcomes carry the average.</figcaption>
</figure>

### ④ Volatility drag: why the typical outcome trails the average

The formula in ③ has a \(-\tfrac12\sigma^2\) that deserves its own section. It means that the **median** path grows at \(\mu - \tfrac12\sigma^2\) per year, while the **mean** grows at \(\mu\):

$$
\E[S_T] = S_0\,e^{\mu T}, \qquad \operatorname{median}(S_T) = S_0\,e^{(\mu - \frac12\sigma^2)T}
$$

Where \(\E[S_T]\) is the average over all outcomes, and the median is the outcome with half the paths above it and half below. The gap between them, \(\tfrac12\sigma^2\) per year, is called **volatility drag**. It's the continuous version of “up 10%, down 10% leaves you at 99”.

> [!EXAMPLE] Drag at two volatilities
> - **XYZ-like stock**, \(\mu = 8\%\), \(\sigma = 20\%\): drag \(= \tfrac12 \times 0.04 = 2\%\). The typical (median) path compounds at 6% a year.
> - **A very volatile asset** (illustrative, BTC-like), \(\mu = 8\%\), \(\sigma = 50\%\): drag \(= \tfrac12 \times 0.25 = 12.5\%\). The median path compounds at \(8\% - 12.5\% = -4.5\%\) a year. Over ten years the *average* outcome is \(100e^{0.8} = 223\), yet the *median* is \(100e^{-0.45} = 64\). Most paths lose money while the average soars, carried by a few huge winners.

This is more than a curiosity. It's why leveraged products decay in choppy markets, why position sizing matters ([[position-sizing]]), and why some argue that tail hedges can raise long-run compound growth ([[tail-hedging]]). For option pricing it's the \(-\tfrac12\sigma^2\) inside \(d_2\), and the \(\pm\tfrac12\sigma^2\) convexity correction you'll meet in [[black-scholes]].

> [!HISTORY] 1900: the first random walk in finance
> In 1900 Louis Bachelier defended a doctoral thesis in Paris, *Théorie de la spéculation*, that modelled bond prices as a random walk and priced options on them. That was five years before Einstein's paper on Brownian motion. Bachelier's walk was arithmetic: prices moved by normally distributed *amounts*, so they could in principle go negative. The later geometric version, where *percentage* changes are random, is the one Black and Scholes used in 1973. Bachelier's model has made a comeback wherever prices can be negative ([[bs-assumptions]]).

### ⑤ From the walk to Black-Scholes, and where the walk goes wrong

Put the pieces together:

- replication and \(\Q\) ([[binomial-one-step]], [[risk-neutral]]) say: price = discounted expected payoff with drift \(r\);
- the tree ([[binomial-trees]]) says: in the limit of many steps, that expectation is over a lognormal;
- this lesson says which lognormal: \(\ln S_T\) normal with mean \(\ln S + (r - \tfrac12\sigma^2)T\) and standard deviation \(\sigma\sqrt{T}\).

That's exactly the distribution in the first figure of [[black-scholes]]. The formula's \(d_2\) is the number of these standard deviations by which the centre of \(\ln S_T\) sits above \(\ln K\): for the 1-year XYZ call, \(d_2 = (0 + 0.02)/0.20 = 0.10\).

> [!WARN] Real returns are wilder than the random walk
> The GBM walk is the standard *starting* point, not the truth. Two facts matter most. **Fat tails**: big moves happen far more often than a bell curve allows. On 19 October 1987 the S&P 500 fell about 20.5% in one day (the Dow about 22.6%). For a market with 20% volatility that's roughly 18 daily standard deviations in log terms, something a normal distribution says should essentially never happen. **Volatility clustering**: calm and stormy periods come in runs, so σ itself moves. [[bs-assumptions]] measures both, and [[realized-vol]] shows how to estimate σ from data.

Even so, the \(\sqrt{T}\) rule survives surprisingly well as a first approximation. That's why option markets quote volatility as an annual number and translate it with \(\sqrt{T}\) to any horizon, as in [[implied-vol]].

## @analogy
Think of a drop of ink falling into a glass of still water. Each ink particle is jostled by billions of water molecules from random directions. No single nudge matters, and no particle “knows” where it's going. Yet the cloud of ink spreads in a very predictable way. Its width grows like the square root of time: after four seconds it's twice as wide as after one, not four times.

A stock is the ink particle, and the news, orders and trades are the molecules. The cloud of possible prices is the option market's object of study. Volatility says how hard the molecules push, and \(\sigma\sqrt{T}\) says how wide the cloud has grown by expiry.

Where the analogy breaks: ink spreads symmetrically, in plain distance, but prices spread in *percentages*. That makes the price cloud lopsided (the lognormal) and keeps it above zero. And water molecules never panic. In markets, shocks come in bursts, and sometimes one enormous shove (a crash or an earnings gap) moves the whole cloud at once. Those are the fat tails and jumps the gentle diffusion picture leaves out.

## @misconceptions
- **“Twice the time means twice the risk.”** — Twice the *variance*, but only \(\sqrt{2} \approx 1.41\) times the typical move. XYZ's typical 30-day move is $5.73, the 120-day move is about $11.47, not $22.92.
- **“Up 10% then down 10% gets you back to where you started.”** — It leaves you at 99. Percentage moves compound; log returns are the ones that add. The same effect makes the typical path lag the average by \(\tfrac12\sigma^2\) a year.
- **“If the average outcome grows, most investors will make money.”** — Not with high volatility. At \(\mu = 8\%\) and \(\sigma = 50\%\), the median ten-year outcome is 64 while the mean is 223: most paths lose money, and a few giant winners lift the average.
- **“Annual vol ÷ 365 gives the daily move.”** — Divide by the *square root* of the number of days: \(20\%/\sqrt{365} = 1.05\%\) per calendar day, or \(20\%/\sqrt{252} = 1.26\%\) per trading day (the rule of 16). Always say which convention you use.
- **“Prices follow a bell curve.”** — In this model *log* prices do; prices are lognormal, skewed and never negative. And real returns have fatter tails than either model allows.

## @takeaways
- Model returns, not prices; log returns add over time, and \(1.10 \times 0.90 = 0.99\) shows why simple returns don't.
- Independent shocks add variances, so uncertainty grows like \(\sqrt{T}\): XYZ's typical move is $1.05 a day, $5.73 a month, $20 a year.
- Say which day count you use: \(T = \text{days}/365\) for option expiries in this course, 252 trading days for measuring volatility; the rule of 16 converts annual vol to a daily move.
- Geometric Brownian motion makes \(\ln S_T\) normal with mean \(\ln S_0 + (\mu - \tfrac12\sigma^2)T\) and variance \(\sigma^2 T\): prices are lognormal, never negative, skewed right.
- Volatility drag: the median grows at \(\mu - \tfrac12\sigma^2\), the mean at \(\mu\). Replace \(\mu\) by \(r\) and this is the distribution Black-Scholes integrates over.

## @quiz
1. XYZ's typical one-day move is about $1.05. Using the \(\sqrt{T}\) rule, what is the typical move over 25 days?
   - [ ] $26.25
   - [x] about $5.25
   - [ ] about $2.10
   - [ ] $1.05, because each day is independent
   > Variance scales with time, so the standard deviation scales with \(\sqrt{25} = 5\): \(5 \times 1.05 = 5.25\). Multiplying by 25 would treat moves as if they always pointed the same way.
2. A stock rises 20% one day and falls 20% the next. Where does it end, starting from $100?
   - [ ] $100, the moves cancel
   - [x] $96
   - [ ] $104
   - [ ] $80
   > \(100 \times 1.20 \times 0.80 = 96\). In logs: \(\ln 1.2 + \ln 0.8 = 0.182 - 0.223 = -0.041\), a 4% loss. Percentage moves compound; that's volatility drag in miniature.
3. An index has annualised volatility of 16%. Using the rule of 16, roughly how big is a typical daily move on a trading day?
   - [ ] 16%
   - [ ] about 0.06%
   - [x] about 1%
   - [ ] about 4%
   > Daily move ≈ annual vol ÷ \(\sqrt{252}\) ≈ annual vol ÷ 16 = 1%. Dividing by 252 instead of its square root gives the absurdly small 0.06%.
4. Under geometric Brownian motion with \(\mu = 4\%\) and \(\sigma = 20\%\), XYZ's one-year median is 102.02 and its mean is 104.08. Why are they different?
   - [x] Because the lognormal distribution is skewed right: a long tail of big gains pulls the mean above the median
   - [ ] Because the simulation has too few paths
   - [ ] Because the mean includes dividends and the median doesn't
   - [ ] Because the median uses trading days and the mean uses calendar days
   > The median grows at \(\mu - \tfrac12\sigma^2 = 2\%\), the mean at \(\mu = 4\%\). The gap, \(\tfrac12\sigma^2\), is volatility drag, and it grows with volatility and time.
5. In the random-walk model, what is the probability that XYZ ever goes below $0?
   - [ ] About 2.5%, the −2σ tail
   - [ ] It depends on the horizon: small over a year, large over decades
   - [ ] Zero only if the drift is positive
   - [x] Zero: the price is \(S_0 e^{\text{(log return)}}\), which is always positive
   > Log returns can be any size, but the exponential of any number is positive, so a lognormal price can approach zero but never reach or cross it. Arithmetic (Bachelier) models, by contrast, can go negative.

## @further
- [Geometric Brownian motion (Wikipedia)](https://en.wikipedia.org/wiki/Geometric_Brownian_motion) — the model, its solution and the lognormal distribution, with simulated paths.
- [Bachelier (1900), Théorie de la spéculation](http://www.numdam.org/item/ASENS_1900_3_17__21_0/) — the original random-walk model of prices (in French), five years before Einstein.
- [Log-normal distribution (Wikipedia)](https://en.wikipedia.org/wiki/Log-normal_distribution) — mean, median and mode formulas, and why the shape depends on \(\sigma\sqrt{T}\).
- [New Finance Path](https://evidex-cloud.github.io/droplet-labs-finance-path/) — sister course; for compounding, returns and risk in the wider world of finance.

## @next
We now have all three ingredients: a price you can replicate, a risk-neutral way to average payoffs, and a lognormal random walk whose width is \(\sigma\sqrt{T}\). Put them together and one formula falls out, the most famous in finance. The next lesson reads it term by term: [[black-scholes]].
