export default {
  id: "risk-neutral",
  stage: 3,
  order: 5,
  title: "Risk-Neutral Valuation: The Most Misunderstood Idea",
  difficulty: 3,
  prereqs: ["binomial-model"],

  oneLiner:
    "**Risk-neutral valuation** doesn't mean \"investors don't care about risk.\" It's an **accounting technique**: pretend every asset earns only the risk-free rate, take the expectation under these pseudo-probabilities and discount, giving a price `= e^(−rT)·E_Q[payoff]`. It gives the same price as the real world — because the option can be replicated.",

  intuition: `
The previous two lessons used **replication** (Stage 3.3) to prove an option has a unique fair price, then used the **binomial tree** (Stage 3.4) to compute it repeatedly with a set of "pseudo-probabilities" p. Now it's time to answer head-on the long-deferred, most easily misunderstood question: **what exactly are those risk-neutral probabilities, and why does a set of "fake" probabilities compute a "real" price?**

First, dispel the biggest misconception. The phrase "risk-neutral" **isn't** saying "investors don't care about risk" — in reality everyone is risk-averse, and that hasn't changed. It's a **mathematical technique for pricing**, a "disguise":

> **Risk-neutral valuation = pretend you live in a parallel world where "every asset earns only the risk-free rate r," take the expectation of the option's payoff under that world's probabilities (denoted Q), and discount back to today.**

Written as a one-line formula, it's the heart of all modern derivatives pricing:

$$option price = e^{−rT}·E_Q[expiry payoff]

where E_Q is the expectation taken under the **risk-neutral measure Q** — using not the real up/down probability, but Stage 3.4's p.

Why does this "pretending" give the correct price? The key is still that one word: **replication.** Last lesson we saw the option's fair price is set by "how much it costs to replicate it," and that replication cost is **independent of the real up/down probability.** Since the real probability is bypassed, we're **free to swap in any convenient set of probabilities** — so long as it's consistent with no-arbitrage. The risk-neutral probabilities Q are exactly such a set: they make every asset's expected growth rate exactly equal r, so the simplest formula "expectation × discount" gives the replication cost directly. **Replication is "why it's right," risk-neutral is "how to compute it fast."**

A number you can compare directly. Back to that one-step world: S₀=100, up to 120 or down to 90, call K=105, r=5%, one step = 1 year.
- In the real world you might think the **chance of a rise is as high as 70%**. Then the payoff's **real expectation** = 0.7×15 + 0.3×0 = **$10.5** (before discounting).
- But the option's fair price is **not** 10.5. Computing with the risk-neutral probability p≈0.504: price = e^(−0.05)·(0.504×15 + 0.496×0) ≈ **$7.19**.

See the shock? **Even if you firmly believe the chance of a rise is 70%, the option is worth only 7.19, not 10.5.** Because 7.19 is the cost of replicating it — your 70% optimism shouldn't make you pay a cent more for the option. A high real probability doesn't make the option more expensive; it only makes **you expect to earn more** (that's your edge, not the option's price). This is risk-neutral's most counterintuitive, and most profound, lesson.

**In this lesson we break risk-neutral into five pieces:**

- **① Dispel the misconception: it doesn't mean "people don't fear risk"**
- **② The true definition: the measure Q where every asset drifts at r**
- **③ The heart formula: price = e^(−rT)·E_Q[payoff]**
- **④ Why it's independent of the real drift — again because of replication**
- **⑤ From one step to infinity: the road to Monte Carlo and BS**
`,

  mechanics: `
### ① Dispelling the biggest misconception

**"Risk-neutral" is not a description of people, but the name of a set of probabilities.** It absolutely does not say "market participants are indifferent to risk" — in the real world investors demand a risk premium (a stock's expected return exceeds the risk-free rate precisely as compensation for bearing risk). The risk-neutral measure is just a **computational device**: we **pretend** to move into a parallel world where risk is "neutralized," price there, then haul the answer back to reality — and the answer happens to be right.

Why is this "pretending" allowed? Because what we're pricing is a **derivative**, whose price is locked by **replication cost** (Stage 3.3), and the replication cost is independent of the real probability. That being so, any set of probabilities works for taking the expectation — and we pick the one that makes the formula simplest: the risk-neutral measure Q.

### ② The true definition: the measure that drifts at r

The precise meaning of the risk-neutral measure Q: **under Q, every tradable asset's (discounted) expected growth rate equals the risk-free rate r.** In the real world a stock expects to rise at μ (including the risk premium), but under the measure Q its expected growth is "tuned" to r:

$$E_Q[S_T] = S_0·e^{rT}    (the stock drifts only at r under Q)

In a single binomial step, this requirement directly solves the risk-neutral probability p: making "p·up price + (1−p)·down price" discount back to exactly today's stock price S₀ gives

$$p = (e^{rΔt} − d) / (u − d)

(This is precisely where Stage 3.4's p comes from.) Note: **the real-world probability of a rise (say 70%) doesn't appear in this formula at all** — p is determined only by u, d, r. Q is a set of probabilities "backed out" of no-arbitrage, not observed.

### ③ The heart formula: expectation × discount

Once you stand in Q's world, pricing **any** derivative simplifies to the same action — **take the payoff expectation under Q, then discount at the risk-free rate**:

$$V_0 = e^{−rT}·E_Q[Payoff(S_T)]

- For a one-step binomial tree, it's e^(−rΔt)·[p·V_up + (1−p)·V_down] (Stage 3.4's backward induction).
- For a multi-step tree, it's the sum over all terminal paths weighted by the Q probabilities, then discounted.
- For a continuous model, E_Q becomes an integral — **the Black-Scholes formula (Stage 4.1) is precisely the closed-form solution of this integral**, and the formula's N(d₁), N(d₂) are essentially probabilities in the risk-neutral world.

This formula is the "heart" because it unifies the whole zoo of options (calls, puts, spreads, even path-dependent exotics) into one sentence: **write out its payoff, take the expectation under Q, discount.** The only difficulty left is "how to compute this expectation" — and when the payoff is too complex for a closed form, you **just simulate thousands of paths under Q and average**, which is Monte Carlo (Stage 9.1).

### ④ Why it's independent of the real drift

This is the point most worth thinking through in the whole chapter: **why doesn't the option price depend on the stock's real expected return μ (the real drift)?**

The answer returns to **replication** a third time. Compute the previous lesson's one-step world again, deliberately contrasting two probabilities:

**Given**: S₀=100, up to Sᵤ=120 or down to S_d=90; call K=105 → Cᵤ=15, C_d=0; r=5%, Δt=1.
- **Real-probability method (the wrong temptation)**: if you think the chance of a rise is 70%, the real expected payoff = 0.7·15+0.3·0 = 10.5. But what discount rate do you discount it at? The option is riskier than the stock and should use a discount rate far higher than r — and that discount rate you **simply can't know.** This road is a dead end.
- **Risk-neutral method (correct)**: p=(e^0.05−0.9)/(1.2−0.9)=(1.0513−0.9)/0.3≈**0.504**. Price = e^(−0.05)·(0.504·15+0.496·0) ≈ **7.19**.
- **Replication method (verification)**: Δ=(15−0)/(120−90)=0.5; loan B=(15−0.5·120)·e^(−0.05)≈−42.81; cost=0.5·100−42.81=**7.19**. ✓

Of the three, **the risk-neutral and replication methods give the exact same 7.19, while the real-probability method gives no price and can't be used.** The reason: the option can be replicated by Δ shares of the underlying + a loan, the replication cost is independent of μ, so **the real drift μ is completely canceled out.** The beauty of the risk-neutral measure is that it "automatically" uses the correct, implied discounting, sparing you from estimating that unfathomable risk premium.

> One line to lock in: **the real probability determines "how much you expect to earn" (your edge), the risk-neutral probability determines "what the option is worth" (its price).** Separating these two things is the watershed for understanding derivatives pricing.

### ⑤ From one step to infinity: the road to Monte Carlo and BS

This risk-neutral key opens the door to every pricing model that follows:

- **Multi-step binomial tree**: weight each path under Q and discount (Stage 3.4). Take the steps → ∞ and it goes continuous.
- **Black-Scholes (Stage 4.1)**: assume the stock follows geometric Brownian motion under Q (drift = r), and the heart formula e^(−rT)·E_Q[payoff] has a **closed-form solution** for its integral — the BS formula. It didn't descend from nowhere; it's the analytic result of the risk-neutral expectation.
- **Monte Carlo (Stage 9.1)**: when the payoff is too complex (path-dependent, exotic) for a closed form, just **simulate hundreds of thousands of price paths under Q on a computer**, compute each path's payoff, average, and discount — directly approximating e^(−rT)·E_Q[payoff]. This is quant pricing's most general "brute-force but reliable" method, and the main battleground today accelerated by GPUs and AI.

So risk-neutral isn't an isolated trick, but **the single throughline** running through "binomial tree → BS → Monte Carlo": unifying pricing into "in that parallel world where every asset drifts at r, take the expectation of the payoff and discount." The throughline you now hold will be used all the way into the mastery tier. The demo on the right lets you adjust the real probability of a rise by hand and watch the option price **stay stock-still** — driving the most counterintuitive fact, that the real probability doesn't affect the price, into your intuition.
`,

  demo: "risk-neutral",

  analogy: `
Risk-neutral valuation is like **pricing a ticket on a match using the "fair odds," not the win rate you privately believe in.**

Picture a boxing match where you **privately believe** the red corner has a 70% chance to win. Now someone sells you a ticket that "pays $15 if red wins" — what should it be worth?

A beginner computes: 0.7×15 = $10.5, valuing it at my win rate. **But that's wrong.** Because this ticket's price shouldn't be set by "the win rate you think it has" — it should be set by "**how much it costs to replicate this ticket using instruments available in the market.**" And that replication cost corresponds to a set of **"fair odds" that leave the bookmaker neither winning nor losing** (the risk-neutral probabilities), which might imply only a 50.4% win rate, so the ticket is worth only about $7.19.

The key realization: **your 70% judgment isn't useless — it's your "edge."** It means: if you buy at the fair price of $7.19 and your judgment is truly right, your long-run expectation is a profit. But that edge belongs to **you**, and shouldn't make you **pay more for the ticket itself.** The market prices the ticket using the fair odds (Q); what you earn is the gap between "your real win rate > the win rate implied by the fair odds."

- **Fair odds (risk-neutral probabilities)** → determine what the ticket **is worth** (its price).
- **Your real judgment (real probability)** → determines how much **you expect to earn** (your edge).

Separate these two and you've grasped risk-neutral's deepest layer: pricing uses Q, not the real probability, not because "nobody fears risk," but because the price is set by replication cost, and replication cost naturally recognizes only the fair odds.

(Reminder: the ticket/boxing-match is only an intuition analogy. Options are risky financial instruments, and none of this is investment advice.)
`,

  misconceptions: [
    "**\"Risk-neutral valuation assumes investors don't care about risk.\"** — The number-one misconception caused by the name. It's **not** a description of people, but a set of **accounting probabilities (the measure Q)**: pretend every asset drifts only at r, and on that basis take expectations and discount. In reality everyone is risk-averse, and that never changed.",
    "**\"The higher the real probability of a rise, the more valuable the option.\"** — No. In the example, even if you're certain the chance of a rise is 70% (real expected payoff 10.5), the call is worth only **7.19** (replication cost). A high real probability only makes **you expect to earn more** (your edge), not raise the option's price. This is the watershed for understanding derivatives pricing.",
    "**\"The risk-neutral price is just an approximation; the real world computes a different price.\"** — Under no-arbitrage and replicability, the risk-neutral price **is** the real-world price; the two are strictly equal (guaranteed by the replication argument). It's not an approximation, but a better algorithm for the same price.",
    "**\"Since the real probability is useless, probability is completely unimportant in pricing.\"** — The real probability indeed doesn't enter **pricing**, but the risk-neutral probability Q (backed out of u, d, r) is the core of pricing. And the real probability still determines your **P&L expectation and risk** — a trader must have both sets of probabilities in mind.",
    "**\"Risk-neutral is just a little trick in binomial trees.\"** — It's the throughline running through all of pricing: the heart formula e^(−rT)·E_Q[payoff] is backward induction in the binomial tree, the integral of **Black-Scholes** (Stage 4.1) in the continuous limit, and on complex payoffs relies on **Monte Carlo** (Stage 9.1) simulation. One line ties the three great methods together.",
  ],

  quiz: [
    {
      q: "What's the most accurate meaning of the term \"risk-neutral\"?",
      options: [
        "Investors in the market don't care about risk",
        "A set of pricing pseudo-probabilities (the measure Q) under which every asset drifts only at the risk-free rate r",
        "Options have no risk at all",
        "Pricing options with the real up/down probability",
      ],
      answer: 1,
      explain: "Risk-neutral is a set of **accounting probabilities Q**: pretend every asset earns only the risk-free rate r, and on that basis take expectations and discount. It doesn't say people don't fear risk, nor does it use the real probability — rather, because the option is replicable, this \"pretending\" is allowed.",
    },
    {
      q: "Which of the following is risk-neutral valuation's \"heart formula\"?",
      options: [
        "V₀ = E_real[payoff]",
        "V₀ = e^(−rT)·E_Q[expiry payoff]",
        "V₀ = underlying spot − strike",
        "V₀ = real probability × payoff",
      ],
      answer: 1,
      explain: "V₀ = e^(−rT)·E_Q[Payoff]: take the payoff expectation under the risk-neutral measure Q, then discount at the risk-free rate. The binomial tree's backward induction, Black-Scholes's integral, and Monte Carlo's path average are all concrete implementations of it.",
    },
    {
      q: "One-step world: S₀=100→{120, 90}, call K=105 (Cᵤ=15, C_d=0), r=5%, one step 1 year. You **think** the chance of a rise is 70%. Roughly what's the call's fair price?",
      options: [
        "$10.5 (=0.7×15)",
        "$7.19 (using the risk-neutral probability, independent of your 70%)",
        "$15",
        "Can't be determined — it depends on your win-rate judgment",
      ],
      answer: 1,
      explain: "The fair price is set by replication cost, independent of the real probability. Risk-neutral p=(e^0.05−0.9)/(1.2−0.9)≈0.504, price=e^(−0.05)·(0.504·15)≈**7.19**. The replication method (Δ=0.5, borrow 42.81) gives 7.19 too. Your 70% only determines how much you expect to earn, not the option's price.",
    },
    {
      q: "Why does an option's fair price **not depend** on the underlying's real expected return (the real drift μ)?",
      options: [
        "Because μ always equals the risk-free rate",
        "Because the option can be replicated with Δ shares of the underlying + a loan, and the replication cost is independent of μ, so μ cancels out",
        "Because regulations forbid using μ",
        "Because μ can't be measured",
      ],
      answer: 1,
      explain: "The option is replicable (Stage 3.3), the replication cost is determined only by Sᵤ, S_d, K, r, independent of the real drift μ — so μ is completely canceled out in pricing. The beauty of the risk-neutral measure is that it automatically applies the correct implied discounting, sparing you from estimating that unfathomable risk premium.",
    },
  ],

  further: [
    { label: "Investopedia: Risk-Neutral Probabilities", url: "https://www.investopedia.com/terms/r/risk-neutral-probabilities.asp" },
    { label: "Investopedia: Risk-Neutral Measure", url: "https://www.investopedia.com/terms/r/risk-neutral-measures.asp" },
    { label: "Wikipedia: Risk-neutral measure", url: "https://en.wikipedia.org/wiki/Risk-neutral_measure" },
  ],
};
