export default {
  id: "cash-secured-put",
  stage: 6,
  order: 3,
  title: "Cash-Secured Puts & the Wheel",
  difficulty: 2,
  prereqs: ["put-option"],

  oneLiner:
    "A cash-secured put = **sell 1 put + set aside the cash to buy the shares at the strike**. You're **paid to wait for a discount price**: if the stock doesn't break the strike, you keep the premium free; if it does and you're assigned, you buy a stock you wanted anyway at a discount. Take assignment, then sell a covered call against the shares, repeat — and that loop is the famous **the wheel**.",

  intuition: `
You want to buy a stock trading at **$100**, but it feels pricey — you'd rather wait for a pullback to 95. Instead of just resting a limit order, you **sell one put, strike 95, one month to expiry**, collect a **$3/share** premium (one contract = **$300**), and set aside **$9,500** in cash (= 95×100, in case you have to take the shares). That's a cash-secured put (CSP).

"Cash-secured" is the key phrase: selling the put commits you to "buy 100 shares at 95 if assigned," so you **lock up that $9,500 in advance** to guarantee you can pay if it happens. That's the difference from a **naked put** — you're not gambling on margin, you're backing it with cash in full, and the risk is crystal clear.

Two outcomes at expiry, and **you're fine with both**:

- **Stock ≥ 95 (didn't break)**: the put expires worthless and you **keep the $300 premium free**. It's like "you bid 95 and didn't get filled, but collected $300 for your trouble." Next month you can sell another and keep going.
- **Stock < 95 (broke, assigned)**: you buy 100 shares at **95** — but don't forget you already collected $3 of premium, so your **effective cost is only 95−3=$92/share**, cheaper than the 95 you originally wanted to pay. You got the stock you wanted, at a discount.

See the spirit of this trade? **You're "paid to wait for a discount price"**: either you collect free rent, or you take delivery at a discount. But it's not a free lunch — if the stock **crashes** to 60, you still take delivery at 95 (effective cost 92), and you're immediately deep in the red on paper. **A CSP's risk is nearly as large as just holding the stock.**

After you take the shares, the story isn't over: you can **sell a covered call** against those 100 shares (Stage 6.2) to collect rent, and after that gets assigned away you go back to selling puts… This loop of "sell put → take shares → sell covered call → get called away → sell put again" is **the wheel**.

**In this lesson we break the cash-secured put and the wheel into five pieces:**

- **① What it's made of: selling a put + locking up cash, and why it's "cash-secured"**
- **② Three key numbers: premium, max profit, effective cost after assignment**
- **③ Both outcomes are acceptable: free rent or buying at a discount**
- **④ The wheel: CSP and the covered call linked end to end**
- **⑤ The real risk: a crash + its relationship to just holding stock**
`,

  mechanics: `
### ① Structure: why it's "cash-secured"

A cash-secured put has only one option leg, but it's paired with a crucial pile of cash:

- **Sell 1 put** (collect the premium, take on the obligation to "buy 100 shares at the strike if assigned").
- **Lock up strike × 100 in cash** (to fund the possible purchase).

Its payoff shape is just a **short put**: a flat ceiling on the right (collect at most the premium), then a dive down to the lower left past the strike (the more the stock falls, the bigger the paper loss after taking delivery). We stress "**cash-secured**" to distinguish it from a **naked put**: a naked put posts only margin (Stage 2.5), with high leverage and blow-up risk; cash-secured backs it with **cash in full**, guaranteeing you can **actually afford** those 100 shares — and that's what turns selling puts from "gambling" into a "disciplined accumulation tool."

### ② Three key numbers (per share; dollar amounts ×100)

Let the short-put strike K=95 and premium collected c=3:

- **Premium income** = c = $3/share = **$300/contract**. Pocketed up front, whichever way the stock goes.
- **Max profit** = c = **$300/contract**. It occurs when the expiry price ≥ K (the put expires worthless) — the seller's gain is just this premium, capped.
- **Effective cost after assignment** = K − c = 95 − 3 = **$92/share**. This also means the **breakeven = 92**: only below 92 does this CSP actually turn into a loss.
- **Max loss** (theoretical) = (K − c) × 100 = 92×100 = **$9,200/contract**, occurring if the stock falls to 0 — identical to "holding 100 shares at a $92 cost basis."

> One line to remember: **selling a put = resting an order at a price you'd be happy to take delivery, and collecting rent up front.** Max profit = the premium, and effective cost after assignment = strike − premium — the demo on the right computes both live.

### ③ Both outcomes are acceptable

A CSP suits someone who "wants to accumulate at a lower price" precisely because **both expiry outcomes are welcome**:

- **Not assigned**: you didn't get the stock, but you keep the premium free (often a meaningful annualized yield). It's like "your bid didn't fill, but you collected an order fee."
- **Assigned**: you bought the stock you wanted at an **effective cost below your bid price** (K−c). The precondition is — **you wanted to hold it at this price in the first place.**

That precondition is critical: **only sell CSPs on quality names you'd genuinely be happy to hold.** If you sell puts on a junk stock just for the premium, you'll be assigned and stuck holding a position you don't want, still falling.

### ④ The wheel: the CSP–covered call loop

Link the cash-secured put (Stage 6.3, this lesson) and the covered call (Stage 6.2) end to end and you get a loop that can **keep collecting rent**:

1. **Sell a cash-secured put**, collect the premium. The stock doesn't break the strike → the put expires worthless, and you return to step 1 to sell another.
2. The stock breaks the strike, **you're assigned** → take 100 shares at an effective cost of K−c.
3. **Sell a covered call** against those 100 shares, keep collecting premium. The stock doesn't clear the strike → the call expires worthless, and you return to step 3 to sell another.
4. The stock clears the strike, **you're assigned and sell** → the 100 shares are sold at the higher strike, pocketing the spread + the premium, and you return to step 1.

This loop of "**sell put → take shares → sell covered call → get called away → sell put again**" is **the wheel**. Its profit source is the **premium collected continuously (time value)** — in essence, repeatedly harvesting the **variance risk premium** (Stage 8.3). As long as the underlying doesn't crash or run away, you skim time value loop after loop. The demo on the right walks through the four steps with scenario cards and tallies the premium collected each loop.

### ⑤ The real risk: a crash and "equal to holding stock"

The wheel sounds like a perpetual-motion machine, but it has one fatal weakness you must see clearly:

- **A CSP's downside risk ≈ just holding stock.** Sell the K=95 put, get assigned, and you're carrying 100 shares at a $92 basis. If the stock craters to 60, your paper loss is immediately about (92−60)×100 = **$3,200** — that $300 premium is a drop in the bucket.
- **Your upside is limited.** If the stock runs straight to 130, you only made that $300 premium and were **left behind** on $30/share of gains (the price of a seller's capped payoff).
- **The wheel underperforms buy-and-hold in a bull market** and gets hurt alongside stock in a crash, with its best environment being **choppy or mildly rising** — exactly a seller's comfort zone.

So the wheel isn't "a sure thing," it's "**turning 'I wanted to buy this good stock low and sell it high anyway' into a disciplined, recurring rent-collection process.**" Picking the name (one you'd genuinely hold long term), controlling size (Stage 8.1), and dodging earnings landmines are what decide whether it works over the long run.
`,

  demo: "wheel-sim",

  analogy: `
A cash-secured put is like **placing a "limit buy + escrow" on a house you want**.

You'd like to buy a house worth $1,000,000 — one you genuinely want — at **$950,000**. You tell the seller: "Within a month, if the price drops to $950,000, I'll buy at $950,000." To show good faith, the seller first pays you a **$30,000 sweetener** (= the premium), and you set aside the **$950,000** in cash (= the security).

- The price doesn't drop to $950,000: you didn't buy, but you **keep the $30,000 sweetener free**, the cash is intact, and you can list the bid again next month.
- The price breaks below $950,000: you follow through and buy, at an **effective cost of 95−3=$920,000** — below your own bid. You got the house you wanted, at a discount.

And **the wheel** is buying the house, then listing it for a "fixed-price pre-sale" to collect a deposit (a covered call), selling it, and going back to the "limit buy" — cycling and collecting rent.

But remember two things. First, **only do this with "good houses" you genuinely want to hold long term** — otherwise after assignment you'll be stuck with a house you don't want, still dropping in value. Second, **in a crash you still have to take delivery at $950,000**, and that $30,000 sweetener won't save you from a big fall. A CSP is disciplined low-side accumulation + rent collection, not risk-free arbitrage.
`,

  misconceptions: [
    "**\"A cash-secured put is low-risk rent.\"** — Its downside risk is **nearly identical to just holding the stock**: after assignment you carry 100 shares at a K−c basis, and a crash still hits you hard. The premium only lowers your basis a little; it can't stop a big drop.",
    "**\"For selling puts, just pick whatever name has the fattest premium.\"** — A big mistake. **Only sell CSPs on quality names you'd genuinely be happy to hold at the strike.** Selling puts on a junk stock just for the premium leaves you, after assignment, stuck holding a position you don't want, still falling.",
    "**\"Being assigned = failure.\"** — In a CSP / the wheel, assignment is often **part of the plan**: you bought the stock you wanted at an effective cost below your bid (K−c), and you then sell a covered call to keep collecting rent. It's a step in the process, not a loss.",
    "**\"The wheel is a sure-thing perpetual-motion machine.\"** — The wheel is most comfortable in **choppy or mildly rising** markets, but it **underperforms buy-and-hold in a bull market** (upside capped by the premium, easily left behind) and **gets hurt alongside stock in a crash**. In essence it's collecting the variance risk premium (Stage 8.3), not a free lunch.",
    "**\"Cash-secured and naked puts are no different.\"** — The difference is the \"**cash**\": cash-secured backs the trade with cash **in full**, guaranteeing you can afford the shares if assigned; naked posts only margin, with high leverage and blow-up potential. For the same put, how it's secured decides whether it's a tool or a gamble.",
  ],

  quiz: [
    {
      q: "You sell a strike-95 cash-secured put and collect a $3 premium. At expiry the stock is 98 (above the strike). What happens?",
      options: [
        "You're assigned and buy 100 shares at 95",
        "The put expires worthless; you earn $300 of premium and don't get the stock",
        "You lose $300",
        "You must buy the stock at 98",
      ],
      answer: 1,
      explain: "The stock at 98 ≥ the strike 95, so the put **expires worthless** and you keep 3×100 = **$300** of premium, without buying the stock. This is one of a CSP's two acceptable outcomes: your bid didn't fill but you collected rent.",
    },
    {
      q: "For that same K=95, c=3 cash-secured put, if you're assigned, what is your **effective cost** (per share) for the 100 shares?",
      options: ["$95", "$98", "$92", "$100"],
      answer: 2,
      explain: "Effective cost = strike − premium = 95 − 3 = **$92/share**. You buy at 95 but already collected $3 of premium, a built-in discount — this is also the breakeven of this CSP.",
    },
    {
      q: "What is the standard cycle order of \"the wheel\"?",
      options: [
        "Buy stock → buy put → sell call → sell stock",
        "Sell a cash-secured put → (assigned) take shares → sell a covered call → (assigned) get called away → sell a put again",
        "Buy call → sell call → buy put → sell put",
        "Just keep buying puts over and over",
      ],
      answer: 1,
      explain: "The wheel = the loop of **sell put → take shares → sell covered call → get called away → sell put again**, linking the cash-secured put (Stage 6.3) and the covered call (Stage 6.2) end to end, profiting from continuously collected premium.",
    },
    {
      q: "Regarding the risk of a cash-secured put / the wheel, which is most accurate?",
      options: [
        "Completely risk-free, because it's cash-secured",
        "Downside risk ≈ just holding stock: in a crash, after assignment you still take a big loss, and the premium is only a thin cushion",
        "Unlimited risk, just like a naked call",
        "You only lose money when the stock rises",
      ],
      answer: 1,
      explain: "Cash-secured only guarantees you can **afford** the shares; it doesn't remove the downside: after assignment you carry 100 shares at a K−c basis, so **a crash hits you just as hard as holding stock**. The wheel is best in choppy/mildly rising markets, easily left behind in a bull, and hurt in a crash.",
    },
  ],

  further: [
    { label: "Investopedia: Cash-Secured Put", url: "https://www.investopedia.com/terms/c/cashsecuredput.asp" },
    { label: "Investopedia: The Wheel Strategy", url: "https://www.investopedia.com/the-wheel-strategy-options-7975227" },
    { label: "Options Industry Council (OIC): Cash-Secured Put", url: "https://www.optionseducation.org/strategies/all-strategies/cash-secured-put" },
  ],
};
