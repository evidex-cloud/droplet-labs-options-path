---
id: payoff-lego
prereqs: payoff-diagrams, breakeven-returns, four-positions
demo: payoff-lego
---

# Payoff Lego: Adding Positions Together

## @hook
Payoff diagrams add. Stack two positions, add their heights at every price, and a new shape appears: slopes add, kinks collect, premiums add. With calls, puts and shares as bricks you can build any shape made of straight lines, and you will find that some very different-looking bricks are secretly the same brick.

## @bridge
[[payoff-diagrams]] taught us to read one shape; [[breakeven-returns]] turned finished shapes such as spreads and straddles into numbers. This lesson answers where those shapes come from, and how to build a shape that matches a view. It builds Idea ① (shape: every strategy is shapes added together) and gives the first glimpse of Idea ② (no-arbitrage): two combinations with the same shape must cost the same, which is the seed of [[put-call-parity]].

## @intuition
XYZ reports earnings in about three weeks. Suppose Kai expects a **big move** but has no idea which way. A long call wins if XYZ jumps; a long put wins if it drops. What if Kai buys **both**, the 30-day 100 call for $2.45 and the 30-day 100 put for $2.12?

To see the combined result, do the only thing you can do with two pictures drawn on the same axes: **at each price, add the two heights.**

| XYZ at expiry \(S_T\) | 90 | 95.43 | 100 | 104.57 | 110 |
|---|---|---|---|---|---|
| Long 100 call (paid 2.45) | −2.45 | −2.45 | −2.45 | +2.12 | +7.55 |
| Long 100 put (paid 2.12) | +7.88 | +2.45 | −2.12 | −2.12 | −2.12 |
| **Sum: the straddle** | **+5.43** | **0** | **−4.57** | **0** | **+5.43** |

The sum is a **V**: worst at 100, where both options expire worthless and Kai loses both premiums (\(2.45 + 2.12 = 4.57\), $457 per pair), and rising on both sides. This combination has a name, the **long straddle**. Nobody had to invent its shape; it fell out of the addition.

<figure>
<svg viewBox="0 0 640 245" role="img" aria-label="A long call plus a long put at the same strike add up to a V-shaped straddle">
<text x="115" y="24" text-anchor="middle" class="fx-t-b">long 100 call</text>
<text x="320" y="24" text-anchor="middle" class="fx-t-b">long 100 put</text>
<text x="525" y="24" text-anchor="middle" class="fx-t-b">straddle</text>
<line x1="25" y1="145" x2="205" y2="145" class="fx-axis"/>
<line x1="230" y1="145" x2="410" y2="145" class="fx-axis"/>
<line x1="435" y1="145" x2="615" y2="145" class="fx-axis"/>
<line x1="115" y1="52" x2="115" y2="190" class="fx-line-muted fx-dash"/>
<line x1="320" y1="52" x2="320" y2="190" class="fx-line-muted fx-dash"/>
<line x1="525" y1="52" x2="525" y2="190" class="fx-line-muted fx-dash"/>
<polygon points="497.6,145 525,179.3 552.4,145" class="fx-area-bad"/>
<polygon points="435,145 435,66.8 497.6,145" class="fx-area-ok"/>
<polygon points="552.4,145 615,66.8 615,145" class="fx-area-ok"/>
<polyline points="25,163.4 115,163.4 205,50.9" class="fx-line-hl"/>
<polyline points="230,48.4 320,160.9 410,160.9" class="fx-line-blue"/>
<polyline points="435,66.8 525,179.3 615,66.8" class="fx-line-thick"/>
<text x="217" y="120" text-anchor="middle" class="fx-t-b">+</text>
<text x="422" y="120" text-anchor="middle" class="fx-t-b">=</text>
<text x="115" y="44" text-anchor="middle" class="fx-t-sm">slopes 0 | +1</text>
<text x="320" y="44" text-anchor="middle" class="fx-t-sm">slopes −1 | 0</text>
<text x="525" y="44" text-anchor="middle" class="fx-t-sm">slopes −1 | +1</text>
<text x="30" y="178" class="fx-t-sm">−2.45</text>
<text x="405" y="178" text-anchor="end" class="fx-t-sm">−2.12</text>
<text x="525" y="198" text-anchor="middle" class="fx-t-bad">−4.57</text>
<text x="115" y="210" text-anchor="middle" class="fx-t-sm">K = 100</text>
<text x="320" y="210" text-anchor="middle" class="fx-t-sm">K = 100</text>
<text x="525" y="215" text-anchor="middle" class="fx-t-sm">BE 95.43 and 104.57</text>
<text x="320" y="238" text-anchor="middle" class="fx-t-sm">each panel: XYZ at expiry 85 to 115 (horizontal), P&amp;L per share (vertical)</text>
</svg>
<figcaption>Figure 1 · Payoff Lego in one line: at every price, add the heights. The call's slopes (0, +1) plus the put's (−1, 0) give the straddle's (−1, +1); the two premiums add to the 4.57 floor; both breakevens sit 4.57 from the strike.</figcaption>
</figure>

That one rule is the whole lesson. Written as a formula it is almost too simple to need writing:

$$
\Pi(S_T) = \sum_i n_i\,\pi_i(S_T)
$$

where \(\Pi\) is the P&L of the combination, \(\pi_i\) the P&L of one unit of leg \(i\) (one call, one put or one share), and \(n_i\) the quantity: \(+1\) for each one bought, \(-1\) for each one sold, \(+2\) for two bought, and so on. At \(S_T = 110\): \(\Pi = 1 \times 7.55 + 1 \times (-2.12) = 5.43\), or $543 for one call and one put.

> [!THINK] What do you get from a long 100 call plus a short 100 put?
> The call's slopes are (0, +1). Selling the put flips its slopes (−1, 0) into (+1, 0). Add them before opening the answer.
> ---
> Slopes \((0 + 1,\ 1 + 0) = (+1,\ +1)\): a straight line with slope 1 everywhere, **the shape of owning one share**. No kink survives, because the call's corner and the put's corner cancel exactly. The premiums add too: pay 2.45, receive 2.12, net 0.33. Two options have quietly rebuilt the stock. Section ③ shows why that is no accident.

We'll take it in five parts:

- **① The adding rule: heights, slopes, kinks and premiums**
- **② The classic combinations, built brick by brick**
- **③ Hidden twins: when different bricks make the same shape**
- **④ Any straight-line shape from calls, and the butterfly brick**
- **⑤ Where the Lego picture needs care**

## @mechanics
### ① The adding rule: heights, slopes, kinks and premiums

The formula \(\Pi(S_T) = \sum_i n_i\,\pi_i(S_T)\) has four consequences you can use without drawing anything.

- **Heights add.** The combination's P&L at any price is the sum of the legs' P&L at that price. Selling a leg (\(n = -1\)) flips its picture upside down; two of the same leg (\(n = 2\)) doubles its height.
- **Slopes add.** On each stretch between strikes, the combination's slope is the sum of the legs' slopes there. That is the slope rule of [[payoff-diagrams]], seen from the building side.
- **Kinks collect.** The combination can bend only at the legs' strikes, and sometimes not even there: if slope changes cancel at a strike, the corner disappears (the THINK above).
- **Premiums add.** The net premium is \(\sum_i n_i \times \text{price}_i\): positive means you pay a **net debit**, negative means you receive a **net credit**.

> [!EXAMPLE] Adding a short call to the straddle
> Take the straddle and also sell the 105 call for 0.71. New net premium: \(2.45 + 2.12 - 0.71 = 3.86\). New slopes: below 100, \(-1\); from 100 to 105, \(+1\); above 105, \(+1 - 1 = 0\). The right-hand side of the V now flattens at \((105 - 100) - 3.86 = 1.14\). Adding one leg cut the cost by 0.71 and capped the upside. Every "adjustment" traders make to a position is this kind of addition.

### ② The classic combinations, built brick by brick

Most strategies you will meet in [[strategy-matrix]] are two or three bricks. With Kai's 30-day XYZ prices (100 call 2.45, 100 put 2.12, 105 call 0.71, 95 put 0.51):

| Combination | Bricks | Net premium | Shape |
|---|---|---|---|
| Covered call | shares + short 105 call | receive 0.71 | slope +1, flat above 105 |
| Protective put | shares + long 95 put | pay 0.51 | flat below 95, slope +1 above |
| Collar | shares + long 95 put + short 105 call | receive 0.20 | flat, rising between 95 and 105, flat |
| Long straddle | long 100 call + long 100 put | pay 4.57 | V centered on 100 |
| Long strangle | long 95 put + long 105 call | pay 1.22 | wide flat-bottomed V, BEs 93.78 and 106.22 |
| Bull call spread | long 100 call + short 105 call | pay 1.74 | flat, rising between 100 and 105, flat |
| Bear put spread | long 100 put + short 95 put | pay 1.61 | flat, falling between 100 and 95, flat |

> [!KAI] Kai's collar, added up
> Kai owns the shares (bought at 100), buys the 95 put for 0.51 and sells the 105 call for 0.71. Net premium: \(-0.51 + 0.71 = +0.20\), a small **credit**. Adding heights:
> - below 95 the put covers every dollar of fall: \(\Pi = (95 - 100) + 0.20 = -4.80\), or −$480 for 100 shares;
> - between 95 and 105 the shares move alone: \(\Pi = S_T - 100 + 0.20\);
> - above 105 the call takes every extra dollar: \(\Pi = (105 - 100) + 0.20 = +5.20\), or +$520.
>
> Three bricks turned an open-ended share position into a **bounded range**, and it cost nothing today. The trade-off (and when it is worth it) is the subject of [[protective-put-collar]].

Combinations stack too. Put a **bull put spread** (sell the 95 put for 0.51, buy the 90 put for 0.06) next to a **bear call spread** (sell the 105 call for 0.71, buy the 110 call for 0.14) and you have an **iron condor**: a net credit of \(0.51 - 0.06 + 0.71 - 0.14 = 1.02\), a flat top between 95 and 105, and a worst case of \(5 - 1.02 = 3.98\) beyond either wing. Four bricks, two spreads, one shape that rents out the range 93.98 to 106.02 ([[iron-condor]]).

### ③ Hidden twins: when different bricks make the same shape

The THINK above found that a long call plus a short put at the same strike is a straight line. In symbols, for any \(S_T\):

$$
\max(S_T - K,\ 0) - \max(K - S_T,\ 0) = S_T - K
$$

where the first term is the call's payoff, the second the put's payoff, and the right-hand side the payoff of owning one share while owing \(K\) in cash at expiry. Check it at two prices with \(K = 100\): at \(S_T = 110\), \(10 - 0 = 10 = 110 - 100\); at \(S_T = 90\), \(0 - 10 = -10 = 90 - 100\). Above the strike only the call pays; below it only the put costs; together they reproduce every dollar of the share's move.

<figure>
<svg viewBox="0 0 640 245" role="img" aria-label="A long call plus a short put at the same strike add up to a straight line, the shape of a share">
<text x="115" y="24" text-anchor="middle" class="fx-t-b">long 100 call</text>
<text x="320" y="24" text-anchor="middle" class="fx-t-b">short 100 put</text>
<text x="525" y="24" text-anchor="middle" class="fx-t-b">synthetic share</text>
<line x1="25" y1="115" x2="205" y2="115" class="fx-axis"/>
<line x1="230" y1="115" x2="410" y2="115" class="fx-axis"/>
<line x1="435" y1="115" x2="615" y2="115" class="fx-axis"/>
<line x1="115" y1="52" x2="115" y2="190" class="fx-line-muted fx-dash"/>
<line x1="320" y1="52" x2="320" y2="190" class="fx-line-muted fx-dash"/>
<line x1="525" y1="52" x2="525" y2="190" class="fx-line-muted fx-dash"/>
<polyline points="25,126.5 115,126.5 205,56.2" class="fx-line-hl"/>
<polyline points="230,175.4 320,105.1 410,105.1" class="fx-line-blue"/>
<polyline points="435,186.9 615,46.2" class="fx-line-thick"/>
<text x="217" y="110" text-anchor="middle" class="fx-t-b">+</text>
<text x="422" y="110" text-anchor="middle" class="fx-t-b">=</text>
<text x="115" y="44" text-anchor="middle" class="fx-t-sm">slopes 0 | +1</text>
<text x="320" y="44" text-anchor="middle" class="fx-t-sm">slopes +1 | 0</text>
<text x="525" y="44" text-anchor="middle" class="fx-t-sm">slope +1 everywhere</text>
<text x="115" y="210" text-anchor="middle" class="fx-t-sm">pay 2.45</text>
<text x="320" y="210" text-anchor="middle" class="fx-t-sm">receive 2.12</text>
<text x="525" y="210" text-anchor="middle" class="fx-t-sm">net pay 0.33: like buying at 100.33</text>
<text x="320" y="238" text-anchor="middle" class="fx-t-sm">each panel: XYZ at expiry 85 to 115 (horizontal), P&amp;L per share (vertical)</text>
</svg>
<figcaption>Figure 2 · A long call plus a short put at the same strike lose their kinks and become one straight line, the shape of owning XYZ. Paying 0.33 today and 100 at expiry is like agreeing now to buy XYZ for about 100.33 in 30 days, which is exactly XYZ's 30-day forward price.</figcaption>
</figure>

Now look at the prices. The combination costs \(2.45 - 2.12 = 0.33\) today, plus the 100 you owe at expiry. The straightforward way to own the same line is to borrow the money and buy the share: pay 100 today, and repay the loan at expiry. Borrowing only the present value of 100, \(100\,e^{-0.04 \times 30/365} = 99.67\), makes the two routes cost the same today: \(100 - 99.67 = 0.33\). **Same shape, same price.** If the options cost more or less than 0.33, anyone could buy the cheap version, sell the expensive one, and lock in the difference with no risk. That argument is Idea ② (no-arbitrage), and it becomes put–call parity in [[put-call-parity]].

The same algebra explains two twins you will keep meeting:

- **Protective put = call + cash.** Shares plus the 95 put pay \(\max(S_T, 95) = 95 + \max(S_T - 95,\ 0)\): 95 in cash plus a 95 call. The insured shareholder and the call buyer hold the same shape.
- **Covered call = cash − put.** Shares minus the 105 call pay \(\min(S_T, 105) = 105 - \max(105 - S_T,\ 0)\): 105 in cash minus a 105 put. Selling a covered call and selling a cash-secured put are the same bet ([[covered-call]], [[cash-secured-put]]).

The full toolkit of synthetic positions, conversions and box spreads lives in [[synthetics-boxes]].

### ④ Any straight-line shape from calls, and the butterfly brick

Can you build *any* shape? For shapes made of straight pieces, yes, and the recipe needs only three ingredients: cash, shares and calls. Read the target shape from left to right and write:

$$
f(S_T) = a + b\,S_T + \sum_j m_j \max(S_T - K_j,\ 0)
$$

where \(a\) is the target's height at \(S_T = 0\) (held as cash), \(b\) its slope at the far left (held as shares), and \(m_j\) the **change in slope** at each kink \(K_j\) (buy \(m_j\) calls at that strike if it is positive, sell them if it is negative). Each call does exactly one thing: it bends the line by one unit of slope, starting at its strike.

Why only calls? Because puts are not needed: by section ③, a put is a call plus cash minus a share, so anything a put can build, calls, shares and cash can build too. You can just as well read a shape from right to left and use puts; traders pick whichever version is cheaper to trade or more liquid on the day. The recipe is the same, and the bricks are interchangeable.

> [!EXAMPLE] Building a tent: the butterfly
> Target: zero below 95, rising to 5 at 100, falling back to 0 at 105, zero above. Reading left to right: \(a = 0\), \(b = 0\); the slope goes \(0 \to +1\) at 95 (buy one 95 call), \(+1 \to -1\) at 100 (sell two 100 calls), \(-1 \to 0\) at 105 (buy one 105 call).
> Cost with Kai's prices (the 95 call is 5.82): \(5.82 - 2 \times 2.45 + 0.71 = 1.63\), or $163. Maximum payoff 5 at \(S_T = 100\), so the maximum profit is \(5 - 1.63 = 3.37\), and the breakevens are \(95 + 1.63 = 96.63\) and \(105 - 1.63 = 103.37\).

<figure>
<svg viewBox="0 0 640 262" role="img" aria-label="A butterfly built from three calls: the slope ledger and the resulting tent">
<defs><marker id="payoff-lego-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<polygon points="257.8,150 335,82.6 412.2,150" class="fx-area-ok"/>
<polygon points="60,150 60,182.6 220.4,182.6 257.8,150" class="fx-area-bad"/>
<polygon points="412.2,150 449.6,182.6 610,182.6 610,150" class="fx-area-bad"/>
<line x1="60" y1="150" x2="620" y2="150" class="fx-axis" marker-end="url(#payoff-lego-ah)"/>
<polyline points="60,150 220.4,150 335,50 449.6,150 610,150" class="fx-line-muted fx-dash"/>
<polyline points="60,182.6 220.4,182.6 335,82.6 449.6,182.6 610,182.6" class="fx-line-thick"/>
<line x1="220.4" y1="30" x2="220.4" y2="200" class="fx-line-muted fx-dash"/>
<line x1="335" y1="152" x2="335" y2="203" class="fx-line-muted fx-dash"/>
<line x1="449.6" y1="30" x2="449.6" y2="200" class="fx-line-muted fx-dash"/>
<text x="335" y="42" text-anchor="middle" class="fx-t-sm">payoff 5 (dashed)</text>
<text x="335" y="130" text-anchor="middle" class="fx-t-ok">max profit 3.37</text>
<text x="66" y="198" class="fx-t-bad">−1.63 (cost)</text>
<text x="140" y="140" text-anchor="middle" class="fx-t-b">slope 0</text>
<text x="262" y="95" text-anchor="end" class="fx-t-b">+1</text>
<text x="408" y="95" class="fx-t-b">−1</text>
<text x="530" y="140" text-anchor="middle" class="fx-t-b">slope 0</text>
<text x="220.4" y="216" text-anchor="middle" class="fx-t-sm">95</text>
<text x="335" y="216" text-anchor="middle" class="fx-t-sm">100</text>
<text x="449.6" y="216" text-anchor="middle" class="fx-t-sm">105</text>
<rect x="175" y="226" width="91" height="24" rx="4" class="fx-ok"/>
<rect x="289" y="226" width="92" height="24" rx="4" class="fx-bad"/>
<rect x="404" y="226" width="91" height="24" rx="4" class="fx-ok"/>
<text x="220.4" y="242" text-anchor="middle" class="fx-t">+1 call</text>
<text x="335" y="242" text-anchor="middle" class="fx-t">−2 calls</text>
<text x="449.6" y="242" text-anchor="middle" class="fx-t">+1 call</text>
<text x="610" y="216" text-anchor="end" class="fx-t-sm">S<tspan baseline-shift="sub" font-size="10">T</tspan></text>
</svg>
<figcaption>Figure 3 · The slope ledger. Each kink's change in slope (\(0 \to +1\), \(+1 \to -1\), \(-1 \to 0\)) is the number of calls to buy or sell there (+1, −2, +1). The result is a tent: the payoff (dashed) peaks at 5, the P&L (solid) is that tent lowered by its 1.63 cost.</figcaption>
</figure>

The butterfly is more than one more strategy. It is a **brick for building bricks**. A narrow tent pays only if XYZ lands in a small zone, so a row of narrow tents side by side can approximate any payoff the way pixels approximate a picture. And the price of each tent tells you how likely the market thinks it is that XYZ lands in that zone, an idea that [[risk-neutral-density]] turns into a way of reading probabilities straight out of option prices, and [[butterfly]] into a trade. Try building target shapes yourself:

::demo[payoff-lego-target]

### ⑤ Where the Lego picture needs care

Adding diagrams is exact, but only under conditions worth stating out loud.

- **Same expiry.** The expiry diagrams of legs add simply only when all legs expire on the same day. A calendar spread (sell a near-dated option, buy a later one) has no single expiry picture; on the near expiry day the far option still has time value, and you need the curved "today" line of [[before-expiry]] ([[calendar-diagonal]]).
- **Prices add too, and they must agree.** You can add any bricks you like, but you cannot build a shape that is positive everywhere and costs nothing. Identical shapes must cost the same, or a riskless profit appears. That is why section ③'s twins have matching prices, and it is the backbone of the pricing lessons ([[arbitrage-bounds]], [[put-call-parity]]).
- **Each brick keeps its own mechanics.** A short leg on an American-style option can be assigned early, which removes a brick from your structure overnight ([[exercise-assignment]]). And each leg crosses its own bid–ask spread: a four-leg butterfly pays four of them ([[liquidity-spreads]]).
- **Curves add as well.** Before expiry, each leg's P&L curve is smooth, and the combination's "today" curve is still the sum of the legs' curves. The adding rule survives; only the bricks get rounder.

## @analogy
Think of a **sound engineer's mixing desk**. Each instrument is a track, a wave drawn over time, and the loudspeaker plays the sum of all tracks at every instant. Push a fader up and that track's wave gets taller (buying two contracts instead of one). Flip a track's polarity and its wave turns upside down (selling instead of buying). Play a track together with its own flipped copy and you hear silence (buying and selling the same option). And two completely different sets of instruments can produce the very same sound at the speaker, the way a long call plus a short put reproduces a share.

Where the analogy breaks: in the studio every track is free, so nobody cares which set of instruments made the sound. In options every track has a price, and that is exactly what makes the twins interesting: if two mixes sound identical, the market must charge the same for both, or someone plays one against the other and pockets the difference.

## @misconceptions
- **“A four-leg strategy has four times the risk of one option.”** — Legs can cancel each other's risk. The 100/105 bull call spread risks $174, less than the $245 of the call alone.
- **“To combine positions, combine their breakevens.”** — Add heights at each price, not breakevens. The straddle's breakevens (95.43, 104.57) are neither the call's (102.45) nor the put's (97.88).
- **“Buying a call and selling a put at the same strike is a hedged position.”** — It is a synthetic share: slope +1 everywhere, the full downside of owning XYZ, with no kink to protect you.
- **“With clever legs you can build a shape that wins everywhere.”** — You can build the shape, but it will cost at least what it pays. Prices add along with payoffs, and identical shapes carry identical prices.
- **“A protective put and a long call are completely different bets.”** — Shares plus a put have the same shape as a call plus cash. Their prices differ only by that cash, which is what parity says.

## @takeaways
- The P&L of a combination is the sum of its legs' P&L at every price: \(\Pi(S_T) = \sum_i n_i\,\pi_i(S_T)\).
- Slopes add, kinks can appear only at the legs' strikes, and premiums add into a net debit or credit.
- Straddles, strangles, spreads, collars and covered calls are two or three bricks; their shapes come from the addition, not from memorization.
- Long call − long put at the same strike is a synthetic share (\(S_T - K\)); same shape means same price, the seed of put–call parity.
- Any straight-line shape is cash + shares + calls at each kink, bought or sold according to the change in slope; the butterfly is the brick that builds bricks.

## @quiz
1. Kai buys the 100 call for 2.45 and the 100 put for 2.12. If XYZ ends at $110, what is the P&L for one call plus one put?
   - [ ] +$755
   - [x] +$543
   - [ ] +$212
   - [ ] +$457
   > Add heights: call \(10 - 2.45 = 7.55\), put \(0 - 2.12 = -2.12\), total \(5.43\) per share, \(\$543\). $755 forgets that the put's premium is lost.
2. A position holds one share, a long 95 put and a short 105 call. What are its slopes from left to right (below 95, between 95 and 105, above 105)?
   - [ ] +1, +1, +1
   - [ ] −1, 0, +1
   - [x] 0, +1, 0
   - [ ] +1, 0, −1
   > Below 95: share \(+1\) plus put \(-1\) = 0. Between: only the share, +1. Above 105: share \(+1\) plus short call \(-1\) = 0. This is the collar: flat, rising, flat.
3. What does a long 100 call plus a short 100 put (same expiry) behave like at expiry?
   - [ ] A straddle that profits from a big move either way
   - [ ] A riskless position, because the two options hedge each other
   - [ ] Nothing at all, because the payoffs cancel
   - [x] Owning one XYZ share bought for about 100.33, with the full upside and downside
   > The kinks cancel and the slope is +1 everywhere: \(\max(S_T - 100, 0) - \max(100 - S_T, 0) = S_T - 100\). With the 0.33 net premium, it is like buying XYZ at about 100.33 at expiry.
4. You want a payoff of 0 below 95, rising to 5 at 100, back to 0 at 105, and 0 above. Which calls build it?
   - [x] Buy one 95 call, sell two 100 calls, buy one 105 call
   - [ ] Buy one 95 call, buy one 100 call, buy one 105 call
   - [ ] Sell one 95 call, buy two 100 calls, sell one 105 call
   - [ ] Buy one 100 call and sell one 105 call
   > The slope changes by \(+1\) at 95, \(-2\) at 100 and \(+1\) at 105; each unit of slope change is one call bought (+) or sold (−). The third choice builds the upside-down tent; the last builds a bull call spread.
5. Shares plus a long 95 put have the same expiry shape as a long 95 call plus $95 of cash. Why must the two cost the same today?
   - [ ] Because the market sets all option prices equal
   - [ ] Because puts and calls always cost the same
   - [x] Because if one were cheaper, you could buy it, sell the other, and lock in the difference with no risk
   - [ ] They don't have to; the shape says nothing about price
   > Identical payoffs in every scenario must have identical prices, or a riskless profit exists. This is Idea ② (no-arbitrage), made precise in [[put-call-parity]].

## @further
- [Put–call parity, Wikipedia](https://en.wikipedia.org/wiki/Put%E2%80%93call_parity) — the relation behind section ③'s twins, with the replication argument.
- [Butterfly (options), Wikipedia](https://en.wikipedia.org/wiki/Butterfly_(options)) — the tent-shaped spread, its variants and its link to probabilities.
- [Straddle, Wikipedia](https://en.wikipedia.org/wiki/Straddle) — the long and short straddle, the first combination in this lesson.
- [Options Industry Council (OIC)](https://www.optionseducation.org/) — strategy pages that show each multi-leg position as the sum of its legs.

## @next
Every shape in this lesson was drawn on expiry day, when options have only intrinsic value left. But most trades are opened, watched and often closed weeks earlier. What does Kai's call look like on day 1, day 15 and day 29, and why does its line bend into a smooth curve that sits above the hockey stick?
