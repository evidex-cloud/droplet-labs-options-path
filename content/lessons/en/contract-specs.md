---
id: contract-specs
prereqs: call-option, put-option
demo: contract-specs
---

# Contract Specs: Strike, Expiry, Premium & the ×100 Multiplier

## @hook
Before Kai places a single order, Kai has to read one line on a screen: `XYZ   261016C00105000`, quoted at 0.71. That string packs in five facts, and a sixth — the ×100 multiplier — is written nowhere yet multiplies everything. Get it right and “0.71” means $71 for the right to buy 100 shares worth $10,000; get it wrong and you are off by a factor of a hundred.

## @bridge
[[call-option]] and [[put-option]] defined the two rights and drew their shapes. This lesson reads their fine print: which terms an exchange fixes for every contract, how the expiry calendar works, how a per-share quote turns into dollars and into exposure, how to decode the industry-standard option symbol, and what happens to a contract when the company splits its stock. It serves Idea ④ — **risk**: you cannot manage a position you haven't sized correctly. Next comes [[moneyness]], the first way to compare one strike with another; and in [[option-chain]] you'll read a whole page of these contracts at once.

## @intuition
Before 1973, stock options in the US were private deals. A buyer and a seller agreed on a strike, an expiry and a size, and the contract stayed between them. Closing it early meant finding the same counterparty and negotiating again, so the market stayed small.

The listed options market changed one thing: **every term is standardised**. The exchange, not the two traders, decides which strikes and expiries exist, how many shares a contract covers, how and when it can be exercised, and how it settles. Two XYZ October 105 calls are then identical and interchangeable, so Kai can buy one from a stranger in the morning and sell it to a different stranger in the afternoon. A clearing house, the OCC, guarantees both sides ([[derivatives]]).

Picture Kai on Wednesday 16 September 2026, exactly 30 days before the October monthly expiry. Kai is considering selling the 105 call against the 100 shares — the covered call from the course's opening. The broker's screen shows:

> XYZ  16 Oct 2026  105  Call  —  bid 0.69 · ask 0.73

Here is every piece, including the ones not printed:

| Field | Kai's contract | What it means |
|---|---|---|
| Underlying | XYZ | the stock the option is written on |
| Type | call | the right to buy (a put is the right to sell) |
| Strike | $105 | the purchase price if exercised |
| Expiry | Friday 16 October 2026 | the third Friday of October: a standard monthly |
| Premium | about $0.71 a share (the mid of 0.69 and 0.73) | the option's price, quoted **per share** |
| Multiplier | 100 (not printed) | one contract = 100 shares |
| Exercise style | American (not printed) | can be exercised any business day until expiry |
| Settlement | physical (not printed) | exercise delivers 100 real shares |

> [!KAI] What one contract means for Kai
> Selling one October 105 call brings in \(0.71 \times 100 = \$71\) today. In exchange Kai promises to deliver **100 shares** at $105 if assigned — exactly the 100 shares Kai owns. That match is why a covered call is written one contract per 100 shares ([[covered-call]]). Had Kai sold two contracts, the second 100 shares would be promised but not owned.

The multiplier deserves the bold letters. Every price on an option screen is per share, but nobody can buy a single share's worth of an option. The smallest unit is one contract, so **cost = quote × 100 × contracts**, and the stock exposure you control is 100 shares per contract, however cheap the option looks.

<figure>
<svg viewBox="0 0 660 230" role="img" aria-label="Anatomy of the OCC option symbol XYZ 261016C00105000">
<text x="330" y="24" text-anchor="middle" class="fx-t-b">XYZ␣␣␣261016C00105000 — 21 characters, four fields</text>
<rect x="53" y="60" width="156" height="42" rx="6" class="fx-hl"/>
<rect x="209" y="60" width="156" height="42" rx="6" class="fx-blue"/>
<rect x="365" y="60" width="26" height="42" rx="6" class="fx-ok"/>
<rect x="391" y="60" width="208" height="42" rx="6" class="fx-gold"/>
<text x="66" y="87" text-anchor="middle" class="fx-t-b fx-mono">X</text>
<text x="92" y="87" text-anchor="middle" class="fx-t-b fx-mono">Y</text>
<text x="118" y="87" text-anchor="middle" class="fx-t-b fx-mono">Z</text>
<text x="144" y="87" text-anchor="middle" class="fx-t-sm fx-mono">␣</text>
<text x="170" y="87" text-anchor="middle" class="fx-t-sm fx-mono">␣</text>
<text x="196" y="87" text-anchor="middle" class="fx-t-sm fx-mono">␣</text>
<text x="222" y="87" text-anchor="middle" class="fx-t-b fx-mono">2</text>
<text x="248" y="87" text-anchor="middle" class="fx-t-b fx-mono">6</text>
<text x="274" y="87" text-anchor="middle" class="fx-t-b fx-mono">1</text>
<text x="300" y="87" text-anchor="middle" class="fx-t-b fx-mono">0</text>
<text x="326" y="87" text-anchor="middle" class="fx-t-b fx-mono">1</text>
<text x="352" y="87" text-anchor="middle" class="fx-t-b fx-mono">6</text>
<text x="378" y="87" text-anchor="middle" class="fx-t-b fx-mono">C</text>
<text x="404" y="87" text-anchor="middle" class="fx-t-b fx-mono">0</text>
<text x="430" y="87" text-anchor="middle" class="fx-t-b fx-mono">0</text>
<text x="456" y="87" text-anchor="middle" class="fx-t-b fx-mono">1</text>
<text x="482" y="87" text-anchor="middle" class="fx-t-b fx-mono">0</text>
<text x="508" y="87" text-anchor="middle" class="fx-t-b fx-mono">5</text>
<text x="534" y="87" text-anchor="middle" class="fx-t-b fx-mono">0</text>
<text x="560" y="87" text-anchor="middle" class="fx-t-b fx-mono">0</text>
<text x="586" y="87" text-anchor="middle" class="fx-t-b fx-mono">0</text>
<text x="378" y="52" text-anchor="middle" class="fx-t-ok">C = call, P = put</text>
<line x1="56" y1="112" x2="206" y2="112" class="fx-line"/>
<line x1="212" y1="112" x2="362" y2="112" class="fx-line"/>
<line x1="394" y1="112" x2="596" y2="112" class="fx-line"/>
<text x="131" y="132" text-anchor="middle" class="fx-t">root symbol</text>
<text x="131" y="150" text-anchor="middle" class="fx-t-sm">XYZ, padded with</text>
<text x="131" y="166" text-anchor="middle" class="fx-t-sm">spaces to 6 characters</text>
<text x="287" y="132" text-anchor="middle" class="fx-t">expiry YYMMDD</text>
<text x="287" y="150" text-anchor="middle" class="fx-t-sm">26 · 10 · 16</text>
<text x="287" y="166" text-anchor="middle" class="fx-t-sm">= 16 October 2026</text>
<text x="495" y="132" text-anchor="middle" class="fx-t">strike × 1000, 8 digits</text>
<text x="495" y="150" text-anchor="middle" class="fx-t-sm">00105000 ÷ 1000 = 105.000</text>
<text x="495" y="166" text-anchor="middle" class="fx-t-sm">(three implied decimals)</text>
<text x="330" y="206" text-anchor="middle" class="fx-t-sm">Not in the symbol, yet part of the contract: the multiplier (100), exercise style, settlement type.</text>
</svg>
<figcaption>Figure 1 · The OCC option symbol (the OSI format) for Kai's October 105 call. Each field has a fixed width, so any software can split it without separators. The strike carries three implied decimals, which is how a $97.50 strike becomes 00097500.</figcaption>
</figure>

::demo[contract-specs-notional]

> [!THINK] A friend sees the XYZ 110 call quoted at 0.14 and buys 50 contracts “for seven dollars”. What did the friend really spend, and how much stock does the position control?
> Two multiplications. Try them before you open the answer.
> ---
> Spent: \(0.14 \times 100 \times 50 = \$700\), not $7. Controlled: \(50 \times 100 = 5{,}000\) shares, a notional of \(5{,}000 \times \$100 = \$500{,}000\). If XYZ finishes below $110, all $700 is gone; if it jumps to $115, the position is worth \((115 - 110) \times 5{,}000 = \$25{,}000\). A tiny quote does not mean a tiny position.

We'll take it in five parts:

- **① What the exchange standardises**: underlying, strikes, style, settlement
- **② The expiry calendar**: monthlies, weeklies, dailies and expiry day
- **③ Premium, multiplier and notional**: turning quotes into dollars
- **④ Reading the OCC symbol**
- **⑤ When the stock changes: contract adjustments, and the 2026 landscape**

## @mechanics
### ① What the exchange standardises

For each listed option, the exchange and the OCC fix:

- **The underlying and the deliverable.** For a standard US stock or ETF option, the deliverable is 100 shares (the OCC's product specifications list the ×100 multiplier for equity, ETF and SPX options).
- **The strike grid.** Exchanges list a ladder of strikes around the current price and add new ones as the stock moves. Spacing is typically $1, $2.50 or $5 for ordinary stocks, tighter for very active names, wider for high-priced ones; more strikes are listed near the money than far away. Kai cannot pick a strike of $103.17 — only one from the grid.
- **The exercise style.** **American-style** options can be exercised on any business day up to expiry; nearly all US stock and ETF options (SPY, QQQ, IWM included) are American. **European-style** options can be exercised only at expiry; the big index options, such as SPX, are European.
- **The settlement.** **Physical settlement** delivers the underlying: exercising an XYZ call means paying \(K \times 100\) and receiving 100 shares. **Cash settlement** pays only the difference in cash; SPX options settle this way, because nobody can deliver “one S&P 500 index”.

| | XYZ (stock option) | SPX (index option) |
|---|---|---|
| Multiplier | 100 shares | $100 × the index level |
| Exercise style | American | European |
| Settlement | physical: 100 shares change hands | cash: the in-the-money amount × 100 |
| Early assignment possible? | yes | no |

These differences matter most around expiry and early assignment, which get their own lesson, [[exercise-assignment]], and the full product comparison is in [[product-map]].

### ② The expiry calendar

Every listed option has a fixed expiration date drawn from a calendar the exchange publishes.

- **Standard monthly expiry: the third Friday of the month** (moved one day earlier if that Friday is an exchange holiday). In October 2026 the Fridays fall on the 2nd, 9th, 16th, 23rd and 30th, so the monthly is the 16th.
- **Weeklys** expire on the other Fridays, and for the busiest products on other weekdays too (see the FACT below).
- **Long-dated options (LEAPS)** run for more than a year.

On expiry day, trading in standard stock options stops at the close. The holder's deadline for final exercise instructions is 5:30 p.m. ET, and the OCC automatically exercises any expiring option that is **at least $0.01 in the money**, unless the holder instructs otherwise. Shares delivered by exercise or assignment settle one business day later (T+1, the US standard since 28 May 2024).

The course's “30-day option” is a teaching convention: time to expiry \(T\) is measured in calendar days divided by 365, so Kai's October option on 16 September has \(T = 30/365 = 0.0822\) years. Real expiries fall on listed dates, and the demo below computes \(T\) from the calendar.

> [!FACT] More expiries than ever (as of 2026)
> Cboe added Tuesday and Thursday SPX expirations in April–May 2022, so **SPX now expires every trading day**. Options expiring the same day they trade (0DTE) made up about **two-thirds of SPX volume in July 2026** (a record 66.2%). For single stocks, the SEC approved Nasdaq's rule allowing **Monday and Wednesday expirations** for a short list of heavily traded names, listed from **26 January 2026**. See [[zero-dte]] for what such short-dated options do.

### ③ Premium, multiplier and notional

The premium is quoted per share, so the money that changes hands is:

$$
\text{cost} = \text{premium} \times 100 \times n, \qquad \text{notional} = S \times 100 \times n
$$

where:

- **premium** is the quoted option price per share;
- \(n\) is the number of contracts;
- \(S\) is the current stock price;
- **notional** is the market value of the shares the contracts refer to — the size of the stock position the options stand in for.

> [!EXAMPLE] Kai's two candidate trades, in dollars
> - Buy three 30-day 100 calls at 2.45: \(\text{cost} = 2.45 \times 100 \times 3 = \$735\); notional \(= 100 \times 100 \times 3 = \$30{,}000\). Kai pays 2.45% of the notional for the right to the upside of $30,000 of stock.
> - Sell one October 105 call at 0.71: Kai *receives* \(0.71 \times 100 \times 1 = \$71\), against a notional of $10,000 — exactly the 100 shares Kai owns.

Two practical details sit on top of the formula:

- **Quotes come as a bid and an ask.** The bid is the best price someone will pay; the ask, the best price someone will sell at; the mid is their average. Buying at the ask and selling at the bid costs the spread — [[liquidity-spreads]] measures that cost.
- **Prices move in ticks.** In the penny program that covers the most active classes, options trade in $0.01 steps below $3.00 and $0.05 steps at $3.00 and above; a few very liquid ETFs (SPY, QQQ, IWM) trade in pennies at every price.

<figure>
<svg viewBox="0 0 680 230" role="img" aria-label="One row of an option chain, annotated">
<defs><marker id="contract-specs-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<text x="170" y="30" text-anchor="middle" class="fx-t-b">CALLS</text>
<text x="510" y="30" text-anchor="middle" class="fx-t-b">PUTS</text>
<text x="120" y="52" text-anchor="middle" class="fx-t-sm">bid</text>
<text x="220" y="52" text-anchor="middle" class="fx-t-sm">ask</text>
<text x="340" y="52" text-anchor="middle" class="fx-t-sm">strike</text>
<text x="460" y="52" text-anchor="middle" class="fx-t-sm">bid</text>
<text x="560" y="52" text-anchor="middle" class="fx-t-sm">ask</text>
<rect x="70" y="60" width="540" height="40" rx="8" class="fx-box"/>
<rect x="300" y="60" width="80" height="40" class="fx-hl"/>
<text x="120" y="86" text-anchor="middle" class="fx-t-b">0.69</text>
<text x="220" y="86" text-anchor="middle" class="fx-t-b">0.73</text>
<text x="340" y="86" text-anchor="middle" class="fx-t-b">105</text>
<text x="460" y="86" text-anchor="middle" class="fx-t-b">5.30</text>
<text x="560" y="86" text-anchor="middle" class="fx-t-b">5.45</text>
<line x1="218" y1="104" x2="204" y2="136" class="fx-line" marker-end="url(#contract-specs-ah)"/>
<text x="198" y="152" text-anchor="middle" class="fx-t-sm">buy now at the ask:</text>
<text x="198" y="168" text-anchor="middle" class="fx-t-sm">0.73 × 100 = $73</text>
<line x1="118" y1="104" x2="88" y2="136" class="fx-line" marker-end="url(#contract-specs-ah)"/>
<text x="78" y="152" text-anchor="middle" class="fx-t-sm">sell now at the bid:</text>
<text x="78" y="168" text-anchor="middle" class="fx-t-sm">0.69 × 100 = $69</text>
<text x="350" y="130" text-anchor="middle" class="fx-t-hl">mid = (0.69 + 0.73) ÷ 2</text>
<text x="350" y="146" text-anchor="middle" class="fx-t-hl">= 0.71 (the model price)</text>
<line x1="510" y1="104" x2="510" y2="136" class="fx-line" marker-end="url(#contract-specs-ah)"/>
<text x="510" y="152" text-anchor="middle" class="fx-t-sm">above $3: $0.05 ticks,</text>
<text x="510" y="168" text-anchor="middle" class="fx-t-sm">spread 0.15 = $15 a contract</text>
<text x="340" y="206" text-anchor="middle" class="fx-t-sm">XYZ at $100, expiry 16 Oct 2026 (30 days) · quotes illustrative, per share</text>
</svg>
<figcaption>Figure 2 · One row of Kai's option chain. Calls on one side, puts on the other, the strike in the middle. Every number is per share: the real money is ×100. The gap between bid and ask is a cost paid by whoever trades immediately.</figcaption>
</figure>

### ④ Reading the OCC symbol

Brokers, exchanges and data vendors identify each contract with a 21-character code in the format of the industry's Options Symbology Initiative (OSI):

$$
\underbrace{\texttt{XYZ\ \ \ }}_{\text{root, 6}}\ \underbrace{\texttt{261016}}_{\text{YYMMDD}}\ \underbrace{\texttt{C}}_{\text{C/P}}\ \underbrace{\texttt{00105000}}_{K \times 1000,\ 8 \text{ digits}}
$$

where the **root** is the underlying's symbol padded with spaces to six characters, **YYMMDD** is the expiry date, **C or P** is the type, and the last eight digits are the strike multiplied by 1,000 and zero-padded, so the strike can carry three decimals without a decimal point.

> [!EXAMPLE] Decoding strikes
> - \(105 \times 1000 = 105{,}000\) → `00105000`.
> - \(97.5 \times 1000 = 97{,}500\) → `00097500`.
> - A put on XYZ expiring 20 November 2026 with a $95 strike: `XYZ   261120P00095000` (20 November 2026 is the third Friday of November).

You will rarely type these by hand, but reading one lets you confirm at a glance that an order ticket, a statement or a data file refers to the contract you meant. A single wrong character — `P` for `C`, `1106` for `1016` — is a different contract.

### ⑤ When the stock changes: contract adjustments

Listed contracts are standard, but companies don't sit still. When an event changes what a share *is*, the OCC adjusts the outstanding options so that neither buyer nor seller gains or loses from the event itself.

- **An even stock split** (say 2-for-1): each XYZ 100 call typically becomes two 50 calls, each still on 100 shares. The position is economically unchanged.
- **An uneven split** (say 3-for-2): the contract usually keeps its count but the deliverable becomes 150 shares and the strike is scaled down (100 → 66.67). Such a contract is **non-standard**: its quote no longer means “per share of a 100-share contract”, and it often trades under a modified symbol.
- **Ordinary cash dividends** are not adjusted: the market expects them and prices them in ([[rho-carry]]). Large special dividends, mergers and spin-offs can trigger adjustments.

> [!WARN] Adjusted contracts are traps for the unwary
> A non-standard contract may deliver 150 shares, or 100 shares plus cash, or shares of two companies. Its quote can look cheap or expensive relative to the “normal” chain for reasons that have nothing to do with value. Before trading anything with an unusual symbol or deliverable, read the OCC adjustment memo; [[common-traps]] collects the classic mistakes.

## @analogy
An option contract is like a **concert ticket** printed to a standard template.

The artist and venue are the underlying. The date on the ticket is the expiry — after it, the ticket is worthless paper. The seat price printed on the ticket is the strike. The ticket's type says whether you may enter (call) or leave early and get refunded (put). What you pay a reseller today for the ticket is the premium, and the reseller's buy and sell prices are the bid and the ask.

Now the twist: every ticket admits **a group of 100 people**, and the resale price is quoted *per person*. A ticket listed at 0.71 costs $71. And the barcode on the back — `XYZ   261016C00105000` — encodes the show, the date, the type and the seat price, so any gate can scan it.

If the band splits into two acts (a stock split), the organiser reissues the tickets so that holders get the same show in a different form; occasionally the new tickets are odd — 150 people per ticket — and you must read them carefully.

Where the analogy breaks: a concert ticket has a fixed face value and a buyer always wants to attend. An option's value moves every second with XYZ, and at expiry the holder only “attends” — exercises — if it pays.

## @misconceptions
- **“The quote is the price of one contract.”** — It is the price per share. One contract costs the quote × 100: 0.71 means $71.
- **“A cheap option is a small position.”** — Cost and exposure are different things. Fifty 110 calls cost $700 but refer to 5,000 shares, a $500,000 notional.
- **“Options expire at midnight, so I have the whole evening.”** — Trading in standard stock options stops at the close on expiry day, and exercise instructions have a firm deadline (5:30 p.m. ET for the holder's final decision).
- **“All options are American and settle in shares.”** — SPX and other big index options are European and cash-settled; check each product's specs ([[product-map]]).
- **“After a split my option is broken.”** — The OCC adjusts it so its economic value is preserved; what changes is the strike, the number of contracts or the deliverable.

## @takeaways
- Listed options standardise every term — underlying, strike grid, expiry, multiplier, exercise style, settlement — so any two identical contracts are interchangeable and can be closed with anyone.
- Quotes are per share: \(\text{cost} = \text{premium} \times 100 \times n\), and each contract refers to 100 shares of notional \(S \times 100\).
- The standard monthly expiry is the third Friday; weeklies and, for SPX, daily expiries fill the calendar; auto-exercise applies at $0.01 in the money.
- The OCC symbol is root (6) + YYMMDD + C/P + strike × 1000 (8 digits): `XYZ   261016C00105000` is the XYZ 16 Oct 2026 105 call.
- Splits and special events trigger contract adjustments; non-standard deliverables need extra care.

## @quiz
1. The XYZ 30-day 100 call is quoted at 2.45. What do three contracts cost?
   - [ ] $7.35
   - [ ] $245
   - [ ] $73.50
   - [x] $735
   > \(2.45 \times 100 \times 3 = \$735\). $7.35 forgets the multiplier; $245 is one contract.
2. What does the symbol `XYZ   261120P00095000` describe?
   - [ ] An XYZ call with a strike of $95,000 expiring 26 November 2020
   - [x] An XYZ put with a $95 strike expiring 20 November 2026
   - [ ] An XYZ put with a $9.50 strike expiring 26 November 2020
   - [ ] An XYZ call with a $950 strike expiring 20 November 2026
   > After the padded root come YYMMDD (26-11-20 = 20 November 2026), then the type (P = put), then the strike × 1000 in eight digits: 00095000 ÷ 1000 = 95.
3. Kai owns 100 shares of XYZ and wants to sell covered calls. How many contracts can Kai sell and still have every promised share covered?
   - [x] One
   - [ ] One hundred
   - [ ] Ten
   - [ ] As many as the premium allows
   > Each contract obliges the seller to deliver 100 shares if assigned. Kai's 100 shares cover exactly one contract; a second would be a promise to deliver shares Kai doesn't own.
4. Which date is the standard monthly expiry in October 2026 (1 October is a Thursday)?
   - [ ] Friday 2 October
   - [ ] Friday 9 October
   - [x] Friday 16 October
   - [ ] Friday 30 October
   > The Fridays are the 2nd, 9th, 16th, 23rd and 30th; the third one, the 16th, is the monthly. The others are weekly expiries.
5. XYZ splits 2-for-1. What typically happens to Kai's one XYZ 100 call?
   - [ ] It is cancelled and the premium refunded
   - [ ] It stays one contract on 100 shares with a $100 strike
   - [x] It becomes two contracts on 100 shares each with a $50 strike
   - [ ] It becomes one contract on 200 shares with a $100 strike
   > The OCC adjusts contracts so the position's economics are unchanged: twice the shares at half the price. In an even split that usually means twice the contracts at half the strike; the right to buy 200 shares at $50 equals the old right to buy 100 at $100.

## @further
- [Equity options product specifications (OCC)](https://www.theocc.com/market-data/market-data-reports/series-and-trading-data/equity-options-product-specifications) — the official list of contract terms, including the ×100 multiplier.
- [Characteristics and Risks of Standardized Options (OCC)](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the disclosure document; its chapters on standardised terms and adjustments are the primary source.
- [Options exercise FAQ (Options Industry Council)](https://www.optionseducation.org/referencelibrary/faq/options-exercise) — expiry-day deadlines and automatic exercise.
- [Penny increments (Options Industry Council)](https://www.optionseducation.org/news/penny-increments) — how option tick sizes work.
- [The evolution of same-day options trading (Cboe)](https://www.cboe.com/insights/posts/the-evolution-of-same-day-options-trading/) — how weekly and daily expirations were added.
- [Option symbol (Wikipedia)](https://en.wikipedia.org/wiki/Option_symbol) — the OSI format and its history.

## @next
Kai can now read a contract and price it in dollars. But why does the 105 call cost $0.71 while the 95 call costs $5.82, on the same stock and the same day? The first step to an answer is to ask how far each strike is from paying — in the money, at the money or out of the money.
