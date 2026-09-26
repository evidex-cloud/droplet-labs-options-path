---
id: capstone
prereqs: option-chain, implied-vol, term-structure, earnings-events, strategy-matrix, vertical-spreads, position-sizing, portfolio-risk, perps-vs-options, first-trade, common-traps
demo: capstone
---

# Capstone: From a View to a Complete Trade

## @hook
Everything in this course was built for one moment: a real view, a real chain, real money at risk. The capstone runs Kai's view on XYZ before earnings through the whole pipeline — chain, volatility, structure, Greeks, stress test, size, order, management, post-mortem — and then does it again for bitcoin, perp against option. The punchline: the best trade is rarely the one with the biggest payoff. It is the one that still makes sense when you are wrong.

## @bridge
The course began in [[welcome]] with Kai's three wishes and one sentence about rights and obligations. Since then we have built four ideas: ① shape ([[payoff-lego]], [[strategy-matrix]]), ② no-arbitrage ([[put-call-parity]]), ③ volatility ([[implied-vol]], [[earnings-events]]) and ④ risk ([[greeks-map]], [[position-sizing]], [[portfolio-risk]]). [[first-trade]] walked one simple trade end to end, and [[common-traps]] listed where trades die. This graduation lesson uses all four ideas on one decision, in the order a professional would, and ends with a short appendix, the [[cheat-sheet]].

## @intuition
Here is the situation, with every number fixed so you can check each step.

> [!KAI] Kai's view, three weeks before earnings
> Kai still owns **100 XYZ bought at $100** ($10,000) and now also holds **$10,000 in cash**: a $20,000 account. XYZ reports earnings after the close on **day 21**; the nearest monthly options expire on **day 30**. Kai has read the product reviews and believes the quarter will beat: “XYZ could be at **$106–108** in a month.” Kai also has one rule written on a sticky note: **no single trade may lose more than 2% of the account — $400.**

A beginner stops here: bullish, so buy calls. An expert treats the sentence above as a **hypothesis** and runs it through a series of tests, each of which can change the trade or cancel it. The course has given us ten such tests. Laid end to end, they form a pipeline.

<figure>
<svg viewBox="0 0 680 250" role="img" aria-label="The ten-step decision pipeline from a view to a post-mortem">
<defs><marker id="capstone-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="8" y="24" width="120" height="62" rx="8" class="fx-hl"/>
<rect x="8" y="150" width="120" height="62" rx="8" class="fx-ok"/>
<rect x="144" y="24" width="120" height="62" rx="8" class="fx-box"/>
<rect x="144" y="150" width="120" height="62" rx="8" class="fx-box"/>
<rect x="280" y="24" width="120" height="62" rx="8" class="fx-blue"/>
<rect x="280" y="150" width="120" height="62" rx="8" class="fx-box"/>
<rect x="416" y="24" width="120" height="62" rx="8" class="fx-box"/>
<rect x="416" y="150" width="120" height="62" rx="8" class="fx-bad"/>
<rect x="552" y="24" width="120" height="62" rx="8" class="fx-box"/>
<rect x="552" y="150" width="120" height="62" rx="8" class="fx-bad"/>
<text x="68" y="46" text-anchor="middle" class="fx-t-b">1 · View</text>
<text x="68" y="64" text-anchor="middle" class="fx-t-sm">direction, size, date</text>
<text x="68" y="80" text-anchor="middle" class="fx-t-sm">idea ①</text>
<text x="68" y="172" text-anchor="middle" class="fx-t-b">10 · Post-mortem</text>
<text x="68" y="190" text-anchor="middle" class="fx-t-sm">process vs outcome</text>
<text x="204" y="46" text-anchor="middle" class="fx-t-b">2 · Chain</text>
<text x="204" y="64" text-anchor="middle" class="fx-t-sm">spreads, parity</text>
<text x="204" y="80" text-anchor="middle" class="fx-t-sm">idea ②</text>
<text x="204" y="172" text-anchor="middle" class="fx-t-b">9 · Manage</text>
<text x="204" y="190" text-anchor="middle" class="fx-t-sm">rules written first</text>
<text x="340" y="46" text-anchor="middle" class="fx-t-b">3 · Volatility</text>
<text x="340" y="64" text-anchor="middle" class="fx-t-sm">IV vs RV, event</text>
<text x="340" y="80" text-anchor="middle" class="fx-t-sm">idea ③</text>
<text x="340" y="172" text-anchor="middle" class="fx-t-b">8 · Order</text>
<text x="340" y="190" text-anchor="middle" class="fx-t-sm">one ticket, at mid</text>
<text x="476" y="46" text-anchor="middle" class="fx-t-b">4 · Candidates</text>
<text x="476" y="64" text-anchor="middle" class="fx-t-sm">three shapes</text>
<text x="476" y="80" text-anchor="middle" class="fx-t-sm">idea ①</text>
<text x="476" y="172" text-anchor="middle" class="fx-t-b">7 · Size</text>
<text x="476" y="190" text-anchor="middle" class="fx-t-sm">budget ÷ stress loss</text>
<text x="476" y="206" text-anchor="middle" class="fx-t-sm">idea ④</text>
<text x="612" y="46" text-anchor="middle" class="fx-t-b">5 · Greeks</text>
<text x="612" y="64" text-anchor="middle" class="fx-t-sm">Δ, Γ, Θ, ν</text>
<text x="612" y="80" text-anchor="middle" class="fx-t-sm">idea ④</text>
<text x="612" y="172" text-anchor="middle" class="fx-t-b">6 · Stress</text>
<text x="612" y="190" text-anchor="middle" class="fx-t-sm">the morning after</text>
<text x="612" y="206" text-anchor="middle" class="fx-t-sm">idea ④</text>
<line x1="128" y1="55" x2="142" y2="55" class="fx-line" marker-end="url(#capstone-ah)"/>
<line x1="264" y1="55" x2="278" y2="55" class="fx-line" marker-end="url(#capstone-ah)"/>
<line x1="400" y1="55" x2="414" y2="55" class="fx-line" marker-end="url(#capstone-ah)"/>
<line x1="536" y1="55" x2="550" y2="55" class="fx-line" marker-end="url(#capstone-ah)"/>
<line x1="612" y1="86" x2="612" y2="148" class="fx-line" marker-end="url(#capstone-ah)"/>
<line x1="552" y1="181" x2="538" y2="181" class="fx-line" marker-end="url(#capstone-ah)"/>
<line x1="416" y1="181" x2="402" y2="181" class="fx-line" marker-end="url(#capstone-ah)"/>
<line x1="280" y1="181" x2="266" y2="181" class="fx-line" marker-end="url(#capstone-ah)"/>
<line x1="144" y1="181" x2="130" y2="181" class="fx-line" marker-end="url(#capstone-ah)"/>
<line x1="68" y1="150" x2="68" y2="88" class="fx-line-hl fx-dash" marker-end="url(#capstone-ah)"/>
<text x="78" y="123" class="fx-t-hl">lessons feed the next view</text>
<text x="602" y="123" text-anchor="end" class="fx-t-bad">red steps can veto the trade</text>
<text x="340" y="238" text-anchor="middle" class="fx-t-sm">every step answers one question the course has already taught you to ask</text>
</svg>
<figcaption>Figure 1 · The decision pipeline. The top row turns a view into candidate trades; the bottom row turns one candidate into a managed position. The stress test and the sizing step can cancel the trade on their own. The post-mortem closes the loop: what Kai learns becomes part of the next view.</figcaption>
</figure>

Why so many steps for one small trade? Because each step catches a different mistake. The chain catches bad prices. The volatility step catches paying for a move the market already expects. The Greeks show what you are *really* betting on. The stress test shows what happens on a bad morning. The size step turns “I can afford this premium” into “I can afford this loss”. And the post-mortem stops you from learning the wrong lesson from a lucky outcome.

> [!THINK] Before looking at a single option: what is Kai's biggest risk right now, and does a bullish option trade add to it or reduce it?
> Look at what Kai already owns.
> ---
> Kai already holds 100 shares of XYZ — 100 “deltas” of the same bet. A bullish option trade **adds to that bet**; it does not diversify it. That doesn't forbid the trade, but it means the stress test must include the shares, and the size limit matters more, not less. (A collar from [[protective-put-collar]] would have *reduced* the risk instead; Kai is choosing to express the view on top, knowingly.)

We'll take the case in six parts:

- **① The view and the chain**
- **② Volatility: IV vs RV and the implied move**
- **③ Three candidates and their Greeks**
- **④ Stress test and size**
- **⑤ Order, management and post-mortem**
- **⑥ The bitcoin variant: perp vs option**

## @mechanics
### ① The view and the chain

First, write the view as a sentence that can be proved wrong. “Bullish” cannot. This can: **“XYZ closes between $105 and $110 at the day-30 expiry; the thesis is wrong if XYZ closes below $97 after earnings.”** It has a direction (up), a size (+5% to +10%), a date (day 30, with earnings on day 21), and a failure condition. It is also honest about what Kai does *not* have: **no view on volatility** — no reason to think the earnings move will be bigger or smaller than the market expects.

Now the chain ([[option-chain]]). With earnings inside the 30-day expiry, every option in it trades at a higher implied vol than XYZ's everyday 20%. For teaching, the chain below is flat at **25%**; a real chain would add skew. Why only 25%, when [[common-traps]] showed XYZ's 7-day options at about 37% the night before earnings? It is the same earnings day, diluted: one jumpy day spread over 30 days lifts the average vol far less than the same day spread over 7. Step ② measures exactly this.

| Strike | Call bid / ask | Call Δ | Put bid / ask | Put Δ |
|---|---|---|---|---|
| 90 | 10.37 / 10.61 | 0.94 | 0.17 / 0.21 | −0.06 |
| 95 | 6.13 / 6.29 | 0.79 | 0.87 / 0.93 | −0.21 |
| **100** | **2.97 / 3.07** | 0.53 | **2.64 / 2.74** | −0.47 |
| 105 | 1.14 / 1.20 | 0.27 | 5.74 / 5.90 | −0.73 |
| 110 | 0.33 / 0.37 | 0.11 | 9.87 / 10.11 | −0.89 |

Two quick checks before trusting any number. **Liquidity:** the at-the-money call's spread is \(0.10 / 3.02 \approx 3.3\%\) of mid — acceptable ([[liquidity-spreads]]). **Consistency:** calls and puts must agree through put-call parity (Idea ②):

$$
C - P = S - Ke^{-rT} \quad\Rightarrow\quad 3.02 - 2.69 = 0.33 = 100 - 99.67
$$

where \(C\) and \(P\) are the mid prices of the 100 call and 100 put, \(S = 100\) the stock, and \(Ke^{-rT} = 100\,e^{-0.04 \times 30/365} = 99.67\) the present value of the strike. The two sides match to the cent, so the quotes imply the same forward (100.33) and no stale prices. If they did not match, the first suspect would be a dividend or a borrow cost Kai had missed ([[forwards-carry]]).

### ② Volatility: IV vs RV and the implied move

Kai's own measurements: over the last 30 trading days, excluding earnings, XYZ's **realized vol** was about 18%, and over a longer window about 20% ([[realized-vol]]). The chain says 25%. Is 25% “expensive”?

Not necessarily — and this is the most common mistake at this step. The 25% covers **30 ordinary days plus one earnings day**; the 18–20% covers ordinary days only. Compare like with like by pulling the earnings day out of the implied variance ([[term-structure]]):

$$
\sigma_{\text{event}}^2 = \sigma_{30}^2\,T_{30} - \sigma_{\text{base}}^2\left(T_{30} - \tfrac{1}{365}\right)
$$

where \(\sigma_{30}\) is the 30-day implied vol, \(T_{30} = 30/365\), \(\sigma_{\text{base}}\) the everyday vol (20%), and \(\sigma_{\text{event}}\) the standard deviation of the one-day earnings move — the event priced as one extra day with its own variance.

> [!EXAMPLE] How big a move is the market pricing?
> $$
> \sigma_{\text{event}}^2 = 0.25^2 \times \tfrac{30}{365} - 0.20^2 \times \tfrac{29}{365} = 0.005137 - 0.003178 = 0.001959
> $$
> so \(\sigma_{\text{event}} = \sqrt{0.001959} \approx 4.4\%\). The expected **absolute** move of a normal variable is about \(0.8\) standard deviations, so the market expects an earnings-day move of about \(0.8 \times 4.4\% \approx 3.5\%\), up or down.
> Kai's history for the last eight reports (illustrative): +3.1%, −5.2%, +2.4%, +6.8%, −1.9%, +4.0%, −2.7%, +3.5% — an average absolute move of **3.7%**. Priced 3.5%, delivered 3.7%: **the event is fairly priced.** The everyday part, 20% implied against 18–20% realized, carries only the usual small premium ([[variance-risk-premium]]).
> The 60-day expiry agrees: with the same event inside, its implied vol should be \(\sqrt{(0.20^2 \times 59/365 + 0.001959)/(60/365)} \approx 22.6\%\) — the usual hump around an event: highest at the first expiry after it, lower further out. Squeeze the same event into a 7-day expiry and you get \(\sqrt{(0.20^2 \times 6/365 + 0.001959)/(7/365)} \approx 36.9\%\): the “about 37%” of the IV-crush example in [[common-traps]]. One event, three expiries, three implied vols.

Two more numbers complete the picture. The 30-day at-the-money straddle costs \(3.02 + 2.69 = 5.71\): the market's expected distance at expiry is about **±5.7%** ([[implied-vol]]). Kai's target of +6% to +8% is a little beyond that, which is fine — a directional view is allowed to be bolder than the average move — but it is not wildly beyond it.

The conclusion of step 3 is a constraint on step 4: **Kai has no volatility edge, so Kai should not choose a structure whose result depends mainly on volatility.** No big long-vega bet (you would pay for the event at a fair price and lose the crush), and no big short-vega bet (you would be selling a fairly priced event with a fat left tail).

### ③ Three candidates and their Greeks

Three natural bullish structures, all on the day-30 expiry, priced at mid ([[strategy-matrix]]):

- **A · Long 100 call** for 3.02. Maximum loss $302; breakeven 103.02; unlimited upside.
- **B · 100/105 bull call spread**: buy the 100 call, sell the 105 call, net debit \(3.02 - 1.17 = 1.85\) ([[vertical-spreads]]). Maximum loss $185; breakeven 101.85; maximum profit

$$
\Pi_{\max} = (K_2 - K_1) - \text{debit} = (105 - 100) - 1.85 = 3.15 \ \text{per share} = \$315 \ \text{per contract}
$$

where \(K_1\) and \(K_2\) are the long and short strikes. The spread gives up everything above 105 in exchange for a lower cost.
- **C · Short 95 put** (cash-secured) for 0.90. Maximum profit $90; breakeven 94.10; maximum loss \(94.10 \times 100 = \$9{,}410\) if XYZ goes to zero, and it ties up \(\$9{,}500\) of cash ([[cash-secured-put]]).

<figure>
<svg viewBox="0 0 660 240" role="img" aria-label="Expiry P&amp;L per contract of the three candidates">
<text x="120" y="22" text-anchor="middle" class="fx-t-b">A · long 100 call</text>
<text x="330" y="22" text-anchor="middle" class="fx-t-b">B · 100/105 call spread</text>
<text x="540" y="22" text-anchor="middle" class="fx-t-b">C · short 95 put</text>
<polygon points="30,106.7 30,131.8 120,131.8 138.1,106.7" class="fx-area-bad"/>
<polygon points="138.1,106.7 186,40.2 186,106.7" class="fx-area-ok"/>
<polygon points="240,106.7 240,122.1 330,122.1 341.1,106.7" class="fx-area-bad"/>
<polygon points="341.1,106.7 360,80.4 420,80.4 420,106.7" class="fx-area-ok"/>
<polygon points="450,106.7 450,182.5 504.6,106.7" class="fx-area-bad"/>
<polygon points="504.6,106.7 510,99.2 630,99.2 630,106.7" class="fx-area-ok"/>
<line x1="30" y1="106.7" x2="210" y2="106.7" class="fx-axis"/>
<line x1="240" y1="106.7" x2="420" y2="106.7" class="fx-axis"/>
<line x1="450" y1="106.7" x2="630" y2="106.7" class="fx-axis"/>
<polyline points="30,131.8 120,131.8 186,40.2" class="fx-line-thick"/>
<polyline points="240,122.1 330,122.1 360,80.4 420,80.4" class="fx-line-thick"/>
<polyline points="450,182.5 510,99.2 630,99.2" class="fx-line-thick"/>
<text x="75" y="148" text-anchor="middle" class="fx-t-bad">−$302</text>
<text x="190" y="52" class="fx-t-ok">open</text>
<text x="285" y="138" text-anchor="middle" class="fx-t-bad">−$185</text>
<text x="390" y="72" text-anchor="middle" class="fx-t-ok">+$315</text>
<text x="570" y="92" text-anchor="middle" class="fx-t-ok">+$90</text>
<text x="462" y="200" class="fx-t-bad">−$910 at 85, −$9,410 at 0</text>
<text x="146" y="123" class="fx-t-sm">103.02</text>
<text x="349" y="121" class="fx-t-sm">101.85</text>
<text x="514" y="123" class="fx-t-sm">94.10</text>
<text x="30" y="222" class="fx-t-sm">85</text>
<text x="200" y="222" class="fx-t-sm">115</text>
<text x="240" y="222" class="fx-t-sm">85</text>
<text x="410" y="222" class="fx-t-sm">115</text>
<text x="450" y="222" class="fx-t-sm">85</text>
<text x="620" y="222" class="fx-t-sm">115</text>
<text x="330" y="238" text-anchor="middle" class="fx-t-sm">XYZ at the day-30 expiry · P&amp;L per contract · same vertical scale in all three panels</text>
</svg>
<figcaption>Figure 2 · The three candidates at expiry, on the same scale. A risks the most premium and keeps the whole upside; B risks less and gives up everything above 105; C wins a little almost everywhere and loses a lot in the one place Kai already loses — a big drop in XYZ.</figcaption>
</figure>

The payoff diagram shows the shape (Idea ①). The Greeks show what each shape is betting on right now (Idea ④; [[greeks-map]]). Per contract, at 25% implied vol:

| Per contract | Δ (shares) | Γ | Θ per day | ν per vol pt |
|---|---|---|---|---|
| A · long 100 call | +53.3 | +5.55 | −$5.30 | +$11.40 |
| B · 100/105 call spread | +25.8 | +0.90 | −$1.03 | +$1.84 |
| C · short 95 put | +21.3 | −4.05 | +$3.22 | −$8.32 |

Read the table as three different bets. **A** is a bet on direction *and* on volatility: its vega of $11.40 means a 5-point drop in implied vol after earnings costs about $57 even if XYZ does not move. **B** is almost a pure direction bet: its long and short calls cancel most of the gamma, theta and vega. **C** is a bet *against* volatility with a mild bullish lean: it earns $3.22 a day while nothing happens and loses on a big move either way — but only the downside is uncapped. Kai's step-3 conclusion (no vol edge) already points at B.

> [!DEEP] What a real chain would change
> A flat 25% chain is a teaching simplification. Real equity chains carry **skew** ([[smile-skew]]): the 95 put might trade at 27–28% implied and the 105 call at 23–24%. That would make C collect more premium — the market pays well for crash insurance — and would price B's two legs at slightly different vols, moving its cost by a few cents. It would not change the logic: skew is exactly the price of the left tail that makes C dangerous.

::demo[capstone-compare]

### ④ Stress test and size

The payoff diagram is about expiry. The dangerous moment is earlier: **the morning after earnings**, day 22, with 8 days left and implied vol back at the everyday 20%. The stress grid reprices each candidate there with Black-Scholes ([[portfolio-risk]]):

| XYZ on day 22 | A · call | B · spread | C · short put | Kai's 100 shares |
|---|---|---|---|---|
| $85 (−15%) | −$302 | −$185 | −$902 | −$1,500 |
| $90 (−10%) | −$302 | −$185 | −$406 | −$1,000 |
| $95 (−5%) | −$297 | −$180 | −$18 | −$500 |
| $100 (flat) | −$180 | −$70 | +$85 | $0 |
| $105 (+5%) | +$213 | +$201 | +$90 | +$500 |
| $110 (+10%) | +$707 | +$307 | +$90 | +$1,000 |

Now apply the sticky note. The number of contracts is the budget divided by the **worst loss in the stress grid**, rounded down ([[position-sizing]]):

$$
n = \left\lfloor \frac{\text{risk budget}}{\text{worst stress loss per contract}} \right\rfloor
$$

where the risk budget is $400 and the worst stress loss is the most negative number in each column. **A:** \(\lfloor 400 / 302 \rfloor = 1\). **B:** \(\lfloor 400 / 185 \rfloor = 2\). **C:** \(\lfloor 400 / 902 \rfloor = 0\) — **the short put fails the test**, and it would also lock up $9,500 of Kai's $10,000 cash.

So the real comparison is **one long call against two spreads**:

- Delta: 53 against 52 — the same directional exposure.
- Vega: $11.40 against $3.68 — the spread barely cares about the crush.
- Theta: −$5.30 against −$2.06 a day.
- In Kai's target zone at expiry (105–110): the spreads make up to \(2 \times 315 = \$630\); the call makes $198 to $698. The call only wins if XYZ finishes above **$109.32**, where \(100 \times (S - 103.02) = 630\) — beyond the top of Kai's own target.

Kai chooses **B, two contracts**. Not because it has the biggest payoff, but because it matches every part of the view: the direction, the size of the move, and the absence of a vol view.

> [!WARN] Don't forget the shares
> The trade-level stress test passed. The account-level one is sobering: at −15% on day 22 the account loses \(1{,}500 + 370 = \$1{,}870\), **9.4% of $20,000**, and the account's total delta is \(100 + 52 = 152\) shares of XYZ — $15,200 of exposure on $20,000. Kai accepts it knowingly, for one month, with an exit rule. A professional risk manager would at least ask whether a protective put on the existing shares belongs in the same plan ([[protective-put-collar]]).

### ⑤ Order, management and post-mortem

**Order.** Kai enters the spread as **one two-leg ticket**, never as two separate orders — legging in exposes you to the market moving between fills ([[orders]]). The natural price (pay the ask on the 100, receive the bid on the 105) is \(3.07 - 1.14 = 1.93\); the mid is 1.85. Kai places a limit order to buy 2 spreads at 1.85, waits ten minutes without a fill, and moves to 1.87. Filled. Cost: \(2 \times 1.87 \times 100 = \$374\), plus a few dollars in contract fees (commonly around $0.50–0.65 per contract, varying by broker). With the fill, maximum profit is \((5 - 1.87) \times 200 = \$626\) and the breakeven 101.87.

**Management rules, written before the fill** ([[trading-psychology]]):

1. **Take profit** if the spread is worth 4.00 or more (80% of its 5.00 width) — the last dollar is the slowest and riskiest to collect.
2. **Exit** if XYZ closes below $97 after earnings — the thesis is broken; don't wait for expiry to confirm it.
3. **Close by day 29 at the latest.** Never carry the short 105 call into expiration day: pin risk and assignment live there ([[common-traps]]).
4. **No rolling, no adding.** If the rules say exit, exit.
5. **Calendar check:** no dividend before expiry (\(q = 0\)), so early assignment of the short call is unlikely unless it goes deep in the money near the end.

**What happened.** Earnings beat. On day 22 XYZ opens at **$105.50** and implied vol drops to 20%. The spread's mid is **4.07**; rule 1 triggers. Kai sells both spreads at 4.02: \((4.02 - 1.87) \times 200 = +\$430\) before fees.

**The post-mortem** separates *where* the money came from. Reprice step by step — first the stock move, then the vol change, then the passage of time — and each difference is one factor's contribution:

$$
\Delta V = \underbrace{V(S_1, \sigma_0, t_0) - V_0}_{\text{stock move}} + \underbrace{V(S_1, \sigma_1, t_0) - V(S_1, \sigma_0, t_0)}_{\text{vol change}} + \underbrace{V(S_1, \sigma_1, t_1) - V(S_1, \sigma_1, t_0)}_{\text{time}}
$$

where \(V_0\) is the value at entry (\(S_0 = 100\), \(\sigma_0 = 25\%\), \(t_0\) = day 0), and \(S_1 = 105.50\), \(\sigma_1 = 20\%\), \(t_1\) = day 22 are the new stock price, implied vol and date.

> [!EXAMPLE] Kai's post-mortem, in numbers (per share, mid to mid)
> - **Spread (B):** stock move \(+1.42\), vol change \(+0.20\), time \(+0.59\): total \(+2.21\), from 1.85 to 4.07.
> - **Long call (A), for comparison:** stock move \(+3.70\), vol change \(-0.40\), time \(-0.70\): total \(+2.61\), from 3.02 to 5.63 — about **$261** for the one contract Kai's budget allowed.
> Two surprises teach the most. The spread's vega and theta **flipped sign** on the way: once XYZ reached the short strike, the short 105 call had more vega and more time value to lose than the long 100 call, so the crush and the passing days *helped*. Greeks are local; they describe the position you have today, not the one you will have after the move ([[greeks-map]]).
> And the alternative morning: had XYZ opened at $94, the spread would be worth about 0.02; rule 2 exits for \((0.02 - 1.87) \times 200 = -\$370\) — inside the budget, as designed. The shares would be down $600.

> [!KEY] Grade the process, not the outcome
> Kai's journal entry scores the decision on the same five questions whether the result was +$430 or −$370: Was the view testable? Did the structure match the view, including the vol part? Was the size set by the stress loss? Was the order worked, not chased? Were the rules followed? A good process can lose money and a bad one can make it; only the process is under your control, and only the process compounds.

### ⑥ The bitcoin variant: perp vs option

Same pipeline, different market. Kai also has a crypto view: **bitcoin higher over the next 30 days.** All numbers are **illustrative**: BTC at $100,000, 30-day implied vol 50%, a 4% rate for option pricing, and baseline perp funding of +0.01% per 8 hours. To compare like with like, every candidate is sized by the **same $600 worst case** — the XYZ discipline applied to a new market ([[perps-vs-options]]).

Two formulas do most of the work ([[margin-liquidation]], [[funding-rate]]):

$$
P_{\text{liq}} \approx P_0\left(1 - \frac{1}{L} + m\right), \qquad \text{funding cost} = Q\,P\,f\,n\,d
$$

where \(P_0\) is the entry price, \(L\) the leverage, \(m\) the maintenance margin rate (0.5% here), \(Q\) the position in BTC, \(P\) the price, \(f\) the funding rate per interval, \(n\) intervals per day and \(d\) days held. At 10× the liquidation price is \(100{,}000 \times (1 - 0.1 + 0.005) = \$90{,}500\); at 3× it is about $67,167. Holding 0.06 BTC for 30 days at baseline funding costs \(0.06 \times 100{,}000 \times 0.0001 \times 3 \times 30 = \$54\).

| Candidate (worst case = $600) | Size | Day 5 dip to $89k, day 30 at $115k | Flat at $100k | Steady rise to $115k | Falls to $80k |
|---|---|---|---|---|---|
| 30-day 100k call ($5,870 per BTC) | 0.102 BTC | **+$933** | −$600 | +$933 | −$600 |
| 100k/115k call spread ($4,473 per BTC) | 0.134 BTC | **+$1,412** | −$600 | +$1,412 | −$600 |
| 10× perp ($600 margin) | 0.060 BTC | **−$600 (liquidated)** | −$54 | +$846 | −$600 |
| 3× perp (liq ≈ $67,167) | 0.029 BTC | +$405 | −$26 | +$405 | −$600 |

<figure>
<svg viewBox="0 0 660 230" role="img" aria-label="How much bitcoin exposure the same 600-dollar worst case buys">
<line x1="200" y1="24" x2="200" y2="196" class="fx-axis"/>
<rect x="200" y="30" width="184" height="28" rx="4" class="fx-fill-orange"/>
<rect x="200" y="72" width="241" height="28" rx="4" class="fx-fill-blue"/>
<rect x="200" y="114" width="108" height="28" rx="4" class="fx-fill-btc"/>
<rect x="200" y="156" width="52" height="28" rx="4" class="fx-fill-btc"/>
<text x="190" y="48" text-anchor="end" class="fx-t-b">100k call</text>
<text x="376" y="48" text-anchor="end" class="fx-t-inv">0.102 BTC</text>
<text x="394" y="48" class="fx-t-sm">worst case only at expiry: ~53%</text>
<text x="190" y="90" text-anchor="end" class="fx-t-b">100k/115k spread</text>
<text x="433" y="90" text-anchor="end" class="fx-t-inv">0.134 BTC</text>
<text x="451" y="90" class="fx-t-sm">gains capped at $115,000</text>
<text x="190" y="132" text-anchor="end" class="fx-t-b">10× perp</text>
<text x="300" y="132" text-anchor="end" class="fx-t-inv">0.060 BTC</text>
<text x="318" y="132" class="fx-t-bad">worst case any hour it touches $90,500: ~51%</text>
<text x="190" y="174" text-anchor="end" class="fx-t-b">3× perp</text>
<text x="260" y="174" class="fx-t-b">0.029 BTC</text>
<text x="338" y="174" class="fx-t-sm">worst case needs a −20% crash</text>
<text x="330" y="218" text-anchor="middle" class="fx-t-sm">bitcoin exposure bought by a $600 worst case (illustrative, BTC $100,000, 50% vol, 30 days)</text>
</svg>
<figcaption>Figure 3 · Sizing by the worst case turns the usual intuition upside down. Leverage makes the perp look like the “big” position, but once its worst case is capped at $600, the perps buy *less* bitcoin exposure than either option; the call and the call spread buy the most. The percentages are the chance the worst case actually happens within 30 days under a 50%-vol, no-drift model: about 53% for the options (ending below $100,000), about 51% for the 10× perp touching liquidation at any time.</figcaption>
</figure>

Every row loses exactly $600 in its worst column — that is how the sizes were chosen: \(Q = 600 / \text{worst loss per BTC}\), where the worst loss per BTC is the premium for the options, the whole margin \(100{,}000 / 10 = \$10{,}000\) for the 10× perp, and a 20% crash plus funding, \(20{,}000 + 900 = \$20{,}900\), for the 3× perp.

Read the table row by row. **The 10× perp** is the cheapest to hold while you are right ($54 of funding against the call's $600 premium), and in a steady rally it earns almost as much as the call. But its worst case can arrive on any bad afternoon: with 50% vol and no drift, a 10× long touches its liquidation price within 30 days on about **51%** of paths — and in the first column it is liquidated on day 5, before the rally it predicted. **The 3× perp** survives every path here, but an honest $600 worst case allows only 0.029 BTC. **The call** can't be liquidated; its worst case comes only at expiry. **The call spread** buys the most exposure up to $115,000 and nothing beyond — the XYZ logic again: if your target is $115,000, don't pay for what lies past it.

::demo[capstone-btc]

The bitcoin variant ends where the XYZ case did. Leverage is not exposure, and premium is not risk; **the worst case, sized to a fixed budget, is the only fair yardstick** between a linear and a convex instrument ([[crypto-options]]).

## @analogy
A good trade plan is a pilot's flight plan. The destination is the view: not “somewhere north”, but a named airport and an arrival time. The weather briefing is the volatility step: nobody cancels a flight because it's windy, but everybody checks whether the forecast wind is already in the schedule. The route options are the candidate structures, and the instruments — altitude, airspeed, heading — are the Greeks: they tell you what the aircraft is doing right now. Fuel reserves and alternate airports are the stress test and the size: you load enough fuel for the bad day, not the average one. The clearance is the order, filed once, cleanly. In-flight checks are the management rules, decided on the ground where it is quiet. And the debrief happens after every flight, the smooth ones too, because the smooth ones hide the near-misses.

The analogy breaks in two useful places. The weather does not react to the pilot's plan, but markets do: prices move because people like Kai trade, and a crowded view is a different view. And a perfect flight plan almost guarantees a safe landing, while a perfect trade plan guarantees nothing about the outcome — only that you will be alive, and wiser, for the next one.

## @misconceptions
- **“A strong view deserves the structure with the biggest payoff.”** — A strong view deserves the structure that matches *all* of the view: direction, size, timing and volatility. Kai's call spread paid more than the long call everywhere inside Kai's own target.
- **“IV of 25% against realized vol of 18% means the options are expensive, so sell them.”** — Compare like with like. The 25% contains an earnings day; stripped out, the event was priced at a 3.5% move against a 3.7% history, and the everyday part at 20% against 18–20%.
- **“If the trade made money, the plan was good.”** — Outcomes mix skill and luck. Grade the process with the same questions whether the result was +$430 or −$370.
- **“The perp is cheaper, so it's the better way to express a crypto view.”** — It is cheaper to hold while you are right. Sized to the same worst case, it buys less exposure, and its worst case can come at any hour, not just at expiry.
- **“Stress tests are for funds, not small accounts.”** — A small account has less room for a bad morning, not more. Kai's stress grid removed the short put before it could hurt, in one line of arithmetic.

## @takeaways
- Write the view as a falsifiable sentence with direction, size, date and a failure condition — and say explicitly whether you have a volatility view.
- Compare implied and realized vol like with like: strip the event out of the implied variance before calling options cheap or expensive.
- Choose the structure whose Greeks match the view; with no vol edge, prefer low vega.
- Size by the worst loss in the stress grid, not by the premium, and include what you already own.
- Write the management rules before the fill, then grade the process, not the outcome.
- Across linear and convex instruments, the worst case at a fixed budget is the fair yardstick.

## @quiz
1. XYZ's 30-day implied vol is 25% with one earnings day inside; its everyday vol is 20%. Roughly what earnings-day move is the market pricing (expected absolute move)?
   - [ ] About 25% — the implied vol itself
   - [ ] About 5%, the difference between 25% and 20%
   - [x] About 3.5% — a one-day event standard deviation of about 4.4%, times 0.8
   - [ ] About 5.7%, the straddle's implied move
   > Event variance \(= 0.25^2 \times 30/365 - 0.20^2 \times 29/365 \approx 0.00196\), so \(\sigma_{\text{event}} \approx 4.4\%\) and the expected absolute move is about \(0.8 \times 4.4\% \approx 3.5\%\). The straddle's 5.7% covers the whole 30 days, not just the event.
2. Why did Kai prefer two 100/105 call spreads to one 100 call?
   - [x] Similar delta, much lower vega and theta, and a higher payoff inside Kai's own target range — a match for a view with no vol edge
   - [ ] The spread has unlimited upside
   - [ ] The spread cannot lose money after earnings
   - [ ] One call was too expensive to buy at all
   > Two spreads carry 52 deltas against the call's 53, but only $3.68 of vega against $11.40 and −$2.06 of theta against −$5.30. The call only wins above $109.32, beyond Kai's target.
3. The short 95 put loses $902 per contract in the day-22 stress scenario at $85. With a $400 risk budget, how many contracts can Kai sell?
   - [ ] One — the premium received is only $90
   - [ ] Four — $400 divided by the $90 premium
   - [ ] Ten, as long as the cash covers assignment
   - [x] Zero — the worst stress loss is bigger than the whole budget
   > \(\lfloor 400 / 902 \rfloor = 0\). Sizing by premium is the trap from [[common-traps]]; sizing by stress loss removes the trade before it can hurt.
4. After the rally to $105.50, the spread's vega contribution to P&L was positive even though implied vol fell. Why?
   - [ ] Vega is always positive for a debit spread
   - [ ] The attribution has a rounding error
   - [x] Near the short 105 strike, the short call carries more vega than the long 100 call, so the spread became short vega
   - [ ] Implied vol actually rose after earnings
   > Greeks are local. At entry the spread was slightly long vega (+$1.84); after XYZ moved to the short strike, the short leg dominated and falling vol helped.
5. Sized so that each position's worst case is about $600, which statement about the bitcoin candidates is right?
   - [ ] The 10× perp gives the biggest exposure because it has the most leverage
   - [x] The 10× perp buys less bitcoin exposure than either option position, and its worst case can arrive at any hour
   - [ ] The call can be liquidated if bitcoin dips to $89,000
   - [ ] All four candidates carry the same probability of hitting their worst case
   > A 10× perp's worst case is its whole margin, so a $600 cap allows 0.06 BTC — less than the 0.102 BTC of calls. With 50% vol it touches liquidation within 30 days about half the time. The call's worst case comes only at expiry.
6. Kai's trade made +$430. What belongs in the post-mortem?
   - [ ] Nothing — the trade was profitable
   - [ ] A note to trade bigger next time, since the plan worked
   - [ ] Only the final P&L and the exit price
   - [x] The same process questions Kai would ask after a loss, plus the attribution: stock move, vol change and time
   > Grading the outcome teaches luck; grading the process teaches skill. The attribution also revealed that the spread's Greeks flipped sign — a lesson for the next trade.

## @further
- [CFA Institute: How well does the market predict volatility?](https://blogs.cfainstitute.org/investor/2024/07/31/how-well-does-the-market-predict-volatility/) — decades of implied vs realized vol; the evidence behind “compare like with like”.
- [OCC: Characteristics and Risks of Standardized Options](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the document to read before your first real trade.
- [Deribit: DVOL, the bitcoin implied-vol index](https://insights.deribit.com/exchange-updates/dvol-deribit-implied-volatility-index/) — where the bitcoin variant's “50% vol” would come from in practice.
- [Strategy Path (sister course)](https://evidex-cloud.github.io/droplet-labs-strategy-path/) — decision-making under uncertainty: the game theory and behavioral economics behind a good process.
- [New Finance Path (sister course)](https://evidex-cloud.github.io/droplet-labs-finance-path/) — the wider financial system that XYZ, rates and bitcoin live in.

## @next
You have walked the whole path. One page remains: every formula and key number from the course in one place, each linked back to the lesson where it was built — the [[cheat-sheet|cheat sheet]] to keep open next to your next chain.
