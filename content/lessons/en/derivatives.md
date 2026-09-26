---
id: derivatives
prereqs: welcome
demo: derivatives
---

# Derivatives: Contracts Written on a Price

## @hook
A farmer fears that wheat will be cheap at harvest; a baker fears it will be dear. One contract signed today removes both fears, and whatever one of them gains at harvest, the other loses. That contract is a **derivative**: its value is written on another price. This lesson meets the whole family and finds the one member that hands you a right instead of an obligation.

## @bridge
In [[welcome]] we met Kai, XYZ and the one-sentence definition of an option. Before [[call-option]] takes the option apart, we place it in its family: forwards, futures, swaps, perpetuals and options, all contracts whose value comes from the price of something else. This lesson builds Idea ② — a forward's fair price comes from what it costs to replicate — and Idea ④ — every derivative moves risk from one party to another, so you must know who holds it and whether they can pay.

## @intuition
Picture a wheat farmer and a baker six months before harvest. Wheat sells for about $100 a tonne today (a round number for illustration). The farmer will harvest 1,000 tonnes; the baker will need 1,000 tonnes.

Each of them is exposed to the same price, in opposite directions:

- If wheat falls to $70, the farmer's income drops by $30,000.
- If wheat rises to $130, the baker's flour bill rises by $30,000.

Neither wants to gamble on wheat; one grows it and the other bakes with it. So they sign a simple contract today: **in six months the farmer delivers 1,000 tonnes and the baker pays $100 a tonne, whatever the market price is then.** That is a **forward contract**, and $100 is the **forward price** \(F\).

> [!KEY] What a derivative is
> A **derivative** is a contract whose value depends on — is *derived from* — the price of something else, called the **underlying**. The underlying can be a stock like XYZ, an index, wheat, oil, an interest rate, a currency or bitcoin.

Now fast-forward to harvest and call the market price \(S_T\). If wheat is at $120, the baker buys at $100 something worth $120 — a gain of $20 a tonne compared with the market. The farmer sells at $100 something worth $120 — a loss of $20 a tonne. At $80 the roles flip. Draw both sides' gains and losses against the harvest price and you get two straight lines that mirror each other:

<figure>
<svg data-fig="derivatives-forward" viewBox="0 0 640 254" role="img" aria-label="Forward P&amp;L for both sides"><defs><marker id="derivatives-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs><line x1="70" y1="40" x2="70" y2="210" class="fx-grid"/><text x="70" y="228" text-anchor="middle" class="fx-t-sm">60</text><line x1="200" y1="40" x2="200" y2="210" class="fx-grid"/><text x="200" y="228" text-anchor="middle" class="fx-t-sm">80</text><line x1="330" y1="40" x2="330" y2="210" class="fx-grid"/><text x="330" y="228" text-anchor="middle" class="fx-t-sm">100</text><line x1="460" y1="40" x2="460" y2="210" class="fx-grid"/><text x="460" y="228" text-anchor="middle" class="fx-t-sm">120</text><line x1="590" y1="40" x2="590" y2="210" class="fx-grid"/><text x="590" y="228" text-anchor="middle" class="fx-t-sm">140</text><text x="62" y="213" text-anchor="end" class="fx-t-sm">−40</text><text x="62" y="171" text-anchor="end" class="fx-t-sm">−20</text><text x="62" y="87" text-anchor="end" class="fx-t-sm">+20</text><text x="62" y="45" text-anchor="end" class="fx-t-sm">+40</text><text x="62" y="129" text-anchor="end" class="fx-t-sm">0</text><line x1="70" y1="125" x2="604" y2="125" class="fx-axis" marker-end="url(#derivatives-ah)"/><line x1="70" y1="209" x2="590" y2="41" class="fx-line-hl"/><line x1="70" y1="41" x2="590" y2="209" class="fx-line-blue"/><line x1="460" y1="83" x2="460" y2="167" class="fx-line fx-dash"/><circle cx="460" cy="83" r="5" class="fx-fill-orange"/><circle cx="460" cy="167" r="5" class="fx-fill-blue"/><text x="472" y="102" class="fx-t-hl">baker +20</text><text x="450" y="187" text-anchor="end" class="fx-t-blue">farmer −20</text><text x="583.5" y="33" text-anchor="end" class="fx-t-hl">long (baker): S<tspan baseline-shift="sub" font-size="9">T</tspan> − 100</text><text x="122" y="41.39999999999999" class="fx-t-blue">short (farmer): 100 − S<tspan baseline-shift="sub" font-size="9">T</tspan></text><text x="330" y="104" text-anchor="middle" class="fx-t-b">F = 100</text><text x="76.5" y="117" class="fx-t-sm">the two added = 0 (zero-sum)</text><text x="590" y="246" text-anchor="end" class="fx-t-sm">wheat price at harvest S<tspan baseline-shift="sub" font-size="9">T</tspan> ($ per tonne)</text></svg>
<figcaption>Figure 1 · A forward at \(F = 100\). The baker (long) gains a dollar for every dollar wheat ends above 100; the farmer (short) loses exactly that dollar. At a harvest price of 120 the baker is +20 per tonne and the farmer −20: the two lines always add up to zero.</figcaption>
</figure>

In symbols, per tonne, the side that agreed to buy (the **long**) and the side that agreed to sell (the **short**) make

$$
\Pi_{\text{long}} = S_T - F, \qquad \Pi_{\text{short}} = F - S_T, \qquad \Pi_{\text{long}} + \Pi_{\text{short}} = 0
$$

where \(\Pi\) is profit or loss, \(S_T\) is the market price at the delivery date and \(F\) is the price agreed today. Every dollar one side makes, the other side loses: a derivative is **zero-sum** between its two parties (before fees).

> [!EXAMPLE] Harvest at $120
> Per tonne the baker makes \(120 - 100 = +\$20\) and the farmer \(100 - 120 = -\$20\). For 1,000 tonnes: \(+\$20{,}000\) and \(-\$20{,}000\). The sum is zero. Yet look at what each actually pays or receives: the farmer sells wheat for $100 a tonne, the baker buys it for $100 a tonne — exactly the price they locked in.

> [!THINK] If the contract is zero-sum, why would both of them sign it?
> On average, one of them will "lose" on the forward. Why is it still a good deal for both?
> ---
> Because neither signed it to make money on the contract. Each signed it to get rid of a risk they didn't want. The farmer's all-in price is $100 whether wheat ends at $70 or $130; so is the baker's. The contract's value to them is **certainty**, not expected profit. People who use derivatives this way are called **hedgers**.

Options are a different kind of family member. Suppose the baker wants protection against expensive wheat *without* giving up cheap wheat if prices fall. Then the baker buys a **call option**: the right to buy at $100, not the obligation. That right costs a premium up front, and it turns one of the two straight lines into a bent one. That bend is what the whole course is about.

We'll take the family in five parts:

- **① What "derived" means**: the underlying, the payoff, notional versus premium
- **② The family**: forwards, futures, swaps, options and perpetuals
- **③ Who uses derivatives**: hedgers, speculators and arbitrageurs
- **④ Counterparty risk and the clearing house**
- **⑤ A short history**: olives, rice and 1973

## @mechanics
### ① What "derived" means: underlying, payoff, notional

Every derivative has three parts: an **underlying** (what the price is written on), a **payoff rule** (how much changes hands, as a function of that price), and a **date** (when). The forward's payoff rule is \(S_T - F\). A call option's is \(\max(S_T - K, 0)\) for the buyer. A future's is the forward's, paid out a little every day.

Because the contract is written on a price, not on the thing itself, a derivative can refer to a very large amount of the underlying while costing little or nothing to enter. Two numbers keep this straight. The **notional** is the value of the underlying the contract refers to:

$$
\text{notional} = S \times \text{multiplier} \times n
$$

where \(S\) is the underlying's price, the **multiplier** is the number of units per contract (100 shares for a standard US stock option) and \(n\) is the number of contracts. The **premium** (for options) or **margin** (for futures) is the money that actually changes hands at the start.

> [!KAI] Kai's call, measured two ways
> One 30-day XYZ 100 call refers to \(100 \times 100 \times 1 = \$10{,}000\) of stock — its notional. Kai pays a premium of \(2.45 \times 100 = \$245\) for it. The ratio \(10{,}000 / 245 \approx 41\) is why options feel like leverage: a small payment rides on a large amount of stock. It is also why "I only paid $245" understates what is at stake for the seller, who may have to deliver the full $10,000 of stock.

### ② The family: forwards, futures, swaps, options, perpetuals

<figure>
<svg data-fig="derivatives-tree" viewBox="0 0 720 262" role="img" aria-label="The derivatives family tree"><rect x="226" y="8" width="270" height="48" rx="8" class="fx-box2"/><text x="361" y="28" text-anchor="middle" class="fx-t-b">Derivatives</text><text x="361" y="46" text-anchor="middle" class="fx-t-sm">value comes from the price of an underlying</text><line x1="300" y1="56" x2="180" y2="88" class="fx-line"/><line x1="422" y1="56" x2="545" y2="88" class="fx-line"/><rect x="20" y="88" width="320" height="34" rx="6" class="fx-box2"/><text x="180" y="110" text-anchor="middle" class="fx-t-b">both sides obligated → linear</text><rect x="390" y="88" width="310" height="34" rx="6" class="fx-hl"/><text x="545" y="110" text-anchor="middle" class="fx-t-b">one side holds a right → convex</text><rect x="20" y="134" width="320" height="26" rx="5" class="fx-box"/><text x="32" y="151" class="fx-t-sm">Forward · private deal, locks a future price</text><rect x="20" y="165" width="320" height="26" rx="5" class="fx-box"/><text x="32" y="182" class="fx-t-sm">Futures · standardised, on an exchange, settled daily</text><rect x="20" y="196" width="320" height="26" rx="5" class="fx-box"/><text x="32" y="213" class="fx-t-sm">Swap · swaps two streams of payments over time</text><rect x="20" y="227" width="320" height="26" rx="5" class="fx-box"/><text x="32" y="244" class="fx-t-sm">Perpetual · a future with no expiry (crypto)</text><rect x="390" y="134" width="310" height="26" rx="5" class="fx-box"/><text x="402" y="151" class="fx-t-sm">Call · the right to buy at the strike K</text><rect x="390" y="165" width="310" height="26" rx="5" class="fx-box"/><text x="402" y="182" class="fx-t-sm">Put · the right to sell at the strike K</text><rect x="390" y="196" width="310" height="26" rx="5" class="fx-box"/><text x="402" y="213" class="fx-t-sm">Hidden inside: convertibles, employee options</text><text x="545" y="245" text-anchor="middle" class="fx-t-hl">the star of this course</text></svg>
<figcaption>Figure 2 · The derivatives family. Forwards, futures, swaps and perpetuals bind both sides, so their P&L is a straight line in the underlying's price. Options give one side a choice, which bends the line — the subject of [[linear-vs-convex]].</figcaption>
</figure>

| Member | What it does | Where it trades | Money at the start | P&L shape |
|---|---|---|---|---|
| **Forward** | lock a price for one future date | privately, between two parties | usually none | straight line |
| **Futures** | a standardised forward | on an exchange, with a clearing house | margin (a deposit) | straight line, settled daily |
| **Swap** | exchange two streams of payments over time | mostly privately (over the counter) | usually none | straight line in each rate |
| **Option** | a right to buy (call) or sell (put) at a strike | exchanges and privately | the premium, paid by the buyer | bent (convex) for the buyer |
| **Perpetual** | a future with no expiry, kept near spot by funding payments | crypto exchanges | margin | straight line, funding paid periodically |

A few details matter from day one:

- **Forwards** usually cost nothing to enter because the forward price is set so the deal is fair to both sides at the start. For a stock, "fair" means the forward is spot grown at the interest rate, because a buyer could instead borrow, buy the stock today and hold it. For XYZ over 30 days that is \(F = S e^{rT} = 100 \times e^{0.04 \times 30/365} \approx 100.33\), slightly above $100. Why that exact number, and what dividends do to it, is [[forwards-carry]].
- **Futures** fix the forward's weak spots: every contract is identical (size, date, quality), trades on an exchange, and is **marked to market** each day. If a futures price falls from 100 to 98, every long pays $2 per unit to the shorts that evening, so losses can never pile up unpaid. [[futures-basis]] covers the details.
- **Swaps** are strings of forwards. The classic interest-rate swap exchanges a fixed rate for a floating rate every quarter for years. We only mention them here; this course stays with options and their linear cousins.
- **Options** are the only member where one side pays up front for a choice and the other side takes on an obligation. The buyer's loss is capped at the premium; the payoff is bent.
- **Perpetuals** are crypto's invention: futures that never expire, with periodic **funding** payments between longs and shorts that keep the price near the spot price. [[what-is-perp]] takes them apart.

Try sorting the family yourself:

::demo[derivatives-family]

### ③ Who uses derivatives: hedgers, speculators, arbitrageurs

Three kinds of users meet in every derivatives market.

- **Hedgers** already carry a risk from their business or portfolio and use a derivative to shed it: the farmer, the baker, an airline locking in fuel costs, an exporter fixing an exchange rate, Kai buying the 95 put.
- **Speculators** take on risk they don't need because they expect to be paid for it or have a view. They are the natural other side for hedgers: if every farmer wants to sell forward and not enough bakers want to buy, a speculator steps in — for a price.
- **Arbitrageurs** look for prices that are inconsistent with each other and trade until the inconsistency disappears. They are why a derivative's price can't drift far from its replication cost — Idea ②.

> [!EXAMPLE] An arbitrage with a mispriced forward
> Suppose someone offers to buy XYZ from you in 30 days at $102, while the fair forward is $100.33. Borrow $100 at 4% for 30 days, buy one XYZ share now, and agree to sell it forward at $102. In 30 days deliver the share, receive $102 and repay \(100 \times e^{0.04 \times 30/365} \approx \$100.33\). You keep about \(102 - 100.33 = \$1.67\) a share, with no market risk. Arbitrageurs doing exactly this push the $102 back down toward $100.33.

A fourth group sits in the middle: **market makers**, who quote prices to all three and manage the risk they absorb. On US option exchanges they are the usual counterparty to both retail and institutional orders; [[market-makers]] explains how they make money and how they lose it.

### ④ Counterparty risk and the clearing house

A zero-sum contract has an uncomfortable feature: at the end, one side owes the other money, and the loser may not pay. If wheat collapses to $50, the baker is committed to paying $100 for wheat worth $50 and may be tempted to walk away — or may simply be bankrupt. That is **counterparty risk**.

Exchanges solve it with a **central counterparty**, also called a clearing house. Once a trade is matched, the clearing house steps in between the two sides: it becomes the buyer to every seller and the seller to every buyer. For all US exchange-listed options, that central counterparty is the **Options Clearing Corporation (OCC)**, which issues and guarantees the contracts. To make sure it can keep its promises, it collects **margin** — deposits from the parties whose obligations could turn into losses.

<figure>
<svg data-fig="derivatives-clearing" viewBox="0 0 720 222" role="img" aria-label="Bilateral trading vs central clearing"><line x1="92" y1="57.4" x2="268" y2="57.4" class="fx-line-bad fx-dash"/><line x1="92" y1="57.4" x2="92" y2="166.6" class="fx-line-bad fx-dash"/><line x1="92" y1="57.4" x2="268" y2="166.6" class="fx-line-bad fx-dash"/><line x1="268" y1="57.4" x2="92" y2="166.6" class="fx-line-bad fx-dash"/><line x1="268" y1="57.4" x2="268" y2="166.6" class="fx-line-bad fx-dash"/><line x1="92" y1="166.6" x2="268" y2="166.6" class="fx-line-bad fx-dash"/><circle cx="92" cy="57.4" r="20" class="fx-box"/><text x="92" y="62.4" text-anchor="middle" class="fx-t-b">A</text><circle cx="268" cy="57.4" r="20" class="fx-box"/><text x="268" y="62.4" text-anchor="middle" class="fx-t-b">B</text><circle cx="92" cy="166.6" r="20" class="fx-box"/><text x="92" y="171.6" text-anchor="middle" class="fx-t-b">C</text><circle cx="268" cy="166.6" r="20" class="fx-box"/><text x="268" y="171.6" text-anchor="middle" class="fx-t-b">D</text><text x="180" y="20" text-anchor="middle" class="fx-t-b">No clearing house: everyone worries about everyone</text><text x="180" y="212" text-anchor="middle" class="fx-t-sm">4 parties → 6 bilateral credit links</text><line x1="514.5" y1="96.2" x2="452" y2="57.4" class="fx-line-ok"/><line x1="565.5" y1="96.2" x2="628" y2="57.4" class="fx-line-ok"/><line x1="514.5" y1="127.8" x2="452" y2="166.6" class="fx-line-ok"/><line x1="565.5" y1="127.8" x2="628" y2="166.6" class="fx-line-ok"/><circle cx="540" cy="112" r="30" class="fx-hl"/><text x="540" y="117" text-anchor="middle" class="fx-t-b">OCC</text><circle cx="452" cy="57.4" r="20" class="fx-box"/><text x="452" y="62.4" text-anchor="middle" class="fx-t-b">A</text><circle cx="628" cy="57.4" r="20" class="fx-box"/><text x="628" y="62.4" text-anchor="middle" class="fx-t-b">B</text><circle cx="452" cy="166.6" r="20" class="fx-box"/><text x="452" y="171.6" text-anchor="middle" class="fx-t-b">C</text><circle cx="628" cy="166.6" r="20" class="fx-box"/><text x="628" y="171.6" text-anchor="middle" class="fx-t-b">D</text><text x="540" y="20" text-anchor="middle" class="fx-t-b">Central counterparty: everyone faces the OCC</text><text x="540" y="212" text-anchor="middle" class="fx-t-sm">buyer to every seller, seller to every buyer; margin backs it</text><line x1="360" y1="40" x2="360" y2="200" class="fx-line-muted fx-dash"/></svg>
<figcaption>Figure 3 · Without a clearing house, each pair of traders must trust each other, and the credit links multiply (four parties, six links). With a central counterparty such as the OCC, everyone faces one well-capitalised party that collects margin from those with obligations.</figcaption>
</figure>

For options this has a neat consequence. The **buyer** of an option pays the premium in full and owes nothing more, so the buyer posts no margin. The **seller** has an open obligation and must post margin, which is why brokers approve accounts separately for selling options ([[margin-approval]]). Crypto venues handle defaults differently — with automatic liquidation, insurance funds and, as a last resort, auto-deleveraging ([[insurance-adl]]).

### ⑤ A short history: olives, rice and 1973

> [!HISTORY] From olive presses to the CBOE
> Aristotle tells the story of **Thales of Miletus**, who, expecting a big olive harvest, paid small deposits in winter to reserve the region's olive presses. When the harvest came in large, he rented the presses out at a high price. He had bought the *right* to use the presses, not an obligation — an option in all but name. In Osaka, the **Dojima rice exchange** was officially recognised in 1730 and is often cited as the first organised futures market. Modern listed options begin on **26 April 1973**, when the Chicago Board Options Exchange opened with calls on 16 stocks and traded 911 contracts on its first day; puts followed in 1977. The same year, Black, Scholes and Merton published the pricing formulas you will meet in [[black-scholes]].

The perpetual is much younger: BitMEX launched the first one, a bitcoin contract, on 13 May 2016. Perpetuals became a mainstay of crypto trading, and in a twist of history, BitMEX itself announced in September 2026 that it was closing, delisting that original contract on 16 September 2026.

> [!FACT] How much trades today
> US listed options set a record for the sixth year running in 2025, with about 15 billion contracts traded (Cboe, as of January 2026). Through August 2026 the average was about 71 million contracts a day, up about 23% on a year earlier (OCC, as of September 2026). Contracts, not dollars: a single contract can refer to $10,000 of a $100 stock or far more for an index.

## @analogy
Think of the derivatives family as **ways of buying something before it exists**.

A **forward** is pre-ordering a new phone at a fixed price from one shop: you both promise, and you both have to trust each other until delivery day. A **future** is the same pre-order made standard — same model, same date, same terms for everyone — and traded through a middleman who makes each side put down a deposit and settle up every evening as the phone's market price changes. A **swap** is like a phone plan that swaps a fixed monthly bill for your variable usage. An **option** is a **paid reservation**: you pay a non-refundable fee to hold the price, and on the day you decide whether to buy. A **perpetual** is a pre-order that never has to be delivered, with a small daily fee flowing between the two sides to keep its price honest.

The analogy breaks in two places. First, most people who pre-order a phone want the phone; many people in derivatives markets never want the wheat or the shares — they want the price exposure, or they are paid to take the other side. Second, a phone shop rarely loses when you win; a derivative is zero-sum, so every dollar one side gains, the other side loses, which is exactly why clearing houses and margin exist.

## @misconceptions
- **"Derivatives are just speculation."** — Many users are hedgers who carry a risk from their business and pay to shed it. The farmer and the baker both reduce their risk with the same zero-sum contract.
- **"A forward is free, so it has no value."** — It costs nothing to enter because its price is set fair at the start. Its value moves immediately with the underlying and can become large in either direction.
- **"Buying one option contract means risking $10,000."** — The buyer risks only the premium ($245 for Kai's 100 call). The $10,000 is the notional, the amount of stock the contract refers to — and it is the seller who may have to deliver it.
- **"If I trade on an exchange, my counterparty is the person who took the other side."** — After matching, the clearing house (the OCC for US listed options) becomes each side's counterparty and collects margin to guarantee performance.
- **"Futures and options are basically the same thing."** — Both are exchange-traded derivatives, but a future obliges both sides (a straight-line P&L), while an option gives the buyer a choice for a premium (a bent P&L).

## @takeaways
- A derivative is a contract whose value is derived from the price of an underlying; it has two sides and is zero-sum between them.
- A forward locks a price: the long makes \(S_T - F\), the short \(F - S_T\), and the two sum to zero.
- Forwards, futures, swaps and perpetuals bind both sides and have straight-line P&L; options give one side a right for a premium and have bent P&L.
- Hedgers shed risk, speculators take it for a price, arbitrageurs keep related prices consistent — the basis of Idea ②.
- Notional is how much underlying a contract refers to; premium or margin is what changes hands; a clearing house such as the OCC stands between the two sides.

## @quiz
1. The farmer and baker agree a forward at \(F = 100\) per tonne for 1,000 tonnes. Wheat ends at $85. What is the baker's P&L on the contract?
   - [ ] +$15,000
   - [x] −$15,000
   - [ ] $0, because the contract was free
   - [ ] −$85,000
   > The baker is long: \((85 - 100) \times 1{,}000 = -\$15{,}000\). The farmer makes +$15,000. The baker still ends up paying exactly $100 a tonne in total, which is the point of the hedge. $85,000 is the market value of the wheat, not a P&L.
2. Which feature separates options from forwards, futures, swaps and perpetuals?
   - [ ] They trade on an exchange
   - [ ] They have an expiry date
   - [x] One side holds a right, not an obligation, and pays a premium for it
   - [ ] Their value depends on an underlying price
   > Futures trade on exchanges too, forwards and futures expire, and every derivative depends on an underlying. Only the option splits right from obligation — which is why its P&L bends.
3. What does the OCC do for US exchange-listed options?
   - [ ] It sets option prices for the exchanges
   - [ ] It pays the premium for the buyer
   - [ ] It guarantees profits to option sellers
   - [x] It becomes the buyer to every seller and the seller to every buyer, backed by margin
   > The OCC is the central counterparty: after a trade is matched it stands in the middle and guarantees performance, collecting margin from those with obligations. Prices are set by buyers and sellers.
4. One XYZ 100 call costs $2.45 a share with XYZ at $100. What is the notional of one contract?
   - [x] $10,000
   - [ ] $245
   - [ ] $100
   - [ ] $2.45
   > Notional \(= S \times 100 \times n = 100 \times 100 \times 1 = \$10{,}000\): the value of the stock the contract refers to. $245 is the premium actually paid.
5. The fair 30-day forward on XYZ is about $100.33, but someone offers to buy XYZ forward from you at $102. Which trade locks in a riskless profit?
   - [ ] Buy the forward at $102 and short XYZ today
   - [x] Borrow to buy XYZ today and sell it forward at $102
   - [ ] Do nothing; forwards can't be arbitraged
   - [ ] Buy XYZ today and hold it without a forward
   > Borrow $100, buy the share, sell forward at $102. In 30 days deliver, receive $102 and repay about $100.33: roughly $1.67 a share with no market risk. Holding XYZ without the forward keeps all the price risk.

## @further
- [Characteristics and Risks of Standardized Options (OCC)](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the OCC's official explanation of listed options and its role as issuer and guarantor.
- [Derivative (finance) — Wikipedia](https://en.wikipedia.org/wiki/Derivative_%28finance%29) — a broad overview of the family, its uses and its history.
- [Dojima Rice Exchange — Wikipedia](https://en.wikipedia.org/wiki/D%C5%8Djima_Rice_Exchange) — the story of the Osaka rice market and its early futures trading.
- [The State of the Options Industry: 2025 (Cboe)](https://www.cboe.com/insights/posts/the-state-of-the-options-industry-2025) — volumes and growth of the US listed options market.
- [Announcing the perpetual XBTUSD leveraged swap (BitMEX, 2016)](https://blog.bitmex.com/announcing-the-launch-of-the-perpetual-xbtusd-leveraged-swap/) — the original description of the first perpetual contract.

## @next
The family splits into obligations and rights. Why would anyone *pay* for a right when a forward costs nothing? The next lesson looks at what options are actually used for: insurance, leverage, income and optionality.
