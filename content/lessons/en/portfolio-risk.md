---
id: portfolio-risk
prereqs: greeks-map, higher-order-greeks, margin-approval, position-sizing, tail-hedging
demo: portfolio-risk
---

# Portfolio Risk: Scenario Grids, Stress Tests & Margin

## @hook
An options book holds stock, short calls and short puts, and each trade makes sense on its own. But if the stock falls 15% and volatility rises 10 points, what does the whole book lose? Delta alone says about $1,650; the real answer is nearly double. This lesson shows you how to see a whole book through scenario grids and stress tests — and how a broker decides how much margin to demand.

## @bridge
[[greeks-map]] taught you to break one option's risk into Greeks, and [[higher-order-greeks]] added the two-dimensional spot × volatility view; [[margin-approval]] covered the basic margin rules; [[position-sizing]] dealt with how much to put on each trade, and [[tail-hedging]] with a single worst case. This lesson puts all of it into one report: **a book**. It builds Idea ④ — risk: the Greeks break risk into measurable parts, and who holds it and when leverage bites decide survival. It is also what market makers look at every day ([[market-makers]]).

## @intuition
Kai's account now holds three things (XYZ at $100, 30-day options, implied volatility 20%):

- 100 shares of XYZ;
- short 1 call struck at 105 (collected $71; covered);
- short 2 puts struck at 95 ($51 each; hoping to “buy the dip”).

Each is a strategy you have met: [[covered-call]] and [[cash-secured-put]]. But put together, what does the book look like?

Start by adding up the Greeks. The shares contribute a delta of 100; the short 105 call contributes \(-0.222 \times 100 = -22.2\); each short 95 put contributes \(+0.163 \times 100\), for \(+32.7\) in total. **The book's delta is about +110 shares** — more than just owning 100 shares.

Gamma and vega add up the same way: gamma about −13.8 shares per $1 (every short option is short gamma), vega about −$22.7 per vol point (rising volatility hurts), theta about +$7.4 a day (time is on Kai's side).

> [!KAI] Kai's intuition versus the real numbers
> Kai does the mental math: “Delta 110 shares, XYZ drops $15, I lose \(110 \times 15 \approx \$1{,}650\).”
> Reprice every position with Black-Scholes at 85 and the book actually loses **about $3,276** — almost double. The difference comes from the two short 95 puts: once the stock breaks 95, their delta grows fast and the losses accelerate.

That is delta's blind spot: delta is the *current* slope, while an options book's P&L curve bends. The cure is to compute the “what ifs” directly — spot −20%, −15% … +10%, volatility −5, +10, +20 points — and lay them out as a **scenario grid**.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Scenario grid for Kai's income book">
<text x="365" y="24" text-anchor="middle" class="fx-t-b">instant spot move</text>
<text x="154" y="50" text-anchor="middle" class="fx-t-sm">−20%</text>
<text x="224" y="50" text-anchor="middle" class="fx-t-sm">−15%</text>
<text x="294" y="50" text-anchor="middle" class="fx-t-sm">−10%</text>
<text x="364" y="50" text-anchor="middle" class="fx-t-sm">−5%</text>
<text x="434" y="50" text-anchor="middle" class="fx-t-sm">0</text>
<text x="504" y="50" text-anchor="middle" class="fx-t-sm">+5%</text>
<text x="574" y="50" text-anchor="middle" class="fx-t-sm">+10%</text>
<text x="112" y="81" text-anchor="end" class="fx-t-sm">vol −5 pts</text>
<text x="112" y="115" text-anchor="end" class="fx-t-b">unchanged</text>
<text x="112" y="149" text-anchor="end" class="fx-t-sm">+10 pts</text>
<text x="112" y="183" text-anchor="end" class="fx-t-sm">+20 pts</text>
<rect x="120" y="60" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.74"/>
<text x="154" y="81" text-anchor="middle" class="fx-t">−4,765</text>
<rect x="190" y="60" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.56"/>
<text x="224" y="81" text-anchor="middle" class="fx-t">−3,266</text>
<rect x="260" y="60" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.37"/>
<text x="294" y="81" text-anchor="middle" class="fx-t">−1,811</text>
<rect x="330" y="60" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.23"/>
<text x="364" y="81" text-anchor="middle" class="fx-t">−624</text>
<rect x="400" y="60" width="68" height="32" rx="3" class="fx-fill-green" opacity="0.16"/>
<text x="434" y="81" text-anchor="middle" class="fx-t">+100</text>
<rect x="470" y="60" width="68" height="32" rx="3" class="fx-fill-green" opacity="0.21"/>
<text x="504" y="81" text-anchor="middle" class="fx-t">+473</text>
<rect x="540" y="60" width="68" height="32" rx="3" class="fx-fill-green" opacity="0.23"/>
<text x="574" y="81" text-anchor="middle" class="fx-t">+610</text>
<rect x="120" y="94" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.74"/>
<text x="154" y="115" text-anchor="middle" class="fx-t">−4,765</text>
<rect x="190" y="94" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.56"/>
<text x="224" y="115" text-anchor="middle" class="fx-t">−3,276</text>
<rect x="260" y="94" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.38"/>
<text x="294" y="115" text-anchor="middle" class="fx-t">−1,874</text>
<rect x="330" y="94" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.24"/>
<text x="364" y="115" text-anchor="middle" class="fx-t">−741</text>
<rect x="400" y="94" width="68" height="32" rx="3" class="fx-fill-green" opacity="0.15"/>
<text x="434" y="115" text-anchor="middle" class="fx-t">0</text>
<rect x="470" y="94" width="68" height="32" rx="3" class="fx-fill-green" opacity="0.20"/>
<text x="504" y="115" text-anchor="middle" class="fx-t">+399</text>
<rect x="540" y="94" width="68" height="32" rx="3" class="fx-fill-green" opacity="0.22"/>
<text x="574" y="115" text-anchor="middle" class="fx-t">+572</text>
<rect x="120" y="128" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.74"/>
<text x="154" y="149" text-anchor="middle" class="fx-t">−4,779</text>
<rect x="190" y="128" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.57"/>
<text x="224" y="149" text-anchor="middle" class="fx-t">−3,344</text>
<rect x="260" y="128" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.40"/>
<text x="294" y="149" text-anchor="middle" class="fx-t">−2,050</text>
<rect x="330" y="128" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.27"/>
<text x="364" y="149" text-anchor="middle" class="fx-t">−1,003</text>
<rect x="400" y="128" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.18"/>
<text x="434" y="149" text-anchor="middle" class="fx-t">−260</text>
<rect x="470" y="128" width="68" height="32" rx="3" class="fx-fill-green" opacity="0.17"/>
<text x="504" y="149" text-anchor="middle" class="fx-t">+200</text>
<rect x="540" y="128" width="68" height="32" rx="3" class="fx-fill-green" opacity="0.21"/>
<text x="574" y="149" text-anchor="middle" class="fx-t">+449</text>
<rect x="120" y="162" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.75"/>
<text x="154" y="183" text-anchor="middle" class="fx-t">−4,831</text>
<rect x="190" y="162" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.58"/>
<text x="224" y="183" text-anchor="middle" class="fx-t">−3,471</text>
<rect x="260" y="162" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.43"/>
<text x="294" y="183" text-anchor="middle" class="fx-t">−2,271</text>
<rect x="330" y="162" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.31"/>
<text x="364" y="183" text-anchor="middle" class="fx-t">−1,290</text>
<rect x="400" y="162" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.22"/>
<text x="434" y="183" text-anchor="middle" class="fx-t">−556</text>
<rect x="470" y="162" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.16"/>
<text x="504" y="183" text-anchor="middle" class="fx-t">−53</text>
<rect x="540" y="162" width="68" height="32" rx="3" class="fx-fill-green" opacity="0.18"/>
<text x="574" y="183" text-anchor="middle" class="fx-t">+265</text>
<text x="120" y="218" class="fx-t-sm">$, whole book; options repriced instantly with Black-Scholes (still 30 days)</text>
<text x="120" y="236" class="fx-t-sm">darkest bottom-left: a big drop plus rising vol, what short-option books fear most</text>
</svg>
<figcaption>Figure 1 · The scenario grid for Kai's income book. Read across for spot, down for volatility; darker means a bigger P&L. The top right (a small rally, falling vol) earns little; the bottom left (a big drop, rising vol) loses a lot — this “earn small, lose big” asymmetry is the typical shape of an option-selling portfolio.</figcaption>
</figure>

One grid answers three questions: **where you make money, where you lose it, and how much**. It needs no assumption about distributions or linearity; each cell is a full repricing of the whole book. Professional risk reports are built around it, with two companions: **stress tests** (extreme scenarios, historical or hypothetical) and **margin** (how much the broker makes you post against the risk).

::demo[portfolio-risk-var]

We'll take it in six parts:

- **① Adding up the Greeks**: the book's delta, gamma, vega and theta
- **② The scenario grid**: full revaluation and the delta-gamma approximation
- **③ Why linear VaR fails for options**
- **④ Stress tests**: historical scenarios, hypothetical scenarios and correlation
- **⑤ Margin**: Reg T and portfolio margin
- **⑥ Concentration and liquidity**: risks outside the grid

## @mechanics
### ① Adding up the Greeks

Greeks on the same underlying add directly (quantity × per-share Greek × contract multiplier):

$$
\Delta_{\text{book}} = \sum_i n_i\,\Delta_i \times 100, \qquad \Gamma_{\text{book}} = \sum_i n_i\,\Gamma_i \times 100, \quad \ldots
$$

\(n_i\) is the number of contracts in position \(i\) (positive when long, negative when short; stock counts as one unit per 100 shares with delta 1), and \(\Delta_i\), \(\Gamma_i\) are per-share Greeks.

| Position | Delta (shares) | Gamma (shares per $1) | Vega ($ per pt) | Theta ($ per day) |
|---|---|---|---|---|
| 100 shares of XYZ | +100.0 | 0 | 0 | 0 |
| Short 1 × 105 call | −22.2 | −5.2 | −8.5 | +3.1 |
| Short 2 × 95 put | +32.7 | −8.6 | −14.1 | +4.3 |
| **Total** | **+110.5** | **−13.8** | **−22.7** | **+7.4** |

Reading it: a delta of +110 means each $1 rise earns about $110; a gamma of −13.8 means each $1 rise removes 13.8 shares of delta (the more it rallies, the less it behaves like stock) and each $1 fall adds 13.8 (the more it falls, the more it behaves like stock). Vega −22.7: each vol point up costs about $23.

> [!WARN] Deltas on different underlyings don't simply add
> A delta of 100 shares of XYZ and a delta of 100 shares of a much more volatile stock both look like “100 shares” but carry very different risk. To aggregate across underlyings, first convert to **dollar delta** (\(\Delta \times S\)), then scale by each one's volatility (and their correlations) to make them comparable; likewise, vega needs care because implied volatilities at different tenors don't move in lockstep ([[vega]]).

> [!DEEP] Beta-weighted delta
> Many trading platforms convert each underlying's delta into “equivalent shares of an S&P 500 ETF”: \(\Delta_{\beta} = \Delta \times S \times \beta \,/\, S_{\text{index}}\), where \(\beta\) is the stock's sensitivity to the market. It answers “roughly how much do I lose if the market drops 1%?”, but \(\beta\) is estimated from history and often rises in a crisis — one more linear shortcut that works in normal times and fails at the extremes.

### ② The scenario grid: full revaluation and the delta-gamma approximation

Each cell of the grid is a full revaluation:

$$
\Delta\Pi(\Delta S, \Delta\sigma) = \sum_i n_i\,\big[V_i(S + \Delta S,\ \sigma + \Delta\sigma) - V_i(S, \sigma)\big] \times 100
$$

\(V_i\) is position \(i\)'s value from a pricing model (Black-Scholes here), and \(\Delta S\), \(\Delta\sigma\) are the assumed moves in spot and volatility. For a quick estimate, use the first two terms of the Taylor expansion:

$$
\Delta\Pi \approx \Delta\,\dd S + \tfrac12\,\Gamma\,\dd S^2
$$

Here \(\Delta\) and \(\Gamma\) are the book totals from ① (in shares, and shares per $1), \(\dd S\) is the stock move in dollars, and \(\Delta\Pi\) is the book's P&L in dollars. The first term is the straight line; the second bends it.

> [!EXAMPLE] “XYZ falls 15%” three ways
> \(\dd S = -15\), \(\Delta = 110.5\), \(\Gamma = -13.8\):
> - Delta only: \(110.5 \times (-15) \approx -\$1{,}657\)
> - Delta-gamma: \(-1{,}657 + \tfrac12 \times (-13.8) \times 15^2 \approx -1{,}657 - 1{,}552 = -\$3{,}209\)
> - Full revaluation: \(-\$3{,}276\)
>
> Adding gamma shrinks the error from over $1,600 to about $70. At −25% even delta-gamma drifts (it estimates −7,073 against a full revaluation of −6,265), because gamma itself changes.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Delta-only, delta-gamma and full revaluation">
<line x1="60" y1="78.6" x2="610" y2="78.6" class="fx-line-muted"/>
<line x1="368.6" y1="30" x2="368.6" y2="215" class="fx-line-muted fx-dash"/>
<polyline points="60.0,135.4 75.4,132.5 90.9,129.7 106.3,126.9 121.7,124.0 137.1,121.2 152.6,118.3 168.0,115.5 183.4,112.7 198.9,109.8 214.3,107.0 229.7,104.1 245.1,101.3 260.6,98.5 276.0,95.6 291.4,92.8 306.9,89.9 322.3,87.1 337.7,84.3 353.1,81.4 368.6,78.6 384.0,75.7 399.4,72.9 414.9,70.0 430.3,67.2 445.7,64.4 461.1,61.5 476.6,58.7 492.0,55.8 507.4,53.0 522.9,50.2 538.3,47.3 553.7,44.5 569.1,41.6 584.6,38.8 600.0,36.0" class="fx-line-muted fx-dash"/>
<polyline points="60.0,206.3 75.4,196.6 90.9,187.2 106.3,178.1 121.7,169.4 137.1,161.1 152.6,153.1 168.0,145.5 183.4,138.2 198.9,131.3 214.3,124.7 229.7,118.5 245.1,112.6 260.6,107.1 276.0,102.0 291.4,97.2 306.9,92.8 322.3,88.7 337.7,85.0 353.1,81.6 368.6,78.6 384.0,75.9 399.4,73.6 414.9,71.6 430.3,70.0 445.7,68.8 461.1,67.9 476.6,67.4 492.0,67.2 507.4,67.4 522.9,67.9 538.3,68.8 553.7,70.0 569.1,71.6 584.6,73.6 600.0,75.9" class="fx-line-blue"/>
<polyline points="60.0,201.1 75.4,193.4 90.9,185.7 106.3,178.0 121.7,170.4 137.1,162.8 152.6,155.3 168.0,147.9 183.4,140.7 198.9,133.6 214.3,126.8 229.7,120.2 245.1,114.0 260.6,108.1 276.0,102.7 291.4,97.6 306.9,93.0 322.3,88.8 337.7,85.0 353.1,81.6 368.6,78.6 384.0,75.9 399.4,73.6 414.9,71.5 430.3,69.8 445.7,68.3 461.1,67.0 476.6,66.0 492.0,65.1 507.4,64.4 522.9,63.9 538.3,63.4 553.7,63.1 569.1,62.8 584.6,62.6 600.0,62.5" class="fx-line-thick"/>
<line x1="137.1" y1="121.2" x2="137.1" y2="162.8" class="fx-line-bad"/>
<circle cx="137.1" cy="121.2" r="4" class="fx-fill-muted"/>
<circle cx="137.1" cy="162.8" r="4" class="fx-fill-red"/>
<text x="129" y="110" text-anchor="end" class="fx-t-sm">delta only: −1,657</text>
<text x="145" y="178" class="fx-t-bad">full revaluation: −3,276</text>
<text x="470" y="30" class="fx-t-sm">dashed: delta only (a line)</text>
<text x="470" y="100" class="fx-t-blue">delta-gamma (a parabola)</text>
<text x="470" y="118" class="fx-t-b">thick: full revaluation</text>
<text x="54" y="82" text-anchor="end" class="fx-t-sm">0</text>
<text x="54" y="133" text-anchor="end" class="fx-t-sm">−2k</text>
<text x="54" y="185" text-anchor="end" class="fx-t-sm">−4k</text>
<text x="60" y="232" text-anchor="middle" class="fx-t-sm">−20%</text>
<text x="214" y="232" text-anchor="middle" class="fx-t-sm">−10%</text>
<text x="368" y="232" text-anchor="middle" class="fx-t-sm">0</text>
<text x="523" y="232" text-anchor="middle" class="fx-t-sm">+10%</text>
<text x="610" y="248" text-anchor="end" class="fx-t-sm">instant XYZ move (whole-book P&amp;L, $)</text>
</svg>
<figcaption>Figure 2 · Three estimates for the same book. The straight line (delta only) badly understates losses in a sell-off and overstates gains in a rally; the parabola (delta-gamma) is much closer; the thick line is full revaluation. For a short-gamma book the true curve always bends downward.</figcaption>
</figure>

The grid has a second axis: volatility. The same −15% costs $3,276 with volatility unchanged and $3,471 with volatility up 20 points. Falling prices and rising volatility often arrive together (especially in equity indexes), so a report that only looks along the spot axis misses part of the risk — this is where vanna (delta's sensitivity to volatility) from [[higher-order-greeks]] comes in.

There is a third axis too: **time**. The grid assumes everything happens instantly; if nothing happens, theta earns Kai about $7.40 a day. But time improves only the middle of the grid, not the tails:

| Days elapsed | Spot unchanged | Spot −5% | Spot −15% |
|---|---|---|---|
| Today | 0 | −$741 | −$3,276 |
| After 7 days | +$53 | −$688 | −$3,284 |
| After 21 days | +$152 | −$556 | −$3,308 |

Three quiet weeks earn Kai $152, yet the −15% cell barely moves. **In a rent-collecting book, the profit that time accumulates comes nowhere near filling the hole in the tail** — the same “many small gains, one large loss” story as in [[variance-risk-premium]].

### ③ Why linear VaR fails for options

**Value at Risk** (VaR) answers: “over a horizon \(h\), what loss will we exceed only 1% of the time?” (for a 99% confidence level; 95% VaR is the loss exceeded 5% of the time). The simplest version is linear (delta-normal) VaR:

$$
\text{VaR}_{\text{linear}} = z_{c}\;|\Delta|\;S\;\sigma\sqrt{h}
$$

\(z_c\) is the standard normal quantile (about 2.33 at 99%), \(|\Delta|\) the book's delta in shares, \(S\) the stock price, \(\sigma\) the annualized volatility and \(h\) the horizon in years.

> [!EXAMPLE] Kai's book, 10 days, 99%
> \(2.33 \times 110.5 \times 100 \times 0.2 \times \sqrt{10/365} \approx \$851\).
> A 4,000-draw Monte Carlo with full revaluation (price moves only, excluding the 10 days of time decay) puts 99% VaR at about **$1,260** — the linear method understates it by about a third.
> The short strangle (short 105 call + short 95 put) is more extreme: its delta is almost zero (−5.9 shares), so linear VaR is only about $45, while full revaluation gives about **$344** — more than seven times as much.

The reason is simple: linear VaR assumes P&L is a straight-line function of the stock move, while an options book's P&L bends. For a short-gamma book it understates the left tail; for a long-gamma book (a long straddle, say) it actually overstates the risk, because the buyer's loss is capped. The inline demo above compares all three methods. Two deeper problems remain: VaR says how much you lose on 99% of days but **nothing about the other 1%**, and it usually assumes a normal distribution, blind to fat tails ([[tail-hedging]]). So professionals treat VaR as a daily gauge and the scenario grid and stress tests as the floor.

### ④ Stress tests: historical scenarios, hypothetical scenarios and correlation

The scenario grid is a regular mesh; stress tests pick a few **specific extreme scenarios** and ask “if that day happened again, where would I be?”

| Scenario | Historical reference | Kai's income book (illustrative) |
|---|---|---|
| Crash day: −20%, vol +25 pts | October 19, 1987: S&P 500 −20.5% in one day | about −$4,870 |
| Panic: −5%, vol +20 pts | February 5, 2018: VIX up 20.01 points in one day | about −$1,290 |
| Gap up: +15%, vol +5 pts | Single-stock events such as takeover news | about +$600 |

(Mapping index events onto a hypothetical stock is only illustrative; real stress tests are set separately for each underlying and for the market as a whole.)

> [!THINK] Kai adds short puts on five tech stocks, each “only a small part of the account”. How should the stress test be run to reveal the real risk?
> Think first: under what circumstances would all five go wrong together?
> ---
> Don't stress each stock by −20% separately, assume independence and average the results. Run a **joint scenario**: all tech stocks fall 20% together and implied volatilities rise together. Correlation might be 0.5 on normal days but approaches 1 in a crash (the effective number of independent bets from [[position-sizing]] drops toward 1). The point of a stress test is to assume, on your behalf, that “at the worst moment everything goes wrong at once”.

### ⑤ Margin: Reg T and portfolio margin

Brokers decide how much you must post in one of two ways (full rules in [[margin-approval]]):

**Reg T (strategy-based).** Buying stock needs 50% initial margin (Federal Reserve Regulation T); long options must be paid in full; short options follow a formula. For uncovered short equity options, the commonly used exchange minimum is:

$$
\text{requirement} = \text{premium} + \max\big(20\% \times S - \text{OTM amount},\ 10\% \times K\big)
$$

(\(10\% \times K\) for puts, \(10\% \times S\) for calls; everything per share, then \(\times\,100 \times \text{contracts}\); brokers may require more.) Kai's book: the shares need \(50\% \times 10{,}000 = \$5{,}000\); the covered call needs nothing extra; each 95 put needs \(0.51 + \max(20 - 5,\ 9.5) = 15.51\) per share, i.e. \(15.51 \times 100 = \$1{,}551\), or \(\$3{,}102\) for two. Total: about **$8,100**.

**Portfolio margin (risk-based).** Under FINRA Rule 4210(g), the whole book is run through a set of price scenarios (typically about ±15% for single stocks and narrow indexes, and a narrower range of about −8% to +6% for broad-based indexes; brokers may require more and add their own stresses), and the worst loss becomes the requirement. Kai's book loses at most about **$3,276** within ±15% — less than half the Reg T figure.

> [!FACT] Portfolio margin thresholds (as of September 2026)
> Brokers set portfolio-margin eligibility within the FINRA framework. Schwab, for example, requires at least **$125,000** of initial equity plus approval for uncovered options; common broker thresholds run from about $100,000 to $125,000 and up.

Now the short strangle (short 105 call + short 95 put): Reg T charges “the larger of the two sides plus the other side's premium”, about $1,622; the worst loss within ±15% is about $926.

Portfolio margin is more “sensible”: a well-hedged book frees up a lot of margin. But it also means **the same money can carry a bigger position**. A gap outside the scenarios (say −25%), or a broker widening its scenario ranges in turbulent markets, can double the requirement overnight — the options-world counterpart of the forced-liquidation machinery in [[margin-liquidation]].

### ⑥ Concentration and liquidity: risks outside the grid

The scenario grid assumes you can close at model value at any time. Two kinds of risk escape it:

- **Concentration**: too much in one stock, one expiry or one strike. A single company's earnings, merger or trading halt can gap the stock 30%, something an index almost never does. A common practice is to cap exposure per underlying and per expiry (as a share of the account, or in absolute vega and gamma).
- **Liquidity**: under stress, bid-ask spreads widen many times over, and deep out-of-the-money options may have no counterparty at all. Stress-test P&L should include the cost of getting out — for example, buying back short options at the ask rather than the mid. The larger the book and the more it sits in thinly traded contracts, the more this matters ([[liquidity-spreads]]).

Stack this lesson's tools and you have a respectable risk report: Greek totals (daily), the scenario grid (daily), VaR (daily, with its limits in mind), stress tests (weekly or when markets change), and margin and liquidity checks (before any new position).

## @analogy
Think of an options book as a **house with many rooms**, and the risk report as its **structural survey**.

- The Greek totals measure how much each wall leans right now: useful, but only about “now”;
- Linear VaR assumes that however hard the wind blows, the walls lean further only in proportion to their current tilt;
- The scenario grid puts the house in a wind tunnel, blowing from every direction at every speed, to see what cracks where;
- The stress test simulates “a once-in-a-century typhoon and an earthquake at the same time”;
- Margin is the maintenance fund the bank makes you keep after reading the survey.

The analogy misleads in one place: a house doesn't change because you surveyed it, but markets do. When many people manage risk with the same scenarios and the same rules, they are forced to do the same things at the same moment (cut positions, meet margin calls), making the stress scenario more likely to happen.

## @misconceptions
- **“The book's delta is near zero, so it's barely risky.”** — A short strangle has a delta of about −6 shares, yet its 10-day 99% full-revaluation VaR is about $344, more than seven times the linear estimate. A zero-delta book can carry large gamma and vega.
- **“VaR tells me the most I can lose.”** — A 99% VaR only says losses stay below that number 99% of the time; the other 1% can be far worse, and linear VaR tends to understate an options book's left tail.
- **“Each trade is capped at 2% of the account, so the book is safe.”** — If the positions lose together in one scenario (same direction, same sector, all short volatility), they are really one big position. Stress tests need joint scenarios.
- **“Portfolio margin is lower than Reg T, so the risk must be lower.”** — Lower portfolio margin only means smaller losses inside the specified scenario range. It lets you run bigger positions with less money; a gap outside the scenarios, or a broker widening its ranges, can make the requirement jump.
- **“The worst cell in the grid is the worst case.”** — The grid assumes you can close at model value. Under stress, spreads widen and liquidity vanishes, so the real exit loss is larger.

## @takeaways
- Greeks on one underlying add directly: Kai's income book has delta +110 shares, gamma −13.8, vega −$22.7 per point and theta +$7.4 a day.
- An options book's P&L bends: for a 15% drop in XYZ, delta alone says −$1,657, delta-gamma −$3,209, full revaluation −$3,276.
- The spot × volatility scenario grid fully reprices the book and is the core of a risk report; linear VaR understates a short-gamma book's left tail and says nothing about the worst 1%.
- Stress tests need joint scenarios: in a crash correlations approach 1, liquidity disappears, and the cost of getting out belongs in the number.
- Reg T sets margin by strategy formulas; portfolio margin takes the worst loss over risk scenarios (commonly ±15% for single stocks), which usually needs less money and makes it easier to lever up.

## @quiz
1. Kai's book: 100 shares of XYZ, short 1 × 105 call (Δ 0.222), short 2 × 95 put (Δ −0.163). What is the book's delta, in shares?
   - [ ] 100
   - [ ] 45
   - [x] 110
   - [ ] 67
   > \(100 - 22.2 + 2 \times 16.3 \approx 110.5\). A short put has positive delta (\(-1 \times -0.163\)), so the puts make the account *more* bullish than simply owning the shares.
2. Why does a delta-only estimate of “XYZ falls 15%” badly understate the loss on Kai's book?
   - [x] The book is short gamma: as the stock falls its delta grows and losses accelerate, while the linear estimate assumes a constant slope
   - [ ] Because delta only applies to calls
   - [ ] Because theta turns negative when the stock falls
   - [ ] Because the linear estimate ignores dividends
   > The short options bring negative gamma: once the stock breaks 95, the short puts' delta grows quickly. Linear gives −$1,657, full revaluation −$3,276; adding the \(\tfrac12\Gamma\,\dd S^2\) term gets to −$3,209.
3. A short-strangle book has a delta of about −6 shares, and its 10-day 99% linear VaR is about $45. What is the full-revaluation VaR more likely to be?
   - [ ] About $45 — a small delta means small risk
   - [ ] About $0
   - [x] About $340, far above the linear estimate
   - [ ] About $20, because theta is earning money
   > Linear VaR only sees delta and misses the short strangle's negative gamma entirely. A big move either way loses money; full revaluation gives about $344, more than seven times the linear figure.
4. Which statement about portfolio margin is most accurate?
   - [ ] FINRA sets a uniform $100,000 minimum for it
   - [ ] It always demands more margin than Reg T
   - [ ] It looks only at each position's maximum loss, ignoring hedges
   - [x] It takes the book's worst loss over a set of risk scenarios; well-hedged books usually need less, but it also makes leverage easier
   > Portfolio margin is computed over scenarios (commonly ±15% for single stocks) and recognizes hedges, so it is often below Reg T. Eligibility is set by brokers (Schwab, for example, requires $125,000). Lower margin means bigger positions are possible, and gap risk outside the scenarios remains.
5. You need to stress-test short puts on five different tech stocks. What is the most sensible approach?
   - [ ] Stress each stock by −20% separately and average the results
   - [x] Run a joint scenario: all tech stocks fall together while implied volatilities rise, and include the cost of closing out
   - [ ] Use only last year's VaR, since it already includes correlations
   - [ ] Skip stress testing, since each position is small
   > In a crash correlations approach 1 and the five positions lose together. A joint scenario plus exit costs reveals the real “everything goes wrong at once” risk.

## @further
- [FINRA Rule 4210: margin requirements](https://www.finra.org/rules-guidance/rulebooks/finra-rules/4210) — the rule text, including portfolio margin in 4210(g).
- [FINRA: margin accounts](https://www.finra.org/rules-guidance/key-topics/margin-accounts) — the basics of Reg T and margin accounts.
- [Schwab: portfolio margin](https://www.schwab.com/margin/portfolio-margin) — one broker's eligibility rules and explanation (an example, not a recommendation).
- [Value at risk (Wikipedia)](https://en.wikipedia.org/wiki/Value_at_risk) — VaR's definition, methods and limitations.
- [Options Clearing Corporation (OCC)](https://www.theocc.com/) — the central counterparty for US listed options and the official source on risk and margin methods.

## @next
Scenario grids, margin, stress tests — the tools are in hand. Yet the most common way accounts blow up is not a miscalculation but a rule known and not followed: refusing to take a loss, sizing up after wins, relaxing after a winning streak. The next lesson, the last of this stage, is about psychology, discipline and the trade journal.
