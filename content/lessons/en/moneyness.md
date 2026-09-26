---
id: moneyness
prereqs: call-option, put-option, contract-specs
demo: moneyness
---

# ITM, ATM, OTM: How Far an Option Is From Paying

## @hook
On the same stock, on the same day, the XYZ 95 call costs $5.82 and the 105 call costs $0.71. The only difference is where each strike sits relative to today's price — its **moneyness**. This lesson names the three zones and then shows that the useful way to measure the distance is not in dollars, but in **standard deviations**, a ruler that time and volatility keep stretching.

## @bridge
[[contract-specs]] taught Kai to read a single contract. Now we compare contracts. From [[call-option]] and [[put-option]] we know a call pays above its strike and a put below it; moneyness simply says which side of that line today's price is on, and how far. This lesson builds Idea ① — **shape** (where on the hockey stick an option stands) — and plants Idea ③ — **volatility** (how far is “far” depends on how much the stock moves). It leads straight into [[intrinsic-time-value]], which splits every premium into the part moneyness explains and the part it doesn't.

## @intuition
Here is the one-line test for moneyness: **imagine exercising right now.** If that would put money in your pocket, the option is **in the money (ITM)**. If it would cost you, it is **out of the money (OTM)**. If the strike is right at today's price, it is **at the money (ATM)**.

Try it with XYZ at $100.

- The **90 call** lets you buy at $90 a stock worth $100. Exercising now gains $10: in the money.
- The **110 call** lets you buy at $110 a stock worth $100. Nobody would: out of the money.
- The **100 call**: at the money.

Puts are the mirror image, because a put is the right to *sell*:

- The **110 put** lets you sell at $110 a stock worth $100: in the money by $10.
- The **90 put** lets you sell at $90 a stock worth $100: out of the money.

So the same strike carries opposite labels for calls and puts. **The 90 call is ITM while the 90 put is OTM.** The picture below makes this a two-row number line.

<figure>
<svg viewBox="0 0 660 240" role="img" aria-label="Number line of strikes with ITM and OTM zones for calls and puts">
<rect x="70" y="56" width="248" height="30" rx="8" class="fx-area-ok"/>
<rect x="342" y="160" width="248" height="30" rx="8" class="fx-area-ok"/>
<line x1="60" y1="120" x2="610" y2="120" class="fx-axis"/>
<line x1="330" y1="40" x2="330" y2="200" class="fx-line-hl fx-dash"/>
<text x="330" y="34" text-anchor="middle" class="fx-t-hl">XYZ today: S = 100</text>
<text x="14" y="75" class="fx-t-b">calls</text>
<text x="14" y="179" class="fx-t-b">puts</text>
<circle cx="80" cy="71" r="7" class="fx-fill-green"/>
<circle cx="142.5" cy="71" r="7" class="fx-fill-green"/>
<circle cx="205" cy="71" r="7" class="fx-fill-green"/>
<circle cx="267.5" cy="71" r="7" class="fx-fill-green"/>
<circle cx="330" cy="71" r="8" class="fx-fill-orange"/>
<circle cx="392.5" cy="71" r="7" class="fx-fill-muted"/>
<circle cx="455" cy="71" r="7" class="fx-fill-muted"/>
<circle cx="517.5" cy="71" r="7" class="fx-fill-muted"/>
<circle cx="580" cy="71" r="7" class="fx-fill-muted"/>
<circle cx="80" cy="175" r="7" class="fx-fill-muted"/>
<circle cx="142.5" cy="175" r="7" class="fx-fill-muted"/>
<circle cx="205" cy="175" r="7" class="fx-fill-muted"/>
<circle cx="267.5" cy="175" r="7" class="fx-fill-muted"/>
<circle cx="330" cy="175" r="8" class="fx-fill-orange"/>
<circle cx="392.5" cy="175" r="7" class="fx-fill-green"/>
<circle cx="455" cy="175" r="7" class="fx-fill-green"/>
<circle cx="517.5" cy="175" r="7" class="fx-fill-green"/>
<circle cx="580" cy="175" r="7" class="fx-fill-green"/>
<text x="80" y="138" text-anchor="middle" class="fx-t-sm">80</text>
<text x="142.5" y="138" text-anchor="middle" class="fx-t-sm">85</text>
<text x="205" y="138" text-anchor="middle" class="fx-t-sm">90</text>
<text x="267.5" y="138" text-anchor="middle" class="fx-t-sm">95</text>
<text x="330" y="138" text-anchor="middle" class="fx-t-b">100</text>
<text x="392.5" y="138" text-anchor="middle" class="fx-t-sm">105</text>
<text x="455" y="138" text-anchor="middle" class="fx-t-sm">110</text>
<text x="517.5" y="138" text-anchor="middle" class="fx-t-sm">115</text>
<text x="580" y="138" text-anchor="middle" class="fx-t-sm">120</text>
<text x="194" y="104" text-anchor="middle" class="fx-t-ok">call ITM: strike below price</text>
<text x="466" y="104" text-anchor="middle" class="fx-t-sm">call OTM: strike above price</text>
<text x="194" y="214" text-anchor="middle" class="fx-t-sm">put OTM: strike below price</text>
<text x="466" y="214" text-anchor="middle" class="fx-t-ok">put ITM: strike above price</text>
<text x="330" y="232" text-anchor="middle" class="fx-t-sm">strike K (dollars) · green = in the money · blue = at the money · grey = out of the money</text>
</svg>
<figcaption>Figure 1 · One line of strikes, two readings. For calls, everything left of today's price is in the money; for puts, everything right of it. When XYZ moves, the dashed line slides and the colours flip — moneyness is not a property of a contract, it is a relationship between the contract and today's price.</figcaption>
</figure>

Now look at prices on the 30-day XYZ chain (Black-Scholes at σ = 20%, r = 4%):

| Strike | Call price | Call is… | Put price | Put is… |
|---|---|---|---|---|
| 90 | 10.36 | ITM by $10 | 0.06 | OTM by $10 |
| 95 | 5.82 | ITM by $5 | 0.51 | OTM by $5 |
| 100 | 2.45 | ATM | 2.12 | ATM |
| 105 | 0.71 | OTM by $5 | 5.37 | ITM by $5 |
| 110 | 0.14 | OTM by $10 | 9.78 | ITM by $10 |

Two things jump out. **ITM options are expensive** because they already contain real money: the 90 call is worth at least the $10 you could collect by exercising today. **OTM options are cheap** because they contain none: the 110 call is worth something only because XYZ *might* climb above $110 in the next 30 days, and the further away the strike, the less likely that is.

> [!KAI] Why both of Kai's trades use OTM strikes
> Kai's protective put is the **95 put, $5 out of the money**, and Kai's covered call sells the **105 call, $5 out of the money**. The put is cheap ($51) because Kai accepts the first $5 of losses — a deductible. The call brings in only $71 because Kai gives away only the upside *beyond* $105, which Kai considers unlikely. OTM is where protection is affordable and where selling gives up the least.

Dollars are a crude ruler, though. Is $5 far? For a sleepy utility over one week, very. For a volatile tech stock over a year, not at all. The same $5 means something different depending on **how much the stock usually moves** before expiry. That's why professionals measure moneyness in **standard deviations**.

::demo[moneyness-z]

> [!THINK] The 105 call and the 95 put are both exactly $5 out of the money. Which one costs more?
> Most people guess “the same”. Predict before opening.
> ---
> The call: $0.71 against $0.51 for the put. Two reasons, both about the ruler. First, the centre of the future distribution is not today's $100 but the 30-day forward, about $100.33 (money earns 4% while you wait), so the 105 strike is really $4.67 above the centre and the 95 strike $5.33 below it. Second, prices move in percentages, so in log terms the put's strike is farther: 0.95 standard deviations away versus 0.79 for the call. Farther means cheaper.

We'll take it in five parts:

- **① The definitions**, precisely, for calls and puts
- **② Simple measures**: dollars, the ratio \(S/K\), percent out of the money
- **③ Log-moneyness and the forward**: where the centre really is
- **④ Standardised moneyness**: distance in standard deviations
- **⑤ Delta as moneyness**: how traders actually name strikes

## @mechanics
### ① The definitions, precisely

With \(S\) the current stock price and \(K\) the strike:

| | In the money | At the money | Out of the money |
|---|---|---|---|
| Call | \(S > K\) | \(S \approx K\) | \(S < K\) |
| Put | \(S < K\) | \(S \approx K\) | \(S > K\) |

A few refinements an expert would add:

- **ATM is a neighbourhood, not a point.** With strikes every $5, “the at-the-money strike” usually means the one nearest the spot price. Some desks define ATM relative to the forward price instead (ATM-forward, see ③), and for XYZ the two differ by $0.33.
- **The amount an option is in the money is its intrinsic value**: \(\max(S - K, 0)\) for a call and \(\max(K - S, 0)\) for a put. The 90 call is $10 ITM, so its intrinsic value is $10. Everything it costs above that has another name — the subject of [[intrinsic-time-value]].
- **Deep ITM** and **deep OTM** describe strikes so far from the price that the option behaves almost like the stock (deep ITM) or almost like nothing (deep OTM).
- **Moneyness is a snapshot.** At expiry it decides everything: ITM options are exercised, OTM options expire worthless ([[exercise-assignment]]). Before expiry it changes every time the price moves — slide the price in the demo below the lesson and watch the labels flip.

### ② Simple measures: dollars, ratios and percentages

The plainest measures compare \(S\) and \(K\) directly: the dollar gap \(S - K\), the ratio \(S/K\), or “percent out of the money”, \((K - S)/S\) for a call. For the 105 call: \(S - K = -5\), \(S/K = 100/105 = 0.952\), and it is 5% OTM.

These are fine for a quick look at one stock and one expiry. They fail as soon as you compare across stocks or across time, because they ignore how far the stock can realistically travel. A 5% OTM call on a stock with 20% volatility and 30 days left is a long shot; the same 5% on a stock with 80% volatility is nearly a coin flip.

### ③ Log-moneyness and the forward

Two improvements fix the most obvious distortions. Measure from the **forward price** \(F\) — the price at which you could agree today to buy the stock at expiry — rather than from spot, and measure the gap in **logarithms**, which treat a 5% rise and a 5% fall more evenly than dollars do:

$$
k = \ln\frac{K}{F}, \qquad F = S e^{rT}
$$

where:

- \(k\) is the log-moneyness (negative when the strike is below the forward);
- \(F\) is the forward price for the option's expiry; for a stock without dividends it is the spot grown at the risk-free rate \(r\) for the time \(T\) (in years) — [[forwards-carry]] shows why;
- \(\ln\) is the natural logarithm; for small gaps, \(\ln(K/F)\) is close to the percentage distance \((K - F)/F\).

> [!EXAMPLE] XYZ's 30-day strikes in log-moneyness
> \(F = 100 \times e^{0.04 \times 30/365} = 100.33\). Then:
> - 105 strike: \(k = \ln(105/100.33) = 0.0455\)
> - 100 strike: \(k = \ln(100/100.33) = -0.0033\) — a hair *below* the forward, so the 100 call is very slightly in the money forward
> - 95 strike: \(k = \ln(95/100.33) = -0.0546\)
>
> The 95 strike sits farther from the centre (0.0546) than the 105 strike (0.0455): half the answer to the THINK above.

> [!DEEP] Why the forward is the natural centre
> In the pricing world of [[risk-neutral]], the expected stock price at expiry is exactly \(F\), not \(S\). An option struck at \(F\) is the one whose call and put are worth the same: by parity, \(C - P = e^{-rT}(F - K)\), which is zero when \(K = F\). That is why volatility surfaces and many exchanges' volatility indexes measure strikes relative to the forward, and why \(\ln(K/F)\) appears inside the Black-Scholes \(d_1\) and \(d_2\) ([[black-scholes]]).

### ④ Standardised moneyness: distance in standard deviations

The last step divides the log-distance by the size of a typical move over the option's life, \(\sigma\sqrt{T}\):

$$
z = \frac{\ln(K/F)}{\sigma\sqrt{T}}
$$

where:

- \(z\) is the standardised moneyness — how many standard deviations the strike sits from the forward;
- \(\sigma\) is the annual volatility (20% for XYZ);
- \(\sqrt{T}\) scales the annual volatility down to the option's life: uncertainty grows with the *square root* of time ([[random-walk]]).

> [!EXAMPLE] The same strike at four horizons
> For 30 days, \(\sigma\sqrt{T} = 0.20 \times \sqrt{30/365} = 0.0573\), so the 105 strike is \(z = 0.0455 / 0.0573 = 0.79\) standard deviations above the forward. Repeat for other expiries (each with its own forward):
>
> | Expiry | \(\sigma\sqrt{T}\) | \(z\) of the 105 strike | 105 call price | Call delta |
> |---|---|---|---|---|
> | 7 days | 0.0277 | 1.73 | $0.05 | 0.043 |
> | 30 days | 0.0573 | 0.79 | $0.71 | 0.222 |
> | 90 days | 0.0993 | 0.39 | $2.36 | 0.366 |
> | 1 year | 0.2000 | 0.04 | $7.57 | 0.522 |
>
> The strike never moved. The ruler did.

<figure>
<svg viewBox="0 0 660 250" role="img" aria-label="The 105 strike measured in standard deviations at 7 days, 30 days and one year">
<rect x="250" y="48" width="160" height="28" class="fx-area-hl"/>
<rect x="250" y="118" width="160" height="28" class="fx-area-hl"/>
<rect x="250" y="188" width="160" height="28" class="fx-area-hl"/>
<line x1="90" y1="62" x2="610" y2="62" class="fx-axis"/>
<line x1="90" y1="132" x2="610" y2="132" class="fx-axis"/>
<line x1="90" y1="202" x2="610" y2="202" class="fx-axis"/>
<line x1="330" y1="40" x2="330" y2="222" class="fx-line-muted fx-dash"/>
<text x="330" y="32" text-anchor="middle" class="fx-t-sm">forward F (centre) · dots = the 105 strike</text>
<text x="10" y="58" class="fx-t-b">7 days</text>
<text x="10" y="74" class="fx-t-sm">1σ ≈ $2.8</text>
<text x="10" y="128" class="fx-t-b">30 days</text>
<text x="10" y="144" class="fx-t-sm">1σ ≈ $5.8</text>
<text x="10" y="198" class="fx-t-b">1 year</text>
<text x="10" y="214" class="fx-t-sm">1σ ≈ $21</text>
<circle cx="468.4" cy="62" r="7" class="fx-fill-red"/>
<circle cx="393.5" cy="132" r="7" class="fx-fill-orange"/>
<circle cx="333.5" cy="202" r="7" class="fx-fill-green"/>
<text x="480" y="56" class="fx-t-bad">z = 1.73 · call $0.05</text>
<text x="405" y="126" class="fx-t-hl">z = 0.79 · call $0.71</text>
<text x="345" y="196" class="fx-t-ok">z = 0.04 · call $7.57</text>
<text x="170" y="240" text-anchor="middle" class="fx-t-sm">−2σ</text>
<text x="250" y="240" text-anchor="middle" class="fx-t-sm">−1σ</text>
<text x="330" y="240" text-anchor="middle" class="fx-t-sm">0</text>
<text x="410" y="240" text-anchor="middle" class="fx-t-sm">+1σ</text>
<text x="490" y="240" text-anchor="middle" class="fx-t-sm">+2σ</text>
<text x="570" y="240" text-anchor="middle" class="fx-t-sm">+3σ</text>
</svg>
<figcaption>Figure 2 · The same $105 strike on three rulers. The shaded band is ±1 standard deviation of the log price at expiry. Over 7 days the band is narrow and the strike sits far outside it; over a year the band is so wide that 105 is practically at the centre. Moneyness in \(\sigma\) units is what option prices actually respond to.</figcaption>
</figure>

Two consequences follow. **Time shrinks distance**: as expiry approaches, \(\sigma\sqrt{T}\) shrinks and every OTM strike drifts “farther away” in standard deviations, which is one way to see why OTM options lose value as time passes ([[theta]]). **Volatility shrinks distance too**: double \(\sigma\) and every strike is half as many standard deviations away, which is why options get more expensive when a stock becomes more volatile.

> [!WARN] Cheap is not the same as good value
> An OTM option has a low price because it has a low chance of paying. Nothing in moneyness says whether that price is too high or too low. That judgement needs probabilities ([[probability-ev]]) and a view on volatility ([[implied-vol]]). A 110 call at $0.14 can be expensive and a 95 call at $5.82 can be cheap.

### ⑤ Delta as moneyness: how traders name strikes

On a trading desk you'll rarely hear “the 104.46 call”. You'll hear “the **25-delta call**”. **Delta** (\(\Delta\)) is how much an option's price changes when the stock moves $1 — a Greek letter the course develops fully in [[delta]]. It also works as a moneyness scale:

- deep ITM calls have \(\Delta\) near 1 (they move like the stock), deep OTM calls near 0, and ATM calls near 0.5;
- puts run from 0 (deep OTM) to −1 (deep ITM), about −0.5 at the money.

For 30-day XYZ options: the 105 call has \(\Delta = 0.222\), the 110 call 0.057, the 95 put −0.163, the 90 put −0.027. The **25-delta put** is the strike whose put delta is −0.25, about $96.68; the **25-delta call** is about $104.46.

Why name strikes this way? Because delta already folds in \(\sigma\) and \(T\). A “25-delta put” is roughly equally far from the money — in the sense of ④ — on a quiet stock and a wild one, one week out or one year out. That makes it the natural coordinate for comparing option prices across products, which is exactly how the volatility smile is quoted ([[smile-skew]]).

Delta is also *roughly* the market-implied chance that an option finishes in the money, but only roughly: for the 105 call, \(\Delta = 0.222\) while the risk-neutral probability of finishing above $105 is 20.5%. [[probability-ev]] explains the gap and why neither is your real-world probability.

## @analogy
Moneyness is like **distance to the finish line in a race whose runners can sprint or stumble**.

An ITM option has already crossed the line: it is guaranteed at least the prize for crossing (its intrinsic value). An ATM option is right at the line, and one good stride either way decides it. An OTM option is still behind the line and needs to run.

Now, how far is “100 metres behind”? For a sprinter with 10 seconds left, it is exactly doable. For a walker with 10 seconds left, it is hopeless. For a walker with an hour left, it is a certainty. Distance only means something next to **speed** (volatility) and **time left** (expiry) — which is why traders measure it in standard deviations, the natural unit of “how far can this runner get before the whistle”.

The analogy breaks in one way: a runner who has crossed the line stays across. A stock that is in the money today can fall back out tomorrow — an option's moneyness can change sign as often as the price crosses the strike, right up until expiry.

## @misconceptions
- **“ITM options are better because they're already making money.”** — Being ITM is not the same as being profitable: an ITM option costs more, precisely because it contains that money. Whether the trade makes money depends on the premium paid ([[call-option]]).
- **“A strike is ITM or OTM, full stop.”** — It depends on the type: the 90 call is ITM, the 90 put OTM. And it changes whenever the stock crosses the strike.
- **“$5 out of the money is $5 out of the money.”** — Not in any sense that matters for price. The 105 call is 1.73 standard deviations away with 7 days left and 0.04 with a year left.
- **“Equal dollar distances give equal prices for calls and puts.”** — The 105 call ($0.71) costs more than the 95 put ($0.51) because the forward sits above spot and prices move in percentages.
- **“Delta is the probability of finishing in the money.”** — Close, not equal: 0.222 versus 20.5% for the 105 call, and both are risk-neutral numbers, not real-world odds.

## @takeaways
- Call ITM when \(S > K\), put ITM when \(S < K\); ATM means the strike near today's price. The same strike has opposite labels for calls and puts.
- ITM options cost more because they contain intrinsic value; OTM options are cheap because they pay only if the stock travels.
- Better rulers: log-moneyness \(\ln(K/F)\) measured from the forward, and standardised moneyness \(z = \ln(K/F)/(\sigma\sqrt{T})\).
- Time and volatility change the distance: XYZ's 105 strike is 1.73σ away at 7 days, 0.79σ at 30 days and 0.04σ at one year.
- Traders name strikes by delta (“25-delta put”) because delta already accounts for volatility and time.

## @quiz
1. XYZ trades at $100. Which option is in the money?
   - [ ] The 110 call
   - [x] The 110 put
   - [ ] The 90 put
   - [ ] The 105 call
   > A put is ITM when the strike is above the price: selling at $110 something worth $100 gains $10 right now. The 110 and 105 calls and the 90 put would all lose money if exercised today.
2. XYZ rises from $100 to $108. What happens to the 105 call and the 105 put?
   - [x] The call turns from OTM to ITM; the put turns from ITM to OTM
   - [ ] Both become ITM
   - [ ] Nothing changes; moneyness is fixed when the contract is listed
   - [ ] The call turns ITM; the put stays ITM
   > Moneyness is a relationship between the strike and the current price. At $108 the 105 call could buy $3 below market (ITM) and the 105 put would sell $3 below market (OTM).
3. Why is the 30-day XYZ 110 call ($0.14) so much cheaper than the 90 call ($10.36)?
   - [ ] Because the 110 call has less time to expiry
   - [ ] Because calls with higher strikes always have lower volatility
   - [ ] Because the 110 call is a better deal
   - [x] Because the 90 call contains $10 of intrinsic value, while the 110 call pays only if XYZ climbs more than 10% in a month
   > Both expire on the same day. The 90 call already holds $10 of real value; the 110 call is pure possibility, and a 10% rise in a month is unlikely for a stock with 20% volatility.
4. Keep the 105 strike fixed and lengthen the time to expiry from 7 days to one year. What happens to its standardised moneyness \(z = \ln(K/F)/(\sigma\sqrt{T})\)?
   - [ ] It grows, because more time means more distance
   - [ ] It stays the same, because the strike didn't move
   - [x] It shrinks toward zero (from about 1.73 to about 0.04), because \(\sigma\sqrt{T}\) grows and the forward rises toward the strike
   - [ ] It turns negative, so the call becomes deep in the money
   > The ruler \(\sigma\sqrt{T}\) widens from 0.028 to 0.20, and the one-year forward (104.08) is almost at 105. The same strike is nearly at the money in standard-deviation terms.
5. A trader asks for “the 25-delta put” on XYZ with 30 days to expiry. What are they asking for?
   - [ ] The put that costs $0.25
   - [x] The out-of-the-money put strike whose delta is −0.25, about $96.68 here
   - [ ] The put with a 25% chance of profit in the real world
   - [ ] The put with a strike 25% below the price
   > Delta works as a moneyness scale that already accounts for volatility and time. The strike with put delta −0.25 is about 96.68 for 30-day XYZ options; delta is only roughly a probability, and a risk-neutral one at that.

## @further
- [Moneyness (Wikipedia)](https://en.wikipedia.org/wiki/Moneyness) — the definitions and the standardised and forward-based variants used by practitioners.
- [Characteristics and Risks of Standardized Options (OCC)](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — defines in-the-money and out-of-the-money in the official disclosure.
- [Options exercise FAQ (Options Industry Council)](https://www.optionseducation.org/referencelibrary/faq/options-exercise) — why moneyness at expiry decides exercise, including the $0.01 automatic-exercise threshold.
- [VIX methodology (Cboe)](https://cdn.cboe.com/resources/vix/VIX_Methodology.pdf) — a real-world example of choosing and weighting strikes relative to the forward price.
- [Strategy Path](https://evidex-cloud.github.io/droplet-labs-strategy-path/) — the sister course, for thinking about odds, payoffs and decisions under uncertainty.

## @next
An OTM option's price is all “maybe”; an ITM option's price is part “already”. How much of each premium is guaranteed money, and how much is paying for the chance of more — and what happens to that second part as the days tick by?
