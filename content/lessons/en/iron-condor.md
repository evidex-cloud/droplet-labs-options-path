---
id: iron-condor
prereqs: straddle-strangle, vertical-spreads, theta, gamma, probability-ev
demo: iron-condor
---

# Iron Condors & Short Strangles: Renting Out a Range

## @hook
Sell the XYZ 95 put and 105 call, buy the 90 put and 110 call as insurance, and you collect $102 that you keep if XYZ stays between about 94 and 106. It wins about 71% of the time. The question this lesson answers is why that high win rate is, by itself, worth exactly nothing — and what actually makes the trade pay.

## @bridge
In [[straddle-strangle]] we met the seller of volatility: the short strangle, which wins when the stock moves less than the market priced, and whose losses have no floor. [[vertical-spreads]] showed how a second option caps a loss at the width of a spread. Put those together and you get the iron condor. This lesson answers: **what are you really selling when you rent out a price range, and how do the tails decide the result?** It builds Idea ③ (you are short realized versus implied volatility) and Idea ④ (risk: a capped but lumpy loss, concentrated near expiry).

## @intuition
Think of a landlord. The landlord hands over a flat for a month and collects rent up front. Most months nothing happens and the rent is profit. Now and then a tenant floods the kitchen, and the repair costs several months of rent. A good landlord buys insurance that caps the repair bill.

An **iron condor** is that landlord in options. You rent out the range 95–105 on XYZ for a month:

> [!EXAMPLE] The XYZ iron condor (30 days, σ = 20%, r = 4%, for illustration)
> - Sell the 95 put for 0.51 and buy the 90 put for 0.06 → a bull put spread, credit 0.45.
> - Sell the 105 call for 0.71 and buy the 110 call for 0.14 → a bear call spread, credit 0.57.
> - Net credit \(0.45 + 0.57 = 1.02\) per share, or **$102** for the set of four contracts.
> - Each spread is \(5\) wide, and at expiry at most one of them can be in the money, so the worst case is \(5 - 1.02 = 3.98\) per share, **−$398**.

Between 95 and 105 all four options expire worthless and you keep the $102. Beyond the short strikes you start paying back, and beyond the long strikes (90 and 110) the insurance kicks in and the loss stops growing. The breakevens are the short strikes pushed out by the credit: **93.98 and 106.02**.

Take the two long "wings" away and you have the **short strangle** from the last lesson: $122 of credit, a slightly wider winning range (93.78–106.22) and no floor under the loss.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Iron condor and short strangle at expiry"><defs><marker id="iron-condor-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs><polygon points="60.0,78.6 60.0,152.9 63.8,152.9 67.6,152.9 71.5,152.9 75.3,152.9 79.1,152.9 82.9,152.9 86.7,152.9 90.6,152.9 94.4,152.9 98.2,152.9 102.0,152.9 105.8,152.9 109.7,152.9 113.5,152.9 117.3,152.9 121.1,152.9 124.9,152.9 128.8,152.9 132.6,152.9 136.4,152.9 140.2,152.9 144.0,152.9 147.8,152.9 151.7,152.9 155.5,152.9 159.3,152.9 163.1,152.9 166.9,152.9 170.8,152.9 174.6,152.9 178.4,152.9 182.2,152.9 186.0,148.2 189.9,143.5 193.7,138.9 197.5,134.2 201.3,129.5 205.1,124.8 209.0,120.2 212.8,115.5 216.6,110.8 220.4,106.2 224.2,101.5 228.1,96.8 231.9,92.2 235.7,87.5 239.5,82.8 243.0,78.6 243.0,78.6" class="fx-area-bad"/><polygon points="243.0,78.6 243.0,78.6 243.3,78.1 247.2,73.5 251.0,68.8 254.8,64.1 258.6,59.5 262.4,59.5 266.3,59.5 270.1,59.5 273.9,59.5 277.7,59.5 281.5,59.5 285.3,59.5 289.2,59.5 293.0,59.5 296.8,59.5 300.6,59.5 304.4,59.5 308.3,59.5 312.1,59.5 315.9,59.5 319.7,59.5 323.5,59.5 327.4,59.5 331.2,59.5 335.0,59.5 338.8,59.5 342.6,59.5 346.5,59.5 350.3,59.5 354.1,59.5 357.9,59.5 361.7,59.5 365.6,59.5 369.4,59.5 373.2,59.5 377.0,59.5 380.8,59.5 384.7,59.5 388.5,59.5 392.3,59.5 396.1,59.5 399.9,59.5 403.8,59.5 407.6,59.5 411.4,59.5 415.2,64.1 419.0,68.8 422.8,73.5 426.7,78.1 427.0,78.6 427.0,78.6" class="fx-area-ok"/><polygon points="427.0,78.6 427.0,78.6 430.5,82.8 434.3,87.5 438.1,92.2 441.9,96.8 445.8,101.5 449.6,106.2 453.4,110.8 457.2,115.5 461.0,120.2 464.9,124.8 468.7,129.5 472.5,134.2 476.3,138.9 480.1,143.5 484.0,148.2 487.8,152.9 491.6,152.9 495.4,152.9 499.2,152.9 503.1,152.9 506.9,152.9 510.7,152.9 514.5,152.9 518.3,152.9 522.2,152.9 526.0,152.9 529.8,152.9 533.6,152.9 537.4,152.9 541.3,152.9 545.1,152.9 548.9,152.9 552.7,152.9 556.5,152.9 560.3,152.9 564.2,152.9 568.0,152.9 571.8,152.9 575.6,152.9 579.4,152.9 583.3,152.9 587.1,152.9 590.9,152.9 594.7,152.9 598.5,152.9 602.4,152.9 606.2,152.9 610.0,152.9 610.0,78.6" class="fx-area-bad"/><line x1="105.8" y1="30.0" x2="105.8" y2="200.0" class="fx-grid"/><line x1="182.2" y1="30.0" x2="182.2" y2="200.0" class="fx-grid"/><line x1="258.6" y1="30.0" x2="258.6" y2="200.0" class="fx-grid"/><line x1="335.0" y1="30.0" x2="335.0" y2="200.0" class="fx-grid"/><line x1="411.4" y1="30.0" x2="411.4" y2="200.0" class="fx-grid"/><line x1="487.8" y1="30.0" x2="487.8" y2="200.0" class="fx-grid"/><line x1="564.2" y1="30.0" x2="564.2" y2="200.0" class="fx-grid"/><line x1="55.0" y1="78.6" x2="620.0" y2="78.6" class="fx-axis" marker-end="url(#iron-condor-ah)"/><polyline points="144.0,195.9 147.8,191.2 151.7,186.5 155.5,181.8 159.3,177.2 163.1,172.5 166.9,167.8 170.8,163.2 174.6,158.5 178.4,153.8 182.2,149.2 186.0,144.5 189.9,139.8 193.7,135.1 197.5,130.5 201.3,125.8 205.1,121.1 209.0,116.5 212.8,111.8 216.6,107.1 220.4,102.4 224.2,97.8 228.1,93.1 231.9,88.4 235.7,83.8 239.5,79.1 243.3,74.4 247.2,69.8 251.0,65.1 254.8,60.4 258.6,55.7 262.4,55.7 266.3,55.7 270.1,55.7 273.9,55.7 277.7,55.7 281.5,55.7 285.3,55.7 289.2,55.7 293.0,55.7 296.8,55.7 300.6,55.7 304.4,55.7 308.3,55.7 312.1,55.7 315.9,55.7 319.7,55.7 323.5,55.7 327.4,55.7 331.2,55.7 335.0,55.7 338.8,55.7 342.6,55.7 346.5,55.7 350.3,55.7 354.1,55.7 357.9,55.7 361.7,55.7 365.6,55.7 369.4,55.7 373.2,55.7 377.0,55.7 380.8,55.7 384.7,55.7 388.5,55.7 392.3,55.7 396.1,55.7 399.9,55.7 403.8,55.7 407.6,55.7 411.4,55.7 415.2,60.4 419.0,65.1 422.8,69.8 426.7,74.4 430.5,79.1 434.3,83.8 438.1,88.4 441.9,93.1 445.8,97.8 449.6,102.4 453.4,107.1 457.2,111.8 461.0,116.5 464.9,121.1 468.7,125.8 472.5,130.5 476.3,135.1 480.1,139.8 484.0,144.5 487.8,149.2 491.6,153.8 495.4,158.5 499.2,163.2 503.1,167.8 506.9,172.5 510.7,177.2 514.5,181.8 518.3,186.5 522.2,191.2 526.0,195.9" class="fx-line-bad fx-dash"/><polyline points="60.0,152.9 63.8,152.9 67.6,152.9 71.5,152.9 75.3,152.9 79.1,152.9 82.9,152.9 86.7,152.9 90.6,152.9 94.4,152.9 98.2,152.9 102.0,152.9 105.8,152.9 109.7,152.9 113.5,152.9 117.3,152.9 121.1,152.9 124.9,152.9 128.8,152.9 132.6,152.9 136.4,152.9 140.2,152.9 144.0,152.9 147.8,152.9 151.7,152.9 155.5,152.9 159.3,152.9 163.1,152.9 166.9,152.9 170.8,152.9 174.6,152.9 178.4,152.9 182.2,152.9 186.0,148.2 189.9,143.5 193.7,138.9 197.5,134.2 201.3,129.5 205.1,124.8 209.0,120.2 212.8,115.5 216.6,110.8 220.4,106.2 224.2,101.5 228.1,96.8 231.9,92.2 235.7,87.5 239.5,82.8 243.3,78.1 247.2,73.5 251.0,68.8 254.8,64.1 258.6,59.5 262.4,59.5 266.3,59.5 270.1,59.5 273.9,59.5 277.7,59.5 281.5,59.5 285.3,59.5 289.2,59.5 293.0,59.5 296.8,59.5 300.6,59.5 304.4,59.5 308.3,59.5 312.1,59.5 315.9,59.5 319.7,59.5 323.5,59.5 327.4,59.5 331.2,59.5 335.0,59.5 338.8,59.5 342.6,59.5 346.5,59.5 350.3,59.5 354.1,59.5 357.9,59.5 361.7,59.5 365.6,59.5 369.4,59.5 373.2,59.5 377.0,59.5 380.8,59.5 384.7,59.5 388.5,59.5 392.3,59.5 396.1,59.5 399.9,59.5 403.8,59.5 407.6,59.5 411.4,59.5 415.2,64.1 419.0,68.8 422.8,73.5 426.7,78.1 430.5,82.8 434.3,87.5 438.1,92.2 441.9,96.8 445.8,101.5 449.6,106.2 453.4,110.8 457.2,115.5 461.0,120.2 464.9,124.8 468.7,129.5 472.5,134.2 476.3,138.9 480.1,143.5 484.0,148.2 487.8,152.9 491.6,152.9 495.4,152.9 499.2,152.9 503.1,152.9 506.9,152.9 510.7,152.9 514.5,152.9 518.3,152.9 522.2,152.9 526.0,152.9 529.8,152.9 533.6,152.9 537.4,152.9 541.3,152.9 545.1,152.9 548.9,152.9 552.7,152.9 556.5,152.9 560.3,152.9 564.2,152.9 568.0,152.9 571.8,152.9 575.6,152.9 579.4,152.9 583.3,152.9 587.1,152.9 590.9,152.9 594.7,152.9 598.5,152.9 602.4,152.9 606.2,152.9 610.0,152.9" class="fx-line-thick"/><text x="105.8" y="218.0" text-anchor="middle" class="fx-t-sm">85</text><text x="182.2" y="218.0" text-anchor="middle" class="fx-t-sm">90</text><text x="258.6" y="218.0" text-anchor="middle" class="fx-t-sm">95</text><text x="335.0" y="218.0" text-anchor="middle" class="fx-t-sm">100</text><text x="411.4" y="218.0" text-anchor="middle" class="fx-t-sm">105</text><text x="487.8" y="218.0" text-anchor="middle" class="fx-t-sm">110</text><text x="564.2" y="218.0" text-anchor="middle" class="fx-t-sm">115</text><text x="610.0" y="238.0" text-anchor="end" class="fx-t-sm">XYZ price at expiry</text><circle cx="243.0" cy="78.6" r="4.5" class="fx-fill-ink"/><circle cx="427.0" cy="78.6" r="4.5" class="fx-fill-ink"/><text x="237.0" y="70.6" text-anchor="end" class="fx-t-b">93.98</text><text x="433.0" y="70.6" class="fx-t-b">106.02</text><text x="335.0" y="42" text-anchor="middle" class="fx-t-ok">max profit +1.02 (95 to 105)</text><text x="335.0" y="156.9" text-anchor="middle" class="fx-t-bad">max loss −3.98 = 5 − 1.02</text><text x="335.0" y="201" text-anchor="middle" class="fx-t-bad">red dashed: short strangle, no wings, loss keeps growing</text><text x="166.9" y="37.5" text-anchor="middle" class="fx-t-sm">long 90 put (wing)</text><text x="503.1" y="37.5" text-anchor="middle" class="fx-t-sm">long 110 call (wing)</text></svg>
<figcaption>Figure 1 · The iron condor at expiry (solid, per share): a flat top of +1.02 between the short strikes, sloped sides, and a flat bottom of −3.98 beyond the wings. The short strangle (red dashed) collects a little more but keeps losing a dollar for every dollar beyond its breakevens.</figcaption>
</figure>

So far this looks like a good deal: you win in a 12-dollar-wide band around today's price. But the market is not naive. The same option prices that paid you $1.02 also contain the market's view of how likely each outcome is. Under those prices, the chance of finishing inside the breakevens is about **71%**, and the chance of the full −$398 is about **8%**. Seventy-one per cent of the time you make a little; eight per cent of the time you lose almost four times as much. Priced at fair implied vol, the two sides cancel.

> [!THINK] A trade wins 71% of the time. Is it a good trade?
> Predict first: what else do you need to know?
> ---
> The size of the wins and the losses. At fair vol the condor wins about 0.96 on average when it wins and loses about 2.33 when it loses: \(0.708 \times 0.96 - 0.292 \times 2.33 \approx 0\). The win rate is simply the other face of the payoff shape. A lottery ticket has a 1% win rate and can still be a good bet; a condor can have a 90% win rate and still be a bad one.

The edge, if there is one, comes from the same place as in [[straddle-strangle]], with the sign flipped: the condor seller wins on average **only if XYZ realizes less volatility than the 20% implied** in the prices — and the tails of the real distribution are thin enough not to eat that gain.

We'll take it in five parts:

- **① Anatomy: four legs, one credit, one worst case**
- **② Probability of profit and the price of a win rate**
- **③ Where the edge comes from: short realized vol, long time**
- **④ The tails: wings, gaps and fat-tailed days**
- **⑤ Managing condors, 0DTE and the state of play (2026)**

## @mechanics
### ① Anatomy: four legs, one credit, one worst case

An iron condor is a **short strangle plus a long strangle further out**, or equivalently a bull put spread plus a bear call spread. With short strikes \(K_2 < K_3\), long wings \(K_1 < K_2\) and \(K_4 > K_3\), and equal widths \(W = K_2 - K_1 = K_4 - K_3\):

$$
\begin{gathered}C = \underbrace{(P_{K_2} - P_{K_1})}_{\text{put spread credit}} + \underbrace{(C_{K_3} - C_{K_4})}_{\text{call spread credit}} \\ \text{max loss} = W - C \\ \text{BE} = K_2 - C,\ K_3 + C\end{gathered}
$$

where \(P_K\) and \(C_K\) are the put and call prices at strike \(K\) and \(C\) is the net credit.

| Leg (30-day XYZ) | Side | Price | Role |
|---|---|---|---|
| 90 put | buy | 0.06 | lower wing (insurance) |
| 95 put | sell | 0.51 | lower edge of the range |
| 105 call | sell | 0.71 | upper edge of the range |
| 110 call | buy | 0.14 | upper wing (insurance) |
| **Net** | | **+1.02 credit** | max loss 3.98; BE 93.98 / 106.02 |

The **return on risk** is \(C/(W - C) = 1.02/3.98 \approx 25.7\%\) for a month. Written that way it looks spectacular, which is exactly why it needs the next section. (Margin for a defined-risk condor is typically the width minus the credit, \(\$398\) here, because only one side can lose at expiry — see [[margin-approval]].)

### ② Probability of profit and the price of a win rate

Under the risk-neutral distribution (see [[probability-ev]] and [[risk-neutral]]), the probability that the condor finishes inside its breakevens is

$$
\begin{aligned}\text{POP} &= \Q(K_2 - C < S_T < K_3 + C) \\ &= \N\big(d_2(K_2 - C)\big) - \N\big(d_2(K_3 + C)\big)\end{aligned}
$$

where \(d_2(x)\) is the Black-Scholes \(d_2\) with the strike replaced by \(x\), so \(\N(d_2(x)) = \Q(S_T > x)\).

> [!EXAMPLE] XYZ condor probabilities (risk-neutral, σ = 20%)
> \(\Q(S_T > 93.98) = 0.8669\) and \(\Q(S_T > 106.02) = 0.1608\), so \(\text{POP} = 0.8669 - 0.1608 \approx 70.6\%\).
> Full profit (between 95 and 105): about 61.7%. Full loss (below 90 or above 110): about 8.2%.

Then comes the identity that every income trader should tape to the screen. Expected profit is win rate times average win minus loss rate times average loss:

$$
\E[\Pi] = p\,\bar W - (1 - p)\,\bar L
$$

where \(p\) is the probability of profit, \(\bar W\) the average gain when you win and \(\bar L\) the average loss when you lose. For the condor at fair vol: \(0.708 \times 0.96 - 0.292 \times 2.33 \approx 0\). **A high \(p\) is bought with a large \(\bar L\).** Options priced at the right volatility give no free lunch whichever shape you pick — that is Idea ② showing up inside a strategy.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Renting out a range: probability zones"><polygon points="247.3,196.0 247.3,114.8 250.5,110.8 253.8,106.9 257.0,102.9 260.2,99.1 263.5,95.2 266.7,91.5 269.9,87.9 273.2,84.3 276.4,80.9 279.7,77.7 282.9,74.6 286.1,71.7 289.4,69.0 292.6,66.5 295.9,64.2 299.1,62.2 302.3,60.4 305.6,58.8 308.8,57.5 312.0,56.5 315.3,55.7 318.5,55.2 321.8,55.0 325.0,55.0 328.2,55.3 331.5,55.9 334.7,56.7 338.0,57.8 341.2,59.1 344.4,60.7 347.7,62.5 350.9,64.5 354.1,66.7 357.4,69.1 360.6,71.6 363.9,74.4 367.1,77.2 370.3,80.3 373.6,83.4 376.8,86.6 380.1,89.9 383.3,93.3 386.5,96.7 389.8,100.2 393.0,103.7 396.3,107.2 399.5,110.8 402.7,114.3 402.7,196.0" class="fx-area-ok"/><polygon points="40.0,196.0 40.0,196.0 43.2,196.0 46.5,196.0 49.7,196.0 53.0,196.0 56.2,196.0 59.4,195.9 62.7,195.9 65.9,195.9 69.1,195.9 72.4,195.9 75.6,195.8 78.9,195.8 82.1,195.8 85.3,195.7 88.6,195.7 91.8,195.6 95.1,195.5 98.3,195.4 101.5,195.3 104.8,195.2 108.0,195.1 111.3,194.9 114.5,194.7 117.7,194.5 121.0,194.2 124.2,193.9 127.4,193.6 130.7,193.2 133.9,192.8 137.2,192.3 140.4,191.8 143.6,191.2 146.9,190.6 150.1,189.8 153.4,189.0 156.6,188.1 159.8,187.1 163.1,186.0 166.3,184.8 169.5,183.5 172.8,182.1 176.0,180.5 179.3,178.8 182.5,177.1 185.7,175.1 189.0,173.1 192.2,170.9 195.5,168.5 195.5,196.0" class="fx-area-bad"/><polygon points="454.5,196.0 454.5,162.2 457.8,164.4 461.0,166.6 464.3,168.6 467.5,170.5 470.7,172.3 474.0,174.0 477.2,175.6 480.5,177.1 483.7,178.5 486.9,179.9 490.2,181.1 493.4,182.3 496.6,183.4 499.9,184.5 503.1,185.4 506.4,186.3 509.6,187.1 512.8,187.9 516.1,188.6 519.3,189.3 522.6,189.9 525.8,190.4 529.0,190.9 532.3,191.4 535.5,191.8 538.8,192.2 542.0,192.6 545.2,192.9 548.5,193.2 551.7,193.5 554.9,193.8 558.2,194.0 561.4,194.2 564.7,194.4 567.9,194.6 571.1,194.7 574.4,194.8 577.6,195.0 580.9,195.1 584.1,195.2 587.3,195.3 590.6,195.4 593.8,195.4 597.0,195.5 600.3,195.5 603.5,195.6 606.8,195.6 610.0,195.7 610.0,196.0" class="fx-area-bad"/><line x1="35.0" y1="196.0" x2="620.0" y2="196.0" class="fx-axis"/><polyline points="40.0,196.0 43.2,196.0 46.5,196.0 49.7,196.0 53.0,196.0 56.2,196.0 59.4,195.9 62.7,195.9 65.9,195.9 69.1,195.9 72.4,195.9 75.6,195.8 78.9,195.8 82.1,195.8 85.3,195.7 88.6,195.7 91.8,195.6 95.1,195.5 98.3,195.4 101.5,195.3 104.8,195.2 108.0,195.1 111.3,194.9 114.5,194.7 117.7,194.5 121.0,194.2 124.2,193.9 127.4,193.6 130.7,193.2 133.9,192.8 137.2,192.3 140.4,191.8 143.6,191.2 146.9,190.6 150.1,189.8 153.4,189.0 156.6,188.1 159.8,187.1 163.1,186.0 166.3,184.8 169.5,183.5 172.8,182.1 176.0,180.5 179.3,178.8 182.5,177.1 185.7,175.1 189.0,173.1 192.2,170.9 195.5,168.5 198.7,166.1 201.9,163.4 205.2,160.7 208.4,157.8 211.6,154.8 214.9,151.6 218.1,148.3 221.4,144.9 224.6,141.4 227.8,137.8 231.1,134.1 234.3,130.4 237.6,126.5 240.8,122.7 244.0,118.7 247.3,114.8 250.5,110.8 253.8,106.9 257.0,102.9 260.2,99.1 263.5,95.2 266.7,91.5 269.9,87.9 273.2,84.3 276.4,80.9 279.7,77.7 282.9,74.6 286.1,71.7 289.4,69.0 292.6,66.5 295.9,64.2 299.1,62.2 302.3,60.4 305.6,58.8 308.8,57.5 312.0,56.5 315.3,55.7 318.5,55.2 321.8,55.0 325.0,55.0 328.2,55.3 331.5,55.9 334.7,56.7 338.0,57.8 341.2,59.1 344.4,60.7 347.7,62.5 350.9,64.5 354.1,66.7 357.4,69.1 360.6,71.6 363.9,74.4 367.1,77.2 370.3,80.3 373.6,83.4 376.8,86.6 380.1,89.9 383.3,93.3 386.5,96.7 389.8,100.2 393.0,103.7 396.3,107.2 399.5,110.8 402.7,114.3 406.0,117.8 409.2,121.3 412.4,124.7 415.7,128.1 418.9,131.4 422.2,134.6 425.4,137.8 428.6,140.9 431.9,143.9 435.1,146.8 438.4,149.6 441.6,152.4 444.8,155.0 448.1,157.5 451.3,159.9 454.5,162.2 457.8,164.4 461.0,166.6 464.3,168.6 467.5,170.5 470.7,172.3 474.0,174.0 477.2,175.6 480.5,177.1 483.7,178.5 486.9,179.9 490.2,181.1 493.4,182.3 496.6,183.4 499.9,184.5 503.1,185.4 506.4,186.3 509.6,187.1 512.8,187.9 516.1,188.6 519.3,189.3 522.6,189.9 525.8,190.4 529.0,190.9 532.3,191.4 535.5,191.8 538.8,192.2 542.0,192.6 545.2,192.9 548.5,193.2 551.7,193.5 554.9,193.8 558.2,194.0 561.4,194.2 564.7,194.4 567.9,194.6 571.1,194.7 574.4,194.8 577.6,195.0 580.9,195.1 584.1,195.2 587.3,195.3 590.6,195.4 593.8,195.4 597.0,195.5 600.3,195.5 603.5,195.6 606.8,195.6 610.0,195.7" class="fx-line-hl"/><line x1="195.5" y1="40.0" x2="195.5" y2="196.0" class="fx-line-muted fx-dash"/><line x1="247.0" y1="40.0" x2="247.0" y2="196.0" class="fx-line-muted fx-dash"/><line x1="403.0" y1="40.0" x2="403.0" y2="196.0" class="fx-line-muted fx-dash"/><line x1="454.5" y1="40.0" x2="454.5" y2="196.0" class="fx-line-muted fx-dash"/><text x="65.9" y="212.0" text-anchor="middle" class="fx-t-sm">80</text><text x="195.5" y="212.0" text-anchor="middle" class="fx-t-sm">90</text><text x="325.0" y="212.0" text-anchor="middle" class="fx-t-sm">100</text><text x="454.5" y="212.0" text-anchor="middle" class="fx-t-sm">110</text><text x="584.1" y="212.0" text-anchor="middle" class="fx-t-sm">120</text><text x="325.0" y="34.0" text-anchor="middle" class="fx-t-ok">93.98–106.02: profit, about 71%</text><text x="117.7" y="150.0" text-anchor="middle" class="fx-t-bad">below 90:</text><text x="117.7" y="166.0" text-anchor="middle" class="fx-t-bad">full loss</text><text x="532.3" y="150.0" text-anchor="middle" class="fx-t-bad">above 110:</text><text x="532.3" y="166.0" text-anchor="middle" class="fx-t-bad">full loss</text><text x="40.0" y="238.0" class="fx-t-sm">Risk-neutral distribution (σ = 20%, 30 days). Red tails together about 8%; green middle about 71%.</text></svg>
<figcaption>Figure 2 · Renting out a range. Under the prices you traded at, about 71% of outcomes land in the green zone (you keep money) and about 8% in the red tails (you lose the full 3.98). The credit is the market's price for that red area plus the sloped zones in between — which is why, at fair vol, the expected profit is zero.</figcaption>
</figure>

### ③ Where the edge comes from: short realized vol, long time

If the prices are fair, where can a condor seller make money? From one place: the **real** distribution being narrower than the one in the prices. Under realized volatility \(\sigma_{\text{real}}\) the expected profit is

$$
\E_{\P}[\Pi] = \int \Pi(x)\, f_{\P}(x)\,\dd x
$$

where \(\Pi(x)\) is the expiry P&L and \(f_{\P}\) the real-world density of \(S_T\) (lognormal with \(\sigma_{\text{real}}\) in the demo). Simulating XYZ with 4% drift:

| Realized vol | 12% | 15% | 20% (= implied) | 25% | 30% |
|---|---|---|---|---|---|
| Win rate | 92% | 84% | 71% | 60% | 52% |
| Expected P&L per share | +0.79 | +0.52 | 0.00 | −0.50 | −0.93 |

Five vol points of realized-below-implied turn a zero-edge trade into +$52 a month per condor. Five points the other way cost about as much. This is the variance risk premium from the seller's chair ([[variance-risk-premium]]).

The Greeks say the same thing. At entry the condor has \(\Delta \approx -0.03\), \(\Gamma \approx -0.064\), vega \(\approx -0.105\) per vol point and \(\Theta \approx +0.035\) per day: **short gamma, short vega, long time.** If XYZ sits at 100, the position earns its credit gradually — about +0.35 after 9 days, +0.66 after 16, +0.94 with a week left — while a 1-point rise in implied vol costs about 0.11 at once.

::demo[iron-condor-tail]

### ④ The tails: wings, gaps and fat-tailed days

Real returns are not lognormal. Stocks gap on news; indexes have crash days far beyond anything a 20% normal distribution allows ([[bs-assumptions]]). For a volatility seller, **the shape of the tail matters as much as the average volatility.**

> [!EXAMPLE] Same total volatility, different tail (simulation)
> Suppose XYZ diffuses at 15% but has a 10% chance each month of a −12% gap. Its total realized vol is then about 20% — the same as implied. Yet the two short-vol structures fare very differently:
> - iron condor: win rate about 76%, expected P&L about **+0.15**, worst 1% of outcomes **−3.98** (the wing holds);
> - short strangle: win rate about 77%, expected P&L about **+0.06**, worst 1% about **−10.38**.
>
> Without the gap (plain 15% diffusion), the strangle beats the condor (+0.69 versus +0.52 per share). The wings cost you about 0.20 of credit in quiet times and buy you a floor in violent ones.

The wings are not free, and they are not magic. They turn an open-ended loss into a known one, which makes the position **sizable**: you can decide in advance that a −$398 month is acceptable ([[position-sizing]]). A short strangle's worst month is whatever the market decides.

> [!WARN] “Defined risk” is defined per position, not per portfolio
> Ten condors on ten different tech stocks are not ten independent bets: in a sector sell-off they all hit their put wings together. The maximum loss of the portfolio is the sum of the maximum losses. Correlated short-premium positions are the classic way that "small, frequent wins" strategies blow up ([[portfolio-risk]]).

### ⑤ Managing condors, 0DTE and the state of play (2026)

Gamma is where condor risk hides over time. At entry the XYZ condor's gamma is −0.064. With three days left and XYZ sitting at the short 95 strike, it is about **−0.229** — three and a half times larger — and the delta is near +0.49: every dollar XYZ falls now costs close to half a dollar. The same theta that pays you near the centre ([[theta]]) arrives with much sharper gamma near the edges.

That is why widely taught management rules revolve around time and profit, not prediction. Common rules of thumb — described here as practice, not recommendations — include: take profits when a large share of the credit (often half) has been earned; close or roll positions with a few weeks left rather than holding into the last days; and set a maximum loss in advance, often a multiple of the credit. Each rule trades some expected profit for less exposure to the sharp-gamma end of the trade. None changes the core bet on realized versus implied volatility.

Two mechanics catch beginners. **Early assignment:** XYZ options are American, so a short leg that goes deep in the money (especially a short call before an ex-dividend date) can be assigned early, leaving you with stock and a long wing ([[exercise-assignment]]). **Pin risk:** if XYZ closes right at a short strike on expiry day, you may not know whether you'll be assigned — and an after-hours move can turn that into an unhedged stock position over the weekend.

> [!FACT] Same-day condors (as of 2026)
> Iron condors and iron flies are common structures in index options that expire the same day (0DTE, see [[zero-dte]]). As of July 2026, 0DTE contracts were a record 66.2% of SPX options volume (Cboe). Cboe's own analysis (May 2025) found that over 95% of SPX 0DTE trades were limited-risk — long options or spreads such as condors — with naked short positions about 4%; Cboe is an interested party. With hours rather than weeks to expiry, a condor's gamma near its short strikes is enormous, so the same shape behaves far more violently.

## @analogy
Renting out a holiday flat captures the condor well. You collect a month's rent up front (the credit). If the guests behave, it's all profit (XYZ stays between 95 and 105). If they damage something small, you pay part of the rent back in repairs (XYZ ends between the short strike and the wing). If they flood the place, your insurance policy caps the bill (the long wings) — but you still pay the deductible, which is several months of rent (the $398 maximum loss). And you paid the insurance premium every month, whether or not you needed it (the 0.20 of credit the wings cost).

The rent you can charge is set by a market that knows how often guests cause trouble. If you charge the going rate, your average profit over many months is roughly zero after the occasional flood. You only make real money if your guests are *calmer than the market thinks* — realized volatility below implied.

Where the analogy breaks: floods in flats are mostly independent, but market "floods" arrive together. When the whole market sells off, every flat floods on the same day.

## @misconceptions
- **“A 70% win rate means the trade has an edge.”** — Win rate is set by the payoff shape. At fair implied vol the condor's small, frequent wins and larger, rarer losses cancel to about zero.
- **“A 25.7% return on risk in a month is a fantastic yield.”** — That is the best case. It comes with a roughly 8% chance of losing the full $398, and the average, at fair vol, is about zero.
- **“Wings make the condor safe.”** — Wings make the loss *known*, not small: −$398 against +$102. Many condors on correlated stocks can all hit their wings on the same day.
- **“Theta is free money for sellers.”** — Theta is payment for short gamma. It is largest exactly when the stock is near your short strikes late in the trade, where gamma is sharpest.
- **“A short strangle is just a condor without the cost of wings, so it's better.”** — In calm markets it earns more; in markets with gaps it can lose several times the condor's maximum. Which is better depends on the tails, not the average vol.

## @takeaways
- An iron condor is a short strangle with long wings: credit \(C\), maximum loss \(W - C\), breakevens at the short strikes pushed out by \(C\).
- The XYZ condor collects $102, risks $398 and wins about 71% of the time under the prices it trades at — and that high win rate is paid for with a large average loss.
- \(\E[\Pi] = p\bar W - (1-p)\bar L\) is zero at fair vol; the only edge is realized volatility (and tail shape) below what the prices imply.
- Condors are short gamma and short vega, long theta; the gamma concentrates near the short strikes as expiry approaches.
- Wings turn an unbounded loss into a known one, which makes sizing possible but does not protect a portfolio of correlated condors.

## @quiz
1. The XYZ iron condor (short 95/105, long 90/110) collects 1.02. What is its maximum loss per share?
   - [ ] 1.02
   - [ ] 5.00
   - [x] 3.98
   - [ ] 8.98
   > Only one spread can finish in the money at expiry, so the worst case is one width minus the credit: \(5 - 1.02 = 3.98\).
2. A condor wins 71% of the time under the prices it traded at. What does that tell you about its expected profit at fair implied vol?
   - [ ] It is strongly positive, because most outcomes are wins
   - [x] Roughly zero: the average loss is large enough to offset the frequent small wins
   - [ ] It is negative, because sellers always lose to buyers
   - [ ] It cannot be computed without knowing the stock's direction
   > \(\E[\Pi] = p\bar W - (1-p)\bar L \approx 0.708 \times 0.96 - 0.292 \times 2.33 \approx 0\). The win rate is part of the payoff shape, not an edge.
3. Which situation gives a condor seller a positive expected profit, holding the condor to expiry?
   - [ ] Implied vol rises after the trade is opened
   - [ ] XYZ trends up steadily by 10% over the month
   - [x] XYZ realizes 15% volatility with no large gaps, while the options were priced at 20%
   - [ ] XYZ realizes exactly 20% with occasional large gaps
   > The seller is short realized versus implied: at 15% realized the simulated expected profit is about +0.52 per share. A 10% trend breaks the call wing; rising implied vol hurts a short-vega position.
4. XYZ diffuses at 15% but has a 10% monthly chance of a −12% gap (total vol about 20%). Why does the condor hold up better than the short strangle?
   - [ ] The condor has more theta
   - [x] The long 90 put caps the loss in the gap, while the strangle's loss keeps growing
   - [ ] The condor is long vega
   - [ ] The gap makes both lose exactly the same amount
   > In the simulation the strangle's worst 1% is about −10.38 per share, the condor's −3.98. Wings pay off in exactly the tail the average vol hides.
5. With three days left and XYZ sitting at 95, the condor's gamma is about −0.229 versus −0.064 at entry. What does that imply?
   - [x] Small moves now change the P&L much faster, so risk has concentrated near expiry
   - [ ] The position has become safer because time is almost up
   - [ ] The condor is now long volatility
   - [ ] Nothing, since gamma only matters for long options
   > Short gamma near a short strike late in the trade means delta swings quickly (it is already about +0.49); this is why many management rules avoid holding into the last days.

## @further
- [Iron condor (Wikipedia)](https://en.wikipedia.org/wiki/Iron_condor) — construction, payoff and variants.
- [0DTEs Decoded: positioning trends and market impact (Cboe, 2025)](https://www.cboe.com/insights/posts/0-dt-es-decoded-positioning-trends-and-market-impact) — who trades same-day SPX options and how much of it is defined-risk.
- [FINRA: Zeroing in on options trading strategies](https://www.finra.org/investors/insights/zeroing-in-options-trading-strategy) — the regulator's plain-language risk notes for short-dated option strategies.
- [Cboe S&P 500 PutWrite Index methodology](https://cdn.cboe.com/api/global/us_indices/governance/Cboe_SP_500_PutWrite_Indices_Methodology.pdf) — a long-running, rules-based example of systematically selling index premium.

## @next
The condor rents out a wide range. What if you have a sharper view — that XYZ will finish *near* one price? The next lesson flips the condor into a butterfly: a cheap bet on a landing zone, and a window into the probabilities hidden in option prices.
