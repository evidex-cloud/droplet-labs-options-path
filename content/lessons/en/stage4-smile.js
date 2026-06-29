export default {
  id: "vol-smile-skew",
  stage: 4,
  order: 3,
  title: "The Volatility Smile & Skew",
  difficulty: 3,
  prereqs: ["hist-implied-vol"],

  oneLiner:
    "If Black-Scholes were exactly right, the **implied volatilities** across strikes at the same expiry should form a flat horizontal line. In reality it bends into a curve: FX markets turn up at both ends into a **smile**, while equity markets slope down left-to-right into a **skew** — low-strike puts carry higher IV, the market putting an explicit price on crash fear. This curve is direct evidence that the BS \"σ constant\" assumption is bankrupt.",

  intuition: `
Last lesson (Stage 4.2) we learned to run Black-Scholes in reverse, backing each option's **implied volatility** out of its market price. Now do something simple yet startling: take a whole row of options on **the same underlying, the same expiry date**, and plot every strike's backed-out IV on a chart — strike K on the horizontal axis, IV on the vertical.

By the assumptions of Black-Scholes, **volatility σ is a fixed property of the underlying**, with nothing to do with which strike you pick. So this chart ought to be a **horizontal straight line**: whether K=80 or K=120, the backed-out IV should be equal.

But go plot it from real market data and you **never** get a horizontal line. It bends:

- In **FX and commodity** markets, the curve turns up at both ends and dips in the middle, like a smiling face — this is the **volatility smile**: at-the-money (ATM) IV is the lowest, and the further out toward the wings (whether out-of-the-money calls or puts), the higher the IV.
- In **equity and equity-index** markets, the curve looks more like a slide sloping down from left to right — this is the **volatility skew**, more precisely a "reverse skew": **low strikes (downside puts) carry notably higher IV**, declining toward higher strikes.

This curved line is one of the most important charts in all of modern option theory. It is shouting one thing: **the market doesn't believe Black-Scholes's "volatility constant, returns normal" assumptions.** Real-world crashes are far more frequent and far more violent than a bell curve predicts (fat tails), and **the downside tail is fatter than the upside** — stocks plunge fast and hard but tend to climb slowly. So the market charges **extra** for the low-strike puts that "pay off in a crash," and backed out, that's a higher IV. That's not a pricing error — it's an **explicit price on fear.**

A concrete, intuitive example: a stock trading at 100, 1 month to expiry.

- The ATM (K=100) IV might be **20%**.
- The OTM put at K=90 might have an IV as high as **28%** — lots of people buying crash insurance push its price (IV) up.
- The OTM call at K=110, by contrast, might be only **17%** — weak demand to chase rallies, and some people even sell calls to collect premium (covered calls), pushing it down.

This "high-left, low-right" skew bears directly on every multi-leg strategy you trade: when you buy a spread you **buy the expensive leg, sell the cheap leg**, and the skew decides which leg is expensive; it's also the root of why tail hedging (Stage 8.4) is expensive, and the battlefield of dealer hedging flows (Stage 8.5).

**In this lesson we break the volatility smile/skew into five pieces:**

- **① Why flat volatility is wrong: an empirical refutation of the BS assumption**
- **② Smile vs skew: the FX smiling face, the equity slide**
- **③ Equity skew: why low-strike puts are more expensive (crash fear, callback Stage 8.4)**
- **④ Where skew comes from: fat tails, the leverage effect, supply/demand, dealer hedging (Stage 8.5)**
- **⑤ How to read and use skew: risk reversals and the cost of multi-leg strategies**
`,

  mechanics: `
### ① Why flat volatility is wrong

Black-Scholes (Stage 4.1) assumes the underlying's returns are normal and volatility σ is a single constant. In this ideal world, **all strikes at the same expiry must have equal implied volatility** — plotted, a horizontal line.

But this line **does not hold empirically**, and it's not a random deviation — it's structural, present every single day. After "Black Monday" 1987 (a single-day −22%), the market permanently remembered crash risk, and the equity-index skew has been entrenched ever since. This gives us a deep conclusion: **implied volatility is not an inherent property of the underlying, but the "market price tag" of each individual strike and expiry.** In other words, the IV smile/skew is the patch the market uses to **fix the BS defect** — since the BS formula itself is wrong (it assumes normality, no gaps), traders let the σ entering the formula vary by strike, forcing the market price back into the formula.

> The key pivot: from this lesson on, σ is no longer a single number but a **curve σ(K)** — and indeed a surface σ(K, T) (Stage 4.4). The BS formula is still used, but it degenerates into a quoting tool that "translates price into IV," not a true pricing model.

### ② Smile vs skew: two typical shapes

Same curvature, but different markets bend differently:

- **Volatility smile**: the curve turns up symmetrically at both ends, lowest at ATM and higher on both OTM sides. Common in **FX** and some **commodities** — because exchange rates "can jump violently in either direction," the market's tail fear for up and down is roughly symmetric.
- **Volatility skew / slope**: the curve slopes monotonically. **Stocks/indices** are the classic **reverse skew** — high IV at low strikes, low IV at high strikes, like a slide down from left to right. The reason is the equity tail is **asymmetric**: a plunge is fast and deep, while a spike is tepid.
- **Forward skew**: a few markets (some commodities like crude oil or agricultural products) instead have higher IV at high strikes — because their "crisis" is a **price spike** (supply disruption), with tail fear on the upside.

The standard gauge of skew steepness is the **risk reversal**: the 25-delta put's IV minus the 25-delta call's IV. On equity indices this number is **positive year-round** (puts richer) and steepens rapidly in a crisis.

### ③ Equity skew: why low-strike puts are more expensive

Focus on the most important case, the equity reverse skew. Low-strike puts have systematically higher IV, driven by **real, explainable demand and risk**:

- **Crashes really are more frequent.** The equity return distribution has **fat tails** and is **left-skewed**: a single-day −5% is far more common than +5%. BS's normal assumption severely understates the probability of the downside tail, so the market uses a higher IV to "compensate" for this underpriced risk on low-strike puts. This is exactly the pricing of tail risk from Stage 8.4 — **deep OTM puts are "crash lottery tickets," systematically expensive.**
- **Insurance demand is one-directional.** Institutions are loaded with long stock, and they continuously buy **protective puts** (Stage 6.4) to hedge the downside, while almost no one needs to buy OTM calls to hedge "missing a rally." Buying pressure is one-sidedly on low-strike puts, lifting their IV.
- **Weak rally-chasing demand, plus people selling calls.** On the high-strike call side, **covered-call** selling flows in continuously (holders selling calls for income, Stage 6.2), and that supply caps the price and depresses the IV.

> In one line: **skew = the "fear premium" on downside protection + the "supply discount" on the upside.** It's not an error — it's the projection of supply/demand and risk structure onto IV.

### ④ Where skew comes from: four drivers

Lay out the causes systematically; they stack up to shape that curve:

- **Fat tails (kurtosis)**: real returns are more peaked with fatter tails than normal, so BS understates the probability of extreme moves, and both OTM wings should therefore be more expensive — this is the root of the **smile**.
- **Leverage effect**: a company's stock falls → debt-to-equity rises → financial leverage grows → the stock gets riskier → volatility rises. That is, "volatility that comes out of declines." This **binds falling prices to rising volatility**, and is the fundamental explanation for the equity **reverse skew**.
- **Supply/demand imbalance**: as in ③, the one-directional buying of protective puts + one-directional selling of covered calls "bend" the curve into high-left, low-right.
- **Dealer hedging**: after market makers sell these OTM puts, they must hedge dynamically (Stage 8.5). When the market falls and their short-put Gamma turns dangerous, the hedging behavior (selling more underlying) amplifies the decline and pushes up IV, a self-reinforcing loop — this is also why **skew steepens in a sell-off**. Second-order Greeks like Vanna and Charm (Stage 5.7) are the tools that describe how the hedge drifts with volatility/time.

### ⑤ How to read and use skew

Skew isn't an academic ornament — it concretely affects your P&L:

- **Buying insurance is expensive, selling insurance is sweet**: because low-strike puts have high IV, **buying** tail protection (protective puts, tail hedging) is inherently expensive; conversely, **selling** OTM puts (cash-secured puts, Stage 6.3) collects the rich premium that skew has inflated — at the cost of taking on crash risk.
- **The cost of multi-leg strategies is set by skew**: in a **bull call spread** (buy low-K call, sell high-K call), your bought leg has high IV and your sold leg has low IV, so skew makes it **more expensive**; whereas a **bull put spread** (sell high-K put, buy low-K put), a structure that sells skew, is more cost-effective. The **collar** (Stage 6.6) exploits skew precisely — when selling an overpriced call or buying an overpriced put, you have to get the direction right.
- **Risk-reversal trades**: directly buying a put and selling a call (or vice versa) is a **pure bet on changes in skew**, a staple tool of volatility traders.
- **Skew moves**: in calm periods skew is gentle; when panic arrives the left side lifts sharply and the curve steepens. **Skew steepness itself is a tradeable, observable sentiment indicator.**

Stringing the five pieces together: **flat volatility is the BS ideal, but empirics shatter it into a curve; FX forms a smile, equities a high-left reverse skew; low-strike puts are more expensive, rooted in real fat tails, the leverage effect, protective buying, and dealer hedging; read it right and you know the richness of every leg, the cost of insurance, and how to design more cost-effective structures along the skew.** This curve is just one slice at "a single expiry"; stack the slices across all expiries and you get a whole **volatility surface** — the star of the next lesson (Stage 4.4).
`,

  demo: "vol-smile",

  analogy: `
The volatility skew is like the **distribution of flood-insurance premiums**.

Picture a row of houses in a river valley, built from the low ground by the river all the way up the hillside. The insurer prices flood coverage for each house:

- **The low-ground houses (≈ low-strike puts)**: nearest the river, the first to flood and flooded the worst if a big one comes. The insurer knows full well that "a great flood, though rare, is utterly devastating when it hits" (fat tails + crash fear), so it sets a **far higher premium** for the low-ground houses — this corresponds to the **high IV of low-strike puts.** And lots of people want this coverage (everyone on the low ground fears flooding), and that demand pushes premiums higher still.
- **The mid-hillside houses (≈ ATM)**: moderate risk, normal premiums — corresponding to the **lowest IV at ATM.**
- **The hilltop houses (≈ high-strike calls)**: almost impossible to flood, so no one will pay much for their "flood coverage," and some residents are even willing to cheaply sell this nearly useless coverage (the covered-call selling flow) — corresponding to the **low IV of high-strike calls.**

Plot each house's premium as a line and you get a **slide sloping down from left to right** — exactly the equity market's volatility skew. Its shape isn't the insurer miscalculating; it's that **flood risk itself is asymmetric**: the catastrophe of flooding the low ground is far more real and far more frightening than "the water rising backward up to the hilltop." The stock market is the same — it **plunges fast and hard but climbs slowly**, so "insurance against falling" is inherently expensive.
`,

  misconceptions: [
    "**\"For the same stock and same expiry, the implied volatility should be identical across all strikes.\"** — That's the Black-Scholes assumption, but it **never holds in reality.** The IVs backed out from different strikes connect into a curved smile/skew, the ironclad proof that the BS \"σ constant\" assumption is bankrupt.",
    "**\"The volatility smile and skew are the same thing.\"** — Different shapes. The **smile** turns up symmetrically at both ends (typical of FX); the **skew** slopes monotonically, with stocks showing a \"high-left\" reverse skew (high IV on low-strike puts). The causes differ too: the smile comes mainly from fat tails, while the equity reverse skew layers the leverage effect and one-directional protective demand on top.",
    "**\"The high IV on low-strike puts is a pricing error you can arbitrage.\"** — It's not an error. It reflects **real crash risk (fat tails, left skew) and one-directional protective buying.** This \"fear premium\" is fair compensation, not a free lunch — selling these puts means taking on tail risk (Stage 8.4).",
    "**\"Skew is fixed — plot it once and you're done.\"** — Skew **steepens or flattens dynamically** with market sentiment: gentle in calm periods, the left side lifting sharply in panic. Skew steepness is itself a sentiment indicator, and in a sell-off dealer hedging (Stage 8.5) steepens it further.",
    "**\"Since OTM calls have low IV, buying them must be a good deal.\"** — Low IV only means it's \"relatively cheap,\" not that it'll make money. It's still an OTM option, likely to expire worthless; and weak rally-chasing demand is precisely why it's cheap. Rich-or-cheap must be judged together with a directional view and the whole curve — never off a single point of IV.",
  ],

  quiz: [
    {
      q: "Plot the implied volatilities across different strikes for the same underlying and same expiry. What shape does the **equity market** typically show?",
      options: [
        "A horizontal straight line (IV equal everywhere)",
        "A high-left, low-right skew: low strikes (puts) carry higher IV",
        "High-right, low-left: high strikes carry higher IV",
        "Completely random, no pattern",
      ],
      answer: 1,
      explain: "Stocks/indices show a classic **reverse skew**: low strikes (downside puts) carry notably higher IV, reflecting crash fear, fat tails, and one-directional protective buying. The horizontal line is only the BS ideal assumption, which never holds in reality.",
    },
    {
      q: "In the equity market, the systematically high implied volatility of low-strike put options **most chiefly** reflects what?",
      options: [
        "Market makers deliberately manipulating prices",
        "The \"fear premium\" the market pays for downside (crash) risk — fat tails + one-directional protective demand",
        "Low-strike puts having especially good liquidity",
        "Interest rates having a bigger effect on low-strike options",
      ],
      answer: 1,
      explain: "The equity return distribution is **fat-tailed and left-skewed** (plunges more frequent than spikes), and combined with institutions' one-directional buying of **protective puts**, this lifts the IV of low-strike puts. It's compensation for real tail risk (Stage 8.4), not manipulation or an arbitrage opportunity.",
    },
    {
      q: "Which mechanism is the fundamental explanation for the **equity reverse skew** (rather than a symmetric smile)?",
      options: [
        "The leverage effect: a falling stock → rising financial leverage → rising volatility, binding declines to volatility",
        "The time value of all options being equal",
        "The risk-free rate varying by strike",
        "Calls and puts having different contract multipliers",
      ],
      answer: 0,
      explain: "The **leverage effect** systematically binds \"a decline\" to \"rising volatility\" (fall → debt ratio up → riskier → bigger swings), bending the curve into a high-left reverse skew. The symmetric smile is driven mainly by fat tails; equities layer this asymmetry on top of fat tails.",
    },
    {
      q: "You want to put on a **bull call spread** (buy the lower-strike K1 call, sell the higher-strike K2 call). How does the equity reverse skew affect its cost?",
      options: [
        "Skew makes it cheaper, because the bought leg has lower IV",
        "Skew makes it more expensive, because your bought low-strike leg has high IV and your sold high-strike leg has low IV",
        "Skew has no effect on the spread at all",
        "Skew makes the maximum profit unlimited",
      ],
      answer: 1,
      explain: "Under a reverse skew, **the low-strike K1's IV is higher than the high-strike K2's**. You happen to **buy the high-IV leg and sell the low-IV leg**, so the net debit is pushed up by skew, making the structure more expensive. Doing it with puts instead (sell high IV, buy low IV) is more cost-effective — this is \"designing structures along the skew.\"",
    },
  ],

  further: [
    { label: "Investopedia: Volatility Smile", url: "https://www.investopedia.com/terms/v/volatilitysmile.asp" },
    { label: "Investopedia: Volatility Skew", url: "https://www.investopedia.com/terms/v/volskew.asp" },
    { label: "Wikipedia: Volatility smile (smile/skew and causes)", url: "https://en.wikipedia.org/wiki/Volatility_smile" },
  ],
};
