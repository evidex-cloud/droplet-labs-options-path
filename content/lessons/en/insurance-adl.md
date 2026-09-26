---
id: insurance-adl
prereqs: what-is-perp, mark-index-last, margin-liquidation
demo: insurance-adl
---

# The Insurance Fund & Auto-Deleveraging: Who Pays After a Bankruptcy

## @hook
A liquidation is supposed to close a losing position before its margin runs out. In a crash it sometimes cannot, and the position ends up owing more than it had. Every perp exchange needs an answer to one question: **who pays the difference?** The answer is a waterfall, and its last step can close the position of a trader who was *right*.

## @bridge
[[margin-liquidation]] ended with a 10× long of 1 BTC at an illustrative $100,000: the exchange starts liquidating at $90,500, and the margin is completely gone at $90,000. [[mark-index-last]] explained which price triggers that. This lesson follows the position past the trigger, into the cases where the exit goes badly. It builds Idea ④ (risk) in its most literal form: *who holds the risk* when a leveraged trader cannot pay, and how the exchange passes it on.

## @intuition
Start with a fact that is easy to forget: **a perp market is a closed room.** Every long is matched by a short. When bitcoin falls $1, the longs lose exactly what the shorts gain. The exchange sits in the middle, collects margin from both sides and pays winners out of losers' collateral. It is not supposed to take a side itself.

That works as long as every loser can pay. Margin is the promise that they can. In [[margin-liquidation]] we met the two prices that guard this promise:

- the **liquidation price**, $90,500 for our 10× long, where the engine starts closing the position;
- the **bankruptcy price**, $90,000, where the position's equity would be exactly zero.

The $500 between them is the safety buffer. What happens next depends on the price the engine actually gets when it sells the position:

1. **A clean exit.** The engine sells at $90,400. The position lost $9,600 of its $10,000; the remaining $400 does not go back to the trader on most venues; it goes into the exchange's **insurance fund**.
2. **A messy exit.** Prices gap, the order book is thin, and the engine can only sell at $88,500. The position lost $11,500 against $10,000 of margin: a **hole** of $1,500 that the trader cannot pay. The insurance fund pays it, so the winning shorts still receive their full profit.
3. **An empty fund.** If holes are large and many, as in a cascade, the fund can run out. Then the exchange uses its last resort: **auto-deleveraging (ADL)**. It forcibly closes positions on the *winning* side, highest-ranked first, at a price that makes the hole disappear.

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Price ladder: entry, liquidation, bankruptcy and two fill prices">
<line x1="120" y1="30" x2="120" y2="235" class="fx-axis"/>
<line x1="112" y1="40" x2="128" y2="40" class="fx-line"/>
<text x="104" y="44" text-anchor="end" class="fx-t">100,000</text>
<text x="140" y="44" class="fx-t">entry of the 10× long (margin $10,000)</text>
<line x1="112" y1="120" x2="128" y2="120" class="fx-line-bad"/>
<text x="104" y="124" text-anchor="end" class="fx-t-bad">90,500</text>
<text x="140" y="124" class="fx-t-bad">liquidation price: the engine starts selling</text>
<rect x="128" y="130" width="470" height="20" class="fx-area-ok"/>
<text x="140" y="144" class="fx-t-ok">fill at 90,400 → $400 surplus → insurance fund</text>
<line x1="112" y1="160" x2="598" y2="160" class="fx-line fx-dash"/>
<text x="104" y="164" text-anchor="end" class="fx-t-b">90,000</text>
<text x="600" y="176" text-anchor="end" class="fx-t-b">bankruptcy price: equity = 0</text>
<rect x="128" y="182" width="470" height="36" class="fx-area-bad"/>
<text x="140" y="204" class="fx-t-bad">fill at 88,500 → $1,500 hole → insurance fund pays, or ADL</text>
<line x1="112" y1="222" x2="128" y2="222" class="fx-line-bad"/>
<text x="104" y="226" text-anchor="end" class="fx-t-bad">88,500</text>
<text x="20" y="252" class="fx-t-sm">1 BTC long at 10×, maintenance 0.5% · illustrative</text>
</svg>
<figcaption>Figure 1 · The two prices that matter after a liquidation. Above the bankruptcy price the exit leaves a surplus that feeds the insurance fund; below it the exit leaves a hole someone else has to fill. Only the fill price decides which.</figcaption>
</figure>

> [!KAI] Kai's friend was right and still got cut
> Kai's friend shorted bitcoin at $100,000 at 20× before the crash. On the way down, the friend's short showed an $11,500 profit. Then a message appeared: “Your position has been reduced by auto-deleveraging.” Half the short was closed at $90,000 while the screen showed $88,500. The friend did nothing wrong. They simply sat at the front of the queue that pays for other people's bankruptcies. Kai's reaction: “So even the winners are not safe.” Exactly — on a perp venue, being right is not the same as being paid in full.

This is very different from the options Kai trades. When Kai buys a listed XYZ put, the other side is the clearing house (the OCC), which guarantees the contract and has its own layers of protection; Kai's winning put is never “deleveraged” because a seller elsewhere went broke. Perp venues fill the same need with a smaller, faster and more visible machine.

::demo[insurance-adl-rank]

We'll take it in five parts:

- **① Bankruptcy price, surplus and hole**
- **② The insurance fund: a buffer, not a bottomless pot**
- **③ Auto-deleveraging: the queue and the price**
- **④ Other designs: socialized losses, HLP and clearing houses**
- **⑤ October 2025 and who ADL really hits**

## @mechanics
### ① Bankruptcy price, surplus and hole

The bankruptcy price is where equity reaches zero. For an isolated linear position with no fees:

$$
P_{\text{bk}}^{\text{long}} = P_0\left(1 - \frac{1}{L}\right), \qquad P_{\text{bk}}^{\text{short}} = P_0\left(1 + \frac{1}{L}\right)
$$

where \(P_0\) is the entry price and \(L\) the leverage. For the 10× long: \(100{,}000 \times (1 - 0.1) = \$90{,}000\). Compare the liquidation price \(P_0(1 - 1/L + m)\): the two differ by exactly the maintenance margin, \(m\,P_0 = \$500\) per BTC.

When the engine closes \(Q\) coins of a long at a fill price \(P_{\text{fill}}\), the result for the insurance fund is

$$
\Pi_{\text{IF}} = \left(P_{\text{fill}} - P_{\text{bk}}\right) Q
$$

where a positive \(\Pi_{\text{IF}}\) is a surplus the fund keeps and a negative one is a hole it must pay. (For a short, flip the sign: \((P_{\text{bk}} - P_{\text{fill}})\,Q\).)

> [!EXAMPLE] One position, two exits
> - Fill at $90,400: \(\Pi_{\text{IF}} = (90{,}400 - 90{,}000) \times 1 = +\$400\). The trader loses the full $10,000; the fund gains $400.
> - Fill at $88,500: \(\Pi_{\text{IF}} = (88{,}500 - 90{,}000) \times 1 = -\$1{,}500\). The trader still loses “only” $10,000, the margin they posted, and the fund pays $1,500 so the shorts are paid in full.
>
> Either way, **the liquidated trader loses the whole margin**. The fill price only decides whether the rest of the market gains a little or has to pay a little.

This is why exchanges liquidate *before* bankruptcy and why they use the mark price. The buffer between the two prices is what lets most liquidations end as surpluses, which is how the fund grows in quiet times.

### ② The insurance fund: a buffer, not a bottomless pot

An insurance fund is a pool of money an exchange sets aside to absorb holes. It is filled by liquidation surpluses like the $400 above, by liquidation fees, and sometimes by contributions from the exchange. It pays out whenever a liquidation ends below the bankruptcy price. Given a total hole \(H\) and a fund balance \(I\), the split is simple:

$$
\text{fund pays} = \min(H,\ I), \qquad \text{left for ADL} = \max(0,\ H - I)
$$

where \(H\) is the sum of all holes in the episode and \(I\) the fund balance before it.

> [!EXAMPLE] A cascade versus the fund
> A crash bankrupts **1,000 BTC** of 10× longs opened at $100,000, and the engine can only sell them at an average $88,500. Each BTC leaves a $1,500 hole: \(H = 1{,}000 \times 1{,}500 = \$1.5\) million. With a fund of $1.0 million, the fund pays $1.0 million and **$0.5 million** is left for ADL. Since each ADL'd BTC closes at the $90,000 bankruptcy price instead of the $88,500 market, it covers $1,500 of hole, so ADL must close \(500{,}000 / 1{,}500 \approx 333\) BTC of winning shorts.

Two numbers describe a fund's strength: its balance and its balance **relative to open interest**, the total size of positions that could go bankrupt. A fund that looks large in dollars can be thin next to tens of billions of open positions. Funds are usually per contract or per group of contracts, so a fund full of money for bitcoin may not stand behind a small, volatile altcoin.

> [!FACT] What the October 2025 crash did to one fund
> Binance publishes its insurance-fund balances. During the October 10–11, 2025 crash, the shared fund behind its BTC, ETH and BNB USDT-margined contracts reportedly fell from about $1.23 billion to about $1.04 billion — roughly $188 million used (Wu Blockchain, October 2025). Comparable figures for other large venues are not covered here; check each venue's own disclosures, and treat any fund size as a snapshot on a date.

### ③ Auto-deleveraging: the queue and the price

When the fund cannot cover the hole, the exchange takes the unfilled part of the bankrupt position and **matches it against traders on the other side**, closing their positions, on many centralized venues, at the **bankruptcy price** of the bankrupt one. For our long, that means closing winning shorts at $90,000 while the market is at $88,500. Each ADL'd short realizes its profit only down to $90,000, not $88,500 — it gives up $1,500 per BTC, which is exactly the hole.

Who goes first? Venues rank the opposite side by a score that grows with profit and with leverage. A representative form (Binance-style; each venue documents its own):

$$
\text{score} = \underbrace{\frac{\text{uPnL}}{\text{position margin}}}_{\text{profit ratio}} \times \underbrace{\frac{|\text{notional}|}{\text{equity}}}_{\text{effective leverage}}
$$

where uPnL is the unrealized profit at the mark price, position margin is what the trader posted, notional is the position's value at the mark, and equity is margin plus uPnL. Losing positions get a much lower score and sit at the back of the queue.

> [!EXAMPLE] Same profit, different place in line (mark $88,500)
> Two shorts of 1 BTC, both opened at $100,000, both up \(100{,}000 - 88{,}500 = \$11{,}500\):
> - **20× short**, margin $5,000: profit ratio \(11{,}500 / 5{,}000 = 2.30\); equity $16,500; effective leverage \(88{,}500 / 16{,}500 = 5.36\); score \(2.30 \times 5.36 \approx 12.3\).
> - **2× short**, margin $50,000: profit ratio \(0.23\); equity $61,500; effective leverage \(1.44\); score \(\approx 0.33\).
>
> The 20× trader is first in line by a factor of about 37. **ADL targets the most leveraged winners**, because they are the ones whose profits are, in effect, borrowed from the losers' collateral.

<figure>
<svg viewBox="0 0 640 230" role="img" aria-label="ADL queue ranked by score">
<text x="20" y="24" class="fx-t-b">winning shorts, ranked by ADL score (mark $88,500)</text>
<rect x="40" y="40" width="300" height="26" rx="4" class="fx-fill-red"/>
<text x="48" y="58" class="fx-t-inv">20× short from 100k · score 12.3</text>
<text x="352" y="58" class="fx-t-bad">closed first, at $90,000</text>
<rect x="40" y="74" width="115" height="26" rx="4" class="fx-fill-orange"/>
<text x="162" y="92" class="fx-t">10× short from 100k · score 4.7</text>
<rect x="40" y="108" width="65" height="26" rx="4" class="fx-fill-orange"/>
<text x="112" y="126" class="fx-t">10× short from 92k · score 2.7</text>
<rect x="40" y="142" width="29" height="26" rx="4" class="fx-fill-muted"/>
<text x="76" y="160" class="fx-t">5× short from 95k · score 1.2</text>
<rect x="40" y="176" width="8" height="26" rx="4" class="fx-fill-muted"/>
<text x="56" y="194" class="fx-t">2× short from 100k · score 0.3</text>
<line x1="470" y1="70" x2="470" y2="200" class="fx-line-muted fx-dash"/>
<text x="480" y="100" class="fx-t-sm">the queue is used</text>
<text x="480" y="116" class="fx-t-sm">from the top until</text>
<text x="480" y="132" class="fx-t-sm">the hole is closed;</text>
<text x="480" y="148" class="fx-t-sm">low leverage and</text>
<text x="480" y="164" class="fx-t-sm">small profit sit</text>
<text x="480" y="180" class="fx-t-sm">safely at the back</text>
<text x="20" y="222" class="fx-t-sm">score = profit ratio × effective leverage (representative form) · illustrative accounts</text>
</svg>
<figcaption>Figure 2 · The ADL queue. Bars are proportional to the score. Most venues show each trader a small light indicator of where they sit in this queue; a full row of lights means “you are near the front”.</figcaption>
</figure>

> [!THINK] Why does ADL close winners at the bankruptcy price and not at the market price?
> Predict before opening: what would happen to the hole if the exchange paid the ADL'd shorts the full market price?
> ---
> At the market price ($88,500) the bankrupt long cannot pay what the short is owed; that shortfall *is* the hole. Closing the pair at $90,000, the price at which the long's equity is exactly zero, is the only price at which the long pays everything it has and the short receives exactly that. The ADL'd trader's “loss” is profit they never actually had the money behind.

### ④ Other designs: socialized losses, HLP and clearing houses

ADL is one answer to the hole; there are others.

- **Socialized losses (clawbacks).** Some early crypto futures venues spread an unfilled hole across *all* profitable traders on the contract, shaving everyone's gains by a percentage. It is fairer in one sense (everyone pays a little) and worse in another (winners who took no leverage pay for others who took a lot). The insurance-fund-plus-ADL design largely replaced it on major venues.
- **A vault as the backstop (Hyperliquid).** On Hyperliquid, an on-chain order-book exchange, the **HLP** (Hyperliquidity Provider) vault is a community-funded market-making and backstop vault. A liquidator sub-vault takes over positions that cannot be closed on the order book; ADL remains the last resort, ranking opposite-side traders by unrealized profit and leverage. The price at which ADL'd positions are closed is also set by each venue's own rules, so read them rather than assume the bankruptcy-price convention above. In effect, the vault's depositors *are* the insurance fund: they earn from liquidations in normal times and absorb losses in bad ones.
- **Central clearing (listed futures and options).** Exchange-traded futures and options clear through a central counterparty such as the OCC or CME Clearing. Its **default waterfall** has the same shape — the defaulter's margin first, then a guarantee fund contributed by clearing members, then the clearing house's own capital, then further calls on members — but the losses fall on large, regulated member firms, not on individual winning customers. That is why a winning XYZ option is not reduced when some other trader defaults.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="The waterfall after a bankruptcy">
<defs><marker id="insurance-adl-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="20" y="30" width="180" height="56" rx="8" class="fx-bad"/>
<text x="110" y="54" text-anchor="middle" class="fx-t-b">① trader's own margin</text>
<text x="110" y="72" text-anchor="middle" class="fx-t-sm">always lost in full</text>
<rect x="230" y="90" width="180" height="56" rx="8" class="fx-hl"/>
<text x="320" y="114" text-anchor="middle" class="fx-t-b">② insurance fund</text>
<text x="320" y="132" text-anchor="middle" class="fx-t-sm">pays min(hole, balance)</text>
<rect x="440" y="150" width="180" height="56" rx="8" class="fx-btc"/>
<text x="530" y="174" text-anchor="middle" class="fx-t-b">③ ADL</text>
<text x="530" y="192" text-anchor="middle" class="fx-t-sm">winning side, top of queue</text>
<line x1="200" y1="72" x2="236" y2="100" class="fx-line" marker-end="url(#insurance-adl-ah)"/>
<line x1="410" y1="132" x2="446" y2="160" class="fx-line" marker-end="url(#insurance-adl-ah)"/>
<text x="226" y="78" class="fx-t-sm">hole left?</text>
<text x="436" y="138" class="fx-t-sm">fund empty?</text>
<text x="20" y="130" class="fx-t-ok">surplus (fill above</text>
<text x="20" y="146" class="fx-t-ok">bankruptcy price)</text>
<text x="20" y="162" class="fx-t-ok">flows into ② instead</text>
<text x="440" y="230" class="fx-t-sm">some designs: socialize the rest</text>
</svg>
<figcaption>Figure 3 · The waterfall. Each step only runs if the one above could not close the hole. Quiet markets refill step ② from surpluses; crashes drain it and push losses down to step ③, onto traders who did nothing wrong.</figcaption>
</figure>

### ⑤ October 2025 and who ADL really hits

> [!FACT] The first cross-margin ADL on Hyperliquid (October 10–11, 2025)
> In the cascade that liquidated more than $19 billion across crypto venues, Hyperliquid triggered **cross-margin auto-deleveraging for the first time** since its 2023 launch. By several accounts, positions worth billions of dollars were auto-deleveraged within minutes; exact totals vary by source and are not verified here.

Who sits at the front of an ADL queue during a crash? Not only reckless gamblers. Two groups are there almost by design:

- **Hedgers and basis traders.** A trader who owns bitcoin and is short the perp to earn funding ([[basis-trades]]) has a *winning* short in a crash. If that short is levered, it scores high. ADL closes it — and the trader is left holding unhedged spot bitcoin in a falling market, exactly the risk the trade was built to avoid.
- **Market makers.** Firms that quote both sides hedge across venues. When ADL cuts one leg on one venue, their book is suddenly directional, and they may widen quotes or step back, which thins the order book further — feeding the cascade that caused the ADL.

This is the quiet cost of perps. A risk you believed you had hedged can be un-hedged by someone else's bankruptcy. It is part of why tail hedges bought with options ([[tail-hedging]]) are valued differently from hedges built with linear contracts: an option you own cannot be deleveraged. The next lesson, [[basis-trades]], takes a trade that looks almost riskless and lists every way, ADL included, that it is not.

## @analogy
Picture a **poker table with a house bank**. Every chip one player wins, another loses. Each player must keep chips on the table to cover their bets; when their stack gets low, the dealer ends their hand early (liquidation).

Usually the dealer ends it while a few chips remain, and those leftover chips go into a small jar behind the dealer (the insurance fund). Sometimes a hand turns so fast that the player owes more than their stack. The dealer pays the winner from the jar so the table keeps its promise.

On a wild night, many hands collapse at once and the jar runs dry. Now the dealer walks around the table to the players with the **biggest winnings relative to their stacks**, the ones playing most aggressively, and says: “Your winnings from this hand are capped at what the loser could actually pay. You're done for the night.” That is ADL. Nobody accused them of cheating; they were just the most exposed winners at the moment the jar was empty.

Where the analogy breaks: at a poker table you could walk away with your winnings any time. On a perp venue, being cut *out* of a winning position can also cut you out of a hedge you depended on: the loss is not only the capped winnings but the new, unwanted risk left behind.

## @misconceptions
- **“ADL only hits the bankrupt account.”** — The bankrupt account is already empty. ADL closes positions on the *opposite, winning* side to fill its hole.
- **“If the exchange has an insurance fund, ADL can never happen.”** — The fund is finite, and cascades drain it fastest precisely when holes are largest. In October 2025 even Hyperliquid, which had never needed cross-margin ADL since its 2023 launch, used it.
- **“When I'm auto-deleveraged, I lose my margin.”** — You keep your margin and a realized profit; you lose the part of the profit beyond the bankruptcy price and, often more painfully, the position itself — including any hedge it provided.
- **“Low-leverage winners are just as exposed as high-leverage ones.”** — The ranking weights profit ratio by effective leverage; a 2× winner sits far behind a 20× winner with the same dollar profit.
- **“Insurance fund balances tell you a venue is safe.”** — A balance is a snapshot. What matters is the fund relative to open interest, which contracts it covers, and how fast it can be drained in a gap.

## @takeaways
- The bankruptcy price \(P_0(1 - 1/L)\) is where a position's equity hits zero; liquidation starts one maintenance margin earlier.
- A liquidation filled above the bankruptcy price leaves a surplus for the insurance fund; filled below it, it leaves a hole of \((P_{\text{bk}} - P_{\text{fill}})\,Q\).
- The waterfall is: trader's margin → insurance fund → auto-deleveraging of the winning side (some designs socialize the rest).
- ADL closes the highest-scoring winners (high profit ratio × high effective leverage), on many venues at the bankrupt position's bankruptcy price.
- ADL often hits hedgers and basis traders first, turning a hedged book into an unhedged one in the middle of a crash.

## @quiz
1. A 10× isolated long of 1 BTC opened at $100,000 is liquidated and the engine sells it at $88,500. What does the trader lose, and what is the hole?
   - [ ] The trader loses $11,500; there is no hole
   - [x] The trader loses the $10,000 margin; the hole is $1,500
   - [ ] The trader loses $10,000 plus $1,500 billed later; there is no hole
   - [ ] The trader loses $9,500; the insurance fund keeps $500
   > The bankruptcy price is $90,000. The trader can only lose what they posted ($10,000); the $1,500 below the bankruptcy price is a hole the insurance fund, or ADL, must cover. The $9,500 / $500 split is the clean-exit case at the liquidation price.
2. When the insurance fund cannot cover a hole, whose positions does ADL close first?
   - [ ] The bankrupt trader's other positions
   - [ ] All traders on both sides, pro rata
   - [ ] The traders with the largest positions on the losing side
   - [x] The winning traders on the opposite side with the highest profit ratio times effective leverage
   > ADL closes positions on the opposite, profitable side, starting from the top of a queue ranked by profit and leverage. The bankrupt account has nothing left to take.
3. Why does ADL close the winning short at the bankrupt long's bankruptcy price ($90,000) rather than at the market ($88,500)?
   - [ ] To punish traders who used high leverage
   - [x] Because $90,000 is the only price at which the bankrupt long can pay exactly what it has, so the pair closes with no hole
   - [ ] Because the mark price is not available during a crash
   - [ ] Because the insurance fund needs the $1,500 difference as a fee
   > At $88,500 the long owes more than it has; that difference is the hole. At $90,000 the long's equity is exactly zero, so the short receives everything the long had and nothing more.
4. A trader holds spot bitcoin and a 5× short perp to earn funding. Bitcoin crashes and the short is auto-deleveraged. What is the main new risk?
   - [ ] They must pay the insurance fund back
   - [ ] They lose the spot bitcoin to the exchange
   - [x] They now hold unhedged spot bitcoin in a falling market
   - [ ] Their funding income doubles
   > ADL closes the winning short leg. The spot leg remains, so the “neutral” trade has become a plain long bitcoin position at the worst moment.
5. Exchange X shows an insurance fund of $500 million. Which extra piece of information would tell you most about how protective it is?
   - [ ] The fund's all-time high balance
   - [ ] The number of listed contracts
   - [ ] The exchange's trading-fee schedule
   - [x] The fund's size relative to the open interest it covers, and which contracts it covers
   > A fund is a buffer against holes, and holes scale with open positions. $500 million behind a few billion of open interest is very different from the same amount behind tens of billions, or behind a group of volatile small coins.

## @further
- [Hyperliquid docs: auto-deleveraging](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/auto-deleveraging) — one venue's ADL ranking formula and closing price, in its own words.
- [Binance insurance fund history](https://www.binance.com/en/futures/funding-history/perpetual/insurance-fund-history) — live balances; read them as snapshots against open interest.
- [Hyperliquid docs: liquidations](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/liquidations) — partial liquidation, the liquidator vault and HLP.
- [Wu Blockchain: Hyperliquid activates cross-margin ADL for the first time](https://wublockchain.medium.com/hyperliquid-activates-cross-margin-auto-deleveraging-for-the-first-time-what-are-hlp-and-adl-9eb811418e9b) — an explainer written around the October 2025 event.
- [OCC: Options Disclosure Document](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — how the central counterparty stands behind listed options.

## @next
Now you know the full list of ways a perp position can end early. Yet there is a trade that holds a perp on purpose, for months, and claims to be almost riskless: own the coin, short the perp, collect the funding. How much does it really earn, and which of the traps from these last two lessons are hiding inside it?
