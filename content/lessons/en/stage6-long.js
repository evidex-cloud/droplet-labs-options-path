export default {
  id: "long-call-put",
  stage: 6,
  order: 1,
  title: "Long Calls & Puts: Directional Bets",
  difficulty: 1,
  prereqs: ["call-option", "put-option"],

  oneLiner:
    "Buying a call or put is the most basic directional bet: bullish → **buy a call**, bearish → **buy a put**, using a single capped premium to control the underlying's move. It hands you leverage and a floored downside, but you have to **beat both time and volatility** at once — which is exactly why most long options expire worthless.",

  intuition: `
You already met the call (the prereq from Stage 1.1) and the put (Stage 1.2) on their own. This lesson uses them as **strategies**: when you have a clear directional view, a single long leg is the most direct way to express it with the cleanest risk.

Take an underlying at **$100**:

- **Bullish → buy a call**: pay $5/share (one contract = **$500**) for a strike-100 call expiring in a month. If it rises to 115, you make 15−5=10/share, or **+$1,000** per contract; if it drops to 90, the whole $5 premium is gone, **−$500**.
- **Bearish → buy a put**: pay $5/share for a strike-100 put. If it falls to 85, you make 15−5=10/share, **+$1,000**; if it rises to 110, you lose that $500.

Versus simply buying or shorting 100 shares, what's different? Owning 100 shares ties up **$10,000** of capital and gives you a linear payoff; one long call costs only **$500** yet controls the upside of the same 100 shares — **that's leverage**. But there's no free leverage: most of the $5 you paid is **time value** (Stage 1.6), and it melts away with each passing day (Theta, Stage 5.4) and shrinks if implied volatility (Vega, Stage 5.5) falls.

In other words, **a buyer needs to be not just right on direction, but fast and large enough**. If the stock sits still, a shareholder neither gains nor loses — yet your call quietly loses value day after day. This is the most counterintuitive and most lethal feature of a single long option.

**In this lesson we break "buying calls and puts" as a strategy into five pieces:**

- **① When to use a call vs a put — turning a directional view into a position**
- **② Leverage: how $5 moves the upside of 100 shares, amplifying the percentage**
- **③ Two headwinds: Theta decay and IV mean-reversion (you, the buyer, pay time value)**
- **④ Why most long options expire worthless**
- **⑤ Picking strike and expiry: trading off leverage, cost, and win rate**
`,

  mechanics: `
### ① When to use a call vs a put

A single long leg expresses exactly one thing: **a direction + a time window**.

- **Long call**: bet the underlying **rises** before expiry. Max loss = premium; max profit = theoretically unlimited (the higher it goes, the more you make); breakeven = strike + premium.
- **Long put**: bet the underlying **falls** before expiry. Max loss = premium; max profit = (strike − premium) (the stock can only fall to 0); breakeven = strike − premium.

The two are mirror images: the call's hockey stick angles up to the right, the put's reversed hockey stick angles up to the left. Notice one asymmetry — **the call's upside is uncapped, while the put's profit is bounded by the stock hitting zero.**

### ② Leverage: the percentage amplifier

The essence of leverage: you use the **small price of an option** to gain exposure to the **large notional of the underlying**. A rough but useful gauge uses Delta (Stage 5.2):

$$option exposure ≈ Delta × 100 × spot
$$effective leverage ≈ option exposure ÷ premium cost

Example: an at-the-money call with Delta≈0.5, spot 100, premium 5. Its equivalent stock exposure ≈ 0.5×100×100 = $5,000, while you paid only $500 — **about 10× leverage**. The underlying rises 1% (+$1), the option rises roughly $0.50, i.e. +10%. **The percentage is amplified 10×**, while the downside is nailed shut at that $500. This is precisely what makes buying so seductive — and the trap that gets people to oversize, then go to zero.

### ③ Two headwinds: Theta and IV

A buyer pays the premium, and **everything in that premium above intrinsic value is time value**. That slice faces two relentless headwinds:

- **Theta (time decay, Stage 5.4)**: each passing day, the option loses a bit of time value, so **a buyer's Theta is negative** — time is your enemy. The closer to expiry, the harsher the Theta on an at-the-money option, and the decay accelerates.
- **Vega (implied volatility, Stage 5.5)**: a buyer's Vega is positive, so you **want IV to rise**. But if you buy at high IV (e.g. before earnings), the event passes and IV often "crushes" (IV crush) — even if you nailed the direction, the option can fail to profit or even lose on the Vega hit.

> The key: buying an option = **being long volatility + on the wrong side of time decay**. You need the underlying to **move your way fast enough and far enough** to outrun the bleed of Theta. Standing still is slow bleeding for a buyer.

### ④ Why most long options expire worthless

The oft-quoted line is "most options expire worthless." It's not that the market is out to get buyers — it's **structural**:

- An out-of-the-money option first has to become in-the-money, then push past breakeven (strike ± premium) to profit — and that demands a **big enough directional move**.
- Meanwhile Theta drains time value every day. **Right direction, not enough magnitude = a loss anyway**: at S=107, K=105, cost 5, exercising at expiry recovers only $2, a net loss of $3.
- The cheaper and deeper out-of-the-money it is, the more lottery-like: tempting single-ticket odds, but a very high probability of going to zero.

This doesn't mean buyers can't profit — it means **buyers must pick their timing and control their size**, treating every ticket as a limited-risk bet that "could go to zero" (position sizing, Stage 8.1).

### ⑤ Picking strike and expiry

The same directional view can be expressed many ways, and the core is trading off **leverage, cost, and win rate**:

- **Strike**:
  - **In-the-money (ITM)**: high Delta (behaves like stock), little time value, gentle Theta headwind — but expensive, low leverage. Fits "fairly confident on direction, want a higher win rate."
  - **At-the-money (ATM)**: maximum time value and Gamma, moderate leverage — the most common directional choice.
  - **Out-of-the-money (OTM)**: cheap, highest leverage, but low Delta and most prone to going to zero. Fits "small bet for a big payoff, swinging for a major move."
- **Expiry**:
  - **Near-dated**: cheap, high leverage, but the fastest Theta decay and little time for the move to play out.
  - **Far-dated**: expensive, gentle Theta, large Vega (more sensitive to IV changes), giving the thesis more time to work. A common practice is to **buy enough expiry** to avoid getting timed out.

In a sentence: **the deeper ITM and the more far-dated, the more it behaves like a "safe version of the stock"; the deeper OTM and the more near-dated, the more it's a "high-odds lottery ticket."** The demo on the right lets you toggle call/put and drag strike, premium, and expiry value, while placing it side by side with the percentage return of simply owning 100 shares.
`,

  demo: "long-directional",

  analogy: `
Buying a single long option is like **using a little money to buy a "time-limited" lottery ticket** — except you pick the winning line yourself.

- **Buying a call** = betting "something will rise past a certain price within a deadline." You spend a little (the premium) to lock in the chance; wrong, and the ticket is void (you lose the premium); right and far enough, and the payoff is amplified.
- **Buying a put** = betting "something will fall below a certain price within a deadline."

Three things set it apart from a real lottery. First, you **pick the winning line** (the strike) and the **draw date** (expiry) — the more demanding the line, the cheaper and harder to hit. Second, it **loses value every day** (Theta); just holding it makes it worth less and less. Third, before the "draw" you can **sell the ticket on** (close the position) any time — you never have to wait it out to expiry.

Remember both sides of the lottery mindset: **single-ticket risk is limited (you lose at most the ticket price), but the expectation is often negative** — so don't bet your whole stack on a string of deep-OTM "cheap tickets."
`,

  misconceptions: [
    "**\"If I get the direction right, I'm guaranteed to profit.\"** — Not necessarily. You also have to move past the **breakeven** and outrun **Theta**. At S=107, K=105, cost 5, you nailed the direction yet still net a $3 loss. A buyer needs \"right direction + enough magnitude + enough speed.\"",
    "**\"Buying options is safer than buying stock, because losses are capped.\"** — A single loss is indeed capped at the premium, but **a −100% percentage loss comes easily**: a stock that halves costs you 50%, while the matching call often goes straight to zero. Capped doesn't mean small — it comes down to sizing (Stage 8.1).",
    "**\"Buying options before earnings to bet on a big move is a sure thing.\"** — IV is usually pumped up high before earnings, and once the event passes you get **IV crush (a Vega loss, Stage 5.5)** — even if the stock moves as hoped, the option can fail to profit or lose. A buyer must beware of \"buying at the top of volatility.\"",
    "**\"The cheaper the OTM option, the better the deal.\"** — It's cheap because it's **far from in-the-money with a high chance of going to zero**. Deep-OTM has the most leverage but is the most like a worthless ticket; ITM is pricey but behaves like stock with a higher win rate. Which to pick depends on the strength of your conviction and your taste for odds (Stage 1.5).",
    "**\"You must hold to expiry.\"** — The vast majority of buyers **sell to close** before expiry, capturing the change in premium — they never actually exercise, nor sit through the final, steepest stretch of Theta. Treat the expiry date as a backstop, not the only moment to realize gains.",
  ],

  quiz: [
    {
      q: "The underlying is at 100. You pay $5 for one at-the-money call, strike 100, one month to expiry (Delta≈0.5). Which scenario is most likely to leave you \"right on direction but still losing money\"?",
      options: [
        "The underlying rises to 130 within the month",
        "The underlying edges up to 103 as expiry approaches",
        "The underlying crashes to 70",
        "The underlying rises to 120 and IV jumps",
      ],
      answer: 1,
      explain: "Breakeven = 100+5 = 105. The underlying only reaches 103, never crossing breakeven, and with expiry near, **Theta** has eaten most of the time value — at expiry you recover just $3 of intrinsic value per share, a net loss of $2. The textbook case of **right direction, not enough magnitude**.",
    },
    {
      q: "Regarding the \"two headwinds\" a single long option faces, which is correct?",
      options: [
        "Theta is positive for the buyer and Vega is negative",
        "Theta is negative for the buyer (time is the enemy), and buying at high IV risks IV crush",
        "The buyer is affected by neither Theta nor Vega",
        "Only the seller is affected by Theta",
      ],
      answer: 1,
      explain: "A buyer's **Theta is negative** (losing time value daily) and **Vega is positive**, but if you buy at high IV, a post-event drop in IV inflicts a Vega loss (IV crush). These two headwinds are the root cause of long options so often going to zero.",
    },
    {
      q: "Underlying 100, ATM call with Delta≈0.5, premium 5. Roughly what is this call's \"equivalent stock exposure\" and effective leverage?",
      options: [
        "Exposure $100, about 1× leverage",
        "Exposure $5,000, about 10× leverage",
        "Exposure $500, about 1× leverage",
        "Exposure $10,000, about 2× leverage",
      ],
      answer: 1,
      explain: "Equivalent exposure ≈ Delta×100×spot = 0.5×100×100 = **$5,000**; divided by the $500 cost ≈ **10×** leverage. The underlying rises 1%, the option rises ~10%, but the downside is nailed shut at $500.",
    },
    {
      q: "You're \"fairly confident on direction, want a higher win rate, and aren't chasing maximum leverage\" on a stock. Which strike choice fits best?",
      options: [
        "Buy deep OTM — cheapest, highest leverage",
        "Buy ITM — high Delta, little time value, more stock-like",
        "Buy the nearest-expiry OTM weekly",
        "It doesn't matter; strike has no effect on win rate",
      ],
      answer: 1,
      explain: "An **ITM option** has high Delta, a small share of time value, and a weak Theta headwind, so it behaves more like stock — higher win rate, lower leverage. Deep OTM is cheap with big leverage but is most prone to going to zero. The choice is fundamentally a leverage-vs-win-rate tradeoff (Stage 1.5).",
    },
  ],

  further: [
    { label: "Investopedia: Long Call / Long Put strategies", url: "https://www.investopedia.com/terms/l/longcall.asp" },
    { label: "Options Industry Council (OIC): Long Call & Long Put", url: "https://www.optionseducation.org/strategies" },
    { label: "CBOE: Options Strategies", url: "https://www.cboe.com/education/" },
  ],
};
