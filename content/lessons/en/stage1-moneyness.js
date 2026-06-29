export default {
  id: "moneyness",
  stage: 1,
  order: 5,
  title: "ITM, ATM, OTM: Where the Money Is",
  difficulty: 2,
  prereqs: ["call-option", "put-option"],

  oneLiner:
    "**Moneyness** describes where the underlying price sits relative to the strike: exercise now and there's intrinsic value → **in-the-money (ITM)**; the spread is zero → **at-the-money (ATM)**; exercising still loses → **out-of-the-money (OTM).** Calls and puts judge it in opposite directions, but it's the same mirror logic.",

  intuition: `
You can already compute a call (Stage 1.1) and a put (Stage 1.2). Now lift your gaze from "one single strike" to a **whole row** of strikes: on the same stock at $100, you can choose 90, 95, 100, 105, 110... a string of strikes. Their most fundamental difference is **moneyness (value state)** — plainly, **"is the money in there or not."**

Ask just one question: **if I exercised right now, would it be worthwhile?**

- **Call (the right to buy at the strike)**: the **lower** the strike is below the current price, the better. A call with the stock at 100 and a strike of 90 — you can buy for 90 something worth 100, so **there's $10 of money in there**; that's **in-the-money.** A call with a strike of 110 would mean buying for 110 something worth only 100 — **no money, and a loss on top** — so it's **out-of-the-money.**
- **Put (the right to sell at the strike)**: the direction flips — the **higher** the strike is above the current price, the better. A put with the stock at 100 and a strike of 110 — you can sell for 110 something worth only 100, so **there's $10 in there**; that's **in-the-money.** A put with a strike of 90 is **out-of-the-money.**

And when the **strike ≈ the current price** (both near 100), whether call or put, it's **at-the-money** — the spread is essentially zero.

This lesson tackles three linked questions: **(1)** how to judge ITM/ATM/OTM for **both** calls and puts; **(2)** why **at-the-money options have the most time value**; **(3)** why **out-of-the-money options are cheaper, yet also more likely to expire worthless.** Think these through and you'll know which strike to pick from a row of them.

**In this lesson we break "where the money is" into four pieces:**

- **① Definitions of the three states: ITM / ATM / OTM**
- **② Call vs. put: the mirror directions of the judgment**
- **③ Intrinsic value: how much "money" is actually inside an ITM option**
- **④ Why ATM has the most time value, and OTM is both cheap and prone to zero**
`,

  mechanics: `
### ① The three states: ITM / ATM / OTM

**Moneyness** sorts the underlying price S's position relative to the strike K into three tiers, by one standard — **"does exercising now have intrinsic value":**

- **In-the-Money (ITM)**: exercising now **has** intrinsic value (worthwhile).
- **At-the-Money (ATM)**: S ≈ K, intrinsic value ≈ 0, **right on the dividing line.**
- **Out-of-the-Money (OTM)**: exercising now has **no** intrinsic value (not worthwhile); the option is entirely time value.

Note that ATM is a "narrow band," not a single point — in practice, S within a strike or two of K is loosely called at-the-money.

### ② Call vs. put: the mirror directions of the judgment

The easiest thing to get tangled over is "which side counts as in-the-money." Remember that **calls and puts run in opposite directions**, and nail it with a comparison table (let the current price S=100):

**Call** (buy at K; the higher S is above K, the better):
- K=90 → S>K → **ITM** (buy for 90 something worth 100)
- K=100 → S≈K → **ATM**
- K=110 → S<K → **OTM**

**Put** (sell at K; the lower S is below K, the better):
- K=110 → S<K → **ITM** (sell for 110 something worth 100)
- K=100 → S≈K → **ATM**
- K=90 → S>K → **OTM**

> A one-line mantra: **a call is ITM at a lower strike, a put is ITM at a higher strike.** Because a call wants to buy cheap and a put wants to sell high — they're two sides of the same mirror (this symmetry recurs throughout Stages 0.3 and 1.3). In the demo on the right, drag the current price S and both the call and put rows light up their respective ITM/ATM/OTM.

### ③ Intrinsic value: how much "money" is inside

**The "money" inside an ITM option is its intrinsic value** — "the value you'd get from exercising right this instant," always ≥ 0:

$$Call intrinsic value = max(S − K, 0)
$$Put intrinsic value = max(K − S, 0)

- Price 100, call K=90 → intrinsic value = max(100−90,0) = **10.**
- Price 100, put K=110 → intrinsic value = max(110−100,0) = **10.**
- Any OTM option → intrinsic value = **0** (that's the definition of OTM).

Intrinsic value is the "floor" of an option's price — an ITM option is worth at least this much. But it is **almost never the option's entire price**: the actual premium tends to be higher than intrinsic value, and the extra piece is **time value**, dissected in the next lesson (Stage 1.6, intrinsic value vs. time value).

### ④ Why ATM has the most time value, and OTM is both cheap and prone to zero

This is moneyness's most nourishing layer, bearing directly on which strike you should pick.

**Why is at-the-money (ATM) time value the highest?** Time value reflects the **uncertainty** of "becoming more valuable before expiry." An ATM option sits right on the **dividing line** between in- and out-of-the-money — a small move either way flips its fate, so it's the most sensitive to "how it might still move," with the greatest uncertainty, and **time value (along with Gamma and Theta) peaks at ATM** (why Gamma/Theta are largest at ATM is in Stage 5.3). For deep-ITM or deep-OTM options, the fate is nearly settled, so time value is actually thin.

**Why is out-of-the-money (OTM) cheap, yet more prone to zero?** An OTM option has **zero intrinsic value, and its price is entirely time value**, so its **absolute price is cheap** — which is exactly its appeal (a little money for a big move). But cheap is cheap for a reason: it must **first rise/fall to the strike, then cross the breakeven** before it starts to profit, so its **probability of expiring worthless is higher.**

Hidden here is an approximation of great importance in quant: **Delta ≈ the probability this option finishes ITM at expiry** (Stage 5.2). An ATM option has Delta ≈ 0.5 (about a 50% chance of finishing ITM); a deep-OTM option may have Delta of only 0.1, meaning **the probability of finishing ITM is only about 10%** — cheap, but nine times out of ten it zeros out. So "buying OTM for a shot" is essentially buying a low-probability lottery ticket: **high payout odds, but a low hit rate.** Picking a strike is a trade-off among "cheapness / probability / leverage."
`,

  demo: "moneyness",

  analogy: `
Think of moneyness as **a runner's distance from the finish line in a race**, where the finish line is the strike.

- **In-the-money (ITM)**: the runner has **already crossed** the line — the prize money (intrinsic value) is in hand, they can just keep running a bit more.
- **At-the-money (ATM)**: the runner is **right on** the line — one step forward or back flips winning and losing. So this moment is **the most nerve-racking, the most uncertain**, and the "value" of that suspense is highest (time value is greatest).
- **Out-of-the-money (OTM)**: the runner is **still far off** — the farther from the line, the slimmer the hope of getting there. So this "bet on him to win" ticket is **cheapest**, but he **most likely won't make it** (expires worthless).

Bet on a runner farther from the line and the ticket is cheaper and the payout odds higher, but the win probability lower. That's why a deep-OTM option is a "cheap, low-probability lottery ticket," while an ATM option is the tier with suspense (time value) cranked to the max.
`,

  misconceptions: [
    "**\"In-the-money means making money, out-of-the-money means losing.\"** — Moneyness only describes \"whether exercising now has intrinsic value,\" not the P&L of your trade. You can buy an ITM option and still net a loss (premium paid > intrinsic value), or buy an OTM option that then rallies hard for a big gain. P&L hinges on the breakeven (Stage 2.3).",
    "**\"Calls and puts judge in-the-money in the same direction.\"** — Just the opposite. **A call is ITM with the strike below the current price** (wanting to buy cheap); **a put is ITM with the strike above the current price** (wanting to sell high). Getting the direction backwards is the most common error.",
    "**\"OTM options are cheap, so they're better value.\"** — They're cheap because their **probability of expiring worthless is high.** An OTM option's small Delta means a low probability of finishing ITM (deep-OTM may be only about 10%). It's a \"high-odds, low-hit-rate\" lottery ticket — not the same as a good deal (Stage 5.2).",
    "**\"ATM options are the most featureless.\"** — Quite the opposite: an ATM option has **the most time value, Gamma, and Theta**: sitting on the dividing line between in- and out-of-the-money, it's the most sensitive to the underlying's next move — the most active tier for the Greeks (Stages 1.6 and 5.3).",
  ],

  quiz: [
    {
      q: "A stock is at $50. What state is a **call option** with a strike of 45 in?",
      options: ["Out-of-the-money (OTM)", "At-the-money (ATM)", "In-the-money (ITM)", "Can't tell"],
      answer: 2,
      explain: "A call is ITM when the underlying is **above** the strike: 50 > 45, so buying for 45 something worth 50 gives intrinsic value = max(50−45,0) = 5. Hence **in-the-money (ITM).**",
    },
    {
      q: "Same stock at $50, what state is a **put option** with a strike of 45 in?",
      options: ["In-the-money (ITM)", "At-the-money (ATM)", "Out-of-the-money (OTM)", "Can't tell"],
      answer: 2,
      explain: "A put is ITM only when the underlying is **below** the strike. At 50, above the strike of 45, selling for 45 something worth 50 isn't worthwhile, so intrinsic value = max(45−50,0) = 0 → **out-of-the-money (OTM).** Calls and puts run in opposite directions.",
    },
    {
      q: "Why does an **at-the-money option have the most time value**?",
      options: ["Because it's the cheapest", "Because it sits on the ITM/OTM dividing line, most sensitive to the underlying's move, with the greatest uncertainty", "Because it's guaranteed to profit", "Because it has no intrinsic value"],
      answer: 1,
      explain: "ATM sits right on the dividing line, so a small move either way flips its fate; this maximal uncertainty makes time value (along with Gamma and Theta) peak at ATM (Stage 5.3).",
    },
    {
      q: "A **deep out-of-the-money** call has a Delta of about 0.10. Roughly what does this mean?",
      options: ["It's guaranteed to profit", "Its probability of finishing ITM at expiry is about 10%, and it most likely zeros out", "Its intrinsic value is $10", "Its premium is $0.10"],
      answer: 1,
      explain: "Delta approximates \"the probability of finishing ITM at expiry.\" Delta ≈ 0.10 → about a **10%** chance of finishing ITM, meaning roughly nine times out of ten it zeros out. That's the essence of a deep-OTM option being \"cheap but low hit-rate\" (Stage 5.2).",
    },
  ],

  further: [
    { label: "Investopedia: Moneyness (ITM/ATM/OTM)", url: "https://www.investopedia.com/terms/m/moneyness.asp" },
    { label: "Investopedia: In the Money (ITM)", url: "https://www.investopedia.com/terms/i/inthemoney.asp" },
    { label: "OIC: Options Pricing & Moneyness", url: "https://www.optionseducation.org/" },
  ],
};
