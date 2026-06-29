export default {
  id: "position-sizing",
  stage: 8,
  order: 1,
  title: "Position Sizing & the Kelly Criterion",
  difficulty: 2,
  prereqs: ["greeks-overview"],

  oneLiner:
    "**How much you bet matters more than what you bet on.** What decides your long-run fate isn't \"picking right,\" it's \"sizing right\" — bet too big and even a real edge gets wiped out by a bad streak (**risk of ruin**). This lesson hands you two rulers: the theoretical ceiling — the **Kelly criterion** (f = p − q/b) — and what you should actually use in practice — **fractional Kelly** plus the hard rule of **risking only 1–2% per trade**.",

  intuition: `
Start with an experiment that will overturn your intuition. Suppose you have a strategy with a **genuine edge**: each trade wins with 55% probability, and a win pays the same as a loss (1:1 odds). This is a positive-expectancy system that makes money over the long run. Only one question remains — **what percentage of your capital do you bet each time?**

Intuition says "the bigger the edge, the more you bet." Let's run 100 trades through the engine for real (same win/loss sequence, only the bet fraction changes):

- Betting **2.5%** per trade: after 100 trades, capital ×**1.25** (+25%)
- Betting **5%** per trade: ×**1.45**
- Betting **10%** per trade: ×**1.65** (the fastest growth in this sequence)
- Betting **20%** per trade: ×**0.99** — **a loss, not a gain**!
- Betting **30%** per trade: ×**0.20** — **down 80%, nearly annihilated**

See it? **The same strategy with a real edge, the same run of luck — bet too heavily and you blow up the account.** Not because the edge disappeared, but because losses are **multiplicative**: a 50% loss needs a 100% gain to recover, and a few losses in a row drop you into a pit you can never climb out of. This is **risk of ruin** — even with positive long-run expectancy, oversized positions can kill you in some bad streak before "the long run" ever arrives.

> One line that pops the beginner's illusion: **"betting the right direction" only determines whether you have an edge; "betting the right size" determines whether that edge ends up as wealth or zero.** Professional traders spend 80% of their energy on the latter.

So how much should you bet? There's a mathematically optimal answer — the **Kelly criterion**: it tells you the bet fraction that "maximizes long-run capital growth given a known edge and odds." But Kelly gives a **theoretical ceiling**, and using it in full makes the account ride a brutal rollercoaster of drawdowns, so professionals overwhelmingly use only a fraction of it (**fractional Kelly**), layered on top of a more down-to-earth guardrail: **never let a single trade lose more than 1–2% of the account**. Options are naturally suited to this rule, because **the buyer's maximum loss = the premium** and a spread's max loss is locked in — these are **defined-risk** bets.

**In this lesson we break position sizing into five pieces:**

- **① Risk of ruin: why multiplicative losses can zero out even a positive-expectancy system**
- **② The Kelly criterion f = p − q/b: the bet fraction that maximizes long-run growth**
- **③ Why you can't use full Kelly → fractional Kelly (half / quarter)**
- **④ The hard 1–2%-per-trade rule: working backward from "account" to "contracts"**
- **⑤ Defined-risk option bets: nailing down the maximum loss**
`,

  mechanics: `
### ① Risk of ruin: the multiplicative-loss trap

Capital **compounds multiplicatively**, not additively. Consecutive gains and losses multiply, and a loss damages the product asymmetrically:

$$Recovering from a 10% loss needs +11.1%
$$Recovering from a 50% loss needs +100%
$$Recovering from a 90% loss needs +900%

So even if every trade has **positive expectancy**, a single bet that's big enough means a run of normal, ordinary losses can drive your capital into an "unrecoverable" abyss. **Risk of ruin = the probability of losing all your capital before the long-run expectancy ever pays off.** It rises sharply with the bet fraction — exactly the root of the "bet 30% and get annihilated" line from the intuition section.

This gives risk management its first principle: **survive first, then grow.** The primary job of any sizing rule is not to maximize return but to push the probability of ruin down toward zero.

### ② The Kelly criterion: the growth-optimal bet fraction

The Kelly criterion answers "how much should you bet to **maximize long-run logarithmic growth**." For a bet with "win probability p, loss probability q = 1−p, odds b (a win earns b times your stake, a loss loses 1 times your stake)":

$$f* = p − q / b = p − (1 − p) / b

- f* is the **fraction of capital to bet**. p is the win rate, b is the **win/loss ratio** (average win ÷ average loss).
- Intuitive reading: **f* = your edge ÷ the odds**. The bigger the edge and the more favorable the odds, the more you should bet; once f* ≤ 0, it means **you have no edge, and the correct size is 0** (don't bet).

Plug in two cases (computed by the engine):

- **p=55%, b=1 (1:1)**: f* = 0.55 − 0.45/1 = **0.10**, i.e. bet 10%.
- **p=55%, b=2 (win/loss ratio 2:1)**: f* = 0.55 − 0.45/2 = **0.325**, better odds, so you can bet up to 32.5%.

Kelly's allure: **over the long run, no fixed fraction grows faster than full Kelly.** But its cost is the subject of the next piece.

### ③ Why not full Kelly: fractional Kelly

Full Kelly grows the fastest mathematically, but it has three realities people can't stomach:

- **Enormous drawdowns**: a typical full-Kelly path goes through drawdowns of **50%+**. In the intuition section, the line betting the full 10% has the highest terminal value, but it rode a terrifying rollercoaster along the way. Almost no one can psychologically endure it.
- **Parameter estimation error**: the p and b in the formula are **estimates**, and the true values are often worse. And Kelly is **extremely sensitive to overestimating your edge** — once you've overstated p, full Kelly becomes **overbetting**, sliding straight into the "bet 20%, 30% and lose it all" territory from the intuition section.
- **Diminishing marginal return**: dropping from full Kelly to **half Kelly** costs only about **25%** of the long-run growth rate, but **roughly halves the drawdown** and sharply lowers volatility. That's an extremely favorable trade.

So professional practice is nearly unanimous: **use fractional Kelly.** The common choices are **half Kelly (½ f*)** or the more conservative **quarter Kelly (¼ f*)**. It sacrifices a little theoretical speed for a **survivable, sustainable** smooth curve — and whether you can stick with it is precisely what determines real returns.

> In options, p and b are especially hard to estimate (the payoff distribution is highly asymmetric, and the seller still has fat tails), so **options traders typically use a smaller Kelly fraction than for stocks**, often degenerating to the fixed-percentage rule in the next piece.

### ④ Risking 1–2% per trade: working backward from the account to contracts

More down-to-earth than Kelly, and more commonly used by professional retail traders, is the **fixed-fractional risk rule**:

> **On any single trade, the worst-case loss must not exceed 1%–2% of the total account.**

Its advantage is that it doesn't depend on your estimates of p and b — you only need to know **this trade's maximum loss** (which is often known for options, see piece ⑤). The math is simple — **divide the "loss you can tolerate" by the "max loss per contract"** to get the number of contracts:

$$Loss budget per trade = account × risk%
$$Contracts = loss budget per trade ÷ (max loss per contract)

Here's a complete numeric example. Account of **$50,000**, with a rule of risking **1%** per trade (= $500):

- You want to buy a call with a premium of **2.50** (max loss = premium = 2.50 × 100 = **$250/contract**).
- Contracts = 500 ÷ 250 = **2 contracts**. A total loss is still only $500 = 1% of the account. ✓
- If instead you buy a premium of **6.00** (max loss $600/contract), 500 ÷ 600 < 1 → **you can't even afford 1 contract**, so either pick a cheaper structure or pass.

The power of this rule: **it lets you lose many times in a row and still survive.** Losing only 1% per trade, even 10 losses in a row leaves the account at about 90%, keeping you at the table forever — and staying at the table is precisely the precondition for positive expectancy to eventually pay off.

### ⑤ Defined risk: nailing down the maximum loss

A sizing rule can only be computed if **the maximum loss is known**. This is exactly the key advantage of options over naked stock and over naked selling — many option structures are **defined-risk**:

- **Buyer (long call/put, long spread)**: max loss = **the net premium paid**, fixed and computable in advance (Stage 1.2, Stage 6.5). Sizing plugs straight into the formula from piece ④.
- **Debit spreads, iron condors, butterflies**: max loss = spread width − premium received, **capped**. You can precisely back out the number of contracts.
- **Naked option selling**: max loss is **huge or even unlimited** (a naked call has no theoretical ceiling). For these **undefined-risk** bets, the single-trade 1% rule is hard to apply directly — you must limit size by **margin** and **potential loss under extreme scenarios**, not by the premium. Many accounts blow up precisely because they used the wrong ruler on naked-selling positions (Stage 8.4, Stage 8.6).

Stringing the five together: **capital is multiplicative, and oversized positions can ruin even a positive-expectancy system (risk of ruin); the Kelly criterion f = p − q/b gives the growth-optimal bet fraction, but full Kelly has too-large drawdowns and is extremely sensitive to overestimated edge, so in practice use fractional Kelly (half/quarter); more down-to-earth and reliable is the fixed-fractional rule of risking only 1–2% of the account per trade, sizing contracts backward from the max loss; and all of this rests on using defined-risk structures like buyers and spreads to nail down the maximum loss.** Once sizing is set, the next step is dynamically managing the directional risk of existing positions — that's delta hedging (Stage 8.2).
`,

  demo: "kelly-sizing",

  analogy: `
Position sizing is like **the card counter at the casino**.

The reason card counters in the movies win steadily was never "betting everything every hand." Their real skill has two layers: first, **bet only when the deck is in their favor** (act only with an edge, corresponding to f* > 0); and second, more crucially — **bet a bit more when the edge is large, a bit less when it's small, but never go all-in on a single hand.**

Why not go all-in? Because they know one thing: **even when the long-run odds are on my side, luck will hand me a few bad hands in a row.** If they bet their entire stake on one hand and step on a mine, they're escorted out of the casino, and there's no "long run" anymore. So they keep each bet to a small slice of total capital — that way even ten losses in a row are just a scratch, they stay at the table, and that faint edge slowly compounds into wealth over thousands of hands.

The options trader does exactly the same: **first confirm the trade genuinely has an edge (don't force a bet with no edge), then bet a small slice of capital, holding the worst single-trade outcome firmly within "just a scratch."** The only difference is that an option's "worst outcome" is often known (for the buyer, it's just that premium) — giving you one extra layer of certainty the card counter doesn't have. Those who know how to size survive, and those who survive laugh last.
`,

  misconceptions: [
    "**\"I see it clearly, so I should bet big.\"** — Seeing it clearly only determines whether you **have an edge**; how much you bet determines whether the edge becomes wealth or zero. The same 55%-win-rate positive-expectancy system grows long-term at 10% but is annihilated in a few hands at 30%. **Bet size and directional judgment are two independent things**, and the former is often more lethal.",
    "**\"The Kelly criterion gives the position to bet, so bet it in full for the optimum.\"** — Full Kelly grows fastest only under the ideal of \"p and b known exactly\"; in reality you can only **estimate** p and b, and Kelly is extremely sensitive to **overestimating the edge**, so betting in full easily becomes overbetting. Add 50%+ drawdowns that almost no one can endure, and professionals overwhelmingly use **half Kelly or quarter Kelly**.",
    "**\"Risking 1% per trade is too conservative, the returns are too slow.\"** — The point of this rule isn't speed, it's **letting you lose many times in a row and still survive**: losing only 1% per trade, even 10 losses in a row leaves about 90%. Positive expectancy only pays off if you \"stay in the game,\" and **a single ruin zeroes you out**. Slow is the price of not dying.",
    "**\"Position sizing is a stock thing; options have leverage built in, no need to manage it.\"** — Quite the opposite: options have higher leverage and go to zero faster, so they **need** strict size limits even more. The good news is that buyers and spreads are **defined-risk**, with max loss computable in advance, making contract sizing straightforward; the bad news is that **naked selling** has undefined risk and must be sized separately by margin and extreme scenarios (Stage 8.4).",
    "**\"The win/loss ratio (b) doesn't matter, a high win rate is enough.\"** — Wrong. In Kelly, **f* = p − (1−p)/b**, and b enters the formula directly. With a 2:1 win/loss ratio, a 55% win rate lets you bet 32.5%, but if the ratio drops to 1:1, the same win rate only supports 10%. **Win rate and win/loss ratio jointly determine the edge** — neither is dispensable, and many \"high win rate\" seller strategies die precisely from a terrible win/loss ratio (picking up pennies vs being run over by a truck, Stage 8.3).",
  ],

  quiz: [
    {
      q: "A strategy has a win rate p=60% and a win/loss ratio b=1 (wins and losses are equal in size). By the Kelly criterion, the theoretically optimal bet fraction f* is about what?",
      options: ["10%", "20%", "40%", "60%"],
      answer: 1,
      explain: "f* = p − (1−p)/b = 0.60 − 0.40/1 = **0.20 = 20%**. Note this is the **full-Kelly** theoretical ceiling; in practice you'd typically use only half of it (half Kelly, 10%) to dampen drawdowns.",
    },
    {
      q: "Your account is $100,000, with a rule of risking at most 1% (worst-case loss) per trade. You want to buy a call whose max loss is $400/contract (premium 4.00 × 100). How many contracts can you buy at most?",
      options: ["1 contract", "2 contracts", "2.5 contracts", "4 contracts"],
      answer: 1,
      explain: "Loss budget per trade = $100,000 × 1% = $1,000; contracts = 1,000 ÷ 400 = 2.5 → round down to **2 contracts** (worst-case loss $800 < $1,000). Buying 3 would risk $1,200, exceeding the 1% cap. Always **round position size down**.",
    },
    {
      q: "Regarding \"risk of ruin,\" which statement is most accurate?",
      options: [
        "As long as the strategy has positive long-run expectancy, ruin is impossible",
        "Even with positive expectancy, an oversized single position can lose all your capital before the long-run expectancy pays off",
        "Risk of ruin depends only on the win rate, not on bet size",
        "Using full Kelly reduces risk of ruin to 0",
      ],
      answer: 1,
      explain: "Capital is **multiplicative** and losses are asymmetric (a 50% loss needs a 100% gain to recover). Even with positive expectancy, **betting too big on a single trade** lets a normal run of losses drive capital to an unrecoverable level — that's risk of ruin. It rises sharply with the bet fraction, and full Kelly doesn't eliminate it, it pushes it higher.",
    },
    {
      q: "Why do professional traders generally use \"fractional Kelly\" (such as half Kelly) instead of full Kelly?",
      options: [
        "Because fractional Kelly grows faster long-term",
        "Because full Kelly has enormous drawdowns (often 50%+) and is extremely sensitive to overestimated edge, while half Kelly loses only about 25% of the growth rate yet roughly halves the drawdown",
        "Because fractional Kelly doesn't require knowing the win rate",
        "Because regulators ban full Kelly",
      ],
      answer: 1,
      explain: "Full Kelly grows fastest mathematically, but at the cost of **50%+ drawdowns** and high sensitivity to parameter error (overestimate p and it becomes overbetting). Dropping to half Kelly costs only about a quarter of the growth rate while roughly halving the drawdown and sharply lowering volatility — **being able to stick with it** is the precondition for real returns, an extremely favorable trade.",
    },
  ],

  further: [
    { label: "Investopedia: Kelly Criterion (the formula and position sizing)", url: "https://www.investopedia.com/articles/trading/04/091504.asp" },
    { label: "Wikipedia: Kelly criterion (derivation and fractional Kelly)", url: "https://en.wikipedia.org/wiki/Kelly_criterion" },
    { label: "Investopedia: Risk of Ruin", url: "https://www.investopedia.com/terms/r/risk-of-ruin.asp" },
  ],
};
