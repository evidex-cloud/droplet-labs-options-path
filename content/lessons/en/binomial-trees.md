---
id: binomial-trees
prereqs: binomial-one-step, risk-neutral
demo: binomial-trees
---

# Multi-Step Trees & American Options

## @hook
One step of up-or-down is a cartoon. Chain three steps and the tree already prices the 1-year XYZ call at $10.54; chain 500 and it lands at $9.92, within a cent of Black-Scholes. The same tree can also ask, at every node, “is it better to exercise right now?”, a question no closed-form formula answers.

## @bridge
[[binomial-one-step]] priced a single up-or-down step by replication. [[risk-neutral]] turned that into a recipe: average the payoff with the weight \(q\), then discount at \(r\). This lesson repeats the recipe backwards, node by node, over many small steps. That is the Cox–Ross–Rubinstein (CRR) tree. It builds Idea ② (no-arbitrage), because every node is a tiny replication. It delivers the two things the next lessons need: the tree's limit is [[black-scholes]], and its node-by-node exercise check is the standard tool for [[american-exercise]].

## @intuition
A real stock doesn't jump once a year; it moves all the time. But over a *short* step, “up a bit or down a bit” is a decent description. So slice the year into several steps and let XYZ go up or down at each one.

Take Kai's XYZ (\(S = 100\), volatility 20%, rate 4%) and a year cut into **three steps of four months**. At each step XYZ is multiplied by \(u = 1.1224\) (up 12.24%) or by \(d = 0.8909\) (down 10.91%). Why those numbers comes in mechanics ①; for now notice one thing. **Up-then-down lands exactly where down-then-up lands**: \(100 \times 1.1224 \times 0.8909 = 100\). The branches merge back together, so three steps give just four possible prices at the end (141.40, 112.24, 89.09, 70.72), not eight. A tree whose branches merge like this is called **recombining**.

Now price the 1-year 100-strike call. The trick is to **start at the end**:

1. At expiry the call is worth its payoff: 41.40, 12.24, 0, 0.
2. Step back one column. Each node is a one-step problem exactly like [[binomial-one-step]]: average its two children with \(q = 0.529\) (up) and \(0.471\) (down), then discount four months at 4%.
3. Repeat until you reach today.

<figure>
<svg viewBox="0 0 680 345" role="img" aria-label="A three-step binomial tree for the 1-year XYZ call">
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
<text x="80" y="336" text-anchor="middle" class="fx-t-sm">today</text>
<text x="250" y="336" text-anchor="middle" class="fx-t-sm">4 months</text>
<text x="420" y="336" text-anchor="middle" class="fx-t-sm">8 months</text>
<text x="590" y="336" text-anchor="middle" class="fx-t-sm">1 year (payoff)</text>
<text x="28" y="40" class="fx-t-sm">u = 1.1224, d = 0.8909</text>
<text x="28" y="58" class="fx-t-sm">q = 0.529 up, 0.471 down</text>
<text x="28" y="76" class="fx-t-sm">discount per step 0.9868</text>
</svg>
<figcaption>Figure 1 · A three-step recombining tree for the 1-year, 100-strike XYZ call (σ 20%, r 4%). Stock prices (S) grow left to right; option values (C) are filled right to left, starting from the payoffs in the last column. Each node is the discounted \(q\)-average of its two children. The tree's answer, 10.54, is already close to Black-Scholes' 9.93.</figcaption>
</figure>

> [!KAI] What early exercise is worth to Kai
> Kai owns XYZ and looks at a 1-year 100-strike **put** as protection. Listed stock options are American, so Kai could exercise it any day. A 500-step tree says the American put is worth about **$6.40**. The European version, exercisable only at expiry, is **$6.00** by Black-Scholes. The extra 40 cents per share (about $40 per contract) is the price of the right to cash in early. Mechanics ④ shows exactly when using that right is the smart move.

Three steps is still crude. With more steps the tree's price wiggles and then settles. Watch it happen:

::demo[binomial-trees-converge]

> [!THINK] Going from 2 steps to 3 steps, the tree's price for the 1-year call jumps from 9.02 up to 10.54. The Black-Scholes value is 9.93. Will adding steps make the price approach 9.93 smoothly from one side?
> Predict first: what could make an even number of steps behave differently from an odd number?
> ---
> No, it zigzags: 10 steps give 9.73, 11 give 10.09, 100 give 9.91, 101 give 9.94. With an even number of steps the middle final node sits exactly on the strike (\(u^j d^j \times 100 = 100\)); with an odd number the strike falls between two nodes. The two families approach 9.93 from opposite sides, and the error shrinks roughly like \(1/N\). Averaging two neighbours cancels most of it: \((9.905 + 9.943)/2 = 9.924\).

We'll take it in five parts:

- **① Building the tree (CRR)**: where \(u\), \(d\) and \(q\) come from
- **② Backward induction**: one rule, applied at every node
- **③ Convergence to Black-Scholes**, zigzag included
- **④ American options**: the early-exercise check
- **⑤ Greeks from the tree, and where trees are used today**

## @mechanics
### ① Building the tree (CRR)

Cut the time to expiry \(T\) into \(N\) steps of length \(\Delta t = T/N\). Cox, Ross and Rubinstein chose the up and down factors so that the tree has the right volatility:

$$
u = e^{\sigma\sqrt{\Delta t}}, \qquad d = \frac{1}{u} = e^{-\sigma\sqrt{\Delta t}}, \qquad q = \frac{e^{r\Delta t} - d}{u - d}
$$

Where:

- \(\sigma\) is the annual volatility and \(\sigma\sqrt{\Delta t}\) the size of one step in log-price. Each step moves \(\ln S\) by \(\pm\sigma\sqrt{\Delta t}\), so its variance is \(\sigma^2\Delta t\). \(N\) steps add up to \(\sigma^2 T\), the right total variance. That's the \(\sqrt{T}\) rule, which [[random-walk]] explains properly;
- \(d = 1/u\) makes the tree recombine: an up and a down cancel;
- \(q\) is the risk-neutral up-weight from [[risk-neutral]], now per step. With a dividend yield, \(e^{r\Delta t}\) becomes \(e^{(r - \text{dividend yield})\Delta t}\).

> [!EXAMPLE] The three-step XYZ tree
> \(\Delta t = 1/3\), \(\sigma\sqrt{\Delta t} = 0.2 \times 0.5774 = 0.1155\):
> $$
> \begin{gathered}
> u = e^{0.1155} = 1.1224, \qquad d = 0.8909 \\
> q = \frac{e^{0.04/3} - 0.8909}{1.1224 - 0.8909} = \frac{1.0134 - 0.8909}{0.2315} = 0.529
> \end{gathered}
> $$
> After \(j\) ups and \(N - j\) downs the price is \(100\,u^j d^{N-j}\): for \(N = 3\), that's 141.40, 112.24, 89.09 and 70.72.

Recombining is what makes trees practical. A 500-step tree has \(2^{500}\) possible *paths* but only 501 final nodes and \(501 \times 502 / 2 = 125{,}751\) nodes in total, which a laptop fills in a few milliseconds.

### ② Backward induction

Label a node by its step \(i\) and its number of up moves \(j\). The whole algorithm is one rule, applied from the last column back to the first:

$$
V_{i,j} = e^{-r\Delta t}\Big[\,q\,V_{i+1,\,j+1} + (1 - q)\,V_{i+1,\,j}\,\Big], \qquad V_{N,j} = \max\!\big(S_{N,j} - K,\ 0\big)
$$

In words: the value at a node is the discounted risk-neutral average of the two nodes it can move to. At the last column, the value is simply the payoff (for a put, \(\max(K - S_{N,j}, 0)\)).

> [!EXAMPLE] One node by hand
> The node where XYZ is at 125.98 after eight months. Its children are worth 41.40 (up) and 12.24 (down):
> $$
> \begin{aligned}
> V &= e^{-0.04/3}\,\big(0.529 \times 41.40 + 0.471 \times 12.24\big) \\
>   &= 0.9868 \times (21.91 + 5.76) = 27.30
> \end{aligned}
> $$
> Repeat for every node and the root comes out at 10.54.

Every node is also a little replication, with its own hedge ratio \(\Delta = (V_{\text{up}} - V_{\text{down}})/(S_{\text{up}} - S_{\text{down}})\). At the root, \(\Delta = (17.23 - 3.34)/(112.24 - 89.09) = 0.60\). At the 125.98 node, where the call is sure to finish in the money, \(\Delta = 1.00\). At the 79.38 node it is 0, and at 89.09 it is 0.31. **The hedge changes as the stock moves**, so a hedger has to buy shares after rises and sell after falls. That's the rebalancing at the heart of [[delta-hedging]], and the reason the copy in [[binomial-one-step]] had to be re-mixed.

### ③ Convergence to Black-Scholes

Add steps and the tree's price for the 1-year XYZ call settles toward the Black-Scholes value:

| Steps \(N\) | 1 | 2 | 3 | 5 | 10 | 11 |
|---|---|---|---|---|---|---|
| Call price | 11.73 | 9.02 | 10.54 | 10.30 | 9.73 | 10.09 |
| **Steps \(N\)** | **50** | **51** | **100** | **101** | **500** | **1,000** |
| Call price | 9.89 | 9.96 | 9.91 | 9.94 | 9.92 | 9.92 |

Black-Scholes: **9.93**. Why does the limit exist? After \(N\) steps with \(j\) ups, \(\ln S_T = \ln S + (2j - N)\,\sigma\sqrt{\Delta t}\). The number of ups \(j\) follows a binomial distribution, and by the central limit theorem a binomial count becomes normal as \(N\) grows. So \(\ln S_T\) becomes normal: the stock price becomes **lognormal**, exactly the assumption behind Black-Scholes. “Discounted \(q\)-average over the tree” turns into “discounted \(\Q\)-expectation over a lognormal”, and [[black-scholes]] evaluates that expectation in closed form.

The zigzag from the THINK box is a feature of where the strike sits among the final nodes. Practitioners either use many steps, average two neighbouring \(N\), or smooth the last step. For a single European price the closed-form formula is faster anyway. Trees earn their keep elsewhere.

### ④ American options: the early-exercise check

An American option can be exercised at any node, not just at the end. The tree handles this with one extra comparison per node:

$$
V_{i,j} = \max\Big(\underbrace{\text{exercise value}}_{K - S_{i,j}\ \text{for a put}},\ \underbrace{e^{-r\Delta t}\big[q\,V_{i+1,j+1} + (1-q)\,V_{i+1,j}\big]}_{\text{continuation value}}\Big)
$$

Where the exercise value is what you'd get by exercising right now, and the continuation value is the risk-neutral value of holding on (the ordinary backward-induction number). The holder picks the larger one, and nodes where exercising wins are the **early-exercise nodes**.

<figure>
<svg viewBox="0 0 680 345" role="img" aria-label="The same tree for an American put, with an early-exercise node">
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
<text x="80" y="336" text-anchor="middle" class="fx-t-sm">today</text>
<text x="250" y="336" text-anchor="middle" class="fx-t-sm">4 months</text>
<text x="420" y="336" text-anchor="middle" class="fx-t-sm">8 months</text>
<text x="590" y="336" text-anchor="middle" class="fx-t-sm">1 year (payoff)</text>
<text x="28" y="262" class="fx-t-btc">★ exercise now: 100 − 79.38 = 20.62</text>
<text x="28" y="280" class="fx-t-sm">hold on: 0.9868 × (0.529 × 10.91</text>
<text x="28" y="296" class="fx-t-sm">+ 0.471 × 29.28) = 19.30</text>
<text x="28" y="40" class="fx-t-sm">American put, K = 100</text>
<text x="28" y="58" class="fx-t-sm">European version: 6.62</text>
</svg>
<figcaption>Figure 2 · The same tree for a 1-year 100-strike **American put**. At the starred node (XYZ at 79.38 after eight months), exercising pays 20.62 while holding on is worth only 19.30, so the holder exercises. That one decision lifts every value to its left: the root becomes 6.91 instead of the European 6.62.</figcaption>
</figure>

Why would anyone exercise a put early and give up its remaining time value? Exercising a deep in-the-money put hands you \(K = \$100\) *now*. The interest you'd earn on it over the remaining time can be worth more than the small chance that XYZ falls even further. The deeper in the money, the stronger this pull. With 1,000 steps:

| Strike | American put | European put (Black-Scholes) | Early-exercise premium |
|---|---|---|---|
| 100 | 6.40 | 6.00 | 0.40 |
| 110 | 12.33 | 11.35 | 0.98 |
| 120 | 20.33 | 18.29 | 2.04 |
| 130 | 30.00 | 26.40 | 3.60 |

At \(K = 130\) the American put is worth exactly its intrinsic value, 30.00: the tree says exercise immediately.

With many steps, the early-exercise nodes form a solid region at the bottom of the tree. Its upper edge is a curve called the **exercise boundary**: exercise as soon as XYZ falls below it. For the 1-year 100-strike put, a 1,000-step tree puts the boundary at about 80.65 with nine months left, 82.72 with six months left, 85.92 with three months left, 89.24 with about five weeks left and 95.07 with four days left. The boundary rises toward the strike as expiry approaches, because there's less time value left to give up. Finding that curve is the central problem of [[american-exercise]].

The American **call** on a stock that pays no dividend is different. The tree never finds an early-exercise node, and its price, 9.92 at 500 steps, equals the European one.

> [!DEEP] Why an American call on a non-dividend stock is never exercised early
> From [[arbitrage-bounds]], a call is always worth at least \(S - Ke^{-r\tau}\), where \(\tau\) is the time left. With \(r > 0\) that is more than \(S - K\), the amount exercise would give you. So selling the call (or just holding it) always beats exercising it. Exercising early means paying the strike sooner than necessary and throwing away the insurance of the time value. A dividend changes this: just before the stock goes ex-dividend, exercising can capture the dividend ([[exercise-assignment]]).

> [!WARN] American vs European in real markets
> Standard US single-stock and ETF options (and SPY) are American; SPX and XSP index options are European and cash-settled (as of 2026, per exchange specifications). Put-call parity holds exactly only for European options; for American ones it becomes a pair of inequalities. When you compare a tree price with a quote, check the exercise style first.

### ⑤ Greeks from the tree, and where trees are used today

The tree hands you Greeks almost for free, from nodes it has already computed:

- **Delta** from the two nodes after one step: \(\Delta \approx (V_{1,1} - V_{1,0})/(S_{1,1} - S_{1,0})\);
- **Gamma** from how that delta changes across the three nodes after two steps;
- **Theta** from comparing the middle node two steps ahead, which has the same stock price as today, with today's value.

For the 1-year XYZ call with 500 steps: \(\Delta = 0.618\), \(\Gamma = 0.0191\), \(\Theta = -0.0161\) per day, matching the Black-Scholes values 0.618, 0.019 and −0.016 ([[greeks-map]]).

Where trees are used today:

- **American options and dividends.** Most listed single-stock options are American, and many pay discrete dividends. Trees (and their cousin, the finite-difference grid of [[finite-difference]]) are standard tools for these, because they check early exercise at every node. A known cash dividend is easy to add: the stock price drops by the dividend at the ex-date column, and the tree's exercise check will then spot the nodes, just before that column, where exercising an in-the-money call to capture the dividend beats holding it.
- **Teaching and checking.** A tree is transparent: every number can be traced. Desks use simple trees to sanity-check faster models.
- **Where trees struggle.** Options whose payoff depends on the whole path (averages, barriers) and problems with many underlyings make trees explode in size; there Monte Carlo ([[monte-carlo]]) takes over.

## @analogy
Think of a TV game show where, each round, the host offers you a cash deal to walk away, and you can accept (take the money) or keep playing. How much is it worth to *be* in the game at round one?

A smart contestant reasons backwards. In the final round there's no choice left: you get whatever the last box holds. One round earlier you compare the host's offer with the average of what the final round could give, and take the better. Keep stepping back like this and, at the start, you know the value of being in the game and exactly when you would accept an offer.

That's the binomial tree. The final boxes are the option's payoffs at expiry. “The average of what's next” is the discounted \(q\)-average of the two child nodes. The host's offer is the exercise value of an American option, and the nodes where you'd accept are the early-exercise nodes.

Where the analogy breaks: a game show's averages use real odds and the contestant's appetite for risk. The tree's averages use risk-neutral weights that come from hedging, not from anyone's odds. The show's paths also branch forever, while a stock tree recombines: up-then-down lands in the same place as down-then-up, which is what keeps a 500-step tree small.

## @misconceptions
- **“More steps always bring the tree price closer to Black-Scholes.”** — Not monotonically. The price zigzags between even and odd step counts (9.73 at 10 steps, 10.09 at 11), because the strike alternately sits on a node and between nodes. The swings shrink, roughly like \(1/N\).
- **“An American option is always worth noticeably more than a European one.”** — For a call on a non-dividend stock, not at all: early exercise is never optimal, so the prices are equal. For puts the premium is modest near the money (6.40 vs 6.00) and grows only deep in the money.
- **“u and d are forecasts of how far the stock will move.”** — They're set by the volatility input: \(u = e^{\sigma\sqrt{\Delta t}}\). Feed the tree a different σ and every node moves. The tree has no opinion; the σ you give it does.
- **“The tree assumes the stock really moves in jumps of ±12%.”** — The three-step tree is a coarse sketch. As steps shrink, the jumps shrink like \(\sqrt{\Delta t}\), and the tree converges to a continuous lognormal random walk.
- **“Since Black-Scholes exists, trees are obsolete.”** — Black-Scholes prices European options. For American exercise and discrete dividends, trees and grids are still standard tools.

## @takeaways
- A CRR tree uses \(u = e^{\sigma\sqrt{\Delta t}}\), \(d = 1/u\) and the per-step risk-neutral weight \(q = (e^{r\Delta t} - d)/(u - d)\); it recombines, so \(N\) steps need only \(N + 1\) final nodes.
- Backward induction: start from the payoffs, then \(V = e^{-r\Delta t}[qV_{\text{up}} + (1-q)V_{\text{down}}]\) at every node back to today.
- The 1-year XYZ call: 10.54 with 3 steps, 9.92 with 500; the limit is Black-Scholes' 9.93, reached with an even/odd zigzag.
- American options add one check per node, \(\max(\text{exercise}, \text{continuation})\). The 1-year American put is worth 6.40 vs 6.00 European, and an American call on a non-dividend stock is never exercised early.
- The tree also gives delta, gamma and theta from nodes it already computed, and each node's \(\Delta\) is the hedge that must be rebalanced as the stock moves.

## @quiz
1. A recombining CRR tree has 500 steps. How many possible stock prices are there at expiry?
   - [ ] 500
   - [x] 501
   - [ ] 1,000
   - [ ] \(2^{500}\)
   > Because \(ud = 1\), paths with the same number of ups end at the same node: \(j = 0, 1, \dots, 500\) ups gives 501 final prices. \(2^{500}\) counts paths, not end points.
2. A node's two children are worth 41.40 (up) and 12.24 (down), with \(q = 0.529\) and a one-step discount factor of 0.9868. What is the node worth (European)?
   - [ ] 26.82, the plain average of the children
   - [ ] 27.67, the q-average without discounting
   - [x] about 27.30
   - [ ] 41.40, the better child
   > \(0.9868 \times (0.529 \times 41.40 + 0.471 \times 12.24) = 0.9868 \times 27.67 = 27.30\). Both steps matter: weight with \(q\), then discount one step.
3. Why does the tree price of the 1-year call alternate above and below 9.93 as the number of steps goes 10, 11, 100, 101?
   - [ ] Because rounding errors pile up in large trees
   - [x] Because with an even number of steps a final node sits exactly on the strike, and with an odd number the strike falls between nodes
   - [ ] Because the risk-neutral weight q flips between above and below 0.5
   - [ ] Because Black-Scholes itself is only an approximation
   > The payoff's kink at K is sampled differently for even and odd N, so the two families approach the limit from opposite sides. Averaging neighbours, \((9.905 + 9.943)/2 = 9.924\), cancels most of the error.
4. XYZ pays no dividend. How do the American and European 1-year 100-strike calls compare?
   - [x] They are worth the same, because exercising early is never better than holding or selling
   - [ ] The American is worth more, because more rights are always worth more
   - [ ] The European is worth more, because it has less risk of early assignment
   - [ ] It depends on whether the call is in the money today
   > A call is always worth at least \(S - Ke^{-r\tau}\), which is more than the exercise value \(S - K\). So the early-exercise right is never used and adds nothing. With dividends it can matter just before the ex-date.
5. At a node where XYZ is 79.38 with four months left, the American 100-strike put can be exercised for 20.62 or held for a continuation value of 19.30. What should the holder do, and why?
   - [ ] Hold, because time value is always positive
   - [ ] Hold, because XYZ might fall further
   - [x] Exercise, because $100 received now earns interest that outweighs the little extra protection left
   - [ ] It doesn't matter; both values are the same after discounting
   > Deep in the money, the put behaves almost like a claim to \(K - S\); receiving \(K\) now and earning interest on it beats waiting. The tree compares 20.62 with 19.30 and takes the larger.

## @further
- [Binomial options pricing model (Wikipedia)](https://en.wikipedia.org/wiki/Binomial_options_pricing_model) — the CRR parameters, backward induction, and American options, with worked tables.
- [Backward induction (Wikipedia)](https://en.wikipedia.org/wiki/Backward_induction) — the same reasoning in game theory and decision problems.
- [Options Industry Council: exercise FAQ](https://www.optionseducation.org/referencelibrary/faq/options-exercise) — how and when American options are exercised in practice, including dividends.
- [Black & Scholes (1973), The Pricing of Options and Corporate Liabilities](https://doi.org/10.1086/260062) — the continuous-time limit that the tree converges to.

## @next
The tree converged because many tiny up-and-down steps add up to a bell curve in log-price. What exactly is that random walk, why do stocks spread out like \(\sqrt{T}\) rather than \(T\), and why are prices lognormal rather than normal? The next lesson builds the third ingredient of Black-Scholes: [[random-walk]].
