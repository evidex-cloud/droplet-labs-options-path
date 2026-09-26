---
id: basis-trades
prereqs: forwards-carry, futures-basis, funding-rate, margin-liquidation, insurance-adl
demo: basis-trades
---

# Basis & Funding Trades: Cash-and-Carry

## @hook
Buy one bitcoin and sell one bitcoin of futures at the same time. The price risk cancels, and what is left is a gap (the basis, or the funding) that you collect like rent. This lesson asks how much that rent really is, how much of it is just interest in disguise, and the five ways a “market-neutral” trade still loses money.

## @bridge
[[futures-basis]] showed that a future usually trades above spot, and that the gap shrinks to zero at expiry. [[funding-rate]] showed that a perp has no expiry, so the same gap is paid out continuously as funding, by longs to shorts when it is positive. [[margin-liquidation]] and [[insurance-adl]] then listed every way a perp position can be cut short. This lesson combines them into the most popular professional trade in crypto: **own the coin, short the contract, keep the gap.** It builds Idea ② (a future is priced by the cost of replicating it with spot and cash, as in [[forwards-carry]]) and Idea ④, because the risks that remain are exactly the ones hedging cannot remove.

## @intuition
Start with a dated future, all numbers illustrative.

Bitcoin spot is **$100,000**. A future expiring in **90 days** trades at **$102,000**, a little richer than the $101,500 future in [[futures-basis]]. You do two things at once:

- **buy 1 BTC** in the spot market for $100,000;
- **sell 1 BTC of the future** at $102,000.

Now wait 90 days. At expiry the future settles at the spot price, whatever it is. Watch what happens to the two legs:

| Bitcoin at expiry | Spot leg | Short future | Total |
|---|---|---|---|
| $80,000 | −$20,000 | +$22,000 | **+$2,000** |
| $100,000 | $0 | +$2,000 | **+$2,000** |
| $130,000 | +$30,000 | −$28,000 | **+$2,000** |

**The price no longer matters.** You locked in the $2,000 gap on day one. That is the **cash-and-carry** trade: carry the asset (hold it) while it “grows into” the futures price.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Long spot plus short future equals a flat line">
<defs><marker id="basis-trades-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="70" y1="130" x2="615" y2="130" class="fx-axis" marker-end="url(#basis-trades-ah)"/>
<line x1="80" y1="220" x2="80" y2="36" class="fx-axis" marker-end="url(#basis-trades-ah)"/>
<line x1="340" y1="40" x2="340" y2="220" class="fx-grid"/>
<polyline points="80,210 600,50" class="fx-line-blue"/>
<polyline points="80,46 600,206" class="fx-line-btc"/>
<line x1="80" y1="126" x2="600" y2="126" class="fx-line-thick"/>
<text x="560" y="46" text-anchor="end" class="fx-t-blue">long 1 BTC spot</text>
<text x="560" y="222" text-anchor="end" class="fx-t-btc">short 1 future at 102,000</text>
<text x="600" y="118" text-anchor="end" class="fx-t-b">total: +$2,000 at any price</text>
<text x="340" y="244" text-anchor="middle" class="fx-t-sm">100,000</text>
<text x="80" y="244" text-anchor="middle" class="fx-t-sm">60,000</text>
<text x="600" y="244" text-anchor="middle" class="fx-t-sm">140,000</text>
<text x="96" y="40" class="fx-t-sm">P&amp;L at expiry</text>
<text x="612" y="148" text-anchor="end" class="fx-t-sm">bitcoin at expiry</text>
</svg>
<figcaption>Figure 1 · Two straight lines with opposite slopes add up to a flat one. The long spot line and the short futures line cross zero at different prices ($100,000 and $102,000); the flat total sits $2,000 above zero: the basis you sold.</figcaption>
</figure>

Is that free money? No, and Idea ② tells you why. Holding $100,000 of bitcoin for 90 days ties up $100,000 of cash that could have earned interest. At the course's 4% rate, the no-arbitrage futures price is \(100{,}000 \times e^{0.04 \times 90/365} \approx \$100{,}991\) ([[forwards-carry]]). So about **$991 of the $2,000 is simply interest** you would have earned in a savings account. The other **$1,009** is the real prize: what leveraged buyers pay, on top of interest, for the convenience of getting bitcoin exposure without putting up the cash.

A perp does the same job without an expiry date. Instead of one gap paid at expiry, it pays the gap in small slices: **funding**. When funding is positive, longs pay shorts every interval. So the perp version of the trade, **long spot, short perp**, collects funding for as long as it stays positive. At the baseline rate of +0.01% every 8 hours, one bitcoin of short perp at $100,000 receives $10 per interval, **$30 a day**, about 10.95% a year.

> [!KAI] “Earn 11% on bitcoin, market-neutral”
> Kai sees a banner offering a “delta-neutral bitcoin yield”. Kai has learned enough to ask the right question: *neutral to what, and paid by whom?* The answer is this lesson. The yield is the funding that leveraged longs pay; it is neutral to bitcoin's price, but not to funding turning negative, to the short leg being liquidated, to the exchange failing, or to auto-deleveraging. None of those show up in an APR headline.

::demo[basis-trades-lock]

We'll take it in five parts:

- **① Cash-and-carry with a dated future**
- **② Funding carry with a perp: yield versus liquidation**
- **③ Funding regimes and the “fake APR”**
- **④ Synthetic dollars: the trade as a product**
- **⑤ The risk list, and the Treasury basis trade**

## @mechanics
### ① Cash-and-carry with a dated future

Write the two legs down. You buy spot at \(S_0\) and sell a future at \(F_0\); at expiry the future is worth \(F_T = S_T\). Your total P&L is

$$
\Pi = \underbrace{(S_T - S_0)}_{\text{spot leg}} + \underbrace{(F_0 - F_T)}_{\text{short future}} = F_0 - S_0
$$

where \(S_T\) cancels because \(F_T = S_T\) at expiry. Everything you earn is decided on day one. To compare it with other yields, annualize it:

$$
y = \frac{F_0 - S_0}{S_0} \times \frac{365}{d}, \qquad y_{\text{cont}} = \frac{1}{T}\ln\frac{F_0}{S_0}
$$

where \(d\) is the number of days to expiry and \(T = d/365\) in years; the second version is the continuously compounded one from [[futures-basis]].

> [!EXAMPLE] How much of the basis is real?
> \(S_0 = 100{,}000\), \(F_0 = 102{,}000\), \(d = 90\):
> - simple: \(y = 0.02 \times 365/90 \approx 8.11\%\) a year;
> - continuous: \(y_{\text{cont}} = \ln(1.02)/(90/365) \approx 8.03\%\);
> - compare the risk-free rate \(r = 4\%\): the **excess** carry is about \(8.03\% - 4\% \approx 4.0\%\) a year, or \(102{,}000 - 100{,}991 = \$1{,}009\) on this trade.
>
> If you fund the $100,000 with borrowed money at 4%, the interest cancels the first $991 and **only the $1,009 is profit**.

<figure>
<svg viewBox="0 0 640 170" role="img" aria-label="The basis split into interest and demand premium">
<text x="20" y="26" class="fx-t-b">what the $2,000 basis is made of (90 days, spot $100,000)</text>
<rect x="60" y="50" width="248" height="44" rx="4" class="fx-fill-muted"/>
<rect x="308" y="50" width="252" height="44" rx="4" class="fx-fill-btc"/>
<text x="184" y="77" text-anchor="middle" class="fx-t-inv">interest: $991</text>
<text x="434" y="77" text-anchor="middle" class="fx-t-inv">demand premium: $1,009</text>
<text x="184" y="116" text-anchor="middle" class="fx-t-sm">what cash would earn at 4% anyway</text>
<text x="184" y="132" text-anchor="middle" class="fx-t-sm">(Idea ②: the no-arbitrage part)</text>
<text x="434" y="116" text-anchor="middle" class="fx-t-sm">what leveraged longs pay on top</text>
<text x="434" y="132" text-anchor="middle" class="fx-t-sm">(the part a carry trader is really paid for)</text>
<text x="60" y="158" class="fx-t-sm">fair future at 4% carry ≈ 100,991 · market future 102,000 · illustrative</text>
</svg>
<figcaption>Figure 2 · Half of this illustrative basis is plain interest. The trade only beats a savings account by the demand premium, and that premium is exactly what disappears when leveraged buyers disappear.</figcaption>
</figure>

When futures trade **below** spot (backwardation), the mirror trade (sell or borrow spot, buy the future) is called a **reverse cash-and-carry**. It is harder in crypto, because borrowing coins to sell is limited and costly, which is one reason crypto futures spend more time above spot than below it.

> [!DEEP] Why doesn't arbitrage squeeze the excess carry to zero?
> In textbook no-arbitrage, anyone can borrow at \(r\) and short freely, so \(F_0 = S_0e^{rT}\) exactly. In practice the arbitrageur's own costs set a **band**, not a point: \(S_0e^{(r_b + c)T}\) above, where \(r_b\) is the rate they actually borrow at and \(c\) covers fees, custody and the capital locked up as margin. Inside the band, no one can profit. Crypto's band has been wide because the balance sheets able to run the trade at scale are limited, margin earns nothing, and venue risk is real. The excess carry is partly a payment for renting out a scarce balance sheet, which is why it shrinks as more institutional capital arrives and jumps when that capital retreats.

A dated-future trade has one more property worth noticing: the profit is locked **only at expiry**. Before then the future is marked to market every day. If the basis widens from $2,000 to $6,000 during a mania, your short future shows a $4,000 loss against the spot leg, and the exchange wants margin for it, even though the trade still converges to +$2,000 at expiry. Traders who cannot post that margin are forced out at the worst moment.

### ② Funding carry with a perp: yield versus liquidation

With a perp there is no expiry to force convergence; the tether is funding ([[funding-rate]]). Each interval, the short leg receives

$$
\text{funding}_t = f_t \times Q \times P_t, \qquad \text{APR} = f \times n \times 365
$$

where \(f_t\) is the funding rate for that interval, \(Q\) the position in coins, \(P_t\) the mark price, and \(n\) the number of intervals per day (3 for 8-hour funding). At the baseline \(f = 0.01\%\) with \(n = 3\): \(\text{APR} = 0.0001 \times 3 \times 365 = 10.95\%\).

But the short perp needs margin, and that margin is capital too. If you short at leverage \(L\), the trade uses \(Q P_0\) for spot plus \(Q P_0 / L\) for margin, so the return on all the capital is

$$
R = \text{APR} \times \frac{L}{L + 1}
$$

where \(L\) is the leverage on the short leg. At 3×: \(10.95\% \times 3/4 \approx 8.21\%\). Higher leverage raises \(R\), and it also brings the short leg's liquidation price closer, because a *rally* is what hurts a short. The spot leg gains in that rally, but on most venues it does not sit in the same margin account, so it cannot save the short.

| Short leverage | Capital used | Return on capital (APR 10.95%) | Short liquidation price | P(touch within 90 days) | P(touch within 1 year) |
|---|---|---|---|---|---|
| 1× | $200,000 | 5.5% | $199,500 | 0.4% | 12% |
| 2× | $150,000 | 7.3% | $149,500 | 9% | 34% |
| 3× | $133,333 | 8.2% | $132,833 | 22% | 49% |
| 5× | $120,000 | 9.1% | $119,500 | 43% | 66% |
| 10× | $110,000 | 10.0% | $109,500 | 68% | 82% |

The probabilities assume bitcoin's illustrative 50% volatility and no drift (engine `probTouch`), with 0.5% maintenance. **Going from 3× to 10× adds under two points of yield and turns a coin flip over a year into a four-in-five chance of losing the hedge.** When the short leg is liquidated, the trader loses its margin and is left long spot, unhedged, right after a big rally: the carry trade has become a directional bet at the top.

> [!THINK] A trader runs the 5× version and bitcoin rallies 25% in a week. The spot leg is up $25,000. Why can the trade still lose money?
> Predict before opening: where is the spot gain, and where is the margin?
> ---
> The short perp is liquidated near $119,500, losing its $20,000 margin (minus the small maintenance slice). The spot gain is real, but it is now an *open* long position: if bitcoin falls back to $100,000, the $25,000 gain evaporates and the $20,000 loss on the short remains. Hedged books avoid this with portfolio or unified margin (spot counted as collateral for the short), lower leverage, or by topping up margin in time.

### ③ Funding regimes and the “fake APR”

Funding is not a coupon. It is the price of leverage demand, and it swings with it.

- **Calm:** near the baseline +0.01% per 8 hours, about 11% a year.
- **Hot:** in a leveraged bull market, longs crowd in and funding can sit well above baseline. At +0.03% per 8 hours the headline is \(0.0003 \times 3 \times 365 = 32.85\%\) a year.
- **Negative:** after a crash, or when shorts crowd in, funding turns negative and the carry trade **pays** instead of receiving. At −0.005% per 8 hours it costs about 5.5% a year.

The **fake APR** is taking one hot print and multiplying it by 1,095 intervals. It assumes the regime lasts a year; it rarely does, and it ends precisely when the leverage that paid it is liquidated. The main demo below simulates regimes and shows the gap between the headline and what a path actually pays. Convert venues to the same interval before comparing them: Hyperliquid pays every hour at one-eighth of an 8-hour rate, so its baseline equals Binance's.

### ④ Synthetic dollars: the trade as a product

Packaged, long spot plus short perp becomes a **synthetic dollar**: a token whose backing is a coin (sometimes staked, to add staking yield) and an equal-sized short perp. Because the two legs cancel, the backing is worth roughly the same number of dollars whatever the coin does, and the token pays out the funding (plus staking) to holders.

The design is clever and the risks are the ones in this lesson, now pooled:

- **Negative funding** for a long stretch drains the yield and then the backing; such products typically keep a reserve for this.
- **Venue and custody risk:** the short legs live on exchanges; if one fails or freezes withdrawals, part of the hedge is gone.
- **Liquidation and ADL** of the short legs in a sharp rally or a crash leave the backing unhedged.
- **Redemption runs:** if holders rush to redeem, positions must be unwound quickly into thin markets.

Sizes, yields and the names of specific products change fast; judge any such token by these mechanisms, not by its current headline yield.

### ⑤ The risk list, and the Treasury basis trade

| Risk | What happens | The illustrative damage |
|---|---|---|
| Funding turns negative | the short leg pays instead of receiving | −0.005%/8h ≈ −5.5% a year on notional |
| Short-leg liquidation | a rally wipes the short's margin; spot is left unhedged | 5× short: −$20,000 margin at $119,500 |
| Basis blows out (dated future) | mark-to-market loss and margin calls before convergence | basis $2,000 → $6,000: −$4,000 on paper |
| Auto-deleveraging | a crash ADLs the winning short; spot is left unhedged | the hedge vanishes at the worst moment ([[insurance-adl]]) |
| Venue failure | collateral frozen or lost on one leg | up to the whole leg; the collapse of the FTX exchange is the best-known case |

> [!WARN] “Market-neutral” is not “risk-free”
> The trade removes one risk, bitcoin's price, and keeps five others. Its return profile is many small, steady gains and occasional large losses, the same shape as selling options ([[variance-risk-premium]]). A yield that looks like a savings account while carrying crash risk is a yield that is being paid for bearing that crash risk.

Traditional finance has the same trade at enormous scale. In the **Treasury cash–futures basis trade**, hedge funds buy Treasury bonds, sell Treasury futures against them, and finance the bonds in the repo market, often with high leverage, to earn a basis measured in hundredths of a percent. In March 2020, when a rush for cash hit the Treasury market, forced unwinds of such positions are widely thought to have added to the disorder, and the Federal Reserve bought Treasuries on a large scale. The mechanics are identical to the bitcoin version: a small, reliable carry, high leverage to make it worthwhile, and a margin call exactly when everyone else needs cash too. Systematic premium-collecting strategies in options ([[systematic-vol]]) share the same family resemblance.

## @analogy
The cash-and-carry trade is a **wine merchant who sells next year's delivery today**. A restaurant agrees now to pay $102 next year for a case that costs $100 today. The merchant buys the case, stores it in the cellar and waits. Whatever wine prices do, the merchant has sold at $102 and bought at $100: the $2 is locked. Part of that $2 only pays for tying up money in the cellar for a year (interest); the rest is what the restaurant pays for not having to buy and store the wine itself (the demand premium).

The perp version is a merchant who **rents the case out, month by month**, to restaurants that want it on the menu without buying it. As long as restaurants are eager, the rent comes in. When demand cools, the rent drops, and in a bad season the merchant has to pay restaurants to keep taking the wine.

Where the analogy breaks: a wine merchant's cellar does not get repossessed when wine prices spike. The perp merchant's short leg does. And the merchant's customers sit in a building (the exchange) that can burn down with the merchant's contract inside it.

## @misconceptions
- **“The basis is pure profit.”** — Part of it is interest you could earn anyway. In the example, $991 of the $2,000 is the 4% risk-free return; only about $1,009 is excess carry.
- **“The APR on screen is what the trade yields.”** — It is one funding print times 1,095. Funding moves with leverage demand, turns negative, and the hottest prints end fastest.
- **“A delta-neutral trade cannot lose money.”** — It is neutral to price only while both legs exist. Liquidation of the short, ADL or a venue failure can remove one leg and leave a naked position.
- **“More leverage on the short leg is a free way to boost the yield.”** — From 3× to 10× the return rises from about 8.2% to 10.0%, while the one-year chance of losing the short leg to a rally rises from about half to about four in five.
- **“A dated future's profit is safe until expiry.”** — It is locked *at* expiry. Before that, a widening basis produces mark-to-market losses and margin calls that can force you out.

## @takeaways
- Long spot plus short future earns \(F_0 - S_0\) at expiry whatever the price does: \(\Pi = (S_T - S_0) + (F_0 - S_T)\).
- Much of the basis is interest (Idea ②); only the excess over the risk-free rate (about 4% a year in the example) pays for bearing the trade's risks.
- The perp version collects funding: \(\text{APR} = f \times n \times 365\), 10.95% at the +0.01%/8h baseline, and \(\text{APR} \times L/(L+1)\) on total capital.
- Leverage on the short leg raises the yield a little and the chance of a rally liquidation a lot.
- The remaining risks (negative funding, short-leg liquidation, basis blowouts, ADL and venue failure) give the trade a “steady gains, rare large losses” shape, like the Treasury basis trade and like selling options.

## @quiz
1. Spot is $100,000 and a 90-day future trades at $102,000. You buy spot and sell the future. Bitcoin ends at $75,000. What is your total P&L at expiry?
   - [ ] −$25,000
   - [ ] +$27,000
   - [x] +$2,000
   - [ ] $0
   > The spot leg loses $25,000 and the short future gains \(102{,}000 - 75{,}000 = \$27{,}000\): together \(F_0 - S_0 = \$2{,}000\), whatever the final price.
2. With a 4% risk-free rate, the fair 90-day future is about $100,991. What does the remaining $1,009 of the $2,000 basis represent?
   - [x] The premium leveraged buyers pay above interest: the excess carry
   - [ ] Interest on $100,000 for 90 days
   - [ ] The exchange's fee for the future
   - [ ] The expected rise in bitcoin's price
   > \(100{,}000 \times e^{0.04 \times 90/365} \approx 100{,}991\) is the no-arbitrage price; it covers interest. What is above it is demand for leveraged exposure, the only part that beats a risk-free deposit.
3. A long-spot, short-perp trade receives the baseline +0.01% funding every 8 hours and uses 3× leverage on the short. What is the return on total capital, if funding stays at baseline all year?
   - [ ] 10.95%
   - [ ] 32.85%
   - [ ] 3.65%
   - [x] About 8.2%
   > \(\text{APR} = 0.0001 \times 3 \times 365 = 10.95\%\) on the notional, but the capital is spot plus one-third margin: \(10.95\% \times 3/4 \approx 8.21\%\). 32.85% would be a +0.03% regime.
4. Why does raising the short leg's leverage from 3× to 10× make the trade riskier even though the position is “hedged”?
   - [ ] Because funding is paid in proportion to leverage
   - [x] Because a rally can liquidate the short leg, and the spot gain usually sits in a different account and cannot save it
   - [ ] Because higher leverage makes the spot leg fall faster
   - [ ] Because the exchange charges negative funding to leveraged shorts
   > The short's liquidation price falls from about $132,833 to $109,500. After liquidation the trader is left long spot, unhedged, after a rally. Funding is paid on notional, not on leverage.
5. A synthetic-dollar token backed by staked coins plus an equal short perp advertises its current yield. Which risk does that headline number not capture?
   - [ ] The token's price moving one-for-one with the coin
   - [ ] The coin's staking rewards
   - [x] A long stretch of negative funding, or the short legs being liquidated, auto-deleveraged or stuck on a failed venue
   - [ ] The fact that funding is paid by shorts to longs when positive
   > Because the legs cancel, the backing does not track the coin's price. The yield is funding plus staking; its risks are funding turning negative and losing a short leg. When funding is positive, longs pay shorts.

## @further
- [Basis trading (Wikipedia)](https://en.wikipedia.org/wiki/Basis_trading) — the cash-and-carry trade in general form, across markets.
- [Binance: introduction to funding rates](https://www.binance.com/en/support/faq/360033525031) — the funding formula, interval and interest component behind the perp version of the trade.
- [Hyperliquid docs: funding](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/funding) — hourly funding and why rates must be converted to the same interval.
- [Contango (Wikipedia)](https://en.wikipedia.org/wiki/Contango) — why futures on storable assets usually sit above spot, and what carry costs mean.
- [New Finance Path](https://evidex-cloud.github.io/droplet-labs-finance-path/) — the sister course's lessons on repo, leverage and crypto yield products.

## @next
Every lesson in this stage has been about linear contracts: straight lines, margin, liquidation, funding. The last lesson of the Markets tier puts them side by side with the options you already know. Same bullish view on bitcoin, same budget: a 10× perp or a call. Which one survives the path, which one costs more to hold, and how do the traps compare?
