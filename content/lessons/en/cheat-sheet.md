---
id: cheat-sheet
prereqs: black-scholes, greeks-map, strategy-matrix, funding-rate, position-sizing, capstone
demo: cheat-sheet
short: true
---

# Appendix: Formula & Numbers Cheat Sheet

## @hook
Every formula in this course fits on a few pages, and every one of them was first a picture and a number. This appendix puts them back together: grouped by the four ideas, each with its XYZ example and a link to the lesson where it was built. Keep it open next to your next option chain.

## @bridge
This is the last page of the course. The [[capstone]] used almost every tool at once; here the tools are laid out in one drawer. Nothing below is new — each line points back to where it was explained with a story, a figure and a demo, from [[call-option]] and [[put-call-parity]] to [[black-scholes]], [[greeks-map]], [[implied-vol]], [[funding-rate]] and [[position-sizing]]. It serves all four ideas: ① shape, ② no-arbitrage, ③ volatility, ④ risk.

## @intuition
A cheat sheet is only useful if you know which drawer to open. The course's four ideas are those drawers:

<figure>
<svg viewBox="0 0 660 220" role="img" aria-label="The four ideas as drawers of formulas">
<rect x="14" y="20" width="148" height="150" rx="10" class="fx-hl"/>
<rect x="176" y="20" width="148" height="150" rx="10" class="fx-box"/>
<rect x="338" y="20" width="148" height="150" rx="10" class="fx-blue"/>
<rect x="500" y="20" width="148" height="150" rx="10" class="fx-bad"/>
<text x="88" y="44" text-anchor="middle" class="fx-t-b">① Shape</text>
<text x="88" y="70" text-anchor="middle" class="fx-t-sm">payoffs, breakevens</text>
<text x="88" y="90" text-anchor="middle" class="fx-t-sm">spreads, straddles</text>
<text x="88" y="110" text-anchor="middle" class="fx-t-sm">condors, flies</text>
<text x="88" y="130" text-anchor="middle" class="fx-t-sm">perp vs option lines</text>
<text x="88" y="156" text-anchor="middle" class="fx-t-hl">“what do I get?”</text>
<text x="250" y="44" text-anchor="middle" class="fx-t-b">② No-arbitrage</text>
<text x="250" y="70" text-anchor="middle" class="fx-t-sm">bounds, forward</text>
<text x="250" y="90" text-anchor="middle" class="fx-t-sm">put-call parity, box</text>
<text x="250" y="110" text-anchor="middle" class="fx-t-sm">trees, Black-Scholes</text>
<text x="250" y="130" text-anchor="middle" class="fx-t-sm">futures fair value</text>
<text x="250" y="156" text-anchor="middle" class="fx-t">“what must it cost?”</text>
<text x="412" y="44" text-anchor="middle" class="fx-t-b">③ Volatility</text>
<text x="412" y="70" text-anchor="middle" class="fx-t-sm">1σ move, rule of 16</text>
<text x="412" y="90" text-anchor="middle" class="fx-t-sm">implied move, event vol</text>
<text x="412" y="110" text-anchor="middle" class="fx-t-sm">forward vol, skew</text>
<text x="412" y="130" text-anchor="middle" class="fx-t-sm">IV vs RV, VRP</text>
<text x="412" y="156" text-anchor="middle" class="fx-t-blue">“how big a move?”</text>
<text x="574" y="44" text-anchor="middle" class="fx-t-b">④ Risk</text>
<text x="574" y="70" text-anchor="middle" class="fx-t-sm">Greeks, Taylor P&amp;L</text>
<text x="574" y="90" text-anchor="middle" class="fx-t-sm">stress grid, sizing</text>
<text x="574" y="110" text-anchor="middle" class="fx-t-sm">Kelly, expectancy</text>
<text x="574" y="130" text-anchor="middle" class="fx-t-sm">liquidation, funding</text>
<text x="574" y="156" text-anchor="middle" class="fx-t-bad">“what can hurt me?”</text>
<text x="330" y="204" text-anchor="middle" class="fx-t-sm">start from the question you are asking, then open that drawer</text>
</svg>
<figcaption>Figure 1 · The four ideas as four drawers. Each asks one question — what do I get, what must it cost, how big a move, what can hurt me — and each section below answers one or two of them.</figcaption>
</figure>

> [!KEY] How to use this page
> Every formula below comes with the course's standard example, so you can check your own arithmetic against a known answer. Unless a line says otherwise, the inputs are XYZ's: \(S = 100\), \(\sigma = 20\%\), \(r = 4\%\), no dividend, 30 days (\(T = 30/365\)), prices per share and \(\times 100\) per contract. The live, searchable version with small calculators is the demo at the end of the page.

> [!THINK] Without looking below: what are the three numbers that describe XYZ's 30-day at-the-money call?
> Price, delta, and the size of a typical move.
> ---
> About **$2.45** a share ($245 a contract), a delta of about **0.53**, and a one-standard-deviation 30-day move of about **$5.73**. If you remember those three, you can rebuild most of the others: the straddle is about \(0.8 \times 5.73 \approx 4.57\), and the at-the-money rule \(0.4\,S\sigma\sqrt{T}\) gives 2.29 before interest.

The sheet has seven parts:

- **① Payoffs and strategies**
- **② No-arbitrage: bounds, forwards, parity, trees**
- **③ Black-Scholes and the Greeks**
- **④ Volatility**
- **⑤ Futures and perpetuals**
- **⑥ Sizing and risk**
- **⑦ Key numbers to remember**

## @mechanics
### ① Payoffs and strategies

Every strategy is a sum of pieces ([[payoff-lego]]):

$$
\Pi(S_T) = \sum_i n_i\,\pi_i(S_T)
$$

where \(\pi_i\) is the expiry P&L of one piece (a call, a put, stock or cash) and \(n_i\) how many you hold (negative if sold). Example: Kai's collar is +100 shares, −1 105 call, +1 95 put; at \(S_T = 90\) it pays \(-10 + 0.71 + (5 - 0.51) = -4.80\) per share — the floor.

| Structure | Key formula (per share) | XYZ 30-day example | Lesson |
|---|---|---|---|
| Long call | \(\max(S_T - K, 0) - c\); BE \(K + c\) | 100 call 2.45, BE 102.45 | [[call-option]] |
| Long put | \(\max(K - S_T, 0) - p\); BE \(K - p\) | 95 put 0.51, BE 94.49 | [[put-option]] |
| Covered call | max \((K - S_0) + c\); BE \(S_0 - c\) | 105 call: max 5.71, BE 99.29 | [[covered-call]] |
| Protective put | floor \(K - S_0 - p\) | 95 put: floor −5.51 | [[protective-put-collar]] |
| Collar | floor and cap shifted by the net credit | credit 0.20: −4.80 / +5.20 | [[protective-put-collar]] |
| Bull call spread | max \((K_2 - K_1) - D\); BE \(K_1 + D\) | 100/105: D 1.74, max 3.26, BE 101.74 | [[vertical-spreads]] |
| Straddle | BE \(K \pm (c + p)\) | 4.57: BE 95.43 / 104.57 | [[straddle-strangle]] |
| Iron condor | max loss = width − credit | 90/95/105/110: credit 1.02, max loss 3.98 | [[iron-condor]] |
| Call butterfly | \(C(K_1) - 2C(K_2) + C(K_3)\) | 95/100/105: 1.63, max 3.37 at 100 | [[butterfly]] |
| Income yield | annualized \((1 + R)^{365/d} - 1\) | 0.71 on 100 in 30 days → 8.99% | [[breakeven-returns]] |

### ② No-arbitrage: bounds, forwards, parity, trees

The one relation to know by heart is put-call parity ([[put-call-parity]]):

$$
C - P = S\,e^{-qT} - K\,e^{-rT}
$$

where \(C\) and \(P\) are a European call and put with the same strike \(K\) and expiry \(T\), \(q\) the dividend yield and \(r\) the risk-free rate. XYZ 30-day, \(K = 100\): \(2.45 - 2.12 = 0.33 = 100 - 99.67\). One year: \(9.93 - 6.00 = 3.93 \approx 100 - 96.08\).

| Rule | Formula | XYZ example | Lesson |
|---|---|---|---|
| Call bounds | \(\max(Se^{-qT} - Ke^{-rT}, 0) \le C \le Se^{-qT}\) | \(0.33 \le 2.45 \le 100\) | [[arbitrage-bounds]] |
| Butterfly ≥ 0 | \(C(K_1) - 2C(K_2) + C(K_3) \ge 0\) | 1.63 ≥ 0 | [[arbitrage-bounds]] |
| Forward | \(F = S\,e^{(r - q)T}\) | 100.33 (30 days), 104.08 (1 year) | [[forwards-carry]] |
| Box spread | \((K_2 - K_1)\,e^{-rT}\) | 5-wide, 30 days: 4.98 | [[synthetics-boxes]] |
| One-step hedge | \(\Delta = \dfrac{V_u - V_d}{S_u - S_d}\) | 100 → 120 / 80, K 100: 0.5 | [[binomial-one-step]] |
| Risk-neutral q | \(q = \dfrac{e^{r\Delta t} - d}{u - d}\) | same tree, \(r = 0\): 0.5, price 10.00 | [[binomial-one-step]] |
| CRR tree | \(u = e^{\sigma\sqrt{\Delta t}},\ d = 1/u\) | converges to 9.93 (1 year) | [[binomial-trees]] |
| Pricing rule | \(V_0 = e^{-rT}\,\E^{\Q}[V_T]\) | the drift \(\mu\) never appears | [[risk-neutral]] |

### ③ Black-Scholes and the Greeks

$$
C = S\,\N(d_1) - K e^{-rT}\,\N(d_2), \qquad P = K e^{-rT}\,\N(-d_2) - S\,\N(-d_1)
$$

$$
d_1 = \frac{\ln(S/K) + \left(r + \tfrac12\sigma^2\right)T}{\sigma\sqrt{T}}, \qquad d_2 = d_1 - \sigma\sqrt{T}
$$

where \(\N(\cdot)\) is the standard normal CDF; \(\N(d_2)\) is the risk-neutral probability of finishing in the money and \(\N(d_1)\) the call's delta ([[black-scholes]]). XYZ 1-year at the money: \(d_1 = 0.30\), \(d_2 = 0.10\), \(C = 61.79 - 51.87 = 9.93\), \(P = 6.00\). The textbook check (\(r = 5\%\)): 10.45 and 5.57.

| Greek | Formula (call, \(q = 0\)) | XYZ 30-day 100 call | Lesson |
|---|---|---|---|
| Delta | \(\Delta = \N(d_1)\) (put \(\N(d_1) - 1\)) | 0.534 | [[delta]] |
| Gamma | \(\Gamma = \dfrac{\varphi(d_1)}{S\sigma\sqrt{T}}\) | 0.069 (1-day: 0.381) | [[gamma]] |
| Theta | \(\Theta = -\dfrac{S\varphi(d_1)\sigma}{2\sqrt{T}} - rKe^{-rT}\N(d_2)\), per year | −0.044 a day | [[theta]] |
| Vega | \(\nu = S\varphi(d_1)\sqrt{T}\) | 0.114 per vol point | [[vega]] |
| Rho | \(\rho = KTe^{-rT}\N(d_2)\) | 0.042 per 1% (1-year: 0.519) | [[rho-carry]] |
| Taylor P&L | \(\dd V \approx \Delta\,\dd S + \tfrac12\Gamma\,\dd S^2 + \Theta\,\dd t + \nu\,\dd\sigma\) | explains most daily P&L | [[greeks-map]] |
| Gamma vs theta | \(\Theta \approx -\tfrac12\Gamma S^2\sigma^2\) (\(r = 0\)) | breakeven daily move ≈ $1.05 | [[theta]] |
| Hedged P&L | \(\tfrac12\Gamma S^2(\RV^2 - \IV^2)\,\dd t\) | realized 25% vs implied 20%: +0.021 a day | [[delta-hedging]] |
| ATM rule | \(C \approx 0.4\,S\sigma\sqrt{T}\) | 2.29 (2.45 with interest) | [[black-scholes]] |
| Elasticity | \(\Omega = \Delta\,S / V\) | \(0.534 \times 100 / 2.45 \approx 21.8\) | [[long-options]] |
| Vanna, volga | \(-\varphi(d_1)\,d_2/\sigma\), \(\ \nu\,d_1 d_2/\sigma\) | second-order spot–vol risk | [[higher-order-greeks]] |

### ④ Volatility

$$
\sigma_{\text{fwd}}^2 = \frac{\sigma_2^2\,T_2 - \sigma_1^2\,T_1}{T_2 - T_1}
$$

where \(\sigma_1, \sigma_2\) are the implied vols of two expiries \(T_1 < T_2\) and \(\sigma_{\text{fwd}}\) the vol the market implies *between* them ([[term-structure]]). Example: 20% for 30 days and 22% for 60 days imply \(\sqrt{(0.22^2 \times 60 - 0.20^2 \times 30)/30} \approx 23.8\%\) for days 30–60. The same subtraction extracts an earnings day: in the [[capstone]], 25% over 30 days against 20% everyday vol left a one-day event of about 4.4%.

| Quantity | Formula | XYZ example | Lesson |
|---|---|---|---|
| Realized vol | \(\hat\sigma = \sqrt{\tfrac{252}{n-1}\sum (r_i - \bar r)^2}\) | annualized from daily log returns | [[realized-vol]] |
| 1σ move | \(S\sigma\sqrt{T}\) | 30 days: $5.73 | [[random-walk]] |
| Daily 1σ | \(\sigma/\sqrt{365}\) or \(\sigma/\sqrt{252}\) | $1.05 (calendar), 1.26% (trading days) | [[random-walk]] |
| Rule of 16 | daily move ≈ vol ÷ 16 | VIX 16 → about 1% a day | [[vix]] |
| Straddle | \(\approx 0.8\,S\sigma\sqrt{T}\) | 4.57; implied move ≈ straddle ÷ S | [[implied-vol]] |
| Newton step for IV | \(\sigma_{n+1} = \sigma_n - \dfrac{C(\sigma_n) - C_{\text{mkt}}}{\nu(\sigma_n)}\) | converges in 2–4 steps | [[implied-vol]] |
| Skew measures | \(RR_{25} = \sigma_{25C} - \sigma_{25P}\), \(BF_{25} = \tfrac12(\sigma_{25C} + \sigma_{25P}) - \sigma_{\text{ATM}}\) | negative RR = equity skew | [[smile-skew]] |
| Density from prices | \(f_{\Q}(K) = e^{rT}\,\dfrac{\partial^2 C}{\partial K^2}\) | a butterfly ≈ a probability | [[risk-neutral-density]] |
| Variance risk premium | \(\IV^2 - \E[\RV^2]\) | index history: about 3–4 vol points | [[variance-risk-premium]] |
| BTC daily move | DVOL ÷ \(\sqrt{365}\) ≈ DVOL ÷ 19 | 50% → about 2.6% a day | [[crypto-options]] |

### ⑤ Futures and perpetuals

$$
P_{\text{liq}} \approx P_0\left(1 - \frac{1}{L} + m\right)
$$

where \(P_0\) is the entry price of a long, isolated perp, \(L\) the leverage and \(m\) the maintenance margin rate ([[margin-liquidation]]). Illustrative BTC at $100,000, 10×, 0.5%: \(100{,}000 \times (1 - 0.1 + 0.005) = \$90{,}500\) — a 9.5% dip ends the trade.

| Quantity | Formula | Example | Lesson |
|---|---|---|---|
| Fair future | \(F = S\,e^{(r - q)T}\) | XYZ 30 days: 100.33 | [[futures-basis]] |
| Annualized basis | \(\tfrac{1}{T}\ln(F/S)\) | 4.0% | [[futures-basis]] |
| Linear P&L | \((P_1 - P_0) \times Q\) | 0.1 BTC, +10,000 → +$1,000 | [[what-is-perp]] |
| Inverse P&L (coins) | \(N\left(\tfrac{1}{P_0} - \tfrac{1}{P_1}\right)\) | $100,000 notional, 100k → 110k: +0.0909 BTC | [[what-is-perp]] |
| Funding rate | \(F = P + \operatorname{clamp}(I - P, -0.05\%, +0.05\%)\) | baseline \(I\) = 0.01% per 8h | [[funding-rate]] |
| Funding APR | rate × intervals per day × 365 | \(0.01\% \times 3 \times 365 = 10.95\%\) | [[funding-rate]] |
| Inverse call | \(\max(S_T - K, 0)/S_T\) in coins | coin-settled payoff | [[crypto-options]] |

### ⑥ Sizing and risk

$$
f^* = p - \frac{1 - p}{b}
$$

where \(f^*\) is the Kelly fraction of capital to stake on a bet that wins \(b\) times the stake with probability \(p\) and loses the stake otherwise ([[position-sizing]]). Example: \(p = 0.55\), \(b = 1\) gives \(f^* = 0.55 - 0.45 = 10\%\); most practitioners use a fraction of that, and option payoffs are rarely this simple.

| Quantity | Formula | Example | Lesson |
|---|---|---|---|
| Contracts by stress | \(n = \lfloor \text{budget} / \text{stress loss} \rfloor\) | $400 / $185 → 2 | [[capstone]] |
| Expectancy | \(E = p\,\bar W - (1 - p)\,\bar L\) | \(0.4 \times 300 - 0.6 \times 150 = 30\) | [[trading-psychology]] |
| Recovery after a drawdown | \(\dfrac{1}{1 - d} - 1\) | −50% needs +100% | [[position-sizing]] |
| Delta-gamma P&L | \(\Delta\Pi \approx \Delta\,\dd S + \tfrac12\Gamma\,\dd S^2\) | scenario grids go further | [[portfolio-risk]] |
| Dollar delta | \(\Delta \times S \times 100\) per contract | 0.534 → $5,340 of XYZ | [[delta]] |
| Spread cost | \((\text{ask} - \text{bid}) / \text{mid}\) | 2.43/2.47 → 1.6% | [[liquidity-spreads]] |
| Early call exercise | \(D > P + K(1 - e^{-r\tau})\) | $0.50 dividend vs $0.035 | [[common-traps]] |
| Monte Carlo error | \(s / \sqrt{N}\) | 4× the paths halves the error | [[monte-carlo]] |

### ⑦ Key numbers to remember

| Number | Value | Where it comes from |
|---|---|---|
| Contract multiplier | ×100 (a 2.45 quote = $245) | [[contract-specs]] |
| XYZ 30-day 100 call / put | 2.45 / 2.12 | [[black-scholes]] |
| XYZ 30-day 105 call / 95 put | 0.71 / 0.51 (collar credit 0.20) | [[protective-put-collar]] |
| XYZ 1-year 100 call / put | 9.93 / 6.00 | [[black-scholes]] |
| Textbook check (r 5%) | 10.45 / 5.57 | [[black-scholes]] |
| 30-day forward / 1-year PV of 100 | 100.33 / 96.08 | [[forwards-carry]] |
| 30-day 1σ move / straddle | $5.73 / $4.57 | [[implied-vol]] |
| Theta: 30, 7, 1 days (ATM) | −0.044 / −0.084 / −0.214 a day | [[theta]] |
| Gamma: 30 vs 1 day (ATM) | 0.069 vs 0.381 | [[gamma]] |
| 10× BTC perp liquidation | about $90,500 (illustrative) | [[margin-liquidation]] |
| Auto-exercise threshold | $0.01 in the money; instructions until 5:30 p.m. ET | [[exercise-assignment]] |

> [!FACT] Numbers that change (as of September 2026)
> The rules and market facts in this course are dated. As of the latest figures used here: the OCC auto-exercises equity options $0.01 or more in the money; US stock settles T+1; 0DTE options were about two-thirds of SPX volume in July 2026 (66.2%); the VIX averaged about 19.6 against about 15.5 for the S&P 500's subsequent realized vol, a gap of about 4 vol points, from 1990 to about 2024 (CFA Institute blog analysis, July 2024). Check the source before relying on any of them.

> [!KAI] Where the path leaves Kai
> Kai began in [[welcome]] with 100 shares of XYZ and three wishes. Each one now has a number and a lesson behind it. **Protect:** the 95 put for $0.51, or the collar for a $0.20 credit ([[protective-put-collar]]). **Earn income:** the 105 covered call for $0.71, run by rules written before the fill ([[first-trade]]). **Bet on a big move with a capped loss:** two 100/105 call spreads, sized so the worst stress loss stays inside $400 ([[capstone]]). The formulas on this page are how Kai checks each trade. Choosing which wish, what size, and when to do nothing at all is what the whole course was for.

## @analogy
A cheat sheet is the laminated card a pilot keeps clipped to the yoke. It is not the training — the pilot spent years learning why each number is what it is — and nobody would try to fly from the card alone. But in the middle of a busy approach, nobody wants to re-derive the stall speed either. The card is for the moment you already understand the system and need one number, fast and right.

This sheet works the same way. Each line is a compressed lesson; if a line looks like noise, the link next to it takes you back to the picture that makes it obvious. Where the analogy breaks: an aircraft's numbers are fixed by physics and certified by an authority. Options numbers depend on inputs you must choose — especially volatility — and some facts on this page will be out of date within a year. Use the card to check your work, never to replace the thinking behind it.

## @misconceptions
- **“Knowing the formulas is knowing options.”** — Every formula here assumes something (constant vol, no jumps, a given rate). Knowing when a formula is the wrong tool — the smile, a jump, an event — matters more than remembering it.
- **“\(\N(d_2)\) is my chance of making money.”** — It is the risk-neutral probability of finishing in the money. Profit also needs the premium back, and real-world odds depend on the real drift.
- **“A quote of 2.45 means the option costs $2.45.”** — US equity options cover 100 shares: $245 a contract. Missing the ×100 makes every P&L and every size calculation wrong by a factor of 100.
- **“Implied vol above realized vol means options are overpriced.”** — Compare like with like. Events, the variance risk premium and the horizon all belong in the comparison.
- **“A funding APR is a yield I can lock in.”** — It is one interval's rate multiplied up. Funding changes every interval and can change sign.

## @takeaways
- The four ideas are four drawers: payoffs (shape), parity and pricing (no-arbitrage), moves (volatility), and Greeks, stress and sizing (risk).
- Put-call parity, Black-Scholes with \(d_1, d_2\), and the Taylor expansion of P&L are the three formulas worth knowing by heart.
- Three XYZ numbers rebuild most others: 2.45 for the 30-day ATM call, 0.53 for its delta, $5.73 for the 30-day 1σ move.
- Every formula has an assumption behind it; the link next to it tells you where it was built and where it breaks.

## @quiz
1. By put-call parity, XYZ's 30-day 100 call is 2.45 and \(Ke^{-rT} = 99.67\). What must the 100 put cost?
   - [ ] 2.45
   - [x] About 2.12
   - [ ] About 2.78
   - [ ] 0.33
   > \(P = C - S + Ke^{-rT} = 2.45 - 100 + 99.67 = 2.12\). The 0.33 is \(C - P\) itself.
2. XYZ is at 100 with 20% implied vol. Roughly how much does the 30-day at-the-money straddle cost?
   - [ ] $2.45 — the same as the call
   - [ ] $5.73 — one standard deviation
   - [ ] $11.46 — two standard deviations
   - [x] About $4.57 — 0.8 of the 1σ move of $5.73
   > The straddle prices the expected *absolute* move, about \(0.8 \times S\sigma\sqrt{T} = 0.8 \times 5.73 \approx 4.57\).
3. A perp long at $100,000 with 10× leverage and 0.5% maintenance margin is liquidated near:
   - [ ] $99,500
   - [ ] $95,000
   - [x] $90,500
   - [ ] $90,000
   > \(P_{\text{liq}} \approx 100{,}000 \times (1 - 1/10 + 0.005) = 90{,}500\). The maintenance margin moves it up from the naive $90,000.
4. Implied vol is 20% for 30 days and 22% for 60 days. What vol does the market imply for days 30–60?
   - [ ] 21% — the average
   - [ ] 22% — the longer one
   - [x] About 23.8% — total variances subtract, not vols
   - [ ] 2% — the difference
   > \(\sigma_{\text{fwd}} = \sqrt{(0.22^2 \times 60 - 0.20^2 \times 30)/30} \approx 23.8\%\). Variance is additive in time; vol is not.
5. A bet wins 1× its stake with probability 0.55 and loses the stake otherwise. What is the full Kelly fraction?
   - [x] 10%
   - [ ] 55%
   - [ ] 45%
   - [ ] 5%
   > \(f^* = p - (1 - p)/b = 0.55 - 0.45 = 0.10\). Practitioners usually stake a fraction of full Kelly, because estimates of \(p\) are noisy.

## @further
- [Black–Scholes model (Wikipedia)](https://en.wikipedia.org/wiki/Black%E2%80%93Scholes_model) — the formula, its derivations and the Greeks collected in one reference.
- [Put–call parity (Wikipedia)](https://en.wikipedia.org/wiki/Put%E2%80%93call_parity) — the proof and its American-option inequalities.
- [Cboe: VIX methodology](https://cdn.cboe.com/resources/vix/VIX_Methodology.pdf) — the official variance-strip formula behind the rule of 16.
- [OCC: Characteristics and Risks of Standardized Options](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the contract rules behind the ×100 and exercise numbers.
- [Satoshi Path (sister course)](https://evidex-cloud.github.io/nextdawn-satoshi-path/) — the bitcoin side of the perp and crypto-option formulas.
