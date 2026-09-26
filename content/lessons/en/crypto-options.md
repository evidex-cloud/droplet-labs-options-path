---
id: crypto-options
prereqs: product-map, implied-vol, smile-skew, market-makers, zero-dte, retail-flows
demo: crypto-options
---

# Crypto Options: Deribit, IBIT Options & Round-the-Clock Vol

## @hook
A bitcoin option is still an option: same payoff, same Black-Scholes. Four things change. The volatility is about two and a half times an ordinary stock's; the market never closes; the option is often paid in bitcoin itself; and the venue you trade on is part of the risk. Get those four right and crypto options are just options with bigger numbers.

## @bridge
[[product-map]] previewed crypto venues next to SPX and SPY; [[implied-vol]] and [[smile-skew]] taught us to read an option's price as a volatility and its shape across strikes; [[zero-dte]] showed that the clock convention matters; [[market-makers]] and [[retail-flows]] showed who sits on the other side. This lesson asks: **how do you price and hold an option on bitcoin, when it trades 24/7, is often settled in the coin, and lives on venues ranging from offshore crypto exchanges to the OCC?** It builds Idea ③ (volatility: here it is large and never sleeps) and Idea ④ (risk: settlement currency, liquidation and the venue itself). The next stage, starting with [[futures-basis]], turns to the futures and perpetuals that crypto options trade alongside.

## @intuition
Use the course's illustrative crypto numbers: **BTC = $100,000** and implied volatility **50%**. (Illustrative only: bitcoin was about $84,000 in late September 2026, after an all-time high of about $126,000 in October 2025.)

> [!KAI] Kai prices a bitcoin call
> Kai wants the same shape as the XYZ call — a 30-day at-the-money call — but on bitcoin. Black-Scholes with \(S = K = 100{,}000\), \(\sigma = 50\%\), \(T = 30/365\) (and \(r = 0\) for simplicity) gives **$5,714**.
> That is 5.7% of the price, against 2.45% for XYZ's 30-day call. The formula has not changed: \(0.4\,S\sigma\sqrt{T} = 0.4 \times 100{,}000 \times 0.5 \times 0.2867 \approx 5{,}734\). Only \(\sigma\) is two and a half times larger.
> On Deribit, the largest crypto options exchange, the same option would be quoted **in bitcoin**: \(5{,}714 / 100{,}000 = 0.0571\) BTC.

That last line is the first surprise. On Deribit the premium is paid in BTC, the margin is posted in BTC and the payoff is paid in BTC. An option that settles in the coin it is written on is called an **inverse** or **coin-settled** option. Its payoff in dollars is exactly the familiar hockey stick; its payoff *measured in bitcoin* is not, and the difference matters for anyone whose collateral is also bitcoin.

The second surprise is the clock. Bitcoin trades every hour of every day. There is no weekend gap on Deribit — but there is on an option written on a bitcoin **ETF**, which trades only during US market hours. And a venue that marks your position every hour can also liquidate it every hour, including at 3 a.m. on a Sunday.

<figure>
<svg viewBox="0 0 680 270" role="img" aria-label="Map of crypto option products by venue type and settlement">
<text x="200" y="22" text-anchor="middle" class="fx-t-b">paid in the coin</text>
<text x="400" y="22" text-anchor="middle" class="fx-t-b">paid in dollars</text>
<text x="590" y="22" text-anchor="middle" class="fx-t-b">paid in ETF shares</text>
<text x="14" y="80" class="fx-t-btc">crypto-native</text>
<text x="14" y="98" class="fx-t-sm">24/7, own margin</text>
<text x="14" y="114" class="fx-t-sm">and liquidation</text>
<text x="14" y="186" class="fx-t-blue">US-regulated</text>
<text x="14" y="204" class="fx-t-sm">central clearing</text>
<text x="14" y="220" class="fx-t-sm">(OCC, CME)</text>
<line x1="120" y1="140" x2="670" y2="140" class="fx-line-muted fx-dash"/>
<rect x="125" y="40" width="150" height="90" rx="8" class="fx-btc"/>
<text x="200" y="64" text-anchor="middle" class="fx-t-b">Deribit</text>
<text x="200" y="82" text-anchor="middle" class="fx-t-sm">BTC, ETH options</text>
<text x="200" y="98" text-anchor="middle" class="fx-t-sm">quoted in the coin</text>
<text x="200" y="114" text-anchor="middle" class="fx-t-sm">owned by Coinbase</text>
<rect x="315" y="40" width="170" height="90" rx="8" class="fx-box"/>
<text x="400" y="64" text-anchor="middle" class="fx-t-b">Bybit, Binance, OKX</text>
<text x="400" y="82" text-anchor="middle" class="fx-t-sm">stablecoin-settled</text>
<text x="400" y="98" text-anchor="middle" class="fx-t-sm">versions are common,</text>
<text x="400" y="114" text-anchor="middle" class="fx-t-sm">also on Deribit</text>
<rect x="315" y="150" width="170" height="90" rx="8" class="fx-blue"/>
<text x="400" y="174" text-anchor="middle" class="fx-t-b">CME</text>
<text x="400" y="192" text-anchor="middle" class="fx-t-sm">options on BTC futures</text>
<text x="400" y="208" text-anchor="middle" class="fx-t-sm">since 2020;</text>
<text x="400" y="224" text-anchor="middle" class="fx-t-sm">24/7 since May 2026</text>
<rect x="515" y="150" width="150" height="90" rx="8" class="fx-hl"/>
<text x="590" y="174" text-anchor="middle" class="fx-t-b">IBIT options</text>
<text x="590" y="192" text-anchor="middle" class="fx-t-sm">since Nov 2024</text>
<text x="590" y="208" text-anchor="middle" class="fx-t-sm">OCC-cleared, American</text>
<text x="590" y="224" text-anchor="middle" class="fx-t-sm">US market hours only</text>
<text x="340" y="262" text-anchor="middle" class="fx-t-sm">the same bitcoin exposure, four different sets of rules for settlement, hours and default risk</text>
</svg>
<figcaption>Figure 1 · Where bitcoin options trade. The top row is crypto-native: trading never stops and the venue runs its own margin and liquidation engine. The bottom row is US-regulated and centrally cleared. Across the columns, the payoff arrives in the coin, in dollars, or in ETF shares.</figcaption>
</figure>

We'll take it in five parts:

- **① Same formula, bigger numbers: DVOL and the expected move**
- **② Paid in bitcoin: inverse options and wrong-way collateral**
- **③ 24/7: weekends, the clock and margin that never sleeps**
- **④ The venues in 2026: Deribit and Coinbase, IBIT options, CME**
- **⑤ Skew regimes and venue risk**

## @mechanics
### ① Same formula, bigger numbers: DVOL and the expected move

A bitcoin option is priced exactly like an XYZ option. In practice desks price off the **forward** (the futures price for that expiry) with Black-76, which folds the funding rate and basis into one number ([[futures-basis]]). With \(r = 0\) and no basis, that is just Black-Scholes on the spot price. At 50% volatility the Greeks of Kai's 30-day at-the-money call are delta 0.53, vega about $114 per vol point and theta about −$95 per day.

Volatility is quoted like VIX. Deribit's **DVOL** index, launched in March 2021, is a 30-day implied volatility for BTC (and ETH) computed from Deribit's options with a variance-swap-style method, the same idea as the VIX ([[vix]]). Turning it into an expected move uses the calendar-day clock, because bitcoin trades every day:

$$
\text{daily } 1\sigma \text{ move} \approx S \times \frac{\sigma}{\sqrt{365}} \approx S \times \frac{\sigma}{19}
$$

where \(S\) is the price, \(\sigma\) the annualized implied volatility (DVOL / 100), and \(\sqrt{365} \approx 19.1\).

> [!EXAMPLE] DVOL 50 in dollars
> With BTC at $100,000 and DVOL at 50:
> $$
> 100{,}000 \times \frac{0.50}{19.1} \approx \$2{,}617 \text{ per day}, \qquad 100{,}000 \times 0.50 \times \sqrt{30/365} \approx \$14{,}335 \text{ over 30 days}
> $$
> So the options market expects a typical day to move bitcoin by about 2.6%, and the month by about 14%, one standard deviation either way. For the VIX the rule is “divide by 16” because equity volatility is annualized over about 256 trading days; for DVOL it is “divide by 19” because every calendar day trades.

### ② Paid in bitcoin: inverse options and wrong-way collateral

A coin-settled call pays its dollar intrinsic value converted into coins at the expiry price:

$$
\text{payoff in BTC} = \frac{\max(S_T - K,\ 0)}{S_T}
$$

where \(S_T\) is the bitcoin price at expiry in dollars and \(K\) the strike in dollars. The coin-settled put pays \(\max(K - S_T, 0)/S_T\).

> [!EXAMPLE] Kai's call, settled in bitcoin
> Kai paid 0.0571 BTC for the 100,000 call. If bitcoin expires at 120,000, the call pays
> $$
> \frac{120{,}000 - 100{,}000}{120{,}000} = 0.167 \text{ BTC}
> $$
> worth exactly $20,000 at that price — the same dollars as a linear call. Measured in BTC, Kai made \(0.167 - 0.057 = 0.110\) BTC. At 200,000 the call pays 0.5 BTC; at 1,000,000 it pays 0.9 BTC. **Measured in bitcoin, a coin-settled call can never pay more than 1 BTC**, however high the price goes.

<figure>
<svg viewBox="0 0 680 262" role="img" aria-label="Payoff in bitcoin of coin-settled calls and puts">
<polyline points="93.9,40.0 100.3,56.7 106.7,71.3 113.0,84.1 119.4,95.4 125.8,105.5 132.1,114.5 138.5,122.6 144.8,130.0 151.2,136.7 157.6,142.9 163.9,148.5 170.3,153.7 176.7,158.5 183.0,162.9 189.4,167.1 195.8,170.9 202.1,174.5 208.5,177.9 214.8,181.0 221.2,184.0 227.6,186.8 233.9,189.4 240.3,191.9 246.7,194.3 253.0,196.5 259.4,198.6 265.8,200.0 291.2,200.0 316.7,200.0 342.1,200.0 367.6,200.0 393.0,200.0 418.5,200.0 443.9,200.0 469.4,200.0 494.8,200.0 520.3,200.0 545.8,200.0 571.2,200.0 596.7,200.0" class="fx-line-bad"/>
<polyline points="60.0,200.0 72.7,200.0 85.5,200.0 98.2,200.0 110.9,200.0 123.6,200.0 136.4,200.0 149.1,200.0 161.8,200.0 174.5,200.0 187.3,200.0 200.0,200.0 212.7,200.0 225.5,200.0 238.2,200.0 250.9,200.0 263.6,200.0 276.4,196.2 289.1,192.7 301.8,189.6 314.5,186.7 327.3,184.0 340.0,181.5 352.7,179.3 365.5,177.1 378.2,175.2 390.9,173.3 403.6,171.6 416.4,170.0 429.1,168.5 441.8,167.1 454.5,165.7 467.3,164.4 480.0,163.2 492.7,162.1 505.5,161.0 518.2,160.0 530.9,159.0 543.6,158.1 556.4,157.2 569.1,156.4 581.8,155.6 594.5,154.8 607.3,154.0 620.0,153.3" class="fx-line-ok"/>
<line x1="60" y1="120" x2="630" y2="120" class="fx-line-muted fx-dash"/>
<line x1="60" y1="200" x2="630" y2="200" class="fx-axis"/>
<line x1="60" y1="30" x2="60" y2="200" class="fx-axis"/>
<line x1="263.6" y1="52" x2="263.6" y2="200" class="fx-line-muted fx-dash"/>
<text x="54" y="204" text-anchor="end" class="fx-t-sm">0</text>
<text x="54" y="124" text-anchor="end" class="fx-t-sm">1 BTC</text>
<text x="54" y="44" text-anchor="end" class="fx-t-sm">2 BTC</text>
<text x="136" y="218" text-anchor="middle" class="fx-t-sm">50k</text>
<text x="264" y="218" text-anchor="middle" class="fx-t-sm">K = 100k</text>
<text x="391" y="218" text-anchor="middle" class="fx-t-sm">150k</text>
<text x="518" y="218" text-anchor="middle" class="fx-t-sm">200k</text>
<text x="630" y="236" text-anchor="end" class="fx-t-sm">BTC at expiry</text>
<text x="620" y="112" text-anchor="end" class="fx-t-sm">ceiling for the call: 1 BTC</text>
<text x="620" y="145" text-anchor="end" class="fx-t-ok">call: (S − K)/S → at most 1 BTC</text>
<text x="118" y="40" class="fx-t-bad">put: (K − S)/S → no ceiling as S falls</text>
<text x="330" y="256" text-anchor="middle" class="fx-t-sm">payoff in BTC per 1 BTC of options, strike 100,000</text>
</svg>
<figcaption>Figure 2 · The same strikes, measured in bitcoin. The coin-settled call flattens toward 1 BTC; the coin-settled put steepens without limit as the price falls, reaching 1 BTC at 50,000 and 2 BTC at about 33,000. In dollars both are ordinary hockey sticks; the curvature comes only from the unit of account.</figcaption>
</figure>

Why does the unit matter if the dollars are the same? Because **collateral** is usually posted in the same coin. Selling a put with bitcoin as collateral means the collateral loses value exactly when the put's liability grows — a textbook case of **wrong-way risk**.

> [!EXAMPLE] Same short put, two kinds of collateral
> Sell a 30-day 90,000 put for $1,828 (0.0183 BTC) with $30,000 of collateral. Bitcoin expires at 70,000, so the put owes \(90{,}000 - 70{,}000 = \$20{,}000\), or \(20{,}000/70{,}000 = 0.286\) BTC.
> - **Dollar (stablecoin) collateral:** \(30{,}000 + 1{,}828 - 20{,}000 = \$11{,}828\) left.
> - **Bitcoin collateral** (0.30 BTC posted when bitcoin was 100,000): \((0.30 + 0.0183) \times 70{,}000 - 20{,}000 \approx \$2{,}280\) left.
>
> The option lost the same $20,000 both times. The bitcoin-margined account lost about $9,500 more because its collateral (and the premium it received in BTC) fell 30% at the same moment — and long before expiry it would probably have hit its maintenance margin.

This is why many crypto venues now also list **linear** options, settled in a dollar stablecoin, and why a careful trader decides separately what the option pays in and what the account is measured in.

### ③ 24/7: weekends, the clock and margin that never sleeps

On a stock, the weekend is two days of calendar time with almost no price movement, which is why equity traders argue about trading-day versus calendar-day clocks ([[zero-dte]]). Bitcoin has no such problem: every day trades, so a 365-day year is the natural clock and theta is charged on Saturday and Sunday like any other day. For Kai's at-the-money call that is about $95 per day, weekends included.

The real weekend issue is **which venue can still act**. A Deribit position is marked and margin-checked continuously. An option on a bitcoin ETF such as IBIT trades only during US market hours, so a Saturday crash shows up as a gap at Monday's open. CME closed that gap for its own products: its crypto futures and options have traded **24/7 since May 29, 2026**.

> [!THINK] A weekend drop in bitcoin partly recovers by Monday. Who is likely to be worse off: a trader short a put on a 24/7 crypto venue, or one short the same exposure through an ETF option?
> Try to decide before opening, then check in the demo below.
> ---
> Often the 24/7 trader. Their position is marked every hour, so if the Saturday-night low pushes equity below maintenance, the venue liquidates it and the loss is locked in at the worst moment. The ETF-option account is never marked over the weekend and only sees Monday's net move. The flip side is that the ETF holder cannot act either: they cannot hedge or close anything until Monday, and a drop that does not recover arrives as one large gap.

::demo[crypto-options-weekend]

In the demo's default case — $7,000 of collateral, bitcoin slides to about 85,700 early on Sunday and ends at 92,000 on Monday — the 24/7 account is liquidated around midnight on Saturday with about $2,500 of equity left, while the ETF-option account opens Monday with about $6,060.

### ④ The venues in 2026: Deribit and Coinbase, IBIT options, CME

> [!FACT] Crypto options venues, as of September 2026
> - **Deribit** was the largest crypto options exchange in the first half of 2026, with about **49%** of volume (about $426 billion), ahead of Bybit (22%), Binance (13%) and OKX (13%), according to the CoinGlass aggregator; its monthly share fell from about 56% in January to about 42% in June 2026.
> - **Coinbase** agreed to buy Deribit on May 8, 2025 for about $2.9 billion ($700 million in cash plus 11 million Coinbase shares) and closed the deal on **August 14, 2025**. Coinbase scheduled the migration of its international exchange's institutional derivatives onto Deribit for September 9, 2026, with options access for eligible users in selected jurisdictions; completion has not been independently confirmed.
> - **IBIT options** (on BlackRock's spot bitcoin ETF) launched on Nasdaq ISE on **November 19, 2024**: 353,716 contracts on day one, about $1.9 billion of notional. They are standard US ETF options: American, settled in 100 fund shares, cleared by the OCC. The position limit rose from 25,000 contracts at launch to 250,000 (July 2025) and, as reported, to **1,000,000** (SEC approval of an NYSE Arca rule, July 15, 2026). Since January 26, 2026, IBIT has also been listed with Monday and Wednesday expiries.
> - IBIT options' open interest briefly **exceeded Deribit's** bitcoin options open interest in April 2026 (about $27.6 billion versus $26.9 billion, as reported); Deribit was back ahead by late May.
> - **CME** has listed options on bitcoin futures since January 13, 2020 and moved its crypto futures and options to 24/7 trading on May 29, 2026. Options on spot **ether** ETFs were approved by the SEC on April 9, 2025.

Three different contracts sit behind these names. A Deribit option is European, cash-settled in the coin (or a stablecoin) and margined by the venue. A CME option exercises into a bitcoin futures contract, so it is an option on the forward. An IBIT option delivers ETF shares, carries early-exercise and assignment rules ([[exercise-assignment]]) and brings US tax and account rules with it. The same view on bitcoin can be expressed on all three; the P&L on a quiet day will look similar, and the P&L on a disorderly weekend may not.

### ⑤ Skew regimes and venue risk

In equity indexes, puts are almost always priced at higher implied volatility than calls: the persistent skew of [[smile-skew]]. Bitcoin's skew has been less loyal. In selloffs, downside puts have traded rich, as in equities; in speculative rallies, upside calls have at times traded richer than puts, so the risk reversal changed sign. Reading the 25-delta risk reversal ([[ratios-risk-reversals]]) is one way to see which fear — missing the rally or riding the crash — the market is paying for.

The venue itself is a risk that does not exist for an SPX option.

- **Default and custody.** An OCC- or CME-cleared option is backed by a central counterparty. On a crypto-native venue, your claim is on the venue itself; the collapse of the FTX exchange in November 2022 showed what that can mean.
- **Liquidation engines.** Crypto venues close under-margined positions automatically, around the clock. In the October 10–11, 2025 crash more than $19 billion of leveraged crypto positions were liquidated in about a day — mostly perpetual futures, the subject of [[what-is-perp]] and [[margin-liquidation]] — and some venues then used auto-deleveraging ([[insurance-adl]]).
- **Index and mark rules.** Options on crypto venues settle against a venue-defined index, and positions are marked with venue-defined prices ([[mark-index-last]]).

None of this makes crypto options unusable. It means the checklist has more lines: what the option pays in, what the account is measured in, who can liquidate you and when, and who stands behind the trade. [[perps-vs-options]] compares these options with the leveraged perpetuals most crypto traders use instead.

## @analogy
Think of buying **travel insurance in a foreign currency**. The policy promises to cover your costs above a deductible, in dollars' worth — but pays out in the local currency at the exchange rate on the day of the claim. When the local currency is strong, the payout is a modest number of coins; when it has collapsed, the insurer owes a mountain of coins for the same dollar loss. That is the inverse option: the dollar value is fixed by the contract, the number of coins moves with the price.

Now suppose you left your deposit with the insurer in that same local currency. A crisis that makes your claim larger also shrinks your deposit — the wrong-way collateral of part ②. And the insurer's office is open all night: if your deposit runs low at 3 a.m., it can cancel your policy then and there, whereas the insurer next door (the ETF option) only reopens on Monday.

The analogy breaks in one place: travel insurance prices a rare event, while a bitcoin option prices ordinary daily movement that is large every day. The size of the premium comes not from rare disasters but from a volatility of around 50% that never takes a day off.

## @misconceptions
- **“Crypto options need a different pricing model.”** — The same Black-Scholes (or Black-76 on the forward) is used; what changes are the inputs — a volatility around 50% instead of 20%, a 365-day clock, and the settlement unit.
- **“A coin-settled option pays the same as a dollar one, so the unit doesn't matter.”** — The dollar payoff is the same, but premium, margin and payoff move in bitcoin. With bitcoin collateral, a short put loses on the option and on the collateral at the same time.
- **“IBIT options and Deribit options are the same product.”** — IBIT options are American, deliver ETF shares, are OCC-cleared and trade only in US market hours; Deribit options are European, settle in the coin or a stablecoin, trade 24/7 and are margined by the venue.
- **“24/7 trading means no gaps, so it is always safer.”** — There is no weekend gap on a 24/7 venue, but there are also liquidations at any hour, locking in losses at intraday lows.
- **“Bitcoin always has put skew, like the stock market.”** — Its skew has changed sign: puts have been richer in selloffs, and calls have at times been richer during speculative rallies.

## @takeaways
- Bitcoin options use the same formula as stock options; with 50% volatility a 30-day at-the-money call costs about 5.7% of the price (illustrative BTC $100,000: about $5,714, or 0.057 BTC).
- DVOL is bitcoin's VIX; a daily 1σ move is about \(S \times \sigma / \sqrt{365}\), or DVOL divided by 19, because every day trades.
- Coin-settled (inverse) options pay \(\max(S_T - K, 0)/S_T\) BTC: a call is capped at 1 BTC in coin terms, a put has no ceiling, and coin collateral creates wrong-way risk for short puts.
- 24/7 trading removes the weekend gap but brings round-the-clock marking and liquidation; ETF options gap on Mondays; CME has traded crypto around the clock since May 2026.
- As of 2026, Deribit (owned by Coinbase since August 2025) leads crypto options with about half of volume; IBIT options, launched in November 2024, briefly rivalled it in open interest.

## @quiz
1. Illustrative bitcoin price $100,000, DVOL 50. Roughly how large is a one-standard-deviation daily move?
   - [ ] About $3,125 — divide 50% by 16, as for the VIX
   - [x] About $2,600 — divide 50% by \(\sqrt{365} \approx 19\)
   - [ ] About $14,300
   - [ ] About $50,000
   > Bitcoin trades every calendar day, so the daily move is \(100{,}000 \times 0.50/19.1 \approx 2{,}617\). “Divide by 16” is the equity rule for about 256 trading days; $14,300 is the 30-day move.
2. A coin-settled bitcoin call has a strike of 100,000. Bitcoin expires at 125,000. What does the call pay, in BTC?
   - [ ] 0.25 BTC
   - [ ] 1.25 BTC
   - [ ] 25,000 BTC
   - [x] 0.2 BTC
   > \((125{,}000 - 100{,}000)/125{,}000 = 0.2\) BTC, worth exactly $25,000 at that price. 0.25 BTC would divide by the strike instead of the expiry price.
3. Why is a short bitcoin put riskier when the collateral is bitcoin rather than a dollar stablecoin?
   - [x] Because the collateral loses value exactly when the put's liability grows
   - [ ] Because bitcoin-margined options have higher implied volatility
   - [ ] Because stablecoin collateral earns interest that pays for the put
   - [ ] Because bitcoin collateral cannot be liquidated
   > A falling bitcoin price increases what the put owes and shrinks the bitcoin collateral at the same time: wrong-way risk. In the lesson's example the same 70,000 expiry left $11,828 with dollar collateral and about $2,280 with bitcoin collateral.
4. Bitcoin falls sharply on Saturday. What is the key difference between a short put on Deribit and the same exposure through an IBIT option?
   - [ ] None: both are marked and margined over the weekend
   - [ ] The IBIT option is automatically exercised on Saturday
   - [x] The Deribit position is marked and can be liquidated over the weekend; the IBIT option cannot trade until Monday, when the move arrives as a gap
   - [ ] The Deribit option stops trading when US markets close
   > Deribit runs 24/7 with continuous margin checks; IBIT options trade only in US market hours. Each has its own weekend risk: liquidation at the low on one side, an unhedgeable gap on the other.
5. Which statement about crypto options venues is accurate as of September 2026?
   - [ ] IBIT options have no position limits
   - [x] Coinbase completed its purchase of Deribit in August 2025, and Deribit had about half of crypto options volume in the first half of 2026
   - [ ] CME's crypto options still close every weekend
   - [ ] Deribit's share of crypto options volume rose above 60% in mid-2026
   > The Deribit deal closed on August 14, 2025; CoinGlass put Deribit at about 49% in H1 2026, with its monthly share falling to about 42% by June. IBIT's limit was raised to 1,000,000 contracts (as reported, July 2026), and CME has traded crypto 24/7 since May 29, 2026.

## @further
- [Deribit, DVOL: Deribit implied volatility index](https://insights.deribit.com/exchange-updates/dvol-deribit-implied-volatility-index/) — how the crypto “VIX” is computed.
- [Nasdaq, IBIT options end their first day in the top 1%](https://www.nasdaq.com/newsroom/nasdaq-listed-ibit-options-end-first-day-top-1-all-options-products-traded) — the launch of options on a spot bitcoin ETF.
- [CME Group, 24/7 cryptocurrency futures and options](https://www.cmegroup.com/media-room/press-releases/2026/2/19/cme_group_to_launch247cryptocurrencyfuturesandoptionstradingonma.html) — the announcement of round-the-clock trading on a regulated exchange.
- [Coinbase quarterly report (10-Q) describing the Deribit acquisition](https://www.sec.gov/Archives/edgar/data/1679788/000167978825000208/coin-20250930.htm) — the primary filing on the deal.
- [CoinGlass, 2026 H1 crypto market report](https://www.coinglass.com/learn/2026h1-market-report-en) — venue shares for options and derivatives (an aggregator).
- [Satoshi Path](https://evidex-cloud.github.io/nextdawn-satoshi-path/) — the sister course on how bitcoin itself works.

## @next
Every price in this lesson quietly assumed a forward equal to spot. In crypto, the forward is visible on screen — in futures that trade above or below spot, and in perpetuals that never expire at all. What is the basis, why does it exist, and why must it shrink to zero on the last day? The next stage opens with [[futures-basis]].
