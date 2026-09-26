---
id: python-pricing
prereqs: black-scholes, greeks-map, implied-vol, binomial-trees, monte-carlo, options-data
demo: python-pricing
---

# 用 Python 定价、画希腊字母

## @hook
这门课里的每一个价格、希腊字母和隐含波动率，都来自大约四十行代码。这一课用 numpy 和 scipy 把这几十行写成 Python——比代码更重要的是，用你已经信任的数字去检验它们：教科书里的看涨 10.45、看跌 5.57。通过这些测试的代码才可以信任；仅仅“能跑”的代码不行。

## @bridge
[[black-scholes]] 给了公式，[[greeks-map]] 给了希腊字母的交易单位；[[implied-vol]] 用牛顿法把公式反过来解，[[binomial-trees]] 和 [[monte-carlo]] 又用另外两种方法给同样的期权定价。这一课把这四样合成一个带测试的小 Python 模块。它落在第 ② 个观念（无套利：三种不同的方法必须给出同一个价格，平价关系必须精确到机器精度）和第 ③ 个观念（波动率：隐含波动率是市场报出的数字，所以求解器很要紧）上。这个模块会在 [[python-backtest]] 里再用到；它也正是 AI 助手几秒钟就能写出、却可能错得很隐蔽的那种代码（[[ai-agents]]）——所以测试要先写。

## @intuition
从最小的程序开始。[[black-scholes]] 里小凯的 1 年期 XYZ 看涨期权是 \(C = S\,\N(d_1) - Ke^{-rT}\N(d_2)\)。在 Python 里，标准正态分布函数 \(\N(\cdot)\) 是 `scipy.stats` 里的 `norm.cdf`，对数是 `np.log`，公式变成四行：

```python
import numpy as np
from scipy.stats import norm

S, K, T, r, sigma = 100, 100, 1.0, 0.04, 0.20
d1 = (np.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
d2 = d1 - sigma * np.sqrt(T)
print(S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2))   # 9.925053...
```

它打印出 9.925，就是从 [[black-scholes]] 起你一直见到的 9.93 美元。诀窍就这么一个：**纸上的公式和代码是同一个东西**，只是用两种记法写出来。

难的不是写出来，而是知道它写对了。假设你把 `T = 1.0` 打成了 `T = 365`——用了天数而不是年数。程序照样运行，照样打印一个数（大约 100，因为一张 365 年期、标的不分红的看涨期权几乎等于股票本身）。什么都不会崩溃。**错误的定价函数会悄无声息地失败。**所以这一课的每个函数都配一个测试：一个它必须复现的已知答案。

<figure>
<svg viewBox="0 0 700 220" role="img" aria-label="流程：输入、定价函数、数字、测试与图表">
<defs><marker id="python-pricing-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="10" y="30" width="120" height="84" rx="8" class="fx-box2"/>
<text x="70" y="54" text-anchor="middle" class="fx-t-b">输入</text>
<text x="70" y="74" text-anchor="middle" class="fx-t-sm fx-mono">S, K, T, r, σ, q</text>
<text x="70" y="92" text-anchor="middle" class="fx-t-sm">T 以年为单位</text>
<text x="70" y="106" text-anchor="middle" class="fx-t-sm">σ 用小数</text>
<rect x="160" y="30" width="150" height="84" rx="8" class="fx-hl"/>
<text x="235" y="54" text-anchor="middle" class="fx-t-b">pricing.py</text>
<text x="235" y="74" text-anchor="middle" class="fx-t-sm fx-mono">bs_price</text>
<text x="235" y="90" text-anchor="middle" class="fx-t-sm fx-mono">greeks</text>
<text x="235" y="106" text-anchor="middle" class="fx-t-sm fx-mono">implied_vol</text>
<rect x="340" y="30" width="150" height="84" rx="8" class="fx-box"/>
<text x="415" y="54" text-anchor="middle" class="fx-t-b">数字</text>
<text x="415" y="74" text-anchor="middle" class="fx-t-sm">一张期权，或者</text>
<text x="415" y="90" text-anchor="middle" class="fx-t-sm">整条期权链（数组）</text>
<text x="415" y="106" text-anchor="middle" class="fx-t-sm">（pandas 表格）</text>
<rect x="520" y="30" width="170" height="84" rx="8" class="fx-box"/>
<text x="605" y="54" text-anchor="middle" class="fx-t-b">图表</text>
<text x="605" y="74" text-anchor="middle" class="fx-t-sm">希腊字母随价格、</text>
<text x="605" y="90" text-anchor="middle" class="fx-t-sm">时间、波动率的变化</text>
<text x="605" y="106" text-anchor="middle" class="fx-t-sm">（matplotlib）</text>
<line x1="130" y1="72" x2="158" y2="72" class="fx-line" marker-end="url(#python-pricing-ah)"/>
<line x1="310" y1="72" x2="338" y2="72" class="fx-line" marker-end="url(#python-pricing-ah)"/>
<line x1="490" y1="72" x2="518" y2="72" class="fx-line" marker-end="url(#python-pricing-ah)"/>
<rect x="160" y="150" width="330" height="56" rx="8" class="fx-ok"/>
<text x="325" y="172" text-anchor="middle" class="fx-t-b">test_pricing.py —— 已知答案</text>
<text x="325" y="192" text-anchor="middle" class="fx-t-sm">10.4506 / 5.5735 · 平价 · Delta 对比数值差分 · IV 往返</text>
<line x1="235" y1="148" x2="235" y2="118" class="fx-line-ok" marker-end="url(#python-pricing-ah)"/>
<line x1="415" y1="118" x2="415" y2="148" class="fx-line-ok" marker-end="url(#python-pricing-ah)"/>
<text x="245" y="138" class="fx-t-sm">调用</text>
<text x="425" y="138" class="fx-t-sm">核对</text>
</svg>
<figcaption>图 1 · 这一课的结构。三个函数把输入变成数字和图表；一个独立的测试文件，用事先知道的答案核对这些数字。有了测试，这些数字才能用。</figcaption>
</figure>

在读更多代码之前，先玩一玩测试。下面的面板运行这一课用 Python 写的四项检查，外加一项对应 Vega 的检查，分别对一个正确实现和四个真实常见的 bug 运行。留意哪个测试抓住了哪个 bug——以及哪些 bug 溜过了你可能以为“够用”的测试：

::demo[python-pricing-check]

> [!THINK] 你的函数误把 `T` 当成天数，但你在看涨和看跌里都一致地这样用。看跌看涨平价测试 \(C - P = S - Ke^{-rT}\) 能抓住这个 bug 吗？
> 先自己判断，再打开答案。
> ---
> 不能。处处都用同一个错误的 \(T\)，看涨和看跌都被当作 365 年期的期权来定价，而平价关系对*那张*期权完全成立——这个恒等式不在乎 \(T\) 是多少。只有和**外部**已知值（教科书看涨 10.4506）比，才能抓住它。内部一致性测试（平价、往返、数值差分）证明代码和它自己一致；已知答案测试证明它和外部世界一致。两种都要。

这个模块分七块来搭：

- **① 环境约定与定价函数**
- **② 交易单位下的希腊字母**
- **③ 用“夹逼式”求解器算隐含波动率**
- **④ 一次算整条链：用 numpy 和 pandas 向量化**
- **⑤ 测试：已知答案与自洽性**
- **⑥ 画出希腊字母**
- **⑦ 交叉核对：二叉树与蒙特卡洛**

## @mechanics
### ① 环境约定与定价函数

你需要 Python 3 和四个包：`pip install numpy scipy pandas matplotlib`。写代码之前先把约定定下来，因为大多数定价 bug 都是单位 bug：

- 时间 \(T\) 用**年**，按日历天数 / 365 计（30 天 → `30 / 365`）；
- 利率 \(r\) 和股息率 \(q\) 用**连续复利的小数**（4% → `0.04`）；
- 波动率 \(\sigma\) 用**小数**（20% → `0.20`）；
- 价格**按每股**；一张合约再乘 100。

这个函数实现的是带股息率的 Black–Scholes–Merton 公式：

$$
C = S e^{-qT}\N(d_1) - K e^{-rT}\N(d_2), \qquad P = K e^{-rT}\N(-d_2) - S e^{-qT}\N(-d_1), \qquad d_{1,2} = \frac{\ln(S/K) + \left(r - q \pm \tfrac12\sigma^2\right)T}{\sigma\sqrt{T}}
$$

其中 \(S\) 是现价，\(K\) 是行权价，\(\N\) 是标准正态分布函数（`norm.cdf`），\(e^{-qT}\)、\(e^{-rT}\) 分别给股票和行权价贴现。\(q = 0\) 时，它就是 [[black-scholes]] 里的那个公式。

```python
import numpy as np
from scipy.stats import norm
from scipy.optimize import brentq


def bs_price(S, K, T, r, sigma, kind="call", q=0.0):
    """Black-Scholes-Merton price per share. Needs T > 0 and sigma > 0.
    S, K, T or sigma may be numpy arrays: the formula is applied element by element."""
    sqT = np.sqrt(T)
    d1 = (np.log(S / K) + (r - q + 0.5 * sigma**2) * T) / (sigma * sqT)
    d2 = d1 - sigma * sqT
    if kind == "call":
        return S * np.exp(-q * T) * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)
    return K * np.exp(-r * T) * norm.cdf(-d2) - S * np.exp(-q * T) * norm.cdf(-d1)
```

有两个设计选择很重要。第一，这个函数**拒绝处理到期那一刻**：\(T = 0\) 时公式会除以零，所以调用者必须改用内在价值 \(\max(S - K, 0)\)——一条明确的规则，比一个藏起来的特殊情况更安全。第二，每一步运算都是 numpy 运算，所以同一个函数既能给一张期权定价，也能给一万张定价。

> [!EXAMPLE] 最先的四行输出
> ```python
> print(f"{bs_price(100, 100, 1, 0.05, 0.20):.4f}")          # 10.4506  textbook call
> print(f"{bs_price(100, 100, 1, 0.05, 0.20, 'put'):.4f}")   # 5.5735   textbook put
> print(f"{bs_price(100, 100, 1, 0.04, 0.20):.4f}")          # 9.9251   Kai's 1-year call
> print(f"{bs_price(100, 100, 1, 0.04, 0.20, 'put'):.4f}")   # 6.0040   Kai's 1-year put
> ```
> 第一对是教科书核对例子（\(S = K = 100,\ T = 1,\ r = 5\%,\ \sigma = 20\%\)），Hull 等大多数教材里都有。第二对是本课程自己的 XYZ，\(r = 4\%\)：\(9.93 - 6.00 = 3.93 \approx 100 - 96.08\)，正是 [[put-call-parity]] 里的平价关系。

> [!DEEP] 数值上的讲究：为什么看跌用 \(\N(-d)\) 而不是 \(1 - \N(d)\)
> 数学上 \(\N(-d_2) = 1 - \N(d_2)\)，但在浮点运算里两者的精度不一样。对一张深度虚值的看跌，\(d_2\) 可能是 8；\(\N(8)\) 等于 \(1 - 6.2 \times 10^{-16}\)，用 1 去减它，剩下的主要是舍入噪声，而 `norm.cdf(-8)` 能以完整精度返回 \(6.2 \times 10^{-16}\)。别处也要同样小心：\(T = 0\) 要显式处理，而不是让 \(d_1\) 变成无穷大；由一两个最小价位的价格算出的隐含波动率也不要轻信——那里 Vega 极小，价格变一美分，答案就会移动好几个波动率点。给数百万张期权定价的程序库会用向量化的特殊函数（`norm.cdf` 底下就是 `scipy.special.ndtr`）和编译代码，但算术是一样的。

### ② 交易单位下的希腊字母

希腊字母就是公式的偏导数。微积分给出的是“每 1.00”的单位——每 1 美元股价、每年、每 100 个波动率点——但交易员和券商界面报的是**每天**的 Theta、**每个波动率点**的 Vega、**每 1% 利率**的 Rho（[[greeks-map]]）。在函数内部一次性换算：

$$
\Theta_{\text{天}} = \frac{\Theta_{\text{年}}}{365}, \qquad \nu_{\text{点}} = \frac{\nu}{100}, \qquad \rho_{1\%} = \frac{\rho}{100}
$$

其中 \(\Theta_{\text{年}} = \partial V/\partial t\) 以每年美元计，\(\nu = \partial V/\partial\sigma\) 以每 1.00 波动率计，\(\rho = \partial V/\partial r\) 以每 1.00 利率计。

```python
def greeks(S, K, T, r, sigma, kind="call", q=0.0):
    """Greeks in trading units: delta per $1, gamma per $1, vega per vol point,
    theta per calendar day, rho per 1% of rate."""
    sqT = np.sqrt(T)
    d1 = (np.log(S / K) + (r - q + 0.5 * sigma**2) * T) / (sigma * sqT)
    d2 = d1 - sigma * sqT
    dq, dr, pdf = np.exp(-q * T), np.exp(-r * T), norm.pdf(d1)
    gamma = dq * pdf / (S * sigma * sqT)
    vega = S * dq * pdf * sqT                                  # per 1.00 of sigma
    decay = -S * dq * pdf * sigma / (2 * sqT)
    if kind == "call":
        delta = dq * norm.cdf(d1)
        theta = decay - r * K * dr * norm.cdf(d2) + q * S * dq * norm.cdf(d1)
        rho = K * T * dr * norm.cdf(d2)
    else:
        delta = -dq * norm.cdf(-d1)
        theta = decay + r * K * dr * norm.cdf(-d2) - q * S * dq * norm.cdf(-d1)
        rho = -K * T * dr * norm.cdf(-d2)
    return {"delta": delta, "gamma": gamma, "vega": vega / 100,
            "theta": theta / 365, "rho": rho / 100}
```

> [!EXAMPLE] 标准的 30 天看涨，打印出来
> ```python
> g = greeks(100, 100, 30 / 365, 0.04, 0.20)
> print({k: round(float(v), 4) for k, v in g.items()})
> # {'delta': 0.5343, 'gamma': 0.0693, 'vega': 0.114, 'theta': -0.0436, 'rho': 0.0419}
> ```
> 这正是课程里 30 天平值看涨的标准数字：Δ 0.534、Γ 0.069、每个波动率点 Vega 0.114、每天 Θ −0.044。一张合约乘以 100：其他条件不变时，这张看涨每天大约损失 \(0.0436 \times 100 = \$4.36\)。

Gamma 和 Vega 的代码里没有 `if`：同样输入下，看涨和看跌的 Gamma、Vega 完全相同。因为由平价关系，两者只差一笔股票和一笔债券，而这两样对 \(S\) 的二阶导数、对 \(\sigma\) 的导数都是零。

### ③ 用“夹逼式”求解器算隐含波动率

隐含波动率是把公式倒过来用：找到让模型价格等于市场价格的那个 \(\sigma\)（[[implied-vol]]）。把它写成求根问题：

$$
f(\sigma) = C_{\text{BS}}(\sigma) - C_{\text{市场}} = 0
$$

其中 \(C_{\text{BS}}(\sigma)\) 是波动率为 \(\sigma\) 时的 `bs_price`，\(C_{\text{市场}}\) 是观察到的价格。价格随 \(\sigma\) 上升（Vega 为正），所以 \(f\) 恰好穿过零一次——**前提是**市场价格位于 [[arbitrage-bounds]] 的无套利边界之内。低于下界，没有任何波动率能产生这个价格；等于或高于上界，也不行。

[[implied-vol]] 用牛顿法解这个方程：快，但要除以 Vega，在 Vega 很小时（深度虚值或极短期期权）可能冲过头。这里我们用 **Brent 法**（`scipy.optimize.brentq`）：给它一个区间 \([a, b]\)，只要 \(f(a) < 0 < f(b)\)，它就保证收敛——既有二分法的稳妥，又有插值步骤的速度。

```python
def implied_vol(price, S, K, T, r, kind="call", q=0.0):
    """The sigma that makes bs_price match `price`; nan if no sigma can."""
    fwd_S, pv_K = S * np.exp(-q * T), K * np.exp(-r * T)
    lower = max(fwd_S - pv_K, 0.0) if kind == "call" else max(pv_K - fwd_S, 0.0)
    upper = fwd_S if kind == "call" else pv_K
    if not (lower < price < upper):
        return np.nan                                       # outside no-arbitrage bounds
    f = lambda s: bs_price(S, K, T, r, s, kind, q) - price
    return brentq(f, 1e-6, 5.0, xtol=1e-10)   # f(1e-6) < 0; f(5) > 0 for any vol below 500%
```

<figure>
<svg viewBox="0 0 660 250" role="img" aria-label="函数 f(σ) 在求解区间内穿过零">
<line x1="60" y1="156.7" x2="620" y2="156.7" class="fx-axis"/>
<line x1="60" y1="30" x2="60" y2="225" class="fx-axis"/>
<text x="52" y="160" text-anchor="end" class="fx-t-sm">0</text>
<text x="52" y="110" text-anchor="end" class="fx-t-sm">+2</text>
<text x="52" y="59" text-anchor="end" class="fx-t-sm">+4</text>
<text x="52" y="211" text-anchor="end" class="fx-t-sm">−2</text>
<line x1="60" y1="106" x2="620" y2="106" class="fx-grid"/>
<line x1="60" y1="55.3" x2="620" y2="55.3" class="fx-grid"/>
<line x1="60" y1="207.3" x2="620" y2="207.3" class="fx-grid"/>
<polyline points="69.0,210.0 78.0,207.9 87.0,205.3 96.0,202.5 105.0,199.7 114.0,196.9 123.0,194.1 132.0,191.2 141.0,188.3 150.0,185.5 159.0,182.6 168.0,179.7 177.0,176.8 186.0,173.9 195.0,171.1 204.0,168.2 213.0,165.3 222.0,162.4 231.0,159.5 240.0,156.6 249.0,153.7 258.0,150.9 267.0,148.0 276.0,145.1 285.0,142.2 294.0,139.3 303.0,136.4 312.0,133.5 321.0,130.6 330.0,127.8 339.0,124.9 348.0,122.0 357.0,119.1 366.0,116.2 375.0,113.3 384.0,110.4 393.0,107.5 402.0,104.7 411.0,101.8 420.0,98.9 429.0,96.0 438.0,93.1 447.0,90.2 456.0,87.3 465.0,84.5 474.0,81.6 483.0,78.7 492.0,75.8 501.0,72.9 510.0,70.0 519.0,67.1 528.0,64.3 537.0,61.4 546.0,58.5 555.0,55.6 564.0,52.7 573.0,49.8 582.0,47.0 591.0,44.1 600.0,41.2" class="fx-line-thick"/>
<circle cx="60" cy="211" r="6" class="fx-fill-red"/>
<text x="72" y="228" class="fx-t-bad">a = 0.000001：f = −2.12</text>
<circle cx="240" cy="156.7" r="6" class="fx-fill-orange"/>
<text x="248" y="176" class="fx-t-hl">根 σ = 0.1999</text>
<line x1="600" y1="41" x2="630" y2="22" class="fx-line-ok fx-dash"/>
<text x="628" y="18" text-anchor="end" class="fx-t-ok">b = 5.0：f = +50.3（在图外）</text>
<text x="60" y="246" class="fx-t-sm">σ 从 0 到 0.60 · 30 天 100 看涨，市场价 2.45 · f(σ) = C_BS(σ) − 2.45</text>
<text x="380" y="190" class="fx-t-sm">brentq 只需要符号变化</text>
</svg>
<figcaption>图 2 · 求隐含波动率。波动率几乎为零时，看涨只值它贴现后的远期内在价值（0.33），所以 \(f\) 为负；σ = 5 时它几乎值整只股票，\(f\) 大幅为正。一次符号变化保证一个根——这里是 σ = 0.1999，因为报价 2.45 是模型价 2.4513 向下取到了美分。</figcaption>
</figure>

> [!EXAMPLE] 四个隐含波动率，其中一个不可能
> ```python
> T = 30 / 365
> print(round(implied_vol(2.45, 100, 100, T, 0.04), 4))   # 0.1999  the quoted 2.45
> print(round(implied_vol(0.70, 100, 105, T, 0.04), 4))   # 0.1985  105 call at the bid
> print(round(implied_vol(0.72, 100, 105, T, 0.04), 4))   # 0.2008  105 call at the ask
> print(implied_vol(0.01, 100, 90, T, 0.04))              # nan     below intrinsic: impossible
> ```
> 105 看涨 0.70 / 0.72 的报价，价差是 \(20.08\% - 19.85\% = 0.23\) 个波动率点——正是小凯在 [[first-trade]] 里用到的那个数。最后一行要一张 90 行权价的看涨只卖 0.01，而它至少值 \(100 - 90e^{-0.04 \times 30/365} = 10.30\)：没有任何波动率能做到，函数用 `nan` 如实相告，而不是返回一个胡乱的数。

### ④ 一次算整条链：用 numpy 和 pandas 向量化

因为每一步都是逐元素运算，传入一个行权价数组，一次调用就能给整条链定价——不需要 Python 循环。再由 pandas 把数组变成表格（[[option-chain]]）：

```python
import pandas as pd

T = 30 / 365
strikes = np.arange(90, 111, 5.0)
g = greeks(100, strikes, T, 0.04, 0.20)
chain = pd.DataFrame({
    "strike": strikes,
    "call": bs_price(100, strikes, T, 0.04, 0.20),
    "put": bs_price(100, strikes, T, 0.04, 0.20, "put"),
    "delta": g["delta"],
    "gamma": g["gamma"],
})
print(chain.round(4).to_string(index=False))
gap = chain["call"] - chain["put"] - (100 - chain["strike"] * np.exp(-0.04 * T))
print(np.allclose(gap, 0))
```

它打印出（不同 pandas 版本的列间距可能略有不同）：

```text
 strike    call    put  delta  gamma
   90.0 10.3562 0.0608 0.9728 0.0109
   95.0  5.8207 0.5089 0.8366 0.0430
  100.0  2.4513 2.1230 0.5343 0.0693
  105.0  0.7129 5.3683 0.2222 0.0519
  110.0  0.1379 9.7768 0.0575 0.0201
True
```

每一行都是你见过的数字：平值的 2.45 和 2.12，小凯的 105 看涨 0.71，95 看跌 0.51。最后一行一次性核对了每一行的平价关系。在下面的小工具里换一换输入——它会实时打印同一张表：

::demo[python-pricing-chain]

用真实数据时，这些输入来自 [[options-data]] 的清洗流程：由平价推出的隐含远期、一个利率，以及中间价而不是最后成交价。向量化在那里很重要——一个完整的指数期权链有几十个到期日、上千个行权价，用纯 Python 循环会比一次 numpy 调用慢得多。

### ⑤ 测试：已知答案与自洽性

测试文件让检查自动进行。装好 `pytest` 后，运行 `pytest`，它会找出所有名为 `test_…` 的函数并报告失败：

```python
import numpy as np
from pricing import bs_price, greeks, implied_vol


def test_textbook_values():                      # Hull-style check set: S = K = 100, T = 1, r = 5%, sigma = 20%
    assert abs(bs_price(100, 100, 1, 0.05, 0.20) - 10.4506) < 1e-4
    assert abs(bs_price(100, 100, 1, 0.05, 0.20, "put") - 5.5735) < 1e-4


def test_put_call_parity():
    S, K, T, r = 100, 105, 30 / 365, 0.04
    c, p = bs_price(S, K, T, r, 0.2), bs_price(S, K, T, r, 0.2, "put")
    assert abs((c - p) - (S - K * np.exp(-r * T))) < 1e-10


def test_delta_matches_a_bump():                 # analytic delta vs a finite difference
    h, T = 0.01, 30 / 365
    bump = (bs_price(100 + h, 100, T, 0.04, 0.2) - bs_price(100 - h, 100, T, 0.04, 0.2)) / (2 * h)
    assert abs(greeks(100, 100, T, 0.04, 0.2)["delta"] - bump) < 1e-6


def test_iv_round_trip():
    price = bs_price(100, 95, 30 / 365, 0.04, 0.27, "put")
    assert abs(implied_vol(price, 100, 95, 30 / 365, 0.04, "put") - 0.27) < 1e-8
```

这四个测试分两类。**已知答案测试**（第一个）和独立算出的数字比较——教科书、另一个程序库、同事的电子表格。**自洽性测试**（另外三个）检查代码和它自己是否一致：平价关系；中心差分 \(\frac{V(S+h) - V(S-h)}{2h}\)，它应当和解析 Delta 相符到约 \(h^2\) 的量级；价格 → 波动率 → 价格的往返。自洽性能抓住符号和代数上的疏忽；只有已知答案才能抓住“一致的误解”，比如用天数代替年数。容差也是刻意选的：发表出来的四位小数用 \(10^{-4}\)，本应精确成立的恒等式用 \(10^{-10}\)。

> [!WARN] AI 助手写的代码，也要过同样的测试
> 语言模型几秒钟就能写出这个模块，而且通常是对的。出错时往往是悄无声息的那种：Theta 按年而不是按天、Vega 按每 1.00 而不是每个点、看跌用了 \(\N(d_2)\) 而不是 \(\N(-d_2)\)、股息率减错了地方。用任何数字之前，先跑测试（[[ai-agents]]）。

### ⑥ 画出希腊字母

有了向量化的函数，画图只需几行 matplotlib。下面画出 100 看涨在三个到期日下的 Gamma 和每日 Theta：

```python
import matplotlib.pyplot as plt

S = np.linspace(70, 130, 241)
fig, ax = plt.subplots(1, 2, figsize=(10, 4))
for days in (7, 30, 90):
    g = greeks(S, 100, days / 365, 0.04, 0.20)
    ax[0].plot(S, g["gamma"], label=f"{days} days")
    ax[1].plot(S, g["theta"], label=f"{days} days")
ax[0].set_title("Gamma of the 100 call")
ax[1].set_title("Theta per day")
for a in ax:
    a.set_xlabel("XYZ price")
    a.axvline(100, ls=":", c="grey")
    a.legend()
plt.tight_layout()
plt.show()
```

<figure>
<svg viewBox="0 0 660 260" role="img" aria-label="100 看涨在 7、30、90 天时 Gamma 随股价的变化">
<line x1="60" y1="220" x2="625" y2="220" class="fx-axis"/>
<line x1="60" y1="25" x2="60" y2="220" class="fx-axis"/>
<line x1="60" y1="156.7" x2="620" y2="156.7" class="fx-grid"/>
<line x1="60" y1="93.3" x2="620" y2="93.3" class="fx-grid"/>
<line x1="60" y1="30" x2="620" y2="30" class="fx-grid"/>
<text x="52" y="224" text-anchor="end" class="fx-t-sm">0</text>
<text x="52" y="160" text-anchor="end" class="fx-t-sm">0.05</text>
<text x="52" y="97" text-anchor="end" class="fx-t-sm">0.10</text>
<text x="52" y="34" text-anchor="end" class="fx-t-sm">0.15</text>
<text x="60" y="238" text-anchor="middle" class="fx-t-sm">70</text>
<text x="200" y="238" text-anchor="middle" class="fx-t-sm">85</text>
<text x="340" y="238" text-anchor="middle" class="fx-t-sm">100</text>
<text x="480" y="238" text-anchor="middle" class="fx-t-sm">115</text>
<text x="620" y="238" text-anchor="middle" class="fx-t-sm">130</text>
<line x1="340" y1="25" x2="340" y2="220" class="fx-line-muted fx-dash"/>
<polyline points="60.0,219.8 64.7,219.8 69.3,219.7 74.0,219.6 78.7,219.5 83.3,219.4 88.0,219.3 92.7,219.1 97.3,218.9 102.0,218.7 106.7,218.4 111.3,218.1 116.0,217.8 120.7,217.4 125.3,217.0 130.0,216.5 134.7,215.9 139.3,215.3 144.0,214.6 148.7,213.8 153.3,213.0 158.0,212.0 162.7,211.0 167.3,209.9 172.0,208.8 176.7,207.5 181.3,206.2 186.0,204.8 190.7,203.3 195.3,201.8 200.0,200.2 204.7,198.5 209.3,196.8 214.0,195.1 218.7,193.3 223.3,191.5 228.0,189.7 232.7,188.0 237.3,186.2 242.0,184.4 246.7,182.7 251.3,181.0 256.0,179.4 260.7,177.9 265.3,176.4 270.0,175.1 274.7,173.8 279.3,172.7 284.0,171.6 288.7,170.7 293.3,169.9 298.0,169.3 302.7,168.8 307.3,168.4 312.0,168.2 316.7,168.1 321.3,168.2 326.0,168.3 330.7,168.7 335.3,169.1 340.0,169.7 344.7,170.4 349.3,171.2 354.0,172.1 358.7,173.1 363.3,174.1 368.0,175.3 372.7,176.5 377.3,177.8 382.0,179.1 386.7,180.5 391.3,181.9 396.0,183.4 400.7,184.8 405.3,186.3 410.0,187.8 414.7,189.3 419.3,190.7 424.0,192.2 428.7,193.6 433.3,195.0 438.0,196.3 442.7,197.7 447.3,199.0 452.0,200.2 456.7,201.4 461.3,202.6 466.0,203.7 470.7,204.8 475.3,205.8 480.0,206.8 484.7,207.8 489.3,208.6 494.0,209.5 498.7,210.3 503.3,211.0 508.0,211.7 512.7,212.4 517.3,213.0 522.0,213.5 526.7,214.1 531.3,214.6 536.0,215.0 540.7,215.5 545.3,215.9 550.0,216.2 554.7,216.6 559.3,216.9 564.0,217.2 568.7,217.4 573.3,217.7 578.0,217.9 582.7,218.1 587.3,218.3 592.0,218.5 596.7,218.6 601.3,218.8 606.0,218.9 610.7,219.0 615.3,219.1 620.0,219.2" class="fx-line-blue"/>
<polyline points="60.0,220.0 64.7,220.0 69.3,220.0 74.0,220.0 78.7,220.0 83.3,220.0 88.0,220.0 92.7,220.0 97.3,220.0 102.0,220.0 106.7,220.0 111.3,220.0 116.0,220.0 120.7,220.0 125.3,220.0 130.0,220.0 134.7,220.0 139.3,220.0 144.0,220.0 148.7,219.9 153.3,219.9 158.0,219.9 162.7,219.8 167.3,219.7 172.0,219.6 176.7,219.5 181.3,219.3 186.0,219.0 190.7,218.7 195.3,218.2 200.0,217.6 204.7,216.9 209.3,216.0 214.0,214.8 218.7,213.5 223.3,211.9 228.0,209.9 232.7,207.7 237.3,205.1 242.0,202.2 246.7,198.9 251.3,195.2 256.0,191.3 260.7,187.0 265.3,182.4 270.0,177.7 274.7,172.7 279.3,167.7 284.0,162.7 288.7,157.8 293.3,153.1 298.0,148.6 302.7,144.5 307.3,140.9 312.0,137.7 316.7,135.1 321.3,133.2 326.0,131.9 330.7,131.3 335.3,131.4 340.0,132.2 344.7,133.6 349.3,135.6 354.0,138.2 358.7,141.3 363.3,144.8 368.0,148.6 372.7,152.7 377.3,157.0 382.0,161.4 386.7,165.9 391.3,170.3 396.0,174.7 400.7,179.0 405.3,183.0 410.0,186.9 414.7,190.6 419.3,194.0 424.0,197.1 428.7,200.0 433.3,202.6 438.0,205.0 442.7,207.1 447.3,209.0 452.0,210.6 456.7,212.1 461.3,213.3 466.0,214.4 470.7,215.4 475.3,216.1 480.0,216.8 484.7,217.4 489.3,217.9 494.0,218.3 498.7,218.6 503.3,218.9 508.0,219.1 512.7,219.3 517.3,219.4 522.0,219.5 526.7,219.6 531.3,219.7 536.0,219.8 540.7,219.8 545.3,219.9 550.0,219.9 554.7,219.9 559.3,219.9 564.0,220.0 568.7,220.0 573.3,220.0 578.0,220.0 582.7,220.0 587.3,220.0 592.0,220.0 596.7,220.0 601.3,220.0 606.0,220.0 610.7,220.0 615.3,220.0 620.0,220.0" class="fx-line-hl"/>
<polyline points="60.0,220.0 64.7,220.0 69.3,220.0 74.0,220.0 78.7,220.0 83.3,220.0 88.0,220.0 92.7,220.0 97.3,220.0 102.0,220.0 106.7,220.0 111.3,220.0 116.0,220.0 120.7,220.0 125.3,220.0 130.0,220.0 134.7,220.0 139.3,220.0 144.0,220.0 148.7,220.0 153.3,220.0 158.0,220.0 162.7,220.0 167.3,220.0 172.0,220.0 176.7,220.0 181.3,220.0 186.0,220.0 190.7,220.0 195.3,220.0 200.0,220.0 204.7,220.0 209.3,220.0 214.0,220.0 218.7,220.0 223.3,220.0 228.0,220.0 232.7,220.0 237.3,220.0 242.0,219.9 246.7,219.8 251.3,219.6 256.0,219.3 260.7,218.7 265.3,217.6 270.0,215.8 274.7,212.9 279.3,208.6 284.0,202.5 288.7,193.9 293.3,182.7 298.0,168.6 302.7,151.9 307.3,132.9 312.0,112.5 316.7,92.1 321.3,73.1 326.0,56.9 330.7,45.0 335.3,38.4 340.0,37.7 344.7,42.9 349.3,53.3 354.0,68.0 358.7,85.6 363.3,104.8 368.0,124.2 372.7,142.7 377.3,159.4 382.0,173.8 386.7,185.8 391.3,195.4 396.0,202.8 400.7,208.3 405.3,212.2 410.0,215.0 414.7,216.8 419.3,218.1 424.0,218.8 428.7,219.3 433.3,219.6 438.0,219.8 442.7,219.9 447.3,219.9 452.0,220.0 456.7,220.0 461.3,220.0 466.0,220.0 470.7,220.0 475.3,220.0 480.0,220.0 484.7,220.0 489.3,220.0 494.0,220.0 498.7,220.0 503.3,220.0 508.0,220.0 512.7,220.0 517.3,220.0 522.0,220.0 526.7,220.0 531.3,220.0 536.0,220.0 540.7,220.0 545.3,220.0 550.0,220.0 554.7,220.0 559.3,220.0 564.0,220.0 568.7,220.0 573.3,220.0 578.0,220.0 582.7,220.0 587.3,220.0 592.0,220.0 596.7,220.0 601.3,220.0 606.0,220.0 610.7,220.0 615.3,220.0 620.0,220.0" class="fx-line-bad"/>
<text x="352" y="40" class="fx-t-bad">7 天：0.144</text>
<text x="398" y="160" class="fx-t-hl">30 天：0.069</text>
<text x="470" y="192" class="fx-t-blue">90 天：0.040</text>
<text x="620" y="256" text-anchor="end" class="fx-t-sm">XYZ 价格 · 100 看涨，σ = 20%，r = 4%</text>
</svg>
<figcaption>图 3 · 左边那张图画出来的样子（用同样的公式算出）。Gamma 在行权价处达到峰值；到期时间每缩短为四分之一，峰值大约翻一倍，就像 \(1/\sqrt{T}\)：90 天 0.040、30 天 0.069、7 天 0.144——这就是短期期权那么“跳”的原因（[[gamma]]）。</figcaption>
</figure>

### ⑦ 交叉核对：二叉树与蒙特卡洛

对定价函数最有力的检验，是用一种**不同的方法**去核对，而且两者必须一致。有两种方法短到可以写在这里。第一种是 [[binomial-trees]] 里的 Cox–Ross–Rubinstein 二叉树，每一步都向量化，并且能提前行权：

```python
def crr_price(S, K, T, r, sigma, kind="put", steps=500, american=True):
    """Cox-Ross-Rubinstein tree; american=True checks early exercise at every node."""
    dt = T / steps
    u = np.exp(sigma * np.sqrt(dt))
    d = 1 / u
    p = (np.exp(r * dt) - d) / (u - d)                 # risk-neutral up-probability
    disc = np.exp(-r * dt)
    j = np.arange(steps + 1)
    ST = S * u**j * d**(steps - j)                     # prices at expiry, lowest first
    payoff = (lambda x: np.maximum(K - x, 0.0)) if kind == "put" else (lambda x: np.maximum(x - K, 0.0))
    V = payoff(ST)
    for i in range(steps - 1, -1, -1):                 # walk back one step at a time
        ST = ST[: i + 1] * u                           # node prices one step earlier
        V = disc * (p * V[1:] + (1 - p) * V[:-1])
        if american:
            V = np.maximum(V, payoff(ST))
    return float(V[0])
```

用教科书的输入，它对美式看跌打印出 **6.0888**，对欧式看跌打印出 **5.5695**，而公式给出 5.5735——树的这点小差距是离散化误差，`steps` 越多越小。\(6.09 - 5.57 = 0.52\) 这个差，就是任何 Black–Scholes 公式都给不出的**提前行权溢价**（[[american-exercise]]）。

蒙特卡洛（[[monte-carlo]]）对模拟出的风险中性价格的贴现收益求平均。它的估计是随机的，所以必须连同标准误一起报告：

$$
\hat C = e^{-rT}\,\frac{1}{n}\sum_{i=1}^{n} \max\!\big(S_T^{(i)} - K,\ 0\big), \qquad \text{SE} = \frac{s}{\sqrt{n}}
$$

其中 \(S_T^{(i)} = S\exp\!\big((r - \tfrac12\sigma^2)T + \sigma\sqrt{T}\,Z_i\big)\) 是第 \(i\) 个模拟价格，\(s\) 是贴现收益的样本标准差，\(n\) 是独立样本的个数。

```python
def mc_call(S, K, T, r, sigma, n=100_000, seed=42):
    """Monte Carlo under Q with antithetic pairs. Returns (price, standard error)."""
    rng = np.random.default_rng(seed)
    z = rng.standard_normal(n // 2)
    drift, vol = (r - 0.5 * sigma**2) * T, sigma * np.sqrt(T)
    pay_up = np.maximum(S * np.exp(drift + vol * z) - K, 0.0)
    pay_dn = np.maximum(S * np.exp(drift - vol * z) - K, 0.0)
    pairs = np.exp(-r * T) * 0.5 * (pay_up + pay_dn)   # one number per antithetic pair
    return pairs.mean(), pairs.std(ddof=1) / np.sqrt(len(pairs))
```

> [!EXAMPLE] 蒙特卡洛核对应该打印什么
> 对教科书看涨，10 万个随机数组成 5 万对对偶样本，标准误约 **0.03**。所以 `mc_call(100, 100, 1, 0.05, 0.20)` 应当落在 10.4506 附近约 \(2 \times 0.033 \approx 0.07\) 的范围内——具体的数字取决于随机数生成器和种子。针对它的测试要用几个标准误作容差，而不能要求相等：`assert abs(price - 10.4506) < 4 * se`。

三种方法，一个数字：公式的 10.4506，树向它收敛，模拟在它周围散布。**独立的方法一致时，三者都可以信任；不一致时，其中必有一个有 bug**——这就是从程序员的角度看到的第 ② 个观念。

## @analogy
写一个定价程序库，就像**做一台厨房秤**。让它显示一个数很容易——随便一根弹簧加一个表盘就行。要知道这个数*是对的*，需要标准砝码：1 千克的砝码必须正好读出 1.000（教科书的 10.4506）。然后是一致性检查：两样东西一起放上去，读数必须等于分别称的读数之和（平价）；多放一克，读数必须多一克（Delta 数值差分）。一台把所有东西都称重 3% 的秤，能完美通过所有一致性检查——只有标准砝码能揭穿它（用天数代替年数）。最后，另一台设计不同的秤（二叉树、模拟）应当和第一台读数一致。

这个类比有一处不成立：厨房秤称的是真实存在的东西。定价模型算的是*在某些假设下的公允价值*。通过所有测试，只证明代码正确地实现了 Black–Scholes；并不证明 Black–Scholes 就是这张期权该用的模型（[[bs-assumptions]]）。

## @misconceptions
- **“能跑、不报错，就是对的。”** —— 定价 bug 往往悄无声息：天数代替年数、Vega 按每 1.00 而非每个点、少了一个贴现因子。只有和已知值比较的测试才能抓住它们。
- **“看跌看涨平价就是完整的测试。”** —— 平价检查的是内部一致性。一个处处都用错时间单位的函数，也能精确满足平价；你还需要像 10.4506 这样的外部已知答案。
- **“隐含波动率总是存在的。”** —— 只有当价格严格落在无套利边界之内时才存在。低于内在价值（或其贴现形式）时，没有任何波动率能对上，稳健的求解器应当返回 `nan`，而不是一个没有意义的数。
- **“牛顿法永远是对的求解器。”** —— 它在平值附近很快，但要除以 Vega，而深度虚值和极短期期权的 Vega 很小。像 Brent 法这样的夹逼式求解器，只要区间两端符号相反，就保证收敛。
- **“蒙特卡洛价格应当和公式完全相等。”** —— 它是一个估计，标准误约为 \(s/\sqrt{n}\)。要用几个标准误作容差来检验，换一个种子，数字自然不同。

## @takeaways
- Black–Scholes–Merton 函数大约十行 numpy；先定单位（T 用年，σ 和利率用小数，价格按每股），因为大多数 bug 是单位 bug。
- 在函数内把希腊字母换成交易单位：Theta 按天（÷365），Vega 按每个波动率点（÷100），Rho 按每 1%（÷100）；30 天平值看涨：Δ 0.5343、Γ 0.0693、Vega 0.114、Θ −0.0436。
- 先检查无套利边界，再用夹逼式求根器（`brentq`）解隐含波动率；没有波动率能对上时返回 `nan`。
- 两类测试都要：已知答案（10.4506 / 5.5735；9.9251 / 6.0040）与自洽性（平价、数值差分 Delta、IV 往返）；只有自洽性会漏掉“一致的错误”。
- 用独立方法交叉核对：CRR 树给出美式看跌 6.0888（欧式 5.5695，精确值 5.5735）；蒙特卡洛在其标准误之内与公式一致。

## @quiz
1. 你的 `bs_price(100, 100, 1, 0.05, 0.20)` 打印 10.4506，看跌打印 5.5735。哪个结论站得住？
   - [ ] 这个函数对所有输入都是对的
   - [x] 它复现了教科书核对例子，这有力地说明公式和单位在这组输入下是对的
   - [ ] Black–Scholes 就是真实期权的正确模型
   - [ ] 希腊字母不需要再测试了
   > 已知答案测试是最有力的单项检查，但它检验的是这组输入、这个函数。希腊字母需要自己的测试；而通过测试证明的是代码实现了模型，不是模型符合市场。
2. 同事的函数通过了平价测试和 IV 往返测试，但教科书看涨打印出大约 100。最可能的 bug 是什么？
   - [ ] 看跌公式用了 \(\N(d_2)\) 而不是 \(\N(-d_2)\)
   - [ ] Vega 没有除以 100
   - [ ] 行权价没有贴现
   - [x] 时间传的是天数而不是年数
   > 一致地使用 \(T = 365\) 时，平价和往返都精确成立，但定价的是一张 365 年期的看涨，几乎等于股票。看跌公式写错或漏了贴现会破坏平价；Vega 的 bug 不影响价格。
3. 这一课为什么用 `brentq` 加区间 \([10^{-6}, 5]\) 来解隐含波动率？
   - [x] 价格随 σ 上升，所以只要市场价在无套利边界之内，\(f(\sigma)\) 就在区间内恰好变号一次，夹逼式方法一定收敛
   - [ ] 因为牛顿法没法用 Python 写
   - [ ] 因为隐含波动率总在 0 和 1 之间
   - [ ] 因为 `brentq` 不需要定价函数
   > Brent 法只需要一次符号变化，并且保证收敛；牛顿法要除以 Vega，Vega 小时可能冲过头。先做边界检查，排除任何波动率都产生不了的价格。
4. `greeks(100, 100, 30/365, 0.04, 0.20)` 返回 Theta −0.0436。对一张合约意味着什么？
   - [ ] 每天损失 0.0436 美元
   - [ ] 每年损失 4.36 美元
   - [x] 其他不变时，每天约损失 4.36 美元
   - [ ] 每天损失自身价值的 4.36%
   > 函数返回的是每股、每个日历日的 Theta（年 Theta ÷ 365）。一张合约是 100 股：\(0.0436 \times 100 = \$4.36\) 每天，其他条件不变。
5. 用 5 万对对偶样本的蒙特卡洛看涨价打印 10.47，标准误 0.03；公式给出 10.4506。测试该得出什么结论？
   - [ ] 失败：两个数不相等
   - [x] 通过：0.02 的差距远在几个标准误之内
   - [ ] 失败：蒙特卡洛必须在 0.0001 之内
   - [ ] 只有种子是 42 时才算通过
   > 模拟价格是估计值；正确的检验是 \(|\hat C - C| <\) 几个标准误。\(|10.47 - 10.4506| \approx 0.02 < 4 \times 0.03\)。不同种子给出不同的数字，都与公式一致。

## @further
- [SciPy: scipy.stats.norm](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.norm.html) — \(\N(\cdot)\) 和 \(\varphi(\cdot)\) 背后的分布函数。
- [SciPy: scipy.optimize.brentq](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.brentq.html) — 用来解隐含波动率的 Brent 夹逼式求根器。
- [NumPy: broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html) — 为什么一个函数不用循环就能给整条链定价。
- [pytest documentation](https://docs.pytest.org/) — 编写和运行测试文件。
- [Black & Scholes (1973), The Pricing of Options and Corporate Liabilities](https://doi.org/10.1086/260062) — 这个模块实现的公式的原始论文。
- [Binomial options pricing model（维基百科）](https://en.wikipedia.org/wiki/Binomial_options_pricing_model) — 用作交叉核对的 Cox–Ross–Rubinstein 二叉树及其来历。

## @next
一个经过测试的定价函数是一块积木。接下来的问题，是每个做收入型交易的人迟早会问的：像“每个月卖一张 5% 虚值的看跌”这样的规则，放到多年的价格里、算上价差、费用和偶尔的崩盘，会是什么结果？下一课用 pandas 一行一行地搭出这个回测。
