export default {
  id: "llm-agents",
  stage: 10,
  order: 5,
  title: "Using LLMs & Agents to Research, Code & Execute",
  difficulty: 2,
  prereqs: ["backtesting"],

  oneLiner:
    "This is the lesson closest to your \"AI era\" goal in the whole course. **Large language models (LLMs) and agents** can genuinely amplify a retail quant's capabilities: **explain concepts, generate pricing/backtesting code (Stages 11.3/11.4), build data pipelines, propose strategies, read and summarize filings.** But to do it right, the core is not \"let AI trade for you\" but **human-in-the-loop**: you handle judgment, verification, and risk control; AI handles acceleration. **An LLM will confidently talk nonsense** — blindly trusting its generated code or conclusions is the most expensive mistake on this path.",

  intuition: `
You came to learn options, and behind it there's probably a bigger thought: **in the AI era, can one person, with these tools, do what used to take a whole team?** This lesson answers that head-on — no hype, no cynicism — laying out clearly **what LLMs and agents can actually do for a retail quant, and where you must be the gatekeeper.**

First, get the concepts straight:

- **LLM (large language model)**: a model like ChatGPT/Claude that understands and generates text and code. You ask, it answers — one question, one answer.
- **Agent**: adds **autonomy** on top of an LLM — it can **call tools** (run code, query databases, read web pages), **plan in steps**, and break a big task into multiple steps to push forward on its own. A "quant research agent" can: you give it an idea, and it looks up references, writes code, runs a backtest, and reports the results back to you.

The places where they can **genuinely earn their keep** in a retail quant's workflow:

- **Research and explanation**: explain an obscure paper, a Greek (Stage 5.1), or a VRP (Stage 8.3) clearly; quickly research "a strategy's known flaws."
- **Generate code**: write Python for Black-Scholes pricing, plotting Greek curves (Stage 11.3), or building a backtest framework (Stage 11.4) — freeing you from "how to implement" so you focus on "what to do."
- **Build data pipelines**: write scripts to fetch, clean, and align market/earnings data.
- **Propose and critique strategies**: brainstorm strategy variants, point out the risk in an idea ("this backtest may have look-ahead bias").
- **Read and summarize filings**: compress a 10-K or an earnings-call transcript (Stage 10.4) into key points.

But there is a **line that must never be loosened**: **an LLM will "hallucinate" — it will give you wrong formulas, buggy code, and outdated facts in a perfectly serious, supremely confident tone.** It is essentially an **extremely strong draft generator and assistant, not a source of truth, and certainly not an unaudited trading decision-maker.** So the right posture for a modern retail quant using AI is not "let it trade for me" but **human-in-the-loop**:

> **AI accelerates, you gatekeep.** You set the ideas, AI helps you implement and research quickly; but **every line of code that will run real money, every conclusion you'll bet on, must be verified by you** — check the code by hand, validate against known answers, run it on paper first — before it's allowed to touch a real account.

Here's a concrete feel for the flow: you have an idea, "is buying a pre-earnings straddle positive expectancy." You ask the agent to: ① research this strategy's known studies and pits; ② generate code to pull historical IV and earnings dates; ③ write a backtest; ④ it runs and reports "18% annualized, Sharpe 1.4." **The crucial moment has arrived — you can't just believe it.** You must double-check: did it leak post-earnings data into pre-earnings (Stage 10.1)? Did it count transaction costs (Stage 10.6)? Is the sample big enough, or is it overfit (Stage 9.6)? You verify each, have it fix the issues, and finally **paper trade first** to confirm everything before considering small-size live. **Across this whole chain, AI cuts the time of each step by ninety percent, but the judgment of 'believe it or not, bet or not' stays in your hands.** The demo on the right lets you click through every step of this pipeline and see exactly where each **human checkpoint** is.

**In this lesson we break "using LLMs/agents for quant" into five pieces:**

- **① LLM vs. agent: from "Q&A" to "can call tools and act autonomously in steps"**
- **② The five things they can genuinely help with (research/coding/pipelines/strategy/summaries)**
- **③ Human-in-the-loop: why judgment and the bet decision must stay with you**
- **④ The discipline of verification: how not to get burned by confidently wrong answers**
- **⑤ A complete workflow: idea → research → code → backtest → review → paper → execute (continues to Stage 11.5)**
`,

  mechanics: `
### ① LLM vs. agent

Understanding the difference between the two is the prerequisite for using them well:

- **LLM = a powerful "one-shot" text/code generator.** You give a prompt, it gives a response. It has no memory (unless you feed it context), and it won't execute or verify on its own — **it generates, but it doesn't act.**
- **Agent = LLM + tools + a loop.** Wrap a layer around the LLM: let it **call tools** (run Python, query databases, search the web, read files), **observe results**, and **plan the next step accordingly**, looping until the task is done. An agent can "by itself" write code → run it → see the error → fix the code → run again.

> One line: **an LLM is a brain that can write; an agent gives that brain hands, feet, and a to-do list.** For quant, the value of an agent lies in stringing the **multi-step, hands-on** flow of "research → code → backtest → report" into something that runs automatically — but the **quality and trustworthiness** of each step still depend on the constraints you give and your review.

### ② The five things they can genuinely help with

No empty talk — grounded in a retail quant's daily life:

- **(a) Research and explanation**: your private tutor. Explain Vanna/Charm (Stage 5.7), derive put-call parity (Stage 3.2), research "the known problems of selling iron condors in a low-IV environment." **It excels at quickly organizing and clearly explaining existing knowledge.**
- **(b) Generate code**: the most practical, most time-saving use right now. Have it write: Black-Scholes and the Greeks in Python (Stage 11.3), plot a volatility smile, build an event-driven backtester (Stage 11.4), vectorize a strategy. **You're freed from "syntax and boilerplate" to focus on strategy logic.**
- **(c) Build data pipelines**: write scripts to pull market data/option chains/earnings calendars, clean, align, and store them. Hand off the grunt work to it for a first draft.
- **(d) Propose and critique strategies**: brainstorm "what leg could I add to this straddle to cut cost?" — or, more valuably, **make it the devil's advocate**: "pick out the possible biases and pits in this backtest of mine."
- **(e) Read and summarize filings**: compress a long 10-K, a call transcript (Stage 10.4), or a paper into key points, even extract structured data.

The common thread: **these are all "drafting, accelerating, organizing" tasks** — AI does them fast and well. The things that truly need **judgment and bearing consequences** (believe this conclusion or not, place this bet or not) it can't do, and shouldn't be allowed to.

### ③ Human-in-the-loop: judgment must stay with you

**Human-in-the-loop** is the soul of this whole approach. It means: **AI runs through the flow, but key nodes must be confirmed by a human to continue.** Why can't this be skipped?

- **LLMs hallucinate**: they can extremely confidently give **wrong formulas** (e.g., writing d1/d2 wrong), **buggy code** (boundary conditions, convention errors), and **outdated or fabricated facts** (a nonexistent API, mis-remembered historical data). The errors often **look highly credible** — that's exactly where the danger lies.
- **Financial errors are costly**: a piece of unreviewed code that sizes a position 100× too large, or quietly leaks future information in a backtest, and by the time you discover it with real money, it's too late.
- **Responsibility and compliance**: the consequences of trading decisions are borne by you. Outsourcing "should I place this bet" to a model that talks nonsense is handing the wheel to a driver who occasionally shuts their eyes.

> The golden rule: **let AI compress each step from hours to minutes, but keep the two actions of 'believe it or not, bet or not' forever in your hands.** AI is the co-pilot, you're the captain — the co-pilot can do the vast majority of operations, but whether the landing gear is down, whether to go around, the captain must confirm in person.

### ④ The discipline of verification

"Human-in-the-loop" is not a slogan; it lands as a set of **operable verification habits.** Treat these as iron laws:

- **Code must be read, must be tested**: don't just run the trading code AI gives you. **Read it line by line**; **validate against known answers** (e.g., have its BS function compute the classic S=K=100, T=1, r=5%, σ=20% → should give 10.45, Stage 9.1); run unit tests, check boundaries.
- **Conclusions must be reproducible and questionable**: for a pretty backtest, ask three things first — **is there look-ahead bias/leakage (Stage 10.1)? Were transaction costs counted (Stage 10.6)? Is it stable out-of-sample, or overfit (Stage 9.6)?** Have AI itself run this checklist too, then review it by hand.
- **Facts must be cross-verified**: for the data, APIs, and historical events the LLM reports, check them against **primary sources** — don't let its "memory" serve as evidence.
- **Always paper trade first**: before any strategy touches real money, run it on a simulated/paper account for a while, verifying that execution, slippage, logic, and the backtest match.
- **Small steps, reversible**: start real capital at the minimum size, with risk control and stop-losses in place (Stage 8.1).

The spirit of this discipline: **treat AI's output by default as "a draft that needs review," not "a trustworthy finished product."** The more important the decision (the ones that run real money), the stricter the review.

### ⑤ A complete workflow

String all of the above into a modern retail quant's actual pipeline (the demo on the right opens step by step), noting each step's **human checkpoint:**

1. **Propose the idea** (you): e.g., "is buying a pre-earnings straddle positive expectancy." — *You define the problem and hypothesis.*
2. **LLM research** (AI → you check): research known evidence, common pits, relevant metrics. — *You cross-verify the facts and sources it gives.*
3. **Generate code** (AI → you check): write data-pull + backtest code (Stages 11.3, 11.4). — *You read it line by line, validate against known answers, check for leakage.*
4. **Backtest** (AI runs → you check): obtain return/Sharpe/drawdown. — *You audit the checklist: look-ahead bias? costs? overfitting?*
5. **Human review** (you): this is the **un-skippable** gate. Is the conclusion credible? Where's the risk? — *You decide to continue or overturn.*
6. **Paper trading** (you + AI monitoring): run on a simulated account for a while, verify execution and slippage. — *You confirm live behavior matches the backtest.*
7. **Execute** (you authorize): start small-size live, AI may assist order placement/monitoring, but **the action that triggers real money is authorized by you**, with risk control in place (Stages 10.6, 8.1).

> This chain is exactly what Stage 11.5 "Build an AI-Assisted Trading Workflow" will land and implement. Its beauty is: **AI cuts the engineering time of each link by ninety percent, letting one person cover the whole chain of research → implementation → verification; its discipline is: every node that affects real money has a gate you personally guard.**

Stringing the five pieces together: **an LLM is a brain that can write, an agent gives it hands and a to-do list; they can speed you up tenfold on research, coding (Stages 11.3/11.4), data pipelines, strategy critique, and file summaries; but an LLM will confidently talk nonsense, so human-in-the-loop is mandatory — judgment and the bet decision stay with you forever; this lands as a set of verification disciplines (read the code, check against known answers, check for leakage and costs, paper trade first); and finally strings into the 'idea → research → code → backtest → review → paper → execute' workflow, where every real-money node is gatekept by you (continues to Stage 11.5).** In the next lesson we return to the micro level of execution — slippage, smart routing, and transaction cost analysis (Stage 10.6).
`,

  demo: "agent-workflow",

  analogy: `
Using LLMs/agents for quant is like **a senior attending surgeon backed by a top-tier AI medical team.**

This AI team is astonishingly fast: **reads thousands of pages of charts in seconds (= research/reading filings), drafts a surgical plan instantly (= generating strategies and code), runs every lab simulation (= backtesting).** One person can therefore do the workload that used to take a whole department — exactly the leverage the AI era gives the individual.

But there is an **iron rule the hospital never loosens**: **before the cut is actually made (= the real-money decision), the attending surgeon must personally review and personally sign off.** Why?

- **The AI team "confidently makes mistakes"**: it might read a lab result backwards or miscompute a dose, and **the report is written extremely professionally and credibly** (= the LLM hallucinating credible wrong formulas / buggy code). The professional veneer is precisely the most dangerous part.
- **The consequences are borne by the patient (= your account)**: once an error is executed, the cost is severe and hard to undo. So no matter how fast the AI is, it can only go up to the "signing desk."

The senior surgeon's correct usage is not "let AI operate for me" but **human-in-the-loop**:

- AI drafts everything, accelerates everything (cutting prep from days to minutes);
- **every key node — the diagnosis, the surgical plan, the cut itself — the surgeon checks and decides in person**;
- before the operating table, rehearse **on the simulator** first (= paper trading), and only touch a real person once confirmed.

> One line: AI is that tireless, brilliantly fast team at your side, giving one person the output of a whole crew; but **the scalpel must stay in your hand** — AI accelerates, you gatekeep, and the signing authority is never outsourced. This is the correct posture for a modern retail quant collaborating with AI.
`,

  misconceptions: [
    "**\"I can let an LLM/agent trade for me fully automatically while I collect money lying down.\"** — The most dangerous fantasy. An LLM will **confidently talk nonsense** (wrong formulas, buggy code, fabricated facts), and financial errors are extremely costly. The correct posture is **human-in-the-loop**: AI accelerates, but the judgment and authorization of 'believe it or not, bet or not' stay with you forever.",
    "**\"If AI's code runs, it's correct — take it straight to trading.\"** — No. 'It runs' ≠ 'it's correct': convention errors, boundary bugs, and quiet look-ahead leakage can make it run happily yet draw entirely wrong conclusions. You must **read line by line, validate against known answers** (e.g., BS computing the classic 10.45), check for leakage and costs, then paper trade (Stages 9.1, 10.1).",
    "**\"The facts/data/history an LLM gives are credible and can serve as evidence.\"** — It **hallucinates**: fabricating nonexistent APIs, mis-remembering historical figures, giving outdated information — all in an extremely assured tone. Treat its output as a **draft to be reviewed**, and cross-verify key facts against **primary sources.**",
    "**\"A pretty backtest (high Sharpe) coming from AI is more credible and ready for real money.\"** — Coming from AI, it warrants more wariness. Pass three gates first: **look-ahead bias/leakage? Were transaction costs counted? Is it overfit out-of-sample?** (Stages 10.1, 10.6, 9.6) Before any strategy touches real money you must **paper trade first**, start small, and have risk control.",
    "**\"An agent can execute autonomously in multiple steps, so let it run end-to-end, including placing real orders.\"** — Autonomous ≠ trustworthy. An agent can amplify an error at every step. Set a **human gate at the real-money nodes**: research/coding/backtesting can be left to it, but order placement and capital movements are **explicitly authorized** by you, with real-time risk control (Stages 10.6, 8.1).",
  ],

  quiz: [
    {
      q: "What is the core difference between an LLM and an \"agent\" emphasized in this lesson?",
      options: [
        "An agent is cheaper, an LLM is more expensive",
        "An LLM is a one-shot text/code generator; an agent adds autonomy on top — it can call tools (run code, query data, read web pages), plan in steps, and push the task forward in a loop",
        "An agent can only chat, an LLM can trade",
        "They are exactly the same, just named differently",
      ],
      answer: 1,
      explain: "**LLM = a brain that can write** (give a prompt → get a response, generates but doesn't act); **agent = LLM + tools + a loop** (can run code, query databases, see results, plan the next step, completing the task autonomously in steps). But either way, the trustworthiness of key nodes still depends on your constraints and review.",
    },
    {
      q: "In AI-assisted quant, what is the most core meaning of \"human-in-the-loop\"?",
      options: [
        "A human must stare at the screen watching the AI type the whole time",
        "AI handles drafting and acceleration, but every key node that affects real money (believe the conclusion or not, place the bet or not) must be verified and authorized by a human",
        "You must hire a person dedicated to writing prompts for the AI",
        "A human only intervenes when the AI errors out and crashes",
      ],
      answer: 1,
      explain: "Human-in-the-loop = **AI accelerates, you gatekeep.** AI does the drafting/accelerating work (research/coding/backtesting), but the **judgment and authorization** of 'is this conclusion credible, should I place this bet' must be done by you — because an LLM confidently makes mistakes, financial errors are costly, and the responsibility is yours.",
    },
    {
      q: "An agent wrote you a backtest reporting \"18% annualized, Sharpe 1.4.\" Per this lesson's verification discipline, what should you do **first**?",
      options: [
        "Immediately go all-in live, while the alpha is still there",
        "Read the code line by line, validate against known answers, and audit for look-ahead bias/data leakage, transaction costs, and out-of-sample overfitting — then paper trade first to verify",
        "Just believe it, because AI miscalculates less than humans",
        "Tweak the Sharpe a bit higher and send it to a friend",
      ],
      answer: 1,
      explain: "A pretty backtest from AI warrants **more** scrutiny. The verification discipline: **read the code + validate against known answers** (e.g., BS → 10.45, Stage 9.1), pass three gates — **look-ahead/leakage (10.1), transaction costs (10.6), overfitting (9.6)** — and **paper trade first** to confirm execution matches the backtest, before small-size live. Never go straight to real money.",
    },
    {
      q: "Which of the following is **not** a suitable, reliable use of LLMs/agents in a retail quant workflow?",
      options: [
        "Explaining the Greeks, researching a strategy's known flaws",
        "Drafting Python code for Black-Scholes pricing and backtesting (for you to review)",
        "Autonomously deciding to place bets and trading with real capital without your review",
        "Compressing a long earnings-call transcript into key points",
      ],
      answer: 2,
      explain: "Research, generating code (for review), and summarizing files are AI's **drafting/accelerating** strengths — suitable and reliable. But **autonomously placing bets and using real money without review** violates the human-in-the-loop principle — an LLM hallucinates, errors are costly, and the responsibility is yours; real-money decisions and authorization must be gatekept by a human (Stages 10.6, 8.1).",
    },
  ],

  further: [
    { label: "Anthropic: Building effective agents (agent design and human-in-the-loop)", url: "https://www.anthropic.com/research/building-effective-agents" },
    { label: "Investopedia: Backtesting (backtesting and its common biases)", url: "https://www.investopedia.com/terms/b/backtesting.asp" },
    { label: "QuantStart: common backtest biases (look-ahead, survivorship, overfitting)", url: "https://www.quantstart.com/articles/Successful-Backtesting-of-Algorithmic-Trading-Strategies-Part-I/" },
  ],
};
