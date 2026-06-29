export default {
  id: "python-pricing",
  stage: 11,
  order: 3,
  title: "用 Python 给期权定价、画希腊字母",
  difficulty: 3,
  prereqs: ["black-scholes", "greeks-overview"],

  oneLiner:
    "把 Black-Scholes 与希腊字母从公式变成**几十行可运行的 Python**：用 `scipy.stats.norm` 写出定价与希腊字母函数、用**二分法**反解隐含波动率、再用 `matplotlib` 把损益与希腊字母曲线画出来——这就是量化期权工作的起点。",

  intuition: `
前面几个阶段你已经吃透了 Black-Scholes 的公式（阶段 4.1）和五个希腊字母的含义（阶段 5.1）。但公式停在纸上没有力量——**真正的量化工作，是把它变成能跑、能复用、能画图的代码**。这一节就手把手把它写成 Python。

好消息是：**这一整套，核心不到 40 行**。你需要的只有两个库：

- **NumPy**：做数值计算（对数、指数、开方、数组）。
- **SciPy 的 \`norm\`**：提供标准正态分布的累积函数 \`norm.cdf\` 和密度函数 \`norm.pdf\`——这正是 Black-Scholes 公式里那两个 N(·)。

我们要写出四样东西，每一样都对应你已经懂的概念：

- **一个定价函数** \`bs_price\`：输入 S、K、T、r、σ，输出理论价（阶段 4.1）。
- **一个希腊字母函数** \`greeks\`：一次算出 Delta/Gamma/Theta/Vega/Rho（阶段 5.1）。
- **一个隐含波动率反解** \`implied_vol\`：已知市场价，用**二分法**倒推出 IV。
- **画图**：用 matplotlib 把损益曲线、或某个希腊字母随股价的变化画出来。

右边的演示用的就是**和这段 Python 完全一样的数学**（同一套公式），你拖动滑块看到的价格和希腊字母，就是这段代码会 \`print\` 出来的结果——代码和实时数字一一对应。

**这一节，我们把“用 Python 做期权”拆成五块：**

- **① 准备：导入 numpy 与 scipy.stats.norm**
- **② 定价函数：Black-Scholes 的几行实现**
- **③ 希腊字母函数：一次算全五个**
- **④ 隐含波动率：二分法反解**
- **⑤ 画图：用 matplotlib 描出损益/希腊字母曲线**
`,

  mechanics: `
### ① 准备：导入与约定

先把工具备齐。约定全部用**年化、小数**口径：T 是年化到期时间（30 天 = 30/365）、σ 与 r 是小数（20% = 0.20）。

\`\`\`python
import numpy as np
from scipy.stats import norm   # norm.cdf = N(·), norm.pdf = N'(·)
\`\`\`

\`norm.cdf(x)\` 就是标准正态的累积分布函数 N(x)，\`norm.pdf(x)\` 是密度 N'(x)。Black-Scholes 里出现的所有 N(·) 都用它们。这两个函数支持**向量化**——传一个 numpy 数组进去，会逐元素返回数组，这让我们画曲线时一行就能算一整排。

### ② 定价函数：Black-Scholes

直接把阶段 4.1 的公式翻译过来。先算 d1、d2，再按看涨/看跌组合：

$$d_1 = [ln(S/K) + (r + σ²/2)·T] / (σ·√T)
$$d_2 = d_1 − σ·√T
$$call = S·N(d_1) − K·e^{−rT}·N(d_2)，put = K·e^{−rT}·N(−d_2) − S·N(−d_1)

\`\`\`python
def bs_price(S, K, T, r, sigma, kind="call"):
    if T <= 0 or sigma <= 0:                 # 退化为内在价值
        return max(S - K, 0.0) if kind == "call" else max(K - S, 0.0)
    d1 = (np.log(S / K) + (r + sigma**2 / 2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    if kind == "call":
        return S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)
    else:
        return K * np.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)
\`\`\`

**逐块读**：第一行处理边界（到期或零波动时价值就是内在价值，避免除零）；中间两行算 d1、d2；最后按类型返回。这就是阶段 4.1 公式的逐字实现。

> **验收对数（必做）**：用经典基准 S=K=100、T=1、r=5%、σ=20% 测一下，\`bs_price(100,100,1,0.05,0.20)\` 应得约 **10.45**。任何 BS 实现（包括 AI 帮你写的，阶段 11.5）都该先过这一关——“能跑”不等于“算对”。

### ③ 希腊字母函数：一次算全五个

希腊字母就是价格对各输入的偏导。我们按**交易口径**缩放，和你在仪表盘上看到的一致（阶段 5.1）：**vega 按每 +1% 波动率、theta 按每过 1 天（日历）、rho 按每 +1% 利率**。

\`\`\`python
def greeks(S, K, T, r, sigma, kind="call"):
    d1 = (np.log(S / K) + (r + sigma**2 / 2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    pdf = norm.pdf(d1)
    if kind == "call":
        delta = norm.cdf(d1)
        theta = (-S * pdf * sigma / (2 * np.sqrt(T))
                 - r * K * np.exp(-r * T) * norm.cdf(d2))
        rho = K * T * np.exp(-r * T) * norm.cdf(d2)
    else:
        delta = norm.cdf(d1) - 1
        theta = (-S * pdf * sigma / (2 * np.sqrt(T))
                 + r * K * np.exp(-r * T) * norm.cdf(-d2))
        rho = -K * T * np.exp(-r * T) * norm.cdf(-d2)
    gamma = pdf / (S * sigma * np.sqrt(T))   # 看涨看跌相同
    vega = S * pdf * np.sqrt(T)              # 对 sigma（小数）的导数
    return {
        "delta": delta,
        "gamma": gamma,
        "theta": theta / 365,    # 每过 1 天
        "vega": vega / 100,      # 每 +1% 波动率
        "rho": rho / 100,        # 每 +1% 利率
    }
\`\`\`

**逐块读**：\`delta\` 看涨是 N(d1)、看跌是 N(d1)−1；\`gamma\` 与 \`vega\` 看涨看跌**完全相同**（凸性与波动率敏感度不分方向）；\`theta\`、\`rho\` 按类型分支。最后三个除以 365 / 100 做单位缩放，得到交易者熟悉的“每天”“每 1%”口径。

> **基准核对**：上面经典参数下，看涨 Delta ≈ **0.637**、Gamma ≈ **0.0188**、Vega ≈ **0.375**（每 +1%）、Theta ≈ **−0.018**（每天）。和右边演示在相同输入下的数字一致——因为它跑的是同一套数学。

### ④ 隐含波动率：二分法反解

定价是“已知 σ 求价格”；**隐含波动率是反过来**——已知市场价，求那个让模型价等于市场价的 σ（阶段 4.2）。BS 价格关于 σ **单调递增**，所以可以用最稳健的**二分法（bisection）**：在 [lo, hi] 区间里不断取中点，价格偏高就往低猜、偏低就往高猜，区间每次减半。

\`\`\`python
def implied_vol(price, S, K, T, r, kind="call", lo=1e-4, hi=5.0, tol=1e-6):
    intrinsic = max(S - K, 0.0) if kind == "call" else max(K - S, 0.0)
    if price <= intrinsic + 1e-8:     # 低于内在价值则无解
        return float("nan")
    for _ in range(100):
        mid = (lo + hi) / 2
        diff = bs_price(S, K, T, r, mid, kind) - price
        if abs(diff) < tol:
            return mid
        if diff > 0:                  # 模型价偏高 → 波动率猜大了
            hi = mid
        else:
            lo = mid
    return (lo + hi) / 2
\`\`\`

**逐块读**：先排除“市场价低于内在价值”（无意义、无解）；然后循环最多 100 次，每次用中点定价、比较、收窄区间。二分法不像牛顿法那样依赖导数，**永远收敛、永不发散**，特别适合教学与稳健生产。

> **闭环测试**：先 \`bs_price(100,105,0.25,0.04,0.30,"call")\` 算出一个价，再把这个价喂回 \`implied_vol(...)\`，应当**精确还原 0.30**。这种“正向定价 → 反向求 IV”的往返测试，是验证两个函数都对的好办法。

### ⑤ 画图：用 matplotlib

有了函数，画图就是几行。借助 numpy 的向量化，把一排股价一次性喂进去，再 \`plot\`。例如画一张**到期损益图**（买入看涨）或**Delta 随股价的曲线**：

\`\`\`python
import matplotlib.pyplot as plt

S = np.linspace(60, 140, 200)              # 一排股价
prem = bs_price(100, 100, 30/365, 0.04, 0.25, "call")   # 入场权利金
payoff = np.maximum(S - 100, 0) - prem     # 到期每股损益
delta_curve = norm.cdf(                      # 当前 Delta 随 S 变化
    (np.log(S/100) + (0.04 + 0.25**2/2)*(30/365)) / (0.25*np.sqrt(30/365)))

fig, ax = plt.subplots(1, 2, figsize=(10, 4))
ax[0].plot(S, payoff); ax[0].axhline(0, ls="--"); ax[0].set_title("Long Call P&L")
ax[1].plot(S, delta_curve); ax[1].set_title("Call Delta vs Spot")
plt.tight_layout(); plt.show()
\`\`\`

**这段画了什么**：左图是经典的**钩形损益**（地板在 −权利金，过行权价后 45 度上扬，回扣 1.1）；右图是 Delta 从 0 平滑爬到 1 的 **S 形曲线**（阶段 5.2）。\`np.linspace\` 生成 200 个股价点、向量化函数一次算完整条线、\`plot\` 描出来——这正是右边演示在浏览器里做的事，只是它用 JS 实时重画。

把五块连起来：**导入两个库 → 几行写出定价 → 几行写出希腊字母 → 二分法反解 IV → matplotlib 画曲线**。这套不到一百行的代码，就是你后面回测（阶段 11.4）和 AI 工作流（阶段 11.5）的地基。做市商、量化每天用的，本质就是它的工业级放大版——但骨架，你现在已经能自己敲出来了。
`,

  demo: "python-greeks",

  analogy: `
把公式写成代码，就像**把一张乐谱变成会响的钢琴**。

- **Black-Scholes 公式**（阶段 4.1）是**乐谱**：写得很美，但纸上不发声。
- **\`numpy\` + \`scipy.stats.norm\`** 是**琴键与音锤**：N(·) 这两个“音”由 \`norm.cdf\`、\`norm.pdf\` 现成提供，你不必从头造。
- **\`bs_price\` / \`greeks\` 函数** 是把乐谱**录进钢琴**：一旦录好，任何时候按下（传入 S、K、T、r、σ）都能立刻奏出对应的价格与希腊字母。
- **二分法求 IV** 是**调音**：反过来，听到市场奏出的那个音（市场价），一点点拧弦（收窄区间）直到模型的音和它对上，那根弦的松紧就是隐含波动率。
- **matplotlib 画图** 是把整首曲子**画成声波图**：把一排股价弹一遍，损益的钩形、Delta 的 S 形就显形了。

会读乐谱（懂公式）是一回事，能让琴响起来、还能为它调音（写出可运行、可反解的代码）是另一回事——后者才是量化的真功夫。
`,

  misconceptions: [
    "**“Black-Scholes 公式太难，写成代码一定很长。”** —— 不长。借助 \`scipy.stats.norm\` 提供的 N(·)，核心定价 + 希腊字母 + 反解 IV 加起来**不到 40 行**。难的是理解公式，而那你已经在阶段 4.1、5.1 学过了。",
    "**“代码能跑出数就说明对了。”** —— 不一定。务必用**已知基准对数**：S=K=100、T=1、r=5%、σ=20% 的看涨必须得 ≈ **10.45**。‘能跑’≠‘算对’，AI 帮你写的代码尤其要先过这关（阶段 11.5）。",
    "**“求隐含波动率得用牛顿法这种高级算法。”** —— 不必。BS 价格关于 σ 单调，用最朴素的**二分法**就**永远收敛、永不发散**，稳健且够快。先 lo=1e-4、hi=5 框住，再不断取中点收窄即可。",
    "**“Theta 算出来直接用就行。”** —— 注意单位。教科书公式给的是**年化** Theta，交易口径要**除以 365**（每过一天）；同理 vega 除以 100（每 +1%）、rho 除以 100。不缩放，你看到的数会和券商仪表盘对不上（阶段 5.1）。",
    "**“画希腊字母曲线要写循环，一点点算。”** —— 用 numpy **向量化**：\`np.linspace\` 造一排股价，直接整排传进函数，一次返回整条曲线再 \`plot\`，比 for 循环快也更简洁。这正是 numpy 存在的意义。",
  ],

  quiz: [
    {
      q: "你写好了 \`bs_price(S,K,T,r,sigma)\`。用哪组输入做**验收对数**、且正确结果约为多少，最能确认实现无误？",
      options: [
        "bs_price(100,100,1,0.05,0.20) ≈ 10.45",
        "bs_price(100,100,1,0.05,0.20) ≈ 5.00",
        "bs_price(50,100,0.1,0,0) ≈ 50",
        "随便一组输入，只要不报错就行",
      ],
      answer: 0,
      explain: "经典基准 S=K=100、T=1、r=5%、σ=20% 的看涨应得 ≈ **10.45**。用已知答案对数是验证定价函数（含 AI 生成的）正确性的标准做法——能跑不等于算对（阶段 11.5）。",
    },
    {
      q: "在 Black-Scholes 的 Python 实现里，公式中的两个 N(·)（标准正态累积分布）通常用什么提供？",
      options: ["np.mean", "scipy.stats.norm.cdf", "np.exp", "自己手写一个排序函数"],
      answer: 1,
      explain: "标准正态累积分布 N(·) 用 **\`scipy.stats.norm.cdf\`**，密度 N'(·) 用 \`norm.pdf\`。它们支持向量化，正好对应 BS 公式里的 N(d1)、N(d2)。",
    },
    {
      q: "用**二分法**反解隐含波动率时，为什么这个方法在 BS 上特别稳健？",
      options: [
        "因为 BS 价格关于 σ 单调递增，区间每次减半必然收敛",
        "因为二分法比牛顿法计算量更大",
        "因为它需要知道价格对 σ 的导数",
        "因为隐含波动率总是等于 0.20",
      ],
      answer: 0,
      explain: "BS 价格关于波动率 **单调递增**，所以在 [lo,hi] 里不断取中点、按价格高低收窄，**必然收敛**。二分法不依赖导数，永不发散，比牛顿法更稳健（虽然慢一点）。",
    },
    {
      q: "你要用 matplotlib 画“看涨 Delta 随股价变化”的曲线，最 Pythonic、最高效的做法是？",
      options: [
        "写一个 for 循环逐个股价算 Delta 再 append",
        "用 np.linspace 造一排股价、向量化整排传入函数，一次得到整条曲线再 plot",
        "只算一个股价点然后连成直线",
        "无法用 matplotlib 画希腊字母",
      ],
      answer: 1,
      explain: "借助 numpy **向量化**：\`np.linspace\` 生成一排股价，直接整排喂进用 \`norm.cdf\` 写的函数，一次返回整条曲线，再 \`plot\`。比 for 循环更快也更简洁——这是 numpy 的核心用法。",
    },
  ],

  further: [
    { label: "SciPy 文档：scipy.stats.norm（正态分布的 cdf/pdf）", url: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.norm.html" },
    { label: "Matplotlib：Pyplot 入门教程", url: "https://matplotlib.org/stable/tutorials/pyplot.html" },
    { label: "QuantPy：Black-Scholes in Python（含希腊字母与画图）", url: "https://quantpy.com.au/black-scholes-model/" },
  ],
};
