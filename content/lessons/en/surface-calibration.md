---
id: surface-calibration
prereqs: arbitrage-bounds, put-call-parity, smile-skew, term-structure, risk-neutral-density, butterfly, stochastic-vol
demo: surface-calibration
---

# Building an Arbitrage-Free Vol Surface: SVI & Calibration

## @hook
An option chain gives you a few dozen noisy prices per expiry. Every pricing model, risk system and exotic desk needs something else: a smooth volatility for *any* strike and *any* date, with no free lunch hidden inside. This lesson builds that surface step by step — clean, extract the forward, fit SVI, check for arbitrage, interpolate — and shows how a fit that looks perfect can still be wrong.

## @bridge
[[smile-skew]] and [[term-structure]] described the implied-vol surface as something you *see*; [[arbitrage-bounds]], [[butterfly]] and [[risk-neutral-density]] gave the rules any set of option prices must obey; [[stochastic-vol]] showed the models that get calibrated to the surface. Now we build the surface itself from raw quotes. It builds Idea ② (no-arbitrage: every constraint in this lesson is a trade you could do if it were broken) and Idea ③ (volatility: the surface is how the market's view of volatility gets stored and reused). Next come the data problems in practice ([[options-data]]) and fast neural calibration ([[neural-pricing]]).

## @intuition
Picture what a desk actually receives for XYZ's 91-day expiry: 17 strikes from 80 to 120, each with a bid and an ask. Convert the mid prices to implied vols and you get a cloud of points roughly along a smile — around 26% at the 80 strike, 19% near the money, 15% at 120 — but jittery, with the far strikes the least reliable because their spreads are widest.

> [!KAI] Kai tries to connect the dots
> Kai's first idea is the obvious one: join the points with a smooth curve through every one of them (a spline). It fits perfectly. But between two strikes the curve wiggles — up a little, down a little — to pass exactly through each noisy mid. Kai then prices a tight butterfly centred on one of those dips and finds its value is *negative*: the curve says someone would pay Kai to take a position that can never lose.

> [!THINK] Why does a dip in the smile between two strikes mean a butterfly with a negative price?
> Recall what a butterfly pays and what its price measures.
> ---
> A butterfly pays something non-negative at every price, so it can never be worth less than zero. Its price, per unit of strike width squared, is the second derivative of the call price in strike — the risk-neutral density ([[risk-neutral-density]]). A dent in the implied-vol curve can make call prices locally *concave* in strike, which means a negative density and a negative butterfly price. **A surface that fits every quote but has a negative density is worse than one that misses some quotes by a few hundredths of a vol point.**

So the job is not “fit the dots”. It is: find a smooth, flexible curve per expiry that stays within the bid–ask noise **and** can never imply negative probabilities; then join the expiries so that longer dates never offer less total variance than shorter ones. The standard tool is Gatheral's **SVI** (“stochastic volatility inspired”) parameterisation, introduced in 2004, with the arbitrage conditions worked out by Gatheral and Jacquier (2014).

<figure>
<svg viewBox="0 0 660 215" role="img" aria-label="The pipeline from raw quotes to a vol surface">
<defs><marker id="surface-calibration-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="15" y="25" width="140" height="58" rx="8" class="fx-box"/>
<rect x="180" y="25" width="140" height="58" rx="8" class="fx-box"/>
<rect x="345" y="25" width="140" height="58" rx="8" class="fx-box"/>
<rect x="510" y="25" width="140" height="58" rx="8" class="fx-box"/>
<rect x="510" y="130" width="140" height="58" rx="8" class="fx-hl"/>
<rect x="345" y="130" width="140" height="58" rx="8" class="fx-box2"/>
<rect x="180" y="130" width="140" height="58" rx="8" class="fx-box"/>
<rect x="15" y="130" width="140" height="58" rx="8" class="fx-ok"/>
<text x="85" y="50" text-anchor="middle" class="fx-t-b">1 · raw chain</text>
<text x="85" y="70" text-anchor="middle" class="fx-t-sm">bids, asks, all strikes</text>
<text x="250" y="50" text-anchor="middle" class="fx-t-b">2 · clean</text>
<text x="250" y="70" text-anchor="middle" class="fx-t-sm">crossed, stale, zero bids</text>
<text x="415" y="50" text-anchor="middle" class="fx-t-b">3 · parity</text>
<text x="415" y="70" text-anchor="middle" class="fx-t-sm">forward F, discount D</text>
<text x="580" y="50" text-anchor="middle" class="fx-t-b">4 · implied vols</text>
<text x="580" y="70" text-anchor="middle" class="fx-t-sm">OTM mids → σ, w, k</text>
<text x="580" y="155" text-anchor="middle" class="fx-t-b">5 · fit SVI</text>
<text x="580" y="175" text-anchor="middle" class="fx-t-sm">per expiry, weighted</text>
<text x="415" y="155" text-anchor="middle" class="fx-t-b">6 · arbitrage checks</text>
<text x="415" y="175" text-anchor="middle" class="fx-t-sm">g(k) ≥ 0, calendar, wings</text>
<text x="250" y="155" text-anchor="middle" class="fx-t-b">7 · interpolate in T</text>
<text x="250" y="175" text-anchor="middle" class="fx-t-sm">linear in total variance</text>
<text x="85" y="155" text-anchor="middle" class="fx-t-b">8 · surface</text>
<text x="85" y="175" text-anchor="middle" class="fx-t-sm">σ(K, T) for any K, T</text>
<line x1="155" y1="54" x2="178" y2="54" class="fx-line" marker-end="url(#surface-calibration-ah)"/>
<line x1="320" y1="54" x2="343" y2="54" class="fx-line" marker-end="url(#surface-calibration-ah)"/>
<line x1="485" y1="54" x2="508" y2="54" class="fx-line" marker-end="url(#surface-calibration-ah)"/>
<line x1="580" y1="83" x2="580" y2="128" class="fx-line" marker-end="url(#surface-calibration-ah)"/>
<line x1="510" y1="159" x2="487" y2="159" class="fx-line" marker-end="url(#surface-calibration-ah)"/>
<line x1="345" y1="159" x2="322" y2="159" class="fx-line" marker-end="url(#surface-calibration-ah)"/>
<line x1="180" y1="159" x2="157" y2="159" class="fx-line" marker-end="url(#surface-calibration-ah)"/>
<text x="330" y="207" text-anchor="middle" class="fx-t-sm">a failed check sends you back to step 5 (refit with constraints) or step 2 (a bad quote)</text>
</svg>
<figcaption>Figure 1 · From quotes to a surface. Steps 1–4 turn prices into clean implied vols; steps 5–7 turn points into curves and curves into a surface. Step 6 is the one beginners skip and professionals never do.</figcaption>
</figure>

We'll take it in six parts:

- **① From quotes to implied vols**: cleaning, and the forward from parity
- **② Raw SVI**: five parameters with visible jobs
- **③ No butterfly arbitrage**: the function \(g(k)\)
- **④ No calendar arbitrage** and interpolation in time
- **⑤ Calibration**: the loss, the optimiser and the traps
- **⑥ The surface in practice (2026)**

## @mechanics
### ① From quotes to implied vols

**Cleaning.** Before any fitting, drop quotes that cannot be trusted: crossed or locked markets (bid ≥ ask), zero bids (the mid is then half the ask, which means nothing), stale quotes that have not updated while the underlying moved, and strikes whose spread is a large fraction of the mid. Use **out-of-the-money** options — puts below the forward, calls above — because they are the liquid side, and their prices contain no intrinsic value to swamp the time value. For American-style stock options, the early-exercise premium must be stripped out first (“de-Americanisation”, see [[options-data]]).

**Forward and discount from parity.** You need the forward \(F\) (not spot) to measure moneyness, and the discount factor \(D = e^{-rT}\) to convert prices. Both are hiding in the chain. Put-call parity ([[put-call-parity]]) says that, strike by strike,

$$
C(K) - P(K) = D\,(F - K)
$$

where \(C(K)\) and \(P(K)\) are the call and put mids at strike \(K\). Across strikes this is a straight line in \(K\): the slope is \(-D\) and the intercept is \(DF\). A regression across the liquid strikes gives both numbers, and averages out much of the quote noise. The same trick absorbs dividends and borrow costs, which is why desks prefer the **implied forward** to one computed from spot.

> [!EXAMPLE] XYZ's 30-day forward from three strikes
> With XYZ at $100, \(r = 4\%\) and 30 days, the parity differences are \(C - P = 5.3118\) at \(K = 95\), \(0.3284\) at 100 and \(-4.6554\) at 105. The slope is \((-4.6554 - 5.3118)/10 = -0.99672\), so \(D = 0.99672\). Then \(F = K + (C - P)/D = 95 + 5.3118/0.99672 = 100.33\), the 30-day forward from the standard numbers.

From here every quote becomes a point \((k, w)\) with **log-moneyness** \(k = \ln(K/F)\) and **total implied variance** \(w = \sigma_{\text{imp}}^2 T\). Total variance is the natural unit: it adds up over time, and every arbitrage condition below is simplest in it.

### ② Raw SVI: five parameters with visible jobs

For one expiry, raw SVI writes total variance as

$$
w(k) = a + b\Big(\rho\,(k - m) + \sqrt{(k - m)^{2} + s^{2}}\Big)
$$

where \(a\) sets the overall level, \(b \ge 0\) opens the two wings, \(\rho \in (-1, 1)\) rotates the curve (the skew), \(m\) shifts it left or right, and \(s > 0\) rounds off the vertex. Far from the money the square root behaves like \(|k - m|\), so the wings are straight lines: slope \(-b(1-\rho)\) in the low-strike wing and \(b(1+\rho)\) in the high-strike wing. That matches Roger Lee's moment formula (2004), which says total variance can grow at most linearly in \(|k|\), with slope at most 2.

<figure>
<svg viewBox="0 0 660 262" role="img" aria-label="Anatomy of a raw SVI slice">
<line x1="50" y1="200" x2="620" y2="200" class="fx-axis"/>
<line x1="50" y1="210" x2="50" y2="20" class="fx-axis"/>
<polyline points="60,69 353,188" class="fx-line-muted fx-dash"/>
<polyline points="353,188 600,154" class="fx-line-muted fx-dash"/>
<polyline points="60,69 74,74 87,79 101,85 114,90 128,96 141,101 155,106 168,112 182,117 195,122 209,128 222,133 236,138 249,143 263,149 276,154 290,158 303,163 317,167 330,171 344,174 357,176 371,177 384,177 398,177 411,176 425,175 438,173 452,172 465,170 479,169 492,167 506,165 519,164 533,162 546,160 560,159 573,157 587,155 600,153" class="fx-line-thick"/>
<circle cx="378" cy="177" r="5" class="fx-fill-orange"/>
<line x1="353" y1="200" x2="353" y2="186" class="fx-line-blue"/>
<text x="353" y="232" text-anchor="middle" class="fx-t-blue">m = 0.05</text>
<text x="80" y="55" class="fx-t">left wing: slope −b(1−ρ) = −0.15</text>
<text x="600" y="140" text-anchor="end" class="fx-t">right wing: slope b(1+ρ) = +0.05</text>
<text x="122" y="194" class="fx-t-hl">minimum a + bs√(1−ρ²) = 0.019</text>
<line x1="318" y1="189" x2="370" y2="179" class="fx-line-hl"/>
<text x="60" y="215" text-anchor="middle" class="fx-t-sm">−0.6</text>
<text x="195" y="215" text-anchor="middle" class="fx-t-sm">−0.3</text>
<text x="330" y="215" text-anchor="middle" class="fx-t-sm">0</text>
<text x="465" y="215" text-anchor="middle" class="fx-t-sm">0.3</text>
<text x="600" y="215" text-anchor="middle" class="fx-t-sm">0.6</text>
<text x="44" y="143" text-anchor="end" class="fx-t-sm">0.05</text>
<text x="44" y="83" text-anchor="end" class="fx-t-sm">0.10</text>
<text x="620" y="254" text-anchor="end" class="fx-t-sm">log-moneyness k = ln(K/F); vertical: total variance w (a = 0.01, b = 0.1, ρ = −0.5, m = 0.05, s = 0.1)</text>
</svg>
<figcaption>Figure 2 · One SVI slice. The dashed lines are its asymptotes — the wings are straight, with slopes set by \(b\) and \(\rho\). The vertex sits near \(m\), its roundness is set by \(s\), and \(a\) lifts the whole curve. Negative \(\rho\) makes the left (low-strike) wing steeper: the equity skew.</figcaption>
</figure>

> [!EXAMPLE] Evaluating XYZ's 91-day slice
> A clean 91-day XYZ slice has \(a = 0.00288\), \(b = 0.02369\), \(\rho = -0.6\), \(m = 0.1140\), \(s = 0.1520\), with \(F = 101.00\) and \(T = 91/365 = 0.2493\). At the money (\(k = 0\)):
> $$
> w(0) = 0.00288 + 0.02369\Big(-0.6 \times (-0.1140) + \sqrt{0.1140^{2} + 0.1520^{2}}\Big) = 0.00288 + 0.02369 \times 0.2583 = 0.0090
> $$
> so \(\sigma_{\text{imp}} = \sqrt{0.0090/0.2493} = 19.0\%\). At the 80 strike, \(k = \ln(80/101) = -0.233\), the same formula gives \(w = 0.0168\) and a vol of 25.9%. The wing slopes are \(0.038\) and \(0.009\), far inside Lee's bound of 2.

### ③ No butterfly arbitrage: the function \(g(k)\)

A smile is free of butterfly arbitrage exactly when the risk-neutral density it implies is non-negative. Gatheral and Jacquier wrote that condition directly in terms of \(w\) and its first two derivatives in \(k\):

$$
g(k) = \Big(1 - \frac{k\,w'(k)}{2\,w(k)}\Big)^{2} - \frac{w'(k)^{2}}{4}\Big(\frac{1}{w(k)} + \frac14\Big) + \frac{w''(k)}{2} \;\ge\; 0 \quad \text{for all } k
$$

where \(w'\) and \(w''\) are the slope and curvature of total variance. The density itself is \(g(k)\) times a positive Gaussian factor, so the sign of \(g\) is the sign of the density. For the 91-day XYZ slice, \(g\) stays between about 0.55 and 1.3 across the quoted strikes: safe.

Can a perfectly respectable-looking SVI fail? Yes. A famous example attributed to Axel Vogt (\(a = -0.041\), \(b = 0.133\), \(\rho = 0.306\), \(m = 0.359\), \(s = 0.415\), \(T = 1\)) produces a smooth, convex-looking total-variance curve whose \(g\) turns negative between \(k \approx 0.65\) and \(1.25\), reaching about \(-0.033\). You cannot see it in the vols; you can only find it by computing \(g\).

::demo[surface-calibration-g]

### ④ No calendar arbitrage and interpolation in time

For a fixed log-moneyness \(k\), total variance must never decrease with maturity:

$$
\frac{\partial\, w(k, T)}{\partial T} \;\ge\; 0 \qquad \text{for every } k
$$

where \(w(k, T)\) is total variance at log-moneyness \(k\) (measured against each expiry's own forward) and maturity \(T\). If a longer slice dipped below a shorter one at some \(k\), you could sell the shorter option, buy the longer one, and collect money today for a position that cannot lose — a calendar spread ([[calendar-diagonal]]) with a negative price. Graphically: **the total-variance curves of successive expiries must never cross.**

<figure>
<svg viewBox="0 0 660 250" role="img" aria-label="Total variance slices must not cross">
<line x1="50" y1="200" x2="620" y2="200" class="fx-axis"/>
<line x1="50" y1="210" x2="50" y2="20" class="fx-axis"/>
<line x1="50" y1="151" x2="610" y2="151" class="fx-grid"/>
<line x1="50" y1="103" x2="610" y2="103" class="fx-grid"/>
<line x1="50" y1="54" x2="610" y2="54" class="fx-grid"/>
<text x="44" y="155" text-anchor="end" class="fx-t-sm">0.01</text>
<text x="44" y="107" text-anchor="end" class="fx-t-sm">0.02</text>
<text x="44" y="58" text-anchor="end" class="fx-t-sm">0.03</text>
<polygon points="395,164 411,165 438,167 465,169 492,171 519,171 546,172 573,172 600,172 600,191 573,191 546,191 519,190 492,189 465,185 438,179 411,171 395,166" class="fx-area-bad"/>
<polyline points="60,167 87,169 114,171 141,173 168,175 195,177 222,179 249,181 276,183 303,185 330,187 357,189 384,190 411,191 438,191 465,192 492,192 519,192 546,191 573,191 600,191" class="fx-line-muted"/>
<polyline points="60,115 87,120 114,124 141,128 168,133 195,137 222,141 249,145 276,149 303,153 330,156 357,160 384,163 411,165 438,167 465,169 492,171 519,171 546,172 573,172 600,172" class="fx-line-hl"/>
<polyline points="60,39 87,46 114,53 141,59 168,66 195,73 222,79 249,85 276,91 303,97 330,103 357,109 384,114 411,118 438,123 465,126 492,129 519,132 546,134 573,136 600,137" class="fx-line-blue"/>
<polyline points="60,38 87,48 114,59 141,70 168,80 195,91 222,101 249,111 276,122 303,132 330,142 357,152 384,162 411,171 438,179 465,185 492,189 519,190 546,191 573,191 600,191" class="fx-line-bad fx-dash"/>
<text x="120" y="195" class="fx-t-sm">30 days</text>
<text x="70" y="108" class="fx-t-hl">91 days</text>
<text x="160" y="50" class="fx-t-blue">182 days</text>
<text x="70" y="28" class="fx-t-bad">bad 120-day fit</text>
<text x="470" y="158" class="fx-t-bad">crosses below 91 days</text>
<text x="114" y="218" text-anchor="middle" class="fx-t-sm">−0.2</text>
<text x="222" y="218" text-anchor="middle" class="fx-t-sm">−0.1</text>
<text x="330" y="218" text-anchor="middle" class="fx-t-sm">0</text>
<text x="438" y="218" text-anchor="middle" class="fx-t-sm">0.1</text>
<text x="546" y="218" text-anchor="middle" class="fx-t-sm">0.2</text>
<text x="620" y="240" text-anchor="end" class="fx-t-sm">log-moneyness k; vertical: total variance w = σ²T</text>
</svg>
<figcaption>Figure 3 · XYZ total-variance slices at 30, 91 and 182 days, stacked without touching: arbitrage-free. The dashed 120-day fit is too steep — it sits above the 182-day slice on the far left and dips below the 91-day slice for \(k > 0.06\) (shaded). Selling the 91-day and buying the 120-day option there would lock in a riskless gain.</figcaption>
</figure>

**Interpolating in time.** Quoted expiries are discrete; a pricing model needs every date. The safe default is to interpolate **total variance** linearly in \(T\) at fixed \(k\): if two slices do not cross, every blend of them is sandwiched between them, so no new calendar arbitrage appears. Example at the money: \(w_{30} = 0.18^2 \times 30/365 = 0.00266\) and \(w_{91} = 0.19^2 \times 91/365 = 0.00900\). At 60 days, \(w_{60} = 0.00266 + \tfrac{30}{61}(0.00900 - 0.00266) = 0.00578\), so \(\sigma_{60} = \sqrt{0.00578 / (60/365)} = 18.75\%\). Interpolating the *vols* directly would not carry that guarantee. Around earnings, desks add the event's variance as a jump on the event date instead of spreading it smoothly ([[earnings-events]]).

### ⑤ Calibration: the loss, the optimiser and the traps

Calibrating a slice means choosing \((a, b, \rho, m, s)\) to minimise a weighted error:

$$
L(a, b, \rho, m, s) = \sum_{i} \omega_i \big(\sigma_{\text{SVI}}(k_i) - \sigma_i\big)^{2}
$$

where \(\sigma_i\) is the market implied vol at log-moneyness \(k_i\), \(\sigma_{\text{SVI}}(k_i) = \sqrt{w(k_i)/T}\), and \(\omega_i\) is the trust you place in quote \(i\). Common choices: equal weights; weights proportional to **vega**, which emphasises near-the-money quotes where prices are most informative; or \(1/\text{spread}^2\), which trusts tight markets. (A price error divided by vega is approximately a vol error, which is why “vega-weighted” appears in both price and vol forms.)

The main demo fits synthetic XYZ quotes built from a known arbitrage-free surface plus bid–ask noise, so you can compare the fit with the truth. Four things happen that also happen on real desks:

- **Clean data, equal weights:** errors of about 0.10 vol points against the quotes and 0.06–0.08 against the true curve — the fit stays inside the noise.
- **One bad print** (4 vol points too high at the 30-day 92.5 strike): the 30-day error jumps to about 1.04 points and the curve is dragged away from the truth. No optimiser fixes bad data; cleaning does.
- **Vega weights, no arbitrage penalty:** the 30-day fit still matches the quotes within 0.12 points, but just outside the quoted range it grows a kink — \(g\) falls to about \(-452\), the right-wing slope reaches about 40 (Lee's bound is 2), and the slice crosses the 91-day one. **Every quote fits; the surface is broken.** Adding penalties for \(g < 0\) and for crossing the longer slice removes all three problems at the cost of a slightly larger error.
- **Redraw the noise:** the fitted parameters jump around (over ten noise draws the 91-day \(\rho\) ranged from about \(-0.1\) to \(-1\), and the 30-day \(\rho\) sometimes turned positive) while the curve barely moves. With 13–17 quotes, five parameters are poorly identified; never read economic meaning into one day's \(m\) or \(s\).

> [!DEEP] Two tricks the professionals use
> **Quasi-explicit fitting.** Substitute \(y = (k - m)/s\): then \(w = a + b\rho s\,y + bs\sqrt{y^2 + 1}\) is *linear* in \((a,\; b\rho s,\; bs)\). For any fixed \((m, s)\) those three come from a weighted least-squares solve, so the optimiser only searches two dimensions — this is what the demo does. **SSVI.** Gatheral and Jacquier (2014) proposed a whole-surface form, \(w(k, \theta_t) = \tfrac{\theta_t}{2}\big(1 + \rho\varphi k + \sqrt{(\varphi k + \rho)^2 + 1 - \rho^2}\big)\) with \(\theta_t\) the at-the-money total variance and \(\varphi = \varphi(\theta_t)\). It is free of butterfly arbitrage when \(\theta\varphi(1+|\rho|) < 4\) and \(\theta\varphi^2(1+|\rho|) \le 4\), and of calendar arbitrage when \(\theta_t\) increases with \(t\) and \(\theta\varphi(\theta)\) is non-decreasing (with a mild upper bound). The synthetic XYZ surface in the demo is SSVI with \(\varphi = 0.8\,\theta^{-0.4}\), \(\rho = -0.6\); at 91 days \(\theta = 0.0090\), \(\varphi = 5.27\), and the two butterfly quantities are 0.076 and 0.40 — comfortably inside the limits.

### ⑥ The surface in practice (2026)

A fitted surface is infrastructure. It feeds the pricing of every option that is not on the screen (odd strikes, odd dates, exotics), the Greeks and scenario risk of a whole book, variance-swap and VIX-style calculations ([[vix]]), and the calibration of the models in [[stochastic-vol]]. Because it is reused everywhere, its errors spread everywhere.

> [!WARN] Arbitrage-free is necessary, not sufficient
> Passing the three checks means the surface cannot be exploited by static trades in vanilla options. It does not mean the surface is right. The riskiest places are where there are no quotes: extrapolated wings (a deep out-of-the-money put priced off a straight SVI wing), dates between listed expiries, and the moments after big moves when quotes are stale. Know where your surface is observed and where it is merely assumed.

Three trends shape current practice. Surfaces are rebuilt continuously during the trading day, which puts a premium on fits that are fast and stable from one refit to the next. Real chains bring their own mess — American exercise, dividends, corporate actions, crossed and stale quotes — which is the subject of [[options-data]]. And calibrating slow models (rough volatility, stochastic-local vol) to a surface is increasingly done with neural networks trained offline as fast pricers, which then have to be checked for exactly the arbitrage conditions of this lesson ([[neural-pricing]]).

## @analogy
Building a vol surface is like **drawing a contour map from a handful of GPS readings**.

The readings (quotes) are few, uneven and slightly wrong — more accurate near the town centre (at the money), sparse and fuzzy in the hills (the wings). A careless mapmaker draws a line through every reading and ends up with tiny impossible pits and spikes. A good mapmaker uses a smooth, sensible shape for each contour (SVI), lets it miss a reading by a metre when the reading is noisy, and enforces two physical rules: the ground cannot have a hole below sea level (no negative density, \(g \ge 0\)), and contour lines of higher altitude can never cross lower ones (no calendar arbitrage). Between surveyed contours, you blend them rather than invent new features (interpolate total variance).

Where the analogy breaks: a mountain does not care about your map, but an options market does. If your map has a hole, someone else's trading desk will find it and trade against you — the rules here are enforced by money, not by geology.

## @misconceptions
- **“The best surface is the one that passes through every quote.”** — Quotes carry bid–ask noise. A curve that hits every mid usually wiggles, and wiggles can create negative densities. Aim for errors inside the spread with zero arbitrage.
- **“If the implied-vol curve looks smooth, it is arbitrage-free.”** — Vogt's SVI example looks perfectly smooth, yet \(g(k)\) turns negative between \(k \approx 0.65\) and 1.25. Compute \(g\); don't eyeball it.
- **“Interpolating implied vols linearly between expiries is fine.”** — Interpolate total variance \(w = \sigma^2 T\) at fixed log-moneyness; that keeps the calendar condition if the slices don't cross. Interpolating vols directly has no such guarantee.
- **“Use spot for moneyness.”** — Use the forward implied by put-call parity. Dividends, borrow costs and rates all live in the forward, and a wrong forward shows up as a fake skew.
- **“Fitted SVI parameters tell you what the market thinks.”** — With a dozen noisy quotes the five parameters are poorly identified: they jump from day to day while the curve barely moves. Read the curve, not the parameters.

## @takeaways
- A surface is built in steps: clean → forward and discount from parity → OTM implied vols in \((k, w)\) → a fitted curve per expiry → arbitrage checks → interpolation in time.
- Raw SVI \(w(k) = a + b(\rho(k-m) + \sqrt{(k-m)^2 + s^2})\) has straight wings with slopes \(b(1 \pm \rho)\), which must stay within Lee's bound of 2.
- No butterfly arbitrage means \(g(k) \ge 0\) everywhere; no calendar arbitrage means total-variance slices never cross.
- Calibrate with a weighted loss, clean data and explicit arbitrage penalties; a fit can match every quote and still hide arbitrage outside the quoted range.
- Interpolate total variance, not vol, between expiries; treat extrapolated wings and unlisted dates as assumptions, not observations.

## @quiz
1. XYZ's 30-day chain gives \(C - P = 5.3118\) at \(K = 95\) and \(-4.6554\) at \(K = 105\). What are the discount factor and the forward?
   - [ ] \(D = 1.0000\), \(F = 100.00\)
   - [x] \(D = 0.99672\), \(F = 100.33\)
   - [ ] \(D = 0.99672\), \(F = 99.67\)
   - [ ] \(D = 0.96079\), \(F = 104.08\)
   > Parity \(C - P = D(F - K)\) is a line in \(K\) with slope \(-D\): \((-4.6554 - 5.3118)/10 = -0.99672\). Then \(F = 95 + 5.3118/0.99672 = 100.33\). 104.08 is the 1-year forward.
2. A fitted SVI slice passes through every quote within 0.05 vol points, but \(g(k) < 0\) for some strikes just beyond the last quote. What is true?
   - [ ] Nothing is wrong, because no one trades those strikes
   - [ ] The surface has calendar arbitrage
   - [ ] \(g\) is irrelevant as long as the implied vols are positive
   - [x] The implied density is negative there, so a butterfly on those strikes would have a negative price: the fit must be constrained
   > The sign of \(g\) is the sign of the density. A negative density means a non-negative payoff with a negative price. Exotics and risk systems will happily read the surface out there, so the fit must be fixed with a penalty or constraints.
3. At the same log-moneyness, the 91-day slice has total variance 0.0090 and a fitted 120-day slice has 0.0085. What does this mean?
   - [x] Calendar arbitrage: the longer expiry offers less total variance, so a calendar spread would have a negative price
   - [ ] Nothing, since longer options can have lower implied vol
   - [ ] Butterfly arbitrage in the 91-day slice
   - [ ] The forward was computed from spot instead of parity
   > Lower implied *vol* at a longer expiry is fine; lower *total variance* \(\sigma^2 T\) at the same \(k\) is not. The slices have crossed, which is exactly the calendar condition.
4. The 30-day ATM total variance is 0.00266 and the 91-day is 0.00900. Interpolating total variance linearly in time, what is the 60-day ATM implied vol?
   - [ ] 18.50%, the average of 18% and 19%
   - [ ] 19.00%, the 91-day vol
   - [x] About 18.75%
   - [ ] About 5.78%
   > \(w_{60} = 0.00266 + \tfrac{30}{61}(0.00900 - 0.00266) = 0.00578\), and \(\sqrt{0.00578/(60/365)} = 18.75\%\). 5.78 is the total variance multiplied by 1,000, not a vol.
5. You refit the same slice on several days with similar markets. The curve barely changes, but \(\rho\) moves from \(-0.3\) to \(-1.0\). The best interpretation is:
   - [ ] The market's view of skew has changed dramatically
   - [ ] The optimiser has a bug
   - [x] With few noisy quotes the SVI parameters are poorly identified; different parameter sets draw almost the same curve
   - [ ] SVI cannot fit equity smiles
   > Several parameter combinations produce nearly identical curves over the quoted range. Judge the curve (and its arbitrage checks), not individual parameters — or use a more constrained form such as SSVI.

## @further
- [Gatheral & Jacquier (2014), Arbitrage-free SVI volatility surfaces (arXiv)](https://arxiv.org/abs/1204.0646) — the \(g(k)\) condition, SSVI and its no-arbitrage theorems.
- [Volatility smile (Wikipedia)](https://en.wikipedia.org/wiki/Volatility_smile) — background on smiles and surfaces.
- [Put–call parity (Wikipedia)](https://en.wikipedia.org/wiki/Put%E2%80%93call_parity) — the identity behind the implied forward and discount factor.
- [Cboe VIX methodology (PDF)](https://cdn.cboe.com/resources/vix/VIX_Methodology.pdf) — a real, published pipeline that selects, cleans and combines out-of-the-money quotes.

## @next
Everything here assumed a tidy chain. Real data arrive with crossed and stale quotes, bad prints, American exercise, dividends and corporate actions. How do you get from a raw feed to clean inputs you can trust? The next stage starts with options data.
