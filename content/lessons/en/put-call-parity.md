---
id: put-call-parity
prereqs: payoff-lego, arbitrage-bounds, forwards-carry
demo: put-call-parity
---

# Put-Call Parity: The Conservation Law of Options

## @hook
A call and a put with the same strike and expiry are not two independent prices. They are tied by one exact equation: call minus put equals stock minus the present value of the strike. For Kai's 1-year XYZ options, \(9.93 - 6.00 = 3.93 = 100 - 96.08\). Break it by a few cents and a four-legged trade prints riskless money — which is why it almost never breaks.

## @bridge
[[payoff-lego]] hinted that a stock can be rebuilt from a call, a put and a bond. [[forwards-carry]] priced a purchase for later delivery, and [[arbitrage-bounds]] boxed each option in separately. This lesson welds calls and puts together with the strongest no-model rule in the course. It builds Idea ② — no-arbitrage — and hands on to [[synthetics-boxes]], where parity becomes a toolkit, and to [[binomial-one-step]], where the same "replicate it and it must cost the same" logic finally prices a single option.

## @intuition
Kai is weighing two ways to spend money on XYZ for the next 30 days.

- **Portfolio A:** buy the 30-day 100 call for $2.45, and put \(\$99.67\) into a 30-day Treasury bill that pays exactly $100 at expiry.
- **Portfolio B:** buy the 30-day 100 put for $2.12, and buy one XYZ share for $100.

What is each worth when the options expire? Try three outcomes:

| XYZ at expiry | A: call + bill | B: put + share |
|---|---|---|
| $80 | \(0 + 100 = 100\) | \(20 + 80 = 100\) |
| $100 | \(0 + 100 = 100\) | \(0 + 100 = 100\) |
| $120 | \(20 + 100 = 120\) | \(0 + 120 = 120\) |

In every case **A and B end up worth exactly the same**: $100 if XYZ finishes below $100, and XYZ's price if it finishes above. Both portfolios are "the larger of XYZ and $100". Two things that are worth the same in every future must cost the same today — otherwise you would buy the cheaper, sell the dearer, and collect the difference with nothing left to pay. So:

$$
\underbrace{2.45 + 99.67}_{\text{A: call + bill}} \;=\; \underbrace{2.12 + 100}_{\text{B: put + share}} \;=\; 102.12
$$

The left side is what Kai pays for portfolio A (call price plus the bill), the right side what Kai pays for B (put price plus the share). They agree to the cent. That is **put-call parity** — and nothing in the argument needed a view on XYZ, a volatility, or a model.

<figure>
<svg viewBox="0 0 660 250" role="img" aria-label="Call plus bill has the same payoff as put plus share">
<line x1="40" y1="200" x2="290" y2="200" class="fx-axis"/>
<line x1="40" y1="200" x2="40" y2="30" class="fx-axis"/>
<polyline points="40,90 160,90 280,46" class="fx-line-thick"/>
<polyline points="40,200 160,200 280,156" class="fx-line-hl fx-dash"/>
<line x1="40" y1="90" x2="280" y2="90" class="fx-line-muted fx-dash"/>
<text x="160" y="24" text-anchor="middle" class="fx-t-b">A: call + bill paying K</text>
<text x="200" y="152" class="fx-t-hl">call</text>
<text x="60" y="106" class="fx-t-sm">bill = 100</text>
<text x="48" y="80" class="fx-t">max(S<tspan dy="4" font-size="11">T</tspan><tspan dy="-4">, 100)</tspan></text>
<text x="160" y="218" text-anchor="middle" class="fx-t-sm">100</text>
<text x="325" y="120" text-anchor="middle" class="fx-t-b">=</text>
<line x1="370" y1="200" x2="620" y2="200" class="fx-axis"/>
<line x1="370" y1="200" x2="370" y2="30" class="fx-axis"/>
<polyline points="370,90 490,90 610,46" class="fx-line-thick"/>
<polyline points="370,156 490,200 610,200" class="fx-line-blue fx-dash"/>
<line x1="370" y1="134" x2="610" y2="46" class="fx-line-muted fx-dash"/>
<text x="490" y="24" text-anchor="middle" class="fx-t-b">B: put + share</text>
<text x="425" y="160" class="fx-t-blue">put</text>
<text x="560" y="84" class="fx-t-sm">share</text>
<text x="378" y="80" class="fx-t">max(S<tspan dy="4" font-size="11">T</tspan><tspan dy="-4">, 100)</tspan></text>
<text x="490" y="218" text-anchor="middle" class="fx-t-sm">100</text>
<text x="330" y="244" text-anchor="middle" class="fx-t-sm">horizontal axis: XYZ at expiry (60 to 140) · vertical: value at expiry</text>
</svg>
<figcaption>Figure 1 · Two different piles of Lego, one shape. The call's hockey stick sitting on a $100 floor (left) and the share's straight line with the put's floor underneath it (right) both give "the larger of \(S_T\) and 100". Same payoff at expiry, so the same price today.</figcaption>
</figure>

The inline widget lets you slide XYZ's final price and watch both piles add up to the same number, leg by leg.

::demo[put-call-parity-payoffs]

Rearranged, parity says something striking: **a call minus a put is a forward purchase.** Own the call and owe the put, and at expiry you will buy XYZ at $100 whatever happens — by exercising your call if XYZ is above $100, or by being assigned on your put if it is below. The value of agreeing today to buy at $100 in 30 days is \(S - Ke^{-rT} = 100 - 99.67 = 0.33\), and indeed \(2.45 - 2.12 = 0.33\).

> [!KAI] Kai's insured shares are secretly a call
> Kai owns 100 XYZ shares and is considering the 100 put as insurance. Parity says share + put = call + bill. So "shares with a put underneath" behave exactly like "a call, plus $99.67 of Treasury bills per share". Protecting a stock position and buying calls while keeping cash in bills are two routes to the same place. Which is better depends on costs, taxes and convenience — not on any view of XYZ.

We'll take it in five parts:

- **① The equation and its proof**
- **② When parity breaks: conversions and reversals**, with a worked arbitrage
- **③ Reading the market with parity**: implied forwards, dividends and borrow costs
- **④ American options: an inequality instead of an equation**
- **⑤ Why it matters**: financing, Greeks, one implied vol per strike

## @mechanics
### ① The equation and its proof

For European options on a stock with continuous dividend yield \(q\), same strike \(K\), same expiry \(T\):

$$
C - P \;=\; S e^{-qT} - K e^{-rT} \;=\; e^{-rT}\,(F - K)
$$

where \(C\) and \(P\) are the call and put prices, \(S\) the stock price, \(r\) the risk-free rate, \(Ke^{-rT}\) the present value of the strike, and \(F = Se^{(r-q)T}\) the forward price from [[forwards-carry]]. The second form says: call minus put is today's value of buying at \(K\) something worth \(F\) for delivery at \(T\).

**Proof.** Portfolio A = one call + \(Ke^{-rT}\) in bills; portfolio B = one put + \(e^{-qT}\) shares (reinvest the dividends and you hold exactly one share at expiry). At expiry both are worth \(\max(S_T, K)\), as in the table above. Same payoff in every state → same price today: \(C + Ke^{-rT} = P + Se^{-qT}\).

> [!EXAMPLE] Checking Kai's numbers
> - **30 days** (\(r = 4\%\), no dividend): \(C - P = 2.45 - 2.12 = 0.33\) and \(S - Ke^{-rT} = 100 - 99.67 = 0.33\). ✓
> - **1 year:** \(C - P = 9.93 - 6.00 = 3.93\) and \(100 - 100\,e^{-0.04} = 100 - 96.08 = 3.92\). The one-cent gap is rounding; unrounded, both sides are \(3.9211\). ✓
> - **Dividend yield 2%, 30 days:** \(C = 2.364\), \(P = 2.200\), \(C - P = 0.164\), and \(100\,e^{-0.02 \times 30/365} - 99.672 = 99.836 - 99.672 = 0.164\). ✓

Nothing here depends on volatility. Raise \(\sigma\) and both the call and the put get dearer by *exactly* the same amount, so their difference stays put. That is also why the call's vega and the put's vega at the same strike are identical (0.114 each for Kai's 30-day options, [[price-drivers]]).

### ② When parity breaks: conversions and reversals

If the equation fails, one side is too expensive. Sell the expensive side, buy the cheap side, and the payoffs cancel at expiry. The two versions have trader names.

- **Conversion** (call too rich, \(C - P > S - Ke^{-rT}\)): sell the call, buy the put, buy the stock, borrow \(Ke^{-rT}\). Stock + put − call is always worth exactly \(K\) at expiry, which repays the loan.
- **Reversal** (call too cheap, \(C - P < S - Ke^{-rT}\)): buy the call, sell the put, short the stock, lend \(Ke^{-rT}\).

> [!EXAMPLE] A worked conversion
> A market maker bids the 30-day 100 call at **$2.60** while the put is offered at $2.12 and XYZ trades at $100. Quoted \(C - P = 0.48\); parity says \(0.33\). The call is rich by \(\$0.15\).
>
> | Leg | Today | Expiry, \(S_T > 100\) | Expiry, \(S_T \le 100\) |
> |---|---|---|---|
> | Sell the 100 call | +2.60 | assigned: deliver a share, receive 100 | expires |
> | Buy the 100 put | −2.12 | expires | exercise: deliver a share, receive 100 |
> | Buy one share | −100.00 | (delivered) | (delivered) |
> | Borrow \(100\,e^{-rT}\) | +99.67 | repay −100 | repay −100 |
> | **Net** | **+0.15** | **0** | **0** |
>
> \(\$0.15\) per share today, \(0.15 \times 100 = \$15\) per set, with nothing owed in any scenario. The mirror trade — a **reversal** — earns about $0.15 if instead the call were offered at $2.30.

<figure>
<svg viewBox="0 0 660 220" role="img" aria-label="Parity as a balance between call plus bill and put plus share">
<polygon points="330,150 310,190 350,190" class="fx-fill-muted"/>
<line x1="90" y1="150" x2="570" y2="150" class="fx-line-thick"/>
<line x1="150" y1="150" x2="150" y2="118" class="fx-line"/>
<line x1="510" y1="150" x2="510" y2="118" class="fx-line"/>
<rect x="60" y="40" width="180" height="78" rx="10" class="fx-box"/>
<text x="150" y="64" text-anchor="middle" class="fx-t-hl">call 2.45</text>
<text x="150" y="84" text-anchor="middle" class="fx-t">+ bill 99.67</text>
<text x="150" y="106" text-anchor="middle" class="fx-t-b">= 102.12</text>
<rect x="420" y="40" width="180" height="78" rx="10" class="fx-box"/>
<text x="510" y="64" text-anchor="middle" class="fx-t-blue">put 2.12</text>
<text x="510" y="84" text-anchor="middle" class="fx-t">+ share 100.00</text>
<text x="510" y="106" text-anchor="middle" class="fx-t-b">= 102.12</text>
<text x="330" y="30" text-anchor="middle" class="fx-t-b">C + Ke<tspan dy="-6" font-size="11">−rT</tspan><tspan dy="6"> = P + S</tspan></text>
<text x="330" y="212" text-anchor="middle" class="fx-t-sm">if one pan gets heavier, sell that pan and buy the other: a conversion or a reversal</text>
</svg>
<figcaption>Figure 2 · Parity as a balance (XYZ, 30 days). Arbitrageurs are the hands that push it level: when the call side is too heavy they sell it (a conversion); when the put side is too heavy they sell that (a reversal).</figcaption>
</figure>

Two cautions before you go hunting. First, a conversion has **four legs**, each with a bid-ask spread; for liquid names parity usually holds *within* the combined spreads, which is exactly the zone market makers police. Second, the reversal needs a **short sale**, and short sales cost a borrow fee — which leads to the most useful application of parity.

### ③ Reading the market with parity

Turn parity around and every call-put pair becomes a measuring instrument. Solve for the forward:

$$
F = K + e^{rT}\,(C - P)
$$

where \(C\) and \(P\) are market prices at the same strike \(K\) and expiry \(T\). XYZ, 1 year: \(F = 100 + e^{0.04} \times 3.92 = 104.08\), the carry value. On real chains the **implied forward** is how desks read the market's view of dividends and financing before they compute a single implied volatility ([[options-data]]).

When the implied forward sits *below* \(Se^{(r-q)T}\) for the known dividends, the missing piece is usually the **borrow fee**.

> [!THINK] A stock is hard to borrow. Its 30-day 100 call trades at $2.04 and the put at $2.53, with the stock at $100, r = 4% and no dividend. Is this a free lunch?
> Plain parity with no dividend says \(C - P\) should be \(+0.33\); here it is \(-0.49\). The put looks $0.82 too expensive. Should you do a reversal — buy the call, sell the put, short the stock?
> ---
> Not unless you can borrow the stock cheaply. The quotes imply a forward of \(100 + e^{0.04 \times 30/365}(-0.49) = 99.51\), which matches \(100\,e^{(0.04 - 0.10) \times 30/365}\): a **10% annual borrow fee**. The reversal needs a short sale, and 30 days of a 10% fee costs \(100 \times (1 - e^{-0.10 \times 30/365}) \approx \$0.82\) — the entire "edge". Parity is not broken; the fee is priced in. This is why puts look rich and calls cheap on hard-to-borrow stocks: owning the put is the cheapest way to be short.

### ④ American options: an inequality instead of an equation

Parity's proof held each portfolio to expiry. With **American** options someone may exercise early, and the equation loosens into a band. For a stock without dividends:

$$
S - K \;\le\; C_A - P_A \;\le\; S - K e^{-rT}
$$

where \(C_A\) and \(P_A\) are the American call and put prices. The right side comes from the European relation plus the fact that the American put is worth at least the European one (and the American call equals the European call here, [[arbitrage-bounds]]). The left side is enforced by a conversion that pays the strike immediately if the put is exercised early.

> [!EXAMPLE] XYZ's American 100 options
> 30 days: the band is \(0 \le C_A - P_A \le 0.33\). The American put is worth $2.15 (the early-exercise right adds about $0.02), so \(C_A - P_A = 2.45 - 2.15 = 0.30\), inside.
> 1 year: the band is \(0 \le C_A - P_A \le 3.92\); the American put is worth $6.40, so \(C_A - P_A = 9.93 - 6.40 = 3.53\). Longer life, bigger early-exercise premium, looser parity.

Dividends loosen the band further, and for single-stock options around ex-dividend dates this matters: the risk that the short call in a conversion is exercised early to capture a dividend is a real cost to dealers ([[exercise-assignment]]).

### ⑤ Why it matters

Parity looks like an accounting identity, but it reshapes how you think about options.

- **Choosing a call or a put is a financing choice.** Call + bill = put + stock. A bullish view can be expressed by a call (and keeping cash) or by stock plus a protective put (and spending the cash); both have the same payoff, so they cost the same. The differences are practical: margin, borrow costs, taxes, dividends, liquidity.
- **Greeks come in matched pairs.** Differentiate parity: \(\Delta_C - \Delta_P = e^{-qT}\) (for Kai: \(0.534 - (-0.466) = 1\)), and the gamma and vega of the call and put at the same strike are identical. A long call and a long put at the same strike differ only by a stock position and some cash.
- **One implied volatility per strike.** Since calls and puts at the same strike and expiry are linked exactly, they must imply the same volatility. If a call bid at $2.60 implied 21.3% while the put at $2.12 implied 20.0%, that is a parity violation written in vol language. That is why volatility smiles are drawn as one curve per expiry ([[smile-skew]]).
- **But parity does not price the option.** It fixes \(C - P\), not \(C\). Raise volatility and both legs rise together without disturbing parity. To get the level you need a model of how the stock moves — the one-step tree in [[binomial-one-step]].

> [!HISTORY] Calls only, then puts
> When the Chicago Board Options Exchange opened on April 26, 1973, it listed calls only, on 16 stocks. Listed puts came in June 1977. Parity explains why the gap was survivable: with a listed call, a short sale of the stock and a bank account, a put's payoff can be rebuilt exactly — put = call − stock + bill.

## @analogy
Parity is like **currency exchange around a triangle**. Suppose you can swap dollars for euros, euros for yen, and yen back into dollars. The three exchange rates can't be set independently: go around the loop and you must end up with exactly what you started with. If some day the loop pays 1% extra, traders spin it until the rates fall back into line.

In the options world the four "currencies" are calls, puts, shares and cash, and the loop is call + cash = put + share. A call can always be "exchanged" into a put plus a share minus cash, at a rate fixed by the strike and the interest rate. When one of the quotes drifts, the loop pays, and the arbitrageurs who run it are the reason it never pays for long.

The analogy fails in one place: currency loops close instantly, while the option loop only closes at expiry. In between, you need financing, a stock borrow and the absence of early assignment — which is why parity in the real world is enforced to within the costs of those frictions, not to the last fraction of a cent.

## @misconceptions
- **"Calls and puts are priced separately by supply and demand."** — Supply and demand set one of them; parity then fixes the other, given the stock, the rate and the dividends. Know the call and you know the put.
- **"If a stock's puts are more expensive than its calls, the market expects it to fall."** — Often it simply means the stock is hard to borrow or pays dividends: both lower the forward, which makes puts dearer and calls cheaper through parity, with no forecast involved.
- **"Parity needs a pricing model."** — Its proof uses only two portfolios with the same payoff. It holds for any volatility and any distribution — as long as the options are European and the inputs are right.
- **"A parity gap on the screen is free money."** — Four legs of bid-ask spread, a borrow fee for reversals, dividend and early-assignment risk for American options: after those, genuine gaps are rare and brief.
- **"Parity tells you what a call is worth."** — It tells you what a call is worth *relative to the put*. The level of both depends on volatility, which parity can't see.

## @takeaways
- Put-call parity: \(C - P = Se^{-qT} - Ke^{-rT} = e^{-rT}(F - K)\). Kai: \(2.45 - 2.12 = 0.33 = 100 - 99.67\); \(9.93 - 6.00 = 3.93 \approx 100 - 96.08\).
- Proof: call + bill and put + share both pay \(\max(S_T, K)\), so they cost the same today.
- A rich call is harvested with a conversion (sell call, buy put, buy stock, borrow); a rich put with a reversal (buy call, sell put, short stock, lend).
- Parity read backwards gives the implied forward, and with it the market's dividends and borrow costs.
- American options only satisfy \(S - K \le C_A - P_A \le S - Ke^{-rT}\) (no dividends).
- Parity fixes calls relative to puts, not their level: pricing the level needs a model.

## @quiz
1. XYZ is at $100, \(r = 4\%\), no dividend. The 1-year 100 put costs $6.00. What must the 1-year 100 call cost?
   - [ ] $6.00, because the strike equals the stock price
   - [x] About $9.92, since \(C = P + S - Ke^{-rT} = 6.00 + 100 - 96.08\)
   - [ ] About $2.08
   - [ ] It depends on the volatility
   > Parity fixes the call given the put: \(6.00 + 3.92 = 9.92\) (9.93 unrounded). Volatility affects both prices equally, so it cancels out of the difference.
2. The 30-day 100 call is bid at $2.60 and the put offered at $2.12, with XYZ at $100 and \(Ke^{-rT} = 99.67\). Which trade locks in a profit?
   - [ ] Buy the call, sell the put, short the stock, lend $99.67
   - [ ] Buy the call and the put
   - [x] Sell the call, buy the put, buy the stock, borrow $99.67
   - [ ] Buy the stock and sell the put
   > Quoted \(C - P = 0.48\) exceeds \(S - Ke^{-rT} = 0.33\): the call is rich. A conversion sells it and buys the equivalent (put + stock − loan). Net today \(+2.60 - 2.12 - 100 + 99.67 = +0.15\); at expiry stock + put − call is worth exactly 100, which repays the loan.
3. On a hard-to-borrow stock, the call and put at the same strike imply \(C - P\) well below \(S - Ke^{-rT}\). What is the most likely explanation?
   - [ ] The market expects the stock to crash
   - [ ] Option market makers made a mistake
   - [ ] Volatility is higher for puts than for calls
   - [x] The cost of borrowing the stock acts like a dividend yield and lowers the forward
   > A reversal would need a short sale, which costs the borrow fee. The implied forward falls by about that fee, making puts dearer and calls cheaper. In the lesson's example a 10% fee explains the whole $0.82 "gap".
4. Kai's 30-day American 100 put is worth $2.15 and the call $2.45. Which statement is correct?
   - [x] \(C_A - P_A = 0.30\) lies inside the band \(0 \le C_A - P_A \le 0.33\), so there's no arbitrage
   - [ ] Parity must hold exactly: \(C_A - P_A\) should be 0.33, so buy the call and sell the put
   - [ ] American options have no parity relation at all
   - [ ] \(C_A - P_A\) must be exactly zero because the strike equals the stock price
   > With early exercise, parity becomes \(S - K \le C_A - P_A \le S - Ke^{-rT}\). The American put is worth more than the European ($2.12) because of the early-exercise right, so the gap shrinks below 0.33 — legitimately.
5. Why must a call and a put with the same strike and expiry imply the same volatility?
   - [ ] Because the exchange requires it
   - [ ] Because the Black-Scholes model assumes it
   - [x] Because parity ties their prices exactly, and volatility shifts both by the same amount
   - [ ] Because a call and a put at the same strike have the same delta
   > If the call implied 21% and the put 20%, then \(C - P\) would differ from \(S - Ke^{-rT}\): a parity violation. Arbitrage forces a single implied volatility per strike and expiry (up to spreads and, for American options, early exercise).

## @further
- [Put–call parity — Wikipedia](https://en.wikipedia.org/wiki/Put%E2%80%93call_parity) — the derivation, the American-option inequalities and the history of the relation.
- [Merton (1973), Theory of Rational Option Pricing](https://doi.org/10.2307/3003143) — parity and its American-option bounds derived from no-arbitrage alone.
- [OIC — options exercise FAQ](https://www.optionseducation.org/referencelibrary/faq/options-exercise) — early exercise and dividends, the reason American parity is only an inequality.
- [Characteristics and Risks of Standardized Options (OCC)](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the official description of exercise, assignment and settlement that parity trades rely on.

## @next
Parity is a machine for building one thing out of others. Call minus put is a forward; stock plus put is a call; and two option spreads stacked together make a riskless loan whose interest rate the market quotes every day. Next: synthetics, conversions and the box spread.
