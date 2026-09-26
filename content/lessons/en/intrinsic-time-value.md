---
id: intrinsic-time-value
prereqs: call-option, put-option, moneyness
demo: intrinsic-time-value
---

# Intrinsic vs Time Value: The Two Pieces of a Premium

## @hook
Every option price splits into two pieces: what exercising right now would give you — **intrinsic value** — and everything above that — **time value**, the price of what *might* still happen. At expiry the second piece is always zero. XYZ's 30-day at-the-money call is $2.45 of pure time value, and a one-line rule, \(0.4\,S\sigma\sqrt{T}\), gets you within 7% of it in your head.

## @bridge
[[moneyness]] measured how far each strike is from paying, and noted that the amount an option is in the money is its intrinsic value. This lesson asks what the *rest* of the premium pays for, and what makes it bigger or smaller: moneyness, time and volatility. It builds Idea ① — **shape**: before expiry an option's value curve floats above the hockey stick of [[call-option]] — and Idea ③ — **volatility**: time value is the price of uncertainty, the first place where σ visibly sets a price. What follows is [[four-positions]], which looks at who pays this time value and who collects it.

## @intuition
Take three 30-day XYZ calls with the stock at $100 and split each price in two:

| Call | Price | If exercised right now | The rest |
|---|---|---|---|
| 95 call | $5.82 | \(100 - 95 = 5.00\) | 0.82 |
| 100 call | $2.45 | 0 (nothing to gain) | 2.45 |
| 105 call | $0.71 | 0 (would lose money) | 0.71 |

The middle column is the **intrinsic value**: what the option is worth if its life ended this second. It can never be negative, because you would simply not exercise. The last column is the **time value** (also called **extrinsic value**): what buyers pay on top, for the chance that the stock moves in their favour before expiry.

$$
\text{premium} = \underbrace{\text{intrinsic value}}_{\text{exercise now}} + \underbrace{\text{time value}}_{\text{the chance of more}}
$$

Why would anyone pay 82 cents above the $5 that the 95 call is “worth” today? Picture two equally likely outcomes in 30 days: XYZ at $110 or at $90. The 95 call would pay $15 in the first case and **zero, not minus $5**, in the second. On average it pays $7.50, more than the $5 it is worth today, because the option keeps the good outcome and throws away the bad one. That asymmetry is all time value is.

> [!RECALL] This is Jensen's inequality again
> In [[linear-vs-convex]] we saw that for a kinked payoff, the average of the payoffs beats the payoff of the average: \(\E[\max(S_T - K, 0)] \ge \max(\E[S_T] - K, 0)\). Time value is exactly that gap, priced. No uncertainty, no gap — which is why time value vanishes at expiry, when there is nothing left to be uncertain about.

Now let XYZ's price vary instead of the strike. The picture below shows the 30-day 100 call's value today (the curve) against its value at expiry (the hockey stick). The shaded gap between them is time value.

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Call value today above the hockey stick, with the time value shaded">
<line x1="50" y1="210" x2="600" y2="210" class="fx-axis"/>
<line x1="50" y1="40" x2="50" y2="210" class="fx-axis"/>
<line x1="50" y1="135" x2="590" y2="135" class="fx-grid"/>
<line x1="50" y1="60" x2="590" y2="60" class="fx-grid"/>
<polygon points="60.0,210.0 73.0,210.0 86.0,210.0 99.0,210.0 112.0,210.0 125.0,210.0 138.0,209.9 151.0,209.9 164.0,209.8 177.0,209.6 190.0,209.4 203.0,209.0 216.0,208.5 229.0,207.7 242.0,206.7 255.0,205.3 268.0,203.5 281.0,201.3 294.0,198.6 307.0,195.4 320.0,191.6 333.0,187.4 346.0,182.6 359.0,177.4 372.0,171.7 385.0,165.7 398.0,159.3 411.0,152.7 424.0,145.9 437.0,138.9 450.0,131.8 463.0,124.5 476.0,117.2 489.0,109.8 502.0,102.4 515.0,94.9 528.0,87.5 541.0,80.0 554.0,72.5 567.0,65.0 580.0,57.5 580,60 320,210" class="fx-area-hl"/>
<polyline points="60,210 320,210 580,60" class="fx-line-thick fx-dash"/>
<polyline points="60.0,210.0 73.0,210.0 86.0,210.0 99.0,210.0 112.0,210.0 125.0,210.0 138.0,209.9 151.0,209.9 164.0,209.8 177.0,209.6 190.0,209.4 203.0,209.0 216.0,208.5 229.0,207.7 242.0,206.7 255.0,205.3 268.0,203.5 281.0,201.3 294.0,198.6 307.0,195.4 320.0,191.6 333.0,187.4 346.0,182.6 359.0,177.4 372.0,171.7 385.0,165.7 398.0,159.3 411.0,152.7 424.0,145.9 437.0,138.9 450.0,131.8 463.0,124.5 476.0,117.2 489.0,109.8 502.0,102.4 515.0,94.9 528.0,87.5 541.0,80.0 554.0,72.5 567.0,65.0 580.0,57.5" class="fx-line-hl"/>
<circle cx="320" cy="191.6" r="4.5" class="fx-fill-orange"/>
<circle cx="450" cy="131.8" r="4.5" class="fx-fill-orange"/>
<circle cx="190" cy="209.4" r="4.5" class="fx-fill-orange"/>
<text x="312" y="160" text-anchor="end" class="fx-t-hl">at the money: 2.45,</text><text x="312" y="176" text-anchor="end" class="fx-t-hl">all of it time value</text>
<text x="440" y="120" text-anchor="end" class="fx-t-sm">10.43 = 10 + 0.43 of time value</text>
<text x="440" y="104" text-anchor="end" class="fx-t-sm">in the money by 10:</text>
<text x="190" y="196" text-anchor="middle" class="fx-t-sm">out of the money: 0.08</text>
<text x="470" y="170" class="fx-t-sm">dashed = value at expiry</text>
<text x="470" y="186" class="fx-t-sm">(intrinsic value)</text>
<text x="45" y="214" text-anchor="end" class="fx-t-sm">0</text>
<text x="45" y="139" text-anchor="end" class="fx-t-sm">10</text>
<text x="45" y="64" text-anchor="end" class="fx-t-sm">20</text>
<text x="60" y="228" text-anchor="middle" class="fx-t-sm">80</text>
<text x="190" y="228" text-anchor="middle" class="fx-t-sm">90</text>
<text x="320" y="228" text-anchor="middle" class="fx-t-b">K = 100</text>
<text x="450" y="228" text-anchor="middle" class="fx-t-sm">110</text>
<text x="580" y="228" text-anchor="middle" class="fx-t-sm">120</text>
<text x="600" y="250" text-anchor="end" class="fx-t-sm">XYZ price today ($)</text>
<text x="60" y="34" class="fx-t-sm">value of the 30-day 100 call ($ per share)</text>
</svg>
<figcaption>Figure 1 · The 30-day 100 call (σ 20%, r 4%) as XYZ's price varies. The solid curve is its Black-Scholes value today; the dashed hockey stick is intrinsic value. The shaded gap — time value — is widest at the strike and thins out in both directions: deep out of the money there is little chance to pay, deep in the money there is little left to protect.</figcaption>
</figure>

Three things are visible at once:

- **Time value peaks at the money.** At $100 the whole $2.45 is time value. That is where the future is most undecided: a small move either way flips the option between paying and not paying.
- **Deep out of the money, time value is small** because the chance of ever paying is small (0.08 at $90).
- **Deep in the money, time value is small too** (0.43 at $110). The option already behaves almost like the stock; the right to walk away is unlikely to be needed, so it is worth little.

::demo[intrinsic-time-value-sqrt]

> [!KAI] Kai buys time value and sells time value
> Kai's protective 95 put costs $0.51, and all of it is time value: the put is out of the money, so exercising today would give nothing. Kai's covered call sells the 105 call for $0.71 — again pure time value. As the 30 days pass, both pieces melt toward zero if XYZ stays near $100. On the put, that melt is the cost of insurance; on the call, it is Kai's income.

> [!THINK] XYZ's volatility doubles overnight, from 20% to 40%, with the price still at $100. What happens to the 95 call's intrinsic value, and to its time value?
> Predict both before opening.
> ---
> Intrinsic value doesn't move: it is still \(100 - 95 = 5\). Time value more than triples, from $0.82 to about $2.60 (the call goes from $5.82 to $7.60), because bigger swings make the asymmetric payoff more valuable. Volatility acts only on the time-value piece.

We'll take it in five parts:

- **① The split, precisely**: formulas for calls and puts
- **② Time value across strikes**: why it peaks at the money
- **③ Time value across time**: the square-root melt
- **④ Time value and volatility**: the piece that σ prices
- **⑤ The 0.4 rule**: pricing an at-the-money option in your head

## @mechanics
### ① The split, precisely

For a call and a put with strike \(K\), when the stock trades at \(S\):

$$
C = \underbrace{\max(S - K,\ 0)}_{\text{intrinsic}} + \underbrace{\text{TV}_C}_{\text{time value}}, \qquad P = \underbrace{\max(K - S,\ 0)}_{\text{intrinsic}} + \underbrace{\text{TV}_P}_{\text{time value}}
$$

where \(C\) and \(P\) are the market (or model) prices of the call and the put and \(\text{TV}\) is simply whatever is left after subtracting intrinsic value. Intrinsic value uses **today's** price \(S\), not the price at expiry \(S_T\): it answers “what if I exercised this second?”

> [!EXAMPLE] The 30-day XYZ chain, split in two
> | Strike | Call | = intrinsic | + time value | Put | = intrinsic | + time value |
> |---|---|---|---|---|---|---|
> | 90 | 10.36 | 10 | 0.36 | 0.06 | 0 | 0.06 |
> | 95 | 5.82 | 5 | 0.82 | 0.51 | 0 | 0.51 |
> | 100 | 2.45 | 0 | 2.45 | 2.12 | 0 | 2.12 |
> | 105 | 0.71 | 0 | 0.71 | 5.37 | 5 | 0.37 |
> | 110 | 0.14 | 0 | 0.14 | 9.78 | 10 | −0.22 |
>
> Read the 95 call as \(5.82 = \max(100 - 95, 0) + 0.82 = 5 + 0.82\). Every out-of-the-money option is 100% time value. The last cell is negative — a real feature of European puts, explained in ②.

At expiry there is no time left, so \(\text{TV} = 0\) and the price equals intrinsic value: the curve in Figure 1 collapses onto the hockey stick. Before expiry, for a call on a stock that pays no dividend, time value is never negative — which is the formal reason why exercising such a call early, and throwing the time value away, never pays ([[call-option]], [[american-exercise]]).

### ② Time value across strikes: why it peaks at the money

Time value is the value of the right to walk away. How much that right is worth depends on how likely you are to use it *and* how much it saves you when you do:

- **At the money**, the stock is as likely to finish on either side of the strike, and every move matters. Maximum uncertainty, maximum time value ($2.45 at 100).
- **Deep out of the money**, the option will probably expire worthless no matter what; the right to walk away is almost certain to be used but saves nothing, since there is nothing to lose. Time value is small (0.14 at 110).
- **Deep in the money**, the option will almost surely be exercised; the right to walk away is almost never needed. Time value shrinks toward a floor set by interest (0.36 at 90).

That floor is worth a closer look. A deep in-the-money call is like owning the stock while keeping the strike price in the bank until expiry. The interest on \(K\) is \(K(1 - e^{-rT}) = 100 \times (1 - e^{-0.04 \times 30/365}) = 0.33\), which is why the time value of very deep ITM 30-day calls on XYZ approaches about $0.33 rather than zero.

> [!DEEP] Negative time value: deep in-the-money European puts
> A deep ITM put has the mirror problem. Exercising it pays \(K\) — but a European put pays \(K\) only at expiry, and money later is worth less than money now. So its value tends toward \(Ke^{-rT} - S\), which is *below* intrinsic value \(K - S\) by \(K(1 - e^{-rT})\). The 30-day 110 put is worth 9.78 in the Black-Scholes model against 10 of intrinsic value: time value −0.22. XYZ options are American, and an American put can be exercised today, so its price never falls below intrinsic value — the gap is exactly the early-exercise premium studied in [[american-exercise]]. Switch the main demo to puts to see the negative bars.

### ③ Time value across time: the square-root melt

Hold the stock at $100 and let the calendar run. The 100 call's value — all of it time value — shrinks:

| Days to expiry | 60 | 30 | 14 | 7 | 1 |
|---|---|---|---|---|---|
| ATM call value | 3.56 | 2.45 | 1.64 | 1.14 | 0.42 |
| Lost per day (\(\Theta\)) | −0.032 | −0.044 | −0.061 | −0.084 | −0.214 |

Two patterns stand out. First, **time value scales roughly with \(\sqrt{T}\)**: a quarter of the time leaves about half the value (28 days: $2.36; 7 days: $1.14). Second, because a square root is steep near zero, **the melt accelerates**: with 30 days left the call loses 4.4 cents a day; with one day left, 21 cents — five times faster. The daily loss is the Greek **theta** (\(\Theta\)), the subject of [[theta]].

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Time value of the at-the-money call against days to expiry">
<line x1="50" y1="210" x2="610" y2="210" class="fx-axis"/>
<line x1="50" y1="50" x2="50" y2="210" class="fx-axis"/>
<line x1="50" y1="154" x2="600" y2="154" class="fx-grid"/>
<line x1="50" y1="98" x2="600" y2="98" class="fx-grid"/>
<polyline points="60.0,63.7 82.5,67.1 105.0,70.6 127.5,74.2 150.0,77.9 172.5,81.6 195.0,85.4 217.5,89.3 240.0,93.2 262.5,97.3 285.0,101.5 307.5,105.8 330.0,110.3 352.5,114.9 375.0,119.7 397.5,124.7 420.0,129.9 442.5,135.5 465.0,141.4 487.5,147.7 510.0,154.6 532.5,162.4 555.0,171.5 559.5,173.5 564.0,175.7 568.5,178.0 573.0,180.4 577.5,183.1 582.0,186.0 586.5,189.3 591.0,193.2 595.5,198.2 600.0,210.0" class="fx-line-hl"/>
<circle cx="60" cy="63.7" r="4.5" class="fx-fill-orange"/>
<circle cx="465" cy="141.4" r="4.5" class="fx-fill-orange"/>
<circle cx="568.5" cy="178" r="4.5" class="fx-fill-orange"/>
<circle cx="595.5" cy="198.2" r="4.5" class="fx-fill-orange"/>
<text x="68" y="56" class="fx-t-sm">120 days: $5.23, losing 2.4¢ a day</text>
<text x="455" y="167" text-anchor="end" class="fx-t-sm">30 days: $2.45, losing 4.4¢ a day</text>
<text x="556" y="196" text-anchor="end" class="fx-t-sm">7 days: $1.14, losing 8.4¢ a day</text>
<text x="585" y="228" text-anchor="end" class="fx-t-bad">1 day: $0.42, losing 21¢ a day</text>
<text x="45" y="214" text-anchor="end" class="fx-t-sm">0</text>
<text x="45" y="158" text-anchor="end" class="fx-t-sm">2</text>
<text x="45" y="102" text-anchor="end" class="fx-t-sm">4</text>
<text x="60" y="244" text-anchor="middle" class="fx-t-sm">120</text>
<text x="195" y="244" text-anchor="middle" class="fx-t-sm">90</text>
<text x="330" y="244" text-anchor="middle" class="fx-t-sm">60</text>
<text x="465" y="244" text-anchor="middle" class="fx-t-sm">30</text>
<text x="600" y="244" text-anchor="middle" class="fx-t-sm">0</text>
<text x="330" y="40" text-anchor="middle" class="fx-t-sm">← more time left · days to expiry · time passing →</text>
</svg>
<figcaption>Figure 2 · The time value of XYZ's at-the-money 100 call (σ 20%, r 4%) as expiry approaches, read from left to right. The curve bends down ever faster: the last week costs almost as much as the month before it. Theta is the slope of this curve.</figcaption>
</figure>

> [!WARN] “The stock went up, yet my call lost money”
> A call's price is intrinsic value plus melting time value. If XYZ rises slowly, the gain in intrinsic value can be smaller than the time value lost. Buy the 30-day 100 call at $2.45; three weeks later XYZ is at $101 and the call, now with 9 days left, is worth about $1.88 — up $1 in the stock, down $0.57 in the option. [[before-expiry]] shows the whole family of curves.

### ④ Time value and volatility

Intrinsic value depends only on \(S\) and \(K\). Time value depends on how much the stock can still move, so it grows with volatility. For the 30-day 100 call:

| σ | 10% | 20% | 40% |
|---|---|---|---|
| ATM call value (all time value) | 1.31 | 2.45 | 4.73 |

Near the money, time value is roughly **proportional to σ**: double σ, roughly double the price. That is why option prices jump before events such as earnings, when everyone expects a large move, and sag afterwards when the move is over — the “IV crush” of [[earnings-events]]. Because volatility is the only input to an option price that cannot be read off a screen, traders reverse the relationship: they read the market's expected volatility from the time value, which is what implied volatility is ([[implied-vol]]).

### ⑤ The 0.4 rule: pricing an ATM option in your head

For an at-the-money option, the time value has a compact approximation:

$$
C_{\text{ATM}} \approx 0.4\,S\sigma\sqrt{T}
$$

where:

- \(S\) is the stock price (and the strike);
- \(\sigma\) the annual volatility and \(T\) the time to expiry in years;
- \(S\sigma\sqrt{T}\) is the size of a one-standard-deviation move over the option's life — $5.73 for XYZ over 30 days;
- 0.4 is a rounded \(1/\sqrt{2\pi} \approx 0.3989\), which comes out of the Black-Scholes formula when \(S = K\) and interest is ignored ([[black-scholes]]).

> [!EXAMPLE] XYZ's 30-day call by the rule
> \(0.4 \times 100 \times 0.20 \times \sqrt{30/365} = 0.4 \times 100 \times 0.20 \times 0.287 = 2.29\). The exact Black-Scholes price is 2.45. The whole gap is interest: with \(r = 0\) the exact price is also 2.29, and with \(r = 4\%\) the forward sits above spot, nudging the call up. The rule works at every horizon: 1 day gives \(0.4 \times 100 \times 0.20 \times \sqrt{1/365} = 0.42\) (exact 0.42); 1 year gives 8.00 (exact 7.97 at zero interest, 9.93 at 4%).

The rule packs the whole lesson into one line: time value is proportional to **how much the stock moves** (\(\sigma\)) and to the **square root of the time left** (\(\sqrt{T}\)). Everything a trader does with time value — buying it, selling it, hedging it — starts from those two dials, and the formal version of this rule is the Greek-by-Greek story of [[theta]] and [[vega]].

## @analogy
An option's premium is like the price of a **house with an unused building permit**.

The house itself is the intrinsic value: solid, countable, there whether or not anything happens. The permit — the right, not the obligation, to build an extension that could make the property worth much more — is the time value. It has value only because the future is uncertain: maybe the neighbourhood booms and the extension doubles the price, maybe it doesn't and you never build. You'd never be forced to build a money-losing extension, so the permit can't be worth less than zero.

The permit expires on a fixed date, and its value shrinks as the date approaches — slowly at first, then quickly in the last weeks, when there is no longer time for a boom. It is worth most when the decision is closest to a toss-up; if the extension is obviously profitable (deep in the money) or obviously pointless (deep out of the money), the permit adds little beyond what is already clear. And when the property market becomes more volatile, the permit is worth more, because the upside of building grows while the downside stays at “don't build”.

Where the analogy breaks: a building permit's value is hard to observe, while an option's time value is priced every second in a liquid market — which is what lets traders read volatility straight out of it.

## @misconceptions
- **“An option's price is what it's worth if exercised.”** — That's only the intrinsic value. Before expiry, almost every option trades above it; the excess is time value.
- **“Expensive options have the most time value.”** — Expensive options are usually deep in the money, and their price is mostly intrinsic value. Time value peaks at the money ($2.45 for the 100 call vs $0.36 for the 90 call).
- **“Time value decays at a steady rate.”** — It melts roughly like \(\sqrt{T}\): 4.4 cents a day with a month left, 21 cents a day on the last day.
- **“Higher volatility raises intrinsic value.”** — Intrinsic value depends only on the stock price and the strike. Volatility acts on time value only.
- **“Time value can never be negative.”** — For American options and for calls on non-dividend stocks, true. A deep in-the-money European put can trade below intrinsic value because its strike is paid only at expiry.

## @takeaways
- Premium = intrinsic value \(\max(S - K, 0)\) (or \(\max(K - S, 0)\)) + time value; out-of-the-money options are 100% time value.
- Time value is the price of the asymmetric payoff under uncertainty — Jensen's gap from [[linear-vs-convex]] — and is zero at expiry.
- It peaks at the money and thins out deep in and deep out of the money (with a small interest floor for deep ITM calls).
- It melts roughly like \(\sqrt{T}\), so the decay accelerates near expiry; it grows roughly in proportion to σ.
- At the money, \(C \approx 0.4\,S\sigma\sqrt{T}\): 2.29 by the rule for XYZ's 30-day call, 2.45 exact with interest.

## @quiz
1. XYZ is at $100. The 30-day 95 call trades at $5.82. How does its price split?
   - [ ] Intrinsic 5.82, time value 0
   - [x] Intrinsic 5.00, time value 0.82
   - [ ] Intrinsic 0.82, time value 5.00
   - [ ] Intrinsic 0, time value 5.82
   > Intrinsic value is what exercising now gives: \(\max(100 - 95, 0) = 5\). The rest, \(5.82 - 5 = 0.82\), is time value.
2. Which 30-day XYZ call has the largest time value?
   - [ ] The 90 call, because it is the most expensive
   - [ ] The 110 call, because it is all time value
   - [ ] They all have the same time value
   - [x] The 100 call, at the money
   > Time value peaks where the outcome is most uncertain — at the money ($2.45). The 90 call is expensive because of $10 of intrinsic value; its time value is only $0.36. The 110 call is all time value, but only $0.14 of it.
3. XYZ stays at $100 while the 100 call goes from 30 days to 7 days before expiry. Roughly what happens to its value, and why?
   - [ ] It falls to about a quarter ($0.61), because a quarter of the time is left
   - [ ] It stays at $2.45, because the stock hasn't moved
   - [x] It falls to about half ($1.14), because time value scales with the square root of time
   - [ ] It rises, because expiry is closer
   > \(\sqrt{7/30} \approx 0.48\), so about half: the exact value is $1.14. Time value melts like \(\sqrt{T}\), not in a straight line.
4. XYZ's implied volatility jumps from 20% to 40% with the stock unchanged at $100. What happens to the 95 call's intrinsic value?
   - [x] Nothing: it stays at $5.00
   - [ ] It doubles to $10.00
   - [ ] It rises to $7.60
   - [ ] It falls, because the option is riskier
   > Intrinsic value depends only on \(S\) and \(K\). The call's price does rise to about $7.60, but all of the increase is time value (0.82 → 2.60).
5. Using the rule \(C \approx 0.4\,S\sigma\sqrt{T}\), estimate a 1-year at-the-money call on a $50 stock with 30% volatility (ignore interest).
   - [ ] About $15.00
   - [ ] About $1.50
   - [ ] About $0.60
   - [x] About $6.00
   > \(0.4 \times 50 \times 0.30 \times \sqrt{1} = 6.00\). The rule scales with the stock price, the volatility and the square root of time.

## @further
- [Intrinsic value (Wikipedia)](https://en.wikipedia.org/wiki/Intrinsic_value_%28finance%29) — the options section defines intrinsic value for calls and puts.
- [Option time value (Wikipedia)](https://en.wikipedia.org/wiki/Option_time_value) — time value, its dependence on moneyness, time and volatility.
- [Characteristics and Risks of Standardized Options (OCC)](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the official discussion of the factors that drive option premiums.
- [Black & Scholes (1973), The Pricing of Options and Corporate Liabilities](https://doi.org/10.1086/260062) — the source of the formula behind every number in this lesson.
- [Strategy Path](https://evidex-cloud.github.io/droplet-labs-strategy-path/) — the sister course, for the value of keeping options open in decisions beyond finance.

## @next
Every premium Kai pays is money someone else collects. Who is on the other side of Kai's calls and puts, what do they earn and what do they risk? The next lesson lines up all four basic positions — buying and selling calls and puts — and shows they are mirror images.
