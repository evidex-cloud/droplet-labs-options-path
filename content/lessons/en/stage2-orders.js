export default {
  id: "orders-margin",
  stage: 2,
  order: 5,
  title: "Orders & Margin: Bid/Ask, Open/Close, Collateral",
  difficulty: 2,
  prereqs: ["four-positions"],

  oneLiner:
    "Placing an option order means choosing two things: **buy/sell** and **open/close** (four combinations). Always use a **limit order**, treat the **bid-ask spread** as a real cost, anchor to the **mid**; remember the ×100 on dollar amounts; and as a **seller**, you must first post **margin / collateral** before you can open.",

  intuition: `
You've thought through the strategy, drawn the payoff diagram, and the last step is to **send the order**. This step looks trivial, but it's the gate where real money flows in and out, and where beginners most easily take hidden losses: buying at the ceiling with a market order, ignoring the spread and overpaying by hundreds, or selling a naked option and only then discovering a large chunk of the account is frozen as margin.

To place an option order, you answer two questions:

- **Direction**: are you **buying** or **selling** this contract?
- **Intent**: are you **opening** to establish a new position, or **closing** to unwind an existing one?

Pair them two by two and you get the **four basic order types** for options:

- **Buy to open**: pay the premium, establish a new long (e.g. buying a call/put).
- **Sell to close**: sell the long you hold to unwind it.
- **Sell to open**: collect the premium, establish a new short (becoming the seller).
- **Buy to close**: buy back the short you hold to unwind it.

You also choose an **order type** when placing it. There's an iron rule here for options: **always use a limit order, never a market order.** Because option bid-ask spreads are often wide, a market order can fill you at an absurd price.

An example. A call quoted bid 3.10 / ask 3.30. To **buy**, you'd best try a limit at 3.20 (the mid); a limit at 3.30 fills almost immediately (lifting the offer). The 0.20 spread on this round trip is **$20** of hidden cost per contract — in and out once, you're down $20 right away, and this has to be counted in. And if you **sell to open** a cash-secured put, the broker will first freeze **strike × 100** in cash as collateral.

**In this lesson we break "orders and execution" into five pieces:**

- **① Buy/sell × open/close: the four order types**
- **② Market vs limit: why options must use limit orders**
- **③ The bid-ask spread is a real cost, the mid is your anchor**
- **④ The ×100 multiplier: how to compute cost and proceeds**
- **⑤ The seller's margin / collateral: CSP, covered vs naked**
`,

  mechanics: `
### ① Buy/sell × open/close: the four order types

An option order is always a combination of "**direction + intent**," corresponding to the "birth" and "death" of your position:

- **Buy to open (BTO)**: pay the premium, **establish a new long**. E.g. buying a call/put — max loss = the premium.
- **Sell to close (STC)**: sell the long you hold, **unwind**. P&L = sale price − original buy price.
- **Sell to open (STO)**: collect the premium, **establish a new short** (you become the seller / obligated party). Margin required.
- **Buy to close (BTC)**: buy back the short you hold, **unwind**. P&L = original sale price − buyback price.

> Mnemonic: **open = build the position, close = tear it down; buy = pay, sell = collect.** The risk shapes of the four positions were laid out side by side in Stage 1.3; here is the language for "turning them into orders." Systems usually recognize this automatically: when you hit sell while holding a long, it defaults to "sell to close."

### ② Market vs limit: options must use limit orders

- **Market order**: no price specified — **take whatever price is there**, seeking an instant fill. Fine on large-cap stocks with razor-thin spreads, but **dangerous on options** — let the spread widen and you can fill far from fair value.
- **Limit order**: specifies **the worst price you'll accept**. Buy "no more than X," sell "no less than X." It may not fill instantly, but you **won't get fleeced**.

**The iron rule for options: always use a limit order.** Option liquidity varies (Stage 2.1 covered how to read liquidity), and an obscure contract's spread can run tens of cents wide; the slippage on a single market order can eat a large chunk of your expected profit. Posting a limit and, if needed, nudging the price to inch toward a fill is the professional move.

### ③ The bid-ask spread: a real cost, and the mid

**The bid-ask spread is a genuine cost, not decoration:**

- You **buy** roughly at the **ask**, and **sell** roughly at the **bid**.
- **The mid = (bid + ask) / 2** is a rough estimate of fair value, and the **anchor for your limit order**.
- **Spread cost = (ask − bid) × 100** (per contract). bid 3.10 / ask 3.30, spread 0.20 → the hidden cost of one round trip = 0.20 × 100 = **$20**.

> This is why Stage 2.1 kept stressing picking contracts with **tight spreads and high open interest**: a wide spread is like paying a "toll" every time you go in and out. Resting an order near the mid can often save you half the spread versus simply lifting the ask. On the other side, the market maker makes a living precisely by quoting both bid and ask continuously and earning this spread — they provide liquidity, you pay for convenience.

### ④ The ×100 multiplier: cost and proceeds

Option quotes are **per share**; to reach dollars you must **× the contract multiplier (usually 100)**:

- **Buy to open** one call at ask 3.30: cost = 3.30 × 100 = **$330** (also your max loss).
- **Sell to open** one call at bid 3.10: you immediately collect a premium = 3.10 × 100 = **$310** (your max gain, though the risk may be far larger).
- Buy **5 contracts**? ×5 again: 330 × 5 = **$1,650**.

Drop this ×100 and you'll size the trade a full hundredfold too small — the most common, and most fatal, arithmetic error beginners make.

### ⑤ The seller's margin / collateral

A buyer pays the premium and has no further obligation (max loss capped); **a seller is different — you carry a delivery obligation and must post collateral first.** Three common forms:

- **Cash-secured put (CSP)**: when selling a put, you **set aside enough cash to take the stock at the strike**. Collateral ≈ **strike × 100**. Example: sell the K=95 put and 95 × 100 = **$9,500** is frozen (you can subtract the premium collected). If assigned, you use that cash to take the stock at a discount; if not, you keep the premium free and clear — this is the first half of the "wheel" strategy.
- **Covered call**: when selling a call, you **already hold 100 shares** as collateral. The stock is the collateral, so **no extra cash margin is tied up**; the price is giving up the big upside (Stage 6.2 covers it in full).
- **Naked**: selling an option with **no matching cash or stock** as collateral. The broker freezes a (float-with-the-underlying) margin by rule — the highest risk, since a naked call has theoretically unlimited loss, and most brokers strictly restrict retail clients here.

> One line to tell them apart: **buyers pay the premium — risk capped, no margin**; **sellers collect the premium — risk possibly huge, must post collateral.** "Selling one call" can mean worlds apart: **covered** (stock backing it) versus **naked** (nothing at all) — the former gives up the upside, the latter leaves the tail wide open. Always check which one you're clicking before you order.

String these five pieces together, and a sound option order is: **pick the right buy/sell × open/close → post a limit (anchored to the mid) → compute the spread cost and the ×100 amount in your head → (if a seller) confirm the margin/collateral is in place.** Get this flow smooth and you've cleared the last hurdle from "understanding strategy" to "being able to place an order."
`,

  demo: "order-ticket",

  analogy: `
Placing an option order is like **listing items to buy or sell on a secondhand market**, with a twist for "do you have the goods."

- **Buy to open / sell to close / sell to open / buy to close** are like "**restock / clear inventory / take an order and sell first (no goods yet) / buy back to settle**" — direction (buy/sell) paired with intent (build or unwind), four distinct combinations.
- **Market vs limit order**: a market order is like shouting "**I'll deal at any price right now**," easily burned on obscure goods; a limit order is like hanging a sign "**I'll only buy at no more than this price**" — safe, but you wait.
- **The bid-ask spread**: a stallholder's **buy price (bid) is always below their sell price (ask)**, and that gap is your "**transaction fee**" for getting in and out — the more obscure the goods, the wider the gap.
- **Margin**: you took an order and sold first (sell to open) but **have no goods on hand** — the platform freezes a deposit to ensure you can deliver (naked-short margin); but if the **warehouse happens to have the goods** (covered: you hold 100 shares), those goods are themselves the collateral and no extra cash deposit is needed.

Remember this "listing" logic: **pick the order by direction + intent, post a limit instead of shouting market, the spread is a fee, and selling without goods needs a deposit** — and option order entry stops being a mystery.
`,

  misconceptions: [
    "**\"A market order on options is fine, it's just faster.\"** — A big problem. Option spreads are often wide, and a **market order can fill at an absurd price**. The iron rule is to **always use a limit order**, anchored to the mid as you inch toward a fill.",
    "**\"The bid-ask spread is just a quote, it doesn't affect me.\"** — It's a **genuine cost**. Buy at the ask, sell at the bid, and one round trip pays an (ask−bid)×100 \"toll\" up front. This is exactly why you pick **tight-spread** contracts.",
    "**\"Selling an option is like buying — once the money's paid/collected, you're done.\"** — Not the same. A **seller has a delivery obligation and must post margin/collateral**: a cash-secured put freezes about strike × 100 in cash, a naked short needs floating margin on top, and the risk far exceeds the premium collected.",
    "**\"A covered call and a naked call are both selling calls, so they're about the same.\"** — Worlds apart. A **covered** call has 100 shares backing it (giving up only the upside); a **naked** call has no collateral at all (theoretically unlimited loss). Same action, completely different risk shape.",
    "**\"A quote of 3.30 means you pay $3.30 for one contract.\"** — You dropped the **×100**. One contract = 3.30 × 100 = **$330**; buy 5 and it's $1,650. Every option dollar amount must be multiplied by the contract multiplier to become real money.",
  ],

  quiz: [
    {
      q: "You hold a call option (a long) and now want to close it for a profit. Which order do you place?",
      options: ["Buy to open (BTO)", "Sell to open (STO)", "Sell to close (STC)", "Buy to close (BTC)"],
      answer: 2,
      explain: "Closing a **long you already hold** = **sell to close**. Buy to open establishes a new long, sell to open establishes a new short, buy to close unwinds a short.",
    },
    {
      q: "A call is quoted bid 3.10 / ask 3.30. You buy 1 contract and immediately sell 1 contract; what's the cost of the **bid-ask spread** alone?",
      options: ["$2", "$20", "$200", "$640"],
      answer: 1,
      explain: "Spread cost = (ask − bid) × 100 = (3.30 − 3.10) × 100 = 0.20 × 100 = **$20**. That's the hidden \"toll\" for one round trip — which is why you pick tight-spread contracts.",
    },
    {
      q: "You **sell to open** a 95-strike **cash-secured put** (CSP). Roughly how much cash will the broker freeze as collateral?",
      options: ["$95", "$950", "$9,500", "No collateral needed, just collect the premium"],
      answer: 2,
      explain: "A cash-secured put's collateral ≈ **strike × 100** = 95 × 100 = **$9,500** (usually the collected premium can be subtracted). If assigned you use that cash to take the stock at 95; if not, you keep the premium free and clear.",
    },
    {
      q: "Why are options trades **strongly advised to use limit orders rather than market orders**?",
      options: [
        "Limit orders have lower commissions",
        "Option bid-ask spreads are often wide, and a market order can fill far from fair value",
        "You can't buy options with a market order",
        "A limit order always fills instantly",
      ],
      answer: 1,
      explain: "Option liquidity varies and spreads are often wide, so a **market order can have large slippage**, filling at an absurd price. A limit order specifies the worst acceptable price, anchored to the mid, avoiding a fleecing — though it may have to wait to fill.",
    },
  ],

  further: [
    { label: "Investopedia: Buy/Sell to Open vs to Close", url: "https://www.investopedia.com/terms/b/buytoopen.asp" },
    { label: "Investopedia: Limit Order vs Market Order", url: "https://www.investopedia.com/terms/l/limitorder.asp" },
    { label: "OIC: Margin & Option Selling Requirements", url: "https://www.optionseducation.org/" },
  ],
};
