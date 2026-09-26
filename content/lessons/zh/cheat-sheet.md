---
id: cheat-sheet
prereqs: black-scholes, greeks-map, strategy-matrix, funding-rate, position-sizing, capstone
demo: cheat-sheet
short: true
---

# 附录：公式与数字速查表

## @hook
这门课的所有公式，几页纸就放得下；而每一个公式，最初都是一张图和一个数字。这份附录把它们重新摆在一起：按四个观念分组，每条都配上 XYZ 的例子，并链接回它诞生的那一课。下次打开期权链时，把它放在旁边。

## @bridge
这是课程的最后一页。[[capstone]] 几乎一次用上了所有工具；这里把这些工具放进同一个抽屉。下面没有新东西——每一行都指回曾用故事、图和演示讲清楚它的那一课，从 [[call-option]]、[[put-call-parity]] 到 [[black-scholes]]、[[greeks-map]]、[[implied-vol]]、[[funding-rate]] 和 [[position-sizing]]。它服务全部四个观念：① 形状，② 无套利，③ 波动率，④ 风险。

## @intuition
速查表只有在你知道该开哪个抽屉时才有用。课程的四个观念，就是这四个抽屉：

<figure>
<svg viewBox="0 0 660 220" role="img" aria-label="把四个观念看作四个装公式的抽屉">
<rect x="14" y="20" width="148" height="150" rx="10" class="fx-hl"/>
<rect x="176" y="20" width="148" height="150" rx="10" class="fx-box"/>
<rect x="338" y="20" width="148" height="150" rx="10" class="fx-blue"/>
<rect x="500" y="20" width="148" height="150" rx="10" class="fx-bad"/>
<text x="88" y="44" text-anchor="middle" class="fx-t-b">① 形状</text>
<text x="88" y="70" text-anchor="middle" class="fx-t-sm">损益、盈亏平衡</text>
<text x="88" y="90" text-anchor="middle" class="fx-t-sm">价差、跨式</text>
<text x="88" y="110" text-anchor="middle" class="fx-t-sm">铁鹰、蝶式</text>
<text x="88" y="130" text-anchor="middle" class="fx-t-sm">永续与期权的线</text>
<text x="88" y="156" text-anchor="middle" class="fx-t-hl">“我能得到什么？”</text>
<text x="250" y="44" text-anchor="middle" class="fx-t-b">② 无套利</text>
<text x="250" y="70" text-anchor="middle" class="fx-t-sm">价格边界、远期</text>
<text x="250" y="90" text-anchor="middle" class="fx-t-sm">平价关系、箱式</text>
<text x="250" y="110" text-anchor="middle" class="fx-t-sm">二叉树、BS 公式</text>
<text x="250" y="130" text-anchor="middle" class="fx-t-sm">期货公平价</text>
<text x="250" y="156" text-anchor="middle" class="fx-t">“它必须值多少？”</text>
<text x="412" y="44" text-anchor="middle" class="fx-t-b">③ 波动率</text>
<text x="412" y="70" text-anchor="middle" class="fx-t-sm">1σ 波幅、16 法则</text>
<text x="412" y="90" text-anchor="middle" class="fx-t-sm">隐含波幅、事件波动率</text>
<text x="412" y="110" text-anchor="middle" class="fx-t-sm">远期波动率、偏斜</text>
<text x="412" y="130" text-anchor="middle" class="fx-t-sm">IV 对 RV、VRP</text>
<text x="412" y="156" text-anchor="middle" class="fx-t-blue">“它会动多少？”</text>
<text x="574" y="44" text-anchor="middle" class="fx-t-b">④ 风险</text>
<text x="574" y="70" text-anchor="middle" class="fx-t-sm">希腊字母、泰勒盈亏</text>
<text x="574" y="90" text-anchor="middle" class="fx-t-sm">压力网格、仓位</text>
<text x="574" y="110" text-anchor="middle" class="fx-t-sm">凯利、期望值</text>
<text x="574" y="130" text-anchor="middle" class="fx-t-sm">强平、资金费</text>
<text x="574" y="156" text-anchor="middle" class="fx-t-bad">“什么会伤到我？”</text>
<text x="330" y="204" text-anchor="middle" class="fx-t-sm">先想清楚你在问哪个问题，再打开对应的抽屉</text>
</svg>
<figcaption>图 1 · 四个观念就是四个抽屉。每个抽屉回答一个问题——我能得到什么、它必须值多少、它会动多少、什么会伤到我——下面每一部分回答其中的一两个。</figcaption>
</figure>

> [!KEY] 怎么用这一页
> 下面每个公式都配着课程的标准例子，你可以拿自己的计算去对一个已知答案。除非另有说明，输入都是 XYZ 的：\(S = 100\)，\(\sigma = 20\%\)，\(r = 4\%\)，不分红，30 天（\(T = 30/365\)），价格按每股计，每张合约 \(\times 100\)。可搜索、带小计算器的版本，就是本页最后的演示。

> [!THINK] 先别往下看：描述 XYZ 30 天平值看涨期权的三个数字是什么？
> 价格、delta，以及一次典型波动有多大。
> ---
> 约 **2.45 美元**一股（一张 245 美元），delta 约 **0.53**，30 天一个标准差的波动约 **5.73 美元**。记住这三个，大部分其他数字都能重建：跨式约 \(0.8 \times 5.73 \approx 4.57\)，平值法则 \(0.4\,S\sigma\sqrt{T}\) 在不计利息时给出 2.29。

速查表分七部分：

- **① 损益与策略**
- **② 无套利：边界、远期、平价、二叉树**
- **③ Black-Scholes 与希腊字母**
- **④ 波动率**
- **⑤ 期货与永续**
- **⑥ 仓位与风险**
- **⑦ 需要记住的关键数字**

## @mechanics
### ① 损益与策略

每个策略都是若干块积木之和（[[payoff-lego]]）：

$$
\Pi(S_T) = \sum_i n_i\,\pi_i(S_T)
$$

其中 \(\pi_i\) 是一块积木（看涨、看跌、股票或现金）的到期盈亏，\(n_i\) 是持有的数量（卖出为负）。例：小凯的领口是 +100 股、−1 张 105 看涨、+1 张 95 看跌；\(S_T = 90\) 时每股得到 \(-10 + 0.71 + (5 - 0.51) = -4.80\)——正是地板。

| 结构 | 关键公式（每股） | XYZ 30 天例子 | 课程 |
|---|---|---|---|
| 买入看涨 | \(\max(S_T - K, 0) - c\)；盈亏平衡 \(K + c\) | 100 看涨 2.45，平衡点 102.45 | [[call-option]] |
| 买入看跌 | \(\max(K - S_T, 0) - p\)；盈亏平衡 \(K - p\) | 95 看跌 0.51，平衡点 94.49 | [[put-option]] |
| 备兑看涨 | 最大 \((K - S_0) + c\)；平衡 \(S_0 - c\) | 105 看涨：最大 5.71，平衡 99.29 | [[covered-call]] |
| 保护性看跌 | 地板 \(K - S_0 - p\) | 95 看跌：地板 −5.51 | [[protective-put-collar]] |
| 领口 | 地板和天花板按净收入平移 | 净收 0.20：−4.80 / +5.20 | [[protective-put-collar]] |
| 牛市看涨价差 | 最大 \((K_2 - K_1) - D\)；平衡 \(K_1 + D\) | 100/105：D 1.74，最大 3.26，平衡 101.74 | [[vertical-spreads]] |
| 跨式 | 平衡点 \(K \pm (c + p)\) | 4.57：平衡 95.43 / 104.57 | [[straddle-strangle]] |
| 铁鹰 | 最大亏损 = 宽度 − 净收入 | 90/95/105/110：净收 1.02，最大亏 3.98 | [[iron-condor]] |
| 看涨蝶式 | \(C(K_1) - 2C(K_2) + C(K_3)\) | 95/100/105：1.63，在 100 最多赚 3.37 | [[butterfly]] |
| 收入年化 | \((1 + R)^{365/d} - 1\) | 30 天在 100 上收 0.71 → 8.99% | [[breakeven-returns]] |

### ② 无套利：边界、远期、平价、二叉树

必须烂熟于心的一条是看跌看涨平价（[[put-call-parity]]）：

$$
C - P = S\,e^{-qT} - K\,e^{-rT}
$$

其中 \(C\)、\(P\) 是同一行权价 \(K\)、同一到期 \(T\) 的欧式看涨和看跌，\(q\) 是股息率，\(r\) 是无风险利率。XYZ 30 天、\(K = 100\)：\(2.45 - 2.12 = 0.33 = 100 - 99.67\)。1 年：\(9.93 - 6.00 = 3.93 \approx 100 - 96.08\)。

| 规则 | 公式 | XYZ 例子 | 课程 |
|---|---|---|---|
| 看涨价格边界 | \(\max(Se^{-qT} - Ke^{-rT}, 0) \le C \le Se^{-qT}\) | \(0.33 \le 2.45 \le 100\) | [[arbitrage-bounds]] |
| 蝶式 ≥ 0 | \(C(K_1) - 2C(K_2) + C(K_3) \ge 0\) | 1.63 ≥ 0 | [[arbitrage-bounds]] |
| 远期价 | \(F = S\,e^{(r - q)T}\) | 100.33（30 天），104.08（1 年） | [[forwards-carry]] |
| 箱式价差 | \((K_2 - K_1)\,e^{-rT}\) | 宽 5、30 天：4.98 | [[synthetics-boxes]] |
| 一步对冲比率 | \(\Delta = \dfrac{V_u - V_d}{S_u - S_d}\) | 100 → 120 / 80，K 100：0.5 | [[binomial-one-step]] |
| 风险中性概率 | \(q = \dfrac{e^{r\Delta t} - d}{u - d}\) | 同一棵树、\(r = 0\)：0.5，价格 10.00 | [[binomial-one-step]] |
| CRR 二叉树 | \(u = e^{\sigma\sqrt{\Delta t}},\ d = 1/u\) | 收敛到 9.93（1 年） | [[binomial-trees]] |
| 定价规则 | \(V_0 = e^{-rT}\,\E^{\Q}[V_T]\) | 漂移 \(\mu\) 从不出现 | [[risk-neutral]] |

### ③ Black-Scholes 与希腊字母

$$
C = S\,\N(d_1) - K e^{-rT}\,\N(d_2), \qquad P = K e^{-rT}\,\N(-d_2) - S\,\N(-d_1)
$$

$$
d_1 = \frac{\ln(S/K) + \left(r + \tfrac12\sigma^2\right)T}{\sigma\sqrt{T}}, \qquad d_2 = d_1 - \sigma\sqrt{T}
$$

其中 \(\N(\cdot)\) 是标准正态分布的累积概率；\(\N(d_2)\) 是风险中性下到期实值的概率，\(\N(d_1)\) 是看涨期权的 delta（[[black-scholes]]）。XYZ 1 年平值：\(d_1 = 0.30\)，\(d_2 = 0.10\)，\(C = 61.79 - 51.87 = 9.93\)，\(P = 6.00\)。教科书核对（\(r = 5\%\)）：10.45 和 5.57。

| 希腊字母 | 公式（看涨，\(q = 0\)） | XYZ 30 天 100 看涨 | 课程 |
|---|---|---|---|
| Delta | \(\Delta = \N(d_1)\)（看跌 \(\N(d_1) - 1\)） | 0.534 | [[delta]] |
| Gamma | \(\Gamma = \dfrac{\varphi(d_1)}{S\sigma\sqrt{T}}\) | 0.069（1 天：0.381） | [[gamma]] |
| Theta | \(\Theta = -\dfrac{S\varphi(d_1)\sigma}{2\sqrt{T}} - rKe^{-rT}\N(d_2)\)，按年 | 每天 −0.044 | [[theta]] |
| Vega | \(\nu = S\varphi(d_1)\sqrt{T}\) | 每个波动率点 0.114 | [[vega]] |
| Rho | \(\rho = KTe^{-rT}\N(d_2)\) | 每 1% 为 0.042（1 年：0.519） | [[rho-carry]] |
| 泰勒盈亏 | \(\dd V \approx \Delta\,\dd S + \tfrac12\Gamma\,\dd S^2 + \Theta\,\dd t + \nu\,\dd\sigma\) | 解释大部分日内盈亏 | [[greeks-map]] |
| Gamma 与 Theta | \(\Theta \approx -\tfrac12\Gamma S^2\sigma^2\)（\(r = 0\)） | 盈亏平衡的日波动约 1.05 美元 | [[theta]] |
| 对冲后的盈亏 | \(\tfrac12\Gamma S^2(\RV^2 - \IV^2)\,\dd t\) | 实际 25% 对隐含 20%：每天 +0.021 | [[delta-hedging]] |
| 平值法则 | \(C \approx 0.4\,S\sigma\sqrt{T}\) | 2.29（计利息后 2.45） | [[black-scholes]] |
| 弹性 | \(\Omega = \Delta\,S / V\) | \(0.534 \times 100 / 2.45 \approx 21.8\) | [[long-options]] |
| Vanna、Volga | \(-\varphi(d_1)\,d_2/\sigma\)，\(\ \nu\,d_1 d_2/\sigma\) | 二阶的价格—波动率风险 | [[higher-order-greeks]] |

### ④ 波动率

$$
\sigma_{\text{远期}}^2 = \frac{\sigma_2^2\,T_2 - \sigma_1^2\,T_1}{T_2 - T_1}
$$

其中 \(\sigma_1\)、\(\sigma_2\) 是两个到期日 \(T_1 < T_2\) 的隐含波动率，\(\sigma_{\text{远期}}\) 是市场隐含的、两个到期日**之间**的波动率（[[term-structure]]）。例：30 天 20%、60 天 22%，意味着第 30–60 天约为 \(\sqrt{(0.22^2 \times 60 - 0.20^2 \times 30)/30} \approx 23.8\%\)。同样的减法也能拆出一个财报日：在 [[capstone]] 里，30 天 25% 减去平日 20%，剩下一天约 4.4% 的事件波动。

| 量 | 公式 | XYZ 例子 | 课程 |
|---|---|---|---|
| 历史波动率 | \(\hat\sigma = \sqrt{\tfrac{252}{n-1}\sum (r_i - \bar r)^2}\) | 由日对数收益年化 | [[realized-vol]] |
| 1σ 波幅 | \(S\sigma\sqrt{T}\) | 30 天：5.73 美元 | [[random-walk]] |
| 日 1σ | \(\sigma/\sqrt{365}\) 或 \(\sigma/\sqrt{252}\) | 1.05 美元（日历日），1.26%（交易日） | [[random-walk]] |
| 16 法则 | 日波动 ≈ 波动率 ÷ 16 | VIX 16 → 每天约 1% | [[vix]] |
| 跨式 | \(\approx 0.8\,S\sigma\sqrt{T}\) | 4.57；隐含波幅 ≈ 跨式 ÷ S | [[implied-vol]] |
| 求 IV 的牛顿迭代 | \(\sigma_{n+1} = \sigma_n - \dfrac{C(\sigma_n) - C_{\text{市场}}}{\nu(\sigma_n)}\) | 2–4 步收敛 | [[implied-vol]] |
| 偏斜指标 | \(RR_{25} = \sigma_{25C} - \sigma_{25P}\)，\(BF_{25} = \tfrac12(\sigma_{25C} + \sigma_{25P}) - \sigma_{\text{平值}}\) | RR 为负 = 股票式偏斜 | [[smile-skew]] |
| 价格里的密度 | \(f_{\Q}(K) = e^{rT}\,\dfrac{\partial^2 C}{\partial K^2}\) | 蝶式 ≈ 一个概率 | [[risk-neutral-density]] |
| 方差风险溢价 | \(\IV^2 - \E[\RV^2]\) | 指数历史：平均约 3–4 个波动率点 | [[variance-risk-premium]] |
| BTC 日波动 | DVOL ÷ \(\sqrt{365}\) ≈ DVOL ÷ 19 | 50% → 每天约 2.6% | [[crypto-options]] |

### ⑤ 期货与永续

$$
P_{\text{强平}} \approx P_0\left(1 - \frac{1}{L} + m\right)
$$

其中 \(P_0\) 是逐仓永续多头的开仓价，\(L\) 是杠杆倍数，\(m\) 是维持保证金率（[[margin-liquidation]]）。示意：BTC 100,000 美元、10 倍、0.5%：\(100{,}000 \times (1 - 0.1 + 0.005) = \$90{,}500\)——回撤 9.5% 就结束了这笔交易。

| 量 | 公式 | 例子 | 课程 |
|---|---|---|---|
| 期货公平价 | \(F = S\,e^{(r - q)T}\) | XYZ 30 天：100.33 | [[futures-basis]] |
| 年化基差 | \(\tfrac{1}{T}\ln(F/S)\) | 4.0% | [[futures-basis]] |
| 线性盈亏 | \((P_1 - P_0) \times Q\) | 0.1 BTC 涨 10,000 → +1,000 美元 | [[what-is-perp]] |
| 反向合约盈亏（币本位） | \(N\left(\tfrac{1}{P_0} - \tfrac{1}{P_1}\right)\) | 名义 100,000 美元，10 万 → 11 万：+0.0909 BTC | [[what-is-perp]] |
| 资金费率 | \(F = P + \operatorname{clamp}(I - P, -0.05\%, +0.05\%)\) | 基准 \(I\) = 每 8 小时 0.01% | [[funding-rate]] |
| 资金费年化 | 每期费率 × 每天期数 × 365 | \(0.01\% \times 3 \times 365 = 10.95\%\) | [[funding-rate]] |
| 反向看涨 | 以币计 \(\max(S_T - K, 0)/S_T\) | 币本位结算的收益 | [[crypto-options]] |

### ⑥ 仓位与风险

$$
f^* = p - \frac{1 - p}{b}
$$

其中 \(f^*\) 是凯利比例：对一个以概率 \(p\) 赢得本金 \(b\) 倍、否则输掉本金的赌注，应投入资金的比例（[[position-sizing]]）。例：\(p = 0.55\)，\(b = 1\)，得 \(f^* = 0.55 - 0.45 = 10\%\)；大多数从业者只用它的一部分，而期权的收益分布也很少这么简单。

| 量 | 公式 | 例子 | 课程 |
|---|---|---|---|
| 按压力定张数 | \(n = \lfloor \text{预算} / \text{压力亏损} \rfloor\) | 400 / 185 → 2 | [[capstone]] |
| 期望值 | \(E = p\,\bar W - (1 - p)\,\bar L\) | \(0.4 \times 300 - 0.6 \times 150 = 30\) | [[trading-psychology]] |
| 回撤后回本所需涨幅 | \(\dfrac{1}{1 - d} - 1\) | −50% 需要 +100% | [[position-sizing]] |
| Delta-Gamma 盈亏 | \(\Delta\Pi \approx \Delta\,\dd S + \tfrac12\Gamma\,\dd S^2\) | 情景网格更进一步 | [[portfolio-risk]] |
| 美元 Delta | 每张 \(\Delta \times S \times 100\) | 0.534 → 5,340 美元的 XYZ | [[delta]] |
| 价差成本 | \((\text{卖价} - \text{买价}) / \text{中间价}\) | 2.43/2.47 → 1.6% | [[liquidity-spreads]] |
| 看涨提前行权 | \(D > P + K(1 - e^{-r\tau})\) | 股息 0.50 对 0.035 | [[common-traps]] |
| 蒙特卡洛误差 | \(s / \sqrt{N}\) | 路径翻 4 倍，误差减半 | [[monte-carlo]] |

### ⑦ 需要记住的关键数字

| 数字 | 数值 | 出处 |
|---|---|---|
| 合约乘数 | ×100（报价 2.45 = 245 美元） | [[contract-specs]] |
| XYZ 30 天 100 看涨 / 看跌 | 2.45 / 2.12 | [[black-scholes]] |
| XYZ 30 天 105 看涨 / 95 看跌 | 0.71 / 0.51（领口净收 0.20） | [[protective-put-collar]] |
| XYZ 1 年 100 看涨 / 看跌 | 9.93 / 6.00 | [[black-scholes]] |
| 教科书核对（r 5%） | 10.45 / 5.57 | [[black-scholes]] |
| 30 天远期 / 100 的 1 年现值 | 100.33 / 96.08 | [[forwards-carry]] |
| 30 天 1σ 波幅 / 跨式 | 5.73 美元 / 4.57 美元 | [[implied-vol]] |
| 平值 Theta：30、7、1 天 | 每天 −0.044 / −0.084 / −0.214 | [[theta]] |
| 平值 Gamma：30 天对 1 天 | 0.069 对 0.381 | [[gamma]] |
| 10 倍 BTC 永续强平价 | 约 90,500 美元（示意） | [[margin-liquidation]] |
| 自动行权门槛 | 实值 0.01 美元；美东下午 5:30 前可改指示 | [[exercise-assignment]] |

> [!FACT] 会变的数字（截至 2026 年 9 月）
> 课程里的规则和市场事实都有日期。按这里用到的最新数据：OCC 对实值 0.01 美元及以上的股票期权自动行权；美国股票 T+1 交收；2026 年 7 月 0DTE 期权约占 SPX 成交量的三分之二（66.2%）；从 1990 年到 2024 年前后，VIX 平均约 19.6，而标普 500 随后的实际波动率平均约 15.5，差约 4 个波动率点（CFA Institute 博客分析，2024 年 7 月）。依赖其中任何一个之前，先查一下出处。

> [!KAI] 这条路把小凯带到了哪里
> 小凯在 [[welcome]] 里出场时，手里有 100 股 XYZ 和三个愿望。现在每个愿望背后都有一个数字、一节课。**保护：**以 0.51 美元买入 95 看跌，或者做一个净收 0.20 美元的领口（[[protective-put-collar]]）。**赚收入：**以 0.71 美元卖出 105 备兑看涨，按成交前写好的规则管理（[[first-trade]]）。**押一次大波动、亏损有上限：**两张 100/105 看涨价差，仓位定到最坏压力亏损不超过 400 美元（[[capstone]]）。这一页的公式，是小凯检查每一笔交易的工具；而选哪个愿望、做多大、什么时候干脆什么都不做——那才是整门课真正要教的。

## @analogy
速查表就是飞行员夹在驾驶盘上的那张塑封卡片。它不是训练本身——飞行员花了好几年去弄懂每个数字为什么是那个数——也没有人会只拿着卡片去开飞机。但在繁忙的进近过程中，也没有人想现场重新推导失速速度。这张卡片是给这种时刻用的：你已经理解整个系统，只需要一个又快又准的数字。

这份速查表也一样。每一行都是一节压缩过的课；如果某一行看起来像天书，旁边的链接会把你带回那张让它一目了然的图。类比不成立的地方在于：飞机的数字由物理决定、由权威机构认证；期权的数字取决于你必须自己选择的输入——尤其是波动率——而且这一页上的某些事实，一年之内就会过时。用卡片来检查你的计算，永远不要用它代替背后的思考。

## @misconceptions
- **“会背公式，就懂期权了。”**——这里的每个公式都有前提（波动率不变、没有跳跃、给定的利率）。知道什么时候公式是错误的工具——微笑、跳空、事件——比记住它更重要。
- **“\(\N(d_2)\) 就是我赚钱的概率。”**——它是风险中性下到期实值的概率。赚钱还要收回权利金，而真实世界的概率取决于真实的漂移。
- **“报价 2.45，就是这张期权 2.45 美元。”**——美国股票期权一张对应 100 股：245 美元。漏掉 ×100，每个盈亏和仓位计算都会差 100 倍。
- **“隐含波动率高于历史波动率，说明期权定价过高。”**——要同类比同类。事件、方差风险溢价和期限都要放进比较里。
- **“资金费年化是一个能锁定的收益率。”**——它只是把一期的费率乘上去。资金费每期都在变，还可能变号。

## @takeaways
- 四个观念是四个抽屉：损益（形状）、平价与定价（无套利）、波幅（波动率）、希腊字母与压力与仓位（风险）。
- 看跌看涨平价、带 \(d_1, d_2\) 的 Black-Scholes、盈亏的泰勒展开，是最值得烂熟于心的三个公式。
- 三个 XYZ 数字能重建大多数其他数字：30 天平值看涨 2.45、它的 delta 0.53、30 天 1σ 波幅 5.73 美元。
- 每个公式背后都有前提；旁边的链接告诉你它在哪里诞生，又在哪里失效。

## @quiz
1. 由看跌看涨平价，XYZ 30 天 100 看涨 2.45，\(Ke^{-rT} = 99.67\)。100 看跌必须值多少？
   - [ ] 2.45
   - [x] 约 2.12
   - [ ] 约 2.78
   - [ ] 0.33
   > \(P = C - S + Ke^{-rT} = 2.45 - 100 + 99.67 = 2.12\)。0.33 是 \(C - P\) 本身。
2. XYZ 现价 100，隐含波动率 20%。30 天平值跨式大约多少钱？
   - [ ] 2.45 美元——和看涨一样
   - [ ] 5.73 美元——一个标准差
   - [ ] 11.46 美元——两个标准差
   - [x] 约 4.57 美元——1σ 波幅 5.73 美元的 0.8 倍
   > 跨式为期望的**绝对**变动定价，约为 \(0.8 \times S\sigma\sqrt{T} = 0.8 \times 5.73 \approx 4.57\)。
3. 在 100,000 美元开 10 倍永续多头，维持保证金率 0.5%，大约在哪里被强平？
   - [ ] 99,500 美元
   - [ ] 95,000 美元
   - [x] 90,500 美元
   - [ ] 90,000 美元
   > \(P_{\text{强平}} \approx 100{,}000 \times (1 - 1/10 + 0.005) = 90{,}500\)。维持保证金把它从天真的 90,000 美元往上推了一点。
4. 30 天隐含波动率 20%，60 天 22%。市场隐含的第 30–60 天波动率是多少？
   - [ ] 21%——取平均
   - [ ] 22%——取较长的那个
   - [x] 约 23.8%——相减的是总方差，不是波动率
   - [ ] 2%——取差
   > \(\sigma_{\text{远期}} = \sqrt{(0.22^2 \times 60 - 0.20^2 \times 30)/30} \approx 23.8\%\)。方差随时间可加，波动率不行。
5. 一个赌注以 0.55 的概率赢得本金的 1 倍，否则输掉本金。完整凯利比例是多少？
   - [x] 10%
   - [ ] 55%
   - [ ] 45%
   - [ ] 5%
   > \(f^* = p - (1 - p)/b = 0.55 - 0.45 = 0.10\)。从业者通常只投入完整凯利的一部分，因为对 \(p\) 的估计有噪声。

## @further
- [Black–Scholes model（维基百科）](https://en.wikipedia.org/wiki/Black%E2%80%93Scholes_model) —— 公式、推导与希腊字母的一站式参考。
- [Put–call parity（维基百科）](https://en.wikipedia.org/wiki/Put%E2%80%93call_parity) —— 平价的证明，以及美式期权的不等式版本。
- [Cboe：VIX 编制方法](https://cdn.cboe.com/resources/vix/VIX_Methodology.pdf) —— 16 法则背后的官方方差带公式。
- [OCC：标准化期权的特征与风险](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) —— ×100 和行权数字背后的合约规则。
- [Satoshi Path（姊妹课程）](https://evidex-cloud.github.io/nextdawn-satoshi-path/) —— 永续与加密期权公式的比特币那一面。
