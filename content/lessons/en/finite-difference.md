---
id: finite-difference
prereqs: black-scholes, binomial-trees, theta, monte-carlo
demo: finite-difference
---

# The PDE & Finite Differences: The Other Road to a Price

## @hook
Monte Carlo runs the future forward and averages. Finite differences run the other way: start from the payoff you know at expiry and solve the Black-Scholes equation backwards, one time slice at a time, on a grid of prices. It is fast, accurate and gives every Greek for free — provided you respect one rule. Break it, and the simplest scheme turns a $9.93 option into a number 87 digits long.

## @bridge
[[black-scholes]] ended with a partial differential equation: \(\Theta + \tfrac12\sigma^2S^2\Gamma + rS\Delta - rV = 0\), the statement that a hedged option earns the risk-free rate. [[theta]] read it as “time decay pays for gamma”. [[binomial-trees]] already solved a discrete version of it without saying so — every node was an average of its children. And [[monte-carlo]] showed the forward, sampling road. This lesson takes the backward, grid road: **how do you solve the pricing PDE numerically, and why does the most obvious method sometimes explode?** It builds Idea ② (no-arbitrage): the PDE *is* the replication argument, written for every price and every moment at once.

## @intuition
Picture a sheet of graph paper. Across the page runs **time to expiry** \(\tau\), from 0 at the left edge (expiry) to 1 year at the right edge (today). Up the page runs the **stock price** \(S\), from 0 to some high ceiling, say $400. Every crossing point is a question: *what is the option worth at this price with this much time left?*

Three edges of the sheet are already filled in:

- **The left edge (expiry).** At \(\tau = 0\) the option is worth its payoff. For Kai's 100 call that is \(\max(S - 100, 0)\): 0 at every price below 100, then 2, 4, 6… above it.
- **The bottom edge (\(S = 0\)).** A stock at zero stays at zero, so a call is worth 0 there (a put is worth the discounted strike).
- **The top edge (\(S = 400\)).** Far above the strike a call behaves like the stock minus the discounted strike.

<figure>
<svg viewBox="0 0 660 270" role="img" aria-label="The finite-difference grid and its two stencils">
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
<text x="350" y="240" text-anchor="middle" class="fx-t-sm">τ = T (today)</text>
<text x="215" y="258" text-anchor="middle" class="fx-t-sm">time to expiry τ — solve left to right</text>
<text x="52" y="44" text-anchor="end" class="fx-t-sm">Smax</text>
<text x="52" y="212" text-anchor="end" class="fx-t-sm">0</text>
<text x="20" y="130" class="fx-t-sm">S</text>
<text x="92" y="30" class="fx-t-hl">payoff known</text>
<text x="230" y="30" class="fx-t-sm">boundary known</text>
<text x="440" y="40" class="fx-t-b">Explicit: 3 known → 1 new</text>
<circle cx="470" cy="70" r="6" class="fx-fill-blue"/><circle cx="470" cy="100" r="6" class="fx-fill-blue"/><circle cx="470" cy="130" r="6" class="fx-fill-blue"/>
<circle cx="580" cy="100" r="8" class="fx-hl"/>
<line x1="477" y1="73" x2="570" y2="97" class="fx-line" marker-end="url(#finite-difference-ah0)"/>
<line x1="477" y1="100" x2="569" y2="100" class="fx-line" marker-end="url(#finite-difference-ah0)"/>
<line x1="477" y1="127" x2="570" y2="103" class="fx-line" marker-end="url(#finite-difference-ah0)"/>
<text x="470" y="152" text-anchor="middle" class="fx-t-sm">column n</text>
<text x="580" y="152" text-anchor="middle" class="fx-t-sm">column n+1</text>
<text x="440" y="182" class="fx-t-b">Implicit / CN: new column</text>
<text x="440" y="198" class="fx-t-b">solved all at once</text>
<circle cx="470" cy="236" r="6" class="fx-fill-blue"/>
<line x1="580" y1="212" x2="580" y2="260" class="fx-line-hl"/>
<circle cx="580" cy="212" r="7" class="fx-hl"/><circle cx="580" cy="236" r="7" class="fx-hl"/><circle cx="580" cy="260" r="7" class="fx-hl"/>
<line x1="477" y1="236" x2="569" y2="236" class="fx-line" marker-end="url(#finite-difference-ah0)"/>
</svg>
<figcaption>Figure 1 · The grid. The left column (the payoff at expiry) and the grey top and bottom rows (the boundaries at \(S = 0\) and \(S_{\max}\)) are known before any computing starts. The violet columns are already solved; the explicit scheme then gets each new node (ringed) from three known neighbours. Implicit and Crank–Nicolson schemes link each new node to its new neighbours, so a whole column is solved together as one small linear system.</figcaption>
</figure>

The Black-Scholes equation tells us how each column relates to the one before it. In its simplest (“explicit”) form, the rule is a **weighted average of three neighbours**. With a price step of $2 and a time step of 1/200 of a year, the rule at \(S = 100\) reads:

$$
V_{\text{new}}(100) = 0.245\,V(98) + 0.500\,V(100) + 0.255\,V(102)
$$

where \(V(98)\), \(V(100)\) and \(V(102)\) are the values in the previous column (closer to expiry) at those three prices, and \(V_{\text{new}}(100)\) is the value one time step further from expiry.

> [!EXAMPLE] One step by hand
> At expiry, Kai's 100 call is worth \(V(98) = 0\), \(V(100) = 0\), \(V(102) = 2\). One time step (about 1.8 days) before expiry, the grid says
> \(V_{\text{new}}(100) = 0.245 \times 0 + 0.500 \times 0 + 0.255 \times 2 = 0.51\).
> Black-Scholes with \(T = 1/200\) gives 0.57. Not bad for one step on a coarse grid. Carry the idea all the way back to today — with enough time steps, as we will see — and the grid gives 9.92 against the exact 9.93.

The three weights add up to \(0.9998 = 1 - r\Delta t\): an average followed by a day and a bit of discounting. If that looks familiar, it should — it is a **trinomial tree**: “down, stay, up” with probabilities 0.245, 0.500, 0.255 ([[binomial-trees]]). Finite differences and trees are two dialects of the same backward induction.

::demo[finite-difference-grid]

Now the catch. Those weights are only probabilities if they are all positive. Near the top of the grid, where the stock price is high, the volatility term \(\tfrac12\sigma^2S^2\) is huge, and with the same time step the middle weight turns **negative**: at \(S = 398\) the rule becomes \(3.94\,V(396) - 6.92\,V(398) + 3.98\,V(400)\). That is no longer an average; it is an amplifier. Any small wiggle is multiplied, flipped in sign and multiplied again, step after step, until it floods the whole grid. On the XYZ grid above, 200 steps of it turn the call into \(3.1 \times 10^{86}\) dollars.

> [!THINK] With a $2 price step, the explicit scheme for Kai's call needs about 1,600 time steps to stay stable. You refine the price step to $1 for more accuracy. How many time steps do you now need?
> Predict before you open the answer.
> ---
> About **6,400** — four times as many. The stability limit ties the time step to the *square* of the price step (\(\Delta t \lesssim \Delta S^2/(\sigma^2 S_{\max}^2)\)), so halving \(\Delta S\) quarters the allowed \(\Delta t\). Twice the price resolution costs eight times the work. That is the explicit scheme's real price, and the reason implicit schemes exist.

We'll take it in six parts:

- **① The PDE on a grid**
- **② The explicit scheme and its stability limit**
- **③ Implicit and Crank–Nicolson: stable at any step**
- **④ Boundaries, grid design and Greeks from the grid**
- **⑤ American options by projection**
- **⑥ Where finite differences fit**

## @mechanics
### ① The PDE on a grid

Work in time to expiry, \(\tau = T - t\), so that the known payoff sits at \(\tau = 0\) and we march forward in \(\tau\). The Black-Scholes equation from [[black-scholes]] becomes

$$
\frac{\partial V}{\partial \tau} = \tfrac12\sigma^2 S^2\,\frac{\partial^2 V}{\partial S^2} + (r - q)\,S\,\frac{\partial V}{\partial S} - rV
$$

where \(V(S, \tau)\) is the option value, \(\partial V/\partial S\) is delta, \(\partial^2 V/\partial S^2\) is gamma, \(q\) is the dividend yield and \(\partial V/\partial\tau = -\Theta\) (one more unit of time to expiry is one less unit of time decay already suffered). Read it as: *the value rises with extra time exactly as fast as convexity and carry add value, minus the cost of financing*.

Lay down a grid \(S_i = i\,\Delta S\) for \(i = 0, \dots, M\) and \(\tau_n = n\,\Delta t\) for \(n = 0, \dots, N\), and write \(V_i^n\) for the value at node \((S_i, \tau_n)\). Replace each derivative by a difference of neighbouring values:

$$
\frac{\partial V}{\partial S} \approx \frac{V_{i+1}^n - V_{i-1}^n}{2\,\Delta S}, \qquad \frac{\partial^2 V}{\partial S^2} \approx \frac{V_{i+1}^n - 2V_i^n + V_{i-1}^n}{\Delta S^2}, \qquad \frac{\partial V}{\partial \tau} \approx \frac{V_i^{n+1} - V_i^n}{\Delta t}
$$

The first two are **central differences**: their error shrinks like \(\Delta S^2\), so halving the price step cuts it by four. The third is a one-sided difference in time, accurate to order \(\Delta t\).

**The XYZ grid.** For Kai's 1-year call: \(S_{\max} = 400\) (four times the strike), \(M = 200\) price steps of \(\Delta S = \$2\), \(N = 200\) time steps of \(\Delta t = 1/200\) year (about 1.8 days). That is \(201 \times 201 \approx 40{,}000\) nodes — and the whole grid solves in a few milliseconds. A Monte Carlo run with the same accuracy (about 1 cent) needed around 2 million paths.

### ② The explicit scheme and its stability limit

Plug the differences into the PDE and solve for the one unknown, \(V_i^{n+1}\). Everything else is known from the previous column:

$$
V_i^{n+1} = \underbrace{\tfrac12\Delta t\,\big(\sigma^2 i^2 - (r-q)\,i\big)}_{w_{\text{d}}}V_{i-1}^n + \underbrace{\big(1 - \Delta t\,(\sigma^2 i^2 + r)\big)}_{w_{\text{m}}}V_i^n + \underbrace{\tfrac12\Delta t\,\big(\sigma^2 i^2 + (r-q)\,i\big)}_{w_{\text{u}}}V_{i+1}^n
$$

Here \(i = S_i/\Delta S\) is the node's index (so \(\sigma^2 i^2 = \sigma^2 S_i^2/\Delta S^2\)), and \(w_{\text{d}}, w_{\text{m}}, w_{\text{u}}\) are the down, middle and up weights. At \(S = 100\) on the XYZ grid, \(i = 50\), \(\sigma^2 i^2 = 0.04 \times 2{,}500 = 100\), and with \(\Delta t = 0.005\):
\(w_{\text{d}} = 0.005 \times 0.5 \times (100 - 2) = 0.245\), \(w_{\text{m}} = 1 - 0.005 \times 100.04 = 0.4998\), \(w_{\text{u}} = 0.005 \times 0.5 \times (100 + 2) = 0.255\) — the numbers from the intuition.

<figure>
<svg viewBox="0 0 660 240" role="img" aria-label="Explicit-scheme weights at a healthy node and at the top of the grid">
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
<text x="162" y="30" text-anchor="middle" class="fx-t-b">S = 100 (i = 50)</text>
<text x="162" y="180" text-anchor="middle" class="fx-t-ok">all positive: an average</text>
<text x="162" y="198" text-anchor="middle" class="fx-t-sm">sum = 0.9998 = 1 − rΔt</text>
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
<text x="495" y="30" text-anchor="middle" class="fx-t-b">S = 398 (i = 199)</text>
<text x="495" y="232" text-anchor="middle" class="fx-t-bad">negative middle weight: an amplifier</text>
</svg>
<figcaption>Figure 2 · The explicit update on the XYZ grid (\(\Delta S = 2\), \(\Delta t = 1/200\)). At \(S = 100\) the three weights are positive and behave like trinomial-tree probabilities. At the top of the grid the same time step gives a middle weight of −6.92 (bars in the right-hand panel drawn at a smaller scale): a zigzag in the values is multiplied by about \(1 - \Delta t(2\sigma^2 i^2 + r) \approx -14.8\) every step.</figcaption>
</figure>

The weights stay non-negative — and errors cannot grow — when \(w_{\text{m}} \ge 0\) at every node. The binding node is the top one, where \(i \approx M\):

$$
\lambda \equiv \sigma^2 M^2\,\Delta t \le 1 \qquad \Longleftrightarrow \qquad \Delta t \lesssim \frac{1}{\sigma^2 M^2} = \frac{\Delta S^2}{\sigma^2 S_{\max}^2}
$$

where \(\lambda\) is the stability ratio, \(M = S_{\max}/\Delta S\) the number of price steps and \(\Delta t\) the time step (small corrections from \(r\) ignored). A standard (von Neumann) stability analysis gives the same limit up to a constant.

> [!EXAMPLE] Watching the XYZ grid explode
> \(\sigma = 20\%\), \(M = 200\): \(\lambda = 0.04 \times 40{,}000 \times \Delta t = 1{,}600\,\Delta t\), so the explicit scheme needs \(N \ge 1{,}600\) steps for one year.
> - \(N = 200\) (\(\lambda = 8\)): price \(3.1 \times 10^{86}\)
> - \(N = 1{,}000\) (\(\lambda = 1.6\)): price \(2.6 \times 10^{167}\)
> - \(N = 1{,}600\) (\(\lambda = 1.0\)): price **9.9159**, against Black-Scholes 9.9251
>
> Between “astronomical” and “correct to a cent” there is nothing but the time step.

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Sawtooth instability of the explicit scheme on a coarse grid">
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
<text x="160" y="190" class="fx-t-ok">N = 60 (λ = 0.6): smooth put curve</text>
<text x="160" y="210" class="fx-t-bad">N = 16 (λ = 2.25): sawtooth at high S</text>
<text x="440" y="60" class="fx-t-sm">values +56.8, −56.3:</text>
<text x="440" y="76" class="fx-t-sm">a put cannot be negative</text>
</svg>
<figcaption>Figure 3 · A 1-year put with \(\sigma = 60\%\) on a coarse grid (\(\Delta S = 20\), 11 price levels), solved to today with the explicit scheme. With 60 time steps the values form a smooth, sensible curve. With 16 steps the high-price rows zigzag between +57 and −56 — impossible values for a put — and more steps of the same size would make the zigzag grow without bound. The inline demo above reproduces both runs.</figcaption>
</figure>

> [!DEEP] Why the zigzag is the dangerous pattern
> Feed the explicit update a pure zigzag, \(V_i = (-1)^i\), at node \(i\): the output is \(\big(w_{\text{m}} - w_{\text{d}} - w_{\text{u}}\big)(-1)^i = \big(1 - \Delta t\,(2\sigma^2 i^2 + r)\big)(-1)^i\). The zigzag survives with a factor whose size exceeds 1 as soon as \(\Delta t\,\sigma^2 i^2 > 1\) (ignoring \(r\)). Smooth patterns are damped; the highest-frequency pattern the grid can represent is the first to be amplified. Rounding errors and the kink at the strike contain a little of every frequency, so on a real grid the seed is always there.

### ③ Implicit and Crank–Nicolson: stable at any step

The explicit scheme evaluated the right-hand side of the PDE at the *old* column. Evaluate it at the *new* column instead, or at a blend of both:

$$
\frac{V_i^{n+1} - V_i^n}{\Delta t} = \theta\,\big(\mathcal{L}V\big)_i^{n+1} + (1 - \theta)\,\big(\mathcal{L}V\big)_i^{n}
$$

where \((\mathcal{L}V)_i\) is shorthand for the discretised right-hand side \(\tfrac12\sigma^2 S_i^2 V_{SS} + (r-q)S_iV_S - rV\) at node \(i\), and \(\theta\) chooses the scheme: \(\theta = 0\) explicit, \(\theta = 1\) **fully implicit**, \(\theta = \tfrac12\) **Crank–Nicolson**. With \(\theta > 0\) each new value depends on its *new* neighbours, so a whole column must be solved at once. The system is tridiagonal — each equation involves only three unknowns — and the Thomas algorithm solves it in about \(8M\) operations, as cheap as the explicit update.

The reward: the implicit and Crank–Nicolson schemes are **stable for every time step**. Accuracy is another matter. Fully implicit is only first-order in time (error proportional to \(\Delta t\)); Crank–Nicolson is second-order in both \(\Delta t\) and \(\Delta S\).

| Grid (\(M = N\)) | Implicit | Error | Crank–Nicolson | Error | Explicit (\(N = 1{,}600\) etc.) |
|---|---|---|---|---|---|
| 100 × 100 | 9.8749 | −0.0502 | 9.8855 | −0.0396 | 9.8881 (\(N = 401\)) |
| 200 × 200 | 9.9100 | −0.0151 | 9.9152 | −0.0098 | 9.9159 (\(N = 1{,}601\)) |
| 400 × 400 | 9.9200 | −0.0051 | 9.9226 | −0.0025 | 9.9228 (\(N = 6{,}401\)) |

Kai's 1-year call, Black-Scholes 9.9251. The Crank–Nicolson error falls by 4 each time the grid doubles (−0.0396, −0.0098, −0.0025): the signature of a second-order method. The explicit scheme is as accurate as Crank–Nicolson on the same price grid, but needs up to 16 times as many time steps. Holding \(M = 200\) and cutting time steps shows the difference between the two stable schemes: with \(N = 10\), implicit gives 9.8112 while Crank–Nicolson already gives 9.8912; with \(N = 25\), 9.8735 against 9.9156.

> [!WARN] Crank–Nicolson and the kink
> The payoff has a kink at the strike, and Crank–Nicolson damps high-frequency errors only weakly. With large time steps it can leave small oscillations in the value near \(K\) — and much bigger ones in gamma read off the grid. The standard fix, **Rannacher smoothing**, takes the first two to four steps fully implicit (which damps hard) and switches to Crank–Nicolson afterwards.

A compact Crank–Nicolson solver in Python (dense solves for clarity; production code uses a tridiagonal solver):

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

### ④ Boundaries, grid design and Greeks from the grid

**Boundary conditions.** At \(S = 0\): a call is worth 0 and a put \(Ke^{-r\tau}\). At \(S_{\max}\): a call is worth \(S_{\max}e^{-q\tau} - Ke^{-r\tau}\) and a put 0. If \(S_{\max}\) is too low these conditions are wrong enough to leak into the answer; three to five times the strike (or several standard deviations of the terminal price) is the usual choice, and the demo uses four.

**Grid design** decides most of the accuracy:

- **Put spot and strike on nodes.** With \(M = 50\) the price step is $8, so \(S = 100\) falls between nodes and the kink at \(K = 100\) is smeared: the error is +0.15, much worse than the grid size suggests. Aligning the grid (or smoothing the payoff over the cell containing the strike) fixes most of that.
- **Use \(\ln S\) or a stretched grid.** A uniform grid in \(\ln S\) makes the coefficients constant and puts resolution where the stock is likely to be; concentrating nodes near the strike does the same.
- **Match the time grid to events.** Dividend dates, barrier monitoring dates and exercise dates should fall on time steps.

**Greeks for free.** The solve delivers the whole curve \(V(S)\) at today's column, so delta and gamma are just the central differences of ①, and theta is one PDE evaluation (or the difference between the last two columns). For Kai's call on a 400 × 400 Crank–Nicolson grid (\(\Delta S = 1\)):

- \(\Delta = (V_{101} - V_{99})/2 = 0.61785\) against Black-Scholes 0.61791
- \(\Gamma = (V_{101} - 2V_{100} + V_{99})/1 = 0.019076\) against 0.019069
- one day less to expiry changes the grid price by −0.0161, against the Black-Scholes theta of −0.0161 per day ([[theta]])

No extra simulations, no bumping noise — one of the main reasons desks prefer PDE methods whenever the dimension allows.

### ⑤ American options by projection

An American option may be exercised at any node, so its value can never fall below the payoff. The grid handles this with one extra line per time step: after computing the new column, **project** it onto the payoff,

$$
V_i^{n+1} \leftarrow \max\!\big(V_i^{n+1},\ \text{payoff}(S_i)\big)
$$

where the left-hand \(V_i^{n+1}\) is the continuation value just computed and the payoff is \(\max(K - S_i, 0)\) for a put. This is exactly the tree's rule \(\max(\text{exercise now}, \text{hold})\) ([[binomial-trees]]). For the explicit scheme that is the whole story. For implicit and Crank–Nicolson schemes, projecting after the linear solve is a close approximation; the rigorous version solves a *linear complementarity problem* — the new column must satisfy the PDE where you hold, equal the payoff where you exercise, and never fall below the payoff — with **projected SOR** (successive over-relaxation that applies the max inside every iteration) or a policy-iteration method.

> [!EXAMPLE] Kai's 1-year American put
> Crank–Nicolson with projection, 400 × 400 grid: **6.4001**. A 1,000-step tree gives 6.4033 (5,000 steps: 6.4039). The European put is 6.0040. So the right to exercise early is worth about \(6.40 - 6.00 = \$0.40\) per share, \(\$40\) per contract. Where on the grid does exercise happen, and why? That is the whole of [[american-exercise]].

### ⑥ Where finite differences fit

| | Tree | Finite differences | Monte Carlo |
|---|---|---|---|
| Best dimension | 1 | 1–3 | any |
| Early exercise | easy (max at node) | easy (projection / PSOR) | hard (regression, [[american-exercise]]) |
| Greeks | from the first nodes | from the grid, nearly free | bumps, pathwise or likelihood ratio |
| Path dependence | awkward | extra state variable | natural |
| Error behaviour | oscillates with steps | smooth, second-order (CN) | random, \(1/\sqrt{N}\) |

Finite differences are the workhorse whenever the problem has one to three state variables: single-stock and index options with dividends and early exercise, barrier options (the barrier becomes a boundary of the grid, exactly where it belongs), and two-factor models such as Heston stochastic volatility, where splitting methods (ADI, “alternating direction implicit”) solve one direction at a time ([[stochastic-vol]]). Beyond three dimensions the grid size explodes and [[monte-carlo]] takes over.

> [!HISTORY] From heat to options
> John Crank and Phyllis Nicolson published their scheme in 1947 for the heat-conduction equation — and the Black-Scholes equation *is* a heat equation after a change of variables (log price, time to expiry, and a rescaling of the value). In the late 1970s Michael Brennan and Eduardo Schwartz were among the first to solve option-pricing equations on a grid, including American puts.

## @analogy
Think of a **long metal rod** whose temperature you want to predict, measured at evenly spaced points. Each point's next reading comes from its own reading and its two neighbours': a hot point next to cool ones cools down. That is the explicit update. It works as long as you take readings often enough. Wait too long between readings and a hot point “over-corrects”: it cools so much that it ends up colder than its cool neighbours; next round they over-correct back, and a zigzag grows until the numbers are nonsense. The implicit approach instead lets all points agree on the new temperatures simultaneously — solve for the whole rod at once — and can take long strides safely.

The rod analogy is precise in one sense: the Black-Scholes equation really is the heat equation in disguise, and option value diffuses across prices the way heat diffuses along the rod. Where it breaks: our rod conducts heat faster at one end — the diffusion term grows with \(S^2\) — which is why the high-price end of the grid fails first. And our clock runs backwards: we start at expiry, where the “temperature” is the payoff, and walk towards today.

## @misconceptions
- **“The explicit scheme exploded, so the model or the PDE is wrong.”** — The PDE is fine; the numerical method is unstable for that time step. With \(\lambda = \sigma^2M^2\Delta t \le 1\) the same code gives 9.92.
- **“Implicit schemes are unconditionally stable, so any time step will do.”** — Stable is not accurate. Fully implicit with 10 time steps prices Kai's call at 9.81, 11 cents off; Crank–Nicolson with the same steps is at 9.89.
- **“A finer price grid can only help.”** — For the explicit scheme it forces the time step down with \(\Delta S^2\): twice the price resolution means four times the time steps, or instability.
- **“Crank–Nicolson is always the best choice.”** — It is second-order, but with large steps it can wiggle around the strike, especially in gamma. Start with a few implicit steps (Rannacher smoothing).
- **“A grid gives you one price for one spot.”** — One solve returns the value at every spot on the grid, plus delta, gamma and theta, all without re-running anything.

## @takeaways
- Finite differences solve the Black-Scholes PDE backwards from the payoff on a price × time grid; each explicit step is a trinomial-tree average of three neighbours.
- The explicit scheme is stable only if \(\lambda = \sigma^2 M^2 \Delta t \le 1\); beyond it, a negative middle weight amplifies zigzags until the price is astronomical (\(3.1 \times 10^{86}\) for Kai's call with 200 steps).
- Implicit and Crank–Nicolson schemes solve a tridiagonal system per step, are stable for any step, and Crank–Nicolson is second-order: errors fall fourfold when the grid doubles.
- Grid design (boundaries, strike and spot on nodes, log grids) drives accuracy, and delta, gamma and theta come straight off the grid.
- American options need one projection per step, \(\max(V, \text{payoff})\) (or projected SOR); the 1-year XYZ put is worth about 6.40 against 6.00 European.

## @quiz
1. The explicit scheme for Kai's call is stable with \(M = 200\) price steps and \(N = 1{,}600\) time steps. You switch to \(M = 400\). What is the smallest number of time steps that keeps it stable?
   - [ ] 1,600
   - [x] about 6,400
   - [ ] 3,200
   - [ ] about 800
   > The stability ratio is \(\lambda = \sigma^2 M^2 \Delta t\). Doubling \(M\) quadruples \(M^2\), so \(\Delta t\) must shrink fourfold: \(N \ge 0.04 \times 400^2 = 6{,}400\).
2. Why does the explicit scheme's instability start at the top of the price grid rather than near the strike?
   - [ ] Because the payoff is largest there
   - [ ] Because the boundary condition at \(S_{\max}\) is wrong
   - [ ] Because the interest-rate term dominates at high prices
   - [x] Because the diffusion coefficient \(\tfrac12\sigma^2 S^2\) is largest there, so the middle weight turns negative there first
   > The middle weight is \(1 - \Delta t(\sigma^2 i^2 + r)\), which falls as \(i\) rises. At \(S = 100\) it is 0.4998, at \(S = 398\) it is −6.92 with the same time step.
3. Fully implicit with \(M = 200\) and only \(N = 10\) time steps prices Kai's call at 9.81 against 9.93. What is going on?
   - [x] The scheme is stable but only first-order accurate in time, so ten large steps leave a visible error
   - [ ] The scheme is unstable and about to blow up
   - [ ] The price grid is too coarse, so more price steps are the only fix
   - [ ] Implicit schemes cannot price calls
   > Implicit schemes never blow up, but their time error is proportional to \(\Delta t\). With \(N = 100\) the implicit price is 9.90; Crank–Nicolson, second-order in time, gives 9.89 already with \(N = 10\).
4. How does a finite-difference solver handle an American put?
   - [ ] It prices the European put and adds a fixed premium
   - [ ] It needs a Monte Carlo simulation for the exercise decision
   - [x] After every time step it sets each node to the larger of the computed value and the exercise value (or solves the same condition with projected SOR)
   - [ ] It moves the boundary condition at \(S = 0\)
   > This projection is the grid version of the tree's \(\max(\text{exercise}, \text{hold})\). It gives 6.40 for the 1-year XYZ put, against 6.00 for the European.
5. After one Crank–Nicolson solve for Kai's call, which of these can you read off without solving again?
   - [ ] Only the price at \(S = 100\)
   - [x] The value at every grid price, plus delta and gamma from neighbouring nodes (and theta from the last two columns)
   - [ ] The price and delta, but gamma needs a second solve with bumped spot
   - [ ] Only vega, because the grid depends on \(\sigma\)
   > The grid returns the whole curve \(V(S)\); central differences give \(\Delta = 0.6179\) and \(\Gamma = 0.0191\). Vega is the one that needs a second solve, because \(\sigma\) is built into the coefficients.

## @further
- [Finite difference methods for option pricing (Wikipedia)](https://en.wikipedia.org/wiki/Finite_difference_methods_for_option_pricing) — overview, with the link between the explicit scheme and the trinomial tree.
- [Crank–Nicolson method (Wikipedia)](https://en.wikipedia.org/wiki/Crank%E2%80%93Nicolson_method) — the scheme, its stability, and the oscillation issue with non-smooth data.
- [Von Neumann stability analysis (Wikipedia)](https://en.wikipedia.org/wiki/Von_Neumann_stability_analysis) — the Fourier argument behind the explicit stability limit.
- [Tridiagonal matrix algorithm (Wikipedia)](https://en.wikipedia.org/wiki/Tridiagonal_matrix_algorithm) — the Thomas algorithm that makes implicit steps as cheap as explicit ones.
- [Black–Scholes equation (Wikipedia)](https://en.wikipedia.org/wiki/Black%E2%80%93Scholes_equation) — the PDE, its derivation and the transformation to the heat equation.

## @next
The grid just priced the American put at $6.40, forty cents above the European one. That premium comes from nodes where the grid said “exercise now”. Where exactly are they, how does that frontier move as expiry approaches — and how can a simulation, which only runs forward, ever find it?
