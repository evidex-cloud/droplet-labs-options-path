---
id: linear-vs-convex
prereqs: welcome, derivatives, why-options
demo: linear-vs-convex
---

# Linear vs Convex: What Really Separates Options, Stocks & Futures

## @hook
A share's profit is a straight line; an option's is a hockey stick. That one kink means an option gains more from a move one way than it loses from the same move the other way — and so **uncertainty itself is worth money**. This is why an option has a price at all, and why that price depends on how much the market moves.

## @bridge
[[derivatives]] split the family into obligations with straight-line payoffs and rights with bent ones, and [[why-options]] showed four uses for the bent ones. This lesson looks at the bend itself. It builds Idea ① — the shape — precisely, and plants the seed of Idea ③: by Jensen's inequality, the more a price can move, the more an option is worth. From here, [[payoff-diagrams]] turns shapes into a language, and [[gamma]] later measures the bend.

## @intuition
Take two ways to be bullish on XYZ at $100: own 100 shares, or own one 30-day 100 call bought for $2.45. Plot the profit per share at expiry against XYZ's final price.

<figure>
<svg data-fig="lvc-shapes" viewBox="0 0 640 252" role="img" aria-label="A straight line vs a hockey stick"><defs><marker id="linear-vs-convex-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs><line x1="70" y1="30" x2="70" y2="212" class="fx-grid"/><text x="70" y="228" text-anchor="middle" class="fx-t-sm">80</text><line x1="202.5" y1="30" x2="202.5" y2="212" class="fx-grid"/><text x="202.5" y="228" text-anchor="middle" class="fx-t-sm">90</text><line x1="335" y1="30" x2="335" y2="212" class="fx-grid"/><text x="335" y="228" text-anchor="middle" class="fx-t-sm">100</text><line x1="467.5" y1="30" x2="467.5" y2="212" class="fx-grid"/><text x="467.5" y="228" text-anchor="middle" class="fx-t-sm">110</text><line x1="600" y1="30" x2="600" y2="212" class="fx-grid"/><text x="600" y="228" text-anchor="middle" class="fx-t-sm">120</text><text x="62" y="214" text-anchor="end" class="fx-t-sm">−20</text><text x="62" y="170" text-anchor="end" class="fx-t-sm">−10</text><text x="62" y="82" text-anchor="end" class="fx-t-sm">+10</text><text x="62" y="130" text-anchor="end" class="fx-t-sm">0</text><text x="62" y="38" text-anchor="end" class="fx-t-sm">+20</text><line x1="70" y1="122" x2="612" y2="122" class="fx-axis" marker-end="url(#linear-vs-convex-ah)"/><polygon points="70,122 70,122 73.3,122 76.6,122 79.9,122 83.3,122 86.6,122 89.9,122 93.2,122 96.5,122 99.8,122 103.1,122 106.4,122 109.8,122 113.1,122 116.4,122 119.7,122 123,122 126.3,122 129.6,122 132.9,122 136.3,122 139.6,122 142.9,122 146.2,122 149.5,122 152.8,122 156.1,122 159.4,122 162.8,122 166.1,122 169.4,122 172.7,122 176,122 179.3,122 182.6,122 185.9,122 189.3,122 192.6,122 195.9,122 199.2,122 202.5,122 205.8,122 209.1,122 212.4,122 215.8,122 219.1,122 222.4,122 225.7,122 229,122 232.3,122 235.6,122 238.9,122 242.3,122 245.6,122 248.9,122 252.2,122 255.5,122 258.8,122 262.1,122 265.4,122 268.8,122 272.1,122 275.4,122 278.7,122 282,122 285.3,122 288.6,122 291.9,122 295.3,122 298.6,122 301.9,122 305.2,122 308.5,122 311.8,122 315.1,122 318.4,122 321.8,122 325.1,122 328.4,122 331.7,122 335,122 338.3,122 341.6,122 344.9,122 348.3,122 351.6,122 354.9,122 358.2,122 361.5,122 364.8,122 368.1,121.8 371.4,120.7 374.8,119.6 378.1,118.5 381.4,117.4 384.7,116.3 388,115.2 391.3,114.1 394.6,113 397.9,111.9 401.3,110.8 404.6,109.7 407.9,108.6 411.2,107.5 414.5,106.4 417.8,105.3 421.1,104.2 424.4,103.1 427.8,102 431.1,100.9 434.4,99.8 437.7,98.7 441,97.6 444.3,96.5 447.6,95.4 450.9,94.3 454.3,93.2 457.6,92.1 460.9,91 464.2,89.9 467.5,88.8 470.8,87.7 474.1,86.6 477.4,85.5 480.8,84.4 484.1,83.3 487.4,82.2 490.7,81.1 494,80 497.3,78.9 500.6,77.8 503.9,76.7 507.3,75.6 510.6,74.5 513.9,73.4 517.2,72.3 520.5,71.2 523.8,70.1 527.1,69 530.4,67.9 533.8,66.8 537.1,65.7 540.4,64.6 543.7,63.5 547,62.4 550.3,61.3 553.6,60.2 556.9,59.1 560.3,58 563.6,56.9 566.9,55.8 570.2,54.7 573.5,53.6 576.8,52.5 580.1,51.4 583.4,50.3 586.8,49.2 590.1,48.1 593.4,47 596.7,45.9 600,44.8 600,122" class="fx-area-ok"/><polygon points="70,122 70,132.8 73.3,132.8 76.6,132.8 79.9,132.8 83.3,132.8 86.6,132.8 89.9,132.8 93.2,132.8 96.5,132.8 99.8,132.8 103.1,132.8 106.4,132.8 109.8,132.8 113.1,132.8 116.4,132.8 119.7,132.8 123,132.8 126.3,132.8 129.6,132.8 132.9,132.8 136.3,132.8 139.6,132.8 142.9,132.8 146.2,132.8 149.5,132.8 152.8,132.8 156.1,132.8 159.4,132.8 162.8,132.8 166.1,132.8 169.4,132.8 172.7,132.8 176,132.8 179.3,132.8 182.6,132.8 185.9,132.8 189.3,132.8 192.6,132.8 195.9,132.8 199.2,132.8 202.5,132.8 205.8,132.8 209.1,132.8 212.4,132.8 215.8,132.8 219.1,132.8 222.4,132.8 225.7,132.8 229,132.8 232.3,132.8 235.6,132.8 238.9,132.8 242.3,132.8 245.6,132.8 248.9,132.8 252.2,132.8 255.5,132.8 258.8,132.8 262.1,132.8 265.4,132.8 268.8,132.8 272.1,132.8 275.4,132.8 278.7,132.8 282,132.8 285.3,132.8 288.6,132.8 291.9,132.8 295.3,132.8 298.6,132.8 301.9,132.8 305.2,132.8 308.5,132.8 311.8,132.8 315.1,132.8 318.4,132.8 321.8,132.8 325.1,132.8 328.4,132.8 331.7,132.8 335,132.8 338.3,131.7 341.6,130.6 344.9,129.5 348.3,128.4 351.6,127.3 354.9,126.2 358.2,125.1 361.5,124 364.8,122.9 368.1,122 371.4,122 374.8,122 378.1,122 381.4,122 384.7,122 388,122 391.3,122 394.6,122 397.9,122 401.3,122 404.6,122 407.9,122 411.2,122 414.5,122 417.8,122 421.1,122 424.4,122 427.8,122 431.1,122 434.4,122 437.7,122 441,122 444.3,122 447.6,122 450.9,122 454.3,122 457.6,122 460.9,122 464.2,122 467.5,122 470.8,122 474.1,122 477.4,122 480.8,122 484.1,122 487.4,122 490.7,122 494,122 497.3,122 500.6,122 503.9,122 507.3,122 510.6,122 513.9,122 517.2,122 520.5,122 523.8,122 527.1,122 530.4,122 533.8,122 537.1,122 540.4,122 543.7,122 547,122 550.3,122 553.6,122 556.9,122 560.3,122 563.6,122 566.9,122 570.2,122 573.5,122 576.8,122 580.1,122 583.4,122 586.8,122 590.1,122 593.4,122 596.7,122 600,122 600,122" class="fx-area-bad"/><line x1="70" y1="210" x2="600" y2="34" class="fx-line-blue"/><polyline points="70,132.8 76.6,132.8 83.3,132.8 89.9,132.8 96.5,132.8 103.1,132.8 109.8,132.8 116.4,132.8 123,132.8 129.6,132.8 136.3,132.8 142.9,132.8 149.5,132.8 156.1,132.8 162.8,132.8 169.4,132.8 176,132.8 182.6,132.8 189.3,132.8 195.9,132.8 202.5,132.8 209.1,132.8 215.8,132.8 222.4,132.8 229,132.8 235.6,132.8 242.3,132.8 248.9,132.8 255.5,132.8 262.1,132.8 268.8,132.8 275.4,132.8 282,132.8 288.6,132.8 295.3,132.8 301.9,132.8 308.5,132.8 315.1,132.8 321.8,132.8 328.4,132.8 335,132.8 341.6,130.6 348.3,128.4 354.9,126.2 361.5,124 368.1,121.8 374.8,119.6 381.4,117.4 388,115.2 394.6,113 401.3,110.8 407.9,108.6 414.5,106.4 421.1,104.2 427.8,102 434.4,99.8 441,97.6 447.6,95.4 454.3,93.2 460.9,91 467.5,88.8 474.1,86.6 480.8,84.4 487.4,82.2 494,80 500.6,77.8 507.3,75.6 513.9,73.4 520.5,71.2 527.1,69 533.8,66.8 540.4,64.6 547,62.4 553.6,60.2 560.3,58 566.9,55.8 573.5,53.6 580.1,51.4 586.8,49.2 593.4,47 600,44.8" class="fx-line-thick"/><circle cx="335" cy="132.8" r="5" class="fx-fill-orange"/><text x="343" y="152.8" class="fx-t-hl">the kink: K = 100</text><text x="83.25" y="112" class="fx-t-sm">call: slope 0 (lose at most 2.45)</text><text x="467.5" y="104.4" class="fx-t-sm">call: slope 1</text><text x="586.75" y="26" text-anchor="end" class="fx-t-blue">stock: slope 1 everywhere (Δ = 1)</text><text x="600" y="246" text-anchor="end" class="fx-t-sm">XYZ at expiry S<tspan baseline-shift="sub" font-size="9">T</tspan>; vertical: P&amp;L per share ($)</text></svg>
<figcaption>Figure 1 · Shares (violet) and the 100 call (black) at expiry, profit per share. The shares' line has slope 1 everywhere. The call's has slope 0 below the strike and slope 1 above it, with a kink at \(K = 100\). The kink is what "convex" means here: the line bends upward, never downward.</figcaption>
</figure>

The shares make a dollar for every dollar XYZ rises and lose a dollar for every dollar it falls, wherever XYZ is. That is a **linear** payoff. The call ignores every dollar below $100 and follows every dollar above it. Its payoff bends upward at the strike: it is **convex**.

Now the key experiment. Imagine a very simple world in which XYZ ends the month at either **$80 or $120**, each with probability one half.

- The shares end at 80 or 120. Their **average** is 100 — the same as if XYZ simply stayed at 100.
- The call pays \(\max(80 - 100, 0) = 0\) or \(\max(120 - 100, 0) = 20\). Its average payoff is \(\tfrac12 \times 0 + \tfrac12 \times 20 = 10\).
- But if XYZ ended exactly at the average price, 100, the call would pay \(\max(100 - 100, 0) = 0\).

<figure>
<svg data-fig="lvc-jensen" viewBox="0 0 720 250" role="img" aria-label="Jensen's inequality with two outcomes"><text x="180" y="22" text-anchor="middle" class="fx-t-b">Stock (linear)</text><line x1="40" y1="212" x2="320" y2="212" class="fx-axis"/><text x="86.66666666666666" y="228" text-anchor="middle" class="fx-t-sm">80</text><text x="180" y="228" text-anchor="middle" class="fx-t-sm">100</text><text x="273.33333333333337" y="228" text-anchor="middle" class="fx-t-sm">120</text><polyline points="40,212 42.3,210.7 44.7,209.3 47,208 49.3,206.7 51.7,205.3 54,204 56.3,202.7 58.7,201.3 61,200 63.3,198.7 65.7,197.3 68,196 70.3,194.7 72.7,193.3 75,192 77.3,190.7 79.7,189.3 82,188 84.3,186.7 86.7,185.3 89,184 91.3,182.7 93.7,181.3 96,180 98.3,178.7 100.7,177.3 103,176 105.3,174.7 107.7,173.3 110,172 112.3,170.7 114.7,169.3 117,168 119.3,166.7 121.7,165.3 124,164 126.3,162.7 128.7,161.3 131,160 133.3,158.7 135.7,157.3 138,156 140.3,154.7 142.7,153.3 145,152 147.3,150.7 149.7,149.3 152,148 154.3,146.7 156.7,145.3 159,144 161.3,142.7 163.7,141.3 166,140 168.3,138.7 170.7,137.3 173,136 175.3,134.7 177.7,133.3 180,132 182.3,130.7 184.7,129.3 187,128 189.3,126.7 191.7,125.3 194,124 196.3,122.7 198.7,121.3 201,120 203.3,118.7 205.7,117.3 208,116 210.3,114.7 212.7,113.3 215,112 217.3,110.7 219.7,109.3 222,108 224.3,106.7 226.7,105.3 229,104 231.3,102.7 233.7,101.3 236,100 238.3,98.7 240.7,97.3 243,96 245.3,94.7 247.7,93.3 250,92 252.3,90.7 254.7,89.3 257,88 259.3,86.7 261.7,85.3 264,84 266.3,82.7 268.7,81.3 271,80 273.3,78.7 275.7,77.3 278,76 280.3,74.7 282.7,73.3 285,72 287.3,70.7 289.7,69.3 292,68 294.3,66.7 296.7,65.3 299,64 301.3,62.7 303.7,61.3 306,60 308.3,58.7 310.7,57.3 313,56 315.3,54.7 317.7,53.3 320,52" class="fx-line-thick"/><line x1="86.66666666666666" y1="185.3" x2="273.33333333333337" y2="78.7" class="fx-line-hl fx-dash"/><circle cx="86.66666666666666" cy="185.3" r="5" class="fx-fill-ink"/><circle cx="273.33333333333337" cy="78.7" r="5" class="fx-fill-ink"/><circle cx="180" cy="132" r="6" class="fx-fill-green"/><circle cx="180" cy="132" r="5" class="fx-fill-orange"/><text x="192" y="154" class="fx-t-ok">average = 100</text><text x="192" y="170" class="fx-t-hl">= value at 100 (no gap)</text><text x="180" y="240" text-anchor="middle" class="fx-t-sm">outcomes 80 or 120, half each</text><line x1="360" y1="36" x2="360" y2="226" class="fx-line-muted fx-dash"/><text x="540" y="22" text-anchor="middle" class="fx-t-b">Call, K = 100 (convex)</text><line x1="400" y1="212" x2="680" y2="212" class="fx-axis"/><text x="446.6666666666667" y="228" text-anchor="middle" class="fx-t-sm">80</text><text x="540" y="228" text-anchor="middle" class="fx-t-sm">100</text><text x="633.3333333333334" y="228" text-anchor="middle" class="fx-t-sm">120</text><polyline points="400,180 402.3,180 404.7,180 407,180 409.3,180 411.7,180 414,180 416.3,180 418.7,180 421,180 423.3,180 425.7,180 428,180 430.3,180 432.7,180 435,180 437.3,180 439.7,180 442,180 444.3,180 446.7,180 449,180 451.3,180 453.7,180 456,180 458.3,180 460.7,180 463,180 465.3,180 467.7,180 470,180 472.3,180 474.7,180 477,180 479.3,180 481.7,180 484,180 486.3,180 488.7,180 491,180 493.3,180 495.7,180 498,180 500.3,180 502.7,180 505,180 507.3,180 509.7,180 512,180 514.3,180 516.7,180 519,180 521.3,180 523.7,180 526,180 528.3,180 530.7,180 533,180 535.3,180 537.7,180 540,180 542.3,178 544.7,176 547,174 549.3,172 551.7,170 554,168 556.3,166 558.7,164 561,162 563.3,160 565.7,158 568,156 570.3,154 572.7,152 575,150 577.3,148 579.7,146 582,144 584.3,142 586.7,140 589,138 591.3,136 593.7,134 596,132 598.3,130 600.7,128 603,126 605.3,124 607.7,122 610,120 612.3,118 614.7,116 617,114 619.3,112 621.7,110 624,108 626.3,106 628.7,104 631,102 633.3,100 635.7,98 638,96 640.3,94 642.7,92 645,90 647.3,88 649.7,86 652,84 654.3,82 656.7,80 659,78 661.3,76 663.7,74 666,72 668.3,70 670.7,68 673,66 675.3,64 677.7,62 680,60" class="fx-line-thick"/><line x1="446.6666666666667" y1="180" x2="633.3333333333334" y2="100" class="fx-line-hl fx-dash"/><circle cx="446.6666666666667" cy="180" r="5" class="fx-fill-ink"/><circle cx="633.3333333333334" cy="100" r="5" class="fx-fill-ink"/><circle cx="540" cy="140" r="6" class="fx-fill-green"/><circle cx="540" cy="180" r="5" class="fx-fill-orange"/><line x1="540" y1="147" x2="540" y2="173" class="fx-line-ok"/><text x="530" y="110" text-anchor="end" class="fx-t-ok">average payoff = 10</text><text x="530" y="128" text-anchor="end" class="fx-t-sm">gap = 10 (Jensen)</text><text x="548" y="198" class="fx-t-hl">payoff at the average = 0</text><text x="540" y="240" text-anchor="middle" class="fx-t-sm">the same two outcomes</text></svg>
<figcaption>Figure 2 · The same two outcomes, 80 and 120, seen through a straight line and through a kink. For the shares, the average of the outcomes (green dot) sits exactly on the line: uncertainty changes nothing on average. For the call, the average payoff is 10 while the payoff at the average price is 0; the gap of 10 is the value of the spread of outcomes.</figcaption>
</figure>

For the shares, spreading the outcomes out changes nothing on average. For the call, it adds 10. Push the outcomes further apart, to 60 or 140, and the call's average payoff becomes \(\tfrac12 \times 40 = 20\); squeeze them to exactly 100 and it becomes 0. **The call's value comes from the spread of possible prices, not from the average price.**

> [!KEY] Convexity turns uncertainty into value
> For a straight-line payoff, the average payoff equals the payoff at the average price. For a payoff that bends upward, the average payoff is **at least** the payoff at the average price, and the gap grows with the spread of outcomes. That is why an option's price rises with volatility.

> [!THINK] Does a put share this property?
> Take the same world, 80 or 120 with equal odds, and a put with strike 100. What is its average payoff, and what does it pay at the average price?
> ---
> The put pays \(\max(100 - 80, 0) = 20\) or \(\max(100 - 120, 0) = 0\): an average of 10, against 0 at the average price. The put's payoff also bends upward, just on the other side of the strike. Calls and puts both gain from movement itself — which is why owning both at once, a straddle, is a bet on *how much* XYZ moves rather than which way ([[straddle-strangle]]).

We'll take it in five parts:

- **① Linear payoffs**: stocks, forwards and futures
- **② Convex payoffs**: the kink, and its concave mirror
- **③ Before expiry**: gains accelerate, losses decelerate
- **④ Jensen's inequality**: why uncertainty has value
- **⑤ You pay for convexity**: premium and time decay

::demo[linear-vs-convex-jensen]

## @mechanics
### ① Linear payoffs: stocks, forwards and futures

A share bought at \(S_0\), a forward or a future all have a profit that is a straight line in the final price:

$$
\Pi_{\text{stock}} = S_T - S_0, \qquad \Pi_{\text{forward}} = S_T - F
$$

where \(S_T\) is the price at the end, \(S_0\) the purchase price and \(F\) the agreed forward price. The slope — how much the position gains per $1 move in the underlying — is 1 everywhere. In the language of the Greeks, a share has **delta** \(\Delta = 1\), always ([[delta]]).

A straight line treats up and down moves symmetrically: +$10 on 100 shares is +$1,000, −$10 is −$1,000. And because the payoff is linear, its average only depends on the average price: if the average \(S_T\) is 100, the average profit is 0, however wild the outcomes.

Leverage doesn't change this. A leveraged position is a *steeper* line, not a bent one.

> [!WARN] Leverage is not convexity
> Take a 10× long bitcoin perpetual at an illustrative price of $100,000. A 1% move changes the position by 10% of the margin, in either direction. The line is ten times steeper, but still straight — and it has a cliff: with a 0.5% maintenance margin, the position is liquidated near $90,500 and the loss is locked in, even if the price recovers the next hour. A call's loss, by contrast, can never exceed its premium, and it isn't forced out on the way down. [[perps-vs-options]] compares the two in detail.

### ② Convex payoffs: the kink, and its concave mirror

A bought call's profit at expiry is

$$
\Pi_{\text{call}} = \max(S_T - K,\,0) - c
$$

where \(K\) is the strike and \(c\) the premium paid. For Kai's 100 call, \(c = 2.45\): below $100 the profit is a flat −2.45; above $100 it rises one-for-one, crossing zero at the breakeven \(K + c = 102.45\).

| Position (at expiry) | Slope below the strike | Slope above the strike | Shape |
|---|---|---|---|
| 100 shares | 1 | 1 | straight |
| bought 100 call | 0 | 1 | convex (bends up) |
| bought 100 put | −1 | 0 | convex (bends up) |
| sold 100 call | 0 | −1 | concave (bends down) |
| shares + sold 105 call (Kai's covered call) | 1 | 0 | concave above the strike |

Mathematically, a payoff is **convex** if the straight segment joining any two points on its graph lies on or above the graph — exactly the dashed chord in Figure 2. A payoff that bends the other way is **concave**. Every bought option is convex; every sold option is concave. The seller holds the mirror image: capped gain, open loss. That is why sellers are said to be *short convexity*, and why [[four-positions]] treats buyers and sellers as mirror images.

### ③ Before expiry: gains accelerate, losses decelerate

At expiry the call is a kink. Before expiry its value is a smooth curve that sits above the kink, because there is still time for XYZ to move. Using the standard XYZ inputs (\(\sigma = 20\%\), \(r = 4\%\), 30 days), the 100 call is worth $2.45 with XYZ at $100. Move XYZ by ±$5 today:

- XYZ to $105: the call rises to $5.91, a gain of **$3.46**;
- XYZ to $95: the call falls to $0.63, a loss of **$1.82**.

The same $5 move gains almost twice as much as it loses. Shares would gain and lose exactly $5.

<figure>
<svg data-fig="lvc-tangent" viewBox="0 0 640 252" role="img" aria-label="Today's call value curve sits above its tangent"><line x1="70" y1="34" x2="70" y2="214" class="fx-grid"/><text x="70" y="230" text-anchor="middle" class="fx-t-sm">88</text><line x1="158.3" y1="34" x2="158.3" y2="214" class="fx-grid"/><text x="158.3" y="230" text-anchor="middle" class="fx-t-sm">92</text><line x1="246.7" y1="34" x2="246.7" y2="214" class="fx-grid"/><text x="246.7" y="230" text-anchor="middle" class="fx-t-sm">96</text><line x1="335" y1="34" x2="335" y2="214" class="fx-grid"/><text x="335" y="230" text-anchor="middle" class="fx-t-sm">100</text><line x1="423.3" y1="34" x2="423.3" y2="214" class="fx-grid"/><text x="423.3" y="230" text-anchor="middle" class="fx-t-sm">104</text><line x1="511.7" y1="34" x2="511.7" y2="214" class="fx-grid"/><text x="511.7" y="230" text-anchor="middle" class="fx-t-sm">108</text><line x1="600" y1="34" x2="600" y2="214" class="fx-grid"/><text x="600" y="230" text-anchor="middle" class="fx-t-sm">112</text><text x="62" y="218" text-anchor="end" class="fx-t-sm">0</text><text x="62" y="166" text-anchor="end" class="fx-t-sm">4</text><text x="62" y="114" text-anchor="end" class="fx-t-sm">8</text><text x="62" y="62" text-anchor="end" class="fx-t-sm">12</text><line x1="70" y1="214" x2="600" y2="214" class="fx-axis"/><polyline points="70,214 81,214 92.1,214 103.1,214 114.2,214 125.2,214 136.3,214 147.3,214 158.3,214 169.4,214 180.4,214 191.5,214 202.5,214 213.5,214 224.6,214 235.6,214 246.7,214 257.7,214 268.8,214 279.8,214 290.8,214 301.9,214 312.9,214 324,214 335,214 346,207.5 357.1,201 368.1,194.5 379.2,188 390.2,181.5 401.3,175 412.3,168.5 423.3,162 434.4,155.5 445.4,149 456.5,142.5 467.5,136 478.5,129.5 489.6,123 500.6,116.5 511.7,110 522.7,103.5 533.8,97 544.8,90.5 555.8,84 566.9,77.5 577.9,71 589,64.5 600,58" class="fx-line-muted fx-dash"/><polyline points="235.6,213.4 246.7,209.9 257.7,206.4 268.8,203 279.8,199.5 290.8,196 301.9,192.6 312.9,189.1 324,185.6 335,182.1 346,178.7 357.1,175.2 368.1,171.7 379.2,168.2 390.2,164.8 401.3,161.3 412.3,157.8 423.3,154.4 434.4,150.9 445.4,147.4 456.5,143.9 467.5,140.5 478.5,137 489.6,133.5 500.6,130 511.7,126.6 522.7,123.1 533.8,119.6 544.8,116.2 555.8,112.7 566.9,109.2 577.9,105.7 589,102.3 600,98.8" class="fx-line-blue fx-dash"/><polyline points="70,213.6 75.5,213.6 81,213.5 86.6,213.4 92.1,213.4 97.6,213.3 103.1,213.2 108.6,213.1 114.2,212.9 119.7,212.8 125.2,212.7 130.7,212.5 136.3,212.3 141.8,212.1 147.3,211.9 152.8,211.6 158.3,211.4 163.9,211.1 169.4,210.8 174.9,210.4 180.4,210 185.9,209.6 191.5,209.2 197,208.7 202.5,208.2 208,207.7 213.5,207.1 219.1,206.5 224.6,205.8 230.1,205.1 235.6,204.4 241.1,203.6 246.7,202.8 252.2,201.9 257.7,200.9 263.2,199.9 268.8,198.9 274.3,197.8 279.8,196.7 285.3,195.5 290.8,194.2 296.4,192.9 301.9,191.5 307.4,190.1 312.9,188.6 318.4,187.1 324,185.5 329.5,183.8 335,182.1 340.5,180.4 346,178.5 351.6,176.7 357.1,174.7 362.6,172.8 368.1,170.7 373.6,168.6 379.2,166.5 384.7,164.3 390.2,162.1 395.7,159.8 401.3,157.4 406.8,155 412.3,152.6 417.8,150.1 423.3,147.6 428.9,145.1 434.4,142.5 439.9,139.9 445.4,137.2 450.9,134.5 456.5,131.8 462,129 467.5,126.2 473,123.4 478.5,120.5 484.1,117.6 489.6,114.7 495.1,111.8 500.6,108.9 506.1,105.9 511.7,102.9 517.2,99.9 522.7,96.9 528.2,93.8 533.8,90.8 539.3,87.7 544.8,84.6 550.3,81.5 555.8,78.4 561.4,75.2 566.9,72.1 572.4,69 577.9,65.8 583.4,62.7 589,59.5 594.5,56.3 600,53.1" class="fx-line-thick"/><circle cx="224.6" cy="205.8" r="5" class="fx-fill-red"/><circle cx="335" cy="182.1" r="5" class="fx-fill-orange"/><circle cx="445.4" cy="137.2" r="5" class="fx-fill-green"/><text x="435.4" y="125.2" text-anchor="end" class="fx-t-ok">S +5 → call +3.46</text><text x="218.6" y="191.8" text-anchor="middle" class="fx-t-bad">S −5 → call −1.82</text><text x="327" y="172.1" text-anchor="end" class="fx-t-hl">2.45</text><text x="81" y="58" class="fx-t-blue">violet dashes: tangent at S = 100, slope Δ = 0.534</text><text x="81" y="78.8" class="fx-t-sm">grey dashes: value at expiry</text><text x="81" y="97" class="fx-t-sm">black curve: value today</text><text x="600" y="246" text-anchor="end" class="fx-t-sm">XYZ price today S (30-day 100 call, σ 20%, r 4%)</text></svg>
<figcaption>Figure 3 · The 30-day 100 call's value today (black curve) and its tangent at \(S = 100\) (dashed violet, slope \(\Delta = 0.534\)). The curve lies above the tangent on both sides: up moves gain more than the tangent predicts and down moves lose less. The dashed grey line is the value at expiry.</figcaption>
</figure>

The tangent line is what a linear position with the same delta would do: \(0.534 \times 5 = 2.67\) up or down. The curve beats it on both sides, and the extra is set by **gamma** \(\Gamma\), the rate at which delta changes (0.069 per $1 for this call):

$$
\Delta V \approx \Delta \cdot \Delta S + \tfrac12\,\Gamma\,(\Delta S)^2
$$

where \(\Delta V\) is the change in the option's value, \(\Delta S\) the move in the stock, \(\Delta\) (delta) the slope and \(\Gamma\) (gamma) the curvature. The first term is the straight-line part; the second is always positive for a bought option, whichever way the stock moves.

> [!EXAMPLE] The ±$5 moves, reconstructed
> \(\tfrac12\,\Gamma\,(\Delta S)^2 = \tfrac12 \times 0.069 \times 5^2 \approx 0.87\).
> - Up $5: \(0.534 \times 5 + 0.87 = 3.54\), against the exact 3.46.
> - Down $5: \(-0.534 \times 5 + 0.87 = -1.80\), against the exact −1.82.
>
> The curvature term adds about 87 cents to either move. The approximation is close, not exact, because gamma itself changes along the way; [[gamma]] and [[greeks-map]] make this precise.

### ④ Jensen's inequality: why uncertainty has value

The two-outcome experiment is a special case of a general fact, **Jensen's inequality**. For any convex function \(f\) and any uncertain quantity \(X\):

$$
\E[f(X)] \;\ge\; f(\E[X])
$$

where \(\E[\cdot]\) is the average (expected value) over all outcomes. In words: *the average of a convex payoff is at least the payoff at the average*. For a straight line the two sides are equal, because \(\E[a + bX] = a + b\,\E[X]\). For the call, \(f(S_T) = \max(S_T - K, 0)\):

$$
\E\big[\max(S_T - K,\,0)\big] \;\ge\; \max\big(\E[S_T] - K,\,0\big)
$$

With \(\E[S_T] = K = 100\), the right side is 0 — yet the left side is positive whenever \(S_T\) is uncertain. The whole value of an at-the-money option is this gap.

> [!DEEP] The two-point proof
> With two outcomes \(x_1, x_2\) of equal probability, \(\E[f(X)] = \tfrac12 f(x_1) + \tfrac12 f(x_2)\) is the midpoint of the chord between \((x_1, f(x_1))\) and \((x_2, f(x_2))\), while \(f(\E[X])\) is the curve at the midpoint \(\tfrac12(x_1 + x_2)\). Convexity says the chord lies above the curve, so the first is at least the second. Any distribution can be built from such pairs, which is how the general inequality is proved.

Replace the two outcomes with a realistic spread — a lognormal distribution whose average is exactly 100 — and the call's average payoff grows smoothly with volatility and time. With zero interest rates it is almost exactly proportional to \(\sigma\sqrt{T}\):

| Volatility \(\sigma\) (30 days) | Average payoff, zero rates | \(0.4\,S\sigma\sqrt{T}\) | Black-Scholes price at \(r = 4\%\) |
|---|---|---|---|
| 10% | 1.14 | 1.15 | 1.31 |
| 20% | 2.29 | 2.29 | 2.45 |
| 30% | 3.43 | 3.44 | 3.59 |
| 40% | 4.57 | 4.59 | 4.73 |

Double the volatility and the at-the-money call roughly doubles. This is the seed of Idea ③: **options really trade how much a price will move**, which is why the market quotes them in volatility ([[implied-vol]]). The small extra in the last column comes from interest rates, explained in [[black-scholes]].

### ⑤ You pay for convexity: premium and time decay

If uncertainty has value, the seller will charge for it. The premium is, roughly, the Jensen gap paid up front. And because the gap depends on how much time is left for XYZ to move, it shrinks as expiry approaches: the 30-day 100 call loses about $0.044 a share per day — $4.36 per contract — if XYZ doesn't move. That is **time decay**, or theta ([[theta]]).

> [!KAI] What Kai buys with the call
> Kai's $245 buys two things: the right to XYZ's rise above $100 and, until expiry, the convexity term \(\tfrac12\,\Gamma\,(\Delta S)^2\) on every move. On a typical day at 20% volatility XYZ moves about \(100 \times 0.20/\sqrt{365} \approx \$1.05\). That move earns about \(\tfrac12 \times 0.069 \times 1.05^2 \approx \$0.038\) a share from curvature, most of the $0.044 the call loses to time each day (the remaining half-cent is an interest effect). If XYZ moves more than usual, convexity wins; if it sits still, time decay wins.

That balance is the heart of the rest of the course. Buyers of options are **long convexity**: they pay time decay and profit when the underlying moves more than the price assumed. Sellers are **short convexity**: they collect time decay and lose when it moves more. Gamma and theta are two sides of one coin, and whether an option was cheap or dear depends on how much the price actually moved compared with how much was priced in — the gap between realised and implied volatility that [[variance-risk-premium]] studies.

## @analogy
Think of an **umbrella you can decide to open at the last moment**.

Walking out with no umbrella is a straight line: sun is pleasant, rain soaks you, and your day's average comfort depends only on the average weather. Carrying the umbrella changes the shape. If it rains, you open it and stay dry; if it's sunny, you leave it closed. You keep the good outcome and cut off the bad one.

Now notice when the umbrella is most valuable: not when rain is certain (then everyone knows what to do), and not when sun is certain (then it's dead weight), but when the forecast is *uncertain* — especially when it swings between downpour and blazing sun. The more the weather can change, the more a choice you make at the last moment is worth. That is Jensen's inequality in a raincoat.

The analogy breaks in two places. Carrying the umbrella costs a little each day whether it rains or not — like time decay — and a real option's cost is set by the market, not by how heavy the umbrella is. And while an umbrella only protects you, an option can also profit from the good outcome; the call "opens" when XYZ rallies, not only when it falls.

## @misconceptions
- **“A call is just a leveraged position in the stock.”** — Leverage makes a line steeper; a call bends the line. A leveraged stock position loses more as the stock falls, and can be liquidated; the call's loss stops at the premium.
- **“If I expect XYZ to end where it is, an at-the-money call is worthless to me.”** — Its payoff at the expected price is zero, but its average payoff is positive whenever the price is uncertain. That gap is exactly what the premium pays for.
- **“Volatility only matters to traders who bet on direction.”** — Direction hardly enters an at-the-money option's price; the spread of outcomes does. Doubling the volatility roughly doubles the price of the 30-day 100 call, from $2.45 to $4.73.
- **“Convexity is free upside.”** — It is paid for, in the premium and in daily time decay. Whether it was worth it depends on whether the stock moved more than the price assumed.
- **“Selling options is linear, like owning stock.”** — A sold option is concave: capped gain, open loss. The seller's losses accelerate as the price moves against them — the mirror of the buyer's convexity.

## @takeaways
- Stocks, forwards and futures have straight-line payoffs (slope 1, \(\Delta = 1\)); leverage steepens the line but never bends it.
- A bought option's payoff bends upward at the strike: it is convex, with a capped loss and open upside; a sold option is concave.
- Before expiry, convexity makes gains accelerate and losses decelerate: ±$5 on XYZ moves the 30-day 100 call by +$3.46 and −$1.82.
- Jensen's inequality, \(\E[f(X)] \ge f(\E[X])\), shows that uncertainty itself makes options valuable; an at-the-money price is roughly proportional to \(\sigma\sqrt{T}\).
- Convexity is paid for with premium and time decay; buyers are long convexity and sellers short — the trade-off behind gamma, theta and volatility trading.

## @quiz
1. XYZ will end at $90 or $110 with equal odds. What is the average payoff of a call with strike $100?
   - [x] $5
   - [ ] $0
   - [ ] $10
   - [ ] $100
   > The call pays \(\max(90 - 100, 0) = 0\) or \(\max(110 - 100, 0) = 10\), so the average is \(\tfrac12 \times 0 + \tfrac12 \times 10 = 5\). $0 is the payoff at the average price, which Jensen's inequality says is smaller.
2. Which of these has a straight-line (linear) payoff in the underlying's price?
   - [ ] A bought put
   - [ ] Shares plus a bought put
   - [x] A futures contract
   - [ ] A sold call
   > A future pays \(S_T - F\): slope 1 everywhere. The bought put and the protected shares bend upward (convex), and the sold call bends downward (concave).
3. With XYZ at $100, a $5 rise lifts the 30-day 100 call by $3.46, while a $5 fall lowers it by only $1.82. What property explains the difference?
   - [ ] The interest rate
   - [ ] The ×100 multiplier
   - [ ] The breakeven price
   - [x] Convexity (gamma): delta rises as the stock rises and falls as it falls
   > The curvature term \(\tfrac12\,\Gamma\,(\Delta S)^2 \approx 0.87\) is added to both moves: gains accelerate and losses decelerate. Interest and the multiplier don't create this asymmetry.
4. The 30-day at-the-money XYZ call costs $2.45 at 20% volatility. Volatility doubles to 40%; nothing else changes. What happens to the price?
   - [ ] It stays at $2.45 because the stock price didn't change
   - [x] It roughly doubles, to about $4.73
   - [ ] It rises by about 41%, like \(\sqrt{2}\)
   - [ ] It quadruples, like \(\sigma^2\)
   > An at-the-money price is roughly \(0.4\,S\sigma\sqrt{T}\), proportional to σ: the spread of outcomes doubles, and so does the Jensen gap.
5. A trader compares a 10× leveraged perpetual with a bought call for the same bullish view. Which statement is correct?
   - [ ] Both are convex, because both give more upside per dollar than the underlying
   - [ ] The perpetual is convex because leverage amplifies gains
   - [x] Only the call is convex; the perpetual is a steeper straight line with a liquidation cliff
   - [ ] Only the perpetual has a capped loss
   > Leverage multiplies the slope but keeps the line straight, and liquidation can lock in a loss on the way down. The call's loss is capped at the premium and its payoff bends upward.

## @further
- [Jensen's inequality — Wikipedia](https://en.wikipedia.org/wiki/Jensen%27s_inequality) — the statement, the picture and proofs.
- [Convex function — Wikipedia](https://en.wikipedia.org/wiki/Convex_function) — the chord-above-the-graph definition used here.
- [Greeks (finance) — Wikipedia](https://en.wikipedia.org/wiki/Greeks_%28finance%29) — delta and gamma, the numbers that measure slope and curvature.
- [Black & Scholes (1973), The Pricing of Options and Corporate Liabilities](https://doi.org/10.1086/260062) — where the price of convexity was first worked out exactly.

## @next
You now know the one shape behind every option. Time to take the first one apart properly in [[call-option]]: what exactly does a call give you, what does its seller owe, and how do you decide at expiry whether to use it?
