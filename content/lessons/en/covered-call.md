---
id: covered-call
prereqs: four-positions, put-call-parity, theta, long-options
demo: covered-call
---

# Covered Calls: Renting Out Your Shares

## @hook
Kai owns 100 shares of XYZ, sells one 30-day call with a 105 strike, and collects $71 on the spot. As long as XYZ stays at or below 105, that $71 is pure “rent.” There is exactly one cost: **every dollar of upside above 105 now belongs to the buyer.** A covered call swaps a ceiling for rent, and this lesson prices that swap.

## @bridge
In [[long-options]] the option buyer paid theta rent every day. In this lesson Kai moves to the other side and collects it. The structure is simple — the short call from [[four-positions]] plus the 100 shares Kai already owns — and [[put-call-parity]] will show that it is really a short put in disguise. This lesson builds Idea ① (shape: the stock's straight line gets its top shaved off) and Idea ③ (volatility: selling an option is selling volatility).

## @intuition
Kai's second wish is to “earn some income while waiting.” XYZ is at $100; Kai doesn't expect a big rally within a month and would be happy to sell at 105. So Kai:

- keeps the **100 shares of XYZ** (cost 100);
- **sells one 30-day call with a 105 strike** for $0.71 per share, or \(0.71 \times 100 = \$71\) per contract.

That is a **covered call**. “Covered” means the call Kai sold is backed by stock: if the buyer exercises, Kai simply hands over the 100 shares already owned, with no need to buy shares in the market at a high price.

> [!KAI] Outcomes after 30 days (per share; × 100 = per contract)
> - XYZ falls to 90: the stock loses 10, the call expires, the rent stays: \(-10 + 0.71 = -9.29\);
> - XYZ at 100: the stock is flat: \(+0.71\);
> - XYZ at 105: the stock gains 5, the call just expires: \(+5.71\), or $571;
> - XYZ at 115: the shares are “called away” at 105: still \(+5.71\). Someone holding only the shares makes 15.

<figure>
<svg viewBox="0 0 660 280" role="img" aria-label="Shares only versus covered call at expiry"><defs><marker id="covered-call-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs><polygon points="60,130 60,130 62.8,130 65.6,130 68.4,130 71.2,130 74,130 76.8,130 79.6,130 82.4,130 85.2,130 88,130 90.8,130 93.6,130 96.4,130 99.2,130 102,130 104.8,130 107.6,130 110.4,130 113.2,130 116,130 118.8,130 121.6,130 124.4,130 127.2,130 130,130 132.8,130 135.6,130 138.4,130 141.2,130 144,130 146.8,130 149.6,130 152.4,130 155.2,130 158,130 160.8,130 163.6,130 166.4,130 169.2,130 172,130 174.8,130 177.6,130 180.4,130 183.2,130 186,130 188.8,130 191.6,130 194.4,130 197.2,130 200,130 202.8,130 205.6,130 208.4,130 211.2,130 214,130 216.8,130 219.6,130 222.4,130 225.2,130 228,130 230.8,130 233.6,130 236.4,130 239.2,130 242,130 244.8,130 247.6,130 250.4,130 253.2,130 256,130 258.8,130 261.6,130 264.4,130 267.2,130 270,130 272.8,130 275.6,130 278.4,130 281.2,130 284,130 286.8,130 289.6,130 292.4,130 295.2,130 298,130 300.8,130 303.6,130 306.4,130 309.2,130 312,130 314.8,130 317.6,130 320.4,130 323.2,130 326,130 328.8,130 331.6,129.4 334.4,128.4 337.2,127.4 340,126.4 342.8,125.4 345.6,124.4 348.4,123.4 351.2,122.4 354,121.4 356.8,120.3 359.6,119.3 362.4,118.3 365.2,117.3 368,116.3 370.8,115.3 373.6,114.3 376.4,113.3 379.2,112.3 382,111.3 384.8,110.2 387.6,109.2 390.4,108.2 393.2,107.2 396,106.2 398.8,105.2 401.6,104.2 404.4,103.2 407.2,102.2 410,101.2 412.8,101.2 415.6,101.2 418.4,101.2 421.2,101.2 424,101.2 426.8,101.2 429.6,101.2 432.4,101.2 435.2,101.2 438,101.2 440.8,101.2 443.6,101.2 446.4,101.2 449.2,101.2 452,101.2 454.8,101.2 457.6,101.2 460.4,101.2 463.2,101.2 466,101.2 468.8,101.2 471.6,101.2 474.4,101.2 477.2,101.2 480,101.2 482.8,101.2 485.6,101.2 488.4,101.2 491.2,101.2 494,101.2 496.8,101.2 499.6,101.2 502.4,101.2 505.2,101.2 508,101.2 510.8,101.2 513.6,101.2 516.4,101.2 519.2,101.2 522,101.2 524.8,101.2 527.6,101.2 530.4,101.2 533.2,101.2 536,101.2 538.8,101.2 541.6,101.2 544.4,101.2 547.2,101.2 550,101.2 552.8,101.2 555.6,101.2 558.4,101.2 561.2,101.2 564,101.2 566.8,101.2 569.6,101.2 572.4,101.2 575.2,101.2 578,101.2 580.8,101.2 583.6,101.2 586.4,101.2 589.2,101.2 592,101.2 594.8,101.2 597.6,101.2 600.4,101.2 603.2,101.2 606,101.2 608.8,101.2 611.6,101.2 614.4,101.2 617.2,101.2 620,101.2 620,130" class="fx-area-ok"/><polygon points="60,130 60,227.4 62.8,226.3 65.6,225.3 68.4,224.3 71.2,223.3 74,222.3 76.8,221.3 79.6,220.3 82.4,219.3 85.2,218.3 88,217.3 90.8,216.2 93.6,215.2 96.4,214.2 99.2,213.2 102,212.2 104.8,211.2 107.6,210.2 110.4,209.2 113.2,208.2 116,207.2 118.8,206.2 121.6,205.1 124.4,204.1 127.2,203.1 130,202.1 132.8,201.1 135.6,200.1 138.4,199.1 141.2,198.1 144,197.1 146.8,196.1 149.6,195 152.4,194 155.2,193 158,192 160.8,191 163.6,190 166.4,189 169.2,188 172,187 174.8,186 177.6,185 180.4,183.9 183.2,182.9 186,181.9 188.8,180.9 191.6,179.9 194.4,178.9 197.2,177.9 200,176.9 202.8,175.9 205.6,174.9 208.4,173.8 211.2,172.8 214,171.8 216.8,170.8 219.6,169.8 222.4,168.8 225.2,167.8 228,166.8 230.8,165.8 233.6,164.8 236.4,163.8 239.2,162.7 242,161.7 244.8,160.7 247.6,159.7 250.4,158.7 253.2,157.7 256,156.7 258.8,155.7 261.6,154.7 264.4,153.7 267.2,152.6 270,151.6 272.8,150.6 275.6,149.6 278.4,148.6 281.2,147.6 284,146.6 286.8,145.6 289.6,144.6 292.4,143.6 295.2,142.6 298,141.5 300.8,140.5 303.6,139.5 306.4,138.5 309.2,137.5 312,136.5 314.8,135.5 317.6,134.5 320.4,133.5 323.2,132.5 326,131.4 328.8,130.4 331.6,130 334.4,130 337.2,130 340,130 342.8,130 345.6,130 348.4,130 351.2,130 354,130 356.8,130 359.6,130 362.4,130 365.2,130 368,130 370.8,130 373.6,130 376.4,130 379.2,130 382,130 384.8,130 387.6,130 390.4,130 393.2,130 396,130 398.8,130 401.6,130 404.4,130 407.2,130 410,130 412.8,130 415.6,130 418.4,130 421.2,130 424,130 426.8,130 429.6,130 432.4,130 435.2,130 438,130 440.8,130 443.6,130 446.4,130 449.2,130 452,130 454.8,130 457.6,130 460.4,130 463.2,130 466,130 468.8,130 471.6,130 474.4,130 477.2,130 480,130 482.8,130 485.6,130 488.4,130 491.2,130 494,130 496.8,130 499.6,130 502.4,130 505.2,130 508,130 510.8,130 513.6,130 516.4,130 519.2,130 522,130 524.8,130 527.6,130 530.4,130 533.2,130 536,130 538.8,130 541.6,130 544.4,130 547.2,130 550,130 552.8,130 555.6,130 558.4,130 561.2,130 564,130 566.8,130 569.6,130 572.4,130 575.2,130 578,130 580.8,130 583.6,130 586.4,130 589.2,130 592,130 594.8,130 597.6,130 600.4,130 603.2,130 606,130 608.8,130 611.6,130 614.4,130 617.2,130 620,130 620,130" class="fx-area-bad"/><polygon points="410,101.2 620,29 620,101.2" class="fx-area-blue"/><line x1="60" y1="130" x2="630" y2="130" class="fx-axis" marker-end="url(#covered-call-ah)"/><text x="60" y="146" text-anchor="middle" class="fx-t-sm">80</text><text x="200" y="146" text-anchor="middle" class="fx-t-sm">90</text><text x="340" y="146" text-anchor="middle" class="fx-t-sm">100</text><text x="480" y="146" text-anchor="middle" class="fx-t-sm">110</text><text x="620" y="146" text-anchor="middle" class="fx-t-sm">120</text><text x="52" y="235" text-anchor="end" class="fx-t-sm">−20</text><line x1="60" y1="231" x2="620" y2="231" class="fx-grid"/><text x="52" y="184.5" text-anchor="end" class="fx-t-sm">−10</text><line x1="60" y1="180.5" x2="620" y2="180.5" class="fx-grid"/><text x="52" y="83.5" text-anchor="end" class="fx-t-sm">+10</text><line x1="60" y1="79.5" x2="620" y2="79.5" class="fx-grid"/><text x="52" y="33" text-anchor="end" class="fx-t-sm">+20</text><line x1="60" y1="29" x2="620" y2="29" class="fx-grid"/><polyline points="60,231 620,29" class="fx-line-muted fx-dash"/><polyline points="60,227.4 410,101.2 620,101.2" class="fx-line-thick"/><line x1="410" y1="24" x2="410" y2="236" class="fx-line fx-dash"/><text x="414" y="36" class="fx-t-sm">K = 105</text><circle cx="330" cy="130" r="5" class="fx-fill-orange"/><text x="324" y="120" text-anchor="end" class="fx-t-hl">BE 99.29</text><text x="508" y="119.2" text-anchor="middle" class="fx-t-b">capped at +5.71</text><text x="612" y="92" text-anchor="end" class="fx-t-blue">upside given away</text><text x="556" y="30" text-anchor="end" class="fx-t-sm">shares only</text><text x="170" y="222" class="fx-t-sm">downside: 0.71 better than shares only</text><text x="620" y="272" text-anchor="end" class="fx-t-sm">XYZ price at expiry; vertical axis = P&L per share (× 100 = per contract)</text></svg>
<figcaption>Figure 1 · Covered call (solid) versus shares only (dashed) at expiry. Below 105 the covered call is always 0.71 better than the shares alone; above 105 it is flattened into a horizontal line. The violet triangle is what the $71 of rent bought from Kai: all of the upside above 105.</figcaption>
</figure>

The trade-off is plain in the picture: **0.71 of certain income in exchange for the uncertain gains above 105.** The downside barely changes — a covered call loses only 0.71 less than the stock. It is not insurance.

Before expiry the position has a Greek signature that is the mirror of the buyer's:

| Position (1 unit = 100 shares + 1 short 105 call) | Δ | Γ | Θ per day | ν per vol point |
|---|---|---|---|---|
| 100 shares only | +100 shares | 0 | 0 | 0 |
| Covered call | +78 shares | −5.2 | +$3.08 | −$8.54 |

\(\Delta\) drops from 100 shares to about 78: Kai gains less when the stock rises. \(\Theta\) is positive: each day that passes earns Kai about $3 of time value. \(\Gamma\) and \(\nu\) are negative: **large moves and rising implied volatility work against Kai.** Selling options is, at heart, selling volatility ([[vega]]).

> [!THINK] On day 5 XYZ jumps to 110. Has Kai already locked in the maximum profit of $571?
> Think first: 110 at expiry means +5.71 — but what about on day 5?
> ---
> Not yet. On day 5 the 105 call still has 25 days to run and costs about 5.81 — 0.81 of time value above its 5 of intrinsic value. The position shows \((110 - 100) - (5.81 - 0.71) = 4.90\), or $490. **The maximum profit is paid only at expiry:** the time value left in the short call is handed back to Kai slowly, by the passage of time.

We'll take it in six parts:

- **① Three numbers: max profit, breakeven, yield**
- **② Choosing the strike and expiry: rent versus ceiling**
- **③ Before expiry: signature, assignment and early exercise**
- **④ Rolling: what to do when the stock nears the strike**
- **⑤ Covered call = short put: parity reveals the real risk**
- **⑥ State of play (2026): the BXM index and option-income ETFs**

## @mechanics
### ① Three numbers: max profit, breakeven, yield

Let \(S_0\) be the purchase price of the stock, \(K\) the strike of the call sold and \(c\) the premium received per share. At expiry:

$$
\Pi(S_T) = \underbrace{(S_T - S_0)}_{\text{stock}} + \underbrace{c - \max(S_T - K,\,0)}_{\text{short call}} = \min(S_T,\,K) - S_0 + c
$$

where \(S_T\) is the stock price at expiry and \(\Pi\) the P&L per share. Three numbers follow directly:

- **max profit** \(= (K - S_0) + c\), reached when the stock finishes at or above \(K\);
- **breakeven** \(= S_0 - c\): the rent lowers your cost basis by \(c\);
- **max loss** \(= S_0 - c\): if the stock goes to zero you lose almost everything, just like the shareholder.

> [!EXAMPLE] Kai's numbers
> \(S_0 = 100\), \(K = 105\), \(c = 0.71\):
> $$
> \begin{gathered}\text{max profit} = (105 - 100) + 0.71 = 5.71 \;\Rightarrow\; 5.71 \times 100 = \$571 \\ \text{breakeven} = 100 - 0.71 = 99.29\end{gathered}
> $$
> If the call isn't exercised, the month's **static return** is \(0.71 / 100 = 0.71\%\). Annualised with compounding:
> $$
> \left(1 + 0.0071\right)^{365/30} - 1 \approx 9.0\%
> $$
> That “9% a year” assumes you can sell on the same terms every month and that the stock never makes a big move — it is a yardstick for comparison, not a promise ([[breakeven-returns]]).

Another useful way to see it: **a covered call is like a limit sell order that pays you for being placed.** If assigned, Kai has effectively sold the shares at \(105 + 0.71 = 105.71\); if not, Kai keeps the 0.71 and still has the shares. Compared with simply resting a limit order to sell at 105.71, there are two differences. A limit order can be cancelled any time and fills whenever the stock trades through 105.71; the covered call locks Kai into the 105 price until expiry, and what counts is where the stock sits at that moment, so a spike above 105 that fades again doesn't trigger a sale. The trade is a good one only if Kai genuinely wants to sell at that price.

### ② Choosing the strike and expiry: rent versus ceiling

The lower the strike, the more rent — and the lower the ceiling. For 30-day calls at 20% implied volatility:

| Call sold | Rent (per share) | Δ | Risk-neutral P(called) | Max profit | Breakeven | Static yield, annualised |
|---|---|---|---|---|---|---|
| 100 (ATM) | 2.45 | 0.534 | 51.1% | 2.45 | 97.55 | 34.3% |
| 102 | 1.57 | 0.398 | 37.6% | 3.57 | 98.43 | 20.8% |
| 105 | 0.71 | 0.222 | 20.5% | 5.71 | 99.29 | 9.0% |
| 110 | 0.14 | 0.057 | 5.1% | 10.14 | 99.86 | 1.7% |

**The row with the highest annualised yield puts the ceiling right at today's price.** Selling the at-the-money call gives up almost all of the upside in exchange for a 2.45 cushion; selling the 110 call brings almost no rent and almost no cap. No row is “best” — only the one that matches your answer to “at what price would I be happy to sell?”

The expiry is a dial too. Theta accelerates in the final weeks ([[theta]]), so short-dated options pay more rent per day — but gamma is higher too, and risk arrives faster when the stock moves:

| Call with delta ≈ 0.22 | Strike | Rent | Average rent per day | Γ |
|---|---|---|---|---|
| 7 days | 102.26 | 0.35 | 0.050 | 0.107 |
| 30 days | 105.00 | 0.71 | 0.024 | 0.052 |
| 90 days | 109.51 | 1.21 | 0.013 | 0.030 |

Selling weekly collects about twice as much per day as selling monthly — with twice the gamma. More rent comes with more frequent assignment and more frequent decisions.

The third dial is **implied volatility**. The same 30-day 105 call pays 0.71 of rent at 20% implied volatility and 1.66 at 30% — more than double. But the richer rent isn't free: at 30% the risk-neutral chance of being called away also rises from 20.5% to 28.4%, and the market usually quotes 30% because it expects a big move (earnings, for example). **Rent is highest precisely when the house is most likely to be bought away — or to fall down.** Whether the rent is expensive depends on comparing implied volatility with the realized volatility you expect, not on the size of the premium alone.

::demo[covered-call-roll]

### ③ Before expiry: signature, assignment and early exercise

The covered call's signature is **Δ positive but below 1, Γ negative, Θ positive, ν negative.** It dislikes big moves in both directions: a big rally hits the ceiling, a big drop hits the stock. What it likes is “drift up towards the strike, then stop.”

Assignment is a normal outcome, not an accident: if the stock finishes above 105 the buyer exercises, the OCC randomly assigns the exercise notice to a clearing member, the broker allocates it to a specific short account, and Kai delivers the shares at 105, collecting the maximum profit. American options can also be **assigned early**, most commonly just before an ex-dividend date: when the dividend exceeds the call's remaining time value, the holder has a reason to exercise early and collect the dividend ([[exercise-assignment]]). XYZ pays no dividend, so Kai mainly faces assignment at expiry.

> [!WARN] The real risk is below, not above
> If the stock falls to 80, the covered call loses \(80 - 100 + 0.71 = -19.29\) per share, or $1,929 per contract — only $71 better than the shares alone. Collecting rent doesn't change the fact that Kai owns 100 shares.

Translated into a fits / doesn't-fit list (a description of how it is used, not advice):

- **Fits:** shares you intend to hold anyway and would be willing to sell at a higher price; an outlook of sideways or gently rising prices; wanting the holding to produce some cash flow.
- **Doesn't fit:** expecting a big rally soon (the ceiling cuts off exactly the move you want); being mainly worried about a fall (the cushion is too thin); earnings ahead with very high implied volatility when you don't want gap risk — the rich rent is precisely the fee for that gap.
- **Watch out:** once the call is sold you can't freely sell the shares, or the remaining short call becomes naked, with entirely different broker approval and margin requirements ([[margin-approval]]).

### ④ Rolling: what to do when the stock nears the strike

**Rolling** = buying back the old option + selling a new one, usually as a single multi-leg order ([[orders]]). Two common forms:

- **roll out:** same strike, later expiry;
- **roll up and out:** higher strike, later expiry.

The cash flow of a roll comes down to one number:

$$
\text{net roll} = c_{\text{new}} - c_{\text{old (buy back)}}
$$

> [!EXAMPLE] Day 20, XYZ at 106
> The old 105 call has 10 days left and costs 2.02 to buy back (1 of intrinsic value, 1.02 of time value).
> - Roll out to the 105 call 40 days away: sell for 3.57, a net credit of \(3.57 - 2.02 = 1.55\); the ceiling stays at 105.
> - Roll up and out to the 110 call 40 days away: sell for 1.43, a net debit of \(1.43 - 2.02 = -0.59\); the ceiling rises to 110.
>
> Rolling up costs $59 and buys 5 more dollars of upside room. **A roll is not a free repair:** it is a new trading decision that happens to be bundled with the old position.

### ⑤ Covered call = short put: parity reveals the real risk

Put-call parity ([[put-call-parity]]) says \(C - P = S - Ke^{-rT}\) (no dividends). Rearranged:

$$
S - C = Ke^{-rT} - P
$$

The left side is “own the stock + sell a call,” the covered call. The right side is “hold the present value of the strike in cash + sell a put at the same strike.” **Their values at expiry are identical:** both equal \(\min(S_T, K)\).

> [!EXAMPLE] Checking with Kai's numbers
> The 30-day 105 put costs 5.37, and the present value of 105 is \(105 \times e^{-0.04 \times 30/365} = 104.66\):
> $$
> 100 - 0.71 = 99.29, \qquad 104.66 - 5.37 = 99.29
> $$
> The two portfolios cost exactly the same today.

<figure>
<svg viewBox="0 0 640 256" role="img" aria-label="Covered call equals short put plus cash"><rect x="20" y="10" width="278" height="236" rx="10" class="fx-box"/><text x="159" y="32" text-anchor="middle" class="fx-t-b">100 shares + short 105 call</text><line x1="34" y1="190" x2="284" y2="190" class="fx-axis"/><text x="34" y="206" text-anchor="middle" class="fx-t-sm">80</text><text x="159" y="206" text-anchor="middle" class="fx-t-sm">100</text><text x="284" y="206" text-anchor="middle" class="fx-t-sm">120</text><polyline points="34,174.4 284,50" class="fx-line-muted fx-dash"/><polyline points="34,174.4 190.3,96.7 284,96.7" class="fx-line-thick"/><text x="40" y="64" class="fx-t-sm">value at expiry = min(S, 105)</text><text x="282" y="44" text-anchor="end" class="fx-t-sm">shares only</text><text x="159" y="232" text-anchor="middle" class="fx-t-hl">costs 100 − 0.71 = 99.29 today</text><text x="320" y="130" text-anchor="middle" class="fx-t-b">=</text><rect x="342" y="10" width="278" height="236" rx="10" class="fx-box"/><text x="481" y="32" text-anchor="middle" class="fx-t-b">cash + short 105 put</text><line x1="356" y1="190" x2="606" y2="190" class="fx-axis"/><text x="356" y="206" text-anchor="middle" class="fx-t-sm">80</text><text x="481" y="206" text-anchor="middle" class="fx-t-sm">100</text><text x="606" y="206" text-anchor="middle" class="fx-t-sm">120</text><polyline points="356,96.7 606,96.7" class="fx-line-muted fx-dash"/><polyline points="356,174.4 512.3,96.7 606,96.7" class="fx-line-thick"/><text x="362" y="64" class="fx-t-sm">value at expiry = min(S, 105)</text><text x="362" y="90" class="fx-t-sm">cash: 105 at expiry</text><text x="481" y="232" text-anchor="middle" class="fx-t-hl">costs 104.66 − 5.37 = 99.29 today</text></svg>
<figcaption>Figure 2 · Left: 100 shares + a short 105 call. Right: 104.66 in cash + a short 105 put. Both are worth \(\min(S_T, 105)\) at expiry and both cost 99.29 today. A covered call is a cash-secured short put in different clothes.</figcaption>
</figure>

The identity has two practical consequences. First, a covered call has the risk profile of a **short put**: collect a premium, carry the downside ([[cash-secured-put]]). Second, its signature is short gamma and short vega: you are selling volatility. Over long periods, sellers of index options have on average earned the premium of implied over realized volatility — and occasionally lost heavily in sharp sell-offs ([[variance-risk-premium]]).

### ⑥ State of play (2026): the BXM index and option-income ETFs

- **The BXM index** (Cboe S&P 500 BuyWrite Index) holds the S&P 500 and sells a one-month **at-the-money** SPX call every month, rolling on the third Friday. Cboe launched it on April 11, 2002, with history back-filled to June 1986. It is the most widely used benchmark for covered calls.
- **Option-income ETFs:** according to Morningstar, its “derivative income” ETF category grew from under $1 billion at the end of 2020 to about $180 billion by mid-2026 (category definitions differ between providers).
- Examples: QYLD sells at-the-money Nasdaq-100 index calls every month and had net assets of about $8.5 billion as of September 25, 2026; JEPI gets short exposure to out-of-the-money S&P 500 calls through equity-linked notes and reportedly held about $44 billion in mid-2026.

> [!FACT] A high distribution rate ≠ a high total return
> These products often advertise high distribution rates, but the distributions come from option premiums, paid for by capping the upside while keeping most of the downside (see the BXM and PUT methodology documents). Judge them by **total return** (price change plus distributions), not by the distribution rate. Taken together they are a major seller of volatility in the market ([[retail-flows]], [[systematic-vol]]). Figures as of mid-2026 to September 2026.

## @analogy
A covered call is like **renting out your house and giving the tenant an option to buy it for $1.05 million within a month**.

Kai collects an extra “option fee” (the premium). A month later:

- if the house is worth less than $1.05 million, the tenant doesn't buy, Kai keeps the fee and the house, and can do it again next month;
- if the house is worth $1.2 million, the tenant buys it at $1.05 million. Kai earns the stretch from $1 million to $1.05 million plus the fee, but the stretch from $1.05 million to $1.2 million goes to the tenant;
- if the house is worth $800,000, the tenant certainly doesn't buy, and the fee covers only a small part of the fall.

If Kai was happy to sell at $1.05 million anyway, it's a comfortable deal; if Kai believes prices will double, the option should never have been signed.

The analogy is wrong in two places. First, a real option fee isn't set on a whim by the landlord; it is set by volatility: the more turbulent the market, the higher the fee and the bigger the risk. Second, once a house is sold it's gone, while in the options world you can pay to buy the option back at any time before expiry — which is what rolling does.

## @misconceptions
- **“A covered call is risk-free income.”** — The downside is almost untouched: if XYZ falls to 80, Kai still loses 19.29 per share, only 0.71 less than the shareholder.
- **“Selling calls protects my shares.”** — The cushion is one premium (0.71% here). To protect the downside you need to buy a put or build a collar ([[protective-put-collar]]).
- **“The premium is extra return on top of the stock's return.”** — It is the price of the upside you sold. Under fair pricing the rent received and the upside given away are worth the same in risk-neutral terms; any average excess return comes only from implied volatility exceeding realized volatility.
- **“Getting assigned means I lost.”** — Assignment at 105 is exactly the maximum profit of $571. The only “loss” is the opportunity cost compared with holding the shares alone.
- **“The strike with the highest annualised yield is best.”** — The at-the-money call annualises to 34%, but its ceiling is at today's price and it gets called away about half the time. Annualised numbers don't tell you what you gave up.

## @takeaways
- Covered call = own the stock + sell a call: a certain rent \(c\) in exchange for all of the upside above \(K\).
- Three numbers: max profit \((K - S_0) + c\), breakeven \(S_0 - c\), and a maximum loss close to the whole stock price — the downside is essentially unchanged.
- Its signature is Δ below 1, Γ negative, Θ positive, ν negative: it likes “drift to the strike and stop” and dislikes big moves in either direction.
- By parity a covered call equals a cash-secured short put; at heart it sells volatility.
- Option-income ETFs and the BXM index are this strategy at scale; judge them by total return, not by distribution rate.

## @quiz
1. Kai owns 100 shares (cost 100) and sells the 30-day 105 call for 0.71. At expiry XYZ closes at 115. How much does this covered call make per contract?
   - [ ] $1,500
   - [ ] $71
   - [x] $571
   - [ ] $1,571
   > The shares are called away at 105 for a gain of 5; add the 0.71 of rent for 5.71 per share, or $571 per contract. Holding only the shares would make $1,500; the difference is the upside given away.
2. Which statement best describes the risk of a covered call?
   - [ ] The maximum loss is the premium received
   - [x] The downside is almost the same as owning the stock, less one premium
   - [ ] It can lose without limit if the stock rallies
   - [ ] It can't lose money unless it gets assigned
   > The short call is backed by the stock, so a rally only means earning less; the real losses come from a falling stock, and the premium provides only a 0.71 cushion.
3. The Greek signature of the covered call (100 shares + one short 105 call) is:
   - [ ] Δ = 100 shares, Γ positive, Θ negative
   - [ ] Δ negative, Γ negative, Θ positive
   - [x] Δ about 78 shares, Γ negative, Θ positive, ν negative
   - [ ] Δ about 78 shares, Γ positive, Θ positive, ν positive
   > The short call has Δ of −0.22, so the total is about +0.78; selling the option brings negative Γ, positive Θ and negative ν. Positive Γ together with positive Θ would be a free lunch.
4. By put-call parity, “100 shares + a short 105 call” is equivalent to:
   - [ ] a long 105 put + borrowing
   - [ ] a long 105 call + cash
   - [x] cash equal to the present value of 105 + a short 105 put
   - [ ] short 100 shares + a long 105 call
   > \(S - C = Ke^{-rT} - P\). Both sides are worth \(\min(S_T, 105)\) at expiry and both cost 99.29 today.
5. On day 20 XYZ is at 106. Buying back the old 105 call costs 2.02, and the 110 call 40 days away can be sold for 1.43. This roll up and out means:
   - [ ] A net credit of 1.43 and a higher ceiling — pure profit
   - [x] A net debit of 0.59 in exchange for raising the ceiling from 105 to 110
   - [ ] A net credit of 0.59 with the ceiling unchanged
   - [ ] A net debit of 2.02, because the old call must be bought back at intrinsic value
   > Net roll \(= 1.43 - 2.02 = -0.59\): Kai pays $59 for 5 more dollars of upside room and a new 40-day short call. A roll is a new decision, not a free repair.

## @further
- [Cboe S&P 500 BuyWrite Index (BXM) methodology](https://cdn.cboe.com/api/global/us_indices/governance/BXM_Methodology.pdf) — the primary source on how the index sells at-the-money SPX calls each month.
- [CBOE S&P 500 BuyWrite Index (Wikipedia)](https://en.wikipedia.org/wiki/CBOE_S%26P_500_BuyWrite_Index) — BXM's history and the background of Whaley's 2002 study.
- [Covered call (Wikipedia)](https://en.wikipedia.org/wiki/Covered_call) — structure, payoff and common variants.
- [OCC: Characteristics and Risks of Standardized Options](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the official statement of writers' obligations and the assignment process.
- [Options Industry Council (OIC)](https://www.optionseducation.org/) — strategy pages on covered calls and FAQs on exercise and assignment.

## @next
The covered call's twin is the short put: instead of buying the stock first, you get paid to promise to buy it at a lower price. In the next lesson Kai sells a cash-secured put — and then joins the two end to end into a cycle called “the wheel.”
