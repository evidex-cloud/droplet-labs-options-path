---
id: zero-dte
prereqs: product-map, gamma, theta, iron-condor, butterfly, dealer-gamma
demo: zero-dte
---

# 0DTE: When Same-Day Options Became the Tape

## @hook
Options that expire at 4 p.m. today were about two-thirds of all SPX option volume in July 2026. They are ordinary options priced with the ordinary formula; the difference is that the clock runs in hours. Gamma explodes, theta bills by the hour, and a $1 move at 3:30 p.m. is a different event from a $1 move at the open.

## @bridge
[[gamma]] and [[theta]] showed what happens to XYZ's at-the-money call as expiry approaches: with 30 days left, gamma is 0.069 and theta −$0.044 a day; with one day left, 0.381 and −$0.214. [[dealer-gamma]] showed that gamma piles up at expiry, and [[product-map]] introduced SPX, XSP and SPY. This lesson asks: **what is a zero-days-to-expiry option, why did it take over index options, how do its Greeks behave hour by hour, and does it make the market less stable?** It builds Idea ③ (volatility: the price of a few hours of movement) and Idea ④ (risk: who holds that gamma and how fast it bites).

## @intuition
A **0DTE** option (zero days to expiration) is simply an option on its last trading day. Nothing about the contract is special. What changed is supply: SPX now has an expiration every trading day, so there is always an option that dies at today's close.

> [!KAI] Kai's one-day ticket
> Kai spots an XYZ call with strike 100 that expires at today's close. At the 9:30 open, with XYZ at 100, it costs **$0.42**, or $42 a contract.
> - If XYZ is still at 100 at 3:00 p.m., the call is worth about $0.17. At 4:00 p.m. it is worth nothing.
> - If XYZ jumps $1 at 3:30 p.m., the call goes from about $0.12 to about $1.00 — more than eight times its price.
>
> For $42 Kai has bought one afternoon of XYZ's movement, with a capped loss. That is the whole appeal, and the whole danger.

Nothing new is needed to price it: it is the Black-Scholes formula with a very small \(T\). But a small \(T\) changes everything about how the option behaves. Premium shrinks like \(\sqrt{T}\), so the option is cheap. Gamma grows like \(1/\sqrt{T}\), so the delta swings from near 0 to near 1 in minutes. And theta, the cost of waiting, is concentrated in the last hours.

<figure>
<svg viewBox="0 0 680 250" role="img" aria-label="Value of an at-the-money 0DTE call through one trading session">
<polygon points="60,200 60.0,30.8 81.5,34.1 103.1,37.5 124.6,40.9 146.2,44.5 167.7,48.1 189.2,51.8 210.8,55.6 232.3,59.5 253.8,63.5 275.4,67.6 296.9,71.9 318.5,76.2 340.0,80.8 361.5,85.5 383.1,90.4 404.6,95.6 426.2,101.0 447.7,106.7 469.2,112.7 490.8,119.2 512.3,126.3 533.8,134.1 538.2,135.8 542.5,137.5 546.8,139.3 551.1,141.1 555.4,143.0 559.7,144.9 564.0,147.0 568.3,149.0 572.6,151.2 576.9,153.5 581.2,155.9 585.5,158.4 589.8,161.1 594.2,164.0 598.5,167.2 602.8,170.6 607.1,174.6 611.4,179.2 615.7,185.3 620.0,200.0" class="fx-area-hl"/>
<polyline points="60.0,30.8 81.5,34.1 103.1,37.5 124.6,40.9 146.2,44.5 167.7,48.1 189.2,51.8 210.8,55.6 232.3,59.5 253.8,63.5 275.4,67.6 296.9,71.9 318.5,76.2 340.0,80.8 361.5,85.5 383.1,90.4 404.6,95.6 426.2,101.0 447.7,106.7 469.2,112.7 490.8,119.2 512.3,126.3 533.8,134.1 538.2,135.8 542.5,137.5 546.8,139.3 551.1,141.1 555.4,143.0 559.7,144.9 564.0,147.0 568.3,149.0 572.6,151.2 576.9,153.5 581.2,155.9 585.5,158.4 589.8,161.1 594.2,164.0 598.5,167.2 602.8,170.6 607.1,174.6 611.4,179.2 615.7,185.3 620.0,200.0" class="fx-line-hl"/>
<polyline points="60.0,112.5 81.5,114.2 103.1,115.9 124.6,117.7 146.2,119.5 167.7,121.4 189.2,123.3 210.8,125.2 232.3,127.3 253.8,129.3 275.4,131.4 296.9,133.6 318.5,135.9 340.0,138.2 361.5,140.7 383.1,143.2 404.6,145.9 426.2,148.6 447.7,151.6 469.2,154.7 490.8,158.1 512.3,161.8 533.8,165.8 538.2,166.7 542.5,167.6 546.8,168.5 551.1,169.4 555.4,170.4 559.7,171.4 564.0,172.4 568.3,173.5 572.6,174.7 576.9,175.8 581.2,177.1 585.5,178.4 589.8,179.8 594.2,181.3 598.5,182.9 602.8,184.7 607.1,186.8 611.4,189.2 615.7,192.4 620.0,200.0" class="fx-line-muted fx-dash"/>
<line x1="60" y1="200" x2="630" y2="200" class="fx-axis"/>
<line x1="60" y1="20" x2="60" y2="200" class="fx-axis"/>
<text x="54" y="44" text-anchor="end" class="fx-t-sm">0.40</text>
<text x="54" y="124" text-anchor="end" class="fx-t-sm">0.20</text>
<text x="54" y="204" text-anchor="end" class="fx-t-sm">0</text>
<text x="60" y="218" text-anchor="middle" class="fx-t-sm">9:30</text>
<text x="189" y="218" text-anchor="middle" class="fx-t-sm">11:00</text>
<text x="318" y="218" text-anchor="middle" class="fx-t-sm">12:30</text>
<text x="448" y="218" text-anchor="middle" class="fx-t-sm">14:00</text>
<text x="534" y="218" text-anchor="middle" class="fx-t-sm">15:00</text>
<text x="620" y="218" text-anchor="middle" class="fx-t-sm">16:00</text>
<text x="70" y="24" class="fx-t-hl">$0.42 at the open (session clock)</text>
<text x="150" y="84" class="fx-t-sm">first hour: loses $0.034</text>
<path d="M534,112 L534,106 L620,106 L620,112" class="fx-line-bad"/>
<text x="620" y="98" text-anchor="end" class="fx-t-bad">last hour: loses $0.165</text>
<text x="70" y="106" class="fx-t-sm">dashed: calendar-hour clock, $0.22 at the open</text>
<text x="340" y="244" text-anchor="middle" class="fx-t-sm">XYZ stays at 100 all day · strike 100 · σ = 20%</text>
</svg>
<figcaption>Figure 1 · An at-the-money 0DTE call melting through one session if the stock does not move. The first hour costs about 3 cents; the last hour costs 16.5 cents, everything that is left. The dashed line prices the same option with a 24-hour clock, which roughly halves its value: part ② explains why the choice of clock matters.</figcaption>
</figure>

We'll take it in five parts:

- **① From monthly to every day: how 0DTE took over**
- **② Time in hours: which clock?**
- **③ The Greeks at 0DTE: the same dollar at 9:30 and at 15:30**
- **④ Who trades it, how, and the risks**
- **⑤ Does 0DTE destabilize the market? The evidence on both sides**

## @mechanics
### ① From monthly to every day: how 0DTE took over

For decades, index options expired once a month. The expiry calendar filled in step by step:

<figure>
<svg viewBox="0 0 680 170" role="img" aria-label="Timeline of SPX and single-stock expiration cadence">
<line x1="20" y1="80" x2="660" y2="80" class="fx-line-thick"/>
<circle cx="70" cy="80" r="7" class="fx-fill-muted"/>
<text x="70" y="62" text-anchor="middle" class="fx-t-b">1983</text>
<text x="70" y="104" text-anchor="middle" class="fx-t-sm">SPX options</text>
<text x="70" y="120" text-anchor="middle" class="fx-t-sm">listed (monthly)</text>
<circle cx="180" cy="80" r="7" class="fx-fill-blue"/>
<text x="180" y="62" text-anchor="middle" class="fx-t-b">2005</text>
<text x="180" y="104" text-anchor="middle" class="fx-t-sm">first SPX Weekly</text>
<text x="180" y="120" text-anchor="middle" class="fx-t-sm">(Fridays)</text>
<circle cx="290" cy="80" r="7" class="fx-fill-blue"/>
<text x="290" y="62" text-anchor="middle" class="fx-t-b">2010</text>
<text x="290" y="104" text-anchor="middle" class="fx-t-sm">equity</text>
<text x="290" y="120" text-anchor="middle" class="fx-t-sm">Weeklys</text>
<circle cx="400" cy="80" r="7" class="fx-fill-blue"/>
<text x="400" y="62" text-anchor="middle" class="fx-t-b">2016</text>
<text x="400" y="104" text-anchor="middle" class="fx-t-sm">SPX Monday and</text>
<text x="400" y="120" text-anchor="middle" class="fx-t-sm">Wednesday expiries</text>
<circle cx="510" cy="80" r="9" class="fx-fill-orange"/>
<text x="510" y="62" text-anchor="middle" class="fx-t-b">2022</text>
<text x="510" y="104" text-anchor="middle" class="fx-t-sm">+ Tue and Thu:</text>
<text x="510" y="121" text-anchor="middle" class="fx-t-hl">SPX expires</text>
<text x="510" y="137" text-anchor="middle" class="fx-t-hl">every trading day</text>
<circle cx="615" cy="80" r="7" class="fx-fill-green"/>
<text x="615" y="62" text-anchor="middle" class="fx-t-b">2026</text>
<text x="615" y="104" text-anchor="middle" class="fx-t-sm">Mon/Wed expiries</text>
<text x="615" y="120" text-anchor="middle" class="fx-t-sm">for 9 large names</text>
<text x="340" y="162" text-anchor="middle" class="fx-t-sm">each new weekday expiry turned one more day into somebody's “expiration day”</text>
</svg>
<figcaption>Figure 2 · How the calendar filled in. Cboe added Tuesday SPX expiries from April 18, 2022 and Thursday expiries from May 11, 2022, completing an expiry every trading day. In January 2026 the SEC approved a Nasdaq rule adding Monday and Wednesday expiries for some large stocks and ETFs; Nasdaq listed them from January 26, 2026 for TSLA, NVDA, AAPL, IBIT, AMZN, META, AVGO, GOOGL and MSFT.</figcaption>
</figure>

Once every day was an expiration day, same-day trading grew steadily:

<figure>
<svg viewBox="0 0 640 230" role="img" aria-label="0DTE share of SPX options volume over time">
<line x1="50" y1="190" x2="620" y2="190" class="fx-axis"/>
<line x1="50" y1="80" x2="620" y2="80" class="fx-line-muted fx-dash"/>
<text x="46" y="84" text-anchor="end" class="fx-t-sm">50%</text>
<text x="46" y="194" text-anchor="end" class="fx-t-sm">0%</text>
<rect x="70" y="91" width="60" height="99" class="fx-box2"/>
<text x="100" y="110" text-anchor="middle" class="fx-t-sm">≈45%</text>
<text x="100" y="208" text-anchor="middle" class="fx-t-sm">2023</text>
<rect x="160" y="86.6" width="60" height="103.4" class="fx-box2"/>
<text x="190" y="106" text-anchor="middle" class="fx-t-sm">≈47%</text>
<text x="190" y="208" text-anchor="middle" class="fx-t-sm">2024</text>
<rect x="250" y="77.8" width="60" height="112.2" class="fx-hl"/>
<text x="280" y="70" text-anchor="middle" class="fx-t">51%</text>
<text x="280" y="208" text-anchor="middle" class="fx-t-sm">Q4 2024</text>
<rect x="340" y="60.2" width="60" height="129.8" class="fx-hl"/>
<text x="370" y="53" text-anchor="middle" class="fx-t">59%</text>
<text x="370" y="208" text-anchor="middle" class="fx-t-sm">2025</text>
<rect x="430" y="52.7" width="60" height="137.3" class="fx-hl"/>
<text x="460" y="46" text-anchor="middle" class="fx-t">62.4%</text>
<text x="460" y="208" text-anchor="middle" class="fx-t-sm">Aug 2025</text>
<rect x="520" y="44.4" width="60" height="145.6" class="fx-fill-orange"/>
<text x="550" y="37" text-anchor="middle" class="fx-t-hl">66.2%</text>
<text x="550" y="208" text-anchor="middle" class="fx-t-sm">Jul 2026</text>
<text x="50" y="226" class="fx-t-sm">share of SPX options volume in same-day options (Cboe; 2023–2024 from a secondary source)</text>
</svg>
<figcaption>Figure 3 · The 0DTE share of SPX options volume. Full-year 2025 averaged 59% (2.3 million of 3.9 million contracts a day); monthly records followed in August 2025 (62.4%) and July 2026 (66.2%, the latest monthly figure as of September 2026). The periods differ (years, a quarter, months), so read the trend, not the exact spacing.</figcaption>
</figure>

Other markers, all as of September 2026: SPX 0DTE average daily volume reached a monthly record of about **3.3 million contracts in June 2026**; across all US-listed options, same-day contracts were **21.5%** of volume in 2024 and **24.1%** in 2025, and more than **20 million contracts a day** in the first half of 2026. The Mini-SPX (XSP, one-tenth the size of SPX) set a record of about 241,000 contracts a day in August 2026, with about 138,000 a day of 0DTE in July.

The contract matters. **SPX** same-day options (the SPXW weeklies) are European, cash-settled and **PM-settled** at the close: no early assignment, no shares delivered. **SPY** same-day options are American and settle into ETF shares, so they can be assigned early and an option that ends even $0.01 in the money is exercised automatically unless the holder says otherwise — a forgotten long position can become hundreds of shares overnight ([[exercise-assignment]]).

### ② Time in hours: which clock?

Black-Scholes needs \(T\) in years. With hours left, how many years is that? There are two common answers.

The **calendar-hour clock** treats every hour of the year alike: \(T = h/(365 \times 24)\). But XYZ does not move evenly around the clock: most of a day's movement happens while the market is open, and the overnight change arrives as a gap at 9:30. The **session clock** puts a whole day's variance into the 6.5-hour session:

$$
T = \frac{h}{6.5} \times \frac{1}{365}
$$

where \(h\) is the hours left until the 4 p.m. close, 6.5 the length of the regular session, and 365 the course's calendar-day convention for \(\sigma\). At the open (\(h = 6.5\)) this gives \(T = 1/365\): the 0DTE at 9:30 is exactly the course's standard 1-day option — **price $0.42, gamma 0.381**. This lesson uses the session clock.

At the money, the price follows the rule from [[black-scholes]]:

$$
C_{\text{ATM}} \approx 0.4\,S\sigma\sqrt{T}
$$

> [!EXAMPLE] The rule at 14:00, and the cost of the wrong clock
> At 2 p.m. two hours remain: \(T = \dfrac{2}{6.5} \times \dfrac{1}{365} = 0.000843\), so \(\sqrt{T} = 0.0290\) and
> $$
> C_{\text{ATM}} \approx 0.4 \times 100 \times 0.20 \times 0.0290 = 0.232
> $$
> against an exact Black-Scholes price of $0.233.
> Under the calendar-hour clock the same option at the open is worth only $0.22 instead of $0.42, because it counts \(6.5/24\) of a day instead of a full day. Turned around: if the market price is $0.42, the calendar clock backs out an implied volatility of about **39%**, the session clock about **20%**. Same option, same price, two very different “IVs”. Always ask which clock a 0DTE volatility number uses.

> [!DEEP] Better clocks
> Desks go further. Intraday volatility is not uniform: it is typically highest after the open and before the close, quieter at lunch, and it jumps at scheduled releases (8:30 a.m. inflation data, 2 p.m. Fed decisions). A “variance clock” gives each remaining minute its expected share of the day's variance, so an option with an announcement still ahead is worth more than the hours alone suggest.

### ③ The Greeks at 0DTE: the same dollar at 9:30 and at 15:30

Hold XYZ at 100 and walk the at-the-money call through the day (session clock, σ = 20%):

| Time (ET) | Hours left | Price | Gamma | Value lost over the next hour if XYZ stays at 100 |
|---|---|---|---|---|
| 9:30 | 6.5 | $0.423 | 0.381 | $0.034 |
| 12:00 | 4 | $0.331 | 0.486 | $0.045 |
| 14:00 | 2 | $0.233 | 0.687 | $0.068 |
| 15:00 | 1 | $0.165 | 0.972 | $0.165 (all of it) |
| 15:30 | 0.5 | $0.116 | 1.374 | $0.116 (all of it) |
| 15:45 | 0.25 | $0.082 | 1.943 | $0.082 (all of it) |

Price falls like \(\sqrt{h}\) while gamma rises like \(1/\sqrt{h}\): between 9:30 and 15:45 the premium drops to a fifth and gamma grows fivefold. Long gamma now means that a small move changes the delta a lot — and short gamma means the same thing with the opposite sign.

> [!EXAMPLE] The same +$1 move, at 9:30 and at 15:30
> Per contract, valued with Black-Scholes at the moment of the move:
> - **Long ATM call:** at 9:30 it goes from $0.42 to $1.11 (**+$68**); at 15:30 from $0.12 to $1.00 (**+$89**). By 15:30 the call's delta after the move is essentially 1: it has become stock.
> - **Short ATM straddle:** at 9:30 it loses **$36**; at 15:30 it loses **$77** — more than three times the $23 of premium left in it.
> - **Short 99/101 iron condor** (sold at the open for $0.167, wings at 98 and 102): a +$1 move costs $17 at 9:30 and $12 at 15:30, but a +$2 move costs $51 at 9:30 and **$88** at 15:30 — measured from the 15:30 mark, when the trade had looked almost fully won.

::demo[zero-dte-pnl]

> [!THINK] At 15:30 the short iron condor is worth almost nothing to buy back, so its seller has nearly the whole $16.70 credit in hand. Why might a careful trader still close it for a cent or two instead of waiting 30 minutes?
> ---
> Because the remaining risk is nearly all tail. With 30 minutes left the position has very little left to earn (under $1) but can still lose $88 on a $2 move, and at that hour gamma is at its highest. Paying a tiny amount to remove a large, fast, low-probability loss is the same trade-off as buying insurance; which choice is better depends on the price and the trader's risk budget, not on a rule.

### ④ Who trades it, how, and the risks

Why did same-day options become so popular? The appeal is concrete: the ticket is small (one day of time value costs a fraction of a month's), the exposure is aimed at one day's events (an inflation print, a Fed decision), SPX versions carry no overnight gap and no assignment, and there is a fresh expiry every morning.

Common structures, from the simplest:

| Structure | What it bets on | XYZ example at the open (session clock) |
|---|---|---|
| Long call or put | A move today, with a capped loss | 100 call: $0.42; 101 call: $0.10, with about a 17% risk-neutral chance of finishing in the money |
| Debit spread | A move to a target, cheaper than a single option | long 100 / short 101 call |
| Credit spread or iron condor | No big move today: renting out a range for a day | 99/101 condor, wings 98/102: credit $0.167, max loss $0.833, about 66% risk-neutral chance of finishing inside |
| Butterfly | A pin at a strike into the close ([[butterfly]], [[dealer-gamma]]) | long 99 / short 2 × 100 / long 101 calls |
| Protective puts | Insurance for one event day | a 0DTE put bought before an announcement |

The condor row shows the classic profile of selling same-day premium ([[iron-condor]]): it wins on most days, but one loss (up to $83) erases about five wins ($16.70 each).

> [!FACT] Who is trading, as of September 2026 (the shares are Cboe estimates)
> - **Retail share:** Cboe estimated retail investors at about **50–60%** of SPX 0DTE volume (May 2025) and **53%** in August 2025; a secondary source reports Cboe commentary of about 57% for June 2026.
> - **Structure of trades:** Cboe's “0DTEs Decoded” (May 2025) found that **more than 95%** of SPX 0DTE trades were limited-risk (long options or spreads) and naked short positions about **4%**.
> - **Day-trading rules:** FINRA's pattern-day-trader $25,000 minimum was replaced by intraday margin standards effective June 4, 2026, but brokers have until October 20, 2027 to implement the change, so some still apply the old rule.

> [!WARN] “Defined risk” is not “small risk”
> A long 0DTE option can lose 100% of its premium in hours, and often does. Bid-ask spreads are large relative to such small prices: a 0.08 / 0.12 quote on a $0.10 option costs 40% of the mid to get in and out. Theta is charged by the hour, gamma makes positions flip from safe to lost in minutes, and SPY versions add assignment and after-hours risk. None of this is advice; it is the arithmetic of a small \(T\). [[common-traps]] collects these same-day pitfalls with the others.

### ⑤ Does 0DTE destabilize the market? The evidence on both sides

The worry is easy to state. If gamma is largest in the last hours, and if dealers end up short a large amount of same-day gamma, their hedging could turn a sharp move into a sharper one — the accelerator of [[dealer-gamma]], concentrated into an afternoon.

**The case for concern:**
- Volume keeps rising, to about two-thirds of SPX activity, so the potential size of the hedging flow grows with it.
- In early 2023 a J.P. Morgan strategist reportedly warned that 0DTE could produce a “Volmageddon 2.0”-style shock (the wording of the warning is not confirmed).
- A Bank of England staff blog (December 2024) described channels through which same-day options could add to fragility in stressed markets, especially if positioning becomes one-sided.

**The case for calm:**
- Cboe estimates that net market-maker gamma hedging in SPX 0DTE is **at most about 0.2%** of daily SPX liquidity, a small flow next to the market it hedges into. Cboe profits from this market, so the estimate comes from an interested party.
- Dim, Eraker and Vilkov (SSRN, November 2023) found that market makers' net 0DTE gamma was on average **positive**, and associated with **lower** subsequent intraday volatility — a brake, not an accelerator.

The honest summary, as of September 2026: **the evidence so far does not show that 0DTE options are a systematic crash trigger, but the question is open and the flows are concentrated.** The largest volatility shocks of recent years — August 5, 2024, when the VIX touched 65.73 intraday, and the April 2025 tariff shock — began in macro events (a yen carry-trade unwind, tariffs), and research on whether same-day hedging amplified them is still thin.

## @analogy
A 0DTE option is a **same-day parking meter** on a stock's movement. In the morning, an hour of parking is cheap and the meter runs slowly relative to the time you have. In the last half hour, each minute is a large share of what is left, and the meter seems to race. You pay only for today, you can never owe more than the coins you put in, and at 4 p.m. the meter resets to zero whatever happened.

Now picture thousands of cars parked along the same street, all with meters expiring at 4 p.m. — and a parking company (the dealers) that has promised to move cars around whenever the traffic shifts. In the morning, a jolt in traffic barely matters. In the last half hour, a small jolt forces many cars to move at once. Whether that calms the street or causes a jam depends on which way the company has promised to move them — the long-or-short-gamma question.

The analogy breaks in one place: a parking meter charges at a steady rate, while an option's time value melts faster and faster, and the meter never pays you. An option can: if the car parked in front of you wins the day's lottery, your ticket is suddenly worth more than you paid.

## @misconceptions
- **“0DTE is a special, exotic product.”** — It is an ordinary option on its last day. The only change is that SPX has an expiration every trading day, so there is always one available.
- **“A 0DTE option is cheap, so it is low-risk.”** — It is cheap because little time is left, and it can lose 100% of its price within hours. Its gamma makes it swing faster than any longer-dated option, in both directions.
- **“Selling 0DTE iron condors is steady income.”** — It wins most days by design; the losses are several times larger than the gains. Whether it pays depends on the gap between implied and realized movement, and one bad afternoon can erase many good ones.
- **“0DTE options will cause the next crash.”** — The evidence so far (market-maker gamma on average positive, most trades limited-risk) does not show a systematic destabilizing effect, although the question is open and flows are concentrated.
- **“The 0DTE implied volatility on my screen is directly comparable with a 30-day option's.”** — Only if both use the same clock. Hour-level conventions can change a same-day IV by a factor of almost two.

## @takeaways
- A 0DTE option is an ordinary option on its last day; SPX has had an expiration every trading day since 2022, and same-day options reached about two-thirds of SPX volume in July 2026.
- With hours left, \(T\) is tiny: price shrinks like \(\sqrt{T}\), gamma grows like \(1/\sqrt{T}\), and most of the remaining time value disappears in the final hour.
- Use an explicit clock: under the session clock, \(T = \frac{h}{6.5} \times \frac{1}{365}\), and the 0DTE at the open equals the 1-day option ($0.42, gamma 0.381).
- The same $1 move does much more to an at-the-money position at 15:30 than at 9:30; short same-day premium wins often and loses big.
- Evidence so far (Cboe, an interested party; Dim, Eraker and Vilkov) points to dealer gamma that is on average positive and small relative to liquidity; the stability question remains open.

## @quiz
1. Using the session clock (a full day's variance inside the 6.5-hour session), about how much does XYZ's at-the-money same-day call cost at the 9:30 open?
   - [ ] About $2.45, like the 30-day option
   - [ ] About $0.22
   - [x] About $0.42, the same as the course's 1-day option
   - [ ] About $0.04, one-tenth of a 1-day option
   > The session clock sets \(T = 1/365\) at the open, which is exactly the 1-day option: $0.42. The $0.22 comes from the calendar-hour clock, which counts only 6.5 of 24 hours; $2.45 is the 30-day price.
2. Why does the same +$1 move change an at-the-money same-day option much more at 15:30 than at 9:30?
   - [x] With less time left, gamma is larger, so the delta swings further and the option behaves almost like stock after the move
   - [ ] Because volatility is always higher in the afternoon
   - [ ] Because theta turns positive late in the day
   - [ ] Because the contract multiplier rises near expiry
   > Gamma grows like \(1/\sqrt{T}\): 0.381 at the open versus 1.374 with half an hour left. A long call goes from +$68 to +$89 for the same move; a short straddle's loss goes from $36 to $77. The multiplier is always 100.
3. A 99/101 same-day iron condor on XYZ collects $0.167 at the open, with a maximum loss of $0.833 and about a 66% risk-neutral chance of finishing inside. Which statement is accurate?
   - [ ] It is nearly riskless because the loss is capped
   - [ ] It loses money on most days
   - [ ] Its expected profit is the credit times 66%
   - [x] It wins on most days, but a single maximum loss wipes out about five wins
   > \(0.833 / 0.167 \approx 5\). A capped loss is still five times the gain. Its expected value depends on the whole distribution, including partial losses, not just the chance of finishing inside.
4. At 9:30 two websites show the implied volatility of the same XYZ same-day option, both from a $0.42 price: one says about 39%, the other about 20%. What is the most likely explanation?
   - [ ] One site has stale prices
   - [x] They use different clocks: calendar hours versus a trading-session clock
   - [ ] One uses puts and the other calls
   - [ ] One quotes per contract and the other per share
   > Counting 6.5 of 24 hours makes \(T\) about 3.7 times smaller, so the same price needs about \(\sqrt{3.7} \approx 1.9\) times the volatility. Always check the clock before comparing same-day IVs.
5. What does the evidence available as of September 2026 say about 0DTE options and market stability?
   - [x] Studies so far find dealers' net same-day gamma on average positive and small relative to liquidity; no systematic destabilizing effect has been shown, but the question is open
   - [ ] It is proven that 0DTE options caused the August 2024 volatility spike
   - [ ] Regulators have concluded that 0DTE options must be restricted
   - [ ] There is no research on the question at all
   > Dim, Eraker and Vilkov (2023) and Cboe's own analysis (an interested party) point to positive, modest dealer gamma. Concerns (Bank of England staff blog, strategists' warnings) remain, and recent spikes began in macro shocks.

## @further
- [Cboe, 0DTEs Decoded: positioning trends and market impact](https://www.cboe.com/insights/posts/0-dt-es-decoded-positioning-trends-and-market-impact) — trade structure, customer balance and the hedging-flow estimate (from an interested party).
- [Dim, Eraker & Vilkov (2023), 0DTEs: Trading, Gamma Risk and Volatility Propagation](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4692190) — the main academic study of 0DTE gamma and intraday volatility.
- [Bank of England staff blog, Zero-day options and financial market vulnerability](https://bankunderground.co.uk/2024/12/04/zero-day-options-and-financial-market-vulnerability/) — the case for watching fragility channels.
- [FINRA, Zeroing in on 0DTE options](https://www.finra.org/investors/insights/zeroing-in-options-trading-strategy) — the regulator's plain-language risk overview for investors.
- [Cboe, adding Tuesday and Thursday SPX Weeklys (2022)](https://ir.cboe.com/news/news-details/2022/Cboe-to-Add-Tuesday-and-Thursday-Expirations-for-SPX-Weeklys-Options-04-13-2022/default.aspx) — the announcement that completed the every-day calendar.

## @next
Cboe estimates that a large share of same-day SPX volume comes from individual investors. Who is this retail wave, can it really push a stock like GameStop through dealer hedging, and why have funds that *sell* options to retail investors grown just as fast? [[retail-flows]] follows the money.
