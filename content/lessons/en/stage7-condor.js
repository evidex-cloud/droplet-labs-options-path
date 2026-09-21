export default {
  id: "iron-condor",
  stage: 7,
  order: 3,
  title: "Iron Condors: Renting a Range",
  difficulty: 3,
  prereqs: ["vertical-spreads"],

  oneLiner:
    "An iron condor = **sell an OTM put spread + sell an OTM call spread**. You collect a net premium up front, betting the underlying \"**stays in a range and doesn't run.**\" As long as the expiry price lands between the two sold strikes, you keep the full premium; max loss = spread width − net collected, nailed shut by the bought protection legs on each side. It's the most classic **time-value-collecting (+Theta) range-rental** structure.",

  intuition: `
The **credit spread** among the vertical spreads (Stage 6.5) taught us one thing: sell an OTM spread, bet "**the bad move doesn't happen**," and you collect a premium up front, earning on time decay, with the risk nailed shut by the bought protection leg. But a credit spread only guards one direction — a sold put spread only wins when "it doesn't break down," and if the underlying rallies hard it doesn't care, but you collected nothing on the upside.

What if your view is "**this name won't run either way — it'll grind in a range**"? Then **collect on both sides** — that's an iron condor. It splices **an OTM put spread + an OTM call spread** together, like two fences penning the price in the middle.

Take an underlying at **100** and build an iron condor:

- **Sell a put spread** (bet it won't break down): sell the **K=90** put collecting 3, buy the **K=85** put paying 1.5;
- **Sell a call spread** (bet it won't rally past): sell the **K=110** call collecting 3, buy the **K=115** call paying 1.5;
- Net collected (credit) = (3−1.5) + (3−1.5) = **$3/share**, one combo **collects $300** up front.

At expiry, three cases:

- Lands **between 90 and 110** (inside the range): all four legs expire worthless, and you keep the full **$300** premium — **max profit.**
- Breaks below **85** or rallies past **115** (out past either fence): the loss is nailed shut by the protection legs at **spread width − net collected = 5 − 3 = $2/share = −$200** — **max loss.**
- Between 85 and 90 or 110 and 115: P&L transitions linearly between +300 and −200.

See the trick? **As long as the underlying stays neatly in the 90–110 range, you steadily collect the $300 \"rent.\"** Its shape is like a **trapezoidal tabletop**: a flat profit roof in the middle, with a ramp down on each side to the capped loss floor. The two breakevens = **87 and 113.**

The iron condor is the seller's signature: **a high win rate (with a wide enough range, it often wins) but poor odds (the 300 you make < the 200 you might lose… actually here you make more than you lose, depending on strike width).** Its soul is **collecting time value, betting on volatility compression** — fundamentally the same money as a short straddle (Stage 7.1) off the variance risk premium, but with **defined risk**, far gentler.

**In this lesson we break the iron condor into five pieces:**

- **① Structure: two OTM credit spreads fencing off a range**
- **② A quick reference for max profit/loss and the two breakevens**
- **③ Why it's rent collection: +Theta, −Vega, betting on volatility compression**
- **④ How to build it: strike width, how much to collect, the win-rate/odds tradeoff**
- **⑤ How to manage it: when to take profit, when to adjust a breached side**
`,

  mechanics: `
### ① Structure: two OTM credit spreads

**An iron condor = sell 1 OTM put spread (a bull put spread) + sell 1 OTM call spread (a bear call spread)**, same expiry. Four legs, four strikes, from low to high:

- Buy K₁ (lowest, the put protection wing) — sell K₂ (the put, the lower fence) — sell K₃ (the call, the upper fence) — buy K₄ (highest, the call protection wing).

The **two sold middle legs (the K₂ put, the K₃ call)** are the income source, marking out the range "**the price should stay in**," K₂~K₃; the **two bought legs (K₁, K₄)** are protection wings that nail shut each spread's risk. The whole thing is a **net credit** (you collect up front), because the two sold legs are closer to the money and worth more than the two bought.

> Versus an iron butterfly (a variant from Stage 7.2): the iron butterfly pulls the two sold strikes **together to a single point** (both ATM), narrowing the profit zone to a sharp peak; the iron condor pulls the two sold strikes **apart** into a range, with a flat tabletop roof. The iron condor trades a lower peak profit for a **wider win zone.**

### ② Max profit / loss / breakeven

An iron condor is usually built **symmetrically**: the two spreads equal in width (let it be w), roughly centered on spot. Using the example (sell put 90 / buy 85, sell call 110 / buy 115, w=5, net collected C=3), the key numbers are pinned down:

- **Max profit = net collected C = $3/share = +$300**, occurring when the expiry price lands **between K₂~K₃ (90~110)** — all four legs expire worthless, full premium kept. This is a **plateau**, not a single point (friendlier than a butterfly here).
- **Max loss = spread width − net collected = w − C = 5 − 3 = $2/share = −$200**, occurring when the expiry price ≤ K₁(85) or ≥ K₄(115). Nailed shut by the protection wings, **defined risk.**
- **The two breakevens**: lower BE = K₂ − C = 90 − 3 = **87**; upper BE = K₃ + C = 110 + 3 = **113**. As long as the expiry price lands between **87 and 113**, this iron condor doesn't lose.

The mantra: **an iron condor's max profit = net collected; max loss = spread width − net collected; the two breakevens = each sold strike ± the net collected.** Note one often-overlooked fact: because an iron condor **collected on both sides**, its breakevens are wider than any single credit spread's — the benefit of "collecting rent on both edges."

(Reminder: if the two spreads are unequal in width, then "max loss = the wider side's width − net collected," since it can only be breached in one direction. This lesson's example uses symmetric equal widths to build intuition.)

### ③ Why it's rent collection: +Theta, −Vega

The iron condor is the textbook **time-value-collecting** structure. Through the Greeks, its inception profile (with the underlying mid-range):

- **+Theta (positive Theta)**: netted across four legs, it's **a friend of time.** As long as the underlying doesn't run, **each passing day, the time value within the range drips into your pocket** — the main engine of an iron condor's profit.
- **−Vega (negative Vega)**: you're net short volatility. **A drop in implied volatility helps you** (the sold legs lose value), a rise hurts. So an iron condor is best built when **IV is high and expected to fall** — high IV lets you collect a fatter premium, and the fall earns you Vega on the way down.
- **Delta ≈ 0 (when built symmetrically)**: the directional exposures of the upper and lower spreads roughly cancel, so at inception it's nearly **direction-neutral** — you're betting on "**the range**," not on up or down.
- **−Gamma (negative Gamma)**: the price is fearing a big move. Once the underlying rushes toward a strike, Delta accelerates the wrong way — the inherent risk of a −Theta rent collector.

In a sentence: **an iron condor = collecting, with defined risk, the time value and variance risk premium (Stage 8.3) of "the underlying staying in a range."** It earns the same money as a short straddle (Stage 7.1) (IV > realized volatility), but because of the two protection wings, it collapses unlimited risk into a clear, manageable trapezoid — exactly why it's become the most popular income strategy.

### ④ How to build it: width and win-rate/odds

Building an iron condor is a constant tradeoff between **win rate** and **odds**, with a few key dials:

- **How far the sold strikes sit from spot (how wide the range)**:
  - Sell **farther OTM** (a wider range) → a higher win rate (harder for the price to break out), but a smaller premium collected and a smaller max profit. **Delta is a common yardstick**: e.g. selling the two legs at 16-Delta corresponds roughly to ±1 standard deviation, theoretically about a 68% chance of landing inside the range (Stage 5.2 explains Delta ≈ the ITM probability).
  - Sell **closer to ATM** (a narrower range) → a fat premium and a big max profit, but the win rate drops and it's more easily breached.
- **How wide the protection wings (spread width w)**:
  - **Wider** wings → more net premium collected (a bigger max profit), but the **max loss = w − C** is bigger too.
  - **Narrower** wings → small risk, but you collect little. A narrow-wing iron condor often "**makes little, loses little.**"
- **One unified constraint**: like all defined-risk structures, **max profit + max loss (absolute value) = spread width ×100** (per side). You're just choosing, within this fixed-size cake, the "high-win-rate-small-profit vs low-win-rate-big-profit" slice.

A rule of thumb: many rent collectors build an iron condor at the **collect-about-1/3-of-the-wing-width** premium (e.g. 1.5~2 on a 5-wide), at **around 45 days to expiry** (Theta decay starts accelerating, yet not so short that Gamma tortures you), as a win-rate/odds compromise starting point.

### ⑤ How to manage it: taking profit and adjusting

The iron condor is one of the few strategies where "**management > entry**" — opening is just the start, and how you manage decides long-run P&L.

- **Take profit early**: don't wait to squeeze the last cent of premium at expiry. A common discipline is to **close once you've made 50%~75% of the net collected** (e.g. collect 300, leave after making 150~225). The final scrap of profit corresponds to the longest-time, highest-Gamma-risk tail — **trading higher turnover for lower tail risk** is steadier over the long run.
- **Adjusting a breached side**: when the price approaches a sold strike and that spread starts losing:
  - **Roll the unthreatened side**: move the other (still-safe) spread closer toward the price, collecting extra premium to subsidize the threatened side's loss — effectively shifting the whole range to chase the price.
  - **Roll the whole thing to the next expiry**: if you still like the range but are short on time, shift the entire iron condor to a more distant month and collect more time value.
  - **Cut and close**: if the move clearly breaks out of the range and a trend sets in, stop out at your predetermined max loss (e.g. 1.5~2× the premium collected) and leave — don't let a "high win rate" mindset drag one big loss into a disaster.
- **Pin risk**: if at expiry the underlying lands right near a sold strike, whether you're assigned becomes hard to predict (Stage 2.4 covers assignment). Proactively closing the leg that's near the money as expiry nears avoids the uncertainty of expiry night.

> The seller's core mindset: an iron condor **wins often, wins little each time**, so you **must never let any single loss get out of control** — one unchecked big loss can swallow a dozen small wins. A high win rate doesn't mean a high expectation; sizing and stop discipline (Stage 8.1) are the watershed for whether it makes money long term.

The demo on the right lets you drag the **sold-strike range width** and the **protection-wing width** to watch live how the trapezoidal tabletop rises and falls, how much rent you collect, and how the max loss and the two breakevens shift (consistent with the netPL engine).
`,

  demo: "iron-condor",

  analogy: `
An iron condor is like **being a landlord, renting your house to a tenant who's fine "as long as they're not too loud," and collecting a deposit up front.**

Picture a price range (90~110) as your house. You **collect a deposit up front** (the net premium 300) and rent it to the market — on the condition that "**the price doesn't break out of this range before expiry.**"

- As long as the tenant (the price) **stays inside the house** (90~110), at expiry you **keep the entire deposit** (max profit 300).
- You also bought **homeowner's insurance** (the protection wings on each side): if the tenant goes wild and slams the price below 85 or above 115, your loss is **nailed shut at 200** by the insurance (spread width − deposit), so you're not wiped out.

And **time is this landlord's friend**: each calm day, a small piece of the deposit formally lands in your pocket (+Theta). What the landlord fears most is the tenant suddenly throwing a violent commotion (−Gamma, a big move), breaking out of the range and hitting the insurance deductible.

So a good landlord's skill is all in **management**: at the first bad sign, take part of the deposit early (50%~75% profit-taking), or shift the rental range to chase the tenant, and if all else fails, stop out and end the lease as agreed. **The rent comes in often but small each time — never let one breakout swallow the deposit you've spent a long time accumulating.**
`,

  misconceptions: [
    "**\"An iron condor only makes the most if the expiry price lands exactly at the midpoint.\"** — No. The max profit is a **plateau**: as long as the price lands between the two sold strikes (90~110 in the example), you collect the full premium. This is far friendlier than a butterfly (which takes the full prize only at the dead-center point).",
    "**\"An iron condor is an advanced strategy, so it has unlimited risk.\"** — Backwards. The two bought protection wings **write the risk down**: max loss = spread width − net collected (5−3=2/share=200 in the example). It's a **defined-risk** short straddle, and that's exactly why it suits most people.",
    "**\"An iron condor has a high win rate, so it's guaranteed to profit long term.\"** — A high win rate usually comes with **poor odds and occasional big losses.** One unchecked breach (lose 200) can wipe out several small wins (each making 300 still carries tail risk). What decides P&L is **stop discipline and sizing**, not win rate alone (Stage 8.1).",
    "**\"The higher the IV, the more dangerous it is to build an iron condor.\"** — Quite the opposite — **high IV is a good time to build one**: you collect a fatter premium, push the breakevens wider, and since an iron condor is −Vega, you earn Vega as IV falls back. The truly dangerous time is building at very low IV — collecting too little, too-thin protection.",
    "**\"When the price approaches one side, all you can do is wait or take the loss.\"** — You can also **manage actively**: roll the safe side closer to collect extra premium, roll the whole structure to the next expiry, or stop out at a preset level. An iron condor is a \"management > entry\" strategy, and the adjustment toolkit decides long-run success.",
  ],

  quiz: [
    {
      q: "Iron condor: sell 90 put collecting 3, buy 85 put paying 1.5; sell 110 call collecting 3, buy 115 call paying 1.5. What is the **net collected (credit)**?",
      options: ["$150", "$300", "$500", "Pay $200 (debit)"],
      answer: 1,
      explain: "Net collected = (3−1.5) + (3−1.5) = 1.5 + 1.5 = **$3/share**, ×100 = **collect $300**. Each OTM credit spread contributes 1.5, and the iron condor pockets this premium the moment you open it.",
    },
    {
      q: "For that same iron condor (sell 90/110, wing width 5, net collected 3), in what situation does the **max profit** occur and how much is it?",
      options: [
        "Expiry price exactly 100, make 500",
        "Expiry price lands between 90 and 110, make 300",
        "Expiry price ≥115, make 300",
        "Expiry price exactly 100, make 300 (a loss at every other price)",
      ],
      answer: 1,
      explain: "Max profit = net collected = **$300**, as long as the expiry price lands **between the two sold strikes (90~110)**, all four legs expire worthless and the premium is fully kept. This is a plateau, not a single point.",
    },
    {
      q: "What are this iron condor's **max loss** and **two breakevens**?",
      options: [
        "Max loss $300; breakevens 90 and 110",
        "Max loss $200; breakevens 87 and 113",
        "Max loss unlimited; breakeven 100",
        "Max loss $500; breakevens 85 and 115",
      ],
      answer: 1,
      explain: "Max loss = spread width − net collected = 5 − 3 = 2/share = **$200** (expiry price ≤85 or ≥115, nailed shut by the protection wings); breakevens = sold strike ± net collected = 90−3=**87**, 110+3=**113**.",
    },
    {
      q: "Regarding building and managing an iron condor, which is **most robust**?",
      options: [
        "Build at very low IV and wait to expiry to squeeze the last cent of premium",
        "Place the sold strikes right at the money for the fattest premium, and never stop out",
        "Build when IV is high, sell farther-OTM strikes for a higher win rate, take profit at about 50%~75% of net collected, and preset adjustment/stop rules for a breached side",
        "Sell only one side (the put spread) and ignore the other entirely",
      ],
      answer: 2,
      explain: "The robust approach: **build at high IV** (collect fat, −Vega tailwind), sell **farther-OTM** strikes to raise the win rate, **take profit at 50%~75%** to cut tail risk, and **roll or stop out at a preset level** on a breached side. Waiting to expiry, ATM strikes with no stop, and building at very low IV all magnify that one fatal big loss.",
    },
  ],

  further: [
    { label: "Investopedia: Iron Condor (a full walkthrough)", url: "https://www.investopedia.com/terms/i/ironcondor.asp" },
    { label: "Investopedia: Adjusting an Iron Condor", url: "https://www.investopedia.com/articles/optioninvestor/08/iron-condor.asp" },
    { label: "Options Industry Council (OIC): Iron Condor", url: "https://www.optionseducation.org/strategies" },
  ],
};
