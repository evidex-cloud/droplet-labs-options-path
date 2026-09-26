---
id: theta
prereqs: intrinsic-time-value, black-scholes, greeks-map, delta, gamma
demo: theta
---

# Theta: Time Decay and the Bill for Gamma

## @hook
Kai's 30-day call loses $0.044 a day just by existing — $4.36 per contract, weekends included. With one day left, the same option loses $0.21 a day. That is not a penalty: it is the rent for gamma. And for XYZ the rent has a simple breakeven — the stock must move about $1.05 a day, whatever the strike or expiry.

## @bridge
[[intrinsic-time-value]] split a premium into intrinsic value and time value, and showed that time value must reach zero at expiry. [[gamma]] showed that owning an option means owning curvature, which pays off on moves in either direction. This lesson connects the two: **how fast does time value melt, and what exactly does that melting pay for?** The answer is the Black-Scholes equation from [[black-scholes]] read as a budget: theta is the bill, gamma is what you bought. It builds Idea ④ (risk: gamma and theta are two sides of one coin) and Idea ③ (volatility: the breakeven is the implied daily move).

## @intuition
Kai owns the **30-day XYZ 100 call**, worth $2.45 (XYZ $100, implied volatility 20%, rate 4%; illustrative). Suppose nothing happens tomorrow: XYZ stays at $100, IV stays at 20%. The call is then worth about $2.41. It lost **$0.044** — its **theta** — for one calendar day of waiting. Per contract that is \(0.0436 \times 100 = \$4.36\) a day.

Theta is not constant. Hold the stock still and watch the same at-the-money call age:

- 60 days left: loses $0.032 a day
- 30 days left: loses $0.044 a day
- 7 days left: loses $0.084 a day
- 1 day left: loses **$0.214** a day — half its remaining value

Time value melts slowly at first and then fast. For an at-the-money option, value shrinks roughly like the square root of the time left, so the last week holds a surprising share of it: of the $2.45 the 30-day call is worth, $1.14 is still there with 7 days to go — and all of it disappears in that final week.

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Value of XYZ 100, 105 and 110 calls as expiry approaches, stock held at 100">
<defs><marker id="theta-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="50" y1="220" x2="615" y2="220" class="fx-axis" marker-end="url(#theta-ah)"/>
<line x1="60" y1="228" x2="60" y2="15" class="fx-axis" marker-end="url(#theta-ah)"/>
<polyline points="60,42 69,44 78,45 87,47 96,48 105,50 114,52 123,54 132,55 141,57 150,59 159,60 168,62 177,64 186,66 195,68 204,69 213,71 222,73 231,75 240,77 249,79 258,81 267,83 276,85 285,87 294,89 303,91 312,93 321,95 330,97 339,100 348,102 357,104 366,106 375,109 384,111 393,114 402,116 411,119 420,121 429,124 438,126 447,129 456,132 465,135 474,138 483,141 492,144 501,148 510,151 519,155 528,159 537,163 546,167 555,172 564,177 573,183 582,190 591,199 600,220" class="fx-line-thick"/>
<polyline points="60,141 69,142 78,143 87,145 96,146 105,148 114,149 123,150 132,152 141,153 150,155 159,156 168,158 177,159 186,160 195,162 204,163 213,165 222,166 231,168 240,169 249,171 258,172 267,174 276,175 285,177 294,178 303,180 312,181 321,183 330,184 339,186 348,187 357,189 366,191 375,192 384,194 393,195 402,197 411,198 420,200 429,201 438,203 447,204 456,206 465,207 474,209 483,210 492,212 501,213 510,214 519,216 528,217 537,218 546,218 555,219 564,220 573,220 582,220 591,220 600,220" class="fx-line-blue"/>
<polyline points="60,191 69,191 78,192 87,193 96,194 105,195 114,196 123,196 132,197 141,198 150,199 159,200 168,200 177,201 186,202 195,203 204,204 213,204 222,205 231,206 240,207 249,207 258,208 267,209 276,209 285,210 294,211 303,211 312,212 321,213 330,213 339,214 348,214 357,215 366,215 375,216 384,216 393,217 402,217 411,217 420,218 429,218 438,219 447,219 456,219 465,219 474,219 483,220 492,220 501,220 510,220 519,220 528,220 537,220 546,220 555,220 564,220 573,220 582,220 591,220 600,220" class="fx-line-btc"/>
<circle cx="330" cy="97" r="4" class="fx-fill-orange"/>
<circle cx="537" cy="163" r="4" class="fx-fill-orange"/>
<circle cx="591" cy="199" r="4" class="fx-fill-orange"/>
<text x="338" y="90" class="fx-t-hl">30 d: 2.45, −0.044/day</text>
<text x="528" y="178" text-anchor="end" class="fx-t-hl">7 d: 1.14, −0.084</text>
<text x="578" y="200" text-anchor="end" class="fx-t-hl">1 d: 0.42, −0.214</text>
<text x="54" y="224" text-anchor="end" class="fx-t-sm">0</text>
<text x="54" y="174" text-anchor="end" class="fx-t-sm">1</text>
<text x="54" y="124" text-anchor="end" class="fx-t-sm">2</text>
<text x="54" y="74" text-anchor="end" class="fx-t-sm">3</text>
<text x="60" y="238" text-anchor="middle" class="fx-t-sm">60</text>
<text x="195" y="238" text-anchor="middle" class="fx-t-sm">45</text>
<text x="330" y="238" text-anchor="middle" class="fx-t-sm">30</text>
<text x="465" y="238" text-anchor="middle" class="fx-t-sm">15</text>
<text x="600" y="238" text-anchor="middle" class="fx-t-b">0</text>
<text x="612" y="254" text-anchor="end" class="fx-t-sm">days left (time flows left to right)</text>
<text x="80" y="30" class="fx-t">— 100 call (at the money)</text>
<text x="100" y="132" class="fx-t-blue">— 105 call</text>
<text x="100" y="182" class="fx-t-btc">— 110 call</text>
</svg>
<figcaption>Figure 1 · Value of three XYZ calls as expiry approaches, with the stock held at $100 and IV at 20%. The at-the-money curve bends down ever faster — the famous decay curve. The 110 call, far out of the money, has lost almost everything by the last two weeks: out-of-the-money options decay earlier, not later.</figcaption>
</figure>

> [!KAI] Kai pays rent, and collects it
> As a buyer of the 100 call, Kai pays **$4.36 a day** per contract. As the seller of the covered 105 call, Kai *collects* its theta: \(0.0308 \times 100 = \$3.08\) a day. The protective 95 put costs \(0.0217 \times 100 = \$2.17\) a day. The collar, which sells one and buys the other, nets about +$0.91 a day. Every option trade is also a statement about who pays time and who collects it.

Why would anyone pay rent? Because the option also gives something back every day: **gamma**. In [[gamma]] a hedged call earned \(\tfrac12\Gamma(\dd S)^2\) from each move, up or down. So each day is a race between the gamma gain, which depends on how far XYZ moves, and the rent, which is fixed. Where is the finish line?

For the 30-day call, the part of theta that pays for gamma is **$0.038 a day** (the remaining $0.006 is interest, explained below). The gamma gain equals that rent when

$$
\tfrac12 \times 0.0693 \times (\dd S)^2 = 0.038 \quad\Longrightarrow\quad |\dd S| = \sqrt{\frac{2 \times 0.038}{0.0693}} \approx \$1.05
$$

Where \(\dd S\) is the day's stock move and 0.0693 the call's gamma. If XYZ moves more than about **$1.05** in a day (either way), the hedged option wins the day; less, and the rent wins. And $1.05 is no accident: it is \(100 \times 0.20/\sqrt{365}\), the **one-standard-deviation daily move implied by 20% volatility**.

> [!THINK] The 1-day option pays $0.214 a day — five times the 30-day's rent. Does it need a five-times-bigger daily move to break even?
> Predict first.
> ---
> No — it needs the **same $1.05**. Its gamma is also about 5.5 times larger (0.381 vs 0.069), and gamma and rent scale together: \(\sqrt{2 \times 0.209/0.381} = 1.05\). Only the stakes change. On a day XYZ doesn't move, the hedged 1-day option loses $20.88 per contract against $3.80 for the 30-day; on a $2 day it makes $55.33 against $10.07.

<figure>
<svg viewBox="0 0 640 240" role="img" aria-label="One day's hedged P&L of 30-day and 1-day ATM calls against the day's stock move">
<defs><marker id="theta-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="211" y="20" width="218" height="180" class="fx-area-bad"/>
<line x1="50" y1="164" x2="615" y2="164" class="fx-axis" marker-end="url(#theta-ah2)"/>
<line x1="320" y1="205" x2="320" y2="15" class="fx-axis" marker-end="url(#theta-ah2)"/>
<line x1="211" y1="20" x2="211" y2="200" class="fx-line-hl fx-dash"/>
<line x1="429" y1="20" x2="429" y2="200" class="fx-line-hl fx-dash"/>
<polyline points="60,23 73,39 86,55 99,70 112,84 125,98 138,110 151,122 164,132 177,142 190,151 203,159 216,167 229,173 242,179 255,183 268,187 281,190 294,192 307,194 320,194 333,194 346,192 359,190 372,187 385,183 398,179 411,173 424,167 437,159 450,151 463,142 476,132 489,122 502,110 515,98 528,84 541,70 554,55 567,39 580,23" class="fx-line-bad"/>
<polyline points="60,138 73,141 86,144 99,147 112,150 125,152 138,154 151,156 164,158 177,160 190,162 203,163 216,164 229,166 242,167 255,168 268,168 281,169 294,169 307,169 320,169 333,169 346,169 359,169 372,168 385,168 398,167 411,166 424,164 437,163 450,162 463,160 476,158 489,156 502,154 515,152 528,150 541,147 554,144 567,141 580,138" class="fx-line-thick"/>
<text x="211" y="216" text-anchor="middle" class="fx-t-hl">−1.05</text>
<text x="429" y="216" text-anchor="middle" class="fx-t-hl">+1.05</text>
<text x="112" y="230" text-anchor="middle" class="fx-t-sm">−2</text>
<text x="528" y="230" text-anchor="middle" class="fx-t-sm">+2</text>
<text x="314" y="128" text-anchor="end" class="fx-t-sm">+25</text>
<text x="314" y="92" text-anchor="end" class="fx-t-sm">+50</text>
<text x="314" y="56" text-anchor="end" class="fx-t-sm">+75</text>
<text x="325" y="186" class="fx-t-sm">−3.80</text>
<text x="325" y="206" class="fx-t-bad">−20.88</text>
<text x="66" y="186" class="fx-t-bad">— 1-day ATM call</text>
<text x="66" y="204" class="fx-t">— 30-day ATM call</text>
<text x="222" y="50" class="fx-t-sm">rent wins</text>
<text x="612" y="184" text-anchor="end" class="fx-t-sm">day's move dS ($)</text>
<text x="314" y="24" text-anchor="end" class="fx-t-sm">$ per contract</text>
</svg>
<figcaption>Figure 2 · One day in the life of a delta-hedged at-the-money call: gamma gain minus gamma rent, per contract. Both parabolas cross zero at the same place, \(\pm\$1.05\) — the implied daily move. The 1-day option is the same bet with five-and-a-half times the stakes.</figcaption>
</figure>

::demo[theta-breakeven]

We'll take it in five parts:

- **① The theta formula**: two pieces, volatility and interest
- **② The shape of decay**: at the money, out of the money, in the money
- **③ The gamma–theta trade-off**: the Black-Scholes equation as a budget
- **④ Calendar days, trading days and weekends**
- **⑤ Who collects theta, and what it really pays for**

## @mechanics
### ① The theta formula

Theta is the change in value as time passes, everything else fixed. For a call and a put in Black-Scholes (no dividends), per year:

$$
\Theta_C = -\frac{S\,\varphi(d_1)\,\sigma}{2\sqrt{T}} - rKe^{-rT}\N(d_2), \qquad \Theta_P = -\frac{S\,\varphi(d_1)\,\sigma}{2\sqrt{T}} + rKe^{-rT}\N(-d_2)
$$

Where \(\varphi(d_1)\) is the normal density at \(d_1\), \(\sigma\) the volatility, \(T\) the years left, \(r\) the rate, \(K\) the strike and \(\N(\cdot)\) the normal cumulative probability. Divide by 365 for theta per calendar day. The two pieces have different meanings:

- **The volatility piece** \(-S\varphi(d_1)\sigma/(2\sqrt{T})\) is the same for calls and puts. It is the melting of time value — the rent for gamma. It grows like \(1/\sqrt{T}\), which is why decay accelerates.
- **The interest piece** is about financing the strike. A call holder will pay \(K\) later rather than now; as time passes, that deferral is worth less, so it costs the call a little. A put holder will *receive* \(K\) later; as time passes, that receipt gets closer, so it *helps* the put.

> [!EXAMPLE] Kai's call and put, per day
> 30-day XYZ 100, \(\varphi(0.086) = 0.3975\), \(\sqrt{30/365} = 0.2867\), \(\N(d_2) = 0.5114\):
> $$
> \begin{aligned}
> \Theta_C &= -\frac{100 \times 0.3975 \times 0.20}{2 \times 0.2867} - 0.04 \times 100\,e^{-0.04 \times 0.0822} \times 0.5114 = -13.86 - 2.04 = -15.90 \text{ per year} \\
> \Theta_C &= -15.90 / 365 = -0.0436 \text{ per day}
> \end{aligned}
> $$
> The put shares the \(-13.86\) but *adds* \(+1.95\) of interest: \(-11.92\) per year, or \(-0.0326\) per day. That is why the standard table shows the call at −0.044 and the put at −0.033.

### ② The shape of decay

Because at-the-money time value is roughly \(0.4\,S\sigma\sqrt{T}\) ([[intrinsic-time-value]]), it falls along a square-root curve and theta grows like \(1/\sqrt{T}\). Different strikes decay very differently:

| Days left | 100 call (ATM) | theta/day | % of price | 105 call | theta/day | % of price | 110 call | % of price |
|---|---|---|---|---|---|---|---|---|
| 60 | 3.56 | −0.032 | 0.9% | 1.59 | −0.027 | 1.7% | 0.59 | 2.9% |
| 30 | 2.45 | −0.044 | 1.8% | 0.71 | −0.031 | 4.3% | 0.14 | 8.4% |
| 14 | 1.64 | −0.061 | 3.7% | 0.22 | −0.029 | 13% | 0.01 | 30% |
| 7 | 1.14 | −0.084 | 7.4% | 0.05 | −0.018 | 39% | 0.00 | — |
| 1 | 0.42 | −0.214 | 51% | 0.00 | 0.000 | — | 0.00 | — |

Three patterns (stock held at $100):

- **At the money**, theta in dollars keeps growing until the very end. The option is worth the most, and its time value melts the fastest in the final days.
- **Out of the money**, theta in dollars peaks *earlier* and then fades, because there is less and less left to lose. As a **percentage** of the price, though, out-of-the-money options decay the fastest: the 110 call loses 8.4% of its value per day at 30 days. Buying cheap far-out-of-the-money options and waiting is a steady leak.
- **In the money**, most of the price is intrinsic value, which does not decay. The 30-day 95 call is worth $5.82, of which only $0.82 is time value; its theta is −0.032 a day, just 0.55% of the price.

A technical footnote from [[greeks-map]]: when rates are positive, a deep in-the-money *European* put can have positive theta — the interest piece outweighs the tiny time value. For American options this is exactly the situation where early exercise becomes attractive ([[exercise-assignment]]).

### ③ The gamma–theta trade-off

[[black-scholes]] derived the pricing equation from a hedge: hold the option, short \(\Delta\) shares, and the combination must earn the risk-free rate. Written out:

$$
\Theta + \tfrac12\,\sigma^2 S^2\,\Gamma + rS\,\Delta - rV = 0
$$

Where \(\Theta\) is per year, \(\Gamma\) and \(\Delta\) are the option's gamma and delta, \(V\) its value, \(r\) the rate. Read it as a daily budget for a delta-hedged option:

- \(\Theta\): what time takes;
- \(\tfrac12\sigma^2S^2\Gamma\): what gamma earns *on average* if the stock moves exactly as much as implied volatility says;
- \(rS\Delta - rV\): interest — the hedger is short \(\Delta\) shares (earning interest on the proceeds) and has paid \(V\) for the option (losing interest on it).

The budget balances to zero: **in a fair market, the hedged option neither gains nor loses on average.** If rates were zero, the equation would reduce to

$$
\Theta \approx -\tfrac12\,\Gamma\,S^2\sigma^2
$$

Where the units are per year: theta is minus half of gamma times the variance of the stock's dollar moves. This is the precise version of "you pay theta to rent gamma".

> [!EXAMPLE] The 30-day call's daily budget
> \(\tfrac12 \times 0.20^2 \times 100^2 \times 0.0693 = 13.86\) per year, or **0.0380** per day: the gamma rent. The interest terms: \(rS\Delta = 0.04 \times 100 \times 0.534 = 2.14\) per year (0.0059 a day) and \(rV = 0.04 \times 2.45 = 0.098\) per year (0.0003 a day). Check the budget per day: \(-0.0436 + 0.0380 + 0.0059 - 0.0003 = 0.0000\). Of the call's $0.044 daily theta, $0.038 buys gamma and $0.006 is financing.

Now make the gamma term concrete. Over one day, the hedged option gains \(\tfrac12\Gamma(\dd S)^2\) from the actual move and pays \(\tfrac12\Gamma S^2\sigma^2\,\dd t\) in rent (with \(\dd t = 1/365\)). They are equal when

$$
|\dd S| = S\,\sigma\sqrt{\dd t} = \frac{100 \times 0.20}{\sqrt{365}} = \$1.05
$$

Where \(S\sigma\sqrt{\dd t}\) is one standard deviation of the daily move implied by \(\sigma\). Gamma cancels out — which is why **every** XYZ option at 20% implied volatility has the same breakeven, from the 1-day to the 1-year. At 25% implied volatility the breakeven would be $1.31.

| ATM XYZ 100 call | \(\Gamma\) | Gamma rent / day (per contract) | Breakeven move | Hedged P&L, quiet day | Hedged P&L, $2 day |
|---|---|---|---|---|---|
| 30 days | 0.069 | $3.80 | $1.05 | −$3.80 | +$10.07 |
| 1 day | 0.381 | $20.88 | $1.05 | −$20.88 | +$55.33 |

> [!KEY] Theta pays for implied volatility; gamma collects realized volatility
> A long option hedged daily wins when the stock's actual moves are bigger than implied volatility predicted, and loses when they are smaller. So the gamma–theta trade-off is really **realized vs implied volatility**, Idea ③ in its purest form. Short-dated options don't change the bet; they raise the stakes. Running this trade on purpose is gamma scalping ([[delta-hedging]]); being on the other side of it, on average, is the variance risk premium ([[variance-risk-premium]]).

### ④ Calendar days, trading days and weekends

This course measures time in **calendar days / 365**, so theta is per calendar day and a weekend costs three days: holding XYZ and IV fixed, the 30-day call goes from $2.45 on Friday to about $2.32 on Monday, a loss of \(\$0.134\) — three days of theta.

Markets are messier. The stock can't move on Saturday, so a weekend carries far less *realized* variance than three weekdays. Many desks therefore count volatility in **trading days** (about 252 a year) or give weekends and holidays reduced weight. Under that clock, the same annual theta is spread over fewer days: \(-15.90/252 = -0.063\) per trading day instead of −0.044 per calendar day. It is common for option prices to reflect the coming weekend in advance, so the "Monday loss" a calendar-day model shows is partly an artifact of the clock. Either way, the lesson for a buyer is the same: time you wait is time you pay for.

> [!WARN] Very short options decay by the hour
> An option with one day left loses about half its value per day if nothing happens. For same-day options the clock runs in hours: the entire premium is time value, and it goes to zero by the close unless the stock moves enough. That is why 0DTE options feel like lottery tickets to buyers and like steady income to sellers — until a big move arrives ([[zero-dte]]).

### ⑤ Who collects theta, and what it really pays for

Every theta a buyer pays, a seller collects. Positive-theta positions include the covered call Kai already runs ([[covered-call]]), cash-secured puts, and short strangles and iron condors ([[iron-condor]]). All of them are **short gamma**: they earn the rent on quiet days and pay out on large moves, in proportion to the square of the move.

Is the rent, on average, too high? Historically, for the S&P 500, somewhat. From about 1990 to 2024 the VIX (implied volatility) averaged about **19.6%**, while the subsequently realized volatility averaged about **15.5%** — a gap of roughly 4 volatility points (CFA Institute, July 2024). That gap is the variance risk premium: the average reward for selling gamma. It turns sharply negative in crashes, which is exactly when short-gamma positions lose the most.

> [!FACT] Theta as a product, as of mid-2026
> Selling option premium is now a large retail product. Morningstar's derivative-income ETF category — funds that sell calls or puts to generate income — grew from under $1 billion at the end of 2020 to about **$180 billion by mid-2026** (as reported; category definitions vary). Their distributions are largely collected theta. A high distribution yield is not the same as a high total return: covered-call funds give up much of the upside and keep most of the downside.

So theta is neither a tax on buyers nor free money for sellers. It is the market price of gamma, set by implied volatility. Whether it is a good deal depends on how much the stock will actually move — something neither side knows in advance. The next stage turns these Greeks into strategy choices, starting with how to pick strike and expiry for a long option ([[long-options]]).

## @analogy
Think of **renting a surfboard by the day**.

The rental shop sets the daily price from the wave forecast — that is implied volatility. You pay the rent every day whether or not the waves come — that is theta. You profit only from the waves you actually ride, and a big wave is worth far more than two small ones — that is gamma, paying off on the square of the move.

Whether renting was worth it comes down to one comparison: **were the real waves bigger than the forecast?** If yes, you rode enough to beat the rent; if the sea was flat, you paid for nothing. The breakeven wave height doesn't depend on which board you rent — only on the forecast. A short rental (a 1-day option) costs much more per day, but on it every wave is a much bigger thrill: same breakeven, higher stakes.

The shop, meanwhile, collects rent every calm day and pays out on the stormy ones. On average shops charge a little more than the waves deliver — the variance risk premium — but one storm can cost a season of rent.

Where the analogy breaks: a surfboard's price doesn't change while you hold it. An option's "rent rate" does — the forecast (implied volatility) can jump or collapse overnight, changing the option's value through vega ([[vega]]). And the board loses value evenly; an option's time value melts faster and faster as the rental period runs out.

## @misconceptions
- **"Time value melts at a steady rate."** — For at-the-money options it accelerates: XYZ's 100 call loses $0.032 a day with 60 days left, $0.044 with 30, $0.084 with 7 and $0.214 with 1.
- **"Theta is free money for option sellers."** — It is payment for being short gamma. A delta-hedged seller loses on every day the stock moves more than about $1.05 (for XYZ at 20% implied vol), and gap days can cost weeks of theta.
- **"A 1-day option needs a huge move to break even because its theta is huge."** — Its gamma is just as huge. The breakeven daily move is \(S\sigma/\sqrt{365}\), the same $1.05 for every XYZ option; short-dated options only raise the stakes.
- **"Out-of-the-money options decay slowly because their theta is small."** — Small in dollars, fast in percent: the 30-day 110 call loses 8.4% of its value a day, versus 1.8% for the at-the-money call.
- **"Weekends are free — the market is closed."** — In a calendar-day model a weekend costs three days of theta. In practice prices tend to anticipate weekends, but the time still has to be paid for.

## @takeaways
- Theta is the value lost per day with everything else fixed: −0.044 a day ($4.36 per contract) for Kai's 30-day call, growing to −0.214 with one day left.
- The formula has a volatility piece (the rent for gamma, growing like \(1/\sqrt{T}\)) and an interest piece (hurts calls, helps puts).
- At the money, decay accelerates toward expiry; out of the money, it comes earlier and is fastest in percentage terms; in the money, most of the price doesn't decay.
- The Black-Scholes equation is a budget: \(\Theta + \tfrac12\sigma^2S^2\Gamma + rS\Delta - rV = 0\); of the call's $0.044, $0.038 is gamma rent.
- A hedged option breaks even when the stock moves \(S\sigma/\sqrt{365}\) a day — about $1.05 for XYZ — for every strike and expiry: theta pays for implied volatility, gamma collects realized volatility.

## @quiz
1. Kai's 30-day call has theta −0.044 per day. XYZ and IV don't change from Friday's close to Monday's close. In the course's calendar-day model, about how much does one contract lose?
   - [ ] $4.40 — only one trading day passed
   - [x] About $13 — three calendar days passed
   - [ ] Nothing — the market was closed
   - [ ] $44 — theta is per contract per day already
   > Three calendar days × $0.044 × 100 ≈ $13 (exact: $13.37). Many desks weight weekends less, and prices often anticipate them, but time is still being paid for.
2. XYZ's implied volatility is 20%. What daily move does a delta-hedged, at-the-money **1-day** call need to break even?
   - [ ] About $0.21 — its daily theta
   - [ ] About $5.73 — the 30-day one-standard-deviation move
   - [ ] About $2.40 — five times the 30-day option's breakeven
   - [x] About $1.05 — the same as for the 30-day option
   > The breakeven is \(S\sigma/\sqrt{365} = 100 \times 0.2/19.1 = \$1.05\). The 1-day option's rent is 5.5 times larger, but so is its gamma, so they cancel. Only the stakes differ.
3. With XYZ at $100 and 30 days left, which call loses the largest **percentage** of its price per day?
   - [ ] The 95 call (in the money)
   - [ ] The 100 call (at the money)
   - [x] The 110 call (out of the money)
   - [ ] They all lose the same percentage
   > The 110 call loses about 8.4% a day, the 100 call 1.8%, the 95 call 0.55%. Out-of-the-money options are all time value, and much of it is gone well before expiry.
4. In the Black-Scholes equation \(\Theta + \tfrac12\sigma^2S^2\Gamma + rS\Delta - rV = 0\), what does the \(\tfrac12\sigma^2S^2\Gamma\) term represent?
   - [x] What gamma earns on average if the stock moves as much as implied volatility predicts
   - [ ] The interest earned on the hedge
   - [ ] The option's intrinsic value
   - [ ] The loss from a drop in implied volatility
   > It is the expected gamma gain per year when realized variance equals \(\sigma^2\). Theta pays exactly for it (plus interest terms), so a hedged option breaks even on average in a fair market.
5. Kai holds a delta-hedged 30-day ATM call. Today XYZ moves $1.50. Roughly what is the hedged P&L for the day, per contract (ignoring the small interest terms)?
   - [ ] −$3.80 — theta always wins
   - [ ] +$7.80 — the gamma gain alone
   - [x] About +$4.00 — gamma gain $7.80 minus gamma rent $3.80
   - [ ] +$150 — the move times 100
   > \(100 \times (\tfrac12 \times 0.0693 \times 1.5^2 - 0.038) = 100 \times (0.078 - 0.038) \approx \$4.00\). A move bigger than the $1.05 breakeven beats the rent.

## @further
- [Greeks (finance): Theta — Wikipedia](https://en.wikipedia.org/wiki/Greeks_(finance)#Theta) — formulas for calls and puts, with and without dividends.
- [Black & Scholes (1973), The Pricing of Options and Corporate Liabilities](https://doi.org/10.1086/260062) — the hedging argument behind the gamma–theta budget.
- [CFA Institute: How well does the market predict volatility?](https://blogs.cfainstitute.org/investor/2024/07/31/how-well-does-the-market-predict-volatility/) — VIX vs subsequently realized volatility over three decades.
- [Carr & Wu (2009), Variance Risk Premiums](https://academic.oup.com/rfs/article-abstract/22/3/1311/1581057) — the academic measurement of what theta sellers earn on average.
- [Characteristics and Risks of Standardized Options (OCC)](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the official disclosure on time decay and option risks.

## @next
Delta, gamma and theta all assumed implied volatility stays put. It doesn't — and when it moves, the option's price moves with it, sometimes more than from the stock itself. That sensitivity is vega, and it is why buying options before earnings can lose money even when you guess the direction right. Next: [[vega]].
