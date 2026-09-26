---
id: delta-hedging
prereqs: binomial-one-step, black-scholes, gamma, theta, position-sizing
demo: delta-hedging
---

# Delta Hedging & Gamma Scalping

## @hook
A market maker sells you a call but has no wish to bet on XYZ. Once delta is hedged away, what remains is a pure bet on volatility: if the stock actually shakes more than implied volatility said, the option buyer wins; if it shakes less, the seller wins. This lesson does the accounting: hedged P&L \(\approx \tfrac12\Gamma S^2(\RV^2 - \IV^2)\,\dd t\).

## @bridge
In [[binomial-one-step]] an option was replicated with “Δ shares plus borrowing”; the [[black-scholes]] PDE said a hedged position earns only the risk-free rate; [[gamma]] and [[theta]] showed that gamma's gain and theta's cost are two sides of one coin. The previous lesson, [[position-sizing]], was about *how much* to bet; this one is about *what* you are betting on once you actually run the hedge and look at the risk that is left. It builds Idea ② (no-arbitrage: replication), Idea ③ (volatility: implied is the quote, realized is the bill) and Idea ④ (risk: who holds it and how it is hedged).

## @intuition
Start with an experiment Kai runs.

Kai pays $245 for one XYZ 30-day call with a $100 strike (implied volatility 20%). Its delta is 0.534: for every $1 XYZ rises, the option gains about 53 cents. One contract carries the directional risk of about 53 shares.

Kai doesn't want a directional bet, so Kai **sells short 53 shares of XYZ**. The combined delta is now about zero: small moves up or down make the option gain roughly what the shares lose. This is **delta hedging**, and the result is **delta-neutral**.

What risk is left? Watch what happens as the stock moves by $1.50:

- XYZ rises to 101.5: the option's delta climbs from 0.534 to 0.636 — the option has become “more like stock”. To be neutral again, Kai **sells 11 more shares** (selling high).
- XYZ comes back to 100: delta returns to 0.533, and Kai **buys back 11 shares** (buying low).
- XYZ drops to 98.5: delta falls to 0.422, so Kai **buys 11 shares** (buying low); back at 100, Kai **sells 11** (selling high).

Every rebalance is **sell high, buy low**. Not because Kai is a good forecaster: gamma — the rate at which delta changes with the stock — forces the long-option side to trade this way. The practice is called **gamma scalping**.

<figure>
<svg viewBox="0 0 640 270" role="img" aria-label="Gamma scalping: hedge trades as the stock swings">
<line x1="60" y1="120" x2="610" y2="120" class="fx-line-muted fx-dash"/>
<text x="606" y="113" text-anchor="end" class="fx-t-sm">K = 100</text>
<polyline points="80,120 180,60 280,120 380,180 480,120 580,60" class="fx-line-thick"/>
<circle cx="80" cy="120" r="6" class="fx-fill-muted"/>
<circle cx="180" cy="60" r="6" class="fx-fill-red"/>
<circle cx="280" cy="120" r="6" class="fx-fill-green"/>
<circle cx="380" cy="180" r="6" class="fx-fill-green"/>
<circle cx="480" cy="120" r="6" class="fx-fill-red"/>
<circle cx="580" cy="60" r="6" class="fx-fill-red"/>
<text x="80" y="145" text-anchor="middle" class="fx-t-sm">short 53 sh</text>
<text x="180" y="40" text-anchor="middle" class="fx-t-bad">sell 11 @101.5</text>
<text x="272" y="143" text-anchor="end" class="fx-t-ok">buy 11 @100</text>
<text x="380" y="205" text-anchor="middle" class="fx-t-ok">buy 11 @98.5</text>
<text x="472" y="108" text-anchor="end" class="fx-t-bad">sell 11 @100</text>
<text x="580" y="40" text-anchor="middle" class="fx-t-bad">sell 11 @101.5</text>
<text x="80" y="232" text-anchor="middle" class="fx-t-sm">Δ 0.534</text>
<text x="180" y="232" text-anchor="middle" class="fx-t-sm">Δ 0.636</text>
<text x="280" y="232" text-anchor="middle" class="fx-t-sm">Δ 0.533</text>
<text x="380" y="232" text-anchor="middle" class="fx-t-sm">Δ 0.422</text>
<text x="480" y="232" text-anchor="middle" class="fx-t-sm">Δ 0.532</text>
<text x="580" y="232" text-anchor="middle" class="fx-t-sm">Δ 0.642</text>
<text x="80" y="252" text-anchor="middle" class="fx-t-sm">day 0</text>
<text x="180" y="252" text-anchor="middle" class="fx-t-sm">day 1</text>
<text x="280" y="252" text-anchor="middle" class="fx-t-sm">day 2</text>
<text x="380" y="252" text-anchor="middle" class="fx-t-sm">day 3</text>
<text x="480" y="252" text-anchor="middle" class="fx-t-sm">day 4</text>
<text x="580" y="252" text-anchor="middle" class="fx-t-sm">day 5</text>
<text x="40" y="64" text-anchor="end" class="fx-t-sm">101.5</text>
<text x="40" y="124" text-anchor="end" class="fx-t-sm">100</text>
<text x="40" y="184" text-anchor="end" class="fx-t-sm">98.5</text>
</svg>
<figcaption>Figure 1 · Kai's gamma scalping (XYZ 30-day 100 call, implied vol 20%, re-hedged at each close, share counts rounded). As the stock swings around the strike, the hedge trades automatically sell high and buy low. After five days the option is up about $65 (net of five days of time decay) and the stock hedge is down about $47, a net gain of about $19.</figcaption>
</figure>

But the option also loses value every day: its theta is −$0.044 per day, about −$4.40 per contract. So the hedged position is a tug-of-war:

- **Gamma's side**: every move, in either direction, earns \(\tfrac12\Gamma(\Delta S)^2\);
- **Theta's side**: every day that passes costs a fixed “rent”.

Who wins depends on how much the stock **actually** shakes. The $245 Kai paid already “prepaid” a certain amount of shaking at 20% implied volatility — about $1.05 a day. Shake more and gamma wins; shake less and theta wins.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="One day's gamma gain versus the theta bill">
<polygon points="50,171.8 50.0,40.3 59.0,50.1 68.0,59.6 77.0,68.7 86.0,77.5 95.0,86.0 104.0,94.2 113.0,102.0 122.0,109.5 131.0,116.6 140.0,123.5 149.0,129.9 158.0,136.1 167.0,141.9 176.0,147.4 185.0,152.6 194.0,157.4 203.0,161.9 212.0,166.0 221.0,169.9 225.8,171.8" class="fx-area-ok"/>
<polygon points="225.8,171.8 230.0,173.4 239.0,176.5 248.0,179.4 257.0,181.8 266.0,184.0 275.0,185.8 284.0,187.3 293.0,188.5 302.0,189.3 311.0,189.8 320.0,190.0 329.0,189.8 338.0,189.3 347.0,188.5 356.0,187.3 365.0,185.8 374.0,184.0 383.0,181.8 392.0,179.4 401.0,176.5 410.0,173.4 414.2,171.8" class="fx-area-bad"/>
<polygon points="414.2,171.8 419.0,169.9 428.0,166.0 437.0,161.9 446.0,157.4 455.0,152.6 464.0,147.4 473.0,141.9 482.0,136.1 491.0,129.9 500.0,123.5 509.0,116.6 518.0,109.5 527.0,102.0 536.0,94.2 545.0,86.0 554.0,77.5 563.0,68.7 572.0,59.6 581.0,50.1 590.0,40.3 590,171.8" class="fx-area-ok"/>
<line x1="40" y1="190" x2="605" y2="190" class="fx-axis"/>
<polyline points="50.0,40.3 59.0,50.1 68.0,59.6 77.0,68.7 86.0,77.5 95.0,86.0 104.0,94.2 113.0,102.0 122.0,109.5 131.0,116.6 140.0,123.5 149.0,129.9 158.0,136.1 167.0,141.9 176.0,147.4 185.0,152.6 194.0,157.4 203.0,161.9 212.0,166.0 221.0,169.9 230.0,173.4 239.0,176.5 248.0,179.4 257.0,181.8 266.0,184.0 275.0,185.8 284.0,187.3 293.0,188.5 302.0,189.3 311.0,189.8 320.0,190.0 329.0,189.8 338.0,189.3 347.0,188.5 356.0,187.3 365.0,185.8 374.0,184.0 383.0,181.8 392.0,179.4 401.0,176.5 410.0,173.4 419.0,169.9 428.0,166.0 437.0,161.9 446.0,157.4 455.0,152.6 464.0,147.4 473.0,141.9 482.0,136.1 491.0,129.9 500.0,123.5 509.0,116.6 518.0,109.5 527.0,102.0 536.0,94.2 545.0,86.0 554.0,77.5 563.0,68.7 572.0,59.6 581.0,50.1 590.0,40.3" class="fx-line-thick"/>
<line x1="40" y1="171.8" x2="605" y2="171.8" class="fx-line-bad fx-dash"/>
<line x1="225.8" y1="171.8" x2="225.8" y2="200" class="fx-line-muted"/>
<line x1="414.2" y1="171.8" x2="414.2" y2="200" class="fx-line-muted"/>
<text x="320" y="160" text-anchor="middle" class="fx-t-bad">daily bill ½σ²S²Γ ≈ $3.80</text>
<text x="320" y="60" text-anchor="middle" class="fx-t">gamma gain ½Γ(ΔS)² × 100</text>
<text x="120" y="160" text-anchor="middle" class="fx-t-ok">big move: win</text>
<text x="520" y="160" text-anchor="middle" class="fx-t-ok">big move: win</text>
<text x="320" y="214" text-anchor="middle" class="fx-t-bad">small move: lose</text>
<text x="226" y="214" text-anchor="middle" class="fx-t-sm">−1.05</text>
<text x="414" y="214" text-anchor="middle" class="fx-t-sm">+1.05</text>
<text x="50" y="206" text-anchor="middle" class="fx-t-sm">−3</text>
<text x="140" y="206" text-anchor="middle" class="fx-t-sm">−2</text>
<text x="500" y="206" text-anchor="middle" class="fx-t-sm">+2</text>
<text x="590" y="206" text-anchor="middle" class="fx-t-sm">+3</text>
<text x="600" y="238" text-anchor="end" class="fx-t-sm">the day's stock move ΔS ($)</text>
<text x="598" y="44" class="fx-t-sm">$31</text>
</svg>
<figcaption>Figure 2 · One day's P&L of a long, hedged call (per contract). The parabola is the gamma gain \(\tfrac12\Gamma(\Delta S)^2\); the dashed line is the fixed daily time bill. They cross at \(\Delta S = \pm \$1.05\) — exactly the one-day standard deviation implied by 20% volatility, \(100 \times 0.2/\sqrt{365}\).</figcaption>
</figure>

> [!KEY] Once hedged, you are trading volatility
> Long option + delta hedge = a bet that realized volatility beats implied volatility; short option + delta hedge = the opposite bet. The directional risk is gone; what remains is one question: how much will the stock shake?

This resembles Kai's original wish to “bet on a big move”, but it is more refined. Buying a straddle ([[straddle-strangle]]) without hedging bets that the stock ends *far enough* from 100 — only the end point counts. Buying an option and hedging daily bets on *how much the stock shakes over the whole month* — every day's round trip counts. If XYZ runs to 110 mid-month and comes back to 100, the unhedged straddle gets nothing, while the hedged option has turned each swing on the way into cash.

Turn it around and you have a market maker's daily routine. The market maker sells options, buys stock to hedge, collects theta each day, and makes money as long as the realized shaking stays below what implied volatility prepaid. The small demo below puts “being right about volatility” onto 300 random paths: the average is set by the gap between realized and implied, but any single path can land far from it.

::demo[delta-hedging-pnl]

We'll take it in six parts:

- **① Why hedge, and how**: delta-neutral
- **② The hedged P&L formula**: gamma gain minus theta bill
- **③ Discrete hedging**: error and hedging frequency
- **④ Transaction costs versus frequency**
- **⑤ Path dependence**: hedging at implied or at realized delta
- **⑥ Who hedges**: market makers, scalpers and practice today

## @mechanics
### ① Why hedge, and how

A market maker's business is earning the bid-ask spread, not betting on direction ([[market-makers]]). When a customer buys a call, the market maker is short it; if XYZ rallies hard, that one option could wipe out months of spread income. The fix follows [[binomial-one-step]]: **use stock to replicate away the option's directional risk**:

$$
\Pi = V - \Delta\,S
$$

where \(V\) is the option value, \(\Delta = \partial V/\partial S\) its delta, and \(\Pi\) the value of “long one option, short \(\Delta\) shares”. When the stock moves by \(\dd S\), the option moves by about \(\Delta\,\dd S\) and the shares by \(-\Delta\,\dd S\); the first-order terms cancel. What remains is a second-order term (gamma) and a time term (theta).

> [!KAI] Kai's hedge
> One contract has a delta of \(0.534 \times 100 = 53.4\) shares, so Kai shorts 53. The $5,300 from the short sale minus the $245 premium leaves about $5,055 of extra cash, which earns about \(5{,}055 \times 0.04/365 \approx \$0.55\) of interest a day at 4%. That interest exactly offsets the small rate-related piece of theta (see ②).

Delta changes with the stock price and with time, so hedging is not a one-off: it has to be adjusted again and again — dynamic hedging.

### ② The hedged P&L formula

Take a Taylor expansion of the position ([[greeks-map]]) and include the interest on the cash. Over a short time \(\dd t\):

$$
\dd\Pi \approx \underbrace{\tfrac12\,\Gamma\,(\dd S)^2}_{\text{gamma gain}} + \underbrace{\Theta\,\dd t}_{\text{time decay}} - \underbrace{r\,(V - \Delta S)\,\dd t}_{\text{financing}}
$$

The Black-Scholes equation ([[black-scholes]]) says \(\Theta = rV - rS\Delta - \tfrac12\IV^2 S^2\Gamma\). Substitute it and every interest-rate term cancels:

$$
\dd\Pi \approx \tfrac12\,\Gamma S^2\left[\left(\frac{\dd S}{S}\right)^2 - \IV^2\,\dd t\right]
$$

Here \(\IV\) is the implied volatility the option was traded at and \(\left(\dd S/S\right)^2\) is the squared return over the interval. On average \(\E[(\dd S/S)^2] = \RV^2\,\dd t\), where \(\RV\) is realized volatility ([[realized-vol]]), so:

$$
\E[\dd\Pi] \approx \tfrac12\,\Gamma S^2\,\big(\RV^2 - \IV^2\big)\,\dd t
$$

> [!EXAMPLE] Realized 25%, implied 20%
> Day one: \(\tfrac12 \times 0.0693 \times 100^2 \times (0.25^2 - 0.20^2)/365 = 346.6 \times 0.0225/365 \approx \$0.0214\) per share, about $2.14 per contract.
> Summed over all 30 days (gamma changes with the stock and with time), the result is approximately the difference between pricing at realized and at implied volatility:
> $$
> C(25\%) - C(20\%) = 3.02 - 2.45 = 0.57 \;\Rightarrow\; 0.57 \times 100 = \$57 \text{ per contract}
> $$
> The first-order estimate is vega × the vol gap: \(0.114 \times 5 = 0.57\).

The same formula gives Figure 2's **break-even move**: set \(\tfrac12\Gamma(\Delta S)^2 = \tfrac12\IV^2S^2\Gamma\,\dd t\) and you get \(|\Delta S| = S\,\IV\sqrt{\dd t} = 100 \times 0.2/\sqrt{365} \approx \$1.05\). The net daily bill is \(\tfrac12 \times 0.2^2 \times 100^2 \times 0.0693/365 \approx \$0.038\) per share ($3.80 a contract); the quoted theta of −0.044 is a bit larger, and the difference is the $0.55 of interest from ①.

Run the engine's `hedgeSim` over 2,000 paths (hedging once a day):

| Realized vol | Mean P&L / contract | Standard deviation | Paths that lose |
|---|---|---|---|
| 15% | −$57 | $33 | 98% |
| 20% | $0 | $36 | 50% |
| 25% | +$57 | $51 | 8% |

The means match the formula; yet even when right (25% > 20%), 8% of paths lose money — the error we turn to next.

### ③ Discrete hedging: error and hedging frequency

The formula assumes continuous hedging. In reality you can only adjust every so often, and between adjustments delta drifts, producing **hedging error**. It averages zero but randomizes the result of any single path. With realized = implied = 20%:

| Hedging frequency | Rebalances in 30 days \(N\) | P&L standard deviation / contract |
|---|---|---|
| Weekly | 4 | $91 |
| Daily | 30 | $36 |
| 4× a day | 120 | $19 |
| 16× a day | 480 | $9 |

Four times as many rebalances roughly halve the error — it scales like \(1/\sqrt{N}\). Derman and Kamal's approximation is:

$$
\text{sd}(\Pi) \approx \sqrt{\frac{\pi}{4}}\;\frac{\nu\,\sigma}{\sqrt{N}}
$$

where \(\nu\) is vega per 1.00 of volatility (here \(11.4\)), \(\sigma = 0.2\), and \(N\) the number of rebalances. Daily hedging: \(0.886 \times 11.4 \times 0.2/\sqrt{30} \approx 0.37\) dollars per share, about $37 per contract, in line with the simulated $36 (more in [[bs-assumptions]]).

### ④ Transaction costs versus frequency

Every rebalance crosses the bid-ask spread and pays fees. With a cost of \(c\) per share traded, the total is about \(c \times \sum |\Delta_i - \Delta_{i-1}| \times 100\). At 5 cents a share (simulated averages):

| Hedging frequency | 30-day cost / contract | Error sd / contract |
|---|---|---|
| Weekly | about $5 | $91 |
| Daily | about $11 | $36 |
| 4× a day | about $20 | $19 |
| 16× a day | about $38 | $9 |

Costs grow roughly like \(\sqrt{N}\) while the error shrinks like \(1/\sqrt{N}\), so there is a sweet spot. A common practical answer is a **hedge band**: rebalance only when delta has drifted beyond some threshold, rather than on a fixed clock. In [[deep-hedging]] you'll see that when a machine-learning model learns “when not to trade”, it learns exactly such a band.

> [!DEEP] Leland's adjusted volatility
> Leland (1985) showed that with transaction costs, a seller who hedges at fixed intervals \(\delta t\) should price with a higher volatility: \(\sigma_{\text{adj}}^2 = \sigma^2\left(1 + \sqrt{2/\pi}\,\dfrac{k}{\sigma\sqrt{\delta t}}\right)\), where \(k\) is the proportional round-trip cost. With \(k = 0.02\%\) (2 cents round trip on a $100 stock) and daily hedging, \(\sigma_{\text{adj}} \approx 20.15\%\): the costs are worth about 0.15 vol points of extra premium.

### ⑤ Path dependence: hedging at implied or at realized delta

Add up ②'s formula over the option's life:

$$
\Pi \approx \sum_t \tfrac12\,\Gamma_t S_t^2\left(R_t^2 - \IV^2\,\dd t\right)
$$

\(R_t\) is each interval's return and \(\Gamma_t\) the gamma at that time. Every move is **weighted by the gamma at the moment it happens**. Gamma is largest near the strike and close to expiry ([[gamma]]), so:

- if the stock keeps swinging around 100 and is still swinging near expiry, the same realized volatility earns a lot;
- if the stock trends to 115 in the first week, later swings hardly matter — gamma is already small — and it earns little.

This is **path dependence**, and it explains a layer of noise beyond ③'s table: with realized 25% and 16 rebalances a day, the standard deviation is still about $27, versus $9 when realized equals implied.

> [!THINK] If Kai knew in advance that realized volatility would be 25%, could the $57 be locked in regardless of the path?
> Think first: where does \(\IV\) enter the formula, and what if you used a different σ?
> ---
> Yes: **compute delta with the realized 25%** and hedge with that. The position then replicates “the option priced at 25%” step by step, and the final P&L is fixed at \(C(25\%) - C(20\%) = 0.57\) dollars per share (given continuous hedging), although its mark-to-market along the way (still marked at 20%) swings around. Hedging at implied delta is the reverse: the running mark-to-market is smooth, but the final result depends on the path. Nobody knows realized volatility in advance, so most people hedge at implied and accept the path noise.

### ⑥ Who hedges: market makers, scalpers and practice today

- **Market makers** buy and sell options with customers, hedge the delta with stock or futures, earn the spread, and carry the remaining gamma and vega. In index options there is persistent demand for protection, and whoever supplies it (often including market makers) is short options and short gamma — on average, the gap by which implied exceeds realized volatility is the “insurance premium” that supplier collects ([[variance-risk-premium]]).
- **Gamma scalpers** believe an underlying will shake more than its implied volatility says, so they buy options, hedge the delta, and profit from the rebalancing.
- **At the market level**, many dealers hedging at once create sizable order flow. Short-gamma hedging buys rallies and sells dips, amplifying moves; long-gamma hedging does the opposite. That story belongs to [[dealer-gamma]].

> [!EXAMPLE] A scalper's week, reconciled with the formula
> Back to Figure 1: over five days XYZ moved $1.50 each day (alternating direction). Each day's gamma gain is about \(\tfrac12 \times 0.0693 \times 1.5^2 \times 100 \approx \$7.8\) against a net bill of about \(\$3.8\), so roughly \(\$4.0\) a day and \(\$20\) over five days. The engine's day-by-day revaluation gives \(+65 - 47 \approx +\$19\) (option +65, stock hedge −47). The small gap comes from gamma changing with price and time and from rounding the share count.
> Over the same five days, if XYZ moved only $0.50 a day, the gamma gain would be about \(\$0.9\) a day, far below the $3.80 bill, for a net loss of about \(\$15\).

In practice scalpers rarely rebalance mechanically at the close. Common approaches include rebalancing at fixed price intervals (say every $1 move), when delta drifts by a set amount, or deliberately around important events. Each one picks a spot on the error-versus-cost trade-off of ③ and ④; none is best in every market.

> [!WARN] Hedging delta is not the same as having no risk
> A delta-neutral short-option position quietly collects theta day after day, until the stock gaps (earnings, overnight news) and \(\tfrac12\Gamma(\Delta S)^2\) eats weeks of income at once — and during a gap there is no chance to adjust the hedge. The continuous-hedging assumption fails exactly then ([[bs-assumptions]]).

## @analogy
Think of delta hedging as **a surfer balancing on a wave**.

The surfer doesn't care which way the swell pushes overall — that is “direction”, cancelled by constantly shifting weight (re-hedging). But every shift needs a wave to push against: the rougher the sea, the more the surfer can ride and the farther they glide (gamma gain); on a flat sea the surfer has to paddle and slowly burns energy (the theta bill). The forecast says waves of one meter today (implied volatility), and the surf club charges admission on that basis. If the waves turn out to be 1.3 meters, the surfer wins; if 0.7 meters, the ticket was a loss.

- The forecast wave height = implied volatility;
- The actual wave height = realized volatility;
- Each weight shift = a re-hedge;
- Shift too often and you tire out (transaction costs); too rarely and you fall off (hedging error).

The analogy misleads in one place: a surfer who falls just ends up in the water, while the short-gamma side can lose many days of income in a single monster wave (a gap) — and no amount of balancing helps then.

## @misconceptions
- **“Delta-neutral means risk-free.”** — Delta-neutral removes only first-order directional risk. Gamma, vega and gap risk remain, and for the short-option side they are the biggest risks of all.
- **“A hedged long option always loses its theta.”** — Theta is only one side of the ledger. When the stock actually moves more than implied volatility prepaid (about $1.05 a day for XYZ), the gamma gain beats theta and the hedged position makes money.
- **“The more often you hedge, the better.”** — More frequent hedging shrinks the error, but costs grow like \(\sqrt{N}\). At 5 cents a share, hedging 16 times a day costs about $38 per contract, four times the $9 of error that remains.
- **“If you're right about volatility, you're sure to make money.”** — Hedging at implied volatility makes the result path-dependent. With realized 25%, implied 20% and daily hedging, about 8% of paths still lose.
- **“Gamma scalping means picking short-term direction well.”** — A scalper's trades are dictated by gamma: sell after rises, buy after falls. The profit comes from the shaking, not from a directional call.

## @takeaways
- Delta hedging cancels an option's directional risk with stock; what remains is a tug-of-war between gamma (paid by movement) and theta (paid by time).
- Hedged P&L \(\dd\Pi \approx \tfrac12\Gamma S^2(R^2 - \IV^2\dd t)\), on average \(\tfrac12\Gamma S^2(\RV^2 - \IV^2)\dd t\): long options bet realized > implied, short options the reverse.
- Over the whole life, expected P&L is about \(C(\RV) - C(\IV) \approx \nu \times (\RV - \IV)\) — about $57 per contract for XYZ's at-the-money call with realized 25% and implied 20%.
- Discrete-hedging error falls like \(1/\sqrt{N}\) while costs rise like \(\sqrt{N}\); practitioners compromise with hedge bands.
- Results are path-dependent: each move is weighted by the gamma at that moment, so swings near the strike and close to expiry are worth the most.

## @quiz
1. Kai buys XYZ's 30-day at-the-money call and delta-hedges it (implied vol 20%). Over the next month, which scenario is most likely to make the hedged position profitable?
   - [ ] XYZ drifts steadily up 3%
   - [x] XYZ swings sharply up and down every day but ends the month near 100
   - [ ] XYZ doesn't move at all
   - [ ] XYZ's implied volatility drops to 15% while the stock stays put
   > A hedged long option profits when realized shaking exceeds implied volatility. Large daily swings each contribute \(\tfrac12\Gamma(\Delta S)^2\), and they happen near the strike where gamma is large. A slow drift or no move gives too little shaking, so theta wins; a drop in implied volatility cuts the option's value directly.
2. For one day of a hedged long option, what stock move is roughly break-even (S = 100, implied vol 20%)?
   - [ ] $0.20
   - [x] $1.05
   - [ ] $5.73
   - [ ] $20
   > \(|\Delta S| = S\,\IV\sqrt{\dd t} = 100 \times 0.2/\sqrt{365} \approx 1.05\). $5.73 is the 30-day standard deviation, not the daily one.
3. With realized = implied = 20%, what happens to the standard deviation of the hedging error if you go from hedging once a day to four times a day?
   - [ ] It stays the same
   - [ ] It falls to a quarter
   - [x] It roughly halves
   - [ ] It drops to zero
   > The error scales like \(1/\sqrt{N}\): multiply the rebalances by 4 and the error is divided by \(\sqrt{4} = 2\). In the simulation it falls from $36 to $19.
4. Why don't market makers hedge infinitely often?
   - [ ] Exchanges allow at most one hedge per day
   - [ ] Hedging more often lowers the expected profit of the option
   - [ ] At high frequency gamma turns negative
   - [x] Every rebalance pays spread and fees; costs rise with frequency and eventually exceed the error removed
   > Costs grow roughly like \(\sqrt{N}\) and the error shrinks like \(1/\sqrt{N}\). In practice people use a hedge band: rebalance only when the drift is large enough.
5. A delta-neutral short straddle makes steady money day after day. What is its biggest risk?
   - [x] A gap or violent move, where \(\tfrac12\Gamma(\Delta S)^2\) wipes out many days of income at once
   - [ ] The stock not moving at all
   - [ ] A small rise in interest rates
   - [ ] The passage of time
   > A hedged short option is short gamma: it earns theta when the stock is quiet, but loses \(\tfrac12\Gamma(\Delta S)^2\) on every big move, and during a gap there is no time to adjust.

## @further
- [Black & Scholes (1973), The Pricing of Options and Corporate Liabilities](https://doi.org/10.1086/260062) — the original hedging argument: option plus Δ shares is riskless.
- [Delta neutral (Wikipedia)](https://en.wikipedia.org/wiki/Delta_neutral) — delta neutrality and dynamic hedging in one place.
- [Greeks (finance) (Wikipedia)](https://en.wikipedia.org/wiki/Greeks_%28finance%29) — gamma, theta and how they relate.
- [Options Industry Council (OIC)](https://www.optionseducation.org/) — options education backed by the OCC.

## @next
Hedging turns an option into a bet on realized versus implied volatility. Over the long run, who wins that bet? The data say index implied volatility sits above realized on average — selling volatility seems to pay steadily. The next lesson asks where that premium comes from, and why it can vanish in a single day.
