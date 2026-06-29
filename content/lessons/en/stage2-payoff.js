export default {
  id: "payoff-diagrams",
  stage: 2,
  order: 2,
  title: "Payoff Diagrams 101: The Trader's Map",
  difficulty: 1,
  prereqs: ["call-option", "put-option"],

  oneLiner:
    "A payoff diagram plots \"underlying price at expiry → your profit/loss\" as a curve: **the x-axis is the underlying at expiry, the y-axis is P&L**. Learn to read it and any strategy, however complex, reveals its max profit, max loss and breakeven at a glance.",

  intuition: `
The most counterintuitive thing about options is that their P&L isn't a straight line — it **bends**. Buy 100 shares of stock and it's one 45° line: up $1 makes $1, down $1 loses $1, done. But a call option flattens out at the floor (you lose at most the premium), then turns and climbs at 45° past a certain price — a kinked shape that's hard to picture in your head. So traders invented a way to *see* it: the **payoff diagram**.

Reading it is dead simple; two axes are all you need:

- **x-axis = the underlying price S at expiry**. Left to right, the underlying gets more expensive.
- **y-axis = your P&L on the trade**. Above the zero line you're up (green), below it you're down (red).

So the curve answers one question: "**if the stock lands right here on expiration day, do I make or lose money, and how much?**" Put your finger on a price on the x-axis, run straight up to the curve, then read across to the y-axis — that's your P&L at that price.

An example. Buy one call, strike 100, premium 5:

- Stock lands at **90**: the call is worthless, you lose the whole $5 premium (−$500 per contract). The curve here is a **flat floor** pinned at −5.
- Stock lands at **100**: still down 5 (exercising captures no intrinsic value).
- Stock lands at **105** (= 100 + 5): intrinsic value of 5 exactly offsets the cost — **you break even**. This is where the curve crosses zero, the **breakeven point**.
- Stock lands at **120**: intrinsic value 20 − cost 5 = a net 15 gain (+$1,500 per contract). From the strike on, the curve climbs at 45°.

See the trick? **This one curve plots "the most you can lose, how high it must go to break even, and how much you can make" all on a single picture.** And the real magic: stack several legs together and their curves **add vertically** — which is where every fancy strategy comes from.

**In this lesson we break "reading a payoff diagram" into five pieces:**

- **① The two axes: x = price at expiry, y = P&L, and how to read one point**
- **② The four single-leg "basic shapes," burned into muscle memory**
- **③ Multi-leg stacking: curves add vertically**
- **④ The breakeven = where the curve crosses zero**
- **⑤ Reading max profit / max loss straight off the chart**
`,

  mechanics: `
### ① The two axes: how to read one point on the chart

A payoff diagram is a coordinate system: **the x-axis is the underlying price S at expiry, the y-axis is P&L at expiry (per share; multiply the displayed dollars by 100)**. Three steps to read it:

1. On the x-axis, find the price you care about (say S = 115).
2. Run straight up until you hit the P&L curve.
3. Read across to the y-axis — positive is above the zero line (a gain, green), negative is below (a loss, red).

Where the curve **crosses zero** is the breakeven; the curve's **highest point** is max profit, its **lowest point** max loss. The whole demo on the right is a "payoff-diagram printer": whatever legs you stack, it draws the matching curve.

### ② The four single-leg basic shapes

The four single legs (already lined up side by side in Stage 1.3) each have a signature outline — burn them into muscle memory:

- **Long call**: a floor on the left (lose at most the premium), then a **45° climb up and to the right** past the strike. A hockey stick.
- **Long put**: a floor on the right, then a **45° climb up and to the left** past the strike. The mirror hockey stick.
- **Short call**: the long call **flipped vertically** — a ceiling on the left (make at most the premium), then a dive down and to the right past the strike (loss wide open when naked).
- **Short put**: the long put flipped — a ceiling on the right, diving down and to the left.

Remember one symmetry rule: **flip a buyer's chart across the zero line and you get the seller's chart.** Buyers pay the premium — limited loss, open-ended gain; sellers collect the premium — limited gain, open-ended loss.

### ③ Multi-leg stacking: curves add vertically

This is the most powerful part of payoff diagrams, and the one you should play with by hand: **a combination's P&L = the sum of each leg's P&L.** As a formula (per share):

$$combo P&L(S) = legPL₁(S) + legPL₂(S) + …
$$where each legPL is that leg's single-leg P&L at expiry price S

On the chart, this means **at every x-coordinate S, add the vertical heights of the curves directly.** Several classic combinations are "assembled" exactly this way:

- **Covered call = hold 100 shares + sell 1 call**. The stock is a 45° line; the short call presses a ceiling on at the top; add them → a kinked line that "loses on the lower left, sheared flat on the upper right": you give up the big upside in exchange for a premium cushion (Stage 6.2 covers it in full).
- **Bull call spread = buy a lower-strike call + sell a higher-strike call**. Two hockey sticks, one positive one negative, added → a **staircase**: max loss = the net premium paid, max profit = the strike difference − net premium, capped.
- **Straddle = buy a call + buy a put at the same strike**. Two hockey sticks meeting left and right form a **V**: you win if the underlying moves big either way, and lose on both legs if it stalls in the middle.

The demo has preset buttons for these — one click loads the matching legs, and you can watch the curve stack up leg by leg with your own eyes.

### ④ The breakeven: where the curve crosses zero

**The breakeven (BE) is where the P&L curve crosses the zero line** — land at that price at expiry and you make nothing, lose nothing.

- Single long call: BE = strike + premium (in the example, 100 + 5 = **105**).
- Single long put: BE = strike − premium.
- **Spreads and combinations can have more than one BE**: that straddle's V **crosses zero twice** (a left and a right breakeven), meaning the underlying has to clear one of them — and move far enough — to actually profit.

The demo automatically marks a BE dot wherever the curve crosses zero — you don't have to memorize formulas, just read off the chart "how far up/down before I recoup." Stage 2.3 lays out these formulas and the return math in full.

### ⑤ Reading max profit / max loss off the chart

On any payoff diagram, three numbers matter most, and all three can be **read straight off the shape**:

- **Max loss** = the curve's **lowest point**. For a buyer's combination it's usually a flat floor (= the net premium paid).
- **Max profit** = the curve's **highest point**. If the right end (or left end) keeps climbing without a cap, it's **theoretically unlimited**; if it's sheared into a flat ceiling, read off that ceiling's height.
- **Risk/reward ratio** = max profit ÷ max loss, a measure of how good the trade's "odds" are.

> Key reminder: **a payoff diagram plots the P&L "at the instant of expiry."** Before expiry, because time value still remains (Stage 1.6), the real P&L curve is a smoother arc floating above the expiry line; the closer to expiry, the more it collapses onto these kinks. Master the expiry chart first, then talk about unrealized gains and losses along the way.

With these five points down, you hold the options trader's most important tool: a map that lets you "see through" any strategy's risk and reward at a glance. From here on, every time you learn a new strategy, the first thing to do is — **draw its payoff diagram.**
`,

  demo: "payoff-builder",

  analogy: `
A payoff diagram is like the **elevation profile of a hiking route**.

The x-axis is how far along you are (the **underlying price at expiry**), the y-axis is altitude (your **P&L**). Sea level is "break even":

- **Above** the line are peaks — the higher, the more you make; **below** it are valleys — the deeper, the harder you lose.
- The **breakeven** is the one or two points where the route **crosses sea level** — where you climb out of the valley back above the waterline.
- A **long call** profile is "a flat stretch of valley floor first (lose at most the premium), then an endless climb past a point"; a **straddle** is a V-shaped valley, climbing up either way, worst stuck at the bottom.
- **Overlay two routes** (a multi-leg combination) and the new altitude is the sum of the two profiles' heights at each point — exactly where the kinked shapes of spreads and covered calls come from.

Before a hike you check the elevation profile to know where the valleys are, where you'll climb, and how high you can get. For options, you check the payoff diagram first — **it's the terrain map of the trade.**
`,

  misconceptions: [
    "**\"A payoff diagram plots P&L at any moment.\"** — No. The standard payoff diagram plots P&L **at the instant of expiry**. Before expiry, with time value still remaining, the real curve is a smoother arc floating above the kinks, collapsing onto them the closer you get to expiry.",
    "**\"The x-axis is time.\"** — Wrong. The x-axis of an option payoff diagram is the **underlying price S at expiry**, not time. It answers \"how much do I make at different prices,\" not \"how it changes over time.\"",
    "**\"The more legs, the more complex — you can't compute it by hand.\"** — Just the opposite. A combination's P&L is simply **each leg's P&L added vertically at every price** — stack them one by one. Even the fanciest strategy is assembled this way.",
    "**\"If the curve is above zero, you're guaranteed to profit.\"** — It depends on **which expiry price you're asking about**. Put your finger on a given S, run up to the curve, read the y-value — that point is a profit only if it's positive. Different S values can give one positive, one negative.",
    "**\"There's only one breakeven point.\"** — A single leg usually has one, but **spreads and combinations can have two or more**. That straddle's V crosses zero twice, meaning the underlying must clear one of the breakevens to recoup.",
  ],

  quiz: [
    {
      q: "On an option payoff diagram, what do the **x-axis and y-axis** represent?",
      options: [
        "x = time, y = underlying price",
        "x = underlying price at expiry, y = P&L",
        "x = strike, y = premium",
        "x = implied volatility, y = Delta",
      ],
      answer: 1,
      explain: "The x-axis is the **underlying price S at expiry**, the y-axis is **P&L**. Reading it is: find a price on the x-axis → run up to the curve → read across to the P&L.",
    },
    {
      q: "On a payoff diagram, the **breakeven** corresponds to what position on the curve?",
      options: ["The highest point", "The lowest point", "Where the curve crosses the zero line", "The steepest part of the curve"],
      answer: 2,
      explain: "The breakeven = where the P&L curve **crosses zero** — land there at expiry and you make nothing, lose nothing. Spreads and straddles can have two such crossings.",
    },
    {
      q: "How does the payoff diagram of a **covered call** (hold 100 shares + sell 1 call) come about?",
      options: [
        "It's just a call's hockey stick",
        "The stock's 45° line plus the short call's curve, added vertically, sheared into a ceiling on the upper right",
        "A straight line diving downward",
        "A symmetric V",
      ],
      answer: 1,
      explain: "Combo P&L = each leg added vertically. The stock is a 45° line; the short call presses a ceiling on at the top; added, you get the kinked line that \"loses with the stock on the lower left, capped on the upper right\" — giving up the big upside for a premium cushion.",
    },
    {
      q: "Long call, K=100, premium 5. At an expiry price of **120**, what's the P&L per contract (×100)?",
      options: ["Lose $500", "Make $1,000", "Make $1,500", "Make $2,000"],
      answer: 2,
      explain: "Per-share P&L = max(120−100, 0) − 5 = 20 − 5 = 15; ×100 = **make $1,500**. On the chart, that's running straight up from S=120 to the curve and reading off a height of +15.",
    },
  ],

  further: [
    { label: "Investopedia: Options Payoff Diagrams", url: "https://www.investopedia.com/terms/p/payoffdiagram.asp" },
    { label: "OIC: Profit & Loss Diagrams (interactive tool)", url: "https://www.optionseducation.org/toolsoptionquotes/options-calculator" },
    { label: "CBOE: Strategy Payoff Charts", url: "https://www.cboe.com/education/" },
  ],
};
