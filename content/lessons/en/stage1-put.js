export default {
  id: "put-option",
  stage: 1,
  order: 2,
  title: "The Put Option: The Right to Sell",
  difficulty: 1,
  prereqs: ["call-put-rights"],

  oneLiner:
    "A put option is a contract that gives you **the right, but not the obligation, to sell at an agreed price**: you pay a premium to lock in the chance of a decline (or to insure stock you already hold); if you're right the gains can be amplified, and if you're wrong the most you lose is that premium.",

  intuition: `
Take that same stock, trading at **$100.** This time your homework tells you it will **fall** over the next three months — maybe earnings look shaky, maybe the whole sector is due for a pullback. Or perhaps you already hold 100 shares and simply fear a drop and want insurance.

A put gives you a clean route. You pay **$4/share** (one contract is 100 shares, so $400 total) for a put with a **strike of $95 expiring in three months.** The contract means: **any time before expiry, you have the right — but no obligation — to sell this stock at $95**, no matter how low it has fallen.

- If the stock **drops to $70**: you sell at $95 — effectively pricing it at 95 — for (95−70)=25 per share, minus your $4 cost, a net **$21/share** — your $4 stake has more than 5x'd.
- If the stock only reaches **$97**: it never broke below $95, the right is useless, you abandon it, and you **lose the full $4** premium.
- If the stock **rises to $130**: you still only lose that $4 — you have no obligation to dump it cheap, which is the whole point of "a right, not an obligation."

See the trick? This is a **mirror** of the call. A call makes money **above** the underlying, its payoff ramping up to the right; a put makes money **below** the underlying, its payoff a **reversed hockey stick** — the 45° downslope on the left is profit, and past the strike it flattens into a horizontal floor (lose at most the premium). Calls and puts (already contrasted in Stage 0.3) are two sides of the same mirror.

**In this lesson we break "buying a put" into five pieces:**

- **① You buy a "right to sell," not an "obligation" — why you can walk away clean when it rises**
- **② One contract = 100 shares: how the contract multiplier turns into money**
- **③ Three outcomes at expiry: exercise in-the-money, expire worthless, the edge case**
- **④ Two uses of a put: a naked bet on a drop vs. insuring a holding**
- **⑤ The P&L formula and breakeven — how far it really has to fall to profit**
`,

  mechanics: `
### ① You buy a "right to sell," not an "obligation"

This is the mirror image of the call's first building block. **The put buyer holds a choice**: at expiry, exercise and sell if it pays (the underlying broke below the strike), and throw it away if it doesn't. You can never be forced to sell below the market price — the worst case is simply "this right went unused," and your loss is limited to the premium you paid.

Symmetrically, **the person who sold you that put** (the seller) took your premium and accepted the matching **obligation**: whenever you exercise, they must buy the stock from you at the strike (take delivery), even if the market has fallen brutally. Buyer risk is limited, seller risk is large — the same asymmetry as the call, just with the direction flipped (Stage 1.3 lines up all four positions side by side).

### ② One contract = 100 shares: the multiplier

Exactly as with the call: option prices are quoted **per share**, but one contract usually represents **100 shares** of the underlying (that's the contract multiplier). So:

- A quote of **4.00** means one contract actually costs **4 × 100 = $400.**
- Every P&L you see is computed per-share, then **×100** (and × the number of contracts you hold).

The formulas below use **per-share** terms so you build intuition first; multiply at the end. Don't forget that ×100.

### ③ Three outcomes at expiry

Let the strike be K=95, the premium p=4, and the underlying at expiry be S:

- **In-the-money (S < K)**: exercising is profitable. At S=70, selling at 95 captures (95−70)=25 of intrinsic value, minus the $4 cost, a net $21. **As long as S is below the strike, you exercise.** (Note: a put is "in-the-money" when the underlying is **below** the strike — the opposite of a call.)
- **Out-of-the-money (S > K)**: exercising would lose money, so you abandon it. At S=97 or S=130, the entire $4 premium is gone. The option becomes a worthless slip of paper — **options expire to zero.**
- **The edge case (S ≈ K)**: whether it's worth exercising depends on how far you are from breakeven (see ⑤).

> The key point: finishing "in-the-money" is not the same as "making money." At S=93, K=95 you would indeed exercise (recovering $2 of intrinsic value), but you paid $4 up front, so you're **down $2 net.** In-the-money only means "worth exercising" — it's still a premium short of breaking even.

### ④ Two uses of a put: a naked bet on a drop vs. insurance

This is the extra — and most practical — layer a put has over a call: **the same put can be an offensive weapon or a defensive shield.**

- **Buying a put naked (a directional bet)**: you don't hold the stock; you're purely betting it falls. The harder it drops, the more you make — it's the "limited-risk version" of shorting. It's safer than shorting via borrowed shares, because the worst case is losing the premium; you can't be squeezed into a blow-up by an unlimited rise.
- **A protective put (insuring a holding)**: you **already hold 100 shares** and buy a put as an "insurance policy" on top. When the stock crashes, the stock's loss is offset by the put's gain; when the stock rises, you still enjoy the upside, at the cost only of that premium (like auto insurance — if you never claim, you simply spent the premium). This is the go-to defensive technique for institutions and long-term holders, and there's a whole lesson on it later (Stage 6.4, protective puts).

Remember this: **a put isn't only about "betting on a drop" — it's also about "insuring against a drop."** Many people buy puts not because they're praying for a crash, but so they can sleep at night.

### ⑤ The P&L formula and breakeven

Wrap those three outcomes into one formula (per share):

$$P&L at expiry = max(K − S, 0) − p
$$where S = underlying at expiry, K = strike, p = premium

Notice the difference from the call's max(S−K,0)−c: **the put swaps the places of S and K** — intrinsic value only appears when S is below K. From it come three numbers you must memorize:

- **Max loss = p** (the premium), occurring whenever S ≥ K.
- **Breakeven BE = K − p**: the stock must fall below "strike − premium" before you cross from loss to profit. In the example that's 95 − 4 = **$91** — note that merely reaching $95 (the strike) isn't enough; you need $91 to truly break even. (Contrast the call's BE = K + c — another mirror pair.)
- **Max profit = K − p** (per share), occurring when S falls to 0 — **a put's upside is not unlimited**, because a stock can fall no lower than 0. In the example, the most you make per share is 95−4=91, so **$9,100** a contract. This is a subtle difference from the call: a call's upside is uncapped, while a put's profit is blocked by the "stock-to-zero" floor.

Those three numbers, together with that reversed-hook payoff, are the starting point for evaluating any long put. This diagram's sensitivity to a falling price is a **negative** Delta (Stage 5.2) — the underlying falls, the put rises, which is why market makers use it to hedge long exposure.
`,

  demo: "put-payoff",

  analogy: `
Buying a put is like **putting "price-protected buyback" insurance on your house.**

You own a home worth **$2,000,000** but worry the property market is about to cool. You pay a **$50,000 premium** for the right to "sell the home for $2,000,000 within a year."

- A year later the home falls to **$1,500,000**: you exercise the right, still selling at $2,000,000 (or receiving an equivalent payout), dodging a $500,000 loss; minus the $50,000 premium, you **net a saving of $450,000.**
- The home rises to **$2,500,000**: of course you won't sell at $2,000,000 — you abandon the insurance, and your loss is **capped at the $50,000 premium** — the home is still yours, still enjoying the gain.

That's exactly a put option: **premium = premium**, **protected price = strike**, **one-year window = expiration.** Small cost, limited risk, yet it backstops the downside of your asset — which is also the essence of a protective put. If you buy this coupon **without** owning the home, that's a pure bet on a falling market (a naked put).
`,

  misconceptions: [
    "**\"Once I buy a put, I have to hold it to expiry — or even actually sell the stock — to realize a profit.\"** — Not at all. The vast majority of traders **sell to close** the put in the secondary market before expiry, capturing the change in the premium — they never actually exercise and take delivery of stock.",
    "**\"A put's profit is unlimited, just like a call's.\"** — Wrong. A put's **max profit = strike − premium** (per share), because the underlying can fall no lower than 0. A call's upside is uncapped, but a put is blocked by the \"zero\" floor — a key asymmetry between the two.",
    "**\"Put options carry unlimited risk.\"** — Backwards. The **buyer's** max loss is exactly the premium — fixed. The so-called unlimited risk belongs to other positions; the naked put seller's risk is also large (forced to take delivery high), but as the put buyer, your downside is capped.",
    "**\"A put can only be used to bet on a crash.\"** — Its more common identity is **insurance.** Hold 100 shares and buy a put on it, and that's a protective put — the put pays out on a drop, you still gain on a rise, all for the cost of that premium (detailed in Stage 6.4). Many people buy puts for peace of mind, not in hopes of a meltdown.",
  ],

  quiz: [
    {
      q: "You buy a put with a strike of 50 for $3 (1 contract = 100 shares). At expiry the stock is 44. What is your net P&L on the contract?",
      options: ["Lose $300", "Make $300", "Make $600", "Make $900"],
      answer: 1,
      explain: "Per-share P&L = max(50−44,0) − 3 = 6 − 3 = $3; ×100 = **make $300.** A put's intrinsic value is max(strike − underlying, 0); remember to subtract the premium first, then ×100.",
    },
    {
      q: "For that same strike-50 put costing $3, where is the **breakeven**?",
      options: ["50", "53", "47", "44"],
      answer: 2,
      explain: "A long put's breakeven = strike − premium = 50 − 3 = **47.** The stock must fall below 47 for this long put to cross from loss into profit (contrast a long call's strike + premium).",
    },
    {
      q: "Which statement about a long put's **maximum profit** is correct?",
      options: ["Unlimited", "Equal to the premium", "Equal to (strike − premium) × 100, occurring when the underlying falls to 0", "Equal to strike × 100"],
      answer: 2,
      explain: "The underlying can fall no lower than 0, at which point you make (strike − premium) per share. In the example, with K=50, p=3, max profit = (50−3)×100 = **$4,700.** A put's upside is sealed by the \"zero\" floor — the key difference from a call.",
    },
    {
      q: "You hold 100 shares of a stock and also buy one put on that stock. What best describes this combination?",
      options: ["A pure bet on a price decline", "Insuring a holding (a protective put)", "Leverage to amplify the upside", "A risk-free arbitrage"],
      answer: 1,
      explain: "Stock + long put = a **protective put.** On a drop the put gains, offsetting the stock's loss; on a rise you still enjoy the stock's upside, at the cost of that premium. It's the classic way to insure a holding (Stage 6.4).",
    },
  ],

  further: [
    { label: "Investopedia: Put Option (a full walkthrough)", url: "https://www.investopedia.com/terms/p/putoption.asp" },
    { label: "Options Industry Council (OIC): free options education", url: "https://www.optionseducation.org/" },
    { label: "CBOE: Options Basics", url: "https://www.cboe.com/education/" },
  ],
};
