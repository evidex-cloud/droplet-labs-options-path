---
id: call-option
prereqs: welcome, derivatives, why-options, linear-vs-convex
demo: call-option
---

# The Call: The Right to Buy

## @hook
For $2.45 a share, Kai can buy the right to purchase XYZ at $100 at any time in the next 30 days. What exactly is that right, when do you use it, and how do you count the profit? The answer fits in one line: **you lose at most what you paid, you gain everything above the strike, and you only break even at strike plus premium.**

## @bridge
[[why-options]] showed what options are for, and [[linear-vs-convex]] showed that their payoff bends instead of running straight like a share's. Now we open the first of the two basic contracts, the call, and take it apart: what you own, what the seller owes you, what happens on expiry day, and how to compute profit and loss per share and per contract. This lesson builds Idea ① — **shape**: a capped loss on one side, an open upside on the other. The next lesson, [[put-option]], builds its mirror image.

## @intuition
Start with Kai's situation. Kai already owns 100 shares of XYZ at $100 (for illustration; XYZ is a fictional stock). Earnings come out in about three weeks, and Kai suspects the news will be good. Buying another 100 shares would tie up another $10,000 and add $10,000 of downside if the news disappoints. Is there a way to bet on the rise without that much at stake?

There is. Someone in the market is willing to sell Kai the following deal:

- Kai pays **$2.45 per share** today. Options trade in contracts of 100 shares, so one contract costs \(2.45 \times 100 = \$245\).
- In return Kai gets **the right, but not the obligation, to buy 100 XYZ shares at $100 each**, at any time over the next 30 days.

That deal is a **call option**. The $100 is the **strike price** (or strike, \(K\)): the purchase price written into the contract. The $2.45 is the **premium** (\(c\)): the price of the right itself, paid up front and never returned. The last day the right exists is the **expiration date**. Using the right is called **exercising** the option. Kai, the buyer, is the **holder**; the person who sold it is the **writer** (or seller).

<figure>
<svg viewBox="0 0 680 230" role="img" aria-label="Timeline of a call option: pay the premium, wait, decide at expiry">
<defs><marker id="call-option-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="10" y="70" width="190" height="96" rx="10" class="fx-box"/>
<text x="105" y="92" text-anchor="middle" class="fx-t-b">Today</text>
<text x="105" y="114" text-anchor="middle" class="fx-t-sm">Kai pays 2.45 × 100 = $245</text>
<text x="105" y="132" text-anchor="middle" class="fx-t-sm">and receives the right to buy</text>
<text x="105" y="150" text-anchor="middle" class="fx-t-sm">100 XYZ at $100</text>
<line x1="202" y1="118" x2="236" y2="118" class="fx-line" marker-end="url(#call-option-ah)"/>
<rect x="240" y="70" width="190" height="96" rx="10" class="fx-box2"/>
<text x="335" y="92" text-anchor="middle" class="fx-t-b">The next 30 days</text>
<text x="335" y="114" text-anchor="middle" class="fx-t-sm">hold it, sell it to someone else,</text>
<text x="335" y="132" text-anchor="middle" class="fx-t-sm">or exercise early (American style);</text>
<text x="335" y="150" text-anchor="middle" class="fx-t-sm">the seller keeps $245 either way</text>
<line x1="432" y1="104" x2="466" y2="64" class="fx-line" marker-end="url(#call-option-ah)"/>
<line x1="432" y1="132" x2="466" y2="170" class="fx-line" marker-end="url(#call-option-ah)"/>
<rect x="470" y="14" width="200" height="90" rx="10" class="fx-ok"/>
<text x="570" y="36" text-anchor="middle" class="fx-t-b">Expiry: above $100</text>
<text x="570" y="58" text-anchor="middle" class="fx-t-sm">exercise: pay $10,000,</text>
<text x="570" y="76" text-anchor="middle" class="fx-t-sm">receive 100 shares worth more</text>
<text x="570" y="94" text-anchor="middle" class="fx-t-sm">payoff = (price − 100) × 100</text>
<rect x="470" y="130" width="200" height="90" rx="10" class="fx-bad"/>
<text x="570" y="152" text-anchor="middle" class="fx-t-b">Expiry: $100 or below</text>
<text x="570" y="174" text-anchor="middle" class="fx-t-sm">walk away: buying at $100</text>
<text x="570" y="192" text-anchor="middle" class="fx-t-sm">makes no sense; the right lapses</text>
<text x="570" y="210" text-anchor="middle" class="fx-t-sm">loss = the $245 premium</text>
</svg>
<figcaption>Figure 1 · The life of Kai's call. Money moves once at the start (the premium goes to the seller) and possibly once at the end (Kai pays the strike and receives the shares). Everything in between is waiting — or selling the option on to someone else.</figcaption>
</figure>

On expiry day there are only two kinds of outcome, and the decision is mechanical:

| XYZ at expiry | What Kai does | Per share | Per contract |
|---|---|---|---|
| $110 | exercise: buy at 100, shares worth 110 | \(10 - 2.45 = +7.55\) | +$755 |
| $105 | exercise | \(5 - 2.45 = +2.55\) | +$255 |
| $101 | exercise — still worth it | \(1 - 2.45 = -1.45\) | −$145 |
| $100 | nothing to gain; let it lapse | \(0 - 2.45 = -2.45\) | −$245 |
| $90 | let it lapse | \(-2.45\) | −$245 |

Read the last two rows twice. XYZ fell 10%, and Kai lost exactly the same $245 as when XYZ finished flat. **Below the strike, the call doesn't care how far the stock falls.** That flat floor is the first half of the shape. Above the strike, every extra dollar of XYZ adds a dollar per share to the payoff — the second half.

> [!KAI] Why Kai likes this shape
> With the extra 100 shares, a bad earnings report that sends XYZ to $85 would cost Kai another $1,500. With the call, the worst case is $245, fixed in advance, however bad the news. If XYZ jumps to $110, the shares would make $1,000 and the call makes $755. Kai gives up a little upside (the premium) in exchange for knowing the worst case today.

Now picture all the outcomes at once. Put the price at expiry on the horizontal axis and Kai's profit or loss on the vertical axis. The result is the famous **hockey stick**:

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Payoff of a long call: flat loss below the strike, rising line above">
<defs><marker id="call-option-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="50" y1="30" x2="50" y2="200" class="fx-axis"/>
<line x1="50" y1="150" x2="625" y2="150" class="fx-axis" marker-end="url(#call-option-ah2)"/>
<line x1="50" y1="70" x2="620" y2="70" class="fx-grid"/>
<line x1="50" y1="110" x2="620" y2="110" class="fx-grid"/>
<polygon points="60,150 60,169.6 330,169.6 374.1,150" class="fx-area-bad"/>
<polygon points="374.1,150 600,49.6 600,150" class="fx-area-ok"/>
<polyline points="60,169.6 330,169.6 600,49.6" class="fx-line-thick"/>
<line x1="330" y1="40" x2="330" y2="200" class="fx-line-muted fx-dash"/>
<circle cx="374.1" cy="150" r="5" class="fx-fill-orange"/>
<text x="382" y="166" class="fx-t-hl">breakeven 102.45</text>
<text x="45" y="74" text-anchor="end" class="fx-t-sm">+10</text>
<text x="45" y="114" text-anchor="end" class="fx-t-sm">+5</text>
<text x="45" y="154" text-anchor="end" class="fx-t-sm">0</text>
<text x="45" y="174" text-anchor="end" class="fx-t-sm">−2.45</text>
<text x="150" y="216" text-anchor="middle" class="fx-t-sm">90</text>
<text x="240" y="216" text-anchor="middle" class="fx-t-sm">95</text>
<text x="330" y="216" text-anchor="middle" class="fx-t-b">K = 100</text>
<text x="420" y="216" text-anchor="middle" class="fx-t-sm">105</text>
<text x="510" y="216" text-anchor="middle" class="fx-t-sm">110</text>
<text x="600" y="216" text-anchor="middle" class="fx-t-sm">115</text>
<text x="70" y="192" class="fx-t-bad">max loss = premium: $2.45 a share</text>
<text x="380" y="40" class="fx-t-ok">profit grows $1 a share</text>
<text x="380" y="56" class="fx-t-ok">for every $1 above 102.45</text>
<text x="620" y="240" text-anchor="end" class="fx-t-sm">XYZ price at expiry ($)</text>
<text x="60" y="26" class="fx-t-sm">P&amp;L per share ($)</text>
</svg>
<figcaption>Figure 2 · Kai's 30-day 100 call at expiry. Left of the strike the line is flat at −2.45: the most Kai can lose. Right of the strike it climbs one-for-one with XYZ, crossing zero at the breakeven \(K + c = 102.45\). Red = loss, green = profit.</figcaption>
</figure>

::demo[call-option-decide]

> [!THINK] XYZ closes at $101 on expiry day. Kai paid $2.45. Should Kai exercise?
> Tempting answer: “no, it's below breakeven, the trade lost money anyway.” Predict before opening.
> ---
> Exercise. The $2.45 is already spent whatever Kai does — it is a sunk cost. The only live question is whether buying at $100 a stock worth $101 is better than not buying, and it is: it recovers $1 a share. Kai's loss shrinks from $245 to $145. In fact, US clearing exercises expiring options that are at least $0.01 in the money automatically unless the holder says otherwise ([[exercise-assignment]]).

We'll take it in five parts:

- **① The contract**: a right for the buyer, an obligation for the seller
- **② Payoff and profit**: two formulas, per share and per contract
- **③ The three numbers**: maximum loss, breakeven, maximum profit
- **④ Leverage**: the same view with $245 instead of $10,000
- **⑤ Before expiry, and where calls came from**

## @mechanics
### ① The contract: a right for one side, an obligation for the other

A call is a two-sided contract, and the two sides are not symmetric.

- The **buyer (holder)** pays the premium and receives a *choice*. The buyer can exercise, sell the option to someone else, or do nothing. No one can ever force the buyer to buy the stock.
- The **seller (writer)** receives the premium and takes on an *obligation*. If a holder exercises, the exchange's clearing system picks a seller (this is called **assignment**) who must deliver 100 shares at the strike — even if the market price is far higher.

In the US every exchange-listed option is cleared by the Options Clearing Corporation (OCC), which stands between the two sides as the central counterparty, so Kai never has to worry about whether the particular seller can pay ([[derivatives]]). XYZ options are **American style**: the holder may exercise on any business day up to expiry. **European-style** options (for example, options on the S&P 500 index, SPX) can only be exercised at expiry; [[contract-specs]] covers the difference.

One contract controls 100 shares, and prices are always quoted **per share**. A screen showing 2.45 means \(2.45 \times 100 = \$245\) for one contract. Forgetting the ×100 is the most common beginner mistake by a factor of exactly one hundred.

### ② Payoff and profit: two formulas

Two quantities matter at expiry, and they differ only by the premium.

The **payoff** is what the option itself is worth at expiry — what exercising gives you:

$$
\text{payoff} = \max(S_T - K,\ 0)
$$

The **profit and loss** (P&L) subtracts what you paid for it:

$$
\Pi = \max(S_T - K,\ 0) - c
$$

where:

- \(S_T\) is XYZ's price at expiry (the subscript \(T\) means “at time \(T\)”, the expiry);
- \(K\) is the strike, $100 for Kai;
- \(c\) is the call premium paid today, $2.45;
- \(\max(a, b)\) means “the larger of the two” — it is how the formula says “exercise only if it helps”;
- \(\Pi\) (capital pi) is profit and loss, per share. Multiply by 100 for one contract.

Try it on Kai's call at three prices:

- XYZ finishes at $108: \(\Pi = \max(108 - 100, 0) - 2.45 = 8 - 2.45 = 5.55\) per share, so \(5.55 \times 100 = \$555\) per contract.
- XYZ finishes at $100: \(\Pi = \max(0, 0) - 2.45 = -2.45\), so \(-\$245\).
- XYZ finishes at $80: \(\Pi = \max(-20, 0) - 2.45 = 0 - 2.45 = -2.45\), still \(-\$245\). The \(\max\) stops the payoff from going negative.

For simplicity these formulas ignore the small interest you could have earned on the $245 over 30 days (about $0.80 at 4%) and trading costs; [[breakeven-returns]] adds them back.

### ③ The three numbers every call buyer should know

Everything about a long call's risk at expiry fits into three numbers.

**Maximum loss = the premium.** It happens whenever \(S_T \le K\). For Kai: $2.45 a share, $245 a contract.

**Breakeven = strike + premium.** Set the P&L to zero above the strike: \(S_T - K - c = 0\). So

$$
S_{\text{BE}} = K + c
$$

where \(S_{\text{BE}}\) is the expiry price at which the trade exactly breaks even.

> [!EXAMPLE] Two breakevens on the XYZ chain
> - The 30-day 100 call at $2.45: \(S_{\text{BE}} = 100 + 2.45 = 102.45\). XYZ must rise 2.45% just to get the money back.
> - The 30-day 105 call at $0.71: \(S_{\text{BE}} = 105 + 0.71 = 105.71\). It is much cheaper ($71 a contract), but XYZ must rise 5.71% before it earns a cent.

**Maximum profit = unlimited**, in principle. Every dollar XYZ rises above the breakeven adds $1 per share, $100 per contract, with no ceiling.

> [!WARN] “In the money” is not “in profit”
> Finishing above the strike means the option is worth exercising. It does not mean the trade made money. Between $100 and $102.45, Kai exercises and still loses part of the premium. The gap between the strike and the breakeven is exactly the premium.

Here is the whole 30-day XYZ call menu (Black-Scholes prices at σ = 20%, r = 4%, explained in [[black-scholes]]):

| Strike | Premium | Per contract | Breakeven | Move XYZ needs to break even |
|---|---|---|---|---|
| 95 | 5.82 | $582 | 100.82 | +0.8% |
| 100 | 2.45 | $245 | 102.45 | +2.5% |
| 105 | 0.71 | $71 | 105.71 | +5.7% |
| 110 | 0.14 | $14 | 110.14 | +10.1% |

The pattern is the heart of choosing a call: **lower strikes cost more but need a smaller move; higher strikes are cheap because they need a big one.** The market is not handing out bargains — the 110 call costs $14 because a 10% rise in a month is unusual for a stock with 20% volatility. How likely each outcome is gets its own lesson, [[probability-ev]].

### ④ Leverage: the same view, a fraction of the money

Why would anyone accept a guaranteed loss of the premium when XYZ goes nowhere? Because of what the premium buys when XYZ does move. Compare $10,000 in 100 shares with $245 in one call, measuring each as a return on the money put in. For the call:

$$
R_{\text{call}} = \frac{\max(S_T - K,\ 0) - c}{c}
$$

where \(R_{\text{call}}\) is the return on the premium; for the shares it is simply \((S_T - S_0)/S_0\) with \(S_0 = 100\) the purchase price.

| XYZ at expiry | 100 shares ($10,000) | One 100 call ($245) |
|---|---|---|
| $90 | −$1,000 (−10%) | −$245 (−100%) |
| $100 | $0 (0%) | −$245 (−100%) |
| $105 | +$500 (+5%) | +$255 (+104%) |
| $110 | +$1,000 (+10%) | +$755 (+308%) |
| $120 | +$2,000 (+20%) | +$1,755 (+716%) |

Work out the +10% row: \(R_{\text{call}} = \dfrac{\max(110 - 100, 0) - 2.45}{2.45} = \dfrac{7.55}{2.45} = 3.08\), a gain of 308%, while the shares gain \(\dfrac{110 - 100}{100} = 10\%\).

Two things are true at once. In percentage terms the call is **leveraged**: a 10% move in XYZ became a 308% move in the option. And in dollar terms the call is **safer than the shares** in the bad scenarios: at $90 the shares lose $1,000 and the call loses only $245. The price of that combination is the premium, which is lost in full in the most common outcome — XYZ not moving much. Remember the shape from [[linear-vs-convex]]: the shares are a straight line, the call is a bent one, and you pay for the bend.

### ⑤ Before expiry, and where calls came from

Kai does not have to wait for expiry. An option is itself a tradable asset, so most holders close a position by **selling the option** back into the market ("sell to close") rather than exercising. That matters, because before expiry the market price of a call is almost always above what exercising would give.

> [!EXAMPLE] Selling beats exercising early
> Ten days before expiry, XYZ is at $108. Exercising gives \(108 - 100 = \$8.00\) a share. The call itself is worth about $8.12 (Black-Scholes, 10 days, σ 20%, r 4%). Selling captures the extra $0.12 a share — $12 a contract — that exercising would throw away. For a stock that pays no dividend, exercising a call early never beats selling it; [[american-exercise]] proves it.

That extra $0.12 is **time value**: what the market pays for the chance that XYZ moves further before expiry. How a price splits into “what exercising gives now” and “the chance of more” is the subject of [[intrinsic-time-value]], and how the option's value moves day by day before expiry is [[before-expiry]].

> [!HISTORY] 1973: calls only
> When the Chicago Board Options Exchange opened on 26 April 1973, it listed **only call options, on 16 stocks**, and traded 911 contracts on its first day. Puts were not added until 1977. The same year, Black, Scholes and Merton published the pricing formulas that tell us why Kai's call costs $2.45 ([[black-scholes]]).

> [!FACT] How big the market is now
> US listed options traded about **15 billion contracts in 2025**, a sixth straight record year (Cboe, as of January 2026), and 2026 was on pace for well above 18 billion as of July 2026. Most of that volume is calls and puts exactly like Kai's: a strike, an expiry, a premium and a multiplier of 100.

## @analogy
A call works like a **paid holding fee on a used car**. Kai sees a car listed at $10,000 and pays the dealer a non-refundable $245 to hold the right to buy it at $10,000 any time in the next 30 days.

If a rumour spreads that this model is about to become a collector's item and similar cars start selling for $11,000, Kai buys at $10,000 and is ahead $1,000 on the car, or $755 after the fee. If prices for the model slump to $9,000, Kai simply doesn't buy; the dealer keeps the $245 and that is the end of it. Kai could also sell the holding slip to another buyer before the 30 days are up — and if car prices are rising, someone will pay more than $245 for it.

The dealer's side is the writer's side: $245 in the pocket today, and a promise to hand over the car at $10,000 however valuable it becomes.

Where the analogy breaks: a real dealer might go bankrupt or break the promise, while listed options are guaranteed by a clearing house. And a car's price is quoted a few times a year, while XYZ's changes every second — which is why the option's own price also changes every second, and why a formula is needed to say what the right is worth.

## @misconceptions
- **“If my call finishes in the money, I made money.”** — Only above the breakeven \(K + c\). At $101, Kai's 100 call is in the money, gets exercised and still loses $145.
- **“Buying calls is dangerous because the loss is unlimited.”** — For the buyer it is the opposite: the most you can lose is the premium. The unlimited loss belongs to someone who *sells* a call without owning the shares ([[four-positions]]).
- **“Below breakeven I shouldn't exercise — it just makes the loss real.”** — The premium is already lost. Exercise whenever \(S_T > K\) at expiry: it always recovers something.
- **“To make money on a call I have to exercise it and buy the shares.”** — Most holders sell the option instead. Before expiry, selling also keeps the time value that early exercise throws away.
- **“The 110 call at $0.14 is a bargain — it costs almost nothing.”** — It is cheap because XYZ rarely rises 10% in a month. A low price reflects low odds, not a discount.

## @takeaways
- A call is the right, not the obligation, to buy 100 shares at the strike until expiry; the buyer pays the premium, the seller takes the obligation.
- At expiry, exercise if and only if the stock is above the strike; the payoff is \(\max(S_T - K, 0)\) and the P&L subtracts the premium.
- Maximum loss = premium; breakeven = \(K + c\); maximum profit is open-ended.
- Quotes are per share: multiply by 100 for one contract (2.45 → $245).
- Before expiry, selling a call usually beats exercising it, because the market price includes time value.

## @quiz
1. Kai buys one 30-day XYZ 100 call for $2.45. At expiry XYZ is $106. What is Kai's profit on the contract?
   - [ ] +$600
   - [ ] +$3.55
   - [x] +$355
   - [ ] +$845
   > Per share: \(\max(106 - 100, 0) - 2.45 = 3.55\); per contract \(3.55 \times 100 = \$355\). $600 forgets the premium, $3.55 forgets the ×100, $845 adds the premium instead of subtracting it.
2. Where is the breakeven of the 30-day 105 call bought for $0.71?
   - [ ] $105.00
   - [ ] $104.29
   - [ ] $100.71
   - [x] $105.71
   > Breakeven = strike + premium \(= 105 + 0.71 = 105.71\). At $105 the call is worth nothing; the stock must also cover the $0.71 paid.
3. On expiry day XYZ closes at $101.20. Kai's 100 call cost $2.45. What should happen?
   - [x] Exercise (or let the automatic exercise happen): it recovers $1.20 a share, cutting the loss to $125
   - [ ] Let it expire, because the stock is below the breakeven of $102.45
   - [ ] Let it expire, because exercising would lock in a loss
   - [ ] Exercise only if Kai wants to keep the shares long term
   > The premium is sunk. Buying at $100 a stock worth $101.20 gains $1.20 a share, so exercising improves the result from −$245 to −$125. Options at least $0.01 in the money are exercised automatically unless the holder instructs otherwise.
4. What is the most a call buyer can lose?
   - [ ] The strike times 100
   - [ ] Unlimited, if the stock falls to zero
   - [ ] The difference between the strike and the stock price
   - [x] The premium paid
   > If the stock finishes at or below the strike, the buyer walks away and loses exactly the premium — no matter how far the stock has fallen.
5. Ten days before expiry XYZ is $108 and Kai's 100 call trades at $8.12. Kai wants to take the profit. What is the better route, and why?
   - [ ] Exercise now, then sell the shares: it locks in $8.00 with certainty
   - [x] Sell the call: it captures $8.12, including $0.12 of time value that exercising would give up
   - [ ] Wait for expiry, because a call can only be closed then
   - [ ] Both routes give exactly the same result
   > Exercising captures only the intrinsic value, \(108 - 100 = 8.00\). The market price also contains time value. On a stock without dividends, selling a call beats exercising it early.

## @further
- [Call option (Wikipedia)](https://en.wikipedia.org/wiki/Call_option) — definitions, payoff diagram and terminology in one place.
- [Characteristics and Risks of Standardized Options (OCC)](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the official disclosure document every US options account holder receives; chapter one defines calls, exercise and assignment.
- [Options exercise FAQ (Options Industry Council)](https://www.optionseducation.org/referencelibrary/faq/options-exercise) — how and when exercise happens, including automatic exercise at expiry.
- [Cboe 50th anniversary history (Museum of American Finance)](https://static.moaf.org/docs/Cboe%2050th%20Anniversary.pdf) — the story of the 1973 launch with calls on 16 stocks.
- [New Finance Path](https://evidex-cloud.github.io/droplet-labs-finance-path/) — the sister course, for the stocks, rates and markets that options are built on.

## @next
The call pays when the stock goes up. What if Kai wants something that pays when XYZ goes down — for example, insurance on the 100 shares already owned? That is the other basic contract, the put.
