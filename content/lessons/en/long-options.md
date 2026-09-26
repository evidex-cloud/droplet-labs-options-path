---
id: long-options
prereqs: call-option, put-option, probability-ev, delta, theta
demo: long-options
---

# Long Calls & Puts: Choosing the Strike and the Expiry

## @hook
“XYZ will be at 110 within two months.” Express that one view with three strikes and three expiries and the results run from +181% to −100% — and a perfectly correct view can still lose everything. Buying an option is not just a bet on direction: **the strike answers “how far,” the expiry answers “how soon.”** This lesson shows how to translate a view into a contract.

## @bridge
The Strategy tier starts here. The Beginner and Principles tiers handed us every part we need: shapes ([[call-option]], [[payoff-diagrams]]), pricing ([[black-scholes]]), volatility ([[implied-vol]]) and the Greeks ([[delta]], [[theta]], [[vega]]). From now on every strategy gets two pictures: **the P&L at expiry** and **its Greek “signature” before expiry**. The first stop is the simplest strategy of all: buying a single option. This lesson builds Idea ① (shape: capped loss, open upside) and Idea ④ (risk: Δ, Θ and ν decide how the trade behaves before expiry).

## @intuition
Kai's third wish is to “bet on a big move with a capped loss.” Kai thinks XYZ can reach **$110** within about 60 days (it trades at $100 with 20% implied volatility). Another 100 shares would cost $10,000; one call option costs a few hundred dollars, and a few hundred dollars is all it can lose.

The catch: the option chain lists dozens of calls. Which one?

A complete view has three parts: **direction** (up or down), **size** (how far), and **timing** (by when). An option has two dials: the **strike** sets how far the stock must travel before you make money, and the **expiry** sets how long you give the view to play out. Choosing a contract means pointing those two dials at the second and third parts of the view.

> [!KAI] One correct view, three outcomes
> Kai compares three 60-day calls (σ = 20%, r = 4%):
> - in-the-money 90: $10.88 per share, \(10.88 \times 100 = \$1{,}088\) per contract;
> - at-the-money 100: $3.56, or $356 per contract;
> - out-of-the-money 110: $0.59, or $59 per contract.
>
> Suppose that in 60 days XYZ closes **exactly** at 110 — the view came true to the dollar. The three options return **+84%, +181% and −100%**. The cheapest one pays nothing at all: with the stock sitting on its strike it is worth \(\max(110 - 110, 0) = 0\).

<figure>
<svg viewBox="0 0 660 330" role="img" aria-label="Strike by expiry outcome grid"><text x="20" y="22" class="fx-t-b">View: XYZ at 110 in 60 days. Each cell = return on one call</text><text x="250" y="52" text-anchor="middle" class="fx-t-b">60-day expiry</text><text x="400" y="52" text-anchor="middle" class="fx-t-b">90-day expiry</text><text x="550" y="52" text-anchor="middle" class="fx-t-b">120-day expiry</text><text x="20" y="100" class="fx-t-b">ITM K = 90</text><rect x="180" y="64" width="140" height="74" rx="8" class="fx-box"/><text x="250" y="92" text-anchor="middle" class="fx-t-b">+84%</text><text x="250" y="111" text-anchor="middle" class="fx-t-sm">only 105: +38%</text><text x="250" y="128" text-anchor="middle" class="fx-t-sm">cost $1088</text><rect x="330" y="64" width="140" height="74" rx="8" class="fx-box"/><text x="400" y="92" text-anchor="middle" class="fx-t-b">+77%</text><text x="400" y="111" text-anchor="middle" class="fx-t-sm">only 105: +34%</text><text x="400" y="128" text-anchor="middle" class="fx-t-sm">cost $1145</text><rect x="480" y="64" width="140" height="74" rx="8" class="fx-box"/><text x="550" y="92" text-anchor="middle" class="fx-t-b">+71%</text><text x="550" y="111" text-anchor="middle" class="fx-t-sm">only 105: +30%</text><text x="550" y="128" text-anchor="middle" class="fx-t-sm">cost $1202</text><text x="20" y="182" class="fx-t-b">ATM K = 100</text><rect x="180" y="146" width="140" height="74" rx="8" class="fx-ok"/><text x="250" y="174" text-anchor="middle" class="fx-t-b">+181%</text><text x="250" y="193" text-anchor="middle" class="fx-t-sm">only 105: +40%</text><text x="250" y="210" text-anchor="middle" class="fx-t-sm">cost $356</text><rect x="330" y="146" width="140" height="74" rx="8" class="fx-ok"/><text x="400" y="174" text-anchor="middle" class="fx-t-b">+134%</text><text x="400" y="193" text-anchor="middle" class="fx-t-sm">only 105: +33%</text><text x="400" y="210" text-anchor="middle" class="fx-t-sm">cost $445</text><rect x="480" y="146" width="140" height="74" rx="8" class="fx-box"/><text x="550" y="174" text-anchor="middle" class="fx-t-b">+112%</text><text x="550" y="193" text-anchor="middle" class="fx-t-sm">only 105: +32%</text><text x="550" y="210" text-anchor="middle" class="fx-t-sm">cost $523</text><text x="20" y="264" class="fx-t-b">OTM K = 110</text><rect x="180" y="228" width="140" height="74" rx="8" class="fx-bad"/><text x="250" y="256" text-anchor="middle" class="fx-t-b">−100%</text><text x="250" y="275" text-anchor="middle" class="fx-t-sm">only 105: −100%</text><text x="250" y="292" text-anchor="middle" class="fx-t-sm">cost $59</text><rect x="330" y="228" width="140" height="74" rx="8" class="fx-ok"/><text x="400" y="256" text-anchor="middle" class="fx-t-b">+141%</text><text x="400" y="275" text-anchor="middle" class="fx-t-sm">only 105: −28%</text><text x="400" y="292" text-anchor="middle" class="fx-t-sm">cost $112</text><rect x="480" y="228" width="140" height="74" rx="8" class="fx-ok"/><text x="550" y="256" text-anchor="middle" class="fx-t-b">+136%</text><text x="550" y="275" text-anchor="middle" class="fx-t-sm">only 105: +5%</text><text x="550" y="292" text-anchor="middle" class="fx-t-sm">cost $166</text><text x="20" y="318" class="fx-t-sm">Red = total loss; green = returns above +130%. σ = 20%, r = 4%, priced with Black-Scholes</text></svg>
<figcaption>Figure 1 · The strike × expiry outcome grid. One view (110 in 60 days), wildly different results depending on the contract. Look at the bottom row: 30 more days turn the 110 call from −100% into +141% — but if the stock only reaches 105 it loses 28%. The in-the-money calls (first row) earn modest returns and lose least when the view fails.</figcaption>
</figure>

Two rules fall out of the grid:

- **The higher the strike (the further out of the money), the bigger the leverage and the stricter the demand on size.** The 110 strike only pays if the stock goes clearly **beyond** 110. If your target is 110, putting the strike on the target is a bet on doing better than your own view.
- **The longer the expiry, the more room for error on timing.** On day 60 the 90-day 110 call still has 30 days of time value, so with the stock just at 110 it is still worth $2.70. Timing is the part of a view people get wrong most often; buying extra time is buying room for that error.

Behaviour before expiry matters just as much. Anyone who buys an option carries a fixed Greek signature: **Δ positive (calls) or negative (puts), Γ positive, Θ negative, ν positive.** In plain words: when you're right about direction your gains accelerate (convexity), you pay “rent” every day, and a fall in implied volatility costs you money. That last point surprises beginners: buy a call before earnings, the stock rises after the report, and the call can still lose money because implied volatility dropped ([[earnings-events]]).

We'll take it in five parts:

- **① Strike: trading leverage (elasticity) for probability**
- **② Expiry: theta rent versus the time your view needs**
- **③ The breakeven by date and the signature before expiry**
- **④ Long puts: the mirror image, but not insurance**
- **⑤ Exits, LEAPS as stock replacement, and practical points**

## @mechanics
### ① Strike: trading leverage (elasticity) for probability

The cleanest measure of leverage is **elasticity** (written \(\Omega\)): the percentage change in the option's price for a 1% change in the stock.

$$
\Omega = \frac{\partial V / V}{\partial S / S} = \Delta \cdot \frac{S}{V}
$$

Here \(\Delta\) is the option's delta ([[delta]]), \(S\) is the spot price and \(V\) is the option price. \(\Delta\) says how many dollars the option moves when the stock moves one dollar; multiplying by \(S/V\) converts “dollars per dollar” into “percent per percent.”

> [!EXAMPLE] The 30-day at-the-money call: \(\Omega \approx 22\)
> \(\Delta = 0.534\), \(S = 100\), \(V = 2.45\):
> $$
> \Omega = 0.534 \times \frac{100}{2.45} \approx 21.8
> $$
> If the stock goes from 100 to 101 (+1%), the option gains about $0.534, which is \(0.534 / 2.45 \approx 21.8\%\). The same $245 buys only 2.45 shares of stock, but one at-the-money call carries the directional exposure of \(0.534 \times 100 \approx 53\) shares.

Lay out the 30-day calls by strike and the trade-off is plain:

| Strike | Price per share | \(\Delta\) | Elasticity \(\Omega\) | Risk-neutral P(finish ITM) |
|---|---|---|---|---|
| 90 (deep ITM) | 10.36 | 0.973 | 9.4 | 96.9% |
| 95 | 5.82 | 0.837 | 14.4 | 82.2% |
| 100 (ATM) | 2.45 | 0.534 | 21.8 | 51.1% |
| 105 | 0.71 | 0.222 | 31.2 | 20.5% |
| 110 (OTM) | 0.14 | 0.057 | 41.7 | 5.1% |

**The higher the elasticity, the lower the chance of finishing in the money.** No row is the “better deal”: in the Black-Scholes world every one of them is fairly priced, and you are only choosing between a big multiple with a small probability and a small multiple with a big probability. A deep in-the-money call is nearly stock (\(\Delta\) close to 1); an out-of-the-money call is nearly a lottery ticket ([[probability-ev]]).

Many traders simply **choose the strike by delta**: delta tells you both “how many shares this is like” and roughly “how far out of the money it sits.” For a view with a specific target, one simple check is: **if the stock lands exactly on the target at expiry, what is this option worth?** For Kai's 60-day view, the 95 call (\(\Delta = 0.775\), $6.72) is worth $15 at 110, a +123% return; the 105 call (\(\Delta = 0.316\), $1.59) is worth $5, a +214% return; the 110 call is worth zero. Only strikes inside the target actually get paid by your view.

::demo[long-options-elasticity]

> [!THINK] Two traders, about $240 each
> Trader A buys one 30-day 100 call ($245). Trader B buys seventeen 30-day 110 calls (about $13.80 each, $234 in total). At expiry XYZ closes at 112. Who made more? What if it closes at 108?
> ---
> At 112: A makes \((12 - 2.45) \times 100 \approx \$955\); B makes \(17 \times (2 - 0.138) \times 100 \approx \$3{,}165\). At 108: A makes \((8 - 2.45) \times 100 = \$555\); all seventeen of B's calls expire worthless, a $234 loss. Out-of-the-money options win only in the tail of the distribution — and the risk-neutral chance of a 30-day close above 112 is only about 2.6%. Choosing a strike is choosing which slice of outcomes you want to be paid in.

### ② Expiry: theta rent versus the time your view needs

Time value grows roughly with \(\sqrt{T}\); that comes straight from the at-the-money approximation ([[black-scholes]]):

$$
C_{\text{ATM}} \approx 0.4\,S\sigma\sqrt{T}, \qquad \text{average cost per day} \approx \frac{C_{\text{ATM}}}{\text{days}} \propto \frac{1}{\sqrt{\text{days}}}
$$

Here \(S\) is spot, \(\sigma\) the implied volatility and \(T\) the time to expiry in years. The price grows like \(\sqrt{T}\) while the number of days grows like \(T\), so **the cost per day of time falls as the expiry gets longer.**

| At-the-money call (K = 100) | Price | Θ per day | ν per vol point | Average cost per day |
|---|---|---|---|---|
| 30 days | 2.45 | −0.044 | 0.114 | 0.082 |
| 60 days | 3.56 | −0.032 | 0.161 | 0.059 |
| 120 days | 5.23 | −0.024 | 0.225 | 0.044 |
| 365 days | 9.93 | −0.016 | 0.381 | 0.027 |

> [!EXAMPLE] 60 days or 120 days?
> Kai's view needs about 60 days. The 60-day option costs $356, about $5.90 per day; the 120-day option costs $523, about $4.40 per day, and on day 60 it still has 60 days of time value left to sell back. The price: the 120-day option has \(\nu = 0.225\), so each vol point of falling implied volatility costs $22.50 per contract, twice as much as the 30-day option. **Long expiries are cheap in time and expensive in volatility sensitivity.**

A common practice is to buy **more** time than the view needs (say 1.5 to 2 times as much) and to sell before the last three or four weeks, avoiding the zone where theta accelerates ([[theta]]).

One more dial isn't on the contract but in the price: **the level of implied volatility**. The same 60-day at-the-money call costs $3.56 at 20% implied volatility and $5.17 at 30%, and its breakeven at expiry moves from 103.56 to 105.17. Buying an option means buying volatility at the implied level, so before ordering it is worth asking how far implied volatility sits above recent realized volatility ([[realized-vol]]). Before events such as earnings or central-bank meetings, implied volatility is usually bid up, and it falls back afterwards. **The right view and the right contract can still disappoint if you paid too much for the volatility.**

### ③ The breakeven by date and the signature before expiry

The breakeven at expiry is simple: \(K + C_0\) for a call, \(K - P_0\) for a put. But you rarely hold to the last day. More useful is the **breakeven by date**, \(S^{*}_t\): how high must the stock be on day \(t\) for the option to be worth what you paid, \(C_0\)?

$$
C\big(S^{*}_t,\ T - t\big) = C_0
$$

where \(C(S, \tau)\) is the option price at stock price \(S\) with \(\tau\) years left (Black-Scholes, implied volatility unchanged). On the day you buy, \(S^{*}_0 = 100\); every day after that, theta eats a little time value and the hurdle rises.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Breakeven price rising over time"><defs><marker id="long-options-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs><polygon points="70,200 70,181.1 88,176.6 106,172.1 124,167.6 142,163 160,158.4 178,153.8 196,149.2 214,144.5 232,139.8 250,135 268,130.3 286,125.4 304,120.6 322,115.8 340,110.9 358,105.9 376,101 394,96.1 412,91.1 430,86.1 448,81.2 466,76.2 484,71.3 502,66.5 520,61.8 538,57.4 556,53.3 574,49.9 592,47.6 610,46.6 610,200" class="fx-area-bad"/><polygon points="70,30 70,181.1 88,176.6 106,172.1 124,167.6 142,163 160,158.4 178,153.8 196,149.2 214,144.5 232,139.8 250,135 268,130.3 286,125.4 304,120.6 322,115.8 340,110.9 358,105.9 376,101 394,96.1 412,91.1 430,86.1 448,81.2 466,76.2 484,71.3 502,66.5 520,61.8 538,57.4 556,53.3 574,49.9 592,47.6 610,46.6 610,30" class="fx-area-ok"/><polyline points="70,181.1 88,176.6 106,172.1 124,167.6 142,163 160,158.4 178,153.8 196,149.2 214,144.5 232,139.8 250,135 268,130.3 286,125.4 304,120.6 322,115.8 340,110.9 358,105.9 376,101 394,96.1 412,91.1 430,86.1 448,81.2 466,76.2 484,71.3 502,66.5 520,61.8 538,57.4 556,53.3 574,49.9 592,47.6 610,46.6" class="fx-line-thick"/><line x1="70" y1="200" x2="620" y2="200" class="fx-axis" marker-end="url(#long-options-ah)"/><line x1="70" y1="200" x2="70" y2="24" class="fx-axis"/><text x="70" y="218" text-anchor="middle" class="fx-t-sm">0</text><text x="205" y="218" text-anchor="middle" class="fx-t-sm">15</text><text x="340" y="218" text-anchor="middle" class="fx-t-sm">30</text><text x="475" y="218" text-anchor="middle" class="fx-t-sm">45</text><text x="610" y="218" text-anchor="middle" class="fx-t-sm">60</text><text x="62" y="185.1" text-anchor="end" class="fx-t-sm">100</text><line x1="70" y1="181.1" x2="610" y2="181.1" class="fx-grid"/><text x="62" y="147.3" text-anchor="end" class="fx-t-sm">101</text><line x1="70" y1="143.3" x2="610" y2="143.3" class="fx-grid"/><text x="62" y="109.6" text-anchor="end" class="fx-t-sm">102</text><line x1="70" y1="105.6" x2="610" y2="105.6" class="fx-grid"/><text x="62" y="71.8" text-anchor="end" class="fx-t-sm">103</text><line x1="70" y1="67.8" x2="610" y2="67.8" class="fx-grid"/><text x="62" y="34" text-anchor="end" class="fx-t-sm">104</text><line x1="70" y1="30" x2="610" y2="30" class="fx-grid"/><circle cx="340" cy="110.9" r="5" class="fx-fill-orange"/><text x="332" y="100.9" text-anchor="end" class="fx-t-hl">101.86</text><circle cx="610" cy="46.6" r="5" class="fx-fill-orange"/><text x="602" y="36.6" text-anchor="end" class="fx-t-hl">103.56</text><text x="78" y="197.1" class="fx-t-hl">100.00</text><text x="90" y="60" class="fx-t-ok">stock above the line: profit</text><text x="330" y="185" class="fx-t-bad">stock below the line: loss</text><text x="610" y="240" text-anchor="end" class="fx-t-sm">days since buying the 60-day 100 call (cost 3.56)</text></svg>
<figcaption>Figure 2 · The 60-day 100 call (cost 3.56). The stock price needed to get your money back rises from 100 on day 0 to 101.86 on day 30 and 103.56 at expiry (\(= K + C_0\)). The hurdle is almost a straight line: each day that passes, the stock has to be about 6 cents higher.</figcaption>
</figure>

::demo[long-options-breakeven]

Before expiry, the P&L is approximated by the Greeks ([[greeks-map]]):

$$
\Delta V \approx \Delta\,\dd S + \tfrac12\Gamma\,(\dd S)^2 + \Theta\,\dd t + \nu\,\dd\sigma
$$

where \(\dd S\) is the change in the stock price (dollars), \(\dd t\) the number of days passed (with Θ per day), and \(\dd\sigma\) the change in implied volatility (in vol points, with ν per point). The four terms are the contributions of direction, convexity, time and volatility.

> [!EXAMPLE] Ten days later: stock +2, implied vol −2 points
> The 60-day at-the-money call has \(\Delta = 0.548\), \(\Gamma = 0.049\), \(\Theta = -0.032\), \(\nu = 0.161\).
> $$
> \begin{aligned}\Delta V &\approx 0.548 \times 2 + \tfrac12 \times 0.049 \times 2^2 - 0.032 \times 10 - 0.161 \times 2  \\ &\approx 1.10 + 0.10 - 0.32 - 0.32 = 0.55\end{aligned}
> $$
> An exact reprice gives \(4.14 - 3.56 = 0.58\). Direction earned 1.20; time and volatility each took about 0.32. **The stock rose 2% and the option gained only 16% — far below the roughly 30% that elasticity alone suggests.**

That is the long-option signature: **Δ in the direction of the view, Γ positive, Θ negative, ν positive.** You are buying convexity, paying rent by the day, and implied volatility is a silent opponent.

### ④ Long puts: the mirror image, but not insurance

A bearish view is expressed with puts, and the logic is an exact mirror. Suppose the view is “XYZ at 90 in 60 days”:

| 60-day put | Price per share | Cost per contract | Return if XYZ closes at 90 on day 60 |
|---|---|---|---|
| ITM 110 | 9.87 | $987 | +103% |
| ATM 100 | 2.91 | $291 | +244% |
| OTM 90 | 0.29 | $29 | −100% |

As with calls, putting the strike on the target is the worst choice. Two differences:

- **The maximum gain is capped:** the stock can only fall to zero, so a long put makes at most \(K - P_0\).
- **Real puts cost more:** in real markets out-of-the-money puts usually trade at higher implied volatility than at-the-money options (the skew, [[smile-skew]]). The table uses a flat 20%; in practice the same 90 put would be pricier.

The puts in this section are **speculation**: no shares owned, a pure bet on a fall. Buying a put while holding the stock is **insurance**, which follows a different logic — see [[protective-put-collar]].

> [!WARN] Bearish options get beaten by time too
> The 60-day at-the-money put has \(\Theta = -0.021\), or $2.10 per contract per day. If the stock goes sideways for 30 days the put falls from 2.91 to 2.12, losing about 27% of its value. A long put has the same Γ-positive, Θ-negative, ν-positive signature as a long call; only Δ is negative.

### ⑤ Exits, LEAPS as stock replacement, and practical points

**Exits need more planning than entries.** Three common kinds of rule (a description of practice, not advice):

- **target:** sell when a preset price or return is reached;
- **thesis invalidated:** sell when the “I was wrong” condition you wrote down in advance triggers, rather than waiting for the premium to reach zero;
- **time stop:** with two or three weeks left, reassess regardless of P&L, because theta accelerates from there.

When a trade is profitable you usually **sell the option** rather than exercise it: exercising captures only intrinsic value, while selling also recovers the remaining time value. For an American call on a non-dividend stock, early exercise is never optimal ([[exercise-assignment]]).

**LEAPS** are long-term options with more than a year to run. Deep in-the-money LEAPS calls are often used as a “stock replacement”:

> [!DEEP] The 1-year 80 call: 92 shares of exposure for $2,391
> The 1-year call with an 80 strike costs 23.91, with \(\Delta = 0.922\) and elasticity 3.85. One contract costs $2,391 and carries the directional exposure of 92 shares, versus $10,000 for 100 shares. Its time value, \(23.91 - 20 = 3.91\), splits into two pieces: one year of interest on borrowing $80, \(80 \times (1 - e^{-0.04}) \approx 3.14\), plus the value of a 1-year 80 put, 0.77 (downside insurance). This is put-call parity ([[put-call-parity]]): **a LEAPS call = stock + a loan + a protective put.**

The same “leverage with a capped loss” can be built with a perpetual future, but the mechanics are completely different: a perp has no time value, but it does have liquidation ([[perps-vs-options]]). If you want to lighten the theta and vega burden, the next tool is a spread ([[vertical-spreads]]): sell a further-out option and let its premium subsidise the one you buy.

## @analogy
Buying an option is like **renting a surfboard and waiting for a wave**.

- **The strike** is how tall the wave must be before you can ride it. A small board (an out-of-the-money option) is cheap to rent but needs a big wave; a big board (an in-the-money option) costs more but works on small waves too.
- **The expiry** is the rental period. Nobody knows exactly when the wave will come. A one-day rental is cheap, but if the wave arrives an hour late you paid for nothing; a one-week rental costs more in total but less per day.
- **Theta** is the rate card that ticks up by the hour, getting more expensive per hour as return time approaches.
- **Implied volatility** is the surf forecast: when everyone says “big waves tomorrow,” rentals are expensive; when the forecast changes, the resale value of your rental drops at once, even though the wave hasn't come yet.

Kai's choice becomes: how big do I think the wave will be? How soon will it come? How much will I pay for “sooner” or “bigger”?

The analogy breaks in one place: a surfboard rental can't be handed on, but an option can be sold at market price any time before expiry. So an option's value depends not only on whether the wave finally came, but on the market's day-by-day repricing of whether it will — and that repricing is exactly what the Greeks describe.

## @misconceptions
- **“If I'm right about direction, a call makes money.”** — Size and timing must be right too. The 60-day 110 call loses 100% under the perfectly correct view “exactly 110 in 60 days.”
- **“Out-of-the-money options are cheap, so they're low risk.”** — They are cheap in dollars and expensive in probability. The 30-day 110 call costs $14, but the risk-neutral chance of finishing in the money is about 5%, and of finishing above its 110.14 breakeven about 4.9%.
- **“Shorter expiries save money.”** — The total price is lower but the cost per day is higher: the 30-day at-the-money call costs 0.082 per day on average, the 1-year call 0.027. Short options also put all of the timing error on you.
- **“The most I can lose is the premium, so position size doesn't matter.”** — Losing 100% is a normal outcome for option buyers, not a rare one. Size so that a total loss is acceptable ([[position-sizing]]).
- **“Once my option is in the money I should exercise to lock in the profit.”** — Exercising captures only intrinsic value; selling the option also recovers the remaining time value.

## @takeaways
- A view has three parts — direction, size and timing; the strike matches size, the expiry matches timing.
- Elasticity \(\Omega = \Delta \cdot S/V\) measures leverage; higher elasticity comes with a lower chance of finishing in the money — a trade-off, not a free lunch.
- Putting the strike on your target is a bet on doing better than your view; at-the-money or slightly in-the-money strikes usually fit a target-price view better.
- The cost per day of time falls roughly like \(1/\sqrt{\text{days}}\): buying extra time and exiting before the last weeks leaves room for timing errors.
- A long option's signature is Γ positive, Θ negative, ν positive: before expiry, time and implied volatility pull against you, and the breakeven by date rises day by day.

## @quiz
1. Kai's view is “XYZ at 110 in 60 days.” If the view comes true exactly, which 60-day call returns −100%?
   - [ ] The 90-strike call
   - [ ] The 100-strike call
   - [x] The 110-strike call
   - [ ] None of them — the view was right
   > With the stock exactly at 110 at expiry, the 110 call is worth \(\max(110 - 110, 0) = 0\) and the whole premium is lost. The 90 call returns about +84% and the 100 call about +181%. A strike on the target is a bet on an outcome better than the view.
2. The 30-day 105 call costs 0.71 and has \(\Delta = 0.222\). Its elasticity \(\Omega\) is closest to:
   - [ ] 0.22
   - [ ] 4.5
   - [x] 31
   - [ ] 222
   > \(\Omega = \Delta \cdot S/V = 0.222 \times 100 / 0.71 \approx 31\): a 1% rise in the stock lifts the option about 31%. 0.22 is just the delta, not yet converted into percentages.
3. Why do many traders buy a longer expiry than their view needs?
   - [ ] Because long-dated options have a lower total price
   - [x] Because the cost per day of time falls as the expiry lengthens, and timing is the part of a view most often wrong
   - [ ] Because long-dated options have less vega and don't care about implied volatility
   - [ ] Because long-dated options have more gamma
   > An at-the-money price is roughly proportional to \(\sqrt{T}\), so the average cost per day falls like \(1/\sqrt{\text{days}}\), and the extra time leaves room for error. Long-dated options cost more in total, have more vega and less gamma — those are their costs.
4. Kai buys the 60-day 100 call for $3.56. Thirty days later XYZ is at 101 and implied volatility hasn't changed. The trade is roughly:
   - [ ] Up about $1, because the stock rose $1
   - [ ] Up about 16%, because the elasticity is about 15
   - [x] A small loss, because the day-30 breakeven is about 101.86
   - [ ] A total loss, because the option is still at the money
   > Thirty days of theta have eaten time value, and the price needed to break even has risen to about 101.86. At 101 the stock is below that hurdle, so the position shows a small loss; with 30 days left the option is far from worthless.
5. The 1-year 80 call costs 23.91, so its time value is 3.91. What mainly makes up that 3.91?
   - [ ] It is all a volatility premium — the market is overcharging
   - [ ] It is all compensation for dividends
   - [ ] The discounted value of the 80 of intrinsic value
   - [x] A year of interest on borrowing 80 (about 3.14) plus the value of an 80 put (about 0.77)
   > By parity, a deep in-the-money call = stock + borrowing the strike + a protective put. \(80 \times (1 - e^{-0.04}) \approx 3.14\) is the financing cost and 0.77 the value of the downside insurance; together they are the time value.

## @further
- [LEAPS (Wikipedia)](https://en.wikipedia.org/wiki/LEAPS_(finance)) — definition, history and the “stock replacement” use of long-term options.
- [Greeks (finance) (Wikipedia)](https://en.wikipedia.org/wiki/Greeks_(finance)) — delta, gamma, theta, vega and elasticity (lambda) in one place.
- [OCC: Characteristics and Risks of Standardized Options](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the risk disclosure US brokers must deliver before approving options trading; clear on the buyer's risks.
- [Options Industry Council (OIC)](https://www.optionseducation.org/) — the US options industry's free education site, with strategy pages and calculators for long calls and puts.
- [Strategy Path](https://evidex-cloud.github.io/droplet-labs-strategy-path/) — sister course on turning a view into a bet, from game theory and decision-making.

## @next
Option buyers pay rent every day. So who collects it? Kai already owns 100 shares of XYZ. In the next lesson Kai switches sides: selling a call against the shares to “collect rent” — at the price of giving away part of the upside.
