---
id: portfolio-risk
prereqs: greeks-map, higher-order-greeks, margin-approval, position-sizing, tail-hedging
demo: portfolio-risk
---

# 组合风险：情景矩阵、压力测试与保证金

## @hook
一本期权账里有股票、卖出的看涨、卖出的看跌，每一笔单独看都“有道理”。可股价跌 15%、波动率涨 10 个点时，整本账亏多少？只看 Delta 会告诉你大约 1,650 美元，真实答案接近两倍。这一课教你用情景矩阵和压力测试看清整本账，再看券商会按什么要保证金。

## @bridge
[[greeks-map]] 教了怎样用希腊字母拆解一张期权的风险，[[higher-order-greeks]] 引入了股价 × 波动率的二维视角；[[margin-approval]] 讲了保证金的基本规则；[[position-sizing]] 管的是每一笔押多少，[[tail-hedging]] 管的是一次最坏的情况。这一课把这些放进同一张表：**一本账**。它落在第 ④ 个观念（风险：希腊字母把风险拆成可度量的部分；谁持有风险、杠杆什么时候咬人，决定能不能活下来）上，也是 [[market-makers]] 那一课里做市商每天在看的东西。

## @intuition
小凯的账户里现在有三样东西（XYZ 现价 100，30 天期权，隐含波动率 20%）：

- 100 股 XYZ；
- 卖出 1 张 105 看涨（收 71 美元，备兑）；
- 卖出 2 张 95 看跌（每张收 51 美元，想“低价接货”）。

每一笔都是教过的策略：[[covered-call]] 和 [[cash-secured-put]]。可放在一起，这本账长什么样？

先把希腊字母加起来。股票的 Delta 是 100 股；卖出的 105 看涨贡献 \(-0.222 \times 100 = -22.2\) 股；两张卖出的 95 看跌各贡献 \(+0.163 \times 100\)，共 \(+32.7\) 股。**整本账的 Delta 约为 +110 股**——比单纯持有 100 股还多。

Gamma、Vega 也一样加起来：Gamma 约 −13.8 股 / 每 1 美元（卖出的期权都是空 Gamma），Vega 约 −22.7 美元 / 每个波动率点（波动率上升会亏），Theta 约 +7.4 美元 / 天（时间在帮小凯）。

> [!KAI] 小凯的直觉 vs 真实的数字
> 小凯心算：“Delta 110 股，XYZ 跌 15 美元，我亏 \(110 \times 15 \approx \$1{,}650\)。”
> 用 Black-Scholes 把每一笔按跌到 85 之后重新定价，整本账实际亏 **约 3,276 美元**——将近心算的两倍。差额来自那两张卖出的 95 看跌：股价跌破 95 后，它们的 Delta 迅速变大，亏损加速。

这就是只看 Delta 的盲点：Delta 是“现在”的斜率，而期权账的损益曲线是弯的。解决办法是直接把各种“如果”算出来——股价 −20%、−15%……+10%，波动率 −5、+10、+20 个点——排成一张**情景矩阵**（scenario grid）。

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="小凯收入账的情景矩阵">
<text x="365" y="24" text-anchor="middle" class="fx-t-b">股价瞬间变动</text>
<text x="154" y="50" text-anchor="middle" class="fx-t-sm">−20%</text>
<text x="224" y="50" text-anchor="middle" class="fx-t-sm">−15%</text>
<text x="294" y="50" text-anchor="middle" class="fx-t-sm">−10%</text>
<text x="364" y="50" text-anchor="middle" class="fx-t-sm">−5%</text>
<text x="434" y="50" text-anchor="middle" class="fx-t-sm">0</text>
<text x="504" y="50" text-anchor="middle" class="fx-t-sm">+5%</text>
<text x="574" y="50" text-anchor="middle" class="fx-t-sm">+10%</text>
<text x="112" y="81" text-anchor="end" class="fx-t-sm">波动率 −5 点</text>
<text x="112" y="115" text-anchor="end" class="fx-t-b">不变</text>
<text x="112" y="149" text-anchor="end" class="fx-t-sm">+10 点</text>
<text x="112" y="183" text-anchor="end" class="fx-t-sm">+20 点</text>
<rect x="120" y="60" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.74"/>
<text x="154" y="81" text-anchor="middle" class="fx-t">−4,765</text>
<rect x="190" y="60" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.56"/>
<text x="224" y="81" text-anchor="middle" class="fx-t">−3,266</text>
<rect x="260" y="60" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.37"/>
<text x="294" y="81" text-anchor="middle" class="fx-t">−1,811</text>
<rect x="330" y="60" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.23"/>
<text x="364" y="81" text-anchor="middle" class="fx-t">−624</text>
<rect x="400" y="60" width="68" height="32" rx="3" class="fx-fill-green" opacity="0.16"/>
<text x="434" y="81" text-anchor="middle" class="fx-t">+100</text>
<rect x="470" y="60" width="68" height="32" rx="3" class="fx-fill-green" opacity="0.21"/>
<text x="504" y="81" text-anchor="middle" class="fx-t">+473</text>
<rect x="540" y="60" width="68" height="32" rx="3" class="fx-fill-green" opacity="0.23"/>
<text x="574" y="81" text-anchor="middle" class="fx-t">+610</text>
<rect x="120" y="94" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.74"/>
<text x="154" y="115" text-anchor="middle" class="fx-t">−4,765</text>
<rect x="190" y="94" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.56"/>
<text x="224" y="115" text-anchor="middle" class="fx-t">−3,276</text>
<rect x="260" y="94" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.38"/>
<text x="294" y="115" text-anchor="middle" class="fx-t">−1,874</text>
<rect x="330" y="94" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.24"/>
<text x="364" y="115" text-anchor="middle" class="fx-t">−741</text>
<rect x="400" y="94" width="68" height="32" rx="3" class="fx-fill-green" opacity="0.15"/>
<text x="434" y="115" text-anchor="middle" class="fx-t">0</text>
<rect x="470" y="94" width="68" height="32" rx="3" class="fx-fill-green" opacity="0.20"/>
<text x="504" y="115" text-anchor="middle" class="fx-t">+399</text>
<rect x="540" y="94" width="68" height="32" rx="3" class="fx-fill-green" opacity="0.22"/>
<text x="574" y="115" text-anchor="middle" class="fx-t">+572</text>
<rect x="120" y="128" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.74"/>
<text x="154" y="149" text-anchor="middle" class="fx-t">−4,779</text>
<rect x="190" y="128" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.57"/>
<text x="224" y="149" text-anchor="middle" class="fx-t">−3,344</text>
<rect x="260" y="128" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.40"/>
<text x="294" y="149" text-anchor="middle" class="fx-t">−2,050</text>
<rect x="330" y="128" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.27"/>
<text x="364" y="149" text-anchor="middle" class="fx-t">−1,003</text>
<rect x="400" y="128" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.18"/>
<text x="434" y="149" text-anchor="middle" class="fx-t">−260</text>
<rect x="470" y="128" width="68" height="32" rx="3" class="fx-fill-green" opacity="0.17"/>
<text x="504" y="149" text-anchor="middle" class="fx-t">+200</text>
<rect x="540" y="128" width="68" height="32" rx="3" class="fx-fill-green" opacity="0.21"/>
<text x="574" y="149" text-anchor="middle" class="fx-t">+449</text>
<rect x="120" y="162" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.75"/>
<text x="154" y="183" text-anchor="middle" class="fx-t">−4,831</text>
<rect x="190" y="162" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.58"/>
<text x="224" y="183" text-anchor="middle" class="fx-t">−3,471</text>
<rect x="260" y="162" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.43"/>
<text x="294" y="183" text-anchor="middle" class="fx-t">−2,271</text>
<rect x="330" y="162" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.31"/>
<text x="364" y="183" text-anchor="middle" class="fx-t">−1,290</text>
<rect x="400" y="162" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.22"/>
<text x="434" y="183" text-anchor="middle" class="fx-t">−556</text>
<rect x="470" y="162" width="68" height="32" rx="3" class="fx-fill-red" opacity="0.16"/>
<text x="504" y="183" text-anchor="middle" class="fx-t">−53</text>
<rect x="540" y="162" width="68" height="32" rx="3" class="fx-fill-green" opacity="0.18"/>
<text x="574" y="183" text-anchor="middle" class="fx-t">+265</text>
<text x="120" y="218" class="fx-t-sm">单位：美元，整本账；期权按 Black-Scholes 立刻重新定价（期限仍为 30 天）</text>
<text x="120" y="236" class="fx-t-sm">左下角最深：股价大跌 + 波动率上升，是卖期权的账最怕的组合</text>
</svg>
<figcaption>图 1 · 小凯收入账的情景矩阵。横着看是股价，竖着看是波动率。颜色越深，损益越大。右上角（小涨、波动率下降）赚得不多；左下角（大跌、波动率上升）亏得很多——这种“赚小钱、亏大钱”的不对称，是卖期权组合的典型形状。</figcaption>
</figure>

一张矩阵回答了三个问题：**哪里赚、哪里亏、亏多少**。它不需要假设分布，也不需要假设线性，每个格子都是把整本账完整重算一遍。专业的风险报告几乎都以它为核心，再配上两样东西：**压力测试**（历史上或想象中的极端情景）和**保证金**（券商根据风险要你押多少钱）。

::demo[portfolio-risk-var]

这一课拆成六块：

- **① 把希腊字母加起来**：整本账的 Delta、Gamma、Vega、Theta
- **② 情景矩阵**：完整重估与 Delta-Gamma 近似
- **③ 为什么线性 VaR 对期权失灵**
- **④ 压力测试**：历史情景、假想情景与相关性
- **⑤ 保证金**：Reg T 与组合保证金
- **⑥ 集中度与流动性**：矩阵之外的风险

## @mechanics
### ① 把希腊字母加起来

同一个标的上的希腊字母可以直接相加（数量 × 每份的希腊字母 × 合约乘数）：

$$
\Delta_{\text{账}} = \sum_i n_i\,\Delta_i \times 100, \qquad \Gamma_{\text{账}} = \sum_i n_i\,\Gamma_i \times 100, \quad \ldots
$$

\(n_i\) 是第 \(i\) 笔的张数（买为正、卖为负；股票按“每 100 股算 1 份、Delta = 1”），\(\Delta_i\)、\(\Gamma_i\) 是每股的希腊字母。

| 仓位 | Delta（股） | Gamma（股/美元） | Vega（美元/点） | Theta（美元/天） |
|---|---|---|---|---|
| 100 股 XYZ | +100.0 | 0 | 0 | 0 |
| 卖 1 张 105 看涨 | −22.2 | −5.2 | −8.5 | +3.1 |
| 卖 2 张 95 看跌 | +32.7 | −8.6 | −14.1 | +4.3 |
| **合计** | **+110.5** | **−13.8** | **−22.7** | **+7.4** |

读法：Delta +110 意味着股价每涨 1 美元，账面约赚 110 美元；Gamma −13.8 意味着每涨 1 美元，Delta 少 13.8 股（涨得越多，越“不像股票”），每跌 1 美元，Delta 多 13.8 股（跌得越多，越“像股票”）。Vega −22.7：波动率每涨 1 点，亏约 23 美元。

> [!WARN] 不同标的的 Delta 不能直接相加
> 100 股 XYZ 的 Delta 和 100 股某只高波动股票的 Delta 看起来都是“100 股”，风险完全不同。跨标的汇总时，要先换成**美元 Delta**（\(\Delta \times S\)），再按各自的波动率（和彼此的相关性）换算成可比的风险；Vega 也要考虑不同期限的隐含波动率不会同步变动（[[vega]]）。

> [!DEEP] Beta 加权 Delta
> 很多交易软件会把各个标的的 Delta 换算成“相当于多少股标普 500 ETF”：\(\Delta_{\beta} = \Delta \times S \times \beta \,/\, S_{\text{指数}}\)，其中 \(\beta\) 是该股票相对大盘的敏感度。它方便回答“大盘跌 1% 我大约亏多少”，但 \(\beta\) 本身是用历史数据估出来的，在危机中常常变大——又是一个“平时好用、极端时失灵”的线性近似。

### ② 情景矩阵：完整重估与 Delta-Gamma 近似

情景矩阵的每一格是完整重估：

$$
\Delta\Pi(\Delta S, \Delta\sigma) = \sum_i n_i\,\big[V_i(S + \Delta S,\ \sigma + \Delta\sigma) - V_i(S, \sigma)\big] \times 100
$$

\(V_i\) 是第 \(i\) 笔用定价模型（这里是 Black-Scholes）算出的价值，\(\Delta S\)、\(\Delta\sigma\) 是假设的股价和波动率变动。需要快速估算时，可以用泰勒展开的前两项：

$$
\Delta\Pi \approx \Delta\,\dd S + \tfrac12\,\Gamma\,\dd S^2
$$

这里 \(\Delta\)、\(\Gamma\) 是 ① 里整本账的合计（单位分别是股、股 / 每 1 美元），\(\dd S\) 是股价变动的美元数，\(\Delta\Pi\) 是整本账的损益（美元）。第一项是直线，第二项让它弯下来。

> [!EXAMPLE] 三种方法算“XYZ 跌 15%”
> \(\dd S = -15\)，\(\Delta = 110.5\)，\(\Gamma = -13.8\)：
> - 只用 Delta：\(110.5 \times (-15) \approx -\$1{,}657\)
> - Delta-Gamma：\(-1{,}657 + \tfrac12 \times (-13.8) \times 15^2 \approx -1{,}657 - 1{,}552 = -\$3{,}209\)
> - 完整重估：\(-\$3{,}276\)
>
> 加上 Gamma 之后，误差从 1,600 多美元降到 70 美元左右。跌 25% 时 Delta-Gamma 也开始失准（它估 −7,073，完整重估是 −6,265），因为 Gamma 本身也在变。

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="线性估算、Delta-Gamma 与完整重估">
<line x1="60" y1="78.6" x2="610" y2="78.6" class="fx-line-muted"/>
<line x1="368.6" y1="30" x2="368.6" y2="215" class="fx-line-muted fx-dash"/>
<polyline points="60.0,135.4 75.4,132.5 90.9,129.7 106.3,126.9 121.7,124.0 137.1,121.2 152.6,118.3 168.0,115.5 183.4,112.7 198.9,109.8 214.3,107.0 229.7,104.1 245.1,101.3 260.6,98.5 276.0,95.6 291.4,92.8 306.9,89.9 322.3,87.1 337.7,84.3 353.1,81.4 368.6,78.6 384.0,75.7 399.4,72.9 414.9,70.0 430.3,67.2 445.7,64.4 461.1,61.5 476.6,58.7 492.0,55.8 507.4,53.0 522.9,50.2 538.3,47.3 553.7,44.5 569.1,41.6 584.6,38.8 600.0,36.0" class="fx-line-muted fx-dash"/>
<polyline points="60.0,206.3 75.4,196.6 90.9,187.2 106.3,178.1 121.7,169.4 137.1,161.1 152.6,153.1 168.0,145.5 183.4,138.2 198.9,131.3 214.3,124.7 229.7,118.5 245.1,112.6 260.6,107.1 276.0,102.0 291.4,97.2 306.9,92.8 322.3,88.7 337.7,85.0 353.1,81.6 368.6,78.6 384.0,75.9 399.4,73.6 414.9,71.6 430.3,70.0 445.7,68.8 461.1,67.9 476.6,67.4 492.0,67.2 507.4,67.4 522.9,67.9 538.3,68.8 553.7,70.0 569.1,71.6 584.6,73.6 600.0,75.9" class="fx-line-blue"/>
<polyline points="60.0,201.1 75.4,193.4 90.9,185.7 106.3,178.0 121.7,170.4 137.1,162.8 152.6,155.3 168.0,147.9 183.4,140.7 198.9,133.6 214.3,126.8 229.7,120.2 245.1,114.0 260.6,108.1 276.0,102.7 291.4,97.6 306.9,93.0 322.3,88.8 337.7,85.0 353.1,81.6 368.6,78.6 384.0,75.9 399.4,73.6 414.9,71.5 430.3,69.8 445.7,68.3 461.1,67.0 476.6,66.0 492.0,65.1 507.4,64.4 522.9,63.9 538.3,63.4 553.7,63.1 569.1,62.8 584.6,62.6 600.0,62.5" class="fx-line-thick"/>
<line x1="137.1" y1="121.2" x2="137.1" y2="162.8" class="fx-line-bad"/>
<circle cx="137.1" cy="121.2" r="4" class="fx-fill-muted"/>
<circle cx="137.1" cy="162.8" r="4" class="fx-fill-red"/>
<text x="129" y="110" text-anchor="end" class="fx-t-sm">只看 Delta：−1,657</text>
<text x="145" y="178" class="fx-t-bad">完整重估：−3,276</text>
<text x="470" y="30" class="fx-t-sm">虚线：只用 Delta（直线）</text>
<text x="470" y="100" class="fx-t-blue">Delta-Gamma（抛物线）</text>
<text x="470" y="118" class="fx-t-b">粗线：完整重估</text>
<text x="54" y="82" text-anchor="end" class="fx-t-sm">0</text>
<text x="54" y="133" text-anchor="end" class="fx-t-sm">−2k</text>
<text x="54" y="185" text-anchor="end" class="fx-t-sm">−4k</text>
<text x="60" y="232" text-anchor="middle" class="fx-t-sm">−20%</text>
<text x="214" y="232" text-anchor="middle" class="fx-t-sm">−10%</text>
<text x="368" y="232" text-anchor="middle" class="fx-t-sm">0</text>
<text x="523" y="232" text-anchor="middle" class="fx-t-sm">+10%</text>
<text x="610" y="248" text-anchor="end" class="fx-t-sm">XYZ 瞬间变动（整本账损益，美元）</text>
</svg>
<figcaption>图 2 · 同一本账的三种估算。直线（只用 Delta）在大跌时严重低估亏损，在大涨时又高估盈利；抛物线（Delta-Gamma）贴近得多；粗线是完整重估。空 Gamma 的账，真实曲线总是向下弯。</figcaption>
</figure>

矩阵里还有第二个方向：波动率。同一个 −15%，波动率不变亏 3,276 美元，波动率涨 20 点亏 3,471 美元。股价下跌和波动率上升常常同时发生（股指尤其如此），所以只看“股价轴”的风险报告会漏掉一部分——这正是 [[higher-order-greeks]] 里 Vanna（Delta 随波动率变化）起作用的地方。

还有第三个方向：**时间**。矩阵默认“立刻”发生；如果什么都不发生，Theta 每天替小凯赚约 7.4 美元。可时间只改善矩阵的中间，不改善尾部：

| 经过的天数 | 股价不动 | 股价 −5% | 股价 −15% |
|---|---|---|---|
| 今天 | 0 | −741 美元 | −3,276 美元 |
| 7 天后 | +53 美元 | −688 美元 | −3,284 美元 |
| 21 天后 | +152 美元 | −556 美元 | −3,308 美元 |

三周平安无事，小凯赚了 152 美元；可 −15% 那一格几乎没动。**收租型的账，时间攒下的利润远远填不上尾部的坑**——这和 [[variance-risk-premium]] 里“小赚多次、巨亏一次”是同一件事。

### ③ 为什么线性 VaR 对期权失灵

**风险价值**（Value at Risk，VaR）回答：“持有期 \(h\) 内，只有 1% 的情况会亏得比它更多的那个亏损额是多少？”（这是 99% 置信水平；95% VaR 就是只有 5% 的情况会超过的亏损。）最简单的算法是线性（Delta-正态）VaR：

$$
\text{VaR}_{\text{线性}} = z_{c}\;|\Delta|\;S\;\sigma\sqrt{h}
$$

\(z_c\) 是标准正态分布的分位数（99% 时约 2.33），\(|\Delta|\) 是整本账的 Delta（股），\(S\) 是股价，\(\sigma\) 是年化波动率，\(h\) 是以年计的持有期。

> [!EXAMPLE] 小凯的账，10 天、99%
> \(2.33 \times 110.5 \times 100 \times 0.2 \times \sqrt{10/365} \approx \$851\)。
> 用 4,000 次蒙特卡洛完整重估（只看价格变动，扣除 10 天的时间价值变化），99% VaR 约 **1,260 美元**——线性法低估了约三分之一。
> 更极端的是卖宽跨式（卖 105 看涨 + 卖 95 看跌）：它的 Delta 几乎为 0（−5.9 股），线性 VaR 只有约 45 美元，而完整重估约 **344 美元**，差了 7 倍多。

原因很简单：线性 VaR 假设损益是股价变动的直线函数，而期权账的损益是弯的。对空 Gamma 的账，它低估左尾；对多 Gamma 的账（例如买跨式），它反而高估风险——因为买方的亏损有上限。上面的内联演示可以比较三种算法。还有两个更根本的问题：VaR 只说“99% 的日子里最多亏多少”，**不说剩下 1% 的日子亏多少**；而且它通常基于正态分布，看不见肥尾（[[tail-hedging]]）。所以专业的风险管理把 VaR 当作日常指标，把情景矩阵和压力测试当作底线。

### ④ 压力测试：历史情景、假想情景与相关性

情景矩阵是“规则的网格”；压力测试挑几个**具体的极端情景**，问“如果那一天重来一次，我会怎样”：

| 情景 | 参考的历史事件 | 小凯的收入账（示意） |
|---|---|---|
| 暴跌日：−20%，波动率 +25 点 | 1987 年 10 月 19 日标普 500 单日 −20.5% | 约 −4,870 美元 |
| 恐慌：−5%，波动率 +20 点 | 2018 年 2 月 5 日 VIX 单日上涨 20.01 点 | 约 −1,290 美元 |
| 跳空上涨：+15%，波动率 +5 点 | 收购消息等个股事件 | 约 +600 美元 |

（把指数的历史事件套到一只假想的股票上只是示意；真实的压力测试会针对每个标的和整个市场分别设定。）

> [!THINK] 小凯又加了 5 个科技股的卖出看跌，每个都“只占账户的一小部分”。压力测试该怎样做，才能看到真正的风险？
> 先想一想：这 5 个仓位在什么情况下会同时出问题？
> ---
> 不能分别对每只股票做 −20%，再假设它们互不相关、把结果平均掉。要做**联合情景**：所有科技股一起跌 20%、隐含波动率一起上升。平时相关性也许只有 0.5，崩盘时往往接近 1（[[position-sizing]] 里的有效独立笔数会跌到 1 附近）。压力测试的意义，就在于替你假设“最坏的时候，一切一起坏”。

### ⑤ 保证金：Reg T 与组合保证金

券商要你押多少钱，有两套思路（详细规则见 [[margin-approval]]）：

**Reg T（按策略计算）。**买股票的初始保证金为 50%（美联储 T 规则）；买入的期权要全额付款；卖出的期权按公式计算。对无备兑的卖出股票期权，常用的交易所最低标准是：

$$
\text{要求} = \text{权利金} + \max\big(20\% \times S - \text{虚值金额},\ 10\% \times K\big)
$$

（看跌用 \(10\% \times K\)，看涨用 \(10\% \times S\)；以上都按每股算，再 \(\times\,100 \times \text{张数}\)；券商可以要求更多。）小凯的账：股票 \(50\% \times 10{,}000 = \$5{,}000\)；备兑看涨不额外要求；每张 95 看跌每股 \(0.51 + \max(20 - 5,\ 9.5) = 15.51\)，即 \(15.51 \times 100 = \$1{,}551\)，两张 3,102 美元。合计约 **8,100 美元**。

**组合保证金（portfolio margin，按风险计算）。**按 FINRA 4210(g) 规则，把整本账放进一组价格情景（标准做法通常是：个股和窄基指数约 ±15% 的价格区间，宽基指数区间更窄，约 −8% 到 +6%；券商可以要求更多，并加上自己的压力情景），取其中最坏的亏损作为要求。小凯的账在 ±15% 内最坏亏约 **3,276 美元**——比 Reg T 低一半以上。

> [!FACT] 组合保证金的门槛（截至 2026 年 9 月）
> 组合保证金由券商在 FINRA 规则框架内自行设定资格。例如嘉信（Schwab）要求至少 **125,000 美元**的初始权益并获批无备兑期权权限；常见券商的门槛大约在 10 万到 12.5 万美元以上。

再看卖宽跨式（卖 105 看涨 + 卖 95 看跌）：Reg T 按“两边中要求较高的一边 + 另一边的权利金”计算，约 1,622 美元；±15% 情景里最坏亏约 926 美元。

组合保证金更“合理”，对冲良好的账会省下大量保证金；但它也意味着**同样的钱可以放更大的仓位**。情景之外的跳空（比如 −25%），或者券商在市场动荡时临时调高情景幅度，都可能让保证金要求一夜之间翻倍——这就是 [[margin-liquidation]] 里强平机制在期权世界的对应物。

### ⑥ 集中度与流动性：矩阵之外的风险

情景矩阵假设你能按理论价随时平仓。现实中还有两类风险它看不见：

- **集中度**：一只股票、一个到期日、一个行权价上堆了太多仓位。单一公司的财报、并购、停牌可以让一只股票跳空 30%，这在指数上几乎不会发生。常见的做法是给单一标的、单一到期日设上限（占账户的百分比，或者 Vega、Gamma 的绝对值）。
- **流动性**：压力时刻买卖价差会成倍变宽，深度虚值期权可能根本没有对手。压力测试的损益应当加上“平仓成本”：例如假设以卖一价买回卖出的期权，而不是按中间价。一本账越大、越集中在冷门合约，这一项越重要（[[liquidity-spreads]]）。

把这一课的工具叠在一起，就是一份像样的风险报告：希腊字母汇总（每天）、情景矩阵（每天）、VaR（每天，知道它的局限）、压力测试（每周或行情变化时）、保证金与流动性检查（开新仓前）。

## @analogy
把一本期权账想成一栋**有很多房间的房子**，风险报告就是它的**结构检查**。

- 希腊字母汇总就像测量每面墙此刻的倾斜度：有用，但只说明“现在”；
- 线性 VaR 像是假设“风再大，墙也只会按现在的倾斜度成比例地歪”；
- 情景矩阵是把房子放进风洞，风速从小到大、从各个方向吹一遍，看每一种情况下哪里裂；
- 压力测试是专门模拟“百年一遇的台风 + 地震同时发生”；
- 保证金是银行看了检查报告后，要求你留在账户里的“维修基金”。

这个类比在一处会误导人：房子不会因为你做了检查而改变，可市场会——当很多人用同样的情景、同样的规则管理风险，他们会在同一个时刻被迫做同样的事（减仓、补保证金），让压力情景变得更容易发生。

## @misconceptions
- **“整本账的 Delta 接近 0，所以没什么风险。”** —— 卖宽跨式的 Delta 只有约 −6 股，可 10 天 99% 的完整重估 VaR 约 344 美元，是线性估算的 7 倍多。Delta 为 0 的账可能带着很大的 Gamma 和 Vega。
- **“VaR 告诉我最多会亏多少。”** —— 99% VaR 只说 99% 的情况下亏损不超过这个数，剩下 1% 可能亏得多得多；而且线性 VaR 对期权账往往低估左尾。
- **“每一笔都控制在账户的 2%，整本账就安全了。”** —— 如果这些仓位在同一种情景里一起亏（同方向、同行业、同为空波动率），它们其实是一笔大仓位。压力测试要做联合情景。
- **“组合保证金比 Reg T 低，说明风险更小。”** —— 组合保证金低，只说明在规定的情景范围内亏得少。它让你能用更少的钱放更大的仓位；情景之外的跳空，或券商调高情景幅度，都可能让要求突然跳升。
- **“情景矩阵里的亏损就是最坏情况。”** —— 矩阵假设能按理论价平仓。压力时刻价差变宽、流动性消失，真实的平仓亏损会更大。

## @takeaways
- 同一标的的希腊字母可以直接相加：小凯的收入账 Delta +110 股、Gamma −13.8、Vega −22.7 美元/点、Theta +7.4 美元/天。
- 期权账的损益是弯的：XYZ 跌 15% 时只看 Delta 估亏 1,657 美元，Delta-Gamma 估 3,209 美元，完整重估 3,276 美元。
- 情景矩阵（股价 × 波动率）把整本账完整重算，是风险报告的核心；线性 VaR 对空 Gamma 的账低估左尾，而且看不见最坏的那 1%。
- 压力测试要用联合情景：崩盘时相关性趋近 1，流动性消失，平仓成本也要算进去。
- Reg T 按策略公式要求保证金，组合保证金按风险情景（个股常见 ±15%）取最坏亏损，更省钱，也更容易放大杠杆。

## @quiz
1. 小凯的账：100 股 XYZ、卖 1 张 105 看涨（Δ 0.222）、卖 2 张 95 看跌（Δ −0.163）。整本账的 Delta 约为多少股？
   - [ ] 100 股
   - [ ] 45 股
   - [x] 110 股
   - [ ] 67 股
   > \(100 - 22.2 + 2 \times 16.3 \approx 110.5\)。卖出看跌的 Delta 是正的（\(-1 \times -0.163\)），所以它们让账户比单纯持股“更看多”。
2. 为什么只用 Delta 估算“XYZ 跌 15%”会严重低估小凯这本账的亏损？
   - [x] 这本账是空 Gamma 的：股价下跌时 Delta 变大，亏损加速，而线性估算假设斜率不变
   - [ ] 因为 Delta 只适用于看涨期权
   - [ ] 因为股价下跌时 Theta 会变成负数
   - [ ] 因为线性估算忽略了股息
   > 卖出的期权带来负 Gamma：跌破 95 后，卖出看跌的 Delta 迅速变大。线性估算 −1,657 美元，完整重估 −3,276 美元；加上 \(\tfrac12\Gamma\,\dd S^2\) 项后估到 −3,209 美元。
3. 一本卖宽跨式的账，Delta 约 −6 股。10 天、99% 的线性 VaR 约 45 美元。完整重估的 VaR 更可能是？
   - [ ] 约 45 美元，Delta 小说明风险小
   - [ ] 约 0 美元
   - [x] 约 340 美元，远大于线性估算
   - [ ] 约 20 美元，因为 Theta 在赚钱
   > 线性 VaR 只看 Delta，完全看不见卖宽跨式的负 Gamma。股价往任何方向大动都会亏，完整重估约 344 美元，是线性结果的 7 倍多。
4. 关于组合保证金，下面哪种说法最准确？
   - [ ] 它由 FINRA 统一规定最低 10 万美元的门槛
   - [ ] 它总是比 Reg T 要求更多的保证金
   - [ ] 它只看每一笔的最大亏损，不看对冲关系
   - [x] 它按一组风险情景取整本账的最坏亏损，对冲良好的账通常要求更低，但也更容易放大杠杆
   > 组合保证金按情景（个股常见 ±15%）计算，承认对冲关系，所以常常比 Reg T 低。门槛由券商设定（例如嘉信 125,000 美元）。低保证金意味着能放更大的仓位，情景之外的跳空风险依然存在。
5. 你要为 5 个不同科技股的卖出看跌仓位做压力测试。最合理的做法是？
   - [ ] 对每只股票分别做 −20%，然后取平均
   - [x] 做联合情景：所有科技股同时下跌、隐含波动率同时上升，并计入平仓成本
   - [ ] 只用过去一年的 VaR，因为它包含了相关性
   - [ ] 不需要压力测试，因为每个仓位都很小
   > 崩盘时相关性趋近 1，五个仓位会一起亏。联合情景加上平仓成本，才能看到“最坏的时候一起坏”的真实风险。

## @further
- [FINRA Rule 4210：保证金要求](https://www.finra.org/rules-guidance/rulebooks/finra-rules/4210) — 包括组合保证金（4210(g)）在内的保证金规则原文。
- [FINRA：保证金账户](https://www.finra.org/rules-guidance/key-topics/margin-accounts) — Reg T 与保证金账户的基础说明。
- [嘉信理财：组合保证金](https://www.schwab.com/margin/portfolio-margin) — 一家券商的组合保证金资格与说明（示例，非推荐）。
- [Value at risk（维基百科）](https://en.wikipedia.org/wiki/Value_at_risk) — VaR 的定义、算法与局限。
- [Options Clearing Corporation（OCC）](https://www.theocc.com/) — 美国上市期权的中央对手方，风险与保证金方法的官方来源。

## @next
情景矩阵、保证金、压力测试——工具都有了。可最常见的爆仓原因，往往不是算错了，而是明知道规则却没有遵守：亏了不认、赢了加码、连赢之后放松警惕。下一课，也是这一阶段的最后一课，讲心理、纪律与交易日志。
