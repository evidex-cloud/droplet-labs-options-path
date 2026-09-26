---
id: ratios-risk-reversals
prereqs: smile-skew, vertical-spreads, protective-put-collar, higher-order-greeks, butterfly
demo: ratios-risk-reversals
---

# Ratios, Backspreads & Risk Reversals: Trading the Skew

## @hook
On a real option chain, XYZ's 95 put trades at a higher implied vol than its 105 call. That tilt — the skew — is a price in its own right, and some structures are built to buy it or sell it. The catch: the cheapest ways to sell skew hide a naked tail, and the tail is exactly what the skew was charging for.

## @bridge
[[smile-skew]] showed that implied vol varies by strike: equity puts carry a premium, summarised by the 25-delta risk reversal. [[vertical-spreads]] and [[protective-put-collar]] built spreads and collars as if every strike had the same vol, and [[higher-order-greeks]] introduced vanna — how delta changes with vol. This lesson puts the skew to work. It answers: **which structures are bets on the skew itself, what do they cost with and without it, and where do their tails hide?** It builds Idea ③ (volatility, now across strikes) and Idea ④ (risk: vol-spot correlation and uneven ratios).

## @intuition
So far every XYZ price in the course used one volatility, 20%. Real equity chains don't look like that. For illustration, suppose XYZ's 30-day smile looks like a typical stock's: the 95 put at **22.8%**, the 100 at-the-money options at **20%**, the 105 call at **17.8%**. Nothing else changes.

Two options you already know change price:

| 30-day XYZ | Flat 20% | Illustrative skew | Change |
|---|---|---|---|
| 95 put | 0.51 | 0.72 | +41% |
| 105 call | 0.71 | 0.53 | −25% |

Why would the market do that? Investors buy puts to protect portfolios (Kai's 95 put is one of them), and many sell calls for income (Kai's covered call is one of those). Puts are in demand, calls in supply. And stocks do tend to fall faster than they rise, with volatility jumping in the fall ([[bs-assumptions]]). The skew is the price of that asymmetry.

> [!KAI] Kai's collar meets the skew
> In [[protective-put-collar]] Kai bought the 95 put (0.51) and sold the 105 call (0.71) for a **net credit of $0.20**. With the skew, the same collar costs **$0.19** — Kai now pays for protection. To make the collar free again, Kai would have to sell a call at about **104.20** instead of 106.14: about two dollars less upside, because insurance got dearer and the call Kai sells got cheaper.

That collar is a skew trade in disguise. Kai is **long the rich put and short the cheap call**. Flip it — sell the rich put, buy the cheap call — and you have a **risk reversal**, the purest way to bet on the skew. Tilt the numbers instead — buy one option, sell two further out — and you have a **ratio spread**, which sells the expensive wing twice.

<figure>
<svg viewBox="0 0 640 240" role="img" aria-label="Equity skew and the risk reversal"><defs><marker id="ratios-risk-reversals-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead-hl"/></marker></defs><line x1="70.0" y1="173.2" x2="600.0" y2="173.2" class="fx-grid"/><text x="62.0" y="177.2" text-anchor="end" class="fx-t-sm">15%</text><line x1="70.0" y1="131.1" x2="600.0" y2="131.1" class="fx-grid"/><text x="62.0" y="135.1" text-anchor="end" class="fx-t-sm">20%</text><line x1="70.0" y1="88.9" x2="600.0" y2="88.9" class="fx-grid"/><text x="62.0" y="92.9" text-anchor="end" class="fx-t-sm">25%</text><line x1="70.0" y1="46.8" x2="600.0" y2="46.8" class="fx-grid"/><text x="62.0" y="50.8" text-anchor="end" class="fx-t-sm">30%</text><line x1="70.0" y1="190.0" x2="605.0" y2="190.0" class="fx-axis"/><line x1="70.0" y1="131.1" x2="600.0" y2="131.1" class="fx-line-muted fx-dash"/><polyline points="70.0,32.0 74.1,34.2 78.3,36.3 82.4,38.3 86.6,40.4 90.7,42.4 94.8,44.4 99.0,46.4 103.1,48.4 107.3,50.3 111.4,52.3 115.5,54.2 119.7,56.1 123.8,58.0 128.0,59.8 132.1,61.6 136.3,63.5 140.4,65.3 144.5,67.0 148.7,68.8 152.8,70.5 157.0,72.3 161.1,74.0 165.2,75.7 169.4,77.3 173.5,79.0 177.7,80.6 181.8,82.3 185.9,83.9 190.1,85.4 194.2,87.0 198.4,88.6 202.5,90.1 206.6,91.6 210.8,93.1 214.9,94.6 219.1,96.1 223.2,97.5 227.3,99.0 231.5,100.4 235.6,101.8 239.8,103.2 243.9,104.5 248.0,105.9 252.2,107.2 256.3,108.6 260.5,109.9 264.6,111.2 268.8,112.5 272.9,113.7 277.0,115.0 281.2,116.2 285.3,117.4 289.5,118.7 293.6,119.9 297.7,121.0 301.9,122.2 306.0,123.4 310.2,124.5 314.3,125.6 318.4,126.7 322.6,127.8 326.7,128.9 330.9,130.0 335.0,131.1 339.1,132.1 343.3,133.1 347.4,134.2 351.6,135.2 355.7,136.2 359.8,137.1 364.0,138.1 368.1,139.1 372.3,140.0 376.4,140.9 380.5,141.9 384.7,142.8 388.8,143.7 393.0,144.5 397.1,145.4 401.3,146.3 405.4,147.1 409.5,148.0 413.7,148.8 417.8,149.6 422.0,150.4 426.1,151.2 430.2,152.0 434.4,152.7 438.5,153.5 442.7,154.2 446.8,155.0 450.9,155.7 455.1,156.4 459.2,157.1 463.4,157.8 467.5,158.5 471.6,159.1 475.8,159.8 479.9,160.4 484.1,161.1 488.2,161.7 492.3,162.3 496.5,162.9 500.6,163.5 504.8,164.1 508.9,164.7 513.0,165.3 517.2,165.8 521.3,166.4 525.5,166.9 529.6,167.4 533.8,168.0 537.9,168.5 542.0,169.0 546.2,169.5 550.3,169.9 554.5,170.4 558.6,170.9 562.7,171.3 566.9,171.8 571.0,172.2 575.2,172.6 579.3,173.0 583.4,173.5 587.6,173.8 591.7,174.2 595.9,174.6 600.0,175.0" class="fx-line-thick"/><text x="86.6" y="206.0" text-anchor="middle" class="fx-t-sm">85</text><text x="169.4" y="206.0" text-anchor="middle" class="fx-t-sm">90</text><text x="252.2" y="206.0" text-anchor="middle" class="fx-t-sm">95</text><text x="335.0" y="206.0" text-anchor="middle" class="fx-t-sm">100</text><text x="417.8" y="206.0" text-anchor="middle" class="fx-t-sm">105</text><text x="500.6" y="206.0" text-anchor="middle" class="fx-t-sm">110</text><text x="583.4" y="206.0" text-anchor="middle" class="fx-t-sm">115</text><text x="600.0" y="226.0" text-anchor="end" class="fx-t-sm">strike (30 days, XYZ = 100)</text><circle cx="252.2" cy="107.2" r="6" class="fx-fill-red"/><circle cx="417.8" cy="149.6" r="6" class="fx-fill-green"/><circle cx="335.0" cy="131.1" r="4" class="fx-fill-ink"/><text x="246.2" y="149.1" text-anchor="end" class="fx-t-bad">95 put 22.8%: rich</text><text x="434.4" y="123.1" class="fx-t-ok">105 call 17.8%: cheap</text><text x="335.0" y="121.1" text-anchor="middle" class="fx-t-sm">ATM 20%</text><path d="M 277.0,89.2 Q 335.0,55.3 397.9,137.6" class="fx-line-hl" marker-end="url(#ratios-risk-reversals-ah2)"/><text x="335.0" y="44.8" text-anchor="middle" class="fx-t-hl">risk reversal: sell the rich side, buy the cheap side</text></svg>
<figcaption>Figure 1 · An illustrative equity skew for XYZ (30 days): implied vol falls from about 26% at the 90 strike to about 16% at 110. A risk reversal sells the rich side of the curve and buys the cheap side; a collar does the opposite. The dashed line is the flat 20% used everywhere else in the course.</figcaption>
</figure>

> [!THINK] With the skew, a bullish risk reversal (buy the 105 call, sell the 95 put) now pays you $0.19. Is that free upside?
> Predict before opening the answer.
> ---
> No. You are paid because the put you sell is the one the market fears. If XYZ falls, you own the downside of the 95 put — and in a sell-off, implied vol usually rises exactly on that put, so it hurts twice. The credit is the market's price for that risk, not a gift.

We'll take it in six parts:

- **① Measuring the skew: risk reversal and butterfly quotes**
- **② Risk reversals: direction plus skew**
- **③ Ratio spreads: selling the wing twice**
- **④ Backspreads: buying the tail**
- **⑤ The hidden tails: vol–spot dynamics**
- **⑥ State of play and connections**

## @mechanics
### ① Measuring the skew: risk reversal and butterfly quotes

Traders compress a smile into two numbers taken at the 25-delta strikes ([[smile-skew]]):

$$
RR_{25} = \sigma_{25C} - \sigma_{25P}, \qquad BF_{25} = \tfrac12\big(\sigma_{25C} + \sigma_{25P}\big) - \sigma_{\text{ATM}}
$$

where \(\sigma_{25C}\) is the implied vol of the call with delta 0.25, \(\sigma_{25P}\) that of the put with delta −0.25, and \(\sigma_{\text{ATM}}\) the at-the-money vol. \(RR_{25}\) measures the **tilt** (negative for equities: puts richer); \(BF_{25}\) measures the **curvature** (how much both wings cost over the centre).

> [!EXAMPLE] XYZ's illustrative skew
> The 25-delta put sits near the 96.3 strike at 22.0%; the 25-delta call near 104.1 at 18.2%. So \(RR_{25} \approx 18.2 - 22.0 = -3.8\) vol points, and \(BF_{25} \approx \tfrac12(18.2 + 22.0) - 20.0 \approx +0.1\) to \(+0.3\) points depending on where exactly "ATM" is taken. A −3.8-point risk reversal is a moderate equity skew; single stocks around bad news, or indexes after a crash, can show far steeper ones.

::demo[ratios-risk-reversals-skew]

### ② Risk reversals: direction plus skew

A **bullish risk reversal** buys an out-of-the-money call and sells an out-of-the-money put; a bearish one does the reverse. Its price is simply

$$
\text{RR price} = C(K_C, \sigma_{K_C}) - P(K_P, \sigma_{K_P})
$$

where each option is priced at its own strike's implied vol. With XYZ's 105 call and 95 put: \(0.71 - 0.51 = +0.20\) (a debit) at flat vol, but \(0.53 - 0.72 = -0.19\) (a credit) with the skew.

What does the position hold?

- **Delta:** about +0.39 — the 105 call's +0.22 plus the short put's +0.16 (flat-vol deltas). It is a strongly directional trade, like owning 39 shares per contract.
- **Vega:** almost zero with the skew (+0.00003): the long call's vega and the short put's vega cancel. A risk reversal barely cares about the *level* of vol.
- **Skew:** it is short the put's vol and long the call's. If the skew steepens from −3.8 to about −5.8 points with XYZ unchanged, the risk reversal loses about **0.20** per share — as much as the credit it collected.
- **Vanna:** about +2.37: its delta rises when vol rises. In practice vol rises when stocks fall, so the position's delta moves against it at exactly the wrong time (section ⑤).

> [!EXAMPLE] The collar is a short risk reversal on top of shares
> Kai's collar = 100 shares + long 95 put + short 105 call = **shares − risk reversal**. Everything in this section applies to collars with the sign flipped: skew makes collars cost more, a steepening skew *helps* an existing collar (its put gains more than its call), and the zero-cost call strike moves down from 106.14 (flat) to 104.20 (skew).

How do hedgers live with a skew that makes protection dearer? Often by selling some of the skew back. A **put-spread collar** buys the 95 put, sells the 90 put and sells the 105 call. With the skew: \(0.72 - 0.24 - 0.53 = -0.05\), a small credit again (at flat vol it would be a 0.26 credit). The 90 put Kai sells is the richest option on the chain (26.4% vol), so it pays for most of the skew — at the price of protection that stops at 90. Below 90 Kai owns the shares' losses again. Every "cheaper hedge" on an equity chain works this way: it sells back part of the tail it was meant to cover.

### ③ Ratio spreads: selling the wing twice

A **1×2 ratio spread** buys one option and sells two further out of the money. For puts:

$$
\Pi(S_T) = (100 - S_T)^+ - 2\,(95 - S_T)^+ - D
$$

where \(D\) is the net debit. Down to 95 it is a bear put spread; below 95 the second short put is **naked**, and the position loses a dollar for every dollar XYZ falls.

> [!EXAMPLE] XYZ 100/95 put 1×2, 30 days
> Flat vol: \(D = 2.12 - 2 \times 0.51 = 1.10\). With the skew: \(D = 2.12 - 2 \times 0.72 = 0.68\) — the skew pays you for selling the rich 95s twice.
> With the skew: maximum profit \(5 - 0.68 = 4.32\) at 95; lower breakeven \(95 - 4.32 = 90.68\); at 80 the loss is \(20 - 30 - 0.68 = -10.68\); above 100 you lose only the 0.68.
> The mirror image on calls — buy the 100 call, sell two 105s — gets *more* expensive with the skew (1.03 → 1.39), because the calls you sell are the cheap ones.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="The naked tail of a 1×2 put ratio"><defs><marker id="ratios-risk-reversals-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs><polygon points="60.0,84.0 60.0,221.0 64.3,218.7 68.6,216.4 72.9,214.0 77.2,211.7 81.5,209.4 85.8,207.0 90.1,204.7 94.4,202.4 98.7,200.0 103.0,197.7 107.3,195.4 111.6,193.0 115.9,190.7 120.2,188.4 124.5,186.0 128.8,183.7 133.0,181.4 137.3,179.0 141.6,176.7 145.9,174.4 150.2,172.0 154.5,169.7 158.8,167.4 163.1,165.0 167.4,162.7 171.7,160.4 176.0,158.0 180.3,155.7 184.6,153.4 188.9,151.0 193.2,148.7 197.5,146.4 201.8,144.0 206.1,141.7 210.4,139.4 214.7,137.0 219.0,134.7 223.3,132.4 227.6,130.0 231.9,127.7 236.2,125.4 240.5,123.0 244.8,120.7 249.1,118.4 253.4,116.0 257.7,113.7 262.0,111.4 266.3,109.0 270.5,106.7 274.8,104.4 279.1,102.0 283.4,99.7 287.7,97.4 292.0,95.0 296.3,92.7 300.6,90.4 304.9,88.0 309.2,85.7 312.3,84.0 312.3,84.0" class="fx-area-bad"/><polygon points="312.3,84.0 312.3,84.0 313.5,83.4 317.8,81.0 322.1,78.7 326.4,76.4 330.7,74.0 335.0,71.7 339.3,69.4 343.6,67.0 347.9,64.7 352.2,62.4 356.5,60.0 360.8,57.7 365.1,55.4 369.4,53.0 373.7,50.7 378.0,48.4 382.3,46.0 386.6,43.7 390.9,46.0 395.2,48.4 399.5,50.7 403.8,53.0 408.0,55.4 412.3,57.7 416.6,60.0 420.9,62.4 425.2,64.7 429.5,67.0 433.8,69.4 438.1,71.7 442.4,74.0 446.7,76.4 451.0,78.7 455.3,81.0 459.6,83.4 460.8,84.0 460.8,84.0" class="fx-area-ok"/><polygon points="460.8,84.0 460.8,84.0 463.9,85.7 468.2,88.0 472.5,90.4 476.8,90.4 481.1,90.4 485.4,90.4 489.7,90.4 494.0,90.4 498.3,90.4 502.6,90.4 506.9,90.4 511.2,90.4 515.5,90.4 519.8,90.4 524.1,90.4 528.4,90.4 532.7,90.4 537.0,90.4 541.3,90.4 545.5,90.4 549.8,90.4 554.1,90.4 558.4,90.4 562.7,90.4 567.0,90.4 571.3,90.4 575.6,90.4 579.9,90.4 584.2,90.4 588.5,90.4 592.8,90.4 597.1,90.4 601.4,90.4 605.7,90.4 610.0,90.4 610.0,84.0" class="fx-area-bad"/><line x1="128.8" y1="28.0" x2="128.8" y2="196.0" class="fx-grid"/><line x1="214.7" y1="28.0" x2="214.7" y2="196.0" class="fx-grid"/><line x1="300.6" y1="28.0" x2="300.6" y2="196.0" class="fx-grid"/><line x1="386.6" y1="28.0" x2="386.6" y2="196.0" class="fx-grid"/><line x1="472.5" y1="28.0" x2="472.5" y2="196.0" class="fx-grid"/><line x1="558.4" y1="28.0" x2="558.4" y2="196.0" class="fx-grid"/><line x1="55.0" y1="84.0" x2="620.0" y2="84.0" class="fx-axis" marker-end="url(#ratios-risk-reversals-ah)"/><polyline points="60.0,221.0 64.3,218.7 68.6,216.4 72.9,214.0 77.2,211.7 81.5,209.4 85.8,207.0 90.1,204.7 94.4,202.4 98.7,200.0 103.0,197.7 107.3,195.4 111.6,193.0 115.9,190.7 120.2,188.4 124.5,186.0 128.8,183.7 133.0,181.4 137.3,179.0 141.6,176.7 145.9,174.4 150.2,172.0 154.5,169.7 158.8,167.4 163.1,165.0 167.4,162.7 171.7,160.4 176.0,158.0 180.3,155.7 184.6,153.4 188.9,151.0 193.2,148.7 197.5,146.4 201.8,144.0 206.1,141.7 210.4,139.4 214.7,137.0 219.0,134.7 223.3,132.4 227.6,130.0 231.9,127.7 236.2,125.4 240.5,123.0 244.8,120.7 249.1,118.4 253.4,116.0 257.7,113.7 262.0,111.4 266.3,109.0 270.5,106.7 274.8,104.4 279.1,102.0 283.4,99.7 287.7,97.4 292.0,95.0 296.3,92.7 300.6,90.4 304.9,88.0 309.2,85.7 313.5,83.4 317.8,81.0 322.1,78.7 326.4,76.4 330.7,74.0 335.0,71.7 339.3,69.4 343.6,67.0 347.9,64.7 352.2,62.4 356.5,60.0 360.8,57.7 365.1,55.4 369.4,53.0 373.7,50.7 378.0,48.4 382.3,46.0 386.6,43.7 390.9,46.0 395.2,48.4 399.5,50.7 403.8,53.0 408.0,55.4 412.3,57.7 416.6,60.0 420.9,62.4 425.2,64.7 429.5,67.0 433.8,69.4 438.1,71.7 442.4,74.0 446.7,76.4 451.0,78.7 455.3,81.0 459.6,83.4 463.9,85.7 468.2,88.0 472.5,90.4 476.8,90.4 481.1,90.4 485.4,90.4 489.7,90.4 494.0,90.4 498.3,90.4 502.6,90.4 506.9,90.4 511.2,90.4 515.5,90.4 519.8,90.4 524.1,90.4 528.4,90.4 532.7,90.4 537.0,90.4 541.3,90.4 545.5,90.4 549.8,90.4 554.1,90.4 558.4,90.4 562.7,90.4 567.0,90.4 571.3,90.4 575.6,90.4 579.9,90.4 584.2,90.4 588.5,90.4 592.8,90.4 597.1,90.4 601.4,90.4 605.7,90.4 610.0,90.4" class="fx-line-thick"/><text x="128.8" y="214.0" text-anchor="middle" class="fx-t-sm">80</text><text x="214.7" y="214.0" text-anchor="middle" class="fx-t-sm">85</text><text x="300.6" y="214.0" text-anchor="middle" class="fx-t-sm">90</text><text x="386.6" y="214.0" text-anchor="middle" class="fx-t-sm">95</text><text x="472.5" y="214.0" text-anchor="middle" class="fx-t-sm">100</text><text x="558.4" y="214.0" text-anchor="middle" class="fx-t-sm">105</text><text x="610.0" y="236.0" text-anchor="end" class="fx-t-sm">XYZ price at expiry</text><text x="386.6" y="33.7" text-anchor="middle" class="fx-t-ok">max +4.32 at 95</text><circle cx="312.3" cy="84.0" r="4.5" class="fx-fill-ink"/><text x="320.3" y="102.0" class="fx-t-b">90.68</text><text x="601.4" y="108.4" text-anchor="end" class="fx-t-sm">above 100: lose only the 0.68 debit</text><text x="601.4" y="182.0" text-anchor="end" class="fx-t-bad">← the extra short put is naked: −$1 for every $1 lower</text></svg>
<figcaption>Figure 2 · The 100/95 put 1×2 at expiry, priced with the skew. A small debit, a generous peak at the short strike — and below the lower breakeven (90.68) a naked short put: the loss grows one-for-one. The skew made this structure cheap precisely because that left tail is what the market fears most.</figcaption>
</figure>

Ratio spreads are popular because they often cost little and have a wide zone where you can only lose the small debit. Their Greeks reveal the bet: with the skew, the put 1×2 has \(\Delta \approx -0.08\), \(\Gamma \approx -0.014\), vega \(\approx -0.043\), \(\Theta \approx +0.023\) per day — **short vol, short the left tail, mildly bearish.** It is "I think XYZ drifts down to about 95, but doesn't crash".

### ④ Backspreads: buying the tail

A **backspread** is a ratio spread turned around: sell one closer option, buy two further out. It is exactly the negative of the 1×2.

| 30-day XYZ, with the skew | Cash at entry | Worst case | Tail |
|---|---|---|---|
| Put backspread: −100P +2×95P | credit 0.68 | −4.32 at 95 | +10.68 at 80, growing |
| Call backspread: −100C +2×105C | credit 1.39 | −3.61 at 105 | +11.39 at 120, growing |

The backspread is **long the tail**: it loses most if the stock drifts to the long strike and stops, and wins big on a large move. The skew makes the put backspread less attractive (its credit falls from 1.10 at flat vol to 0.68, because you buy the rich puts) and the call backspread more attractive (credit 1.03 → 1.39, because you buy the cheap calls). That asymmetry is the market's way of saying: crash protection is expensive, rally lottery tickets are cheap. It is a close cousin of the tail hedges in [[tail-hedging]].

### ⑤ The hidden tails: vol–spot dynamics

A payoff diagram assumes nothing happens to implied vol. On equities, something always does: **when the stock falls, implied vol rises, most of all on the puts.** Positions short the put wing get hit twice — once by the move, once by the vol.

The skew itself tells you how much, under one simple convention. If each strike keeps its vol as XYZ moves ("sticky strike"), then after a fall from 100 to 95 the new at-the-money option *is* the old 95 strike, at 22.8%: at-the-money vol has risen 2.8 points for a 5% fall, and a fall to 90 would put it at 26.4%. If instead the whole smile slides with the stock ("sticky delta"), at-the-money vol stays at 20%. Real markets usually sit between the two in ordinary times and beyond sticky strike in a crash, when the whole curve lifts.

> [!EXAMPLE] Scenarios after a few days (with the skew, vols per strike otherwise held fixed)
> - Bullish risk reversal (credit 0.19), XYZ falls to 95 in a week: −1.84 per share with the smile unchanged; −2.09 if all vols rise 3 points. XYZ rises to 105 instead: +2.11 unchanged, +1.93 if vols fall 2 points. The vol move goes against you in *both* directions.
> - Put 1×2 (debit 0.68): XYZ at 95 after 5 days → +0.26; at 90 with vols +5 → −2.19; at 85 with vols +8 → **−6.00**, already beyond its whole expiry profit potential.

This is vanna and volga at work ([[higher-order-greeks]]). The put 1×2 has negative volga (about −48 in raw units): as vol rises, its vega becomes *more* negative, so the loss accelerates. Ratios also create **margin** surprises: the naked short leg is margined like any uncovered option, and requirements rise as the stock falls ([[margin-approval]]).

> [!WARN] "Free" ratios are usually short a crash
> A ratio that costs nothing or pays a credit has sold more premium than it bought. On equities that premium almost always sits in the downside wing. Before trading one, price the position at the stock −15% with vols +10 points — not just at expiry on a flat-vol diagram.

### ⑥ State of play and connections

- **Where the skew came from.** On 19 October 1987 the Dow fell 22.6% and the S&P 500 20.5% in a day. Before that, index smiles were fairly flat; afterwards, a persistent put skew appeared and has stayed — "crash-o-phobia" in the market's prices ([[smile-skew]]).
- **Who is on each side.** Hedgers and portfolio insurers are natural buyers of puts; covered-call writers and option-income funds are natural sellers of calls ([[retail-flows]]). A risk reversal lets a trader take the other side of both flows at once — and be paid, on average, for providing insurance, with the same crash exposure as any insurer ([[variance-risk-premium]]).
- **The skew moves with the market.** Traders talk about sticky strike (each strike keeps its vol as spot moves) and sticky delta (the smile moves with spot). Real markets sit in between and change regime in crashes, which is why risk-reversal and ratio books are stress-tested on spot × vol grids ([[portfolio-risk]]).
- **Crypto can be different.** In strong rallies, bitcoin option smiles have at times tilted the other way, with upside calls richer (see [[crypto-options]]) — the same tools read the opposite tilt.

## @analogy
Think of an **insurance company that also sells lottery tickets**. Its customers pay dearly for fire insurance (puts) and hand over lottery-ticket-like upside cheaply (calls they sell for income). The price list is tilted: insurance is expensive, lottery tickets cheap. That tilt is the skew.

A **risk reversal** is going into business against the price list: you write fire insurance (sell the rich put) and use the money to buy lottery tickets (the cheap call). Most years the houses don't burn and you keep the premium plus whatever upside you win. In a bad year, many houses burn at once, and the fire season also makes insurance *more* expensive to buy back.

A **ratio spread** is writing two fire policies for every one you buy — cheap to set up, lucrative if a few small fires happen, ruinous in a wildfire. A **backspread** is the reverse: you pay a little to own extra fire insurance, and you lose most in a year with exactly one small fire.

Where the analogy breaks: fire insurers can diversify across towns, but a stock-market crash hits every "house" in the portfolio on the same day. There is no diversifying away a skew position's tail.

## @misconceptions
- **“A risk reversal that pays a credit is free upside.”** — The credit is the price of the downside you sold. In a sell-off the short put loses on the move and on rising vol.
- **“A risk reversal is a volatility trade.”** — It is nearly vega-neutral; it is a direction trade (delta about +0.39) plus a skew trade. The skew, not the vol level, is its vol bet.
- **“A 1×2 costing almost nothing has almost no risk.”** — Its low cost comes from selling the rich wing twice; below the lower breakeven the extra short option is naked.
- **“Skew means the market thinks the stock will fall.”** — Skew is about the *shape* of the risk-neutral distribution (fatter left tail and insurance demand), not the expected direction.
- **“Collars are neutral, so skew doesn't matter to them.”** — A collar is shares minus a risk reversal: with a typical equity skew it costs more, and the zero-cost call strike moves down.

## @takeaways
- The skew is summarised by \(RR_{25} = \sigma_{25C} - \sigma_{25P}\) (tilt) and \(BF_{25}\) (curvature); XYZ's illustrative \(RR_{25}\) is about −3.8 points.
- A risk reversal (long OTM call, short OTM put) is delta plus skew, nearly vega-neutral; the skew turns its flat-vol debit of 0.20 into a 0.19 credit.
- A collar is shares minus a risk reversal, so skew makes protection cost more and lowers the zero-cost call strike.
- Ratio spreads sell the rich wing twice and hide a naked tail; backspreads buy the tail and lose most at the long strike.
- Vol rises as equities fall: short-put-wing structures lose on both the move and the vol, so stress-test them on spot × vol, not on the expiry diagram.

## @quiz
1. XYZ's 25-delta call trades at 18.2% implied vol and the 25-delta put at 22.0%. What is \(RR_{25}\)?
   - [ ] +3.8 vol points
   - [x] −3.8 vol points
   - [ ] 20.1%, the average
   - [ ] 0.25, the delta
   > \(RR_{25} = \sigma_{25C} - \sigma_{25P} = 18.2 - 22.0 = -3.8\). Negative means puts are richer than calls — the usual equity skew.
2. Why does Kai's 95/105 collar go from a $0.20 credit at flat vol to a $0.19 debit with the skew?
   - [ ] Because the skew raises all option prices equally
   - [x] Because the put Kai buys gets more expensive and the call Kai sells gets cheaper
   - [ ] Because the skew changes the stock's expected return
   - [ ] Because collars are always priced at zero cost
   > With the skew the 95 put rises from 0.51 to 0.72 and the 105 call falls from 0.71 to 0.53. The collar is long the rich side and short the cheap side.
3. A bullish risk reversal (long 105 call, short 95 put) has vega near zero. Which change hurts it most with XYZ unchanged?
   - [ ] A parallel rise in all implied vols
   - [x] The skew steepening (puts getting richer relative to calls)
   - [ ] One day of time decay
   - [ ] A fall in interest rates
   > It is short the put's vol and long the call's; a steepening from about −3.8 to −5.8 points costs about 0.20 per share. A parallel vol move nearly cancels.
4. The XYZ 100/95 put 1×2 costs 0.68 with the skew. What happens if XYZ finishes at 80?
   - [ ] The loss is capped at 0.68
   - [ ] It makes the maximum profit of 4.32
   - [x] It loses about 10.68 per share, because one short 95 put is naked
   - [ ] It breaks even, because the long 100 put covers both short puts
   > \((100-80) - 2 \times (95-80) - 0.68 = 20 - 30 - 0.68 = -10.68\). The long put covers only one of the two short puts.
5. Why does the skew make the call backspread (sell 100 call, buy two 105 calls) *more* attractive but the put backspread *less* attractive?
   - [x] The backspread buys the wing; call wings are cheap under an equity skew, put wings expensive
   - [ ] Calls always have more gamma than puts
   - [ ] The put backspread has unlimited loss
   - [ ] The skew only affects puts
   > Call backspread credit rises from 1.03 to 1.39 (cheap calls bought); put backspread credit falls from 1.10 to 0.68 (rich puts bought).

## @further
- [Risk reversal (Wikipedia)](https://en.wikipedia.org/wiki/Risk_reversal) — definitions in equity and FX markets.
- [Ratio spread (Wikipedia)](https://en.wikipedia.org/wiki/Ratio_spread) — ratio and backspread construction.
- [Federal Reserve History: the stock market crash of 1987](https://www.federalreservehistory.org/essays/stock-market-crash-of-1987) — the day the equity skew was born.
- [Cboe S&P 500 PutWrite Index methodology](https://cdn.cboe.com/api/global/us_indices/governance/Cboe_SP_500_PutWrite_Indices_Methodology.pdf) — a rules-based seller of index puts, the systematic version of selling the rich wing.

## @next
The last lesson of this stage brings every tool together around one date on the calendar: an earnings announcement. How much move is priced in, how do you extract it, and what happens to each structure when the news hits and implied vol collapses?
