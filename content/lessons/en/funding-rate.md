---
id: funding-rate
prereqs: futures-basis, what-is-perp, mark-index-last
demo: funding-rate
---

# Funding: The Tether That Ties Perps to Spot

## @hook
A perp never expires, so nothing forces it back to spot on a fixed date. Instead, every few hours, the crowded side pays the other side a small fee called **funding**. A typical rate of 0.01% per 8 hours sounds like nothing; on a 10× position it is about 11% of the notional and more than 100% of your margin per year.

## @bridge
[[futures-basis]] showed that a dated future is pulled to spot by convergence, and that its basis is the price of carrying exposure. [[what-is-perp]] removed the expiry, and [[mark-index-last]] defined the index and the perp's premium over it. This lesson puts them together: **funding turns the perp's premium over the index into a cash payment** that pushes the premium back toward zero. It builds Idea ② (no-arbitrage: if funding drifts far from the cost of carry, a hedged trade collects the gap) and Idea ④ (risk: funding is charged on notional, so leverage multiplies it).

## @intuition
Start with a crowded market. Bitcoin has been rising; everyone wants to be long with leverage; buyers are keen, sellers are scarce. On the perp's order book, bitcoin trades at **$100,050** while the spot index says **$100,000**. The perp is $50 rich: a premium of 0.05%.

A dated future would fix this at expiry. A perp has no expiry, so the venue charges rent instead:

- Because the perp trades **above** the index, the funding rate is **positive**, and at the next funding time every **long pays every short** a slice of their position's value.
- Being long just became more expensive and being short more attractive. Some longs close, some traders open shorts (often while buying spot to stay hedged), and the premium shrinks.
- If the perp traded **below** the index, the rate would turn negative and shorts would pay longs.

<figure>
<svg viewBox="0 0 640 256" role="img" aria-label="The funding feedback loop: a premium over the index creates positive funding, longs pay shorts, positioning shifts and the premium shrinks">
<defs><marker id="funding-rate-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="20" y="30" width="170" height="60" rx="10" class="fx-btc"/>
<text x="105" y="56" text-anchor="middle" class="fx-t-b">perp 100,050</text>
<text x="105" y="76" text-anchor="middle" class="fx-t-sm">index 100,000: +0.05%</text>
<rect x="240" y="30" width="170" height="60" rx="10" class="fx-hl"/>
<text x="325" y="56" text-anchor="middle" class="fx-t-b">funding positive</text>
<text x="325" y="76" text-anchor="middle" class="fx-t-sm">rate computed from premium</text>
<rect x="460" y="30" width="160" height="60" rx="10" class="fx-bad"/>
<text x="540" y="56" text-anchor="middle" class="fx-t-b">longs pay shorts</text>
<text x="540" y="76" text-anchor="middle" class="fx-t-sm">notional × rate</text>
<rect x="460" y="160" width="160" height="60" rx="10" class="fx-box"/>
<text x="540" y="186" text-anchor="middle" class="fx-t-b">positions shift</text>
<text x="540" y="206" text-anchor="middle" class="fx-t-sm">longs trim, shorts add</text>
<rect x="240" y="160" width="170" height="60" rx="10" class="fx-ok"/>
<text x="325" y="186" text-anchor="middle" class="fx-t-b">premium shrinks</text>
<text x="325" y="206" text-anchor="middle" class="fx-t-sm">perp drifts back to index</text>
<rect x="20" y="160" width="170" height="60" rx="10" class="fx-box2"/>
<text x="105" y="186" text-anchor="middle" class="fx-t-b">funding falls</text>
<text x="105" y="206" text-anchor="middle" class="fx-t-sm">back to the baseline</text>
<line x1="190" y1="60" x2="236" y2="60" class="fx-line" marker-end="url(#funding-rate-ah)"/>
<line x1="410" y1="60" x2="456" y2="60" class="fx-line" marker-end="url(#funding-rate-ah)"/>
<line x1="540" y1="90" x2="540" y2="156" class="fx-line" marker-end="url(#funding-rate-ah)"/>
<line x1="460" y1="190" x2="414" y2="190" class="fx-line" marker-end="url(#funding-rate-ah)"/>
<line x1="240" y1="190" x2="194" y2="190" class="fx-line" marker-end="url(#funding-rate-ah)"/>
<line x1="105" y1="160" x2="105" y2="94" class="fx-line fx-dash" marker-end="url(#funding-rate-ah)"/>
<text x="112" y="130" class="fx-t-sm">if demand returns, the loop restarts</text>
<text x="320" y="244" text-anchor="middle" class="fx-t-sm">below the index, every arrow reverses: shorts pay longs</text>
</svg>
<figcaption>Figure 1 · Funding is a feedback loop. A premium over the index makes funding positive, longs pay shorts, positions shift, and the premium shrinks. Nothing forces the perp to equal the index at any moment; funding makes straying from it expensive.</figcaption>
</figure>

How big is the rent? Kai's 10× long from [[what-is-perp]] is $10,000 of bitcoin exposure on $1,000 of margin. At the common baseline rate of **+0.01% every 8 hours**:

- each payment is \(0.0001 \times 10{,}000 = \$1\);
- three payments a day: $3 a day, about $90 a month;
- over a year, \(1{,}095\) payments: about **$1,095**, or **10.95% of the notional**, which is **109.5% of Kai's $1,000 margin**.

> [!KAI] Kai: "0.01% looked like a rounding error"
> It is tiny *per payment* and *per dollar of notional*. But it is charged on the whole $10,000, not on Kai's $1,000, and it repeats three times a day. At 10× leverage, a flat market with the baseline rate costs Kai roughly 9% of the margin every month, even if bitcoin ends the month exactly where it started. An option buyer's time decay ([[theta]]) plays the same role; [[perps-vs-options]] puts the two side by side.

> [!THINK] A venue has shown funding of exactly +0.01000% for three weeks in a row. Does that mean the perp traded exactly 0.01% above the index the whole time?
> Predict before you open the answer.
> ---
> No. As section ② shows, the formula clamps the premium's effect: whenever the premium sits anywhere between about −0.04% and +0.06% (for the common default parameters), the rate comes out at exactly the 0.01% baseline. A flat 0.01% says "the market was calm", not "the premium was 0.01%".

We'll take it in five parts:

- **① The premium index: how rich is the perp?**
- **② The funding formula and its clamp**
- **③ Who pays whom, and how much**
- **④ Intervals and APR: compare like with like**
- **⑤ Funding as the price of leverage**

## @mechanics
### ① The premium index: how rich is the perp?

The raw ingredient is the perp's premium over the index, as a fraction of the index:

$$
p_t = \frac{P^{\text{perp}}_t - I_t}{I_t}
$$

where \(P^{\text{perp}}_t\) is the perp's price at moment \(t\) and \(I_t\) the index ([[mark-index-last]]). Venues sample it frequently (Hyperliquid, for example, every 5 seconds) and average it over the funding interval into a **premium index** \(P\). Many venues measure the perp's side with "impact" prices, the average fill for a set order size, so that a single tiny order at a silly price can't move it.

For the crowded market above: perp at $100,050, index at $100,000, so \(p = 50/100{,}000 = 0.0005 = 0.05\%\). If the perp averaged that premium for the whole interval, the premium index would be \(P = 0.05\%\).

### ② The funding formula and its clamp

Binance documents its USDⓈ-M funding rate (as of September 2026) as a premium term plus a clamped interest term:

$$
F = P + \operatorname{clamp}\big(I - P,\; -0.05\%,\; +0.05\%\big)
$$

where \(F\) is the funding rate for the interval, \(P\) the time-weighted premium index, and \(I\) an **interest component**, by default \(0.01\%\) per 8 hours (0.03% a day; some pairs use 0%). \(\operatorname{clamp}(x, a, b)\) means "\(x\), but no lower than \(a\) and no higher than \(b\)". Here the letter \(I\) is the interest rate, not the index price of the previous lesson. The interest term is the idea from [[futures-basis]] in miniature: holding a dollar-denominated position costs roughly the difference between the dollar rate and the coin's "rate", and the venue fixes that difference at a small constant.

Five premium indexes, run through the formula with \(I = 0.01\%\) and a ±0.05% clamp:

| Premium index \(P\) | \(I - P\) | after clamp | Funding \(F\) |
|---|---|---|---|
| +0.02% | −0.01% | −0.01% | **+0.01%** |
| −0.03% | +0.04% | +0.04% | **+0.01%** |
| +0.08% | −0.07% | −0.05% | **+0.03%** |
| +0.15% | −0.14% | −0.05% | **+0.10%** |
| −0.10% | +0.11% | +0.05% | **−0.05%** |

> [!EXAMPLE] The third row, step by step
> The perp averaged $80 above a $100,000 index, so \(P = 0.08\%\). Then \(I - P = 0.01\% - 0.08\% = -0.07\%\), which the clamp cuts to \(-0.05\%\):
> $$
> F = 0.08\% + (-0.05\%) = 0.03\%
> $$
> On Kai's $10,000 notional that is \(10{,}000 \times 0.0003 = \$3\) per interval, paid by the long to the short.

The clamp creates a **dead zone**. Whenever \(I - P\) lies inside \(\pm 0.05\%\), the clamp does nothing, the two \(P\)s cancel, and \(F = I = 0.01\%\) exactly. That happens for every premium index between \(-0.04\%\) and \(+0.06\%\). Only outside that band does funding follow the premium one-for-one (shifted by 0.05%). This is why so many perps print exactly 0.01% for days at a time.

<figure>
<svg viewBox="0 0 640 302" role="img" aria-label="Funding rate as a function of the premium index: flat at 0.01 percent inside a band, rising one for one outside it">
<defs><marker id="funding-rate-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="300" y="20" width="100" height="260" class="fx-area-hl"/>
<line x1="170" y1="150" x2="520" y2="150" class="fx-axis" marker-end="url(#funding-rate-ah2)"/>
<line x1="340" y1="285" x2="340" y2="15" class="fx-axis" marker-end="url(#funding-rate-ah2)"/>
<line x1="200" y1="290" x2="480" y2="10" class="fx-line-muted fx-dash"/>
<polyline points="190,250 300,140 400,140 490,50" class="fx-line-thick"/>
<circle cx="420" cy="120" r="5" class="fx-fill-orange"/>
<text x="430" y="138" class="fx-t-hl">P = 0.08% → F = 0.03%</text>
<text x="294" y="32" text-anchor="end" class="fx-t-hl">dead zone: F = 0.01%</text>
<text x="294" y="48" text-anchor="end" class="fx-t-sm">P from −0.04% to +0.06%</text>
<text x="498" y="60" class="fx-t-sm">slope 1</text>
<text x="184" y="262" text-anchor="end" class="fx-t-sm">P = −0.15% → F = −0.10%</text>
<text x="490" y="22" class="fx-t-sm">dashed: F = P</text>
<text x="525" y="154" class="fx-t-sm">premium index P</text>
<text x="346" y="14" class="fx-t-sm">funding F</text>
<text x="300" y="295" text-anchor="middle" class="fx-t-sm">−0.04%</text>
<text x="400" y="295" text-anchor="middle" class="fx-t-sm">+0.06%</text>
<text x="296" y="134" text-anchor="end" class="fx-t-sm">0.01%</text>
</svg>
<figcaption>Figure 2 · The clamp at work (interest 0.01%, clamp ±0.05%). Inside the shaded band funding sits at exactly the 0.01% baseline, whatever the premium. Outside it, funding moves one-for-one with the premium, 0.05 points closer to zero than the premium itself (the dashed line would be "funding = premium").</figcaption>
</figure>

Venues also put a hard **cap** on the funding rate itself (Hyperliquid, for example, caps funding at 4% per hour), and some shorten the interval when the cap is hit. Hyperliquid computes the same kind of 8-hour rate, with the same 0.01% interest component, but pays **every hour**, one-eighth of it at a time.

### ③ Who pays whom, and how much

$$
\text{payment} = N \times F, \qquad N = |Q| \times M
$$

where \(N\) is the position's notional value at the funding time, \(|Q|\) the position size in coins, \(M\) the mark price, and \(F\) the rate for the interval. If \(F > 0\) the long pays and the short receives; if \(F < 0\) the reverse. The payments pass between traders; on typical designs the venue is not the counterparty. On 8-hour venues you pay or receive only if you hold the position at the funding timestamp; on hourly venues the timestamps come every hour.

> [!EXAMPLE] Kai's funding bill in a hot market
> Kai's 10× long: 0.1 BTC at a mark of $100,000, so \(N = \$10{,}000\), margin $1,000.
> - Baseline, \(F = +0.01\%\): \(10{,}000 \times 0.0001 = \$1\) per 8 hours, \(\$90\) over 30 days, or 9% of the margin.
> - Euphoria, \(F = +0.03\%\) (premium index 0.08%): \(10{,}000 \times 0.0003 = \$3\) per 8 hours, \(3 \times 3 \times 30 = \$270\) over 30 days, or **27% of the margin**, with bitcoin not having moved at all.
>
> Double the leverage to 20× and those shares of margin double too: funding is charged on notional.

The short side of Kai's trade receives the same amounts. That is the whole appeal of the "long spot, short perp" trade: while funding stays positive, a hedged short collects it ([[basis-trades]]).

::demo[funding-rate-apr]

### ④ Intervals and APR: compare like with like

Venues quote the rate *per interval*, and the intervals differ:

| Venue design (as of September 2026) | Interval | Baseline interest component | Per-8-hour equivalent |
|---|---|---|---|
| Binance USDⓈ-M (default) | 8 hours (some contracts 4 hours) | 0.01% per 8 h | 0.01% |
| Hyperliquid | 1 hour | 0.00125% per hour | 0.01% |
| Coinbase US perpetual-style futures | 12 hours (as reported) | not covered here | depends on the print |

Before comparing, convert every rate to the same interval:

$$
f_{8\text{h}} = f_{\Delta} \times \frac{8}{\Delta}, \qquad \text{APR} = f_{\Delta} \times \frac{24}{\Delta} \times 365
$$

where \(f_{\Delta}\) is the rate quoted for an interval of \(\Delta\) hours, \(f_{8\text{h}}\) the same rate expressed per 8 hours, and APR the simple annualised rate.

> [!EXAMPLE] The same baseline on two clocks
> - 8-hour venue: \(0.01\% \times 3 \times 365 = 10.95\%\) a year.
> - Hourly venue: \(0.00125\% \times 24 \times 365 = 10.95\%\) a year, identical. Compounded hourly, \((1 + 0.0000125)^{8{,}760} - 1 \approx 11.6\%\), which is the figure Hyperliquid's documentation quotes.
> - But a rate *displayed* as 0.01% **per hour** would be \(0.01\% \times 24 \times 365 = 87.6\%\) a year, eight times the 8-hour baseline.

> [!WARN] Two traps in one number
> First, never compare displayed funding rates across venues until you have converted them to the same interval: the baseline is the same 0.01% per 8 hours on both designs above, and only a *displayed per-hour* 0.01% would be eight times more. Second, an APR built from one print ("0.03% × 3 × 365 = 32.85% a year!") assumes the rate never changes. Funding moves every interval and flips sign in sell-offs; it is a running price, not a locked yield.

### ⑤ Funding as the price of leverage

Look at what the formula prices. With a calm market, funding is the constant interest term, a small, steady charge for holding dollar exposure through a contract. When leveraged demand is lopsided, funding rises above the baseline and becomes the **market price of being long with leverage** (or short, when negative). Traders therefore watch funding as a crowding gauge: persistently high positive funding says longs are paying up to stay in; deeply negative funding says shorts are. It describes positioning; it doesn't forecast the next move.

Funding and the dated-futures basis measure the same thing on two clocks. Holding a long through dated futures costs the annualised basis \(b_{\text{ann}}\) ([[futures-basis]]); holding it through a perp costs the annualised funding. When one is much higher than the other, a hedged trader can buy the cheap one and sell the rich one (for example long a dated future, short the perp) and collect the gap. That no-arbitrage pull (Idea ②) is why annualised funding and annualised basis tend to travel together, and it is the core of [[basis-trades]].

Put numbers on it with the illustrative market from [[futures-basis]]: the 90-day bitcoin future carried an annualised basis of 6.04%, while a perp at the baseline funding costs a long 10.95% a year. A trader who is long $10,000 of the dated future and short $10,000 of the perp has almost no exposure to bitcoin's direction, pays the future's 6.04% through convergence and collects the perp's 10.95% in funding: roughly \(10{,}000 \times (10.95\% - 6.04\%) \times \tfrac{90}{365} \approx \$121\) over the 90 days, if funding stayed at the baseline the whole time. It rarely does, and the short perp leg can still be liquidated in a sharp rally if it is under-margined, which is why that "if" carries most of the risk.

> [!FACT] State of play (as of September 2026)
> Binance's documentation gives \(F = P + \operatorname{clamp}(I - P, \pm 0.05\%)\), with a default 8-hour interval (some contracts 4 hours) and a default interest component of 0.01% per 8 hours. Hyperliquid pays hourly at one-eighth of the computed 8-hour rate, with the same 0.01% per 8 hours interest component and a cap of 4% per hour. Coinbase's US perpetual-style futures settle funding every 12 hours (as reported). Rules change; always read the current contract specification.

The perp now has its tether. What it does not yet have is a safety net: when the mark runs through a position's margin, the venue must close it, and sometimes the close costs more than the margin left. That is [[margin-liquidation]].

## @analogy
Funding is like a **boat-rental dock on a crowded holiday**.

The dock has a fair daily price for renting a boat, set by the marina down the road (the index). On a sunny holiday everyone wants a boat, and renters start bidding above the fair price (the premium). The dock's rule: every few hours, if the rental price is above the marina's, the renters chip in and pay the boat owners a small surcharge; if it is below, the owners pay the renters to keep using the boats.

On a normal day the surcharge is a fixed, tiny fee (the 0.01% baseline), and small ups and downs in demand don't change it (the dead zone). On a wild holiday it jumps, which makes renting expensive, tempts more owners to put boats on the water, and pulls the price back toward the marina's.

Kai's lesson: the fee is charged on the boat's value, not on Kai's deposit. Rent a boat worth ten times your deposit and a "tiny" surcharge becomes a big share of what you put down.

Where it breaks: at a real dock the surcharge would go to the dock owner. In a perp, funding goes from one group of traders to the other; the venue only runs the meter.

## @misconceptions
- **"Positive funding is a fee the exchange charges."** — It passes from longs to shorts (or back when negative); on typical designs the venue is not the counterparty.
- **"0.01% is too small to matter."** — It is charged on notional and repeats every interval: 10.95% of notional a year, which is more than 100% of the margin at 10×.
- **"Hourly funding is eight times more expensive than 8-hour funding."** — Only if the displayed hourly rate equals the displayed 8-hour rate. Hyperliquid's baseline is 0.00125% per hour, which equals Binance's 0.01% per 8 hours. Normalise before comparing.
- **"A funding APR is a yield I can lock in."** — It annualises one print. The rate changes every interval and can turn negative, which is exactly what hurts hedged "funding farmers" in sell-offs.
- **"Funding of exactly 0.01% means the perp is 0.01% above the index."** — The clamp returns exactly the 0.01% baseline for any premium index roughly between −0.04% and +0.06%.

## @takeaways
- Funding turns the perp's premium over the index into a periodic payment: positive means longs pay shorts, negative the reverse.
- A common formula is \(F = P + \operatorname{clamp}(I - P, \pm 0.05\%)\) with \(I = 0.01\%\) per 8 hours; inside a dead zone of premiums it returns exactly 0.01%.
- Payment \(= N \times F\), charged on notional: Kai's $10,000 at 10× pays $1 per 8 hours at the baseline, about 109.5% of the margin a year.
- Convert rates to one interval before comparing venues; the 8-hour and hourly baselines are the same 10.95% a year.
- Annualised funding and the futures basis price the same carry, which is what basis trades exploit.

## @quiz
1. The perp trades at $100,080 while the index is $100,000, and that premium holds for the whole interval. With \(I = 0.01\%\) and a ±0.05% clamp, what is the funding rate?
   - [ ] +0.08%
   - [ ] +0.01%
   - [x] +0.03%
   - [ ] −0.05%
   > \(P = 0.08\%\); \(I - P = -0.07\%\), clamped to \(-0.05\%\); \(F = 0.08\% - 0.05\% = 0.03\%\).
2. Kai holds a $10,000-notional long with $1,000 of margin. Funding stays at +0.01% per 8 hours for 30 days and bitcoin ends where it started. What has Kai paid?
   - [ ] About $3
   - [x] About $90, or 9% of the margin
   - [ ] About $1,095
   - [ ] Nothing, because the price didn't move
   > \(10{,}000 \times 0.0001 = \$1\) per payment, three a day, 30 days: $90. Funding is charged on notional regardless of price moves.
3. Venue A shows funding of 0.01% per 8 hours; venue B shows 0.00125% per hour. Which is more expensive for a long at the same notional?
   - [ ] Venue B, because hourly funding is eight times more expensive
   - [ ] Venue A, because 0.01% is larger than 0.00125%
   - [ ] It cannot be compared
   - [x] They cost the same: both are 0.03% a day, about 10.95% a year
   > Convert to one interval: \(0.00125\% \times 8 = 0.01\%\) per 8 hours. Only a displayed 0.01% *per hour* would be eight times more.
4. A venue has printed exactly +0.01% funding for weeks. What can you conclude?
   - [ ] The perp traded exactly 0.01% above the index throughout
   - [x] The premium index stayed inside the clamp's dead zone, so the rate equalled the interest component
   - [ ] Longs and shorts were exactly balanced in size
   - [ ] The venue stopped charging funding
   > For premium indexes between about −0.04% and +0.06% the formula returns exactly \(I = 0.01\%\). Open-interest balance is always exact (every long has a short); the rate reflects price, not headcount.
5. Annualised funding on a perp is 30% while the 90-day dated future's annualised basis is 8%. Which hedged trade would tend to pull them together?
   - [ ] Long the perp and short the dated future
   - [ ] Long both, since funding is high
   - [x] Short the perp (collecting funding) and long the dated future
   - [ ] Short both, since the basis is positive
   > The perp is the expensive way to be long, so shorting it collects 30% while the long dated future costs 8%; direction cancels. The trade's risks (funding can fall or flip, venue and liquidation risk) are the subject of [[basis-trades]].

## @further
- [Binance: introduction to USDⓈ-M futures funding rates](https://www.binance.com/en/support/faq/360033525031) — the formula, interest component and intervals from the source.
- [Hyperliquid docs: funding](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/funding) — hourly payments, the 8-hour rate and the cap.
- [Coinbase: perpetual futures have arrived in the US](https://www.coinbase.com/blog/perpetual-futures-have-arrived-in-the-us) — how funding works on a CFTC-regulated perpetual-style contract.
- [BitMEX: announcing the perpetual XBTUSD (2016)](https://blog.bitmex.com/announcing-the-launch-of-the-perpetual-xbtusd-leveraged-swap/) — where funding in place of expiry began.
- [New Finance Path](https://evidex-cloud.github.io/droplet-labs-finance-path/) — the sister course's lessons on crypto derivatives and DeFi yields.

## @next
Funding keeps the perp near spot, but it cannot keep a leveraged trader solvent. What exactly happens when the mark runs through a position's margin: how much margin is required, which positions share it, and at what price is the position closed? The next lesson opens the margin engine.
