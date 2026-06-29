export default {
  id: "ratio-backspread",
  stage: 7,
  order: 5,
  title: "Ratio Spreads & Backspreads",
  difficulty: 3,
  prereqs: ["vertical-spreads"],

  oneLiner:
    "Make a vertical spread's two legs **unequal in count** and you get this mirror pair. A **ratio spread** (e.g. buy 1, sell 2) sells an extra leg — cheap or even a credit, but that **naked sold leg brings unlimited risk**; a **backspread** (e.g. sell 1, buy 2) buys an extra leg — planting **convexity** for a big move, with limited loss and an open-ended payoff in the extreme direction. One collects rent betting on \"a small move,\" the other swings for the fences betting on \"a huge move.\"",

  intuition: `
A vertical spread (Stage 6.5) is a balanced "**buy one, sell one**" structure, with both risk and reward boxed in. What if we deliberately break that balance — **sell one extra, or buy one extra**? That one change utterly transforms the structure's character, splitting it into a mirror pair of opposite directions: the **ratio spread** and the **backspread**.

Their only difference is "**whether the extra leg is sold or bought**":

**① The ratio spread — sell an extra leg.** Take a call, underlying at 100:

- **Buy** 1 strike-**100** call, paying 6;
- **Sell** 2 strike-**110** calls, collecting 2.5 each (5 total);
- Net paid = 6 − 5 = **$1/share** (nearly free, sometimes even a net credit).

It stuffs one extra sold leg into a plain bull call spread (buy 1, sell 1). The upside is it's **extremely cheap**; but that **extra second sold call is "naked"** (no matching bought leg protecting it) — once the underlying spikes too far past 110, this naked leg brings **unlimited loss.** Its sweet spot is "**a mild rise to near 110**": at 110 exactly, the combo captures its max profit (about +$900).

**② The backspread — buy an extra leg.** Flip the above:

- **Sell** 1 strike-**100** call, collecting 6;
- **Buy** 2 strike-**110** calls, paying 2.5 each (5 total);
- Net collected = 6 − 5 = **$1/share** (a net credit).

Its extra leg is **a second bought leg**, planting **convexity** for a **violent rise in the underlying**: the harder it rallies, the faster those two long calls make money, with the **upside open and uncapped.** The price is a "**valley of death**" in the middle — near 110, the one you sold is in the money and the two you bought haven't kicked in yet, so the loss is deepest (about −$900), but **limited.** It bets on "**either no move (keep that small credit) or a huge move (convexity explodes)**," fearing most a mild rise to 110.

See the essence of this mirror pair? **The ratio spread sells an extra leg → cheap/rent + naked unlimited risk, betting on a small move; the backspread buys an extra leg → pays for convexity + limited loss with unlimited gain, betting on a huge move.** Whether the extra leg is sold or bought decides which side of the risk you stand on.

**In this lesson we break this mirror pair into five pieces:**

- **① The ratio spread: sell an extra leg, cheap but naked**
- **② That naked leg's "danger zone": where the unlimited risk comes from**
- **③ The backspread: buy an extra leg, paying for convexity**
- **④ The backspread's "valley of death" and unlimited payoff**
- **⑤ When to use each, and how to control the risk**
`,

  mechanics: `
### ① The ratio spread: sell an extra leg

**A (call) ratio spread = buy 1 lower-strike call + sell 2 higher-strike calls** (a 1:2 ratio is most common, but 1:3 etc. exist too), same expiry. It's a bull call spread (buy 1, sell 1) with **one extra OTM call sold** on top.

Using the example (buy 1 K=100 paying 6, sell 2 K=110 collecting 2.5 each), the P&L (per share):

- Net cash flow = −6 + 2×2.5 = **−$1/share** (a small debit; with richer sold-leg premiums it can flip to a net credit).
- **The sweet spot is at the sold strike K=110**: at an expiry price of 110, the bought 100 call is worth 10, the two sold 110 calls expire worthless, and the combo = 10 − 1 net cost = **+$9/share = max profit +$900.**
- Expiry price ≤100: all legs expire worthless, and you lose only the net paid, **$1/share = −$100** (if built for a net credit, this is instead a small gain).
- **Upper breakeven = 110 + max profit/share = 110 + 9 = 119**: past 119, the naked sold leg starts netting you a loss.

Its payoff looks like a **right-leaning peaked tent, but with the right fence collapsed**: flat on the left, surging to a peak at 110, turning back down past 110, flipping to a loss past 119, then **sliding down with no floor.**

### ② That naked leg's danger zone

The most crucial — and most lethal — point of a ratio spread: **the extra sold call is "naked."**

Count the contracts: you bought 1 call and sold 2. At very high prices (S→∞), the 1 bought and 1 of the 2 sold hedge each other, leaving **1 net naked short call.** A naked short call means (Stage 1.1): the higher the underlying rises, the bigger your loss from delivering at the low strike — **theoretically unlimited.**

- In the example, past the upper breakeven **119**, each $1 rise loses you about $1/share more. A rise to 130 loses (130−119)=11/share = **−$1,100**; a rise to 150 loses **−$3,100**… with no ceiling.
- This also means the naked leg ties up **margin** and faces **assignment** risk — it's not a "buy and forget" structure.

So a ratio spread's accurate portrait is: **a low-cost structure betting on "a mild rise to near 110," but you must pay the price of unlimited risk for the small-probability, big-damage event of "overshooting."** It suits a view of "bullish but capped at some price, and convinced it won't spike," and you **must set an upside stop or hedge** on that naked leg. (A put ratio spread is symmetric: buy 1 higher-strike put + sell 2 lower-strike puts, with the naked risk on the **downside** — unlimited loss in a crash, often used to bet on "a mild decline.")

### ③ The backspread: buy an extra leg, buy convexity

**A (call) backspread = sell 1 lower-strike call + buy 2 higher-strike calls**, same expiry. It's the **mirror** of a ratio spread: flip the contract ratio, so **the extra leg is bought.**

Using the example (sell 1 K=100 collecting 6, buy 2 K=110 paying 2.5 each), the P&L:

- Net cash flow = +6 − 2×2.5 = **+$1/share** (a small credit; often built for a net credit or zero cost).
- Expiry price ≤100: all legs expire worthless, and you **keep the net collected, $1/share = +$100** (your consolation prize for "not hitting the huge move").
- **The valley-of-death bottom is at K=110**: at an expiry price of 110, the 100 call you sold is in the money for a loss of 10, the two 110 calls you bought just expired worthless, and the combo = −10 + 1 = **−$9/share = max loss −$900** (limited!).
- Past 110, **the two long calls kick in**, the slope turns positive and steep (1 net long), and the payoff **accelerates, uncapped.**
- **Upper breakeven = 110 + max loss/share = 110 + 9 = 119**: only past 119 does it flip from loss to profit, then makes more the higher it goes.

### ④ The valley of death and unlimited payoff

The backspread's soul is **convexity** — it's built for "**a violent big move.**"

- **Down/no move**: the underlying falls or stays flat, all legs expire worthless, and you keep that small credit (+100). **You can't lose** — this is where it's smarter than a plain long call (the leg you sold subsidizes the cost of buying two, turning "a small move loses the premium" into "a small move even makes a little").
- **A mild rise to near 110 (the valley of death)**: this is the region it **fears most.** The leg you sold is already in the money and losing, the two you bought haven't truly kicked in — the loss bottoms at 110 (−900, but limited and written down).
- **A huge move (a spike)**: the convexity of being 1 net long call fully releases, the **payoff is uncapped**, and you make more the faster it rises.

So a backspread bets on a **polarized** script: "**either calm seas (keep the small change) or upheaval (convexity prints),**" disliking only the **mild, middling move that stops right near the sold strike.** It's kindred in spirit to a long straddle (Stage 7.1) — both are **+Gamma, betting on a big move** — but a backspread has a directional bias (here, bullish) and, by selling one leg, remakes "a small move loses money" into "a small move doesn't lose, even makes a little." A put backspread is symmetric (sell 1 higher-strike put + buy 2 lower-strike puts), betting on a **violent crash**, often used as **tail hedging** (a cousin of the deep-OTM-put idea mentioned in Stage 8.3).

> Greeks contrast: **a ratio spread is −Gamma, +Theta, −Vega** (like a rent collector — fearing a big move, wanting calm and falling IV); **a backspread is +Gamma, −Theta, +Vega** (like a buyer — wanting a big move and rising IV, paying daily time value). A perfect mirror pair.

### ⑤ When to use each, and how to control the risk

- **Use a ratio spread when**: you're mildly bullish (or bearish), **convinced it won't overshoot**, and want to bet on a target price (the sold strike is your "this far is enough") at very low cost or even for a credit.
  - **Risk control**: that naked leg is the Achilles' heel. Be sure to **set an upside (or downside) stop/hedge** — e.g. buy back one when the underlying nears the sold strike, or preemptively add a farther leg to complete it into a butterfly/iron condor, collapsing unlimited risk into limited. **Never leave the naked leg unattended.** It ties up margin and carries assignment risk, so keep the size small.
- **Use a backspread when**: you expect **an imminent violent one-sided move** (earnings, a breakout, an event), but don't want to pay double premiums like a straddle nor sit through −Theta drag — a backspread can be built for a **net credit or zero cost**, so even "missing the move" doesn't lose, or makes a little.
  - **Risk control**: the risk is already limited (max loss = the depth of that valley of death); the main enemies are **time and the valley** — if the underlying stalls, or stops right near the sold strike and grinds to expiry, it slowly bleeds to the valley floor. So a backspread is **a matter of timing** (set it up before an expected big-move event); don't leave it hanging long.
- **Their division of labor with neighbors**:
  - Both are **deformations** of a vertical spread, just changing 1:1 to unequal counts.
  - **A ratio spread ≈ "an aggressive seller/rent collector"** (akin to the iron condor/butterfly family that bets on stillness, but trades a naked leg for a higher sweet-spot payoff, at the price of unlimited risk).
  - **A backspread ≈ "a smart buyer/big-move swinger"** (akin to a straddle, but subsidizes the cost by selling one leg and carries a directional bias).

The demo on the right uses a segmented toggle to switch between **ratio spread (buy 1, sell 2) / backspread (sell 1, buy 2)**, drawing the P&L with the leg counts: you'll clearly see one side with a **naked, unlimited-risk tail** and the other with an **open-ended convex-payoff tail** — a mirror pair like a demon-revealing mirror (consistent with the netPL engine).
`,

  demo: "ratio-spread",

  analogy: `
The ratio spread and the backspread are **two opposite roles in the same insurance contract.**

Imagine an arrangement "**betting a neighborhood's prices rise mildly.**"

- **The ratio spread = you both bought a right that "pays if the price rises to $1,100,000" and, on the side, sold two policies of "insurance against the price exceeding $1,100,000" to others.** The money from selling insurance subsidizes or even cancels your cost of buying the right — **nearly free, sometimes even a net credit.** As long as the price **rises mildly to near $1,100,000**, you make the most. But one of the policies you sold is **naked**: if the price **skyrockets to $2,000,000**, you owe **unlimited payouts** on that naked policy — the small change you collected is nowhere near enough to fill the hole. You're betting "**up, but no spike.**"

- **The backspread = you flip to being the one "buying insurance against upheaval."** You sell one ordinary right for some cash, then use that cash to **buy two policies of "insurance against a price explosion."** Most days the price doesn't move and you **keep the small change from the sold right**; when the price **rises mildly to $1,100,000** you're most miserable (the one you sold is losing, the insurance you bought hasn't paid out — your "valley of death," but the loss is capped); yet once the price **erupts skyward**, your two policies pay out **without ceiling**, and you make a fortune. You're betting "**either nothing happens, or the sky falls.**"

In a sentence: **the ratio spread "sold one extra naked policy" to collect rent on a small move; the backspread "bought one extra policy" to swing for a huge move.** Whether that extra one is sold to others or bought for yourself decides whether you're the house collecting rent, or the gambler betting on the sky falling.
`,

  misconceptions: [
    "**\"A ratio spread is like a plain bull call spread, with limited risk.\"** — Not so. A ratio spread **sells one extra leg**, leaving 1 net **naked short call** at high prices — once the underlying spikes past the upper breakeven (119 in the example), the loss is **theoretically unlimited**, and it ties up margin with assignment risk. It's not a \"buy and forget\" structure.",
    "**\"A backspread fears most the underlying not moving.\"** — Not quite. When it doesn't move, a backspread **keeps its net credit (a small gain)**; its true worst point is **a mild rise to near the sold strike — the \"valley of death\"** (110 in the example, a loss of 900 but limited). It either does nothing, or prints via a huge move's convexity, disliking most the \"neither up nor down\" middling move.",
    "**\"A backspread bets on a big move like a straddle, so it's the same thing.\"** — Both are +Gamma betting on a big move, but a backspread **has a directional bias** (a call backspread leans bullish) and, by **selling one leg to subsidize the cost**, can be built for a net credit/zero cost so that \"missing the move\" doesn't lose or even makes a little; a straddle buys both legs, pays double premiums, has heavier −Theta, and is direction-neutral.",
    "**\"A ratio spread built for a net credit is a sure thing.\"** — That little premium collected is only a \"consolation on a small move.\" Its Achilles' heel is **the naked leg's unlimited risk**: if the underlying truly spikes, the small change collected is a drop in the bucket. A net credit only changes the \"down/no-move\" outcome; it can't stop the \"overshoot\" disaster — you must hedge or stop the naked leg.",
    "**\"These two strategies have nothing to do with vertical spreads.\"** — They're precisely **deformations** of a vertical spread: change the balanced 1:1 counts to **unequal counts.** Sell extra → a ratio spread (naked, rent-collecting, betting on a small move); buy extra → a backspread (convex, limited-risk, betting on a huge move). Once you understand vertical spreads, this mirror pair follows naturally.",
  ],

  quiz: [
    {
      q: "Call ratio spread: buy 1 K=100 call paying 6, sell 2 K=110 calls collecting 2.5 each. What characterizes its **maximum risk**?",
      options: [
        "Limited risk, max loss = net paid",
        "Theoretically unlimited loss on the upside — 1 net naked short call at high prices",
        "Unlimited loss on the downside",
        "No risk at all, because it's nearly free",
      ],
      answer: 1,
      explain: "Buy 1, sell 2, leaving **1 net naked short call** at high prices. Once the underlying spikes past the upper breakeven (110+9=119), each $1 rise loses about $1/share more, **theoretically unlimited.** This is exactly where a ratio spread is most dangerous and must be hedged/stopped.",
    },
    {
      q: "For that same call ratio spread (buy 1@100, sell 2@110, net paid 1), at what price is the **max profit** and roughly how much?",
      options: [
        "At S=100, make 100",
        "At S=110, make 900",
        "At S→∞, unlimited",
        "At S=119, make 900",
      ],
      answer: 1,
      explain: "The sweet spot is at the sold strike **S=110**: the bought 100 call is worth 10, the two sold 110 calls just expire worthless, and the combo = 10 − 1 net cost = **+$9/share = $900.** Past 110, the naked leg drags it down, flipping to a net loss above 119.",
    },
    {
      q: "Call backspread: sell 1 K=100 call collecting 6, buy 2 K=110 calls paying 2.5 each (net collected 1). What is its payoff in a **spike** and its **most painful point**?",
      options: [
        "Limited payoff; most painful at S≤100",
        "Unlimited payoff (convexity); most painful at the \"valley of death\" near S=110 (the loss is limited)",
        "Unlimited payoff; most painful at S→∞",
        "Limited payoff; no loss at all",
      ],
      answer: 1,
      explain: "Being 1 net long call, a spike releases the convexity and the **payoff is uncapped.** The most painful point is the **valley-of-death bottom at S=110**: the sold leg is in the money and losing, the two bought just expired worthless, a loss of (110−100)−1=9/share=−$900, but **limited and written down.** At ≤100 it keeps the net credit for a small gain.",
    },
    {
      q: "You expect a stock to make a **violent one-sided spike** after earnings, but don't want to pay double premiums like a straddle and want \"no loss even if you miss.\" You also refuse to bear any unlimited risk. Which fits best?",
      options: [
        "A call ratio spread (buy 1, sell 2)",
        "A call backspread (sell 1, buy 2)",
        "A short straddle",
        "A long butterfly",
      ],
      answer: 1,
      explain: "Betting on a violent spike + no double premium + no loss if you miss + limited risk → **a call backspread**: a net credit/zero cost, keeping the small change on the downside, printing without limit on a spike via convexity, with the max loss written down at the valley's depth. A ratio spread has unlimited risk; a short straddle bets on stillness with unlimited risk; a butterfly bets on stillness.",
    },
  ],

  further: [
    { label: "Investopedia: Ratio Spread", url: "https://www.investopedia.com/terms/r/ratiospread.asp" },
    { label: "Investopedia: Backspread", url: "https://www.investopedia.com/terms/b/backspread.asp" },
    { label: "Options Industry Council (OIC): Ratio Spreads & Backspreads", url: "https://www.optionseducation.org/strategies" },
  ],
};
