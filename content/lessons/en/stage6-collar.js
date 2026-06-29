export default {
  id: "collar",
  stage: 6,
  order: 6,
  title: "The Collar: Financing Protection",
  difficulty: 2,
  prereqs: ["covered-call", "protective-put"],

  oneLiner:
    "A collar = **own 100 shares + buy 1 put + sell 1 call**. It bolts the last two lessons together: use **the premium collected from the sold call** to **fund the bought put's premium**, wrapping the position in a **[floor, ceiling] protective band**. There's a floor below (no fear of a crash) and a cap above (you give up a big rally), often achieved at **near-zero cost** — the classic institutional move for locking in gains.",

  intuition: `
You own **100 shares** of a stock at a cost of **$100/share** ($10,000 total), already sitting on some unrealized gains you want to lock in without selling now. A protective put (Stage 6.4) can give you a floor, but its premium is a real drag. Is there a way to **have someone else pay that premium for you**?

There is — stack a covered call (Stage 6.2) on top of a protective put:

- **Buy** the strike-95 put, paying **$4/share** (the insurance, the floor);
- **Sell** the strike-110 call, collecting **$2/share** (using the call sale to subsidize the put's premium);
- Net cost = 4 − 2 = **$2/share** (one contract = **$200**) — the insurance bill is cut in half.

That's a collar. It's like fitting the stock with a "**collar**" that pins the expiry P&L between two lines:

- **Stock falls to 70**: the put pays out at 95 to support you, so you lose at most (100−95)+2 = $7/share = **−$700**, and further drops don't move it (the **floor**).
- **Stock rises to 130**: you're assigned and sell at 110, so you make at most (110−100)−2 = $8/share = **+$800**, and further rises aren't yours (the **ceiling**).
- **In between (95–110)**: P&L moves with the stock between −700 and +800, with breakeven at **102** (= cost + net paid).

See the collar's tradeoff? **You used "giving up the rally above 110" to pay for "no more losses below 95."** Both ends are boxed in, in exchange for a clear, manageable **protective band**. Tune the call strike so the premium collected exactly equals the put's premium, and you get the fabled **zero-cost collar** — downside protection for free, at the cost of just giving up the upside.

**In this lesson we break the collar into five pieces:**

- **① What it's made of: stock + buying a put + selling a call = three legs in one**
- **② How the call's premium funds the put's premium**
- **③ The protective band: floor, ceiling, and net cost — the three key numbers**
- **④ The zero-cost collar: making the premium exactly cancel out**
- **⑤ When to use a collar, and how to choose vs a standalone covered call / protective put**
`,

  mechanics: `
### ① Structure: three legs in one

A collar stacks three legs (the vertical addition from Stage 2.2):

- **Long 100 shares** (a 45° line, downside open all the way down).
- **Long 1 put** (lifting a floor at a lower level, from Stage 6.4).
- **Short 1 call** (pressing a ceiling at a higher level, from Stage 6.2).

Add the three and you get a kinked line: **"a 45° ramp in the middle, shaved flat into a floor on the left by the put, and shaved flat into a ceiling on the right by the call"** — a shape like a **staircase sealed at both ends**. It's essentially a fusion of "**protective put + covered call**": the protective put provides the floor below, the covered call provides the cap on the right, and the rent the covered call collects goes exactly to paying the protective put's premium.

### ② The call funds the put

The most elegant thing about a collar is that **the two option legs' cash flows offset each other**:

$$net cost (per share) = put premium − call premium
$$net cash flow = paid (debit) if the put is pricier; collected (credit) if the call is pricier

In the example: the put costs 4, the call collects 2, so you **net-pay $2/share** — you bought downside protection for "half-price insurance." If you're willing to push the call strike a bit lower (say sell 107 instead of 110), you collect more premium and the net cost gets closer to 0, but the ceiling is lower too (you give up more upside). **It's a scale: the more upside you're willing to give up, the cheaper the downside insurance you can get.**

### ③ The protective band: three key numbers (per share; dollar amounts ×100)

Let entry cost entry=100, long put Kp=95, short call Kc=110, net cost = put 4 − call 2 = 2:

- **Max loss (the floor)** = (entry − Kp) + net cost = (100−95)+2 = $7/share = **−$700/contract**. When the expiry price ≤ Kp, the put supports you and the loss is capped.
- **Max profit (the ceiling)** = (Kc − entry) − net cost = (110−100)−2 = $8/share = **+$800/contract**. When the expiry price ≥ Kc, you're assigned and sell, and the profit is capped.
- **Breakeven** = entry + net cost = 100 + 2 = **$102** (for a net-credit collar, it would be = entry − net collected).
- **Protective band** = P&L moves linearly with the stock between **[Kp, Kc] = [95, 110]**; outside the band, both ends are shaved flat.

> One line to remember: **a collar pins the position into [floor, ceiling].** Max loss = the drop from cost down to the put's strike + net cost; max profit = the rise up to the call's strike − net cost. The three numbers and that protective band — drag Kp and Kc in the demo on the right to see them live.

### ④ The zero-cost collar

When you **adjust the call strike (or the put strike) so the two premiums are equal**, the net cost = 0, and you have a **zero-cost collar**:

- You install downside protection **without spending a cent** (aside from fees) — the premium is fully paid by the call sale.
- The price is that the ceiling is fixed: upside room is traded for the floor below.
- Institutions and executives often use it to **lock in a large stock gain** (especially restricted shares they can't easily sell outright), guarding against a crash while deferring the sale. This is what "near-free protection" really means — not that there's no cost, but that the cost has **shifted from cash to forgone upside.**

Note: zero-cost is not no-cost. You still **give up the entire gain above Kc** and lock yourself into a range. If the stock then doubles, you'll be **left behind** just like with a covered call.

### ⑤ When to use it, how to choose

**A collar fits when:**

- You have **unrealized gains to lock in** and fear a short-term drawdown, but for tax/lockup/long-term reasons **don't want or can't sell now.**
- You're willing to **give up the big upside** in exchange for **cheap or even free** downside insurance.
- You want a **predetermined worst and best case** so you can sleep soundly.

**The tradeoff versus single-leg strategies:**

- Just want to **collect rent, not too worried about a drop** → **covered call** (Stage 6.2, sell a call only, no protection bought).
- Just want **protection, unwilling to give up the upside** → **protective put** (Stage 6.4, buy a put only, pay the premium yourself).
- Want **protection + a lower premium + can accept a cap** → **collar** (this lesson).

Think of a collar as "**using upside room to buy downside peace of mind, while putting up as little cash as possible.**" It won't make you rich (the upside is capped), but it can guarantee that one crash doesn't swallow the profit you've already made — for a position you've **already won on and just want to keep**, this is often exactly the shape you want.
`,

  demo: "collar",

  analogy: `
A collar is like **getting a "free insurance + fixed-price pre-sale" bundle on a house that's already appreciated.**

You bought the house at $1,000,000, it's risen, and you want to lock in the profit but don't want to (or can't) sell yet.

- First you pay **$40,000** for insurance: **someone covers the part where the price drops below $950,000** (this is buying the put, the floor).
- At the same time you list the house for a **$1,100,000 fixed-price pre-sale**, collecting a **$20,000 deposit** from a buyer (this is selling the call, the ceiling).
- Netting out, the **insurance costs only $20,000** — the pre-sale deposit paid half the premium for you.

So your outcome is pinned into a range: the price craters to $700,000, insurance pays out, and you lose at most (100−95)+2 = $70,000; the price rises to $1,500,000, the buyer buys at $1,100,000, and you make at most (110−100)−2 = $80,000. **Floor below, cap above.**

If you set the pre-sale price so "the deposit exactly equals the premium," it becomes a **zero-cost collar**: you put up no premium and get downside protection free — at the price that if the market moons, you can only sell at $1,100,000.

This is exactly "**using forgone upside to fund downside peace of mind**": it won't make you rich overnight, but it can guarantee that one property-market winter doesn't evaporate the profit you've already earned.
`,

  misconceptions: [
    "**\"A zero-cost collar is completely free protection.\"** — No cash out of pocket, but **the cost is giving up the entire gain above the call's strike** and locking yourself into a range. The cost shifted from \"paying cash\" to \"forgoing upside\" — there's no truly free insurance.",
    "**\"A collar lets me have both a floor and unlimited upside.\"** — No. The sold call nails the upside shut at the **ceiling** (Kc). A collar is a \"floor below, cap above\" protective band; to keep unlimited upside, don't sell the call — use a plain protective put (Stage 6.4) instead, but pay the full premium yourself.",
    "**\"A collar is more aggressive and riskier than a covered call.\"** — Backwards. A collar adds **a bought put** on top of a covered call, capping the downside too — it's a **more conservative** protective structure. A covered call has only the thin cushion of a single premium and can't stop a big drop; a collar has a genuine floor.",
    "**\"Since both ends are capped, a collar is pointless.\"** — Its point is exactly to \"**box in the worst and best cases**\": it fits positions with unrealized gains you want to keep but can't easily sell (e.g. restricted shares, deferred taxes). Trading forgone upside for cheap or free insurance is a common institutional way to lock in gains.",
    "**\"The collar's put and call strikes can be picked any old way and it's the same.\"** — The strikes decide the **floor height, the ceiling's distance, and the net cost**: the lower you press the call, the more premium you collect and the lower the net cost, but the lower the ceiling too (more upside given up). It's a scale to tune by \"how much upside you'll give up for how much protection\" (Stage 1.5).",
  ],

  quiz: [
    {
      q: "Collar: hold 100 shares at 100, buy a Kp=95 put paying 4, sell a Kc=110 call collecting 2 (net cost 2). What is this combo's **max loss** (per contract)?",
      options: ["$200", "$500", "$700", "Theoretically unlimited"],
      answer: 2,
      explain: "Max loss = (cost − put strike + net cost) × 100 = (100−95+2) × 100 = **$700**, occurring when the expiry price ≤95. The put supports you at 95, capping the loss — further drops don't lose more.",
    },
    {
      q: "For that same collar (cost 100, put 95, call 110, net cost 2), what are the **max profit** and **breakeven**?",
      options: [
        "Max profit $1,000; breakeven 110",
        "Max profit $800; breakeven 102",
        "Max profit unlimited; breakeven 100",
        "Max profit $800; breakeven 98",
      ],
      answer: 1,
      explain: "Max profit = (call strike − cost − net cost) × 100 = (110−100−2) × 100 = **$800** (expiry price ≥110, assigned and sold); breakeven = cost + net cost = 100 + 2 = **102**. The P&L is pinned within the [95,110] protective band.",
    },
    {
      q: "How is a \"zero-cost collar\" achieved?",
      options: [
        "Buy the put and buy the call, both for free",
        "Adjust the strikes so the premium collected from the sold call exactly equals the premium paid for the bought put, net cost ≈0",
        "Just hold the stock, with no options at all",
        "Sell a put to collect a premium",
      ],
      answer: 1,
      explain: "A zero-cost collar = **making the sold call's premium exactly offset the bought put's premium**, net cash out ≈0. You put up no premium, at the cost of the upside being nailed shut at the ceiling (the call's strike), giving up the big rally. Zero-cost ≠ no-cost.",
    },
    {
      q: "Which situation is **best suited** to a collar (rather than a plain covered call or protective put)?",
      options: [
        "You just want to collect rent and aren't worried about a drop",
        "You can't bear to give up any upside and only want downside protection",
        "You have a large unrealized gain to lock in, fear a short-term drawdown, don't want to sell now, and are willing to give up the rally for cheap insurance",
        "You're bearish on the stock and want to go purely short",
      ],
      answer: 2,
      explain: "A collar = protective put + covered call, best suited to positions with **unrealized gains you want to keep but can't easily sell**: use the call sale to fund the put's premium, boxing in the worst and best cases. Just want rent → a covered call (Stage 6.2); unwilling to give up upside → a protective put (Stage 6.4, but pay the full premium yourself).",
    },
  ],

  further: [
    { label: "Investopedia: Collar", url: "https://www.investopedia.com/terms/c/collar.asp" },
    { label: "Investopedia: Zero-Cost Collar", url: "https://www.investopedia.com/terms/z/zerocostcollar.asp" },
    { label: "Options Industry Council (OIC): Collar strategy", url: "https://www.optionseducation.org/strategies/all-strategies/collar" },
  ],
};
