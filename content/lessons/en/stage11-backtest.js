export default {
  id: "build-backtest",
  stage: 11,
  order: 4,
  title: "Build & Backtest a Strategy",
  difficulty: 3,
  prereqs: ["backtesting", "python-pricing"],

  oneLiner:
    "Turn a strategy (such as a **monthly covered call** or a **short-put wheel**) into backtestable code: prepare the data → fix the rules → run a **per-period P&L loop** → deduct **spread and slippage** (Stage 9.6) → compute CAGR, max drawdown, Sharpe, win rate — then identify the pits with a skeptical eye.",

  intuition: `
You can already price options in Python (Stage 11.3), and you know backtesting has a pile of pits (Stage 9.6). This lesson combines the two: **build a minimal but honest backtest with your own hands** to verify whether a concrete strategy is actually worth doing.

We'll use a classic, simple-rule rent-collecting strategy as the example — a **monthly covered call**, mentioning its close cousin the **short-put wheel** in passing where needed:

> **Hold 100 shares of XYZ (about $100/share). Each month, sell a roughly 30-day, slightly OTM (say 103) call to collect premium; at expiry, settle by the outcome, then sell the next one.** Roll it month after month.

This strategy is good to learn backtesting with because its **rules are extremely clear and each period is independently computable** — perfect for writing as a loop. Backtesting it is, in essence, answering one question: **roll these rules over historical data for N months, and did it beat simply "holding the stock the whole time"? Was the cost (drawdown, getting capped) worth it?**

But the devil is in the details. A backtest that **doesn't deduct costs, uses survivor underlyings, and peeks at the future** will almost certainly hand you an absurdly good curve (Stage 9.6's mirage). So we must not only run the loop but also know how to **deduct real costs item by item and identify every pit.**

**In this lesson we break "build and backtest" into six pieces:**

- **① Data: what you need and how to align it**
- **② Signals and rules: write the strategy as executable conditions**
- **③ The per-period P&L loop: the heart of the backtest**
- **④ Deducting costs: spread, slippage, commission (Stage 9.6)**
- **⑤ Output metrics: CAGR, max drawdown, Sharpe, win rate**
- **⑥ Pits: look-ahead, survivorship bias, overfitting, regime change**
`,

  mechanics: `
### ① Data: what you need

To backtest an options strategy, you need at minimum:

- **The underlying's historical daily bars** (open/high/low/close) — they determine each month's starting price and the settlement price at expiry.
- **Option quotes or a pricing model.** Ideally you have historical option chains (with IV, bid/ask); without them, you can use Stage 11.3's \`bs_price\` + an IV assumption to **synthesize** the premium of the call you sell each month (teaching backtests often do this, but understand it's an approximation).
- **A calendar**: the expiry-date series (e.g., the third Friday of each month), whether there's earnings (to avoid or not, Stage 11.6).

**Data alignment is the source of the first pit**: each decision point can only use the information **known at that moment.** Using the expiry-day closing price to decide the strike at opening is **look-ahead bias**, which manufactures profit out of thin air.

### ② Signals and rules: write the strategy as conditions

Translate "monthly covered call" into machine-executable, unambiguous rules:

- **Entry**: on each month's expiry day, by the then-current stock price pick a **call around 0.30 Delta** (slightly OTM, here ≈103), sell 1 contract, collect premium.
- **Hold**: hold to the next expiry day (here we use the simplest "hold to expiry," with no mid-course management).
- **Settle**: at expiry look at the settlement price S_T —
  - If **S_T ≤ 103**: the call expires worthless, keep the full premium, continue holding the stock.
  - If **S_T > 103**: assigned, the stock is sold at 103 (you get "capped"), and you collect the premium + the stock's P&L of (103 − last month's cost); afterward (the wheel version then sells a put to buy back; the covered-call version assumes buying back 100 shares at S_T to continue).
- **Benchmark**: simply **buying and holding 100 shares** over the same period, for comparison.

> The clearer the rules, the more credible the backtest. Any "manually tweak it as it goes" can't be backtested and is usually a breeding ground for **overfitting** (Stage 9.6).

### ③ The per-period P&L loop: the heart of the backtest

A backtest is a **month-by-month loop**, each cell computing that month's P&L and accumulating equity. The skeleton (synthesizing the premium with Stage 11.3's pricing function):

\`\`\`python
import numpy as np
from pricing import bs_price          # the function written in Stage 11.3

def backtest_covered_call(prices, iv=0.22, r=0.04, dte=30,
                          otm=0.03, cost_per_leg=0.02):
    equity = [10_000.0]               # starting capital
    shares = equity[0] / prices[0]    # equal amount of stock bought and held at the start
    wins = 0; cycles = 0
    for i in range(len(prices) - 1):
        S0, S1 = prices[i], prices[i + 1]      # this month's start / expiry price
        K = round(S0 * (1 + otm))              # slightly OTM strike
        prem = bs_price(S0, K, dte/365, r, iv, "call")
        prem -= cost_per_leg                   # ④ deduct spread/slippage/commission
        stock_pl = (min(S1, K) - S0)           # stock capped at K
        cycle_pl = (stock_pl + prem) * shares  # × share count (≈ many lots of ×100)
        equity.append(equity[-1] + cycle_pl)
        wins += cycle_pl > 0; cycles += 1
    return np.array(equity), wins / cycles
\`\`\`

**Read it block by block**: each round takes this month's start price \`S0\` and expiry price \`S1\`; picks the strike, computes the premium with the model, **deducts cost first**; the stock P&L is **capped** at the strike by \`min(S1,K)\` (the cost of being covered); add the premium, multiply by share count, and accumulate equity. The \`win-rate\` is tallied along the way. The wheel version just keeps selling puts "after assignment" — the loop structure is identical.

### ④ Deducting costs: spread, slippage, commission (Stage 9.6)

That line above, \`prem -= cost_per_leg\`, looks inconspicuous but is the **watershed between honesty and self-deception.** An options backtest must deduct:

- **Bid-ask spread**: you sell at the **bid**, not the mid. Options' spreads are often 5%–20% of the price, taking a bite each period.
- **Slippage**: the actual fill is worse than the intended price, especially for obscure contracts (Stage 10.6).
- **Commission/fees**: per contract, per round trip, adding up.

A crude but effective approach: **deduct a fixed haircut per leg, per round trip** (say $0.02–0.05 per share, depending on liquidity). Don't underestimate it — in the demo you'll see that a 40% CAGR paper curve often **collapses back to a modest positive return or even a loss** once these are deducted. **Assume your backtest is lying to you, and deduct item by item until it can no longer stand up.**

### ⑤ Output metrics: CAGR, max drawdown, Sharpe, win rate

After running the loop and getting an equity curve, do a physical with a few standard metrics:

- **CAGR (compound annual growth rate)**: \`(final/initial)^(1/years) − 1\`. Measures long-run return speed.
- **Max drawdown**: the largest percentage drop from a historical peak. **This is the key to whether you can hold on, or bail out partway** — a covered call's drawdown in a crash can be very deep (the premium is just a thin cushion).
- **Sharpe ratio**: \`(annualized return − risk-free) / annualized volatility\`. Return per unit of risk, convenient for cross-strategy comparison.
- **Win rate**: the share of profitable periods. Note: **high win rate ≠ high return** — rent-collecting strategies often have a very high win rate (small gains most months), but one big crash can give back many months of premium (negative skew).

\`\`\`python
def metrics(equity, periods_per_year=12, rf=0.04):
    rets = np.diff(equity) / equity[:-1]
    years = len(rets) / periods_per_year
    cagr = (equity[-1] / equity[0]) ** (1/years) - 1
    peak = np.maximum.accumulate(equity)
    max_dd = ((peak - equity) / peak).max()
    sharpe = (rets.mean()*periods_per_year - rf) / (rets.std()*np.sqrt(periods_per_year))
    return dict(cagr=cagr, max_dd=max_dd, sharpe=sharpe)
\`\`\`

### ⑥ Pits: four you must actively check

Bring Stage 9.6's lessons down to this concrete backtest:

- **Look-ahead bias / data leakage**: using future information for a present decision (such as using the expiry price to pick the strike). **Use only data known at the decision moment.**
- **Survivorship bias**: testing only underlyings that survived to today, excluding the losers that blew up, delisted, or went to zero — systematically overstating returns.
- **Overfitting**: tuning otm, dte, IV to the historical optimum is equivalent to memorizing the answers. Do an **out-of-sample test** — robust parameters matter more than "historically optimal."
- **Regime change**: bull, bear, and crisis market structures are completely different. A covered call that runs beautifully in a calm uptrend can bleed in the March 2020 kind of crash. **Test across multiple regimes — don't look at one tailwind stretch.**

Connecting the six pieces: **prepare the data → write clear rules → run the per-period loop → honestly deduct costs → compute CAGR/drawdown/Sharpe/win rate → actively try to falsify every pit.** A backtest's value lies not in how pretty a curve it gives but in **how harshly it can survive your skepticism.** Only a strategy that survives this gate earns the right to enter paper trading and small-size live (Stage 11.5). **This is an educational demonstration and not investment advice.**
`,

  demo: "strategy-backtest",

  analogy: `
Backtesting a strategy is like **doing a "trial cook and honest bookkeeping" of a recipe**, not just copying down the taste it claims.

- **Data and rules** = write the recipe down to **every reproducible step**: how many grams of salt, how many minutes, what heat. A vague "to taste, as needed" can't be reproduced and is often self-deception.
- **The per-period P&L loop** = **actually cook it pot after pot**, recording each one's success or failure, rather than scoring by imagination.
- **Deducting costs (spread/slippage/commission)** = count in **utilities, ingredient loss, and dish-washing time** as costs. A recipe that counts only the "ingredient sticker price" looks unrealistically good on the books — exactly what Stage 9.6 warns about repeatedly.
- **CAGR/drawdown/Sharpe/win rate** = a composite score: **how good on average (CAGR), how bad the worst pot was (max drawdown), how stable (Sharpe), how many pots succeeded (win rate).** Note that "nine of ten pots good" can still be dragged down by the one dish that ruins everything (negative skew).
- **Pits (look-ahead/survivorship/overfitting/regime change)** = don't **peek at the answer before cooking (look-ahead)**, don't **count only the successful chefs (survivorship)**, don't **cherry-pick your best attempt as representative (overfitting)**, and don't **trial-cook only in fair weather (regime change)**.

A recipe's credibility lies not in how fragrant it's hyped to be, but in **how much real flavor remains after you've honestly trial-cooked it and booked all costs and flops.**
`,

  misconceptions: [
    "**\"A pretty backtest curve means the strategy is good.\"** — Far from enough. A curve that doesn't deduct costs, uses survivor underlyings, and peeks at the future is almost certain to look good (Stage 9.6's mirage). A backtest's value lies in **how harshly it survives skepticism**, not in how high a CAGR it gives.",
    "**\"Use the expiry-day price to decide the opening strike — it's all historical data anyway.\"** — This is classic **look-ahead bias**: you used information not yet known at the decision moment, manufacturing profit out of thin air. The iron rule of backtesting is that **every decision uses only data known at the moment.**",
    "**\"A high-win-rate rent-collecting strategy must make a lot.\"** — Not necessarily. Covered calls / short puts often have a **very high win rate** (small gains most months), but negative skew means one crash can give back many months of premium. High win rate ≠ high return — you must also look at **max drawdown** and **Sharpe.**",
    "**\"Tune otm, dte, IV to the historical optimum and the strategy is strongest.\"** — That's **overfitting** (memorizing the answers). Historically optimal parameters often fail out-of-sample. Do an **out-of-sample test**, pursue parameter robustness, not the prettiest curve in the past.",
    "**\"It ran well over one stretch of history, so it's ready for live.\"** — Beware **regime change.** Bull, bear, and crisis structures differ greatly; a covered call validated only in a calm uptrend can bleed in a crash. **Test across multiple regimes**, and even after passing, paper trade first, then small-size live (Stage 11.5).",
  ],

  quiz: [
    {
      q: "When backtesting a \"monthly covered call,\" on the opening day you used **that month's expiry-day closing price** to pick the strike. What mistake is this?",
      options: ["Survivorship bias", "Look-ahead bias (look-ahead / data leakage)", "Overfitting", "No mistake — it's all historical data"],
      answer: 1,
      explain: "At opening you don't yet know the expiry price, so using it to decide is **look-ahead bias** — using future information, manufacturing profit that's impossible in real trading. A backtest's every decision can only use data **known at the moment** (Stage 9.6).",
    },
    {
      q: "In the backtest's per-period loop, what does \`prem -= cost_per_leg\` represent, and why is it key?",
      options: [
        "Deducting bid-ask spread/slippage/commission; it's the watershed between an honest backtest and self-deception",
        "Adding premium income to make returns higher",
        "An optional cosmetic step",
        "Adding the risk-free rate back in",
      ],
      answer: 0,
      explain: "It deducts real costs like **spread, slippage, commission** (Stages 9.6, 10.6). Options' spreads are often 5%–20% of the price, and without deducting them the paper curve inflates severely — deducting costs is the key step of an honest backtest.",
    },
    {
      q: "A covered-call backtest shows an **85% win rate**, but which metric should you also focus on to know whether it can withstand a crash?",
      options: ["The number of contracts", "Max drawdown", "The decimal places of the strike", "The underlying's ticker"],
      answer: 1,
      explain: "Rent-collecting strategies naturally have a high win rate, but under negative skew one crash can give back many months of premium. **Max drawdown** measures the fall from the peak, directly bearing on whether you'll bail out partway — it must be looked at together with the win rate.",
    },
    {
      q: "You repeatedly tweaked the otm offset, days to expiry, and IV assumption on the historical data until the CAGR was highest. What problem is this most likely to cause?",
      options: [
        "The strategy is sure to be equally excellent in the future",
        "Overfitting: the parameters are optimal on history but may fail out-of-sample",
        "It lowered transaction costs",
        "It eliminated regime-change risk",
      ],
      answer: 1,
      explain: "Tuning to the historical optimum = **overfitting** (memorizing the answers). Such parameters often collapse out-of-sample. The right approach is an **out-of-sample test**, pursuing parameter robustness and validating across multiple regimes, not making the curve prettiest in the past (Stage 9.6).",
    },
  ],

  further: [
    { label: "Investopedia: Backtesting (principles and pitfalls)", url: "https://www.investopedia.com/terms/b/backtesting.asp" },
    { label: "QuantStart: Successful Backtesting of Algorithmic Strategies", url: "https://www.quantstart.com/articles/Successful-Backtesting-of-Algorithmic-Trading-Strategies-Part-I/" },
    { label: "tastylive Research: Covered Call & Wheel studies", url: "https://www.tastylive.com/concepts-strategies/covered-call" },
  ],
};
