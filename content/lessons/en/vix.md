---
id: vix
prereqs: implied-vol, smile-skew, term-structure, risk-neutral-density
demo: vix
---

# The VIX & the Volatility Complex

## @hook
"VIX 20" is not a poll of fear; it is a price. Take a month of S&P 500 options, weight every out-of-the-money one by \(1/K^2\), add them up, and you have the cost of 30 days of variance; the VIX is its square root, times 100. Once you know the recipe you can read the number — and you will see why the thing everyone calls "the VIX" is not something you can buy.

## @bridge
[[implied-vol]] turned one option into one volatility. [[term-structure]] showed that total variance adds up over time, which is how a 30-day point is interpolated between two expiries. [[risk-neutral-density]] showed that a strip of option prices across strikes encodes the whole risk-neutral distribution. The VIX combines all three: a **model-free** measure of the 30-day variance of the S&P 500, built from the full strip of SPX options. This lesson answers three questions — how the number is built, how to read it, and what you can actually trade — and it builds Idea ③, volatility as something with its own price.

## @intuition
Kai hears on the evening news that "the VIX closed near 15" (it ended August 2026 at 14.92, per Cboe). What does that number say?

**Read it as an annualized volatility.** VIX 15 means the options market is pricing the S&P 500's volatility over the next 30 days at about 15% a year. Everything you learned about \(\sigma\) applies:

- **Over 30 days**, one standard deviation is \(15\% \times \sqrt{30/365} \approx 4.3\%\). At VIX 20 it would be \(20\% \times 0.287 = 5.73\%\) — exactly the one-month move of Kai's XYZ at 20% vol.
- **Over one trading day**, divide by \(\sqrt{252} \approx 15.9\), or just by 16: VIX 16 is about a 1% daily move, VIX 32 about 2%. Traders call this the **rule of 16**.

::demo[vix-rule16]

> [!THINK] The VIX jumps from 16 to 40 in a week. Roughly how big is a "normal" day for the S&P 500 now, and how often would you expect a 5% day?
> Use the rule of 16, then think in standard deviations.
> ---
> A typical (one-standard-deviation) day is now about \(40/16 = 2.5\%\), up from 1%. A 5% day is only two standard deviations — under a normal curve about one trading day in 22 would move that much either way, roughly once a month — versus a five-standard-deviation event at VIX 16. That is why a high VIX feels like a different market, not just "more of the same".

**It is not one option's implied vol.** An ATM option's IV describes one strike. The VIX uses **every** out-of-the-money SPX put and call around 30 days, each weighted by \(1/K^2\), so low strikes count more. Because equity puts carry the skew ([[smile-skew]]), the VIX usually sits **above** at-the-money implied vol. And because no pricing model is involved — only option prices go in — the result is called **model-free implied variance**.

**Why it is called the fear gauge.** When stocks fall, investors rush to buy puts and volatility itself tends to rise, so the whole strip gets more expensive at once. The VIX therefore jumps when the S&P 500 drops, and drifts lower in calm rallies. It also mean-reverts: spikes fade, and long stretches in single digits are rare.

> [!KAI] "Can I just buy the VIX as insurance?"
> Kai wonders whether to buy the VIX to protect the XYZ shares against a market sell-off. There is no VIX to buy: it is a calculation, like a temperature reading. What trades are **VIX futures** (a price today for the VIX on a future date), **VIX options** (priced off those futures) and **exchange-traded products** that hold futures. Each behaves differently from the index — section ④ shows why a product that "tracks the VIX" can lose most of its value while the VIX goes nowhere.

We'll take it in five parts:

- **① The recipe: from an option strip to one number**
- **② Why the skew lifts the VIX above ATM vol**
- **③ Reading the level: rule of 16, the risk premium, VVIX**
- **④ VIX futures, VIX options and the roll**
- **⑤ History and state of play (2026)**

## @mechanics
### ① The recipe: from an option strip to one number

For one expiry, Cboe computes a variance from out-of-the-money option prices:

$$
\sigma^2 \;=\; \frac{2}{T}\sum_i \frac{\Delta K_i}{K_i^2}\,e^{rT}\,Q(K_i) \;-\; \frac{1}{T}\left(\frac{F}{K_0} - 1\right)^2
$$

where \(T\) is the time to expiry in years, \(K_i\) the \(i\)-th strike, \(\Delta K_i\) the spacing around it (half the distance between its neighbors), \(Q(K_i)\) the mid price of the out-of-the-money option at that strike (puts below \(K_0\), calls above, the average of both at \(K_0\)), \(r\) the risk-free rate, \(F\) the forward index level implied by put–call parity, and \(K_0\) the first strike at or below \(F\). The second term is a small correction because \(K_0\) is not exactly at the forward. The index is then \(\text{VIX} = 100 \times \sigma\).

> [!EXAMPLE] The recipe on a toy strip
> Apply it to a 30-day XYZ-style strip with strikes every $5 from 60 to 140, every option priced at a flat 20% (\(S = 100\), \(r = 4\%\), \(F = 100.33\), \(K_0 = 100\)). The biggest terms \(\tfrac{\Delta K}{K^2}Q(K)\), in units of \(10^{-5}\):
>
> | Strike | 90 put | 95 put | 100 (avg) | 105 call | 110 call | all others |
> |---|---|---|---|---|---|---|
> | \(Q(K)\) | 0.0608 | 0.5089 | 2.2871 | 0.7129 | 0.1379 | — |
> | \(\tfrac{\Delta K}{K^2}Q(K) \times 10^{5}\) | 3.75 | 28.19 | 114.36 | 32.33 | 5.70 | 0.93 |
>
> The sum is \(185.27 \times 10^{-5}\). Multiply by \(\tfrac{2}{T}e^{rT} = 24.41\): \(0.04523\). Subtract \(\tfrac{1}{T}(100.33/100 - 1)^2 = 0.00013\): \(\sigma^2 = 0.04510\), so \(\sigma = 21.2\%\). The answer should be 20% — the $5 grid is too coarse and overweights the ATM option. With strikes every $1 the same recipe gives **20.05%**. Strike spacing matters, which is why Cboe uses every listed strike.

**Two expiries, one 30-day number.** SPX options rarely expire in exactly 30 days, so Cboe computes \(\sigma_1^2\) for the expiry just under 30 days and \(\sigma_2^2\) for the one just over (with more than 23 and fewer than 37 days to expiry), then interpolates their **total variances** — the additivity rule from [[term-structure]]:

$$
\text{VIX} = 100\sqrt{\left[T_1\sigma_1^2\,\frac{N_{T_2} - N_{30}}{N_{T_2} - N_{T_1}} + T_2\sigma_2^2\,\frac{N_{30} - N_{T_1}}{N_{T_2} - N_{T_1}}\right]\frac{N_{365}}{N_{30}}}
$$

where \(N_{T_1}, N_{T_2}\) are the times to the two expiries, \(N_{30}\) and \(N_{365}\) are 30 days and a year in the same units (Cboe counts minutes), and \(T_1, T_2\) are the same times in years. If the 23-day expiry shows 19% and the 37-day 21%, the weights are both one half and \(\text{VIX} = 100\sqrt{(0.5 \times 0.0361 \times \tfrac{23}{365} + 0.5 \times 0.0441 \times \tfrac{37}{365}) \times \tfrac{365}{30}} = 20.26\). Since October 6, 2014, SPX Weeklys are included, so the two expiries are rarely far from 30 days.

> [!DEEP] Why \(1/K^2\)? Constant cash gamma
> An option's dollar gamma \(\tfrac12\Gamma S^2\) is a bump centered on its strike; both the bump's height and its width grow in proportion to \(K\), so its total "amount" grows like \(K^2\). Weight each option by \(1/K^2\) and the strip's dollar gamma becomes roughly **flat** in \(S\): the delta-hedged strip earns \(\tfrac12\Gamma S^2(\sigma_{\text{real}}^2 - \sigma_{\text{imp}}^2)\,\dd t\) with the same weight wherever the index wanders ([[gamma]], [[delta-hedging]]). So the strip plus a delta hedge pays realized variance — it replicates a **variance swap**, and its cost is the fair variance strike (Carr and Madan, 1998). The VIX squared is that strike for 30 days, up to discretization and the tails.

### ② Why the skew lifts the VIX above ATM vol

Put the 30-day smile of [[smile-skew]] (the one [[risk-neutral-density]] turned into a distribution: ATM still 20%, the 90 strike at 25.2%, the 80 at 30.6%) on the same strip and rerun the recipe on a $1 grid: the VIX-style number rises from **20.05 to about 21.1**, with ATM vol unchanged. A steeper, index-like crash skew adds several points more (try it in the demo below). Two things push it up: OTM puts are priced at higher vols, and their low strikes get the biggest \(1/K^2\) weights.

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Share of the VIX-style variance contributed by each strike, flat versus skewed smile">
<line x1="60" y1="210" x2="620" y2="210" class="fx-axis"/>
<line x1="60" y1="155" x2="620" y2="155" class="fx-grid"/>
<line x1="60" y1="99" x2="620" y2="99" class="fx-grid"/>
<line x1="60" y1="44" x2="620" y2="44" class="fx-grid"/>
<text x="54" y="214" text-anchor="end" class="fx-t-sm">0</text>
<text x="54" y="159" text-anchor="end" class="fx-t-sm">20%</text>
<text x="54" y="103" text-anchor="end" class="fx-t-sm">40%</text>
<text x="54" y="48" text-anchor="end" class="fx-t-sm">60%</text>
<rect x="78" y="209" width="11" height="1" class="fx-fill-muted"/>
<rect x="91" y="208.6" width="11" height="1.4" class="fx-fill-red"/>
<rect x="141" y="209" width="11" height="1" class="fx-fill-muted"/>
<rect x="154" y="205" width="11" height="5" class="fx-fill-red"/>
<rect x="203" y="204.5" width="11" height="5.5" class="fx-fill-muted"/>
<rect x="216" y="193.2" width="11" height="16.8" class="fx-fill-red"/>
<rect x="266" y="168.2" width="11" height="41.8" class="fx-fill-muted"/>
<rect x="279" y="158" width="11" height="52" class="fx-fill-red"/>
<rect x="328" y="40.3" width="11" height="169.7" class="fx-fill-muted"/>
<rect x="341" y="54.6" width="11" height="155.4" class="fx-fill-red"/>
<rect x="391" y="161.9" width="11" height="48.1" class="fx-fill-muted"/>
<rect x="404" y="171.8" width="11" height="38.2" class="fx-fill-red"/>
<rect x="453" y="201.5" width="11" height="8.5" class="fx-fill-muted"/>
<rect x="466" y="204.2" width="11" height="5.8" class="fx-fill-red"/>
<rect x="516" y="208.9" width="11" height="1.1" class="fx-fill-muted"/>
<rect x="529" y="209" width="11" height="1" class="fx-fill-red"/>
<line x1="340" y1="30" x2="340" y2="222" class="fx-line-muted fx-dash"/>
<text x="330" y="26" text-anchor="end" class="fx-t-b">← OTM puts</text>
<text x="350" y="26" class="fx-t-b">OTM calls →</text>
<text x="90" y="226" text-anchor="middle" class="fx-t-sm">80</text>
<text x="153" y="226" text-anchor="middle" class="fx-t-sm">85</text>
<text x="215" y="226" text-anchor="middle" class="fx-t-sm">90</text>
<text x="278" y="226" text-anchor="middle" class="fx-t-sm">95</text>
<text x="340" y="226" text-anchor="middle" class="fx-t-sm">K₀ = 100</text>
<text x="403" y="226" text-anchor="middle" class="fx-t-sm">105</text>
<text x="465" y="226" text-anchor="middle" class="fx-t-sm">110</text>
<text x="528" y="226" text-anchor="middle" class="fx-t-sm">115</text>
<text x="590" y="226" text-anchor="middle" class="fx-t-sm">120</text>
<text x="340" y="244" text-anchor="middle" class="fx-t-sm">strike (share of the total, $5 grid)</text>
<rect x="440" y="60" width="12" height="10" class="fx-fill-muted"/>
<text x="458" y="69" class="fx-t-sm">flat 20%: puts 17% of the total</text>
<rect x="440" y="78" width="12" height="10" class="fx-fill-red"/>
<text x="458" y="87" class="fx-t-sm">skewed: puts 27% of the total</text>
<text x="100" y="170" class="fx-t-bad">skew: 80–90 puts</text>
<text x="100" y="186" class="fx-t-bad">carry 8% vs 2%</text>
</svg>
<figcaption>Figure 1 · Where the VIX comes from. Each bar is one strike's share of \(\sum \frac{\Delta K}{K^2}Q(K)\). With a flat smile, the ATM option does most of the work and puts contribute 17%; with the equity skew of [[smile-skew]], OTM puts contribute 27% and the 80–90 region goes from 2% to 8%. The VIX therefore reacts strongly to the price of crash protection, not just to ATM vol.</figcaption>
</figure>

Two consequences. First, **VIX minus ATM implied vol** is itself a skew gauge: the steeper the put skew, the wider the gap. Second, the VIX is a **variance** measure: \(\text{VIX}^2\) is the fair 30-day variance-swap rate, so large moves count quadratically, which is why the index can double in a day when the whole left tail reprices.

### ③ Reading the level: rule of 16, the risk premium, VVIX

The rule of 16 comes from annualizing over trading days:

$$
\text{typical daily move} \;\approx\; \frac{\text{VIX}}{\sqrt{252}} \;\approx\; \frac{\text{VIX}}{16}\ \%
$$

where 252 is the usual number of trading days in a year and \(\sqrt{256} = 16\) is the handy round number. VIX 20 gives \(20/15.87 = 1.26\%\) a day; on an index near 7,700 (its late-September 2026 level) that is roughly 97 points.

> [!WARN] Trading days versus calendar days
> The VIX is annualized on calendar time (Cboe counts minutes in a 365-day year), yet almost all of the variance arrives on trading days. The rule of 16 quietly assumes that the year's variance is shared among 252 trading days. This course's XYZ numbers use calendar days (\(20\%/\sqrt{365} = 1.05\%\) per calendar day); per *trading* day the same 20% is 1.26%. Both are right — just be clear which day you mean.

Is the VIX a good forecast? On average it has been **too high**. From 1990 to about 2024, the VIX averaged 19.59 while the S&P 500's subsequent 30-day realized volatility averaged 15.50 — a gap of about 4 vol points (CFA Institute, July 2024; the same gap met in [[realized-vol]]). Investors pay up for protection, so implied variance usually exceeds realized variance; in crashes the gap flips. That gap is the [[variance-risk-premium]], and it is why selling volatility earns money most of the time and loses spectacularly some of the time.

Volatility is itself volatile. **VVIX**, introduced in 2012, applies the same recipe to VIX options: it is the market's 30-day implied volatility **of the VIX**, typically far higher than the VIX itself, because the VIX can move 50% or more in days.

### ④ VIX futures, VIX options and the roll

A VIX future is a price agreed today for the VIX on a future settlement date. At settlement it converges to the index; before that it is the market's (risk-neutral) price for where the VIX will be — a forward-looking number, not today's VIX. Line up the futures by expiry and you get the VIX futures curve, the tradeable version of the S&P 500 term structure.

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="VIX futures curve in contango and in backwardation">
<defs><marker id="vix-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="60" y1="220" x2="615" y2="220" class="fx-axis" marker-end="url(#vix-ah)"/>
<line x1="60" y1="220" x2="60" y2="20" class="fx-axis" marker-end="url(#vix-ah)"/>
<line x1="60" y1="166" x2="600" y2="166" class="fx-grid"/>
<line x1="60" y1="111" x2="600" y2="111" class="fx-grid"/>
<line x1="60" y1="57" x2="600" y2="57" class="fx-grid"/>
<line x1="60" y1="171" x2="600" y2="171" class="fx-line-muted fx-dash"/>
<text x="596" y="186" text-anchor="end" class="fx-t-sm">long-run level 19 (illustrative)</text>
<polyline points="70,198 103,195 135,191 168,188 200,186 233,184 265,182 298,181 330,179 363,178 395,177 428,176 460,176 493,175 525,174 558,174 590,174" class="fx-line-ok"/>
<polyline points="70,57 103,73 135,87 168,98 200,109 233,117 265,125 298,131 330,137 363,142 395,146 428,149 460,152 493,155 525,157 558,159 590,161" class="fx-line-bad"/>
<circle cx="70" cy="198" r="5" class="fx-fill-green"/>
<circle cx="70" cy="57" r="5" class="fx-fill-red"/>
<circle cx="135" cy="191" r="4" class="fx-fill-green"/>
<circle cx="135" cy="87" r="4" class="fx-fill-red"/>
<path d="M130,203 Q100,214 76,206" class="fx-line-ok" fill="none" marker-end="url(#vix-ah)"/>
<text x="80" y="244" class="fx-t-ok">calm: 1-month future 15.30 rolls down to spot 14 (−8.5% a month)</text>
<text x="150" y="70" class="fx-t-bad">stress: spot 40, 1-month future 34.56 (backwardation)</text>
<text x="330" y="165" class="fx-t-ok">contango</text>
<text x="52" y="224" text-anchor="end" class="fx-t-sm">10</text>
<text x="52" y="170" text-anchor="end" class="fx-t-sm">20</text>
<text x="52" y="115" text-anchor="end" class="fx-t-sm">30</text>
<text x="52" y="61" text-anchor="end" class="fx-t-sm">40</text>
<text x="70" y="232" text-anchor="middle" class="fx-t-sm">spot</text>
<text x="135" y="232" text-anchor="middle" class="fx-t-sm">1m</text>
<text x="200" y="232" text-anchor="middle" class="fx-t-sm">2m</text>
<text x="330" y="232" text-anchor="middle" class="fx-t-sm">4m</text>
<text x="590" y="232" text-anchor="middle" class="fx-t-sm">8m</text>
<text x="66" y="16" class="fx-t-sm">VIX futures price</text>
</svg>
<figcaption>Figure 2 · Two VIX futures curves from one mean-reverting rule (illustrative: long-run level 19, shocks fading at 0.3 a month). In calm markets spot VIX sits below the futures (contango); a long future that is rolled each month keeps sliding down toward a spot that stays low. In stress, spot jumps above the futures (backwardation): the market expects the spike to fade.</figcaption>
</figure>

**The roll.** Suppose spot VIX is 14 and the 1-month future 15.30. If nothing changes for a month, that future ends at 14: a holder loses \(15.30 - 14 = 1.30\) points, or

$$
\text{roll return} \;\approx\; \frac{S_{\text{VIX}} - F_1}{F_1} = \frac{14 - 15.30}{15.30} \approx -8.5\%\ \text{per month}
$$

where \(S_{\text{VIX}}\) is the spot index and \(F_1\) the price of the future a month before expiry. An exchange-traded product that keeps a constant one-month exposure by selling the expiring future and buying the next one pays that roll again and again. With the curve frozen for a year, \(0.915^{12} \approx 0.35\): about **−65%** while the VIX itself ends where it started. Real curves move, and in crises the roll turns positive, but the average drag is why long-VIX products have tended to lose value over long periods. They are short-term hedging tools, not buy-and-hold insurance.

::demo[vix-roll]

**VIX options** are priced off the VIX future of the same expiry, not off the spot index, and they settle in cash. A VIX call can be a crash hedge — it gains when volatility spikes — but its premium already reflects the fact that the future sits above spot in calm markets, and its value depends on VVIX. [[tail-hedging]] compares it with buying SPX puts directly.

> [!HISTORY] Volmageddon, 5 February 2018
> On 5 February 2018 the VIX rose **20.01 points (+115.6%)** to close at 37.32, its largest one-day percentage rise, while the S&P 500 fell about 4%. Products that were *short* VIX futures took the hit: XIV, an inverse-VIX exchange-traded note with about $1.9 billion of assets the previous Friday, lost about 96%, and Credit Suisse announced its termination the next day (redemption around February 21). SVXY, a similar fund, lost about 90% but survived and later cut its target exposure to −0.5×. Selling volatility had paid steadily for years — until one day erased it.

### ⑤ History and state of play (2026)

| Date | Event (source: Cboe, Macroption, press; see facts) |
|---|---|
| 1993 | VIX introduced, originally on S&P 100 options (that version is now VXO) |
| 2003 | Methodology moved to SPX options and the model-free variance formula |
| Mar 26, 2004 · Feb 24, 2006 | VIX futures launch · VIX options launch |
| Oct 24, 2008 · Nov 20, 2008 | Record intraday high **89.53** · 2008 record close 80.86 |
| Feb 5, 2018 | Volmageddon: +115.6% in a day, close 37.32 |
| Mar 16, 2020 | Record close **82.69** (pandemic crash) |
| Aug 5, 2024 | Intraday **65.73**, closed about 38.6 — the largest intraday-high-to-close gap on record (yen carry-trade unwind, growth fears) |
| Apr 7–8, 2025 | Intraday **60.13** (Apr 7) and close **52.33** (Apr 8) in the tariff shock |
| Mar 6, 2026 · end-Aug 2026 | Intraday about 28.6 (Iran war) · close **14.92** |

> [!FACT] The volatility complex in 2026
> VIX options traded about 862,000 contracts a day in 2025 (Cboe). SPX and VIX options trade almost around the clock on weekdays, with Global Trading Hours from 8:15 p.m. to 9:25 a.m. ET plus a curb session (Cboe, as of July 2026). The VIX, by construction, uses SPX options with more than 23 days to expiry, so the same-day options that were about two-thirds of SPX volume in July 2026 never enter it ([[zero-dte]]). Crypto has its own analogue: Deribit's **DVOL** (launched March 2021) applies a variance-swap-style method to bitcoin and ether options; because crypto trades every day, its daily move is roughly DVOL / \(\sqrt{365}\) ≈ DVOL / 19 ([[crypto-options]]).

Three habits keep the VIX in perspective: read it as a price that includes a risk premium, not as a forecast; remember that it is a 30-day, S&P 500, variance-weighted number — other horizons and other assets have their own; and never confuse the index with the products that reference it.

## @analogy
The VIX is like the **price of a month of hurricane insurance for a whole coastline**. An insurer does not ask for a forecast; it looks at what people are paying to cover every stretch of coast against every size of storm, with the most weight on the low-lying districts where the damage is worst (the \(1/K^2\) weighting on low strikes). Add up those premiums and you have one number for "how much a month of storm risk costs right now". When a storm appears on the radar, everyone rushes to buy cover and the number leaps; when skies clear, it settles back.

That number is a *reading*, not a policy. You cannot buy "the hurricane index"; you can only buy contracts for future months, and in calm weather next month's cover costs more than this month's quiet reading, so a plan to keep rolling cover forward leaks money every month the sky stays blue.

The analogy breaks in one important way: the insurers here charge a markup for bearing risk, and the markup swells precisely when people are scared. So the index tends to overstate the storms that actually arrive — until a season when it badly understates them.

## @misconceptions
- **"The VIX measures how much the market has moved recently."** — It is implied, not realized: it is backed out of option prices for the next 30 days. Realized volatility is measured separately ([[realized-vol]]).
- **"The VIX is the implied volatility of an at-the-money S&P option."** — It is a model-free variance from the whole OTM strip, weighted by \(1/K^2\). With a put skew it sits above ATM vol.
- **"A high VIX means the market will fall further."** — It prices the size of moves, not their direction. Spikes often come near sell-off lows, and the index mean-reverts.
- **"I can buy the VIX and hold it as portfolio insurance."** — There is no spot VIX to hold. Futures converge to the index, and in normal contango a constant-maturity long position loses the roll every month; long-VIX products have tended to decay over long periods.
- **"XIV and every short-volatility product went to zero in 2018."** — XIV lost about 96% and was terminated; SVXY lost about 90% but survived, later halving its exposure.

## @takeaways
- The VIX is 100 × the square root of a 30-day, model-free implied variance of the S&P 500, built from OTM SPX options weighted by \(1/K^2\) and interpolated between two expiries in total variance.
- Divide by 16 for a typical daily move (VIX 16 ≈ 1%); multiply by \(\sqrt{30/365}\) for a one-month 1σ move.
- The skew lifts the VIX above ATM vol; the \(1/K^2\) strip replicates a variance swap.
- On average the VIX has exceeded later realized volatility by about 4 points (the variance risk premium), but not in crashes.
- VIX futures converge to spot; contango makes rolled long positions bleed and backwardation appears in stress; VIX options price off futures; VVIX is the vol of the VIX.

## @quiz
1. The VIX is 25. What is the typical (one-standard-deviation) daily move of the S&P 500 it implies, using the rule of 16?
   - [ ] 25%
   - [ ] About 0.25%
   - [ ] About 7.2%
   - [x] About 1.6%
   > \(25/16 \approx 1.56\%\) per trading day. 7.2% is the one-month move (\(25\% \times \sqrt{30/365}\)); 25% is the annualized number itself.
2. With the same ATM implied vol, a steeper put skew makes the VIX-style index…
   - [x] Higher, because OTM puts are priced at higher vols and low strikes get the largest \(1/K^2\) weights
   - [ ] Lower, because the calls become cheaper
   - [ ] Unchanged, because the VIX only uses the ATM option
   - [ ] Undefined, because the formula assumes a flat smile
   > The recipe sums every OTM option weighted by \(1/K^2\). In the lesson's example, ATM stays at 20% while the index goes from 20.05 to about 21.1 as the skew is added.
3. Spot VIX is 14, the one-month VIX future is 15.30, and nothing changes for a month. What happens to a long position in that future?
   - [ ] It gains, because futures always rise toward the long-run level
   - [x] It loses about 1.30 points (about 8.5%) as the future converges to the unchanged spot
   - [ ] Nothing, because the VIX did not move
   - [ ] It gains 1.30 points from the roll yield
   > At expiry a VIX future settles to the index. If spot stays at 14, the future falls from 15.30 to 14. This roll-down, repeated monthly, is the main reason long-VIX products tend to decay.
4. Why does the VIX weight each option by \(1/K^2\)?
   - [ ] To give ATM options the least weight
   - [ ] Because Cboe wanted to emphasise calls
   - [x] Weighting by \(1/K^2\) makes the strip's dollar gamma roughly constant, so the delta-hedged strip pays realized variance — it replicates a variance swap
   - [ ] To cancel out the risk-free rate
   > Each option's dollar gamma scales with \(K^2\) around its strike; dividing by \(K^2\) flattens the total. A flat dollar gamma earns realized variance wherever the index goes, which is what makes the result a model-free variance.
5. Between 1990 and about 2024, the VIX averaged about 19.6 while subsequent realized S&P 500 vol averaged about 15.5. What is the best reading?
   - [ ] The VIX formula has a bug that adds 4 points
   - [ ] Options were mispriced for 34 years
   - [ ] Realized volatility is measured on the wrong days
   - [x] Buyers of protection pay a premium, so implied variance usually exceeds realized — the variance risk premium, which reverses in crashes
   > The gap is compensation for bearing crash risk. Sellers of volatility collect it most of the time and pay out heavily in sell-offs (see Volmageddon in 2018).

## @further
- [Cboe VIX Index methodology (PDF)](https://cdn.cboe.com/resources/vix/VIX_Methodology.pdf) — the official recipe, including strike selection and the 30-day interpolation.
- [Cboe white paper on VIX interpolation (PDF)](https://cdn.cboe.com/resources/education/research_publications/VIXInterpolationWhitepaper.pdf) — how two expiries are blended into one 30-day number.
- [BIS Quarterly Review, March 2018 — the February volatility spike](https://www.bis.org/publ/qtrpdf/r_qt1803t.htm) — how short-volatility products amplified Volmageddon.
- [SEC DERA working paper: Demystify the Surge in VIX (PDF)](https://www.sec.gov/files/dera-vix-working-paper-2504.pdf) — an analysis of the August 5, 2024 intraday spike.
- [CFA Institute: How well does the market predict volatility?](https://blogs.cfainstitute.org/investor/2024/07/31/how-well-does-the-market-predict-volatility/) — the VIX-versus-realized comparison behind the risk-premium numbers.
- [Carr & Wu (2009), Variance Risk Premiums](https://academic.oup.com/rfs/article-abstract/22/3/1311/1581057) — the academic evidence that index variance risk premia are large and negative for buyers.

## @next
This stage gave you volatility as a quote ([[implied-vol]]), a curve ([[smile-skew]]), a surface ([[term-structure]]), a distribution ([[risk-neutral-density]]) and an index. The next stage asks the trader's question: if you hold an option, **how** does its value change when the price moves, a day passes or volatility shifts? One Taylor expansion splits that change into pieces with names — the Greeks, starting with [[greeks-map]].
