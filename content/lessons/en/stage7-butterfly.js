export default {
  id: "butterfly",
  stage: 7,
  order: 2,
  title: "Butterflies: Betting on Calm",
  difficulty: 3,
  prereqs: ["vertical-spreads"],

  oneLiner:
    "A butterfly = **buy 1 low strike + sell 2 middle strikes + buy 1 high strike** (three equally spaced strikes). It's cheap, with cleanly defined risk, and it's the mirror of a straddle: **betting the underlying \"pins near the middle strike.\"** Max profit comes when the expiry price equals the middle strike exactly; the loss is capped at that thin net debit.",

  intuition: `
A straddle (Stage 7.1) bets on "**a big move**." If your view is the exact opposite — "**this name is going to clamp down and grind near some price**" — what structure should you use? A short straddle works, but its **unlimited risk** and heavy margin make it too dangerous. A butterfly offers a **cheap, risk-defined** alternative: for a tiny cost, bet on "**pinning the middle.**"

A butterfly is built from **three equally spaced strikes**, most commonly a **call butterfly** — a symmetric "**buy 1 / sell 2 / buy 1**" structure. Take an underlying at 100:

- **Buy** 1 strike-**95** call, paying 7;
- **Sell** 2 strike-**100** calls, collecting 4 each (8 total);
- **Buy** 1 strike-**105** call, paying 2;
- Net paid (debit) = 7 − 8 + 2 = **$1/share**, one combo = **$100**.

You can understand it as two vertical spreads (Stage 6.5): **a bull call spread (buy 95 / sell 100) + a bear call spread (sell 100 / buy 105)**, glued back to back at the middle 100.

At expiry, a few cases:

- Pinned at **100** (the middle strike): the bought 95 call is worth 5, the two sold 100 calls expire worthless, and the 105 call also expires worthless. The combo makes 5 − 1 cost = a net **$4/share = +$400** — **max profit, dead center.**
- Falls **below 95** or rises **above 105**: all legs go to zero or hedge each other out, and you lose just that **$1** net paid = **−$100** (max loss).
- Between 96 and 104: P&L is between −100 and +400, forming a sharp "**tent**."

See the essence? **For a limited cost of $100, you bet the underlying pins near 100 at expiry, with up to $400 of profit.** The risk-reward is tempting (risk 1 to make 4), at the price of a **very narrow win zone** — the price really has to land under that small tent. It's a classic "**pin bet.**"

**In this lesson we break the butterfly into five pieces:**

- **① Structure: buy 1 / sell 2 / buy 1, three equally spaced strikes**
- **② Understanding it as two vertical spreads**
- **③ A quick reference for max profit/loss and the two breakevens**
- **④ Its mirror relationship to a straddle: betting on stillness, −Vega**
- **⑤ Variants: the iron butterfly, the broken-wing butterfly, and when to use them**
`,

  mechanics: `
### ① Structure: buy 1 / sell 2 / buy 1

**A long call butterfly = buy 1 low-strike call (K₁) + sell 2 middle-strike calls (K₂) + buy 1 high-strike call (K₃)**, all **equally spaced** (K₂ − K₁ = K₃ − K₂ = wing width w), same expiry.

Why these three pieces?

- The **2 sold** middle calls are the income source: they provide premium and "tent up" the P&L into a peak at K₂.
- The **1 bought** call on each side is a "**wing**" — a protection leg that nails shut the **unlimited risk** the bare 2 sold middle calls would otherwise carry, at both ends.

The net cash flow is typically a **small debit** (the two wings you buy cost slightly more than the 2 sold calls collect). Because the cost is so low, a butterfly is the poster child for "**small bet, big swing, risk written down.**" Note the contract counts must balance: **1 on each end, 2 in the middle**, total bought = total sold (1+1=2), so the far-tail risk is fully hedged.

### ② Understanding it as two vertical spreads

The best way to understand a butterfly is as **two back-to-back vertical spreads** (Stage 6.5) glued at the middle strike K₂:

- **The lower half = a bull call spread**: buy K₁ call + sell K₂ call (bet on a rise to K₂).
- **The upper half = a bear call spread**: sell K₂ call + buy K₃ call (bet on not rising past K₃).

The two spreads **share the middle K₂** (where 2 are sold). When the expiry price is exactly = K₂, the lower-half bull spread captures its full max profit and the upper-half bear spread just breaks even — the two stack to a peak at K₂. The farther from K₂, the more one side's profit is eaten by the other's loss, until beyond the wings everything goes to zero (leaving only the net-paid loss).

> This also explains why a butterfly is a **defined-risk** structure: it's essentially a combination of two structures that are themselves "defined-risk" vertical spreads, so the risk is naturally nailed shut by the two wings.

### ③ Max profit / loss / breakeven

Using the example (K₁=95, K₂=100, K₃=105, wing width w=5, net debit D=1), the three key numbers are pinned down:

- **Max profit = wing width − net paid = w − D = 5 − 1 = $4/share = +$400**, **achieved only when the expiry price = the middle strike K₂=100 exactly** (that peak).
- **Max loss = net paid D = $1/share = −$100**, occurring when the expiry price ≤ K₁=95 or ≥ K₃=105 (outside the wings, all legs go to zero together).
- **The two breakevens = K₂ ± (max profit) = 100 ± 4 = 96 and 104**. Equivalently: **lower BE = K₁ + D = 95+1 = 96; upper BE = K₃ − D = 105−1 = 104.**

The mantra: **a butterfly's max loss = the net paid (very small); the max profit = wing width − net paid, realized only dead center.** The risk-reward is often gorgeous (here 1:4), but **the win zone is narrow** (only 96–104 avoids a loss), and the peak profit demands "**hitting the bullseye**" on the middle strike — its hardest part.

### ④ Its mirror with a straddle: betting on stillness, −Vega

Put a butterfly next to a long straddle (Stage 7.1) and they're opposite almost everywhere:

- **Directional view**: a straddle bets on "**a big move**" (V shape, most painful in the middle); a butterfly bets on "**no move**" (tent shape, most pleasant in the middle).
- **Vega**: a long straddle is **+Vega** (wants IV to rise); a **long butterfly is −Vega** (the 2 sold middle legs dominate, **wanting IV to fall and the underlying to sit still**). So a butterfly is often used when **volatility is expected to compress and high IV is set to fall.**
- **Theta**: a long straddle is −Theta (time is the enemy); a **long butterfly is +Theta when the price is near the middle strike** (time is a friend, helping "tent up" your profit) — but if the price strays far from the middle, the Theta relationship flips.
- **Cost and risk**: a straddle pays two premiums with a larger max loss; a butterfly nets a tiny debit, with the max loss written down at that thin cost.

You could say: **a butterfly = a "seatbelt-on" version of a short straddle.** It sacrifices the short straddle's wider profit zone in exchange for **limited risk + a very low cost.** When your view is "grinding near some price" and you don't want unlimited risk, a butterfly is a highly cost-effective expression.

### ⑤ Variants: the iron butterfly, the broken-wing butterfly

The butterfly has a few common variants — same principle, different emphases:

- **Iron butterfly**: built from "**sell an ATM straddle + buy an OTM strangle as protection**," i.e. sell the ATM call+put, buy the farther OTM call+put. It's a **credit** structure (you collect up front), with a payoff shape nearly identical to a long call butterfly, just built with mixed calls and puts and with the opposite cash-flow direction. It can be seen as the limit of an **iron condor (Stage 7.3) with its two sold strikes pulled together to a single point** — a narrower profit zone but a higher peak.
- **Broken-wing butterfly**: deliberately makes the two wings **unequal** (one wing wider), thereby **eliminating the risk on one side** or even making it a net credit. Often used to keep the "bet on stillness" thesis while turning one direction's tail risk into something acceptable or zero-cost.

Whichever variant, the core is unchanged: **they're all structures that "bet, with defined risk, on the underlying landing in some range / at some point,"** differing only in calls vs puts, symmetric vs asymmetric, collect vs pay. Later, in ratio spreads (Stage 7.5), you'll see that **once you remove one side's protection wing**, defined risk reverts to bare risk.

The demo on the right lets you drag a **wing-width** slider to watch live how the tent grows taller and fatter and how the max profit/loss and the two breakevens shift with it (consistent with the netPL engine).
`,

  demo: "butterfly",

  analogy: `
A butterfly is like **betting a dart will "hit the bullseye," when you can only afford to wager a little.**

You step up to the line, but the rules are special this time:

- **The closer to the bullseye, the higher the prize**, and a **dead-center bullseye** takes the top prize (max profit = wing width − cost, $400 in the example).
- The moment you **miss** (the dart flies outside some ring), you lose only your **tiny entry fee** (max loss = net paid, $100 in the example).

To play this round, your "**entry fee**" is rock-bottom (net debit $1/share). The temptation is the alluring odds (risk 1 to make 4); the difficulty is that **the bullseye is small** — the dart really has to land near the middle strike (96–104) just to avoid a loss, and dead-center to take the full prize.

That's the soul of a butterfly: **with a little money, bet that the price "pins" precisely at some level at expiry.** It's a natural rival to the straddle — the straddle bets "the dart will fly wild, the farther the better," the butterfly bets "the dart will plant firmly in the bullseye."
`,

  misconceptions: [
    "**\"A butterfly earns its max profit as long as the price is anywhere between the wings.\"** — Wrong. Max profit is achieved **only at the one point where the expiry price equals the middle strike** (exactly 100 in the example). Between the wings but off-center, the profit declines along a ramp; only landing in 96–104 avoids a loss.",
    "**\"A butterfly has unlimited risk, because 2 are sold in the middle.\"** — Backwards. The \"wings\" — 1 bought on each side — **fully nail shut** the risk of the bare 2 sold middle calls. A long butterfly is a **defined-risk** structure, and its max loss is exactly that tiny net debit.",
    "**\"The cheaper the butterfly, the better.\"** — A smaller net paid does mean a smaller max loss, but the **max profit = wing width − net paid** is squeezed lower too, and too-cheap often means the center is far from spot with a low hit probability. Cheap ≠ a good deal — view it together with \"the probability the price lands at the center.\"",
    "**\"Butterflies and straddles are both volatility strategies, so the direction is the same.\"** — Quite the opposite. A long straddle is **+Vega, betting on a big move**; a long butterfly is **−Vega, betting on stillness.** They're mirrors: the straddle is most painful in the middle, the butterfly most pleasant in the middle.",
    "**\"The wider the wings, the bigger the max profit, so always use wide wings.\"** — Wide wings have a large max profit (wing width − net paid), but a larger cost/max loss too and more distant breakevens, needing the price closer to center to profit. Narrow wings are cheap and low-risk but cap the peak low. Wide vs narrow is a tradeoff, and a broken-wing butterfly is the asymmetric compromise.",
  ],

  quiz: [
    {
      q: "Long call butterfly: buy K=95 call paying 7, sell 2 K=100 calls collecting 4 each, buy K=105 call paying 2. What is the **net cost (debit)**?",
      options: ["$100", "$300", "$500", "Collect $100 (credit)"],
      answer: 0,
      explain: "Net paid = 7 − (2×4) + 2 = 7 − 8 + 2 = **$1/share**, ×100 = **$100**. The 2 sold middle calls' income (8) nearly offsets the two wings' cost (9), so a butterfly is extremely cheap.",
    },
    {
      q: "For that same butterfly (95/100/105, net debit 1), what is the **max profit** and at what price is it achieved?",
      options: [
        "Max profit $100, at S=95",
        "Max profit $400, at S=100",
        "Max profit $500, at S=100",
        "Max profit $400, anywhere between 95 and 105",
      ],
      answer: 1,
      explain: "Max profit = wing width − net paid = (100−95) − 1 = 4/share = **+$400**, achieved **only when the expiry price = the middle strike 100 exactly.** Off-center, the profit slides down a ramp.",
    },
    {
      q: "What are this butterfly's **max loss** and **two breakevens**?",
      options: [
        "Max loss $400; breakevens 95 and 105",
        "Max loss $100; breakevens 96 and 104",
        "Max loss unlimited; breakeven 100",
        "Max loss $100; breakevens 99 and 101",
      ],
      answer: 1,
      explain: "Max loss = net paid = **$100** (expiry price ≤95 or ≥105, outside the wings); breakevens = middle strike ± max profit = 100 ± 4 = **96 and 104** (i.e. K₁+D=96, K₃−D=104).",
    },
    {
      q: "You think a stock will enter a **low-volatility range with high IV that will fall back**, and you want to bet, with **limited risk**, that \"it just grinds near 100.\" Which structure fits best?",
      options: [
        "A long straddle",
        "A long strangle",
        "A long butterfly (centered at 100)",
        "A single long call",
      ],
      answer: 2,
      explain: "Betting on stillness + IV falling back + limited risk → **a long butterfly** (−Vega, +Theta when price is near center, max loss = the tiny net paid). A straddle/strangle is +Vega betting on a big move, the opposite direction; a single long call is a directional bet.",
    },
  ],

  further: [
    { label: "Investopedia: Butterfly Spread", url: "https://www.investopedia.com/terms/b/butterflyspread.asp" },
    { label: "Investopedia: Iron Butterfly", url: "https://www.investopedia.com/terms/i/ironbutterfly.asp" },
    { label: "Options Industry Council (OIC): Butterfly", url: "https://www.optionseducation.org/strategies" },
  ],
};
