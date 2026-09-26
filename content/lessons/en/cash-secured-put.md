---
id: cash-secured-put
prereqs: four-positions, margin-approval, put-call-parity, covered-call
demo: cash-secured-put
---

# Cash-Secured Puts & the Wheel

## @hook
Kai would happily buy another 100 shares of XYZ at $95. Instead of resting a limit order at 95 and waiting, Kai can sell a 95 put: collect $51 now, and if assigned, the real purchase price is 94.49. **You get paid to wait for a discount** — at the price of always buying while the stock is falling, and at 95 no matter how far it has fallen.

## @bridge
The parity identity in [[covered-call]] said: covered call = cash + a short put. This lesson walks to the other side of that identity: a short put backed by cash — the short put from [[four-positions]], with its risk fully covered by money in the account (a low-approval way to sell options — typically the same level as buying them, see [[margin-approval]]). Then we join the two lessons end to end into a popular cycle, the wheel. This lesson builds Idea ① (shape) and Idea ③ (volatility: selling a put is selling insurance).

## @intuition
Kai already owns 100 shares of XYZ (cost 100) and would buy another 100 if XYZ dipped to 95. Kai has set aside $9,500 in cash for that.

The direct route is a limit order to buy at 95. The alternative:

- **sell one 30-day put with a 95 strike** for $0.51 per share, $51 per contract;
- keep **$9,500** (\(95 \times 100\)) in the account as collateral — that is what “cash-secured” means.

Selling the put is a promise: “if XYZ is below 95 at expiry, I will buy 100 shares at 95.” The buyer paid $51 for that promise.

> [!KAI] Outcomes after 30 days (per contract)
> - XYZ closes above 95: the put expires, Kai keeps the $51, and the cash has been earning interest all along (about $31 at 4%);
> - XYZ closes at 90: Kai is assigned and buys 100 shares at 95, but they are worth 90. Including the premium, \(90 - 95 + 0.51 = -4.49\) per share, a $449 loss;
> - XYZ closes at 80: again Kai buys at 95: \(80 - 94.49 = -14.49\) per share, a $1,449 loss.

<figure>
<svg viewBox="0 0 660 270" role="img" aria-label="Cash-secured put versus buying the stock at expiry"><defs><marker id="cash-secured-put-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs><polygon points="60,93.4 60,93.4 62.8,93.4 65.6,93.4 68.4,93.4 71.2,93.4 74,93.4 76.8,93.4 79.6,93.4 82.4,93.4 85.2,93.4 88,93.4 90.8,93.4 93.6,93.4 96.4,93.4 99.2,93.4 102,93.4 104.8,93.4 107.6,93.4 110.4,93.4 113.2,93.4 116,93.4 118.8,93.4 121.6,93.4 124.4,93.4 127.2,93.4 130,93.4 132.8,93.4 135.6,93.4 138.4,93.4 141.2,93.4 144,93.4 146.8,93.4 149.6,93.4 152.4,93.4 155.2,93.4 158,93.4 160.8,93.4 163.6,93.4 166.4,93.4 169.2,93.4 172,93.4 174.8,93.4 177.6,93.4 180.4,93.4 183.2,93.4 186,93.4 188.8,93.4 191.6,93.4 194.4,93.4 197.2,93.4 200,93.4 202.8,93.4 205.6,93.4 208.4,93.4 211.2,93.4 214,93.4 216.8,93.4 219.6,93.4 222.4,93.4 225.2,93.4 228,93.4 230.8,93.4 233.6,93.4 236.4,93.4 239.2,93.4 242,93.4 244.8,93.4 247.6,93.4 250.4,93.4 253.2,93.4 256,93.4 258.8,93.4 261.6,93.4 264.4,93.4 267.2,93.4 270,93.4 272.8,93.4 275.6,93.4 278.4,93.4 281.2,93.4 284,93.4 286.8,93.4 289.6,93.4 292.4,93.4 295.2,93.4 298,93.4 300.8,93.4 303.6,93.4 306.4,93.4 309.2,93.4 312,93.4 314.8,93.4 317.6,93.4 320.4,93.4 323.2,93.4 326,93.4 328.8,93.4 331.6,93.1 334.4,92.1 337.2,91.2 340,90.2 342.8,90.2 345.6,90.2 348.4,90.2 351.2,90.2 354,90.2 356.8,90.2 359.6,90.2 362.4,90.2 365.2,90.2 368,90.2 370.8,90.2 373.6,90.2 376.4,90.2 379.2,90.2 382,90.2 384.8,90.2 387.6,90.2 390.4,90.2 393.2,90.2 396,90.2 398.8,90.2 401.6,90.2 404.4,90.2 407.2,90.2 410,90.2 412.8,90.2 415.6,90.2 418.4,90.2 421.2,90.2 424,90.2 426.8,90.2 429.6,90.2 432.4,90.2 435.2,90.2 438,90.2 440.8,90.2 443.6,90.2 446.4,90.2 449.2,90.2 452,90.2 454.8,90.2 457.6,90.2 460.4,90.2 463.2,90.2 466,90.2 468.8,90.2 471.6,90.2 474.4,90.2 477.2,90.2 480,90.2 482.8,90.2 485.6,90.2 488.4,90.2 491.2,90.2 494,90.2 496.8,90.2 499.6,90.2 502.4,90.2 505.2,90.2 508,90.2 510.8,90.2 513.6,90.2 516.4,90.2 519.2,90.2 522,90.2 524.8,90.2 527.6,90.2 530.4,90.2 533.2,90.2 536,90.2 538.8,90.2 541.6,90.2 544.4,90.2 547.2,90.2 550,90.2 552.8,90.2 555.6,90.2 558.4,90.2 561.2,90.2 564,90.2 566.8,90.2 569.6,90.2 572.4,90.2 575.2,90.2 578,90.2 580.8,90.2 583.6,90.2 586.4,90.2 589.2,90.2 592,90.2 594.8,90.2 597.6,90.2 600.4,90.2 603.2,90.2 606,90.2 608.8,90.2 611.6,90.2 614.4,90.2 617.2,90.2 620,90.2 620,93.4" class="fx-area-ok"/><polygon points="60,93.4 60,184.9 62.8,184 65.6,183 68.4,182.1 71.2,181.1 74,180.2 76.8,179.2 79.6,178.3 82.4,177.3 85.2,176.4 88,175.4 90.8,174.5 93.6,173.6 96.4,172.6 99.2,171.7 102,170.7 104.8,169.8 107.6,168.8 110.4,167.9 113.2,166.9 116,166 118.8,165 121.6,164.1 124.4,163.1 127.2,162.2 130,161.2 132.8,160.3 135.6,159.3 138.4,158.4 141.2,157.5 144,156.5 146.8,155.6 149.6,154.6 152.4,153.7 155.2,152.7 158,151.8 160.8,150.8 163.6,149.9 166.4,148.9 169.2,148 172,147 174.8,146.1 177.6,145.1 180.4,144.2 183.2,143.3 186,142.3 188.8,141.4 191.6,140.4 194.4,139.5 197.2,138.5 200,137.6 202.8,136.6 205.6,135.7 208.4,134.7 211.2,133.8 214,132.8 216.8,131.9 219.6,130.9 222.4,130 225.2,129 228,128.1 230.8,127.2 233.6,126.2 236.4,125.3 239.2,124.3 242,123.4 244.8,122.4 247.6,121.5 250.4,120.5 253.2,119.6 256,118.6 258.8,117.7 261.6,116.7 264.4,115.8 267.2,114.8 270,113.9 272.8,113 275.6,112 278.4,111.1 281.2,110.1 284,109.2 286.8,108.2 289.6,107.3 292.4,106.3 295.2,105.4 298,104.4 300.8,103.5 303.6,102.5 306.4,101.6 309.2,100.6 312,99.7 314.8,98.7 317.6,97.8 320.4,96.9 323.2,95.9 326,95 328.8,94 331.6,93.4 334.4,93.4 337.2,93.4 340,93.4 342.8,93.4 345.6,93.4 348.4,93.4 351.2,93.4 354,93.4 356.8,93.4 359.6,93.4 362.4,93.4 365.2,93.4 368,93.4 370.8,93.4 373.6,93.4 376.4,93.4 379.2,93.4 382,93.4 384.8,93.4 387.6,93.4 390.4,93.4 393.2,93.4 396,93.4 398.8,93.4 401.6,93.4 404.4,93.4 407.2,93.4 410,93.4 412.8,93.4 415.6,93.4 418.4,93.4 421.2,93.4 424,93.4 426.8,93.4 429.6,93.4 432.4,93.4 435.2,93.4 438,93.4 440.8,93.4 443.6,93.4 446.4,93.4 449.2,93.4 452,93.4 454.8,93.4 457.6,93.4 460.4,93.4 463.2,93.4 466,93.4 468.8,93.4 471.6,93.4 474.4,93.4 477.2,93.4 480,93.4 482.8,93.4 485.6,93.4 488.4,93.4 491.2,93.4 494,93.4 496.8,93.4 499.6,93.4 502.4,93.4 505.2,93.4 508,93.4 510.8,93.4 513.6,93.4 516.4,93.4 519.2,93.4 522,93.4 524.8,93.4 527.6,93.4 530.4,93.4 533.2,93.4 536,93.4 538.8,93.4 541.6,93.4 544.4,93.4 547.2,93.4 550,93.4 552.8,93.4 555.6,93.4 558.4,93.4 561.2,93.4 564,93.4 566.8,93.4 569.6,93.4 572.4,93.4 575.2,93.4 578,93.4 580.8,93.4 583.6,93.4 586.4,93.4 589.2,93.4 592,93.4 594.8,93.4 597.6,93.4 600.4,93.4 603.2,93.4 606,93.4 608.8,93.4 611.6,93.4 614.4,93.4 617.2,93.4 620,93.4 620,93.4" class="fx-area-bad"/><line x1="60" y1="93.4" x2="630" y2="93.4" class="fx-axis" marker-end="url(#cash-secured-put-ah)"/><text x="60" y="109.4" text-anchor="middle" class="fx-t-sm">80</text><text x="153.3" y="109.4" text-anchor="middle" class="fx-t-sm">85</text><text x="246.7" y="109.4" text-anchor="middle" class="fx-t-sm">90</text><text x="340" y="109.4" text-anchor="middle" class="fx-t-sm">95</text><text x="433.3" y="109.4" text-anchor="middle" class="fx-t-sm">100</text><text x="526.7" y="109.4" text-anchor="middle" class="fx-t-sm">105</text><text x="620" y="109.4" text-anchor="middle" class="fx-t-sm">110</text><text x="52" y="223.7" text-anchor="end" class="fx-t-sm">−20</text><line x1="60" y1="219.7" x2="620" y2="219.7" class="fx-grid"/><text x="52" y="192.1" text-anchor="end" class="fx-t-sm">−15</text><line x1="60" y1="188.1" x2="620" y2="188.1" class="fx-grid"/><text x="52" y="160.6" text-anchor="end" class="fx-t-sm">−10</text><line x1="60" y1="156.6" x2="620" y2="156.6" class="fx-grid"/><text x="52" y="129" text-anchor="end" class="fx-t-sm">−5</text><line x1="60" y1="125" x2="620" y2="125" class="fx-grid"/><text x="52" y="65.9" text-anchor="end" class="fx-t-sm">+5</text><line x1="60" y1="61.9" x2="620" y2="61.9" class="fx-grid"/><text x="52" y="34.3" text-anchor="end" class="fx-t-sm">+10</text><line x1="60" y1="30.3" x2="620" y2="30.3" class="fx-grid"/><polyline points="60,219.7 620,30.3" class="fx-line-muted fx-dash"/><polyline points="60,184.9 340,90.2 620,90.2" class="fx-line-thick"/><circle cx="330.5" cy="93.4" r="5" class="fx-fill-orange"/><text x="324.5" y="83.4" text-anchor="end" class="fx-t-hl">effective price 94.49</text><text x="560" y="83" text-anchor="middle" class="fx-t-b">at most +0.51</text><text x="540" y="30" text-anchor="end" class="fx-t-sm">buy stock at 100 today</text><text x="66" y="128" class="fx-t-sm">below 95: like the stock</text><text x="358.7" y="188.1" class="fx-t-bad">at S = 80: −14.49 (stock −20)</text><text x="620" y="262" text-anchor="end" class="fx-t-sm">XYZ price at expiry; vertical axis = P&L per share</text></svg>
<figcaption>Figure 1 · Selling the 95 put (solid) versus buying the stock at 100 today (dashed), at expiry. Above 95 the seller makes at most 0.51; below 95 the two lines fall in parallel. The effective price of 94.49 is 5.51 cheaper than buying today, but at 80 the position still loses 14.49.</figcaption>
</figure>

The picture holds the whole character of the strategy: **capped at one premium on top, the same as owning the stock underneath.** It suits someone who wants to buy lower anyway; it doesn't suit someone who wants the upside — if XYZ goes straight to 120, Kai collects $51 and nothing else.

Before expiry the short put's signature is \(\Delta = +0.163\) (like owning about 16 shares), \(\Gamma = -0.043\), \(\Theta = +0.022\) (about $2.17 per day), \(\nu = -0.071\). Same as the covered call: **Θ positive, Γ and ν negative** — Kai is selling insurance, and the insured event is “XYZ falls below 95.”

> [!THINK] A limit order or a short put — which is better?
> Both “want to buy at 95.” Picture three paths: (1) XYZ dips to 94 intraday one day, closes higher and ends the 30 days at 110; (2) XYZ grinds around 96 all month; (3) XYZ slides all the way to 80.
> ---
> (1) The limit order fills near 94 and then gains about 15 per share; the put expires worthless with the stock at 110 and Kai keeps only 0.51 — **the put only cares about the price at expiry and cannot catch an intraday dip.** (2) The limit order never fills and earns nothing; the put expires and Kai keeps 0.51 for free. (3) Both end up buying near 95; the put loses 0.51 less thanks to the premium. Selling the put trades away the chance to “catch the dip and ride the rebound” for a certain premium.

We'll take it in five parts:

- **① Mechanics: collateral, effective price and yield**
- **② Short put = covered call: the same risk**
- **③ The wheel: sell a put → assigned → sell a call → called away**
- **④ Risks: falling knives, capped upside, a stuck cost basis**
- **⑤ State of play: the PUT index and the long record of selling insurance**

## @mechanics
### ① Mechanics: collateral, effective price and yield

Sell a put with strike \(K\), receive a premium \(p\) per share, and set aside \(K \times 100\) in cash. The P&L per share at expiry is:

$$
\Pi(S_T) = p - \max(K - S_T,\,0)
$$

where \(S_T\) is the stock price at expiry. From this:

- **max profit** \(= p\), when the stock finishes above \(K\);
- **effective purchase price (also the breakeven)** \(= K - p\), your real cost if assigned, net of the premium;
- **max loss** \(= K - p\), if the stock goes to zero.

The collateral doesn't sit idle: it earns interest. So the return if you are not assigned is:

$$
R = \frac{100p + \text{interest}}{100K}, \qquad \text{interest} = 100K\left(e^{rT} - 1\right)
$$

where \(100K\) is the cash set aside for one contract, \(r\) the risk-free rate, \(T\) the time to expiry in years, and \(R\) the return for the period if the put is not assigned.

> [!EXAMPLE] Kai's 95 put
> \(K = 95\), \(p = 0.51\), \(T = 30/365\), \(r = 4\%\):
> $$
> \begin{gathered}\text{interest} = 9{,}500 \times \left(e^{0.04 \times 30/365} - 1\right) \approx \$31 \\ R = \frac{51 + 31}{9{,}500} \approx 0.86\%\end{gathered}
> $$
> Annualised with compounding that is about 11.0%, of which the premium accounts for about 6.7%. Note that **the interest is not the strategy's doing** — the same cash would earn it in Treasury bills. As of September 25, 2026, the US 3-month Treasury bill yielded about 4.24%. When comparing a short put with the alternatives, look only at the premium.

::demo[cash-secured-put-effective]

The closer the strike is to today's price, the fatter the premium and the higher the chance of assignment:

| 30-day put | Premium | Δ (per share) | Risk-neutral P(assigned) | Effective price | Premium, annualised |
|---|---|---|---|---|---|
| 90 | 0.06 | −0.027 | 3.1% | 89.94 | 0.8% |
| 95 | 0.51 | −0.163 | 17.8% | 94.49 | 6.7% |
| 100 (ATM) | 2.12 | −0.466 | 48.9% | 97.88 | 29.1% |

### ② Short put = covered call: the same risk

Rearranged, put-call parity ([[put-call-parity]]) reads:

$$
\underbrace{Ke^{-rT} - P}_{\text{cash-secured short put}} = \underbrace{S - C}_{\text{covered call}}
$$

At the same strike both are worth \(\min(S_T, K)\) at expiry, and both cost the same today.

> [!EXAMPLE] The at-the-money check
> 30 days, strike 100: the put costs 2.12, the call 2.45, and \(100\,e^{-0.04 \times 30/365} = 99.67\).
> $$
> 99.67 - 2.12 = 97.55, \qquad 100 - 2.45 = 97.55
> $$
> The two positions are identical: both collect a premium, both carry the downside, both give up the upside above 100.

That makes an often-missed point: **a short put is not a “safer alternative” to owning the stock — it is a way of owning the stock**, just with a smaller delta at the start (about 16 shares for the 95 put) that grows towards 100 shares as the stock falls. The moment you are assigned, the risk is 100 shares.

Here is how the delta of this 95 put moves with the stock (negative gamma at work):

| When and where | Put price | Kai's exposure (share-equivalent) |
|---|---|---|
| At entry: 100, 30 days left | 0.51 | about 16 shares |
| 15 days later: 95 | 1.46 | about 48 shares |
| 15 days later: 90 | 5.02 | about 90 shares |
| 15 days later: 85 | 9.85 | about 100 shares |

When the stock rises the exposure shrinks (gains come ever more slowly); when it falls the exposure grows (losses come ever faster). That is **negative convexity** — the exact opposite of the buyer's accelerating gains in [[long-options]].

### ③ The wheel: sell a put → assigned → sell a call → called away

Join the short put and the covered call end to end and you get **the wheel**:

<figure>
<svg viewBox="0 0 660 330" role="img" aria-label="The wheel cycle"><defs><marker id="cash-secured-put-wh" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs><rect x="40" y="60" width="210" height="76" rx="10" class="fx-box"/><text x="145" y="84" text-anchor="middle" class="fx-t-b">① Holding cash</text><text x="145" y="104" text-anchor="middle" class="fx-t-sm">sell a cash-secured put (e.g. 95)</text><text x="145" y="122" text-anchor="middle" class="fx-t-sm">collect premium; cash is the collateral</text><rect x="410" y="60" width="210" height="76" rx="10" class="fx-hl"/><text x="515" y="84" text-anchor="middle" class="fx-t-b">② Assigned</text><text x="515" y="104" text-anchor="middle" class="fx-t-sm">buy 100 shares at K</text><text x="515" y="122" text-anchor="middle" class="fx-t-sm">effective cost = K − premiums</text><rect x="410" y="200" width="210" height="76" rx="10" class="fx-box"/><text x="515" y="224" text-anchor="middle" class="fx-t-b">③ Holding shares</text><text x="515" y="244" text-anchor="middle" class="fx-t-sm">sell a covered call (e.g. 105)</text><text x="515" y="262" text-anchor="middle" class="fx-t-sm">collect premium; shares are the cover</text><rect x="40" y="200" width="210" height="76" rx="10" class="fx-ok"/><text x="145" y="224" text-anchor="middle" class="fx-t-b">④ Called away</text><text x="145" y="244" text-anchor="middle" class="fx-t-sm">sell the 100 shares at K</text><text x="145" y="262" text-anchor="middle" class="fx-t-sm">back to cash, start again</text><line x1="250" y1="98" x2="404" y2="98" class="fx-line" marker-end="url(#cash-secured-put-wh)"/><text x="327" y="90" text-anchor="middle" class="fx-t-sm">at expiry S < K</text><line x1="515" y1="136" x2="515" y2="194" class="fx-line" marker-end="url(#cash-secured-put-wh)"/><line x1="410" y1="238" x2="256" y2="238" class="fx-line" marker-end="url(#cash-secured-put-wh)"/><text x="333" y="230" text-anchor="middle" class="fx-t-sm">at expiry S > K</text><line x1="145" y1="200" x2="145" y2="142" class="fx-line" marker-end="url(#cash-secured-put-wh)"/><path d="M 90,60 C 90,18 200,18 200,54" class="fx-line-hl" fill="none" marker-end="url(#cash-secured-put-wh)"/><text x="145" y="16" text-anchor="middle" class="fx-t-hl">S ≥ K: put expires, sell again</text><path d="M 460,276 C 460,318 570,318 570,282" class="fx-line-hl" fill="none" marker-end="url(#cash-secured-put-wh)"/><text x="515" y="326" text-anchor="middle" class="fx-t-hl">S ≤ K: call expires, keep shares, sell again</text></svg>
<figcaption>Figure 2 · The wheel. Holding cash, sell a put; if assigned, hold the shares. Holding shares, sell a call; if called away, go back to cash. The two self-loops are the most common months: the option expires, you keep the premium and sell again next month.</figcaption>
</figure>

Every box collects a premium, so the wheel is often described as “collecting rent continuously.” Seen through parity, though, **it is a short put the whole time:** with cash it is a cash-secured put; with shares it is a covered call (= a cash-secured put). The wheel only changes what each month's strike is anchored to.

The main demo below runs the wheel against “buy on day 0 and hold” over 12 months and 300 simulated paths. With the default settings (implied vol = realized vol = 20%, a real drift of +8% a year), the wheel ends at about $10,500 on average and holding at about $10,950; on the worst 5% of paths the wheel ends near $8,700 and holding near $7,800; on the best 5%, the wheel near $11,700 and holding near $15,000. **The wheel doesn't create return out of nothing; it shortens both tails of the distribution:** it loses a bit less and gains a lot less. The seller has a positive expected edge only when implied volatility is systematically above realized volatility.

In practice, wheel parameters are usually described like this (a description of practice, not advice): expiries of 30 to 45 days; strikes chosen by delta (for example −0.2 to −0.3 for puts and 0.2 to 0.3 for calls); and underlyings limited to liquid stocks or ETFs the trader would genuinely hold for a long time. That last condition matters most: **sooner or later the wheel makes you own the stock, usually right after it has fallen.** If you wouldn't want to hold it after bad news, you shouldn't be selling puts on it.

### ④ Risks: falling knives, capped upside, a stuck cost basis

**Falling knives.** A put is assigned only after the stock falls, and big falls usually come with bad news. If XYZ drops to 80, Kai buys at 95 and is immediately down $1,449.

**Capped upside.** If XYZ goes straight from 100 to 120, Kai collects $51 and misses the whole rally — with no shares, the wheel has no next step.

**Early assignment.** An American put that is deep in the money may be exercised early. With the stock at 80 and 10 days left, the European 95 put is worth only 14.90 — less than its 15 of intrinsic value, because the interest on the strike is worth more than the remaining time value — so the holder has a reason to exercise now ([[exercise-assignment]]). For Kai the outcome is much the same, since the shares would be bought at 95 anyway, but the purchase comes earlier than planned, so the cash must be ready at all times.

**A stuck cost basis.** A common wheel rule is “never sell a call below my cost basis.” Suppose Kai is assigned at 95 and XYZ then falls to 85:

> [!EXAMPLE] Stock at 85, cost basis 95
> - The 30-day 95 call is worth only 0.06 — almost no rent.
> - The 30-day 89.25 call (105% of today's price) is worth 0.61 — but if it is exercised, Kai sells below cost and locks in the loss.
>
> The cost basis is a **sunk cost**: the paper loss exists whether or not Kai sells a call. A sensible strike depends on today's price and Kai's view from here, not on the original purchase price ([[trading-psychology]]).

> [!WARN] “Cash-secured” means you can pay, not that you can't lose
> Cash-secured means the money is in the account if you are assigned, so the broker never needs more margin. It does not limit the loss: in the worst case (the stock goes to zero) each contract loses \((95 - 0.51) \times 100 = \$9{,}449\). The same position sold “naked” on margin ties up less money but carries more leverage, and losses can exceed the account.

### ⑤ State of play: the PUT index and the long record of selling insurance

- **The PUT index** (Cboe S&P 500 PutWrite Index) sells a one-month **at-the-money** SPX put every month and fully collateralises it with Treasury bills — an index version of the cash-secured put. Cboe introduced it in 2007, with data back to June 30, 1986. According to Bondarenko's 2019 study for Cboe, the at-the-money put premium averaged about 1.65% of notional per month.
- **Why selling puts has paid over time:** index implied volatility has on average been higher than the realized volatility that followed. A 2024 CFA Institute article found that from 1990 to about 2024 the VIX averaged about 19.6%, while the S&P 500's realized volatility over the following 30 days averaged about 15.5% — a gap of roughly 4 vol points. That gap is the seller's “insurance margin” ([[variance-risk-premium]]).
- **Volatility itself jumps:** on February 5, 2018 the VIX rose about 20 points (+115.6%) in a day to close at 37.32, while the S&P 500 fell about 4%. For put sellers two losses landed at once that day: a delta loss from the falling market and a vega loss from exploding implied volatility — and even if prices recovered by expiry, a marked-to-market account could face a margin call first.
- **Why it also blows up:** the premium arrives slowly in calm periods and is paid back all at once in crashes. On October 19, 1987 the Dow fell 22.6% in a day (the S&P 500 fell 20.5%); sellers of index puts could lose years of accumulated premium in a single session.

> [!FACT] Put-writing at scale
> Indexes such as PUT and BXM, and the many option-income products, have made selling index options a large systematic strategy ([[systematic-vol]]). When such strategies are backtested, trading costs, early assignment and tail events are the things most often underestimated ([[backtesting]]). Facts as of September 2026.

## @analogy
Selling a put is like **running a tiny insurance company that covers exactly one house**.

Kai tells a homeowner: “If your house's value drops below $950,000 within a month, I'll buy it for $950,000.” The owner pays Kai a $5,100 premium for this price insurance. Most months the value stays above $950,000 and the premium is Kai's; now and then it drops below, and Kai must buy at $950,000 a house that may be worth $800,000.

- **Cash-secured** means Kai keeps $950,000 in escrow, guaranteeing the claim can be paid;
- **the effective price** is $950,000 minus the premium;
- **the wheel** is: after buying the house, sell someone an option to buy it and collect rent on that; once the house is sold, go insure the next one.

A real insurer relies on the law of large numbers: it covers thousands of unrelated houses. Kai covers one — and one that is just like the 100 shares Kai already owns, so none of the risk is diversified. That is where the analogy teaches its lesson: **insurance selling pays when it is diversified, and a put on a single stock is the opposite of diversified.**

## @misconceptions
- **“Selling puts is safer than buying stock.”** — Once assigned you have bought 100 shares at 95; the downside is the same, minus one premium. The delta starts small but approaches 100 shares as the stock falls.
- **“The wheel can't lose as long as I never sell below cost.”** — The loss happens when the stock falls; selling only decides whether it is realised. Refusing to sell below cost can leave you stuck for a long time in a falling stock, collecting negligible rent.
- **“Cash-secured means the most I can lose is the premium.”** — Cash-secured only means you can pay. The worst case is \(K - p\) per share: 94.49 for the 95 put.
- **“The strike with the highest annualised yield is best.”** — The at-the-money put annualises to about 29% but gets assigned about half the time; the 90 put almost never gets assigned and annualises to under 1%. Yield and assignment risk are two sides of the same coin.
- **“Put sellers earn time value; volatility doesn't matter.”** — Sellers earn implied volatility minus realized volatility. When realized volatility exceeds implied, the theta collected on schedule is swamped by bigger losses.

## @takeaways
- A cash-secured put = collect a premium + promise to buy at \(K\); the effective price is \(K - p\) and the maximum profit is \(p\).
- Interest on the collateral is not the strategy's return; compare alternatives on the premium alone.
- By parity, a cash-secured put and a covered call at the same strike are the same position: Θ positive, Γ and ν negative, with the same downside as the stock.
- The wheel chains short puts and covered calls into a cycle, but it is a short put throughout: it shortens both tails rather than adding return from nothing.
- The seller's long-run edge comes from implied volatility exceeding realized volatility; the price is concentrated losses in crashes.

## @quiz
1. Kai sells the 30-day 95 put for 0.51. If assigned, what is the effective purchase price?
   - [ ] 95.51
   - [ ] 95.00
   - [x] 94.49
   - [ ] 100.00
   > Effective price \(= K - p = 95 - 0.51 = 94.49\). The premium was collected at the start, so the real cost after assignment is 0.51 lower.
2. At expiry XYZ closes at 88. The 95 put (premium 0.51) has a P&L per contract of about:
   - [ ] +$51
   - [ ] −$700
   - [x] −$649
   - [ ] −$1,200
   > Per share \(0.51 - (95 - 88) = -6.49\), per contract \(-6.49 \times 100 = -\$649\). −$700 forgets to add back the premium.
3. By put-call parity, a 30-day cash-secured put with a 100 strike is equivalent to:
   - [ ] a long 100 call + cash
   - [x] 100 shares + a short 100 call (a covered call)
   - [ ] short 100 shares + a long 100 put
   - [ ] a long 100 put + 100 shares
   > \(Ke^{-rT} - P = S - C\). Both are worth \(\min(S_T, 100)\) at expiry and both cost 97.55 today.
4. The Greek signature of the cash-secured 95 put is:
   - [ ] Δ negative, Γ positive, Θ negative
   - [x] Δ positive, Γ negative, Θ positive, ν negative
   - [ ] Δ positive, Γ positive, Θ positive, ν positive
   - [ ] Δ zero, only Θ
   > A short put is long direction (a rising stock helps, Δ ≈ +16 shares), sells convexity (Γ negative), collects time (Θ positive) and fears rising implied volatility (ν negative).
5. Kai is assigned at 95 and XYZ then falls to 85. Which statement is most accurate?
   - [ ] As long as Kai never sells below 95, there is no loss
   - [ ] Kai should immediately sell the 95 call, because that is the cost basis
   - [x] The paper loss already exists; the cost basis is sunk, and the call strike should be chosen from today's price and view
   - [ ] Kai should sell another 95 put to average the cost down to 90
   > A stock trading at 85 is worth 85, whatever was paid for it. The 95 call is worth about 0.06 — almost no rent; choosing strikes from the purchase price is the sunk-cost fallacy.

## @further
- [Cboe S&P 500 PutWrite Index methodology](https://cdn.cboe.com/api/global/us_indices/governance/Cboe_SP_500_PutWrite_Indices_Methodology.pdf) — how the PUT index sells at-the-money SPX puts each month, collateralised by T-bills.
- [Bondarenko (2019): study of the PUT index](https://cdn.cboe.com/resources/education/research_publications/PutWriteCBOE19_v14_by_Prof_Oleg_Bondarenko_as_of_June_14.pdf) — long-run performance and risks of index put-writing since 1986.
- [Cboe: the volatility risk premium and the PUT index](https://www.cboe.com/insights/posts/white-paper-shows-volatility-risk-premium-facilitated-higher-risk-adjusted-returns-for-put-index/) — why implied volatility has tended to exceed realized volatility.
- [CFA Institute: how well does the market predict volatility?](https://blogs.cfainstitute.org/investor/2024/07/31/how-well-does-the-market-predict-volatility/) — a long comparison of the VIX with subsequent realized volatility.
- [OCC: Characteristics and Risks of Standardized Options](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the official statement of a put writer's obligations and risks.

## @next
Selling a put is selling insurance. What Kai's 100 shares need most is the opposite: **buying insurance**. In the next lesson Kai buys the 95 put for 0.51 to put a floor under the shares — and then pays for it with the rent from a 105 call: the collar.
