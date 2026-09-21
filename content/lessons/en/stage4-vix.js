export default {
  id: "vix",
  stage: 4,
  order: 5,
  title: "The VIX: Pricing Fear",
  difficulty: 2,
  prereqs: ["hist-implied-vol"],

  oneLiner:
    "**The VIX** compresses a whole row of SPX-option implied volatilities into a single number: the market's expected annualized volatility of the S&P 500 over the next **30 days**. It moves **inversely** to the stock market — spiking in a crash, which is why it's called the \"fear index.\" It is \"**a price on volatility itself**,\" but you can't buy it directly — you can only participate through derivatives like VIX futures.",

  intuition: `
The last three lessons (Stage 4.2 / 4.3 / 4.4) dealt with the implied volatility of a single underlying: how to back it out, how it skews across strikes, how it lines up into a term structure across expiries. Now pull the lens back to the whole market: is there **one number** that sums up "how panicked the entire U.S. stock market is right now"? Yes — it's the **VIX**, compiled by the Chicago Board Options Exchange (CBOE), commonly called the **fear index (or fear gauge).**

The VIX in one sentence: **it is the market's expectation of the annualized volatility of the S&P 500 (SPX) over the next 30 days, in percent.** VIX=20 means "the market expects SPX volatility over the next 30 days to be about 20% on an annualized basis." Note three key words: **next 30 days** (not the past, but an expectation, so it's a kind of implied volatility), **the S&P 500** (representing the whole U.S. large-cap market), and **annualized** (the same basis as the IV from before).

Its most fascinating property is being **inverse to the stock market.** The ranges below are **historical, not a live August 2026 tape**:

- In a calm bull market, the VIX has historically often sat at a low **12–16**.
- In an ordinary pullback, the VIX has historically often printed **20–30.**
- In a true crisis the VIX **explodes**: 2008 drove it above **80**, and March 2020 also broke **80** — **historical peaks.**

Why inverse? Because when SPX plunges, panicked investors frantically snap up **put options** for protection (Stage 6.4), driving the implied volatility of these SPX puts (especially the low-strike puts lifted by skew, Stage 4.3) sky-high — and the VIX is synthesized precisely from these SPX-option IVs. So **price plunges → put demand surges → IV spikes → VIX spikes.** One thread ties it all together, and the VIX becomes a real-time reading of fear.

The VIX is a pure number, but you can translate it back into "roughly how much per day": divide the annualized figure by √252 (callback Stage 4.2).

- **VIX=16** → expected daily move ≈ 16/15.87 ≈ **1.0%/day** (calm).
- **VIX=20** → ≈ **1.26%/day** (normal, slightly tense).
- **VIX=40** → ≈ **2.52%/day** (crisis, big swings every day).
- **VIX=80** → ≈ **5.0%/day** (systemic crash, 2008/2020 level).

The demo below gives you a slider: drag SPX's drop and watch the VIX leap in response, along with the daily move it corresponds to — making this inverse relationship "touchable."

**In this lesson we break the VIX into five pieces:**

- **① What the VIX is: 30-day expected volatility, synthesized from SPX options**
- **② How it's computed (conceptually): a "model-free" weighting of a basket of OTM options**
- **③ Inverse correlation: why the VIX spikes in a crash**
- **④ "Vol of vol," VIX futures, and term structure (callback Stage 4.4)**
- **⑤ Why you can't buy the VIX directly, plus common ways to participate and their traps**
`,

  mechanics: `
### ① What the VIX is: 30-day expected volatility

The VIX is computed in real time by the CBOE, taking the two SPX-option expiries **closest to 30 days**, weighting and interpolating their IV, to get a standardized "30-day annualized expected volatility." There is also **VIX1D**, a short-dated vol index — **this course notes that it exists; it does not invent its volume or a live print.** Key points:

- **It's implied volatility, not historical volatility** — it watches the market's expectation of the **future**, not the realized past (the distinction from Stage 4.2 is crucial here).
- **The underlying is SPX** (S&P 500 index options, European, cash-settled, Stage 2.4), representing the whole U.S. large-cap market.
- **The basis is an annualized percentage**: VIX=20 ≈ 20% annualized; to a daily move divide by √252 ≈ 1.26%/day, to a 30-day move multiply by √(30/365) ≈ 5.7%.

> An often-overlooked fact: the VIX measures the **composite IV of the entire SPX skew curve**, not the IV of a single ATM option. Precisely because it incorporates a large number of **deep OTM puts** (lifted high by skew, Stage 4.3), the VIX is especially sensitive to downside fear — the technical reason it serves as a "fear index."

### ② How it's computed (conceptually): a model-free basket of options

Many people think the VIX is "backing out the IV from some single option," but it's cleverer than that. The VIX uses a **model-free** method — it **doesn't rely on Black-Scholes to back out a single-point IV**, but instead directly weight-sums the prices of a **whole row** (at a given expiry) of out-of-the-money (OTM) options to get that expiry's "expected variance," then takes the square root and annualizes:

$$Conceptual form: σ²(expiry) ≈ (weighted) Σ_K [ OTM option price(K) / K² ] × factor
$$Intuitively, what each term means:

- **Using OTM options**: OTM puts (low strikes) + OTM calls (high strikes) are incorporated together, covering the whole tail, so the VIX is a **composite of the entire skew**, especially sensitive to the crash tail.
- **Weight ∝ 1/K²**: low strikes (deep OTM puts) carry larger weight — this again amplifies the VIX's sensitivity to downside risk.
- **"Model-free"**: it measures the **total variance** implied by market prices, not a single-point σ under some BS assumption. This makes the VIX more robust, and is the root of why it can serve as a "basket fear thermometer."

You don't need to compute this formula by hand, but remember the conclusion: **the VIX ≈ packaging a whole row of SPX OTM option prices into a single 30-day expected-volatility reading**, and it **tilts toward the downside.**

### ③ Inverse correlation: why the VIX spikes in a crash

The VIX's **negative correlation** with SPX is its most important property, and the mechanism is a causal chain:

1. **SPX falls** → investors panic, portfolios are losing money.
2. **Snap up protection** → heavy buying of SPX **put options** to hedge the downside (protective puts, Stage 6.4).
3. **Put IV soars** → one-directional buying pushes up the implied volatility of puts (especially low-strike ones, lifted by skew).
4. **The VIX is synthesized from these IVs** → so the VIX spikes in response.

So **a VIX spike ≈ the market frantically bidding for downside protection.** Statistically, when SPX falls hard in a single day the VIX often **jumps 20%–50% that day**, and this nonlinearity — "the harder it falls, the faster the VIX leaps" — is the fingerprint of a crisis. Conversely, as the market steadies and panic recedes, put demand falls back and the VIX "deflates" with it — it is naturally **mean-reverting** (Stage 4.2, Stage 9.3): it won't stay at 80 forever, and rarely stays below 10 for long.

> The quant use: because of the negative correlation, **going long VIX (or VIX calls) is a kind of tail hedge** (Stage 8.4) — bleeding slowly in normal times (the roll cost of contango in VIX futures), paying off big in a crash, buying "insurance" for a stock portfolio. This is much like directly buying deep OTM SPX puts.

### ④ "Vol of vol," VIX futures, and term structure

The VIX itself is extremely volatile — it can leap from 15 to 40 and back to 20 within days. So **the VIX has its own volatility**, jokingly called **"vol of vol,"** with a dedicated index **VVIX** to measure it. This isn't wordplay: vol of vol is key to pricing VIX options and to understanding second-order Greeks (Volga, Stage 5.7).

More important are **VIX futures and their term structure** (a direct callback to Stage 4.4):

- What trades in the market isn't "spot VIX" but **VIX futures of different expiries.** Line them up along expiry and you get the **VIX term structure.**
- **Contango in calm**: far-month VIX futures > near-month > spot VIX — because the market's long-run mean is in the teens-to-twenties, when spot is depressed the futures lean up toward the mean. Holding long VIX futures means constantly "buying high to roll into" the next month, generating a **negative roll yield** — the root of the "chronic bleed" of going long volatility.
- **Backwardation in a crash**: spot VIX instantly spikes above all the futures, the curve steeply inverted — exactly the panic term structure from Stage 4.4.

This term structure is central to a large number of volatility strategies (such as shorting VIX to harvest the contango roll), and it was the fuse for several inverse-volatility ETPs being wiped out overnight in the February 2018 "Volmageddon."

### ⑤ Why you can't buy the VIX directly, plus how to participate

This is the beginner's biggest confusion: **the VIX is an index, not a tradeable asset.** It's merely a **number** computed in real time from SPX option prices, with no basket of "VIX shares" to hold behind it. You can't "buy 100 units of VIX and hold them" — just as you can't put "temperature" in your pocket.

To participate in the VIX, you can only use its **derivatives:**

- **VIX futures**: trade the expectation of the VIX for some future month, dominated by the term structure (contango/backwardation) and roll cost — this is the real vehicle for "buying volatility."
- **VIX options**: on top of VIX futures, bet on the VIX's direction or volatility (note they are based on VIX **futures**, not spot).
- **Volatility ETPs** (like the historical VXX, UVXY, and the wiped-out XIV): track the VIX approximately by rolling VIX futures, but are **eroded long-run by the negative roll cost of contango** — long versions tend to grind lower for years and are unsuitable for buy-and-hold, while short versions can go to zero instantly in a crash.

The core warning: **"spot VIX" and "the VIX products you can trade" can diverge severely.** Spot VIX may rise 30% on a day while your VIX futures rise only 10% (because the futures already priced in part of the expectation, and revert toward the mean). Holding a VIX ETP as a long-term position like a stock is a common and brutally costly beginner mistake.

Stringing the five pieces together: **the VIX model-free-packages a whole row of SPX OTM options (tilted downside) into a "30-day annualized expected volatility" reading; it's inverse to the stock market, spiking in a crash from put-snapping; it is itself extremely volatile (vol of vol) and forms a contango/backwardation term structure through VIX futures; and you can't hold it directly, only participate via futures, options, and ETPs, always wary of roll cost and the spot-futures divergence.** The VIX is a master sentiment switch that crystallizes all the concepts of the previous lessons (IV, skew, term structure) into one — and the starting point for "trading volatility as an asset class" (Stage 8.3).
`,

  demo: "vix-explainer",

  analogy: `
The VIX is like a city's **"earthquake fear index"** — a single reading that compresses the whole city's expectation of future tremors.

Imagine a number that reflects, in real time, "whether residents think there'll be an earthquake in the next 30 days, and how strong." It's not a tally of how many quakes happened in the past (that's historical volatility), but a synthesis of everyone's **current fear-driven bids:**

- **When all is calm**, the index sits low (VIX 12–16), everyone goes about their day, no one stockpiles emergency supplies.
- **When the ground just starts to shake**, the index jumps to 20–30, and emergency kits and tents start selling fast (rising demand for put protection).
- **When a big earthquake actually hits**, the index instantly explodes to 80: everyone frantically grabs every protective item, bidding the price of "earthquake insurance" sky-high — exactly the mechanism of SPX put IV soaring and the VIX spiking in a crash.

This analogy makes two key points clear:

- **It's inverse to "the city's tranquility"**: the more panicked, the higher the index. So the VIX leaps when the stock market plunges and stays low in a calm rally.
- **You can't "buy" the index itself**: a fear index is just a thermometer reading; you can't warehouse "fear." You can only buy **contracts linked to it** (VIX futures/options) — and these contracts price in the expectation ahead of time and carry a "roll cost," so their ups and downs **don't necessarily sync with the index reading.** Treating an index-tracking product like a piggy bank to hoard long-term tends to get nibbled away by the continuous roll cost.
`,

  misconceptions: [
    "**\"The VIX measures how much the S&P 500 has moved in the past.\"** — No. The VIX is **implied volatility**, watching the market's expectation for the **next 30 days** (synthesized from SPX option prices) — it's the windshield, not the rearview mirror. The realized past volatility is called historical volatility (Stage 4.2).",
    "**\"A high VIX definitely means the stock market will keep falling.\"** — A high VIX only means the market expects **a large move + heavy panic sentiment**; it doesn't directly predict direction. In fact a VIX spike to extreme highs often occurs **near a panic bottom**, and in hindsight is frequently one of the signals of a rebound — it's a sentiment thermometer, not a direction crystal ball.",
    "**\"I can buy the VIX directly and hold it like a stock.\"** — You can't. The VIX is a **computed index** with no holdable spot. You can only participate via VIX **futures, options, or ETPs**, which are affected by term structure and roll cost and can diverge markedly from the VIX reading.",
    "**\"Long-volatility ETPs like VXX are suitable for long-term holding to hedge risk.\"** — Dangerous. VIX futures are normally in **contango**, and long ETPs are eroded long-run by the **negative roll cost** of constantly \"buying high to roll low,\" tending to grind lower year after year. They are short-term hedging tools, **not buy-and-hold assets** (the 2018 Volmageddon saw inverse products wiped out overnight).",
    "**\"VIX=20 means the S&P will move 20% over a year.\"** — It's an **annualized expected-volatility** basis, with roughly a 68% chance the move lands within ±20% (a normal approximation), not \"exactly 20%.\" Converted to daily that's about 20/√252 ≈ 1.26%/day, and to 30 days about ×√(30/365) ≈ 5.7%.",
  ],

  quiz: [
    {
      q: "What is the most accurate meaning of the VIX index?",
      options: [
        "The realized volatility of the S&P 500 over the past 30 days",
        "The market's expected annualized volatility of the S&P 500 over the next 30 days (synthesized from SPX option prices)",
        "The current price-to-earnings ratio of the S&P 500",
        "The interest-rate volatility band set by the Federal Reserve",
      ],
      answer: 1,
      explain: "The VIX is the **expectation** of the S&P 500's annualized volatility over the **next 30 days**, synthesized from SPX option prices (a kind of implied volatility). It looks to the future, not the past — the \"windshield,\" not the \"rearview mirror.\"",
    },
    {
      q: "When the S&P 500 plunges suddenly, what does the VIX usually do, and what is the main mechanism behind it?",
      options: [
        "Falls, because trading volume shrinks",
        "Spikes, because investors snap up SPX put options to hedge, pushing up their implied volatility",
        "Stays flat; the VIX is unrelated to the stock price",
        "Goes to zero, because options stop trading",
      ],
      answer: 1,
      explain: "Plunge → panic → snap up SPX **put options** for protection → put IV soars → the VIX synthesized from these IVs spikes in response. This causal chain creates the VIX's **negative correlation** with the stock market, and the origin of the name \"fear index.\"",
    },
    {
      q: "VIX = 40 (a crisis level) roughly corresponds to what **expected daily move** for the S&P 500? (√252 ≈ 15.87)",
      options: ["About 0.4%/day", "About 1.0%/day", "About 2.5%/day", "About 10%/day"],
      answer: 2,
      explain: "Convert the annualized figure to daily: 40 / √252 ≈ 40 / 15.87 ≈ **2.5%/day**. For comparison: VIX 16 ≈ 1%/day (calm), VIX 80 ≈ 5%/day (a 2008/2020-level crash).",
    },
    {
      q: "Regarding \"buying the VIX,\" which of the following is correct?",
      options: [
        "You can directly buy and hold the VIX index like a stock",
        "The VIX is a computed index that can't be held directly; you can only participate via VIX futures/options/ETPs, and must beware of roll cost and divergence",
        "Buying VIX futures perfectly replicates the daily moves of spot VIX",
        "Long-volatility ETPs are suitable for buying and holding long-term",
      ],
      answer: 1,
      explain: "The VIX has no holdable spot; you can only participate indirectly via **futures, options, ETPs.** These tools are affected by term structure (contango/backwardation) and roll cost, and often diverge from spot VIX; long ETPs are eroded long-run by contango and are unsuitable for buy-and-hold.",
    },
  ],

  further: [
    { label: "Investopedia: VIX (Volatility Index) explained", url: "https://www.investopedia.com/terms/v/vix.asp" },
    { label: "CBOE: VIX Index official page", url: "https://www.cboe.com/tradable_products/vix/" },
    { label: "Wikipedia: VIX (methodology and history)", url: "https://en.wikipedia.org/wiki/VIX" },
  ],
};
