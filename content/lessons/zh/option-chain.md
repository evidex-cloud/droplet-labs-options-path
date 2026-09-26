---
id: option-chain
prereqs: contract-specs, moneyness, payoff-diagrams, probability-ev
demo: option-chain
---

# 读懂期权链：一张报价表里的全部信息

## @hook
打开任何一个券商软件，输入股票代码，点“期权”，满屏数字扑面而来。看起来像乱码，其实是一张很规整的表：每个行权价、每个到期日、买要付多少、卖能收多少、市场预期会波动多大，全在上面。认识五列数字，这面“数字墙”就变成一张地图。

## @bridge
到目前为止，我们是在纸面上认识合约的：它的条款（[[contract-specs]]）、行权价相对现价的位置（[[moneyness]]）、到期时的形状（[[payoff-diagrams]]）和它的胜率（[[probability-ev]]）。“市场与交易机制”这一阶段走进真实市场，而市场给你看的第一样东西就是**期权链**（option chain）。这一课回答一个问题：屏幕上的每个数字在告诉你什么？它会碰到第 ② 个观念（无套利：每一行都能看到平价关系）和第 ③ 个观念（波动率：期权链给每张合约都报出一个隐含波动率）。

## @intuition
小凯持有 100 股 XYZ，成本 100 美元，心里有两件事：买一张 30 天期、行权价 95 的看跌期权当保险，再卖一张 30 天期、行权价 105 的看涨期权赚点收入。小凯打开券商软件，点开 30 天到期的那一页，看到的是这样一张表（仅作示意；XYZ 是虚构股票，σ = 20%，r = 4%）：

<figure>
<svg viewBox="0 0 720 300" role="img" aria-label="标注过的 XYZ 期权链（30 天到期）">
<text x="158" y="22" text-anchor="middle" class="fx-t-b">看涨 CALLS · 买入的权利</text>
<text x="360" y="22" text-anchor="middle" class="fx-t-b">行权价</text>
<text x="562" y="22" text-anchor="middle" class="fx-t-b">看跌 PUTS · 卖出的权利</text>
<rect x="10" y="64" width="295" height="60" rx="4" class="fx-area-blue"/>
<rect x="415" y="154" width="295" height="60" rx="4" class="fx-area-blue"/>
<rect x="8" y="124" width="704" height="30" rx="4" class="fx-hl"/>
<text x="40" y="50" text-anchor="middle" class="fx-t-sm">未平仓</text>
<text x="100" y="50" text-anchor="middle" class="fx-t-sm">IV</text>
<text x="155" y="50" text-anchor="middle" class="fx-t-sm">Δ</text>
<text x="215" y="50" text-anchor="middle" class="fx-t-sm">买价 Bid</text>
<text x="275" y="50" text-anchor="middle" class="fx-t-sm">卖价 Ask</text>
<text x="445" y="50" text-anchor="middle" class="fx-t-sm">买价 Bid</text>
<text x="505" y="50" text-anchor="middle" class="fx-t-sm">卖价 Ask</text>
<text x="565" y="50" text-anchor="middle" class="fx-t-sm">Δ</text>
<text x="620" y="50" text-anchor="middle" class="fx-t-sm">IV</text>
<text x="680" y="50" text-anchor="middle" class="fx-t-sm">未平仓</text>
<line x1="10" y1="58" x2="710" y2="58" class="fx-grid"/>
<text x="40" y="84" text-anchor="middle" class="fx-t fx-mono">1,210</text><text x="100" y="84" text-anchor="middle" class="fx-t fx-mono">20.0%</text><text x="155" y="84" text-anchor="middle" class="fx-t fx-mono">0.97</text><text x="215" y="84" text-anchor="middle" class="fx-t fx-mono">10.25</text><text x="275" y="84" text-anchor="middle" class="fx-t fx-mono">10.45</text>
<text x="360" y="84" text-anchor="middle" class="fx-t-b">90</text>
<text x="445" y="84" text-anchor="middle" class="fx-t fx-mono">0.05</text><text x="505" y="84" text-anchor="middle" class="fx-t fx-mono">0.07</text><text x="565" y="84" text-anchor="middle" class="fx-t fx-mono">−0.03</text><text x="620" y="84" text-anchor="middle" class="fx-t fx-mono">20.0%</text><text x="680" y="84" text-anchor="middle" class="fx-t fx-mono">7,730</text>
<text x="40" y="114" text-anchor="middle" class="fx-t fx-mono">3,480</text><text x="100" y="114" text-anchor="middle" class="fx-t fx-mono">20.0%</text><text x="155" y="114" text-anchor="middle" class="fx-t fx-mono">0.84</text><text x="215" y="114" text-anchor="middle" class="fx-t fx-mono">5.75</text><text x="275" y="114" text-anchor="middle" class="fx-t fx-mono">5.85</text>
<text x="360" y="114" text-anchor="middle" class="fx-t-b">95</text>
<text x="445" y="114" text-anchor="middle" class="fx-t fx-mono">0.50</text><text x="505" y="114" text-anchor="middle" class="fx-t fx-mono">0.52</text><text x="565" y="114" text-anchor="middle" class="fx-t fx-mono">−0.16</text><text x="620" y="114" text-anchor="middle" class="fx-t fx-mono">20.0%</text><text x="680" y="114" text-anchor="middle" class="fx-t fx-mono">10,150</text>
<text x="40" y="144" text-anchor="middle" class="fx-t fx-mono">8,950</text><text x="100" y="144" text-anchor="middle" class="fx-t fx-mono">20.0%</text><text x="155" y="144" text-anchor="middle" class="fx-t fx-mono">0.53</text><text x="215" y="144" text-anchor="middle" class="fx-t fx-mono">2.42</text><text x="275" y="144" text-anchor="middle" class="fx-t fx-mono">2.48</text>
<text x="360" y="144" text-anchor="middle" class="fx-t-b">100</text>
<text x="445" y="144" text-anchor="middle" class="fx-t fx-mono">2.09</text><text x="505" y="144" text-anchor="middle" class="fx-t fx-mono">2.15</text><text x="565" y="144" text-anchor="middle" class="fx-t fx-mono">−0.47</text><text x="620" y="144" text-anchor="middle" class="fx-t fx-mono">20.0%</text><text x="680" y="144" text-anchor="middle" class="fx-t fx-mono">6,880</text>
<text x="40" y="174" text-anchor="middle" class="fx-t fx-mono">12,400</text><text x="100" y="174" text-anchor="middle" class="fx-t fx-mono">20.0%</text><text x="155" y="174" text-anchor="middle" class="fx-t fx-mono">0.22</text><text x="215" y="174" text-anchor="middle" class="fx-t fx-mono">0.70</text><text x="275" y="174" text-anchor="middle" class="fx-t fx-mono">0.72</text>
<text x="360" y="174" text-anchor="middle" class="fx-t-b">105</text>
<text x="445" y="174" text-anchor="middle" class="fx-t fx-mono">5.30</text><text x="505" y="174" text-anchor="middle" class="fx-t fx-mono">5.40</text><text x="565" y="174" text-anchor="middle" class="fx-t fx-mono">−0.78</text><text x="620" y="174" text-anchor="middle" class="fx-t fx-mono">20.0%</text><text x="680" y="174" text-anchor="middle" class="fx-t fx-mono">1,940</text>
<text x="40" y="204" text-anchor="middle" class="fx-t fx-mono">6,020</text><text x="100" y="204" text-anchor="middle" class="fx-t fx-mono">20.0%</text><text x="155" y="204" text-anchor="middle" class="fx-t fx-mono">0.06</text><text x="215" y="204" text-anchor="middle" class="fx-t fx-mono">0.13</text><text x="275" y="204" text-anchor="middle" class="fx-t fx-mono">0.15</text>
<text x="360" y="204" text-anchor="middle" class="fx-t-b">110</text>
<text x="445" y="204" text-anchor="middle" class="fx-t fx-mono">9.70</text><text x="505" y="204" text-anchor="middle" class="fx-t fx-mono">9.90</text><text x="565" y="204" text-anchor="middle" class="fx-t fx-mono">−0.94</text><text x="620" y="204" text-anchor="middle" class="fx-t fx-mono">20.0%</text><text x="680" y="204" text-anchor="middle" class="fx-t fx-mono">620</text>
<rect x="176" y="161" width="66" height="20" rx="4" class="fx-line-hl"/><text x="179" y="176" class="fx-t-hl">①</text>
<rect x="466" y="101" width="66" height="20" rx="4" class="fx-line-hl"/><text x="469" y="116" class="fx-t-hl">②</text>
<text x="215" y="256" text-anchor="middle" class="fx-t-hl">① 小凯按买价卖出 105 看涨：0.70</text>
<text x="505" y="256" text-anchor="middle" class="fx-t-hl">② 小凯按卖价买入 95 看跌：0.52</text>
<text x="20" y="282" class="fx-t-sm">蓝色阴影 = 实值 · 高亮行 = 平值（S = 100）· 所有价格都是每股价格，一张合约 × 100</text>
</svg>
<figcaption>图 1 · XYZ 30 天期权链。行权价从上到下排在中间一列；看涨在左半边，看跌在右半边，所以同一行放着行权价相同的一张看涨和一张看跌。买入按卖价（ask）成交，卖出按买价（bid）成交。高亮行以上的看涨是实值，以下的看跌是实值。</figcaption>
</figure>

知道往哪看之后，四件事一眼就能看出来。

- **一行，一个行权价。**标着 100 的那一行，左半边是 100 看涨，右半边是 100 看跌。横着读一行，就是在同一个价位上比较两种权利。
- **两个价格，不是一个。**每张合约都有一个**买价**（bid，此刻有人愿意付给你的最高价）和一个**卖价**（ask，此刻有人愿意卖给你的最低价）。你买，付卖价；你卖，收买价。
- **阴影告诉你价内还是价外。**行权价低于 100 的看涨已经是实值，行权价高于 100 的看跌也是（[[moneyness]]）。高亮的那一行是平值。
- **所有价格都是每股价格。**105 看涨的买价 0.70，意味着一张合约是 \(0.70 \times 100 = \$70\)。

> [!KAI] 小凯的两笔单子，直接从期权链上读出来
> 买保险：95 看跌的卖价是 0.52，一张合约花 \(0.52 \times 100 = \$52\)（合理的“中间价”是 0.51，也就是课程标准里的 51 美元）。
> 赚收入：105 看涨的买价是 0.70，卖出一张收 \(0.70 \times 100 = \$70\)。
> 两笔合起来是一个领口策略（collar），每股净收 \(0.70 - 0.52 = 0.18\) 美元，比标准的 0.20 美元少一点——因为小凯在每条腿上都“让出”了半个价差。接下来的两课 [[liquidity-spreads]] 和 [[orders]] 会讲怎样把这部分省回来。

> [!THINK] 100 看涨和 100 看跌都是正好平值，为什么看涨卖 2.45、看跌只卖 2.12？
> 先预测，再打开答案。
> ---
> 钱有时间价值。持有看涨而不是股票，你那 100 美元可以在银行里多放 30 天，所以看涨里含着这笔利息，看跌里没有。看跌看涨平价把它说得很精确：\(C - P = S - Ke^{-rT} = 100 - 99.67 = 0.33\)，而 \(2.45 - 2.12 = 0.33\)。看涨和看跌相等的地方，是行权价等于**远期价** 100.33 的地方，不是现价。

这一课拆成六块：

- **① 版面**：行、左右两半、到期页签
- **② 买价、卖价、中间价、最新价**：哪个才算“价格”
- **③ 其余几列**：成交量、未平仓量、IV 与 Delta
- **④ 横着读一行：平价关系**：期权链会自己核对自己
- **⑤ 整张表告诉你什么**：隐含波动幅度与 25 Delta 行权价
- **⑥ 2026 年的期权链**：它变得有多大

## @mechanics
### ① 版面

期权链是把三个维度折叠进一张二维表：

- **到期日**用顶部的页签来选（XYZ 有 7 天、30 天、60 天，还有每月第三个星期五的标准月度到期，见 [[contract-specs]]）。一个页签，一张表。
- **行权价**从上到下排在中间一列，通常是固定间距（100 美元左右的股票常见 2.5 或 5 点一档）。
- **看涨还是看跌**看左右：看涨在左半边，看跌在右半边。有些软件改成上下排列（看涨在上、看跌在下），或者只显示一边，道理完全一样。

大多数平台会给实值的格子上色，并在当前股价处画一条线或高亮一行。表很长的时候，先找现价那条线：它上面都是更低的行权价（实值看涨、虚值看跌），下面都是更高的行权价。

| 列 | 含义 | XYZ 30 天 100 看涨 |
|---|---|---|
| 买价 Bid | 此刻买方愿付的最高价 | 2.42 |
| 卖价 Ask | 此刻卖方愿接受的最低价 | 2.48 |
| 中间价 Mid / 标记价 Mark | 买价与卖价的正中间 | 2.45 |
| 最新价 Last | 最近一笔成交的价格（可能很旧） | 例如 2.60 |
| 成交量 Volume | 今天成交了多少张 | 例如 4,300 |
| 未平仓量 Open interest | 仍未了结的合约张数（每晚更新） | 8,950 |
| 隐含波动率 IV | 从价格反推出来的波动率 | 20.0% |
| Δ | Delta：股价动 1 美元，期权动多少 | 0.53 |

### ② 买价、卖价、中间价、最新价

买价和卖价来自做市商和其他交易者挂着的限价单（[[market-makers]]）。夹在两者之间的，是屏幕上最有用的一个数：

$$
\text{中间价} = \frac{\text{买价} + \text{卖价}}{2}, \qquad \text{价差} = \text{卖价} - \text{买价}
$$

其中**中间价**（很多软件叫“标记价”，mark）是对合理价值最快的估计；**价差**（spread）是你按卖价买进、再按买价卖出时要让出去的那部分。

> [!EXAMPLE] 100 看涨换算成美元
> 买价 2.42，卖价 2.48：\(\text{中间价} = (2.42 + 2.48)/2 = 2.45\)，\(\text{价差} = 0.06\)。
> 按卖价买一张要花 \(2.48 \times 100 = \$248\)，它的合理价值是 \(2.45 \times 100 = \$245\)。差的 \(\$3\) 是半个价差，也就是“立刻成交”的代价。如果马上按买价卖回去，只能拿回 \(\$242\)：一买一卖一个来回，佣金之前就先花掉 \(0.06 \times 100 = \$6\)。

**最新价**（last）是最近一笔成交的价格。交易活跃的合约，它落在买价和卖价之间；冷门的合约，它可能是几个小时前的。假如 100 看涨上一笔成交是上午 10:05 的 2.60，那时 XYZ 在 100.30 美元，那么在报价已经是 2.42 / 2.48 的此刻，这个数对你能以什么价成交毫无参考意义。

> [!WARN] 两个最常见的误读
> 把**最新价**当成现价，以及忘了 **× 100**。110 看涨报价 0.14，一张是 \(\$14\)，不是 14 美分；以 2.48 买 10 张 100 看涨是 \(2.48 \times 100 \times 10 = \$2{,}480\)。

为什么 95 看涨报 5.75 / 5.85（五分钱一档），95 看跌却报 0.50 / 0.52（一分钱一档）？因为**最小报价单位**（tick size）。美国的“一分钱报价计划”（Penny Interval Program）2020 年转为永久制度：纳入计划的期权，价格低于 3.00 美元时按 0.01 美元跳动，3.00 美元及以上按 0.05 美元跳动；SPY、QQQ、IWM 的期权在任何价位都按一分钱报价（截至 2026 年）。所以大多数标的上，贵的期权最小价差也更宽。

### ③ 其余几列：成交量、未平仓量、IV 与 Delta

**成交量**数的是今天成交了多少张；**未平仓量**（open interest，OI）数的是截至前一个交易日收盘，还有多少张合约没了结。两者都大，通常意味着报价紧、进出容易。它们的变化方式不同（一笔成交可能让 OI 增加、减少或不变），这是下一课 [[liquidity-spreads]] 的内容。

**IV（隐含波动率）**是让 Black-Scholes 公式正好算出这张期权中间价的那个波动率，每张合约都有自己的 IV。我们的示意表是一刀切的 20%；真实的股票期权链上，低行权价看跌的 IV 会*高于*高行权价看涨的 IV，这就是后面 [[smile-skew]] 要讲的偏斜。IV 让不同行权价、不同到期日的价格可以放在一起比较：一张 0.14 美元的期权和一张 5.80 美元的期权，用美元很难比，用波动率一比就清楚（[[implied-vol]]）。

**Delta（Δ）**告诉你股价每动 1 美元，期权价格动多少：100 看涨的 0.53 意味着大约 53 美分。它还可以粗略地当作“到期实值的可能性”来看，其中的注意事项在 [[delta]] 里讲。很多期权链还会加上 Gamma、Theta、Vega 几列，它们在 [[greeks-map]] 里登场。

### ④ 横着读一行：平价关系

每一行都放着行权价和到期日都相同的一张看涨和一张看跌，它们被看跌看涨平价（[[put-call-parity]]）绑在一起：

$$
C - P = S - K e^{-rT}
$$

其中 \(C\)、\(P\) 是看涨和看跌的价格，\(S\) 是股价，\(K\) 是行权价，\(r\) 是无风险利率，\(T\) 是离到期的年数（这个简单形式适用于不分红股票上的欧式期权；XYZ 的美式期权与它非常接近）。

> [!EXAMPLE] 核对 XYZ 期权链上的两行
> 行权价 100 这一行：\(C - P = 2.45 - 2.12 = 0.33\)，而 \(S - Ke^{-rT} = 100 - 100\,e^{-0.04 \times 30/365} = 100 - 99.67 = 0.33\)。✓
> 行权价 105 这一行：\(C - P = 0.71 - 5.37 = -4.66\)，而 \(100 - 105\,e^{-0.04 \times 30/365} = 100 - 104.66 = -4.66\)。✓
> 如果改用报价的中间价（0.71 和 5.35），差两分钱，远在价差之内：平价关系在“交易成本”的精度内成立。

<figure>
<svg viewBox="0 0 700 280" role="img" aria-label="看涨与看跌价格随行权价变化，在远期价处相交">
<defs><marker id="option-chain-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="50" y1="230" x2="680" y2="230" class="fx-axis" marker-end="url(#option-chain-ah2)"/>
<line x1="50" y1="240" x2="50" y2="20" class="fx-axis" marker-end="url(#option-chain-ah2)"/>
<polyline points="60,26.3 80,39.5 100,52.8 120,65.9 140,79.0 160,92.0 180,104.7 200,117.2 220,129.4 240,141.2 260,152.4 280,163.0 300,172.9 320,181.9 340,190.1 360,197.3 380,203.7 400,209.1 420,213.7 440,217.4 460,220.5 480,222.9 500,224.8 520,226.3 540,227.4 560,228.2 580,228.7 600,229.2 620,229.4 640,229.6 660,229.8" class="fx-line-blue"/>
<polyline points="60,230.0 80,229.9 100,229.9 120,229.7 140,229.5 160,229.2 180,228.7 200,227.9 220,226.8 240,225.3 260,223.2 280,220.5 300,217.1 320,212.8 340,207.7 360,201.7 380,194.7 400,186.9 420,178.2 440,168.7 460,158.4 480,147.6 500,136.2 520,124.4 540,112.2 560,99.7 580,87.0 600,74.1 620,61.1 640,48.0 660,34.8" class="fx-line-bad"/>
<line x1="366.6" y1="60" x2="366.6" y2="230" class="fx-line fx-dash"/>
<circle cx="366.6" cy="199.5" r="5" class="fx-fill-ink"/>
<text x="374" y="72" class="fx-t-b">远期价 F = 100.33</text>
<text x="374" y="90" class="fx-t-sm">这里看涨 = 看跌（各 2.29）</text>
<text x="118" y="42" class="fx-t-blue">看涨价格</text>
<text x="560" y="44" class="fx-t-bad">看跌价格</text>
<text x="60" y="250" text-anchor="middle" class="fx-t-sm">85</text>
<text x="160" y="250" text-anchor="middle" class="fx-t-sm">90</text>
<text x="260" y="250" text-anchor="middle" class="fx-t-sm">95</text>
<text x="360" y="250" text-anchor="middle" class="fx-t-sm">100</text>
<text x="460" y="250" text-anchor="middle" class="fx-t-sm">105</text>
<text x="560" y="250" text-anchor="middle" class="fx-t-sm">110</text>
<text x="660" y="250" text-anchor="middle" class="fx-t-sm">115</text>
<text x="670" y="272" text-anchor="end" class="fx-t-sm">行权价 K（XYZ = 100，30 天，σ 20%，r 4%）</text>
<text x="44" y="30" text-anchor="end" class="fx-t-sm">价格</text>
</svg>
<figcaption>图 2 · 顺着期权链往下读，看涨越来越便宜，看跌越来越贵。两条曲线在行权价等于远期价（100.33）的地方相交，而不是在现价处：在每个行权价上，两者的差都是 \(S - Ke^{-rT}\)，这是关于 \(K\) 的一条直线。</figcaption>
</figure>

正因为有平价关系，一张深度实值看涨的报价单独看往往说明不了什么：它的合理价值被同一行的看跌加上 \(S - Ke^{-rT}\) 钉死了。如果某一行对平价的偏离超过了价差和成本，做市商会立刻把这个缺口交易掉（[[synthetics-boxes]]）。

### ⑤ 整张表告诉你什么

除了单张合约，期权链还回答交易者每天都会问的两个问题。

**市场给这段时间定了多大的波动？**把平值看涨和平值看跌一起买下（叫“跨式”，straddle）。股价往任何一个方向走得越远，它赚得越多，所以它的价格就是市场对“到期前典型波动幅度”的估计：

$$
\text{隐含波动幅度} \approx C_{\text{平值}} + P_{\text{平值}} \approx 0.8\,S\sigma\sqrt{T}
$$

其中 \(C_{\text{平值}}\)、\(P_{\text{平值}}\) 是平值看涨与看跌的中间价，\(0.8\,S\sigma\sqrt{T}\) 是跨式的近似价值（0.8 约等于 \(\sqrt{2/\pi}\)，即标准正态变动幅度的平均大小）。

> [!EXAMPLE] XYZ 未来 30 天的隐含波动幅度
> \(2.45 + 2.12 = 4.57\)：市场定价的典型波动幅度大约是 \(\pm 4.57\) 美元，也就是到期前 4.6% 左右。核对一下：\(0.8 \times 100 \times 0.20 \times \sqrt{30/365} = 0.8 \times 5.73 \approx 4.59\)。切到 7 天页签，跨式是 \(1.14 + 1.07 = 2.21\)；切到 60 天，是 \(3.56 + 2.91 = 6.47\)。时间变成 4 倍，波动幅度不是 4 倍，而是 2 倍左右：波动幅度随 \(\sqrt{T}\) 增长（[[random-walk]]）。

**哪个行权价是“25 Delta”？**专业交易者习惯用 Delta 而不是价格来称呼行权价，因为同一个 Delta 在任何股票上意思都一样。在 XYZ 30 天、行权价 1 美元一档的期权链上，97 看跌的 \(\Delta = -0.27\)，96 看跌是 \(-0.21\)，所以“25 Delta 看跌”大约就是 97 这个行权价。25 Delta 风险逆转之类的偏斜报价，正是建立在这个基础上（[[smile-skew]]）。

::demo[option-chain-find]

### ⑥ 2026 年的期权链

期权链已经变得非常长。截至 2026 年 9 月，SPX 每个工作日都有一个到期日（2022 年补上了周二和周四，凑齐了周一到周五）；从 2026 年 1 月 26 日起，九个交易最活跃的个股和 ETF（包括 TSLA、NVDA、AAPL 和 IBIT）在每周五的周期权之外，还可以挂出周一和周三到期的合约。一个热门标的因此可能有几十个到期页签、上百个行权价，其中大多数很冷清。下一课告诉你，怎样找出真正能交易的那几个。

> [!FACT] 有多少交易穿过这些屏幕
> 2025 年美国上市期权连续第六年创纪录：全年约 150 亿张合约，日均约 6,100 万张（Cboe，2026 年 1 月）。截至 2026 年 8 月，今年日均约 7,080 万张，比 2025 年高约 23%（OCC，2026 年 9 月）。每一笔成交，都是在一张像图 1 这样的期权链上，跨过了某个买价或卖价。

在券商软件背后，美国所有期权报价都汇入同一个综合行情源（OPRA）。专业的数据工作——从清理交叉或过期的报价，到用平价关系反推远期价——是 [[options-data]] 的主题。

## @analogy
期权链就像**机场里的外币兑换牌价板**。每一行是一种货币（一个行权价），每种货币有两个价格：“我们买入”（买价，你卖给柜台能拿到的）和“我们卖出”（卖价，你从柜台买要付的）。两者之差是柜台的饭碗；越冷门的货币差价越大，正如深度虚值期权和冷清的行权价价差最宽。报纸上的“汇率”是中间价，没人真按它成交，但它告诉你这种货币值多少。而一块积了灰的牌子上写的“最新成交”，可能是早上的，那时汇率还没变。

期权链比兑换牌价板多两层。第一，每一行有*两种*产品——看涨和看跌——它们被平价关系焊在一起，所以牌子的一边会替另一边“把关”。第二，有一种隐藏的通用货币：隐含波动率。就像游客把所有价格换算成美元再比较，交易者把每个期权价格换算成 IV，看哪个行权价、哪个到期日便宜或贵。

这个类比在一处不成立：兑换柜台自己同时定买卖两个价，而期权链上的买价和卖价来自许多互相竞争的做市商和交易者，而且随着股价每秒都在变。

## @misconceptions
- **“最新价就是我要付的价。”** —— 最新价是最近一笔成交，可能是几个小时前的。你此刻能成交的是卖价（买入时）或买价（卖出时）；中间价才是合理估计。
- **“报价 0.71 就是花 71 美分。”** —— 股票和指数期权的价格都是每股价格，一张合约要 × 100，所以 0.71 是每张 \(\$71\)。
- **“100 看涨和 100 看跌都是平值，价格应该一样。”** —— 两者相等的地方是远期价，不是现价。利率 4% 时，30 天看涨正好贵 \(0.33\)，也就是 \(S - Ke^{-rT}\)。
- **“隐含波动率高，说明市场看好股价上涨。”** —— IV 衡量的是波动的*幅度*，不是方向。同一行权价的看涨和看跌，IV 是同一个。
- **“某个行权价的未平仓量很大，说明股价会走到那里。”** —— 未平仓量只是数还没了结的合约。它告诉你流动性和持仓集中在哪里，不告诉你股价往哪走。

## @takeaways
- 期权链是每个到期日一张表：行权价在中间，看涨在左半边，看跌在右半边，实值的格子有阴影。
- 买入按卖价、卖出按买价；中间价 \((\text{买价} + \text{卖价})/2\) 是合理估计，所有价格一张合约都要 × 100。
- IV 和 Delta 两列把价格翻译成波动率和敏感度，让不同行权价、不同到期日可以放在同一把尺子上比较。
- 每一行都满足平价关系 \(C - P = S - Ke^{-rT}\)；平值跨式的价格就是市场的隐含波动幅度（XYZ 30 天约 4.57 美元）。

## @quiz
1. XYZ 105 看涨报价买价 0.70、卖价 0.72。小凯用市价单卖出一张，大约能收到多少？
   - [ ] 72 美元
   - [x] 70 美元
   - [ ] 0.70 美元
   - [ ] 71 美元，即中间价
   > 市价卖出拿到的是买价：\(0.70 \times 100 = \$70\)。卖价 0.72 是买方要付的；中间价 0.71 是合理估计，限价单也许能拿到，市价单拿不到。0.70 美元是忘了 × 100。
2. 30 天、行权价 100 这一行，看涨中间价 2.45，看跌中间价 2.12（r = 4%）。0.33 的差说明什么？
   - [ ] 看涨贵了 0.33，应该卖出
   - [ ] 市场预期 XYZ 会上涨 0.33
   - [x] 它等于 \(S - Ke^{-rT} = 100 - 99.67\)，正是平价关系要求的
   - [ ] 这是这一行的买卖价差
   > 平价关系：\(C - P = S - Ke^{-rT}\)。利率 4% 时，30 天后的 100 美元现值是 99.67 美元，所以看涨比看跌贵 0.33。这是利息，不是预测，也不是错价。
3. 100 看涨显示最新价 2.60，买价 2.42，卖价 2.48，而上一笔成交之后 XYZ 已经往下走了一些。此刻这张看涨合理价值的最佳估计是多少？
   - [ ] 2.60，最新成交价
   - [x] 2.45，中间价
   - [ ] 2.48，卖价
   - [ ] 2.54，最新价与卖价的平均
   > 实时报价的中间价 \((2.42 + 2.48)/2 = 2.45\) 反映的是当前股价。最新价是在 XYZ 更高的时候成交的，已经过期。
4. XYZ 30 天平值跨式售价 4.57（看涨 2.45 + 看跌 2.12）。这说明什么？
   - [ ] XYZ 会上涨 4.57 美元
   - [ ] 发生大幅波动的概率是 4.57%
   - [ ] 期权被高估了 4.57 美元
   - [x] 市场定价的到期前典型波动幅度约为 ±4.6 美元（约 4.6%）
   > 跨式赚的是波动幅度的绝对大小，所以它的价格近似于预期波动幅度，约为 \(0.8\,S\sigma\sqrt{T} = 0.8 \times 5.73\)。它不说方向。
5. 为什么 XYZ 95 看涨报 5.75 / 5.85（五分钱一档），95 看跌却报 0.50 / 0.52（一分钱一档）？
   - [x] 按“一分钱报价计划”，价格在 3.00 美元及以上的期权按 0.05 美元跳动，低于 3.00 美元按 0.01 美元跳动
   - [ ] 看涨永远按五分钱报价，看跌按一分钱报价
   - [ ] 实值期权的流动性比虚值期权差
   - [ ] 做市商对看涨多收了钱
   > 最小报价单位取决于价格高低：计划内大多数品种低于 3.00 美元按 0.01，3.00 美元及以上按 0.05（SPY、QQQ、IWM 任何价位都按一分钱）。贵的那张看涨因此至少有五分钱的价差。

## @further
- [OIC：期权行业委员会教育中心](https://www.optionseducation.org/) — 行业教育机构的免费课程和术语表，包括如何读报价。
- [Penny increments（OIC）](https://www.optionseducation.org/news/penny-increments) — 为什么大多数期权报价按一分或五分钱跳动。
- [Characteristics and Risks of Standardized Options（OCC）](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — 每个美国期权交易者都会收到的官方风险披露文件。
- [The State of the Options Industry 2025（Cboe）](https://www.cboe.com/insights/posts/the-state-of-the-options-industry-2025) — 成交量、纪录，以及交易集中在哪里。

## @next
期权链给小凯的每张合约都报了两个价格，而两者之间的差要花真金白银。多宽算太宽？成交量和未平仓量又怎样分辨一张热闹的合约和一座“鬼城”？下一课来量一量流动性。
