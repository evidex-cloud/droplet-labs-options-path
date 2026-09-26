---
id: tail-hedging
prereqs: bs-assumptions, smile-skew, vix, protective-put-collar, variance-risk-premium
demo: tail-hedging
---

# Tail Risk & Tail Hedging

## @hook
Spend 1–2% of a portfolio each year on deep out-of-the-money puts, and for most of two decades the money is “wasted” — until the crash year, when it pays back many times over. Is that insurance worth buying? It depends on how crashes arrive and how expensive the insurance is. This lesson does the arithmetic and lays out the strongest arguments on both sides.

## @bridge
The previous lesson, [[variance-risk-premium]], stood on the seller's side: implied volatility is expensive on average, so selling insurance pays on average but carries the tail. This lesson moves to the buyer's side. [[bs-assumptions]] showed that real returns have fat tails, with crashes far more common than a normal distribution predicts; [[smile-skew]] showed that the market knows this, so out-of-the-money puts carry higher implied volatility; [[protective-put-collar]] taught Kai to put a floor under the shares. Tail hedging combines these: spend very little, and insure only the worst stretch. It builds Idea ④ — risk: who carries the tail, what it costs, and when protection actually works.

## @intuition
Start with a real sense of scale.

On October 19, 1987 (“Black Monday”), the Dow fell 22.6% in one day and the **S&P 500 fell 20.5%**. The S&P 500 usually moves about 1% a day; under a normal distribution, a one-day fall of twenty standard deviations is so improbable as to be meaningless — and yet it happened. In the decades since, 2008, March 2020 and April 2025 kept reminding markets that **the tails are fatter than the bell curve says** ([[bs-assumptions]]).

**Tail hedging** buys insurance for exactly those moments: spend a little in normal times on puts struck far below the current price; in calm months they expire worthless, and in a crash their value multiplies tens or hundreds of times.

> [!KAI] Kai's catastrophe policy
> Kai holds 100 shares of XYZ ($10,000). Each month Kai spends about $10.50 on **2 contracts** of the 30-day put struck at **85** (15% below spot, priced at a skewed implied volatility of 28%, $5.25 per contract). That is about $126 a year, or 1.26% of the portfolio.
> - In an ordinary month XYZ stays above 85, the puts expire worthless, and Kai is out $10.50.
> - If XYZ falls 25% in a month to 75, each put is worth \((85 - 75) \times 100 = \$1{,}000\) at expiry — $2,000 for the two — while the shares lose $2,500. **A 25% loss becomes a loss of about 5%.**
> - Bought at $5.25, now worth $1,000: about **190 times** the premium.

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Kai's portfolio value with and without a tail hedge">
<line x1="60" y1="220" x2="615" y2="220" class="fx-axis"/>
<line x1="60" y1="40" x2="60" y2="220" class="fx-axis"/>
<polygon points="60,66.3 310,136.3 60,206" class="fx-area-ok"/>
<line x1="60" y1="206" x2="610" y2="52" class="fx-line-muted"/>
<polyline points="60,66.3 310,136.3 610,52.3" class="fx-line-thick"/>
<line x1="310" y1="40" x2="310" y2="220" class="fx-line fx-dash"/>
<line x1="255" y1="120.9" x2="255" y2="151.4" class="fx-line-hl"/>
<circle cx="255" cy="151.4" r="4" class="fx-fill-muted"/>
<circle cx="255" cy="120.9" r="4" class="fx-fill-orange"/>
<text x="248" y="202" text-anchor="end" class="fx-t-sm">−20.5%: unhedged 7,950</text>
<text x="246" y="138" text-anchor="end" class="fx-t-hl">hedged: about 9,040</text>
<text x="316" y="54" class="fx-t-sm">strike 85</text>
<text x="70" y="58" class="fx-t-b">shares + 2 puts at 85</text>
<text x="420" y="144" class="fx-t-sm">grey line = shares only;</text>
<text x="420" y="160" class="fx-t-sm">above 85 the lines nearly touch;</text>
<text x="420" y="176" class="fx-t-sm">the gap is the $10.50 monthly premium</text>
<text x="60" y="238" text-anchor="middle" class="fx-t-sm">60</text>
<text x="160" y="238" text-anchor="middle" class="fx-t-sm">70</text>
<text x="260" y="238" text-anchor="middle" class="fx-t-sm">80</text>
<text x="360" y="238" text-anchor="middle" class="fx-t-sm">90</text>
<text x="460" y="238" text-anchor="middle" class="fx-t-sm">100</text>
<text x="560" y="238" text-anchor="middle" class="fx-t-sm">110</text>
<text x="610" y="254" text-anchor="end" class="fx-t-sm">XYZ price one month later</text>
<text x="54" y="210" text-anchor="end" class="fx-t-sm">6k</text>
<text x="54" y="140" text-anchor="end" class="fx-t-sm">8.5k</text>
<text x="54" y="70" text-anchor="end" class="fx-t-sm">11k</text>
</svg>
<figcaption>Figure 1 · The value of Kai's $10,000 portfolio one month later. The grey line holds shares only; the thick line adds 2 puts struck at 85. Above 85 the lines almost coincide (a sliver of premium apart); below 85 the two puts cover 200 shares, so the portfolio's value actually rises as the market falls — that is convexity: the deeper the fall, the more it pays.</figcaption>
</figure>

The catch: “ordinary months” are the vast majority. A 1.26% yearly premium adds up to more than 12% over ten years. If no month in those ten years breaks below 85, every cent of it is gone.

So the debate over tail hedging was never “does it help in a crash?” — it obviously does — but **whether the steady cost (carry drag) is worth it**. That depends on three things: how often crashes come, whether they arrive suddenly or slowly, and how expensive the insurance is.

::demo[tail-hedging-convexity]

We'll take it in six parts:

- **① Fat tails**: why crashes are more common than the bell curve says
- **② The toolbox**: out-of-the-money puts, put spreads, VIX calls, long-volatility funds
- **③ The cost**: skew, premiums and the yearly drag
- **④ The geometric-return argument**: is losing less once better than earning more often?
- **⑤ Monetizing and rolling**: when to turn insurance into cash
- **⑥ March 2020 and the debate**

## @mechanics
### ① Fat tails: why crashes are more common than the bell curve says

Black-Scholes assumes normally distributed log returns ([[random-walk]]). Under a normal distribution, one-day falls beyond four standard deviations should essentially never happen; in reality big down days are far more frequent, and they cluster: one crash is often followed by a stretch of high volatility. Some landmark days:

| Date | What happened |
|---|---|
| October 19, 1987 | Dow −22.6%, S&P 500 −20.5% (one day) |
| October 24, 2008 | VIX intraday high 89.53 |
| March 16, 2020 | VIX closed at 82.69, its highest close ever |
| August 5, 2024 | VIX intraday 65.73, closing near 38.6 |
| April 2025 | VIX intraday 60.13 on April 7; the S&P 500 fell 18.9% from its February high to April 8 |

The market prices these fat tails through **volatility skew** ([[smile-skew]]): the further out of the money a put, the higher its implied volatility. That is a sensible price for tail risk — and it makes tail insurance expensive (see ③).

### ② The toolbox

| Tool | How it pays | Strengths | Weaknesses |
|---|---|---|---|
| Out-of-the-money puts (10–30% OTM, 1–3 months) | Pays once the underlying breaks the strike | Direct, strongly convex | Skew makes them dear; in a slow bear they often expire worthless |
| Put spreads (buy a higher strike, sell a lower one) | Insures one band of the fall | Much cheaper | Capped payout; the most extreme tail is uninsured |
| VIX calls | VIX spikes in a panic | Very sensitive to sudden fear | Linked to VIX futures rather than spot VIX; the futures curve usually slopes upward, so carrying them is costly ([[vix]]) |
| Long-volatility / tail funds | Professionals combine the tools above | Execution and monetization experience | Fees; performance is mostly self-reported |
| Alternatives: trend following, Treasuries, cash | Asset allocation rather than options | No option carry drag | May not help on the day of the crash; the stock–bond correlation is not fixed, and in some years both fall |

No tool works in every crash. Sudden gaps (1987, March 2020) are where short-dated out-of-the-money puts shine; slow bear markets (a decline stretched over a year or more) suit trend following or simply holding less.

### ③ The cost: skew, premiums and the yearly drag

First, how much skew matters. XYZ's 30-day put struck at 85, priced with Black-Scholes at XYZ's at-the-money volatility and at a skewed one:

$$
P(K = 85,\ \sigma = 20\%) \approx \$0.0029, \qquad P(K = 85,\ \sigma = 28\%) \approx \$0.0525
$$

Here \(P\) is the put's price per share, with \(S = 100\), \(T = 30/365\) and \(r = 4\%\) as always. Eight vol points apart, and the prices differ by a factor of about 18. This option sits two to three standard deviations below spot, so nearly all of its value comes from the area in the tail, and that area is extremely sensitive to \(\sigma\). **Skew makes tail insurance expensive** — that is the market's price for fat tails. Price it without skew and tail insurance looks nearly free, an unrealistic result you can see in the main demo by setting the skew add-on to 0.

The yearly drag is simple arithmetic:

$$
\text{yearly drag} = \sum_{\text{each roll}} \frac{\text{premium} \times \text{contracts} \times 100}{\text{portfolio value}}
$$

Kai pays \(2 \times \$5.25 = \$10.50\) a month, \(12 \times \$10.50 = \$126\) a year, or \(126 / 10{,}000 = 1.26\%\) of the portfolio — one roll a month, so the sum has twelve terms. For a stock portfolio earning around 7% a year over the long run, that gives up roughly a fifth of the return — unless crash payouts earn it back.

> [!EXAMPLE] The same 1.5% yearly budget — what do you buy?
> Spend 0.125% of the portfolio each month:
> - On 85 puts (0.0525 per share): you cover about 2.4 times your shares. In a 25% monthly fall the payout is about 24% of the portfolio, cancelling almost all of the stock loss.
> - On 95 puts (about 22.7% implied, about 0.71 per share): you cover only about 0.18 times your shares. The same 25% fall pays about 3.5% of the portfolio.
>
> The further out of the money, the more crash payout each dollar buys — but the deeper the fall must be before it pays anything. The inline demo compares the multiples across strikes.

### ④ The geometric-return argument: is losing less once better than earning more often?

Start with a two-period example: up 50% one year, down 50% the next. The arithmetic average return is zero, yet \(1.5 \times 0.5 = 0.75\) — after two years you are down 25%. Long-run compounding follows the **geometric mean**, and volatility drags it down:

$$
G \approx \mu - \tfrac12\sigma^2
$$

\(G\) is the geometric mean annual return (the true compounding rate), \(\mu\) the arithmetic mean annual return, and \(\sigma\) the volatility of annual returns. Tail-hedging advocates argue that a hedge lowers \(\mu\) (the yearly premium), but if it removes the deepest losses and cuts \(\sigma\), \(G\) can go up. It is the same logic as the Kelly growth rate \(f\mu - \tfrac12 f^2\sigma^2\) in [[position-sizing]].

> [!EXAMPLE] One 30-year history under the main demo's defaults
> Stocks earn 7% a year before crashes with 15% volatility, and on average once every 10 years suffer a −20% fall within one month; the hedger spends 1.5% a year on 30-day puts 15% out of the money (priced at 28%).
> - Stocks only: mean yearly return 4.8%, volatility 15.5% → \(G \approx 4.8\% - \tfrac12(15.5\%)^2 \approx 3.6\%\); maximum drawdown 54%.
> - With the tail hedge: mean 5.5%, volatility 14.8% → \(G \approx 5.5\% - \tfrac12(14.8\%)^2 \approx 4.4\%\); maximum drawdown 39%.
>
> In this history the hedge loses its 1.5% premium in 26 of 30 years and pays big in 4 (+7.7%, +17.2%, +12.9%, +17.6%).

<figure>
<svg viewBox="0 0 640 230" role="img" aria-label="Net yearly P&L of the hedge sleeve">
<line x1="55" y1="150" x2="610" y2="150" class="fx-axis"/>
<rect x="62" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="80" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="98" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="116" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="134" y="103.7" width="14" height="46.3" class="fx-fill-green"/>
<rect x="152" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="170" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="188" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="206" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="224" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="242" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="260" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="278" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="296" y="46.7" width="14" height="103.3" class="fx-fill-green"/>
<rect x="314" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="332" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="350" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="368" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="386" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="404" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="422" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="440" y="72.5" width="14" height="77.5" class="fx-fill-green"/>
<rect x="458" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="476" y="44.5" width="14" height="105.5" class="fx-fill-green"/>
<rect x="494" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="512" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="530" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="548" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="566" y="150" width="14" height="9.0" class="fx-fill-red"/>
<rect x="584" y="150" width="14" height="9.0" class="fx-fill-red"/>
<text x="141" y="97" text-anchor="middle" class="fx-t-ok">+7.7%</text>
<text x="303" y="40" text-anchor="middle" class="fx-t-ok">+17.2%</text>
<text x="447" y="66" text-anchor="middle" class="fx-t-ok">+12.9%</text>
<text x="483" y="38" text-anchor="middle" class="fx-t-ok">+17.6%</text>
<text x="200" y="182" class="fx-t-bad">the other 26 years: −1.5% each (the premium)</text>
<text x="49" y="154" text-anchor="end" class="fx-t-sm">0</text>
<text x="610" y="216" text-anchor="end" class="fx-t-sm">year 1 → year 30 (simulated, % of portfolio)</text>
</svg>
<figcaption>Figure 2 · The hedge sleeve's net P&L each year (main demo defaults, default random seed). Its shape is the mirror image of the seller's in the previous lesson: small losses most years, large gains in a few.</figcaption>
</figure>

Change a few assumptions in the same model, though, and the verdict flips. Each scenario runs 400 histories of 30 years; medians shown:

| Scenario | CAGR: unhedged / hedged | Max drawdown: unhedged / hedged | Share of histories where the hedge wins |
|---|---|---|---|
| Default: sudden −20% crash, once every 10 years | 3.7% / 3.6% | 51% / 46% | 41% |
| Crashes twice as often (every 5 years) | 1.5% / 2.8% | 61% / 50% | 80% |
| Crash size −30% | 2.3% / 5.1% | 60% / 41% | 86% |
| Same total fall, spread over 6 months | 3.8% / 2.2% | 50% / 54% | 0% |
| No crash in 30 years | 6.2% / 4.6% | 40% / 43% | 0% |
| Richer skew (puts at 38% implied) | 3.7% / 2.4% | 51% / 53% | 0% |

**The value of tail hedging depends heavily on how crashes arrive and how much the insurance costs.** Sudden, deep falls are its home ground; slow bear markets, no crash at all, or overpriced insurance turn it into a steady leak.

> [!THINK] In the “spread over 6 months” row the total fall is the same as the default, so why does the hedge go from winning in four histories out of ten to never winning?
> Think first: what tenor and how far out of the money are the puts Kai buys?
> ---
> Kai buys 30-day puts 15% out of the money every month. In a slow bear each month falls only 3–4%, never breaking the strike, so the puts expire worthless again and again — the hedge keeps paying premiums right through the bear market. Short-dated deep out-of-the-money puts insure against *gaps*, not against *decline* as such. Insuring a slow bear needs longer tenors and closer strikes (more expensive), or different tools (holding less, trend following).

### ⑤ Monetizing and rolling: when to turn insurance into cash

A tail hedge's crash profit is a **paper** profit until it is realized. Sharp falls are often followed by sharp rebounds, and a put that is still held can hand most of its gain back:

> [!KAI] Should Kai sell now?
> Halfway through the month XYZ has fallen to 75 and at-the-money implied volatility has jumped to 50%. Kai's 85 put has 15 days left. It is now in the money, so it sits on the cheaper side of the skew (about 43% implied), and it is worth about **$10.10** — roughly its $10 intrinsic value, and nearly 200 times the $0.0525 Kai paid. If Kai waits until expiry and XYZ rebounds to 84, it is worth only $1.

Strikes closer to the new price keep more time value, which the vol spike inflates: with the inline demo's defaults, the 80 put is worth about $5.97 at mid-month against $5 of intrinsic value.

Common practice (describing practice, not advising):

- **Monetize in stages**: sell part of the position once the puts reach some multiple or implied volatility spikes;
- **Roll down**: sell puts that are now in the money and buy new ones at lower strikes, locking in profit while keeping protection;
- **Rebalance**: use the cash to buy stocks back near the lows — many advocates argue that much of a tail hedge's real value comes from “having cash at the most frightened moment”.

The discipline is hard: in a crash people hate to sell (“it will fall further”), and in calm times they hate to buy (“this money is wasted every year”). That is a [[trading-psychology]] problem as much as a math problem.

### ⑥ March 2020 and the debate

> [!FACT] Universa's March 2020 (self-reported)
> According to Universa Investments' investor letter of April 7, 2020 (as reported in the press), its tail-hedge strategy returned **+3,612% in March 2020** and +4,144% year to date — measured **on the capital invested in the hedge**, not on a whole portfolio. Universa also said that a 3.33% allocation added about 12.7% to an S&P 500 portfolio in March 2020. The two numbers are on different bases and cannot simply be multiplied. **These are self-reported figures, and some managers dispute how they are calculated.**

The strongest arguments on each side:

- **Advocates**: large crash payouts can sharply reduce a portfolio's deepest drawdown and raise its geometric return, and they supply cash to rebalance at the most frightened moment. The issue, they argue, is not the premium in isolation but the return and risk of the whole portfolio together.
- **Critics**: over the long run, buying puts means standing on the other side of the variance risk premium ([[variance-risk-premium]]), so you pay that premium on average; many backtests show portfolios that buy protection continuously lag over time. Similar drawdown control can come from holding fewer stocks, holding cash or trend following, possibly more cheaply. And the most striking results are self-reported, from few episodes, where the role of timing is hard to rule out.

A balanced conclusion: tail hedging is neither a free lunch nor insurance doomed to lose. It is a **bet on the shape of crashes** — sudden, deep, panicked ones. Whether you need it depends on whether you can survive that one deep drawdown (would you be forced to sell, be liquidated, or face redemptions?), not just on its average return.

## @analogy
Tail hedging is like **fire insurance** on a house.

In almost every year the premium is “wasted” — the house doesn't burn and the money doesn't come back. A sharp-penciled owner could add it up: all those premiums would pay for a renovation. But the real reason to insure is not a positive expected value; it is that **you cannot afford the year the house burns**: without insurance you lose the home; with it, you can start again.

- The yearly premium = the hedge's carry drag;
- The year of the fire = the crash, when the policy pays tens or hundreds of times the premium;
- The deductible = how far out of the money the put is: further out is cheaper, but small fires aren't covered;
- The insurer's profit = the variance risk premium: on average you pay more than you collect.

The analogy misleads in two places. First, a house fire usually has nothing to do with your wallet, while in a market crash your job, other assets and borrowing terms often deteriorate at the same time — so tail protection can be worth *more* than fire insurance. Second, fire insurance pays out once, while with options you must decide when to cash in; if the market rebounds quickly after a crash and you haven't sold, most of the payout can evaporate.

## @misconceptions
- **“A tail hedge loses money every year, so it's useless.”** — Its purpose is not to make money each year but to lose much less at the worst time. Whether it is worth it depends on crash frequency, shape and the price of insurance, and on whether you can survive the unhedged drawdown.
- **“Deep out-of-the-money puts are so cheap that a few are free protection.”** — They are cheap because they are far away, but in implied-volatility terms they are dear: skew makes the 85 put cost about 18 times its price at at-the-money volatility. And if the fall is not deep enough they pay nothing.
- **“Short-dated out-of-the-money puts protect against any bear market.”** — They protect against gap-style crashes. In a slow bear that falls a little each month, they expire worthless again and again.
- **“The S&P 500 fell 22.6% on Black Monday.”** — 22.6% was the Dow's fall; the S&P 500 fell 20.5% that day.
- **“Universa made 3,612% in March 2020, so portfolios holding it rose dozens of times.”** — That self-reported figure is measured on the capital invested in the hedge, not the whole portfolio; the same firm said a 3.33% allocation added about 12.7% to a portfolio that month.

## @takeaways
- Real returns have fat tails: on October 19, 1987 the S&P 500 fell 20.5% in a day, far beyond what a normal distribution allows.
- Tail hedges such as deep out-of-the-money puts pay small premiums continuously and tens or hundreds of times the premium in a crash; the return shape mirrors selling volatility.
- Skew makes tail insurance expensive: the same 85 put costs about 18 times as much at 28% implied volatility as at XYZ's at-the-money 20%.
- The advocates' case is geometric return, \(G \approx \mu - \tfrac12\sigma^2\): cutting the deepest losses can pay for the premium, provided crashes are sudden and deep and the insurance is not too dear.
- Critics point to paying the variance risk premium over time and to cheaper ways of controlling drawdowns; Universa's +3,612% in March 2020 is self-reported and measured on the hedge sleeve only.

## @quiz
1. Kai's $10,000 XYZ portfolio buys 2 contracts of the 30-day 85 put each month ($5.25 each). A month later XYZ is at 75. What is the portfolio (shares plus puts, net of premium) worth?
   - [ ] $7,500
   - [x] About $9,490
   - [ ] About $8,500
   - [ ] $10,000
   > The shares are worth $7,500; each put is worth \((85 - 75) \times 100 = \$1{,}000\) at expiry, $2,000 in total; minus the $10.50 premium, about $9,490. $8,500 is the “floor” from a single contract covering 100 shares.
2. The same 30-day 85 put goes from 20% to 28% implied volatility. Roughly what happens to its price?
   - [ ] It rises about 40%, in proportion to volatility
   - [ ] It barely changes, since it's far from spot
   - [x] It rises about 18-fold
   - [ ] It roughly doubles
   > A deep out-of-the-money option's price comes almost entirely from the tail area, which is extremely sensitive to \(\sigma\): from about $0.0029 to about $0.0525. Only at-the-money prices are roughly proportional to \(\sigma\).
3. In the main demo's model, in which scenario is the tail hedge (monthly 30-day puts 15% out of the money) least likely to win?
   - [ ] Crashes twice as frequent
   - [ ] Crashes deepening from −20% to −30%
   - [x] The same total fall spread over 6 months
   - [ ] Implied volatility spiking after the crash
   > In a slow bear each month falls only a few percent and never breaks a strike 15% out of the money, so the puts expire worthless every time. Sudden, more frequent and deeper crashes are exactly the tail hedge's home ground.
4. After “up 50% one year, down 50% the next”, where is the portfolio relative to the start, and what does it show?
   - [ ] Flat, since the average return is zero
   - [x] Down 25%, showing that volatility drags down the geometric return, \(G \approx \mu - \tfrac12\sigma^2\)
   - [ ] Up 25%, because the gain came first
   - [ ] Down 50%, because the last year fell 50%
   > \(1.5 \times 0.5 = 0.75\). Compounding follows the geometric mean, and more volatility means more drag. That is the heart of the case for tail hedging: avoiding one deep loss can help compounding more than the premiums cost.
5. Which statement about Universa's reported +3,612% in March 2020 is most accurate?
   - [ ] Portfolios holding Universa rose about 36-fold in March
   - [ ] It is an independently audited return achieved by all tail funds
   - [ ] It proves tail hedging always beats not hedging in the long run
   - [x] It is a self-reported figure measured on the capital in the hedge, not a whole portfolio's return
   > The figure is self-reported, measured on the hedge sleeve, and disputed by some managers; Universa also said a 3.33% allocation added about 12.7% to a portfolio that month. One episode cannot settle a long-run question.

## @further
- [Federal Reserve History: the stock market crash of 1987](https://www.federalreservehistory.org/essays/stock-market-crash-of-1987) — what happened on Black Monday, including the Dow and S&P 500 declines.
- [Bloomberg Opinion (2023): Universa's “black swan” return and its asterisk](https://www.bloomberg.com/opinion/articles/2023-04-06/universa-s-3-126-black-swan-return-is-legit-but-with-an-asterisk) — an analysis of how Universa's returns are measured, and the dispute.
- [Forbes (April 2020): reporting on Universa's 2020 returns](https://www.forbes.com/sites/antoinegara/2020/04/13/how-a-goat-farmer-built-a-doomsday-machine-that-just-booked-a-4144-return/) — the original report of the self-reported March 2020 figures.
- [Cboe VIX methodology](https://cdn.cboe.com/resources/vix/VIX_Methodology.pdf) — how the VIX is computed and what VIX options are linked to.
- [Tail risk (Wikipedia)](https://en.wikipedia.org/wiki/Tail_risk) — tail risk and fat-tailed distributions in one place.

## @next
Tail hedging deals with “one worst case”. But a real options book usually holds stock, short calls, short puts and spreads all at once. How do their risks add up? What does the whole book lose if the stock falls 15% and volatility rises 10 points? And how much margin will the broker demand? The next lesson puts the whole book into one scenario grid.
