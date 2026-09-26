---
id: vega
prereqs: implied-vol, term-structure, greeks-map, gamma, theta
demo: vega
---

# Vega: You're Really Trading Volatility

## @hook
The day before earnings Kai pays $4.16 for a 30-day XYZ call. The next morning XYZ is up 3% — and the call is worth $4.31. Fifteen cents for being right. The missing money went into **vega**: the option was also a bet on implied volatility, and implied volatility fell from 35% to 20% overnight.

## @bridge
[[greeks-map]] split an option's P&L into pieces, and [[delta]], [[gamma]] and [[theta]] handled two of the inputs: the stock price and the clock. One input is left, and it is the one that sets the price: [[implied-vol]] showed that options are *quoted* in volatility. This lesson asks: **when that quote moves by one point, how much does the option move — and where in a book does that sensitivity live?** It builds Idea ③ (options trade volatility) and Idea ④ (the Greeks split risk into measurable parts).

## @intuition
Start with the course's standard option: the **30-day XYZ call with a $100 strike**, spot $100, implied volatility (IV) 20%, rate 4%. It costs **$2.45**. Now leave everything alone except the IV, and reprice it:

| Implied vol | 10% | 20% | 21% | 30% | 40% |
|---|---|---|---|---|---|
| Call price | $1.31 | **$2.45** | $2.57 | $3.59 | $4.73 |

From 20% to 21% the price rises by about **11.4 cents**. From 20% to 30% it rises by $1.14 — ten times as much. Each "vol point" (one percentage point of IV) is worth about \(\$0.114\) per share, or \(0.114 \times 100 = \$11.40\) per contract. **That number is vega**: how many dollars the option gains when implied volatility rises by one point, with the stock and the clock held still.

Two things follow at once.

- **Every long option is long volatility.** A call and a put with the same strike and expiry have exactly the same vega. The reason is [[put-call-parity]]: \(C - P = S - Ke^{-rT}\) contains no σ at all, so whatever σ adds to the call it must also add to the put.
- **The stock does not have to move.** IV is a market price for uncertainty. When traders expect a bumpier future, or simply want more insurance, IV rises and every option in the chain is repriced upward — before anything has happened to the stock.

> [!KAI] Kai's earnings call, dissected
> Suppose that on the day before earnings the 30-day 100 call trades at IV **35%** (the market prices a big move). Kai buys it for \(\$4.16\), which is \(\$416\) per contract. After the report XYZ opens at $103 and IV drops to its usual 20%. The call is now worth \(\$4.31\). Split the night into three steps:
> - IV falls 15 points, stock unchanged: \(4.16 \to 2.45\), about \(-\$1.71\);
> - one day passes: \(2.45 \to 2.41\), about \(-\$0.04\);
> - XYZ rises $3: \(2.41 \to 4.31\), about \(+\$1.90\).
>
> Net: \(+\$0.15\) per share, \(+\$15\) per contract. Kai was right about direction and was paid almost nothing, because the price already contained the move — and the vega loss took it back.

The drop in IV after a known event is called an **IV crush**. It is the most common way beginners learn about vega, usually the expensive way. The small demo below lets you rerun Kai's night with your own numbers.

::demo[vega-crush]

> [!THINK] Two at-the-money XYZ calls: one expires in 7 days, the other in a year. Implied vol rises by 5 points for both. Which call gains more, and roughly how much?
> Predict first — which one "cares" more about volatility?
> ---
> The 1-year call. Its vega is 0.381 per point, so it gains about \(0.381 \times 5 \approx \$1.91\) per share. The 7-day call's vega is only 0.055: about \(\$0.28\). A long-dated option has a long time for a higher volatility to act; a short-dated one has almost none. (In real markets short-dated IV usually moves *more* points than long-dated IV — the second half of this lesson deals with that.)

We'll take it in five parts:

- **① The formula and the units**
- **② Where vega lives: strike and time**
- **③ Vega and gamma: one root, two clocks**
- **④ IV crush: attributing an event P&L**
- **⑤ Vega in a book: tenors, buckets and the state of play**

## @mechanics
### ① The formula and the units

Vega is the derivative of the option price with respect to volatility. In Black-Scholes it has a short closed form, the same for calls and puts:

$$
\nu = \frac{\partial V}{\partial \sigma} = S\,e^{-qT}\,\varphi(d_1)\,\sqrt{T}
$$

where \(S\) is the spot price, \(q\) the dividend yield, \(T\) the time to expiry in years, \(d_1\) the familiar term from [[black-scholes]], and \(\varphi(\cdot)\) the standard normal density (the height of the bell curve, at most 0.399 at zero). The formula has three factors, and each tells you something: \(S\) (vega is measured in dollars, so a bigger stock has a bigger vega), \(\varphi(d_1)\) (largest when the option is near the money) and \(\sqrt{T}\) (more time, more vega).

> [!EXAMPLE] Vega of the 30-day 100 call
> \(S = 100,\ q = 0,\ T = 30/365\), so \(\sqrt{T} = 0.2867\); \(d_1 = 0.086\), so \(\varphi(d_1) = 0.3975\).
> $$
> \nu = 100 \times 0.3975 \times 0.2867 = 11.40
> $$
> That 11.40 is dollars per share for a change in \(\sigma\) of **1.00**, i.e. 100 vol points. Traders divide by 100: **\(0.114\) per vol point**, and multiply by the contract size: \(0.114 \times 100 = \$11.40\) per contract per vol point. The course's tables and demos always use this trading unit.

The unit trap is real. A platform that shows "vega 11.40" for this option uses the raw calculus unit; one that shows "0.11" uses vol points; a risk report may show "$11" per contract. Always check which one you are reading. And "IV up 1%" on a desk means **one vol point** (20% → 21%), never a 1% relative change (20% → 20.2%).

For an at-the-money option vega is almost exactly constant as IV changes: in the table above every 10 points added the same $1.14. That is the rule of thumb \(C_{\text{ATM}} \approx 0.4\,S\sigma\sqrt{T}\) from [[black-scholes]] in disguise — a straight line in \(\sigma\) whose slope is \(0.4\,S\sqrt{T} = 0.4 \times 100 \times 0.2867 \approx 11.5\), within a whisker of the exact 11.40. For out-of-the-money options the line bends, and vega itself grows as IV rises. That bending has a name, *volga*, and it is the subject of [[higher-order-greeks]].

### ② Where vega lives: strike and time

Plot the vega of a $100-strike call against the stock price and you get a hill centred on the strike.

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Vega of a 100-strike call against the stock price for four expiries">
<defs><marker id="vega-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="60" y1="173" x2="600" y2="173" class="fx-grid"/>
<line x1="60" y1="125" x2="600" y2="125" class="fx-grid"/>
<line x1="60" y1="78" x2="600" y2="78" class="fx-grid"/>
<line x1="60" y1="220" x2="612" y2="220" class="fx-axis" marker-end="url(#vega-ah)"/>
<line x1="60" y1="220" x2="60" y2="24" class="fx-axis" marker-end="url(#vega-ah)"/>
<line x1="330" y1="30" x2="330" y2="220" class="fx-line-muted fx-dash"/>
<polyline points="60,220 150,220 240,220 258,220 267,219 276,218 285,215 294,211 303,205 312,200 321,195 330,194 339,196 348,200 357,205 366,211 375,215 384,217 393,219 402,219 420,220 510,220 600,220" class="fx-line-muted"/>
<polyline points="60,220 177,220 186,219 195,219 204,218 213,217 222,215 231,213 240,209 249,205 258,200 267,195 276,189 285,183 294,177 303,172 312,169 321,166 330,166 339,167 348,170 357,173 366,178 375,183 384,189 393,194 402,199 411,203 420,207 429,210 438,213 447,215 456,216 465,217 474,218 483,219 492,219 501,220 600,220" class="fx-line-hl"/>
<polyline points="60,220 87,219 105,218 123,217 141,214 159,209 177,202 195,194 213,183 231,170 249,158 267,146 285,136 303,130 321,127 330,127 339,128 357,132 375,140 393,149 411,159 429,169 447,179 465,188 483,195 501,202 519,207 537,210 555,213 573,215 591,217 600,218" class="fx-line-blue"/>
<polyline points="60,176 78,165 96,152 114,139 132,125 150,111 168,98 186,85 204,73 222,63 240,54 258,47 276,42 294,39 312,38 330,39 348,42 366,46 384,51 402,58 420,66 438,74 456,83 474,92 492,102 510,111 528,120 546,129 564,137 582,145 600,153" class="fx-line-thick"/>
<text x="150" y="238" text-anchor="middle" class="fx-t-sm">80</text>
<text x="240" y="238" text-anchor="middle" class="fx-t-sm">90</text>
<text x="330" y="238" text-anchor="middle" class="fx-t-b">K = 100</text>
<text x="420" y="238" text-anchor="middle" class="fx-t-sm">110</text>
<text x="510" y="238" text-anchor="middle" class="fx-t-sm">120</text>
<text x="600" y="254" text-anchor="end" class="fx-t-sm">stock price S</text>
<text x="52" y="224" text-anchor="end" class="fx-t-sm">0</text>
<text x="52" y="177" text-anchor="end" class="fx-t-sm">0.1</text>
<text x="52" y="129" text-anchor="end" class="fx-t-sm">0.2</text>
<text x="52" y="82" text-anchor="end" class="fx-t-sm">0.3</text>
<text x="66" y="22" class="fx-t-sm">vega per vol point</text>
<text x="400" y="36" class="fx-t-b">1 year: 0.381</text>
<text x="72" y="40" class="fx-t-blue">— 90 days: 0.196</text>
<text x="72" y="56" class="fx-t-hl">— 30 days: 0.114</text>
<text x="72" y="72" class="fx-t-sm">— 7 days: 0.055</text>
</svg>
<figcaption>Figure 1 · Vega of an XYZ 100-strike call (σ 20%, r 4%) against the stock price, for four expiries. Each curve peaks near the strike; the peaks rise with \(\sqrt{T}\), and the long-dated hill is also much wider — a 1-year option still has plenty of vega 20% away from the strike, a 7-day one has none.</figcaption>
</figure>

Three rules come out of the picture and the formula:

1. **Vega peaks near the money.** An option whose fate is still open is the most sensitive to how uncertain the future is. Deep in or out of the money, a few more points of vol hardly change the answer (the 30-day call has vega 0.114 at S = 100, only 0.027 at S = 110 and 0.022 at S = 90).
2. **Vega grows like \(\sqrt{T}\).** Four times the time, roughly twice the vega:

| ATM XYZ call | 1 day | 7 days | 30 days | 90 days | 1 year | 2 years |
|---|---|---|---|---|---|---|
| Vega per vol point | 0.021 | 0.055 | 0.114 | 0.196 | 0.381 | 0.516 |
| Per contract | $2.10 | $5.50 | $11.40 | $19.60 | $38.10 | $51.60 |

3. **Calls and puts share it.** The 30-day 100 put also has vega 0.114. So a long straddle (call + put) has twice the vega, \(\$22.79\) per contract per point, and a short strangle has negative vega on both legs.

Why does more σ always help the holder? Recall [[linear-vs-convex]] and [[black-scholes]]: a long option's loss stops at the premium while its gain is open, so a wider distribution adds more to the good outcomes than it takes from the bad ones. Vega is simply the size of that effect per vol point. That is why a long option's vega is **never negative**.

### ③ Vega and gamma: one root, two clocks

Vega and [[gamma]] look like different creatures — one is about volatility, the other about the curvature in the stock price — but in Black-Scholes they are the same quantity measured in different units:

$$
\nu = \Gamma\,S^2\,\sigma\,T
$$

Here \(\nu\) is the raw vega (per 1.00 of σ), \(\Gamma\) the gamma, \(S\) the spot, \(\sigma\) the volatility and \(T\) the time in years. Both come from the same factor \(\varphi(d_1)\); what differs is how time enters. Gamma carries \(1/\sqrt{T}\) and explodes near expiry; vega carries \(\sqrt{T}\) and melts away.

Check it on the 30-day call, with \(\Gamma = 0.0693,\ S^2 = 10{,}000,\ \sigma = 0.20,\ T = 0.0822\):

$$
0.0693 \times 10{,}000 \times 0.20 \times 0.0822 = 11.40
$$

exactly the vega from ①. For the 1-year call: \(0.0191 \times 10{,}000 \times 0.20 \times 1 = 38.2\), i.e. 0.382 per point.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Vega and gamma of at-the-money calls across expiries">
<line x1="50" y1="200" x2="620" y2="200" class="fx-axis"/>
<rect x="86" y="179" width="40" height="21" class="fx-fill-orange"/>
<rect x="134" y="56" width="40" height="144" class="fx-fill-blue"/>
<rect x="226" y="157" width="40" height="43" class="fx-fill-orange"/>
<rect x="274" y="131" width="40" height="69" class="fx-fill-blue"/>
<rect x="366" y="126" width="40" height="74" class="fx-fill-orange"/>
<rect x="414" y="160" width="40" height="40" class="fx-fill-blue"/>
<rect x="506" y="57" width="40" height="143" class="fx-fill-orange"/>
<rect x="554" y="181" width="40" height="19" class="fx-fill-blue"/>
<text x="106" y="173" text-anchor="middle" class="fx-t-sm">0.055</text>
<text x="154" y="50" text-anchor="middle" class="fx-t-sm">0.144</text>
<text x="246" y="151" text-anchor="middle" class="fx-t-sm">0.114</text>
<text x="294" y="125" text-anchor="middle" class="fx-t-sm">0.069</text>
<text x="386" y="120" text-anchor="middle" class="fx-t-sm">0.196</text>
<text x="434" y="154" text-anchor="middle" class="fx-t-sm">0.040</text>
<text x="526" y="51" text-anchor="middle" class="fx-t-sm">0.381</text>
<text x="574" y="175" text-anchor="middle" class="fx-t-sm">0.019</text>
<text x="130" y="220" text-anchor="middle" class="fx-t-b">7 days</text>
<text x="270" y="220" text-anchor="middle" class="fx-t-b">30 days</text>
<text x="410" y="220" text-anchor="middle" class="fx-t-b">90 days</text>
<text x="550" y="220" text-anchor="middle" class="fx-t-b">1 year</text>
<rect x="60" y="14" width="14" height="12" class="fx-fill-orange"/>
<text x="80" y="25" class="fx-t">vega (per vol point)</text>
<rect x="250" y="14" width="14" height="12" class="fx-fill-blue"/>
<text x="270" y="25" class="fx-t">gamma (per $1)</text>
<text x="620" y="244" text-anchor="end" class="fx-t-sm">at-the-money XYZ calls, σ 20%, r 4%</text>
</svg>
<figcaption>Figure 2 · The two brothers. Short-dated options are mostly gamma (big curvature, little vega); long-dated options are mostly vega (little curvature, big exposure to the level of IV). The ratio vega ÷ gamma is \(S^2\sigma T/100\): 0.38 at 7 days, 20 at one year.</figcaption>
</figure>

This is why traders say **short-dated options are a gamma game and long-dated options are a vega game**. A 7-day straddle makes or loses money mostly on how far XYZ actually moves this week ([[straddle-strangle]]); a 1-year straddle makes or loses money mostly on where the market re-marks 1-year implied volatility. A calendar spread — sell a short option, buy a longer one — is the cleanest way to hold one and short the other ([[calendar-diagonal]]).

### ④ IV crush: attributing an event P&L

For a small change in implied vol, the first-order estimate is

$$
\Delta V \approx \nu \times \Delta\sigma
$$

where \(\Delta V\) is the change in the option's price per share, \(\nu\) the vega per vol point and \(\Delta\sigma\) the change in IV in vol points. For an at-the-money option the estimate stays good even for big moves in IV (the line is straight); for out-of-the-money options it underestimates both gains and losses, because their vega grows with IV.

> [!EXAMPLE] Kai's night, per contract
> The call bought at IV 35% still has vega 0.114 (ATM vega barely depends on IV). The crush is \(\Delta\sigma = -15\) points:
> $$
> \Delta V \approx 0.114 \times (-15) = -1.71 \;\Rightarrow\; -1.71 \times 100 = -\$171
> $$
> The exact reprice gives the same \(-\$171\). A straddle bought the same evening for \(\$7.99\) has twice the vega and loses about \(\$342\) to the crush; with XYZ at $103 it is worth \(\$5.31\), a loss of \(\$269\). It needs XYZ above about $107 the next morning just to break even.

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Waterfall of Kai's earnings P&L: crush, time, move">
<line x1="40" y1="220" x2="620" y2="220" class="fx-axis"/>
<rect x="60" y="74" width="80" height="146" class="fx-box2"/>
<text x="100" y="66" text-anchor="middle" class="fx-t-b">$4.16</text>
<line x1="140" y1="74" x2="180" y2="74" class="fx-line fx-dash"/>
<rect x="180" y="74" width="80" height="60" class="fx-bad"/>
<text x="220" y="108" text-anchor="middle" class="fx-t-bad">−1.71</text>
<line x1="260" y1="134" x2="300" y2="134" class="fx-line fx-dash"/>
<rect x="300" y="134" width="80" height="3" class="fx-bad"/>
<text x="340" y="126" text-anchor="middle" class="fx-t-bad">−0.04</text>
<line x1="380" y1="137" x2="420" y2="137" class="fx-line fx-dash"/>
<rect x="420" y="69" width="80" height="68" class="fx-ok"/>
<text x="460" y="108" text-anchor="middle" class="fx-t-ok">+1.90</text>
<line x1="500" y1="69" x2="540" y2="69" class="fx-line fx-dash"/>
<rect x="540" y="69" width="70" height="151" class="fx-hl"/>
<text x="575" y="61" text-anchor="middle" class="fx-t-b">$4.31</text>
<text x="100" y="238" text-anchor="middle" class="fx-t">paid (IV 35%)</text>
<text x="220" y="238" text-anchor="middle" class="fx-t">IV 35% → 20%</text>
<text x="340" y="238" text-anchor="middle" class="fx-t">one day</text>
<text x="460" y="238" text-anchor="middle" class="fx-t">XYZ 100 → 103</text>
<text x="575" y="238" text-anchor="middle" class="fx-t">worth now</text>
<text x="220" y="30" text-anchor="middle" class="fx-t-sm">vega × Δσ = 0.114 × (−15)</text>
<text x="460" y="30" text-anchor="middle" class="fx-t-sm">delta + gamma at the new IV</text>
<text x="610" y="256" text-anchor="end" class="fx-t-sm">per share; 30-day 100 call; net +$0.15</text>
</svg>
<figcaption>Figure 3 · Kai's earnings trade as a waterfall. The crush removes almost exactly what the move adds. Doing the steps in this order (crush first, then the move at the new IV) makes the pieces add up exactly; with Greeks frozen at the old IV the pieces miss by about 15 cents, because gamma is larger at 20% IV than at 35%.</figcaption>
</figure>

Why does IV fall after the report? Before the event the option's price has to cover one day that might contain a large jump. Once the number is out, that day is gone, and what remains is ordinary volatility. [[term-structure]] showed how to back the event's share out of the curve; [[earnings-events]] turns it into trades. The vega lesson is simpler: **an option bought before a known event is a bet that the move will be bigger than the one already priced**, not a bet on direction.

> [!WARN] "Cheap" options can be expensive vega
> After a crash or before an event, IV is high and every option has a high price per unit of expected move. Buying then means buying vega at a high level; if IV reverts, you lose even if you are right. Selling then collects that high IV — and keeps the full risk of the move you are being paid for.

### ⑤ Vega in a book: tenors, buckets and the state of play

A single option has one vega. A book has a vega **per expiry**, because implied volatilities of different expiries do not move together. In a typical market shock the front of the curve jumps many points while the one-year IV moves a few ([[term-structure]]). Adding every leg's vega into one number hides exactly that.

> [!EXAMPLE] A calendar with "positive vega" that loses when vol rises
> Sell the 30-day 100 call and buy the 60-day 100 call (net debit \(\$1.11\)). Net vega: \(0.161 - 0.114 = +0.047\) per share, \(+\$4.66\) per contract. If every IV rises 2 points the spread gains about \(\$9\) — as vega predicts. But if the front IV rises 4 points and the back only 2 (a common shape of a shock), the spread **loses** about \(\$13.50\) per contract. The short front leg's vega times the bigger front move outweighs the long back leg.

So desks report **vega by tenor bucket** (1 week, 1 month, 3 months, 1 year…) and often a *time-weighted* vega that scales each bucket by a factor such as \(\sqrt{30/\text{days}}\), a rule of thumb for the fact that short-dated IV moves more. The same logic applies across strikes: when the skew steepens, OTM puts gain more vol points than the ATM options ([[smile-skew]]), so a book can be vega-flat overall and still lose on a skew move.

| Position (XYZ, 30-day unless stated) | Vega per contract | Reads as |
|---|---|---|
| Long 100 call or long 100 put | +$11.40 | long vol |
| Long 100 straddle | +$22.79 | long vol, long gamma |
| Short 95/105 strangle | −$15.61 | short vol, short gamma |
| Short 30-day / long 60-day 100 call | +$4.66 | long back vol, short front vol |
| Long 1-year 100 call | +$38.14 | mostly a vega position |

> [!FACT] How far can implied vol move in a day? (as of September 2026)
> The VIX, which is 30-day implied vol of S&P 500 options ([[vix]]), ended August 2026 at 14.92. On 5 August 2024 it traded as high as 65.73 intraday and closed around 38.6 — the largest gap ever between an intraday high and a close (Cboe data via Macroption). A short-vega book marked at the intraday high that day would have shown losses many times its normal daily P&L, then given much of it back by the close. Vega exposure is not a slow-moving risk.

Why this matters for the rest of the course: selling options means being short vega, and on average implied vol has sat above the volatility that followed — for the S&P 500 about 3–4 vol points in long samples — which is the living of option sellers ([[variance-risk-premium]]). The same position loses fast when IV jumps. Vega is the Greek that measures that trade-off.

## @analogy
Think of an insurance policy whose price is reset every morning from a weather service's **"storminess index"**. Your policy (the option) pays only if a storm actually hits, but its *resale price* today depends on how stormy the index says the coming weeks will be.

- **Vega** is how much your policy's resale price moves when the index ticks up one point. A policy that runs for a year reacts much more than one that ends tomorrow — there are many more days for a stormy season to matter.
- **IV crush** is the morning after the forecast event: the hurricane made landfall (or missed), the index falls back to normal, and every policy is repriced lower — even ones that paid out a little.
- **Selling policies** earns the premium, but when the index spikes you have to mark your book at the new, higher prices long before any storm arrives.

Where the analogy breaks: the storminess index is not just a forecast. Implied volatility also contains a **risk premium** — what people will pay to be protected — so it is usually above the volatility that actually arrives ([[variance-risk-premium]]). And there is no "true" index to look up: IV is whatever buyers and sellers agree on, which is why it can jump on fear alone.

## @misconceptions
- **"If I get the direction right, my option makes money."** — Only if the move beats what was already priced. Kai's call gained $1.90 from the move and lost $1.71 to the IV crush. Direction is one bet; vega is another, and you hold both.
- **"Puts have negative vega because they're the bearish option."** — Long puts have positive vega, exactly equal to the vega of the call with the same strike and expiry. Only *short* options have negative vega.
- **"Vega 0.114 means the option rises 11.4% when IV rises 1%."** — It rises by $0.114 per share when IV rises one vol point (20% → 21%). It is a dollar amount, and "1%" means one point of IV, not a 1% relative change.
- **"Short-dated options are the most sensitive to volatility because they move the most."** — They move the most with the *stock* (gamma). Their sensitivity to *implied* vol is small: 0.055 at 7 days versus 0.381 at one year.
- **"My book has zero net vega, so IV changes can't hurt me."** — Net vega adds up different expiries and strikes. A calendar with positive net vega loses when the front IV rises more than the back; a vega-flat book can lose on a skew move.

## @takeaways
- Vega is the change in an option's price per one vol point of implied volatility: \(\nu = S e^{-qT}\varphi(d_1)\sqrt{T}\); the XYZ 30-day ATM call has vega 0.114, \(\$11.40\) per contract.
- Every long option (call or put) is long vega; vega peaks near the money and grows like \(\sqrt{T}\).
- Vega and gamma are the same quantity in different units, \(\nu = \Gamma S^2\sigma T\): short-dated options are gamma, long-dated options are vega.
- An IV crush after an event can cancel a correct directional call; buying before a known event is a bet on a move larger than the one priced.
- In a book, vega must be read per expiry (and per strike), because short-dated and long-dated IV do not move together.

## @quiz
1. The XYZ 30-day 100 call costs $2.45 with vega 0.114. Implied vol rises from 20% to 26%, nothing else changes. The new price is closest to:
   - [ ] $2.52 — vega is a percentage, so the price rises by about 3%
   - [x] $3.13 — about \(6 \times 0.114 = 0.68\) more per share
   - [ ] $9.29 — six points is six times the price
   - [ ] $2.45 — the stock did not move, so the option did not either
   > Vega is dollars per vol point: \(2.45 + 6 \times 0.114 \approx 3.13\), i.e. \(+\$68\) per contract. For an at-the-money option this linear estimate is very accurate. The stock does not need to move for vega to pay.
2. Which XYZ option (σ 20%) has the largest vega?
   - [ ] the 7-day 100 call
   - [ ] the 30-day 100 call
   - [x] the 1-year 100 call
   - [ ] the 30-day 110 call
   > Vega peaks near the money and grows like \(\sqrt{T}\): 0.055 (7 days), 0.114 (30 days), 0.381 (1 year); the 30-day 110 call is out of the money, with vega 0.033.
3. Kai bought the 30-day 100 call at IV 35% for $4.16. After earnings XYZ is up 3% and IV is back at 20%; the call is worth $4.31. What best explains the tiny profit?
   - [x] About $1.71 of value was lost to the fall in implied vol, offsetting most of the $1.90 gained from the move
   - [ ] Theta: one day of decay costs about $1.71 for this option
   - [ ] Delta was lower than expected because the option was out of the money
   - [ ] The option was a put, so the rise hurt it
   > The IV crush of 15 points times vega 0.114 is about \(-\$1.71\). One day of theta is only about \(-\$0.04\). The move added about \(+\$1.90\) (delta and gamma at the new IV). Net \(+\$0.15\).
4. A calendar (short 30-day 100 call, long 60-day 100 call) has net vega of +$4.66 per contract. The next day front-month IV rises 4 points and 60-day IV rises 2 points. The spread most likely:
   - [ ] gains about $28, because vega is positive and IV rose
   - [ ] is unchanged, because the two legs cancel
   - [ ] gains about $9, as for a parallel 2-point rise
   - [x] loses money, because the short front leg's vega meets the bigger IV move
   > Net vega assumes every IV moves by the same amount. Here the short leg loses \(0.114 \times 4\) per share while the long leg gains only \(0.161 \times 2\): a loss of about \(\$13.50\) per contract. That is why books report vega per expiry.
5. What is the sign of the vega of a long put?
   - [ ] negative, because puts profit when the stock falls
   - [x] positive, and equal to the vega of the call with the same strike and expiry
   - [ ] zero, because puts depend only on the strike
   - [ ] positive for out-of-the-money puts, negative for in-the-money puts
   > By put-call parity \(C - P = S - Ke^{-rT}\), which has no σ, so \(\partial C/\partial\sigma = \partial P/\partial\sigma\). Every long option is long volatility.

## @further
- [Greeks (finance) — Wikipedia](https://en.wikipedia.org/wiki/Greeks_(finance)) — vega and its relatives with formulas, including the vega–gamma relationship.
- [Cboe VIX methodology (PDF)](https://cdn.cboe.com/resources/vix/VIX_Methodology.pdf) — how the best-known implied-vol index is built from option prices.
- [Carr & Wu (2009), Variance Risk Premiums](https://academic.oup.com/rfs/article-abstract/22/3/1311/1581057) — evidence that index implied variance sits above realized variance on average: the reason being short vega pays, until it doesn't.
- [Options Industry Council — education](https://www.optionseducation.org/) — free courses on the Greeks and on volatility, from the industry's education arm.

## @next
Stock price, time and volatility are covered. One Black-Scholes input is still sitting quietly in the corner: the interest rate — along with its cousins, dividends and borrow costs. For a 30-day option they barely matter; for a two-year option a few points of rates can move the price by more than a dollar. The next lesson asks when carry stops being a rounding error.
