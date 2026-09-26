---
id: binomial-trees
prereqs: binomial-one-step, risk-neutral
demo: binomial-trees
---

# 多步二叉树与美式期权

## @hook
一步“涨或跌”只是漫画。串起三步，二叉树给 1 年期 XYZ 看涨期权的定价已经是 10.54 美元；串起 500 步，它落在 9.92 美元，和 Black-Scholes 只差一分钱。同一棵树还能在每个节点上问一句：“现在就行权是不是更好？”——这是任何封闭公式都回答不了的问题。

## @bridge
[[binomial-one-step]] 用复制给“涨或跌的一步”定了价；[[risk-neutral]] 把它变成一条配方：用权重 \(q\) 对回报求平均，再按 \(r\) 贴现。这一课把这条配方在很多小步上、一个节点一个节点地倒着执行一遍——这就是 Cox–Ross–Rubinstein（CRR）二叉树。它落在第 ② 个观念（无套利），因为每个节点都是一次微型复制。它交出后面几课需要的两样东西：树的极限就是 [[black-scholes]]，而它逐节点检查行权的做法，是给 [[american-exercise]] 定价的标准工具。

## @intuition
真实的股票不会一年只跳一次，它时时刻刻都在动。但在**很短**的一步里，“涨一点或跌一点”是个不错的描述。所以把一年切成好几步，让 XYZ 在每一步都要么涨、要么跌。

拿小凯的 XYZ（\(S = 100\)，波动率 20%，利率 4%），把一年切成**三步，每步四个月**。每一步 XYZ 要么乘以 \(u = 1.1224\)（涨 12.24%），要么乘以 \(d = 0.8909\)（跌 10.91%）。这两个数怎么来的，力学部分 ① 会讲；现在先注意一件事：**先涨后跌，和先跌后涨，落在同一个地方**——\(100 \times 1.1224 \times 0.8909 = 100\)。树枝又合拢了，所以三步之后只有四种可能的价格（141.40、112.24、89.09、70.72），而不是八种。树枝这样合拢的树，叫**可重合树**（recombining tree）。

现在给 1 年期、行权价 100 的看涨期权定价。诀窍是**从终点开始**：

1. 到期时，期权值它的回报：41.40、12.24、0、0。
2. 往回退一列。每个节点都是一个和 [[binomial-one-step]] 一模一样的一步问题：用 \(q = 0.529\)（上）和 \(0.471\)（下）对两个子节点求平均，再按 4% 贴现四个月。
3. 一直重复，直到今天。

<figure>
<svg viewBox="0 0 680 345" role="img" aria-label="1 年期 XYZ 看涨期权的三步二叉树">
<line x1="132" y1="160" x2="198" y2="115" class="fx-line"/><line x1="132" y1="160" x2="198" y2="205" class="fx-line"/>
<line x1="302" y1="115" x2="368" y2="70" class="fx-line"/><line x1="302" y1="115" x2="368" y2="160" class="fx-line"/>
<line x1="302" y1="205" x2="368" y2="160" class="fx-line"/><line x1="302" y1="205" x2="368" y2="250" class="fx-line"/>
<line x1="472" y1="70" x2="538" y2="25" class="fx-line"/><line x1="472" y1="70" x2="538" y2="115" class="fx-line"/>
<line x1="472" y1="160" x2="538" y2="115" class="fx-line"/><line x1="472" y1="160" x2="538" y2="205" class="fx-line"/>
<line x1="472" y1="250" x2="538" y2="205" class="fx-line"/><line x1="472" y1="250" x2="538" y2="295" class="fx-line"/>
<rect x="28" y="141" width="104" height="38" rx="6" class="fx-hl"/><text x="80" y="157" text-anchor="middle" class="fx-t-sm">S 100.00</text><text x="80" y="173" text-anchor="middle" class="fx-t-b">C 10.54</text>
<rect x="198" y="96" width="104" height="38" rx="6" class="fx-box"/><text x="250" y="112" text-anchor="middle" class="fx-t-sm">S 112.24</text><text x="250" y="128" text-anchor="middle" class="fx-t-b">C 17.23</text>
<rect x="198" y="186" width="104" height="38" rx="6" class="fx-box"/><text x="250" y="202" text-anchor="middle" class="fx-t-sm">S 89.09</text><text x="250" y="218" text-anchor="middle" class="fx-t-b">C 3.34</text>
<rect x="368" y="51" width="104" height="38" rx="6" class="fx-box"/><text x="420" y="67" text-anchor="middle" class="fx-t-sm">S 125.98</text><text x="420" y="83" text-anchor="middle" class="fx-t-b">C 27.30</text>
<rect x="368" y="141" width="104" height="38" rx="6" class="fx-box"/><text x="420" y="157" text-anchor="middle" class="fx-t-sm">S 100.00</text><text x="420" y="173" text-anchor="middle" class="fx-t-b">C 6.39</text>
<rect x="368" y="231" width="104" height="38" rx="6" class="fx-box"/><text x="420" y="247" text-anchor="middle" class="fx-t-sm">S 79.38</text><text x="420" y="263" text-anchor="middle" class="fx-t-b">C 0.00</text>
<rect x="538" y="6" width="104" height="38" rx="6" class="fx-ok"/><text x="590" y="22" text-anchor="middle" class="fx-t-sm">S 141.40</text><text x="590" y="38" text-anchor="middle" class="fx-t-b">C 41.40</text>
<rect x="538" y="96" width="104" height="38" rx="6" class="fx-ok"/><text x="590" y="112" text-anchor="middle" class="fx-t-sm">S 112.24</text><text x="590" y="128" text-anchor="middle" class="fx-t-b">C 12.24</text>
<rect x="538" y="186" width="104" height="38" rx="6" class="fx-box2"/><text x="590" y="202" text-anchor="middle" class="fx-t-sm">S 89.09</text><text x="590" y="218" text-anchor="middle" class="fx-t-b">C 0.00</text>
<rect x="538" y="276" width="104" height="38" rx="6" class="fx-box2"/><text x="590" y="292" text-anchor="middle" class="fx-t-sm">S 70.72</text><text x="590" y="308" text-anchor="middle" class="fx-t-b">C 0.00</text>
<text x="80" y="336" text-anchor="middle" class="fx-t-sm">今天</text>
<text x="250" y="336" text-anchor="middle" class="fx-t-sm">4 个月</text>
<text x="420" y="336" text-anchor="middle" class="fx-t-sm">8 个月</text>
<text x="590" y="336" text-anchor="middle" class="fx-t-sm">1 年（到期回报）</text>
<text x="28" y="40" class="fx-t-sm">u = 1.1224，d = 0.8909</text>
<text x="28" y="58" class="fx-t-sm">q = 0.529（上），0.471（下）</text>
<text x="28" y="76" class="fx-t-sm">每步贴现因子 0.9868</text>
</svg>
<figcaption>图 1 · 1 年期、行权价 100 的 XYZ 看涨期权的三步可重合树（σ 20%，r 4%）。股价（S）从左往右长；期权价值（C）从右往左填，起点是最后一列的到期回报。每个节点都是它两个子节点按 \(q\) 加权、再贴现一步的结果。树的答案 10.54 已经离 Black-Scholes 的 9.93 不远了。</figcaption>
</figure>

> [!KAI] 提前行权对小凯值多少
> 小凯持有 XYZ，想买一张 1 年期、行权价 100 的**看跌期权**做保护。上市的个股期权是美式的，小凯可以在任何一天行权。500 步的二叉树说，美式看跌期权约值 **6.40 美元**；只能到期行权的欧式版本，按 Black-Scholes 是 **6.00 美元**。每股多出的 40 美分（每张合约约 40 美元），就是“可以提前兑现”这项权利的价格。力学部分 ④ 会讲清楚：什么时候用这项权利才是聪明的。

三步仍然很粗。步数一多，树的价格先是来回晃，然后稳定下来。自己看：

::demo[binomial-trees-converge]

> [!THINK] 从 2 步到 3 步，树给 1 年期看涨期权的价格从 9.02 跳到 10.54。Black-Scholes 的值是 9.93。继续加步数，价格会从一侧平稳地靠近 9.93 吗？
> 先猜：偶数步和奇数步，可能有什么不同？
> ---
> 不会，它会锯齿形地摆：10 步 9.73，11 步 10.09，100 步 9.91，101 步 9.94。偶数步时，最后一列正中间的节点恰好落在行权价上（\(u^j d^j \times 100 = 100\)）；奇数步时，行权价落在两个节点之间。两组数从两侧逼近 9.93，误差大约按 \(1/N\) 缩小。把相邻两个步数平均一下，大部分误差就抵消了：\((9.905 + 9.943)/2 = 9.924\)。

这一课拆成五块：

- **① 搭树（CRR）**：\(u\)、\(d\)、\(q\) 从哪来
- **② 倒推（逆向归纳）**：一条规则，用在每个节点上
- **③ 收敛到 Black-Scholes**，连锯齿一起看
- **④ 美式期权**：提前行权的检查
- **⑤ 从树上读出希腊字母，以及树今天用在哪里**

## @mechanics
### ① 搭树（CRR）

把离到期的时间 \(T\) 切成 \(N\) 步，每步长 \(\Delta t = T/N\)。Cox、Ross 和 Rubinstein 这样选上涨、下跌倍数，让树具有正确的波动率：

$$
u = e^{\sigma\sqrt{\Delta t}}, \qquad d = \frac{1}{u} = e^{-\sigma\sqrt{\Delta t}}, \qquad q = \frac{e^{r\Delta t} - d}{u - d}
$$

其中：

- \(\sigma\) 是年化波动率，\(\sigma\sqrt{\Delta t}\) 是对数价格走一步的大小。每一步让 \(\ln S\) 变动 \(\pm\sigma\sqrt{\Delta t}\)，方差是 \(\sigma^2\Delta t\)；\(N\) 步累加起来正好是 \(\sigma^2 T\)，总方差对了。这就是 \(\sqrt{T}\) 法则，[[random-walk]] 会好好讲它；
- \(d = 1/u\) 让树可以重合：一涨一跌互相抵消；
- \(q\) 就是 [[risk-neutral]] 里的风险中性上涨权重，只不过现在按每一步算。有股息时，把 \(e^{r\Delta t}\) 换成 \(e^{(r - \text{股息率})\Delta t}\)。

> [!EXAMPLE] 三步的 XYZ 树
> \(\Delta t = 1/3\)，\(\sigma\sqrt{\Delta t} = 0.2 \times 0.5774 = 0.1155\)：
> $$
> \begin{gathered}
> u = e^{0.1155} = 1.1224, \qquad d = 0.8909 \\
> q = \frac{e^{0.04/3} - 0.8909}{1.1224 - 0.8909} = \frac{1.0134 - 0.8909}{0.2315} = 0.529
> \end{gathered}
> $$
> 涨 \(j\) 次、跌 \(N - j\) 次之后，价格是 \(100\,u^j d^{N-j}\)：\(N = 3\) 时分别是 141.40、112.24、89.09、70.72。

可重合是二叉树实用的关键。500 步的树有 \(2^{500}\) 条可能的**路径**，却只有 501 个终点节点，总共 \(501 \times 502 / 2 = 125{,}751\) 个节点，笔记本电脑几毫秒就能填完。

### ② 倒推（逆向归纳）

用步数 \(i\) 和上涨次数 \(j\) 给节点编号。整个算法只有一条规则，从最后一列一直用到第一列：

$$
V_{i,j} = e^{-r\Delta t}\Big[\,q\,V_{i+1,\,j+1} + (1 - q)\,V_{i+1,\,j}\,\Big], \qquad V_{N,j} = \max\!\big(S_{N,j} - K,\ 0\big)
$$

用大白话说：一个节点的价值，是它下一步可能到达的两个节点、按风险中性权重平均后再贴现的结果。最后一列的价值就是到期回报（看跌期权则是 \(\max(K - S_{N,j}, 0)\)）。

> [!EXAMPLE] 手算一个节点
> 八个月后 XYZ 在 125.98 的那个节点。它的两个子节点分别值 41.40（上）和 12.24（下）：
> $$
> \begin{aligned}
> V &= e^{-0.04/3}\,\big(0.529 \times 41.40 + 0.471 \times 12.24\big) \\
>   &= 0.9868 \times (21.91 + 5.76) = 27.30
> \end{aligned}
> $$
> 每个节点都这样算，根节点就是 10.54。

每个节点也是一次小小的复制，有它自己的对冲比率 \(\Delta = (V_{\text{上}} - V_{\text{下}})/(S_{\text{上}} - S_{\text{下}})\)。在根节点，\(\Delta = (17.23 - 3.34)/(112.24 - 89.09) = 0.60\)；在 125.98 那个节点，期权必然到期实值，\(\Delta = 1.00\)；在 79.38 那个节点是 0，在 89.09 那个节点是 0.31。**对冲比率随股价而变**，所以对冲者要在上涨后买股、下跌后卖股。这就是 [[delta-hedging]] 的核心——调仓，也是 [[binomial-one-step]] 里那个复制品必须“重新调配”的原因。

### ③ 收敛到 Black-Scholes

步数加多，树给 1 年期 XYZ 看涨期权的价格逐渐稳定到 Black-Scholes 的值：

| 步数 \(N\) | 1 | 2 | 3 | 5 | 10 | 11 |
|---|---|---|---|---|---|---|
| 看涨价 | 11.73 | 9.02 | 10.54 | 10.30 | 9.73 | 10.09 |
| **步数 \(N\)** | **50** | **51** | **100** | **101** | **500** | **1,000** |
| 看涨价 | 9.89 | 9.96 | 9.91 | 9.94 | 9.92 | 9.92 |

Black-Scholes：**9.93**。为什么极限存在？走 \(N\) 步、涨 \(j\) 次之后，\(\ln S_T = \ln S + (2j - N)\,\sigma\sqrt{\Delta t}\)。上涨次数 \(j\) 服从二项分布，而按中心极限定理，\(N\) 变大时二项分布会变成正态分布。于是 \(\ln S_T\) 变成正态的：股价变成**对数正态**的——这正是 Black-Scholes 背后的假设。“在树上按 \(q\) 加权平均再贴现”变成了“在对数正态分布上求 \(\Q\) 期望再贴现”，[[black-scholes]] 把这个期望算成了封闭公式。

THINK 框里的锯齿，来自行权价在最后一列节点中的位置。实务上的办法是：用很多步、把相邻两个 \(N\) 平均、或者把最后一步做平滑。至于单个欧式期权的价格，本来就是封闭公式更快。二叉树的用武之地在别处。

### ④ 美式期权：提前行权的检查

美式期权可以在任何节点行权，不只是最后。二叉树只要在每个节点多做一次比较：

$$
V_{i,j} = \max\Big(\underbrace{\text{行权价值}}_{\text{看跌时为 } K - S_{i,j}},\ \underbrace{e^{-r\Delta t}\big[q\,V_{i+1,j+1} + (1-q)\,V_{i+1,j}\big]}_{\text{继续持有的价值}}\Big)
$$

其中行权价值是“现在就行权能拿到多少”，继续持有的价值是“拿着不动”的风险中性价值（也就是普通倒推算出来的数）。持有人取较大的那个；行权更划算的节点，叫**提前行权节点**。

<figure>
<svg viewBox="0 0 680 345" role="img" aria-label="同一棵树上的美式看跌期权与提前行权节点">
<line x1="132" y1="160" x2="198" y2="115" class="fx-line"/><line x1="132" y1="160" x2="198" y2="205" class="fx-line"/>
<line x1="302" y1="115" x2="368" y2="70" class="fx-line"/><line x1="302" y1="115" x2="368" y2="160" class="fx-line"/>
<line x1="302" y1="205" x2="368" y2="160" class="fx-line"/><line x1="302" y1="205" x2="368" y2="250" class="fx-line"/>
<line x1="472" y1="70" x2="538" y2="25" class="fx-line"/><line x1="472" y1="70" x2="538" y2="115" class="fx-line"/>
<line x1="472" y1="160" x2="538" y2="115" class="fx-line"/><line x1="472" y1="160" x2="538" y2="205" class="fx-line"/>
<line x1="472" y1="250" x2="538" y2="205" class="fx-line"/><line x1="472" y1="250" x2="538" y2="295" class="fx-line"/>
<rect x="28" y="141" width="104" height="38" rx="6" class="fx-hl"/><text x="80" y="157" text-anchor="middle" class="fx-t-sm">S 100.00</text><text x="80" y="173" text-anchor="middle" class="fx-t-b">P 6.91</text>
<rect x="198" y="96" width="104" height="38" rx="6" class="fx-box"/><text x="250" y="112" text-anchor="middle" class="fx-t-sm">S 112.24</text><text x="250" y="128" text-anchor="middle" class="fx-t-b">P 2.35</text>
<rect x="198" y="186" width="104" height="38" rx="6" class="fx-box"/><text x="250" y="202" text-anchor="middle" class="fx-t-sm">S 89.09</text><text x="250" y="218" text-anchor="middle" class="fx-t-b">P 12.23</text>
<rect x="368" y="51" width="104" height="38" rx="6" class="fx-box2"/><text x="420" y="67" text-anchor="middle" class="fx-t-sm">S 125.98</text><text x="420" y="83" text-anchor="middle" class="fx-t-b">P 0.00</text>
<rect x="368" y="141" width="104" height="38" rx="6" class="fx-box"/><text x="420" y="157" text-anchor="middle" class="fx-t-sm">S 100.00</text><text x="420" y="173" text-anchor="middle" class="fx-t-b">P 5.07</text>
<rect x="368" y="231" width="104" height="38" rx="6" class="fx-btc"/><text x="420" y="247" text-anchor="middle" class="fx-t-sm">S 79.38</text><text x="420" y="263" text-anchor="middle" class="fx-t-b">P 20.62 ★</text>
<rect x="538" y="6" width="104" height="38" rx="6" class="fx-box2"/><text x="590" y="22" text-anchor="middle" class="fx-t-sm">S 141.40</text><text x="590" y="38" text-anchor="middle" class="fx-t-b">P 0.00</text>
<rect x="538" y="96" width="104" height="38" rx="6" class="fx-box2"/><text x="590" y="112" text-anchor="middle" class="fx-t-sm">S 112.24</text><text x="590" y="128" text-anchor="middle" class="fx-t-b">P 0.00</text>
<rect x="538" y="186" width="104" height="38" rx="6" class="fx-ok"/><text x="590" y="202" text-anchor="middle" class="fx-t-sm">S 89.09</text><text x="590" y="218" text-anchor="middle" class="fx-t-b">P 10.91</text>
<rect x="538" y="276" width="104" height="38" rx="6" class="fx-ok"/><text x="590" y="292" text-anchor="middle" class="fx-t-sm">S 70.72</text><text x="590" y="308" text-anchor="middle" class="fx-t-b">P 29.28</text>
<text x="80" y="336" text-anchor="middle" class="fx-t-sm">今天</text>
<text x="250" y="336" text-anchor="middle" class="fx-t-sm">4 个月</text>
<text x="420" y="336" text-anchor="middle" class="fx-t-sm">8 个月</text>
<text x="590" y="336" text-anchor="middle" class="fx-t-sm">1 年（到期回报）</text>
<text x="28" y="262" class="fx-t-btc">★ 现在行权：100 − 79.38 = 20.62</text>
<text x="28" y="280" class="fx-t-sm">继续持有：0.9868 × (0.529 × 10.91</text>
<text x="28" y="296" class="fx-t-sm">+ 0.471 × 29.28) = 19.30</text>
<text x="28" y="40" class="fx-t-sm">美式看跌，K = 100</text>
<text x="28" y="58" class="fx-t-sm">欧式版本：6.62</text>
</svg>
<figcaption>图 2 · 同一棵树上的 1 年期、行权价 100 的**美式看跌期权**。在带星号的节点（八个月后 XYZ 在 79.38），现在行权能拿 20.62，继续持有只值 19.30，所以持有人会行权。这一个决定抬高了它左边所有节点的价值：根节点变成 6.91，而欧式版本是 6.62。</figcaption>
</figure>

为什么有人会提前行权看跌期权，放弃剩下的时间价值？行使一张深度实值的看跌期权，**现在**就能拿到 \(K = 100\) 美元。这笔钱在剩余时间里能赚到的利息，可能比“XYZ 再跌一截”的那点小机会更值钱。越深度实值，这股拉力越强。用 1,000 步计算：

| 行权价 | 美式看跌 | 欧式看跌（Black-Scholes） | 提前行权溢价 |
|---|---|---|---|
| 100 | 6.40 | 6.00 | 0.40 |
| 110 | 12.33 | 11.35 | 0.98 |
| 120 | 20.33 | 18.29 | 2.04 |
| 130 | 30.00 | 26.40 | 3.60 |

\(K = 130\) 时，美式看跌期权正好值它的内在价值 30.00：树在说“立刻行权”。

步数很多时，提前行权节点会在树的下方连成一整片区域。它的上边缘是一条曲线，叫**行权边界**：XYZ 一跌破它，就该行权。对 1 年期、行权价 100 的看跌期权，1,000 步的树给出的边界大约是：还剩九个月时 80.65，六个月时 82.72，三个月时 85.92，约五周时 89.24，四天时 95.07。越临近到期，边界越往行权价靠——因为能放弃的时间价值越来越少。找出这条曲线，正是 [[american-exercise]] 的核心问题。

不分红股票上的美式**看涨**期权则不一样。树里找不到任何提前行权节点，500 步时价格 9.92，和欧式一样。

> [!DEEP] 为什么不分红股票的美式看涨期权永远不该提前行权
> 由 [[arbitrage-bounds]]，看涨期权至少值 \(S - Ke^{-r\tau}\)，\(\tau\) 是剩余时间。只要 \(r > 0\)，这就比行权能拿到的 \(S - K\) 更多。所以卖掉期权（或者干脆拿着）永远比行权划算。提前行权等于提前付行权价，还扔掉了时间价值这份保险。股息会改变这一点：在股票除息前，行权可以拿到股息（[[exercise-assignment]]）。

> [!WARN] 真实市场里的美式与欧式
> 美国标准的个股期权和 ETF 期权（包括 SPY）是美式的；SPX 和 XSP 指数期权是欧式、现金交割的（截至 2026 年，以交易所合约规格为准）。看跌看涨平价只对欧式期权严格成立；对美式期权，它变成一对不等式。拿树算出的价格去比报价之前，先确认行权方式。

### ⑤ 从树上读出希腊字母，以及树今天用在哪里

二叉树几乎是白送你希腊字母，用的都是已经算好的节点：

- **Delta**：用第一步之后的两个节点，\(\Delta \approx (V_{1,1} - V_{1,0})/(S_{1,1} - S_{1,0})\)；
- **Gamma**：看第二步之后三个节点上，这个 Delta 怎么变；
- **Theta**：拿两步之后的中间节点（股价和今天一样）与今天的价值比较。

对 1 年期 XYZ 看涨期权，500 步给出：\(\Delta = 0.618\)，\(\Gamma = 0.0191\)，\(\Theta = -0.0161\)（每天），与 Black-Scholes 的 0.618、0.019、−0.016 吻合（[[greeks-map]]）。

树今天用在哪里：

- **美式期权与股息。**大多数上市个股期权是美式的，很多还有离散股息。二叉树（以及它的近亲——[[finite-difference]] 里的有限差分网格）是处理它们的标准工具，因为它们在每个节点检查提前行权。已知的现金股息也很容易加进去：在除息日那一列，股价减去股息；树的行权检查会自动找出那一列之前的节点——在那里，行使实值看涨期权去拿股息，比继续持有更划算。
- **教学与核对。**二叉树是透明的，每个数都能追溯。交易台常用简单的树去核对更快的模型。
- **树的短板。**回报取决于整条路径的期权（平均价、障碍），以及多个标的的问题，会让树的规模爆炸；这时就轮到蒙特卡洛（[[monte-carlo]]）上场。

## @analogy
想象一档电视游戏节目：每一轮，主持人都会报一笔现金，让你拿钱走人；你可以接受，也可以继续玩。那么，在第一轮时，“身在游戏中”这件事值多少钱？

聪明的选手会倒着想。最后一轮已经没有选择：最后那个盒子里是多少就是多少。往前一轮，把主持人的报价和“最后一轮平均能拿多少”比一比，取大的那个。这样一轮一轮往前推，到开头时，你既知道“身在游戏中”值多少，也知道自己会在哪一轮接受报价。

这就是二叉树。最后的盒子是期权的到期回报；“下一步平均能拿多少”是两个子节点按 \(q\) 加权、贴现后的平均；主持人的报价就是美式期权的行权价值；你会接受报价的那些轮次，就是提前行权节点。

类比失灵的地方：游戏节目里的“平均”用的是真实胜率和选手对风险的胃口；树里的平均用的是来自对冲的风险中性权重，与任何人的胜率无关。节目的路径会无限分叉，而股票的树会重合：先涨后跌和先跌后涨落在同一个地方，正因如此，500 步的树才不会大得离谱。

## @misconceptions
- **“步数越多，树的价格一定越接近 Black-Scholes。”** —— 并不单调。价格在偶数步和奇数步之间锯齿式摆动（10 步 9.73，11 步 10.09），因为行权价时而落在节点上、时而落在两个节点之间。摆幅会缩小，大约按 \(1/N\)。
- **“美式期权总比欧式期权明显更值钱。”** —— 对不分红股票的看涨期权，一点都不：提前行权从来不划算，所以价格相同。对看跌期权，平值附近溢价不大（6.40 对 6.00），只有深度实值时才变大。
- **“u 和 d 是对股价会动多远的预测。”** —— 它们由输入的波动率决定：\(u = e^{\sigma\sqrt{\Delta t}}\)。换一个 σ，每个节点都会动。树本身没有看法，有看法的是你喂给它的 σ。
- **“二叉树假设股价真的按 ±12% 跳。”** —— 三步树只是粗略的草图。步子变小时，跳幅按 \(\sqrt{\Delta t}\) 缩小，树收敛到一条连续的对数正态随机游走。
- **“有了 Black-Scholes，二叉树就过时了。”** —— Black-Scholes 只给欧式期权定价。对美式行权和离散股息，树和网格至今仍是标准工具。

## @takeaways
- CRR 树用 \(u = e^{\sigma\sqrt{\Delta t}}\)、\(d = 1/u\) 和每步的风险中性权重 \(q = (e^{r\Delta t} - d)/(u - d)\)；它可以重合，所以 \(N\) 步只需要 \(N + 1\) 个终点节点。
- 逆向归纳：从到期回报出发，在每个节点用 \(V = e^{-r\Delta t}[qV_{\text{上}} + (1-q)V_{\text{下}}]\)，一路倒推到今天。
- 1 年期 XYZ 看涨期权：3 步 10.54，500 步 9.92；极限是 Black-Scholes 的 9.93，途中按奇偶锯齿摆动。
- 美式期权在每个节点多一次检查：\(\max(\text{行权}, \text{继续持有})\)。1 年期美式看跌 6.40，欧式 6.00；不分红股票的美式看涨永远不该提前行权。
- 树还能用已算好的节点给出 Delta、Gamma、Theta；每个节点的 \(\Delta\) 就是随股价变动必须调整的对冲。

## @quiz
1. 一棵 500 步的可重合 CRR 树，到期时有多少种可能的股价？
   - [ ] 500
   - [x] 501
   - [ ] 1,000
   - [ ] \(2^{500}\)
   > 因为 \(ud = 1\)，上涨次数相同的路径会落在同一个节点：涨 \(j = 0, 1, \dots, 500\) 次，共 501 个终点价格。\(2^{500}\) 数的是路径，不是终点。
2. 某节点的两个子节点分别值 41.40（上）和 12.24（下），\(q = 0.529\)，一步的贴现因子是 0.9868。这个节点（欧式）值多少？
   - [ ] 26.82，两个子节点的简单平均
   - [ ] 27.67，按 q 加权但没贴现
   - [x] 约 27.30
   - [ ] 41.40，取较好的那个子节点
   > \(0.9868 \times (0.529 \times 41.40 + 0.471 \times 12.24) = 0.9868 \times 27.67 = 27.30\)。两步都不能少：先按 \(q\) 加权，再贴现一步。
3. 步数取 10、11、100、101 时，1 年期看涨期权的树价格在 9.93 上下交替。为什么？
   - [ ] 因为大树里的舍入误差会累积
   - [x] 因为偶数步时有一个终点节点恰好落在行权价上，奇数步时行权价落在两个节点之间
   - [ ] 因为风险中性权重 q 在 0.5 上下来回翻
   - [ ] 因为 Black-Scholes 本身只是近似
   > 回报在 K 处的拐点，被偶数步和奇数步以不同方式“采样”，所以两组数从两侧逼近极限。把相邻两个平均，\((9.905 + 9.943)/2 = 9.924\)，大部分误差就抵消了。
4. XYZ 不分红。1 年期、行权价 100 的美式看涨与欧式看涨相比如何？
   - [x] 价值相同，因为提前行权永远不比持有或卖出更好
   - [ ] 美式更值钱，因为权利越多越值钱
   - [ ] 欧式更值钱，因为没有被提前指派的风险
   - [ ] 取决于期权今天是否实值
   > 看涨期权至少值 \(S - Ke^{-r\tau}\)，比行权价值 \(S - K\) 更多。所以提前行权的权利永远用不上，也就不增加价值。有股息时，在除息日前可能会有影响。
5. 在某个节点，XYZ 为 79.38，还剩四个月。行权价 100 的美式看跌期权现在行权可得 20.62，继续持有值 19.30。持有人该怎么做？为什么？
   - [ ] 继续持有，因为时间价值永远为正
   - [ ] 继续持有，因为 XYZ 可能跌得更深
   - [x] 行权，因为现在拿到 100 美元能赚的利息，超过了剩下那一点额外保护的价值
   - [ ] 无所谓，贴现后两者一样
   > 深度实值时，看跌期权几乎就是一份“拿 \(K - S\)”的权利；现在拿到 \(K\) 并赚利息，胜过等待。树比较 20.62 和 19.30，取较大者。

## @further
- [Binomial options pricing model（维基百科）](https://en.wikipedia.org/wiki/Binomial_options_pricing_model) — CRR 参数、逆向归纳与美式期权，附计算表格。
- [Backward induction（维基百科）](https://en.wikipedia.org/wiki/Backward_induction) — 同样的倒推思路在博弈论和决策问题中的应用。
- [期权行业协会：行权常见问题](https://www.optionseducation.org/referencelibrary/faq/options-exercise) — 美式期权在实务中如何、何时行权，包括股息的影响。
- [Black & Scholes (1973), The Pricing of Options and Corporate Liabilities](https://doi.org/10.1086/260062) — 二叉树最终收敛到的那个连续时间极限。

## @next
二叉树之所以收敛，是因为许多小小的涨跌累加起来，在对数价格上变成了一条钟形曲线。这条随机游走究竟是什么？股价为什么按 \(\sqrt{T}\) 而不是 \(T\) 散开？为什么价格是对数正态、而不是正态的？下一课搭起 Black-Scholes 的第三块积木：[[random-walk]]。
