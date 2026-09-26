---
id: monte-carlo
prereqs: risk-neutral, random-walk, black-scholes
demo: monte-carlo
---

# Monte Carlo Pricing: Valuing by Simulation

## @hook
An option's price is an average: the discounted payoff, averaged over every future the risk-neutral world allows. When no formula can do that average for you, simulate it — draw thousands of futures, pay each one out, average. The catch is the error bar: it shrinks only like \(1/\sqrt{N}\), so one more correct digit costs a hundred times more work. The real craft is making the noise smaller.

## @bridge
[[risk-neutral]] gave us the pricing rule \(V_0 = e^{-rT}\E^{\Q}[\text{payoff}]\). [[random-walk]] showed how to generate lognormal prices, and [[black-scholes]] did the expectation in closed form for a plain European option. This lesson opens the Mastery tier with a practical question: **what do you do when no formula exists** — for an average-price option, a barrier, a basket of five stocks? You estimate the expectation by sampling, and you report an error bar with it. It builds Idea ② (no-arbitrage): Monte Carlo changes nothing about *what* the price is — the same measure \(\Q\), the same discounting — only *how* the integral gets computed. The next two lessons, [[finite-difference]] and [[american-exercise]], give the other numerical roads.

## @intuition
Take Kai's 1-year, $100-strike call on XYZ (\(S = 100\), \(\sigma = 20\%\), \(r = 4\%\), no dividend). Black-Scholes says **$9.93**. Pretend for a moment that we don't know that, and follow a recipe instead:

1. Draw a standard normal number \(Z\) (the computer's “dice”).
2. Turn it into a risk-neutral price one year from now: \(S_T = 100\,e^{0.02 + 0.2Z}\). The \(0.02\) is \(r - \tfrac12\sigma^2 = 0.04 - 0.02\).
3. Pay the option out: \(\max(S_T - 100,\,0)\).
4. Repeat, average the payoffs, and discount by \(e^{-0.04}\).

Here are the first ten draws (seed 2026 — the inline demo below reproduces them exactly):

| Draw | \(Z\) | \(S_T\) | Payoff |
|---|---|---|---|
| 1 | −0.45 | 93.23 | 0.00 |
| 2 | 1.17 | 128.93 | 28.93 |
| 3 | −0.67 | 89.24 | 0.00 |
| 4 | −0.62 | 90.19 | 0.00 |
| 5 | 0.34 | 109.23 | 9.23 |
| 6 | 1.91 | 149.48 | 49.48 |
| 7 | 0.28 | 107.84 | 7.84 |
| 8 | −0.83 | 86.45 | 0.00 |
| 9 | 1.51 | 137.99 | 37.99 |
| 10 | 0.41 | 110.84 | 10.84 |

The average payoff is 14.43; discounted, \(14.43 \times e^{-0.04} = 13.87\). That is $3.94 too high. Is the method broken?

No — and the ten payoffs themselves tell us so. They are wildly spread out: from 0 to 49.48, with a sample standard deviation of about 18. The average of ten such numbers is uncertain by roughly \(18/\sqrt{10} \approx 5.7\) before discounting, or **±5.46** after. So the honest report of this tiny experiment is “\(13.87 \pm 5.46\)”, and the true 9.93 sits comfortably inside one error bar.

> [!KAI] “So it's just a guess?”
> Kai's first reaction is disappointment. But a Monte Carlo price is not a guess; it is an **estimate with a known error bar**. With 10 draws the bar is ±5.46. With 10,000 draws one run gave \(9.80 \pm 0.15\). With a million, about ±0.014. The method always tells you how much to trust it — something a single formula evaluation never does.

::demo[monte-carlo-draws]

Notice the rhythm in the demo: every time you multiply the number of draws by 10, the band narrows by a factor of about 3.2 (\(\sqrt{10}\)). That is the square-root law, and it governs everything in this lesson.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Monte Carlo convergence funnel">
<defs><marker id="monte-carlo-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<polygon points="70,55 88,62 105,68 123,73 141,78 158,82 176,86 194,89 211,92 229,95 247,97 264,99 282,101 300,103 317,104 335,106 353,107 370,108 388,109 406,110 423,110 441,111 459,112 476,112 494,113 512,113 529,114 547,114 565,114 582,114 600,115 600,119 582,119 565,119 547,119 529,120 512,120 494,120 476,121 459,121 441,122 423,123 406,123 388,124 370,125 353,126 335,127 317,129 300,130 282,132 264,134 247,136 229,138 211,141 194,144 176,147 158,151 141,155 123,160 105,165 88,171 70,178" class="fx-area-hl"/>
<line x1="60" y1="200" x2="615" y2="200" class="fx-axis" marker-end="url(#monte-carlo-ah)"/>
<line x1="60" y1="200" x2="60" y2="25" class="fx-axis"/>
<text x="68" y="24" class="fx-t-sm">Monte Carlo estimate</text>
<line x1="60" y1="116.6" x2="610" y2="116.6" class="fx-line fx-dash"/>
<polyline points="70,88 123,117 193,147 247,139 300,119 370,118 423,119 477,118 547,117 600,117" class="fx-line-thick"/>
<circle cx="70" cy="88" r="4" class="fx-fill-ink"/>
<circle cx="123" cy="117" r="4" class="fx-fill-ink"/>
<circle cx="193" cy="147" r="4" class="fx-fill-red"/>
<circle cx="247" cy="139" r="4" class="fx-fill-ink"/>
<circle cx="300" cy="119" r="4" class="fx-fill-ink"/>
<circle cx="370" cy="118" r="4" class="fx-fill-ink"/>
<circle cx="423" cy="119" r="4" class="fx-fill-ink"/>
<circle cx="477" cy="118" r="4" class="fx-fill-ink"/>
<circle cx="547" cy="117" r="4" class="fx-fill-ink"/>
<circle cx="600" cy="117" r="4" class="fx-fill-ink"/>
<text x="54" y="204" text-anchor="end" class="fx-t-sm">6</text>
<text x="54" y="161" text-anchor="end" class="fx-t-sm">8</text>
<text x="54" y="119" text-anchor="end" class="fx-t-sm">10</text>
<text x="54" y="76" text-anchor="end" class="fx-t-sm">12</text>
<text x="54" y="34" text-anchor="end" class="fx-t-sm">14</text>
<text x="70" y="218" text-anchor="middle" class="fx-t-sm">100</text>
<text x="247" y="218" text-anchor="middle" class="fx-t-sm">1,000</text>
<text x="423" y="218" text-anchor="middle" class="fx-t-sm">10,000</text>
<text x="600" y="218" text-anchor="middle" class="fx-t-sm">100,000</text>
<text x="335" y="240" text-anchor="middle" class="fx-t-sm">number of paths N (log scale)</text>
<text x="612" y="108" text-anchor="end" class="fx-t">BS = 9.93</text>
<text x="96" y="84" class="fx-t-sm">N = 100: 11.26</text>
<text x="200" y="168" class="fx-t-bad">N = 500: 8.50, just outside</text>
<text x="330" y="60" class="fx-t-hl">shaded: 9.93 ± 2 standard errors</text>
<text x="330" y="78" class="fx-t-sm">width shrinks like 1/√N</text>
</svg>
<figcaption>Figure 1 · One run of the Monte Carlo estimate for Kai's 1-year call as paths accumulate (seed 7, no variance reduction). The shaded funnel is \(9.93 \pm 2\,\text{SE}\) with \(\text{SE} = 14.42/\sqrt{N}\); it narrows tenfold between 100 and 10,000 paths. The estimate wanders inside it and once (at 500 paths) pokes just outside — exactly what a 95% band is supposed to do about one time in twenty.</figcaption>
</figure>

> [!THINK] With 10,000 paths the standard error of Kai's call is about 0.14. You want it to be 0.014 — one more reliable digit. How many paths do you need?
> Predict before you open the answer.
> ---
> The error falls like \(1/\sqrt{N}\), so dividing it by 10 needs \(10^2 = 100\) times the paths: **one million**. A second extra digit would need 100 million. This is why practitioners spend their effort on *variance reduction* — shrinking the numerator of the error — rather than on brute force.

Why bother, when Black-Scholes already gives 9.93? Because the recipe never looked at the *shape* of the payoff. Replace step 3 with “the average of 12 month-end prices minus 100”, or “zero if the price ever touched $90”, or “the worst of five stocks” — the recipe is unchanged, while the formula route dies. For a plain call, the formula is the answer key we check the simulation against; for everything else, simulation is often the only tool that works.

We'll take it in five parts:

- **① The estimator and its error bar**
- **② Paths, time steps and the error budget**
- **③ Variance reduction: the same answer from fewer paths**
- **④ Greeks by simulation**
- **⑤ Quasi-random numbers, GPUs, and where Monte Carlo fits in 2026**

## @mechanics
### ① The estimator and its error bar

Everything rests on one line from [[risk-neutral]]: the price is a discounted expectation under \(\Q\). Monte Carlo replaces the expectation with a sample average:

$$
\hat V_N = e^{-rT}\,\frac{1}{N}\sum_{i=1}^{N} g\big(S_T^{(i)}\big), \qquad S_T^{(i)} = S_0\,\exp\!\Big(\big(r - q - \tfrac12\sigma^2\big)T + \sigma\sqrt{T}\,Z_i\Big)
$$

where \(g\) is the payoff (for a call, \(g(S_T) = \max(S_T - K, 0)\)), \(N\) is the number of simulated outcomes, \(Z_i\) are independent standard normal draws, and \(q\) is the dividend yield (zero for XYZ). The exponent is the exact solution of geometric Brownian motion from [[random-walk]], with the drift set to the risk-free rate — not to the stock's real expected return, because hedging removes it.

Two theorems do the rest. The **law of large numbers** says \(\hat V_N\) converges to the true price as \(N\) grows, and the estimator is **unbiased**: on average it is neither high nor low. The **central limit theorem** says how far off a single run is likely to be:

$$
\text{SE} = \frac{s}{\sqrt{N}}, \qquad s^2 = \frac{1}{N-1}\sum_{i=1}^{N}\big(Y_i - \bar Y\big)^2, \qquad \text{95\% interval} \approx \hat V_N \pm 1.96\,\text{SE}
$$

Here \(Y_i = e^{-rT}g(S_T^{(i)})\) is the discounted payoff of path \(i\), \(\bar Y\) is their average (which is \(\hat V_N\)), and \(s\) is their sample standard deviation. The standard error, SE, is the standard deviation of the *estimate*, not of a single payoff.

> [!EXAMPLE] How many paths does a cent cost?
> For Kai's 1-year call, the discounted payoff has a standard deviation of about \(s = 14.42\) — larger than the price itself, because most paths pay zero and a few pay 40 or 50.
> - With \(N = 10{,}000\): \(\text{SE} = 14.42/\sqrt{10{,}000} = 0.144\). One run gave \(9.80\), so the 95% interval is \(9.80 \pm 0.28\) — it contains 9.93.
> - For \(\text{SE} = 0.01\) (one cent): \(N = (14.42/0.01)^2 \approx 2.08\) million paths.
>
> Per contract that cent is \(\$1\) of a \(\$993\) price. Whether that precision matters depends on what you do with the number — a market maker quoting thousands of contracts cares; a quick sanity check does not.

> [!WARN] Two classic bugs
> **Forgetting the \(-\tfrac12\sigma^2\).** Simulate \(S_T = 100\,e^{0.04 + 0.2Z}\) instead and the average of \(S_T\) becomes \(104.08 \times e^{0.02} = 106.18\) rather than the forward 104.08: the call comes out at **$11.21** instead of $9.93, and no number of paths will fix it. **Using the real-world drift \(\mu\).** Simulating with a 10% expected return prices a different, wrong object; the risk-neutral drift is \(r - q\) ([[risk-neutral]]).

### ② Paths, time steps and the error budget

A European payoff only needs \(S_T\), so one jump from today to expiry suffices. A **path-dependent** payoff — an average, a maximum, a barrier — needs the price at intermediate dates. Chop \([0, T]\) into \(m\) steps of length \(\Delta t = T/m\) and advance one step at a time:

$$
S_{t+\Delta t} = S_t\,\exp\!\Big(\big(r - q - \tfrac12\sigma^2\big)\Delta t + \sigma\sqrt{\Delta t}\,Z_t\Big)
$$

with a fresh normal draw \(Z_t\) at every step. For geometric Brownian motion this update is exact at the grid dates, so an Asian option with 12 monthly fixings needs exactly 12 steps and carries no time-step error. The cost is \(N \times m\) normal draws: 10,000 paths of 252 daily steps is 2.52 million.

Two things can still go wrong, and **neither is fixed by more paths**:

- **Monitoring bias.** A barrier that is watched continuously can be crossed *between* your time steps without the simulation noticing. XYZ, 1-year 100 call that dies if the price ever touches $90: the continuous-monitoring formula gives **$8.20**. Simulation gives about \(9.04\) with 12 steps, \(8.66\) with 52 steps and \(8.44\) with 252 steps (a 40,000-path run carries a standard error of about ±0.07). The gap shrinks slowly — roughly like \(\sqrt{\Delta t}\) — and it is a *bias*, not noise. (Contracts that watch the barrier only at daily closes are genuinely worth more than the continuous formula; see [[exotic-options]].)
- **Discretisation bias for other models.** Stochastic-volatility and local-volatility models ([[stochastic-vol]]) have no exact one-step solution. The Euler scheme \(S_{t+\Delta t} \approx S_t + (r-q)S_t\Delta t + \sigma(S_t, t)\,S_t\sqrt{\Delta t}\,Z_t\) introduces an error that shrinks with \(\Delta t\), not with \(N\).

So the total error has two parts, and a good budget balances them:

$$
\text{RMSE}^2 = \text{bias}^2 + \frac{s^2}{N}
$$

where RMSE is the root-mean-square error of the estimate, “bias” comes from time steps or monitoring, and \(s^2/N\) is the statistical variance from ①. Halving the step size doubles the cost per path; quadrupling \(N\) halves the noise. Spending all the compute on paths while using 12 steps for a daily-monitored barrier buys a very precise wrong answer.

### ③ Variance reduction: the same answer from fewer paths

Since \(\text{SE} = s/\sqrt{N}\), there are two ways to shrink it: raise \(N\) (expensive) or lower \(s\) (clever). Variance-reduction techniques lower \(s\) without changing what is being estimated.

**Antithetic variates.** For every draw \(Z\), also use \(-Z\), and average the two payoffs. A high draw and its mirror image partly cancel. For Kai's call, with 10,000 payoff evaluations in both cases, the standard error falls from 0.146 to 0.107 — the variance drops by a factor of about 1.9, for free. It works because the call payoff rises with \(Z\); for a payoff that is symmetric in \(Z\) (a straddle is close to that), the pair is positively correlated and antithetics can make things worse.

**Control variates** are the big gun. Suppose you simulate the thing you want, \(Y\), alongside a similar thing \(X\) whose exact value \(\E[X]\) you know. On any run, the error in \(\bar X\) is visible — so use it to correct \(\bar Y\):

$$
\hat V_{\text{CV}} = \bar Y - \beta\,\big(\bar X - \E[X]\big), \qquad \beta = \frac{\operatorname{Cov}(Y, X)}{\operatorname{Var}(X)}, \qquad \operatorname{Var}\big(\hat V_{\text{CV}}\big) = \big(1 - \rho^2\big)\operatorname{Var}\big(\bar Y\big)
$$

where \(\bar Y\) and \(\bar X\) are the simulated averages, \(\beta\) is the regression slope of \(Y\) on \(X\) (estimated from the same paths), and \(\rho\) is their correlation. The better \(X\) tracks \(Y\), the closer \(\rho\) is to 1 and the more variance disappears.

> [!EXAMPLE] The Asian option and its geometric twin
> Target \(Y\): a 1-year **arithmetic-average** Asian call on XYZ, strike 100, 12 monthly fixings — it pays \(\max(\bar S - 100, 0)\) where \(\bar S\) is the plain average of the 12 prices. No closed form exists.
> Control \(X\): the same option on the **geometric** average. The log of a geometric average of lognormal prices is normal, so it has an exact Black-Scholes-style price: **5.685**.
> On 10,000 paths the two payoffs have correlation \(\rho = 0.9996\) and \(\beta \approx 1.03\):
> - plain estimate: \(5.907 \pm 0.083\)
> - control-variate estimate: \(5.894 \pm 0.0023\)
>
> The standard error shrank by a factor of 35, so the variance by \(35^2 \approx 1{,}260\) — which matches \(1/(1-\rho^2) = 1/(1 - 0.9996^2) \approx 1{,}260\). Ten thousand controlled paths are worth about **12.6 million** plain ones. (The averaged price, about 5.89, is well below the European 9.93: averaging lowers the effective volatility — more in [[exotic-options]].)

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Arithmetic versus geometric Asian payoffs on the same paths">
<defs><marker id="monte-carlo-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="70" y1="220" x2="600" y2="220" class="fx-axis" marker-end="url(#monte-carlo-ah2)"/>
<line x1="70" y1="220" x2="70" y2="15" class="fx-axis" marker-end="url(#monte-carlo-ah2)"/>
<line x1="80" y1="220" x2="575" y2="17" class="fx-line-hl fx-dash"/>
<circle cx="101" cy="211" r="3.5" class="fx-fill-orange"/><circle cx="130" cy="200" r="3.5" class="fx-fill-orange"/><circle cx="182" cy="178" r="3.5" class="fx-fill-orange"/><circle cx="256" cy="149" r="3.5" class="fx-fill-orange"/><circle cx="248" cy="150" r="3.5" class="fx-fill-orange"/><circle cx="204" cy="167" r="3.5" class="fx-fill-orange"/><circle cx="85" cy="217" r="3.5" class="fx-fill-orange"/><circle cx="80" cy="220" r="3.5" class="fx-fill-orange"/><circle cx="174" cy="182" r="3.5" class="fx-fill-orange"/><circle cx="321" cy="116" r="3.5" class="fx-fill-orange"/><circle cx="495" cy="46" r="3.5" class="fx-fill-orange"/><circle cx="135" cy="197" r="3.5" class="fx-fill-orange"/><circle cx="106" cy="209" r="3.5" class="fx-fill-orange"/><circle cx="225" cy="161" r="3.5" class="fx-fill-orange"/><circle cx="103" cy="209" r="3.5" class="fx-fill-orange"/><circle cx="106" cy="208" r="3.5" class="fx-fill-orange"/><circle cx="132" cy="198" r="3.5" class="fx-fill-orange"/><circle cx="310" cy="127" r="3.5" class="fx-fill-orange"/><circle cx="458" cy="64" r="3.5" class="fx-fill-orange"/><circle cx="208" cy="168" r="3.5" class="fx-fill-orange"/><circle cx="363" cy="107" r="3.5" class="fx-fill-orange"/><circle cx="168" cy="184" r="3.5" class="fx-fill-orange"/><circle cx="119" cy="204" r="3.5" class="fx-fill-orange"/><circle cx="320" cy="124" r="3.5" class="fx-fill-orange"/><circle cx="134" cy="197" r="3.5" class="fx-fill-orange"/><circle cx="558" cy="27" r="3.5" class="fx-fill-orange"/><circle cx="155" cy="190" r="3.5" class="fx-fill-orange"/><circle cx="176" cy="180" r="3.5" class="fx-fill-orange"/><circle cx="485" cy="56" r="3.5" class="fx-fill-orange"/><circle cx="136" cy="194" r="3.5" class="fx-fill-orange"/><circle cx="162" cy="187" r="3.5" class="fx-fill-orange"/><circle cx="127" cy="201" r="3.5" class="fx-fill-orange"/><circle cx="181" cy="179" r="3.5" class="fx-fill-orange"/><circle cx="135" cy="197" r="3.5" class="fx-fill-orange"/><circle cx="193" cy="173" r="3.5" class="fx-fill-orange"/>
<text x="80" y="238" text-anchor="middle" class="fx-t-sm">0</text>
<text x="217" y="238" text-anchor="middle" class="fx-t-sm">10</text>
<text x="354" y="238" text-anchor="middle" class="fx-t-sm">20</text>
<text x="491" y="238" text-anchor="middle" class="fx-t-sm">30</text>
<text x="62" y="224" text-anchor="end" class="fx-t-sm">0</text>
<text x="62" y="170" text-anchor="end" class="fx-t-sm">10</text>
<text x="62" y="115" text-anchor="end" class="fx-t-sm">20</text>
<text x="62" y="61" text-anchor="end" class="fx-t-sm">30</text>
<text x="590" y="254" text-anchor="end" class="fx-t-sm">geometric-average payoff X (known price 5.685)</text>
<text x="80" y="12" class="fx-t-sm">arithmetic-average payoff Y</text>
<text x="360" y="195" class="fx-t-hl">slope β ≈ 1.03, correlation ρ = 0.9996</text>
<text x="360" y="213" class="fx-t-sm">a draw that inflates X inflates Y by about the same</text>
</svg>
<figcaption>Figure 2 · Sixty simulated paths of XYZ (26 pay zero on both and sit at the origin). Each dot plots the geometric-average payoff \(X\) against the arithmetic-average payoff \(Y\) of the same path; they lie almost on a line. Because \(\E[X]\) is known exactly, the sampling error in \(\bar X\) reveals the sampling error in \(\bar Y\), and the control-variate estimator subtracts it.</figcaption>
</figure>

::demo[monte-carlo-variance]

**Importance sampling** attacks rare events. A 1-year 150 call on XYZ is worth $0.32, but only 2.7% of risk-neutral paths finish in the money; 97% of the simulation effort produces zeros. Shift the normal draws so that about half the paths land above 150 — use \(Z + \theta\) with \(\theta = 1.93\), the number of standard deviations to the strike — and correct each payoff by the likelihood ratio \(e^{-\theta(Z+\theta) + \theta^2/2}\), which undoes the tilt. With 10,000 paths the standard error drops from 0.026 (8% of the price) to 0.0037 — a variance reduction of about 49. This idea matters in risk management too, where the interesting events are the rare losses.

Other workhorses: **stratified sampling** (force the draws to cover each slice of the distribution evenly), **moment matching** (rescale the draws so their sample mean and variance are exact), and **conditional Monte Carlo** (do part of the expectation analytically and simulate only the rest).

### ④ Greeks by simulation

A price without its Greeks is only half useful ([[greeks-map]]). Three ways to get them from a simulation:

**Bump and reprice.** \(\Delta \approx [\hat V(S_0 + h) - \hat V(S_0 - h)]/(2h)\). The crucial detail is **common random numbers**: use the *same* draws \(Z_i\) for both prices. With independent draws, the noise of each price (±0.14 with 10,000 paths) divided by \(2h = 2\) would swamp the answer; with common numbers the noise largely cancels, and 100,000 paths give \(\Delta = 0.6195 \pm 0.0018\).

**Pathwise derivative.** Differentiate the discounted payoff along each path. Since \(S_T\) is proportional to \(S_0\), \(\partial S_T/\partial S_0 = S_T/S_0\), and for a call:

$$
\Delta_{\text{pathwise}} = e^{-rT}\,\E^{\Q}\!\left[\mathbf{1}_{\{S_T > K\}}\,\frac{S_T}{S_0}\right], \qquad \Delta_{\text{LR}} = e^{-rT}\,\E^{\Q}\!\left[g(S_T)\,\frac{Z}{S_0\,\sigma\sqrt{T}}\right]
$$

Here \(\mathbf{1}_{\{S_T > K\}}\) is 1 when the call finishes in the money and 0 otherwise, and \(Z\) is the normal draw that produced \(S_T\). The first estimator differentiates the payoff; the second, the **likelihood-ratio** estimator, differentiates the probability density instead and leaves the payoff alone.

> [!EXAMPLE] Kai's delta, three ways (100,000 paths)
> Black-Scholes: \(\Delta = \N(0.30) = 0.6179\).
> - Bump with common random numbers (\(h = 1\)): \(0.6195 \pm 0.0018\)
> - Pathwise: \(0.6195 \pm 0.0018\)
> - Likelihood ratio: \(0.6183 \pm 0.0045\)
>
> The pathwise estimator is as precise as bumping and needs no second simulation. The likelihood ratio is noisier here — but it is the one that still works for a **digital** option, whose payoff jumps at \(K\): the pathwise derivative of a step is zero almost everywhere, so the pathwise estimator returns exactly 0. The main demo shows this.

On large books the pathwise idea is automated by **adjoint algorithmic differentiation (AAD)**, which returns all first-order sensitivities for a small multiple of the cost of one price — whether there are 5 inputs or 5,000.

### ⑤ Quasi-random numbers, GPUs, and where Monte Carlo fits in 2026

**Quasi-random numbers.** Pseudo-random draws clump and leave gaps by chance. Low-discrepancy sequences (Halton, Sobol) are deterministic and fill the space evenly, and in low dimensions their error falls closer to \(1/N\) than to \(1/\sqrt{N}\). For Kai's call, a simple one-dimensional sequence (van der Corput) gives errors of \(-0.12\), \(-0.018\) and \(-0.0024\) at 1,000, 10,000 and 100,000 points, against standard errors of 0.45, 0.14 and 0.045 for pseudo-random draws. Two caveats: a deterministic sequence gives no error bar (randomized versions restore one), and the advantage fades in high dimensions unless the most important directions are sampled first (the “Brownian bridge” construction does this for paths).

**Parallel hardware.** Paths are independent, so simulation is “embarrassingly parallel”: thousands of GPU cores can each run their own paths and only the final sums need combining. That is why desks run large Monte Carlo engines for exotic books and portfolio-level risk.

**Where it fits.** Trees and grids ([[binomial-trees]], [[finite-difference]]) are faster and more accurate in one or two dimensions. Their cost explodes with every extra underlying or state variable — a grid with 100 points per dimension needs \(100^{10}\) nodes for ten stocks — while simulation cost grows roughly linearly. So the rule of thumb is: **low dimension → PDE or tree; high dimension or path dependence → Monte Carlo.** Monte Carlo's one natural weakness is early exercise: to decide whether to exercise on a path you need the *future* value of continuing, which a forward simulation doesn't know. The regression trick that solves this is the subject of [[american-exercise]]. And simulated paths are also the training data for [[deep-hedging]].

A minimal, vectorised version in Python (the full toolkit is in [[python-pricing]]):

```python
import numpy as np

def mc_call(S, K, T, r, sigma, n=1_000_000, seed=7):
    z = np.random.default_rng(seed).standard_normal(n // 2)
    z = np.concatenate([z, -z])                      # antithetic pairs
    ST = S * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * z)
    pay = np.exp(-r * T) * np.maximum(ST - K, 0.0)
    pairs = 0.5 * (pay[: n // 2] + pay[n // 2 :])     # SE must use pair averages
    return pay.mean(), pairs.std(ddof=1) / np.sqrt(n // 2)

print(mc_call(100, 100, 1.0, 0.04, 0.20))            # about (9.93, 0.01)
```

> [!HISTORY] From Los Alamos to option desks
> The method was named in the 1940s by Stanislaw Ulam, John von Neumann and Nicholas Metropolis, who used random sampling for neutron-diffusion problems on early computers — “Monte Carlo” after the casino. Phelim Boyle proposed it for option pricing in 1977, only four years after Black and Scholes, precisely for payoffs the formula could not handle.

## @analogy
Monte Carlo is an **opinion poll**. You cannot ask every voter, so you ask a random 1,000 and report a margin of error — about ±3 points. Want ±1 point? You need nine times as many interviews, because the margin shrinks with the square root of the sample. A clever pollster doesn't just call more people: they **weight by known facts** — if the sample has too many retirees compared with the census, they adjust. That is a control variate: a quantity whose true value you know, used to correct the one you don't. Oversampling a small group you care about, then down-weighting it, is importance sampling.

Where the analogy breaks: a pollster samples a real population, and every interview costs money. We sample an **invented world** — the risk-neutral one, with drift \(r\) rather than the stock's true expected return — and our “voters” cost only compute. And a poll can be biased by who picks up the phone; our bias comes from coarse time steps and missed barrier crossings, which, like a biased sample, no amount of extra interviews will cure.

## @misconceptions
- **“Run enough paths and Monte Carlo gives the exact price.”** — It converges to the price *under the model you simulated*. Model error (the wrong volatility, no smile, no jumps) and time-step or monitoring bias both survive any number of paths.
- **“Simulate with the stock's expected return — that's what will really happen.”** — Pricing uses the risk-neutral drift \(r - q\). A real-world drift gives a number that is not a no-arbitrage price, however realistic the paths look.
- **“The standard error is the error.”** — It is one standard deviation of the estimate. The true value lies within \(\pm 1.96\,\text{SE}\) about 95% of the time, so roughly one run in twenty lands further away with nothing wrong.
- **“Antithetic variates always help.”** — They help when the payoff moves in one direction with \(Z\). For payoffs symmetric in \(Z\) the pair is positively correlated and the variance can go up.
- **“Monte Carlo is the slow, crude method, so it's for beginners.”** — In one dimension it is slower than a tree or a grid. For baskets, path dependence and portfolio-wide risk it is often the only method that scales, and the variance-reduction tricks make it very fast.

## @takeaways
- A Monte Carlo price is the discounted average of simulated risk-neutral payoffs, reported with its standard error \(s/\sqrt{N}\).
- Precision is expensive: ten times more accuracy needs a hundred times more paths — Kai's call needs about 2 million paths for a one-cent standard error.
- Bias from coarse time steps or discrete barrier monitoring does not shrink with more paths; balance steps against paths.
- Variance reduction lowers \(s\): antithetics are free, control variates can be enormous (the geometric Asian cuts the variance about 1,260-fold), and importance sampling rescues rare-event payoffs.
- Greeks come from common-random-number bumps, pathwise derivatives, or likelihood ratios (the last works for digitals); Monte Carlo wins in high dimensions, trees and grids in low ones.

## @quiz
1. A Monte Carlo price for a call has a standard error of 0.14 with 10,000 paths. Roughly how many paths give a standard error of 0.014?
   - [ ] 20,000
   - [ ] 100,000
   - [x] 1,000,000
   - [ ] 100,000,000
   > The standard error is \(s/\sqrt{N}\). Dividing it by 10 needs \(10^2 = 100\) times as many paths. 100,000 paths only gives \(0.14/\sqrt{10} \approx 0.044\).
2. With 10,000 paths you get \(9.80\) with a standard error of 0.15; Black-Scholes says 9.93. What is the most reasonable reading?
   - [x] The result is consistent with the formula — the gap is less than one standard error
   - [ ] The simulation has a bug, because it differs from the formula
   - [ ] The formula is wrong for this option
   - [ ] The simulation needs smaller time steps
   > The gap is \(0.13\), below one SE, well inside the 95% interval \(9.80 \pm 0.29\). For a European payoff simulated in one exact step there is no time-step bias to fix.
3. A control variate \(X\) has correlation \(\rho = 0.9\) with the payoff you want. By what factor does the control-variate estimator cut the variance, for the same paths?
   - [ ] 1.1
   - [ ] 1.9
   - [ ] 10
   - [x] about 5
   > The variance is multiplied by \(1 - \rho^2 = 1 - 0.81 = 0.19\), i.e. divided by about 5.3. It takes very high correlations to get dramatic gains: \(\rho = 0.9996\) gave about 1,260 for the Asian option.
4. You price a daily-monitored down-and-out call by simulating 12 monthly steps. You then raise the number of paths from 10,000 to 1,000,000. What happens to the gap between your estimate and the correct price?
   - [ ] It shrinks tenfold, like the standard error
   - [x] It barely changes, because it comes from missing barrier crossings between the monthly steps
   - [ ] It disappears, because the law of large numbers removes all errors
   - [ ] It grows, because more paths touch the barrier
   > More paths shrink the random noise, not the bias. With only monthly checks, many paths that cross $90 between fixings survive, so the estimate is systematically too high; only finer monitoring (or a correction) fixes that.
5. Why does the pathwise estimator fail for the delta of a digital option that pays $1 if \(S_T > K\)?
   - [ ] Because digital options have no delta
   - [ ] Because the digital's payoff is too large
   - [x] Because the payoff is a step: its derivative along each path is zero almost everywhere, so the estimator returns 0
   - [ ] Because digitals can only be priced with trees
   > The pathwise method differentiates the payoff, and a step function is flat except at the jump. The likelihood-ratio method differentiates the probability density instead, so it still works (the demo shows about 0.019 per $1 of spot).

## @further
- [Monte Carlo methods for option pricing (Wikipedia)](https://en.wikipedia.org/wiki/Monte_Carlo_methods_for_option_pricing) — overview of the method, its history and its main variants.
- [Control variates (Wikipedia)](https://en.wikipedia.org/wiki/Control_variates) — the derivation of the optimal \(\beta\) and the \(1-\rho^2\) variance factor.
- [Antithetic variates (Wikipedia)](https://en.wikipedia.org/wiki/Antithetic_variates) — why mirrored draws help, and when they don't.
- [Quasi-Monte Carlo methods in finance (Wikipedia)](https://en.wikipedia.org/wiki/Quasi-Monte_Carlo_methods_in_finance) — low-discrepancy sequences and why they work well on many pricing problems.
- [Least-squares Monte Carlo (Wikipedia section)](https://en.wikipedia.org/wiki/Monte_Carlo_methods_for_option_pricing#Least_Square_Monte_Carlo) — a short summary of the Longstaff–Schwartz (2001) regression method that brings early exercise into simulation.

## @next
Simulation runs *forward* from today. The Black-Scholes equation offers the opposite route: start from the known payoff at expiry and solve *backward* on a grid of prices and times. How do you step a PDE backwards — and why does the simplest way of doing it explode?
