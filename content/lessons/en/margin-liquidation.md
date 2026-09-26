---
id: margin-liquidation
prereqs: margin-approval, what-is-perp, mark-index-last, funding-rate
demo: margin-liquidation
---

# Margin & Liquidation: Isolated, Cross & Maintenance

## @hook
A 10× long perp on bitcoin does not wait for you to be wrong at the end. It only has to be wrong **once, for a moment, by 9.5%**. This lesson shows where that number comes from, why leverage shrinks it so fast, and how one liquidation can trigger the next.

## @bridge
[[what-is-perp]] showed that a perpetual future is a straight-line bet with no expiry, [[mark-index-last]] showed which price the exchange uses to judge your position, and [[funding-rate]] showed the rent you pay (or receive) while you hold it. What is still missing is the rule that decides **when the exchange takes the position away from you**. That rule is margin, and it is where Idea ④ (risk: *when leverage bites decides survival*) becomes concrete. In options we met margin only on the selling side ([[margin-approval]]); here every buyer and every seller posts it.

## @intuition
Start with one position, all numbers for illustration.

Bitcoin trades at an illustrative **$100,000**. You open a **long perp for 1 BTC**: a bet that gains $1 for every $1 bitcoin rises, and loses $1 for every $1 it falls. The exchange does not ask for $100,000. At **10× leverage** it asks for one tenth: **$10,000** of collateral, called **initial margin**.

That $10,000 is a cushion. Every dollar bitcoin falls comes out of it:

- BTC at $97,000 → you are down $3,000 → $7,000 of cushion left;
- BTC at $94,000 → $4,000 left;
- BTC at $91,000 → $1,000 left.

If the cushion reached zero, the exchange would be holding a losing position with none of your money behind it. It will not let that happen. It sets a small floor, the **maintenance margin**, and closes your position by force the moment your cushion falls to that floor. With a maintenance rate of **0.5%** of the position's value, the floor is \(0.005 \times \$100{,}000 = \$500\). The cushion hits $500 when bitcoin reaches **$90,500**. That price is your **liquidation price**.

> [!KAI] Kai's position is this one, scaled down
> Kai's 10× long from [[what-is-perp]] is one tenth of this example: 0.1 BTC on $1,000 of margin, with the same $90,500 liquidation price. Kai's instinct from options is “the most I can lose is what I put in.” For an isolated perp that is roughly true, but *when* you lose it is completely different. A call buyer loses the premium only if the option ends worthless on expiry day. The 10× perp loses its whole margin the first time bitcoin **touches** $90,500, even for a minute, even if it is back at $110,000 by the evening.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="A bitcoin path touching the liquidation line">
<defs><marker id="margin-liquidation-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="60" y="161.75" width="540" height="38" class="fx-area-bad"/>
<line x1="60" y1="200" x2="610" y2="200" class="fx-axis" marker-end="url(#margin-liquidation-ah)"/>
<line x1="60" y1="81" x2="600" y2="81" class="fx-line-muted fx-dash"/>
<line x1="60" y1="161.75" x2="600" y2="161.75" class="fx-line-bad"/>
<line x1="60" y1="166" x2="600" y2="166" class="fx-line-muted fx-dash"/>
<polyline points="60,81 90,70.8 120,82.7 150,73.35 180,92.05 210,101.4 240,94.6 270,116.7 300,136.25 320,145.6 340,161.75" class="fx-line-thick"/>
<polyline points="340,161.75 360,142.2 390,119.25 420,126.05 450,96.3 480,75.9 510,82.7 540,58.05 570,47.85 600,42.75" class="fx-line-muted fx-dash"/>
<circle cx="340" cy="161.75" r="6" class="fx-fill-red"/>
<text x="334" y="196" text-anchor="end" class="fx-t-bad">liquidated here: the position is gone</text>
<text x="560" y="28" text-anchor="end" class="fx-t-sm">the recovery you no longer own</text>
<text x="56" y="85" text-anchor="end" class="fx-t-sm">100,000</text>
<text x="56" y="159" text-anchor="end" class="fx-t-bad">90,500</text>
<text x="56" y="176" text-anchor="end" class="fx-t-sm">90,000</text>
<text x="66" y="98" class="fx-t-sm">entry</text>
<text x="600" y="155" text-anchor="end" class="fx-t-bad">liquidation price</text>
<text x="600" y="183" text-anchor="end" class="fx-t-bad">(equity = maintenance margin)</text>
<text x="600" y="214" text-anchor="end" class="fx-t-sm">time →</text>
<text x="70" y="230" class="fx-t-sm">10× long, 1 BTC, margin $10,000, maintenance 0.5% · illustrative</text>
</svg>
<figcaption>Figure 1 · Liquidation is a barrier, not an expiry test. The path touches $90,500 once, the position is closed on the spot, and the later rally (dashed) belongs to someone else. The thin dashed line at $90,000 is where the margin would be completely gone — the “bankruptcy price” of [[insurance-adl]].</figcaption>
</figure>

Two design choices change how much of your account is exposed. In **isolated margin**, the position has its own ring-fenced pot: only the $10,000 you assigned can be lost. In **cross margin**, the whole account backs every position: you are harder to liquidate, but when it happens the loss can be most of the account.

The deeper point is about shape. A perp is **linear**: its P&L is a straight line in the price ([[linear-vs-convex]]). Leverage does not bend that line; it only makes it steeper and moves a trapdoor closer. An option's loss is capped by its shape; a perp's loss is capped by a **forced exit**, and the exit happens on the path, not at the end.

::demo[margin-liquidation-cascade]

We'll take it in five parts:

- **① The margin account: equity, initial and maintenance margin**
- **② The liquidation price and why leverage shrinks the distance**
- **③ Isolated vs cross margin**
- **④ Tiers, partial liquidation, fees and funding**
- **⑤ Cascades: October 2025**

## @mechanics
### ① The margin account: equity, initial and maintenance margin

An exchange tracks one number for your position: **equity**, the collateral you posted plus the unrealized P&L at the **mark price** (not the last trade; see [[mark-index-last]]). For a linear (USDT- or USD-margined) long of \(Q\) coins opened at \(P_0\) with margin \(M\):

$$
E(P) = M + Q\,(P - P_0), \qquad M = \frac{Q\,P_0}{L}
$$

where \(E\) is equity, \(P\) the current mark price, \(Q\) the position size in coins, \(P_0\) the entry price and \(L\) the leverage. **Initial margin** \(M\) is what you must post to *open*; its rate is \(1/L\) of the position's value (**notional**). **Maintenance margin** is the smaller amount you must keep to *stay open*: a rate \(m\) times the notional. For a short, flip the sign of the P&L term: \(E(P) = M - Q\,(P - P_0)\).

> [!EXAMPLE] The 10× long, dollar by dollar
> \(Q = 1\), \(P_0 = \$100{,}000\), \(L = 10\), \(m = 0.5\%\) (illustrative):
> - initial margin \(M = 100{,}000 / 10 = \$10{,}000\);
> - maintenance margin \(= 0.005 \times 100{,}000 = \$500\);
> - at a mark of $95,000: \(E = 10{,}000 + (95{,}000 - 100{,}000) = \$5{,}000\): still open;
> - at a mark of $90,500: \(E = 10{,}000 - 9{,}500 = \$500\), equal to the maintenance margin: **liquidation starts**.

The gap between initial and maintenance margin is the room you have to be wrong. At 10× it is \(\$10{,}000 - \$500 = \$9{,}500\), or 9.5% of the notional.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Equity cushion shrinking as the price falls">
<text x="20" y="24" class="fx-t-b">equity left in a 10× long (1 BTC, margin $10,000)</text>
<text x="150" y="52" text-anchor="end" class="fx-t">BTC 100,000</text>
<rect x="160" y="40" width="400" height="18" rx="3" class="fx-fill-green"/>
<text x="566" y="54" class="fx-t-sm">$10,000</text>
<text x="150" y="82" text-anchor="end" class="fx-t">97,000</text>
<rect x="160" y="70" width="280" height="18" rx="3" class="fx-fill-green"/>
<text x="446" y="84" class="fx-t-sm">$7,000</text>
<text x="150" y="112" text-anchor="end" class="fx-t">94,000</text>
<rect x="160" y="100" width="160" height="18" rx="3" class="fx-fill-btc"/>
<text x="326" y="114" class="fx-t-sm">$4,000</text>
<text x="150" y="142" text-anchor="end" class="fx-t">91,000</text>
<rect x="160" y="130" width="40" height="18" rx="3" class="fx-fill-btc"/>
<text x="206" y="144" class="fx-t-sm">$1,000</text>
<text x="150" y="172" text-anchor="end" class="fx-t-bad">90,500</text>
<rect x="160" y="160" width="20" height="18" rx="3" class="fx-fill-red"/>
<text x="186" y="174" class="fx-t-bad">$500 = maintenance → liquidate</text>
<text x="150" y="202" text-anchor="end" class="fx-t-sm">90,000</text>
<text x="190" y="202" class="fx-t-sm">$0 = bankruptcy (never allowed to get here, in theory)</text>
<line x1="180" y1="34" x2="180" y2="214" class="fx-line-bad fx-dash"/>
<text x="20" y="238" class="fx-t-sm">each $1,000 fall in BTC removes $1,000 of equity: the cushion is linear, and it is only 9.5% deep at 10×</text>
</svg>
<figcaption>Figure 2 · The margin account as a fuel gauge. Equity falls one-for-one with the price; the red dashed line is the maintenance floor. The exchange closes the position at the floor, leaving a $500 buffer to absorb a messy exit before the account would go negative.</figcaption>
</figure>

### ② The liquidation price and why leverage shrinks the distance

Set equity equal to the maintenance margin and solve for the price. For a long, \(M + Q(P - P_0) = m\,Q\,P_0\) with \(M = QP_0/L\) gives:

$$
P_{\text{liq}}^{\text{long}} \approx P_0\left(1 - \frac{1}{L} + m\right), \qquad P_{\text{liq}}^{\text{short}} \approx P_0\left(1 + \frac{1}{L} - m\right)
$$

where \(P_0\) is the entry price, \(L\) the leverage and \(m\) the maintenance rate. This is the **simplified, isolated, linear** version: no fees, no funding, no extra margin added, maintenance charged on the entry notional. Plug in \(P_0 = 100{,}000\), \(L = 10\), \(m = 0.005\): \(100{,}000 \times (1 - 0.1 + 0.005) = \$90{,}500\) for the long, and \(100{,}000 \times (1 + 0.1 - 0.005) = \$109{,}500\) for the short.

The distance to liquidation, as a fraction of the entry price, is therefore simply

$$
\frac{|P_0 - P_{\text{liq}}|}{P_0} = \frac{1}{L} - m
$$

**Double the leverage and you roughly halve the room.** The table makes it concrete. The last column is the chance that a random walk with bitcoin's illustrative 50% volatility and no drift *touches* the liquidation price at least once in 30 days (computed with the engine's `probTouch`); one day's typical move at 50% vol is \(0.5/\sqrt{365} \approx 2.6\%\), about $2,620.

| Leverage | Long liquidation price | Room | Room in daily moves (σ) | P(touch within 30 days) |
|---|---|---|---|---|
| 3× | $67,167 | 32.8% | 12.5 | 0.7% |
| 5× | $80,500 | 19.5% | 7.5 | 14% |
| 10× | $90,500 | 9.5% | 3.6 | 51% |
| 20× | $95,500 | 4.5% | 1.7 | 77% |
| 50× | $98,500 | 1.5% | 0.6 | 92% |

Read the 10× row twice. A move of 3.6 daily standard deviations sounds rare on any given day, but over a month the path has thirty days to find it: **about a coin flip**. At 50× the room is smaller than one ordinary day; the odds of touching it *within 24 hours* are about 57%.

> [!THINK] Why is “touch within 30 days” so much likelier than “below $90,500 on day 30”?
> Predict before opening: the second one is a single snapshot, the first is the whole path.
> ---
> For a driftless random walk, the reflection principle says the chance of touching a barrier during the period is roughly **twice** the chance of ending beyond it. Any path that ends below $90,500 touched it, and so did about as many paths that dipped below and came back. An option holder is judged only on the snapshot; a leveraged perp is judged on the path. That is the heart of [[perps-vs-options]].

The same room can be expressed in volatility units, which is how risk managers think:

$$
z = \frac{1/L - m}{\sigma\sqrt{\Delta t}}
$$

where \(\sigma\) is annualized volatility and \(\Delta t\) the horizon in years. For 10× over one day: \(z = 0.095 / (0.5/\sqrt{365}) = 0.095/0.0262 \approx 3.6\). Over 30 days \(\sigma\sqrt{\Delta t} = 0.5\sqrt{30/365} \approx 0.143\), so \(z \approx 0.66\) — less than one standard deviation of a month's move.

> [!DEEP] Venues differ in the details
> Real engines charge maintenance on the *current* mark notional, not the entry notional. Then \(M + Q(P - P_0) = m\,Q\,P\) gives \(P_{\text{liq}} = P_0(1 - 1/L)/(1 - m)\). For our example that is \(90{,}000 / 0.995 \approx \$90{,}452\), about $50 lower than the simple formula. Fees reserved for closing, funding already paid and any margin you add also move the line. Always read the liquidation price the venue displays; use the formula to understand it, not to replace it.

### ③ Isolated vs cross margin

Suppose your account holds **$30,000** and you open the same 10× long.

- **Isolated:** you assign $10,000 to the position. The other $20,000 is walled off. Liquidation at **$90,500**; worst case you lose about **$10,000**.
- **Cross:** the whole $30,000 backs the position. Equity is \(30{,}000 + (P - 100{,}000)\); it hits the $500 floor at \(P = \$70{,}500\). You survive a 29.5% fall instead of 9.5% — but if bitcoin does reach $70,500, you lose about **$29,500**.

For a general cross account with total equity \(B\) behind a single long,

$$
P_{\text{liq}}^{\text{cross}} = P_0 - \frac{B - m\,Q\,P_0}{Q}
$$

where \(B\) is the account's collateral and \(Q\) the position in coins: \(100{,}000 - (30{,}000 - 500)/1 = \$70{,}500\).

<figure>
<svg viewBox="0 0 640 230" role="img" aria-label="Isolated margin versus cross margin">
<text x="160" y="24" text-anchor="middle" class="fx-t-b">isolated</text>
<text x="480" y="24" text-anchor="middle" class="fx-t-b">cross</text>
<rect x="40" y="40" width="240" height="120" rx="8" class="fx-box"/>
<rect x="52" y="52" width="90" height="96" rx="6" class="fx-bad"/>
<text x="97" y="92" text-anchor="middle" class="fx-t">position</text>
<text x="97" y="110" text-anchor="middle" class="fx-t-b">$10,000</text>
<rect x="152" y="52" width="116" height="96" rx="6" class="fx-ok"/>
<text x="210" y="92" text-anchor="middle" class="fx-t">walled off</text>
<text x="210" y="110" text-anchor="middle" class="fx-t-b">$20,000</text>
<rect x="360" y="40" width="240" height="120" rx="8" class="fx-box"/>
<rect x="372" y="52" width="216" height="96" rx="6" class="fx-bad"/>
<text x="480" y="92" text-anchor="middle" class="fx-t">the whole account backs it</text>
<text x="480" y="110" text-anchor="middle" class="fx-t-b">$30,000</text>
<line x1="320" y1="36" x2="320" y2="200" class="fx-line-muted fx-dash"/>
<text x="160" y="182" text-anchor="middle" class="fx-t">liquidated at $90,500</text>
<text x="160" y="202" text-anchor="middle" class="fx-t-bad">max loss ≈ $10,000</text>
<text x="480" y="182" text-anchor="middle" class="fx-t">liquidated at $70,500</text>
<text x="480" y="202" text-anchor="middle" class="fx-t-bad">max loss ≈ $29,500</text>
<text x="320" y="224" text-anchor="middle" class="fx-t-sm">same 10× long of 1 BTC at $100,000 · account $30,000 · maintenance 0.5% · illustrative</text>
</svg>
<figcaption>Figure 3 · Isolated margin fences off a fixed loss; cross margin buys a wider cushion by putting everything behind it. Neither is “safer” in general: cross is safer for a hedged book, isolated for a single speculative bet.</figcaption>
</figure>

Cross margin earns its place when positions offset each other. A trader who is long bitcoin spot collateral and short a bitcoin perp, or long one perp and short a correlated one, wants gains on one leg to feed margin to the other. Isolated margin would liquidate the losing leg while the winning leg sits idle — and leave the trader unhedged. The danger of cross is contagion: one unhedged, unlucky position can drain collateral that was meant for something else. That is the same logic as portfolio margin for options books in [[portfolio-risk]].

### ④ Tiers, partial liquidation, fees and funding

**Leverage tiers.** Large positions are harder to unwind without moving the price, so venues raise the maintenance rate, and cut the maximum leverage, as the position grows. A tier table looks like this (illustrative, not any venue's schedule):

| Position notional | Max leverage | Maintenance rate |
|---|---|---|
| up to $1 million | 50× | 0.5% |
| $1–5 million | 20× | 1.0% |
| $5–20 million | 10× | 2.5% |
| above $20 million | 5× | 5.0% |

**Partial liquidation.** Many engines first cancel your open orders, then close only part of the position, enough to bring equity back above maintenance. In the 10× example, closing half at $90,500 realizes \(-\$4{,}750\); the remaining 0.5 BTC has equity $500 against a maintenance requirement of \(0.005 \times 50{,}000 = \$250\), so it survives with a new liquidation price of $90,000. You are smaller, and still exposed.

**Fees.** A liquidation usually costs more than a normal close: the venue may charge a liquidation fee, and whatever margin is left between the liquidation price and the bankruptcy price often goes to the **insurance fund**, not back to you ([[insurance-adl]]).

**Funding walks the line toward you.** In isolated mode, funding payments come out of the position's margin. Holding the 10× long for 30 days at the baseline +0.01% every 8 hours costs \(0.0001 \times 3 \times 30 \times \$100{,}000 = \$900\) ([[funding-rate]]). The cushion is now $9,100, and the liquidation price has crept up from $90,500 to **$91,400** — without bitcoin moving at all.

> [!WARN] Leverage is not the number on the slider
> What matters is **notional ÷ equity**: the position's value divided by the money that actually stands behind it. Choosing “10×” in cross mode with a large account may mean an effective leverage of 3×; adding positions or paying funding raises it silently. Before any trade, write down three numbers: notional, the price at which you are out, and the dollar loss at that price. Sizing rules from [[position-sizing]] apply here with the liquidation loss as the “risk per trade”.

### ⑤ Cascades: October 2025

One liquidation is a private event. Many at once are a market event, because **a liquidation is a forced market order**. When the engine closes a long, it sells. If the order book is thin, that selling pushes the mark price down, into the next cluster of liquidation prices, whose forced selling pushes it further. The inline demo above runs exactly this loop: a 3% shock with a moderately thin book can turn into a 7% fall, with no new information at all.

> [!FACT] The largest liquidation cascade on record (October 10–11, 2025)
> After a post on October 10, 2025 by President Trump threatening an extra 100% tariff on Chinese goods, crypto markets fell hard and **more than $19 billion** of leveraged positions were liquidated in about a day, the largest such event recorded, hitting more than 1.6 million traders (CoinDesk, citing CoinGlass, which notes the true total is likely higher because some venues under-report). On Hyperliquid alone, more than $1.23 billion of trader capital was wiped out and over 1,000 wallets were fully liquidated. The episode also produced the first **cross-margin auto-deleveraging** in Hyperliquid's history — the subject of the next lesson.

Three things made that cascade worse than the price move alone would suggest: leverage was concentrated in a few price bands, order books thinned as market makers pulled quotes, and liquidation engines had to sell into that thin book at the same moment. None of it is specific to crypto. The October 19, 1987 stock crash, when the Dow fell 22.6% (the S&P 500 fell 20.5%), was amplified by portfolio-insurance selling of index futures — forced selling triggered by price, just slower.

## @analogy
Think of a leveraged perp as **renting a very expensive car with a small deposit and a tracker**. The car is worth $100,000; you put down $10,000. The rental company does not care where you drive; it cares about the gap between the car's value and your deposit. The moment a dent (the price drop) eats all but $500 of the deposit, the tracker fires, a tow truck arrives and the car is gone. It does not matter that the garage down the road would have fixed the dent tomorrow for free.

Isolated margin is renting with just the deposit on file. Cross margin is giving the rental company access to your whole bank account: the tow truck comes later, but when it does, it empties the account first. Leverage tiers are the company demanding a bigger deposit for a fleet of cars, because selling twenty repossessed cars at once gets a worse price than selling one. And a cascade is a whole city of tow trucks arriving at once at a used-car lot that only has two buyers.

Where the analogy breaks: a rental company values the car calmly, once. An exchange revalues your position every second at the mark price, and during a cascade the “used-car price” it gets for your position can be worse than the value it assumed. That shortfall is the next lesson.

## @misconceptions
- **“At 10× I can survive a 10% drop.”** — You survive 9.5% at most, and less after fees and funding: maintenance margin takes its slice before your cushion reaches zero.
- **“Liquidation only matters if the price stays down.”** — Liquidation is a barrier, not a closing test. A single touch of the mark price closes the position, and the recovery happens without you.
- **“Cross margin is always safer because it is harder to liquidate.”** — It is harder to liquidate *this* position, but the loss when it happens can be the whole account. Cross is valuable for offsetting positions, dangerous for one outsized bet.
- **“My loss is capped at the margin, so a perp is like buying an option.”** — The cap arrives on the path, at the worst moment, and you lose the upside that follows. An option's loss is capped by shape and judged at expiry ([[perps-vs-options]]).
- **“The liquidation price never moves after I open.”** — Funding, fees, added positions (in cross) and tier changes all move it. Funding alone moved the 10× example's line from $90,500 to $91,400 in 30 days.

## @takeaways
- Equity = margin + unrealized P&L at the mark price; the exchange closes the position when equity falls to the maintenance margin.
- For an isolated linear long, \(P_{\text{liq}} \approx P_0(1 - 1/L + m)\): 10× at $100,000 with 0.5% maintenance liquidates near $90,500, leaving only 9.5% of room.
- Room to liquidation is \(1/L - m\); doubling leverage roughly halves it, and the chance of *touching* the line over a month is far higher than the chance of *ending* beyond it.
- Isolated fences off a fixed loss; cross widens the cushion by risking the whole account.
- Liquidations are forced market orders, so clustered leverage can cascade: October 10–11, 2025 liquidated more than $19 billion.

## @quiz
1. You open a 20× isolated long at an illustrative $100,000 with a 0.5% maintenance rate. Near which price are you liquidated?
   - [ ] $80,000
   - [x] $95,500
   - [ ] $99,500
   - [ ] $90,500
   > \(100{,}000 \times (1 - 1/20 + 0.005) = 100{,}000 \times 0.955 = \$95{,}500\). $90,500 is the 10× answer; $80,000 would ignore leverage altogether.
2. Two traders each open a 10× long of 1 BTC at $100,000 in a $30,000 account: one isolated with $10,000, one cross. Bitcoin falls to $85,000 and recovers. What happens?
   - [ ] Both are liquidated because both used 10×
   - [ ] Neither is liquidated because bitcoin recovered
   - [x] The isolated trader is liquidated and loses about $10,000; the cross trader survives, down $15,000 at the low
   - [ ] The cross trader is liquidated first because cross margin is riskier
   > Isolated liquidates at $90,500. The cross account's liquidation price is \(100{,}000 - (30{,}000 - 500) = \$70{,}500\), so $85,000 only produces a $15,000 unrealized loss that recovers with the price.
3. With bitcoin's illustrative 50% volatility, why does a 10× long have about a 51% chance of being liquidated within 30 days, even though ending below $90,500 on day 30 is much less likely?
   - [ ] Because funding payments are deducted every 8 hours
   - [x] Because liquidation happens the first time the path touches the line, and many paths touch it and come back
   - [ ] Because exchanges liquidate on the last traded price, which is noisier
   - [ ] Because the maintenance rate rises as the price falls
   > A barrier is judged on the whole path. For a driftless walk, touching is roughly twice as likely as ending beyond the barrier. Funding moves the line a little but is not the main reason; liquidations use the mark price, not the last trade.
4. An isolated 10× long pays the baseline funding of +0.01% per 8 hours for 30 days on $100,000 of notional, and bitcoin does not move. What happens to the liquidation price?
   - [x] It rises from $90,500 to about $91,400, because $900 of funding came out of the margin
   - [ ] Nothing: the liquidation price is fixed when you open
   - [ ] It falls, because funding is paid to longs
   - [ ] It rises to $100,000, because the funding makes the position insolvent
   > \(0.0001 \times 3 \times 30 \times 100{,}000 = \$900\) leaves $9,100 of margin; equity now reaches $500 at \(100{,}000 - 8{,}600 = \$91{,}400\). With positive funding, longs pay shorts.
5. Why can a 3% drop in bitcoin turn into a 7% drop during a liquidation cascade?
   - [ ] Because exchanges deliberately push prices to liquidate traders
   - [ ] Because funding rates jump to their cap
   - [ ] Because insurance funds sell bitcoin to refill themselves
   - [x] Because each liquidation is a forced market sell that pushes the price into the next cluster of liquidation prices
   > Forced selling into a thin book moves the mark price, which triggers the next band of liquidations. No new information is needed; the leverage itself creates the feedback loop.

## @further
- [CoinDesk: the $19 billion liquidation that shook crypto (Oct 2025)](https://www.coindesk.com/research/market-spotlight-the-19-billion-liquidation-that-shook-crypto) — the anatomy of the October 10–11, 2025 cascade.
- [Hyperliquid docs: liquidations](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/liquidations) — one venue's rules for maintenance margin, partial liquidation and the backstop vault, all triggered by the mark price.
- [FINRA: margin accounts](https://www.finra.org/rules-guidance/key-topics/margin-accounts) — how margin works for stock accounts, a useful contrast to perp margin.
- [Federal Reserve History: the stock market crash of 1987](https://www.federalreservehistory.org/essays/stock-market-crash-of-1987) — forced selling and futures in an older cascade.

## @next
Liquidation is supposed to close a position *before* its margin runs out. But in a cascade the engine may only be able to sell at $88,000 a position whose money ran out at $90,000. Who pays for the missing $2,000, and why might it be a trader who was *right*? That is the insurance fund and auto-deleveraging.
