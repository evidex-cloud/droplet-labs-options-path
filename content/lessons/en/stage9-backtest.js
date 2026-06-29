export default {
  id: "backtesting",
  stage: 9,
  order: 6,
  title: "Backtesting Options Strategies: The Pitfalls",
  difficulty: 3,
  prereqs: ["monte-carlo"],

  oneLiner:
    "**Backtesting** tests a strategy on historical data, but the pitfalls of options backtesting run far deeper than for stocks: historical options data is scarce and dirty, **look-ahead bias** peeks at the future, ignoring **bid-ask spread/slippage/liquidity** makes costs vanish, missing **assignment and dividends**, and **overfitting/multiple testing** manufactures a \"holy grail\" that doesn't exist. This lesson teaches you to fill these pits one by one and run an **honest** backtest (echoing Stage 11.4).",

  intuition: `
You wrote a strategy selling iron condors (Stage 7.3), ran it over the past decade of historical data, and the backtest curve **climbs steadily, 40% annualized, max drawdown only 5%** — rock-solid. So you excitedly prepare to put real money in. **Wait.** That beautiful curve is, nine times out of ten, a mirage stacked from a pile of **backtest pitfalls**. Go live and it will most likely feed your capital to the market.

**Backtesting** itself is a good thing: testing on historical data "how this strategy would have done in the past" is a required course before going live. But **options backtesting's pitfalls run far deeper than for stocks** — because options as an instrument are inherently dirty and complex:

- **Data is scarce and dirty**: one stock, one price series, clean. But one stock has **hundreds or thousands** of option contracts at once (different strikes × different expiries), each with its own quote, spread, and liquidity, and **the vast majority are severely data-deficient with stale "ghost prices."** High-quality historical options data is extremely expensive and hard to get.
- **Costs are huge yet easily ignored**: options' **bid-ask spreads** are often frighteningly wide (an OTM contract's spread can reach 10%, 20% of the price), and with **slippage and liquidity**, the real transaction cost may eat the strategy's entire profit — while a crude backtest often assumes you can fill at the "mid price" with no cost, erasing this out of thin air.
- **Mechanics are complex**: **early assignment (Stage 9.5)**, **dividends**, expiry handling, margin changes… these headaches that don't exist in stock backtesting can each distort an options backtest.

More deadly still is a class of **cognitive traps**, instrument-independent yet most lethal: **look-ahead bias** (accidentally using information not yet known at the time), **survivorship bias** (testing only the underlyings that survived), and **overfitting / multiple testing** (tuning parameters to perfectly fit history, equivalent to taking an exam with the answers memorized). These pits specifically manufacture "too good to be true" backtests.

This lesson is a **pit-avoidance checklist for options backtesting**: first recognize what each pit looks like and how it inflates returns, then cover how to run an **honest** backtest. The demo on the right gives you an "absurdly good" initial backtest, then lets you tick "include bid-ask spread / include slippage / remove survivorship bias / add transaction costs" one by one — watching that 40% curve get **cut back to reality** stroke by stroke (even cut into the negative).

**In this lesson we break the backtest pitfalls into six pieces:**

- **① The data pit: scarce, dirty, stale quotes, no good historical options data**
- **② Look-ahead bias: peeking at information not yet known at the time**
- **③ The cost pit: bid-ask spread, slippage, liquidity pretended to be zero**
- **④ The mechanics pit: early assignment, dividends, expiry handling**
- **⑤ Overfitting and multiple testing: the \"holy grail\" tuned into existence**
- **⑥ How to backtest honestly + regime change (echoing Stage 11.4)**
`,

  mechanics: `
### ① The data pit: scarce, dirty, stale

The first hurdle of options backtesting comes before you write code — **data**.
- **Dimension explosion**: one underlying has a vast number of contracts at once (each expiry × each strike × call/put). To backtest, you need each contract's **daily** quote, spread, implied volatility, and open interest — orders of magnitude more data than for stocks, and high-quality sources (OptionMetrics, etc.) are extremely expensive.
- **Stale quotes**: many OTM/far-month contracts **don't trade the whole day**, and the "closing price" recorded in the database may be a ghost price from hours ago, even theoretical-price filled. Using it as a fill price in a backtest is trading at a price you **simply can't get**.
- **Gaps and stitching**: contracts vanish at expiry, strikes are newly added as the stock rolls, and the historical series is fragmented. Stitching them into a backtestable continuous series is itself error-prone.

> One line: **the data problem of stock backtesting is "be careful," the data problem of options backtesting is "there may be no usable data at all."** This is the first-principle difficulty distinguishing options backtesting from stock backtesting.

### ② Look-ahead bias

**Look-ahead bias = at some point in the backtest, using information that couldn't possibly be known at that point.** It's the most insidious "cheating," almost always inflating the backtest. Typical forms in options backtesting:
- **Using closing prices for intraday decisions**: a strategy "opens when IV breaks a value" but used the **close-of-day** IV to decide whether to open **intraday that same day** — yet closing data isn't available until after the close.
- **Using the expiry settlement price to back-fit openings**: filtering "good" trades by an outcome only known after the fact.
- **Future data leaking into features**: when computing a day's signal, accidentally using the whole series' mean/std (including the future) to standardize.
- **Earnings/event calendar**: using data revised after the fact rather than the version available in real time at the moment.

The iron rule of correction: **any decision can only use information that is "already closed / already published" at the moment of the decision.** Align data strictly by timestamp, decide on data available at time t and fill at time t+1's tradable price — this is called **point-in-time** correctness.

### ③ The cost pit: spread, slippage, liquidity

This is the place options backtesting **most easily inflates returns**, because options' transaction costs are far fiercer than stocks'.
- **Bid-ask spread**: you buy at the ask and sell at the bid — **you cannot fill at the mid price**. OTM or far-month options' spreads can be as wide as 10%–20% of the price, and a high-frequency open/close strategy can have its profit entirely eaten by the spread alone. A crude backtest defaulting to "fill at the mid price" is equivalent to **handing you half a spread × per trade × countless trades** for free.
- **Slippage**: the actual fill price is a bit worse than what you wanted (detailed in Stage 10.6), caused by spread, impact, and latency. Market orders especially eat slippage.
- **Liquidity / market impact**: a backtest assumes you can buy as much as you want without affecting the price. But **an obscure contract can be blown through with one order**; and when closing, there may be **no counterparty at all**. A "fill" in a backtest of a low-open-interest contract may not happen in reality.
- **Margin and funding cost**: seller strategies tie up margin, financing has a cost, and these are often ignored by backtests too.

The honest approach: **fill at the bid/ask (or even more conservatively), deduct full commission + slippage per trade, and directly exclude or heavily penalize low-liquidity contracts.** In the demo, tick "include bid-ask spread + slippage + transaction costs" and you'll see the CAGR plunge — that's what reality looks like.

### ④ The mechanics pit: assignment, dividends, expiry

Options-specific mechanics, each of which distorts the backtest if missed:
- **Early assignment (Stage 9.5)**: the **American** options you sold may be **exercised early**, especially deep-ITM puts or ITM calls before a dividend. If a backtest assumes "held to expiry before settling," it misses the reality of being thrown off-rhythm by early assignment, forced to take/deliver stock (plus margin shocks).
- **Dividends**: the ex-dividend price drop affects early-exercise decisions and changes put-call parity (Stage 3.2). Miss dividends and both pricing and assignment go wrong.
- **Expiry handling**: ITM options at expiry are **automatically exercised** (even if just a penny ITM), turning you into long/short stock; **pin risk** makes expiries hugging the strike unpredictable. A backtest must specify how each expiring contract is settled.
- **Contract adjustments**: splits and special dividends adjust strikes and multipliers, and if the historical data doesn't handle this correctly, all P&L is wrong.

### ⑤ Overfitting and multiple testing

This is the instrument-independent pit that can most ruin real money.
- **Overfitting**: you keep fine-tuning parameters (open thresholds, take-profit/stop, strike offset…) until the backtest curve is flawless. But what you fit is the **noise in history**, not a repeatable pattern — change the data segment and it fails instantly. The more parameters and the more perfect the curve, the more suspicious.
- **Multiple testing (p-hacking)**: you tried 500 strategy variants and picked the best-performing "discovery." But by pure luck, **among 500 random strategies some always look amazing**. Without correcting for multiple testing, your "discovery" is most likely a statistical illusion.
- **Data snooping**: repeatedly tuning the strategy on the same test set means the test set gets "seen through" by you, losing its testing meaning.

The defense lines: **out-of-sample testing** — keep a data segment that never participates in tuning and validate only once at the end; **walk-forward** rolling tests; **statistical corrections** for multiple testing (stricter significance thresholds, the Deflated Sharpe Ratio); and stick with strategies that have **few parameters and an economic explanation**, not pure curve-fitting.

### ⑥ How to backtest honestly + regime change

Distill the above pit-avoidance measures into a discipline of **honest backtesting** (also the basis of Stage 11.4's hands-on):
- **Data**: use high-quality, point-in-time historical options data; remove stale quotes and illiquid contracts; **include delisted/vanished underlyings** to eliminate **survivorship bias** (testing only the survivors systematically overestimates returns).
- **Costs**: fill at the bid/ask, fully account for commission, slippage, and margin cost; handle low-liquidity contracts conservatively or exclude them.
- **Mechanics**: correctly model early assignment, dividends, expiry auto-exercise, and contract adjustments.
- **Statistics**: strict out-of-sample / walk-forward validation; correct for multiple testing; prefer simple, explainable strategies.
- **Regime change**: this is the deepest philosophical pit of backtesting — **the past doesn't represent the future**. In the low-volatility bull market of the 2010s, naked-selling-volatility (sell straddles, iron condors) backtests look as pretty as a picture; once a **regime switch** like March 2020 or February 2018 (Volmageddon) arrives, these strategies give back years of profit overnight. A strategy that outperforms in a backtest may merely have **bet right on that market regime**. Be sure to test in segments across **different regimes** (bull/bear/high-low volatility/crisis), and keep a reverence for "black swans" (Stage 8.4).

Stringing these six together: **options backtest pitfalls = scarce/dirty/stale data + look-ahead bias + spread/slippage/liquidity treated as zero + missing assignment and dividends + overfitting/multiple testing + regime change; an honest backtest must use point-in-time data, fully account for costs, correctly model options mechanics, validate strictly out-of-sample, and test across regimes.** One line to close: **the default assumption of a backtest should be "it's lying to me," and your job is to repeatedly falsify it** — this skepticism is exactly the watershed from "pretty on paper" to "survivable live" (Stage 11.4 will walk you through actually building a backtest).
`,

  demo: "backtest-pitfalls",

  analogy: `
An options backtest without pit-avoidance is like **an influencer's "before-and-after" weight-loss ad photo** — lighting, filters, sucking in, a specific angle, looking transformed, but the moment you stand casually in natural light, the truth comes out.

That 40%-annualized, near-zero-drawdown backtest curve is the "retouched photo." Each pitfall is a layer of beautification quietly added on:

- **Assuming fills at the mid price (ignoring bid-ask spread)** = the skin-smoothing filter: quietly erasing the "spread tax" every entry and exit pays in reality.
- **Ignoring slippage and liquidity** = perfect lighting: pretending you can fill as much of any obscure contract as you want instantly without affecting the price — in reality you blow through the order book with one order.
- **Backtesting only underlyings that survived to today (survivorship bias)** = photographing only the people who lost weight: the blown-up, delisted, zeroed names are deleted from your sample, no wonder the "average" looks so good.
- **Not counting transaction costs** = holding your breath and sucking in: commissions and margin costs all uncounted, naturally trimming the books.
- **Frantically tuning parameters until the curve is perfect (overfitting)** = finding ten thousand angles and posting only the prettiest: what you fit is history's noise, and it collapses the moment the scene changes.

Peeling off these beautifications **layer by layer** — tick the bid-ask spread, add slippage, remove survivorship bias, count transaction costs — and that stunning photo **collapses** back to bare-faced: 40% becomes 6%, or even becomes a loss. This isn't that backtesting is useless, but a reminder: **the default mindset toward a backtest should be "this photo is definitely retouched," and your task is to turn off the beautifications one by one and see how much remains bare-faced.** A strategy that still looks decent bare-faced is the one worth going live with.
`,

  misconceptions: [
    "**\"The backtest curve is pretty, so the strategy is reliable and ready to go live.\"** — The most dangerous illusion. A pretty options backtest is mostly the product of **stacked pitfalls**: mid-price fills, ignored slippage, survivorship bias, overfitting. The correct mindset is to default to \"it's lying to me,\" and only consider going live if it still holds up after falsifying each item (Stage 11.4).",
    "**\"Just use the closing mid price for fills; the spread doesn't matter much.\"** — Options spreads are often as wide as 10%–20% of the price, and you can only buy at the ask and sell at the bid. Backtesting at the mid price **hands you half a spread for free per trade**, and a high-frequency open/close strategy can have its entire profit eaten by this alone. You must use the bid/ask and count slippage.",
    "**\"Backtesting only with underlyings still trading now is enough.\"** — This is **survivorship bias**: blown-up, delisted, zeroed underlyings are excluded, the sample left with only winners, and returns systematically overestimated. An honest backtest must **include vanished underlyings** to restore the truly investable universe at the time.",
    "**\"The finer the parameter tuning and the more perfect the backtest, the better the strategy.\"** — Backwards. The more parameters and the more perfect the curve, the more likely it's **overfitting** history's noise, failing instantly on a new data segment. Beware **multiple testing** too: try 500 variants and pick the best, and pure luck can manufacture a \"holy grail.\" Defend yourself with **out-of-sample validation** and parameter restraint.",
    "**\"Outperforming over a decade of history proves the strategy is effective long-term.\"** — Not necessarily. It may merely have **bet right on that market regime**. Naked-selling volatility looks as pretty as a picture in a low-volatility bull market, then gives back years of profit upon a Volmageddon (2018) or March 2020. You must test in segments across **different regimes** (bull/bear/crisis) and keep a reverence for black swans (Stage 8.4).",
  ],

  quiz: [
    {
      q: "Which of the following is a typical example of \"look-ahead bias\" in options backtesting?",
      options: [
        "Fills use the bid/ask at the time rather than the mid price",
        "Using the implied volatility known only after the close to decide whether to open a position intraday that same day",
        "Including delisted underlyings in the sample",
        "Assuming larger slippage for low-liquidity contracts",
      ],
      answer: 1,
      explain: "**Look-ahead bias** is using information that couldn't possibly be known at the moment of the decision. Using the **close-of-day** IV for an **intraday same-day** decision is exactly peeking at the future (closing data isn't available until after the close). The fix is **point-in-time** correctness: decide only on data published at the time. The other options are correct pit-avoidance practices.",
    },
    {
      q: "Why does ignoring the bid-ask spread severely overestimate an options strategy's backtest returns?",
      options: [
        "Because options have no bid-ask spread",
        "Because options spreads are often wide (up to 10%–20% of the price), you actually buy at the ask and sell at the bid, and assuming fills at the mid price hands you half a spread for free per trade",
        "Because the spread only affects stocks, not options",
        "Because the spread is automatically offset by commissions",
      ],
      answer: 1,
      explain: "Options (especially OTM/far-month) have **wide spreads**, and a real fill is buy-the-ask, sell-the-bid. If a backtest assumes fills at the **mid price**, it erases half a spread of cost per trade out of thin air, enough to eat the entire profit when trading frequently. You must use the bid/ask and include slippage.",
    },
    {
      q: "What does \"survivorship bias\" refer to in options-strategy backtesting?",
      options: [
        "Backtesting only on high-volatility days",
        "The sample containing only underlyings still trading today, excluding the delisted/blown-up/zeroed ones, thereby systematically overestimating returns",
        "Backtesting only calls and not puts",
        "Using future closing prices",
      ],
      answer: 1,
      explain: "**Survivorship bias** means the sample is left with only the \"surviving\" underlyings, with the delisted, blown-up, and zeroed losers removed, so returns are systematically overestimated. An honest backtest must **include vanished underlyings** to restore the full set actually investable at the time.",
    },
    {
      q: "A volatility-selling strategy (e.g. selling iron condors) performed superbly in a 2012–2017 backtest. What's the soundest judgment about this result?",
      options: [
        "The strategy is proven robust long-term and can be sized up with confidence",
        "It may merely have bet right on that low-volatility bull regime, and needs segmented testing across different regimes (including the 2018 and 2020 crises) and a reverence for black swans",
        "Selling volatility never loses money",
        "The longer the backtest period, the more reliable the conclusion, no other testing needed",
      ],
      answer: 1,
      explain: "This is very likely **regime dependence**: a low-volatility bull market favors naked-selling volatility, but **regime switches** like Volmageddon (2018) and March 2020 make it give back years of profit overnight. You must **test in segments** across bull/bear/crisis and confront tail risk (Stage 8.4), not size up just because one stretch of history looks pretty.",
    },
  ],

  further: [
    { label: "Investopedia: Backtesting", url: "https://www.investopedia.com/terms/b/backtesting.asp" },
    { label: "Investopedia: Survivorship Bias / Look-Ahead Bias", url: "https://www.investopedia.com/terms/s/survivorshipbias.asp" },
    { label: "Bailey & López de Prado: The Deflated Sharpe Ratio (multiple testing and overfitting)", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2460551" },
  ],
};
