export default {
  id: "vertical-spreads",
  stage: 6,
  order: 5,
  title: "Vertical Spreads: Bull/Bear, Debit/Credit",
  difficulty: 2,
  prereqs: ["call-option", "put-option"],

  oneLiner:
    "A vertical spread = **buy one leg and sell another, same expiry, different strikes**. The leg you sell uses its collected premium to **lower your cost and cap your upside**, turning the \"unlimited/expensive\" single-leg bet into a directional structure with **both risk and reward boxed in**. The four combinations (bull/bear × debit/credit) cover every pairing of direction and cash flow.",

  intuition: `
A single long call gets the direction right but has two pain points: it's expensive (you pay the full premium and sit through all the Theta), and you may not actually need that "unlimited upside" tail. The vertical spread exists to solve exactly that: **alongside the leg you buy, sell a farther same-type leg, and use its collected premium to subsidize the cost.**

The most intuitive example — a **bull call spread**, underlying at 100:

- **Buy** the strike-100 call, paying 6.5;
- **Sell** the strike-110 call, collecting 2.5;
- Net paid (**debit**) = 6.5 − 2.5 = **$4/share** (one contract = **$400**).

At expiry, three cases:

- Stock ≤ 100: both legs expire worthless, you lose the full **$400** net paid (max loss).
- Stock ≥ 110: your bought call makes (110−100)=10, the call you sold loses (S−110) which is hedged off, the combo locks in $10/share, minus the $4 cost = a net $6/share = **+$600** (max profit, capped).
- In between: P&L varies linearly between −400 and +600, with breakeven at **104** (= lower strike + net paid).

See the essence of a spread? **You sold off "the gain above 110" in exchange for a lower entry cost ($4 instead of 6.5) and a smaller max loss.** Both risk and reward are boxed into a **staircase shape** by the two strikes. The cost is that the upside is no longer unlimited — but much of the time you weren't counting on a double anyway; you just want to bet on a mild move.

Flip the direction of "buy near, sell far" and swap calls for puts, and you get the other three vertical spreads. They line up neatly into a 2×2:

- **Direction**: bull (bullish) / bear (bearish);
- **Cash flow**: debit (net paid, profits when the move happens) / credit (net collected, profits when the move doesn't happen, earning time value).

**In this lesson we break the vertical spread into five pieces:**

- **① What a vertical spread is: buy near, sell far; the sold leg lowers cost and caps**
- **② Debit spreads (bull call / bear put): pay to bet on direction**
- **③ Credit spreads (bull put / bear call): get paid to bet the move won't come**
- **④ A quick-reference table of max profit/loss/breakeven for all four**
- **⑤ How to choose: debit vs credit, and the wide-vs-narrow strike tradeoff**
`,

  mechanics: `
### ① What a vertical spread is

"**Vertical**" means the two legs share the **same expiry, only the strikes differ** (on the option chain they're in the same column, stacked vertically — hence the name). One buy, one sell, added together (Stage 2.2), give a **staircase boxed in at both ends**:

- **The leg you sell** contributes two things: ① its collected premium **offsets part (or all) of the cost**; ② at its strike it **cuts off** your P&L, forming a ceiling/floor.
- So the single-leg "unlimited profit / unlimited risk / expensive" is condensed into **limited profit + limited loss + lower cost**. This is why a vertical spread is called a "**defined-risk**" structure.

The four vertical spreads come from combining "**direction × debit/credit**." One key fact: **a bull call spread and a bull put spread have nearly identical payoff shapes** (both bullish, both defined-risk) — the only difference is whether you build it with calls or puts, and whether you pay or collect, as guaranteed by put-call parity (Stage 3.2).

### ② Debit spreads: pay to bet on direction

**A debit spread = buy the leg closer to the money + sell the farther OTM same-type leg, net paying a premium.** You rely on "the move actually happening" to realize the profit.

- **Bull call spread**: buy the lower-strike call + sell the higher-strike call. Built with calls.
  - Example (100/110, pay 6.5, collect 2.5, debit 4): **max profit** = spread width − net paid = (110−100)−4 = 6 → **+$600**; **max loss** = net paid = **−$400**; **breakeven** = lower strike + net paid = **104**.
- **Bear put spread**: buy the higher-strike put + sell the lower-strike put. Built with puts.
  - Example (100/90, pay 6.5, collect 2.5, debit 4): **max profit** = (100−90)−4 = 6 → **+$600**; **max loss** = **−$400**; **breakeven** = higher strike − net paid = **96**.

The debit-spread mantra: **max loss = the net premium you paid; max profit = spread width − net premium.** The less you pay, the higher the potential return relative to it, but the direction has to be right and reach the "other leg."

### ③ Credit spreads: get paid to bet the move won't come

**A credit spread = sell the leg closer to the money + buy the farther OTM same-type leg as protection, net collecting a premium.** You rely on "**the bad move not happening**" + time decay to earn that premium — in essence, collecting the variance risk premium (Stage 8.3).

- **Bull put spread**: sell the higher-strike put + buy the lower-strike put. Bet "it **won't break down**."
  - Example (sell 100 collect 6.5, buy 90 pay 2.5, credit 4): **max profit** = net collected = **+$400** (stock ≥100, both puts expire worthless); **max loss** = spread width − net collected = (100−90)−4 = 6 → **−$600** (stock ≤90); **breakeven** = higher strike − net collected = **96**.
- **Bear call spread**: sell the lower-strike call + buy the higher-strike call. Bet "it **won't rally past**."
  - Example (sell 100 collect 6.5, buy 110 pay 2.5, credit 4): **max profit** = **+$400** (stock ≤100); **max loss** = (110−100)−4 = 6 → **−$600** (stock ≥110); **breakeven** = lower strike + net collected = **104**.

The credit-spread mantra: **max profit = the net premium you collected; max loss = spread width − net premium.** Note that it typically has a **high win rate (you win as long as the move doesn't go the bad way) but poor odds (you make little, you can lose a lot)** — the classic shape of a seller's strategy. The farther OTM leg you bought is its "seatbelt," capping the single-leg seller's unlimited risk into a defined one.

> Debit vs credit, the mirror: in our symmetric example, a bull call spread (debit 4, makes 600/loses 400, BE 104) and a bear call spread (credit 4, makes 400/loses 600, BE 104) are exactly the **same pair of strikes, bought and sold in opposite directions**. This also reminds you: the same directional view can be expressed with either a debit or a credit, differing in cash-flow direction and win-rate/odds structure.

### ④ Quick reference for all four

Grasp one unified rule and you needn't memorize (let spread width = the difference between the two strikes):

- **Debit type (bull call / bear put)**: net premium paid D.
  - Max loss = **D**; max profit = **width − D**; profits when the direction is **right**.
- **Credit type (bull put / bear call)**: net premium collected C.
  - Max profit = **C**; max loss = **width − C**; wins when the bad move **doesn't come**.
- **Breakeven**, unified: start from "**the strike of the leg closer to the money**," then **shift one net premium toward the unfavorable side for a debit, toward the favorable side for a credit**.
  - Bull call: lower K + D; bear put: higher K − D; bull put: higher K − C; bear call: lower K + C.

In all cases, **max profit + max loss (absolute value) = spread width ×100** — risk and reward split up the "width" cake between the two strikes; debit and credit just slice it from opposite ends.

### ⑤ How to choose: debit/credit and wide/narrow

- **Debit vs credit**:
  - Want **high odds, low win rate** (a small loss to swing for a big gain, strong directional view) → **debit**. Especially when IV is low and options are cheap, buying a spread is a better deal.
  - Want **high win rate, low odds** (earning time value, tolerating a small adverse move) → **credit**. Especially when IV is high and sellers have the edge.
- **Strike width**:
  - **Narrow spread**: small cost/risk, also a small max profit, with a nearer breakeven.
  - **Wide spread**: closer to a single leg, a large max profit but also a large cost/risk.
- **Tradeoff versus a single leg**: a spread always exchanges "**a capped upside**" for "**lower cost/risk + reduced Theta and Vega sensitivity.**" When you have a directional view but **don't need unlimited room and want to control cost and risk**, a vertical spread is often the most cost-effective directional structure.

The demo on the right uses a segmented toggle to switch among **bull call debit / bear put debit / bull put credit / bear call credit**, drawing the staircase P&L live and cross-checking max profit/loss/breakeven (consistent with the netPL engine).
`,

  demo: "vertical-spread",

  analogy: `
A vertical spread is like **using "subletting" to remake a property bet, boxing an unlimited wager into a range.**

Suppose you think a neighborhood's prices will rise.

- **A single long call** is like paying in full to lock in the right to "buy at $1,000,000" — uncapped upside, but **expensive.**
- **A bull call spread (debit)** is: you lock in the right to "buy at $1,000,000," **and at the same time sublet the gain above $1,100,000 to someone else, collecting a sublet fee.** Your entry cost drops (you net-pay less), at the price that even if the home runs to $2,000,000, you only capture the 100→110 segment — **capped, but cheaper and lower-risk.**

Conversely, a **credit spread** is like **collecting a deposit and betting some bad thing won't happen**: e.g. you collect cash promising "the price won't break below $900,000" (a bull put spread), while buying yourself a "break-below-$800,000 backstop" as a seatbelt. As long as the price holds, the deposit is yours free; if it does break, your loss is boxed in by that backstop.

The shared spirit: **the leg you sell (subletting / collecting a deposit) both lowers the cost and boxes the P&L into a range.** You gave up the "unlimited" ends in exchange for a clear, manageable defined-risk structure — most of the time, smarter than a naked single leg.
`,

  misconceptions: [
    "**\"A bull call spread has uncapped upside, just like a single long call.\"** — Not so. The higher-strike sold leg cuts the profit at the **spread width**: in the example, max profit = (110−100)−4 = 6/share = $600, capped here. A spread trades the upside cap for a lower cost.",
    "**\"Credit spreads have a high win rate, so they make more.\"** — A high win rate usually comes with **poor odds**: in the example, a bull put spread makes at most 400 yet can lose 600. Sellers often \"win often, lose big.\" A high win rate ≠ a high expectation — view it together with odds and sizing (Stage 8.1).",
    "**\"Debit spreads and credit spreads are two completely different things.\"** — The same directional view can be expressed with either. Under symmetric strikes, a bull call (debit) and a bear call (credit) are the **same pair of strikes bought and sold in opposite directions**, with the same breakeven, just opposite cash-flow direction and win-rate/odds structure (parity, Stage 3.2).",
    "**\"A spread's max loss is unlimited.\"** — Quite the opposite — a vertical spread is a **defined-risk** structure: the debit type's max loss = net paid; the credit type's max loss = spread width − net collected. The farther OTM leg you bought is the \"seatbelt\" that nails the risk shut.",
    "**\"The wider the strikes, the better — bigger profit.\"** — A wide spread has a large max profit, but the **cost/risk scales up proportionally** too and it gets closer to a single leg. A narrow spread is cheap and low-risk but caps low. Wide vs narrow is a \"potential return vs cost and win rate\" tradeoff, with no absolute winner.",
  ],

  quiz: [
    {
      q: "Bull call spread: buy K=100 call paying 6.5, sell K=110 call collecting 2.5 (net debit 4). What is the **max profit** (per contract)?",
      options: ["$400", "$600", "$1,000", "Theoretically unlimited"],
      answer: 1,
      explain: "Max profit = spread width − net paid = (110−100) − 4 = 6/share = **$600**, occurring when the expiry price ≥110. The higher-strike sold leg caps the upside right here.",
    },
    {
      q: "For that same bull call spread (buy 100, sell 110, net debit 4), what are the **max loss** and **breakeven**?",
      options: [
        "Max loss $600; breakeven 110",
        "Max loss $400; breakeven 104",
        "Max loss $1,000; breakeven 100",
        "Max loss $400; breakeven 106",
      ],
      answer: 1,
      explain: "A debit spread's max loss = net paid = **$400** (expiry price ≤100, both legs expire worthless); breakeven = lower strike + net paid = 100 + 4 = **104**. Note max profit 600 + max loss 400 = the spread width 1,000 — they split this cake exactly.",
    },
    {
      q: "Bull put spread (credit): sell K=100 put collecting 6.5, buy K=90 put paying 2.5 (net credit 4). Which is correct?",
      options: [
        "Max profit = $400 (stock ≥100); max loss = $600 (stock ≤90); breakeven 96",
        "Max profit = $600; max loss = $400; breakeven 104",
        "Max profit unlimited; max loss $400",
        "Max profit = $400; max loss unlimited",
      ],
      answer: 0,
      explain: "A credit spread's max profit = net collected = **$400** (stock ≥100, both puts expire worthless); max loss = width − net collected = (100−90)−4 = **$600** (stock ≤90); breakeven = higher strike − net collected = 100 − 4 = **96**. The classic high win rate, poor odds.",
    },
    {
      q: "You're **mildly bullish** on a stock, think IV is high and options pricey, want a **high win rate** while tolerating a small adverse move, and would like to collect cash up front. Which vertical spread fits best?",
      options: [
        "Bull call spread (debit)",
        "Bear put spread (debit)",
        "Bull put spread (credit)",
        "Bear call spread (credit)",
      ],
      answer: 2,
      explain: "Bullish direction + collecting cash + high win rate → **bull put spread (credit)**: sell the higher-strike put, buy the lower-strike put, collect the net premium up front, and win as long as the stock **doesn't break down**, with sellers favored when IV is high. The debit types require paying and rely on the move; the bear types have the wrong direction.",
    },
  ],

  further: [
    { label: "Investopedia: Vertical Spread", url: "https://www.investopedia.com/terms/v/verticalspread.asp" },
    { label: "Investopedia: Credit Spread vs Debit Spread", url: "https://www.investopedia.com/ask/answers/050115/what-difference-between-credit-spread-and-debt-spread.asp" },
    { label: "Options Industry Council (OIC): Spreads", url: "https://www.optionseducation.org/strategies" },
  ],
};
