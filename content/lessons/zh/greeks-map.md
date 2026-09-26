---
id: greeks-map
prereqs: before-expiry, price-drivers, black-scholes, implied-vol
demo: greeks-map
---

# 希腊字母总览：期权盈亏的泰勒展开

## @hook
一夜之间，小凯的看涨期权从 2.45 美元涨到 3.51 美元。XYZ 涨了 2 美元、过了一天、隐含波动率掉了 1 个点——三件事同时发生。希腊字母把这 1.06 美元拆成有名字的几块：方向贡献 1.07，弯曲贡献 0.14，时间拿走 0.04，波动率拿走 0.11。加起来，和精确答案只差不到 1 美分。

## @bridge
[[before-expiry]] 告诉我们，到期前有三股力量把期权的曲线“掰弯”：价格、时间、波动率。[[price-drivers]] 讲了每个输入把价格往**哪个方向**推，[[black-scholes]] 把这些输入变成一个数，[[implied-vol]] 又说明波动率这个输入自己也会动。这一课接着问下一个问题：**不是“往哪边”，而是“动多少”**——用一个展开式来回答，这一阶段后面每一课都是在放大它的某一项。它打开第 ④ 个观念：风险。希腊字母把任何期权头寸的风险拆成可以测量、可以相加、可以对冲的几块。

## @intuition
先看具体的一天。

小凯买入课程的“标准期权”：**30 天到期、行权价 100 的 XYZ 看涨期权**，价格 2.45 美元（XYZ 现价 100 美元，隐含波动率 20%，无风险利率 4%，数字仅作示例）。第二天发生了三件事：

- XYZ 收在 **102 美元**（涨了 2 美元）；
- 过去了**一天**（还剩 29 天）；
- 隐含波动率从 20% 掉到 **19%**。

用 Black-Scholes 重新定价：这张看涨期权现在值 **3.51 美元**。小凯每股赚了 \(3.51 - 2.45 = \$1.06\)，一张合约 \(\$106\)。不错——可是**为什么**是 1.06？三个变化里，哪个出了力？

希腊字母的办法是：每个输入问一个小问题，问的时候其他输入都不动。

- **Delta** \(\Delta = 0.534\)：XYZ 涨 1 美元，期权约涨 0.534 美元。涨了 2 美元，就约是 \(0.534 \times 2 = \$1.07\)。
- **Gamma** \(\Gamma = 0.069\)：XYZ 往上走时，Delta 自己也在变大（0.534 → 0.60 → 0.67），第二个 1 美元比第一个赚得多。这份“额外奖励”约是 \(\tfrac12 \times 0.069 \times 2^2 = \$0.14\)。
- **Theta** \(\Theta = -0.044\)（每天）：其他都不动，只是等一天，就少约 0.04 美元。
- **Vega** \(\nu = 0.114\)（每个波动率点）：IV 掉了 1 个点，约 −0.11 美元。

加起来：\(1.07 + 0.14 - 0.04 - 0.11 = 1.05\)。精确答案是 1.06。**昨天屏幕上就能读到的四个数，把今天的盈亏解释到了 1 美分以内。**

<figure>
<svg viewBox="0 0 660 260" role="img" aria-label="小凯一天的盈亏按希腊字母拆成瀑布图">
<line x1="50" y1="210" x2="640" y2="210" class="fx-axis"/>
<rect x="70" y="60" width="70" height="150" rx="3" class="fx-ok"/>
<text x="105" y="52" text-anchor="middle" class="fx-t-ok">+1.069</text>
<line x1="140" y1="60" x2="170" y2="60" class="fx-line-muted fx-dash"/>
<rect x="170" y="41" width="70" height="19" rx="3" class="fx-ok"/>
<text x="205" y="33" text-anchor="middle" class="fx-t-ok">+0.139</text>
<line x1="240" y1="41" x2="270" y2="41" class="fx-line-muted fx-dash"/>
<rect x="270" y="41" width="70" height="6" rx="2" class="fx-bad"/>
<text x="305" y="33" text-anchor="middle" class="fx-t-bad">−0.044</text>
<line x1="340" y1="47" x2="370" y2="47" class="fx-line-muted fx-dash"/>
<rect x="370" y="47" width="70" height="16" rx="3" class="fx-bad"/>
<text x="405" y="39" text-anchor="middle" class="fx-t-bad">−0.114</text>
<line x1="440" y1="63" x2="470" y2="63" class="fx-line-muted fx-dash"/>
<rect x="470" y="63" width="70" height="147" rx="3" class="fx-hl"/>
<text x="505" y="55" text-anchor="middle" class="fx-t-hl">+1.050</text>
<rect x="560" y="62" width="70" height="148" rx="3" class="fx-box2"/>
<text x="595" y="54" text-anchor="middle" class="fx-t-b">+1.057</text>
<text x="105" y="228" text-anchor="middle" class="fx-t-b">Δ · dS</text>
<text x="205" y="228" text-anchor="middle" class="fx-t-b">½ Γ · dS²</text>
<text x="305" y="228" text-anchor="middle" class="fx-t-b">Θ · dt</text>
<text x="405" y="228" text-anchor="middle" class="fx-t-b">ν · dσ</text>
<text x="505" y="228" text-anchor="middle" class="fx-t-b">希腊字母合计</text>
<text x="595" y="228" text-anchor="middle" class="fx-t-b">精确值</text>
<text x="105" y="245" text-anchor="middle" class="fx-t-sm">0.534 × 2</text>
<text x="205" y="245" text-anchor="middle" class="fx-t-sm">½ × 0.069 × 4</text>
<text x="305" y="245" text-anchor="middle" class="fx-t-sm">−0.044 × 1 天</text>
<text x="405" y="245" text-anchor="middle" class="fx-t-sm">0.114 × (−1)</text>
<text x="505" y="245" text-anchor="middle" class="fx-t-sm">泰勒估算</text>
<text x="595" y="245" text-anchor="middle" class="fx-t-sm">BS 重新定价</text>
<text x="60" y="14" class="fx-t-sm">每股盈亏，美元（XYZ 100 → 102，30 → 29 天，IV 20% → 19%）</text>
</svg>
<figcaption>图 1 · 小凯一天的盈亏瀑布图。方向（Delta）出了大部分力，弯曲（Gamma）再加一点奖励，时间（Theta）和 IV 下滑（Vega）各拿回一点。各项合计 1.050 美元，精确重新定价是 1.057 美元。</figcaption>
</figure>

每个希腊字母其实就是一个**斜率**：只拨动一个输入，其他全部冻住，看价格每单位变化多少。Delta 是价格对股价的斜率，Theta 是对日历的斜率，Vega 是对隐含波动率的斜率，Rho 是对利率的斜率。Gamma 是个例外——它是**Delta 这个斜率的斜率**，衡量价格曲线弯得有多厉害。

> [!KAI] 小凯的仪表盘（每张合约）
> 对这一张 30 天、行权价 100 的看涨期权（×100 股），屏幕上是：**Δ +53.4**（这张合约涨跌起来像 53 股 XYZ），**Γ +6.9**（XYZ 每涨 1 美元，Delta 多出约 7 股），**Θ 每天 −4.36 美元**，**ν 每个波动率点 +11.40 美元**，**ρ 利率每升 1% +4.19 美元**。小凯押的不只是方向：同时还“做多”了弯曲、“做多”了波动率，并且每天在给时间交房租。

> [!THINK] 如果 XYZ 不是涨 2 美元，而是**跌** 2 美元，Gamma 这一项是帮小凯赚钱，还是亏钱？
> 先猜，再点开。
> ---
> 依然是**赚** 0.14 美元。这一项是 \(\tfrac12\Gamma(\dd S)^2\)，不管 +2 还是 −2，平方都是正的。Delta 那一项变成约 −1.07 美元，所以期权整体是亏的——但比只看 Delta 亏得**少**，因为下跌途中 Delta 在变小。这就是“持有 Gamma”的意思：不管往哪边大动，相对于一条直线，你都占便宜。

你的头寸有哪些希腊字母、各是什么符号？在下面挑一个看看：

::demo[greeks-map-signs]

这一课拆成五块：

- **① 泰勒展开**：一个公式装下所有希腊字母
- **② 单位与 ×100**：怎么读屏幕上的数
- **③ XYZ 仪表盘**：希腊字母怎样随行权价和到期日变化
- **④ 符号表**：多头与空头、看涨与看跌
- **⑤ 这张地图在哪里会误导人**，以及专业人士怎么用它

## @mechanics
### ① 泰勒展开

期权价值 \(V\) 取决于股价 \(S\)、时间 \(t\)、波动率 \(\sigma\) 和利率 \(r\)。每个都动一点点时，微积分告诉我们，\(V\) 的变化可以很好地近似为若干“斜率 × 变化量”之和，再加上一项股价的弯曲项：

$$
\dd V \;\approx\; \underbrace{\Delta\,\dd S}_{\text{方向}} \;+\; \underbrace{\tfrac12\,\Gamma\,(\dd S)^2}_{\text{弯曲}} \;+\; \underbrace{\Theta\,\dd t}_{\text{时间}} \;+\; \underbrace{\nu\,\dd\sigma}_{\text{波动率}} \;+\; \underbrace{\rho\,\dd r}_{\text{利率}}
$$

其中：

- \(\dd S\) 是股价变动（美元），\(\dd t\) 是流逝的时间（天，配合课程里“每天”的 Theta），\(\dd\sigma\) 是隐含波动率的变化（波动率点），\(\dd r\) 是利率变化（百分点）；
- \(\Delta\)、\(\Gamma\)、\(\Theta\)、\(\nu\)（Vega）、\(\rho\) 就是希腊字母——都是变化**之前**量出来的斜率。

每个希腊字母都是价值的一个偏导数：只让一个输入变、其他不变时的变化率。

$$
\Delta = \frac{\partial V}{\partial S}, \qquad \Gamma = \frac{\partial^2 V}{\partial S^2}, \qquad \Theta = \frac{\partial V}{\partial t}, \qquad \nu = \frac{\partial V}{\partial \sigma}, \qquad \rho = \frac{\partial V}{\partial r}
$$

符号 \(\partial\)（偏导）提醒你“其他都不动”这条规矩。只有 Gamma 是**二阶**导数：它衡量股价变动时 Delta 变得多快。

> [!EXAMPLE] 小凯的一天，逐项算
> 30 天、行权价 100 的看涨期权：\(\Delta = 0.534\)，\(\Gamma = 0.0693\)，\(\Theta = -0.0436\)（每天），\(\nu = 0.114\)（每个波动率点），\(\rho = 0.042\)（每 1%）。这一天带来 \(\dd S = +2\)、\(\dd t = 1\) 天、\(\dd\sigma = -1\) 个点、\(\dd r = 0\)：
> $$
> \begin{aligned}
> \dd V &\approx 0.534 \times 2 + \tfrac12 \times 0.0693 \times 2^2 - 0.0436 \times 1 + 0.114 \times (-1) + 0.042 \times 0 \\
>       &= 1.069 + 0.139 - 0.044 - 0.114 = 1.050
> \end{aligned}
> $$
> 精确重新定价（\(S = 102\)，29 天，\(\sigma = 19\%\)）是 3.508 美元，变化 **1.057**。剩下的 0.007 叫**残差**，来自展开式忽略掉的效应，比如时间流逝时 Delta 本身的漂移。按合约算：估算 \(\$105.0\)，实际 \(\$105.7\)。

为什么有个 \(\tfrac12\)、还要平方？想象价格对 \(S\) 的曲线。Delta 那一项沿着今天这一点的**切线**走；真实曲线向上弯离这条切线，而一条弯曲的线最好用抛物线来描述：\(\tfrac12\Gamma(\dd S)^2\) 正是这条抛物线高出切线的部分。

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="期权价格曲线、切线与抛物线近似">
<defs><marker id="greeks-map-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="50" y1="230" x2="615" y2="230" class="fx-axis" marker-end="url(#greeks-map-ah)"/>
<line x1="60" y1="240" x2="60" y2="15" class="fx-axis" marker-end="url(#greeks-map-ah)"/>
<polyline points="60,230 330,230 600,33" class="fx-line-muted fx-dash"/>
<polyline points="248,230 330,198 600,93" class="fx-line-bad"/>
<polyline points="60,201 78,207 96,212 114,216 132,220 150,222 168,224 186,225 204,225 222,224 240,222 258,219 276,215 294,210 312,204 330,198 348,190 366,182 384,173 402,162 420,151 438,139 456,126 474,113 492,98 510,82 528,66 546,48 564,30" class="fx-line-blue fx-dash"/>
<polyline points="60,230 78,230 96,230 114,230 132,229 150,229 168,228 186,227 204,226 222,224 240,222 258,219 276,215 294,210 312,204 330,198 348,190 366,182 384,173 402,163 420,152 438,141 456,130 474,118 492,106 510,93 528,80 546,68 564,55 582,42 600,29" class="fx-line-thick"/>
<circle cx="330" cy="198" r="5" class="fx-fill-orange"/>
<line x1="510" y1="128" x2="510" y2="93" class="fx-line-hl"/>
<text x="518" y="148" class="fx-t-hl">凸性</text>
<text x="518" y="163" class="fx-t-sm">10.43 对 7.79</text>
<text x="150" y="248" text-anchor="middle" class="fx-t-sm">90</text>
<text x="240" y="248" text-anchor="middle" class="fx-t-sm">95</text>
<text x="330" y="248" text-anchor="middle" class="fx-t-b">100</text>
<text x="420" y="248" text-anchor="middle" class="fx-t-sm">105</text>
<text x="510" y="248" text-anchor="middle" class="fx-t-sm">110</text>
<text x="600" y="248" text-anchor="middle" class="fx-t-sm">115</text>
<text x="54" y="182" text-anchor="end" class="fx-t-sm">4</text>
<text x="54" y="129" text-anchor="end" class="fx-t-sm">8</text>
<text x="54" y="77" text-anchor="end" class="fx-t-sm">12</text>
<text x="338" y="215" class="fx-t-sm">今天：S = 100，V = 2.45</text>
<text x="80" y="30" class="fx-t">— 今天的价格（还剩 30 天）</text>
<text x="80" y="48" class="fx-t-bad">— 切线：只用 Delta</text>
<text x="80" y="66" class="fx-t-blue">- - 抛物线：Delta + ½ Gamma</text>
<text x="80" y="84" class="fx-t-sm">- - 到期时的价值</text>
<text x="612" y="222" text-anchor="end" class="fx-t-sm">XYZ 价格 S</text>
</svg>
<figcaption>图 2 · 30 天、行权价 100 的看涨期权价格随 XYZ 变化。红色切线（只用 Delta）永远在曲线下方；蓝色抛物线（Delta 加 \(\tfrac12\Gamma\)）在几美元的范围内紧贴曲线。到 \(S = 110\) 时，真实价值 10.43，切线说 7.79，抛物线反而冲过头到 11.26——变动太大时，连 Gamma 也不够用。</figcaption>
</figure>

> [!DEEP] 展开式从哪来
> 对任何光滑函数，泰勒定理给出 \(f(x + h) = f(x) + f'(x)\,h + \tfrac12 f''(x)\,h^2 + \dots\) 把它同时用在 \(V(S, t, \sigma, r)\) 的四个输入上，只保留一天之内要紧的项：每个输入保留一阶，只有 \(S\) 保留二阶——因为股价变动最大，而且它的平方会累积（随机游走的平方变动与时间成正比，所以 \((\dd S)^2\) 能和 \(\dd t\) 平起平坐）。被扔掉的项——\(\tfrac12\) Volga \((\dd\sigma)^2\)、Vanna \(\dd S\,\dd\sigma\)、Charm \(\dd S\,\dd t\)——是 [[higher-order-greeks]] 的主题。

### ② 单位与 ×100

希腊字母只有知道单位才有用。本课程的引擎和所有演示都用交易台的惯例：

| 希腊字母 | 微积分含义 | 交易单位 | 30 天 100 看涨，每股 | 每张合约（×100） |
|---|---|---|---|---|
| Delta \(\Delta\) | \(\partial V/\partial S\) | 股价每变 1 美元 | 0.534 | 相当于 53.4 股 |
| Gamma \(\Gamma\) | \(\partial^2 V/\partial S^2\) | 股价每变 1 美元，Delta 的变化 | 0.069 | 每 1 美元 6.93 股 |
| Theta \(\Theta\) | \(\partial V/\partial t\) | 每个日历日 | −0.044 | 每天 −4.36 美元 |
| Vega \(\nu\) | \(\partial V/\partial \sigma\) | 每 1 个波动率点 | 0.114 | 每点 11.40 美元 |
| Rho \(\rho\) | \(\partial V/\partial r\) | 每 1 个百分点 | 0.042 | 每 1% 4.19 美元 |

原始的微积分数值更大、单位也别扭。Black-Scholes 给出的 Theta 是**每年 −15.90**；课程除以 365，得到每个日历日 \(-15.90/365 = -0.0436\)。Vega 原始值是每单位 \(\sigma\)（也就是每 100 个波动率点）11.40，除以 100 才是每个波动率点 0.114。

希腊字母**可以跨头寸相加**。一个头寸的某个希腊字母 = 各条腿的（合约张数 × 100 × 每股希腊字母）之和，空头腿带负号；股票每股 \(\Delta = 1\)，没有其他希腊字母。5 张多头 30 天看涨，Delta 是 \(5 \times 100 \times 0.534 = 267\) 股，Theta 每天 \(5 \times 100 \times (-0.0436) = -\$21.80\)。正因为可以相加，交易台才能用五个数描述一本几百张期权的账（[[portfolio-risk]]）。

> [!WARN] 比较之前先对单位
> 不同平台不一样。有的 Theta 按**年**显示，有的按**交易日**（除以约 252 而不是 365），有的按日历日。有的 Vega 按 1 个波动率点，少数按 100%。有的算了股息，有的用了不同的利率。一个屏幕上的“Theta −0.06”和另一个屏幕上的“−0.044”可能是同一张期权。比较之前先找单位——别忘了 ×100。

### ③ XYZ 仪表盘

把课程的标准期权排在一起（每股；XYZ \(S = 100\)，\(\sigma = 20\%\)，\(r = 4\%\)）：

| 期权 | 价格 | \(\Delta\) | \(\Gamma\) | \(\Theta\) / 天 | \(\nu\) / 点 | \(\rho\) / 1% |
|---|---|---|---|---|---|---|
| 30 天 100 看涨 | 2.45 | 0.534 | 0.069 | −0.044 | 0.114 | 0.042 |
| 30 天 100 看跌 | 2.12 | −0.466 | 0.069 | −0.033 | 0.114 | −0.040 |
| 30 天 105 看涨 | 0.71 | 0.222 | 0.052 | −0.031 | 0.085 | 0.018 |
| 30 天 95 看跌 | 0.51 | −0.163 | 0.043 | −0.022 | 0.071 | −0.014 |
| 7 天 100 看涨 | 1.14 | 0.517 | 0.144 | −0.084 | 0.055 | 0.010 |
| 1 天 100 看涨 | 0.42 | 0.506 | 0.381 | −0.214 | 0.021 | 0.001 |
| 1 年 100 看涨 | 9.93 | 0.618 | 0.019 | −0.016 | 0.381 | 0.519 |

竖着读每一列，会跳出五个规律——每一个都是后面某一课的标题：

- **Delta** 从接近 0（深度虚值）走到接近 1（深度实值），平值时略高于 0.5。同一行权价的看涨与看跌正好差 1（\(0.534 - (-0.466) = 1\)）。→ [[delta]]
- **Gamma** 在平值处最大，并且**越临近到期越大**：30 天 0.069，1 天 0.381。同一行权价的看涨与看跌 Gamma 相同。→ [[gamma]]
- **Theta** 在平值处最负，临近到期也越来越大：−0.044 → −0.214。Gamma 和 Theta 一起涨——它们是同一枚硬币的两面。→ [[theta]]
- **Vega** 正相反：临近到期**变小**（1 天只有 0.021），长期期权最大（1 年 0.381）。→ [[vega]]
- **Rho** 对短期期权很小（0.042），只有长期期权才要紧（1 年 0.519）。→ [[rho-carry]]

所以 1 天的期权几乎全是 Gamma 和 Theta，1 年的期权主要是 Vega 和 Rho。**同样叫“平值看涨”，到期日不同，风险完全是两回事。**

### ④ 符号表

一个希腊字母是帮你还是害你，看它的符号。单腿头寸：

| 头寸 | \(\Delta\) | \(\Gamma\) | \(\Theta\) | \(\nu\) | \(\rho\) |
|---|---|---|---|---|---|
| 买看涨 | + | + | − | + | + |
| 卖看涨 | − | − | + | − | − |
| 买看跌 | − | + | − | + | − |
| 卖看跌 | + | − | + | − | + |
| 买股票 | +1 | 0 | 0 | 0 | 0 |

三条规则就够了：

1. **Delta 和 Rho 看是看涨还是看跌。** 股价（或利率）上升，看涨赚、看跌亏。
2. **Gamma、Theta、Vega 只看是买还是卖。** 凡是**买入**期权的——不管看涨看跌——都是多 Gamma、多 Vega、空 Theta；卖出的人正好是镜像。
3. **Gamma 和 Theta 符号相反。** 想拥有弯曲，就得按天付钱。

> [!KEY] 买期权 = 多 Gamma、多 Vega、空 Theta
> 买入期权从来不只是“押方向”。它同时押股价会动得够多（Gamma）、押隐含波动率不会掉（Vega），并且承诺等待期间每天付时间损耗（Theta）。卖出期权，每一个符号都翻过来。卖方每天收的 Theta，就是买方为 Gamma 付的价钱——[[theta]] 会把这句话变成一个精确的等式。

为了完整，补一个技术性例外：利率为正时，深度实值的**欧式**看跌期权 Theta 可能为正。XYZ 的 1 年期、行权价 130 的看跌期权 \(\Theta \approx +0.006\)（每天），因为多等一天，行权价的现值就离你更近一点。日常期权，规则 3 成立。

### ⑤ 这张地图在哪里会误导人，专业人士怎么用它

展开式是一张**局部**地图——小变动时非常准，变动越大越不准。

**股价大幅变动。** XYZ 跳涨 10 美元（其他不变），30 天看涨期权涨 **7.98 美元**。只用 Delta 预测 \(0.534 \times 10 = \$5.34\)；Delta 加 Gamma 预测 \(5.34 + \tfrac12 \times 0.0693 \times 100 = \$8.81\)。前者太低，后者太高：期权进入深度实值后，Delta 不可能超过 1，Gamma 自己就衰减了。下面的主演示可以看着这个缺口张开。

**希腊字母自己会动。** 每个希腊字母都是按今天的输入量的。过了一天，Delta 会漂移（Charm）；IV 变了，Delta 和 Vega 都会跟着变（Vanna、Volga）。平静的一天里，这些交叉效应只有几分钱——小凯的残差是 0.007。遇到财报跳空，它们可能成为主角。见 [[higher-order-greeks]]。

**输入会一起动。** 展开式把 \(\dd S\) 和 \(\dd\sigma\) 当成两个独立的旋钮。在股票市场里它们是连着的：股价下跌时，隐含波动率通常上升。持有看跌的人，Delta 的收益和 Vega 的收益一起来；持有看涨的人，两者可能互相抵消。这种情况，情景分析比单个希腊字母更可靠。

所以风险系统用两种方式使用希腊字母。日常，它们报告头寸的希腊字母，并做**盈亏归因**：把昨天的盈亏拆成 Delta、Gamma、Theta、Vega、Rho 几项，再加一个残差（常常标成“未解释部分”）。残差小，说明风险画像是完整的；残差大，是警告：漏了什么——一次跳空、一个过期的输入、一个模型错误。遇到大幅变动，它们不信展开式，而是在一张股价 × 波动率的情景网格上把每张期权**完整重新定价**（[[portfolio-risk]]）。

## @analogy
想想一户人家的**分项电费账单**。电表只显示一个数：这个月用了 106 元的电。分项账单把它拆开：空调、冰箱、热水器、电灯。每一行都是**单价**乘以**用量**：空调每小时多少钱，开了多少小时。

希腊字母就是这些单价。Delta 是“股价每动 1 美元赚多少”，Theta 是“每天多少钱”，Vega 是“每个波动率点多少钱”。市场提供用量：股价动了多少、过了几天、隐含波动率变了多少。相乘再相加，分项账单就对上了电表——1.05 对 1.06。

这个画面也说明了拆分有什么用。电费突然变高，你想知道是热水器还是电灯；一个头寸亏了钱，你想知道是方向、时间还是波动率。只有拆开，才知道该修哪里。

类比失效的地方：电器的单价是固定的，希腊字母却会在你“用”它的时候变化。股价往上跑，Delta 自己会变大（这就是 Gamma）；时间流逝，Gamma 和 Theta 都会变大。用量小的时候，分项账单很准；遇到用量特别大的月份——一次暴跌、一次财报跳空——各项加起来就对不上电表了，这时只能直接看电表：重新定价。

## @misconceptions
- **“希腊字母是贴在期权上的固定数字。”** —— 它们是按今天的股价、时间和波动率量出来的斜率。任何一个输入变了，所有希腊字母都会变：Delta 随股价变，Gamma 和 Theta 临近到期变大，Vega 变小。
- **“Theta 就是我每天确定要亏的钱。”** —— Theta 是“其他都冻住、只过一天”的变化。实际盈亏还包括当天股价和 IV 带来的 Delta、Gamma、Vega 各项。
- **“把希腊字母各项加起来，总能得到精确盈亏。”** —— 只在小变动时成立。XYZ 跳涨 10 美元时，Delta 加 Gamma 说 8.81 美元，真实只涨 7.98 美元。大变动要重新定价。
- **“买看涨就是押股价上涨。”** —— 它还做多 Gamma（希望大动）、做多 Vega（希望 IV 上升或至少不掉）、做空 Theta（每天交租）。很多亏钱的看涨期权，方向是对的，亏在了时间或波动率上。
- **“Delta 中性就是没有风险。”** —— 它只是对小幅股价变动没有**一阶**敞口。Gamma、Vega、Theta 都还在——而且常常是有意留下的。

## @takeaways
- 希腊字母把期权盈亏拆成有名字的几块：\(\dd V \approx \Delta\,\dd S + \tfrac12\Gamma(\dd S)^2 + \Theta\,\dd t + \nu\,\dd\sigma + \rho\,\dd r\)。
- 小凯的一天（XYZ +2 美元、过一天、IV −1 个点）：各项合计 1.050 美元，精确值 1.057 美元。
- 单位要紧：Delta 每 1 美元、Gamma 每 1 美元、Theta 每个日历日、Vega 每个波动率点、Rho 每 1%——都是每股，一张合约再 ×100；头寸的希腊字母可以跨腿相加。
- 短期期权主要是 Gamma 和 Theta；长期期权主要是 Vega 和 Rho。
- 买入任何期权都是多 Gamma、多 Vega、空 Theta；卖出则每个符号都翻转。
- 展开式是局部的：大幅变动、跳空或股价与波动率联动时，要完整重新定价。

## @quiz
1. 用 30 天 XYZ 100 看涨期权的希腊字母（\(\Delta = 0.534\)，\(\Gamma = 0.069\)，\(\Theta = -0.044\)），估算：一天之内 XYZ 涨 1 美元、IV 保持 20%，期权价格变化多少？
   - [ ] +0.534 美元
   - [ ] +0.569 美元
   - [x] 约 +0.525 美元
   - [ ] +0.490 美元
   > \(0.534 \times 1 + \tfrac12 \times 0.069 \times 1^2 - 0.044 = 0.534 + 0.035 - 0.044 = 0.525\)。+0.569 忘了 Theta；+0.490 忘了 Gamma；+0.534 只用了 Delta。
2. 小凯持有 10 张 30 天 100 看涨期权（每股每天 \(\Theta = -0.0436\)）。其他都不变，一天因为时间亏掉大约多少？
   - [x] 43.60 美元
   - [ ] 0.44 美元
   - [ ] 4.36 美元
   - [ ] 15.90 美元
   > 头寸 Theta = 张数 × 100 × 每股 Theta = \(10 \times 100 \times 0.0436 = \$43.60\)。4.36 美元是一张的；15.90 是一股按年计的 Theta。
3. 哪个头寸是 Gamma 为负、Theta 为正、Vega 为负，**并且** Delta 为正？
   - [ ] 买看跌
   - [ ] 买看涨
   - [ ] 100 股股票
   - [x] 卖看跌
   > 卖出任何期权，Gamma 和 Vega 为负、Theta 为正。空头里只有卖看跌在股价上涨时赚钱（Delta 为正）。买看跌、买看涨都是多 Gamma；股票根本没有 Gamma、Theta、Vega。
4. XYZ 跳涨 10 美元时，30 天看涨期权的估算 \(\Delta\,\dd S + \tfrac12\Gamma(\dd S)^2\) 是 8.81 美元，真实涨幅是 7.98 美元。估算为什么冲过头？
   - [ ] 因为漏了 Theta
   - [x] 因为期权进入深度实值后 Gamma 变小——Delta 不可能超过 1
   - [ ] 因为 Black-Scholes 对大变动是错的
   - [ ] 因为股价上涨时 Vega 会变大
   > 展开式整段都用今天的 Gamma。XYZ 往 110 走时，Delta 逼近 1、Gamma 衰减，真实曲线弯得比抛物线少。这里没有时间流逝，Theta 不起作用。
5. 某交易员的头寸显示 \(\Delta \approx 0\)，\(\Gamma = +40\)，\(\Theta\) 每天 −120 美元，\(\nu\) 每个波动率点 +300 美元。哪个描述最贴切？
   - [ ] Delta 为零，所以没有风险
   - [ ] XYZ 纹丝不动时它赚钱
   - [ ] 它在押隐含波动率下跌
   - [x] 不管往哪边大动、IV 上升，它都赚钱；等待期间每天付 120 美元
   > Delta 为零只去掉了一阶方向押注。正 Gamma 从两个方向的大行情里赚钱，正 Vega 从 IV 上升中赚钱，负 Theta 是每天的成本——典型的买入跨式（[[straddle-strangle]]）画像。

## @further
- [Greeks (finance)（维基百科）](https://en.wikipedia.org/wiki/Greeks_(finance)) — 一阶、二阶希腊字母的定义、公式和单位惯例。
- [Taylor's theorem（维基百科）](https://en.wikipedia.org/wiki/Taylor%27s_theorem) — 展开式背后的微积分，含误差界。
- [Black & Scholes (1973), The Pricing of Options and Corporate Liabilities](https://doi.org/10.1086/260062) — 把 Theta 和 Gamma 绑在一起的对冲论证。
- [Characteristics and Risks of Standardized Options（OCC）](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — 每位美国期权交易者都会收到的官方风险揭示文件。

## @next
小凯这一天，大部分功劳是 Delta 的。可 Delta 同时是三样东西：一个斜率、对冲这张期权所需的股数，以及一个看起来像概率、其实不完全是概率的数。下一课把这三样分开。
