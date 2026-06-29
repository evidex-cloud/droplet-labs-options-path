export default {
  id: "call-put-rights",
  stage: 0,
  order: 3,
  title: "The Two Basic Rights: Calls & Puts",
  difficulty: 1,
  prereqs: ["why-options"],

  oneLiner:
    "The options world has only two basic rights: **a call = the right to buy at an agreed price**, **a put = the right to sell at an agreed price.** Add one more layer — are you the buyer or the seller (buyer holds the **right**, seller bears the **obligation**) — and the pairwise combinations grow into the entire options universe.",

  intuition: `
Options sound like an endless variety, but **underneath there are only two verbs: buy, and sell.**

- **Call option** = a voucher for the right to "**buy** the underlying **at an agreed price**." The call buyer is betting that **the underlying will rise**, so they can later buy in below market at the strike.
- **Put option** = a voucher for the right to "**sell** the underlying **at an agreed price**." The put buyer is betting that **the underlying will fall**, so they can later sell above market at the strike.

The mnemonic is dead simple: **a Call "calls in" the stock — it brings the stock to you at the agreed price (you buy); a Put "puts out" the stock — it pushes the stock out of your hands at the agreed price (you sell).**

But "call/put" alone isn't enough, because every contract has **two ends**: **the person who buys it** and **the person who sells it.** This is the layer beginners most easily tangle over, and the most crucial:

- **The buyer (who holds the right)**: pays a premium for a "**take-it-or-leave-it**" choice. **Worst case, loses only the premium**, downside sealed off.
- **The seller (who bears the obligation)**: collects the premium and takes on the duty "**if the other side exercises, I must perform.**" **Gain capped at the premium, but risk far larger**, so margin is required.

Stack these two layers — **{call/put} × {buyer/seller}** — and you get the **four basic positions.** They are the four Lego bricks of every options strategy, and the next stage lines all four up side by side (Stage 1.3). This lesson nails down the most basic thing first: two rights, two sides.

Tie it together on the same stock, trading at **$100**:

- You think it **will rise** → **buy a call** (pay premium, bet up, loss capped).
- You think it **will fall** → **buy a put** (pay premium, bet down or buy insurance, loss capped).
- You think it **won't rise much** → **sell a call** (collect premium, bet it doesn't rally hard).
- You think it **won't fall much** → **sell a put** (collect premium, bet it doesn't drop hard).

**In this lesson we break "the two basic rights" into four pieces:**

- **① Call = the right to buy (the full picture of a call)**
- **② Put = the right to sell (the full picture of a put)**
- **③ Buyer vs. seller: the two ends of right and obligation**
- **④ Directional view → which to pick: bullish, buy a call; bearish, buy a put**
`,

  mechanics: `
### ① Call = the right to buy

A call gives the buyer one right: **to buy the underlying at strike K, before expiry (American) or at expiry (European).**

Let the underlying trade at 100, and buy one call with K=105, premium c=5 (**one contract is 100 shares, so 5×100 = $500 actually paid**):

- Underlying rises to **130** → you have the right to buy at 105, effectively capturing (130−105)=25 of intrinsic value per share, minus the $5 premium, for a **net $20/share, $2,000 a contract.**
- Underlying falls to **70** → who would buy at 105 something worth 70? You **abandon the right**, losing just that $5 premium, **capped at $500 a contract.**

**Keywords: buy the upside, a right, loss capped, upside open.** This is the "hook" payoff that Stage 1.1 dissects in detail.

### ② Put = the right to sell

A put gives the buyer the symmetric opposite right: **to sell the underlying at strike K.**

Let the underlying trade at 100, and buy one put with K=95, premium p=4 (**4×100 = $400 actually paid**):

- Underlying falls to **70** → you have the right to sell at 95, capturing (95−70)=25 of intrinsic value per share, minus the $4 premium, for a **net $21/share, $2,100 a contract.**
- Underlying rises to **120** → who would sell at 95 something they could sell for 120? You abandon the right, losing the $4 premium, **capped at $400 a contract.**

A put has two classic uses: **buying a put naked** (a pure bet on a drop) or **insuring a holding** (the protective put, covered in Stage 0.2).

> The beauty of symmetry: flip the call's payoff diagram **left-to-right** and you get the put. A call makes money **above** the underlying, a put makes money **below** — two sides of the same mirror.

### ③ Buyer vs. seller: the two ends of right and obligation

Every option contract has a buyer and a seller, and **their P&Ls are strict mirror images** (one's gain is the other's loss — zero-sum, once the premium is counted in):

- **Buyer (Long)**: pays premium → holds the **right** → **max loss = premium** (hard-coded), gain open-ended in direction. The mindset is "buying insurance / buying a lottery ticket."
- **Seller (Short)**: collects premium → bears the **obligation** → **max gain = premium** (hard-coded), risk open-ended in direction (a naked call is theoretically unlimited). The mindset is "being the insurance company collecting premiums," but they must post margin to guarantee performance and watch out for early assignment.

Burn this symmetry in: **"the buyer's risk is limited, the seller's gain is limited."** This is the first principle running through the whole course. Why would a seller take on such an asymmetry? Because over the long run there's the slim sweetener of the variance risk premium — but it's by no means a sure thing (detailed in Stage 8.3).

### ④ Directional view → which to pick

Compress it into a decision table (most intuitive from the **buyer's** side):

- **Bullish** → **buy a call**: bet the underlying rises past K+c.
- **Bearish** → **buy a put**: bet the underlying falls below K−p, or insure a holding.
- **Neutral, leaning won't-rise** → **sell a call**: collect rent, bet it doesn't rally hard (with stock in hand, that's a covered call).
- **Neutral, leaning won't-fall** → **sell a put**: collect rent, bet it doesn't drop hard (with cash set aside, that's a cash-secured put).

These four combinations are the stars of the next stage — **the four basic positions** (Stage 1.3). Before then, carve these two sentences into your mind: **a Call is the right to buy, a Put is the right to sell; the buyer holds the right, the seller bears the obligation.** However complex an options strategy gets, break it all the way down and it's just permutations of these two rights and two sides.

> A quant preview: the "right, not obligation" the buyer holds is, mathematically, a **nonlinear, convex** payoff function — max(S−K,0) or max(K−S,0). It's precisely that "corner" that lets options be replicated and priced by Black-Scholes, and gives market makers Gamma to earn (Stages 3 and 5).
`,

  demo: "rights-explorer",

  analogy: `
Remember the two rights with **two different "coupons."**

- **Call option = a "discount purchase coupon"**: it reads "you may buy this house within a year for $2,000,000." The house rises to $2,500,000 — you **exercise the coupon, buy cheap**, and pocket the difference; the house falls — you **tear up the coupon**, losing only what you paid for it (the premium). — **the right to "buy" at the agreed price.**
- **Put option = a "price-protected buyback coupon"**: it reads "you may sell this house to me within a year for $2,000,000." The house falls to $1,500,000 — you **exercise the coupon, sell high**, dodging the loss; the house rises — you tear up the coupon, losing only what you paid for it. — **the right to "sell" at the agreed price.**

And **the person who sold you the coupon** (the seller), having taken your money for it, takes on the matching **obligation**: when you exercise, they must transact at the coupon price, however unfavorable the market is to them. **The coupon-holder holds the right, the coupon-seller bears the obligation** — that is the entire relationship between option buyer and seller.
`,

  misconceptions: [
    "**\"Bullish means buy, bearish means... anything goes, just pick one.\"** — Direction is only step one. A call is the right to **buy** at the agreed price (a bet on a rise); a put is the right to **sell** at the agreed price (a bet on a fall). First be clear whether you want to \"buy cheap later\" or \"sell high later,\" then choose call or put.",
    "**\"Once I buy a call/put, I'm forced to actually buy or sell the stock at expiry.\"** — Not so. An option is a **right, not an obligation**: abandon it if it's not worthwhile, losing only the premium. And most people **sell to close** in the market before expiry to capture the price difference, never actually taking delivery (detailed in Stages 1.1 and 2.4).",
    "**\"Selling a call/put is just the opposite direction of buying — same risk.\"** — The risk is **wildly asymmetric.** The buyer's max loss = premium (hard-coded); **the seller's gain is capped at the premium, but the risk is far larger** (a naked call is theoretically unlimited), so the seller posts margin and must watch for assignment.",
    "**\"A put can only be used to bet on a drop.\"** — It has a more common use: **insuring a holding.** Hold 100 shares and buy a put on it, and that's a protective put — the put pays out on a drop, you still gain on a rise, all for the cost of that premium (Stages 0.2 and 6.4).",
  ],

  quiz: [
    {
      q: "You expect a stock (now $100) to rise sharply. As a **buyer**, the most direct matching position is?",
      options: ["Buy a put", "Sell a put", "Buy a call", "Sell a call"],
      answer: 2,
      explain: "Bullish → **buy a call**: it gives you the right to **buy** at the agreed price, profiting once the underlying rises past strike + premium, with loss capped at the premium. It's the most direct bullish instrument.",
    },
    {
      q: "The right a \"put option\" grants the **buyer** is?",
      options: ["The right to buy the underlying at the strike", "The right to sell the underlying at the strike", "The obligation to buy the underlying", "The obligation to sell the underlying"],
      answer: 1,
      explain: "A put = the **right** (not obligation) to **sell** the underlying at the strike. The lower the underlying falls, the more valuable this \"sell high\" right becomes; if it rises, you abandon it, losing only the premium.",
    },
    {
      q: "Regarding the **seller** of an option, which is correct?",
      options: ["Holds a right, max loss is the premium", "Bears an obligation, max gain is the premium received, margin required", "Identical risk and reward to the buyer", "Always a sure profit"],
      answer: 1,
      explain: "The seller collects the premium and bears the **obligation**: whenever the buyer exercises, they must perform. **Max gain is capped at the premium**, but the risk is far larger, so the broker freezes **margin**, and the seller must watch for early **assignment.**",
    },
  ],

  further: [
    { label: "Investopedia: Call vs Put Options (a side-by-side comparison)", url: "https://www.investopedia.com/ask/answers/difference-between-call-and-put-option/" },
    { label: "OIC: Options Basics (rights & obligations, buyer & seller)", url: "https://www.optionseducation.org/optionsoverview" },
    { label: "CBOE: Options Education", url: "https://www.cboe.com/education/" },
  ],
};
