---
id: finite-difference
prereqs: black-scholes, binomial-trees, theta, monte-carlo
demo: finite-difference
---

# PDE 与有限差分：另一条定价之路

## @hook
蒙特卡洛把未来向前跑，再取平均。有限差分反着来：从到期时已知的收益出发，在一张价格网格上，一个时间片一个时间片地把 Black-Scholes 方程倒着解回今天。它快、准，还白送所有希腊字母——前提是守住一条规矩。破了这条规矩，最简单的那种格式会把一张 9.93 美元的期权算成一个 87 位数。

## @bridge
[[black-scholes]] 的结尾是一个偏微分方程：\(\Theta + \tfrac12\sigma^2S^2\Gamma + rS\Delta - rV = 0\)，意思是“对冲好的期权只赚无风险利率”。[[theta]] 把它读成“时间损耗为 gamma 买单”。[[binomial-trees]] 其实早就在解它的离散版本，只是没明说——每个节点都是子节点的平均。[[monte-carlo]] 展示了向前抽样的那条路。这一课走向后、走网格的那条路：**怎样用数值方法解定价 PDE，为什么最直观的方法有时会爆炸？** 它落在第 ② 个观念（无套利）上：这个 PDE *就是*复制论证，只不过一次写给了所有价格、所有时刻。

## @intuition
想象一张坐标纸。横向是**离到期的时间** \(\tau\)，最左端是 0（到期日），最右端是 1 年（今天）。纵向是**股价** \(S\)，从 0 到某个很高的上限，比如 400 美元。每个交叉点都是一个问题：*在这个价格、还剩这么多时间时，期权值多少？*

这张纸有三条边是事先就填好的：

- **左边缘（到期日）。** 在 \(\tau = 0\) 时，期权就值它的收益。对小凯的 100 看涨期权，就是 \(\max(S - 100, 0)\)：100 以下处处为 0，100 以上依次是 2、4、6……
- **下边缘（\(S = 0\)）。** 股价一旦到零就永远是零，所以看涨期权在这里值 0（看跌期权值贴现后的行权价）。
- **上边缘（\(S = 400\)）。** 远高于行权价时，看涨期权就像“股票减去贴现的行权价”。

<figure>
<svg viewBox="0 0 660 270" role="img" aria-label="有限差分网格及两种差分模板">
<defs><marker id="finite-difference-ah0" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="60" y1="222" x2="385" y2="222" class="fx-axis" marker-end="url(#finite-difference-ah0)"/>
<line x1="60" y1="222" x2="60" y2="22" class="fx-axis" marker-end="url(#finite-difference-ah0)"/>
<circle cx="80" cy="40" r="6" class="fx-fill-orange"/><circle cx="80" cy="68" r="6" class="fx-fill-orange"/><circle cx="80" cy="96" r="6" class="fx-fill-orange"/><circle cx="80" cy="124" r="6" class="fx-fill-orange"/><circle cx="80" cy="152" r="6" class="fx-fill-orange"/><circle cx="80" cy="180" r="6" class="fx-fill-orange"/><circle cx="80" cy="208" r="6" class="fx-fill-orange"/>
<circle cx="125" cy="40" r="6" class="fx-fill-muted"/><circle cx="170" cy="40" r="6" class="fx-fill-muted"/><circle cx="215" cy="40" r="6" class="fx-fill-muted"/><circle cx="260" cy="40" r="6" class="fx-fill-muted"/><circle cx="305" cy="40" r="6" class="fx-fill-muted"/><circle cx="350" cy="40" r="6" class="fx-fill-muted"/>
<circle cx="125" cy="208" r="6" class="fx-fill-muted"/><circle cx="170" cy="208" r="6" class="fx-fill-muted"/><circle cx="215" cy="208" r="6" class="fx-fill-muted"/><circle cx="260" cy="208" r="6" class="fx-fill-muted"/><circle cx="305" cy="208" r="6" class="fx-fill-muted"/><circle cx="350" cy="208" r="6" class="fx-fill-muted"/>
<circle cx="125" cy="68" r="6" class="fx-fill-blue"/><circle cx="125" cy="96" r="6" class="fx-fill-blue"/><circle cx="125" cy="124" r="6" class="fx-fill-blue"/><circle cx="125" cy="152" r="6" class="fx-fill-blue"/><circle cx="125" cy="180" r="6" class="fx-fill-blue"/>
<circle cx="170" cy="68" r="6" class="fx-fill-blue"/><circle cx="170" cy="96" r="6" class="fx-fill-blue"/><circle cx="170" cy="124" r="6" class="fx-fill-blue"/><circle cx="170" cy="152" r="6" class="fx-fill-blue"/><circle cx="170" cy="180" r="6" class="fx-fill-blue"/>
<circle cx="215" cy="68" r="6" class="fx-box"/><circle cx="215" cy="96" r="6" class="fx-box"/><circle cx="215" cy="152" r="6" class="fx-box"/><circle cx="215" cy="180" r="6" class="fx-box"/>
<circle cx="260" cy="68" r="6" class="fx-box"/><circle cx="260" cy="96" r="6" class="fx-box"/><circle cx="260" cy="124" r="6" class="fx-box"/><circle cx="260" cy="152" r="6" class="fx-box"/><circle cx="260" cy="180" r="6" class="fx-box"/>
<circle cx="305" cy="68" r="6" class="fx-box"/><circle cx="305" cy="96" r="6" class="fx-box"/><circle cx="305" cy="124" r="6" class="fx-box"/><circle cx="305" cy="152" r="6" class="fx-box"/><circle cx="305" cy="180" r="6" class="fx-box"/>
<circle cx="350" cy="68" r="6" class="fx-box"/><circle cx="350" cy="96" r="6" class="fx-box"/><circle cx="350" cy="124" r="6" class="fx-box"/><circle cx="350" cy="152" r="6" class="fx-box"/><circle cx="350" cy="180" r="6" class="fx-box"/>
<line x1="176" y1="98" x2="206" y2="120" class="fx-line" marker-end="url(#finite-difference-ah0)"/>
<line x1="177" y1="124" x2="204" y2="124" class="fx-line" marker-end="url(#finite-difference-ah0)"/>
<line x1="176" y1="150" x2="206" y2="128" class="fx-line" marker-end="url(#finite-difference-ah0)"/>
<circle cx="215" cy="124" r="8" class="fx-hl"/>
<text x="80" y="240" text-anchor="middle" class="fx-t-sm">τ = 0</text>
<text x="350" y="240" text-anchor="middle" class="fx-t-sm">τ = T（今天）</text>
<text x="215" y="258" text-anchor="middle" class="fx-t-sm">离到期的时间 τ——从左往右解</text>
<text x="52" y="44" text-anchor="end" class="fx-t-sm">Smax</text>
<text x="52" y="212" text-anchor="end" class="fx-t-sm">0</text>
<text x="20" y="130" class="fx-t-sm">S</text>
<text x="92" y="30" class="fx-t-hl">收益已知</text>
<text x="230" y="30" class="fx-t-sm">边界已知</text>
<text x="440" y="40" class="fx-t-b">显式：3 个已知 → 1 个新值</text>
<circle cx="470" cy="70" r="6" class="fx-fill-blue"/><circle cx="470" cy="100" r="6" class="fx-fill-blue"/><circle cx="470" cy="130" r="6" class="fx-fill-blue"/>
<circle cx="580" cy="100" r="8" class="fx-hl"/>
<line x1="477" y1="73" x2="570" y2="97" class="fx-line" marker-end="url(#finite-difference-ah0)"/>
<line x1="477" y1="100" x2="569" y2="100" class="fx-line" marker-end="url(#finite-difference-ah0)"/>
<line x1="477" y1="127" x2="570" y2="103" class="fx-line" marker-end="url(#finite-difference-ah0)"/>
<text x="470" y="152" text-anchor="middle" class="fx-t-sm">第 n 列</text>
<text x="580" y="152" text-anchor="middle" class="fx-t-sm">第 n+1 列</text>
<text x="440" y="182" class="fx-t-b">隐式 / CN：新的一整列</text>
<text x="440" y="198" class="fx-t-b">一起解出来</text>
<circle cx="470" cy="236" r="6" class="fx-fill-blue"/>
<line x1="580" y1="212" x2="580" y2="260" class="fx-line-hl"/>
<circle cx="580" cy="212" r="7" class="fx-hl"/><circle cx="580" cy="236" r="7" class="fx-hl"/><circle cx="580" cy="260" r="7" class="fx-hl"/>
<line x1="477" y1="236" x2="569" y2="236" class="fx-line" marker-end="url(#finite-difference-ah0)"/>
</svg>
<figcaption>图 1 · 网格。最左一列（到期收益）和灰色的顶行、底行（\(S = 0\) 与 \(S_{\max}\) 处的边界）在开始计算之前就已知。紫色的列已经解出；显式格式接着由三个已知邻居算出每个新节点（带圈的那个）。隐式和 Crank–Nicolson 格式让每个新节点和它的新邻居互相牵连，所以一整列要作为一个小线性方程组一起解。</figcaption>
</figure>

Black-Scholes 方程告诉我们每一列和前一列的关系。最简单的（“显式”）写法下，规则是**三个邻居的加权平均**。价格步长 2 美元、时间步长 1/200 年时，\(S = 100\) 处的规则是：

$$
V_{\text{新}}(100) = 0.245\,V(98) + 0.500\,V(100) + 0.255\,V(102)
$$

其中 \(V(98)\)、\(V(100)\)、\(V(102)\) 是前一列（更靠近到期）在这三个价格上的值，\(V_{\text{新}}(100)\) 是离到期再远一步时的值。

> [!EXAMPLE] 手算一步
> 到期时，小凯的 100 看涨期权在三个价格上分别值 \(V(98) = 0\)、\(V(100) = 0\)、\(V(102) = 2\)。到期前一个时间步（约 1.8 天），网格给出
> \(V_{\text{新}}(100) = 0.245 \times 0 + 0.500 \times 0 + 0.255 \times 2 = 0.51\)。
> Black-Scholes 在 \(T = 1/200\) 时给出 0.57。对粗网格上的一步来说不算差。把这个做法一路推回今天——只要时间步足够多，后面会讲到——网格给出 9.92，精确值是 9.93。

三个权重加起来是 \(0.9998 = 1 - r\Delta t\)：先取平均，再贴现一天多一点。看着眼熟吗？本来就该眼熟——这就是一棵**三叉树**：“下、平、上”的概率分别是 0.245、0.500、0.255（[[binomial-trees]]）。有限差分和树，是同一种逆向归纳的两种方言。

::demo[finite-difference-grid]

麻烦来了。这些权重只有全都为正时，才称得上“概率”。在网格上部，股价很高，波动项 \(\tfrac12\sigma^2S^2\) 非常大，同样的时间步下，中间那个权重会变成**负数**：在 \(S = 398\) 处，规则变成 \(3.94\,V(396) - 6.92\,V(398) + 3.98\,V(400)\)。这已经不是平均了，而是一个放大器。任何一点点小抖动都会被放大、翻号、再放大，一步接一步，直到淹没整张网格。在上面那张 XYZ 网格上，这样走 200 步，看涨期权会变成 \(3.1 \times 10^{86}\) 美元。

> [!THINK] 价格步长 2 美元时，小凯看涨期权的显式格式大约需要 1,600 个时间步才能稳定。为了更准，你把价格步长细化到 1 美元。现在需要多少个时间步？
> 先预测，再打开答案。
> ---
> 大约 **6,400** 个——四倍。稳定性条件把时间步和价格步长的*平方*绑在一起（\(\Delta t \lesssim \Delta S^2/(\sigma^2 S_{\max}^2)\)），价格步长减半，允许的时间步就只剩四分之一。价格分辨率翻一倍，工作量变成八倍。这才是显式格式真正的代价，也是隐式格式存在的理由。

这一课拆成六块：

- **① 把 PDE 铺到网格上**
- **② 显式格式和它的稳定性极限**
- **③ 隐式与 Crank–Nicolson：任何步长都稳定**
- **④ 边界、网格设计与从网格读希腊字母**
- **⑤ 用投影处理美式期权**
- **⑥ 有限差分的位置**

## @mechanics
### ① 把 PDE 铺到网格上

改用离到期的时间 \(\tau = T - t\)，让已知的收益落在 \(\tau = 0\)，然后沿 \(\tau\) 往前推。[[black-scholes]] 里的方程变成

$$
\frac{\partial V}{\partial \tau} = \tfrac12\sigma^2 S^2\,\frac{\partial^2 V}{\partial S^2} + (r - q)\,S\,\frac{\partial V}{\partial S} - rV
$$

其中 \(V(S, \tau)\) 是期权价值，\(\partial V/\partial S\) 是 delta，\(\partial^2 V/\partial S^2\) 是 gamma，\(q\) 是股息率，\(\partial V/\partial\tau = -\Theta\)（离到期多一个单位时间，就是少挨一个单位时间的损耗）。读法是：*多出来的时间让价值上升的速度，正好等于凸性和持有收益带来的价值，减去融资成本*。

铺一张网格：\(S_i = i\,\Delta S\)（\(i = 0, \dots, M\)），\(\tau_n = n\,\Delta t\)（\(n = 0, \dots, N\)），用 \(V_i^n\) 表示节点 \((S_i, \tau_n)\) 上的值。每个导数都换成相邻值之差：

$$
\frac{\partial V}{\partial S} \approx \frac{V_{i+1}^n - V_{i-1}^n}{2\,\Delta S}, \qquad \frac{\partial^2 V}{\partial S^2} \approx \frac{V_{i+1}^n - 2V_i^n + V_{i-1}^n}{\Delta S^2}, \qquad \frac{\partial V}{\partial \tau} \approx \frac{V_i^{n+1} - V_i^n}{\Delta t}
$$

前两个是**中心差分**：误差随 \(\Delta S^2\) 缩小，价格步长减半，误差变成四分之一。第三个是时间方向的单侧差分，精度是 \(\Delta t\) 的一阶。

**XYZ 的网格。** 小凯的 1 年期看涨期权：\(S_{\max} = 400\)（行权价的四倍），\(M = 200\) 个价格步，每步 \(\Delta S = \$2\)；\(N = 200\) 个时间步，每步 \(\Delta t = 1/200\) 年（约 1.8 天）。一共 \(201 \times 201 \approx 40{,}000\) 个节点——整张网格几毫秒就解完。同样精度（约 1 美分）的蒙特卡洛需要约 200 万条路径。

### ② 显式格式和它的稳定性极限

把差分代入 PDE，解出唯一的未知数 \(V_i^{n+1}\)，其余都来自上一列：

$$
V_i^{n+1} = \underbrace{\tfrac12\Delta t\,\big(\sigma^2 i^2 - (r-q)\,i\big)}_{w_{\text{d}}}V_{i-1}^n + \underbrace{\big(1 - \Delta t\,(\sigma^2 i^2 + r)\big)}_{w_{\text{m}}}V_i^n + \underbrace{\tfrac12\Delta t\,\big(\sigma^2 i^2 + (r-q)\,i\big)}_{w_{\text{u}}}V_{i+1}^n
$$

这里 \(i = S_i/\Delta S\) 是节点编号（所以 \(\sigma^2 i^2 = \sigma^2 S_i^2/\Delta S^2\)），\(w_{\text{d}}, w_{\text{m}}, w_{\text{u}}\) 分别是向下、居中、向上的权重。在 XYZ 网格的 \(S = 100\) 处，\(i = 50\)，\(\sigma^2 i^2 = 0.04 \times 2{,}500 = 100\)，取 \(\Delta t = 0.005\)：
\(w_{\text{d}} = 0.005 \times 0.5 \times (100 - 2) = 0.245\)，\(w_{\text{m}} = 1 - 0.005 \times 100.04 = 0.4998\)，\(w_{\text{u}} = 0.005 \times 0.5 \times (100 + 2) = 0.255\)——正是直觉部分的那几个数。

<figure>
<svg viewBox="0 0 660 240" role="img" aria-label="健康节点与网格顶部的显式格式权重">
<line x1="40" y1="130" x2="300" y2="130" class="fx-axis"/>
<rect x="70" y="105.5" width="44" height="24.5" class="fx-ok"/>
<rect x="140" y="80" width="44" height="50" class="fx-ok"/>
<rect x="210" y="104.5" width="44" height="25.5" class="fx-ok"/>
<text x="92" y="98" text-anchor="middle" class="fx-t">0.245</text>
<text x="162" y="73" text-anchor="middle" class="fx-t">0.500</text>
<text x="232" y="97" text-anchor="middle" class="fx-t">0.255</text>
<text x="92" y="148" text-anchor="middle" class="fx-t-sm">V(98)</text>
<text x="162" y="148" text-anchor="middle" class="fx-t-sm">V(100)</text>
<text x="232" y="148" text-anchor="middle" class="fx-t-sm">V(102)</text>
<text x="162" y="30" text-anchor="middle" class="fx-t-b">S = 100（i = 50）</text>
<text x="162" y="180" text-anchor="middle" class="fx-t-ok">全部为正：是一个平均</text>
<text x="162" y="198" text-anchor="middle" class="fx-t-sm">合计 = 0.9998 = 1 − rΔt</text>
<line x1="360" y1="110" x2="630" y2="110" class="fx-axis"/>
<rect x="390" y="62.7" width="44" height="47.3" class="fx-bad"/>
<rect x="460" y="110" width="44" height="83" class="fx-bad"/>
<rect x="530" y="62.2" width="44" height="47.8" class="fx-bad"/>
<text x="412" y="56" text-anchor="middle" class="fx-t">3.94</text>
<text x="482" y="212" text-anchor="middle" class="fx-t-bad">−6.92</text>
<text x="552" y="56" text-anchor="middle" class="fx-t">3.98</text>
<text x="412" y="128" text-anchor="middle" class="fx-t-sm">V(396)</text>
<text x="552" y="128" text-anchor="middle" class="fx-t-sm">V(400)</text>
<text x="482" y="102" text-anchor="middle" class="fx-t-sm">V(398)</text>
<text x="495" y="30" text-anchor="middle" class="fx-t-b">S = 398（i = 199）</text>
<text x="495" y="232" text-anchor="middle" class="fx-t-bad">中间权重为负：变成了放大器</text>
</svg>
<figcaption>图 2 · XYZ 网格上的显式更新（\(\Delta S = 2\)，\(\Delta t = 1/200\)）。在 \(S = 100\) 处，三个权重都为正，行为就像三叉树的概率。在网格顶部，同样的时间步给出 −6.92 的中间权重（右半边的柱子按更小的比例画）：数值里的锯齿每一步都要乘上约 \(1 - \Delta t(2\sigma^2 i^2 + r) \approx -14.8\)。</figcaption>
</figure>

只要每个节点都满足 \(w_{\text{m}} \ge 0\)，权重就都非负，误差也就不会增长。最紧的是最顶上的节点，那里 \(i \approx M\)：

$$
\lambda \equiv \sigma^2 M^2\,\Delta t \le 1 \qquad \Longleftrightarrow \qquad \Delta t \lesssim \frac{1}{\sigma^2 M^2} = \frac{\Delta S^2}{\sigma^2 S_{\max}^2}
$$

其中 \(\lambda\) 是稳定性比值，\(M = S_{\max}/\Delta S\) 是价格步数，\(\Delta t\) 是时间步长（忽略 \(r\) 带来的小修正）。标准的（冯·诺伊曼）稳定性分析给出同样的极限，只差一个常数。

> [!EXAMPLE] 看着 XYZ 网格爆炸
> \(\sigma = 20\%\)、\(M = 200\)：\(\lambda = 0.04 \times 40{,}000 \times \Delta t = 1{,}600\,\Delta t\)，所以一年期的显式格式需要 \(N \ge 1{,}600\) 步。
> - \(N = 200\)（\(\lambda = 8\)）：价格 \(3.1 \times 10^{86}\)
> - \(N = 1{,}000\)（\(\lambda = 1.6\)）：价格 \(2.6 \times 10^{167}\)
> - \(N = 1{,}600\)（\(\lambda = 1.0\)）：价格 **9.9159**，Black-Scholes 是 9.9251
>
> 从“天文数字”到“准到一美分”，中间只隔着一个时间步长。

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="粗网格上显式格式的锯齿不稳定">
<defs><marker id="finite-difference-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="60" y1="155" x2="610" y2="155" class="fx-line-muted"/>
<line x1="60" y1="235" x2="615" y2="235" class="fx-axis" marker-end="url(#finite-difference-ah)"/>
<line x1="60" y1="235" x2="60" y2="20" class="fx-axis"/>
<polyline points="70,35 122,60 174,84 226,103 278,118 330,129 382,137 434,143 486,147 538,151 590,155" class="fx-line-ok"/>
<polyline points="70,35 122,60 174,84 226,103 278,118 330,130 382,130 434,169 486,84 538,225 590,155" class="fx-line-bad"/>
<circle cx="434" cy="169" r="4" class="fx-fill-red"/>
<circle cx="486" cy="84" r="4" class="fx-fill-red"/>
<circle cx="538" cy="225" r="4" class="fx-fill-red"/>
<text x="54" y="222" text-anchor="end" class="fx-t-sm">−50</text>
<text x="54" y="159" text-anchor="end" class="fx-t-sm">0</text>
<text x="54" y="97" text-anchor="end" class="fx-t-sm">50</text>
<text x="54" y="34" text-anchor="end" class="fx-t-sm">100</text>
<text x="70" y="252" text-anchor="middle" class="fx-t-sm">0</text>
<text x="174" y="252" text-anchor="middle" class="fx-t-sm">40</text>
<text x="278" y="252" text-anchor="middle" class="fx-t-sm">80</text>
<text x="382" y="252" text-anchor="middle" class="fx-t-sm">120</text>
<text x="486" y="252" text-anchor="middle" class="fx-t-sm">160</text>
<text x="590" y="252" text-anchor="middle" class="fx-t-sm">200</text>
<text x="330" y="252" text-anchor="middle" class="fx-t-b">K</text>
<text x="621" y="239" class="fx-t-sm">S</text>
<text x="160" y="190" class="fx-t-ok">N = 60（λ = 0.6）：平滑的看跌曲线</text>
<text x="160" y="210" class="fx-t-bad">N = 16（λ = 2.25）：高价区出现锯齿</text>
<text x="440" y="60" class="fx-t-sm">数值 +56.8、−56.3：</text>
<text x="440" y="76" class="fx-t-sm">看跌期权不可能为负</text>
</svg>
<figcaption>图 3 · 一张 1 年期看跌期权，\(\sigma = 60\%\)，放在一张粗网格上（\(\Delta S = 20\)，11 个价格档），用显式格式解到今天。用 60 个时间步，数值连成一条平滑、合理的曲线；用 16 个时间步，高价区的几行在 +57 和 −56 之间来回跳——看跌期权不可能有这种值——同样的步长再多走几步，锯齿会无限变大。上面的内嵌演示可以重现这两次运行。</figcaption>
</figure>

> [!DEEP] 为什么偏偏是锯齿最危险
> 在节点 \(i\) 给显式更新喂一个纯锯齿 \(V_i = (-1)^i\)，输出是 \(\big(w_{\text{m}} - w_{\text{d}} - w_{\text{u}}\big)(-1)^i = \big(1 - \Delta t\,(2\sigma^2 i^2 + r)\big)(-1)^i\)。只要 \(\Delta t\,\sigma^2 i^2 > 1\)（忽略 \(r\)），锯齿就会以绝对值大于 1 的倍数存活下来。平滑的形态会被削弱，而网格能表示的最高频形态最先被放大。舍入误差和行权价处的折角里，每种频率都含有一点，所以在真实网格上，“种子”总是有的。

### ③ 隐式与 Crank–Nicolson：任何步长都稳定

显式格式在*旧*的一列上计算 PDE 的右端。改成在*新*的一列上算，或者两者混合：

$$
\frac{V_i^{n+1} - V_i^n}{\Delta t} = \theta\,\big(\mathcal{L}V\big)_i^{n+1} + (1 - \theta)\,\big(\mathcal{L}V\big)_i^{n}
$$

其中 \((\mathcal{L}V)_i\) 是节点 \(i\) 上离散化右端 \(\tfrac12\sigma^2 S_i^2 V_{SS} + (r-q)S_iV_S - rV\) 的简写，\(\theta\) 决定格式：\(\theta = 0\) 显式，\(\theta = 1\) **全隐式**，\(\theta = \tfrac12\) **Crank–Nicolson**。只要 \(\theta > 0\)，每个新值就依赖于它的*新*邻居，所以一整列得同时解。这个方程组是三对角的——每个方程只含三个未知数——托马斯算法（Thomas algorithm）大约 \(8M\) 次运算就能解完，和显式更新一样便宜。

回报是：隐式和 Crank–Nicolson 格式**对任何时间步都稳定**。精度则是另一回事。全隐式在时间上只有一阶（误差与 \(\Delta t\) 成正比）；Crank–Nicolson 在 \(\Delta t\) 和 \(\Delta S\) 两个方向上都是二阶。

| 网格（\(M = N\)） | 隐式 | 误差 | Crank–Nicolson | 误差 | 显式（\(N = 1{,}600\) 等） |
|---|---|---|---|---|---|
| 100 × 100 | 9.8749 | −0.0502 | 9.8855 | −0.0396 | 9.8881（\(N = 401\)） |
| 200 × 200 | 9.9100 | −0.0151 | 9.9152 | −0.0098 | 9.9159（\(N = 1{,}601\)） |
| 400 × 400 | 9.9200 | −0.0051 | 9.9226 | −0.0025 | 9.9228（\(N = 6{,}401\)） |

小凯的 1 年期看涨期权，Black-Scholes 价 9.9251。网格每加密一倍，Crank–Nicolson 的误差就缩小到四分之一（−0.0396、−0.0098、−0.0025）：二阶方法的标志。在同一张价格网格上，显式格式和 Crank–Nicolson 一样准，但时间步最多要多 16 倍。固定 \(M = 200\)、减少时间步，就能看出两种稳定格式的差别：\(N = 10\) 时，隐式给出 9.8112，Crank–Nicolson 已经是 9.8912；\(N = 25\) 时，9.8735 对 9.9156。

> [!WARN] Crank–Nicolson 与行权价处的折角
> 收益在行权价处有个折角，而 Crank–Nicolson 对高频误差的衰减很弱。时间步很大时，它可能在 \(K\) 附近留下小幅振荡——从网格上读出的 gamma 振荡更大。标准的修补办法是 **Rannacher 平滑**：前两到四步用全隐式（衰减很强），之后再换回 Crank–Nicolson。

一个紧凑的 Crank–Nicolson Python 求解器（为了清楚用了稠密矩阵求解；生产代码会用三对角求解器）：

```python
import numpy as np

def cn_call(S0, K, T, r, sigma, M=200, N=200):
    Smax = 4 * max(S0, K); dt = T / N
    S = np.linspace(0, Smax, M + 1); i = np.arange(1, M)
    a = 0.5 * dt * (sigma**2 * i**2 - r * i)      # weight on V[i-1]
    b = -dt * (sigma**2 * i**2 + r)                # weight on V[i]
    c = 0.5 * dt * (sigma**2 * i**2 + r * i)       # weight on V[i+1]
    A = np.diag(1 - 0.5 * b) - np.diag(0.5 * a[1:], -1) - np.diag(0.5 * c[:-1], 1)
    B = np.diag(1 + 0.5 * b) + np.diag(0.5 * a[1:], -1) + np.diag(0.5 * c[:-1], 1)
    V = np.maximum(S - K, 0.0)                     # payoff at expiry (tau = 0)
    for n in range(1, N + 1):
        top_old = Smax - K * np.exp(-r * (n - 1) * dt)
        top_new = Smax - K * np.exp(-r * n * dt)
        rhs = B @ V[1:M]
        rhs[-1] += 0.5 * c[-1] * (top_old + top_new)   # boundary at S_max
        V[1:M] = np.linalg.solve(A, rhs)
        V[0], V[M] = 0.0, top_new
    return np.interp(S0, S, V)

print(cn_call(100, 100, 1.0, 0.04, 0.20))   # about 9.915 (Black-Scholes 9.925)
```

### ④ 边界、网格设计与从网格读希腊字母

**边界条件。** 在 \(S = 0\)：看涨期权值 0，看跌期权值 \(Ke^{-r\tau}\)。在 \(S_{\max}\)：看涨期权值 \(S_{\max}e^{-q\tau} - Ke^{-r\tau}\)，看跌期权值 0。\(S_{\max}\) 取得太低，这些条件就错得足以渗进答案；通常取行权价的三到五倍（或到期价格的好几个标准差），演示里取四倍。

**网格设计**决定了大部分精度：

- **让现价和行权价落在格点上。** \(M = 50\) 时价格步长是 8 美元，\(S = 100\) 落在两个格点之间，\(K = 100\) 处的折角也被抹平：误差是 +0.15，比网格尺寸暗示的差得多。对齐网格（或在含行权价的那一格里把收益平滑一下）能解决大部分问题。
- **用 \(\ln S\) 网格或拉伸网格。** 在 \(\ln S\) 上均匀分格，能让系数变成常数，并把分辨率放在股价最可能去的地方；在行权价附近加密格点，效果类似。
- **让时间网格对齐事件。** 除息日、障碍观察日、行权日都应该落在时间步上。

**白送的希腊字母。** 一次求解就给出今天这一列上的整条曲线 \(V(S)\)，所以 delta 和 gamma 就是 ① 里的中心差分，theta 则是一次 PDE 计算（或最后两列之差）。小凯的看涨期权，400 × 400 的 Crank–Nicolson 网格（\(\Delta S = 1\)）：

- \(\Delta = (V_{101} - V_{99})/2 = 0.61785\)，Black-Scholes 是 0.61791
- \(\Gamma = (V_{101} - 2V_{100} + V_{99})/1 = 0.019076\)，对比 0.019069
- 离到期少一天，网格价变化 −0.0161，Black-Scholes 的 theta 是每天 −0.0161（[[theta]]）

不用额外模拟，没有扰动噪声——这是交易台只要维度允许就偏爱 PDE 方法的主要原因之一。

### ⑤ 用投影处理美式期权

美式期权在任何节点都可以行权，所以它的价值永远不会低于收益。网格只需在每个时间步多加一行：算出新的一列后，把它**投影**到收益上，

$$
V_i^{n+1} \leftarrow \max\!\big(V_i^{n+1},\ \text{收益}(S_i)\big)
$$

其中左边的 \(V_i^{n+1}\) 是刚算出的继续持有价值，收益对看跌期权是 \(\max(K - S_i, 0)\)。这正是树上的规则 \(\max(\text{立即行权}, \text{继续持有})\)（[[binomial-trees]]）。对显式格式，这样做就够了。对隐式和 Crank–Nicolson 格式，在线性求解之后再投影是一个很接近的近似；严格的做法是解一个*线性互补问题*——新的一列在“继续持有”的区域满足 PDE、在“行权”的区域等于收益、并且处处不低于收益——常用**投影 SOR**（在每次迭代内部都取 max 的逐次超松弛）或策略迭代法。

> [!EXAMPLE] 小凯的 1 年期美式看跌期权
> Crank–Nicolson 加投影，400 × 400 网格：**6.4001**。1,000 步的二叉树给出 6.4033（5,000 步：6.4039）。欧式看跌是 6.0040。所以提前行权的权利每股约值 \(6.40 - 6.00 = \$0.40\)，一张合约 \(\$40\)。网格上哪些地方会行权？为什么？这就是 [[american-exercise]] 的全部内容。

### ⑥ 有限差分的位置

| | 树 | 有限差分 | 蒙特卡洛 |
|---|---|---|---|
| 最适合的维度 | 1 | 1–3 | 任意 |
| 提前行权 | 容易（节点取 max） | 容易（投影 / 投影 SOR） | 难（回归，[[american-exercise]]） |
| 希腊字母 | 由最初几个节点得到 | 由网格得到，几乎免费 | 扰动、逐路径或似然比 |
| 路径依赖 | 别扭 | 多加一个状态变量 | 天然适合 |
| 误差表现 | 随步数振荡 | 平滑，二阶（CN） | 随机，\(1/\sqrt{N}\) |

只要问题有一到三个状态变量，有限差分就是主力：带分红和提前行权的个股与指数期权、障碍期权（障碍直接成了网格的一条边界，恰得其所），以及 Heston 随机波动率这样的双因子模型——那里用分裂方法（ADI，“交替方向隐式”）一次只解一个方向（[[stochastic-vol]]）。超过三维，网格规模爆炸，就轮到 [[monte-carlo]] 了。

> [!HISTORY] 从热传导到期权
> John Crank 和 Phyllis Nicolson 在 1947 年为热传导方程发表了这个格式——而 Black-Scholes 方程经过变量替换（对数价格、离到期时间、再对价值做一次缩放）*就是*热传导方程。1970 年代后期，Michael Brennan 和 Eduardo Schwartz 是最早在网格上求解期权定价方程的人之一，其中就包括美式看跌期权。

## @analogy
想象一根**长长的金属棒**，你想预测它的温度，在等间距的点上测量。每个点下一次的读数，由它自己和两个邻居的读数决定：热点挨着冷点，就会降温。这就是显式更新。只要读数够勤，它就好用。可如果两次读数隔得太久，热点会“矫枉过正”：它降温降过了头，反而比冷邻居还冷；下一轮邻居再矫枉过正回来，一个锯齿就越长越大，直到数字变成胡话。隐式的做法则是让所有点同时商定新的温度——整根棒一次解出来——可以放心地迈大步。

这个类比在一点上是精确的：Black-Scholes 方程真的就是乔装打扮的热传导方程，期权价值在价格之间“扩散”，就像热量沿着金属棒扩散。它失效的地方是：我们这根棒一头导热更快——扩散项随 \(S^2\) 增长——所以网格的高价端最先出事。而且我们的钟是倒着走的：从到期日出发，那里的“温度”就是收益，一路走回今天。

## @misconceptions
- **“显式格式爆了，说明模型或 PDE 有问题。”** —— PDE 没问题，是这个时间步下的数值方法不稳定。满足 \(\lambda = \sigma^2M^2\Delta t \le 1\)，同样的代码给出 9.92。
- **“隐式格式无条件稳定，所以时间步随便取。”** —— 稳定不等于准确。全隐式只用 10 个时间步，小凯的看涨期权算成 9.81，差了 11 美分；同样步数的 Crank–Nicolson 是 9.89。
- **“价格网格越细只会越好。”** —— 对显式格式，这会逼着时间步按 \(\Delta S^2\) 缩小：价格分辨率翻倍，时间步就要变成四倍，否则不稳定。
- **“Crank–Nicolson 永远是最好的选择。”** —— 它是二阶的，但步长很大时会在行权价附近抖动，gamma 尤其明显。先走几步隐式（Rannacher 平滑）。
- **“一张网格只给出一个现价下的一个价格。”** —— 一次求解就给出网格上每个现价的价值，外加 delta、gamma 和 theta，全都不必重算。

## @takeaways
- 有限差分在“价格 × 时间”网格上，从收益出发把 Black-Scholes PDE 倒着解；显式格式的每一步都是三个邻居的三叉树式平均。
- 显式格式只在 \(\lambda = \sigma^2 M^2 \Delta t \le 1\) 时稳定；超过它，负的中间权重会把锯齿放大到天文数字（小凯的看涨期权用 200 步是 \(3.1 \times 10^{86}\)）。
- 隐式和 Crank–Nicolson 每步解一个三对角方程组，任何步长都稳定；Crank–Nicolson 是二阶的：网格加密一倍，误差缩小到四分之一。
- 网格设计（边界、让现价和行权价落在格点上、对数网格）决定精度；delta、gamma、theta 直接从网格上读出来。
- 美式期权只需每步多做一次投影 \(\max(V, \text{收益})\)（或投影 SOR）；XYZ 的 1 年期美式看跌约 6.40，欧式是 6.00。

## @quiz
1. 小凯看涨期权的显式格式在 \(M = 200\) 个价格步、\(N = 1{,}600\) 个时间步时是稳定的。你改用 \(M = 400\)。保持稳定最少需要多少个时间步？
   - [ ] 1,600
   - [x] 约 6,400
   - [ ] 3,200
   - [ ] 约 800
   > 稳定性比值是 \(\lambda = \sigma^2 M^2 \Delta t\)。\(M\) 翻倍，\(M^2\) 变成四倍，所以 \(\Delta t\) 必须缩小到四分之一：\(N \ge 0.04 \times 400^2 = 6{,}400\)。
2. 为什么显式格式的不稳定是从价格网格的顶部、而不是行权价附近开始的？
   - [ ] 因为那里的收益最大
   - [ ] 因为 \(S_{\max}\) 处的边界条件是错的
   - [ ] 因为高价区利率项占主导
   - [x] 因为扩散系数 \(\tfrac12\sigma^2 S^2\) 在那里最大，中间权重在那里最先变成负数
   > 中间权重是 \(1 - \Delta t(\sigma^2 i^2 + r)\)，随 \(i\) 增大而减小。同样的时间步下，\(S = 100\) 处是 0.4998，\(S = 398\) 处是 −6.92。
3. 全隐式格式在 \(M = 200\)、只用 \(N = 10\) 个时间步时，把小凯的看涨期权算成 9.81，而真值是 9.93。这是怎么回事？
   - [x] 格式是稳定的，但时间上只有一阶精度，十个大步留下了明显误差
   - [ ] 格式不稳定，马上要爆了
   - [ ] 价格网格太粗，只能加价格步
   - [ ] 隐式格式不能给看涨期权定价
   > 隐式格式永远不会爆，但时间误差与 \(\Delta t\) 成正比。\(N = 100\) 时隐式价是 9.90；时间上二阶的 Crank–Nicolson 在 \(N = 10\) 时就已经是 9.89。
4. 有限差分求解器怎样处理美式看跌期权？
   - [ ] 先算欧式看跌，再加一个固定溢价
   - [ ] 行权决策要靠蒙特卡洛模拟
   - [x] 每个时间步之后，把每个节点设为“算出的值”与“立即行权值”中较大的那个（或用投影 SOR 解同一个条件）
   - [ ] 移动 \(S = 0\) 处的边界条件
   > 这个投影就是树上 \(\max(\text{行权}, \text{持有})\) 的网格版本。XYZ 的 1 年期美式看跌因此得到 6.40，欧式是 6.00。
5. 对小凯的看涨期权做一次 Crank–Nicolson 求解之后，下面哪些不用重新求解就能读出来？
   - [ ] 只有 \(S = 100\) 处的价格
   - [x] 网格上每个价格的价值，外加由相邻节点得到的 delta 和 gamma（以及由最后两列得到的 theta）
   - [ ] 价格和 delta，但 gamma 要用扰动后的现价再解一次
   - [ ] 只有 vega，因为网格依赖 \(\sigma\)
   > 网格返回整条曲线 \(V(S)\)；中心差分给出 \(\Delta = 0.6179\)、\(\Gamma = 0.0191\)。真正需要再解一次的是 vega，因为 \(\sigma\) 写进了系数里。

## @further
- [Finite difference methods for option pricing（维基百科）](https://en.wikipedia.org/wiki/Finite_difference_methods_for_option_pricing) —— 概览，以及显式格式与三叉树之间的联系。
- [Crank–Nicolson method（维基百科）](https://en.wikipedia.org/wiki/Crank%E2%80%93Nicolson_method) —— 这个格式、它的稳定性，以及遇到不光滑数据时的振荡问题。
- [Von Neumann stability analysis（维基百科）](https://en.wikipedia.org/wiki/Von_Neumann_stability_analysis) —— 显式稳定性极限背后的傅里叶论证。
- [Tridiagonal matrix algorithm（维基百科）](https://en.wikipedia.org/wiki/Tridiagonal_matrix_algorithm) —— 让隐式步和显式步一样便宜的托马斯算法。
- [Black–Scholes equation（维基百科）](https://en.wikipedia.org/wiki/Black%E2%80%93Scholes_equation) —— 这个 PDE、它的推导，以及化为热传导方程的变换。

## @next
网格刚刚给美式看跌定价 6.40 美元，比欧式高 40 美分。这笔溢价来自网格上那些说“现在就行权”的节点。它们究竟在哪里？到期临近时那条边界怎样移动——一个只会向前跑的模拟，又怎么可能找到它？
