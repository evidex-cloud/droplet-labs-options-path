---
id: options-data
prereqs: option-chain, liquidity-spreads, put-call-parity, arbitrage-bounds, implied-vol, american-exercise, surface-calibration
demo: options-data
---

# Options Data: From Raw Quotes to a Clean Surface

## @hook
Every model in this course eats numbers, and in options the numbers arrive dirty: quotes that cross, prices hours out of date, a strike that costs more than it logically can. Before you backtest anything, you have to turn a firehose of raw quotes into a small table you can trust — and almost every cleaning rule you need is a no-arbitrage relation you already know.

## @bridge
In [[option-chain]] you learned to read one quote board, and in [[put-call-parity]] and [[arbitrage-bounds]] you learned the relations that honest prices must obey. [[surface-calibration]] then fitted a smooth, arbitrage-free surface — but it quietly assumed clean inputs. This lesson opens Stage 14 by asking where those inputs come from and how to clean them, so that [[backtesting]] and [[vol-forecasting]] rest on something solid. It builds Idea ② (no-arbitrage relations become data filters) and Idea ③ (the implied-vol surface is only as good as the quotes behind it).

## @intuition
Kai has finished the pricing lessons and wants to test an idea on XYZ. The plan is simple: download the closing snapshot of the 30-day chain, compute implied vols, and look at the smile. The file arrives, and it looks like the chain on a broker screen — strikes down the middle, calls on one side, puts on the other. Then Kai starts reading row by row.

> [!KAI] Kai's first look at a real snapshot
> For illustration, the 30-day XYZ chain at the close (spot $100, the course's standard market):
> - The **105 call** shows bid $0.66, ask $0.62. The bid is *above* the ask — a crossed quote. Nobody can buy at $0.62 and sell at $0.66 at the same moment; one of the two numbers is stale.
> - The **115 call** is quoted $0.22 / $0.32, while the **110 call** is $0.06 / $0.12. A call with a higher strike gives you *less* — the right to buy at $115 instead of $110 — so it can never be worth more. This quote is wrong.
> - The **100 put** has a "last" price of $1.80 while its quote is $2.07 / $2.19. The last trade happened in the morning, when XYZ was higher.
> - The **85 put** is bid $0.00, ask $0.05. There is no buyer at all.
>
> Four of eighteen quotes are unusable, and Kai has not even computed an implied vol yet.

None of this means the exchange is broken. A chain is a snapshot of hundreds of independent quotes, each updated by market makers at its own pace, and the snapshot is taken at one instant. Some quotes were refreshed a millisecond ago; some have not moved since lunch. A "last" price is not a price at all in the sense we need: it is the record of one trade at some earlier time, when the stock may have been somewhere else. A stock has one price series; an options underlying has hundreds of series at once, most of which trade rarely.

The good news is that you already own the tools to catch almost every error. A call can never be worth more than a call with a lower strike ([[arbitrage-bounds]]). A call and a put at the same strike must line up with the forward ([[put-call-parity]]). A bid must sit below an ask. These are not statistical rules of thumb; they are the no-arbitrage relations of Idea ②, used in reverse — **as tests of the data rather than as pricing tools**.

<figure>
<svg viewBox="0 0 700 250" role="img" aria-label="The options data pipeline from exchanges to a backtest">
<defs><marker id="options-data-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="10" y="30" width="120" height="58" rx="8" class="fx-box2"/>
<text x="70" y="54" text-anchor="middle" class="fx-t-b">exchanges</text>
<text x="70" y="73" text-anchor="middle" class="fx-t-sm">quotes + trades</text>
<rect x="160" y="30" width="120" height="58" rx="8" class="fx-box2"/>
<text x="220" y="54" text-anchor="middle" class="fx-t-b">OPRA feed</text>
<text x="220" y="73" text-anchor="middle" class="fx-t-sm">consolidated NBBO</text>
<rect x="310" y="30" width="120" height="58" rx="8" class="fx-box2"/>
<text x="370" y="54" text-anchor="middle" class="fx-t-b">snapshots</text>
<text x="370" y="73" text-anchor="middle" class="fx-t-sm">intraday or daily</text>
<rect x="460" y="30" width="220" height="58" rx="8" class="fx-bad"/>
<text x="570" y="54" text-anchor="middle" class="fx-t-b">filters</text>
<text x="570" y="73" text-anchor="middle" class="fx-t-sm">crossed · zero bid · wide · stale</text>
<line x1="130" y1="59" x2="156" y2="59" class="fx-line" marker-end="url(#options-data-ah)"/>
<line x1="280" y1="59" x2="306" y2="59" class="fx-line" marker-end="url(#options-data-ah)"/>
<line x1="430" y1="59" x2="456" y2="59" class="fx-line" marker-end="url(#options-data-ah)"/>
<line x1="570" y1="88" x2="570" y2="126" class="fx-line" marker-end="url(#options-data-ah)"/>
<rect x="460" y="130" width="220" height="58" rx="8" class="fx-hl"/>
<text x="570" y="154" text-anchor="middle" class="fx-t-b">forward, rate, dividends</text>
<text x="570" y="173" text-anchor="middle" class="fx-t-sm">from put-call parity</text>
<rect x="250" y="130" width="180" height="58" rx="8" class="fx-hl"/>
<text x="340" y="154" text-anchor="middle" class="fx-t-b">implied vol per quote</text>
<text x="340" y="173" text-anchor="middle" class="fx-t-sm">OTM side, de-Americanized</text>
<rect x="40" y="130" width="180" height="58" rx="8" class="fx-ok"/>
<text x="130" y="154" text-anchor="middle" class="fx-t-b">clean surface</text>
<text x="130" y="173" text-anchor="middle" class="fx-t-sm">arbitrage checks, SVI fit</text>
<line x1="460" y1="159" x2="434" y2="159" class="fx-line" marker-end="url(#options-data-ah)"/>
<line x1="250" y1="159" x2="224" y2="159" class="fx-line" marker-end="url(#options-data-ah)"/>
<text x="130" y="220" text-anchor="middle" class="fx-t-sm">→ backtests, risk, forecasts</text>
<text x="570" y="220" text-anchor="middle" class="fx-t-bad">filters + parity catch most errors</text>
</svg>
<figcaption>Figure 1 · The pipeline. Raw quotes flow from the exchanges through the consolidated feed into snapshots; filters remove quotes that cannot be true; put-call parity supplies the forward and the discount rate; only then are implied vols computed and fitted into a surface. Notice that "implied vol" sits near the end, not the start.</figcaption>
</figure>

Why should a trader care about plumbing? Because every later conclusion inherits the data's errors. The crossed 105 call and the impossible 115 call each produce an implied vol; fed into a surface, they bend the smile; fed into a backtest, they create trades at prices that never existed. **A backtest on dirty data measures the data, not the strategy.**

We'll take it in five parts:

- **① Where options data comes from**: exchanges, the consolidated feed, snapshots and derived fields
- **② The quirks**: crossed and stale quotes, bad prints, and the timing trap
- **③ From quotes to implied vol**: the forward, the rate, dividends and early exercise
- **④ The cleaning checklist**: no-arbitrage relations as filters
- **⑤ Point-in-time data, corporate actions and the 2026 data load**

## @mechanics
### ① Where options data comes from

US listed options trade on many exchanges at once. Each exchange publishes its own best bid and offer for every series, plus a record of every trade. The **Options Price Reporting Authority (OPRA)** consolidates these into a single feed; from it come the **national best bid and offer (NBBO)** — the highest bid and the lowest ask across all exchanges — and the consolidated trade tape. Every broker screen, vendor database and academic dataset downstream is a slice of that feed.

The slices you will meet:

| Data type | What it contains | Typical use | Main trap |
|---|---|---|---|
| Tick quotes | every NBBO change, time-stamped | execution research, intraday strategies | enormous; needs careful time alignment |
| Trades (time and sales) | price, size, time, exchange | volume analysis, flow studies | a trade is one moment, not a price for the whole day |
| End-of-day snapshot | bid, ask, volume per series at (or near) the close | daily backtests, surfaces | the snapshot time differs from the stock's close |
| Derived fields | implied vol, Greeks, open interest | screening, risk | computed with someone else's rate, dividend and model |

The volume behind these tables is large and growing. As of January 2026, US listed options traded about 15 billion contracts in 2025 — an average of about 61 million a day and the sixth straight record year (Cboe). Quote updates outnumber trades by a wide margin, because market makers refresh every series whenever the stock ticks. That is why most research uses **snapshots** — a picture of the NBBO at chosen times — rather than every tick.

$$
M = \frac{\text{bid} + \text{ask}}{2}, \qquad \text{spread}\,\% = \frac{\text{ask} - \text{bid}}{M}
$$

Here \(M\) is the **mid**, the midpoint of the NBBO, and the spread percentage measures how uncertain that mid is ([[liquidity-spreads]]). The mid is the standard input for implied vol, because it is the best single guess of fair value when both sides are live. For Kai's 100 call quoted $2.40 / $2.52: \(M = (2.40 + 2.52)/2 = \$2.46\) and the spread is \(0.12/2.46 = 4.9\%\). For the 85 put quoted $0.00 / $0.05 the "mid" of $0.025 has a spread of 200% of itself: it is not a price, it is an absence of buyers.

> [!DEEP] Microprice: when the mid is not the middle
> If 500 contracts are bid and only 10 are offered, the next trade is more likely to lift the ask, and the fair price sits closer to it. A common refinement weights each side by the *opposite* side's size: \(M_{\mu} = \dfrac{\text{bid}\,Q_a + \text{ask}\,Q_b}{Q_a + Q_b}\), where \(Q_b, Q_a\) are the bid and ask sizes. With bid $2.40 × 500 and ask $2.52 × 10, \(M_{\mu} = (2.40 \times 10 + 2.52 \times 500)/510 = \$2.518\). End-of-day datasets rarely keep sizes, so most surfaces use the plain mid.

### ② The quirks: crossed, stale, bad, and out of sync

Here is the menagerie, with the reason each one appears.

- **Crossed or locked quotes** (bid ≥ ask). Two exchanges update at slightly different moments; for an instant the best bid on one is above the best ask on another. In a snapshot this freezes into a price pair that cannot trade. Drop it.
- **Zero bids.** Far out-of-the-money series often have no buyer at all. The ask still carries information (nobody will sell for less), but the mid does not. Cboe's own VIX calculation drops a series once it meets consecutive zero bids in the wings, for exactly this reason.
- **Very wide quotes.** A quote of $0.40 / $0.90 on the 95 put has a mid of $0.65 with a spread of 77% of the mid. The implied vol from it could be anywhere between about 18% and 25%. Keep it with a low weight, or drop it.
- **Stale quotes.** A market maker's quote on a rarely traded series may not have been refreshed after the stock moved. It still shows a bid and an ask, both wrong. Stale quotes are the hardest to catch directly; they reveal themselves by breaking a relation with their neighbors.
- **Bad prints and "last" prices.** A trade reported at a wrong price, or a correct trade from hours ago. **Never use "last" as a price in research.** Kai's 100 put "last" of $1.80 dates from a morning when XYZ was higher; its implied vol would be nonsense.

> [!THINK] Kai's 105 call last traded at $1.40 this morning. Treat that as today's price with XYZ at $100 and 30 days left: what implied vol do you get?
> Predict first: is it a little above 20%, or a lot?
> ---
> A lot. Solving Black-Scholes for \(C = 1.40\) with \(S = 100,\ K = 105,\ T = 30/365,\ r = 4\%\) gives about **27.4%**, against a true 20%. The trade happened when XYZ was near $102.5; the price was fine *then*. Pairing an old option price with a new stock price is the most common way to manufacture a fake "vol spike".

The last bullet points to the deepest quirk: **timing**. An option price only means something next to the stock price at the same instant.

<figure>
<svg viewBox="0 0 700 220" role="img" aria-label="Timeline of a trading day showing when different data fields are recorded">
<defs><marker id="options-data-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="30" y1="120" x2="680" y2="120" class="fx-axis" marker-end="url(#options-data-ah2)"/>
<line x1="90" y1="110" x2="90" y2="130" class="fx-line"/>
<text x="90" y="148" text-anchor="middle" class="fx-t-sm">11:02</text>
<text x="90" y="98" text-anchor="middle" class="fx-t-bad">"last" trade</text>
<text x="90" y="80" text-anchor="middle" class="fx-t-sm">XYZ ≈ 102.5</text>
<line x1="330" y1="110" x2="330" y2="130" class="fx-line"/>
<text x="330" y="148" text-anchor="middle" class="fx-t-sm">16:00</text>
<text x="330" y="98" text-anchor="middle" class="fx-t-b">stock close</text>
<text x="330" y="80" text-anchor="middle" class="fx-t-sm">XYZ = 100</text>
<line x1="460" y1="110" x2="460" y2="130" class="fx-line"/>
<text x="460" y="148" text-anchor="middle" class="fx-t-sm">16:15</text>
<text x="460" y="80" text-anchor="middle" class="fx-t-hl">some index / ETF</text>
<text x="460" y="98" text-anchor="middle" class="fx-t-hl">options still trade</text>
<line x1="610" y1="110" x2="610" y2="130" class="fx-line"/>
<text x="610" y="148" text-anchor="middle" class="fx-t-sm">next morning</text>
<text x="610" y="80" text-anchor="middle" class="fx-t-blue">open interest</text>
<text x="610" y="98" text-anchor="middle" class="fx-t-blue">for yesterday</text>
<rect x="290" y="165" width="210" height="26" rx="6" class="fx-bad"/>
<text x="395" y="183" text-anchor="middle" class="fx-t-sm">15-minute gap: not the same instant</text>
<text x="40" y="30" class="fx-t">An implied vol needs S and the option price from the same instant.</text>
<text x="40" y="50" class="fx-t-sm">Every mismatch on this line becomes a fake move in implied vol or a look-ahead leak.</text>
</svg>
<figcaption>Figure 2 · One day, four clocks. The stock closes at 16:00; some index and ETF options trade 15 minutes longer; a "last" option trade may be hours old; open interest for today is only published the next morning. A clean dataset records the time of each field and pairs the option quote with the stock price of the same moment.</figcaption>
</figure>

Two consequences matter later. First, if index options trade after the stock market closes, a 16:15 option quote reflects news that a 16:00 stock price does not; pair the option with a futures price or the forward implied by the options themselves (section ③). Second, **open interest** is computed overnight by the clearing house and published the next morning. A backtest that trades at Tuesday's close using Tuesday's open interest is using information that only existed on Wednesday — a small look-ahead leak that [[backtesting]] will generalize.

### ③ From quotes to implied vol: forward, rate, dividends, early exercise

To turn an option price into an implied vol you need every other Black-Scholes input exactly right ([[implied-vol]]). Spot is on the screen, but the other two carry inputs — the interest rate and the dividend or borrow cost — are not. The elegant answer: **read them from the options themselves**, using put-call parity.

Rearranging parity \(C - P = e^{-rT}(F - K)\) at one strike gives the **implied forward**:

$$
F = K + e^{rT}\,\big(C - P\big)
$$

where \(C\) and \(P\) are the call and put mids at strike \(K\), \(r\) the interest rate, \(T\) the time to expiry and \(F\) the forward price of the stock for that expiry. Use the strike where \(|C - P|\) is smallest — the one nearest the money, where both quotes are liquid and tight. Cboe's VIX methodology does exactly this.

> [!EXAMPLE] Kai's implied forward
> At \(K = 100\) the mids are \(C = 2.45\) and \(P = 2.12\) (the standard numbers):
> $$
> F = 100 + e^{0.04 \times 30/365} \times (2.45 - 2.12) = 100 + 1.00329 \times 0.33 = 100.33
> $$
> That matches the model forward \(Se^{rT} = 100.33\): XYZ pays no dividend and has no borrow cost. Suppose instead the pair implied \(F = 100.20\). The missing carry would be
> $$
> q_{\text{imp}} = r - \frac{1}{T}\ln\frac{F}{S} = 0.04 - \frac{365}{30}\ln 1.0020 = 1.57\%
> $$
> — an expected dividend or a stock-borrow fee of about 1.6% a year that no dividend calendar had to tell you about.

With two strikes you can even recover the discount factor: the difference \((C - P)_{K_1} - (C - P)_{K_2} = e^{-rT}(K_2 - K_1)\), because the forward cancels. For XYZ at 95 and 105: \((5.821 - 0.509) - (0.713 - 5.368) = 9.967\), and \(9.967/10 = 0.99672 = e^{-0.04 \times 30/365}\). In practice you regress \(C - P\) on \(K\) across the liquid strikes: the slope is \(-e^{-rT}\) and the forward follows. This is why careful pipelines never plug a dividend forecast or a textbook rate into the pricer blindly — the options market already priced them.

::demo[options-data-forward]

**Early exercise.** Single-stock and ETF options are American ([[american-exercise]]). An American put is worth more than the European one, and Black-Scholes is a European formula. Feed an American price into it and the early-exercise premium comes out as extra volatility.

> [!WARN] The American premium disguised as vol
> For XYZ's 1-year 100 put, a binomial tree gives an American value of **$6.40** against the European **$6.00**. Solve Black-Scholes for \(6.40\) and you get an implied vol of **21.0%**, not 20% — a full vol point of fake skew. For the in-the-money 110 put the gap is worse: $12.33 vs $11.35, implied vol **22.5%**. Two fixes: compute IVs from out-of-the-money options only (their early-exercise premium is tiny), or "de-Americanize" — find the vol that makes a tree match the American price, then use that vol as if the option were European. Vendor IV fields may or may not do this; read their documentation.

The order matters: filter first, then parity for \(F\) and \(r\), then IVs from the out-of-the-money side (puts below the forward, calls above), then the surface fit of [[surface-calibration]].

### ④ The cleaning checklist

Each filter below is a one-line test. Most are the no-arbitrage bounds from [[arbitrage-bounds]], applied to bids and asks instead of theoretical prices.

$$
C(K_1) \ge C(K_2), \qquad C(K_1) - C(K_2) \le e^{-rT}(K_2 - K_1), \qquad C(K_1) - 2C(K_2) + C(K_3) \ge 0
$$

for strikes \(K_1 < K_2 < K_3\), the last with equal spacing. In words: a call with a lower strike is worth at least as much (monotonicity); the difference between two calls can't exceed the discounted distance between their strikes (a vertical spread can't pay more than its width); and a butterfly can't have negative value (convexity). Puts obey the mirror images.

| Test | Rule | What to do |
|---|---|---|
| Crossed / locked | bid ≥ ask | drop |
| Zero bid | bid = 0 | drop from IV; keep the ask as an upper bound |
| Wide | spread % > a threshold (say 50%) | drop or down-weight |
| Monotonicity | call mids fall with \(K\), put mids rise | drop the offender (often the illiquid one) |
| Vertical bound | \(C(K_1) - C(K_2) \le e^{-rT}(K_2 - K_1)\) | drop |
| Convexity | butterfly ≥ 0 | flag; usually drop the middle quote |
| Parity | \(\lvert C - P - e^{-rT}(F - K)\rvert\) > tolerance | drop the in-the-money leg |
| IV outlier | IV far from its neighbors | flag for review, don't auto-delete |

> [!EXAMPLE] The checklist on Kai's chain
> Crossed: the 105 call ($0.66 / $0.62). Zero bid: the 85 put, and the deep wings at 80 (put) and 120 (call). Wide: the 95 put ($0.40 / $0.90), and the 110 call ($0.06 / $0.12, a spread of 67% of its $0.09 mid — honest, but too thin to trust). Monotonicity: the 115 call, whose mid $0.27 exceeds the 110 call's $0.09. Parity: the 90 call, quoted $10.80 / $11.30 when parity with the $0.16 put says about $10.45 — a whole quote shifted up by $0.60. One more quote gets caught as collateral: the 115 put fails the parity test only because its partner, the bad 115 call, is wrong — the rule drops the in-the-money leg, which at 115 is the put. That is nine flagged quotes out of eighteen, and a reminder that a filter tells you *that* something is wrong, not always *which* number. The main demo below reproduces all nine — and notice how little survives in the call wing.

Two habits make the list work. **Log, don't silently delete** — keep a flag column so you can count how much data each rule removes and spot a rule that suddenly removes half the chain. And **apply rules in a fixed order** so results are reproducible. In Python the core of it is a few lines:

```python
import numpy as np, pandas as pd

def clean(chain: pd.DataFrame, r: float, T: float, max_spread=0.5):
    q = chain.copy()                      # columns: K, type, bid, ask
    q["mid"] = (q.bid + q.ask) / 2
    q["flag"] = ""
    q.loc[q.bid >= q.ask, "flag"] += "crossed;"
    q.loc[q.bid <= 0, "flag"] += "zero_bid;"
    q.loc[(q.ask - q.bid) / q.mid > max_spread, "flag"] += "wide;"
    calls = q[q.type == "C"].sort_values("K")
    bad = calls.mid.diff() > 0            # a higher strike priced above a lower one
    q.loc[calls.index[bad], "flag"] += "monotone;"
    # implied forward from the strike with the smallest |C - P|
    wide = q.pivot_table(index="K", columns="type", values="mid")
    k0 = (wide.C - wide.P).abs().idxmin()
    F = k0 + np.exp(r * T) * (wide.C[k0] - wide.P[k0])
    return q, F
```

### ⑤ Point-in-time data, corporate actions and the 2026 data load

A dataset is **point-in-time** if every value is stored as it was known at that moment, never revised afterwards. Options data breaks this in quiet ways: open interest published the next morning; a dividend forecast updated after the fact; an index-membership list that only contains today's members.

**Survivorship.** A database of "all optionable stocks" built today excludes every company that was delisted, acquired or went bankrupt. Those are exactly the names where short puts lost the most. Research on such a universe inherits a flattering bias; [[backtesting]] quantifies how much.

**Corporate actions.** After a stock split, special dividend or merger, the OCC adjusts existing contracts: the strike, the multiplier or the deliverable changes, and the adjusted series often gets a new root symbol. A pipeline that ignores adjustments sees a strike "jump" or a price fall by half overnight and books a fictitious profit or loss. Keep the adjustment history and map old series to new.

**Storage.** One expiry of one underlying is dozens of strikes × two types × many snapshots a day. Multiply by thousands of underlyings and a growing number of expiries and the tables become large quickly; columnar formats and partitioning by date and underlying are the usual answer.

> [!FACT] The data load in 2026
> As of September 2026: OCC's options average daily volume was about 70.8 million contracts year-to-date through August 2026, up about 23% on the year. 0DTE volume across all US options passed 20 million contracts a day in the first half of 2026 (Cboe), and SPX has had an expiry every weekday since 2022. Since late January 2026 some large single stocks and ETFs (including TSLA, NVDA, AAPL and IBIT) can list Monday and Wednesday expiries on Nasdaq, and Cboe set July 13, 2026 as the launch date for pre-market and post-market sessions in about 20 single-stock option classes. Each change adds series and blurs the old idea of one "closing" price: a 2026 pipeline must say which session, which snapshot time and which settlement it uses.

Clean data is the foundation for everything that follows. [[python-pricing]] will compute implied vols from the cleaned mids in code; [[backtesting]] will use the same discipline to decide what fill prices a strategy could really have obtained.

## @analogy
Think of options data as **a wall of clocks in an old railway station**, one clock per series. Each is supposed to show the same time — the current state of XYZ — but each was set by a different person at a different moment. Most are right to the second. A few stopped at lunchtime. One runs backwards (the crossed quote). One shows a time that cannot exist, 13:75 (the 115 call priced above the 110 call).

You would never average all the clocks to find the time. You would first throw out the ones that break simple rules — hands pointing to impossible numbers, a clock that disagrees with its twin on the other wall (parity). Then you would read the time from the clocks that agree with each other and are known to be well kept (tight, near-the-money quotes). Only then would you set your own watch, and you would write down *when* you read it.

The analogy breaks in one place: a stopped clock is harmless because everyone knows the time is moving on. A stale option quote is dangerous because it looks exactly like a fresh one. There is no second hand to see it stop; you can only catch it by comparing it with its neighbors — which is what the no-arbitrage filters do.

## @misconceptions
- **"The last traded price is the option's price."** — "Last" is one trade at some earlier moment, often hours ago when the stock was elsewhere. Research uses the mid of a live NBBO paired with the stock price of the same instant.
- **"Vendor implied vols can be used as they are."** — They were computed with the vendor's rate, dividend assumptions, snapshot time and model (European or American). Check them against your own forward from put-call parity before mixing sources.
- **"Cleaning data is just removing outliers."** — The strongest filters are exact no-arbitrage relations — monotonicity, vertical bounds, convexity and parity — not statistics. A quote can look normal and still be impossible.
- **"If I use end-of-day data, timing doesn't matter."** — End-of-day is exactly where timing bites: the stock closes at 16:00, some options trade to 16:15, and open interest arrives the next morning. Pair fields from the same instant or you create fake volatility and look-ahead leaks.
- **"A database of today's optionable stocks is a fair universe for history."** — It omits every delisted and bankrupt company, the very names where short options lost most. Use a point-in-time universe.

## @takeaways
- A chain is a snapshot of hundreds of independently updated quotes; crossed, stale, zero-bid and wide quotes are normal, not rare.
- Use the NBBO mid, never "last", and pair it with the stock price or forward from the same instant.
- The no-arbitrage relations of Idea ② — monotonicity, vertical bounds, convexity, parity — double as the best data filters.
- Read the forward, rate and dividend/borrow from the options themselves: \(F = K + e^{rT}(C - P)\) at the tightest near-the-money strike.
- Compute IVs from out-of-the-money options or de-Americanize; otherwise the early-exercise premium shows up as fake skew.
- Keep data point-in-time: open interest, dividends, corporate actions and delisted names are where silent leaks come from.

## @quiz
1. Kai's snapshot shows the 115 call at $0.22 / $0.32 and the 110 call at $0.06 / $0.12. What is the right conclusion?
   - [ ] The 115 call is a bargain relative to the 110 call
   - [ ] The market expects a large rally, so higher strikes are worth more
   - [x] The 115 quote breaks monotonicity — a higher-strike call can never be worth more — so it should be dropped
   - [ ] Both quotes are fine; different strikes have different vols
   > A call with a higher strike gives strictly less, so its price can never exceed the lower-strike call's. Different vols by strike are normal (the smile), but no vol can make \(C(115) > C(110)\). This is a stale or bad quote, not an opportunity.
2. At the 100 strike the call mid is 2.45 and the put mid is 2.12, with \(T = 30/365\) and \(r = 4\%\). What forward do the options imply?
   - [ ] 100.00
   - [x] About 100.33
   - [ ] About 102.45
   - [ ] About 99.67
   > \(F = K + e^{rT}(C - P) = 100 + 1.00329 \times 0.33 = 100.33\). 99.67 is the present value of the strike; 102.45 adds the call price to the strike.
3. Why do careful pipelines compute implied vol mainly from out-of-the-money options?
   - [ ] Because in-the-money options have no implied vol
   - [ ] Because out-of-the-money options always have wider spreads
   - [ ] Because regulators require it
   - [x] Because they are usually more liquid and carry almost no early-exercise premium, so Black-Scholes fits them cleanly
   > In-the-money American options include an early-exercise premium that Black-Scholes reads as extra vol (the 1-year 100 put: $6.40 American vs $6.00 European → 21.0% instead of 20%), and their quotes are often wider. OTM options avoid both problems.
4. A backtest enters trades at Tuesday's close and uses Tuesday's open interest as a signal. What is wrong?
   - [x] Open interest for Tuesday is only published on Wednesday morning, so the signal uses information not available at the trade
   - [ ] Nothing — open interest is known in real time
   - [ ] Open interest is not related to options
   - [ ] The problem is only that open interest is noisy
   > The clearing house computes open interest overnight. Using it at Tuesday's close is a small look-ahead leak; the fix is to lag it one day.
5. Kai's 90 call is quoted $10.80 / $11.30 while the 90 put is $0.13 / $0.19 and the implied forward is 100.33. What does the parity check say?
   - [ ] The quotes are consistent; nothing to do
   - [ ] The put must be wrong because it is cheap
   - [x] Parity says the call should be about \(0.16 + e^{-rT}(100.33 - 90) \approx 10.46\); the call mid of 11.05 is about 0.60 too high, so drop the in-the-money call quote
   - [ ] Parity only applies to at-the-money options
   > \(C = P + e^{-rT}(F - K) = 0.16 + 0.99672 \times 10.33 \approx 10.46\). A 60-cent gap is far outside any tolerance. The in-the-money leg is the less liquid, less trustworthy one, so it is the one to drop.

## @further
- [Cboe VIX Methodology (PDF)](https://cdn.cboe.com/resources/vix/VIX_Methodology.pdf) — a production-grade example: how Cboe selects strikes, drops zero-bid quotes and derives the forward from put-call parity.
- [Cboe: The State of the Options Industry 2025](https://www.cboe.com/insights/posts/the-state-of-the-options-industry-2025) — the volume numbers behind the data load.
- [OCC: Characteristics and Risks of Standardized Options](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the official description of contract terms and adjustments after corporate actions.
- [OPRA — the Options Price Reporting Authority](https://www.opraplan.com/) — the plan that runs the consolidated US options feed.
- [Gatheral & Jacquier (2014), Arbitrage-free SVI volatility surfaces](https://arxiv.org/abs/1204.0646) — what a clean chain is ultimately fitted into.

## @next
With clean prices in hand, it is tempting to run a strategy over ten years of them and trust the equity curve. The next lesson shows how a backtest can still lie — through fills at the mid, look-ahead, survivorship and the sheer number of variants you tried — and how to catch each lie.
