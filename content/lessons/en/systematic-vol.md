---
id: systematic-vol
prereqs: covered-call, cash-secured-put, smile-skew, vix, delta-hedging, variance-risk-premium, tail-hedging, backtesting
demo: systematic-vol
---

# Systematic Vol Strategies: Put-Writing, Dispersion & Skew

## @hook
The volatility risk premium can be collected in half a dozen wrappers: selling index puts, writing calls against stock, delta-hedged straddles, dispersion trades, skew sales, short VIX futures. On a normal day they look like different businesses. On the worst days they lose together — because underneath they all sell the same thing: insurance against a crash.

## @bridge
[[variance-risk-premium]] showed that implied volatility has, on average, sat a few points above the volatility that followed; [[backtesting]] showed how to test a strategy that harvests it without fooling yourself. This lesson maps the systematic families that institutions actually run — how each one earns the premium, what exactly it is short, and why they crowd into the same exits. It builds Idea ③ (the gap between implied and realized is the trader's living) and Idea ④ (who holds the tail, and what happens when everyone holds it). The next lesson, [[vol-forecasting]], asks whether the premium can be timed.

## @intuition
Start with the simplest harvest, one Kai already knows from [[cash-secured-put]]. Each month Kai sells the 30-day **at-the-money** 100 put on XYZ for $2.12 and keeps $100 in cash per share to cover assignment. That is 2.12% of the collateral in premium per month. If XYZ ends above $100, Kai keeps it all; if XYZ ends at $93, Kai pays $7 and loses \(7 - 2.12 = \$4.88\) per share, before interest.

> [!KAI] Kai's put-write, next to a real benchmark
> Kai's rule is a small copy of a published index. The **Cboe S&P 500 PutWrite Index (PUT)** sells one-month at-the-money SPX puts every month, fully collateralized by Treasury bills; it was introduced in 2007 with data back to June 30, 1986. Across its history the average at-the-money premium collected has been about **1.65% of notional per month** (Bondarenko, 2019). Kai's 2.12% is higher only because XYZ's illustrative 20% vol is higher than typical index vol: the same put at 15% vol costs $1.55.

Why should this earn anything? Because, as [[variance-risk-premium]] showed, index options have on average been priced at a higher volatility than the market then delivered — about **4 vol points** for the S&P 500 between 1990 and roughly 2024 (average VIX 19.6% against 15.5% subsequent realized volatility). Buyers pay that premium for protection; sellers collect it and, in return, absorb the crashes.

The key insight of this lesson is that **every systematic volatility strategy is some version of that same bargain**, dressed differently:

<figure>
<svg viewBox="0 0 700 290" role="img" aria-label="Map of systematic volatility strategy families">
<rect x="10" y="10" width="680" height="30" rx="6" class="fx-box2"/>
<text x="100" y="30" text-anchor="middle" class="fx-t-b">family</text>
<text x="290" y="30" text-anchor="middle" class="fx-t-b">what you sell</text>
<text x="470" y="30" text-anchor="middle" class="fx-t-b">what you earn</text>
<text x="620" y="30" text-anchor="middle" class="fx-t-b">worst day</text>
<rect x="10" y="48" width="680" height="34" rx="6" class="fx-box"/>
<text x="100" y="70" text-anchor="middle" class="fx-t">put-write (PUT)</text>
<text x="290" y="70" text-anchor="middle" class="fx-t-sm">ATM index puts, cash-secured</text>
<text x="470" y="70" text-anchor="middle" class="fx-t-sm">VRP + equity premium</text>
<text x="620" y="70" text-anchor="middle" class="fx-t-bad">crash</text>
<rect x="10" y="88" width="680" height="34" rx="6" class="fx-box"/>
<text x="100" y="110" text-anchor="middle" class="fx-t">buy-write (BXM)</text>
<text x="290" y="110" text-anchor="middle" class="fx-t-sm">ATM calls against the index</text>
<text x="470" y="110" text-anchor="middle" class="fx-t-sm">same as PUT, by parity</text>
<text x="620" y="110" text-anchor="middle" class="fx-t-bad">crash</text>
<rect x="10" y="128" width="680" height="34" rx="6" class="fx-box"/>
<text x="100" y="150" text-anchor="middle" class="fx-t">hedged short vol</text>
<text x="290" y="150" text-anchor="middle" class="fx-t-sm">hedged straddles or var swaps</text>
<text x="470" y="150" text-anchor="middle" class="fx-t-sm">pure VRP (implied − realized)</text>
<text x="620" y="150" text-anchor="middle" class="fx-t-bad">vol spike</text>
<rect x="10" y="168" width="680" height="34" rx="6" class="fx-box"/>
<text x="100" y="190" text-anchor="middle" class="fx-t">dispersion</text>
<text x="290" y="190" text-anchor="middle" class="fx-t-sm">index vol (buy single-stock vol)</text>
<text x="470" y="190" text-anchor="middle" class="fx-t-sm">correlation premium</text>
<text x="620" y="190" text-anchor="middle" class="fx-t-bad">correlation → 1</text>
<rect x="10" y="208" width="680" height="34" rx="6" class="fx-box"/>
<text x="100" y="230" text-anchor="middle" class="fx-t">skew</text>
<text x="290" y="230" text-anchor="middle" class="fx-t-sm">OTM puts vs ATM or calls</text>
<text x="470" y="230" text-anchor="middle" class="fx-t-sm">crash-fear premium</text>
<text x="620" y="230" text-anchor="middle" class="fx-t-bad">gap down</text>
<rect x="10" y="248" width="680" height="34" rx="6" class="fx-box"/>
<text x="100" y="270" text-anchor="middle" class="fx-t">VIX carry</text>
<text x="290" y="270" text-anchor="middle" class="fx-t-sm">VIX futures in contango</text>
<text x="470" y="270" text-anchor="middle" class="fx-t-sm">roll-down of the curve</text>
<text x="620" y="270" text-anchor="middle" class="fx-t-bad">VIX doubles</text>
</svg>
<figcaption>Figure 1 · Six families, one bargain. Each row sells a different slice of volatility and earns a different name for the same premium, but read the last column: every one of them loses when markets fall fast and fear spikes. That shared column is why these strategies crowd.</figcaption>
</figure>

We'll take it in six parts:

- **① Put-writing and buy-writes**: PUT, BXM and why they are twins
- **② Hedged volatility selling**: isolating the premium from direction
- **③ Dispersion and implied correlation**: selling index vol against its parts
- **④ Skew trades**: selling crash fear
- **⑤ VIX-futures carry**: rolling down the curve, and February 2018
- **⑥ Crowding, overlays and the state of play in 2026**

## @mechanics
### ① Put-writing and buy-writes

A put-write position earns the premium and pays the put's payoff at expiry, while its collateral earns the risk-free rate. Per month:

$$
R_{\text{put}} = \frac{p\,e^{r\Delta t} - \max(K - S_T,\,0)}{K} + \big(e^{r\Delta t} - 1\big)
$$

where \(p\) is the put premium, \(K\) the strike (the collateral per share), \(S_T\) the stock price at expiry, \(r\) the risk-free rate and \(\Delta t = 1/12\) of a year.

> [!EXAMPLE] One good month, one bad month
> Kai sells the 100 put for \(p = 2.12\); a month of interest is \(e^{0.04/12} = 1.00334\).
> - XYZ ends at 104: \(R = (2.12 \times 1.00334 - 0)/100 + 0.00334 = 2.46\%\).
> - XYZ ends at 90: \(R = (2.127 - 10)/100 + 0.00334 = -7.54\%\).
>
> One bad month erases three good ones — the negative skew every seller signs up for.

The **Cboe S&P 500 BuyWrite Index (BXM)** takes the other route: hold the S&P 500 and sell a one-month at-the-money call every month. It was launched on April 11, 2002 (following Whaley's 2002 study) with history back-filled to June 1986. By put-call parity ([[put-call-parity]]) the two strategies hold the same shape:

$$
\underbrace{S - C}_{\text{stock + short call}} \;=\; \underbrace{Ke^{-rT} - P}_{\text{cash + short put}}
$$

For XYZ at the money: \(100 - 2.45 = 97.55\) and \(99.67 - 2.12 = 97.55\). Same payoff at expiry, same cost today.

> [!THINK] If BXM and PUT are the same position by parity, why do their long-run returns differ at all?
> Think about what parity assumes and what the two indexes actually do.
> ---
> Parity holds per contract for European options with the same strike and expiry. The indexes differ in details: the BXM's call strike is set at the roll, dividends accrue to the stock holder, the PUT's collateral is reinvested at bill rates, and the two roll on slightly different schedules. In the main demo, where both use identical ATM strikes and no dividends, the put-write and buy-write curves lie almost on top of each other — the small gap is interest earned on the premium.

In the demo's simulated 20 years (volatility premium 3 points, illustrative), the index returns 6.5% a year with 13.2% volatility and a 30% drawdown; the put-write and buy-write both return about 10.1% with 7.0% volatility and an 11% drawdown. Set the premium to zero and the put-write falls to 5.7% — below the index. **The strategy's edge over simply owning stocks is the volatility premium, nothing else.** Covered-call ETFs use the same engine ([[covered-call]], [[retail-flows]]).

### ② Hedged volatility selling: the premium without the direction

Put-writing mixes two premiums: the equity risk premium (you are long the market through the short put's delta) and the volatility premium. To isolate the second, sell options and **delta-hedge** them ([[delta-hedging]]). A delta-hedged short option earns, each small interval,

$$
\dd\Pi \approx \tfrac12\,\Gamma S^2\big(\sigma_{\text{imp}}^2 - \sigma_{\text{real}}^2\big)\,\dd t
$$

where \(\Gamma\) is the option's gamma, \(S\) the stock price, \(\sigma_{\text{imp}}\) the implied vol you sold and \(\sigma_{\text{real}}\) the volatility the stock actually delivers. You win when the market moves less than you were paid for, whatever the direction.

> [!EXAMPLE] A hedged short straddle on XYZ
> Kai sells the 30-day 100 straddle at 20% implied ($4.57) and hedges daily. The straddle's gamma is \(2 \times 0.069 = 0.139\). If XYZ realizes 16% and gamma stayed constant:
> $$
> \Pi \approx \tfrac12 \times 0.139 \times 100^2 \times (0.20^2 - 0.16^2) \times \tfrac{30}{365} = 0.82
> $$
> about $0.82 per share, or $82 per straddle. The vega shortcut gives a similar answer: straddle vega \(0.228 \times 4\) vol points \(= \$0.91\). If XYZ instead realizes 30%, the same formula gives a loss of about $2.85 per share — and in reality more, because gamma rises exactly where the stock ends up.

Professionals often trade this through **variance swaps**, which pay the buyer exactly \(N_{\text{var}}(\sigma_R^2 - K^2)\) ([[variance-risk-premium]]) — variance notional times realized minus strike variance — so there is no path-dependence in gamma. The seller pays for that cleanness with convexity: the loss grows with the *square* of realized vol.

### ③ Dispersion and implied correlation

An index is a basket. Its variance depends on the variances of its members *and* on how they move together:

$$
\sigma_I^2 = \sum_i w_i^2\sigma_i^2 + \sum_{i \ne j} w_i w_j \sigma_i \sigma_j \rho_{ij}
$$

If you know the index's implied vol and every member's implied vol, one number is left over: the average correlation the option market is charging for. Solving for it gives the **implied correlation**:

$$
\rho_{\text{imp}} \approx \frac{\sigma_I^2 - \sum_i w_i^2\sigma_i^2}{\sum_{i \ne j} w_i w_j \sigma_i\sigma_j}
$$

where \(\sigma_I\) is the index implied vol, \(\sigma_i\) the members' implied vols and \(w_i\) their index weights.

> [!EXAMPLE] Fifty stocks at 30%, an index at 20%
> Equal weights \(w = 1/50\), every member at \(\sigma = 30\%\), the index at 20%. The own terms are \(50 \times (1/50)^2 \times 0.09 = 0.0018\); the cross terms at correlation 1 would be \(0.09 \times (1 - 1/50) = 0.0882\). So
> $$
> \rho_{\text{imp}} = \frac{0.04 - 0.0018}{0.0882} = 0.433
> $$
> If the index vol drops to 15% with the members unchanged, \(\rho_{\text{imp}} = (0.0225 - 0.0018)/0.0882 = 0.235\).

::demo[systematic-vol-corr]

A **dispersion trade** sells index volatility and buys the members' volatility. If single stocks realize their implied vols, the trade's profit depends only on correlation:

$$
\Pi \approx A\,\bar\sigma^2\Big(1 - \tfrac1N\Big)\big(\rho_{\text{imp}} - \rho_{\text{real}}\big)
$$

where \(A\) is the dollar notional per unit of index variance and \(\bar\sigma\) the members' vol. With the numbers above, realized correlation 0.30 instead of 0.433 earns \(0.0882 \times 0.133 = 0.0117\) of variance — 117 variance points; at an illustrative $1,000 per point, about $117,000. The trade exists because index options are the most demanded hedge: academic studies of index and single-stock options have generally found implied correlation above the correlation later realized, on average — a correlation risk premium paid by index-protection buyers.

The risk is the same bargain again. In a crash, stocks fall together and correlation jumps. At a realized correlation of 0.8 the same book loses \(0.0882 \times (0.433 - 0.8) = -0.0324\), or about −$324,000. The dispersion tab of the main demo lets you drag correlation across that range.

### ④ Skew trades: selling crash fear

Equity index smiles slope down to the left ([[smile-skew]]): out-of-the-money puts trade at higher implied vols than at-the-money options or calls. A **skew seller** sells those expensive puts and buys cheaper options elsewhere — a risk reversal (sell a 25-delta put, buy a 25-delta call), a put spread sold against a put bought further out, or simply selling far out-of-the-money puts instead of at-the-money ones ([[ratios-risk-reversals]]).

The premium earned is a payment for crash fear. Studies of index options have generally found it positive on average — far out-of-the-money index puts priced above what the crashes they insure have historically cost — but it is estimated from a handful of crashes, so its true size is uncertain. But the payoff is the most extreme version of the shared bargain: skew sellers are paid small amounts for bearing *gap* risk, where the stock opens far below yesterday's close and no hedge can be adjusted in time. Unlike an at-the-money put-write, which loses gradually as the market falls, a short far-OTM put is quiet for years and then loses many times its premium in one session.

### ⑤ VIX-futures carry

VIX futures are usually in **contango** — each later month priced above the spot VIX ([[vix]]) — because protection further out costs more and because the futures price in the tendency of volatility to spike. If the curve's shape stays the same, a future rolls *down* toward spot as it ages. A short position collects that roll.

<figure>
<svg viewBox="0 0 660 260" role="img" aria-label="VIX futures curve in contango and after a spike">
<defs><marker id="systematic-vol-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead-hl"/></marker></defs>
<line x1="70" y1="220" x2="620" y2="220" class="fx-axis"/>
<line x1="70" y1="20" x2="70" y2="220" class="fx-axis"/>
<line x1="70" y1="190" x2="620" y2="190" class="fx-grid"/>
<line x1="70" y1="130" x2="620" y2="130" class="fx-grid"/>
<line x1="70" y1="70" x2="620" y2="70" class="fx-grid"/>
<text x="62" y="194" text-anchor="end" class="fx-t-sm">15</text>
<text x="62" y="134" text-anchor="end" class="fx-t-sm">25</text>
<text x="62" y="74" text-anchor="end" class="fx-t-sm">35</text>
<text x="100" y="238" text-anchor="middle" class="fx-t-sm">spot</text>
<text x="190" y="238" text-anchor="middle" class="fx-t-sm">M1</text>
<text x="280" y="238" text-anchor="middle" class="fx-t-sm">M2</text>
<text x="370" y="238" text-anchor="middle" class="fx-t-sm">M3</text>
<text x="460" y="238" text-anchor="middle" class="fx-t-sm">M4</text>
<text x="550" y="238" text-anchor="middle" class="fx-t-sm">M5</text>
<polyline points="100,190 190,181 280,174 370,170 460,166 550,164" class="fx-line-thick"/>
<circle cx="100" cy="190" r="4" class="fx-fill-ink"/>
<circle cx="190" cy="181" r="4" class="fx-fill-ink"/>
<polyline points="100,57 190,100 280,118 370,130 460,136 550,142" class="fx-line-bad"/>
<circle cx="100" cy="57" r="4" class="fx-fill-red"/>
<circle cx="190" cy="100" r="4" class="fx-fill-red"/>
<path d="M 188,175 Q 150,168 108,184" class="fx-line-hl" fill="none" marker-end="url(#systematic-vol-ah)"/>
<text x="150" y="162" text-anchor="middle" class="fx-t-hl">roll-down</text>
<text x="400" y="210" class="fx-t">calm: contango</text>
<text x="400" y="104" class="fx-t-bad">spike: backwardation</text>
<text x="112" y="52" class="fx-t-bad">spot ≈ 37</text>
<text x="200" y="96" class="fx-t-bad">M1 ≈ 30</text>
<text x="200" y="200" class="fx-t-sm">M1 = 16.5</text>
<text x="330" y="254" text-anchor="middle" class="fx-t-sm">illustrative VIX futures curves (points)</text>
</svg>
<figcaption>Figure 2 · In calm markets the curve slopes up; a short front-month future gains as it rolls down toward spot (blue arrow). In a spike the whole curve jumps and inverts. The front month can rise by more points in a day than the roll-down earns in half a year. Numbers are illustrative.</figcaption>
</figure>

$$
\text{roll-down per month} \approx F_1 - \text{VIX}_{\text{spot}} \quad \text{(if the curve's shape is unchanged)}
$$

where \(F_1\) is the front-month future and \(\text{VIX}_{\text{spot}}\) the index. Illustratively, with spot at 15 and the front month at 16.5, a short collects about 1.5 points a month, roughly 9% of the future's price. If the front month then jumps 10 points in a day, the short gives back \(10 / 1.5 \approx 6.7\) months of carry at once.

> [!WARN] February 5, 2018 — when the crowd left through one door
> On **February 5, 2018** the VIX rose **20.01 points (+115.6%)** to close at **37.32**, its largest one-day percentage rise, while the S&P 500 fell about 4%. Short-VIX exchange-traded products had to buy VIX futures to rebalance after the close, into a market already moving against them. The **XIV** note (about $1.9 billion in assets the previous Friday) lost about **96%** and was terminated — Credit Suisse announced an acceleration event on February 6, with redemption expected around February 21. **SVXY** lost about 90%, survived, and later cut its target exposure to −0.5×. The episode is the textbook case of **crowding**: many funds short the same convexity, all forced to cover in the same hour.

### ⑥ Crowding, overlays and the state of play in 2026

Because all six families lose in the same states of the world, a book that holds several of them is less diversified than its line items suggest. Two responses are common:

- **Sizing to the tail, not to the average.** Size so that a 2018-, 2020- or August-2024-style shock is survivable ([[position-sizing]]), not so that the average month looks attractive. On August 5, 2024 the VIX touched **65.73** intraday before closing near **38.6** — the largest gap ever between an intraday high and a close — so an intraday stop can fill at a level the close never shows.
- **Long-convexity overlays.** Pair the premium harvest with a small long-volatility sleeve — far out-of-the-money puts, VIX calls, or trend-following, which tends to profit from sustained sell-offs ([[tail-hedging]]). The overlay costs carry in normal years. Its value is contested: tail-hedge manager Universa reported **+3,612% in March 2020** on the capital in its hedge (self-reported, on the hedge sleeve only), while critics argue that the steady cost of such hedges outweighs their rare payoffs for most portfolios.

> [!FACT] The size of the premium-selling crowd, 2026
> As of mid-2026, Morningstar's derivative-income ETF category held about **$180 billion**, up from under $1 billion at the end of 2020, with about $40 billion of net inflows in 2026 through July. The largest funds include JEPI (about $44 billion, mid-2026) and JEPQ (about $38–42 billion during 2026); QYLD, which sells at-the-money Nasdaq-100 calls monthly, had $8.51 billion in net assets on September 25, 2026. Every one of these is a systematic seller of options, supplying volatility that dealers must absorb and hedge.

The practical lesson for anyone running these strategies: know which of the six rows you are in, measure the premium you actually collect against honest costs ([[backtesting]], [[execution-tca]]), and decide in advance how you survive the day the last column comes true.

## @analogy
Systematic vol selling is **the insurance business**. Put-writing is selling home insurance on the whole street; the buy-write is the same policy sold through a different office. Hedged short vol is a reinsurer that only cares how many claims arrive, not which house burns. Dispersion is betting that houses burn one at a time rather than all together. Skew selling is writing only the earthquake policies, because customers overpay for them. VIX carry is renting out umbrellas on sunny days and collecting a fee for each day it doesn't rain.

Every one of those businesses is profitable on average, and every one has the same nightmare: the event that hits all the policies at once. An insurer survives by holding capital for that day and by buying reinsurance — the long-convexity overlay.

Where the analogy breaks: a real insurer's claims are mostly independent — one fire doesn't cause another — and it prices from decades of actuarial tables. Market "claims" are correlated by design: a sell-off raises volatility, correlation and skew at the same moment, and the sellers' own hedging can make the move bigger. And the tables are short: a few crashes per generation are all the data anyone has.

## @misconceptions
- **"Covered calls and put-writing are different strategies with different risks."** — By put-call parity, stock plus a short call equals cash plus a short put with the same strike and expiry. At the money, BXM and PUT hold the same shape; differences come from roll details, dividends and interest.
- **"A delta-hedged short straddle has no market risk."** — It has no *directional* risk. It is short gamma: it loses \(\tfrac12\Gamma S^2(\sigma_{\text{real}}^2 - \sigma_{\text{imp}}^2)\) whenever realized beats implied, and crashes deliver exactly that.
- **"Dispersion is a relative-value trade, so it is market-neutral."** — It is short correlation, and correlation rises in crashes. At a realized correlation of 0.8 the example book loses about $324,000 instead of making $117,000.
- **"Short VIX futures earn roll yield almost risk-free."** — The roll is paid for bearing spike risk. On February 5, 2018 the VIX more than doubled and XIV lost about 96% in a day.
- **"Diversifying across these six families diversifies the risk."** — They share the same worst day. Diversification across them spreads the *average* return, not the tail.

## @takeaways
- Put-writing (PUT) and buy-writes (BXM) are twins by parity; their edge over holding the index is the volatility premium.
- Delta-hedging isolates the premium: P&L \(\approx \tfrac12\Gamma S^2(\sigma_{\text{imp}}^2 - \sigma_{\text{real}}^2)\,\dd t\), win or lose by how much the market moves, not where.
- Implied correlation \(\rho_{\text{imp}} \approx \frac{\sigma_I^2 - \sum w_i^2\sigma_i^2}{\sum_{i \ne j} w_i w_j\sigma_i\sigma_j}\) prices how much stocks will move together; dispersion sells it.
- Skew trades and VIX carry sell the same crash insurance in more concentrated forms; February 2018 showed how crowding turns them into one trade.
- Size for the shared worst day, and consider long-convexity overlays; their value is debated, their cost is certain.

## @quiz
1. By put-call parity, holding XYZ and selling the 30-day 100 call ($2.45) is equivalent to which position?
   - [ ] Buying the 30-day 100 put
   - [ ] Holding XYZ and buying the 100 put
   - [x] Holding cash worth \(Ke^{-rT} = 99.67\) and selling the 30-day 100 put ($2.12)
   - [ ] Selling XYZ short and buying the call
   > \(S - C = Ke^{-rT} - P\): \(100 - 2.45 = 97.55 = 99.67 - 2.12\). That is why the BXM and PUT indexes behave like twins.
2. Kai sells the 30-day 100 straddle at 20% implied and delta-hedges. XYZ realizes 16%. Roughly what does Kai make per share (gamma held constant)?
   - [ ] Nothing — delta-hedging removes all P&L
   - [x] About $0.82: \(\tfrac12 \times 0.139 \times 100^2 \times (0.04 - 0.0256) \times 30/365\)
   - [ ] About $4.57, the full premium
   - [ ] A loss, because realized vol was positive
   > The hedged seller keeps \(\tfrac12\Gamma S^2(\sigma_{\text{imp}}^2 - \sigma_{\text{real}}^2)\,\dd t\). Keeping the full premium would require zero realized volatility.
3. Fifty equally weighted stocks each have 30% implied vol and the index has 20%. What average correlation is the market implying?
   - [ ] 0.20
   - [ ] 0.67
   - [ ] 0.02
   - [x] About 0.43
   > \(\rho_{\text{imp}} = (0.04 - 0.0018)/0.0882 = 0.433\). 0.67 is simply 20/30; 0.02 is the own-term weight \(1/N\).
4. What is the main risk of a dispersion trade (short index vol, long single-stock vol)?
   - [x] A crash in which stocks fall together and realized correlation jumps above implied
   - [ ] A quiet market in which nothing moves
   - [ ] A rally in one stock while the others stay flat
   - [ ] Rising interest rates
   > The trade is short correlation. In a crash correlation rises toward 1; with realized correlation 0.8 the example loses about $324,000. A single stock rallying alone is actually good for it.
5. Why did short-VIX products suffer so much on February 5, 2018?
   - [ ] Because VIX futures stopped trading
   - [ ] Because the S&P 500 fell 20% that day
   - [x] Because the VIX more than doubled in a day, and products that were all short the same convexity had to buy futures into the move at the same time
   - [ ] Because their roll yield turned slightly negative for a month
   > The VIX rose 20.01 points (+115.6%) while the S&P 500 fell about 4%. XIV lost about 96% and was terminated; the rebalancing flows of crowded short-vol products all pointed the same way.

## @further
- [Cboe PutWrite Index white paper (Bondarenko, 2019)](https://cdn.cboe.com/resources/education/research_publications/PutWriteCBOE19_v14_by_Prof_Oleg_Bondarenko_as_of_June_14.pdf) — three decades of systematic put-writing, including the 1.65%-a-month average premium.
- [Cboe S&P 500 BuyWrite Index methodology](https://cdn.cboe.com/api/global/us_indices/governance/BXM_Methodology.pdf) — exactly how the BXM rolls its calls.
- [Carr & Wu (2009), Variance Risk Premiums](https://academic.oup.com/rfs/article-abstract/22/3/1311/1581057) — the classic evidence that index variance risk premiums are strongly negative for buyers.
- [BIS Quarterly Review, March 2018](https://www.bis.org/publ/qtrpdf/r_qt1803t.htm) — the mechanics of the February 2018 volatility spike and the short-vol products.
- [CFA Institute: How well does the market predict volatility?](https://blogs.cfainstitute.org/investor/2024/07/31/how-well-does-the-market-predict-volatility/) — VIX against subsequent realized volatility since 1990.

## @next
Every family in this lesson profits when implied beats realized. So can you forecast realized volatility well enough to know when the premium is fat and when it is thin? The next lesson builds the forecasters — EWMA, GARCH, HAR and machine learning — and the loss functions that keep them honest.
