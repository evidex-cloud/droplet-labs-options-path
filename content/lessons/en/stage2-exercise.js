export default {
  id: "exercise-assignment",
  stage: 2,
  order: 4,
  title: "Exercise, Assignment & Expiry",
  difficulty: 2,
  prereqs: ["call-option", "put-option"],

  oneLiner:
    "What happens at the instant of expiry decides what you ultimately end up holding. **American** can be exercised any time, **European** only at expiry; add **physical vs cash**, and for index options **AM vs PM settlement** (monthly SPX often AM/SOQ, weeklies/0DTE typically PM). Sellers watch **early assignment**; hedgers watch **hedging the wrong print**.",

  intuition: `
When buying options people watch the premium tick up and down, but rarely think clearly about one big thing: **at the instant of expiry, what does this contract turn into?** Does it vanish into thin air, force you to put up cash for stock, or drop a payment straight into your account? Miss this step and a seller can wake up one morning to find 100 shares and a large debit they never expected.

First, let's untangle a few main threads:

- **Exercise**: the buyer invokes the right, actually buying/selling the underlying at the strike. This is the **buyer's choice**.
- **Assignment**: when some buyer exercises, the system **picks one seller at random** from all sellers to deliver. This is what the **seller passively bears**.
- **Expiration**: the end of the contract's life. At expiry, **in-the-money options are usually auto-exercised; out-of-the-money options expire worthless.**

Layer on two more dimensions:

- **American vs European**: American options (most U.S. single-name stocks) can be **exercised on any day before expiry**; European options (most index products like SPX) can be **exercised only on the expiration day itself**.
- **Physical vs cash settlement**: single-stock options are mostly **physically settled** (100 actual shares change hands); index options are mostly **cash-settled** (you can't deliver an index, so the difference is settled in cash).

Here's an example that scares sellers. You sold a 100-strike call (collecting $3 premium), thinking "expiry is far off." But the stock goes ex-dividend tomorrow for $2, and your call is already deep in-the-money — so to capture that $2 dividend, the counterparty **exercises early**. With no warning you're **assigned**, forced to sell 100 shares at $100. This is **early-assignment risk**, the reef that naked/covered-call sellers must watch most closely.

**In this lesson we break "the instant of expiry" into six pieces:**

- **① Exercise vs assignment vs expiry: who acts, who bears**
- **② American vs European: can you exercise early**
- **③ Auto-exercise at expiry and the "expire worthless" threshold**
- **④ Early-assignment risk (especially dividends and deep ITM)**
- **⑤ Physical vs cash settlement**
- **⑥ AM vs PM settlement: the print you hedged may not be the settlement print**
`,

  mechanics: `
### ① Exercise, assignment, expiry: three different things

Beginners mix these three words up most easily — pull them apart:

- **Exercise is the buyer's right.** The call/put you hold — **you decide** whether to transact at the strike. The vast majority of traders in fact **don't exercise**: they sell to close before expiry and walk away with the premium difference (covered in the misconceptions of Stage 1.1).
- **Assignment is the seller's obligation.** Whenever a buyer exercises, the clearinghouse **draws a name at random** from the sellers holding the matching short and assigns one to deliver. You **cannot choose** not to be assigned — you accepted that risk the moment you sold the option.
- **Expiration is time's endpoint.** A contract still open at this instant is either processed if in-the-money (auto-exercised) or expires worthless if out-of-the-money.

> One line of contrast: **the buyer holds the initiative on the action "exercise," the seller bears the passive outcome "being assigned," and "expiry" is the common deadline for both sides.**

### ② American vs European: can you exercise early

The only difference is "**when you can exercise**":

- **American options**: exercisable on **any trading day** before expiry. U.S. **single-stock options are almost all American** — so sellers must guard against early assignment **the entire time**.
- **European options**: exercisable **only on the expiration day**. Most **index options (SPX, SPXW, etc.) are European**, with no early exercise at all, and "cleaner" pricing too (Stage 4.1's Black-Scholes models the European case precisely).

In practice, "early exercise" of American options actually **happens rarely** — because exercising early throws away the remaining time value, usually worse than just selling. The **main exceptions**: a call **before an ex-dividend date** when deep in-the-money (to grab the dividend), and a put when **deep in-the-money** with time value near zero. The next piece covers both in detail.

### ③ Expiry: auto-exercise and expiring worthless

At expiry, the broker/clearinghouse processes things automatically by rule:

- **In-the-money (ITM) options are usually auto-exercised.** The U.S. OCC has an "**Exercise-by-Exception**" rule: options that are in-the-money by a certain threshold at expiry (historically **$0.01** has been common) are auto-exercised with no action from you.
- **Out-of-the-money (OTM) options expire worthless** — this is what people mean by "**expires worthless**." The buyer loses the entire premium, while the seller **keeps the full premium** they originally collected.
- **The edge case (pin risk)**: at expiry the underlying is **stuck right near the strike**, flip-flopping between in- and out-of-the-money at the last moment, so the seller has no idea whether they'll be assigned or need to hedge — the most awkward spot on expiration day.

> A practical reminder for sellers: even if you sold an **out-of-the-money** call, don't assume it will surely expire worthless and leave it alone. If the underlying suddenly surges past the strike near expiry, you can be assigned after the close. Either **buy to close** ahead of time, or make sure you have the **shares/cash ready** to deliver.

### ④ Early-assignment risk: dividends and deep ITM

This is the piece sellers most need to burn into memory. **Early assignment** is only worth the counterparty's while in two situations:

- **Call + impending ex-dividend**: the day before a stock's ex-dividend date, a holder of a deep ITM call will exercise early **to capture the dividend** (exercising delivers the stock and entitles them to the dividend, whereas the call itself pays nothing). If you're the seller of a **covered call** or a **naked call**, you can be assigned the night before ex-dividend, forced to surrender 100 shares at the strike, missing the dividend and disrupting your position.
- **Put + deep ITM + time value ≈ 0**: when a deep ITM put's remaining time value is near zero, the holder may exercise early to **collect cash sooner and earn interest on it**. A put seller (e.g. a cash-secured put, mentioned in Stage 2.5) can be assigned early and put the stock.

**How to guard against it**: as an **ex-dividend date nears**, a seller checks their in-the-money short calls and weighs buying to close early; use **spreads** (buy a protective leg) to cap the tail risk of a one-sided naked short. Market makers have dedicated models for the probability of such early exercise — for you, remembering that the combination "**ex-dividend + deep ITM**" is the hot zone for early assignment is already plenty useful.

### ⑤ Physical vs cash settlement

"How it settles" at expiry comes in two kinds:

- **Physical settlement**: the underlying actually changes hands. **Single-stock options** are mostly physical — a call exercised means the seller **surrenders 100 shares** at the strike and the buyer pays to take delivery; a put exercised means the seller **buys 100 shares** at the strike. So a single-stock option seller can end up with a 100-share position appearing or vanishing at expiry.
- **Cash settlement**: the underlying does not change hands; **the difference is settled directly in cash.** **Index options** (SPX, NDX, etc.) must work this way — you can't "deliver an S&P 500 index," so at expiry the difference between the settlement price and the strike, **× the multiplier**, is credited/debited in cash. This also makes index options naturally **free of the take-delivery hassle, and mostly European** — especially well suited for portfolio hedging.

> The money scale is still **×100** (an index option's multiplier can differ — SPX, for instance, is 100, at $100 per point). A single-stock call worth $5 in-the-money, when exercised, is the physical transaction "buy 100 shares at the strike" for the buyer; if cash-settled, it simply settles a cash difference of 5 × 100 = **$500**.

### ⑥ AM vs PM settlement: the wrong print is a real footgun

Cash settlement still asks: **which print?**

- **AM settlement**: monthly SPX often uses the **SOQ** (Special Opening Quotation), not Friday's close you watched.
- **PM settlement**: most **SPX weeklies and 0DTE** use a regular-session close-related print.
- **SPY**: American physical, follows the shares, not the SOQ.

The footgun: you thought you were hedging **Friday's close**; the contract settles the **Monday morning AM print** — overnight futures gap, hedge point misses. 0DTE is mostly PM, but do not treat the words "index options" as one print (product map: Stage 2.7).

String the six together and you can **arrange things proactively** before expiry: close what should be closed, ready shares or cash, watch early assignment into dividends, and **ask AM vs PM** — rather than waking up to unexpected shares, a debit, or a cash difference off the wrong print.
`,

  demo: "exercise-sim",

  analogy: `
Exercise and assignment are like a **gift voucher with a redemption deadline**.

You hold a voucher that "**buys this item for $100**" (a call option). **Whether to redeem it is your right** (exercise) — the item is going for 130, of course you redeem and net a gain; it's at 70, you tear up the voucher as if you never bought it (expire worthless).

The **shop that issued the voucher** (the seller) is the passive one: as long as someone shows up with a voucher to redeem, the shop **must** supply the goods at $100 (deliver). If it issued ten thousand vouchers and three thousand people show up today, it pulls stock **at random** to fulfill them — this is **assignment**, and the issuer can't pick "who not to sell to."

- **American voucher**: redeemable **any time** during its validity → the shop must **stock up daily** against a run (early assignment).
- **European voucher**: redeemable only on the **final day** → the shop only needs to stock up that day.
- **Physical redemption**: actually handing you the goods (single-stock options deliver shares); **cash redemption**: the shop just **pays you the difference in cash** (index options).

Remember the logic of this voucher: **the holder holds the initiative, the issuer is randomly drawn to deliver** — and you'll never confuse exercise with assignment again.
`,

  misconceptions: [
    "**\"If you buy an option, you must exercise it at expiry for it to count.\"** — No. The vast majority of traders **sell to close before expiry**, taking the premium difference, and never exercise. Exercise is just an option for the buyer, not an obligation.",
    "**\"A seller can choose not to be assigned.\"** — You can't. Assignment is drawn **at random** by the clearinghouse from the sellers, and you cannot refuse it. You accepted assignment risk the moment you sold the option — which is exactly why sellers post margin.",
    "**\"American options get exercised early all the time.\"** — In reality it's rare. Early exercise throws away time value and is usually not worth it. The **main exceptions are a call deep ITM before a dividend, and a put deep ITM with time value ≈ 0** — otherwise early-assignment probability is low.",
    "**\"An out-of-the-money option will surely expire worthless, so I can ignore it.\"** — Dangerous. If the underlying suddenly crosses the strike near expiry, the seller can be assigned after the close. Watch OTM shorts too, buying to close early or readying shares/cash if needed.",
    "**\"All options deliver stock at expiry.\"** — No. **Index options (like SPX) are cash-settled**, settling the difference in cash and mostly European; only **single-stock options** and the like physically deliver 100 shares. Cash still asks AM vs PM.",
  ],

  quiz: [
    {
      q: "Regarding **exercise** and **assignment**, which is correct?",
      options: [
        "Exercise is the seller's right, assignment is the buyer's obligation",
        "Exercise is the buyer's active choice, assignment is a delivery obligation allocated at random among sellers",
        "Both are decided at random by the broker",
        "Assignment can only happen on the expiration day",
      ],
      answer: 1,
      explain: "**Exercise is the buyer's right** (the buyer decides whether to transact at the strike); **assignment is the seller's passive obligation** (when a buyer exercises, the clearinghouse draws one seller at random to deliver). For American options, assignment can happen on any day before expiry.",
    },
    {
      q: "In which situation is a **call seller most likely to be assigned early**?",
      options: [
        "The call is deep OTM with a long time to expiry",
        "The underlying is about to go ex-dividend, and the call is already deep ITM",
        "Implied volatility suddenly drops",
        "The underlying trades flat",
      ],
      answer: 1,
      explain: "**Pre-dividend + deep ITM call** is the hot zone for early assignment: the counterparty exercises early to grab the dividend. A covered/naked call seller should check their in-the-money shorts as the ex-dividend date nears and weigh buying to close early.",
    },
    {
      q: "How does an SPX (S&P 500 index) option settle at expiry?",
      options: [
        "Physical settlement: delivery of a basket of S&P 500 constituents",
        "Cash settlement: the difference between settlement price and strike is settled in cash, and it's mostly European",
        "Auto-rolled to the next month",
        "It only settles if you exercise manually",
      ],
      answer: 1,
      explain: "An index can't be physically delivered, so SPX and other index options are **cash-settled** — the difference × the multiplier is settled in cash, and they're mostly **European** (exercisable only at expiry), with no early exercise or take-delivery hassle.",
    },
    {
      q: "A call option is **out-of-the-money** at expiry (underlying < strike). What usually happens?",
      options: [
        "It's auto-exercised and the buyer takes delivery",
        "It expires worthless — the buyer loses the entire premium, the seller keeps the entire premium",
        "It auto-rolls to next week",
        "The seller must pay out the intrinsic value",
      ],
      answer: 1,
      explain: "An OTM option **expires worthless**: with no intrinsic value, the buyer loses the entire premium and the seller pockets the full premium they originally collected. Only in-the-money options are auto-exercised (Exercise-by-Exception).",
    },
    {
      q: "You hedge with SPY options, thinking “track Friday’s close”; the other side holds a **monthly SPX**. What is the easy footgun?",
      options: [
        "Both are American physical, so the settlement print must match",
        "Monthly SPX is often AM/SOQ; SPY is American physical and follows the shares — the close you hedged may not be the index settlement print",
        "SPX delivers a basket of stocks, so it is more accurate",
        "All 0DTE is AM-settled",
      ],
      answer: 1,
      explain: "Monthly SPX is often **AM/SOQ**; SPY is American physical. Weekly/0DTE SPX is typically **PM**. Mixing hedge points is the classic footgun. Product map: Stage 2.7.",
    },
  ],

  further: [
    { label: "OCC: Expiration & Exercise-by-Exception rules", url: "https://www.theocc.com/" },
    { label: "Investopedia: Assignment & Early Exercise", url: "https://www.investopedia.com/terms/a/assignment.asp" },
    { label: "CBOE: Cash-Settled vs Physically-Settled Options", url: "https://www.cboe.com/education/" },
  ],
};
