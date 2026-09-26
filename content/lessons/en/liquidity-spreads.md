---
id: liquidity-spreads
prereqs: option-chain, contract-specs
demo: liquidity-spreads
---

# Bid-Ask, Volume & Open Interest: Reading Liquidity

## @hook
Two options can have exactly the same fair value and wildly different costs to trade. The bid-ask spread is a toll you pay on the way in and again on the way out, and on a thin contract it can be bigger than the whole move you are betting on. Three numbers on the chain tell you how big the toll is.

## @bridge
In [[option-chain]] every contract showed two prices, a bid and an ask. This lesson turns that gap into dollars, and adds the chain's two other liquidity readings: **volume** and **open interest**. It builds Idea ④ (risk): before any view on direction or volatility can pay, it has to beat the cost of getting in and out, and that cost is decided by liquidity. The tools you learn here come back when you place orders ([[orders]]) and when we study the market makers who set these quotes ([[market-makers]]).

## @intuition
Kai is curious about a second stock, QRS: also $100, also 20% implied volatility, also no dividend. On paper its 30-day 100 call is worth exactly what XYZ's is, $2.45. But QRS is a small company that few people trade options on. Here are the two quotes side by side (both fictional, for illustration):

<figure>
<svg viewBox="0 0 640 290" role="img" aria-label="Same fair value, very different spreads: XYZ versus QRS">
<line x1="70" y1="25" x2="70" y2="255" class="fx-axis"/>
<text x="62" y="54" text-anchor="end" class="fx-t-sm">2.80</text>
<text x="62" y="141" text-anchor="end" class="fx-t-sm">2.45</text>
<text x="62" y="229" text-anchor="end" class="fx-t-sm">2.10</text>
<line x1="70" y1="137.5" x2="600" y2="137.5" class="fx-line-muted fx-dash"/>
<text x="530" y="131" class="fx-t-sm">fair value (mid)</text><text x="530" y="153" class="fx-t-sm">2.45</text>
<rect x="140" y="130" width="120" height="15" rx="3" class="fx-bad"/>
<text x="200" y="120" text-anchor="middle" class="fx-t-b">XYZ 100 call</text>
<text x="275" y="134" class="fx-t-sm">ask 2.48</text>
<text x="275" y="150" class="fx-t-sm">bid 2.42</text>
<text x="200" y="180" text-anchor="middle" class="fx-t-ok">spread 0.06 = 2.4% of mid</text>
<text x="200" y="198" text-anchor="middle" class="fx-t-sm">round trip: $6 per contract</text>
<rect x="400" y="50" width="120" height="175" rx="3" class="fx-bad"/>
<text x="460" y="40" text-anchor="middle" class="fx-t-b">QRS 100 call</text>
<text x="530" y="56" class="fx-t-sm">ask 2.80</text>
<text x="530" y="228" class="fx-t-sm">bid 2.10</text>
<text x="460" y="252" text-anchor="middle" class="fx-t-bad">spread 0.70 = 28.6% of mid</text>
<text x="460" y="270" text-anchor="middle" class="fx-t-sm">round trip: $70 per contract</text>
<text x="20" y="284" class="fx-t-sm">red band = what you give up if you buy at the ask and sell straight back at the bid</text>
</svg>
<figcaption>Figure 1 · Same stock price, same volatility, same fair value; the only difference is how many people trade the options. On XYZ the red band is a sliver; on QRS it swallows more than a quarter of the option's value.</figcaption>
</figure>

If Kai buys one contract at the ask and changes their mind a minute later, selling at the bid, nothing has happened to the stock, yet the round trip costs \((2.48 - 2.42) \times 100 = \$6\) on XYZ and \((2.80 - 2.10) \times 100 = \$70\) on QRS. That is the **spread cost**, and it is the most important number the chain does not print for you.

> [!THINK] How far must QRS move before Kai's call just pays back its spread?
> The 100 call has a delta of about 0.53: it gains roughly 53 cents per $1 the stock rises.
> ---
> About \(0.70 / 0.534 \approx \$1.31\). The typical daily move of a 20%-volatility $100 stock is about \(\$1.05\) (\(100 \times 0.2/\sqrt{365}\)). So on QRS, Kai needs **more than a full day's typical move in the right direction** just to break even on the spread. On XYZ the same arithmetic gives \(0.06/0.534 \approx \$0.11\).

The spread is one of three liquidity readings on the chain:

- **Spread**: the price of immediacy, paid each time you cross it.
- **Volume**: how many contracts traded today; a sign of how active the contract is right now.
- **Open interest (OI)**: how many contracts are still open; a sign of how many people hold positions and may want to trade out.

We'll take it in five parts:

- **① The spread as a cost**: in cents and as a percentage of the mid
- **② Round trips and the edge you need**
- **③ Volume vs open interest**: how OI changes when people open and close
- **④ Where liquidity lives**: strikes, expiries, underlyings
- **⑤ Judging whether a contract is tradable**

## @mechanics
### ① The spread as a cost

The absolute spread (ask minus bid) tells you the cost in cents per share. To compare contracts of different prices, divide by the mid:

$$
\text{spread}\ \% = \frac{\text{ask} - \text{bid}}{\text{mid}}, \qquad \text{mid} = \frac{\text{bid} + \text{ask}}{2}
$$

where the numerator is the full gap between the two quotes and the mid is the fair-value estimate from [[option-chain]].

| XYZ 30-day contract | Bid / ask | Mid | Spread | Spread % of mid |
|---|---|---|---|---|
| 95 call (in the money) | 5.75 / 5.85 | 5.80 | 0.10 | 1.7% |
| 100 call (at the money) | 2.42 / 2.48 | 2.45 | 0.06 | 2.4% |
| 105 call | 0.70 / 0.72 | 0.71 | 0.02 | 2.8% |
| 110 call (far out of the money) | 0.13 / 0.15 | 0.14 | 0.02 | 14.3% |
| 90 put (far out of the money) | 0.05 / 0.07 | 0.06 | 0.02 | 33% |
| QRS 100 call (thin stock) | 2.10 / 2.80 | 2.45 | 0.70 | 28.6% |

Two patterns stand out. First, **cheap options are expensive to trade in percentage terms**: two cents is nothing on a $5.80 option and a third of the value of a $0.06 one, because the tick size sets a floor under the spread. Second, **the same fair value can come with very different spreads** depending on the underlying.

> [!EXAMPLE] The 110 call as a lottery ticket
> The 110 call's mid is 0.14 (\(\$14\) per contract). Buying at 0.15 and later selling at 0.13 loses \(0.02 \times 100 = \$2\), which is \(2/14 \approx 14\%\) of the position before the stock moves at all. For comparison, the 100 call's round trip costs \(6/245 \approx 2.4\%\).

### ② Round trips and the edge you need

A position you open and later close crosses the spread twice: once when you buy at the ask (half a spread above the mid) and once when you sell at the bid (half a spread below). Add a commission on each side and the total for \(n\) contracts is:

$$
\text{round-trip cost} \approx (\text{ask} - \text{bid}) \times 100 \times n \;+\; 2\,c\,n
$$

where \(c\) is the commission and fees per contract, per side. Retail commissions are often quoted around $0.50–0.65 per contract, but schedules vary widely by broker (some charge nothing, and exchange and regulatory fees add a few cents); check yours. We use \(c = \$0.65\) for illustration.

> [!EXAMPLE] Ten contracts, two stocks
> XYZ 100 call: \(0.06 \times 100 \times 10 + 2 \times 0.65 \times 10 = 60 + 13 = \$73\) on a position worth \(\$2{,}450\), about 3.0%.
> QRS 100 call: \(0.70 \times 100 \times 10 + 13 = \$713\), about 29% of the same \(\$2{,}450\).
> To recover the spread alone, the stock must move about \(\text{spread}/\Delta\): \(0.06/0.534 \approx \$0.11\) for XYZ versus \(0.70/0.534 \approx \$1.31\) for QRS.

Two refinements matter in practice. You do not always pay the full spread: a limit order at or near the mid often fills on liquid contracts, which is the subject of [[orders]]. And an option held to expiry only crosses once: if it expires worthless or is exercised, there is no exit trade. But the rule of thumb holds: **any expected edge smaller than the round-trip cost is not an edge.** Professional traders measure exactly this under the name transaction cost analysis ([[execution-tca]]).

> [!WARN] Spreads are widest when you most want to leave
> Quotes widen around the open, into earnings or other news, and in fast markets, because market makers face more uncertainty about fair value. On a thin contract the bid can simply disappear. A position that was cheap to enter on a calm afternoon can be expensive to exit in a panic.

### ③ Volume vs open interest

**Volume** counts every contract that changes hands today and resets to zero each morning. **Open interest** counts the contracts that still exist: each one has a long holder and a short writer, cleared through the OCC. It is published once a day, reflecting positions at the previous day's close, so it lags today's trading.

Whether a trade changes OI depends on whether each side is **opening** a new position or **closing** an existing one:

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="How a trade changes open interest">
<rect x="170" y="40" width="220" height="90" rx="8" class="fx-ok"/>
<rect x="400" y="40" width="220" height="90" rx="8" class="fx-box2"/>
<rect x="170" y="140" width="220" height="90" rx="8" class="fx-box2"/>
<rect x="400" y="140" width="220" height="90" rx="8" class="fx-bad"/>
<text x="280" y="28" text-anchor="middle" class="fx-t-b">seller opens (writes new)</text>
<text x="510" y="28" text-anchor="middle" class="fx-t-b">seller closes (sells a long)</text>
<text x="85" y="82" text-anchor="middle" class="fx-t-b">buyer opens</text>
<text x="85" y="100" text-anchor="middle" class="fx-t-sm">(buys to open)</text>
<text x="85" y="182" text-anchor="middle" class="fx-t-b">buyer closes</text>
<text x="85" y="200" text-anchor="middle" class="fx-t-sm">(buys back a short)</text>
<text x="280" y="78" text-anchor="middle" class="fx-t-ok">OI + 1</text>
<text x="280" y="100" text-anchor="middle" class="fx-t-sm">a new contract is created</text>
<text x="510" y="78" text-anchor="middle" class="fx-t">OI unchanged</text>
<text x="510" y="100" text-anchor="middle" class="fx-t-sm">the long passes to a new holder</text>
<text x="280" y="178" text-anchor="middle" class="fx-t">OI unchanged</text>
<text x="280" y="200" text-anchor="middle" class="fx-t-sm">the short passes to a new writer</text>
<text x="510" y="178" text-anchor="middle" class="fx-t-bad">OI − 1</text>
<text x="510" y="200" text-anchor="middle" class="fx-t-sm">a contract is extinguished</text>
<text x="320" y="252" text-anchor="middle" class="fx-t-sm">every trade adds 1 to volume per contract; only the diagonal cells change open interest</text>
</svg>
<figcaption>Figure 2 · Volume always rises with a trade; open interest rises only when both sides open, and falls only when both sides close. OI counts contracts, so it says nothing about who is “winning”: every open contract has exactly one long and one short.</figcaption>
</figure>

> [!EXAMPLE] One day on the XYZ 105 call
> Start of day: OI 12,400, volume 0. Kai **sells to open** 1 contract to a buyer who **buys to open**: OI 12,401, volume 1. A fund **sells to close** 50 calls it owned to a market maker who **buys to open**: OI unchanged, volume 51. Late in the day a trader **buys to close** 20 short calls from a holder who **sells to close**: OI 12,381, volume 71. Tomorrow morning the chain shows OI 12,381 and today's volume resets to zero.

Try the four cases yourself:

::demo[liquidity-spreads-oi]

What the two numbers tell you: high **open interest** means many holders who may need to trade out, which market makers like to serve, so quotes tend to be tighter. High **volume** today means the quote is being tested by real trades right now. A contract with large OI but zero volume is quiet but established; one with big volume and small OI is seeing new interest (or a lot of same-day in-and-out trading, as in 0DTE options ([[zero-dte]]), where OI at the close is often small by construction).

### ④ Where liquidity lives

Liquidity is concentrated along three axes.

- **Strike.** It clusters near the money and at round-number strikes. Far out-of-the-money strikes have small absolute spreads but huge percentage spreads (the 90 put above: 33%).
- **Expiry.** Near-term expiries, standard monthlies and, on the busiest underlyings, the daily and weekly expiries are the most traded. Long-dated options (LEAPS) have wider spreads in cents, though their higher prices keep the percentage moderate.
- **Underlying.** A handful of products take a large share of all trading. As of Q2 2026, SPX was about 81% of US index-option volume, SPY about 42% of ETF-option volume, and NVDA and TSLA about 9% each of single-stock option volume (Cboe, July 2026). SPY, QQQ and IWM options also quote in one-cent steps at every price, which keeps their spreads tight even on expensive contracts.

**Why does the spread exist at all?** A market maker who buys your call at the bid does not want to own it; they hedge it with stock and wait for someone else to buy it at the ask. The spread pays for three things: the cost of that hedging, the risk of holding inventory while prices move, and the danger that the trader on the other side knows something they do not (adverse selection). A thinly traded stock is costlier to hedge and more likely to surprise, so its options are quoted wider. The full story of how dealers set quotes is in [[market-makers]].

> [!FACT] A market that keeps setting records
> Through August 2026, US listed options averaged about 70.8 million contracts a day, up about 23% on 2025 (OCC, September 2026), and Cboe said in July 2026 that the year was on pace for well above 18 billion contracts. Most of that volume sits in a small number of names and expiries; thousands of listed series trade rarely or never.

### ⑤ Judging whether a contract is tradable

There is no official threshold, but traders commonly look at the same few things before committing to a contract:

1. **Spread as a percentage of the mid.** A few percent is normal for a liquid near-the-money option; double digits means the spread will dominate a short-term trade.
2. **Open interest and today's volume.** Hundreds or thousands of contracts suggest others will be there when you want out; single digits suggest you may be the only one.
3. **Quote size.** Many platforms show how many contracts are offered at the bid and ask. An order larger than the displayed size may fill partly at worse prices.
4. **The underlying's own liquidity.** Options on a thinly traded stock are hard for market makers to hedge, so they quote wider ([[market-makers]]).
5. **Timing.** Spreads are usually widest just after the open and around scheduled news.

> [!KAI] Kai's covered call on a thin stock
> Suppose Kai owned QRS instead of XYZ and wanted to sell the 30-day 105 call, fair value 0.71 on both stocks. On XYZ the bid is 0.70, so Kai collects \(\$70\) of the \(\$71\) fair value. On QRS the same call might be quoted 0.56 / 0.86: selling at the bid collects only \(\$56\), giving up about a fifth of the premium for exactly the same obligation. A limit order in the middle might do better, or might never fill.

These are descriptions of common practice, not trading advice. The point is simpler: **liquidity is part of the price.** A contract that looks attractive at its mid may be unattractive at the price you can actually trade.

## @analogy
Think of a **used-car dealer**. Every dealer quotes two prices for the same car: what they will pay you for it (the bid) and what they will sell it to you for (the ask). For a popular model, say the country's best-selling compact, there are dozens of dealers competing and thousands of cars on the road, so the gap is small: the dealer knows they can resell it tomorrow. For a rare vintage car, the dealer may have to wait months for the next buyer, so they protect themselves with a big gap. That gap is exactly the bid-ask spread, and it is widest where turnover is thinnest.

Open interest is the number of cars of that model still on the road; volume is how many changed hands at dealers today. Lots of cars on the road means lots of future sellers and buyers, which keeps dealers competitive. A day with heavy sales tells you the market for that model is active right now.

Where the analogy breaks: a car does not expire. An option's value melts toward its intrinsic value as expiry approaches, so waiting for a better buyer has a cost of its own, and in a panic every dealer can widen at once.

## @misconceptions
- **“Cheap options are cheap to trade.”** — In cents, yes; in percent, no. A two-cent spread is 2.4% of XYZ's 100 call but 33% of the 90 put. For small premiums the spread often dominates the trade.
- **“High volume means lots of open positions.”** — Volume counts today's trades; open interest counts contracts still open. Heavy same-day trading can leave open interest unchanged or even lower.
- **“Rising open interest means buyers are winning.”** — Every open contract has one long and one short. Rising OI means more contracts exist, not that either side is right.
- **“I can always exit at the mid.”** — The mid is an estimate, not a promise. In fast markets, into news or on thin contracts, the bid can fall far below it or disappear.
- **“The spread only matters for big traders.”** — It matters most for small, frequent and short-term trades, where it is a large share of the expected gain.

## @takeaways
- The spread is a cost: \((\text{ask} - \text{bid})/\text{mid}\) compares it across contracts, and cheap options carry the largest percentage spreads.
- A round trip costs about the full spread × 100 per contract plus commissions; the stock must move about \(\text{spread}/\Delta\) just to pay it back.
- Volume counts today's trades; open interest counts open contracts and changes only when both sides open (+1) or both close (−1).
- Liquidity concentrates near the money, in near-term expiries and in a few underlyings (SPX, SPY, mega-caps); thin contracts cost more to enter and far more to leave in a hurry.

## @quiz
1. The XYZ 110 call is quoted 0.13 bid, 0.15 ask. What is its spread as a percentage of the mid?
   - [ ] About 1.4%
   - [ ] 2 cents, which is negligible
   - [x] About 14%
   - [ ] About 50%
   > Mid \(= 0.14\), spread \(= 0.02\), so \(0.02/0.14 \approx 14\%\). Two cents sounds small, but relative to a 14-cent option it is a large toll.
2. Ann buys to open 5 contracts; the seller on the other side is Ben, who is selling to close 5 contracts he already owned. What happens to volume and open interest?
   - [ ] Volume +5, open interest +5
   - [x] Volume +5, open interest unchanged
   - [ ] Volume +5, open interest −5
   - [ ] Volume unchanged, open interest +5
   > Every trade adds to volume. The long position simply passes from Ben to Ann, so the number of open contracts does not change. OI rises only when both sides open.
3. Kai buys 10 QRS 100 calls at 2.80 and sells them a minute later at 2.10, paying $0.65 per contract per side. What did the round trip cost?
   - [ ] $70
   - [ ] $13
   - [ ] $7.13
   - [x] About $713
   > Spread: \(0.70 \times 100 \times 10 = \$700\); commissions: \(2 \times 0.65 \times 10 = \$13\). Total \(\$713\), about 29% of the \(\$2{,}450\) fair value of the position.
4. XYZ's 100 call (delta 0.53) has a 0.06 spread. Roughly how far must XYZ move in Kai's favour just to recover the spread on a round trip?
   - [x] About $0.11
   - [ ] About $0.06
   - [ ] About $1.05, a typical day's move
   - [ ] About $6
   > The option moves about 0.53 per $1 of stock, so recovering 0.06 needs about \(0.06/0.53 \approx \$0.11\). On QRS the same calculation gives about $1.31, more than a typical day's move.
5. Which combination best suggests a contract Kai can enter and exit without paying a large toll?
   - [ ] Very low premium and zero open interest
   - [ ] A spread of 30% of the mid but high volume last month
   - [x] A spread of a few percent of the mid, healthy open interest and volume, and quote size at least as large as the order
   - [ ] A last price close to Kai's target, whatever the bid and ask
   > Tight percentage spread, established open interest, active volume and enough displayed size are the usual signs of liquidity. The last price can be stale, and cheapness with no open interest is a warning sign, not a bargain.

## @further
- [Penny increments (OIC)](https://www.optionseducation.org/news/penny-increments) — how tick sizes set the minimum spread on most option classes.
- [Penny Interval Program order (SEC, 2020)](https://www.sec.gov/files/rules/sro/nms/2020/34-88532.pdf) — the rule that made penny quoting permanent, and which classes it covers.
- [Options market in Q2 2026 (Cboe)](https://www.cboe.com/insights/posts/state-of-the-options-industry-options-market-continued-to-break-records-in-q-2-2026) — where volume is concentrated by product and name.
- [Characteristics and Risks of Standardized Options (OCC)](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the official disclosure, including how opening and closing transactions work.

## @next
Knowing the toll is half the job; the other half is paying as little of it as possible. How do buy-to-open and sell-to-close tickets work, why is a limit order at the mid usually better than a market order, and how do you trade two legs at once without being caught in between? The next lesson is about orders.
