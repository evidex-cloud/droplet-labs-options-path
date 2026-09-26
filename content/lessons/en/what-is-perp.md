---
id: what-is-perp
prereqs: linear-vs-convex, crypto-options, futures-basis
demo: what-is-perp
---

# Perpetual Futures: A Future With No Expiry

## @hook
A dated future is pulled to spot by its expiry date. Take the expiry away and something else has to do the pulling. In 2016 a crypto exchange answered with a small payment between longs and shorts every few hours. The result, the **perpetual future** or "perp", became the main way leverage is traded in crypto, and it is a straight line, not a hockey stick.

## @bridge
[[futures-basis]] showed that a dated future converges to spot at expiry, and that holding exposure means rolling from contract to contract and paying the basis each time. The perpetual future deletes the expiry and the roll. This lesson explains what you actually hold when you "go long a perp", how linear and inverse contracts differ, and what leverage does to a straight-line payoff. It builds Idea ④ (risk: leverage and liquidation) and sharpens Idea ① (shape) by contrast with the options of [[crypto-options]]: a perp has no convexity at all, as in [[linear-vs-convex]].

## @intuition
Kai has read about bitcoin options and now meets the product that most crypto traders use instead. Take an illustrative BTC price of $100,000.

Kai deposits **$1,000** with a crypto venue and opens a **10× long perp**. That means a position worth \(10 \times 1{,}000 = \$10{,}000\) of bitcoin, which is 0.1 BTC. Kai owns no bitcoin; Kai holds a contract whose value moves one-for-one with 0.1 BTC.

- BTC rises 5% to $105,000: the position gains \(0.1 \times 5{,}000 = \$500\). On Kai's $1,000 that is **+50%**.
- BTC falls 5% to $95,000: the position loses $500. That is **−50%**.
- BTC falls about 9.5% to $90,500: the loss has eaten nearly all the margin, and the venue closes the position by force. This is **liquidation**. With the course's teaching assumptions (a 0.5% maintenance margin), a 10× long from $100,000 is liquidated near **$90,500** ([[margin-liquidation]] works it out).

Three features jump out. The payoff is a **straight line**: every $1,000 move in BTC is $100 to Kai, up or down. There is **no premium** to pay up front, only a deposit. And there is **no expiry**: Kai can hold the position for a day or a year, as long as the margin holds and Kai pays the running cost described below.

> [!KAI] Kai compares it with a call
> With the same $1,000 Kai could have bought a bitcoin call. The call's worst case is losing the $1,000 premium, however far BTC falls, and the position cannot be closed out early by a dip. The perp's worst case is also losing the $1,000, but it can happen on a quick 9.5% dip, even if BTC then recovers the next day. Same money at risk, very different shapes. That comparison is [[perps-vs-options]].

What keeps a contract with no expiry anchored to the real bitcoin price? A dated future has convergence: on the last day it *must* equal spot. A perp has **funding**: every few hours (every 8 hours on many venues, every hour on some), the side that is pushing the perp away from the spot index pays the other side. If the perp trades above spot, longs pay shorts; that makes being long more expensive and short more attractive until the gap closes. [[funding-rate]] is the full mechanism.

<figure>
<svg viewBox="0 0 660 260" role="img" aria-label="A dated future converges and is rolled at each expiry; a perpetual future never expires and is held near the index by funding">
<defs><marker id="what-is-perp-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<text x="20" y="24" class="fx-t-b">Dated future</text>
<line x1="60" y1="100" x2="610" y2="100" class="fx-line-muted"/>
<polyline points="60,62 230,100" class="fx-line-hl"/>
<polyline points="230,62 400,100" class="fx-line-hl"/>
<polyline points="400,62 570,100" class="fx-line-hl"/>
<line x1="230" y1="96" x2="230" y2="68" class="fx-line fx-dash" marker-end="url(#what-is-perp-ah)"/>
<line x1="400" y1="96" x2="400" y2="68" class="fx-line fx-dash" marker-end="url(#what-is-perp-ah)"/>
<circle cx="230" cy="100" r="4" class="fx-fill-ink"/>
<circle cx="400" cy="100" r="4" class="fx-fill-ink"/>
<circle cx="570" cy="100" r="4" class="fx-fill-ink"/>
<text x="230" y="120" text-anchor="middle" class="fx-t-sm">expiry → roll</text>
<text x="400" y="120" text-anchor="middle" class="fx-t-sm">expiry → roll</text>
<text x="570" y="120" text-anchor="middle" class="fx-t-sm">expiry</text>
<text x="612" y="104" class="fx-t-sm">spot</text>
<text x="20" y="160" class="fx-t-b">Perpetual future</text>
<line x1="60" y1="215" x2="610" y2="215" class="fx-line-muted"/>
<polyline points="60,209 100,205 140,211 180,203 220,208 260,213 300,206 340,219 380,212 420,209 460,204 500,212 540,217 580,211 610,214" class="fx-line-btc"/>
<line x1="80" y1="232" x2="80" y2="240" class="fx-line"/>
<line x1="160" y1="232" x2="160" y2="240" class="fx-line"/>
<line x1="240" y1="232" x2="240" y2="240" class="fx-line"/>
<line x1="320" y1="232" x2="320" y2="240" class="fx-line"/>
<line x1="400" y1="232" x2="400" y2="240" class="fx-line"/>
<line x1="480" y1="232" x2="480" y2="240" class="fx-line"/>
<line x1="560" y1="232" x2="560" y2="240" class="fx-line"/>
<text x="60" y="256" class="fx-t-sm">each tick = a funding payment (every 8 h, or every hour on some venues); no expiry, no roll</text>
<text x="612" y="219" class="fx-t-sm">index</text>
<text x="190" y="190" class="fx-t-btc">perp above index → longs pay shorts</text>
</svg>
<figcaption>Figure 1 · Top: a dated future converges to spot at each expiry, and a holder must roll into the next contract, paying the basis again. Bottom: a perp never expires; it wanders around the spot index, and a funding payment every few hours pulls it back.</figcaption>
</figure>

::demo[what-is-perp-vs-future]

> [!THINK] A perp never expires. Does that mean Kai can hold a 10× long through any dip and wait for recovery?
> Predict before you open the answer.
> ---
> No. "No expiry" removes the calendar deadline, not the margin deadline. A 10× long is liquidated after roughly a 9.5% fall, however briefly the price stays there, and funding keeps charging (or paying) every interval. An option buyer can wait out a dip; a leveraged perp holder often cannot.

We'll take it in five parts:

- **① What you hold: a linear contract with a running cost**
- **② Linear and inverse contracts**
- **③ Leverage: the same line, a shorter fuse**
- **④ Perp, dated future, spot and option side by side**
- **⑤ From BitMEX to the CFTC: state of play**

## @mechanics
### ① What you hold: a linear contract with a running cost

A **perpetual future** is an agreement between a long and a short to exchange the change in the underlying's price, for as long as either wants to keep it, with a periodic funding payment and daily (in fact continuous) margining. For the common **linear** contract, quoted and settled in dollars or a dollar stablecoin such as USDT or USDC:

$$
\Pi = (P_1 - P_0) \times Q \;-\; \sum_k f_k \times N_k
$$

where \(P_0\) is the entry price, \(P_1\) the exit (or current mark) price, \(Q\) the position size in coins (negative for a short), \(f_k\) the funding rate charged at each funding time \(k\) (positive means longs pay), and \(N_k\) the position's notional value at that time.

> [!EXAMPLE] Kai's 10× long, three days later
> Size \(Q = 0.1\) BTC at \(P_0 = 100{,}000\), notional \(N = \$10{,}000\). BTC rises to $105,000 over three days while funding sits at +0.01% every 8 hours (the common default, see [[funding-rate]]).
> - Price P&L: \((105{,}000 - 100{,}000) \times 0.1 = +\$500\)
> - Funding: nine payments of about \(0.0001 \times 10{,}000 = \$1\) each \(\approx -\$9\)
> - Total \(\approx +\$491\), a return of about 49% on the $1,000 margin.
>
> Funding is charged on the $10,000 notional, not the $1,000 margin, so at 10× it costs ten times more *as a share of your money*.

Two things are **not** in that formula. There is no \(\max(\cdot, 0)\): the payoff never kinks, so there is no convexity and no time value, and nothing like theta ([[theta]]) quietly eats the position. And there is no premium: both sides post margin, and both sides can lose more than they expected.

### ② Linear and inverse contracts

The first perp, and many crypto contracts since, were **inverse** (coin-margined): the contract has a fixed face value in dollars, but margin and profit are paid in the coin itself. For a long with dollar face value \(N\):

$$
\Pi_{\text{BTC}} = N\left(\frac{1}{P_0} - \frac{1}{P_1}\right)
$$

where \(\Pi_{\text{BTC}}\) is the profit measured in bitcoin, \(N\) the face value in dollars, \(P_0\) and \(P_1\) the entry and exit prices. The \(1/P\) makes the payoff a curve when you count in coins.

> [!EXAMPLE] A $10,000 inverse long
> From \(P_0 = 100{,}000\):
> - to 110,000: \(10{,}000\left(\tfrac{1}{100{,}000} - \tfrac{1}{110{,}000}\right) = +0.00909\) BTC, worth \(0.00909 \times 110{,}000 = +\$1{,}000\);
> - to 90,000: \(10{,}000\left(\tfrac{1}{100{,}000} - \tfrac{1}{90{,}000}\right) = -0.01111\) BTC, worth \(-0.01111 \times 90{,}000 = -\$1{,}000\).
>
> In dollars at the exit price the result is the same ±$1,000 a linear contract would pay. In bitcoin it is lopsided: the loss is 22% bigger than the gain, because a falling price makes each dollar of loss cost more coins.

<figure>
<svg viewBox="0 0 640 300" role="img" aria-label="Profit of an inverse long measured in bitcoin is a concave curve in the bitcoin price">
<defs><marker id="what-is-perp-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="60" y1="140" x2="615" y2="140" class="fx-axis" marker-end="url(#what-is-perp-ah2)"/>
<line x1="60" y1="275" x2="60" y2="20" class="fx-axis"/>
<polyline points="60,212 600,32" class="fx-line-muted fx-dash"/>
<polyline points="60,260 87,236.9 114,217.1 141,200 168,185 195,171.8 222,160 249,149.5 276,140 303,131.4 330,123.6 357,116.5 384,110 411,104 438,98.5 465,93.3 492,88.6 519,84.1 546,80 573,76.1 600,72.5" class="fx-line-btc"/>
<circle cx="330" cy="123.6" r="5" class="fx-fill-green"/>
<circle cx="222" cy="160" r="5" class="fx-fill-red"/>
<line x1="276" y1="130" x2="276" y2="150" class="fx-line"/>
<text x="322" y="100" text-anchor="end" class="fx-t-ok">110k: +0.00909 BTC</text>
<text x="232" y="178" class="fx-t-bad">90k: −0.01111 BTC</text>
<text x="276" y="162" text-anchor="middle" class="fx-t-sm">100k</text>
<text x="66" y="276" class="fx-t-sm">60k</text>
<text x="590" y="160" text-anchor="end" class="fx-t-sm">160k</text>
<text x="615" y="130" text-anchor="end" class="fx-t-sm">BTC price</text>
<text x="66" y="30" class="fx-t-sm">P&amp;L in BTC</text>
<text x="90" y="62" class="fx-t-sm">dashed: a straight line in BTC</text>
<text x="90" y="80" class="fx-t-btc">solid: inverse long, N = $10,000</text>
</svg>
<figcaption>Figure 2 · An inverse long's profit counted in bitcoin bends downward: gains in coins shrink as the price rises and losses grow as it falls. Counted in dollars at the exit price it is a straight line again; the curve comes from the unit, not from any optionality.</figcaption>
</figure>

The bigger practical difference is the **collateral**. On an inverse contract your margin is bitcoin, so your account is long bitcoin *before* you open any position. A 1× inverse long therefore behaves like 2× exposure in dollar terms, and a 1× inverse *short* cancels the collateral's exposure: the account's dollar value stops moving with BTC. That "coin collateral + 1× short" combination is the building block of the delta-neutral designs discussed in [[basis-trades]].

<figure>
<svg viewBox="0 0 640 290" role="img" aria-label="Dollar equity of three accounts that start with 10,000 dollars as the bitcoin price moves">
<line x1="60" y1="260" x2="610" y2="260" class="fx-axis"/>
<line x1="60" y1="260" x2="60" y2="30" class="fx-axis"/>
<line x1="60" y1="150" x2="600" y2="150" class="fx-grid"/>
<polyline points="60,205 600,95" class="fx-line-hl"/>
<polyline points="60,260 600,40" class="fx-line-btc"/>
<polyline points="60,150 600,150" class="fx-line-ok fx-dash"/>
<circle cx="330" cy="150" r="5" class="fx-fill-ink"/>
<line x1="80" y1="36" x2="104" y2="36" class="fx-line-btc"/>
<text x="110" y="40" class="fx-t-btc">BTC collateral + 1× inverse long</text>
<line x1="80" y1="56" x2="104" y2="56" class="fx-line-hl"/>
<text x="110" y="60" class="fx-t-hl">USDT collateral + 1× linear long</text>
<line x1="80" y1="76" x2="104" y2="76" class="fx-line-ok fx-dash"/>
<text x="110" y="80" class="fx-t-ok">BTC collateral + 1× inverse short</text>
<text x="330" y="280" text-anchor="middle" class="fx-t-sm">100k</text>
<text x="60" y="280" class="fx-t-sm">50k</text>
<text x="600" y="280" text-anchor="end" class="fx-t-sm">150k: BTC price</text>
<text x="54" y="154" text-anchor="end" class="fx-t-sm">10k</text>
<text x="54" y="44" text-anchor="end" class="fx-t-sm">20k</text>
<text x="54" y="264" text-anchor="end" class="fx-t-sm">0</text>
<text x="66" y="20" class="fx-t-sm">account value in USD</text>
</svg>
<figcaption>Figure 3 · Three accounts start with $10,000 at an illustrative $100,000. With stablecoin collateral a 1× long moves $1 for every $10 in BTC. With bitcoin collateral the same "1×" long is doubly long (the collateral and the contract), and a 1× short makes the account's dollar value flat.</figcaption>
</figure>

### ③ Leverage: the same line, a shorter fuse

**Leverage** is notional divided by margin: \(L = N / M\). It does not change the shape of the payoff; it changes how much of *your* money each price move represents:

$$
\text{return on margin} \approx L \times \frac{P_1 - P_0}{P_0}
$$

where \(L\) is the leverage and the fraction is the price return. At 10×, a 1% move is 10% of your margin; at 100×, a 1% move is all of it. Venues liquidate before the margin reaches zero, at a **maintenance margin** level \(m\). With the course's simplified isolated-margin formula, a long is liquidated near \(P_0(1 - 1/L + m)\):

Entry at an illustrative $100,000, maintenance margin \(m = 0.5\%\):

| Leverage | Adverse move that wipes the margin | Long liquidates near | Short liquidates near |
|---|---|---|---|
| 2× | −50% | $50,500 | $149,500 |
| 5× | −20% | $80,500 | $119,500 |
| 10× | −10% | $90,500 | $109,500 |
| 20× | −5% | $95,500 | $104,500 |
| 50× | −2% | $98,500 | $101,500 |
| 100× | −1% | $99,500 | $100,500 |

At 100×, BTC only has to wobble half a percent against you. Isolated versus cross margin, fees, leverage tiers and what happens when a liquidation leaves a hole are the subject of [[margin-liquidation]] and [[insurance-adl]]; which *price* the venue watches for this test is [[mark-index-last]].

> [!WARN] Leverage turns noise into a stop-out
> BTC's illustrative implied volatility of 50% means a typical daily move of about \(0.5/\sqrt{365} \approx 2.6\%\). A 20× long, liquidated after about a 4.5% fall, sits less than two ordinary days' noise from the exit. That is a statement about arithmetic, not about where BTC is going.

### ④ Perp, dated future, spot and option side by side

Spot bitcoin is the baseline: a straight line with a delta of 1, the full price paid up front, no expiry and no running cost beyond custody. Against it:

| | Perp | Dated future (e.g. CME) | Long call |
|---|---|---|---|
| Shape | line | line | hockey stick (convex) |
| Upfront cash | margin | margin | premium |
| Worst case | the margin, via liquidation | the margin, then more calls | the premium |
| Tie to spot | funding every few hours | convergence at expiry | expiry payoff |
| Running cost | funding, cash each interval | basis, via convergence and rolls | theta |
| Expiry | none | yes, roll | yes |

The perp and the dated future charge the same economic thing, the cost of holding leveraged exposure, in two different ways: the dated future through its price converging, the perp through cash payments. When arbitrage works, annualised funding and the annualised futures basis tend to sit close together, which is why traders compare them directly ([[basis-trades]]).

### ⑤ From BitMEX to the CFTC: state of play

> [!HISTORY] The perp's birth, and its inventor's exit
> BitMEX launched XBTUSD, the first perpetual swap, on 13 May 2016, with up to 100× leverage and funding in place of an expiry. Ten years later, on 4 September 2026, BitMEX announced the decision to close the exchange; its remaining contracts became reduce-only, and XBTUSD was delisted and settled on 16 September 2026. The venue that invented the perp shut down in 2026; the product lives on across dozens of others.

Why did perps win? One contract per asset instead of liquidity split across expiries; no roll; trading around the clock; small margin; and the funding mechanism, which lets the market itself set the cost of leverage every few hours.

> [!FACT] Where perps trade (as of September 2026)
> - Centralised exchanges still dominate: CoinGlass counted about $18.6 trillion of crypto derivatives volume in Q1 2026, about $4.9 trillion of it on Binance (secondary data).
> - On-chain: Hyperliquid, an exchange running its own order book on its own chain, had about 58% of decentralised perp volume in the 30 days to 28 August 2026 and a record open interest of about $14.3 billion on 8 September 2026 (as reported).
> - United States: Coinbase Derivatives began offering CFTC-regulated "perpetual-style" futures on 21 July 2025 (a nominal five-year expiry, funding every 12 hours as reported, up to 10×). On 29 May 2026 the CFTC issued a policy statement on listing perpetual contracts, together with an order approving a cash-settled bitcoin perpetual listed by a regulated exchange as a futures contract (reportedly Kalshi's).

The speed at which leverage unwinds is the other side of this story. On 10–11 October 2025, more than $19 billion of leveraged crypto positions were liquidated in about a day, the largest such event recorded (as reported). How venues decide who is liquidated, at which price, and who pays when a liquidation cannot cover the loss, fills the rest of this stage.

## @analogy
A perp is like **renting a bike on an open-ended contract** instead of reserving one for a fixed date.

A dated future is the reservation: you agree today on a price for a fixed pickup day, and the price of that reservation drifts toward the ordinary shop price as the day approaches. When the day comes, if you still want a bike, you book the next reservation and pay again.

The perp is the rolling rental: no end date, you keep the bike as long as you like, but every few hours a small fee changes hands. When everyone wants bikes, renters pay the owners; when nobody does, owners pay renters to take them. That fee is funding, and it keeps the rental price close to the shop price.

Leverage is the deposit. Put down one tenth of the bike's value and the shop will hold you to it: if the bike's resale value falls by about that tenth, the shop takes the bike back immediately and keeps your deposit, even if the price recovers an hour later.

Where it breaks: renting a bike does not make you richer if bikes get more expensive. A perp is a pure bet on the price line; there is no bike to ride, only the line and the fee.

## @misconceptions
- **"No expiry means I can always wait for the price to come back."** — The calendar deadline is gone, but the margin deadline is not. A leveraged position is closed at the liquidation price, however briefly the price touches it.
- **"A perp is a kind of option with no premium."** — There is no right and no kink. A perp is a straight-line obligation for both sides; an option buyer's loss is capped at the premium.
- **"Leverage makes a good trade better and a bad trade only a little worse."** — Leverage multiplies both directions equally. At 10×, a 10% adverse move removes the whole margin.
- **"A 1× position on a coin-margined contract has no leverage."** — With bitcoin as collateral, the collateral is already long bitcoin; a 1× inverse long is about 2× exposed in dollar terms.
- **"Perps are only an offshore product."** — As of 2026, CFTC-regulated perpetual-style futures trade in the US (Coinbase from July 2025), and in May 2026 the CFTC set out a framework for listing perpetual contracts.

## @takeaways
- A perpetual future is a linear contract with no expiry: P&L \((P_1 - P_0) \times Q\) minus funding.
- Funding every few hours, not convergence at expiry, keeps the perp near the spot index.
- Inverse (coin-margined) contracts pay \(N(1/P_0 - 1/P_1)\) in coin and make your collateral part of the bet.
- Leverage leaves the line's shape alone but shortens the fuse: a 10× long from $100,000 is liquidated near $90,500 under the course's assumptions.
- BitMEX invented the perp in 2016 and closed in September 2026; perps now trade on large centralised venues, on-chain venues and, since 2025–2026, under US regulation.

## @quiz
1. Kai opens a 10× long BTC perp with $1,000 of margin at an illustrative $100,000. BTC rises 3%. Ignoring funding and fees, what happens to Kai's margin?
   - [ ] It rises 3%, to $1,030
   - [ ] It rises 10%, to $1,100
   - [x] It rises 30%, to $1,300
   - [ ] Nothing until the contract expires
   > Notional is $10,000 (0.1 BTC); a $3,000 move in BTC is \(0.1 \times 3{,}000 = \$300\), which is 30% of $1,000. There is no expiry to wait for.
2. What anchors a perpetual future to the spot price?
   - [ ] Convergence on its quarterly expiry date
   - [x] Periodic funding payments between longs and shorts
   - [ ] The exchange buying or selling spot bitcoin itself
   - [ ] An embedded option that pays the difference
   > With no expiry, convergence cannot do the job. Funding makes the side pushing the perp away from the index pay the other side until the gap closes.
3. A $10,000 inverse (coin-margined) long is opened at $100,000 and closed at $90,000. What is the P&L in bitcoin?
   - [ ] −0.01000 BTC
   - [ ] −0.00909 BTC
   - [ ] +0.01111 BTC
   - [x] −0.01111 BTC
   > \(10{,}000\left(\tfrac{1}{100{,}000} - \tfrac{1}{90{,}000}\right) = -0.01111\) BTC, about −$1,000 at $90,000. −0.00909 is the size of the *gain* for a move up to 110,000.
4. Which statement about a perp and a long call bought with the same $1,000 is correct?
   - [ ] Both have a convex payoff; the perp's is just steeper
   - [x] The perp's loss can arrive on a brief dip through the liquidation price; the call's loss is capped at the premium and cannot be forced early
   - [ ] The call can be liquidated if implied volatility falls
   - [ ] The perp has theta, the call has funding
   > The perp is a margined straight line; the call is a paid-for right with a hockey-stick payoff. Their running costs are funding and theta respectively.
5. Why does a 1× inverse short with bitcoin collateral leave the account's dollar value nearly unchanged when BTC moves?
   - [ ] Because the funding payments exactly offset price moves
   - [ ] Because inverse contracts do not move with the price
   - [ ] Because 1× positions cannot be liquidated
   - [x] Because the short contract's gains and losses cancel the dollar-value changes of the bitcoin collateral
   > Bitcoin collateral is long BTC; the 1× short is short the same dollar amount. Together they are close to flat in dollars, the basic "synthetic dollar" building block.

## @further
- [BitMEX: announcing the perpetual XBTUSD leveraged swap (2016)](https://blog.bitmex.com/announcing-the-launch-of-the-perpetual-xbtusd-leveraged-swap/) — the original launch post of the first perp.
- [CFTC press release on the perpetual contracts framework (May 2026)](https://www.cftc.gov/PressRoom/PressReleases/pr-9242-26) — the US regulator's policy statement and order.
- [Coinbase: perpetual futures have arrived in the US](https://www.coinbase.com/blog/perpetual-futures-have-arrived-in-the-us) — how the CFTC-regulated perpetual-style contract works.
- [Hyperliquid docs](https://hyperliquid.gitbook.io/hyperliquid-docs) — contract, margin and funding rules of the largest on-chain perp venue.
- [Satoshi Path](https://evidex-cloud.github.io/nextdawn-satoshi-path/) — the sister course on bitcoin itself, for readers who want the underlying before the derivative.

## @next
Funding is the perp's tether, and it is computed from a price gap. But a perp screen shows three prices at once: the index, the mark and the last trade. Which one decides your P&L, your liquidation and your funding? The next lesson sorts them out.
