---
id: implied-vol
prereqs: black-scholes, bs-assumptions, realized-vol
demo: implied-vol
---

# Implied Volatility: Quoting Options in Vol

## @hook
XYZ's 30-day 100 call trades at $2.45. Which volatility makes Black-Scholes print exactly $2.45? The answer, 20%, is the option's **implied volatility** — and it is how professionals actually quote, compare and trade options. Price and implied vol are the same information in two units; vol is the unit that makes sense.

## @bridge
[[black-scholes]] turned five inputs into a price, and only one of them, σ, was invisible. [[realized-vol]] measured how much the price *did* move — the bill. This lesson runs the formula **backwards**: take the price the market is paying and solve for the σ it implies — the quote. It builds Idea ③ (volatility: implied vol is the quote, realized vol is the bill, the gap is the trader's living), and it sets up everything that follows in this stage: IV differs by strike ([[smile-skew]]) and by expiry ([[term-structure]]), and the VIX is an implied vol for the whole S&P 500 ([[vix]]).

## @intuition
Think of Black-Scholes as a machine with six dials and one display. Five dials are fixed by the market: spot \(S\), strike \(K\), time \(T\), interest rate \(r\) and dividend yield \(q\). The sixth dial, σ, is yours. Turn it and the display — the option's price — goes up or down.

Now look at the option chain. The display is already showing a number: the price people are paying. So turn the σ dial until the machine's display matches the screen. **The σ at which they match is the implied volatility (IV).**

For XYZ's 30-day, 100-strike call (\(S = 100\), \(r = 4\%\), no dividend):

| Market price | Implied volatility |
|---|---|
| $2.00 | 16.0% |
| $2.45 | 20.0% |
| $2.90 | 23.9% |
| $3.50 | 29.2% |
| $4.73 | 40.0% |

Each price maps to exactly one IV, and a higher price always means a higher IV. So “the call costs $2.90” and “the call is trading at 23.9 vol” say the same thing. Why bother with the second version? Because dollar prices are hard to compare, and vols are easy.

<figure>
<svg viewBox="0 0 660 270" role="img" aria-label="Five XYZ options with different prices all imply the same 20% volatility">
<defs><marker id="implied-vol-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<text x="20" y="22" class="fx-t-b">price world (dollars per share)</text>
<text x="470" y="22" class="fx-t-b">vol world</text>
<rect x="20" y="34" width="230" height="36" rx="6" class="fx-box"/>
<text x="32" y="57" class="fx-t">30-day 100 call · $2.45</text>
<rect x="20" y="78" width="230" height="36" rx="6" class="fx-box"/>
<text x="32" y="101" class="fx-t">30-day 100 put · $2.12</text>
<rect x="20" y="122" width="230" height="36" rx="6" class="fx-box"/>
<text x="32" y="145" class="fx-t">30-day 105 call · $0.71</text>
<rect x="20" y="166" width="230" height="36" rx="6" class="fx-box"/>
<text x="32" y="189" class="fx-t">7-day 100 call · $1.14</text>
<rect x="20" y="210" width="230" height="36" rx="6" class="fx-box"/>
<text x="32" y="233" class="fx-t">1-year 100 call · $9.93</text>
<line x1="252" y1="52" x2="318" y2="130" class="fx-line"/>
<line x1="252" y1="96" x2="318" y2="136" class="fx-line"/>
<line x1="252" y1="140" x2="318" y2="140" class="fx-line"/>
<line x1="252" y1="184" x2="318" y2="144" class="fx-line"/>
<line x1="252" y1="228" x2="318" y2="150" class="fx-line"/>
<rect x="320" y="104" width="120" height="72" rx="8" class="fx-hl"/>
<text x="380" y="134" text-anchor="middle" class="fx-t-b">Black-Scholes</text>
<text x="380" y="154" text-anchor="middle" class="fx-t-sm">run backwards</text>
<line x1="442" y1="140" x2="478" y2="140" class="fx-line-thick" marker-end="url(#implied-vol-ah)"/>
<rect x="484" y="112" width="150" height="56" rx="8" class="fx-ok"/>
<text x="559" y="147" text-anchor="middle" class="fx-t-b">σ = 20% for all five</text>
<text x="330" y="262" class="fx-t-sm">spot 100 · rate 4% · no dividend</text>
</svg>
<figcaption>Figure 1 · Five XYZ options, five very different prices — from $0.71 to $9.93 — and a single implied volatility. The dollar price mixes strike, time and volatility together; implied vol strips out strike and time and leaves only “how much movement is being paid for”.</figcaption>
</figure>

$9.93 for the 1-year call is not “more expensive” than $2.45 for the 30-day call in any useful sense: you get twelve times as long. $0.71 for the 105 call is not “cheap”: it is out of the money. Once each price is translated into vol, all five turn out to be priced **identically** — 20%. That is why traders say “trading options is trading volatility”, and why a market maker quotes “20 bid, 20.5 offer” rather than dollars.

> [!KAI] Kai's covered call, repriced
> Kai plans to sell the 30-day 105 call for $0.71. Suppose that when Kai checks the chain, the same call is bid $1.00 instead, with XYZ still at $100 and 30 days to go. Nothing about the stock has changed — so what did? Solve for σ: $1.00 implies **23.2%** instead of 20%. The market is paying for more movement, most likely the earnings announcement. For Kai, as a seller, higher IV means more premium (\(\$1.00 \times 100 = \$100\) instead of $71) — in exchange for the bigger move the market expects.

> [!THINK] The 30-day 100 call trades at $2.45 (20.0% vol). The 30-day 100 put trades at $2.12. What is the put's implied vol?
> Predict it before you open the answer.
> ---
> Also 20%. Put-call parity ([[put-call-parity]]) ties the two prices together: \(C - P = S - Ke^{-rT} = 100 - 99.67 = 0.33\), and indeed \(2.45 - 2.12 = 0.33\). Black-Scholes satisfies parity at any σ, so if the call and put prices obey parity, they must imply the same σ. If the put implied a different vol, you could buy the cheap one, sell the rich one and hedge with stock — a conversion or reversal. So implied vol belongs to a **strike and expiry**, not to “the call” or “the put”.

We'll take it in five parts:

- **① Definition**: why every valid price has exactly one IV
- **② Solving for it**: Newton's method, step by step
- **③ Quoting in vol**: vol points, vega as the exchange rate, bid and ask
- **④ The implied move**: reading the ATM straddle
- **⑤ What IV is and isn't**: forecast plus premium, IV rank and percentile, the state of play

## @mechanics
### ① Definition: one price, one volatility

Implied volatility is the number \(\sigma_{\text{imp}}\) that solves

$$
C_{\text{mkt}} = C_{BS}\!\left(S, K, T, r, q;\ \sigma_{\text{imp}}\right)
$$

where \(C_{\text{mkt}}\) is the market price (usually the mid between bid and ask), \(C_{BS}\) is the Black-Scholes formula of [[black-scholes]], and everything except σ is fixed at today's observable values. The same definition works for puts.

Why is there **exactly one** solution? Because the Black-Scholes price rises steadily with σ: its slope is vega, \(\nu = S\varphi(d_1)\sqrt{T} > 0\) ([[vega]]). A curve that only goes up crosses any horizontal line at most once. It crosses **at least** once as long as the price sits strictly inside the no-arbitrage bounds of [[arbitrage-bounds]]: at σ → 0 the call is worth its discounted intrinsic value \(\max(S - Ke^{-rT}, 0)\), and as σ grows without limit it approaches \(S\).

> [!WARN] Some quotes have no implied vol at all
> XYZ's 30-day 90 call cannot be worth less than \(100 - 90e^{-0.04 \times 30/365} = \$10.30\). If a screen shows a last trade of $10.20 (a stale print, or a quote from before a dividend adjustment), no σ reproduces it — the solver fails or returns garbage. The same happens with crossed or stale quotes and with deep in-the-money options whose time value is a fraction of a cent. Always compute IV from a sensible **mid**, check the bounds first, and be suspicious of any IV computed from a last trade.

### ② Solving for it: Newton's method

There is no closed-form inverse of Black-Scholes, so IV is found numerically. The standard tool is **Newton's method**: guess, see how far off the price is, and use the slope (vega) to correct the guess.

$$
\sigma_{n+1} = \sigma_n - \frac{C_{BS}(\sigma_n) - C_{\text{mkt}}}{\nu(\sigma_n)}
$$

where \(\sigma_n\) is the current guess, \(C_{BS}(\sigma_n)\) the model price at that guess, and \(\nu(\sigma_n)\) the vega at that guess **per unit of σ** (per 1.00, so 100 times the per-vol-point vega). Geometrically: slide along the tangent line of the price-vs-σ curve until it hits the market price.

> [!EXAMPLE] Kai's 105 call at $1.00
> \(S = 100,\ K = 105,\ T = 30/365,\ r = 4\%\), market price $1.00, first guess \(\sigma_0 = 20\%\):
>
> | Step | Guess σ | BS price | Vega (per 1.00) | Price error |
> |---|---|---|---|---|
> | 0 | 20.000% | 0.7130 | 8.536 | −0.2871 |
> | 1 | 23.363% | 1.0134 | 9.284 | +0.0134 |
> | 2 | 23.219% | 1.0000 | 9.258 | +0.0000 |
>
> First step: \(\sigma_1 = 0.20 - \dfrac{0.7130 - 1.00}{8.536} = 0.20 + 0.0336 = 0.2336\). Second step: \(\sigma_2 = 0.2336 - \dfrac{0.0134}{9.284} = 0.2322\). Two steps give the implied vol to four decimals: **23.22%**.

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Newton's method on the price-versus-volatility curve">
<line x1="60" y1="220" x2="610" y2="220" class="fx-axis"/>
<line x1="60" y1="30" x2="60" y2="220" class="fx-axis"/>
<line x1="60" y1="180" x2="610" y2="180" class="fx-grid"/>
<line x1="60" y1="100" x2="610" y2="100" class="fx-grid"/>
<line x1="60" y1="60" x2="610" y2="60" class="fx-grid"/>
<text x="52" y="224" text-anchor="end" class="fx-t-sm">0</text>
<text x="52" y="184" text-anchor="end" class="fx-t-sm">0.50</text>
<text x="52" y="144" text-anchor="end" class="fx-t-sm">1.00</text>
<text x="52" y="104" text-anchor="end" class="fx-t-sm">1.50</text>
<text x="52" y="64" text-anchor="end" class="fx-t-sm">2.00</text>
<text x="60" y="238" text-anchor="middle" class="fx-t-sm">10%</text>
<text x="168" y="238" text-anchor="middle" class="fx-t-sm">15%</text>
<text x="276" y="238" text-anchor="middle" class="fx-t-sm">20%</text>
<text x="384" y="238" text-anchor="middle" class="fx-t-sm">25%</text>
<text x="492" y="238" text-anchor="middle" class="fx-t-sm">30%</text>
<text x="600" y="238" text-anchor="middle" class="fx-t-sm">35%</text>
<text x="600" y="254" text-anchor="end" class="fx-t-sm">volatility σ</text>
<line x1="60" y1="140" x2="610" y2="140" class="fx-line-bad fx-dash"/>
<text x="604" y="134" text-anchor="end" class="fx-t-bad">market price $1.00</text>
<polyline points="60,214.4 82,211.4 103,207.8 125,203.6 146,198.9 168,193.8 190,188.2 211,182.4 233,176.2 254,169.7 276,163.0 298,156.0 319,148.9 341,141.6 362,134.2 384,126.6 406,118.9 427,111.1 449,103.1 470,95.1 492,87.0 514,78.9 535,70.6 557,62.3 578,54.0 600,45.6" class="fx-line-thick"/>
<line x1="189.6" y1="190.3" x2="384" y2="128.8" class="fx-line-hl fx-dash"/>
<circle cx="276" cy="163" r="6" class="fx-fill-orange"/>
<circle cx="348.6" cy="140" r="5" class="fx-fill-blue"/>
<line x1="345.5" y1="140" x2="345.5" y2="220" class="fx-line-muted fx-dash"/>
<circle cx="345.5" cy="140" r="4" class="fx-fill-green"/>
<text x="266" y="156" text-anchor="end" class="fx-t-hl">guess 20% → $0.713</text>
<text x="360" y="162" class="fx-t-blue">tangent lands at 23.36%</text>
<text x="352" y="210" class="fx-t-ok">IV = 23.22%</text>
<text x="70" y="44" class="fx-t-sm">XYZ 30-day 105 call: price as a function of σ</text>
</svg>
<figcaption>Figure 2 · The call's price rises smoothly with σ, so it crosses the market price exactly once. Newton's method starts at the guess (20%), follows the tangent — whose slope is vega — to where it reaches $1.00 (23.36%), and lands within 0.15 vol points of the answer in one step. The curve is nearly straight here, which is why Newton converges so fast.</figcaption>
</figure>

A good first guess helps. For an at-the-money option, invert the rule of thumb \(C \approx 0.4\,S\sigma\sqrt{T}\) from [[black-scholes]]: \(\sigma_0 \approx C/(0.4\,S\sqrt{T})\). For the $2.45 call that gives \(2.45/(0.4 \times 100 \times 0.287) = 21.4\%\) — close to the true 20.0% (the gap is the interest-rate effect the rule ignores).

Newton has one failure mode: **far out of the money, vega is tiny**. XYZ's 30-day 80 put has a vega of about 0.00004 per vol point at 20%; dividing by it turns a small price error into an enormous σ jump. Careful solvers therefore keep a bracket \([\sigma_{\text{lo}}, \sigma_{\text{hi}}]\) and fall back to **bisection** (halve the bracket) whenever Newton would jump outside it. Bisection is slow — starting from a 0–300% bracket it takes about 15 halvings to pin σ down to 0.0001 — but it cannot fail. The main demo shows both.

> [!DEEP] What production systems do
> Exchanges and banks invert millions of prices a second. The price is extremely flat in σ for deep out-of-the-money options and extremely steep in σ for options whose time value is tiny, so naive Newton breaks exactly where precision matters. Peter Jäckel's “Let's Be Rational” (2015) method transforms the problem so that a couple of iterations of a higher-order method reach machine precision for any strike and expiry. Libraries that price American options add a further layer: they solve for the σ that makes a tree or finite-difference price ([[binomial-trees]]) match the market, which is slower.

### ③ Quoting in vol: vol points and vega

A **vol point** is one percentage point of implied volatility (20% → 21%). **Vega** is the exchange rate between the two units: it says how many dollars one vol point is worth.

$$
\Delta C \approx \nu \times \Delta\sigma_{\text{imp}}
$$

where \(\nu\) is vega per vol point and \(\Delta\sigma_{\text{imp}}\) the change in implied vol in points. For the 30-day 100 call, \(\nu = 0.114\): one vol point is worth about 11 cents per share, $11.40 per contract. Check: at 21% the call is worth $2.565, versus $2.451 at 20%.

The same exchange rate converts a **bid–ask spread** into vol. Suppose the 100 call is quoted $2.40 bid, $2.50 ask. In vol that is 19.55% bid, 20.43% ask — a spread of \(0.10/0.114 \approx 0.9\) vol points. That is how a market maker reads a quote: “19½ – 20½”.

Why is vol the better unit?

- **Comparable across strikes and expiries.** The table in the intuition: $0.71, $2.45 and $9.93 are all 20%.
- **Comparable across underlyings.** A $5 option on a $50 stock and a $5 option on a $500 stock mean nothing side by side; 35% vol versus 18% vol does.
- **Stable while spot moves.** The dollar price of an option changes with every tick in the stock; its implied vol changes far less. Quoting in vol lets a market maker keep a quote alive while the stock moves, and update the dollar price automatically.
- **It is what you are really trading.** If you hedge away the direction ([[delta-hedging]]), what's left is a bet that realized vol will beat (or fall short of) the implied vol you paid.

### ④ The implied move: reading the ATM straddle

The most useful single number on a chain is the price of the **at-the-money straddle** (buy the call and the put at the same strike). From [[black-scholes]], each leg is worth about \(0.4\,S\sigma\sqrt{T}\), so the straddle is about \(0.8\,S\sigma\sqrt{T}\) (more precisely \(\sqrt{2/\pi} \approx 0.798\)). Turn that around:

$$
\sigma_{\text{imp}} \approx \frac{\text{straddle}}{0.8\,S\sqrt{T}}, \qquad \text{implied 1-sd move} = S\,\sigma_{\text{imp}}\sqrt{T} \approx 1.25 \times \text{straddle}
$$

where “straddle” is the price of the ATM call plus the ATM put and \(S\sigma\sqrt{T}\) is the one-standard-deviation move to expiry.

> [!EXAMPLE] XYZ's 30-day straddle
> Call $2.45 + put $2.12 = straddle **$4.57**. Then \(\sigma_{\text{imp}} \approx 4.57/(0.8 \times 100 \times 0.2867) = 19.9\%\) (exact: 20.0%), and the implied one-standard-deviation move is \(1.25 \times 4.57 \approx \$5.71\) (exact: \(100 \times 0.20 \times 0.2867 = \$5.73\)).
> - The straddle's breakevens are \(100 \pm 4.57\): $95.43 and $104.57.
> - If XYZ really moves with 20% vol, it finishes beyond one of the breakevens about 43% of the time (risk-neutral lognormal), and within ±$5.73 about 68% of the time.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Distribution of XYZ in 30 days with the straddle breakevens and the one-standard-deviation band">
<polygon points="252.6,200 252.6,103.0 259.4,94.1 266.1,85.3 272.9,77.0 279.6,69.1 286.4,62.0 293.1,55.6 299.9,50.3 306.6,45.9 313.4,42.8 320.1,40.8 326.9,40.0 333.6,40.4 340.4,42.1 347.1,44.8 353.9,48.7 360.6,53.5 367.4,59.1 374.1,65.5 380.9,72.5 387.6,79.9 394.4,87.7 401.1,95.6 407.4,103.0 407.4,200" class="fx-area-hl"/>
<polyline points="60.0,199.9 73.5,199.8 87.0,199.6 100.5,199.1 114.0,198.3 127.5,196.9 141.0,194.6 154.5,191.0 168.0,185.8 181.5,178.5 195.0,168.8 208.5,156.6 222.0,142.1 235.5,125.5 249.0,107.8 262.5,90.0 276.0,73.3 289.5,59.0 303.0,48.1 316.5,41.7 330.0,40.0 343.5,43.2 357.0,50.8 370.5,62.0 384.0,75.9 397.5,91.3 411.0,107.3 424.5,122.9 438.0,137.5 451.5,150.5 465.0,161.7 478.5,171.0 492.0,178.6 505.5,184.5 519.0,189.0 532.5,192.4 546.0,194.8 559.5,196.5 573.0,197.7 586.5,198.5 600.0,199.1" class="fx-line-hl"/>
<line x1="50" y1="200" x2="610" y2="200" class="fx-axis"/>
<line x1="268.3" y1="30" x2="268.3" y2="200" class="fx-line-bad fx-dash"/>
<line x1="391.7" y1="30" x2="391.7" y2="200" class="fx-line-bad fx-dash"/>
<text x="264" y="24" text-anchor="end" class="fx-t-bad">BE 95.43</text>
<text x="396" y="24" class="fx-t-bad">BE 104.57</text>
<text x="330" y="140" text-anchor="middle" class="fx-t-b">±1 sd</text>
<text x="330" y="156" text-anchor="middle" class="fx-t-sm">(94.27 – 105.73)</text>
<text x="330" y="172" text-anchor="middle" class="fx-t-sm">≈ 68%</text>
<text x="150" y="120" text-anchor="middle" class="fx-t-sm">below 95.43: ≈ 20%</text>
<text x="510" y="120" text-anchor="middle" class="fx-t-sm">above 104.57: ≈ 23%</text>
<text x="60" y="218" text-anchor="middle" class="fx-t-sm">80</text>
<text x="195" y="218" text-anchor="middle" class="fx-t-sm">90</text>
<text x="330" y="218" text-anchor="middle" class="fx-t-sm">100</text>
<text x="465" y="218" text-anchor="middle" class="fx-t-sm">110</text>
<text x="600" y="218" text-anchor="middle" class="fx-t-sm">120</text>
<text x="600" y="238" text-anchor="end" class="fx-t-sm">XYZ in 30 days (risk-neutral, σ = 20%)</text>
</svg>
<figcaption>Figure 3 · The straddle price is the market's quote for the size of the move. XYZ's $4.57 straddle implies a one-standard-deviation range of about ±$5.73 (shaded, about 68%). The breakevens sit a little inside that band; the stock ends beyond one of them about 43% of the time if it moves exactly as implied.</figcaption>
</figure>

Try it with any straddle price and expiry:

::demo[implied-vol-move]

This is the most practical use of IV for non-specialists. Before an earnings report, the front-month straddle is bid up: if XYZ's 30-day straddle trades at $6.00 instead of $4.57, the implied vol is about 26.3% and the market is pricing a one-standard-deviation move of roughly $7.50. How much of that is the earnings day itself — and how it collapses afterwards (“IV crush”) — is the topic of [[term-structure]] and [[earnings-events]].

### ⑤ What IV is and isn't

**It is a price, not a prophecy.** Implied vol is the volatility at which option buyers and sellers agree to trade. It blends the market's forecast of realized vol with a **risk premium**: sellers of options are selling insurance against large moves and want to be paid for it. That's why, for stock indexes, implied vol has on average been above the realized vol that followed — the [[variance-risk-premium]].

> [!FACT] The quote versus the bill, and where the quote stood (as of August 2026)
> For the S&P 500 the quote has run about 4 vol points above the bill on average since 1990 — the VIX gap already met in [[realized-vol]] (CFA Institute, July 2024); the VIX itself, a 30-day implied vol built from a strip of options, is taken apart in [[vix]]. The VIX ended August 2026 at 14.92 (Cboe); its highest close ever was 82.69 on 16 March 2020. For bitcoin, Deribit's DVOL index (launched March 2021) plays the same role; a DVOL reading divided by about 19 (\(\sqrt{365}\)) gives the implied one-day move.

**It belongs to one strike and one expiry.** If Black-Scholes were exactly right, every option on XYZ would imply the same σ. In real markets, out-of-the-money puts imply more than at-the-money options (the skew, [[smile-skew]]), and different expiries imply different vols (the term structure, [[term-structure]]). “XYZ's IV” in casual talk usually means the 30-day at-the-money IV.

**It needs context.** Is 30% high? For a utility stock, very; for a small biotech, it's the floor. Two standard ways to put today's IV in its own history:

$$
\text{IV rank} = \frac{\text{IV}_{\text{today}} - \text{IV}_{\min}}{\text{IV}_{\max} - \text{IV}_{\min}}, \qquad \text{IV percentile} = \frac{\#\{\text{days with IV below today's}\}}{\#\{\text{days}\}}
$$

where the minimum, maximum and day count all refer to a look-back window, usually one year. If XYZ's IV is 22% and last year's range was 12% to 40%, the IV rank is \((22 - 12)/(40 - 12) = 36\%\). Rank is easily distorted by one spike: if IV lived between 14% and 22% all year except for one panic at 45%, today's 25% has a rank of only \((25 - 14)/(45 - 14) = 35\%\), yet it may be higher than on 95% of the year's days. Percentile is the harder of the two to distort. Compare them yourself:

::demo[implied-vol-rank]

Neither number is a trading signal on its own. Volatility does tend to mean-revert, which is why these measures are popular, but IV is often high for a reason (an event, a regime change), and the right comparison is with the realized vol you expect next ([[realized-vol]], [[vol-forecasting]]).

## @analogy
Implied volatility works like the **yield on a bond**. A bond's price in dollars is awkward to compare: a 2-year zero-coupon bond at $92 and a 10-year one at $64 — which is cheaper? Nobody can tell until each price is converted into a yield with a standard formula: about 4.3% versus 4.6% a year. The yield isn't a forecast of anything in particular; it's the price, re-expressed in a unit that strips out maturity and coupon so that bonds can be compared, quoted and traded against each other. Traders then say “the 10-year is at 4.6” instead of “the 10-year is at 64”.

Implied vol does the same job for options. The formula is Black-Scholes instead of the bond-pricing formula; the input you back out is σ instead of the yield; and what gets stripped out is strike and time instead of maturity and coupon. A 30-day call at $2.45 and a 1-year call at $9.93 are, once converted, both “at 20”.

Where the analogy breaks: a bond's yield is the return you actually lock in if you hold to maturity and nothing defaults. Nothing locks in implied vol. What an option holder earns depends on the *realized* volatility that shows up afterwards, and on how they hedge. Implied vol is the price of that future movement — not a promise of it.

## @misconceptions
- **“High implied vol means the market thinks the stock will fall.”** — IV measures the expected size of moves, not their direction; the straddle pays for moves either way. (For stock indexes, IV does tend to rise when prices fall — the negative spot–vol link behind the skew in [[smile-skew]] — but IV itself carries no directional call.)
- **“Implied vol is the market's forecast of future volatility.”** — It is a forecast plus a risk premium. On average, index IV has sat several points above the realized vol that followed; treating IV as an unbiased forecast leads to systematically wrong trades.
- **“A cheap option (in dollars) has low implied vol.”** — Dollar cheapness is mostly strike and time. XYZ's $0.14 110 call and $9.93 1-year call are both priced at 20% vol. Compare options in vol, not in dollars.
- **“Calls and puts at the same strike can have different IVs, so buy the cheaper one.”** — For European options, put-call parity forces the same IV; if they differ, a conversion or reversal arbitrage closes the gap. Small differences in American options come from early exercise, dividends, borrow costs or stale quotes — not free money.
- **“The IV on my screen is exact.”** — It depends on inputs you didn't see: which price (bid, ask, mid, last), which rate, which dividend forecast, which model (European or American). Two platforms can show different IVs for the same option at the same moment.

## @takeaways
- Implied vol is the σ that makes Black-Scholes reproduce the market price; because the price rises monotonically with σ, each valid price has exactly one IV.
- It is found numerically: Newton's method uses vega as the slope and converges in two or three steps near the money; bisection is the safe fallback far from it.
- Traders quote and compare options in vol points; vega converts vol points into dollars (XYZ 30-day ATM: one point ≈ 11 cents per share).
- The ATM straddle reads the implied move directly: \(\sigma \approx \text{straddle}/(0.8\,S\sqrt{T})\), one-standard-deviation move ≈ \(1.25 \times\) straddle.
- IV is a price, not a prophecy: it contains a risk premium, differs by strike and expiry, and needs its own history (rank, percentile) and realized vol for context.

## @quiz
1. XYZ is still at $100 and nothing else changes, but its 30-day 100 call rises from $2.45 to $2.90. What happened to the call's implied volatility?
   - [ ] It stayed at 20%, because implied vol is a property of the stock
   - [ ] It fell, because a pricier option has less room to rise
   - [x] It rose, to about 23.9%
   - [ ] It can't be determined without knowing the put's price
   > The Black-Scholes price increases with σ, so a higher price with everything else fixed means a higher IV: $2.90 corresponds to about 23.9%. Price and IV are the same information in two units.
2. The 30-day 100 call trades at $2.45 (IV 20%) and the 30-day 100 put at $2.12, with \(S = 100\) and \(Ke^{-rT} = 99.67\). What is the put's implied volatility?
   - [x] 20%, because prices that satisfy put-call parity imply the same volatility
   - [ ] About 17%, because the put is cheaper than the call
   - [ ] About 23%, because puts always carry higher IV than calls
   - [ ] It can't be solved, because puts have no implied volatility
   > \(C - P = 0.33 = 100 - 99.67\), so parity holds. Black-Scholes satisfies parity at every σ, so a call and put at the same strike and expiry that obey parity must share one IV. (The higher IV of puts in the skew is across strikes, not between a call and a put at the same strike.)
3. The 30-day 100 call is quoted $2.40 bid, $2.50 ask, and its vega is 0.114 per vol point. About how wide is the market in vol terms?
   - [ ] 0.1 vol points
   - [ ] 4 vol points
   - [ ] 11.4 vol points
   - [x] About 0.9 vol points
   > Spread in vol ≈ spread in dollars ÷ vega \(= 0.10/0.114 \approx 0.88\) points: roughly 19.6% bid, 20.4% ask. Vega is the exchange rate between dollars and vol points.
4. XYZ is at $100 and its 30-day at-the-money straddle costs $6.00. Roughly what one-standard-deviation move is the market pricing to expiry?
   - [ ] $4.80, because the move is 0.8 times the straddle
   - [x] About $7.50, because the move is about 1.25 times the straddle
   - [ ] $6.00, the straddle price itself
   - [ ] $12.00, twice the straddle
   > Straddle \(\approx 0.8\,S\sigma\sqrt{T}\), so \(S\sigma\sqrt{T} \approx \text{straddle}/0.8 = 7.50\). That corresponds to an implied vol of about 26% (versus 20% at a $4.57 straddle).
5. XYZ's implied vol is 22% today. Over the past year it ranged from 12% to 40%. What is its IV rank?
   - [ ] 22%
   - [ ] 55%
   - [x] About 36%
   - [ ] 64%
   > IV rank \(= (22 - 12)/(40 - 12) = 10/28 \approx 36\%\): today's IV sits about a third of the way up the year's range. IV percentile, which counts days, can differ a lot from rank when one spike sets the maximum.

## @further
- [Implied volatility — Wikipedia](https://en.wikipedia.org/wiki/Implied_volatility) — definition, uniqueness and numerical methods, including Newton and bisection.
- [Cboe VIX methodology (PDF)](https://cdn.cboe.com/resources/vix/VIX_Methodology.pdf) — how the best-known implied-vol index is built from a strip of SPX options.
- [How well does the market predict volatility? (CFA Institute, 2024)](https://blogs.cfainstitute.org/investor/2024/07/31/how-well-does-the-market-predict-volatility/) — implied (VIX) versus subsequent realized volatility since 1990.
- [DVOL — Deribit's implied volatility index](https://insights.deribit.com/exchange-updates/dvol-deribit-implied-volatility-index/) — the crypto counterpart of the VIX and how to convert it to a daily move.
- [Options Industry Council — education](https://www.optionseducation.org/) — plain-language material on implied volatility, vega and the straddle-implied move.

## @next
If Black-Scholes were exactly right, every strike on XYZ would imply the same 20%. Plot the implied vols of a real chain against strike and you get a curve instead — puts below the money cost several vol points more. Why does the market draw that curve, and what does it tell you?
