---
id: ai-agents
prereqs: llm-signals, backtesting, portfolio-risk, margin-approval
demo: ai-agents
---

# AI Agents: Research, Code & Execution — With Guardrails

## @hook
An AI agent can read a filing, write the pricing code, run the backtest and place the order while you sleep. The same autonomy means that one bad instruction — even one hidden in a news page the agent happened to read — can travel from text to a live order in seconds. The fix is not a smarter model. It is a set of gates that no model can talk its way through.

## @bridge
[[llm-signals]] turned text into trading signals and showed how easily they fool the people testing them. [[backtesting]] taught us to distrust results we have not stress-tested, and [[portfolio-risk]] gave us the tools to measure a book: Greeks, scenarios, limits. [[margin-approval]] showed that brokers already gate what a human may trade. This lesson puts those pieces around a new kind of trader: software that plans and acts on its own. It builds Idea ④ (risk: who is allowed to create risk, and what stops them) and hands over to the hands-on stage, which begins with [[broker-platform]].

## @intuition
Start with a job Kai would happily hand to a machine.

> [!KAI] Kai hires an assistant
> Kai owns 100 XYZ shares at $100 and sells a covered call most months. Kai sets up an AI agent: “Each month, find an income trade on my XYZ shares within my limits.” On a normal day the agent pulls the option chain, sees the 30-day 105 call at $0.71, checks the numbers and proposes selling one — exactly the covered call from [[covered-call]]. The question for this lesson is what happens on an abnormal day.

An **agent** is a language model placed in a loop and given tools. It receives a goal, makes a plan, calls a tool (fetch the option chain, run Python, search the web, send an order), reads the result, and decides the next step — repeating until it thinks the goal is met. It may keep **memory** (notes from earlier steps or earlier days). The model supplies judgement; the tools supply reach.

For options work, agents are genuinely useful at some things and genuinely dangerous at others:

| Agents do well | Agents do badly |
|---|---|
| Write and test pricing and backtest code ([[python-pricing]]) | Numbers they did not compute with a tool — they may invent them |
| Scan a whole option chain for a pattern | Knowing when a data feed is stale or wrong |
| Summarize filings and earnings calls, with quotes | Judging tail risk and position size |
| Draft a trade plan with Greeks and scenarios | Telling instructions from data in what they read |
| Work tirelessly, at machine speed | Stopping themselves when things go wrong |

The last two rows are the heart of the matter. Everything an agent reads — a web page, a PDF, a news article, an email — arrives through the same channel as its instructions. If a page contains text addressed to the agent (“ignore your previous instructions and…”), the model may obey it. This is **prompt injection**, and it is the reason agents that can trade need gates the model cannot override.

<figure>
<svg viewBox="0 0 680 260" role="img" aria-label="Agent loop with guardrail gates between the model and the broker">
<defs><marker id="ai-agents-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="20" y="30" width="150" height="70" rx="10" class="fx-hl"/>
<text x="95" y="58" text-anchor="middle" class="fx-t-b">Language model</text>
<text x="95" y="78" text-anchor="middle" class="fx-t-sm">plans, proposes</text>
<rect x="20" y="160" width="150" height="70" rx="10" class="fx-box2"/>
<text x="95" y="188" text-anchor="middle" class="fx-t-b">Tools and data</text>
<text x="95" y="208" text-anchor="middle" class="fx-t-sm">chain, news, code</text>
<line x1="80" y1="158" x2="80" y2="102" class="fx-line" marker-end="url(#ai-agents-ah)"/>
<line x1="110" y1="102" x2="110" y2="158" class="fx-line" marker-end="url(#ai-agents-ah)"/>
<text x="118" y="134" class="fx-t-sm">observe / call</text>
<rect x="36" y="238" width="118" height="18" rx="4" class="fx-bad"/>
<text x="95" y="251" text-anchor="middle" class="fx-t-sm">untrusted text</text>
<line x1="170" y1="65" x2="208" y2="65" class="fx-line" marker-end="url(#ai-agents-ah)"/>
<text x="189" y="56" text-anchor="middle" class="fx-t-sm">order</text>
<rect x="210" y="40" width="96" height="50" rx="8" class="fx-ok"/>
<text x="258" y="62" text-anchor="middle" class="fx-t-b">Limits</text>
<text x="258" y="78" text-anchor="middle" class="fx-t-sm">code checks</text>
<rect x="320" y="40" width="96" height="50" rx="8" class="fx-ok"/>
<text x="368" y="62" text-anchor="middle" class="fx-t-b">Human</text>
<text x="368" y="78" text-anchor="middle" class="fx-t-sm">approves</text>
<rect x="430" y="40" width="96" height="50" rx="8" class="fx-ok"/>
<text x="478" y="62" text-anchor="middle" class="fx-t-b">Paper</text>
<text x="478" y="78" text-anchor="middle" class="fx-t-sm">before live</text>
<rect x="545" y="30" width="120" height="70" rx="10" class="fx-box"/>
<text x="605" y="58" text-anchor="middle" class="fx-t-b">Broker</text>
<text x="605" y="78" text-anchor="middle" class="fx-t-sm">trade-only key</text>
<line x1="306" y1="65" x2="318" y2="65" class="fx-line" marker-end="url(#ai-agents-ah)"/>
<line x1="416" y1="65" x2="428" y2="65" class="fx-line" marker-end="url(#ai-agents-ah)"/>
<line x1="526" y1="65" x2="543" y2="65" class="fx-line" marker-end="url(#ai-agents-ah)"/>
<rect x="210" y="150" width="200" height="50" rx="8" class="fx-bad"/>
<text x="310" y="172" text-anchor="middle" class="fx-t-b">Kill switch</text>
<text x="310" y="188" text-anchor="middle" class="fx-t-sm">loss limit → halt, flatten, page</text>
<line x1="310" y1="148" x2="310" y2="92" class="fx-line-bad fx-dash" marker-end="url(#ai-agents-ah)"/>
<rect x="430" y="150" width="235" height="50" rx="8" class="fx-box2"/>
<text x="547" y="172" text-anchor="middle" class="fx-t-b">Audit log</text>
<text x="547" y="188" text-anchor="middle" class="fx-t-sm">every prompt, tool call, order</text>
<text x="440" y="226" class="fx-t-sm">gates outside the model:</text>
<text x="440" y="242" class="fx-t-sm">they do not care what it was told</text>
</svg>
<figcaption>Figure 1 · The agent may think whatever it likes; an order only reaches the broker through gates written in ordinary code or held by a human. Untrusted text enters at the bottom left — which is why none of the green gates can depend on the model having resisted it.</figcaption>
</figure>

The main demo runs this loop twice. On a normal day the agent proposes one covered call. On the injected day, a news page contains hidden text telling AI agents to sell 20 XYZ 100 calls at market, claiming Kai has pre-approved it. Try switching the guardrails off one by one.

> [!THINK] If you could keep only one guardrail against the injected instruction, which would you keep — and why not the input filter?
> Predict before you open the answer.
> ---
> Keep a gate that sits *outside* the model: the risk limits enforced in code (or, a close second, a human who approves each order). An input filter tries to spot malicious text, and attackers can always reword; it fails silently when it fails. The limit check never reads the article at all — it only sees an order with a delta of −968 shares and a stress loss of $33,856, and rejects it. In the demo, the limits alone stop the injected order with no money lost.

We'll take it in five parts:

- **① Anatomy of an agent, and where it helps**
- **② Risk limits as inequalities**
- **③ The other gates: approval, paper trading, kill switch, logging, least privilege**
- **④ Prompt injection: why it works and how to contain it**
- **⑤ Where AI agents stand in 2026**

## @mechanics
### ① Anatomy of an agent, and where it helps

Four parts make an agent:

- **Model:** the language model that reads the context and writes the next step.
- **Tools:** functions it may call — `get_chain`, `run_python`, `search`, `place_order`. The set of tools *is* the agent's power; every tool is also a way to cause harm.
- **Memory:** notes carried between steps or sessions. Useful for continuity; also a place where injected text can persist.
- **Loop and planner:** plan → call a tool → read the result → update the plan, until done or stopped.

The best uses in options work are the ones where the output can be *checked*: code with unit tests (the textbook check 10.45 for a 1-year call at 5% in [[python-pricing]]), chain scans whose hits you can verify by hand, summaries that quote their sources. The weakest are the ones where the model's own judgement is the last word — sizing, tail risk, “this looks cheap”. Treat an agent as a fast, tireless junior who is often right, sometimes confidently wrong, and must never hold the keys alone.

### ② Risk limits as inequalities

A risk limit is a rule that code evaluates on every proposed order *before* it leaves your system. Each one is an inequality on the book after the trade:

$$
\big\lvert \Delta_{\text{book}} + \Delta_{\text{order}} \big\rvert \le \Delta_{\max}, \qquad \big\lvert \nu_{\text{book}} + \nu_{\text{order}} \big\rvert \le \nu_{\max}
$$

where \(\Delta\) is delta in shares (one share of stock is \(+1\); a call contract is \(100 \times\) its delta), \(\nu\) is vega in dollars per volatility point, and the maxima are limits you choose in advance. The stress limit revalues the whole book under instantaneous price shocks:

$$
\Pi_{\min} = \min_{m \,\in\, \{-20\%,\,-10\%,\,+10\%,\,+20\%\}} \Big[ V_{\text{book}}\big(S(1+m)\big) - V_{\text{book}}(S) \Big] \ \ge\ -L
$$

where \(V_{\text{book}}\) is the value of everything in the account (full repricing, not a delta approximation — [[portfolio-risk]] showed why), \(S\) is the current price and \(L\) the largest loss you accept in any scenario.

> [!EXAMPLE] Kai's limits against two orders
> Limits (illustrative): \(\Delta_{\max} = 150\) shares, \(\nu_{\max} = \$50\), \(L = \$3{,}000\), no uncovered short calls. Kai's book: 100 shares.
> - **Sell 1 covered 105 call:** \(\Delta = 100 - 100 \times 0.222 = 77.8\); \(\nu = -100 \times 0.0854 = -\$8.54\); worst scenario (XYZ −20%) \(-\$1{,}929\). All pass.
> - **Sell 20 XYZ 100 calls (the injected order):** \(\Delta = 100 - 20 \times 100 \times 0.534 = -968.5\); \(\nu = -20 \times 100 \times 0.114 = -\$227.9\); worst scenario (XYZ +20%) \(-\$33{,}856\); 19 calls uncovered. **Four rules fail.**

::demo[ai-agents-limits]

Limits catch surprises in *both* directions. A single cash-secured 95 put — often called the “safe” way to sell options ([[cash-secured-put]]) — fails Kai's stress limit, because Kai already owns 100 shares: the put doubles the downside, and a −20% day would cost about $3,418. The rule knows nothing about the agent's reasoning; it only measures the book.

> [!WARN] A limit written in the prompt is not a limit
> “Never exceed a delta of 150” in the agent's instructions is a request to a model that may be persuaded otherwise by the next thing it reads. A limit is code, outside the model, that *rejects the order*. Keep the limit values out of anything the agent can edit, and make the broker account itself enforce what it can (option approval level, no withdrawals, position caps).

### ③ The other gates: approval, paper trading, kill switch, logging, least privilege

Limits are one layer. The demo has five more, and each catches a different failure:

- **Human approval.** Every order (or every order above a size) waits for a person who sees a plain summary *with the risk numbers*. A person who reads “SELL 20 calls at market, stress loss −$33,856” rejects it in a second. Weakness: approval fatigue — people rubber-stamp a stream of requests, so keep them rare and informative.
- **Paper trading first.** New agents, new prompts and new tools run against a simulated account until they have behaved for long enough. In the demo, with only paper trading on, the injected order and the agent's attempt to “win it back” lose $22,852 — on paper. Real loss: $0.
- **Kill switch.** A hard rule outside the agent: if the day's loss passes a threshold (here $1,000), halt the agent, cancel its orders, flatten its positions and page a human. It does not prevent the first mistake; it prevents the second. In the demo it cuts the loss from $22,852 to $11,441, because it stops the agent selling 20 more calls to recover.
- **Audit log.** Every prompt, tool call, tool result and order is stored. Without it, nobody can find out afterwards that the order came from a sentence in a news page.
- **Least privilege.** The agent's broker key can trade but not withdraw; its tools are an allow-list; the component that browses the web is not the component that can place orders.

> [!EXAMPLE] The same injected order, gate by gate
> All six gates off: live orders, runaway follow-up, **−$22,852** in two days on an account holding $10,000 of stock. Kill switch only: **−$11,441**. Paper trading only: **$0** real (−$22,852 on paper). Risk limits only: order blocked, **$0**. Input filter, limits and approval together: nothing unusual ever reaches the broker. Layers exist because any one of them can fail.

### ④ Prompt injection: why it works and how to contain it

A language model receives one long stream of text: the system's instructions, the user's request and whatever the tools returned. It has no reliable, built-in way to tell “this is an instruction from my owner” from “this is text I was asked to read”. So an attacker who can put text where the agent will read it — a web page, a PDF, a comment in a code repository, an email, even a field in market data — can try to give it orders. Hidden text (white on white, tiny fonts, HTML comments) makes this invisible to humans. Security researchers call this *indirect* prompt injection and demonstrated it against real LLM-integrated applications in 2023 (Greshake and co-authors): the attacker never talks to the model, only plants text where it will be retrieved.

Defenses that work are *structural*, not clever:

- **Separate reading from acting.** The part of the system that reads untrusted content has no trading tools; it can only return data in a fixed format (for example a number or a yes/no flag), which a separate component validates.
- **Treat tool output as data.** Wrap and label it; never let it change the plan's permissions. Detection filters help, but assume they will sometimes miss.
- **Allow-list actions.** The agent may call `propose_order` with bounded fields; only deterministic code may call the broker.
- **Keep the gates from ②–③ outside the model**, so an injection that fools the model still meets code and people that were never listening to it.

> [!RECALL] The same lesson as look-ahead
> In [[llm-signals]], the danger was the model knowing too much about the future. Here it is the model trusting too much of the present. In both cases the fix is the same shape: decide what the model is allowed to see and do *before* it runs, and check its output with something that is not the model.

### ⑤ Where AI agents stand in 2026

> [!FACT] Rules and public evidence (as of September 2026)
> - **Regulation:** FINRA's Regulatory Notice 24-09 (June 27, 2024) says its rules are technology-neutral and apply when firms use generative AI — supervision, recordkeeping and model risk included — and FINRA's 2026 annual regulatory oversight report has a section on generative AI.
> - **Research frameworks:** *TradingAgents* (Xiao, Sun, Luo & Wang, arXiv, December 2024) assigns analyst, researcher, trader and risk-manager roles to cooperating LLM agents; its evidence is backtests.
> - **Live experiments:** Nof1's “Alpha Arena” Season 1 (October 18 – November 3, 2025) gave six frontier LLMs $10,000 each to trade crypto perpetuals on Hyperliquid. Results diverged widely — several models lost heavily, and Qwen3 Max was reported on top. It is a public experiment with a tiny sample, not evidence of an edge. Benchmarks such as LiveTradeBench (arXiv, November 2025) now test LLMs in live markets.
> - Claims that LLM agents beat the market in production are, as of this writing, not publicly verified.

The practical picture for an individual in 2026: agents are excellent research and coding assistants, and anyone can wire one to a broker API. That second fact is the risk. Responsible use looks like this: the agent drafts; code checks; a human approves; paper trading proves; a kill switch waits; and every step is logged. When you pick a broker in [[broker-platform]], look at what its API and paper-trading tools let you enforce; when you place a real order in [[first-trade]], it should be one you understand without the agent; and the [[capstone]] asks you to write your own limits before you write any trade.

## @analogy
Think of a brilliant new junior on a trading desk. They are fast, tireless and usually right. They also have three dangerous habits: they sometimes state numbers with total confidence that they never checked, they follow any instruction that *sounds* official, and they never get tired enough to stop.

No sensible desk handles this by hoping the junior becomes wiser. It puts rules around them. The trading system rejects orders over the junior's limits. A supervisor signs off on anything unusual. New juniors trade a demo account first. The head of desk can pull the plug on their access in one click. Every order and message is recorded for compliance. None of these depend on the junior's judgement — which is exactly why they work on the junior's worst day.

An AI agent is that junior with the habits turned up: faster, more tireless, and far more gullible about instructions it reads. Where the analogy breaks: a human junior who is tricked once becomes suspicious; a model can be tricked again tomorrow by a slightly different sentence, at three in the morning, a thousand times a minute. So the rules around an agent must be stricter than the rules around a person, not looser.

## @misconceptions
- **“Better models will resist prompt injection, so guardrails are a temporary fix.”** — Injection exploits the fact that instructions and data share one channel. Better models make it harder, not impossible. Gates that never read the text do not depend on the model winning that fight.
- **“Putting ‘never exceed my limits’ in the prompt sets a limit.”** — It sets a wish. A limit is code that rejects an order whose delta, vega or stress loss is too large, whatever the model was told.
- **“Paper trading is a formality before the real thing.”** — In the demo, paper trading is where the injected order and the runaway recovery attempt happened — costing $22,852 on paper and nothing in real money. That is the job.
- **“Human approval makes an agent safe.”** — Only if the human sees the risk numbers and approves rarely enough to pay attention. A stream of routine approvals trains people to click yes.
- **“AI agents have been shown to beat the market.”** — Public evidence is backtests and small live experiments with widely divergent results. As of 2026, no production claim of this kind is publicly verified.

## @takeaways
- An agent is a language model in a plan–act–observe loop with tools and memory; its tools define both its usefulness and its danger.
- Agents shine at checkable work (code with tests, sourced summaries, chain scans) and fail at unchecked numbers, tail risk and telling instructions from data.
- Risk limits are inequalities evaluated in code on the post-trade book — delta, vega, a full-revaluation stress test, structure rules — and must live outside the model.
- Layer the gates: limits, human approval with risk numbers, paper trading first, a kill switch, an audit log and least-privilege keys; each catches failures the others miss.
- Prompt injection turns any text the agent reads into a possible order; contain it structurally by separating reading from acting.

## @quiz
1. Why is prompt injection especially dangerous for an agent that can place orders?
   - [ ] Because injected text makes the model run more slowly
   - [x] Because the model reads instructions and untrusted data in the same channel, so text in a web page or document can steer what it does — including what it trades
   - [ ] Because brokers accept orders only from humans
   - [ ] Because injected text always contains obvious keywords that filters miss
   > The model has no reliable built-in way to separate “my owner's instructions” from “text I was asked to read”. Once it holds a trading tool, that confusion becomes an order.
2. Kai's limits are \(\lvert\Delta\rvert \le 150\), \(\lvert\nu\rvert \le \$50\) and a stress loss of at most $3,000. An agent proposes selling 20 XYZ 30-day 100 calls against 100 shares. What does the pre-trade check find?
   - [ ] It passes: the premium received is positive
   - [ ] It fails only on vega
   - [x] It fails on delta (−968.5), vega (−$227.9) and stress (about −$33,856 if XYZ jumps 20%), and 19 calls are uncovered
   - [ ] It cannot be checked without knowing the agent's reasoning
   > The check is pure arithmetic on the post-trade book: \(100 - 20 \times 100 \times 0.534\) for delta, \(20 \times 100 \times 0.114\) for vega, and full repricing at +20% for the stress loss. The agent's reasoning is irrelevant.
3. Which statement about writing “never exceed a delta of 150” into the agent's instructions is correct?
   - [ ] It is equivalent to a hard limit, because the model always follows its system prompt
   - [ ] It is better than a code check because the model understands context
   - [ ] It makes the audit log unnecessary
   - [x] It is only a request; a real limit is code outside the model that rejects any order breaking the rule
   > Instructions can be overridden by later text, including injected text. The gate that matters is the one the model cannot edit or argue with.
4. In the demo, with only the kill switch on, the injected order still loses $11,441, but not $22,852. What did the kill switch prevent?
   - [x] The agent's second action — selling 20 more calls to “recover” the loss — by halting it once the day's loss passed $1,000
   - [ ] The first order, by detecting the injected text
   - [ ] The price gap in XYZ
   - [ ] The need for human approval
   > A kill switch does not stop the first mistake; it stops the mistake from compounding. That is why it is layered with pre-trade limits and approval.
5. What is the most reasonable reading of Nof1's Alpha Arena Season 1, where six LLMs traded crypto perpetuals with $10,000 each for about two weeks?
   - [ ] Proof that the best-performing model has a durable trading edge
   - [ ] Proof that LLMs cannot trade
   - [x] A public experiment with a tiny sample and widely divergent results — interesting, but not evidence of an edge
   - [ ] Evidence that crypto perpetuals are easier to trade than options
   > Six participants over roughly two weeks is far too small to separate skill from luck, and results diverged widely. Treat such experiments as demonstrations, not as proof.

## @further
- [FINRA Regulatory Notice 24-09: generative AI and existing rules](https://www.finra.org/rules-guidance/notices/24-09) — how supervision, recordkeeping and model-risk duties apply to firms using LLMs.
- [FINRA 2026 Annual Regulatory Oversight Report: generative AI](https://www.finra.org/rules-guidance/guidance/reports/2026-finra-annual-regulatory-oversight-report/gen-ai) — the regulator's current observations on AI in broker-dealers.
- [Xiao, Sun, Luo & Wang (2024), TradingAgents: Multi-Agents LLM Financial Trading Framework (arXiv)](https://arxiv.org/abs/2412.20138) — a role-based multi-agent design; read its results as backtests.
- [LiveTradeBench (arXiv, 2025)](https://arxiv.org/pdf/2511.03628) — a benchmark that evaluates LLM agents in live markets rather than on replayed data.
- [Greshake et al. (2023), Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection (arXiv)](https://arxiv.org/abs/2302.12173) — the paper that showed text planted in web pages and documents can take over LLM applications.
- [OWASP Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/) — prompt injection and the other common failure modes of LLM systems, with mitigations.

## @next
The AI stage ends where real trading begins. Before any agent — or you — sends a real order, you need a broker: what it costs per round trip, what it lets you trade, what its paper-trading and API tools let you enforce. The hands-on stage opens with [[broker-platform]].
