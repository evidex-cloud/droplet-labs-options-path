export default {
  id: "hist-implied-vol",
  stage: 4,
  order: 2,
  title: "Historical vs Implied Volatility",
  difficulty: 2,
  prereqs: ["black-scholes"],

  oneLiner:
    "**Historical volatility (HV)** looks in the rearview mirror: how much the underlying actually moved in the past (the annualized standard deviation of returns). **Implied volatility (IV)** looks through the windshield: the market's expectation of future volatility, backed out of the option's market price via Black-Scholes. IV is the option's real \"price scale\" — compare IV to HV and you know whether an option is rich or cheap.",

  intuition: `
Last lesson's Black-Scholes (Stage 4.1) had five inputs, four of which — spot S, strike K, expiry T, rate r — are all out in the open, readable by anyone. Only the fifth, **volatility σ**, is invisible and intangible: it describes "how violently the underlying will move in the future," but the future hasn't happened yet. This lesson is all about that σ, and it has two faces.

**The first face: historical volatility (HV), also called realized volatility.** It is purely **computed**: take the underlying's daily returns over some past window (say 20 or 30 trading days), find their standard deviation, and annualize. It answers "**how bumpy has this name actually been lately.**" For example, if a stock's daily returns have a standard deviation of 1.26%, annualized that's 1.26%×√252 ≈ **20%** — we'd say its HV over the past month is about 20%. HV is the road in the rearview mirror: objective, certain, but **entirely the past.**

**The second face: implied volatility (IV).** It is **backed out**. Black-Scholes is a machine where "σ goes in, a price comes out"; but an option's market price is right there on the screen (the last trade or the bid-ask midpoint). So we run the machine **in reverse**: hold S, K, T, r fixed and keep trying different values of σ until the BS theoretical price exactly equals the market price — the σ that makes the formula match the market is the **implied volatility**. It answers "**how bumpy is the market betting this name will be in the future, right now.**" IV is the road beyond the windshield: the market's **expectation of the future**, voted on with real money.

A concrete example (reproducible in the demo): an ATM call with S=100, K=100, 30 days to expiry, r=4%.

- If it trades for **3.02** in the market, the IV backs out to ≈ **25%**.
- If the same one rises to **3.50**, the IV backs out to ≈ **29.2%** — a higher price means the market expects more future volatility.
- If it only trades for **2.00**, the IV backs out to ≈ **16.0%** — cheap, the market expects calmer waters.

See the key point? **For a single option, the price and the IV are one-to-one** — the higher the price, the higher the IV. So professional traders don't stare at "how many dollars is this option," they stare at "what's its IV." Because 3 dollars is a sky-high price for a 7-day option but a floor price for a 1-year one; IV normalizes away the effects of expiry and strike, so **25% IV is just 25% IV**, directly comparable across options and across underlyings. **IV is the option's "unit price," the true common language of this market.**

**In this lesson we break the two faces of volatility into five pieces:**

- **① Historical volatility HV: standard deviation of returns × √252 to annualize**
- **② Implied volatility IV: the "market expectation" you solve by running BS in reverse**
- **③ Why IV is the option's real "price scale"**
- **④ IV vs HV: rich or cheap (the seed of the variance risk premium)**
- **⑤ IV rank/percentile and the mean-reversion of volatility**
`,

  mechanics: `
### ① Historical volatility HV: how to compute it

Historical volatility is the underlying's **realized** swing, computed in three steps:

$$1) Daily return r_t = ln( P_t / P_{t−1} )   (log return)
$$2) Take the sample standard deviation of this series r_t → σ_daily
$$3) Annualize: σ_annual = σ_daily × √252
$$Why multiply by **√252**? A year has about 252 trading days; under the assumption that returns are independent, variance accumulates linearly with time, while standard deviation accumulates with the **square root** of time. So scaling daily volatility up to annual means multiplying by √252 ≈ 15.87. Conversely, **annualized volatility ÷ √252 = daily volatility** — an extremely useful conversion:

- HV = **20%/year** → daily ≈ 20%/15.87 ≈ **1.26%/day**.
- HV = **16%/year** → daily ≈ **1.0%/day** (handy: 16% annualized ≈ 1% per day).
- HV = **32%/year** → daily ≈ **2.0%/day**.

> This √time scaling is everywhere: the expected move over 30 days = annualized IV × √(30/365). The VIX (Stage 4.5) quotes a 30-day annualized volatility; to convert it to "roughly how much per day," likewise divide by √252.

HV's "window" matters a lot: 20-day HV is responsive but jumpy, 252-day HV is smooth but sluggish. It also has a built-in limitation — **it looks only at the past**, oblivious to upcoming earnings or big events.

### ② Implied volatility IV: solve BS in reverse

The Black-Scholes price is **monotonically increasing** in σ (the larger σ, the more expensive the option — this is Vega being positive, Stage 5.5). Monotonic means **invertible**: given a market price, there is one and only one σ that makes the formula match it. The solution is numerical:

- **Bisection**: σ too small → theoretical price too low → raise it; too large → too high → lower it, halving the interval to close in. The \`impliedVol()\` in \`_bs.js\` uses robust bisection.
- **Newton's method**: use Vega as the slope for faster convergence (the standard in live market-making systems).

There's a hard constraint: **the market price must exceed intrinsic value**, otherwise there is no solution (time value can't be negative). For deep in-the-money options, near expiry, or with garbled quotes, the IV may fail to solve (the demo will flag this).

Plug in the example: a call with S=100, K=100, T=30/365, r=4%; if the market price = 3.02, bisection gives σ ≈ **25%**; raise the price to 3.50 and it gives ≈ **29.2%**. **The moment the quote changes, the IV changes with it** — which is why trading-desk screens display IV directly, not just the premium.

### ③ Why IV is the real "price scale"

The same "3 dollars" can be absurdly expensive for a 7-day ATM option yet practically a giveaway for a 1-year one — because the thickness of time value is worlds apart. **The absolute premium number can't be compared across options.** IV solves this: it normalizes away the effects of strike and expiry, leaving only "the market's expectation of volatility per unit time," one pure quantity. So:

- **Comparable across expiries**: for the same name, near-month IV 30% and far-month IV 22% tell you at a glance the near month is "richer" (this is term structure, Stage 4.4).
- **Comparable across strikes**: same expiry, low-strike put IV 35% and ATM 20% tell you at a glance the market is paying up for downside protection (this is skew, Stage 4.3).
- **Comparable across underlyings**: stock A IV 80% and stock B IV 20%, regardless of share price, tell you directly whose options are "richer."

So the industry convention is **to quote in IV**: a market maker doesn't post "$2.35," they post "22 vols bid / 23 vols offer." **Trading options is, at its core, trading volatility.**

### ④ IV vs HV: rich or cheap

This is the single most central comparison in volatility trading. The logic is plain:

- **IV is the market's "ask" for future volatility; HV is the volatility the underlying actually delivers.**
- If **IV is well above HV** (say IV 30% vs HV 18%), the market is **charging extra** for future volatility — options are **rich**, relatively favoring the **seller**.
- If **IV is clearly below HV**, options are **cheap**, relatively favoring the **buyer**.

But don't treat it as a simple arbitrage signal. Over the long run, **IV is systematically a touch higher than the HV that subsequently realizes** — that gap is the **variance risk premium (VRP)** (detailed in Stage 8.3). It's not the market being dumb; it's that option sellers bear the risk of "volatility suddenly exploding" and deserve a risk compensation, just as an insurer's premiums long-run exceed actual claims. So "IV > HV" is the norm, not the anomaly, and the real judgment is **how high IV is relative to its own history** — which leads to piece ⑤.

> The quant view: simply comparing IV to current HV isn't enough, because what you really should compare IV against is the HV that will **realize in the future** — which is unknown. So some people use GARCH (Stage 9.3) or machine learning (Stage 10.1) to **forecast** HV and then compare it to IV, a sounder judgment of "rich or cheap."

### ⑤ IV Rank, IV Percentile, and mean reversion

"Is IV = 30% high?" — unanswerable without context. For one name, IV usually wanders between 15% and 25%, so 30% is high; for another, IV runs 60% year-round, so 30% is the floor. Hence two standardized metrics:

- **IV Rank** = (current IV − 52-week low) / (52-week high − 52-week low). For example, current IV=22, the past year's low 12 and high 40 give IV Rank = (22−12)/(40−12) ≈ **36%**, meaning "current IV sits at the 36% position of the past year's range," on the low side.
- **IV Percentile** = the fraction of trading days over the past year on which IV was **lower** than today. It's less sensitive to extreme values than IV Rank.

Why do these two metrics work? Because **volatility is mean-reverting**: it clusters (big moves follow big moves — the core of GARCH, Stage 9.3) but doesn't diverge to infinity; after spiking it tends to fall back, after crashing it tends to rise back. This means **selling volatility at high IV Rank and buying volatility at low IV Rank** is a timing framework with statistical backing (selling straddles and iron condors prefers high-IV-Rank environments; buying straddles and calendar spreads prefers low-IV-Rank ones).

Stringing the five pieces together: **HV measures "realized" bumpiness with the standard deviation of past returns × √252; IV measures the market's expectation of the future by solving BS in reverse; because IV normalizes away expiry and strike, it becomes the option's true price scale and common language; IV minus HV reveals rich-or-cheap (but you must net out the variance risk premium, which is the norm); and IV Rank/percentile plus volatility's mean reversion turn "rich or cheap" into actionable timing.** Over the next two lessons we spread IV out along strikes (smile/skew, Stage 4.3), then along expiry (term structure and surface, Stage 4.4).
`,

  demo: "vol-estimator",

  analogy: `
The relationship between historical and implied volatility is like the difference between a **weather record** and a **weather forecast**.

- **Historical volatility (HV) = the actual weather record of the past 30 days.** Objective, certain: how many gales blew and how many downpours fell this month — the data is right there, the same no matter who tallies it. But it **only tells you the past** — about whether the weather will turn tomorrow, it says nothing.
- **Implied volatility (IV) = the weather bureau's forecast for the next 30 days.** It's a "weather expectation" voted on with real money: all traders, weighing earnings, events, and sentiment, collectively judge whether the future will bring "high winds and heavy rain," and that consensus is frozen into the option price — back it out and you get IV.

And the **price of an umbrella** is the option premium. Here's the crucial bit: whether an umbrella is expensive depends not on how much rain fell in the past (HV) but on **how much rain everyone forecasts for the future (IV)**. A severe-storm warning (earnings, an FOMC meeting) makes umbrellas jump in price instantly — even if the sky is clear right now. This is why IV spikes and options get expensive before earnings, and the moment earnings drop and the uncertainty vanishes, IV collapses and options "deflate" (IV crush).

Compare the forecast (IV) against the actual record (HV) and you can judge whether umbrellas are **selling rich or cheap**: if the weather bureau issues a storm warning every day (high IV) and it turns out sunny every day (low HV), then selling umbrellas (selling options) is long-run a good business — exactly the variance risk premium (Stage 8.3).
`,

  misconceptions: [
    "**\"Historical and implied volatility are the same thing, just different algorithms.\"** — No. **HV looks backward** (the volatility the underlying actually realized), **IV looks forward** (the expectation backed out of option prices). Before earnings HV may be very low while IV soars sky-high — the two often diverge.",
    "**\"High IV means this stock is sure to crash.\"** — Not necessarily. High IV only means the market expects **a large move**; the direction could be up or down. That said, in equity markets a spike in IV often accompanies a decline (panic buying of puts), so IV and price are frequently negatively correlated (the VIX is the classic case, Stage 4.5).",
    "**\"IV above HV is a risk-free arbitrage — just sell and collect.\"** — A dangerous misconception. IV running a touch above the subsequently realized HV is the **norm** (the variance risk premium, Stage 8.3); what the seller earns is compensation for bearing the risk of \"a volatility explosion,\" not a free lunch — one black swan can swallow years of accumulated premium.",
    "**\"IV = 30% is high volatility.\"** — Meaningless without context. You have to look at **IV Rank/percentile**: relative to this name's own history, 30% could be a high or a floor. For a growth stock that runs 60% IV year-round, 30% is actually extremely low.",
    "**\"Annualized volatility of 20% means the stock will move about 20% over a year.\"** — Imprecise. 20% is the **annualized standard deviation of returns**: there's roughly a 68% chance the year's move lands within ±20% (a normal approximation), not \"exactly 20%.\" Converted to a daily figure that's about 20%/√252 ≈ 1.26%/day.",
  ],

  quiz: [
    {
      q: "A stock's daily log returns recently have a standard deviation of about 1.0%. What is its **annualized historical volatility** approximately? (√252 ≈ 15.87)",
      options: ["About 1%", "About 16%", "About 25%", "About 252%"],
      answer: 1,
      explain: "Annualized HV = daily standard deviation × √252 = 1.0% × 15.87 ≈ **16%**. Handy benchmark: 16% annualized ≈ 1% per day. Volatility scales with √time, so multiply by √252, not 252.",
    },
    {
      q: "An ATM call's market price today rises from 3.02 to 3.50 (with S, K, expiry, and rate all unchanged). What happens to its **implied volatility**?",
      options: ["Falls", "Rises", "Unchanged", "Cannot tell"],
      answer: 1,
      explain: "The BS price is monotonically increasing in σ, so for the same option a **higher price ⟺ higher implied volatility**. Plugging the market price in to back it out, IV rises from about 25% to about 29%. This is exactly what \"trading options is trading volatility\" looks like.",
    },
    {
      q: "A stock's current IV is 22%, with a 52-week low of 12% and high of 40%. What is its **IV Rank** approximately?",
      options: ["22%", "About 36%", "About 55%", "About 64%"],
      answer: 1,
      explain: "IV Rank = (current − low)/(high − low) = (22−12)/(40−12) = 10/28 ≈ **36%**, sitting in the lower-middle of the past year's range. IV Rank gives \"is IV high\" a relative benchmark.",
    },
    {
      q: "Over the long run, what is the typical relationship between implied volatility (IV) and the historical volatility (HV) that subsequently realizes, and what does it reflect?",
      options: [
        "IV always exactly equals HV; the market is perfectly efficient",
        "IV is systematically a touch higher than HV, reflecting the variance risk premium",
        "IV is always far below HV; sellers lose long-run",
        "The two are completely random and unrelated",
      ],
      answer: 1,
      explain: "IV runs long-run a touch above the subsequently realized HV, and the gap is the **variance risk premium (VRP)** — compensation that option sellers earn for bearing the risk of \"a sudden volatility explosion\" (Stage 8.3). This gives seller strategies a positive long-run expectation, but it is by no means risk-free.",
    },
  ],

  further: [
    { label: "Investopedia: Implied Volatility (IV explained)", url: "https://www.investopedia.com/terms/i/iv.asp" },
    { label: "Investopedia: Historical Volatility (HV)", url: "https://www.investopedia.com/terms/h/historicalvolatility.asp" },
    { label: "tastylive: IV Rank vs IV Percentile", url: "https://www.tastylive.com/concepts-strategies/implied-volatility-rank-percentile" },
  ],
};
