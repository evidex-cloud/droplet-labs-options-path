---
id: payoff-diagrams
prereqs: call-option, put-option, four-positions
demo: payoff-diagrams
---

# Reading Payoff Diagrams: The Hockey Stick

## @hook
Every option trade can be drawn as one picture: the stock's price at expiry along the bottom, your profit or loss up the side. Learn to read three things in that picture (where it bends, how steep each piece is, and where it crosses zero) and you can read any strategy, however many legs it has.

## @bridge
The anatomy lessons gave us the pieces: the [[call-option]], the [[put-option]], the [[four-positions]] (buy or sell each one), and the split of a premium into intrinsic and time value ([[intrinsic-time-value]]). This stage gives those pieces a shared language, the **payoff diagram**, and this first lesson teaches you to read it. The question it answers: how can one picture show every possible ending of a trade? It builds Idea ① (shape): an option is a shape, and later every strategy will be shapes added together.

## @intuition
Start with something that has no option in it at all.

Kai owns 100 shares of XYZ, bought at $100. In a month, what has Kai made or lost? It depends only on where XYZ ends up:

| XYZ in 30 days | 90 | 95 | 100 | 105 | 110 |
|---|---|---|---|---|---|
| Kai's P&L per share | −10 | −5 | 0 | +5 | +10 |
| For 100 shares | −$1,000 | −$500 | $0 | +$500 | +$1,000 |

Put the price on a horizontal axis and the profit or loss (P&L) on a vertical axis, plot the five points, and they sit on one straight line through zero at $100, rising one dollar for every dollar XYZ rises. That line is the whole story of owning a share: **each $1 move is $1 for you, in both directions.**

Now draw an option the same way. Instead of shares, suppose someone buys the course's standard option: the **30-day, $100-strike XYZ call** for **$2.45 per share** ($245 for one contract of 100 shares; all prices use the course's illustrative XYZ numbers, σ = 20%, r = 4%). At expiry the call is worth \(\max(S_T - 100,\,0)\), where \(S_T\) is XYZ's price on expiry day. Subtract the $2.45 paid:

| XYZ at expiry \(S_T\) | 90 | 100 | 102.45 | 110 | 120 |
|---|---|---|---|---|---|
| Call worth at expiry | 0 | 0 | 2.45 | 10 | 20 |
| P&L per share | −2.45 | −2.45 | 0 | +7.55 | +17.55 |
| P&L per contract | −$245 | −$245 | $0 | +$755 | +$1,755 |

Plot those points and the line is no longer straight. It runs **flat** at −2.45 everywhere below $100, then **bends** at the strike and climbs one-for-one like the share did. A flat blade and a rising handle: traders call it the **hockey stick**.

<figure>
<svg viewBox="0 0 640 270" role="img" aria-label="Annotated P&L diagram of a long 100-strike call bought for 2.45">
<defs><marker id="payoff-diagrams-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="60" y1="53.3" x2="610" y2="53.3" class="fx-grid"/>
<line x1="60" y1="95" x2="610" y2="95" class="fx-grid"/>
<line x1="60" y1="136.7" x2="610" y2="136.7" class="fx-grid"/>
<line x1="60" y1="220" x2="610" y2="220" class="fx-grid"/>
<polygon points="60,178.3 60,198.8 295.7,198.8 334.2,178.3" class="fx-area-bad"/>
<polygon points="334.2,178.3 610,32.1 610,178.3" class="fx-area-ok"/>
<line x1="60" y1="178.3" x2="620" y2="178.3" class="fx-axis" marker-end="url(#payoff-diagrams-ah)"/>
<line x1="60" y1="225" x2="60" y2="18" class="fx-axis" marker-end="url(#payoff-diagrams-ah)"/>
<polyline points="60,198.8 295.7,198.8 610,32.1" class="fx-line-thick"/>
<line x1="295.7" y1="30" x2="295.7" y2="225" class="fx-line-muted fx-dash"/>
<circle cx="295.7" cy="198.8" r="5" class="fx-fill-orange"/>
<circle cx="334.2" cy="178.3" r="5" class="fx-fill-ink"/>
<circle cx="452.9" cy="115.4" r="4" class="fx-fill-green"/>
<text x="54" y="57" text-anchor="end" class="fx-t-sm">+15</text>
<text x="54" y="99" text-anchor="end" class="fx-t-sm">+10</text>
<text x="54" y="141" text-anchor="end" class="fx-t-sm">+5</text>
<text x="54" y="182" text-anchor="end" class="fx-t-sm">0</text>
<text x="54" y="224" text-anchor="end" class="fx-t-sm">−5</text>
<text x="138.6" y="240" text-anchor="middle" class="fx-t-sm">90</text>
<text x="217.1" y="240" text-anchor="middle" class="fx-t-sm">95</text>
<text x="295.7" y="240" text-anchor="middle" class="fx-t-b">K = 100</text>
<text x="374.3" y="240" text-anchor="middle" class="fx-t-sm">105</text>
<text x="452.9" y="240" text-anchor="middle" class="fx-t-sm">110</text>
<text x="531.4" y="240" text-anchor="middle" class="fx-t-sm">115</text>
<text x="610" y="262" text-anchor="end" class="fx-t-sm">XYZ price at expiry, S<tspan baseline-shift="sub" font-size="10">T</tspan></text>
<text x="66" y="28" class="fx-t-sm">P&amp;L per share ($)</text>
<text x="66" y="216" class="fx-t-bad">flat: max loss −2.45 (premium)</text>
<text x="304" y="219" class="fx-t-hl">← kink at the strike</text>
<text x="344" y="196" class="fx-t">breakeven 102.45</text>
<text x="462" y="137" class="fx-t-ok">at 110: +7.55</text>
<text x="470" y="170" class="fx-t-sm">slope +1: moves like a share</text>
</svg>
<figcaption>Figure 1 · The long 30-day 100 call, bought for $2.45. Four things to read: the flat blade (the most you can lose is the premium), the kink at the strike, the slope of +1 above it, and the breakeven where the line crosses zero, \(K + c = 102.45\).</figcaption>
</figure>

How do you read one point? Pick a price on the bottom axis, go straight up until you hit the line, then look across to the side axis. At 110 you meet the line at +7.55: if XYZ is at $110 on expiry day, this call made $7.55 per share, $755 per contract. Try it:

::demo[payoff-diagrams-read]

> [!THINK] What does the slope mean in dollars?
> Left of $100 the call's line is flat; right of $100 it rises one-for-one. Before opening the answer, say in words what each slope means for the owner.
> ---
> Slope 0 means a $1 move in XYZ changes nothing: below the strike the call is worthless whether XYZ is at 80 or 99. Slope 1 means each $1 move is worth $1 per share, $100 per contract, exactly like owning one share. **A call is share ownership that switches on above the strike**, and the premium is the price of the switch.

> [!KAI] Shares or a call?
> Put Kai's shares line and the call's hockey stick on the same axes. If XYZ drops to $90, Kai's 100 shares lose $1,000, while the call holder loses only the $245 premium. If XYZ rises to $110, the shares make $1,000 and the call makes $755: the $245 is the difference, paid in every scenario for the protection on the downside. Neither line is "better"; they are **different shapes**, and the picture makes the trade-off visible at a glance.

That is the entire skill. Every strategy in this course, from a covered call to an iron condor, is drawn on these same two axes, and you read it with the same few questions. We'll take it in five parts:

- **① The axes: payoff versus P&L**
- **② Kinks and slopes: the grammar of the picture**
- **③ Reading any diagram in five steps**
- **④ Per share, per contract, and the traps of scale**
- **⑤ What the diagram leaves out, and where each gap is filled**

## @mechanics
### ① The axes: payoff versus P&L

A payoff diagram has exactly two ingredients:

- **Horizontal axis: \(S_T\)**, the price of the underlying at expiry. Not time. Moving along it means "suppose XYZ ends here instead."
- **Vertical axis: the result** of the position at that ending price.

"Result" can mean two slightly different things, and mixing them up is the most common reading error.

- **Payoff** is what the position is *worth* at expiry, ignoring what it cost. A call's payoff is \(\max(S_T - K, 0)\); a put's is \(\max(K - S_T, 0)\).
- **Profit and loss (P&L)** is payoff minus what you paid (or plus what you received, if you sold). For a bought call:

$$
\Pi(S_T) = \underbrace{\max(S_T - K,\ 0)}_{\text{payoff at expiry}} \;-\; \underbrace{c}_{\text{premium paid}}
$$

where \(\Pi\) is the profit or loss per share, \(S_T\) the price at expiry, \(K\) the strike and \(c\) the premium paid for the call.

> [!EXAMPLE] The same call, two curves
> 30-day 100 call, \(c = 2.45\). At \(S_T = 110\): payoff \(= \max(110 - 100, 0) = 10\); P&L \(= 10 - 2.45 = 7.55\), or \(7.55 \times 100 = \$755\) per contract.
> At \(S_T = 95\): payoff \(= 0\); P&L \(= 0 - 2.45 = -2.45\), or \(-\$245\) per contract.
> The P&L curve is the payoff curve **shifted down by the premium**, everywhere by the same 2.45.

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Payoff curve versus P&L curve of a long call: the P&L is the payoff shifted down by the premium">
<defs><marker id="payoff-diagrams-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="60" y1="183" x2="620" y2="183" class="fx-axis" marker-end="url(#payoff-diagrams-ah2)"/>
<line x1="60" y1="225" x2="60" y2="18" class="fx-axis" marker-end="url(#payoff-diagrams-ah2)"/>
<polyline points="60,183 295.7,183 610,34.8" class="fx-line-muted fx-dash"/>
<polyline points="60,201.1 295.7,201.1 610,53" class="fx-line-thick"/>
<line x1="531.4" y1="71.9" x2="531.4" y2="88" class="fx-line-hl" marker-end="url(#payoff-diagrams-ah2)"/>
<line x1="160" y1="184" x2="160" y2="198" class="fx-line-hl" marker-end="url(#payoff-diagrams-ah2)"/>
<circle cx="334.2" cy="183" r="5" class="fx-fill-ink"/>
<text x="54" y="187" text-anchor="end" class="fx-t-sm">0</text>
<text x="295.7" y="245" text-anchor="middle" class="fx-t-b">K = 100</text>
<text x="342" y="203" class="fx-t-sm">102.45</text>
<text x="452.9" y="245" text-anchor="middle" class="fx-t-sm">110</text>
<text x="138.6" y="245" text-anchor="middle" class="fx-t-sm">90</text>
<text x="610" y="245" text-anchor="end" class="fx-t-sm">S<tspan baseline-shift="sub" font-size="10">T</tspan></text>
<text x="520" y="40" text-anchor="end" class="fx-t">payoff max(S<tspan baseline-shift="sub" font-size="10">T</tspan> − K, 0)</text>
<text x="545" y="120" class="fx-t-hl">− 2.45</text>
<text x="172" y="196" class="fx-t-hl">− 2.45</text>
<text x="420" y="178" class="fx-t-b">P&amp;L = payoff − premium</text>
<text x="66" y="28" class="fx-t-sm">per share ($)</text>
</svg>
<figcaption>Figure 2 · Payoff (dashed) versus P&L (solid) for the 30-day 100 call. The shape is identical; the premium only slides it down by 2.45. That shift is why the P&L line crosses zero at \(K + c = 102.45\), not at the strike.</figcaption>
</figure>

For a **seller** the premium arrives instead of leaving, so the curve slides *up*: a short call's P&L is \(c - \max(S_T - K, 0)\), which starts at +2.45 and falls. Flip the buyer's P&L upside down and you have the seller's, point for point, because every dollar one side makes the other side loses ([[four-positions]]).

Two conventions used everywhere in this course. First, unless a chart says otherwise, the diagram shows **the result at expiry**; the dashed "today" curve arrives in [[before-expiry]]. Second, we ignore the interest you could have earned on the premium: on $2.45 for 30 days at 4% it is \(2.45 \times 0.04 \times \tfrac{30}{365} \approx \$0.008\), less than a cent.

### ② Kinks and slopes: the grammar of the picture

Look again at Figure 1. The line is made of **straight pieces joined at corners**. That is true of every expiry diagram built from options and shares, for a simple reason: each option's payoff is itself two straight pieces joined at its strike. So:

- **Corners (kinks) can only appear at strikes.** A position with strikes 95 and 105 can bend at 95 and 105 and nowhere else.
- **Between strikes, the line is straight**, and its slope is the only thing you need to know about that stretch.

What is the slope? It is **how many shares the position behaves like** over that stretch. Each share you own adds +1. A long call adds +1 once the price is above its strike (it is in the money there) and nothing below. A long put adds −1 below its strike (its value grows as the price falls) and nothing above. Short positions contribute the same with the opposite sign. In one line:

$$
\text{slope at } S_T \;=\; n_{\text{shares}} \;+\! \sum_{\text{calls with } K < S_T}\! n_i \;-\! \sum_{\text{puts with } K > S_T}\! n_i
$$

where \(n_{\text{shares}}\) is the number of shares per unit of the position (+1 long, −1 short), and each \(n_i\) is the quantity of an option (+1 for each one bought, −1 for each one sold). Only options that are **in the money** at that price count.

> [!EXAMPLE] Kai's covered call, read by slopes
> Kai owns the shares (+1) and sells the 30-day 105 call for $0.71 (−1 call at 105).
> - Below 105 the short call is out of the money, so it doesn't count: slope \(= +1\). The line rises like the shares, lifted by the 0.71 received.
> - Above 105 the short call counts: slope \(= +1 - 1 = 0\). The line goes flat.
>
> The flat top sits at \((105 - 100) + 0.71 = 5.71\), or \(\$571\) for 100 shares; the line crosses zero at \(100 - 0.71 = 99.29\). Two slopes and two numbers describe the whole trade, which [[covered-call]] studies in depth.

<figure>
<svg viewBox="0 0 640 270" role="img" aria-label="Covered call versus shares alone, with the slope of each segment">
<defs><marker id="payoff-diagrams-ah3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<polygon points="60,125 60,217.1 325.2,125" class="fx-area-bad"/>
<polygon points="325.2,125 403.8,97.7 610,97.7 610,125" class="fx-area-ok"/>
<line x1="60" y1="125" x2="620" y2="125" class="fx-axis" marker-end="url(#payoff-diagrams-ah3)"/>
<line x1="60" y1="235" x2="60" y2="18" class="fx-axis" marker-end="url(#payoff-diagrams-ah3)"/>
<polyline points="60,220.5 610,29.5" class="fx-line-muted fx-dash"/>
<polyline points="60,217.1 403.8,97.7 610,97.7" class="fx-line-thick"/>
<line x1="403.8" y1="30" x2="403.8" y2="235" class="fx-line-muted fx-dash"/>
<circle cx="325.2" cy="125" r="5" class="fx-fill-ink"/>
<text x="54" y="129" text-anchor="end" class="fx-t-sm">0</text>
<text x="54" y="102" text-anchor="end" class="fx-t-sm">5.71</text>
<text x="197.5" y="250" text-anchor="middle" class="fx-t-sm">90</text>
<text x="335" y="250" text-anchor="middle" class="fx-t-sm">100</text>
<text x="403.8" y="250" text-anchor="middle" class="fx-t-b">K = 105</text>
<text x="472.5" y="250" text-anchor="middle" class="fx-t-sm">110</text>
<text x="610" y="264" text-anchor="end" class="fx-t-sm">S<tspan baseline-shift="sub" font-size="10">T</tspan></text>
<text x="560" y="30" text-anchor="end" class="fx-t-sm">shares alone (slope +1)</text>
<text x="508" y="117" text-anchor="middle" class="fx-t-hl">slope 0 = (+1 share) + (−1 call)</text>
<text x="200" y="202" class="fx-t-hl">slope +1 (the share)</text>
<text x="316" y="114" text-anchor="end" class="fx-t">breakeven 99.29</text>
<text x="66" y="28" class="fx-t-sm">P&amp;L per share ($)</text>
</svg>
<figcaption>Figure 3 · Kai's covered call (solid) against the shares alone (dashed). Below the 105 strike the slope is the share's +1; above it the short call cancels the share and the slope drops to 0. The 0.71 premium lifts the solid line slightly above the dashed one on the left, and the cap at high prices is the price of that lift.</figcaption>
</figure>

The slope rule turns the four basic positions of [[four-positions]] into four short descriptions:

| Position (30-day, K = 100) | Slope below K | Slope above K | Max loss | Max gain | Breakeven |
|---|---|---|---|---|---|
| Long call, pay 2.45 | 0 | +1 | 2.45 | unlimited | 102.45 |
| Short call, receive 2.45 | 0 | −1 | unlimited | 2.45 | 102.45 |
| Long put, pay 2.12 | −1 | 0 | 2.12 | 97.88 (at \(S_T = 0\)) | 97.88 |
| Short put, receive 2.12 | +1 | 0 | 97.88 (at \(S_T = 0\)) | 2.12 | 97.88 |

Notice the put rows. A stock price cannot go below zero, so the put's "open" side is not infinite: the most a long put can pay is the strike itself, and its best P&L is \(100 - 2.12 = 97.88\) per share. A short call, on the other hand, has a slope of −1 all the way out, with no ceiling on how far the price can rise. That is why the short call is the one position brokers treat most carefully ([[margin-approval]]).

### ③ Reading any diagram in five steps

A new strategy looks intimidating until you run the same five questions over it. Take a diagram you have never seen, described only by its line: flat at +0.51 above 95, and falling one-for-one below 95.

1. **Units and date.** Per share or per contract? Which expiry? (Here: per share, 30 days.)
2. **Find the kinks.** One corner, at 95. So one strike is involved.
3. **Read the slopes, especially the two ends.** Right of 95 the slope is 0; left of 95 it is +1, meaning the line *falls* as the price falls. The right end is flat (capped gain); the left end keeps falling until \(S_T = 0\).
4. **Find the breakevens**, where the line crosses zero: \(95 - 0.51 = 94.49\).
5. **Read the extremes.** The best case is the flat top: +0.51. The worst case is at the far-left end, \(S_T = 0\): \(0.51 - 95 = -94.49\).

> [!EXAMPLE] Naming the mystery shape
> A kink at 95, flat above 95, sloping down below it, top at +0.51: this is a **short 95 put**, sold for $0.51. Per contract it keeps at most \(0.51 \times 100 = \$51\) and can lose up to \(94.49 \times 100 = \$9{,}449\) if XYZ goes to zero. It is also exactly Kai's protective-put trade seen from the seller's chair: whoever sells Kai the 95 put holds this line.

The same five steps work for a four-leg position. The main demo below turns them into a game: it shows a shape, and you name the position.

> [!WARN] A flat edge on a chart is not a cap
> Charting tools draw only the price range you asked for. A short call's line may look tame between 80 and 120, but its slope of −1 continues forever beyond the edge of the screen. Always check the **slope of the last piece** at both ends (step 3) rather than trusting where the picture happens to stop.

### ④ Per share, per contract, and the traps of scale

Option prices are quoted **per share**, but one US equity option contract covers **100 shares** ([[contract-specs]]). So there are two scales for the same picture:

- per share: the call's worst case is −2.45, its breakeven 102.45;
- per contract: multiply the vertical axis by 100, so the worst case is \(-2.45 \times 100 = -\$245\). **The horizontal axis does not change**: the breakeven is still XYZ at $102.45, not $10,245.

With several contracts the vertical axis scales again. Three contracts of the call risk \(3 \times 245 = \$735\), and every point on the line triples, but the kinks and the breakeven stay where they are. Broker risk graphs usually show the whole position in dollars, sometimes including commissions; some show P&L as a percentage of the premium, which makes a long call look like "−100% to +700%" and a share position like "−10% to +10%". Same trade, different vertical units, very different visual drama. Before comparing two charts, check that they use the same units.

### ⑤ What the diagram leaves out, and where each gap is filled

A payoff diagram is honest about one thing: **what happens at each possible ending price, on expiry day**. It is silent about four others, and each has its own lesson.

- **How much each point is worth in money terms**: the breakeven, the best and worst cases, and returns on the money at risk. That is [[breakeven-returns]].
- **Several positions at once.** Diagrams add point by point, which is how spreads, straddles and collars are built. That is [[payoff-lego]].
- **Time before expiry.** Before expiry an option still has time value, so its real P&L curve is smooth and sits above the hockey stick. That is [[before-expiry]].
- **Probability.** The diagram gives every price the same width on the axis, but XYZ is far more likely to end at 101 than at 120. Weighting the picture by probability is [[probability-ev]].

Later, [[strategy-matrix]] lays out the whole catalogue of shapes, sorted by the view each one expresses. All of them are read with the five steps above.

## @analogy
Think of a **mobile phone plan** drawn as a chart: data used this month along the bottom, your bill up the side.

A plain pay-as-you-go plan is a straight line: every extra gigabyte costs the same, like owning a share (every dollar of XYZ is a dollar for you). A plan with "10 GB included, then $5 per GB" is a hockey stick: flat up to 10 GB (you pay the fixed fee no matter what), then rising at a steady slope. The corner sits exactly at the allowance, the way a kink sits exactly at a strike, and the slope after the corner tells you the price of each extra unit, the way an option's slope tells you how many shares it acts like. To compare two plans you would not read the fine print line by line; you would draw both on the same chart and see where they cross. That crossing point is a breakeven.

Where the analogy breaks: you choose how much data you use, but nobody chooses where XYZ ends up. The chart tells you what each ending costs you, not how likely each ending is, and it assumes the bill arrives on one fixed day, with nothing happening in between.

## @misconceptions
- **“The horizontal axis is time.”** — It is the underlying's price at expiry. Time is fixed (expiry day) for the whole picture; how the curve changes as time passes is a different chart ([[before-expiry]]).
- **“Payoff and profit are the same thing.”** — Payoff is what the option is worth at expiry; profit subtracts the premium. That is why a call bought for 2.45 is in the money above 100 but only profitable above 102.45.
- **“The line is flat at the edge of my chart, so my loss is capped.”** — Charts end where the software stops drawing. Check the slope of the outermost piece: a short call's −1 slope never ends.
- **“The steep part of the line is where the action is, so it's the likely outcome.”** — The diagram contains no probabilities at all. A far-out-of-the-money call has a spectacular right side and a small chance of ever getting there ([[probability-ev]]).
- **“More legs make a diagram impossible to read.”** — Any number of legs still gives straight pieces with kinks only at strikes. Five questions (units, kinks, slopes, breakevens, extremes) read them all.

## @takeaways
- A payoff diagram plots the result at expiry (vertical) against the underlying's price at expiry (horizontal); it is a map of every possible ending.
- P&L is payoff shifted by the premium: down for a buyer, up for a seller; the shift moves the breakeven away from the strike.
- Kinks appear only at strikes; between them the slope equals the number of shares the position behaves like.
- Read any diagram in five steps: units, kinks, slopes of the ends, breakevens, and the extremes (including \(S_T = 0\)).
- Multiply the vertical axis by 100 for one contract; the horizontal axis and breakevens don't change.

## @quiz
1. Kai's friend buys the 30-day 105 call for $0.71. If XYZ is at $110 on expiry day, what is the P&L for one contract?
   - [ ] +$500
   - [x] +$429
   - [ ] +$71
   - [ ] +$571
   > Per share: \(\max(110 - 105, 0) - 0.71 = 4.29\); per contract \(4.29 \times 100 = \$429\). $500 is the payoff before subtracting the premium; $571 would be the covered call's cap.
2. On a P&L diagram, a stretch of the line has a slope of +1. What does that mean?
   - [ ] The position is guaranteed to be profitable there
   - [ ] Half of the outcomes lie in that stretch
   - [ ] The option is at the money there
   - [x] Over that stretch, each $1 rise in the underlying adds $1 per share, like owning one share
   > Slope measures how many shares the position behaves like. It says nothing about profit level (the line can have slope +1 while still below zero) or about probability.
3. A diagram is flat at −1.74 below 100, rises one-for-one between 100 and 105, and is flat at +3.26 above 105. What is the maximum loss for one contract?
   - [ ] $326
   - [ ] $500
   - [ ] Unlimited, because the line slopes upward
   - [x] $174
   > The lowest flat piece is −1.74 per share, so \(1.74 \times 100 = \$174\). Both ends are flat, so nothing is unlimited. (This is the 100/105 bull call spread you will meet in [[breakeven-returns]].)
4. For a long call bought for $2.45 with strike 100, which statement is correct?
   - [x] The payoff line bends at 100, while the P&L line crosses zero at 102.45
   - [ ] Both the payoff and the P&L lines cross zero at 100
   - [ ] The P&L line bends at 102.45
   - [ ] The payoff line is the P&L line shifted up by the strike
   > The kink always sits at the strike, for payoff and P&L alike. The premium shifts the whole P&L line down by 2.45, so it crosses zero at \(100 + 2.45 = 102.45\).
5. What is the maximum loss per contract for a short 95 put sold for $0.51?
   - [ ] $51
   - [x] $9,449
   - [ ] Unlimited
   - [ ] $9,500
   > The worst case is XYZ at zero: \(0.51 - 95 = -94.49\) per share, or \(-\$9{,}449\) per contract. It is large but not unlimited, because a price cannot fall below zero. $9,500 forgets the premium received.

## @further
- [Options Industry Council (OIC)](https://www.optionseducation.org/) — free strategy pages, each drawn with a payoff diagram in the same style as this lesson.
- [Characteristics and Risks of Standardized Options (OCC)](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the official disclosure document; its strategy sections describe maximum gains and losses in words.
- [Option (finance), Wikipedia](https://en.wikipedia.org/wiki/Option_(finance)) — definitions and payoff formulas for calls and puts in one place.
- [New Finance Path](https://evidex-cloud.github.io/droplet-labs-finance-path/) — the sister course, for how stocks and other assets behave before you add options on top.

## @next
One number jumped out of every diagram in this lesson: the price where the line crosses zero. How far does XYZ have to move to get there, what is the best and worst case in dollars, and how do you compare a $174 bet with a $9,449 one? The next lesson turns the picture into those numbers.
