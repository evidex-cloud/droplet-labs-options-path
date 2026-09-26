---
id: american-exercise
prereqs: exercise-assignment, binomial-trees, rho-carry, monte-carlo, finite-difference
demo: american-exercise
---

# American Options & Early Exercise: When to Go Early

## @hook
An American option carries one extra right: to exercise before expiry. For a call on a stock that pays no dividend, that right is worth exactly nothing. For a put it is worth real money — 40 cents on Kai's 1-year put — because cash now beats cash later. The whole subject comes down to one frontier, the exercise boundary: below it you exercise, above it you wait. This lesson finds that line and shows three ways to compute it.

## @bridge
[[exercise-assignment]] covered the mechanics: how an early exercise is submitted, and why short American positions can be assigned any day. [[binomial-trees]] priced American options by taking \(\max(\text{exercise now}, \text{hold})\) at every node, and [[finite-difference]] did the same on a grid — getting $6.40 for Kai's 1-year put against $6.00 for the European. [[rho-carry]] showed how interest and dividends tilt calls and puts. This lesson asks **when, exactly, early exercise is optimal and why** — and how a forward-running [[monte-carlo]] simulation can price a right that depends on the future. It builds Idea ② (no-arbitrage): the American price is still a replication cost, but now the replicating strategy must also decide when to stop.

## @intuition
Kai bought a 1-year $100 put to protect 100 shares of XYZ (\(\sigma = 20\%\), \(r = 4\%\), no dividend). Shortly afterwards — with essentially the whole year still to run — XYZ collapses to **$70**. The put is deep in the money: exercising now means selling the shares at $100, collecting $10,000 today. Should Kai exercise, or keep the put for the rest of the year?

Count what each choice is worth, per share:

- **Exercise now:** receive \(K - S = 100 - 70 = \$30\) of value today — and the $100 strike lands in Kai's account now, where it starts earning 4%.
- **Hold to expiry (European put):** Black-Scholes values it at **$26.47**. That is *less* than the $30 available by exercising.

How can the right to sell at $100 be worth less than $30 when the stock is at $70? Split the European put, using put-call parity ([[put-call-parity]]), into pieces: \(P = C + Ke^{-rT} - S\). Holding means you will receive the strike, but a year from now: worth \(Ke^{-rT} = 96.08\), not 100. In exchange you keep the hidden call — the chance that XYZ recovers above $100, in which case you'd rather not have sold at 100. At $70 that call is worth only **$0.39**.

> [!KAI] Interest versus insurance
> Exercising gains the interest on the strike, \(100 - 96.08 = \$3.92\). It gives up the chance of a rebound above $100, worth \(\$0.39\). Net: exercising is better by about \(3.92 - 0.39 = \$3.53\) per share — exactly the gap between the $30 exercise value and the $26.47 European price. With 100 shares, that is \(3.53 \times 100 = \$353\). Kai exercises.

Now run the same comparison with XYZ at $100. The interest gain is still $3.92, but the hidden call is now worth $9.93 — giving it up would be a bad trade. Kai waits.

So somewhere between $70 and $100 there is a price where the decision flips. Below it, exercise; above it, hold. That price depends on how much time is left, and traced out over time it forms the **early-exercise boundary** \(S^*(t)\). For Kai's put it sits near **$79.4** with a year to go and climbs to $100 at expiry.

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Exercise boundary for the 1-year put over time">
<defs><marker id="american-exercise-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<polygon points="70,192 122,187 174,184 226,180 278,176 330,170 382,163 434,155 460,149 486,144 512,136 538,126 564,112 577,101 585,90 589,76 590,62 590,220 70,220" class="fx-area-bad"/>
<line x1="60" y1="220" x2="615" y2="220" class="fx-axis" marker-end="url(#american-exercise-ah)"/>
<line x1="60" y1="220" x2="60" y2="20" class="fx-axis" marker-end="url(#american-exercise-ah)"/>
<line x1="60" y1="62" x2="600" y2="62" class="fx-line-muted fx-dash"/>
<polyline points="70,192 122,187 174,184 226,180 278,176 330,170 382,163 434,155 460,149 486,144 512,136 538,126 564,112 577,101 585,90 589,76 590,62" class="fx-line-thick"/>
<polyline points="70,62 96,81 122,68 148,93 174,84 200,106 226,100 252,125 278,119 304,141 330,138 356,166" class="fx-line-hl"/>
<circle cx="356" cy="166" r="6" class="fx-fill-red"/>
<text x="54" y="224" text-anchor="end" class="fx-t-sm">75</text>
<text x="54" y="192" text-anchor="end" class="fx-t-sm">80</text>
<text x="54" y="161" text-anchor="end" class="fx-t-sm">85</text>
<text x="54" y="129" text-anchor="end" class="fx-t-sm">90</text>
<text x="54" y="97" text-anchor="end" class="fx-t-sm">95</text>
<text x="54" y="66" text-anchor="end" class="fx-t-sm">100</text>
<text x="70" y="238" text-anchor="middle" class="fx-t-sm">today</text>
<text x="200" y="238" text-anchor="middle" class="fx-t-sm">3 mo</text>
<text x="330" y="238" text-anchor="middle" class="fx-t-sm">6 mo</text>
<text x="460" y="238" text-anchor="middle" class="fx-t-sm">9 mo</text>
<text x="590" y="238" text-anchor="middle" class="fx-t-sm">expiry</text>
<text x="330" y="255" text-anchor="middle" class="fx-t-sm">calendar time</text>
<text x="604" y="58" text-anchor="end" class="fx-t-sm">K = 100</text>
<text x="80" y="210" class="fx-t-bad">exercise region: K − S beats holding</text>
<text x="400" y="100" class="fx-t">hold region</text>
<text x="80" y="176" class="fx-t-b">S*(t): 79.4</text>
<text x="372" y="202" class="fx-t-sm">82.9 at 6 months left</text>
<text x="372" y="184" class="fx-t-hl">path hits the boundary: exercise</text>
</svg>
<figcaption>Figure 1 · The early-exercise boundary of Kai's 1-year $100 put (\(\sigma = 20\%\), \(r = 4\%\)). With a year left, exercising is optimal only below about $79.4; with six months left, below $82.9; with five weeks left, below $89.9; at expiry, anywhere below $100. The highlighted path drifts down and is exercised the first time it touches the curve. Values from a fine lattice; the main demo redraws the curve for any inputs.</figcaption>
</figure>

> [!THINK] Suppose interest rates were zero. Would Kai ever exercise the put early?
> Predict before you open the answer.
> ---
> Never. With \(r = 0\) there is no interest to gain from receiving the strike early, while holding still keeps the hidden call, which is worth something as long as time remains. The American put equals the European put: both are $7.97 for the 1-year $100 put at \(r = 0\). Early exercise of a put is fundamentally a bet on the time value of money.

We'll take it in six parts:

- **① The early-exercise premium**
- **② Calls: never early without dividends**
- **③ Puts: the boundary and smooth pasting**
- **④ Computing American prices: trees, grids, approximations**
- **⑤ Longstaff–Schwartz: early exercise in a simulation**
- **⑥ In practice**

## @mechanics
### ① The early-exercise premium

An American option is a European option plus an extra right, so it can never be worth less. It is also worth at least what you would get by exercising now:

$$
V_{\text{Am}}(S, t) \;\ge\; \max\!\big(V_{\text{Eu}}(S, t),\ \text{payoff}(S)\big), \qquad \text{EEP} = V_{\text{Am}} - V_{\text{Eu}} \ge 0
$$

where \(V_{\text{Am}}\) and \(V_{\text{Eu}}\) are the American and European values with the same strike and expiry, \(\text{payoff}(S)\) is the exercise value (\(K - S\) for a put), and EEP is the **early-exercise premium**. For Kai's 1-year $100 put (1,000-step tree for the American, Black-Scholes for the European):

| XYZ price | European put | American put | Exercise value | Premium |
|---|---|---|---|---|
| 70 | 26.47 | 30.00 | 30 | 3.53 |
| 80 | 17.78 | 20.01 | 20 | 2.23 |
| 85 | 14.06 | 15.53 | 15 | 1.47 |
| 90 | 10.84 | 11.81 | 10 | 0.97 |
| 100 | 6.00 | 6.40 | 0 | 0.40 |
| 110 | 3.05 | 3.21 | 0 | 0.16 |
| 120 | 1.44 | 1.50 | 0 | 0.06 |

Three patterns. Deep in the money (70), the American put equals its exercise value: you are inside the exercise region. At 80 it is one cent above: you are just above the boundary and should hold, barely. Out of the money (110, 120) the premium is small but not zero — the stock might fall into the exercise region later.

> [!EXAMPLE] The premium depends on rates and time
> Same 1-year $100 put at spot $100: with \(r = 0\), American = European = $7.97 (premium zero); with \(r = 4\%\), $6.40 vs $6.00 (premium $0.40); with \(r = 8\%\), $5.27 vs $4.42 (premium $0.86). Short-dated options barely care: Kai's 30-day $100 put is $2.15 American vs $2.12 European, and the 30-day $95 protective put $0.512 vs $0.509. That is why the course's standard numbers can quote European prices for 30-day options without harm.

### ② Calls: never early without dividends

For a call on a stock that pays no dividend, the right to exercise early is worthless. The argument is pure no-arbitrage. A European call is always worth at least \(S - Ke^{-rT}\) (a lower bound from [[arbitrage-bounds]]), and since \(Ke^{-rT} < K\) when \(r > 0\):

$$
C_{\text{Eu}} \;\ge\; S - Ke^{-rT} \;>\; S - K
$$

where \(C_{\text{Eu}}\) is the European call, \(S - K\) is what early exercise pays, and \(Ke^{-rT}\) is the present value of the strike. The unexercised call is worth more than its exercise value, so exercising throws money away; if you want out, **sell** the call instead. Exercising early means paying the strike sooner (losing interest) and giving up the protection the call provides if the stock falls. For Kai's 1-year $100 call with XYZ at $130: exercise pays $30, while the call is worth at least \(130 - 96.08 = \$33.92\).

**Dividends change this**, because the shareholder receives the dividend and the call holder does not. With a continuous dividend yield \(q\) on XYZ (1-year $100 call, spot $100): \(q = 0\) gives American = European = 9.93; \(q = 4\%\): 7.72 vs 7.65; \(q = 6\%\): 6.93 vs 6.66; \(q = 8\%\): 6.26 vs 5.77. With a discrete dividend \(D\), the only moment worth considering is just before the ex-dividend date, and a necessary condition is that the dividend beats the interest saved by paying the strike later:

$$
D \;>\; K\big(1 - e^{-r\tau}\big)
$$

where \(\tau\) is the time from the ex-date to expiry. For a $100 strike with three months left at 4%, \(K(1 - e^{-r\tau}) = 100 \times (1 - e^{-0.01}) = \$1.00\): a dividend below $1.00 can never justify early exercise, and one above it does so only if the call's remaining time value is also small. That is the mechanism behind the ex-dividend assignment risk in [[exercise-assignment]] and [[common-traps]].

### ③ Puts: the boundary and smooth pasting

For puts the logic of the intuition generalises. Compare exercising now with holding a European put for the remaining time \(\tau\), using parity:

$$
\underbrace{(K - S)}_{\text{exercise now}} - \underbrace{\big(C_{\text{Eu}} + Ke^{-r\tau} - S\big)}_{\text{hold a European put}} \;=\; \underbrace{K\big(1 - e^{-r\tau}\big)}_{\text{interest on the strike}} - \underbrace{C_{\text{Eu}}(S, \tau)}_{\text{the hidden call}}
$$

where \(C_{\text{Eu}}(S,\tau)\) is the European call with the same strike. Early exercise is attractive when the interest term is larger. With a year left the interest is $3.92, and the call falls to $3.92 at about \(S = 87.8\). But the true boundary is lower, **$79.4**, because holding an American put also keeps the right to exercise *later*, which this comparison ignores. The crude rule tells you *why* exercise happens; the exact boundary needs the full optimisation.

At the boundary the value curve meets the payoff line in a special way — not at an angle, but tangentially. This is **smooth pasting**:

$$
V(S^*, t) = K - S^*, \qquad \frac{\partial V}{\partial S}(S^*, t) = -1
$$

where \(S^*\) is the boundary price at time \(t\). Both the value and its delta join the exercise payoff continuously: an American put deep in the money has delta −1 and gamma 0, like being short one share, because you would exercise it on the spot.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="American and European put values against the exercise value">
<defs><marker id="american-exercise-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="60" y1="220" x2="615" y2="220" class="fx-axis" marker-end="url(#american-exercise-ah2)"/>
<line x1="60" y1="220" x2="60" y2="20" class="fx-axis" marker-end="url(#american-exercise-ah2)"/>
<polyline points="70,39 367,220 590,220" class="fx-line-muted fx-dash"/>
<polyline points="70,57 89,68 107,79 126,90 144,100 163,111 181,121 200,130 219,140 237,148 256,156 274,164 293,171 311,177 330,183 349,188 367,193 386,197 404,200 423,204 441,206 460,209 479,210 497,212 516,214 534,215 553,216 571,216 590,217" class="fx-line-blue"/>
<polyline points="70,39 89,50 107,62 126,73 144,84 163,96 181,107 200,118 219,129 237,140 256,150 274,159 293,167 311,174 330,180 349,186 367,191 386,195 404,199 423,203 441,205 460,208 479,210 497,212 516,213 534,214 553,215 571,216 590,217" class="fx-line-thick"/>
<line x1="214" y1="127" x2="214" y2="220" class="fx-line fx-dash"/>
<circle cx="214" cy="127" r="5" class="fx-fill-red"/>
<text x="54" y="224" text-anchor="end" class="fx-t-sm">0</text>
<text x="54" y="179" text-anchor="end" class="fx-t-sm">10</text>
<text x="54" y="134" text-anchor="end" class="fx-t-sm">20</text>
<text x="54" y="88" text-anchor="end" class="fx-t-sm">30</text>
<text x="54" y="43" text-anchor="end" class="fx-t-sm">40</text>
<text x="70" y="238" text-anchor="middle" class="fx-t-sm">60</text>
<text x="144" y="238" text-anchor="middle" class="fx-t-sm">70</text>
<text x="219" y="238" text-anchor="middle" class="fx-t-sm">80</text>
<text x="293" y="238" text-anchor="middle" class="fx-t-sm">90</text>
<text x="367" y="238" text-anchor="middle" class="fx-t-sm">100</text>
<text x="441" y="238" text-anchor="middle" class="fx-t-sm">110</text>
<text x="516" y="238" text-anchor="middle" class="fx-t-sm">120</text>
<text x="590" y="238" text-anchor="middle" class="fx-t-sm">130</text>
<text x="222" y="120" class="fx-t-bad">S* ≈ 79.4: curves touch, slope −1</text>
<text x="128" y="66" class="fx-t-b">American</text>
<text x="84" y="118" class="fx-t-blue">European</text>
<text x="400" y="185" class="fx-t-sm">dashed: exercise value K − S</text>
<text x="80" y="30" class="fx-t-sm">value today (1 year left)</text>
</svg>
<figcaption>Figure 2 · Kai's 1-year $100 put today. The European value (violet) dips *below* the exercise value \(K - S\) for low prices — its holder is locked in and waits a year for the strike. The American value (black) never does: left of \(S^* \approx 79.4\) it lies exactly on the exercise line, and at \(S^*\) it leaves the line tangentially, with slope −1 (smooth pasting).</figcaption>
</figure>

The boundary makes the pricing problem a **free-boundary problem**: the PDE from [[finite-difference]] holds only where you hold, and where that is must be found along with the price. It can be written compactly as a linear complementarity condition:

$$
\max\!\Big(\frac{\partial V}{\partial t} + \tfrac12\sigma^2S^2\frac{\partial^2 V}{\partial S^2} + rS\frac{\partial V}{\partial S} - rV,\ \ (K - S) - V\Big) = 0
$$

where the first argument is the Black-Scholes PDE applied to \(V\) (zero where you hold, negative where you exercise — a hedged position there would earn less than the risk-free rate) and the second is how far the exercise value exceeds \(V\) (zero where you exercise, negative where you hold). At every point exactly one of them is zero. Check at \(S = 70\), deep in the exercise region: \(V = 30 = K - S\), so the second term is 0; the first is \(-rV + rS \cdot (-1) = -0.04 \times 30 - 0.04 \times 70 = -\$4.00\) per year — negative, as required: the value is frozen at \(K - S\) while cash in the bank would earn $4.00 a year on the $100 strike. That is exactly why you exercise.

> [!DEEP] The perpetual put: a boundary in closed form
> With no expiry at all, time drops out and the boundary becomes one number. For \(q = 0\), with \(\gamma = 2r/\sigma^2\), the perpetual American put has boundary \(S^* = \frac{\gamma}{1+\gamma}K\) and value \(V(S) = (K - S^*)\,(S/S^*)^{-\gamma}\) above it. For XYZ, \(\gamma = 2 \times 0.04/0.04 = 2\), so \(S^* = \tfrac23 \times 100 = \$66.67\) and \(V(100) = 33.33 \times 1.5^{-2} = \$14.81\). The finite-maturity boundary starts at \(K\) at expiry and falls towards this level as time to expiry grows: $94.5 with a week left, $89.9 with five weeks, $86.2 with three months, $82.9 with six, $79.4 with a year.

### ④ Computing American prices: trees, grids, approximations

There is no closed-form American put for finite maturity. The standard tools:

- **Trees.** At every node take \(\max(\text{exercise now}, e^{-r\Delta t}[pV_{\text{u}} + (1-p)V_{\text{d}}])\) ([[binomial-trees]]). Kai's put: 6.3861 with 50 steps, 6.3954 with 100, 6.4024 with 500, 6.4033 with 1,000, 6.4039 with 5,000. Convergence is slower and bumpier than for European options, because the boundary rarely falls exactly on a node.
- **Finite differences with projection** ([[finite-difference]]): \(V \leftarrow \max(V, \text{payoff})\) after each step, or projected SOR for the exact complementarity problem. Crank–Nicolson on a 400 × 400 grid: 6.4001.
- **Analytic approximations.** Barone-Adesi and Whaley (1987) approximated the early-exercise premium with a quadratic formula that needs only one numerical root-find; later methods refine the boundary iteratively. They are fast enough for quoting whole chains, with errors of a few cents for typical inputs.
- **Bermudan steps.** An option exercisable only on certain dates (a *Bermudan*) sits between the European and the American. Kai's put with 4 quarterly exercise dates is worth 6.29, with 12 monthly dates 6.36, with 50 dates 6.39 — converging to the American 6.40. Any numerical method that checks exercise on a discrete set of dates is really pricing a Bermudan.

### ⑤ Longstaff–Schwartz: early exercise in a simulation

Monte Carlo runs forward in time, but the exercise decision needs the *future*: to decide at month 9, a path must know what holding is worth. Longstaff and Schwartz (2001) solved this with ordinary least squares. Simulate all paths first, then walk backwards through the exercise dates. At each date, take the paths that are in the money, and **regress** the cash flow each path actually receives later (discounted back to this date) on simple functions of today's price:

$$
\hat C(S) = \beta_0 + \beta_1 x + \beta_2 x^2, \qquad x = S/K, \qquad \text{exercise if } K - S > \hat C(S)
$$

where \(\hat C(S)\) is the estimated value of holding (the *continuation value*) and the \(\beta\)s are least-squares coefficients fitted across paths. Each path's realised future cash flow is a noisy estimate of the continuation value; the regression averages that noise across paths with similar prices. Where exercise wins, the path's cash flow is replaced by \(K - S\) at this date and its later cash flows are erased. At the end, the price is the average discounted cash flow.

> [!EXAMPLE] One regression step on ten paths
> The inline demo's ten paths of XYZ (seed 12), exercise allowed at months 3, 6, 9 and 12. At month 9, four paths are in the money. Their discounted month-12 cash flows \(Y\) and the fitted \(\hat C(S) = -66.14 + 329.25x - 272.86x^2\):
>
> | Path | \(S\) at 9 mo | \(Y\) | \(\hat C(S)\) | \(K - S\) | Decision |
> |---|---|---|---|---|---|
> | 4 | 82.53 | 21.83 | 19.74 | 17.47 | hold |
> | 5 | 94.32 | 4.49 | 1.69 | 5.68 | exercise |
> | 6 | 91.74 | 2.13 | 6.28 | 8.26 | exercise |
> | 9 | 75.39 | 26.28 | 27.01 | 24.61 | hold |
>
> Path 5 exercises because the regression says holding from \(S = 94.32\) is worth only 1.69 against 5.68 now. Note the decision uses \(\hat C\), not the path's own \(Y\) — using its own future would be peeking.

::demo[american-exercise-lsm]

With serious numbers of paths the method works well: 20,000 paths and 50 exercise dates give \(6.38 \pm 0.05\) in well under a second of browser time; 100,000 paths give \(6.41 \pm 0.02\), against the tree's 6.40. Two biases pull in opposite directions. The regression rule is not the optimal rule, so it exercises a bit wrongly — a **low** bias. Fitting and pricing on the same paths lets the rule adapt to their noise — a **high** bias. Practitioners fit on one set of paths and price on a fresh set to get a clean lower bound, and use a “dual” upper-bound method when they need a confidence interval for the true price.

The regression trick is what makes simulation usable for callable and early-exercise products in many dimensions — options on baskets, callable structured notes, mortgage prepayment — where trees and grids cannot go ([[monte-carlo]]). A compact version:

```python
import numpy as np

def lsm_put(S0, K, T, r, sigma, m=50, n=100_000, seed=5):
    rng = np.random.default_rng(seed); dt = T / m
    z = rng.standard_normal((n, m))
    S = S0 * np.exp(np.cumsum((r - 0.5 * sigma**2) * dt + sigma * np.sqrt(dt) * z, axis=1))
    cash = np.maximum(K - S[:, -1], 0.0)            # cash flow, valued at the current date
    for j in range(m - 2, -1, -1):                   # exercise dates m-1 ... 1
        cash *= np.exp(-r * dt)                       # discount one step back
        itm = K - S[:, j] > 0
        x = S[itm, j] / K
        beta = np.polyfit(x, cash[itm], 2)            # least squares on 1, x, x^2
        exercise = K - S[itm, j] > np.polyval(beta, x)
        idx = np.where(itm)[0][exercise]
        cash[idx] = K - S[idx, j]
    return np.exp(-r * dt) * cash.mean()

print(lsm_put(100, 100, 1.0, 0.04, 0.20))           # about 6.4 (tree: 6.40)
```

### ⑥ In practice

Most US single-stock and ETF options are American with physical delivery (SPY, QQQ and IWM options among them), while SPX options are European and cash-settled, as of September 2026 ([[product-map]]). So early exercise is a live issue exactly where retail activity is heaviest. In practice it clusters in two places, as the Options Industry Council's guidance also describes: **calls just before an ex-dividend date**, when the dividend exceeds the call's remaining time value, and **deep in-the-money puts**, when the interest on the strike exceeds the put's remaining time value. For holders, a quick check before exercising is to compare the option's bid with its exercise value — if the bid is above, selling beats exercising. For writers of American options, early assignment is a risk to plan for rather than a surprise ([[common-traps]]).

The premium also matters for data work. Implied volatility quoted from American prices must be backed out with an American model (a tree or approximation), not Black-Scholes; using the European formula on a deep in-the-money American put gives a distorted volatility, and a price below the exercise value has no Black-Scholes volatility at all. Cleaning pipelines “de-Americanise” quotes for exactly this reason ([[options-data]]).

## @analogy
Think of the American put as a **fixed-price buy-back guarantee** on something you own — say, a dealer promises to buy your car back for $10,000 any time in the next year. If the car's market value collapses to $7,000, should you cash in now or wait?

Cashing in now gives you $10,000 in your hand today, earning interest. Waiting keeps a single advantage: if the car's value miraculously recovers above $10,000, you would be glad you had not sold. When the car is a wreck, that recovery is so unlikely that the interest wins — you cash in. When the car is still worth $9,500, a recovery is quite possible, the interest on a year is small by comparison, and you wait. The price at which you switch from waiting to cashing in is the exercise boundary, and it rises as the deadline approaches because there is less and less interest to earn.

For a buy-*option* on the car (a call), the logic flips: exercising means *paying* $10,000 early, which loses interest — so you never do it early, unless owning the car pays you something while you wait (a dividend). Where the analogy breaks: real guarantees come with fees and hassle, and in the option world the “chance of recovery” is priced under risk-neutral probabilities from the volatility, not by your hopes for the car.

## @misconceptions
- **“American options are always worth more than European ones.”** — Worth at least as much, not always more. A call on a stock that pays no dividend has an early-exercise premium of exactly zero.
- **“Deep in the money, you should always exercise early.”** — For calls without dividends, never: sell the call instead, since it is worth at least \(S - Ke^{-rT}\), more than \(S - K\). For puts, only below the boundary — at $80 with a year left, Kai's put is still one cent better held.
- **“Early exercise of a put protects you against further falls.”** — The put already pays one-for-one on further falls. What exercise buys is the strike *now* (interest); what it gives up is the chance of a rebound above the strike.
- **“Longstaff–Schwartz decides each path's exercise using that path's own future.”** — It decides with a regression fitted across many paths. Using a path's own future would be clairvoyance and would bias the price upward.
- **“A tree with enough steps prices the American option exactly.”** — It prices an option exercisable only at the tree's dates — a Bermudan — which converges to the American as steps are added, slowly and with some wobble.

## @takeaways
- The early-exercise premium is \(V_{\text{Am}} - V_{\text{Eu}} \ge 0\): $0.40 for Kai's 1-year $100 put, zero for a call on a non-dividend stock.
- Calls: never exercise early without dividends, because \(C \ge S - Ke^{-rT} > S - K\); with dividends, only just before an ex-date, and only if \(D > K(1 - e^{-r\tau})\) at least.
- Puts: exercising trades the hidden call for interest on the strike; the exercise boundary \(S^*(t)\) — $79.4 with a year left, rising to $100 at expiry — marks where interest wins, and the value meets the payoff smoothly there.
- Trees and grids handle early exercise with a max at every node; Barone-Adesi–Whaley-type approximations are fast; any discrete-date method is really pricing a Bermudan.
- Longstaff–Schwartz brings early exercise into Monte Carlo by regressing future cash flows on today's price across paths; 100,000 paths give \(6.41 \pm 0.02\) against the tree's 6.40.

## @quiz
1. XYZ is at $130 and pays no dividend. Kai holds a 1-year $100 American call and wants to lock in the gain. What is best?
   - [ ] Exercise now, since the call is deep in the money
   - [x] Sell the call — it is worth at least \(130 - 96.08 = \$33.92\), more than the $30 exercise value
   - [ ] Wait until expiry, since American calls can only be exercised then
   - [ ] Exercise half now and half at expiry
   > A European call is worth at least \(S - Ke^{-rT}\), which exceeds \(S - K\) whenever \(r > 0\). Exercising gives up interest on the strike and the downside protection; selling captures the full value.
2. Kai's 1-year $100 put, with XYZ at $70: exercise value $30, European value $26.47. What does the $3.53 gap mainly reflect?
   - [ ] The volatility of XYZ
   - [ ] The dividend XYZ pays
   - [ ] A mispricing that an arbitrageur would remove
   - [x] Interest on receiving the $100 strike now ($3.92) minus the small value of the hidden call ($0.39)
   > By parity, exercise now minus holding the European put equals \(K(1 - e^{-r\tau}) - C_{\text{Eu}} = 3.92 - 0.39 = 3.53\). The European holder cannot collect the interest, which is why the European put sits below its exercise value.
3. What happens to the exercise boundary of Kai's put as expiry approaches?
   - [x] It rises towards the strike: $79.4 with a year left, $89.9 with five weeks, $100 at expiry
   - [ ] It falls towards zero
   - [ ] It stays constant at the perpetual level $66.67
   - [ ] It disappears in the last month
   > With less time left, the interest from exercising early shrinks roughly in proportion to the time left, but the hidden call — out of the money whenever \(S < K\) — loses value much faster, so smaller in-the-money amounts already justify exercise. At expiry you exercise whenever \(S < K\).
4. In Longstaff–Schwartz, what is the dependent variable in the regression at each exercise date?
   - [ ] The option's Black-Scholes price at that date
   - [ ] The exercise value \(K - S\)
   - [x] The cash flow each in-the-money path actually receives later, discounted back to that date
   - [ ] The stock price at expiry
   > The realised future cash flow is a noisy, unbiased sample of the continuation value. Regressing it on functions of the current price estimates the continuation value as a smooth function, which is then compared with \(K - S\).
5. Why can the Longstaff–Schwartz price come out slightly too high even though a suboptimal exercise rule biases it low?
   - [ ] Because the simulation uses the real-world drift
   - [x] Because fitting the rule and pricing on the same paths lets the rule adapt to those paths' noise
   - [ ] Because the regression uses only three basis functions
   - [ ] Because the paths are discounted at the wrong rate
   > In-sample fitting is a mild form of foresight. Pricing on a fresh, independent set of paths removes it and leaves a clean lower bound.

## @further
- [Longstaff & Schwartz (2001), Valuing American Options by Simulation (RFS)](https://doi.org/10.1093/rfs/14.1.113) — the least-squares Monte Carlo paper, with worked examples.
- [Options exercise FAQ (Options Industry Council)](https://www.optionseducation.org/referencelibrary/faq/options-exercise) — when early exercise happens in practice: dividends and deep in-the-money puts.
- [American option (Wikipedia)](https://en.wikipedia.org/wiki/American_option) — definitions, the no-early-exercise result for calls, and pricing methods.
- [Monte Carlo methods for option pricing: least squares (Wikipedia section)](https://en.wikipedia.org/wiki/Monte_Carlo_methods_for_option_pricing#Least_Square_Monte_Carlo) — a short summary of the regression approach.
- [Options Disclosure Document (OCC)](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the official description of American and European exercise styles and assignment.

## @next
So far every payoff depended only on where the price ends — or, for American options, on when you decide to stop. What if the payoff depends on the whole path: whether a level was touched, what the average price was, what the maximum reached? Welcome to [[exotic-options]].
