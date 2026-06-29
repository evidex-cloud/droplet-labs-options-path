export default {
  id: "option-chain",
  stage: 2,
  order: 1,
  title: "Reading the Option Chain",
  difficulty: 1,
  prereqs: ["key-terms", "moneyness"],

  oneLiner:
    "An option chain is a **T-shaped quote board**: strikes run down the center, calls on the left and puts on the right; each row's bid/ask, volume, open interest and implied volatility together tell you **what a contract is worth and how easy it is to trade**.",

  intuition: `
You want to buy a call on this stock, currently trading at **$100**. You open your broker and — a wall of numbers, dozens of rows and a dozen columns, as bewildering as seeing a Level 2 screen for the first time. Don't panic. This table is called the **option chain**, and it is actually highly regular. Once you can read it, it's just your price tag on the shelf.

Picture a supermarket aisle. **The center column is the strike price** (84, 88, 92 … 116), stacked top to bottom one notch at a time. **The entire left half is calls, the entire right half is puts** — and a single row shares one strike. So "the 100-strike call" and "the 100-strike put" sit on the left and right of the same row, easy to compare at a glance.

Each side has several columns; the ones you'll watch most are these:

- **bid / ask**: the highest price someone will pay to **buy** your contract right now, and the lowest someone will **sell** one to you for. You'll generally pay the ask to buy and only collect the bid to sell.
- **last**: the price of the most recent trade — which could be hours old, and may not reflect the true current price.
- **volume**: how many of this contract have changed hands today.
- **open interest**: the total number of contracts currently open (not yet closed) in the market.
- **IV (implied volatility)**: the volatility backed out of this contract's market price — its real "price scale."

The single most important row is the one whose strike sits closest to the spot price (100) — the **at-the-money (ATM)** row. It's usually highlighted, and it's the "waist" of the whole table: above it is one kind of moneyness, below it the other.

**In this lesson we break "reading the option chain" into five pieces:**

- **① The T-shape: strikes centered, calls left / puts right**
- **② The five core columns: bid / ask / last / volume / open interest**
- **③ Find the ATM row, and tell ITM from OTM above and below it**
- **④ How to pick an expiration (near-dated vs far-dated)**
- **⑤ Spotting liquidity at a glance: tight spread + high open interest**
`,

  mechanics: `
### ① The T-shape: why it looks like this

The option chain is built as a **T** (one center column of strikes, two wings splitting calls and puts) because traders are forever doing the same one thing: **comparing the spot price against the strike**. Pin the strike to the central axis and your eye only has to sweep sideways to read, on a single strike, what the call and the put are each worth — which is the starting point for put-call parity (Stage 4.1 goes deep), for building spreads, and for gauging market sentiment.

- **Left side (calls)**: the **lower** the strike, the more in-the-money (deep green, expensive); the higher the strike climbs, the more out-of-the-money and cheaper the call.
- **Right side (puts)**: the reverse — the **higher** the strike, the more in-the-money; the lower you go, the more out-of-the-money.
- One row = one strike = call and put sitting back to back.

Many platforms shade the in-the-money cells (say, a pale green background) so you don't have to compute in your head which strikes are currently "in the money."

### ② The five core columns: what each one is saying

Take one row from the demo on the right (a call, 100 strike), and say it shows \`bid 5.10 / ask 5.30 / last 5.20 / vol 1,240 / OI 8,600\`:

- **bid 5.10**: if you **sell** this contract right now, the market will pay at most 5.10 (per contract = 5.10 × 100 = **$510**).
- **ask 5.30**: if you **buy** right now, the least you'll pay is 5.30 (per contract = **$530**).
- **mid = (5.10 + 5.30) / 2 = 5.20**: a rough estimate of fair value, and the anchor for your limit price (Stage 2.5 covers order entry in detail).
- **last 5.20**: the price of the previous trade. **Note it can be stale** — for a thinly traded contract intraday, the last print might be two hours old. Don't treat it as the current price.
- **volume 1,240 / OI 8,600**: 1,240 traded today, with 8,600 contracts still open in the market. **Volume tells you how hot it is today; open interest tells you how much positioning has built up.**

> One line to lock in the money on this table: **every quote you see has to be ×100 to get the real dollar amount of one contract.** 5.20 isn't $5.20, it's $520 — drop the ×100 and you'll size the trade a full hundredfold too small.

### ③ Find the ATM row

**At-the-money (ATM)** = the row whose strike sits closest to the spot price. With spot at 100 and a strike spacing of 4, the 100 strike is the ATM row (the demo highlights it as a colored "waistline"). Using it as the divider:

- **Above it**, strikes > spot: calls turn out-of-the-money, puts turn in-the-money.
- **Below it**, strikes < spot: calls turn in-the-money, puts turn out-of-the-money.

Why fixate on the ATM? Because **ATM contracts carry the thickest time value and the largest Gamma and Theta** — they're the liveliest strike, and the reference point for most strategies (covered calls, spreads, straddles). You'll also notice an ATM call's Delta usually hovers around 0.5 — no coincidence, but a structural feature of the pricing model (Stage 5.2 covers Delta).

### ④ How to pick an expiration

A single underlying lists many expirations at once (weeklies, monthlies, quarterlies, LEAPS …). Switching expirations is really switching the **T (time to expiry)**, and the whole table reprices with it:

- **Near-dated (say 30 days)**: cheaper premium, faster Theta decay, more sensitive to direction (for the same move, a near-dated option gains harder and loses harder). Suited to short-term plays and defined events.
- **Far-dated (say 120 days, or even a LEAPS a year or more out)**: pricier premium, thicker time value, slower decay — it gives your thesis more time to play out.
- **Rule of thumb**: buyers often get ground down by time decay, so they'll happily pay a bit more for a slightly further-out expiry to give themselves room; sellers prefer near-dated, feeding on that fastest stretch of Theta.

The demo has a 30 / 60 / 120-day segmented toggle — flip it and watch the same row's premium "grow taller" as time to expiry lengthens.

### ⑤ Spotting liquidity at a glance

Not every strike on the same table is good to trade. To judge **liquidity**, look mainly at two things:

- **Is the bid-ask spread tight enough?** 5.10/5.30 is a 0.20 spread (\$20 per contract) — narrow, smooth in and out. But 4.50/6.00 is a 1.50 spread (\$150 per contract); just buying and selling once forfeits $150 to the spread — that's the **spread as a hidden cost** (Stage 2.5 does this math).
- **Is open interest / volume high enough?** OI in the thousands with trades today means there are counterparties at this strike and your orders will fill easily; an obscure strike with single-digit OI may sit unfilled for hours.

**The practical rule**: favor contracts that are **near the money, with a tight spread and large open interest**. For deep out-of-the-money or ultra-long-dated strikes, no matter how tempting the quote, beware the "visible but unbuyable, bought but unsellable" trap. This is exactly the business market makers run (Stage 2.5 mentions them too): they quote both sides continuously, providing liquidity in exchange for the spread.
`,

  demo: "option-chain",

  analogy: `
Reading an option chain is like reading an **airport flight board**.

The center column lists "destination / time" (the **strike**), and the two blocks on either side are "departures" and "arrivals" (calls and puts). Each row has a few status columns:

- **The gate's current price** — the **bid/ask**, telling you what it costs to get in or out of this flight right now.
- **"On time / delayed"** — **volume and open interest**: a packed, popular flight (high OI) runs frequently and is easy to rebook; an obscure route (low OI) flies once a day, and miss it and you're stuck.
- **The highlighted row** — the **at-the-money (ATM)** strike, the flight nearest your "current position" and the one you'll use most.

You don't need to read every number on the board. Just learn to **locate the central axis (strike) first, then look left and right for direction, then pick a flight that's on time and easy to rebook (good liquidity)** — and the option chain turns from gibberish into a price tag.
`,

  misconceptions: [
    "**\"The last price is the current price.\"** — Not necessarily. For a thin contract the last print may be a stale trade from hours ago. The price you can actually trade at sits **between the bid and ask**; anchor your limit order to the **mid**, not the last.",
    "**\"A quote of 5.20 means it costs $5.20.\"** — You dropped the **×100 multiplier**. One contract = 5.20 × 100 = **$520**. Every quote in the chain is per-share; to reach your wallet, multiply by 100.",
    "**\"Higher open interest means the price will go up.\"** — No. Open interest only measures **liquidity and attention** — it gives no direction. High OI just means the strike is easy to trade with a tighter spread; it predicts nothing about up or down.",
    "**\"Pick the cheapest option first.\"** — Dangerous. The cheapest is usually deep out-of-the-money or an obscure expiry, with a wide spread and low open interest — easy to buy, hard to sell. Check **liquidity (tight spread + high OI)** first, then talk value for money.",
    "**\"Calls and puts are two completely separate tables.\"** — They share the same column of strikes and the same expiration, sitting on the left and right of **the same row**. Reading them side by side is precisely the key to understanding parity and market sentiment (Stage 4.1).",
  ],

  quiz: [
    {
      q: "A call's row shows bid 3.10 / ask 3.30. If you **buy one at market** right now, roughly how much do you pay?",
      options: ["$310", "$320", "$330", "You fill at the last price of $315"],
      answer: 2,
      explain: "Buying generally fills at the **ask**: 3.30 × 100 = **$330**. You'd only collect the bid ($310) when selling. The mid of $320 is just a fair-value estimate, not a price you can grab instantly.",
    },
    {
      q: "Spot is $100 and the strike spacing is 4. Which row is most likely flagged as **at-the-money (ATM)**?",
      options: ["Strike 88", "Strike 100", "Strike 112", "Strike 116"],
      answer: 1,
      explain: "ATM = the row whose strike is **closest to spot**. With spot at 100, the 100 strike is at-the-money — thickest time value, largest Gamma/Theta, the \"waist\" of the whole table.",
    },
    {
      q: "Contract A: bid 5.10 / ask 5.30, open interest 8,600. Contract B: bid 4.50 / ask 6.00, open interest 12. Which has **better liquidity**?",
      options: ["B, because it's cheaper and you can bid 4.50", "A — a tight spread (0.20) and large open interest", "Same, the price ranges are similar", "Can't tell, you need to wait for volume"],
      answer: 1,
      explain: "A's spread is only 0.20 (\$20 per contract) with OI of 8,600 — smooth in and out; B's spread is 1.50 (\$150 per contract) with OI of just 12 — easy to buy, hard to sell. **Tight spread + high open interest = good liquidity.**",
    },
    {
      q: "On the chain, if you switch the expiration from 30 days to 120 days, how does the premium of the same ATM strike usually change?",
      options: ["Cheaper, because more time means more uncertainty", "Basically unchanged, expiry doesn't affect price", "More expensive, because time value is thicker", "Drops straight to zero"],
      answer: 2,
      explain: "The longer the time to expiry T, the **thicker the time value** and the more expensive the premium. Far-dated gives a thesis more time to play out with slower Theta decay; near-dated is cheaper but decays fast and is more sensitive to direction.",
    },
  ],

  further: [
    { label: "Investopedia: Option Chain (a full breakdown)", url: "https://www.investopedia.com/terms/o/optionchain.asp" },
    { label: "OIC (Options Industry Council): Reading an Option Chain", url: "https://www.optionseducation.org/" },
    { label: "CBOE: Understanding Options Quotes", url: "https://www.cboe.com/education/" },
  ],
};
