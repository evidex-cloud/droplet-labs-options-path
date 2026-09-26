---
id: synthetics-boxes
prereqs: payoff-lego, exercise-assignment, put-call-parity
demo: synthetics-boxes
---

# Synthetics, Conversions & Box Spreads

## @hook
Put-call parity is a recipe book: any one of call, put, stock and cash can be cooked from the other three. Stack two of those recipes and you get a **box** — four options that pay exactly $20 at expiry whatever XYZ does. A box is a loan written in options, and its price tells you an interest rate. Built from the wrong kind of options, though, the "riskless" box can blow up an account.

## @bridge
[[put-call-parity]] proved that call + cash = put + stock. [[payoff-lego]] showed that payoffs add, and [[exercise-assignment]] explained how American options can be exercised early. This lesson turns parity into a toolkit: synthetic positions, the conversions and reversals dealers use to enforce parity, and the box spread as a financing instrument — including the trap that early assignment sets for boxes on American options. It builds Idea ② — no-arbitrage — and closes the stage by asking what all these no-model tools *still* can't do, which is where [[binomial-one-step]] takes over.

## @intuition
Start with the simplest synthetic. Kai wants XYZ exposure for 30 days but would rather not spend $100 per share now. Parity suggests a trade:

- **Buy** the 30-day 100 call for $2.45;
- **Sell** the 30-day 100 put for $2.12.

Net cost: \(2.45 - 2.12 = \$0.33\) per share. What happens at expiry?

- XYZ at $120: the call pays $20, the put expires. Kai gains \(+20\), exactly as if holding a share bought at $100.
- XYZ at $80: the call expires, the put is assigned — Kai must buy XYZ at $100 while it's worth $80, losing \(-20\). Exactly as a shareholder at $100 would.

In every case Kai ends up **buying XYZ at $100 at expiry**. The call's hockey stick and the short put's upside-down hockey stick snap together into a straight line: a **synthetic long stock**. It costs $0.33 now plus $100 at expiry; buying the share outright costs $100 now. Today's value of the synthetic route is \(0.33 + 99.67 = 100\) — the same, as parity demands.

<figure>
<svg viewBox="0 0 660 240" role="img" aria-label="Long call plus short put equals a straight line: synthetic long stock">
<line x1="30" y1="120" x2="210" y2="120" class="fx-axis"/>
<polyline points="30,120 120,120 210,45" class="fx-line-hl"/>
<text x="120" y="28" text-anchor="middle" class="fx-t-b">buy the 100 call</text>
<text x="120" y="138" text-anchor="middle" class="fx-t-sm">100</text>
<text x="225" y="125" text-anchor="middle" class="fx-t-b">+</text>
<line x1="240" y1="120" x2="420" y2="120" class="fx-axis"/>
<polyline points="240,195 330,120 420,120" class="fx-line-blue"/>
<text x="330" y="28" text-anchor="middle" class="fx-t-b">sell the 100 put</text>
<text x="330" y="138" text-anchor="middle" class="fx-t-sm">100</text>
<text x="440" y="125" text-anchor="middle" class="fx-t-b">=</text>
<line x1="460" y1="120" x2="640" y2="120" class="fx-axis"/>
<polyline points="460,195 640,45" class="fx-line-thick"/>
<text x="550" y="28" text-anchor="middle" class="fx-t-b">synthetic long stock</text>
<text x="550" y="138" text-anchor="middle" class="fx-t-sm">100</text>
<text x="583" y="58" text-anchor="end" class="fx-t-ok">+20</text>
<text x="490" y="196" class="fx-t-bad">−20</text>
<text x="330" y="222" text-anchor="middle" class="fx-t-sm">payoff at expiry vs XYZ from 70 to 130 · net cost today 2.45 − 2.12 = 0.33</text>
</svg>
<figcaption>Figure 1 · Two kinked payoffs make a straight one. The long call supplies the upside, the short put supplies the downside, and together they are "buy XYZ at 100 at expiry" — the stock's P&L line, bought for $0.33 now instead of $100.</figcaption>
</figure>

The synthetic behaves like stock in every way that matters for risk: unlimited upside, and a loss all the way down if XYZ collapses (the short put). **It is not a limited-risk trade.** It needs margin for the short put, and it lets Kai hold the $99.67 in bills in the meantime instead of in shares. Its practical use is financing and convenience, not safety.

Now combine two synthetics. A synthetic long at a strike of 90 (buy the 90 call, sell the 90 put) together with a synthetic *short* at 110 (sell the 110 call, buy the 110 put) means: at expiry you buy XYZ at 90 and sell it at 110, whatever happens. That locks in exactly $20. The four options form a **box spread**, and something that pays a certain $20 in a year is just a zero-coupon bond. For XYZ at 4%, it must cost \(20\,e^{-0.04} = \$19.22\).

We'll take it in five parts:

- **① Synthetics**: six recipes from one equation
- **② Conversions and reversals**: how dealers enforce parity
- **③ The box spread**: a loan made of options, with a worked arbitrage
- **④ Boxes in practice**: implied rates, index boxes, jelly rolls
- **⑤ The trap**: American boxes and early assignment

## @mechanics
### ① Synthetics: six recipes from one equation

Write parity with \(B\) for a bill paying \(K\) at expiry (worth \(Ke^{-rT}\) today), and no dividends:

$$
C - P = S - B
$$

where \(C\) and \(P\) are the call and put at strike \(K\), \(S\) is one share and \(B\) the bill. Move terms around and read "+" as long, "−" as short:

| Target | Recipe | Cost check, XYZ 30-day 100 strike |
|---|---|---|
| long stock | \(S = C - P + B\) | \(2.45 - 2.12 + 99.67 = 100.00\) |
| short stock | \(-S = P - C - B\) | the mirror image |
| long call | \(C = S + P - B\) | \(100 + 2.12 - 99.67 = 2.45\) |
| long put | \(P = C - S + B\) | \(2.45 - 100 + 99.67 = 2.12\) |
| short put | \(-P = S - C - B\) | \(100 - 2.45 - 99.67 = -2.12\) (you receive 2.12) |
| a bill (cash) | \(B = S + P - C\) | \(100 + 2.12 - 2.45 = 99.67\) |

Two familiar strategies turn out to be synthetics in disguise:

- **Protective put = synthetic call.** Stock + put \(= C + B\). Kai's insured shares have exactly the shape of a long call plus cash ([[protective-put-collar]]).
- **Covered call = synthetic short put.** Stock − call \(= B - P\): the same payoff as holding cash and selling a put. That is why a [[covered-call]] and a [[cash-secured-put]] at the same strike behave alike.

> [!EXAMPLE] Two ways to own the upside of XYZ
> Route 1: buy the 30-day 100 call for $2.45 and keep \(\$99.67\) in bills. Route 2: buy a share for $100 and the 100 put for $2.12. Both cost \(\$102.12\) and both are worth \(\max(S_T, 100)\) at expiry. Per 100 shares: \(\$10{,}212\) either way. Which one Kai prefers depends on margin rules, dividends (route 2 collects them — but then parity with \(q > 0\) prices that in), taxes and commissions — never on a view of XYZ.

### ② Conversions and reversals: how dealers enforce parity

A **conversion** is long stock + long put + short call (same strike and expiry). From the table, it is a synthetic bill: it pays exactly \(K\) at expiry. A **reversal** is the opposite — short stock + short put + long call — a synthetic *loan* of \(K\).

These are not just textbook arbitrages. They are how options dealers lay off risk every day.

> [!EXAMPLE] A dealer lays off a customer's puts
> A pension fund buys 10 XYZ 30-day 100 puts from a dealer at the dealer's offer, **$2.17**. The same morning, an investor writing covered calls sells the dealer 10 of the 100 calls at the dealer's bid, **$2.40**. (Fair values: $2.12 and $2.45.) The dealer now holds long calls and short puts — a synthetic long of 1,000 shares, a directional bet they don't want.
> They neutralise it by shorting 1,000 shares at $100, completing a **reversal**:
> - Options: \(+2.17 - 2.40 = -0.23\) per share, against \(-0.33\) at fair value — an edge of \(\$0.10\) per share, \(0.10 \times 1{,}000 = \$100\) in total.
> - Short 1,000 shares: \(+\$100{,}000\), lent out at the risk-free rate.
> - At expiry the synthetic long (buy at 100) covers the short shares, whatever XYZ does: flat.
>
> The dealer's profit is the spread they earned, minus the cost of borrowing the shares. Their risk is no longer XYZ's direction — it is financing, borrow costs, dividends and early assignment.

This is the everyday machinery behind parity: whenever customers push one side (buying puts, say), dealers turn the flow into conversions or reversals, and in doing so pull call and put prices back into line ([[market-makers]]). One residual danger has a name: **pin risk**. If XYZ closes almost exactly at the strike at expiry, the dealer doesn't know whether their short option will be assigned, so they don't know whether they will start Monday with 1,000 shares or none — and a weekend gap can hurt ([[exercise-assignment]]).

### ③ The box spread: a loan made of options

A long box with strikes \(K_1 < K_2\) is four options, same expiry:

- **bull call spread:** buy the \(K_1\) call, sell the \(K_2\) call;
- **bear put spread:** buy the \(K_2\) put, sell the \(K_1\) put.

Equivalently: a synthetic long at \(K_1\) plus a synthetic short at \(K_2\). At expiry you buy at \(K_1\) and sell at \(K_2\), so the box pays \(K_2 - K_1\) in every state. With no uncertainty, its value is just the discounted width:

$$
\text{Box} = (K_2 - K_1)\,e^{-rT}, \qquad r_{\text{box}} = -\frac{1}{T}\,\ln\frac{\text{Box price}}{K_2 - K_1}
$$

where \(K_2 - K_1\) is the strike width (the certain payoff), \(T\) the time to expiry in years and \(r_{\text{box}}\) the **implied box rate**: the interest rate you earn by buying the box at the market price (or pay by selling it).

<figure>
<svg viewBox="0 0 660 230" role="img" aria-label="A box is a bull call spread plus a bear put spread, paying a flat 20">
<line x1="30" y1="170" x2="210" y2="170" class="fx-axis"/>
<polyline points="30,170 90,170 150,70 210,70" class="fx-line-hl"/>
<text x="120" y="28" text-anchor="middle" class="fx-t-b">bull call spread 90/110</text>
<text x="90" y="188" text-anchor="middle" class="fx-t-sm">90</text>
<text x="150" y="188" text-anchor="middle" class="fx-t-sm">110</text>
<text x="225" y="125" text-anchor="middle" class="fx-t-b">+</text>
<line x1="240" y1="170" x2="420" y2="170" class="fx-axis"/>
<polyline points="240,70 300,70 360,170 420,170" class="fx-line-blue"/>
<text x="330" y="28" text-anchor="middle" class="fx-t-b">bear put spread 90/110</text>
<text x="300" y="188" text-anchor="middle" class="fx-t-sm">90</text>
<text x="360" y="188" text-anchor="middle" class="fx-t-sm">110</text>
<text x="440" y="125" text-anchor="middle" class="fx-t-b">=</text>
<line x1="460" y1="170" x2="640" y2="170" class="fx-axis"/>
<rect x="460" y="70" width="180" height="100" class="fx-area-ok"/>
<line x1="460" y1="70" x2="640" y2="70" class="fx-line-thick"/>
<text x="550" y="28" text-anchor="middle" class="fx-t-b">box: always 20</text>
<text x="550" y="62" text-anchor="middle" class="fx-t-ok">20 at every price</text>
<text x="120" y="64" text-anchor="middle" class="fx-t-sm">20</text>
<text x="330" y="64" text-anchor="middle" class="fx-t-sm">20</text>
<text x="330" y="218" text-anchor="middle" class="fx-t-sm">payoff at expiry vs XYZ from 70 to 130 · today: 10.402 + 8.814 = 19.216 = 20e<tspan dy="-6" font-size="11">−0.04</tspan></text>
</svg>
<figcaption>Figure 2 · The box. The call spread pays when XYZ rises, the put spread when it falls, and they fill each other's gaps exactly: the sum is a flat $20. A flat payoff is a bond, so the box must cost the present value of $20.</figcaption>
</figure>

> [!EXAMPLE] Kai's 1-year 90/110 box, and an arbitrage
> Model prices (1 year, σ 20%, r 4%): 90 call 16.06, 110 call 5.66, 110 put 11.35, 90 put 2.53.
> $$
> \text{Box} = \underbrace{(16.06 - 5.66)}_{\text{call spread } 10.402} + \underbrace{(11.35 - 2.53)}_{\text{put spread } 8.814} = 19.216 = 20\,e^{-0.04}
> $$
> (The spreads are shown unrounded; with every leg rounded to the cent the pieces look like 10.40 and 8.82.) Volatility has vanished: change σ and each spread moves, but their sum doesn't.
> **The arbitrage.** Suppose the box is offered at **$19.10** while you can borrow at 4%.
> - Today: buy the box \(-19.10\); borrow \(20\,e^{-0.04} = 19.22\) \(+19.22\). Net **+0.12**.
> - In one year: the box pays \(+20\); repay the loan \(-20\). Net **0**.
>
> Implied box rate: \(-\ln(19.10/20) = 4.60\%\) — you are lending at 4.60% while borrowing at 4%. Per box (×100): $12 today. If instead the box were **bid at $19.40** (an implied rate of 3.05%), you would *sell* it — borrowing at 3.05% — and lend at 4%, collecting \(19.40 - 19.22 = 0.18\) today.

> [!THINK] XYZ's implied volatility doubles from 20% to 40% overnight. What happens to the price of the 90/110 box?
> Each of its two spreads depends on volatility. Predict before you open.
> ---
> Nothing. At 40% the call spread falls from $10.40 to $8.88 (the 110 call gains more than the 90 call), while the put spread rises from $8.81 to $10.33. The sum stays at $19.22 (19.216 unrounded), because the payoff is $20 in every state and volatility only reshuffles *which* spread delivers it.

Notice what the box teaches: the options market contains a **bond market**. Every pair of strikes and every expiry quotes an interest rate, and arbitrage ties that rate to the rates available elsewhere.

### ④ Boxes in practice: implied rates, index boxes, jelly rolls

Because a box has no market risk, its only real ingredients are the interest rate and the credit behind the trade. Listed options are cleared by the OCC, which stands between buyer and seller, so a box on listed options is a loan backed by the clearing house. That makes boxes attractive to some investors and funds as a way to **borrow or lend at close to Treasury-like rates** without going through a bank.

This works cleanly only with **European, cash-settled** options, such as those on the S&P 500 index (SPX). With SPX's multiplier of 100, a box with strikes 1,000 index points apart pays \(100 \times 1{,}000 = \$100{,}000\) at expiry; at 4% for one year it would cost about \(100{,}000\,e^{-0.04} = \$96{,}079\) today.

> [!FACT] Rates to compare a box with
> As of September 25, 2026, the 3-month US Treasury bill yielded about 4.24%, and the Fed funds target range was 3.75–4.00%. A box rate is judged against rates like these: a box priced to yield well above bills is cheap to buy (a good place to lend); one yielding well below is cheap to sell (a good place to borrow). The course's teaching rate of 4% is a round number near these levels.

A related structure spans two expiries. A **jelly roll** is a synthetic long at one expiry and a synthetic short at another, same strike. Since each synthetic is worth \(S - Ke^{-rT}\) for its own \(T\), the roll is worth \(K\,(e^{-rT_1} - e^{-rT_2})\) with no dividends in between: for XYZ's 30- and 60-day 100 strikes, \(100\,(e^{-0.04 \times 30/365} - e^{-0.04 \times 60/365}) = \$0.33\). Traders use jelly rolls to trade financing *between* two expiries — and, for stocks, the dividends expected in between.

> [!DEEP] What a box price really measures
> In theory the box rate is "the" risk-free rate. In practice it reflects the funding costs of the dealers who take the other side, the balance-sheet cost of holding the position, the OCC's margin treatment and, for some investors, tax considerations (index options in the US receive special tax treatment under Section 1256 — check with a tax professional, this is not advice). Box rates therefore usually sit a little above Treasury bills, in the neighbourhood of secured funding rates, and they move with them.

### ⑤ The trap: American boxes and early assignment

The box's "certain" payoff quietly assumed that all four options live until expiry. For **American**, physically settled options — every single-stock and ETF option in the US — that can fail.

Suppose you **sold** a 1-year XYZ 90/110 box for $19.22 (\(\$1{,}922\) per box), effectively borrowing $1,922 until expiry. Your short legs are the 90 call and the 110 put. Three months later XYZ has fallen to **$85**. The 110 put is now $25 in the money with 270 days left, and its American value is exactly its intrinsic value, $25.00: holding it has no time value left, so its owner may rationally exercise. You are assigned: you must **buy 100 shares at $110, paying $11,000 today**.

Economically you are still fine — your remaining legs plus the new shares are worth at least $90 per share at expiry. But the loan you took for $1,922 has just demanded $11,000 of cash. If the account can't fund it, the broker issues a margin call or closes positions at whatever prices the market offers. A dividend adds a second channel: your short call can be exercised the day before an ex-dividend date, leaving you short stock and owing the dividend.

::demo[synthetics-boxes-assign]

> [!WARN] A "riskless" box can wipe out a small account
> In January 2019 a widely shared online post described a retail trader who sold box spreads on American-style single-stock options in a small account at a zero-commission app, believing them riskless. Early assignment reportedly turned the position into a large stock position, and the account reportedly lost many times its original value; the broker reportedly stopped allowing the strategy afterwards. The details are self-reported, but the mechanism is exactly the one above. Boxes are financing tools for **European, cash-settled** options and well-capitalised accounts.

That completes the no-model toolkit of this stage. Here is what it delivered, and what it didn't:

| Tool | What it pins down | What it can't say |
|---|---|---|
| directions ([[price-drivers]]) | the sign of each effect | how big |
| bounds ([[arbitrage-bounds]]) | walls; strike and calendar rules | the level inside the walls |
| forward ([[forwards-carry]]) | exact price of delivery later | anything about options |
| parity ([[put-call-parity]]) | call minus put, exactly | call or put alone |
| synthetics and boxes | any leg from the other three; rates | the price of volatility |

Every rule here holds whatever volatility is. So none of them can say whether Kai's 30-day call is worth $2.45 or $4.73 — that is the job of a model of how XYZ moves.

## @analogy
Think of calls, puts, shares and cash as **four kinds of coins** at a strange exchange where fixed swap rates hold: one call equals one put plus one share minus a bill for \(K\).

With those swap rates you can pay for anything in any mix of coins. Want a share but only have options? Hand over a call and take on a put, plus a bill. Want a put? A call, minus a share, plus a bill. Those are synthetics.

Dealers are the money changers. When customers all bring in the same coin (everyone buying puts), the changers rebalance their drawers with conversions and reversals and keep the swap rates honest.

A box is a strange purchase at this exchange: four coins that, together, turn into exactly $20 of cash next year. Of course that bundle is just a savings bond, and its price is today's value of $20.

Where the analogy breaks: real coins don't get "called in" early. American options do. A box built from coins that the other side can cash in at any moment is not a bond — it's a bond that may suddenly demand you pay $11,000 today.

## @misconceptions
- **"A synthetic long stock is a limited-risk way to own shares."** — Long call + short put has the same P&L as the stock, including the full downside through the short put. It saves cash up front, not risk.
- **"Conversions and reversals are free-money arbitrages."** — For dealers they are daily hedging tools that earn a spread and carry financing, borrow, dividend and pin risks. Genuine riskless gaps are rare and tiny.
- **"A box spread is riskless in any account."** — Only with European, cash-settled options (such as SPX). With American options, early assignment can turn a box into a stock position and a large cash demand.
- **"The box's price depends on volatility."** — The call spread and the put spread each depend on volatility, but in opposite ways; their sum is the discounted width, whatever σ is.
- **"Since parity and boxes pin prices so exactly, options can be priced without a model."** — They pin *relative* prices. The level of every option still depends on volatility, which none of these rules can see.

## @takeaways
- Parity \(C - P = S - B\) is a recipe book: any of call, put, stock and cash can be synthesised from the other three. Protective put = synthetic call; covered call = synthetic short put.
- Long call + short put (same strike) = synthetic long stock: the stock's full risk, for \(C - P = S - Ke^{-rT}\) up front.
- Conversions (stock + put − call = bill) and reversals are how dealers hedge customer flow and enforce parity; pin risk is their leftover.
- A box (bull call spread + bear put spread) pays \(K_2 - K_1\) for sure, so it is worth \((K_2 - K_1)e^{-rT}\): 19.22 for XYZ's 1-year 90/110 box. Its price implies an interest rate.
- Boxes are clean financing only with European, cash-settled options; on American options early assignment can create a large, sudden cash need.
- Every no-arbitrage rule is blind to volatility; pricing the level needs a model.

## @quiz
1. Kai buys the 30-day 100 call ($2.45) and sells the 30-day 100 put ($2.12). What is Kai's position?
   - [ ] A limited-risk bet on a rise, with maximum loss $0.33
   - [x] A synthetic long stock: gains and losses like owning a share bought at $100
   - [ ] A straddle that profits from a big move either way
   - [ ] A riskless position worth $100 at expiry
   > The long call gives the upside, the short put the downside: at expiry Kai effectively buys XYZ at $100 in every state. The $0.33 is not the maximum loss — if XYZ falls to $70, the short put costs $30.
2. Which pair has the same payoff at expiry (same strike and expiry)?
   - [ ] A covered call and a long put
   - [ ] A protective put and a short call
   - [x] A covered call and a short put held with cash
   - [ ] A synthetic long stock and a long call
   > Stock − call = bill − put: a covered call is a synthetic short put (plus cash). That's why covered calls and cash-secured puts at the same strike behave alike.
3. XYZ's 1-year 90/110 box is offered at $19.10. You can borrow at 4%. What is the riskless trade?
   - [x] Buy the box, borrow $19.22 to be repaid with $20 in a year, keep $0.12 today
   - [ ] Sell the box and lend the proceeds at 4%
   - [ ] Buy the box only if volatility is low
   - [ ] There is none: the box depends on where XYZ ends up
   > The box pays exactly $20 in a year, so it is worth \(20\,e^{-0.04} = 19.22\) at a 4% rate. Buying at 19.10 means lending at 4.60%; financing it at 4% leaves $0.12 today and nothing owed later.
4. Why are box spreads normally built with SPX options rather than single-stock options?
   - [ ] SPX options are cheaper
   - [ ] Single-stock options can't be combined into spreads
   - [ ] SPX boxes pay more than their width
   - [x] SPX options are European and cash-settled, so no leg can be assigned early or deliver shares
   > Single-stock options are American and physically settled. An early assignment on a short leg creates a stock position and a cash demand, which breaks the box's "certain payoff" — the trap in part ⑤.
5. A dealer sells puts to a customer and hedges by buying calls and shorting stock at the same strike. What does the dealer hold, and what risks remain?
   - [ ] A directional bet that the stock will rise
   - [x] A reversal: flat on XYZ's direction, but exposed to financing, borrow, dividend and pin risks
   - [ ] A box spread with no risk at all
   - [ ] A straddle that needs volatility to rise
   > Short put + long call = synthetic long stock; with the short shares it nets to zero exposure to XYZ. What's left is the cost of borrowing the shares, interest, dividends, and uncertainty about assignment if the stock pins the strike at expiry.

## @further
- [Box spread — Wikipedia](https://en.wikipedia.org/wiki/Box_spread) — the payoff, the implied rate and the risks of American-style boxes.
- [Put–call parity — Wikipedia](https://en.wikipedia.org/wiki/Put%E2%80%93call_parity) — the identity behind every synthetic in this lesson.
- [Characteristics and Risks of Standardized Options (OCC)](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — exercise, assignment and settlement rules, including the difference between American and European style.
- [OIC — options exercise FAQ](https://www.optionseducation.org/referencelibrary/faq/options-exercise) — when early exercise happens, and why dividends matter.
- [Jelly roll (options) — Wikipedia](https://en.wikipedia.org/wiki/Jelly_roll_(options)) — the two-expiry cousin of the box.

## @next
Everything in this stage held whatever XYZ's volatility was — and that is exactly its limit. To say what Kai's call is actually worth, we need a model of how the stock moves. Next, the simplest one imaginable: XYZ goes to $120 or $80 in one step. It turns out to be enough to price the option exactly — and the real-world probability of going up never enters.
