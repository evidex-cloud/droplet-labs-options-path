---
id: python-backtest
prereqs: cash-secured-put, options-data, backtesting, systematic-vol, execution-tca, python-pricing
demo: python-backtest
---

# 用 Python 构建并回测一个期权策略

## @hook
“每个月卖一张 5% 虚值、全额现金担保的看跌期权”，一句话就说完了；把它诚实地回测一遍，大约八十行 pandas。要把每个假设——数据、成交价、费用、日历——都写成看得见的参数，先在一条小到能手算的价格路径上核对，然后看看：不改规则、只换一段历史，答案会移动多远。

## @bridge
[[backtesting]] 列出了回测撒谎的各种方式：按中间价成交、偷看未来、幸存者偏差、样本太短、过度拟合。[[python-pricing]] 给了我们经过测试的定价与希腊字母函数，[[options-data]] 描述了正式版本需要的真实数据。这一课为 [[cash-secured-put]] 里小凯的卖看跌规则写出回测本身——它和 [[systematic-vol]] 里 Cboe 的 PUT 指数是同一家族——成交价按 [[execution-tca]] 的思路定。它落在第 ③ 个观念（波动率溢价真实存在，但很薄）和第 ④ 个观念（风险藏在短样本可能根本看不到的少数周期里）上。它教的习惯会带进 [[common-traps]] 和 [[capstone]]。

## @intuition
先用美元看一个周期。小凯拿出 100,000 美元现金。XYZ 在 100 美元，所以 5% 虚值的看跌是 95 行权价。σ = 20%、r = 4% 时，它 30 天的模型价——中间价——是 0.5089。小凯没法按中间价卖；报价每一边大约宽 10%，所以按买价成交，\(0.5089 - 0.0509 = 0.4580\)。现金担保意味着每张要 \(95 \times 100 = \$9{,}500\) 的担保金，所以 100,000 美元可以卖 10 张：

- 权利金：扣掉每张 0.65 美元的费用后，\(10 \times (100 \times 0.4580 - 0.65) = \$451.49\)；
- 这 100,451.49 美元现金在等待期间按年 4% 生息；
- 30 天后，如果 XYZ 高于 95，看跌作废，权利金留下；如果 XYZ 在 85，小凯要付 \(10 \times 100 \times (95 - 85) = \$10{,}000\)。

策略就是这么多。回测把它在多年的价格上每 30 天重复一次，并记一本诚实的账。唯一难的是诚实：每一天只用当天能得到的信息，付真实交易者会付的成本，把尾部如实报告而不是藏起来。

<figure>
<svg viewBox="0 0 700 250" role="img" aria-label="回测结构：数据、规则、定价与成交、账本、指标">
<defs><marker id="python-backtest-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="10" y="30" width="118" height="78" rx="8" class="fx-box2"/>
<text x="69" y="54" text-anchor="middle" class="fx-t-b">数据</text>
<text x="69" y="74" text-anchor="middle" class="fx-t-sm">每日收盘价</text>
<text x="69" y="90" text-anchor="middle" class="fx-t-sm">（合成或真实）</text>
<rect x="148" y="30" width="118" height="78" rx="8" class="fx-box"/>
<text x="207" y="54" text-anchor="middle" class="fx-t-b">规则</text>
<text x="207" y="74" text-anchor="middle" class="fx-t-sm">每 30 天换仓，</text>
<text x="207" y="90" text-anchor="middle" class="fx-t-sm">行权价 = 95% × S</text>
<rect x="286" y="30" width="126" height="78" rx="8" class="fx-hl"/>
<text x="349" y="54" text-anchor="middle" class="fx-t-b">定价 + 成交</text>
<text x="349" y="74" text-anchor="middle" class="fx-t-sm">bs_price 给中间价，</text>
<text x="349" y="90" text-anchor="middle" class="fx-t-sm">按中间价 − 价差卖出</text>
<rect x="432" y="30" width="118" height="78" rx="8" class="fx-box"/>
<text x="491" y="54" text-anchor="middle" class="fx-t-b">账本</text>
<text x="491" y="74" text-anchor="middle" class="fx-t-sm">现金、估值、权益、</text>
<text x="491" y="90" text-anchor="middle" class="fx-t-sm">Delta、Vega，逐日</text>
<rect x="570" y="30" width="120" height="78" rx="8" class="fx-ok"/>
<text x="630" y="54" text-anchor="middle" class="fx-t-b">指标</text>
<text x="630" y="74" text-anchor="middle" class="fx-t-sm">CAGR、回撤、</text>
<text x="630" y="90" text-anchor="middle" class="fx-t-sm">夏普、偏度</text>
<line x1="128" y1="69" x2="146" y2="69" class="fx-line" marker-end="url(#python-backtest-ah)"/>
<line x1="266" y1="69" x2="284" y2="69" class="fx-line" marker-end="url(#python-backtest-ah)"/>
<line x1="412" y1="69" x2="430" y2="69" class="fx-line" marker-end="url(#python-backtest-ah)"/>
<line x1="550" y1="69" x2="568" y2="69" class="fx-line" marker-end="url(#python-backtest-ah)"/>
<rect x="10" y="140" width="680" height="96" rx="8" class="fx-box2"/>
<text x="350" y="162" text-anchor="middle" class="fx-t-b">每个假设都是一个看得见、改得了的参数</text>
<text x="30" y="186" class="fx-t-sm fx-mono">seed, sigma, jump_prob, jump</text>
<text x="30" y="204" class="fx-t-sm">用哪一段历史</text>
<text x="250" y="186" class="fx-t-sm fx-mono">moneyness, dte, iv</text>
<text x="250" y="204" class="fx-t-sm">规则本身与它的定价</text>
<text x="440" y="186" class="fx-t-sm fx-mono">spread, fee, fill</text>
<text x="440" y="204" class="fx-t-sm">交易要花多少钱</text>
<text x="30" y="226" class="fx-t-sm fx-mono">skip_rv_above, lookahead</text>
<text x="250" y="226" class="fx-t-sm">一个过滤器，以及一个故意留的 bug，用来看偷看未来的后果</text>
</svg>
<figcaption>图 1 · 把回测拆成五个小阶段。只有账本管钱；只有规则做决定；定价和成交分开，这样改一个成本假设不用动策略。下面那个框才是这样设计的目的：任何会改变答案的东西都不藏起来。</figcaption>
</figure>

在一条手工构造的路径上逐日走一遍循环——XYZ 在 100 待 30 天，然后变成 85。这就是这一课的“黄金测试”：小到可以用计算器核对。

::demo[python-backtest-ledger]

> [!THINK] 第 0 天刚卖出，账本显示权益是 99,942.61 美元，既不是 100,451.49，也不是 100,000。那 57.39 美元去哪了？
> 先用上面的数字算一算，再打开答案。
> ---
> 看跌是按买价（0.4580）卖出的，却**按中间价估值**（0.5089）。现金是 \(\$100{,}451.49\)；按中间价把看跌买回来要花 \(10 \times 100 \times 0.5089 = \$508.88\)；所以权益是 \(100{,}451.49 - 508.88 = \$99{,}942.61\)。少掉的 \(\$57.39\) 是让出去的半个价差 \(10 \times 100 \times 0.0509 \approx \$50.89\)，加上 \(10 \times 0.65 = \$6.50\) 的费用。诚实的账本在你付出交易成本的当天就把它记上；按成交价估值的账本会把它一直藏到到期。

我们分七块来搭：

- **① 数据：带罕见崩盘的合成价格**
- **② 循环：结算、开仓、估值**
- **③ 成交、费用、利息——以及账本忽略了什么**
- **④ 跟踪希腊字母**
- **⑤ 指标与黄金测试**
- **⑥ 把陷阱写成参数**
- **⑦ 从回测到决定**

## @mechanics
### ① 数据：带罕见崩盘的合成价格

正式的回测要用真实的期权报价：带买价、卖价和隐含波动率的历史期权链，并按 [[options-data]] 的方法清洗。为了学会这套机器，我们先自己生成价格，这有一个大好处：**可以造出很多段历史，看看答案有多少取决于运气。**每天的对数收益是

$$
\ln\frac{S_{t+1}}{S_t} = \left(\mu - \tfrac12\sigma^2\right)\Delta t + \sigma\sqrt{\Delta t}\,Z_t + J_t \ln(1 + j)
$$

其中 \(\Delta t = 1/365\)（按日历日，课程约定），\(\mu\) 是漂移，\(\sigma\) 是平日的波动率，\(Z_t\) 是一个标准正态随机数，\(J_t\) 以一个很小的每日概率取 1（崩盘日）、否则取 0，\(j\) 是崩盘幅度。

> [!EXAMPLE] 默认参数
> \(\mu = 8\%\)，\(\sigma = 15\%\)，崩盘概率每天 0.0005（约每 \(1/(0.0005 \times 365) \approx 5.5\) 年一次），\(j = -20\%\)。普通的一天波动约 \(0.15/\sqrt{365} \approx 0.79\%\)。崩盘每年增加的方差约 \(0.0005 \times 365 \times (\ln 0.8)^2 \approx 0.009\)，所以总的已实现波动率约 \(\sqrt{0.15^2 + 0.009} \approx 17.7\%\)。期权按 20% 的隐含波动率定价：这是按假设放进去的几个点的波动率溢价，与指数数据显示的“平均约 3–4 个点”相符（[[variance-risk-premium]]）。这些都是教学用的数字，不是任何真实股票的模型。

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

`pricing` 就是 [[python-pricing]] 里的那个模块。用真实数据时，你可以把这个函数换成类似 `pd.read_csv("xyz.csv", index_col=0, parse_dates=True)["close"]` 的东西来读自己的每日收盘价——而要做严肃的检验，还得用真实的期权报价代替模型价格。

### ② 循环：结算、开仓、估值

回测按日期顺序逐日前进。每一天最多做三件事，永远按这个顺序：**结算**今天到期的看跌，如果今天是换仓日就**开仓**一张新的，然后给持有的头寸**估值**。固定顺序，正是防止“同一天偷看未来”的办法。

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

分三块读。**结算**块付出 \(n \times 100 \times \max(K - S_T, 0)\)：被指派当作以 \(K\) 买入股票、再按收盘价卖出，也就是看跌的内在价值。**开仓**块用*今天的*收盘价选行权价，确定规模让担保金 \(K \times 100 \times n\) 永远不超过现金，并按成交价记入权利金。**估值**块用剩余时间给持有的看跌重新定价，并记下当天的权益：

$$
E_t = \text{现金}_t - n \times 100 \times P_t
$$

其中 \(E_t\) 是第 \(t\) 天的权益，\(\text{现金}_t\) 包括收到的权利金、付出的赔付和赚到的利息，\(P_t\) 是看跌每股的模型价值（按中间价买回它的成本）。函数开头两行准备了一个可选的过滤器，在第 ⑥ 块解释。

### ③ 成交、费用、利息——以及账本忽略了什么

三个成本假设摆在明处：

$$
\text{净权利金} = n \times \big(100 \times \text{成交价} - f\big), \qquad \text{成交价} = \text{中间价} - \max(s \times \text{中间价},\ 0.01)
$$

其中 \(n\) 是合约张数，\(f\) 是每张费用，\(s\) 是半个价差占中间价的比例（默认 10%），0.01 美元是最小价位。95 看跌中间价 0.5089 时：\(\text{成交价} = 0.5089 - 0.0509 = 0.4580\)，\(10 \times (45.80 - 0.65) = \$451.49\)。0.51 美元的期权上约 0.05 美元的半个价差，正是 [[backtesting]] 用的那个数——每笔交易都丢掉 10% 的权利金。利息按 \(e^{r/365}\) 每天计入全部现金，这很要紧：利率 4% 时，光担保金赚的就和权利金差不多了。

账本故意忽略了下面这些，正式版本必须补上：

- **提前指派与股息**。个股看跌是美式的；深度实值的看跌可能在到期前被指派，股息也会改变这个决定（[[american-exercise]]，[[common-traps]]）。
- **被指派后股票的成本**。结算块假设被指派的股票按收盘价免费卖掉。
- **不变的隐含波动率**。真实的 IV 在崩盘时会跳升，所以卖出看跌的盯市亏损比这个模型显示的更大——而下一张看跌也能卖得更贵。这两个效应都没有。
- **保证金**。全额现金担保就不会有追加保证金；用保证金账户会把收益和回撤一起放大（[[margin-approval]]）。

### ④ 跟踪希腊字母

账本每天还记录持仓的希腊字母。卖出看跌是多头 Delta：每张 95 看跌 \(\Delta = -0.163\)，卖出 10 张就是 \(-10 \times 100 \times (-0.163) = +163\) 股的 XYZ 敞口；Vega 是 \(-10 \times 100 \times 0.0707 \approx -\$70.7\) 每波动率点。

> [!EXAMPLE] 希腊字母那几列十年里显示了什么
> 在演示的默认历史（种子 3）里，持有看跌期间，持仓平均约 **+125 股**的 Delta、每波动率点约 **−43 美元**的 Vega。但平均值藏住了尾部：崩盘把 XYZ 打穿行权价时，Delta 一路升到看跌所对应的全部股数——峰值 **1,200 股**——恰好发生在股价跌得最快的时候。卖出看跌会悄悄变成一大笔多头股票，所以 Delta 的走势图比平均值更有价值。

### ⑤ 指标与黄金测试

指标函数把每日权益变成 [[backtesting]] 里的那些数字：

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

写成公式，\(E_0, \dots, E_N\) 是每日权益，\(r_1, \dots, r_m\) 是相邻两个换仓日之间的收益：

$$
\text{CAGR} = \left(\frac{E_N}{E_0}\right)^{365/N} - 1, \qquad \text{MDD} = \min_t\left(\frac{E_t}{\max_{u \le t} E_u} - 1\right), \qquad \text{SR} = \frac{\bar r - r_f}{s}\sqrt{\frac{365}{30}}
$$

其中 \(\bar r\)、\(s\) 是周期收益的均值和标准差，\(r_f = e^{0.04 \times 30/365} - 1 = 0.329\%\) 是每个周期的无风险收益，\(\sqrt{365/30} \approx 3.49\) 用来年化。胜率数的是赔付小于权利金的周期；偏度是 pandas 的偏差校正样本偏度。

**在相信任何一个数之前，先跑黄金测试**——就是账本演示里那条手工路径，答案可以手算核对：

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

核对一下：第一张看跌赔付 \((95 - 85) \times 1{,}000 = \$10{,}000\)；第二张的行权价是 \(\text{round}(85 \times 0.95) = 81\)，作废；其余是两笔权利金和 60 天的利息。一个连这种测试都过不了的回测，没有资格给出夏普比率。现在在 24 个周期收益上试试指标函数，看有没有一次崩盘的区别：

::demo[python-backtest-metrics]

在十年的合成历史上，这段代码的 JS 镜像（下面的主演示，种子 3）打印出：

| 指标 | 数值 | 怎么读 |
|---|---|---|
| CAGR | 5.2% | 对比只买国库券的 4.08%，以及在这条（上涨的）路径上持有 XYZ 的 7.8% |
| max_drawdown | −16.7% | 两次崩盘，相隔几年 |
| sharpe | 0.20 | 勉强高于现金——和 [[backtesting]] 里诚实结果是同一量级 |
| worst_cycle | −14.3% | 一个 30 天周期 |
| skew | −7.1 | 许多小赚，几次大亏 |
| win_rate | 94.2% | 121 个周期里有 114 个留下的权利金多于赔付 |

你用 Python 跑出的数字会不同：numpy 的随机数生成器和课程引擎的不一样，所以“种子 3”在两边是两段不同的历史。规则、成交和账本完全相同，而黄金测试在两边打印的结果一模一样。

### ⑥ 把陷阱写成参数

[[backtesting]] 里的每个陷阱都是一个关键字参数，所以它的影响可以量出来，而不必争论。在同一段种子 3 的历史上（JS 镜像）：

| 改动 | 参数 | 夏普 | 说明了什么 |
|---|---|---|---|
| 诚实的基准 | — | 0.20 | 参照 |
| 按中间价卖出 | `fill="mid"` | 0.27 | 多出三分之一的夏普，来自一个不可能的成交价 |
| 价差翻倍 | `spread=0.20` | 0.09 | 成本吃掉一半的优势 |
| 过去波动率 > 20% 时跳过 | `skip_rv_above=0.20` | 0.18 | 诚实的过滤器没有帮助 |
| 同一个过滤器，但读了未来 | `lookahead=True` | 2.56 | 一个错位的索引造出一个“优秀”策略 |
| 行权价 = 现价的 100% | `moneyness=1.0` | 0.38 | 在这里更好——还是过度拟合？ |
| 行权价 = 现价的 90% | `moneyness=0.90` | −0.33 | 在这里更差 |

> [!WARN] 一段历史只是一次抽样
> 把诚实的基准在 100 个不同的种子上跑一遍，夏普比率从 **−0.52 到 2.82** 不等；中间 90% 落在 **−0.33 到 1.86** 之间，中位数 **0.24**，100 段历史里有 28 段是负的——规则相同，参数也相同。在一段历史上挑出“看起来最好”的虚值程度，是在一堆有噪声的抽样里挑选；它需要 [[backtesting]] 里的多重检验校正，更需要别的历史。

<figure>
<svg viewBox="0 0 660 260" role="img" aria-label="100 段模拟历史上夏普比率的直方图">
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
<text x="212" y="32" class="fx-t-hl">中位数 0.24（种子 3：0.20）</text>
<line x1="322.8" y1="120" x2="322.8" y2="205" class="fx-line-muted fx-dash"/>
<text x="327" y="116" class="fx-t-sm">种子 1：1.01</text>
<text x="60" y="218" text-anchor="middle" class="fx-t-sm">−0.75</text>
<text x="172" y="218" text-anchor="middle" class="fx-t-sm">0</text>
<text x="321" y="218" text-anchor="middle" class="fx-t-sm">1</text>
<text x="471" y="218" text-anchor="middle" class="fx-t-sm">2</text>
<text x="620" y="218" text-anchor="middle" class="fx-t-sm">3</text>
<text x="100" y="104" text-anchor="middle" class="fx-t-bad">100 段里 28 段</text>
<text x="100" y="120" text-anchor="middle" class="fx-t-bad">低于零</text>
<text x="620" y="244" text-anchor="end" class="fx-t-sm">同一条卖看跌规则在 100 段模拟的十年历史上的年化夏普比率</text>
</svg>
<figcaption>图 2 · 同样的代码、同样的参数、一百段历史。这条规则“真正的”夏普比率大概在中间某处；任何一次十年回测都只是从这个分布里抽出的一个数。1.0 完全在运气范围之内；−0.3 也是。</figcaption>
</figure>

那一对过滤器最有教益。诚实的过滤器看**过去** 20 天的已实现波动率，偏高就跳过一个周期；它没有帮助，因为崩盘往往在平静期之后到来。有 bug 的版本用的是 `rv.shift(-20)`，在第 \(i\) 天读到的是第 \(i+1\) 到 \(i+20\) 天的波动率——正是它要决定做不做的那个周期。它恰好跳过了崩盘周期，把 0.20 变成了 2.56。在真实代码里，这种 bug 很少这么显眼：一次错位的合并、一个符号写反的 `shift`、一个标着收盘时间却在开盘时使用的报价。**任何好得过分的改进，都先做一次“偷看未来”审计。**

### ⑦ 从回测到决定

诚实的结果能告诉小凯什么？在这只合成股票上，卖出 5% 虚值看跌大约赚到国库券利率加上一点溢价，偏度大幅为负；最大回撤在一条典型的历史上约 17%，在一百条历史里最糟的几条上达到 35%–50%。它*不能*告诉小凯 XYZ 将来会怎样；合成的历史也装不下真实市场里的东西：崩盘时跳升的波动率、周末跳空、股息、提前指派，以及让所有卖看跌的人同时亏钱的相关性。

真实版本的参照是公开的。Cboe 标普 500 卖出看跌指数（PUT）于 2007 年推出，数据回溯到 1986 年 6 月 30 日，每月卖出一个月期的平值 SPX 看跌，以国库券全额担保；一项研究测得平值看跌的平均权利金约为每月名义本金的 1.65%（Bondarenko，2019）。一个在纸面上大幅跑赢 PUT 的卖看跌回测，应该先被审计，而不是被庆祝。

> [!KEY] 写在代码里的回测清单
> 黄金测试通过 · 决策只用截至今天的数据 · 按买价成交并设最小价位 · 费用和利息记进账本 · 每天记录希腊字母 · 指标里有最大回撤、最差周期和偏度，而不只有夏普 · 用很多段历史（或真实的样本外数据），而不是一段 · 每一个“改进”都重新做一次偷看未来审计。

只有经受住这些的规则，才进入模拟交易（[[first-trade]]），然后才是最小的真实规模。回测不是预测；它是一种便宜地找出“规则会怎样失败”的方法。

## @analogy
回测是**交易规则的飞行模拟器**。模拟器诚实与否，取决于它的物理：一台没有侧风（没有价差）、不耗油（没有费用）、跑道总恰好出现在你需要的地方（偷看未来）的模拟器，能让任何人看起来都是王牌飞行员。好的模拟器先用已知情况校验——放下起落架，高度表读数和手算的结果完全一致（黄金测试）。然后教员让同一次进近在一百种不同的天气里各飞一遍（种子），因为在平静的空气里降落一次说明不了什么。飞行日志记下的不只是“落地了没有”，还有一路上最狠的那一下颠簸（最大回撤和最差周期）。

类比在这里不成立：飞行模拟器的物理是已知定律，而回测的“物理”——价格怎么动、崩盘时波动率怎么反应——都是假设，市场随时可以违反它们。一条规则可以通过所有模拟，却仍然遇上一场从未出现在模拟器里的风暴。

## @misconceptions
- **“胜率高，策略就好。”** —— 卖看跌几乎天生就能赢下 90% 以上的周期。要紧的是输的那些周期亏多少：这里最差周期 −14.3%，偏度 −7.1。
- **“按中间价卖出差不多就行。”** —— 0.51 美元的期权上 0.05 美元的半个价差，就是每笔交易 10% 的权利金。演示里按中间价成交会让夏普高出约三分之一，而这个成交价没人拿得到。
- **“代码跑通了，数字就是对的。”** —— 回测和定价函数一样，需要一个能手算核对的黄金测试。没有它，结算里的一个符号错误看起来就像一个策略。
- **“过滤器能提高夏普，就用它。”** —— 先查清楚过滤器能看到什么。这里偷看未来的版本读了接下来 20 天的数据，把 0.20 变成 2.56；诚实的版本毫无作用。
- **“十年的数据足够了。”** —— 对一个亏损来自罕见崩盘的策略，十年里可能只有一次崩盘，甚至一次都没有。同一条规则在 100 个模拟的十年里，夏普从 −0.52 到 2.82 不等。

## @takeaways
- 把回测组织成 数据 → 规则 → 定价与成交 → 账本 → 指标，并把每个假设（历史、规则、成本、过滤器）都做成看得见的参数。
- 每天按顺序：结算、开仓、估值；只用今天的收盘价选行权价；规模要让担保金永远不超过现金。
- 如实记账：按 中间价 − max(s·中间价, 0.01) 卖出，扣费用，每天计利息，按中间价估值，让价差成本在第一天就显现（99,942.61 美元，而不是 100,451.49）。
- 在夏普之外同时报告 CAGR、最大回撤、最差周期、偏度和胜率，并且在这一切之前先跑黄金测试（赔付 10,000 美元；最终权益 91,549.50 美元）。
- 每次只改一个参数来度量一个陷阱（中间价成交 0.20 → 0.27；偷看未来 0.20 → 2.56），并在许多段历史上评判结果，而不是一段。

## @quiz
1. 小凯按买价 0.4580 卖出 10 张看跌（中间价 0.5089，费用 0.65 美元）的那一天，回测的权益从 100,000 美元降到 99,942.61 美元。为什么？
   - [x] 看跌按中间价估值，所以让出的半个价差（约 51 美元）和费用（6.50 美元）当场入账，再被收到的权利金抵掉一部分
   - [ ] 担保金被收了利息
   - [ ] 股票在第 0 天下跌了
   - [ ] 回测把权利金算了两次
   > 权益是 \(E = \text{现金} - n \times 100 \times P\)。现金增加了 451.49 美元，但按中间价，卖出的看跌值 \(10 \times 100 \times 0.5089 = \$508.88\)，而扣费前收到的是 \(\$458.00\)。这 \(\$50.89\) 的差额加上 \(\$6.50\) 的费用，就是交易成本，在交易当天入账。
2. 回测用今天的收盘价 `K = round(S * moneyness)` 选行权价。下面哪个改动会引入偷看未来的偏差？
   - [ ] 用 90% 而不是 95% 的行权价
   - [ ] 按卖价而不是中间价给看跌估值
   - [x] 用到期日的收盘价来选行权价
   - [ ] 每 45 天而不是 30 天换仓
   > 换仓那天，到期日的收盘价还不知道。任何用到它的决定——行权价、过滤器、规模——都在用未来。其他改动改变的是规则或成本，而不是当时能获得的信息。
3. 诚实设定下，种子 3 的历史给出夏普 0.20。给波动率过滤器打开 `lookahead=True` 后变成 2.56。正确的结论是什么？
   - [ ] 这个过滤器很有价值，应该实盘使用
   - [ ] 诚实的设定太保守了
   - [ ] 夏普比率对期权不可靠
   - [x] 过滤器读了接下来 20 天的波动率，所以跳过了它本不可能预知的崩盘周期；这个改进是假的
   > 第 \(i\) 天的 `rv.shift(-20)` 是第 \(i+1\) 到 \(i+20\) 天的波动率。用过去波动率的诚实过滤器得到 0.18——并不比不过滤好。
4. 在 100 段模拟历史上，同一条规则的夏普从 −0.52 到 2.82，中位数 0.24。同事给你看一个类似规则的单次回测，夏普 1.2。你首先该问什么？
   - [ ] 什么都不用问——1.2 是很好的夏普
   - [x] 试了多少段历史、多少个变体和参数组合，结果在样本外是否成立
   - [ ] 代码用的是 pandas 还是 numpy
   - [ ] 夏普是按 252 天还是 365 天年化的
   > 单段历史只是从一个很宽的分布里抽出的一个数；对中位数约 0.24 的规则，1.2 完全可能来自运气。要问试验次数、参数搜索和样本外证据（[[backtesting]]）。
5. 黄金测试（30 天在 100，然后 85）打印出第一个周期赔付 10000.0。这个数从哪来？
   - [ ] 1 张合约乘以 (95 − 85) 再乘以 100
   - [ ] 权利金乘以 100
   - [x] 10 张合约 × 100 股 × (95 − 85)
   - [ ] 每张 9,500 美元的现金担保金
   > 100,000 美元现金可以担保 \(\lfloor 100{,}000 / 9{,}500 \rfloor = 10\) 张。到期时 95 看跌每股值 \(95 - 85 = 10\)，所以赔付是 \(10 \times 100 \times 10 = \$10{,}000\)。

## @further
- [Cboe S&P 500 PutWrite Index methodology](https://cdn.cboe.com/api/global/us_indices/governance/Cboe_SP_500_PutWrite_Indices_Methodology.pdf) — 这个策略在真实世界里的参照指数的规则。
- [Bondarenko (2019), put-writing study for Cboe (PDF)](https://cdn.cboe.com/resources/education/research_publications/PutWriteCBOE19_v14_by_Prof_Oleg_Bondarenko_as_of_June_14.pdf) — 对 PUT 指数及其权利金的长周期研究。
- [pandas: time series and date functionality](https://pandas.pydata.org/docs/user_guide/timeseries.html) — 日期序列、shift 与滚动窗口：回测用到（以及在偷看未来的 bug 里用错）的工具。
- [NumPy: random Generator](https://numpy.org/doc/stable/reference/random/generator.html) — 用于生成可复现合成历史的带种子随机数。
- [Carr & Wu (2009), Variance Risk Premiums](https://academic.oup.com/rfs/article-abstract/22/3/1311/1581057) — 指数期权带有这个策略所收取的溢价的证据。

## @next
回测展示了一条规则在纸面上怎样失败：价差、偷看未来、崩盘周期。真实账户还有它自己的失败方式——除息前被提前指派、到期时被钉在行权价附近、盘后报价很宽、追加保证金。下一课是这些陷阱的实地指南，一个情景一个情景地讲。
