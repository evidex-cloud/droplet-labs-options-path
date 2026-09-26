---
id: black-scholes
prereqs: binomial-trees, risk-neutral, random-walk
demo: black-scholes
---

# The Black-Scholes Formula, Term by Term

## @hook
A call option is “if it's worth it at expiry, receive the stock and pay the strike.” The Black-Scholes formula does exactly one thing: it values **what you receive** and **what you pay**, each weighted by a risk-neutral probability and discounted to today, and subtracts. Understand those two terms and you understand the formula.

## @bridge
In [[binomial-trees]] we sliced the time to expiry into many steps and worked backwards node by node to a price. [[risk-neutral]] showed that this price is the expected payoff in a risk-neutral world, discounted to today. [[random-walk]] showed that when the steps become infinitely fine, the stock traces a lognormal random path. This lesson puts the three together: **as the number of steps goes to infinity, the tree converges to one closed-form formula.** It builds Idea ② (no-arbitrage: the price is the cost of replication) and Idea ③ (volatility: of the five inputs, σ is the only one you cannot see).

## @intuition
Forget the formula for a moment and look at something concrete.

Kai's XYZ trades at $100. Suppose Kai wants a **1-year call with a $100 strike** (volatility 20%, risk-free rate 4%, no dividend). A year from now there are only two kinds of outcome:

- XYZ finishes above $100: Kai exercises, **pays $100 and receives one XYZ share**;
- XYZ finishes below $100: the option expires worthless and nothing happens.

So the option is two *conditional* actions: **conditionally receive the stock**, and **conditionally pay the strike**. What is it worth today? What each of those actions is worth today, one minus the other.

> [!KAI] Kai's 1-year call
> In the risk-neutral world ([[risk-neutral]]), the chance that XYZ finishes above $100 in a year is about **54%**. In those in-the-money outcomes XYZ finishes, on average, around **$119**.
> - What Kai pays: $100, only in the 54% of outcomes where it's worth it, discounted to today → \(100 \times e^{-0.04} \times 0.54 \approx \$51.87\);
> - What Kai receives: the stock, but only in the good outcomes, where it is worth more on average → about **$61.79** in today's money;
> - The option \(\approx 61.79 - 51.87 \approx \$9.93\), or \(9.93 \times 100 \approx \$993\) per contract.

That is the whole meaning of the Black-Scholes call formula. In symbols:

$$
C = \underbrace{S\,\N(d_1)}_{\text{today's value of the stock you receive}} \;-\; \underbrace{K e^{-rT}\,\N(d_2)}_{\text{today's value of the strike you pay}}
$$

Here \(S\) is the spot price, \(K\) the strike, \(T\) the time to expiry in years, \(r\) the risk-free rate, and \(\N(\cdot)\) the cumulative standard normal distribution (a number between 0 and 1). The two \(\N\)s are the two “conditionals” above:

- \(\N(d_2)\) is the **risk-neutral probability** that the option finishes **in the money** (S above K) — 0.5398 in Kai's example;
- \(\N(d_1)\) is a bit larger (0.6179), because “receiving the stock” only happens in the outcomes where the stock is high, so the stock is worth more exactly when you get it.

::demo[black-scholes-terms]

> [!THINK] Why is \(\N(d_1)\) always larger than \(\N(d_2)\)?
> Think first: both are about finishing in the money — what is the difference?
> ---
> \(\N(d_2)\) only counts *how often* the option ends in the money. \(S\,\N(d_1)\) measures *what the stock you receive is worth* in those outcomes. The in-the-money outcomes are precisely the high-price outcomes — averaging $119, not $100 — so weighting by the stock's value gives a larger weight. How much larger depends on \(\sigma\sqrt{T}\): more volatility and more time widen the gap.

One key input hides inside \(d_1\) and \(d_2\): **volatility σ**. Spot, strike, time and the interest rate are all on your screen; only σ is not — it describes how much the future will shake. The larger σ, the better the good outcomes get, while the bad outcomes can at worst take the option to zero, so the option costs more. That asymmetry is the convexity of Idea ① ([[linear-vs-convex]]). Later you'll see that the market simply **quotes options in σ** ([[implied-vol]]), because everybody already knows the other four inputs.

We'll take it in five parts:

- **① From the tree to the formula**: where it comes from
- **② Reading \(d_1\) and \(d_2\)**: two standard scores
- **③ The two \(\N\)s, the put formula and parity**
- **④ Five inputs, one unknown**: why σ is the star
- **⑤ The PDE, hedging and the formula's place today**

## @mechanics
### ① From the tree to the formula

In [[binomial-trees]] every node obeyed the same rule: \(V = e^{-r\Delta t}\,\big[\,q\,V_{\text{up}} + (1-q)\,V_{\text{down}}\,\big]\), where \(q\) is the risk-neutral probability and \(V_{\text{up}}\), \(V_{\text{down}}\) are the values of the two child nodes. Slice a year into \(N\) steps of length \(\Delta t = T/N\), set \(u = e^{\sigma\sqrt{\Delta t}}\) and \(d = 1/u\), and let \(N \to \infty\): the binomial distribution converges to a normal one (the central limit theorem), and “weight node by node, then discount” becomes an integral:

$$
C = e^{-rT}\,\E^{\Q}\!\left[\max(S_T - K,\,0)\right]
$$

Here \(\E^{\Q}\) is an expectation under the risk-neutral measure \(\Q\): pretend the stock's expected growth rate is \(r\), so \(\ln S_T\) is normally distributed with mean \(\ln S + (r - \tfrac12\sigma^2)T\) and variance \(\sigma^2 T\) ([[random-walk]]). Work that expectation out and you get the closed-form Black-Scholes formula.

> [!EXAMPLE] The tree really does converge to the formula
> Kai's 1-year, $100-strike call (\(S = 100,\ \sigma = 20\%,\ r = 4\%\)):
> - 5-step tree: $10.30
> - 50 steps: $9.89
> - 500 steps: $9.92
> - Black-Scholes: **$9.93**
>
> The more steps, the more tightly the tree price oscillates around the formula price.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Risk-neutral distribution and the in-the-money region">
<defs><marker id="black-scholes-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<polygon points="250,190 250,47 264,53 278,62 292,75 306,89 320,104 334,118 348,131 362,143 376,152 390,161 404,167 418,173 432,177 446,180 460,183 474,185 488,186 502,187 516,188 530,189 544,189 558,189 572,189 586,190 600,190" class="fx-area-hl"/>
<polyline points="40,190 54,190 68,190 82,189 96,187 110,183 124,175 138,163 152,146 166,126 180,104 194,83 208,66 222,53 236,47 250,47 264,53 278,62 292,75 306,89 320,104 334,118 348,131 362,143 376,152 390,161 404,167 418,173 432,177 446,180 460,183 474,185 488,186 502,187 516,188 530,189 544,189 558,189 572,189 586,190 600,190" class="fx-line-hl"/>
<line x1="30" y1="190" x2="615" y2="190" class="fx-axis" marker-end="url(#black-scholes-ah)"/>
<line x1="250" y1="30" x2="250" y2="190" class="fx-line fx-dash"/>
<line x1="317" y1="95" x2="317" y2="190" class="fx-line-muted fx-dash"/>
<text x="110" y="208" text-anchor="middle" class="fx-t-sm">60</text>
<text x="180" y="208" text-anchor="middle" class="fx-t-sm">80</text>
<text x="250" y="208" text-anchor="middle" class="fx-t-b">K = 100</text>
<text x="320" y="208" text-anchor="middle" class="fx-t-sm">120</text>
<text x="390" y="208" text-anchor="middle" class="fx-t-sm">140</text>
<text x="460" y="208" text-anchor="middle" class="fx-t-sm">160</text>
<text x="530" y="208" text-anchor="middle" class="fx-t-sm">180</text>
<text x="600" y="230" text-anchor="end" class="fx-t-sm">stock price in one year</text>
<text x="258" y="28" class="fx-t">strike</text>
<text x="400" y="80" class="fx-t-hl">shaded = finishes ITM: N(d₂) ≈ 54%</text>
<text x="400" y="100" class="fx-t-sm">average price in these outcomes ≈ 119</text>
<text x="323" y="160" class="fx-t-sm">119</text>
<text x="44" y="36" class="fx-t-sm">S = 100, σ = 20%</text>
<text x="44" y="54" class="fx-t-sm">r = 4%, T = 1 year (risk-neutral)</text>
</svg>
<figcaption>Figure 1 · The risk-neutral distribution of XYZ's price in one year (a right-skewed lognormal). The shaded outcomes are those where the option finishes in the money; their area is \(\N(d_2)\). Those outcomes average about $119, which is why “receive the stock” is worth \(S\,\N(d_1) = 61.79\) today — more than \(100 \times 0.54\).</figcaption>
</figure>

> [!DEEP] How the expectation turns into two \(\N\)s
> Split the expectation in two: \(\E^{\Q}[\max(S_T-K,0)] = \E^{\Q}[S_T\,\mathbf{1}_{S_T>K}] - K\,\Q(S_T > K)\). The second piece is simply \(K\,\N(d_2)\). The first uses a change of numéraire: measured in units of the stock, the drift of \(\ln S_T\) gains an extra \(\sigma^2\), so \(\E^{\Q}[S_T\mathbf{1}_{S_T>K}] = S e^{rT}\N(d_1)\). Multiply by \(e^{-rT}\) and you have \(S\,\N(d_1) - Ke^{-rT}\N(d_2)\).

### ② Reading \(d_1\) and \(d_2\)

The two \(d\)s are defined as:

$$
d_1 = \frac{\ln(S/K) + \left(r + \tfrac12\sigma^2\right)T}{\sigma\sqrt{T}}, \qquad d_2 = d_1 - \sigma\sqrt{T}
$$

Term by term:

- \(\ln(S/K)\): how far spot is from the strike (moneyness, in log form). Zero at the money; 0.095 when \(S = 110,\ K = 100\).
- \(rT\): in the risk-neutral world the stock drifts up at \(r\) on average. This term makes the forward \(F = Se^{rT}\), not \(S\), the centre of the distribution ([[forwards-carry]]).
- \(\pm\tfrac12\sigma^2 T\): the convexity correction. It is subtracted in \(d_2\) (a lognormal's median sits below its mean) and added in \(d_1\) (weighting by the stock shifts the distribution right).
- The denominator \(\sigma\sqrt{T}\): the total volatility accumulated until expiry — the width of one standard deviation.

So **\(d_2\) is a standard score (a z-score)**: how many standard deviations the centre of \(\ln S_T\) sits above \(\ln K\). The further above, the closer the in-the-money probability \(\N(d_2)\) gets to 1.

> [!EXAMPLE] Kai's 1-year option: computing \(d_1\) and \(d_2\)
> \(S = K = 100,\ r = 4\%,\ \sigma = 20\%,\ T = 1\):
> $$
> d_1 = \frac{0 + (0.04 + 0.02) \times 1}{0.2 \times 1} = 0.30, \qquad d_2 = 0.30 - 0.20 = 0.10
> $$
> From a table (or the demo): \(\N(0.30) = 0.6179\), \(\N(0.10) = 0.5398\). Therefore
> $$
> \begin{aligned}
> C &= 100 \times 0.6179 - 100\,e^{-0.04} \times 0.5398 \\
>   &= 61.791 - 51.866 = 9.925 \approx 9.93
> \end{aligned}
> $$

<figure>
<svg viewBox="0 0 640 190" role="img" aria-label="d1 and d2 on a ruler measured in standard deviations">
<line x1="40" y1="120" x2="610" y2="120" class="fx-axis"/>
<line x1="120" y1="104" x2="120" y2="136" class="fx-line"/>
<text x="120" y="156" text-anchor="middle" class="fx-t-b">ln K (z = 0)</text>
<text x="240" y="136" text-anchor="middle" class="fx-t-sm">0.1</text>
<text x="360" y="136" text-anchor="middle" class="fx-t-sm">0.2</text>
<text x="480" y="136" text-anchor="middle" class="fx-t-sm">0.3</text>
<rect x="120" y="62" width="240" height="22" rx="4" class="fx-hl"/>
<text x="240" y="77" text-anchor="middle" class="fx-t-sm">risk-neutral drift rT ÷ σ√T = 0.20</text>
<rect x="240" y="30" width="120" height="22" rx="4" class="fx-bad"/>
<text x="300" y="45" text-anchor="middle" class="fx-t-sm">− ½σ√T</text>
<rect x="360" y="30" width="120" height="22" rx="4" class="fx-blue"/>
<text x="420" y="45" text-anchor="middle" class="fx-t-sm">+ ½σ√T</text>
<circle cx="240" cy="120" r="7" class="fx-fill-orange"/>
<text x="240" y="104" text-anchor="middle" class="fx-t-hl">d₂ = 0.10</text>
<circle cx="480" cy="120" r="7" class="fx-fill-blue"/>
<text x="480" y="104" text-anchor="middle" class="fx-t-blue">d₁ = 0.30</text>
<line x1="240" y1="146" x2="480" y2="146" class="fx-line"/>
<line x1="240" y1="140" x2="240" y2="152" class="fx-line"/>
<line x1="480" y1="140" x2="480" y2="152" class="fx-line"/>
<text x="360" y="166" text-anchor="middle" class="fx-t-sm">apart by σ√T = 0.20</text>
<text x="40" y="184" class="fx-t-sm">units: one standard deviation of the log price (σ√T = 0.20)</text>
</svg>
<figcaption>Figure 2 · On a ruler measured in standard deviations: starting from \(\ln K\), the risk-neutral drift moves the centre right by \(rT/(\sigma\sqrt{T}) = 0.20\) standard deviations; \(d_2\) then steps back half a \(\sigma\sqrt{T}\) and \(d_1\) steps forward half. The two are always exactly one \(\sigma\sqrt{T}\) apart.</figcaption>
</figure>

### ③ The two \(\N\)s, the put formula and parity

| Symbol | Kai's value | What it is | Where you use it |
|---|---|---|---|
| \(\N(d_2)\) | 0.5398 | risk-neutral probability of finishing in the money | the price of a digital option × \(e^{rT}\); the correct reading of “probability ITM” |
| \(\N(d_1)\) | 0.6179 | the call's delta (no dividends) | hedging one call contract takes about 62 shares ([[delta]]) |
| \(Ke^{-rT}\) | 96.08 | present value of the strike | the “cash leg” of put-call parity |

The put is the mirror image: it pays in the outcomes where the option finishes **out** of the call's money.

$$
P = K e^{-rT}\,\N(-d_2) - S\,\N(-d_1)
$$

> [!EXAMPLE] Kai's 1-year put
> \(\N(-0.10) = 0.4602\), \(\N(-0.30) = 0.3821\):
> $$
> P = 96.079 \times 0.4602 - 100 \times 0.3821 = 44.213 - 38.209 = 6.004 \approx 6.00
> $$
> Check with put-call parity ([[put-call-parity]]): \(C - P = 9.93 - 6.00 = 3.93\), while \(S - Ke^{-rT} = 100 - 96.08 = 3.92\) — the one-cent gap is rounding. The formula and parity always agree, because both come from the same no-arbitrage argument.

The textbook check most books use is \(S = K = 100,\ T = 1,\ r = 5\%,\ \sigma = 20\%\): call **10.45**, put **5.57**. The main demo has a “Textbook check” button that reproduces it.

> [!WARN] This “probability” is not the real-world probability
> \(\N(d_2) = 54\%\) is the probability in an imagined world where the stock only earns the risk-free rate. If you believe XYZ's true expected return is 10%, the real-world chance of finishing above $100 is about 66%. Option prices use the former — because hedging removes \(\mu\) ([[risk-neutral]]). Reading \(\N(d_2)\) as “my odds of making money” is a common mistake.

### ④ Five inputs, one unknown

| Input | Raised | Call | Put | Kai's 1-year call: 9.93 becomes |
|---|---|---|---|---|
| Spot \(S\) | 100 → 110 | ↑ | ↓ | 16.97 |
| Strike \(K\) | higher K | ↓ | ↑ | — |
| Time \(T\) | longer | ↑ | usually ↑ | — |
| Volatility \(\sigma\) | 20% → 40% | ↑ | ↑ | 17.58 |
| Rate \(r\) | higher | ↑ | ↓ | — |
| Dividend yield \(q\) | 0 → 2% | ↓ | ↑ | 8.74 |

Of the five inputs (six with dividends — see [[price-drivers]]), four can be read off a screen. **Only σ has to be estimated.** That is why option traders say that trading options *is* trading volatility.

At-the-money options have a very handy approximation. Set \(r = q = 0\) and \(S = K\): then \(d_1 = \tfrac12\sigma\sqrt{T}\) and \(d_2 = -\tfrac12\sigma\sqrt{T}\), both \(\N\)s sit near 0.5, and a first-order expansion gives:

$$
C_{\text{ATM}} \approx \frac{1}{\sqrt{2\pi}}\,S\sigma\sqrt{T} \approx 0.4\,S\sigma\sqrt{T}
$$

> [!EXAMPLE] The 0.4 rule, in your head
> XYZ's 30-day at-the-money call: \(0.4 \times 100 \times 0.20 \times \sqrt{30/365} = 0.4 \times 100 \times 0.20 \times 0.287 \approx 2.29\). The exact Black-Scholes price with zero rates is 2.29; with a 4% rate it is 2.45 — the extra comes from the forward sitting above spot.
> The approximation tells you two things: an at-the-money price is **proportional to σ** (double σ and the price roughly doubles: 2.45 → 4.73) and **proportional to \(\sqrt{T}\)** (four times the time roughly doubles the price).

### ⑤ The PDE, hedging and the formula's place today

Black and Scholes did not originally reach the formula by taking an expectation; they got there by **hedging**. Hold one option and sell \(\Delta\) shares, so that the combination does not care about small moves in the stock over the next instant. That combination is riskless, so it can only earn the risk-free rate \(r\) — otherwise there would be an arbitrage. Written as an equation, that sentence is the Black-Scholes partial differential equation:

$$
\Theta + \tfrac12\sigma^2 S^2\,\Gamma + rS\,\Delta - rV = 0
$$

where \(\Delta = \partial V/\partial S\), \(\Gamma = \partial^2 V/\partial S^2\), \(\Theta = \partial V/\partial t\) (per year) and \(V\) is the option's value. It says: **the loss from time passing (\(\Theta\)) and the gain from convexity (\(\tfrac12\sigma^2S^2\Gamma\)) offset each other**, and what remains is exactly risk-free interest. For Kai's 1-year call: \(\Theta = -5.89\) dollars per year, \(\tfrac12\sigma^2S^2\Gamma = 3.81\), \(rS\Delta = 2.47\) and \(rV = 0.40\): \(-5.89 + 3.81 + 2.47 - 0.40 = -0.01 \approx 0\) (rounding). This “gamma and theta are two sides of one coin” returns again and again in [[theta]] and [[delta-hedging]].

> [!HISTORY] 1973
> Fischer Black and Myron Scholes published their paper in the *Journal of Political Economy* in 1973; the same year Robert Merton gave a more general derivation, and the Chicago Board Options Exchange (CBOE) opened. The 1997 Nobel Prize in economics went to Scholes and Merton; Black had died in 1995. Within a few years traders were quoting prices from the formula on hand-held calculators — the formula changed the market it described.

The formula assumes constant volatility, no jumps in the stock price, continuous costless hedging and a constant interest rate. Each assumption breaks in reality (next lesson, [[bs-assumptions]]); the clearest evidence is that options with the same expiry but different strikes need **different σs** to match market prices — the volatility smile ([[smile-skew]]).

> [!FACT] Is it still used in 2026?
> Yes, but its job has changed. Exchange option chains, broker platforms and market-maker systems routinely use Black-Scholes (or its American and futures versions) to translate prices into **implied volatility** for quoting and comparison, and use its Greeks to describe risk; for pricing complex products, desks use models that capture the smile, jumps or stochastic volatility ([[stochastic-vol]]). Black-Scholes became the lingua franca of options rather than the truth about them.

## @analogy
Imagine you've **reserved a limited-edition bicycle**: it arrives in a year, and you have the right — not the obligation — to buy it for a fixed $1,000.

In a year, if the bike's market price is above $1,000, you pay $1,000 and ride away; if it's below, you walk away. What is the reservation worth today?

- The **money you pay**: $1,000, but only in the cases where buying is worth it, and only a year from now — so today it counts as “$1,000 × the chance it's worth buying × discounting”.
- The **bike you receive**: again only when buying is worth it — and those are exactly the cases where the bike is expensive, so in those cases it is worth more than average.

The reservation's price = what the bike you receive is worth today − what the money you pay is worth today. That is precisely \(S\,\N(d_1) - Ke^{-rT}\N(d_2)\). The more the bike's price can swing, the better the “very valuable” cases become, while the “worthless” cases you simply walk away from — so more volatility makes the reservation more expensive.

The analogy misleads in one place: the “chance” here is not your own estimate of the real probability, but a risk-neutral probability implied by hedging. However optimistic you are about the bike, if the reservation can be replicated by “buy the bike + borrow money”, its price is pinned by the cost of that replication.

## @misconceptions
- **“\(\N(d_2)\) in the formula is the probability the option makes money.”** — It is the risk-neutral probability of finishing in the money. Real-world probabilities depend on the true expected return, and “in the money” is not “profitable” — you still have to earn back the premium.
- **“Black-Scholes needs you to predict whether the stock will rise or fall.”** — The expected return \(\mu\) doesn't appear anywhere in the formula. Hedging removes the directional risk; the price depends only on S, K, T, r, q and σ.
- **“\(\N(d_1)\) and \(\N(d_2)\) are about the same, so either will do.”** — They differ by one \(\sigma\sqrt{T}\): 0.62 vs 0.54 for a 1-year option at 20% volatility, and far more for a 2-year option at 60%. The first is delta, the second a probability — different jobs.
- **“Market option prices are computed with Black-Scholes.”** — Prices are set by buyers and sellers. Traders use the formula **in reverse**: they back out implied volatility from market prices and compare options by it ([[implied-vol]]).
- **“Since the assumptions fail, the formula is useless.”** — It remains everywhere as the language of quoting and of risk; the places where it fails (the smile, jumps) are exactly the places to look.

## @takeaways
- A call = conditionally receive the stock − conditionally pay the strike; \(C = S\,\N(d_1) - Ke^{-rT}\N(d_2)\) values each in today's money.
- \(\N(d_2)\) is the risk-neutral probability of finishing in the money; \(\N(d_1)\) is the call's delta and is always larger, by an amount set by \(\sigma\sqrt{T}\).
- \(d_2\) is a z-score: how many standard deviations the centre of the log price at expiry sits above \(\ln K\).
- Only σ is unobservable, so options are quoted in volatility; an at-the-money option is about \(0.4\,S\sigma\sqrt{T}\), proportional to σ and to \(\sqrt{T}\).
- The formula comes from a no-arbitrage hedge: the theta loss and the gamma gain offset, and the hedged position earns only the risk-free rate.

## @quiz
1. For Kai's 1-year, $100-strike call, \(\N(d_2) = 0.54\). Which statement is most accurate?
   - [ ] Kai has a 54% chance of making money on this trade
   - [x] In the risk-neutral world, XYZ has about a 54% chance of finishing above $100 in a year
   - [ ] Hedging one contract requires holding 54 XYZ shares
   - [ ] In the real world XYZ has a 54% chance of going up
   > \(\N(d_2)\) is the risk-neutral probability of finishing in the money. “Making money” also requires recovering the premium (the stock must finish above $109.93); the hedge is \(\N(d_1) \times 100 \approx 62\) shares; real-world probabilities depend on the true expected return.
2. XYZ's 30-day at-the-money call costs about $2.45 at σ = 20%. If implied volatility becomes 40% and nothing else changes, the price is closest to:
   - [ ] $2.45 — volatility doesn't affect at-the-money options
   - [ ] $3.47 — the price grows like \(\sqrt{\sigma}\)
   - [x] about $4.7 — an at-the-money price is roughly proportional to σ
   - [ ] $9.80 — the price grows like \(\sigma^2\)
   > The at-the-money approximation \(C \approx 0.4\,S\sigma\sqrt{T}\) is linear in σ, so doubling σ roughly doubles the price. The exact value is $4.73.
3. An option has \(S\,\N(d_1) = 61.79\) and \(Ke^{-rT}\N(d_2) = 51.87\). What is the call price?
   - [ ] $113.66
   - [ ] $51.87
   - [ ] $61.79
   - [x] about $9.92
   > Call = today's value of the stock received − today's value of the strike paid \(= 61.79 - 51.87 = 9.92\) (9.93 with full precision).
4. Why doesn't the stock's expected return \(\mu\) appear in the Black-Scholes formula?
   - [ ] Because Black and Scholes assumed investors don't care about risk
   - [ ] Because \(\mu\) can't be estimated, so it was left out
   - [ ] Because \(\mu\) equals the risk-free rate
   - [x] Because the option can be replicated continuously with stock and cash, and the replication cost doesn't depend on \(\mu\)
   > Pricing rests on a hedging argument: option + \(\Delta\) shares is riskless and can only earn \(r\). \(\mu\) cancels out in the hedge, so it never appears. This is not an assumption that investors are risk-neutral.
5. Kai's 1-year call costs $9.93, \(S = 100\) and \(Ke^{-rT} = 96.08\). By put-call parity, the put with the same strike is worth about:
   - [x] $6.00
   - [ ] $9.93
   - [ ] $13.85
   - [ ] $3.93
   > \(P = C - S + Ke^{-rT} = 9.93 - 100 + 96.08 = 6.01\); the exact value is 6.00 (one cent of rounding). 3.93 is \(C - P\) itself.

## @further
- [Black & Scholes (1973), The Pricing of Options and Corporate Liabilities](https://doi.org/10.1086/260062) — the original paper; the derivation starts from a hedged portfolio.
- [Merton (1973), Theory of Rational Option Pricing](https://doi.org/10.2307/3003143) — the same year's more general derivation, with dividends and weaker assumptions.
- [The 1997 Nobel Prize in economics — press release](https://www.nobelprize.org/prizes/economic-sciences/1997/press-release/) — the committee's plain-language explanation of the work.
- [Black–Scholes model (Wikipedia)](https://en.wikipedia.org/wiki/Black%E2%80%93Scholes_model) — the formula, derivations and Greeks in one place.

## @next
The formula is elegant, but it assumes volatility never changes, prices never gap and hedging is continuous. Where, and by how much, does reality break those assumptions? The next lesson tests them one by one.
