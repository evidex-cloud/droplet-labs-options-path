---
id: deep-hedging
prereqs: delta-hedging, bs-assumptions, monte-carlo
demo: deep-hedging
---

# Deep Hedging: Teaching a Network to Hedge

## @hook
A dealer who re-hedges the 30-day XYZ call by the textbook, four times a day, pays about $40 per contract in trading costs, and checking more often would make its worst losses bigger, not smaller. Deep hedging drops the formula and *learns* the hedge by minimizing the loss you actually fear. What it learns is an old trader's rule: sometimes the best trade is no trade.

## @bridge
In [[delta-hedging]] we hedged a short option by holding \(\Delta\) shares and saw that the P&L depends on realized versus implied volatility. [[bs-assumptions]] listed what that hedge ignores: rebalancing is discrete, every trade costs money, prices jump. [[monte-carlo]] gave us the tool to simulate thousands of paths. This first lesson of the AI stage asks: **when frictions make perfect replication impossible, what is the best hedge — and can a machine learn it?** It builds Idea ④ (risk: a hedge is a choice about which risk to keep) and stretches Idea ② (when replication is no longer exact, the price becomes a price *for the risk that is left*).

## @intuition
Start on the other side of a trade you know.

> [!KAI] Who hedges Kai's call?
> Kai buys one XYZ 30-day 100 call for $2.45, or $245 per contract. The market maker who sold it does not want a bet on XYZ. Its delta is 0.534, so the dealer buys about 53 shares and keeps adjusting that number as XYZ moves — the routine from [[delta-hedging]]. This lesson is about that dealer's problem, not Kai's.

In the textbook world the dealer re-hedges continuously and for free, and the hedge is perfect. In the real world the dealer checks the position a few times a day and pays for every trade: the bid-ask spread, fees, the price impact of its own order ([[execution-tca]]). Let's put numbers on it. For illustration, say every share bought or sold costs **0.1% of its value** all-in, and the dealer checks the hedge **four times a day** — 120 checks over 30 days.

We simulated 1,000 XYZ paths at 20% volatility and ran the textbook rule on each: at every check, trade back to exactly the Black-Scholes delta. Per contract:

- the dealer trades at all 120 checks and pays **$40** in costs on average;
- the P&L swings with a standard deviation of **$23** around that loss;
- in the worst 5% of paths the average loss is **$102**.

Now a lazier rule. Draw a corridor of \(\pm 0.035\) around the delta, and only trade when the shares held fall *outside* the corridor — then trade just enough to get back to its edge. Same paths, same costs: the dealer trades about **61** times instead of 120, pays **$22** instead of $40, and the average loss in the worst 5% of paths drops from $102 to **$80**. Being less precise made the hedge *better*.

<figure>
<svg viewBox="0 0 660 262" role="img" aria-label="A no-trade band around delta on one simulated path">
<line x1="60" y1="200" x2="630" y2="200" class="fx-axis"/>
<line x1="60" y1="20" x2="60" y2="200" class="fx-axis"/>
<line x1="60" y1="115" x2="620" y2="115" class="fx-grid"/>
<line x1="60" y1="30" x2="620" y2="30" class="fx-grid"/>
<polygon points="60,103 65,97 69,96 74,91 79,90 84,100 88,105 93,102 98,99 102,86 107,82 112,72 116,70 121,62 126,61 131,63 135,65 140,68 145,66 149,63 154,69 159,67 164,66 168,65 173,65 178,64 182,58 187,51 192,46 196,48 201,50 206,45 211,41 215,45 220,40 225,40 229,39 234,37 239,35 244,38 248,38 253,39 258,37 262,33 267,34 272,34 276,34 281,34 286,34 291,37 295,40 300,43 305,39 309,40 314,48 319,42 324,41 328,42 333,52 338,57 342,59 347,61 352,64 356,60 361,61 366,67 371,60 375,63 380,66 385,68 389,80 394,78 399,73 404,71 408,81 413,73 418,101 422,94 427,115 432,115 436,116 441,132 446,120 451,120 455,128 460,136 465,129 469,121 474,142 479,155 484,157 488,164 493,164 498,163 502,169 507,156 512,160 516,151 521,158 526,133 531,111 535,104 540,87 545,77 549,85 554,85 559,97 564,73 568,74 573,68 578,82 582,87 587,102 592,104 596,109 601,136 606,144 611,87 615,41 620,66 620,78 615,53 611,99 606,156 601,148 596,121 592,116 587,114 582,98 578,94 573,80 568,86 564,85 559,109 554,97 549,97 545,89 540,99 535,116 531,123 526,145 521,170 516,162 512,172 507,168 502,181 498,175 493,175 488,176 484,169 479,167 474,154 469,133 465,141 460,148 455,140 451,132 446,132 441,144 436,128 432,127 427,127 422,106 418,113 413,85 408,93 404,83 399,85 394,90 389,92 385,80 380,77 375,75 371,72 366,78 361,73 356,72 352,75 347,73 342,71 338,69 333,63 328,54 324,53 319,54 314,60 309,52 305,51 300,55 295,52 291,49 286,46 281,46 276,46 272,46 267,46 262,45 258,49 253,51 248,50 244,50 239,47 234,49 229,51 225,51 220,52 215,57 211,53 206,57 201,62 196,60 192,58 187,63 182,70 178,76 173,77 168,77 164,78 159,79 154,81 149,75 145,78 140,80 135,77 131,75 126,73 121,74 116,82 112,84 107,93 102,98 98,111 93,114 88,117 84,112 79,102 74,103 69,108 65,109 60,115" class="fx-area-hl"/>
<polyline points="60,109 65,103 69,102 74,97 79,96 84,106 88,111 93,108 98,105 102,92 107,88 112,78 116,76 121,68 126,67 131,69 135,71 140,74 145,72 149,69 154,75 159,73 164,72 168,71 173,71 178,70 182,64 187,57 192,52 196,54 201,56 206,51 211,47 215,51 220,46 225,46 229,45 234,43 239,41 244,44 248,44 253,45 258,43 262,39 267,40 272,40 276,40 281,40 286,40 291,43 295,46 300,49 305,45 309,46 314,54 319,48 324,47 328,48 333,58 338,63 342,65 347,67 352,69 356,66 361,67 366,72 371,66 375,69 380,72 385,74 389,86 394,84 399,79 404,77 408,87 413,79 418,107 422,100 427,121 432,121 436,122 441,138 446,126 451,126 455,134 460,142 465,135 469,127 474,148 479,161 484,163 488,170 493,169 498,169 502,175 507,162 512,166 516,157 521,164 526,139 531,117 535,110 540,93 545,83 549,91 554,91 559,103 564,79 568,80 573,74 578,88 582,93 587,108 592,110 596,115 601,142 606,150 611,93 615,47 620,72" class="fx-line-muted"/>
<polyline points="60,115 65,115 65,109 69,109 69,108 74,108 74,103 79,103 79,102 84,102 84,102 88,102 88,105 93,105 93,105 98,105 98,105 102,105 102,98 107,98 107,93 112,93 112,84 116,84 116,82 121,82 121,74 126,74 126,73 131,73 131,73 135,73 135,73 140,73 140,73 145,73 145,73 149,73 149,73 154,73 154,73 159,73 159,73 164,73 164,73 168,73 168,73 173,73 173,73 178,73 178,73 182,73 182,70 187,70 187,63 192,63 192,58 196,58 196,58 201,58 201,58 206,58 206,57 211,57 211,53 215,53 215,53 220,53 220,52 225,52 225,51 229,51 229,51 234,51 234,49 239,49 239,47 244,47 244,47 248,47 248,47 253,47 253,47 258,47 258,47 262,47 262,45 267,45 267,45 272,45 272,45 276,45 276,45 281,45 281,45 286,45 286,45 291,45 291,45 295,45 295,45 300,45 300,45 305,45 305,45 309,45 309,45 314,45 314,48 319,48 319,48 324,48 324,48 328,48 328,48 333,48 333,52 338,52 338,57 342,57 342,59 347,59 347,61 352,61 352,64 356,64 356,64 361,64 361,64 366,64 366,67 371,67 371,67 375,67 375,67 380,67 380,67 385,67 385,68 389,68 389,80 394,80 394,80 399,80 399,80 404,80 404,80 408,80 408,81 413,81 413,81 418,81 418,101 422,101 422,101 427,101 427,115 432,115 432,115 436,115 436,116 441,116 441,132 446,132 446,132 451,132 451,132 455,132 455,132 460,132 460,136 465,136 465,136 469,136 469,133 474,133 474,142 479,142 479,155 484,155 484,157 488,157 488,164 493,164 493,164 498,164 498,164 502,164 502,169 507,169 507,168 512,168 512,168 516,168 516,162 521,162 521,162 526,162 526,145 531,145 531,123 535,123 535,116 540,116 540,99 545,99 545,89 549,89 549,89 554,89 554,89 559,89 559,97 564,97 564,85 568,85 568,85 573,85 573,80 578,80 578,82 582,82 582,87 587,87 587,102 592,102 592,104 596,104 596,109 601,109 601,136 606,136 606,144 611,144 611,99 615,99 615,53 620,53 620,66" class="fx-line-hl"/>
<text x="52" y="204" text-anchor="end" class="fx-t-sm">0</text>
<text x="52" y="119" text-anchor="end" class="fx-t-sm">0.5</text>
<text x="52" y="34" text-anchor="end" class="fx-t-sm">1</text>
<text x="60" y="218" text-anchor="middle" class="fx-t-sm">day 0</text>
<text x="340" y="218" text-anchor="middle" class="fx-t-sm">day 15</text>
<text x="620" y="218" text-anchor="middle" class="fx-t-sm">day 30</text>
<text x="64" y="13" class="fx-t-sm">shares held per option vs delta · one simulated XYZ path, hedge checked 4 times a day</text>
<rect x="80" y="238" width="14" height="8" class="fx-area-hl"/>
<text x="98" y="246" class="fx-t-sm">no-trade band: delta ± 0.035</text>
<line x1="290" y1="242" x2="310" y2="242" class="fx-line-muted"/>
<text x="314" y="246" class="fx-t-sm">Black-Scholes delta</text>
<line x1="460" y1="242" x2="480" y2="242" class="fx-line-hl"/>
<text x="484" y="246" class="fx-t-sm">shares actually held</text>
</svg>
<figcaption>Figure 1 · One path, 120 hedge checks. The grey line is the textbook delta; the band hugs it; the blue step line is what the dealer actually holds. Holdings stay flat while delta wiggles inside the band and move only when they touch an edge — 66 trades on this path instead of 120.</figcaption>
</figure>

Why does it work? Because two costs pull in opposite directions. Hedging more often shrinks the *hedging error* — the random P&L left over because the hedge is always a little stale ([[bs-assumptions]]). But every extra adjustment pays the toll. A band skips the tiny adjustments that cost almost as much as they save, and still acts when the position has drifted far enough to matter.

::demo[deep-hedging-band]

How wide should the band be? That depends on the cost, the frequency, the option's gamma and how much you fear the tail. No textbook formula gives it for a general book. **Deep hedging** turns the question around: describe the hedge as a *policy* — a rule that maps what you can see (price, time, current holdings) to how many shares to hold — let a neural network be that rule, simulate thousands of paths with realiztic frictions, and adjust the network until the loss you fear most is as small as it can be. Buehler, Gonon, Teichmann and Wood set this out in 2019 in a paper simply called *Deep Hedging*.

> [!THINK] If trading were free, what band would the training choose?
> Predict before you open the answer.
> ---
> Zero. With no cost, every adjustment only reduces hedging error, so the optimizer pushes the band to 0 and rediscovers the textbook delta hedge. In the main demo, set the cost to 0 with four checks a day: the learned band is \(b^* = 0\). A learned hedge should *reduce to* the classic answer when the classic assumptions hold — that is the first sanity check of any such model.

We'll take it in five parts:

- **① The hedging problem once costs exist**
- **② Choosing what to minimize: variance, VaR, CVaR**
- **③ The deep-hedging recipe: a network in the loop**
- **④ What the policy learns — and the price it implies**
- **⑤ Limits, and where this stands in 2026**

## @mechanics
### ① The hedging problem once costs exist

Write down the dealer's result at expiry. The dealer sold the option for \(p_0\), owes the payoff \(Z = \max(S_T - K, 0)\) at expiry, holds \(\delta_k\) shares between check \(k\) and check \(k+1\), and pays a proportional cost on every change of holdings. Ignoring interest for readability (the demo includes it):

$$
\text{P\&L}(\delta) = p_0 - Z + \sum_{k=0}^{N-1} \delta_k\,(S_{k+1} - S_k) - \sum_{k=0}^{N-1} c\,S_k\,\lvert \delta_k - \delta_{k-1} \rvert
$$

where \(N\) is the number of hedge checks, \(S_k\) the price at check \(k\), \(c\) the cost as a fraction of traded value (0.1% here), and \(\delta_{-1} = 0\) (the dealer starts with no shares). The first sum is the hedge's gain or loss; the second is the toll.

> [!EXAMPLE] The first toll
> At the first check the textbook hedge buys \(0.534 \times 100 = 53.4\) shares per contract at $100. The cost is \(53.4 \times \$100 \times 0.1\% = \$5.34\). The band policy with \(b = 0.035\) buys only up to the band's lower edge, \((0.534 - 0.035) \times 100 = 49.9\) shares, costing $4.99 — and then waits.

Frequency is where the conflict bites. The hedging error shrinks like \(1/\sqrt{N}\) ([[bs-assumptions]]), but the total number of shares traded *grows* roughly like \(\sqrt{N}\): each adjustment is about \(\Gamma\,\lvert \Delta S \rvert\) shares, a move over an interval of length \(T/N\) is about \(\sigma S\sqrt{T/N}\), and there are \(N\) of them. So the costs rise without limit as you hedge more often. Our simulation (1,000 paths, cost 0.1%, textbook delta hedge, per contract):

| Checks per day | Hedging-error std. dev. (no costs) | Mean cost | Average of worst 5% losses |
|---|---|---|---|
| 1 | $36 | $23 | $114 |
| 4 | $19 | $40 | $102 |
| 12 | $10 | $66 | $120 |

Checking twelve times a day makes the tail *worse* than checking four times: the extra precision is eaten by the toll. With costs, “hedge as often as you can” stops being the answer.

### ② Choosing what to minimize: variance, VaR, CVaR

To call one hedge “better” than another you need a single number for a whole distribution of outcomes — a **risk measure**, written \(\rho\). Standard deviation is the classic choice, but it punishes lucky paths as much as unlucky ones. Dealers worry about the left tail. Two tail measures, for the loss \(L = -\text{P\&L}\):

- **Value at Risk** \(\text{VaR}_{\alpha}\): the loss that is exceeded only with probability \(1 - \alpha\). With \(\alpha = 95\%\) and 1,000 paths, it is the 950th smallest loss.
- **Conditional Value at Risk** (also called **expected shortfall**): the average loss *given* that you are beyond VaR.

$$
\text{CVaR}_{\alpha}(L) = \E\big[\,L \;\big|\; L \ge \text{VaR}_{\alpha}(L)\,\big]
$$

In words: sort the outcomes from best to worst, keep the worst \(1 - \alpha\) share, and average them. It answers “when it goes badly, how badly on average?” — something VaR, which only marks the edge of the tail, cannot tell you.

> [!EXAMPLE] Reading the tail
> For the textbook hedge at four checks a day and 0.1% cost, the 1,000 simulated losses have a mean of $41. The 95% VaR is **$84**: 50 paths lose more than that. Those 50 worst losses average **$102** — that is \(\text{CVaR}_{95\%}\). The single worst path lost $157.

<figure>
<svg viewBox="0 0 660 240" role="img" aria-label="Histogram of hedging losses with VaR and CVaR">
<line x1="55" y1="180" x2="620" y2="180" class="fx-axis"/>
<rect x="61" y="179" width="28" height="1" class="fx-box2"/><rect x="91" y="176" width="28" height="4" class="fx-box2"/><rect x="121" y="153" width="28" height="27" class="fx-box2"/><rect x="151" y="93" width="28" height="87" class="fx-box2"/><rect x="181" y="44" width="28" height="136" class="fx-box2"/><rect x="211" y="40" width="28" height="140" class="fx-box2"/><rect x="241" y="63" width="28" height="117" class="fx-box2"/><rect x="271" y="103" width="28" height="77" class="fx-box2"/><rect x="301" y="138" width="28" height="42" class="fx-box2"/><rect x="331" y="143" width="28" height="37" class="fx-box2"/><rect x="361" y="161" width="28" height="19" class="fx-box2"/><rect x="391" y="171" width="28" height="9" class="fx-bad"/><rect x="421" y="174" width="28" height="6" class="fx-bad"/><rect x="451" y="179" width="28" height="1" class="fx-bad"/><rect x="481" y="180" width="28" height="1" class="fx-bad"/><rect x="511" y="178" width="28" height="2" class="fx-bad"/><rect x="541" y="176" width="28" height="4" class="fx-bad"/><rect x="571" y="179" width="28" height="1" class="fx-bad"/>
<line x1="371" y1="30" x2="371" y2="182" class="fx-line fx-dash"/>
<line x1="427" y1="50" x2="427" y2="182" class="fx-line-bad"/>
<text x="371" y="24" text-anchor="middle" class="fx-t-b">VaR 95% ≈ $84</text>
<text x="427" y="44" class="fx-t-bad">CVaR 95% ≈ $102</text>
<text x="440" y="100" class="fx-t-sm">red bars: the worst 5% of paths</text>
<text x="440" y="116" class="fx-t-sm">CVaR = their average loss</text>
<text x="60" y="198" text-anchor="middle" class="fx-t-sm">−$20</text>
<text x="180" y="198" text-anchor="middle" class="fx-t-sm">$20</text>
<text x="300" y="198" text-anchor="middle" class="fx-t-sm">$60</text>
<text x="420" y="198" text-anchor="middle" class="fx-t-sm">$100</text>
<text x="540" y="198" text-anchor="middle" class="fx-t-sm">$140</text>
<text x="340" y="222" text-anchor="middle" class="fx-t-sm">loss per contract at expiry (textbook delta hedge, 4 checks a day, cost 0.1%, 1,000 paths)</text>
</svg>
<figcaption>Figure 2 · The loss distribution of the textbook hedge. VaR marks where the worst 5% begins; CVaR is the average inside that red tail. Deep hedging lets you choose which of these the network should shrink — and the choice changes what it learns.</figcaption>
</figure>

> [!DEEP] Why CVaR is easy to train
> CVaR has a second form that turns it into a plain minimization: \(\text{CVaR}_{\alpha}(L) = \min_{w} \big\{ w + \tfrac{1}{1-\alpha}\,\E\big[(L - w)^{+}\big] \big\}\), where the optimal \(w\) is the VaR. Treat \(w\) as one more trainable parameter, estimate the expectation with a batch of simulated paths, and the whole objective becomes differentiable almost everywhere — exactly what stochastic gradient descent needs. Deep hedging uses this family of “optimized certainty equivalent” risk measures for that reason.

### ③ The deep-hedging recipe: a network in the loop

Buehler, Gonon, Teichmann and Wood (2019) frame hedging as an optimization over policies:

$$
\min_{\theta}\ \rho\Big(-\text{P\&L}\big(\delta^{\theta}\big)\Big), \qquad \delta^{\theta}_k = F_{\theta}\big(\ln S_k,\ t_k,\ \delta^{\theta}_{k-1}\big)
$$

where \(F_{\theta}\) is a neural network with weights \(\theta\); its inputs are what a trader could see at check \(k\) — the log price, the time, and the position already held (that last input is what lets it “remember” and be lazy); its output is the number of shares to hold; and \(\rho\) is the chosen risk measure, such as \(\text{CVaR}_{95\%}\).

<figure>
<svg viewBox="0 0 680 250" role="img" aria-label="The deep hedging training loop">
<defs><marker id="deep-hedging-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="20" y="50" width="170" height="64" rx="8" class="fx-box2"/>
<text x="105" y="76" text-anchor="middle" class="fx-t-b">Market simulator</text>
<text x="105" y="96" text-anchor="middle" class="fx-t-sm">paths, costs, jumps</text>
<rect x="250" y="50" width="160" height="64" rx="8" class="fx-box"/>
<text x="330" y="76" text-anchor="middle" class="fx-t-b">State at check k</text>
<text x="330" y="96" text-anchor="middle" class="fx-t-sm">price, time, shares held</text>
<rect x="470" y="50" width="190" height="64" rx="8" class="fx-hl"/>
<text x="565" y="76" text-anchor="middle" class="fx-t-b">Policy network θ</text>
<text x="565" y="96" text-anchor="middle" class="fx-t-sm">outputs shares to hold</text>
<line x1="190" y1="82" x2="248" y2="82" class="fx-line" marker-end="url(#deep-hedging-ah)"/>
<line x1="410" y1="82" x2="468" y2="82" class="fx-line" marker-end="url(#deep-hedging-ah)"/>
<polyline points="565,50 565,22 105,22 105,48" class="fx-line" fill="none" marker-end="url(#deep-hedging-ah)"/>
<text x="335" y="16" text-anchor="middle" class="fx-t-sm">trade, pay the cost, step the path forward — repeat N times</text>
<rect x="20" y="165" width="270" height="64" rx="8" class="fx-box"/>
<text x="155" y="191" text-anchor="middle" class="fx-t-b">P&amp;L at expiry, every path</text>
<text x="155" y="211" text-anchor="middle" class="fx-t-sm">premium − payoff + hedge gains − costs</text>
<rect x="350" y="165" width="160" height="64" rx="8" class="fx-bad"/>
<text x="430" y="191" text-anchor="middle" class="fx-t-b">Risk measure ρ</text>
<text x="430" y="211" text-anchor="middle" class="fx-t-sm">e.g. CVaR 95% of loss</text>
<line x1="105" y1="114" x2="105" y2="163" class="fx-line" marker-end="url(#deep-hedging-ah)"/>
<text x="112" y="144" class="fx-t-sm">after N checks</text>
<line x1="290" y1="197" x2="348" y2="197" class="fx-line" marker-end="url(#deep-hedging-ah)"/>
<polyline points="510,197 600,197 600,116" class="fx-line-hl fx-dash" fill="none" marker-end="url(#deep-hedging-ah)"/>
<text x="608" y="160" class="fx-t-hl">gradient:</text>
<text x="608" y="176" class="fx-t-hl">adjust θ</text>
</svg>
<figcaption>Figure 3 · The training loop. The top cycle plays out one hedge on thousands of simulated paths; the bottom row scores the whole batch with one number; the dashed arrow nudges the weights to make that number smaller. Repeat many times. Nothing in the loop needs a pricing formula or a delta.</figcaption>
</figure>

Three features make this different from textbook hedging:

- **No model Greeks are needed.** The network only needs *paths*. Any simulator will do — Black-Scholes, Heston ([[stochastic-vol]]), jumps, a data-driven market generator.
- **Frictions go straight into the objective.** Costs, discrete checks, position limits, even a second hedging instrument (the paper's examples include hedging in a Heston model with the stock and a variance swap).
- **The risk preference is explicit.** Change \(\rho\) from standard deviation to \(\text{CVaR}_{99\%}\) and you get a different hedge, on purpose.

Training is ordinary deep learning: draw a batch of paths, run the policy along them, compute \(\rho\), take a gradient step on \(\theta\), repeat. The paper reports that without costs the learned hedge closely matches the classic model hedge, and that with proportional costs the implied option price rises with the cost level.

Why did the classic hedge never face this choice? In [[binomial-one-step]] one option was replicated *exactly* by \(\Delta\) shares plus borrowing. Exact replication leaves no risk to measure, so every risk measure picks the same hedge and the price is simply the replication cost. Once replication is inexact, the risk measure starts to matter — and so does who is asking.

### ④ What the policy learns — and the price it implies

The main demo shrinks the recipe to its smallest honest form. Instead of a network with thousands of weights, the policy family has **one** parameter, the band half-width \(b\):

$$
\delta_k = \min\Big(\max\big(\delta_{k-1},\ \Delta^{\text{BS}}_k - b\big),\ \Delta^{\text{BS}}_k + b\Big)
$$

where \(\Delta^{\text{BS}}_k\) is the Black-Scholes delta at check \(k\) (σ = 20%). In words: keep yesterday's holdings if they are within \(b\) of delta; otherwise move to the nearest edge. Training means searching \(b\) on 1,000 training paths for the value that minimizes \(\text{CVaR}_{95\%}\), then testing on 1,000 *different* paths. At four checks a day:

| Cost \(c\) | Learned band \(b^*\) | CVaR 95%, delta hedge | CVaR 95%, learned band | Trades, band |
|---|---|---|---|---|
| 0 | 0 | $45 | $45 | 120 |
| 0.05% | 0.020 | $73 | $65 | 76 |
| 0.1% | 0.035 | $102 | $80 | 61 |
| 0.2% | 0.050 | $162 | $107 | 52 |
| 0.5% | 0.085 | $347 | $173 | 41 |

The pattern is the one traders describe: **higher costs, a wider band; zero cost, no band.** A full network can go further — let the band depend on time to expiry, moneyness or gamma, which is where a flexible \(F_\theta\) earns its keep.

The risk measure also gives a *price*. If the dealer wants the hedged position to carry zero CVaR, the premium has to cover the tail that is left. Because adding cash shifts every outcome equally, the extra premium needed is simply the CVaR of the hedged position (to within a few cents of interest):

> [!EXAMPLE] A risk-based price for Kai's call
> Black-Scholes says $2.45 per share. With four checks a day and no costs, the leftover hedging error has a CVaR of $45 per contract, so a CVaR-neutral dealer would ask about \(2.45 + 0.45 = \$2.90\). With a 0.1% cost the textbook hedge needs \(2.45 + 1.02 = \$3.47\); the learned band needs \(2.45 + 0.80 = \$3.25\). **The better hedge lets the dealer quote 22 cents a share tighter** — about $22 a contract. That is the commercial point of deep hedging: better hedges mean tighter quotes for the same risk.

This is the sense in which deep hedging stretches Idea ②: when replication is exact, the price is the replication cost; when it is not, the price is the replication cost *plus a charge for the risk you cannot hedge away*, and that charge depends on how well you hedge and how you measure risk.

### ⑤ Limits, and where this stands in 2026

A learned policy is only as good as the world it was trained in.

> [!WARN] Optimal in the simulator, not necessarily in the market
> Train the band at 20% volatility, then test it where realized volatility is 30%: the delta hedge's CVaR jumps from $102 to $338 and the band's from $80 to $302. Add occasional −8% gaps and they become $405 and $380. The learned band still beats the textbook hedge, but both are far outside what training promised. The simulator's assumptions — volatility, jumps, cost model — are baked into the policy.

The other limits follow from the same fact:

- **Tail estimates need many paths.** CVaR 99% of 1,000 paths averages only 10 outcomes; a network with many weights can overfit those few.
- **Explainability and model risk.** A band is easy to audit. A network with thousands of weights is not, and model-risk teams must still validate it against simple benchmarks.
- **It does not predict direction.** Deep hedging manages risk you have already taken; it is not a forecasting model and does not create edge by itself.
- **Garbage in, garbage out.** Research has moved toward better *market generators* — simulators trained on data — precisely because the policy inherits every flaw of its simulator.

State of play: deep hedging is a well-established research area, launched by a paper co-written by quants at a large bank and academics, with open-source implementations and many follow-ups on market generators, stochastic volatility and risk measures. How widely banks run such policies in production is not public; treat vendor claims with care. The idea that survives either way is the framing: **hedging is an optimization with frictions and a stated risk preference, and the delta hedge is its frictionless special case.** The same state–action–reward framing drives [[rl-market-making]], and the same “learn a fast function from simulations” trick drives [[neural-pricing]].

## @analogy
Think of a home thermostat. A naïve one set to 20°C would switch the heater on at 19.99° and off at 20.01°, clicking hundreds of times an hour. The room would stay at 20° almost exactly — and the relay would wear out, the heater would waste energy starting and stopping, and the noise would drive you mad. Real thermostats use a **dead band**: heat on at 19.5°, off at 20.5°. The room drifts a little, the switching drops by a factor of ten, and nobody notices the difference.

The textbook delta hedge is the naïve thermostat: it chases the target at every check. The no-trade band is the dead band. How wide should it be? That depends on how expensive each click is (trading cost), how fast the room loses heat (gamma and volatility), and how cold you can bear it to get (your risk measure). Deep hedging is like letting a smart thermostat learn its own dead band by trying thousands of simulated winters and scoring each one by the coldest nights it allowed.

Where the analogy breaks: a thermostat's house changes slowly and the physics is well known. The market's “physics” is not — if the simulated winters were milder than the real one, the learned dead band is wrong, and the smart thermostat will be confidently wrong on the first real cold snap.

## @misconceptions
- **“Deep hedging finds a perfect hedge.”** — It starts from the admission that no perfect hedge exists once costs and discrete checks are real. It finds the best compromise *for a chosen risk measure*, and some risk always remains.
- **“With a neural network you no longer need Black-Scholes and delta.”** — The delta hedge is the benchmark: with no costs the learned policy should collapse onto it, and in our demo it does. A learned hedge that cannot reproduce delta in the frictionless case is a bug, not an insight.
- **“Hedging more often is always safer.”** — Only for free. With a 0.1% cost the textbook hedge's CVaR is $102 at four checks a day but $120 at twelve, because costs grow about like \(\sqrt{N}\) while hedging error shrinks like \(1/\sqrt{N}\).
- **“A policy that wins in training will win in the market.”** — It is optimal for the simulator it learned from. Change the volatility or add jumps and its losses in our demo triple; the gap between simulated and real markets is the central risk.
- **“Deep hedging is AI predicting where the stock goes.”** — It predicts nothing about direction. It chooses how many shares to hold to manage a risk already taken, just as delta hedging does.

## @takeaways
- With trading costs, hedging becomes a trade-off: more frequent adjustments cut hedging error (\(\propto 1/\sqrt{N}\)) but raise costs (\(\propto \sqrt{N}\)).
- Deep hedging (Buehler, Gonon, Teichmann & Wood, 2019) learns a hedging policy \(\delta^{\theta}\) by minimizing a risk measure such as CVaR of the hedged P&L on simulated paths.
- The simplest learned policy is a no-trade band around delta; it widens as costs rise and vanishes when trading is free.
- The risk measure also prices the option: the premium must cover the CVaR of what cannot be hedged, so a better hedge supports a tighter quote.
- A learned hedge is only as good as its simulator — test it in worlds it did not train on.

## @quiz
1. A dealer hedges a short 30-day call four times a day and pays 0.1% per trade. Why can checking twelve times a day make the tail loss *worse*?
   - [ ] Because more frequent hedging increases gamma
   - [ ] Because Black-Scholes delta is wrong at high frequency
   - [x] Because costs grow roughly like \(\sqrt{N}\) while hedging error shrinks like \(1/\sqrt{N}\), so past some point the toll outweighs the precision
   - [ ] Because the option's premium falls when you hedge more
   > Each extra check adds a small adjustment that must pay the cost. In the simulation the textbook hedge's CVaR is $102 at four checks a day and $120 at twelve. Gamma is a property of the option, not of how often you hedge.
2. What does \(\text{CVaR}_{95\%}\) of a hedged position's loss measure?
   - [ ] The loss exceeded on 95% of paths
   - [x] The average loss over the worst 5% of outcomes
   - [ ] The standard deviation of the loss scaled by 1.65
   - [ ] The largest loss ever observed in the sample
   > VaR marks the edge of the worst 5%; CVaR averages everything beyond that edge. For the textbook hedge in the lesson, VaR 95% is $84 and CVaR 95% is $102.
3. In the demo, the cost is set to zero with four checks a day. What band does training select, and why?
   - [ ] A wide band, because trading is free so the dealer can afford to be lazy
   - [ ] A band of exactly 0.035, the value learned at 0.1% cost
   - [ ] It cannot train without costs
   - [x] Zero: with no cost every adjustment only reduces hedging error, so the policy collapses onto the textbook delta hedge
   > A good learned hedge must reproduce the classic answer when the classic assumptions hold. The band exists only to save costs; remove the costs and its reason disappears.
4. A deep-hedging policy was trained on paths with 20% volatility and no jumps. Which statement about its use in a market with 30% realized volatility is most accurate?
   - [ ] It will adapt automatically because neural networks generalize
   - [x] It may still beat the textbook hedge, but its losses can be far larger than training suggested, because the simulator's assumptions are baked into the policy
   - [ ] It will lose nothing, because it hedges delta
   - [ ] It will outperform, because higher volatility means more trading opportunities
   > In the demo the band's CVaR rises from $80 to $302 in the 30% world. It still beats the delta hedge's $338, but the promise of training does not transfer.
5. With a 0.1% cost, the learned band's CVaR is $80 per contract and the textbook hedge's is $102. What does that mean for the price a CVaR-neutral dealer quotes for the 30-day 100 call (Black-Scholes $2.45)?
   - [ ] Both quote $2.45, because the price is set by Black-Scholes
   - [ ] The band dealer must quote higher, because it hedges less
   - [ ] The difference cannot affect prices, only risk
   - [x] About $3.25 with the band versus $3.47 with the textbook hedge: a better hedge supports a tighter quote
   > The extra premium needed is the CVaR of the hedged position: \(2.45 + 0.80\) versus \(2.45 + 1.02\). Hedging less *precisely* but more *cleverly* leaves less tail to charge for.

## @further
- [Buehler, Gonon, Teichmann & Wood (2019), Deep Hedging, Quantitative Finance](https://www.tandfonline.com/doi/full/10.1080/14697688.2019.1571683) — the paper: hedging as risk-measure minimization over neural-network policies, with costs.
- [Deep Hedging on arXiv (1802.03042)](https://arxiv.org/abs/1802.03042) — the open preprint with the same experiments.
- [Expected shortfall (Wikipedia)](https://en.wikipedia.org/wiki/Expected_shortfall) — CVaR's definitions, properties and estimation.
- [Black & Scholes (1973), The Pricing of Options and Corporate Liabilities](https://doi.org/10.1086/260062) — the frictionless hedge that deep hedging generalizes.

## @next
A network learned to *hedge* from simulated paths. Can a network also learn to *price* — imitating a slow model like Heston thousands of times faster, so that calibration takes milliseconds? And what does it answer when you ask about a market it has never seen? That is [[neural-pricing]].
