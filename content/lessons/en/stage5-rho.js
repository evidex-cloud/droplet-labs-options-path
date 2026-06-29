export default {
  id: "rho-dividends",
  stage: 5,
  order: 6,
  title: "Rho & Dividends: Rates and Payouts",
  difficulty: 3,
  prereqs: ["greeks-overview"],

  oneLiner:
    "**Rho** measures how much the option price changes for every 1 percentage point move in the risk-free rate — positive for calls, negative for puts, the most ignored Greek in normal times, but not to be underestimated on **LEAPS (long-dated options).** **Dividends q** do the opposite: payouts depress calls and lift puts, and are the main trigger for **early exercise of American calls** (leading to Stage 2.4). Both quantities relate to the \"cost/benefit of holding the underlying,\" the sixth and seventh inputs of Black-Scholes.",

  intuition: `
Of the five Greeks, **Rho** is the most neglected. The reason is simple: for short options expiring in weeks or months, a rate move's effect is small enough to ignore. But it's by no means useless — its stage is just on **long-dated options (LEAPS, expiring a year or two out).** Add a factor beginners often miss yet that genuinely affects pricing — the **dividend q** — and this lesson clears up both quantities related to **holding cost**: rates and payouts.

**First, Rho.** It answers: the risk-free rate (the r of Stage 4.1) moved, how does the option price change?

- **Call Rho is positive**: rates up, the call gets more expensive.
- **Put Rho is negative**: rates up, the put gets cheaper.

Why? A clean intuition: buying a **call** is like "using a little money to lock in the right to buy the underlying at K in the future" — you've **deferred** paying that strike K. The higher the rate, the lower the present value of that "K to be paid later," which is a bigger discount for you, so the call is worth more. The put is the reverse: you've locked in the right to **receive** K in the future, and the higher the rate, the lower the present value of that future K, the worse for you, so the put is cheaper. (This is exactly the K·e^(−rT) term in put-call parity at work, Stage 3.2.)

Feel the "negligible on short options, important on long ones" with the engine (K=100, σ=20% ATM call):

- 30 days: Rho ≈ **0.042/1%** — a 1-point rate move affects only 4 cents, truly negligible.
- 365 days: Rho ≈ **0.52/1%** — already not small.
- 730 days (a 2-year LEAPS): Rho ≈ **1.03/1%** — a 1-point rate move moves the option more than 1!

An intuitive comparison: a 2-year ATM call, with rates rising from 2% to 6% (up 4 points), goes from about 13.10 to about 17.20 — **a gain of 4, all thanks to Rho.** So when buying LEAPS, or in years of violent rate moves, Rho must enter your field of view.

**Now dividends q.** Holding stock earns dividends, but holding **options doesn't.** How does this affect pricing?

- A stock pays a dividend before expiry, and on the ex-dividend date the stock price falls by roughly the dividend amount. **Expected dividends depress the underlying's forward price**, so: **calls get cheaper, puts get more expensive** (the opposite direction to rates).
- Computed (1-year ATM, r=4%): as the dividend yield q rises from 0% to 5%, **the call falls from 9.93 to 7.15** and **the put rises from 6.00 to 8.10.** The higher the dividend, the more the call is depressed and the more the put benefits.

And dividends hide a subtler, more important consequence: they're the main reason **American calls get exercised early** (Stage 2.4). Normally an American call shouldn't be exercised early (you'd throw away time value for nothing), but **if a dividend is large enough**, exercising the day before the ex-dividend date to take the stock and collect the dividend can be more worthwhile than continuing to hold the option — one of the few cases where "early exercise of an American call" is rational.

**In this lesson we break Rho and dividends into five pieces:**

- **① What Rho is: the option's change per 1% rate move (units)**
- **② Why call +Rho, put −Rho (the present value of deferring/advancing payment of K)**
- **③ Rho is significant only on LEAPS: negligible on short options, important on long ones**
- **④ Dividend q: depresses calls, lifts puts (the sixth input)**
- **⑤ Dividends drive early exercise of American calls (leading to Stage 2.4)**
`,

  mechanics: `
### ① Rho's definition and units

Rho is the option price's sensitivity to the **risk-free rate r:**

$$Rho = ΔV / Δr   (as the rate moves, how the price changes; positive for calls, negative for puts)
$$**Units**: this course's engine (\`_bs.js\`) uses the price change per **+1 percentage point** move (r moves +0.01, e.g., 4%→5%). So Rho = 0.52 reads as "**per 1 point the rate rises, up 0.52 per share.**" One contract ×100 ≈ 52.

Why is Rho the most ignored Greek? Because in "normal" markets, rates don't move several percentage points in a day, and short options' Rho is small to begin with. But in a year like 2022–2023 when rates soared from 0 to 5%, or when trading long-dated LEAPS, Rho's cumulative effect is considerable — it shifts from "negligible" to "must compute."

### ② The origin of call +Rho, put −Rho

Lay out the two Black-Scholes formulas (Stage 4.1) and see where r is:

$$Call C = S·N(d1) − K·e^(−rT)·N(d2)
$$Put  P = K·e^(−rT)·N(−d2) − S·N(−d1)
$$The key is **K·e^(−rT)** — the **present value** of the strike. As r rises, e^(−rT) shrinks and K's present value is depressed:

- In the **call**, K·e^(−rT) is a **subtracted term** (the money you'll pay in the future). Its shrinking means "the present value of the K you'll pay is lower," favoring the buyer → **the call gets more expensive (+Rho).** Equivalent intuition: buying a call ≈ borrowing to buy the stock (holding a long exposure with leverage), and the higher the rate, the more valuable this "deferred payment" leverage.
- In the **put**, K·e^(−rT) is an **added term** (the money you'll receive in the future). Its shrinking means "the present value of the K you can receive is lower," hurting the put buyer → **the put gets cheaper (−Rho).** Equivalent intuition: buying a put ≈ deferring the sale of the stock, and the higher the rate, the more interest you forgo by deferring the receipt.

> In one line: **rates affect "the present value of the strike's cash flow."** A call defers paying (rate up = a discount), a put defers receiving (rate up = a loss). This is fully consistent with put-call parity C − P = S − K·e^(−rT) (Stage 3.2): r up, the right side's K·e^(−rT) shrinks and the whole thing grows, so C is worth more relative to P.

### ③ Rho is significant only on long-dated options

Rho grows roughly **linearly** with time to expiry T (a form like K·T·e^(−rT)·N(d2)), so:

$$ATM call Rho (K=100, σ=20%) by expiry: 30d≈0.042   1yr≈0.52   2yr≈1.03
$$- **Short options (days to months)**: Rho is small, and the effect of rate moves is completely drowned out by the other Greeks (Delta, Theta, Vega). Intraday and weekly traders can essentially ignore Rho.
- **Long-dated options / LEAPS (1–2 years+)**: Rho is significant. Buying a 2-year call is essentially **using the option to substitute for "financing the purchase of stock"** — you enjoy the long exposure without paying in full, and the rate becomes the cost of this "implicit financing," which Rho measures. In a rising-rate cycle, LEAPS calls benefit from +Rho while LEAPS puts suffer.

Practical tip: when running **cross-expiry** structures (like a long LEAPS + a short-term hedge) or on **rate-sensitive underlyings** (bank stocks, REITs), put Rho on your risk sheet; for pure short-term directional trades, don't fuss over it.

### ④ Dividend q: the sixth input

Black-Scholes's "standard five inputs" are S, K, T, r, σ, but real markets can't do without a sixth — the **dividend yield q** (mentioned at the end of Stage 4.1; the \`_bs.js\` engine carries a q parameter). BS with continuous dividends multiplies the underlying term by e^(−qT):

$$Call C = S·e^(−qT)·N(d1) − K·e^(−rT)·N(d2)
$$Put  P = K·e^(−rT)·N(−d2) − S·e^(−qT)·N(−d1)
$$Intuition: **the option holder doesn't get the dividend, but the stock price falls at the ex-date.** Expected dividends effectively "subtract" a portion of the underlying's forward value in advance (S·e^(−qT) is smaller than S), so:

- **Calls get cheaper**: the underlying's "effective forward price" is depressed by the dividend, and the right to the upside is worth less.
- **Puts get more expensive**: the underlying's forward price is depressed, and the right to the downside is worth more.
- Computed (1-year ATM, r=4%, q: 0%→5%): call 9.93→**7.15**, put 6.00→**8.10.**

Note q and r point in **exactly opposite directions** in the formula: r up lifts calls and depresses puts, q up depresses calls and lifts puts. You can think of **(r − q)** as "the net cost/benefit of holding the underlying" — exactly why (r − q) appears in the d1, d2 formulas (see the d1d2 function in \`_bs.js\`). High-dividend stocks (or indices and FX, whose "dividends" are the dividend yield and the foreign interest rate respectively) must factor in q, or calls will be systematically overestimated.

### ⑤ Dividends drive early exercise of American calls

This is dividends' most practical consequence, directly echoing Stage 2.4 (exercise and assignment). First recall a classic conclusion: **with no dividends, an American call should never be exercised early** — early exercise throws away the remaining time value, worse than just selling the option. But **a large dividend** breaks this conclusion:

- You hold a deep-ITM **American call**, and the underlying goes ex-dividend next week with a large payout.
- If you **exercise before the ex-date**, you immediately take the stock, become a holder of record, and collect the dividend.
- The cost is forgoing the option's remaining time value. **When the dividend's value > the remaining time value, early exercise becomes worthwhile** — one of the few cases where early exercise of an American call is rational.

The implication for the **seller** is more direct: if you sold (naked or covered) a deep-ITM call, you must be **highly alert to early assignment before the ex-date** (the assignment risk of Stage 2.4). Being assigned means you have to hand over the stock early, miss the dividend, and disrupt your plan. So **near a large ex-dividend date, the early-exercise/assignment risk of deep-ITM calls spikes** — a day to mark in red on the options calendar.

> Aside: the early-exercise logic for American **puts** is the opposite — when rates are high and the put is deep-ITM, exercising early to recover cash and earn interest can be worthwhile (unrelated to dividends, but sharing a source with Rho). But this goes beyond this lesson; it's saved for Stage 9.5 (American options and early exercise).

Stringing the five pieces together: **Rho measures the price change per 1% rate move, call +Rho and put −Rho, rooted in "the present value of the strike's cash flow" (a call defers paying, a put defers receiving); Rho grows linearly with expiry, negligible on short options and significant on LEAPS (up to 1 per 1% on a 2-year); the dividend q is the sixth input, pointing opposite to r — depressing calls and lifting puts, with (r−q) the net cost of holding the underlying; and a large dividend induces early exercise and assignment of American calls, a key risk point on the options calendar.** With that, all five first-order Greeks are covered. In the final lesson, we **sum** them up across the whole portfolio and take a glimpse of the second-order Greeks market makers can't do without, Vanna/Charm (Stage 5.7).
`,

  demo: "rho-explorer",

  analogy: `
Rho and dividends are like **the interest rate and the rent in "buying a home in installments."**

Think of "buying a call option" as **using a small deposit to lock in the right to buy a home in full in the future** — you've **deferred** that large home payment (the strike K) until later.

- **The interest rate (Rho)**: money has time value. The higher the rate, the lower today's present value of that "home payment **deferred to the future**" — meaning you got a free discount on "paying later." So **the higher the rate, the more valuable this "deferred-payment lock-in" right (the call) (+Rho).** Buying a put is the reverse: you locked in **receiving a sum** in the future, and the higher the rate, the less that future money is worth (−Rho). And this "discount" accumulates over a long time before it shows, so only a **long-dated contract (LEAPS)** reveals Rho's weight — lock in for a year or two and the interest difference is large enough.
- **The dividend (q)**: it's like the home still **collecting rent for the original owner before you officially take title.** As someone who "only holds the right to buy, not yet titled" (the option holder), you **don't get this rent**, and the home's value is correspondingly **discounted** because "the rent was taken first by the original owner." The higher the rent (dividend), the more your "buy later" right (the call) loses out and the cheaper it gets; while the "sell later" right (the put) becomes more valuable.

This also explains "a large dividend induces early exercise": if **an especially rich rent is about to be paid**, you might rather **take title now** (exercise early to get the stock) to collect this rent — even at the cost of giving up the flexibility of "waiting and seeing" (time value). When that rent is large enough, taking title early becomes worthwhile.
`,

  misconceptions: [
    "**\"Rho is useless and can be completely ignored.\"** — Basically true for short options, but **Rho is significant on LEAPS (long-dated options)** (a 2-year ATM call has Rho ≈ 1/1%). In years of violent rate moves or when trading long-dated options, Rho must be on the risk sheet. It's just \"low-key,\" not \"useless.\"",
    "**\"A rate rise affects calls and puts the same way.\"** — Opposite directions. **Rate up: calls get more expensive (+Rho), puts get cheaper (−Rho)**, because it depresses the present value of the strike's cash flow (a call deferring payment benefits, a put deferring receipt suffers). This is fully consistent with put-call parity.",
    "**\"Dividends make both calls and puts cheaper.\"** — No. Dividends **depress calls and lift puts** (the opposite direction to rates). Because expected dividends depress the underlying's effective forward price (S·e^(−qT)), the right to the upside depreciates and the right to the downside appreciates. Ignoring q systematically overestimates calls.",
    "**\"American calls should never be exercised early.\"** — True with no dividends, but **a large dividend breaks it**: when a dividend's value exceeds the option's remaining time value, exercising before the ex-date (to take the stock and collect the dividend) becomes worthwhile. This is one of the few cases where early exercise of an American call is rational (Stage 2.4), and a seller's assignment-risk point.",
    "**\"Dividends only affect the stock price, not my option.\"** — They affect it a lot. Dividends enter pricing through q (depressing calls, lifting puts), and also change intrinsic value and the early-exercise decision around the ex-date. To hold or sell options on dividend stocks, you must factor in the ex-date and the dividend amount.",
  ],

  quiz: [
    {
      q: "The risk-free rate rises from 3% to 5%, everything else unchanged. How do the theoretical prices of a **call** and a **put** each change?",
      options: [
        "Call↑, put↓",
        "Call↓, put↑",
        "Both ↑",
        "Both ↓",
      ],
      answer: 0,
      explain: "**Call +Rho, put −Rho**: a rate rise depresses the present value of the strike K·e^(−rT), so the call (deferring payment of K) benefits and gets more expensive, while the put (deferring receipt of K) suffers and gets cheaper. This is consistent with put-call parity C−P = S−K·e^(−rT).",
    },
    {
      q: "Why is **Rho usually worth attention only on LEAPS (long-dated options)**?",
      options: [
        "Because long-dated options have a larger Delta",
        "Because Rho grows roughly linearly with time to expiry T — short options' Rho is small, only long-dated ones are significant",
        "Because short options have no rate exposure",
        "Because long-dated options always have lower volatility",
      ],
      answer: 1,
      explain: "Rho grows approximately linearly with T (30 days≈0.04, 1 year≈0.52, 2 years≈1.03). Short options' rate effect is drowned out by Delta/Theta/Vega; only long-dated LEAPS (essentially holding the underlying via \"implicit financing\") make Rho significant.",
    },
    {
      q: "A stock is about to pay a **large dividend.** All else unchanged, how does this affect the prices of same-expiry calls and puts?",
      options: [
        "Calls get more expensive, puts get cheaper",
        "Calls get cheaper, puts get more expensive",
        "No effect on either",
        "Both get more expensive",
      ],
      answer: 1,
      explain: "Dividends **depress calls and lift puts** (the opposite direction to rates). Expected dividends depress the underlying's effective forward price S·e^(−qT), so the right to the upside depreciates and the right to the downside appreciates. Computed 1-year ATM, q from 0→5%: call 9.93→7.15, put 6.00→8.10.",
    },
    {
      q: "You **sold** a deep-ITM **American call.** Next week the stock goes ex-dividend, paying a **large dividend.** What should you most be wary of?",
      options: [
        "Vega suddenly spiking",
        "Being **assigned early** before the ex-date (the counterparty exercising early to collect the dividend)",
        "Rho turning negative",
        "The option automatically being voided",
      ],
      answer: 1,
      explain: "A large dividend induces **early exercise of a deep-ITM American call**: the counterparty exercises before the ex-date to take the stock and collect the dividend, and will do so when it's worthwhile. As the seller, you face the risk of **early assignment** — forced to hand over the stock and miss the dividend (Stage 2.4). The day before the ex-date is a red alert on the options calendar.",
    },
  ],

  further: [
    { label: "Investopedia: Rho (interest-rate sensitivity)", url: "https://www.investopedia.com/terms/r/rho.asp" },
    { label: "Investopedia: How Dividends Affect Option Pricing", url: "https://www.investopedia.com/articles/active-trading/090115/how-dividends-affect-stock-option-prices.asp" },
    { label: "Wikipedia: Greeks (finance) — Rho", url: "https://en.wikipedia.org/wiki/Greeks_(finance)#Rho" },
  ],
};
