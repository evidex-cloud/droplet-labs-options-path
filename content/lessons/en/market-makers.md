---
id: market-makers
prereqs: liquidity-spreads, orders, covered-call, delta-hedging, variance-risk-premium, portfolio-risk
demo: market-makers
---

# Market Makers: Quoting, Inventory & Hedging

## @hook
When Kai clicks “sell” on the 105 call, someone buys it in under a second. That buyer has no opinion about XYZ. A market maker wants the three cents between the quote and the fair value, hedges the rest of the risk away within moments, and survives only if those cents arrive faster than informed traders take them back.

## @bridge
This lesson opens the Markets tier. In [[covered-call]] Kai sold the 30-day 105 call for $0.71; [[liquidity-spreads]] and [[orders]] showed what the bid-ask spread costs the person clicking; [[delta-hedging]] showed that a hedged option earns or loses the gap between realized and implied volatility. Now we sit on the other side of the screen and ask: **who takes Kai's trade, how do they price it, and how do they keep from being ruined by it?** It builds Idea ② (the quote is anchored to a no-arbitrage theoretical value) and Idea ④ (who holds the risk, and how it is hedged).

## @intuition
Start with one real click.

> [!KAI] Who buys Kai's call?
> Kai owns 100 XYZ at $100 and sells one 30-day 105 call against it. The screen shows **0.68 bid / 0.74 ask**. Kai sells at the bid, $0.68, and collects $68.
> The buyer is a market maker. Its model says the call is worth \(0.71\) (Black-Scholes at 20% volatility). It bought at 0.68, so it expects to be ahead by \(0.71 - 0.68 = 0.03\) per share, \(0.03 \times 100 = \$3\) per contract.
> Three dollars. That is the whole reason the trade happened. (The covered-call lesson used the theoretical value, $0.71; a real order fills at a quote.)

Three dollars is not a bet on XYZ. If the market maker simply held the call, a $1 drop in XYZ would cost it about \(0.222 \times 100 = \$22\) (the call's delta is 0.222), wiping out seven trades' worth of edge. So a second later it **sells about 22 XYZ shares**. Now a small move in XYZ changes the call and the 22 short shares by nearly equal and opposite amounts. The market maker has turned Kai's directional trade into something it wants: a tiny, almost riskless profit, plus a small amount of volatility exposure it can manage.

That is the job in one line: **quote around a theoretical value, collect the spread, hedge the direction, manage what is left.** A market maker (also called a dealer or liquidity provider) is a firm that continuously posts both a price at which it will buy (the bid) and a price at which it will sell (the ask), so that anyone who wants to trade can trade right now.

<figure>
<svg viewBox="0 0 680 260" role="img" aria-label="Order flow from customers to a market maker and its stock hedge">
<defs><marker id="market-makers-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="14" y="30" width="150" height="60" rx="8" class="fx-box"/>
<text x="89" y="55" text-anchor="middle" class="fx-t-b">Customers</text>
<text x="89" y="74" text-anchor="middle" class="fx-t-sm">Kai, funds, hedgers</text>
<rect x="200" y="30" width="130" height="60" rx="8" class="fx-box"/>
<text x="265" y="55" text-anchor="middle" class="fx-t-b">Broker</text>
<text x="265" y="74" text-anchor="middle" class="fx-t-sm">app or platform</text>
<rect x="366" y="30" width="150" height="60" rx="8" class="fx-box2"/>
<text x="441" y="55" text-anchor="middle" class="fx-t-b">Exchange</text>
<text x="441" y="74" text-anchor="middle" class="fx-t-sm">orders meet quotes</text>
<rect x="538" y="30" width="134" height="60" rx="8" class="fx-ok"/>
<text x="605" y="55" text-anchor="middle" class="fx-t-b">OCC</text>
<text x="605" y="74" text-anchor="middle" class="fx-t-sm">guarantees both sides</text>
<rect x="366" y="164" width="150" height="66" rx="8" class="fx-hl"/>
<text x="441" y="190" text-anchor="middle" class="fx-t-b">Market maker</text>
<text x="441" y="210" text-anchor="middle" class="fx-t-hl">bid 0.68 · ask 0.74</text>
<rect x="538" y="164" width="134" height="66" rx="8" class="fx-box"/>
<text x="605" y="190" text-anchor="middle" class="fx-t-b">Stock market</text>
<text x="605" y="210" text-anchor="middle" class="fx-t-sm">sell 22 XYZ</text>
<line x1="164" y1="60" x2="198" y2="60" class="fx-line" marker-end="url(#market-makers-ah)"/>
<text x="181" y="22" text-anchor="middle" class="fx-t-sm">sell 1 call</text>
<line x1="330" y1="60" x2="364" y2="60" class="fx-line" marker-end="url(#market-makers-ah)"/>
<text x="347" y="22" text-anchor="middle" class="fx-t-sm">route</text>
<line x1="516" y1="60" x2="536" y2="60" class="fx-line" marker-end="url(#market-makers-ah)"/>
<line x1="441" y1="162" x2="441" y2="92" class="fx-line-hl" marker-end="url(#market-makers-ah)"/>
<text x="452" y="132" class="fx-t-hl">buys at 0.68</text>
<line x1="516" y1="197" x2="536" y2="197" class="fx-line" marker-end="url(#market-makers-ah)"/>
<text x="532" y="248" text-anchor="middle" class="fx-t-sm">hedge Δ × 100 = 0.222 × 100 ≈ 22 shares</text>
<path d="M265,92 L265,197 L362,197" class="fx-line-muted fx-dash" marker-end="url(#market-makers-ah)"/>
<text x="20" y="150" class="fx-t-sm">some brokers are paid</text>
<text x="20" y="166" class="fx-t-sm">for routing retail orders</text>
<text x="20" y="182" class="fx-t-sm">(payment for order flow)</text>
</svg>
<figcaption>Figure 1 · One trade, four parties. Kai's order travels through a broker to an exchange, where a market maker's quote fills it; the OCC then stands between the two sides. Seconds later the market maker neutralizes the direction by trading about \(\Delta \times 100\) shares. The dashed path is the retail-routing arrangement discussed in part ⑤.</figcaption>
</figure>

Two things can go wrong with this tidy picture, and they are what the rest of the lesson is about.

- **Inventory piles up.** If many customers sell calls, the market maker keeps buying them. Its delta is hedged, but its exposure to volatility grows with every trade. It has to lean its prices to attract the opposite trade.
- **Some customers know more.** If the person selling the call knows the stock is about to fall, the market maker's three cents will be swamped by the drop. This is **adverse selection**: the trades you get are, on average, the ones you least wanted.

A market maker's income statement is therefore a race: **spread earned minus what informed traders take back minus the cost of hedging**. The sandbox at the end of the lesson lets you run that race yourself.

We'll take it in five parts:

- **① The quote: theoretical value plus and minus a half-spread**
- **② Hedge the direction, keep the volatility**
- **③ Inventory: leaning the quote**
- **④ Adverse selection: the equation of the business**
- **⑤ Who the market makers are in 2026, and payment for order flow**

## @mechanics
### ① The quote: theoretical value plus and minus a half-spread

A market maker's screen starts from a **theoretical value** \(V\): a model price, usually Black-Scholes or a binomial tree fed with the firm's own volatility surface ([[implied-vol]], [[smile-skew]]). Around it the firm places two prices:

$$
\text{bid} = V - \frac{w}{2}, \qquad \text{ask} = V + \frac{w}{2}
$$

where \(V\) is the theoretical value per share, \(w\) the full width of the quote, and \(w/2\) the half-spread — the edge earned on each fill against the model.

> [!EXAMPLE] XYZ's 30-day 100 call, quoted two ways
> The theoretical value at 20% volatility is \(2.45\). With a width of \(w = 0.10\) the quote is \(2.45 - 0.05 = 2.40\) bid and \(2.45 + 0.05 = 2.50\) ask.
> Professionals often think of the same quote **in volatility**: 2.40 corresponds to an implied volatility of 19.55%, and 2.50 to 20.43%. The vega of 0.114 per vol point converts one into the other: \(0.05 / 0.114 \approx 0.44\) vol points on each side.
> Per contract, a customer who buys at the ask and sells at the bid pays \(0.10 \times 100 = \$10\) for the round trip.

Why is one option quoted 0.10 wide and another 0.50 wide? The width has to cover everything that can go wrong:

| What widens the quote | Why |
|---|---|
| Large vega | An error of one vol point costs more money |
| Uncertain volatility (earnings, news) | The theoretical value itself is less certain |
| Illiquid or hard-to-borrow underlying | The hedge costs more, or cannot be done quickly |
| Informed flow in that name | Losses to better-informed traders must be recovered from everyone |
| Tick size | Under the US Penny Interval Program (permanent since 2020), options in the program trade in $0.01 steps below $3 and $0.05 at or above $3; SPY, QQQ and IWM trade in pennies at all prices |
| Competition | Other market makers undercut a quote that is wider than it needs to be |

### ② Hedge the direction, keep the volatility

Back to Kai's call. After buying one 105 call and selling 22 shares, the market maker holds:

- delta \(\approx 0.222 \times 100 - 22 \approx 0\): small moves in XYZ no longer matter;
- gamma \(0.052 \times 100 = 5.2\) shares per dollar: after a $1 rise it must sell about 5 more shares, after a $1 fall buy about 5;
- theta \(-0.031 \times 100 = -\$3.08\) a day: time decay eats about one trade's edge every day;
- vega \(0.085 \times 100 = \$8.54\) per vol point.

This is exactly the long-gamma position of [[delta-hedging]]. Its profit over the month is roughly the sum of \(\tfrac12\Gamma S^2(\sigma_{\text{real}}^2 - \sigma_{\text{imp}}^2)\,\dd t\): positive if XYZ moves more than 19.6% volatility implies, negative if it moves less.

> [!THINK] The market maker earned $3 of edge. If XYZ then realizes 15% volatility over the month instead of 20%, roughly how much does the hedged call lose?
> Try the vega shortcut before you open the answer.
> ---
> About $38. A rough gauge of a hedged option's outcome is the option's value at realized volatility minus its value at implied: \(0.328 - 0.713 = -0.385\) per share, or about −$38 per contract (at 25% realized it would be about +$45). Even after the $3 of edge the trade ends about $35 down. The exact number depends on the path, but the order of magnitude is the lesson: **the $3 edge is tiny next to the volatility outcome**. A single trade is noise; the business only works across thousands of trades whose volatility exposures largely cancel.

So market makers manage the **whole book**, not individual options ([[portfolio-risk]]). Kai's sold call adds long vega; the next customer who buys a put removes some. What remains is the net: typically a position in gamma and vega by expiry and strike, which the firm limits and hedges with other options, index futures or variance products.

Where does the steady money come from? Two sources:

1. **The spread** — the half-spread on every fill.
2. **The volatility risk premium**, when customers are net buyers of options. Across the market, investors buy more protection than they sell, so dealers end up net short options on average. Implied volatility has on average exceeded the realized volatility that followed — for the S&P 500, about 3–4 vol points from 1990 to 2024 ([[variance-risk-premium]]). A short-volatility book collects that gap in normal times and gives a large part of it back in crashes.

### ③ Inventory: leaning the quote

Suppose customers keep selling the 30-day 100 call. After ten fills the market maker is long ten contracts. It is delta-hedged, but it now has ten contracts' worth of vega and gamma it did not choose. It wants the **next** trade to be a customer *buying*. The cleanest description of what it does comes from Avellaneda and Stoikov (2008): quote around a **reservation price** that moves against your inventory.

$$
r = s - q\,\gamma\,\sigma^2\,(T - t)
$$

- \(s\): the mid or theoretical value (here 2.45)
- \(q\): current inventory (+10 contracts long)
- \(\gamma\): the firm's risk aversion — how much it dislikes carrying inventory
- \(\sigma\): how much the option's price can wander per unit of time
- \(T - t\): the time left in the trading horizon, over which the inventory must be carried

> [!EXAMPLE] Ten contracts too many
> Illustrative parameters: \(q = +10\), \(\gamma = 0.05\), \(\sigma = \$0.40\) per \(\sqrt{\text{day}}\), \(T - t = 1\) day.
> $$
> r = 2.45 - 10 \times 0.05 \times 0.40^2 \times 1 = 2.45 - 0.08 = 2.37
> $$
> Keeping the half-spread at 0.05, the quote becomes \(2.32\) bid / \(2.42\) ask, or 18.8% / 19.7% in volatility terms. The ask is now **below the old mid of 2.45**: the dealer is running a clearance sale on calls, and customers who want to buy will find it here first.

::demo[market-makers-skew-quotes]

In real options books the “inventory” is not a count of contracts but a vector of risks: vega by expiry, gamma near the money, exposure to skew. The idea is the same. **A dealer long volatility lowers the volatility it quotes; a dealer short volatility raises it.** When every dealer is short the same thing, quotes across the market lean the same way, and that is one reason implied volatility jumps when customers rush to buy puts.

> [!DEEP] The optimal width in the same model
> Avellaneda and Stoikov also derive the total width: \(\delta^a + \delta^b = \gamma\sigma^2(T-t) + \frac{2}{\gamma}\ln\!\big(1 + \frac{\gamma}{k}\big)\), where \(k\) measures how quickly the chance of a fill falls as a quote moves away from the mid. More risk (higher \(\sigma\), longer horizon) widens the quote; customers who are very price-sensitive (large \(k\)) narrow it. [[rl-market-making]] uses this model as the baseline that learning agents try to beat.

### ④ Adverse selection: the equation of the business

Now the real enemy. Imagine a fraction \(\pi\) of the orders come from traders who know where the option's value is heading, while the rest trade for their own reasons (Kai's covered call, a pension fund's hedge). The market maker cannot tell them apart when the order arrives. Per share, per fill, its expected profit is roughly:

$$
\E[\Pi] \approx \underbrace{\frac{w}{2}}_{\text{spread capture}} \;-\; \underbrace{\pi\,L}_{\text{adverse selection}} \;-\; \underbrace{c}_{\text{hedging cost}}
$$

- \(w/2\): the half-spread earned against the theoretical value on every fill
- \(\pi\): the share of fills that come from informed traders
- \(L\): the average move against the market maker after an informed trade, per share
- \(c\): the cost of the hedge per share of option traded (the stock's own spread, fees, slippage)

> [!EXAMPLE] Why the width is what it is
> Quote 2.40 / 2.50, so \(w/2 = 0.05\). Say 10% of fills are informed and each one is followed by a move of \(L = 0.40\) against the dealer; hedging costs \(c = 0.005\).
> $$
> \E[\Pi] \approx 0.05 - 0.10 \times 0.40 - 0.005 = 0.005 \text{ per share}
> $$
> That is \(0.005 \times 100 = \$0.50\) per contract per fill — thin but positive. If the informed share rises to 15%: \(0.05 - 0.06 - 0.005 = -0.015\), a loss of $1.50 per contract. To break even again the half-spread must rise to \(\pi L + c = 0.065\), a quote of about 2.38 / 2.52.

<figure>
<svg viewBox="0 0 640 240" role="img" aria-label="Waterfall of a market maker's expected profit per share">
<line x1="60" y1="190" x2="620" y2="190" class="fx-axis"/>
<rect x="90" y="65" width="90" height="125" class="fx-ok"/>
<text x="135" y="56" text-anchor="middle" class="fx-t-ok">+5.0¢</text>
<text x="135" y="208" text-anchor="middle" class="fx-t-sm">spread capture</text>
<text x="135" y="224" text-anchor="middle" class="fx-t-sm">w/2</text>
<line x1="180" y1="65" x2="220" y2="65" class="fx-line-muted fx-dash"/>
<rect x="220" y="65" width="90" height="100" class="fx-bad"/>
<text x="265" y="182" text-anchor="middle" class="fx-t-bad">−4.0¢</text>
<text x="265" y="208" text-anchor="middle" class="fx-t-sm">informed flow</text>
<text x="265" y="224" text-anchor="middle" class="fx-t-sm">π L = 10% × 40¢</text>
<line x1="310" y1="165" x2="350" y2="165" class="fx-line-muted fx-dash"/>
<rect x="350" y="165" width="90" height="12.5" class="fx-bad"/>
<text x="395" y="156" text-anchor="middle" class="fx-t-bad">−0.5¢</text>
<text x="395" y="208" text-anchor="middle" class="fx-t-sm">hedging cost c</text>
<line x1="440" y1="177.5" x2="480" y2="177.5" class="fx-line-muted fx-dash"/>
<rect x="480" y="177.5" width="90" height="12.5" class="fx-hl"/>
<text x="525" y="168" text-anchor="middle" class="fx-t-hl">+0.5¢ net</text>
<text x="525" y="208" text-anchor="middle" class="fx-t-sm">= $0.50 per contract</text>
<text x="60" y="26" class="fx-t-sm">expected profit per share per fill, quote 2.40 / 2.50</text>
<text x="620" y="26" text-anchor="end" class="fx-t-bad">at π = 15%: net −1.5¢</text>
</svg>
<figcaption>Figure 2 · The market maker's business as a waterfall. Most of the half-spread is not profit: it is the insurance premium the dealer charges everyone to pay for the few trades that come from better-informed traders. A small rise in the informed share turns the whole business negative.</figcaption>
</figure>

This equation explains the most counter-intuitive fact about market making: **the spread exists even if hedging were free**, because the dealer must charge uninformed customers for the losses it will take from informed ones. It also explains why market makers pull back or widen before earnings, at the open and during news: \(\pi\) and \(L\) jump at exactly those moments.

> [!THINK] A wholesaler offers to *pay* a retail broker for the right to fill its customers' option orders. Why would that be profitable for the wholesaler?
> ---
> Because retail orders are, on average, less informed: in the equation, their \(\pi L\) is small. The wholesaler can quote them a better price than the public quote, pay the broker a fee and still keep more than it earns on anonymous exchange flow, where professionals with better information also trade. The payment is a price for low adverse selection.

The main demo at the end of the lesson simulates exactly this: informed traders see the next fair value, and the dealer's stock hedge fills only after the stock has moved. Tight quotes win volume and lose to information; wide quotes are safe but empty. In between is a best width, and it moves out as \(\pi\) rises.

### ⑤ Who the market makers are in 2026, and payment for order flow

The US listed options market is large and still growing. About 15.2 billion contracts traded in 2025 (average daily volume about 61 million), the sixth record year in a row, according to Cboe; OCC data put average daily volume at about 70.8 million contracts for 2026 through August. Every one of those trades is cleared by the **OCC**, the central counterparty that becomes the buyer to every seller and the seller to every buyer, so Kai never depends on the market maker's creditworthiness ([[derivatives]]).

Three kinds of liquidity providers meet in that flow:

- **Exchange market makers.** Firms registered on an options exchange, typically with an obligation to keep two-sided quotes in their assigned classes, in return for benefits such as lower fees. Their quotes form the public best bid and offer.
- **Wholesalers.** Firms that pay retail brokers to route customer orders to them. In US listed options the trade must still print on an exchange, often through a brief price-improvement auction in which other market makers can compete.
- **Everyone else providing liquidity**: proprietary trading firms, hedge funds and banks posting limit orders, and customers whose own limit orders rest on the book.

> [!FACT] Payment for order flow, as of September 2026
> - **United States:** legal, with routing and payments disclosed under SEC Rule 606. The SEC's proposed Order Competition Rule and Regulation Best Execution, which would have changed how retail orders are routed, were **withdrawn on June 12, 2025**.
> - **European Union:** banned under MiFIR Article 39a (in force since March 28, 2024); Germany's transitional exemption expired on **June 30, 2026**, so the ban now applies EU-wide. The UK regulator has barred the practice since 2012.
> - **Retail share:** Cboe estimated in February 2026 that retail broker flow is about **50% of US options volume** (an estimate, not an audited figure).

The debate has serious arguments on both sides. **For:** payment for order flow helped pay for zero-commission trading, and retail orders routed this way are often filled at prices better than the public quote. **Against:** a broker paid per order has a conflict of interest when choosing where to send it; “better than the public quote” can still be worse than a more competitive process would give; and the payment is ultimately funded by the spread customers pay. Research on options execution quality ([[execution-tca]]) and a broker's disclosures ([[broker-platform]]) are how a customer can judge the result, not the headline commission.

The next lesson takes this one step further. A single dealer's hedge of Kai's call is 22 shares. But when the whole dealer community is long or short the same gamma, their hedging adds up to a force that can push the underlying itself.

## @analogy
Think of the **currency booth at an airport**. It buys euros at one price and sells them at a slightly higher one, and it does not care whether the euro rises or falls: whenever its drawer fills up with euros, it sells them on to its bank, just as a market maker hedges its delta in the stock market. Its profit is the gap between the two prices times the number of customers.

Two customers ruin its day. The first is the traveller who has just read that the euro will be devalued tonight and wants to sell a large pile of euros at today's rate — adverse selection. The booth cannot recognize that traveller at the window, so it widens its prices for everyone whenever news is in the air. The second problem is its drawer: after a planeload of tourists sells euros, the booth is overloaded, so it lowers the price at which it buys euros and sells them cheaply to draw the next customer — the reservation price at work.

The analogy breaks in one important way. A euro is one-dimensional: once the booth sells the surplus euros, its risk is gone. An option carries several risks at once. The delta can be sold off in seconds, but the gamma and vega stay in the drawer until expiry or until someone takes the opposite trade. That leftover is why dealer positions matter for the whole market.

## @misconceptions
- **“The market maker is betting against me.”** — It hedges its direction within seconds and makes money whether you win or lose, as long as its spread exceeds what informed traders take back. It is betting on volume and on its own risk control, not on your trade.
- **“A delta-hedged dealer has no risk.”** — Delta hedging removes only the first-order exposure to small moves. Gamma, vega, jumps, hedges that fill after the market has moved, and crash days remain. A dealer's losses come from exactly these.
- **“A wider spread always means more profit for the dealer.”** — A wider quote earns more per fill but gets far fewer fills, and competitors take the flow. The best width balances volume against adverse selection; it widens only when informed trading becomes more likely.
- **“Payment for order flow means retail customers always get a worse price.”** — Retail option orders are often filled at better than the public quote. The criticism is subtler: the broker's conflict of interest and whether a more competitive routing process would do better still. Both sides have evidence; the rule differs by country.
- **“Market makers know which way the stock is going.”** — If they did, they would not need a spread. The traders who know more than the dealer are exactly the ones the spread protects against.

## @takeaways
- A market maker quotes a bid and an ask around a model value; the half-spread is the edge on each fill, and it can be read in dollars or in volatility points.
- After a fill it hedges the delta at once and keeps the gamma, theta and vega, which it manages across the whole book.
- Its expected profit is spread capture minus adverse selection minus hedging cost; most of the spread pays for losses to better-informed traders.
- Inventory leans the quotes: a dealer long options shifts its prices (and its quoted volatility) down to attract buyers, as in the Avellaneda–Stoikov reservation price.
- Payment for order flow is legal in the US with disclosure and banned EU-wide since mid-2026; it exists because retail flow carries less adverse selection.

## @quiz
1. Kai sells one 30-day 105 call (delta 0.222) at 0.68 to a market maker. What does the market maker most likely do next?
   - [ ] Buy about 22 XYZ shares, to add to the long call's upside
   - [ ] Nothing: it bought below the theoretical value, so it is already safe
   - [x] Sell about 22 XYZ shares, so small moves in XYZ no longer change its P&L
   - [ ] Sell 100 XYZ shares, one share per share the call controls
   > A long call gains when XYZ rises, so the hedge is to sell about \(\Delta \times 100 = 22\) shares. Doing nothing leaves about $22 of risk per $1 move against $3 of edge; selling 100 shares would turn the position into a large short.
2. A market maker quotes 2.40 / 2.50 around a theoretical value of 2.45. Ten percent of fills are informed, followed on average by a move of 0.40 against it, and hedging costs 0.005 per share. What is its expected profit per share per fill?
   - [x] About +0.005 ($0.50 per contract)
   - [ ] About +0.05, the half-spread
   - [ ] About −0.035
   - [ ] About +0.045
   > \(0.05 - 0.10 \times 0.40 - 0.005 = 0.005\). The half-spread is the gross edge; most of it is used up by adverse selection. +0.045 forgets the informed flow's cost, and −0.035 charges it on every fill instead of 10% of them.
3. After a morning of customers selling calls, a dealer is long ten contracts and wants to get flat. What does the Avellaneda–Stoikov reservation price tell it to do?
   - [ ] Widen both sides symmetrically around the unchanged mid
   - [ ] Raise both the bid and the ask, to discourage further selling
   - [ ] Stop quoting until the inventory disappears on its own
   - [x] Move both the bid and the ask down, so buyers are more likely to trade with it
   > \(r = s - q\gamma\sigma^2(T-t)\) falls when \(q > 0\). Lower quotes make the ask more attractive to buyers and the bid less attractive to sellers, so inventory tends to shrink. Widening symmetrically protects but does not steer the flow.
4. Why can a wholesaler afford to pay a broker for its retail option orders?
   - [ ] Because retail customers always trade at the ask
   - [x] Because retail flow is, on average, less informed, so it causes less adverse selection than anonymous exchange flow
   - [ ] Because the payment is refunded by the OCC
   - [ ] Because retail orders do not need to be hedged
   > In \(\E[\Pi] \approx w/2 - \pi L - c\), retail flow has a small \(\pi L\), so a dealer can quote it tighter, pay for it, and still profit. Every fill is still hedged, and the OCC clears trades; it does not fund payments.
5. A dealer bought a call at 19.6% implied volatility and delta-hedges it every day. Over the following month XYZ realizes 15% volatility. What is the most likely result?
   - [ ] A profit, because it bought below the theoretical value
   - [ ] About zero, because the position is delta-hedged
   - [x] A loss, because the long gamma earns less from moves than theta costs
   - [ ] A profit, because low volatility reduces hedging costs
   > A hedged long option earns about \(\tfrac12\Gamma S^2(\sigma_{\text{real}}^2 - \sigma_{\text{imp}}^2)\,\dd t\) each day, negative when realized volatility is below implied. The few cents of edge are small next to the vega outcome, roughly −$35 per contract here (value at 15% volatility, 0.328, minus the 0.68 paid).

## @further
- [Avellaneda & Stoikov (2008), High-frequency trading in a limit order book](https://www.math.nyu.edu/~avellane/HighFrequencyTrading.pdf) — the inventory model behind the reservation price and the optimal spread.
- [OCC, Characteristics and Risks of Standardized Options](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — how the central counterparty stands between every buyer and seller.
- [Cboe, The State of the Options Industry 2025](https://www.cboe.com/insights/posts/the-state-of-the-options-industry-2025) — volumes, records and who trades.
- [SEC, Order Competition Rule (withdrawn 2025)](https://www.sec.gov/rules-regulations/2025/06/order-competition-rule) — the proposal on retail order routing and its withdrawal.
- [Options Industry Council, Penny increments](https://www.optionseducation.org/news/penny-increments) — the tick-size rules that set the narrowest possible quote.

## @next
One dealer hedging Kai's call trades 22 shares. What happens when the whole dealer community is long, or short, the same gamma at the same time — do their hedges calm the market or push it further? The next lesson measures that force.
