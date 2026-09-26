---
id: stochastic-vol
prereqs: bs-assumptions, smile-skew, term-structure, higher-order-greeks, monte-carlo, exotic-options
demo: stochastic-vol
---

# Stochastic & Local Vol: Heston, Dupire, SABR & Rough Vol

## @hook
Black-Scholes uses one σ for every strike and every expiry. The market uses a different σ for almost every option. Four families of models try to explain that whole moving surface: local volatility, stochastic volatility, jumps and rough volatility. Each one fits something the others miss — and choosing between them decides what an exotic is worth and how it should be hedged.

## @bridge
[[smile-skew]] and [[term-structure]] showed that implied volatility changes with strike and with expiry; [[bs-assumptions]] traced this back to the assumption that volatility is a constant. In [[exotic-options]] the gap started to cost money: a digital's price depends on the smile's slope, a barrier's hedge on how the smile moves when spot moves. This lesson asks which models can produce a realistic smile *and* move it realistically. It builds Idea ③ — volatility is itself a random, measurable quantity — with a dose of Idea ② in Dupire's formula, which reads a model straight out of no-arbitrage prices.

## @intuition
Here is a 3-month smile on XYZ of the shape equity markets show (illustrative numbers, produced by a Heston model that we'll meet below):

| Strike | 80 | 90 | 100 | 110 | 120 |
|---|---|---|---|---|---|
| Implied vol | 26.5% | 23.1% | 19.3% | 15.8% | 14.7% |

A single-σ model would draw a flat line. The 90 put here costs $0.91; at a flat 20% it would cost $0.58. Something in the real world makes downside protection dear and upside calls cheap.

> [!KAI] Kai asks the obvious question
> Kai looks at this chain and asks: “If σ is *the* volatility of XYZ, how can it be 23% and 16% at the same time?” It can't. Implied vol is not the volatility of anything; it is the number you have to put into Black-Scholes to reproduce one price. The smile is the market telling us the model is wrong in a specific way — and a better model should produce the smile by itself.

There are two natural stories that produce a downward-sloping smile:

1. **Volatility depends on where the price is.** When XYZ falls, it becomes jumpier; when it rises, it calms down. Then paths that end low were more volatile on the way, and low-strike options are dearer. This is **local volatility**: σ is a fixed function of price and time, \(\sigma(S, t)\).
2. **Volatility is its own random process, and it tends to rise when the price falls.** Some days are calm, some are stormy, and storms tend to come with sell-offs. This is **stochastic volatility**: σ has its own randomness, correlated with the stock.

Both stories can be tuned to match today's smile. They disagree about **tomorrow's** smile — and that is exactly what an exotic's price and hedge depend on. Two more ingredients complete the picture: prices can **jump** (earnings, crashes), and volatility is **rough**: it zig-zags on short time scales far more violently than the smooth models assume.

> [!THINK] Suppose you calibrate both a local-vol model and a stochastic-vol model so that each reproduces every vanilla price on today's screen exactly. Do they give the same price for a 1-year down-and-out call?
> Think about what a barrier option depends on that a vanilla does not.
> ---
> No. Vanillas only pin down the distribution of \(S_T\) at each expiry. A barrier depends on the joint behaviour of the path: how volatile the price is *when* it approaches the barrier, and how the smile moves as it gets there. Two models with identical vanilla prices can differ by a large amount on barriers, forward-starting options and cliquets. That gap is called **model risk**, and it is why desks care about dynamics, not just fit.

We'll take it in six parts:

- **① Local volatility (Dupire)**: a perfect fit to today, with the wrong dynamics
- **② Heston**: volatility as a mean-reverting random process
- **③ SABR**: the market's smile interpolator for rates and FX
- **④ Jumps**: steep short-dated wings
- **⑤ Rough volatility**: the power law of the short-dated skew
- **⑥ Choosing a model in 2026**

## @mechanics
### ① Local volatility: Dupire's formula

In 1994 Bruno Dupire (and, in tree form, Derman and Kani) showed that if you know the price of a call for **every** strike and **every** expiry, there is exactly one function \(\sigma_{\text{loc}}(S, t)\) such that the model \(\dd S = rS\,\dd t + \sigma_{\text{loc}}(S, t)\,S\,\dd W\) reproduces all of them. With zero rates and dividends:

$$
\sigma_{\text{loc}}^{2}(K, T) = \frac{\partial C/\partial T}{\tfrac12 K^{2}\,\partial^{2} C/\partial K^{2}}
$$

where \(\partial C/\partial T\) is how fast the call price grows with expiry (a calendar spread), \(\partial^2 C/\partial K^2\) is the curvature in strike (a butterfly, i.e. the risk-neutral density, [[risk-neutral-density]]), and the local volatility is read at spot level \(K\) and time \(T\). This is Idea ②: the formula uses only no-arbitrage prices, no views.

> [!EXAMPLE] Reading one local vol off the surface
> Take the Heston surface above, recomputed with \(r = q = 0\), at \(K = 90\) and \(T = 0.25\). Finite differences give \(\partial C/\partial T = 4.976\) per year and \(\partial^2 C/\partial K^2 = 0.01828\) per dollar squared. Then
> $$
> \sigma_{\text{loc}}^{2} = \frac{4.976}{\tfrac12 \times 90^{2} \times 0.01828} = \frac{4.976}{74.03} = 0.0672, \qquad \sigma_{\text{loc}} = 25.9\%
> $$
> The implied vol at the same strike is 22.7%. Local vol is steeper than implied vol.

<figure>
<svg viewBox="0 0 660 240" role="img" aria-label="Local volatility versus implied volatility across strikes">
<line x1="50" y1="190" x2="620" y2="190" class="fx-axis"/>
<line x1="50" y1="200" x2="50" y2="15" class="fx-axis"/>
<line x1="50" y1="147" x2="610" y2="147" class="fx-grid"/>
<line x1="50" y1="105" x2="610" y2="105" class="fx-grid"/>
<line x1="50" y1="62" x2="610" y2="62" class="fx-grid"/>
<text x="44" y="151" text-anchor="end" class="fx-t-sm">15%</text>
<text x="44" y="109" text-anchor="end" class="fx-t-sm">20%</text>
<text x="44" y="66" text-anchor="end" class="fx-t-sm">25%</text>
<polyline points="60,25 105,39 150,55 195,70 240,86 285,103 330,120 375,136 420,151 465,161 510,167 555,168 600,166" class="fx-line-bad"/>
<polyline points="60,66 105,74 150,82 195,90 240,98 285,106 330,114 375,122 420,130 465,137 510,143 555,146 600,148" class="fx-line-hl"/>
<circle cx="150" cy="55" r="5" class="fx-fill-red"/>
<circle cx="150" cy="82" r="5" class="fx-fill-orange"/>
<text x="160" y="50" class="fx-t-bad">local 25.9%</text>
<text x="158" y="114" class="fx-t-hl">implied 22.7%</text>
<text x="450" y="185" class="fx-t-bad">local vol (Dupire)</text>
<text x="450" y="126" class="fx-t-hl">implied vol</text>
<text x="60" y="210" text-anchor="middle" class="fx-t-sm">85</text>
<text x="150" y="210" text-anchor="middle" class="fx-t-sm">90</text>
<text x="330" y="210" text-anchor="middle" class="fx-t-sm">100</text>
<text x="510" y="210" text-anchor="middle" class="fx-t-sm">110</text>
<text x="600" y="210" text-anchor="middle" class="fx-t-sm">115</text>
<text x="600" y="232" text-anchor="end" class="fx-t-sm">strike K (3 months, r = q = 0)</text>
</svg>
<figcaption>Figure 1 · Local volatility read with Dupire's formula from a 3-month Heston surface. Between 90 and 110 the local-vol curve falls about 0.66 points per $1 of strike, the implied curve about 0.36 — roughly twice as steep. An implied vol is, to a first approximation, an *average* of local vols along the paths from spot to the strike.</figcaption>
</figure>

Local vol has a huge practical advantage: it fits every vanilla price by construction, so an exotic priced with it is at least consistent with the options you would hedge with. Its weakness is **dynamics**. Hagan, Kumar, Lesniewski and Woodward (2002) pointed out that local vol predicts the smile shifts in the *opposite* direction to spot: when the price falls, the model moves the smile the wrong way relative to what markets do. The hedges it produces (its deltas) are therefore biased, and its forward smiles — the smiles it predicts for the future — come out too flat, which misprices products that depend on future smiles, such as cliquets and forward-starting options.

### ② Heston: volatility as a mean-reverting random process

Heston (1993) lets the variance \(v = \sigma^2\) follow its own random process:

$$
\begin{aligned}
\dd S_t &= r S_t\,\dd t + \sqrt{v_t}\,S_t\,\dd W^{S}_t \\
\dd v_t &= \kappa(\theta - v_t)\,\dd t + \xi\sqrt{v_t}\,\dd W^{v}_t, \qquad \dd W^{S}_t\,\dd W^{v}_t = \rho\,\dd t
\end{aligned}
$$

Five parameters, each with a visible job:

| Parameter | Meaning | What it does to the smile | Base value |
|---|---|---|---|
| \(v_0\) | today's variance | level of short-dated vol | 0.04 (20% vol) |
| \(\theta\) | long-run variance | level of long-dated vol | 0.04 |
| \(\kappa\) | speed of mean reversion | how fast the term structure moves from \(v_0\) to \(\theta\) | 2 (half-life about 4 months) |
| \(\xi\) | vol of vol | curvature: how high both wings lift | 0.5 |
| \(\rho\) | correlation of price and variance | skew: which wing lifts more | −0.7 |

With the base values, 3-month implied vols run from 26.5% at the 80 strike to 14.7% at 120 — the smile in the intuition. Now vary one parameter at a time:

<figure>
<svg viewBox="0 0 680 235" role="img" aria-label="Heston smiles as rho, vol of vol and maturity change">
<text x="130" y="20" text-anchor="middle" class="fx-t-b">ρ: skew</text>
<text x="345" y="20" text-anchor="middle" class="fx-t-b">ξ: curvature (ρ = 0)</text>
<text x="560" y="20" text-anchor="middle" class="fx-t-b">maturity</text>
<line x1="40" y1="200" x2="220" y2="200" class="fx-axis"/>
<line x1="255" y1="200" x2="435" y2="200" class="fx-axis"/>
<line x1="470" y1="200" x2="650" y2="200" class="fx-axis"/>
<line x1="40" y1="129" x2="220" y2="129" class="fx-grid"/>
<line x1="255" y1="129" x2="435" y2="129" class="fx-grid"/>
<line x1="470" y1="129" x2="650" y2="129" class="fx-grid"/>
<text x="36" y="133" text-anchor="end" class="fx-t-sm">20%</text>
<polyline points="45,71 66,86 88,102 109,118 130,135 151,152 173,166 194,173 215,176" class="fx-line-hl"/>
<polyline points="45,107 66,117 88,126 109,133 130,137 151,135 173,130 194,124 215,117" class="fx-line-muted"/>
<polyline points="45,147 66,151 88,153 109,148 130,138 151,126 173,113 194,102 215,92" class="fx-line-blue"/>
<polyline points="260,127 281,128 303,129 324,129 345,129 366,129 388,129 409,129 430,128" class="fx-line-muted"/>
<polyline points="260,107 281,117 303,126 324,133 345,137 366,135 388,130 409,124 430,117" class="fx-line-hl"/>
<polyline points="260,86 281,105 303,123 324,140 345,150 366,145 388,132 409,118 430,105" class="fx-line-bad"/>
<polyline points="475,63 496,79 518,95 539,113 560,131 581,150 603,164 624,170 645,171" class="fx-line-bad"/>
<polyline points="475,71 496,86 518,102 539,118 560,135 581,152 603,166 624,173 645,176" class="fx-line-hl"/>
<polyline points="475,95 496,106 518,117 539,127 560,138 581,148 603,157 624,166 645,172" class="fx-line-blue"/>
<text x="48" y="40" class="fx-t-hl">−0.7</text>
<text x="100" y="40" class="fx-t-sm">0</text>
<text x="140" y="40" class="fx-t-blue">+0.5</text>
<text x="263" y="40" class="fx-t-sm">0.1</text>
<text x="310" y="40" class="fx-t-hl">0.5</text>
<text x="360" y="40" class="fx-t-bad">0.9</text>
<text x="478" y="40" class="fx-t-bad">1 month</text>
<text x="545" y="40" class="fx-t-hl">3 months</text>
<text x="615" y="40" class="fx-t-blue">1 year</text>
<text x="45" y="216" text-anchor="middle" class="fx-t-sm">80</text>
<text x="130" y="216" text-anchor="middle" class="fx-t-sm">100</text>
<text x="215" y="216" text-anchor="middle" class="fx-t-sm">120</text>
<text x="260" y="216" text-anchor="middle" class="fx-t-sm">80</text>
<text x="345" y="216" text-anchor="middle" class="fx-t-sm">100</text>
<text x="430" y="216" text-anchor="middle" class="fx-t-sm">120</text>
<text x="475" y="216" text-anchor="middle" class="fx-t-sm">80</text>
<text x="560" y="216" text-anchor="middle" class="fx-t-sm">100</text>
<text x="645" y="216" text-anchor="middle" class="fx-t-sm">120</text>
<text x="340" y="232" text-anchor="middle" class="fx-t-sm">strike (3 months unless noted; vertical scale 12%–30%, grid line at 20%)</text>
</svg>
<figcaption>Figure 2 · Heston implied-vol smiles for XYZ, computed with the engine's Heston pricer and inverted to implied vol. Left: \(\rho\) tilts the smile — negative for equities, positive for some commodities. Middle: \(\xi\) bends it — at \(\xi = 0.1\) it is almost flat, at 0.9 the wings lift sharply. Right: the skew flattens as maturity grows, because the random variance has time to average out.</figcaption>
</figure>

Why does negative \(\rho\) create the equity skew? When the price falls, variance tends to rise, so the paths that end low were high-volatility paths: the left tail of \(S_T\) gets fatter, the right tail thinner. Why does \(\xi\) create curvature? Random variance mixes calm and stormy worlds; a mixture of normals has fatter tails than any single normal, which lifts both wings.

Heston's great practical virtue is a semi-closed form: the characteristic function of \(\ln S_T\) is known exactly, so a price needs only a one-dimensional numerical integral (the engine does it in a few milliseconds). That makes calibration — searching for the five parameters that best match the market — feasible. Try it in the main demo below the lesson.

**The Feller condition.** If \(2\kappa\theta > \xi^2\), the variance process can never touch zero. With the base values \(2 \times 2 \times 0.04 = 0.16 < 0.25 = 0.5^2\), so the condition fails: variance can hit zero and bounce back. That is not an arbitrage, and calibrations to equity smiles often violate Feller, because only a large \(\xi\) produces enough curvature. It matters for simulation, though: naive Euler schemes for \(v_t\) produce negative variances, so Monte Carlo codes use truncation or specialised schemes ([[monte-carlo]]).

Heston's weakness shows at short maturities. Its smile comes from variance *diffusing* — and over a week the variance cannot diffuse far. So Heston's short-dated skew is too flat: in our base case the at-the-money skew is about the same at 7 days as at 30 days (section ⑤ puts numbers on this).

### ③ SABR: the market's smile interpolator

Hagan, Kumar, Lesniewski and Woodward (2002) built SABR (“stochastic alpha, beta, rho”) for interest-rate and FX desks. It models a forward \(F\) and its volatility \(\alpha\):

$$
\dd F_t = \alpha_t F_t^{\beta}\,\dd W_t, \qquad \dd \alpha_t = \nu\,\alpha_t\,\dd Z_t, \qquad \dd W_t\,\dd Z_t = \rho\,\dd t
$$

where \(\beta \in [0,1]\) sets the “backbone” (\(\beta = 1\) lognormal, \(\beta = 0\) normal), \(\nu\) is the vol of vol and \(\rho\) the correlation. Its selling point is Hagan's approximate formula, which gives the implied vol directly. At the money it reads

$$
\sigma_{\text{ATM}} \approx \frac{\alpha}{F^{1-\beta}}\left[1 + \left(\frac{(1-\beta)^2\alpha^2}{24F^{2-2\beta}} + \frac{\rho\beta\nu\alpha}{4F^{1-\beta}} + \frac{2 - 3\rho^2}{24}\nu^2\right)T\right]
$$

> [!EXAMPLE] A SABR smile for an XYZ forward
> Take \(F = 100\), \(T = 1\), \(\beta = 0.5\), \(\alpha = 2\), \(\rho = -0.3\), \(\nu = 0.4\). Then \(\alpha/F^{1-\beta} = 2/\sqrt{100} = 0.20\), and the bracket is \(1 + 0.00895\), so \(\sigma_{\text{ATM}} \approx 20.18\%\). The full formula gives 23.1% at the 80 strike and 18.6% at 120. If the forward drops to 95 with \(\alpha\) unchanged, at-the-money vol rises to 20.7%: with \(\beta = 0.5\), vol rises as the price falls along the backbone. With \(\beta = 1\) it would stay at 20.1%.

::demo[stochastic-vol-sabr]

Because the formula is instant, SABR became a standard way to **quote and interpolate** smiles in rates and FX: calibrate \(\alpha, \rho, \nu\) per expiry (with \(\beta\) fixed by convention) and read vols for any strike. Its known weakness is the approximation itself: for low strikes and long maturities the formula can imply a negative density — a butterfly arbitrage — which is one reason the next lesson checks every fitted smile for arbitrage ([[surface-calibration]]).

### ④ Jumps: steep short-dated wings

Diffusions move continuously; real prices gap on earnings, news and crashes. Merton (1976) added jumps: at random times (on average \(\lambda\) per year) the log price jumps by a normal amount with mean \(\mu_J\) and standard deviation \(\delta\). Conditional on the number of jumps \(n\), the price is lognormal again, so the option price is a probability-weighted sum of Black-Scholes prices:

$$
C = \sum_{n=0}^{\infty} \frac{e^{-\lambda' T}(\lambda' T)^{n}}{n!}\; C_{\text{BS}}\!\left(\sigma_n,\, r_n\right), \qquad \sigma_n^{2} = \sigma^{2} + \frac{n\,\delta^{2}}{T}
$$

where \(\lambda' = \lambda(1 + \bar m)\), \(\bar m = e^{\mu_J + \delta^2/2} - 1\) is the average jump size, and \(r_n = r - \lambda\bar m + n\ln(1+\bar m)/T\) adjusts the drift so the stock still earns \(r\) on average.

> [!EXAMPLE] One crash-type jump every two years
> Diffusion \(\sigma = 15\%\), \(\lambda = 0.5\) jumps a year, mean jump −10%, jump standard deviation 10%. The 30-day XYZ 90 put is worth $0.139. At the model's own at-the-money implied vol (16.5%) Black-Scholes would say $0.017 — the jump risk makes the put about eight times dearer. In implied-vol terms the 30-day 90 put trades at 23.3% against 16.5% at the money; at 7 days the 85 put is at 47.5% against 15.8% at the money, while at 1 year the 80 strike is only 1.5 points above the at-the-money vol (19.2% against 17.7%).

::demo[stochastic-vol-jumps]

That pattern — **huge short-dated wings that fade fast with maturity** — is the jump signature. It is what diffusions like Heston cannot produce, and it is why earnings weeks and crash protection are priced with jumps in mind ([[earnings-events]], [[tail-hedging]]). Bates (1996) combined the two: Heston plus Merton jumps, a common choice for equity indexes.

> [!HISTORY] The skew was born in 1987
> Before October 1987, index option smiles were close to flat. On October 19, 1987 the Dow fell 22.6% and the S&P 500 20.5% in one day — an event a 20%-vol lognormal model treats as essentially impossible. Since then index puts have carried a persistent skew: the market prices crash risk that Black-Scholes does not contain. Dupire's paper and Heston's model both appeared within a few years, as the industry looked for models that could live with a smile.

### ⑤ Rough volatility: the power law of the short-dated skew

Gatheral, Jaisson and Rosenbaum (2018), *Volatility is rough*, measured the path of volatility itself from high-frequency data and found that log-volatility behaves like a **fractional Brownian motion** with Hurst exponent \(H \approx 0.1\). Ordinary Brownian motion has \(H = 0.5\); \(H < 0.5\) means a path far rougher than Brownian — it reverses direction constantly on short time scales.

Why a trader cares: roughness shows up in the **term structure of the at-the-money skew** \(\psi(T)\), the slope of the smile at the money. Rough models give

$$
\psi(T) \;\propto\; T^{\,H - \frac12} \;=\; T^{-0.4} \quad \text{for } H = 0.1
$$

so the skew keeps steepening as maturity shrinks: cut the maturity by a factor of 10 and the skew grows by \(10^{0.4} \approx 2.5\). Equity-index ATM skews are often described as following a power law of roughly this kind. Heston's skew instead levels off at short maturities, and jump models concentrate their effect in the far wings.

<figure>
<svg viewBox="0 0 660 250" role="img" aria-label="At-the-money skew versus maturity for Heston, Merton jumps and a rough-vol power law">
<line x1="60" y1="200" x2="620" y2="200" class="fx-axis"/>
<line x1="60" y1="210" x2="60" y2="20" class="fx-axis"/>
<line x1="60" y1="143" x2="610" y2="143" class="fx-grid"/>
<line x1="60" y1="87" x2="610" y2="87" class="fx-grid"/>
<line x1="60" y1="30" x2="610" y2="30" class="fx-grid"/>
<text x="54" y="204" text-anchor="end" class="fx-t-sm">0</text>
<text x="54" y="147" text-anchor="end" class="fx-t-sm">4</text>
<text x="54" y="91" text-anchor="end" class="fx-t-sm">8</text>
<text x="54" y="34" text-anchor="end" class="fx-t-sm">12</text>
<polyline points="80,45 96,54 111,62 127,69 143,76 158,83 174,89 189,95 205,101 221,107 236,112 252,116 268,121 283,125 299,129 315,133 330,137 346,140 362,143 377,147 393,149 408,152 424,155 440,157 455,160 471,162 487,164 502,166 518,168 534,169 549,171 565,173 580,174 596,176 600,176" class="fx-line-bad fx-dash"/>
<polyline points="80,138 158,139 243,139 320,142 367,145 445,154 522,167 600,179" class="fx-line-hl"/>
<polyline points="80,156 158,165 243,172 320,179 367,182 445,189 522,193 600,196" class="fx-line-blue"/>
<circle cx="367" cy="145" r="4" class="fx-fill-orange"/>
<text x="80" y="218" text-anchor="middle" class="fx-t-sm">7d</text>
<text x="158" y="218" text-anchor="middle" class="fx-t-sm">14d</text>
<text x="243" y="218" text-anchor="middle" class="fx-t-sm">30d</text>
<text x="320" y="218" text-anchor="middle" class="fx-t-sm">60d</text>
<text x="367" y="218" text-anchor="middle" class="fx-t-sm">91d</text>
<text x="445" y="218" text-anchor="middle" class="fx-t-sm">182d</text>
<text x="522" y="218" text-anchor="middle" class="fx-t-sm">1y</text>
<text x="600" y="218" text-anchor="middle" class="fx-t-sm">2y</text>
<text x="100" y="40" class="fx-t-bad">rough-vol power law, H = 0.1 (anchored at 91 days)</text>
<text x="100" y="117" class="fx-t-hl">Heston: levels off</text>
<text x="100" y="132" class="fx-t-hl">at short maturities</text>
<text x="400" y="178" class="fx-t-blue">Merton jumps</text>
<text x="620" y="240" text-anchor="end" class="fx-t-sm">maturity (log scale) · vertical: minus the ATM skew, vol points per 10% of log-moneyness</text>
</svg>
<figcaption>Figure 3 · How steep is the smile at the money, by maturity? Heston (base parameters) is almost flat from 7 to 60 days (about 4.3 points); a rough-vol power law with \(H = 0.1\), matched to Heston at 91 days, grows to about 10.9 points at 7 days. The Merton curve (section ④ parameters) is shown for shape only. All three are model outputs with illustrative parameters, not market data.</figcaption>
</figure>

The catch is computation. A fractional Brownian motion has memory, so there is no Markov state and no Heston-style closed form; prices under models such as rough Bergomi (Bayer, Friz and Gatheral, 2016) need heavy simulation. That is exactly where neural networks trained as fast surrogates come in ([[neural-pricing]]).

### ⑥ Choosing a model in 2026

| Model | Fits today's smile | Smile dynamics | Speed | Typical use |
|---|---|---|---|---|
| Black-Scholes | one strike at a time | none | instant | quoting language, Greeks |
| Local vol (Dupire) | exactly, by construction | poor (wrong direction, flat forward smiles) | fast (PDE / MC) | consistent pricing of simple path-dependents |
| Heston | well, except very short dates | realistic but too smooth | fast (Fourier) | exotics, risk scenarios, a benchmark |
| SABR | per expiry, very well | backbone via \(\beta\) | instant (formula) | quoting and interpolating rates and FX smiles |
| Jumps (Merton, Bates) | short-dated wings | jump risk | fast | crash protection, event risk |
| Rough vol | short-dated skew across maturities | realistic | slow (simulation) | research frontier, neural calibration |

Two practical lessons follow. First, desks often **combine**: a local-stochastic volatility model uses a stochastic-vol engine for realistic dynamics plus a local-vol correction that makes it fit every vanilla exactly. Second, fitting is not the same as being right.

> [!WARN] A perfect fit is not evidence
> A model with enough parameters can pass through every quote on today's screen and still misprice what you care about. Test a model on what it will be used for: does its delta hedge a barrier well over the next month? Does it predict how the smile moved in past sell-offs? And re-calibrating every morning hides the problem, because yesterday's “constant” parameters keep changing.

Before any of these models can be calibrated, someone has to turn a messy chain of quotes into a clean, arbitrage-free surface. That is the next lesson.

## @analogy
Think of a **weather forecast** for a whole region.

Black-Scholes is a forecaster who announces one temperature for every town and every day of the month. Everyone can see it is wrong: the valley is colder than the hill, and next week will not look like today.

**Local volatility** is a perfect map of today's temperatures, town by town and hour by hour: fed today's readings, it reproduces all of them exactly. Ask it what tomorrow will look like and it simply slides today's map along, which is often wrong.

**Stochastic volatility** is a weather model with its own moving parts: storms form, drift and fade back to the seasonal average (mean reversion), and storms tend to come with falling pressure (the negative correlation). It will not match every town exactly today, but its weather *moves* like weather. **Jumps** are the hailstorm nobody saw coming: rare, sudden, and they dominate the next few hours. **Rough volatility** is the observation that real weather is gustier on short time scales than the smooth models allow.

Where the analogy breaks: weather forecasts aim at real-world probabilities. Pricing models are calibrated to prices — the risk-neutral world — so a “good” model is one whose prices and hedges hold up, not one that predicts the future best.

## @misconceptions
- **“Implied volatility is the stock's volatility.”** — It is the number that makes Black-Scholes match one option's price. The smile shows that no single volatility does that for all options at once.
- **“Local vol and stochastic vol are the same thing, since both fit the smile.”** — Local vol is a fixed function \(\sigma(S,t)\); stochastic vol has its own randomness. Calibrated to the same vanillas they still disagree on barriers, forward-starting options and hedge ratios.
- **“Heston fits everything.”** — It struggles with very short maturities: its skew levels off where market skews keep steepening. Jumps or rough volatility are needed there.
- **“SABR is an arbitrage-free model of the whole surface.”** — Hagan's formula is an approximation per expiry; far out in the low-strike wing it can imply negative densities, so fitted SABR smiles still need arbitrage checks.
- **“Rough volatility is just a fancier Heston.”** — Its volatility path has \(H \approx 0.1\) and long memory; that changes the maturity scaling of the skew (\(T^{-0.4}\)) and removes the closed forms, which is why rough models are simulated or approximated by neural networks.

## @takeaways
- The smile says volatility is not a constant; a model should produce the smile by itself and move it realistically.
- Dupire's local vol \(\sigma_{\text{loc}}^2 = \partial_T C / (\tfrac12 K^2 \partial_{KK} C)\) fits every vanilla exactly but predicts poor smile dynamics.
- Heston's five parameters map to level (\(v_0, \theta\)), term structure (\(\kappa\)), curvature (\(\xi\)) and skew (\(\rho\)); its short-dated skew is too flat.
- SABR is the fast quoting tool for rates and FX; jumps explain steep short-dated wings; rough volatility (\(H \approx 0.1\)) explains the power-law steepening of short-dated skew.
- Model choice matters most for exotics and hedging: models that agree on vanillas can disagree on everything else.

## @quiz
1. A local-vol model and a Heston model are both calibrated so that they reproduce today's vanilla prices exactly. What can you conclude about their price for a 1-year barrier option?
   - [ ] They must agree, because both match the vanillas
   - [ ] Heston must be higher, because it has more parameters
   - [x] They can differ materially, because barriers depend on path dynamics the vanillas do not pin down
   - [ ] Local vol must be zero, because it has no randomness
   > Vanillas pin down only the distribution of \(S_T\) at each expiry. Barriers depend on how volatile the path is near the barrier and how the smile moves, which the two models describe differently. That difference is model risk.
2. In the Heston model, which parameter mainly controls the *skew* (the tilt of the smile)?
   - [ ] \(\kappa\), the speed of mean reversion
   - [x] \(\rho\), the correlation between the price and its variance
   - [ ] \(\theta\), the long-run variance
   - [ ] \(v_0\), today's variance
   > Negative \(\rho\) means variance rises when the price falls, fattening the left tail and lifting low-strike implied vols. \(\xi\) controls curvature; \(v_0\) and \(\theta\) the level; \(\kappa\) the term structure.
3. Using Dupire's formula with \(r = q = 0\), \(\partial C/\partial T = 4.976\) per year and \(\partial^2 C/\partial K^2 = 0.01828\) at \(K = 90\). What is the local volatility?
   - [ ] About 6.7%
   - [ ] About 22.7%
   - [ ] About 45%
   - [x] About 25.9%
   > \(\sigma_{\text{loc}}^2 = 4.976 / (0.5 \times 8{,}100 \times 0.01828) = 0.0672\), so \(\sigma_{\text{loc}} = 25.9\%\). 6.7% is the variance mistaken for the volatility; 22.7% is the implied vol at that strike.
4. Why do very short-dated equity options (a few days) often show steep wings that a pure Heston model cannot reproduce?
   - [x] Over a few days variance cannot diffuse far, so diffusive stochastic vol gives little skew; jumps and rough volatility can
   - [ ] Because short-dated options are not priced with risk-neutral probabilities
   - [ ] Because interest rates dominate short-dated prices
   - [ ] Because Heston assumes the stock cannot fall
   > Heston's smile comes from the variance wandering, which takes time. A jump can move the price 10% in an instant, and a rough volatility path moves violently on short scales; both create steep short-dated skew.
5. The rough-volatility finding (Gatheral, Jaisson & Rosenbaum, 2018) implies the at-the-money skew scales roughly like \(T^{-0.4}\). If the 91-day skew is 3.9 vol points per 10% of log-moneyness, about what does this scaling predict at 7 days?
   - [ ] About 3.9 points, since skew does not depend on maturity
   - [ ] About 1.4 points
   - [x] About 10.9 points
   - [ ] About 50 points
   > \(3.9 \times (7/91)^{-0.4} = 3.9 \times 2.79 \approx 10.9\). Heston with the same 91-day skew gives only about 4.3 points at 7 days.

## @further
- [Gatheral, Jaisson & Rosenbaum (2018), Volatility is rough (arXiv)](https://arxiv.org/abs/1410.3394) — the paper behind \(H \approx 0.1\), readable and full of data.
- [Heston (1993), A Closed-Form Solution for Options with Stochastic Volatility](https://doi.org/10.1093/rfs/6.2.327) — the original model and its characteristic-function pricing.
- [Local volatility (Wikipedia)](https://en.wikipedia.org/wiki/Local_volatility) — Dupire's formula with rates and dividends, and its derivation.
- [SABR volatility model (Wikipedia)](https://en.wikipedia.org/wiki/SABR_volatility_model) — Hagan's formula, the backbone, and the known arbitrage issues.
- [Jump diffusion (Wikipedia)](https://en.wikipedia.org/wiki/Jump_diffusion) — Merton's model and its relatives.

## @next
Every model here is calibrated to an implied-vol surface — but the raw chain is noisy, with stale quotes, wide spreads and missing strikes. How do you turn it into a smooth surface with no butterfly and no calendar arbitrage? The next lesson builds one with SVI.
