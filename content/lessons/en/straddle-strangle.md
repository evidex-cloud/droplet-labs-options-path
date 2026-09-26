---
id: straddle-strangle
prereqs: implied-vol, realized-vol, gamma, theta, vega, strategy-matrix
demo: straddle-strangle
---

# Straddles & Strangles: Betting on a Big Move

## @hook
Buy the XYZ 100 call and the 100 put together and you stop caring which way the stock goes: you only care *how far*. The price, $4.57, is the market's estimate of that distance. So a straddle is not a bet on a big move — it is a bet that the move will be **bigger than the market already expects**.

## @bridge
[[strategy-matrix]] drew a map of direction × volatility × time, but every trade we had actually studied lived in its bullish and bearish columns. This stage fills in the middle column, where direction drops out and only the size of the move is left. From [[implied-vol]] and [[realized-vol]] we know the two numbers that matter — implied vol is the quote, realized vol is the bill — and from [[gamma]] and [[theta]] we know how an option earns and pays day by day. This lesson answers one question: **how do you trade the size of a move, and when does that trade actually pay?** It builds Idea ③ (volatility) and Idea ④ (risk: long gamma is paid for with theta).

## @intuition
Kai's XYZ reports earnings in about three weeks. Kai has no idea whether the news will be good or bad, but has a strong feeling that the stock will *not* sit still. Kai's third wish from [[welcome]] — bet on a big move with a capped loss — now has a precise shape.

> [!KAI] Kai buys a straddle
> Kai buys one 30-day XYZ 100 call for $2.45 and one 30-day 100 put for $2.12, for illustration at σ = 20% and r = 4%. Total cost \(2.45 + 2.12 = \$4.57\) per share, or **$457** for the pair of contracts.
> - XYZ finishes at 110: the call pays 10, the put nothing → \(10 - 4.57 = +\$5.43\) per share (+$543).
> - XYZ finishes at 90: the put pays 10, the call nothing → the same +$543.
> - XYZ finishes at 100: both expire worthless → −$457, the worst case.

The payoff is a **V**. Its bottom sits at the strike and its two arms rise one dollar for every dollar the stock moves away. Kai wins if XYZ ends **below $95.43 or above $104.57** — the strike minus and plus the total premium. Between those two breakevens Kai loses, most of all at exactly $100.

Buy the two legs out of the money instead — the 95 put ($0.51) and the 105 call ($0.71) — and you get a **strangle**: cost $1.22, a flat bottom between the strikes, and breakevens further out, at $93.78 and $106.22. Cheaper to own, harder to win.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Straddle vs strangle P&amp;L at expiry"><defs><marker id="straddle-strangle-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs><polygon points="60.0,135.5 60.0,12.7 64.3,15.4 68.6,18.0 72.9,20.7 77.2,23.4 81.5,26.1 85.8,28.8 90.1,31.5 94.4,34.2 98.7,36.9 103.0,39.5 107.3,42.2 111.6,44.9 115.9,47.6 120.2,50.3 124.5,53.0 128.8,55.7 133.0,58.4 137.3,61.0 141.6,63.7 145.9,66.4 150.2,69.1 154.5,71.8 158.8,74.5 163.1,77.2 167.4,79.9 171.7,82.5 176.0,85.2 180.3,87.9 184.6,90.6 188.9,93.3 193.2,96.0 197.5,98.7 201.8,101.4 206.1,104.0 210.4,106.7 214.7,109.4 219.0,112.1 223.3,114.8 227.6,117.5 231.9,120.2 236.2,122.9 240.5,125.5 244.8,128.2 249.1,130.9 253.4,133.6 256.4,135.5 256.4,135.5" class="fx-area-ok"/><polygon points="256.4,135.5 256.4,135.5 257.7,136.3 262.0,139.0 266.3,141.7 270.5,144.4 274.8,147.0 279.1,149.7 283.4,152.4 287.7,155.1 292.0,157.8 296.3,160.5 300.6,163.2 304.9,165.9 309.2,168.5 313.5,171.2 317.8,173.9 322.1,176.6 326.4,179.3 330.7,182.0 335.0,184.7 339.3,182.0 343.6,179.3 347.9,176.6 352.2,173.9 356.5,171.2 360.8,168.5 365.1,165.9 369.4,163.2 373.7,160.5 378.0,157.8 382.3,155.1 386.6,152.4 390.9,149.7 395.2,147.0 399.5,144.4 403.8,141.7 408.0,139.0 412.3,136.3 413.6,135.5 413.6,135.5" class="fx-area-bad"/><polygon points="413.6,135.5 413.6,135.5 416.6,133.6 420.9,130.9 425.2,128.2 429.5,125.5 433.8,122.9 438.1,120.2 442.4,117.5 446.7,114.8 451.0,112.1 455.3,109.4 459.6,106.7 463.9,104.0 468.2,101.4 472.5,98.7 476.8,96.0 481.1,93.3 485.4,90.6 489.7,87.9 494.0,85.2 498.3,82.5 502.6,79.9 506.9,77.2 511.2,74.5 515.5,71.8 519.8,69.1 524.1,66.4 528.4,63.7 532.7,61.0 537.0,58.4 541.3,55.7 545.5,53.0 549.8,50.3 554.1,47.6 558.4,44.9 562.7,42.2 567.0,39.5 571.3,36.9 575.6,34.2 579.9,31.5 584.2,28.8 588.5,26.1 592.8,23.4 597.1,20.7 601.4,18.0 605.7,15.4 610.0,12.7 610.0,135.5" class="fx-area-ok"/><line x1="163.1" y1="28.0" x2="163.1" y2="200.0" class="fx-grid"/><line x1="249.1" y1="28.0" x2="249.1" y2="200.0" class="fx-grid"/><line x1="335.0" y1="28.0" x2="335.0" y2="200.0" class="fx-grid"/><line x1="420.9" y1="28.0" x2="420.9" y2="200.0" class="fx-grid"/><line x1="506.9" y1="28.0" x2="506.9" y2="200.0" class="fx-grid"/><line x1="55.0" y1="135.5" x2="620.0" y2="135.5" class="fx-axis" marker-end="url(#straddle-strangle-ah)"/><polyline points="60.0,30.4 64.3,33.1 68.6,35.8 72.9,38.4 77.2,41.1 81.5,43.8 85.8,46.5 90.1,49.2 94.4,51.9 98.7,54.6 103.0,57.3 107.3,59.9 111.6,62.6 115.9,65.3 120.2,68.0 124.5,70.7 128.8,73.4 133.0,76.1 137.3,78.8 141.6,81.4 145.9,84.1 150.2,86.8 154.5,89.5 158.8,92.2 163.1,94.9 167.4,97.6 171.7,100.3 176.0,102.9 180.3,105.6 184.6,108.3 188.9,111.0 193.2,113.7 197.5,116.4 201.8,119.1 206.1,121.8 210.4,124.4 214.7,127.1 219.0,129.8 223.3,132.5 227.6,135.2 231.9,137.9 236.2,140.6 240.5,143.3 244.8,145.9 249.1,148.6 253.4,148.6 257.7,148.6 262.0,148.6 266.3,148.6 270.5,148.6 274.8,148.6 279.1,148.6 283.4,148.6 287.7,148.6 292.0,148.6 296.3,148.6 300.6,148.6 304.9,148.6 309.2,148.6 313.5,148.6 317.8,148.6 322.1,148.6 326.4,148.6 330.7,148.6 335.0,148.6 339.3,148.6 343.6,148.6 347.9,148.6 352.2,148.6 356.5,148.6 360.8,148.6 365.1,148.6 369.4,148.6 373.7,148.6 378.0,148.6 382.3,148.6 386.6,148.6 390.9,148.6 395.2,148.6 399.5,148.6 403.8,148.6 408.0,148.6 412.3,148.6 416.6,148.6 420.9,148.6 425.2,145.9 429.5,143.3 433.8,140.6 438.1,137.9 442.4,135.2 446.7,132.5 451.0,129.8 455.3,127.1 459.6,124.4 463.9,121.8 468.2,119.1 472.5,116.4 476.8,113.7 481.1,111.0 485.4,108.3 489.7,105.6 494.0,102.9 498.3,100.3 502.6,97.6 506.9,94.9 511.2,92.2 515.5,89.5 519.8,86.8 524.1,84.1 528.4,81.4 532.7,78.8 537.0,76.1 541.3,73.4 545.5,70.7 549.8,68.0 554.1,65.3 558.4,62.6 562.7,59.9 567.0,57.3 571.3,54.6 575.6,51.9 579.9,49.2 584.2,46.5 588.5,43.8 592.8,41.1 597.1,38.4 601.4,35.8 605.7,33.1 610.0,30.4" class="fx-line-blue fx-dash"/><polyline points="60.0,12.7 64.3,15.4 68.6,18.0 72.9,20.7 77.2,23.4 81.5,26.1 85.8,28.8 90.1,31.5 94.4,34.2 98.7,36.9 103.0,39.5 107.3,42.2 111.6,44.9 115.9,47.6 120.2,50.3 124.5,53.0 128.8,55.7 133.0,58.4 137.3,61.0 141.6,63.7 145.9,66.4 150.2,69.1 154.5,71.8 158.8,74.5 163.1,77.2 167.4,79.9 171.7,82.5 176.0,85.2 180.3,87.9 184.6,90.6 188.9,93.3 193.2,96.0 197.5,98.7 201.8,101.4 206.1,104.0 210.4,106.7 214.7,109.4 219.0,112.1 223.3,114.8 227.6,117.5 231.9,120.2 236.2,122.9 240.5,125.5 244.8,128.2 249.1,130.9 253.4,133.6 257.7,136.3 262.0,139.0 266.3,141.7 270.5,144.4 274.8,147.0 279.1,149.7 283.4,152.4 287.7,155.1 292.0,157.8 296.3,160.5 300.6,163.2 304.9,165.9 309.2,168.5 313.5,171.2 317.8,173.9 322.1,176.6 326.4,179.3 330.7,182.0 335.0,184.7 339.3,182.0 343.6,179.3 347.9,176.6 352.2,173.9 356.5,171.2 360.8,168.5 365.1,165.9 369.4,163.2 373.7,160.5 378.0,157.8 382.3,155.1 386.6,152.4 390.9,149.7 395.2,147.0 399.5,144.4 403.8,141.7 408.0,139.0 412.3,136.3 416.6,133.6 420.9,130.9 425.2,128.2 429.5,125.5 433.8,122.9 438.1,120.2 442.4,117.5 446.7,114.8 451.0,112.1 455.3,109.4 459.6,106.7 463.9,104.0 468.2,101.4 472.5,98.7 476.8,96.0 481.1,93.3 485.4,90.6 489.7,87.9 494.0,85.2 498.3,82.5 502.6,79.9 506.9,77.2 511.2,74.5 515.5,71.8 519.8,69.1 524.1,66.4 528.4,63.7 532.7,61.0 537.0,58.4 541.3,55.7 545.5,53.0 549.8,50.3 554.1,47.6 558.4,44.9 562.7,42.2 567.0,39.5 571.3,36.9 575.6,34.2 579.9,31.5 584.2,28.8 588.5,26.1 592.8,23.4 597.1,20.7 601.4,18.0 605.7,15.4 610.0,12.7" class="fx-line-thick"/><text x="163.1" y="218.0" text-anchor="middle" class="fx-t-sm">90</text><text x="249.1" y="218.0" text-anchor="middle" class="fx-t-sm">95</text><text x="335.0" y="218.0" text-anchor="middle" class="fx-t-sm">100</text><text x="420.9" y="218.0" text-anchor="middle" class="fx-t-sm">105</text><text x="506.9" y="218.0" text-anchor="middle" class="fx-t-sm">110</text><text x="610.0" y="238.0" text-anchor="end" class="fx-t-sm">XYZ price at expiry</text><circle cx="256.4" cy="135.5" r="4.5" class="fx-fill-ink"/><circle cx="413.6" cy="135.5" r="4.5" class="fx-fill-ink"/><circle cx="228.1" cy="135.5" r="4" class="fx-fill-blue"/><circle cx="441.9" cy="135.5" r="4" class="fx-fill-blue"/><text x="250.4" y="108" text-anchor="end" class="fx-t-b">95.43</text><text x="421" y="108" class="fx-t-b">104.57</text><text x="224.1" y="153.5" text-anchor="end" class="fx-t-blue">93.78</text><text x="445.9" y="153.5" class="fx-t-blue">106.22</text><text x="335.0" y="202.7" text-anchor="middle" class="fx-t-b">straddle: max loss 4.57 at 100</text><line x1="274.8" y1="149.6" x2="225.0" y2="167.8" class="fx-line-muted"/><text x="65.2" y="172.1" class="fx-t-blue">strangle: −1.22 in 95–105</text><text x="65.2" y="192.5" class="fx-t-sm">vertical: P&amp;L per share ($)</text><text x="77.2" y="125.8" class="fx-t-ok">profit either way</text></svg>
<figcaption>Figure 1 · Straddle (solid) and strangle (dashed) at expiry, per share. The straddle's worst point is exactly at the strike (−4.57); the strangle loses its whole 1.22 anywhere between 95 and 105 but needs a bigger move to break even (93.78 / 106.22 versus 95.43 / 104.57).</figcaption>
</figure>

Now the key turn. Where does $4.57 come from? In [[implied-vol]] we met the rule of thumb that an at-the-money straddle costs about 0.8 of a one-standard-deviation move: XYZ's 30-day 1σ move is \(100 \times 0.20 \times \sqrt{30/365} = \$5.73\), and \(0.8 \times 5.73 \approx 4.57\). **The straddle's price *is* the market's expected absolute move.** Buying it at $4.57 means "I think the move will be bigger than $4.57 on average". Selling it means "smaller".

That is why a straddle is the purest volatility trade there is. Direction drops out; only the gap between the volatility you **pay for** (implied, 20% here) and the volatility that **actually happens** (realized) decides the result.

> [!THINK] XYZ really does jump 4% on earnings day. Did Kai's straddle make money?
> Predict before opening the answer.
> ---
> Probably not. A 4% jump takes XYZ to 104 or 96 — still inside the 95.43–104.57 breakevens at expiry. And if the market had priced an even bigger move before the event, implied vol collapses after the news (the “IV crush”, see [[earnings-events]]), so the options also lose value that way. A big move is not enough; it has to be bigger than the one you paid for.

We'll take it in five parts:

- **① Anatomy: straddle and strangle payoffs, breakevens, costs**
- **② The price of a move: implied versus realized**
- **③ Long gamma, short theta: the daily contest**
- **④ Two ways to cash realized vol: hold or hedge**
- **⑤ The other side: short straddles and strangles (state of play 2026)**

## @mechanics
### ① Anatomy: straddle and strangle payoffs, breakevens, costs

A **long straddle** is one call plus one put at the same strike \(K\) and expiry. With total premium \(D = c + p\), the P&L at expiry per share is

$$
\Pi(S_T) = \max(S_T - K, 0) + \max(K - S_T, 0) - D = |S_T - K| - D
$$

where \(S_T\) is the price at expiry and \(|S_T - K|\) is simply the distance from the strike. The two breakevens are \(K - D\) and \(K + D\); the maximum loss is \(D\), at \(S_T = K\); the upside is open on the call side and capped at \(K - D\) on the put side (the stock can't fall below zero).

A **long strangle** uses a put strike \(K_P\) below spot and a call strike \(K_C\) above:

$$
\begin{gathered}\Pi(S_T) = \max(K_P - S_T, 0) + \max(S_T - K_C, 0) - D \\ \text{BE} = K_P - D \ \text{ and } \ K_C + D\end{gathered}
$$

> [!EXAMPLE] XYZ, 30 days, σ = 20%, r = 4%
> Straddle: \(D = 2.45 + 2.12 = 4.57\); breakevens \(100 \mp 4.57 = 95.43\) and \(104.57\); maximum loss \(4.57 \times 100 = \$457\).
> Strangle 95/105: \(D = 0.51 + 0.71 = 1.22\); breakevens \(95 - 1.22 = 93.78\) and \(105 + 1.22 = 106.22\); maximum loss \(\$122\).
> The strangle costs about a quarter as much, but XYZ must travel 6.2% instead of 4.6% before it pays.

| 30-day XYZ | Straddle 100 | Strangle 95/105 |
|---|---|---|
| Cost per share | 4.57 | 1.22 |
| Breakevens | 95.43 / 104.57 | 93.78 / 106.22 |
| Risk-neutral P(finishing beyond a breakeven) | 42.5% | 27.8% |
| Δ / Γ | +0.068 / 0.139 | +0.059 / 0.095 |
| Θ per day / vega per vol point | −0.076 / +0.228 | −0.053 / +0.156 |

The small positive delta is not a view: with r = 4% the forward (100.33) sits above the strike, so the call is slightly more in the money than the put. Traders who want zero delta buy a few puts more, or strike the straddle at the forward.

### ② The price of a move: implied versus realized

For an at-the-money straddle there is a clean approximation. The expected distance of a normal variable from its centre is \(\sqrt{2/\pi} \approx 0.8\) standard deviations, so

$$
\text{Straddle}_{\text{ATM}} \approx \sqrt{\tfrac{2}{\pi}}\; S\,\sigma_{\text{imp}}\sqrt{T} \approx 0.8\,S\,\sigma_{\text{imp}}\sqrt{T}
$$

where \(\sigma_{\text{imp}}\) is the implied vol you pay. The same logic tells you what you **collect**: if the stock actually moves with realized vol \(\sigma_{\text{real}}\), the expected payoff at expiry is about \(0.8\,S\,\sigma_{\text{real}}\sqrt{T}\). Subtract the two and the expected profit is

$$
\E[\Pi] \approx 0.8\,S\sqrt{T}\,\big(\sigma_{\text{real}} - \sigma_{\text{imp}}\big)
$$

In words: **each vol point of realized-over-implied is worth about \(0.8 \times 100 \times 0.287 / 100 \approx \$0.23\) per share** — which is just the straddle's vega (0.228). A straddle is a bet on one number, \(\sigma_{\text{real}} - \sigma_{\text{imp}}\).

> [!EXAMPLE] Kai's straddle under three realized vols (30 days, exact expectations)
> Paying 4.57 (implied 20%), with real-world drift 4%; carried to expiry, the premium is worth 4.59:
> - realized 30%: expected payoff at expiry ≈ 6.88 → **+2.29** per share; the approximation \(0.8 \times 100 \times 0.287 \times 0.10 \approx +2.29\) is almost exact;
> - realized 20%: expected payoff ≈ 4.59 → **0** (you paid a fair price);
> - realized 15%: expected payoff ≈ 3.45 → **−1.14** per share.
>
> Even at 30% realized, the chance of finishing beyond a breakeven is only about 59%. Winning on average is not the same as winning often.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Price distributions under implied and realized volatility"><polygon points="40.0,200.0 40.0,199.7 42.7,199.7 45.5,199.6 48.2,199.6 51.0,199.5 53.7,199.4 56.4,199.4 59.2,199.3 61.9,199.2 64.7,199.1 67.4,199.0 70.1,198.8 72.9,198.7 75.6,198.6 78.4,198.4 81.1,198.2 83.8,198.0 86.6,197.8 89.3,197.6 92.1,197.3 94.8,197.0 97.5,196.7 100.3,196.4 103.0,196.1 105.8,195.7 108.5,195.3 111.3,194.8 114.0,194.4 116.7,193.9 119.5,193.3 122.2,192.7 125.0,192.1 127.7,191.5 130.4,190.8 133.2,190.1 135.9,189.3 138.7,188.5 141.4,187.6 144.1,186.7 146.9,185.8 149.6,184.8 152.4,183.7 155.1,182.6 157.8,181.5 160.6,180.3 163.3,179.1 166.1,177.8 168.8,176.4 171.5,175.1 174.3,173.6 177.0,172.2 179.8,170.7 182.5,169.1 185.2,167.5 188.0,165.9 190.7,164.2 193.5,162.5 196.2,160.7 198.9,159.0 201.7,157.1 204.4,155.3 207.2,153.5 209.9,151.6 212.6,149.7 215.4,147.8 218.1,145.9 220.9,143.9 223.6,142.0 226.3,140.1 229.1,138.2 231.8,136.2 234.6,134.3 237.3,132.5 240.0,130.6 242.8,128.8 245.5,126.9 248.3,125.2 251.0,123.4 253.8,121.7 256.5,120.1 259.2,118.5 262.0,116.9 264.7,115.4 267.5,113.9 270.2,112.6 272.9,111.2 272.9,200.0" class="fx-area-ok"/><polygon points="377.1,200.0 377.1,118.5 379.8,120.0 382.5,121.5 385.3,123.0 388.0,124.5 390.8,126.0 393.5,127.6 396.3,129.2 399.0,130.8 401.7,132.4 404.5,134.0 407.2,135.6 410.0,137.2 412.7,138.9 415.4,140.5 418.2,142.1 420.9,143.7 423.7,145.3 426.4,146.9 429.1,148.5 431.9,150.0 434.6,151.6 437.4,153.1 440.1,154.6 442.8,156.1 445.6,157.5 448.3,159.0 451.1,160.4 453.8,161.8 456.5,163.1 459.3,164.5 462.0,165.8 464.8,167.1 467.5,168.3 470.2,169.5 473.0,170.7 475.7,171.9 478.5,173.0 481.2,174.1 483.9,175.2 486.7,176.2 489.4,177.2 492.2,178.2 494.9,179.1 497.6,180.0 500.4,180.9 503.1,181.8 505.9,182.6 508.6,183.4 511.3,184.2 514.1,184.9 516.8,185.6 519.6,186.3 522.3,187.0 525.0,187.6 527.8,188.2 530.5,188.8 533.3,189.3 536.0,189.9 538.8,190.4 541.5,190.9 544.2,191.4 547.0,191.8 549.7,192.3 552.5,192.7 555.2,193.1 557.9,193.4 560.7,193.8 563.4,194.1 566.2,194.5 568.9,194.8 571.6,195.1 574.4,195.3 577.1,195.6 579.9,195.9 582.6,196.1 585.3,196.3 588.1,196.5 590.8,196.7 593.6,196.9 596.3,197.1 599.0,197.3 601.8,197.5 604.5,197.6 607.3,197.8 610.0,197.9 610.0,200.0" class="fx-area-ok"/><line x1="35.0" y1="200.0" x2="620.0" y2="200.0" class="fx-axis"/><polyline points="40.0,200.0 42.7,200.0 45.5,200.0 48.2,200.0 51.0,200.0 53.7,200.0 56.4,200.0 59.2,200.0 61.9,200.0 64.7,200.0 67.4,200.0 70.1,200.0 72.9,200.0 75.6,200.0 78.4,200.0 81.1,200.0 83.8,200.0 86.6,200.0 89.3,200.0 92.1,200.0 94.8,200.0 97.5,200.0 100.3,199.9 103.0,199.9 105.8,199.9 108.5,199.9 111.3,199.9 114.0,199.8 116.7,199.8 119.5,199.8 122.2,199.7 125.0,199.7 127.7,199.6 130.4,199.5 133.2,199.4 135.9,199.3 138.7,199.2 141.4,199.0 144.1,198.8 146.9,198.6 149.6,198.4 152.4,198.1 155.1,197.8 157.8,197.5 160.6,197.1 163.3,196.7 166.1,196.2 168.8,195.6 171.5,195.0 174.3,194.3 177.0,193.5 179.8,192.6 182.5,191.7 185.2,190.6 188.0,189.5 190.7,188.2 193.5,186.8 196.2,185.3 198.9,183.7 201.7,181.9 204.4,180.1 207.2,178.0 209.9,175.9 212.6,173.6 215.4,171.1 218.1,168.5 220.9,165.7 223.6,162.8 226.3,159.8 229.1,156.6 231.8,153.3 234.6,149.8 237.3,146.3 240.0,142.6 242.8,138.8 245.5,134.9 248.3,130.9 251.0,126.9 253.8,122.8 256.5,118.7 259.2,114.5 262.0,110.3 264.7,106.2 267.5,102.1 270.2,98.0 272.9,94.0 275.7,90.0 278.4,86.2 281.2,82.5 283.9,78.9 286.6,75.5 289.4,72.2 292.1,69.2 294.9,66.3 297.6,63.7 300.3,61.3 303.1,59.1 305.8,57.2 308.6,55.6 311.3,54.2 314.0,53.2 316.8,52.3 319.5,51.8 322.3,51.6 325.0,51.6 327.7,52.0 330.5,52.6 333.2,53.4 336.0,54.6 338.7,56.0 341.4,57.6 344.2,59.5 346.9,61.6 349.7,63.9 352.4,66.4 355.1,69.1 357.9,72.0 360.6,75.0 363.4,78.2 366.1,81.5 368.8,84.9 371.6,88.3 374.3,91.9 377.1,95.5 379.8,99.2 382.5,102.9 385.3,106.6 388.0,110.3 390.8,114.0 393.5,117.7 396.3,121.3 399.0,124.9 401.7,128.5 404.5,132.0 407.2,135.4 410.0,138.7 412.7,142.0 415.4,145.2 418.2,148.2 420.9,151.2 423.7,154.1 426.4,156.8 429.1,159.5 431.9,162.0 434.6,164.5 437.4,166.8 440.1,169.0 442.8,171.1 445.6,173.1 448.3,175.0 451.1,176.8 453.8,178.5 456.5,180.1 459.3,181.6 462.0,183.0 464.8,184.4 467.5,185.6 470.2,186.8 473.0,187.8 475.7,188.9 478.5,189.8 481.2,190.7 483.9,191.5 486.7,192.2 489.4,192.9 492.2,193.5 494.9,194.1 497.6,194.7 500.4,195.2 503.1,195.6 505.9,196.0 508.6,196.4 511.3,196.8 514.1,197.1 516.8,197.4 519.6,197.6 522.3,197.9 525.0,198.1 527.8,198.3 530.5,198.5 533.3,198.6 536.0,198.8 538.8,198.9 541.5,199.0 544.2,199.1 547.0,199.2 549.7,199.3 552.5,199.4 555.2,199.5 557.9,199.5 560.7,199.6 563.4,199.6 566.2,199.7 568.9,199.7 571.6,199.7 574.4,199.8 577.1,199.8 579.9,199.8 582.6,199.8 585.3,199.9 588.1,199.9 590.8,199.9 593.6,199.9 596.3,199.9 599.0,199.9 601.8,199.9 604.5,199.9 607.3,200.0 610.0,200.0" class="fx-line-hl"/><polyline points="40.0,199.7 42.7,199.7 45.5,199.6 48.2,199.6 51.0,199.5 53.7,199.4 56.4,199.4 59.2,199.3 61.9,199.2 64.7,199.1 67.4,199.0 70.1,198.8 72.9,198.7 75.6,198.6 78.4,198.4 81.1,198.2 83.8,198.0 86.6,197.8 89.3,197.6 92.1,197.3 94.8,197.0 97.5,196.7 100.3,196.4 103.0,196.1 105.8,195.7 108.5,195.3 111.3,194.8 114.0,194.4 116.7,193.9 119.5,193.3 122.2,192.7 125.0,192.1 127.7,191.5 130.4,190.8 133.2,190.1 135.9,189.3 138.7,188.5 141.4,187.6 144.1,186.7 146.9,185.8 149.6,184.8 152.4,183.7 155.1,182.6 157.8,181.5 160.6,180.3 163.3,179.1 166.1,177.8 168.8,176.4 171.5,175.1 174.3,173.6 177.0,172.2 179.8,170.7 182.5,169.1 185.2,167.5 188.0,165.9 190.7,164.2 193.5,162.5 196.2,160.7 198.9,159.0 201.7,157.1 204.4,155.3 207.2,153.5 209.9,151.6 212.6,149.7 215.4,147.8 218.1,145.9 220.9,143.9 223.6,142.0 226.3,140.1 229.1,138.2 231.8,136.2 234.6,134.3 237.3,132.5 240.0,130.6 242.8,128.8 245.5,126.9 248.3,125.2 251.0,123.4 253.8,121.7 256.5,120.1 259.2,118.5 262.0,116.9 264.7,115.4 267.5,113.9 270.2,112.6 272.9,111.2 275.7,110.0 278.4,108.8 281.2,107.7 283.9,106.7 286.6,105.7 289.4,104.8 292.1,104.0 294.9,103.3 297.6,102.7 300.3,102.1 303.1,101.7 305.8,101.3 308.6,101.0 311.3,100.8 314.0,100.7 316.8,100.6 319.5,100.7 322.3,100.8 325.0,101.0 327.7,101.3 330.5,101.7 333.2,102.2 336.0,102.7 338.7,103.3 341.4,104.0 344.2,104.8 346.9,105.6 349.7,106.5 352.4,107.5 355.1,108.5 357.9,109.6 360.6,110.7 363.4,111.9 366.1,113.2 368.8,114.4 371.6,115.8 374.3,117.1 377.1,118.5 379.8,120.0 382.5,121.5 385.3,123.0 388.0,124.5 390.8,126.0 393.5,127.6 396.3,129.2 399.0,130.8 401.7,132.4 404.5,134.0 407.2,135.6 410.0,137.2 412.7,138.9 415.4,140.5 418.2,142.1 420.9,143.7 423.7,145.3 426.4,146.9 429.1,148.5 431.9,150.0 434.6,151.6 437.4,153.1 440.1,154.6 442.8,156.1 445.6,157.5 448.3,159.0 451.1,160.4 453.8,161.8 456.5,163.1 459.3,164.5 462.0,165.8 464.8,167.1 467.5,168.3 470.2,169.5 473.0,170.7 475.7,171.9 478.5,173.0 481.2,174.1 483.9,175.2 486.7,176.2 489.4,177.2 492.2,178.2 494.9,179.1 497.6,180.0 500.4,180.9 503.1,181.8 505.9,182.6 508.6,183.4 511.3,184.2 514.1,184.9 516.8,185.6 519.6,186.3 522.3,187.0 525.0,187.6 527.8,188.2 530.5,188.8 533.3,189.3 536.0,189.9 538.8,190.4 541.5,190.9 544.2,191.4 547.0,191.8 549.7,192.3 552.5,192.7 555.2,193.1 557.9,193.4 560.7,193.8 563.4,194.1 566.2,194.5 568.9,194.8 571.6,195.1 574.4,195.3 577.1,195.6 579.9,195.9 582.6,196.1 585.3,196.3 588.1,196.5 590.8,196.7 593.6,196.9 596.3,197.1 599.0,197.3 601.8,197.5 604.5,197.6 607.3,197.8 610.0,197.9" class="fx-line-blue"/><line x1="274.9" y1="34.0" x2="274.9" y2="200.0" class="fx-line fx-dash"/><line x1="375.1" y1="34.0" x2="375.1" y2="200.0" class="fx-line fx-dash"/><text x="105.8" y="216.0" text-anchor="middle" class="fx-t-sm">80</text><text x="215.4" y="216.0" text-anchor="middle" class="fx-t-sm">90</text><text x="325.0" y="216.0" text-anchor="middle" class="fx-t-sm">100</text><text x="434.6" y="216.0" text-anchor="middle" class="fx-t-sm">110</text><text x="544.2" y="216.0" text-anchor="middle" class="fx-t-sm">120</text><text x="274.9" y="28.0" text-anchor="end" class="fx-t-b">BE 95.43</text><text x="375.1" y="28.0" class="fx-t-b">BE 104.57</text><text x="396.3" y="99.7" class="fx-t-hl">implied 20%</text><text x="473.0" y="150.0" class="fx-t-blue">realized 30%</text><text x="40.0" y="238.0" class="fx-t-sm">green: outcomes beyond the breakevens if realized vol is 30%, about 59% (42% at 20%)</text></svg>
<figcaption>Figure 2 · The same breakevens under two worlds. If XYZ moves like its 20% implied vol (blue), about 42% of outcomes land beyond the breakevens; if it really moves at 30% (violet), the distribution spreads and about 59% do (green tails). The straddle's price was set by the orange curve; your profit comes from the gap between the curves.</figcaption>
</figure>

::demo[straddle-strangle-move]

### ③ Long gamma, short theta: the daily contest

Before expiry, the straddle is a Greek profile: **delta near zero, gamma positive, vega positive, theta negative.** Each day the position pays theta — $0.076 per share here — and earns the convexity gain from whatever the stock did. From [[gamma]], a move of \(\Delta S\) earns roughly \(\tfrac12\Gamma(\Delta S)^2\), whichever direction. The day breaks even when

$$
\tfrac12\,\Gamma\,(\Delta S^{*})^2 = |\Theta| \quad\Longrightarrow\quad \Delta S^{*} = \sqrt{\frac{2|\Theta|}{\Gamma}}
$$

where \(\Gamma\) and \(\Theta\) are the straddle's gamma (per $1) and theta (per day), and \(\Delta S^{*}\) is the breakeven daily move.

> [!EXAMPLE] XYZ's breakeven day
> \(\Delta S^{*} = \sqrt{2 \times 0.0762 / 0.1386} \approx \$1.05\) — exactly XYZ's one-day 1σ move at 20% vol, \(100 \times 0.20 / \sqrt{365} \approx 1.05\). That is not a coincidence: the Black-Scholes equation ([[black-scholes]]) sets theta so that a stock moving *exactly* at implied vol leaves a hedged option holder flat. Move more than $1.05 a day on average and the straddle wins; less and theta wins.

<figure>
<svg viewBox="0 0 640 240" role="img" aria-label="One day: gamma gain versus theta cost"><polygon points="70.0,164.6 70.0,33.8 75.1,39.8 80.2,45.6 85.3,51.3 90.4,56.9 95.5,62.4 100.6,67.8 105.7,73.1 110.8,78.2 115.9,83.2 121.0,88.1 126.1,92.9 131.2,97.6 136.3,102.2 141.3,106.6 146.4,110.9 151.5,115.2 156.6,119.3 161.7,123.2 166.8,127.1 171.9,130.9 177.0,134.5 182.1,138.0 187.2,141.4 192.3,144.7 197.4,147.9 202.5,151.0 207.6,153.9 212.7,156.7 217.8,159.5 222.9,162.0 228.0,164.5 228.1,164.6" class="fx-area-ok"/><polygon points="441.9,164.6 442.0,164.5 447.1,162.0 452.2,159.5 457.3,156.7 462.4,153.9 467.5,151.0 472.6,147.9 477.7,144.7 482.8,141.4 487.9,138.0 493.0,134.5 498.1,130.9 503.2,127.1 508.3,123.2 513.4,119.3 518.5,115.2 523.6,110.9 528.7,106.6 533.8,102.2 538.8,97.6 543.9,92.9 549.0,88.1 554.1,83.2 559.2,78.2 564.3,73.1 569.4,67.8 574.5,62.4 579.6,56.9 584.7,51.3 589.8,45.6 594.9,39.8 600.0,33.8 600.0,164.6" class="fx-area-ok"/><polygon points="228.1,164.6 233.1,166.9 238.2,169.2 243.3,171.3 248.4,173.3 253.5,175.2 258.6,177.0 263.7,178.7 268.8,180.2 273.8,181.7 278.9,183.0 284.0,184.2 289.1,185.3 294.2,186.3 299.3,187.2 304.4,187.9 309.5,188.6 314.6,189.1 319.7,189.5 324.8,189.8 329.9,189.9 335.0,190.0 340.1,189.9 345.2,189.8 350.3,189.5 355.4,189.1 360.5,188.6 365.6,187.9 370.7,187.2 375.8,186.3 380.9,185.3 386.0,184.2 391.1,183.0 396.2,181.7 401.3,180.2 406.3,178.7 411.4,177.0 416.5,175.2 421.6,173.3 426.7,171.3 431.8,169.2 436.9,166.9 441.9,164.6" class="fx-area-bad"/><line x1="65.0" y1="190.0" x2="610.0" y2="190.0" class="fx-axis"/><line x1="335.0" y1="190.0" x2="335.0" y2="26.0" class="fx-axis"/><polyline points="70.0,33.8 75.1,39.8 80.2,45.6 85.3,51.3 90.4,56.9 95.5,62.4 100.6,67.8 105.7,73.1 110.8,78.2 115.9,83.2 121.0,88.1 126.1,92.9 131.2,97.6 136.3,102.2 141.3,106.6 146.4,110.9 151.5,115.2 156.6,119.3 161.7,123.2 166.8,127.1 171.9,130.9 177.0,134.5 182.1,138.0 187.2,141.4 192.3,144.7 197.4,147.9 202.5,151.0 207.6,153.9 212.7,156.7 217.8,159.5 222.9,162.0 228.0,164.5 233.1,166.9 238.2,169.2 243.3,171.3 248.4,173.3 253.5,175.2 258.6,177.0 263.7,178.7 268.8,180.2 273.8,181.7 278.9,183.0 284.0,184.2 289.1,185.3 294.2,186.3 299.3,187.2 304.4,187.9 309.5,188.6 314.6,189.1 319.7,189.5 324.8,189.8 329.9,189.9 335.0,190.0 340.1,189.9 345.2,189.8 350.3,189.5 355.4,189.1 360.5,188.6 365.6,187.9 370.7,187.2 375.8,186.3 380.9,185.3 386.0,184.2 391.1,183.0 396.2,181.7 401.3,180.2 406.3,178.7 411.4,177.0 416.5,175.2 421.6,173.3 426.7,171.3 431.8,169.2 436.9,166.9 442.0,164.5 447.1,162.0 452.2,159.5 457.3,156.7 462.4,153.9 467.5,151.0 472.6,147.9 477.7,144.7 482.8,141.4 487.9,138.0 493.0,134.5 498.1,130.9 503.2,127.1 508.3,123.2 513.4,119.3 518.5,115.2 523.6,110.9 528.7,106.6 533.8,102.2 538.8,97.6 543.9,92.9 549.0,88.1 554.1,83.2 559.2,78.2 564.3,73.1 569.4,67.8 574.5,62.4 579.6,56.9 584.7,51.3 589.8,45.6 594.9,39.8 600.0,33.8" class="fx-line-thick"/><line x1="70.0" y1="164.6" x2="600.0" y2="164.6" class="fx-line-bad fx-dash"/><text x="131.2" y="206.0" text-anchor="middle" class="fx-t-sm">−2</text><text x="233.1" y="206.0" text-anchor="middle" class="fx-t-sm">−1</text><text x="335.0" y="206.0" text-anchor="middle" class="fx-t-sm">0</text><text x="436.9" y="206.0" text-anchor="middle" class="fx-t-sm">+1</text><text x="538.8" y="206.0" text-anchor="middle" class="fx-t-sm">+2</text><text x="600.0" y="226.0" text-anchor="end" class="fx-t-sm">XYZ's move that day ($)</text><text x="75.1" y="182" class="fx-t-bad">theta cost 0.076/day</text><text x="540" y="62" text-anchor="end" class="fx-t">gamma gain ½Γ(ΔS)²</text><circle cx="228.1" cy="164.6" r="4.5" class="fx-fill-ink"/><circle cx="441.9" cy="164.6" r="4.5" class="fx-fill-ink"/><text x="449.9" y="180.6" class="fx-t-b">±1.05</text><text x="345" y="142" class="fx-t-sm">under 1.05: net loss</text></svg>
<figcaption>Figure 3 · One day in the life of the straddle. The parabola is the gamma gain \(\tfrac12\Gamma(\Delta S)^2\); the dashed line is the theta cost. Days with a move bigger than about $1.05 either way are green; quiet days are red. Over 30 days, the straddle is the sum of these daily contests.</figcaption>
</figure>

Three practical consequences follow. **Time is expensive late:** theta grows as expiry approaches ([[theta]]) — a 7-day straddle pays about twice as much per day as a 30-day one — so short-dated straddles need their move soon. **Vega adds a second bet:** if implied vol rises one point immediately, the straddle gains about $0.23 even if the stock doesn't move; a five-day-old straddle with XYZ at 106 is worth +$2.35 per share at 20% IV but only +$1.91 if IV has dropped to 15%. **Path matters before expiry:** the same final price can be reached quietly or violently, and only the violent path pays the holder who trades around the position.

### ④ Two ways to cash realized vol: hold or hedge

There are two ways to turn "the stock will move more than 20%" into money.

- **Hold to expiry.** Your payoff is \(|S_T - K|\). Only the *final* distance counts: a stock that swings 3% a day but finishes at 100 pays nothing.
- **Delta-hedge (gamma scalping).** Each day, trade shares to bring the delta back to zero: sell shares after a rise, buy after a fall. You lock in \(\tfrac12\Gamma(\Delta S)^2\) every day instead of waiting for the final price. The P&L then tracks the realized volatility of the whole path, not just its endpoint — this is the engine of [[delta-hedging]]:

$$
\Pi_{\text{hedged}} \approx \sum_{t} \tfrac12\,\Gamma_t\,S_t^2\,\big(\sigma_{\text{real}}^2 - \sigma_{\text{imp}}^2\big)\,\Delta t
$$

where the sum runs over the hedging intervals \(\Delta t\), and \(\Gamma_t\), \(S_t\) are the gamma and the price at each step.

> [!EXAMPLE] Same average, very different spread (the main demo below, default seed)
> Straddle bought at 20% implied, XYZ realizes 30%:
> - held to expiry (4,000 paths): mean **+2.43** per share, standard deviation **5.35**, profitable in about 60% of paths;
> - hedged daily (1,200 paths): mean **+2.37**, standard deviation **1.50**, profitable in about 99% of paths.
>
> At 15% realized the picture flips: hedged, the straddle loses about 1.12 per share in about 98% of paths. Hedging doesn't change *what* you bet on (\(\sigma_{\text{real}}\) versus \(\sigma_{\text{imp}}\)); it removes most of the luck of *where the stock happens to finish*.

The main demo below lets you run both.

### ⑤ The other side: short straddles and strangles (state of play 2026)

Every straddle has a seller. The **short straddle** collects $4.57 and wins if XYZ stays between 95.43 and 104.57; the **short strangle** collects $1.22 and wins between 93.78 and 106.22. Their Greeks are the mirror image: short gamma, short vega, positive theta — the seller earns $0.076 a day as long as the stock moves less than about $1.05 a day.

Why sell? Because on average, for broad indexes, implied vol has sat above the volatility that followed. As of mid-2024, from 1990 to about 2024 the VIX averaged about 19.6% while subsequent 30-day realized S&P 500 volatility averaged about 15.5% — a gap of roughly 4 vol points, the **variance risk premium** ([[variance-risk-premium]]). The gap is an average, not a promise: it turns sharply negative in crashes.

> [!WARN] The seller's loss is not capped
> If XYZ falls 15% to 85, the short straddle loses \(15 - 4.57 = 10.43\) per share (−$1,043) and the short strangle \(10 - 1.22 = 8.78\) (−$878) — seven times what the strangle could ever earn. A gap through a weekend or an earnings report arrives all at once, with no chance to adjust. Wings that cap this loss turn the short strangle into the iron condor of [[iron-condor]].

> [!HISTORY] 5 February 2018, “Volmageddon”
> The VIX rose 20.01 points (+115.6%) in a day to close at 37.32, its largest one-day percentage rise, while the S&P 500 fell about 4%. XIV, an exchange-traded note that was effectively short VIX futures (about $1.9 billion in assets the prior Friday), lost about 96% and was terminated. Years of small, steady short-volatility gains were given back in one session.

The long straddle's own risk is quieter: it bleeds. With realized vol below implied — the usual state for indexes — a buyer who rolls straddles month after month pays the variance risk premium every month. Straddle buyers need a specific reason to expect more movement than the market is pricing; that is exactly the analysis of [[earnings-events]].

## @analogy
A straddle is like **buying a ticket in a guess-the-distance contest** at a county fair. A strongman will throw a hammer; the organiser publishes a "par" distance of 4.57 metres, and the ticket pays one dollar for every metre the throw lands beyond par — in either direction along the field, forward or backward, as long as it's far from the line. The ticket costs exactly what the organiser expects to pay out, so it only makes sense if you know something the organiser doesn't: that this strongman is stronger than usual (realized vol above implied).

The ticket seller is the house. Most throws land near par, so the house usually keeps the money. But once in a while the hammer flies off the field entirely, and the house pays for all of the quiet days at once.

Gamma scalping is watching every practice throw and collecting as you go, instead of betting only on the final one.

Where the analogy breaks: the fair's par is fixed, but the market's par — implied vol — moves every second. You can profit or lose on a straddle without any throw at all, just because the organiser raises or lowers par (vega).

## @misconceptions
- **“A straddle profits whenever the stock makes a big move.”** — It profits when the move is bigger than the one priced in. XYZ's 30-day straddle needs more than a 4.57% move by expiry; a 4% earnings jump still loses.
- **“A strangle is the cheaper, better straddle.”** — It is cheaper because it wins less often: 27.8% versus 42.5% chance of finishing beyond a breakeven at fair vol. It is a different bet — on a bigger move — not a discount on the same one.
- **“Selling straddles is safe because most of them expire profitably.”** — A high win rate paired with an unbounded loss is the classic short-volatility profile: a −15% day costs the short strangle seven times its maximum gain.
- **“Delta-hedging a straddle removes its risk.”** — It removes the direction risk and most of the path luck, leaving a clean bet on realized versus implied vol. If realized comes in below implied, the hedged straddle loses almost surely.
- **“The straddle's positive delta means it is bullish.”** — The +0.07 is a carry effect of r = 4% (the forward is above spot), not a view; it is usually hedged away.

## @takeaways
- A straddle's payoff is \(|S_T - K| - D\): no direction, only distance; a strangle trades a lower cost for wider breakevens.
- The at-the-money straddle costs about \(0.8\,S\sigma_{\text{imp}}\sqrt{T}\) — it *is* the market's expected move, so buying it bets that realized vol will beat implied vol.
- Long straddle = long gamma, long vega, short theta; the breakeven daily move is \(\sqrt{2|\Theta|/\Gamma}\), which equals the implied one-day move ($1.05 for XYZ).
- Holding bets on the final distance; delta-hedging bets on the realized vol of the whole path, with far less dispersion.
- Short straddles and strangles harvest the average variance risk premium but carry unbounded, gap-prone losses.

## @quiz
1. XYZ's 30-day 100 straddle costs $4.57. Where must XYZ finish for the buyer to profit at expiry?
   - [ ] Anywhere above $100
   - [x] Below $95.43 or above $104.57
   - [ ] Below $97.72 or above $102.29
   - [ ] Below $95 or above $105
   > The breakevens are \(K \mp D = 100 \mp 4.57\). Splitting the premium in half (97.72/102.29) forgets that only one leg pays at expiry; 95/105 are the strangle's strikes, not a straddle's breakevens.
2. A trader buys the XYZ straddle at 20% implied vol and holds it to expiry. Which outcome best describes the expected profit if XYZ realizes 30% volatility?
   - [ ] Zero, because the straddle is delta-neutral
   - [ ] About +$10 per share, because vol rose by 10 points
   - [x] About +$2.3 per share, roughly \(0.8\,S\sqrt{T}\) times the 10-point gap
   - [ ] Negative, because theta always wins
   > \(\E[\Pi] \approx 0.8 \times 100 \times 0.287 \times 0.10 \approx 2.3\) — the straddle's vega times the vol gap. Delta-neutral means no direction bet, not no vol bet.
3. The straddle has \(\Gamma = 0.139\) and \(\Theta = -0.076\) per day. How big must XYZ's daily move be for a day to break even?
   - [ ] About $0.55
   - [x] About $1.05
   - [ ] About $4.57
   - [ ] About $0.08
   > \(\sqrt{2 \times 0.076 / 0.139} \approx 1.05\), which equals the one-day 1σ move at 20% implied vol (\(100 \times 0.2/\sqrt{365}\)).
4. Why does a daily delta-hedged straddle have a much narrower spread of outcomes than one simply held to expiry?
   - [x] Hedging collects the gamma gain every day, so the P&L tracks the realized vol of the whole path instead of the final price
   - [ ] Hedging removes vega risk
   - [ ] Hedging turns the straddle into a strangle
   - [ ] Hedging earns the risk-free rate on the premium
   > The hedged P&L is approximately \(\sum \tfrac12\Gamma S^2(\sigma_{\text{real}}^2 - \sigma_{\text{imp}}^2)\Delta t\): it depends on how much the stock moved along the way, not where it ended.
5. Which statement about the short XYZ strangle (sell the 95 put and 105 call for $1.22) is correct?
   - [ ] Its maximum loss is $122 per pair of contracts
   - [ ] It profits only if XYZ moves more than 6.2%
   - [ ] It is long vega, so it gains if implied vol rises
   - [x] It wins between 93.78 and 106.22, but a fall to 85 costs about $878 per pair of contracts
   > Short options have unbounded or very large losses: at 85 the put pays \(10\), so the seller loses \(10 - 1.22 = 8.78\) per share. $122 is the *most it can earn*.

## @further
- [Straddle (Wikipedia)](https://en.wikipedia.org/wiki/Straddle) — definitions, payoff and the long/short variants.
- [Strangle (Wikipedia)](https://en.wikipedia.org/wiki/Strangle_%28options%29) — the out-of-the-money cousin and how it compares.
- [How well does the market predict volatility? (CFA Institute, 2024)](https://blogs.cfainstitute.org/investor/2024/07/31/how-well-does-the-market-predict-volatility/) — VIX versus subsequent realized volatility since 1990.
- [Carr & Wu (2009), Variance Risk Premiums](https://academic.oup.com/rfs/article-abstract/22/3/1311/1581057) — the academic evidence that index variance is systematically overpriced.
- [BIS Quarterly Review, March 2018: the February volatility spike](https://www.bis.org/publ/qtrpdf/r_qt1803t.htm) — what happened to short-volatility products in Volmageddon.

## @next
A short strangle harvests the premium but leaves the tails naked. What if you buy cheap options further out to cap the loss? The next lesson builds the iron condor — renting out a price range with a known worst case — and asks what the "70% win rate" really costs.
