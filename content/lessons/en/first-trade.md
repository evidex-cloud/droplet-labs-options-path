---
id: first-trade
prereqs: orders, covered-call, strategy-matrix, position-sizing, trading-psychology, broker-platform
demo: first-trade
---

# A Real Trade, End to End

## @hook
A trade is not one decision but a chain of seven: thesis, structure, liquidity, size, order, management, journal. Most beginner losses come from a skipped link, not from a wrong forecast. Follow Kai's first covered call through every link — on paper first — and you will have a template for every trade after it.

## @bridge
You have all the pieces. [[covered-call]] gave the shape and its numbers, [[strategy-matrix]] matched structures to views, [[position-sizing]] and [[trading-psychology]] set the risk budget and the rules against your own biases, [[orders]] showed how to place the ticket, and [[broker-platform]] opened the account. This lesson assembles them into one process, and it builds Idea ④ (risk) in its most practical form: risk is managed by rules written *before* the trade. The traps that break the process are collected in [[common-traps]], and the full case with three competing structures is the [[capstone]].

## @intuition
Here is Kai's situation, in plain numbers. Kai owns 100 shares of XYZ bought at $100. XYZ trades at $100, its options are priced at 20% implied volatility, and it reports earnings in about three weeks. Kai would be glad to sell the shares at $105 and would like some income while waiting.

That sentence already contains a trade: **sell one 30-day 105 call against the shares** for about $0.71 per share, $71 per contract. But “sell the call” is the fifth step, not the first. Before it come four questions Kai must answer in writing, and after it come three more.

<figure>
<svg viewBox="0 0 700 250" role="img" aria-label="The seven steps of a trade, with the journal feeding back into the next thesis">
<defs><marker id="first-trade-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="10" y="40" width="88" height="62" rx="8" class="fx-hl"/>
<text x="54" y="64" text-anchor="middle" class="fx-t-b">1 Thesis</text>
<text x="54" y="84" text-anchor="middle" class="fx-t-sm">one sentence</text>
<rect x="108" y="40" width="88" height="62" rx="8" class="fx-box"/>
<text x="152" y="64" text-anchor="middle" class="fx-t-b">2 Structure</text>
<text x="152" y="84" text-anchor="middle" class="fx-t-sm">strike, expiry</text>
<rect x="206" y="40" width="88" height="62" rx="8" class="fx-box"/>
<text x="250" y="64" text-anchor="middle" class="fx-t-b">3 Liquidity</text>
<text x="250" y="84" text-anchor="middle" class="fx-t-sm">spread, OI</text>
<rect x="304" y="40" width="88" height="62" rx="8" class="fx-box"/>
<text x="348" y="64" text-anchor="middle" class="fx-t-b">4 Size</text>
<text x="348" y="84" text-anchor="middle" class="fx-t-sm">worst case</text>
<rect x="402" y="40" width="88" height="62" rx="8" class="fx-box"/>
<text x="446" y="64" text-anchor="middle" class="fx-t-b">5 Order</text>
<text x="446" y="84" text-anchor="middle" class="fx-t-sm">limit at mid</text>
<rect x="500" y="40" width="88" height="62" rx="8" class="fx-box"/>
<text x="544" y="64" text-anchor="middle" class="fx-t-b">6 Manage</text>
<text x="544" y="84" text-anchor="middle" class="fx-t-sm">rules, alerts</text>
<rect x="598" y="40" width="92" height="62" rx="8" class="fx-ok"/>
<text x="644" y="64" text-anchor="middle" class="fx-t-b">7 Journal</text>
<text x="644" y="84" text-anchor="middle" class="fx-t-sm">exit, review</text>
<line x1="98" y1="71" x2="106" y2="71" class="fx-line" marker-end="url(#first-trade-ah)"/>
<line x1="196" y1="71" x2="204" y2="71" class="fx-line" marker-end="url(#first-trade-ah)"/>
<line x1="294" y1="71" x2="302" y2="71" class="fx-line" marker-end="url(#first-trade-ah)"/>
<line x1="392" y1="71" x2="400" y2="71" class="fx-line" marker-end="url(#first-trade-ah)"/>
<line x1="490" y1="71" x2="498" y2="71" class="fx-line" marker-end="url(#first-trade-ah)"/>
<line x1="588" y1="71" x2="596" y2="71" class="fx-line" marker-end="url(#first-trade-ah)"/>
<path d="M644,102 L644,150 L54,150 L54,106" class="fx-line-hl fx-dash" fill="none" marker-end="url(#first-trade-ah)"/>
<text x="349" y="142" text-anchor="middle" class="fx-t-hl">the journal feeds the next thesis</text>
<rect x="10" y="170" width="382" height="66" rx="8" class="fx-box2"/>
<text x="201" y="192" text-anchor="middle" class="fx-t-b">Decided before the order is sent</text>
<text x="201" y="212" text-anchor="middle" class="fx-t-sm">steps 1–4 and the rules of step 6 are written down</text>
<text x="201" y="228" text-anchor="middle" class="fx-t-sm">while no money is at risk and nothing is moving</text>
<rect x="402" y="170" width="288" height="66" rx="8" class="fx-box2"/>
<text x="546" y="192" text-anchor="middle" class="fx-t-b">Executed after</text>
<text x="546" y="212" text-anchor="middle" class="fx-t-sm">the order, the alerts firing,</text>
<text x="546" y="228" text-anchor="middle" class="fx-t-sm">the exit and the honest review</text>
</svg>
<figcaption>Figure 1 · A trade as a pipeline. Everything left of the order is decided in calm conditions; everything right of it is the plan being carried out. The dashed arrow is what turns single trades into a process that improves.</figcaption>
</figure>

The point of writing it all down is simple. **Once the trade is on, you will be tempted to change the plan for emotional reasons** — a sudden rally makes the capped upside feel unbearable, a dip makes you want to “do something”. [[trading-psychology]] showed where those urges come from. A plan written in calm conditions is the antidote: during the trade you execute it, and you change it only for reasons you can write down.

> [!KAI] Paper first
> Kai will run this exact trade in the broker's paper-trading account first — the same ticket, the same alerts, the same exit rules — and move to real money only after the whole cycle has been completed once without surprises. Paper trading will not show real fills or real nerves, but it will show whether the plan is complete ([[broker-platform]]).

Before any order, Kai runs a pre-flight checklist. Tick the items as if you were Kai, and see what is still missing:

::demo[first-trade-checklist]

> [!THINK] Kai's thesis is “XYZ will not rise above 105 in a month”. Is a covered call the right structure for that thesis — and what if the thesis were “XYZ will jump 15% on earnings”?
> Decide before you open the answer.
> ---
> For the first thesis, yes: a covered call earns the most when the stock ends at or just below the strike, and Kai already owns the shares. For the second, no: the call would cap the very move Kai expects, handing everything above 105.71 to the buyer. A trader who expects a big jump would keep the shares uncovered or buy a call ([[long-options]]). **The structure has to agree with the thesis; the thesis is what you are paid for.**

We'll take the trade in seven steps:

- **① Thesis and structure**: one sentence, then strike and expiry
- **② Liquidity and size**: is the contract tradeable, and what is the whole position's risk?
- **③ The order**: the ticket, the limit price, working the order
- **④ Management rules and alerts**: written before the fill
- **⑤ Four endings**: what each path looks like in dollars
- **⑥ The journal and the review**
- **⑦ From paper to real money**

## @mechanics
### ① Thesis and structure

A good thesis is **one falsifiable sentence with a horizon**. Kai writes: *“Over the next month XYZ stays roughly between 95 and 105; I am happy to sell my shares at 105 or above.”* It names a range, a time and an outcome Kai accepts. It also says what would prove it wrong: a close below 95.

From [[strategy-matrix]]: a neutral-to-mildly-bullish view, no strong opinion that volatility is cheap, and shares already owned point to a covered call. Now the details. The expiry P&L per contract is

$$
\Pi(S_T) = 100 \times \big[\min(S_T, K) - S_0 + c\,\big]
$$

where \(S_T\) is XYZ at expiry, \(K\) the call's strike, \(S_0 = 100\) Kai's cost and \(c\) the premium per share. The \(\min\) is the cap: above \(K\) the shares are called away at \(K\). Kai compares strikes on the 30-day expiry (σ = 20%, r = 4%):

| Strike | Premium | Call Δ | Risk-neutral P(ends above K) | Max profit per contract | Premium / stock |
|---|---|---|---|---|---|
| 102.5 | 1.39 | 0.365 | 34.4% | $389 | 1.39% |
| **105** | **0.71** | **0.222** | **20.5%** | **$571** | **0.71%** |
| 107.5 | 0.33 | 0.120 | 10.9% | $783 | 0.33% |
| 110 | 0.14 | 0.058 | 5.1% | $1,014 | 0.14% |

> [!EXAMPLE] Why 105
> At 105 the formula gives a maximum of \(100 \times (105 - 100 + 0.71) = \$571\) and a breakeven of \(100 - 0.71 = 99.29\). The 102.5 call pays twice the premium but is called away about a third of the time (risk-neutral), and caps the gain at \(\$389\). The 110 call keeps nearly all the upside but pays only \(\$14\) — after a $0.65 commission and the spread, barely worth the effort. 105 is the strike at which Kai is **genuinely happy to sell**, and that is the real test of a covered-call strike.

Then the expiry. The 30-day expiry **spans the earnings report** in about three weeks. A 14-day 105 call would expire before earnings but pays only 0.22 ($22); a 45-day one pays 1.16. In a real chain the options that span earnings also carry extra implied volatility for the event ([[earnings-events]]); our flat 20% keeps the numbers simple. Kai chooses the 30-day call and writes down the consequence: *if earnings send XYZ to 115, I sell at 105 and accept missing the rest.* A structure you cannot live with in its worst-feeling scenario is the wrong structure.

### ② Liquidity and size

**Liquidity check** ([[liquidity-spreads]]). The 30-day 105 call is quoted **0.70 bid / 0.72 ask**, mid 0.71, with open interest of 12,400 contracts. The spread is \(0.02 / 0.71 = 2.8\%\) of the mid. Translated into volatility with the call's vega of 0.085 per vol point, the spread is only about \(0.02 / 0.085 \approx 0.23\) vol points wide: the bid implies 19.85%, the ask 20.08%. That is a liquid contract. On a thin stock the same call might be quoted 0.56 / 0.86 — selling at the bid would give up a fifth of the premium, and Kai's rule is to skip any contract whose spread is more than about a tenth of the mid for a trade this small.

**Size.** A covered call is sized by the shares: **one contract per 100 shares, never more.** A second call would be uncovered — unlimited risk above the strike and a different approval tier. The more important size question is about the whole position, which is still mostly stock. Its Greeks (per contract, stock plus short call):

$$
\Delta_{\text{pos}} = 100 \times (1 - \Delta_{\text{call}}) = 100 \times (1 - 0.222) = 77.8 \text{ shares}
$$

Here \(\Delta_{\text{call}}\) is the call's delta and 100 the shares held. Selling the call trims Kai's exposure from 100 shares to about 78. The other Greeks: theta **+$3.08 per day** (the call's decay now works for Kai), vega **−$8.54 per vol point** (Kai is short volatility), gamma **−5.19 shares per $1** (the position gets less long as XYZ rises — the cap arriving).

> [!EXAMPLE] The worst case is still the stock
> XYZ's one-standard-deviation 30-day move is about $5.73. A two-standard-deviation drop to about 88.5 costs the covered call \(100 \times (88.5 - 100 + 0.71) \approx -\$1{,}079\); a fall to 80 costs \(-\$1{,}929\), only $71 better than holding the shares alone. **The premium is a cushion, not a floor.** If a loss of that size would break Kai's risk budget ([[position-sizing]]), the answer is fewer shares or a protective put, not a different call.

### ③ The order

The ticket, field by field ([[orders]]):

| Field | Kai's choice | Why |
|---|---|---|
| Action | **Sell to open** | a new short position, covered by the shares |
| Contract | XYZ 30-day 105 call | the structure from ① |
| Quantity | 1 | one per 100 shares |
| Order type | **Limit 0.71** (the mid) | ask for fair value; a market order sells at 0.70 |
| Time in force | Day | re-think tomorrow rather than leave a stale order working |

If the order does not fill within a few minutes, Kai lowers the limit by one cent to 0.70 — never below the bid, and never with a market order. On a liquid contract a mid-price order often fills quickly. Filled at 0.71, Kai collects \(0.71 \times 100 = \$71\), minus an illustrative $0.65 commission and a few cents of fees: about **$70.35 net**. Kai checks the fill confirmation and the position screen: short 1 call, long 100 shares, the right expiry and strike. **Checking the position after every order is part of the order.**

### ④ Management rules and alerts

The rules are written before the fill and set as broker alerts. Each rule is a trigger and an action:

$$
c_{\text{exit}} \le (1 - p)\,c_{\text{entry}} \quad\Longrightarrow\quad \text{buy to close}
$$

where \(c_{\text{entry}} = 0.71\) is the premium received, \(p\) the fraction of it Kai wants to capture (a common practice is 50%, a choice rather than a law) and \(c_{\text{exit}}\) the call's current ask. With \(p = 50\%\) the threshold is \((1 - 0.5) \times 0.71 = 0.355\), so the take-profit is a buy-back limit at **0.35** — rounded down to the cent, so that at least half the premium is kept.

> [!EXAMPLE] When would the take-profit fire?
> If XYZ simply sits at 100, the call's value decays from 0.71 to about **0.34 after 12 days** — the take-profit fills, locking \(0.71 - 0.35 = 0.36\), or \(\$36\) before commissions, and freeing Kai to sell a new call. Waiting for the last \(\$35\) would mean carrying the earnings report for it. If XYZ drifts to 98 by day 10 the call is worth about 0.16 and the rule fires even earlier.

<figure>
<svg viewBox="0 0 680 290" role="img" aria-label="Management map: price zones for Kai's covered call and the action in each">
<rect x="70" y="20" width="170" height="50" class="fx-area-blue"/>
<rect x="70" y="70" width="170" height="50" class="fx-area-hl"/>
<rect x="70" y="120" width="170" height="110" class="fx-area-ok"/>
<rect x="70" y="230" width="170" height="45" class="fx-area-bad"/>
<line x1="70" y1="70" x2="240" y2="70" class="fx-line"/>
<line x1="70" y1="120" x2="240" y2="120" class="fx-line"/>
<line x1="70" y1="230" x2="240" y2="230" class="fx-line"/>
<text x="60" y="74" text-anchor="end" class="fx-t-b">105</text>
<text x="60" y="124" text-anchor="end" class="fx-t">103</text>
<text x="60" y="179" text-anchor="end" class="fx-t">100</text>
<text x="60" y="234" text-anchor="end" class="fx-t">95</text>
<text x="60" y="30" text-anchor="end" class="fx-t-sm">XYZ</text>
<line x1="70" y1="175" x2="240" y2="175" class="fx-line-hl fx-dash"/>
<circle cx="120" cy="175" r="6" class="fx-fill-orange"/>
<text x="132" y="170" class="fx-t-hl">today: 100</text>
<text x="155" y="50" text-anchor="middle" class="fx-t-b">above the strike</text>
<text x="155" y="100" text-anchor="middle" class="fx-t-b">roll zone</text>
<text x="155" y="148" text-anchor="middle" class="fx-t-b">let theta work</text>
<text x="155" y="258" text-anchor="middle" class="fx-t-b">thesis broken</text>
<text x="255" y="42" class="fx-t">Assignment likely: accept selling at 105 (+0.71 kept)</text>
<text x="255" y="60" class="fx-t-sm">or roll up and out for a credit — decided in advance</text>
<text x="255" y="92" class="fx-t">Last week or before earnings: roll or accept assignment</text>
<text x="255" y="110" class="fx-t-sm">e.g. XYZ 104, 1 day left: call 0.11; next month's 105 call 2.07</text>
<text x="255" y="150" class="fx-t">Take profit when the call's ask ≤ 0.35 (50% captured)</text>
<text x="255" y="168" class="fx-t-sm">if XYZ sits at 100, that happens around day 12</text>
<text x="255" y="250" class="fx-t">Close below 95: buy back the call for pennies,</text>
<text x="255" y="268" class="fx-t-sm">then decide about the shares — the call never protected them</text>
</svg>
<figcaption>Figure 2 · The management map, written before the trade. Each price zone has one pre-decided action, and each boundary is a broker alert. Kai will not be deciding under pressure — only recognizing which zone XYZ is in.</figcaption>
</figure>

The rest of Kai's rules:

- **Roll zone.** If XYZ is above 103 in the final week or on the day before earnings, Kai decides between accepting assignment and rolling. Rolling means one ticket: buy to close the current call and sell to open a later one. With XYZ at 104 and one day left, the expiring call costs about 0.11 and next month's 105 call brings about 2.07 — a **net credit of about 1.96**. Rolling to the 107.5 call (about 1.16) takes less credit but leaves more room. Rolling is a new trade and must pass the thesis test again; it is not a way to avoid admitting a view has changed.
- **Thesis broken.** A close below 95 means the range thesis is wrong. By then the call is nearly worthless (about 0.03 ten days in), so Kai buys it back for a few dollars, which frees the shares to be sold or protected ([[protective-put-collar]]).
- **Alerts.** Price alerts at 95, 103 and 105; a calendar alert the day before earnings; another two days before expiry, when Kai checks the broker's exercise cutoff ([[common-traps]]).
- **No new money.** Kai will not sell a second call, add shares or “average down” during this trade. Any of those would be a new trade with its own plan.

Try the rules against different paths. Move the day and XYZ's price and watch which rule fires:

::demo[first-trade-manage]

### ⑤ Four endings

Every path ends in one of four ways. The dollar outcomes (per contract, before commissions) follow directly from the formula in ①:

| Ending | What happens | Kai's P&L on the position |
|---|---|---|
| Take-profit on day 12, XYZ at 100 | buy back at 0.35 | \(+\$36\) on the call; shares unchanged |
| Expires out of the money, XYZ 103 | call expires worthless | \(100 \times (103 - 100 + 0.71) = +\$371\) |
| Assigned, XYZ 110 | shares sold at 105 | \(100 \times (105 - 100 + 0.71) = +\$571\); shares alone would have made $1,000 |
| Thesis broken, XYZ 94 on day 10 | buy back the call at about 0.02 | call \(+\$69\); shares \(-\$600\) marked, decision pending |

The third row is the one that tests discipline. Kai made the maximum profit and still “lost” $429 against simply holding. That is not a mistake — it is the price agreed in ①, when Kai wrote that selling at 105 was fine.

### ⑥ The journal and the review

The trade is finished when it is written up, not when it is closed. Kai's journal entry records what was decided and what happened, in the same fields every time:

| Field | Kai's entry |
|---|---|
| Date, underlying | day 0, XYZ at 100.00 |
| Thesis (one sentence) | XYZ stays 95–105 for a month; happy to sell at 105 |
| Structure and fill | sold 1 × 30-day 105 call at 0.71 (mid); IV 20.0%; call Δ 0.22 |
| Position risk at entry | Δ +78 shares, Θ +$3.08/day, vega −$8.54/vol pt |
| Plan | take profit at 0.35; roll zone above 103 in the last week or before earnings; out below 95 |
| Exit | date, price, which rule fired |
| P&L | dollars, and as a % of the $10,000 position |
| Process score | did I follow every rule? which one did I want to break? |
| Lesson | one sentence for next time |

The review separates two questions that beginners merge: **was the decision good, and was the outcome good?** A good decision can lose money (an earnings gap below 95) and a bad decision can make money (a naked second call that happened to expire). Only the process score is fully under Kai's control. Outcomes are judged over many trades, with the expectancy formula from [[trading-psychology]], not one at a time.

### ⑦ From paper to real money

Kai's own graduation rule: complete the whole cycle in paper at least once — open, alerts, one management decision, exit, journal — and check three things the paper account reveals: whether every alert actually fired, whether the position screen and statement show what Kai expected, and whether any rule was ambiguous in practice. Then trade the smallest real size, which for a covered call is exactly one contract.

> [!WARN] What paper trading hides
> Paper fills are usually instant and at the mid, so the first real order may fill a cent worse or not at all. Assignment is rarely simulated realistically. And a $571 cap feels different when the money is real. The first real trade is still a test of the process; keep it small and keep the journal.

Nothing in this lesson is a recommendation to trade XYZ or any real stock. It is a template: **thesis, structure, liquidity, size, order, rules, journal** — the same seven steps apply to a put spread, a straddle before earnings or a hedged crypto position, which is exactly how the [[capstone]] uses them.

## @analogy
A trade is like **a flight**. The pilot does not decide the route, the fuel and the alternate airport while taxiing; they are in the flight plan, filed on the ground (thesis, structure, size). The pre-flight checklist is read aloud even by pilots with thousands of hours (the liquidity and order checks), because the checklist catches what experience overlooks. In the air, the pilot flies the plan and responds to pre-defined triggers — fuel below a level means divert (the management rules and alerts). After landing, the logbook records the flight whether it went smoothly or not (the journal), and incidents are reviewed without asking only “did we land?” but “did we follow the procedure?” (decision quality versus outcome). New pilots train in a simulator first (paper trading), which teaches the procedures but not the stomach-drop of real turbulence.

Where it breaks: a pilot's destination does not move while they fly, but a market's “weather” changes the value of the destination itself. That is why the plan includes a thesis-broken rule — a pre-agreed decision to land somewhere else.

## @misconceptions
- **“Picking the right strike is the whole job.”** — The strike is one of seven decisions. Liquidity, size, the order, the rules and the review decide as much of the result, and most beginner losses come from those steps.
- **“I'll decide when to take profits once I see how it goes.”** — Decisions made during the trade are the ones biases shape. Writing \(c_{\text{exit}} \le (1 - p)\,c_{\text{entry}}\) and the other triggers in advance turns them into execution, not deliberation.
- **“If one covered call is good, two are better.”** — A second call against 100 shares is uncovered: unlimited risk above the strike and a different approval tier. Covered-call size is fixed by the shares.
- **“Rolling fixes a trade that is going wrong.”** — A roll is a new trade that must pass the thesis test on its own. Rolling to postpone a loss or avoid admitting a changed view just moves the problem to a later date.
- **“A profitable trade was a good trade.”** — Outcome and decision quality are different. Judge single trades by whether the process was followed, and judge results over many trades.

## @takeaways
- A trade is seven linked steps: thesis → structure → liquidity → size → order → management → journal; skipping one is the most common way to lose.
- The thesis is one falsifiable sentence with a horizon; the structure must agree with it, including its most uncomfortable scenario (for Kai: selling at 105 before a big earnings jump).
- Check liquidity in cents and vol points (0.70 / 0.72 is 2.8% of mid, about 0.23 vol points), size covered calls strictly by shares, and read the whole position's Greeks (Δ +78, Θ +$3.08/day, vega −$8.54).
- Write management rules as triggers and actions before the fill — take profit at \((1 - p)\,c\), a roll zone, a thesis-broken exit — and set them as alerts.
- Journal every trade with the same fields and review process separately from outcome; paper-trade the full cycle first, then trade the smallest real size.

## @quiz
1. Kai's thesis is that XYZ stays between 95 and 105 for a month, and Kai is happy to sell at 105. Which structure fits that thesis best, given that Kai owns 100 shares?
   - [ ] Buy a 30-day 105 call
   - [ ] Sell two 30-day 105 calls to double the income
   - [x] Sell one 30-day 105 call against the shares
   - [ ] Buy a 30-day 100 straddle
   > A covered call earns most when XYZ ends at or just below the strike and matches the stated willingness to sell at 105. A second call would be uncovered; buying a call or a straddle bets on movement, which contradicts a range thesis.
2. The 105 call is quoted 0.70 bid / 0.72 ask. Kai wants to sell one contract. What does Kai's order plan say?
   - [ ] Market order, to be sure of a fill
   - [x] Limit at 0.71 (the mid), day order; if unfilled after a few minutes, lower to 0.70 at most
   - [ ] Limit at 0.72, the ask, to get the best price
   - [ ] Stop order at 0.70
   > The mid asks for fair value; a market order would sell at the bid (0.70). A sell limit at the ask is unlikely to fill, and a stop order becomes a market order when triggered. Improving by one cent toward the bid is the controlled way to trade immediacy for price.
3. Kai received 0.71 and set a rule to capture 50% of the premium. At what ask price does Kai buy the call back?
   - [ ] 0.71
   - [ ] 0.50
   - [ ] 0.14
   - [x] About 0.35
   > \(c_{\text{exit}} \le (1 - p)\,c_{\text{entry}} = 0.5 \times 0.71 = 0.355\), rounded down to the cent: 0.35. If XYZ sits at 100, the call reaches about 0.34 after 12 days. 0.14 would be an 80% target.
4. After selling the call, what is the position's delta per contract (100 shares plus the short 105 call with Δ 0.222)?
   - [x] About +78 shares
   - [ ] About +22 shares
   - [ ] +100 shares — selling a call doesn't change delta
   - [ ] About −22 shares
   > \(\Delta_{\text{pos}} = 100 \times (1 - 0.222) = 77.8\). The shares contribute +100 and the short call −22. The position is still mostly long stock, which is why a fall to 80 still costs $1,929.
5. At expiry XYZ is at 110 and Kai's shares are called away at 105, a profit of $571. Holding the shares alone would have made $1,000. How should Kai's review score this trade?
   - [ ] A bad trade: it lost $429 against holding
   - [x] Judge the process: the cap was accepted in the thesis, so if every rule was followed the decision was sound regardless of the comparison
   - [ ] A lucky trade that should not be repeated
   - [ ] A good trade only because it made money
   > The review separates decision quality from outcome. Kai wrote in advance that selling at 105 was acceptable; the “missed” $429 is the price of the income agreed in step ①. Whether it was a good process depends on whether the plan was followed, and results are judged over many trades.

## @further
- [OCC: Options Disclosure Document](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the risks of writing options, including assignment, in the official disclosure.
- [OIC: Options exercise FAQ](https://www.optionseducation.org/referencelibrary/faq/options-exercise) — exercise by exception, deadlines and early assignment around dividends.
- [Cboe S&P 500 BuyWrite Index (BXM) methodology](https://cdn.cboe.com/api/global/us_indices/governance/BXM_Methodology.pdf) — a systematic covered call written down as rules: a model for writing your own.
- [Options Industry Council](https://www.optionseducation.org/) — free, exchange-funded education on strategies, order types and risks.
- [Strategy Path (sister course)](https://evidex-cloud.github.io/droplet-labs-strategy-path/) — game theory and behavioral economics: how people actually decide under uncertainty.

## @next
Kai's plan used a dozen numbers — prices, deltas, probabilities, a roll credit — all computed by an engine hidden behind the demos. Where do they come from, and how do you compute them yourself and prove your code is right? The next lesson writes the pricing engine in Python and tests it against the textbook.
