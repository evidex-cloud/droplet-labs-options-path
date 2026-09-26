---
id: orders
prereqs: four-positions, option-chain, liquidity-spreads
demo: orders
---

# Placing Orders: Open vs Close, Limit Orders & Multi-Leg Tickets

## @hook
An option order is two decisions (buy or sell, open or close) plus one instruction about price. Most of the money beginners lose on execution is lost in that small box, not in their analysis: a market order into a wide spread, two legs traded one at a time, a stop that fires on a flickering quote.

## @bridge
[[four-positions]] gave us the four basic positions (long or short a call or a put), and [[liquidity-spreads]] priced the toll for crossing the bid-ask spread. This lesson is the bridge between the two: how you actually tell a broker to open, adjust and close those positions while paying as little of the toll as possible. It builds Idea ④ (risk): execution risk, legging risk and the risk of an order doing something you did not intend. What happens when a position is *not* closed, exercise and assignment, comes next in [[exercise-assignment]].

## @intuition
Kai has decided on the collar: sell the 30-day 105 call and buy the 30-day 95 put. Start with the first leg. Kai opens the order ticket:

<figure>
<svg viewBox="0 0 680 300" role="img" aria-label="Anatomy of an option order ticket">
<rect x="20" y="16" width="400" height="270" rx="10" class="fx-box"/>
<text x="40" y="42" class="fx-t-b">Order ticket · XYZ options</text>
<text x="40" y="74" class="fx-t-sm">Action</text><rect x="150" y="58" width="250" height="24" rx="5" class="fx-hl"/><text x="162" y="75" class="fx-t">Sell to open</text>
<text x="40" y="106" class="fx-t-sm">Quantity</text><rect x="150" y="90" width="250" height="24" rx="5" class="fx-box2"/><text x="162" y="107" class="fx-t">1 contract (= 100 shares)</text>
<text x="40" y="138" class="fx-t-sm">Contract</text><rect x="150" y="122" width="250" height="24" rx="5" class="fx-box2"/><text x="162" y="139" class="fx-t">XYZ 30-day 105 call</text>
<text x="40" y="170" class="fx-t-sm">Order type</text><rect x="150" y="154" width="250" height="24" rx="5" class="fx-hl"/><text x="162" y="171" class="fx-t">Limit</text>
<text x="40" y="202" class="fx-t-sm">Limit price</text><rect x="150" y="186" width="250" height="24" rx="5" class="fx-hl"/><text x="162" y="203" class="fx-t">0.71 (the mid)</text>
<text x="40" y="234" class="fx-t-sm">Time in force</text><rect x="150" y="218" width="250" height="24" rx="5" class="fx-box2"/><text x="162" y="235" class="fx-t">Day</text>
<text x="40" y="268" class="fx-t-sm">Preview: credit 0.71 × 100 = $71, minus commission; covered by 100 shares</text>
<line x1="405" y1="70" x2="440" y2="70" class="fx-line-muted"/><text x="446" y="74" class="fx-t">① direction + intent</text>
<line x1="405" y1="134" x2="440" y2="134" class="fx-line-muted"/><text x="446" y="138" class="fx-t">② what, how many</text>
<line x1="405" y1="166" x2="440" y2="166" class="fx-line-muted"/><text x="446" y="170" class="fx-t">③ market or limit</text>
<line x1="405" y1="198" x2="440" y2="198" class="fx-line-muted"/><text x="446" y="202" class="fx-t">④ your worst price</text>
<line x1="405" y1="230" x2="440" y2="230" class="fx-line-muted"/><text x="446" y="234" class="fx-t">⑤ how long it waits</text>
<text x="446" y="266" class="fx-t-sm">quote now: 0.70 bid / 0.72 ask</text>
</svg>
<figcaption>Figure 1 · An order ticket has five decisions. The highlighted ones carry most of the cost: the action (open or close?), the order type and the limit price. A limit at the mid, 0.71, asks for fair value instead of accepting the bid, 0.70.</figcaption>
</figure>

Each field answers one question:

- **Action**: buy or sell, and *open* (create a new position) or *close* (reduce one you already have). Kai owns no XYZ calls yet, so selling one is **sell to open**.
- **Quantity and contract**: how many contracts, and exactly which series (underlying, expiry, strike, call or put).
- **Order type**: a **market order** trades immediately at whatever the best available price is; a **limit order** sets the worst price you accept and waits if the market is not there.
- **Limit price**: for a sell, the lowest price you accept; for a buy, the highest you will pay.
- **Time in force**: how long an unfilled order stays alive (for example until the end of today).

> [!KAI] Kai's first ticket
> Sell to open 1 XYZ 30-day 105 call, limit 0.71, day order. With the quote at 0.70 / 0.72, a market order would have filled at 0.70 (\(\$70\)). Asking for the mid gives up immediacy in exchange for a better price; on a liquid contract like this one, mid-price orders often fill within minutes as market makers compete for the flow. If it fills, Kai collects \(\$71\) and the 100 shares Kai owns cover the obligation.

> [!THINK] Three weeks later Kai wants to get rid of that short 105 call before expiry. What does the ticket's action field say?
> ---
> **Buy to close.** Kai is short the call, so buying one back cancels the position. “Buy to open” would instead create a separate long call, leaving Kai both long and short, and on many platforms that mistake is only caught when the position screen looks strange.

We'll take it in six parts:

- **① Open or close**: the four actions and the life of a position
- **② Market vs limit**: working the mid, and what a market order really costs
- **③ Multi-leg orders**: net debit, net credit and legging risk
- **④ Time in force, and why stop orders on options misbehave**
- **⑤ Rolling**: closing and opening in one ticket
- **⑥ Routing, payment for order flow and costs (2026)**

## @mechanics
### ① Open or close: the four actions

Crossing buy/sell with open/close gives four actions:

| Action | You… | Position after | Typical use |
|---|---|---|---|
| Buy to open | pay the premium | new long option | buy a call or a protective put |
| Sell to close | receive the premium | long reduced | take profit or cut a loss on a long |
| Sell to open | receive the premium | new short option | covered call, cash-secured put, credit spread leg |
| Buy to close | pay the premium | short reduced | take profit or cut a loss on a short |

The open/close flag matters for more than bookkeeping. Brokers use it to check that you have the approval and margin to *open* a short ([[margin-approval]]), and the exchanges use it to track open interest ([[liquidity-spreads]]). Some platforms fill it in automatically from your existing position; it is still worth reading before you press send.

<figure>
<svg viewBox="0 0 680 250" role="img" aria-label="The life cycle of an option position">
<defs><marker id="orders-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="20" y="95" width="170" height="60" rx="8" class="fx-hl"/>
<text x="105" y="120" text-anchor="middle" class="fx-t-b">Open</text>
<text x="105" y="140" text-anchor="middle" class="fx-t-sm">buy to open / sell to open</text>
<rect x="300" y="14" width="360" height="46" rx="8" class="fx-ok"/>
<text x="480" y="34" text-anchor="middle" class="fx-t-b">Close before expiry</text>
<text x="480" y="51" text-anchor="middle" class="fx-t-sm">sell to close / buy to close: the most common ending</text>
<rect x="300" y="72" width="360" height="46" rx="8" class="fx-box2"/>
<text x="480" y="92" text-anchor="middle" class="fx-t-b">Expire worthless</text>
<text x="480" y="109" text-anchor="middle" class="fx-t-sm">out of the money at expiry: premium kept by the writer</text>
<rect x="300" y="130" width="360" height="46" rx="8" class="fx-blue"/>
<text x="480" y="150" text-anchor="middle" class="fx-t-b">Exercise (the holder's choice)</text>
<text x="480" y="167" text-anchor="middle" class="fx-t-sm">shares or cash change hands at the strike</text>
<rect x="300" y="188" width="360" height="46" rx="8" class="fx-bad"/>
<text x="480" y="208" text-anchor="middle" class="fx-t-b">Assignment (the writer's obligation)</text>
<text x="480" y="225" text-anchor="middle" class="fx-t-sm">chosen at random when a holder exercises</text>
<line x1="190" y1="115" x2="296" y2="38" class="fx-line" marker-end="url(#orders-ah)"/>
<line x1="190" y1="120" x2="296" y2="95" class="fx-line" marker-end="url(#orders-ah)"/>
<line x1="190" y1="130" x2="296" y2="153" class="fx-line" marker-end="url(#orders-ah)"/>
<line x1="190" y1="135" x2="296" y2="210" class="fx-line" marker-end="url(#orders-ah)"/>
</svg>
<figcaption>Figure 2 · Every position is opened by one ticket and ends in one of four ways. Only the first ending needs another order from you; the other three happen automatically at or before expiry, which is why the next lesson matters even if you never plan to exercise.</figcaption>
</figure>

### ② Market vs limit: what immediacy costs

A **market order** says “fill me now at the best price available”. A buy fills at the ask, a sell at the bid, and a large order can go further: if the displayed ask is only for 20 contracts and you want 60, the rest fills at the next price levels up. A **limit order** says “no worse than this price” and waits otherwise.

The cost of an execution is usually measured against the mid at the moment you sent it:

$$
\text{slippage} = \left(P_{\text{fill}} - \text{mid}\right) \times 100 \times n \quad \text{(for a buy; reverse the sign for a sell)}
$$

where \(P_{\text{fill}}\) is your average fill price, mid is the quote midpoint when the order was sent, and \(n\) the number of contracts.

> [!EXAMPLE] Market orders on the XYZ 100 call (quote 2.42 / 2.48, mid 2.45)
> 10 contracts at market: all fill at 2.48 → slippage \((2.48 - 2.45) \times 100 \times 10 = \$30\).
> 60 contracts at market, with 20 offered at 2.48, 20 at 2.50 and 20 at 2.53: the average fill is \((2.48 + 2.50 + 2.53)/3 = 2.503\) → slippage \(0.053 \times 100 \times 60 = \$320\).
> A limit at 2.45 that fills costs zero slippage; one that never fills costs nothing but leaves Kai without the position.

**Working the mid** is the common middle path on liquid contracts: place a limit at the mid, wait a short while, and if it does not fill, move it a cent or two toward the market. Each step gives up a little edge for a better chance of filling. On a thin contract (like QRS in [[liquidity-spreads]]) the mid is a guess, and a fill near it may never come; that uncertainty is part of the price of illiquidity.

### ③ Multi-leg orders: net debit, net credit and legging risk

Strategies with several legs (spreads, collars, condors) can be sent as one **multi-leg order** priced as a single net number. You pay a **net debit** if the legs cost more than they bring in, or collect a **net credit** if the reverse. The exchanges run separate complex-order books where these packages trade as a unit: **either all legs fill at your net price, or none do**.

$$
\text{net price} = \sum_{\text{legs}} (\pm 1)\times \text{price}_i, \qquad +\ \text{for legs you buy},\ -\ \text{for legs you sell}
$$

where a positive result is a debit you pay and a negative one a credit you receive.

> [!EXAMPLE] Two of Kai's packages, priced three ways
> **Bull call spread** (buy the 100 call, sell the 105 call): at mids \(2.45 - 0.71 = 1.74\) debit; at the “natural” prices (buy at the ask, sell at the bid) \(2.48 - 0.70 = 1.78\) debit, or \(\$178\) per spread.
> **Collar** (sell the 105 call, buy the 95 put): at mids \(-0.71 + 0.51 = -0.20\), a \(\$20\) credit; at natural prices \(-0.70 + 0.52 = -0.18\), a \(\$18\) credit.
> A single limit order for the collar at a \(0.20\) credit asks for the mid of the whole package, with no risk of ending up with only one leg.

**Legging** means trading the legs one at a time instead. It can work, but between the fills the stock moves, and your second leg's price moves with it:

::demo[orders-legging]

If Kai buys the 100 call at 2.48 and XYZ slips to $99 before the 105 call is sold, that call is now worth about 0.52 and bids about 0.51: the spread costs \(2.48 - 0.51 = 1.97\) instead of 1.78, or \(\$19\) more per spread. If XYZ had risen to $101 instead, legging would have *saved* money. Legging is therefore a small directional bet on the stock between the two fills, not a free way to get better prices.

### ④ Time in force, and why stop orders on options misbehave

**Time in force** decides how long an unfilled order lives. A **day** order expires at the close; **good-til-canceled (GTC)** stays open across days until filled or canceled (brokers usually cap how long); **immediate-or-cancel** fills whatever it can at once and cancels the rest. Option orders generally trade only during the option's session; some index products trade nearly around the clock on weekdays, and about 20 single-stock option classes gained short pre- and post-market sessions on one Cboe exchange (launch scheduled for July 13, 2026; see [[product-map]]).

A **stop order** is dormant until a trigger price trades or is quoted, and then becomes a **market order**. On a stock with a one-cent spread that is often fine. On an option it can go badly wrong:

> [!WARN] A stop on a flickering quote
> Kai holds the 100 call (fair value about 2.10 after a small dip) with a sell stop at 2.00. At the open, quotes are briefly wide: 1.60 bid / 2.60 ask. The bid touching 1.60 triggers the stop, which becomes a market sell and fills at 1.60: \((2.10 - 1.60) \times 100 = \$50\) below fair value per contract, on a quote that normalised a minute later. **Stop-limit** orders avoid the bad fill but may not fill at all. Many option traders instead set price alerts on the underlying, or cap risk with the structure itself (a spread's maximum loss is fixed when you open it).

### ⑤ Rolling: closing and opening in one ticket

A **roll** closes an existing position and opens a similar one with a later expiry and/or a different strike, sent as one multi-leg order so there is no gap between the two.

> [!EXAMPLE] Kai rolls the covered call
> One day before expiry XYZ is at $104 and Kai's short 105 call is worth about 0.11. Kai does not want the shares called away if XYZ jumps overnight, so Kai sends one ticket: **buy to close** the expiring 105 call and **sell to open** the next month's 105 call, worth about 2.07 with XYZ at $104. Net credit \(\approx 2.07 - 0.11 = 1.96\), or \(\$196\). Rolling “up and out” to the next month's 107.5 call (about 1.16) would collect less, about \(\$105\), but leave more room above.

A roll is two trades, not one magic trade: the first leg realises the gain or loss on the old option, and the second takes on a brand-new obligation with its own risk. Covered-call management is developed in [[covered-call]].

### ⑥ Routing, payment for order flow and costs (2026)

When you press send, your broker routes the order to an exchange or to a wholesale market maker. In the US many retail brokers are paid by market makers for routing option orders to them, **payment for order flow (PFOF)**. It is legal in the US and must be disclosed in the broker's quarterly routing reports under SEC Rule 606. On June 12, 2025 the SEC withdrew its proposed Order Competition Rule and Regulation Best Execution, two proposals that would have changed how retail orders are handled. The EU banned PFOF under MiFIR, and the last national exemption (Germany's) expired on June 30, 2026, so it is banned EU-wide from then; the UK regulator has barred it since 2012.

> [!DEEP] The PFOF debate, both sides
> **Supporters** argue that PFOF funds zero or low commissions and that wholesalers often fill retail orders at or better than the quoted prices, because retail flow is on average less informed and cheaper to trade against. **Critics** argue that it creates a conflict of interest (the broker is paid by the party on the other side of your trade), that orders are not exposed to full competition, and that per-contract payments in options can be large relative to the spread. The evidence on net costs is contested; what is not contested is that the quoted spread, your order type and your limit price are under your control.

Commissions are the smaller, visible part of the bill: a typical retail range is often quoted at about $0.50–0.65 per contract, varying by broker (some charge nothing, plus a few cents of exchange and regulatory fees). For a round trip of 10 XYZ 100 calls that is about \(\$13\), against \(\$60\) of spread if you cross it both ways. Professional execution measurement is covered in [[execution-tca]], and choosing a broker in [[broker-platform]]. Walking through Kai's first real trade end to end, with every ticket, is the job of [[first-trade]].

## @analogy
Placing an option order is like **booking a hotel room through a travel site**. Choosing the room and dates (the contract) is only half of it. You also choose *how* to buy: “book now at whatever the price is” (a market order) or “alert me and book only if the price drops to $120” (a limit order). The first is certain but can be expensive when the site's prices jump; the second is cheaper but may leave you without a room.

A trip with a flight and a hotel is a multi-leg order. A package deal books both or neither at one total price. Booking them separately (legging) can land you a great flight and then find the hotel price has doubled while you were paying. And a “rebooking” that cancels one stay and books a later one in one step is a roll.

Where the analogy breaks: a hotel does not charge you the difference between its buying and selling price twice, and it does not change its price every second with the stock market. Options do both, which is why the order box deserves the same care as the analysis.

## @misconceptions
- **“Market orders on options are fine; they're just faster.”** — A market order pays the full half-spread and, for size beyond the displayed quote, more. On liquid contracts a limit at or near the mid usually fills; on thin ones a market order can fill far from fair value.
- **“Sell to open and sell to close are the same thing.”** — One creates a new short position with an obligation (and a margin requirement); the other reduces a long you already own. Choosing the wrong one can leave you with a position you never intended.
- **“Legging into a spread is a free way to get better prices.”** — Between the two fills you hold a one-legged position exposed to the stock. Sometimes that helps, sometimes it hurts; a multi-leg order removes the risk.
- **“A stop-loss protects an option position the way it protects a stock.”** — A stop becomes a market order when triggered; wide or flickering option quotes can trigger it and fill it at a poor price.
- **“Zero commission means trading is free.”** — The spread, fees and execution quality remain; for most retail option trades the spread is the larger cost.

## @takeaways
- Every order is buy/sell × open/close: buy to open, sell to close, sell to open, buy to close; the flag decides whether you create or reduce a position.
- A market order buys the ask and sells the bid (and walks the book for size); a limit at or near the mid usually costs less on liquid contracts.
- Multi-leg orders trade a whole strategy at one net debit or credit, all legs or none; legging turns the gap between fills into a directional bet.
- Stop orders become market orders and can misfire on wide option quotes; rolls are close-and-reopen in one ticket; PFOF is legal and disclosed in the US, banned in the EU and UK (as of September 2026).

## @quiz
1. Kai is short one XYZ 105 call (the covered call) and wants to end that obligation before expiry. Which action should the ticket show?
   - [ ] Sell to close
   - [ ] Buy to open
   - [x] Buy to close
   - [ ] Sell to open
   > Kai is short, so buying one back closes it. Buy to open would create a separate long call; the two selling actions would add to or misstate the position.
2. The XYZ 100 call is quoted 2.42 / 2.48, with 20 contracts offered at 2.48, 20 at 2.50 and 20 at 2.53. Kai sends a market order to buy 60. What is the slippage against the 2.45 mid?
   - [ ] $0, market orders fill at the mid
   - [ ] $180
   - [x] About $320
   - [ ] About $30
   > The order walks the offers: average \((2.48 + 2.50 + 2.53)/3 \approx 2.503\). Slippage \(\approx 0.053 \times 100 \times 60 \approx \$320\). $180 would be the slippage if all 60 filled at 2.48.
3. Kai wants the 100/105 bull call spread. Why send it as one multi-leg order rather than two separate orders?
   - [ ] Multi-leg orders never pay commissions
   - [x] Both legs fill together at one net price, so Kai is never left holding only one leg while the stock moves
   - [ ] Multi-leg orders always fill at a better price than the individual mids
   - [ ] Exchanges do not allow spreads to be entered as separate orders
   > The package trades all-or-none at a net debit you choose. Legging exposes you to the stock between fills; in the example a $1 dip cost about $19 per spread.
4. Kai holds a long call with a sell stop at 2.00. At the open the quote flickers to 1.60 / 2.60 and the stop triggers. What most likely happens?
   - [ ] The order fills at 2.00, the stop price
   - [ ] The order waits until the quote returns to normal
   - [ ] The broker cancels the stop because the spread is too wide
   - [x] The stop becomes a market sell and fills near the 1.60 bid
   > A stop order turns into a market order once triggered, so it takes whatever bid is there. A stop-limit would not sell below its limit, at the risk of not selling at all.
5. Which statement about payment for order flow is accurate as of September 2026?
   - [x] It is legal in the US and disclosed in brokers' Rule 606 reports; it is banned in the EU (fully from June 30, 2026) and barred in the UK
   - [ ] The SEC banned it for options in 2025
   - [ ] It is banned everywhere, but brokers still use it informally
   - [ ] It is a fee the customer pays to the exchange on each order
   > The SEC withdrew its proposed Order Competition Rule on June 12, 2025, leaving US PFOF legal with disclosure. The EU ban under MiFIR became universal when Germany's exemption expired on June 30, 2026; the UK has barred it since 2012.

## @further
- [Characteristics and Risks of Standardized Options (OCC)](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the official disclosure, including order types and opening/closing transactions.
- [SEC: Order Competition Rule (withdrawn June 2025)](https://www.sec.gov/rules-regulations/2025/06/order-competition-rule) — the proposal and its withdrawal notice.
- [EU MiFIR amendments prohibiting PFOF (Hogan Lovells)](https://www.hoganlovells.com/en/publications/eu-mifir-amendments-prohibiting-payment-for-order-flow-pfof-entered-into-force-on-28-march-2024) — a law-firm summary of the EU ban and its transition.
- [OIC: Options Industry Council education center](https://www.optionseducation.org/) — free material on order types and multi-leg strategies.

## @next
Most of Kai's positions will end with a closing order. But what if Kai does nothing? At expiry some options turn into shares, some into cash and some into nothing, and a short option can be assigned before expiry at all. The next lesson follows a contract through exercise, assignment and expiration day.
