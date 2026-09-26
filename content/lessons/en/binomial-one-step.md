---
id: binomial-one-step
prereqs: arbitrage-bounds, forwards-carry, put-call-parity
demo: binomial-one-step
---

# The One-Step Binomial: Replication & the Hedge Ratio

## @hook
Suppose XYZ can finish the year at only $120 or $80. What is a 100-strike call worth? You never need to know which outcome is more likely. Half a share plus a loan copies the call exactly, so the call must cost what the copy costs: $10 with zero interest, $11.57 at 4%.

## @bridge
The lessons from [[price-drivers]] to [[synthetics-boxes]] gave us tools that pin down *relations* between prices. [[arbitrage-bounds]] fenced a call in between zero and the stock, [[forwards-carry]] priced a forward by copying it with stock and cash, and [[put-call-parity]] tied the call to the put. None of them could give the call's price on its own, because the bounds are wide and every rule holds for any volatility. This lesson adds the smallest possible model: a world with just two outcomes. Inside that world the call has exactly one fair price. It builds Idea ② (no-arbitrage: anything you can replicate costs what the replication costs). Every lesson in this stage, up to [[black-scholes]], grows out of this single step.

## @intuition
Start with a toy world. XYZ trades at $100 today. In one year it will be at **$120 or $80**, and nothing else can happen. Kai wants to know the fair price of a **1-year call with a $100 strike**.

The call's payoff is easy to write down:

- XYZ at $120: the call pays \(120 - 100 = \$20\);
- XYZ at $80: the call expires worthless and pays $0.

Most people's first instinct is to reach for probabilities: “If up and down are equally likely, the call pays $20 half the time, so it's worth about $10.” That happens to be the right number here, but for the wrong reason. Watch what happens when we ignore probabilities completely and build the call out of things we can already buy.

**The copy.** Buy **half a share** of XYZ for $50, and **borrow $40** from the bank (take the interest rate as zero for now). A year later:

- if XYZ is at $120, the half share is worth $60; repay $40 and you keep **$20**;
- if XYZ is at $80, the half share is worth $40; repay $40 and you keep **$0**.

That is the call's payoff, dollar for dollar, in both outcomes. The copy cost \(50 - 40 = \$10\) of your own money today. So the call must cost **$10**.

<figure>
<svg viewBox="0 0 660 250" role="img" aria-label="One-step tree with the replicating portfolio">
<defs><marker id="binomial-one-step-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="30" y="95" width="150" height="62" rx="8" class="fx-box"/>
<text x="105" y="120" text-anchor="middle" class="fx-t-b">today: S = 100</text>
<text x="105" y="142" text-anchor="middle" class="fx-t-hl">call = ?</text>
<line x1="182" y1="115" x2="318" y2="62" class="fx-line" marker-end="url(#binomial-one-step-ah)"/>
<line x1="182" y1="137" x2="318" y2="190" class="fx-line" marker-end="url(#binomial-one-step-ah)"/>
<rect x="322" y="30" width="140" height="62" rx="8" class="fx-ok"/>
<text x="392" y="55" text-anchor="middle" class="fx-t-b">up: S = 120</text>
<text x="392" y="77" text-anchor="middle" class="fx-t">call pays 20</text>
<rect x="322" y="160" width="140" height="62" rx="8" class="fx-bad"/>
<text x="392" y="185" text-anchor="middle" class="fx-t-b">down: S = 80</text>
<text x="392" y="207" text-anchor="middle" class="fx-t">call pays 0</text>
<text x="250" y="80" text-anchor="middle" class="fx-t-sm">one year</text>
<rect x="482" y="30" width="160" height="62" rx="8" class="fx-box2"/>
<text x="562" y="55" text-anchor="middle" class="fx-t-sm">copy: ½ × 120 − 40</text>
<text x="562" y="77" text-anchor="middle" class="fx-t-ok">= 20 ✓</text>
<rect x="482" y="160" width="160" height="62" rx="8" class="fx-box2"/>
<text x="562" y="185" text-anchor="middle" class="fx-t-sm">copy: ½ × 80 − 40</text>
<text x="562" y="207" text-anchor="middle" class="fx-t-ok">= 0 ✓</text>
<text x="105" y="185" text-anchor="middle" class="fx-t-sm">copy today:</text>
<text x="105" y="203" text-anchor="middle" class="fx-t-sm">½ share (50) − loan (40)</text>
<text x="105" y="222" text-anchor="middle" class="fx-t-hl">= 10</text>
</svg>
<figcaption>Figure 1 · The whole idea on one page. Half a share plus a $40 loan pays exactly what the call pays in both outcomes, so today the call must cost what the copy costs: \(50 - 40 = \$10\) (interest rate zero).</figcaption>
</figure>

Why *must*? Suppose a dealer sells the call for $12. You sell the call to someone else at $12, build the copy for $10 and pocket $2. A year later the copy pays exactly what you owe on the call, whichever way XYZ moves. That's $2 for nothing, and anyone can do it again and again, so a $12 quote can't last. At $8 you do the reverse: buy the call and sell the copy. **Only $10 leaves no free lunch.**

> [!KAI] Kai is very bullish
> Kai is sure XYZ will rise: “90% chance of $120, I'd happily pay $18 for this call.” Kai can pay that, but it would be a gift: a dealer would sell Kai the call at $18, spend $10 on the copy and lock in $8 without taking any view. Kai's confidence changes how much Kai expects to *profit* from owning XYZ, not what the call is *worth* next to the stock. The optimism is already inside the $100 stock price.

That is the surprising punchline of this lesson: **the real probability of going up never enters the price.** Only three things do: today's stock price, the two possible future prices, and the interest rate.

Try building the copy yourself. Move the share and cash sliders until your portfolio pays 20 in the up state and 0 in the down state:

::demo[binomial-one-step-replicate]

> [!THINK] Make the future more uncertain: XYZ now goes to $130 or $70 instead of $120 or $80. Interest is still zero. What is the 100-strike call worth now?
> Predict first: does a wider spread of outcomes help or hurt the call?
> ---
> $15. The call pays 30 or 0; the copy is still half a share (\(30/60 = 0.5\)), now with a $35 loan: \(0.5 \times 130 - 35 = 30\) and \(0.5 \times 70 - 35 = 0\). Cost today: \(50 - 35 = \$15\). The average outcome is still $100, yet the call is worth 50% more. The call gains from the bigger up move and doesn't care how bad the down move is. That is volatility (Idea ③) showing up in the smallest possible model.

We'll take it in five parts:

- **① Replication, step by step**: two equations, two unknowns
- **② The hedge ratio Δ**: a slope, and a dealer's recipe
- **③ Adding interest**: 11.57, and a number called \(q\)
- **④ Why the real probability never enters**
- **⑤ What one step teaches, and where it leads**

## @mechanics
### ① Replication, step by step

Write the toy world in general. The stock is at \(S\) today. After time \(T\) it is either \(uS\) (“up”, \(u > 1\)) or \(dS\) (“down”, \(d < 1\)). The option pays \(V_u\) in the up state and \(V_d\) in the down state. We want a portfolio of \(\Delta\) shares plus \(B\) dollars in the bank (\(B < 0\) means borrowing) that pays the same in both states. Money in the bank grows by \(e^{rT}\). That gives two equations:

$$
\begin{aligned}
\Delta\,uS + B\,e^{rT} &= V_u \\
\Delta\,dS + B\,e^{rT} &= V_d
\end{aligned}
$$

Subtract the second line from the first, and \(B\) disappears. Solve:

$$
\Delta = \frac{V_u - V_d}{uS - dS}, \qquad B = e^{-rT}\left(V_u - \Delta\,uS\right), \qquad V_0 = \Delta\,S + B
$$

In words:

- \(\Delta\) is the **number of shares** in the copy: how much the option's value changes divided by how much the stock changes;
- \(B\) is the **cash** in the copy, in today's money: what is left to make up after the shares, discounted back;
- \(V_0\) is the option's fair price today, the cost of the copy.

> [!EXAMPLE] The 1-year XYZ call, zero interest
> \(S = 100,\ u = 1.2,\ d = 0.8,\ K = 100,\ r = 0\). The call pays \(V_u = 20\), \(V_d = 0\).
> $$
> \begin{gathered}
> \Delta = \frac{20 - 0}{120 - 80} = 0.5, \qquad B = 20 - 0.5 \times 120 = -40 \\
> V_0 = 0.5 \times 100 - 40 = 10
> \end{gathered}
> $$
> Check the down state: \(0.5 \times 80 - 40 = 0\) ✓. Per contract, the call costs \(10 \times 100 = \$1{,}000\), and the copy is 50 shares plus a $4,000 loan.

Two unknowns, two states, two equations: that's why one step works so neatly. With three possible outcomes and only two instruments, the equations usually have no exact solution. We'll see in [[binomial-trees]] that the fix is to chain many small two-outcome steps rather than add outcomes to one step.

### ② The hedge ratio Δ: a slope, and a dealer's recipe

Look at \(\Delta\) as geometry. Plot the call's payoff against the stock price at expiry, mark the two points the world allows, \((80, 0)\) and \((120, 20)\), and draw a straight line through them. **The replicating portfolio is that straight line**: shares give it its slope, cash gives it its height.

<figure>
<svg viewBox="0 0 660 250" role="img" aria-label="The replicating portfolio is the straight line through the two possible outcomes">
<defs><marker id="binomial-one-step-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="50" y1="170" x2="620" y2="170" class="fx-axis" marker-end="url(#binomial-one-step-ah2)"/>
<line x1="60" y1="215" x2="60" y2="30" class="fx-axis" marker-end="url(#binomial-one-step-ah2)"/>
<polyline points="60,170 330,170 600,50" class="fx-line-thick"/>
<line x1="60" y1="200" x2="600" y2="80" class="fx-line-hl fx-dash"/>
<line x1="195" y1="170" x2="465" y2="170" class="fx-line-muted fx-dash"/>
<line x1="465" y1="170" x2="465" y2="110" class="fx-line-muted fx-dash"/>
<circle cx="195" cy="170" r="7" class="fx-fill-red"/>
<circle cx="465" cy="110" r="7" class="fx-fill-green"/>
<text x="195" y="192" text-anchor="middle" class="fx-t-sm">80</text>
<text x="330" y="192" text-anchor="middle" class="fx-t-sm">K = 100</text>
<text x="465" y="192" text-anchor="middle" class="fx-t-sm">120</text>
<text x="600" y="235" text-anchor="end" class="fx-t-sm">stock price in one year</text>
<text x="70" y="40" class="fx-t-sm">value at expiry</text>
<text x="330" y="160" text-anchor="middle" class="fx-t-sm">ΔS = 40</text>
<text x="475" y="152" class="fx-t-sm">ΔV = 20</text>
<text x="475" y="130" class="fx-t-ok">up: call pays 20</text>
<text x="183" y="152" text-anchor="end" class="fx-t-bad">down: pays 0</text>
<text x="520" y="45" class="fx-t-b">call payoff</text>
<text x="330" y="80" class="fx-t-hl">copy: 0.5 × S − 40</text>
<text x="330" y="98" class="fx-t-sm">slope Δ = 20 ÷ 40 = 0.5</text>
</svg>
<figcaption>Figure 2 · The copy is the straight line through the two outcomes the world allows. Its slope is the hedge ratio \(\Delta = 20/40 = 0.5\); its value at a stock price of zero, −40, is the loan. Between and beyond the two dots the line and the hockey stick disagree, which is fine: in this world no other price can happen.</figcaption>
</figure>

The same number is a **recipe for dealers**. A dealer who sells Kai one call contract is short 100 calls. Buying \(0.5 \times 100 = 50\) shares makes the book riskless:

- up: the shares are worth \(50 \times 120 = \$6{,}000\); the dealer owes \(100 \times 20 = \$2{,}000\) on the calls; net **$4,000**;
- down: shares \(50 \times 80 = \$4{,}000\); calls owe nothing; net **$4,000**.

Same result either way, so the dealer carries no market risk. This is the **hedge ratio**, and it is the first appearance of the Greek called delta ([[delta]]); running such a hedge continuously is [[delta-hedging]].

The recipe changes with the strike. Here are all the strikes in the 120/80 world, now with interest at 4% (next section):

| Strike \(K\) | Call pays (up / down) | Call \(\Delta\) | Loan \(B\) | Call price | Put \(\Delta\) | Put price |
|---|---|---|---|---|---|---|
| 80 | 40 / 0 | 1.00 | −76.86 | 23.14 | 0.00 | 0.00 |
| 90 | 30 / 0 | 0.75 | −57.65 | 17.35 | −0.25 | 3.82 |
| 100 | 20 / 0 | 0.50 | −38.43 | **11.57** | −0.50 | 7.65 |
| 110 | 10 / 0 | 0.25 | −19.22 | 5.78 | −0.75 | 11.47 |
| 120 | 0 / 0 | 0.00 | 0.00 | 0.00 | −1.00 | 15.29 |

Two rows are worth a second look. At \(K = 80\) the call is sure to finish in the money, so the copy is one full share and a loan of the discounted strike: \(100 - 80e^{-0.04} = 23.14\), exactly the lower bound from [[arbitrage-bounds]]. And a put's \(\Delta\) is negative: its copy *sells* stock and *lends* cash.

### ③ Adding interest: 11.57, and a number called q

Now let money earn \(r = 4\%\) a year (continuously compounded) for \(T = 1\). The shares are the same, half a share, because \(\Delta\) doesn't involve \(r\). But the loan is cheaper: to owe $40 in a year you only borrow \(40e^{-0.04} = 38.43\) today. So the call costs \(50 - 38.43 = 11.57\). Interest makes calls **more** expensive: the copy borrows, and borrowing cheaper helps.

Now rearrange the replication formulas algebraically (the DEEP box shows how). The price comes out in a form that looks like an expected value:

$$
V_0 = e^{-rT}\Big[\,q\,V_u + (1 - q)\,V_d\,\Big], \qquad q = \frac{e^{rT} - d}{u - d}
$$

Where:

- \(q\) is a weight between 0 and 1 attached to the up state (and \(1-q\) to the down state);
- \(q V_u + (1-q) V_d\) is the payoff “averaged” with those weights;
- \(e^{-rT}\) discounts that average back to today.

> [!EXAMPLE] Two roads, one price
> With \(u = 1.2,\ d = 0.8,\ r = 4\%,\ T = 1\): \(e^{0.04} = 1.0408\), so
> $$
> \begin{gathered}
> q = \frac{1.0408 - 0.8}{1.2 - 0.8} = 0.602 \\
> V_0 = e^{-0.04}\,(0.602 \times 20 + 0.398 \times 0) = 0.9608 \times 12.04 = 11.57
> \end{gathered}
> $$
> The replication road gave \(0.5 \times 100 - 38.43 = 11.57\). Same number, because it is the same algebra. With \(r = 0\), \(q = (1 - 0.8)/0.4 = 0.5\), and the price is \(0.5 \times 20 = 10\).

Notice what \(q\) is *not*: nobody estimated it from history or asked an analyst. It is built entirely out of \(u\), \(d\) and \(r\). It lies between 0 and 1 exactly when \(d < e^{rT} < u\), meaning the stock can finish either above or below the bank account. If \(e^{rT}\) were above \(u\), cash would beat the stock in *both* states, and you'd short the stock and lend the proceeds for a riskless profit. So “\(q\) is a proper probability” and “the stock itself isn't an arbitrage” are the same statement.

The put comes out the same way. It pays 0 up and 20 down, so \(V_0 = e^{-0.04}(0.398 \times 20) = 7.65\). Check with [[put-call-parity]]: \(C - P = 11.57 - 7.65 = 3.92\), and \(S - Ke^{-rT} = 100 - 96.08 = 3.92\) ✓. The tree respects parity automatically, because both are the same no-arbitrage logic.

> [!DEEP] From replication to q in three lines
> Substitute \(\Delta\) and \(B\) into \(V_0 = \Delta S + B\):
> $$
> \begin{aligned}
> V_0 &= \frac{V_u - V_d}{u - d} + e^{-rT}\left(V_u - \frac{(V_u - V_d)\,u}{u - d}\right) \\
>     &= e^{-rT}\left[\frac{e^{rT} - d}{u - d}\,V_u + \frac{u - e^{rT}}{u - d}\,V_d\right]
> \end{aligned}
> $$
> The two brackets add up to 1, so call the first one \(q\). Nothing about investors' preferences or beliefs was assumed, only the ability to trade stock and cash.

### ④ Why the real probability never enters

Call the real-world probability of the up move \(p\). A natural but wrong way to price is “expected payoff under \(p\), discounted at the risk-free rate”. Here is what that gives, next to the replication price, at \(r = 4\%\):

| Real chance of up \(p\) | Naive price \(e^{-rT}\,p \times 20\) | Replication price |
|---|---|---|
| 10% | 1.92 | **11.57** |
| 30% | 5.76 | **11.57** |
| 50% | 9.61 | **11.57** |
| 70% | 13.45 | **11.57** |
| 90% | 17.29 | **11.57** |

The replication price doesn't move, because \(\Delta\) and \(B\) depend only on *what* each state pays, not on *how likely* it is. A dealer who believed \(p = 70\%\) and quoted 13.45 would be picked off. Sell the call at 13.45, buy half a share for $50, borrow $38.43 (net cost 11.57), and keep 1.88 today, however the year turns out.

Where did the probability go? Into the stock price. If investors think XYZ is very likely to rise, they have already bid it up to $100 given that belief, and the $100 already includes whatever reward they demand for the risk. The option is priced **relative to the stock**, so it inherits all of that for free. That's why nobody needs to agree on \(p\) to agree on the option's price, and why [[black-scholes]] contains no expected return.

> [!WARN] “Probability doesn't matter” only applies to the price
> For Kai's *profit and loss*, the real probability matters a lot. If XYZ really rises 90% of the time, a long call bought at 11.57 makes money on average. What replication says is narrower: the *fair price* is the cost of the copy, and anyone quoting a different price hands out free money. Whether owning the call at that price is a good bet is a separate question ([[probability-ev]], [[variance-risk-premium]]).

> [!HISTORY] 1979: pricing on a napkin
> Six years after Black and Scholes, John Cox, Stephen Ross and Mark Rubinstein published “Option Pricing: A Simplified Approach” (*Journal of Financial Economics*, 1979). Their point was that the heavy continuous-time mathematics wasn't needed to see *why* options have a unique price. One step of up-or-down, repeated, carries the whole argument. Their tree is still how many people first learn pricing, and it is still used to value American options.

### ⑤ What one step teaches, and where it leads

A world with two outcomes is obviously too simple for a real stock. But each piece of this lesson grows into something real:

- **More steps.** Chop the year into many short steps, each with its own small up and down move, and repeat the argument node by node, working back from expiry. That's the multi-step tree of [[binomial-trees]], which also handles early exercise.
- **The meaning of \(q\).** \(q\) acts like a probability in a world where the stock only earns the risk-free rate. Under \(q\) the stock's average future value is \(0.602 \times 120 + 0.398 \times 80 = 104.08 = 100e^{0.04}\), the forward price from [[forwards-carry]]. That's the subject of [[risk-neutral]].
- **The size of the step is volatility.** Widening 120/80 to 130/70 took the call from 11.57 to 16.37 at 4% interest. In the multi-step tree the step size is set by volatility, \(u = e^{\sigma\sqrt{\Delta t}}\), and in the limit the price becomes the 1-year XYZ call's 9.93 from [[black-scholes]].
- **\(\Delta\) keeps its meaning.** In the continuous limit the hedge ratio becomes \(\N(d_1) = 0.618\) for that 1-year call: about 62 shares per contract.

The copy also needed some quiet assumptions: you can buy fractions of shares, borrow and lend at the same rate, trade without costs, and (in the multi-step version) rebalance whenever you like. [[bs-assumptions]] checks how badly each one fails in real markets.

## @analogy
Think of a juice bar that sells a “sunrise smoothie” made of exactly half an orange and a spoon of honey, nothing else.

What should the smoothie cost? You don't need a weather forecast, a survey of customer tastes, or a view on whether orange prices will rise next month. If the grocery next door sells oranges and honey, the smoothie's price is pinned to the cost of half an orange plus a spoon of honey. If the bar charges much more, customers blend their own. If it charges much less, a rival buys smoothies and sells the ingredients back. The recipe fixes the price. Opinions about the future only affect *how many* smoothies get sold.

The option is the smoothie. The recipe is \(\Delta\) shares plus \(B\) in cash, and the grocery is the stock and bond market. The weather forecast is the real-world probability \(p\): it matters for whether buying a smoothie makes you happy, but not for what one costs.

Where the analogy breaks: a smoothie's recipe never changes, but an option's does. In a real market the stock moves many times before expiry, and the copy must be **re-mixed** after every move, with a new \(\Delta\) and a new loan. That rebalancing is what the multi-step tree and delta hedging are about. It costs money and never works perfectly.

## @misconceptions
- **“An option's fair price is its expected payoff, using the real odds.”** — In the 120/80 world at 4%, that rule gives anything from 1.92 to 17.29 depending on whose odds you use. The price that can't be arbitraged is the replication cost, 11.57, and it doesn't depend on the odds at all.
- **“If I'm more bullish, the call is worth more.”** — More to you, perhaps, as a bet. Its *market price* is set by the cost of copying it with stock and cash. Your bullishness is already reflected in the stock price the copy is built from.
- **“Δ = 0.5 means a 50% chance of finishing in the money.”** — \(\Delta\) is a slope: option change over stock change. At 4% interest the up-weight is \(q = 0.602\), yet \(\Delta\) is still 0.5. The two agree only in special cases.
- **“The number q is the market's forecast that the stock goes up.”** — \(q\) is built from \(u\), \(d\) and \(r\) alone. It is the weight that makes the stock earn exactly the risk-free rate on average, whatever anyone expects.
- **“A two-outcome model is too crude to teach anything real.”** — One step is the building block. Chain enough of them and the tree converges to Black-Scholes (9.93 for the 1-year XYZ call), with the same replication logic at every node.

## @takeaways
- If a portfolio of stock and cash pays exactly what an option pays in every outcome, the option must cost what that portfolio costs. Any other price is free money.
- In one step: \(\Delta = (V_u - V_d)/(uS - dS)\), \(B = e^{-rT}(V_u - \Delta uS)\), price \(= \Delta S + B\). For XYZ (120/80, K = 100): \(\Delta = 0.5\), price 10 at \(r = 0\), 11.57 at 4%.
- \(\Delta\) is the hedge ratio: 50 shares make one short call contract riskless in this world.
- The same price can be written \(e^{-rT}[qV_u + (1-q)V_d]\) with \(q = (e^{rT} - d)/(u - d)\), a weight built from \(u\), \(d\), \(r\), not from anyone's forecast.
- The real probability of going up never enters the price. A wider up-down spread (more volatility) does: 120/80 → 130/70 raises the call from 10 to 15 at zero interest.

## @quiz
1. XYZ is at $100 and will be at $120 or $80 in one year; interest is zero. What is the 100-strike call worth?
   - [ ] $20, its payoff in the up state
   - [x] $10, the cost of half a share minus a $40 loan
   - [ ] $5, because the call only pays in one of two states
   - [ ] It can't be known without the probability of the up move
   > The copy (0.5 share, borrow 40) pays 20 or 0, exactly like the call, and costs \(50 - 40 = 10\). No probability was needed, and $20 is the best case, not the price.
2. In the same 120/80 world, what is the hedge ratio \(\Delta\) of the 100-strike **put**?
   - [ ] +0.5
   - [ ] 0
   - [x] −0.5
   - [ ] −1
   > The put pays 0 up and 20 down: \(\Delta = (0 - 20)/(120 - 80) = -0.5\). Its copy shorts half a share and lends cash, which makes sense for something that gains when the stock falls.
3. Kai believes there's a 90% chance XYZ goes to $120 (and 10% to $80). Interest is 4%. What is the fair price of the 100-strike call?
   - [ ] $17.29, the expected payoff at 90% odds, discounted
   - [ ] $18.00, the expected payoff at 90% odds
   - [ ] $9.61, because the market assumes 50/50
   - [x] $11.57, the replication cost, whatever Kai believes
   > Replication uses only the payoffs in each state, the stock price and the rate: \(0.5 \times 100 - 40e^{-0.04} = 11.57\). A seller at 17.29 could lock in 5.72 by building the copy. Kai's belief affects Kai's expected profit, not the price.
4. At 4% interest, the 100-strike call in the 120/80 world trades at $13.00. Which trade locks in a riskless profit today?
   - [ ] Buy the call, sell half a share, lend $38.43
   - [x] Sell the call, buy half a share, borrow $38.43
   - [ ] Buy the call and hold it to expiry
   - [ ] Sell the call and keep the premium unhedged
   > The call is rich (13.00 > 11.57). Sell it and build the copy for 11.57: you keep 1.43 today, and in either state the copy pays exactly what you owe. Selling unhedged is a bet, not an arbitrage.
5. The world becomes more volatile: XYZ goes to $130 or $70 instead of $120 or $80 (interest zero). What happens to the 100-strike call?
   - [ ] Nothing: the average outcome is still $100
   - [ ] It falls, because the down move is worse
   - [x] It rises to $15: the call gains from the bigger up move and ignores the worse down move
   - [ ] It rises to $30, the new up-state payoff
   > New copy: \(\Delta = 30/60 = 0.5\), loan 35, cost \(50 - 35 = 15\). Same average, bigger spread, more valuable call. That is volatility at work, the seed of Idea ③.

## @further
- [Binomial options pricing model (Wikipedia)](https://en.wikipedia.org/wiki/Binomial_options_pricing_model) — the Cox–Ross–Rubinstein model, one step and many, with formulas and history.
- [Replicating portfolio (Wikipedia)](https://en.wikipedia.org/wiki/Replicating_portfolio) — the general idea of pricing by copying, beyond options.
- [Rational pricing (Wikipedia)](https://en.wikipedia.org/wiki/Rational_pricing) — how no-arbitrage pins down forwards, swaps and options in one framework.
- [Black & Scholes (1973), The Pricing of Options and Corporate Liabilities](https://doi.org/10.1086/260062) — where the hedged-portfolio argument began, in continuous time.
- [Options Industry Council](https://www.optionseducation.org/) — free, non-commercial education on how listed options work.

## @next
One step handed us a number, \(q = 0.602\), that behaves exactly like a probability but isn't anyone's forecast. What is it, why does every pricing model use it, and why is it so often misread? The next lesson takes on the most misunderstood idea in option pricing: [[risk-neutral]].
