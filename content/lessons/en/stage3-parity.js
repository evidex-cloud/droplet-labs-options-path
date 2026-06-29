export default {
  id: "put-call-parity",
  stage: 3,
  order: 2,
  title: "Put-Call Parity: The Conservation Law",
  difficulty: 2,
  prereqs: ["call-option", "put-option"],

  oneLiner:
    "**Put-call parity** is the options world's \"conservation law\": a call and a put at the same strike and expiry are bound together by one iron rule — `C − P = S − K·e^(−rT)`. It welds calls, puts, the underlying and cash into one whole — and violate it, and someone can arbitrage risk-free.",

  intuition: `
Physics has conservation laws: energy is neither created nor destroyed. The options world has a law just as hard, called **put-call parity**. It says: **a call and a put at the same strike and the same expiry can't be priced independently** — the gap between them is locked, exactly, by the underlying price and the time value of cash.

Let's build the intuition first with a "bare version" that ignores interest. Let the underlying trade at S, with both strikes K and the same expiry:

> **Buy one call + sell one put (same K, same expiry) ≈ simply holding the underlying.**

Why? Split it into two expiry cases:
- **At expiry S > K**: your call is in-the-money, you exercise to buy the underlying at K (gaining S−K); the put you sold expires worthless. Net effect: you took delivery of the underlying at K.
- **At expiry S < K**: your call expires worthless; but the put you sold gets exercised against you, forcing you to buy the underlying at K. Net effect: you still took delivery at K.

Rise or fall, **this "buy call + sell put" combination always has you buy the underlying at K** — which is the same as "just holding the underlying, only paying the K later, at expiry"! Patch in the time value of "paying K later" with discounting, and you get the exact version:

$$C − P = S − K·e^{−rT}

This is the parity formula. The left side is the price gap between the two options; the right side is "the underlying's spot price minus the present value of the strike." It means: **knowing the call price, the underlying price and the rate, the put price is uniquely pinned down** — and vice versa. You can't let the call and the put wander off on their own — they're two ends of one rope.

This identity is astonishingly powerful. It tells you directly: **any position can be "synthesized" from other things** (Stage 7.6). "Buy call + sell put" = synthetic long underlying; "hold stock + buy put" = synthetic long call (which is why a protective put is shaped like a call). It's also the **arbitrageur's searchlight**: any day this equation fails to hold, there's a risk-free money printer sitting there waiting to be hauled off.

**In this lesson we break parity into five pieces:**

- **① The conservation law in one line: C + cash = P + underlying**
- **② "Proving" it with two portfolios (same payoff → same price)**
- **③ What K·e^(−rT) is: the present value of the strike**
- **④ Synthetics: parity is a "universal assembly manual"**
- **⑤ How to catch the arbitrage when parity is violated**
`,

  mechanics: `
### ① The standard form of the conservation law

Shuffle the parity formula's terms into a more memorable "both sides balanced" form (same strike K, same expiry T):

$$C + K·e^{−rT} = P + S

**Left side**: "buy one call" + "deposit cash that grows to exactly K at expiry." **Right side**: "buy one put" + "hold one share of the underlying." This identity says: **these two portfolios have the exact same payoff at expiry, so they must cost the same today** — otherwise there's arbitrage.

Verify the expiry payoff (let the expiry price be S_T):
- **Left side**: cash grows to K; the call is worth S_T−K when S_T>K, else 0. Total = max(S_T, K).
- **Right side**: the underlying is worth S_T; the put is worth K−S_T when S_T<K, else 0. Total = max(S_T, K).

Both sides equal **max(S_T, K)** at expiry — the exact same payoff curve. **Same payoff ⇒ same price today**: that's the whole secret of parity.

### ② "Proving" it with two portfolios

The no-arbitrage proof's logic is exceptionally clean, in a single line: **if two portfolios have the same payoff in every expiry scenario, they must trade at the same price today.** Otherwise — buy the cheap one, sell the expensive one, and lock in a profit that's in hand today and risk-free in the future.

List the two portfolios' expiry payoffs side by side (for the derivation only; the text doesn't render an actual table):

- When S_T > K: portfolio A "call + cash K·e^(−rT)" = (S_T−K) + K = **S_T**; portfolio B "put + underlying" = 0 + S_T = **S_T**.
- When S_T ≤ K: portfolio A = 0 + K = **K**; portfolio B = (K−S_T) + S_T = **K**.

In both cases the two portfolios are equal. So **price(A) = price(B)**, i.e. C + K·e^(−rT) = P + S. Note this argument **requires no assumption about "how the stock will move"** — you need neither the volatility nor the probability of a rise or fall. It comes purely from "no arbitrage" (Stage 3.3 pushes this replication/hedging idea to its limit, using it to price a single option).

### ③ K·e^(−rT): the present value of the strike

The **K·e^(−rT)** that recurs in the formula is "the strike K, to be paid at expiry in the future, discounted to what it's worth today" — its **present value**. This is the source of the rate dial from the previous lesson (Stage 3.1):

- **The higher the rate r**, the smaller K·e^(−rT), so the larger C − P = S − K·e^(−rT) → **the call is relatively more expensive than the put.** This is perfectly consistent with "a higher rate is bullish for calls."
- **The longer the expiry T**, the more discounting, the smaller K's present value, amplifying the effect in the same direction.

> A small detail: if the underlying **pays a dividend** (yield q), parity replaces S with the "dividend-present-value-stripped" S·e^(−qT), becoming C − P = S·e^(−qT) − K·e^(−rT). Intuition: the option side doesn't receive dividends, so the underlying side must first leak the present value of the dividend. Rates and dividends show up here one up, one down, symmetrically — echoing the direction table of Stage 3.1.

### ④ Synthetics: parity is a "universal assembly manual"

Rearrange the parity formula, and every way of rearranging it is a manual for "assembling some position out of other parts." This is the foundation of **synthetics** (Stage 7.6):

- **Synthetic long underlying** = buy call + sell put (same K, same expiry). Because C − P = S − K·e^(−rT), this combination's P&L slope is the same as holding the underlying.
- **Synthetic call** = hold the underlying + buy put (i.e. S + P = C + K·e^(−rT)). **This explains why a "protective put" has the exact same P&L shape as a long call** — it was a synthetic call all along (Stage 6.4).
- **Synthetic put** = short the underlying + buy call.
- **Synthetic cash (a risk-free bond)** = hold stock + sell call + buy put = a locked-in K·e^(−rT), which is the skeleton of the **collar / conversion arbitrage**.

Once you treat parity as an "assembly manual," option strategies shift from "memorizing dozens of structures" to "deriving from the conservation law" — any leg can be synthesized from the other three things (call, put, underlying, cash).

### ⑤ When parity is violated: catching the arbitrage

In reality parity occasionally "appears" to break (delayed quotes, mismatched dividend expectations, borrow costs, etc.). The moment **C − P ≠ S − K·e^(−rT)**, there's a "free lunch" the **no-arbitrage** principle forbids, and arbitrageurs haul it off like this:

**Example**: S=100, K=100, r=4%, T=0.5 years. In theory C − P should equal S − K·e^(−rT) = 100 − 100·e^(−0.02) = **1.98**.
- Suppose the market shows **C=8.50, P=6.00**, so C − P = 2.50, **0.52 above** the theoretical 1.98 — the call is relatively too expensive.
- **The arbitrage** (a "reversal" / conversion): **sell the expensive-side portfolio, buy the cheap-side one.** That is: sell the call, buy the put, buy the underlying, borrow K·e^(−rT) in cash. You net 0.52/share today (×100 = $52 per set), while at expiry the two sides' payoffs cancel — risk-free.
- Conversely, if C − P is **below** 1.98 (the call too cheap), do the "conversion": buy the call, sell the put, short the underlying, and deposit K·e^(−rT).

The very existence of this risk-free money printer is what guarantees it almost never exists — if there's a real crack, market makers and quant programs (including today's automated arbitrage agents) erase it in milliseconds. So parity isn't just a formula, it's **the market's self-correcting mechanism**: precisely because everyone can arbitrage, prices stay nailed in line. The demo on the right lets you nudge a quote off parity by hand and watch the arbitrage profit pop right out.
`,

  demo: "parity-explorer",

  analogy: `
Put-call parity is like **triangular arbitrage in currencies**.

Suppose you can swap CNY for USD, USD for EUR, and EUR back to CNY. These three exchange rates **can't be set independently** — they're bound by one iron rule: go around the loop and you must come back with no gain and no loss. If one day the three rates happen to combine into "+1% around the loop," people immediately spin the loop frantically to arbitrage, until the crack is erased and the three rates rebalance.

In the options world, **calls, puts, the underlying and cash** are those "four currencies," and the parity formula C + K·e^(−rT) = P + S is that "no free lunch around the loop" iron rule:

- You can "swap" from a call to a put (same K, same expiry), and what's in between is exactly that "underlying minus present value of strike" stretch.
- The moment any price drifts off this iron rule, the "loop arbitrageurs" pour in and pull it back to parity.

So remember: **a call and a put are never two independent prices, but two ends of one rope, tied together by an exchange-rate-like conservation law.** Know one and the other is already determined.
`,

  misconceptions: [
    "**\"Call and put prices are set independently.\"** — No. At the same strike and expiry, they're welded by parity `C − P = S − K·e^(−rT)`: know one, plus the underlying price and rate, and the other is uniquely determined. They're two ends of one rope.",
    "**\"Parity assumes the stock will rise or fall, and needs the volatility.\"** — Not at all. Parity is derived purely from **no arbitrage** (two portfolios with the same payoff must cost the same), containing no assumption about future moves or probabilities. This is exactly why it's \"harder\" and more universal than Black-Scholes (Stage 3.3).",
    "**\"The K·e^(−rT) in the formula is an optional correction term.\"** — It's the core. K·e^(−rT) is the **present value of the strike**, precisely the source of rates' effect on option prices (Stage 3.1). Ignore it and you'll miscompute the call-put gap, and never understand why rates/dividends move one up and one down.",
    "**\"Parity only holds for European options, useless in practice.\"** — The strict equality does hold for **European, no-early-exercise** options; for American options the early-exercise right turns it into an inequality range. But it remains the daily tool for building **synthetics** (Stage 7.6) and judging whether options are cheap or dear, and market makers watch it constantly.",
    "**\"When parity is violated, ordinary people can easily arbitrage and get rich.\"** — In reality such cracks are tiny and extremely short-lived, and after trading all four legs simultaneously and netting out bid-ask spreads, borrow and transaction costs, there's usually no profit left. It's more the object of **market-maker/quant programs** erasing it in milliseconds — but precisely because of that, prices stay nailed to parity.",
  ],

  quiz: [
    {
      q: "Which of the following is the standard form of put-call parity (same strike K, same expiry T)?",
      options: [
        "C + P = S + K",
        "C − P = S − K·e^(−rT)",
        "C × P = S × K",
        "C − P = K − S",
      ],
      answer: 1,
      explain: "Parity is **C − P = S − K·e^(−rT)**, equivalently C + K·e^(−rT) = P + S. It binds the call, the put, the underlying and the \"present value of the strike\" together — an identity under no arbitrage.",
    },
    {
      q: "The combination \"buy one call + sell one put (same strike, same expiry)\" is equivalent to holding what?",
      options: [
        "Synthetic short underlying",
        "Synthetic long underlying",
        "A risk-free bond",
        "A straddle",
      ],
      answer: 1,
      explain: "From C − P = S − K·e^(−rT), \"buy call + sell put\" has the same P&L slope as holding the underlying — it's a **synthetic long underlying**. This is the textbook use of parity as a \"synthetics assembly manual\" (Stage 7.6).",
    },
    {
      q: "S=100, K=100, r=4%, T=0.5 years. The call is quoted 8.50, the put 6.00. Parity's theoretical gap C−P should be 1.98, but the actual C−P=2.50. How do you arbitrage?",
      options: [
        "Buy the call, sell the put, buy the underlying",
        "Sell the call, buy the put, buy the underlying (plus borrow the present value of K)",
        "Buy the call, buy the put",
        "Do nothing — parity is never violated",
      ],
      answer: 1,
      explain: "The actual gap (2.50) exceeds the theoretical (1.98), so the **call is relatively too expensive**. Arbitrage = sell the expensive side, buy the cheap side: **sell the call, buy the put, buy the underlying, borrow K·e^(−rT)**, netting about 0.52/share today (×100 = $52), with the two sides' payoffs canceling at expiry — risk-free.",
    },
    {
      q: "All else equal, the **risk-free rate r rises**. What does this mean for the parity relation C − P = S − K·e^(−rT)?",
      options: [
        "C − P shrinks (the call gets relatively cheaper)",
        "C − P grows (the call gets relatively more expensive)",
        "C − P is unchanged",
        "The equation no longer holds",
      ],
      answer: 1,
      explain: "r rises → K·e^(−rT) (the present value of the strike) shrinks → the right side S − K·e^(−rT) grows → **C − P grows**, i.e. the call is relatively more expensive than the put. This is exactly the direction of Stage 3.1's \"a higher rate is bullish for calls, bearish for puts.\"",
    },
  ],

  further: [
    { label: "Investopedia: Put-Call Parity", url: "https://www.investopedia.com/terms/p/putcallparity.asp" },
    { label: "Khan Academy: Put-Call Parity (derivation walkthrough)", url: "https://www.khanacademy.org/economics-finance-domain/core-finance/derivative-securities/put-call-parity/v/put-call-parity" },
    { label: "OIC: Put-Call Parity & Synthetics", url: "https://www.optionseducation.org/" },
  ],
};
