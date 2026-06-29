export default {
  id: "key-terms",
  stage: 1,
  order: 4,
  title: "Key Terms: Strike, Expiry, Premium, Multiplier",
  difficulty: 1,
  prereqs: ["call-option"],

  oneLiner:
    "An option contract = **underlying + type (call/put) + strike + expiration + quote.** Read those five, plus the one you must never forget — the **contract multiplier ×100** — and you can translate any line of an option quote into \"what exactly did I buy, and how much did it cost.\"",

  intuition: `
By now you can already compute the P&L of a call (Stage 1.1) and a put (Stage 1.2). But to actually place an order, you first need to read **how a contract is described.**

A typical line of an option quote looks like this:

$$AAPL  2026-09-18  C  150  @ 3.20

Slice it apart and each segment is a key term:

- **AAPL** — the **underlying**: which stock/ETF this option is written on.
- **2026-09-18** — the **expiration**: the day the right lapses.
- **C** — the **type**: C = call, P = put.
- **150** — the **strike**: the agreed buy/sell price.
- **3.20** — the **premium (quote)**: the price per share.

And there's one more lead character — **not written on the face, yet decisive of what you pay** — the **contract multiplier = 100.** A quote of 3.20 doesn't cost $3.20; it costs **3.20 × 100 = $320 a contract.** Countless beginners undercount by a factor of 100 right here.

This lesson is your **"terminology dictionary"**: the precise meaning of each word above, and how they snap together into a contract, explained once and for all. Every lesson after this leans on this vocabulary, so set the foundation firmly here.

**In this lesson we break "a single contract" into five pieces:**

- **① Strike: the baseline**
- **② Expiration: the shelf life of the right, and how expiry dates are laddered**
- **③ Premium: bid / ask / mid**
- **④ Contract multiplier (=100): turning the quote into real money**
- **⑤ Anatomy of the option symbol**
`,

  mechanics: `
### ① Strike

The **strike** (also called the exercise or execution price) is the **buy or sell price** hard-coded into the contract. It is the **baseline** of the whole option:

- For a **call**: underlying > strike → in-the-money (exercising captures intrinsic value).
- For a **put**: underlying < strike → in-the-money.

The exchange lists **a row** of strikes for each underlying, spaced at fixed intervals (a low-priced stock might have one every $1, a high-priced one every $5 or $10). The closer the strike to the current underlying price, the more "at-the-money"; the farther away, the more "out-of-the-money" or "in-the-money" — this "where the money is" judgment gets its own lesson next (Stage 1.5, ITM/ATM/OTM).

### ② Expiration

The **expiration** is the day the option's right **lapses.** Past expiry, an unexercised option is worth nothing (zeroed out). U.S. equity options usually settle **after the Friday close** on expiry day.

How does the exchange ladder the expiry dates? Generally in layers, from near to far:

- **Weeklys**: expire every Friday, available for the nearest several weeks.
- **Monthlys**: expire on the third Friday of each month — the most classic, most liquid tier.
- **Further months / quarterlies / LEAPS**: long-dated options expiring months, or even a year or two, out (LEAPS = options expiring more than a year out).

For the same ticker, you'll see a string of selectable expiry dates. **The nearer the expiry, the faster time value bleeds away** (that's Theta, Stage 5.4) — an unavoidable trade-off when picking which expiry to use.

### ③ Premium: bid / ask / mid

The **premium** is the **price** of the option — paid by the buyer to the seller, the buyer's max loss, the seller's max gain. But what you see in a quote is never one number — it's **two:**

- **bid**: the highest price a buyer is **willing to pay** right now.
- **ask**: the lowest price a seller is **willing to accept** right now.
- The gap between them is the **bid-ask spread.** The common "theoretical price" takes the midpoint: **mid = (bid + ask) / 2.**

For example, bid=3.10, ask=3.30 gives mid=3.20. **When you buy you'll usually pay near the ask, and when you sell you'll usually get near the bid** — that spread is your hidden transaction cost; the wider the spread and the worse the liquidity, the more it costs to get in and out (the details of orders, spreads, and margin are in Stage 2.5).

### ④ Contract multiplier (=100): quote → real money

This is the one thing in this lesson to carve into your bones. Options are quoted **per share**, but one U.S. single-stock option contract represents **100 shares** of the underlying — that number is the **contract multiplier.** So:

$$cost per contract = quote × 100

- A quote of **3.20** → **3.20 × 100 = $320** a contract.
- Any per-share P&L you compute must be **×100** (and × the number of contracts) to be the real dollar figure.

> A common, costly mistake: you see a quote of 0.50, think "so cheap, only fifty cents," and buy 20 contracts in one go — when what you actually spend is 0.50 × 100 × 20 = **$1,000**, not $10. **Always ×100 before you read the price tag.**

(In a few cases the multiplier changes — for instance after a stock split or special dividend the contract gets adjusted and the multiplier may not be a clean 100; but the default for standard U.S. single-stock options is 100.)

### ⑤ Anatomy of the option symbol

Brokers and quote software identify each contract uniquely with a **compact symbol.** The industry-standard format (the OCC symbol) strings the five elements together:

$$underlying + expiry(YYMMDD) + C/P + strike(×1000, zero-padded to 8 digits)

For example, \`AAPL 260918C00150000\` breaks apart as:

- \`AAPL\`: the underlying
- \`260918\`: the expiry, 2026-09-18
- \`C\`: a call
- \`00150000\`: the strike 150.000 (the last three digits are decimals, with leading zeros padding to 8)

You won't normally type this string by hand, but **being able to read it** lets you confirm at a glance "what exactly this contract is" and avoid placing the wrong order. Lock down this lesson's five elements + the contract multiplier and you hold the key to reading any option quote (and the whole option chain in the next stage, Stage 2.1).
`,

  demo: "contract-anatomy",

  analogy: `
An option contract is like a **concert ticket.**

- **Underlying** = which artist/which show (whose performance this ticket is for).
- **Strike** = the face price (the agreed price your ticket entitles you to).
- **Expiration** = the show date (void and worthless once it passes).
- **Type C/P** = the grandstand section or the floor (two different kinds of right).
- **Premium** = what you pay a scalper for this ticket right now — and the scalper's **buy price / sell price** is the bid / ask, with the gap in between being his cut.
- **Contract multiplier ×100** = this one "ticket" actually admits **100 people** at once — so a face value of 3.20 means you actually pay 320.

Read every field on this "ticket" and you know which show, which day, which seat, and how much you paid. An option quote board is just a whole wall of these tickets.
`,

  misconceptions: [
    "**\"A quote of 3.20 means $3.20 buys one contract.\"** — The costliest mistake of all. One contract = 100 shares, so **cost per contract = quote × 100 = $320.** Always ×100 before placing an order, or you'll undercount by a factor of 100.",
    "**\"The premium is a single fixed number.\"** — It's actually **two prices, bid and ask.** You buy near the ask and sell near the bid; the mid (bid+ask)/2 is only a reference. The wider the spread, the higher your cost to get in and out (Stage 2.5).",
    "**\"The more strikes the better — just pick any one.\"** — The strike determines the option's moneyness, price, and probability (Stages 1.5 and 5.2). It isn't chosen at random — it's the core dial for expressing how strong your view is and weighing the trade-off.",
    "**\"There's only one fixed expiry choice.\"** — The same ticker usually has **a string** of expiry dates: weeklys, monthlys, quarterlies, LEAPS. The nearer the expiry, the faster time value bleeds (Theta, Stage 5.4) — which one you pick is an important trade-off.",
  ],

  quiz: [
    {
      q: "A call option is quoted at 2.50 (1 contract = 100 shares). About how much does buying **one** contract cost?",
      options: ["$2.50", "$25", "$250", "$2,500"],
      answer: 2,
      explain: "Cost per contract = quote × contract multiplier = 2.50 × 100 = **$250.** This is the most-tested and most-miscomputed point about the multiplier — always ×100 first.",
    },
    {
      q: "An option has bid = 1.80 and ask = 2.00. What is its **mid**?",
      options: ["1.80", "2.00", "1.90", "3.80"],
      answer: 2,
      explain: "Mid = (bid + ask) / 2 = (1.80 + 2.00) / 2 = **1.90.** Note that you'll usually pay near 2.00 to buy and get only near 1.80 to sell — that 0.20 spread is the hidden cost.",
    },
    {
      q: "In the symbol `AAPL 260918C00150000`, what does `260918` represent?",
      options: ["A strike of 26.0918", "The expiry, 2026-09-18", "The number of contracts", "A premium of 2609.18"],
      answer: 1,
      explain: "In the OCC symbol, the 6 digits right after the underlying are the expiry, in YYMMDD format → `260918` = **September 18, 2026.** The `C` after it means a call, and `00150000` means a strike of 150.000.",
    },
    {
      q: "Which statement about the **strike** is correct?",
      options: ["It changes daily with the stock price", "It's the buy/sell price agreed in the contract — the baseline for judging ITM/OTM", "It equals the premium", "It can only be a whole number"],
      answer: 1,
      explain: "The strike is the execution price hard-coded into the contract, unchanged throughout. A call is in-the-money when the underlying is above it, a put when below — it's the baseline of moneyness (Stage 1.5).",
    },
  ],

  further: [
    { label: "Investopedia: Option Strike Price", url: "https://www.investopedia.com/terms/s/strikeprice.asp" },
    { label: "OCC: Options Symbology (the option symbol standard)", url: "https://www.theocc.com/" },
    { label: "OIC: Options Basics (terms & contract specs)", url: "https://www.optionseducation.org/optionsoverview" },
  ],
};
