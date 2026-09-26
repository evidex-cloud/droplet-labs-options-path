---
id: higher-order-greeks
prereqs: greeks-map, delta, gamma, theta, vega, rho-carry
demo: higher-order-greeks
---

# Second-Order & Portfolio Greeks: Vanna, Volga, Charm

## @hook
On Friday Kai's collar behaves like 61 shares of XYZ. On Monday XYZ is still at $100 and nothing has been traded — but after a weekend and a 5-point rise in implied vol, the same collar behaves like 54 shares. The Greeks themselves moved. This lesson measures how they move, then folds a whole position into the one picture risk managers actually trust: a spot-by-vol scenario grid.

## @bridge
[[greeks-map]] wrote an option's P&L as a Taylor expansion, and the last five lessons took it apart one Greek at a time: [[delta]] and [[gamma]] for the stock price, [[theta]] for the clock, [[vega]] for implied vol, [[rho-carry]] for rates and dividends. Each was measured with everything else frozen. This lesson answers the question that is left: **what happens when two things move at once, and how do you add up the risk of a whole position?** It builds Idea ④ — risk split into measurable parts — and closes the Principles tier.

## @intuition
Take one leg of Kai's collar: the **short 30-day XYZ 105 call** Kai sold for $0.71. With XYZ at $100 and IV at 20%, its delta is **0.222**: the call moves like 22 shares per contract.

Now change something that is *not* the stock price.

- **Implied vol rises 5 points** (20% → 25%), XYZ unchanged. The call's delta becomes **0.275**. More volatility makes a $105 finish more plausible, so the call acts more like stock. The change per vol point is called **vanna**: about \(+0.012\) of delta per point for this call.
- **Three days pass** (Friday to Monday), XYZ and IV unchanged. The delta becomes **0.207**. Less time left makes the $105 finish less plausible, so the call acts less like stock. The change per day is called **charm**: about \(-0.005\) of delta per day.

Nothing traded, yet the number of shares Kai would need to hedge this one contract changed from 22 to about 27 in the first case and to about 21 in the second. These are **second-order Greeks**: sensitivities of the Greeks themselves.

<figure>
<svg viewBox="0 0 660 270" role="img" aria-label="Map of second-order Greeks: how delta, vega and gamma change with spot, volatility and time">
<rect x="130" y="16" width="170" height="36" rx="6" class="fx-box2"/>
<rect x="310" y="16" width="170" height="36" rx="6" class="fx-box2"/>
<rect x="490" y="16" width="160" height="36" rx="6" class="fx-box2"/>
<text x="215" y="39" text-anchor="middle" class="fx-t-b">spot S moves</text>
<text x="395" y="39" text-anchor="middle" class="fx-t-b">implied vol σ moves</text>
<text x="570" y="39" text-anchor="middle" class="fx-t-b">time t passes</text>
<rect x="10" y="62" width="110" height="62" rx="6" class="fx-hl"/>
<text x="65" y="90" text-anchor="middle" class="fx-t-b">delta Δ</text>
<text x="65" y="110" text-anchor="middle" class="fx-t-sm">shares-equivalent</text>
<rect x="10" y="134" width="110" height="62" rx="6" class="fx-blue"/>
<text x="65" y="162" text-anchor="middle" class="fx-t-b">vega ν</text>
<text x="65" y="182" text-anchor="middle" class="fx-t-sm">$ per vol point</text>
<rect x="10" y="206" width="110" height="56" rx="6" class="fx-box"/>
<text x="65" y="231" text-anchor="middle" class="fx-t-b">gamma Γ</text>
<text x="65" y="250" text-anchor="middle" class="fx-t-sm">Δ per $1</text>
<rect x="130" y="62" width="170" height="62" rx="6" class="fx-box"/>
<text x="215" y="88" text-anchor="middle" class="fx-t-b">gamma</text>
<text x="215" y="108" text-anchor="middle" class="fx-t-sm">∂Δ/∂S</text>
<rect x="310" y="62" width="170" height="62" rx="6" class="fx-ok"/>
<text x="395" y="88" text-anchor="middle" class="fx-t-b">vanna</text>
<text x="395" y="108" text-anchor="middle" class="fx-t-sm">∂Δ/∂σ</text>
<rect x="490" y="62" width="160" height="62" rx="6" class="fx-ok"/>
<text x="570" y="88" text-anchor="middle" class="fx-t-b">charm</text>
<text x="570" y="108" text-anchor="middle" class="fx-t-sm">∂Δ/∂t</text>
<rect x="130" y="134" width="170" height="62" rx="6" class="fx-ok"/>
<text x="215" y="160" text-anchor="middle" class="fx-t-b">vanna (again)</text>
<text x="215" y="180" text-anchor="middle" class="fx-t-sm">∂ν/∂S = ∂Δ/∂σ</text>
<rect x="310" y="134" width="170" height="62" rx="6" class="fx-ok"/>
<text x="395" y="160" text-anchor="middle" class="fx-t-b">volga (vomma)</text>
<text x="395" y="180" text-anchor="middle" class="fx-t-sm">∂ν/∂σ</text>
<rect x="490" y="134" width="160" height="62" rx="6" class="fx-box"/>
<text x="570" y="160" text-anchor="middle" class="fx-t">veta</text>
<text x="570" y="180" text-anchor="middle" class="fx-t-sm">∂ν/∂t</text>
<rect x="130" y="206" width="170" height="56" rx="6" class="fx-box"/>
<text x="215" y="230" text-anchor="middle" class="fx-t">speed</text>
<text x="215" y="249" text-anchor="middle" class="fx-t-sm">∂Γ/∂S</text>
<rect x="310" y="206" width="170" height="56" rx="6" class="fx-box"/>
<text x="395" y="230" text-anchor="middle" class="fx-t">zomma</text>
<text x="395" y="249" text-anchor="middle" class="fx-t-sm">∂Γ/∂σ</text>
<rect x="490" y="206" width="160" height="56" rx="6" class="fx-box"/>
<text x="570" y="230" text-anchor="middle" class="fx-t">color</text>
<text x="570" y="249" text-anchor="middle" class="fx-t-sm">∂Γ/∂t</text>
</svg>
<figcaption>Figure 1 · The Greeks of the Greeks. Each row is a first-order Greek, each column the thing that moves. Gamma you already know (how delta changes with spot). The green cells — vanna, volga and charm — are the three that change hedges and P&L most in practice; vanna appears twice because \(\partial\Delta/\partial\sigma\) and \(\partial\nu/\partial S\) are the same number.</figcaption>
</figure>

The little demo below shows the delta of an option drifting while the stock stands still: move the calendar forward, move IV, and compare the estimate from charm and vanna with the exact delta.

::demo[higher-order-greeks-charm]

> [!THINK] Kai's other leg is the long 30-day 95 put, delta −0.163. IV rises 5 points with XYZ unchanged. Does the put's delta move toward 0 or away from it?
> Think about what more volatility does to an out-of-the-money option.
> ---
> Away from 0: it goes to about −0.213. More vol makes a finish below $95 more plausible, so the put behaves more like a short stock position. The rule of thumb: **raising vol pulls every delta toward the at-the-money value** (about ±0.5) — out-of-the-money deltas grow, in-the-money deltas shrink. Passing time does the opposite: it pushes deltas toward 0 or ±1.

Second-order Greeks are small numbers, so why care? Because a position is a sum of many options, and because the big days in markets are days when **several things move at once** — the stock falls *and* implied vol jumps. The cross terms are exactly where first-order bookkeeping goes wrong. The last step of this lesson is to stop estimating and just reprice the whole position on a grid of scenarios.

We'll take it in five parts:

- **① Vanna: delta meets volatility**
- **② Volga: the convexity of vega**
- **③ Charm, speed and color: the Greeks and the clock**
- **④ Portfolio Greeks and the second-order expansion**
- **⑤ The spot × vol grid, and why dealers watch vanna and charm**

## @mechanics
### ① Vanna: delta meets volatility

Vanna is the cross derivative of the option price with respect to spot and volatility. Order does not matter, so it has two readings — how delta changes with vol, and how vega changes with spot:

$$
\text{vanna} = \frac{\partial \Delta}{\partial \sigma} = \frac{\partial \nu}{\partial S} = -\,e^{-qT}\,\varphi(d_1)\,\frac{d_2}{\sigma}
$$

where \(\varphi(d_1)\) is the normal density at \(d_1\), \(d_2 = d_1 - \sigma\sqrt{T}\) and \(\sigma\) is the volatility. The formula is the same for calls and puts (they differ in delta by a constant). Its sign comes from \(d_2\): when the option is out of the money on the call side (\(d_2 < 0\)), vanna is positive; on the other side it is negative; near the money it is close to zero.

> [!EXAMPLE] Vanna of Kai's short 105 call
> For the 30-day 105 call, \(d_1 = -0.765\), \(d_2 = -0.822\), \(\varphi(d_1) = 0.2978\):
> $$
> \text{vanna} = -\,0.2978 \times \frac{-0.822}{0.20} = 1.224
> $$
> That is per 1.00 of σ. Per vol point: \(0.0122\). So a 5-point rise in IV adds about \(5 \times 0.0122 = 0.061\) to delta: \(0.222 \to 0.283\) estimated, \(0.275\) exact. Read the other way: a $1 rise in XYZ raises this call's vega by about \(\$0.012\) per point, from 0.085 to about 0.097.

<figure>
<svg viewBox="0 0 640 440" role="img" aria-label="Vanna and volga of a 30-day 100-strike call against the stock price">
<line x1="60" y1="63" x2="600" y2="63" class="fx-grid"/>
<line x1="60" y1="177" x2="600" y2="177" class="fx-grid"/>
<line x1="60" y1="120" x2="610" y2="120" class="fx-axis"/>
<line x1="60" y1="30" x2="60" y2="205" class="fx-axis"/>
<line x1="330" y1="30" x2="330" y2="205" class="fx-line-muted fx-dash"/>
<polygon points="60,120 71,119 83,119 94,118 105,117 116,115 128,113 139,109 150,105 161,99 172,92 184,84 195,76 206,67 218,59 229,53 240,48 251,47 263,49 274,54 285,64 296,76 307,90 319,107 330,120" class="fx-area-ok"/>
<polygon points="330,120 341,139 353,154 364,166 375,175 386,181 398,185 409,185 420,183 431,179 442,174 454,168 465,162 476,155 488,150 499,144 510,139 521,135 533,132 544,129 555,127 566,125 578,124 589,123 600,122 600,120" class="fx-area-bad"/>
<polyline points="60,120 71,119 83,119 94,118 105,117 116,115 128,113 139,109 150,105 161,99 172,92 184,84 195,76 206,67 218,59 229,53 240,48 251,47 263,49 274,54 285,64 296,76 307,90 319,107 330,123 341,139 353,154 364,166 375,175 386,181 398,185 409,185 420,183 431,179 442,174 454,168 465,162 476,155 488,150 499,144 510,139 521,135 533,132 544,129 555,127 566,125 578,124 589,123 600,122" class="fx-line-hl"/>
<text x="52" y="67" text-anchor="end" class="fx-t-sm">+0.01</text>
<text x="52" y="124" text-anchor="end" class="fx-t-sm">0</text>
<text x="52" y="181" text-anchor="end" class="fx-t-sm">−0.01</text>
<text x="70" y="26" class="fx-t-b">vanna (Δ per vol point)</text>
<text x="150" y="150" class="fx-t-ok">S below K: vol up → Δ up</text>
<text x="400" y="80" class="fx-t-bad">S above K: vol up → Δ down</text>
<line x1="60" y1="280" x2="600" y2="280" class="fx-grid"/>
<line x1="60" y1="340" x2="600" y2="340" class="fx-grid"/>
<line x1="60" y1="400" x2="610" y2="400" class="fx-axis"/>
<line x1="60" y1="245" x2="60" y2="400" class="fx-axis"/>
<line x1="330" y1="245" x2="330" y2="286" class="fx-line-muted fx-dash"/>
<line x1="330" y1="306" x2="330" y2="400" class="fx-line-muted fx-dash"/>
<polyline points="60,399 71,397 83,396 94,393 105,388 116,382 128,374 139,364 150,352 161,337 172,322 184,308 195,294 206,285 218,280 229,280 240,287 251,300 263,318 274,338 285,359 296,377 307,391 319,399 330,400 341,393 353,381 364,363 375,344 386,323 398,304 409,289 420,277 431,271 442,269 454,272 465,279 476,289 488,300 499,313 510,326 521,338 533,349 544,359 555,368 566,375 578,381 589,386 600,390" class="fx-line-blue"/>
<text x="52" y="284" text-anchor="end" class="fx-t-sm">0.004</text>
<text x="52" y="344" text-anchor="end" class="fx-t-sm">0.002</text>
<text x="52" y="404" text-anchor="end" class="fx-t-sm">0</text>
<text x="70" y="244" class="fx-t-b">volga (vega per vol point, per vol point)</text>
<text x="330" y="418" text-anchor="middle" class="fx-t-b">K = 100</text>
<text x="195" y="418" text-anchor="middle" class="fx-t-sm">90</text>
<text x="465" y="418" text-anchor="middle" class="fx-t-sm">110</text>
<text x="600" y="436" text-anchor="end" class="fx-t-sm">stock price S (30-day 100 call, σ 20%)</text>
<text x="330" y="300" text-anchor="middle" class="fx-t-sm">≈ 0 at the money ↓</text>
</svg>
<figcaption>Figure 2 · Top: vanna changes sign at the strike — below it, more vol raises the call's delta; above it, more vol lowers it. Bottom: volga is almost zero at the money and positive in both wings, peaking roughly one standard deviation away. At-the-money options are "vega only"; wing options carry curvature in vol.</figcaption>
</figure>

Vanna matters most where spot and implied vol move **together**. In equity indexes they usually move in opposite directions: prices fall, IV rises ([[smile-skew]]). A position with large vanna therefore sees its delta shift exactly when the market is moving — the hedge you set is wrong precisely when it is being tested. Risk reversals (long a call, short a put, or the reverse) are nearly pure vanna-and-skew trades ([[ratios-risk-reversals]]).

### ② Volga: the convexity of vega

Volga (also called vomma) is the second derivative of the price with respect to volatility — how fast vega itself changes as IV moves:

$$
\text{volga} = \frac{\partial \nu}{\partial \sigma} = \nu\,\frac{d_1\,d_2}{\sigma}
$$

where \(\nu\) is the raw vega and \(d_1, d_2\) are the usual Black-Scholes terms. At the money \(d_1 d_2 \approx 0\), so volga is about zero: this is why the at-the-money price in [[vega]] was a straight line in σ. Away from the money \(d_1\) and \(d_2\) have the same sign, their product is positive, and **long out-of-the-money options have positive volga** — convexity in volatility, the vol-space cousin of gamma.

> [!EXAMPLE] Volga of the 105 call, and the short strangle's hidden extra
> The 105 call has raw vega 8.536, so volga \(= 8.536 \times \dfrac{(-0.765)(-0.822)}{0.20} = 26.84\), i.e. \(0.0027\) of vega per vol point. At IV 25% its vega is about 0.096 instead of 0.085 — the option gets *more* sensitive to vol as vol rises.
> A short 95/105 strangle has vega \(-\$15.61\) per contract. If IV rises 10 points, vega alone predicts \(-\$156\); the exact loss is \(\$177\), and at +20 points it is \(\$378\) against \(\$312\) predicted. The gap is volga, and it always works against the seller of wings.

Volga is why people talk about **vol of vol**. If implied vol itself is jumpy, owning volga (long wings) is valuable and wing options are priced higher than Black-Scholes with one flat σ would say. That is one of the forces behind the smile, and models that let volatility move — [[stochastic-vol]] — price it explicitly.

### ③ Charm, speed and color: the Greeks and the clock

**Charm** is the rate at which delta changes as time passes, with spot and vol fixed: \(\text{charm} = \partial\Delta/\partial t\). Time does the opposite of vol: it pulls out-of-the-money deltas toward 0 and in-the-money deltas toward ±1, because each passing day makes the final answer more certain.

| Kai's legs, XYZ $100, IV 20% | Delta today | Charm per day | Delta after a 3-day weekend |
|---|---|---|---|
| 30-day 105 call | 0.222 | −0.0047 | 0.207 |
| 30-day 95 put | −0.163 | +0.0033 | −0.153 |
| 30-day 100 call (ATM) | 0.534 | −0.0006 | 0.533 |
| 7-day 105 call | 0.043 | −0.0117 | — |

Charm is small for a month-out option and grows as expiry approaches: the 105 call loses 0.005 of delta a day with 30 days left and 0.012 a day with 7 days left. On an expiry Friday, out-of-the-money deltas collapse to zero within hours ([[zero-dte]] lives there).

Two more Greeks round out the family, briefly:

- **Speed** \(= \partial\Gamma/\partial S\): how gamma changes with spot. The 105 call's gamma is 0.052 at S = 100 and 0.058 at S = 101 — rallies toward a short strike *add* gamma to the short.
- **Color** \(= \partial\Gamma/\partial t\): how gamma changes with time. The at-the-money gamma is 0.144 with 7 days left, 0.156 with 6 days, and jumps from 0.269 to 0.381 between the last two days. This is the arithmetic behind "gamma explodes near expiry" in [[gamma]].

> [!KAI] Kai's collar over a weekend
> Per contract the collar is +100 shares, long one 95 put and short one 105 call. On Friday its delta is \(100 - 16.3 - 22.2 = 61.4\) shares. Its vanna is \(-2.4\) shares per vol point and its charm \(+0.8\) shares per day. Over the weekend IV rises 5 points on sector news; XYZ stays at $100. Estimate: \(61.4 - 5 \times 2.4 + 3 \times 0.8 \approx 52\) shares. Exact: **53.6**. Kai has not traded, but now owns about 8 fewer "effective shares" of XYZ than on Friday — the collar quietly became more defensive.

### ④ Portfolio Greeks and the second-order expansion

Greeks **add**. For a position, multiply each leg's Greek by its signed quantity (negative for shorts) and by the multiplier, then sum:

$$
G_{\text{book}} = \sum_i n_i \times 100 \times G_i
$$

where \(n_i\) is the number of contracts of leg \(i\) (stock counts as delta 1 per share) and \(G_i\) is any Greek of that leg per share. With the book's Greeks in hand, the second-order version of the [[greeks-map]] expansion is

$$
\Delta\Pi \approx \Delta\,\dd S + \tfrac12\Gamma\,\dd S^2 + \nu\,\dd\sigma + \Theta\,\dd t + \text{vanna}\,\dd S\,\dd\sigma + \tfrac12\,\text{volga}\,\dd\sigma^2
$$

where \(\Delta\Pi\) is the change in the position's value, \(\dd S\) the move in dollars, \(\dd\sigma\) the move in IV (in vol points, with vanna and volga in matching units) and \(\dd t\) the time passed in days.

| Kai's collar, per contract | Delta | Gamma | Vega | Theta/day | Vanna | Charm/day |
|---|---|---|---|---|---|---|
| +100 shares | +100 | 0 | 0 | 0 | 0 | 0 |
| long 95 put | −16.3 | +4.30 | +$7.07 | −$2.17 | −1.14 | +0.33 |
| short 105 call | −22.2 | −5.19 | −$8.54 | +$3.08 | −1.22 | +0.46 |
| **collar** | **+61.4** | **−0.89** | **−$1.46** | **+$0.91** | **−2.36** | **+0.80** |

(Delta, gamma, vanna and charm in shares; vanna per vol point.)

> [!EXAMPLE] XYZ +$5 and IV +5 points, one day later
> The collar's terms, per contract: delta \(61.4 \times 5 = +\$307.2\); gamma \(\tfrac12 \times (-0.89) \times 25 = -\$11.1\); vega \(-1.46 \times 5 = -\$7.3\); theta \(+\$0.9\); vanna \(-2.36 \times 5 \times 5 = -\$59.1\); volga \(+\$0.6\).
> $$
> \underbrace{307.2 - 7.3 + 0.9}_{\text{first order: } 300.8} \;\underbrace{-\,11.1 - 59.1 + 0.6}_{\text{second order: } -69.6} = \$231.2
> $$
> Full repricing gives \(\$231.1\). The first-order estimate was off by \(\$70\), and **vanna** was most of the error: the rally and the vol rise together pushed the short call toward the money.

The expansion is excellent for moves like this one. For big moves it breaks down: for XYZ −10% and IV −10 points the second-order estimate for the collar is \(-\$877\) against an exact \(-\$506\), because gamma, vega and vanna all change a lot along the way. That is why risk systems do not rely on Greeks for stress tests. They **reprice everything** at each scenario.

### ⑤ The spot × vol grid, and why dealers watch vanna and charm

A **scenario grid** lays out spot moves along one axis and implied-vol shifts along the other, reprices every leg at each point after a chosen horizon, and shows the P&L. No Taylor series, no missed cross terms: every combination is computed exactly. Here is a short 95/105 strangle (one contract of each), one day later:

<figure>
<svg viewBox="0 0 640 318" role="img" aria-label="Spot by volatility P&L grid for a short 95/105 strangle one day later">
<text x="355" y="16" text-anchor="middle" class="fx-t-b">XYZ price one day later</text>
<text x="145" y="34" text-anchor="middle" class="fx-t-sm">90</text>
<text x="215" y="34" text-anchor="middle" class="fx-t-sm">95</text>
<text x="285" y="34" text-anchor="middle" class="fx-t-sm">98</text>
<text x="355" y="34" text-anchor="middle" class="fx-t-b">100</text>
<text x="425" y="34" text-anchor="middle" class="fx-t-sm">102</text>
<text x="495" y="34" text-anchor="middle" class="fx-t-sm">105</text>
<text x="565" y="34" text-anchor="middle" class="fx-t-sm">110</text>
<text x="100" y="64" text-anchor="end" class="fx-t-sm">IV +10</text>
<text x="100" y="104" text-anchor="end" class="fx-t-sm">IV +5</text>
<text x="100" y="144" text-anchor="end" class="fx-t-b">IV ±0</text>
<text x="100" y="184" text-anchor="end" class="fx-t-sm">IV −5</text>
<text x="100" y="224" text-anchor="end" class="fx-t-sm">IV −10</text>
<rect x="111" y="41" width="68" height="38" rx="2" class="fx-fill-red"/><text x="145" y="64" text-anchor="middle" class="fx-t-inv">−491</text>
<rect x="181" y="41" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="215" y="64" text-anchor="middle" class="fx-t">−236</text>
<rect x="251" y="41" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="285" y="64" text-anchor="middle" class="fx-t">−171</text>
<rect x="321" y="41" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="355" y="64" text-anchor="middle" class="fx-t">−168</text>
<rect x="391" y="41" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="425" y="64" text-anchor="middle" class="fx-t">−196</text>
<rect x="461" y="41" width="68" height="38" rx="2" class="fx-fill-red"/><text x="495" y="64" text-anchor="middle" class="fx-t-inv">−294</text>
<rect x="531" y="41" width="68" height="38" rx="2" class="fx-fill-red"/><text x="565" y="64" text-anchor="middle" class="fx-t-inv">−580</text>
<rect x="111" y="81" width="68" height="38" rx="2" class="fx-fill-red"/><text x="145" y="104" text-anchor="middle" class="fx-t-inv">−441</text>
<rect x="181" y="81" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="215" y="104" text-anchor="middle" class="fx-t">−157</text>
<rect x="251" y="81" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="285" y="104" text-anchor="middle" class="fx-t">−82</text>
<rect x="321" y="81" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="355" y="104" text-anchor="middle" class="fx-t">−77</text>
<rect x="391" y="81" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="425" y="104" text-anchor="middle" class="fx-t">−106</text>
<rect x="461" y="81" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="495" y="104" text-anchor="middle" class="fx-t">−212</text>
<rect x="531" y="81" width="68" height="38" rx="2" class="fx-fill-red"/><text x="565" y="104" text-anchor="middle" class="fx-t-inv">−523</text>
<rect x="111" y="121" width="68" height="38" rx="2" class="fx-fill-red"/><text x="145" y="144" text-anchor="middle" class="fx-t-inv">−400</text>
<rect x="181" y="121" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="215" y="144" text-anchor="middle" class="fx-t">−86</text>
<rect x="251" y="121" width="68" height="38" rx="2" class="fx-area-bad"/><text x="285" y="144" text-anchor="middle" class="fx-t">−2</text>
<rect x="321" y="121" width="68" height="38" rx="2" class="fx-area-ok"/><text x="355" y="144" text-anchor="middle" class="fx-t-b">+5</text>
<rect x="391" y="121" width="68" height="38" rx="2" class="fx-area-bad"/><text x="425" y="144" text-anchor="middle" class="fx-t">−25</text>
<rect x="461" y="121" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="495" y="144" text-anchor="middle" class="fx-t">−138</text>
<rect x="531" y="121" width="68" height="38" rx="2" class="fx-fill-red"/><text x="565" y="144" text-anchor="middle" class="fx-t-inv">−475</text>
<rect x="111" y="161" width="68" height="38" rx="2" class="fx-fill-red"/><text x="145" y="184" text-anchor="middle" class="fx-t-inv">−369</text>
<rect x="181" y="161" width="68" height="38" rx="2" class="fx-area-bad"/><text x="215" y="184" text-anchor="middle" class="fx-t">−25</text>
<rect x="251" y="161" width="68" height="38" rx="2" class="fx-fill-green" fill-opacity="0.4"/><text x="285" y="184" text-anchor="middle" class="fx-t">+63</text>
<rect x="321" y="161" width="68" height="38" rx="2" class="fx-fill-green" fill-opacity="0.4"/><text x="355" y="184" text-anchor="middle" class="fx-t">+72</text>
<rect x="391" y="161" width="68" height="38" rx="2" class="fx-area-ok"/><text x="425" y="184" text-anchor="middle" class="fx-t">+43</text>
<rect x="461" y="161" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="495" y="184" text-anchor="middle" class="fx-t">−73</text>
<rect x="531" y="161" width="68" height="38" rx="2" class="fx-fill-red"/><text x="565" y="184" text-anchor="middle" class="fx-t-inv">−438</text>
<rect x="111" y="201" width="68" height="38" rx="2" class="fx-fill-red"/><text x="145" y="224" text-anchor="middle" class="fx-t-inv">−351</text>
<rect x="181" y="201" width="68" height="38" rx="2" class="fx-area-ok"/><text x="215" y="224" text-anchor="middle" class="fx-t">+30</text>
<rect x="251" y="201" width="68" height="38" rx="2" class="fx-fill-green" fill-opacity="0.4"/><text x="285" y="224" text-anchor="middle" class="fx-t">+106</text>
<rect x="321" y="201" width="68" height="38" rx="2" class="fx-fill-green" fill-opacity="0.4"/><text x="355" y="224" text-anchor="middle" class="fx-t">+113</text>
<rect x="391" y="201" width="68" height="38" rx="2" class="fx-fill-green" fill-opacity="0.4"/><text x="425" y="224" text-anchor="middle" class="fx-t">+93</text>
<rect x="461" y="201" width="68" height="38" rx="2" class="fx-area-bad"/><text x="495" y="224" text-anchor="middle" class="fx-t">−13</text>
<rect x="531" y="201" width="68" height="38" rx="2" class="fx-fill-red"/><text x="565" y="224" text-anchor="middle" class="fx-t-inv">−416</text>
<rect x="320" y="120" width="70" height="40" rx="3" class="fx-line-thick"/>
<text x="182" y="265" text-anchor="end" class="fx-t-sm">shade = size:</text>
<rect x="190" y="255" width="22" height="13" rx="2" class="fx-area-bad"/><text x="218" y="265" class="fx-t-sm">under $50</text>
<rect x="305" y="255" width="22" height="13" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="333" y="265" class="fx-t-sm">$50–250</text>
<rect x="420" y="255" width="22" height="13" rx="2" class="fx-fill-red"/><text x="448" y="265" class="fx-t-sm">over $250</text>
<text x="20" y="290" class="fx-t-sm">P&amp;L in $ per short strangle: one 95 put + one 105 call sold for $122, 30 days to expiry, σ 20%, r 4%.</text>
<text x="20" y="308" class="fx-t-sm">The outlined cell is “nothing happens”: one day of theta, +$5.</text>
</svg>
<figcaption>Figure 3 · A spot × vol grid for a short strangle. The only green is a small island around "nothing happens, vol falls"; every edge is red, and the worst cells are the corners where the stock moves a lot and vol rises — the combination that happens in real selloffs. Reading this one picture tells you more about the position than any single Greek.</figcaption>
</figure>

For Kai's collar the same grid carries a subtler message. Three cells per row are enough to see it:

| Kai's collar, P&L per contract after one day | XYZ $90 | XYZ $100 | XYZ $110 |
|---|---|---|---|
| IV −10 points | −$506 | +$17 | +$482 |
| IV unchanged | −$458 | +$1 | +$425 |
| IV +10 points | −$391 | −$11 | +$344 |

On the downside, higher vol **helps** the collar (the long put comes to life); on the upside, higher vol **hurts** it (the short call comes to life). The sign of the vol effect flips with the direction of the stock — that is vanna, read straight off the grid.

**Why dealers care.** A market maker who is net short options to customers carries the opposite of the customers' Greeks, and hedges delta continuously ([[delta-hedging]]). Charm means that hedge must change every day even if nothing moves — and on a monthly expiration, when large amounts of open interest expire, those daily adjustments can be large. Vanna means a move in implied vol forces hedge trades too: if IV collapses after an event, dealers' hedges shift in a predictable direction. Market commentators call these **vanna and charm flows** and link them to drifts around option expirations. The mechanism is real; how much it moves prices is **debated**, because dealers' true positions are not public and estimates rely on assumptions about who is long and who is short ([[dealer-gamma]]).

> [!WARN] Second-order Greeks are local, too
> Vanna, volga and charm are measured at today's spot, vol and date, just like delta. They improve estimates for moderate moves, and they fail for large ones (the collar's −10%/−10-point cell above). For decisions that matter — margin, stress tests, position limits — use a full-revaluation grid ([[portfolio-risk]]) and treat the Greeks as the explanation of *why* each cell looks the way it does.

This closes the Principles tier. You can now price an option ([[black-scholes]]), read its volatility ([[implied-vol]]) and break its risk into first- and second-order parts, one leg at a time or for a whole book. The next tier uses all of it to build strategies, starting from the simplest: buying a call or a put, and choosing its strike and expiry ([[long-options]]).

## @analogy
Think of driving a car on a winding mountain road.

- **Delta** is your speed, **gamma** is how hard you are pressing the accelerator — how fast the speed changes as the road (the stock price) unfolds.
- **Vanna** is what happens to your speed when **the weather changes**. Rain (higher vol) makes the same pedal position produce a different speed on the uphill and the downhill — just as higher IV raises the delta of an out-of-the-money call and lowers the delta of an in-the-money one.
- **Charm** is the **clock**: even with your foot perfectly still, the car slows on its own as the journey nears its end — out-of-the-money deltas bleed toward zero as expiry approaches.
- **Volga** is how the car's sensitivity to weather itself changes as the storm gets worse: a light drizzle hardly matters, but in a downpour each extra millimeter of rain changes the handling more.
- The **scenario grid** is a test track. Instead of predicting from dials how the car will behave in "heavy rain plus a sharp bend", you drive it through every combination of rain and bends and write down what happened.

Where the analogy breaks: a driver chooses the pedal; an option holder does not choose the Greeks. They are set by the contract, the market price and the calendar — all you can choose is which options to hold and how to hedge them.

## @misconceptions
- **"Second-order Greeks are academic; only market makers need them."** — Anyone holding options through a weekend or an IV move is exposed. Kai's collar, a simple retail position, lost about 8 shares of effective exposure over one weekend without a single trade.
- **"If my position is delta-neutral, spot moves can't hurt me."** — Delta-neutral only holds at today's spot, vol and date. Gamma changes delta when spot moves, vanna when vol moves, charm when time passes — and on the days that matter all three move together.
- **"Vanna and volga are about the same, both are 'vega stuff'."** — Vanna links spot and vol: it changes your delta when IV moves (and your vega when spot moves). Volga links vol with itself: it changes your vega when IV moves. A risk reversal is mostly vanna; a long strangle is mostly volga.
- **"A second-order Taylor expansion is accurate enough for stress tests."** — It is good for moderate moves (XYZ +5%, IV +5: \(\$231.2\) vs \(\$231.1\) exact) and badly wrong for large ones (XYZ −10%, IV −10: \(-\$877\) vs \(-\$506\)). Stress tests reprice.
- **"Vanna and charm flows explain every market move near expiry."** — The hedging mechanism is real, but dealer positions are estimated, not observed, and the size of the effect is contested. Treat such narratives as hypotheses, not facts.

## @takeaways
- Second-order Greeks measure how the first-order Greeks move: vanna (\(\partial\Delta/\partial\sigma\)), volga (\(\partial\nu/\partial\sigma\)) and charm (\(\partial\Delta/\partial t\)) matter most; speed and color describe gamma's drift.
- Raising vol pulls deltas toward the at-the-money value; passing time pushes them toward 0 or ±1 — so a hedge drifts even when nothing trades.
- Volga is near zero at the money and positive in the wings: long out-of-the-money options own convexity in volatility, and sellers of wings pay for it when IV jumps.
- Greeks add across a book; the second-order expansion adds cross terms like \(\text{vanna}\,\dd S\,\dd\sigma\) that often carry most of a first-order estimate's error.
- For real risk decisions, reprice the whole position on a spot × vol grid; use the Greeks to explain the grid, not to replace it.

## @quiz
1. Kai's short 30-day 105 call has delta 0.222 and vanna +0.012 per vol point. IV rises 5 points; XYZ does not move. What happens to the delta Kai is short?
   - [ ] It falls to about 0.16, because more vol lowers every delta
   - [ ] It stays at 0.222, because the stock didn't move
   - [x] It rises to about 0.28 (exact 0.275), so the short call behaves like more shares
   - [ ] It jumps to 0.5, because vol makes every option at-the-money
   > \(0.222 + 5 \times 0.012 \approx 0.28\). Higher vol makes the $105 finish more plausible, so an out-of-the-money call behaves more like stock. Vol pulls deltas toward the at-the-money value, not all the way to 0.5.
2. Which option has the largest volga (vega's sensitivity to IV)?
   - [x] a 30-day call about one standard deviation out of the money
   - [ ] a 30-day at-the-money call
   - [ ] a 30-day call so deep in the money it has delta 0.99
   - [ ] a share of stock
   > Volga \(= \nu\,d_1 d_2/\sigma\) is near zero at the money (\(d_1 d_2 \approx 0\)) and tiny where vega itself vanishes; it peaks in the wings, roughly one standard deviation away. Stock has no vega at all.
3. On Friday, a delta-hedged book is short out-of-the-money calls. By Monday nothing has traded and spot and IV are unchanged. What does charm do to the hedge?
   - [ ] nothing: with spot and IV unchanged, the hedge stays correct
   - [ ] the book becomes shorter delta, so the dealer must buy stock
   - [ ] only gamma changes, delta cannot change without a price move
   - [x] the short calls' deltas decay toward 0, so the book becomes longer delta and the dealer must sell stock to stay flat
   > Time pushes out-of-the-money deltas toward zero. The book is short those deltas, so as they shrink the book's net delta rises (it was hedged with long stock), and the hedge must sell shares. That daily re-hedging is what "charm flow" refers to.
4. For Kai's collar, XYZ rises $5 and IV rises 5 points over one day. The first-order Greek estimate is +$300.8; the exact P&L is +$231.1. Which term explains most of the gap?
   - [ ] theta, because a day passed
   - [x] vanna, because the rally and the vol rise together pushed the short 105 call toward the money
   - [ ] rho, because the collar has long-dated options
   - [ ] volga, because IV rose
   > The cross term \(\text{vanna}\,\dd S\,\dd\sigma = -2.36 \times 5 \times 5 \approx -\$59\) is the biggest correction; gamma adds about \(-\$11\), volga about \(+\$0.6\). Together: \(\$231.2\).
5. Why do risk managers use a full-revaluation spot × vol grid rather than a second-order Greek expansion for stress tests?
   - [ ] because Greeks cannot be added across positions
   - [ ] because grids ignore the cross effects that confuse the Greeks
   - [x] because Greeks are local: for large moves gamma, vega and vanna change along the way and the expansion can be far off
   - [ ] because regulators ban the use of Greeks
   > Greeks do add, and a grid captures cross effects exactly rather than ignoring them. The problem is locality: the collar's second-order estimate for −10% and −10 vol points is \(-\$877\) against an exact \(-\$506\). Repricing every cell avoids that.

## @further
- [Greeks (finance) — Wikipedia](https://en.wikipedia.org/wiki/Greeks_(finance)) — definitions and Black-Scholes formulas for vanna, volga, charm, speed, color and the rest.
- [Cboe — 0DTEs decoded: positioning trends and market impact](https://www.cboe.com/insights/posts/0-dt-es-decoded-positioning-trends-and-market-impact) — an exchange's (interested-party) estimate of how much option hedging flows actually weigh in daily S&P 500 liquidity.
- [Dim, Eraker & Vilkov — 0DTEs: Trading, Gamma Risk and Volatility Propagation (SSRN)](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4692190) — an academic look at whether dealers' option hedging amplifies or dampens intraday moves.
- [Options Industry Council — education](https://www.optionseducation.org/) — free material on the Greeks and on position risk.

## @next
The Principles tier ends here: you can price an option, read its volatility and take its risk apart. Now use it. The next tier starts with the simplest trade there is — buying a call or a put — and the first real decision every buyer faces: which strike and which expiry? Delta, theta and vega turn out to answer it.
