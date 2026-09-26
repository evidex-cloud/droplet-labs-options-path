---
id: python-backtest
prereqs: cash-secured-put, options-data, backtesting, systematic-vol, execution-tca, python-pricing
demo: python-backtest
---

# Build & Backtest an Options Strategy in Python

## @hook
“Sell a 5% out-of-the-money put every month, fully cash-secured” fits in one sentence; an honest backtest of it fits in about eighty lines of pandas. Write it so that every assumption — the data, the fill, the fee, the calendar — is a visible parameter, check it on a price path small enough to verify by hand, and then watch how far the answer moves when you change the history rather than the rule.

## @bridge
[[backtesting]] listed the ways a backtest lies: fills at the mid, look-ahead, survivorship, short samples, overfitting. [[python-pricing]] gave us tested functions for prices and Greeks, and [[options-data]] described the real data a production version would need. This lesson writes the backtest itself for Kai's put-write rule from [[cash-secured-put]] — the same family as the Cboe PUT index in [[systematic-vol]] — with fills priced as in [[execution-tca]]. It builds Idea ③ (the volatility premium is real but thin) and Idea ④ (the risk sits in rare cycles a short sample may never show). The habits it teaches carry into [[common-traps]] and the [[capstone]].

## @intuition
Start with one cycle, in dollars. Kai sets aside $100,000 of cash. XYZ is at $100, so the put 5% below is the 95 strike. At σ = 20% and r = 4% its 30-day model price — the mid — is 0.5089. Kai cannot sell at the mid; the quote is about 10% wider on each side, so the sale fills at the bid, \(0.5089 - 0.0509 = 0.4580\). Cash-secured means \(95 \times 100 = \$9{,}500\) of collateral per contract, so $100,000 supports 10 contracts:

- premium: \(10 \times (100 \times 0.4580 - 0.65) = \$451.49\) after a $0.65 fee per contract;
- the $100,451.49 of cash earns 4% a year while it waits;
- 30 days later, if XYZ is above 95 the puts expire and the premium is kept; if XYZ is at 85, Kai pays \(10 \times 100 \times (95 - 85) = \$10{,}000\).

That is the whole strategy. A backtest repeats it every 30 days over years of prices and keeps an honest ledger. The only hard part is honesty: using only information available on each day, paying the costs a real trader pays, and reporting the tail rather than hiding it.

<figure>
<svg viewBox="0 0 700 250" role="img" aria-label="Backtest architecture: data, rules, pricing and fills, ledger, metrics">
<defs><marker id="python-backtest-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="10" y="30" width="118" height="78" rx="8" class="fx-box2"/>
<text x="69" y="54" text-anchor="middle" class="fx-t-b">Data</text>
<text x="69" y="74" text-anchor="middle" class="fx-t-sm">daily closes</text>
<text x="69" y="90" text-anchor="middle" class="fx-t-sm">(synthetic or real)</text>
<rect x="148" y="30" width="118" height="78" rx="8" class="fx-box"/>
<text x="207" y="54" text-anchor="middle" class="fx-t-b">Rules</text>
<text x="207" y="74" text-anchor="middle" class="fx-t-sm">roll every 30 days,</text>
<text x="207" y="90" text-anchor="middle" class="fx-t-sm">strike = 95% of S</text>
<rect x="286" y="30" width="126" height="78" rx="8" class="fx-hl"/>
<text x="349" y="54" text-anchor="middle" class="fx-t-b">Pricing + fills</text>
<text x="349" y="74" text-anchor="middle" class="fx-t-sm">bs_price at the mid,</text>
<text x="349" y="90" text-anchor="middle" class="fx-t-sm">sell at mid − spread</text>
<rect x="432" y="30" width="118" height="78" rx="8" class="fx-box"/>
<text x="491" y="54" text-anchor="middle" class="fx-t-b">Ledger</text>
<text x="491" y="74" text-anchor="middle" class="fx-t-sm">cash, mark, equity,</text>
<text x="491" y="90" text-anchor="middle" class="fx-t-sm">delta, vega — daily</text>
<rect x="570" y="30" width="120" height="78" rx="8" class="fx-ok"/>
<text x="630" y="54" text-anchor="middle" class="fx-t-b">Metrics</text>
<text x="630" y="74" text-anchor="middle" class="fx-t-sm">CAGR, drawdown,</text>
<text x="630" y="90" text-anchor="middle" class="fx-t-sm">Sharpe, skew</text>
<line x1="128" y1="69" x2="146" y2="69" class="fx-line" marker-end="url(#python-backtest-ah)"/>
<line x1="266" y1="69" x2="284" y2="69" class="fx-line" marker-end="url(#python-backtest-ah)"/>
<line x1="412" y1="69" x2="430" y2="69" class="fx-line" marker-end="url(#python-backtest-ah)"/>
<line x1="550" y1="69" x2="568" y2="69" class="fx-line" marker-end="url(#python-backtest-ah)"/>
<rect x="10" y="140" width="680" height="96" rx="8" class="fx-box2"/>
<text x="350" y="162" text-anchor="middle" class="fx-t-b">Every assumption is a parameter you can see and change</text>
<text x="30" y="186" class="fx-t-sm fx-mono">seed, sigma, jump_prob, jump</text>
<text x="30" y="204" class="fx-t-sm">which history</text>
<text x="250" y="186" class="fx-t-sm fx-mono">moneyness, dte, iv</text>
<text x="250" y="204" class="fx-t-sm">the rule and its pricing</text>
<text x="440" y="186" class="fx-t-sm fx-mono">spread, fee, fill</text>
<text x="440" y="204" class="fx-t-sm">what trading costs</text>
<text x="30" y="226" class="fx-t-sm fx-mono">skip_rv_above, lookahead</text>
<text x="250" y="226" class="fx-t-sm">a filter, and a deliberate bug to see what look-ahead does</text>
</svg>
<figcaption>Figure 1 · The backtest as five small stages. Only the ledger knows about money; only the rules decide; pricing and fills are separate so that a cost assumption can be changed without touching the strategy. The lower box is the point of the design: nothing that changes the answer is hidden.</figcaption>
</figure>

Walk through the loop one day at a time on a hand-made path — XYZ at 100 for 30 days, then 85. It is the golden test of this lesson: small enough to check with a calculator.

::demo[python-backtest-ledger]

> [!THINK] On day 0, straight after the sale, the ledger shows equity of $99,942.61, not $100,451.49 or $100,000. Where did $57.39 go?
> Work it out from the numbers above before opening.
> ---
> The puts were sold at the bid (0.4580) but are **marked at the mid** (0.5089). Cash is \(\$100{,}451.49\); buying the puts back at the mid would cost \(10 \times 100 \times 0.5089 = \$508.88\); so equity is \(100{,}451.49 - 508.88 = \$99{,}942.61\). The missing \(\$57.39\) is the half-spread given up, \(10 \times 100 \times 0.0509 \approx \$50.89\), plus \(10 \times 0.65 = \$6.50\) of fees. An honest ledger books the cost of trading on the day you pay it; a ledger that marks at the fill price would hide it until expiry.

We'll build it in seven parts:

- **① The data: synthetic prices with rare crashes**
- **② The loop: settle, open, mark**
- **③ Fills, fees, interest — and what the ledger ignores**
- **④ Tracking the Greeks**
- **⑤ Metrics, and the golden test**
- **⑥ The pitfalls, as parameters**
- **⑦ From a backtest to a decision**

## @mechanics
### ① The data: synthetic prices with rare crashes

A production backtest runs on real option quotes: historical chains with bids, asks and implied volatilities, cleaned as in [[options-data]]. To learn the machinery we generate prices instead, which has one big advantage: **we can create many histories and see how much the answer depends on luck.** Each day's log return is

$$
\ln\frac{S_{t+1}}{S_t} = \left(\mu - \tfrac12\sigma^2\right)\Delta t + \sigma\sqrt{\Delta t}\,Z_t + J_t \ln(1 + j)
$$

where \(\Delta t = 1/365\) (calendar days, the course convention), \(\mu\) is the drift, \(\sigma\) the everyday volatility, \(Z_t\) a standard normal draw, \(J_t\) equals 1 with a small daily probability (a crash day) and 0 otherwise, and \(j\) is the crash size.

> [!EXAMPLE] The default parameters
> \(\mu = 8\%\), \(\sigma = 15\%\), a crash probability of 0.0005 a day (about one every \(1/(0.0005 \times 365) \approx 5.5\) years) and \(j = -20\%\). A normal day moves about \(0.15/\sqrt{365} \approx 0.79\%\). The crashes add variance of about \(0.0005 \times 365 \times (\ln 0.8)^2 \approx 0.009\) a year, so total realized volatility is about \(\sqrt{0.15^2 + 0.009} \approx 17.7\%\). The options are priced at an implied volatility of 20%: a volatility premium of a couple of points, built in by assumption and in line with the “about 3–4 points on average” that index data show ([[variance-risk-premium]]). These are teaching numbers, not a model of any real stock.

```python
import numpy as np
import pandas as pd
from pricing import bs_price, greeks


def synthetic_prices(days=3650, s0=100.0, mu=0.08, sigma=0.15,
                     jump_prob=0.0005, jump=-0.20, seed=7):
    """Daily closes (calendar days) from GBM plus rare downward jumps."""
    rng = np.random.default_rng(seed)
    dt = 1 / 365
    z = rng.standard_normal(days)
    jumps = (rng.random(days) < jump_prob) * np.log(1 + jump)
    log_ret = (mu - 0.5 * sigma**2) * dt + sigma * np.sqrt(dt) * z + jumps
    closes = s0 * np.exp(np.concatenate([[0.0], np.cumsum(log_ret)]))
    dates = pd.date_range("2016-01-01", periods=days + 1, freq="D")
    return pd.Series(closes, index=dates, name="close")
```

`pricing` is the module from [[python-pricing]]. With real data you would replace this function by something like `pd.read_csv("xyz.csv", index_col=0, parse_dates=True)["close"]` for your own daily closes — and, for a serious test, by real option quotes instead of model prices.

### ② The loop: settle, open, mark

The backtest walks through the days in order. Each day does at most three things, always in this order: **settle** a put that expires today, **open** a new one if today is a roll date, and **mark** whatever is open. Doing them in a fixed order is what prevents same-day look-ahead.

```python
def backtest_putwrite(close, capital=100_000.0, moneyness=0.95, dte=30,
                      iv=0.20, r=0.04, spread=0.10, fee=0.65, fill="bid",
                      skip_rv_above=None, lookahead=False):
    """Sell a cash-secured put every `dte` days; mark daily; settle at expiry."""
    rv = np.log(close).diff().rolling(20).std() * np.sqrt(365)
    signal = rv.shift(-20) if lookahead else rv         # the bug: shift(-20) reads the future
    cash, K, n, expiry_i, next_roll, prem_in = capital, None, 0, None, 0, 0.0
    rows, cycles = [], []
    for i, (date, S) in enumerate(close.items()):
        if i > 0:
            cash *= np.exp(r / 365)                      # collateral earns the T-bill rate
        if K is not None and i == expiry_i:              # 1) settle the expiring put
            payout = n * 100 * max(K - S, 0.0)
            cash -= payout
            cycles.append({"expiry": date, "K": K, "S_T": S,
                           "premium": prem_in, "payout": payout})
            K = None
        if i == next_roll and i + dte < len(close):      # 2) roll date: open the next put
            next_roll = i + dte
            skip = skip_rv_above is not None and signal.iloc[i] > skip_rv_above
            if not skip:
                K = round(S * moneyness)
                n = int(cash // (K * 100))               # fully cash-secured
                mid = bs_price(S, K, dte / 365, r, iv, "put")
                half = max(spread * mid, 0.01)
                px = mid if fill == "mid" else max(mid - half, 0.0)
                prem_in = n * (100 * px - fee)
                cash += prem_in
                expiry_i = i + dte
        if K is not None:                                # 3) mark to market, track Greeks
            T_left = (expiry_i - i) / 365
            put = bs_price(S, K, T_left, r, iv, "put")
            g = greeks(S, K, T_left, r, iv, "put")
            delta, vega = -n * 100 * g["delta"], -n * 100 * g["vega"]
        else:
            put = delta = vega = 0.0
        rows.append({"date": date, "close": S, "cash": cash,
                     "equity": cash - n * 100 * put,
                     "delta": delta, "vega": vega})
    return pd.DataFrame(rows).set_index("date"), pd.DataFrame(cycles)
```

Read it as three blocks. The **settle** block pays \(n \times 100 \times \max(K - S_T, 0)\): assignment is treated as buying the shares at \(K\) and selling them at the close, which is the put's intrinsic value. The **open** block chooses the strike from *today's* close, sizes the trade so the collateral \(K \times 100 \times n\) never exceeds cash, and books the premium at the fill price. The **mark** block reprices the open put with the time left and records the day's equity:

$$
E_t = \text{cash}_t - n \times 100 \times P_t
$$

where \(E_t\) is equity on day \(t\), \(\text{cash}_t\) includes premiums received, payouts made and interest earned, and \(P_t\) is the put's model value per share (the cost of buying it back at the mid). The first two lines of the function prepare an optional filter, explained in ⑥.

### ③ Fills, fees, interest — and what the ledger ignores

Three cost assumptions sit in plain sight:

$$
\text{premium}_{\text{net}} = n \times \big(100 \times \text{fill} - f\big), \qquad \text{fill} = \text{mid} - \max(s \times \text{mid},\ 0.01)
$$

where \(n\) is the number of contracts, \(f\) the fee per contract, \(s\) the half-spread as a fraction of the mid (10% by default) and $0.01 the smallest possible tick. With the 95 put at a mid of 0.5089: \(\text{fill} = 0.5089 - 0.0509 = 0.4580\), and \(10 \times (45.80 - 0.65) = \$451.49\). The same half-spread of about $0.05 on a $0.51 option is the one [[backtesting]] used — 10% of the premium gone on every trade. Interest accrues daily at \(e^{r/365}\) on all cash, which matters: at 4% the collateral alone earns almost as much as the premiums do.

What the ledger deliberately ignores, and a production version must add:

- **Early assignment and dividends.** Equity puts are American; a deep in-the-money put can be assigned before expiry, and dividends shift that decision ([[american-exercise]], [[common-traps]]).
- **The cost of the shares after assignment.** The settle block assumes the assigned shares are sold at the close for free.
- **A flat implied volatility.** Real IV jumps in a crash, so the mark-to-market loss on a short put is larger than this model shows — and the next put sells for more. Both effects are missing.
- **Margin.** Fully cash-secured means no margin call; a margin account would multiply returns and drawdowns ([[margin-approval]]).

### ④ Tracking the Greeks

The ledger also records the position's Greeks every day. Short puts are long delta: each contract of the 95 put has \(\Delta = -0.163\), so short 10 contracts is \(-10 \times 100 \times (-0.163) = +163\) shares of XYZ exposure, and vega \(-10 \times 100 \times 0.0707 \approx -\$70.7\) per vol point.

> [!EXAMPLE] What the Greek columns show over ten years
> In the demo's default history (seed 3), the position averages about **+125 shares** of delta and **−$43** of vega per vol point while a put is open. But the average hides the tail: when a crash drives XYZ through the strike, delta climbs to the full number of shares under the puts — **1,200 shares** at the peak — exactly when the stock is falling fastest. A short put quietly turns into a large long stock position, which is why the delta plot is worth more than the average.

### ⑤ Metrics, and the golden test

The metrics function turns the daily equity into the numbers of [[backtesting]]:

```python
def metrics(daily, cycles, r=0.04, dte=30):
    eq = daily["equity"]
    years = (len(eq) - 1) / 365
    cagr = (eq.iloc[-1] / eq.iloc[0]) ** (1 / years) - 1
    max_dd = (eq / eq.cummax() - 1).min()
    cyc = eq.iloc[::dte].pct_change().dropna()           # one return per 30-day cycle
    rf = np.exp(r * dte / 365) - 1
    sharpe = (cyc.mean() - rf) / cyc.std() * np.sqrt(365 / dte)
    win = (cycles["payout"] < cycles["premium"]).mean()
    return pd.Series({"CAGR": cagr, "max_drawdown": max_dd, "sharpe": sharpe,
                      "worst_cycle": cyc.min(), "skew": cyc.skew(),
                      "win_rate": win, "cycles": len(cycles)})
```

In formulas, with \(E_0, \dots, E_N\) the daily equity and \(r_1, \dots, r_m\) the returns from one roll date to the next:

$$
\text{CAGR} = \left(\frac{E_N}{E_0}\right)^{365/N} - 1, \qquad \text{MDD} = \min_t\left(\frac{E_t}{\max_{u \le t} E_u} - 1\right), \qquad \text{SR} = \frac{\bar r - r_f}{s}\sqrt{\frac{365}{30}}
$$

where \(\bar r\) and \(s\) are the mean and standard deviation of the cycle returns, \(r_f = e^{0.04 \times 30/365} - 1 = 0.329\%\) the risk-free return per cycle, and \(\sqrt{365/30} \approx 3.49\) annualizes. The win rate counts cycles where the payout was smaller than the premium; the skew is pandas' bias-adjusted sample skewness.

**Before trusting any of it, run the golden test** — the hand-made path from the ledger demo, whose answer you can check by hand:

```python
close = pd.Series([100.0] * 30 + [85.0] * 31,
                  index=pd.date_range("2026-01-01", periods=61, freq="D"))
daily, cycles = backtest_putwrite(close)
print(cycles[["K", "S_T", "premium", "payout"]].round(2).to_string(index=False))
print(round(daily["equity"].iloc[-1], 2))
```

```text
 K  S_T premium  payout
95 85.0  451.49 10000.0
81 85.0  466.73     0.0
91549.5
```

Check it: the first put pays \((95 - 85) \times 1{,}000 = \$10{,}000\); the second is struck at \(\text{round}(85 \times 0.95) = 81\) and expires worthless; the rest is premiums and 60 days of interest. A backtest that cannot pass a test like this has no business producing a Sharpe ratio. Now try the metrics function on 24 cycle returns with and without one crash:

::demo[python-backtest-metrics]

On the ten-year synthetic history, the JS mirror of this code (the main demo below, seed 3) prints:

| Metric | Value | Reading |
|---|---|---|
| CAGR | 5.2% | versus 4.08% for T-bills alone and 7.8% for holding XYZ on this (rising) path |
| max_drawdown | −16.7% | two crashes, a few years apart |
| sharpe | 0.20 | barely above cash — the same order as the honest result in [[backtesting]] |
| worst_cycle | −14.3% | one 30-day period |
| skew | −7.1 | many small gains, a few large losses |
| win_rate | 94.2% | 114 of 121 cycles kept more premium than they paid out |

Your Python numbers will differ: numpy's generator produces different random paths from the course engine's, so “seed 3” is a different history in each. The rules, the fills and the ledger are identical, and the golden test prints exactly the same in both.

### ⑥ The pitfalls, as parameters

Each pitfall from [[backtesting]] is a keyword argument, so its effect can be measured rather than argued about. On the same seed-3 history in the JS mirror:

| Change | Argument | Sharpe | What it teaches |
|---|---|---|---|
| Honest baseline | — | 0.20 | the reference |
| Sell at the mid | `fill="mid"` | 0.27 | a third more Sharpe, from an impossible fill |
| Double the spread | `spread=0.20` | 0.09 | costs eat half the edge |
| Skip when trailing vol > 20% | `skip_rv_above=0.20` | 0.18 | the honest filter does not help |
| Same filter, reading the future | `lookahead=True` | 2.56 | one shifted index creates a “great” strategy |
| Strike at 100% of spot | `moneyness=1.0` | 0.38 | better here — or overfitting? |
| Strike at 90% of spot | `moneyness=0.90` | −0.33 | worse here |

> [!WARN] One history is one draw
> Run the honest baseline on 100 different seeds and the Sharpe ratio ranges from **−0.52 to 2.82**; the middle 90% lies between **−0.33 and 1.86**, the median is **0.24**, and 28 of 100 histories are negative — all with the same rule and the same parameters. Picking the moneyness that looked best on one history is choosing among noisy draws; it needs the multiple-testing correction of [[backtesting]] and, above all, other histories.

<figure>
<svg viewBox="0 0 660 260" role="img" aria-label="Histogram of the Sharpe ratio across 100 simulated histories">
<line x1="55" y1="200" x2="625" y2="200" class="fx-axis"/>
<rect x="61" y="193" width="35" height="7" class="fx-fill-red"/>
<rect x="98.3" y="137" width="35" height="63" class="fx-fill-red"/>
<rect x="135.7" y="74" width="35" height="126" class="fx-fill-red"/>
<rect x="173" y="46" width="35" height="154" class="fx-fill-blue"/>
<rect x="210.3" y="95" width="35" height="105" class="fx-fill-blue"/>
<rect x="247.7" y="109" width="35" height="91" class="fx-fill-blue"/>
<rect x="285" y="172" width="35" height="28" class="fx-fill-blue"/>
<rect x="322.3" y="144" width="35" height="56" class="fx-fill-blue"/>
<rect x="359.7" y="193" width="35" height="7" class="fx-fill-blue"/>
<rect x="397" y="193" width="35" height="7" class="fx-fill-blue"/>
<rect x="434.3" y="172" width="35" height="28" class="fx-fill-blue"/>
<rect x="471.7" y="193" width="35" height="7" class="fx-fill-blue"/>
<rect x="509" y="193" width="35" height="7" class="fx-fill-blue"/>
<rect x="546.3" y="193" width="35" height="7" class="fx-fill-blue"/>
<rect x="583.7" y="193" width="35" height="7" class="fx-fill-blue"/>
<line x1="172" y1="30" x2="172" y2="205" class="fx-line fx-dash"/>
<line x1="207.8" y1="36" x2="207.8" y2="205" class="fx-line-hl"/>
<text x="212" y="32" class="fx-t-hl">median 0.24 (seed 3: 0.20)</text>
<line x1="322.8" y1="120" x2="322.8" y2="205" class="fx-line-muted fx-dash"/>
<text x="327" y="116" class="fx-t-sm">seed 1: 1.01</text>
<text x="60" y="218" text-anchor="middle" class="fx-t-sm">−0.75</text>
<text x="172" y="218" text-anchor="middle" class="fx-t-sm">0</text>
<text x="321" y="218" text-anchor="middle" class="fx-t-sm">1</text>
<text x="471" y="218" text-anchor="middle" class="fx-t-sm">2</text>
<text x="620" y="218" text-anchor="middle" class="fx-t-sm">3</text>
<text x="100" y="104" text-anchor="middle" class="fx-t-bad">28 of 100</text>
<text x="100" y="120" text-anchor="middle" class="fx-t-bad">below zero</text>
<text x="620" y="244" text-anchor="end" class="fx-t-sm">annualized Sharpe ratio of the same put-write rule on 100 simulated ten-year histories</text>
</svg>
<figcaption>Figure 2 · The same code, the same parameters, a hundred histories. The rule's “true” Sharpe ratio is somewhere near the middle; any single ten-year backtest is one draw from this spread. A result of 1.0 is well within luck; so is −0.3.</figcaption>
</figure>

The filter pair is the most instructive. The honest filter looks at the realized volatility of the **past** 20 days and skips a cycle if it is high; it does not help, because crashes tend to arrive after calm periods. The buggy version uses `rv.shift(-20)`, which on day \(i\) reads the volatility of days \(i+1\) to \(i+20\) — the very cycle it is deciding whether to trade. It skips exactly the crash cycles and turns 0.20 into 2.56. In real code the bug is rarely this visible: a misaligned join, a `shift` with the wrong sign, a quote timestamped at the close but used at the open. **Any improvement that is too good deserves a look-ahead audit first.**

### ⑦ From a backtest to a decision

What can the honest result tell Kai? On this synthetic stock, selling 5% out-of-the-money puts earned roughly the T-bill rate plus a small premium, with a large negative skew and a maximum drawdown of about 17% on a typical history — and 35–50% on the worst few of a hundred. It does *not* tell Kai what XYZ will do, and a synthetic history cannot contain what real markets contain: volatility that jumps in a crash, gaps over weekends, dividends, early assignment, and the correlation that makes every put-writer lose at the same time.

The benchmark for the real version is public. The Cboe S&P 500 PutWrite Index (PUT), introduced in 2007 with data from June 30, 1986, sells one-month at-the-money SPX puts every month, fully collateralized by T-bills; one study measured an average at-the-money put premium of about 1.65% of notional per month (Bondarenko, 2019). A put-write backtest that beats PUT by a wide margin on paper should be audited, not celebrated.

> [!KEY] The backtest checklist, in code
> Golden test passes · decisions use only data up to today · fills at the bid, with a minimum tick · fees and interest in the ledger · Greeks recorded daily · metrics include max drawdown, worst cycle and skew, not just Sharpe · many histories (or real out-of-sample data), not one · every “improvement” re-run with a look-ahead audit.

Only a rule that survives this goes on to paper trading ([[first-trade]]) and then to the smallest real size. The backtest is not a forecast; it is a way to find out, cheaply, how a rule can fail.

## @analogy
A backtest is a **flight simulator for a trading rule**. The simulator is only as honest as its physics: a simulator with no crosswinds (no spread), no fuel cost (no fees) and a runway that appears exactly where you need it (look-ahead) will make anyone look like an ace. Good simulators are tested against known cases first — the pilot drops the landing gear and the altitude reads exactly what a hand calculation says (the golden test). Then the instructor runs the same approach in a hundred different weather patterns (seeds), because landing once in calm air proves little. And the logbook records not just whether the plane landed, but the hardest bump on the way down (maximum drawdown and worst cycle).

Where the analogy breaks: a flight simulator's physics are known laws, while a backtest's “physics” — how prices move, how volatility reacts in a crash — are assumptions that the market is free to violate. A rule can pass every simulation and still meet a storm that was never in the simulator.

## @misconceptions
- **“A high win rate means the strategy is good.”** — Put-writing wins more than 90% of cycles almost by construction. What matters is how much the losing cycles cost: here a worst cycle of −14.3% and a skew of −7.1.
- **“Selling at the mid is close enough.”** — On a $0.51 option a $0.05 half-spread is 10% of the premium on every trade. In the demo, filling at the mid raises the Sharpe ratio by about a third, from a fill no one gets.
- **“The code ran, so the numbers are right.”** — A backtest needs a golden test with a hand-checkable answer, exactly like a pricing function. Without it, a sign error in the settlement looks like a strategy.
- **“If a filter improves the Sharpe ratio, use it.”** — First check what the filter can see. The look-ahead version here turns 0.20 into 2.56 by reading the next 20 days; the honest version does nothing.
- **“Ten years of data is plenty.”** — For a strategy whose losses come from rare crashes, ten years may contain one crash or none. The same rule gives Sharpe ratios from −0.52 to 2.82 across 100 simulated decades.

## @takeaways
- Structure the backtest as data → rules → pricing and fills → ledger → metrics, and make every assumption (history, rule, costs, filters) a visible parameter.
- Each day: settle, then open, then mark, in that order; choose strikes from today's close only; size so collateral never exceeds cash.
- Book costs honestly: sell at mid − max(s·mid, 0.01), subtract fees, accrue interest daily, and mark at the mid so spread costs appear on day one ($99,942.61, not $100,451.49).
- Report CAGR, maximum drawdown, worst cycle, skew and win rate alongside the Sharpe ratio, and run a golden test (payout $10,000; final equity $91,549.50) before any of it.
- Measure each pitfall by flipping one argument (mid fills 0.20 → 0.27; look-ahead 0.20 → 2.56) and judge results across many histories, not one.

## @quiz
1. On the day Kai sells 10 puts at the bid of 0.4580 (mid 0.5089, fee $0.65), the backtest's equity falls from $100,000 to $99,942.61. Why?
   - [x] The puts are marked at the mid, so the half-spread given up (about $51) plus fees ($6.50) is booked immediately, offset by the premium received
   - [ ] Interest was charged on the collateral
   - [ ] The stock fell on day 0
   - [ ] The backtest double-counts the premium
   > Equity is \(E = \text{cash} - n \times 100 \times P\). Cash rose by $451.49, but the short puts are worth \(10 \times 100 \times 0.5089 = \$508.88\) at the mid versus \(\$458.00\) received before fees. The \(\$50.89\) gap plus \(\$6.50\) of fees is the cost of trading, booked on the day of the trade.
2. The backtest chooses the strike with `K = round(S * moneyness)` using today's close. Which change would introduce look-ahead bias?
   - [ ] Using a strike of 90% instead of 95%
   - [ ] Marking the put at the ask instead of the mid
   - [x] Choosing the strike from the close on the expiry date
   - [ ] Rolling every 45 days instead of 30
   > On the roll date the expiry close is unknown. Any decision that uses it — a strike, a filter, a size — uses the future. The other changes alter the rule or the costs but not the information available.
3. With the honest settings the seed-3 history gives a Sharpe ratio of 0.20. Switching on `lookahead=True` for the volatility filter gives 2.56. What is the right conclusion?
   - [ ] The filter is valuable and should be used live
   - [ ] The honest settings are too conservative
   - [ ] The Sharpe ratio is unreliable for options
   - [x] The filter reads the next 20 days' volatility, so it skips crash cycles it could not know about; the improvement is fake
   > `rv.shift(-20)` on day \(i\) is the volatility of days \(i+1\) to \(i+20\). The honest filter, using past volatility, scores 0.18 — no better than no filter.
4. Across 100 simulated histories, the same rule gives Sharpe ratios from −0.52 to 2.82, median 0.24. A colleague shows you one backtest of a similar rule with a Sharpe of 1.2. What should you ask first?
   - [ ] Nothing — 1.2 is a good Sharpe ratio
   - [x] How many histories, variants and parameter choices were tried, and whether the result holds out of sample
   - [ ] Whether the code uses pandas or numpy
   - [ ] Whether the Sharpe ratio was annualized with 252 or 365 days
   > A single history is one draw from a wide distribution; 1.2 is within luck for a rule whose median is about 0.24. Ask about trials, parameter searches and out-of-sample evidence ([[backtesting]]).
5. The golden test (100 for 30 days, then 85) prints a payout of 10000.0 for the first cycle. Where does it come from?
   - [ ] One contract times (95 − 85) times 100
   - [ ] The premium times 100
   - [x] Ten contracts times 100 shares times (95 − 85)
   - [ ] The cash-secured collateral of 9,500 per contract
   > $100,000 of cash secures \(\lfloor 100{,}000 / 9{,}500 \rfloor = 10\) contracts. At expiry the 95 put is worth \(95 - 85 = 10\) per share, so the payout is \(10 \times 100 \times 10 = \$10{,}000\).

## @further
- [Cboe S&P 500 PutWrite Index methodology](https://cdn.cboe.com/api/global/us_indices/governance/Cboe_SP_500_PutWrite_Indices_Methodology.pdf) — the rules of the real-world benchmark for this strategy.
- [Bondarenko (2019), put-writing study for Cboe (PDF)](https://cdn.cboe.com/resources/education/research_publications/PutWriteCBOE19_v14_by_Prof_Oleg_Bondarenko_as_of_June_14.pdf) — a long-horizon study of PUT and its premium.
- [pandas: time series and date functionality](https://pandas.pydata.org/docs/user_guide/timeseries.html) — date ranges, shifting and rolling windows, the tools the backtest uses (and misuses in the look-ahead bug).
- [NumPy: random Generator](https://numpy.org/doc/stable/reference/random/generator.html) — seeded random numbers for reproducible synthetic histories.
- [Carr & Wu (2009), Variance Risk Premiums](https://academic.oup.com/rfs/article-abstract/22/3/1311/1581057) — evidence that index options carry the premium this strategy harvests.

## @next
The backtest showed how a rule fails on paper: spreads, look-ahead, the crash cycle. Real accounts add their own ways to fail — early assignment before a dividend, a pin at expiry, a wide market after hours, a margin call. The next lesson is a field guide to those traps, one scenario at a time.
