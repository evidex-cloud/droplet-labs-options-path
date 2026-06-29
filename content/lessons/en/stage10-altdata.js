export default {
  id: "alt-data-nlp",
  stage: 10,
  order: 4,
  title: "Alt-Data & NLP: Signals from News & Filings",
  difficulty: 3,
  prereqs: ["ml-vol-forecast"],

  oneLiner:
    "Beyond price, the world hides information: **news, earnings-call transcripts, social media, options flow** — this is **alternative data (alt-data)**. **NLP / large language models** can read this **text** into a **number**: a sentiment score, an extracted event, a shift in tone. It's especially useful for an options person — because text often foretells **volatility** (earnings, M&A, regulation). But stay clear-eyed: **any signal decays and gets crowded** — once everyone uses the same signal, the alpha is arbitraged away. This lesson covers how to turn text into a tradable signal, and the pits along the way.",

  intuition: `
So far, almost everything we feed our models has been **price-type data**: historical volatility, IV, the VIX, volume (Stage 10.1). But the market moves, and the root cause is often **beyond price** — a breaking headline, the wording of an earnings report, a CEO's evasiveness on a call, a sudden burst of discussion on Reddit. **These non-price, non-traditional sources are collectively called "alternative data":** news headlines, **earnings-call transcripts**, social-media sentiment, satellite imagery, credit-card flows, even options order flow (Stage 8.5).

The problem is that most of this is **unstructured text** the model can't eat directly. Take "management remains 'cautiously optimistic' about next quarter's demand" — is that bullish or bearish? How much "caution," how much "optimism"? A human can read the tone, but to quantify tens of thousands of texts across thousands of stocks every day in real time, **you can only let a machine read it.** This is exactly the stage for **NLP (natural language processing)** and today's **large language models (LLMs)**: **turning text into a number.**

- **Sentiment scoring**: map a passage to −1 (extremely negative) through +1 (extremely positive) — e.g., "earnings miss, guidance cut" → −0.8, "beat expectations, raised full-year" → +0.7.
- **Event extraction**: identify structured events from text — "earnings next week," "received a takeover offer," "FDA approval granted," "CEO departed."
- **Shifts in tone/uncertainty**: the density of words like "uncertainty / risk / challenges" in a transcript often foretells **rising volatility.**

Wire it back to the options person's core concern (Stage 8.2): **the most valuable part of text is often not predicting direction but predicting 'something's coming / a big move' — that is, volatility.** Pre-earnings wording, the density of M&A rumors, breaking regulatory news — all bear directly on whether IV should be rich and whether a straddle should be bought (Stage 7.1). A signal that can quantify "this firm's wording is unusually tense" during earnings season is extremely valuable for **going long or short volatility.**

A concrete example: your system scans 6 items ahead of a stock's earnings — 3 mildly positive sell-side notes, 1 supply-chain worry, 1 insider buy, 1 "unusually cautious tone on the call." The LLM scores and weights each into an aggregate, yielding a **composite sentiment of +0.15 (mildly bullish) but with elevated uncertainty.** Combined with the current IV, you get an actionable leaning: mildly bullish on direction, but **volatility may be underpriced** — perhaps buying a slightly bullish calendar or straddle suits better. This is not a crystal ball; it is **compressing a stack of text into one backtestable number.**

But please carve the two most important warnings up front:

- **Signals decay**: once a piece of news is published, the information is rapidly digested into the price, and the alpha's half-life may be only minutes to days.
- **Signals get crowded**: when a signal becomes widely known (e.g., "buy stocks with rising pre-earnings IV"), too many people pile in and its return is flattened or even reversed. **Alt-data's alpha is scarce and perishable.**

**In this lesson we break alt-data and NLP into five pieces:**

- **① What alt-data is: sources of information beyond price**
- **② How NLP / LLMs turn text into numbers: sentiment, events, tone**
- **③ Turning text signals into tradable strategies (especially for volatility/earnings)**
- **④ Signal decay and crowding: why alpha disappears**
- **⑤ Pitfalls: look-ahead bias, noise, overfitting, data quality and cost**
`,

  mechanics: `
### ① What alt-data is

**Alternative data = sources beyond traditional fundamental/price data that reflect fundamentals or sentiment.** Common categories:

- **News and news flow**: headlines, Reuters/Bloomberg alerts, announcements. Breaking news is a direct trigger of volatility.
- **Earnings-call transcripts**: management's wording, dodges in the Q&A, tone — extremely information-dense, and the text is quantifiable.
- **Social media / forums**: discussion volume and sentiment on Twitter/X, Reddit (the source of meme stocks; Stage 8.5's gamma squeezes are often ignited here), StockTwits.
- **Options flow**: unusual large orders, call/put ratios, changes in open interest — the market's own "text."
- **More broadly**: satellite imagery (parking-lot traffic, oil tanks), credit-card spending, hiring data, app downloads, web-scraped prices.

Their common selling point is **incremental information**: a viewpoint independent of, or ahead of, the price's reaction. Their common pain points are **unstructured, noisy, expensive to obtain, and easy to overfit.**

### ② NLP / LLMs turn text into numbers

Making text computable has gone through three generations technologically, and understanding their differences helps you judge signal quality:

- **(a) Lexicon methods**: score words in advance (such as finance's famous **Loughran-McDonald dictionary**, which marks "lawsuit, decline, loss" as negative). Simple, transparent, fast, but blind to context and negation ("not bad" gets misjudged).
- **(b) Classic machine learning / word embeddings**: train a classifier on labeled data, or use word2vec/embeddings to capture semantics. Stronger than a lexicon, but still limited.
- **(c) Large language models (LLMs)**: today's workhorse. They **understand context, negation, sarcasm, and industry jargon**, can output "sentiment +0.3, high uncertainty, mentions supply-chain risk" directly on a transcript, and even **extract structured events** and **summarize key points.** This is a qualitative leap for NLP on financial text.

An LLM's typical outputs fall into three kinds:

- **Sentiment score**: continuous or categorical (positive/neutral/negative), aggregable by sentence, paragraph, or document.
- **Event labels**: earnings, M&A, rating changes, lawsuits, management changes… turning unstructured text into a structured event stream.
- **Uncertainty/risk tone**: measuring "risk-word density" and "how much management dodges" — **this kind is especially useful for forecasting volatility** (Stage 10.1).

> The key reminder: **an LLM is not a truth machine — it "hallucinates," carries bias, and is sensitive to prompts.** Treat its output as a **noisy feature**, not an established fact — afterward you must use rigorous backtesting to check whether it actually has predictive power (Stages 9.6, 10.5).

### ③ Turning text signals into tradable strategies

With "text → number," how do you turn it into trades? A typical pipeline:

1. **Aggregate into one signal**: **weight and combine** the multiple text scores for a given stock at a given moment (by source credibility, recency, relevance) into a composite sentiment/event intensity — say a continuous value of −1…+1.
2. **Threshold into an action**: above +0.4 → bullish leaning; below −0.4 → bearish leaning; absolute value not high but **uncertainty spiking** → **long-volatility** leaning. The threshold is a hyperparameter to be set out-of-sample (the demo on the right lets you drag this threshold).
3. **Map to an options structure** (this is the options person's edge):
   - Text foretells **a big event with unclear direction** (dense earnings, approvals, M&A rumors) → volatility may be underpriced → **buy a straddle/strangle or calendar** (Stages 7.1, 7.4).
   - Text shows **risk fading, bad news exhausted** → volatility may be overpriced → **sell volatility** (iron condor, credit spread).
   - Strongly directional with sufficient evidence → express direction with a **vertical spread**, saving on Theta versus naked long options.
4. **Combine with price-type signals and risk control**: text signals are rarely used alone, often combined with momentum, volatility forecasts (Stage 10.1), and position sizing (Stage 8.1).

> Why alt-data fits options especially well: **options trade 'possibility and volatility,' and text happens to carry 'possibility not yet reflected in the price.'** Especially in **earnings and event-driven** scenarios, whoever can quantify the uncertainty in text into a judgment of "should IV be rich or cheap" faster and more accurately has the edge.

### ④ Signal decay and crowding

This is alt-data's most counterintuitive — and most lethal — piece. **The moment a signal is discovered, it begins to die.**

- **Decay (alpha decay)**: once information is public, it's rapidly digested into the price. News-type signals can have an **extremely short** half-life (minutes); be a step slow and the alpha is gone. This forces you to either compete on **speed** (low latency, automation) or find signals that are **digested more slowly** (such as a subtle tone buried deep in a long transcript).
- **Crowding**: as more and more people use the **same signal**, its return is divided up, arbitraged away, and ultimately **flattened or even reversed.** A classic example: the moment a sentiment-factor paper is published, the effect decays significantly — because everyone starts using it. **The more public and easily reproduced the signal, the thinner the alpha.**
- **The backlash of data democratization**: when an alt-data vendor sells the data to everyone, that data's informational edge is diluted. **Exclusivity, depth of processing, and speed** are the moat.

> The cold conclusion: **alt-data's alpha is scarce, perishable, and competed away.** It is not a once-and-for-all money printer but a **continuous arms race** — you must keep finding new data and new angles, and accept the decay of old signals. Think this through clearly, and you won't overpay for one pretty historical backtest.

### ⑤ The pitfall checklist

Alt-data is a disaster zone for overfitting and self-deception, and every item below has burned countless people:

- **Look-ahead bias**: using data you "couldn't actually have had at the time." News has a **publish-timestamp** trap (revised versions in the database, back-filled sentiment scores), and social media has a **survivorship/deletion** problem. You must use **point-in-time** data, strictly aligned to what you **could actually see at the time** (Stage 10.1's leakage problem repeats here).
- **Noise and low signal-to-noise**: social media is full of shills, jokes, and bots; news has duplicates and clickbait. Sentiment scores are often **noise ≫ signal.**
- **Overfitting**: alt-data is high-dimensional with relatively few samples, making it very easy to find **spuriously effective** false relationships in history. You must use walk-forward validation and leave ample out-of-sample (Stage 9.6).
- **Sparsity and uneven coverage**: large caps have lots of news, small caps almost none; event-type signals are highly sparse and hard to make statistically significant.
- **Cost and infrastructure**: quality alt-data is expensive and needs data pipelines, cleaning, alignment, storage — **what a retail trader can realistically play with is mostly lightweight combos like public news + an LLM** (Stages 10.5, 11.5); heavy alt-data is mostly an institutional battlefield.
- **The LLM's own risks**: hallucination, prompt sensitivity, score drift from version changes, and the possibility of leaking **future information** through pre-training (especially be wary when using an LLM to evaluate historical text).

> The honest posture: **treat alt-data/NLP as 'one more noisy, decaying signal source,' not a Holy Grail.** It can give you a small edge in event/volatility scenarios, but it must pass the same rigorous validation, anti-leakage, and anti-overfitting as price signals, and you must always be ready for its alpha to be eaten by competition.

Stringing the five pieces together: **alt-data is information beyond price (news, transcripts, social media, options flow); NLP/LLMs turn this text into numbers — sentiment, events, risk tone (tone especially foretells volatility); aggregate + threshold + map to an options structure (lean toward volatility in event/earnings scenarios) and you have a tradable signal; but any signal decays and gets crowded, and alpha is scarce and perishable; and look-ahead bias, noise, overfitting, data cost, and LLM hallucination are densely packed pits.** In the next lesson, we upgrade the LLM from a "signal source" to a "research and coding assistant," and see how a modern retail trader builds a whole workflow with agents (Stage 10.5).
`,

  demo: "sentiment-signal",

  analogy: `
Mining signals from news and earnings is like **being an excellent poker player who reads tells.**

At the table, what an opponent says out loud (= the company's official wording, the news headline) is only part of it; the real information hides in **micro-expressions, tone, betting rhythm** — a sudden hesitation, an over-emphasized phrase, a slight tremor of the fingers. **A pro reads these non-verbal "texts" into a judgment in real time**: "they're bluffing this hand" or "they're strong this hand." This is exactly what **NLP/LLMs do**: read management's evasive wording on the call, the tone of the news, the forum's frenzy, into a **sentiment/uncertainty score.**

But the table also teaches three iron laws of alt-data:

- **You're reading 'information not yet revealed'**: a tell's value is that it **precedes** the cards exposing the truth — just as a text signal's value is that it carries possibility **not yet reflected in the price.** Once the cards are shown (= the news is digested by the market), the tell is useless (= **signal decay**).
- **The same tell, read by too many, stops working**: if the whole table sees that touching his nose = a bluff, he either drops it or exploits it in reverse. **A tell everyone understands is no longer a tell** — that is **signal crowding.**
- **Tells are full of noise and can deceive**: some people naturally love to touch their nose, some deliberately put on a reverse act. Take every gesture at face value and you'll lose badly — **sentiment scores are noise ≫ signal, and must be rigorously validated** lest a fake tell lead you astray.

> One line: reading news sentiment is like reading table tells — **you capture information not yet revealed (ahead of the price), but tells expire (decay), get seen through by the whole table (crowding), and are often fakes (noise).** Used well it's a marginal edge; treated as gospel it backfires.
`,

  misconceptions: [
    "**\"Buy on positive sentiment, sell on negative — just follow it.\"** — Too naive. Sentiment scores are **extremely noisy**, the threshold must be set out-of-sample, and for an options person, **text foretelling 'volatility' is often more valuable than foretelling 'direction'** — high uncertainty often means you should go long volatility (buy a straddle), not simply chase long/short (Stages 8.2, 7.1).",
    "**\"A good alt-data signal can make stable money over the long run.\"** — Signals **decay and get crowded**: once information is public it's digested into the price (the alpha half-life can be extremely short), and as more people use it, the return is arbitraged flat or even reversed. Alt-data is a **perishable arms race**, not a once-and-for-all money printer.",
    "**\"The sentiment score an LLM gives is objective fact and can be trusted directly.\"** — No. An LLM **hallucinates**, carries bias, is prompt-sensitive, and its scores drift the moment the version changes. Its output is a **noisy feature** that must be rigorously backtested like any signal (Stage 9.6), never taken as truth.",
    "**\"To backtest historical news, if the database has it, you can use it.\"** — Beware **look-ahead bias**: the database's news may be a **revised/back-filled** sentiment score, and a timestamp isn't the moment you could actually see it. You must use **point-in-time** data, strictly aligned to information available at the time, or the backtest is time-traveling self-deception (Stage 10.1).",
    "**\"Retail can crush institutions with heavy alt-data (satellites, credit-card flows).\"** — The reality is that quality alt-data is **expensive and needs heavy infrastructure**, mostly an institutional battlefield. What retail can use well is mainly lightweight combos like **public news + an LLM** (Stages 10.5, 11.5) — a marginal edge, but don't fantasize about single-handedly fighting the professional army with it.",
  ],

  quiz: [
    {
      q: "Which of the following **does not** belong to typical \"alternative data (alt-data)\"?",
      options: [
        "The wording and tone of earnings-call transcripts",
        "Discussion volume and sentiment on social media (Reddit/X)",
        "The standard financial-statement figures a company discloses in its 10-K",
        "News headlines and breaking-alert flow",
      ],
      answer: 2,
      explain: "The **standard financial-statement figures** in a 10-K are **traditional** fundamental data. Alt-data refers to non-traditional sources beyond price/standard filings: news, call transcripts, social-media sentiment, options flow, satellite imagery, credit-card flows, etc. — mostly unstructured and needing NLP/LLM processing.",
    },
    {
      q: "For an options trader, extracting signals from text (such as the tone of an earnings transcript) usually has its **most unique value** in what?",
      options: [
        "Precisely predicting tomorrow's closing price",
        "Foretelling 'something's coming / a big move' — i.e., volatility — so as to judge whether IV is cheap or rich and whether to buy or sell volatility (e.g., buy a pre-earnings straddle)",
        "Replacing the Black-Scholes formula to price options directly",
        "Guaranteeing the detection of all insider trading",
      ],
      answer: 1,
      explain: "Text (especially risk/uncertainty tone) often foretells **volatility**, not reliable direction. Options trade possibility and volatility, so quantifying text into a judgment of \"should IV be rich\" and **going long/short volatility** on that basis (straddles, iron condors, etc.) is alt-data's best fit for an options person (Stages 8.2, 7.1, 10.1).",
    },
    {
      q: "What do \"signal decay (alpha decay)\" and \"signal crowding\" each refer to?",
      options: [
        "Decay = the model code is outdated; crowding = the server is overloaded",
        "Decay = once information is public it's rapidly digested into the price and the alpha disappears over time; crowding = more people use the same signal and the return is divided up, arbitraged, or even reversed",
        "Decay = volatility falls; crowding = volume rises",
        "They are synonyms, both meaning data gets more expensive",
      ],
      answer: 1,
      explain: "**Decay**: once a piece of information is public, the market digests it into the price, and the alpha has a half-life and disappears over time. **Crowding**: when too many people use the same (especially public, easily reproduced) signal, the return is divided up, arbitraged, and ultimately flattened or even reversed. Both make alt-data's alpha **scarce and perishable.**",
    },
    {
      q: "When backtesting with historical news/social-media sentiment, which is the most important \"look-ahead bias\" trap to watch for?",
      options: [
        "Using the past 60 days' moving average of sentiment as a feature",
        "The database's sentiment score may be retroactively revised/back-filled, and the timestamp isn't the moment you could actually see it at the time — equivalent to peeking at the future",
        "Standardizing the sentiment score to −1…+1",
        "Taking a weighted average over multiple news items",
      ],
      answer: 1,
      explain: "Look-ahead bias = using information you couldn't actually have had at the time. News/sentiment databases often contain **revised or back-filled** scores, and the publish timestamp isn't the moment you could **actually see** it; without **point-in-time** data strictly aligned, the backtest inflates and collapses on going live (same lineage as Stage 10.1's label/data leakage).",
    },
  ],

  further: [
    { label: "Loughran & McDonald: financial sentiment dictionary (the classic benchmark for 10-K text sentiment)", url: "https://sraf.nd.edu/loughranmcdonald-master-dictionary/" },
    { label: "Investopedia: Alternative Data", url: "https://www.investopedia.com/terms/a/alternative-data.asp" },
    { label: "Tetlock (2007): Giving Content to Investor Sentiment (the classic empirical study of media sentiment and the stock market)", url: "https://onlinelibrary.wiley.com/doi/10.1111/j.1540-6261.2007.01232.x" },
  ],
};
