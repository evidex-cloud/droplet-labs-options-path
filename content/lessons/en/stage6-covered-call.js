export default {
  id: "covered-call",
  stage: 6,
  order: 2,
  title: "Covered Calls: Sell Calls Against Stock",
  difficulty: 2,
  prereqs: ["call-option", "moneyness"],

  oneLiner:
    "A covered call = **own 100 shares + sell 1 call**. Your shares \"cover\" the call you sold, and you collect a premium as yield enhancement; the price is that **you give up the upside if the stock rallies hard**. It turns a stock you're happy to hold long term into a machine that collects rent each month — but the rent is limited and the upside is capped.",

  intuition: `
You own **100 shares** of a stock at a cost of **$100/share** ($10,000 total). You like it, but you think the short-term upside is mild at best — no moonshot. Rather than just wait, you **sell one call, strike 105, one month to expiry**, and pocket a **$3/share** premium (one contract = **$300**).

That's a covered call. The word "covered" means the call you sold is **backed by stock** — if you're assigned (Stage 2.4), you simply hand over your 100 shares at 105; you never have to buy stock in the open market at a high price, so the risk is far smaller than a naked call.

What happens at expiry?

- **Stock ≤ 105 (didn't clear the strike)**: the call expires worthless, you **keep the $300 premium free and clear**, and you still hold the stock. Next month you can sell another call and keep collecting rent.
- **Stock > 105 (cleared the strike)**: you're assigned and sell your stock at **105**. The stock itself rose from 100 to 105 for $5/share, plus the $3 premium = $8/share, so **+$800 per contract**. But if it actually ran to 120, you still only get 105 — **that 105-to-120 rally is the part you gave up**.

See the heart of this trade? **You sold off "the upside of a big rally" in exchange for a sure premium.** When the stock is flat or up mildly, this is steady enhancement; when it explodes, you're "left behind," locked at 105; when it craters, that $3 premium gives only a thin cushion, and the bulk of the downside still lives in the stock.

**In this lesson we break the covered call into five pieces:**

- **① What it's made of: 100 shares + selling 1 call, and why it's "covered"**
- **② Three key numbers: premium income, max profit, breakeven**
- **③ The capped upside: what exactly you're selling**
- **④ Assignment and strike selection (ITM/ATM/OTM each trade off what)**
- **⑤ When it fits and when it doesn't**
`,

  mechanics: `
### ① Structure: why it's "covered"

A covered call has two legs (the stacking idea from Stage 2.2):

- **Long 100 shares** (a 45° upward-sloping line).
- **Short 1 call** (pressing a ceiling on at a higher level).

Add the two legs vertically and you get a kinked line that **"loses with the stock on the lower left and is shaved into a flat ceiling on the upper right."** It's called a "**covered**" call because the call you sold is **fully backed** by your 100 shares: on assignment you just deliver the stock, never facing the unlimited risk of a **naked call** — "the stock rises without limit, forcing you to buy high to deliver." With a covered call, upside risk becomes "**earning less**," not "**taking a loss**."

### ② Three key numbers (per share; dollar amounts ×100)

Let entry cost entry=100, short-call strike K=105, premium collected c=3:

- **Premium income** = c = $3/share = **$300/contract**. This is cash pocketed up front, no matter which way the stock goes.
- **Max profit** = (K − entry) + c = (105−100)+3 = $8/share = **+$800/contract**. It occurs when the expiry price ≥ K (you're assigned): the stock's gain up to the strike + the full premium, capped here.
- **Breakeven** = entry − c = 100 − 3 = **$97**. The premium "lowers" your cost basis from 100 to 97 — the stock has to fall below 97 before you start losing, and that's the bit of downside cushion the covered call provides.

> One line to remember: **a covered call trades away "the upside" for "a lower cost basis + a capped gain."** Max profit, breakeven, and the premium — the demo on the right computes all three live as you drag the strike.

### ③ The capped upside: what you're selling

The ceiling is the thing to think through most carefully. **By selling a call, you've handed the buyer the entire gain above the strike:**

- Stock from 100 → 105: this $5 of gain is captured by the covered call just like plain stock, plus you collected $3 of premium — the covered call is **better**.
- Stock from 100 → 120: plain stock makes $20/share; the covered call is locked at 105 and makes only (5+3)=$8/share. **That $12 of excess gain is the "opportunity cost" you paid for the premium.**

So a covered call carries an implicit view of "**mildly bullish or rangebound**": you're betting it won't blow past 105. If you truly believe it's going to double, you shouldn't sell this call — you'd watch it run away while you're locked out (that's the pain of being "left behind").

### ④ Assignment and strike selection

Assignment (Stage 2.4) is one of the normal outcomes of a covered call, and nothing to fear: when it finishes in-the-money, the system has you deliver stock at the strike, and you held the stock anyway, so you just deliver (an American option may even bring **early assignment**, especially right before an ex-dividend date). The key is to use how far the strike sits to dial "**how much rent vs how much upside to keep**":

- **OTM call (K above spot, e.g. 110)**: less premium, but more room to rise and a lower chance of assignment. Fits "I still want to capture some upside."
- **ATM call (K≈spot)**: the fattest premium (maximum time value), but almost no room left for upside. Most aggressive rent, most likely to be assigned.
- **ITM call (K below spot)**: the premium contains intrinsic value and gives a bigger downside cushion, but you've nearly locked in a sale and given up most of the upside. Defensive.

A common practice is to sell a **slightly OTM** call (e.g. a Delta≈0.3 call): collect a decent premium, keep some upside, with a moderate chance of assignment.

### ⑤ When to use it, when not to

**Fits when:**

- You'd **happily sell** this stock at the higher price (and are glad to be assigned).
- You expect short-term **rangebound or mild appreciation** and want to turn idle holdings into cash flow.
- You want to use the premium to **lower your cost basis a little** and smooth your return curve.

**Doesn't fit when:**

- You think it's **about to explode upward** — don't cap the upside, or you'll be left behind.
- You actually **want downside protection** — a covered call has only the thin cushion of a single premium and can't stop a big drop; for protection use a protective put (Stage 6.4) or a collar (Stage 6.6).
- You **can't bear to have the stock sold away** — then don't sell calls, or only sell very far OTM ones.

Think of a covered call as "collecting rent": **the rent is limited and the house (the upside) can be bought away at any time, but as long as you were happy to sell at that price anyway, you collect with peace of mind.** Many long-term holders treat it as a portfolio "enhancement engine," not a tool to bet on direction.
`,

  demo: "covered-call",

  analogy: `
A covered call is like **listing your house for a "fixed-price pre-sale" and collecting a deposit up front**.

You own a house worth **$1,000,000** that you'd also be willing to part with at **$1,050,000**. You agree with a buyer: "Within a month, they have the right to buy it at $1,050,000." For that right, the buyer pays you a **$30,000 deposit** (= the premium), and whether or not they buy in the end, the deposit is yours.

- A month later the price hasn't cleared $1,050,000: the buyer won't exercise, you **keep the $30,000 deposit free**, the house is still yours, and you can list it again next month.
- The price rises above $1,050,000: the buyer exercises and you sell at **$1,050,000** — you made the $50,000 from 100 to 105, plus the $30,000 deposit, for **$80,000** total. But if it actually ran to $1,200,000, that extra $120,000 isn't yours; **you can only sell at the agreed $1,050,000**.

That's a covered call exactly: **deposit = premium, agreed sale price = strike**. You traded away "the part where the price moons" for a steady deposit — provided you were happy to sell at that price in the first place. If you're convinced it's going to the sky, you shouldn't sign this pre-sale at all.
`,

  misconceptions: [
    "**\"A covered call is risk-free rent.\"** — No. Its main risk comes from **the stock you hold falling**: the premium only lowers your basis a little (cushion down to entry−c=97), and if the stock drops to 80 you still take a big loss. A covered call removes the unlimited *upside* risk, not the downside risk.",
    "**\"Selling a call protects my position from falling.\"** — Barely. A $3 premium on a $100 stock is only about a 3% thin cushion. For real protection, buy a **protective put** (Stage 6.4) or build a **collar** (Stage 6.6) to put a genuine floor under the downside.",
    "**\"Being assigned is a loss, a bad thing.\"** — In a covered call, assignment usually means you **hit your max profit** (sold at the strike + collected the premium). You held the stock anyway, so you just deliver. It's simply \"selling the stock at a price you were happy with,\" not a loss.",
    "**\"The higher the strike (the more OTM), the better — more upside kept and still collecting rent.\"** — The higher the strike, the **thinner the premium**. It's the rent-vs-upside tradeoff: ATM collects the most rent but caps the upside; OTM keeps upside but earns little. A common middle ground is selling slightly OTM (Delta≈0.3).",
    "**\"A covered call suits any stock you're bullish on.\"** — If you think it's **about to explode upward**, a covered call leaves you behind, locked at the strike. The covered call's implicit view is **rangebound or mild appreciation**, and you must be **willing to sell at the strike** — both conditions are required.",
  ],

  quiz: [
    {
      q: "You hold 100 shares at $100/share and sell one strike-105 call, collecting a $3 premium (a covered call). What is this trade's **max profit**?",
      options: ["$300", "$500", "$800", "Theoretically unlimited"],
      answer: 2,
      explain: "Max profit = (strike − cost + premium) × 100 = (105−100+3) × 100 = **$800**, occurring when the expiry price ≥105 and you're assigned (the stock makes 5 + the 3 premium, $8/share). The upside is capped here.",
    },
    {
      q: "For that same covered call (cost 100, premium 3), where is the **breakeven**?",
      options: ["$97", "$100", "$103", "$105"],
      answer: 0,
      explain: "Breakeven = cost − premium = 100 − 3 = **$97**. The premium lowers your basis to 97, and you only start netting a loss below 97 — that's the bit of downside cushion a covered call provides.",
    },
    {
      q: "At expiry the stock rises to 120. Compared with simply holding 100 shares, how much less does your covered call (cost 100, sold K=105, collected 3) make?",
      options: ["No less", "$12/share less, $1,200 total", "$20/share less, $2,000 total", "$3/share less, $300 total"],
      answer: 1,
      explain: "Plain stock makes 120−100=20/share; the covered call is locked at 105 and makes (105−100)+3=8/share. The gap = 20−8 = **$12/share = $1,200** — the upside you gave up for the premium (the opportunity cost).",
    },
    {
      q: "Which situation is **least suited** to a covered call?",
      options: [
        "You expect rangebound or mild appreciation and are willing to sell higher",
        "You want to turn idle holdings into monthly cash flow",
        "You're convinced this stock will double next month",
        "You're willing to be assigned and sell at the strike",
      ],
      answer: 2,
      explain: "If you're convinced it's about to explode, a covered call **caps the upside and leaves you behind**, locked at the strike. The covered call's implicit view is rangebound or mild appreciation; if you truly expect a big rally, don't sell this call.",
    },
  ],

  further: [
    { label: "Investopedia: Covered Call (a full walkthrough)", url: "https://www.investopedia.com/terms/c/coveredcall.asp" },
    { label: "Options Industry Council (OIC): Covered Call strategy", url: "https://www.optionseducation.org/strategies/all-strategies/covered-call" },
    { label: "CBOE: BXM Covered-Call Index methodology", url: "https://www.cboe.com/us/indices/dashboard/bxm/" },
  ],
};
