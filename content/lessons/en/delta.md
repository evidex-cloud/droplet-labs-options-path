---
id: delta
prereqs: greeks-map, binomial-one-step, moneyness, probability-ev, black-scholes
demo: delta
---

# Delta: Direction, Hedge Ratio & 'Probability'

## @hook
The 30-day XYZ 100 call has a delta of 0.534, and that one number is quoted three ways: "the call moves 53 cents per dollar", "hedge it with 53 shares", and "a 53% chance of finishing in the money". The first two are exact consequences of the pricing formula. The third is a useful shortcut that can be badly wrong.

## @bridge
In [[greeks-map]] delta did most of the work in Kai's day: \(0.534 \times 2 = \$1.07\) of a $1.06 gain. Delta first appeared much earlier, in [[binomial-one-step]], as the number of shares that replicates an option, and in [[black-scholes]] as \(\N(d_1)\). This lesson pulls those threads together and asks: **what exactly does delta measure, what can you do with it, and where does the "probability" reading break?** It builds Idea ④ (risk — delta is the first risk you measure and the first you hedge), with a look back at Idea ② (no-arbitrage — delta is the replication ratio).

## @intuition
Take Kai's standard option: the **30-day XYZ call with a $100 strike**, worth $2.45 (XYZ at $100, implied volatility 20%, rate 4%; illustrative). Its delta is **0.534**. Here are the three things people mean by that number.

**1. A slope.** If XYZ rises $1, the call gains about $0.53 — per contract (×100 shares), about $53. Kai's call behaves, for small moves, like 53 shares of XYZ. (The exact gain for a $1 rise is $0.569; the extra 3.5 cents is the gamma bonus from [[greeks-map]].)

**2. A hedge ratio.** A market maker who sells Kai this call and wants no exposure to small moves buys **53 shares**. If XYZ rises $1, the short call loses about $53 and the shares make $53. Delta is the number of shares that makes the pair indifferent to the next small move.

**3. A rough "probability".** Traders often say a 0.53-delta call has "about a 53% chance" of finishing in the money. For this option the risk-neutral probability is actually 51.1% — close. For a 1-year option at 50% volatility, delta is 0.63 while the risk-neutral probability is only 0.43. Same shortcut, very different answer.

Delta is not a fixed number. It slides along an **S-shaped curve** as XYZ moves: close to 0 when the call is far out of the money (it will probably expire worthless, so a $1 move barely matters), close to 1 when it is deep in the money (it moves almost dollar for dollar with the stock), and about 0.5 in between. The time left sets how steep the S is.

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Call delta against the stock price for 7, 30 and 180 days to expiry">
<defs><marker id="delta-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="50" y1="220" x2="615" y2="220" class="fx-axis" marker-end="url(#delta-ah)"/>
<line x1="60" y1="228" x2="60" y2="15" class="fx-axis" marker-end="url(#delta-ah)"/>
<line x1="60" y1="30" x2="600" y2="30" class="fx-grid"/>
<line x1="60" y1="125" x2="600" y2="125" class="fx-grid"/>
<line x1="330" y1="25" x2="330" y2="220" class="fx-line fx-dash"/>
<polyline points="60,218 74,217 87,216 101,214 114,212 128,210 141,206 155,203 168,198 182,193 195,187 209,181 222,174 236,167 249,159 263,151 276,142 290,134 303,125 317,117 330,109 344,101 357,94 371,87 384,81 398,74 411,69 425,64 438,59 452,55 465,52 479,48 492,46 506,43 519,41 533,39 546,38 560,36 573,35 587,34 600,34" class="fx-line-blue"/>
<polyline points="60,220 74,220 87,220 101,220 114,220 128,220 141,220 155,220 168,220 182,220 195,219 209,219 222,217 236,214 249,209 263,201 276,190 290,175 303,158 317,138 330,118 344,99 357,82 371,67 384,56 398,47 411,41 425,36 438,34 452,32 465,31 479,31 492,30 506,30 519,30 533,30 546,30 560,30 573,30 587,30 600,30" class="fx-line-thick"/>
<polyline points="60,220 74,220 87,220 101,220 114,220 128,220 141,220 155,220 168,220 182,220 195,220 209,220 222,220 236,220 249,220 263,219 276,217 290,210 303,192 317,162 330,122 344,83 357,55 371,40 384,33 398,31 411,30 425,30 438,30 452,30 465,30 479,30 492,30 506,30 519,30 533,30 546,30 560,30 573,30 587,30 600,30" class="fx-line-bad"/>
<circle cx="330" cy="119" r="5" class="fx-fill-orange"/>
<text x="54" y="34" text-anchor="end" class="fx-t-sm">1</text>
<text x="54" y="129" text-anchor="end" class="fx-t-sm">0.5</text>
<text x="54" y="224" text-anchor="end" class="fx-t-sm">0</text>
<text x="150" y="238" text-anchor="middle" class="fx-t-sm">80</text>
<text x="240" y="238" text-anchor="middle" class="fx-t-sm">90</text>
<text x="330" y="238" text-anchor="middle" class="fx-t-b">K = 100</text>
<text x="420" y="238" text-anchor="middle" class="fx-t-sm">110</text>
<text x="510" y="238" text-anchor="middle" class="fx-t-sm">120</text>
<text x="612" y="254" text-anchor="end" class="fx-t-sm">XYZ price S</text>
<text x="346" y="146" class="fx-t-hl">0.534 (30 days)</text>
<text x="90" y="60" class="fx-t-bad">— 7 days: almost a step</text>
<text x="90" y="78" class="fx-t">— 30 days</text>
<text x="90" y="96" class="fx-t-blue">— 180 days: a gentle slope</text>
<text x="72" y="22" class="fx-t-sm">call delta Δ</text>
</svg>
<figcaption>Figure 1 · Call delta against XYZ's price (strike 100, σ 20%, r 4%). With 7 days left, delta jumps from 0.04 to 0.96 between $95 and $105; with 180 days it only climbs from 0.44 to 0.71 over the same range. The steepness of the S is gamma — the next lesson.</figcaption>
</figure>

> [!THINK] One day before expiry, XYZ sits exactly at $100. A market maker is short one 100-strike call and holds 51 shares as a hedge. How many shares should they hold if XYZ ticks to $100.50? To $99.50?
> Guess using Figure 1's red curve.
> ---
> About **69** shares at $100.50 and about **32** at $99.50 (deltas 0.689 and 0.322). A 50-cent wiggle swings the hedge by nearly 40 shares. The 1-day S-curve is almost a cliff, which is why hedging an at-the-money option on its last day is so hard — and why [[gamma]] explodes near expiry.

We'll take it in five parts:

- **① Delta as a slope**: the formula and the put
- **② Delta as a hedge ratio**: position delta, dollar delta, Kai's positions
- **③ Delta as a "probability"**: \(\N(d_1)\) vs \(\N(d_2)\) vs the real world
- **④ What moves delta**: price, time, volatility, dividends
- **⑤ Delta as a language**: 25-delta puts, hedging desks, and its limits

## @mechanics
### ① Delta as a slope

Delta is the slope of the option's price against the stock price, with time, volatility and rates held fixed. In Black-Scholes (no dividends) it has a clean closed form:

$$
\Delta_C = \frac{\partial C}{\partial S} = \N(d_1), \qquad \Delta_P = \frac{\partial P}{\partial S} = \N(d_1) - 1, \qquad d_1 = \frac{\ln(S/K) + \left(r + \tfrac12\sigma^2\right)T}{\sigma\sqrt{T}}
$$

Where \(\N(\cdot)\) is the standard normal cumulative probability (between 0 and 1), \(S\) the stock price, \(K\) the strike, \(r\) the rate, \(\sigma\) the volatility and \(T\) the time to expiry in years. A call's delta is always between 0 and 1; a put's between −1 and 0.

> [!EXAMPLE] Kai's call and put
> \(S = K = 100\), \(r = 4\%\), \(\sigma = 20\%\), \(T = 30/365 = 0.0822\):
> $$
> d_1 = \frac{0 + (0.04 + 0.02) \times 0.0822}{0.20 \times \sqrt{0.0822}} = \frac{0.00493}{0.0573} = 0.086
> $$
> \(\N(0.086) = 0.534\), so the call's delta is **0.534** and the put's is \(0.534 - 1 = -0.466\). Per contract: +53.4 and −46.6 share-equivalents.

You can also check delta without any formula, the way a risk system does: reprice the option a little above and a little below today's price and take the slope. The 30-day call is worth $3.020 with XYZ at $101 and $1.952 at $99, so

$$
\Delta \approx \frac{C(101) - C(99)}{101 - 99} = \frac{3.020 - 1.952}{2} = 0.534
$$

Where \(C(101)\) and \(C(99)\) are the call's prices with the stock bumped up and down by $1 and everything else unchanged. This "bump and reprice" method works for any model and any product, including ones with no neat formula — which is why trading systems often compute delta this way.

Two facts fall straight out of the formula.

**Call delta minus put delta is exactly 1.** Put-call parity says \(C - P = S - Ke^{-rT}\) ([[put-call-parity]]). Differentiate both sides by \(S\): the left side becomes \(\Delta_C - \Delta_P\), the right side becomes 1. So long a call and short a put at the same strike behaves exactly like one share: \(0.534 - (-0.466) = 1\).

**At the money, delta is a little above 0.5.** With \(S = K\), the numerator of \(d_1\) is \((r + \tfrac12\sigma^2)T > 0\), so \(d_1 > 0\) and \(\N(d_1) > 0.5\). Positive rates and the lognormal shape both push the "fair center" of the distribution slightly above today's price. The effect grows with time: 0.517 at 7 days, 0.534 at 30 days, 0.618 at one year.

### ② Delta as a hedge ratio

> [!RECALL] The one-step tree
> In [[binomial-one-step]], XYZ at $100 could go to $120 or $80, and the 100 call would pay $20 or $0. Holding \(\Delta = \frac{20 - 0}{120 - 80} = 0.5\) shares plus borrowed cash reproduced the call in both states. That ratio — change in option value over change in stock value — is the discrete ancestor of \(\N(d_1)\).

Because the option moves by about \(\Delta\) per $1, holding the option and selling \(\Delta\) shares cancels the first-order exposure. Such a position is **delta-neutral**. Three quantities make delta practical:

- **Position delta** = contracts × 100 × per-share delta (minus for short legs), plus 1 per share of stock. It reads as "this position moves like \(N\) shares".
- **Shares to hedge** = minus the position delta.
- **Dollar delta** = position delta × \(S\): the dollars of stock the position resembles. It lets you compare exposures across different stocks.

$$
\text{Dollar delta} = \Delta \times S \times 100 \times n
$$

Where \(n\) is the number of contracts (negative if short). For one of Kai's 30-day calls: \(0.534 \times 100 \times 100 \times 1 = \$5{,}343\). Kai's 100 shares carry a dollar delta of \(\$10{,}000\). So for small moves the $245 call behaves like about $5,343 of stock — the **leverage** of options, stated precisely.

> [!KAI] What Kai's three wishes do to delta
> Kai owns 100 shares (position delta +100). Each option trade from [[welcome]] changes that number:
> - **Protective put** (buy the 95 put, \(\Delta = -0.163\)): \(100 - 16.3 = 83.7\).
> - **Covered call** (sell the 105 call, \(\Delta = 0.222\)): \(100 - 22.2 = 77.8\).
> - **Collar** (both): \(100 - 22.2 - 16.3 = 61.4\).
> - **A single 100 call instead of shares**: 53.4.
>
> Every hedge is a *delta reduction*. And it drifts: if XYZ is at $105 a week later, the covered call's delta has fallen to about 47 — the short call now eats half of each further dollar, exactly the capped upside Kai agreed to.

<figure>
<svg viewBox="0 0 640 220" role="img" aria-label="Kai's position delta in share-equivalents for five choices">
<line x1="200" y1="20" x2="200" y2="190" class="fx-axis"/>
<rect x="200" y="22" width="400" height="24" rx="3" class="fx-box2"/>
<rect x="200" y="57" width="335" height="24" rx="3" class="fx-ok"/>
<rect x="200" y="92" width="311" height="24" rx="3" class="fx-hl"/>
<rect x="200" y="127" width="246" height="24" rx="3" class="fx-blue"/>
<rect x="200" y="162" width="214" height="24" rx="3" class="fx-gold"/>
<text x="190" y="39" text-anchor="end" class="fx-t">100 shares only</text>
<text x="190" y="74" text-anchor="end" class="fx-t">+ buy 95 put</text>
<text x="190" y="109" text-anchor="end" class="fx-t">+ sell 105 call</text>
<text x="190" y="144" text-anchor="end" class="fx-t">collar (both)</text>
<text x="190" y="179" text-anchor="end" class="fx-t">one 100 call, no shares</text>
<text x="592" y="39" text-anchor="end" class="fx-t-b">100</text>
<text x="545" y="74" class="fx-t-b">83.7</text>
<text x="521" y="109" class="fx-t-b">77.8</text>
<text x="456" y="144" class="fx-t-b">61.4</text>
<text x="424" y="179" class="fx-t-b">53.4</text>
<text x="200" y="208" text-anchor="middle" class="fx-t-sm">0</text>
<text x="400" y="208" text-anchor="middle" class="fx-t-sm">50</text>
<text x="600" y="208" text-anchor="middle" class="fx-t-sm">100</text>
<text x="190" y="208" text-anchor="end" class="fx-t-sm">share-equivalents →</text>
</svg>
<figcaption>Figure 2 · Kai's position delta for five choices (30-day options, XYZ at $100). Each option either removes delta (the short 105 call, the long 95 put) or replaces the shares with a smaller, cheaper delta (the lone call). Read a bar as "for the next $1 move in XYZ, this position gains or loses about this many dollars".</figcaption>
</figure>

A delta hedge is correct only for the next small move. Watch what the hedged pair does. Hold one 30-day call and sell 53.4 shares against it. If XYZ jumps $2 *instantly*, the call gains $1.204 and the shares lose \(0.534 \times 2 = \$1.069\): the pair makes $0.135. If XYZ instead drops $2, the call loses $0.929 and the shares gain $1.069: the pair makes $0.140. **The hedged position makes money whichever way the stock moves** — delta cancelled the straight-line part, and what is left is the curvature. (Time is not free: a day of theta costs about $0.04, which is exactly the trade-off [[theta]] prices.) After the move the call's delta is no longer 0.534, so the hedge must be adjusted. That rebalancing — and what it costs or earns — is the whole subject of [[delta-hedging]].

### ③ Delta as a "probability"

The shortcut "delta ≈ probability of finishing in the money" comes from the Black-Scholes formula itself. [[black-scholes]] showed that the risk-neutral probability of finishing in the money is \(\N(d_2)\), not \(\N(d_1)\), and the two differ by exactly one \(\sigma\sqrt{T}\):

$$
\underbrace{\N(d_1)}_{\Delta} \quad \text{vs} \quad \underbrace{\N(d_2)}_{\Q(S_T > K)}, \qquad d_2 = d_1 - \sigma\sqrt{T}
$$

Where \(\Q(S_T > K)\) is the risk-neutral probability that the stock ends above the strike. Since \(d_2 < d_1\), **delta always overstates the risk-neutral ITM probability** of a call. When \(\sigma\sqrt{T}\) is small (short, low-vol options), the gap is small and the shortcut works. When it is large, the shortcut fails.

| Call (XYZ \(S = 100\), \(r = 4\%\)) | \(\sigma\sqrt{T}\) | Delta | Risk-neutral \(\N(d_2)\) | Real world, \(\mu = 10\%\) |
|---|---|---|---|---|
| 30-day 100, \(\sigma\) 20% | 0.057 | 0.534 | 0.511 | 0.546 |
| 30-day 105, \(\sigma\) 20% | 0.057 | 0.222 | 0.205 | 0.231 |
| 1-year 100, \(\sigma\) 20% | 0.200 | 0.618 | 0.540 | 0.655 |
| 1-year 120, \(\sigma\) 20% | 0.200 | 0.270 | 0.209 | 0.304 |
| 1-year 100, \(\sigma\) 50% | 0.500 | 0.629 | 0.433 | 0.480 |

The last column is a third number again: the probability in a world where you believe XYZ drifts up 10% a year ([[probability-ev]]). It is a belief, not a market price, and it moves with your \(\mu\). The 50%-vol row shows how far apart the three can be: delta says "more likely than not" (0.63), the risk-neutral probability says 43%, and even a 10% drift gives only 48%.

::demo[delta-prob]

> [!WARN] Delta is not your odds of making money
> Even the correct ITM probability is not a profit probability: a call must finish above \(K + \text{premium}\) to make money. Kai's 105 call, sold for $0.71, has delta 0.222 — but the buyer profits only above $105.71, which is less likely than finishing above $105. Use delta as a quick ranking of strikes, not as a forecast.

> [!DEEP] Why \(\N(d_1)\) is larger
> \(\N(d_1)\) is the in-the-money probability measured in a world where the stock itself is the unit of account (the "stock measure"). In that world, paths where the stock ends high count for more, because each outcome is weighted by the stock's value. The in-the-money outcomes are exactly the high-stock outcomes, so their total weight rises — by an amount set by \(\sigma\sqrt{T}\).

### ④ What moves delta

**The stock price.** Moving along the S-curve is gamma: delta rises by about \(\Gamma\) per $1. For the 30-day call, \(0.534 \to 0.602\) at $101 and \(0.826\) at $105. → [[gamma]]

**Time.** As expiry approaches, the S steepens into a step (Figure 1). Out-of-the-money deltas drift toward 0 and in-the-money deltas toward 1 even if the stock doesn't move. At $105, the call's delta is 0.712 with 180 days left, 0.826 with 30 days, 0.964 with 7 days. This overnight drift is called **charm**; it matters to anyone who hedges once a day ([[higher-order-greeks]]).

**Volatility.** Higher volatility flattens the S: it makes far-away strikes more "live" and pulls every delta toward the middle.

| 30-day call | \(\sigma\) = 10% | \(\sigma\) = 20% | \(\sigma\) = 40% |
|---|---|---|---|
| 95 strike (in the money) | 0.972 | 0.837 | 0.703 |
| 100 strike (at the money) | 0.551 | 0.534 | 0.534 |
| 105 strike (out of the money) | 0.058 | 0.222 | 0.367 |

So when implied volatility jumps, a hedger short out-of-the-money calls suddenly has more delta to cover. The sensitivity of delta to volatility is **vanna**, another second-order Greek.

**Dividends.** With a continuous dividend yield \(q\), delta becomes \(e^{-qT}\N(d_1)\) with \(q\) inside \(d_1\): a 2% yield trims the 30-day call's delta from 0.534 to 0.522, because the stock you would receive has paid its dividend to someone else ([[rho-carry]]).

### ⑤ Delta as a language

Because delta summarises moneyness, time and volatility in one number, traders use it to **name strikes**. A "25-delta put" is the put whose delta is −0.25, wherever that strike happens to be. On 30-day XYZ at 20% volatility, the 25-delta put is near the $96.70 strike and the 25-delta call near $104.50. Quoting in delta lets you compare a 30-day option on XYZ with a 90-day option on another stock on the same footing; volatility smiles are drawn and quoted this way ([[smile-skew]], [[moneyness]]).

Brokers display delta per share; multiply by 100 for a contract. Market makers aggregate delta across thousands of positions and hedge the net in the underlying ([[market-makers]]). Two cautions:

- **Model delta depends on the model.** Black-Scholes delta uses one volatility. With a volatility smile, when the stock falls, implied volatility usually rises, and the "true" delta of a put is larger in magnitude than the flat-vol number. Desks adjust for this; retail screens usually do not.
- **Delta-neutral is not risk-free.** It removes exposure to the *next small* move only. Gamma, vega and theta remain — and for option sellers, gamma is where the real risk lives.

## @analogy
Think of delta as an option's **gear ratio** with the stock.

A deep in-the-money call is in top gear: turn the stock's wheel by $1 and the option turns almost $1 (delta near 1). A far out-of-the-money call is in neutral: the engine revs, the wheels barely move (delta near 0). An at-the-money call sits in the middle gear, about half a turn per turn.

The gear ratio also tells a hedger how many shares to put on the other side of the axle so that nothing moves: for a 0.534 gear, 53 shares. That is the hedge ratio.

The gearbox is automatic, and it shifts with conditions. As the stock climbs, the option shifts up (gamma). As expiry nears, the shifts become sudden: one day before expiry, a 50-cent move jumps the gear from 0.32 to 0.69. When volatility rises, the gearbox smooths out and every option sits closer to the middle gear.

Where the analogy breaks: a gear ratio says nothing about where the road ends. Reading "0.53 gear" as "53% chance of arriving" mixes up how the option moves today with where the stock will finish. The first is exact; the second is at best a rough guess, and for long-dated, high-volatility options it can be off by twenty percentage points.

## @misconceptions
- **"Delta is the probability the option finishes in the money."** — The risk-neutral probability is \(\N(d_2)\), which is smaller than a call's delta \(\N(d_1)\) by an amount set by \(\sigma\sqrt{T}\). For a 1-year, 50%-vol option: 0.63 vs 0.43.
- **"At the money means delta is exactly 0.5."** — With positive rates and volatility, \(d_1 > 0\), so ATM call delta is above 0.5: 0.534 at 30 days and 0.618 at one year for XYZ.
- **"Once I'm delta-neutral, I'm hedged."** — Only for the next small move. Delta changes as the stock moves (gamma), as time passes (charm) and as volatility changes (vanna), so the hedge must be rebalanced.
- **"A put's delta is the call's delta with a minus sign."** — It is the call's delta minus 1: \(-0.466\), not \(-0.534\), for XYZ's 30-day 100 strike. The two differ by exactly one share, by put-call parity.
- **"Delta only depends on the stock price."** — It also depends on time, volatility, rates and dividends. An out-of-the-money call's delta can rise overnight simply because implied volatility went up.

## @takeaways
- Delta is the slope of option value against the stock: \(\Delta_C = \N(d_1)\), \(\Delta_P = \N(d_1) - 1\); for Kai's 30-day 100 call, 0.534 (53 share-equivalents per contract).
- Delta is the hedge ratio: sell 53 shares against one long call to be delta-neutral — for the next small move only.
- Position and dollar delta add across legs; Kai's covered call has delta 77.8, the collar 61.4, a lone call 53.4.
- Delta is not the ITM probability: that is \(\N(d_2)\), and the gap grows with \(\sigma\sqrt{T}\); real-world odds are a third, belief-dependent number.
- Delta slides with price (gamma), time (charm), volatility (vanna) and dividends; traders use it to name strikes, as in "25-delta put".

## @quiz
1. Kai's 30-day 100 call has \(\Delta = 0.534\). A market maker sells Kai 3 contracts. How many XYZ shares should the market maker buy to be delta-neutral?
   - [ ] 53
   - [x] about 160
   - [ ] 300
   - [ ] about 140
   > The short calls carry \(-3 \times 100 \times 0.534 = -160.3\) share-equivalents, so buying about 160 shares brings the total to zero. 53 is one contract; 300 would hedge as if delta were 1.
2. The 30-day XYZ 100 **put** — what is its delta?
   - [ ] −0.534
   - [ ] +0.466
   - [x] −0.466
   - [ ] −0.500
   > \(\Delta_P = \N(d_1) - 1 = 0.534 - 1 = -0.466\). Call delta minus put delta is exactly 1, by put-call parity.
3. A 1-year XYZ call at 50% volatility has delta 0.63. What can you say about the risk-neutral probability that it finishes in the money?
   - [ ] It is 63%, because delta is the probability
   - [ ] It is higher than 63%, because volatility is high
   - [ ] It cannot be computed from Black-Scholes
   - [x] It is lower — about 43% — because \(\N(d_2) = \N(d_1 - \sigma\sqrt{T})\) and \(\sigma\sqrt{T} = 0.5\) here
   > The ITM probability is \(\N(d_2)\), one \(\sigma\sqrt{T}\) below \(d_1\). With \(\sigma\sqrt{T} = 0.5\) the gap is large: 0.63 vs 0.43. Delta overstates it.
4. Implied volatility on XYZ jumps from 20% to 40%. What happens to the delta of the 30-day **105** call (out of the money)?
   - [x] It rises, from about 0.22 to about 0.37
   - [ ] It falls, because the option is out of the money
   - [ ] It stays the same, because delta only depends on the stock price
   - [ ] It jumps to 1
   > Higher volatility flattens the S-curve, making far strikes more likely to matter: the OTM delta rises (0.222 → 0.367) and the ITM delta falls. A hedger short these calls must buy more stock.
5. Kai owns 100 XYZ and sells one 30-day 105 call (\(\Delta = 0.222\)). A week later XYZ is at $105 and the position delta is about 47. What does that tell Kai?
   - [ ] The position has become riskier than owning the shares
   - [x] The short call now offsets about half of each further $1 move — the capped upside is kicking in
   - [ ] Kai should buy 47 more shares to stay covered
   - [ ] The call is about to be assigned for certain
   > As XYZ approaches the strike, the short call's delta rises toward 0.5 and cancels more of the shares' delta: \(100 - 53 \approx 47\). That is the covered call trading upside for premium ([[covered-call]]).

## @further
- [Greeks (finance): Delta — Wikipedia](https://en.wikipedia.org/wiki/Greeks_(finance)#Delta) — formulas, the put-call relation and the "probability" discussion.
- [Black & Scholes (1973), The Pricing of Options and Corporate Liabilities](https://doi.org/10.1086/260062) — the hedge ratio as the heart of the pricing argument.
- [Cox, Ross & Rubinstein (1979), Option Pricing: A Simplified Approach](https://doi.org/10.1016/0304-405X%2879%2990015-1) — the binomial model where delta is the replication ratio.
- [Characteristics and Risks of Standardized Options (OCC)](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the official risk disclosure, including leverage and time-decay risks.

## @next
Delta slides along its S-curve, and on the last day it becomes a cliff. The speed of that slide is gamma — the Greek that makes a long option win on moves in either direction and makes a short option's hedge a treadmill. Next: [[gamma]].
