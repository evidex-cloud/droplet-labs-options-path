---
id: risk-neutral
prereqs: put-call-parity, binomial-one-step
demo: risk-neutral
---

# Risk-Neutral Pricing: The Most Misunderstood Idea

## @hook
Every options desk prices as if stocks grew at the risk-free rate and nobody minded risk. Nobody believes either thing. The prices are still right, because this “pretend world” isn't a claim about investors. It is bookkeeping that the hedge forces on us. Once you see why, the expected return disappears from option pricing for good.

## @bridge
In [[binomial-one-step]] the call's price came out as a weighted average, \(e^{-rT}[qV_u + (1-q)V_d]\), with a weight \(q = 0.602\) built only from \(u\), \(d\) and \(r\). It looked like a probability but wasn't anyone's forecast. This lesson says what \(q\) is: a probability in a made-up world, called \(\Q\), where every asset earns the risk-free rate. It builds Idea ② (the price is the cost of the hedge) and Idea ③ (the stock's drift is hedged away, so volatility is the only view about the future that stays in the price). The recipe “discount the \(\Q\)-expected payoff at \(r\)” is what [[binomial-trees]] runs node by node and what [[black-scholes]] solves in closed form.

## @intuition
Go back to the one-step world: XYZ at $100 goes to $120 or $80 in a year, the rate is 4%, and the 100-strike call costs $11.57 because half a share plus a $38.43 loan copies it.

Now compute one more number. Using the weight \(q = 0.602\), what is XYZ worth on average in a year?

$$
0.602 \times 120 + 0.398 \times 80 = 104.08 = 100 \times e^{0.04}
$$

Under \(q\), the stock grows **exactly at the risk-free rate**, no more and no less. That's no coincidence; \(q\) was built to do that. It is the one weighting under which holding XYZ is, on average, the same as holding cash. Call the world with these weights the **risk-neutral world**, written \(\Q\). The world we actually live in, with real probabilities, is written \(\P\).

The two worlds differ in how they get to a price:

| | Real world \(\P\) | Risk-neutral world \(\Q\) |
|---|---|---|
| Up-probability in the 120/80 world | whatever people believe, e.g. 0.763 if XYZ is expected to earn 10% | 0.602, fixed by \(u\), \(d\), \(r\) |
| Stock's expected growth | \(\mu\) (includes a reward for risk) | \(r\) |
| Discount rate for an option | its own risk-adjusted rate: unknown in advance | \(r\), for everything |
| Price of the 100-strike call | 11.57 | 11.57 |

The bottom row is the point. Both worlds give the same price, but only the second one gets there without knowing anything we can't observe.

> [!KAI] “Options assume nobody cares about risk? That's absurd.”
> Kai's friend reads “risk-neutral pricing” and laughs: real investors hate losses. The friend is right about investors and wrong about the method. Nobody assumes investors are risk-neutral. The call's price came from *copying* it with stock and cash, and the copy's cost doesn't depend on how anyone feels about risk. “Risk-neutral probabilities” are just the weights that reproduce that cost as a discounted average. They are a calculating device, like choosing convenient units.

So the recipe for any option is:

1. Pretend the stock grows at \(r\) on average (keep its volatility unchanged).
2. Average the option's payoff over that pretend distribution.
3. Discount at \(r\).

For the 1-year XYZ call with 20% volatility, this gives the 9.93 you'll meet in [[black-scholes]]. The figure shows the two worlds side by side for that call.

<figure>
<svg viewBox="0 0 660 250" role="img" aria-label="Real-world and risk-neutral distributions of XYZ in one year">
<defs><marker id="risk-neutral-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<polygon points="260,200 260,65 274,70 288,79 302,91 316,105 330,118 344,132 358,144 372,155 386,164 400,172 414,179 428,184 442,188 456,191 470,193 484,195 498,196 512,197 526,198 540,199 554,199 568,199 582,200 596,200 610,200" class="fx-area-hl"/>
<polyline points="50,200 64,200 78,200 92,199 106,197 120,193 134,186 148,174 162,159 176,139 190,119 204,99 218,82 232,71 246,65 260,65 274,70 288,79 302,91 316,105 330,118 344,132 358,144 372,155 386,164 400,172 414,179 428,184 442,188 456,191 470,193 484,195 498,196 512,197 526,198 540,199 554,199 568,199 582,200 596,200 610,200" class="fx-line-hl"/>
<polyline points="50,200 64,200 78,200 92,200 106,199 120,197 134,193 148,187 162,177 176,163 190,146 204,128 218,110 232,94 246,82 260,74 274,72 288,74 302,80 316,89 330,101 344,113 358,125 372,137 386,148 400,157 414,166 428,173 442,179 456,183 470,187 484,190 498,193 512,195 526,196 540,197 554,198 568,198 582,199 596,199 610,199" class="fx-line-blue fx-dash"/>
<line x1="40" y1="200" x2="625" y2="200" class="fx-axis" marker-end="url(#risk-neutral-ah)"/>
<line x1="260" y1="40" x2="260" y2="200" class="fx-line"/>
<line x1="274" y1="200" x2="274" y2="212" class="fx-line-hl"/>
<line x1="297" y1="200" x2="297" y2="212" class="fx-line-blue"/>
<text x="120" y="218" text-anchor="middle" class="fx-t-sm">60</text>
<text x="190" y="218" text-anchor="middle" class="fx-t-sm">80</text>
<text x="260" y="232" text-anchor="middle" class="fx-t-b">K = 100</text>
<text x="330" y="218" text-anchor="middle" class="fx-t-sm">120</text>
<text x="400" y="218" text-anchor="middle" class="fx-t-sm">140</text>
<text x="470" y="218" text-anchor="middle" class="fx-t-sm">160</text>
<text x="540" y="218" text-anchor="middle" class="fx-t-sm">180</text>
<text x="615" y="245" text-anchor="end" class="fx-t-sm">XYZ price in one year</text>
<text x="370" y="60" class="fx-t-hl">ℚ: drift r = 4%, mean 104.08</text>
<text x="370" y="78" class="fx-t-hl">shaded: ℚ(S<tspan dy="4" font-size="11">T</tspan><tspan dy="-4"> above 100) = 54%</tspan></text>
<text x="370" y="104" class="fx-t-blue">ℙ: drift μ = 10%, mean 110.52</text>
<text x="370" y="122" class="fx-t-blue">ℙ(S<tspan dy="4" font-size="11">T</tspan><tspan dy="-4"> above 100) = 66%</tspan></text>
<text x="56" y="40" class="fx-t-sm">same volatility σ = 20%</text>
<text x="56" y="58" class="fx-t-sm">price uses ℚ only: 9.93</text>
</svg>
<figcaption>Figure 1 · XYZ's price in one year in the two worlds. Both curves have the same width (the same σ); the real-world curve \(\P\), assuming an expected return of 10%, is simply shifted right. Option prices come from the solid \(\Q\) curve, which is centred on the forward 104.08. The shaded area, 54%, is the risk-neutral chance of finishing in the money; a 10%-drift investor would put it at 66%.</figcaption>
</figure>

> [!THINK] Two analysts argue about XYZ. One expects a 15% annual return, the other 0%. Both can trade the stock and borrow at 4%. Do they disagree about the fair price of the 1-year 100-strike call?
> Predict first, then open.
> ---
> No. Both must agree on 9.93. If either quoted anything else, the other could build the copy (about 0.62 shares plus a loan, rebalanced as XYZ moves) and lock in the gap. They disagree about something else: whether *buying* the call at 9.93 is a good bet. The 15% analyst expects to make money on it; the 0% analyst expects to lose. Prices are shared; opinions show up in positions.

Slide the real-world drift below and watch what moves and what stays put:

::demo[risk-neutral-drift]

We'll take it in five parts:

- **① The real-world route runs in a circle**
- **② The risk-neutral recipe**
- **③ Why μ disappears: the hedge eats it**
- **④ State prices: why ℚ leans toward bad outcomes**
- **⑤ Continuous time, Girsanov, and where ℚ is used today**

## @mechanics
### ① The real-world route runs in a circle

Try to price the one-step call honestly, in the real world. Suppose investors expect XYZ to return \(\mu = 10\%\) a year. In the 120/80 world that pins the real up-probability: \(p \times 120 + (1-p) \times 80 = 100e^{0.10}\), so \(p = 0.763\). The call's expected payoff is \(0.763 \times 20 = 15.26\).

Now discount it. At what rate? Not the risk-free 4%: that gives \(15.26 \times e^{-0.04} = 14.66\), too high by 3.09. Not the stock's 10% either. The call is a leveraged position in XYZ. Its copy holds \(\Delta \times S = 0.5 \times 100 = \$50\) of stock for every $11.57 of option, about **4.3 times** the exposure per dollar. So investors demand a much higher return from it. We know the right answer from replication, 11.57, so we can back out the rate that works:

$$
11.57 = e^{-\kappa}\times 15.26 \quad\Longrightarrow\quad \kappa = \ln\frac{15.26}{11.57} \approx 27.7\%\ \text{a year}
$$

Here \(\kappa\) (kappa) is the call's own risk-adjusted discount rate. The trouble: you could only find 27.7% *after* knowing the price. That rate also changes whenever the stock moves, because the leverage changes.

The put makes the problem even starker. Under the same real odds its expected payoff is \(0.237 \times 20 = 4.74\), yet it costs 7.65. Its expected return is \(\ln(4.74/7.65) \approx -48\%\) a year. That is negative, because a put is insurance: people accept losing money on average in exchange for a payout in the bad state. No analyst could guess a discount rate of −48% in advance. **The real-world route runs in a circle**: to get the price you need the discount rate, and to get the discount rate you need the price.

> [!DEEP] Why κ is so extreme, and why it never sits still
> An option's expected return is roughly the risk-free rate plus its leverage times the stock's risk premium:
> $$
> \kappa \approx r + \Omega\,(\mu - r), \qquad \Omega = \frac{\Delta\,S}{V}
> $$
> where \(\Omega\) (omega, the option's **elasticity**) is the percentage change in the option per 1% move in the stock, \(\Delta\) its delta and \(V\) its price. For the 1-year XYZ call, \(\Omega = 0.618 \times 100 / 9.93 = 6.2\), so at \(\mu = 10\%\) its expected return starts near \(0.04 + 6.2 \times 0.06 \approx 41\%\) a year. For the put, \(\Omega = -0.382 \times 100 / 6.00 = -6.4\) and \(\kappa \approx 0.04 - 6.4 \times 0.06 \approx -34\%\). Every move in XYZ changes \(\Delta\) and \(V\), hence \(\Omega\), hence \(\kappa\): a discount rate that is only known after the price and changes with every tick is useless as an input.

### ② The risk-neutral recipe

The way out is to change the probabilities instead of the discount rate. Choose weights under which the stock itself earns only \(r\). Every asset, option included, is then discounted at \(r\) too. The circle disappears:

$$
V_0 = e^{-rT}\,\E^{\Q}\big[\,V_T\,\big], \qquad \text{where } \Q \text{ is chosen so that } \E^{\Q}[S_T] = S\,e^{rT}
$$

Where:

- \(V_T\) is the option's payoff at expiry (e.g. \(\max(S_T - K, 0)\));
- \(\E^{\Q}\) means “average over outcomes, weighted by the risk-neutral probabilities”;
- \(e^{-rT}\) discounts at the risk-free rate; no risk premium needed, because the risk was already handled by choosing \(\Q\);
- the condition that defines \(\Q\) says the stock grows, on average, like a bank account. With dividends it becomes \(Se^{(r-q)T}\), the forward from [[forwards-carry]].

> [!EXAMPLE] The recipe on the two XYZ calls
> **One step (120/80, 4%):** \(\E^{\Q}[V_T] = 0.602 \times 20 + 0.398 \times 0 = 12.04\), and \(12.04 \times e^{-0.04} = 11.57\) ✓.
> **The 1-year call with σ = 20% (continuous outcomes):** under \(\Q\), \(\ln S_T\) is normal with mean \(\ln 100 + (0.04 - 0.02) = 4.625\) and standard deviation 0.20. Averaging the payoff over that bell curve gives \(\E^{\Q}[\max(S_T - 100, 0)] = 10.33\), and \(10.33 \times e^{-0.04} = 9.93\). Same method as the one-step tree, just with a continuous distribution.

One consequence of the condition deserves attention. **Under \(\Q\) every traded asset earns \(r\) on average**, not just the stock. Check it on the call: it costs 11.57 and its \(\Q\)-expected payoff is 12.04, a growth of \(12.04/11.57 = 1.0408 = e^{0.04}\). The same holds for the put: \(e^{0.04} \times 7.65 = 7.96 = 0.398 \times 20\). In the pretend world nothing earns a risk premium. That is what “risk-neutral” means, and it's all it means.

<figure>
<svg viewBox="0 0 660 230" role="img" aria-label="Two routes to the same price">
<defs><marker id="risk-neutral-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<text x="20" y="28" class="fx-t-b">real world ℙ</text>
<rect x="20" y="40" width="170" height="54" rx="8" class="fx-box"/>
<text x="105" y="62" text-anchor="middle" class="fx-t">up-probability p = 0.763</text>
<text x="105" y="82" text-anchor="middle" class="fx-t-sm">from μ = 10%</text>
<line x1="192" y1="67" x2="238" y2="67" class="fx-line" marker-end="url(#risk-neutral-ah2)"/>
<rect x="242" y="40" width="170" height="54" rx="8" class="fx-box"/>
<text x="327" y="62" text-anchor="middle" class="fx-t">expected payoff 15.26</text>
<text x="327" y="82" text-anchor="middle" class="fx-t-sm">0.763 × 20</text>
<line x1="414" y1="67" x2="460" y2="67" class="fx-line" marker-end="url(#risk-neutral-ah2)"/>
<rect x="464" y="40" width="180" height="54" rx="8" class="fx-bad"/>
<text x="554" y="62" text-anchor="middle" class="fx-t">discount at κ = 27.7% ?</text>
<text x="554" y="82" text-anchor="middle" class="fx-t-sm">only known after the price</text>
<text x="20" y="136" class="fx-t-b">risk-neutral world ℚ</text>
<rect x="20" y="148" width="170" height="54" rx="8" class="fx-box"/>
<text x="105" y="170" text-anchor="middle" class="fx-t">weight q = 0.602</text>
<text x="105" y="190" text-anchor="middle" class="fx-t-sm">from u, d, r only</text>
<line x1="192" y1="175" x2="238" y2="175" class="fx-line" marker-end="url(#risk-neutral-ah2)"/>
<rect x="242" y="148" width="170" height="54" rx="8" class="fx-box"/>
<text x="327" y="170" text-anchor="middle" class="fx-t">expected payoff 12.04</text>
<text x="327" y="190" text-anchor="middle" class="fx-t-sm">0.602 × 20</text>
<line x1="414" y1="175" x2="460" y2="175" class="fx-line" marker-end="url(#risk-neutral-ah2)"/>
<rect x="464" y="148" width="180" height="54" rx="8" class="fx-ok"/>
<text x="554" y="170" text-anchor="middle" class="fx-t">discount at r = 4%</text>
<text x="554" y="190" text-anchor="middle" class="fx-t-b">= 11.57</text>
<line x1="554" y1="96" x2="554" y2="144" class="fx-line-muted fx-dash" marker-end="url(#risk-neutral-ah2)"/>
<text x="562" y="124" class="fx-t-sm">same 11.57</text>
</svg>
<figcaption>Figure 2 · Two routes to the one-step call's price. The real-world route needs the call's own discount rate, which you can only find once you already know the price. The risk-neutral route moves the risk adjustment into the probabilities, and then everything is discounted at the observable \(r\).</figcaption>
</figure>

### ③ Why μ disappears: the hedge eats it

Why is it legitimate to throw away the real drift \(\mu\)? Because a hedged option position doesn't care about it.

Picture a dealer who sells Kai the 1-year call at 9.93 and immediately holds \(\Delta\) shares, re-adjusting every week as XYZ moves. If XYZ drifts up strongly, the dealer loses on the call but gains on the shares; if it drifts down, the reverse. The drift shows up on both sides of the book and cancels. What's left is the part the hedge can't remove: the wobble *around* the drift, which is volatility. That's why the price depends on \(\sigma\) but not on \(\mu\).

The main demo below runs this experiment: 300 simulated years of XYZ for any drift you choose, with the call sold at 9.93 and the hedge adjusted weekly. Per share, at expiry:

| Real drift \(\mu\) | Unhedged: expected P&L | Hedged: average (simulated) | Hedged: typical spread |
|---|---|---|---|
| −5% | +4.76 | about 0.0 | about ±1.0 |
| 4% (= r) | 0.00 | about 0.0 | about ±1.0 |
| 10% | −4.34 | about 0.0 | about ±1.0 |
| 20% | −13.65 | about 0.0 | about ±1.0 |

The unhedged column is exact: it is \(9.93e^{0.04}\) minus the real-world expected payoff. The unhedged seller's result depends heavily on the drift, and the hedged seller's doesn't. The ±1.0 that's left is the error from rebalancing only weekly. It shrinks as the hedge gets more frequent, a story [[bs-assumptions]] picks up.

> [!WARN] “μ doesn't matter” is about the price, not your P&L
> If you *buy* the call and don't hedge, the drift matters enormously: in the table, whoever sold it to you unhedged loses 13.65 per share on average when \(\mu = 20\%\). Risk-neutral pricing says only that the fair *price* is the hedge's cost. A trader with a genuine edge on \(\mu\) can use options to bet on it; the price just doesn't give that edge away for free.

### ④ State prices: why ℚ leans toward bad outcomes

There's another way to read \(q\) that explains *how* \(\Q\) differs from \(\P\). Imagine two tickets in the one-step world:

- an **up-ticket** that pays $1 if XYZ goes to 120 and nothing otherwise;
- a **down-ticket** that pays $1 if XYZ goes to 80.

Each can be copied with stock and cash, so each has a price, its **state price**. Holding both is just $1 for sure, worth \(e^{-0.04} = 0.9608\). Solving:

$$
\begin{aligned}
\text{up-ticket} &= e^{-rT} q = 0.9608 \times 0.602 = 0.578 \\
\text{down-ticket} &= e^{-rT}(1-q) = 0.9608 \times 0.398 = 0.382
\end{aligned}
$$

Any payoff is a bundle of tickets: the call is 20 up-tickets, \(20 \times 0.578 = 11.57\) ✓. **Risk-neutral probabilities are state prices scaled up by \(e^{rT}\).**

Now compare them with real odds. If investors expect 10% (\(p = 0.763\)), the up-ticket costs 0.578 for a 76.3% chance, about 0.76 per unit of probability. The down-ticket costs 0.382 for a 23.7% chance, about **1.61** per unit of probability. A dollar in the bad state is more than twice as dear as a dollar in the good state. This price per unit of real probability (0.76 up, 1.61 down) has a name in asset pricing: the **stochastic discount factor**, or pricing kernel. That isn't irrational; it is what insurance costs. People pay up for money that arrives when things go wrong. So \(\Q\) puts more weight on bad outcomes than \(\P\) does (0.398 vs 0.237 here).

This tilt is visible in real markets. Index options usually price more volatility than later shows up: from 1990 to about 2024, the VIX averaged about 19.6% while the S&P 500's subsequent 30-day realized volatility averaged about 15.5%, a gap of roughly 4 volatility points (CFA Institute analysis, July 2024). That gap, the [[variance-risk-premium]], is the \(\Q\)-versus-\(\P\) tilt measured in volatility. It is also why the market's implied distributions have a fat left tail ([[risk-neutral-density]], [[smile-skew]]).

> [!RECALL] Parity is a state-price statement
> [[put-call-parity]] said \(C - P = S - Ke^{-rT}\). In ticket language: call minus put pays \(S_T - K\) in every state, which is one share minus \(K\) sure dollars, and \(K\) sure dollars cost \(Ke^{-rT}\). No probabilities were needed then, and none are needed now. \(\Q\) is just a tidy way to keep the books.

### ⑤ Continuous time, Girsanov, and where ℚ is used today

In continuous time the stock is modelled as a random walk with drift ([[random-walk]]). Switching from \(\P\) to \(\Q\) changes only the drift, from \(\mu\) to \(r\). The volatility stays the same:

$$
\P:\ \ \frac{\dd S}{S} = \mu\,\dd t + \sigma\,\dd W^{\P} \qquad\longrightarrow\qquad \Q:\ \ \frac{\dd S}{S} = r\,\dd t + \sigma\,\dd W^{\Q}
$$

Where \(\dd S/S\) is the instantaneous return, \(\dd t\) a sliver of time, and \(\dd W\) a random shock with mean zero and variance \(\dd t\), the random-walk step. In words: **the risk-neutral world is the real world with its drift replaced by \(r\) and its randomness left alone.** For XYZ over one year, \(\ln S_T\) is centred at \(\ln 100 + (0.10 - 0.02) = 4.685\) under \(\P\) and at \(\ln 100 + (0.04 - 0.02) = 4.625\) under \(\Q\), both with standard deviation 0.20. That's the shift in Figure 1.

> [!DEEP] Girsanov's theorem in one line
> The change of drift is legal because of a result called Girsanov's theorem. Define \(\dd W^{\Q} = \dd W^{\P} + \lambda\,\dd t\) with \(\lambda = (\mu - r)/\sigma\), the **market price of risk**, the excess return earned per unit of volatility (for XYZ at \(\mu = 10\%\): \(\lambda = 0.06/0.20 = 0.3\)). Girsanov says there is a probability measure under which \(W^{\Q}\) is a plain random walk; substituting gives the \(\Q\) equation above. Volatility can't be changed this way, only drift, which is exactly why \(\sigma\) survives into the price and \(\mu\) doesn't.

Two cautions about the theory:

- **Existence is the same thing as no-arbitrage.** Weights that make every asset earn \(r\) on average exist exactly when no arbitrage exists. The one-step condition \(d < e^{rT} < u\) from [[binomial-one-step]] is the smallest case of this result, the fundamental theorem of asset pricing.
- **Uniqueness needs a complete market.** \(\Q\) is pinned down uniquely when every payoff can be copied with traded assets, as in the one-step tree or Black-Scholes. With jumps or random volatility the copy is imperfect, many \(\Q\)s fit, and the market's choice among them shows up as the smile ([[bs-assumptions]], [[stochastic-vol]]).
- **\(\Q\) is not a forecast.** A 54% risk-neutral chance of finishing in the money is a *price*, not an opinion about reality.

**Which world for which question?** A useful rule of thumb on a desk:

| Question | World | Why |
|---|---|---|
| What should this option cost? How many shares hedge it? | \(\Q\) | price = cost of the copy |
| How likely is my short put to be assigned? What's my chance of profit? | \(\P\) | a forecast about reality |
| How much could the book lose in a bad month (stress tests, VaR)? | \(\P\) | real-world scenarios |

Trading platforms often display a “probability ITM” computed from \(\N(d_2)\) or from delta. That is a \(\Q\) number. When a stock's expected return is above \(r\), it understates the real chance that a call finishes in the money and overstates it for a put. The smile tilts it further toward crashes ([[probability-ev]], [[delta]]). It's still a useful yardstick, as long as you read it as a price-implied number rather than a forecast.

Kai's covered call makes this concrete. For the 30-day 105 call, \(\N(d_2) = 20.5\%\): that is the “chance of assignment” a platform would show. An analyst expecting XYZ to return 10% a year would put the real chance at about 23%; one expecting 0% at about 19%. Over 30 days the drift barely matters, because a month's drift is small next to a month's volatility (\(5.73\) dollars of typical move). Over a year it matters more: for the 1-year 100 call, 54% under \(\Q\) becomes 66% at a 10% drift.

Where it's used today: essentially everywhere a derivative is valued. Trees ([[binomial-trees]]), the Black-Scholes formula, Monte Carlo simulation ([[monte-carlo]]) and PDE solvers all compute \(e^{-rT}\E^{\Q}[\text{payoff}]\) in different ways.

## @analogy
Think of a bookmaker taking bets on a football match. The odds on the board imply probabilities, say 60% home win, 40% away. Are those the bookmaker's honest forecast? Not really. They're set so that the money bet on each side balances. Then the bookmaker pays winners out of losers' stakes and keeps a margin whoever wins. The implied probabilities are a **pricing device** that makes the book safe. They aren't a prediction, and a sharp bettor with a better forecast can profit by betting against them.

Risk-neutral probabilities work the same way. The option dealer doesn't need to know who will “win” (whether XYZ rises). The dealer quotes at the weights that make the hedged book safe, and those weights, \(q\), are the implied odds on the board. Your own forecast, \(p\), decides whether you want to bet, not what the bet costs.

Where the analogy breaks: the bookmaker's odds come from the betting crowd and can drift anywhere the flow pushes them. The option dealer's \(q\) is forced by arithmetic, by the stock price, the possible moves and the interest rate, because the dealer can hedge by trading the stock itself. In real markets, where the hedge is imperfect, some of the bookmaker effect does creep back in. Supply and demand for crash insurance tilt option prices, which is why the smile exists.

## @misconceptions
- **“Risk-neutral pricing assumes investors don't care about risk.”** — It assumes nothing about investors. The price comes from the cost of replication; \(\Q\) is just the set of weights that writes that cost as a discounted average. Real investors can be as risk-averse as they like; their risk aversion is already in the stock price.
- **“The risk-neutral probability is the market's forecast.”** — It is a state price scaled by \(e^{rT}\). Because insurance against bad states is expensive, \(\Q\) overweights bad outcomes relative to real odds. Reading 54% as “the market thinks it's 54% likely” mixes up price and probability.
- **“To price an option, take the real-world expected payoff and discount at the risk-free rate.”** — That mixes the two worlds. With \(\mu = 10\%\) it gives 14.66 for the one-step call instead of 11.57. Use real probabilities with the option's own (unknown) discount rate, or \(\Q\) with \(r\). Never mix the two.
- **“Since μ isn't in the formula, expected returns don't matter to option traders.”** — They don't matter to the fair *price*. They matter a great deal to an unhedged position's P&L: an unhedged call seller loses 13.65 per share on average when \(\mu = 20\%\).
- **“Under ℚ the stock has no risk.”** — Under \(\Q\) the stock is exactly as volatile as in reality; only its average growth changes to \(r\). Volatility is the one thing the change of measure can't touch.

## @takeaways
- The risk-neutral world \(\Q\) is the real world with every asset's expected return set to \(r\), and volatility unchanged.
- Price of any option: \(V_0 = e^{-rT}\E^{\Q}[V_T]\). For XYZ: 11.57 in the one-step world, 9.93 for the 1-year 20%-vol call.
- \(\mu\) drops out because the hedge cancels the drift; a delta-hedged seller's average result is about zero for any \(\mu\).
- Risk-neutral probabilities are state prices times \(e^{rT}\). They lean toward bad outcomes because money in bad states is expensive, the root of the variance risk premium and the skew.
- \(\Q\) is a pricing device, not a forecast and not an assumption about investors.

## @quiz
1. In the risk-neutral world, with XYZ at $100 and \(r = 4\%\) (continuous), what is XYZ's expected price in one year?
   - [ ] $100.00, because risk-neutral means no drift
   - [x] $104.08, the forward price \(100e^{0.04}\)
   - [ ] $110.52, if investors expect 10%
   - [ ] It depends on the real up-probability
   > Under \(\Q\) every asset earns \(r\) on average: \(\E^{\Q}[S_T] = Se^{rT} = 104.08\). $110.52 is the real-world mean under a 10% expected return; $100 would mean the stock earns less than cash.
2. Why doesn't the stock's expected return \(\mu\) appear in the option's price?
   - [ ] Because μ is too hard to estimate
   - [ ] Because pricing assumes investors are risk-neutral
   - [x] Because a delta-hedged position gains and loses the drift on both sides, so the cost of the copy doesn't depend on μ
   - [ ] Because in the long run every stock earns the risk-free rate
   > The copy (Δ shares plus cash) offsets the option's exposure to the stock's drift; what the hedge can't remove is volatility. In the simulation, the hedged seller's average P&L was about zero whether μ was −5% or +20%.
3. In the one-step world (120/80, 4%), an analyst who expects μ = 10% computes \(0.763 \times 20 \times e^{-0.04} = 14.66\) for the 100-strike call. What went wrong?
   - [ ] Nothing: 14.66 is the correct price for this analyst
   - [ ] The analyst should have used 120 instead of 20
   - [ ] The analyst should have discounted at 10% instead of 4%
   - [x] The analyst mixed real-world probabilities with the risk-free discount rate; the arbitrage-free price is 11.57
   > Real probabilities need the call's own discount rate (about 27.7% here, knowable only after pricing); risk-neutral weights go with \(r\). Mixing them overprices the call by 3.09, and a seller at 14.66 could lock that in by replicating. Discounting at the stock's 10% still gives about 13.81, because the call is riskier than the stock.
4. In the one-step world, the up-ticket (pays $1 at 120) costs 0.578 and the down-ticket (pays $1 at 80) costs 0.382. What does a security paying $10 at 120 and $30 at 80 cost?
   - [ ] $20.00
   - [x] about $17.25
   - [ ] about $19.22
   - [ ] $40.00
   > It's a bundle: \(10 \times 0.578 + 30 \times 0.382 = 5.78 + 11.47 = 17.25\). $20 is the undiscounted payoff average under 50/50; state prices already include both discounting and the risk tilt.
5. For the 1-year XYZ call, the risk-neutral chance of finishing above $100 is 54%, while an investor expecting 10% returns would say 66%. Why is the risk-neutral number lower?
   - [x] Because under ℚ the stock drifts at r = 4% instead of 10%, so less of the distribution lies above the strike
   - [ ] Because ℚ uses a lower volatility than the real world
   - [ ] Because option sellers are pessimistic
   - [ ] Because the 66% includes the premium paid
   > Changing measure shifts only the drift, from μ to r; the width (σ = 20%) is unchanged. A smaller drift centres the distribution lower, so \(\Q(S_T > 100) = \N(0.10) = 54\%\) versus \(\N(0.40) = 66\%\) under a 10% drift.

## @further
- [Risk-neutral measure (Wikipedia)](https://en.wikipedia.org/wiki/Risk-neutral_measure) — definitions, state prices, and the link to no-arbitrage (the “fundamental theorem”).
- [Girsanov theorem (Wikipedia)](https://en.wikipedia.org/wiki/Girsanov_theorem) — the mathematics behind changing drift without changing volatility.
- [Carr & Wu (2009), Variance Risk Premiums](https://academic.oup.com/rfs/article-abstract/22/3/1311/1581057) — measuring the gap between risk-neutral and real-world variance across markets.
- [CFA Institute: How well does the market predict volatility? (2024)](https://blogs.cfainstitute.org/investor/2024/07/31/how-well-does-the-market-predict-volatility/) — VIX versus realized volatility since 1990, the ℚ-versus-ℙ gap in one chart.
- [Binomial options pricing model (Wikipedia)](https://en.wikipedia.org/wiki/Binomial_options_pricing_model) — the risk-neutral weight inside the tree, step by step.

## @next
One step of up-or-down is a cartoon of a stock. What happens when we chain hundreds of these steps into a tree, apply the risk-neutral recipe at every node, and let the holder exercise early? The next lesson builds the multi-step tree and watches it converge: [[binomial-trees]].
