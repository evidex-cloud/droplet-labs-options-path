---
id: probability-ev
prereqs: payoff-diagrams, breakeven-returns, before-expiry
demo: probability-ev
---

# Probability & Expected Value: Why Cheap OTM Options Aren't Cheap

## @hook
A 14-cent call that could pay twenty times its price sounds like a bargain. Weigh every outcome by how likely it is, and under the very assumptions that set its price its expected value is exactly zero, no better and no worse than any other option. The shape tells you *what* can happen; probability tells you what it is worth.

## @bridge
This stage has taught the shape of a trade ([[payoff-diagrams]]), its key numbers ([[breakeven-returns]]), how shapes combine ([[payoff-lego]]) and how they look before expiry ([[before-expiry]]). Every one of those pictures treated all prices alike. This last lesson of the stage asks how likely each outcome is, and what a trade is worth on average once you weigh it by those odds. It builds Idea ① (the shape) and Idea ③ (volatility sets the odds), and it opens the door to pricing: the idea that an option's price *is* a probability-weighted average returns in [[risk-neutral]] and [[black-scholes]].

## @intuition
Look at the 30-day **110 call** on XYZ. It costs **$0.14**, which is $14 a contract. If XYZ jumps to $115, it pays $5, about 35 times the price. A beginner's reaction: a tiny bet with a huge upside, what's not to like?

Before deciding, count. Imagine buying this call at the start of every month, a thousand months in a row, with XYZ behaving the way the option's price assumes (20% volatility). In round numbers:

- about **949 months** XYZ ends below $110: the call expires worthless, and you lose $14;
- about **51 months** it ends above $110: the call pays something, on average about **$270** a contract when it does.

Money out: \(1{,}000 \times \$14 = \$14{,}000\). Money back: \(51 \times \$270 \approx \$13{,}800\). The gap comes from rounding: at the exact price ($13.79 a contract) and the exact odds, the money back exceeds the money out only by the interest the premiums could have earned in the meantime. **The huge payoff multiple and the tiny chance of getting it cancel exactly.** The option is cheap because it rarely pays, not because the market forgot about the upside.

That calculation has a name: **expected value (EV)**, the probability-weighted average of all outcomes. To compute it you need a second picture next to the payoff diagram: how likely each ending price is.

<figure>
<svg viewBox="0 0 640 262" role="img" aria-label="Distribution of XYZ's price in 30 days with the 105 call's P&L overlaid; shaded regions show finishing in the money and finishing with a profit">
<defs><marker id="probability-ev-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<polygon points="365.6,200 365.6,108.1 371.7,114.9 380.8,125 390,134.8 399.2,144.2 408.3,152.8 417.5,160.7 426.7,167.6 435.8,173.7 445,178.9 454.2,183.3 463.3,186.9 472.5,189.8 481.7,192.2 490.8,194.1 500,195.6 509.2,196.7 518.3,197.6 527.5,198.3 536.7,198.8 545.8,199.1 555,199.4 564.2,199.6 573.3,199.7 582.5,199.8 591.7,199.9 600.8,199.9 610,199.9 610,200" class="fx-area-hl"/>
<polygon points="374.2,200 374.2,117.7 380.8,125 390,134.8 399.2,144.2 408.3,152.8 417.5,160.7 426.7,167.6 435.8,173.7 445,178.9 454.2,183.3 463.3,186.9 472.5,189.8 481.7,192.2 490.8,194.1 500,195.6 509.2,196.7 518.3,197.6 527.5,198.3 536.7,198.8 545.8,199.1 555,199.4 564.2,199.6 573.3,199.7 582.5,199.8 591.7,199.9 600.8,199.9 610,199.9 610,200" class="fx-area-ok"/>
<polyline points="60,199.9 69.2,199.9 78.3,199.7 87.5,199.6 96.7,199.2 105.8,198.8 115,198 124.2,197 133.3,195.4 142.5,193.3 151.7,190.4 160.8,186.6 170,181.8 179.2,175.9 188.3,168.8 197.5,160.4 206.7,151 215.8,140.7 225,129.6 234.2,118.3 243.3,107 252.5,96.3 261.7,86.5 270.8,78.2 280,71.6 289.2,67.1 298.3,64.9 307.5,65.1 316.7,67.4 325.8,71.9 335,78.3 344.2,86.1 353.3,95.1 362.5,104.8 371.7,114.9 380.8,125 390,134.8 399.2,144.2 408.3,152.8 417.5,160.7 426.7,167.6 435.8,173.7 445,178.9 454.2,183.3 463.3,186.9 472.5,189.8 481.7,192.2 490.8,194.1 500,195.6 509.2,196.7 518.3,197.6 527.5,198.3 536.7,198.8 545.8,199.1 555,199.4 564.2,199.6 573.3,199.7 582.5,199.8 591.7,199.9 600.8,199.9 610,199.9" class="fx-line-blue"/>
<line x1="60" y1="200" x2="620" y2="200" class="fx-axis" marker-end="url(#probability-ev-ah)"/>
<polyline points="60,204.3 365.6,204.3 610,84.3" class="fx-line-thick"/>
<line x1="365.6" y1="30" x2="365.6" y2="200" class="fx-line-muted fx-dash"/>
<line x1="234.4" y1="222" x2="374.5" y2="222" class="fx-line" marker-start="url(#probability-ev-ah)" marker-end="url(#probability-ev-ah)"/>
<text x="304.4" y="238" text-anchor="middle" class="fx-t-sm">±1σ: 94.27 to 105.73 (about 68%)</text>
<text x="121.1" y="216" text-anchor="middle" class="fx-t-sm">85</text>
<text x="182.2" y="216" text-anchor="middle" class="fx-t-sm">90</text>
<text x="304.4" y="216" text-anchor="middle" class="fx-t-sm">100</text>
<text x="365.6" y="216" text-anchor="middle" class="fx-t-b">105</text>
<text x="426.7" y="216" text-anchor="middle" class="fx-t-sm">110</text>
<text x="487.8" y="216" text-anchor="middle" class="fx-t-sm">115</text>
<text x="548.9" y="216" text-anchor="middle" class="fx-t-sm">120</text>
<text x="610" y="254" text-anchor="end" class="fx-t-sm">XYZ price in 30 days</text>
<text x="70" y="40" class="fx-t-blue">how likely each price is (σ 20%)</text>
<text x="600" y="40" text-anchor="end" class="fx-t-hl">in the money (above 105): 20.5%</text>
<text x="600" y="58" text-anchor="end" class="fx-t-ok">profit (above 105.71): 17.4%</text>
<text x="600" y="80" text-anchor="end" class="fx-t">105 call P&amp;L</text>
<text x="66" y="150" class="fx-t-sm">P&amp;L −0.71</text>
<text x="66" y="166" class="fx-t-sm">in 79% of outcomes</text>
<line x1="80" y1="171" x2="80" y2="202" class="fx-line-muted"/>
</svg>
<figcaption>Figure 1 · The bell-shaped curve shows how likely each price of XYZ is in 30 days (20% volatility, the drift assumed in option prices). The thick line is the 30-day 105 call's P&L. Most of the probability sits where the P&L is −0.71; the big payoffs lie in a thin tail. Shaded: finishing in the money (20.5%) and finishing with a profit (17.4%).</figcaption>
</figure>

Read the two pictures together. The payoff diagram says the 105 call can make a lot; the distribution says those outcomes are rare. Neither picture alone tells you whether the call is a good deal; the product of the two, summed across all prices, does.

> [!KAI] Kai's covered call, seen through probabilities
> Kai *sells* the 105 call for $0.71 against the shares. Reading Figure 1 from Kai's side: in about **79%** of outcomes XYZ ends below 105, the call expires worthless and Kai simply keeps the $71. In about **21%**, XYZ ends above 105 and Kai gives up the rise beyond 105. A high chance of a small gain, a small chance of missing a large one. Neither fact alone says whether the trade is good for Kai; that depends on why Kai holds XYZ at all ([[covered-call]]).

> [!THINK] If the 110 call's EV is zero, what about the 100 call and the 90 put?
> Guess before reading: does being closer to the money make an option a better deal on average?
> ---
> No. Under the assumptions used to price them, **every** option on the chain has an expected value of zero, from the 90 put to the 110 call. Prices adjust to probabilities: the 100 call costs 2.45 because it pays more often, the 110 call 0.14 because it rarely does. "Cheap" and "expensive" only mean something relative to a *different* view of the probabilities, which is exactly where the last section of this lesson ends up.

Try the thousand-month experiment yourself:

::demo[probability-ev-lottery]

We'll take it in five parts:

- **① The shape of XYZ's future: the lognormal curve and the expected move**
- **② Probability of finishing in the money, and of profit**
- **③ Expected value, and why the price already contains the odds**
- **④ Win rate is not edge: lottery tickets versus selling insurance**
- **⑤ Whose probabilities? The pricing world versus the real world**

## @mechanics
### ① The shape of XYZ's future: the lognormal curve and the expected move

Where might XYZ be in 30 days? Option pricing assumes that XYZ's **percentage** moves are random and bell-shaped, which makes its **price** follow a *lognormal* distribution: a slightly lopsided bell that can never go below zero and has a longer tail on the high side ([[random-walk]]). Its width is set by volatility and time. The standard yardstick is the **one-standard-deviation move**:

$$
\text{expected move} \approx S\,\sigma\sqrt{T}
$$

where \(S\) is today's price, \(\sigma\) the annual volatility and \(T\) the time in years. Roughly two-thirds of outcomes fall within one such move of today's price.

> [!EXAMPLE] XYZ's 30-day range
> \(100 \times 0.20 \times \sqrt{30/365} = 100 \times 0.20 \times 0.287 \approx \$5.73\). So about 68% of the time XYZ should end between roughly 94.27 and 105.73, and about 32% of the time outside that range: about 14.5% below and 17.3% above. The right side is a little heavier: the lognormal leans that way, and the pricing drift adds a little too.

Two details that matter later. The distribution's **average** (its mean) is the 30-day forward price, 100.33, while its **middle** (its median) is lower, 100.16: the long right tail pulls the average up. And real stock returns have fatter tails than this curve, meaning more large moves; the curve is the model's picture, not a law of nature ([[bs-assumptions]]).

### ② Probability of finishing in the money, and of profit

The probability that XYZ ends above a price \(K\) is the area under the curve above \(K\), like the shaded region of Figure 1. Under the lognormal model it has a closed form:

$$
P(S_T > K) = \N(d_2), \qquad d_2 = \frac{\ln(S/K) + \left(\mu - \tfrac12\sigma^2\right)T}{\sigma\sqrt{T}}
$$

where \(\N(\cdot)\) is the standard normal cumulative probability (a number between 0 and 1), \(\mu\) the stock's assumed drift (average growth rate) and \(d_2\) says how many standard deviations the strike sits below the center of the distribution. For the probabilities implied by option prices, \(\mu\) is the risk-free rate \(r\).

> [!EXAMPLE] The 105 call finishing in the money
> \(\ln(100/105) = -0.0488\); \((0.04 - 0.02) \times \tfrac{30}{365} = 0.0016\); \(\sigma\sqrt{T} = 0.20 \times 0.287 = 0.0573\).
> \(d_2 = \dfrac{-0.0488 + 0.0016}{0.0573} \approx -0.822\), so \(P(S_T > 105) = \N(-0.822) \approx 0.205\), a 20.5% chance.
> The chance of a *profit* uses the breakeven instead of the strike: \(P(S_T > 105.71) \approx 17.4\%\).

| Position (30 days) | Premium | P(in the money) | P(profit) | When it wins |
|---|---|---|---|---|
| Long 100 call | pay 2.45 | 51.1% | 34.7% | open upside |
| Long 105 call | pay 0.71 | 20.5% | 17.4% | open upside |
| Long 110 call | pay 0.14 | 5.1% | 4.9% | averages about 19× the premium |
| Short 105 call (Kai's covered call leg) | receive 0.71 | 20.5% | 82.6% | keeps 0.71 at most |
| Short 95 put | receive 0.51 | 17.8% | 84.5% | keeps 0.51 at most |

Notice the pattern: the further out of the money, the cheaper the option and the lower its chance of paying. The table is the payoff diagram's missing half.

**Delta is close to this probability, but not equal to it.** In [[before-expiry]] we met delta, the slope of today's curve. For the 105 call, \(\Delta = 0.222\), while \(P(S_T > 105) = 0.205\). Traders often read delta as "roughly the chance of finishing in the money", and for quick estimates that is fine, but the two differ by more as volatility and time grow. Why they differ is explained in [[delta]] and [[black-scholes]].

### ③ Expected value, and why the price already contains the odds

The expected value of a trade is every outcome's P&L times its probability, added up. With a few discrete outcomes:

$$
\E[\Pi] = \sum_i p_i\,\Pi_i
$$

where \(p_i\) is the probability of outcome \(i\) and \(\Pi_i\) the P&L in that outcome. With a continuous price, the sum becomes an integral over the curve of Figure 1, but the idea is the same: multiply the two pictures and add.

> [!EXAMPLE] The 110 call's expected value
> Probability of finishing in the money: 5.12%. Average payoff *when* it does: about 2.70 per share. Discounting that payoff back 30 days (a factor of 0.997):
> $$
> \E[\Pi] \approx \underbrace{0.0512 \times 2.70 \times 0.997}_{\text{what you expect to get back}} - \underbrace{0.138}_{\text{what you pay}} \approx 0.138 - 0.138 = 0
> $$
> The same calculation gives zero for the 100 call, the 95 put and every other strike.

This is not a coincidence, and it is the most important idea in this lesson: **under the model that produces the price, the price is the discounted expected payoff.** An option's premium is, by construction, "what it pays on average, weighted by the probabilities the market is using, in today's money". So an out-of-the-money option is not cheap in any meaningful sense; it is small because it pays rarely. The formal version of this statement, and the surprising reason why the stock's true expected return does not enter it, is [[risk-neutral]].

### ④ Win rate is not edge: lottery tickets versus selling insurance

Two positions from the table show why the probability of winning, by itself, tells you almost nothing.

<figure>
<svg viewBox="0 0 640 245" role="img" aria-label="Outcome distributions: buying the 110 call versus selling the 95 put">
<text x="165" y="22" text-anchor="middle" class="fx-t-b">Buy the 110 call for 0.14</text>
<text x="475" y="22" text-anchor="middle" class="fx-t-b">Sell the 95 put for 0.51</text>
<text x="20" y="52" class="fx-t-sm">lose 0.14</text>
<rect x="110" y="40" width="142.3" height="16" rx="2" class="fx-bad"/>
<text x="256" y="52" class="fx-t-sm">94.9%</text>
<text x="20" y="76" class="fx-t-sm">−0.14 to +2</text>
<rect x="110" y="64" width="4.1" height="16" rx="2" class="fx-ok"/>
<text x="118" y="76" class="fx-t-sm">2.7%</text>
<text x="20" y="100" class="fx-t-sm">+2 to +4</text>
<rect x="110" y="88" width="2" height="16" rx="1" class="fx-ok"/>
<text x="116" y="100" class="fx-t-sm">1.3%</text>
<text x="20" y="124" class="fx-t-sm">+4 to +6</text>
<rect x="110" y="112" width="1" height="16" rx="0.5" class="fx-ok"/>
<text x="116" y="124" class="fx-t-sm">0.6%</text>
<text x="20" y="148" class="fx-t-sm">more than +6</text>
<rect x="110" y="136" width="1" height="16" rx="0.5" class="fx-ok"/>
<text x="116" y="148" class="fx-t-sm">0.5%</text>
<text x="330" y="52" class="fx-t-sm">keep 0.51</text>
<rect x="430" y="40" width="123.3" height="16" rx="2" class="fx-ok"/>
<text x="557" y="52" class="fx-t-sm">82.2%</text>
<text x="330" y="76" class="fx-t-sm">+0.51 to 0</text>
<rect x="430" y="64" width="3.5" height="16" rx="2" class="fx-ok"/>
<text x="438" y="76" class="fx-t-sm">2.3%</text>
<text x="330" y="100" class="fx-t-sm">0 to −2</text>
<rect x="430" y="88" width="10.8" height="16" rx="2" class="fx-bad"/>
<text x="445" y="100" class="fx-t-sm">7.2%</text>
<text x="330" y="124" class="fx-t-sm">−2 to −4</text>
<rect x="430" y="112" width="6.6" height="16" rx="2" class="fx-bad"/>
<text x="441" y="124" class="fx-t-sm">4.4%</text>
<text x="330" y="148" class="fx-t-sm">−4 to −6</text>
<rect x="430" y="136" width="3.5" height="16" rx="2" class="fx-bad"/>
<text x="438" y="148" class="fx-t-sm">2.3%</text>
<text x="330" y="172" class="fx-t-sm">worse than −6</text>
<rect x="430" y="160" width="2.3" height="16" rx="1" class="fx-bad"/>
<text x="437" y="172" class="fx-t-sm">1.5%</text>
<line x1="315" y1="30" x2="315" y2="185" class="fx-line-muted fx-dash"/>
<text x="165" y="200" text-anchor="middle" class="fx-t-bad">wins 4.9% of the time</text>
<text x="165" y="216" text-anchor="middle" class="fx-t-sm">rare wins, sometimes 20× the stake</text>
<text x="475" y="200" text-anchor="middle" class="fx-t-ok">wins 84.5% of the time</text>
<text x="475" y="216" text-anchor="middle" class="fx-t-sm">rare losses, averaging 2.76 = 5× the premium</text>
<text x="320" y="238" text-anchor="middle" class="fx-t-b">expected value of both, at the prices' own odds: zero</text>
</svg>
<figcaption>Figure 2 · P&L per share at expiry, grouped into ranges, with the probability of each range (30 days, σ 20%). The call buyer loses small almost always and occasionally wins big; the put seller wins small almost always and occasionally loses big. Opposite win rates, the same expected value.</figcaption>
</figure>

The **long out-of-the-money call** is a lottery ticket: a 95% chance of losing a little and a 5% chance of a large multiple. Its pull is easy to feel, and the mistakes it invites (sizing by "cheapness", sizing up after a rare hit) are the subject of [[trading-psychology]].

The **short put** is the insurer's shape: an 84.5% chance of keeping a small premium, and a 15.5% chance of a loss that averages 2.76 per share, more than five times the 0.51 collected. And the losses have a long tail: if XYZ fell 20% to $80, the short 95 put would lose \(95 - 80 - 0.51 = 14.49\) per share, about 28 months of premium in one month.

> [!WARN] A high win rate is not an edge
> A strategy that wins 85% of the time can still lose money over time, and one that wins 5% of the time can still make money. Only the probability-weighted sum (the expected value) decides, and even a positive expected value can be ruined by sizing too large for the rare bad outcome ([[position-sizing]]). When someone quotes a win rate, ask for the average win and the average loss.

### ⑤ Whose probabilities? The pricing world versus the real world

The probabilities in this lesson used the drift and volatility **baked into option prices**: drift equal to the interest rate, volatility equal to the implied volatility. That is the "pricing world", and in it every option has an expected value of zero. Your own view of the world may differ in two ways, and each changes the answer.

- **A different drift.** If you believe XYZ grows on average 10% a year instead of 4%, calls become slightly positive-EV and puts slightly negative. The effect is small over 30 days: the 100 call's expected value rises only from 0 to about +0.27.
- **A different volatility.** This one matters much more. If XYZ will actually move with 16% volatility while options are priced at 20%, the 100 call's expected value drops to about −0.46, and a seller of the 105 call or the 95 put comes out ahead on average (about +0.32 and +0.25 per share).

| Expected value per share (30 days) | Pricing world (μ 4%, σ 20%) | Real drift 10% | Real volatility 16% |
|---|---|---|---|
| Long 100 call | 0.00 | +0.27 | −0.46 |
| Long 110 call | 0.00 | +0.03 | −0.10 |
| Short 95 put | 0.00 | +0.08 | +0.25 |
| Short 105 call | 0.00 | −0.12 | +0.32 |

So "is this option cheap?" really means "is the volatility in its price higher or lower than the volatility that will actually happen?" That question, implied versus realized volatility, is the heart of Idea ③ and of the volatility lessons ([[implied-vol]], [[realized-vol]]).

> [!FACT] Implied volatility has tended to exceed realized volatility
> An analysis published by the CFA Institute in July 2024 found that from 1990 to about 2024 the VIX (the S&P 500's 30-day implied volatility) averaged about 19.6%, while the volatility the index actually delivered over the following 30 days averaged about 15.5%, a gap of roughly 4 volatility points. That gap has made index option sellers money on average, and it turns sharply negative in crashes. It is a historical average, not a promise, and it is the subject of [[variance-risk-premium]].

## @analogy
Think of a **fairground ring-toss stall**. One stall offers a giant teddy bear for landing a ring on a narrow bottle neck: tickets cost very little, almost nobody wins, and the few winners walk away with a prize worth many times their ticket. The stall owner is not being generous; the owner has counted how often rings land and priced the ticket so that, over a whole summer, the prizes cost less than the tickets bring in. The small price *is* the low probability.

The stall owner's side is the option seller's side: nearly every throw earns a little, and once in a while someone lands the ring and the stall pays out a bear worth weeks of tickets. Neither the player's "I might win big" nor the owner's "I win almost every time" says who comes out ahead. Only the ticket price compared with the true chance of landing the ring does.

Where the analogy breaks: the fairground owner sets the odds and knows them exactly. In options, the "true" chance of a big move is unknown; the market's price embeds its best estimate plus a premium for bearing the risk, and whether that estimate is too high or too low is precisely what option traders argue about.

## @misconceptions
- **“Out-of-the-money options are cheap, so they're good value.”** — They are small, not cheap. Their price reflects how rarely they pay; at the prices' own probabilities their expected value is zero, like every other option.
- **“A strategy that wins 85% of the time is a good strategy.”** — Win rate ignores the size of the losses. Selling the 95 put wins 84.5% of the time and still has zero expected value at fair prices, because the losses average five times the premium.
- **“Delta is the probability of finishing in the money.”** — It is close, not equal: 0.222 versus 0.205 for the 105 call. The gap grows with volatility and time.
- **“The probability of expiring in the money is the probability of making money.”** — A long option must also earn back its premium. The 100 call ends in the money 51% of the time but shows a profit only 35% of the time.
- **“If the stock is more likely to go up, calls must be a good buy.”** — A higher drift helps calls only a little over short periods. Whether the volatility you pay for is larger or smaller than the volatility that happens matters far more.

## @takeaways
- The payoff diagram shows what can happen; the probability distribution shows how likely it is; expected value multiplies the two and adds them up.
- XYZ's 30-day one-standard-deviation move is \(S\sigma\sqrt{T} \approx \$5.73\); about 68% of outcomes fall inside it.
- \(P(S_T > K) = \N(d_2)\) with the drift you choose; the pricing world uses \(\mu = r\), and delta is close to, but not the same as, this probability.
- Under the probabilities that set option prices, every option's expected value is zero: out-of-the-money options are small because they rarely pay.
- Win rate is not edge. Real-world expected value depends on your drift and, far more, on realized versus implied volatility.

## @quiz
1. The 30-day 110 call costs $0.14 and finishes in the money about 5% of the time. Using the same assumptions that price it, its expected value is:
   - [ ] strongly positive, because it can pay more than 20 times its price
   - [x] about zero, because the price already reflects how rarely it pays
   - [ ] strongly negative, because 95% of the time it loses
   - [ ] impossible to say without knowing the strike
   > Under the pricing model the premium equals the discounted expected payoff: \(0.0512 \times 2.70 \times 0.997 \approx 0.138\), the price itself. The big multiple and the small probability cancel.
2. XYZ is at $100 with 20% volatility. What is the one-standard-deviation move over 30 days?
   - [ ] $20.00
   - [ ] $1.05
   - [ ] $0.57
   - [x] about $5.73
   > \(S\sigma\sqrt{T} = 100 \times 0.20 \times \sqrt{30/365} \approx 5.73\). $20 forgets to scale by time; $1.05 is the one-day move.
3. Selling the 30-day 95 put for $0.51 wins about 84.5% of the time. What follows?
   - [ ] It has a positive expected value, because it wins most of the time
   - [ ] It is risk-free as long as XYZ stays above 95
   - [x] Nothing, by itself: the losses average about five times the premium, and at fair prices the expected value is zero
   - [ ] It loses money on average, because selling options is always negative-EV
   > Win rate ignores size. When the put loses (15.5% of the time), the loss averages about 2.76 per share. Whether it is positive-EV in reality depends on whether realized volatility ends up below the implied volatility in its price.
4. The 30-day 105 call has \(\Delta = 0.222\) and \(\N(d_2) = 0.205\). Which statement is right?
   - [ ] The call has a 22.2% chance of finishing in the money
   - [x] In the pricing world the chance of finishing in the money is about 20.5%; delta is close but not the same thing
   - [ ] Delta and the probability are always exactly equal
   - [ ] The chance of a profit is 22.2%
   > \(\N(d_2)\) is the probability (with drift \(r\)) of ending above 105. Delta is the slope of today's curve, a different quantity that happens to be close. The chance of a *profit* is lower still: about 17.4%, because the breakeven is 105.71.
5. Options on XYZ are priced at 20% implied volatility, but XYZ actually moves with 16% volatility. What happens to expected values?
   - [x] Option buyers lose on average and option sellers gain on average
   - [ ] Nothing: implied volatility doesn't affect expected value
   - [ ] Buyers gain, because lower volatility makes options cheaper
   - [ ] Only puts are affected
   > The options were priced for bigger moves than actually happen, so buyers overpaid. The 100 call's expected value drops to about −0.46 per share; sellers of the 105 call and 95 put come out ahead on average. This is the implied-versus-realized question at the heart of Idea ③.

## @further
- [Expected value, Wikipedia](https://en.wikipedia.org/wiki/Expected_value) — the probability-weighted average, with simple examples.
- [Log-normal distribution, Wikipedia](https://en.wikipedia.org/wiki/Log-normal_distribution) — the lopsided bell used for stock prices, its mean and its median.
- [How well does the market predict volatility? (CFA Institute, July 2024)](https://blogs.cfainstitute.org/investor/2024/07/31/how-well-does-the-market-predict-volatility/) — the implied-versus-realized comparison cited in the FACT box.
- [FINRA investor insight on zero-day (0DTE) options](https://www.finra.org/investors/insights/zeroing-in-options-trading-strategy) — the regulator's plain-language notes on the risks of very short-dated, lottery-like option trades.

## @next
You now have the whole language of shapes: reading them, measuring them, building them, watching them move and weighing them by probability. To trade them, you need to find them in the real world, on a screen full of numbers. The next lesson opens that screen: [[option-chain]], where every strike, expiry, bid, ask and implied volatility for XYZ sits on one quote board.
