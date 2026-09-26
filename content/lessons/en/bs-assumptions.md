---
id: bs-assumptions
prereqs: binomial-one-step, risk-neutral, random-walk, black-scholes
demo: bs-assumptions
---

# Black-Scholes: The Assumptions and Where They Break

## @hook
Black-Scholes prices the 1-year XYZ call at $9.93 using a handful of assumptions, and every one of them is false. Volatility changes, prices gap, and nobody hedges continuously or for free. The formula still runs the options world. That isn't because it's true: it's the language everyone prices, quotes and hedges in. This lesson tests each assumption against reality, with numbers, and shows which failures cost real money.

## @bridge
[[black-scholes]] ended on a question: the formula assumes volatility never changes, prices never gap and hedging is continuous, so where, and by how much, does reality break those assumptions? Every assumption is a place where the replication argument of [[binomial-one-step]] can leak. [[risk-neutral]] pricing needs a perfect copy, and the lognormal walk of [[random-walk]] needs calm, independent shocks. This lesson builds Idea ② (when the copy is imperfect, no-arbitrage gives a range, not a single price), Idea ③ (the volatility smile is how the market corrects the formula) and Idea ④ (each leak is a risk that someone ends up holding). It hands over to the volatility lessons, which start by measuring σ from data in [[realized-vol]].

## @intuition
Black-Scholes is a recipe: *replicate the option with shares and cash, rebalance continuously, and the copy's cost is the price.* For the recipe to work exactly, the world must cooperate. Here is the list of what it needs, next to what actually happens:

| The model assumes | Reality | What breaks |
|---|---|---|
| Volatility σ is a known constant | Volatility moves: calm years, violent weeks | One σ can't fit all strikes and dates: the smile |
| Prices move continuously, no jumps | Earnings, takeovers, crashes: prices gap | A hedge can't be adjusted *during* a gap |
| Returns are lognormal (thin tails) | Big moves are far more common | Out-of-the-money options, especially puts, are worth more |
| You can hedge continuously | You rebalance in steps: daily, hourly | The copy drifts from the option between trades |
| No trading costs; borrow and short freely | Spreads, fees, borrow costs | Hedging costs money, more if you do it more often |
| Rates and dividends are known constants | Both change | Usually small, except for long-dated options |

Three of these failures dominate in practice: **fat tails and jumps**, **moving volatility**, and **discrete, costly hedging**. The others are real but second-order for most equity options.

> [!KAI] What an earnings gap does to a hedger
> Kai's XYZ reports earnings in three weeks. Suppose the news is bad and XYZ opens 8% lower. With 20% volatility, a typical trading day moves about 1.26%, so the gap is about 6.6 standard deviations. A normal distribution says a day like that should come around once in 200 million years. Individual stocks gap like this on earnings all the time. Now look at the dealer who sold Kai a 30-day at-the-money call for $2.45 and hedged it with 0.534 shares. The gap skips every price between 100 and 92, so there's no chance to adjust on the way. The dealer loses about **$2.01 per share** ($201 per contract) overnight. The call's time decay pays the dealer $0.044 a day, so one gap wipes out about 46 days of it. An 8% gap *up* costs about $1.80. A short-gamma hedger loses on a jump in either direction.

That's why the market doesn't simply plug one σ into the formula. Options that pay off in big moves, and above all out-of-the-money puts that pay off in crashes, trade at prices that correspond to a **higher implied volatility** than at-the-money options. When you plot implied volatility against strike you get a curve instead of a flat line: the **volatility smile** or **skew** ([[smile-skew]]). The smile is the market's patch for the formula's thin tails.

<figure>
<svg viewBox="0 0 660 250" role="img" aria-label="Normal distribution versus a fat-tailed distribution with the same variance">
<defs><marker id="bs-assumptions-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<polygon points="60,200 60,195 74,194 87,193 101,191 114,189 128,186 141,181 155,175 168,167 168,200" class="fx-area-bad"/>
<polyline points="60,195 74,194 87,193 101,191 114,189 128,186 141,181 155,175 168,167" class="fx-line-bad fx-dash"/>
<polyline points="60,200 74,200 87,200 101,200 114,199 128,198 141,196 155,190 168,177" class="fx-line-hl fx-dash"/>
<polyline points="60,200 74,200 87,200 101,200 114,200 128,200 141,200 155,199 168,199 182,198 195,195 209,192 222,186 236,178 249,167 263,153 276,138 290,122 303,109 317,100 330,97 344,100 357,109 371,122 384,138 398,153 411,167 425,178 438,186 452,192 465,195 479,198 492,199 506,199 519,200 533,200 546,200 560,200 573,200 587,200 600,200" class="fx-line-hl"/>
<polyline points="60,200 74,200 87,200 101,200 114,199 128,199 141,199 155,199 168,198 182,198 195,197 209,196 222,193 236,190 249,184 263,175 276,159 290,133 303,95 317,55 330,36 344,55 357,95 371,133 384,159 398,175 411,184 425,190 438,193 452,196 465,197 479,198 492,198 506,199 519,199 533,199 546,199 560,200 573,200 587,200 600,200" class="fx-line-bad"/>
<line x1="40" y1="200" x2="625" y2="200" class="fx-axis" marker-end="url(#bs-assumptions-ah)"/>
<text x="60" y="218" text-anchor="middle" class="fx-t-sm">−5σ</text>
<text x="168" y="218" text-anchor="middle" class="fx-t-sm">−3σ</text>
<text x="276" y="218" text-anchor="middle" class="fx-t-sm">−1σ</text>
<text x="330" y="218" text-anchor="middle" class="fx-t-sm">0</text>
<text x="384" y="218" text-anchor="middle" class="fx-t-sm">+1σ</text>
<text x="492" y="218" text-anchor="middle" class="fx-t-sm">+3σ</text>
<text x="600" y="218" text-anchor="middle" class="fx-t-sm">+5σ</text>
<text x="620" y="240" text-anchor="end" class="fx-t-sm">daily return, in standard deviations</text>
<text x="350" y="40" class="fx-t-bad">fat-tailed (Student-t, 3 d.f.)</text>
<text x="350" y="58" class="fx-t-sm">taller peak, thinner shoulders, fatter tails</text>
<text x="400" y="100" class="fx-t-hl">normal (what Black-Scholes assumes)</text>
<text x="60" y="130" class="fx-t-b">left tail, magnified ×20</text>
<text x="60" y="148" class="fx-t-sm">beyond −4σ: normal 0.003%</text>
<text x="60" y="164" class="fx-t-bad">fat-tailed 0.31% (about 100×)</text>
</svg>
<figcaption>Figure 1 · Two distributions of daily returns with the *same* variance. The fat-tailed one has more quiet days (the taller peak), fewer medium days, and far more extreme days. The dashed curves at the left magnify the tail 20 times: a move beyond −4 standard deviations is about 100 times likelier than the normal says. Option prices far from the money depend almost entirely on that tail.</figcaption>
</figure>

Slide the size of the move and see how the two views of the world diverge:

::demo[bs-assumptions-tails]

> [!THINK] A dealer sells the 30-day at-the-money XYZ call for $2.45 and delta-hedges it **once a day** instead of continuously. Volatility turns out to be exactly 20%, as priced. Roughly how far from zero will the dealer's final P&L typically be?
> Predict first: a few cents, around 40 cents, or around $2?
> ---
> Around ±$0.37 per share, about 15% of the premium. It averages out to roughly zero, but any single month can land well away from it. Between rebalances the hedge is stale, and those small errors add up like a random walk. Hedging four times as often (about 120 times over the month) only halves the error, to about $0.18. Section ③ has the formula; the main demo runs the experiment.

We'll take it in six parts:

- **① Fat tails and jumps**: how often “impossible” moves happen
- **② Volatility isn't constant**: clustering and the smile
- **③ Hedging in steps**: the \(1/\sqrt{N}\) error
- **④ Frictions**: costs, borrowing, rates and dividends
- **⑤ Other models**: Bachelier's normal model, jumps, stochastic volatility
- **⑥ Why Black-Scholes survives** in 2026

## @mechanics
### ① Fat tails and jumps

Measure a day's return in standard deviations: \(z = r_{\text{day}}/\sigma_{\text{day}}\), where \(\sigma_{\text{day}} = \sigma/\sqrt{252}\) on trading days (1.26% for 20% volatility). Under the normal distribution that Black-Scholes assumes, the chance of a day below \(-k\) standard deviations is \(\N(-k)\). With 252 trading days a year, such a day comes on average once every \(1/(252\,\N(-k))\) years. Compare that with a fat-tailed stand-in, a Student-t distribution with 3 degrees of freedom scaled to the same variance (a common textbook example of fat tails, not a fitted model):

$$
\text{years between } {-k\sigma} \text{ days} = \frac{1}{252 \times P(z < -k)}
$$

Where \(P(z < -k)\) is the one-day probability of a drop of at least \(k\) standard deviations under the chosen distribution.

How often should a \(-k\sigma\) day happen? Plugging in:

| Drop | Normal: once every | Fat-tailed (t, 3 d.f.): once every |
|---|---|---|
| −3σ | 2.9 years | 0.6 years |
| −4σ | 125 years | 1.3 years |
| −5σ | 13,800 years | 2.5 years |
| −7σ | 3.1 billion years | 6.6 years |
| −10σ | about \(5 \times 10^{20}\) years | 19 years |

For −4σ, for example: \(\N(-4) = 0.0000317\), and \(1/(252 \times 0.0000317) \approx 125\) years. Near the centre the two models roughly agree; in the tail they differ by factors of millions. A trader who has lived through a few 5σ days has good reason to doubt the normal column.

> [!HISTORY] 19 October 1987
> On “Black Monday” the S&P 500 fell about 20.5% in a single day and the Dow about 22.6% (Federal Reserve History). For a market with 20% annual volatility, that's a log return of −0.229, about **18 daily standard deviations**. The normal distribution puts the odds at about one in \(5 \times 10^{73}\). Portfolio insurance, a strategy that sold index futures as prices fell to mimic a put, added to the selling. After 1987, index put prices stopped matching a single Black-Scholes volatility, and the equity **skew** has been part of the market ever since.

**Jumps** are the sharpest form of fat tails: the price skips from one level to another with nothing traded in between. Earnings releases, takeover bids, drug-trial results and crashes all do this. A jump breaks the hedging argument at its root. Black-Scholes' copy is rebalanced along the way, and a jump has no “along the way”. Kai's 8% gap cost the hedged dealer about $2 per share, most of the premium, and no amount of faster rebalancing would have helped. That's why jump risk is priced *into* the option, through higher implied volatility before known events ([[earnings-events]]) and through the skew for unknown ones.

> [!DEEP] Jump-diffusion in one line
> Robert Merton's jump-diffusion model (1976) adds a random jump term to the random walk: \(\dd S/S = (\mu - \lambda k)\,\dd t + \sigma\,\dd W + (J - 1)\,\dd N\). Here \(\dd N\) switches on with probability \(\lambda\,\dd t\) (jumps arrive at rate \(\lambda\) per year), \(J\) is the random jump size and \(k = \E[J - 1]\) keeps the drift honest. With jumps the market is no longer complete: shares and cash can't copy the option exactly, so the price depends on how investors price jump risk. That's one reason the smile exists and never goes away ([[stochastic-vol]]).

### ② Volatility isn't constant

Black-Scholes feeds one number, σ, into the whole life of the option. Real volatility wanders. It clusters (turbulent days follow turbulent days) and it spikes in crises. The market's own 30-day volatility gauge for the S&P 500, the [[vix]], closed at a record 82.69 on 16 March 2020, spiked intraday to 65.73 on 5 August 2024, and ended August 2026 at 14.92. The same index, in different months, was priced at volatilities more than five times apart.

Clustering means a σ measured over a calm month can be badly wrong for a stormy one, which is why estimating it is a craft of its own ([[realized-vol]]). Volatility also moves *with* the price. When stock prices fall, volatility usually rises: losses raise companies' leverage, and falling prices bring forced selling and fear. This **leverage effect** reshapes the distribution. Big drops arrive together with higher volatility, so they are likelier than rises of the same size: the distribution has a fat *left* tail rather than the symmetric (in logs) bell of Black-Scholes. Models that let volatility move against the price reproduce this ([[stochastic-vol]]).

Two consequences follow:

- **Vega risk.** An option's value depends on a quantity that moves on its own. A trader who is hedged for price (delta) is still exposed to changes in volatility ([[vega]]); [[realized-vol]] and [[vol-forecasting]] deal with measuring and predicting it.
- **The smile.** If Black-Scholes were exactly right, every strike and expiry of XYZ would imply the same 20%. In real equity markets, lower strikes usually imply higher volatility. As an illustration, suppose the 30-day 95 XYZ put traded at $0.70 instead of the model's $0.51. Solving Black-Scholes backwards for that price gives an implied volatility of about **22.6%**. The market isn't saying XYZ has two volatilities. It's saying one lognormal can't describe XYZ's real distribution, so it uses a different σ at each strike to get the right prices out of the formula.

> [!FACT] Where the assumptions are strained hardest (2026)
> Short-dated options are where jumps and discrete hedging bite hardest, because there is little time for anything to average out. As of July 2026, a record 66.2% of SPX options volume was in contracts expiring the same day (Cboe). For these 0DTE options, a single intraday jump or an hour without rebalancing is a large share of the option's whole life ([[zero-dte]], [[gamma]]).

### ③ Hedging in steps: the \(1/\sqrt{N}\) error

Black-Scholes assumes the hedge is adjusted continuously. Real hedgers rebalance \(N\) times over the option's life. Between rebalances the hedge ratio is out of date, and the small mismatches add up like the random walk from [[random-walk]]. They average to about zero, but their spread shrinks only like \(1/\sqrt{N}\). A widely used approximation (Derman and Kamal) gives the typical size of the final hedging error for an at-the-money option:

$$
\text{s.d. of hedging P\&L} \;\approx\; \sqrt{\frac{\pi}{4}}\;\cdot\;\nu\,\sigma\;\cdot\;\frac{1}{\sqrt{N}}
$$

Where:

- \(\nu\) is the option's vega per 1.00 of volatility (per vol point × 100);
- \(\sigma\) is the volatility;
- \(N\) is the number of rebalances over the option's life;
- \(\sqrt{\pi/4} \approx 0.886\) is a constant from averaging over paths.

Treat it as an approximation for near-the-money options, not an exact law.

> [!EXAMPLE] The 30-day XYZ call, hedged daily
> Vega is 0.114 per vol point, so \(\nu = 11.40\); \(\sigma = 0.20\); daily rebalancing gives \(N = 30\):
> $$
> 0.886 \times 11.40 \times 0.20 \times \frac{1}{\sqrt{30}} = 0.886 \times 2.28 \times 0.183 = 0.37
> $$
> About ±$0.37 per share, 15% of the $2.45 premium. Six hundred simulated paths with the course engine give 0.369. Weekly hedging (\(N \approx 4\)) gives about ±$1.01; hourly hedging over trading hours (\(N \approx 140\)) about ±$0.17.

<figure>
<svg viewBox="0 0 660 250" role="img" aria-label="Hedging error falls like one over the square root of the number of rebalances">
<defs><marker id="bs-assumptions-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="70" y1="210" x2="620" y2="210" class="fx-axis" marker-end="url(#bs-assumptions-ah2)"/>
<line x1="70" y1="215" x2="70" y2="20" class="fx-axis" marker-end="url(#bs-assumptions-ah2)"/>
<line x1="70" y1="171" x2="600" y2="171" class="fx-grid"/>
<line x1="70" y1="133" x2="600" y2="133" class="fx-grid"/>
<line x1="70" y1="94" x2="600" y2="94" class="fx-grid"/>
<line x1="70" y1="55" x2="600" y2="55" class="fx-grid"/>
<polyline points="70,54 108,83 135,100 173,120 201,132 222,140 253,151 287,161 325,170 352,175 390,182 429,187 456,190 494,194 521,196 559,198 590,200" class="fx-line-thick"/>
<circle cx="70" cy="79" r="5" class="fx-fill-orange"/>
<circle cx="135" cy="112" r="5" class="fx-fill-orange"/>
<circle cx="222" cy="144" r="5" class="fx-fill-orange"/>
<circle cx="287" cy="162" r="5" class="fx-fill-orange"/>
<circle cx="357" cy="178" r="5" class="fx-fill-orange"/>
<circle cx="390" cy="181" r="5" class="fx-fill-orange"/>
<circle cx="456" cy="190" r="5" class="fx-fill-orange"/>
<circle cx="521" cy="196" r="5" class="fx-fill-orange"/>
<circle cx="590" cy="200" r="5" class="fx-fill-orange"/>
<text x="62" y="214" text-anchor="end" class="fx-t-sm">0</text>
<text x="62" y="137" text-anchor="end" class="fx-t-sm">1.0</text>
<text x="62" y="59" text-anchor="end" class="fx-t-sm">2.0</text>
<text x="70" y="228" text-anchor="middle" class="fx-t-sm">1</text>
<text x="287" y="228" text-anchor="middle" class="fx-t-sm">10</text>
<text x="390" y="228" text-anchor="middle" class="fx-t-sm">30</text>
<text x="504" y="228" text-anchor="middle" class="fx-t-sm">100</text>
<text x="590" y="228" text-anchor="middle" class="fx-t-sm">250</text>
<text x="620" y="245" text-anchor="end" class="fx-t-sm">rebalances over 30 days (log scale)</text>
<text x="80" y="32" class="fx-t-sm">typical hedging error, $ per share</text>
<text x="300" y="80" class="fx-t-b">line: approximation 2.02 ÷ √N</text>
<text x="300" y="98" class="fx-t-hl">dots: 600 simulated paths each</text>
<text x="398" y="165" class="fx-t-sm">daily (N = 30): ±0.37</text>
</svg>
<figcaption>Figure 2 · Typical hedging error for a short 30-day at-the-money XYZ call (premium $2.45), against the number of rebalances. The line is the \(1/\sqrt{N}\) approximation; the dots are simulations with the course engine. Hedging daily leaves about ±$0.37; going from 30 to 120 rebalances only halves it. Frequent hedging buys precision slowly and pays trading costs quickly.</figcaption>
</figure>

### ④ Frictions: costs, borrowing, rates and dividends

**Transaction costs.** Each rebalance crosses a bid–ask spread and may pay fees. Halving the hedging error takes four times as many trades, and so roughly four times the costs. There's an optimum, and it isn't “continuously”. Hayne Leland showed in 1985 that proportional costs can be folded into Black-Scholes by adjusting the volatility, upward for someone who is short options and rebalancing. Modern desks use no-trade bands around the target delta, and some now train them with machine learning ([[delta-hedging]], [[deep-hedging]]).

**Borrowing and shorting.** The copy of a put shorts stock. If the stock is hard to borrow, shorting costs a fee, which behaves like an extra dividend yield: calls get cheaper and puts dearer, visible through put-call parity ([[forwards-carry]], [[rho-carry]]). Retail traders also can't borrow at the risk-free rate, so their copy costs more than the model's.

**Rates and dividends.** Rates do move, but for most equity options the effect is small. A 1-point change in \(r\) moves the 30-day XYZ call by about $0.04 but the 1-year call by about $0.52. Dividends are paid in discrete lumps, not as a smooth yield. That matters for American calls just before ex-dividend dates, which is why trees are used for them ([[binomial-trees]]).

### ⑤ Other models: Bachelier's normal model, jumps, stochastic volatility

When an assumption fails badly, practitioners switch models rather than abandon the framework.

**Bachelier (normal) model.** Louis Bachelier's 1900 random walk moves prices by normally distributed *amounts*, not percentages: \(\dd S = \sigma_N\,\dd W\). Its call price (on a forward \(F\)) is

$$
C = e^{-rT}\Big[(F - K)\,\N(d) + \sigma_N\sqrt{T}\;\varphi(d)\Big], \qquad d = \frac{F - K}{\sigma_N\sqrt{T}}
$$

where \(\sigma_N\) is volatility in *price units* per \(\sqrt{\text{year}}\) (for XYZ, 20% of $100 = $20) and \(\varphi\) is the standard normal density.

Normal versus lognormal on XYZ (\(\sigma_N = \$20\), the same as 20% of $100):

| Option | Bachelier | Black-Scholes | Why |
|---|---|---|---|
| 30-day, at the money | 2.448 | 2.451 | near the money and short-dated, both are about \(0.4\,S\sigma\sqrt{T}\) |
| 1-year 80 put | 1.07 | 0.77 | the normal model puts more weight on low prices: a built-in downside skew |
| 1-year 120 call | 2.33 | 3.00 | the lognormal's long right tail makes upside calls dearer |

The normal model's big advantage is that **prices can be negative**. That matters wherever they really can be: spreads between two prices, some commodity futures, and interest rates. In April 2020 the expiring US crude-oil (WTI) futures contract settled below zero, the first negative settlement in its history. Lognormal models can't even represent such a price, which is why normal-model pricing is common in those markets.

**Jumps and stochastic volatility.** Merton's jump-diffusion (section ①) adds jumps. Heston's model (1993) lets volatility follow its own random process; Dupire's local volatility (1994) fits today's smile exactly; SABR is standard for rates. Rough-volatility models (2018) capture how volatility behaves at very short time scales. Each fixes some failures of Black-Scholes and pays with more parameters to estimate ([[stochastic-vol]]).

### ⑥ Why Black-Scholes survives in 2026

With so many broken assumptions, why is Black-Scholes still on every screen?

- **It's the quoting language.** Traders quote options by implied volatility, the σ that makes the formula match the market price ([[implied-vol]]). Using the formula backwards turns prices across strikes, expiries and underlyings into one comparable number. Practitioners like to say the smile is the wrong number put into the wrong formula to get the right price, and it works.
- **It's the risk language.** Delta, gamma, vega and theta come from Black-Scholes, and desks aggregate them across books ([[greeks-map]]).
- **Its errors are graceful.** A hedger who uses the wrong volatility doesn't blow up. They earn or lose the gap between the volatility that actually happens and the one they priced, roughly \(\tfrac12\Gamma S^2(\sigma_{\text{real}}^2 - \sigma_{\text{imp}}^2)\) per unit of time ([[delta-hedging]]). The formula turns “is my model right?” into a trade: “is realized volatility above or below implied?”. That's the variance-risk-premium business ([[variance-risk-premium]]).
- **It's the baseline.** Every richer model is described by how it bends Black-Scholes: its smile, its term structure, its jump premium. Knowing where the formula breaks tells you which risks you're actually paid to carry, and which ones can hurt you ([[tail-hedging]]).

> [!EXAMPLE] Priced at 20%, realized 25%: a graceful loss
> Kai's dealer sells the 30-day at-the-money call at 20% volatility ($2.45) and hedges it daily with Black-Scholes deltas computed at 20%. The month turns out stormier: XYZ moves with 25% volatility. The hedge still removes the direction, but each day's move is a little larger than the premium paid for. Over the month the shortfall is about the price difference between the two volatilities:
> $$
> \E[\Pi] \approx C(\sigma_{\text{imp}}) - C(\sigma_{\text{real}}) = 2.45 - 3.02 = -0.57
> $$
> where \(\Pi\) is the hedged seller's P&L per share, \(\sigma_{\text{imp}}\) the volatility used to price and hedge, and \(\sigma_{\text{real}}\) the one that happened. That is −$57 per contract; 600 simulated paths in the course engine average −$0.55. Had XYZ moved with only 15% volatility, the same dealer would have made about \(2.45 - 1.88 = +0.57\). Either way the result depends on the volatility gap, not on whether XYZ went up or down. Try it in the main demo below.

## @analogy
Think of a city's subway map. It is famously wrong about geography: distances are distorted, curves straightened, and stations that are a short walk apart can look far away. Yet millions of people use it every day, because it gets the one thing they need right, which line goes where. Everyone uses the same map, so it's also a common language: “change at the red line”.

Black-Scholes is the options market's subway map. Its picture of reality (constant volatility, no jumps, free continuous hedging) is distorted, but it gets the essential structure right. Prices come from the cost of hedging, volatility is what matters, and time to expiry enters through \(\sqrt{T}\). Everyone reads implied volatility and the Greeks off the same map.

Where the analogy breaks: nobody gets hurt by trusting a subway map for walking distances. They just walk too far. Trusting Black-Scholes in the tails can be ruinous. A short option position hedged by the formula can lose many months of income in one gap, as Kai's dealer did. The skilled user knows exactly where the map is distorted and doesn't use it for the walk.

## @misconceptions
- **“Since the assumptions are false, market prices based on Black-Scholes are wrong and easy to arbitrage.”** — Market prices aren't *computed* by the formula; they are set by buyers and sellers, and the formula is used backwards to express them as implied volatilities. The smile already corrects the formula's biases. What remains is risk, not free money.
- **“Hedging more often removes the risk.”** — It shrinks one error slowly (like \(1/\sqrt{N}\)) while costs grow quickly. And no rebalancing frequency protects against a jump: the price skips the levels where you'd have traded.
- **“Fat tails just mean big moves are common.”** — Big moves are still rare; they're just far less rare than the normal distribution says. A −5σ day is a once-in-14,000-years event under the normal and a once-in-a-few-years event under a fat-tailed model. The difference matters most for far out-of-the-money options.
- **“The smile shows the market is irrational.”** — It shows the market pricing what the model leaves out: jumps, fat left tails, volatility that rises when prices fall, and strong demand for crash insurance.
- **“Bachelier's model is a historical curiosity.”** — For short-dated near-the-money options it gives almost the same price as Black-Scholes (2.448 vs 2.451 for XYZ), and it's the natural choice where prices or rates can go negative.

## @takeaways
- Black-Scholes needs constant volatility, no jumps, lognormal returns, continuous costless hedging and known rates and dividends. Every one fails in real markets.
- Fat tails and jumps matter most: a −5σ day is once in about 13,800 years under the normal but every few years under a fat-tailed model, and a jump can't be hedged by trading faster.
- Volatility moves and differs by strike. The smile is the market's correction for fat tails and jumps (e.g. a 95 put at $0.70 instead of $0.51 implies about 22.6% instead of 20%).
- Discrete hedging leaves an error of about \(\sqrt{\pi/4}\,\nu\sigma/\sqrt{N}\): ±$0.37 per share for the 30-day XYZ call hedged daily. Halving it needs four times the trades, and costs grow with each one.
- The formula survives as the market's quoting language (implied vol), risk language (Greeks) and baseline, and its errors turn into a clear trade: realized versus implied volatility.

## @quiz
1. A dealer's daily-hedged 30-day XYZ call leaves a typical hedging error of about $0.37 per share. How often must the dealer rebalance to cut that to about $0.18?
   - [ ] Twice as often (about 60 times)
   - [x] About four times as often (about 120 times)
   - [ ] Ten times as often (about 300 times)
   - [ ] It can't be reduced; the error is fixed by volatility
   > The error falls like \(1/\sqrt{N}\), so halving it needs \(N\) four times larger: \(0.37 \times \sqrt{30/120} = 0.185\). Each extra rebalance also costs a spread, which is why desks don't hedge continuously.
2. Under the normal distribution, a −7σ trading day should happen about once every 3.1 billion years; under a fat-tailed Student-t (3 d.f.) with the same variance, about once every 6.6 years. What does this imply for option prices?
   - [ ] Nothing: option prices only depend on at-the-money volatility
   - [ ] Out-of-the-money calls and puts should both be cheaper than Black-Scholes says
   - [x] Far out-of-the-money options, especially puts, are worth more than Black-Scholes with a single volatility says, which shows up as a smile or skew
   - [ ] At-the-money options should be much more expensive than Black-Scholes says
   > Deep out-of-the-money options pay only in the tail, and the tail is where the two distributions disagree by factors of millions. The market prices them at higher implied volatilities; near the money, the two views roughly agree.
3. Which failure of the Black-Scholes assumptions can **not** be fixed by rebalancing the hedge more often?
   - [ ] The hedge ratio going stale between trades
   - [x] A price jump, such as an 8% overnight earnings gap
   - [ ] The hedging error growing with vega
   - [ ] The error from hedging once a day instead of once an hour
   > During a jump no trading happens at the intermediate prices, so there is nothing to rebalance into. Kai's dealer lost about $2 per share on the 8% gap however often they had hedged before it. Jump risk has to be priced in, not hedged away.
4. What is the best explanation for why Black-Scholes is still used everywhere in 2026?
   - [ ] Because its assumptions have become more realistic as markets improved
   - [ ] Because regulators require it for all option pricing
   - [ ] Because it gives exact prices for short-dated options
   - [x] Because it's the shared language for quoting (implied volatility) and risk (Greeks), and a hedger using it with the wrong volatility gains or loses the realized-versus-implied gap instead of blowing up
   > The assumptions are no more true than in 1973. The formula survives as a convention and a baseline: prices are quoted in implied vol, risks in Greeks, and richer models are described by how they bend it.
5. For the 30-day at-the-money XYZ call, Bachelier's normal model gives 2.448 and Black-Scholes gives 2.451. Where do the two models differ most?
   - [ ] For short-dated at-the-money options
   - [x] Far from the money and over long horizons, and whenever prices can go below zero
   - [ ] Only in how they treat interest rates
   - [ ] They never differ by more than a cent
   > Near the money over short horizons both reduce to about \(0.4\,S\sigma\sqrt{T}\). In the wings they diverge (1-year 80 put: 1.07 vs 0.77), and only the normal model can handle negative prices, as in the oil futures contract that settled below zero in April 2020.

## @further
- [Federal Reserve History: Stock Market Crash of 1987](https://www.federalreservehistory.org/essays/stock-market-crash-of-1987) — what happened on Black Monday, including the role of portfolio insurance.
- [Volatility smile (Wikipedia)](https://en.wikipedia.org/wiki/Volatility_smile) — how implied volatility varies by strike, and why the pattern changed after 1987.
- [Jump diffusion (Wikipedia)](https://en.wikipedia.org/wiki/Jump_diffusion) — Merton's model and other ways to add jumps to a random walk.
- [Gatheral, Jaisson & Rosenbaum (2018), Volatility is rough](https://arxiv.org/abs/1410.3394) — evidence that volatility itself moves in a far rougher way than classical models assume.
- [Buehler et al. (2019), Deep Hedging](https://www.tandfonline.com/doi/full/10.1080/14697688.2019.1571683) — learning hedging strategies that account for trading costs and discrete rebalancing.

## @next
Every failure in this lesson comes back to one number: σ. It isn't constant, it isn't known, and the formula can't live without it. So how do you actually measure how much a price moves, from the data you have? The volatility lessons begin there: [[realized-vol]].
