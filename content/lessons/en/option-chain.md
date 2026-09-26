---
id: option-chain
prereqs: contract-specs, moneyness, payoff-diagrams, probability-ev
demo: option-chain
---

# Reading the Option Chain: Everything on One Quote Board

## @hook
Open any broker, type a ticker, tap “options”, and a wall of numbers appears. It looks like noise, but it is one tidy table: every strike and expiry, what you would pay, what you would receive, and how much movement the market is pricing in. Learn five columns and the wall becomes a map.

## @bridge
So far we have met the contract on paper: its terms ([[contract-specs]]), where a strike sits relative to the price ([[moneyness]]), its shape at expiry ([[payoff-diagrams]]) and its odds ([[probability-ev]]). The Markets & Mechanics stage steps into the real market, and the first thing the market shows you is the **option chain**. This lesson answers one question: what is each number on that screen telling you? It touches Idea ② (no-arbitrage: parity is visible across every row) and Idea ③ (volatility: the chain quotes an implied vol for every contract).

## @intuition
Kai owns 100 shares of XYZ at $100 and has two jobs in mind: buy the 30-day 95 put as insurance, and sell the 30-day 105 call for income. Kai opens the broker app, taps the 30-day expiry and sees this (for illustration; XYZ is fictional, σ = 20%, r = 4%):

<figure>
<svg viewBox="0 0 720 300" role="img" aria-label="An annotated XYZ option chain, 30 days to expiry">
<text x="158" y="22" text-anchor="middle" class="fx-t-b">CALLS · right to buy</text>
<text x="360" y="22" text-anchor="middle" class="fx-t-b">Strike</text>
<text x="562" y="22" text-anchor="middle" class="fx-t-b">PUTS · right to sell</text>
<rect x="10" y="64" width="295" height="60" rx="4" class="fx-area-blue"/>
<rect x="415" y="154" width="295" height="60" rx="4" class="fx-area-blue"/>
<rect x="8" y="124" width="704" height="30" rx="4" class="fx-hl"/>
<text x="40" y="50" text-anchor="middle" class="fx-t-sm">OI</text>
<text x="100" y="50" text-anchor="middle" class="fx-t-sm">IV</text>
<text x="155" y="50" text-anchor="middle" class="fx-t-sm">Δ</text>
<text x="215" y="50" text-anchor="middle" class="fx-t-sm">Bid</text>
<text x="275" y="50" text-anchor="middle" class="fx-t-sm">Ask</text>
<text x="445" y="50" text-anchor="middle" class="fx-t-sm">Bid</text>
<text x="505" y="50" text-anchor="middle" class="fx-t-sm">Ask</text>
<text x="565" y="50" text-anchor="middle" class="fx-t-sm">Δ</text>
<text x="620" y="50" text-anchor="middle" class="fx-t-sm">IV</text>
<text x="680" y="50" text-anchor="middle" class="fx-t-sm">OI</text>
<line x1="10" y1="58" x2="710" y2="58" class="fx-grid"/>
<text x="40" y="84" text-anchor="middle" class="fx-t fx-mono">1,210</text><text x="100" y="84" text-anchor="middle" class="fx-t fx-mono">20.0%</text><text x="155" y="84" text-anchor="middle" class="fx-t fx-mono">0.97</text><text x="215" y="84" text-anchor="middle" class="fx-t fx-mono">10.25</text><text x="275" y="84" text-anchor="middle" class="fx-t fx-mono">10.45</text>
<text x="360" y="84" text-anchor="middle" class="fx-t-b">90</text>
<text x="445" y="84" text-anchor="middle" class="fx-t fx-mono">0.05</text><text x="505" y="84" text-anchor="middle" class="fx-t fx-mono">0.07</text><text x="565" y="84" text-anchor="middle" class="fx-t fx-mono">−0.03</text><text x="620" y="84" text-anchor="middle" class="fx-t fx-mono">20.0%</text><text x="680" y="84" text-anchor="middle" class="fx-t fx-mono">7,730</text>
<text x="40" y="114" text-anchor="middle" class="fx-t fx-mono">3,480</text><text x="100" y="114" text-anchor="middle" class="fx-t fx-mono">20.0%</text><text x="155" y="114" text-anchor="middle" class="fx-t fx-mono">0.84</text><text x="215" y="114" text-anchor="middle" class="fx-t fx-mono">5.75</text><text x="275" y="114" text-anchor="middle" class="fx-t fx-mono">5.85</text>
<text x="360" y="114" text-anchor="middle" class="fx-t-b">95</text>
<text x="445" y="114" text-anchor="middle" class="fx-t fx-mono">0.50</text><text x="505" y="114" text-anchor="middle" class="fx-t fx-mono">0.52</text><text x="565" y="114" text-anchor="middle" class="fx-t fx-mono">−0.16</text><text x="620" y="114" text-anchor="middle" class="fx-t fx-mono">20.0%</text><text x="680" y="114" text-anchor="middle" class="fx-t fx-mono">10,150</text>
<text x="40" y="144" text-anchor="middle" class="fx-t fx-mono">8,950</text><text x="100" y="144" text-anchor="middle" class="fx-t fx-mono">20.0%</text><text x="155" y="144" text-anchor="middle" class="fx-t fx-mono">0.53</text><text x="215" y="144" text-anchor="middle" class="fx-t fx-mono">2.42</text><text x="275" y="144" text-anchor="middle" class="fx-t fx-mono">2.48</text>
<text x="360" y="144" text-anchor="middle" class="fx-t-b">100</text>
<text x="445" y="144" text-anchor="middle" class="fx-t fx-mono">2.09</text><text x="505" y="144" text-anchor="middle" class="fx-t fx-mono">2.15</text><text x="565" y="144" text-anchor="middle" class="fx-t fx-mono">−0.47</text><text x="620" y="144" text-anchor="middle" class="fx-t fx-mono">20.0%</text><text x="680" y="144" text-anchor="middle" class="fx-t fx-mono">6,880</text>
<text x="40" y="174" text-anchor="middle" class="fx-t fx-mono">12,400</text><text x="100" y="174" text-anchor="middle" class="fx-t fx-mono">20.0%</text><text x="155" y="174" text-anchor="middle" class="fx-t fx-mono">0.22</text><text x="215" y="174" text-anchor="middle" class="fx-t fx-mono">0.70</text><text x="275" y="174" text-anchor="middle" class="fx-t fx-mono">0.72</text>
<text x="360" y="174" text-anchor="middle" class="fx-t-b">105</text>
<text x="445" y="174" text-anchor="middle" class="fx-t fx-mono">5.30</text><text x="505" y="174" text-anchor="middle" class="fx-t fx-mono">5.40</text><text x="565" y="174" text-anchor="middle" class="fx-t fx-mono">−0.78</text><text x="620" y="174" text-anchor="middle" class="fx-t fx-mono">20.0%</text><text x="680" y="174" text-anchor="middle" class="fx-t fx-mono">1,940</text>
<text x="40" y="204" text-anchor="middle" class="fx-t fx-mono">6,020</text><text x="100" y="204" text-anchor="middle" class="fx-t fx-mono">20.0%</text><text x="155" y="204" text-anchor="middle" class="fx-t fx-mono">0.06</text><text x="215" y="204" text-anchor="middle" class="fx-t fx-mono">0.13</text><text x="275" y="204" text-anchor="middle" class="fx-t fx-mono">0.15</text>
<text x="360" y="204" text-anchor="middle" class="fx-t-b">110</text>
<text x="445" y="204" text-anchor="middle" class="fx-t fx-mono">9.70</text><text x="505" y="204" text-anchor="middle" class="fx-t fx-mono">9.90</text><text x="565" y="204" text-anchor="middle" class="fx-t fx-mono">−0.94</text><text x="620" y="204" text-anchor="middle" class="fx-t fx-mono">20.0%</text><text x="680" y="204" text-anchor="middle" class="fx-t fx-mono">620</text>
<rect x="176" y="161" width="66" height="20" rx="4" class="fx-line-hl"/><text x="179" y="176" class="fx-t-hl">①</text>
<rect x="466" y="101" width="66" height="20" rx="4" class="fx-line-hl"/><text x="469" y="116" class="fx-t-hl">②</text>
<text x="215" y="256" text-anchor="middle" class="fx-t-hl">① Kai sells the 105 call at the bid: $0.70</text>
<text x="505" y="256" text-anchor="middle" class="fx-t-hl">② Kai buys the 95 put at the ask: $0.52</text>
<text x="20" y="282" class="fx-t-sm">Shaded blue = in the money · highlighted row = at the money (S = 100) · every price is per share, × 100 per contract</text>
</svg>
<figcaption>Figure 1 · The XYZ 30-day chain. Strikes run down the middle; calls in the left half, puts in the right half, so one row holds the call and the put with the same strike. You buy at the ask and sell at the bid. Calls are in the money above the highlighted row, puts below it.</figcaption>
</figure>

Four things jump out once you know where to look.

- **One row, one strike.** The row labelled 100 holds the 100 call in the left half and the 100 put in the right half. Reading across a row compares the two rights at the same price.
- **Two prices, not one.** Each contract shows a **bid** (the best price someone will pay you right now) and an **ask** (the best price someone will sell to you). Buying costs the ask; selling earns the bid.
- **Shading tells you moneyness.** Calls with strikes below 100 are already in the money, as are puts with strikes above 100 ([[moneyness]]). The highlighted row is at the money.
- **Every price is per share.** The 105 call's bid of 0.70 means \(0.70 \times 100 = \$70\) for one contract.

> [!KAI] Kai's two orders, read off the chain
> Insurance: the 95 put is offered at 0.52, so one contract costs \(0.52 \times 100 = \$52\) (the fair “mid” is 0.51, the course's standard $51).
> Income: the 105 call is bid at 0.70, so selling one contract brings in \(0.70 \times 100 = \$70\).
> Together that is a collar with a net credit of \(0.70 - 0.52 = \$0.18\) per share, a little less than the standard $0.20, because Kai crossed half the spread on each leg. The next two lessons, [[liquidity-spreads]] and [[orders]], show how to keep more of that.

> [!THINK] The 100 call and the 100 put are both exactly at the money. Why does the call cost 2.45 and the put only 2.12?
> Predict before you open the answer.
> ---
> Money has a time value. Owning the call instead of the stock lets you keep $100 in the bank for 30 days, so the call carries that interest and the put does not. Put-call parity makes it exact: \(C - P = S - Ke^{-rT} = 100 - 99.67 = 0.33\), and \(2.45 - 2.12 = 0.33\). The call and the put are equal where the strike equals the **forward**, 100.33, not the spot.

We'll take it in six parts:

- **① The layout**: rows, sides, expiry tabs
- **② Bid, ask, mid, last**: which price is “the price”
- **③ The other columns**: volume, open interest, IV and delta
- **④ Parity across a row**: the chain checks itself
- **⑤ What the whole chain tells you**: the implied move and the 25-delta strike
- **⑥ The chain in 2026**: how big it has become

## @mechanics
### ① The layout

A chain is a grid with three dimensions folded into two:

- **Expiry** is chosen with tabs across the top (for XYZ: 7, 30 and 60 days, plus the standard monthly on the third Friday; see [[contract-specs]]). One tab, one table.
- **Strike** runs down the centre column, usually in fixed steps (2.5 or 5 points for a $100 stock).
- **Call or put** is the side: calls in the left half, puts in the right half. Some apps stack them instead (calls on top, puts below) or let you show one side only; the logic is identical.

Most platforms shade in-the-money cells and draw a line or highlight at the current price. On a busy chain, find the spot line first: everything above it is a lower strike (ITM calls, OTM puts), everything below a higher strike.

| Column | Meaning | XYZ 30-day 100 call |
|---|---|---|
| Bid | best price a buyer will pay now | 2.42 |
| Ask | best price a seller will accept now | 2.48 |
| Mid / mark | halfway between bid and ask | 2.45 |
| Last | price of the most recent trade (may be old) | e.g. 2.60 |
| Volume | contracts traded today | e.g. 4,300 |
| Open interest | contracts still open (updated overnight) | 8,950 |
| IV | implied volatility backed out of the price | 20.0% |
| Δ | delta: option move per $1 stock move | 0.53 |

### ② Bid, ask, mid, last

The bid and ask come from market makers and from other traders' limit orders ([[market-makers]]). Between them sits the most useful single number on the screen:

$$
\text{mid} = \frac{\text{bid} + \text{ask}}{2}, \qquad \text{spread} = \text{ask} - \text{bid}
$$

where the **mid** (many apps call it the *mark*) is the best quick estimate of fair value, and the **spread** is what you give up if you buy at the ask and later sell at the bid.

> [!EXAMPLE] The 100 call in dollars
> Bid 2.42, ask 2.48: \(\text{mid} = (2.42 + 2.48)/2 = 2.45\) and \(\text{spread} = 0.06\).
> Buying one contract at the ask costs \(2.48 \times 100 = \$248\). Its fair value is \(2.45 \times 100 = \$245\). The \(\$3\) difference is half the spread, the price of trading *right now*. Selling it straight back at the bid would return \(\$242\): a round trip costs \(0.06 \times 100 = \$6\) before any commission.

**Last** is the price of the most recent trade. On a busy contract it sits between bid and ask; on a quiet one it can be hours old. If the 100 call last traded at 2.60 at 10:05 a.m. when XYZ was $100.30, that print tells you nothing about what you can trade at now, when the quote is 2.42 / 2.48.

> [!WARN] Two classic misreadings
> Treating **last** as the current price, and forgetting the **× 100**. A 0.14 quote on the 110 call is \(\$14\) per contract, not 14 cents, and ten contracts of the 100 call at 2.48 is \(2.48 \times 100 \times 10 = \$2{,}480\).

Why is the 95 call quoted 5.75 / 5.85 (steps of five cents) while the 95 put is 0.50 / 0.52 (steps of one cent)? **Tick sizes.** Under the Penny Interval Program, made permanent in 2020, options in the program quote in $0.01 below $3.00 and $0.05 at or above $3.00; SPY, QQQ and IWM options quote in pennies at every price (as of 2026). Expensive options on most names therefore have wider minimum spreads.

### ③ The other columns: volume, open interest, IV and delta

**Volume** counts contracts traded today; **open interest (OI)** counts contracts still open at the end of the previous day. High numbers on both usually mean tight quotes and easy exits. The two behave differently (a trade can raise, lower or leave OI unchanged), which is the subject of [[liquidity-spreads]].

**IV (implied volatility)** is the volatility that makes Black-Scholes reproduce the option's mid price. Every contract gets its own IV. Our illustrative chain shows a flat 20%; a real equity chain shows lower-strike puts with *higher* IV than upper-strike calls, the skew you will meet in [[smile-skew]]. IV is how traders compare prices across strikes and expiries: a 0.14 option and a 5.80 option are hard to compare in dollars, easy to compare in vol ([[implied-vol]]).

**Delta (Δ)** says how much the option's price moves for a $1 move in the stock: the 100 call's 0.53 means about 53 cents. It also doubles as a rough gauge of how likely the option is to finish in the money, with caveats covered in [[delta]]. Many chains add gamma, theta and vega columns; those arrive in [[greeks-map]].

### ④ Parity across a row

Every row holds a call and a put with the same strike and expiry, and they are chained together by put-call parity ([[put-call-parity]]):

$$
C - P = S - K e^{-rT}
$$

where \(C\) and \(P\) are the call and put prices, \(S\) the stock price, \(K\) the strike, \(r\) the risk-free rate and \(T\) the time to expiry in years (this simple form holds for European options on a stock with no dividend; XYZ's American options sit very close to it).

> [!EXAMPLE] Checking two rows of the XYZ chain
> Row 100: \(C - P = 2.45 - 2.12 = 0.33\), and \(S - Ke^{-rT} = 100 - 100\,e^{-0.04 \times 30/365} = 100 - 99.67 = 0.33\). ✓
> Row 105: \(C - P = 0.71 - 5.37 = -4.66\), and \(100 - 105\,e^{-0.04 \times 30/365} = 100 - 104.66 = -4.66\). ✓
> Using quoted mids instead (0.71 and 5.35) the gap is two cents, well inside the spreads: parity holds to within what it costs to trade.

<figure>
<svg viewBox="0 0 700 280" role="img" aria-label="Call and put prices across strikes cross at the forward">
<defs><marker id="option-chain-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="50" y1="230" x2="680" y2="230" class="fx-axis" marker-end="url(#option-chain-ah2)"/>
<line x1="50" y1="240" x2="50" y2="20" class="fx-axis" marker-end="url(#option-chain-ah2)"/>
<polyline points="60,26.3 80,39.5 100,52.8 120,65.9 140,79.0 160,92.0 180,104.7 200,117.2 220,129.4 240,141.2 260,152.4 280,163.0 300,172.9 320,181.9 340,190.1 360,197.3 380,203.7 400,209.1 420,213.7 440,217.4 460,220.5 480,222.9 500,224.8 520,226.3 540,227.4 560,228.2 580,228.7 600,229.2 620,229.4 640,229.6 660,229.8" class="fx-line-blue"/>
<polyline points="60,230.0 80,229.9 100,229.9 120,229.7 140,229.5 160,229.2 180,228.7 200,227.9 220,226.8 240,225.3 260,223.2 280,220.5 300,217.1 320,212.8 340,207.7 360,201.7 380,194.7 400,186.9 420,178.2 440,168.7 460,158.4 480,147.6 500,136.2 520,124.4 540,112.2 560,99.7 580,87.0 600,74.1 620,61.1 640,48.0 660,34.8" class="fx-line-bad"/>
<line x1="366.6" y1="60" x2="366.6" y2="230" class="fx-line fx-dash"/>
<circle cx="366.6" cy="199.5" r="5" class="fx-fill-ink"/>
<text x="374" y="72" class="fx-t-b">forward F = 100.33</text>
<text x="374" y="90" class="fx-t-sm">call = put here (2.29 each)</text>
<text x="118" y="42" class="fx-t-blue">call prices</text>
<text x="560" y="44" class="fx-t-bad">put prices</text>
<text x="60" y="250" text-anchor="middle" class="fx-t-sm">85</text>
<text x="160" y="250" text-anchor="middle" class="fx-t-sm">90</text>
<text x="260" y="250" text-anchor="middle" class="fx-t-sm">95</text>
<text x="360" y="250" text-anchor="middle" class="fx-t-sm">100</text>
<text x="460" y="250" text-anchor="middle" class="fx-t-sm">105</text>
<text x="560" y="250" text-anchor="middle" class="fx-t-sm">110</text>
<text x="660" y="250" text-anchor="middle" class="fx-t-sm">115</text>
<text x="670" y="272" text-anchor="end" class="fx-t-sm">strike K (XYZ at 100, 30 days, σ 20%, r 4%)</text>
<text x="44" y="30" text-anchor="end" class="fx-t-sm">price</text>
</svg>
<figcaption>Figure 2 · Reading down the chain, call prices fall and put prices rise with the strike. The two curves cross where the strike equals the forward (100.33), not the spot: at every strike the gap between them is \(S - Ke^{-rT}\), a straight line in \(K\).</figcaption>
</figure>

Parity is why a deep in-the-money call quote is rarely informative on its own: its fair value is pinned by the matching put plus \(S - Ke^{-rT}\). If a row ever violates parity by more than the spreads and costs, market makers trade the gap away ([[synthetics-boxes]]).

### ⑤ What the whole chain tells you

Beyond single contracts, the chain answers two questions traders ask every day.

**How big a move is priced in?** Buy the at-the-money call and put together (a *straddle*). It pays off if the stock moves far either way, so its price is the market's estimate of the typical move to expiry:

$$
\text{implied move} \approx C_{\text{ATM}} + P_{\text{ATM}} \approx 0.8\,S\sigma\sqrt{T}
$$

where \(C_{\text{ATM}}\) and \(P_{\text{ATM}}\) are the at-the-money mids, and \(0.8\,S\sigma\sqrt{T}\) is the straddle's approximate value (0.8 ≈ \(\sqrt{2/\pi}\), the average size of a standard-normal move).

> [!EXAMPLE] XYZ's implied move for 30 days
> \(2.45 + 2.12 = 4.57\): the market is pricing a typical move of about \(\pm\$4.57\), or 4.6%, by expiry. Check: \(0.8 \times 100 \times 0.20 \times \sqrt{30/365} = 0.8 \times 5.73 \approx 4.59\). On the 7-day tab the straddle is \(1.14 + 1.07 = 2.21\); on the 60-day tab \(3.56 + 2.91 = 6.47\). Four times the time is not four times the move, but about twice: moves grow with \(\sqrt{T}\) ([[random-walk]]).

**Which strike is “25 delta”?** Professionals name strikes by delta rather than by price, because a delta means the same thing on any stock. On XYZ's 30-day chain with $1 strikes, the 97 put has \(\Delta = -0.27\) and the 96 put \(-0.21\), so the “25-delta put” is about the 97 strike. Skew quotes such as the 25-delta risk reversal are built on exactly this ([[smile-skew]]).

::demo[option-chain-find]

### ⑥ The chain in 2026

Chains have become very long. As of September 2026, SPX lists an expiry every weekday (Tuesday and Thursday expiries were added in 2022, completing Monday to Friday), and since January 26, 2026 nine heavily traded single names and ETFs (including TSLA, NVDA, AAPL and IBIT) may list Monday and Wednesday expiries in addition to their Friday weeklies. A single popular underlying can therefore show dozens of expiry tabs and hundreds of strikes, most of them quiet. The next lesson shows how to find the ones that are actually tradable.

> [!FACT] How much trades through these screens
> US listed options set a sixth straight annual record in 2025: about 15 billion contracts, 61 million a day on average (Cboe, January 2026). Through August 2026 the average was about 70.8 million contracts a day, up about 23% on 2025 (OCC, September 2026). Every one of those trades crossed a bid or an ask on a chain like Figure 1.

Behind the app, all US option quotes flow through one consolidated feed (OPRA). Professional data work, from cleaning crossed or stale quotes to backing out a forward from parity, is the subject of [[options-data]].

## @analogy
The option chain is a **currency-exchange board at an airport**. Each row is a currency (a strike), and each currency has two prices: “we buy” (the bid, what you get if you sell to the booth) and “we sell” (the ask, what you pay if you buy from the booth). The gap between them is the booth's living, and it is widest for exotic currencies few people trade, just as far out-of-the-money options and quiet strikes have the widest spreads. The rate you read in the newspaper is the mid; nobody actually trades at it, but it tells you what the currency is worth. And the “last trade” on a dusty board may be from this morning, before the rate moved.

Two extra layers make the chain richer than the exchange board. First, there are *two* products per row, the call and the put, and they are welded together by parity, so one side of the board keeps the other honest. Second, there is a hidden common currency: implied volatility. Just as a traveller might convert every price into dollars to compare, traders convert every option price into IV to see which strikes and expiries are cheap or rich.

Where the analogy breaks: an exchange booth sets both prices itself, while a chain's bid and ask come from many competing market makers and traders, and they move every second with the stock.

## @misconceptions
- **“The last price is what I'll pay.”** — Last is the most recent trade, possibly hours old. What you can trade at now is the ask (to buy) or the bid (to sell); the mid is the fair estimate.
- **“A quote of 0.71 costs 71 cents.”** — Equity and index option prices are per share; one contract is × 100, so 0.71 is \(\$71\) per contract.
- **“The 100 call and 100 put should cost the same because both are at the money.”** — They are equal at the forward, not the spot. With rates at 4%, the 30-day call is worth \(0.33\) more, exactly \(S - Ke^{-rT}\).
- **“High implied volatility means the market expects the stock to rise.”** — IV measures the expected *size* of moves, not their direction. Calls and puts at the same strike share the same IV.
- **“Big open interest at a strike means the price will go there.”** — Open interest counts open contracts. It tells you where liquidity and positions are, not where the stock is heading.

## @takeaways
- A chain is one table per expiry: strikes down the middle, calls in the left half, puts in the right half, in-the-money cells shaded.
- You buy at the ask and sell at the bid; the mid \((\text{bid} + \text{ask})/2\) is the fair estimate, and every price is × 100 per contract.
- IV and delta columns translate prices into volatility and sensitivity, so strikes and expiries can be compared on one scale.
- Each row obeys parity, \(C - P = S - Ke^{-rT}\); the at-the-money straddle gives the market's implied move (XYZ 30-day: about $4.57).

## @quiz
1. The XYZ 105 call is quoted 0.70 bid, 0.72 ask. Kai sells one contract with a market order. About how much does Kai receive?
   - [ ] $72
   - [x] $70
   - [ ] $0.70
   - [ ] $71, the mid
   > A seller who takes the market receives the bid: \(0.70 \times 100 = \$70\). The ask (0.72) is what buyers pay; the mid (0.71) is the fair estimate, which a limit order may achieve but a market order does not. $0.70 forgets the × 100.
2. On the 30-day row with strike 100, the call's mid is 2.45 and the put's mid is 2.12 (r = 4%). What does the 0.33 difference mean?
   - [ ] The call is overpriced by 0.33 and should be sold
   - [ ] The market expects XYZ to rise by 0.33
   - [x] It equals \(S - Ke^{-rT} = 100 - 99.67\), as put-call parity requires
   - [ ] It is the bid-ask spread of the row
   > Parity says \(C - P = S - Ke^{-rT}\). With 4% rates, the present value of $100 in 30 days is $99.67, so the call is worth 0.33 more than the put. That is interest, not a forecast and not a mispricing.
3. The 100 call shows last 2.60, bid 2.42, ask 2.48, and XYZ has drifted down since the last trade. What is the best estimate of the call's fair value right now?
   - [ ] 2.60, the last trade
   - [x] 2.45, the mid
   - [ ] 2.48, the ask
   - [ ] 2.54, the average of last and ask
   > The mid of the live quote, \((2.42 + 2.48)/2 = 2.45\), reflects the current stock price. The last print was made when XYZ was higher and is stale.
4. XYZ's 30-day at-the-money straddle costs 4.57 (call 2.45 + put 2.12). What does this suggest?
   - [ ] XYZ will rise by $4.57
   - [ ] There is a 4.57% chance of a large move
   - [ ] The options are overpriced by $4.57
   - [x] The market is pricing a typical move of roughly ±$4.6 (about 4.6%) by expiry
   > The straddle pays the absolute size of the move, so its price approximates the expected move, about \(0.8\,S\sigma\sqrt{T} = 0.8 \times 5.73\). It says nothing about direction.
5. Why is the XYZ 95 call quoted 5.75 / 5.85 (five-cent steps) while the 95 put is quoted 0.50 / 0.52 (one-cent steps)?
   - [x] Under the Penny Interval Program, options priced at $3.00 or more quote in $0.05 steps, below $3.00 in $0.01 steps
   - [ ] Calls always quote in nickels and puts in pennies
   - [ ] In-the-money options are less liquid than out-of-the-money options
   - [ ] The market maker is charging extra for the call
   > Tick size depends on the price level: $0.01 below $3.00 and $0.05 at or above $3.00 for most classes in the program (SPY, QQQ and IWM trade in pennies at all prices). The expensive call is therefore stuck with a minimum five-cent step.

## @further
- [OIC: Options Industry Council education center](https://www.optionseducation.org/) — free courses and a glossary from the industry's education body, including how to read quotes.
- [Penny increments (OIC)](https://www.optionseducation.org/news/penny-increments) — why most option quotes move in one- or five-cent steps.
- [Characteristics and Risks of Standardized Options (OCC)](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the official disclosure document every US options trader receives.
- [The State of the Options Industry 2025 (Cboe)](https://www.cboe.com/insights/posts/the-state-of-the-options-industry-2025) — volumes, records and where trading is concentrated.

## @next
A chain showed Kai two prices for every contract, and the gap between them cost money. How wide is too wide, and how do volume and open interest tell a busy contract from a ghost town? The next lesson measures liquidity.
