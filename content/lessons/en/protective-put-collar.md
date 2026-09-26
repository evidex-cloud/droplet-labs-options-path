---
id: protective-put-collar
prereqs: put-option, why-options, covered-call, cash-secured-put
demo: protective-put-collar
---

# Protective Puts & Collars: Insuring a Position

## @hook
Before earnings, Kai buys a 30-day put with a 95 strike on the 100 shares of XYZ for $51. From that moment, however far XYZ falls, the shares can lose at most $551 over those 30 days. Sell a 105 call as well and the premium is not only paid for — Kai collects $20 net. That is a collar. **Insurance can be paid for in three currencies: premium, deductible and surrendered upside.**

## @bridge
[[put-option]] first treated the put as insurance, and [[why-options]] listed insurance as the first use of options. In [[cash-secured-put]] Kai was the one selling insurance; this lesson switches to buying it. Add the short call from [[covered-call]] and you get the collar. This lesson builds Idea ① (shape: fitting a floor and a ceiling onto the stock's straight line) and Idea ④ (risk: using the Greeks to see what the insurance really buys).

## @intuition
Kai's first wish is to “protect the shares.” XYZ reports earnings in three weeks; Kai doesn't want to sell, but worries about a big drop.

A **protective put** = 100 shares + one long put. Kai buys the 30-day 95 put for $0.51 per share, $51 per contract. At expiry:

- XYZ falls to 80: the stock loses 20, the put is worth 15: \(-20 + 15 - 0.51 = -5.51\);
- XYZ at 100: no loss on the stock, the premium is spent: \(-0.51\);
- XYZ rises to 120: the stock gains 20, the put expires: \(+19.49\).

However deep the fall, the loss is at most 5.51 per share. That 5.51 has two parts: a **deductible** of 5 (the stretch from 100 to 95 that the put doesn't cover) and the **premium** of 0.51.

Why 30 days? Earnings are three weeks away, so a 30-day put covers the report and the days after it. Why 95? It is Kai's compromise between how much the premium costs and how much of a fall Kai is willing to absorb: a drop of up to 5% is tolerable; only a deeper fall needs to be caught by insurance. Judging any policy comes down to three questions: **where is the floor, what does it cost, and how long does it last?**

If the premium feels expensive, Kai can also sell the 30-day 105 call for 0.71. The two offset, leaving a net credit of 0.20. This is a **collar**:

- XYZ falls to 80: \(-20 + 15 - 0.51 + 0.71 = -4.80\);
- XYZ at 100: \(+0.20\);
- XYZ rises to 120: the shares are called away at 105: \(+5.20\).

<figure>
<svg viewBox="0 0 660 320" role="img" aria-label="Shares only, protective put and collar at expiry"><defs><marker id="protective-put-collar-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs><polygon points="60,177.6 278.3,177.6 278.3,177.6 60,275" class="fx-area-ok"/><line x1="60" y1="250" x2="620" y2="250" class="fx-grid"/><text x="52" y="254" text-anchor="end" class="fx-t-sm">−20</text><line x1="60" y1="200" x2="620" y2="200" class="fx-grid"/><text x="52" y="204" text-anchor="end" class="fx-t-sm">−10</text><line x1="60" y1="100" x2="620" y2="100" class="fx-grid"/><text x="52" y="104" text-anchor="end" class="fx-t-sm">+10</text><line x1="60" y1="50" x2="620" y2="50" class="fx-grid"/><text x="52" y="54" text-anchor="end" class="fx-t-sm">+20</text><line x1="284" y1="22" x2="284" y2="278" class="fx-line-muted fx-dash"/><line x1="396" y1="22" x2="396" y2="278" class="fx-line-muted fx-dash"/><line x1="60" y1="150" x2="630" y2="150" class="fx-axis" marker-end="url(#protective-put-collar-ah)"/><text x="52" y="154" text-anchor="end" class="fx-t-sm">0</text><text x="60" y="296" text-anchor="middle" class="fx-t-sm">75</text><text x="172" y="296" text-anchor="middle" class="fx-t-sm">85</text><text x="284" y="296" text-anchor="middle" class="fx-t-sm">95</text><text x="396" y="296" text-anchor="middle" class="fx-t-sm">105</text><text x="508" y="296" text-anchor="middle" class="fx-t-sm">115</text><text x="620" y="296" text-anchor="middle" class="fx-t-sm">125</text><polyline points="60,275 340,150 620,25" class="fx-line-muted fx-dash"/><polyline points="60,177.6 284,177.6 620,27.6" class="fx-line-blue"/><polyline points="60,174 284,174 396,124 620,124" class="fx-line-thick"/><text x="560" y="28" text-anchor="end" class="fx-t-sm">shares only</text><text x="612" y="95" text-anchor="end" class="fx-t-blue">+ 95 put</text><text x="612" y="140" text-anchor="end" class="fx-t-b">collar +5.20</text><text x="70" y="166" class="fx-t-b">collar floor −4.80</text><text x="70" y="196" class="fx-t-blue">put floor −5.51</text><text x="76" y="218" class="fx-t-ok">loss blocked</text><text x="288" y="34" class="fx-t-sm">K = 95</text><text x="400" y="34" class="fx-t-sm">K = 105</text><text x="620" y="314" text-anchor="end" class="fx-t-sm">XYZ price at expiry; vertical axis = P&L per share (× 100 = per 100 shares)</text></svg>
<figcaption>Figure 1 · Shares only (dashed), protective put (violet) and collar (solid black) at expiry. The put installs a floor below 95 — the green triangle is the loss it blocks; the collar adds a ceiling above 105, trading upside for the premium. The collar's P&L is boxed in between −4.80 and +5.20.</figcaption>
</figure>

Before expiry, the three positions have very different Greek signatures:

| Position (per 100 shares) | Δ | Γ | Θ per day | ν per vol point |
|---|---|---|---|---|
| Shares only | +100 shares | 0 | 0 | 0 |
| + 95 put | +84 shares | +4.3 | −$2.17 | +$7.07 |
| Collar (+ 95 put − 105 call) | +61 shares | −0.9 | +$0.91 | −$1.46 |

The protective put **buys** convexity: Γ and ν positive, about $2 a day of “insurance rent.” The collar's Γ, Θ and ν are all close to zero — the put's convexity and the call's nearly cancel. **What the collar mainly does is cut delta from 100 shares to about 61 and clip both tails.**

> [!THINK] The collar brings in $20. Is it free insurance?
> Think first: what did Kai give up for this protection?
> ---
> Kai did pay — just not in cash. If XYZ rises to 115, the shares alone make 15, the protective put makes 14.49, and the collar makes only 5.20. The collar's premium is paid with the upside above 105. Under fair pricing the 0.71 received and the upside surrendered are worth the same — there is no free insurance, only a different currency.

We'll take it in five parts:

- **① The protective put: floor, deductible and premium**
- **② The collar: paying with upside; zero-cost collars and skew**
- **③ Before expiry: what insurance is worth in a sell-off**
- **④ The drag of permanent insurance**
- **⑤ When insurance is worth buying, and the alternatives**

## @mechanics
### ① The protective put: floor, deductible and premium

With a stock cost of \(S_0\), a long put with strike \(K_p\) and a premium \(p\) per share, every expiry price below \(K_p\) gives the same result:

$$
\Pi_{\text{floor}} = K_p - S_0 - p
$$

where \(K_p - S_0\) is the **deductible** (negative: the part of the fall you bear yourself) and \(p\) the **premium**. On the upside the breakeven is \(S_0 + p\): the stock must first earn back the premium before you make money.

> [!EXAMPLE] Kai's 95 put
> \(S_0 = 100\), \(K_p = 95\), \(p = 0.51\):
> $$
> \Pi_{\text{floor}} = 95 - 100 - 0.51 = -5.51 \;\Rightarrow\; -5.51 \times 100 = -\$551
> $$
> The upside breakeven is \(100 + 0.51 = 100.51\). The premium is \(0.51 / 100 = 0.51\%\) of the position, for 30 days of protection.

As with car insurance, **the higher the deductible, the lower the premium.** For 30-day puts at 20% implied volatility:

| Put strike | Premium | Deductible | Max loss (per share) | Upside breakeven |
|---|---|---|---|---|
| 100 (ATM) | 2.12 | 0 | 2.12 | 102.12 |
| 95 | 0.51 | 5 | 5.51 | 100.51 |
| 90 | 0.06 | 10 | 10.06 | 100.06 |

<figure>
<svg viewBox="0 0 680 272" role="img" aria-label="Max loss equals deductible plus premium"><text x="20" y="24" class="fx-t-b">30-day max loss (per share) = deductible + premium − call income</text><text x="240" y="64" text-anchor="end" class="fx-t">buy 100 put (ATM)</text><rect x="250" y="44" width="55.19890826392242" height="28" rx="4" class="fx-bad"/><text x="313.1989082639224" y="63" class="fx-t-b">= 2.12</text><text x="365.1989082639224" y="63" class="fx-t-sm">(premium 2.12)</text><text x="240" y="114" text-anchor="end" class="fx-t">buy 95 put</text><rect x="250" y="94" width="130" height="28" rx="4" class="fx-box2"/><text x="315" y="113" text-anchor="middle" class="fx-t-sm">deductible 5.00</text><rect x="380" y="94" width="13.230832091208278" height="28" rx="4" class="fx-bad"/><text x="401.2308320912083" y="113" class="fx-t-b">= 5.51</text><text x="453.2308320912083" y="113" class="fx-t-sm">(premium 0.51)</text><text x="240" y="164" text-anchor="end" class="fx-t">buy 90 put</text><rect x="250" y="144" width="260" height="28" rx="4" class="fx-box2"/><text x="380" y="163" text-anchor="middle" class="fx-t-sm">deductible 10.00</text><rect x="510" y="144" width="3" height="28" rx="4" class="fx-bad"/><text x="519.5812786618276" y="163" class="fx-t-b">= 10.06</text><text x="582" y="163" class="fx-t-sm">(premium 0.06)</text><text x="240" y="214" text-anchor="end" class="fx-t">collar: 95 put + short 105 call</text><rect x="250" y="194" width="130" height="28" rx="4" class="fx-box2"/><text x="315" y="213" text-anchor="middle" class="fx-t-sm">deductible 5.00</text><rect x="380" y="194" width="13.230832091208278" height="28" rx="4" class="fx-bad"/><rect x="374.6941860168529" y="224" width="18.53664607435539" height="6" rx="2" class="fx-fill-green"/><text x="401.2308320912083" y="213" class="fx-t-b">= 4.80</text><text x="453.2308320912083" y="213" class="fx-t-sm">(premium 0.51, call income 0.71)</text><text x="20" y="246" class="fx-t-sm">grey = distance to the strike (you bear it); red = premium;</text><text x="20" y="262" class="fx-t-sm">green strip = cancelled by the call income (paid for with the upside above 105)</text></svg>
<figcaption>Figure 2 · Max loss = deductible + premium (− call income). The at-the-money put has no deductible but the dearest premium; the 90 put costs almost nothing but leaves the first 10 dollars of any fall to you. The collar uses the call income to cancel the 95 put's premium, with 0.20 left over.</figcaption>
</figure>

### ② The collar: paying with upside; zero-cost collars and skew

Collar = shares + a long put at \(K_p\) + a short call at \(K_c\) (with \(K_p < S_0 < K_c\)). The net premium is \(p - c\), so:

$$
\Pi_{\text{floor}} = K_p - S_0 - (p - c), \qquad \Pi_{\text{cap}} = K_c - S_0 - (p - c)
$$

> [!KAI] Kai's collar
> \(p - c = 0.51 - 0.71 = -0.20\) (a net credit of 0.20):
> $$
> \begin{gathered}\Pi_{\text{floor}} = 95 - 100 + 0.20 = -4.80 \\ \Pi_{\text{cap}} = 105 - 100 + 0.20 = +5.20\end{gathered}
> $$
> For 30 days, the 100 shares' result is locked inside \([-480, +520]\) dollars.

**A zero-cost collar** picks the call strike so that \(c = p\) and the net premium is exactly zero. With a flat 20% volatility, the zero-cost call to pair with the 95 put has a strike of about **106.14**.

Real markets have **skew** ([[smile-skew]]): out-of-the-money puts usually trade at higher implied volatility than out-of-the-money calls. Suppose, purely for illustration, the 95 put is priced at 24% and the 105 call at 18%: the put becomes 0.81, the call 0.55, and Kai's collar turns from a 0.20 credit into a 0.26 debit; a zero-cost collar would need a call strike of about **103.76**. **The steeper the skew, the dearer the insurance and the lower the zero-cost ceiling.** It also shows that a collar is itself a skew trade: buying a put and selling a call is a risk reversal ([[ratios-risk-reversals]]).

Choosing a collar's two strikes is really choosing a range: how far below today the floor sits (how much fall you can bear) and how far above today the ceiling sits (how much upside you're willing to give away). A common approach is to keep the two roughly symmetric, such as 95/105; for cheaper insurance, lower the ceiling; for more upside, accept paying a net premium.

> [!DEEP] Collar = bull spread + bond
> By parity, shares + a 95 put = a 95 call + the present value of 95. So a collar = 95 call − 105 call + the present value of 95: a **bull call spread** (next lesson, [[vertical-spreads]]) plus a bond. Check with numbers: the 95 call costs 5.82 and the 105 call 0.71, a spread of 5.11; the present value of 95 is 94.69; together \(5.11 + 94.69 = 99.80\), exactly the collar's cost \(100 + 0.51 - 0.71 = 99.80\). Someone holding shares plus a collar economically owns “one spread plus some cash.”

### ③ Before expiry: what insurance is worth in a sell-off

Insurance often shows its value long before expiry. Suppose XYZ drops to 90 on the very day Kai buys the put (30 days left):

> [!EXAMPLE] A drop to 90 on day one
> The 95 put is now worth 5.23 (at 20% volatility), so the position shows \(-10 + (5.23 - 0.51) = -5.28\), against −10 for the shares alone.
> If the drop also pushes implied volatility to 30% (which is common), the put is worth 6.05 and the position is down only \(-10 + (6.05 - 0.51) = -4.46\). **Positive vega makes insurance more valuable in a panic** — the payoff from the positive ν in the protective put's signature.

You can watch the insurance “take over” through delta. The protective put's position delta **shrinks automatically** as the stock falls — that is positive gamma:

| Stock price on day one | 95 put price | Position delta (share-equivalent) |
|---|---|---|
| 110 | 0.01 | about 100 shares |
| 100 | 0.51 | about 84 shares |
| 95 | 2.02 | about 53 shares |
| 90 | 5.23 | about 20 shares |
| 85 | 9.75 | about 3 shares |

The further the stock falls, the more the position behaves like cash; the further it rises, the more it behaves like stock. That is the shape of insurance: without you doing anything, delta cuts the position as the price falls.

The collar behaves very differently here: the short call's negative vega cancels most of that panic premium. A collar protects a **price range at expiry**, not the ability to sell a suddenly more valuable insurance policy in a panic.

> [!WARN] Insurance expires
> The put expires in 30 days, and the protection ends with it. If earnings are delayed, or the crash comes on day 31, this policy pays nothing. When insuring an event, choose an expiry that covers the event itself with room to spare ([[earnings-events]]).

### ④ The drag of permanent insurance

One-off insurance is cheap; insurance kept forever is not. Buying a 95% put every month costs, per year, roughly:

$$
\text{yearly drag} \approx \frac{365}{d}\cdot\frac{P}{S} = \frac{365}{30} \times \frac{0.51}{100} \approx 6.2\%
$$

where \(d\) is the number of days in each put, \(P\) the premium per roll and \(S\) the stock price.

| Put strike | Rolled monthly | Rolled quarterly | One 1-year put |
|---|---|---|---|
| 100% (ATM) | 25.8% | 14.0% | 6.0% |
| 95% | 6.2% | 6.4% | 4.0% |
| 90% | 0.7% | 2.3% | 2.5% |

Two patterns stand out. First, permanent at-the-money insurance is staggeringly expensive: an at-the-money put every month costs about 26% a year. Second, at the same 95% strike, a 1-year put is cheaper than rolling monthly but protects more loosely: its deductible is “5% for the whole year,” while the monthly roll resets to “5% from here” every month.

::demo[protective-put-collar-drag]

If a stock's expected return is only a few percent a year, a 6% yearly premium can eat all of it. That is the heart of the long-running debate over whether tail hedging is worth it: insurance pays a lot in crashes and drags on returns the rest of the time ([[tail-hedging]]).

### ⑤ When insurance is worth buying, and the alternatives

Common uses (a description, not advice):

- **ahead of an event:** risks with a known date, such as earnings or a regulatory decision, covered with a short-dated put that spans the event;
- **concentrated positions that can't be sold for now:** for example because of a lock-up, or because selling would carry extra costs;
- **needing a known worst case:** for example when the money must be at least a certain amount on a certain date.

Be clear about **what the policy covers**. A put on a single stock insures all of that stock's risk, including bad news specific to the company; an **index put** on a diversified portfolio (for example SPX or XSP, see [[product-map]]) insures only against “the whole market falling together.” Index implied volatility is usually lower than a single stock's, so the same 30-day protection 5% out of the money is often much cheaper on the index (as an illustration: a 95 put priced at 15% volatility costs about 0.20, at 30% about 1.33). The price is **basis risk**: if your holdings don't move with the index, the index put may pay nothing while you lose money.

**Timing** also changes the premium dramatically. Out-of-the-money puts are very sensitive to implied volatility: the same 30-day 95 put costs 0.20 at 15% implied volatility, 0.51 at 20%, 1.33 at 30% and 2.29 at 40% — double the volatility and the premium more than quadruples. Insurance is cheap in calm markets, when people tend to feel they don't need it; by the time everyone wants it, it is expensive. That is why some institutions treat protection as a standing budget rather than a last-minute reaction.

The alternatives each have a price:

- **selling part of the shares:** simplest, with no time decay, but the upside on that part is gone;
- **a stop-loss order:** no premium, but on a gap down (common after earnings) it can fill far below the stop price, while a put's floor doesn't care about gaps;
- **a put spread:** buy the 95 put and sell the 90 put — cheaper, but no protection below 90 ([[vertical-spreads]]).

> [!HISTORY] “Portfolio insurance” in 1987
> In the 1980s a strategy called portfolio insurance became popular: instead of buying puts, managers followed a formula that sold stock-index futures as the market fell — **replicating a put by dynamic trading**. On October 19, 1987 the Dow fell 22.6% in a day (the S&P 500 fell 20.5%); formula-driven sell orders hit the market at the same moment, adding to the fall, and the replication broke down as prices gapped. The lesson: **synthetic insurance relies on continuous, orderly markets, while a real put transfers the gap risk to its seller** — which is part of what its premium pays for ([[bs-assumptions]]).

## @analogy
A protective put is **car insurance**:

- **the premium** is what you pay each period (0.51);
- **the deductible** is the part of a claim you cover yourself (the 5 dollars from 100 to 95);
- **the policy term** is 30 days; no renewal, no cover.

A collar is like **striking a deal with the insurer**: “I won't pay the premium in cash, but if my car ever sells at auction for more than $105,000, you keep everything above that.” The insurer agrees and even hands you a little cash back.

The analogy breaks at one important point: car insurance premiums depend mostly on your driving record, while option insurance premiums depend on **how frightened the whole market is**. The more panicked the market, the higher implied volatility and the dearer the same policy — the moment you most want insurance is usually the moment it costs most.

## @misconceptions
- **“With a put, my shares can't lose money.”** — The floor is at 95, not 100. Deductible plus premium still allows a loss of up to 5.51 per share.
- **“A zero-cost collar is free insurance.”** — Its premium is paid with the upside above 105 (or 106). Under fair pricing the call premium received and the upside surrendered are worth the same.
- **“The further out of the money the put, the better the deal, because it's cheap.”** — The 90 put costs only 0.06, but the first 10 dollars of any fall are all yours. Cheap insurance has a high deductible.
- **“Holding protective puts permanently is a prudent long-term policy.”** — Rolling a 95% put monthly costs about 6.2% a year; compounded over ten years that is a large drag. Permanent insurance must be judged together with its cost.
- **“A collar and a protective put behave the same in a sell-off.”** — Their floors at expiry are similar, but before expiry they differ: the protective put gains value in a panic thanks to positive ν, while the collar's short call cancels most of that.

## @takeaways
- Protective put = shares + a long put: floor \(K_p - S_0 - p\), upside breakeven \(S_0 + p\); the higher the deductible, the lower the premium.
- Collar = protective put + a short call: the P&L is boxed into \([K_p - S_0 - (p - c),\ K_c - S_0 - (p - c)]\); Kai's collar runs from −4.80 to +5.20.
- A protective put buys convexity (Γ and ν positive, Θ negative); a collar's Γ, Θ and ν are all near zero, and its main effect is to cut delta and clip both tails.
- Skew makes puts dearer and pushes the zero-cost ceiling lower; a collar is also a risk reversal.
- Permanent insurance drags: rolling a 95% put monthly costs about 6.2% a year. Buy insurance for a specific risk over a specific period.

## @quiz
1. Kai's shares cost 100 and Kai buys the 30-day 95 put for 0.51. At expiry XYZ closes at 70. What is the combined P&L on the 100 shares plus the put?
   - [ ] −$3,000
   - [x] −$551
   - [ ] −$500
   - [ ] −$51
   > Floor \(= 95 - 100 - 0.51 = -5.51\) per share, −$551 on 100 shares. −$500 forgets the premium; −$3,000 is the loss without insurance.
2. Kai's collar (long 95 put at 0.51, short 105 call at 0.71) at expiry with XYZ at 115 makes, per share:
   - [ ] +15.00
   - [ ] +14.49
   - [x] +5.20
   - [ ] +4.80
   > The shares are called away at 105 for a gain of 5, plus the 0.20 net credit: +5.20. +14.49 is the protective put alone; the difference is the upside the collar used to pay for its insurance.
3. In real markets out-of-the-money puts usually carry higher implied volatility than out-of-the-money calls. What does that mean for a zero-cost collar?
   - [ ] The call strike can be set higher, leaving more upside
   - [x] The call strike must be lower, so the ceiling is tighter
   - [ ] Nothing — zero-cost collars are always symmetric
   - [ ] The put strike must be higher
   > The dearer put needs more call premium to offset it, so you must sell a call closer to the money (a dearer one), and the ceiling moves down. With the put at 24% and the call at 18%, the zero-cost call strike falls from about 106.14 to about 103.76.
4. Which best describes the collar's Greek signature at entry (100 shares + 95 put − 105 call)?
   - [ ] Δ = 100 shares, Γ strongly positive
   - [ ] Δ negative, ν strongly positive
   - [x] Δ about 61 shares, with Γ, Θ and ν all near zero
   - [ ] Δ about 84 shares, Θ negative, ν positive
   > The put's Γ and ν nearly cancel the call's; the put's Δ of −0.163 and the call's −0.222 cut the total to about 0.61. Δ of 84 shares with negative Θ and positive ν is the signature of the put alone.
5. Why does “rolling a 95% put every month” add up to a large cost over time?
   - [ ] Because puts always expire worthless
   - [ ] Because every roll carries a fixed commission
   - [x] Because each roll costs about 0.51%, about 6.2% a year, paid again every month
   - [ ] Because the put only covers falls of more than 5%, so it isn't worth buying
   > Yearly drag \(\approx (365/30) \times 0.51\% \approx 6.2\%\). If the stock's expected yearly return is only a few percent, that drag eats most of it.

## @further
- [Protective put (Wikipedia)](https://en.wikipedia.org/wiki/Protective_put) — structure, payoff and its use as insurance.
- [Collar (finance) (Wikipedia)](https://en.wikipedia.org/wiki/Collar_(finance)) — collars, zero-cost collars and their use in hedging concentrated positions.
- [Options Industry Council (OIC)](https://www.optionseducation.org/) — strategy pages on protective puts and collars, plus FAQs on expiration and exercise.
- [OCC: Characteristics and Risks of Standardized Options](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the official disclosure of buyers' and writers' risks.
- [New Finance Path](https://evidex-cloud.github.io/droplet-labs-finance-path/) — sister course on risk, insurance and allocation at the portfolio level.

## @next
The collar uses one sold option to subsidise one bought option. The same idea works without owning the stock: buy a call, sell a higher-strike call, and cost, risk and reward are all framed between the two strikes. Next: vertical spreads.
