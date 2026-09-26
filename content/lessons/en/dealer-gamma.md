---
id: dealer-gamma
prereqs: gamma, higher-order-greeks, delta-hedging, butterfly, market-makers
demo: dealer-gamma
---

# Dealer Gamma: GEX, Pinning & OPEX

## @hook
One dealer's hedge is too small to notice. Add up the gamma of every dealer in a stock and you get a number traders call GEX. When it is positive, dealer hedging sells rallies and buys dips, like a brake; when it is negative, it chases the move, like an accelerator. The catch: nobody outside the dealers knows their positions, so GEX is an estimate resting on an assumption.

## @bridge
In [[market-makers]] one dealer hedged Kai's 105 call with 22 shares. [[gamma]] showed that gamma is how many shares a hedge must change for each $1 move, and [[higher-order-greeks]] introduced vanna and charm, the ways delta drifts with volatility and time. This lesson adds all dealers together and asks: **can their combined hedging change how the stock itself moves, and how would we know?** It builds Idea ④ — who holds the risk and how its hedging feeds back into the market.

## @intuition
Start with one position and follow the hedge.

Customers who write covered calls — like Kai — sell calls, and dealers buy them. Say dealers end up **long 1,000 contracts** of XYZ's 30-day 100 call, delta-hedged. Each call's gamma is 0.069, so the dealers' book gains \(0.069 \times 1{,}000 \times 100 \approx 6{,}900\) shares of delta for every $1 XYZ rises.

- XYZ rises $1: the dealers are now long about 6,900 shares too many, so they **sell** 6,900 shares — into the rally.
- XYZ falls $1: they are 6,900 shares short of neutral, so they **buy** — into the dip.

Their hedging leans against every move. That is a **brake**.

Now flip the customers. If customers had **bought** those 1,000 calls (a speculative frenzy), dealers would be short them. After a $1 rise the dealers' short calls lose delta and they must **buy** 6,900 shares — into the rally; after a fall they **sell** into the dip. Now the hedging pushes in the same direction as the move. That is an **accelerator**.

<figure>
<svg viewBox="0 0 680 240" role="img" aria-label="Two hedging feedback loops: long gamma dampens, short gamma amplifies">
<defs><marker id="dealer-gamma-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<text x="170" y="20" text-anchor="middle" class="fx-t-ok">Dealers long gamma: a brake</text>
<rect x="85" y="34" width="170" height="40" rx="8" class="fx-box"/>
<text x="170" y="59" text-anchor="middle" class="fx-t-b">XYZ rises $1</text>
<rect x="190" y="138" width="140" height="50" rx="8" class="fx-box2"/>
<text x="260" y="160" text-anchor="middle" class="fx-t">dealer delta</text>
<text x="260" y="178" text-anchor="middle" class="fx-t-sm">up by G shares</text>
<rect x="12" y="138" width="140" height="50" rx="8" class="fx-ok"/>
<text x="82" y="160" text-anchor="middle" class="fx-t">dealer SELLS</text>
<text x="82" y="178" text-anchor="middle" class="fx-t-sm">G shares</text>
<line x1="236" y1="76" x2="262" y2="134" class="fx-line" marker-end="url(#dealer-gamma-ah)"/>
<line x1="188" y1="163" x2="156" y2="163" class="fx-line" marker-end="url(#dealer-gamma-ah)"/>
<line x1="122" y1="136" x2="140" y2="78" class="fx-line-ok" marker-end="url(#dealer-gamma-ah)"/>
<text x="14" y="100" class="fx-t-ok">pushes price</text>
<text x="14" y="116" class="fx-t-ok">back down</text>
<text x="170" y="218" text-anchor="middle" class="fx-t-sm">negative feedback: moves shrink</text>
<line x1="340" y1="10" x2="340" y2="230" class="fx-line-muted fx-dash"/>
<text x="510" y="20" text-anchor="middle" class="fx-t-bad">Dealers short gamma: an accelerator</text>
<rect x="425" y="34" width="170" height="40" rx="8" class="fx-box"/>
<text x="510" y="59" text-anchor="middle" class="fx-t-b">XYZ rises $1</text>
<rect x="530" y="138" width="140" height="50" rx="8" class="fx-box2"/>
<text x="600" y="160" text-anchor="middle" class="fx-t">dealer delta</text>
<text x="600" y="178" text-anchor="middle" class="fx-t-sm">down by G shares</text>
<rect x="352" y="138" width="140" height="50" rx="8" class="fx-bad"/>
<text x="422" y="160" text-anchor="middle" class="fx-t">dealer BUYS</text>
<text x="422" y="178" text-anchor="middle" class="fx-t-sm">G shares</text>
<line x1="576" y1="76" x2="602" y2="134" class="fx-line" marker-end="url(#dealer-gamma-ah)"/>
<line x1="528" y1="163" x2="496" y2="163" class="fx-line" marker-end="url(#dealer-gamma-ah)"/>
<line x1="462" y1="136" x2="480" y2="78" class="fx-line-bad" marker-end="url(#dealer-gamma-ah)"/>
<text x="354" y="100" class="fx-t-bad">pushes price</text>
<text x="354" y="116" class="fx-t-bad">further up</text>
<text x="510" y="218" text-anchor="middle" class="fx-t-sm">positive feedback: moves grow</text>
</svg>
<figcaption>Figure 1 · The same hedging rule — keep delta at zero — creates opposite loops. Long gamma turns every move into a trade against the move; short gamma turns it into a trade with the move. G is the dealers' gamma in shares per $1.</figcaption>
</figure>

Does 6,900 shares matter? That depends on two things the rest of the lesson makes precise: **how big the dealers' gamma is compared with the market's depth**, and **how close the options are to expiry**, since gamma grows sharply as expiry nears. The same 100-strike calls with one day left have a gamma of 0.381 instead of 0.069, five and a half times more hedging per dollar.

And one uncomfortable fact frames everything: **public data shows how many contracts are open at each strike (the open interest), but not who is long and who is short.** Every gamma-exposure number you see online is an estimate that assumes an answer.

We'll take it in five parts:

- **① From one hedge to GEX: the formula and its sign convention**
- **② Brake or accelerator: a feedback multiplier and the gamma flip**
- **③ Pinning and OPEX: gamma piles up at expiry**
- **④ Charm and vanna: hedging flows without a price move**
- **⑤ What GEX cannot tell you: limits, evidence and the 2026 picture**

## @mechanics
### ① From one hedge to GEX: the formula and its sign convention

Gamma exposure (GEX) converts every open option into the dollar amount of stock dealers would have to trade for a 1% move in the underlying:

$$
\text{GEX} = \sum_i s_i\,\Gamma_i \times \text{OI}_i \times 100 \times S^2 \times 1\%
$$

- \(\Gamma_i\): the gamma per share of option \(i\) (Black-Scholes, at its implied volatility)
- \(\text{OI}_i\): open interest, the number of contracts outstanding at that strike and expiry
- \(100\): the contract multiplier
- \(S^2 \times 1\%\): turns gamma (shares per $1) into dollars of stock per 1% move: a 1% move is \(0.01S\) dollars, and each share is worth \(S\)
- \(s_i\): **the sign — the assumption.** +1 if dealers are long the option, −1 if short. The common vendor convention sets \(s = +1\) for calls and \(s = -1\) for puts, on the story that customers mostly sell calls (overwriting) and buy puts (protection).

> [!EXAMPLE] One strike, then a whole chain
> Dealers long 1,000 contracts of the 30-day 100 call at \(S = 100\):
> $$
> 0.0693 \times 1{,}000 \times 100 \times 100^2 \times 0.01 \approx \$693{,}000 \text{ per } 1\% \text{ move}
> $$
> So a 1% rise in XYZ ($1) makes the dealers sell about $693,000 of stock, which is the 6,930 shares from the intuition.
> Now an illustrative XYZ chain, 30 days out, where the convention happens to be right: dealers long 20,000 / 40,000 / 30,000 calls at 100 / 105 / 110 and short 15,000 / 40,000 / 30,000 puts at 100 / 95 / 90. Summing every strike at \(S = 100\) gives **GEX ≈ +$9.8 million per 1% move**: the call gamma slightly outweighs the put gamma at this price.

GEX is quoted in different units by different sources (per 1% move, per $1, per point of an index), so compare numbers only within one source.

### ② Brake or accelerator: a feedback multiplier and the gamma flip

How much does dealer hedging change a move? Here is a deliberately simple model. Let \(G\) be the dealers' total gamma in shares per $1 (positive when they are long gamma), and let \(D\) be the market's depth: the number of shares that must be traded to move the price by $1. A shock \(\varepsilon\) from ordinary buyers and sellers makes the dealers trade \(-G\,\Delta S\) shares, which moves the price by \(-G\,\Delta S / D\). Solving \(\Delta S = \varepsilon - G\,\Delta S / D\):

$$
\Delta S = \frac{\varepsilon}{1 + G/D}
$$

- \(\varepsilon\): the move that would have happened without dealer hedging
- \(G/D\): dealer hedging as a share of the market's depth
- \(1/(1 + G/D)\): the multiplier. Below 1 when \(G > 0\) (brake), above 1 when \(G < 0\) (accelerator)

> [!EXAMPLE] The same shock, two dealer books
> On the last day before expiry, 50,000 contracts of the 100-strike call are open, and XYZ sits at 100. The 1-day gamma is 0.381, so \(|G| = 0.381 \times 50{,}000 \times 100 \approx 1.9\) million shares per $1. Take an illustrative depth of \(D = 5\) million shares per $1.
> $$
> \text{dealers long: } \frac{1}{1 + 0.381} = 0.72, \qquad \text{dealers short: } \frac{1}{1 - 0.381} = 1.62
> $$
> A $1 shock becomes a $0.72 move if dealers are long this gamma and a $1.62 move if they are short. The 1,000 contracts of 30-day calls from the intuition give \(G/D \approx 6{,}900 / 5{,}000{,}000 = 0.0014\): a 0.1% effect, invisible. **Size relative to depth, and time to expiry, decide whether dealer gamma matters.**

The model is a cartoon — depth is not constant, dealers do not hedge instantly, and other traders react too — but it captures the logic every GEX story relies on.

Because calls and puts sit at different strikes, a chain's GEX changes sign as the price moves. In our illustrative chain the put gamma at 95 and 90 dominates once XYZ falls toward those strikes. The price where the total crosses zero is called the **gamma flip**.

<figure>
<svg viewBox="0 0 680 250" role="img" aria-label="GEX of the illustrative XYZ chain against spot, with the gamma flip">
<polygon points="60,130 60.0,161.7 69.3,165.7 78.7,169.8 88.0,174.0 97.3,178.2 106.7,182.4 116.0,186.3 125.3,190.0 134.7,193.4 144.0,196.5 153.3,199.0 162.7,200.9 172.0,202.3 181.3,203.0 190.7,202.9 200.0,202.1 209.3,200.5 218.7,198.1 228.0,194.8 237.3,190.8 246.7,186.1 256.0,180.6 265.3,174.4 274.7,167.6 284.0,160.4 293.3,152.6 302.7,144.5 312.0,136.1 318.7,130" class="fx-area-bad"/>
<polygon points="318.7,130 321.3,127.6 330.7,119.0 340.0,110.5 349.3,102.0 358.7,93.8 368.0,85.9 377.3,78.4 386.7,71.4 396.0,64.9 405.3,59.0 414.7,53.7 424.0,49.1 433.3,45.2 442.7,42.1 452.0,39.6 461.3,37.9 470.7,36.9 480.0,36.5 489.3,36.8 498.7,37.7 508.0,39.2 517.3,41.2 526.7,43.6 536.0,46.4 545.3,49.6 554.7,53.1 564.0,56.8 573.3,60.7 582.7,64.7 592.0,68.7 601.3,72.8 610.7,76.9 620.0,80.9 620,130" class="fx-area-ok"/>
<polyline points="60.0,161.7 69.3,165.7 78.7,169.8 88.0,174.0 97.3,178.2 106.7,182.4 116.0,186.3 125.3,190.0 134.7,193.4 144.0,196.5 153.3,199.0 162.7,200.9 172.0,202.3 181.3,203.0 190.7,202.9 200.0,202.1 209.3,200.5 218.7,198.1 228.0,194.8 237.3,190.8 246.7,186.1 256.0,180.6 265.3,174.4 274.7,167.6 284.0,160.4 293.3,152.6 302.7,144.5 312.0,136.1 321.3,127.6 330.7,119.0 340.0,110.5 349.3,102.0 358.7,93.8 368.0,85.9 377.3,78.4 386.7,71.4 396.0,64.9 405.3,59.0 414.7,53.7 424.0,49.1 433.3,45.2 442.7,42.1 452.0,39.6 461.3,37.9 470.7,36.9 480.0,36.5 489.3,36.8 498.7,37.7 508.0,39.2 517.3,41.2 526.7,43.6 536.0,46.4 545.3,49.6 554.7,53.1 564.0,56.8 573.3,60.7 582.7,64.7 592.0,68.7 601.3,72.8 610.7,76.9 620.0,80.9" class="fx-line-thick"/>
<line x1="60" y1="130" x2="630" y2="130" class="fx-axis"/>
<line x1="60" y1="24" x2="60" y2="216" class="fx-axis"/>
<text x="54" y="134" text-anchor="end" class="fx-t-sm">0</text>
<text x="68" y="32" class="fx-t-sm">GEX ($ per 1% move)</text>
<line x1="318.7" y1="24" x2="318.7" y2="216" class="fx-line fx-dash"/>
<line x1="340" y1="100" x2="340" y2="216" class="fx-line-muted fx-dash"/>
<text x="312" y="20" text-anchor="end" class="fx-t-b">gamma flip ≈ 98.9</text>
<text x="346" y="210" class="fx-t-sm">spot 100</text>
<text x="470" y="100" text-anchor="middle" class="fx-t-ok">brake zone (GEX &gt; 0)</text>
<text x="470" y="118" text-anchor="middle" class="fx-t-sm">peak ≈ +$47M per 1% near 107</text>
<text x="170" y="100" text-anchor="middle" class="fx-t-bad">accelerator zone (GEX &lt; 0)</text>
<text x="170" y="228" text-anchor="middle" class="fx-t-sm">trough ≈ −$36M per 1% near 92</text>
<text x="60" y="245" class="fx-t-sm">85</text>
<text x="200" y="245" text-anchor="middle" class="fx-t-sm">92.5</text>
<text x="340" y="245" text-anchor="middle" class="fx-t-sm">100</text>
<text x="480" y="245" text-anchor="middle" class="fx-t-sm">107.5</text>
<text x="620" y="245" text-anchor="end" class="fx-t-sm">115</text>
<text x="628" y="148" text-anchor="end" class="fx-t-sm">XYZ price</text>
</svg>
<figcaption>Figure 2 · GEX of the illustrative XYZ chain (30 days to expiry) as a function of the stock price. Above about 98.9 the dealers' long calls dominate and their hedging dampens moves; below it their short puts at 95 and 90 dominate and hedging amplifies moves. XYZ at 100 sits only 1% above the flip.</figcaption>
</figure>

::demo[dealer-gamma-flip]

This is why traders say “below the flip, volatility expands.” It is a coherent mechanism. Whether it is the *cause* of higher volatility below the flip is harder: prices fall toward put strikes precisely when fear is rising, and fear raises volatility on its own.

### ③ Pinning and OPEX: gamma piles up at expiry

Gamma is proportional to \(1/\sqrt{T}\) near the money. XYZ's 100 call has a gamma of 0.069 with 30 days left and 0.381 with one day left. As expiry approaches, every at-the-money strike's hedging flow grows, and the gamma of options further away collapses to almost nothing. By the last day, the dealer book's gamma is concentrated on the few strikes right around the price.

If dealers are **long** a large block at one strike, their hedging pulls the price toward that strike: above it they sell, below it they buy. Traders call this **pinning**, and it is why a heavily traded strike can act like a magnet into the close on expiration day. **OPEX** (options expiration) is shorthand for that day, traditionally the standard monthly expiry on the third Friday. After OPEX the expired gamma disappears at once, and the brake it provided goes with it — one reason traders watch for a change in market behaviour the week after a large expiry.

> [!DEEP] Is pinning real?
> The mechanism is standard; the evidence is older than the GEX vogue. A well-known study of US stocks (Ni, Pearson and Poteshman, 2005) found that closing prices of optionable stocks cluster near strike prices on expiration dates more than on other days, consistent with the hedge rebalancing described here. Pinning needs dealers to be net *long* gamma at that strike; when they are net short, the same arithmetic pushes the price *away* from the strike.

For SPX this is no longer a monthly event. Since 2022 SPX has had an expiration every trading day, and same-day options were about two-thirds of SPX volume in July 2026 — so the “OPEX” gamma is born and dies every session. That is the subject of [[zero-dte]]. The mirror image of a pin, the flow that pushes *away* from a strike, is the engine of the squeeze stories in [[retail-flows]] — including GameStop in January 2021, widely described as a gamma squeeze, although SEC staff did not find evidence of one. And a butterfly centred on a strike ([[butterfly]]) is the natural way to bet on a pin.

### ④ Charm and vanna: hedging flows without a price move

Delta also changes when the price does *not* move. **Charm** is the drift of delta as time passes; **vanna** is its change when implied volatility moves. Both force dealers to trade.

Take the protection side of our chain: customers bought 1,000 contracts of the 30-day 95 put from dealers. The dealers are short puts; a short put has positive delta, so they hedge by **shorting** stock. Hold XYZ at exactly 100 and let time pass:

| Days to expiry | 95-put delta | Dealers' short stock hedge (1,000 contracts) |
|---|---|---|
| 30 | −0.163 | 16,340 shares |
| 20 | −0.122 | 12,180 shares |
| 10 | −0.055 | 5,490 shares |
| 5 | −0.013 | 1,300 shares |
| 2 | −0.000 | about 20 shares |

As the out-of-the-money put's delta decays toward zero, the dealers **buy back about 16,300 shares** over the month without any price change: a steady bid into expiry. Per day, the flow is \(-\,n \times 100 \times \text{charm}\), with charm \(= \partial\Delta/\partial t\) from [[higher-order-greeks]].

**Vanna** does the same thing through volatility. If implied volatility drops from 20% to 15% with XYZ still at 100, the 95 put's delta falls from −0.163 to −0.098, and the dealers buy back about 6,500 shares at once. This is the mechanism behind a popular story — falling volatility after a scare lets dealers buy back hedges, which supports prices, which lowers volatility further. The mechanism is real. How large it is on any given day depends on positions nobody can see.

> [!THINK] The largest monthly expiry of the quarter has just passed, and most of the open interest was dealer-long gamma near the price. What would the brake-or-accelerator model predict for the following week?
> ---
> A weaker brake. The expired options took their gamma with them, so \(G/D\) falls and ordinary shocks pass through closer to one-for-one. This is the logic behind “volatility after OPEX”. It predicts larger moves, not a direction — and it assumes the expired positions really were dealer-long.

### ⑤ What GEX cannot tell you: limits, evidence and the 2026 picture

Everything above is mechanically correct. The controversy is about the **inputs**.

- **The sign is assumed.** Open interest shows contracts outstanding, not who holds them. In a call-buying frenzy, dealers are *short* calls, but the convention still counts them as long. Income funds that sell puts make dealers *long* puts, which the convention counts as short. The main demo shows a chain where the vendor-style GEX reads **+$28 million** while the dealers' true GEX is **−$47 million**.
- **Same-day trades never appear.** Open interest is counted at the end of each day. An option bought and sold within the session — the typical 0DTE trade — never shows up in it.
- **Dealers are not one hedger.** They net positions across strikes, expiries and related products, hedge with futures and other options, and do not all rehedge mechanically at the same moment.
- **Direction is not in the number.** Positive GEX suggests calmer, mean-reverting trading, negative GEX livelier trading. Neither says up or down.

> [!FACT] What the evidence says, as of September 2026
> - Dim, Eraker and Vilkov (SSRN working paper, November 2023) studied SPX 0DTE options and found that market makers' net gamma was on average **positive** and associated with **lower** subsequent intraday volatility; they did not find 0DTE gamma propagating past volatility.
> - Cboe's “0DTEs Decoded” (May 2025) estimated net market-maker gamma hedging in SPX 0DTE at **at most about 0.2%** of daily SPX liquidity. Cboe runs the market it describes, so treat this as an interested party's estimate.
> - On the other side, a Bank of England staff blog (December 2024) set out channels through which same-day options could add to fragility in stressed markets, and a J.P. Morgan strategist reportedly warned in early 2023 of a “Volmageddon 2.0”-style risk (the exact wording is unconfirmed). Neither shows that dealer gamma caused a particular sell-off; [[zero-dte]] weighs both sides.
> - Cboe's SPX and VIX options also trade almost around the clock on weekdays (Global Trading Hours, 8:15 p.m.–9:25 a.m. ET, record 224,000 contracts a day in July 2026), so hedging flows are not confined to the regular session.

> [!WARN] Reading a GEX chart responsibly
> Treat it as a hypothesis about **volatility character**, built on an assumption about **who holds what**. Check the sign convention and the units, remember that same-day positions are invisible, and never read it as a forecast of direction.

## @analogy
Think of sound in a lecture hall. A **thermostat** is negative feedback: when the room warms, it cools; when it cools, it heats; the temperature stays in a narrow band. Dealers who are long gamma are a thermostat for the price. A **microphone held too close to its speaker** is positive feedback: a small sound comes out louder, goes back into the microphone, comes out louder still, until it squeals. Dealers who are short gamma are that microphone.

The gamma flip is the distance at which the microphone starts to squeal. Move it a little closer to the speaker and a quiet room turns shrill, although nothing about the speaker changed. Pinning is a thermostat set hard at one temperature as expiry approaches: the pull toward the strike gets stronger just before it switches off.

Where the analogy breaks: in the hall you can see where the microphone is. In the market you cannot: GEX guesses the microphone's position from the number of cables on the floor (open interest) and an assumption about where they lead. And the size of the hall matters: the same feedback that makes a small room squeal is lost in a stadium, just as the same dealer gamma matters in a thin stock and vanishes in a deep one.

## @misconceptions
- **“Positive GEX means the market will go up.”** — GEX describes how dealer hedging reacts to moves (dampening or amplifying), not which way the next move goes. A market can drift steadily lower with positive GEX.
- **“GEX is an official number published by the exchange.”** — It is an estimate built from open interest plus an assumed sign for each option. Different vendors use different conventions and units and can disagree on the sign.
- **“Dealers are always short gamma, so they always amplify moves.”** — It depends on what customers do. Heavy call overwriting and put writing leave dealers long gamma; research on SPX 0DTE found market makers' net gamma positive on average.
- **“Dealer hedging always moves the market.”** — Only when the hedge is large relative to the market's depth. A month-dated position of 1,000 contracts barely registers; tens of thousands of at-the-money contracts in the last hours can.
- **“Crossing the gamma flip causes a selloff.”** — The flip level is itself an estimate, and prices fall toward put strikes precisely when fear is already rising. The flip can mark where hedging switches from brake to accelerator; it is not a trigger by itself.

## @takeaways
- GEX adds up \(\Gamma \times \text{OI} \times 100 \times S^2 \times 1\%\) across a chain with an assumed sign: the dollars of stock dealers would trade for a 1% move.
- Long-gamma dealers hedge against moves (a brake); short-gamma dealers hedge with moves (an accelerator). In a simple model a shock is multiplied by \(1/(1 + G/D)\).
- Hedging matters only when it is large relative to market depth, which happens mostly near expiry, when at-the-money gamma explodes — the source of pinning and of OPEX effects.
- Charm and vanna create hedging flows without any price move, as out-of-the-money deltas decay with time or falling volatility.
- The sign convention is the weak spot: open interest does not reveal who is long, same-day trades never appear in it, and GEX says nothing about direction.

## @quiz
1. Dealers are long 1,000 contracts of XYZ's 30-day 100 call (gamma 0.069), delta-hedged. XYZ rises by $1. What do their hedges do?
   - [ ] Buy about 6,900 shares, adding to the rally
   - [x] Sell about 6,900 shares, leaning against the rally
   - [ ] Sell about 100,000 shares, the full size of the position
   - [ ] Nothing, because the position was already delta-neutral
   > Long gamma means delta rises when the price rises: \(0.069 \times 1{,}000 \times 100 \approx 6{,}900\) extra shares of delta, which the dealers sell to get back to neutral. Delta-neutral at the start does not mean delta-neutral after the move; that is what gamma measures.
2. Using the GEX formula, what is the gamma exposure of 1,000 dealer-long contracts of a 100-strike option with gamma 0.069 when \(S = 100\)?
   - [ ] About $6,900 per 1% move
   - [ ] About $69,000 per 1% move
   - [ ] About $6.9 million per 1% move
   - [x] About $690,000 per 1% move
   > \(0.069 \times 1{,}000 \times 100 \times 100^2 \times 0.01 \approx 690{,}000\). The \(S^2 \times 1\%\) term converts shares per $1 into dollars of stock per 1% move; forgetting one factor of \(S\) gives $6,900.
3. In the model \(\Delta S = \varepsilon/(1 + G/D)\), dealers are short gamma with \(G = -1.9\) million shares per $1 and depth \(D = 5\) million. What does a $1 shock become?
   - [x] About $1.62
   - [ ] About $0.72
   - [ ] Exactly $1, because dealers hedge only after the move
   - [ ] About $2.90
   > \(1/(1 - 0.38) \approx 1.62\). The $0.72 answer is the long-gamma case, \(1/(1 + 0.38)\). The model assumes hedging and the shock happen together; if dealers hedged much later, the feedback would be weaker.
4. Customers are buying large amounts of out-of-the-money calls. A website's GEX, using the usual convention, shows a large positive number. What is the main problem?
   - [ ] None: calls always add positive gamma to dealers
   - [ ] GEX should be computed with delta, not gamma
   - [x] The convention assumes dealers are long calls, but here they are short them, so the true sign is probably negative
   - [ ] Open interest overstates call positions by a factor of 100
   > The convention's sign comes from an assumption about who holds the options. When customers buy calls, dealers are short them and hedge with the move — an accelerator the vendor number shows as a brake. The ×100 multiplier is already in the formula.
5. Dealers are short 1,000 contracts of the 30-day 95 put and hedged with short stock. If XYZ stays at exactly 100 until expiry, what do they do?
   - [ ] Sell more stock every day as the put approaches expiry
   - [x] Gradually buy back their short stock as the put's delta decays toward zero
   - [ ] Nothing, because the price did not move
   - [ ] Buy back everything only at the expiry close
   > This is charm: the out-of-the-money put's delta decays from −0.163 toward 0 as time passes, so the hedge shrinks from about 16,300 short shares toward zero and the dealers buy it back through the month, most of it in the last two weeks.

## @further
- [Dim, Eraker & Vilkov (2023), 0DTEs: Trading, Gamma Risk and Volatility Propagation](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4692190) — the working paper that measured market makers' net gamma in SPX 0DTE.
- [Cboe, 0DTEs Decoded: positioning trends and market impact](https://www.cboe.com/insights/posts/0-dt-es-decoded-positioning-trends-and-market-impact) — the exchange's estimate of hedging flows (an interested party).
- [Bank of England staff blog, Zero-day options and financial market vulnerability](https://bankunderground.co.uk/2024/12/04/zero-day-options-and-financial-market-vulnerability/) — the case for fragility channels.
- [SEC staff report on equity and options market structure conditions in early 2021](https://www.sec.gov/files/staff-report-equity-options-market-struction-conditions-early-2021.pdf) — a real-world test of the gamma-squeeze story, examined in the retail-flows lesson.

## @next
Gamma grows as \(1/\sqrt{T}\), and SPX now has options that expire every single day. What happens to an option's price, its Greeks and the dealers' hedging when there are only hours left? The next lesson puts a clock on the trading floor.
