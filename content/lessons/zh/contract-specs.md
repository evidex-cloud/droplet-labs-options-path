---
id: contract-specs
prereqs: call-option, put-option
demo: contract-specs
---

# 合约规格：行权价、到期日、权利金与 ×100 乘数

## @hook
下第一笔单之前，小凯得先读懂屏幕上的一行字：`XYZ   261016C00105000`，报价 0.71。这串字符装着五条信息，还有第六条——×100 乘数——哪里都没写，却会把一切放大一百倍。读对了，“0.71”就是花 71 美元买下“按价买入价值 1 万美元的 100 股”的权利；读错了，账就差了整整 100 倍。

## @bridge
[[call-option]] 和 [[put-option]] 定义了两种权利，画出了它们的形状。这一课读它们的“细则”：交易所替每张合约固定了哪些条款，到期日历怎么排，每股报价怎样换算成美元和风险敞口，业内通用的期权代码怎么读，公司拆股时合约会怎样。它服务于第 ④ 个观念——**风险**：一个没算清规模的头寸，是没法管理的。接下来 [[moneyness]] 教你比较不同的行权价；到了 [[option-chain]]，你会一次读完整页这样的合约。

## @intuition
1973 年以前，美国的股票期权都是私下成交的。买卖双方自己商定行权价、到期日和数量，合约只在两人之间有效。想提前了结，就得找回同一个对手再谈一次，所以这个市场一直很小。

上市期权市场只改了一件事：**所有条款都标准化**。存在哪些行权价和到期日、一张合约对应多少股、能怎样和何时行权、如何交割，都由交易所决定，而不是由两个交易者商量。于是两张 XYZ 十月 105 看涨期权完全相同、可以互换：小凯上午从一个陌生人手里买进，下午就能卖给另一个陌生人。清算机构 OCC 为双方担保（[[derivatives]]）。

设想 2026 年 9 月 16 日（星期三）的小凯，离十月的月度到期日正好 30 天。小凯在考虑用手里的 100 股卖出 105 看涨期权——也就是课程开头提到的备兑看涨。券商屏幕上显示：

> XYZ  2026 年 10 月 16 日  105  看涨  —  买价 0.69 · 卖价 0.73

把每一块都拆出来，包括没印出来的：

| 字段 | 小凯的合约 | 含义 |
|---|---|---|
| 标的 | XYZ | 这张期权写在哪只股票上 |
| 类型 | 看涨 | 买入的权利（看跌是卖出的权利） |
| 行权价 | 105 美元 | 行权时的买入价 |
| 到期日 | 2026 年 10 月 16 日（周五） | 十月第三个周五：标准月度到期日 |
| 权利金 | 每股约 0.71 美元（0.69 与 0.73 的中间价） | 期权的价格，按**每股**报价 |
| 乘数 | 100（没印出来） | 一张合约 = 100 股 |
| 行权方式 | 美式（没印出来） | 到期前任何交易日都可以行权 |
| 交割方式 | 实物交割（没印出来） | 行权时真的交付 100 股 |

> [!KAI] 一张合约对小凯意味着什么
> 卖出一张十月 105 看涨期权，今天收入 \(0.71 \times 100 = \$71\)。作为交换，小凯承诺在被指派时按 105 美元交出 **100 股**——正好是小凯手里的 100 股。正因为这样对得上，备兑看涨才是每 100 股卖一张（[[covered-call]]）。如果小凯卖了两张，第二个 100 股就是承诺了却并不持有。

乘数值得加粗写。期权屏幕上的每个价格都是每股价，可没人能只买“一股份”的期权。最小单位是一张合约，所以**花费 = 报价 × 100 × 张数**；不管期权看起来多便宜，每张合约控制的股票敞口都是 100 股。

<figure>
<svg viewBox="0 0 660 230" role="img" aria-label="OCC 期权代码 XYZ 261016C00105000 的结构">
<text x="330" y="24" text-anchor="middle" class="fx-t-b">XYZ␣␣␣261016C00105000 —— 21 个字符，四个字段</text>
<rect x="53" y="60" width="156" height="42" rx="6" class="fx-hl"/>
<rect x="209" y="60" width="156" height="42" rx="6" class="fx-blue"/>
<rect x="365" y="60" width="26" height="42" rx="6" class="fx-ok"/>
<rect x="391" y="60" width="208" height="42" rx="6" class="fx-gold"/>
<text x="66" y="87" text-anchor="middle" class="fx-t-b fx-mono">X</text>
<text x="92" y="87" text-anchor="middle" class="fx-t-b fx-mono">Y</text>
<text x="118" y="87" text-anchor="middle" class="fx-t-b fx-mono">Z</text>
<text x="144" y="87" text-anchor="middle" class="fx-t-sm fx-mono">␣</text>
<text x="170" y="87" text-anchor="middle" class="fx-t-sm fx-mono">␣</text>
<text x="196" y="87" text-anchor="middle" class="fx-t-sm fx-mono">␣</text>
<text x="222" y="87" text-anchor="middle" class="fx-t-b fx-mono">2</text>
<text x="248" y="87" text-anchor="middle" class="fx-t-b fx-mono">6</text>
<text x="274" y="87" text-anchor="middle" class="fx-t-b fx-mono">1</text>
<text x="300" y="87" text-anchor="middle" class="fx-t-b fx-mono">0</text>
<text x="326" y="87" text-anchor="middle" class="fx-t-b fx-mono">1</text>
<text x="352" y="87" text-anchor="middle" class="fx-t-b fx-mono">6</text>
<text x="378" y="87" text-anchor="middle" class="fx-t-b fx-mono">C</text>
<text x="404" y="87" text-anchor="middle" class="fx-t-b fx-mono">0</text>
<text x="430" y="87" text-anchor="middle" class="fx-t-b fx-mono">0</text>
<text x="456" y="87" text-anchor="middle" class="fx-t-b fx-mono">1</text>
<text x="482" y="87" text-anchor="middle" class="fx-t-b fx-mono">0</text>
<text x="508" y="87" text-anchor="middle" class="fx-t-b fx-mono">5</text>
<text x="534" y="87" text-anchor="middle" class="fx-t-b fx-mono">0</text>
<text x="560" y="87" text-anchor="middle" class="fx-t-b fx-mono">0</text>
<text x="586" y="87" text-anchor="middle" class="fx-t-b fx-mono">0</text>
<text x="378" y="52" text-anchor="middle" class="fx-t-ok">C = 看涨，P = 看跌</text>
<line x1="56" y1="112" x2="206" y2="112" class="fx-line"/>
<line x1="212" y1="112" x2="362" y2="112" class="fx-line"/>
<line x1="394" y1="112" x2="596" y2="112" class="fx-line"/>
<text x="131" y="132" text-anchor="middle" class="fx-t">标的代码</text>
<text x="131" y="150" text-anchor="middle" class="fx-t-sm">XYZ，用空格</text>
<text x="131" y="166" text-anchor="middle" class="fx-t-sm">补足 6 个字符</text>
<text x="287" y="132" text-anchor="middle" class="fx-t">到期日 YYMMDD</text>
<text x="287" y="150" text-anchor="middle" class="fx-t-sm">26 · 10 · 16</text>
<text x="287" y="166" text-anchor="middle" class="fx-t-sm">= 2026 年 10 月 16 日</text>
<text x="495" y="132" text-anchor="middle" class="fx-t">行权价 × 1000，8 位</text>
<text x="495" y="150" text-anchor="middle" class="fx-t-sm">00105000 ÷ 1000 = 105.000</text>
<text x="495" y="166" text-anchor="middle" class="fx-t-sm">（隐含三位小数）</text>
<text x="330" y="206" text-anchor="middle" class="fx-t-sm">代码里没有、但属于合约的：乘数（100）、行权方式、交割方式。</text>
</svg>
<figcaption>图 1 · 小凯那张十月 105 看涨期权的 OCC 代码（OSI 格式）。每个字段宽度固定，所以任何软件不用分隔符也能把它切开。行权价隐含三位小数，所以 97.50 美元的行权价会写成 00097500。</figcaption>
</figure>

::demo[contract-specs-notional]

> [!THINK] 朋友看到 XYZ 110 看涨期权报 0.14，一口气买了 50 张，说“才花 7 块钱”。朋友实际花了多少？这个头寸控制了多少股票？
> 两次乘法。先自己算，再打开答案。
> ---
> 花费：\(0.14 \times 100 \times 50 = \$700\)，不是 7 美元。控制的股票：\(50 \times 100 = 5{,}000\) 股，名义价值 \(5{,}000 \times \$100 = \$500{,}000\)。如果 XYZ 收在 110 美元以下，700 美元全部归零；如果 XYZ 冲到 115 美元，这个头寸值 \((115 - 110) \times 5{,}000 = \$25{,}000\)。报价小，不等于头寸小。

这一课拆成五块：

- **① 交易所统一了什么**：标的、行权价、行权方式、交割方式
- **② 到期日历**：月度、周度、每日到期与到期日当天
- **③ 权利金、乘数与名义价值**：把报价换成美元
- **④ 读懂 OCC 期权代码**
- **⑤ 股票变了怎么办：合约调整，以及 2026 年的格局**

## @mechanics
### ① 交易所统一了什么

对每一只上市期权，交易所和 OCC 都固定了：

- **标的和交割物。**标准的美国股票或 ETF 期权，交割物是 100 股（OCC 的产品规格列明股票、ETF 和 SPX 期权的乘数都是 ×100）。
- **行权价序列。**交易所围绕当前股价挂出一串行权价，股价走远了再加新的。普通股票的间距通常是 1 美元、2.5 美元或 5 美元，交易特别活跃的更密，股价很高的更疏；平值附近挂得多，远处挂得少。小凯不能挑一个 103.17 美元的行权价——只能在序列里选。
- **行权方式。** **美式期权**在到期前任何交易日都能行权；几乎所有美国股票和 ETF 期权（包括 SPY、QQQ、IWM）都是美式的。**欧式期权**只能在到期时行权；大型指数期权（如 SPX）是欧式的。
- **交割方式。** **实物交割**交付标的本身：XYZ 看涨期权行权，就是付出 \(K \times 100\)、收到 100 股。**现金交割**只用现金支付差额；SPX 期权就是这样交割，因为没人能交付“一个标普 500 指数”。

| | XYZ（股票期权） | SPX（指数期权） |
|---|---|---|
| 乘数 | 100 股 | 100 美元 × 指数点位 |
| 行权方式 | 美式 | 欧式 |
| 交割方式 | 实物：100 股易手 | 现金：实值金额 × 100 |
| 会被提前指派吗？ | 会 | 不会 |

这些差别在到期和提前指派前后最要紧，[[exercise-assignment]] 会专门讲；各类产品的完整对比见 [[product-map]]。

### ② 到期日历

每只上市期权都有一个固定的到期日，取自交易所公布的日历。

- **标准月度到期日：每月第三个周五**（若那个周五是交易所假日，就提前一天）。2026 年 10 月的周五是 2 日、9 日、16 日、23 日和 30 日，所以月度到期日是 16 日。
- **周度期权**（Weeklys）在其他周五到期；最热门的产品在其他工作日也有到期日（见下面的 FACT）。
- **长期期权（LEAPS）**的期限超过一年。

到期日当天，标准股票期权在收盘时停止交易。持有人提交最终行权指示的截止时间是美东时间下午 5:30；OCC 会自动行权所有**至少实值 0.01 美元**的到期期权，除非持有人另有指示。行权或指派交付的股票在下一个交易日结算（T+1，自 2024 年 5 月 28 日起成为美国的标准）。

课程里的“30 天期权”是教学约定：到期时间 \(T\) 按日历天数除以 365 计，所以 9 月 16 日时小凯那张十月期权的 \(T = 30/365 = 0.0822\) 年。真实的到期日落在挂牌的日期上，下面的演示按日历算出 \(T\)。

> [!FACT] 到期日前所未有地多（截至 2026 年）
> Cboe 在 2022 年 4—5 月加入周二、周四的 SPX 到期日，所以 **SPX 现在每个交易日都有到期**。当天到期的期权（0DTE）在 **2026 年 7 月约占 SPX 成交量的三分之二**（创纪录的 66.2%）。个股方面，SEC 批准了纳斯达克的规则，允许少数交易最活跃的标的挂牌**周一、周三到期**的期权，自 **2026 年 1 月 26 日**起上市。这类超短期期权的特性见 [[zero-dte]]。

### ③ 权利金、乘数与名义价值

权利金按每股报价，所以真正易手的钱是：

$$
\text{花费} = \text{权利金} \times 100 \times n, \qquad \text{名义价值} = S \times 100 \times n
$$

其中：

- **权利金**是每股的期权报价；
- \(n\) 是合约张数；
- \(S\) 是当前股价；
- **名义价值**（notional）是这些合约所对应股票的市值——也就是期权所“代表”的股票头寸有多大。

> [!EXAMPLE] 小凯的两笔候选交易，换成美元
> - 以 2.45 买入三张 30 天 100 看涨：\(\text{花费} = 2.45 \times 100 \times 3 = \$735\)；名义价值 \(= 100 \times 100 \times 3 = \$30{,}000\)。小凯付出名义价值的 2.45%，换来 3 万美元股票的上涨权。
> - 以 0.71 卖出一张十月 105 看涨：小凯**收到** \(0.71 \times 100 \times 1 = \$71\)，对应的名义价值是 1 万美元——正好是小凯持有的 100 股。

公式之上还有两个实务细节：

- **报价是一对买价和卖价。**买价（bid）是有人愿意付的最高价；卖价（ask）是有人愿意卖的最低价；中间价是两者的平均。按卖价买、按买价卖，要付出这段价差——[[liquidity-spreads]] 会量化这笔成本。
- **价格按最小跳动单位变动。**在覆盖最活跃品种的“美分计价计划”里，3 美元以下按 0.01 美元跳动，3 美元及以上按 0.05 美元跳动；少数流动性极好的 ETF（SPY、QQQ、IWM）在任何价位都按 0.01 美元跳动。

<figure>
<svg viewBox="0 0 680 230" role="img" aria-label="期权链中的一行，带注解">
<defs><marker id="contract-specs-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<text x="170" y="30" text-anchor="middle" class="fx-t-b">看涨</text>
<text x="510" y="30" text-anchor="middle" class="fx-t-b">看跌</text>
<text x="120" y="52" text-anchor="middle" class="fx-t-sm">买价</text>
<text x="220" y="52" text-anchor="middle" class="fx-t-sm">卖价</text>
<text x="340" y="52" text-anchor="middle" class="fx-t-sm">行权价</text>
<text x="460" y="52" text-anchor="middle" class="fx-t-sm">买价</text>
<text x="560" y="52" text-anchor="middle" class="fx-t-sm">卖价</text>
<rect x="70" y="60" width="540" height="40" rx="8" class="fx-box"/>
<rect x="300" y="60" width="80" height="40" class="fx-hl"/>
<text x="120" y="86" text-anchor="middle" class="fx-t-b">0.69</text>
<text x="220" y="86" text-anchor="middle" class="fx-t-b">0.73</text>
<text x="340" y="86" text-anchor="middle" class="fx-t-b">105</text>
<text x="460" y="86" text-anchor="middle" class="fx-t-b">5.30</text>
<text x="560" y="86" text-anchor="middle" class="fx-t-b">5.45</text>
<line x1="218" y1="104" x2="204" y2="136" class="fx-line" marker-end="url(#contract-specs-ah)"/>
<text x="198" y="152" text-anchor="middle" class="fx-t-sm">立刻买入按卖价：</text>
<text x="198" y="168" text-anchor="middle" class="fx-t-sm">0.73 × 100 = 73 美元</text>
<line x1="118" y1="104" x2="88" y2="136" class="fx-line" marker-end="url(#contract-specs-ah)"/>
<text x="78" y="152" text-anchor="middle" class="fx-t-sm">立刻卖出按买价：</text>
<text x="78" y="168" text-anchor="middle" class="fx-t-sm">0.69 × 100 = 69 美元</text>
<text x="350" y="130" text-anchor="middle" class="fx-t-hl">中间价 = (0.69 + 0.73) ÷ 2</text>
<text x="350" y="146" text-anchor="middle" class="fx-t-hl">= 0.71（模型价）</text>
<line x1="510" y1="104" x2="510" y2="136" class="fx-line" marker-end="url(#contract-specs-ah)"/>
<text x="510" y="152" text-anchor="middle" class="fx-t-sm">3 美元以上按 0.05 跳动，</text>
<text x="510" y="168" text-anchor="middle" class="fx-t-sm">价差 0.15 = 每张 15 美元</text>
<text x="340" y="206" text-anchor="middle" class="fx-t-sm">XYZ 现价 100 美元，2026 年 10 月 16 日到期（30 天）· 报价为示例，按每股计</text>
</svg>
<figcaption>图 2 · 小凯期权链里的一行。看涨在一侧，看跌在另一侧，行权价在中间。每个数都是每股价：真正的钱要 ×100。买价和卖价之间的差距，是想立刻成交的一方要付的成本。</figcaption>
</figure>

### ④ 读懂 OCC 期权代码

券商、交易所和数据商用一个 21 个字符的代码来标识每张合约，格式来自业界的“期权代码统一计划”（Options Symbology Initiative，OSI）：

$$
\underbrace{\texttt{XYZ\ \ \ }}_{\text{标的，6 位}}\ \underbrace{\texttt{261016}}_{\text{YYMMDD}}\ \underbrace{\texttt{C}}_{\text{C/P}}\ \underbrace{\texttt{00105000}}_{K \times 1000,\ 8 \text{ 位}}
$$

其中**标的代码**用空格补足到 6 个字符，**YYMMDD** 是到期日，**C 或 P** 是类型，最后 8 位数字是行权价乘以 1,000 再在前面补零——这样行权价可以带三位小数而不用小数点。

> [!EXAMPLE] 解读行权价
> - \(105 \times 1000 = 105{,}000\) → `00105000`。
> - \(97.5 \times 1000 = 97{,}500\) → `00097500`。
> - 一张 2026 年 11 月 20 日到期、行权价 95 美元的 XYZ 看跌期权：`XYZ   261120P00095000`（2026 年 11 月 20 日是十一月第三个周五）。

你很少需要手敲这些代码，但读得懂它，就能一眼确认下单界面、对账单或数据文件指的是不是你想要的那张合约。错一个字符——把 `C` 写成 `P`，把 `1016` 写成 `1106`——就是另一张合约了。

### ⑤ 股票变了怎么办：合约调整

上市合约是标准化的，但公司不会一成不变。当某个事件改变了“一股”本身的含义时，OCC 会调整未平仓的期权，让买卖双方都不因为这个事件本身而得失。

- **整数比例拆股**（比如一拆二）：每张 XYZ 100 看涨通常变成两张 50 看涨，每张仍对应 100 股。头寸的经济实质不变。
- **非整数比例拆股**（比如 3 拆 2）：通常合约张数不变，但交割物变成 150 股，行权价按比例下调（100 → 66.67）。这样的合约是**非标准合约**：它的报价不再是“100 股合约的每股价”，而且常常换用修改过的代码交易。
- **普通现金股息**不做调整：市场早有预期，已经算进价格里了（[[rho-carry]]）。大额特别股息、并购、分拆等则可能触发调整。

> [!WARN] 调整后的合约是新手陷阱
> 非标准合约可能交割 150 股，或 100 股加现金，或两家公司的股票。它的报价和“正常”期权链比起来，可能因为与价值无关的原因显得便宜或昂贵。交易任何代码或交割物不寻常的合约之前，先读 OCC 的调整公告；经典错误汇总在 [[common-traps]]。

## @analogy
一张期权合约就像**按统一模板印刷的演唱会门票**。

歌手和场馆是标的。票面日期是到期日——过了这天，门票就是废纸。票上印的座位价是行权价。票的类型说明你可以入场（看涨），还是可以提前离场并退款（看跌）。今天从票贩子手里买这张票付的钱是权利金，票贩子的收购价和出售价就是买价和卖价。

妙处在这里：每张票可以**让 100 个人入场**，而转售价是按**每人**报的。标价 0.71 的票，要付 71 美元。票背面的条形码——`XYZ   261016C00105000`——编码了演出、日期、类型和座位价，任何一个检票口都能扫。

如果乐队一分为二（拆股），主办方会重新发票，让持票人以另一种形式看到同样的演出；偶尔新票很古怪——一张票入场 150 人——你就得仔细读。

这个类比在一处不成立：演唱会门票的面值是固定的，持票人也总是想去。期权的价值随 XYZ 每秒变化，而到期时持有人只在划算时才会“入场”——也就是行权。

## @misconceptions
- **“报价就是一张合约的价格。”** —— 报价是每股价。一张合约的价格 = 报价 × 100：0.71 就是 71 美元。
- **“便宜的期权就是小头寸。”** —— 花费和敞口是两回事。50 张 110 看涨只花 700 美元，却对应 5,000 股、50 万美元的名义价值。
- **“期权半夜才到期，我整个晚上都来得及。”** —— 标准股票期权在到期日收盘时停止交易，行权指示也有硬性截止时间（持有人最终决定为美东时间下午 5:30）。
- **“所有期权都是美式、都用股票交割。”** —— SPX 等大型指数期权是欧式、现金交割的；每个产品都要查它的规格（[[product-map]]）。
- **“拆股之后我的期权就作废了。”** —— OCC 会调整合约以保住它的经济价值；变的是行权价、张数或交割物。

## @takeaways
- 上市期权把每个条款都标准化——标的、行权价序列、到期日、乘数、行权方式、交割方式——所以两张相同的合约可以互换，能和任何人了结。
- 报价按每股计：\(\text{花费} = \text{权利金} \times 100 \times n\)，每张合约对应 100 股、名义价值 \(S \times 100\)。
- 标准月度到期日是第三个周五；周度期权和 SPX 的每日到期把日历填满；到期实值 0.01 美元以上会被自动行权。
- OCC 代码 = 标的（6 位）+ YYMMDD + C/P + 行权价 × 1000（8 位）：`XYZ   261016C00105000` 是 XYZ 2026 年 10 月 16 日到期的 105 看涨。
- 拆股等特殊事件会触发合约调整；非标准交割物要格外小心。

## @quiz
1. XYZ 30 天 100 看涨期权报价 2.45。买三张要花多少？
   - [ ] 7.35 美元
   - [ ] 245 美元
   - [ ] 73.50 美元
   - [x] 735 美元
   > \(2.45 \times 100 \times 3 = \$735\)。7.35 美元忘了乘数；245 美元只是一张的价格。
2. 代码 `XYZ   261120P00095000` 描述的是什么？
   - [ ] 一张 2020 年 11 月 26 日到期、行权价 95,000 美元的 XYZ 看涨期权
   - [x] 一张 2026 年 11 月 20 日到期、行权价 95 美元的 XYZ 看跌期权
   - [ ] 一张 2020 年 11 月 26 日到期、行权价 9.50 美元的 XYZ 看跌期权
   - [ ] 一张 2026 年 11 月 20 日到期、行权价 950 美元的 XYZ 看涨期权
   > 补足空格的标的代码之后是 YYMMDD（26-11-20 = 2026 年 11 月 20 日），然后是类型（P = 看跌），最后是行权价 × 1000 的 8 位数：00095000 ÷ 1000 = 95。
3. 小凯持有 100 股 XYZ，想卖备兑看涨期权。最多能卖几张，才能让每一股承诺都有股票覆盖？
   - [x] 一张
   - [ ] 一百张
   - [ ] 十张
   - [ ] 权利金够多少就卖多少
   > 每张合约在被指派时要交出 100 股。小凯的 100 股正好覆盖一张；第二张就是承诺交出自己没有的股票。
4. 2026 年 10 月的标准月度到期日是哪天（10 月 1 日是星期四）？
   - [ ] 10 月 2 日，周五
   - [ ] 10 月 9 日，周五
   - [x] 10 月 16 日，周五
   - [ ] 10 月 30 日，周五
   > 这个月的周五是 2、9、16、23、30 日；第三个周五 16 日是月度到期日，其余是周度到期日。
5. XYZ 一拆二。小凯那一张 XYZ 100 看涨期权通常会怎样？
   - [ ] 被取消，退还权利金
   - [ ] 仍是一张 100 股、行权价 100 美元的合约
   - [x] 变成两张各 100 股、行权价 50 美元的合约
   - [ ] 变成一张 200 股、行权价 100 美元的合约
   > OCC 调整合约，让头寸的经济实质不变：股数翻倍、价格减半。整数比例拆股通常就是张数翻倍、行权价减半；按 50 美元买 200 股的权利，等于原来按 100 美元买 100 股的权利。

## @further
- [Equity options product specifications（OCC）](https://www.theocc.com/market-data/market-data-reports/series-and-trading-data/equity-options-product-specifications) — 官方合约条款清单，包括 ×100 乘数。
- [Characteristics and Risks of Standardized Options（OCC）](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — 官方披露文件；讲标准化条款与合约调整的章节是第一手资料。
- [Options exercise FAQ（期权行业协会 OIC）](https://www.optionseducation.org/referencelibrary/faq/options-exercise) — 到期日截止时间与自动行权。
- [Penny increments（期权行业协会 OIC）](https://www.optionseducation.org/news/penny-increments) — 期权最小跳动单位的规则。
- [The evolution of same-day options trading（Cboe）](https://www.cboe.com/insights/posts/the-evolution-of-same-day-options-trading/) — 周度与每日到期是怎样一步步加进来的。
- [Option symbol（维基百科）](https://en.wikipedia.org/wiki/Option_symbol) — OSI 格式及其由来。

## @next
小凯已经能读懂一张合约、并用美元给它定价了。可是同一只股票、同一天，为什么 105 看涨只要 0.71 美元，95 看涨却要 5.82 美元？回答的第一步，是问每个行权价离“有价值”还有多远——实值、平值，还是虚值。
