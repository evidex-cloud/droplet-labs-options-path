---
id: risk-neutral-density
prereqs: probability-ev, arbitrage-bounds, risk-neutral, smile-skew, term-structure
demo: risk-neutral-density
---

# The Probabilities Hidden in Option Prices

## @hook
A row of call prices is a probability table in disguise. The **slope** of the call price across strikes is the price of betting that the stock ends above a level; the **curvature** is the price of betting that it lands near a level. Read the curvature strike by strike and you have the market's whole distribution for the stock — no model required.

## @bridge
[[risk-neutral]] showed that an option's price is its expected payoff under the risk-neutral measure \(\Q\), discounted. [[probability-ev]] used a lognormal \(\Q\) to compute odds, and [[smile-skew]] then showed that real prices refuse to fit one lognormal: every strike needs its own implied vol; [[term-structure]] then stacked one such smile per expiry into a surface. This lesson takes a single expiry's smile and runs the logic backwards. Instead of assuming a distribution and computing prices, we take the prices and **recover the distribution** — the Breeden–Litzenberger result. It builds Idea ② (no-arbitrage: a butterfly can never cost less than zero) and Idea ③ (the smile is a statement about probabilities).

## @intuition
Start with three XYZ calls, 30 days to expiry, priced at the course's flat 20% volatility (\(S = 100\), \(r = 4\%\)):

| Strike | 104 | 105 | 106 |
|---|---|---|---|
| Call price | $0.9424 | $0.7129 | $0.5306 |

Now build two small positions from them.

**A call spread is a bet on "above".** Buy the 104.5 call and sell the 105.5 call (they cost $0.8214 and $0.6163). At expiry this pays $1 if XYZ ends above 105.5, nothing below 104.5, and a ramp in between. It costs \(0.8214 - 0.6163 = \$0.2051\). A $1 bet on "XYZ finishes above about 105" costs 20.5 cents — so, after a tiny interest adjustment, the market is pricing that outcome at about **20.5%**.

**A butterfly is a bet on "near".** Buy one 104 call, sell two 105 calls, buy one 106 call. The payoff is a small tent: $0 below 104, rising to $1 at 105, back to $0 at 106. It costs \(0.9424 - 2 \times 0.7129 + 0.5306 = \$0.0472\). A tent one dollar wide and one dollar tall has an area of one "dollar of price × dollar of payoff", so this is roughly the price of "XYZ lands within about 50 cents of 105" — about **4.7%**.

> [!KAI] What are the odds my shares get called away?
> Kai's covered call is the 30-day 105 call. The call spread says the market prices "XYZ above 105 at expiry" at about 20.5% — which is exactly \(\N(d_2)\) for that strike, the risk-neutral probability from [[black-scholes]]. Kai did not need the formula: two option prices and a subtraction were enough.

That is the whole idea, in three layers:

<figure>
<svg viewBox="0 0 640 330" role="img" aria-label="Call price, its slope and its curvature across strikes">
<line x1="70" y1="95" x2="610" y2="95" class="fx-axis"/>
<line x1="70" y1="195" x2="610" y2="195" class="fx-axis"/>
<line x1="70" y1="295" x2="610" y2="295" class="fx-axis"/>
<polyline points="70,18 84,22 97,25 111,29 124,33 138,37 151,41 165,44 178,48 192,52 205,56 219,59 232,63 246,66 259,70 273,73 286,76 300,79 313,81 327,84 340,86 354,87 367,89 381,90 394,91 408,92 421,93 435,94 448,94 462,94 475,94 489,95 502,95 516,95 529,95 543,95 556,95 570,95 583,95 597,95 610,95" class="fx-line-thick"/>
<polyline points="70,115 84,115 97,115 111,115 124,115 138,115 151,115 165,116 178,116 192,117 205,117 219,119 232,121 246,123 259,126 273,129 286,133 300,138 313,143 327,149 340,154 354,160 367,165 381,170 394,175 408,179 421,182 435,185 448,187 462,189 475,191 489,192 502,193 516,194 529,194 543,194 556,195 570,195 583,195 597,195 610,195" class="fx-line-blue"/>
<polygon points="70,295 84,295 97,295 111,295 124,294 138,294 151,292 165,291 178,288 192,285 205,281 219,275 232,268 246,260 259,252 273,244 286,236 300,230 313,225 327,222 340,221 354,222 367,226 381,231 394,237 408,245 421,252 435,259 448,266 462,272 475,277 489,282 502,285 516,288 529,290 543,291 556,293 570,293 583,294 597,294 610,295" class="fx-area-hl"/>
<polyline points="70,295 84,295 97,295 111,295 124,294 138,294 151,292 165,291 178,288 192,285 205,281 219,275 232,268 246,260 259,252 273,244 286,236 300,230 313,225 327,222 340,221 354,222 367,226 381,231 394,237 408,245 421,252 435,259 448,266 462,272 475,277 489,282 502,285 516,288 529,290 543,291 556,293 570,293 583,294 597,294 610,295" class="fx-line-hl"/>
<line x1="408" y1="15" x2="408" y2="300" class="fx-line-muted fx-dash"/>
<circle cx="408" cy="92" r="4" class="fx-fill-ink"/>
<circle cx="408" cy="179" r="4" class="fx-fill-blue"/>
<circle cx="408" cy="245" r="4" class="fx-fill-orange"/>
<text x="416" y="80" class="fx-t">price C(105) = 0.71</text>
<text x="416" y="150" class="fx-t-blue">minus slope at 105 ≈ 0.205</text>
<text x="416" y="166" class="fx-t-blue">→ a 20.5% chance above 105</text>
<text x="416" y="240" class="fx-t-hl">curvature ≈ 0.047 per $ → density</text>
<text x="600" y="30" text-anchor="end" class="fx-t-b">① call price C(K)</text>
<text x="80" y="148" class="fx-t-b">② minus slope = digital</text>
<text x="80" y="214" class="fx-t-b">③ curvature = density (butterfly)</text>
<text x="70" y="314" class="fx-t-sm">80</text>
<text x="205" y="314" text-anchor="middle" class="fx-t-sm">90</text>
<text x="340" y="314" text-anchor="middle" class="fx-t-sm">100</text>
<text x="408" y="314" text-anchor="middle" class="fx-t-sm">105</text>
<text x="600" y="314" text-anchor="end" class="fx-t-sm">120</text>
<text x="340" y="328" text-anchor="middle" class="fx-t-sm">strike K (XYZ, 30 days, flat 20% vol)</text>
</svg>
<figcaption>Figure 1 · One curve, three readings. ① The call price falls as the strike rises. ② How fast it falls — minus its slope — is the price of a bet that pays $1 above \(K\): at 105 about 0.205, i.e. a 20.5% risk-neutral chance. ③ How fast the slope changes — the curvature, priced by a butterfly — is the probability density. Where the curvature is largest (near the forward, 100.33), the stock is most likely to land.</figcaption>
</figure>

::demo[risk-neutral-density-fly]

> [!THINK] A dealer's screen shows the 95/100/105 call butterfly offered at −$0.02 (they would pay you to take it). Should you?
> Look at the payoff of a long butterfly first.
> ---
> Yes — it is free money. A long butterfly's payoff is never negative (a tent that is zero outside 95–105), so being paid to own it is an arbitrage. In probability language, a negative butterfly would mean a **negative probability** of landing near 100, which is impossible. This is the convexity rule from [[arbitrage-bounds]]: \(C(K_1) - 2C(K_2) + C(K_3) \ge 0\) for equally spaced strikes.

Do this for every strike and the butterflies add up to a histogram of where the market thinks XYZ can end. With the flat 20% smile that histogram is the textbook lognormal. With a real equity smile — higher implied vols for low strikes — the histogram grows a **fat left tail**. The smile of [[smile-skew]] is nothing more than a compact way of writing that distribution down.

We'll take it in five parts:

- **① The slope: digitals and "probability above"**
- **② The curvature: Breeden–Litzenberger**
- **③ From the smile to the distribution**
- **④ Using the distribution — and the ℚ-versus-ℙ warning**
- **⑤ Doing it with real quotes (state of play)**

## @mechanics
### ① The slope: digitals and "probability above"

A **digital** (or binary) call pays a fixed $1 if \(S_T > K\) and nothing otherwise. Its price is the discounted risk-neutral probability of that event, \(e^{-rT}\,\Q(S_T > K)\). A tight call spread is a digital: buy the call at \(K\), sell the call at \(K + \Delta K\), and scale by \(1/\Delta K\). Letting \(\Delta K\) shrink gives

$$
-\frac{\partial C}{\partial K} \;=\; e^{-rT}\,\Q\!\left(S_T > K\right)
$$

where \(C(K)\) is the call price as a function of strike, \(r\) the risk-free rate, \(T\) the time to expiry and \(\Q(S_T > K)\) the risk-neutral probability of finishing above \(K\). The put side is the mirror: \(\partial P/\partial K = e^{-rT}\,\Q(S_T < K)\).

> [!EXAMPLE] The 105 digital for Kai's covered call
> The 104.5/105.5 call spread costs \(0.8214 - 0.6163 = 0.2051\) for \(\Delta K = 1\). Undo the discounting: \(0.2051 \times e^{0.04 \times 30/365} = 0.2051 \times 1.0033 = 0.2058\). The exact slope at 105 gives \(\Q(S_T > 105) = 0.2055\) — the Black-Scholes \(\N(d_2)\) at 20% vol. A digital paying $100 above 105 would cost about \(100 \times e^{-rT} \times 0.2055 = \$20.48\).

This is why the slope is only \(\N(d_2)\) when the smile is flat. If implied vol changes with strike, differentiating \(C_{\text{BS}}(K, \sigma(K))\) picks up a second term through the smile:

$$
-\frac{\partial C}{\partial K} \;=\; e^{-rT}\N(d_2) \;-\; \nu_{\text{raw}}\,\frac{\partial \sigma}{\partial K}
$$

where \(\N(d_2)\) is computed with the strike's own implied vol, \(\nu_{\text{raw}} = \partial C/\partial\sigma\) is vega per unit of vol (not per point), and \(\partial\sigma/\partial K\) is the slope of the smile at that strike. With an equity skew, \(\partial\sigma/\partial K < 0\), so the second term **adds** probability above \(K\) — section ③ puts numbers on it.

### ② The curvature: Breeden–Litzenberger

Differentiate once more and the probability of "above" becomes the probability of "right here". Breeden and Litzenberger (1978) showed:

$$
f_{\Q}(K) \;=\; e^{rT}\,\frac{\partial^2 C}{\partial K^2}
$$

where \(f_{\Q}(K)\) is the risk-neutral probability density of \(S_T\) at the price level \(K\) (probability per dollar), and \(\partial^2 C/\partial K^2\) is the curvature of the call price across strikes. With strikes spaced \(h\) apart, the second derivative is a butterfly:

$$
f_{\Q}(K) \;\approx\; e^{rT}\,\frac{C(K-h) - 2C(K) + C(K+h)}{h^2}
$$

where the numerator is exactly the price of a long \(K-h / K / K+h\) call butterfly and \(h^2\) is the area of its tent-shaped payoff.

> [!EXAMPLE] The density at 105, by hand
> With \(h = 1\): \(0.9424 - 2 \times 0.7129 + 0.5306 = 0.0472\), times \(e^{rT} = 1.0033\), divided by \(1^2\): \(f_{\Q}(105) \approx 0.0472\) per dollar. The lognormal density that Black-Scholes assumes gives 0.04726 at 105 — the butterfly recovered it to three decimals. Read it as: about a 4.7% chance of ending in a one-dollar window around 105.

> [!DEEP] Why the second derivative is the density
> Write the call as an expectation: \(C(K) = e^{-rT}\int_K^\infty (s - K)\,f_{\Q}(s)\,\dd s\). Differentiate in \(K\) (Leibniz rule; the boundary term vanishes because \(s - K = 0\) at \(s = K\)): \(\partial C/\partial K = -e^{-rT}\int_K^\infty f_{\Q}(s)\,\dd s = -e^{-rT}\Q(S_T > K)\). Differentiate again: \(\partial^2 C/\partial K^2 = e^{-rT} f_{\Q}(K)\). No assumption about the shape of \(f_{\Q}\) was made — only that prices are expectations under some \(\Q\), which is what no-arbitrage guarantees.

A whole row of butterflies is therefore a histogram. With 5-dollar-wide butterflies on the 30-day chain, each fly price divided by 5 and undiscounted gives the probability mass around its center strike:

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="A row of butterflies as a probability histogram, flat versus skewed smile">
<line x1="60" y1="210" x2="620" y2="210" class="fx-axis"/>
<line x1="60" y1="165" x2="620" y2="165" class="fx-grid"/>
<line x1="60" y1="120" x2="620" y2="120" class="fx-grid"/>
<line x1="60" y1="75" x2="620" y2="75" class="fx-grid"/>
<text x="54" y="214" text-anchor="end" class="fx-t-sm">0</text>
<text x="54" y="169" text-anchor="end" class="fx-t-sm">10%</text>
<text x="54" y="124" text-anchor="end" class="fx-t-sm">20%</text>
<text x="54" y="79" text-anchor="end" class="fx-t-sm">30%</text>
<rect x="78" y="210" width="11" height="0.5" class="fx-fill-muted"/>
<rect x="91" y="207.3" width="11" height="2.7" class="fx-fill-red"/>
<rect x="141" y="205" width="11" height="5" class="fx-fill-muted"/>
<rect x="154" y="200.3" width="11" height="9.7" class="fx-fill-red"/>
<rect x="203" y="175" width="11" height="35" class="fx-fill-muted"/>
<rect x="216" y="178.9" width="11" height="31.1" class="fx-fill-red"/>
<rect x="266" y="105" width="11" height="105" class="fx-fill-muted"/>
<rect x="279" y="125" width="11" height="85" class="fx-fill-red"/>
<rect x="328" y="63" width="11" height="147" class="fx-fill-muted"/>
<rect x="341" y="54.7" width="11" height="155.3" class="fx-fill-red"/>
<rect x="391" y="105" width="11" height="105" class="fx-fill-muted"/>
<rect x="404" y="91.6" width="11" height="118.4" class="fx-fill-red"/>
<rect x="453" y="169" width="11" height="41" class="fx-fill-muted"/>
<rect x="466" y="171.3" width="11" height="38.7" class="fx-fill-red"/>
<rect x="516" y="201" width="11" height="9" class="fx-fill-muted"/>
<rect x="529" y="202.8" width="11" height="7.2" class="fx-fill-red"/>
<rect x="578" y="209" width="11" height="1" class="fx-fill-muted"/>
<rect x="591" y="209.1" width="11" height="0.9" class="fx-fill-red"/>
<text x="90" y="226" text-anchor="middle" class="fx-t-sm">80</text>
<text x="153" y="226" text-anchor="middle" class="fx-t-sm">85</text>
<text x="215" y="226" text-anchor="middle" class="fx-t-sm">90</text>
<text x="278" y="226" text-anchor="middle" class="fx-t-sm">95</text>
<text x="340" y="226" text-anchor="middle" class="fx-t-sm">100</text>
<text x="403" y="226" text-anchor="middle" class="fx-t-sm">105</text>
<text x="465" y="226" text-anchor="middle" class="fx-t-sm">110</text>
<text x="528" y="226" text-anchor="middle" class="fx-t-sm">115</text>
<text x="590" y="226" text-anchor="middle" class="fx-t-sm">120</text>
<text x="340" y="244" text-anchor="middle" class="fx-t-sm">center strike of each 5-wide butterfly</text>
<rect x="380" y="28" width="12" height="10" class="fx-fill-muted"/>
<text x="398" y="37" class="fx-t-sm">flat 20% smile</text>
<rect x="380" y="46" width="12" height="10" class="fx-fill-red"/>
<text x="398" y="55" class="fx-t-sm">skewed smile (from the smile lesson)</text>
<text x="72" y="82" class="fx-t-bad">left tail: 0.6% vs 0.06% at 80,</text>
<text x="72" y="98" class="fx-t-bad">2.2% vs 1.1% at 85</text>
</svg>
<figcaption>Figure 2 · Each bar is a 5-dollar-wide butterfly's price, divided by 5 and undiscounted: the probability mass around its center strike. Grey uses a flat 20% smile (lognormal); red uses the skewed smile of section ③. The skew moves mass into the far left tail (80, 85) and toward the center-right (100, 105), and takes it from the moderate-down region (90, 95).</figcaption>
</figure>

The bars in each color add up to about 100%, and the distribution they describe has a mean equal to the forward, \(F = Se^{rT} = 100.33\). Those two checks — total probability 1, mean equal to the forward — hold for **any** arbitrage-free set of prices, flat smile or not. Both come straight from the call curve. The slope at a strike of zero is \(-e^{-rT}\) (a call struck at zero always pays, so it behaves like the stock minus nothing), which forces the probabilities to sum to 1. And a call struck at zero *is* the stock: \(C(0) = S = e^{-rT}\E^{\Q}[S_T]\), so \(\E^{\Q}[S_T] = Se^{rT} = F\). For the flat bars: \(0.1 + 1.1 + 7.8 + 23.4 + 32.7 + 23.3 + 9.1 + 2.1 + 0.3 = 99.9\%\), the missing 0.1% sitting in the far tails beyond the outermost bars.

### ③ From the smile to the distribution

Now give XYZ a realistic-looking skew: exactly the 30-day SVI smile of Figure 1 in [[smile-skew]] (\(a = 0.00254,\ b = 0.012,\ \rho = -0.8,\ m = 0.01,\ s = 0.05\); the full theory of fitting it is in [[surface-calibration]]). The ATM vol stays at 20%, and the 90 and 95 strikes carry the 25.2% and 22.4% you met there:

| Strike | 80 | 85 | 90 | 95 | 100 | 105 | 110 | 115 | 120 |
|---|---|---|---|---|---|---|---|---|---|
| Implied vol | 30.6% | 28.0% | 25.2% | 22.4% | 20.0% | 18.9% | 18.8% | 19.0% | 19.2% |

Price every strike at its own vol, take second differences, and compare the two distributions:

| Risk-neutral probability | flat 20% | skewed smile |
|---|---|---|
| \(\Q(S_T < 90)\) | 3.1% | **5.2%** |
| \(\Q(S_T < 95)\) | 17.8% | 16.5% |
| \(\Q(95 < S_T < 105)\) | 61.7% | 63.6% |
| \(\Q(S_T > 105)\) | 20.5% | 20.0% |
| \(\Q(S_T > 110)\) | 5.1% | 4.1% |
| mean (must equal \(F\)) | 100.33 | 100.33 |
| most likely price (mode) | 99.8 | 101.2 |

<figure>
<svg viewBox="0 0 640 310" role="img" aria-label="Skewed smile above, the implied density against the lognormal below">
<line x1="70" y1="110" x2="610" y2="110" class="fx-axis"/>
<line x1="70" y1="88" x2="610" y2="88" class="fx-line-muted fx-dash"/>
<polyline points="70,43 84,45 97,47 111,50 124,52 138,54 151,56 165,59 178,61 192,63 205,66 219,68 232,70 246,73 259,75 273,77 286,80 300,82 313,84 327,86 340,88 354,89 367,91 381,91 394,92 408,92 421,92 435,92 448,92 462,92 475,92 489,92 502,92 516,91 529,91 543,91 556,91 570,90 583,90 597,90 610,90" class="fx-line-bad"/>
<text x="600" y="102" text-anchor="end" class="fx-t-sm">flat 20% (dashed)</text>
<text x="130" y="36" class="fx-t-bad">skewed smile: 30.6% at 80, 20% ATM</text>
<text x="64" y="92" text-anchor="end" class="fx-t-sm">20%</text>
<text x="64" y="58" text-anchor="end" class="fx-t-sm">30%</text>
<line x1="70" y1="54" x2="610" y2="54" class="fx-grid"/>
<line x1="70" y1="285" x2="610" y2="285" class="fx-axis"/>
<polyline points="70,285 84,285 97,285 111,285 124,285 138,285 151,285 165,284 178,283 192,281 205,277 219,272 232,264 246,253 259,240 273,226 286,211 300,197 313,186 327,179 340,177 354,180 367,188 381,199 394,211 408,225 421,238 435,249 448,259 462,267 475,273 489,277 502,280 516,282 529,283 543,284 556,284 570,285 583,285 597,285 610,285" class="fx-line-muted fx-dash"/>
<polygon points="70,285 84,284 97,284 111,284 124,283 138,283 151,282 165,281 178,279 192,277 205,274 219,270 232,265 246,259 259,251 273,241 286,229 300,215 313,198 327,182 340,168 354,163 367,169 381,184 394,202 408,221 421,238 435,251 448,262 462,270 475,275 489,279 502,281 516,283 529,284 543,284 556,285 570,285 583,285 597,285 610,285" class="fx-area-bad"/>
<polyline points="70,285 84,284 97,284 111,284 124,283 138,283 151,282 165,281 178,279 192,277 205,274 219,270 232,265 246,259 259,251 273,241 286,229 300,215 313,198 327,182 340,168 354,163 367,169 381,184 394,202 408,221 421,238 435,251 448,262 462,270 475,275 489,279 502,281 516,283 529,284 543,284 556,285 570,285 583,285 597,285 610,285" class="fx-line-bad"/>
<text x="400" y="160" class="fx-t-bad">implied by the skew</text>
<text x="400" y="176" class="fx-t-sm">peak moves right (mode ≈ 101.2)</text>
<text x="420" y="205" class="fx-t-sm">dashed: lognormal (flat 20%)</text>
<text x="80" y="215" class="fx-t-bad">fatter left tail</text>
<text x="80" y="231" class="fx-t-sm">density at 85: about 3× lognormal</text>
<text x="70" y="302" class="fx-t-sm">75</text>
<text x="124" y="302" text-anchor="middle" class="fx-t-sm">80</text>
<text x="232" y="302" text-anchor="middle" class="fx-t-sm">90</text>
<text x="340" y="302" text-anchor="middle" class="fx-t-sm">100</text>
<text x="448" y="302" text-anchor="middle" class="fx-t-sm">110</text>
<text x="556" y="302" text-anchor="middle" class="fx-t-sm">120</text>
<text x="610" y="302" text-anchor="end" class="fx-t-sm">125</text>
</svg>
<figcaption>Figure 3 · Top: the skewed 30-day smile (solid) against a flat 20% (dashed). Bottom: the densities they imply. The skew does not just "raise put prices" — it reshapes the whole distribution: a fatter left tail (a crash is priced as far more likely), a thinner band of moderate declines, and a peak shifted slightly above the forward. Both curves still have mean 100.33.</figcaption>
</figure>

Notice the trade-off. The skewed market charges more for a crash — \(\Q(S_T < 90)\) rises from 3.1% to 5.2%, and the 90 put costs $0.20 instead of $0.06 — yet it assigns **less** probability to a moderate drop below 95 and **more** to a mild rise. The mean is pinned at the forward, so extra probability in the far left must be paid for somewhere else. This is the typical shape of equity index distributions implied by option prices: left-skewed, with a hump just above the forward.

Kai's protective put makes the trade-off concrete. A put's price is "probability of finishing below the strike" times "average shortfall when that happens", discounted: \(P = e^{-rT}\,\Q(S_T < K)\,\E^{\Q}[K - S_T \mid S_T < K]\). Split the 95 put both ways:

| 30-day 95 put | Price | \(\Q(S_T < 95)\) | Average shortfall below 95 |
|---|---|---|---|
| flat 20% | $0.51 | 17.8% | \(0.51 / (0.9967 \times 0.178) \approx \$2.87\) |
| skewed smile | $0.69 | 16.5% | \(0.69 / (0.9967 \times 0.165) \approx \$4.20\) |

The skewed market says a finish below 95 is slightly **less** likely, but when it happens it is expected to be much **deeper** — so the insurance costs about a third more ($0.69 against $0.51, the same prices as in [[smile-skew]]). That is the fat tail, priced.

Why do equity markets price their distributions this way? Three reasons usually offered, not mutually exclusive: crashes really are bigger than rallies in equity history (on 19 October 1987 the S&P 500 fell 20.5% in a day — [[bs-assumptions]]); volatility tends to rise when prices fall (the leverage effect), which stretches the left tail; and investors structurally buy puts for protection while selling calls for income, so dealers charge more for downside convexity ([[market-makers]]). The density does not tell you which reason is at work — only how much it costs in total.

> [!WARN] \(\N(d_2)\) at the strike's own vol is not the probability
> A common shortcut reads \(\Q(S_T > K)\) as \(\N(d_2)\) using the implied vol of that strike. With a skew this is wrong. At 95, the strike's vol is 22.4% and \(\N(d_2) = 0.793\). The smile term adds \(-\nu_{\text{raw}}\,\partial\sigma/\partial K = -7.76 \times (-0.0054) = 0.042\) (still 0.042 after undoing the tiny discount), giving a true \(\Q(S_T > 95) \approx 0.835\). The shortcut says a 20.7% chance of finishing below 95; the prices say 16.5%. Always take the slope of the actual prices.

### ④ Using the distribution — and the ℚ-versus-ℙ warning

Once you have \(f_{\Q}\), any "what are the odds" question about the expiry price is an integral — and every integral is a strip of call spreads you could actually trade:

$$
\Q\!\left(a < S_T < b\right) \;=\; e^{rT}\left[\frac{\partial C}{\partial K}\Big|_{b} - \frac{\partial C}{\partial K}\Big|_{a}\right]
$$

where \(a < b\) are two price levels and the two slopes are read off the call curve (or approximated by tight call spreads). For XYZ with the skewed smile, \(\Q(95 < S_T < 105) = 0.8352 - 0.1997 = 63.6\%\). A "range binary" paying $100 if XYZ ends between 95 and 105 is therefore worth \(100 \times e^{-rT} \times 0.6355 \approx \$63.34\) under the skew, against \(\$61.46\) with a flat 20% smile — the same ATM vol, a different price, because the shape of the distribution differs.

This is also how exchange-listed **binary** options should be priced: a yes/no contract on "the index finishes above \(K\)" is a digital, so its fair value is the slope of the call curve at \(K\), not \(\N(d_2)\) with some vol. Cboe launched such binary contracts on XSP ("Cboe Predicts") on June 23, 2026 — a live example of a digital sitting next to an ordinary option chain.

> [!KEY] These are prices of probability, not forecasts
> \(f_{\Q}\) is the density under the risk-neutral measure: it is the price of $1 delivered in each state, grossed up by \(e^{rT}\). States where the whole market is losing money — crashes — are states where an extra dollar is worth more to everyone, so insurance against them costs more than the real-world odds alone would justify ([[risk-neutral]]). The fat left tail in \(f_{\Q}\) therefore mixes two things: what the market thinks can happen, and how much it hates it happening. Reading \(\Q(S_T < 90) = 5.2\%\) as "a 5.2% forecast" overstates the real-world crash probability on average; the gap is the [[variance-risk-premium]] (and the reason [[tail-hedging]] has a cost).

Still, the density is useful exactly as it is: to price any European payoff consistently with the market (\(V = e^{-rT}\int g(s)\,f_{\Q}(s)\,\dd s\)), to check a quote sheet for butterfly arbitrage, and to compare how the market's priced fear changes from day to day — for example, how much left-tail mass appears before an event. [[butterfly]] turns the same idea into a trade.

### ⑤ Doing it with real quotes (state of play)

Second derivatives amplify noise. Taking raw bid–ask mids and differencing them strike by strike produces a jagged density that can go negative in places — usually because of the spread, stale quotes or a data error rather than a real arbitrage. In practice:

- **Fit a smooth, arbitrage-free smile first**, then differentiate the fitted prices. SVI and its arbitrage-free conditions (Gatheral and Jacquier, 2014) are one standard choice; the condition that keeps the density non-negative is exactly the butterfly rule. [[surface-calibration]] builds this properly.
- **Use out-of-the-money options on both sides.** OTM puts are more liquid on the downside; convert them to calls with parity ([[put-call-parity]]) or use the put version \(f_{\Q}(K) = e^{rT}\,\partial^2 P/\partial K^2\).
- **The tails beyond the last listed strike are unknown.** Something must be assumed there (a parametric tail), and it matters for tail probabilities.
- **American exercise and dividends** bend single-stock prices; index options such as SPX (European, cash-settled) are the clean case.

Each expiry has its own density. Longer expiries give wider ones — the spread grows roughly with \(\sqrt{T}\) — and, as [[term-structure]] showed, the skew measured in strike dollars fades with tenor, so long-dated densities look more symmetric. An expiry that contains a make-or-break event (a drug trial result, a takeover vote) can even show two humps, one for each outcome, when the market prices a large jump one way or the other rather than a smooth spread of moves. Try the 7-, 30- and 90-day tabs in the demo below.

The same density sits underneath two other lessons. The [[vix]] integrates OTM option prices weighted by \(1/K^2\) — a specific integral against this same density. And every stochastic-volatility or jump model in [[stochastic-vol]] is judged by whether the density it produces matches the one the market prices.

## @analogy
Imagine a **county fair guessing game** about tomorrow's high temperature, run as a market. Stalls sell tickets that pay $1 if the high is **above** 20°C, above 21°C, above 22°C, and so on. The ticket prices fall as the threshold rises. Now look at the gap between two neighboring tickets: "above 21" minus "above 22" is the price of "between 21 and 22". Line up all the gaps and you have a bar chart — the crowd's probability for every one-degree band — even though nobody ever published a forecast.

Call options are those tickets, with one twist: a call pays more the further above the strike you finish, so you need **two** differences instead of one — the first difference (a call spread) gives the "above" ticket, the second (a butterfly) gives the "band" ticket.

Where the analogy breaks: fair-goers bet with money they don't mind losing, so their prices are close to their beliefs. Option markets are full of people **insuring** against disaster, and insurance against bad states costs more than the bare odds. The option-implied chart shows a fatter "cold snap" tail than the forecasters would draw — not because the crowd is dumb, but because it pays extra for protection.

## @misconceptions
- **"The implied distribution is the market's forecast of the stock price."** — It is a risk-neutral density: prices of $1 in each state, which bundle beliefs with risk premia. Crash states are priced richer than their real-world odds on average.
- **"You need a model like Black-Scholes to get probabilities from options."** — Breeden–Litzenberger needs no model: only that prices are arbitrage-free. Black-Scholes is one special case in which the result happens to be lognormal.
- **"With a skew, the probability of finishing above \(K\) is \(\N(d_2)\) using that strike's implied vol."** — The smile slope adds a term \(-\nu_{\text{raw}}\,\partial\sigma/\partial K\). At XYZ's 95 strike the shortcut is off by about four percentage points.
- **"A skew means the market expects the stock to fall."** — The mean of \(f_{\Q}\) is always the forward. Skew moves probability into the far left tail and toward a mild rise; it changes the shape, not the expected price.
- **"A negative density in my data is an arbitrage I can trade."** — Sometimes, but usually it is bid–ask noise, stale quotes or a bad fit. Check with executable prices before believing it.

## @takeaways
- Minus the slope of call prices across strikes is the price of a digital: \(-\partial C/\partial K = e^{-rT}\Q(S_T > K)\).
- The curvature is the risk-neutral density: \(f_{\Q}(K) = e^{rT}\,\partial^2 C/\partial K^2\) (Breeden–Litzenberger), and a butterfly is its finite-difference price.
- No-arbitrage makes butterflies non-negative, so the density is non-negative, integrates to 1 and has mean equal to the forward.
- An equity skew implies a left-skewed density: fatter crash tail, a peak just above the forward; \(\N(d_2)\) at a strike's own vol misreads it.
- The density prices every European payoff consistently, but it is a ℚ-density — beliefs plus risk premia, not a forecast.

## @quiz
1. The 104.5 call costs $0.8214 and the 105.5 call $0.6163 (30 days, \(r = 4\%\)). What does the market's risk-neutral probability that XYZ finishes above about 105 come to?
   - [ ] About 4.7%
   - [x] About 20.5%
   - [ ] About 71%
   - [ ] It can't be known without a volatility model
   > The call spread pays about $1 above 105.5 and costs \(0.2051\); undiscounted, that is about 20.5%. 4.7% is the butterfly (landing *near* 105); 71 cents is the price of the 105 call itself. No model is needed — only the two prices.
2. A long 95/100/105 call butterfly is quoted at a negative price. What does that imply?
   - [ ] The market expects XYZ to land exactly at 100
   - [ ] Volatility is too low for the 100 strike
   - [x] A negative risk-neutral probability near 100 — an arbitrage, since the butterfly's payoff is never negative
   - [ ] Nothing unusual; butterflies often cost less than zero
   > The butterfly's payoff is a non-negative tent, so its price must be at least zero; its price is proportional to the probability of landing near 100. A negative price is either an arbitrage or a data error.
3. Why is the risk-neutral density \(e^{rT}\) times the **second** derivative of the call price in strike, rather than the first?
   - [ ] Because calls have two Greeks that matter, delta and gamma
   - [ ] Because of the discounting
   - [ ] Because the second derivative removes the volatility
   - [x] The first derivative gives the probability of finishing *above* \(K\); differentiating that "above" probability once more gives the probability *at* \(K\)
   > \(-\partial C/\partial K = e^{-rT}\Q(S_T > K)\) is a cumulative probability; its derivative in \(K\) is the density. In trades: a call spread is the "above" bet, a butterfly the "near" bet.
4. With XYZ's skewed smile, how does the implied distribution compare with the flat-20% lognormal?
   - [x] Fatter far-left tail, a bit less probability of a moderate drop, a peak slightly above the forward, same mean
   - [ ] Every downside probability is higher and the mean is lower
   - [ ] It is identical, because the ATM vol is still 20%
   - [ ] It is shifted left as a whole: the market expects XYZ to fall
   > \(\Q(S_T<90)\) rises from 3.1% to 5.2%, \(\Q(S_T<95)\) falls from 17.8% to 16.5%, and the mode moves from about 99.8 to 101.2; the mean stays at the forward 100.33, as no-arbitrage requires.
5. The implied \(\Q(S_T < 90)\) for an index is 5.2%. What is the best interpretation?
   - [ ] The real-world chance of a 10% fall is 5.2%
   - [x] The market charges as if the chance were 5.2%; that price includes a premium for insuring bad states, so the real-world chance is typically lower
   - [ ] The real-world chance is higher, because markets underprice crashes
   - [ ] It is meaningless, because risk-neutral probabilities are only mathematical tricks
   > Risk-neutral probabilities are prices of $1 in each state. Crash states are when money is most valuable, so protection costs more than the raw odds; on average implied tails exceed realized frequencies (the variance risk premium). They are not meaningless: they price every payoff consistently.

## @further
- [Breeden & Litzenberger (1978), Prices of State-Contingent Claims Implicit in Option Prices](https://doi.org/10.1086/296025) — the original result: the second strike derivative of call prices is the state-price density.
- [Gatheral & Jacquier (2014), Arbitrage-free SVI volatility surfaces](https://arxiv.org/abs/1204.0646) — how to fit a smile whose implied density is non-negative everywhere.
- [Carr & Wu (2009), Variance Risk Premiums](https://academic.oup.com/rfs/article-abstract/22/3/1311/1581057) — evidence that option-implied variance exceeds realized variance on average, the ℚ-versus-ℙ gap in numbers.
- [Risk-neutral measure (Wikipedia)](https://en.wikipedia.org/wiki/Risk-neutral_measure) — the measure behind \(f_{\Q}\) and why it differs from real-world probability.
- [Binary option (Wikipedia)](https://en.wikipedia.org/wiki/Binary_option) — digitals and their relation to call spreads.

## @next
If the OTM options across all strikes encode the whole distribution, one particular weighted sum of them measures its total **variance** — with no model at all. Wall Street publishes that number every few seconds for the S&P 500. What exactly is the VIX, and what can you actually trade on it?
