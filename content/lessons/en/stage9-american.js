export default {
  id: "american-pricing",
  stage: 9,
  order: 5,
  title: "American Options & Early Exercise",
  difficulty: 3,
  prereqs: ["binomial-model"],

  oneLiner:
    "An **American option** can be exercised **at any time** before expiry, and this extra freedom makes it always **≥ a comparable European**, the difference being the **American premium**. The classic way to price it is the **binomial tree (Stage 3.4)**: at every node, take the greater of the \"immediate-exercise payoff\" and the \"discounted expected value of continuing to hold.\" The conclusion is counterintuitive — **puts are often worth exercising early, calls almost never** (except before a dividend, Stage 2.4).",

  intuition: `
Recall the difference between European and American (Stage 2.4): **a European option can only be exercised on the expiry day, while an American option can be exercised at any time before expiry.** The vast majority of US single-stock options are **American**. This extra freedom of "exercise anytime" sounds like a small convenience, but behind it lie a profound pricing problem and a string of counterintuitive conclusions.

First establish an inequality, the skeleton of this lesson: **an American option ≥ a comparable European option.** The reason is simple — the American has all the rights of the European, plus the extra option of "being able to exercise early." **An extra option never makes you worse off** (worst case, don't use it), so the American is at least as valuable as the European. The difference between the two is called the **American premium (early-exercise premium)**.

So how do you price an American? The Black-Scholes formula won't do — it only computes Europeans (assuming exercise only at expiry). But the **binomial tree (Stage 3.4)** we learned in the previous chapter is naturally built for this; you just make **one extra judgment** at each node during backward induction:

$$node value = max( immediate-exercise payoff,  discounted expected value of continuing to hold )

- **"Immediate-exercise payoff"** = the intrinsic value obtainable by exercising at that node right now (put max(K−S,0), call max(S−K,0)).
- **"Discounted expected value of continuing to hold"** = like a European, weight the two child nodes by risk-neutral probabilities and discount (Stage 3.5).
- **Take the greater of the two**: if immediate exercise is more profitable, exercise here; otherwise continue holding.

Insert this max at every node and the binomial tree instantly turns from a "European pricer" into an "American pricer." Connecting all the nodes where "exercising early is better" draws an **early-exercise boundary** — cross this line in stock price and you should exercise.

The most counterintuitive part is the conclusion: **an American put is often worth exercising early, while an American call almost never is** (with no dividends). Feel it with the baseline numbers (S=K=100, T=1, r=5%, σ=20%, 200-step binomial tree):
- **Put**: European ≈ 5.56, American ≈ 6.09, American premium ≈ **0.52** — genuinely worth half a dollar more, the early-exercise right has value.
- **Call**: European ≈ 10.44, American ≈ 10.44, **almost not a cent of premium** — the early-exercise option is virtually useless.

Why do put and call, both American, get such vastly different treatment? That's exactly the core this lesson clarifies. The demo on the right prices both European and American puts on one binomial tree, **highlighting the nodes where "early exercise is better"**, letting you see with your own eyes where the premium comes from.

**In this lesson we break American options into five pieces:**

- **① The "extra option" of early exercise: why American ≥ European**
- **② Binomial-tree pricing: max(exercise, hold) at every node**
- **③ The early-exercise boundary: which line in stock price means exercise**
- **④ Why puts are often early, calls almost never (no dividends)**
- **⑤ The exception: American calls before a dividend + how to use the American premium**
`,

  mechanics: `
### ① The "extra option" of early exercise

Decompose an American option into "a European + a right to exercise early." This extra right's value is **always ≥ 0** — you can choose never to exercise early, which degenerates to a European; as long as some moments make early exercise better, it's positive. So:

$$American value = European value + American premium,  American premium ≥ 0

This is a hard **no-arbitrage** constraint (Stage 3.3). There's also a related lower bound: **an American option's value ≥ the immediate-exercise intrinsic value** (otherwise you'd exercise immediately and trade back for free profit). A European has no such lower bound — a deep-ITM European put may even fall below intrinsic value (because you're forced to wait until expiry), while an American won't, because it can exercise anytime to realize intrinsic value. This "≥ intrinsic value" lower bound is exactly the source of the American premium.

> One line: **American = European + the right to "realize intrinsic value anytime."** This right is valuable for puts and (with no dividends) almost worthless for calls — explained below.

### ② Binomial-tree pricing: max(exercise, hold) at every node

The European binomial tree's (Stage 3.4) backward induction is "node value = discounted risk-neutral expectation." An American just adds one max at **every node**:

$$continuation value H = e^{−rΔt}·[ p·V_up + (1−p)·V_down ]
$$immediate-exercise value E = (put) max(K−S, 0)  /  (call) max(S−K, 0)
$$node value V = max( E, H )

The procedure rolls back from expiry just like a European, only every node you fill compares one size:
1. **Terminal nodes**: same as European, V = expiry payoff.
2. **Roll back each interior node**: first compute the continuation value H (using child nodes), then the immediate-exercise value E, and **take the greater**. If E>H, record "exercise early at this node."
3. **Down to the root node**: the root value is the American option's price today.

Just this one-line max difference lets the binomial tree price Americans — which the Black-Scholes formula can't (it has no "node-by-node" layer, nowhere to insert a comparison). This is also why the binomial tree (and finite differences, Stage 9.2) is more general than closed-form formulas for American pricing.

> The demo on the right is exactly this logic: the same CRR tree, run twice — European (take only H) and American (take max(E,H)) — coloring and highlighting the American nodes where E>H, the difference being the American premium. Increase the step count and both prices get finer.

### ③ The early-exercise boundary

Connecting all the nodes where "early exercise is better (E>H)" on the "stock price × time" plane gives an **early-exercise boundary**:
- **American put**: the boundary is a **lower curve**. When the stock **falls below the boundary** (deep enough in the money) you should exercise — and the closer to expiry, the closer this boundary gets to the strike K.
- **American call (no dividends)**: there's simply **no** meaningful early-exercise boundary (the boundary is at infinity) — continuing to hold is never worse than exercising at any time.

This boundary is the solution to an **optimal-stopping** problem — "at which moment to stop and exercise." Mathematically it's a free-boundary problem, exactly the kind of object that finite differences (Stage 9.2) and the binomial tree excel at solving numerically, and also the conceptual prototype for later reinforcement-learning **optimal execution**.

### ④ Why puts are often early, calls almost never (no dividends)

This is the most counterintuitive and most worth-memorizing conclusion of the whole lesson. The key is **what early exercise gives up and what it obtains early**.

**American call (no dividends): almost never exercise early.** To exercise an ITM call early, you must **immediately pay out the strike K** to buy the stock, so:
- **You lose K's interest**: you could have paid later, and K earns interest in the meantime. Exercising early = paying early = losing interest.
- **You throw away the remaining time value**: exercising only obtains intrinsic value, discarding the option's remaining time value (protective downside insurance) for nothing.
- Conclusion: **continuing to hold (or directly selling the option) is always ≥ exercising early**. If you need cash, sell the option, don't exercise. So with no dividends, American call = European call (premium ≈ 0 in the baseline example).

**American put: often worth exercising early.** To exercise a deep-ITM put early, you **immediately receive the strike K** (sell the stock for K), so:
- **You receive K early to earn interest**: this is a **good thing** — opposite to the call, exercising a put is "receiving money," and the earlier you receive, the more K earns interest.
- When the put is **deep ITM**, the remaining time value is already thin (almost all intrinsic value), and the benefit of "receiving K early to earn interest" outweighs that bit of time value — so exercising early is better.
- The higher the rate r and the deeper ITM the put, the greater the temptation to exercise early. The baseline American put premium ≈ 0.52 is the manifestation of this mechanism.

> One line to memorize: **for exercise that costs money (calls), don't go early — pay later to earn interest; for exercise that receives money (puts), go early — receive earlier to earn interest.** Interest props up this asymmetry.

### ⑤ The exception: American calls before a dividend + how to use the premium

The above "calls never exercise early" has one **important exception: dividends (Stage 2.4)**.

**An American call before a dividend may be worth exercising early.** When a stock goes ex-dividend, the price drops (by the dividend amount), and the option holder **doesn't receive the dividend**. If an ITM call is near the **ex-dividend date** with a large enough dividend, then:
- Exercise early → buy the stock first → **collect this dividend**, possibly better than "holding the option through the ex-dividend price drop."
- So **a dividend-paying stock's American call has its optimal early-exercise point usually right before the ex-dividend date** — a window that doesn't exist with no dividends. Especially so when deep ITM, large dividend, and near ex-dividend all line up.

**How to use the American premium?**
- **Pricing/quoting**: American single-stock option quotes naturally contain the premium, and a quant system must use a binomial tree / finite differences (not pure BS) to price, or it will systematically underestimate the American put.
- **Risk management**: **the seller must guard against early assignment (Stage 2.4)**. If the American put you sold becomes deep ITM, the counterparty may exercise at any time, dumping the stock on you at K — sellers of cash-secured puts (Stage 6.3) and the wheel strategy must factor this into margin and cash arrangements.
- **Threshold and pinning**: near expiry, with the price hugging K, there's also **pin risk** — whether you'll be assigned is hard to predict, and hedging is awkward.

Stringing these five together: **American = European + the early-exercise right, so American ≥ European, the difference being the American premium; the binomial tree prices it by taking max(immediate exercise, continue holding) at every node and draws the early-exercise boundary; with no dividends, puts are often early (receive K early to earn interest) and calls almost never (pay K late to earn interest), the only exception being a call before a dividend.** This "judge optimal stopping node by node" idea connects upward to the binomial tree (Stage 3.4) and finite differences (Stage 9.2), and downward to honestly handling early assignment in backtesting (Stage 9.6) — the complexity of American options is exactly an unavoidable lesson in real stock-option trading.
`,

  demo: "american-binomial",

  analogy: `
American vs European is like **two concert tickets**: the European ticket is "usable **only on the final night**," the American ticket is "usable **any night this week**." That extra freedom of several nights never makes you worse off — worst case, you still go on the final night (degenerating to a European). So the **American ticket ≥ the European ticket**, and the extra cost is the price of the "usable anytime" flexibility (the American premium).

But exactly how much "usable anytime" is worth depends on **whether using it early is worthwhile**, which depends on which kind of ticket you hold:

- **A call = "a voucher to buy a limited-edition item that's rising in price by paying the difference."** To use the ticket early, you must **pay the difference immediately** to buy it — but you could have **paid that money later** (letting that money earn interest first), and buying it early **forfeits the escape route of "if it crashes I can choose not to buy."** So this kind of ticket should almost **never be used early**: to cash out, just **resell the ticket** rather than exercising early. (The only exception: this limited-edition item is about to issue a **dividend/gift**, and only buying it first lets you collect it — only then is it worth using the ticket before the dividend, corresponding to **an American call before a dividend**.)
- **A put = "a voucher to sell what you hold to the counterparty at a high price."** Using the ticket early, you **immediately receive a sum** — this is a **good thing**! Receiving this money earlier means earning interest earlier. When this ticket is already **deep in the money** (the counterparty's offered price is far above market, and the remaining "possibility premium" is thin), **receiving money early to earn interest** outweighs the value of waiting — so **using the ticket early is more worthwhile**.

One line: **for tickets that cost money to use (calls), don't rush, pay later to earn interest; for tickets that receive money to use (puts), you can go early, receive earlier to earn interest.** Interest is the hand propping up this asymmetry.
`,

  misconceptions: [
    "**\"An American option may be cheaper than a comparable European option.\"** — Impossible. An American has all the rights of a European plus the **extra option** of early exercise, and an extra option never makes you worse off, so **American ≥ European**, and the difference (American premium) is always ≥ 0.",
    "**\"An in-the-money American call should be exercised early to lock in profit.\"** — With no dividends, almost **never**. Exercising early requires **immediately paying out the strike K** (losing interest) and **throwing away the remaining time value**. To cash out, **just sell the option** rather than exercising — selling recovers both intrinsic value and time value at once. The baseline American call premium ≈ 0.",
    "**\"Puts and calls are symmetric in early exercise.\"** — Completely asymmetric. Exercising a call **pays money** (paying later is better, to earn interest), exercising a put **receives money** (receiving earlier is better, to earn interest). So **a deep-ITM American put is often worth exercising early, while an American call (no dividends) almost never is** — interest props up this asymmetry.",
    "**\"The Black-Scholes formula can directly price American options.\"** — It can't. BS only computes Europeans. Americans need a **binomial tree** or finite differences (Stage 9.2), taking **max(immediate-exercise payoff, discounted expected value of continuing to hold)** at every node — the formula has no \"node-by-node\" layer to insert this comparison.",
    "**\"An American call should never be exercised early at any time.\"** — There's one important **exception: dividends**. Before the ex-dividend date, if the dividend is large enough and the call deep enough ITM, exercising early to **collect the dividend** may be better than holding the option through the ex-dividend drop. So a dividend-paying stock's American call has its optimal exercise point often right before the ex-dividend date (Stage 2.4).",
  ],

  quiz: [
    {
      q: "When pricing an American option with a binomial tree, what is the valuation rule at each interior node?",
      options: [
        "Node value = discounted expected value of continuing to hold (exactly the same as European)",
        "Node value = max(immediate-exercise payoff, discounted expected value of continuing to hold)",
        "Node value = immediate-exercise payoff",
        "Node value = the simple average of the two child nodes",
      ],
      answer: 1,
      explain: "American pricing, on top of European backward induction, takes one extra **max(immediate-exercise payoff E, discounted expected value of continuing to hold H)** at each node. If E>H, exercise early at that node. This one-line max is exactly the source of the American premium, and what the BS formula can't do.",
    },
    {
      q: "For an American call on a **non-dividend** stock, which statement about early exercise is correct?",
      options: [
        "Exercise immediately when deep ITM to lock in profit",
        "Almost never worth exercising early, because early exercise requires paying out the strike early (losing interest) and throwing away the remaining time value",
        "Should be exercised once every day",
        "Early exercise turns the option into a European",
      ],
      answer: 1,
      explain: "A non-dividend American call is **almost never** exercised early: exercising requires **paying K immediately** (losing the interest on K over that period) and **throwing away time value**. To cash out, **just sell the option**. So with no dividends, an American call ≈ a European call (premium ≈ 0).",
    },
    {
      q: "Why is a deep-ITM American **put** often worth exercising early, while a call isn't?",
      options: [
        "Because puts have a larger contract multiplier",
        "Because exercising a put is \"receiving the strike K,\" and receiving K early lets you earn interest early, and when deep ITM this outweighs the scant remaining time value",
        "Because puts are unaffected by volatility",
        "Because brokers force puts to be exercised early",
      ],
      answer: 1,
      explain: "Exercising a put **receives K** (sell stock for K), **receive earlier, earn interest earlier** — opposite to the call's \"pay K.\" When a put is **deep ITM** with thin remaining time value, the benefit of receiving K early to earn interest exceeds the value of waiting, so early exercise is better. More pronounced the higher the rate (baseline American put premium ≈ 0.52).",
    },
    {
      q: "The \"American call almost never exercised early\" has one important exception — which situation is it?",
      options: [
        "When volatility is very high",
        "Near the ex-dividend date with a large enough dividend — exercising early to collect the dividend may be more worthwhile",
        "When the strike is very low",
        "When expiry is still far away",
      ],
      answer: 1,
      explain: "**Dividends** are the key exception (Stage 2.4). At ex-dividend the stock drops while the option holder doesn't get the dividend; if near the **ex-dividend date** with a large enough dividend and a deep-enough-ITM call, exercising early to buy the stock and **collect the dividend** may beat holding. A dividend-paying stock's American call has its optimal exercise point often right before the ex-dividend date.",
    },
  ],

  further: [
    { label: "Investopedia: American Option (American options and early exercise)", url: "https://www.investopedia.com/terms/a/americanoption.asp" },
    { label: "Investopedia: Early Exercise", url: "https://www.investopedia.com/terms/e/earlyexercise.asp" },
    { label: "OIC: Early Exercise and Assignment", url: "https://www.optionseducation.org/" },
  ],
};
