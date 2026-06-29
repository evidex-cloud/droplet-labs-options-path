export default {
  id: "no-arbitrage",
  stage: 3,
  order: 3,
  title: "No-Arbitrage & Replication",
  difficulty: 3,
  prereqs: ["put-call-parity"],

  oneLiner:
    "An option has a unique \"fair price\" thanks to a startling fact: **an option can be replicated exactly with Δ shares of the underlying plus a loan/deposit.** The cost of building that replicating portfolio is the option's fair price — and dare to deviate, and arbitrageurs come to haul money away.",

  intuition: `
Last lesson's parity (Stage 3.2) told us that calls, puts, the underlying and cash are bound by a conservation law. But it didn't answer a deeper question: **why should a single call option be worth some particular amount?** By feel? By "I think it'll go up"? Neither. The answer is the most beautiful move in option pricing — **replication**.

The core insight is a single sentence:

> **An option's payoff can be replicated, to the penny, by the portfolio "hold Δ shares of the underlying + borrow (or deposit) some cash."**

If you really can build a portfolio with the **exact same payoff** as the option, then by the **no-arbitrage** principle — two things that always have the same future payoff must trade at the same price today — the option's fair price **equals the cost of that replicating portfolio today.** Not a cent more, not a cent less. Otherwise: the option being pricier than the portfolio, sell the option and buy the portfolio; cheaper, the reverse. Lock in a risk-free profit.

Let a minimal "one-step world" make it fully clear. Let the underlying trade at **S₀=100**, with only two possibilities one step out: up to **Sᵤ=120**, or down to **S_d=90**. You want to price a **call with strike K=105**. Its payoff at expiry is:
- Up to 120: the call is worth **Cᵤ = max(120−105, 0) = 15**.
- Down to 90: the call is worth **C_d = max(90−105, 0) = 0**.

Now the magic trick: **can I assemble a portfolio of "buy Δ shares + borrow some money" that's also worth 15 when up and 0 when down?** Just solve a simple hedge ratio:

$$Δ = (Cᵤ − C_d) / (Sᵤ − S_d) = (15 − 0) / (120 − 90) = 0.5

Buy **0.5 shares**: worth 0.5×120=60 when up, 0.5×90=45 when down. The two scenarios differ by 15 — exactly matching the option's payoff difference (15−0)! Add a loan to align the levels — borrow $45 (repay 45 at expiry, ignore interest for now), and the portfolio at expiry is: 60−45=**15** when up, 45−45=**0** when down. **A perfect replication of that call!** And the portfolio's cost today is 0.5×100 − 45 = **$5**.

So this call's fair price is **$5** — not because we guessed the up/down probabilities (we didn't use probability at all!), but because $5 builds something identical to it, and a cent more or less gets erased by arbitrage. This is the entire foundation of an option's "fair price," and the seed of the **binomial tree (Stage 3.4)** and **risk-neutral valuation (Stage 3.5)**.

**In this lesson we break "replication pricing" into five pieces:**

- **① No-arbitrage: the logical bedrock of all pricing**
- **② The heart of replication: build the option's payoff with Δ shares + a loan**
- **③ Working the one-step world fully (the K=105 call = $5)**
- **④ The hedge ratio Δ: how many shares to buy to replicate**
- **⑤ Why probability "disappeared" — the road to risk-neutral**
`,

  mechanics: `
### ① No-arbitrage: the bedrock of pricing

**No-arbitrage** is the bedrock of the whole edifice of option pricing, and it says one plain thing: **the market won't leave a "risk-free free lunch" lying around.** If there's a portfolio with net outlay ≤ 0 today and a payoff ≥ 0 in every future scenario (and > 0 in at least one), that's arbitrage — it'll be snapped up instantly and the price will snap back to the no-arbitrage level.

The power of this sentence: it turns "what should an option be worth" from a **subjective judgment** into an **objective derivation**. We don't need to know whether the stock will rise or fall, or how likely each is; we only ask: "Is there a portfolio built from the underlying and cash whose payoff exactly matches this option's?" If there is, the option's price is **pinned** to that portfolio's cost. Parity (Stage 3.2) is a special case of this idea (two portfolios replicating each other); this lesson pushes it to the limit — **replicating a single option.**

### ② The heart of replication: dynamic hedging

The idea of **replication**: use **the underlying + cash (borrow/lend)** to build a portfolio whose payoff, in every future scenario, exactly matches the target option's. If you can build it, you can price the option — **the replicating portfolio's cost today = the option's fair price.**

Why are the underlying + cash enough? Because the option's payoff, though bent (hockey-stick), is approximately linear **within a small step** — and "linear" is exactly what "some shares of the underlying (supplying slope) + a slug of cash (supplying intercept)" can build. That "some shares" in the portfolio is the **hedge ratio Δ**: the option price's sensitivity to the underlying (precisely the discrete version of Stage 5.2's Delta).

As the underlying moves and time advances, Δ changes, so replication must **continually rebalance** — this is called **dynamic hedging**. A market maker's daily work (Stage 8.2, Delta hedging) is exactly this in reverse: after selling an option, they replicate (hedge away) its risk by continually buying and selling Δ shares of the underlying, earning the spread.

### ③ The one-step world: working it fully

Lay the intuition version's numbers into a reproducible procedure. **Given**: S₀=100, with Sᵤ=120 or S_d=90 one step out; call K=105; for simplicity set the rate r=0 first.

1. **Compute the two payoffs**: Cᵤ = max(120−105, 0) = **15**; C_d = max(90−105, 0) = **0**.
2. **Solve the hedge ratio Δ**: make "Δ shares + cash B" reproduce the option payoff at both ends:
   - Δ·120 + B = 15
   - Δ·90  + B = 0
   Subtract the two: Δ·(120−90) = 15 → **Δ = 0.5**.
3. **Solve the cash B**: substitute back into the second equation, 0.5·90 + B = 0 → **B = −45** (the minus sign = you **borrowed** $45).
4. **Compute today's cost**: replicating portfolio's present value = Δ·S₀ + B = 0.5·100 + (−45) = **$5**.

> **Conclusion: this call's fair price = $5.** Note the whole process **never used "what's the probability of a rise"** — even if you think the chance of reaching 120 is 90%, the fair price is still $5. This counterintuitive point is exactly what the next step explains.

**Adding interest** makes it more realistic: if r=5% and this step is 1 year, the loan's present value becomes B = (Cᵤ − Δ·Sᵤ)·e^(−r) = (15 − 0.5·120)·e^(−0.05) ≈ **−42.81**, and the cost = 0.5·100 − 42.81 = **$7.19**. The demo on the right lets you drag Sᵤ, S_d and K, watching live how the replicating portfolio hits both payoffs precisely and how the cost changes.

### ④ The hedge ratio Δ: how many shares to replicate

The hedge ratio

$$Δ = (Cᵤ − C_d) / (Sᵤ − S_d)

answers: "for every $1 the underlying moves, how much does the option's value move" — i.e. "how many shares to hold so the portfolio rises and falls in sync with the option." It's the discrete version of Stage 5.2's continuous **Delta**, always in the range 0~1 (call) or −1~0 (put).

- Δ=0.5 means: to replicate this call, buy **half a share** of the underlying (or, for one contract, 0.5×100=50 shares).
- A deep ITM option has Δ→1 (moves nearly one-for-one with the stock, needing a full share to replicate); deep OTM has Δ→0 (barely any stock needed).

**Market makers live on it**: sell one Δ=0.5 call, buy 50 shares of the underlying to hedge, erase the directional risk and leave only the volatility exposure (Stage 8.2). Δ changes with the stock price and time, so hedging must be done **dynamically** — and the speed at which it changes is itself the job of another Greek, Gamma (Stage 5.3).

### ⑤ Why probability "disappeared"

The most counterintuitive point: **the entire replication pricing never, from start to finish, used the "real probability" of an up/down move.** Even if an optimist thinks the chance of reaching 120 is 90% and a pessimist thinks it's only 30%, they both compute the call's fair price as **$5**. How can that be?

Because **as long as you can replicate, subjective probability doesn't affect the cost.** The option's price is determined by "how much it costs to build a portfolio with the same payoff," and that cost depends only on Sᵤ, S_d, K, r — all objective, independent of whether you believe in a rise or fall. The real probability is **bypassed entirely** by the replication argument.

So is probability really, completely useless now? No. The next lesson (Stage 3.4 binomial trees, 3.5 risk-neutral) reveals a magic trick: we can **back out a special set of "pseudo-probabilities,"** take the expectation of the payoff under them and discount, and arrive at exactly the same fair price of $5. This set of pseudo-probabilities isn't the real-world up/down probability, but the **risk-neutral probabilities** under which "every asset earns only the risk-free rate" — they simplify the messy business of "replication" into a clean "expectation × discount." Replication is **why**, risk-neutral is **how to compute it fast.** You already hold the why; next you'll go pick up that faster slide rule.
`,

  demo: "replication",

  analogy: `
Replication pricing is like **"cloning" a prototype machine from parts, where the cloning cost is its fair price.**

Suppose someone sells you a mysterious machine: flip a switch (stock up/down) and it spits out either $15 or $0. You don't know the probability of the switch landing either way, but you want to know **what this machine is actually worth.**

The smart move isn't to guess the probability, but to **clone** it: you head to the hardware store and find that "0.5 gears (the underlying) + one borrowed spring (a loan)" assembles an **identical** machine — flip left and it spits 15, flip right and it spits 0, to the penny. And that pile of parts costs you a total of **$5** today.

So the conclusion follows: **that mysterious machine is worth only $5.** Because:
- If someone sells it for $7, you clone one yourself for $5 and sell the clone to someone else for $7, netting $2 (sell the option, buy the replicating portfolio).
- If someone sells it for $3, you buy the real machine for $3 and strip it for parts, saving $2 (buy the option, sell the replicating portfolio).

These two "free money" paths (which **no-arbitrage** forbids) nail the price firmly to $5 — **cloning cost = fair price.** The option is that mysterious machine, the underlying and cash are the hardware-store parts, and the hedge ratio Δ is "how many gears."
`,

  misconceptions: [
    "**\"An option's fair price depends on whether you think the underlying will rise or fall.\"** — No. The real up/down probability **never appears** in the replication argument: the fair price is determined only by Sᵤ, S_d, K, r. An optimist and a pessimist compute the exact same call price ($5). This is exactly the next lesson's most counterintuitive point about risk-neutral (Stage 3.5).",
    "**\"Replication is just a theoretical game — nobody actually replicates options.\"** — Quite the opposite. **Market makers do it every day**: after selling an option, they buy and sell Δ shares of the underlying to hedge (replicate) away the risk and earn the spread. This is the essence of Delta hedging and Gamma scalping (Stage 8.2).",
    "**\"The hedge ratio Δ is a fixed number, set once and done.\"** — Δ changes continually with the underlying price and time, so replication must **rebalance dynamically**. The speed of Δ's change is itself a Greek (Gamma, Stage 5.3). A \"static hedge\" set once will leak.",
    "**\"No-arbitrage is just a pretty assumption — the market is full of arbitrage opportunities.\"** — Genuine risk-free arbitrage is extremely rare and short-lived, and after netting bid-ask spreads and costs, mostly unprofitable. Precisely because **everyone can arbitrage**, prices stay nailed at the no-arbitrage level — it's the market's self-correcting mechanism, not a fantasy (Stage 3.2).",
    "**\"You can replicate a call, but puts and complex structures can't be priced this way.\"** — The same replication idea works for puts and any payoff: just solve for the respective Δ and loan. Generalize one step into many and it's the **binomial tree** (Stage 3.4); take the number of steps to infinity and it converges to **Black-Scholes** (Stage 4.1).",
  ],

  quiz: [
    {
      q: "One-step world: S₀=100, up to 120 or down to 90 one step out. A call K=105, set the rate to 0 first. What's its **hedge ratio Δ**?",
      options: ["0.25", "0.50", "0.75", "1.00"],
      answer: 1,
      explain: "Cᵤ=max(120−105,0)=15, C_d=max(90−105,0)=0. Δ=(Cᵤ−C_d)/(Sᵤ−S_d)=(15−0)/(120−90)=**0.5**. That is, replicating this call requires buying 0.5 shares of the underlying.",
    },
    {
      q: "Continuing (Δ=0.5, rate 0), the replicating portfolio \"buy 0.5 shares + loan B\" must match the option's payoff at both ends. What's the call's **fair price**?",
      options: ["$3", "$5", "$7.5", "$15"],
      answer: 1,
      explain: "From 0.5·90+B=0, B=−45 (borrow $45). Today's cost = Δ·S₀+B = 0.5·100−45 = **$5**. Under no-arbitrage, the replicating portfolio's cost is the option's fair price.",
    },
    {
      q: "In pricing this call by replication, what role does the \"real probability of the underlying reaching 120\" play?",
      options: [
        "The higher the probability, the higher the fair price",
        "None at all — the fair price is independent of the real probability",
        "You must estimate the probability accurately before pricing",
        "The probability determines the hedge ratio Δ",
      ],
      answer: 1,
      explain: "The replication argument **bypasses the real probability entirely**: the fair price is determined only by Sᵤ, S_d, K, r. Whether you think the chance of a rise is 30% or 90%, the call is worth $5. This sets the stage for risk-neutral valuation (Stage 3.5).",
    },
    {
      q: "What role does the \"no-arbitrage principle\" play in this pricing logic?",
      options: [
        "It's a tool for predicting the stock's direction",
        "It guarantees \"two portfolios with the same payoff must cost the same,\" thereby pinning the option price to the replication cost",
        "It requires that all options be profitable",
        "It works only for stocks, not options",
      ],
      answer: 1,
      explain: "No-arbitrage = the market leaves no \"risk-free free lunch.\" So the option and the replicating portfolio, which always have the same payoff, **must cost the same**, or there'd be arbitrage. This pins the option's fair price to the replicating portfolio's cost — the logical bedrock of all pricing (Stages 3.2, 3.4).",
    },
  ],

  further: [
    { label: "Investopedia: Arbitrage & No-Arbitrage Pricing", url: "https://www.investopedia.com/terms/a/arbitrage.asp" },
    { label: "Investopedia: Replicating Portfolio", url: "https://www.investopedia.com/terms/r/replicatingportfolio.asp" },
    { label: "OIC: Options Pricing Basics (replication and hedging)", url: "https://www.optionseducation.org/" },
  ],
};
