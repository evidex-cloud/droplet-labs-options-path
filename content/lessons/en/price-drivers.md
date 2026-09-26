---
id: price-drivers
prereqs: intrinsic-time-value, before-expiry, option-chain
demo: price-drivers
---

# The Six Drivers of an Option's Price

## @hook
Every option price on a screen is a function of just six numbers: the stock price, the strike, the time left, the volatility, the interest rate and the dividend. Five of them you can read off a screen. One — volatility — you have to guess. Turn each dial on Kai's XYZ option and watch which way the price must move, and why some of those directions can be proved with a trade, no model needed.

## @bridge
The Beginner tier taught what options are and how they trade: [[intrinsic-time-value]] split a premium into intrinsic value plus time value, [[before-expiry]] showed today's price curve riding above the expiry hockey stick, and [[option-chain]] put a whole screen of prices in front of you. This lesson opens the Principles tier by asking the most basic pricing question: **what does an option's price depend on, and in which direction?** It builds Idea ② — no-arbitrage (several of the directions can be forced by a trade, without any model) — and Idea ③ — volatility (the one input nobody can see).

## @intuition
Start from Kai's standard option. XYZ trades at $100, and the 30-day call with a $100 strike costs **$2.45** (for illustration, with volatility 20%, interest rate 4% and no dividend). The matching put costs **$2.12**. Per contract that is \(2.45 \times 100 = \$245\) and \(2.12 \times 100 = \$212\).

Now turn one dial at a time and leave the other five alone. Every number below comes from the course's pricing engine, but the *directions* are what matter:

| Dial | Turned from → to | 30-day 100 call | 30-day 100 put |
|---|---|---|---|
| Stock price \(S\) | $100 → $105 | 2.45 → **5.91** ↑ | 2.12 → **0.58** ↓ |
| Strike \(K\) | $100 → $105 | 2.45 → **0.71** ↓ | 2.12 → **5.37** ↑ |
| Time to expiry \(T\) | 30 → 60 days | 2.45 → **3.56** ↑ | 2.12 → **2.91** ↑ |
| Volatility \(\sigma\) | 20% → 30% | 2.45 → **3.59** ↑ | 2.12 → **3.26** ↑ |
| Interest rate \(r\) | 4% → 8% | 2.45 → **2.62** ↑ | 2.12 → **1.97** ↓ |
| Dividend yield \(q\) | 0% → 2% | 2.45 → **2.36** ↓ | 2.12 → **2.20** ↑ |

Each row has a one-sentence story.

- **Stock price.** A call is the right to *buy* at $100. The higher XYZ trades, the more that right is worth; the put, the right to *sell* at $100, loses value.
- **Strike.** Raising the strike means the call holder must pay more to buy, so the call is worth less; the put holder gets to sell for more, so the put is worth more.
- **Time.** More time means more chances for a big move, and for a call it also means paying the strike later. Both options usually gain.
- **Volatility.** Bigger swings help the option holder in one direction and cannot hurt beyond the premium in the other. That lopsidedness is the convexity of Idea ① ([[linear-vs-convex]]), so **both calls and puts gain from volatility**.
- **Interest rate.** A call lets you pay $100 *later*; when cash earns more interest, paying later is worth more. A put pays you $100 later, and money received later is worth less when rates are high.
- **Dividends.** A dividend goes to shareholders, not option holders, and the share price drops by about the dividend when it is paid. That hurts calls and helps puts.

<figure>
<svg viewBox="0 0 660 300" role="img" aria-label="Six dials that set an option's price">
<rect x="20" y="20" width="200" height="120" rx="10" class="fx-box"/>
<text x="120" y="46" text-anchor="middle" class="fx-t-b">Stock price S</text>
<text x="120" y="68" text-anchor="middle" class="fx-t-sm">100 → 105</text>
<text x="120" y="96" text-anchor="middle" class="fx-t-ok">call ↑ 2.45 → 5.91</text>
<text x="120" y="120" text-anchor="middle" class="fx-t-bad">put ↓ 2.12 → 0.58</text>
<rect x="230" y="20" width="200" height="120" rx="10" class="fx-box"/>
<text x="330" y="46" text-anchor="middle" class="fx-t-b">Strike K</text>
<text x="330" y="68" text-anchor="middle" class="fx-t-sm">100 → 105</text>
<text x="330" y="96" text-anchor="middle" class="fx-t-bad">call ↓ 2.45 → 0.71</text>
<text x="330" y="120" text-anchor="middle" class="fx-t-ok">put ↑ 2.12 → 5.37</text>
<rect x="440" y="20" width="200" height="120" rx="10" class="fx-box"/>
<text x="540" y="46" text-anchor="middle" class="fx-t-b">Time T</text>
<text x="540" y="68" text-anchor="middle" class="fx-t-sm">30 → 60 days</text>
<text x="540" y="96" text-anchor="middle" class="fx-t-ok">call ↑ 2.45 → 3.56</text>
<text x="540" y="120" text-anchor="middle" class="fx-t-ok">put ↑ 2.12 → 2.91 (usually)</text>
<rect x="20" y="155" width="200" height="120" rx="10" class="fx-hl"/>
<text x="120" y="181" text-anchor="middle" class="fx-t-b">Volatility σ (hidden)</text>
<text x="120" y="203" text-anchor="middle" class="fx-t-sm">20% → 30%</text>
<text x="120" y="231" text-anchor="middle" class="fx-t-ok">call ↑ 2.45 → 3.59</text>
<text x="120" y="255" text-anchor="middle" class="fx-t-ok">put ↑ 2.12 → 3.26</text>
<rect x="230" y="155" width="200" height="120" rx="10" class="fx-box"/>
<text x="330" y="181" text-anchor="middle" class="fx-t-b">Interest rate r</text>
<text x="330" y="203" text-anchor="middle" class="fx-t-sm">4% → 8%</text>
<text x="330" y="231" text-anchor="middle" class="fx-t-ok">call ↑ 2.45 → 2.62</text>
<text x="330" y="255" text-anchor="middle" class="fx-t-bad">put ↓ 2.12 → 1.97</text>
<rect x="440" y="155" width="200" height="120" rx="10" class="fx-box"/>
<text x="540" y="181" text-anchor="middle" class="fx-t-b">Dividend yield q</text>
<text x="540" y="203" text-anchor="middle" class="fx-t-sm">0% → 2%</text>
<text x="540" y="231" text-anchor="middle" class="fx-t-bad">call ↓ 2.45 → 2.36</text>
<text x="540" y="255" text-anchor="middle" class="fx-t-ok">put ↑ 2.12 → 2.20</text>
<text x="330" y="294" text-anchor="middle" class="fx-t-sm">XYZ 30-day, K = 100 · base: call 2.45, put 2.12 · one dial moved at a time</text>
</svg>
<figcaption>Figure 1 · The six dials. Only volatility (shaded) is not printed anywhere: you must estimate it or read it back out of prices. Notice that σ is the only dial that pushes calls and puts the <em>same</em> way (both up) — apart from time, which usually does too.</figcaption>
</figure>

> [!KAI] Kai checks the 60-day call
> Kai expected the 60-day call to cost twice the 30-day one — twice the time, twice the price? It costs $3.56, not $4.90. Time value grows roughly like the *square root* of time: \(\sqrt{2} \approx 1.41\), and \(2.45 \times 1.41 \approx 3.46\) — close to the real $3.56 (the rest is interest). The square-root rule gets its own lesson in [[random-walk]].

Five of the six dials are printed somewhere: the stock price on the quote screen, the strike and expiry on the contract, the interest rate in the Treasury-bill market, the dividend in the company's announcements. **Volatility is not printed anywhere.** It describes how much XYZ *will* move, and the future is not on any screen. That single fact explains why the options market ends up quoting prices in volatility ([[implied-vol]]).

This stage asks how much we can say about option prices *without any model of how the stock moves*. The surprising answer: quite a lot. Several arrows in the table can be proved by showing that the opposite would hand someone free money.

We'll take it in five parts:

- **① The sign table**, stated precisely
- **② Directions you can prove with a trade**: the strike
- **③ Time: the dial with an exception**
- **④ Rates and dividends act through the forward**
- **⑤ Five you can see, one you can't**: which dial matters most right now

## @mechanics
### ① The sign table, stated precisely

Write the call price as a function of its six inputs, \(C = C(S, K, T, \sigma, r, q)\), and the put price the same way. "Which direction" means the sign of a partial derivative: how the price changes when one input moves a little and the others stay fixed.

$$
\frac{\partial C}{\partial S} > 0,\quad \frac{\partial C}{\partial K} < 0,\quad \frac{\partial C}{\partial \sigma} > 0,\quad \frac{\partial C}{\partial r} > 0,\quad \frac{\partial C}{\partial q} < 0
$$

$$
\frac{\partial P}{\partial S} < 0,\quad \frac{\partial P}{\partial K} > 0,\quad \frac{\partial P}{\partial \sigma} > 0,\quad \frac{\partial P}{\partial r} < 0,\quad \frac{\partial P}{\partial q} > 0
$$

Here \(\partial C/\partial S\) reads "the change in the call price per $1 change in the stock, everything else held fixed". Time is left out on purpose: its sign has an exception (part ③).

The *sizes* of these derivatives have names you will meet in [[greeks-map]]: \(\partial V/\partial S\) is **delta** (\(\Delta\)), \(\partial V/\partial \sigma\) is **vega** (\(\nu\)), \(\partial V/\partial r\) is **rho** (\(\rho\)), and the change as a day passes is **theta** (\(\Theta\)). For Kai's standard options they are:

| Sensitivity, 30-day 100 strike | Call | Put | Read it as |
|---|---|---|---|
| per $1 in \(S\) (delta) | +0.53 | −0.47 | stock +$1 → call +$0.53, put −$0.47 |
| per 1 vol point in \(\sigma\) (vega) | +0.114 | +0.114 | σ 20% → 21% → both +$0.11 |
| per day passing (theta) | −0.044 | −0.033 | tomorrow, all else equal, the call is worth $0.04 less |
| per 1% in \(r\) (rho) | +0.042 | −0.040 | small for a 30-day option |
| per 1% in \(q\) | −0.044 | +0.038 | also small at 30 days |

> [!EXAMPLE] Reading the table with numbers
> XYZ rises from $100 to $101 and nothing else changes. Delta predicts the call moves from $2.45 to about \(2.45 + 0.53 \times 1 = \$2.98\), and the put from $2.12 to about \(2.12 - 0.47 \times 1 = \$1.65\). Per contract: \(0.53 \times 100 = +\$53\) and \(-0.47 \times 100 = -\$47\).
> Delta is a slope, so it is only exact for small moves: the 5-dollar jump in the first table took the call to $5.91, more than \(2.45 + 5 \times 0.534 = 5.12\), because the slope itself steepens as the call goes in the money ([[gamma]]).

Notice that the call delta and the put delta differ by exactly one: \(0.53 - (-0.47) = 1\). That is not a coincidence; it comes from put-call parity ([[put-call-parity]]), the conservation law of this stage.

### ② Directions you can prove with a trade: the strike

Some arrows in the sign table need a model of how the stock moves. Others do not: you can prove them with a trade. The cleanest is the strike.

**Claim:** with the same expiry, a call with a lower strike can never be worth less than a call with a higher strike. In symbols, for \(K_1 < K_2\):

$$
C(K_1) \;\ge\; C(K_2)
$$

where \(C(K_1)\) is the price of the call struck at \(K_1\) and \(C(K_2)\) the price of the call struck at \(K_2\), same stock, same expiry.

The argument is a thought experiment. Suppose the rule broke — suppose the higher-strike call were *more* expensive. Then you could buy the cheap low-strike call, sell the dear high-strike call, and pocket the difference. At expiry, the call you own pays \(\max(S_T - K_1, 0)\) and the call you sold costs you \(\max(S_T - K_2, 0)\). Because \(K_1 < K_2\), the first is always at least as large as the second, so **the position can never lose at expiry**. You were paid to enter a trade that can only make money: an **arbitrage**, a riskless profit that needs no forecast.

> [!EXAMPLE] A worked arbitrage: the inverted strikes
> Suppose a stale quote shows the 30-day XYZ **105** call bid at **$2.50** while the **100** call is offered at **$2.40**. (Fair values are $0.71 and $2.45.)
> - **Today:** buy the 100 call for $2.40, sell the 105 call for $2.50. Net cash \(= -2.40 + 2.50 = +\$0.10\) per share, \(+\$10\) per pair of contracts.
> - **At expiry,** the pair is a bull call spread:
>   - \(S_T \le 100\): both expire worthless → $0.
>   - \(100 < S_T < 105\): the 100 call pays \(S_T - 100\), the 105 call nothing → between $0 and $5.
>   - \(S_T \ge 105\): the 100 call pays \(S_T - 100\), you owe \(S_T - 105\) → exactly $5.
>
> Worst case: keep the $0.10. Best case: $5.10 per share. Nobody who could see this quote would leave it there, which is exactly why **real prices fall as the strike rises**.

The same kind of argument gives a *speed limit* on the fall. The spread's payoff never exceeds \(K_2 - K_1\), so its price today can't exceed the present value of that width:

$$
C(K_1) - C(K_2) \;\le\; (K_2 - K_1)\,e^{-rT}
$$

where \(e^{-rT}\) is the discount factor, the value today of $1 paid at expiry (\(e^{-0.04 \times 30/365} = 0.9967\) for 30 days). For the 100 and 105 calls: \(2.45 - 0.71 = 1.74 \le 5 \times 0.9967 = 4.98\). Fine. The next lesson, [[arbitrage-bounds]], collects all the rules of this kind.

<figure>
<svg viewBox="0 0 660 250" role="img" aria-label="Call and put prices across strikes">
<line x1="60" y1="200" x2="610" y2="200" class="fx-axis"/>
<line x1="60" y1="200" x2="60" y2="16" class="fx-axis"/>
<polyline points="60,26.3 87,43.4 114,60.5 141,77.5 168,94.5 195,111.2 222,127.5 249,142.9 276,156.9 303,169.1 330,179.0 357,186.6 384,191.9 411,195.5 438,197.6 465,198.8 492,199.5 519,199.8 546,199.9 573,200.0 600,200.0" class="fx-line-hl"/>
<polyline points="60,200.0 87,200.0 114,200.0 141,199.9 168,199.8 195,199.5 222,198.7 249,197.0 276,193.9 303,189.0 330,181.8 357,172.3 384,160.6 411,147.0 438,132.1 465,116.2 492,99.7 519,83.0 546,66.0 573,49.0 600,31.9" class="fx-line-blue"/>
<circle cx="330" cy="179" r="5" class="fx-fill-orange"/>
<circle cx="397.5" cy="193.9" r="5" class="fx-fill-orange"/>
<line x1="330" y1="172" x2="330" y2="110" class="fx-line-muted fx-dash"/>
<text x="330" y="104" text-anchor="middle" class="fx-t-hl">100 call 2.45</text>
<text x="405" y="186" class="fx-t-hl">105 call 0.71</text>
<text x="120" y="52" class="fx-t-hl">calls: fall as K rises</text>
<text x="372" y="44" class="fx-t-blue">puts: rise as K rises</text>
<text x="60" y="218" text-anchor="middle" class="fx-t-sm">80</text>
<text x="195" y="218" text-anchor="middle" class="fx-t-sm">90</text>
<text x="330" y="218" text-anchor="middle" class="fx-t-sm">100</text>
<text x="465" y="218" text-anchor="middle" class="fx-t-sm">110</text>
<text x="600" y="218" text-anchor="middle" class="fx-t-sm">120</text>
<text x="600" y="240" text-anchor="end" class="fx-t-sm">strike K (XYZ at 100, 30 days)</text>
<text x="52" y="30" text-anchor="end" class="fx-t-sm">20</text>
<text x="52" y="116" text-anchor="end" class="fx-t-sm">10</text>
<text x="52" y="204" text-anchor="end" class="fx-t-sm">0</text>
</svg>
<figcaption>Figure 2 · The same day's calls and puts across strikes. The call curve can only go down as the strike rises, and never falls faster than the discounted strike gap; the put curve is its mirror. A quote that points the wrong way (the "105 above 100" example) is a free lunch.</figcaption>
</figure>

For the other dials, a trade argument works too, but with more care. For volatility, the direction comes from convexity: an option's payoff bends upward, so spreading out the possible outcomes raises its average value ([[linear-vs-convex]]). Saying *how much* it rises, though, needs a model of the distribution — that is where the trees of [[binomial-one-step]] and the formula of [[black-scholes]] come in.

### ③ Time: the dial with an exception

"More time is worth more" is true for most options, and for **American** options (exercisable any day) it is always true: a longer-dated American option gives you every right the shorter one gives, plus extra days. If it were cheaper, you would buy it and sell the short one; if the short one were exercised against you, you could exercise the long one on the same day.

For **European** options (exercisable only at expiry), there are exceptions, and they are instructive.

> [!THINK] Can a longer-dated option ever be *cheaper*?
> Take a European put on XYZ with a $150 strike — very deep in the money, since XYZ is at $100. Would you pay more for the 1-year version than for the 30-day version?
> ---
> No. The 30-day put is worth about **$49.51**; the 1-year put only about **$44.44**. The put's value is mostly "receive $150 at expiry, hand over a share worth about $100". Receiving $150 in a year instead of in a month costs a year of interest: \(150 \times (1 - e^{-0.04}) \approx \$5.88\). The extra optionality of a longer life is worth little when the put is this deep. An American holder would simply exercise now and collect the full $50 — which is why the American version of this put is worth exactly $50 at both maturities.

Two more wrinkles, which later lessons treat in detail:

- **Calls on non-dividend stocks:** longer is always worth more, European or American, because the call's floor \(S - Ke^{-rT}\) itself rises with \(T\) (you pay the strike later). The details of these floors are in [[arbitrage-bounds]].
- **Dividends:** a long-dated European call may be worth less than a shorter one if a big dividend falls in between — the longer option lives through the payout, which drops the stock. This is also why American calls are sometimes exercised early, right before a dividend ([[exercise-assignment]]).

### ④ Rates and dividends act through the forward

Interest and dividends look like separate dials, but they act through one number: the **forward price**, the fair price today for buying the stock at expiry. With continuous rates,

$$
F = S\,e^{(r - q)T}
$$

where \(S\) is the spot price, \(r\) the interest rate, \(q\) the dividend yield and \(T\) the time to expiry in years. Buying later lets you keep your cash in the bank (\(+r\)) but you miss the dividends (\(-q\)). For XYZ: \(F = 100\,e^{0.04 \times 30/365} = \$100.33\) at 30 days and \(100\,e^{0.04} = \$104.08\) at one year.

An option is really a bet on where the stock ends up, and the forward is the centre of that bet. Raise \(r\) and the forward moves up: calls gain, puts lose. Raise \(q\) and the forward moves down: calls lose, puts gain. The next lesson but one, [[forwards-carry]], builds this price from a trade.

> [!EXAMPLE] When interest is zero, the ATM call and put cost the same
> Set \(r = 0\) (and \(q = 0\)). The 30-day 100 call and the 100 put are then both worth **$2.29**. At \(r = 4\%\) the call is $2.45 and the put $2.12: their gap is \(0.33\), exactly \(S - Ke^{-rT} = 100 - 99.67\).
> At 30 days this is small change. At one year it isn't: the 100 call is $9.93 and the put $6.00, a gap of $3.93. **Rates matter a lot for long-dated options** — the 1-year call's rho is about 0.52 per 1%, so a 1-point rise in rates adds about \(0.52 \times 100 = \$52\) per contract.

Dividends also have a borrowing cousin. If a stock is hard to borrow for short sellers, lenders charge a fee, and that fee plays exactly the role of \(q\): it lowers the forward, cheapens calls and richens puts. [[put-call-parity]] shows how to read that fee out of the option prices.

### ⑤ Five you can see, one you can't

Which of the six inputs is actually uncertain when you price an option?

| Input | Where it comes from | Certainty |
|---|---|---|
| \(S\) | the stock's quote | observed (up to the bid-ask spread) |
| \(K\) | the contract | fixed |
| \(T\) | the calendar | fixed (calendar days ÷ 365 in this course) |
| \(r\) | Treasury bills / money-market rates | observed; which rate to use is a small choice |
| \(q\) | announced and expected dividends, borrow fees | mostly known; forecasts for long-dated options |
| \(\sigma\) | **the future** | **unobservable** — estimated from history ([[realized-vol]]) or implied from prices ([[implied-vol]]) |

> [!FACT] Why the course uses r = 4%
> As of September 2026, the 3-month US Treasury bill yielded about 4.24% and the Fed funds target range was 3.75–4.00% after a quarter-point hike on September 16, 2026. The course's round 4% is a teaching constant close to those levels, not a forecast.

Which dial matters most depends on the option. The widget below moves each input by a "typical" amount — the stock by 1%, volatility by one point, the clock by one day, the rate and the dividend yield by a quarter point — and shows how much the price changes.

::demo[price-drivers-which]

For Kai's 30-day option, the stock price dominates (a 1% move shifts the call by about $0.57), volatility comes second ($0.11 per point), and one day of time costs $0.04; a quarter-point in the rate or the dividend yield moves it by only about a cent. Switch to a one-year option and the picture changes: a vol point is now worth $0.38 (more than three times as much), and a quarter-point in rates ($0.13) outweighs a day of decay ($0.016) eight times over. That is the practical reason traders talk so much about volatility: **for a given stock price, it is the biggest input nobody agrees on**.

## @analogy
Think of an option as a **price lock on a house** you might buy: you hold the right, not the obligation, to buy the house for a fixed price \(K\) at any time before the lock expires.

- **The house's value today (\(S\)).** The more the house is worth, the more your fixed-price lock is worth.
- **The locked price (\(K\)).** A lock at $500,000 beats a lock at $550,000 on the same house — nobody would pay more for the worse lock. That is the strike argument of part ②, and it needs no model of house prices at all.
- **How long the lock lasts (\(T\)).** A longer lock gives the market more time to move your way.
- **How jumpy the local market is (\(\sigma\)).** In a sleepy market the lock is worth little; in a volatile one, a big rise could make it very valuable, while a fall only means you walk away.
- **The interest rate (\(r\)).** While you wait, your down payment sits in the bank earning interest. The higher the rate, the nicer it is to pay later.
- **The rent (\(q\)).** Meanwhile, the current owner collects the rent. You don't. The more rent the house throws off, the less the lock is worth.

Here is where the analogy breaks. You cannot sell a house short, nor rebuild it from cash and a mortgage in a few seconds, so house locks trade on opinion. Stock options are different: the stock and cash markets are deep enough that some of these arrows are enforced by arbitrageurs every second, and the rest of this stage shows how far that enforcement goes.

## @misconceptions
- **"If I'm right about the direction, my call will make money."** — Direction is only one of six dials. The stock can rise while time passes and implied volatility falls, and the call can still lose; [[before-expiry]] walks through that surprise.
- **"Volatility helps calls and hurts puts."** — Volatility raises both. It is the one dial (with time, usually) that pushes calls and puts the same way, because both payoffs are convex.
- **"Longer-dated options are always more expensive."** — True for American options and for calls on non-dividend stocks. A deep in-the-money European put can be cheaper at one year ($44.44) than at 30 days ($49.51), because receiving the strike later costs interest.
- **"Interest rates don't matter for options."** — For a 30-day option they barely do (rho ≈ 0.04 per 1%). For a one-year option rho is about 0.52 per 1%, or $52 per contract, and for multi-year options it is larger still.
- **"All six inputs are equally uncertain."** — Five are observed or fixed. Only volatility is a forecast, which is why the market quotes option prices as volatilities.

## @takeaways
- An option price depends on six inputs: \(S, K, T, \sigma, r, q\). Calls rise with \(S\), \(\sigma\), \(r\) and usually \(T\); they fall with \(K\) and \(q\). Puts mirror them except for \(\sigma\) and usually \(T\).
- Some directions can be proved by a trade: if a higher-strike call ever cost more than a lower-strike call, buying the cheap one and selling the dear one would be a riskless profit.
- Time has an exception: a deep in-the-money European put can lose value as expiry lengthens, because the strike is received later.
- Rates and dividends act through the forward \(F = Se^{(r-q)T}\): a higher forward helps calls and hurts puts.
- Five inputs are visible; volatility is not. That makes volatility the central quantity of options trading.

## @quiz
1. XYZ's 30-day 105 call is bid at $2.50 while the 30-day 100 call is offered at $2.40. What is the riskless trade?
   - [ ] Buy the 105 call and sell the 100 call
   - [x] Buy the 100 call and sell the 105 call, collecting $0.10 now
   - [ ] Buy both calls; the stock will probably rise
   - [ ] There is no trade without knowing the volatility
   > The lower-strike call must be worth at least as much as the higher-strike one. Buying the 100 call and selling the 105 call earns $0.10 now, and the resulting bull call spread pays between $0 and $5 at expiry — it can never lose. No volatility estimate is needed; that is what makes it an arbitrage.
2. Which single input moves the 30-day 100 call and the 30-day 100 put in the same direction, always?
   - [ ] The stock price
   - [ ] The interest rate
   - [x] The volatility
   - [ ] The dividend yield
   > Higher volatility raises both, because both payoffs are convex: large moves help one side without limit and cost at most the premium on the other. Stock price, rates and dividends push calls and puts in opposite directions.
3. Interest rates rise from 4% to 8%, nothing else changes. What happens to XYZ's 30-day 100 call and put?
   - [ ] Both rise
   - [ ] The call falls, the put rises
   - [ ] Nothing — rates don't affect options
   - [x] The call rises (to about $2.62) and the put falls (to about $1.97)
   > Higher rates push up the forward price \(Se^{rT}\): paying the strike later is worth more to the call holder, receiving it later is worth less to the put holder. At 30 days the effect is small; at one year it is several times larger.
4. A European put with strike $150 on XYZ (at $100) is worth $49.51 with 30 days left and $44.44 with one year left. Why is the longer one cheaper?
   - [ ] Because volatility is lower over one year
   - [x] Because the put's value is mostly receiving $150 at expiry, and receiving it a year later costs interest
   - [ ] It is a pricing error that should be arbitraged
   - [ ] Because puts always lose value with time
   > Deep in the money, the put behaves like a claim on the discounted strike. Waiting a year costs about \(150 \times (1 - e^{-0.04}) \approx 5.88\) of interest, more than the extra optionality is worth. An American put avoids this by allowing exercise today, so it is worth $50 at both maturities.
5. Of the six inputs, which one can a trader NOT read off a screen or a contract?
   - [ ] The interest rate
   - [ ] The time to expiry
   - [ ] The dividend yield
   - [x] The volatility over the option's life
   > Stock price, strike, time, rate and (mostly) dividends are observed or fixed. The volatility over the option's life lies in the future, so it must be estimated or backed out of market prices as implied volatility.

## @further
- [Merton (1973), Theory of Rational Option Pricing](https://doi.org/10.2307/3003143) — the paper that proved many of these directions and bounds from no-arbitrage alone, before assuming any model.
- [Greeks (finance) — Wikipedia](https://en.wikipedia.org/wiki/Greeks_(finance)) — the sizes of each sensitivity, with formulas for delta, vega, theta and rho.
- [Options Industry Council — education](https://www.optionseducation.org/) — plain-language material on what moves option prices, from the industry's education body.
- [New Finance Path (sister course)](https://evidex-cloud.github.io/droplet-labs-finance-path/) — interest rates, discounting and dividends explained from the ground up.

## @next
Directions are a start, but how far can a price actually go? Could Kai's 30-day call cost $0.10, or $50? The next lesson draws the hard walls — the arbitrage bounds — that no price can cross without handing someone free money.
