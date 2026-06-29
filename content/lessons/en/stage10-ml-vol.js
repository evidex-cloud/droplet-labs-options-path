export default {
  id: "ml-vol-forecast",
  stage: 10,
  order: 1,
  title: "Machine Learning for Volatility Forecasting",
  difficulty: 3,
  prereqs: ["hist-implied-vol"],

  oneLiner:
    "Direction is almost unpredictable, but **volatility is surprisingly predictable** — because it **clusters**: big moves tend to be followed by big moves (Stage 9.3). In this lesson we treat \"forecast tomorrow's realized volatility\" as a serious machine-learning problem: use past volatility, IV, the VIX, volume, and more as **features**, climb from linear regression up through random forests and LSTMs, then evaluate honestly with **walk-forward validation**. Let's say the conclusion up front: **the edge is real but small** — don't expect it to turn lead into gold; expect it to make your read on whether IV is cheap or rich (Stage 4.2) a little more quantitative.",

  intuition: `
First, admit something that has tripped up countless people: **the direction of a stock price is almost unpredictable.** Whether it rises or falls tomorrow, the best model is only a hair better than a coin flip — that is the consensus of decades of empirical work. Many people therefore assume "quant trading = predicting up or down," then lose enough money to question their life choices.

But there is one quantity that is **clearly more predictable than direction**: **volatility.** Why? Because it obeys an iron statistical regularity — **volatility clustering**: a big up-or-down day today, and tomorrow is often anything but calm; a dead-still day today, and tomorrow most likely stays calm too. The market's "emotional temperature" has inertia (Stage 9.3's GARCH was born precisely for this). **Direction is like a coin flip, but whether things will move violently — yesterday tells you quite a lot about tomorrow.**

For an options person this is fantastic news. Because the essence of options trading is betting on **realized vs. implied volatility** (Stage 8.2): sell options and you bet future realized volatility < current IV; buy options and you bet realized volatility > IV. **Whoever can forecast "realized volatility over the next 30 days" a bit more accurately has one more edge in that wager.** And forecasting volatility happens to be exactly where machine learning can genuinely earn its keep.

A concrete example: a stock's IV today is **25%**, while your model — combining the last 20 days' realized volatility (18%), the VIX's trajectory, volume, and proximity to earnings — forecasts **realized volatility of about 19%** over the coming month. 19% < 25% — the model is telling you: **the price the market is paying for volatility (IV) is on the rich side; the odds favor the seller.** This is not a crystal ball; it is a backtestable, falsifiable judgment that compresses several signals into one number.

But you must set your expectations straight. **This is not a money printer.** Volatility's predictability is "small but real": a good model might shrink the forecast error from the naive method's RMSE of 5.0 down to 4.3 — a 15% improvement doesn't sound like much, but in a game that is already about probabilities, compounded over the long run it is the difference between life and death. The demo on the right lets you see this "small but real" edge with your own eyes.

**In this lesson we break "using ML to forecast volatility" into five pieces:**

- **① Why volatility is predictable and direction is not (volatility clustering)**
- **② Turning it into supervised learning: the label is "future realized volatility," and what the features are**
- **③ The model ladder: linear regression → random forest → LSTM, and what each is good at**
- **④ How to evaluate honestly: walk-forward validation, avoiding data leakage**
- **⑤ How big the edge is and how to use it: feeding the forecast back into the cheap/rich IV judgment (Stages 4.2, 8.2)**
`,

  mechanics: `
### ① Why volatility is predictable and direction is not

**Efficient markets** have wrung the predictability out of direction almost entirely: as long as "it will rise tomorrow" is knowable, people buy it today until it is no longer cheap. So **the return series has almost no autocorrelation** — yesterday's rise tells you nothing about today's.

But **volatility is different.** The size of moves is not "free money" anyone can arbitrage away directly; it reflects the intensity of information flow and uncertainty, and that intensity has **inertia**:

- **Volatility clustering**: |return| or return² shows significant **positive autocorrelation** — big moves cluster together, and so do small ones. One earnings report, one crisis can keep volatility high for days or even weeks.
- **Mean reversion**: volatility returns to a "normal level" over the long run. A VIX that spikes to 60% won't stay there forever and will eventually fall; one slumped at 10% will eventually be roused by some event.
- **Leverage effect / asymmetry**: volatility tends to rise more sharply when a stock falls (panic), and more mildly when it rises.

These three properties are exactly what classic models like **GARCH, HAR, and stochastic volatility (Stage 9.3)** were built to capture. Machine learning isn't meant to replace them but to sit **on top of them**, using more flexible functional forms to absorb more, messier information (volume, term structure, cross-asset signals…).

> One line to set the tone: **we are not forecasting "up or down" but "violent or calm."** The former is nearly random; the latter has structure — which is why volatility forecasting is one of the few battlegrounds in quant where ML genuinely has signal.

### ② Turning it into a supervised learning problem

Machine learning wants paired samples of **(features X → label y)**. We construct them like this:

**Label y (what we want to predict) = realized volatility over a future window (Stage 4.2).** For example, "the annualized standard deviation of daily returns over the next 21 trading days, starting tomorrow." Note this is a **forward-looking** quantity — it uses data after time t, which is exactly why it's worth predicting, and also a hotbed for leakage (see piece ④).

**Features X (information available today)** commonly include:

- **Past realized volatility**: 5-day, 10-day, 21-day, 63-day (multiple windows, matching the HAR model's "day/week/month" three scales). This is usually the **single strongest feature** — because of volatility clustering.
- **Implied volatility and the VIX**: current IV, VIX level and changes. IV is itself the market's forecast of future volatility, so using it as a feature is "standing on the market's shoulders."
- **Volume / turnover**: heavy volume often accompanies volatility.
- **Shape of returns**: recent negative returns (leverage effect), maximum drawdown, gaps.
- **Calendar features**: proximity to an **earnings date**, whether a known event like FOMC/CPI is coming up, day of week, month-end.
- **Cross-asset**: correlated indices, credit spreads, volatility of other sectors.

Organize each trading day into one row of (X, y), and over a few years you have hundreds or thousands of samples — a standard **supervised regression** dataset.

### ③ The model ladder: linear regression → random forest → LSTM

Don't jump straight to deep learning. **First stand up an honest baseline with a simple model**; a complex model only matters if it beats that baseline.

**(a) Linear regression / HAR.** The most naive: future volatility ≈ a + b₁·(5-day vol) + b₂·(21-day vol) + b₃·(63-day vol). This is the famous **HAR-RV** model, simple enough to compute by hand, yet **hard to significantly beat** across a large body of research — which is itself a warning bell. Add IV and the VIX as regressors and you've often already captured most of the available signal.

**(b) Random forest / gradient boosting (tree models).** These automatically capture **nonlinearity** and **feature interactions** (such as the joint effect of "high volume + near earnings"), are robust to outliers, need little tuning, and can report **feature importances**. On tabular financial features, **gradient boosting (XGBoost/LightGBM) is often the best value for money.**

**(c) LSTM / time-series neural networks.** In theory these can learn longer time dependencies and more complex dynamics. But the cost is steep: **they need vast data, overfit very easily, and train unstably.** On a task with as low a signal-to-noise ratio as volatility forecasting, **an LSTM often can't beat a well-tuned gradient boosting model, or even HAR** — a lesson practitioners have re-learned over and over, where papers' "SOTA" routinely shrinks once it meets a real out-of-sample set.

> The golden rule: **complexity must be earned by out-of-sample performance, not granted by default.** In most cases, "good features + tree model" is the sweet spot; treat the LSTM as the last option, not the first.

### ④ How to evaluate honestly: walk-forward + anti-leakage

This is the piece most likely to blow up — and the most valuable — in the whole lesson. Financial data has a **direction in time**, and ordinary random cross-validation cheats.

**(a) Walk-forward validation.** Always **train on the past, predict the future**: train on 2015–2019, test on 2020; then train on 2015–2020, test on 2021… Just like real trading, the model never sees the "future" stretch it has to predict. You must never mix 2022 data into training to predict 2020 — that's time travel.

**(b) Data leakage, the number-one killer:**

- **Label leakage**: the label y is "volatility over the next 21 days," so the sample at day t uses data from t+1…t+21. **If training and test samples overlap in time (this 21-day window straddles the boundary), information leaks.** Fix: leave an **embargo/purge** zone between the training and test segments.
- **Using features knowable only in the future**: e.g., treating data "released only after the close" as a pre-open feature; or standardizing with a mean/std computed on the **whole sample** (standardization statistics may only come from the training segment).
- **Survivorship bias, forward-adjusted prices**: delisted stocks excluded, adjustment factors that only existed in the future.

**(c) The right metrics.** Regression tasks commonly look at **RMSE / MAE** (forecast vol vs. true realized vol) and **R²/QLIKE**. But the final standard is always **out-of-sample** and **economically meaningful**: when this forecast is wired into trading (say, selling high IV on its basis), does it actually make money? A low RMSE alone is not enough (Stage 9.6 is all about backtesting pitfalls).

### ⑤ How big the edge is and how to use it

Let's put the harsh truth first: **the edge from volatility forecasting is "small but real."** Don't believe any "95% accuracy" nonsense — in finance, stably improving out-of-sample RMSE by 10%–20% over the naive baseline is already a quite good model. **It won't turn lead into gold, but it can tilt your bet toward positive expectancy by a little — and compounded over the long run, that little is everything.**

Its most natural use is to **feed back into the core options wager (Stage 8.2)**:

- The model forecasts future realized vol = **19%**, while current IV = **25%**: the market is **charging you 6 extra points** for volatility. This turns the vague feeling that "IV looks kind of high" into a **quantitative seller's signal** — selling straddles, iron condors, or credit spreads carries sweeter odds (always layer on position sizing and tail risk, Stages 8.1, 8.4).
- Conversely, a forecast of **28%** against IV = **22%**: the market is **underpricing** future volatility, and the **buyer** (buying straddles, going long Vega) has the advantage.
- It can also help a market maker **calibrate quotes** and help a hedger **decide how aggressively to dynamically hedge** (Stages 8.2, 10.2).

The more modern play is to embed this forecast in a whole **AI workflow**: the data pipeline pulls automatically, the model updates its forecast daily, the signal flows into a backtest, and you place orders only after manual review (Stages 10.5, 11.5). The model is just one part on the assembly line; **the real moat is data quality, rigorous validation, and the discipline not to be fooled by one pretty backtest.**

Stringing the five pieces together: **volatility is predictable because it "clusters" (direction is nearly not), so we make "forecast future realized volatility" a supervised-learning problem — the label is forward-looking volatility, the features are past volatility/IV/VIX/volume/calendar; the models start from a HAR/linear-regression baseline, climb to tree models, and use LSTM sparingly; we evaluate with walk-forward validation and guard against leakage; and we end up with a small-but-real edge that feeds back into the cheap/rich IV judgment (Stages 4.2, 8.2) as one signal source in an AI trading workflow (Stage 10.5).** In the next lesson, we let a neural network do something more radical — learn to hedge directly (Stage 10.2).
`,

  demo: "ml-vol",

  analogy: `
Forecasting volatility is a lot like **predicting the weather, not predicting a single lottery number.**

- **The lottery number (= the direction of a stock price)**: basically unpredictable. A 7 today tells you nothing about tomorrow's draw — that's the market's direction. Even the cleverest person can only guess blindly.
- **The weather (= volatility)**: far more predictable, because it has **inertia and clusters**. A torrential downpour today, and the odds of clear skies tomorrow are low; a week of clear skies, and tomorrow is probably fine too. The weather service infers tomorrow from "yesterday's and today's state + a pile of observations (pressure, humidity, satellite imagery)" — **exactly what we do when we use past volatility, IV, the VIX, and volume to forecast tomorrow's volatility.**

But don't forget two innate traits of a weather forecast, which volatility forecasting shares exactly:

- **It is probabilistic and will be wrong**: forecasting "80% chance of rain" doesn't mean it will definitely rain. A volatility model can only give an estimate with error bars — **a small-but-real edge, not an oracle.**
- **The further out, the less accurate**: forecasting tomorrow is reliable; forecasting two weeks out is fuzzy. Volatility's predictability also decays quickly with time.

So a smart options person uses volatility forecasts like a smart person uses weather forecasts: **not to bet on a single day's win or loss, but to continuously, probabilistically tilt their bets** — carry an umbrella when you should (lean to the sell side when IV is rich), and over time you get rained on less often.
`,

  misconceptions: [
    "**\"Machine learning can predict whether a stock goes up or down; quant is just predicting direction.\"** — This is the number-one illusion. **Direction is almost unpredictable** (the market arbitrages it away). ML only has real signal in volatility, because volatility **clusters** and has inertia. Moving your effort from \"guessing direction\" to \"estimating volatility\" is the first step from amateur to professional (Stage 8.2).",
    "**\"The more complex and deeper the model, the more accurate the forecast.\"** — Not necessarily. On the very-low-signal task of volatility, **an LSTM often can't beat a well-tuned gradient boosting model, or even simple HAR**. Complexity invites overfitting all too easily. A complex model must significantly beat the simple baseline **out-of-sample** before it deserves adoption.",
    "**\"A low RMSE / high accuracy in the backtest means it'll make money.\"** — Dangerous. A low in-sample error often comes from **data leakage** (overlapping label windows, using future information, whole-sample standardization) or overfitting. You must use **walk-forward validation**, leave an embargo zone, and judge by **out-of-sample economic meaning** (Stage 9.6).",
    "**\"Once the volatility forecast is accurate, you'll make a stable fortune.\"** — The edge is **small but real**. Stably improving out-of-sample error by 10%–20% is already a good model; it only nudges the odds toward positive expectancy a little. Actually making money requires layering on **the right strategy, position sizing, and tail-risk control** (Stages 8.1, 8.4), and guarding against one big move wiping out the accumulated small wins.",
    "**\"IV is already the market's volatility forecast, so forecasting it yourself is pointless.\"** — Exactly the opposite. Precisely because IV is the market's forecast, **comparing your forecast to IV** is where the trading value lies: forecast < IV → volatility is overpriced (lean to the sell side), forecast > IV → underpriced (lean to the buy side). IV is the price your counterparty quotes; your model is your hole card (Stages 4.2, 8.2).",
  ],

  quiz: [
    {
      q: "Why is volatility said to be \"more predictable\" than price direction?",
      options: [
        "Because volatility is always positive, while direction can be positive or negative",
        "Because volatility has structure such as \"clustering\" and mean reversion (big moves are often followed by big moves), while return direction has almost no autocorrelation and is nearly random",
        "Because volatility is given directly by the Black-Scholes formula and needs no forecasting",
        "Because regulators require brokers to publish future volatility",
      ],
      answer: 1,
      explain: "The key is **volatility clustering**: |return|/return² shows significant positive autocorrelation, and volatility has inertia and mean reversion (Stage 9.3). Return direction, by contrast, has almost no autocorrelation — the market arbitrages direction's predictability away. That's why ML has real signal in volatility.",
    },
    {
      q: "When using machine learning to forecast volatility, which of the following is the most typical \"data leakage\"?",
      options: [
        "Using the past 21 days' realized volatility as a feature",
        "Using current IV and the VIX as features",
        "Standardizing features with a mean and standard deviation computed over the entire sample (including the test period), or letting training/test samples' \"future volatility\" label windows overlap in time",
        "Using a random forest instead of linear regression",
      ],
      answer: 2,
      explain: "Leakage = peeking at the future during training. **Standardizing with whole-sample statistics**, or **forward-looking label windows overlapping between training and test**, both leak future information into training and manufacture inflated performance. The fix is to compute statistics only on the training segment and leave an **embargo** zone between training and test, paired with **walk-forward validation**.",
    },
    {
      q: "Your model forecasts a stock's **realized volatility over the next 30 days at about 19%**, while the current option **implied volatility IV = 25%**. With other conditions in place (position sizing and tail risk managed), which leaning does this better support?",
      options: [
        "Buy options / go long Vega, because volatility will rise",
        "Sell options (e.g., sell a straddle/iron condor/credit spread), because the price the market is paying for volatility is rich (IV > forecast realized volatility)",
        "Can't tell; IV and realized volatility are unrelated",
        "Immediately go all-in selling naked, since the model is so accurate",
      ],
      answer: 1,
      explain: "Forecast realized volatility 19% < IV 25% means the market is **charging about 6 extra points** for volatility, with odds favoring the **seller** (Stage 8.2's realized vs. implied wager). But \"all-in naked selling\" is wildly wrong — the edge is small but real, and you must layer on position sizing and tail hedging (Stages 8.1, 8.4).",
    },
    {
      q: "On model selection, which statement best matches this lesson's \"golden rule\"?",
      options: [
        "Always go to the LSTM first; deep learning is always best",
        "First stand up an honest baseline with a simple model like HAR/linear regression, and adopt a complex model only if it significantly beats it out-of-sample",
        "The lower the RMSE, the more it makes money — just pick that one directly",
        "The more parameters a model has, the better, because it fits history more closely",
      ],
      answer: 1,
      explain: "**Complexity must be earned by out-of-sample performance.** Simple HAR is often hard to beat significantly in volatility forecasting; an LSTM overfits very easily on a low-signal task. Stand up the baseline first, then let the complex model prove itself **out-of-sample under walk-forward** — that is the discipline that avoids self-deception (Stage 9.6).",
    },
  ],

  further: [
    { label: "Corsi (2009): the HAR-RV model (a simple, strong baseline for realized volatility)", url: "https://academic.oup.com/jfec/article/7/2/174/856522" },
    { label: "Investopedia: Volatility Clustering", url: "https://www.investopedia.com/terms/v/volatility.asp" },
    { label: "López de Prado: Advances in Financial Machine Learning (walk-forward validation, anti-leakage, purging/embargo)", url: "https://www.wiley.com/en-us/Advances+in+Financial+Machine+Learning-p-9781119482086" },
  ],
};
