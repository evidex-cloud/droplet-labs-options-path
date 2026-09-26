---
id: exotic-options
prereqs: monte-carlo, black-scholes, risk-neutral-density, butterfly
demo: exotic-options
---

# Exotic Options: Barrier, Asian, Digital & Lookback

## @hook
A vanilla option only asks where the price *ends*. Exotic options also ask how it got there: did it ever touch 90, what was the average, what was the high? Change that one question and the same XYZ call can cost $1.73, $5.31, $9.93 or $18.71. This lesson shows why, and why the cheap versions are the hardest to hedge.

## @bridge
[[monte-carlo]] gave us a pricing engine that accepts *any* payoff, as long as we can simulate paths; [[finite-difference]] and [[american-exercise]] showed that a price can depend on decisions and boundaries along the way. Now we put those tools to work on the four classic path-dependent products: barriers, Asians, digitals and lookbacks. Along the way we use Idea ② (no-arbitrage: in–out parity, the digital as a tight call spread, averaging as a lower volatility) and Idea ③ (volatility: exotics are bets on the *shape* and *path* of volatility, not just its level).

## @intuition
Start with something Kai already knows. The 1-year XYZ 100 call costs **$9.93** ($993 per contract) with XYZ at $100, \(\sigma = 20\%\) and \(r = 4\%\) (the standard illustrative numbers).

> [!KAI] Kai gets a “discount” offer
> Kai likes the 1-year call but finds $993 steep. A dealer offers a variant: “Same strike, same expiry, **$8.20** — but the option dies the moment XYZ trades at $90 or below, even once.” Another offer: “The mirror version, which only comes alive if XYZ touches $90, costs **$1.73**.” Kai notices that \(8.20 + 1.73 = 9.93\). That is not a coincidence, and it is the first rule of exotics.

What changed is not the payoff formula at expiry. What changed is that **the payoff now depends on the path**. Picture two possible years for XYZ:

<figure>
<svg viewBox="0 0 660 260" role="img" aria-label="Two price paths, one touching the barrier at 90">
<defs><marker id="exotic-options-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="60" y1="225" x2="620" y2="225" class="fx-axis" marker-end="url(#exotic-options-ah)"/>
<line x1="60" y1="225" x2="60" y2="20" class="fx-axis"/>
<line x1="60" y1="150" x2="600" y2="150" class="fx-line-bad fx-dash"/>
<line x1="60" y1="120" x2="600" y2="120" class="fx-line-muted fx-dash"/>
<text x="604" y="154" class="fx-t-bad">H = 90</text>
<text x="604" y="124" class="fx-t-sm">K = 100</text>
<polyline points="60,120 74,120 88,123 102,122 116,123 130,129 144,132 158,133 173,132 181,140 189,145 198,141 206,140 215,146 223,147 232,148 240,152 251,150 263,151 274,149 285,150 296,143 308,143 319,134 330,129 347,125 364,118 381,113 398,110 414,106 431,106 448,106 465,96 482,89 499,84 516,92 533,86 549,84 566,81 583,76 600,75" class="fx-line-hl"/>
<polyline points="60,120 77,122 94,123 111,121 128,123 144,123 161,118 178,114 195,108 206,109 218,113 229,114 240,117 251,122 263,123 274,122 285,129 302,126 319,124 336,116 353,113 369,117 386,115 403,114 420,117 431,120 443,111 454,111 465,104 476,104 488,98 499,87 510,87 521,88 533,93 544,95 555,95 566,95 578,98 589,99 600,96" class="fx-line-blue"/>
<circle cx="240" cy="152" r="6" class="fx-fill-red"/>
<text x="250" y="178" class="fx-t-bad">path A touches 90 in month 4</text>
<text x="606" y="80" class="fx-t-hl">A: 115</text>
<text x="606" y="101" class="fx-t-blue">B: 108</text>
<text x="60" y="243" class="fx-t-sm">today</text>
<text x="600" y="243" text-anchor="end" class="fx-t-sm">1 year</text>
<text x="70" y="36" class="fx-t-sm">A: vanilla 15 · down-and-out 0 · down-and-in 15</text>
<text x="70" y="54" class="fx-t-sm">B: vanilla 8 · down-and-out 8 · down-and-in 0</text>
</svg>
<figcaption>Figure 1 · Two illustrative years for XYZ with a barrier at 90 and a strike of 100. Path A (blue) dips to 89.3 in month 4, so the down-and-out call dies and the down-and-in call is born, then ends at 115; path B (violet) never touches 90 and ends at 108. On every path, down-and-out + down-and-in pays exactly what the vanilla call pays — that is in–out parity.</figcaption>
</figure>

A vanilla call pays $15 on path A and $8 on path B. It does not care that path A spent a scary afternoon at $89. A **knock-out** option does care: path A killed it. That is why it is cheaper — it gives up every path that dips to the barrier and then recovers.

The four families differ only in which feature of the path they read:

| Family | What the payoff reads | Kai's XYZ example (1 year, K = 100) | Price vs vanilla $9.93 |
|---|---|---|---|
| Barrier (down-and-out, H = 90) | did the price ever touch 90? | dies at the first touch | $8.20 (cheaper) |
| Asian (average-price call) | the average price over the year | \(\max(\bar S - 100, 0)\) | about $5.52 (cheaper) |
| Digital (cash-or-nothing) | only whether \(S_T > K\) | pays a fixed $100 if above 100 | $51.87 per $100 payout |
| Lookback (fixed strike) | the highest price reached | \(\max(S_{\max} - 100, 0)\) | $18.71 (much dearer) |

> [!THINK] A down-and-out call with the barrier at $70 costs $9.92 — one cent less than the vanilla. With the barrier at $95 it costs $5.30. Why such a big difference for a $25 move of the barrier?
> Think about how likely each barrier is to be touched in a year when a one-standard-deviation move is about $20.
> ---
> At $95 the barrier is only a quarter of a standard deviation away; most paths touch it at some point, and many of them would have finished in the money. At $70 the price must fall 30% before the option dies, and a path that falls that far rarely climbs back above $100 anyway — so the knock-out removes almost no value. **A barrier is cheap to add only where it removes paths you were not going to be paid on.**

None of these payoffs needs a new theory. They are all “expected discounted payoff under the risk-neutral measure” ([[risk-neutral]]), which is exactly what the Monte Carlo engine computes if you swap in a new payoff function. What is new is the **risk**: some of these products have Greeks that explode near a barrier or near expiry. We'll take it in six parts:

- **① Barriers**: knock-in, knock-out, in–out parity, monitoring
- **② Digitals**: a probability with a price tag, and why it is a tight call spread
- **③ Asians**: averaging lowers volatility
- **④ Lookbacks**: paying for hindsight
- **⑤ Hedging exotics**: barrier gamma and pin risk
- **⑥ Where exotics live in 2026**

## @mechanics
### ① Barriers: knock-in, knock-out and in–out parity

A barrier option is a vanilla option plus a level \(H\) and a rule. **Knock-out**: the option dies the first time the price touches \(H\). **Knock-in**: it only comes alive when the price touches \(H\). “Down” or “up” says whether \(H\) sits below or above today's price. So there are eight standard types (down/up × in/out × call/put).

For any path, exactly one of the pair “knock-in” and “knock-out” survives, and the survivor pays the vanilla payoff. Add them and the barrier disappears:

$$
C_{\text{down-in}}(H) + C_{\text{down-out}}(H) = C_{\text{vanilla}}
$$

where both barrier options have the same strike, expiry and barrier \(H\), and no rebate (some contracts pay a small cash “rebate” when knocked out; ignore it here). This is Idea ② in its purest form: two portfolios with identical payoffs on every path must cost the same.

> [!EXAMPLE] Kai's barrier menu (1-year 100 call, S = 100, σ = 20%, r = 4%, continuous monitoring)
> | Barrier \(H\) | Down-and-out | Down-and-in \(= 9.93 - \text{out}\) |
> |---|---|---|
> | 95 | $5.30 | $4.62 |
> | 90 | $8.20 | $1.73 |
> | 85 | $9.44 | $0.49 |
> | 80 | $9.83 | $0.10 |
> | 70 | $9.92 | $0.00 |
>
> Check at \(H = 90\): \(8.20 + 1.73 = 9.93\). Priced with the engine's closed form (Merton / Reiner–Rubinstein), and confirmed by Monte Carlo in the demo below.

The closed form rests on a symmetry of Brownian motion called the **reflection principle**: every path that touches the barrier and ends at \(x\) can be mirrored after the touch into a path that ends at the mirror image of \(x\). That is why barrier formulas contain factors like \((H/S)^{2\lambda}\) — the weight of the mirrored world.

**Monitoring matters.** The formula assumes the barrier is watched continuously. Real contracts usually check a daily close (or a weekly or monthly fixing). Fewer checks mean fewer knock-outs, so a discretely monitored down-and-out is worth *more*:

| Monitoring of \(H = 90\) | Down-and-out value |
|---|---|
| monthly (12 checks) | about $9.04 |
| weekly (52) | about $8.66 |
| daily (252) | about $8.44 |
| continuous | $8.20 |

> [!DEEP] The continuity correction
> Broadie, Glasserman and Kou (1997) showed that a discretely monitored barrier behaves almost exactly like a continuous barrier shifted *away* from spot by \(e^{0.5826\,\sigma\sqrt{\Delta t}}\), where \(\Delta t\) is the time between checks and 0.5826 comes from the Riemann zeta function. Daily checks at \(\sigma = 20\%\): \(90 \times e^{-0.5826 \times 0.2 \times \sqrt{1/252}} = 89.34\), and the continuous formula at 89.34 gives $8.43 — within a cent of the daily value in the table (which comes from a large simulation). Monte Carlo with 252 steps agrees to within its standard error ([[monte-carlo]]).

The mirror product sits inside many retail notes. A 1-year **reverse convertible** on XYZ pays a fat coupon, but at maturity the investor receives shares instead of cash if XYZ has ever touched, say, $70 and ends below $100. The investor has **sold a down-and-in put** (\(K = 100\), \(H = 70\)). It is worth $1.74 today (the vanilla 100 put is $6.00); invested at 4% for a year that is \(1.74 \times e^{0.04} \approx \$1.81\) of extra coupon per $100, before the issuer's margin. The coupon is not free money — it is the price of a crash insurance the investor has written.

### ② Digitals: a probability with a price tag

A cash-or-nothing digital call pays a fixed amount (say $1) if \(S_T > K\) and nothing otherwise. Its value is the discounted risk-neutral probability of finishing in the money — the \(\N(d_2)\) you met in [[black-scholes]]:

$$
D_{\text{call}} = e^{-rT}\,\N(d_2), \qquad d_2 = \frac{\ln(S/K) + (r - \tfrac12\sigma^2)T}{\sigma\sqrt{T}}
$$

where \(e^{-rT}\) discounts the fixed payment and \(\N(d_2)\) is the risk-neutral probability that \(S_T > K\).

A worked number: a $100 bet that XYZ is above $105 in 30 days. Here \(\N(d_2) = 0.2055\) (the risk-neutral chance of finishing above 105) and \(e^{-0.04 \times 30/365} = 0.9967\), so one unit is worth \(0.9967 \times 0.2055 = 0.2048\), and the $100 payout costs \(0.2048 \times 100 = \$20.48\).

There is no listed “digital” on XYZ, but you can build one from vanillas. Buy the 104.5 call and sell the 105.5 call, and hold one such spread per $1 of payout: the payoff climbs from 0 to $1 between the two strikes — a ramp that approximates the step.

$$
D_{\text{call}}(K) \approx \frac{C(K - \varepsilon) - C(K + \varepsilon)}{2\varepsilon} \;\xrightarrow{\;\varepsilon \to 0\;}\; -\frac{\partial C}{\partial K}
$$

where \(\varepsilon\) is half the distance between the two strikes. With XYZ: width $5 → 0.2118; width $1 → 0.2051; width $0.20 → 0.2048. The limit is exactly the digital. This is the same “calls as bricks” idea as the [[butterfly]]: a call spread is a step, a butterfly is a spike, and the second strike-derivative of calls is the risk-neutral density ([[risk-neutral-density]]).

<figure>
<svg viewBox="0 0 660 230" role="img" aria-label="Digital payoff step versus call-spread ramps">
<line x1="50" y1="180" x2="620" y2="180" class="fx-axis"/>
<line x1="50" y1="190" x2="50" y2="30" class="fx-axis"/>
<polyline points="50,180 330,180 330,60 600,60" class="fx-line-thick"/>
<polyline points="50,180 316,180 344,60 600,60" class="fx-line-hl"/>
<polyline points="50,180 263,180 398,60 600,60" class="fx-line-blue fx-dash"/>
<line x1="330" y1="180" x2="330" y2="195" class="fx-line"/>
<text x="330" y="210" text-anchor="middle" class="fx-t-b">K = 105</text>
<text x="263" y="210" text-anchor="middle" class="fx-t-sm">102.5</text>
<text x="398" y="210" text-anchor="middle" class="fx-t-sm">107.5</text>
<text x="44" y="64" text-anchor="end" class="fx-t-sm">$1</text>
<text x="44" y="184" text-anchor="end" class="fx-t-sm">0</text>
<text x="420" y="50" class="fx-t-b">digital: a step (value 0.2048)</text>
<text x="420" y="92" class="fx-t-hl">104.5/105.5 spread ×1: 0.2051</text>
<text x="420" y="112" class="fx-t-blue">102.5/107.5 spread ×0.2: 0.2118</text>
<text x="600" y="225" text-anchor="end" class="fx-t-sm">XYZ at expiry (30 days)</text>
</svg>
<figcaption>Figure 2 · A digital pays a step; a call spread pays a ramp. The narrower the spread (and the more of them you hold, \(1/(2\varepsilon)\) per $1 of payout), the closer the ramp gets to the step — and the more violent its Greeks become near the strike.</figcaption>
</figure>

::demo[exotic-options-digital]

The derivative form tells an expert something important: in a market with a smile, \(C\) depends on \(K\) also through \(\sigma(K)\). Then

$$
D_{\text{call}} = -\frac{\partial C}{\partial K} = e^{-rT}\,\N(d_2) \;-\; \nu\,\frac{\partial \sigma}{\partial K}
$$

where \(\nu\) is the call's vega per 1.00 of volatility and \(\partial\sigma/\partial K\) is the slope of the smile at \(K\).

> [!EXAMPLE] The skew makes the digital dearer
> The 30-day 105 call has vega 0.085 per vol point, i.e. 8.5 per 1.00 of σ. Suppose implied vol falls 0.3 points per $1 of strike near 105 (\(\partial\sigma/\partial K = -0.003\)), a typical equity-style skew. The correction is \(-8.5 \times (-0.003) = +0.0255\), so the digital is worth \(0.2048 + 0.0255 = 0.2303\): $23.03 per $100 instead of $20.48. **Pricing a digital with a flat-vol formula misprices it by more than 10%.** Exotics are where the smile ([[smile-skew]]) stops being a curiosity and becomes money.

### ③ Asians: averaging lowers volatility

An average-price (Asian) call pays \(\max(\bar S - K, 0)\), where \(\bar S\) is the average of the prices at fixed dates (daily closes, say). The average of a wandering path wanders less than its endpoint: early prices have had little time to move, and they drag the average toward today's price. For a continuous geometric average under Black-Scholes this is exact: the log of the average is normal with volatility

$$
\sigma_{G} = \frac{\sigma}{\sqrt{3}}, \qquad b_{G} = \tfrac12\left(r - q - \tfrac{\sigma^2}{6}\right)
$$

where \(\sigma_G\) is the volatility of the geometric average over the whole period and \(b_G\) is its drift (the “carry” of the average). Plug both into Black-Scholes and you have the Kemna–Vorst closed form.

For Kai's 1-year Asian call, \(\sigma_G = 0.20/\sqrt{3} = 0.1155\): the average behaves like a stock with 11.5% volatility instead of 20%, and the geometric-average call is worth **$5.31**. The arithmetic average (what contracts actually use) is always at least the geometric one; with daily fixings, Monte Carlo gives about **$5.52**. Either way, a little over half the vanilla's $9.93.

The arithmetic average has no closed form, which makes it the textbook case for a **control variate** ([[monte-carlo]]): simulate both averages on the same paths, and correct the arithmetic estimate by how far the simulated geometric price missed its known exact value. On 20,000 paths the two payoffs are 0.9996 correlated, and the standard error drops from about $0.057 to about $0.0015 — the accuracy of roughly 30 million plain paths.

Why do firms like Asians? An airline buys fuel every day, so its exposure *is* an average; hedging the average matches the cash flow. And an average over many fixings is much harder to push around than a single closing price on expiry day. Averaging options are common in commodities and FX for both reasons.

### ④ Lookbacks: paying for hindsight

A fixed-strike lookback call pays \(\max(S_{\max} - K, 0)\): you sell at the highest price of the whole year, chosen after the fact. A floating-strike lookback call pays \(S_T - S_{\min}\): you buy at the lowest price. Since \(S_{\max} \ge S_T\) on every path, the lookback always pays at least the vanilla.

For Kai's XYZ (1 year, \(K = 100\), continuous monitoring) the fixed-strike lookback is worth **$18.71**, about 1.9 times the vanilla's $9.93; the floating-strike version is worth $16.75. The closed forms exist (Goldman–Sosin–Gatto for floating strikes, Conze–Viswanathan for fixed strikes) and use the same reflection trick as barriers.

Two expert remarks. First, monitoring again: a daily-monitored maximum is below the continuous one, so daily lookbacks are cheaper (the demo shows the gap). Second, a lookback is nearly pure **long volatility along the path**: its value comes from the range the price covers, which is why lookbacks are rarely sold on their own — few buyers want to pay double for hindsight — but appear as ingredients (for example “best-of” entry levels in notes).

### ⑤ Hedging exotics: barrier gamma and pin risk

A price is only half of an option; the dealer who sells it has to hedge it ([[delta-hedging]]). Here the cheap exotics are the dangerous ones.

Consider an **up-and-out call**: \(K = 100\), barrier 120, three months. Between 100 and 120 it behaves like a call — until the price reaches 120, where it drops from about $20 of intrinsic value to zero. Because the knock-out is near the money for the holder, this is called a *reverse* barrier, and it has the worst Greeks of all.

<figure>
<svg viewBox="0 0 660 290" role="img" aria-label="Up-and-out call: payoff with a cliff and today's value">
<line x1="50" y1="250" x2="630" y2="250" class="fx-axis"/>
<line x1="50" y1="260" x2="50" y2="20" class="fx-axis"/>
<polyline points="60,249 87,249 114,248 141,246 168,244 195,241 222,236 249,230 276,222 303,212 330,201 357,188 384,173 411,157 438,139 465,120 492,101 519,81 546,60 573,39 600,18" class="fx-line-muted fx-dash"/>
<polyline points="60,250 330,250 600,30" class="fx-line-thick"/>
<line x1="600" y1="30" x2="600" y2="250" class="fx-line-bad"/>
<polygon points="60,250 87,249 114,248 141,247 168,245 195,242 222,238 249,233 276,228 303,223 330,217 357,213 384,209 411,208 438,208 465,211 492,216 519,223 546,231 573,240 600,250" class="fx-area-hl"/>
<polyline points="60,249 87,249 114,248 141,247 168,245 195,242 222,238 249,233 276,228 303,223 330,217 357,213 384,209 411,208 438,208 465,211 492,216 519,223 546,231 573,240 600,250" class="fx-line-hl"/>
<circle cx="303" cy="223" r="4" class="fx-fill-green"/>
<circle cx="573" cy="240" r="4" class="fx-fill-red"/>
<text x="60" y="270" text-anchor="middle" class="fx-t-sm">80</text>
<text x="195" y="270" text-anchor="middle" class="fx-t-sm">90</text>
<text x="330" y="270" text-anchor="middle" class="fx-t-b">K = 100</text>
<text x="465" y="270" text-anchor="middle" class="fx-t-sm">110</text>
<text x="600" y="270" text-anchor="middle" class="fx-t-bad">H = 120</text>
<text x="70" y="40" class="fx-t-hl">solid blue: up-and-out value today (3 months)</text>
<text x="70" y="58" class="fx-t-sm">dashed: vanilla call value today · black: payoff at expiry</text>
<text x="475" y="160" class="fx-t">expiry: $20 → 0</text>
<text x="608" y="120" class="fx-t-bad">cliff</text>
<text x="424" y="234" text-anchor="middle" class="fx-t-hl">peak $3.87</text>
<text x="150" y="215" class="fx-t-ok">Δ = +0.25 at 98</text>
<text x="470" y="190" class="fx-t-bad">Δ = −0.44 at 118</text>
</svg>
<figcaption>Figure 3 · Up-and-out call (K = 100, H = 120, 3 months, σ = 20%, r = 4%). Its payoff has a $20 cliff at the barrier, so today's value is a hump worth at most $3.87 (the vanilla is worth $4.49 at S = 100). Delta changes sign on the way up: the option behaves like +0.25 shares at 98 and like −0.44 shares at 118.</figcaption>
</figure>

Now run the clock. With one day left and XYZ at $119, the up-and-out is worth $10.49 and its delta is **−8.3**: to hedge one 100-share contract the dealer must be short about 830 shares, and a $1 rise wipes out the option entirely. The digital has the same disease at its strike: at \(S = K = 105\) the hedge for a $100 payout is 6.6 shares with 30 days left, 13.7 with 7 days, and 36.3 with one day. That is **pin risk**: a hedge size that swings wildly on tiny moves, exactly where the price tends to sit.

Desks manage this with three tools. **Barrier shifts**: price and hedge the product as if the barrier were a bit further away, which builds in a cushion (the same idea as pricing the digital as a finite call spread rather than a true step). **Static hedges**: approximate the exotic with a portfolio of vanilla options that needs little rebalancing. **Model choice**: the value of a barrier depends on how the whole smile moves as spot moves, which Black-Scholes cannot describe — that is the job of the next lesson, [[stochastic-vol]].

> [!WARN] “Cheaper” means you gave something up
> Every discount in this lesson is a sold scenario: the down-and-out buyer gives up the dip-and-recover paths; the reverse-convertible buyer writes crash insurance; the digital buyer gives up “how much”. Before buying a structured product, write down which paths you have sold and what they are worth. The risks of these products are real and they can lose most of their value; this is education, not advice.

### ⑥ Where exotics live in 2026

- **Structured notes.** Autocallables and reverse convertibles combine digital-style coupons with knock-in puts; principal-protected notes combine a bond with a call or Asian call. The investor is usually short volatility and short a crash scenario; the issuing dealer holds the other side and hedges it in the listed and OTC options markets (compare the option-income products in [[retail-flows]]).
- **FX and commodities.** Barriers and digitals are everyday OTC products in currencies; averaging options are standard in commodities, where exposures are averages.
- **Listed binaries.**

> [!FACT] Binaries come to a US options exchange
> As of June 23, 2026, Cboe launched “Cboe Predicts”: yes/no **binary options on XSP** (the mini S&P 500 index), first offered through Interactive Brokers. A listed binary is the cash-or-nothing digital of section ②: its fair value is a discounted risk-neutral probability.

- **Pricing practice.** Closed forms (like the ones in this lesson) are used for sanity checks and fast Greeks; production pricing of path-dependent books uses Monte Carlo or PDE grids under a model that fits the smile ([[stochastic-vol]], [[surface-calibration]]), and learned hedging policies are an active research area ([[deep-hedging]]).

## @analogy
Think of four kinds of **travel insurance** for the same one-year trip.

The vanilla policy pays according to how things stand when you come home. The **barrier** policy is cheaper because of a clause: “void if you ever visit a country on this list” (knock-out) — or the reverse, a policy that only switches on if you do (knock-in). Hold both and you are back to the plain policy. The **Asian** policy pays on your average daily expenses over the trip, not on the last day's bill; averages are tamer than single days, so the premium is lower. The **digital** policy pays a fixed $10,000 if a named event happens, however bad it is — it prices only the probability. The **lookback** policy lets you pick, after the trip, the single worst day to claim on; hindsight is valuable, so it costs about twice as much.

Now look at it from the insurer's side. The plain policy's risk changes smoothly. The “void if you visit” policy is a nightmare the day before you board a plane to a listed country: its value might vanish in one step, and the insurer's hedge must swing with it. That is barrier gamma.

Where the analogy breaks: travel insurance is priced from real-world frequencies of mishaps; options are priced from the cost of hedging, under risk-neutral probabilities, and the hedge is exactly what becomes hard near a barrier or a digital's strike.

## @misconceptions
- **“Exotic means expensive.”** — Barriers and Asians are usually *cheaper* than the vanilla (Kai's down-and-out $8.20, Asian about $5.52, vs $9.93). Only features that add hindsight or optionality, like lookbacks ($18.71), cost more.
- **“A knock-out with a far-away barrier is a free discount.”** — It is cheap because it removes paths that rarely pay, so it saves almost nothing ($9.92 vs $9.93 at \(H = 70\)). A discount that matters removes paths that matter.
- **“A digital is priced with \(\N(d_2)\), so any Black-Scholes calculator will do.”** — With a skew, the digital equals \(-\partial C/\partial K\), which includes the smile's slope; ignoring it misprices a 30-day digital by more than 10% in the example.
- **“The barrier formula prices my contract.”** — Only if the barrier is watched continuously. A daily-monitored down-and-out at 90 is worth about $8.44, not $8.20; use the continuity correction or simulate the actual fixing schedule.
- **“The fat coupon on a reverse convertible is the bank being generous.”** — The coupon is mostly the premium of a down-and-in put the investor has sold; in a crash the investor receives the shares at the strike.

## @takeaways
- Path-dependent payoffs need no new theory: price = discounted risk-neutral expected payoff, so Monte Carlo with the right payoff function prices any of them.
- In–out parity: knock-in + knock-out = vanilla. Barriers are cheap where they remove paths that pay.
- A digital is \(e^{-rT}\N(d_2)\) under flat vol, and a tight call spread in practice; with a skew it equals \(-\partial C/\partial K\) including the smile slope.
- Averaging lowers volatility (\(\sigma/\sqrt3\) for a continuous geometric average), so Asians are cheap; lookbacks buy hindsight and cost about twice the vanilla.
- The cheap exotics carry the ugliest hedges: delta sign flips and exploding gamma near barriers and digital strikes, which is why model choice and barrier shifts matter.

## @quiz
1. A down-and-out call (\(K = 100\), \(H = 90\)) on XYZ costs $8.20 and the vanilla call costs $9.93. What must the down-and-in call with the same terms cost if there is no rebate?
   - [ ] $9.93, because it becomes a vanilla call once knocked in
   - [ ] $8.20, because in and out options are mirror images
   - [x] $1.73, because in + out = vanilla on every path
   - [ ] $18.13, because the two premiums add up
   > On any path exactly one of the pair survives and pays the vanilla payoff, so their prices must add up to $9.93 (Idea ②). Knocking in does make it a vanilla, but only on the paths that touch 90, which is why it is cheap.
2. A down-and-out barrier is monitored only at daily closes rather than continuously. Compared with the continuous-monitoring formula price, the contract is worth:
   - [ ] less, because more checks mean more chances to knock out
   - [x] more, because an intraday touch that recovers by the close does not count
   - [ ] the same, because the barrier level is the same
   - [ ] zero, because discrete barriers cannot be priced
   > Fewer checks, fewer knock-outs, higher value: about $8.44 daily vs $8.20 continuous for Kai's example. The Broadie–Glasserman–Kou correction prices it as a continuous barrier shifted away from spot.
3. Near expiry, why is a digital call much harder to hedge than a vanilla call with the same strike?
   - [ ] Because it has no delta
   - [ ] Because its price does not depend on volatility
   - [ ] Because it can only be hedged with futures
   - [x] Because its payoff is a step, so its delta at the strike grows without bound as expiry approaches
   > A step payoff has an infinite slope at K. With one day left, the hedge for a $100 XYZ digital at the strike is about 36 shares and swings to near zero a few dollars away — that is pin risk. The vanilla's delta stays between 0 and 1.
4. Why is a 1-year Asian call on XYZ worth roughly half the vanilla call?
   - [x] The average of the path is less volatile than the final price, so the option is effectively priced at a lower volatility
   - [ ] Because the average price is always below the final price
   - [ ] Because Asian options are not discounted
   - [ ] Because averaging removes the risk-free drift completely
   > For a continuous geometric average the volatility is \(\sigma/\sqrt3\): 11.5% instead of 20%. Lower volatility, lower option value. The average is not always below the final price — on a falling path it is above it.
5. A dealer prices a 30-day digital on XYZ with the flat-vol formula and gets $20.48 per $100 payout. The market has a normal equity skew (implied vol falling as strike rises). The fair price is:
   - [ ] lower, because skew reduces all option prices
   - [ ] the same, because digitals depend only on probability
   - [x] higher, because the digital equals \(-\partial C/\partial K\), and a falling smile adds \(-\nu\,\partial\sigma/\partial K > 0\)
   - [ ] impossible to say without knowing the real-world probability
   > With \(\partial\sigma/\partial K = -0.003\) and vega 8.5 per unit of σ the correction is +0.0255, so about $23.03. Real-world probabilities never enter; the correction comes from the cost of the replicating call spread.

## @further
- [Barrier option (Wikipedia)](https://en.wikipedia.org/wiki/Barrier_option) — the eight types, rebates, and the standard closed forms.
- [Asian option (Wikipedia)](https://en.wikipedia.org/wiki/Asian_option) — arithmetic vs geometric averages and the Kemna–Vorst formula.
- [Lookback option (Wikipedia)](https://en.wikipedia.org/wiki/Lookback_option) — fixed and floating strikes with their closed forms.
- [Binary option (Wikipedia)](https://en.wikipedia.org/wiki/Binary_option) — cash-or-nothing and asset-or-nothing digitals, and the call-spread replication.
- [Cboe Predicts launch (Cboe, June 2026)](https://ir.cboe.com/news/news-details/2026/Cboe-Introduces-Cboe-Predicts-Launching-First-Products-in-New-Prediction-Markets-Suite/default.aspx) — listed binary options on XSP.

## @next
Every exotic in this lesson was priced with a single, constant σ — yet we just saw that a digital's price depends on the smile's slope, and a barrier's hedge depends on how the smile moves when spot moves. Which models can describe a whole moving smile? The next lesson meets Dupire, Heston, SABR, jumps and rough volatility.
