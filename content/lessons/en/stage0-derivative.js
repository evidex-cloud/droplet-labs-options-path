export default {
  id: "derivative-intro",
  stage: 0,
  order: 1,
  title: "What Is a Derivative: A Contract on a Price",
  difficulty: 1,
  prereqs: [],

  oneLiner:
    "A derivative is a contract **whose value is derived from something else**: it has no intrinsic price of its own — its price is a **shadow** of another asset's price (a stock, an index, a commodity, a crypto). An option is the one member of that family that **hands you a right without forcing an obligation**.",

  intuition: `
Start with the word itself: **"derive"** means "to come from, to draw out of." A derivative contract **is not an asset**; it's a piece of paper whose value **tracks the price of something else (the underlying)**. The underlying rises, it may rise; the underlying falls, it may fall. "A shadow of a price" is the most faithful description: **the shape of the shadow is dictated by the body that casts it.**

Take the plainest example. A stock trades at **$100**.

- You **buy 100 shares outright**: you put up $10,000 and own the **asset itself** — from now on, however the price moves, so moves your P&L. That is not a derivative.
- You sign a contract with someone else: "**three months from now, I have the right to buy this stock at $105.**" You pay a little for that right. **The contract holds no stock of its own** — its value depends entirely on what the stock is worth in three months. That is a **derivative** (specifically, a call option).

See the key point? **The derivative and the underlying are two different things.** What you bought isn't equity in a company — it's **a "contract about a price."** Precisely because the value is derived, the same underlying can spawn countless contracts: bet it rises, bet it falls, bet it goes nowhere, insure a holding... These are the Lego bricks of finance.

A derivative is a **whole family**, with members including **forwards, futures, swaps, and options**. Their shared trait is "value derived from an underlying"; their biggest fork is — **at expiry, must you perform, or may you choose?** The option is the one-of-a-kind member: it gives you a **right, not an obligation.** That single fact is the seed of everything that follows.

**In this lesson we break the umbrella concept of "derivative" into four pieces:**

- **① What "derived value" means — the shadow and the body**
- **② The derivatives family: forward / future / swap / option**
- **③ Why people invented derivatives — three plain motives**
- **④ What sets options apart: right ≠ obligation (the seed of the whole course)**
`,

  mechanics: `
### ① What "derived value" means

In one line: **a derivative's price is the output of some formula applied to the underlying's price.** Call the underlying **S** (underlying), and the derivative's value is **f(S)**. When S moves, f(S) moves with it — that is "derivation."

- **Stock** itself: hold it and its value simply **is** S; there is no "derivation."
- **Derivative**: its value is **f(S)**. It might be a straight line (a future is roughly S shifted), or it might be **bent** (the option's signature hook).

Because it is only a contract and contains no underlying, a derivative has two innate features: **① a little money can hook onto a large amount of the underlying** (this is where leverage comes from); **② it usually has a term, and at expiry it settles or expires worthless.** You'll meet these two over and over.

### ② The derivatives family: four members

Line the family up side by side and the differences leap out:

- **Forward**: a private, one-to-one agreement to "buy/sell a given underlying, on a future date, at a set price." **Both sides are obligated** to perform. The oldest and plainest, but it carries counterparty default risk.
- **Future**: a standardized forward listed on an exchange. It is **marked to market daily**, backed by **margin** and a clearinghouse. **Both sides are still obligated** — if the price moves against you, you must post more margin, and may even be liquidated.
- **Swap**: an agreement to **exchange cash flows** at a series of future dates; the most common is "fixed rate ⇄ floating rate." It's essentially a bundle of forwards.
- **Option**: **the buyer pays a premium for a "take-it-or-leave-it" right**; the seller collects the cash and takes on the obligation. This is the family's **only asymmetric member** — and the star of this course.

> Memorize the family's division of labor in one line: forward / future / swap are all "**must**" at expiry; the option is "**may**." Swap "must" for "may," and the entire payoff shape changes from a straight line into a kinked one.

### ③ Why people invented derivatives

Derivatives aren't financial alchemy; they solve three very concrete, real-world needs:

- **Transferring risk (hedging)**: an airline fears rising fuel, a farmer fears falling grain prices, a fund fears a market crash. They use derivatives to **offload** unwanted risk onto someone willing to bear it. Insurance is, at heart, "paying for uncertainty" — and **buying a put on a holding is a price-decline insurance policy** (Stage 0.2 walks through this with real numbers).
- **Getting exposure without owning the underlying**: you want to bet on oil or go long an index without actually stockpiling barrels or buying a whole basket of stocks. A derivative lets you **track the price without touching the physical thing** — clean and simple.
- **Leverage — a small bet on a big move**: use a little money to hook onto the rise and fall of a large underlying, **amplifying the percentage return (and risk)**. This is what makes derivatives most alluring, and most likely to blow up.

These three — **hedging, exposure, leverage** — are the entire reason derivatives exist. **The tool is neutral**: the same contract guards a hedger, magnifies a speculator, and earns a market maker the spread.

### ④ What sets options apart: right ≠ obligation

Now we plant the course's **first seed.** In a forward, future, or swap, **both buyer and seller are bound**: on expiry day, the deal is the deal, however unfavorable the price.

The option breaks that symmetry:

- **The buyer** pays a premium and buys a **choice** — exercise if it's worthwhile, throw it away if it isn't. **The worst case is just losing that premium**; the downside is sealed off.
- **The seller** collects the premium and shoulders the **obligation** — whenever the buyer exercises, they must deliver as agreed. **High risk, and they must post margin.**

This "**limited loss, open-ended possibility**" asymmetry is the soul of options; in English it's called **optionality.** It turns the payoff diagram from a sloped line into a **kinked one** (Stage 0.4 draws the payoff shapes of all three tools side by side so the difference is obvious at a glance). Exactly how "the right to buy" and "the right to sell" split apart — that's calls versus puts, saved for Stage 0.3.

Take away just one sentence from this lesson: **a derivative is the shadow of a price; and an option is the only kind of shadow that lets you "choose."**
`,

  demo: "spot-vs-derivative",

  analogy: `
Think of a derivative as **a contract about "the weather."**

The weather (the underlying) is something you can neither buy nor store. But you can sign a contract whose payoff **tracks the weather**:

- **Forward/future style**: a farm and an ice-cream maker agree, "for every 1°C the average summer temperature runs above normal, you pay me $10,000." **Both are bound** — hot or cold, each settles up. The classic "two-sided obligation."
- **Option style**: the ice-cream maker spends a little to buy a "**heat insurance**" policy — if it gets hot, it collects the agreed payout; if it doesn't, it **only loses that premium** and never has to pay out the other way. **A right, not an obligation.**

Notice: neither contract **is the weather itself** — their value is **entirely derived from** it. That's the essence of a derivative: **you never trade the thing itself, only a contract pegged to its price.** And an option is the version that "only pays me, never pins me."
`,

  misconceptions: [
    "**\"Buying a derivative is the same as owning the stock/the barrel of oil.\"** — No. A derivative is a **contract**, and it **contains no underlying.** Buy a call and you don't hold any stock — only a right to buy at the agreed price later; its value is a **shadow** of the underlying's price, and it usually has a term and expires.",
    "**\"Derivatives are all high-risk gambling.\"** — The tool itself is neutral. It was born for **hedging**: airlines lock in fuel, farmers lock in grain, funds insure holdings. **How much risk you take depends on how you use it** — a naked futures short can blow up, while a long option's downside is sealed off by the premium.",
    "**\"Options and futures are about the same — both leveraged tools.\"** — The key difference is **symmetry.** In futures **both sides are obligated**, and an adverse move means more margin; the option buyer holds only a **right**, with worst-case loss equal to the premium. One is a straight-line payoff, the other a kinked one (Stage 0.4 draws them side by side).",
    "**\"A derivative sets its own price.\"** — Just the opposite: its price is **firmly tethered** to the underlying — S rises, f(S) follows. Detached from the underlying, a derivative has no value of its own. That's exactly what \"**derived**\" means, and the starting point of every pricing model to come.",
  ],

  quiz: [
    {
      q: "Which of the following is **not** a derivative?",
      options: ["A call option on a stock", "A crude-oil futures contract", "An interest-rate swap", "100 shares of stock held outright"],
      answer: 3,
      explain: "**Holding stock outright** means owning the underlying asset itself — its value simply *is* itself, not derived from elsewhere. The other three are contracts whose value is **derived from an underlying** — which is exactly the definition of a derivative.",
    },
    {
      q: "What is the most fundamental difference between an option and a future or forward?",
      options: ["An option has no expiry date", "The option buyer holds a \"right, not an obligation\" — free to exercise or walk away", "An option costs nothing", "An option's price isn't affected by the underlying"],
      answer: 1,
      explain: "In a forward/future **both sides are obligated** to perform at expiry; after paying a **premium**, the option buyer holds only a **right** — exercise if it pays, abandon it if it doesn't, losing at most the premium. That asymmetry (optionality) is the soul of options.",
    },
    {
      q: "When people first created derivatives, the most central motive was which of these?",
      options: ["To make markets more exciting", "To transfer unwanted risk to someone willing to bear it (hedging)", "To eliminate all transaction costs", "To guarantee investors a sure profit"],
      answer: 1,
      explain: "The fundamental purpose of derivatives is to **transfer/manage risk**: airlines lock in fuel, farmers lock in grain, funds insure holdings. Exposure and leverage are derived uses, but **hedging** is the original reason it exists.",
    },
  ],

  further: [
    { label: "Investopedia: Derivatives (an overview)", url: "https://www.investopedia.com/terms/d/derivative.asp" },
    { label: "CME Group: Introduction to Derivatives (futures/derivatives primer)", url: "https://www.cmegroup.com/education.html" },
    { label: "Options Industry Council (OIC): free options education", url: "https://www.optionseducation.org/" },
  ],
};
