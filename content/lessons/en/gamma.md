---
id: gamma
prereqs: linear-vs-convex, greeks-map, delta
demo: gamma
---

# Gamma: The Acceleration of Delta

## @hook
Gamma is how fast delta changes when the stock moves. It is the reason a hedged long option makes money whether the stock jumps up or down, the reason the last day before expiry is so violent, and the reason a short option can lose two months of income in one gap. For Kai's 30-day call it is 0.069; with one day left it is 0.381.

## @bridge
[[delta]] showed that delta slides along an S-shaped curve, and that a delta hedge only holds until the next move. In [[greeks-map]] the term \(\tfrac12\Gamma(\dd S)^2\) quietly added $0.14 to Kai's day. Back in [[linear-vs-convex]] we said options are *convex* — gains accelerate, losses decelerate. This lesson puts a number on that curvature and follows it through time. It builds Idea ① (shape: gamma *is* convexity) and Idea ④ (risk: long gamma and short gamma are opposite ways to live).

## @intuition
Kai's 30-day XYZ 100 call has delta 0.534 and **gamma 0.069** (XYZ at $100, implied volatility 20%, rate 4%; illustrative). Gamma answers one question: **when XYZ moves $1, how much does delta move?**

- XYZ rises to $101 → delta rises by about 0.069, to **0.603** (exact: 0.602).
- XYZ falls to $99 → delta falls by about 0.069, to 0.465 (exact: 0.464).

If delta is speed, gamma is acceleration. Per contract, Kai's call gains about **7 more share-equivalents** of delta for each $1 up and sheds 7 for each $1 down. That is exactly what you want when you own an option: more exposure as the stock moves your way, less as it moves against you.

Now strip out the direction. In [[delta]] we held one call and sold 53.4 shares against it. An instant $2 jump up earned the pair $0.135; a $2 drop earned $0.140. Gamma predicts both:

$$
\tfrac12\,\Gamma\,(\dd S)^2 = \tfrac12 \times 0.069 \times 2^2 = 0.139
$$

Where \(\dd S\) is the stock move and \(\Gamma\) the gamma before the move. That is about $14 per contract, **whichever way XYZ jumps**. Because the move is squared, the sign doesn't matter — only the size.

<figure>
<svg viewBox="0 0 640 230" role="img" aria-label="P&L of a delta-hedged long call against an instant stock move: a smile">
<defs><marker id="gamma-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<polygon points="60,190 60,53 71,64 82,74 93,84 103,93 114,102 125,111 136,119 147,127 158,135 168,142 179,148 190,154 201,160 212,165 223,170 233,174 244,178 255,181 266,184 277,186 288,188 298,189 309,190 320,190 331,190 342,189 353,188 363,186 374,184 385,181 396,178 407,175 418,171 428,166 439,161 450,156 461,150 472,144 483,138 493,131 504,124 515,116 526,108 537,100 548,92 558,83 569,74 580,65 580,190" class="fx-area-ok"/>
<line x1="50" y1="190" x2="615" y2="190" class="fx-axis" marker-end="url(#gamma-ah)"/>
<line x1="320" y1="205" x2="320" y2="20" class="fx-axis" marker-end="url(#gamma-ah)"/>
<polyline points="60,47 71,59 82,70 93,81 103,91 114,101 125,110 136,118 147,127 158,134 168,141 179,148 190,154 201,160 212,165 223,170 233,174 244,178 255,181 266,184 277,186 288,188 298,189 309,190 320,190 331,190 342,189 353,188 363,186 374,184 385,181 396,178 407,174 418,170 428,165 439,160 450,154 461,148 472,141 483,134 493,127 504,118 515,110 526,101 537,91 548,81 558,70 569,59 580,47" class="fx-line-blue fx-dash"/>
<polyline points="60,53 71,64 82,74 93,84 103,93 114,102 125,111 136,119 147,127 158,135 168,142 179,148 190,154 201,160 212,165 223,170 233,174 244,178 255,181 266,184 277,186 288,188 298,189 309,190 320,190 331,190 342,189 353,188 363,186 374,184 385,181 396,178 407,175 418,171 428,166 439,161 450,156 461,150 472,144 483,138 493,131 504,124 515,116 526,108 537,100 548,92 558,83 569,74 580,65" class="fx-line-thick"/>
<circle cx="407" cy="175" r="4" class="fx-fill-green"/>
<circle cx="233" cy="174" r="4" class="fx-fill-green"/>
<text x="415" y="196" class="fx-t-sm">+2: +0.135</text>
<text x="170" y="196" class="fx-t-sm">−2: +0.140</text>
<text x="60" y="208" text-anchor="middle" class="fx-t-sm">−6</text>
<text x="147" y="208" text-anchor="middle" class="fx-t-sm">−4</text>
<text x="493" y="208" text-anchor="middle" class="fx-t-sm">+4</text>
<text x="580" y="208" text-anchor="middle" class="fx-t-sm">+6</text>
<text x="314" y="137" text-anchor="end" class="fx-t-sm">0.5</text>
<text x="314" y="80" text-anchor="end" class="fx-t-sm">1.0</text>
<text x="612" y="224" text-anchor="end" class="fx-t-sm">instant XYZ move dS ($)</text>
<text x="330" y="32" class="fx-t-sm">P&amp;L per share</text>
<text x="380" y="60" class="fx-t">— exact reprice</text>
<text x="380" y="78" class="fx-t-blue">- - ½ Γ dS²</text>
</svg>
<figcaption>Figure 1 · One 30-day XYZ 100 call hedged with 53.4 short shares, repriced after an instant move. Delta removed the straight line; what remains is a smile. Within ±$3 the parabola \(\tfrac12\Gamma(\dd S)^2\) is almost exact; beyond that the true curve bends less, because gamma itself shrinks away from the strike.</figcaption>
</figure>

Try it yourself: hedge the delta, move the stock, and watch what is left.

::demo[gamma-convexity]

Gamma is not spread evenly. It is **concentrated near the strike** and it **grows as expiry approaches**. The at-the-money 100 call has gamma 0.028 with 180 days left, 0.069 with 30 days, 0.144 with 7 days, and **0.381** on the last day. On that last day, a 50-cent move swings delta from 0.32 to 0.69.

> [!THINK] So does *every* option's gamma explode as expiry approaches?
> Think about an option far from the money — say the 110 call with 7 days left, XYZ at $100.
> ---
> No. Its gamma is **0.0004** — practically zero. With a week left, reaching $110 would take a move of more than three standard deviations, so delta is stuck near 0 and barely changes. Near expiry gamma piles up **around the strike where the stock is**, and drains away from strikes it isn't. "Gamma explodes" is a statement about at-the-money options only.

> [!KAI] Kai is long gamma — and short it
> Kai's lone 100 call is **long gamma**: +6.9 deltas per $1 per contract. But Kai's covered call (100 shares, short the 105 call) is **short gamma**: \(-100 \times 0.052 = -5.2\) per $1. Shares have no gamma, so the short call's gamma is the whole position's. If XYZ rallies hard, the covered call's delta *shrinks* — Kai's upside fades exactly when the stock is running. That is the capped upside of [[covered-call]], seen through gamma.

We'll take it in five parts:

- **① What gamma is**: the formula and why calls and puts share it
- **② The convexity P&L**: \(\tfrac12\Gamma(\dd S)^2\) and dollar gamma
- **③ Where gamma lives**: near the strike, and near expiry
- **④ Long gamma, short gamma**: two opposite ways to live
- **⑤ Gamma in today's market**: 0DTE, dealers and the debate

## @mechanics
### ① What gamma is

Gamma is the second derivative of the option's value with respect to the stock — the slope of the delta curve. In Black-Scholes (no dividends):

$$
\Gamma = \frac{\partial \Delta}{\partial S} = \frac{\partial^2 V}{\partial S^2} = \frac{\varphi(d_1)}{S\,\sigma\sqrt{T}}, \qquad \varphi(x) = \frac{1}{\sqrt{2\pi}}\,e^{-x^2/2}
$$

Where \(\varphi\) is the standard normal density (the bell curve's height), \(d_1\) is the same as in [[delta]], \(S\) the stock price, \(\sigma\) the volatility and \(T\) the time to expiry in years. The denominator \(S\sigma\sqrt{T}\) is the size of a one-standard-deviation move until expiry, in dollars.

> [!EXAMPLE] Kai's call
> \(d_1 = 0.086\), so \(\varphi(0.086) = 0.3975\). The one-standard-deviation move is \(S\sigma\sqrt{T} = 100 \times 0.20 \times \sqrt{30/365} = 5.734\). So
> $$
> \Gamma = \frac{0.3975}{5.734} = 0.0693
> $$
> Check by "bump and reprice": delta is 0.6024 at $101 and 0.4644 at $99, so \(\Gamma \approx (0.6024 - 0.4644)/2 = 0.069\). Per contract, \(0.0693 \times 100 = 6.93\) share-equivalents of delta per $1.

**A call and a put with the same strike and expiry have the same gamma.** Their deltas differ by exactly 1 at every stock price (put-call parity), so the slopes of their delta curves are identical. The 30-day 100 put's gamma is also 0.069. **A long put is long gamma**, just like a long call.

The formula also says gamma is always positive for a long option: \(\varphi > 0\) and \(S\sigma\sqrt{T} > 0\). Owning any vanilla option — call or put — means owning convexity. Selling one means being short it.

### ② The convexity P&L

The expansion from [[greeks-map]] says that after the delta term is hedged away, the next piece of P&L is \(\tfrac12\Gamma(\dd S)^2\). For the hedged 30-day call:

| Instant move \(\dd S\) | Exact hedged P&L | \(\tfrac12\Gamma(\dd S)^2\) | Per contract (exact) |
|---|---|---|---|
| ±1 | +0.034 / +0.035 | 0.035 | about +$3.5 |
| ±2 | +0.135 / +0.140 | 0.139 | about +$14 |
| ±3 | +0.298 / +0.313 | 0.312 | about +$30 |
| ±5 | +0.786 / +0.848 | 0.867 | about +$80 |
| ±10 | +2.639 / +2.973 | 3.466 | about +$264 / +$297 |

(The first number in each pair is the up-move, the second the down-move.) For moves up to a few dollars the estimate is excellent. For big moves it overshoots, because gamma is measured at $100 and fades as the stock runs away from the strike.

Because gamma per $1 means different things for a $20 stock and a $2,000 index, traders often normalize it. **Dollar gamma** measures how many dollars of delta you gain from a 1% move:

$$
\Gamma_{\$} = \underbrace{\Gamma \times 0.01\,S}_{\text{delta change on a 1\% move}} \times \underbrace{S}_{\text{price}} \times \underbrace{100}_{\text{multiplier}} = \frac{\Gamma S^2}{100} \times 100
$$

Where \(0.01\,S\) is a 1% move in dollars, so \(\Gamma \times 0.01\,S\) is how much delta a 1% move adds; multiplying by \(S\) turns shares into dollars, and 100 is the contract multiplier. For Kai's call: \(\tfrac{0.0693 \times 100^2}{100} \times 100 = \$693\). After a 1% rise in XYZ, gamma alone adds about $693 of dollar delta to each contract. Dollar gamma lets a desk add up curvature across stocks priced at $20 and $900.

### ③ Where gamma lives

**Across stock prices**, gamma is a hump centred near the strike (Figure 2). Far in or far out of the money, delta is pinned near 1 or 0 and hardly changes, so gamma is near zero. (Strictly, the peak sits a little below the strike — at about $99.2 for the 30-day call — because of the lognormal shape; for everyday purposes, "at the money" is right.)

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Gamma against the stock price for 7, 30 and 180 days">
<defs><marker id="gamma-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="50" y1="220" x2="615" y2="220" class="fx-axis" marker-end="url(#gamma-ah2)"/>
<line x1="60" y1="228" x2="60" y2="15" class="fx-axis" marker-end="url(#gamma-ah2)"/>
<line x1="330" y1="25" x2="330" y2="220" class="fx-line fx-dash"/>
<polyline points="60,217 69,216 78,215 87,214 96,213 105,212 114,210 123,209 132,207 141,205 150,204 159,202 168,200 177,198 186,196 195,195 204,193 213,191 222,190 231,189 240,188 249,187 258,186 267,185 276,185 285,185 294,185 303,185 312,186 321,186 330,187 339,188 348,189 357,190 366,191 375,193 384,194 393,195 402,197 411,198 420,199 429,201 438,202 447,203 456,205 465,206 474,207 483,208 492,209 501,210 510,211 519,212 528,213 537,213 546,214 555,215 564,215 573,216 582,216 591,217 600,217" class="fx-line-blue"/>
<polyline points="60,220 69,220 78,220 87,220 96,220 105,220 114,220 123,220 132,220 141,220 150,220 159,220 168,220 177,219 186,219 195,218 204,216 213,214 222,211 231,206 240,200 249,193 258,185 267,176 276,166 285,157 294,149 303,143 312,139 321,137 330,138 339,141 348,146 357,153 366,161 375,169 384,178 393,185 402,192 411,199 420,204 429,208 438,211 447,214 456,216 465,217 474,218 483,219 492,219 501,219 510,220 519,220 528,220 537,220 546,220 555,220 564,220 573,220 582,220 591,220 600,220" class="fx-line-thick"/>
<polyline points="60,220 69,220 78,220 87,220 96,220 105,220 114,220 123,220 132,220 141,220 150,220 159,220 168,220 177,220 186,220 195,220 204,220 213,220 222,220 231,220 240,220 249,219 258,218 267,213 276,204 285,185 294,156 303,119 312,82 321,56 330,49 339,64 348,94 357,130 366,163 375,188 384,204 393,213 402,217 411,219 420,220 429,220 438,220 447,220 456,220 465,220 474,220 483,220 492,220 501,220 510,220 519,220 528,220 537,220 546,220 555,220 564,220 573,220 582,220 591,220 600,220" class="fx-line-bad"/>
<text x="54" y="224" text-anchor="end" class="fx-t-sm">0</text>
<text x="54" y="177" text-anchor="end" class="fx-t-sm">0.04</text>
<text x="54" y="129" text-anchor="end" class="fx-t-sm">0.08</text>
<text x="54" y="82" text-anchor="end" class="fx-t-sm">0.12</text>
<text x="54" y="34" text-anchor="end" class="fx-t-sm">0.16</text>
<text x="150" y="238" text-anchor="middle" class="fx-t-sm">80</text>
<text x="240" y="238" text-anchor="middle" class="fx-t-sm">90</text>
<text x="330" y="238" text-anchor="middle" class="fx-t-b">K = 100</text>
<text x="420" y="238" text-anchor="middle" class="fx-t-sm">110</text>
<text x="510" y="238" text-anchor="middle" class="fx-t-sm">120</text>
<text x="612" y="254" text-anchor="end" class="fx-t-sm">XYZ price S</text>
<text x="345" y="50" class="fx-t-bad">7 days: 0.144, a spike</text>
<text x="370" y="132" class="fx-t">30 days: 0.069</text>
<text x="440" y="190" class="fx-t-blue">180 days: 0.028, flat</text>
<text x="72" y="22" class="fx-t-sm">gamma Γ</text>
</svg>
<figcaption>Figure 2 · Gamma of the XYZ 100 call against the stock price. Less time squeezes the same total curvature into a narrower, taller spike around the strike: 180 days is a low mound, 7 days a needle. At $90 or $110 the 7-day option has almost no gamma at all.</figcaption>
</figure>

**Across time**, at-the-money gamma grows like one over the square root of time. At the money \(d_1 \approx 0\), so \(\varphi(d_1) \approx 0.4\) and

$$
\Gamma_{\text{ATM}} \approx \frac{0.4}{S\,\sigma\sqrt{T}}
$$

Where \(0.4 \approx 1/\sqrt{2\pi}\). Cut the time by a factor of 30 and gamma rises by about \(\sqrt{30} \approx 5.5\): from 0.069 at 30 days to 0.381 at one day.

<figure>
<svg viewBox="0 0 640 240" role="img" aria-label="At-the-money gamma for six expiries">
<line x1="60" y1="200" x2="610" y2="200" class="fx-axis"/>
<rect x="80" y="40" width="60" height="160" rx="3" class="fx-bad"/>
<rect x="170" y="139" width="60" height="61" rx="3" class="fx-hl"/>
<rect x="260" y="171" width="60" height="29" rx="3" class="fx-hl"/>
<rect x="350" y="183" width="60" height="17" rx="3" class="fx-box2"/>
<rect x="440" y="188" width="60" height="12" rx="3" class="fx-box2"/>
<rect x="530" y="192" width="60" height="8" rx="3" class="fx-box2"/>
<text x="110" y="32" text-anchor="middle" class="fx-t-b">0.381</text>
<text x="200" y="131" text-anchor="middle" class="fx-t-b">0.144</text>
<text x="290" y="163" text-anchor="middle" class="fx-t-b">0.069</text>
<text x="380" y="175" text-anchor="middle" class="fx-t-b">0.040</text>
<text x="470" y="180" text-anchor="middle" class="fx-t-b">0.028</text>
<text x="560" y="184" text-anchor="middle" class="fx-t-b">0.019</text>
<text x="110" y="218" text-anchor="middle" class="fx-t">1 day</text>
<text x="200" y="218" text-anchor="middle" class="fx-t">7 days</text>
<text x="290" y="218" text-anchor="middle" class="fx-t">30 days</text>
<text x="380" y="218" text-anchor="middle" class="fx-t">90 days</text>
<text x="470" y="218" text-anchor="middle" class="fx-t">180 days</text>
<text x="560" y="218" text-anchor="middle" class="fx-t">1 year</text>
<text x="600" y="30" text-anchor="end" class="fx-t-sm">XYZ 100 call at S = 100, σ 20%</text>
</svg>
<figcaption>Figure 3 · At-the-money gamma by time to expiry. The last day carries 5.5 times the gamma of the 30-day option and 20 times that of the 1-year option. Short-dated options are where curvature — and hedging pain — is concentrated.</figcaption>
</figure>

For an option that is *not* at the money, time works the other way near the end. The 105 call's gamma is 0.044 at 60 days, 0.052 at 30 days, 0.033 at 7 days and zero on the last day. As expiry nears, gamma **migrates to wherever the stock is** and disappears everywhere else.

Volatility has a similar effect to time, because both enter through \(\sigma\sqrt{T}\): at the money, higher volatility means *lower* gamma (a wider distribution spreads the curvature out), while far from the money it can mean higher gamma.

### ④ Long gamma, short gamma

**Long gamma** (you own options) changes how hedging feels. After XYZ rises, your delta has grown, so to stay neutral you *sell* shares — at the higher price. After it falls, your delta has shrunk, so you *buy* shares — at the lower price. Rebalancing a long-gamma position means **selling rallies and buying dips**, and each round trip locks in a small profit. That is the engine of gamma scalping ([[delta-hedging]]).

> [!EXAMPLE] One round trip, long gamma
> Kai holds one 30-day call, hedged with 53.4 short shares at $100. XYZ rises to $102: the call's delta is now 0.667, so the hedge must grow to 66.7 shares — sell 13.3 more at $102. XYZ drifts back to $100: delta is 0.534 again — buy the 13.3 shares back at $100. The call is back where it started (ignoring the passage of time), and the share trades made \(13.3 \times (102 - 100) = \$26.6\). Gamma predicted about \(2 \times 13.9 = \$27.7\) for the two $2 legs. The short-gamma hedger on the other side did the reverse — bought at $102, sold at $100 — and lost about the same amount.

**Short gamma** (you sold options) is the mirror image. After a rally you must *buy* shares high; after a drop you must *sell* low. Each round trip locks in a small loss. The seller is paid for this in advance — the premium, collected day by day as theta.

The danger of short gamma is the **gap**: a move too fast to rebalance. Suppose a market maker is short one 30-day 100 call, hedged with 53.4 shares, and XYZ opens $10 higher after news. The call has risen $7.98, the shares have gained only $5.34: the hedged position loses \(\$2.64\) per share, **$264 per contract**. At $4.36 of theta a day, that one gap costs about **60 days** of time decay.

> [!WARN] Short gamma: small steady gains, rare large losses
> A short-option position that is delta-hedged still loses on every large move, up or down, and the loss grows with the *square* of the move: a $10 gap costs about 20 times a $2 move, not 5 times. Most days the theta income wins; a few days decide the year. Size short-gamma positions for the gap, not for the average day ([[position-sizing]], [[variance-risk-premium]]).

### ⑤ Gamma in today's market

Gamma is why the rest of this course keeps returning to short-dated options.

- **The gamma–theta coin.** No one gives curvature away. The daily theta a long option pays is, in Black-Scholes, exactly the fair price of its gamma — the next lesson turns this into a breakeven daily move of about $1.05 for XYZ ([[theta]]).
- **Dealer gamma.** When market makers as a group are net short gamma, their hedging buys rallies and sells dips and can amplify moves; when they are net long, their hedging leans against moves. Estimates of this "dealer positioning" are widely watched, and just as widely debated ([[dealer-gamma]]).
- **Zero-days-to-expiry options.** Options that expire within hours carry the most extreme at-the-money gamma there is ([[zero-dte]]).

> [!FACT] Short-dated gamma, as of mid-2026
> Same-day (0DTE) options made up a record **66.2% of SPX options volume in July 2026** (Cboe). Whether their gamma destabilises the index is contested. Cboe — an interested party, since it lists the product — estimated in May 2025 that net market-maker gamma hedging in SPX 0DTE is at most about **0.2% of daily SPX liquidity**, and an academic working paper (Dim, Eraker and Vilkov) found market makers' net 0DTE gamma to be on average positive. A Bank of England staff blog (December 2024) discussed channels through which same-day options could add fragility. The fair summary: evidence so far does not show 0DTE gamma to be a systematic crash trigger, but flows are concentrated and the question is open. Likewise, GameStop's January 2021 surge is widely described as a "gamma squeeze", but the SEC staff report (October 2021) did not find evidence of one.

## @analogy
Picture a marble on a curved track.

**Long gamma is a marble in a valley.** Push it left or right and it rolls up the side — it gains height whichever way it goes. The steeper the valley's walls, the more a small push lifts it. That is \(\tfrac12\Gamma(\dd S)^2\): gains from moves in either direction, growing with the square of the push.

**Short gamma is a marble balanced on a hilltop.** It is comfortable while nothing happens, but any push in either direction sends it downhill, and a big push sends it much further than a small one.

**Time reshapes the track.** A long-dated option is a wide, shallow bowl: gentle curvature spread over a broad range. As expiry approaches, the bowl narrows into a sharp V around the strike. A marble sitting at the bottom of that V (an at-the-money option on its last day) is extremely sensitive; a marble sitting far up a straight wall (a far out-of-the-money option) feels no curve at all.

Where the analogy breaks: a real marble can sit in a valley for free. In options, the valley charges rent. Owning curvature costs theta every day, and whether the marble's gains beat the rent depends on how much the stock actually moves — the subject of [[theta]].

## @misconceptions
- **"Gamma is always good for me."** — Only if you are long options. An option seller is short gamma: every large move, in either direction, costs money after hedging, and the cost grows with the square of the move.
- **"Long-dated options have more gamma because they have more time."** — The opposite. At the money, gamma grows as expiry approaches: 0.019 at one year, 0.069 at 30 days, 0.381 at one day for XYZ.
- **"Every option's gamma explodes near expiry."** — Only near the money. The 7-day 110 call has gamma 0.0004; the 105 call's gamma falls to zero on the last day if XYZ is still at $100.
- **"Puts have negative gamma."** — A long put has *positive* gamma, identical to the call at the same strike and expiry. The sign of gamma depends on long vs short, not call vs put.
- **"If I'm delta-hedged, a big move can't hurt me."** — A delta-hedged short option loses on a big move either way: a $10 gap costs about $264 per contract on the 30-day XYZ call.

## @takeaways
- Gamma is the change in delta per $1 move: \(\Gamma = \varphi(d_1)/(S\sigma\sqrt{T})\) — 0.069 for Kai's 30-day call, identical for the put.
- After delta is hedged, what remains is \(\tfrac12\Gamma(\dd S)^2\): a hedged long option gains about $14 per contract on a $2 move either way.
- Gamma is concentrated near the strike and, at the money, grows like \(1/\sqrt{T}\): 0.069 at 30 days, 0.381 at one day; far from the money it vanishes near expiry.
- Long gamma rebalances by selling rallies and buying dips; short gamma does the reverse and is exposed to gaps — one $10 gap ≈ 60 days of theta on the 30-day call.
- Dollar gamma, \(\Gamma S^2/100\) per share, compares curvature across stocks; short-dated (0DTE) options concentrate gamma, and their market impact is debated.

## @quiz
1. Kai's 30-day call has \(\Delta = 0.534\) and \(\Gamma = 0.069\). XYZ rises $2. What is the call's new delta, approximately?
   - [ ] 0.603
   - [ ] 0.534 — delta doesn't change until expiry
   - [x] about 0.67
   - [ ] 0.138
   > \(0.534 + 0.069 \times 2 = 0.672\); the exact value is 0.667. 0.603 is the delta after a $1 move; 0.138 is \(\Gamma \times 2\), the change itself.
2. Kai holds one 30-day call and is short 53.4 shares against it. XYZ jumps $3 instantly — up or down, you don't know which. Roughly what is the hedged position's P&L per contract?
   - [x] About +$31 either way
   - [ ] About +$160 if up, −$160 if down
   - [ ] Zero — the position is hedged
   - [ ] About −$31 either way
   > \(\tfrac12 \times 0.069 \times 3^2 = 0.31\) per share, about $31 per contract (exact: $29.8 up, $31.3 down). Delta removed the direction; the long gamma profits from the size of the move.
3. Which option has the largest gamma? (XYZ at $100, σ 20%)
   - [ ] The 1-year 100 call
   - [ ] The 7-day 110 call
   - [ ] The 30-day 100 call
   - [x] The 1-day 100 call
   > At-the-money gamma grows like \(1/\sqrt{T}\): 0.381 at one day vs 0.069 at 30 days and 0.019 at one year. The 7-day 110 call is far out of the money for its short life, so its gamma is about 0.0004.
4. What is the gamma of the 30-day XYZ 100 **put**, bought outright?
   - [ ] −0.069, because puts have negative gamma
   - [x] +0.069, the same as the call
   - [ ] 0, because puts only have delta
   - [ ] +0.466, the put's delta in absolute value
   > Call and put deltas at the same strike differ by exactly 1, so their delta curves have the same slope. Any long vanilla option is long gamma.
5. A market maker is short one 30-day XYZ 100 call, delta-hedged, collecting $4.36 of theta a day. XYZ gaps up $10 overnight. Which statement is closest?
   - [ ] The hedge protects them completely
   - [ ] They lose about $4.36, one day of theta
   - [x] They lose about $264 per contract — roughly 60 days of theta
   - [ ] They gain, because they hold shares
   > The call rises $7.98 while 53.4 shares gain only $5.34: a loss of \(\$2.64\) per share, $264 per contract. Short gamma loses on large moves either way, in proportion to the square of the move.

## @further
- [Greeks (finance): Gamma — Wikipedia](https://en.wikipedia.org/wiki/Greeks_(finance)#Gamma) — formula, dollar gamma and related second-order Greeks.
- [Dim, Eraker & Vilkov, 0DTEs: Trading, Gamma Risk and Volatility Propagation (SSRN)](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4692190) — evidence on market makers' 0DTE gamma and intraday volatility.
- [Cboe, 0DTEs Decoded: Positioning, Trends, and Market Impact](https://www.cboe.com/insights/posts/0-dt-es-decoded-positioning-trends-and-market-impact) — the exchange's own analysis (an interested party).
- [Bank of England staff blog: Zero-day options and financial market vulnerability](https://bankunderground.co.uk/2024/12/04/zero-day-options-and-financial-market-vulnerability/) — the case for concern, from a central-bank blog.
- [SEC Staff Report on Equity and Options Market Structure Conditions in Early 2021](https://www.sec.gov/files/staff-report-equity-options-market-struction-conditions-early-2021.pdf) — the GameStop episode and the "gamma squeeze" question.

## @next
Owning gamma is valuable — so what does it cost, per day, and how much must the stock move to earn it back? The answer is a single number for XYZ, the same for every strike and expiry: about $1.05 a day. Next: [[theta]].
