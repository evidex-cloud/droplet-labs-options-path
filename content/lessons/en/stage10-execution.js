export default {
  id: "algo-execution",
  stage: 10,
  order: 6,
  title: "Algorithmic Execution: Slippage, Routing & TCA",
  difficulty: 3,
  prereqs: ["rl-market-making"],

  oneLiner:
    "No matter how good the strategy, **poor execution wastes it** — and options' **bid-ask spreads are wide and fragile**, making execution quality an invisible life-or-death line. This lesson lays out how **slippage and market impact** eat your alpha, how **order types and smart routing** save money, how **TWAP/VWAP/implementation shortfall** break up large orders, how **multi-leg spreads fill as a whole (the risk of legging)**, and how to use **transaction cost analysis (TCA)** to quantify \"how much you actually lost to execution.\" For retail, the most practical line is often: **don't use market orders to cross a wide spread — use limit orders to fill patiently near the mid.**",

  intuition: `
Imagine you backtest a beautiful strategy: 18% annualized, Sharpe 1.4. You go live full of confidence, and half a year later find your **actual return is only single digits.** Where did the money go? Most likely the strategy isn't wrong — **execution leaked.** On every entry and exit, you quietly bled in the **bid-ask spread** and **slippage**, and over hundreds of trades, the alpha was ground flat. **The number-one culprit of "rich on paper, gaunt in reality" is often execution cost (Stage 9.6's backtest pits called this out specifically).**

Why are options especially treacherous? Because **options' bid-ask spreads are wide and fragile (Stage 2.5):**

- An active stock's spread might be just 1 cent; but for an option, **bid 1.20 / ask 1.50** is routine — a spread of 0.30, **22%** of the mid (1.35)!
- If you **use a market order** to buy, you pay the ask 1.50 directly; to sell, you take the bid 1.20 directly. **Round trip, you pay 0.30 × 100 = $30/contract in spread alone** — before you even count whether you made money.
- For an illiquid option, the book is thin too, so **even a slightly larger order pushes the price away (market impact)**, and you fill worse than the displayed price — that's **slippage**: the difference between the price you wanted (the intended price) and the price you actually filled at.

Worse still are **multi-leg strategies** (spreads, iron condors, straddles): you have to fill 2 or 4 legs at once, **and each leg has its own spread.** If you place them one at a time (called **legging**), you not only pay N spreads but also take **leg risk** — the first leg fills, the market moves, the second leg's price runs away, and you're stuck in an incomplete, directionally exposed position.

So execution isn't as simple as "click buy"; it's a **craft**, with the goal: **build the position you want at the lowest possible cost, smallest possible impact, and smallest possible leg risk.** The modern toolbox includes:

- **Smartly choosing the order type**: limit vs. market order, a whole-spread order (fill all legs at once).
- **Smart order routing**: find the best price across multiple exchanges/market makers.
- **Breaking up large orders**: use **TWAP/VWAP/implementation shortfall** (laid out in Stage 10.3) to spread a large order out and reduce impact.
- **Quantifying after the fact**: use **transaction cost analysis (TCA)** to compute "relative to some benchmark, how well or poorly was this trade executed, and how much was lost."

A concrete scenario closest to retail: you want to buy a vertical spread, theoretical mid (the difference of the two legs' mids) is **1.35**. If you go market and take the ask on each leg, you might fill at **1.55** — 0.20 above the mid (×100 = $20/contract). But if you place a **whole-spread limit order at 1.38** and wait patiently for a market maker to fill it, you might save most of the spread. **The cost is: it may not fill, or you may have to wait.** That's the core trade-off of execution — **the certainty of an immediate fill vs. the patience for a better price.** The demo on the right lets you compare the cost difference of "cross immediately vs. patient limit vs. theoretical mid" yourself.

**In this lesson we break algorithmic execution into five pieces:**

- **① Anatomy of execution cost: spread, slippage, market impact**
- **② Order types and smart routing: how not to hand money to the spread**
- **③ Breaking up large orders: TWAP / VWAP / implementation shortfall**
- **④ Whole-fill of multi-leg spreads and legging risk**
- **⑤ Transaction cost analysis (TCA): quantifying your execution quality**
`,

  mechanics: `
### ① Anatomy of execution cost

Break "where exactly execution gets expensive" into three parts, seen clearly one by one:

- **Bid-ask spread**: the difference between bid and ask, the most direct cost. **Crossing the spread (filling immediately with a market order) = actively paying half to one full spread.** The theoretical "fair value" is often taken as the **mid = (bid+ask)/2**; you buy at the ask and sell at the bid, losing **half a spread** relative to the mid each way. Options' spreads are wide, so this item is heavy.
- **Slippage**: the difference between the price you **intended** and the price you **actually filled** at. Sources: the price moving the instant you place the order, insufficient book depth, latency. Market orders are especially exposed to slippage.
- **Market impact**: the part where **your own order** pushes the price away. The larger the order relative to book depth, the fiercer the impact (Stage 10.3's optimal execution exists precisely to suppress it). Options books are thin, so impact comes fast.

$$implementation shortfall ≈ spread cost + slippage + market impact + (timing drift)

This is the file that grinds a strategy's "paper return" into its "live return." **The entire goal of execution is to dull this file.**

### ② Order types and smart routing

The tools most worth using well in the toolbox:

- **Limit order vs. market order:**
  - **Market order**: guarantees a fill, not a price — crosses the spread directly, taking the ask or hitting the bid. **Fast, but expensive.** Using market orders on wide-spread options is retail's most common, most money-burning mistake.
  - **Limit order**: guarantees a price (no worse than you set), not a fill. **Place buy orders between the bid and the mid, sell orders between the ask and the mid**, and you can often fill near the mid, saving most of the spread. **The cost is it may not fill, or you may have to wait.**
  - Practical advice: **default to limit orders, start quoting near the mid, and concede a little at a time as needed** — rather than mindless market orders.
- **Smart order routing (SOR)**: options are listed on multiple exchanges, and the bid/ask of the same contract may differ across venues. A broker's SOR will **automatically route your order to the venue with the best quote at the time** and may participate in **price-improvement** auctions, helping you get a price better than the displayed NBBO. For retail this is mostly "done automatically in the broker's back end," but **choosing a broker with good execution quality** (look at its price-improvement statistics) is something concrete you can do (Stage 11.1).
- **Special order types**: peg (floating, pegged to mid/bid/ask), hidden orders, whole-spread orders (piece ④ below).

### ③ Breaking up large orders: TWAP / VWAP / implementation shortfall

When an order is **large relative to liquidity**, placing it all at once causes large impact (Stage 10.3). **Breaking it into small orders over time** is the standard means of reducing impact. Three classic algorithms (also TCA's benchmarks):

- **TWAP (time-weighted average price)**: spread the order **evenly** over a span of time, sending equal amounts each slice. Simple, robust, aiming to track the **average price** over that span. Suited to stable liquidity and not wanting to reveal intent.
- **VWAP (volume-weighted average price)**: allocate by the market's **volume rhythm** — send more when volume is high, less when low — striving for an average fill close to the market **VWAP.** The benchmark institutions use most; the benefit is "going with the flow," small impact.
- **Implementation shortfall (IS)**: optimize directly against the difference between **"the price at decision time" vs. "the final actual average fill price"** (Almgren-Chriss's true colors, Stage 10.3), dynamically trading off **impact vs. timing risk** — send more when urgent, less when relaxed.

> A realistic reminder for retail: your option orders are usually **not large**, and you may not need a slicing algorithm like TWAP/VWAP — your number-one enemy isn't impact but **the wide spread itself.** So **"don't use market orders, use limit orders to fill patiently near the mid"** is usually far more valuable to you than fancy slicing algorithms. Slicing is the main battlefield of large capital.

### ④ Whole-fill of multi-leg spreads and legging risk

This is a piece unique to — and extremely important for — options execution. There are two ways to build a **multi-leg structure** (vertical spread, iron condor, straddle):

- **Legging in**: fill leg by leg separately.
  - **Risk one: paying multiple spreads.** Each leg crosses a spread once; a 4-leg iron condor is 4 spreads, costs stacked.
  - **Risk two: leg risk.** After the first leg fills and before you place the second, **the market moves and the second leg's price runs away** — you either fill it at a worse price or get stuck in an **incomplete, directionally naked** position (you meant to be neutral, but you're temporarily naked long/short one leg). This risk is especially fierce when volatility is high.
  - The only upside: occasionally you can **time** each leg to fill better (an expert's game, at your own risk).
- **Whole-spread (spread / combo) order**: treat the entire multi-leg structure as **one order**, place a limit on the **net price** (the net debit/credit of all legs), and let the exchange's **complex order book** match it — **either all legs fill together, or none do.**
  - **Benefits**: eliminates leg risk (atomic fill), negotiates on **one net price**, and often fills at a better net price than "taking each leg's spread" (market makers will quote tighter for the whole structure).
  - **This is the recommended way for retail to build spreads**: use the broker's "spread/combo order" function, placing a limit on the net price (e.g., net debit 1.38), rather than manually legging one by one.

> One line: **build multi-leg structures with a 'whole-spread limit order' on the net price whenever possible — don't manually leg in — saving spread and avoiding leg risk.** Timing each leg is an advanced and dangerous maneuver.

### ⑤ Transaction cost analysis (TCA)

How do you know whether you executed well? Through **TCA (transaction cost analysis)** — **quantifying each trade's execution quality after the fact**, turning "feeling" into numbers. The core is to pick a **benchmark price** and compare how far your actual fill deviated from it:

- **Common benchmarks:**
  - **Arrival / decision price**: the mid at the moment you decided to order. **Actual fill − arrival price = implementation shortfall**, closest to "how much more execution cost me than the ideal."
  - **Mid**: the fill's deviation from the bid/ask midpoint, intuitively measuring "how much spread you crossed."
  - **VWAP**: your average fill vs. the market VWAP over that span, showing whether you beat or lagged the market's rhythm.
- **What TCA tells you**: which orders had excessive slippage, which time slots had high cost, the cost difference of market vs. limit orders, and exactly how much a broker's price improvement is worth. **It turns execution from mysticism into optimizable engineering** — only once quantified can you improve.
- **Retail should do lightweight TCA too**: even just recording "what the mid was when I placed the order, what it finally filled at," tracking your **average slippage** over time, and you'll be surprised by the hidden cost of market orders — cultivating the discipline of using limit orders.

> Wire execution back to the big picture: **alpha is earned, but execution cost is leaked — TCA is the gauge for plugging the leak.** A consistently profitable options trader is often not someone with a magical strategy but someone who **executes cleanly**: uses limit orders, uses whole-spread orders, avoids wide spreads and illiquid contracts, and uses TCA to continuously monitor how much they leak.

Stringing the five pieces together: **execution quality is an invisible life-or-death line, made especially critical by options' wide spreads; cost = spread + slippage + impact; the countermeasure is 'don't use market orders, use limit orders to fill patiently near the mid' + smart routing + choosing a broker with good execution; break up large orders with TWAP/VWAP/implementation shortfall (but retail fears wide spreads more than impact); build multi-leg structures with whole-spread limit orders on the net price to avoid legging risk; and finally use TCA to quantify execution quality and continuously plug leaks.** With this, Stage 10 "Options in the AI Era" is complete: from using ML to forecast volatility (10.1), deep hedging (10.2), RL market making and execution (10.3), alt-data/NLP signals (10.4), LLM/agent workflows (10.5), to this lesson's algorithmic execution and TCA — in the next stage, we bring all of it down to real accounts and code (Stage 11).
`,

  demo: "execution-sim",

  analogy: `
Options' execution cost is like **changing money at a currency-exchange booth with a very wide spread.**

The airport exchange counter brazenly displays two prices (≈ an option's bid/ask): **"We sell USD at 1.50, buy USD at 1.20."** The true fair rate in the middle (≈ the mid) is about 1.35.

- **You're in a hurry and exchange right at the counter (≈ a market order crossing the spread)**: buying USD costs 1.50, and changing back later is at 1.20. **Round trip, the counter takes 0.30 of spread on every unit** — fast and certain, but **expensive.** This is exactly the cost of using a market order to cross an option's wide spread.
- **You're not in a hurry, haggle with the clerk, and place an order at 1.38 to wait (≈ a limit order near the mid)**: you'll likely fill at a good price close to 1.35, **saving most of the spread.** The cost is: **you may have to wait, or even not exchange at all** (if the rate doesn't come to your price). That's the trade-off of a patient limit — **trading certainty for a better price.**

And a **multi-leg spread** is like needing to **exchange three currencies at once** (≈ three legs). Two ways:

- **Exchange each at a separate counter (≈ legging)**: pay three spreads, and worse — you just finished the first, **all the rates change**, the prices of the second and third run away, and you're stuck half-exchanged, exposed to currency risk (≈ leg risk).
- **Find one counter that exchanges all three at a single packaged net price (≈ a whole-spread order)**: negotiate on **one total price**, all-or-nothing, clean, and often at a better package rate than exchanging separately.

> One line: crossing the spread is like a rushed exchange at the airport counter (fast but expensive), a limit order is like patient haggling (saves money but waits), and multi-leg must "exchange the whole package at once" (≈ a whole-spread order) — don't get stranded mid-exchange by the rates. Finally, **keep the books on how much the counter took each time (≈ TCA)**, and you'll genuinely switch to the cheaper method.
`,

  misconceptions: [
    "**\"A good strategy is all that matters; execution is irrelevant, and market orders are easiest.\"** — Execution is often the number-one culprit of 'rich on paper, gaunt in reality.' Options' **spreads are wide and fragile**, and market-order crossing, slippage, and impact accumulated over hundreds of trades can grind the alpha flat. **Using limit orders to fill patiently near the mid** is the discipline retail should most cultivate (Stage 9.6).",
    "**\"Market and limit orders are about the same — they both fill anyway.\"** — They differ a lot. A market order **guarantees a fill, not a price** (crosses directly, most expensive); a limit order **guarantees a price, not a fill** (can save most of the spread near the mid, at the cost of waiting or not filling). On wide-spread options, this difference is real money.",
    "**\"To build a multi-leg spread, just place each leg separately.\"** — Legging has two big risks: **paying multiple spreads** + **leg risk** (after one leg fills the market moves, the other runs away, and you're stuck in a naked position). Use a **whole-spread/combo limit order** on the **net price** for an atomic fill — all or nothing — saving spread and avoiding leg risk.",
    "**\"The theoretical mid is the price I can fill at.\"** — The mid is just the midpoint of bid/ask, a reference fair value; it **doesn't guarantee a fill there.** Buying you usually have to go slightly above the mid, selling slightly below, before someone takes it. The mid is the **TCA benchmark**, used to measure 'how much spread you crossed,' not a promised fill price.",
    "**\"TWAP/VWAP slicing algorithms are a must for retail too.\"** — Slicing algorithms exist to **suppress the market impact of large orders**, with large capital as the main battlefield. Retail orders are usually not large, and the **number-one enemy is the wide spread itself**, not impact — getting 'use limit orders, use whole-spread orders, avoid illiquid contracts' right is far more valuable than applying fancy slicing algorithms (Stage 10.3).",
  ],

  quiz: [
    {
      q: "An option is bid 1.20 / ask 1.50. If you buy with a **market order** and later sell with a market order (ignoring price moves), how much does the **bid-ask spread** alone cost you per contract?",
      options: ["$0 (filled at the mid)", "About $15", "About $30", "About $150"],
      answer: 2,
      explain: "Buying takes the ask 1.50, selling hits the bid 1.20, a spread of 0.30/share. The round trip pays the whole spread: 0.30 × 100 = **$30/contract.** This is the direct cost of a market order crossing a wide spread — filling near the mid (1.35) with a limit order saves most of it.",
    },
    {
      q: "Regarding market orders and limit orders, which statement is correct?",
      options: [
        "A market order guarantees a price but not a fill; a limit order is the reverse",
        "A market order guarantees a fill but not a price (crosses the spread, most expensive); a limit order guarantees the price won't exceed your setting but not a fill (can save spread near the mid, at the cost of waiting or not filling)",
        "They are completely equivalent, just named differently",
        "A limit order always fills faster than a market order",
      ],
      answer: 1,
      explain: "**Market order** = guarantees a fill, not a price (crosses the spread directly, most expensive); **limit order** = guarantees the price (no worse than you set), not a fill. On wide-spread options, defaulting to a limit order, quoting from near the mid and conceding as needed, is the key discipline for saving money.",
    },
    {
      q: "You want to build a **four-leg iron condor**. Why is a \"whole-spread/combo order (on the net price)\" recommended over legging in?",
      options: [
        "Legging always costs higher commissions, with no other reason",
        "The whole order fills atomically at one net price (all or nothing), eliminating 'leg risk,' negotiating on one net price, and often getting a better net price; legging pays multiple spreads and may strand you in an incomplete, naked position",
        "A whole order guarantees a profit",
        "Legging is prohibited by the exchange",
      ],
      answer: 1,
      explain: "Legging has two big risks: **paying multiple spreads** + **leg risk** (after one leg fills the market moves, the other's price runs away, and you're stuck in a half-built, directionally naked position). A **whole-spread order** fills **atomically** on the net price — all legs together or none — saving spread and eliminating leg risk, the recommended way to build multi-leg structures.",
    },
    {
      q: "In transaction cost analysis (TCA), using the \"arrival/decision price (the mid at the moment you decide to order)\" as the benchmark mainly measures what?",
      options: [
        "The level of an option's implied volatility",
        "Implementation shortfall — how much more your actual fill cost than the 'ideal price at decision time,' i.e., how much execution ground off the paper return",
        "The dividend yield of the underlying",
        "Changes in the risk-free rate",
      ],
      answer: 1,
      explain: "With the **arrival price (the mid at decision time)** as the benchmark, 'actual fill − arrival price' is the **implementation shortfall**, closest to 'how much more execution cost me than the ideal' (including spread, slippage, impact, timing drift). TCA quantifies execution quality into numbers, so you can find the leaks and keep improving (plugging the file that grinds backtest return into live return).",
    },
  ],

  further: [
    { label: "Investopedia: Slippage", url: "https://www.investopedia.com/terms/s/slippage.asp" },
    { label: "Investopedia: VWAP / Implementation Shortfall (execution benchmarks)", url: "https://www.investopedia.com/terms/i/implementation-shortfall.asp" },
    { label: "OIC / broker docs: spread / combo orders for multi-leg options", url: "https://www.optionseducation.org/" },
  ],
};
