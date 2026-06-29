export default {
  id: "synthetics",
  stage: 7,
  order: 6,
  title: "Synthetics: Building Any Position from Parity",
  difficulty: 3,
  prereqs: ["put-call-parity"],

  oneLiner:
    "Put-call parity (Stage 3.2) isn't just an identity — it's a set of **Lego assembly rules**: **buy a call + sell a put (same strike) = long the underlying.** From it you can build synthetic longs/shorts and synthetic calls/puts, treating stock, calls, puts, and cash as interchangeable bricks. It underpins conversion/reversal arbitrage, capital efficiency, and the market maker's risk-free arbitrage (Stage 8.5).",

  intuition: `
Put-call parity (Stage 3.2) gave us an identity:

$$C − P = S − K·e^{−rT}

It's usually memorized as "a consistency constraint for pricing options." But it actually hides a more powerful use — **rearrangement.** Move the terms around, and every rearrangement corresponds to a **recipe for building one position out of other bricks.** The options world thus becomes a set of **Legos**: stock, calls, puts, and cash are four bricks that snap together and substitute for one another.

The most basic recipe: read the identity above as "**buy a call + sell a put ≈ hold the underlying.**" Concretely —

Take an underlying at **100** and do two things (same strike K=100, same expiry):

- **Buy** 1 strike-100 call;
- **Sell** 1 strike-100 put.

At expiry, wherever the underlying lands, these two legs' combined P&L is **identical to simply holding 100 shares**:

- The underlying rises to **120**: the call is worth 20, the put expires worthless → the combo makes 20, exactly equal to the stock making 20 from 100 to 120.
- The underlying falls to **80**: the call expires worthless, and the put you sold is exercised for a loss of 20 → the combo loses 20, exactly equal to the stock losing 20 from 100 to 80.
- At any price, **the synthetic position's P&L = the underlying's P&L**, to the penny (the demo overlays the two lines and you'll see them coincide exactly).

This is a **synthetic long**: you touched not a single share, yet with one bought and one sold option you **replicated** a payoff identical to being long stock. Flip the buy/sell direction of every leg and it's a **synthetic short**; keep only part of it and add cash or stock, and you can build a **synthetic call** or **synthetic put.**

Why bother with all this indirection? Because synthetics aren't a parlor trick — they're the underlying logic of **capital efficiency, arbitrage, and market-maker hedging.** When a synthetic position's cost deviates from the real position's by even a hair, a **risk-free arbitrage** opportunity appears (the market makers of Stage 8.5 make their living on exactly this).

**In this lesson we break synthetics into five pieces:**

- **① From parity to Lego: the interchange rules for four bricks**
- **② Synthetic long / synthetic short**
- **③ Synthetic call / synthetic put (the full table of six synthetics)**
- **④ Why it matters: conversions, reversals, and arbitrage**
- **⑤ Capital efficiency and the market-maker view**
`,

  mechanics: `
### ① From parity to Lego

Treat the parity identity \`C − P = S − K·e^{−rT}\` as a rearrangement machine. Both sides can be moved freely, and every arrangement reads as "**this group of bricks on the left = that group on the right.**" Ignoring the rate/dividend details (treat \`K·e^{−rT}\` loosely as "cash laid out at the strike"), the core recipe condenses to one line:

> **Underlying = call − put** (same strike, same expiry).

Rearrange around this line endlessly and you get all the synthetic recipes. The memory trick is to watch the **signs**: in the identity, \`+\` means **buy (long)**, \`−\` means **sell (short)**. So:

- Want the **underlying** (long)? → \`+C − P\`: **buy the call, sell the put.**
- Want a **call**? → \`C = S + P\` rearranges to \`+S + P\`… wait, be careful with the dividend and cash terms. Below we argue via payoff equivalence (identical expiry payoffs), which is more intuitive and undisturbed by rates.

To avoid getting tangled in the \`e^{−rT}\` discounting, this lesson derives everything via **expiry-payoff equivalence** (if two combos have the same P&L at every expiry price S, they're synthetics of each other) — which is exactly what the demo on the right verifies: overlay the two P&L lines, and coincidence means equivalence.

### ② Synthetic long / synthetic short

**A synthetic long stock = buy a call + sell a put (same K, same expiry).**

- Expiry P&L = max(S−K,0) − max(K−S,0) − (net premium) = (S − K) − (net premium).
- This is a **slope-1 straight line**, identical in shape to holding the underlying (S − purchase price) — just with the "purchase price" replaced by "strike + net premium." When the call and put premiums are equal (ATM, no-arbitrage cost), the two lines **coincide exactly** (in the demo, the gap at each of 80/90/100/110/120 is $0).
- **Risk profile**: nearly identical to plain stock — unlimited gain on the way up, a loss all the way down (the put you sold has you take delivery below). It's not a "defined-risk" structure and ties up **margin** (because you sold a naked put); it merely **replicates** stock exposure with options.

**A synthetic short stock = sell a call + buy a put (same K, same expiry).**

- Flip every leg above to get a slope-−1 line, replicating the payoff of **shorting the underlying**: gains on the way down, a loss all the way up (the call you sold loses without limit above). When borrowing to short is hard, or you want to express a short more flexibly with options, a synthetic short is a common substitute.

> The key intuition: **a call and a put bought-and-sold at the same strike snap the two "hockey sticks" back into one "straight line."** The call's lower floor is filled in by the sold put's downside obligation, so the V/hockey-stick vanishes and reverts to a stock-like 45° line. That's the geometric meaning of "synthetic."

### ③ The full table of six synthetics

Rearranging "underlying = call − put" lets you build **six** of the most common synthetic positions (same K, same expiry; + means buy, − means sell, S denotes stock). Remember one mantra: **any one brick equals the combination of the other two.**

- **Synthetic long stock** = +call − put
- **Synthetic short stock** = −call + put
- **Synthetic call** = +stock + put (stock + a protective put = a protective put, learned in Stage 6; its payoff shape is exactly a call!)
- **Synthetic short call** = −stock − put
- **Synthetic put** = −stock + call (short the underlying + buy a call to hedge the upside = replicating a put)
- **Synthetic short put** = +stock − call (stock + sell a call = a covered call, learned in Stage 6; its payoff shape is exactly "selling a put"!)

This table reveals the **true identities** of several previously learned strategies:

- **A protective put (stock + buy a put) is actually a synthetic call** — which explains why it has "insurance below, upside still open," because it's payoff-equivalent to a long call.
- **A covered call (stock + sell a call) is actually a synthetic short put** — which explains why its risk-reward is nearly identical to "selling a cash-secured put" (the seed planted back in Stage 6).
- **A collar = stock + buy a put + sell a call**, which from the synthetic view is "a synthetic call − a call's upper edge," naturally becoming a range boxed in at both ends.

> Once you can use parity to translate any structure into its equivalent synthetic form, many "seemingly different" strategies reveal **the same face** — a leap in options thinking.

### ④ Why it matters: conversions, reversals, and arbitrage

Synthetics' hardest-core use is pairing them with **real positions** to make **risk-free arbitrage.** Because "a synthetic long stock" equals "really holding the stock" in expiry P&L, their **current build cost** should be equal; once unequal, someone can profit for free.

- **Conversion arbitrage**: when a **synthetic short stock is "more expensive" than the real underlying** (i.e. C is high relative to P, parity is broken) — **buy the real underlying + build a synthetic short (sell the call, buy the put).** The two P&Ls fully offset, net exposure is zero, yet you lock in that spread as a risk-free profit.
- **Reverse conversion (reversal)**: the opposite direction — when a **synthetic long stock is "cheaper" than the real underlying** — **short the real underlying + build a synthetic long (buy the call, sell the put)**, likewise locking in a risk-free spread.
- **Box spread**: use two synthetic positions (a synthetic long spread + a synthetic short spread) to assemble a **certain expiry payoff** — essentially synthesizing a **loan** out of options, whose implied rate is the market's risk-free pricing.

These arbitrage profits are usually **very thin** and get eaten quickly by the bid-ask spread and fees, so they're basically done by **professional market makers and institutions** at the millisecond level. But their existence is exactly why parity is kept **"welded shut" in reality**: any deviation is instantly erased by arbitrageurs, so parity holds almost always for the ordinary trader.

### ⑤ Capital efficiency and the market-maker view

Synthetics' final value is **capital efficiency** and **flexibility in risk management**:

- **Capital efficiency**: buying 100 shares directly means putting up the full principal ($10,000); a synthetic long (buy a call + sell a put) only ties up **margin**, far less capital. Institutions often use synthetics to **replicate large stock exposures** without committing equal cash — the same idea behind index futures and synthetic ETFs.
- **Bypassing short-sale restrictions**: for names hard to borrow to short, or under a short-sale ban, a **synthetic short** (sell a call + buy a put) becomes the alternative channel to express a short.
- **The market maker's day-to-day (Stage 8.5)**: a market maker continuously quotes bid/ask on hundreds or thousands of options, with all kinds of calls and puts piling up in inventory. They use **synthetic relationships to package and hedge the risk** — e.g. converting excess call exposure, via identities like "sell a call = sell the underlying + sell a put," into a Delta hedge on the stock (Stage 5.2, the term Delta hedging). Synthetics are their common language for **translating a messy options inventory into a few clean underlying/cash exposures** to manage.
- **Quant and execution**: algorithms continuously scan whether any synthetic deviation exists among the C, P, and S across all strikes (conversion/reversal opportunities) and auto-fire orders to harvest it — a steady source of high-frequency market-making profit, and the micro-mechanism by which parity is maintained at every instant.

A line to close the whole stage: **from single legs to spreads, straddles, butterflies, iron condors, calendars, ratios — every structure is, at bottom, a combination of the four bricks: call, put, underlying, and cash; and parity is the "exchange rate" that lets you translate, substitute, and arbitrage freely among them.** Understand synthetics, and you hold the master manual for options Lego.

The demo on the right uses a segmented toggle to switch between **synthetic long / synthetic short**: it draws the "buy a call + sell a put" combined P&L and **overlays** the equivalent plain-stock P&L line — the two lines coincide exactly, letting you confirm with your own eyes that "synthetic = real," annotated as guaranteed by parity.
`,

  demo: "synthetics",

  analogy: `
A synthetic position is like **using "exchange-rate rules" to assemble the same purchasing power from different currencies.**

Think of calls, puts, stock, and cash as four currencies. **Put-call parity is the fixed "exchange-rate table" among them**: you hold none of the "stock" currency, but as long as you follow the table and pool together one bought and one sold of "call" and "put," you can convert out **purchasing power identical to holding stock** — that's a synthetic long.

- Want the purchasing power of "long stock"? Per the table: **buy a call + sell a put**, converted to the penny.
- Want to "short stock"? Reverse the conversion: **sell a call + buy a put.**
- The "protective put" you learned earlier, translated via the table, is actually a **call**; the "covered call," translated, is **selling a put** — the same purchasing power, just wearing different clothes.

And **the arbitrageurs** are the ones watching the exchange-rate table for cracks: the day "stock converted from options" is even a cent cheaper than "real stock," they **buy the cheap side and sell the expensive side**, locking in a risk-free spread instantly. It's precisely this crowd, watching at every moment, that keeps the table (parity) firmly nailed down so that for the rest of us it's always accurate.

Understand this "exchange-rate table," and you'll stop seeing calls, puts, and stock as three separate things — they're just **different ways to convert** the same purchasing power.
`,

  misconceptions: [
    "**\"A synthetic long stock (buy a call + sell a put) has limited risk.\"** — No. It replicates **plain stock**: unlimited gain up, a loss all the way down (the put you sold has you take delivery below), and it ties up **margin** too. It merely 'replicates' stock exposure with options — it's not a defined-risk structure.",
    "**\"Synthetics are just a math game with no real use.\"** — They're precisely the underlying logic of **conversion/reversal arbitrage, box spreads, capital efficiency, short-sale substitution, and market-maker hedging** (Stage 8.5). Institutions use synthetics to replicate large exposures and package-hedge inventory; algorithms arbitrage synthetic deviations — they're the micro-engine of the options market.",
    "**\"A protective put and a covered call are brand-new things, unrelated to synthetics.\"** — Translate via parity: a **protective put = a synthetic call** (stock + buy a put), and a **covered call = a synthetic short put** (stock + sell a call). Their payoff shapes are exactly a call / selling a put — which explains their risk-reward structures.",
    "**\"A synthetic position's cost always differs from the real one's, so you can arbitrage easily.\"** — Parity is kept 'welded shut' by arbitrageurs at every moment, the deviation is usually **tiny**, and it gets eaten by the bid-ask spread and fees. Unless you're a low-cost professional market maker, an ordinary person can hardly catch it — which is exactly why parity holds almost always for us.",
    "**\"A synthetic call is just buying a call directly, no difference.\"** — The payoff is **equivalent**, but the implementation and cost structure differ: a synthetic call = stock + buy a put, tying up the capital to buy stock (or margin) and involving dividends and financing costs. Whether to use a synthetic depends on capital usage, ease of borrowing, taxes, and hedging needs — not 'it's the same anyway.'",
  ],

  quiz: [
    {
      q: "How do you **synthesize a long stock** position with options (synthetic long stock, same strike, same expiry)?",
      options: [
        "Buy a call + buy a put",
        "Buy a call + sell a put",
        "Sell a call + buy a put",
        "Sell a call + sell a put",
      ],
      answer: 1,
      explain: "From parity S = C − P: **buy a call + sell a put** (same K, same expiry). Expiry P&L = (S−K) − net premium, a slope-1 line identical to holding plain stock. Reverse it (sell a call + buy a put) and it's a synthetic short.",
    },
    {
      q: "What characterizes the **risk** of a synthetic long stock (buy a call + sell a put)?",
      options: [
        "Limited risk, max loss = net paid",
        "Nearly identical to holding plain stock: unlimited gain up, a loss all the way down, and it ties up margin",
        "No risk at all (risk-free arbitrage)",
        "It only loses on the way up",
      ],
      answer: 1,
      explain: "It **replicates stock exposure**: the put you sold has you take delivery below, losing all the way down; up, it gains with the underlying without limit. Because you sold a naked put, it ties up **margin.** A synthetic ≠ defined risk — it just replicates stock with options.",
    },
    {
      q: "Translated via parity, **stock + selling a call (a covered call)** is payoff-equivalent to which synthetic position?",
      options: [
        "A synthetic call (buying a call)",
        "A synthetic long stock",
        "A synthetic short put (equivalent to selling a put)",
        "A synthetic short stock",
      ],
      answer: 2,
      explain: "From +stock − call = −put (rearranged from parity): **a covered call = a synthetic short put**, with a payoff shape that is exactly 'selling a put.' This explains why a covered call's risk-reward is nearly identical to selling a cash-secured put (the seed planted in Stage 6).",
    },
    {
      q: "When the **build cost of a synthetic long stock (buy a call + sell a put) is cheaper than going long the real underlying directly**, what does a professional arbitrageur do to lock in a risk-free profit?",
      options: [
        "Just buy a call and wait for it to rise",
        "Short the real underlying + build a synthetic long (buy a call, sell a put), hedging out the direction and locking in the spread (reversal arbitrage)",
        "Buy the real underlying + buy a put",
        "Nothing can be done; parity can't be broken",
      ],
      answer: 1,
      explain: "This is **reversal arbitrage**: the synthetic long is cheap, so **buy the cheap synthetic (buy a call, sell a put) + sell the expensive real underlying (short the stock).** The two P&Ls fully offset, net exposure is zero, and the spread is locked in as a risk-free profit. It's exactly this arbitrage that keeps parity 'welded shut' at every moment (Stage 8.5).",
    },
  ],

  further: [
    { label: "Investopedia: Synthetic Positions", url: "https://www.investopedia.com/articles/optioninvestor/03/090303.asp" },
    { label: "Investopedia: Put-Call Parity", url: "https://www.investopedia.com/terms/p/putcallparity.asp" },
    { label: "Investopedia: Conversion / Reversal Arbitrage", url: "https://www.investopedia.com/terms/c/conversionarbitrage.asp" },
  ],
};
