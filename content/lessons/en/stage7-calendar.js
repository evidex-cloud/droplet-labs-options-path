export default {
  id: "calendar-diagonal",
  stage: 7,
  order: 4,
  title: "Calendars & Diagonals: Trading Time",
  difficulty: 3,
  prereqs: ["theta", "vega"],

  oneLiner:
    "A calendar spread = **sell the near-dated + buy the far-dated, same strike**. You don't bet on direction, you bet on **time**: the near-dated leg's time value decays faster than the far-dated's, and the gap is your profit. It's **+Vega** (gains when IV rises), and its P&L curve is **curved** — because when the near leg expires, the far leg still carries time value. Offset the strikes too, and it's a **diagonal spread**.",

  intuition: `
The strategies so far differ leg-to-leg by **strike** (vertical spreads, butterflies, iron condors). This lesson switches dimensions: let the two legs differ by **expiry**. That opens up a brand-new thing to trade — **time itself**, and the **term structure** across expiries (Stage 4.3 introduced IV arranged along expiry).

The core fact comes from Theta (Stage 5.4): **time value doesn't decay at a constant rate — it drops faster the closer to expiry** (roughly inversely proportional to the square root of remaining time). So for the same strike, **a near-dated option loses far more time value per day than a far-dated one.**

A calendar spread exists to harvest that gap: **sell one near-dated option, and at the same time buy one far-dated option at the same strike.**

Take an underlying at **100** and build a call calendar (same K=100):

- **Sell** the 1-month-to-expiry 100 call, collecting **$3.04**;
- **Buy** the 3-month-to-expiry 100 call, paying **$5.47**;
- Net paid (debit) = 5.47 − 3.04 ≈ **$2.43/share**, one combo ≈ **$243**.

Over the next month, **both legs decay, but the near-dated leg you sold drops faster.** By the day the near leg expires:

- If the underlying is still **near 100**: the near call you sold expires worthless (you kept its entire time value), while the far call you bought **still has 2 months of time value** and is still worth a lot. At this point the whole combo is worth the most — by the BS engine, a peak profit of about **+$197.**
- If the underlying **runs far** (spikes to 130 or crashes to 70): both near and far legs end up with little but intrinsic value, their time value squeezed out, the combo shrinks, and the max loss is about that **$243** net paid.

See the trick? **A calendar spread most wants "the underlying to pin near the strike and grind slowly" — making the near leg you sold go to zero fast while the far leg you bought holds its value.** Its P&L diagram is unlike every prior strategy's: not a kinked line, but a **curve that humps up in the middle** — because when the near leg expires, the far leg's value must be computed with Black-Scholes (the pricing lessons before Stage 7), which is inherently curved.

**In this lesson we break calendars and diagonals into five pieces:**

- **① Structure: sell near, buy far, earning the Theta speed gap**
- **② Why the P&L is curved (not a kinked line)**
- **③ +Vega: it's also a long-volatility position**
- **④ The diagonal spread: offset the strikes too, layering on a directional view**
- **⑤ Risk, the sweet spot, and how to use it**
`,

  mechanics: `
### ① Structure: sell near, buy far, earn the Theta speed gap

**A (call) calendar spread = sell 1 near-dated call + buy 1 far-dated call at the same strike** (puts work the same; a put calendar is common when leaning bearish). It's usually a **net debit** — the far-dated leg is pricier than the near, because more time means thicker time value.

Its profit engine is the **asymmetry of Theta** (Stage 5.4):

- An option's time-value decay **accelerates toward expiry**, roughly ∝ √(remaining time). A 1-month option drops far more time value per day than a 3-month one.
- You **sell** the near (collecting its fast, positive Theta) and **buy** the far (paying its much slower Theta). **Subtract the two, and net Theta is positive** — as long as the underlying doesn't run, time earns you money every day.
- A month later the near leg expires to zero, and you've **net captured "the near leg's entire time value − the far leg's smaller time-value loss over this month."**

So a calendar spread's ideal script is: **within the near leg's life, the underlying obediently grinds near the strike.** In essence it's a **bet on stillness + a bet on time**, roughly direction-neutral (built ATM, Delta≈0).

### ② Why the P&L is curved

This is the **most fundamental difference** between a calendar spread and every prior strategy — make sure you understand it.

The P&L diagrams of vertical spreads, butterflies, and iron condors are all **piecewise-linear**, because we evaluate them **at expiry** — when each leg has only intrinsic value max(S−K,0), a piecewise straight line.

But a calendar spread has **two different expiries.** The moment we care about is **the day the near leg expires**, and on that day:

- **The near short leg**: just expired, with only intrinsic value left (max(S−K,0) for a call) — a kinked line, the simple part.
- **The far long leg**: **hasn't expired yet, still has 2 months of time value!** What it's worth now can't be intrinsic value — it must be repriced with the **Black-Scholes formula** (the matching pricing lessons) at "2 months remaining + the current IV." The BS price is a **smooth curve** in the spot S, not a straight line.

So "the combo's P&L at the near leg's expiry = far-leg BS value − near-leg intrinsic value − initial net paid," **is a curve overall**, humping up near the strike into a **hump**:

$$near-expiry P&L(S) = BS_{far}(S, remaining T, IV) − max(S − K, 0) − net paid

- **The peak is near the strike** (about +$197 at S≈100 in the example): the near leg just went to zero, the far leg's time value is retained the most.
- **It slides down on both sides**: as S strays from K, an ITM near leg drags and the far leg's time value is squeezed out, shrinking the combo.
- **The two breakevens** (about **95.7 and 105.6** in the example): the two S values where the curve crosses zero — they bound the "don't let the underlying run out of this narrow range" win zone.

> This "curved hump" is the calendar spread's fingerprint. The demo on the right uses the BS engine to compute the far leg's value point by point, then subtracts the near-leg intrinsic value and cost to draw this curve — you'll see it's not a kinked line, but a smooth little hill.

### ③ +Vega: also a long-volatility position

A calendar spread doesn't just earn time — it has a pronounced view on **implied volatility** too, and one not quite like the simple Vega in a straddle or iron condor.

The key: **a far-dated option's Vega is larger than a near-dated one's** (Vega grows with time to expiry, Stage 5.5). You buy the far and sell the near, so **the combo's net Vega is positive**:

- **IV rises → the calendar spread gains value.** Because your larger-+Vega far leg appreciates more than the near leg loses. By the engine, at the same price (S=100), lifting IV from 25% to 35% raises the combo's value from about +$197 to about +$276 — the curve is lifted as a whole.
- **IV falls → the calendar spread loses value.** The far leg shrinks and drags the combo.

This gives a calendar spread a unique dual identity: **it bets both "the underlying is still near-term" (earning the Theta speed gap) and "volatility (especially far-dated) rises or at least holds" (earning Vega).** A classic real-world use: build a calendar when **IV is low and you expect future IV to rise** — collecting near-term time value while planting a far-dated long-volatility position. This makes an interesting contrast with a long straddle (Stage 7.1, also +Vega): a straddle wants the underlying to **move big**, while a calendar wants it to **sit still first** but with **rising volatility expectations.**

> Term-structure view: a calendar spread is essentially trading the **relative relationship between near-dated IV and far-dated IV** (Stage 4.3). When near IV is abnormally above far IV (e.g. the near is pumped before earnings or an event, the curve inverts), a sell-near/buy-far calendar is especially favorable — you sell overpriced near-dated volatility and buy relatively cheap far-dated.

### ④ The diagonal spread: offset the strikes too

Drop the calendar spread's "same strike" constraint and let **the two legs' strikes differ too**, and you get a **diagonal spread** — a "**calendar + vertical**" hybrid:

- **Offset both expiry and strike**: e.g. sell the near-dated 105 call, buy the far-dated 100 call. Now you express **three layers** of view at once: ① time (the near decays faster, like a calendar); ② volatility (buying the far, +Vega); ③ **direction** (the strike offset introduces a mild directional tilt, like a vertical spread).
- **Common uses**:
  - **The "poor man's covered call" (PMCC)**: buy a deep-ITM, long-dated call as a "stock surrogate," then repeatedly sell near-dated OTM calls to collect rent. The far-dated deep-ITM call **replaces 100 shares of stock**, slashing the capital tied up (a capital-efficient version of the Stage 6 covered call).
  - **A directional calendar**: shift the calendar's hump **toward the direction you favor** — collecting time value while also betting on a mild direction.
- **The cost**: a diagonal's P&L curve is more complex (the hump skewed by the directional tilt), and the Greeks are harder to read at a glance. It's a "**three dishes from one fish**" — flexible, but it also demands you watch time, volatility, and direction all at once.

### ⑤ Risk, the sweet spot, and how to use it

- **Max loss ≈ the net paid (debit)**: a calendar spread is defined-risk — the worst case is the underlying lunging very far, leaving both near and far legs with only intrinsic value, their time value squeezed out together, shrinking the combo to near a total loss of the net paid (about $243 in the example). So the risk is limited, written on that modest debit.
- **The sweet spot is "narrow and still"**: it fears two things most — **a violent one-sided move in the underlying** (out past the two breakevens 95.7~105.6, with the ITM near leg dragging and the far leg's time value squeezed out) and **a large drop in far-dated IV** (a counter-blow to your +Vega). The ideal environment is: **the underlying grinds near the strike within the near term + IV is low and waiting to rise.**
- **How to exit**: a calendar should be decided at the "near-leg expiry" moment — usually **close the whole structure before the near leg expires** (sell the still-valuable far leg, buy back the near), pocketing the hump's profit; or **roll** the near to the next near-dated, continuing to collect the next round of time value, turning a single calendar into **rolling rent collection.**
- **Division of labor vs short straddle/iron condor**: all favor "the underlying not running," but a calendar is **+Vega** (wants volatility to rise), while an iron condor / short straddle is **−Vega** (wants volatility to fall). So **lean calendar when IV is low and expected to climb**; lean iron condor (Stage 7.3) when **IV is high and expected to fall.** This is the essence of folding "volatility level + term structure" into your decision (Stage 8.3 treats volatility as an asset).

The demo on the right uses the **Black-Scholes engine** to compute, point by point, the combo's P&L curve at the near leg's expiry (far-leg BS value − near-leg intrinsic value − cost), with an **IV slider**: drag it and you'll see the entire hump **lift as IV rises** — seeing the calendar spread's +Vega nature with your own eyes.
`,

  demo: "calendar-spread",

  analogy: `
A calendar spread is like **holding two melting blocks of ice at once: a small one (the near leg) and a big one (the far leg) — and the small block melts much faster.**

Think of an option's time value as a block of ice. You do two things:

- **Sell the small block** (the near leg) — you collected cash, and it **melts away fast** (the near leg's big Theta). When it's fully melted (the near leg expires), its "disappearing" is pure gain for **you, who collected the cash.**
- **Buy the big block** (the far leg) — it melts **slowly** (the far leg's small Theta), and when the small block is gone, the big block **still has a large chunk left**, still worth a lot.

So over this month, you earn **the gap between "the small block fully melting" and "the big block melting only a little."** The ideal weather is **mild and calm** (the underlying grinding near the strike) — both blocks melt at their natural rates and the gap is biggest.

What you fear most is **a big gust blowing the ice away** (the underlying spiking or crashing): both blocks get flung off and shatter, melting chaotically, and the gap you carefully sized vanishes.

And **the temperature (implied volatility) matters too**: the colder it gets (the higher the IV), the slower the ice melts and the more it's worth — especially your **big block (the far leg), which is more sensitive to temperature.** So a calendar spread also quietly makes one more bet: **hoping the weather turns colder (IV rises)** to make your big block worth more.
`,

  misconceptions: [
    "**\"A calendar spread's P&L diagram is a kinked line like every other strategy's.\"** — No. It's a **curved hump.** Because the evaluation moment is **the near leg's expiry**, and on that day **the far leg hasn't expired and still has time value**, which must be priced with Black-Scholes by remaining time — the BS price is a smooth curve in the underlying, so the combo P&L is curved.",
    "**\"A calendar spread is −Vega, so a rise in IV hurts it.\"** — Backwards. The far leg's Vega is larger than the near's, and you buy the far and sell the near, so it's **net +Vega**: a rise in IV raises the combo's value (drag the IV slider in the demo and the hump lifts). It's best built when IV is low and expected to climb.",
    "**\"A calendar spread wants the underlying to spike or crash.\"** — Quite the opposite. It most wants the underlying to **grind near the strike** within the near term, so the near leg goes to zero fast while the far leg holds its value. The underlying breaking past the two breakevens (a violent one-sided move) is its biggest enemy.",
    "**\"A diagonal spread is just a calendar spread, no difference.\"** — A diagonal **additionally offsets the strikes**, so it has one more layer than a calendar — a **directional view** (like overlaying a vertical spread). It can shift the hump toward the direction you favor and is the basis of the \"poor man's covered call\"; the cost is a more complex P&L and Greeks.",
    "**\"A calendar spread must be held to the far leg's expiry.\"** — Usually not. The decision moment is **around the near leg's expiry**: either close the whole structure to pocket the hump's profit, or **roll** the near to the next near-dated to keep collecting rent. Waiting to the far leg's expiry throws away its most valuable time-value phase.",
  ],

  quiz: [
    {
      q: "Where does a calendar spread's profit mainly come from?",
      options: [
        "Directional gains from a large one-sided rise in the underlying",
        "The near-dated option's time value decaying faster than the far-dated's, earning this Theta speed gap",
        "Changes in the risk-free rate (Rho)",
        "Both legs going to zero",
      ],
      answer: 1,
      explain: "A calendar spread = sell near + buy far. The near leg has big Theta and decays fast, the far leg has small Theta and decays slowly, so **net Theta is positive**. As long as the underlying doesn't run, you earn the **speed gap** of \"the near leg's entire time value − the far leg's smaller loss over this span.\"",
    },
    {
      q: "Why is a calendar spread's P&L at \"the near leg's expiry\" a **curve** rather than a kinked line?",
      options: [
        "Because it has three legs",
        "Because the contract multiplier isn't 100",
        "Because on the near leg's expiry day, the far leg hasn't expired and still has time value, which must be priced with Black-Scholes by remaining time, and the BS price is a smooth curve",
        "Because it's a credit strategy",
      ],
      answer: 2,
      explain: "The evaluation moment is the near leg's expiry. The near leg has only intrinsic value left (a kinked line), but **the far leg still has time value**, repriced with BS by remaining time + the current IV — and the BS price is a smooth curve in the underlying S, so the whole P&L bends into a hump.",
    },
    {
      q: "Regarding a calendar spread's Vega, which is correct?",
      options: [
        "Net −Vega; a rise in implied volatility hurts it",
        "Net +Vega; a rise in implied volatility raises the combo's value (the far leg's Vega exceeds the near's)",
        "Vega is always zero",
        "Only the near leg has Vega; the far leg has none",
      ],
      answer: 1,
      explain: "The far-dated option's Vega is larger than the near's. You **buy the far and sell the near**, so it's net **+Vega**: when IV rises, the far leg appreciates more than the near loses, lifting the whole hump. So a calendar spread suits building when IV is low and expected to climb — it's simultaneously a long-volatility position.",
    },
    {
      q: "Offset the two legs' **strikes too** (e.g. sell the near-dated 105 call, buy the far-dated 100 call) — what's the resulting structure called, and what extra view does it add?",
      options: [
        "Still a calendar spread, no change",
        "An iron condor, adding a range view",
        "A diagonal spread, layering a directional view on top of time and volatility",
        "A straddle, adding a big-move view",
      ],
      answer: 2,
      explain: "Offsetting the strikes makes it a **diagonal spread** — a \"calendar + vertical\" hybrid. Beyond the calendar's native time (Theta speed gap) and volatility (+Vega), the strike offset introduces a **directional tilt** (like a vertical spread). It's also the basis of the \"poor man's covered call.\"",
    },
  ],

  further: [
    { label: "Investopedia: Calendar Spread", url: "https://www.investopedia.com/terms/c/calendarspread.asp" },
    { label: "Investopedia: Diagonal Spread", url: "https://www.investopedia.com/terms/d/diagonalspread.asp" },
    { label: "Investopedia: Poor Man's Covered Call", url: "https://www.investopedia.com/articles/active-trading/061215/using-leaps-covered-call-write.asp" },
  ],
};
