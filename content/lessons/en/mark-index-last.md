---
id: mark-index-last
prereqs: market-makers, what-is-perp
demo: mark-index-last
---

# Index, Mark & Last Price: Which One Counts

## @hook
A perp screen shows three prices that usually agree to within a few dollars. When they don't, it matters which one the venue listens to. Your profit and loss and your liquidation are normally computed from the **mark price**, not from the last trade on the chart, which is why a wick can print below your liquidation price while you survive, and why you can be liquidated at a price you never saw traded.

## @bridge
[[what-is-perp]] showed that a 10× long from an illustrative $100,000 is liquidated near $90,500. But "the price" that must reach $90,500 is not one number. A perp venue keeps three: the **index** (spot bitcoin across several exchanges), the **mark** (the venue's fair value of the perp) and the **last** traded price on its own order book. This lesson explains how each is built, which one drives what, and why. It builds Idea ④ (risk): the rules that decide *when* leverage bites. It also sets up [[funding-rate]], which is computed from the gap between the perp and the index, and uses what [[market-makers]] taught about thin order books.

## @intuition
Picture 03:00 on a quiet Sunday. Kai holds the 10× long BTC perp from the last lesson: entry at an illustrative $100,000, liquidation price about $90,500.

Someone sends a large market sell order into the perp's order book at a moment when few buyers are resting there. The order eats through the bids, and for about one second the **last traded price** prints **$89,800**. On the chart this shows up as a long thin candle wick, well below Kai's liquidation price.

Kai wakes up, sees the wick and expects the worst. The position is still open. Why?

- The **index price** is the price of *spot* bitcoin, averaged across several spot exchanges. No spot exchange traded at $89,800; the index stayed at about **$100,000**.
- The **mark price** is the venue's estimate of what the perp is fairly worth: the index plus a *smoothed* version of the perp's usual premium over the index. One second of chaos barely moves a five-minute average: the mark dipped from about $100,060 to about **$100,026**.
- The venue decides liquidations with the **mark**, and \(100{,}026 > 90{,}500\). Kai survives.

<figure>
<svg viewBox="0 0 700 300" role="img" aria-label="Index, mark and last price during a one-second wick in the last traded price">
<text x="20" y="22" class="fx-t-b">Zoomed in: index and mark</text>
<line x1="60" y1="110" x2="600" y2="110" class="fx-axis"/>
<line x1="60" y1="96" x2="600" y2="96" class="fx-line-muted"/>
<polyline points="60,54 330,54 339,77.8 600,77.8" class="fx-line-hl"/>
<text x="604" y="100" class="fx-t-sm">index 100,000</text>
<text x="70" y="48" class="fx-t-hl">mark 100,060</text>
<text x="400" y="72" class="fx-t-hl">mark ≈ 100,026 after the wick</text>
<text x="20" y="140" class="fx-t-b">Full range: last traded price</text>
<line x1="60" y1="285" x2="600" y2="285" class="fx-axis"/>
<polyline points="60,155 150,156 240,154 330,155 333,273 336,273 339,156 420,155 510,156 600,155" class="fx-line-btc"/>
<line x1="60" y1="265" x2="600" y2="265" class="fx-line-bad fx-dash"/>
<text x="604" y="269" class="fx-t-bad">liq 90,500</text>
<text x="324" y="252" text-anchor="end" class="fx-t-btc">last 89,800 (about one second)</text>
<text x="70" y="172" class="fx-t-sm">last ≈ mark ≈ 100,060 most of the time</text>
<text x="60" y="298" class="fx-t-sm">0 s</text>
<text x="330" y="298" text-anchor="middle" class="fx-t-sm">60 s</text>
<text x="600" y="298" text-anchor="end" class="fx-t-sm">120 s</text>
</svg>
<figcaption>Figure 1 · A one-second wick. Bottom: the last traded price plunges through Kai's liquidation line at $90,500. Top (a zoomed scale): the spot index doesn't move and the mark dips only about $34, because it averages the perp's premium over minutes. A venue that liquidates on the mark leaves Kai's position open.</figcaption>
</figure>

The same design cuts the other way. If *spot* bitcoin really falls across the major exchanges, the index falls, the mark follows it, and Kai is liquidated even if the perp's own order book was quiet and never printed $90,500. **The mark protects you from one venue's glitch, not from a real move.**

> [!THINK] The wick above had printed $89,800 on the spot exchanges too, for one second, while the perp book stayed calm. Would Kai have been liquidated?
> Predict before you open the answer.
> ---
> Probably not, if only one spot venue printed it: a median-style index ignores a single outlier. If *most* index venues printed it, the index and then the mark would have dropped, and the one-second dip could have been enough; how much depends on how often the venue samples the index and how it smooths. This is exactly why the index recipe (which venues, which weights, how outliers are dropped) is part of your risk.

We'll take it in five parts:

- **① The index price: spot, averaged so one venue can't drag it**
- **② The mark price: fair value for P&L and liquidation**
- **③ The last price: where trades and wicks happen**
- **④ Why liquidation runs on the mark**
- **⑤ Oracles, on-chain venues and state of play**

## @mechanics
### ① The index price: spot, averaged so one venue can't drag it

The **index price** is the venue's estimate of the underlying's spot price, built from several spot exchanges. It is the perp's anchor: funding measures the perp's distance from it, and the mark is built on it. Venues publish their constituent lists and weights; recipes differ, but the goal is the same: **one broken exchange must not be able to drag the index**. Two common tools:

$$
I = \sum_{i \in \text{valid}} w_i\,P_i \qquad \text{or} \qquad I = \operatorname{median}(P_1, \dots, P_n)
$$

where \(P_i\) is the spot price on exchange \(i\), \(w_i\) its weight (the weights of the valid venues add up to 1), and "valid" means the venue passed checks such as a recent update and a price within some distance of the others.

> [!EXAMPLE] One broken venue in a five-venue index (illustrative)
> Spot quotes: 100,020, 99,980, 100,050, 100,000 and a malfunctioning venue at 93,000.
> - Plain mean: \((100{,}020 + 99{,}980 + 100{,}050 + 100{,}000 + 93{,}000)/5 = 98{,}610\), dragged down $1,390 by one venue.
> - Median: sort and take the middle value: **100,000**.
> - Trimmed mean (drop venues more than 1% from the median, average the rest): \(400{,}050/4 = 100{,}012.5\).
>
> A plain average would have moved every trader's mark by more than a percent because of one exchange's bug. A median or a trimmed mean shrugs it off.

::demo[mark-index-last-index]

### ② The mark price: fair value for P&L and liquidation

The **mark price** is the price the venue uses to value open positions: your unrealised P&L, your margin ratio and the liquidation test all use it. It must track the perp's fair value, which is the index *plus* whatever premium the perp normally trades at, while ignoring momentary noise. A representative design:

$$
\begin{gathered}
M_t = I_t + \bar b_t, \
\bar b_t = \text{average over recent minutes of } \left(P^{\text{perp}}_{\text{mid}} - I\right)
\end{gathered}
$$

where \(M_t\) is the mark, \(I_t\) the index, and \(\bar b_t\) a moving average (or exponentially weighted average) of the perp's mid-price premium over the index. Venues differ in the window, in whether they use mid prices or "impact" prices (the average fill for a set order size), and in extra safeguards; always read the contract specification.

> [!EXAMPLE] How much does a one-second wick move the mark?
> Say the venue averages the premium over 5 minutes, sampled every second (300 samples), and the perp has been trading $60 above the index, so \(M = 100{,}000 + 60 = 100{,}060\). For one second the perp prints $89,800, a premium of \(89{,}800 - 100{,}000 = -10{,}200\). The new average premium:
> $$
> \bar b = \frac{299 \times 60 + (-10{,}200)}{300} = \frac{17{,}940 - 10{,}200}{300} = 25.8
> $$
> So \(M \approx 100{,}026\): the wick moved the last price by $10,260 and the mark by $34.

> [!DEEP] A median-of-three safeguard
> One design that several venues document picks the median of three candidates: \(P_1 = I\,(1 + f \cdot \tau)\), the index grossed up by the current funding rate \(f\) for the fraction \(\tau\) of the interval left; \(P_2 = I + \bar b\), the smoothed-premium mark above; and the last price. With \(I = 100{,}000\), \(f = 0.01\%\), \(\tau = 0.5\): \(P_1 = 100{,}005\), \(P_2 = 100{,}060\), last \(= 89{,}800\), so the mark is \(\operatorname{median} = 100{,}005\). Any single candidate going wild is outvoted by the other two. Exact formulas are venue-specific and change; treat this as an example of the idea, not a rule.

### ③ The last price: where trades and wicks happen

The **last price** is simply the most recent trade on the perp's own order book. It is what candle charts usually draw, and it is the world your orders live in: **your fills happen at book prices**, and on many platforms you can choose whether a stop order is triggered by the last price or by the mark.

The last price can wick because an order book is thin at the edges, as [[market-makers]] explained: market makers quote a limited size at each level, and a large market order walks down the levels until it is filled.

> [!EXAMPLE] A market sell walks a thin book (illustrative)
> Bids resting in the perp book: 2 BTC at 99,990, 3 at 99,950, 3 at 99,800, 5 at 99,000, 5 at 97,000, 5 at 93,000, 10 at 89,800. A 30-BTC market sell fills:
> $$
> \begin{aligned}
> \bar P_{\text{fill}} &= \tfrac{1}{30}\big[\,2(99{,}990) + 3(99{,}950) + 3(99{,}800) + 5(99{,}000) \
> &\qquad + 5(97{,}000) + 5(93{,}000) + 7(89{,}800)\,\big] \
> &= 2{,}872{,}830 / 30 = 95{,}761
> \end{aligned}
> $$
> The seller's average price is $95,761, but the **last** trade prints $89,800. About $2.9 million of selling has written a wick more than 10% long into the chart, while the spot index hasn't moved.

| Price | Built from | Used for | One bad venue or trade |
|---|---|---|---|
| **Index** | spot on several exchanges | anchor for mark and funding | filtered out |
| **Mark** | index + smoothed premium | P&L, margin ratio, liquidation | a small dent |
| **Last** | latest trade on this book | charts, fills, some stops | a wick |

### ④ Why liquidation runs on the mark

Imagine a venue that liquidated on the **last** price. Liquidation prices cluster at round leverages: from $100,000, 10× longs near $90,500, 20× longs near $95,500. A trader with $2.9 million could sell into a thin book, push the last price through those clusters, trigger forced selling from every liquidated position (which pushes the price further), and buy back cheaply at the bottom. That is a **liquidation hunt**, and on a last-price venue it costs little.

With liquidation on the mark, the same attacker has to move the **index**: several independent spot exchanges, for long enough to shift a smoothed average. That is far more expensive, which is the point.

<figure>
<svg viewBox="0 0 660 260" role="img" aria-label="How index, mark and last are built and what each one is used for">
<defs><marker id="mark-index-last-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="10" y="20" width="130" height="110" rx="8" class="fx-box2"/>
<text x="75" y="42" text-anchor="middle" class="fx-t-b">spot venues</text>
<text x="75" y="64" text-anchor="middle" class="fx-t-sm">A 100,020 · B 99,980</text>
<text x="75" y="82" text-anchor="middle" class="fx-t-sm">C 100,050 · D 100,000</text>
<text x="75" y="100" text-anchor="middle" class="fx-t-bad">E 93,000 (outlier)</text>
<rect x="190" y="45" width="120" height="60" rx="8" class="fx-box"/>
<text x="250" y="70" text-anchor="middle" class="fx-t-b">index I</text>
<text x="250" y="90" text-anchor="middle" class="fx-t-sm">median / filtered</text>
<rect x="360" y="45" width="144" height="60" rx="8" class="fx-hl"/>
<text x="432" y="70" text-anchor="middle" class="fx-t-b">mark M</text>
<text x="432" y="90" text-anchor="middle" class="fx-t-sm">I + smoothed premium</text>
<rect x="530" y="20" width="120" height="50" rx="8" class="fx-box"/>
<text x="590" y="42" text-anchor="middle" class="fx-t">unrealised P&amp;L</text>
<text x="590" y="60" text-anchor="middle" class="fx-t-sm">margin ratio</text>
<rect x="530" y="80" width="120" height="40" rx="8" class="fx-bad"/>
<text x="590" y="105" text-anchor="middle" class="fx-t-b">liquidation test</text>
<rect x="190" y="170" width="120" height="60" rx="8" class="fx-box2"/>
<text x="250" y="195" text-anchor="middle" class="fx-t-b">perp order book</text>
<text x="250" y="215" text-anchor="middle" class="fx-t-sm">bids and asks</text>
<rect x="360" y="170" width="130" height="60" rx="8" class="fx-btc"/>
<text x="425" y="195" text-anchor="middle" class="fx-t-b">last price</text>
<text x="425" y="215" text-anchor="middle" class="fx-t-sm">can wick</text>
<rect x="530" y="170" width="120" height="60" rx="8" class="fx-box"/>
<text x="590" y="192" text-anchor="middle" class="fx-t">charts, your fills</text>
<text x="590" y="212" text-anchor="middle" class="fx-t-sm">some stop triggers</text>
<line x1="140" y1="75" x2="186" y2="75" class="fx-line" marker-end="url(#mark-index-last-ah)"/>
<line x1="310" y1="75" x2="356" y2="75" class="fx-line" marker-end="url(#mark-index-last-ah)"/>
<line x1="504" y1="65" x2="526" y2="50" class="fx-line" marker-end="url(#mark-index-last-ah)"/>
<line x1="504" y1="88" x2="526" y2="97" class="fx-line" marker-end="url(#mark-index-last-ah)"/>
<line x1="310" y1="200" x2="356" y2="200" class="fx-line" marker-end="url(#mark-index-last-ah)"/>
<line x1="490" y1="200" x2="526" y2="200" class="fx-line" marker-end="url(#mark-index-last-ah)"/>
<line x1="280" y1="170" x2="400" y2="108" class="fx-line fx-dash" marker-end="url(#mark-index-last-ah)"/>
<text x="336" y="150" class="fx-t-sm">premium, smoothed</text>
<text x="10" y="252" class="fx-t-sm">funding is computed from the same premium: perp versus index</text>
</svg>
<figcaption>Figure 2 · The plumbing. The index filters spot venues (E's bad price is dropped); the mark adds the perp's smoothed premium to the index and drives P&amp;L and liquidation; the last price comes from the perp's own book and drives charts and fills. The premium between the perp and the index also feeds funding.</figcaption>
</figure>

Two consequences traders often miss:

- **You can be liquidated at a price you never saw.** If the index falls (a real move on spot), the mark falls with it, and the liquidation test is failed even if the perp's own book never traded at your liquidation price.
- **The liquidation fill is a real trade.** Once the mark crosses the line, the venue closes your position in the order book, at book prices. In a fast market the fill can be worse than the mark; who absorbs that gap is [[insurance-adl]], and how much margin is left when it happens is [[margin-liquidation]].

> [!KAI] Kai reads the rulebook, not the candle
> After the Sunday scare, Kai looks up two lines in the venue's contract specification. First, which price decides liquidation (here: the mark, built from a filtered index). Second, which price triggers Kai's stop order (on Kai's venue, a setting: last or mark). A candle's low is usually the *last* price, so it answers neither question on its own.

### ⑤ Oracles, on-chain venues and state of play

A centralised venue computes its index on its own servers. An **on-chain** venue has to bring outside prices onto a blockchain first, through an **oracle** (a service or set of validators that publishes prices on-chain). That adds two risks: **timing** (an oracle updates every few seconds, not continuously, so there are gaps) and **source quality** (if the oracle reads a thin spot market, manipulating that market manipulates the perp). Several on-chain protocols have lost money over the years to traders who pushed a thinly traded token's spot price, and with it the oracle, for a few minutes.

> [!FACT] State of play (as of September 2026)
> Hyperliquid, the largest on-chain perp venue by share of decentralised perp volume, runs a central limit order book on its own chain, backed by a community vault (HLP) and, as a last resort, auto-deleveraging. In 2026 perps on real-world assets (stocks and commodities, listed through its HIP-3 framework) became its largest category (as reported), which raises a fresh index question: what should the index be when the underlying's home market is closed for the weekend? Venues answer it differently, and their answers are part of the product.

The three prices come back in almost every lesson that follows: funding is computed from the perp-versus-index premium ([[funding-rate]]), liquidation from the mark ([[margin-liquidation]]), and losses beyond the margin are settled at book prices ([[insurance-adl]]).

## @analogy
Think of selling a house with a mortgage.

The **index** is the average price of comparable houses sold across several agencies this month. One agency's typo ("sold for $1") doesn't change it, because you'd throw out the obviously wrong listing.

The **mark** is the bank's appraisal: the comparable-sales average adjusted for this house's usual premium, updated steadily rather than on every rumour. The bank uses the appraisal to decide whether your loan is still safely covered. If it isn't, the bank forecloses.

The **last** is whatever a single buyer shouted at the open house this afternoon. It might be sensible; it might be a lowball from someone hoping to scare you.

A bank that foreclosed on the shout would invite people to shout low prices. A bank that forecloses on the appraisal only acts when the whole neighbourhood's prices have really fallen.

Where it breaks: a house appraisal changes monthly, a mark every second; and when the bank does foreclose on a perp, it sells the "house" immediately at whatever the order book pays, which may be below the appraisal.

## @misconceptions
- **"The candle's low is where I get liquidated."** — Candles usually show the last price. Liquidation is normally tested on the mark, which can stay well above a wick.
- **"If the chart never touched my liquidation price, I can't have been liquidated."** — If spot fell across the index venues, the mark followed and triggered it, even without a trade at that price on the perp book.
- **"Mark, index and last are three names for the same price."** — They are built from different data (spot basket, smoothed perp premium, latest perp trade) and do different jobs.
- **"The mark protects me from any sudden drop."** — It protects against one venue's glitch or a brief wick in the perp book. A real, broad move in spot moves the index and the mark with it.
- **"On-chain venues can't be manipulated because everything is transparent."** — They depend on oracles; if an oracle reads a thin market, pushing that market moves the perp's reference price.

## @takeaways
- The index is an outlier-resistant average of spot prices (medians or outlier filters stop one bad venue from dragging it).
- The mark is index plus a smoothed perp premium; venues use it for unrealised P&L, margin ratio and the liquidation test.
- The last price is the latest perp trade: it draws the candles and fills your orders, and it can wick in a thin book.
- Liquidating on the mark makes wick hunting expensive, but a real move in spot still liquidates you, and the liquidation fill happens at book prices.
- On-chain venues add oracle timing and source risk; always read which price your venue uses for what.

## @quiz
1. Kai's 10× long has a liquidation price of $90,500. The last price wicks to $89,800 for one second; the index stays at $100,000 and the mark at about $100,026. On a venue that liquidates on the mark:
   - [ ] Kai is liquidated, because the chart went below $90,500
   - [x] Kai's position stays open, because the mark never crossed $90,500
   - [ ] Kai is liquidated at $89,800 and the insurance fund pays the difference
   - [ ] The trade is cancelled and Kai's entry is reset
   > The liquidation test uses the mark, which barely moved. The wick is a last-price event on the perp book only.
2. Five spot venues quote 100,020, 99,980, 100,050, 100,000 and 93,000. Which index recipe is least affected by the fifth venue?
   - [ ] The simple mean, about 98,610
   - [ ] The last trade on the perp book
   - [x] The median, 100,000
   - [ ] The lowest quote, 93,000
   > The median ignores a single outlier completely; the mean is dragged down by $1,390.
3. Why do most venues liquidate on the mark rather than the last price?
   - [ ] Because the mark is always higher than the last price
   - [ ] Because the last price is not published
   - [ ] Because the mark includes the trader's entry price
   - [x] Because moving the mark requires moving spot across several venues, which makes liquidation hunts far more expensive
   > A thin perp book can be pushed with little money; the index behind the mark cannot, at least not cheaply.
4. Spot bitcoin falls 11% across all the major exchanges over ten minutes, but the perp's own order book happens to stay above $91,000. Kai's 10× long (liquidation $90,500) is on a mark-based venue. What happens?
   - [x] Kai is very likely liquidated, because the index and the mark fall with spot
   - [ ] Kai is safe, because the perp's last price never reached $90,500
   - [ ] Kai is safe, because the mark is smoothed over a day
   - [ ] Funding automatically covers the loss
   > The mark follows the index. It filters glitches, not real moves; you can be liquidated without seeing your price traded on the perp book.
5. A 30-BTC market sell walks a thin book and the last trade prints $89,800, while the seller's average fill is $95,761. Which statement is correct?
   - [ ] The index must now be near $89,800
   - [x] The wick reflects the depth of the order book, not a change in bitcoin's spot value
   - [ ] The mark must now equal the average fill of $95,761
   - [ ] Every 10× long on the venue has been liquidated
   > A market order eats levels until filled; the last print is the deepest level touched. The spot index is unaffected, and a smoothed mark moves only slightly.

## @further
- [Binance: what are mark price and index price?](https://www.binance.com/en/support/faq/how-to-mark-price-and-index-price-360033525071) — one large venue's own description of its index and mark recipe.
- [Hyperliquid docs](https://hyperliquid.gitbook.io/hyperliquid-docs) — how an on-chain venue sources oracle prices and computes its mark.
- [Order book (Wikipedia)](https://en.wikipedia.org/wiki/Order_book) — why market orders walk the book and leave wicks.
- [New Finance Path](https://evidex-cloud.github.io/droplet-labs-finance-path/) — the sister course's lessons on crypto market structure.

## @next
The mark is the index plus the perp's premium. When that premium grows, when everyone wants to be long, something has to push it back. The next lesson follows the money: funding, the tether that ties perps to spot.
