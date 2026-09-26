# Options Path · 期权之路 — Authoring Guide (v3, 2026-09 full renewal)

Read this whole file before writing a lesson. Then open the **golden example** and copy its *format and depth* (not its content):
`content/lessons/zh/black-scholes.md`, `content/lessons/en/black-scholes.md`, `demos/black-scholes.js`, `demos/black-scholes-terms.js`.

You only write **lesson Markdown files**, **demo files** and **glossary proposals**. Never edit `app.js`, `styles.css`, `index.html`,
`math.js`, `content/manifest.js`, `content/glossary.js`, `tools/*`, or the shared engines `demos/_opt.js` and `demos/_viz.js`
(if you find a bug or a missing function in them, work around it inside your demo and report it in your final message).

---

## 0. The soul of the course

**Goal: take a complete beginner all the way to expert** — someone who can read an option chain, explain why an option costs what
it costs, choose a structure that matches a view, read and manage the Greeks, understand who is on the other side, handle futures and
perpetuals, and price/backtest in code.

The old version (early 2026) was criticised for two things. Fix both in every lesson:

1. **Disconnected topics.** → Every lesson opens by saying where we are in the story (`## @bridge`), links back to what it builds on
   and forward to what it enables (`[[lesson-id]]` links, ≥ 3 per lesson), reuses the running example (Kai and XYZ, §0.2), and names
   which of the four ideas (§0.1) it builds. It closes with `## @next`: the question the next lesson answers.
2. **Hard to understand.** → One idea at a time. **Concrete before abstract**: a picture or a number example first, then the general
   rule, then the formula. Every formula is typeset as real math, every symbol is explained in words, and it is immediately worked with
   real numbers. Short paragraphs. Plain words. Define a term the first time you use it. Never two new concepts in one sentence.

### 0.1 The four ideas (the course's spine)

| Idea | The one-sentence version | Where it is built |
|---|---|---|
| ① Shape 形状 | An option is a *shape*: capped loss, open upside (convexity). Every strategy is shapes added together. | stages 0, 1, 2, 8, 9 |
| ② No-arbitrage 无套利 | Anything you can replicate with stock and cash must cost what the replication costs. Parity, trees and Black-Scholes are all this idea. | stages 4, 5, 13 |
| ③ Volatility 波动率 | Options really trade *how much* a price will move. Implied vol is the quote, realized vol is the bill; the gap is the trader's living. | stages 6, 9, 10, 14 |
| ④ Risk 风险 | The Greeks break risk into measurable parts; gamma and theta are two sides of one coin; who holds the risk, how it is hedged and when leverage bites decide survival. | stages 7, 10, 11, 12 |

Every lesson's `@bridge` names the idea(s) it builds. Chinese: “这一课落在第 ② 个观念：无套利。” English: “This lesson builds Idea ② — no-arbitrage.”

### 0.2 The running example: Kai and XYZ (use these exact numbers — computed with `demos/_opt.js`)

- **Kai (小凯)** is a curious beginner who owns **100 shares of XYZ bought at $100** ($10,000). XYZ reports earnings in about three
  weeks. Kai has three wishes that options answer: **protect** the shares, **earn income** while waiting, and **bet on a big move with a
  capped loss**. Use Kai's name or “they/them”; never he/she (Chinese: “小凯”，never 他/她). Kai appears in one or two `> [!KAI]`
  callouts per lesson — don't overuse the story.
- **XYZ** is a fictional, liquid US stock: **S = $100**, implied volatility **σ = 20%**, risk-free rate **r = 4%** (continuous), **no
  dividend** (q = 0) unless a lesson is about dividends, American-style options, **×100 multiplier**. Time is in years, **T = days/365**.
- **Standard numbers (per share; × 100 = per contract):**

| Option (XYZ, σ 20%, r 4%) | Price | Δ | Γ | Θ per day | Vega per vol pt | Notes |
|---|---|---|---|---|---|---|
| 30-day 100 call | **2.45** ($245) | 0.534 | 0.069 | −0.044 | 0.114 | the course's "standard option"; d₁ 0.086, d₂ 0.029 |
| 30-day 100 put | **2.12** ($212) | −0.466 | 0.069 | −0.033 | 0.114 | parity: 2.45 − 2.12 = 100 − 99.67 |
| 30-day 105 call | **0.71** ($71) | 0.222 | 0.052 | −0.031 | 0.085 | Kai's covered call; risk-neutral P(S_T > 105) = 20.5% |
| 30-day 95 put | **0.51** ($51) | −0.163 | 0.043 | −0.022 | 0.071 | Kai's protective put |
| 30-day 110 call | 0.14 | 0.058 | 0.020 | −0.012 | 0.033 | a "lottery ticket" |
| 30-day 90 put | 0.06 | −0.027 | 0.011 | −0.006 | 0.018 | |
| 60-day 100 call | 3.56 | 0.548 | 0.049 | −0.032 | 0.161 | |
| 7-day 100 call | 1.14 | 0.517 | 0.144 | −0.084 | 0.055 | |
| 1-day 100 call | 0.42 | 0.506 | 0.381 | −0.214 | 0.021 | 0DTE-like gamma |
| 1-year 100 call | **9.93** | 0.618 | 0.019 | −0.016 | 0.381 | d₁ 0.30, d₂ 0.10, N(d₁) 0.6179, N(d₂) 0.5398, ρ 0.519 per 1% |
| 1-year 100 put | **6.00** | −0.382 | 0.019 | −0.006 | 0.381 | parity: 9.93 − 6.00 = 100 − 96.08 |

- Handy derived numbers: 30-day forward **100.33**, 1-year forward **104.08**, PV(100) over 1 year **96.08**; one-standard-deviation
  30-day move \(S\sigma\sqrt{T} = 100 \times 0.20 \times \sqrt{30/365} \approx\) **$5.73**; 30-day ATM straddle **4.57** ≈ 0.8 × 5.73;
  daily 1σ move ≈ **$1.05** (\(100 \times 0.2 / \sqrt{365}\)); ATM rule of thumb \(C \approx 0.4\,S\sigma\sqrt{T}\).
- **Kai's standard trades:** covered call = own 100 XYZ + sell the 30-day 105 call for **$0.71** (+$71). Protective put = buy the 30-day
  95 put for **$0.51** (−$51). Collar = both → **net credit $0.20**. Long call = buy the 30-day 100 call for $2.45. One-step tree:
  S = 100 → 120 or 80, K = 100: Δ = 0.5, price 10.00 at r = 0 (11.57 at r = 4%, T = 1).
- **Textbook check set** (only to let readers verify against Hull and other texts): S = K = 100, T = 1, r = 5%, σ = 20% → call
  **10.45**, put **5.57**. Say explicitly when you use it.
- **Crypto thread:** illustrative **BTC = $100,000** (always say “illustrative”), BTC implied vol ≈ 50% (illustrative); a 10× long perp
  at $100,000 with 0.5% maintenance margin liquidates near **$90,500** (`liqPrice(100000, 10, 0.005)`).
- Compute anything else with the engine, e.g.
  `node -e "import('./demos/_opt.js').then(O=>console.log(O.greeks({S:100,K:105,T:30/365,r:0.04,sigma:0.2,type:'call'})))"`.
  Round prices to cents and Greeks to 2–3 decimals; always say which inputs you used.

### 0.3 Voice and style

- **Expert-accurate, beginner-friendly.** Talk to one smart friend. Short sentences. Active voice. Concrete nouns.
- **Order inside a lesson:** hook → bridge → intuition (story/picture, no undefined jargon) → mechanics (precise, formulas, numbers,
  edge cases, state of play) → demo → analogy → misconceptions → takeaways → quiz → further reading → next.
- **Intuition must stand alone** for a beginner (readers can toggle “intuition only”). Put the heavy material in mechanics.
- **Every abstract claim gets a number example**: not “theta accelerates near expiry” but “the 30-day ATM call loses $0.044 a day; with
  one day left it loses $0.21 a day — five times faster”.
- Bold (`**…**`) key conclusions only (they render as highlighter marks) — not whole paragraphs.
- No filler or AI tone: never write “值得注意的是 / 让我们深入探讨 / 总之 / 不难发现 / 众所周知 / It's worth noting / Let's dive in / In
  conclusion / delve / crucial / robust / seamless / landscape / tapestry / game-changer”. No rhetorical-question chains. No emoji in prose.
- Chinese: full-width punctuation （，。：；！？） and curly quotes “ ”; English terms in parentheses the first time (隐含波动率（implied
  volatility, IV）); money as “2.45 美元” or “$2.45”. English: US spelling, sentence-case headings, serial comma.
- Chinese and English versions carry the **same content, structure, formulas, figures, callouts and quiz (same questions, same order,
  same correct option position)** — a faithful, natural rewrite, not word-for-word. The English file contains **zero Chinese characters**.
- Risk and balance: options and perps can lose money fast. Say so where relevant, without preaching. **No investment advice, no price
  predictions, no product endorsements.** Present contested topics (0DTE and market stability, dealer-gamma narratives, PFOF,
  tail-hedging value) with each side's strongest argument.

### 0.4 Facts discipline

- Anything that can change (volumes, market shares, product launches, rules, venue facts, dates after 2020, fund sizes) must come
  from `_research/facts.md` and be phrased “as of [date] / 截至 [日期]”. Respect its tags: **[UNVERIFIED]** → hedge (“reportedly”, “about”)
  or omit. Its **OLD-LESSON ERRORS** section lists mistakes in the old lessons — don't copy them.
- If a fact is not in facts.md and you are not certain, write it at order-of-magnitude level or leave it out. Never invent numbers,
  quotes, paper titles, dates or URLs.
- Formulas and numerical examples must be exactly right — compute them with `demos/_opt.js` (tested: `node tools/test_opt.mjs`).
- The old lessons (`content/lessons/stage*-*.js`, `content/lessons/en/stage*-*.js`) and old demos (`demos/*.js` other than `_opt.js`,
  `_viz.js`, and the new files) are raw material you may mine for ideas, facts (with dates) and demo code, but **rewrite everything**;
  they are deleted after the renewal. Old-to-new mapping: see §6.

---

## 1. Lesson file format

Each lesson = two files: `content/lessons/zh/<id>.md` and `content/lessons/en/<id>.md`. UTF-8, LF line endings.

```markdown
---
id: black-scholes
prereqs: binomial-trees, risk-neutral, random-walk
demo: black-scholes
---

# Black-Scholes 公式：逐项读懂

## @hook
One or two sentences (≤ 70 words / ≤ 120 字): the lesson's question and its punchline.

## @bridge
2–4 sentences: where we are in the story, what we just learned ([[previous-lesson]]), what question this lesson answers, and which
idea (① ② ③ ④) it builds.

## @intuition
Beginner-level explanation (the “picture”). May use ::demo[…], <figure>, callouts, gentle formulas.
End with a short map: “这一课拆成 N 块：” / “We'll take it in N parts:” followed by a list that mirrors the mechanics headings.

## @mechanics
### ① First sub-topic
…
### ② Second sub-topic
…
(3–7 “###” subsections, numbered ① ② ③ … in both languages; the last one is usually “state of play 2026” or “why it matters / connections”)

## @analogy
One everyday analogy (150–400 words / 250–600 字) that compresses the whole lesson into one picture — and where the analogy breaks.

## @misconceptions
- **“Myth stated as people say it.”** — Correction in 1–3 sentences.
(4–6 items)

## @takeaways
- One-sentence key point.
(3–6 items)

## @quiz
1. Question text?
   - [ ] wrong option
   - [x] correct option
   - [ ] wrong option
   - [ ] wrong option
   > Explanation shown after answering (why the right one is right and the tempting wrong one wrong).
(4–6 questions, exactly 4 options, exactly one [x]. The app shuffles options, so never refer to “option A/B”. Vary where you put [x].)

## @further
- [Label of resource](https://…) — one line on why it's worth reading.
(3–7 items, real URLs only: cboe.com, theocc.com, cmegroup.com, sec.gov, finra.org, investor.gov, optionseducation.org, papers on
 arxiv.org / ssrn.com / doi.org, textbooks' official pages, Wikipedia for classics, the sister courses below.)

## @next
One or two sentences that make the reader want the next lesson (the question it answers). Omit only in the very last lesson.
```

Front matter: `id` (= manifest id), `prereqs` (comma-separated ids that come **earlier**; may be empty), `demo` (main demo file name
without `.js`; comma-separate if more than one), optional `short: true` (welcome / cheat-sheet: lower length minimums, figure and inline
demo optional), optional `noformula: true` (topic genuinely has no display formula). The `# Title` line must equal the manifest title
(`title` for zh, `titleEn` for en) **character for character** (see `content/manifest.js`).

### 1.1 Markdown you can use (rendered by app.js)

- Paragraphs, `**bold**`, `*italic*`, `` `code` ``, `[text](https://…)`, `- lists`, `1. ordered lists` (one nested level via 2-space
  indent), `> quotes`, GFM `| tables |`, fenced ```` ```python ```` code blocks, `### h`, `#### h`.
- Inline tags allowed: `<sub> <sup> <kbd> <br> <mark> <small>`. Other inline HTML is escaped.
- **Lesson links:** `[[delta]]` renders as a chip with the stage number and the lesson title in the reader's language;
  `[[delta|custom text]]` uses your text. Use these, never “Stage 7.2 / 阶段 7.2”. Every lesson: **≥ 3 distinct links, at least one to an
  earlier lesson and one to a later lesson.** Only ids that exist in `content/manifest.js`.
- **Inline demo:** a line containing only `::demo[black-scholes-terms]` mounts `demos/black-scholes-terms.js` right there.
- **Callouts:** a quote whose first line is `> [!TYPE] optional title`:
  `KEY` core conclusion · `EXAMPLE` worked calculation · `THINK` pause-and-predict (put a line `> ---` between question and hidden
  answer; revealed on click) · `RECALL` link back to an earlier idea · `WARN` pitfall / risk · `HISTORY` story from the past · `DEEP`
  optional expert detail · `FACT` current state of play (dated) · `KAI` the running example · `FORMULA` formula card.
  Use **3–7 callouts per lesson**, including **at least one THINK** and, in lessons with numbers, at least one EXAMPLE.

```markdown
> [!THINK] XYZ doubles its volatility overnight. What happens to the price of the 30-day 100 call?
> Predict before you open the answer.
> ---
> It roughly doubles: near the money \(C \approx 0.4\,S\sigma\sqrt{T}\) is almost linear in σ — from $2.45 to about $4.73.
```

### 1.2 Formulas — the user's #1 request: “make formulas actual formulas”

Rendered with KaTeX (vendored). **Every formula and every calculation in prose must be real math**, never `code` or plain text.

- **Inline math:** `\( … \)`, e.g. `\(C = S\,\N(d_1) - Ke^{-rT}\N(d_2)\)`.
- **Display math:** its own paragraph between `$$` lines (may span several lines; use `\begin{aligned} … \end{aligned}` for derivations):
  ```markdown
  $$
  d_1 = \frac{\ln(S/K) + \left(r + \tfrac12\sigma^2\right)T}{\sigma\sqrt{T}}, \qquad d_2 = d_1 - \sigma\sqrt{T}
  $$
  ```
- **The dollar sign is money, not math.** Write money as `$2.45`, `$245 per contract`, `−$51` (a `$` is always followed by a digit).
  A single `$…$` is NOT math in this course — the checker rejects `$x$`, `$\sigma$`. Chinese prose prefers “2.45 美元”.
- **Right after every display formula**, explain it: a “where” line or list for each symbol in plain words, then plug in real numbers
  (an `> [!EXAMPLE]` callout is ideal). A formula without a legend and a worked number is not allowed.
- **Notation (use consistently):** \(S\) spot, \(S_T\) price at expiry, \(K\) strike, \(T\) time to expiry in years, \(t\) time, \(r\)
  risk-free rate, \(q\) dividend yield, \(\sigma\) volatility, \(C, P\) call/put price, \(V\) any option value, \(F\) forward,
  \(\Delta, \Gamma, \Theta, \nu\) (vega), \(\rho\), \(d_1, d_2\), \(\N(\cdot)\) standard-normal CDF (macro `\N`), \(\varphi(\cdot)\) its density,
  \(\E\) expectation, \(\Q\) / \(\P\) risk-neutral / real-world measure, `\dd t` for a differential, `\IV` = \(\sigma_{\text{imp}}\),
  `\RV` = \(\sigma_{\text{real}}\), \(\Pi\) profit/loss. Words inside math go in `\text{…}` (Chinese too: `\text{到期}`). Use `\times`,
  `\approx`, `\dfrac` for important inline fractions, `1{,}000` for thousands, `\%` for percent (a bare `%` is a LaTeX comment and is
  rejected), `\max(\cdot)`, `\ln`, `\underbrace{…}_{\text{…}}` to annotate terms. No Unicode super/subscripts (², ₁) inside math.
- Worked calculations are math too: write `\(2.45 \times 100 = \$245\)` (inside math a dollar sign is `\$`), not “2.45 × 100 = $245”.
- Aim: ≥ 2 display formulas in every Principles/Strategy/Markets/Mastery lesson where the topic has math; Beginner lessons use 1–2
  gentle ones. The checker type-checks every formula: `node tools/check.mjs <id>`.

### 1.3 Figures (inline SVG diagrams) — at least one per lesson, ideally 2–3

A `<figure>` block in the Markdown: start `<figure>` at the beginning of a line; the block ends at its matching `</figure>`.
**No blank lines inside the figure.** Colours only via these classes (never `#hex`, never `style=` colours):

- shapes: `fx-box` (neutral card), `fx-box2` (grey card), `fx-hl` (brand blue), `fx-ok` (green), `fx-bad` (red), `fx-blue` (violet),
  `fx-btc` (bitcoin orange), `fx-gold`; solid fills `fx-fill-orange|green|red|blue|btc|muted|ink` (orange = brand blue);
  soft areas `fx-area-ok|bad|hl|blue` (profit / loss / highlight regions under curves)
- lines: `fx-line` (thin ink), `fx-line-thick` (payoff curves), `fx-line-hl`, `fx-line-ok`, `fx-line-bad`, `fx-line-blue`, `fx-line-btc`,
  `fx-line-muted`; add `fx-dash` for dashed; `fx-grid`, `fx-axis`
- text: `fx-t` (13px), `fx-t-b` (bold), `fx-t-sm` (11px muted), `fx-t-hl`, `fx-t-ok`, `fx-t-bad`, `fx-t-blue`, `fx-t-btc`, `fx-t-inv`
  (white on dark fills), `fx-mono`
- arrowheads: define a marker per SVG with an id **starting with your lesson id**, path class `fx-arrowhead` (or `fx-arrowhead-hl`):

```html
<figure>
<svg viewBox="0 0 640 220" role="img" aria-label="Long call payoff">
<defs><marker id="call-option-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="40" y1="150" x2="610" y2="150" class="fx-axis" marker-end="url(#call-option-ah)"/>
<polygon points="330,150 600,30 600,150" class="fx-area-ok"/>
<polyline points="40,175 330,175 600,30" class="fx-line-thick"/>
<text x="330" y="195" text-anchor="middle" class="fx-t-sm">K = 100</text>
</svg>
<figcaption>Figure 1 · Caption in the lesson's language — say what to notice. Inline math like \(K + c\) works here.</figcaption>
</figure>
```

- `viewBox` width 600–720; text ≥ 11 units; label everything in the lesson's language. The figure scales; on phones it scrolls sideways.
- Good figure types for options: payoff diagrams with profit/loss areas, before/after-expiry curves, number lines with ITM/OTM zones,
  trees, cash-flow/timeline diagrams, replication "equals" pictures (portfolio A = portfolio B), 2×2 grids, distributions with shaded
  regions, Greek curves, flow diagrams (order flow → dealer → hedge), waterfalls (liquidation → insurance fund → ADL), surfaces as
  small multiples. A figure must teach something the text alone doesn't. Caption it with what to notice.
- Draw curves with correct shapes (compute the points with the engine if needed — `node -e` and paste the polyline).

### 1.4 Length and depth

- zh: intuition + mechanics + analogy ≥ **2,400 Chinese characters** (counted without display formulas, code and SVG; typical 2,800–4,500).
  en: ≥ **1,700 words** (typical 2,000–3,200). `short: true` lessons ≥ 1,500 字 / 1,000 words. ★★★ lessons sit at the upper end. Depth
  comes from clear explanation, worked numbers, figures and demos — not padding.
- Depth ladder inside mechanics: first subsection = the core mechanism precisely; middle = details, variants, edge cases with numbers;
  last = “state of play (2026)” (dated facts) or “why it matters / how it connects”.
- Expert detail worth including where relevant: exact contract rules, formula derivations (in DEEP callouts), known failure cases and
  historical episodes, current market structure (from facts.md), open research.

---

## 2. Demos — `demos/<name>.js`

```js
// Every demo: default-export mount(root, lang). Bilingual. Computes for real with the engine. No network. No hex colours.
import * as O from "./_opt.js";
import { lineChart, payoffChart, seg, onSeg, slider, bindSliders, stats, tex, fmt } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("标题", "Title")}</div>
    …
    <p class="demo-tip">${T("看什么：…", "What to notice: …")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);   // ALWAYS query inside root (several demos can be on one page)
  …
}
```

Rules:
- **Naming (prevents collisions between parallel writers):** the main demo is `<lesson-id>.js`; inline demos are
  `<lesson-id>-<suffix>.js`, where `<lesson-id>` is one of *your* lessons and the full name is not another lesson's id. Never edit
  files you don't own (you may read and copy code from old demos).
- The **main demo** (front-matter `demo:`) is the lesson's big hands-on sandbox, shown under “Try it yourself” after mechanics (unless you
  also place it inline with `::demo[…]`, then it appears only there). Add **1–2 small inline demos** (`::demo[…]`) inside intuition or
  mechanics where interacting beats reading (sliders that move a formula's variables, a step-through, a mini-simulation). Target per
  lesson: **1 main + 1–2 inline**.
- **Compute with the shared engine** — `demos/_opt.js` (tested; read it once before you start):
  - normal: `normCdf, normPdf, normInv`
  - Black-Scholes: `bsPrice({S,K,T,r,q,sigma,type}), bsCall(S,K,T,r,sigma,q), bsPut(…), d1d2(o), greeks(o)` → `{price, delta, gamma,
    vega (per vol pt), theta (per day), rho (per 1%), vegaRaw, thetaYear, rhoRaw, vanna, volga, charm, speed, d1, d2, probITM, dualDelta}`,
    `impliedVol(price, o)`, `black76({F,K,T,r,sigma,type})`, `bachelier({F,K,T,r,sigmaN,type})`, `digital(o)`
  - no-arbitrage: `forward, discount, intrinsic, parityGap, putFromCall, callFromPut, bounds(o)`
  - probability: `expectedMove(S,σ,T), straddleApprox, probAbove(S,K,T,σ,μ), probTouch(S,H,T,σ,μ), lognormalPdf(x,S,T,σ,μ)`
  - positions: legs `{type:"call"|"put"|"stock"|"cash", side:"long"|"short", K, qty, premium, entry, T, sigma}` →
    `legPL(leg,S), netPL(legs,S), netPayoff(legs,S), netPLAt(legs,S,{elapsed,sigma,r,q}), positionGreeks(legs,S,{…}), payoffStats(legs,lo,hi)`
    → `{breakevens, maxProfit, maxLoss, slopeRight, slopeLeft, atZero}` (±Infinity when unbounded)
  - trees: `oneStep({S,K,u,d,r,T,type})` → `{delta, bond, q, price, priceRN,…}`, `binomial({S,K,T,r,q,sigma,type,steps,american,keepTree})`
    → `{price, delta, gamma, theta, u, d, p, tree}`
  - simulation: `rng(seed)` (deterministic; `.normal()`), `gbmPath(R,S0,mu,sigma,T,steps)`, `mcEuropean({…,paths,seed,antithetic,payoff})` →
    `{price, se}`, `mcPath({S,T,r,q,sigma,steps,paths,seed,payoffFn})`, `hedgeSim({S0,K,T,r,sigmaImp,sigmaReal,steps,seed,mu})` →
    `{pnl, path, series}`
  - numerics & exotics: `fdPrice({…,M,N,american,scheme:"explicit"|"implicit"|"cn"})` → `{price, grid}`, `asianGeometric(o)`,
    `downOutCall({S,K,H,T,r,q,sigma})`
  - volatility: `logReturns, realizedVol(prices, ppy), parkinsonVol(highs,lows), ewmaVol(returns, λ), garch11(returns,{omega,alpha,beta})`
    → `{variances, next, longRun, forecast(h)}`, `varianceFromStrip({strikes,quotes,F,T,r})`, `otmStrip({S,T,r,q,strikes,volAt})`,
    `rndFromCalls(callAt,K,T,r,h)`, `sviW, sviVol, sviG`, `sabrVol({F,K,T,alpha,beta,rho,nu})`,
    `hestonPrice({S,K,T,r,q,v0,kappa,theta,xi,rho,type})` (≈ 4–7 ms per price — cache, don't call it hundreds of times per input event)
  - sizing: `kellyFraction(p,b), kellyGrowth(f,p,b)`
  - futures & perps: `futuresFair, annualizedBasis, fundingRate(premiumIndex, interest=0.0001, clamp=0.0005), fundingPayment, fundingAPR,
    liqPrice(entry, leverage, mmr, side), linearPnL, inversePnL`
  - formatting: `fmt(x,d), fmtUsd, fmtPct, fmtSigned, fmtBig, clamp, range(lo,hi,n)`; constants `MULT = 100`, `DAYS = 365`, `XYZ`
  - math: `tex(latex, display)` returns typeset HTML (also exported from `_viz.js`)
- **Charts and controls** — `demos/_viz.js`:
  - `lineChart({series:[{points|f, cls:0–5, label, dashed, area, dots}], xmin, xmax, ymin, ymax, logY, xlabel, ylabel, xfmt, yfmt, xstep,
    markers:[{x,label}], hlines:[{y,label}], points:[{x,y,label,cls}], bands:[{x0,x1,cls,label}], W, H})` → HTML.
    Colours: 0 brand blue · 1 violet · 2 red · 3 green · 4 bitcoin orange · 5 grey.
  - `barChart({bars:[{label,value,cls}], yfmt, xlabel, ymin, ymax})` (negative values fine)
  - `payoffChart({legs, lo, hi, spot, today:{elapsed,sigma,r,q}|null, mult, xlabel, ylabel, labels:{expiry,today,spot,be}, extra:[{f,cls,label,dashed}]})`
    → `{html, stats}` — green profit / red loss areas, strikes, breakevens, spot, optional dashed “today” curve.
  - `seg(name, [[value,label]…], active)` + `onSeg(root, name, cb)`; `slider(id, label, min, max, step, value)`;
    `bindSliders(root, {id: formatter}, update)` (wires sliders, fills the live value, calls update with numbers);
    `stats([[label, value, "pos"|"neg"|"acc"]])`; `mathLine(latex)`; `fmt`, `texNum`, `esc`.
- **Math in demos:** `tex(String.raw`\Delta = ${d.toFixed(3)}`)` — inside `String.raw` write single backslashes; in normal strings you
  would need doubled ones (the checker flags mistakes). Show the live formula with the live numbers whenever a demo computes one.
- CSS classes available (styles.css): `.demo .demo-head .demo-block .demo-label .demo-row .demo-grid .demo-grid-3 .demo-field .demo-slider
  .demo-seg .demo-btn(.on) .demo-btns .demo-inp .demo-sel .demo-out .demo-out-sm .demo-log(.ok/.bad/.warn) .demo-tip .demo-meta .demo-math
  .demo-bar .demo-warn .stat-row .stat(.k/.v; .v.pos/.neg/.acc) .kv(.k/.v/.v.hl) .tag(.ok/.bad/.hl) .pill(.ok/.bad) .cmp .cmp-3 .cmp-cell(.hl/.cold)
  .scn .scn-q .scn-meta .bar2(.lab/.track/.fill/.val) .strip .strip-cell(.on/.win/.lose) .tl .tl-item(.when) .legs .leg(.side-long/.side-short)
  .term .detail .risk-note .chart .chart-legend`, plain `<table>` inside `.demo` (rows `.hl`, `.itm`). Inline styles are OK but colours must be
  CSS variables: `var(--orange)` (brand blue), `var(--orange-ink)`, `var(--orange-soft)`, `var(--blue)` (violet), `var(--green)`, `var(--red)`,
  `var(--btc)`, `var(--gold)`, `var(--muted)`, `var(--ink)`, `var(--surface)`, `var(--surface-2)`, `var(--paper)`, `var(--line)`, `*-soft`.
  For SVG you draw yourself, use `fx-*` classes or the chart classes.
- UX: responsive (works at 360 px), keyboard-usable buttons, no `alert()`, no `document.getElementById`/`document.querySelector` (use
  `root.querySelector`), unique id prefixes, no top-level `window`/`document` access (demos are imported by Node checkers), no timers left
  running (check `root.isConnected` in loops). Heavy loops (Monte Carlo) run on a button press or are sized to finish in < 50 ms.
- End every demo with one `.demo-tip` sentence: what to try and what to notice.

---

## 3. Glossary proposals

Write 6–15 important terms for your lessons into the file named in your assignment (e.g. `content/glossary-proposals/stage7.json`):

```json
[{"zh":{"terms":["隐含波动率","IV"],"def":"一句话释义（不含英文直引号）"},"en":{"terms":["implied volatility","implied vol","IV"],"def":"One-sentence definition."}}]
```

Terms get a dotted underline + hover card the first time they appear in a lesson. Chinese terms must be specific (“隐含波动率”, not
“波动”). English: include singular/plural variants. Definitions ≤ 2 sentences, beginner-friendly. Don't propose generic words
(option, price, call, put).

---

## 4. Checks (run until clean)

```bash
node tools/check.mjs <lesson-id> [<lesson-id> …]     # structure, links, lengths, figures, every formula (KaTeX), the $-rule, demos
node tools/smoke.mjs <demo-name> [<demo-name> …]     # mounts demos in a fake DOM (zh + en), clicks buttons, moves sliders
node tools/test_opt.mjs                               # engine self-test (must stay green)
# visual review (server on :8780): tools/figview.html?ids=a,b&lang=zh shows every figure of those lessons;
# tools/demoview.html?names=x,y&lang=en mounts demos in a column — screenshot both with chrome-headless-shell
# (tall viewport at scroll 0; scrolled captures come out black on this machine), at 1320 px and 390 px.
```

`tools/smoke.mjs` catches exceptions, `undefined`/`NaN` in output, a missing `.demo-tip`, and Chinese text in the English mount.
**Do not use the browser tools** (many writers work in parallel); the lead editor checks every page visually afterwards.
Zero errors required. Warnings are advice — fix them unless you have a reason. Self-review:
- [ ] Hook states the question; bridge links back and names the idea(s) ①②③④.
- [ ] Concrete example before every abstraction; every display formula has a legend + a worked number.
- [ ] ≥ 1 figure, 1 main demo + 1–2 inline demos, 3–7 callouts incl. a THINK.
- [ ] Numbers recomputed with `_opt.js`; current facts only from facts.md, dated.
- [ ] zh and en match in structure, formulas, figures, quiz; en has no Chinese; `$` only for money.
- [ ] Quiz questions test understanding (not trivia); wrong options are plausible; explanations teach.

---

## 5. Blueprint — every lesson's scope

Format: **id** — must cover · *formulas* · *figures* · *demos (main = `<id>.js`; inline ideas)* · *links*. “Must cover” is the minimum; add
what an expert would expect. Keep each lesson focused on its question and hand off to the linked lessons. Idea tags ①②③④ = §0.1.

### Tier 1 · Beginner — Reading Options

**Stage 0 · Why Options Exist**
- **welcome** (`short: true`) ①④ — Kai owns 100 XYZ at $100; earnings in three weeks; three wishes (protect, earn income, bet on a big
  move with a capped loss) → three option shapes. One-sentence definition: the *right, not the obligation*, to buy/sell at a fixed price
  until a date, for a premium. The four ideas as the map of the course; the five tiers; how to use a lesson (bridge, intuition-only
  toggle, callouts, inline demos, quiz, goal filter). Education, not advice. · *formulas:* \(\max(S_T - K, 0)\) gently; ×100. ·
  *figures:* Kai's three wishes → three shapes; the course map (tiers → stages). · *demos:* `welcome` = what each choice does to Kai at
  expiry (shares only / + 95 put / + 105 short call / a 100 call instead of shares) with an S_T slider; inline `welcome-ideas` (click an
  idea → which stages build it). · *links:* derivatives, call-option, put-option, payoff-diagrams, black-scholes, greeks-map, capstone.
- **derivatives** ②④ — value derived from an underlying; forwards (lock a price), futures (standardised, exchange, daily margin),
  options (right, not obligation), swaps briefly, perps (preview); zero-sum between the two sides; hedgers, speculators, arbitrageurs;
  notional vs premium; counterparty risk and clearing (OCC as central counterparty); history: Thales and the olive presses, Dojima rice
  futures (1730), CBOE opens 1973 (facts). · *formulas:* forward P&L \(\Pi = S_T - F\) and short side \(F - S_T\); sum = 0. · *figures:*
  family tree of derivatives; forward P&L lines for both sides. · *demos:* `derivatives` = a farmer and a baker agree a forward at 100:
  slide the harvest price, see each side's P&L and that they sum to zero; inline `derivatives-family` (match products to features). ·
  *links:* welcome, why-options, linear-vs-convex, futures-basis, what-is-perp, market-makers.
- **why-options** ①④ — four uses: insurance (protective put), leverage (call vs stock), income (selling premium), optionality
  (asymmetric bets; options embedded in convertibles, employee stock options, “real options”). Who takes the other side and why (the
  insurer's logic: premium = price of risk). What it costs: premium, time decay, spreads. · *formulas:* return on premium
  \(\frac{\max(S_T-K,0) - c}{c}\) vs stock return \(\frac{S_T - S_0}{S_0}\); insurance cost as % of the position. · *figures:* 2×2
  (buy/sell × protect/speculate). · *demos:* `why-options` = $245 in one 30-day 100 call vs $10,000 in 100 shares vs $245 in shares for
  XYZ moves −20%…+20% (return % and $); inline `why-options-insurance` (what the 95 put costs vs what it saves in a −15% drop). ·
  *links:* derivatives, linear-vs-convex, protective-put-collar, covered-call, long-options, probability-ev.
- **linear-vs-convex** ①③ — stock and futures P&L are straight lines (Δ = 1); options are kinked → convex; convexity = gains
  accelerate, losses decelerate; you pay for convexity (premium, theta). Jensen's inequality: \(\E[\max(S_T-K,0)] \ge \max(\E[S_T]-K,0)\)
  → uncertainty itself makes options valuable — the seed of Idea ③. · *formulas:* linear \(\Pi = S_T - S_0\); convex \(\max(S_T-K,0)-c\);
  Jensen for convex \(f\): \(\E[f(X)] \ge f(\E[X])\). · *figures:* line vs hockey stick; Jensen with two outcomes (80/120 → average 100). ·
  *demos:* `linear-vs-convex` = two-outcome world with a spread slider: expected payoff of stock stays flat, the call's grows with the
  spread; inline `linear-vs-convex-jensen`. · *links:* why-options, payoff-diagrams, gamma, implied-vol, perps-vs-options.

**Stage 1 · Anatomy of an Option**
- **call-option** ① — right to buy at K until expiry; payoff \(\max(S_T-K,0)\); P&L; breakeven \(K + c\); XYZ 30-day 100 call $2.45
  ($245), 105 call $0.71; limited loss, open upside; the seller's obligation; exercise decision at expiry. · *figures:* timeline (buy
  → wait → decide); payoff hockey stick with profit/loss areas. · *demos:* `call-option` (pick strike, slide S_T, see decision + P&L per
  share and per contract); inline `call-option-decide` (exercise or not? cards). · *links:* welcome, put-option, contract-specs,
  payoff-diagrams, long-options, black-scholes.
- **put-option** ① — right to sell at K; payoff \(\max(K-S_T,0)\); max gain \(K - p\) (price can't go below 0); the put as insurance;
  XYZ 30-day 95 put $0.51, 100 put $2.12; Kai's floor. · *figures:* put payoff; stock + put = floor. · *demos:* `put-option`; inline
  `put-option-floor`. · *links:* call-option, four-positions, protective-put-collar, put-call-parity.
- **contract-specs** — underlying, strike grid, expiry (standard monthly = third Friday, weeklies, dailies), premium quoted per share ×
  100, style (American/European), settlement (physical/cash), adjustments (splits, special dividends), OCC OSI symbology
  (root + YYMMDD + C/P + strike × 1000 in 8 digits, e.g. `XYZ   261016C00105000`). · *formulas:* cost = premium × 100 × contracts;
  notional = \(S \times 100\). · *figures:* anatomy of an OSI symbol; an annotated chain row. · *demos:* `contract-specs` (OSI builder /
  parser); inline `contract-specs-notional` (premium vs notional controlled). · *links:* call-option, option-chain, exercise-assignment,
  product-map, zero-dte.
- **moneyness** ① — ITM/ATM/OTM for calls and puts; measures: \(S/K\), log-moneyness \(\ln(K/F)\), standardised
  \(\frac{\ln(K/F)}{\sigma\sqrt T}\), delta as moneyness (“25-delta put”); why OTM options are cheap. · *figures:* number line with
  ITM/OTM zones for calls vs puts. · *demos:* `moneyness` (slider S; strike grid 80–120 coloured); inline `moneyness-z` (same strike, more
  or fewer σ away as T changes). · *links:* call-option, put-option, intrinsic-time-value, delta, smile-skew.
- **intrinsic-time-value** ①③ — premium = intrinsic + time value; time value is largest ATM, → 0 at expiry, grows with σ and √T;
  ATM rule \(C \approx 0.4\,S\sigma\sqrt T\) (30-day: \(0.4 \times 100 \times 0.2 \times 0.287 = 2.29\) vs exact 2.45 — the gap is
  interest); negative time value for deep-ITM European puts when r > 0 (DEEP). · *formulas:* \(C = \underbrace{\max(S-K,0)}_{\text{intrinsic}} + \underbrace{\text{TV}}_{\text{time value}}\). ·
  *figures:* price curve over the hockey stick with time value shaded. · *demos:* `intrinsic-time-value` (stacked bars across strikes;
  days slider); inline `intrinsic-time-value-sqrt` (ATM time value vs days, √T shape). · *links:* moneyness, before-expiry, theta,
  black-scholes, american-exercise.
- **four-positions** ①④ — long/short call, long/short put; mirror images; zero-sum; risk profiles (short call: unlimited loss; short
  put ≈ agreeing to buy at \(K - p\)); margin preview. · *figures:* 2×2 of shapes. · *demos:* `four-positions` (toggle each: payoff, max
  gain/loss, who wins where); inline `four-positions-mirror` (buyer + seller P&L = 0 at every price). · *links:* call-option, put-option,
  payoff-diagrams, margin-approval, cash-secured-put.

**Stage 2 · Payoff Diagrams: The Language of Options**
- **payoff-diagrams** ① — axes; payoff vs P&L (premium shifts the curve); kinks at strikes; slope = net number of calls/puts
  (+ stock); reading any diagram in five steps; per share vs per contract. · *figures:* annotated diagram (kink, slope, max loss, BE). ·
  *demos:* `payoff-diagrams` (guess-the-position game over 8 shapes); inline `payoff-diagrams-read` (hover a price → P&L). · *links:*
  four-positions, breakeven-returns, payoff-lego, before-expiry, strategy-matrix.
- **breakeven-returns** ① — breakevens (call \(K+c\), put \(K-p\), spreads), max profit/loss, return on risk, return on capital,
  annualised return for income trades \((1+R)^{365/d}-1\) (with the caveat that it assumes repetition). · *figures:* diagram with BE,
  max P/L annotated. · *demos:* `breakeven-returns` calculator; inline `breakeven-returns-annualize`. · *links:* payoff-diagrams,
  probability-ev, covered-call, vertical-spreads.
- **payoff-lego** ①② — payoffs add; stock = long call − long put + bond (parity preview); build straddles, spreads, collars from
  pieces; slopes add; any piecewise-linear payoff from calls (and why butterflies are “bricks”). · *formulas:*
  \(\Pi(S_T) = \sum_i n_i\,\pi_i(S_T)\). · *figures:* two diagrams stacking into one. · *demos:* `payoff-lego` builder (add/remove legs);
  inline `payoff-lego-target` (build the target shape challenge). · *links:* payoff-diagrams, put-call-parity, synthetics-boxes,
  butterfly, strategy-matrix.
- **before-expiry** ①③④ — today's P&L curve vs the expiry hockey stick; the curve sits above for long options (time value) and
  converges as expiry nears; three forces: price, time, volatility (preview of Greeks); “the stock went up but my call lost money” (theta
  or IV crush). · *formulas:* \(V(S,t) \ge \max(S-K,0)\) for a call (no dividends); preview
  \(\dd V \approx \Delta\,\dd S + \Theta\,\dd t + \nu\,\dd\sigma\). · *figures:* curves for 30/14/3/0 days. · *demos:* `before-expiry`
  (days slider moves the curve; IV slider); inline `before-expiry-surprise` (stock up, option down scenario). · *links:*
  intrinsic-time-value, payoff-diagrams, greeks-map, theta, earnings-events.
- **probability-ev** ①③ — P(ITM), P(profit), expected value; the lognormal distribution; expected move \(S\sigma\sqrt T\); cheap
  OTM calls = lottery tickets (big multiple, small probability); short options: high win rate, fat left tail; risk-neutral vs real-world
  probabilities (preview); delta ≠ probability (preview). · *formulas:* \(P(S_T > K) = \N(d_2)\) under the chosen drift; EV. · *figures:*
  distribution under the payoff with the ITM region shaded. · *demos:* `probability-ev` (distribution + payoff overlay; P(ITM), P(profit),
  EV under a drift slider); inline `probability-ev-lottery` (1,000 simulated OTM-call trades → distribution of outcomes). · *links:*
  payoff-diagrams, random-walk, risk-neutral, delta, variance-risk-premium.

**Stage 3 · Markets & Mechanics**
- **option-chain** — layout (calls | strike | puts), bid/ask/last/mark, volume, OI, IV and delta columns, expiry tabs; reading the XYZ
  chain; mid price; parity visible across a row. · *figures:* annotated chain. · *demos:* `option-chain` (interactive XYZ chain from BS
  with realistic spreads; click a row for details); inline `option-chain-find` (find the 25-delta put, the expected move). · *links:*
  contract-specs, liquidity-spreads, implied-vol, put-call-parity, delta.
- **liquidity-spreads** — spread cost (absolute and % of mid), round-trip cost, volume vs open interest (how OI changes with
  open/close), liquidity by strike and expiry; SPX/SPY vs thin single names; how to judge a tradeable contract. · *formulas:* spread %
  \(= \frac{\text{ask}-\text{bid}}{\text{mid}}\); round-trip cost. · *figures:* OI change table (who opens/closes). · *demos:*
  `liquidity-spreads` (edge vs round-trip cost); inline `liquidity-spreads-oi` (OI ledger). · *links:* option-chain, orders,
  market-makers, execution-tca.
- **orders** — buy/sell to open/close; market vs limit; working the mid; multi-leg orders and net debit/credit; time-in-force; why stop
  orders on options are dangerous; rolling; routing and PFOF (brief, facts). · *figures:* order ticket anatomy; position life cycle
  (open → close / exercise / assignment / expire). · *demos:* `orders` (order-ticket simulator against a simulated book); inline
  `orders-legging` (legging risk vs a spread order). · *links:* liquidity-spreads, exercise-assignment, vertical-spreads, execution-tca,
  first-trade.
- **exercise-assignment** ②④ — American vs European; exercise through the OCC; random assignment; auto-exercise threshold (facts);
  expiration-day timeline; physical vs cash settlement; AM vs PM settlement for SPX; early exercise for dividends (calls) and deep ITM
  puts; pin risk and after-hours moves. · *formulas:* exercise a call just before ex-dividend roughly when \(D > \text{time value}\) of the
  call (with interest \(K(1-e^{-r\tau})\) as DEEP). · *figures:* expiration-day timeline. · *demos:* `exercise-assignment` (close price,
  after-hours move, decisions → resulting positions); inline `exercise-assignment-dividend`. · *links:* contract-specs, product-map,
  american-exercise, common-traps, rho-carry.
- **margin-approval** ④ — approval levels (typical 1–4); cash vs margin accounts; Reg T for naked short options (the standard CBOE
  formula — check facts.md), spreads = width; portfolio margin (risk-based scenarios, ±15% for single stocks, a narrower −8%…+6% range for broad-based indexes) and eligibility
  (facts); buying power, margin calls, forced liquidation; crypto venues preview. · *formulas:* naked short put requirement as in facts.md;
  spread requirement \(= (K_2-K_1)\times 100\). · *figures:* requirement comparison bars. · *demos:* `margin-approval` (calculator: naked
  put vs CSP vs spread vs PM scenario); inline `margin-approval-levels`. · *links:* four-positions, cash-secured-put, portfolio-risk,
  margin-liquidation, broker-platform.
- **product-map** — stock options (American, physical); ETF options (SPY/QQQ/IWM); index options (SPX European cash-settled, XSP, NDX,
  RUT); VIX options; futures options; weeklies/dailies and 0DTE preview; crypto options (Deribit, IBIT options, CME) preview; US tax note
  for index options (Section 1256, not advice); trading hours; how to choose. Table. · *figures:* product map grid. · *demos:*
  `product-map` (selector wizard); inline `product-map-compare` (SPX vs SPY for the same notional). · *links:* contract-specs,
  exercise-assignment, zero-dte, crypto-options, vix.

### Tier 2 · Principles — Pricing, Volatility & the Greeks

**Stage 4 · No-Arbitrage: Pricing Without a Model**
- **price-drivers** ②③ — S, K, T, σ, r, q: direction for calls and puts (table), intuition for each; σ is the only unobservable one.
  · *formulas:* sign table (\(\partial C/\partial S > 0\), …). · *figures:* six dials. · *demos:* `price-drivers` (six sliders, BS price,
  arrows); inline `price-drivers-which` (sensitivity bars: which input matters most right now). · *links:* intrinsic-time-value,
  arbitrage-bounds, black-scholes, greeks-map, implied-vol.
- **arbitrage-bounds** ② — the no-free-lunch principle; \(\max(Se^{-qT}-Ke^{-rT},0) \le C \le Se^{-qT}\); put bounds; monotone in K;
  convex in K (butterfly ≥ 0); calendar monotonicity (American, no dividends); one worked arbitrage with the exact trade; why bounds are
  wide → we need a model. · *formulas:* all bounds; convexity \(C(K_1) - 2C(K_2) + C(K_3) \ge 0\) for equal spacing. · *figures:* the
  allowed region for a call price vs S. · *demos:* `arbitrage-bounds` (enter quotes → violations + the trade); inline
  `arbitrage-bounds-region`. · *links:* price-drivers, forwards-carry, put-call-parity, butterfly, risk-neutral-density, surface-calibration.
- **forwards-carry** ② — forward price by replication \(F = Se^{(r-q)T}\); cost of carry (financing minus dividends/borrow); discrete
  dividends \(F = (S - PV(D))e^{rT}\); F is the centre of the option world (ATM-forward); implied forward from parity; hard-to-borrow
  stocks. · *figures:* cash-and-carry cash flows. · *demos:* `forwards-carry` (replicate a forward; arbitrage a mispriced one); inline
  `forwards-carry-divs`. · *links:* arbitrage-bounds, put-call-parity, futures-basis, rho-carry, basis-trades.
- **put-call-parity** ② — \(C - P = Se^{-qT} - Ke^{-rT}\); proof with two portfolios (call + cash vs put + stock); XYZ 1-year
  \(9.93 - 6.00 = 3.93 = 100 - 96.08\); implied forward and implied borrow; conversions/reversals; American inequality; why the call-vs-put
  choice is a financing choice. · *figures:* two portfolios, same payoff. · *demos:* `put-call-parity` (explorer + violation finder);
  inline `put-call-parity-payoffs`. · *links:* payoff-lego, forwards-carry, synthetics-boxes, binomial-one-step, risk-neutral.
- **synthetics-boxes** ② — synthetic long stock (long call + short put), synthetic calls/puts, conversions and reversals (how
  dealers enforce parity), the box spread as a loan (SPX boxes used for financing), implied box rate; American-style boxes and early
  assignment (the 2019 retail box-spread blow-up — check facts, hedge if unverified); jelly roll briefly. · *formulas:* box value
  \((K_2-K_1)e^{-rT}\); implied rate \(r = -\frac{1}{T}\ln\frac{\text{box price}}{K_2-K_1}\). · *figures:* box = bull call spread + bear
  put spread. · *demos:* `synthetics-boxes` (box-rate calculator vs T-bill; synthetic builder); inline `synthetics-boxes-assign`. ·
  *links:* put-call-parity, payoff-lego, exercise-assignment, vertical-spreads, forwards-carry.

**Stage 5 · From Binomial Trees to Black-Scholes**
- **binomial-one-step** ② — S = 100 → 120 or 80; replicate the call with Δ shares + borrowing; \(\Delta = \frac{V_u - V_d}{S_u - S_d} = 0.5\);
  price 10 at r = 0 (11.57 at r = 4%, T = 1); **the real up-probability never enters**; hedge ratio; \(q = \frac{e^{rT}-d}{u-d}\). ·
  *figures:* one-step tree with the replicating portfolio. · *demos:* `binomial-one-step` (u, d, r, real-world p sliders — price ignores
  p); inline `binomial-one-step-replicate` (build the portfolio by hand). · *links:* put-call-parity, risk-neutral, binomial-trees, delta,
  delta-hedging.
- **risk-neutral** ②③ — ℚ vs ℙ; price = discounted expected payoff under ℚ; it does *not* assume investors are risk-neutral; why μ
  disappears (it is hedged away); real-world probabilities differ (VRP preview); Girsanov as a DEEP callout. · *formulas:*
  \(V_0 = e^{-rT}\E^{\Q}[V_T]\); drift change μ → r. · *figures:* ℙ (drift μ) vs ℚ (drift r) distributions. · *demos:* `risk-neutral`
  (Monte Carlo with a μ slider: real-world expected payoff moves, the hedged price doesn't); inline `risk-neutral-drift`. · *links:*
  binomial-one-step, binomial-trees, black-scholes, risk-neutral-density, variance-risk-premium.
- **binomial-trees** ② — CRR \(u = e^{\sigma\sqrt{\Delta t}}\), \(d = 1/u\); recombining trees; backward induction; convergence to BS
  (with oscillation); American exercise check at each node; Greeks from the tree. · *formulas:* CRR parameters; node recursion
  \(V = e^{-r\Delta t}[qV_u + (1-q)V_d]\). · *figures:* 3-step tree with prices and values. · *demos:* `binomial-trees` (draw 1–6 steps,
  compute up to 1,000; American toggle; highlight early-exercise nodes); inline `binomial-trees-converge` (price vs steps). · *links:*
  binomial-one-step, risk-neutral, black-scholes, american-exercise, finite-difference.
- **random-walk** ③ — returns, not prices; log returns; geometric Brownian motion; lognormal (skewed, never below 0); variance ∝ T
  → σ√T; annualising (√252 trading days vs √365 calendar days — say which); daily vol \(20\%/\sqrt{252} \approx 1.26\%\); the rule of 16;
  volatility drag \(\mu - \tfrac12\sigma^2\); fat tails preview. · *formulas:* \(\dd S = \mu S\,\dd t + \sigma S\,\dd W\);
  \(\ln S_T \sim \mathcal{N}\big(\ln S_0 + (\mu - \tfrac12\sigma^2)T,\ \sigma^2 T\big)\). · *figures:* fan of paths + the widening √T cone. ·
  *demos:* `random-walk` (path simulator with the ±1σ, ±2σ cone); inline `random-walk-sqrt` (distribution width vs T). · *links:*
  probability-ev, black-scholes, realized-vol, monte-carlo, bs-assumptions.
- **black-scholes** ②③ — **golden example (already written)**.
- **bs-assumptions** ②③④ — the list (constant σ, GBM without jumps, continuous frictionless hedging, constant r, known q, lognormal)
  and each failure: fat tails (19 October 1987: about −20% in a day), jumps, vol clustering, discrete-hedging error (∝ \(1/\sqrt{N}\)),
  transaction costs, the smile. Why BS survives: a quoting language (IV) and a risk language (Greeks). Bachelier/normal model (negative
  prices, e.g. oil in April 2020; short-dated options); Merton jump-diffusion preview. · *formulas:* discrete-hedging error
  \(\approx \sqrt{\pi/4}\,\nu\,\sigma/\sqrt{N}\) (Derman–Kamal; present as approximate); normal-vs-fat-tail probabilities. · *figures:*
  normal vs fat-tailed return histogram. · *demos:* `bs-assumptions` (discrete hedging error vs N using `hedgeSim`); inline
  `bs-assumptions-tails` (odds of a −7σ day under normal vs Student-t). · *links:* black-scholes, random-walk, smile-skew, delta-hedging,
  stochastic-vol, tail-hedging.

**Stage 6 · Volatility**
- **realized-vol** ③ — close-to-close estimator, annualisation, window choice, range estimators (Parkinson), EWMA; vol clustering;
  typical ranges (index vs single stock vs BTC — illustrative or facts); the vol cone. · *formulas:*
  \(\hat\sigma = \sqrt{\frac{252}{n-1}\sum (r_i - \bar r)^2}\); Parkinson. · *figures:* returns with clustering + rolling vol. · *demos:*
  `realized-vol` (regime-switching path; estimators; window slider); inline `realized-vol-window`. · *links:* random-walk, implied-vol,
  vol-forecasting, variance-risk-premium.
- **implied-vol** ③ — IV = the σ that makes BS match the market price; one-to-one mapping; quoting in vol; Newton's method; IV as
  the market's (risk-neutral) forecast incl. a risk premium; implied move from the ATM straddle ≈ \(0.8\,S\sigma\sqrt T\); IV rank /
  percentile; IV per expiry. · *formulas:* \(C_{\text{mkt}} = C_{BS}(\IV)\); Newton step \(\sigma_{n+1} = \sigma_n - \frac{C_{BS}(\sigma_n) - C_{\text{mkt}}}{\nu(\sigma_n)}\). ·
  *figures:* price-vs-σ curve crossing the market price. · *demos:* `implied-vol` (solver showing Newton iterations); inline
  `implied-vol-move` (straddle → implied move). · *links:* black-scholes, realized-vol, smile-skew, vega, earnings-events, vix.
- **smile-skew** ③ — IV varies by strike: equity skew since 1987 (crash-o-phobia), supply/demand (put buying, call overwriting), the
  leverage effect; FX smile, commodity call skew, crypto (call skew in rallies, per facts); 25Δ risk reversal and butterfly; sticky strike
  vs sticky delta; skew ↔ fat left tail. · *formulas:* \(RR_{25} = \sigma_{25C} - \sigma_{25P}\), \(BF_{25} = \tfrac12(\sigma_{25C}+\sigma_{25P}) - \sigma_{ATM}\). ·
  *figures:* three smile shapes. · *demos:* `smile-skew` (SVI smile sliders → OTM prices); inline `smile-skew-rr`. · *links:* implied-vol,
  bs-assumptions, risk-neutral-density, ratios-risk-reversals, surface-calibration.
- **term-structure** ③ — IV vs expiry; upward sloping in calm, inverted in stress; event vol and additivity of total variance;
  forward vol; ex-event vol; the surface (strike × time); vega by tenor. · *formulas:*
  \(\sigma_{\text{fwd}}^2 = \frac{\sigma_2^2 T_2 - \sigma_1^2 T_1}{T_2 - T_1}\). · *figures:* normal vs inverted term structure; the surface as small
  multiples. · *demos:* `term-structure` (event-vol extractor; forward-vol calculator); inline `term-structure-surface` (heatmap). ·
  *links:* implied-vol, smile-skew, calendar-diagonal, earnings-events, vix.
- **risk-neutral-density** ②③ — Breeden–Litzenberger; butterflies price probabilities; digital = \(-\partial C/\partial K\); market-implied
  distributions (left-skewed for equities); using them (probability of a range) with the ℚ-vs-ℙ caveat. · *formulas:*
  \(f_{\Q}(K) = e^{rT}\frac{\partial^2 C}{\partial K^2}\); digital. · *figures:* smile → density. · *demos:* `risk-neutral-density` (SVI
  sliders → density vs lognormal); inline `risk-neutral-density-fly` (butterfly price ≈ probability). · *links:* probability-ev,
  risk-neutral, smile-skew, butterfly, arbitrage-bounds.
- **vix** ③ — VIX = 30-day implied variance of SPX from the OTM strip (model-free) × 100; VIX ≈ expected annualised vol → daily move
  ≈ VIX/16; VIX futures term structure (contango, roll-down), VIX options (on futures), VVIX; history (2008, March 2020, Feb 2018
  Volmageddon, Aug 2024 — facts); vol ETPs decay. · *formulas:* the Cboe variance formula; \(\text{VIX} = 100\,\sigma\); rule of 16. ·
  *figures:* VIX futures curve contango vs backwardation. · *demos:* `vix` (compute a VIX-style index from a generated strip, flat vs skewed
  smile); inline `vix-rule16`. · *links:* implied-vol, term-structure, variance-risk-premium, tail-hedging, zero-dte.

**Stage 7 · The Greeks**
- **greeks-map** ④ — the Taylor expansion \(\dd V \approx \Delta\,\dd S + \tfrac12\Gamma\,\dd S^2 + \Theta\,\dd t + \nu\,\dd\sigma + \rho\,\dd r\);
  units (per $1, per day, per vol point, per 1%); XYZ 30-day ATM call Greeks; P&L attribution (S +2, one day, IV −1 point): compare the
  Taylor estimate with an exact reprice; contracts ×100; the sign table for long/short calls/puts. · *figures:* the Greeks dashboard. ·
  *demos:* `greeks-map` (attribution: Taylor vs exact); inline `greeks-map-signs`. · *links:* before-expiry, price-drivers, delta, gamma,
  theta, vega, portfolio-risk.
- **delta** ④ — Δ = ∂V/∂S; \(\N(d_1)\) (call), \(\N(d_1) - 1\) (put); hedge ratio; ≈ “probability” (it is \(\N(d_2)\) that is the
  risk-neutral ITM probability); delta moves with S, T, σ; position and dollar delta; delta-neutral. · *figures:* delta S-curves for 7/30/180
  days. · *demos:* `delta` (curves + hedge-ratio calculator); inline `delta-prob` (Δ vs \(\N(d_2)\) vs a real-world probability). ·
  *links:* greeks-map, binomial-one-step, gamma, delta-hedging, moneyness, probability-ev.
- **gamma** ①④ — Γ = ∂²V/∂S²; convexity; peaks ATM; explodes near expiry (∝ \(1/\sqrt T\)): 30-day 0.069 vs 1-day 0.381; long gamma
  earns \(\tfrac12\Gamma(\Delta S)^2\) from moves either way; short gamma risk; dollar gamma. · *formulas:* \(\Gamma = \frac{\varphi(d_1)}{S\sigma\sqrt T}\). ·
  *figures:* gamma vs S for several T. · *demos:* `gamma` (curves; move the stock and watch Δ change); inline `gamma-convexity`
  (\(\tfrac12\Gamma\,\dd S^2\) vs exact). · *links:* delta, linear-vs-convex, theta, delta-hedging, dealer-gamma, zero-dte.
- **theta** ③④ — decay accelerates for ATM options (30-day −0.044/day, 7-day −0.084, 1-day −0.214); OTM options decay differently;
  the gamma–theta trade-off \(\Theta \approx -\tfrac12\Gamma S^2\sigma^2\) (r = 0, per year) → breakeven daily move ≈ $1.05 for XYZ; calendar
  vs trading days, weekends. · *formulas:* the BS PDE \(\Theta + \tfrac12\sigma^2 S^2\Gamma + rS\Delta - rV = 0\). · *figures:* time value vs
  days to expiry. · *demos:* `theta` (decay curves ATM/OTM/ITM); inline `theta-breakeven` (breakeven move from Γ and Θ). · *links:* gamma,
  intrinsic-time-value, delta-hedging, covered-call, iron-condor.
- **vega** ③④ — ν per vol point; peaks ATM, grows with √T; long-dated vega ≫ short-dated; vega vs gamma across tenors; IV-crush
  P&L; vega by tenor buckets; volga preview. · *formulas:* \(\nu = S\varphi(d_1)\sqrt T\). · *figures:* vega vs S for tenors. · *demos:*
  `vega` (curves; IV-shock simulator on a position); inline `vega-crush`. · *links:* implied-vol, term-structure, earnings-events,
  higher-order-greeks, calendar-diagonal.
- **rho-carry** ②④ — ρ small for short-dated, large for LEAPS (XYZ 1-year call ρ 0.52 per 1%); rates act through the forward;
  dividends lower calls and raise puts; early exercise and dividends; borrow cost and hard-to-borrow stocks via parity; the 2022 rate
  shock on long-dated options. · *formulas:* \(\rho_C = KTe^{-rT}\N(d_2)\). · *figures:* ρ vs T. · *demos:* `rho-carry` (rate and dividend
  sliders on 30-day vs 1-year); inline `rho-carry-borrow` (implied borrow from parity). · *links:* forwards-carry, put-call-parity,
  exercise-assignment, greeks-map, higher-order-greeks.
- **higher-order-greeks** ④ — vanna (∂Δ/∂σ), volga (∂ν/∂σ), charm (∂Δ/∂t), speed and colour briefly; portfolio aggregation; the spot–vol
  scenario grid; why vanna/charm flows matter for dealers (link). · *formulas:* \(\text{vanna} = -e^{-qT}\varphi(d_1)\frac{d_2}{\sigma}\),
  \(\text{volga} = \nu\frac{d_1 d_2}{\sigma}\). · *figures:* spot–vol P&L heatmap. · *demos:* `higher-order-greeks` (2-D spot×vol grid
  with second-order attribution); inline `higher-order-greeks-charm` (delta drift overnight). · *links:* greeks-map, vega, dealer-gamma,
  portfolio-risk, stochastic-vol.

### Tier 3 · Strategy — Strategies & Risk Management

**Stage 8 · Directional & Income Strategies**
- **long-options** ① — choosing strike (delta, leverage, probability) and expiry (theta vs time for the thesis); compare ITM/ATM/OTM
  calls for a +10%-in-60-days view with XYZ numbers; breakeven by date; exits; LEAPS as stock replacement. · *formulas:* elasticity
  \(\Omega = \Delta\frac{S}{V}\). · *figures:* strike × expiry outcome grid. · *demos:* `long-options` (view = target price and date →
  P&L of each choice); inline `long-options-elasticity`. · *links:* call-option, delta, theta, probability-ev, vertical-spreads.
- **covered-call** ①③ — 100 shares + short call; capped upside, income; Kai sells the 30-day 105 call for $0.71; outcomes;
  assignment; rolling; opportunity cost; covered call ≡ short put via parity; BXM and covered-call ETFs (facts). · *formulas:* max profit
  \((K - S_0) + c\); breakeven \(S_0 - c\); annualised yield. · *figures:* stock line vs covered call. · *demos:* `covered-call` (strike/expiry
  → outcomes, annualised); inline `covered-call-roll`. · *links:* four-positions, put-call-parity, cash-secured-put, retail-flows, theta.
- **cash-secured-put** ①③ — sell a put with \(K \times 100\) in cash; paid to wait; effective purchase price \(K - p\); the wheel (CSP →
  assignment → covered call → called away); risks (falling knives, capped upside, same exposure as stock); interest on the cash; PUT
  index (facts). · *figures:* the wheel cycle. · *demos:* `cash-secured-put` (wheel simulator over 12 months vs buy-and-hold on seeded
  paths); inline `cash-secured-put-effective`. · *links:* four-positions, covered-call, margin-approval, systematic-vol, variance-risk-premium.
- **protective-put-collar** ①④ — Kai buys the 95 put ($0.51): the floor, the “deductible” (distance OTM), cost as insurance; collar
  (sell 105 call, buy 95 put → net credit $0.20); zero-cost collars; the drag of permanent hedging; when protection is worth it. ·
  *formulas:* floor P&L \(= K - S_0 - p\). · *figures:* stock vs protected vs collar. · *demos:* `protective-put-collar` (build it;
  scenario table); inline `protective-put-collar-drag` (annual cost of rolling puts). · *links:* put-option, why-options, covered-call,
  tail-hedging, vertical-spreads.
- **vertical-spreads** ①② — bull call (debit), bear put (debit), bull put (credit), bear call (credit); max P/L from width and
  premium; breakevens; Greeks of spreads (small vega/theta); width choice; debit ≡ credit via parity; early assignment of the short leg. ·
  *formulas:* max profit \(= (K_2 - K_1) - \text{debit}\), etc. · *figures:* the four verticals 2×2. · *demos:* `vertical-spreads`
  (builder: P/L, BE, POP, Greeks); inline `vertical-spreads-equiv`. · *links:* payoff-lego, long-options, breakeven-returns, iron-condor,
  put-call-parity.
- **strategy-matrix** ①③④ — direction (bull/neutral/bear) × vol view (long/short) × time; the strategy grid; each strategy's Greek
  signature (signs of Δ, Γ, Θ, ν); choosing by view, conviction and risk budget; mistakes (a vol view expressed with a directional trade). ·
  *figures:* 3×3 grid of shapes. · *demos:* `strategy-matrix` (pick views → candidate structures + payoff); inline
  `strategy-matrix-signature` (name the strategy from its Greeks). · *links:* payoff-lego, greeks-map, vertical-spreads, straddle-strangle,
  iron-condor, calendar-diagonal.

**Stage 9 · Volatility & Time Strategies**
- **straddle-strangle** ③④ — long vol / long gamma; XYZ 30-day straddle $4.57 → breakevens 95.43 / 104.57; strangle cheaper and
  wider; wins when realized > implied; short straddle risk. · *formulas:* breakevens; straddle ≈ \(0.8\,S\sigma\sqrt T\). · *figures:*
  straddle vs strangle. · *demos:* `straddle-strangle` (Monte Carlo: P&L distribution as realized vol varies vs implied); inline
  `straddle-strangle-move`. · *links:* implied-vol, gamma, earnings-events, variance-risk-premium, delta-hedging.
- **iron-condor** ③④ — short strangle + wings; renting out a range; credit, max loss = width − credit; POP; short vol; tail risk and
  common management rules (describe practice, not advice); naked short strangles; 0DTE condors. · *figures:* condor with the profit
  range. · *demos:* `iron-condor` (builder; POP under lognormal; EV under a realized-vol slider); inline `iron-condor-tail` (outcomes with
  fat tails). · *links:* straddle-strangle, vertical-spreads, theta, variance-risk-premium, zero-dte.
- **butterfly** ①③ — long call fly (+1, −2, +1); cheap bet on a landing zone; max at the body; link to the risk-neutral density
  (fly ≈ probability × width); broken-wing, iron fly; Greeks near expiry. · *formulas:* fly value and \(\approx e^{-rT} f_{\Q}(K)\,(\Delta K)^2\). ·
  *figures:* the tent. · *demos:* `butterfly` (builder + implied probability); inline `butterfly-rnd`. · *links:* payoff-lego,
  risk-neutral-density, iron-condor, arbitrage-bounds, dealer-gamma.
- **calendar-diagonal** ③ — sell near, buy far (same strike): long vega, short gamma; profits if S stays near K and/or the back month's
  IV holds; a term-structure trade; diagonals add direction; P&L at the front expiry needs BS for the back leg; event calendars. ·
  *formulas:* forward vol. · *figures:* calendar P&L at front expiry. · *demos:* `calendar-diagonal` (P&L at front expiry with an IV
  slider per leg); inline `calendar-diagonal-fwdvol`. · *links:* term-structure, theta, vega, earnings-events, before-expiry.
- **ratios-risk-reversals** ③④ — ratio spreads (1×2), backspreads, risk reversals (long call + short put or the reverse) as skew
  trades; the collar as a risk reversal; the skew premium; hidden tails of ratios. · *formulas:* \(RR_{25}\). · *figures:* 1×2 ratio
  with the naked tail. · *demos:* `ratios-risk-reversals` (builder with a skew slider feeding prices); inline `ratios-risk-reversals-skew`.
  · *links:* smile-skew, vertical-spreads, protective-put-collar, higher-order-greeks, tail-hedging.
- **earnings-events** ③ — event variance; implied earnings move from the front straddle and the term structure; IV crush; historical
  vs implied moves; structures (straddle, calendar, condor, fly); other binary events (FOMC, CPI, FDA, elections). · *formulas:* event
  variance \(\sigma_{\text{event}}^2 = \sigma_{\text{front}}^2 T_1 - \sigma_{\text{base}}^2 T_1\) (one-day event, total variance); implied move
  ≈ straddle / S. · *figures:* IV before and after the event. · *demos:* `earnings-events` (implied vs actual move → P&L of four
  structures); inline `earnings-events-extract`. · *links:* term-structure, vega, straddle-strangle, calendar-diagonal, llm-signals.

**Stage 10 · Running an Options Book**
- **position-sizing** ④ — risk per trade; sizing by max loss; Kelly \(f^* = p - \frac{1-p}{b}\); fractional Kelly; risk of ruin; skewed
  option payoffs and Kelly; correlated short-premium positions; sizing by vega/gamma; drawdown arithmetic (−50% needs +100%). ·
  *figures:* growth rate vs fraction. · *demos:* `position-sizing` (Kelly curve + simulated wealth paths); inline `position-sizing-ruin`. ·
  *links:* probability-ev, variance-risk-premium, portfolio-risk, trading-psychology, tail-hedging.
- **delta-hedging** ②③④ — why dealers hedge; discrete hedging; P&L \(\approx \tfrac12\Gamma S^2(\RV^2 - \IV^2)\,\dd t\); gamma scalping; path
  dependence; hedging frequency vs costs; hedging at implied vs realized delta. · *figures:* gamma scalping around the strike. · *demos:*
  `delta-hedging` (`hedgeSim` with σ_real vs σ_imp, steps, costs); inline `delta-hedging-pnl` (distribution over many paths). · *links:*
  binomial-one-step, gamma, theta, variance-risk-premium, market-makers, deep-hedging.
- **variance-risk-premium** ③④ — implied > realized on average for indexes and why (insurance demand, crash risk); evidence (facts);
  variance swaps (payoff \(N(\sigma_R^2 - K^2)\)); small frequent gains, rare large losses; Feb 2018 Volmageddon and XIV (facts); single
  stocks vs index vs BTC. · *formulas:* variance-swap payoff; \(\text{VRP} = \IV^2 - \E[\RV^2]\). · *figures:* implied vs realized
  (stylised). · *demos:* `variance-risk-premium` (short-vol strategy with jumps: equity curve and drawdowns); inline
  `variance-risk-premium-swap`. · *links:* realized-vol, implied-vol, vix, tail-hedging, systematic-vol, position-sizing.
- **tail-hedging** ④ — fat tails; instruments (OTM puts, put spreads, VIX calls, long-vol funds); cost vs payoff (carry drag);
  monetisation; March 2020 examples (facts, flag unverified claims); the portfolio-geometric-return argument and its critics; skew makes
  puts expensive. · *formulas:* annual drag; geometric mean \(\approx \mu - \tfrac12\sigma^2\). · *figures:* portfolio with/without hedge
  in a crash. · *demos:* `tail-hedging` (simulated years with jumps: portfolio + x% budget of puts); inline `tail-hedging-convexity`. ·
  *links:* bs-assumptions, smile-skew, vix, protective-put-collar, variance-risk-premium.
- **portfolio-risk** ④ — aggregate Greeks; spot × vol scenario grid; stress tests; Reg T vs portfolio margin (facts); correlation;
  why linear VaR fails for options; liquidity and concentration. · *formulas:* scenario P&L; delta-gamma approximation
  \(\Delta\Pi \approx \Delta\,\dd S + \tfrac12\Gamma\,\dd S^2\). · *figures:* heatmap. · *demos:* `portfolio-risk` (small book → scenario grid →
  margin estimate); inline `portfolio-risk-var` (linear VaR vs full revaluation). · *links:* greeks-map, higher-order-greeks,
  margin-approval, position-sizing, margin-liquidation.
- **trading-psychology** ④ — loss aversion (rolling losers), lottery preference (OTM calls), overconfidence, recency after short-vol
  wins, sunk cost; process: plan, pre-mortem, sizing rules, journal fields, review cadence. · *formulas:* expectancy
  \(E = p\,\bar W - (1-p)\,\bar L\). · *figures:* the process loop. · *demos:* `trading-psychology` (journal analyser: win rate, payoff
  ratio, expectancy + bias flags); inline `trading-psychology-expectancy`. · *links:* probability-ev, position-sizing, retail-flows,
  common-traps, capstone.

### Tier 4 · Markets — Market Structure & Linear Derivatives

**Stage 11 · Market Structure: Who's on the Other Side**
- **market-makers** ②④ — quoting around a theoretical value; edge; inventory; delta hedging; risk limits; adverse selection;
  wholesalers, PFOF and exchange market makers (facts); how they make money (spread + VRP) and lose it (informed flow). · *formulas:*
  expected P&L = spread capture − adverse selection − hedging cost; Avellaneda–Stoikov reservation price
  \(r = s - q\gamma\sigma^2(T-t)\) (preview). · *figures:* flow → dealer → hedge in stock. · *demos:* `market-makers` (quote-setting game
  vs informed/uninformed flow with hedging); inline `market-makers-skew-quotes`. · *links:* liquidity-spreads, delta-hedging,
  dealer-gamma, rl-market-making, execution-tca.
- **dealer-gamma** ④ — GEX estimates and their assumptions; long-gamma dealers dampen moves, short-gamma dealers amplify; the gamma
  flip; pinning near large open interest; OPEX, vanna and charm flows; limits and controversy (true positions are unknown). ·
  *formulas:* \(\text{GEX} = \sum_i \Gamma_i \times \text{OI}_i \times 100 \times S^2 \times 1\%\) with the sign convention stated. ·
  *figures:* the hedging feedback loop. · *demos:* `dealer-gamma` (simulated price path with long vs short dealer gamma; GEX by strike);
  inline `dealer-gamma-flip`. · *links:* gamma, higher-order-greeks, market-makers, zero-dte, retail-flows, butterfly.
- **zero-dte** ③④ — daily expirations and 0DTE share of SPX volume (facts); why popular; Greeks at 0DTE (XYZ 1-day ATM Γ 0.38, Θ
  −0.21); intraday time in years; risks; the market-impact debate (facts, both sides); common 0DTE structures. · *formulas:* \(T\) in
  hours \(= h/(365 \times 24)\) (or trading-time convention — say which); ATM premium \(\approx 0.4\,S\sigma\sqrt T\). · *figures:* time value
  melting through a session. · *demos:* `zero-dte` (hours-to-close slider: premium, Γ, Θ); inline `zero-dte-pnl` (the same $1 move at
  09:30 vs 15:30). · *links:* gamma, theta, product-map, dealer-gamma, iron-condor.
- **retail-flows** ④ — the retail boom since 2020 (facts); zero commissions and apps; meme stocks and the January 2021 GameStop gamma
  squeeze mechanics; option-income ETFs (facts) and overwriting as vol supply; structured products/autocallables as vol supply; evidence
  on retail outcomes (facts, hedged). · *formulas:* hedge shares \(= \Delta \times \text{OI} \times 100\) feedback. · *figures:* squeeze
  loop. · *demos:* `retail-flows` (gamma-squeeze simulator); inline `retail-flows-income-etf` (distribution yield vs total return). ·
  *links:* dealer-gamma, covered-call, market-makers, trading-psychology, zero-dte.
- **crypto-options** ③④ — Deribit's share and the Coinbase acquisition (facts); coin-margined (inverse) options; BTC IV and DVOL
  (facts); 24/7 trading and weekends; IBIT options and CME options (facts); typical skew regimes; venue and liquidation risks. ·
  *formulas:* inverse call payoff in BTC \(\frac{\max(S_T - K, 0)}{S_T}\). · *figures:* venue/product map. · *demos:* `crypto-options`
  (BTC option pricer: USD vs coin-settled payoff; DVOL → expected move); inline `crypto-options-weekend`. · *links:* product-map,
  implied-vol, what-is-perp, perps-vs-options, smile-skew.

**Stage 12 · The Linear Cousins: Futures & Perpetuals**
- **futures-basis** ② — standardised, margined, daily mark-to-market, convergence at expiry; basis \(F - S\); contango/backwardation;
  carry model; roll yield; CME BTC futures basis (facts); calendar spreads. · *formulas:* \(F = Se^{(r-q)T}\); annualised basis
  \(\frac{1}{T}\ln\frac{F}{S}\). · *figures:* basis converging to zero. · *demos:* `futures-basis` (basis + daily MTM); inline
  `futures-basis-roll`. · *links:* forwards-carry, derivatives, what-is-perp, basis-trades, vix.
- **what-is-perp** ④ — a perpetual swap: no expiry, funding keeps it near the index; invented 2016 (facts); linear vs inverse; leverage;
  why it dominates crypto volume (facts). · *formulas:* linear P&L \((P_1 - P_0)\times Q\); inverse P&L in coin
  \(N\left(\frac{1}{P_0} - \frac{1}{P_1}\right)\). · *figures:* perp vs dated future timeline. · *demos:* `what-is-perp` (linear vs
  inverse P&L at leverage); inline `what-is-perp-vs-future`. · *links:* futures-basis, funding-rate, mark-index-last, margin-liquidation,
  perps-vs-options.
- **mark-index-last** ④ — index (multi-venue spot, median/weights), mark (fair price used for P&L and liquidation, e.g. index + smoothed
  basis), last traded; why liquidations use mark (anti-manipulation); wicks; oracle issues on DEXs. · *formulas:* a representative mark
  formula (state that venues differ; facts). · *figures:* three lines during a wick. · *demos:* `mark-index-last` (wick simulator:
  liquidations under last vs mark); inline `mark-index-last-index` (outlier venue vs median index). · *links:* what-is-perp, funding-rate,
  margin-liquidation, insurance-adl, market-makers.
- **funding-rate** ②④ — premium index, interest component, clamp, intervals (8h / 1h, facts), payment = notional × rate, who pays,
  APR conversion, funding as a leverage-demand signal. · *formulas:* \(F = P + \operatorname{clamp}(I - P, -0.05\%, +0.05\%)\) (facts);
  APR \(= F \times n \times 365\). · *figures:* premium → funding flow. · *demos:* `funding-rate` (calculator + cumulative cost); inline
  `funding-rate-apr`. · *links:* what-is-perp, mark-index-last, basis-trades, perps-vs-options, futures-basis.
- **margin-liquidation** ④ — initial vs maintenance margin; isolated vs cross; liquidation price; leverage tiers; partial liquidation
  and fees; cascades (Oct 2025 per facts). · *formulas:* \(P_{\text{liq}} \approx P_0\left(1 - \frac1L + m\right)\) (long, isolated,
  simplified); distance to liquidation vs leverage. · *figures:* a path touching the liquidation line. · *demos:* `margin-liquidation`
  (liq-price calculator; path simulator); inline `margin-liquidation-cascade`. · *links:* margin-approval, what-is-perp, mark-index-last,
  insurance-adl, portfolio-risk.
- **insurance-adl** ④ — bankruptcy vs liquidation price; the insurance fund; ADL ranking (profit × leverage); socialised losses
  history; Hyperliquid's HLP; October 2025 ADL events (facts). · *formulas:* a representative ADL ranking score (facts). · *figures:*
  waterfall: liquidation → insurance fund → ADL. · *demos:* `insurance-adl` (waterfall simulator); inline `insurance-adl-rank`. · *links:*
  margin-liquidation, mark-index-last, basis-trades, perps-vs-options, tail-hedging.
- **basis-trades** ②④ — cash-and-carry (long spot, short future) earns the basis; funding carry (long spot, short perp); delta-neutral
  “synthetic dollar” designs (facts, hedged); risks: funding turns negative, venue risk, liquidation of the short leg, basis blow-outs,
  ADL; the Treasury cash–futures basis analogy. · *formulas:* annualised carry. · *figures:* two-leg hedge diagram. · *demos:*
  `basis-trades` (carry simulator with funding regimes); inline `basis-trades-risks`. · *links:* futures-basis, funding-rate,
  insurance-adl, forwards-carry, systematic-vol.
- **perps-vs-options** ①④ — linear vs convex; the same view as a 10× perp vs a call; liquidation vs premium-limited loss; funding vs
  theta; path dependence (liquidated, then the price recovers); combining (a perp hedged with a put); traps (fake APR, hidden leverage,
  ADL); a checklist. · *formulas:* break-even comparison. · *figures:* perp vs call with the liquidation cliff. · *demos:*
  `perps-vs-options` (path simulator: same view, perp vs call); inline `perps-vs-options-cost`. · *links:* linear-vs-convex, what-is-perp,
  margin-liquidation, crypto-options, long-options.

### Tier 5 · Mastery — Quant, AI & Practice

**Stage 13 · Quantitative Pricing**
- **monte-carlo** ② — simulate GBM under ℚ; discounted average; standard error ∝ \(1/\sqrt N\); variance reduction (antithetic,
  control variates with the geometric Asian, importance sampling); path-dependent payoffs; Greeks by bumping / pathwise / likelihood
  ratio; quasi-random numbers; GPUs. · *formulas:* estimator and SE \(\frac{s}{\sqrt N}\); control-variate estimator. · *figures:*
  convergence funnel. · *demos:* `monte-carlo`; inline `monte-carlo-variance`. · *links:* random-walk, risk-neutral, exotic-options,
  american-exercise, python-pricing.
- **finite-difference** ② — the BS PDE; the grid; explicit (stability limit), implicit, Crank–Nicolson; boundary conditions; American
  by projection; Greeks from the grid. · *formulas:* PDE; explicit update; stability \(\Delta t \lesssim \frac{1}{\sigma^2 M^2}\). ·
  *figures:* grid stepping backwards in time. · *demos:* `finite-difference` (`fdPrice` with scheme switch; watch explicit blow up);
  inline `finite-difference-grid`. · *links:* black-scholes, binomial-trees, american-exercise, theta, stochastic-vol.
- **american-exercise** ② — early-exercise premium; calls on non-dividend stocks: never early; puts: deep ITM when interest beats
  time value; dividends; the exercise boundary \(S^*(t)\); Longstaff–Schwartz (2001) regression; approximations (Barone-Adesi–Whaley). ·
  *figures:* the exercise boundary. · *demos:* `american-exercise` (boundary from the tree); inline `american-exercise-lsm` (LSM on a
  handful of paths). · *links:* exercise-assignment, binomial-trees, finite-difference, monte-carlo, rho-carry.
- **exotic-options** ②③ — barriers (knock-in/out, in–out parity), Asians (averaging lowers vol), digitals (call-spread replication,
  pin risk), lookbacks; where they are used (structured products, FX, autocallables); hedging problems (barrier gamma). · *formulas:*
  in–out parity; digital \(e^{-rT}\N(d_2)\); geometric Asian. · *figures:* a path touching a barrier. · *demos:* `exotic-options`
  (explorer: analytic vs Monte Carlo); inline `exotic-options-digital` (digital ≈ tight call spread). · *links:* monte-carlo,
  risk-neutral-density, retail-flows, deep-hedging, butterfly.
- **stochastic-vol** ③ — why (smile and term structure); local vol (Dupire) fits today's smile exactly but has poor dynamics; Heston
  SDEs and what each parameter does to the smile; SABR (rates/FX); jumps (Merton); rough volatility (H ≈ 0.1; Gatheral–Jaisson–Rosenbaum
  2018); choosing a model for exotics. · *formulas:* Heston SDEs; Dupire \(\sigma_{\text{loc}}^2 = \frac{\partial_T C}{\tfrac12 K^2\partial_{KK}C}\)
  (r = q = 0); SABR. · *figures:* parameter → smile small multiples. · *demos:* `stochastic-vol` (Heston smile generator; cache prices);
  inline `stochastic-vol-sabr`. · *links:* bs-assumptions, smile-skew, term-structure, surface-calibration, neural-pricing.
- **surface-calibration** ②③ — from quotes to a surface: cleaning, forwards and rates from parity, SVI per slice, no-butterfly
  (\(g(k) \ge 0\)) and no-calendar (total variance non-decreasing) conditions, SSVI, interpolation in time, vega-weighted loss. ·
  *formulas:* raw SVI \(w(k) = a + b\big(\rho(k-m) + \sqrt{(k-m)^2 + s^2}\big)\); the conditions. · *figures:* total-variance slices that must
  not cross. · *demos:* `surface-calibration` (fit SVI to noisy quotes with a simple optimiser; arbitrage checks); inline
  `surface-calibration-g`. · *links:* smile-skew, arbitrage-bounds, risk-neutral-density, options-data, neural-pricing.

**Stage 14 · Quant Trading & Research**
- **options-data** — sources (OPRA, vendors, end-of-day vs intraday; facts), quirks (stale and crossed quotes, bad prints), mids vs
  trades, the IV pipeline (forwards, dividends, de-Americanisation), corporate actions, survivorship, data volume; cleaning checklist. ·
  *formulas:* implied forward from parity; mid. · *figures:* the pipeline. · *demos:* `options-data` (clean a messy chain: flag crossed,
  parity and monotonicity violations); inline `options-data-forward`. · *links:* option-chain, put-call-parity, surface-calibration,
  backtesting, python-pricing.
- **backtesting** ③ — look-ahead, survivorship, fills at mid, ignored spreads and fees, early assignment, stale IV, overfitting and
  multiple testing (deflated Sharpe), regime dependence, short-vol strategies that look great until the tail; walk-forward. · *formulas:*
  Sharpe; cost drag; the multiple-testing intuition \(\E[\max \text{SR}]\) grows with the number of trials. · *figures:* equity curve with
  vs without costs. · *demos:* `backtesting` (toggle pitfalls on a synthetic short-put backtest); inline `backtesting-overfit`. · *links:*
  options-data, systematic-vol, variance-risk-premium, python-backtest, vol-forecasting.
- **systematic-vol** ③ — put-writing (PUT index, facts), covered calls (BXM), hedged VRP harvesting, dispersion (index vs single-stock
  implied correlation), skew trades, VIX-futures carry, trend/long-vol overlays; crowding (Feb 2018). · *formulas:* implied correlation
  \(\rho_{\text{imp}} \approx \frac{\sigma_I^2 - \sum_i w_i^2\sigma_i^2}{\sum_{i \ne j} w_i w_j \sigma_i \sigma_j}\). · *figures:* strategy families map. ·
  *demos:* `systematic-vol` (dispersion calculator + VRP strategy simulation); inline `systematic-vol-corr`. · *links:*
  variance-risk-premium, covered-call, cash-secured-put, backtesting, vix.
- **vol-forecasting** ③ — why forecast (trade IV vs expected RV); EWMA; GARCH(1,1) (persistence, mean reversion); HAR-RV (Corsi 2009);
  realized measures from intraday data; IV as a forecaster; ML models and proper evaluation (QLIKE); pitfalls. · *formulas:* GARCH
  \(\sigma_{t+1}^2 = \omega + \alpha\varepsilon_t^2 + \beta\sigma_t^2\); HAR. · *figures:* forecast vs realized. · *demos:* `vol-forecasting`
  (EWMA/GARCH/HAR on simulated GARCH data with loss scores); inline `vol-forecasting-meanrev`. · *links:* realized-vol, implied-vol,
  variance-risk-premium, neural-pricing, llm-signals.
- **execution-tca** — slippage vs mid; crossing the spread; complex order books; auctions and price improvement; smart order routing;
  market impact; TCA (implementation shortfall, effective spread); Almgren–Chriss trade-off. · *formulas:* implementation shortfall;
  effective spread \(2|P - M|\). · *figures:* arrival → fill decomposition. · *demos:* `execution-tca` (aggressiveness vs fill probability
  and cost); inline `execution-tca-is`. · *links:* liquidity-spreads, orders, market-makers, rl-market-making, backtesting.

**Stage 15 · Options in the AI Era**
- **deep-hedging** ④ — Buehler, Gonon, Teichmann & Wood (2019); hedging as a learned policy minimising a risk measure (CVaR) with
  costs; vs BS delta; learns a cost-aware no-trade band; trained on simulated data; limits. · *formulas:*
  \(\min_\theta \rho\big(-\text{P\&L}_\theta\big)\); CVaR. · *figures:* network in the hedging loop. · *demos:* `deep-hedging` (a tiny policy
  — e.g. a no-trade band around delta — optimised in-browser against costs); inline `deep-hedging-band`. · *links:* delta-hedging,
  bs-assumptions, rl-market-making, neural-pricing, portfolio-risk.
- **neural-pricing** ③ — neural networks as fast surrogates for slow models (Heston, rough vol) → deep calibration (facts for paper
  citations); vol-surface nowcasting; risks: extrapolation, arbitrage violations, explainability. · *formulas:* surrogate loss;
  calibration objective. · *figures:* calibration pipeline (offline train → online calibrate). · *demos:* `neural-pricing` (fit a small
  model — e.g. random features + ridge regression — to BS prices in-browser; error map; extrapolation failure); inline
  `neural-pricing-extrap`. · *links:* stochastic-vol, surface-calibration, monte-carlo, deep-hedging, vol-forecasting.
- **rl-market-making** ④ — RL framing (state, action, reward); Avellaneda–Stoikov baseline; RL for execution (Almgren–Chriss
  baseline); market simulators; sim-to-real gap; reward hacking; what the evidence shows (facts). · *formulas:* AS reservation price and
  optimal spread. · *figures:* agent–environment loop. · *demos:* `rl-market-making` (tabular Q-learning toy market maker vs AS); inline
  `rl-market-making-as`. · *links:* market-makers, execution-tca, deep-hedging, ai-agents, backtesting.
- **llm-signals** ③ — NLP/LLM sentiment from news and earnings calls → vol forecasts; embeddings; event detection; alternative data;
  pitfalls: look-ahead through the model's training data, leakage, hallucination; evaluation (information coefficient); real papers
  only (facts). · *formulas:* information coefficient; a regression of RV on a sentiment score. · *figures:* the pipeline. · *demos:*
  `llm-signals` (toy headline scorer → signal → backtest with a leakage toggle); inline `llm-signals-leak`. · *links:* earnings-events,
  vol-forecasting, backtesting, ai-agents, trading-psychology.
- **ai-agents** ④ — agents that research, code, backtest and even execute; architecture (tools, memory, planner); what they do well
  (writing pricing code, scanning chains, summarising filings) and badly (unchecked numbers, risk); guardrails: position and loss limits,
  human approval, paper trading first, kill switch, logging; prompt injection through news/web data; responsible use. · *formulas:*
  risk-limit checks (max loss, max vega) as simple inequalities. · *figures:* agent loop with guardrail gates. · *demos:* `ai-agents`
  (workflow simulator with guardrail toggles and an injected malicious instruction); inline `ai-agents-limits`. · *links:* llm-signals,
  python-pricing, backtesting, first-trade, portfolio-risk, capstone.

**Stage 16 · Hands-On**
- **broker-platform** — criteria: approval levels, commissions and contract fees, PFOF (facts), analytics (chains, Greeks, risk graphs),
  API access, portfolio-margin eligibility, crypto venues, paper trading; checklist; no endorsements. · *formulas:* all-in cost per round
  trip. · *figures:* decision tree. · *demos:* `broker-platform` (all-in cost calculator for your style); inline
  `broker-platform-checklist`. · *links:* margin-approval, liquidity-spreads, orders, first-trade, python-pricing.
- **first-trade** — end to end: thesis → structure → liquidity check → size → limit order at/near mid → management rules and alerts →
  exit or expiry → journal; Kai's first real trade (the covered call) walked through; paper trade first. · *figures:* the flow. · *demos:*
  `first-trade` (guided wizard with checks); inline `first-trade-checklist`. · *links:* orders, strategy-matrix, position-sizing,
  trading-psychology, common-traps.
- **python-pricing** — Python: BS and Greeks with numpy/scipy, implied vol with brentq, vectorised chains, plotting Greeks, binomial and
  Monte Carlo snippets, unit tests against textbook values (10.45 / 5.57). Code blocks with ```` ```python ````. · *figures:* code → numbers →
  plot pipeline. · *demos:* `python-pricing` (the same functions live in JS: edit inputs, see the Python output that would print); inline
  `python-pricing-check`. · *links:* black-scholes, implied-vol, monte-carlo, python-backtest, options-data.
- **python-backtest** — a pandas skeleton for a monthly put-write on a price series (synthetic or public data), fills with spreads,
  Greek tracking, metrics; the pitfalls checklist in code. · *figures:* backtest architecture. · *demos:* `python-backtest` (run the same
  strategy in JS with parameters); inline `python-backtest-metrics`. · *links:* backtesting, systematic-vol, python-pricing, options-data,
  execution-tca.
- **common-traps** ④ — early assignment (short ITM calls before ex-dividend), pin risk, after-hours moves, wide spreads, IV crush,
  cheap lottery tickets, rolling losers, margin calls, accidental exercise, weekend risk, 0DTE speed, adjusted contracts after corporate
  actions, taxes (wash sales, mention only; not advice). · *figures:* trap map. · *demos:* `common-traps` (scenario quiz with
  explanations); inline `common-traps-dividend`. · *links:* exercise-assignment, earnings-events, liquidity-spreads, trading-psychology,
  capstone.
- **capstone** ①②③④ — one full case: Kai's view on XYZ before earnings → read the chain → IV vs RV and the implied move → three
  candidate structures → Greeks → stress test → size → order → management → post-mortem; plus a BTC variant (perp vs option). **≥ 8
  distinct links.** · *figures:* the decision pipeline. · *demos:* `capstone` (guided builder producing a trade-plan report); inline
  `capstone-compare`. · *links:* broadly across the course.
- **cheat-sheet** (`short: true`) — every key formula grouped (payoffs, parity, bounds, BS, Greeks, vol, strategies, perps, sizing) +
  key numbers (×100, 1σ move, rule of 16, \(0.4\,S\sigma\sqrt T\), 0.8 × straddle …), each with a link to its lesson. · *demos:*
  `cheat-sheet` (searchable formula reference with live mini-calculators). · *links:* many.

---

## 6. Old lessons → new lessons (raw material only)

Old files are `content/lessons/stage<N>-<name>.js` (zh) and `content/lessons/en/…` (en); old demos in `demos/`.

| New lesson(s) | Old material |
|---|---|
| welcome, derivatives, why-options, linear-vs-convex | stage0-why-options, stage0-derivative, stage0-rights, stage0-vs-others |
| call-option, put-option, contract-specs, moneyness, intrinsic-time-value, four-positions | stage1-call, stage1-put, stage1-key-terms, stage1-moneyness, stage1-value, stage1-four-positions |
| payoff-diagrams, breakeven-returns, payoff-lego, before-expiry, probability-ev | stage2-payoff, stage2-breakeven (+ demos payoff-builder, payoff-compare) |
| option-chain, liquidity-spreads, orders, exercise-assignment, margin-approval, product-map | stage2-chain, stage2-orders, stage2-exercise, stage2-product-map, stage11-broker |
| price-drivers, arbitrage-bounds, forwards-carry, put-call-parity, synthetics-boxes | stage3-drivers, stage3-parity, stage3-replication, stage7-synthetics |
| binomial-one-step, risk-neutral, binomial-trees, random-walk, bs-assumptions | stage3-binomial, stage3-risk-neutral, stage3-replication, stage4-bs |
| realized-vol, implied-vol, smile-skew, term-structure, risk-neutral-density, vix | stage4-vol, stage4-smile, stage4-surface, stage4-vix |
| greeks-map … higher-order-greeks | stage5-overview, -delta, -gamma, -theta, -vega, -rho, -portfolio |
| long-options … strategy-matrix | stage6-long, -covered-call, -csp, -protective-put, -verticals, -collar |
| straddle-strangle … earnings-events | stage7-straddle, -butterfly, -condor, -calendar, -ratio |
| position-sizing … trading-psychology | stage8-sizing, -hedging, -vrp, -tail, -psychology |
| market-makers, dealer-gamma, zero-dte, retail-flows, crypto-options | stage8-dealer, stage2-zerodte, stage2-product-map, stage12-venues |
| futures-basis … perps-vs-options | stage12-* (all eight), stage0-vs-others |
| monte-carlo … surface-calibration | stage9-monte-carlo, -fd, -american, -exotics, -vol-models |
| options-data … execution-tca | stage9-backtest, stage10-ml-vol, stage10-execution |
| deep-hedging … ai-agents | stage10-deep-hedging, -rl, -altdata, -agents, stage11-ai-workflow |
| broker-platform … cheat-sheet | stage11-broker, -first-trade, -python, -backtest, -traps, -cheatsheet |

Sister courses you may link in `@further`: Satoshi Path https://evidex-cloud.github.io/nextdawn-satoshi-path/ ·
New Finance Path https://evidex-cloud.github.io/droplet-labs-finance-path/ · Strategy Path https://evidex-cloud.github.io/droplet-labs-strategy-path/.
