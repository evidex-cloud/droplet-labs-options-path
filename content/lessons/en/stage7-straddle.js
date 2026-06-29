export default {
  id: "straddle-strangle",
  stage: 7,
  order: 1,
  title: "Straddles & Strangles: Betting on a Big Move",
  difficulty: 2,
  prereqs: ["call-option", "put-option"],

  oneLiner:
    "A straddle = **buy a call and a put at the same strike at once** — you don't bet on direction, only on \"**a big move**.\" The two breakevens = strike ± total premium; you profit if the underlying lunges far enough either way, while a flat market or a volatility collapse loses on both legs. It's the textbook **long-volatility (+Vega, +Gamma, −Theta)** structure.",

  intuition: `
The single legs and vertical spreads so far all bet on **direction**: bullish, bearish, mildly up, mildly down. But there's a class of moments where you have **no read on direction** yet a strong read on **magnitude** — the night before earnings, an FDA approval, a merger rumor, a Fed decision. You're sure "**it'll move big tomorrow**," but you don't know whether it's a spike up or a crash down.

A straddle is built for exactly those moments: **at the same strike and the same expiry, buy one call and one put at once.**

Take an underlying at **$100**, buying an at-the-money straddle:

- **Buy** the strike-100 call, paying **$6**;
- **Buy** the strike-100 put, paying **$6**;
- Total cost (net debit) = **$12/share**, one contract = **$1,200**.

At expiry, three cases:

- Spikes to **120**: the call is worth (120−100)=20, the put expires worthless; the combo makes 20 − 12 = a net **$8/share = +$800**.
- Crashes to **80**: the put is worth (100−80)=20, the call expires worthless; likewise a net **$8/share = +$800**.
- Pinned near **100**: both legs go nearly to zero, losing most or all of the **$1,200**.

See the trick? **Making money has nothing to do with direction, only with "how far from 100."** You're betting on volatility itself. The price is that you **paid two premiums**, so the underlying has to move **far enough** to recoup them — which leads to the straddle's two most important numbers: **the two breakevens = 100 ± 12 = 88 and 112**. The middle zone — not above 112, not below 88 — is all your loss region.

Swap both legs for **OTM** options, spreading the strikes apart, and you get the cheaper but greedier cousin — the **strangle**. Flip the whole structure to **sell** it, and you have the rent-collecting **short straddle / short strangle**.

**In this lesson we break "betting on a big move" into five pieces:**

- **① The long straddle: not betting direction, only magnitude — two breakevens**
- **② The strangle: cheaper, with two wider thresholds**
- **③ Why it's "long volatility": +Vega, +Gamma, −Theta**
- **④ Earnings and IV crush: the long straddle's biggest hidden enemy**
- **⑤ The short straddle/strangle: standing on the other side to collect time value (and risk)**
`,

  mechanics: `
### ① The long straddle: two breakevens

**A long straddle = buy 1 ATM call + buy 1 put at the same strike and expiry.** Add the two legs vertically at expiry (Stage 2.2) and you get a signature **V shape**: the trough at the strike, both sides opening up at 45°.

Let the strike be K, the call premium c, the put premium p, total cost D = c + p (per share). Expiry P&L (per share):

$$expiry P&L = max(S − K, 0) + max(K − S, 0) − D
$$= |S − K| − D

From it come three must-know numbers (using the example K=100, c=p=6, D=12):

- **Max loss = D = $12/share = $1,200**, occurring at **S = K** (the underlying pinned exactly at the strike, both legs go to zero). This is the key difference from a single leg: **the most painful point isn't at the ends, but dead center.**
- **The two breakevens BE = K ± D = 88 and 112**. Note it's "plus the total premium," not one side — because you bought two policies, the thresholds are pushed wider apart.
- **Max profit**: upside is **theoretically unbounded** (the higher S, the more you make); downside stops at S=0, capped at **K − D = $88/share = +$8,800** (the put is worth a full 100 at a zero stock price, minus the cost 12). By convention a straddle is filed as the "**open at both ends**" long-volatility structure.

The mantra: **a long straddle makes money on "moving far enough" and loses on "not budging."** It wants absolute magnitude to exceed D; direction is irrelevant.

### ② The strangle: cheaper, wider

**A long strangle = buy 1 OTM call (higher strike) + buy 1 OTM put (lower strike)**, same expiry. Because both legs are OTM and cheaper, the total cost is below a straddle's — at the price that **the two breakevens are pushed wider apart**, requiring a bigger move to recoup.

Example (underlying 100): buy the **strike-105** call paying 4, buy the **strike-95** put paying 4, total cost **$8/share**:

- **Max loss = $8/share = $800** — but it's a **flat bottom**: as long as the expiry price lands **between 95 and 105**, both legs expire worthless and you lose the full 800 (unlike a straddle's single most-painful point, a strangle has a whole most-painful range).
- **The two breakevens = 95 − 8 = 87 and 105 + 8 = 113** (lower BE = lower strike − total cost; upper BE = higher strike + total cost).
- **Max profit**: upside unbounded; downside capped at **$87/share = +$8,700**.

**Straddle vs strangle tradeoff**: a straddle is pricier, with a narrower most-painful point and nearer breakevens (easier to make at least a little); a strangle is cheaper, with a smaller max loss (in absolute dollars), but needs a **more violent move** to clear its more distant thresholds. The more extreme the move you're betting on, the better a strangle's value.

### ③ Why it's "long volatility": +Vega, +Gamma, −Theta

A straddle isn't just a bet on expiry magnitude — **before expiry** it's a pure long-volatility position. Through the Greeks (Stages 5.3, 5.5):

- **Delta ≈ 0 (when ATM)**: the call's Delta≈+0.5 and the put's≈−0.5 cancel out. So at inception you're nearly **direction-neutral** — the mathematical embodiment of "not betting direction."
- **+Gamma (positive Gamma)**: both legs are long, so Gamma adds up positive. Once the underlying moves big, Delta auto-accelerates in the favorable direction (turning long on the way up, short on the way down) — the source of the V's "the further it goes, the more it makes."
- **+Vega (positive Vega)**: both legs are +Vega. As long as **implied volatility rises**, the straddle gains value even if the underlying hasn't moved. Many who buy straddles are really **going long IV directly** (Stage 8.3 treats volatility as a tradeable asset).
- **−Theta (negative Theta)**: the price is two premiums of time value bleeding away at once. **Each passing day with no big move, you lose both legs' Theta.** Time is the long straddle's enemy.

In a sentence: **a long straddle = spending daily Theta to buy the chance of "a big move + rising IV."** This is also what market makers call a classic "**long Gamma**" position (Gamma scalping in Stage 5.3 is precisely using positive Gamma to buy low and sell high in the chop, offsetting Theta).

### ④ Earnings and IV crush: the biggest hidden enemy

The most common beginner trap: **"I bought a straddle before earnings to bet on a big move, the move really did come after earnings — and I still lost money."** That's not a bug, it's **IV crush.**

The mechanism:

- Before a **known uncertainty event** like earnings or an approval, the **implied volatility** for the matching expiry gets pumped way up — because everyone knows a big move is coming, so the options are bid expensive.
- You buy the straddle here, paying a **rich price that bakes in high IV.**
- The event lands, uncertainty vanishes, and **IV collapses instantly.** Even if the underlying really moved, your two +Vega legs shrink hard on the IV plunge. If the actual move **doesn't exceed what the options had already priced in**, the net result is a loss.

So a long straddle is really betting **not on "will it move" but on "will the actual move exceed the amount the market has already priced in"** — that is, realized volatility must beat implied volatility (Stage 4.2). This is the same yardstick it shares with seller strategies: the variance risk premium (Stage 8.3).

> Practical tip: to evaluate a long straddle, first compare "how far the breakevens sit from spot" against "this name's historical average post-earnings move." If both breakevens have already been pushed by high IV beyond the historical move, the trade is most likely paying for someone else's panic.

### ⑤ The short straddle / strangle: standing on the other side

Flip the whole structure and you have a **short straddle = sell 1 ATM call + sell 1 ATM put.** The payoff is the mirror of a long straddle — an inverted V (∧):

- **Max profit = the total premium collected D** (+$1,200 in the example), occurring at **S = K** (the underlying doesn't budge, both legs expire worthless, and you keep the entire premium).
- **The two breakevens are likewise = K ± D = 88 and 112**, but the regions invert: **you only profit if it lands between 88 and 112.**
- **Max loss**: upside is **theoretically unlimited** (a naked call — the underlying spikes and you must deliver cheap), downside stops at a zero stock price but is still a large sum. This is the classic "**picking up pennies in front of a bulldozer**" — steadily collecting time value, until one big move swallows many sessions' profits.

A short straddle makes exactly what the buyer loses: **+Theta (time is a friend), −Vega (wants IV to fall), −Gamma (fears a big move).** Its profit rests on the variance risk premium — that **implied volatility tends to run slightly above realized over the long run** (Stage 8.3). But because of **unlimited risk + high margin**, a naked short straddle is an advanced and dangerous play; in practice most people buy two farther OTM legs as protection, collapsing it into an **iron condor** (Stage 7.3) — trading defined risk for most of the rent.

The demo on the right uses a segmented toggle to switch between **straddle / strangle**, drawing the V-shaped P&L live, marking the two breakevens, and contrasting the +Vega/−Theta essence.
`,

  demo: "straddle",

  analogy: `
Buying a straddle is like **betting both sides of a match you know will be a blowout but can't call the winner.**

The night before the final, you're convinced "**tomorrow will be a one-sided slaughter**," but you have no idea which team wins. So you **buy two tickets at once — a home-team blowout and an away-team blowout** — each costing something.

- As long as tomorrow really is **lopsided** (whoever wins), one ticket's payout far exceeds the combined cost of both — you profit.
- What you fear most is a **dull 0:0 draw**: both tickets are void, and you've sunk two stakes for nothing.

That's a straddle exactly: **you're betting on "intensity," not "who wins."** The two ticket prices = the total premium; the line for "intense enough to recoup" = the breakeven (strike ± total premium).

And a **short straddle** is the **house collecting the ticket money**: it bets on a draw, calmly pocketing everyone's stakes most days; but the moment a real lopsided blowout happens, what it owes can exceed many sessions' worth of collected stakes combined.
`,

  misconceptions: [
    "**\"Once I buy a straddle, I profit as soon as the underlying moves.\"** — Not enough. It has to move past the **breakeven (strike ± total premium)** to profit. In the example K=100, total cost 12, a rise to 108 gives the call $8 of intrinsic value, but minus the $12 total cost it's still a net loss of $4. Just \"moving\" isn't enough — it has to move **far enough.**",
    "**\"If it really spikes after earnings, a long straddle is guaranteed to profit.\"** — Not necessarily. IV is pumped high before earnings, making options expensive to buy; after earnings, **IV crush** shrinks the two +Vega legs. Unless the actual move **exceeds what the market had already priced in**, you lose anyway. A long straddle bets on realized > implied volatility (Stage 4.2).",
    "**\"A straddle has no directional risk, so it's safe.\"** — Delta≈0 at inception doesn't mean safe. Its true enemies are **time (−Theta) and a flat market**: each day with no big move bleeds two premiums of time value, and being pinned near the strike loses the most.",
    "**\"A strangle is better than a straddle because it's cheaper.\"** — The price of cheap is **two more distant breakevens** (needing a more violent move) and a max loss that's a whole flat-bottom range. A straddle is pricier but has nearer thresholds. Wide vs narrow is a \"cost vs how big a move you need\" tradeoff, with no absolute winner.",
    "**\"A short straddle has a high win rate and steadily collects time value — good business.\"** — A high win rate comes with **unlimited risk**: a naked short straddle has uncapped loss on the upside and a large loss on the downside, and ties up heavy margin. It makes a little most of the time and occasionally a lot, so it needs protection legs (collapsing it into an iron condor, Stage 7.3) or strict risk control.",
  ],

  quiz: [
    {
      q: "You buy an at-the-money straddle: the strike-100 call costs 6, the put costs 6 (net debit 12). Where are the **two breakevens**?",
      options: ["94 and 106", "88 and 112", "100 and 112", "Just one: 100"],
      answer: 1,
      explain: "Breakeven = strike ± total premium = 100 ± (6+6) = **88 and 112**. Note you add **both legs' total cost**, not one side, so the thresholds are much wider than a single leg's.",
    },
    {
      q: "For that same straddle (K=100, total cost 12), at expiry the underlying is pinned exactly at 100. What is this combo's P&L?",
      options: ["Breakeven (0)", "Make $1,200", "Lose $1,200", "Lose $600"],
      answer: 2,
      explain: "At S=K=100, both legs have no intrinsic value and go entirely to zero, losing the full total cost = $12/share ×100 = **lose $1,200**. This is the straddle's most painful point — not at the ends, but dead center.",
    },
    {
      q: "Regarding the Greeks of a long straddle, which set is correct?",
      options: [
        "−Vega, +Theta, −Gamma",
        "+Vega, −Theta, +Gamma",
        "+Vega, +Theta, +Gamma",
        "Delta always equals +1",
      ],
      answer: 1,
      explain: "A long straddle has two long legs: **+Vega** (wants IV to rise), **−Theta** (loses time value daily), **+Gamma** (Delta accelerates on a big move). At ATM, Delta≈0, so it's direction-neutral and long volatility.",
    },
    {
      q: "You buy a straddle before earnings, the stock jumps 5% after earnings, yet you still lose money. The most likely reason?",
      options: [
        "You miscalculated the contract multiplier",
        "You can't hold a call and a put at the same time",
        "Post-earnings implied volatility crushed (IV crush), and the actual move didn't exceed the amount already priced in by high IV",
        "A straddle can only be closed at expiry",
      ],
      answer: 2,
      explain: "Before earnings IV is pumped high and options are expensive to buy; after earnings **IV crush** shrinks the two +Vega legs. Unless the actual move **exceeds the amount the market had already priced in** (realized > implied, Stage 4.2), you can net a loss even though the stock moved.",
    },
  ],

  further: [
    { label: "Investopedia: Straddle (a full walkthrough)", url: "https://www.investopedia.com/terms/s/straddle.asp" },
    { label: "Investopedia: Strangle", url: "https://www.investopedia.com/terms/s/strangle.asp" },
    { label: "Options Industry Council (OIC): Straddles & Strangles", url: "https://www.optionseducation.org/strategies" },
  ],
};
