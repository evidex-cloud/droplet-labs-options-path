export default {
  id: "protective-put",
  stage: 6,
  order: 4,
  title: "Protective Puts: Insuring a Position",
  difficulty: 2,
  prereqs: ["put-option"],

  oneLiner:
    "A protective put = **own 100 shares + buy 1 put**. It's insurance in the literal sense: the put installs a **floor** under your position, so no matter how hard the stock falls, your loss is capped. You still enjoy the stock's upside; the only cost is that premium — like a car-insurance premium, a fixed, known \"cost of holding.\"",

  intuition: `
You own **100 shares** of a stock at a cost of **$100/share** ($10,000 total). You like it for the long term and can't bear to sell, but you fear a short-term crash (earnings, a black swan) could swallow your profit or even your principal. This is exactly when a protective put steps in.

You pay **$4/share** (one contract = **$400**) for a **put, strike 95, one month to expiry**. That put is the **insurance policy** on your position:

- **Stock falls to 70**: the stock loses $30/share, but your put grants you the right to "sell at 95," recovering (95−70)=25/share. Adding the two sides, your net loss is only (100−95)+4 = $9/share — **at most $900 per contract**, capped here. Even if the stock fell to 0, your loss wouldn't grow.
- **Stock rises to 130**: the put expires worthless (you won't sell at 95 cheaply), you lose that $4 premium, but the stock makes $30/share. Net gain = 30−4 = **$26/share** — **the upside is captured almost in full, minus one premium.**

See the trick? This is the same "insurance" from Stage 0.2: **you bought a policy with a deductible on your position.** The put's strike is your "**floor sale price**" — the part of the drop below it is paid out by the put; the premium is the fixed cost you pay for that peace of mind — it **drags** on your return (that's the cost of insurance), but in exchange "**the worst you can lose is written down in advance.**"

**In this lesson we break the protective put into five pieces:**

- **① What it's made of: 100 shares + buying 1 put = installing a floor**
- **② Three key numbers: the floor (max loss), breakeven, the premium drag on the upside**
- **③ Why it's "insurance with a deductible" (callback Stage 0.2)**
- **④ How to pick the strike: a lower deductible costs more**
- **⑤ When the insurance is worth buying, and how to amortize its cost**
`,

  mechanics: `
### ① Structure: installing a floor

A protective put has two legs (the stacking from Stage 2.2):

- **Long 100 shares** (a 45° upward-sloping line, with downside risk open all the way to 0).
- **Long 1 put** (lifting a floor at a lower level).

Add the two legs vertically and you get a kinked line that's **"shaved flat into a floor on the left, and rises 45° with the stock on the right (but with the whole thing shifted down by one premium)."** Its shape actually looks a lot like a **long call** — and that's no coincidence: stock + long put ≈ long call (set by put-call parity, Stage 3.2). Intuitively, you've remade an "unlimited-downside stock" into an asset with "a floored downside and an open upside."

### ② Three key numbers (per share; dollar amounts ×100)

Let entry cost entry=100, long-put strike K=95, premium paid p=4:

- **Max loss (the floor)** = (entry − K) + p = (100−95)+4 = $9/share = **−$900/contract**. It occurs when the expiry price ≤ K: the stock's loss down to the strike (entry−K), plus the premium p, is the entirety of what you can lose — **further drops don't lose more.**
- **Breakeven** = entry + p = 100 + 4 = **$104**. The premium lifts your recovery line: the stock has to rise past 104 before you net a gain (the insurance drag made visible).
- **Max profit** = theoretically unlimited. Past breakeven, the combo rises with the stock uncapped, just making **one premium p less** than plain stock.

> One line to remember: **a protective put shaves the downside into a floor (max loss = the drop from cost down to the strike + the premium), and gives up only one premium on the upside.** Drag the put's strike in the demo on the right and watch the floor rise and fall with it.

### ③ It is "insurance with a deductible"

Callback Stage 0.2's insurance intuition, and the correspondences line up one for one:

- **Insured asset** = your 100 shares.
- **Coverage trigger / floor sale price** = the put's **strike K** (only the part below it is paid out).
- **Deductible** = the segment from your cost down to the strike (entry − K). The $5 from 100 to 95 is **not paid out** by the put and is yours to absorb — like a car-insurance deductible, you eat the small dings yourself.
- **Premium** = the premium p.

So **the higher the strike (the closer to spot), the smaller the deductible and the fuller the coverage, but the pricier the premium**; the lower the strike, the bigger the deductible — it only covers a disaster — but it's cheap. That's the eternal insurance tradeoff: the fuller the coverage, the more it costs.

### ④ How to pick the strike: deductible vs premium

Insuring the same $100 position, choosing different strikes is dialing the "deductible":

- **Near the money (K=98)**: a deductible of only $2, near-full protection, but a pricey premium (the fattest time value). Fits "very afraid of a drop, willing to pay a high premium."
- **Slightly OTM (K=90–95)**: a self-borne deductible, a moderate premium, blocking "a real drop" rather than small wiggles. The most common protection choice.
- **Deep OTM (K=80)**: a big deductible, a cheap premium, paying out only in a **crash** — this is really close to the idea of **tail hedging** (Stage 8.4): spend a little to buy a "catastrophe policy."

There's a tradeoff on expiry too: near-dated is cheap but its coverage window is short and needs constant renewal (Theta drag accumulates); far-dated is a pricier one-time cost but is hassle-free, and the premium per unit of time is often a better deal.

### ⑤ When to buy it, and how to amortize the cost

**Worth buying when:**

- You're **bullish for the long term and unwilling to sell** this stock, but have a clear short-term downside worry (earnings, a macro event, or a big unrealized gain you want to lock in).
- You want to give your portfolio a **predetermined worst case** in exchange for being able to hold on and sleep at night.

**The cost to face squarely:**

- The premium is a **real drag**. If you buy full coverage every year and never claim, your long-term return is noticeably eroded by premiums — insurance was never meant to "make money," but to "**cap bad outcomes.**"
- A common way to **lower the cost** is to **sell a call to fund this put's premium**, letting part of the upside subsidize the insurance — which leads to the **collar** (Stage 6.6), a "near-zero-cost" protective structure.

Think of a protective put as "insuring the position you care about most, with a deductible": **it won't make you richer, but it can guarantee that one particular crash doesn't knock you out** — and surviving in the market is often more important than how much you make on any single trade (Stage 8.1).
`,

  demo: "protective-put",

  analogy: `
A protective put is like **buying homeowner's insurance on the house you live in** — you don't plan to sell it, but you want to guard against a big fire.

You own a house worth **$1,000,000** that you can't bear to sell. You worry a disaster could wipe you out, so you pay a **$40,000 premium** for a policy: "the part where the house's value drops below **$950,000** is covered by the insurer."

- The house is damaged and its value falls to $700,000: the insurance pays out down to the $950,000 floor, so per "share" you bear only the (100−95) deductible + the $40,000 premium = **at most a $90,000 loss**, however bad it gets.
- The price rises to $1,500,000: of course you don't claim, you lose the $40,000 premium, but the house rose $300,000, so you **still make $260,000.**

The correspondences are clean: **floor payout price = the put's strike**, **deductible = the segment from cost down to the strike**, **premium = the option premium**. Fuller coverage (a higher strike) costs more; covering only disasters (a very low strike) is cheap.

Remember the essence of insurance: **most of the time it's a fixed cost that drags on your return, but the moment disaster strikes, it keeps you from being knocked out.** You buy it not to make money, but to still be standing on the worst day.
`,

  misconceptions: [
    "**\"A protective put lets me profit no matter what.\"** — No. It **caps the downside** but doesn't remove the cost: your breakeven is lifted by the premium to entry+p=104, and if the stock is flat or up mildly, you actually make **one premium less** than plain stock. Insurance is for capping losses, not for boosting income.",
    "**\"The higher the strike, the better the protection deal.\"** — A higher strike (a smaller deductible) gives fuller coverage but a **pricier premium**. It's the eternal \"deductible vs premium\" tradeoff: full coverage is expensive, crash-only is cheap (close to tail hedging, Stage 8.4). There's no insurance that's both cheap and complete.",
    "**\"With a protective put, I won't lose a cent on the way down.\"** — You'll lose a **deductible + premium**. The segment from cost down to the strike (e.g. 100→95) is yours to absorb; the put only pays out **below** the strike. Max loss = (cost − strike) + premium, not zero.",
    "**\"A protective put is just a money-loser; holding it long term makes returns worse.\"** — Buying full coverage every year does get eroded by premiums, but its value is in **locking down the worst case in advance** so you're not forced to capitulate in a crash. Whether you survive often matters more than any single trade's return (Stage 8.1). To cut the cost, use a collar (Stage 6.6).",
    "**\"A protective put is about the same as a covered call.\"** — Opposite directions. A covered call (Stage 6.2) **sells** a call, collects premium, caps the **upside**, and barely protects the downside; a protective put **buys** a put, pays premium, lifts the **downside**, and leaves the upside open. One collects rent, the other buys insurance.",
  ],

  quiz: [
    {
      q: "You hold 100 shares at $100/share and buy one strike-95 put, paying a $4 premium (a protective put). What is this combo's **max loss**?",
      options: ["$400", "$500", "$900", "Theoretically unlimited"],
      answer: 2,
      explain: "Max loss = (cost − strike + premium) × 100 = (100−95+4) × 100 = **$900**, occurring when the expiry price ≤95. The deductible from 100 down to 95 (5) + the premium (4) = $9/share, capped here — further drops don't lose more.",
    },
    {
      q: "For that same protective put (cost 100, put K=95, premium 4), where is the **breakeven**?",
      options: ["$95", "$96", "$104", "$100"],
      answer: 2,
      explain: "Breakeven = cost + premium = 100 + 4 = **$104**. The premium lifts your recovery line: the stock has to rise past 104 to net a gain — the insurance drag made visible (versus plain stock, whose breakeven is just 100).",
    },
    {
      q: "In a protective put, what role does \"the segment from your cost basis down to the put's strike\" (e.g. 100→95) play?",
      options: [
        "The part the insurer pays out in full",
        "The insurance \"deductible\" — this drop is yours to absorb, and the put doesn't cover it",
        "Your max profit",
        "The premium itself",
      ],
      answer: 1,
      explain: "This segment is the insurance **deductible**: the drop from cost down to the strike is yours to bear, and the put only covers losses **below** the strike. The higher the strike, the smaller the deductible and the pricier the premium (callback Stage 0.2).",
    },
    {
      q: "You're bullish on a stock long term and would never sell it, but next week's earnings make you worry about a crash. Which approach best fits \"insuring the position\"?",
      options: [
        "Sell a call (a covered call)",
        "Buy a put (a protective put), trading a premium for a capped worst case",
        "Sell a put (a cash-secured put)",
        "Liquidate all the stock",
      ],
      answer: 1,
      explain: "**Buying a put = a protective put**: it installs a floor under the position, writing down the worst loss in advance, while still capturing the upside in full, at the cost of a premium. A covered call collects rent and barely protects the downside; liquidating abandons the long-term hold you're bullish on. To save on the premium, turn it into a collar (Stage 6.6).",
    },
  ],

  further: [
    { label: "Investopedia: Protective Put", url: "https://www.investopedia.com/terms/p/protective-put.asp" },
    { label: "Options Industry Council (OIC): Protective Put strategy", url: "https://www.optionseducation.org/strategies/all-strategies/protective-put" },
    { label: "CBOE: Portfolio Hedging with Options", url: "https://www.cboe.com/education/" },
  ],
};
