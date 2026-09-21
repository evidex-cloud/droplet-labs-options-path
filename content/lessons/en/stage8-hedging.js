export default {
  id: "delta-hedging",
  stage: 8,
  order: 2,
  title: "Delta Hedging & Gamma Scalping",
  difficulty: 3,
  prereqs: ["delta", "gamma"],

  oneLiner:
    "A market maker doesn't bet on direction — after selling an option, they immediately **drive net delta to 0 with the underlying stock**, earning only the bid-ask spread and time value. But delta drifts as the stock moves, so they must **rehedge continuously**. Hidden in this back-and-forth is the core engine of options market making: **positive gamma = buy-low-sell-high scalping that pays the daily Theta rent; negative gamma = the reverse, chasing the move and bleeding the whole way.** The push-and-pull between gamma and theta is the lifeblood of all options market making (Stage 8.3).",

  intuition: `
Imagine you're a market maker who just sold a client **1 at-the-money call, strike 100, 30 days**, collecting **2.45/share** ($245) in premium. You **don't want to bet on the stock going up or down** — you only want that bit of bid-ask spread and time value, and to throw away the directional risk. How do you throw it away?

Look at the Greeks (computed by the engine): this call you sold has a per-share delta of **+0.53**, and you're short it, so your position's net delta = **−0.53 × 100 = −53**. That means: **for every $1 the stock rises, your short call loses about $53.** That's exactly the directional exposure you want to cancel out.

The fix is direct — **go to the market and buy 53 shares.** Stock has a per-share delta of +1, so buying 53 shares contributes +53 of delta, exactly offsetting the option's −53. Now your portfolio's net delta ≈ **0**: for small moves up or down, the option's P&L and the stock's P&L cancel, and you're **immune to direction**. This is **delta hedging**, also called going delta neutral.

But there's a devil here: **delta is not a constant (gamma, Stage 5.3).** The moment the stock moves, the option's delta changes, and the neutrality you just achieved is immediately skewed again:

- The stock **rises to 105**: the call's delta climbs to about **0.83**, your short net delta becomes −83, but you only hold 53 shares (+53), so the portfolio is net short −30 again. To get back to neutral, you must **buy another 30 shares** — but the stock has already risen, so you're **chasing the buy at a higher price**.
- The stock **falls back to 100**: delta returns to 0.53, your net short goes back to −53, and the 83 shares you hold are now 30 too many, so you must **sell 30 shares** — but now the stock has dropped, so you're **selling at a lower price**.

Notice it? As a **short call (negative gamma)**, your rehedging is always **buy when it rises, sell when it falls — buy high, sell low, losing money on every round trip.** This loss isn't an accident; it's the inevitable cost of negative gamma. So what makes up for it? The **Theta (time value)** you collect each day. **The hedging losses of negative gamma are exactly filled by the rent collected from positive Theta — this is the essence of selling options to make markets.**

And the person on the other side who **bought this call** (**positive gamma**) rehedges in exactly the opposite direction: sell when it rises, buy when it falls — **buy low, sell high**, making money on every round trip. This is **gamma scalping**. The scalping gains they earn go to pay the daily Theta rent.

> One line to grasp the whole picture: **positive gamma buys low and sells high to make money and pays Theta; negative gamma chases the move to lose money and collects Theta. They are two sides of the same coin, and both are betting on "realized volatility vs implied volatility" — which is larger.**

**In this lesson we break delta hedging into five pieces:**

- **① How a market maker drives net delta to 0 with stock**
- **② Delta drifts → you must rehedge continuously as the stock moves**
- **③ Positive gamma = buy-low-sell-high scalping (gamma scalping)**
- **④ Negative gamma = chasing-the-move bleed, filled by Theta**
- **⑤ The gamma-theta push-and-pull: betting on "realized vs implied vol" (continues in Stage 8.3)**
`,

  mechanics: `
### ① Driving delta to 0 with stock

The market maker's first commandment: **make a living on the quoted spread and time value, not on guessing direction.** So each time they take an option order, they immediately use the **underlying stock** to pull the portfolio's net delta back to 0. Stock is a **pure-delta instrument** (per-share delta = ±1, with gamma/theta/vega all 0, Stage 5.7), so hedging with it moves only direction without contaminating the other Greeks — clean and efficient.

Hedge shares = **−portfolio net delta**:

$$Hedge shares = − Σ(option net delta)
$$(sell 1 ATM call → option net delta ≈ −53 → buy about 53 shares)

After doing this, the portfolio's net delta ≈ 0: for instantaneous small moves in the underlying, the option's and stock's P&L cancel to first order. **Note the words "first order"** — delta hedging only flattens the linear term of the Taylor expansion; the second-order gamma term remains (Stage 5.3). That's the source of every story below.

### ② Delta drifts: the inevitability of rehedging

Delta neutral is an **instantaneous** state, not a one-and-done. Three things knock it out of balance and force you to rehedge:

- **Price changes (gamma)**: the main source. As S moves, the option's delta changes along an S-shaped curve (the rate of change is gamma), and net delta immediately deviates from 0.
- **Passage of time (charm)**: even if the stock doesn't move, just letting a day pass makes delta drift (charm, Stage 5.7).
- **Volatility changes (vanna)**: when IV changes, delta drifts too (vanna, Stage 5.7).

In practice, market makers don't hedge continuously (transaction costs would eat all the profit); instead they rehedge on **trigger rules**: either at **fixed times** (e.g. each close) or by a **delta band** (act only when net delta deviates past some threshold). The more frequent the rehedging, the more accurate the hedge — but the **higher the transaction costs**. That trade-off is itself a craft (Stage 10.3 uses reinforcement learning to optimize it).

### ③ Positive gamma = buy-low-sell-high scalping

If you **buy** an option (**positive gamma**), dynamic hedging automatically becomes a "buy low, sell high" machine. Watch one full round trip (you buy 1 ATM call, delta +0.53, so you **short 53 shares** to stay neutral):

- The stock **rises to 105**: the call's delta climbs to 0.83, the portfolio's net delta = +83 − 53 = **+30** (net long). To get back to neutral, **sell 30 shares** — **selling at the higher price**.
- The stock **falls back to 100**: delta returns to 0.53, the portfolio's net delta = +53 − 83 = **−30** (net short). To get back to neutral, **buy back 30 shares** — **buying at the lower price**.

After one up-and-down round, you **sold high and bought low**, netting a spread — this is **gamma scalping**. The more the stock oscillates back and forth, and the more violently, the more times you scalp and the more you earn. Positive gamma curves your P&L **upward**: no matter which way it moves, rehedging helps you make money.

**But there's no free convexity in this world.** Every day you must pay **Theta** (time decay, Stage 5.4). So a positive-gamma holder's true P&L is a **tug-of-war**:

$$scalping gains (from realized vol) vs the daily Theta rent (from implied vol)

Whether you win depends on **whether the volatility actually realized exceeds the volatility implied in the option's price**. This brings us straight to piece ⑤.

### ④ Negative gamma = chasing the move, filled by Theta

**Selling** an option (**negative gamma**) is the mirror-image nightmare. Revisit that short call from the intuition section (sell 1 ATM call, net delta −53, so **buy 53 shares** to hedge):

- The stock **rises to 105**: the call's delta climbs to 0.83, your short net delta = −83, plus 53 shares = **−30** (net short). To get back to neutral, **buy another 30 shares** — **chasing the buy at a higher price**.
- The stock **falls back to 100**: delta returns to 0.53, net delta = −53 + 83 = **+30** (net long). To get back to neutral, **sell 30 shares** — **dumping at a lower price**.

On every round trip you **buy high and sell low**, netting a loss — this is the bleed of negative gamma. The P&L curve bends **downward**: whichever way the underlying moves big, rehedging hurts you. The more violent the move, the more you bleed.

So why does the seller still do it? Because they **collect Theta every day.** The hedging losses of negative gamma are exactly filled by the rent from positive Theta:

> **Selling options to make markets = collecting Theta rent to plug the hole of negative gamma's buy-high-sell-low.** As long as realized volatility is small enough (the hole is smaller than the rent), you net a profit; but once the underlying jumps violently (the hole is bigger than the rent), negative gamma can swallow months of Theta income in a single night. This is the true face, at the hedging level, of "picking up pennies vs being run over by a truck" (Stage 5.3, Stage 8.3).

### ⑤ The gamma-theta push-and-pull: betting on "realized vs implied"

Let's collapse ③ and ④ into one formula. For a delta-hedged option position, the P&L over a short interval can be approximately split into a gamma term and a theta term:

$$hedged P&L ≈ ½ · Gamma · (ΔS)² + Theta · Δt

- **First term ½·Gamma·(ΔS)²**: driven by the **volatility that actually occurs (ΔS)²**. Positive when gamma is positive (scalping gains), negative when gamma is negative (chasing-the-move losses).
- **Second term Theta·Δt**: driven by **time**. Negative when gamma is positive (paying rent), positive when gamma is negative (collecting rent).

The signs of the two terms are always opposite — this is the mathematical root of **gamma and theta as a push-and-pull** (two sides of one coin, Stage 5.3, 5.4). And Black-Scholes tells us that an option's Theta is roughly priced by **implied volatility**, while the gamma term is realized by **realized volatility**. So the conclusion is startlingly clean:

> **After delta hedging, you're no longer betting on direction but on "realized volatility vs implied volatility" — which is larger.**
> - Realized vol > implied vol → **positive gamma (the buyer) wins**: scalping gains outweigh Theta.
> - Realized vol < implied vol → **negative gamma (the seller) wins**: collected Theta outweighs the hedging hole.

This is precisely the starting point of **volatility as a tradable asset** (the variance risk premium, Stage 8.3), and the entire business of options market making: market makers systematically sell volatility, hedge dynamically, and bet that "the market won't actually move as much as IV prices in." Handing the hedging-and-scalping decisions (when, how much, accounting for transaction costs) to a machine to learn the optimal policy is **reinforcement-learning market making and deep hedging** (Stage 10.3).

Stringing the five together: **market makers use pure-delta stock to drive net delta to 0, earning only the spread and time value; but delta drifts with price/time/IV and must be rehedged continuously; positive-gamma rehedging is buy-low-sell-high scalping (earning realized vol, paying Theta), while negative-gamma rehedging is chasing-the-move bleed (losing realized vol, collecting Theta); the two always have opposite signs and are both bets on "realized vol vs implied vol" — this is the core engine of options market making, and the shared starting point for the variance risk premium (Stage 8.3) and RL market making (Stage 10.3).**
`,

  demo: "delta-hedge-sim",

  analogy: `
Delta hedging is like **carrying a full glass of water across a rocking boat**.

Your goal (net delta = 0) is to keep the surface level at all times. But when the boat rocks (the stock moves), the water tilts to one side — you must **constantly adjust your wrist the other way** (buy and sell stock) to keep it level. The more often the boat rocks, the more diligently you adjust. That's "delta drifts, you must rehedge continuously."

And the **feel** of holding the glass — the sign of your gamma — decides whether the trip is a pleasure or a torment:

- **Positive gamma (the buyer) is like holding a self-righting, weighted-bottom glass**: when the boat tilts left, the glass tends to right itself toward the right, so you ride the move, dump a little at the "high point" and top up at the "low point," and each adjustment actually **works in your favor** — that's buy-low-sell-high scalping. The price is that this magical glass **charges rent (Theta) every day** to use.
- **Negative gamma (the seller) is like holding a top-heavy glass desperate to tip over**: when the boat tilts left, the glass accelerates toward the left, and you must chase it down at an "even lower position" and catch it, with each adjustment **costing you** — that's the chasing-the-move bleed. But you **collect a bit of rent (Theta) every day** to plug these holes.

That last line gives away everything: **how hard the boat rocks decides who wins and who loses.** If the boat only sways gently (low realized vol), the rent-collecting seller wins steadily; if the boat hits a storm and pitches wildly (high realized vol), that top-heavy glass gets flung out and shatters — negative gamma swallows months of rent in one night. **What you're betting on is never which way the boat is steering, but how violently it rocks (realized vol vs implied vol).**
`,

  misconceptions: [
    "**\"Market makers make money by predicting whether the stock goes up or down.\"** — Quite the opposite. Market makers **deliberately don't bet on direction**, immediately driving net delta to 0 with stock after opening a position, earning only the bid-ask spread and time value. Their real bet is on **volatility** (realized vs implied), not direction (Stage 8.3).",
    "**\"Once I'm delta neutral, there's no risk.\"** — Delta neutral only strips out the **instantaneous directional** (first-order) risk; the second-order **gamma** remains. When the underlying moves big, a negative-gamma position's rehedging buys high and sells low and bleeds continuously; a single gap can swallow months of Theta income. Neutral is dynamic and fragile, not a get-out-of-jail-free card (Stage 5.7).",
    "**\"Gamma scalping is risk-free arbitrage.\"** — It isn't. Scalping gains come from **realized volatility**, but you must pay **Theta** every day (priced by implied volatility). **Only when the realized volatility exceeds implied does scalping net a profit**; when the oscillation isn't big enough, the Theta paid outweighs the scalping gains, and a positive-gamma holder still loses money.",
    "**\"Selling options to collect Theta is free, steady income.\"** — While collecting Theta you carry **−gamma**. Collecting rent feels comfortable in calm times, but the moment the underlying jumps violently, negative gamma's hedging losses (buy high, sell low) instantly outweigh the rent collected. This is \"picking up pennies vs being run over by a truck\" — a rare large loss buried in steady small gains (Stage 8.3, 8.4).",
    "**\"More frequent hedging is always better; you should rehedge continuously without stopping.\"** — In theory continuous hedging is most accurate, but every trade has a **cost (spread, slippage, fees)**, and over-hedging eats all the profit. In practice you trigger rehedging on fixed times or a delta band, trading off **accuracy against cost** — optimizing that trade-off is exactly the problem reinforcement-learning market making aims to solve (Stage 10.3).",
  ],

  quiz: [
    {
      q: "A market maker sells 1 at-the-money call (per-share delta = 0.53, contract multiplier 100). To make the portfolio delta neutral, what should they do with the underlying stock?",
      options: [
        "Short about 53 shares",
        "Buy about 53 shares",
        "Buy about 100 shares",
        "Nothing — selling the option is itself neutral",
      ],
      answer: 1,
      explain: "The short-call position's net delta = −0.53 × 100 = **−53**. To hedge to 0, you need +53 of delta, i.e. **buy about 53 shares** (stock has per-share delta = +1). Hedge shares = −portfolio net delta.",
    },
    {
      q: "A trader **buys** an at-the-money call and stays delta neutral (holding positive gamma). When the stock rises first and then falls back to where it started, what does their dynamic rehedging look like, and what's the result?",
      options: [
        "Buy when it rises, sell when it falls — buy high, sell low, losing money",
        "Sell when it rises, buy when it falls — buy low, sell high, making money (gamma scalping)",
        "No rehedging is needed at all",
        "Adjust just once, only at expiry",
      ],
      answer: 1,
      explain: "Positive gamma: stock rises → delta grows → portfolio net long → **sell stock** (sell high); stock falls → delta shrinks → portfolio net short → **buy stock** (buy low). One round trip **sells high and buys low for a spread** — that's **gamma scalping**. The price is the Theta paid each day.",
    },
    {
      q: "For a delta-hedged option position, the short-term P&L is approximately ½·Gamma·(ΔS)² + Theta·Δt. This means that after hedging, the trader is essentially betting on what?",
      options: [
        "The direction the stock moves",
        "Changes in the risk-free rate",
        "Whether realized volatility or implied volatility is larger",
        "The level of dividends",
      ],
      answer: 2,
      explain: "The gamma term is driven by **realized volatility (ΔS)²** and the theta term by time, with opposite signs; and Theta is roughly priced by **implied volatility**. So after hedging you're betting on **realized vol vs implied vol**: realized > implied means positive gamma (the buyer) wins, realized < implied means negative gamma (the seller) wins (Stage 8.3).",
    },
    {
      q: "Regarding a **negative-gamma** (option-selling) market maker, which statement is correct?",
      options: [
        "Rehedging is buy-low-sell-high, earning more the more the underlying moves",
        "Rehedging chases the move and bleeds continuously, filled by the Theta collected each day, and can lose hugely when the underlying jumps violently",
        "They have no gamma exposure at all, so no hedging is needed",
        "Big moves up or down both favor them",
      ],
      answer: 1,
      explain: "Negative-gamma rehedging is **chase the buy when it rises, dump when it falls** (buy high, sell low), bleeding continuously. The seller plugs this hole by **collecting Theta** — netting a profit in calm times, but the moment the underlying jumps violently, negative gamma's hedging losses instantly outweigh the rent collected (picking up pennies vs being run over by a truck, Stage 8.3).",
    },
  ],

  further: [
    { label: "Investopedia: Delta Hedging (the mechanics of delta hedging)", url: "https://www.investopedia.com/terms/d/deltahedging.asp" },
    { label: "Investopedia: Gamma Scalping / Gamma Hedging", url: "https://www.investopedia.com/terms/g/gamma-hedging.asp" },
    { label: "Wikipedia: Delta neutral (delta neutral and dynamic hedging)", url: "https://en.wikipedia.org/wiki/Delta_neutral" },
  ],
};
