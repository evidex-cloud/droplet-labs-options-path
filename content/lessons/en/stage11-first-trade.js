export default {
  id: "first-real-trade",
  stage: 11,
  order: 2,
  title: "Placing a Real Trade, End to End",
  difficulty: 2,
  prereqs: ["option-chain", "orders-margin"],

  oneLiner:
    "String everything you've learned together: **form a thesis → pick a defined-risk strategy → choose the expiry and strikes from the chain → check the Greeks and liquidity → place a limit order at the mid → set take-profit/stop-loss/rolling plans → close out or expire.** Walk through these seven steps with a concrete, numbers-driven real example.",

  intuition: `
By now you've separately learned the chain, payoff diagrams, the Greeks, and various strategies. But in a real trade they aren't isolated bits of knowledge — they're an **interlocking pipeline.** This lesson walks that pipeline once, with an example **from start to finish, with real numbers.**

Picture a concrete scenario:

> Stock **XYZ trades at $100.** After your research you believe it **won't fall much in the short term and is mildly bullish**, but you don't want to buy 100 shares outright (tying up $10,000 and eating the full downside), nor sell a naked put (which means taking delivery if assigned).

This is exactly where a **defined-risk spread** fits best. We'll use a **bull put credit spread**: sell a put at a higher strike and buy a put at a lower strike, **collecting a net premium**, with the maximum loss locked in by the width of the two legs.

The whole trade runs through these seven steps, each corresponding to a lesson you've learned:

**In this lesson we break "a real trade" into seven steps:**

- **① Form a thesis: what exactly are you betting on**
- **② Pick a strategy: why a defined-risk spread**
- **③ Choose the expiry and strikes from the chain**
- **④ Check the Greeks and liquidity: is this trade worth placing**
- **⑤ Place a limit order (anchored at the mid), filled as a combo**
- **⑥ Manage: the plan for take-profit, stop-loss, rolling**
- **⑦ Close out or expire: how to wrap up**
`,

  mechanics: `
We follow this example throughout: **XYZ = 100, mildly bullish, roughly a 30-day horizon.** In the demo you can click through step by step to see how the numbers cascade.

### ① Form a thesis: what you're betting on

Every trade starts from a **falsifiable thesis**, not "I feel it's going up." Write it out clearly:

- **Direction + magnitude**: XYZ **won't break below 95** over the next 30 days (mildly bullish to neutral).
- **Basis**: there's technical support at 95, no earnings nearby (avoiding IV collapse, Stage 11.6), and implied volatility isn't especially low.
- **What if you're wrong**: if it breaks 95, I admit defeat and exit.

> The thesis dictates the strategy. I'm betting on "**no big drop**," not "**a big rally**" — so I shouldn't buy calls (those need it to actually rise to profit) but should use a structure that **profits as long as it doesn't drop much.**

### ② Pick a strategy: why a defined-risk spread

"Profit if it doesn't drop much" naturally maps to **selling a put.** But a **naked put** is risky (huge loss in a crash) and ties up a lot of margin. So while selling the put, we **also buy a put at a lower strike as insurance**, sealing off the tail risk — this is a **bull put spread** (a credit spread):

- **Sell the 95 put** (collect more premium)
- **Buy the 90 put** (pay less premium, as downside insurance)
- Both legs same expiry, **net premium collected (credit).**

Its benefits: **maximum loss is locked in** (≈ width of the two legs − premium collected), the margin used is far smaller than a naked put, and **time decay (Theta) is on your side** — as long as XYZ doesn't break below the range, each passing day makes you more.

### ③ Choose the expiry and strikes from the chain

Open XYZ's option chain (callback 2.1):

- **Expiry**: pick the **30–35 day** bucket. Too near and Theta is fast but the margin for error is small; too far and capital is tied up longer with slower returns. 30–45 days is the common sweet spot for rent-collecting spreads.
- **Strikes**: for the short leg, pick an **OTM put around 0.25 Delta** — here that's exactly **95** ($5 below XYZ=100, about −0.25 Delta). For the long leg, go further down to **90**, forming a **$5-wide** spread.

Reading the chain, focus on these two strikes' **bid/ask, open interest, and implied volatility.** This example's quotes (per share):

- 95 put: bid 1.35 / ask 1.45, **mid ≈ 1.40**
- 90 put: bid 0.65 / ask 0.75, **mid ≈ 0.70**
- Net mid of the spread = 1.40 − 0.70 = **0.70** (this is the premium you want to collect)

### ④ Check the Greeks and liquidity

Two health checks before ordering:

**Liquidity** (callback 2.1): both strikes need **sufficient open interest and a narrow enough spread.** Here each leg's spread is 0.10 with open interest in the thousands — passes. Contracts with poor liquidity (e.g., bid 0.10 / ask 0.90) should be skipped outright — the in-and-out slippage can devour the entire profit (Stage 11.6).

**The Greeks + risk numbers** (Stage 5.1):

- **Net Delta** ≈ +0.13 (selling a −0.25 Delta put = +0.25, buying a −0.12 Delta put = −0.12, net long-leaning, matching "mildly bullish").
- **Net Theta > 0**: time is a friend, collecting a bit each day.
- **The three key numbers** (per contract, ×100):
  - **Premium collected = 0.70 × 100 = $70** (max profit)
  - **Max loss = (width − premium) × 100 = (5 − 0.70) × 100 = $430**
  - **Breakeven = short strike − premium = 95 − 0.70 = 94.30**
- **Reward/risk ≈ 70 / 430 ≈ 16%**; the short leg's −0.25 Delta roughly corresponds to **about a 75% probability of profit (POP).**

This set of numbers lets you **know the best and worst completely** before you hit place. Continue only if you find 16% acceptable odds against a 75% win rate.

### ⑤ Place a limit order (anchored at the mid)

The iron rule of options: **always use a limit order, anchored at the mid** (Stage 2.5). And the spread must be placed as **one combo order (multi-leg / combo order)** on the **net price** — don't manually split it into two legs, or you may fill only one leg and be left naked on the other half ("leg risk").

- Place a **sell-to-open spread**, limit at **net credit 0.70** (the mid).
- If it doesn't fill immediately, you can nudge it slightly unfavorable (e.g., 0.68, 0.65) to chase a fill, but don't impulsively just take both legs' bids (that's giving away the whole spread).
- Once filled, the account **immediately collects $70** in premium and freezes about **$430** in margin as collateral (the max loss).

### ⑥ Manage: the plan for take-profit, stop-loss, rolling

**Write the exit rules before you open** (Stage 8.6) — don't decide intraday with emotion:

- **Take-profit**: a common practice for credit spreads is to **close when you've made 50% of the premium** — i.e., buy it back when the spread's price falls from 0.70 to **0.35**, pocketing **$35.** Why not be greedy for 100%? Because that last bit of profit requires bearing full timing risk to earn — poor value.
- **Stop-loss**: if the loss reaches **1–2× the premium collected** (e.g., a paper loss of $70–140), or **XYZ breaks below the breakeven 94.30** and the thesis is falsified, admit defeat and close.
- **Rolling**: if it's lingering near the short leg as expiry approaches and you're still bullish, you can **buy back the current spread and sell the same structure at a later expiry**, collecting a fresh premium and buying more time. Rolling is an adjustment, not a rescue — if the thesis is already wrong, you should stop out, not keep rolling forward.

### ⑦ Close out or expire

On expiry day there are two ways to wrap up:

- **If XYZ is above 95** (thesis holds): both puts expire OTM worthless, you **keep the full $70** premium, and the margin is released. Most traders, in fact, have already closed out at the 50% take-profit and won't hold to expiry.
- **If XYZ has broken below the range**: between 90 and 95, the risk of the short leg being assigned rises (Stages 2.4, 11.6's assignment/pin). **Don't sit naked into expiry** — close out actively before expiry, locking the loss in a known range and avoiding a weekend gap or passively taking stock.

Connecting the seven steps, you've completed a **real trade with a thesis, numbers, and a plan**: **thesis → defined-risk spread → choose expiry/strikes from the chain → check the Greeks and liquidity → mid-anchored limit combo order → write take-profit/stop-loss/rolling → wrap up actively.** Running this flow smoothly matters more than memorizing any single strategy — it's the step that turns "understanding options" into "being able to trade." **This is an educational demonstration and not investment advice.**
`,

  demo: "trade-walkthrough",

  analogy: `
Walking through a trade is like **the whole process of cooking a dish**, not just memorizing one term from the recipe.

- **Thesis** = what you **want to eat today and who you're cooking for** (betting on "no big drop," like deciding to make a light dish).
- **Pick a strategy** = **choose the right dish** for the taste (a defined-risk spread = a homestyle dish with controllable ingredients and portions, not an experimental dish that might explode in unknown ways).
- **Choose expiry/strikes** = **shop for ingredients** (in the chain — the "market" — pick the fresh, fairly-priced few).
- **Check the Greeks/liquidity** = **taste the seasoning and check freshness** before it hits the pan (are net Delta/Theta right, is the spread narrow).
- **Place a limit combo order** = **buy the whole set of ingredients at the price you're willing to pay**, not paying whatever price you grab (a market order), and not buying only half the ingredients (filling only one leg).
- **Take-profit/stop-loss/rolling** = **set the heat and timing**: take it off the heat at the right doneness (50% take-profit), kill the flame if it burns (stop-loss), keep simmering a bit longer if you want (rolling).

Remember: knowing the recipe (memorizing a strategy's name) isn't the same as knowing how to cook (being able to trade). Only by running this flow **from thesis to wrap-up** with your own hands have you truly cooked.
`,

  misconceptions: [
    "**\"Open first, and improvise the take-profit/stop-loss intraday.\"** — This is a hotspot for losses. The exit rules must be locked **before you open** (e.g., 50% take-profit, stop out at 1–2× the premium, exit on a breakeven break), or every wobble is left to emotion, and emotion systematically errs (Stage 8.6).",
    "**\"For a spread, just place each leg separately.\"** — Dangerous. Place it as a **combo order on the net price with a limit**, or you may fill only one leg and sit naked on the other half (leg risk), with a completely different risk shape. Multi-leg must fill as a whole (Stage 2.5).",
    "**\"A credit spread should be held to expiry to earn the full 100% of the premium.\"** — Usually not. The common practice is to **close at 50% profit**: that last bit of profit requires bearing full timing and gap risk to earn — poor value. Locking in profit early and freeing the margin is often better.",
    "**\"XYZ broke below the range — just roll it to rescue it.\"** — Rolling is an **adjustment**, not a **rescue.** If the thesis is already falsified (e.g., a break below breakeven) you should **stop out**; rolling to a later expiry only makes sense when you're still bullish and merely need more time, otherwise you just roll the loss bigger and bigger.",
    "**\"I won't close my in-the-money options at expiry — just let them settle themselves.\"** — Don't sit naked. Near expiry, around the short leg, there's **assignment and pin risk** (Stage 11.6), plus a possible weekend gap. Actively closing before expiry, locking the P&L in a known range, is the professional way to wrap up.",
  ],

  quiz: [
    {
      q: "In the example, XYZ=100, you sell the 95 put and buy the 90 put, collecting a net premium of 0.70 (per share). What is the **maximum loss** (per contract, ×100) of this bull put spread?",
      options: ["$70", "$430", "$500", "Unlimited"],
      answer: 1,
      explain: "Credit-spread max loss = (width − premium) × 100 = (5 − 0.70) × 100 = **$430.** Max profit is the premium collected, $70; both numbers are locked in — that's exactly the meaning of \"defined risk.\"",
    },
    {
      q: "On the same trade, where is the **breakeven**?",
      options: ["95.70", "94.30", "90.70", "100"],
      answer: 1,
      explain: "A bull put spread's breakeven = short strike − premium collected = 95 − 0.70 = **94.30.** As long as XYZ is above 94.30, this trade doesn't lose at expiry.",
    },
    {
      q: "When placing this spread order, what is the correct way to order?",
      options: [
        "Place each leg as a separate market order for speed",
        "Place it as one combo order, limit at the net mid (about 0.70 credit)",
        "Place only the short leg, and add the long leg after it fills",
        "Use a market combo order for an immediate fill",
      ],
      answer: 1,
      explain: "Multi-leg must be placed as a **combo order on the net price with a limit**, anchored at the mid (≈0.70). Placing separately or only one leg leaves **leg risk**; a market order can slip badly on a wide spread. Always limit, fill as a whole (Stage 2.5).",
    },
    {
      q: "Managing this credit spread after opening, which is a common and robust practice?",
      options: [
        "Hold to expiry no matter what, to earn the full 100% premium",
        "Close and pocket the profit at about 50% of the premium (the spread falling from 0.70 to about 0.35)",
        "Double down by selling more puts the moment it breaks the short leg",
        "Decide when to exit intraday by feel",
      ],
      answer: 1,
      explain: "The common practice for a credit spread is to **close at 50% profit** (e.g., buy-back price from 0.70 to 0.35, keeping $35), avoiding bearing full timing/gap risk for the last bit of profit. Exit rules should be written before opening (Stage 8.6), not improvised intraday.",
    },
  ],

  further: [
    { label: "Investopedia: Bull Put Spread", url: "https://www.investopedia.com/terms/b/bullputspread.asp" },
    { label: "tastylive: Managing Winners (why credit spreads take profit at 50%)", url: "https://www.tastylive.com/concepts-strategies/managing-winners" },
    { label: "OIC: Options Strategies (multi-leg orders and combo orders)", url: "https://www.optionseducation.org/strategies" },
  ],
};
