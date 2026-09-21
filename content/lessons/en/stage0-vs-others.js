export default {
  id: "options-vs-others",
  stage: 0,
  order: 4,
  title: "Options vs Stocks vs Futures: What's Different",
  difficulty: 1,
  prereqs: ["call-put-rights"],

  oneLiner:
    "Draw all three as payoff diagrams and the differences are obvious: **a stock is a 45° straight line** (fully funded, linear, symmetric), **a future is also a line but with leverage and a two-sided obligation** (margin, can blow up), **an option is a kinked line** (small money, asymmetric, a right not an obligation, decays to zero over time). **Shape decides everything.**",

  intuition: `
After the first three lessons, you already know an option is the member of "the shadow of a price" that **hands you a right without an obligation** (Stages 0.1 and 0.3). This lesson sets it next to its two most common "cousins" — **stocks** and **futures** — to grasp the fundamental difference among all three at once.

The best approach isn't to memorize definitions, but to **look at the shape of the payoff diagram.** The horizontal axis is the underlying's price at expiry, the vertical axis is your P&L. Drawn out, the three are three completely different curves:

- **Stock**: a **45° straight line through your cost.** Up a dollar, make a dollar; down a dollar, lose a dollar — **perfectly linear, perfectly symmetric.** You put up your **full capital** (100 shares = $10,000), the max loss is the entire amount if it "falls to 0," and in theory there's no leverage.
- **Future**: **also a 45° straight line** (the payoff shape is nearly identical to a stock's), but with three critical differences — you post only a small **margin** to hook onto a large underlying (**leverage**); **both sides are obligated** to settle at expiry (**a symmetric obligation**); and an adverse move means a **margin call**, and if you can't hold it, **forced liquidation / blow-up.** It takes the stock's linearity and adds leverage and compulsion.
- **Option**: a **kinked line.** A long call is a "**floor + upslope**" hook: below the strike it's a **flat floor** (lose at most the premium), and only past the strike does it ramp up at 45°. **Asymmetric** (loss capped, upside open), **costs only a small premium**, and — **it decays over time and may expire at zero.**

Grab the essence in one line: **stocks and futures are "straight-line tools," options are a "kinked-line tool."** A straight line means you rise and fall in lockstep with the underlying (differing only in leverage and obligation); a kinked line means you are **reshaping the payoff** — which is exactly the unique power of options, and why they deserve a whole course.

We'll compare on consistent terms (underlying now $100, bullish view): **100 shares of stock / 1 future on 100 shares of the underlying / 1 call with strike 105, premium 5 (1 contract = 100 shares).** Five dimensions, dissected one by one.

**In this lesson we break "the difference among the three" into five pieces:**

- **① Capital required: $10,000 vs. a margin deposit vs. $500**
- **② Max loss: falls to 0 vs. can blow up and owe money vs. premium-capped**
- **③ Leverage: none vs. high and two-sided vs. high but downside-capped**
- **④ Expiry and time: perpetual vs. roll vs. decays to zero (Theta)**
- **⑤ Right or obligation: the fundamental fork in payoff "shape"**
`,

  mechanics: `
### ① Capital required

For the same "bullish on a $100 underlying" view, the three tools cost wildly different amounts:

- **Stock**: buy 100 shares = **$10,000**, real money fully committed. What you own is the **asset itself.**
- **Future**: one contract on the same notional value typically requires a margin deposit. This course uses **5%–15%** as an **illustrative band** (roughly $500–$1,500), **not a 2026 exchange official schedule**. You **don't own the underlying** — you only track its moves.
- **Option**: buy one call with K=105, c=5 = **5 × 100 = $500.** That $500 is everything you pay for the right, **and also your maximum loss.**

Capital efficiency: option ≈ future ≫ stock. But "less committed" doesn't mean "less risky" — see the next item.

### ② Max loss

This is the most dangerous fork among the three:

- **Stock**: max loss = the entire amount if it falls to 0 = **$10,000.** Ugly, but it has a **floor**, and you can never end up "owing."
- **Future**: **the deadliest.** Leverage magnifies the loss, an adverse move means a **margin call**, and if you can't hold it, **forced liquidation**; in extreme moves you can **lose all your margin and still owe** the broker (the price of a symmetric obligation).
- **Option (buyer)**: max loss = **premium = $500**, **hard-coded and capped.** Even if the underlying goes to zero, you simply abandon the right and lose that $500. **This is the option buyer's most alluring moat.**

$$Stock P&L = (S − 100) × 100   (linear)
$$Call P&L = [max(S − 105, 0) − 5] × 100   (kinked, floored at −500)

> Note a **key asymmetry**: the future's leverage is **two-sided magnification** (make more, lose more, can blow up); the option buyer's leverage is **"magnify the upside, seal off the downside"** — which is exactly what the optionality from Stage 0.2 looks like on a payoff diagram.

### ③ Leverage

- **Stock**: **no leverage** (cash account). Up 30%, you make 30% — clean, controllable.
- **Future**: **high leverage and two-sided symmetric.** 5–20x is common; a small move in the underlying swings your equity violently — same source for profit and for blow-up.
- **Option**: **high leverage but downside-capped.** $500 levers $10,000 of exposure, a small rise in the underlying can double the option (percentage magnification); a big drop, at worst, zeros it out (−100%, but capped). **"Convexity" leverage** is the essential difference between options and futures on leverage.

### ④ Expiry and time

- **Stock**: **no expiry**, you can hold it forever, and time is on your side (for a long-term riser).
- **Future**: has an expiry, but you can **roll** to a later month to continue the position; it has **no time-value decay** of its own — P&L is essentially price-only.
- **Option**: **has an expiry, and time is the buyer's enemy.** An option's price contains a slice of time value, and as expiry nears it **melts away** — that's Theta (Stage 5.4). **Even if the underlying sits perfectly still, the option gets cheaper day by day and expires at zero.** Neither stocks nor futures have this; it's where the option buyer most easily takes a hidden hit.

### ⑤ Right or obligation: the fundamental fork in shape

Gather the first four points into one most-fundamental difference. Compare item by item across **stock / future / option (buyer)**:

- **Payoff shape**: line · line · **kinked line**
- **Symmetry**: symmetric · symmetric · **asymmetric**
- **What you hold**: the asset itself · a two-sided obligation · **a right (not an obligation)**
- **Max loss**: falls to 0 · can blow up / owe · **premium, capped**
- **Time decay**: none · none · **yes (Theta)**

**Stocks and futures are both "line + obligation"**: you're bound to the underlying, rising and falling together, differing only in leverage and compulsion. **Only the option is "kinked line + right"**: you pay a premium to buy a choice that **can reshape the payoff** — clip the downside, leave the upside open.

Precisely because an option can **freely bend the payoff curve**, by stacking several together you can build almost any shape of return: the staircase of a vertical spread, the tent of an iron condor, the V of a straddle... (Stages 6 and 7). **Stocks and futures can only give you a straight line; an option gives you a whole "Lego set of payoff curves."** That, in the end, is what's different.

> A quant coda: line tools (stocks/futures) have a Delta that is a constant (±1, times leverage), with no Gamma; an option's Delta changes with the underlying (that's Gamma), and is sensitive to volatility (Vega). What we call "nonlinearity" comes precisely from that kink — and it's the starting point of the entire pricing and hedging course (Stages 3–5).

> 2026 note: in crypto, the linear leveraged product retail actually meets is usually the **perp** — no delivery date, the clock is **funding** — while dated futures still exist (e.g. CME BTC). Perp / dated future / option are three tools, not three nicknames. Independent module: **Stage 12**.
`,

  demo: "payoff-compare",

  analogy: `
Think of the three tools as three **ways to travel** to bet that "the destination will be better."

- **Stock = driving your own car**: you pay for all the gas yourself (**full capital**), you bear the whole road good or bad, and it's **linear**: go farther, arrive sooner; hit more traffic, burn more. The worst case is the car is totaled (falls to 0), but you **never end up owing.**
- **Future = a race car on high leverage you borrowed**: pay only a small deposit (margin) to drive a very fast car (**leverage**) — flying with the wind, but **multiplied just as badly against it**, and if the deposit burns up you might even **owe the repair bill** (blow up and owe). Two-sided, symmetric, thrilling and dangerous.
- **Option = buying a "refundable discount plane ticket"**: pay only a little for the fare (premium). If the weather's good you fly, upside open; if it's bad you **refund and walk away, losing at most the fare** (loss capped). But **the ticket has an expiry** — as it nears, the fare shrinks day by day (Theta), and past expiry it's void (zeroed out).

The difference in one line: **driving and racing both "go in a straight line," differing only in speed and whether you can end up owing; only that plane ticket lets you "refund if bad, still fly if good" — completely rewriting the shape of the payoff.**
`,

  misconceptions: [
    "**\"Options and futures are about the same — both leveraged derivatives.\"** — The payoff **shape** is fundamentally different. A future is a **straight line, two-sided obligation**, with margin calls on an adverse move and blow-up-and-owe; an option is a **kinked line, a right not an obligation**, with the buyer's max loss being the premium. One symmetric, one asymmetric.",
    "**\"Options tie up less capital, so they're safer than stocks.\"** — Less committed ≠ less risky. A long option can **lose the entire premium (−100%)**, and time value melts every day, so you lose even if the underlying sits still (Theta). A stock down 50% still leaves you half; an option that expires out-of-the-money is **a worthless slip of paper.**",
    "**\"Buying stock and buying a call are both bullish, so same effect.\"** — A stock is **linear, no expiry, no time decay**; a call is **kinked, has an expiry, decays to zero.** A call must rise past the breakeven (strike + premium) to truly profit, and time isn't on your side. Their risk structures are completely different (Stage 1.1).",
    "**\"Both futures and options require margin.\"** — Only half right. **In futures both sides post margin** (both have obligations); for options **only the seller posts margin** (the seller has the obligation and the larger risk), and the **buyer, having paid the premium, has no further obligation** and can't be margin-called. This is the direct expression of \"right vs. obligation.\"",
    "**\"A crypto perp is just a future, so it is basically an option too.\"** — In 2026 the linear leveraged product retail meets is the **perp**: no expiry, the clock is funding not delivery; dated bitcoin futures still trade (CME). Options are convex, pay premium, and have Theta. Do not mix the names. See Stage 12.",
  ],

  quiz: [
    {
      q: "Which instrument's expiry payoff diagram is a **kinked line (asymmetric)** rather than a straight line?",
      options: ["Holding 100 shares of stock", "Going long one stock-index future", "Buying one call option", "All of them are straight lines"],
      answer: 2,
      explain: "Stocks and futures both have **linear, symmetric** straight-line payoffs (differing only in leverage and obligation). Only the **option**, because it's \"a right not an obligation,\" has a payoff like max(S−K,0) — a **kinked line**, with the downside capped by the premium and the upside open.",
    },
    {
      q: "Underlying $100. A buys 100 shares ($10,000), B goes long one future, C buys one call (premium $500). The underlying crashes to 30. Who might **lose their margin and still owe the broker**?",
      options: ["A (stock)", "B (future)", "C (call buyer)", "All three would owe"],
      answer: 1,
      explain: "**In futures both sides are obligated** and highly leveraged, so a crash that breaks through the margin can leave you **owing.** A stock at worst falls to 0 (no owing); the option **buyer's** max loss is just the $500 premium (capped). This is the most dangerous price of a \"symmetric obligation.\"",
    },
    {
      q: "Compared with stocks and futures, what is a \"hidden cost\" unique to the option buyer?",
      options: ["Must pay dividends", "Time value steadily bleeds away as expiry nears (Theta) — you can lose even if the underlying doesn't move", "Forced daily liquidation", "Can't sell early"],
      answer: 1,
      explain: "An option's price contains a slice of time value that **melts as expiry nears (Theta)**, reaching zero at expiry. A stock is perpetual and a future can be rolled — neither has this time decay. So even if you call the direction right, you can lose because it \"rose too slowly\" (Stage 5.4).",
    },
  ],

  further: [
    { label: "Investopedia: Options vs. Futures (a comparison)", url: "https://www.investopedia.com/ask/answers/difference-between-options-and-futures/" },
    { label: "CME Group: Options vs Futures (the exchange's view)", url: "https://www.cmegroup.com/education/courses/introduction-to-options.html" },
    { label: "OIC: Why Use Options (advantages and costs vs. stock)", url: "https://www.optionseducation.org/" },
  ],
};
