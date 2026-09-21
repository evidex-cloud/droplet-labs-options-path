export default {
  id: "psychology",
  stage: 8,
  order: 6,
  title: "Psychology, Discipline & Common Loss Patterns",
  difficulty: 1,
  prereqs: ["position-sizing"],

  oneLiner:
    "What kills a trading account is almost never \"getting the direction wrong,\" but **repeated behavioral patterns**: betting too big, revenge trading, clinging to losers while rushing to bank winners, selling naked into earnings, ignoring liquidity, having no plan. This lesson lines up these \"account killers\" one by one and gives you the only reliable antidote — a **checklist of rules written in advance** and a **trading journal**. Discipline isn't a virtue, it's a survival tool.",

  intuition: `
By now you've mastered options mechanics, pricing, the Greeks, and a full set of strategies. But there's a brutal fact: **most losing traders lose not for lack of knowledge, but because of behavior.** Hand the same positive-expectancy strategy to two people who know equally much, and one survives while the other blows up in three months — the difference is entirely **discipline**.

Why? Because the market is an **emotion amplifier** that precisely activates humanity's two oldest instincts — **greed and fear** — and in trading these two instincts almost always **give the wrong order**:

- When losing, fear makes you **unwilling to admit you're wrong** (clinging), and then cut at the most panicked bottom;
- When winning, greed makes you **rush to bank it** (afraid the profit will fly away), yet add size heavily when you should stop.

The result is that famous losing formula: **"cut your profits, let your losses run"** — exactly the reverse of the correct approach (let profits run, cut losses). This isn't because you're dumb, but because your brain evolved this way. **This is precisely what makes trading counter to human nature.**

More dangerous still, these mistakes **have fixed scripts** and play out repeatedly. Let's name a few of the most common "account killers" first (this lesson's demo will let you make each choice yourself and see the consequences):

- **Oversizing**: betting 10× the size you should on a single trade, giddy when you win once, knocked out when you lose once (violating Stage 8.1).
- **Revenge trading**: just took a loss, furious, immediately double the next order to "win it back" — emotion-driven, often losing more.
- **Clinging to losers, rushing winners**: winners are sold after holding three days, losers stay underwater for three months still waiting to be made whole.
- **Selling naked into earnings**: to collect a little premium, selling naked options before a known big-gap event like earnings — a classic "picking up pennies in front of a steamroller," leveraged up (Stage 8.3, 8.4).
- **Ignoring liquidity**: entering and exiting dead contracts with a 0.10/0.90 bid-ask spread, where slippage alone eats your entire edge (Stage 2.1).
- **No plan**: before opening, not knowing when to take profit, when to stop out, or the worst-case loss — so you're left dragged around by emotion in the moment.

> One line to cut through it: **none of these are "bad luck," they are predictable, nameable, and therefore preventable behavioral patterns.** Your biggest edge over the trader on the other side is often not being smarter, but being more disciplined.

The antidote isn't complicated, but it must be built in advance and executed afterward: **a checklist of rules every trade must pass before opening, and a trading journal that reviews each trade.** Wrest the decision back from "the emotion of the moment" and hand it to "rules written while calm" — that's the entire thrust of this lesson.

**In this lesson we break trading psychology into five pieces:**

- **① Why the human brain is born a "losing machine": greed, fear, and wrong instincts**
- **② The six big account killers: named one by one**
- **③ The disposition effect: cut your profits, let your losses run**
- **④ Antidote one: the pre-open rule checklist (covering sizing, profit/stop, liquidity, events)**
- **⑤ Antidote two: the trading journal — separating luck from skill**
`,

  mechanics: `
### ① Why the human brain is a "losing machine"

Behavioral finance found that people's psychology in the face of gains and losses is **asymmetric** (Kahneman and Tversky's prospect theory):

- **Loss aversion**: the pain of losing $100 roughly equals the joy of gaining $200. So when losing, people **take bigger risks to avoid a certain loss** (clinging, averaging down), yet when winning, **rush to lock in a certain small gain** (taking profit too early).
- **The mismatch of greed and fear**: these two instincts kept us alive in the **hunter-gatherer** era, but in trading they're almost always a **reverse signal** — when the market is most worth buying (the panic bottom) you're most afraid, when it's most worth leaving (the euphoric top) you're most greedy.

The conclusion is counterintuitive but crucial: **correct trading behavior is counter to human nature.** You can't decide by "how it feels in the moment" — that feeling system systematically steers you toward losses. You can only rely on **rules set in advance while calm** and **execute them mechanically** while trading. That's why discipline isn't a nice-to-have but a **core skill**.

### ② The six big account killers

Expand the list from the intuition section and see the mechanism and cost of each:

- **Oversizing**: a single position far exceeding the 1–2% rule (Stage 8.1). Even with a positive-expectancy strategy, an oversized position lets a normal run of losses blow up directly (risk of ruin). **This is the number-one killer** — it can veto all your other strengths.
- **Revenge trading**: just took a loss, emotionally heated, immediately place a bigger order to win it back instantly. This is the classic case of **overriding rules with emotion**, often snowballing a small loss into a disaster. The right approach: a **forced cooling-off period** after a loss, never adding size to win it back.
- **Clinging to losers, slashing winners**: see piece ③ (the disposition effect).
- **Selling naked before earnings/events**: earnings, FDA approvals, M&A announcements are **known big-gap** risks. Selling naked options beforehand (unlimited risk, Stage 8.1) to collect a thin premium is bending down to pick up pennies as the steamroller accelerates (Stage 8.3). IV is inflated before the event (the other side of IV crush), the temptation is great, but it's a classic blow-up script.
- **Ignoring liquidity**: trading contracts with **extremely wide bid-ask spreads and very low open interest** (e.g. bid 0.10 / ask 0.90, Stage 2.1). One round trip in and out and you're eaten by huge costs, and no strategy can survive this **slippage** leak (Stage 10.6). Always check the spread and open interest.
- **No trading plan**: before opening, not having defined the **entry reason, target/take-profit, stop-loss, max loss, holding time**. With no plan, every move during the session is taken over by emotion — and emotion (see ①) is systematically wrong.

### ③ The disposition effect: cut your profits, let your losses run

This is the most common and most insidious loss pattern, with a name of its own — the **disposition effect**: **the tendency to sell winning positions too early and hold losing positions too long.**

- **Why?** Loss aversion (①): banking a profit gives an instant, certain "I won" rush; while realizing a loss equals **admitting you were wrong** — painful, so you delay and delay, fantasizing "it'll come back."
- **Consequence**: your profits are **cut short** (run a little and flee), losses are **left to run** (clinging into a huge loss). Over the long run your win rate may not be low, but **a single big loss eats countless small wins** — you wreck your own win/loss ratio.
- **The fix**: reverse it — **let profits run, cut losses.** Preset a **stop-loss** and **execute it unconditionally** (when it hits the line, leave, no debate), and give profits room with a **trailing take-profit** (don't panic-close at the first unrealized gain). This discipline is precisely the core of fighting human nature.

> This is especially lethal in options: options **expire to zero** and have Theta decay (Stage 5.4), so clinging to a losing buyer position means time keeps pulling money from your pocket; clinging to a losing seller position means negative gamma can accelerate the loss (Stage 8.2). **"Waiting for it to come back" is more expensive in options than in stocks.**

### ④ Antidote one: the pre-open rule checklist

The only reliable weapon against emotion is to **move the decision forward** to the calm moment — with a **checklist every trade must pass before opening**. For each trade, tick each item before opening:

- **Sizing**: is this trade's worst-case loss ≤ 1–2% of the account? Did you size contracts backward from the max loss? (Stage 8.1)
- **Reason**: what's my entry logic? Is it an edge, or just itchy hands / revenge?
- **Take-profit / stop-loss**: what's the target? Where's the stop? What's the worst loss (known and acceptable)?
- **Liquidity**: is the bid-ask spread narrow enough? Is open interest large enough? Can I close smoothly? (Stage 2.1)
- **Events**: is there an earnings/major event during the holding period? Am I selling naked into a known gap? (Stage 8.3)
- **Greeks**: are my net delta/gamma/vega/theta what I want? (Stage 5.7)

The value of the checklist: **it turns "whether to be disciplined" from an in-the-moment decision requiring willpower into a mechanical action before opening.** You don't need to do the right thing amid the pain of a loss (that's too hard) — you just need to get the checklist right once while calm, then execute.

### ⑤ Antidote two: the trading journal

If the checklist governs the **pre-open**, then the **trading journal** governs **review and growth**. Record each trade:

- **Decision**: entry reason, planned take-profit/stop, position size, the Greeks at the time.
- **Execution**: what did you actually do? Did you deviate from the plan? Why deviate (emotion?)?
- **Result and attribution**: made/lost — but more importantly, **was it a good decision or good luck? A bad decision or bad luck?**

That last point is the soul of the journal. **A single result deceives**: a bad decision (selling naked to the hilt) might make money by luck, a good decision (a disciplined stop-out) might lose this time. Looking only at P&L, you'll **learn the wrong lesson** (reinforcing bad habits). The journal forces you to assess **decision quality** and **result** separately — only this way, over a large enough sample, can you identify which are real edges and which are luck, and systematically fix the loss patterns that keep recurring.

Stringing the five together: **the main cause of losing money isn't getting direction wrong but the brain's innate loss aversion making greed and fear give reverse orders; this breeds six nameable account killers — oversizing, revenge trading, clinging to losers and slashing winners (the disposition effect), selling naked before events, ignoring liquidity, and having no plan; the only reliable antidote is to move decisions forward — using a pre-open rule checklist to turn discipline into a mechanical action, and a trading journal to separate decision quality from luck and review continuously.** Discipline isn't a personality issue but a system you can build. With this, Chapter 8 (Risk Management & the Market Maker) closes: from sizing (8.1), hedging (8.2), the volatility premium (8.3), tails (8.4), and dealer flows (8.5) to psychology (8.6), you now have the moat that lets all the prior knowledge **truly survive and compound** — next (from Chapter 9) we step into the quantitative world.
`,

  demo: "trade-scenarios",

  analogy: `
Trading discipline is like **dieting** — everyone understands the principle, and the hard part was never knowing, but **controlling yourself in the moment of temptation**.

Everyone who wants to lose weight knows what to do: eat less sugar, exercise more, keep a regular schedule. But when that slice of cake sits in front of you late at night, "knowing" is almost useless — **the impulse of the moment** easily crushes reason. In trading, that "cake" is the revenge order after a loss to win it back instantly, the early take-profit when you fear giving back an unrealized gain, the tempting naked-selling premium before earnings. You know each is wrong, yet commit them anyway when emotion takes over.

Successful dieters don't rely on "stronger willpower," but on **reshaping the environment and moving decisions forward**: no snacks at home (set rules in advance), healthy meals prepped ahead (the pre-open checklist), a food diary (the trading journal). They don't rely on beating the cake late at night — that's too hard; they rely on **not buying the cake home while clear-headed during the day.**

The trader does exactly the same: **don't expect to make the right decision amid the searing pain of a loss (that's the late-night cake) — instead, while calm, write the rules, set the stops, check the liquidity, then execute mechanically.** Then keep a journal and review it regularly — not to see "did I make money this time," but "did I keep to the rules." Because a single P&L deceives (you might luckily binge once and not gain weight); only long-run discipline decides your final shape, and your account. **Many know, few do it, and the account rewards only the latter.**
`,

  misconceptions: [
    "**\"Losing money in trading is mainly due to insufficient analysis and getting the direction wrong.\"** — Most of the time it isn't. What loses is **behavior**: oversizing, revenge trading, clinging to losers, selling naked before events, ignoring liquidity, having no plan. With the same knowledge, the disciplined survive and the undisciplined blow up — **psychology and execution often decide life and death more than analysis does**.",
    "**\"When I'm up, I should bank it quickly to be safe; when I'm down, just wait and it'll come back.\"** — This is exactly the **disposition effect**, a classic loss pattern: cut your profits, let your losses run, wrecking your own win/loss ratio. The correct way is the reverse — **let profits run, stop losses strictly**. It's especially lethal in options, because Theta decay and negative gamma make \"waiting for it to come back\" ever more expensive (Stage 5.4, 8.2).",
    "**\"Just took a loss, immediately double the next order to win the money back — that's proactive loss-cutting.\"** — This is **revenge trading**, purely emotion-driven, often snowballing a small loss into a disaster. The correct approach after a loss is a **forced cooling-off period**, never adding size to win it back, and returning to the rule checklist. Winning it back on emotion is the fastest of the account killers.",
    "**\"IV is high before earnings and the premium is fat, so it's a good chance to sell naked and collect.\"** — Earnings is a **known big-gap** event, and selling naked (unlimited risk, Stage 8.1) is picking up pennies as the steamroller accelerates (Stage 8.3). The inflated IV is precisely the market pricing in that gap. If you must trade, use a **defined-risk** structure (like a spread), never sell naked into a known event.",
    "**\"As long as this trade made money, it proves my decision was right.\"** — A single result deceives: a bad decision might make money by luck, a good decision might lose this time. Looking only at P&L makes you **learn the wrong lesson and reinforce bad habits**. The point of the trading journal is to separate **decision quality** from **luck** and identify real edges over a large enough sample — outcome-only thinking is growth's biggest enemy.",
  ],

  quiz: [
    {
      q: "The \"disposition effect\" refers to traders tending toward what behavior?",
      options: [
        "Selling losing positions too early and holding winning positions too long",
        "Selling winning positions too early and holding losing positions too long",
        "Setting strict stop-losses on all positions",
        "Trading only when there's a clear plan",
      ],
      answer: 1,
      explain: "The disposition effect = **realizing profits too early (the rush of banking it) + clinging to losses too long (unwilling to admit being wrong)**, rooted in loss aversion. The consequence is cutting profits and letting losses run, wrecking the win/loss ratio. The fix is the reverse: let profits run, stop losses strictly. It's more expensive in options due to Theta and negative gamma (Stage 5.4, 8.2).",
    },
    {
      q: "Right after taking a loss, a trader immediately doubles the size of the next order to win the money back instantly. Which loss pattern is this, and what's the correct response?",
      options: [
        "Rational add-on; should keep scaling up until breakeven",
        "Revenge trading; should enforce a cooling-off period, never add size emotionally to win it back, and return to the rule checklist",
        "Normal hedging; no adjustment needed",
        "The disposition effect; should take profit immediately",
      ],
      answer: 1,
      explain: "This is **revenge trading** — overriding rules with emotion, often snowballing a small loss into a disaster. The correct approach after a loss is a **cooling-off period + not adding size to win it back**, and re-running the pre-open checklist (sizing, reason, stop, liquidity, events). Winning it back on emotion is one of the fastest account killers.",
    },
    {
      q: "Which pre-open check best prevents the disaster of \"one trade crippling the account\"?",
      options: [
        "Confirming the chart pattern looks nice",
        "Confirming this trade's worst-case loss doesn't exceed 1–2% of the account, and sizing contracts backward from the max loss",
        "Confirming implied volatility is at a high level",
        "Confirming many other people are buying the same contract",
      ],
      answer: 1,
      explain: "**Oversizing is the number-one account killer.** Before opening, the hard rule of \"worst-case loss ≤ 1–2% of account, size contracts backward from the max loss\" (Stage 8.1) guarantees that even many losses in a row won't kill you — the precondition for preserving all your other strengths, far more important than patterns or IV levels.",
    },
    {
      q: "Why is \"distinguishing good decisions / bad decisions\" in a trading journal more important than \"recording wins / losses\"?",
      options: [
        "Because P&L doesn't matter",
        "Because a single result deceives — a bad decision can make money by luck, a good decision can lose this time, and looking only at P&L reinforces bad habits and teaches the wrong lesson",
        "Because the journal only needs to record emotions",
        "Because decision quality and result are always consistent",
      ],
      answer: 1,
      explain: "Trading has a luck component, and **a single P&L doesn't reflect decision quality**: selling naked to the hilt might win this time, a disciplined stop might lose this time. Looking only at results makes you **reinforce bad habits**. The journal forces you to separate decision quality from luck and identify real edges over a large enough sample, systematically fixing recurring loss patterns — that's the key to growth.",
    },
  ],

  further: [
    { label: "Investopedia: Disposition Effect", url: "https://www.investopedia.com/terms/d/disposition-effect.asp" },
    { label: "Investopedia: Trading Psychology (psychology and discipline)", url: "https://www.investopedia.com/terms/t/trading-psychology.asp" },
    { label: "Wikipedia: Prospect theory (loss aversion)", url: "https://en.wikipedia.org/wiki/Prospect_theory" },
  ],
};
