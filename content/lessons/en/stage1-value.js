export default {
  id: "intrinsic-time-value",
  stage: 1,
  order: 6,
  title: "Intrinsic Value vs Time Value",
  difficulty: 2,
  prereqs: ["moneyness"],

  oneLiner:
    "Any option's premium splits into two pieces: **intrinsic value (the hard value you'd get from exercising now) + time value (what you pay for the chance it gets more valuable before expiry).** Intrinsic value is the floor; time value melts as time passes, swells as volatility rises, and goes to zero at expiry.",

  intuition: `
Last lesson (Stage 1.5) you learned to judge whether an option is in-, at-, or out-of-the-money. This lesson answers a more fundamental question: **what exactly is an option's price (the premium) made of?**

The answer is an extremely important piece of addition:

$$premium = intrinsic value + time value

An example. A stock is at 105, with a call K=100 expiring in three months quoted at **$8** in the market. Of that:

- **Intrinsic value = max(105−100, 0) = $5** — the hard value you'd get from "exercising right this instant," the **floor** of the price.
- **Time value = 8 − 5 = $3** — that extra $3 is what the market is willing to pay for the chance that **the stock climbs higher before expiry.**

Why would the market pay that extra $3? Because with three months left to expiry, the stock has plenty of opportunity to push higher and make this call more valuable. That chance of "still having time, still having a shot" is itself worth money — but it's **perishable:**

- **As time ticks away** day by day, the chances dwindle, and time value **melts like ice**, hitting exactly zero at the moment of expiry (that's Theta, Stage 5.4).
- **The higher the volatility**, the wider the stock swings and the more chances it has to reach higher ground, so time value **swells** (this is priced by implied volatility, Stage 4.1).

Grasp this piece of addition and you hold the **first puzzle piece** of option pricing: at expiry only intrinsic value remains, everything extra before expiry is time value, and the latter is set jointly by "how much time is left" and "how much the underlying can thrash."

**In this lesson we break "what the premium is made of" into five pieces:**

- **① Intrinsic value: the floor of the price, never negative**
- **② Time value (extrinsic value): what you pay for "possibility"**
- **③ Time value melts as expiry nears (a preview of Theta)**
- **④ Time value swells as volatility rises (a preview of IV)**
- **⑤ Why time value is greatest at-the-money (ATM)**
`,

  mechanics: `
### ① Intrinsic value: the floor of the price

**Intrinsic value** is "the value you'd get from **exercising right this instant**," and it's always ≥ 0 (when exercising isn't worthwhile you abandon it, so it can't go negative):

$$Call intrinsic value = max(S − K, 0)
$$Put intrinsic value = max(K − S, 0)

It's the **floor** of an option's price: an ITM option is worth at least this much, or else someone could arbitrage risk-free (buy cheap, exercise immediately). An OTM option has intrinsic value = 0, and its price is **entirely** time value.

- Price 105, call K=100 → intrinsic value = **5.**
- Price 95, call K=100 → intrinsic value = max(95−100,0) = **0** (OTM, floor of 0).

### ② Time value (extrinsic value): what you pay for "possibility"

The part of the premium **above intrinsic value** is the **time value** (also called extrinsic value):

$$time value = premium − intrinsic value

It measures not "how much you can get now" but the hope that "**it might become more valuable before expiry.**" It comes from two sources: **how much time is left**, and **how much the underlying can thrash (volatility).** The bigger those two, the thicker the time value.

- Quote 8, intrinsic value 5 → time value = **3.**
- An ATM option (intrinsic value ≈ 0) quoted at 4 → time value = **4** (almost entirely time value).

> Key intuition: **at the moment of expiry, time value must = 0**, and the option is left with only intrinsic value. So an option's price curve is essentially "a bulge of time value at the start, squeezed out little by little as expiry nears, finally collapsing back onto the intrinsic-value kink." In the demo on the right, drag days→1 all the way down and you'll see the time-value bar drop to nearly zero.

### ③ Time value melts as expiry nears (Theta)

Time value doesn't bleed at a constant rate — it bleeds **faster the closer to expiry**, the curve like an accelerating fall. Intuitively, with a year left to expiry, "one day less" hardly matters; but the day before expiry, "one day less" all but erases the remaining chances.

This rate of "how much time value is lost per day" is the Greek **Theta** (time decay, Stage 5.4). For the **buyer**, Theta is the enemy — every day you hold, a bit of time value leaks away, so the buyer is racing against time; for the **seller**, Theta is a friend — the seller collected the time value and profits as it "melts into their pocket" day by day. This is the fundamental profit source of "selling options to collect rent" strategies (Stage 8.3, the variance risk premium).

### ④ Time value swells as volatility rises (IV)

Time value's other engine is **volatility.** The more the underlying can leap around, the greater its chance of reaching a "more valuable" spot before expiry, and the fuller the time value (especially the pure time value of an OTM option).

The market uses **implied volatility (IV)** to price this possibility — the higher the IV, the pricier an option of the same ticker, same strike, same expiry (the extra is all time value). That's why options "get expensive" before earnings or big events: it's not that intrinsic value changed, but that everyone expects volatility to spike, lifting time value (IV). The Black-Scholes formula (Stage 4.1) is precisely the machine that translates "time + volatility" into time value; what market makers and quants trade every day is, more than direction, **volatility itself** (Stage 5.5, Vega).

### ⑤ Why time value is greatest at-the-money (ATM)

Lay intrinsic value and time value across a row of strikes and you'll find a pattern: **time value peaks at-the-money (ATM) and tapers toward both deep-ITM and deep-OTM.**

- **Deep-ITM**: the fate is nearly settled (it will basically be exercised), the price is almost all intrinsic value, time value is thin.
- **Deep-OTM**: it will basically zero out, the absolute price is very low, and the absolute time value is small too.
- **ATM**: sitting right on the "ITM ↔ OTM" dividing line, a small move either way flips its fate — **the greatest uncertainty, the thickest time value** (the same reason Gamma and Theta are largest at ATM, Stage 5.3).

So you'll see: for the same expiry, the ATM option's "time-value bar" is the longest, getting shorter toward either side. String these five pieces together — **the floor (intrinsic value) + the bulge (time value)**, the bulge melting with time, swelling with volatility, thickest at-the-money — and you hold the key to option pricing (Stages 3 and 4).
`,

  demo: "value-split",

  analogy: `
Think of an option's premium as **a drink with ice in it.**

- **The drink itself (the liquid) = intrinsic value**: the real, won't-go-away part. Leave it out all day and the liquid is still there.
- **The ice = time value**: it makes the whole cup look fuller and more valuable, but it's **melting.**

And:

- **As time passes**: the ice melts bit by bit, faster the closer to "expiry" — and at the moment it's due, the ice is **all gone**, leaving just the liquid (intrinsic value) in the cup. That's **Theta**: the buyer watches the ice melt (a loss), and the seller is the one who sold you "a cup with ice," betting the ice melts (a gain).
- **Hotter weather (higher volatility)**: the shop adds more ice up front (thicker time value), because the "possibility" is greater — that's **implied volatility** lifting the option's price.
- **The cup with the most ice is the "half-full" one (ATM)**: too full (deep-ITM) or nearly empty (deep-OTM) can't take much ice.

When you buy an option you pay for "liquid + ice," but only the liquid is guaranteed to stay. Seeing how much of your cup is meltable ice is a basic skill of options trading.
`,

  misconceptions: [
    "**\"An option's price equals its intrinsic value.\"** — Intrinsic value is only the **floor.** Before expiry the premium is almost always higher, and the excess is **time value.** When you buy an ATM option, what you pay is almost entirely meltable time value, with intrinsic value at 0.",
    "**\"As long as I don't exercise and just keep holding, the option's value won't change.\"** — It does change, and usually it's **thinning.** Time value melts with each passing day (Theta), reaching zero at expiry. The longer the buyer holds, the more time value leaks — time is the buyer's enemy (Stage 5.4).",
    "**\"Volatility has little to do with an option's price.\"** — It has everything to do with it. The higher the volatility (implied volatility), the thicker the time value and the pricier the option. Options \"getting expensive\" before earnings isn't intrinsic value changing — it's IV lifting time value (Stages 4.1 and 5.5).",
    "**\"Deep-ITM options have the most time value, because they're the most expensive.\"** — They're expensive because of high **intrinsic value**, not high time value. Time value is greatest **at-the-money (ATM)**; a deep-ITM option is almost all intrinsic value, with thin time value (Stage 5.3).",
  ],

  quiz: [
    {
      q: "A stock is at 105. A call option with K=100 is quoted at $8. What are its **intrinsic value** and **time value**?",
      options: ["Intrinsic 8, time 0", "Intrinsic 5, time 3", "Intrinsic 3, time 5", "Intrinsic 0, time 8"],
      answer: 1,
      explain: "Intrinsic value = max(105−100, 0) = 5; time value = premium − intrinsic value = 8 − 5 = **3.** Premium = intrinsic + time — the first piece of addition in option pricing.",
    },
    {
      q: "An **at-the-money** call (current price ≈ strike) is quoted at $4. About what is its intrinsic value?",
      options: ["$4", "$2", "$0", "Can't tell"],
      answer: 2,
      explain: "At-the-money means S ≈ K, so intrinsic value = max(S−K,0) ≈ **0.** That makes the $4 **almost entirely time value** — the hallmark of an ATM option.",
    },
    {
      q: "As expiry nears (all else equal), what happens to an out-of-the-money option's value?",
      options: ["Rises", "Stays the same", "Decays toward 0 (time value melts)", "Doubles"],
      answer: 2,
      explain: "An OTM option's price is all time value, and time value melts ever faster as expiry nears (Theta), hitting zero at expiry. That's why the buyer is racing against time (Stage 5.4).",
    },
    {
      q: "Before an earnings release, a stock's options broadly \"get more expensive\" while the stock hasn't moved. The most likely reason?",
      options: ["Intrinsic value rose", "The contract multiplier got bigger", "Implied volatility (IV) rose, lifting time value", "The strike was lowered"],
      answer: 2,
      explain: "The stock hasn't moved, so intrinsic value didn't change. They got more expensive because the market expects earnings to trigger a big move, so **implied volatility rose**, lifting time value (the IV piece) (Stages 4.1 and 5.5).",
    },
  ],

  further: [
    { label: "Investopedia: Time Value of an Option", url: "https://www.investopedia.com/terms/t/timevalue.asp" },
    { label: "Investopedia: Intrinsic Value (Options)", url: "https://www.investopedia.com/terms/i/intrinsicvalue.asp" },
    { label: "OIC: Pricing & Volatility (time value & IV)", url: "https://www.optionseducation.org/" },
  ],
};
