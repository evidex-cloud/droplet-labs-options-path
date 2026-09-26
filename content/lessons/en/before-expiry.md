---
id: before-expiry
prereqs: payoff-diagrams, payoff-lego, intrinsic-time-value
demo: before-expiry
---

# Before vs At Expiry: Why Today's Curve Is Curved

## @hook
On expiry day an option is a hockey stick. On every day before, its value is a smooth curve lying above the stick, and three forces move that curve: the stock price, the passing of time, and volatility. That is how a stock can rise while the call on it loses money.

## @bridge
In [[intrinsic-time-value]] we split a premium into intrinsic value and time value; in [[payoff-diagrams]] and [[payoff-lego]] we drew and built shapes, always on expiry day. This lesson asks what the same positions look like on all the days *before* expiry, when time value is still alive. It builds Idea ① (shape: the kink becomes a curve), Idea ③ (volatility: how much XYZ may still move keeps the curve up) and Idea ④ (risk: price, time and volatility become three measurable sources of P&L, the Greeks of [[greeks-map]]).

## @intuition
Kai's friend buys the 30-day 100 call for $2.45. The expiry diagram says that if XYZ sits at $100, the trade loses $2.45. But on the day of purchase, with XYZ at $100, the call is obviously still worth $2.45; that is what was just paid for it. The expiry diagram describes **one day only**, the last one.

So what is the call worth on the days in between? Using the course's standard inputs (σ = 20%, r = 4%), here is its value at three stock prices, as the days run out:

| Days left | XYZ at 95 | XYZ at 100 | XYZ at 105 | P&L at 100 (paid 2.45) |
|---|---|---|---|---|
| 30 (today) | 0.63 | 2.45 | 5.91 | 0 |
| 14 | 0.18 | 1.64 | 5.34 | −0.81 |
| 3 | 0.00 | 0.74 | 5.03 | −1.71 |
| 0 (expiry) | 0 | 0 | 5.00 | −2.45 |

Plot the P&L for every price, one line per date, and the hockey stick turns out to be the last frame of a film:

<figure>
<svg viewBox="0 0 640 270" role="img" aria-label="P&L of a long 100 call with 30, 14, 3 and 0 days left: smooth curves sinking onto the hockey stick">
<defs><marker id="before-expiry-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="60" y1="120" x2="610" y2="120" class="fx-grid"/>
<line x1="60" y1="64.4" x2="610" y2="64.4" class="fx-grid"/>
<line x1="60" y1="175.6" x2="620" y2="175.6" class="fx-axis" marker-end="url(#before-expiry-ah)"/>
<line x1="60" y1="225" x2="60" y2="18" class="fx-axis" marker-end="url(#before-expiry-ah)"/>
<line x1="335" y1="25" x2="335" y2="225" class="fx-line-muted fx-dash"/>
<polyline points="60,202.7 78.3,202.7 96.7,202.6 115,202.5 133.3,202.2 151.7,201.9 170,201.3 188.3,200.5 206.7,199.4 225,197.9 243.3,195.8 261.7,193.2 280,189.9 298.3,185.9 316.7,181.1 335,175.5 353.3,169.2 371.7,162.2 390,154.4 408.3,146.1 426.7,137.1 445,127.7 463.3,117.9 481.7,107.8 500,97.4 518.3,86.9 536.7,76.1 555,65.3 573.3,54.3 591.7,43.4 610,32.3" class="fx-line-hl"/>
<polyline points="60,202.8 78.3,202.8 96.7,202.8 115,202.8 133.3,202.8 151.7,202.7 170,202.7 188.3,202.5 206.7,202.2 225,201.7 243.3,200.7 261.7,199.2 280,197 298.3,193.9 316.7,189.8 335,184.6 353.3,178.2 371.7,170.8 390,162.4 408.3,153.2 426.7,143.4 445,133.2 463.3,122.6 481.7,111.8 500,100.9 518.3,89.9 536.7,78.8 555,67.7 573.3,56.6 591.7,45.5 610,34.4" class="fx-line-blue fx-dash"/>
<polyline points="60,202.8 78.3,202.8 96.7,202.8 115,202.8 133.3,202.8 151.7,202.8 170,202.8 188.3,202.8 206.7,202.8 225,202.8 243.3,202.8 261.7,202.7 280,202.4 298.3,201.4 316.7,199 335,194.6 353.3,187.7 371.7,178.8 390,168.7 408.3,157.9 426.7,146.8 445,135.7 463.3,124.6 481.7,113.5 500,102.4 518.3,91.3 536.7,80.2 555,69.1 573.3,58 591.7,46.9 610,35.7" class="fx-line-muted fx-dash"/>
<polyline points="60,202.8 335,202.8 610,36.1" class="fx-line-thick"/>
<circle cx="335" cy="175.5" r="4.5" class="fx-fill-orange"/>
<circle cx="335" cy="184.6" r="4" class="fx-fill-blue"/>
<circle cx="335" cy="194.6" r="4" class="fx-fill-muted"/>
<circle cx="335" cy="202.8" r="4" class="fx-fill-ink"/>
<text x="54" y="68" text-anchor="end" class="fx-t-sm">+10</text>
<text x="54" y="124" text-anchor="end" class="fx-t-sm">+5</text>
<text x="54" y="180" text-anchor="end" class="fx-t-sm">0</text>
<text x="54" y="207" text-anchor="end" class="fx-t-sm">−2.45</text>
<text x="151.7" y="240" text-anchor="middle" class="fx-t-sm">90</text>
<text x="243.3" y="240" text-anchor="middle" class="fx-t-sm">95</text>
<text x="335" y="240" text-anchor="middle" class="fx-t-b">K = 100</text>
<text x="426.7" y="240" text-anchor="middle" class="fx-t-sm">105</text>
<text x="518.3" y="240" text-anchor="middle" class="fx-t-sm">110</text>
<text x="610" y="262" text-anchor="end" class="fx-t-sm">XYZ price S</text>
<text x="66" y="28" class="fx-t-sm">P&amp;L per share (bought at 2.45)</text>
<text x="72" y="52" class="fx-t-hl">30 days left: P&amp;L at 100 = 0</text>
<text x="72" y="70" class="fx-t-blue">14 days left: −0.81</text>
<text x="72" y="88" class="fx-t-sm">3 days left: −1.71</text>
<text x="72" y="106" class="fx-t-b">expiry: −2.45</text>
<text x="600" y="168" text-anchor="end" class="fx-t-sm">curves sink onto the stick</text>
</svg>
<figcaption>Figure 1 · The same long 100 call with 30 (solid blue), 14 (dashed violet), 3 (dashed gray) and 0 days left (black hockey stick). Before expiry the line has no corner and lies above the stick; the gap is time value, widest at the strike, and it closes faster and faster at the end. The dots show the P&L with XYZ unchanged at 100.</figcaption>
</figure>

Four things stand out. The curve has **no kink**: the sharp corner at the strike only appears on the last day. It lies **above** the hockey stick, everywhere. The gap is **widest at the strike** and thin far away from it. And the curve **sinks onto the stick**, slowly at first and quickly at the end: from 30 to 14 days left the call lost 0.81, but in the last three days alone it loses 0.74.

> [!THINK] Why must the curve sit above the hockey stick?
> Before expiry, would anyone sell you the 100 call with XYZ at 110 for less than 10? Think about what the buyer could do with it.
> ---
> The buyer could never be worse off than holding the intrinsic value, because at expiry the call pays at least \(\max(S_T - 100, 0)\), and while time remains XYZ can still move further up, while the downside of the call is capped at zero. More good outcomes than bad ones left to happen means value **on top of** intrinsic. That extra is time value, and it exists because the future is uncertain, which is Idea ③: volatility is what keeps the curve up.

> [!KAI] The stock went up, and the call went down
> Twenty days after the purchase, XYZ is at $101: up 1%. The friend checks the call: it is worth \(1.95\), down from 2.45. That is **−$50 per contract** on a correct forecast. Nothing went wrong; ten days of time value melted faster than a one-dollar rise could add intrinsic value. The expiry diagram could never have shown this, because it only knows about the last day.

We'll take it in five parts:

- **① Today's curve and the expiry line**
- **② Three forces: price, time and volatility**
- **③ "The stock went up but my call lost money"**
- **④ Sellers see the mirror image**
- **⑤ Where the curve comes from, and what comes next**

## @mechanics
### ① Today's curve and the expiry line

Write \(V(S, t)\) for the option's value when the stock is at \(S\) and the date is \(t\), and \(\tau\) for the time left until expiry, in years. For a call on a stock that pays no dividend, today's value can never fall below the expiry line:

$$
V(S, t) \;\ge\; S - K e^{-r\tau} \;\ge\; \max(S - K,\ 0) \qquad (\text{call},\ \tau > 0)
$$

where \(K\) is the strike, \(r\) the interest rate and \(Ke^{-r\tau}\) the strike's present value. The first inequality holds because the call plus \(Ke^{-r\tau}\) in the bank is always worth at least one share at expiry; the second because \(Ke^{-r\tau} \le K\) and a value can't be negative.

> [!EXAMPLE] XYZ at 110, 30 days left
> Intrinsic value: \(110 - 100 = 10\). Tighter bound: \(110 - 100\,e^{-0.04 \times 30/365} = 110 - 99.67 = 10.33\). Model value: \(10.43\). So \(10.43 \ge 10.33 \ge 10\). The call is worth 0.43 more than its intrinsic value; of that, 0.33 is the interest saved by paying the strike later, and the remaining 0.10 is the small chance that XYZ falls back below 100, where the call's loss stops at zero.

**Time value** is the vertical gap between today's curve and the expiry line. At the strike it is the whole premium (2.45 with 30 days left). Deep in the money (XYZ at 110) it is 0.43; far out of the money (XYZ at 90) it is the entire, tiny, value of 0.08. The gap is widest where the outcome is most uncertain, at the strike, where one more dollar up or down decides whether the option pays.

The curve also shows its **slope**. At expiry the slope was 0 or 1 ([[payoff-diagrams]]); before expiry it can be anything in between. At XYZ = 100 with 30 days left the curve's slope is **0.534**: a $1 rise adds about $0.53. That slope is called **delta**, and it is the first of the Greeks ([[delta]]).

> [!DEEP] A put's curve can dip below its hockey stick
> The inequality above is for calls. A **European** put deep in the money can be worth *less* than its intrinsic value: with XYZ at 80 and 30 days left, the 100 put is worth 19.67 while its intrinsic value is 20. Its holder must wait to receive the 100, and waiting costs interest: \(100\,e^{-0.04 \times 30/365} - 80 = 19.67\). An **American** put's curve can never dip below 20, because its holder could exercise today; that right is worth something exactly here ([[american-exercise]]).

### ② Three forces: price, time and volatility

Three things change the option's value from one day to the next, and each has a number that says how strongly:

$$
\dd V \;\approx\; \Delta\,\dd S \;+\; \Theta\,\dd t \;+\; \nu\,\dd\sigma
$$

where \(\dd V\) is the change in the option's value, \(\dd S\) the change in the stock price, \(\dd t\) the time that passes, \(\dd\sigma\) the change in implied volatility (the market's volatility input, [[implied-vol]]), and:

- \(\Delta\) (**delta**) is the slope of today's curve: value per $1 of stock;
- \(\Theta\) (**theta**) is value lost per day as time passes, with the stock unchanged;
- \(\nu\) (**vega**) is value gained per volatility point (per 1% of σ).

For the 30-day 100 call: \(\Delta = 0.534\), \(\Theta = -0.044\) per day, \(\nu = 0.114\) per vol point.

<figure>
<svg viewBox="0 0 640 245" role="img" aria-label="Three forces on the call's curve: price moves along it, time lowers it, volatility raises it">
<defs><marker id="before-expiry-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead-hl"/></marker></defs>
<text x="115" y="24" text-anchor="middle" class="fx-t-b">① price: slide along</text>
<text x="320" y="24" text-anchor="middle" class="fx-t-b">② time: curve sinks</text>
<text x="525" y="24" text-anchor="middle" class="fx-t-b">③ volatility: curve lifts</text>
<line x1="25" y1="190" x2="205" y2="190" class="fx-axis"/>
<line x1="230" y1="190" x2="410" y2="190" class="fx-axis"/>
<line x1="435" y1="190" x2="615" y2="190" class="fx-axis"/>
<polyline points="25,190 115,190 205,63.7" class="fx-line-muted"/>
<polyline points="230,190 320,190 410,63.7" class="fx-line-muted"/>
<polyline points="435,190 525,190 615,63.7" class="fx-line-muted"/>
<polyline points="25,186.8 36.3,185.2 47.5,183 58.8,180.1 70,176.3 81.3,171.7 92.5,166 103.8,159.2 115,151.3 126.3,142.3 137.5,132.3 148.8,121.3 160,109.4 171.3,96.7 182.5,83.4 193.8,69.4 205,55.1" class="fx-line-hl"/>
<polyline points="230,186.8 241.3,185.2 252.5,183 263.8,180.1 275,176.3 286.3,171.7 297.5,166 308.8,159.2 320,151.3 331.3,142.3 342.5,132.3 353.8,121.3 365,109.4 376.3,96.7 387.5,83.4 398.8,69.4 410,55.1" class="fx-line-hl"/>
<polyline points="230,188.8 241.3,187.9 252.5,186.6 263.8,184.5 275,181.7 286.3,177.8 297.5,172.8 308.8,166.4 320,158.8 331.3,149.8 342.5,139.5 353.8,128.1 365,115.6 376.3,102.3 387.5,88.3 398.8,73.7 410,58.8" class="fx-line-blue fx-dash"/>
<polyline points="435,186.8 446.3,185.2 457.5,183 468.8,180.1 480,176.3 491.3,171.7 502.5,166 513.8,159.2 525,151.3 536.3,142.3 547.5,132.3 558.8,121.3 570,109.4 581.3,96.7 592.5,83.4 603.8,69.4 615,55.1" class="fx-line-hl"/>
<polyline points="435,177.7 446.3,174.4 457.5,170.6 468.8,166.2 480,161 491.3,155.2 502.5,148.6 513.8,141.3 525,133.3 536.3,124.5 547.5,115.1 558.8,104.9 570,94.1 581.3,82.7 592.5,70.7 603.8,58.2 615,45.2" class="fx-line-blue fx-dash"/>
<circle cx="115" cy="151.3" r="4.5" class="fx-fill-orange"/>
<circle cx="160" cy="109.4" r="4.5" class="fx-fill-orange"/>
<path d="M 119,145 Q 140,132 155,115" class="fx-line-hl" fill="none" marker-end="url(#before-expiry-ah2)"/>
<line x1="320" y1="146" x2="320" y2="156" class="fx-line-hl" marker-end="url(#before-expiry-ah2)"/>
<line x1="525" y1="156" x2="525" y2="138" class="fx-line-hl" marker-end="url(#before-expiry-ah2)"/>
<text x="60" y="80" class="fx-t-sm">S 100 → 104:</text>
<text x="60" y="96" class="fx-t-sm">2.45 → 5.11</text>
<text x="240" y="80" class="fx-t-sm">30 → 20 days:</text>
<text x="240" y="96" class="fx-t-sm">2.45 → 1.98</text>
<text x="445" y="80" class="fx-t-sm">σ 20% → 30%:</text>
<text x="445" y="96" class="fx-t-sm">2.45 → 3.59</text>
<text x="115" y="208" text-anchor="middle" class="fx-t-sm">K = 100</text>
<text x="320" y="208" text-anchor="middle" class="fx-t-sm">K = 100</text>
<text x="525" y="208" text-anchor="middle" class="fx-t-sm">K = 100</text>
<text x="320" y="236" text-anchor="middle" class="fx-t-sm">each panel: XYZ price 92 to 108 (horizontal), value of the 100 call (vertical); gray = expiry value</text>
</svg>
<figcaption>Figure 2 · The three forces, one at a time, on the 30-day 100 call. A price move slides the position along the curve (its slope is delta). Time pushes the whole curve down toward the stick (theta). A rise in implied volatility lifts the whole curve (vega). Real days mix all three.</figcaption>
</figure>

> [!EXAMPLE] A good week for Kai's friend, estimated and exact
> Over 7 days XYZ rises by $2 and implied volatility stays at 20%. Estimate: \(\Delta\,\dd S + \Theta\,\dd t = 0.534 \times 2 + (-0.044) \times 7 = 1.07 - 0.31 = 0.76\). Exact repricing (XYZ 102, 23 days left): the call is worth 3.34, a gain of \(3.34 - 2.45 = 0.89\).
> The estimate misses 0.13, and the reason is visible in Figure 1: the curve **bends upward**, so a straight line along the slope undershoots it. The missing piece is \(\tfrac12\Gamma(\dd S)^2 = \tfrac12 \times 0.069 \times 2^2 \approx 0.14\), where \(\Gamma\) (gamma) measures the bend. Add it and the estimate becomes 0.90. Gamma gets its own lesson, [[gamma]]; the full expansion is in [[greeks-map]].

### ③ "The stock went up but my call lost money"

The formula makes the most common beginner complaint easy to diagnose. The stock term \(\Delta\,\dd S\) was positive; one of the other two must have been more negative.

**Culprit one: time.** In the KAI story above, XYZ rose $1 over 20 days: the price move added about 0.6, while 20 days of theta took away about 1.1. The call went from 2.45 to 1.95. Theta is a steady drain, and it accelerates near expiry: with one day left the at-the-money call loses about 0.21 a day ([[theta]]).

**Culprit two: volatility.** Before a scheduled event such as earnings, the market often prices in a bigger move, so implied volatility rises; right after the event it tends to fall back. That fall is called an **IV crush** ([[earnings-events]]). Suppose, for illustration, that ahead of XYZ's earnings (three weeks away) the market prices the 30-day 100 call at an implied volatility of 30% instead of 20%: it costs **3.59** ($359). Earnings come out 21 days later. XYZ jumps to **103**, and implied volatility drops back to 20%. With 9 days left, the call is worth **3.38**. Walk the three forces through one at a time:

| Step (in order) | Call value | Change |
|---|---|---|
| Bought: S 100, 30 days, IV 30% | 3.59 | |
| XYZ rises to 103 | 5.39 | **+1.80** (price) |
| 21 days pass | 3.84 | **−1.55** (time) |
| IV falls from 30% to 20% | 3.38 | **−0.46** (volatility) |
| **Total** | | **−0.21** ($21 per contract) |

The stock went up 3%, the forecast was right, and the call still lost money. Had XYZ risen only to 102, the call would be worth 2.58, a loss of 1.01 (−28%). Each step in the table is a real repricing, so the three changes add up exactly; which force gets how much depends on the order you apply them in, but the total never does. Try your own numbers:

::demo[before-expiry-surprise]

> [!WARN] A long option needs more than the right direction
> To make money buying an option before expiry, the stock must move **far enough** (beat the breakeven), **soon enough** (before time value melts) and, if you paid a high implied volatility, **by more than the market expected**. Being right about direction satisfies only the first half of the first condition.

### ④ Sellers see the mirror image

Whoever sold that call holds exactly the opposite position, so every curve flips. The seller's P&L today is the premium received minus the option's current value; because that value is at least the intrinsic value, **the seller's today curve lies below their expiry line**.

Time now works for the seller. With XYZ still at 100, the short 100 call's P&L climbs toward its flat top: 0 on day one, \(+0.81\) with 14 days left, \(+1.71\) with 3 days left, \(+2.45\) at expiry. That steady climb is why selling options is often called "collecting theta", and it is the engine behind covered calls and cash-secured puts ([[covered-call]]).

The other two forces work against the seller. A big move in either direction hurts, because the curve bends away from the seller (they are short gamma), and a rise in implied volatility lifts the value they owe (they are short vega). In Idea ④'s language, **theta and gamma are two sides of one coin**: the buyer pays time decay for the bend, the seller earns it for carrying the bend. [[theta]] and [[delta-hedging]] make that trade-off precise.

For combinations, nothing new is needed: today's curve of a spread or straddle is the sum of its legs' today curves, exactly as in [[payoff-lego]]. A long straddle's today curve is a smooth U lying above its V; a bull call spread's today curve is a gentle S that only sharpens into flat–ramp–flat near expiry.

### ⑤ Where the curve comes from, and what comes next

Every "today" curve in this lesson was computed with the Black–Scholes formula from five inputs: stock price, strike, time left, interest rate and volatility ([[black-scholes]], [[price-drivers]]). Four are on the screen; volatility is the one the market must guess, which is why options are quoted as implied volatilities ([[implied-vol]]).

Two practical notes. Broker risk graphs usually draw this curve as a "today" or "T+0" line, computed with a model and the current implied volatility; if implied volatility moves, the real value moves off the drawn line. And the market price of an option is set by bids and offers, not by any curve: the model is a way of reading and comparing prices, not a promise.

From here on, many payoff charts in the course's demos carry a dashed "today" curve next to the solid expiry line. The three forces of section ② become the Greeks, mapped out in [[greeks-map]], and the question "how likely is each point on these curves?" is next.

## @analogy
Think of a **bet on a football match, valued while the game is still being played**. You bet that your team wins by two or more goals. At the final whistle the bet is all or nothing, a hockey stick: two-goal lead or better, you're paid; anything else, nothing.

During the match, the bet's value is a smooth number that depends on three things. The **score** (the stock price): a goal for your team raises it. The **minutes left** (time): with the score unchanged, every minute that passes lowers it, slowly early on and very fast in the last minutes. And **how wild the game is** (volatility): a game full of chances leaves more room for goals, which helps a bet that still needs them. That is why your team can score and the bet can still be worth less than ten minutes ago: if the goal came late, the clock may have taken more than the goal gave.

Where the analogy breaks: live odds come from bookmakers balancing their books, while the option's curve comes from a no-arbitrage argument about hedging with the stock. And in football the wildness of the game is visible on the pitch; in options, the "expected wildness" is a price that can itself crash in a second, as the IV crush after earnings shows.

## @misconceptions
- **“My call is worth nothing until XYZ passes the breakeven.”** — Before expiry the call has time value at every price. With 30 days left and XYZ at 100 it is worth 2.45, the full price paid.
- **“If the stock rises, my call must rise.”** — Only if the gain from delta beats the losses from time and volatility. XYZ +1% over 20 days took the call from 2.45 to 1.95.
- **“The payoff diagram shows what I'd get if I closed the trade today.”** — The expiry diagram shows one day, the last. Today's value is the curved line above it.
- **“Time value decays by the same amount each day.”** — Decay accelerates near expiry for at-the-money options: 0.81 lost over the 16 days from 30 to 14 days left, but 0.74 lost in the final 3 days.
- **“Option sellers earn time decay for free.”** — They are paid theta for carrying the curve's bend: big moves and volatility spikes hurt them, and that risk is what the decay pays for.

## @takeaways
- Before expiry an option's P&L is a smooth curve; the hockey stick is its last frame.
- For a long call the curve lies above the expiry line: \(V(S,t) \ge S - Ke^{-r\tau} \ge \max(S-K, 0)\); the gap (time value) is widest at the strike.
- Three forces move the value: \(\dd V \approx \Delta\,\dd S + \Theta\,\dd t + \nu\,\dd\sigma\), and the curve's bend (gamma) adds a correction for large moves.
- "Stock up, call down" is time decay or an IV crush beating delta; a long option needs the move to be large, soon, and bigger than the market expected.
- Sellers see the mirror image: time works for them, big moves and volatility rises work against them.

## @quiz
1. Kai's friend bought the 30-day 100 call for 2.45. With 14 days left, XYZ still at 100 and volatility unchanged, the call is worth about:
   - [ ] 2.45, because nothing has changed
   - [ ] 1.23, because half the time has passed
   - [ ] 0, because it is not in the money
   - [x] 1.64
   > Time value decays, but not in a straight line: with 14 of 30 days left the call keeps 1.64 of its 2.45. Only at expiry does an at-the-money call fall to 0.
2. Which statement about a long call's "today" curve is correct?
   - [x] It lies above the hockey stick, and the gap is widest near the strike
   - [ ] It lies below the hockey stick, because the premium has been paid
   - [ ] It has the same kink at the strike as the expiry line
   - [ ] It is a straight line through the breakeven
   > Before expiry a call is worth at least its intrinsic value (and at least \(S - Ke^{-r\tau}\)), so the curve is above the stick. Time value, the gap, is largest where the outcome is most uncertain: at the strike.
3. XYZ rose from 100 to 103 after earnings, yet a call bought before earnings lost money. What is the most likely explanation?
   - [ ] Delta was negative
   - [ ] The strike moved
   - [x] Implied volatility fell after the announcement and time passed, together outweighing the gain from the price move
   - [ ] Calls always lose money after earnings
   > In the lesson's example the price added +1.80 but time took −1.55 and the IV crush −0.46: a total of −0.21. A call's delta is positive, so the stock move itself helped.
4. The 30-day 100 call has \(\Delta = 0.534\) and \(\Theta = -0.044\) per day. XYZ rises $1 overnight (one day passes, volatility unchanged). The estimated change in the call's value is about:
   - [ ] +1.00
   - [x] +0.49
   - [ ] +0.53
   - [ ] −0.04
   > \(\Delta\,\dd S + \Theta\,\dd t = 0.534 \times 1 + (-0.044) \times 1 \approx 0.49\). A call does not move one-for-one with the stock before expiry, and a day of decay is subtracted.
5. Someone sold the 100 call for 2.45. If XYZ stays exactly at 100, how does the seller's P&L develop as expiry approaches?
   - [ ] It stays at 0 until expiry, then jumps to +2.45
   - [ ] It falls, because the call gets closer to expiring in the money
   - [ ] It stays at +2.45 from the first day
   - [x] It rises gradually and ever faster toward +2.45
   > The seller's P&L is 2.45 minus the call's current value. The value decays from 2.45 to 0, slowly at first and quickly near the end, so the seller's P&L climbs: 0, +0.81 with 14 days left, +1.71 with 3 days left, +2.45 at expiry.

## @further
- [Greeks (finance), Wikipedia](https://en.wikipedia.org/wiki/Greeks_(finance)) — delta, theta, vega and gamma, the four numbers that move today's curve.
- [Option time value, Wikipedia](https://en.wikipedia.org/wiki/Option_time_value) — time value, and why it is largest at the money.
- [Options Industry Council (OIC)](https://www.optionseducation.org/) — education pages on how option prices change before expiration, including volatility and time decay.
- [Implied volatility, Wikipedia](https://en.wikipedia.org/wiki/Implied_volatility) — the market's volatility input, whose changes drive the IV crush.

## @next
Every curve in this lesson treated all prices alike, as if XYZ were as likely to finish at 120 as at 101. It is not. How likely is each outcome, what is a trade worth on average once you weigh it by those odds, and why is a ten-cent option that "can pay ten times" usually not a bargain?
