export default {
  id: "why-options",
  stage: 0,
  order: 2,
  title: "Why Options: Insurance, Leverage & Optionality",
  difficulty: 1,
  prereqs: ["derivative-intro"],

  oneLiner:
    "Options were invented to do three things: **insure a holding**, **bet big with a little money**, and **collect rent by selling premium**. The deeper thread tying all three together is **optionality — an asymmetric payoff with limited loss and open-ended upside.**",

  intuition: `
Last lesson (Stage 0.1) we said a derivative is "the shadow of a price," and an option is the kind that **hands you a right without an obligation.** This lesson answers a more down-to-earth question: **why does anyone actually need it?**

The answer is three motives **any ordinary person can grasp in a second.** We'll work them all on the same stock, trading at **$100**.

**① Insurance — buy your stock a "decline policy."**
You hold 100 shares ($10,000 of stock), fear a drop but don't want to sell. You spend **$3/share** (one contract is 100 shares, so **$300 total**) to buy a put with a "strike of $95." It's like putting insurance on the stock: even if it later falls to $70, you have the right to sell at $95, so your **loss is capped at "the $100→$95 leg + the $300 premium."** And if it rises? The insurance expires, you lose that $300 premium, and the stock keeps right on enjoying the gain. **This is exactly a protective put.**

**② Leverage — bet $500 on the upside of $10,000 of stock.**
You're bullish but don't want to put up $10,000 for 100 shares. You spend **$5/share ($500 total)** on a call with a "strike of $105." If it rises to 130, you net $20/share — **$2,000 a contract** — turning $500 into a **4x** gain; buying 100 shares would have made only 30%. And if you're wrong? You lose at most that **$500** — the downside is sealed off.

**③ Rent — be "the one selling the insurance" and pocket the premium up front.**
Flip it around: you can also **be the seller.** Sell a put with a "strike of $95" and collect **$3/share = $300** in premium up front. As long as the stock hasn't broken below $95 by expiry, that $300 is yours free and clear; if it does break below, you're obligated to take delivery at $95. **The seller earns "someone else's premium," but takes on the obligation and must post margin** (Stages 0.3 and 0.4 detail seller risk).

Behind all three motives sits **one deeper structure — optionality**: the buyer pays a certain small sum (the premium) in exchange for an asymmetry that is "**capped when things go badly, open-ended when they go well.**" That asymmetry is what fundamentally separates options from stocks and futures.

**In this lesson we break "why options" into four pieces:**

- **① Insurance/hedging: how a put guards your holding**
- **② Leverage/a small bet on a big move: call vs. buying 100 shares, with the capital and return worked out**
- **③ Rent/the seller collecting premium: pocketing the premium (and its risk)**
- **④ Optionality: the deep idea of "asymmetric payoff" that ties all three together**
`,

  mechanics: `
### ① Insurance/hedging: a put = decline insurance on a holding

You hold 100 shares at a cost of $100 and fear a pullback. Buy one put with strike K=95, premium p=3 (**remember ×100: $300 a contract**). Stack it on top of the stock, and at expiry:

- **Falls to 70**: the stock loses $30/share; but the put lets you sell at 95, recovering (95−70)=25, offsetting most of it. Net loss ≈ (100−95) + 3 = **$8/share**, with the combined position capped at **−$800** — whereas the stock alone would lose $3,000.
- **Rises to 120**: the insurance went unused, the put expires, you lose the $3 premium; the stock makes $20. Net gain **$17/share.**

See the trick: **the maximum loss is locked down, the upside is barely touched** — at the cost of that premium. That is the essence of a protective put, and professional hedgers use it every day. Express "premium / asset value" as a ratio and you have your **insurance rate**; the farther from the strike and the longer the term, the pricier the insurance.

> In one line: **a put is to a stock what auto insurance is to a car** — pay a little premium routinely, get paid out when disaster strikes. Most of the time "the premium goes down the drain," but what it buys is **peace of mind and a certain floor.**

### ② Leverage/a small bet on a big move: call vs. 100 shares

Same bullish view, two routes compared (underlying $100, three months):

- **Buy 100 shares outright**: put up **$10,000**. Rises to 130 → make $3,000, **+30%**; falls to 70 → lose $3,000, **−30%.** Linear, symmetric.
- **Buy one call** (K=105, c=5, **$500 a contract**): put up only **$500.** Rises to 130 → per share max(130−105,0)−5 = 20, so **$2,000 a contract, +400%**; falls to 70 → the option expires, **lose $500, −100% but capped.**

$$Call P&L at expiry = [max(S − K, 0) − c] × 100
$$where S = price at expiry, K = strike, c = premium (per share)

**The capital efficiency is night and day**: $500 levers exposure to the upside of $10,000 of stock — that's leverage. But leverage cuts both ways; a small drop in the underlying can take the option to zero. The beauty of an option is that this leverage's **downside is sealed off by the premium** — you won't get margin-called and end up owing money the way margined stock can (Stage 1.1 takes this hockey-stick payoff all the way down).

### ③ Rent/the seller collecting premium: pocketing the premium

In the first two sections you were the **buyer.** Now switch sides and become the **seller** — you've become "the one selling insurance."

Sell one put with K=95 and **collect $3/share = $300** in premium up front:

- **At expiry S ≥ 95**: the buyer won't exercise, so **the full $300 is yours.** That's the source of the "rent" in a cash-secured put.
- **At expiry S < 95**: you're assigned and must take delivery at 95. Say it fell to 88 — you take it at 95, an immediate $7 loss, minus the $3 collected, for a **net loss of $4/share = $400.**

**The seller's gain is limited (at most that premium), while the risk is far larger** — which is why the broker freezes margin to back your performance. Why would anyone be the seller? Because over the long run, **option sellers have a statistical edge**: the price the market pays for "insurance" averages slightly more than the risk that actually materializes (this is the variance risk premium, covered in Stage 8.3). But it is **by no means a sure thing** — one black swan can swallow many cycles of collected rent.

### ④ Optionality: the deep idea tying all three together

Step back, and insurance, leverage, and rent are all trading the same thing: **an asymmetric payoff.**

The heart of **optionality** is one sentence: **"loss is limited when things go badly, gain is open-ended when they go well."** Buy an option and you pay a **certain small cost** in exchange for **a truncated downside + an open upside.** Draw that shape on a payoff diagram and you get the signature **kink (hockey stick)**, not the straight line of a stock or future.

Why is this profound? Because the real world is **awash in uncertainty**, and optionality teaches you to **embrace the good side of uncertainty at a limited cost:**

- Starting a company, betting on a new technology, buying deep out-of-the-money tail insurance... all are expressions of optionality — **lose a limited shirt, win a big one.**
- In quant and AI, this "convexity" is central: what a market maker earns on **Gamma** (Stage 5.3) is precisely the edge this **curved payoff** throws off as the price oscillates back and forth.

Burn this seed in: **the entire allure of options is distilled into the word "asymmetry."** Everything later — pricing, the Greeks, strategies — is just the art of measuring and sculpting that asymmetric curve.
`,

  demo: "why-options",

  analogy: `
Think of the three motives as the two ends of a single "**insurance company.**"

- **You as the policyholder (buyer)**: spend a little to buy **peace of mind.** Insure your house against fire (= buying a put on your stock, motive ① insurance); or pay a small deposit to lock in the right to buy a house later, betting it rises (= buying a call, motive ② leverage). **Worst case, you lose that premium/deposit.**
- **You as the insurance company (seller)**: pocket the **premium up front** (motive ③ rent). The vast majority of policies expire with no claim and the money is yours free; but if something big does happen, you **must pay out** — which is why regulators require you to hold reserves (= margin).

For the same option contract, **buyer and seller sit at opposite ends of the table**: one trades a certain small loss for an uncertain big win (optionality); the other trades a certain small win for an uncertain big loss. Understand this "insurance table" and you understand everything in the options world.
`,

  misconceptions: [
    "**\"Buying options is gambling — respectable people don't touch it.\"** — Options were born for **hedging.** Buying a put on 100 shares with strike 95 for $300 of premium is a **decline insurance policy**: even a fall to 70 caps the loss at $800. Institutions use them daily to manage risk — the point is **how you use it**, not the tool itself.",
    "**\"Leverage = borrowing, which means margin calls and blow-ups.\"** — That describes margined stock or short futures. **The leverage in a long option is different**: you use $500 of premium to track the upside of $10,000 of stock, and **lose at most that $500** — never margin-called, never in the red. The downside is **hard-coded** by the premium.",
    "**\"Selling options to collect premium is a sure-thing, sit-back-and-win business.\"** — Dangerously wrong. The seller's **gain is limited and risk far larger**: sell a 95 put for $300, and if it really drops to 70 you must take delivery at 95 for a big loss. Statistically the seller has the small sweetener of the variance risk premium, but **one black swan can swallow many cycles of rent** — which is why margin is required.",
    "**\"Optionality is just a fancy buzzword.\"** — It's the **core idea** of options: embracing the good side of uncertainty at a limited cost. From buying tail insurance, to betting on a startup, to a market maker earning convexity on Gamma — the asymmetry of **\"loss capped, upside open\"** runs through this entire course (Stage 5.3 covers its quantitative version).",
  ],

  quiz: [
    {
      q: "You hold 100 shares at a cost of $100 and buy one put with strike 95, premium $3 (1 contract = 100 shares). At expiry the stock falls to 80. Combining \"stock + put,\" about how much does the position lose?",
      options: ["Lose $2,000", "Lose $800", "Lose $300", "Profit, not a loss"],
      answer: 1,
      explain: "The stock loses $20/share; the put lets you sell at 95, recovering (95−80)=15; net loss $5/share, plus the $3 premium = **$8/share**, ×100 = **lose $800.** The put capped the loss from $2,000 down to $800 — that's insurance at work.",
    },
    {
      q: "Underlying $100. Person A spends $10,000 on 100 shares; person B spends $500 on one call with strike 105, premium 5 (1 contract = 100 shares). It rises to 130 at expiry. Whose **percentage return** is higher?",
      options: ["A, about +30%", "B, about +400%", "The same", "Both lose money"],
      answer: 1,
      explain: "A: (130−100)/100 = **+30%.** B: per share max(130−105,0)−5 = 20, $2,000 a contract against $500 of capital = **+400%.** Leverage amplifies the percentage return, but B's downside is also sealed at −100% ($500).",
    },
    {
      q: "Regarding **selling** one put (collecting $300 of premium), which is correct?",
      options: ["Unlimited gain, limited risk", "Limited gain (at most that premium), far larger risk, margin required", "Identical to buying a put", "Can never lose money"],
      answer: 1,
      explain: "The seller's gain is **capped** at the premium received ($300), but a big drop in the underlying means taking delivery at the strike for a sizable loss, so the broker freezes **margin.** The seller earns \"someone else's premium\" and bears the obligation.",
    },
    {
      q: "What is the most accurate meaning of \"optionality (asymmetric payoff)\"?",
      options: ["A guaranteed sure profit", "An asymmetric shape: limited loss, open-ended upside", "Leverage is always 10x", "Options never expire"],
      answer: 1,
      explain: "The essence of optionality is **\"loss capped when things go badly, gain open when they go well\"** — pay a certain small cost for a truncated downside plus an open upside. This asymmetric curve is what fundamentally separates options from stocks/futures.",
    },
  ],

  further: [
    { label: "Investopedia: Why Trade Options (the uses of options)", url: "https://www.investopedia.com/options-basics-tutorial-4583012" },
    { label: "OIC: Strategies & Concepts (insurance, leverage, income strategies)", url: "https://www.optionseducation.org/strategies" },
    { label: "Nassim Taleb on Optionality / Convexity (an Incerto reading guide)", url: "https://www.fooledbyrandomness.com/" },
  ],
};
