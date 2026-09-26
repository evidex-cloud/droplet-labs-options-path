---
id: execution-tca
prereqs: liquidity-spreads, orders, market-makers, delta-hedging, backtesting, vol-forecasting
demo: execution-tca
---

# Execution, Slippage & Transaction-Cost Analysis

## @hook
Every lesson so far quietly assumed you could trade at the price on the screen. You can't. Between the decision and the fill sit the spread, the delay, your own market impact and the orders that never fill. Transaction-cost analysis measures that gap in dollars; the Almgren–Chriss model tells you how fast to trade when going slowly costs risk and going fast costs impact.

## @bridge
[[liquidity-spreads]] and [[orders]] introduced the bid-ask spread and the limit order; [[market-makers]] showed who stands on the other side and why they widen quotes against informed flow; [[backtesting]] warned that fills at the mid are fiction. This lesson closes Stage 14 by measuring and managing that friction. It builds Idea ④ — risk: execution is a trade-off between the cost you pay for certainty and the risk you carry for patience. The same trade-off drives the next stage, where [[deep-hedging]] learns hedging policies *with* costs and [[rl-market-making]] learns quoting and execution by trial.

## @intuition
Suppose, for illustration, that Kai's XYZ holding has grown to 1,000 shares, and Kai decides to sell ten of the 30-day 105 calls against them — a covered call worth $0.71 in theory. The screen shows **$0.66 bid, $0.76 ask**.

> [!KAI] Three ways to sell ten calls
> - **Market order.** Kai sells at the bid, $0.66. Compared with the $0.71 mid, that is \(0.05 \times 100 \times 10 = \$50\) left on the table — about 7% of the premium — in one second, with certainty.
> - **Limit at the mid, $0.71.** If a buyer comes, Kai keeps the $50. If none comes before XYZ moves, Kai may end up chasing at a worse price, or not selling at all.
> - **Limit at $0.69.** A compromise: Kai gives up $20 and raises the chance of a fill. The exchange's price-improvement auction may even fill it at $0.69 against a market maker who would not show that price on the screen.
>
> There is no free option here. **Certainty costs spread; patience costs risk.**

This lesson turns that intuition into numbers. First, a ruler for what an execution cost — the *effective spread* and the *implementation shortfall*. Then the decisions: where to put a limit order, how venues and auctions compete for it, and — for large orders such as a dealer's delta hedge — how to split them over time.

<figure>
<svg viewBox="0 0 700 360" role="img" aria-label="From the decision price to the final result: implementation shortfall">
<line x1="60" y1="110" x2="660" y2="110" class="fx-axis"/>
<circle cx="110" cy="110" r="6" class="fx-fill-ink"/>
<circle cx="250" cy="110" r="6" class="fx-fill-orange"/>
<circle cx="400" cy="110" r="6" class="fx-fill-red"/>
<circle cx="580" cy="110" r="6" class="fx-fill-blue"/>
<text x="110" y="90" text-anchor="middle" class="fx-t-b">decide</text>
<text x="110" y="134" text-anchor="middle" class="fx-t-sm">mid 2.45</text>
<text x="250" y="90" text-anchor="middle" class="fx-t-b">order arrives</text>
<text x="250" y="134" text-anchor="middle" class="fx-t-sm">mid 2.48</text>
<text x="400" y="90" text-anchor="middle" class="fx-t-b">15 filled</text>
<text x="400" y="134" text-anchor="middle" class="fx-t-sm">avg 2.53</text>
<text x="580" y="90" text-anchor="middle" class="fx-t-b">stop; 5 unfilled</text>
<text x="580" y="134" text-anchor="middle" class="fx-t-sm">mid 2.60</text>
<text x="60" y="40" class="fx-t">Kai decides to buy 20 XYZ 30-day 100 calls. Paper portfolio: 20 × 245 = $4,900.</text>
<line x1="60" y1="330" x2="660" y2="330" class="fx-axis"/>
<rect x="90" y="294" width="80" height="36" class="fx-fill-orange"/>
<rect x="210" y="234" width="80" height="60" class="fx-fill-red"/>
<rect x="330" y="174" width="80" height="60" class="fx-fill-blue"/>
<rect x="450" y="166" width="80" height="8" class="fx-fill-muted"/>
<rect x="570" y="166" width="80" height="164" class="fx-fill-ink"/>
<text x="130" y="288" text-anchor="middle" class="fx-t">$45</text>
<text x="250" y="228" text-anchor="middle" class="fx-t">$75</text>
<text x="370" y="210" text-anchor="middle" class="fx-t-inv">$75</text>
<text x="490" y="158" text-anchor="middle" class="fx-t">$9.75</text>
<text x="610" y="250" text-anchor="middle" class="fx-t-inv">$204.75</text>
<text x="610" y="158" text-anchor="middle" class="fx-t-b">4.2% of $4,900</text>
<text x="130" y="346" text-anchor="middle" class="fx-t-sm">delay</text>
<text x="250" y="346" text-anchor="middle" class="fx-t-sm">execution</text>
<text x="370" y="346" text-anchor="middle" class="fx-t-sm">opportunity</text>
<text x="490" y="346" text-anchor="middle" class="fx-t-sm">fees</text>
<text x="610" y="346" text-anchor="middle" class="fx-t-sm">total shortfall</text>
</svg>
<figcaption>Figure 1 · Implementation shortfall, piece by piece. The price moved before the order arrived (delay), the fills came above the arrival mid (execution), five contracts were never bought while the price ran away (opportunity), and fees were paid on what did fill. Together they are the gap between the paper portfolio and the real one.</figcaption>
</figure>

We'll take it in six parts:

- **① Measuring one fill**: mid, effective spread and price improvement
- **② Implementation shortfall**: the whole order, including what never filled
- **③ Where options orders go**: exchanges, auctions, complex order books and routing
- **④ Where to put a limit order**: fill probability against cost
- **⑤ Market impact and Almgren–Chriss**: splitting a large order over time
- **⑥ TCA in practice, and the state of play in 2026**

## @mechanics
### ① Measuring one fill: effective spread and price improvement

The reference point for a single fill is the **mid** \(M\) of the national best bid and offer at the moment the order arrives ([[options-data]]). The standard measure of what the fill cost is the **effective spread**:

$$
\text{ES} = 2\,\lvert P - M \rvert, \qquad \text{ES}_{\%} = \frac{2\,\lvert P - M\rvert}{M}
$$

where \(P\) is the execution price. The factor 2 makes it comparable with the quoted spread: a market order that fills exactly at the bid or ask has an effective spread equal to the quoted spread.

> [!EXAMPLE] Kai's call sale, three outcomes
> Quote $0.66 / $0.76, mid \(M = 0.71\), quoted spread 0.10 (14% of the mid).
> - Market order at 0.66: \(\text{ES} = 2 \times 0.05 = 0.10\), or 14.1% of the mid.
> - Filled at 0.69 through an auction: \(\text{ES} = 2 \times 0.02 = 0.04\), or 5.6%. The **price improvement** over the displayed bid is \(0.69 - 0.66 = \$0.03\) per share, $30 on ten contracts.
> - Filled at the mid: \(\text{ES} = 0\).

For options there is a second, more useful unit: **cost in volatility points**. Divide the cost per share by the option's vega ([[vega]]). The 105 call has vega 0.085 per vol point, so giving up \(0.05\) is like selling at an implied vol \(0.05/0.085 = 0.59\) points below the mid's. For a strategy whose edge is "sell 1–4 vol points of premium" ([[systematic-vol]]), that is a big share of the edge — which is exactly how [[backtesting]] should charge it.

> [!DEEP] Realized spread and markouts: who won the trade?
> The effective spread says what you paid; it doesn't say whether the other side made money. Market-quality studies split it with a **markout**: compare the fill with the mid a short time later, \(M_{t+\Delta}\). For a buy (direction \(D = +1\)) or sell (\(D = -1\)), the **realized spread** is \(2D(P - M_{t+\Delta})\) — what the liquidity provider kept after the price moved — and the **price impact** is \(2D(M_{t+\Delta} - M)\). If your fills are systematically followed by the price moving your way, the market maker loses on you and will quote you wider; if the price keeps moving against you after you fill, you are the one being picked off — adverse selection ([[market-makers]]).

### ② Implementation shortfall: the whole order

One fill is not the whole story. Orders are split, delayed and sometimes abandoned. Perold's **implementation shortfall** (1988) compares the real portfolio with a *paper portfolio* that traded everything at the price when the decision was made:

$$
\text{IS} = \underbrace{\sum_j q_j\,(P_j - P_{\text{arr}})}_{\text{execution}} + \underbrace{Q_f\,(P_{\text{arr}} - P_{\text{dec}})}_{\text{delay}} + \underbrace{(Q - Q_f)(P_{\text{end}} - P_{\text{dec}})}_{\text{opportunity}} + \text{fees}
$$

for a buy order, where \(Q\) is the intended quantity, \(q_j\) and \(P_j\) the size and price of each fill, \(Q_f = \sum_j q_j\) the filled quantity, \(P_{\text{dec}}\) the mid when you decided, \(P_{\text{arr}}\) the mid when the order reached the market, and \(P_{\text{end}}\) the mid when you stopped trying (for a sell, flip the signs). Each term answers a different question: did I hesitate, did I cross too much, did I give up too early, did I pay too much commission?

> [!EXAMPLE] Kai buys twenty calls
> Kai decides to buy 20 of the 30-day 100 calls when the mid is \(P_{\text{dec}} = 2.45\) (paper cost \(20 \times 245 = \$4{,}900\)). By the time the order is entered the mid is 2.48; 15 contracts fill at an average of 2.53; the last 5 never fill, and at the end the mid is 2.60. Fees are an illustrative $0.65 per contract.
> $$
> \begin{aligned}
> \text{delay} &= 15 \times (2.48 - 2.45) \times 100 = \$45 \\
> \text{execution} &= 15 \times (2.53 - 2.48) \times 100 = \$75 \\
> \text{opportunity} &= 5 \times (2.60 - 2.45) \times 100 = \$75 \\
> \text{fees} &= 15 \times 0.65 = \$9.75
> \end{aligned}
> $$
> Total \(\$204.75\), or \(204.75/4{,}900 = 4.2\%\) of the paper portfolio. The opportunity cost is as large as the execution cost — the price of being too patient.

::demo[execution-tca-is]

Implementation shortfall measures outcomes, luck included: if the price had fallen instead, the unfilled contracts would have *saved* money. That is why TCA looks at averages over many orders, never at one.

### ③ Where options orders go: exchanges, auctions and complex books

A US options order does not simply meet "the market". The same series is listed on many exchanges, each with its own book, linked by the requirement to respect the national best bid and offer. Three features shape execution quality:

- **Smart order routing.** Your broker's router decides where to send the order — to the exchange with the best displayed price, to one that pays rebates or runs an auction, or to a wholesaler. Under **payment for order flow (PFOF)**, wholesalers pay retail brokers for their orders and promise execution at or better than the NBBO. As of 2026 PFOF is legal in the US (disclosed under SEC Rule 606); the SEC's proposed Order Competition Rule and Regulation Best Execution were withdrawn on June 12, 2025. In the EU it has been banned, with Germany's transition ending on June 30, 2026. Whether PFOF harms retail execution is contested: critics point to conflicts of interest; defenders point to measured price improvement and zero commissions ([[orders]]).
- **Price-improvement auctions.** Many exchanges run short electronic auctions: a broker or market maker guarantees a price at or inside the NBBO and others may bid to improve it. Kai's fill at $0.69 against a $0.66 bid is the kind of outcome these auctions are designed to produce.
- **Complex order books.** Multi-leg orders — spreads, straddles, condors — trade as one package in a separate book, with a single net price. Tick sizes matter here too: in the penny program, options trade in $0.01 increments below $3.00 and $0.05 at or above (SPY, QQQ and IWM trade in pennies at every price), which sets the smallest possible spread on each leg.

> [!WARN] Legging risk
> Sending the two legs of a spread as separate orders ("legging") exposes you to the market moving between the fills. Buy the long leg of a call spread, and if XYZ jumps a dollar before the short leg fills, you sell it at a worse price or end up holding a naked long call. A complex order either fills both legs at your net price or not at all. Legging can occasionally beat the package price, but the risk is one-sided: small gains when it works, large slippage when the market moves.

### ④ Where to put a limit order: fill probability against cost

A limit order trades the certainty of a market order for a better price and some chance of not filling. A simple model makes the trade-off concrete. Put a buy limit at a distance \(\delta\) (in half-spreads) below the ask; a seller willing to trade at your price arrives in each short interval with intensity

$$
\lambda(\delta) = A\,e^{-k\delta}
$$

where \(A\) is the arrival rate at the ask itself and \(k\) how fast interest thins out further inside. This exponential form is the same one the Avellaneda–Stoikov market maker uses ([[rl-market-making]]). If the order has not filled by your deadline, you cancel and cross the spread. Your expected cost relative to the arrival mid is then

$$
\E[\text{cost}] = p_{\text{fill}}\,(L - M_0) + (1 - p_{\text{fill}})\,\E\big[\text{ask}_{\text{deadline}} - M_0 \mid \text{no fill}\big]
$$

where \(L\) is the limit price, \(M_0\) the arrival mid and \(p_{\text{fill}}\) the probability of a fill before the deadline. The second term is the catch: **you tend not to be filled precisely when the price is moving away from you**, so the chase costs more than the spread you saw when you started.

> [!THINK] In the main demo's toy market, with a 5-minute deadline, where is Kai's average cost lowest: a limit at the bid (2.40), at the mid (2.45) or at the ask (2.50)?
> Hint: think about which orders end up chasing.
> ---
> Not at the bid. Crossing at the ask costs exactly $0.05 a share. At the mid, about two-thirds of orders fill within 5 minutes and the average cost falls to roughly $0.033. At the bid only about a third fill; the rest chase a price that has often moved up, so the average is about $0.036 — and much more variable (standard deviation $0.080 against $0.060 at the mid). In this toy market the cheapest point sits a little below the mid; wait longer and it shifts toward the bid. **Patience lowers the average and raises the uncertainty** — the same trade-off as the next section, at a smaller scale.

The model's parameters are illustrative; real fill rates depend on the series, the time of day, the size shown and how informative your order flow looks to market makers. The habit it teaches is general: measure your own fill rates and chase costs, then set limits from data, not from hope.

### ⑤ Market impact and Almgren–Chriss

For a large order, the main cost is not the spread but **market impact**: your own buying pushes the price up. Dealers meet this every day when they hedge ([[delta-hedging]]). Suppose a dealer has just sold 500 of Kai's standard 30-day 100 calls to a client. Each has delta 0.534, so the hedge is to buy \(500 \times 100 \times 0.534 = 26{,}700\) XYZ shares. Buy them all at once and the price is pushed hard; buy them slowly and XYZ may run away first.

Almgren and Chriss (2000) wrote this down. Trade \(X\) shares over a horizon \(T\), holding \(x(t)\) still to trade at time \(t\), at rate \(v = -\dot x\). A temporary impact \(\eta v\) per share raises the price you pay while you trade fast; a permanent impact \(\gamma\) per share traded shifts the price for good; and the stock's volatility \(\sigma\) (in dollars per share per \(\sqrt{\text{day}}\)) makes the not-yet-traded shares risky. Minimizing expected cost plus \(\lambda\) times its variance gives the optimal holdings

$$
x(t) = X\,\frac{\sinh\big(\kappa(T - t)\big)}{\sinh(\kappa T)}, \qquad \kappa = \sqrt{\frac{\lambda\sigma^2}{\eta}}
$$

where \(\lambda\) is risk aversion. When \(\lambda \to 0\), \(\kappa \to 0\) and the schedule becomes a straight line — trade evenly, like a TWAP. The larger \(\lambda\), the more the trading is **front-loaded**: pay more impact now to carry less price risk later.

<figure>
<svg viewBox="0 0 660 250" role="img" aria-label="Almgren-Chriss trading trajectories for three levels of risk aversion">
<line x1="80" y1="200" x2="610" y2="200" class="fx-axis"/>
<line x1="80" y1="30" x2="80" y2="200" class="fx-axis"/>
<text x="72" y="44" text-anchor="end" class="fx-t-sm">26.7k</text>
<text x="72" y="204" text-anchor="end" class="fx-t-sm">0</text>
<polyline points="80,40 100,46 120,52 140,58 160,65 180,71 200,77 220,83 240,89 260,95 280,102 300,108 320,114 340,120 360,126 380,132 400,138 420,145 440,151 460,157 480,163 500,169 520,175 540,182 560,188 580,194 600,200" class="fx-line-muted"/>
<polyline points="80,40 100,57 120,71 140,85 160,97 180,108 200,117 220,126 240,134 260,141 280,147 300,153 320,158 340,163 360,167 380,171 400,175 420,178 440,181 460,184 480,187 500,189 520,191 540,194 560,196 580,198 600,200" class="fx-line-hl"/>
<polyline points="80,40 100,86 120,119 140,143 160,159 180,171 200,180 220,185 240,190 260,193 280,195 300,196 320,197 340,198 360,199 380,199 400,199 420,200 440,200 460,200 480,200 500,200 520,200 540,200 560,200 580,200 600,200" class="fx-line-bad"/>
<text x="330" y="50" class="fx-t-sm">linear (λ → 0): cost $1,461, risk $19,421</text>
<text x="330" y="68" class="fx-t-hl">λ = 10⁻⁵: cost $2,140, risk $13,933</text>
<text x="330" y="86" class="fx-t-bad">λ = 10⁻⁴: cost $6,387, risk $7,969</text>
<text x="80" y="218" class="fx-t-sm">open</text>
<text x="600" y="218" text-anchor="end" class="fx-t-sm">close (6.5 h)</text>
<text x="345" y="242" text-anchor="middle" class="fx-t-sm">shares still to buy; σ = $1.26/day, η = 2×10⁻⁶, γ = 10⁻⁷ (illustrative)</text>
</svg>
<figcaption>Figure 2 · Three schedules for the same 26,700-share hedge. The grey line trades evenly; the blue and red lines front-load as risk aversion rises. Expected cost climbs from about $1,461 to $6,387 while the standard deviation of the result falls from about $19,421 to $7,969 — an efficient frontier between cost and risk.</figcaption>
</figure>

The expected cost and variance of any such schedule are

$$
\E[C] = \tfrac12\gamma X^2 + \eta\int_0^T v(t)^2\,\dd t, \qquad \operatorname{Var}[C] = \sigma^2\int_0^T x(t)^2\,\dd t
$$

With the figure's illustrative parameters (\(\sigma = 100 \times 0.20/\sqrt{252} = \$1.26\) per share per day, \(\eta = 2\times 10^{-6}\), \(\gamma = 10^{-7}\), one trading day), the even schedule costs \(\tfrac12 \times 10^{-7} \times 26{,}700^2 + 2\times 10^{-6} \times 26{,}700^2 = 36 + 1{,}426 = \$1{,}461\) with a standard deviation of \(1.26 \times 26{,}700 \times \sqrt{1/3} = \$19{,}421\). The most front-loaded schedule cuts the risk by more than half at about four times the expected cost. Which point on the frontier is right depends on the desk's risk budget — and on its volatility forecast, since \(\sigma\) comes straight from [[vol-forecasting]]. Empirical work adds that impact is not linear in size: it is widely reported to grow roughly with the square root of the order's share of daily volume, so doubling a large order less than doubles its impact per share.

### ⑥ TCA in practice, and the state of play in 2026

A usable TCA process for an options trader is modest:

| Record for every order | Why |
|---|---|
| decision time and mid, arrival time and mid | delay cost |
| each fill: time, price, size, venue | execution cost, effective spread, price improvement |
| the option's vega at the time | cost in vol points, comparable across strikes |
| mid 1 and 5 minutes after each fill | markouts: are you being picked off? |
| unfilled quantity and the price when you stopped | opportunity cost |
| fees and rebates | the smallest item, but a certain one |

Aggregate by strategy, order type, time of day and venue. Then feed the measured numbers back into the backtest instead of a guessed "slippage" parameter.

> [!FACT] Execution in 2026
> As of 2026: PFOF remains legal and disclosed in the US after the SEC withdrew its order-competition and best-execution proposals (June 12, 2025), and is banned EU-wide from June 30, 2026. Cboe set July 13, 2026 as the launch of pre-market (7:30–9:25 a.m. ET) and post-market (4:00–4:15 p.m. ET) sessions for about 20 single-stock option classes, and SPX and VIX options already trade nearly around the clock on weekdays (Global Trading Hours plus a curb session). 0DTE options exceeded 20 million contracts a day across US options in the first half of 2026. Thinner sessions and same-day expiries both make it more important to measure execution separately by session and by time to expiry.

## @analogy
Executing an order is like **selling a house in a changing market**. The asking price posted by the agent is the mid. Accept the first cash offer and you close tomorrow for certain, but below the asking price — that is crossing the spread. List at the asking price and wait, and you might get it; but if the market turns while you wait, you end up cutting the price by more than the discount you refused — the chase. The time between deciding to sell and actually listing, during which prices moved, is the delay cost. The rooms you never sold because you pulled the listing are the opportunity cost. The agent's commission is the fee.

A developer with fifty identical flats faces Almgren–Chriss: list them all at once and flood the street, pushing prices down (impact); release them slowly and carry the risk that the whole market falls before the last one sells. The right pace depends on how much risk the developer can stomach.

The analogy misleads in one respect: a house sale takes months and happens a few times in a life, so each one feels unique. Trading costs repeat thousands of times, and small differences compound — which is why they have to be measured rather than felt.

## @misconceptions
- **"A limit order at the mid is free."** — It costs nothing when it fills, but it fills less often, and the unfilled orders tend to be the ones where the price moved away. Averaged over all orders, including the chases, the cost is not zero.
- **"Price improvement means the fill was good."** — Improvement is measured against the displayed NBBO, which may be wide. A fill $0.03 better than a $0.10-wide quote still gave up $0.02 against the mid; judge fills by effective spread and markouts, not by improvement alone.
- **"Implementation shortfall only counts what I traded."** — It also counts what you didn't trade. In Kai's example the five unfilled calls cost as much as the execution itself.
- **"Trading slowly always reduces cost."** — It reduces impact but adds price risk, and the unfilled part can cost more than the impact saved. Almgren–Chriss makes the trade-off explicit: lower expected cost comes with higher variance.
- **"Execution only matters for big institutions."** — For option strategies with an edge of a few vol points, half a spread can be a large share of the edge. Kai's 105 call gives up 0.59 vol points on a single market order.

## @takeaways
- Effective spread \(2|P - M|\) measures a single fill; for options, divide cost by vega to express it in vol points.
- Implementation shortfall compares the real portfolio with a paper one at the decision price: delay + execution + opportunity + fees.
- Options orders flow through routers, auctions and complex order books; multi-leg orders avoid legging risk; PFOF is legal in the US and banned in the EU (as of 2026).
- Limit orders trade cost for fill risk; unfilled orders are adversely selected, so the cheapest limit is usually inside the spread, not at the far side.
- Almgren–Chriss: \(x(t) = X\sinh(\kappa(T-t))/\sinh(\kappa T)\) with \(\kappa = \sqrt{\lambda\sigma^2/\eta}\); more risk aversion front-loads trading, trading impact cost for lower risk.
- Measure your own costs and feed them back into backtests; guessed slippage is another backtest pitfall.

## @quiz
1. Kai sells a call quoted $0.66 / $0.76 and is filled at $0.68. What is the effective spread, as a share of the mid?
   - [ ] 0.02, about 3%
   - [ ] 0.10, about 14%
   - [x] 0.06, about 8.5%
   - [ ] 0.03, about 4%
   > \(M = 0.71\), so \(\text{ES} = 2 \times |0.68 - 0.71| = 0.06\) and \(0.06/0.71 = 8.5\%\). The quoted spread is 0.10; the price improvement over the bid is 0.02.
2. In Kai's twenty-call order, 5 contracts never filled while the mid rose from 2.45 to 2.60. Which part of implementation shortfall is that?
   - [x] Opportunity cost: \(5 \times (2.60 - 2.45) \times 100 = \$75\)
   - [ ] Delay cost, because the order arrived late
   - [ ] Zero — unfilled contracts cost nothing
   - [ ] Execution cost, because the price went up
   > The paper portfolio bought all 20 at 2.45. The real one missed 5 of them, which are now worth 0.15 more each — $75 of shortfall, as large as the execution cost.
3. In the Almgren–Chriss model, what happens as risk aversion \(\lambda\) rises?
   - [ ] Trading becomes slower and more even
   - [ ] Expected cost falls and risk rises
   - [ ] Nothing changes; the optimal schedule is always linear
   - [x] Trading is front-loaded: expected impact cost rises and the variance of the result falls
   > \(\kappa = \sqrt{\lambda\sigma^2/\eta}\) grows with \(\lambda\), so \(x(t)\) falls faster early on. In the example, cost rises from about $1,461 to $6,387 as risk falls from about $19,421 to $7,969.
4. The 105 call has vega 0.085 per vol point. Kai gives up $0.05 per share against the mid on a market order. What is that in vol points?
   - [ ] 0.05 vol points
   - [x] About 0.59 vol points
   - [ ] About 5.9 vol points
   - [ ] It can't be expressed in vol points
   > Cost ÷ vega: \(0.05/0.085 = 0.59\). For a strategy that harvests one to four vol points of premium, that is a large share of the edge.
5. In the toy limit-order market, why is a limit at the bid not the cheapest choice on average?
   - [ ] Because exchanges charge more for orders at the bid
   - [ ] Because limit orders at the bid always fill immediately
   - [x] Because few orders fill there, and the unfilled ones must chase a price that has often moved away, so the average cost ends up above that of a limit near the mid
   - [ ] Because the bid is always stale
   > With a 5-minute deadline about a third of bid orders fill; the rest cross the spread at a higher price. The average cost (about $0.036) exceeds that of a limit at the mid (about $0.033), and it is more variable.

## @further
- [Almgren & Chriss (2000), Optimal Execution of Portfolio Transactions](https://www.smallake.kr/wp-content/uploads/2016/03/optliq.pdf) — the model of cost against risk used in this lesson.
- [SEC: Order Competition Rule (withdrawn June 2025)](https://www.sec.gov/rules-regulations/2025/06/order-competition-rule) — the proposal and its withdrawal, with background on PFOF and auctions.
- [Options Industry Council: penny increments](https://www.optionseducation.org/news/penny-increments) — the tick sizes that set the minimum spread.
- [Implementation shortfall (Wikipedia)](https://en.wikipedia.org/wiki/Implementation_shortfall) — Perold's paper-portfolio benchmark and its components.

## @next
Every cost in this lesson makes perfect, continuous hedging impossible — which is exactly what Black-Scholes assumed. What does the best hedge look like once costs are real and the model is uncertain? The next stage opens with deep hedging: letting a neural network learn a hedging policy that trades off risk against cost directly.
