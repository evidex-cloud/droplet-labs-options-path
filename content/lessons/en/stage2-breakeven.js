export default {
  id: "breakeven",
  stage: 2,
  order: 3,
  title: "Breakeven & Computing Your Return",
  difficulty: 1,
  prereqs: ["payoff-diagrams"],

  oneLiner:
    "The breakeven tells you \"how far the underlying must travel before this trade stops losing.\" A long call's BE = **strike + premium**, a long put's BE = **strike − premium**; nail down the BE, the return and the risk/reward ratio, and only then do you know whether an option trade is worth placing.",

  intuition: `
The trap beginners fall into most is mistaking "I got the direction right" for "I'm guaranteed to make money."

Imagine you pay **$5/share** for a 100-strike call ($500 per contract), the stock really does rise, and it lands at **103** at expiry. You called the direction — and you're **still down**. Why? Because exercising recovers only $3 of intrinsic value, and after the $5 cost that's a net loss of $2 (−$200 per contract). The stock has to rise past **105** (= 100 + 5) before you turn from loss to profit. That 105 is the **breakeven**.

The breakeven answers the plainest question: "**on expiration day, where does the underlying have to land for me to exactly break even?**" It's the first number you must nail down before placing a trade — because it directly sets "how much the underlying has to rise/fall for me to have called it right."

And the BE is only the start. Once you've got it, two more questions remain:

- **How high is the return?** — what percentage of your capital you make, and whether it's worth the risk.
- **Are the odds good?** — the most you can make vs the most you can lose, i.e. the **risk/reward ratio**.

The most counterintuitive layer comes last: **a strategy with a "high win rate" can still lose money over the long run.** If you make a little eight times out of ten and lose a lot the other two, an 80% win rate won't save you. The breakeven and return math are exactly the tools to puncture this "win-rate illusion."

**In this lesson we break "breakeven and returns" into five pieces:**

- **① What the breakeven is actually computing**
- **② Single-leg formulas: call = K + premium, put = K − premium**
- **③ Why a spread can have one or two breakevens**
- **④ How to compute the return and risk/reward ratio (including ×100)**
- **⑤ Why a high win rate can still lose money — callback 8.6 on variance and psychology**
`,

  mechanics: `
### ① What the breakeven is computing

P&L at expiry = intrinsic value − premium paid (per share). **Set that difference to zero and solve for the underlying price S**, and you've got the breakeven. Put differently, the BE is the price at which "intrinsic value exactly offsets cost." It cares only about **the instant of expiry**: at the BE, this contract makes nothing and loses nothing — you've just recouped.

Remember three things: the BE is always defined **at expiry**; it treats the **premium as a cost you must earn back first**; and only past the BE is it real profit — short of the BE you're still losing even if the direction was right.

### ② Single-leg breakeven formulas

Write the long call and long put as formulas (per share):

$$long call BE = strike K + premium c
$$long put BE = strike K − premium p
$$spread (net debit) BE = the closer profitable leg's strike ± net premium

Taking each in turn:

- **Long call**, K=100, c=5 → BE = 100 + 5 = **105**. The underlying must rise past 105 to profit.
- **Long put**, K=100, p=4 → BE = 100 − 4 = **96**. The underlying must fall below 96 to profit (same BE = K − p formula as Stage 1.2).
- For the **seller**, the breakeven formula has the same form but the P&L direction is reversed: a short call starts losing above K + premium, a short put below K − premium — the premium is your "cushion."

> A detail never to forget: **in-the-money ≠ profitable.** A call is "in-the-money" and worth exercising once S > K, but only S > K + c (past the BE) is a real profit. In-the-money just means "worth exercising" — it's still one premium short of recouping.

### ③ Spreads: one breakeven or two?

The number of breakevens is set by **how many times the P&L curve crosses zero** (the vertical stacking of Stage 2.2):

- **Directional spreads** (e.g. a bull call spread: buy a lower strike, sell a higher strike) usually have **just one BE**. Example: buy the K=100 call for 6.5, sell the K=110 call for 2.5, net debit **4**. BE = 100 + 4 = **104**. Max profit comes at S ≥ 110, capped at (110−100) − 4 = **6**; max loss = the net premium **4**, at S ≤ 100.
- **Volatility combinations** (e.g. a straddle: buy a call + buy a put at the same strike) have **two BEs**. Example: K=100, call 4, put 4, total cost **8**. Lower BE = 100 − 8 = **92**, upper BE = 100 + 8 = **108**. The underlying must fall below 92 or rise past 108 to profit; stuck between 92 and 108 it loses, and dead center at 100 it loses the full 8 (−$800 per contract).

The demo lets you switch structures and drag strikes and premiums, recomputing the BE live and marking it on the chart — you can see the difference in shape between "one BE" and "two BEs" directly.

### ④ Return and risk/reward ratio

Knowing whether you profit isn't enough; you need to quantify "how much, and at what odds." Take that bull call spread (net debit 4, max profit 6, max loss 4, ×100 per contract):

- **Max profit (per contract)** = 6 × 100 = **$600**
- **Max loss (per contract)** = 4 × 100 = **$400**
- **Max return** = max profit ÷ capital invested = 600 ÷ 400 = **+150%**
- **Risk/reward ratio (reward∶risk)** = 600 ∶ 400 = **1.5 ∶ 1**

The higher the risk/reward ratio, the better the per-trade "odds"; but it **is not the expected value** — you still have to multiply by the respective probabilities. A 1.5∶1 structure, if its win probability is only 35%, actually has a negative long-run expectation (0.35×600 − 0.65×400 = 210 − 260 = **−$50**). This is exactly what leads us to piece ⑤.

### ⑤ Why a high win rate can still lose money

Separate "win rate" from "size of wins and losses" and you uncover a counterintuitive fact: **a high win rate ≠ long-run profit.**

Picture an option-selling strategy: most of the time (say 85%) you collect a small $1 premium, but occasionally (15%) you step on a landmine and lose $10. The win rate is a lofty 85% and looks steady — yet the long-run expectation = 0.85×1 − 0.15×10 = 0.85 − 1.5 = **−$0.65 per trade**, a loser. A few big losses are enough to swallow countless small wins.

Behind this are two deeper concepts:

- **Expected value**: the probability-weighted sum of each outcome's P&L. A **positive expectation** is the foundation of long-run survival — the win rate is only one factor in it.
- **Variance and luck**: even with a positive expectation, the path is bumpy. Short-run P&L is more about **luck (variance)** than skill — which is exactly what Stage 8.6 (trading psychology) addresses: staying disciplined through a losing streak rests on the breakeven, return and positive expectation you computed beforehand, not on after-the-fact emotion. Later we'll use Monte Carlo (simulating thousands of paths) to plot this "high win rate yet losing money" distribution for you.

**In one line**: before you trade, use the breakeven to confirm "how far it has to travel to profit," then the return and risk/reward ratio to confirm "whether the odds are worth it," and finally the expected value to check "whether it's positive over the long run." Clear all three gates and you have a trade with a basis — not a bet.
`,

  demo: "breakeven-calc",

  analogy: `
The breakeven is like **figuring out the "break-even line" before opening a shop**.

You take over a small storefront, and **rent + inventory cost you $50,000 up front** (the **premium**). Once you open, revenue has to cover that $50,000 before you start truly making money — that $50,000 hurdle is your **breakeven**.

- Revenue hits $30,000: you've got a business going ("direction is right"), but you haven't cleared the break-even line, so you're **still losing** — just like a call landing at 103, short of 105.
- Hits $50,000: exactly even, no gain, no loss — **right on the BE**.
- Hits $80,000: a net $30,000 — **only past the BE is it real profit.**

And "a high win rate can still lose money" is like: you open the doors every day (85% of days) and make a few hundred, but one big accident costs you a hundred-odd thousand and the whole year is still a loss. **Computing the break-even line, the odds and the long-run expectation** matters far more than "we opened again today" — and it's as true for options as for shops.
`,

  misconceptions: [
    "**\"If it finishes in-the-money, I've made money.\"** — Wrong. In-the-money only means **worth exercising**, not profitable. A call needs S > strike + premium (past the BE) to truly profit; at S=103, K=100, cost 5, it's in-the-money yet still down a net $2.",
    "**\"There's only one breakeven point.\"** — A single leg usually has one, but **straddles, strangles and other combinations have two BEs** (an upper and a lower), and spreads can have more than one too. Count how many times the P&L curve crosses zero.",
    "**\"A high risk/reward ratio means it's always worth doing.\"** — Not enough. The risk/reward ratio leaves out probability. A 1.5∶1 structure with only a 35% win chance still has a negative expectation. You have to fold **odds × win rate** into the **expected value** before it counts.",
    "**\"A high-win-rate strategy is safer.\"** — A dangerous misconception. A high win rate paired with \"the occasional big loss\" can carry a negative long-run expectation. A handful of tail losses can swallow countless small wins (Stage 8.6 covers it).",
    "**\"Computing returns means ignoring the contract multiplier.\"** — You do have to handle it. P&L and cost both **×100** to reach real dollars, but the return itself is a ratio (profit ÷ cost), where the ×100 appears in both numerator and denominator and cancels — though never drop it when computing the absolute P&L.",
  ],

  quiz: [
    {
      q: "You buy a 50-strike **put** for $4. Where is its breakeven?",
      options: ["54", "50", "46", "42"],
      answer: 2,
      explain: "Long put BE = strike − premium = 50 − 4 = **46**. The underlying must fall below 46 for this put to turn from loss to profit.",
    },
    {
      q: "Bull call spread: buy the K=100 call for 6.5, sell the K=110 call for 2.5. What are its **breakeven** and **max profit (per contract)**?",
      options: [
        "BE=110, max profit $600",
        "BE=104, max profit $600",
        "BE=104, max profit $1,000",
        "BE=100, max profit $400",
      ],
      answer: 1,
      explain: "Net debit = 6.5 − 2.5 = 4, BE = 100 + 4 = **104**. Max profit = (110−100) − 4 = 6, ×100 = **$600** (reached at S ≥ 110).",
    },
    {
      q: "A strategy makes $1 with 80% probability and loses $5 with 20% probability. What's its **single-trade expectation**?",
      options: ["+$1 (because the win rate is high)", "$0", "−$0.20", "−$5"],
      answer: 2,
      explain: "Expectation = 0.8×1 + 0.2×(−5) = 0.8 − 1.0 = **−$0.20**. A lofty 80% win rate is still a negative expectation — a few big losses swallow the many small wins, exactly \"a high win rate can still lose money.\"",
    },
    {
      q: "A trade has a max profit of $900 and a max loss of $300. What's its **risk/reward ratio (reward∶risk)**?",
      options: ["1 ∶ 3", "3 ∶ 1", "1 ∶ 1", "900 ∶ 1"],
      answer: 1,
      explain: "Risk/reward ratio = max profit ∶ max loss = 900 ∶ 300 = **3 ∶ 1**. Note this is just the odds — you still multiply by the win rate to get the expected value.",
    },
  ],

  further: [
    { label: "Investopedia: Break-Even Point", url: "https://www.investopedia.com/terms/b/breakevenpoint.asp" },
    { label: "Investopedia: Risk/Reward Ratio", url: "https://www.investopedia.com/terms/r/riskrewardratio.asp" },
    { label: "OIC: Calculating Option Profit & Loss", url: "https://www.optionseducation.org/" },
  ],
};
