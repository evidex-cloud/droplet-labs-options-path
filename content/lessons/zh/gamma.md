---
id: gamma
prereqs: linear-vs-convex, greeks-map, delta
demo: gamma
---

# Gamma：Delta 的加速度

## @hook
Gamma 是股价变动时 Delta 变得有多快。正是它，让对冲后的多头期权不管股价往上跳还是往下跳都赚钱；让到期前最后一天变得格外剧烈；也让一张卖出的期权可能在一次跳空里亏掉两个月的收入。小凯的 30 天看涨期权 Gamma 是 0.069；只剩一天时是 0.381。

## @bridge
[[delta]] 讲了 Delta 沿着一条 S 形曲线滑动，而 Delta 对冲只管到下一次变动。在 [[greeks-map]] 里，\(\tfrac12\Gamma(\dd S)^2\) 这一项悄悄给小凯的那一天加了 0.14 美元。更早在 [[linear-vs-convex]] 里我们说过，期权是**凸**的——顺风时赚得越来越快，逆风时亏得越来越慢。这一课给这种弯曲一个数字，并追踪它随时间怎么变。它落在第 ① 个观念（形状：Gamma **就是**凸性）和第 ④ 个观念（风险：多 Gamma 和空 Gamma 是两种截然相反的活法）。

## @intuition
小凯的 30 天 XYZ 100 看涨期权，Delta 0.534，**Gamma 0.069**（XYZ 100 美元，隐含波动率 20%，利率 4%；数字仅作示例）。Gamma 只回答一个问题：**XYZ 动 1 美元，Delta 动多少？**

- XYZ 涨到 101 美元 → Delta 约增加 0.069，变成 **0.603**（精确值 0.602）。
- XYZ 跌到 99 美元 → Delta 约减少 0.069，变成 0.465（精确值 0.464）。

如果 Delta 是速度，Gamma 就是加速度。按合约算，小凯这张期权每涨 1 美元多出约 **7 股**的 Delta，每跌 1 美元少 7 股。这正是持有期权时想要的：股价往你这边走，敞口变大；往反方向走，敞口变小。

现在把方向剥掉。在 [[delta]] 里，我们持有一张看涨、同时卖出 53.4 股。瞬间上涨 2 美元，这一对组合赚 0.135 美元；瞬间下跌 2 美元，赚 0.140 美元。Gamma 把两者都预测到了：

$$
\tfrac12\,\Gamma\,(\dd S)^2 = \tfrac12 \times 0.069 \times 2^2 = 0.139
$$

其中 \(\dd S\) 是股价变动，\(\Gamma\) 是变动前的 Gamma。一张合约约 14 美元，**不管 XYZ 往哪边跳**。因为变动被平方了，方向无所谓，只看大小。

<figure>
<svg viewBox="0 0 640 230" role="img" aria-label="Delta 对冲后的多头看涨期权，盈亏随瞬间股价变动呈笑脸形">
<defs><marker id="gamma-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<polygon points="60,190 60,53 71,64 82,74 93,84 103,93 114,102 125,111 136,119 147,127 158,135 168,142 179,148 190,154 201,160 212,165 223,170 233,174 244,178 255,181 266,184 277,186 288,188 298,189 309,190 320,190 331,190 342,189 353,188 363,186 374,184 385,181 396,178 407,175 418,171 428,166 439,161 450,156 461,150 472,144 483,138 493,131 504,124 515,116 526,108 537,100 548,92 558,83 569,74 580,65 580,190" class="fx-area-ok"/>
<line x1="50" y1="190" x2="615" y2="190" class="fx-axis" marker-end="url(#gamma-ah)"/>
<line x1="320" y1="205" x2="320" y2="20" class="fx-axis" marker-end="url(#gamma-ah)"/>
<polyline points="60,47 71,59 82,70 93,81 103,91 114,101 125,110 136,118 147,127 158,134 168,141 179,148 190,154 201,160 212,165 223,170 233,174 244,178 255,181 266,184 277,186 288,188 298,189 309,190 320,190 331,190 342,189 353,188 363,186 374,184 385,181 396,178 407,174 418,170 428,165 439,160 450,154 461,148 472,141 483,134 493,127 504,118 515,110 526,101 537,91 548,81 558,70 569,59 580,47" class="fx-line-blue fx-dash"/>
<polyline points="60,53 71,64 82,74 93,84 103,93 114,102 125,111 136,119 147,127 158,135 168,142 179,148 190,154 201,160 212,165 223,170 233,174 244,178 255,181 266,184 277,186 288,188 298,189 309,190 320,190 331,190 342,189 353,188 363,186 374,184 385,181 396,178 407,175 418,171 428,166 439,161 450,156 461,150 472,144 483,138 493,131 504,124 515,116 526,108 537,100 548,92 558,83 569,74 580,65" class="fx-line-thick"/>
<circle cx="407" cy="175" r="4" class="fx-fill-green"/>
<circle cx="233" cy="174" r="4" class="fx-fill-green"/>
<text x="415" y="196" class="fx-t-sm">+2：+0.135</text>
<text x="170" y="196" class="fx-t-sm">−2：+0.140</text>
<text x="60" y="208" text-anchor="middle" class="fx-t-sm">−6</text>
<text x="147" y="208" text-anchor="middle" class="fx-t-sm">−4</text>
<text x="493" y="208" text-anchor="middle" class="fx-t-sm">+4</text>
<text x="580" y="208" text-anchor="middle" class="fx-t-sm">+6</text>
<text x="314" y="137" text-anchor="end" class="fx-t-sm">0.5</text>
<text x="314" y="80" text-anchor="end" class="fx-t-sm">1.0</text>
<text x="612" y="224" text-anchor="end" class="fx-t-sm">XYZ 瞬间变动 dS（美元）</text>
<text x="330" y="32" class="fx-t-sm">每股盈亏</text>
<text x="380" y="60" class="fx-t">— 精确重新定价</text>
<text x="380" y="78" class="fx-t-blue">- - ½ Γ dS²</text>
</svg>
<figcaption>图 1 · 一张 30 天 XYZ 100 看涨期权，用 53.4 股空头对冲，瞬间变动后重新定价。Delta 去掉了直线部分，剩下的是一张笑脸。±3 美元以内，抛物线 \(\tfrac12\Gamma(\dd S)^2\) 几乎完全准确；再往外，真实曲线弯得少一些，因为离行权价越远，Gamma 自己越小。</figcaption>
</figure>

自己动手试试：对冲掉 Delta，拨动股价，看看剩下什么。

::demo[gamma-convexity]

Gamma 不是均匀分布的。它**集中在行权价附近**，并且**越临近到期越大**。平值的 100 看涨期权，还剩 180 天时 Gamma 0.028，30 天 0.069，7 天 0.144，最后一天 **0.381**。在最后一天，50 美分的变动就能让 Delta 从 0.32 摆到 0.69。

> [!THINK] 那么，是不是**每一张**期权的 Gamma 临近到期都会爆炸？
> 想一张离平值很远的期权——比如还剩 7 天、行权价 110 的看涨，XYZ 在 100 美元。
> ---
> 不是。它的 Gamma 只有 **0.0004**——几乎为零。只剩一周，要到 110 美元得涨三个多标准差，Delta 被钉在 0 附近，几乎不变。临近到期，Gamma 会**堆到股价所在的那个行权价附近**，从其他行权价上流走。“Gamma 爆炸”说的只是平值期权。

> [!KAI] 小凯既多 Gamma，也空 Gamma
> 小凯单独买的那张 100 看涨是**多 Gamma**：每张每 1 美元 +6.9 个 Delta。可小凯的备兑看涨（100 股 + 卖出 105 看涨）是**空 Gamma**：\(-100 \times 0.052 = -5.2\)（每 1 美元）。股票没有 Gamma，所以整个头寸的 Gamma 就是那张卖出看涨的。如果 XYZ 大涨，备兑看涨的 Delta 反而**变小**——股价在狂奔时，小凯的上涨敞口在消退。这就是 [[covered-call]] 封顶上涨空间的 Gamma 视角。

这一课拆成五块：

- **① Gamma 是什么**：公式，以及为什么看涨看跌共用它
- **② 凸性盈亏**：\(\tfrac12\Gamma(\dd S)^2\) 与美元 Gamma
- **③ Gamma 住在哪里**：行权价附近、临近到期时
- **④ 多 Gamma 与空 Gamma**：两种相反的活法
- **⑤ 今天市场里的 Gamma**：0DTE、做市商与争论

## @mechanics
### ① Gamma 是什么

Gamma 是期权价值对股价的二阶导数——Delta 曲线的斜率。在 Black-Scholes（无股息）里：

$$
\Gamma = \frac{\partial \Delta}{\partial S} = \frac{\partial^2 V}{\partial S^2} = \frac{\varphi(d_1)}{S\,\sigma\sqrt{T}}, \qquad \varphi(x) = \frac{1}{\sqrt{2\pi}}\,e^{-x^2/2}
$$

其中 \(\varphi\) 是标准正态密度（钟形曲线的高度），\(d_1\) 与 [[delta]] 里的相同，\(S\) 是股价，\(\sigma\) 是波动率，\(T\) 是离到期的年数。分母 \(S\sigma\sqrt{T}\) 是到期前“一个标准差”的变动有多少美元。

> [!EXAMPLE] 小凯的看涨期权
> \(d_1 = 0.086\)，所以 \(\varphi(0.086) = 0.3975\)。一个标准差的变动是 \(S\sigma\sqrt{T} = 100 \times 0.20 \times \sqrt{30/365} = 5.734\)。于是
> $$
> \Gamma = \frac{0.3975}{5.734} = 0.0693
> $$
> 用“拨一下、重新定价”验证：101 美元时 Delta 0.6024，99 美元时 0.4644，所以 \(\Gamma \approx (0.6024 - 0.4644)/2 = 0.069\)。按合约算，每 1 美元 \(0.0693 \times 100 = 6.93\) 股的 Delta 变化。

**同一行权价、同一到期日的看涨和看跌，Gamma 相同。** 按看跌看涨平价，它们的 Delta 在任何股价上都正好差 1，所以两条 Delta 曲线的斜率完全一样。30 天 100 看跌的 Gamma 也是 0.069。**买入看跌就是多 Gamma**，和买入看涨一样。

公式还说明：多头期权的 Gamma 永远为正，因为 \(\varphi > 0\)、\(S\sigma\sqrt{T} > 0\)。持有任何普通期权——看涨或看跌——都是持有凸性；卖出一张，就是做空凸性。

### ② 凸性盈亏

[[greeks-map]] 的展开式告诉我们，Delta 那一项被对冲掉之后，下一块盈亏就是 \(\tfrac12\Gamma(\dd S)^2\)。对冲后的 30 天看涨：

| 瞬间变动 \(\dd S\) | 精确的对冲后盈亏 | \(\tfrac12\Gamma(\dd S)^2\) | 每张（精确） |
|---|---|---|---|
| ±1 | +0.034 / +0.035 | 0.035 | 约 +3.5 美元 |
| ±2 | +0.135 / +0.140 | 0.139 | 约 +14 美元 |
| ±3 | +0.298 / +0.313 | 0.312 | 约 +30 美元 |
| ±5 | +0.786 / +0.848 | 0.867 | 约 +80 美元 |
| ±10 | +2.639 / +2.973 | 3.466 | 约 +264 / +297 美元 |

（每组第一个数是上涨，第二个是下跌。）几美元以内的变动，估算非常准。大变动时估算偏高，因为 Gamma 是在 100 美元处量的，股价离行权价越远，它越小。

“每 1 美元的 Gamma”对 20 美元的股票和 2,000 点的指数意义完全不同，所以交易员常把它标准化。**美元 Gamma** 衡量股价变动 1% 时，你多得多少美元的 Delta：

$$
\Gamma_{\$} = \underbrace{\Gamma \times 0.01\,S}_{\text{涨 1\% 时 Delta 的变化}} \times \underbrace{S}_{\text{股价}} \times \underbrace{100}_{\text{合约乘数}} = \frac{\Gamma S^2}{100} \times 100
$$

其中 \(0.01\,S\) 是 1% 变动对应的美元数，所以 \(\Gamma \times 0.01\,S\) 是涨 1% 时 Delta 增加多少股；再乘以 \(S\) 把股数换成美元，100 是合约乘数。小凯的看涨期权：\(\tfrac{0.0693 \times 100^2}{100} \times 100 = \$693\)。XYZ 涨 1% 后，光是 Gamma 就给每张合约增加约 693 美元的美元 Delta。有了美元 Gamma，交易台才能把 20 美元和 900 美元的股票上的弯曲加在一起。

### ③ Gamma 住在哪里

**随股价看**，Gamma 是一个以行权价为中心的小山包（图 2）。深度实值或深度虚值时，Delta 被钉在 1 或 0 附近，几乎不动，所以 Gamma 接近零。（严格说，因为对数正态的形状，山顶略低于行权价——30 天看涨在约 99.2 美元处；日常使用说“平值”就对了。）

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="7 天、30 天、180 天的 Gamma 随股价变化">
<defs><marker id="gamma-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="50" y1="220" x2="615" y2="220" class="fx-axis" marker-end="url(#gamma-ah2)"/>
<line x1="60" y1="228" x2="60" y2="15" class="fx-axis" marker-end="url(#gamma-ah2)"/>
<line x1="330" y1="25" x2="330" y2="220" class="fx-line fx-dash"/>
<polyline points="60,217 69,216 78,215 87,214 96,213 105,212 114,210 123,209 132,207 141,205 150,204 159,202 168,200 177,198 186,196 195,195 204,193 213,191 222,190 231,189 240,188 249,187 258,186 267,185 276,185 285,185 294,185 303,185 312,186 321,186 330,187 339,188 348,189 357,190 366,191 375,193 384,194 393,195 402,197 411,198 420,199 429,201 438,202 447,203 456,205 465,206 474,207 483,208 492,209 501,210 510,211 519,212 528,213 537,213 546,214 555,215 564,215 573,216 582,216 591,217 600,217" class="fx-line-blue"/>
<polyline points="60,220 69,220 78,220 87,220 96,220 105,220 114,220 123,220 132,220 141,220 150,220 159,220 168,220 177,219 186,219 195,218 204,216 213,214 222,211 231,206 240,200 249,193 258,185 267,176 276,166 285,157 294,149 303,143 312,139 321,137 330,138 339,141 348,146 357,153 366,161 375,169 384,178 393,185 402,192 411,199 420,204 429,208 438,211 447,214 456,216 465,217 474,218 483,219 492,219 501,219 510,220 519,220 528,220 537,220 546,220 555,220 564,220 573,220 582,220 591,220 600,220" class="fx-line-thick"/>
<polyline points="60,220 69,220 78,220 87,220 96,220 105,220 114,220 123,220 132,220 141,220 150,220 159,220 168,220 177,220 186,220 195,220 204,220 213,220 222,220 231,220 240,220 249,219 258,218 267,213 276,204 285,185 294,156 303,119 312,82 321,56 330,49 339,64 348,94 357,130 366,163 375,188 384,204 393,213 402,217 411,219 420,220 429,220 438,220 447,220 456,220 465,220 474,220 483,220 492,220 501,220 510,220 519,220 528,220 537,220 546,220 555,220 564,220 573,220 582,220 591,220 600,220" class="fx-line-bad"/>
<text x="54" y="224" text-anchor="end" class="fx-t-sm">0</text>
<text x="54" y="177" text-anchor="end" class="fx-t-sm">0.04</text>
<text x="54" y="129" text-anchor="end" class="fx-t-sm">0.08</text>
<text x="54" y="82" text-anchor="end" class="fx-t-sm">0.12</text>
<text x="54" y="34" text-anchor="end" class="fx-t-sm">0.16</text>
<text x="150" y="238" text-anchor="middle" class="fx-t-sm">80</text>
<text x="240" y="238" text-anchor="middle" class="fx-t-sm">90</text>
<text x="330" y="238" text-anchor="middle" class="fx-t-b">K = 100</text>
<text x="420" y="238" text-anchor="middle" class="fx-t-sm">110</text>
<text x="510" y="238" text-anchor="middle" class="fx-t-sm">120</text>
<text x="612" y="254" text-anchor="end" class="fx-t-sm">XYZ 价格 S</text>
<text x="345" y="50" class="fx-t-bad">7 天：0.144，尖峰</text>
<text x="370" y="132" class="fx-t">30 天：0.069</text>
<text x="440" y="190" class="fx-t-blue">180 天：0.028，平缓</text>
<text x="72" y="22" class="fx-t-sm">Gamma Γ</text>
</svg>
<figcaption>图 2 · XYZ 100 看涨期权的 Gamma 随股价变化。时间越少，同样的总弯曲被挤进越窄越高的尖峰：180 天是一座矮丘，7 天是一根针。在 90 或 110 美元处，7 天期权几乎没有 Gamma。</figcaption>
</figure>

**随时间看**，平值 Gamma 按“时间平方根的倒数”增长。平值时 \(d_1 \approx 0\)，所以 \(\varphi(d_1) \approx 0.4\)，于是

$$
\Gamma_{\text{平值}} \approx \frac{0.4}{S\,\sigma\sqrt{T}}
$$

其中 \(0.4 \approx 1/\sqrt{2\pi}\)。时间缩短到 1/30，Gamma 约放大 \(\sqrt{30} \approx 5.5\) 倍：从 30 天的 0.069 到 1 天的 0.381。

<figure>
<svg viewBox="0 0 640 240" role="img" aria-label="六个到期日的平值 Gamma">
<line x1="60" y1="200" x2="610" y2="200" class="fx-axis"/>
<rect x="80" y="40" width="60" height="160" rx="3" class="fx-bad"/>
<rect x="170" y="139" width="60" height="61" rx="3" class="fx-hl"/>
<rect x="260" y="171" width="60" height="29" rx="3" class="fx-hl"/>
<rect x="350" y="183" width="60" height="17" rx="3" class="fx-box2"/>
<rect x="440" y="188" width="60" height="12" rx="3" class="fx-box2"/>
<rect x="530" y="192" width="60" height="8" rx="3" class="fx-box2"/>
<text x="110" y="32" text-anchor="middle" class="fx-t-b">0.381</text>
<text x="200" y="131" text-anchor="middle" class="fx-t-b">0.144</text>
<text x="290" y="163" text-anchor="middle" class="fx-t-b">0.069</text>
<text x="380" y="175" text-anchor="middle" class="fx-t-b">0.040</text>
<text x="470" y="180" text-anchor="middle" class="fx-t-b">0.028</text>
<text x="560" y="184" text-anchor="middle" class="fx-t-b">0.019</text>
<text x="110" y="218" text-anchor="middle" class="fx-t">1 天</text>
<text x="200" y="218" text-anchor="middle" class="fx-t">7 天</text>
<text x="290" y="218" text-anchor="middle" class="fx-t">30 天</text>
<text x="380" y="218" text-anchor="middle" class="fx-t">90 天</text>
<text x="470" y="218" text-anchor="middle" class="fx-t">180 天</text>
<text x="560" y="218" text-anchor="middle" class="fx-t">1 年</text>
<text x="600" y="30" text-anchor="end" class="fx-t-sm">XYZ 100 看涨，S = 100，σ 20%</text>
</svg>
<figcaption>图 3 · 不同到期日的平值 Gamma。最后一天的 Gamma 是 30 天期权的 5.5 倍、1 年期权的 20 倍。短期期权集中了弯曲——也集中了对冲的痛苦。</figcaption>
</figure>

对**不在平值**的期权，临近到期时时间的作用正好相反。105 看涨的 Gamma：60 天 0.044，30 天 0.052，7 天 0.033，最后一天为零。临近到期，Gamma **迁移到股价所在的地方**，别处都消失了。

波动率的作用和时间类似，因为两者都通过 \(\sigma\sqrt{T}\) 起作用：平值时，波动率越高 Gamma 越**低**（分布更宽，弯曲被摊开了）；远离平值时，波动率越高 Gamma 反而可能越高。

### ④ 多 Gamma 与空 Gamma

**多 Gamma**（你持有期权）会改变对冲的手感。XYZ 上涨后，你的 Delta 变大了，要保持中性就得**卖出**股票——在更高的价格卖。XYZ 下跌后，Delta 变小，你**买入**股票——在更低的价格买。给多 Gamma 头寸做再平衡，就是**逢涨卖、逢跌买**，每一个来回锁定一小笔利润。这就是 Gamma 剥头皮的发动机（[[delta-hedging]]）。

> [!EXAMPLE] 一个来回：多 Gamma
> 小凯持有一张 30 天看涨，在 100 美元处用 53.4 股空头对冲。XYZ 涨到 102 美元：期权 Delta 变成 0.667，对冲要扩大到 66.7 股——在 102 美元再卖 13.3 股。XYZ 又回到 100 美元：Delta 回到 0.534——在 100 美元把这 13.3 股买回来。期权回到原点（忽略时间流逝），股票交易赚了 \(13.3 \times (102 - 100) = \$26.6\)。Gamma 对这两段各 2 美元的变动预测约 \(2 \times 13.9 = \$27.7\)。对面的空 Gamma 对冲者做的正好相反——102 美元买、100 美元卖——亏掉差不多同样的钱。

**空 Gamma**（你卖出了期权）是镜像。上涨后你得**高价买入**，下跌后得**低价卖出**，每个来回锁定一小笔亏损。卖方事先拿到了补偿——权利金，按天以 Theta 的形式收进来。

空 Gamma 最危险的是**跳空**：变动快到来不及再平衡。假设某做市商卖出一张 30 天 100 看涨，用 53.4 股对冲，XYZ 因消息高开 10 美元。期权涨了 7.98 美元，股票只赚了 5.34 美元：对冲后的头寸每股亏 \(\$2.64\)，**每张 264 美元**。按每天 4.36 美元的 Theta 算，这一次跳空吃掉了约 **60 天**的时间收入。

> [!WARN] 空 Gamma：小而稳定的收益，罕见而巨大的亏损
> 做了 Delta 对冲的空头期权，遇到任何大幅变动——涨或跌——都会亏，而且亏损随变动的**平方**增长：跳空 10 美元的损失约是变动 2 美元的 20 倍，而不是 5 倍。大多数日子 Theta 收入占上风；少数几天决定一整年。为跳空而不是为平均的一天来确定空 Gamma 头寸的规模（[[position-sizing]]、[[variance-risk-premium]]）。

### ⑤ 今天市场里的 Gamma

Gamma 是这门课后面反复回到短期期权的原因。

- **Gamma 与 Theta 是一枚硬币。** 没人会白送弯曲。多头期权每天付的 Theta，在 Black-Scholes 里正好是它的 Gamma 的公平价格——下一课会把它变成 XYZ 约 1.05 美元的“每日盈亏平衡变动”（[[theta]]）。
- **做市商 Gamma。** 做市商整体净空 Gamma 时，他们的对冲是追涨杀跌，可能放大行情；净多 Gamma 时，对冲是逆势操作，会抑制波动。对这种“做市商头寸”的估算被广泛关注，也被广泛争论（[[dealer-gamma]]）。
- **当天到期的期权。** 几小时后就到期的期权，平值 Gamma 是所有期权里最极端的（[[zero-dte]]）。

> [!FACT] 短期 Gamma，截至 2026 年年中
> 当天到期（0DTE）期权在 **2026 年 7 月占 SPX 期权成交量的 66.2%**，创纪录（Cboe）。它们的 Gamma 会不会让指数不稳，存在争议。Cboe——作为挂牌这个产品的交易所，是利益相关方——在 2025 年 5 月估算，SPX 0DTE 的做市商净 Gamma 对冲最多约占 **SPX 每日流动性的 0.2%**；一篇学术工作论文（Dim、Eraker 与 Vilkov）发现，做市商在 0DTE 上的净 Gamma 平均为正。英格兰银行的一篇员工博客（2024 年 12 月）讨论了当天到期期权可能加剧脆弱性的渠道。公允的概括是：目前的证据并未显示 0DTE 的 Gamma 是系统性的崩盘触发器，但资金流高度集中，这个问题仍然开放。同样，2021 年 1 月 GameStop 的暴涨常被描述为“Gamma 挤压”，但 SEC 员工报告（2021 年 10 月）并未找到其证据。

## @analogy
想象一颗弹珠放在一条弯曲的轨道上。

**多 Gamma 是山谷里的弹珠。** 往左推、往右推，它都会沿着坡往上滚——不管往哪边走都在“升高”。谷壁越陡，轻轻一推升得越高。这就是 \(\tfrac12\Gamma(\dd S)^2\)：两个方向的变动都带来收益，而且按推力的平方增长。

**空 Gamma 是平衡在山顶的弹珠。** 什么都不发生时很舒服，可任何方向的一推都让它往下滚，推得越猛，滚得远得多。

**时间会重塑轨道。** 长期期权是一个又宽又浅的碗：平缓的弯曲铺在很大的范围上。临近到期，碗收窄成行权价附近的一个尖锐的 V。停在 V 底的弹珠（最后一天的平值期权）极其敏感；停在远处一面直墙上的弹珠（深度虚值期权）根本感觉不到弯曲。

类比失效的地方：真正的弹珠待在山谷里不用花钱。期权里的山谷要收租金。持有弯曲每天都要付 Theta，弹珠的收益能不能跑赢租金，取决于股价实际动了多少——这是 [[theta]] 的主题。

## @misconceptions
- **“Gamma 对我永远是好事。”** —— 只有持有期权时才是。期权卖方是空 Gamma：对冲之后，任何方向的大幅变动都要花钱，而且代价随变动的平方增长。
- **“长期期权时间多，所以 Gamma 更大。”** —— 正好相反。平值时，越临近到期 Gamma 越大：XYZ 1 年 0.019，30 天 0.069，1 天 0.381。
- **“所有期权的 Gamma 临近到期都会爆炸。”** —— 只有接近平值的才会。7 天 110 看涨的 Gamma 是 0.0004；如果 XYZ 仍在 100 美元，105 看涨的 Gamma 在最后一天降到零。
- **“看跌期权的 Gamma 是负的。”** —— 买入看跌的 Gamma 是**正**的，和同行权价、同到期日的看涨完全相同。Gamma 的符号取决于买还是卖，不取决于看涨还是看跌。
- **“我做了 Delta 对冲，大行情伤不到我。”** —— 做了 Delta 对冲的空头期权，遇到任何方向的大行情都会亏：30 天 XYZ 看涨上，一次 10 美元的跳空每张约亏 264 美元。

## @takeaways
- Gamma 是股价每动 1 美元时 Delta 的变化：\(\Gamma = \varphi(d_1)/(S\sigma\sqrt{T})\)——小凯的 30 天看涨是 0.069，看跌完全相同。
- 对冲掉 Delta 后剩下 \(\tfrac12\Gamma(\dd S)^2\)：对冲后的多头期权在任意方向 2 美元的变动上每张约赚 14 美元。
- Gamma 集中在行权价附近；平值时按 \(1/\sqrt{T}\) 增长：30 天 0.069，1 天 0.381；远离平值的期权临近到期 Gamma 消失。
- 多 Gamma 的再平衡是逢涨卖、逢跌买；空 Gamma 正好相反，并暴露在跳空之下——30 天看涨上一次 10 美元的跳空 ≈ 60 天的 Theta。
- 美元 Gamma（每股 \(\Gamma S^2/100\)）让不同股票的弯曲可以比较；短期（0DTE）期权集中了 Gamma，它们对市场的影响仍有争论。

## @quiz
1. 小凯的 30 天看涨期权 \(\Delta = 0.534\)，\(\Gamma = 0.069\)。XYZ 涨 2 美元，期权的新 Delta 大约是多少？
   - [ ] 0.603
   - [ ] 0.534——到期前 Delta 不会变
   - [x] 约 0.67
   - [ ] 0.138
   > \(0.534 + 0.069 \times 2 = 0.672\)，精确值 0.667。0.603 是涨 1 美元后的 Delta；0.138 是 \(\Gamma \times 2\)，只是变化量本身。
2. 小凯持有一张 30 天看涨，并卖出 53.4 股对冲。XYZ 瞬间跳动 3 美元——不知道是涨还是跌。对冲后的头寸每张大约盈亏多少？
   - [x] 两个方向都约 +31 美元
   - [ ] 涨了 +160 美元，跌了 −160 美元
   - [ ] 零——头寸已经对冲
   - [ ] 两个方向都约 −31 美元
   > \(\tfrac12 \times 0.069 \times 3^2 = 0.31\)（每股），每张约 31 美元（精确：涨 29.8 美元，跌 31.3 美元）。Delta 去掉了方向，多 Gamma 从变动的大小中赚钱。
3. 哪一张期权的 Gamma 最大？（XYZ 100 美元，σ 20%）
   - [ ] 1 年期 100 看涨
   - [ ] 7 天 110 看涨
   - [ ] 30 天 100 看涨
   - [x] 1 天 100 看涨
   > 平值 Gamma 按 \(1/\sqrt{T}\) 增长：1 天 0.381，30 天 0.069，1 年 0.019。7 天 110 看涨在它剩下的时间里太虚值了，Gamma 约 0.0004。
4. 直接买入的 30 天 XYZ 100 **看跌**期权，Gamma 是多少？
   - [ ] −0.069，因为看跌的 Gamma 是负的
   - [x] +0.069，和看涨一样
   - [ ] 0，因为看跌只有 Delta
   - [ ] +0.466，即看跌 Delta 的绝对值
   > 同一行权价的看涨与看跌 Delta 正好差 1，所以两条 Delta 曲线斜率相同。任何多头普通期权都是多 Gamma。
5. 某做市商卖出一张 30 天 XYZ 100 看涨，做了 Delta 对冲，每天收 4.36 美元的 Theta。XYZ 隔夜高开 10 美元。哪个说法最接近？
   - [ ] 对冲让他们完全没事
   - [ ] 他们亏约 4.36 美元，也就是一天的 Theta
   - [x] 他们每张亏约 264 美元——大约 60 天的 Theta
   - [ ] 他们赚钱，因为手里有股票
   > 期权涨了 7.98 美元，53.4 股只赚 5.34 美元：每股亏 \(\$2.64\)，每张 264 美元。空 Gamma 在任何方向的大行情里都亏，亏损与变动的平方成正比。

## @further
- [Greeks (finance): Gamma（维基百科）](https://en.wikipedia.org/wiki/Greeks_(finance)#Gamma) — 公式、美元 Gamma 以及相关的二阶希腊字母。
- [Dim, Eraker & Vilkov, 0DTEs: Trading, Gamma Risk and Volatility Propagation（SSRN）](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4692190) — 关于做市商 0DTE Gamma 与日内波动的证据。
- [Cboe, 0DTEs Decoded: Positioning, Trends, and Market Impact](https://www.cboe.com/insights/posts/0-dt-es-decoded-positioning-trends-and-market-impact) — 交易所自己的分析（利益相关方）。
- [英格兰银行员工博客：Zero-day options and financial market vulnerability](https://bankunderground.co.uk/2024/12/04/zero-day-options-and-financial-market-vulnerability/) — 来自央行博客的担忧观点。
- [SEC Staff Report on Equity and Options Market Structure Conditions in Early 2021](https://www.sec.gov/files/staff-report-equity-options-market-struction-conditions-early-2021.pdf) — GameStop 事件与“Gamma 挤压”之问。

## @next
持有 Gamma 很值钱——那它每天要花多少钱？股价要动多少才能挣回来？对 XYZ 来说，答案是一个数，对每个行权价、每个到期日都一样：每天约 1.05 美元。下一课：[[theta]]。
