export default {
  id: "traps-lessons",
  stage: 11,
  order: 6,
  title: "Common Traps: Assignment, Pin Risk, Liquidity, Earnings",
  difficulty: 2,
  prereqs: ["exercise-assignment"],

  oneLiner:
    "The mines real traders step on most, all in one place: **early assignment** (especially a deep-ITM short call before an ex-dividend date), **pin risk at expiry**, **auto-exercise surprises**, **wide spreads on illiquid options**, **the IV collapse after earnings**, **over-leveraging**, and **ignoring corporate actions** — each with a one-line \"how to avoid it.\"",

  intuition: `
You already understand the mechanics of exercise and assignment (Stage 2.4), how to read liquidity (Stage 2.1), and psychology and discipline (Stage 8.6). This lesson lands that knowledge on **the specific situations most likely to cost you money** — most of which aren't about "getting the direction wrong" but are **mechanical hidden pits**: you read the direction right, yet lose money or inherit a pile of trouble anyway because you didn't know one detail.

These traps share a trait: **none of them are visible at the moment you place the order — they only spring up on the ex-dividend date, at expiry, after earnings, or when you try to close.** Much of the gap between veterans and beginners is whether you marked these mines on the map ahead of time.

We'll break down the seven most common ones, each with "**why it's a trap + how to avoid it**":

**In this lesson we break "common traps" into seven:**

- **① Early assignment: a deep-ITM short call before ex-dividend**
- **② Pin risk: the price lands right on the strike at expiry**
- **③ Auto-exercise surprises: an ITM option settled/assigning stock passively**
- **④ Poor liquidity: a wide spread quietly eats your profit**
- **⑤ Earnings IV collapse: you bought at the most expensive moment, it evaporates next day**
- **⑥ Over-leveraging: one oversized position hitting a mine cripples the account**
- **⑦ Ignoring corporate actions: splits, special dividends, and mergers change the contract**
`,

  mechanics: `
### ① Early assignment: a deep-ITM short call before ex-dividend

American options can be **exercised any time** (callback 2.4), so **a seller must always watch for early assignment** — and the classic trigger is a **dividend**.

The mechanics: when a stock is about to go **ex-dividend**, a holder of a **deep-in-the-money call** finds that if the option's **remaining time value < the dividend about to be paid**, exercising early (taking the stock, collecting the dividend) beats holding the option. So they exercise in a cluster **the day before the ex-dividend date** — and the ones assigned are exactly the people who **sold those calls** (you, running a covered call or selling a spread).

- **Consequence**: you get assigned early, your stock is called away at the strike, you lose the position a day early, and it may break your spread structure (only one leg assigned, leaving the other naked).
- **How to avoid it**: when a short call is near an ex-dividend date and is **deep ITM with thin remaining time value**, **close or roll it proactively**. Watch the ex-dividend calendar of the stocks you hold — this is the number-one risk for short calls during dividend season.

### ② Pin risk

**Pin risk** is the risk that the underlying **lands right around the strike** at expiry, leaving the seller in limbo (callback 2.4).

The mechanics: at expiry the stock ≈ strike, and as the short you **can't be sure whether you'll be assigned** — you might be assigned partially, or not at all. If you assumed no assignment and didn't hedge, a gap on Monday's open leaves you with an extra (or missing) 100 shares of **naked directional exposure** — an unexpected overnight risk.

- **Consequence**: the expiry uncertainty of "do I take the stock?" turns into overnight gap risk.
- **How to avoid it**: near expiry, when the underlying is glued to the strike, **don't bet "it won't be assigned" — just close it**, settling the uncertainty. If you won't close, be prepared to handle both outcomes.

### ③ Auto-exercise surprises

Most brokers **auto-exercise** **in-the-money** options at expiry, with a common threshold of **0.01** ITM or more (callback 2.4, Stage 11.1). This is meant as a convenience but often creates surprises:

- **Buyer surprise**: your call finishes barely ITM (say S is 0.05 above K), gets auto-exercised, and **suddenly there are 100 shares in your account**, tying up a large sum — and if you lack the funds, it triggers a margin call. You only meant to capture the premium difference, but you're forced to take the stock.
- **How to avoid it**: on expiry day, **deal with marginal ITM options proactively** — **sell to close** before expiry if you want out, or submit a **"do-not-exercise" instruction** to your broker if you don't want the stock. Don't assume "it's almost expired, just leave it"; know your platform's rules and deadlines.

### ④ Poor liquidity: a wide spread quietly eats your profit

The **bid-ask spread** on a thin option can be absurdly wide (say bid 0.10 / ask 0.90), with extremely low open interest (Stage 2.1).

The mechanics: you buy at the ask and sell at the bid, so **you lose the huge spread on the round trip alone**. A 0.10/0.90 quote means the spread alone can eat all of your expected profit and then some — being right on direction doesn't help.

- **Consequence**: slippage (Stage 10.6) systematically erodes returns, and when you want to close there may be no one to take your price.
- **How to avoid it**: **always check the spread and open interest before ordering**. Favor **narrow-spread, high-open-interest** contracts and expiries (like the near-month, near-the-money strikes of major underlyings); when you meet a 0.10/0.90 quote, switch contracts or pass.

### ⑤ Earnings IV collapse (vol crush)

Earnings is a **known-date gap risk**. Before earnings, implied volatility (Stage 4.2) **spikes very high** — because the market is pricing in that gap.

The trap: many beginners **buy options before earnings** (calls or straddles), betting it "will move big." The problem is you **bought when IV was most expensive**; once earnings come out, the uncertainty vanishes and **IV collapses (vol crush)** — even if the stock really moved, the option can **lose money anyway** because of the sharp drop in Vega (Stage 5.5).

- **Consequence**: you got the direction right but the IV collapse swallowed the profit, or even produced a loss.
- **How to avoid it**: understand that **the rich premium before earnings is precisely the market pricing in the gap** — there's no free lunch. If you trade earnings, understand you're really **betting "realized move > implied move,"** a very hard thing; and as a seller, don't sell naked into earnings (unlimited risk) — cap it with a **defined-risk spread** (the discipline of Stage 8.6).

### ⑥ Over-leveraging

Options come with built-in leverage (callback 1.1). The most common account killer isn't getting the direction wrong — it's **sizing a single trade too big**.

The mechanics: because one contract controls 100 shares and the capital outlay is small, it's easy to build, without noticing, a notional exposure far beyond what your account can bear. One "sure thing" oversized bet hitting a mine can cause irreversible **risk of ruin** (Stage 8.1).

- **How to avoid it**: use **position sizing** (Stage 8.1): back out the number of contracts from your **maximum loss per trade** (e.g. risk ≤ 1–2% of the account per trade), with no "exception this time." A defined-risk structure + strict sizing is the prerequisite for surviving long-term.

### ⑦ Ignoring corporate actions

Corporate actions like **splits, reverse splits, special dividends, mergers, and spinoffs** will **adjust the option contract**: the strike, the contract multiplier, even the deliverable can change.

The mechanics: after a 2-for-1 split, for instance, your contract may become a halved strike, a doubled count, or an adjusted multiplier; a special cash dividend can lower the strike. If you don't notice, your read of the position's P&L, Delta, and risk will be entirely wrong.

- **How to avoid it**: when a holding faces a corporate-action announcement, **look up the OCC's adjustment memo for that contract** (adjusted contracts often carry a special marking). Don't use pre-adjustment intuition to compute a post-adjustment contract.

Looking at the seven traps together, their common thread is: **mechanical risk beyond direction, invisible when you order, surfacing only at a specific moment.** The countermeasures are common too — **mark the ex-dividend, expiry, earnings, and corporate-action dates on your map ahead of time, watch liquidity and sizing, and at the critical moment close proactively rather than betting on luck.** Turn these into your **pre-entry / pre-expiry checklist** (Stage 8.6) and you'll avoid the spills beginners take most often. **This is educational content, not investment advice.**
`,

  demo: "trap-scenarios",

  analogy: `
These traps are like **seven invisible potholes** on a stretch of road — smooth by day, collapsing only at a specific moment.

- **Early assignment (pre-ex-dividend)** = a sinkhole at the intersection that **only opens on "payday"** (the ex-dividend date): fine most of the time, but step on the deep-ITM-short-call brick that day and you drop in.
- **Pin risk** = a **trapdoor sitting exactly on the boundary line** (expiry price ≈ strike): you bet it won't flip, and in the middle of the night (an overnight gap) it flips.
- **Auto-exercise** = a gate at the end of the road that **closes automatically by default** (auto-exercise at 0.01 ITM): you think leaving it is fine, and it "processes" you (and your 100 shares) automatically.
- **Poor liquidity** = a **narrow, muddy stretch** (the 0.10/0.90 spread): go in and come out and your shoes are sunk (slippage eats the profit).
- **Earnings IV collapse** = a **cushion that looks plump but deflates the instant you step on it** (high IV → vol crush): you go for its "fullness" and land on nothing.
- **Over-leveraging** = knowing there's a pit ahead but **flooring the gas through it** (oversizing): even a small pit can flip you.
- **Corporate actions** = a road sign **quietly changed overnight** (a split/special-dividend adjusting the contract): follow the old map and you must go wrong.

People who avoid the pits aren't lucky — they **hold a map marking every pit and when it collapses.** Write the dates and checks into a checklist, and drive slowly by the map.
`,

  misconceptions: [
    "**\"I'm an option seller, so as long as nothing happens before expiry I'm safe.\"** — American options can be **assigned early**, especially **before ex-dividend**: a deep-ITM call holder whose remaining time value < the dividend will exercise ahead of the ex-date, and the one assigned is you. Near ex-dividend, deep ITM with thin time value, close or roll proactively (Stage 2.4).",
    "**\"If the expiry price equals the strike exactly, my short definitely won't be assigned.\"** — Wrong; that's exactly **pin risk**: assignment is highly uncertain, and you may passively gain or lose 100 shares of naked exposure and an overnight gap. At the margin, close to settle the uncertainty — don't bet (Stage 2.4).",
    "**\"Leave a near-expiry ITM option alone; the broker handles it.\"** — It will **auto-exercise** (common threshold 0.01), which can passively saddle you with 100 shares, tie up a large sum, or even trigger a margin call. To get out, **sell to close** proactively; if you don't want the stock, submit a **\"do-not-exercise\" instruction** (Stage 11.1).",
    "**\"Buy options before earnings, bet on a big move, easy profit.\"** — You bought when **IV is most expensive**, and the post-earnings **IV collapse (vol crush)** often loses you money even when the direction is right. The rich premium is the market pricing in the gap — no free lunch; if you trade it, use a defined-risk structure and don't sell naked into earnings (Stage 8.6).",
    "**\"A cheap 0.10/0.90 option is worth buying if the direction is right.\"** — That's **ignoring liquidity**. The round-trip spread alone can eat all your profit, and you may find no one to take your price when you want out. Always check the **spread and open interest** first, and favor narrow-spread, high-open-interest contracts (Stage 2.1, Stage 10.6).",
  ],

  quiz: [
    {
      q: "You sold a **deep-in-the-money call** (covered). Which situation is **most likely** to trigger early assignment against you?",
      options: [
        "The underlying is about to go ex-dividend, and your call's remaining time value is less than the dividend about to be paid",
        "The underlying's implied volatility suddenly rises",
        "There's a long time to expiry and the option is deep out-of-the-money",
        "During the weekend market close",
      ],
      answer: 0,
      explain: "An American call is most likely exercised early **before ex-dividend**: when a deep-ITM call's **remaining time value < the dividend**, the holder gains more by exercising to collect the dividend, and the short side gets assigned. Near ex-dividend and deep ITM, close or roll proactively (Stage 2.4).",
    },
    {
      q: "A trader buys an at-the-money straddle **the day before earnings**, betting on a big move. After earnings the stock did move, yet he lost money. The most likely reason?",
      options: [
        "The stock didn't move enough and the direction was wrong too",
        "Implied volatility collapsed after earnings (vol crush), and the drop in Vega swallowed the gains from the move",
        "The broker charged excessive commissions",
        "He bought puts instead of calls",
      ],
      answer: 1,
      explain: "IV spikes before earnings (the market pricing in the gap), so he **bought at the most expensive moment**; after earnings the uncertainty vanishes and **IV collapses**, the option loses value through Vega even if the stock really moved. This is the classic trap of buying earnings options (Stage 4.2, Stage 5.5).",
    },
    {
      q: "At expiry, your short put's underlying is **sitting right around the strike**. Regarding pin risk, what is the most robust action?",
      options: [
        "Assume it definitely won't be assigned and do nothing",
        "Close it to settle the uncertainty, avoiding passive stock and an overnight gap",
        "Immediately double the position",
        "Wait and see at Monday's open",
      ],
      answer: 1,
      explain: "Under pin risk, \"will I be assigned?\" is highly uncertain; toughing it out can leave you long/short 100 naked shares on Monday with an overnight gap. At the margin, **closing proactively** to settle the uncertainty is the robust move (Stage 2.4).",
    },
    {
      q: "A stock announces a **2-for-1 split** and you hold its options. What should you do?",
      options: [
        "Ignore it — the contract won't change",
        "Look up the OCC's adjustment memo for the contract (strike/multiplier/count may change) and don't use old intuition on the new contract",
        "Immediately liquidate with a market order",
        "Assume the option's value doubles",
      ],
      answer: 1,
      explain: "Corporate actions like splits, special dividends, and mergers adjust an option's strike, multiplier, or deliverable. You must check the **OCC's adjustment memo** (adjusted contracts often carry a special marking), or your read of P&L, Delta, and risk will be entirely wrong.",
    },
  ],

  further: [
    { label: "OCC: Special Memos / Contract Adjustments (how corporate actions change options)", url: "https://www.theocc.com/market-data/market-data-reports/series-and-trading-data/equity-options-product-specifications" },
    { label: "Investopedia: Pin Risk", url: "https://www.investopedia.com/terms/p/pinrisk.asp" },
    { label: "Fidelity: Avoiding Early Assignment & Dividend Risk", url: "https://www.fidelity.com/learning-center/investment-products/options/assignment-risk-options" },
  ],
};
