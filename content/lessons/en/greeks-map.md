---
id: greeks-map
prereqs: before-expiry, price-drivers, black-scholes, implied-vol
demo: greeks-map
---

# The Greeks Map: A Taylor Expansion of Option P&L

## @hook
Overnight, Kai's call went from $2.45 to $3.51. XYZ rose $2, a day passed and implied volatility slipped one point — three things at once. The Greeks split that single $1.06 into named pieces: $1.07 from direction, $0.14 from curvature, −$0.04 from time, −$0.11 from volatility. Added up, they miss the exact answer by less than a cent.

## @bridge
[[before-expiry]] showed that before expiry three forces bend an option's curve: price, time and volatility. [[price-drivers]] told us which *direction* each input pushes the price, and [[black-scholes]] turned the inputs into one number. [[implied-vol]] added that the volatility input moves on its own. This lesson asks the next question: **not "which way?" but "how much?"** — and answers it with a single expansion that every later lesson in this stage zooms into. It opens Idea ④ (risk): the Greeks break the risk of any option position into parts you can measure, add up and hedge.

## @intuition
Start with one concrete day.

Kai buys the course's standard option: the **30-day XYZ call with a $100 strike** for $2.45 (XYZ at $100, implied volatility 20%, risk-free rate 4%; illustrative numbers). The next day three things have happened:

- XYZ closes at **$102** (up $2);
- **one day** has passed (29 days left);
- implied volatility has slipped from 20% to **19%**.

Reprice with Black-Scholes: the call is now worth **$3.51**. Kai made \(3.51 - 2.45 = \$1.06\) per share, or \(\$106\) on the contract. Good — but *why* $1.06? Which of the three changes did the work?

The Greeks answer by asking one small question per input, holding everything else fixed:

- **Delta** \(\Delta = 0.534\): if XYZ rises $1, the call gains about $0.534. XYZ rose $2, so about \(0.534 \times 2 = \$1.07\).
- **Gamma** \(\Gamma = 0.069\): as XYZ rises, delta itself climbs (0.534 → 0.60 → 0.67). The second dollar earns more than the first. That bonus is about \(\tfrac12 \times 0.069 \times 2^2 = \$0.14\).
- **Theta** \(\Theta = -0.044\) per day: with nothing else moving, one day of waiting costs about $0.04.
- **Vega** \(\nu = 0.114\) per vol point: IV fell one point, so about −$0.11.

Add them: \(1.07 + 0.14 - 0.04 - 0.11 = 1.05\). The exact answer was 1.06. **Four numbers you could read off a screen yesterday explained today's P&L to within a cent.**

<figure>
<svg viewBox="0 0 660 260" role="img" aria-label="Waterfall of Kai's one-day P&L split into Greek terms">
<line x1="50" y1="210" x2="640" y2="210" class="fx-axis"/>
<rect x="70" y="60" width="70" height="150" rx="3" class="fx-ok"/>
<text x="105" y="52" text-anchor="middle" class="fx-t-ok">+1.069</text>
<line x1="140" y1="60" x2="170" y2="60" class="fx-line-muted fx-dash"/>
<rect x="170" y="41" width="70" height="19" rx="3" class="fx-ok"/>
<text x="205" y="33" text-anchor="middle" class="fx-t-ok">+0.139</text>
<line x1="240" y1="41" x2="270" y2="41" class="fx-line-muted fx-dash"/>
<rect x="270" y="41" width="70" height="6" rx="2" class="fx-bad"/>
<text x="305" y="33" text-anchor="middle" class="fx-t-bad">−0.044</text>
<line x1="340" y1="47" x2="370" y2="47" class="fx-line-muted fx-dash"/>
<rect x="370" y="47" width="70" height="16" rx="3" class="fx-bad"/>
<text x="405" y="39" text-anchor="middle" class="fx-t-bad">−0.114</text>
<line x1="440" y1="63" x2="470" y2="63" class="fx-line-muted fx-dash"/>
<rect x="470" y="63" width="70" height="147" rx="3" class="fx-hl"/>
<text x="505" y="55" text-anchor="middle" class="fx-t-hl">+1.050</text>
<rect x="560" y="62" width="70" height="148" rx="3" class="fx-box2"/>
<text x="595" y="54" text-anchor="middle" class="fx-t-b">+1.057</text>
<text x="105" y="228" text-anchor="middle" class="fx-t-b">Δ · dS</text>
<text x="205" y="228" text-anchor="middle" class="fx-t-b">½ Γ · dS²</text>
<text x="305" y="228" text-anchor="middle" class="fx-t-b">Θ · dt</text>
<text x="405" y="228" text-anchor="middle" class="fx-t-b">ν · dσ</text>
<text x="505" y="228" text-anchor="middle" class="fx-t-b">Greeks sum</text>
<text x="595" y="228" text-anchor="middle" class="fx-t-b">exact</text>
<text x="105" y="245" text-anchor="middle" class="fx-t-sm">0.534 × 2</text>
<text x="205" y="245" text-anchor="middle" class="fx-t-sm">½ × 0.069 × 4</text>
<text x="305" y="245" text-anchor="middle" class="fx-t-sm">−0.044 × 1 day</text>
<text x="405" y="245" text-anchor="middle" class="fx-t-sm">0.114 × (−1)</text>
<text x="505" y="245" text-anchor="middle" class="fx-t-sm">Taylor estimate</text>
<text x="595" y="245" text-anchor="middle" class="fx-t-sm">BS reprice</text>
<text x="60" y="14" class="fx-t-sm">P&amp;L per share, $ (XYZ 100 → 102, 30 → 29 days, IV 20% → 19%)</text>
</svg>
<figcaption>Figure 1 · Kai's one-day P&L as a waterfall. Direction (delta) does most of the work, curvature (gamma) adds a bonus, time (theta) and the IV dip (vega) take a little back. The Greek terms sum to $1.050; the exact reprice gives $1.057.</figcaption>
</figure>

Each Greek is just a **slope**: nudge one input, keep the others frozen, and measure how far the price moves per unit of that input. Delta is the slope against the stock price, theta against the calendar, vega against implied volatility, rho against the interest rate. Gamma is the odd one out — it is the slope *of the delta slope*, the amount the price curve bends.

> [!KAI] Kai's dashboard, per contract
> For the one 30-day 100 call (×100 shares), the screen reads: **Δ +53.4** (the position moves like 53 shares of XYZ), **Γ +6.9** (it gains about 7 more "shares" of delta for each $1 up), **Θ −$4.36 a day**, **ν +$11.40 per vol point**, **ρ +$4.19 per 1% of rates**. Kai is not only betting on direction: Kai is also long curvature, long volatility, and paying rent to time.

> [!THINK] Suppose XYZ had *fallen* $2 instead of rising. Would the gamma term still add money, or take it away?
> Predict before opening.
> ---
> It still **adds** $0.14. The term is \(\tfrac12\Gamma(\dd S)^2\), and a square is positive whether the move is +2 or −2. The delta term flips to about −$1.07, so the call loses — but it loses *less* than delta alone says, because delta shrank on the way down. That is what owning gamma means: moves in either direction help you relative to a straight line.

Which Greeks does *your* position have, and with which signs? Pick a position below:

::demo[greeks-map-signs]

We'll take it in five parts:

- **① The Taylor expansion**: one formula that holds every Greek
- **② Units and the ×100**: reading the numbers on a screen
- **③ The XYZ dashboard**: how the Greeks change across strikes and expiries
- **④ The sign table**: long and short, calls and puts
- **⑤ Where the map misleads**, and how professionals use it

## @mechanics
### ① The Taylor expansion

An option's value \(V\) depends on the stock price \(S\), the time \(t\), the volatility \(\sigma\) and the rate \(r\). When each moves a little, calculus says the change in \(V\) is, to a good approximation, a sum of "slope × change" terms, plus one curvature term for the stock:

$$
\dd V \;\approx\; \underbrace{\Delta\,\dd S}_{\text{direction}} \;+\; \underbrace{\tfrac12\,\Gamma\,(\dd S)^2}_{\text{curvature}} \;+\; \underbrace{\Theta\,\dd t}_{\text{time}} \;+\; \underbrace{\nu\,\dd\sigma}_{\text{volatility}} \;+\; \underbrace{\rho\,\dd r}_{\text{rates}}
$$

Where:

- \(\dd S\) is the stock move in dollars, \(\dd t\) the time that passes (in days, with the course's theta per day), \(\dd\sigma\) the change in implied volatility (in vol points), \(\dd r\) the change in the rate (in percentage points);
- \(\Delta\), \(\Gamma\), \(\Theta\), \(\nu\) (vega), \(\rho\) are the Greeks — the slopes, measured *before* the change.

Each Greek is a partial derivative of the value: the rate of change in one input while the others stay fixed.

$$
\Delta = \frac{\partial V}{\partial S}, \qquad \Gamma = \frac{\partial^2 V}{\partial S^2}, \qquad \Theta = \frac{\partial V}{\partial t}, \qquad \nu = \frac{\partial V}{\partial \sigma}, \qquad \rho = \frac{\partial V}{\partial r}
$$

The \(\partial\) ("partial") reminds you of the "everything else fixed" rule. Only gamma is a *second* derivative: it measures how fast delta changes when the stock moves.

> [!EXAMPLE] Kai's day, term by term
> The 30-day 100 call: \(\Delta = 0.534\), \(\Gamma = 0.0693\), \(\Theta = -0.0436\) per day, \(\nu = 0.114\) per vol point, \(\rho = 0.042\) per 1%. The day brings \(\dd S = +2\), \(\dd t = 1\) day, \(\dd\sigma = -1\) point, \(\dd r = 0\):
> $$
> \begin{aligned}
> \dd V &\approx 0.534 \times 2 + \tfrac12 \times 0.0693 \times 2^2 - 0.0436 \times 1 + 0.114 \times (-1) + 0.042 \times 0 \\
>       &= 1.069 + 0.139 - 0.044 - 0.114 = 1.050
> \end{aligned}
> $$
> The exact reprice (\(S = 102\), 29 days, \(\sigma = 19\%\)) is $3.508, a change of **1.057**. The leftover 0.007 — the **residual** — comes from effects the expansion ignores, such as delta changing as time passes. Per contract: estimate \(\$105.0\), actual \(\$105.7\).

Why the \(\tfrac12\) and the square? Picture the price curve against \(S\). The delta term follows the **tangent line** at today's price. The real curve bends upward away from that line, and a bending curve is well described by a parabola: \(\tfrac12\Gamma(\dd S)^2\) is exactly that parabola's height above the tangent.

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Option price curve with its tangent line and parabola approximation">
<defs><marker id="greeks-map-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="50" y1="230" x2="615" y2="230" class="fx-axis" marker-end="url(#greeks-map-ah)"/>
<line x1="60" y1="240" x2="60" y2="15" class="fx-axis" marker-end="url(#greeks-map-ah)"/>
<polyline points="60,230 330,230 600,33" class="fx-line-muted fx-dash"/>
<polyline points="248,230 330,198 600,93" class="fx-line-bad"/>
<polyline points="60,201 78,207 96,212 114,216 132,220 150,222 168,224 186,225 204,225 222,224 240,222 258,219 276,215 294,210 312,204 330,198 348,190 366,182 384,173 402,162 420,151 438,139 456,126 474,113 492,98 510,82 528,66 546,48 564,30" class="fx-line-blue fx-dash"/>
<polyline points="60,230 78,230 96,230 114,230 132,229 150,229 168,228 186,227 204,226 222,224 240,222 258,219 276,215 294,210 312,204 330,198 348,190 366,182 384,173 402,163 420,152 438,141 456,130 474,118 492,106 510,93 528,80 546,68 564,55 582,42 600,29" class="fx-line-thick"/>
<circle cx="330" cy="198" r="5" class="fx-fill-orange"/>
<line x1="510" y1="128" x2="510" y2="93" class="fx-line-hl"/>
<text x="518" y="148" class="fx-t-hl">convexity</text>
<text x="518" y="163" class="fx-t-sm">10.43 vs 7.79</text>
<text x="150" y="248" text-anchor="middle" class="fx-t-sm">90</text>
<text x="240" y="248" text-anchor="middle" class="fx-t-sm">95</text>
<text x="330" y="248" text-anchor="middle" class="fx-t-b">100</text>
<text x="420" y="248" text-anchor="middle" class="fx-t-sm">105</text>
<text x="510" y="248" text-anchor="middle" class="fx-t-sm">110</text>
<text x="600" y="248" text-anchor="middle" class="fx-t-sm">115</text>
<text x="54" y="182" text-anchor="end" class="fx-t-sm">4</text>
<text x="54" y="129" text-anchor="end" class="fx-t-sm">8</text>
<text x="54" y="77" text-anchor="end" class="fx-t-sm">12</text>
<text x="338" y="215" class="fx-t-sm">today: S = 100, V = 2.45</text>
<text x="80" y="30" class="fx-t">— price today (30 days left)</text>
<text x="80" y="48" class="fx-t-bad">— tangent: delta only</text>
<text x="80" y="66" class="fx-t-blue">- - parabola: delta + ½ gamma</text>
<text x="80" y="84" class="fx-t-sm">- - value at expiry</text>
<text x="612" y="222" text-anchor="end" class="fx-t-sm">XYZ price S</text>
</svg>
<figcaption>Figure 2 · The 30-day 100 call's price against XYZ. The red tangent (delta alone) always sits below the curve; the blue parabola (delta plus \(\tfrac12\Gamma\)) hugs it for moves of a few dollars. At \(S = 110\) the true value is 10.43, the tangent says 7.79, and the parabola overshoots to 11.26 — for very large moves even gamma is not enough.</figcaption>
</figure>

> [!DEEP] Where the expansion comes from
> For any smooth function, Taylor's theorem gives \(f(x + h) = f(x) + f'(x)\,h + \tfrac12 f''(x)\,h^2 + \dots\) Apply it to \(V(S, t, \sigma, r)\) in all four inputs at once and keep the terms that matter over a day: first order in every input, second order only in \(S\), because stock moves are the largest and their squares add up (a random walk's squared moves grow in proportion to time, which is why \((\dd S)^2\) competes with \(\dd t\)). The terms left out — \(\tfrac12\) volga \((\dd\sigma)^2\), vanna \(\dd S\,\dd\sigma\), charm \(\dd S\,\dd t\) — are the subject of [[higher-order-greeks]].

### ② Units and the ×100

A Greek is only useful if you know its unit. The course's engine and every demo use the trading-desk conventions:

| Greek | Calculus meaning | Trading unit | 30-day 100 call, per share | Per contract (×100) |
|---|---|---|---|---|
| Delta \(\Delta\) | \(\partial V/\partial S\) | per $1 in the stock | 0.534 | 53.4 share-equivalents |
| Gamma \(\Gamma\) | \(\partial^2 V/\partial S^2\) | change in delta per $1 | 0.069 | 6.93 shares per $1 |
| Theta \(\Theta\) | \(\partial V/\partial t\) | per calendar day | −0.044 | −$4.36 a day |
| Vega \(\nu\) | \(\partial V/\partial \sigma\) | per 1 vol point | 0.114 | $11.40 per point |
| Rho \(\rho\) | \(\partial V/\partial r\) | per 1 percentage point | 0.042 | $4.19 per 1% |

The raw calculus values are bigger numbers in odd units. Black-Scholes gives theta as **−15.90 per year**; the course divides by 365 to get \(-15.90/365 = -0.0436\) per calendar day. Vega comes out as 11.40 per unit of \(\sigma\) (that is, per 100 vol points); divide by 100 to get 0.114 per vol point.

Greeks **add across positions**. A position's Greek is the sum over its legs of (number of contracts × 100 × per-share Greek), with a minus sign for short legs; stock has \(\Delta = 1\) per share and no other Greek. Five long 30-day calls carry \(5 \times 100 \times 0.534 = 267\) share-equivalents of delta and \(5 \times 100 \times (-0.0436) = -\$21.80\) of theta a day. That additivity is why a trading desk can describe a book of hundreds of options with five numbers ([[portfolio-risk]]).

> [!WARN] Check the units before you compare
> Platforms differ. Some show theta per **year**, some per **trading day** (dividing by about 252 instead of 365), some per calendar day. Some quote vega per 1 vol point, a few per 100%. Some include dividends or use a different rate. A "theta of −0.06" on one screen and "−0.044" on another may describe the same option. Before comparing, find the unit — and remember the ×100.

### ③ The XYZ dashboard

Here are the course's standard options side by side (per share; XYZ \(S = 100\), \(\sigma = 20\%\), \(r = 4\%\)):

| Option | Price | \(\Delta\) | \(\Gamma\) | \(\Theta\) / day | \(\nu\) / pt | \(\rho\) / 1% |
|---|---|---|---|---|---|---|
| 30-day 100 call | 2.45 | 0.534 | 0.069 | −0.044 | 0.114 | 0.042 |
| 30-day 100 put | 2.12 | −0.466 | 0.069 | −0.033 | 0.114 | −0.040 |
| 30-day 105 call | 0.71 | 0.222 | 0.052 | −0.031 | 0.085 | 0.018 |
| 30-day 95 put | 0.51 | −0.163 | 0.043 | −0.022 | 0.071 | −0.014 |
| 7-day 100 call | 1.14 | 0.517 | 0.144 | −0.084 | 0.055 | 0.010 |
| 1-day 100 call | 0.42 | 0.506 | 0.381 | −0.214 | 0.021 | 0.001 |
| 1-year 100 call | 9.93 | 0.618 | 0.019 | −0.016 | 0.381 | 0.519 |

Read it down the columns and five patterns jump out — each one is the headline of a later lesson:

- **Delta** runs from near 0 (far out of the money) to near 1 (deep in), and sits a little above 0.5 at the money. The call and put at the same strike differ by exactly 1 (\(0.534 - (-0.466) = 1\)). → [[delta]]
- **Gamma** is largest at the money and **grows as expiry approaches**: 0.069 at 30 days, 0.381 at one day. The call and the put share the same gamma. → [[gamma]]
- **Theta** is largest (most negative) at the money and also grows near expiry: −0.044 → −0.214. Gamma and theta rise together — they are two sides of one coin. → [[theta]]
- **Vega** does the opposite: it **shrinks** near expiry (0.021 at one day) and is largest for long-dated options (0.381 at one year). → [[vega]]
- **Rho** is tiny for short options (0.042) and matters only for long-dated ones (0.519 at one year). → [[rho-carry]]

So a 1-day option is almost pure gamma and theta, and a 1-year option is mostly vega and rho. **The same "at-the-money call" is a different risk depending on its expiry.**

### ④ The sign table

Whether a Greek helps or hurts depends on its sign. For single legs:

| Position | \(\Delta\) | \(\Gamma\) | \(\Theta\) | \(\nu\) | \(\rho\) |
|---|---|---|---|---|---|
| Long call | + | + | − | + | + |
| Short call | − | − | + | − | − |
| Long put | − | + | − | + | − |
| Short put | + | − | + | − | + |
| Long stock | +1 | 0 | 0 | 0 | 0 |

Three rules cover it:

1. **Delta and rho depend on call vs put.** Calls gain when the stock (or the rate) rises; puts lose.
2. **Gamma, theta and vega depend only on long vs short.** Anyone who *buys* optionality — a call or a put — is long gamma, long vega and short theta. Anyone who sells it holds the mirror image.
3. **Gamma and theta come with opposite signs.** You cannot own curvature without paying for it by the day.

> [!KEY] Buying an option = long gamma, long vega, short theta
> A long option is never "just a bet on direction". It is also a bet that the stock will move enough (gamma), that implied volatility will not fall (vega), and a promise to pay time decay while you wait (theta). Selling an option flips every one of those signs. The daily theta a seller collects is the price the buyer pays for gamma — [[theta]] turns that sentence into an exact equation.

One technical exception, for completeness: a deep in-the-money *European* put can have positive theta when rates are positive. The 1-year 130 put on XYZ has \(\Theta \approx +0.006\) a day, because waiting brings the strike's present value closer. For everyday options, rule 3 holds.

### ⑤ Where the map misleads, and how professionals use it

The expansion is a *local* map — excellent for small moves, increasingly wrong for big ones.

**Big stock moves.** For a $10 jump in XYZ (nothing else changing), the 30-day call gains **$7.98**. Delta alone predicts \(0.534 \times 10 = \$5.34\); delta plus gamma predicts \(5.34 + \tfrac12 \times 0.0693 \times 100 = \$8.81\). The first is too low, the second too high: as the call goes deep in the money, delta cannot rise past 1, so gamma itself fades. The main demo below lets you watch that gap open.

**The Greeks move.** Every Greek is measured at today's inputs. After a day, delta has drifted (charm); after an IV change, delta and vega have both shifted (vanna, volga). Over a quiet day these cross effects are pennies — Kai's residual was 0.007. Over an earnings gap they can dominate. See [[higher-order-greeks]].

**Inputs move together.** The expansion treats \(\dd S\) and \(\dd\sigma\) as separate dials. In equity markets they are linked: when stocks fall, implied volatility usually rises. A put holder's delta gain and vega gain arrive together; a call holder's can cancel. Scenario analysis handles this better than a single Greek does.

That is why risk systems use the Greeks in two ways. Day to day, they report position Greeks and run **P&L attribution**: yesterday's P&L split into delta, gamma, theta, vega and rho, with a residual (often labelled "unexplained"). A small residual means the risk picture is complete; a large one is a warning that something is missing — a jump, a stale input, a model error. For large moves, they **fully reprice** every option on a grid of stock and volatility scenarios instead of trusting the expansion ([[portfolio-risk]]).

## @analogy
Think of the **itemized electricity bill** for a house. The meter shows one number: this month you used $106 of power. The itemized bill splits it: the air conditioner, the fridge, the water heater, the lights. Each line is a *rate* multiplied by *usage*: the air conditioner costs so much per hour, and it ran so many hours.

The Greeks are those rates. Delta is "dollars per $1 of stock move", theta is "dollars per day", vega is "dollars per vol point". The market supplies the usage: how far the stock moved, how many days passed, how much implied volatility changed. Multiply and add, and the itemized bill matches the meter — the $1.05 against the $1.06.

The picture also shows where the split is useful. If the bill jumps, you want to know whether it was the heater or the lights; if a position loses money, you want to know whether it was direction, time or volatility. Only the split tells you what to fix.

Where the analogy breaks: an appliance's rate is fixed, but a Greek changes as you "use" it. Run the stock up and delta itself rises (that is gamma); let time pass and gamma and theta both grow. For small usage the itemized bill is accurate. For a very large month — a crash, an earnings gap — the lines no longer add up to the meter, and you have to read the meter directly: reprice.

## @misconceptions
- **"The Greeks are fixed numbers attached to an option."** — They are slopes measured at today's price, time and volatility. Move any of those and every Greek changes: delta moves with the stock, gamma and theta grow as expiry nears, vega shrinks.
- **"Theta tells me exactly what I will lose each day."** — Theta is the change from one day passing *with everything else frozen*. Your actual P&L also includes the delta, gamma and vega terms from what the stock and IV did that day.
- **"Adding up the Greek terms always gives the exact P&L."** — Only for small moves. For a $10 jump in XYZ, delta plus gamma says $8.81 while the true gain is $7.98. For big moves, reprice.
- **"A long call is just a bet that the stock goes up."** — It is also long gamma (it wants big moves), long vega (it wants IV to rise or at least hold) and short theta (it pays rent every day). Many losing long calls had the direction right and lost on time or volatility.
- **"Delta-neutral means no risk."** — It means no *first-order* exposure to small stock moves. Gamma, vega and theta are all still there — often by design.

## @takeaways
- The Greeks split an option's P&L into named parts: \(\dd V \approx \Delta\,\dd S + \tfrac12\Gamma(\dd S)^2 + \Theta\,\dd t + \nu\,\dd\sigma + \rho\,\dd r\).
- For Kai's day (XYZ +$2, one day, IV −1 point) the terms add to $1.050 against an exact $1.057.
- Units matter: delta per $1, gamma per $1, theta per calendar day, vega per vol point, rho per 1% — all per share, ×100 per contract; position Greeks add across legs.
- Short-dated options are mostly gamma and theta; long-dated options are mostly vega and rho.
- Buying any option makes you long gamma and vega and short theta; selling flips every sign.
- The expansion is local: for large moves, jumps or linked spot–vol changes, fully reprice.

## @quiz
1. Using the Greeks of the 30-day XYZ 100 call (\(\Delta = 0.534\), \(\Gamma = 0.069\), \(\Theta = -0.044\)), estimate the change in the call's price if XYZ rises $1 over one day and IV stays at 20%.
   - [ ] +$0.534
   - [ ] +$0.569
   - [x] about +$0.525
   - [ ] +$0.490
   > \(0.534 \times 1 + \tfrac12 \times 0.069 \times 1^2 - 0.044 = 0.534 + 0.035 - 0.044 = 0.525\). The tempting +$0.569 forgets theta; +$0.490 forgets gamma; +$0.534 is delta alone.
2. Kai holds 10 contracts of the 30-day 100 call (\(\Theta = -0.0436\) per share per day). With nothing else changing, about how much do they lose to time in one day?
   - [x] $43.60
   - [ ] $0.44
   - [ ] $4.36
   - [ ] $15.90
   > Position theta = contracts × 100 × per-share theta = \(10 \times 100 \times 0.0436 = \$43.60\). $4.36 is one contract; 15.90 is the per-year theta of one share.
3. Which position has negative gamma, positive theta and negative vega, **and** positive delta?
   - [ ] Long put
   - [ ] Long call
   - [ ] 100 shares of stock
   - [x] Short put
   > Selling any option makes gamma and vega negative and theta positive. Among the short positions, only the short put gains when the stock rises (positive delta). A long put and a long call are long gamma; stock has no gamma, theta or vega at all.
4. For a $10 jump in XYZ, the Greeks' estimate \(\Delta\,\dd S + \tfrac12\Gamma(\dd S)^2\) for the 30-day call is $8.81, but the true gain is $7.98. Why does the estimate overshoot?
   - [ ] Because theta was left out
   - [x] Because gamma shrinks as the call goes deep in the money — delta cannot rise past 1
   - [ ] Because Black-Scholes is wrong for large moves
   - [ ] Because vega rises when the stock rises
   > The expansion uses today's gamma for the whole move. As XYZ climbs toward 110, delta approaches 1 and gamma fades, so the true curve bends less than the parabola. No time passed here, so theta plays no role.
5. A trader's position shows \(\Delta \approx 0\), \(\Gamma = +40\), \(\Theta = -\$120\) a day, \(\nu = +\$300\) per vol point. Which description fits?
   - [ ] It has no risk because delta is zero
   - [ ] It profits if XYZ stays perfectly still
   - [ ] It is a bet that implied volatility falls
   - [x] It gains from big moves either way and from rising IV, and pays $120 a day while waiting
   > Zero delta removes only the first-order directional bet. Positive gamma profits from large moves in either direction, positive vega from rising IV, and negative theta is the daily cost — a typical long straddle profile ([[straddle-strangle]]).

## @further
- [Greeks (finance) — Wikipedia](https://en.wikipedia.org/wiki/Greeks_(finance)) — definitions, formulas and unit conventions for every first- and second-order Greek.
- [Taylor's theorem — Wikipedia](https://en.wikipedia.org/wiki/Taylor%27s_theorem) — the calculus behind the expansion, with error bounds.
- [Black & Scholes (1973), The Pricing of Options and Corporate Liabilities](https://doi.org/10.1086/260062) — the hedging argument that ties theta to gamma.
- [Characteristics and Risks of Standardized Options (OCC)](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the official risk disclosure every US options trader receives.

## @next
Delta did most of the work in Kai's day. But delta is three things at once: a slope, the number of shares that hedge the option, and something that looks like a probability but is not quite one. The next lesson separates the three.
