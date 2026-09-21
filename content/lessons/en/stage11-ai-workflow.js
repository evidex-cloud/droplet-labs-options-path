export default {
  id: "ai-trading-workflow",
  stage: 11,
  order: 5,
  title: "Build an AI-Assisted Trading Workflow",
  difficulty: 2,
  prereqs: ["llm-agents"],

  oneLiner:
    "String research, coding, backtesting, and execution into one modern pipeline. In 2026 LLM **research/coding is normal**, not alpha. Core principle: **AI accelerates, you adjudicate**; **do not auto-send 0DTE**; on the live path **TCA is still the bottleneck**.",

  intuition: `
You now hold all the parts: you can price options in Python (Stage 11.3), build a backtest (Stage 11.4), and use LLMs and agents (Stage 10.5). This lesson assembles them into **a workflow one person can run end to end** — and that is the biggest change of the AI era for the retail quant: **what used to take a small team weeks, one person with AI can now cover across the whole chain in days.**

But "AI can do it" is never the same as "AI decides for you." The soul of this workflow is a single sentence:

> **AI accelerates the execution of every step; you keep the judgment at every step.** (AI accelerates, you adjudicate.)

Agents can cut the **engineering time** of "reading the literature, writing boilerplate, running backtests, watching the screen" by ninety percent. But judgments like **"do I believe this conclusion?"** and **"do I commit real money?"** must be made by you. Keeping those two things separate is the key to using AI well without being misled by it.

What we're building is a **seven-stage pipeline**, with each stage clearly labeling "**what the agent does**" and "**which gate you guard**":

**In this lesson we break "the AI-assisted workflow" into seven stages:**

- **① Data ingestion: the raw material feeding the whole pipeline**
- **② LLM research/screening: it reads and filters, you verify**
- **③ AI-assisted coding: boilerplate for pricing and backtesting**
- **④ Human review: the judgment gate you cannot skip**
- **⑤ Paper trading: the last check before real money**
- **⑥ Small live trades: real money, but minimal and reversible**
- **⑦ Monitoring and a trade journal: closing the loop and reviewing**
`,

  mechanics: `
A good-enough tool stack is plain: **Python (the glue) + a broker API (data and order entry, Stage 11.1) + an LLM/agent (research and coding) + a notebook (interactive experiments and plotting)**. Below, each stage spells out who leads and what you verify. The demo on the right turns these seven stages into a clickable pipeline, with 🔴 marking the critical gates you guard.

### ① Data ingestion (you lead)

The raw material for everything. Pull it programmatically via a broker's or data vendor's **API**: historical underlying prices, the option chain (bid/ask, IV, open interest), and the calendar (expiries, earnings).

- **What you verify**: that the data is **clean, aligned, and free of look-ahead**. Are the timestamps right, is anything missing, is it adjusted? Garbage in, garbage out — every conclusion downstream rests on this layer.

### ② LLM research/screening (the agent drafts)

Let an LLM help you **digest information fast and narrow the field**: what's the known evidence for this strategy? What are the common traps (like the IV collapse after earnings)? Which metrics are worth watching (IV percentile, expected move)? You can also use it to do a **first pass** filtering candidates out of a large universe.

- **Your gate (🔴 checkpoint)**: **cross-verify every fact and source it gives you.** LLMs **hallucinate** — fabricating papers and misremembering numbers (Stage 10.5). Its output is "a lead to be verified," not "evidence." Check primary sources, and never treat its "memory" as data.

### ③ AI-assisted coding (the agent drafts)

Have the agent write the **data-pull + pricing + backtest** code (pricing in Stage 11.3, the backtest framework in Stage 11.4). It produces in minutes the boilerplate that used to take days to hand-type — the single most concrete speedup AI offers.

- **Your gate (🔴 checkpoint)**: **read it line by line + reconcile against a known answer.** "It runs" ≠ "it's correct." Have the BS function it wrote price the classic benchmark S=K=100, T=1, r=5%, σ=20%, and it **must give ≈ 10.45** (Stage 11.3), or the code has a bug. Write that kind of \`assert\` into the code as an **automatic acceptance test**.

### ④ Human review (you lead, cannot be skipped)

This is the **most critical, least outsourceable** gate in the whole pipeline. The backtest produced a result (say 18% annualized, Sharpe 1.4, 12% drawdown), and you sit down to judge:

- Is there **look-ahead bias / data leakage** (Stage 11.4)? Were **transaction costs / slippage** deducted (Stage 10.6)? Is it stable out-of-sample, or **overfit** (Stage 9.6)?
- Is this conclusion **credible**? Where is the risk hiding? Do the assumptions hold?
- **Your gate (🔴)**: decide whether to **push forward** or **tear it down and start over**. AI compresses each step from hours to minutes, but the act of "trusting it" must be yours.

### ⑤ Paper trading (collaborative)

Run it live for a while on a **simulated account** with real market data (Stage 11.1). Verify execution, slippage, signal timing — **does the real behavior match the backtest?**

- **Your gate (🔴)**: this is the **last check before touching real money**. A backtest can look great while paper trading exposes the cracks: wide spreads, hard fills, slippage eating the alpha. AI can help monitor, but "confirm consistency, clear it for live" is your call.

### ⑥ Small live trades (you lead)

Start with **real money at the smallest size**. AI can assist with order entry and monitoring, but one rule is iron:

- **Your gate (🔴 real-money gate)**: **the action that triggers real funds is explicitly authorized by you, and that authority is never outsourced.** **Do not auto-send 0DTE** (Stage 2.6). Research and coding can be 2026-ordinary; lowering the gear is still the captain. Pair live risk controls and start small (Stage 8.1). A pretty paper tape can still die in the spread: **TCA (Stage 10.6) remains the bottleneck**. There is no ChatGPT-alpha.

### ⑦ Monitoring and a trade journal (collaborative)

Close the loop after going live: monitor positions and risk (AI can watch and alert automatically), and **keep a trade journal** religiously — the thesis, entry, exit, result, and review of every trade.

- **What you verify**: how far live performance **deviates** from the backtest/paper, and why. The journal is the only reliable basis for spotting your own error patterns and improving continuously (Stage 8.6).

**Tie the seven stages together — one principle runs through all of them:**

- **The stages the AI drafts** (research, coding, backtests, monitoring): enjoy the ninety-percent speedup.
- **The gates you guard** (🔴: verify facts, reconcile acceptance tests, review conclusions, clear for live, authorize real money): not a single one can be pressed by the AI for you.

This is the right posture for the retail quant in the AI era: not handing judgment to the model, nor refusing the tools and returning to hand work, but letting the **model be a fast co-pilot and you be the final captain**. In essence, it takes the human "thesis → verify → execute → review" process of Stage 11.2 and uses AI to **accelerate but not replace** each stage. **This is educational content, not investment advice; any automated trading must be thoroughly validated in a simulated environment first.**
`,

  demo: "ai-stack",

  analogy: `
Building this AI workflow is like **flying a plane with autopilot** — the co-pilot is powerful, but the captain never leaves the seat.

- **Data ingestion** = the **instruments and sensors**: make the readings accurate first, or everything after is wrong.
- **LLM research** = the co-pilot **flipping through the manual and reporting the weather fast** — lots of information, quickly, but **the captain re-checks the key numbers personally** (it occasionally misremembers, i.e. hallucinates).
- **AI coding** = the co-pilot **pre-programming the route** — saving a huge amount of typing, but the captain **checks each waypoint** and uses a known coordinate (the 10.45 benchmark) to confirm nothing was set wrong.
- **Human review** = the captain **personally judging whether this route is sound** — a step you must never delegate to autopilot.
- **Paper trading** = **a full rehearsal in the simulator before takeoff**, confirming the real operations match the plan.
- **Small live trades** = actually flying, but **trying it first at a safe altitude with small movements**; and **the real moves — pushing the throttle, lowering the gear — must be pressed by the captain's own hand.**
- **Monitoring and journaling** = **watching the instruments and keeping a flight log** the whole way, reviewing the deviations after landing.

In one line: **autopilot (AI) handles the vast majority of operations quickly and steadily; the captain (you) makes every "should we fly this way" judgment and flips every real-money switch.** Hand the judgment and the money switches to the co-pilot, and sooner or later you crash.
`,

  misconceptions: [
    "**\"AI can do the whole thing, so let it research and place orders automatically and save me the trouble.\"** — Dangerous. The soul of the workflow is **AI accelerates, you adjudicate**: the gates of verifying facts, reconciling acceptance tests, reviewing conclusions, clearing for live, and authorizing real money (🔴) cannot be outsourced. Hand judgment and the money switch to the model and you will eventually blow up.",
    "**\"The research conclusions and data the LLM gives me can be used directly.\"** — No. LLMs **hallucinate**: fabricating papers, misremembering numbers (Stage 10.5). Its output is \"a lead to be verified\" and must be **cross-checked** against primary sources — never treated as the evidence itself.",
    "**\"If the AI-written code runs, the logic is correct.\"** — \"It runs\" ≠ \"it's correct.\" You must **read it line by line** and **reconcile against a known answer**: have its BS function price the classic benchmark to ≈ 10.45 (Stage 11.3), and write that assert into the code as an automatic acceptance test, or you may ship a bug.",
    "**\"If the backtest looks good, I can go straight to small live trades.\"** — You can't skip the gates in between. After the backtest comes **human review** (check look-ahead/costs/overfitting), then **paper trading** to verify real execution (wide spreads and slippage often expose the cracks), and only after passing those is real money allowed (Stage 11.4, Stage 10.6).",
    "**\"In automated trading, letting AI place real orders directly is the most efficient.\"** — Real money is **explicitly authorized by you**. Research/coding can be 2026-normal; **do not auto-send 0DTE**. TCA is still the bottleneck. There is no ChatGPT-alpha.",
  ],

  quiz: [
    {
      q: "What is the single most central principle of this AI-assisted workflow?",
      options: [
        "Hand research, decisions, and order entry entirely to AI to maximize efficiency",
        "AI accelerates the execution of every step; you keep the judgment at every step (especially the real-money and conclusion gates)",
        "Don't use AI at all and return to pure hand work to avoid risk",
        "Only let AI step in when you're losing money",
      ],
      answer: 1,
      explain: "The soul is **AI accelerates, you adjudicate**: agents cut the engineering time of research/coding/backtesting/monitoring by ninety percent, but verifying facts, reconciling acceptance tests, reviewing conclusions, clearing for live, and authorizing real money must be guarded by you — not outsourced to the model.",
    },
    {
      q: "In the \"LLM research/screening\" stage, what is the key checkpoint you must guard?",
      options: [
        "Adopt the papers and numbers it gives directly, to save time",
        "Cross-verify every fact and source it gives, because LLMs hallucinate",
        "Let it place the real orders while it's at it",
        "Look only at the conclusion, not the basis",
      ],
      answer: 1,
      explain: "LLMs **hallucinate** — fabricating papers, misremembering numbers (Stage 10.5). Its output is a lead to be verified, not evidence, and must be **cross-checked** against primary sources. That is the gate you guard in this stage.",
    },
    {
      q: "An agent wrote you a Black-Scholes pricing function. What is the best validation before you clear it?",
      options: [
        "Use it as long as it doesn't throw an error",
        "Reconcile it against the classic benchmark S=K=100, T=1, r=5%, σ=20% — the result must be ≈ 10.45",
        "Check whether the code has enough lines",
        "Ask another LLM to praise how well it's written",
      ],
      answer: 1,
      explain: "\"It runs\" ≠ \"it's correct.\" Reconcile against a **known answer**: the classic benchmark should give ≈ **10.45** (Stage 11.3). Writing that assert into the code as an automatic acceptance test is the most effective way to catch bugs in AI-generated code.",
    },
    {
      q: "Regarding the \"execution (real money)\" stage of the workflow, which is the correct posture?",
      options: [
        "Let AI place real orders fully automatically with no human intervention",
        "The action triggering real funds is explicitly authorized by you; start from the smallest reversible position with risk controls in place",
        "Use your full capital from the start for maximum efficiency",
        "Skip paper trading and go straight to a full live position if the backtest looks good",
      ],
      answer: 1,
      explain: "The iron rule is that **real-money actions are explicitly authorized by you, and that authority is never outsourced**. AI can assist with order entry and monitoring, but \"pushing the throttle\" must be your own hand; and start from the smallest, reversible position with live stops and risk controls (Stage 8.1).",
    },
  ],

  further: [
    { label: "Investopedia: Algorithmic Trading (overview and risks of automated trading)", url: "https://www.investopedia.com/terms/a/algorithmictrading.asp" },
    { label: "Anthropic: Building Effective Agents (designing agent workflows)", url: "https://www.anthropic.com/research/building-effective-agents" },
    { label: "Project Jupyter (the standard notebook environment for interactive research and plotting)", url: "https://jupyter.org/" },
  ],
};
