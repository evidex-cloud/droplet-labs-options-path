---
id: llm-signals
prereqs: earnings-events, vol-forecasting, backtesting, rl-market-making
demo: llm-signals
---

# LLMs, News & Alternative-Data Signals

## @hook
A language model can read ten thousand earnings-call transcripts overnight and score every one. Reading is not the hard part. The hard part is proving the scores predict anything once every way a backtest can cheat is removed — and language models add a new cheat of their own: they may already have read what happened next.

## @bridge
[[earnings-events]] showed how the straddle prices an implied earnings move and how implied volatility collapses afterwards. [[vol-forecasting]] forecast realized volatility with models like GARCH and HAR and insisted on honest evaluation. [[backtesting]] catalogued look-ahead, overfitting and costs. This lesson adds a new input to the forecast: **text** — news, transcripts, filings — and the alternative data around it. It builds Idea ③ (volatility: the target is whether the move will be bigger or smaller than the one the options already price) and, like [[rl-market-making]], it ends with an honest scorecard rather than a promise.

## @intuition
Start with one headline.

> [!KAI] Kai reads the news before earnings
> Three days before XYZ reports, Kai sees: *“XYZ CFO departs; regulator opens probe into revenue timing.”* The weekly straddle that expires just after the report costs $5.75, as in [[earnings-events]] — the market expects a move of about ±5.75%. Kai wonders: does bad-sounding news mean the real move will be bigger than 5.75%, so the straddle is cheap? That is exactly the question a text signal tries to answer — and exactly the question where people most easily fool themselves.

A text signal turns words into a number, then asks whether the number predicts something tradable. For options the natural target is not the direction of the stock but **the size of the move relative to the implied move**: call it \(m = \text{realized move} / \text{implied move}\). If \(m > 1\) a straddle buyer wins; if \(m < 1\) the seller wins ([[straddle-strangle]]).

The simplest scorer is a **dictionary**: count words that signal uncertainty (probe, withdraws, delay) and subtract words that signal calm (reaffirms, steady). Try it:

::demo[llm-signals-score]

The dictionary is transparent and cheap, but it counts words rather than reading sentences — “not uncertain” scores as uncertain. Two more powerful tools address that:

- **Embeddings** turn a sentence into a list of a few hundred numbers (a vector) such that sentences with similar meaning land close together. A regression on those vectors can learn which kinds of news go with big moves.
- **Large language models (LLMs)** can be *asked*: “Does this transcript suggest the company is less certain about next quarter than last time? Answer from −2 to +2.” They handle negation, sarcasm and jargon far better than a word list.

More power brings more ways to go wrong. The main demo builds a synthetic world of 480 earnings events from 2019 to 2026, each with two pre-earnings headline phrases whose tone is only *weakly* related to the size of the eventual move — roughly what real studies of text and volatility find. It then shows three things: a real but small predictive signal; how quickly costs and the variance risk premium swallow it; and what happens when the model scoring the headlines was trained on data that runs past the test dates.

> [!THINK] A backtest scores 2019–2024 headlines with an LLM whose training data runs to 2025. The signal's information coefficient is 0.56 before 2025 and 0.12 afterwards. What most likely happened?
> Predict before you open the answer.
> ---
> The model had read the aftermath. For events before its training cutoff, articles like “shares plunged 14% after results” were part of its training text, so its “sentiment” quietly includes the outcome. After the cutoff it has only the headline, and the IC drops to the honest level. A signal that falls off a cliff exactly at the model's training cutoff is the fingerprint of this leak.

We'll take it in five parts:

- **① From text to numbers: dictionaries, embeddings, LLMs**
- **② What to predict: moves relative to the implied move**
- **③ Measuring a signal: IC, regression, costs and a baseline**
- **④ Leakage: the model that has read the future**
- **⑤ Alternative data and the state of play in 2026**

## @mechanics
### ① From text to numbers: dictionaries, embeddings, LLMs

Every text signal is a pipeline: collect the text with an exact timestamp, clean it, turn it into a number, and only then test it.

<figure>
<svg viewBox="0 0 680 250" role="img" aria-label="Text-signal pipeline with the places leaks enter">
<defs><marker id="llm-signals-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="15" y="60" width="120" height="70" rx="8" class="fx-box2"/>
<text x="75" y="88" text-anchor="middle" class="fx-t-b">Text sources</text>
<text x="75" y="106" text-anchor="middle" class="fx-t-sm">news, calls, filings</text>
<rect x="150" y="60" width="120" height="70" rx="8" class="fx-box"/>
<text x="210" y="88" text-anchor="middle" class="fx-t-b">Timestamp</text>
<text x="210" y="106" text-anchor="middle" class="fx-t-sm">when was it public?</text>
<rect x="285" y="60" width="120" height="70" rx="8" class="fx-hl"/>
<text x="345" y="88" text-anchor="middle" class="fx-t-b">Scorer</text>
<text x="345" y="106" text-anchor="middle" class="fx-t-sm">words, vectors, LLM</text>
<rect x="420" y="60" width="120" height="70" rx="8" class="fx-box"/>
<text x="480" y="88" text-anchor="middle" class="fx-t-b">Evaluate</text>
<text x="480" y="106" text-anchor="middle" class="fx-t-sm">IC, costs, baseline</text>
<rect x="555" y="60" width="110" height="70" rx="8" class="fx-box2"/>
<text x="610" y="88" text-anchor="middle" class="fx-t-b">Trade?</text>
<text x="610" y="106" text-anchor="middle" class="fx-t-sm">straddle or not</text>
<line x1="135" y1="95" x2="148" y2="95" class="fx-line" marker-end="url(#llm-signals-ah)"/>
<line x1="270" y1="95" x2="283" y2="95" class="fx-line" marker-end="url(#llm-signals-ah)"/>
<line x1="405" y1="95" x2="418" y2="95" class="fx-line" marker-end="url(#llm-signals-ah)"/>
<line x1="540" y1="95" x2="553" y2="95" class="fx-line" marker-end="url(#llm-signals-ah)"/>
<rect x="150" y="160" width="120" height="44" rx="6" class="fx-bad"/>
<text x="210" y="178" text-anchor="middle" class="fx-t-sm">leak: revised or</text>
<text x="210" y="194" text-anchor="middle" class="fx-t-sm">late-stamped text</text>
<rect x="285" y="160" width="120" height="44" rx="6" class="fx-bad"/>
<text x="345" y="178" text-anchor="middle" class="fx-t-sm">leak: training data</text>
<text x="345" y="194" text-anchor="middle" class="fx-t-sm">past the test date</text>
<rect x="420" y="160" width="120" height="44" rx="6" class="fx-bad"/>
<text x="480" y="178" text-anchor="middle" class="fx-t-sm">leak: many prompts</text>
<text x="480" y="194" text-anchor="middle" class="fx-t-sm">tried, best reported</text>
<line x1="210" y1="158" x2="210" y2="132" class="fx-line-bad" marker-end="url(#llm-signals-ah)"/>
<line x1="345" y1="158" x2="345" y2="132" class="fx-line-bad" marker-end="url(#llm-signals-ah)"/>
<line x1="480" y1="158" x2="480" y2="132" class="fx-line-bad" marker-end="url(#llm-signals-ah)"/>
<text x="340" y="36" text-anchor="middle" class="fx-t-sm">each arrow must only use information that existed at the decision time</text>
<text x="340" y="232" text-anchor="middle" class="fx-t-bad">three places the future sneaks in</text>
</svg>
<figcaption>Figure 1 · The pipeline, and where leaks enter. A headline edited after the move, a model that trained on the aftermath, or a researcher who tried fifty prompts and kept the best one all produce signals that look brilliant in a backtest and vanish in live trading.</figcaption>
</figure>

The three scorers differ in what they can read:

- **Dictionary counts.** Fixed word lists. In finance the standard lists come from Loughran and McDonald (2011), who showed that general-purpose negative-word lists misread financial text: words such as “tax”, “cost” or “liability” are routine in a filing, not bad news. Transparent, reproducible, blind to context.
- **Embeddings.** A model maps each text to a vector \(\mathbf u\). Texts with similar meaning have vectors pointing the same way, measured by cosine similarity:

$$
\cos(\mathbf u, \mathbf v) = \frac{\mathbf u \cdot \mathbf v}{\lVert \mathbf u \rVert\,\lVert \mathbf v \rVert}
$$

where \(\mathbf u \cdot \mathbf v\) multiplies the two vectors entry by entry and adds the results, and \(\lVert \mathbf u \rVert\) is a vector's length. The value runs from −1 to 1; near 1 means “says nearly the same thing”. For example, with toy three-number vectors \(\mathbf u = (0.8, 0.1, 0.6)\) for “guidance withdrawn” and \(\mathbf v = (0.7, 0.2, 0.7)\) for “outlook pulled”, \(\mathbf u \cdot \mathbf v = 0.56 + 0.02 + 0.42 = 1.00\), the lengths are \(\sqrt{1.01} \approx 1.005\) and \(\sqrt{1.02} \approx 1.010\), so the cosine is about 0.985 — the two phrases are treated as near-synonyms even though they share no word. A regression on embeddings can therefore generalize from “withdrawn” to “pulled”, which a word list cannot.
- **LLM scoring and extraction.** A prompt asks the model to rate or classify the text, or to extract an *event* (“guidance withdrawn: yes/no”, “new regulatory probe: yes/no”). Event flags are often more useful than a general tone score, because specific events have specific volatility consequences.

> [!WARN] LLMs can invent facts
> Asked to summarize a transcript, an LLM may state a number or a quote that is not in it (“hallucination”). For a signal that feeds trades, prefer *extraction with evidence*: require the model to quote the sentence it relied on, and check automatically that the quote exists in the source. Scores that cannot be traced to text should not reach a trade.

### ② What to predict: moves relative to the implied move

For options, a text signal is only useful if it tells you something the option price does not already say. The straddle already prices an expected move, so the target is the ratio

$$
m_i = \frac{\lvert R_i \rvert}{\text{IM}_i}, \qquad m_i = a + b\,s_i + \varepsilon_i
$$

where \(R_i\) is the stock's return over event \(i\) (for example the close-to-close move across the earnings report), \(\text{IM}_i\) the implied move from the straddle before the event, \(s_i\) the text score, \(a, b\) regression coefficients and \(\varepsilon_i\) everything the score does not explain. A useful signal has \(b > 0\) with a convincing \(t\)-statistic; the same idea extends a volatility forecast such as HAR ([[vol-forecasting]]) by adding the score as one more explanatory variable.

> [!EXAMPLE] The demo's regression
> On all 480 synthetic events: \(\hat m = 0.916 + 0.045\,s\) with \(t = 2.9\). An event scoring \(s = +2\) is forecast at \(\hat m = 0.916 + 0.09 = 1.006\); one scoring \(s = -2\) at \(0.916 - 0.09 = 0.826\). With Kai's 5.75% implied move, that is a forecast realized move of 5.78% versus 4.75%. Real, but modest — and notice that even the most alarming headlines only bring the forecast up to roughly the implied move.

### ③ Measuring a signal: IC, regression, costs and a baseline

The standard first measure is the **information coefficient** (IC): the rank correlation between the score and what happened next,

$$
\text{IC} = \operatorname{corr}_{\text{rank}}\big(s_i,\ m_i\big), \qquad t \approx \text{IC}\,\sqrt{N}
$$

where “rank” means both lists are replaced by their ranks before correlating (so a few extreme events cannot dominate), and \(N\) is the number of independent events. The second formula is a rough significance check: with \(N = 480\) and \(\text{IC} = 0.115\), \(t \approx 0.115 \times \sqrt{480} \approx 2.5\). In quantitative investing, ICs of a few hundredths up to about 0.1 are often considered useful; an IC of 0.5 on event data should make you suspicious, not excited.

A significant IC is not a profit. The demo's trades, per contract, with a $500 straddle and a 4% round-trip cost ($20):

| Rule (clean scorer, 2019–2026) | Trades | Mean P&L per trade | Same side, every event (baseline) |
|---|---|---|---|
| Buy the straddle when \(s \ge 1\) | 149 | −$24.90 | −$63.50 |
| Sell the straddle when \(s \le -1\) | 175 | +$48.00 | +$23.50 |

Two things are going on. The signal works in both rows: it improves on the unconditional baseline by roughly $25–40 a trade. But the simulation, like real markets on average ([[variance-risk-premium]]), prices straddles slightly above the moves that follow (\(m\) averages 0.91), so buying volatility starts deep in the hole and the signal is not strong enough to climb out. Selling on calm headlines adds the signal to the premium — and carries the short-volatility tail risk that this lognormal simulation understates. **Always report the signal against the right baseline and after costs.**

### ④ Leakage: the model that has read the future

Leakage means information from after the decision time slipping into the backtest ([[backtesting]]). Text has three special routes:

- **Training-data look-ahead.** A general-purpose LLM is trained on text up to some cutoff date. For any event before the cutoff, the model may have read the aftermath — the next day's headlines, the analyst notes, the price chart described in words. Its “reading” of the pre-event headline is contaminated by memory. Glasserman and Lin (2023) tested this on GPT sentiment scores of news headlines and found a twist: inside the training window, headlines with the company names removed gave a *better* signal than the originals — what the model already knew about famous companies distracted it more than remembered outcomes helped. Outside the window the look-ahead problem went away. Anonymizing names and dates is therefore both a test for this leak and a partial defense.
- **Timestamp leakage.** News archives often store the *latest* version of a story. A headline edited after the move (“…; shares slide 9%”) looks like a pre-event headline unless you have the original timestamp and text.
- **Research leakage.** Trying fifty prompts, ten models and five thresholds, then reporting the best, is multiple testing ([[backtesting]]); the best of many noisy results is biased upward.

The demo's leak switch simulates the first route: before 2025, the scorer's output quietly includes a piece of the standardized outcome; from 2025, it does not.

> [!EXAMPLE] The cliff at the cutoff
> Buying the straddle when \(s \ge 1\), with 4% costs. Leaky scorer: IC **0.56** before 2025, 97 trades averaging **+$79.80** with a 56% win rate — and **0.12** from 2025, 27 trades averaging **−$28.20** with a 30% win rate. The regression \(t\)-statistic on the full sample is 13.6, against 2.9 for the clean scorer. Nothing about the strategy changed at the cutoff; only the model's memory ran out.

<figure>
<svg viewBox="0 0 660 250" role="img" aria-label="Cumulative P&L of the leaky and clean scorers around the training cutoff">
<line x1="70" y1="120" x2="625" y2="120" class="fx-axis"/>
<line x1="70" y1="20" x2="70" y2="185" class="fx-axis"/>
<rect x="500" y="20" width="125" height="165" class="fx-area-bad"/>
<line x1="500" y1="20" x2="500" y2="185" class="fx-line fx-dash"/>
<text x="512" y="86" class="fx-t-bad">after the</text>
<text x="512" y="102" class="fx-t-bad">model's cutoff</text>
<polyline points="70,120 70,122 72,114 73,111 79,108 80,111 81,108 88,109 91,108 95,110 97,110 99,112 101,112 108,111 112,111 117,108 119,107 123,102 125,101 127,102 138,99 142,98 149,98 162,97 165,94 178,94 180,91 181,87 190,84 193,82 195,82 197,85 199,86 206,83 209,80 211,80 218,80 220,78 221,80 222,80 224,79 230,82 232,83 233,86 234,84 235,80 243,80 244,80 245,78 249,77 250,73 251,74 252,73 254,70 260,73 271,67 276,69 293,65 297,65 300,66 315,68 329,68 338,68 344,65 346,66 350,63 364,60 368,60 369,58 370,60 382,60 384,58 386,58 390,59 394,60 398,62 401,60 405,59 406,59 411,60 415,62 416,61 418,58 419,61 425,62 430,64 444,62 454,60 456,61 461,61 466,58 471,57 473,50 474,47 477,43 488,42 489,42 491,43 502,44 504,47 505,47 509,43 511,45 524,44 525,45 528,47 532,49 533,48 540,49 546,50 550,52 555,55 559,57 560,51 563,49 566,50 571,51 572,53 578,53 584,47 587,47 598,49 603,49 605,49 606,50" class="fx-line-bad"/>
<polyline points="70,120 70,122 71,125 72,117 73,113 80,116 88,116 91,116 93,120 95,122 97,122 99,124 101,124 102,127 108,126 112,126 119,125 125,124 127,125 135,127 139,129 142,127 148,129 149,129 155,131 159,133 162,132 173,134 177,136 178,136 180,133 181,129 186,132 188,134 190,130 193,128 194,129 195,130 197,133 199,133 206,131 211,131 218,131 219,133 220,131 221,133 222,133 224,132 230,135 232,136 233,139 234,137 235,133 243,133 244,133 249,132 250,128 251,129 252,128 254,125 257,127 260,129 271,124 274,125 276,127 287,129 293,125 297,125 300,126 305,129 314,131 315,133 326,135 329,135 336,137 338,137 344,134 346,135 350,132 351,134 352,138 355,138 363,139 364,136 368,136 369,134 370,136 371,137 382,137 384,135 386,136 390,136 394,137 395,140 398,142 401,139 405,139 406,139 408,140 411,140 414,144 415,146 416,145 418,142 419,145 422,147 425,148 430,150 441,151 444,150 445,152 450,154 454,153 456,153 457,155 461,156 471,155 473,148 488,147 489,146 491,147 492,149 499,149 502,151 504,154 505,154 509,150 511,152 524,151 525,152 528,154 532,156 533,155 540,156 546,156 550,159 555,162 559,164 560,157 563,156 566,157 571,158 572,160 578,160 584,154 587,154 598,156 603,156 605,156 606,157" class="fx-line-hl"/>
<text x="62" y="124" text-anchor="end" class="fx-t-sm">$0</text>
<text x="62" y="74" text-anchor="end" class="fx-t-sm">+$5k</text>
<text x="62" y="24" text-anchor="end" class="fx-t-sm">+$10k</text>
<text x="62" y="174" text-anchor="end" class="fx-t-sm">−$5k</text>
<text x="70" y="202" text-anchor="middle" class="fx-t-sm">2019</text>
<text x="213" y="202" text-anchor="middle" class="fx-t-sm">2021</text>
<text x="357" y="202" text-anchor="middle" class="fx-t-sm">2023</text>
<text x="500" y="202" text-anchor="middle" class="fx-t-sm">2025</text>
<text x="90" y="40" class="fx-t-bad">leaky scorer: +$7,744 by the cutoff</text>
<text x="200" y="175" class="fx-t-hl">clean scorer: a slow bleed</text>
<text x="345" y="232" text-anchor="middle" class="fx-t-sm">cumulative P&amp;L per contract, buy the straddle when s ≥ 1, 4% costs (demo data)</text>
</svg>
<figcaption>Figure 2 · Same trades, same rule, two scorers. The leaky one climbs almost in a straight line until its training data runs out, then stalls and turns down. The clean one tells the truth all along: the signal is real but too weak to pay for the straddle and the costs.</figcaption>
</figure>

Defenses: use models whose training cutoff precedes the whole test period (or point-in-time models retrained on data available at each date); treat any result before the cutoff as in-sample; store raw text with first-seen timestamps; fix prompts, models and thresholds *before* looking at test data; and paper-trade the signal after the model's cutoff before risking money ([[ai-agents]]).

### ⑤ Alternative data and the state of play in 2026

Text is one kind of **alternative data** — information beyond prices, volumes and company filings. Others include card-spending panels, web traffic, app downloads, shipping and satellite images. For options traders, the useful question is always the same: does the data predict the *size* of the move (or a volatility regime) better than the implied volatility already does, after costs and out of sample?

Practical limits come up quickly:

- **Cost and decay.** Good data is expensive, and once many funds buy it, whatever it predicted gets priced into the options.
- **Legal and ethical limits.** Data scraped against a website's terms, or containing material non-public information, can create legal risk regardless of how it performs.
- **Coverage and survivorship.** Archives often drop delisted companies and deleted articles, flattering backtests ([[options-data]]).
- **Evaluation noise.** A few hundred earnings events per year cannot separate an IC of 0.05 from zero with confidence; many studies are underpowered.

As of 2026, LLMs are widely used in research workflows — summarizing filings and calls, tagging events, drafting code — and there is a growing academic literature testing text signals. Lopez-Lira and Tang (2023), for example, reported that ChatGPT's scores of news headlines predicted next-day stock returns, more strongly for more capable models; note that the target there is the stock's direction, not the size of its move, and that the training-cutoff checks above are exactly what to look for when reading such results. Public, verified evidence that LLM-generated signals earn money in live trading after costs is scarce, and claims that “AI beat the market” should be treated as unproven until they come with out-of-sample results *after* the model's training cutoff. The same caution, extended from signals to systems that act on them, is the subject of [[ai-agents]]; how easily a good story seduces the person running the backtest is a theme from [[trading-psychology]].

## @analogy
Imagine judging a fortune-teller by her past predictions. You hand her a stack of old newspapers — only the front pages from the morning of each event — and ask her to say which days ended in big news. She is astonishingly accurate. Then you learn she spent last year reading the complete archive, including every afternoon edition and every follow-up story. Of course she “predicted” well: she remembered.

A language model scoring old headlines is that fortune-teller. Its training data is the archive. For events before its cutoff, it cannot help partly remembering what followed, even when you show it only the morning headline. The honest test is to hand her *tomorrow's* newspaper — events after anything she could have read — and see how she does. In our demo her accuracy falls from an IC of 0.56 to 0.12 the moment the newspapers are newer than her reading.

Where the analogy breaks: the fortune-teller knows she read the archive and could, in principle, confess. A language model has no reliable way to tell you which of its answers come from memory and which from reasoning — so the burden of proof sits entirely with the person running the test.

## @misconceptions
- **“An LLM reads text better, so its signal must be stronger.”** — Better reading does not create more predictive information. Much of what text says is already in the option price; what remains is usually small, and costs and the variance risk premium take a large share of it.
- **“A statistically significant IC means a profitable strategy.”** — The demo's clean IC of 0.115 (\(t \approx 2.5\)) still loses $24.90 a trade when buying straddles. Profit depends on the baseline, the premium and the costs, not only on the correlation.
- **“If I only show the model the pre-event headline, there is no look-ahead.”** — For events before the model's training cutoff, the model may have read the aftermath. The input is clean; the model is not.
- **“A higher IC in the backtest is always better news.”** — On event data, an IC of 0.5 is far more likely to be leakage than genius. Check whether performance collapses at the model's training cutoff or at the date the archive was last edited.
- **“Alternative data is an edge by definition.”** — Once widely sold, its information is priced in; and legal, coverage and survivorship problems can make its history look better than it was.

## @takeaways
- For options, a text signal must predict the move relative to the implied move, \(m = \lvert R \rvert / \text{IM}\), not just direction.
- Measure with the information coefficient and a regression, then with trades against an unconditional baseline and after costs; a significant IC can still lose money.
- LLMs and embeddings read context far better than word lists but bring new failure modes: invented facts, prompt sensitivity and multiple testing.
- Training-data look-ahead is the signature LLM leak: a signal that collapses at the model's training cutoff was reading the future.
- Treat pre-cutoff results as in-sample, keep first-seen timestamps, fix choices before testing, and paper-trade after the cutoff before risking money.

## @quiz
1. For an options trader, what is the most useful target for a pre-earnings text signal?
   - [ ] Whether the stock will go up or down
   - [x] Whether the realized move will be larger or smaller than the move the straddle implies
   - [ ] The number of news articles about the company
   - [ ] The company's revenue growth
   > The straddle already prices an expected move. A signal is only useful if it says something about the move *relative to* that price, \(m = \lvert R\rvert/\text{IM}\).
2. A signal has an information coefficient of 0.115 over 480 events. Roughly how strong is the statistical evidence?
   - [ ] Overwhelming: \(t \approx 55\)
   - [x] Moderate: \(t \approx 0.115 \times \sqrt{480} \approx 2.5\)
   - [ ] None: an IC below 0.5 is always noise
   - [ ] It cannot be judged without knowing the stock price
   > The rough rule \(t \approx \text{IC}\sqrt{N}\) gives about 2.5 — suggestive, not conclusive, especially if several signals were tried before this one.
3. In the demo, buying straddles when \(s \ge 1\) loses $24.90 a trade even though the signal's IC is positive. Why?
   - [ ] The IC is calculated incorrectly
   - [ ] The signal is negatively correlated with the move
   - [x] Straddles are priced slightly above the moves that follow on average, and the signal plus costs are not enough to overcome that premium
   - [ ] The threshold is too high
   > The signal improves on buying every straddle (−$63.50) by almost $40 a trade, but starts from a variance-risk-premium hole and pays $20 in costs. Real, small signals often live exactly here.
4. A backtest of LLM sentiment shows a stunning result before 2025 and nothing after. The model's training data ends in early 2025. What is the most likely explanation?
   - [ ] The market became more efficient in 2025
   - [x] Before its cutoff the model had effectively read the aftermath of each event, so its scores contained the outcome
   - [ ] There were fewer earnings events after 2025
   - [ ] The LLM was updated to a better version
   > A collapse exactly at the training cutoff is the fingerprint of training-data look-ahead. Treat pre-cutoff results as in-sample.
5. Which practice best protects a text-signal backtest from leakage?
   - [ ] Trying many prompts and keeping the one with the highest IC
   - [ ] Using the newest, most capable model for the whole history
   - [ ] Scoring headlines from a news archive that stores the latest version of each story
   - [x] Fixing prompts and thresholds in advance, using text with first-seen timestamps, and judging the signal only on events after the model's training cutoff
   > The other three each let the future in: multiple testing, a model trained on the aftermath, and edited headlines.

## @further
- [Corsi (2009), A Simple Approximate Long-Memory Model of Realized Volatility (HAR-RV)](https://academic.oup.com/jfec/article/7/2/174/856522) — the baseline volatility forecast that a text score should be added to, not replace.
- [Bollerslev, Tauchen & Zhou (2009), Expected Stock Returns and Variance Risk Premia](https://academic.oup.com/rfs/article-abstract/22/11/4463/1565787) — why implied variance tends to exceed realized, the hole a long-volatility signal starts in.
- [Information coefficient (Wikipedia)](https://en.wikipedia.org/wiki/Information_coefficient) — definition and use in evaluating forecasts.
- [Glasserman & Lin (2023), Assessing Look-Ahead Bias in Stock Return Predictions Generated by GPT Sentiment Analysis (arXiv)](https://arxiv.org/abs/2309.17322) — how to test for the training-cutoff leak, and the “distraction effect” of company names.
- [Lopez-Lira & Tang (2023), Can ChatGPT Forecast Stock Price Movements? (arXiv)](https://arxiv.org/abs/2304.07619) — the widely cited study of LLM headline scores and next-day returns.
- [Loughran & McDonald (2011), When Is a Liability Not a Liability? Textual Analysis, Dictionaries, and 10-Ks](https://doi.org/10.1111/j.1540-6261.2010.01625.x) — the finance-specific word lists behind most dictionary scorers.

## @next
A signal only proposes. What happens when an AI system is allowed to research, write code, backtest and even send orders on its own — and a web page it reads contains an instruction aimed at it? The last lesson of this stage builds the guardrails: [[ai-agents]].
