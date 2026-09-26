---
id: margin-approval
prereqs: four-positions, orders, exercise-assignment
demo: margin-approval
---

# Margin & Approval Levels: Who Can Sell Options and What It Ties Up

## @hook
Buying an option needs one thing: the premium. Selling one needs two more: your broker's permission, and collateral that can be anything from a few hundred dollars to the full value of the stock, recalculated every day the market moves. The same trade can tie up $500 or $9,500 depending on how it is built and which account it sits in.

## @bridge
[[four-positions]] showed that short options carry large or even unlimited losses, and [[exercise-assignment]] showed how assignment turns them into stock and cash obligations overnight. This lesson is about how brokers control that risk before it happens: **approval levels** decide what you may do, and **margin** decides how much of your account must stand behind it. It builds Idea ④ (risk): leverage and forced liquidation decide survival as much as being right. The same logic, run by software with no phone call, returns for crypto perps in [[margin-liquidation]].

## @intuition
Kai likes XYZ and would happily buy another 100 shares at $95. One way is to **sell the 30-day 95 put** for $0.51: if XYZ stays above 95, Kai keeps \(\$51\); if it falls below, Kai buys at 95. The same idea can be held in four different ways, and each ties up a very different amount (standard rules, for illustration; your broker may require more):

<figure>
<svg viewBox="0 0 680 270" role="img" aria-label="What four versions of the same short-put idea tie up">
<line x1="200" y1="30" x2="200" y2="225" class="fx-axis"/>
<rect x="200" y="36" width="440" height="30" rx="3" class="fx-fill-blue"/>
<text x="190" y="56" text-anchor="end" class="fx-t">cash-secured put</text>
<text x="630" y="56" text-anchor="end" class="fx-t-inv">$9,500 (strike × 100)</text>
<rect x="200" y="86" width="72" height="30" rx="3" class="fx-fill-orange"/>
<text x="190" y="106" text-anchor="end" class="fx-t">naked put (Reg T rule)</text>
<text x="280" y="106" class="fx-t-b">$1,551</text>
<rect x="200" y="136" width="43" height="30" rx="3" class="fx-fill-green"/>
<text x="190" y="156" text-anchor="end" class="fx-t">portfolio margin</text>
<text x="251" y="156" class="fx-t-b">≈ $924 (worst loss at −15%)</text>
<rect x="200" y="186" width="23" height="30" rx="3" class="fx-fill-muted"/>
<text x="190" y="206" text-anchor="end" class="fx-t">95/90 put spread</text>
<text x="231" y="206" class="fx-t-b">$500 (width × 100)</text>
<text x="200" y="248" class="fx-t-sm">Same idea: collect about $51 for agreeing to buy XYZ near $95. Maximum loss if XYZ went to zero:</text>
<text x="200" y="264" class="fx-t-sm">$9,449 for the first three, $455 for the spread. Margin is a deposit, not a cap on loss.</text>
</svg>
<figcaption>Figure 1 · What the broker sets aside for four versions of Kai's short 95 put (XYZ at $100, 30 days, standard rules; portfolio margin illustrated with σ = 20%). Only the spread actually limits the loss; the others simply demand different deposits against the same risk.</figcaption>
</figure>

> [!KAI] Kai's choice
> In a **cash account**, Kai can sell the put only as a *cash-secured* put: \(95 \times 100 = \$9{,}500\) is locked up until expiry or until Kai buys it back. In a **margin account** with naked-put approval, the standard rule asks for about \(\$1{,}551\). With a 95/90 **put spread** (sell the 95 put, buy the 90 put for \(0.06\)), Kai collects \(0.45\) and ties up \(\$500\), but can lose at most \((5 - 0.45) \times 100 = \$455\).

> [!THINK] The naked put ties up $1,551, the cash-secured put $9,500. Is the naked put six times less risky?
> ---
> No. Both are the same position with the same worst case: if XYZ went to zero, Kai would pay \(\$9{,}500\) for worthless shares, a loss of \(\$9{,}449\) after the premium. The naked put simply lets Kai *borrow* the rest of the risk from the broker. Lower margin means more leverage, not less risk; and when XYZ falls, the requirement rises, just when the position is losing.

We'll take it in six parts:

- **① Approval levels**: who may do what
- **② Cash and margin accounts**: what Reg T says about buying
- **③ The standard rule for naked short options**
- **④ Covered, cash-secured and spread positions**
- **⑤ Portfolio margin**: risk-based requirements
- **⑥ Margin calls, forced liquidation and the 2026 day-trading change**

## @mechanics
### ① Approval levels: who may do what

In the US, FINRA Rule 2360 requires a broker to perform due diligence on a customer and **approve the account for specific kinds of options activity** (buying, covered writing, spreads, uncovered writing) before allowing it, and to deliver the options disclosure document (*Characteristics and Risks of Standardized Options*) first. The numbered “levels” you see are each broker's own scheme, not a FINRA standard; a common four-step version looks like this:

| Typical level | Adds | Worst case for the account |
|---|---|---|
| 1 | covered calls, protective puts | limited by the shares you own |
| 2 | buying calls and puts; cash-secured puts | the premium paid, or the strike cash set aside |
| 3 | spreads (verticals, condors, butterflies) | the defined maximum loss of each spread |
| 4 (sometimes 5) | uncovered (naked) calls and puts | large for puts, unlimited for calls |

Approval depends on what you tell the broker (experience, income, net worth, objectives) and the broker's own policy. The ladder exists because the four positions from [[four-positions]] have wildly different worst cases, and the broker, as the one who must deliver on your behalf if you cannot, carries part of that risk.

::demo[margin-approval-levels]

### ② Cash and margin accounts

A **cash account** can only use money you have: you can buy options (paid in full), sell covered calls (the shares are the collateral) and sell cash-secured puts (the cash is the collateral). A **margin account** lets the broker lend against your assets, which is what allows spreads and uncovered writing.

The Federal Reserve's **Regulation T** sets the initial margin for buying stock at 50% (you can borrow up to half), and long options generally must be **paid in full**: an option already has leverage built in, so you cannot borrow to buy it. A margin account's **buying power** is the amount it can commit to new positions given its equity and the requirements of what it already holds.

### ③ The standard rule for naked short options

For an uncovered short equity option, the standard requirement under FINRA Rule 4210 and the exchanges' rules (your broker may require more) is:

$$
\text{requirement} = 100 \times \Big[\, V + \max\big(0.20\,S - \text{OTM},\ \ 0.10\,B\big) \Big]
$$

where

- \(V\) is the option's current price (the premium you received counts toward the deposit),
- \(S\) is the stock price, so \(0.20\,S\) is 20% of the underlying's value per share,
- OTM is how far the option is out of the money (for a put \(\max(S - K, 0)\), for a call \(\max(K - S, 0)\)),
- \(B\) is the base of the minimum: the strike \(K\) for a put, the stock price \(S\) for a call,
- the factor 100 turns per-share numbers into one contract. For broad-based index options, 15% replaces 20%.

> [!EXAMPLE] Kai's naked 95 put and a naked 105 call
> 95 put, \(S = 100\), \(V = 0.51\), OTM \(= 5\):
> $$
> 100 \times \big[\,0.51 + \max(0.20 \times 100 - 5,\ 0.10 \times 95)\big] = 100 \times (0.51 + 15) = \$1{,}551
> $$
> 105 call, \(V = 0.71\), OTM \(= 5\): \(100 \times [0.71 + \max(20 - 5,\ 0.10 \times 100)] = 100 \times 15.71 = \$1{,}571\).
> Both are about 15% of the \(\$10{,}000\) of stock each contract controls.

Where do the numbers come from? The 20% is a rough stand-in for a large but plausible move in a single stock over the days it might take to close a position; the out-of-the-money deduction gives credit for the cushion before the option starts losing; and the 10% floor stops a far out-of-the-money option from needing almost nothing. Because \(V\) sits inside the bracket, anything that raises the option's price raises the requirement too. If XYZ's implied volatility jumped from 20% to 30% with the stock unchanged, the 95 put would rise from 0.51 to about 1.33, and the requirement from \(\$1{,}551\) to about \(\$1{,}633\), with no move in the stock at all.

The rule is a formula, so it moves with the market. It is recalculated as the stock and the option price change, and it grows fastest exactly when a short option moves against you (Figure 2 below).

### ④ Covered, cash-secured and spread positions

When something else in the account already covers the worst case, the requirement shrinks to that worst case:

- **Covered call**: the 100 shares you own cover delivery; no extra margin (Kai's standard trade).
- **Cash-secured put**: the strike cash, \(K \times 100\), is set aside (many brokers let the premium count toward it); the strategy itself is the subject of [[cash-secured-put]].
- **Debit spreads** (you pay to open): paid in full, like any long option; nothing more can be lost.
- **Credit spreads** (you collect to open): the requirement is the width of the strikes, since that is the most the spread can lose before the premium.

$$
\text{spread requirement} = (K_2 - K_1) \times 100, \qquad \text{maximum loss} = (K_2 - K_1 - \text{credit}) \times 100
$$

where \(K_1 < K_2\) are the two strikes and the credit is the net premium received.

> [!EXAMPLE] Kai's 95/90 put spread
> Sell the 95 put at 0.51, buy the 90 put at 0.06: credit \(0.45\). Requirement \((95 - 90) \times 100 = \$500\); the \(\$45\) credit can be applied toward it, so about \(\$455\) of Kai's own money is at risk, and that is also the maximum loss, whatever happens to XYZ. Spreads are developed fully in [[vertical-spreads]].

### ⑤ Portfolio margin: risk-based requirements

**Portfolio margin**, allowed under FINRA Rule 4210(g) for eligible accounts, replaces the formulas with a stress test: every position is revalued at a grid of price moves in the underlying (for individual stocks, from about −15% to +15%; for broad-based indexes a narrower, lopsided range of about −8% to +6%), and the requirement is roughly the largest loss across the grid, subject to minimums. Hedges now count: a short put next to a long put, or a stock next to a protective put, lowers the worst case, and the requirement falls with it.

> [!EXAMPLE] Kai's naked 95 put under a ±15% grid (illustrative, σ = 20%)
> At \(-15\%\), XYZ is $85 and the 30-day 95 put is worth about \(9.75\). The loss is \((9.75 - 0.51) \times 100 \approx \$924\), the worst point on the grid, against \(\$1{,}551\) under the standard rule. Real portfolio-margin systems use the clearing house's own pricing and volatility assumptions, so actual numbers differ.

The stress test also rewards structure. Kai's 95/90 put spread run through the same grid loses at most about \(\$413\) at the −15% point (a little less than its \(\$455\) maximum at expiry, because the long 90 put still has time value there), so portfolio margin and the standard spread rule land close together. The big differences appear for naked positions and for books where hedges offset each other in ways the fixed formulas cannot see.

Because it can mean much more leverage, portfolio margin is restricted. Brokers set their own minimum equity within the rule; as of September 2026, Schwab, for example, requires $125,000 of initial equity plus approval for uncovered options, and a common broker range is about $100,000–125,000 or more. The portfolio view of risk, stress grids and correlation is the subject of [[portfolio-risk]].

### ⑥ Margin calls, forced liquidation and the 2026 day-trading change

A requirement is only half of the picture; the other half is your **account equity** (cash plus the value of positions, minus what you owe). If equity falls below the total requirement, the broker issues a **margin call**: deposit money or reduce positions. Margin agreements generally allow the broker to close positions **without waiting for you**, at market prices, if the call is not met quickly or the market moves fast.

<figure>
<svg viewBox="0 0 700 280" role="img" aria-label="The naked put's requirement rises as the stock falls">
<defs><marker id="margin-approval-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="50" y1="230" x2="680" y2="230" class="fx-axis" marker-end="url(#margin-approval-ah)"/>
<line x1="50" y1="240" x2="50" y2="15" class="fx-axis" marker-end="url(#margin-approval-ah)"/>
<line x1="50" y1="163.3" x2="670" y2="163.3" class="fx-grid"/>
<line x1="50" y1="96.7" x2="670" y2="96.7" class="fx-grid"/>
<line x1="50" y1="30" x2="670" y2="30" class="fx-grid"/>
<text x="44" y="234" text-anchor="end" class="fx-t-sm">$0</text>
<text x="44" y="167" text-anchor="end" class="fx-t-sm">$1,000</text>
<text x="44" y="100" text-anchor="end" class="fx-t-sm">$2,000</text>
<text x="44" y="34" text-anchor="end" class="fx-t-sm">$3,000</text>
<polyline points="60,25.3 100,36.0 140,46.5 180,56.7 220,66.5 260,75.2 300,82.5 340,88.1 380,98.3 420,113.3 460,126.8 500,139.0 540,150.6 580,161.7 620,166.5 660,166.6" class="fx-line-hl"/>
<polyline points="60,132.0 100,145.3 140,158.5 180,171.4 220,183.8 260,195.2 300,205.2 340,213.4 380,219.6 420,224.0 460,226.8 500,228.4 540,229.3 580,229.7 620,229.9 660,230.0" class="fx-line-bad"/>
<line x1="360" y1="20" x2="360" y2="230" class="fx-line-muted fx-dash"/>
<text x="364" y="30" class="fx-t-sm">strike 95</text>
<circle cx="460" cy="126.8" r="5" class="fx-fill-orange"/>
<text x="470" y="120" class="fx-t-hl">today: $1,551</text>
<circle cx="260" cy="75.2" r="5" class="fx-fill-red"/>
<text x="252" y="97" text-anchor="end" class="fx-t-bad">XYZ at 90: $2,322</text>
<text x="622" y="187" text-anchor="end" class="fx-t-sm">floor: 10% of strike + premium</text>
<text x="120" y="120" class="fx-t-bad">put value × 100</text>
<text x="600" y="100" class="fx-t-hl">requirement</text>
<text x="60" y="250" text-anchor="middle" class="fx-t-sm">80</text>
<text x="260" y="250" text-anchor="middle" class="fx-t-sm">90</text>
<text x="460" y="250" text-anchor="middle" class="fx-t-sm">100</text>
<text x="660" y="250" text-anchor="middle" class="fx-t-sm">110</text>
<text x="670" y="272" text-anchor="end" class="fx-t-sm">XYZ price (naked 95 put, 29 days left, σ 20%, standard rule)</text>
</svg>
<figcaption>Figure 2 · The standard requirement for one naked 95 put (blue) and the put's value (red) as XYZ moves. Above the strike the requirement drifts down toward its floor; below it, both the loss and the deposit climb together, so a falling stock drains equity and raises the bar at the same time.</figcaption>
</figure>

> [!EXAMPLE] XYZ drops to $90 the next day
> The put is now worth about 5.22 (29 days left). Kai's position has lost \((5.22 - 0.51) \times 100 = \$471\), and the requirement has risen to \(100 \times [5.22 + \max(0.20 \times 90 - 0,\ 9.5)] = 100 \times (5.22 + 18) = \$2{,}322\). An account that had just \(\$1{,}600\) of equity behind this position would now face a margin call; if volatility also jumped, the put and the requirement would be higher still.

> [!FACT] The pattern-day-trader rule changed in 2026
> For years, US margin accounts that made four or more day trades in five business days were labelled “pattern day traders” and needed at least $25,000 of equity. The SEC approved FINRA's amendments to Rule 4210 on April 14, 2026, and FINRA Regulatory Notice 26-10 (April 20, 2026) replaced the PDT designation and its $25,000 minimum with **intraday margin standards**, effective **June 4, 2026**. Firms have until **October 20, 2027** to implement, so as of September 2026 some brokers may still apply the old rule. Check your broker's current policy.

Price is not the only thing that moves a requirement. Brokers may add their own **house requirements** above the standard rules, for example on very volatile or concentrated positions, before earnings, or across the whole account in turbulent markets, and can change them at short notice. A short-option account that is comfortably funded on a calm day can be under-margined a week later without a single new trade.

Crypto derivatives venues handle the same problem without phone calls: when equity falls below maintenance margin, positions are **liquidated automatically**, often in seconds. That machinery (maintenance margin, liquidation prices, insurance funds) is covered in [[margin-liquidation]].

## @analogy
Margin is like the **deposit a car-rental company holds on your card**. Renting a small car (buying an option) needs only the rental fee: the worst that can happen is that you lose what you paid. Taking a car across a border or onto rough roads (selling options) is different; the company wants permission levels (does your licence cover it? have you rented before?) and a deposit sized to what could go wrong.

If you rent the car together with full insurance that caps your damage (a spread), the deposit is small and fixed. If you already own a spare car the company can take (covered call), no deposit is needed. If you drive uninsured (a naked short option), the deposit is set by a formula, and the company can raise it whenever conditions worsen, and repossess the car on the spot if you cannot pay.

Where the analogy breaks: the deposit is not the most you can lose. A rental deposit usually covers the worst damage; a margin requirement is only a buffer, and in a large, fast move the loss can exceed it and the broker can close you out at the worst moment.

## @misconceptions
- **“The margin requirement is the most I can lose.”** — It is a deposit, not a cap. Kai's naked 95 put requires about $1,551 but can lose up to $9,449; only defined-risk structures such as spreads cap the loss.
- **“Lower margin means a safer trade.”** — Lower margin means more leverage. A naked put and a cash-secured put carry identical risk; the naked version simply lets you hold more of it per dollar.
- **“My margin is fixed when I open the trade.”** — The standard rule is recalculated as prices move and rises exactly when a short option goes against you.
- **“Approval levels are the same at every broker.”** — FINRA requires approval for each kind of activity, but the level numbers and exact contents are each firm's own.
- **“You need $25,000 to day trade options in a margin account.”** — That was the pattern-day-trader rule. It was replaced by intraday margin standards effective June 4, 2026, though firms may take until October 20, 2027 to switch.

## @takeaways
- Brokers must approve accounts for each kind of options activity (FINRA Rule 2360); level numbers are broker-specific, and uncovered writing sits at the top.
- Long options are paid in full; the standard naked requirement is \(100 \times [V + \max(0.20\,S - \text{OTM},\ 0.10\,B)]\), and your broker may require more.
- Covered calls need no extra margin, cash-secured puts need \(K \times 100\), credit spreads need the strike width; only defined-risk structures cap the loss.
- Portfolio margin sets the requirement by stress-testing the whole account (±15% for single stocks) and needs large minimum equity; margin calls and forced liquidation hit fastest when positions move against you.

## @quiz
1. Kai sells one naked XYZ 95 put for 0.51 with XYZ at $100. Under the standard rule, about how much must the account hold?
   - [ ] $51, the premium
   - [ ] $9,500, the strike × 100
   - [x] About $1,551
   - [ ] About $950
   > \(100 \times [0.51 + \max(0.20 \times 100 - 5,\ 0.10 \times 95)] = 100 \times 15.51 = \$1{,}551\). $9,500 is the cash-secured version; $950 is the 10% floor before adding the premium.
2. Kai compares a naked 95 put (requirement $1,551) with a cash-secured 95 put ($9,500). Which statement is right?
   - [ ] The naked put is less risky because it ties up less money
   - [ ] The cash-secured put can lose more because more money is involved
   - [x] Both have the same maximum loss (about $9,449 if XYZ went to zero); the naked put just uses more leverage
   - [ ] The naked put cannot be assigned
   > The position is identical; only the deposit differs. A lower requirement lets you hold more of the same risk per dollar, and the requirement rises if XYZ falls.
3. Kai sells a 95/90 put spread for a 0.45 credit. What is the requirement and the maximum loss?
   - [x] Requirement $500 (the width); maximum loss $455
   - [ ] Requirement $1,551; maximum loss unlimited
   - [ ] Requirement $45; maximum loss $45
   - [ ] Requirement $9,500; maximum loss $9,500
   > A credit spread's requirement is \((K_2 - K_1) \times 100 = \$500\); after the \(\$45\) credit, the most Kai can lose is \(\$455\), whatever XYZ does.
4. XYZ falls from $100 to $90 the day after Kai sells the naked 95 put. What happens to the standard requirement?
   - [ ] It stays at $1,551; it was fixed when the trade opened
   - [ ] It falls, because the premium has already been received
   - [ ] It becomes zero because the put is now in the money
   - [x] It rises to about $2,322, while the position shows a loss of about $471
   > The put is now worth about 5.22: \(100 \times [5.22 + \max(0.20 \times 90,\ 9.5)] \approx \$2{,}322\). Loss and requirement grow together, which is how margin calls happen.
5. Which statement about the US pattern-day-trader rule is accurate as of September 2026?
   - [ ] It still requires $25,000 at every broker, permanently
   - [x] FINRA replaced the PDT designation and $25,000 minimum with intraday margin standards effective June 4, 2026, but firms may take until October 20, 2027 to implement
   - [ ] It was abolished for stocks but still applies to options
   - [ ] It applies only to cash accounts
   > Regulatory Notice 26-10 (after SEC approval on April 14, 2026) made the change effective June 4, 2026, with an implementation window to October 20, 2027, so some brokers may still use the old rule for a while.

## @further
- [FINRA Rule 2360: Options](https://www.finra.org/rules-guidance/rulebooks/finra-rules/2360) — the rule behind account approval and options disclosure.
- [FINRA Regulatory Notice 26-10](https://www.finra.org/rules-guidance/notices/26-10) — the 2026 replacement of the pattern-day-trader rule with intraday margin standards.
- [FINRA: Margin accounts](https://www.finra.org/rules-guidance/key-topics/margin-accounts) — how margin, Regulation T and margin calls work, in plain language.
- [Schwab: Portfolio margin](https://www.schwab.com/margin/portfolio-margin) — one broker's published eligibility and approach to risk-based margin.

## @next
Kai now knows how a contract is quoted, traded, exercised and financed. One question remains before we ask why options cost what they cost: which contract? Stock, ETF, index, 0DTE or crypto options differ in exercise, settlement, size, hours and even tax treatment. The last lesson of this stage maps them.
