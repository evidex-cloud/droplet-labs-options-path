---
id: arbitrage-bounds
prereqs: price-drivers, payoff-lego, exercise-assignment
demo: arbitrage-bounds
---

# Arbitrage Bounds: How Expensive or Cheap an Option Can Be

## @hook
Could Kai's 30-day XYZ call trade at $0.10? At $50? Without any model of how the stock moves, one principle — nobody leaves free money on the table — draws hard walls around every option price. The walls are rigorous, each comes with the exact trade that punishes a price outside it, and they turn out to be far too wide to price anything. That gap is why we will need a model.

## @bridge
[[price-drivers]] told us which *direction* each input pushes an option's price. This lesson asks how *far* a price can go before someone can make riskless money from it. We use two earlier tools: [[payoff-lego]] (payoffs add, so we can compare whole portfolios) and [[exercise-assignment]] (American options can be exercised early, European ones cannot). It builds Idea ② — no-arbitrage — in its purest form: rules that hold for every model at once.

## @intuition
Start with a question you can answer without any finance: **how much would you pay for the right to buy a share of XYZ for $100 in 30 days, when XYZ trades at $100 today?**

Two answers are obviously wrong.

- **More than $100.** The share itself costs $100 and gives you everything the call gives you — and more, because you never have to pay the strike. Nobody should pay more for the right to buy a thing than for the thing itself. So the call is worth **at most the stock price**.
- **Less than about $0.33.** With the call you can own XYZ in 30 days by paying $100 *then*. If you buy the share now instead, you pay $100 *now* and lose 30 days of interest on it. Paying later is worth \(100 - 100\,e^{-0.04 \times 30/365} = 100 - 99.67 = \$0.33\), so the right to pay later — and to walk away if XYZ falls — must be worth **at least $0.33**.

Kai's call actually trades at **$2.45**, comfortably between $0.33 and $100. Those two walls are **arbitrage bounds**: limits that any price must respect, whatever you believe about XYZ, because a price outside them hands someone a riskless profit.

The logic behind every bound in this lesson is one principle, called **dominance**:

> [!KEY] The no-free-lunch principle
> If portfolio A pays at least as much as portfolio B in *every* possible future, A cannot cost less than B today. If it did, you would buy A, sell B, pocket the difference, and never owe anything later. Such a trade — money now, no risk of a loss later — is an **arbitrage**.

Every bound below is dominance applied to a well-chosen pair of portfolios. And every bound comes with its enforcement: the exact trade that profits if the bound is broken. You can explore the walls for a call below. The shaded band is where a price is allowed to live; drag the quote outside it and the widget tells you which trade collects the free lunch.

::demo[arbitrage-bounds-region]

<figure>
<svg viewBox="0 0 660 270" role="img" aria-label="The allowed region for a one-year call price as a function of the stock price">
<defs><marker id="arbitrage-bounds-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<polygon points="60,220 357,20 600,20 600,31.1 319.4,220" class="fx-area-hl"/>
<line x1="60" y1="220" x2="620" y2="220" class="fx-axis" marker-end="url(#arbitrage-bounds-ah)"/>
<line x1="60" y1="220" x2="60" y2="12" class="fx-axis"/>
<line x1="60" y1="220" x2="357" y2="20" class="fx-line-bad fx-dash"/>
<polyline points="60,220 319.4,220 600,31.1" class="fx-line-ok fx-dash"/>
<polyline points="65,220.0 82,220.0 98,220.0 114,220.0 130,220.0 146,220.0 163,220.0 179,220.0 195,220.0 211,220.0 227,219.9 244,219.5 260,218.6 276,216.9 292,214.0 308,209.8 325,204.1 341,197.2 357,189.1 373,180.2 389,170.6 406,160.6 422,150.2 438,139.7 454,129.0 470,118.2 487,107.3 503,96.5 519,85.6 535,74.7 551,63.8 568,52.9 584,42.0 600,31.1" class="fx-line-thick"/>
<line x1="330" y1="38" x2="330" y2="220" class="fx-line-muted fx-dash"/>
<circle cx="330" cy="202" r="5" class="fx-fill-orange"/>
<text x="322" y="196" text-anchor="end" class="fx-t-hl">9.93</text>
<text x="282" y="66" text-anchor="end" class="fx-t-bad">upper wall: C ≤ S</text>
<text x="420" y="205" class="fx-t-ok">lower wall: C ≥ S − Ke<tspan dy="-6" font-size="11">−rT</tspan></text>
<line x1="72" y1="30" x2="96" y2="30" class="fx-line-thick"/>
<text x="102" y="34" class="fx-t">model price (σ = 20%)</text>
<text x="338" y="52" class="fx-t-sm">at S = 100 the band runs</text>
<text x="338" y="68" class="fx-t-sm">from 3.92 to 100</text>
<text x="60" y="238" text-anchor="middle" class="fx-t-sm">0</text>
<text x="195" y="238" text-anchor="middle" class="fx-t-sm">50</text>
<text x="319" y="238" text-anchor="middle" class="fx-t-sm">96.08</text>
<text x="465" y="238" text-anchor="middle" class="fx-t-sm">150</text>
<text x="600" y="238" text-anchor="middle" class="fx-t-sm">200</text>
<text x="600" y="260" text-anchor="end" class="fx-t-sm">stock price S (1-year call, K = 100, r = 4%)</text>
</svg>
<figcaption>Figure 1 · Where a 1-year, $100-strike call is allowed to trade. Above the red line it would cost more than the stock; below the green line it would cost less than "stock minus the present value of the strike". The Black-Scholes price (thick curve) is just one path through a very wide band — at \(S = 100\) the band runs from $3.92 to $100.</figcaption>
</figure>

Notice two things in the figure. Deep in the money (far right) the model price hugs the lower wall: the option is almost a forward purchase, and time value is nearly zero. Near the strike the band is enormous: $3.92 to $100 at one year, $0.33 to $100 at 30 days. **No-arbitrage alone cannot tell you whether Kai's call is worth $2.45 or $20.** Keep that in mind; it is where this stage ends.

We'll take it in five parts:

- **① The call's walls**, and a worked arbitrage below the floor
- **② The put's walls**, and what they say about early exercise
- **③ Across strikes**: falling, not too fast, and convex
- **④ Across expiries**: the calendar rule and its exceptions
- **⑤ Why the walls are too wide**, and where they are used

## @mechanics
### ① The call's walls

For a European call on a stock with continuous dividend yield \(q\):

$$
\max\!\big(S e^{-qT} - K e^{-rT},\ 0\big) \;\le\; C \;\le\; S e^{-qT}
$$

where \(S\) is the stock price, \(K\) the strike, \(T\) the years to expiry, \(r\) the risk-free rate, and \(e^{-rT}\), \(e^{-qT}\) discount factors. \(Ke^{-rT}\) is the **present value of the strike**, what you would deposit today to have exactly \(K\) at expiry. \(Se^{-qT}\) is the stock *without* the dividends paid before expiry (the call holder doesn't get them). With no dividend, \(q = 0\) and the walls are \(\max(S - Ke^{-rT}, 0) \le C \le S\).

- **Upper wall, by dominance.** One share pays \(S_T\) at expiry; the call pays \(\max(S_T - K, 0)\), which is never more. So \(C \le S\).
- **Lower wall, by dominance.** Compare portfolio A = one call + a deposit of \(Ke^{-rT}\), with portfolio B = one share. At expiry A is worth \(\max(S_T - K, 0) + K = \max(S_T, K)\), which is never less than B's \(S_T\). So \(C + Ke^{-rT} \ge S\). And a call can never be worth less than zero.

> [!EXAMPLE] A worked arbitrage: a call below its floor
> XYZ = $100, \(r = 4\%\), no dividend. The 30-day **90** call has a floor of \(100 - 90\,e^{-0.04 \times 30/365} = 100 - 89.70 = \$10.30\). Its model value is $10.36 — deep in the money, it sits almost on the floor. Suppose someone offers it at **$10.00**.
>
> | | Today | Expiry, \(S_T \ge 90\) | Expiry, \(S_T < 90\) |
> |---|---|---|---|
> | Buy the 90 call | −10.00 | exercise: pay 90, receive a share | expires worthless |
> | Short one share | +100.00 | hand back the share from the exercise | buy a share at \(S_T\), hand it back: \(-S_T\) |
> | Lend \(90\,e^{-rT}\) (buy a bill paying 90) | −89.70 | +90 (pays the exercise) | +90 |
> | **Net** | **+0.30** | **0** | \(90 - S_T > 0\) |
>
> You collect \(\$0.30\) now — \(0.30 \times 100 = \$30\) per contract — and at expiry you owe nothing in any scenario, sometimes you even gain. (Short selling needs a stock borrow; the trade works only if borrowing costs less than the edge.)

The lower wall has a famous consequence. For an **American** call on a non-dividend stock, the floor \(S - Ke^{-rT}\) is strictly *above* the exercise value \(S - K\) whenever \(r > 0\). So the call is always worth more alive than exercised: **never exercise an American call early on a stock that pays no dividend** — sell it instead. That is why American and European calls on such stocks have the same price, and why early exercise of calls is really about dividends ([[exercise-assignment]], [[american-exercise]]).

### ② The put's walls

The same reasoning, mirrored, gives the European put's walls:

$$
\max\!\big(K e^{-rT} - S e^{-qT},\ 0\big) \;\le\; P \;\le\; K e^{-rT}
$$

where the symbols are as before. The upper wall says a European put can never be worth more than the strike paid at expiry, discounted: the most it can ever pay is \(K\) (if the stock goes to zero), and that arrives only at expiry. The lower wall compares one put + one share (worth \(\max(K, S_T)\) at expiry) with a deposit of \(Ke^{-rT}\) (worth \(K\)).

**American puts have stronger walls.** You can exercise today, so an American put is worth at least its intrinsic value \(K - S\) — not just \(Ke^{-rT} - S\) — and at most \(K\) itself.

> [!EXAMPLE] The 30-day 110 put, European vs American
> XYZ = $100, strike $110, 30 days, \(r = 4\%\).
> - European floor: \(110\,e^{-0.04 \times 30/365} - 100 = 109.64 - 100 = \$9.64\). Model value: **$9.78**.
> - American floor: \(110 - 100 = \$10.00\). Model value (tree): **$10.01**.
>
> The European put may legally trade *below* its intrinsic value of $10 — you can't exercise it now, and waiting for your $110 costs interest. The American put can't: at $9.90 you would buy it, buy a share for $100, exercise, and receive $110, pocketing $0.10 on the spot.

Unlike the call, an American put *can* be worth exercising early, when it is so deep in the money that the interest on \(K\) outweighs the remaining time value. The deep-in-the-money put from [[price-drivers]] (strike 150) is exactly such a case.

### ③ Across strikes: falling, not too fast, and convex

Take calls with the same expiry at strikes \(K_1 < K_2 < K_3\). Three rules hold, each proved by a spread whose payoff can't be negative:

| Rule | Formula | Enforcing portfolio | XYZ 30-day check |
|---|---|---|---|
| falling | \(C(K_1) \ge C(K_2)\) | bull call spread, payoff ≥ 0 | 5.82 ≥ 2.45 ≥ 0.71 |
| not too fast | \(C(K_1) - C(K_2) \le (K_2 - K_1)e^{-rT}\) | spread pays at most the width | \(3.37 \le 4.98\) |
| convex | \(C(K_1) - 2C(K_2) + C(K_3) \ge 0\) (equal spacing) | butterfly, payoff ≥ 0 | \(5.82 - 4.90 + 0.71 = 1.63\) |

The third rule is the new one. A **butterfly** is long one \(K_1\) call, short two \(K_2\) calls, long one \(K_3\) call. Its payoff is a tent: zero outside \([K_1, K_3]\), rising to \(K_2 - K_1\) at the middle strike ([[butterfly]]). A payoff that is never negative can't have a negative price:

$$
C(K_1) - 2\,C(K_2) + C(K_3) \;\ge\; 0 \qquad \text{with } K_2 = \tfrac12(K_1 + K_3)
$$

In words: the middle call can't cost more than the average of its neighbours. Plotted against the strike, call prices must bend like a bowl — the curve is **convex** in \(K\). (Puts obey the same convexity; butterflies can be built from either.)

> [!EXAMPLE] A worked arbitrage: the negative butterfly
> A market maker mistakenly bids the 30-day **100** call at **$3.60**, while the 95 call is offered at $5.82 and the 105 call at $0.71.
> - **Today:** buy the 95 call (−5.82), sell two 100 calls (\(+2 \times 3.60 = +7.20\)), buy the 105 call (−0.71). Net \(= -5.82 + 7.20 - 0.71 = +\$0.67\).
> - **At expiry,** the butterfly pays \(\max(S_T - 95, 0) - 2\max(S_T - 100, 0) + \max(S_T - 105, 0)\): zero below 95 and above 105, up to $5 at 100, **never negative**.
>
> Worst case you keep $0.67 per share ($67 per butterfly); best case $5.67. The quote broke convexity: 3.60 sits above the chord between its neighbours, whose midpoint is \(\tfrac12(5.82 + 0.71) = 3.27\).

<figure>
<svg viewBox="0 0 660 230" role="img" aria-label="Butterfly payoff and convexity of call prices in the strike">
<line x1="40" y1="170" x2="295" y2="170" class="fx-axis"/>
<polygon points="112.8,170 165,70 217.2,170" class="fx-area-ok"/>
<polyline points="40,170 112.8,170 165,70 217.2,170 290,170" class="fx-line-thick"/>
<text x="112.8" y="188" text-anchor="middle" class="fx-t-sm">95</text>
<text x="165" y="188" text-anchor="middle" class="fx-t-sm">100</text>
<text x="217.2" y="188" text-anchor="middle" class="fx-t-sm">105</text>
<text x="173" y="66" class="fx-t-ok">5</text>
<text x="165" y="30" text-anchor="middle" class="fx-t-b">butterfly payoff at expiry</text>
<text x="165" y="48" text-anchor="middle" class="fx-t-sm">never negative → price ≥ 0</text>
<text x="165" y="212" text-anchor="middle" class="fx-t-sm">stock price at expiry</text>
<line x1="360" y1="170" x2="635" y2="170" class="fx-axis"/>
<polyline points="393.8,14.5 410.6,34.2 427.5,52.7 444.4,70.0 461.3,85.8 478.1,100.1 495.0,112.8 511.9,123.9 528.8,133.4 545.6,141.4 562.5,148.0 579.4,153.4 596.3,157.6 613.1,160.9 630.0,163.5" class="fx-line-hl"/>
<line x1="410.6" y1="34.2" x2="579.4" y2="153.4" class="fx-line fx-dash"/>
<circle cx="410.6" cy="34.2" r="4.5" class="fx-fill-orange"/>
<circle cx="495" cy="112.8" r="4.5" class="fx-fill-orange"/>
<circle cx="579.4" cy="153.4" r="4.5" class="fx-fill-orange"/>
<circle cx="495" cy="93.8" r="3.5" class="fx-fill-muted"/>
<circle cx="495" cy="86" r="5" class="fx-fill-red"/>
<text x="418" y="30" class="fx-t-sm">5.82</text>
<text x="487" y="128" text-anchor="end" class="fx-t-hl">2.45 (fair)</text>
<text x="587" y="148" class="fx-t-sm">0.71</text>
<text x="505" y="94" class="fx-t-sm">chord 3.27</text>
<text x="505" y="76" class="fx-t-bad">bad quote 3.60</text>
<text x="410.6" y="188" text-anchor="middle" class="fx-t-sm">95</text>
<text x="495" y="188" text-anchor="middle" class="fx-t-sm">100</text>
<text x="579.4" y="188" text-anchor="middle" class="fx-t-sm">105</text>
<text x="495" y="212" text-anchor="middle" class="fx-t-sm">strike K (30-day calls today)</text>
</svg>
<figcaption>Figure 2 · Left: the 95/100/105 butterfly never pays less than zero, so it can't cost less than zero. Right: that is the same statement as "call prices are convex in the strike" — every call price must lie on or below the chord joining its neighbours. The bad quote of $3.60 sits above the chord, and the butterfly trade harvests the gap.</figcaption>
</figure>

Convexity is more than a curiosity. The *amount* by which the middle price sits below the chord measures how likely the market thinks it is that XYZ ends near $100. That idea — butterflies price probabilities — becomes [[risk-neutral-density]].

### ④ Across expiries: the calendar rule

For **American** options, longer is never cheaper: with the same strike, \(C_A(T_2) \ge C_A(T_1)\) and \(P_A(T_2) \ge P_A(T_1)\) whenever \(T_2 > T_1\). The longer option includes every right of the shorter one. If the long one were cheaper, you would buy it and sell the short one; if the short one were exercised against you, you would exercise the long one the same day.

For **European** options the rule needs care:

- European calls on non-dividend stocks obey it too, because they are worth the same as American ones (part ①). XYZ: the 60-day 100 call is $3.56, above the 30-day $2.45.
- European puts can break it when deep in the money, and European calls can break it across a big dividend — both examples appear in [[price-drivers]]. These are not arbitrages; they are the cost of *not* being allowed to exercise.

> [!THINK] A quote screen shows XYZ's 60-day American 100 put at $2.00 and the 30-day American 100 put at $2.12. Free money?
> Work out the trade before you open the answer.
> ---
> Yes. Buy the 60-day put for $2.00 and sell the 30-day put for $2.12, collecting $0.12. If the 30-day put is exercised against you at any point, you must buy 100 shares at $100 — so exercise your 60-day put immediately and sell them at $100. If it expires unexercised, you still own a 60-day put worth at least zero. You can never end up worse than the $0.12 you collected.

### ⑤ Why the walls are too wide — and where they are used

Put every rule together for Kai's 30-day call and see how much it pins down:

| What we know without a model | Range for the 30-day 100 call |
|---|---|
| walls (part ①) | $0.33 to $100 |
| plus the 95 and 105 calls at $5.82 and $0.71, and the strike rules | from the slope limit \(5.82 - 4.98 = 0.84\) up to the chord \(\tfrac12(5.82 + 0.71) = 3.27\) |
| plus the put at $2.12 and put-call parity ([[put-call-parity]]) | exactly $2.45 — **but only relative to the put** |

The rules link prices to one another very tightly. What they cannot do is set the *level* of the whole family. Double every option's implied volatility and all prices rise together, and every bound in this lesson is still satisfied. **The level is set by how much the stock is expected to move — volatility — and saying anything about that needs a model of the stock.** [[binomial-one-step]] starts building one, from a single up-or-down step.

Meanwhile, the bounds do real work every day:

- **Data cleaning.** Before any analysis, quant desks throw out quotes that violate these walls, usually stale or crossed prints ([[options-data]]).
- **Volatility surfaces.** A fitted surface must respect convexity in strike and the calendar rule, or it implies negative probabilities; that is the "no-arbitrage" condition in [[surface-calibration]].
- **Exercise decisions.** The call floor proves you should almost never exercise an American call early without a dividend.

> [!WARN] Violations in real quotes are rarely free money
> A quote that seems to break a bound usually has an innocent explanation: you are comparing a bid with an ask on the wrong side, a quote is stale, a dividend or hard-to-borrow fee is missing from your \(q\), or the options are American and your formula is European. After bid-ask spreads, commissions and the cost of borrowing stock, genuine arbitrages are tiny and fleeting — market makers' systems take them in milliseconds.

## @analogy
Think of the price of a **concert ticket resale option**: a voucher that lets you buy one ticket for a fixed $100 on the day of the show, if you want to.

- The voucher can't be worth more than the ticket itself — the ticket gives you the seat without paying anything more. That is the upper wall.
- The voucher can't be worth less than "ticket price minus the $100 you'll pay", adjusted for paying later rather than now. If tickets trade at $180, a voucher selling for $50 is a gift: buy it, sell a ticket you'll deliver on the day, and keep the difference. That is the lower wall.
- A voucher at $100 can't cost less than a voucher at $120 for the same show, and the middle voucher of three evenly spaced ones can't cost more than the average of the other two. Those are the strike rules.

But notice what the rules never tell you: whether the band is sold out, or whether the show will be a flop. The walls say the voucher is worth somewhere between $80 and $180; *where* in that range depends on how uncertain the ticket price is — which is a question about the future, not about arbitrage. The analogy is imperfect: concert tickets can't be sold short or stored like shares, so real-world voucher prices can drift outside the walls without anyone able to collect. For listed stock options, the walls are policed every second.

## @misconceptions
- **"An option can be priced by no-arbitrage alone."** — No-arbitrage pins down *relative* prices (call vs put, strike vs strike) very tightly, but not the level. Kai's 30-day call could be anywhere from $0.33 to $100 on bounds alone; its level depends on volatility.
- **"A European option can never trade below its intrinsic value."** — A European put can: the 30-day 110 put is worth $9.78 against intrinsic $10, because you can't exercise it now and waiting for the strike costs interest. American options can't.
- **"You should exercise a deep in-the-money American call to lock in the profit."** — On a stock with no dividend, the call is always worth more than its exercise value (floor \(S - Ke^{-rT} > S - K\)). Sell it instead of exercising.
- **"A price outside a bound on my screen is free money."** — Check the side (bid vs ask), staleness, dividends, borrow costs and exercise style first. Real violations after costs are rare and short-lived.
- **"Butterflies can have negative prices when the market is stressed."** — A payoff that is never negative can't have a negative price without an arbitrage. A negative butterfly in data usually means a bad quote, or an arbitrage that won't last.

## @takeaways
- Dominance: if A pays at least as much as B in every future, A can't cost less than B today. Every bound is dominance applied to a pair of portfolios.
- Call walls: \(\max(Se^{-qT} - Ke^{-rT}, 0) \le C \le Se^{-qT}\); put walls: \(\max(Ke^{-rT} - Se^{-qT}, 0) \le P \le Ke^{-rT}\); American puts at least \(K - S\).
- Across strikes, call prices fall, fall no faster than the discounted strike gap, and are convex (butterflies cost at least zero).
- American options are never cheaper with more time; European puts and dividend-paying calls can be.
- The walls are wide — $0.33 to $100 for Kai's call — because they can't see volatility. Pricing the level needs a model.

## @quiz
1. XYZ is at $100, \(r = 4\%\), no dividend. What are the arbitrage bounds for the 30-day 100 European call?
   - [ ] Between $0 and $2.45
   - [ ] Between $2.12 and $2.45
   - [x] Between about $0.33 and $100
   - [ ] Between $100 and $100.33
   > The floor is \(S - Ke^{-rT} = 100 - 99.67 = 0.33\) and the ceiling is the stock price, $100. The model price of $2.45 lies inside, but bounds alone can't pick it out.
2. The 30-day 90 call is offered at $10.00 while its floor is $10.30. Which trade locks in the difference?
   - [ ] Sell the call, buy the stock, borrow $89.70
   - [x] Buy the call, short the stock, lend $89.70 until expiry
   - [ ] Buy the call and wait for the stock to rise
   - [ ] Buy the call, buy the stock, borrow $89.70
   > Buy the cheap side: call + $89.70 in bills pays \(\max(S_T, 90)\), which always covers returning the shorted share. Net today: \(-10.00 + 100 - 89.70 = +0.30\); at expiry you owe nothing and may gain \(90 - S_T\).
3. For equally spaced strikes 95, 100, 105 with the same expiry, which quote combination is impossible without arbitrage?
   - [ ] 5.82, 2.45, 0.71
   - [ ] 6.10, 2.90, 0.90
   - [ ] 5.50, 2.20, 0.55
   - [x] 5.82, 3.60, 0.71
   > Convexity requires \(C(95) - 2C(100) + C(105) \ge 0\). For the last set, \(5.82 - 7.20 + 0.71 = -0.67\): buy the 95 and 105 calls, sell two 100 calls, and collect $0.67 for a payoff that is never negative. The other sets give 1.63, 1.20 and 1.65.
4. Why is it (almost) never optimal to exercise an American call early on a stock that pays no dividend?
   - [ ] Because exercising early is forbidden by the OCC
   - [ ] Because calls always lose value with time
   - [ ] Because the stock is expected to rise
   - [x] Because the call is always worth at least \(S - Ke^{-rT}\), which is more than the exercise value \(S - K\) when \(r > 0\)
   > The lower wall puts the call's value above what exercise delivers, so selling the call beats exercising it. With dividends, exercising just before the ex-date can be worth it, which is why early exercise of calls is a dividend story.
5. Doubling every XYZ option's implied volatility would raise all their prices. Which arbitrage bounds would this break?
   - [ ] The call's upper wall
   - [ ] Convexity in the strike
   - [x] None of them — the bounds hold for any level of volatility
   - [ ] The calendar rule
   > The bounds are model-free: they constrain prices relative to the stock, cash and each other, not the overall level. That is exactly why they cannot price an option on their own and we need a model of volatility.

## @further
- [Merton (1973), Theory of Rational Option Pricing](https://doi.org/10.2307/3003143) — the original derivation of these bounds and of the result that American calls on non-dividend stocks are never exercised early.
- [Rational pricing — Wikipedia](https://en.wikipedia.org/wiki/Rational_pricing) — the no-arbitrage principle and how it prices forwards, swaps and option bounds.
- [Butterfly (options) — Wikipedia](https://en.wikipedia.org/wiki/Butterfly_(options)) — the structure behind the convexity rule.
- [Gatheral & Jacquier (2014), Arbitrage-free SVI volatility surfaces](https://arxiv.org/abs/1204.0646) — how these static-arbitrage conditions become constraints on a fitted volatility surface.
- [OIC — options exercise FAQ](https://www.optionseducation.org/referencelibrary/faq/options-exercise) — practical notes on early exercise and dividends.

## @next
The strongest rule of all is still missing. A call and a put with the same strike and expiry aren't just bounded; they are welded together by an exact equation. But that equation runs through one more quantity — the forward price. Next: what does it cost to buy a stock *later*, and why is that price the anchor of the whole option world?
