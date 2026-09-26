---
id: retail-flows
prereqs: covered-call, trading-psychology, market-makers, dealer-gamma, zero-dte
demo: retail-flows
---

# The Retail Wave, Gamma Squeezes & Option-Income ETFs

## @hook
Individual investors now account for roughly half of US options volume, and they pull in two opposite directions. Speculators buy cheap short-dated calls, which leaves dealers short gamma. Income investors buy funds that sell calls, which leaves dealers long gamma. The most famous story about the first tide — the GameStop “gamma squeeze” — is also the one a regulator looked into and could not confirm.

## @bridge
[[market-makers]] explained why dealers want retail orders and how they hedge them; [[dealer-gamma]] showed that when dealers are short gamma their hedging chases the price; [[zero-dte]] showed that retail investors are estimated to trade over half of same-day SPX volume. Kai's own covered call ([[covered-call]]) is a small piece of the other tide. This lesson asks: **what do retail flows do to the dealers' book, can they really move a stock, and what does the evidence say?** It builds Idea ④ (who holds the risk and how its hedging feeds back) with Idea ① in the background (every product here is a shape: a long call, a capped covered call).

## @intuition
The US options market has grown at a remarkable pace: about 11.1 billion contracts cleared in 2023, 12.2 billion in 2024 and about 15.2 billion in 2025, the sixth record year in a row; Cboe said in July 2026 that the year was on pace for well above 18 billion, against roughly 4 billion a decade earlier. Much of that growth came from individuals trading on phone apps, often with no commission on the trade itself. In February 2026 a Cboe executive estimated that retail brokers' flow is about **half of all US options volume** — an estimate, not an audited number.

Retail investors do not all do the same thing. Two tides matter most for dealers:

- **Buyers of volatility.** Traders who buy short-dated, out-of-the-money calls (and puts) — cheap tickets with a big payoff if the stock moves. Dealers sell them those options and end up **short gamma**.
- **Sellers of volatility.** Investors who write covered calls themselves, like Kai, or buy funds that sell options every month for income. Dealers buy those options and end up **long gamma**.

<figure>
<svg viewBox="0 0 680 230" role="img" aria-label="Two retail tides pushing the dealers' gamma in opposite directions">
<defs><marker id="retail-flows-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="12" y="30" width="190" height="70" rx="8" class="fx-bad"/>
<text x="107" y="56" text-anchor="middle" class="fx-t-b">Speculators</text>
<text x="107" y="76" text-anchor="middle" class="fx-t-sm">buy cheap short-dated calls</text>
<text x="107" y="92" text-anchor="middle" class="fx-t-sm">demand volatility</text>
<rect x="478" y="30" width="190" height="70" rx="8" class="fx-ok"/>
<text x="573" y="56" text-anchor="middle" class="fx-t-b">Income investors</text>
<text x="573" y="76" text-anchor="middle" class="fx-t-sm">covered calls, income funds</text>
<text x="573" y="92" text-anchor="middle" class="fx-t-sm">supply volatility</text>
<rect x="240" y="120" width="200" height="80" rx="10" class="fx-hl"/>
<text x="340" y="146" text-anchor="middle" class="fx-t-b">Dealers' net gamma</text>
<text x="340" y="166" text-anchor="middle" class="fx-t-sm">= the sum of both tides</text>
<text x="340" y="186" text-anchor="middle" class="fx-t-sm">(plus everyone else)</text>
<line x1="150" y1="102" x2="250" y2="140" class="fx-line-bad" marker-end="url(#retail-flows-ah)"/>
<line x1="530" y1="102" x2="430" y2="140" class="fx-line-ok" marker-end="url(#retail-flows-ah)"/>
<text x="60" y="140" class="fx-t-bad">dealers sell calls:</text>
<text x="60" y="158" class="fx-t-bad">short gamma, accelerator</text>
<text x="620" y="140" text-anchor="end" class="fx-t-ok">dealers buy calls:</text>
<text x="620" y="158" text-anchor="end" class="fx-t-ok">long gamma, brake</text>
<text x="340" y="222" text-anchor="middle" class="fx-t-sm">which tide dominates differs by stock, by index and over time</text>
</svg>
<figcaption>Figure 1 · Retail flows push the dealers' gamma in opposite directions. Where speculative call buying dominates (some single stocks in a frenzy), dealers hedge with the move; where systematic call selling dominates (broad indexes, popular income funds), they hedge against it.</figcaption>
</figure>

The **gamma squeeze** story is about the first tide overwhelming the market. Customers pile into calls; dealers, short those calls, buy stock to hedge; the stock rises; the calls' deltas rise; dealers buy more; and so on. It is a coherent mechanism — the accelerator from [[dealer-gamma]] — and it became the standard explanation of GameStop's rise in January 2021. But when the SEC's staff examined that episode, they **did not find evidence of a gamma squeeze**. So we will treat the squeeze as what it is: a hypothesis whose strength depends on numbers.

We'll take it in five parts:

- **① The retail boom and what it trades**
- **② The squeeze mechanism, in shares**
- **③ GameStop, January 2021: the story and the SEC staff's finding**
- **④ The other tide: option-income funds and overwriting**
- **⑤ Two tides in one dealer book, and retail outcomes**

## @mechanics
### ① The retail boom and what it trades

Several changes arrived together around 2019–2021: commission-free trading at large brokers (options usually still carry a per-contract fee), easy mobile apps, cheap weekly expiries, and in 2020 a wave of new accounts. Brokers can offer zero commissions partly because wholesalers pay for retail orders — the payment for order flow discussed in [[market-makers]].

What did new traders buy? Mostly **cheap, short-dated, out-of-the-money options**, especially calls on popular stocks. The attraction is the shape from [[linear-vs-convex]]: a small premium, a capped loss, a large payoff in a big move. Academic work on retail options trading in this period (for example Bryzgalova, Pavlova and Sikorskaya, 2023) found that retail investors concentrated in exactly these contracts and, in aggregate, lost money, with bid-ask spreads a large part of the cost. The same lottery preference appears in [[trading-psychology]].

Nobody observes “retail” directly. Estimates come from which brokers routed an order, from order sizes and from account types, so percentages differ by source and method; treat every retail share in this lesson as an estimate with a date. Since 2022, a large share of retail activity has moved to same-day SPX options: Cboe estimates retail at about 50–60% of SPX 0DTE volume ([[zero-dte]]).

### ② The squeeze mechanism, in shares

Suppose customers buy **20,000 contracts** of XYZ's 30-day 110 call at about $0.14 each ($0.138 before rounding) — \(0.138 \times 100 \times 20{,}000 \approx \$276{,}000\) of premium, spread across many accounts. Dealers sell them and hedge. Their required stock position is:

$$
H = \Delta \times \text{OI} \times 100
$$

where \(\Delta\) is the call's delta at the current price, \(\text{OI}\) the open interest the dealers are short, and 100 the multiplier. As XYZ rises, delta rises, so the hedge grows at a rate set by gamma:

$$
\frac{\dd H}{\dd S} = \Gamma \times \text{OI} \times 100
$$

— the extra shares dealers must buy for each $1 rise. In the notation of [[dealer-gamma]] this is the size of the dealers' gamma \(G\), which is negative here because they are short the calls, so we write it \(|G|\).

Here is the hedge along the way up (30-day 110 calls, 20,000 contracts short by dealers, \(\sigma = 20\%\)):

| XYZ | Delta | Dealers' hedge \(H\) | Extra shares per +$1 |
|---|---|---|---|
| 100 | 0.057 | 115,000 | 40,000 |
| 103 | 0.144 | 289,000 | 77,000 |
| 105 | 0.234 | 468,000 | 102,000 |
| 108 | 0.407 | 815,000 | 125,000 |
| 110 | 0.534 | 1,069,000 | 126,000 |

> [!EXAMPLE] A quarter of a million dollars of calls, a million shares of hedging
> If XYZ climbs from 100 to 110, dealers buy about
> $$
> 1{,}069{,}000 - 115{,}000 \approx 950{,}000 \text{ shares}
> $$
> — roughly $100 million of stock — because customers spent about $276,000 on calls. That leverage is what makes the squeeze story so appealing.

Whether this becomes a feedback loop depends on the ratio from [[dealer-gamma]]: the multiplier \(1/(1 + G/D)\), which for short-gamma dealers (\(G < 0\)) becomes \(1/(1 - |G|/D)\), where \(D\) is the number of shares it takes to move the stock $1. For a large, liquid stock, 100,000 shares per dollar is small against depth, and the loop is weak. For a smaller stock with thin trading and heavy call buying, \(|G|/D\) can approach 1, and each dollar of rise can pull in the buying that causes the next one. Time also matters: with 10 days left the same 20,000 calls at a price of 110 need 219,000 extra shares per dollar, not 126,000.

<figure>
<svg viewBox="0 0 680 260" role="img" aria-label="The hypothesised gamma-squeeze loop and what can break it">
<defs><marker id="retail-flows-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="30" y="24" width="180" height="50" rx="8" class="fx-box"/>
<text x="120" y="46" text-anchor="middle" class="fx-t-b">customers buy calls</text>
<text x="120" y="64" text-anchor="middle" class="fx-t-sm">dealers end up short them</text>
<rect x="250" y="24" width="190" height="50" rx="8" class="fx-box2"/>
<text x="345" y="46" text-anchor="middle" class="fx-t-b">dealers buy stock</text>
<text x="345" y="64" text-anchor="middle" class="fx-t-sm">H = Δ × OI × 100</text>
<rect x="250" y="130" width="190" height="50" rx="8" class="fx-bad"/>
<text x="345" y="152" text-anchor="middle" class="fx-t-b">price rises</text>
<text x="345" y="170" text-anchor="middle" class="fx-t-sm">by (their buying) ÷ D</text>
<rect x="30" y="130" width="180" height="50" rx="8" class="fx-box2"/>
<text x="120" y="152" text-anchor="middle" class="fx-t-b">delta rises</text>
<text x="120" y="170" text-anchor="middle" class="fx-t-sm">+Γ × OI × 100 per $1</text>
<line x1="212" y1="49" x2="246" y2="49" class="fx-line" marker-end="url(#retail-flows-ah2)"/>
<line x1="345" y1="76" x2="345" y2="126" class="fx-line-bad" marker-end="url(#retail-flows-ah2)"/>
<line x1="248" y1="155" x2="214" y2="155" class="fx-line" marker-end="url(#retail-flows-ah2)"/>
<path d="M120,128 C120,100 230,100 262,78" class="fx-line-bad" marker-end="url(#retail-flows-ah2)"/>
<text x="178" y="93" text-anchor="middle" class="fx-t-bad">buy more</text>
<rect x="460" y="24" width="210" height="156" rx="8" class="fx-ok"/>
<text x="565" y="46" text-anchor="middle" class="fx-t-b">what breaks the loop</text>
<text x="472" y="70" class="fx-t-sm">· deep liquidity (large D)</text>
<text x="472" y="90" class="fx-t-sm">· dealers hedge with options</text>
<text x="472" y="110" class="fx-t-sm">· calls far from the price</text>
<text x="472" y="130" class="fx-t-sm">· customers sell calls back</text>
<text x="472" y="150" class="fx-t-sm">· expiry: the gamma vanishes</text>
<text x="472" y="170" class="fx-t-sm">· delta near 1: nothing left to buy</text>
<text x="340" y="220" text-anchor="middle" class="fx-t">a coherent mechanism, not a guaranteed one</text>
<text x="340" y="242" text-anchor="middle" class="fx-t-sm">SEC staff (Oct 2021): no evidence of a gamma squeeze in GameStop in January 2021</text>
</svg>
<figcaption>Figure 2 · The squeeze loop as it is usually told, with the forces that can stop it. The loop only runs if dealers are really short the calls, really hedge with stock, and their buying is large relative to the stock's depth.</figcaption>
</figure>

> [!THINK] If the mechanism is real, why wouldn't every burst of call buying end in a squeeze?
> ---
> Because every link must hold at once. Dealers may be long other options on the same stock that offset the calls they sold, or hedge with options rather than shares. The extra buying may be small next to normal volume, so \(|G|/D\) stays far from 1. Customers may sell their calls back into the rally, which shrinks the open interest dealers are short. And once the calls are deep in the money, delta is near 1 and there is nothing left to buy. The main demo at the end of the lesson lets you turn several of these dials.

### ③ GameStop, January 2021: the story and the SEC staff's finding

> [!HISTORY] January 2021
> GameStop's shares rose many times over in a few weeks, amid heavy retail enthusiasm, very high short interest and record options activity. Commentators widely described the move as a **gamma squeeze**, often combined with a short squeeze.
> The SEC staff's report on early-2021 market conditions (October 18, 2021) reached a different conclusion: it attributed the sustained rally to buying driven by **positive sentiment**, and the staff **did not find evidence of a gamma squeeze** in GameStop in January 2021. An academic committee (Mitts and co-authors, 2022) later disputed parts of the staff's analysis.

What should a careful reader take from this? Three things.

1. **The mechanism can be real without being the cause.** A squeeze requires dealers to be short a large amount of gamma relative to the stock's liquidity at the right moment. Whether that was true is an empirical question, and the regulator with access to the data concluded it was not the main driver.
2. **Stories spread faster than data.** “Gamma squeeze” became the default label because the mechanism is easy to explain, not because positions were measured. The same caution applies to GEX charts ([[dealer-gamma]]).
3. **The debate is open at the margin.** Researchers still argue about how much options hedging contributed to meme-stock moves. The honest phrasing is: *widely described as a gamma squeeze; the SEC staff did not find evidence of one.*

### ④ The other tide: option-income funds and overwriting

The second tide is quieter and, by assets, much larger. **Derivative-income ETFs** hold stocks (or synthetic exposure) and sell options — usually calls — every week or month, paying the premiums out as distributions. The template is the Cboe S&P 500 BuyWrite Index (BXM), launched in 2002 with history back to 1986, which holds the S&P 500 and sells a one-month at-the-money call each month.

<figure>
<svg viewBox="0 0 640 220" role="img" aria-label="Assets in derivative-income ETFs, Morningstar category">
<line x1="60" y1="180" x2="600" y2="180" class="fx-axis"/>
<rect x="110" y="179" width="90" height="1" class="fx-fill-green"/>
<text x="155" y="170" text-anchor="middle" class="fx-t-ok">&lt; $1B</text>
<text x="155" y="198" text-anchor="middle" class="fx-t-sm">end of 2020</text>
<rect x="275" y="81.2" width="90" height="98.8" class="fx-fill-green"/>
<text x="320" y="72" text-anchor="middle" class="fx-t-ok">≈ $127B</text>
<text x="320" y="198" text-anchor="middle" class="fx-t-sm">2025</text>
<rect x="440" y="40" width="90" height="140" class="fx-fill-green"/>
<text x="485" y="31" text-anchor="middle" class="fx-t-ok">≈ $180B</text>
<text x="485" y="198" text-anchor="middle" class="fx-t-sm">mid-2026</text>
<text x="60" y="216" class="fx-t-sm">assets in US derivative-income ETFs (Morningstar category; definitions differ between sources)</text>
</svg>
<figcaption>Figure 3 · The income tide. Assets in Morningstar's derivative-income ETF category grew from under $1 billion at the end of 2020 to about $180 billion by mid-2026, with about $40 billion of net inflows in 2026 through July. The wider group of options-overlay and buffer funds exceeds $300 billion (mid-2026).</figcaption>
</figure>

> [!FACT] The largest funds, as of mid-to-late 2026
> JEPI (S&P 500-based, sells out-of-the-money calls through equity-linked notes) had about $44 billion; JEPQ (its Nasdaq-100 version) about $38–42 billion during 2026 — the two largest active ETFs in the US, as reported. QYLD, which sells at-the-money Nasdaq-100 calls each month, had net assets of $8.51 billion on September 25, 2026. The YieldMax family (61 single-stock option-income ETFs) totalled about $9.9 billion. Figures are from fund sponsors and data aggregators; this is not a recommendation of any fund.

Two points matter for this lesson.

**These funds supply volatility.** Every month they sell calls, and dealers buy them. That makes dealers **long gamma** on the underlying index, so their hedging leans against moves — the brake of [[dealer-gamma]]. A common argument is that systematic overwriting also cheapens upside calls relative to puts on the indexes these funds track. Banks' structured products, such as autocallable notes in which investors effectively sell downside protection, are often cited as another source of volatility supply, which banks then lay off in listed markets ([[exotic-options]]).

> [!KAI] Kai is part of the second tide
> When Kai sells the 30-day 105 call for $0.71, a dealer buys it. The dealer is now long a call with delta 0.222 and gamma 0.052, so it shorts about 22 shares to stay flat. If XYZ rises $1, the call's delta grows by about 0.052, and the dealer sells about \(0.052 \times 100 \approx 5\) more shares; if XYZ falls $1, it buys about 5 back. Five shares is nothing. Repeat the same trade across a fund that writes calls on billions of dollars of stock every month, and the dealers' hedging becomes a steady brake.

**Distribution yield is not total return.** A covered call's monthly result per share is:

$$
R_{\text{month}} = \frac{\min(S_T, K) - S_0 + c}{S_0}
$$

where \(S_0\) is the price when the call is sold, \(K\) its strike, \(c\) the premium and \(S_T\) the price at expiry. The premium is paid out; the upside above \(K\) is given away; the downside is kept in full.

> [!EXAMPLE] Three months of an at-the-money covered-call fund on XYZ
> Each month the fund sells the 30-day at-the-money call at 20% volatility (\(c = 2.45\%\) of the price) and pays it out. XYZ goes 100 → 110 → 99 → 99.
> - Month 1: XYZ +10%, but the call caps the fund at the strike: \(R = \dfrac{\min(110, 100) - 100 + 2.45}{100} = +2.45\%\). The $2.45 is paid out, and the fund's value stays at **100** while the stock is at 110.
> - Month 2: the fund's 100 of value now buys only \(100/110 = 0.909\) shares. It sells a new at-the-money call for another $2.45 (2.45% of 100). XYZ falls 10% to 99, and the fund's value drops to **90**.
> - Month 3: flat; the new call brings in 2.45% of 90, so the fund pays $2.21.
>
> Over three months XYZ lost 1%. The fund paid out $7.11 per unit — an annualized distribution rate near **29%** — but its net asset value fell from 100 to 90, a total of \(90 + 7.11 - 100 = -2.89\), or **−2.9%**, worse than the stock. The capped rally in month 1 was never recovered.

::demo[retail-flows-income-etf]

This does not make covered calls bad. They do best in flat or gently rising markets, earn the volatility risk premium when implied volatility exceeds realized ([[variance-risk-premium]], [[systematic-vol]]), and are exactly the trade Kai chose. The problem is only the label: a high distribution yield describes cash paid out, not wealth created.

### ⑤ Two tides in one dealer book, and retail outcomes

Put the tides together. In **broad indexes**, systematic call selling by income funds and overwriters is large and steady, while speculative demand is spread across many same-day contracts, much of it in limited-risk spreads. That is consistent with research finding dealers' net gamma in SPX same-day options positive on average ([[zero-dte]]). In **single stocks in a frenzy**, call buying can dominate and flip dealers short gamma, which is where squeeze stories come from — with the caveats of part ③.

For individual investors themselves, the evidence is sobering but specific. Buying cheap short-dated options has, in aggregate, tended to lose money, with spreads and the lottery-like shape doing much of the damage; income funds deliver what they promise (cash distributions) but not always what buyers expect (total return). Options remain useful tools for protection and income. The costs concentrate where the shape is misunderstood.

## @analogy
Think of a **bakery and its two kinds of regular customers**. The first kind buys raffle tickets at the counter: each ticket is cheap, and if a big number comes up the bakery owes a cake. The second kind sells the bakery flour every month on a fixed contract, happy with a steady payment, and agrees to deliver extra at the old price if flour prices jump.

The bakery (the dealer) sits in the middle and hedges. When raffle sales explode, it has to stockpile cakes' worth of ingredients in advance, and its own buying pushes up flour prices — the squeeze. When the flour contracts dominate, it has plenty of supply locked in and can calmly sell into any price spike — the brake. The town's flour price is quieter or wilder depending on which customers are busier.

The analogy also shows the GameStop lesson: a sudden jump in the price of flour looks like the bakery's stockpiling, but it may simply be that the whole town decided to bake at once. Where it breaks: the bakery's hedging is not optional, it is continuous, and the raffle tickets expire on a fixed date, after which the stockpiling reverses quickly.

## @misconceptions
- **“GameStop's January 2021 rally was proven to be a gamma squeeze.”** — It was widely described that way, but the SEC staff's October 2021 report did not find evidence of a gamma squeeze and pointed to buying driven by positive sentiment; academics have disputed parts of that analysis.
- **“Any heavy call buying forces dealers to push the stock up.”** — Only if dealers are net short the calls, hedge with stock, and their buying is large relative to the stock's depth. In deep, liquid stocks the effect is usually small.
- **“A fund with a 30% distribution yield earns 30% a year.”** — Distributions can come from option premium while the fund's value falls. Total return — distributions plus the change in net asset value — is what counts, and it can trail the underlying.
- **“Retail investors trade options only as a lottery.”** — Many use them to earn income on shares or to protect a portfolio. The two tides show that retail flow both demands and supplies volatility.
- **“Option-income funds make markets more fragile.”** — Their systematic call selling tends to leave dealers long gamma on the indexes involved, which dampens moves; the concern with any crowded strategy is what happens if it is unwound, not its everyday effect.

## @takeaways
- Retail brokers' flow is estimated (by Cboe, February 2026) at about half of US options volume, and it both buys volatility (short-dated calls) and sells it (covered calls, income funds).
- The squeeze mechanism is \(H = \Delta \times \text{OI} \times 100\) growing by \(\Gamma \times \text{OI} \times 100\) per $1; it can feed back only when that buying is large relative to the stock's depth.
- GameStop (January 2021) is widely described as a gamma squeeze, but the SEC staff did not find evidence of one; treat squeeze stories as hypotheses that need position data.
- Derivative-income ETFs grew from under $1 billion (2020) to about $180 billion (mid-2026); their call selling tends to leave dealers long gamma on the indexes they track.
- A distribution yield is cash paid out, not return earned: capped upside and full downside can shrink net asset value while the yield looks high.

## @quiz
1. Customers buy 20,000 contracts of XYZ's 30-day 110 call (delta 0.057). Dealers are short them and delta-hedged. What stock position do the dealers hold?
   - [ ] About 2,000,000 shares long, one share per share the calls control
   - [ ] About 115,000 shares short
   - [ ] About 20,000 shares long, one share per contract
   - [x] About 115,000 shares long
   > \(H = 0.057 \times 20{,}000 \times 100 \approx 115{,}000\). Short calls lose when the stock rises, so the hedge is long stock. The full 2,000,000 shares would only be needed if delta were 1.
2. What did the SEC staff's October 2021 report conclude about GameStop's rally in January 2021?
   - [ ] That it was caused mainly by dealers' hedging of short call positions
   - [x] That the staff did not find evidence of a gamma squeeze, and that buying driven by positive sentiment sustained the rally
   - [ ] That options trading in the stock was halted during the rally
   - [ ] That the rally was caused by a change in payment for order flow rules
   > The report did not find evidence of a gamma squeeze; academics later disputed parts of its analysis. The accurate phrasing is “widely described as a gamma squeeze; the SEC staff did not find evidence of one.”
3. An income ETF advertises a 30% annual distribution yield from selling at-the-money calls. Which statement is correct?
   - [x] The distributions can come from option premium while the fund's net asset value falls, so its total return can trail the underlying
   - [ ] The fund must earn at least 30% a year to pay that distribution
   - [ ] Selling at-the-money calls removes the downside risk of the shares
   - [ ] A higher distribution yield always means a higher total return
   > A covered call keeps the full downside and gives away the upside above the strike. In the three-month XYZ example the fund paid out about 29% annualized while its value fell from 100 to 90 and its total return (−2.9%) trailed the stock (−1%).
4. Why might heavy, systematic call selling by income funds tend to calm the index they track?
   - [ ] Because the funds buy back the index whenever it falls
   - [ ] Because call selling lowers interest rates
   - [x] Because dealers who buy those calls are long gamma, so their hedging sells rallies and buys dips
   - [ ] Because the calls expire worthless every month
   > Dealers on the other side of systematic call selling are long gamma; their delta hedging leans against moves — the brake from the dealer-gamma lesson. It dampens volatility; it does not set direction.
5. When is a gamma squeeze most plausible?
   - [ ] When customers sell large amounts of calls on a very liquid index
   - [ ] When the calls are far out of the money with many months to expiry
   - [ ] When dealers are long the calls customers want
   - [x] When customers have bought near-the-money calls close to expiry in large size relative to the stock's normal liquidity
   > Gamma is largest near the money and near expiry, and the feedback multiplier \(1/(1 - |G|/D)\) is large only when dealers' short gamma is big relative to depth \(D\). Customer call selling or dealer-long calls produce the opposite effect.

## @further
- [SEC staff report on equity and options market structure conditions in early 2021](https://www.sec.gov/files/staff-report-equity-options-market-struction-conditions-early-2021.pdf) — the regulator's analysis of the meme-stock episode, including its gamma-squeeze finding.
- [Mitts et al. (2022), response to the SEC staff report](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4030179) — the academic committee that disputed parts of the staff's analysis.
- [Cboe, BXM methodology](https://cdn.cboe.com/api/global/us_indices/governance/BXM_Methodology.pdf) — the rules of the benchmark buy-write index.
- [Bondarenko (2019), historical performance of put-writing strategies](https://cdn.cboe.com/resources/education/research_publications/PutWriteCBOE19_v14_by_Prof_Oleg_Bondarenko_as_of_June_14.pdf) — the long record of systematically selling index options.
- [Cboe, The State of the Options Industry 2025](https://www.cboe.com/insights/posts/the-state-of-the-options-industry-2025) — volume growth and who is trading.

## @next
Retail options now run around the clock in one market: crypto. Bitcoin options trade seven days a week, are often settled in the coin itself, and since 2024 also come wrapped in an ETF. How do you price an option whose payoff is paid in bitcoin, and what changes when the market never closes? [[crypto-options]] answers that.
