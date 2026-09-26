---
id: product-map
prereqs: contract-specs, option-chain, exercise-assignment, margin-approval
demo: product-map
---

# The Product Map: Stock, ETF, Index, 0DTE & Crypto Options

## @hook
“Options on the S&P 500” can mean SPY, SPX or XSP options, or options on S&P futures: contracts with the same shape but different exercise rules, settlement, size, trading hours and even US tax treatment. Choosing the product is part of the trade, and choosing the wrong one can turn a good view into an unpleasant surprise.

## @bridge
This stage took Kai from the quote board ([[option-chain]]) through liquidity, orders, expiration day ([[exercise-assignment]]) and margin ([[margin-approval]]). The last question is *which* contract. It builds Idea ① (shape: a call is a call on any underlying, so everything you learned about payoffs carries over) and Idea ④ (risk: settlement style, assignment and contract size decide what can go wrong). Every product here returns later in depth, from [[zero-dte]] to [[crypto-options]].

## @intuition
Suppose Kai's portfolio grows and Kai wants protection against a fall in the whole US market rather than in XYZ. Kai searches for “S&P 500 put” and finds three candidates on the same index:

- **SPY puts**: options on an ETF that tracks the S&P 500. American, deliver 100 ETF shares, can be assigned early.
- **SPX puts**: options on the index itself. European, settled in cash, 100 dollars per index point, so one contract controls about \(7{,}743 \times 100 \approx \$774{,}000\) (the index closed at 7,743 on September 25, 2026).
- **XSP puts**: “Mini-SPX”, one-tenth the size of SPX, also European and cash-settled.

Same index, same shape of protection; very different contracts. The map below sorts the main families by what happens at exercise:

<figure>
<svg viewBox="0 0 720 300" role="img" aria-label="The options product map by exercise and settlement">
<rect x="10" y="10" width="226" height="276" rx="10" class="fx-ok"/>
<rect x="247" y="10" width="226" height="276" rx="10" class="fx-hl"/>
<rect x="484" y="10" width="226" height="276" rx="10" class="fx-btc"/>
<text x="123" y="36" text-anchor="middle" class="fx-t-b">American · physical</text>
<text x="123" y="54" text-anchor="middle" class="fx-t-sm">exercise any day · 100 shares change hands</text>
<text x="360" y="36" text-anchor="middle" class="fx-t-b">European · cash</text>
<text x="360" y="54" text-anchor="middle" class="fx-t-sm">exercise at expiry only · cash difference</text>
<text x="597" y="36" text-anchor="middle" class="fx-t-b">Other underlyings</text>
<text x="597" y="54" text-anchor="middle" class="fx-t-sm">futures and crypto</text>
<rect x="24" y="70" width="198" height="56" rx="6" class="fx-box"/><text x="36" y="92" class="fx-t-b">Stock options</text><text x="36" y="112" class="fx-t-sm">XYZ, NVDA, TSLA… ×100 shares</text>
<rect x="24" y="136" width="198" height="56" rx="6" class="fx-box"/><text x="36" y="158" class="fx-t-b">ETF options</text><text x="36" y="178" class="fx-t-sm">SPY, QQQ, IWM… ×100 shares</text>
<rect x="24" y="202" width="198" height="70" rx="6" class="fx-box"/><text x="36" y="224" class="fx-t-b">IBIT options</text><text x="36" y="244" class="fx-t-sm">100 bitcoin-ETF shares,</text><text x="36" y="262" class="fx-t-sm">not bitcoin itself</text>
<rect x="261" y="70" width="198" height="72" rx="6" class="fx-box"/><text x="273" y="92" class="fx-t-b">SPX (S&amp;P 500 index)</text><text x="273" y="112" class="fx-t-sm">$100 × index · monthlies AM-settled,</text><text x="273" y="130" class="fx-t-sm">SPXW weeklies/0DTE PM-settled</text>
<rect x="261" y="152" width="198" height="56" rx="6" class="fx-box"/><text x="273" y="174" class="fx-t-b">XSP, NDX, RUT</text><text x="273" y="194" class="fx-t-sm">XSP = 1/10 of SPX</text>
<rect x="261" y="218" width="198" height="54" rx="6" class="fx-box"/><text x="273" y="240" class="fx-t-b">VIX options</text><text x="273" y="260" class="fx-t-sm">on volatility, track VIX futures</text>
<rect x="498" y="70" width="198" height="72" rx="6" class="fx-box"/><text x="510" y="92" class="fx-t-b">Options on futures</text><text x="510" y="112" class="fx-t-sm">exercise into a futures position</text><text x="510" y="130" class="fx-t-sm">e.g. CME bitcoin (since 2020)</text>
<rect x="498" y="152" width="198" height="120" rx="6" class="fx-box"/><text x="510" y="174" class="fx-t-b">Crypto-exchange options</text><text x="510" y="194" class="fx-t-sm">Deribit (owned by Coinbase),</text><text x="510" y="212" class="fx-t-sm">Bybit, Binance, OKX</text><text x="510" y="232" class="fx-t-sm">often coin-margined, 24/7,</text><text x="510" y="250" class="fx-t-sm">outside the OCC system</text>
</svg>
<figcaption>Figure 1 · The product map. The left column behaves like Kai's XYZ options (early assignment, shares delivered); the middle column never delivers anything and cannot be assigned early; the right column settles into something other than shares or dollars from the OCC. The payoff shapes are identical across all three.</figcaption>
</figure>

> [!KAI] Kai prices the same protection three ways
> Kai wants to protect about \(\$77{,}000\) of stock-market exposure. That is roughly **10 SPY puts** (SPY trades near one-tenth of the index level, each contract covering 100 shares), **10 XSP puts**, or **one-tenth of an SPX put**, which does not exist: the smallest SPX position is \(\$774{,}000\) of exposure. For Kai, SPX is simply too big; the real choice is SPY versus XSP, and it comes down to early assignment, settlement and tax treatment rather than to the view.

> [!THINK] Kai sells an SPX call as part of a spread. Can Kai be assigned the night before an ex-dividend date, as with XYZ?
> ---
> No. SPX options are European, so they can only be exercised at expiry, and they are settled in cash, so no shares (and no dividends) are involved. Early assignment is a feature of American, physically settled options like XYZ, SPY or IBIT.

We'll take it in six parts:

- **① Stock and ETF options**: American, physical, the bulk of the volume
- **② Index options**: SPX, XSP and the notional problem
- **③ A US tax difference: Section 1256**
- **④ Expiries, 0DTE and trading hours in 2026**
- **⑤ VIX options and options on futures**
- **⑥ Crypto options: Deribit, IBIT and CME**

## @mechanics
### ① Stock and ETF options

Options on individual stocks and on ETFs such as SPY, QQQ and IWM are **American** and **physically settled**: one contract delivers 100 shares, and a writer can be assigned any day, especially just before an ex-dividend date ([[exercise-assignment]]). Everything Kai has done with XYZ applies directly.

They are also where most contracts trade. As of July 2026 the OCC's year-to-date average was about 70.8 million contracts a day, split roughly into 35.2 million single-stock, 29.3 million ETF and 6.3 million index contracts. Concentration is high: in Q2 2026 SPY accounted for about 42% of ETF-option volume, and NVDA and TSLA for about 9% each of single-stock volume (Cboe, July 2026). SPY, QQQ and IWM also quote in one-cent steps at every price, which keeps their spreads tight ([[liquidity-spreads]]).

### ② Index options: SPX, XSP and the notional problem

**SPX** options are written on the S&P 500 index itself: **European, cash-settled, $100 per index point**. Standard third-Friday SPX options are **AM-settled** on the Special Opening Quotation; SPX Weeklys (SPXW), including daily 0DTE expiries, are **PM-settled** at the close. **XSP** is the same design at one-tenth the size; **NDX** (Nasdaq-100) and **RUT** (Russell 2000) options follow the same European, cash-settled pattern.

The design has practical consequences. Because SPX cannot be exercised early, a spread's short leg is never assigned before expiry, so the structure you opened is the structure you hold. Because it settles in cash, nobody needs to own, borrow or deliver 500 stocks. The price you pay is AM-settlement risk on the monthlies and a contract so large that small accounts need XSP instead. Quotes are in index points, so an SPX put quoted at 12.40 costs \(12.40 \times 100 = \$1{,}240\).

Index options are the smallest slice by contract count (about 9% of OCC volume) and the largest by money at stake, because each contract is big. The dollar exposure of one contract is its **notional**:

$$
\text{notional} = m \times S, \qquad n = \frac{N}{m \times S}
$$

where \(m\) is the multiplier (dollars per point or per share, 100 for all of these), \(S\) the index or share price, \(N\) the exposure you want to cover and \(n\) the number of contracts needed.

> [!EXAMPLE] One exposure, three contracts (S&P 500 at 7,743)
> SPX: \(100 \times 7{,}743 = \$774{,}300\) per contract. XSP: \(100 \times 774.3 = \$77{,}430\). SPY: about the same as XSP, since SPY trades near one-tenth of the index level.
> To cover \(N = \$774{,}300\): \(n = 774{,}300 / 774{,}300 = 1\) SPX contract, or \(774{,}300 / 77{,}430 = 10\) XSP contracts, or about 10 SPY contracts. Ten contracts means ten times the commissions, but also the ability to cover smaller amounts precisely.

::demo[product-map-compare]

SPX dominates index trading: in Q2 2026 it was about 81% of US index-option volume, and XSP set a monthly record in August 2026 at about 241,000 contracts a day (Cboe). The first SPX options were listed by the CBOE in 1983.

### ③ A US tax difference: Section 1256

> [!WARN] US tax, not advice
> Under US Internal Revenue Code Section 1256, options on broad-based indexes (for example SPX, XSP, NDX, RUT and VIX) are treated as “nonequity options”: gains and losses are counted **60% long-term and 40% short-term regardless of holding period**, and open positions are **marked to market at year-end** (reported on IRS Form 6781). **SPY options are equity options, not Section 1256 contracts.** Tax treatment depends on your situation and jurisdiction; check with a tax professional. This course gives no tax rates or tax advice.

This is one reason active US traders sometimes prefer SPX or XSP over SPY for index exposure. It is not a reason to trade, and it cuts both ways (year-end marking can create taxable gains on positions you still hold).

### ④ Expiries, 0DTE and trading hours in 2026

Expiries have multiplied. Cboe added Tuesday and Thursday SPX Weeklys in April and May 2022, so **SPX now expires every trading day**. Since January 26, 2026, Nasdaq may list Monday and Wednesday expiries (in addition to Friday weeklies) for nine names: TSLA, NVDA, AAPL, IBIT, AMZN, META, AVGO, GOOGL and MSFT.

<figure>
<svg viewBox="0 0 700 222" role="img" aria-label="Which products expire on which weekday">
<text x="220" y="26" text-anchor="middle" class="fx-t-b">Mon</text><text x="320" y="26" text-anchor="middle" class="fx-t-b">Tue</text><text x="420" y="26" text-anchor="middle" class="fx-t-b">Wed</text><text x="520" y="26" text-anchor="middle" class="fx-t-b">Thu</text><text x="620" y="26" text-anchor="middle" class="fx-t-b">Fri</text>
<text x="20" y="64" class="fx-t">SPX / SPXW</text>
<rect x="185" y="44" width="70" height="30" rx="5" class="fx-hl"/><rect x="285" y="44" width="70" height="30" rx="5" class="fx-hl"/><rect x="385" y="44" width="70" height="30" rx="5" class="fx-hl"/><rect x="485" y="44" width="70" height="30" rx="5" class="fx-hl"/><rect x="585" y="44" width="70" height="30" rx="5" class="fx-hl"/>
<text x="20" y="114" class="fx-t">9 large names*</text>
<rect x="185" y="94" width="70" height="30" rx="5" class="fx-blue"/><rect x="385" y="94" width="70" height="30" rx="5" class="fx-blue"/><rect x="585" y="94" width="70" height="30" rx="5" class="fx-blue"/>
<text x="20" y="164" class="fx-t">typical stock</text>
<rect x="572" y="144" width="96" height="30" rx="5" class="fx-box2"/>
<text x="620" y="164" text-anchor="middle" class="fx-t-sm">weekly / monthly</text>
<text x="620" y="190" text-anchor="middle" class="fx-t-sm">(monthly = 3rd Friday)</text>
<text x="20" y="214" class="fx-t-sm">* TSLA, NVDA, AAPL, IBIT, AMZN, META, AVGO, GOOGL, MSFT (Mon/Wed since Jan 26, 2026)</text>
</svg>
<figcaption>Figure 2 · A week of expiries as of September 2026. SPX has one every weekday, nine heavily traded names have three a week, and most single stocks have at most a Friday weekly plus the third-Friday monthly. More expiries mean more contracts expiring the same day they are traded.</figcaption>
</figure>

> [!FACT] 0DTE and extended hours, as of September 2026
> Zero-days-to-expiry options reached a record **66.2% of SPX option volume in July 2026** (Cboe). Across all US listed options, 0DTE was about 24% of volume in 2025. SPX and VIX options trade in Cboe's Global Trading Hours, **8:15 p.m. to 9:25 a.m. ET** plus a 4:15–5:00 p.m. curb session, so nearly 24 hours on weekdays; pre-market (7:30–9:25 a.m.) and post-market (4:00–4:15 p.m.) sessions for about 20 single-stock option classes were scheduled to launch on **July 13, 2026**.

Who trades these same-day contracts is debated. Cboe estimates that retail traders account for roughly half of SPX 0DTE volume (about 50–60% in its May 2025 analysis), and reports that over 95% of SPX 0DTE trades are limited-risk positions such as long options or spreads; Cboe is the exchange that lists them, so it is an interested party. A Bank of England staff blog (December 2024) discussed ways same-day options could add fragility, while an academic working paper (Dim, Eraker and Vilkov, 2023) found market makers' net gamma to be positive on average. The evidence so far does not show 0DTE to be a systematic crash trigger, but the question remains open.

Why 0DTE behaves so differently (huge gamma, fast decay) and the debate over whether it destabilises markets are the subject of [[zero-dte]].

### ⑤ VIX options and options on futures

**VIX options** are European and cash-settled, written on the Cboe Volatility Index, the market's 30-day implied volatility for the S&P 500. VIX itself cannot be bought, so these options price off VIX futures for the same expiry rather than off the spot index; [[vix]] explains why that matters. VIX options were launched in February 2006.

**Options on futures** (for example on E-mini S&P 500 futures, or CME's bitcoin options, launched January 13, 2020) exercise into a **futures position**, not shares or cash, and are margined under futures rules. They are priced with the Black-76 variant of Black-Scholes, which uses the futures price as its input ([[futures-basis]]). CME launched round-the-clock (24/7) trading of its crypto futures and options on May 29, 2026.

### ⑥ Crypto options: Deribit, IBIT and CME

Crypto options come in three very different wrappers:

| | Deribit and other crypto exchanges | IBIT options (US ETF) | CME bitcoin options |
|---|---|---|---|
| Underlying | bitcoin or ether itself | shares of a spot-bitcoin ETF | CME bitcoin futures |
| Exercise / settlement | European, cash-settled, often in the coin | American, 100 fund shares | into a futures position |
| Clearing | the exchange itself | OCC | CME Clearing |
| Hours | 24/7 | US options hours | 24/7 since May 29, 2026 |

**Deribit** has long been the largest crypto-options venue; Coinbase agreed to buy it in May 2025 and closed the acquisition on August 14, 2025. In H1 2026 it had about 49% of crypto-options notional, ahead of Bybit, Binance and OKX (CoinGlass, a secondary aggregator). Coinbase scheduled the migration of Coinbase International Exchange's institutional derivatives onto Deribit for September 9, 2026 (completion not independently confirmed).

**IBIT options** (on BlackRock's spot-bitcoin ETF) launched on November 19, 2024, with about 354,000 contracts on the first day. Exercise delivers **ETF shares, not bitcoin**. IBIT position limits were raised from 25,000 contracts at launch to 250,000 in 2025, and an SEC-approved rule raised them to 1,000,000 contracts in July 2026 (as reported). IBIT's options open interest briefly exceeded Deribit's bitcoin-options open interest in April 2026 (as reported), a sign of how fast the regulated wrapper has grown. How coin-margined options, BTC volatility and weekend trading work is the subject of [[crypto-options]].

| Question you ask | Feature that answers it | Where it was covered |
|---|---|---|
| Do I want shares, or only cash? | physical vs cash settlement | [[exercise-assignment]] |
| Can a short leg be taken away early? | American vs European | [[exercise-assignment]] |
| Is one contract too big for my account? | notional \(m \times S\) | this lesson, [[margin-approval]] |
| Can I get in and out cheaply? | spread, volume, open interest | [[liquidity-spreads]] |
| When can I trade, and who clears it? | hours, clearing house | this lesson |

**How to choose.** No product is best in general; the questions are practical. Do you want shares delivered, or cash? Can you live with early assignment? How much exposure does one contract carry relative to your account? Do you need to trade outside US hours? Does the US tax treatment matter to you? Try the main demo below with your own answers. It describes which features match; it does not recommend a trade.

## @analogy
Think of the product map as **shipping the same parcel by different carriers**. The parcel (the payoff shape) is identical. But one carrier delivers the goods to your door (physical settlement), another only sends you a refund equal to their value (cash settlement). One lets the recipient demand delivery any day (American), another only on the scheduled date (European). Some carriers only take big crates (SPX's $774,000 per contract), others small boxes (XSP, SPY). Some work weekends (crypto venues, CME 24/7), some keep office hours. And some route through a customs regime with different paperwork (Section 1256 versus ordinary equity treatment).

Choosing a carrier never changes what is in the parcel, but it changes when and how it arrives, what can go wrong on the way, and the paperwork afterwards.

Where the analogy breaks: a carrier does not change the contents' value. With options it can, subtly: an American option can be worth more than its European twin (early exercise), and a futures option is priced off the futures price, not the spot, so the “same” strike can mean a different thing on each product.

## @misconceptions
- **“SPY and SPX options are the same thing in different sizes.”** — SPY options are American and deliver ETF shares (early assignment possible); SPX options are European and settle in cash, with AM settlement for the standard monthlies.
- **“IBIT options are bitcoin options.”** — Exercise delivers shares of an ETF, cleared by the OCC in US hours. Deribit options settle on bitcoin itself, 24/7, outside the OCC system.
- **“Index options are a niche because their volume is small.”** — They are about 9% of US contracts but each SPX contract controls roughly $774,000, so by money at stake they are huge.
- **“All options expire on the third Friday.”** — That is the standard monthly. SPX expires every weekday, nine large names have Monday, Wednesday and Friday expiries, and many products list weeklies.
- **“Index options are always better because of taxes.”** — Section 1256 treatment is one difference among many (size, settlement, liquidity), it depends on your situation, and year-end marking can cut both ways. This is not tax advice.

## @takeaways
- Stock and ETF options (including SPY and IBIT) are American and deliver 100 shares, so early assignment is possible; they carry most US option volume.
- SPX, XSP, NDX and RUT options are European and cash-settled; SPX monthlies are AM-settled, SPXW (including 0DTE) PM-settled; one SPX contract controls \(100 \times\) the index, about $774,000.
- Contracts needed for an exposure: \(n = N/(m \times S)\); XSP and SPY let smaller accounts size index positions; in the US, broad-based index options fall under Section 1256 (check with a tax professional).
- SPX expires every weekday and 0DTE was about two-thirds of SPX volume in July 2026; crypto options come as Deribit coin options, IBIT share options and CME futures options, each with different settlement, clearing and hours.

## @quiz
1. Kai wants to avoid any chance of early assignment on a short index call. Which product fits that requirement?
   - [ ] SPY options
   - [x] SPX options
   - [ ] IBIT options
   - [ ] Any of them, if the call is out of the money
   > SPX options are European (exercise only at expiry) and cash-settled, so there is no early assignment and no share delivery. SPY and IBIT options are American and physically settled.
2. The S&P 500 is at 7,743. About how many XSP contracts give the same notional exposure as one SPX contract?
   - [ ] 1
   - [x] 10
   - [ ] 100
   - [ ] 7,743
   > XSP is one-tenth the size: \(100 \times 774.3 = \$77{,}430\) per contract versus \(\$774{,}300\) for SPX, so \(n = 774{,}300/77{,}430 = 10\).
3. What does exercising a call on IBIT deliver?
   - [ ] One bitcoin per contract
   - [ ] Cash equal to the bitcoin price minus the strike
   - [x] 100 shares of the IBIT exchange-traded fund
   - [ ] A CME bitcoin futures position
   > IBIT options are standard American ETF options cleared by the OCC: exercise delivers fund shares, not the coin. Deribit options settle on the coin itself; CME options exercise into futures.
4. Which statement about expiries is accurate as of September 2026?
   - [ ] All US options expire only on the third Friday of the month
   - [ ] Every US stock has daily expiries
   - [x] SPX expires every weekday, and nine large names may list Monday and Wednesday expiries in addition to Friday weeklies
   - [ ] 0DTE options are only available on crypto exchanges
   > Tuesday and Thursday SPX expiries were added in 2022, completing Monday to Friday. Since January 26, 2026 nine names (including TSLA, NVDA, AAPL and IBIT) may list Monday and Wednesday expiries.
5. Under US tax rules, how are gains on SPX options treated compared with SPY options?
   - [ ] Identically, because both track the S&P 500
   - [ ] SPX gains are tax-free
   - [ ] SPY options are Section 1256 contracts and SPX options are not
   - [x] SPX options fall under Section 1256 (60% long-term, 40% short-term, marked to market at year-end); SPY options are equity options and do not
   > Broad-based index options are “nonequity options” under Section 1256; SPY options, being options on an ETF, are equity options. The right treatment for you depends on your situation; check with a tax professional.

## @further
- [Cboe VIX methodology (PDF)](https://cdn.cboe.com/resources/vix/VIX_Methodology.pdf) — confirms AM-settled standard SPX and PM-settled SPX Weeklys, and how VIX is built from SPX options.
- [Cboe: Tuesday and Thursday SPX Weeklys (2022)](https://ir.cboe.com/news/news-details/2022/Cboe-to-Add-Tuesday-and-Thursday-Expirations-for-SPX-Weeklys-Options-04-13-2022/default.aspx) — the announcement that completed daily SPX expiries.
- [Nasdaq: Monday and Wednesday expirations (2026)](https://www.nasdaqtrader.com/MicroNews.aspx?id=OTA2026-3) — the notice listing the nine names with extra weekly expiries.
- [26 U.S. Code § 1256 (Cornell LII)](https://www.law.cornell.edu/uscode/text/26/1256) — the statute behind the 60/40 treatment of index options.
- [Nasdaq: IBIT options' first day](https://www.nasdaq.com/newsroom/nasdaq-listed-ibit-options-end-first-day-top-1-all-options-products-traded) — the launch of options on a spot-bitcoin ETF.

## @next
Kai can now read a chain, trade it, survive expiration day, fund it and pick the right product. But none of this says *why* the 30-day 100 call costs $2.45 and not $1 or $5. The next tier opens with that question in [[price-drivers]]: which six inputs set an option's price, and which way does each one push?
