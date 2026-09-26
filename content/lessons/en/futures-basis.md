---
id: futures-basis
prereqs: derivatives, forwards-carry, linear-vs-convex
demo: futures-basis
---

# Futures & the Basis: Contango, Backwardation & the Roll

## @hook
A futures price is not the market's forecast. It is today's spot price plus the cost of carrying the asset until expiry, and the gap between the two (the **basis**) must shrink to zero on the last day. Once you see that, contango, backwardation and the "roll yield" that eats long-futures investors all become simple arithmetic.

## @bridge
[[crypto-options]] closed the market-structure lessons with the options world of BTC, its convex shapes and volatility quotes. This lesson opens a new stage on the options' **linear cousins**: futures and perpetuals. They have no convexity (Idea ①: their P&L is a straight line, as in [[linear-vs-convex]]) and they are traded with heavy leverage (Idea ④: risk). This first lesson takes the forward from [[forwards-carry]], where replication pinned \(F = Se^{(r-q)T}\), and adds the two things an exchange adds: standard contracts and **daily settlement**. It builds Idea ② (no-arbitrage pins the futures price) and Idea ④ (daily margin is where leverage bites).

## @intuition
Start with something you already own. Kai holds 100 XYZ shares at $100. Suppose a futures contract on XYZ exists, expiring in exactly one year, and it trades at **$104.08** (for illustration: \(r = 4\%\), no dividend).

Why above $100? Compare two ways of owning XYZ in a year:

- **Buy the stock today.** Kai pays $100 now. That $100 could have sat in a bank earning 4% a year, so the true cost, measured at year-end, is \(100 \times e^{0.04} = \$104.08\).
- **Buy the future.** Kai pays nothing today (only a deposit, which still earns interest) and pays $104.08 at the end of the year.

Both routes end with one XYZ share. If they cost different amounts, someone would buy the cheap route, sell the expensive one and pocket the gap with no risk. So the future must sit where the two routes cost the same. **The futures price is spot plus the interest you avoid paying**: a price for *delivery later*, not a guess about where XYZ is headed.

> [!KAI] Kai asks: "Does $104.08 mean the market expects XYZ to rise 4%?"
> No. The future would sit at $104.08 whether traders are bullish or bearish on XYZ, because anyone can build it from "borrow $100 + buy the stock". A forecast would need the real-world expected return, and that never appears. It is the same lesson as [[risk-neutral]]: replication pins the price, beliefs don't.

The gap between the futures price and spot is called the **basis**. Here the basis is \(104.08 - 100 = \$4.08\). The basis is not permanent. On the last day, a future that expires *now* is just a promise to trade XYZ now, which is spot. So the basis must shrink to zero by expiry. With XYZ flat at $100, the one-year future would drift from $104.08 down to $100 over the year: 3.00 of basis left at 270 days, 1.99 at 180 days, 0.99 at 90 days, 0.33 at 30 days, and zero on the final day.

<figure>
<svg viewBox="0 0 700 300" role="img" aria-label="Basis converging to zero as expiry approaches, for a future above spot and a future below spot">
<defs><marker id="futures-basis-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="60" y1="275" x2="610" y2="275" class="fx-axis" marker-end="url(#futures-basis-ah)"/>
<line x1="60" y1="275" x2="60" y2="40" class="fx-axis"/>
<polygon points="60,79.4 103,87.9 147,96.4 190,104.9 233,113.4 277,121.8 320,130.2 363,138.6 407,146.9 450,155.2 493,163.5 537,171.8 580,180 580,180 60,180" class="fx-area-hl"/>
<polygon points="60,252.9 103,246.9 147,240.9 190,234.9 233,228.8 277,222.8 320,216.7 363,210.6 407,204.5 450,198.4 493,192.3 537,186.2 580,180 60,180" class="fx-area-blue"/>
<line x1="60" y1="180" x2="580" y2="180" class="fx-line-thick"/>
<polyline points="60,79.4 103,87.9 147,96.4 190,104.9 233,113.4 277,121.8 320,130.2 363,138.6 407,146.9 450,155.2 493,163.5 537,171.8 580,180" class="fx-line-hl"/>
<polyline points="60,252.9 103,246.9 147,240.9 190,234.9 233,228.8 277,222.8 320,216.7 363,210.6 407,204.5 450,198.4 493,192.3 537,186.2 580,180" class="fx-line-blue fx-dash"/>
<circle cx="580" cy="180" r="6" class="fx-fill-ink"/>
<text x="585" y="165" class="fx-t-b">expiry: F = S</text>
<text x="70" y="70" class="fx-t-hl">contango: F = 104.08, basis +4.08</text>
<text x="70" y="270" class="fx-t-blue">backwardation: F below spot</text>
<text x="70" y="198" class="fx-t">spot S = 100 (held flat)</text>
<text x="110" y="170" class="fx-t-sm">basis shrinks: 3.00 → 1.99 → 0.99 → 0.33 → 0</text>
<text x="60" y="292" class="fx-t-sm">365 days left</text>
<text x="320" y="292" text-anchor="middle" class="fx-t-sm">180</text>
<text x="580" y="292" text-anchor="middle" class="fx-t-sm">0</text>
<text x="66" y="36" class="fx-t-sm">price</text>
</svg>
<figcaption>Figure 1 · With spot held at $100, a future above spot (contango, shaded blue) slides down to spot and a future below spot (backwardation, shaded violet) climbs up to it. Whatever happens in between, the basis \(F - S\) is zero on the last day.</figcaption>
</figure>

Futures add one more thing that a private forward doesn't have: **daily settlement**. Every evening the exchange's clearing house marks every position to that day's settlement price and moves cash: losers pay, winners receive, the same night. A forward settles once, at the end; a future settles a little every day. That is why a futures account can receive a margin call long before expiry, even if the trade eventually works out. Idea ④ lives right here.

> [!THINK] Kai's cousin is long one XYZ future at $104.08. The next day the future settles at $103.50. What happens that evening, before anyone knows how the year ends?
> Predict before you open the answer.
> ---
> The clearing house takes \((103.50 - 104.08) \times 100 = -\$58\) from the cousin's margin account (for a 100-share contract) and pays it to the short side that same evening. The contract is now "reset" to $103.50. Nothing waits for expiry: the loss is cash, today.

We'll take it in five parts:

- **① Standard contracts and daily mark-to-market**
- **② The carry model: why F sits where it does**
- **③ The basis and its convergence**
- **④ Contango, backwardation and the roll**
- **⑤ Calendar spreads, CME bitcoin futures and state of play**

## @mechanics
### ① Standard contracts and daily mark-to-market

A **futures contract** is a forward that an exchange has standardised. The underlying, the size (the multiplier), the expiry dates, the tick size and how it settles are all fixed in the rulebook, so every contract of one month is identical and can be traded anonymously. A clearing house stands between buyer and seller and guarantees both sides, the same central-counterparty idea you met with the OCC in [[derivatives]].

In exchange for that guarantee, both sides post **initial margin** (a deposit sized to cover a bad day or two), and every day the clearing house settles gains and losses in cash. This daily flow is called **variation margin**:

$$
\text{VM}_t = (F_t - F_{t-1}) \times Q \times m
$$

where \(F_t\) is today's settlement price, \(F_{t-1}\) yesterday's, \(Q\) the number of contracts (negative for a short) and \(m\) the contract multiplier. Add up every day's flow and the intermediate prices cancel: the total is \((F_T - F_0) \times Q \times m\), exactly what a forward would have paid at the end. **Daily settlement doesn't change the total, only its timing.**

> [!EXAMPLE] Four days of a long bitcoin future (illustrative prices)
> CME's standard bitcoin future covers 5 BTC. Kai's friend buys one contract at an illustrative $100,000, a notional of \(5 \times 100{,}000 = \$500{,}000\), and deposits $100,000 as margin (an illustrative figure; the clearing house sets and changes the real one).
> - Day 1 settles at 101,000: \((101{,}000 - 100{,}000) \times 5 = +\$5{,}000\)
> - Day 2 settles at 98,500: \((98{,}500 - 101{,}000) \times 5 = -\$12{,}500\)
> - Day 3 settles at 99,200: \(+\$3{,}500\)
> - Day 4 settles at 102,000: \(+\$14{,}000\)
>
> Sum: \(5{,}000 - 12{,}500 + 3{,}500 + 14{,}000 = \$10{,}000 = (102{,}000 - 100{,}000) \times 5\). The account went \(100{,}000 \to 105{,}000 \to 92{,}500 \to 96{,}000 \to 110{,}000\). If day 2 had pushed the balance below the maintenance level, the friend would have had to top up or be closed out, even though day 4 would have been a winner.

<figure>
<svg viewBox="0 0 640 270" role="img" aria-label="Daily variation margin bars for four days of a long futures position">
<line x1="60" y1="140" x2="610" y2="140" class="fx-axis"/>
<rect x="100" y="110" width="60" height="30" class="fx-ok"/>
<rect x="220" y="140" width="60" height="75" class="fx-bad"/>
<rect x="340" y="119" width="60" height="21" class="fx-ok"/>
<rect x="460" y="56" width="60" height="84" class="fx-ok"/>
<text x="130" y="102" text-anchor="middle" class="fx-t-ok">+5,000</text>
<text x="250" y="232" text-anchor="middle" class="fx-t-bad">−12,500</text>
<text x="370" y="111" text-anchor="middle" class="fx-t-ok">+3,500</text>
<text x="490" y="48" text-anchor="middle" class="fx-t-ok">+14,000</text>
<text x="130" y="30" text-anchor="middle" class="fx-t-sm">day 1: 101,000</text>
<text x="250" y="30" text-anchor="middle" class="fx-t-sm">day 2: 98,500</text>
<text x="370" y="30" text-anchor="middle" class="fx-t-sm">day 3: 99,200</text>
<text x="490" y="30" text-anchor="middle" class="fx-t-sm">day 4: 102,000</text>
<text x="60" y="258" class="fx-t-sm">balance: 100,000 → 105,000 → 92,500 → 96,000 → 110,000</text>
<text x="600" y="160" text-anchor="end" class="fx-t-b">sum = +10,000</text>
<text x="600" y="178" text-anchor="end" class="fx-t-sm">= (102,000 − 100,000) × 5</text>
</svg>
<figcaption>Figure 2 · Daily settlement of one long 5-BTC future bought at an illustrative $100,000. Green bars are cash received that evening, the red bar is cash paid. The bars add up to the same $10,000 a forward would pay at the end, but the account had to survive the −$12,500 day first.</figcaption>
</figure>

### ② The carry model: why F sits where it does

[[forwards-carry]] derived the fair forward by replication; futures inherit it (the small difference between a forward and a future caused by daily settlement matters only when interest rates move together with the price, and we ignore it here):

$$
F = S\,e^{(r - q)T}
$$

where \(S\) is spot, \(r\) the risk-free rate (the cost of financing the purchase), \(q\) the yield the asset pays while you hold it (dividends for a stock), and \(T\) the time to expiry in years. The exponent \((r - q)\) is the **net cost of carry**: what it costs per year to hold the asset instead of the promise.

XYZ futures, three ways:

- One year, no dividend: \(F = 100 \times e^{0.04} = 104.08\).
- 30 days: \(F = 100 \times e^{0.04 \times 30/365} = 100.33\), the same 30-day forward used throughout the course.
- One year with a 2% dividend yield: \(F = 100 \times e^{(0.04 - 0.02)} = 102.02\). Dividends go to whoever holds the stock, so the future is cheaper by the income it misses.

For physical commodities, carry has two more pieces: **storage** \(u\) (warehouses, insurance) raises the futures price, and **convenience yield** \(y\) (the benefit of having the physical barrel or bushel on hand when supplies are tight) lowers it: \(F = S\,e^{(r + u - y)T}\). A large convenience yield is how a commodity future ends up *below* spot.

Traders compare futures of different lengths by annualising the basis:

$$
b_{\text{ann}} = \frac{1}{T}\ln\frac{F}{S}
$$

where \(b_{\text{ann}}\) is the implied carry per year. For XYZ, \(\ln(104.08/100)/1 = 4.0\%\): exactly \(r - q\), as it should be.

> [!EXAMPLE] An illustrative bitcoin basis
> Illustrative BTC spot $100,000; a 90-day future at $101,500. Basis \(= \$1{,}500\), and
> $$
> b_{\text{ann}} = \frac{365}{90}\,\ln\frac{101{,}500}{100{,}000} = 4.056 \times 0.01489 = 6.04\%
> $$
> The carry model with \(r = 4\%\) and \(q = 0\) says \(F = 100{,}000 \times e^{0.04 \times 90/365} = 100{,}991\). The extra 2 points per year are not free money: they are the price of leveraged long demand meeting limited arbitrage capital. Collecting that spread is the cash-and-carry trade of [[basis-trades]].

What enforces the model? A **cash-and-carry** arbitrage. If the one-year XYZ future traded at $106 instead of $104.08: borrow $100 at 4%, buy the share, sell the future at $106. In a year, deliver the share for $106 and repay \(100\,e^{0.04} = 104.08\): a locked-in \(\$1.92\) per share. If the future traded too low, say $102, do the reverse (short the share, lend the $100, buy the future) and lock in $2.08, provided the share can be borrowed. Where the reverse leg is hard (you can't easily short a commodity or borrow a coin), futures can sit away from fair value for a long time.

### ③ The basis and its convergence

The **basis** is the gap between futures and spot. This course uses

$$
\text{basis} = F - S
$$

(some commodity desks quote \(S - F\) instead; always check the sign convention). Under the carry model, for small \((r-q)T\), \(F - S \approx S(r - q)T\): the basis is roughly proportional to the time left, so it melts almost linearly towards expiry, as in Figure 1.

Why must it reach zero? On the last day a future is a contract to trade the asset *now*. If it traded above spot you could buy spot, sell the future and deliver at once; below spot, the reverse. Physically delivered contracts enforce this through delivery; **cash-settled** contracts (such as CME's bitcoin futures, settled against a reference rate) enforce it by paying the difference against the final settlement price.

Convergence has a practical consequence: **a futures position's P&L is spot's move plus the basis's move.** Long one future from \(F_0\) to \(F_T = S_T\):

$$
F_T - F_0 = \underbrace{(S_T - S_0)}_{\text{spot move}} - \underbrace{(F_0 - S_0)}_{\text{starting basis}}
$$

The starting basis is a cost to the long when it is positive and a gift when negative. Kai's cousin, long the one-year XYZ future at $104.08 while XYZ ends the year at $110, earns \(110 - 104.08 = 5.92\), not the \(10\) the stock rose: the \(4.08\) basis went back to the short side, who was carrying the stock for them.

::demo[futures-basis-roll]

### ④ Contango, backwardation and the roll

Line up the futures of successive expiries and you get the **futures curve** (the term structure of futures prices).

| | **Contango** | **Backwardation** |
|---|---|---|
| Curve | far > near > spot | far < near < spot |
| Typical cause | positive carry (interest, storage) or demand for leveraged longs | scarcity now (convenience yield), high income, fear |
| A long who rolls | each contract drifts *down* to spot: a drag | each contract drifts *up* to spot: a tailwind |

Most investors who want lasting exposure through futures must **roll**: before the held contract expires, sell it and buy the next one. The part of return that comes from each contract converging to spot is called **roll yield**. If spot never moves, a long future bought at \(F_0\) and held to expiry earns

$$
R_{\text{roll}} = \frac{S - F_0}{F_0}
$$

which is negative in contango and positive in backwardation.

> [!EXAMPLE] A volatility future in contango (illustrative numbers)
> Suppose the VIX index sits at 15 and the one-month VIX future at 17. If the index simply stays at 15, the future must fall to 15 by expiry: \(R_{\text{roll}} = (15 - 17)/17 = -11.8\%\) in one month, with no change in "the market". Rolled month after month, that drag is why long-volatility products that hold VIX futures tend to decay in calm periods ([[vix]]). Reverse it, index 30 and future 26 in a panic, and a long who holds on earns \((30 - 26)/26 = +15.4\%\) if the index stays put.

> [!WARN] Contango is not a forecast of a fall, and backwardation is not a forecast of a rise
> A curve in contango does not say "prices will go down"; it says holding the asset costs something, or longs are paying up for leverage. The roll drag is real, but it is a cost of *access*, not a prediction. The most dramatic example: in April 2020 US crude oil storage ran short, contango became extreme, and the expiring front-month oil future settled below zero while longer-dated contracts stayed positive.

### ⑤ Calendar spreads, CME bitcoin futures and state of play

A **calendar spread** (or futures spread) is long one expiry and short another, for example short the June future and long the September one. Direction mostly cancels; what remains is a bet on the *shape* of the curve (will the carry between the two months widen or narrow?). Rolling is itself a calendar trade: you sell the near and buy the far, paying the spread between them. The same "sell near, buy far" logic returns for options in [[calendar-diagonal]].

> [!FACT] CME bitcoin futures (as of September 2026)
> CME launched cash-settled bitcoin futures on 17–18 December 2017, 5 BTC per contract; options on those futures followed on 13 January 2020 and Micro Bitcoin futures (0.1 BTC) on 3 May 2021. From 29 May 2026 CME's crypto futures and options trade around the clock, seven days a week; CME reported crypto average daily volume of about 407,200 contracts for 2026 year to date (+46%) around that launch (as reported). These are regulated, dated, cash-settled contracts: they converge to a reference rate at expiry and must be rolled.

Dated futures leave traders with a chore: pick a month, watch the basis, roll before expiry, pay the spread. In 2016 a crypto exchange asked a simple question: what if the future **never expired**, and the job that convergence does at expiry were done instead by a small payment between longs and shorts every few hours? That product, the perpetual future, is the next lesson ([[what-is-perp]]), and its tether to spot is [[funding-rate]].

## @analogy
Think of **buying a sofa for delivery in a year** versus buying it off the showroom floor today.

If you take it today, you pay now and your money stops earning interest, but you get to use the sofa (that is the "yield" \(q\), the use value). If you order it for delivery next year, the shop keeps the sofa in its warehouse (it pays the storage), and you keep your money in the bank until then. A fair delivery price is today's price, plus the interest you keep earning, plus the shop's storage cost, minus the use you give up. That's \(F = S\,e^{(r + u - q)T}\). The gap between the delivery price and the showroom price is the basis; on delivery day it has to vanish, because a sofa delivered today *is* a showroom sofa.

Daily settlement is the shop calling you every evening: "sofa prices went up $20 today, we'll credit you $20" or "they fell $50, please send $50 now". It all adds up to the same total, but a bad week can empty your wallet before delivery day.

Where the analogy breaks: nobody trades sofa contracts, so there is no one to arbitrage a silly delivery price. In liquid futures markets, cash-and-carry traders stand ready to pull a mispriced future back towards fair value, which is why the carry formula holds so well for stock indexes and less well for coins or commodities that are hard to borrow or store.

## @misconceptions
- **"The futures price is the market's forecast of the future spot price."** — It is spot plus carry, fixed by replication. It would sit in the same place whatever traders believe, as long as cash-and-carry works.
- **"Contango means the price is expected to fall."** — Contango means holding the asset costs something (interest, storage) or longs are paying up for leverage. It creates a roll drag for longs, not a forecast.
- **"Daily settlement changes how much I make."** — It changes *when* cash moves, not the total, which is still \((F_T - F_0) \times Q \times m\). But the timing can force you out through a margin call before the total arrives.
- **"A long future and a long stock earn the same."** — A long future earns the spot move minus the starting basis. With a positive basis the long gives back the carry, which is why fully funded futures plus cash roughly match the stock, not futures alone.
- **"A future is just an option without the premium."** — A future is linear and obliges both sides; an option is a right with a capped loss for the buyer. That is the whole contrast of this stage.

## @takeaways
- A future is a standardised forward with a clearing house and daily cash settlement; the daily flows add up to \((F_T - F_0) \times Q \times m\).
- The fair price is spot plus the net cost of carry: \(F = S\,e^{(r-q)T}\); XYZ's one-year future is 104.08.
- The basis \(F - S\) must converge to zero at expiry; a long future earns the spot move minus the starting basis.
- Contango (futures above spot) drags on a rolling long; backwardation helps it; neither is a forecast.
- Rolling is a chore that the perpetual future was invented to remove.

## @quiz
1. XYZ is at $100, \(r = 4\%\), no dividend. A one-year XYZ future trades at $104.08. What does the $4.08 above spot mainly reflect?
   - [ ] The market's expected rise in XYZ over the year
   - [x] The interest you avoid paying by buying later instead of now
   - [ ] The exchange's fee for guaranteeing the trade
   - [ ] The option premium built into every future
   > Buying the stock now ties up $100 that could earn 4%; the future lets you pay later. Replication fixes \(F = 100\,e^{0.04} = 104.08\) regardless of anyone's forecast.
2. You are long one future (multiplier 5) at 100,000. Settlements over three days are 99,000, 101,500 and 100,500. What is the total variation margin you received?
   - [ ] −$5,000
   - [ ] +$7,500
   - [ ] $0, because nothing is paid until expiry
   - [x] +$2,500
   > Daily flows: \(-5{,}000,\ +12{,}500,\ -5{,}000\), summing to \(+2{,}500 = (100{,}500 - 100{,}000) \times 5\). Daily settlement changes timing, not the total.
3. A one-month future is at 17 while spot is at 15, and spot stays at 15 until expiry. What does a long who holds to expiry earn?
   - [x] About −11.8%, because the future converges down to spot
   - [ ] 0%, because spot did not move
   - [ ] About +13.3%, the basis divided by spot
   - [ ] It depends on whether the future is cash-settled
   > Convergence forces the future to 15 at expiry: \((15 - 17)/17 = -11.8\%\). This is the roll drag of contango.
4. An illustrative 90-day BTC future trades at 101,500 with spot at 100,000. Its annualised basis is closest to:
   - [ ] 1.5%
   - [ ] 4.0%
   - [x] 6.0%
   - [ ] 15%
   > \(b_{\text{ann}} = \frac{365}{90}\ln(1.015) = 6.04\%\). 1.5% is the unannualised basis; 4% would be the carry model with \(r = 4\%\).
5. Why must the basis be zero at expiry?
   - [ ] Because the exchange sets it to zero by rule each quarter
   - [ ] Because interest rates fall to zero at expiry
   - [x] Because an expiring future is a contract to trade now, so any gap to spot can be arbitraged at once
   - [ ] Because futures traders always close positions before expiry
   > At expiry there is no time left to carry anything, so futures and spot are the same trade. Delivery or cash settlement against the final price enforces it.

## @further
- [CME Group: Bitcoin futures contract specifications](https://www.cmegroup.com/markets/cryptocurrencies/bitcoin/bitcoin.contractSpecs.html) — contract size, settlement and trading hours from the source.
- [CME Group education: introduction to futures](https://www.cmegroup.com/education/courses/introduction-to-futures.html) — the exchange's own course on futures, margin and daily settlement.
- [Futures contract (Wikipedia)](https://en.wikipedia.org/wiki/Futures_contract) — history, margining and the forward/futures difference in one place.
- [Contango (Wikipedia)](https://en.wikipedia.org/wiki/Contango) — contango, backwardation and the roll, with commodity examples.
- [New Finance Path](https://evidex-cloud.github.io/droplet-labs-finance-path/) — the sister course's lessons on TradFi futures and crypto derivatives.

## @next
Rolling a dated future every quarter is a chore, and every roll pays the basis. What if a future simply never expired? The next lesson meets the perpetual future: a contract with no expiry, kept near spot by a payment between longs and shorts.
