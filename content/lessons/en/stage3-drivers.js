export default {
  id: "price-drivers",
  stage: 3,
  order: 1,
  title: "The Six Drivers of an Option's Premium",
  difficulty: 2,
  prereqs: ["intrinsic-time-value"],

  oneLiner:
    "An option's price isn't set by feel — it's determined by **six inputs**: underlying price S, strike K, time to expiry T, volatility, the risk-free rate r, and dividends q. Of these, **volatility is the real protagonist** — and the one thing you're truly \"buying and selling\" when you trade options.",

  intuition: `
Last lesson (Stage 1.6) we split the premium into **intrinsic value + time value**. But one question went unanswered: those two pieces — especially that swelling-and-shrinking time value — **what actually determines them?**

The answer is six dials. Picture any European option as a pricing machine that recognizes only six inputs:

- **Underlying price S**: what the underlying costs now.
- **Strike K**: the price you've agreed to buy/sell at.
- **Time to expiry T**: how long until expiration.
- **Volatility σ**: how much the underlying can jump around — **the most important, and most subtle, of all.**
- **Risk-free rate r**: the discount rate that pulls future money back to today.
- **Dividends q**: how much the underlying pays out over the holding period.

S and K you grasp at a glance; T we touched last lesson (time value melts with it). What truly trips beginners up are the last three — especially **σ (volatility)**. Put it this way: when you buy an at-the-money option, the intrinsic value is 0, and **almost the entire premium you pay is paying for volatility.** Which is why old hands often say: **"You think you're trading the stock's direction, but you're really trading its volatility."**

A number to make it concrete. A stock at 100, an at-the-money call (K=100, ~3 months to expiry, r=4%):
- When the market thinks it's **sleepy** (volatility 10%), this call is worth about **$2.5**.
- When the market thinks it's **wild** (volatility 40%), the same call is worth **$8.4** — more than triple, with S, K and T unchanged!

See the trick? **Volatility, almost single-handedly, pulled the option's price up threefold.** This is why options get mysteriously expensive before earnings: nobody knows the direction, but everyone knows "it's about to move big," so volatility gets bid up and time value swells with it.

**In this lesson we turn each of the six dials in turn, watching which way each pushes the price, and why:**

- **① Underlying S and strike K: the source of intrinsic value**
- **② Time to expiry T: more time, more possibility**
- **③ Volatility σ: the protagonist that can double the price**
- **④ Risk-free rate r: the underrated discounting effect**
- **⑤ Dividends q: how payouts "leak" value away**
- **⑥ The six-driver master table: call-up / put-up, memorized in one picture**
`,

  mechanics: `
### ① Underlying price S and strike K

Together these set the intrinsic-value floor, and fix the option's moneyness (Stage 1.5).

- **Underlying price S rises**: the call is worth more (closer to, or deeper, in-the-money), **call ↑**; the put goes the other way, **put ↓**. This directional sensitivity we'll measure precisely later with a dedicated Greek, **Delta** (Stage 5.2).
- **Strike K**: fixed in the contract, it doesn't move. But **comparing different K's**: the lower the K, the more in-the-money and pricier the call (**call ↓ as K ↑**); the put is the reverse (**put ↑ as K ↑**).

The mnemonic is simple: **whichever of S and K makes it easier for you to "exercise at an advantage" bids up the option on that side.** A call fears K too high and longs for S to rise; a put fears K too low and longs for S to fall.

### ② Time to expiry T: the container of possibility

Time is the container that holds "possibility." The further from expiry, the more chance the underlying has to travel somewhere favorable, so the thicker the time value — which is why **usually, the longer T, the more expensive both calls and puts** (they rise together). A 6-month option is almost always pricier than a 1-month option at the same strike, because it gives the underlying more time to "get up to something."

- Example: an at-the-money call, σ=25%, r=4%. ~1 month to expiry is worth about $3.0, ~6 months about $8.0 — the extra is all time value.

> Note two details. First, time value doesn't bleed off at a constant rate but **falls faster the closer to expiry** (that rate is **Theta**, Stage 5.4). Second, for a **deep ITM European put on a dividend-paying stock**, in extreme cases a longer T can actually shave the price slightly (the opposing tug of rates/dividends) — but for the vast majority of options, "longer = more expensive" is a reliable intuition.

### ③ Volatility σ: the real protagonist

**Volatility measures how violently the underlying price swings** (usually expressed as an annualized standard deviation). It's the one dial of the six that makes **both calls and puts "more expensive the higher it goes," with the largest influence of all.**

Why? Because an option's payoff is **asymmetric**: the more it rises the more you make, but once it falls below the strike the loss caps at the premium. Volatility magnifies **both tails**, yet you reap the benefit only of the favorable tail while the adverse one is truncated — so the greater the volatility, the more valuable this "limited-risk, open-ended-payoff" lottery ticket.

- At-the-money call (S=K=100, T≈3 months, r=4%): σ=10% → worth **2.52**; σ=25% → worth **5.47**; σ=40% → worth **8.43**. **Volatility lifts the price almost linearly.**

Distinguish two terms here. The volatility backed out of the market's actual quote is the **implied volatility (IV)** — it's the option's real "price scale," the market's expectation of future volatility (Stage 4.2 covers IV vs historical volatility). When you trade options, **what you're really trading is this IV.** The option price's sensitivity to IV has its own Greek, **Vega** (Stage 5.5); what market makers and quants watch daily is, less the direction of the stock than this volatility (Stage 8.3 treats volatility as a tradable asset in its own right).

### ④ Risk-free rate r: the underrated discounting effect

The interest rate (the **risk-free rate**, commonly the short-term Treasury yield) affects the option price through **discounting**, and the direction can be counterintuitive:

- **r rises → call gets more expensive (call ↑)**. Intuition: buying a call is like "locking in the right to buy at K later for very little money," freeing up the large cash outlay of buying the stock to earn risk-free interest; the higher the rate, the greater this "deferred payment" benefit. Equivalently: the strike K you have to pay is paid **in the future**, and its present value K·e^(−rT) shrinks as r rises, so the call is worth more.
- **r rises → put gets cheaper (put ↓)**. The put seller receives the K that's only fixed in the future; the higher the rate, the lower the present value of that future cash.

The Greek measuring this sensitivity is **Rho** (Stage 5.6), usually the most overlooked of all — **significant only for long-dated options (LEAPS)**. But understanding it is crucial for the next lesson: that mysterious **K·e^(−rT)** (the present value of the strike) is the core of **put-call parity** (Stage 3.2).

### ⑤ Dividends q: how payouts leak value away

If the underlying **pays a dividend** during the option's life (dividend yield q), the share price drops a notch on the ex-dividend date — and the option holder **doesn't receive that payout** (you hold the option, not the stock). So:

- **q rises → call gets cheaper (call ↓)**: the future share price has a chunk "leaked out" by the dividend, shrinking the call's upside.
- **q rises → put gets more expensive (put ↑)**: the share price's downside gets an "assist" from the dividend, favoring the put.

This is why a high-dividend stock's call is priced at a discount; it's also why an **American call may be exercised early before an ex-dividend date** — the buyer wants the stock before the ex-date to capture that dividend (Stage 9.5 covers American options). In the formula, dividends are handled symmetrically to rates: just replace S with S·e^(−qT).

### ⑥ The six-driver master table

Summarize the six dials' directions for calls and puts into one "mental table" (↑ = the option gets more expensive when this driver increases, ↓ = cheaper):

$$Driver ↑          Call       Put
$$Underlying S ↑    ↑          ↓
$$Strike K ↑        ↓          ↑
$$Expiry T ↑        ↑(usually) ↑(usually)
$$Volatility σ ↑    ↑          ↑   ← protagonist
$$Rate r ↑          ↑          ↓
$$Dividend q ↑      ↓          ↑

This table is the map for everything that follows. **The Black-Scholes formula (Stage 4.1) is precisely the machine that "chews" these six inputs into one theoretical price**; while **the Greeks (Stage 5) are the dashboard that measures, one by one, "move an input a little, how much does the price move"** — Delta for S, Vega for σ, Theta for T, Rho for r. The six directions you've just memorized are the foundation you're laying for those formulas and Greeks. The demo on the right lets you turn each dial by hand and watch the price react live.
`,

  demo: "premium-drivers",

  analogy: `
Pricing an option is like valuing the **"scalper's markup" on a concert ticket**.

The face value (the strike K) is fixed, but what the ticket in a scalper's hand is worth depends on a pile of factors:

- **How hot the act is (underlying price S)**: the more the singer is trending lately, the more in-demand the ticket, the higher the markup — corresponding to higher S, a more valuable call.
- **How long until showtime (time to expiry T)**: with half a year left, there are lots of variables (extra dates, a viral breakout), so the "possibility" chunk of the markup is thick; the instant before the show, the dust has settled and possibility goes to zero.
- **How "unpredictable" the singer is (volatility σ)**: a topical act that might suddenly blow up across the internet — or just as suddenly fizzle — gives the ticket the most upside imagination. **This is exactly volatility: the more it can swing, the more valuable that "call it right and strike it rich" ticket.** This is the biggest variable in the markup.
- **The time cost of money (rate r)**: the opportunity cost of money itself, quietly tilting the "lock in now vs buy later" trade-off.

See it? The ticket's face value is easy; what really sets its "scalper's price" is those moving factors behind it — above all how "unpredictable" the singer is. Options are the same: S and K are plain to see, **while that swelling-and-shrinking time value is mostly volatility's call.**

(Reminder: this is just an intuition analogy. Options are risky financial instruments, and none of this is investment advice.)
`,

  misconceptions: [
    "**\"An option's price depends only on whether the stock rises or falls.\"** — Far from it. Same stock price, strike and expiry — just changing the **volatility** can multiply the option's price several times over. For an at-the-money option, intrinsic value is 0, and what you pay is almost entirely for volatility and time (Stage 5.5, Vega).",
    "**\"Volatility is bullish for calls and bearish for puts.\"** — Wrong. Volatility lifts **both** call and put prices, because what it magnifies is both tails, and with an option's asymmetric payoff, the more it can swing the more valuable this \"limited-risk\" lottery ticket. The directional one is S (Delta), not σ.",
    "**\"Rates are too small to affect option prices.\"** — Inconspicuous on short, small positions, true, but the direction is definite: **a higher rate makes calls more expensive and puts cheaper** (the discounting effect). On long-dated options (LEAPS), Rho is sizable — and that K·e^(−rT) is the core of the next lesson's parity (Stages 3.2, 5.6).",
    "**\"The longer the time to expiry, the more expensive the option, always.\"** — True for the vast majority of options (time is the container of possibility). But for the extreme case of a **deep ITM European put on a dividend-paying stock**, the opposing tug of rates and dividends can make a longer T actually shave the price slightly. File it as \"usually true, with rare exceptions.\"",
    "**\"Dividends are irrelevant to options, since options don't receive payouts anyway.\"** — Precisely because they don't is why dividends matter: on the ex-dividend date the share price drops a notch, so the **call gets cheaper and the put more expensive**; this is also the main reason American calls get exercised early (Stage 9.5).",
  ],

  quiz: [
    {
      q: "With everything else held perfectly fixed, raising **implied volatility from 10% to 40%** changes an at-the-money call's price roughly how?",
      options: ["Barely changes", "Drops slightly", "Rises sharply (possibly several-fold)", "Rises then falls"],
      answer: 2,
      explain: "Volatility is the largest-influence protagonist of the six drivers. In the example the at-the-money call goes from about **2.52 to about 8.43**, more than triple, with S, K and T all unchanged. This is why options get more expensive before earnings — the market bids IV up.",
    },
    {
      q: "Which of the following, when it increases, makes the **call more expensive while making the put cheaper**?",
      options: ["Volatility σ", "Time to expiry T", "Risk-free rate r", "Dividend yield q"],
      answer: 2,
      explain: "Rate r rises → call ↑, put ↓ (discounting effect: the present value of the future-paid strike K·e^(−rT) shrinks). Volatility and time move calls and puts the same way (both pricier); dividend q's direction is exactly opposite to the rate's.",
    },
    {
      q: "A high-dividend stock is about to go ex-dividend. Considering **dividends alone**, what's the effect on the call and put at the same strike?",
      options: [
        "Call more expensive, put cheaper",
        "Call cheaper, put more expensive",
        "Both more expensive",
        "Neither is affected",
      ],
      answer: 1,
      explain: "The payout drops the share price a notch on the ex-date, and option holders don't receive it: the call's upside shrinks (**cheaper**), the put's downside gets an assist (**more expensive**). This is also why an American call may be exercised early before the ex-date (Stage 9.5).",
    },
    {
      q: "\"When you buy an at-the-money option, what are you mainly trading?\" The most apt statement is:",
      options: [
        "Trading the underlying's intrinsic value",
        "Trading the underlying's volatility (IV)",
        "Trading the risk-free rate",
        "Trading the contract multiplier",
      ],
      answer: 1,
      explain: "An at-the-money option has intrinsic value ≈ 0, so the entire premium is almost all time value, and time value is driven mainly by **volatility**. So buying an at-the-money option, you're betting less on direction than on whether **implied volatility** will rise (Stages 4.2, 5.5).",
    },
  ],

  further: [
    { label: "Investopedia: Option Pricing Theory (factors affecting option prices)", url: "https://www.investopedia.com/terms/o/optionpricingtheory.asp" },
    { label: "Investopedia: What Factors Affect Option Prices?", url: "https://www.investopedia.com/articles/optioninvestor/06/optionpricing.asp" },
    { label: "OIC: Pricing & Volatility (the six pricing drivers)", url: "https://www.optionseducation.org/" },
  ],
};
