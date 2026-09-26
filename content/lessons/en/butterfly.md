---
id: butterfly
prereqs: payoff-lego, arbitrage-bounds, risk-neutral-density, iron-condor
demo: butterfly
---

# Butterflies: Betting on Where Price Lands

## @hook
For $163 a butterfly pays up to $500 if XYZ finishes exactly at $100 in a month, and loses at most its cost. It looks like a cheap lottery ticket on a price. It is something deeper: the price of a butterfly is, almost exactly, the market's probability that the stock lands in that spot.

## @bridge
[[iron-condor]] rented out a wide range for a small credit. Squeeze the two short strikes together and the flat top becomes a sharp peak: that is the butterfly. It is also the "brick" we met in [[payoff-lego]] — the smallest piece from which any payoff can be built — and in [[risk-neutral-density]] we saw that a stack of those bricks traces the market's distribution. This lesson answers: **how does a bet on a landing zone work, what is it really worth, and why does it pay only at the very end?** It builds Idea ① (a shape made of three strikes) and Idea ③ (a view on the distribution, not the direction).

## @intuition
Picture a dartboard where only the bullseye area pays. You throw one dart at the price axis and aim at 100. Hit exactly 100 and you win the most; land 3 dollars away and you win less; land more than 5 away and you lose your small stake.

> [!KAI] Kai's landing-zone hunch
> Kai notices that XYZ has spent weeks bouncing between 97 and 103 and suspects it will still be near 100 in a month. A straddle would be the wrong way round (it needs movement); an iron condor pays the same whether XYZ ends at 96 or 104. Kai wants a trade that pays **most** if XYZ lands close to 100.
> For illustration (30 days, σ = 20%, r = 4%), Kai buys one 95 call (5.82), sells two 100 calls (2.45 each) and buys one 105 call (0.71): cost \(5.82 - 2 \times 2.45 + 0.71 = 1.63\) per share, **$163**.

At expiry this "long call butterfly" behaves like a tent:

- below 95 every call is worthless → Kai loses the $163;
- from 95 to 100 the long 95 call gains a dollar per dollar → the tent rises;
- at 100 it pays \(5\) → **+$337** after the cost;
- from 100 to 105 the two short calls take it back → the tent falls;
- above 105 everything cancels → Kai again loses $163.

The breakevens are 96.63 and 103.37: Kai wins if XYZ ends within about 3.4 dollars of 100.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="The butterfly tent and its curves before expiry"><defs><marker id="butterfly-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs><polygon points="60.0,133.7 60.0,179.9 62.9,179.9 65.7,179.9 68.6,179.9 71.5,179.9 74.3,179.9 77.2,179.9 80.1,179.9 82.9,179.9 85.8,179.9 88.6,179.9 91.5,179.9 94.4,179.9 97.2,179.9 100.1,179.9 103.0,179.9 105.8,179.9 108.7,179.9 111.6,179.9 114.4,179.9 117.3,179.9 120.2,179.9 123.0,179.9 125.9,179.9 128.8,179.9 131.6,179.9 134.5,179.9 137.3,179.9 140.2,179.9 143.1,179.9 145.9,179.9 148.8,179.9 151.7,179.9 154.5,179.9 157.4,179.9 160.3,179.9 163.1,179.9 166.0,179.9 168.9,179.9 171.7,179.9 174.6,179.9 177.4,179.9 180.3,179.9 183.2,179.9 186.0,179.9 188.9,179.9 191.8,179.9 194.6,179.9 197.5,179.9 200.4,179.9 203.2,179.9 206.1,179.9 209.0,179.9 211.8,179.9 214.7,179.9 217.6,179.9 220.4,179.9 223.3,176.3 226.1,172.8 229.0,169.3 231.9,165.7 234.7,162.2 237.6,158.6 240.5,155.1 243.3,151.5 246.2,148.0 249.1,144.5 251.9,140.9 254.8,137.4 257.7,133.8 257.8,133.7 257.8,133.7" class="fx-area-bad"/><polygon points="257.8,133.7 257.8,133.7 260.5,130.3 263.4,126.8 266.3,123.2 269.1,119.7 272.0,116.1 274.8,112.6 277.7,109.0 280.6,105.5 283.4,102.0 286.3,98.4 289.2,94.9 292.0,91.3 294.9,87.8 297.8,84.3 300.6,80.7 303.5,77.2 306.4,73.6 309.2,70.1 312.1,66.5 314.9,63.0 317.8,59.5 320.7,55.9 323.5,52.4 326.4,48.8 329.3,45.3 332.1,41.8 335.0,38.2 337.9,41.8 340.7,45.3 343.6,48.8 346.5,52.4 349.3,55.9 352.2,59.5 355.1,63.0 357.9,66.5 360.8,70.1 363.6,73.6 366.5,77.2 369.4,80.7 372.2,84.3 375.1,87.8 378.0,91.3 380.8,94.9 383.7,98.4 386.6,102.0 389.4,105.5 392.3,109.0 395.2,112.6 398.0,116.1 400.9,119.7 403.8,123.2 406.6,126.8 409.5,130.3 412.2,133.7 412.2,133.7" class="fx-area-ok"/><polygon points="412.2,133.7 412.2,133.7 412.3,133.8 415.2,137.4 418.1,140.9 420.9,144.5 423.8,148.0 426.7,151.5 429.5,155.1 432.4,158.6 435.3,162.2 438.1,165.7 441.0,169.3 443.9,172.8 446.7,176.3 449.6,179.9 452.4,179.9 455.3,179.9 458.2,179.9 461.0,179.9 463.9,179.9 466.8,179.9 469.6,179.9 472.5,179.9 475.4,179.9 478.2,179.9 481.1,179.9 484.0,179.9 486.8,179.9 489.7,179.9 492.6,179.9 495.4,179.9 498.3,179.9 501.1,179.9 504.0,179.9 506.9,179.9 509.7,179.9 512.6,179.9 515.5,179.9 518.3,179.9 521.2,179.9 524.1,179.9 526.9,179.9 529.8,179.9 532.7,179.9 535.5,179.9 538.4,179.9 541.3,179.9 544.1,179.9 547.0,179.9 549.8,179.9 552.7,179.9 555.6,179.9 558.4,179.9 561.3,179.9 564.2,179.9 567.0,179.9 569.9,179.9 572.8,179.9 575.6,179.9 578.5,179.9 581.4,179.9 584.2,179.9 587.1,179.9 589.9,179.9 592.8,179.9 595.7,179.9 598.5,179.9 601.4,179.9 604.3,179.9 607.1,179.9 610.0,179.9 610.0,133.7" class="fx-area-bad"/><line x1="105.8" y1="26.0" x2="105.8" y2="196.0" class="fx-grid"/><line x1="220.4" y1="26.0" x2="220.4" y2="196.0" class="fx-grid"/><line x1="335.0" y1="26.0" x2="335.0" y2="196.0" class="fx-grid"/><line x1="449.6" y1="26.0" x2="449.6" y2="196.0" class="fx-grid"/><line x1="564.2" y1="26.0" x2="564.2" y2="196.0" class="fx-grid"/><line x1="55.0" y1="133.7" x2="620.0" y2="133.7" class="fx-axis" marker-end="url(#butterfly-ah)"/><polyline points="60.0,179.5 65.7,179.5 71.5,179.3 77.2,179.2 82.9,179.0 88.6,178.8 94.4,178.6 100.1,178.3 105.8,177.9 111.6,177.5 117.3,177.0 123.0,176.4 128.8,175.7 134.5,175.0 140.2,174.1 145.9,173.1 151.7,172.0 157.4,170.8 163.1,169.4 168.9,167.9 174.6,166.2 180.3,164.4 186.0,162.5 191.8,160.4 197.5,158.1 203.2,155.8 209.0,153.3 214.7,150.7 220.4,148.0 226.1,145.2 231.9,142.4 237.6,139.5 243.3,136.6 249.1,133.7 254.8,130.8 260.5,128.0 266.3,125.3 272.0,122.7 277.7,120.2 283.4,117.9 289.2,115.8 294.9,113.9 300.6,112.2 306.4,110.8 312.1,109.6 317.8,108.7 323.5,108.1 329.3,107.8 335.0,107.8 340.7,108.0 346.5,108.6 352.2,109.4 357.9,110.5 363.6,111.8 369.4,113.4 375.1,115.2 380.8,117.2 386.6,119.3 392.3,121.6 398.0,124.1 403.8,126.6 409.5,129.2 415.2,131.9 420.9,134.6 426.7,137.2 432.4,139.9 438.1,142.6 443.9,145.2 449.6,147.7 455.3,150.2 461.0,152.6 466.8,154.8 472.5,157.0 478.2,159.1 484.0,161.0 489.7,162.8 495.4,164.5 501.1,166.1 506.9,167.6 512.6,168.9 518.3,170.2 524.1,171.3 529.8,172.3 535.5,173.2 541.3,174.1 547.0,174.8 552.7,175.5 558.4,176.1 564.2,176.6 569.9,177.0 575.6,177.5 581.4,177.8 587.1,178.1 592.8,178.4 598.5,178.6 604.3,178.8 610.0,179.0" class="fx-line-muted fx-dash"/><polyline points="60.0,179.9 65.7,179.9 71.5,179.9 77.2,179.9 82.9,179.9 88.6,179.9 94.4,179.9 100.1,179.9 105.8,179.9 111.6,179.9 117.3,179.9 123.0,179.9 128.8,179.9 134.5,179.8 140.2,179.8 145.9,179.7 151.7,179.7 157.4,179.5 163.1,179.3 168.9,179.0 174.6,178.5 180.3,177.8 186.0,176.9 191.8,175.8 197.5,174.2 203.2,172.3 209.0,169.9 214.7,167.0 220.4,163.7 226.1,159.8 231.9,155.5 237.6,150.7 243.3,145.5 249.1,140.0 254.8,134.1 260.5,128.0 266.3,121.8 272.0,115.6 277.7,109.4 283.4,103.3 289.2,97.4 294.9,91.9 300.6,86.9 306.4,82.4 312.1,78.6 317.8,75.5 323.5,73.3 329.3,72.1 335.0,71.7 340.7,72.3 346.5,73.8 352.2,76.2 357.9,79.4 363.6,83.4 369.4,88.0 375.1,93.1 380.8,98.5 386.6,104.3 392.3,110.3 398.0,116.4 403.8,122.5 409.5,128.5 415.2,134.4 420.9,140.0 426.7,145.3 432.4,150.2 438.1,154.8 443.9,158.9 449.6,162.6 455.3,165.9 461.0,168.7 466.8,171.1 472.5,173.1 478.2,174.7 484.0,176.0 489.7,177.0 495.4,177.8 501.1,178.4 506.9,178.9 512.6,179.2 518.3,179.4 524.1,179.6 529.8,179.7 535.5,179.8 541.3,179.8 547.0,179.8 552.7,179.8 558.4,179.9 564.2,179.9 569.9,179.9 575.6,179.9 581.4,179.9 587.1,179.9 592.8,179.9 598.5,179.9 604.3,179.9 610.0,179.9" class="fx-line-blue fx-dash"/><polyline points="60.0,179.9 62.9,179.9 65.7,179.9 68.6,179.9 71.5,179.9 74.3,179.9 77.2,179.9 80.1,179.9 82.9,179.9 85.8,179.9 88.6,179.9 91.5,179.9 94.4,179.9 97.2,179.9 100.1,179.9 103.0,179.9 105.8,179.9 108.7,179.9 111.6,179.9 114.4,179.9 117.3,179.9 120.2,179.9 123.0,179.9 125.9,179.9 128.8,179.9 131.6,179.9 134.5,179.9 137.3,179.9 140.2,179.9 143.1,179.9 145.9,179.9 148.8,179.9 151.7,179.9 154.5,179.9 157.4,179.9 160.3,179.9 163.1,179.9 166.0,179.9 168.9,179.9 171.7,179.9 174.6,179.9 177.4,179.9 180.3,179.9 183.2,179.9 186.0,179.9 188.9,179.9 191.8,179.9 194.6,179.9 197.5,179.9 200.4,179.9 203.2,179.9 206.1,179.9 209.0,179.9 211.8,179.9 214.7,179.9 217.6,179.9 220.4,179.9 223.3,176.3 226.1,172.8 229.0,169.3 231.9,165.7 234.7,162.2 237.6,158.6 240.5,155.1 243.3,151.5 246.2,148.0 249.1,144.5 251.9,140.9 254.8,137.4 257.7,133.8 260.5,130.3 263.4,126.8 266.3,123.2 269.1,119.7 272.0,116.1 274.8,112.6 277.7,109.0 280.6,105.5 283.4,102.0 286.3,98.4 289.2,94.9 292.0,91.3 294.9,87.8 297.8,84.3 300.6,80.7 303.5,77.2 306.4,73.6 309.2,70.1 312.1,66.5 314.9,63.0 317.8,59.5 320.7,55.9 323.5,52.4 326.4,48.8 329.3,45.3 332.1,41.8 335.0,38.2 337.9,41.8 340.7,45.3 343.6,48.8 346.5,52.4 349.3,55.9 352.2,59.5 355.1,63.0 357.9,66.5 360.8,70.1 363.6,73.6 366.5,77.2 369.4,80.7 372.2,84.3 375.1,87.8 378.0,91.3 380.8,94.9 383.7,98.4 386.6,102.0 389.4,105.5 392.3,109.0 395.2,112.6 398.0,116.1 400.9,119.7 403.8,123.2 406.6,126.8 409.5,130.3 412.3,133.8 415.2,137.4 418.1,140.9 420.9,144.5 423.8,148.0 426.7,151.5 429.5,155.1 432.4,158.6 435.3,162.2 438.1,165.7 441.0,169.3 443.9,172.8 446.7,176.3 449.6,179.9 452.4,179.9 455.3,179.9 458.2,179.9 461.0,179.9 463.9,179.9 466.8,179.9 469.6,179.9 472.5,179.9 475.4,179.9 478.2,179.9 481.1,179.9 484.0,179.9 486.8,179.9 489.7,179.9 492.6,179.9 495.4,179.9 498.3,179.9 501.1,179.9 504.0,179.9 506.9,179.9 509.7,179.9 512.6,179.9 515.5,179.9 518.3,179.9 521.2,179.9 524.1,179.9 526.9,179.9 529.8,179.9 532.7,179.9 535.5,179.9 538.4,179.9 541.3,179.9 544.1,179.9 547.0,179.9 549.8,179.9 552.7,179.9 555.6,179.9 558.4,179.9 561.3,179.9 564.2,179.9 567.0,179.9 569.9,179.9 572.8,179.9 575.6,179.9 578.5,179.9 581.4,179.9 584.2,179.9 587.1,179.9 589.9,179.9 592.8,179.9 595.7,179.9 598.5,179.9 601.4,179.9 604.3,179.9 607.1,179.9 610.0,179.9" class="fx-line-thick"/><text x="105.8" y="214.0" text-anchor="middle" class="fx-t-sm">90</text><text x="220.4" y="214.0" text-anchor="middle" class="fx-t-sm">95</text><text x="335.0" y="214.0" text-anchor="middle" class="fx-t-sm">100</text><text x="449.6" y="214.0" text-anchor="middle" class="fx-t-sm">105</text><text x="564.2" y="214.0" text-anchor="middle" class="fx-t-sm">110</text><text x="610.0" y="236.0" text-anchor="end" class="fx-t-sm">XYZ price</text><text x="343.0" y="42.2" class="fx-t-ok">max +3.37 at expiry</text><circle cx="257.8" cy="133.7" r="4.5" class="fx-fill-ink"/><circle cx="412.2" cy="133.7" r="4.5" class="fx-fill-ink"/><text x="264" y="152" class="fx-t-b">96.63</text><text x="406" y="152" text-anchor="end" class="fx-t-b">103.37</text><text x="82.9" y="197.8" class="fx-t-bad">max loss −1.63 (the debit)</text><text x="412.9" y="77.0" class="fx-t-blue">2 days left</text><text x="486.2" y="125.2" class="fx-t-sm">10 days left</text></svg>
<figcaption>Figure 1 · The long 95/100/105 call butterfly. At expiry (solid) it is a tent: −1.63 outside 95–105, +3.37 at the peak. Before expiry the curve is flat: with 10 days left (grey dashed) the position is worth only about +0.91 at 100, with 2 days left (violet) it is worth about +2.19. Most of the payoff arrives in the final days.</figcaption>
</figure>

Now the surprise. Why does this tent cost $1.63 rather than $0.50 or $3? Because the market sells it at roughly **the chance of landing near 100 times what it pays there**. Divide the cost by the 5-dollar width and you get about 0.33 — and under the prices' own distribution, the probability of XYZ finishing between 97.50 and 102.50 is about 0.34. A butterfly is a probability with a price tag.

> [!THINK] Kai's tent costs 1.63 and pays up to 5. Is a 3-to-1 payout a bargain?
> Predict before you open the answer.
> ---
> Not by itself. The tent pays the full 5 only at exactly 100 and less everywhere else; weighting its payoff by the market's probabilities gives back about the 1.63 you paid. The butterfly is only a bargain if *your* probability of XYZ ending near 100 is higher than the market's — that is, if you think realized volatility will be lower than the 20% in the prices, or that something will pin the stock.

We'll take it in six parts:

- **① Building the tent: legs, payoff and the three numbers**
- **② The butterfly as a probability**
- **③ Time and Greeks: why the tent pays late**
- **④ Variants: put fly, iron fly, broken wing**
- **⑤ One quiet-market view, four structures**
- **⑥ Why the butterfly matters beyond trading**

## @mechanics
### ① Building the tent: legs, payoff and the three numbers

A long call butterfly with equally spaced strikes \(K_1 < K_2 < K_3\), spacing \(\Delta K = K_2 - K_1 = K_3 - K_2\), holds \(+1, -2, +1\) calls. Its expiry P&L per share is

$$
\Pi(S_T) = (S_T - K_1)^+ - 2\,(S_T - K_2)^+ + (S_T - K_3)^+ - D
$$

where \((x)^+ = \max(x, 0)\) and \(D\) is the net debit. The three numbers follow from the shape: maximum profit \(\Delta K - D\) at \(S_T = K_2\); maximum loss \(D\) outside \([K_1, K_3]\); breakevens \(K_1 + D\) and \(K_3 - D\).

> [!EXAMPLE] XYZ 95/100/105, 30 days
> \(D = 5.8207 - 2 \times 2.4513 + 0.7129 = 1.6311\) → **$163**.
> Maximum profit \(5 - 1.63 = 3.37\) (**$337**) at 100; breakevens \(95 + 1.63 = 96.63\) and \(105 - 1.63 = 103.37\); maximum loss $163.
> Reward-to-risk at the peak: \(3.37 / 1.63 \approx 2.1\).

The slopes tell the story ([[payoff-diagrams]]): 0 below \(K_1\), +1 between \(K_1\) and \(K_2\), −1 between \(K_2\) and \(K_3\), 0 above. The butterfly is a long bull call spread (95/100) plus a short bull call spread (100/105) — two [[vertical-spreads]] stacked nose to nose.

### ② The butterfly as a probability

Shrink the spacing and something remarkable happens. From [[risk-neutral-density]] (Breeden and Litzenberger, 1978), the second derivative of the call price with respect to the strike is the discounted risk-neutral density. A butterfly is exactly a second difference of call prices, so

$$
\begin{aligned}\text{Fly}(K, \Delta K) &= C(K - \Delta K) - 2\,C(K) + C(K + \Delta K) \\ &\approx e^{-rT} f_{\Q}(K)\,(\Delta K)^2\end{aligned}
$$

where \(C(\cdot)\) is the call price as a function of strike, \(f_{\Q}(K)\) the risk-neutral probability density of \(S_T\) at \(K\), and \(e^{-rT}\) the discount factor. Dividing by the width gives a probability you can read directly:

$$
\frac{\text{Fly}(K, \Delta K)}{\Delta K}\,e^{rT} \approx \Q\!\left(K - \tfrac{\Delta K}{2} < S_T < K + \tfrac{\Delta K}{2}\right)
$$

> [!EXAMPLE] Reading XYZ's distribution from butterflies
> - 1-wide fly 99/100/101: price 0.0691; \(e^{-rT} f_{\Q}(100) \times 1^2 = 0.0693\) — the density at 100 is about **6.9% per dollar**.
> - 5-wide fly 95/100/105: \(1.6311 / 5 \times e^{0.04 \times 30/365} \approx 0.327\), versus \(\Q(97.5 < S_T < 102.5) \approx 0.337\). The small gap comes from the tent's triangular shape over a curved density; it shrinks as the spacing shrinks.
> - A fly can never cost less than zero: its payoff is never negative. That is the "call prices are convex in strike" bound of [[arbitrage-bounds]]; a quote that violates it is a free lunch.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="A row of butterflies traces the risk-neutral distribution"><polygon points="40.0,196.0 87.5,195.8 135.0,196.0" class="fx-area-blue"/><polyline points="40.0,196.0 87.5,195.8 135.0,196.0" class="fx-line-muted"/><polygon points="87.5,196.0 135.0,193.7 182.5,196.0" class="fx-area-blue"/><polyline points="87.5,196.0 135.0,193.7 182.5,196.0" class="fx-line-muted"/><polygon points="135.0,196.0 182.5,180.7 230.0,196.0" class="fx-area-blue"/><polyline points="135.0,196.0 182.5,180.7 230.0,196.0" class="fx-line-muted"/><polygon points="182.5,196.0 230.0,141.4 277.5,196.0" class="fx-area-blue"/><polyline points="182.5,196.0 230.0,141.4 277.5,196.0" class="fx-line-muted"/><polygon points="230.0,196.0 277.5,84.2 325.0,196.0" class="fx-area-blue"/><polyline points="230.0,196.0 277.5,84.2 325.0,196.0" class="fx-line-muted"/><polygon points="277.5,196.0 325.0,56.9 372.5,196.0" class="fx-area-hl"/><polyline points="277.5,196.0 325.0,56.9 372.5,196.0" class="fx-line-hl"/><polygon points="325.0,196.0 372.5,85.7 420.0,196.0" class="fx-area-blue"/><polyline points="325.0,196.0 372.5,85.7 420.0,196.0" class="fx-line-muted"/><polygon points="372.5,196.0 420.0,137.7 467.5,196.0" class="fx-area-blue"/><polyline points="372.5,196.0 420.0,137.7 467.5,196.0" class="fx-line-muted"/><polygon points="420.0,196.0 467.5,174.7 515.0,196.0" class="fx-area-blue"/><polyline points="420.0,196.0 467.5,174.7 515.0,196.0" class="fx-line-muted"/><polygon points="467.5,196.0 515.0,190.4 562.5,196.0" class="fx-area-blue"/><polyline points="467.5,196.0 515.0,190.4 562.5,196.0" class="fx-line-muted"/><polygon points="515.0,196.0 562.5,194.9 610.0,196.0" class="fx-area-blue"/><polyline points="515.0,196.0 562.5,194.9 610.0,196.0" class="fx-line-muted"/><polyline points="40.0,196.0 43.0,196.0 45.9,196.0 48.9,196.0 51.9,196.0 54.8,196.0 57.8,196.0 60.8,196.0 63.8,196.0 66.7,196.0 69.7,196.0 72.7,196.0 75.6,196.0 78.6,196.0 81.6,195.9 84.5,195.9 87.5,195.9 90.5,195.9 93.4,195.9 96.4,195.8 99.4,195.8 102.3,195.8 105.3,195.7 108.3,195.7 111.3,195.6 114.2,195.5 117.2,195.4 120.2,195.3 123.1,195.2 126.1,195.0 129.1,194.9 132.0,194.7 135.0,194.4 138.0,194.2 140.9,193.9 143.9,193.6 146.9,193.2 149.8,192.7 152.8,192.3 155.8,191.7 158.8,191.1 161.7,190.4 164.7,189.7 167.7,188.8 170.6,187.9 173.6,186.9 176.6,185.7 179.5,184.5 182.5,183.2 185.5,181.7 188.4,180.1 191.4,178.4 194.4,176.6 197.3,174.6 200.3,172.5 203.3,170.2 206.3,167.8 209.2,165.3 212.2,162.6 215.2,159.8 218.1,156.8 221.1,153.7 224.1,150.5 227.0,147.1 230.0,143.6 233.0,140.0 235.9,136.3 238.9,132.5 241.9,128.7 244.8,124.7 247.8,120.7 250.8,116.7 253.8,112.6 256.7,108.6 259.7,104.5 262.7,100.5 265.6,96.5 268.6,92.6 271.6,88.8 274.5,85.0 277.5,81.4 280.5,77.9 283.4,74.6 286.4,71.4 289.4,68.4 292.3,65.7 295.3,63.1 298.3,60.8 301.3,58.7 304.2,56.8 307.2,55.2 310.2,53.9 313.1,52.8 316.1,52.0 319.1,51.5 322.0,51.3 325.0,51.3 328.0,51.7 330.9,52.2 333.9,53.1 336.9,54.2 339.8,55.6 342.8,57.2 345.8,59.0 348.8,61.1 351.7,63.3 354.7,65.8 357.7,68.4 360.6,71.2 363.6,74.1 366.6,77.2 369.5,80.4 372.5,83.7 375.5,87.1 378.4,90.6 381.4,94.1 384.4,97.7 387.3,101.3 390.3,104.9 393.3,108.5 396.3,112.2 399.2,115.8 402.2,119.3 405.2,122.8 408.1,126.3 411.1,129.7 414.1,133.0 417.0,136.3 420.0,139.5 423.0,142.5 425.9,145.5 428.9,148.4 431.9,151.2 434.8,153.9 437.8,156.5 440.8,159.0 443.8,161.4 446.7,163.6 449.7,165.8 452.7,167.8 455.6,169.8 458.6,171.6 461.6,173.4 464.5,175.1 467.5,176.6 470.5,178.1 473.4,179.5 476.4,180.8 479.4,182.0 482.3,183.1 485.3,184.2 488.3,185.1 491.3,186.0 494.2,186.9 497.2,187.7 500.2,188.4 503.1,189.1 506.1,189.7 509.1,190.3 512.0,190.8 515.0,191.3 518.0,191.7 520.9,192.1 523.9,192.5 526.9,192.9 529.8,193.2 532.8,193.4 535.8,193.7 538.8,193.9 541.7,194.1 544.7,194.3 547.7,194.5 550.6,194.7 553.6,194.8 556.6,194.9 559.5,195.1 562.5,195.2 565.5,195.3 568.4,195.3 571.4,195.4 574.4,195.5 577.3,195.5 580.3,195.6 583.3,195.6 586.3,195.7 589.2,195.7 592.2,195.8 595.2,195.8 598.1,195.8 601.1,195.8 604.1,195.9 607.0,195.9 610.0,195.9" class="fx-line-thick"/><line x1="35.0" y1="196.0" x2="620.0" y2="196.0" class="fx-axis"/><text x="87.5" y="212.0" text-anchor="middle" class="fx-t-sm">80</text><text x="206.3" y="212.0" text-anchor="middle" class="fx-t-sm">90</text><text x="325.0" y="212.0" text-anchor="middle" class="fx-t-sm">100</text><text x="443.8" y="212.0" text-anchor="middle" class="fx-t-sm">110</text><text x="562.5" y="212.0" text-anchor="middle" class="fx-t-sm">120</text><text x="325.0" y="34.0" text-anchor="middle" class="fx-t-hl">fly at 100: $1.07 ≈ e⁻ʳᵀ·f(100)·4² = 1.11</text><text x="479.4" y="120.0" class="fx-t">black: risk-neutral density</text><text x="40.0" y="238.0" class="fx-t-sm">Each triangle = one butterfly of width 4, scaled by eʳᵀ/4². Join the peaks and you get the distribution.</text></svg>
<figcaption>Figure 2 · A row of butterflies, each 4 wide, scaled by \(e^{rT}/(\Delta K)^2\). Their peaks trace the risk-neutral density of XYZ in 30 days (black). Added up (times the width) they sum to 1: every possible outcome is covered by exactly one "bucket". This is how desks read a market-implied distribution off a real option chain.</figcaption>
</figure>

::demo[butterfly-rnd]

> [!DEEP] Why a second difference is a density
> From [[risk-neutral-density]], \(\partial C/\partial K = -e^{-rT}\,\Q(S_T > K)\): raising the strike by a dollar costs you the discounted chance of finishing above it. Differentiate again: \(\partial^2 C/\partial K^2 = e^{-rT} f_{\Q}(K)\). A Taylor expansion gives \(C(K+h) + C(K-h) - 2C(K) \approx h^2\,\partial^2 C/\partial K^2\), with an error of order \(h^4\) — which is why the 5-wide fly (1.63) sits a little below \(e^{-rT} f_{\Q}(100) \times 25 \approx 1.73\) while the 1-wide fly matches almost exactly.

So the honest reason to buy a butterfly is **disagreement with a probability**. If the market puts about 34% on "XYZ ends between 97.50 and 102.50" and you believe it is 45%, the fly is cheap to you. On a real chain the density is not lognormal. With the illustrative equity skew in the demo above (skew strength 0.5; see [[smile-skew]]), probability moves into the far left tail and piles up just above spot: the 1-wide fly at 85 costs about 2.5 times its flat-vol price, the one at 95 about a quarter less, the one at 105 about 30% more. Which flies look "cheap" depends on the smile, not only on your view.

### ③ Time and Greeks: why the tent pays late

At entry the XYZ fly is almost Greek-less: \(\Delta \approx -0.01\), \(\Gamma \approx -0.044\), vega \(\approx -0.072\), \(\Theta \approx +0.024\) per day. It is a mild **short volatility** position (it wants the distribution to stay narrow) with a mild positive carry — nothing like the sharp tent it becomes.

The value builds slowly and then all at once. With XYZ pinned at 100:

| Days left | 30 | 20 | 10 | 5 | 2 | 1 | 0 |
|---|---|---|---|---|---|---|---|
| Fly P&L at 100 (per share) | 0.00 | +0.31 | +0.91 | +1.53 | +2.19 | +2.53 | +3.37 |

Half the maximum profit is still unearned with five days to go. The reason is the same \(\sqrt{T}\) that governs every option ([[theta]]): the 95 and 105 calls keep time value until very late, so the tent stays blurred.

Near expiry the Greeks flip from gentle to violent. With one day left:

- at 100 the fly has \(\Gamma \approx -0.76\) and \(\Theta \approx +0.42\) per day — huge carry, huge short gamma;
- at 98 its delta is about **+0.94**, at 102 about **−0.94**: a two-dollar move swings the position from almost fully long to almost fully short the stock.

Those two numbers at the body are the gamma–theta balance of [[black-scholes]] in action. With interest set aside, theta per day is about \(-\tfrac12\Gamma S^2\sigma^2/365\); for a short-gamma position the sign flips, so the fly *earns*

$$
\Theta_{\text{day}} \approx \tfrac12\,|\Gamma|\,S^2\sigma^2 / 365 = \tfrac12 \times 0.762 \times 100^2 \times 0.04 / 365 \approx 0.42
$$

where \(|\Gamma|\) is the size of the fly's (negative) gamma, \(S = 100\) and \(\sigma^2 = 0.04\). The carry is exactly the fee for standing short a large gamma: on the last day, a 2-dollar move costs about \(\tfrac12 \times 0.762 \times 2^2 \approx 1.52\), three and a half days of it.

That is the practical meaning of "pin": the butterfly's owner wants the stock to stop moving exactly where the short strikes are. Whether real stocks do get pinned near strikes with heavy open interest — through dealers hedging their own gamma — is the subject of [[dealer-gamma]].

### ④ Variants: put fly, iron fly, broken wing

The same tent can be built several ways. By put-call parity ([[put-call-parity]]) they all have the same shape; they differ in cash flow, assignment risk and cost.

| Structure (30-day XYZ) | Legs | Cash | Max profit / max loss |
|---|---|---|---|
| Long call fly | +95C −2×100C +105C | pay 1.63 | +3.37 / −1.63 |
| Long put fly | +95P −2×100P +105P | pay 1.63 | same tent |
| Short iron fly | −100C −100P +95P +105C | receive 3.35 | +3.35 / −1.65 |
| Broken-wing call fly | +95C −2×100C +110C | pay 1.06 | +3.94 at 100 / −6.06 above 110 |

The **iron fly** is a short straddle with wings — the iron condor with its two short strikes merged. Its credit and the call fly's debit add up to the discounted width:

$$
\text{Iron fly credit} = \Delta K\, e^{-rT} - \text{Fly}
$$

which for XYZ is \(5 \times e^{-0.04 \times 30/365} - 1.63 = 4.98 - 1.63 = 3.35\). Same shape, same risk, different cash flow: the iron fly is shifted up by the credit.

The **broken-wing** fly moves one wing further out. Pushing the upper wing from 105 to 110 cuts the cost from 1.63 to 1.06, but the payoff no longer returns to −1.06 above 110: the two short calls outnumber the long ones by one over a 5-dollar stretch, so the loss above 110 is \(5 + 1.06 = 6.06\). Cheaper on one side, risk added on the other — there is no free cost reduction.

> [!WARN] Two short strikes, two assignments
> The body of a fly is two short options at the same strike. On American-style stock options, a short call that goes deep in the money before an ex-dividend date, or a body that closes right at the strike on expiry day, can leave you assigned on one leg and exposed to the weekend ([[exercise-assignment]]). The tent in the diagram assumes you hold all three strikes through settlement.

### ⑤ One quiet-market view, four structures

Kai's view — "XYZ will be calm" — can be expressed four ways. All four are short volatility; they differ in how much they risk and how often they win. Held to expiry, real-world drift 4%, options priced at 20%:

| Structure | Cash at entry | Worst case | Win rate if realized 12% | Expected P&L at 12% | at 20% | at 30% |
|---|---|---|---|---|---|---|
| Long call fly 95/100/105 | pay 1.63 | −1.63 | 67% | +0.84 | 0.00 | −0.50 |
| Short iron fly 95/100/105 | receive 3.35 | −1.65 | 67% | +0.82 | −0.01 | −0.52 |
| Iron condor 90/95/105/110 | receive 1.02 | −3.98 | 92% | +0.79 | 0.00 | −0.92 |
| Short straddle 100 | receive 4.57 | unlimited | 81% | +1.81 | −0.02 | −2.30 |

Three lessons in one table. First, **at fair vol every row is zero** — the shape changes the distribution of outcomes, not the expectation. Second, if the calm view is right, the fly earns about as much as the condor while risking less than half as much (0.84 per 1.63 of worst case, versus 0.79 per 3.98); the price is a lower win rate, because it needs XYZ near 100, not merely inside 95–105. Third, the short straddle earns the most when right and has no floor when wrong — the fly and the iron fly are that same straddle with its tails bought back.

### ⑥ Why the butterfly matters beyond trading

- **It is the unit of the distribution.** Any payoff that depends only on \(S_T\) can be built from butterflies at every strike, each weighted by the payoff at that strike ([[payoff-lego]]). That is why the risk-neutral density, and every model that fits it ([[surface-calibration]]), talks about "butterfly arbitrage".
- **It is a vol trade in disguise.** A long fly is short the wings of the distribution: it gains when realized vol comes in low and when implied vol falls. The iron fly makes this explicit: it *is* a short straddle with insurance.
- **It links to the smile.** The 25-delta "butterfly" quote in [[smile-skew]] measures how much more the wings cost than the centre — how fat the market thinks the tails are.
- **Its expectation is zero at fair prices.** As with every structure in this stage, you pay the market's probability. The edge, if any, is a better probability.

## @analogy
A butterfly is like **betting on where a ball will stop on a roulette wheel that has a hump in the middle**: most balls come to rest near the centre, fewer on the sides. The bookmaker offers tickets on each slot. A ticket on the centre slot costs more than one on the edge — not because the bookmaker is greedy, but because more balls end there. The ticket's price is the slot's probability times the payout.

Buying one centre ticket is a butterfly. Buying tickets on every slot is buying certainty: you get exactly one payout, whatever happens, so all the tickets together cost the payout (discounted). That is the figure where the triangles add up to 1.

You only profit from centre tickets if you know something the bookmaker doesn't — say, that tonight the wheel has been tilted and balls stop in the middle even more often (realized volatility lower than implied, or a pin).

Where the analogy breaks: a roulette slot pays all or nothing, while a butterfly pays more the closer you land to the centre. And the bookmaker's probabilities are risk-neutral ones, which already include a premium for the crash risk investors fear.

## @misconceptions
- **“A butterfly is cheap, so it's low-risk.”** — Its dollar loss is small, but it loses its whole cost in most outcomes: XYZ must land inside 96.63–103.37, which happens about 44% of the time under the market's prices.
- **“A 2-to-1 payout means positive expected value.”** — The market prices the fly at about the probability-weighted payoff. The ratio of best case to cost says nothing about expectation.
- **“If XYZ sits at 100 all month, the fly pays out steadily.”** — It pays late: with XYZ pinned at 100 and five days left, the fly is only worth about 1.53 of its possible 3.37 profit.
- **“The iron fly and the call fly are different bets.”** — Same tent, shifted by cash; parity forces the iron fly's credit to equal the discounted width minus the call fly's debit.
- **“A broken-wing fly removes the cost for free.”** — Moving a wing out cuts the debit by adding a loss zone on that side (−6.06 above 110 for the 95/100/110 version).

## @takeaways
- A long butterfly (+1, −2, +1) is a tent: maximum profit \(\Delta K - D\) at the body, maximum loss \(D\) outside the wings.
- Its price is a probability: \(\text{Fly} \approx e^{-rT} f_{\Q}(K)(\Delta K)^2\); a row of flies traces the market's distribution, and a fly can never cost less than zero.
- The fly is a mild short-volatility position that pays late: most of its value arrives in the last days, when gamma and theta become extreme.
- Call fly, put fly and iron fly are the same shape with different cash flows; broken wings trade a lower cost for new risk on one side.
- At fair prices the expected profit is zero; buying a fly is a bet that the true chance of landing near the body is higher than the market's.

## @quiz
1. Kai's 95/100/105 call butterfly costs 1.63. What is its payoff profile at expiry?
   - [ ] Unlimited profit above 105, loss of 1.63 below 95
   - [x] Maximum +3.37 at 100, loss of 1.63 below 95 and above 105
   - [ ] Profit of 1.63 anywhere between 95 and 105
   - [ ] Maximum +5.00 at 100, no loss anywhere
   > The tent peaks at the body: \(\Delta K - D = 5 - 1.63 = 3.37\). Outside the wings every call cancels and the debit is lost.
2. A 1-wide butterfly centred at 100 costs 0.069. What does that tell you?
   - [ ] XYZ has a 69% chance of finishing at 100
   - [x] The market's (risk-neutral) density near 100 is about 6.9% per dollar
   - [ ] The butterfly will return 0.069 per day
   - [ ] The butterfly is mispriced because it should cost zero
   > \(\text{Fly} \approx e^{-rT} f_{\Q}(100)(\Delta K)^2\) with \(\Delta K = 1\) gives \(f_{\Q}(100) \approx 0.069\): about a 6.9% chance of landing within each one-dollar bucket around 100.
3. A dealer quotes the 95/100/105 fly at −0.05 (they would pay you to take it). What is going on?
   - [ ] Nothing unusual; flies often have negative prices when volatility is high
   - [ ] It means the market expects XYZ to finish far from 100
   - [x] It is an arbitrage: the fly's payoff is never negative, so buying it at a credit is a free lunch
   - [ ] It means the risk-neutral density at 100 is negative, which is normal in the tails
   > Call prices must be convex in strike ([[arbitrage-bounds]]); a negative fly price violates this. Densities cannot be negative.
4. XYZ sits exactly at 100 for 25 days. With five days left, roughly how much of the fly's 3.37 maximum profit has been earned?
   - [ ] Nearly all of it, because theta is positive
   - [ ] None of it, because butterflies only pay at expiry
   - [x] About 1.53, less than half
   - [ ] About 3.00
   > The wings keep time value until late, so the tent stays blurred; the table shows +1.53 at five days, +2.53 at one day, +3.37 only at expiry.
5. How are the short iron fly (credit 3.35) and the long call fly (debit 1.63) on XYZ related?
   - [ ] They have opposite payoffs
   - [ ] The iron fly has more risk because it contains a short straddle
   - [ ] They are unrelated because one uses puts
   - [x] Same tent shape; the credit equals the discounted width minus the call fly's cost, \(4.98 - 1.63\)
   > Parity turns one into the other; only the cash flow differs. Both lose 1.63–1.65 in the tails and make 3.35–3.37 at the body.

## @further
- [Butterfly (options) (Wikipedia)](https://en.wikipedia.org/wiki/Butterfly_%28options%29) — long/short, call/put and iron variants.
- [Risk-neutral measure (Wikipedia)](https://en.wikipedia.org/wiki/Risk-neutral_measure) — the probabilities that butterfly prices reveal, and why they differ from real-world odds.
- [Cboe VIX methodology](https://cdn.cboe.com/resources/vix/VIX_Methodology.pdf) — another use of a strip of options across strikes to read the distribution.
- [Strategy Path (Droplet Labs)](https://evidex-cloud.github.io/droplet-labs-strategy-path/) — the sister course on decisions under uncertainty, for thinking about when your probability is better than the market's.

## @next
All the structures so far share one expiry. What happens when you sell a short-dated option and buy a longer-dated one at the same strike? The next lesson turns the time axis into a trading axis — the calendar spread, a bet on the term structure of volatility.
