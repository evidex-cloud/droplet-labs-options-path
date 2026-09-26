---
id: higher-order-greeks
prereqs: greeks-map, delta, gamma, theta, vega, rho-carry
demo: higher-order-greeks
---

# 二阶希腊与组合希腊：Vanna、Volga、Charm

## @hook
周五，小凯的领口组合表现得像 61 股 XYZ。周一，XYZ 还是 100 美元，小凯一笔都没交易——但经过一个周末、隐含波动率又涨了 5 个点，同一个领口只相当于 54 股了。希腊字母自己动了。这一课度量它们怎么动，再把整个仓位装进风险经理真正信任的那张图：“股价 × 波动率”情景矩阵。

## @bridge
[[greeks-map]] 把期权盈亏写成泰勒展开，之后五课一个字母一个字母地拆：[[delta]] 和 [[gamma]] 管股价，[[theta]] 管时钟，[[vega]] 管隐含波动率，[[rho-carry]] 管利率和股息。每一次都把其他因素冻住来量。这一课回答剩下的问题：**两件事同时动时会发生什么？一整个仓位的风险怎么加总？**它落在第 ④ 个观念（把风险拆成可度量的部分）上，也为原理层画上句号。

## @intuition
拿小凯领口里的一条腿来看：小凯以 0.71 美元卖出的 **30 天 XYZ 105 看涨**。XYZ 100 美元、IV 20% 时，它的 Delta 是 **0.222**：每张合约相当于 22 股。

现在改一个**不是股价**的东西。

- **隐含波动率升 5 个点**（20% → 25%），XYZ 不动。这张看涨的 Delta 变成 **0.275**。波动率更高，收在 105 以上就更有可能，所以看涨更像股票。每个波动率点带来的这种变化叫 **Vanna**：对这张看涨，大约每点 \(+0.012\) 的 Delta。
- **过去三天**（周五到周一），XYZ 和 IV 都不动。Delta 变成 **0.207**。剩下的时间更少，收在 105 以上就更不可能，所以看涨不那么像股票了。每天的这种变化叫 **Charm**：大约每天 \(-0.005\) 的 Delta。

什么都没成交，小凯为这一张合约做对冲所需的股数，却在第一种情形下从 22 变成约 27，在第二种情形下变成约 21。这些就是**二阶希腊字母**：希腊字母自身的敏感度。

<figure>
<svg viewBox="0 0 660 270" role="img" aria-label="二阶希腊字母地图：Delta、Vega、Gamma 随股价、波动率和时间怎样变化">
<rect x="130" y="16" width="170" height="36" rx="6" class="fx-box2"/>
<rect x="310" y="16" width="170" height="36" rx="6" class="fx-box2"/>
<rect x="490" y="16" width="160" height="36" rx="6" class="fx-box2"/>
<text x="215" y="39" text-anchor="middle" class="fx-t-b">股价 S 变动</text>
<text x="395" y="39" text-anchor="middle" class="fx-t-b">隐含波动率 σ 变动</text>
<text x="570" y="39" text-anchor="middle" class="fx-t-b">时间 t 流逝</text>
<rect x="10" y="62" width="110" height="62" rx="6" class="fx-hl"/>
<text x="65" y="90" text-anchor="middle" class="fx-t-b">Delta Δ</text>
<text x="65" y="110" text-anchor="middle" class="fx-t-sm">相当于多少股</text>
<rect x="10" y="134" width="110" height="62" rx="6" class="fx-blue"/>
<text x="65" y="162" text-anchor="middle" class="fx-t-b">Vega ν</text>
<text x="65" y="182" text-anchor="middle" class="fx-t-sm">每个波动率点的美元</text>
<rect x="10" y="206" width="110" height="56" rx="6" class="fx-box"/>
<text x="65" y="231" text-anchor="middle" class="fx-t-b">Gamma Γ</text>
<text x="65" y="250" text-anchor="middle" class="fx-t-sm">每 1 美元的 Δ 变化</text>
<rect x="130" y="62" width="170" height="62" rx="6" class="fx-box"/>
<text x="215" y="88" text-anchor="middle" class="fx-t-b">Gamma</text>
<text x="215" y="108" text-anchor="middle" class="fx-t-sm">∂Δ/∂S</text>
<rect x="310" y="62" width="170" height="62" rx="6" class="fx-ok"/>
<text x="395" y="88" text-anchor="middle" class="fx-t-b">Vanna</text>
<text x="395" y="108" text-anchor="middle" class="fx-t-sm">∂Δ/∂σ</text>
<rect x="490" y="62" width="160" height="62" rx="6" class="fx-ok"/>
<text x="570" y="88" text-anchor="middle" class="fx-t-b">Charm</text>
<text x="570" y="108" text-anchor="middle" class="fx-t-sm">∂Δ/∂t</text>
<rect x="130" y="134" width="170" height="62" rx="6" class="fx-ok"/>
<text x="215" y="160" text-anchor="middle" class="fx-t-b">Vanna（又一次）</text>
<text x="215" y="180" text-anchor="middle" class="fx-t-sm">∂ν/∂S = ∂Δ/∂σ</text>
<rect x="310" y="134" width="170" height="62" rx="6" class="fx-ok"/>
<text x="395" y="160" text-anchor="middle" class="fx-t-b">Volga（Vomma）</text>
<text x="395" y="180" text-anchor="middle" class="fx-t-sm">∂ν/∂σ</text>
<rect x="490" y="134" width="160" height="62" rx="6" class="fx-box"/>
<text x="570" y="160" text-anchor="middle" class="fx-t">Veta</text>
<text x="570" y="180" text-anchor="middle" class="fx-t-sm">∂ν/∂t</text>
<rect x="130" y="206" width="170" height="56" rx="6" class="fx-box"/>
<text x="215" y="230" text-anchor="middle" class="fx-t">Speed</text>
<text x="215" y="249" text-anchor="middle" class="fx-t-sm">∂Γ/∂S</text>
<rect x="310" y="206" width="170" height="56" rx="6" class="fx-box"/>
<text x="395" y="230" text-anchor="middle" class="fx-t">Zomma</text>
<text x="395" y="249" text-anchor="middle" class="fx-t-sm">∂Γ/∂σ</text>
<rect x="490" y="206" width="160" height="56" rx="6" class="fx-box"/>
<text x="570" y="230" text-anchor="middle" class="fx-t">Color</text>
<text x="570" y="249" text-anchor="middle" class="fx-t-sm">∂Γ/∂t</text>
</svg>
<figcaption>图 1 · 希腊字母的希腊字母。每一行是一个一阶希腊字母，每一列是变动的那个因素。Gamma 你已经认识（Delta 随股价的变化）。绿色格子——Vanna、Volga 和 Charm——是实务中最能改变对冲和盈亏的三个；Vanna 出现两次，因为 \(\partial\Delta/\partial\sigma\) 和 \(\partial\nu/\partial S\) 是同一个数。</figcaption>
</figure>

下面的小演示展示股价不动时期权 Delta 的漂移：把日历往前拨、改一改 IV，比较用 Charm 和 Vanna 算出的估计值与精确的 Delta。

::demo[higher-order-greeks-charm]

> [!THINK] 小凯的另一条腿是买入的 30 天 95 看跌，Delta 为 −0.163。IV 升 5 个点，XYZ 不动。这张看跌的 Delta 会朝 0 靠近，还是远离 0？
> 想一想：更高的波动率对虚值期权意味着什么？
> ---
> 远离 0：变成约 −0.213。波动率更高，收在 95 以下更有可能，所以这张看跌更像股票空头。经验法则：**波动率上升会把每个 Delta 拉向平值的数值**（约 ±0.5）——虚值期权的 Delta 变大，实值期权的 Delta 变小。时间流逝的作用正好相反：把 Delta 推向 0 或 ±1。

二阶希腊字母数值都很小，为什么要在乎？因为一个仓位是许多期权的和；也因为市场里真正的大日子，往往是**几件事同时动**的日子——股价下跌，隐含波动率同时跳升。交叉项恰恰是一阶记账出错的地方。这一课的最后一步，是干脆不再估计，而是在一张情景矩阵上把整个仓位重新定价。

这一课拆成五块：

- **① Vanna：Delta 遇上波动率**
- **② Volga：Vega 的凸性**
- **③ Charm、Speed 与 Color：希腊字母与时钟**
- **④ 组合希腊与二阶展开**
- **⑤ 股价 × 波动率矩阵，以及做市商为何盯着 Vanna 和 Charm**

## @mechanics
### ① Vanna：Delta 遇上波动率

Vanna 是期权价格对股价和波动率的交叉导数。求导顺序无关，所以它有两种读法——Delta 随波动率怎么变，Vega 随股价怎么变：

$$
\text{vanna} = \frac{\partial \Delta}{\partial \sigma} = \frac{\partial \nu}{\partial S} = -\,e^{-qT}\,\varphi(d_1)\,\frac{d_2}{\sigma}
$$

其中 \(\varphi(d_1)\) 是 \(d_1\) 处的正态密度，\(d_2 = d_1 - \sigma\sqrt{T}\)，\(\sigma\) 是波动率。看涨和看跌的公式相同（两者的 Delta 只差一个常数）。它的符号由 \(d_2\) 决定：期权在看涨一侧虚值时（\(d_2 < 0\)），Vanna 为正；另一侧为负；平值附近接近零。

> [!EXAMPLE] 小凯卖出的 105 看涨的 Vanna
> 30 天 105 看涨：\(d_1 = -0.765\)，\(d_2 = -0.822\)，\(\varphi(d_1) = 0.2978\)：
> $$
> \text{vanna} = -\,0.2978 \times \frac{-0.822}{0.20} = 1.224
> $$
> 这是 σ 变动 1.00 时的数值。换成每个波动率点：\(0.0122\)。所以 IV 升 5 个点，Delta 约加 \(5 \times 0.0122 = 0.061\)：估计 \(0.222 \to 0.283\)，精确值 \(0.275\)。反过来读：XYZ 涨 1 美元，这张看涨的 Vega 每点约增加 \(\$0.012\)，从 0.085 变成约 0.097。

<figure>
<svg viewBox="0 0 640 440" role="img" aria-label="30 天行权价 100 看涨期权的 Vanna 与 Volga 随股价变化">
<line x1="60" y1="63" x2="600" y2="63" class="fx-grid"/>
<line x1="60" y1="177" x2="600" y2="177" class="fx-grid"/>
<line x1="60" y1="120" x2="610" y2="120" class="fx-axis"/>
<line x1="60" y1="30" x2="60" y2="205" class="fx-axis"/>
<line x1="330" y1="30" x2="330" y2="205" class="fx-line-muted fx-dash"/>
<polygon points="60,120 71,119 83,119 94,118 105,117 116,115 128,113 139,109 150,105 161,99 172,92 184,84 195,76 206,67 218,59 229,53 240,48 251,47 263,49 274,54 285,64 296,76 307,90 319,107 330,120" class="fx-area-ok"/>
<polygon points="330,120 341,139 353,154 364,166 375,175 386,181 398,185 409,185 420,183 431,179 442,174 454,168 465,162 476,155 488,150 499,144 510,139 521,135 533,132 544,129 555,127 566,125 578,124 589,123 600,122 600,120" class="fx-area-bad"/>
<polyline points="60,120 71,119 83,119 94,118 105,117 116,115 128,113 139,109 150,105 161,99 172,92 184,84 195,76 206,67 218,59 229,53 240,48 251,47 263,49 274,54 285,64 296,76 307,90 319,107 330,123 341,139 353,154 364,166 375,175 386,181 398,185 409,185 420,183 431,179 442,174 454,168 465,162 476,155 488,150 499,144 510,139 521,135 533,132 544,129 555,127 566,125 578,124 589,123 600,122" class="fx-line-hl"/>
<text x="52" y="67" text-anchor="end" class="fx-t-sm">+0.01</text>
<text x="52" y="124" text-anchor="end" class="fx-t-sm">0</text>
<text x="52" y="181" text-anchor="end" class="fx-t-sm">−0.01</text>
<text x="70" y="26" class="fx-t-b">Vanna（每个波动率点的 Δ 变化）</text>
<text x="150" y="150" class="fx-t-ok">S 低于 K：波动率升 → Δ 升</text>
<text x="400" y="80" class="fx-t-bad">S 高于 K：波动率升 → Δ 降</text>
<line x1="60" y1="280" x2="600" y2="280" class="fx-grid"/>
<line x1="60" y1="340" x2="600" y2="340" class="fx-grid"/>
<line x1="60" y1="400" x2="610" y2="400" class="fx-axis"/>
<line x1="60" y1="245" x2="60" y2="400" class="fx-axis"/>
<line x1="330" y1="245" x2="330" y2="286" class="fx-line-muted fx-dash"/>
<line x1="330" y1="306" x2="330" y2="400" class="fx-line-muted fx-dash"/>
<polyline points="60,399 71,397 83,396 94,393 105,388 116,382 128,374 139,364 150,352 161,337 172,322 184,308 195,294 206,285 218,280 229,280 240,287 251,300 263,318 274,338 285,359 296,377 307,391 319,399 330,400 341,393 353,381 364,363 375,344 386,323 398,304 409,289 420,277 431,271 442,269 454,272 465,279 476,289 488,300 499,313 510,326 521,338 533,349 544,359 555,368 566,375 578,381 589,386 600,390" class="fx-line-blue"/>
<text x="52" y="284" text-anchor="end" class="fx-t-sm">0.004</text>
<text x="52" y="344" text-anchor="end" class="fx-t-sm">0.002</text>
<text x="52" y="404" text-anchor="end" class="fx-t-sm">0</text>
<text x="70" y="244" class="fx-t-b">Volga（每个波动率点的 Vega 变化）</text>
<text x="330" y="418" text-anchor="middle" class="fx-t-b">K = 100</text>
<text x="195" y="418" text-anchor="middle" class="fx-t-sm">90</text>
<text x="465" y="418" text-anchor="middle" class="fx-t-sm">110</text>
<text x="600" y="436" text-anchor="end" class="fx-t-sm">股价 S（30 天 100 看涨，σ 20%）</text>
<text x="330" y="300" text-anchor="middle" class="fx-t-sm">平值处 ≈ 0 ↓</text>
</svg>
<figcaption>图 2 · 上：Vanna 在行权价处变号——股价低于行权价时，波动率上升让看涨的 Delta 变大；高于行权价时则变小。下：Volga 在平值处几乎为零，两翼为正，大约在离行权价一个标准差处达到峰值。平值期权“只有 Vega”；翼部期权才带有对波动率的弯曲。</figcaption>
</figure>

Vanna 在股价和隐含波动率**一起动**时最要紧。股票指数里两者通常反向而行：价格下跌，IV 上升（[[smile-skew]]）。所以 Vanna 大的仓位，Delta 恰恰在市场波动时移动——你设好的对冲，偏偏在受考验的时候失准。风险逆转（买看涨卖看跌，或反过来）几乎就是纯粹的 Vanna 与偏斜交易（[[ratios-risk-reversals]]）。

### ② Volga：Vega 的凸性

Volga（也叫 Vomma）是价格对波动率的二阶导数——IV 变动时 Vega 自己变得有多快：

$$
\text{volga} = \frac{\partial \nu}{\partial \sigma} = \nu\,\frac{d_1\,d_2}{\sigma}
$$

其中 \(\nu\) 是原始单位的 Vega，\(d_1, d_2\) 是 Black-Scholes 里的老朋友。平值时 \(d_1 d_2 \approx 0\)，所以 Volga 约为零：这就是 [[vega]] 里平值期权的价格对 σ 是一条直线的原因。离开平值，\(d_1\) 和 \(d_2\) 同号，乘积为正，所以**买入的虚值期权有正的 Volga**——对波动率的凸性，是 Gamma 在“波动率空间”里的表亲。

> [!EXAMPLE] 105 看涨的 Volga，以及卖宽跨藏着的额外损失
> 105 看涨的原始 Vega 是 8.536，所以 Volga \(= 8.536 \times \dfrac{(-0.765)(-0.822)}{0.20} = 26.84\)，即每个波动率点让 Vega 增加 \(0.0027\)。IV 25% 时它的 Vega 约为 0.096，而不是 0.085——波动率越高，期权对波动率越**敏感**。
> 卖出 95/105 宽跨，每张 Vega 为 \(-\$15.61\)。IV 升 10 个点，只看 Vega 预测亏 \(\$156\)；精确亏损是 \(\$177\)。升 20 个点时精确亏 \(\$378\)，预测只有 \(\$312\)。差额就是 Volga，而且它总是对翼部的卖方不利。

Volga 正是人们谈论**“波动率的波动率”（vol of vol）**的原因。如果隐含波动率本身跳来跳去，持有 Volga（买入两翼）就有价值，翼部期权的价格会高于用一个平坦 σ 的 Black-Scholes 给出的价格。这是微笑形成的力量之一；让波动率本身也能变动的模型——[[stochastic-vol]]——会明确地给它定价。

### ③ Charm、Speed 与 Color：希腊字母与时钟

**Charm** 是股价和波动率不变时，Delta 随时间流逝的变化率：\(\text{charm} = \partial\Delta/\partial t\)。时间的作用和波动率相反：它把虚值期权的 Delta 拉向 0，把实值期权的 Delta 拉向 ±1，因为每过一天，最终答案都更确定一点。

| 小凯的各条腿，XYZ 100 美元，IV 20% | 今天的 Delta | 每天的 Charm | 三天周末之后的 Delta |
|---|---|---|---|
| 30 天 105 看涨 | 0.222 | −0.0047 | 0.207 |
| 30 天 95 看跌 | −0.163 | +0.0033 | −0.153 |
| 30 天 100 看涨（平值） | 0.534 | −0.0006 | 0.533 |
| 7 天 105 看涨 | 0.043 | −0.0117 | — |

对一个月后到期的期权，Charm 很小；越接近到期，它越大：105 看涨在剩 30 天时每天少 0.005 的 Delta，剩 7 天时每天少 0.012。到了到期日那个周五，虚值期权的 Delta 会在几小时内塌到零（[[zero-dte]] 就生活在那里）。

再简单认识两个家族成员：

- **Speed** \(= \partial\Gamma/\partial S\)：Gamma 随股价的变化。105 看涨在 S = 100 时 Gamma 为 0.052，S = 101 时为 0.058——股价涨向卖出的行权价时，卖方的 Gamma 敞口**增加**。
- **Color** \(= \partial\Gamma/\partial t\)：Gamma 随时间的变化。平值 Gamma 在剩 7 天时是 0.144，剩 6 天时是 0.156；最后两天之间则从 0.269 跳到 0.381。这就是 [[gamma]] 里“临近到期 Gamma 爆炸”背后的算术。

> [!KAI] 小凯的领口过了一个周末
> 每张合约的领口是：+100 股、买 1 张 95 看跌、卖 1 张 105 看涨。周五的 Delta 是 \(100 - 16.3 - 22.2 = 61.4\) 股。它的 Vanna 是每个波动率点 \(-2.4\) 股，Charm 是每天 \(+0.8\) 股。周末出了行业消息，IV 升了 5 个点，XYZ 仍在 100 美元。估计：\(61.4 - 5 \times 2.4 + 3 \times 0.8 \approx 52\) 股。精确值：**53.6**。小凯什么都没交易，却比周五少了约 8 股“等效持股”——领口悄悄变得更保守了。

### ④ 组合希腊与二阶展开

希腊字母**可以相加**。对一个仓位，把每条腿的希腊字母乘以带符号的数量（卖出为负）和合约乘数，再求和：

$$
G_{\text{组合}} = \sum_i n_i \times 100 \times G_i
$$

其中 \(n_i\) 是第 \(i\) 条腿的合约张数（股票按每股 Delta 1 计），\(G_i\) 是这条腿每股的任意一个希腊字母。有了组合的希腊字母，[[greeks-map]] 里的展开可以写到二阶：

$$
\Delta\Pi \approx \Delta\,\dd S + \tfrac12\Gamma\,\dd S^2 + \nu\,\dd\sigma + \Theta\,\dd t + \text{vanna}\,\dd S\,\dd\sigma + \tfrac12\,\text{volga}\,\dd\sigma^2
$$

其中 \(\Delta\Pi\) 是仓位价值的变化，\(\dd S\) 是股价变动（美元），\(\dd\sigma\) 是 IV 变动（以波动率点计，Vanna 和 Volga 用相应单位），\(\dd t\) 是过去的天数。

| 小凯的领口，每张合约 | Delta | Gamma | Vega | 每天 Theta | Vanna | 每天 Charm |
|---|---|---|---|---|---|---|
| +100 股 | +100 | 0 | 0 | 0 | 0 | 0 |
| 买 95 看跌 | −16.3 | +4.30 | +7.07 美元 | −2.17 美元 | −1.14 | +0.33 |
| 卖 105 看涨 | −22.2 | −5.19 | −8.54 美元 | +3.08 美元 | −1.22 | +0.46 |
| **领口合计** | **+61.4** | **−0.89** | **−1.46 美元** | **+0.91 美元** | **−2.36** | **+0.80** |

（Delta、Gamma、Vanna 和 Charm 以股计；Vanna 按每个波动率点。）

> [!EXAMPLE] XYZ +5 美元、IV +5 个点、过了一天
> 领口各项，每张合约：Delta \(61.4 \times 5 = +\$307.2\)；Gamma \(\tfrac12 \times (-0.89) \times 25 = -\$11.1\)；Vega \(-1.46 \times 5 = -\$7.3\)；Theta \(+\$0.9\)；Vanna \(-2.36 \times 5 \times 5 = -\$59.1\)；Volga \(+\$0.6\)。
> $$
> \underbrace{307.2 - 7.3 + 0.9}_{\text{一阶：} 300.8} \;\underbrace{-\,11.1 - 59.1 + 0.6}_{\text{二阶：} -69.6} = \$231.2
> $$
> 完整重估给出 \(\$231.1\)。一阶估计差了 \(\$70\)，而误差的大头是 **Vanna**：上涨和波动率上升一起，把卖出的看涨推向了平值。

对这种幅度的变动，二阶展开非常好用。变动一大，它就失灵：XYZ 跌 10%、IV 降 10 个点时，领口的二阶估计是 \(-\$877\)，精确值却是 \(-\$506\)，因为一路上 Gamma、Vega 和 Vanna 都变了很多。所以风险系统不靠希腊字母做压力测试，而是在每个情景下**全部重新定价**。

### ⑤ 股价 × 波动率矩阵，以及做市商为何盯着 Vanna 和 Charm

**情景矩阵**把股价变动排在一个方向、隐含波动率变动排在另一个方向，在选定的时间点把每条腿重新定价，显示盈亏。没有泰勒级数，也不会漏掉交叉项：每一种组合都精确计算。下面是卖出 95/105 宽跨（各一张），一天之后：

<figure>
<svg viewBox="0 0 640 318" role="img" aria-label="卖出 95/105 宽跨一天后的股价 × 波动率盈亏矩阵">
<text x="355" y="16" text-anchor="middle" class="fx-t-b">一天后的 XYZ 股价</text>
<text x="145" y="34" text-anchor="middle" class="fx-t-sm">90</text>
<text x="215" y="34" text-anchor="middle" class="fx-t-sm">95</text>
<text x="285" y="34" text-anchor="middle" class="fx-t-sm">98</text>
<text x="355" y="34" text-anchor="middle" class="fx-t-b">100</text>
<text x="425" y="34" text-anchor="middle" class="fx-t-sm">102</text>
<text x="495" y="34" text-anchor="middle" class="fx-t-sm">105</text>
<text x="565" y="34" text-anchor="middle" class="fx-t-sm">110</text>
<text x="100" y="64" text-anchor="end" class="fx-t-sm">IV +10</text>
<text x="100" y="104" text-anchor="end" class="fx-t-sm">IV +5</text>
<text x="100" y="144" text-anchor="end" class="fx-t-b">IV ±0</text>
<text x="100" y="184" text-anchor="end" class="fx-t-sm">IV −5</text>
<text x="100" y="224" text-anchor="end" class="fx-t-sm">IV −10</text>
<rect x="111" y="41" width="68" height="38" rx="2" class="fx-fill-red"/><text x="145" y="64" text-anchor="middle" class="fx-t-inv">−491</text>
<rect x="181" y="41" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="215" y="64" text-anchor="middle" class="fx-t">−236</text>
<rect x="251" y="41" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="285" y="64" text-anchor="middle" class="fx-t">−171</text>
<rect x="321" y="41" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="355" y="64" text-anchor="middle" class="fx-t">−168</text>
<rect x="391" y="41" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="425" y="64" text-anchor="middle" class="fx-t">−196</text>
<rect x="461" y="41" width="68" height="38" rx="2" class="fx-fill-red"/><text x="495" y="64" text-anchor="middle" class="fx-t-inv">−294</text>
<rect x="531" y="41" width="68" height="38" rx="2" class="fx-fill-red"/><text x="565" y="64" text-anchor="middle" class="fx-t-inv">−580</text>
<rect x="111" y="81" width="68" height="38" rx="2" class="fx-fill-red"/><text x="145" y="104" text-anchor="middle" class="fx-t-inv">−441</text>
<rect x="181" y="81" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="215" y="104" text-anchor="middle" class="fx-t">−157</text>
<rect x="251" y="81" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="285" y="104" text-anchor="middle" class="fx-t">−82</text>
<rect x="321" y="81" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="355" y="104" text-anchor="middle" class="fx-t">−77</text>
<rect x="391" y="81" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="425" y="104" text-anchor="middle" class="fx-t">−106</text>
<rect x="461" y="81" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="495" y="104" text-anchor="middle" class="fx-t">−212</text>
<rect x="531" y="81" width="68" height="38" rx="2" class="fx-fill-red"/><text x="565" y="104" text-anchor="middle" class="fx-t-inv">−523</text>
<rect x="111" y="121" width="68" height="38" rx="2" class="fx-fill-red"/><text x="145" y="144" text-anchor="middle" class="fx-t-inv">−400</text>
<rect x="181" y="121" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="215" y="144" text-anchor="middle" class="fx-t">−86</text>
<rect x="251" y="121" width="68" height="38" rx="2" class="fx-area-bad"/><text x="285" y="144" text-anchor="middle" class="fx-t">−2</text>
<rect x="321" y="121" width="68" height="38" rx="2" class="fx-area-ok"/><text x="355" y="144" text-anchor="middle" class="fx-t-b">+5</text>
<rect x="391" y="121" width="68" height="38" rx="2" class="fx-area-bad"/><text x="425" y="144" text-anchor="middle" class="fx-t">−25</text>
<rect x="461" y="121" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="495" y="144" text-anchor="middle" class="fx-t">−138</text>
<rect x="531" y="121" width="68" height="38" rx="2" class="fx-fill-red"/><text x="565" y="144" text-anchor="middle" class="fx-t-inv">−475</text>
<rect x="111" y="161" width="68" height="38" rx="2" class="fx-fill-red"/><text x="145" y="184" text-anchor="middle" class="fx-t-inv">−369</text>
<rect x="181" y="161" width="68" height="38" rx="2" class="fx-area-bad"/><text x="215" y="184" text-anchor="middle" class="fx-t">−25</text>
<rect x="251" y="161" width="68" height="38" rx="2" class="fx-fill-green" fill-opacity="0.4"/><text x="285" y="184" text-anchor="middle" class="fx-t">+63</text>
<rect x="321" y="161" width="68" height="38" rx="2" class="fx-fill-green" fill-opacity="0.4"/><text x="355" y="184" text-anchor="middle" class="fx-t">+72</text>
<rect x="391" y="161" width="68" height="38" rx="2" class="fx-area-ok"/><text x="425" y="184" text-anchor="middle" class="fx-t">+43</text>
<rect x="461" y="161" width="68" height="38" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="495" y="184" text-anchor="middle" class="fx-t">−73</text>
<rect x="531" y="161" width="68" height="38" rx="2" class="fx-fill-red"/><text x="565" y="184" text-anchor="middle" class="fx-t-inv">−438</text>
<rect x="111" y="201" width="68" height="38" rx="2" class="fx-fill-red"/><text x="145" y="224" text-anchor="middle" class="fx-t-inv">−351</text>
<rect x="181" y="201" width="68" height="38" rx="2" class="fx-area-ok"/><text x="215" y="224" text-anchor="middle" class="fx-t">+30</text>
<rect x="251" y="201" width="68" height="38" rx="2" class="fx-fill-green" fill-opacity="0.4"/><text x="285" y="224" text-anchor="middle" class="fx-t">+106</text>
<rect x="321" y="201" width="68" height="38" rx="2" class="fx-fill-green" fill-opacity="0.4"/><text x="355" y="224" text-anchor="middle" class="fx-t">+113</text>
<rect x="391" y="201" width="68" height="38" rx="2" class="fx-fill-green" fill-opacity="0.4"/><text x="425" y="224" text-anchor="middle" class="fx-t">+93</text>
<rect x="461" y="201" width="68" height="38" rx="2" class="fx-area-bad"/><text x="495" y="224" text-anchor="middle" class="fx-t">−13</text>
<rect x="531" y="201" width="68" height="38" rx="2" class="fx-fill-red"/><text x="565" y="224" text-anchor="middle" class="fx-t-inv">−416</text>
<rect x="320" y="120" width="70" height="40" rx="3" class="fx-line-thick"/>
<text x="242" y="265" text-anchor="end" class="fx-t-sm">颜色深浅 = 金额大小：</text>
<rect x="250" y="255" width="22" height="13" rx="2" class="fx-area-bad"/><text x="278" y="265" class="fx-t-sm">低于 50 美元</text>
<rect x="370" y="255" width="22" height="13" rx="2" class="fx-fill-red" fill-opacity="0.4"/><text x="398" y="265" class="fx-t-sm">50–250 美元</text>
<rect x="490" y="255" width="22" height="13" rx="2" class="fx-fill-red"/><text x="518" y="265" class="fx-t-sm">高于 250 美元</text>
<text x="20" y="290" class="fx-t-sm">每个宽跨的盈亏（美元；卖 1 张 95 看跌 + 1 张 105 看涨，收入 122 美元），起始剩 30 天，σ 20%，r 4%。</text>
<text x="20" y="308" class="fx-t-sm">描边的格子是“什么都没发生”：一天的 Theta，+5 美元。</text>
</svg>
<figcaption>图 3 · 卖出宽跨的股价 × 波动率矩阵。唯一的绿色是“什么都没发生、波动率下降”附近的一座小岛；四周全是红色，最糟的是四角——股价大动、同时波动率上升，这正是真实抛售中会发生的组合。看这一张图，比看任何单个希腊字母都更能了解这个仓位。</figcaption>
</figure>

对小凯的领口，同一张矩阵传递的信息更微妙。每行看三格就够了：

| 小凯的领口，一天后每张合约的盈亏 | XYZ 90 美元 | XYZ 100 美元 | XYZ 110 美元 |
|---|---|---|---|
| IV 降 10 个点 | −506 美元 | +17 美元 | +482 美元 |
| IV 不变 | −458 美元 | +1 美元 | +425 美元 |
| IV 升 10 个点 | −391 美元 | −11 美元 | +344 美元 |

下跌时，波动率上升**帮**了领口（买入的看跌活了过来）；上涨时，波动率上升**拖累**了领口（卖出的看涨活了过来）。波动率效应的符号随股价方向翻转——这就是 Vanna，直接从矩阵上读出来。

**做市商为什么在乎。**净卖出期权给客户的做市商，持有的是客户希腊字母的反面，并且持续对冲 Delta（[[delta-hedging]]）。Charm 意味着，即使什么都不动，对冲也得每天调整——到了月度到期日，大量未平仓合约同时到期，这些每日调整可能很大。Vanna 意味着隐含波动率一变，也会逼出对冲交易：事件后 IV 崩塌时，做市商的对冲会朝一个可以预期的方向移动。市场评论把这些叫作 **Vanna 流和 Charm 流**，并把它们和期权到期前后的价格漂移联系起来。机制是真实的；它到底能推动价格多少，则**有争议**，因为做市商的真实仓位并不公开，各种估计都依赖“谁多谁空”的假设（[[dealer-gamma]]）。

> [!WARN] 二阶希腊字母同样是“局部”的
> Vanna、Volga 和 Charm 和 Delta 一样，都是在今天的股价、波动率和日期上测量的。它们能改善中等幅度变动的估计，在大幅变动时会失灵（上面领口那个 −10%、−10 个点的格子）。对重要的决策——保证金、压力测试、仓位限额——要用完整重估的矩阵（[[portfolio-risk]]），把希腊字母当作解释“每一格为什么长这样”的工具。

原理层到此结束。你现在能给期权定价（[[black-scholes]]），读懂它的波动率（[[implied-vol]]），并把它的风险拆成一阶和二阶的部分——一条腿一条腿地拆，或者整本仓位一起拆。下一层会用上这一切来构建策略，从最简单的开始：买入看涨或看跌，并选择行权价和到期日（[[long-options]]）。

## @analogy
想象在一条弯弯曲曲的山路上开车。

- **Delta** 是车速，**Gamma** 是你踩油门的力度——随着道路（股价）展开，车速变化得有多快。
- **Vanna** 是**天气变化**时车速的变化。下雨（波动率升高）时，同样的油门在上坡和下坡产生的车速不一样——就像更高的 IV 会抬高虚值看涨的 Delta、压低实值看涨的 Delta。
- **Charm** 是**时钟**：即使脚完全不动，车也会随着旅程接近终点而自己慢下来——临近到期，虚值期权的 Delta 会流向零。
- **Volga** 是车对天气的敏感度本身如何随暴雨加剧而变化：毛毛雨几乎没影响，大雨里每多一毫米雨，操控的变化都更大。
- **情景矩阵**是一条试车道。与其看着仪表盘去预测“暴雨加急弯”时车会怎样，不如把每一种雨量和弯道的组合都实际开一遍，记下发生了什么。

这个类比在哪里失灵：司机自己决定踩多少油门；期权持有者却不能选择希腊字母。它们由合约、市场价格和日历决定——你能选择的只是持有哪些期权、怎样对冲。

## @misconceptions
- **“二阶希腊字母是学术玩具，只有做市商才用得上。”** —— 任何持有期权过周末、或经历 IV 变动的人都暴露在其中。小凯的领口只是一个简单的散户仓位，一个周末没交易就少了约 8 股等效敞口。
- **“我的仓位 Delta 中性，股价怎么动都伤不到我。”** —— Delta 中性只在今天的股价、波动率和日期上成立。股价动了 Gamma 会改变 Delta，波动率动了 Vanna 会改变它，时间过去了 Charm 会改变它——而在关键的日子里，三者会一起动。
- **“Vanna 和 Volga 差不多，都是‘Vega 那一类’。”** —— Vanna 连接股价与波动率：IV 变动时它改变你的 Delta（股价变动时改变你的 Vega）。Volga 连接波动率与它自己：IV 变动时它改变你的 Vega。风险逆转主要是 Vanna，买入宽跨主要是 Volga。
- **“二阶泰勒展开对压力测试足够准。”** —— 对中等变动很好（XYZ +5%、IV +5：\(\$231.2\) 对精确的 \(\$231.1\)），对大变动错得离谱（XYZ −10%、IV −10：\(-\$877\) 对 \(-\$506\)）。压力测试要重新定价。
- **“Vanna 流和 Charm 流能解释到期日附近的每一次行情。”** —— 对冲机制是真实的，但做市商的仓位是估计出来的，不是观察到的，效应的大小也有争议。把这类说法当作假设，而不是事实。

## @takeaways
- 二阶希腊字母度量一阶希腊字母怎样变动：Vanna（\(\partial\Delta/\partial\sigma\)）、Volga（\(\partial\nu/\partial\sigma\)）和 Charm（\(\partial\Delta/\partial t\)）最重要；Speed 和 Color 描述 Gamma 的漂移。
- 波动率上升把 Delta 拉向平值的数值；时间流逝把它们推向 0 或 ±1——所以即使什么都没交易，对冲也会漂移。
- Volga 在平值处接近零、在两翼为正：买入虚值期权就拥有对波动率的凸性，卖出两翼的人会在 IV 跳升时为此买单。
- 希腊字母可以在整本仓位中相加；二阶展开加入 \(\text{vanna}\,\dd S\,\dd\sigma\) 这样的交叉项，它们往往承担了一阶估计的大部分误差。
- 做真正的风险决策时，要在股价 × 波动率矩阵上把整个仓位重新定价；用希腊字母来解释矩阵，而不是取代它。

## @quiz
1. 小凯卖出的 30 天 105 看涨 Delta 为 0.222，Vanna 为每个波动率点 +0.012。IV 升 5 个点，XYZ 不动。小凯空头的 Delta 会怎样？
   - [ ] 降到约 0.16，因为波动率升高会降低所有 Delta
   - [ ] 保持 0.222，因为股价没动
   - [x] 升到约 0.28（精确值 0.275），所以这张卖出的看涨相当于更多股
   - [ ] 跳到 0.5，因为波动率会让所有期权变成平值
   > \(0.222 + 5 \times 0.012 \approx 0.28\)。波动率更高，收在 105 以上更有可能，所以虚值看涨更像股票。波动率把 Delta 拉向平值的数值，但不会一下拉到 0.5。
2. 下面哪张期权的 Volga（Vega 对 IV 的敏感度）最大？
   - [x] 一张约一个标准差虚值的 30 天看涨
   - [ ] 一张 30 天平值看涨
   - [ ] 一张深度实值、Delta 为 0.99 的 30 天看涨
   - [ ] 一股股票
   > Volga \(= \nu\,d_1 d_2/\sigma\)，平值时接近零（\(d_1 d_2 \approx 0\)），在 Vega 本身消失的地方也很小；它在两翼、大约离平值一个标准差处最大。股票根本没有 Vega。
3. 周五，一本做了 Delta 对冲的仓位卖出了虚值看涨。到周一，什么都没交易，股价和 IV 都没变。Charm 会对对冲产生什么影响？
   - [ ] 没有影响：股价和 IV 不变，对冲依然正确
   - [ ] 仓位的 Delta 变得更空，做市商必须买入股票
   - [ ] 只有 Gamma 会变，价格不动 Delta 就不会变
   - [x] 卖出的看涨的 Delta 向 0 衰减，仓位的 Delta 变得更多头，做市商要卖出股票才能保持中性
   > 时间把虚值期权的 Delta 推向零。仓位是这些 Delta 的空头，它们缩小时，仓位的净 Delta 上升（原本用多头股票对冲），所以对冲要卖出股票。这种每日的再对冲，就是所谓的“Charm 流”。
4. 小凯的领口在一天里遇到 XYZ 涨 5 美元、IV 升 5 个点。一阶希腊字母估计为 +300.8 美元，精确盈亏为 +231.1 美元。差额主要来自哪一项？
   - [ ] Theta，因为过去了一天
   - [x] Vanna，因为上涨和波动率上升一起把卖出的 105 看涨推向了平值
   - [ ] Rho，因为领口里有长期期权
   - [ ] Volga，因为 IV 上升了
   > 交叉项 \(\text{vanna}\,\dd S\,\dd\sigma = -2.36 \times 5 \times 5 \approx -\$59\) 是最大的修正；Gamma 约 \(-\$11\)，Volga 约 \(+\$0.6\)。合计 \(\$231.2\)。
5. 为什么风险经理做压力测试时，用完整重估的股价 × 波动率矩阵，而不是二阶希腊字母展开？
   - [ ] 因为希腊字母不能在仓位之间相加
   - [ ] 因为矩阵忽略了会干扰希腊字母的交叉效应
   - [x] 因为希腊字母是局部的：大幅变动时 Gamma、Vega 和 Vanna 一路都在变，展开可能偏得很远
   - [ ] 因为监管机构禁止使用希腊字母
   > 希腊字母可以相加，矩阵也不是忽略交叉效应，而是把它们精确算进去。问题在于局部性：领口在 −10%、−10 个波动率点时，二阶估计是 \(-\$877\)，精确值是 \(-\$506\)。逐格重新定价就避开了这个问题。

## @further
- [Greeks (finance) — 维基百科](https://en.wikipedia.org/wiki/Greeks_(finance)) — Vanna、Volga、Charm、Speed、Color 等的定义与 Black-Scholes 公式。
- [Cboe：0DTEs Decoded——持仓趋势与市场影响](https://www.cboe.com/insights/posts/0-dt-es-decoded-positioning-trends-and-market-impact) — 交易所（利益相关方）对期权对冲流量在标普 500 日内流动性中所占分量的估计。
- [Dim, Eraker & Vilkov — 0DTEs: Trading, Gamma Risk and Volatility Propagation（SSRN）](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4692190) — 学术研究：做市商的期权对冲会放大还是抑制日内波动。
- [期权行业委员会（OIC）教育中心](https://www.optionseducation.org/) — 关于希腊字母与仓位风险的免费资料。

## @next
原理层在这里结束：你能给期权定价，读懂它的波动率，也能把它的风险拆开。现在来用它。下一层从最简单的交易开始——买入看涨或看跌——以及每个买家都要面对的第一个真实决定：选哪个行权价、哪个到期日？答案原来就藏在 Delta、Theta 和 Vega 里。
