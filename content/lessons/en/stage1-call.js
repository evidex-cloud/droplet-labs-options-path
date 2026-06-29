export default {
  id: "call-option",
  stage: 1,
  order: 1,
  title: "The Call Option: The Right to Buy",
  difficulty: 1,
  prereqs: ["call-put-rights"],

  oneLiner:
    "A call option is a contract that gives you **the right, but not the obligation, to buy at an agreed price**: you pay a premium to lock in the upside; if you're right the gains can be amplified, and if you're wrong the most you lose is that premium.",

  intuition: `
Suppose a stock trades at **$100**. After doing your homework you think it will rise over the next three months, but two things hold you back: buying 100 shares ties up $10,000 up front, and if you're wrong and the stock halves, you eat half of that loss.

Options offer a third path. You pay **$5/share** (one contract is 100 shares, so $500 total) for a call option with a **strike of $105 expiring in three months**. The contract means: **any time before expiry, you have the right — but no obligation — to buy this stock at $105**, no matter how high it has climbed.

- If the stock rises to **$130**: you exercise your right to buy at $105, and against a $130 market that's $25/share, minus your $5 cost = a net **$20/share** — your $5 stake has nearly 4x'd.
- If the stock only reaches **$103**: it never crossed $105, the right is useless, you walk away, and you **lose the full $5** premium.
- If the stock **drops to $70**: you still only lose that $5 — you have no obligation to buy, which is the whole point of "a right, not an obligation."

See the asymmetry? With **$500** of capped risk you bet on the upside of **$10,000** worth of stock. **Loss is nailed down, upside is wide open** — that is what makes buying calls so appealing, and also what makes it so easy to misuse.

**In this lesson we break "buying a call" into five pieces:**

- **① You buy a "right," not an "obligation" — why you can always walk away**
- **② One contract = 100 shares: how the multiplier turns into money**
- **③ Three outcomes at expiry: exercise in-the-money, expire worthless, the edge case**
- **④ Leverage and asymmetry: why $5 can move $100 of stock**
- **⑤ The P&L formula and breakeven — how high it really has to go to profit**
`,

  mechanics: `
### ① You buy a "right," not an "obligation"

This is the first building block of every option. **The call buyer holds a choice**: at expiry you exercise if it pays, and throw it away if it doesn't. You can never be forced to buy above the market price — the worst case is simply "this right went unused," and your loss is limited to the premium you paid.

Symmetrically, **the person who sold you that call** (the seller) took your premium and accepted the matching **obligation**: if you exercise, they must hand over the stock at the strike, even if the market has rocketed away. Buyer risk is limited, seller risk is open-ended (when naked). That asymmetry runs through the entire options world (Stage 1.3 lines up all four positions side by side).

### ② One contract = 100 shares: the multiplier

Option prices are quoted **per share**, but one contract usually represents **100 shares** of the underlying (that's the contract multiplier). So:

- A quote of **5.00** means one contract actually costs **5 × 100 = $500**.
- Every P&L you see is computed per-share, then **×100** (and × the number of contracts you hold).

Burn that ×100 into memory, or you'll be off by a factor of 100. The formulas below use **per-share** terms so you build intuition first; multiply at the end.

### ③ Three outcomes at expiry

Let the strike be K=105, the premium c=5, and the underlying at expiry be S:

- **In-the-money (S > K)**: exercising is profitable. At S=130, exercising captures (130−105)=25 of intrinsic value, minus the $5 cost, a net $20. **As long as S is above the strike, you exercise.**
- **Out-of-the-money (S < K)**: exercising would lose money, so you abandon it. At S=103 or S=70, the entire $5 premium is gone. The option becomes a worthless slip of paper — the biggest difference from stock: **options expire to zero.**
- **The edge case (S ≈ K)**: whether it's worth exercising depends on how far you are from breakeven (see ⑤).

> The key point: finishing "in-the-money" is not the same as "making money." At S=107 you would indeed exercise (recovering $2 of intrinsic value), but you paid $5 up front, so you're **down $3 net**. In-the-money only means "worth exercising" — it's still a premium short of breaking even.

### ④ Leverage and asymmetry

Why can $5 move $100 of stock? Because you didn't buy the stock itself — you bought **the right to a slice of its future gain**. When the stock rises 10% (100→110), your call might go from 5 to 8, 9, or even double — **the percentage return is amplified**, and that's leverage.

But leverage cuts both ways: a 10% drop can send your call straight to zero (−100%). The beauty of an option is that this downside is **capped by the premium** — you won't get margin-called and wiped out into debt the way leveraged stock can. The call buyer's maximum loss is forever fixed at the premium you paid.

That "limited loss, open-ended gain" shape draws a signature **hockey stick** on the payoff diagram: a flat floor on the left (lose at most the premium), then a 45° climb past the strike. The demo below lets you drag it around.

### ⑤ The P&L formula and breakeven

Wrap those three outcomes into one formula (per share):

$$P&L at expiry = max(S − K, 0) − c
$$where S = underlying at expiry, K = strike, c = premium

From it come three numbers you must memorize:

- **Max loss = c** (the premium), occurring whenever S ≤ K.
- **Breakeven BE = K + c**: the stock must rise past "strike + premium" before you cross from loss to profit. In the example that's 105 + 5 = **$110** — note that merely reaching $105 (the strike) isn't enough; you need $110 to truly break even.
- **Max profit = theoretically unlimited** (the higher S goes, the more you make).

Those three numbers, together with that hockey-stick payoff, are the starting point for evaluating any long call. Later you'll see that swapping "at expiry" for "any moment" adds a layer of time value, and its sensitivity to price is Delta (Stage 5.2).
`,

  demo: "call-payoff",

  analogy: `
Buying a call is like **putting down a small deposit to lock in a price on a house**.

You like a home priced at **$2,000,000** but want to wait. You give the developer a **$50,000 deposit** for the right to buy it within a year at $2,000,000.

- A year later the home is worth **$2,500,000**: you exercise the right, buy at $2,000,000, and net $500,000 minus the $50,000 deposit = **$450,000**.
- The home drops to **$1,500,000**: you forfeit the deposit, and your loss is **capped at $50,000** — no one can force you to pay $2,000,000 for a home now worth $1,500,000.

That's exactly a call option: **deposit = premium**, **agreed price = strike**, **one-year window = expiration**. Small cost, limited risk, yet a bet on the upside of a large asset.
`,

  misconceptions: [
    "**\"Once I buy a call, I have to hold it to expiry to realize a profit.\"** — Not at all. The vast majority of traders **sell to close** in the secondary market before expiry, capturing the change in the premium — they never actually exercise and put up cash to take delivery of stock.",
    "**\"As long as it finishes in-the-money, I make money.\"** — Wrong. It also has to rise past the **breakeven (strike + premium)** to truly profit. With S=107, K=105, cost 5, exercising recovers $2 but you're still down $3 net.",
    "**\"Call options carry unlimited risk.\"** — Backwards. The **buyer's** max loss is exactly the premium — fixed. The so-called unlimited risk belongs to the **naked call seller**, who must deliver at a low price while the stock soars.",
    "**\"A lower-strike call is always the better deal.\"** — No. The lower the strike the deeper in-the-money and the pricier the premium; a higher strike is cheaper but more likely to expire worthless. Which to pick depends on your conviction and your read on value (Stage 1.5 covers in- vs out-of-the-money).",
  ],

  quiz: [
    {
      q: "You buy a call with a strike of 50 for $4 (1 contract = 100 shares). At expiry the stock is 58. What is your net P&L on the contract?",
      options: ["Lose $400", "Make $400", "Make $800", "Make $1400"],
      answer: 1,
      explain: "Per-share P&L = max(58−50,0) − 4 = 8 − 4 = $4; ×100 = **make $400**. Remember to subtract the premium first, and don't forget the ×100.",
    },
    {
      q: "For that same strike-50 call costing $4, where is the **breakeven**?",
      options: ["50", "46", "54", "58"],
      answer: 2,
      explain: "Breakeven = strike + premium = 50 + 4 = **54**. The stock must rise past 54 for this long call to cross from loss into profit.",
    },
    {
      q: "Which statement about a long call's maximum loss is correct?",
      options: ["Unlimited", "Equal to strike × 100", "Equal to the premium paid", "Equal to the stock falling to 0"],
      answer: 2,
      explain: "The buyer's max loss is forever capped at the **premium paid**. No matter how far the stock falls, you simply abandon the right and lose that premium.",
    },
    {
      q: "Why is a long call said to have \"leverage\"?",
      options: ["Because you must borrow to buy it", "Because a small premium controls the upside of a much larger position, amplifying the percentage return", "Because the broker forces margin on you", "Because it can never lose"],
      answer: 1,
      explain: "A $5 premium controls $100 of stock exposure, so a small move in the underlying can move the option a lot — **the percentage return is amplified**, while the downside is capped at the premium.",
    },
  ],

  further: [
    { label: "Investopedia: Call Option (a full walkthrough)", url: "https://www.investopedia.com/terms/c/calloption.asp" },
    { label: "Options Industry Council (OIC): free options education", url: "https://www.optionseducation.org/" },
    { label: "CBOE: Options Basics", url: "https://www.cboe.com/education/" },
  ],
};
