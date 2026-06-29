export default {
  id: "four-positions",
  stage: 1,
  order: 3,
  title: "The Four Basic Positions: Buyer vs Seller",
  difficulty: 1,
  prereqs: ["call-option", "put-option"],

  oneLiner:
    "Multiply **{call/put}** by **{buyer/seller}** and you get the four Lego bricks of the options world: **long call, short call, long put, short put.** Understand this 2×2 and every complex strategy is just an assembly of these.",

  intuition: `
You've already met the two rights — a call (Stage 1.1) is the right to buy, a put (Stage 1.2) is the right to sell. But every contract has **two ends**: whoever **buys** it (holds the right) implies someone who **sells** it (bears the obligation). Cross those two dimensions:

$$(call or put) × (buyer or seller) = four basic positions

And you get a **2×2 table**:

- **Long Call**: pay premium, bet it **rises**, loss capped.
- **Short Call**: collect premium, bet it **won't rally hard**, risk open-ended (a naked sale is theoretically unlimited).
- **Long Put**: pay premium, bet it **falls** (or buy insurance), loss capped.
- **Short Put**: collect premium, bet it **won't drop hard**, effectively a "**promise to take delivery.**"

These four positions are the **smallest building blocks** of every options strategy. A covered call = stock + short call; a bull spread = buy one call + sell another call; an iron condor = a four-legged combination... Break them all the way down and it's permutations of these four. This lesson lays them out together at once, nailing down each one's **view, max gain/loss, premium direction, and who bears the obligation.**

Running through the whole table is one iron law — **buyer and seller are strict mirror images**: the buyer's risk is limited and gain (relatively) open-ended; the seller's gain is limited and risk open-ended. One's payoff diagram is simply the other flipped upside down.

**In this lesson we break "the four positions" into five pieces:**

- **① Two dimensions: direction (call/put) × side (buy/sell)**
- **② Dissecting each of the four positions' payoff and obligation**
- **③ Buyer vs. seller: the mirror symmetry of limited risk ↔ limited gain**
- **④ The dangerous corner: why a short call carries "unlimited" risk**
- **⑤ A short put ≈ a promise to take delivery at a discount**
`,

  mechanics: `
### ① Two dimensions: direction × side

Stop memorizing the four position names by rote — derive them from **two switches:**

- **Direction switch**: are you trading a **call** or a **put**? (decides whether profit happens above or below the underlying)
- **Side switch**: are you the **buyer (Long)** or the **seller (Short)**? (decides whether you pay premium and hold the right, or collect premium and bear the obligation)

Two switches, two settings each, gives exactly 2×2 = four. For any position, ask these two questions first and its character falls right out. Below, with a consistent example — strike **K=100**, premium **$5/share** — we lay out all four bricks (remember the **×100** on every dollar figure).

### ② Dissecting each of the four positions

**Long Call** — pay $5 ($500 a contract)
- View: **bullish ↑**, betting the underlying rises past 105 (= K+c).
- Max gain: **theoretically uncapped** (the higher the underlying, the more you make).
- Max loss: **−$500** (the premium, hard-coded).
- Obligation: none. You hold only the right.

**Short Call** — collect $5 (+$500 a contract)
- View: **won't-rise ↓→**, betting the underlying doesn't rally hard.
- Max gain: **+$500** (the premium received, capped).
- Max loss: **theoretically unlimited** (when naked, the higher the underlying soars, the more you lose).
- Obligation: when the buyer exercises, you must **sell (deliver)** the underlying at 100; margin required, watch for assignment.

**Long Put** — pay $5 ($500 a contract)
- View: **bearish ↓**, betting the underlying falls below 95 (= K−p), or insuring a holding.
- Max gain: **(100−5)×100 = $9,500** (when the underlying falls to 0; sealed by the "zero" floor).
- Max loss: **−$500** (the premium, hard-coded).
- Obligation: none. You hold only the right.

**Short Put** — collect $5 (+$500 a contract)
- View: **won't-fall ↑→**, betting the underlying doesn't drop hard.
- Max gain: **+$500** (the premium received, capped).
- Max loss: **(100−5)×100 = −$9,500** (when the underlying falls to 0, you're forced to take delivery at 100 of a pile of worthless paper).
- Obligation: when the buyer exercises, you must **buy (take delivery of)** the underlying at 100; margin required.

Click the four buttons in the demo on the right to see each position's payoff diagram, max gain/loss, and premium direction in turn, and feel this 2×2 firsthand.

### ③ Buyer vs. seller: mirror symmetry

Pair the four bricks two by two and the symmetry jumps out. **For the same option, buyer and seller P&Ls are strict mirror images** (zero-sum, once you account for the small friction of the premium):

- Long call ↔ short call: one makes money with no cap above, the other loses with no cap above.
- Long put ↔ short put: one profits down to "zero," the other loses down to "zero."

Distill it into one sentence that runs through the whole course: **the buyer — loss limited, gain (relatively) open-ended; the seller — gain limited (capped at the premium), risk open-ended.** The buyer is like "buying insurance / a lottery ticket," the seller like "being the insurance company collecting premiums." Why would a seller take such an asymmetric trade? Because over the long run there's a bit of the variance-risk-premium sweetener (Stage 8.3) — but it's by no means a sure thing; one big move can disgorge years of collected premium.

### ④ The dangerous corner: a short call's "unlimited risk"

Of the four positions, **a short call (naked) is the only one with true "unlimited risk."** The reason is direct: the underlying's price **has no ceiling**, while you've promised to deliver at a fixed strike. The underlying soars from 100 to 300, and you must sell at 100 something worth 300, eating $200/share — in theory, with no limit.

> By contrast: a short put's risk is also large, but **bounded** — the underlying can fall no lower than 0, so the max loss is (K−p)×100. So on this table, the short call is the only cell where the ceiling on risk is truly blown out. That's why a naked short call is rated one of the highest-risk operations, and beginner accounts are often barred from it by brokers.

### ⑤ A short put ≈ a promise to take delivery at a discount

Many people get tangled over "selling a put." Remember a more down-to-earth translation: **selling a put = promising "if it breaks below the strike at expiry, I'll buy it at the strike," and collecting a premium up front for that.**

- If the underlying is above the strike at expiry: the buyer won't exercise, and you **pocket the premium free.**
- If it breaks below the strike: you're **assigned** and take delivery at the strike — but your **effective cost = strike − premium already collected**, like buying at a discount.

If you genuinely wanted to buy this stock at a lower price and had the cash set aside, this is a **cash-secured put**, the front half of the "wheel" strategy (Stage 6.3). So selling a put isn't necessarily a bad thing — the key is: **are you willing, and able, to take delivery of these shares at the strike?** Think that through and the four positions truly click together.
`,

  demo: "four-positions",

  analogy: `
Think of the four positions as **four roles in an insurance market.**

- **Long call = buying a lottery ticket on "a rise"**: spend a little (premium), bet something rallies hard — win and the upside is open, lose and you forfeit only the ticket price.
- **Long put = buying insurance against "a fall"**: spend a little to shield yourself from a decline, with the worst case being the loss of the premium.
- **Short call = selling a "capped-upside" policy**: you collect a premium, but promise "if it spikes, I'll cover the difference" — this is the most dangerous of the four corners, with **no ceiling** on the payout.
- **Short put = selling a "downside-backstop" policy**: you collect a premium, promising "if it breaks below a price, I'll buy it at that price" — the payout is bounded (at most down to zero), and it may even line up perfectly with your wish to "buy at a discount."

**Buyers pay for protection/opportunity; sellers collect for bearing risk.** Four roles, two mirror pairs — that's the entire foundation of the options world.
`,

  misconceptions: [
    "**\"Buying and selling are just opposite directions, with symmetric risk and reward.\"** — Badly wrong. The buyer has **limited loss, open-ended gain**; the seller has **limited gain (capped at the premium), open-ended risk.** The payoff diagrams are mirror images, but the risk is by no means symmetric — this is options' most counterintuitive and most crucial point.",
    "**\"A short put is the same as a short call — both unlimited risk.\"** — Not the same. **A short call (naked) is the one with true unlimited risk** (the underlying has no ceiling); a short put's max loss = (strike − premium)×100, blocked by the \"underlying-to-zero\" floor — it's **bounded.**",
    "**\"Selling a put is a bearish bet.\"** — Backwards. A short put's view is **won't-fall (neutral-to-bullish)**: you bet the underlying doesn't drop hard, and only get assigned if it breaks below. It's essentially \"promise to buy at a discount and collect a premium up front,\" often used for cash-secured puts (Stage 6.3).",
    "**\"The four positions have to be memorized by rote.\"** — Not necessary. Just remember **two switches**: direction (call/put) decides whether you profit above or below the underlying; side (buy/sell) decides whether you pay to hold the right or collect to bear the obligation. Flip the two switches and each position's character surfaces automatically.",
  ],

  quiz: [
    {
      q: "Which position has a **theoretically unlimited maximum loss**?",
      options: ["Long call", "Long put", "Short call (naked)", "Short put"],
      answer: 2,
      explain: "The underlying's price has no ceiling, and a **naked short call** promises to deliver at a fixed strike, so the higher it soars the more you lose → theoretically unlimited. The other three have bounded losses (buyer = premium; short put = K−p when the underlying hits zero).",
    },
    {
      q: "You **sell** one put with strike 100, collecting a premium of 5 (1 contract = 100 shares). At expiry the stock is 120. What is your P&L?",
      options: ["Lose $500", "Make $500", "Make $2,000", "Lose $2,000"],
      answer: 1,
      explain: "At 120, above the strike of 100, the put buyer won't exercise → the option expires worthless and you **pocket the premium received, 5×100 = $500.** That's exactly the short put's \"won't-fall and you win\" outcome.",
    },
    {
      q: "What is the most accurate meaning of \"buyer and seller are strict mirror images\"?",
      options: ["Both can profit for sure", "One side's P&L is exactly the negative of the other's (zero-sum, premium included)", "Both bear identical risk", "The seller always makes more than the buyer"],
      answer: 1,
      explain: "For the same contract, the buyer's gain is the seller's loss and vice versa — the payoff diagram flipped upside down. The buyer has limited loss and open-ended gain; the seller has limited gain and open-ended risk.",
    },
    {
      q: "What is the most fitting practical understanding of \"selling a put\"?",
      options: ["Purely shorting the underlying", "Promising \"if it breaks below the strike at expiry, take delivery at the strike,\" and collecting a premium up front", "A leveraged long position in the underlying", "A risk-free arbitrage"],
      answer: 1,
      explain: "Selling a put = collect premium + bear the obligation \"to buy at the strike when assigned.\" If you wanted to buy at a discount and had the cash set aside, that's a cash-secured put (Stage 6.3), with effective cost = strike − premium already collected.",
    },
  ],

  further: [
    { label: "Investopedia: Long & Short Positions in Options", url: "https://www.investopedia.com/terms/o/option.asp" },
    { label: "OIC: The Basic Strategies (the four basic positions)", url: "https://www.optionseducation.org/strategies" },
    { label: "CBOE: Options Education", url: "https://www.cboe.com/education/" },
  ],
};
