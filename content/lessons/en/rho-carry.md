---
id: rho-carry
prereqs: forwards-carry, put-call-parity, exercise-assignment, greeks-map, vega
demo: rho-carry
---

# Rho, Dividends & Carry

## @hook
For Kai's 30-day call, a full percentage point on interest rates is worth about 4 cents. For a 2-year call it is worth about a dollar. Rates, dividends and borrow fees are the **carry** of an option: invisible in a short-dated trade, decisive for LEAPS, dividend stocks and hard-to-borrow names — and all three act through one number, the forward.

## @bridge
[[forwards-carry]] showed that the forward \(F = Se^{(r-q)T}\), not the spot, is the center of the option world, and [[put-call-parity]] tied every call to its put through it. [[greeks-map]] listed \(\rho\) as the last first-order Greek, and [[vega]] just finished the big three (spot, time, volatility). This lesson asks: **how do interest rates, dividends and stock-borrow costs move option prices, and when do they matter?** It builds Idea ② (no-arbitrage: carry enters through replication) and Idea ④ (one more measurable slice of risk).

## @intuition
Keep XYZ at $100 and IV at 20%, and look at the **1-year, $100-strike** call and put while only the interest rate changes:

| Risk-free rate r | 0% | 1% | 2% | 3% | **4%** | 5% |
|---|---|---|---|---|---|---|
| 1-year call | $7.97 | $8.43 | $8.92 | $9.41 | **$9.93** | $10.45 |
| 1-year put | $7.97 | $7.44 | $6.94 | $6.46 | **$6.00** | $5.57 |

Three things jump out. At zero rates the at-the-money call and put cost the same. Every extra point of rates adds about 50 cents to the call and takes about 45 cents off the put. And the last column is the textbook check (10.45 and 5.57) you met in [[black-scholes]] — the only difference from Kai's numbers is one point of interest.

Why do rates push the call up? Compare two ways to own XYZ's upside for a year. You can buy the stock and pay $100 today. Or you can buy the call, pay $9.93 today, and **pay the strike only in a year** — if you want the stock then. The call is a way to *defer payment*. The higher the interest rate, the more that deferral is worth, because the $100 you haven't spent sits in the bank earning interest. The put is the mirror: its holder *receives* the strike in a year, and money received later is worth less when rates are higher.

The sensitivity has a name: **rho** (\(\rho\)), the change in price when the risk-free rate rises by one percentage point. For the 1-year call it is \(+0.519\); for the put, \(-0.442\). For Kai's 30-day options it is tiny — \(+0.042\) for the 100 call — because a month of interest on $100 is only about 33 cents in total.

Dividends work the other way. A shareholder receives the dividends; an option holder does not. When XYZ pays out cash, the share price drops by about that amount on the ex-dividend date, so **expected dividends lower the forward: calls get cheaper, puts get dearer**. If XYZ paid a 2% dividend yield, the 1-year call would fall from $9.93 to $8.74 and the put would rise from $6.00 to $6.80.

> [!KAI] Kai asks: should I swap my shares for a 1-year call?
> Kai could sell the 100 shares (\(\$10{,}000\)), buy one 1-year 100 call (\(\$993\)) and park the remaining \(\$9{,}007\) in Treasury bills. At 4% that cash earns about \(\$368\) in a year. Kai keeps the upside above $100 and caps the loss near $993 — but the call's price already charges for that financing: at zero rates the same call would cost only \(\$797\). And if XYZ paid dividends, Kai would give them up too. **Replacing stock with a long-dated call is a financing decision as much as a view** — which is what rho and dividends measure.

> [!THINK] Rates go from 0% to 4% while XYZ stays at $100 and IV at 20%. What happens to the 2-year at-the-money call and put?
> Guess the direction of each, and whether the move is small or large.
> ---
> They split apart. At 0% both cost \(\$11.25\) (the forward equals the strike, so parity makes them equal). At 4% the call costs \(\$15.08\) and the put \(\$7.40\): the call is up about 34%, the put down about 34%. Over two years, four points of rates is a big move in the forward (\(100 \to 108.33\)), and the option market follows the forward.

We'll take it in five parts:

- **① Rho: the formula and why it grows with time**
- **② Rates act through the forward (and through discounting)**
- **③ Dividends: the forward's other lever, and early exercise**
- **④ Borrow costs and hard-to-borrow stocks: carry read from parity**
- **⑤ Carry in a book: when it matters, and the state of play**

## @mechanics
### ① Rho: the formula and why it grows with time

In Black-Scholes the rho of a call and of a put are

$$
\rho_C = K\,T\,e^{-rT}\,\N(d_2), \qquad \rho_P = -K\,T\,e^{-rT}\,\N(-d_2)
$$

where \(K\) is the strike, \(T\) the time to expiry in years, \(e^{-rT}\) the discount factor, and \(\N(d_2)\) the risk-neutral probability that the option finishes in the money. These are raw values (per 1.00 change in \(r\)); divide by 100 for **per percentage point**, the unit traders use and the course engine reports.

Look at the call formula once more: \(Ke^{-rT}\N(d_2)\) is exactly the second term of the Black-Scholes formula — "today's value of the strike you pay" from [[black-scholes]]. Rho is that term times \(T\). The call's rate risk is the risk on the deferred payment of the strike, and it scales with how long the payment is deferred.

> [!EXAMPLE] Rho of Kai's 1-year options
> \(K = 100,\ T = 1,\ e^{-0.04} = 0.9608,\ \N(d_2) = 0.5398\):
> $$
> \rho_C = 100 \times 1 \times 0.9608 \times 0.5398 = 51.87 \;\Rightarrow\; 0.519 \text{ per } 1\%
> $$
> For the put, \(\N(-d_2) = 0.4602\): \(\rho_P = -100 \times 0.9608 \times 0.4602 = -44.21\), i.e. \(-0.442\) per point. Check with the table: at 5% the call is \(\$10.45\), and \(9.93 + 0.52 = 10.45\). Per contract: \(\$51.90\) and \(-\$44.20\) per point.

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Rho of at-the-money calls and puts against time to expiry">
<defs><marker id="rho-carry-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="60" y1="27" x2="600" y2="27" class="fx-grid"/>
<line x1="60" y1="65" x2="600" y2="65" class="fx-grid"/>
<line x1="60" y1="102" x2="600" y2="102" class="fx-grid"/>
<line x1="60" y1="178" x2="600" y2="178" class="fx-grid"/>
<line x1="60" y1="215" x2="600" y2="215" class="fx-grid"/>
<line x1="60" y1="140" x2="612" y2="140" class="fx-axis" marker-end="url(#rho-carry-ah)"/>
<line x1="60" y1="232" x2="60" y2="16" class="fx-axis"/>
<polyline points="60,140 78,136 96,132 114,128 132,124 150,121 168,117 186,113 204,109 222,105 240,101 258,97 276,93 294,90 312,86 330,82 348,78 366,74 384,70 402,67 420,63 438,59 456,56 474,52 492,48 510,45 528,41 546,37 564,34 582,30 600,27" class="fx-line-ok"/>
<polyline points="60,140 78,144 96,147 114,151 132,154 150,157 168,161 186,164 204,167 222,170 240,173 258,176 276,179 294,182 312,185 330,188 348,191 366,193 384,196 402,199 420,201 438,204 456,207 474,209 492,212 510,214 528,217 546,219 564,221 582,224 600,226" class="fx-line-bad"/>
<circle cx="75" cy="137" r="5" class="fx-fill-orange"/>
<circle cx="240" cy="101" r="5" class="fx-fill-green"/>
<circle cx="240" cy="173" r="5" class="fx-fill-red"/>
<circle cx="420" cy="63" r="5" class="fx-fill-green"/>
<circle cx="420" cy="201" r="5" class="fx-fill-red"/>
<text x="66" y="114" class="fx-t-hl">30 days: 0.04</text>
<text x="232" y="88" text-anchor="end" class="fx-t-ok">1 year: +0.52</text>
<text x="232" y="194" text-anchor="end" class="fx-t-bad">1 year: −0.44</text>
<text x="412" y="50" text-anchor="end" class="fx-t-ok">2 years: +1.03</text>
<text x="412" y="228" text-anchor="end" class="fx-t-bad">2 years: −0.82</text>
<text x="540" y="20" text-anchor="end" class="fx-t-ok">call ρ</text>
<text x="600" y="246" text-anchor="end" class="fx-t-bad">put ρ</text>
<text x="52" y="31" text-anchor="end" class="fx-t-sm">1.5</text>
<text x="52" y="69" text-anchor="end" class="fx-t-sm">1.0</text>
<text x="52" y="106" text-anchor="end" class="fx-t-sm">0.5</text>
<text x="52" y="144" text-anchor="end" class="fx-t-sm">0</text>
<text x="52" y="182" text-anchor="end" class="fx-t-sm">−0.5</text>
<text x="52" y="219" text-anchor="end" class="fx-t-sm">−1.0</text>
<text x="240" y="156" text-anchor="middle" class="fx-t-sm">1</text>
<text x="420" y="156" text-anchor="middle" class="fx-t-sm">2</text>
<text x="600" y="156" text-anchor="middle" class="fx-t-sm">3</text>
<text x="604" y="130" text-anchor="end" class="fx-t-sm">years to expiry</text>
</svg>
<figcaption>Figure 1 · Rho per percentage point of the XYZ 100-strike call (green) and put (red), σ 20%, r 4%, against time to expiry. Rho grows almost in proportion to \(T\): it is a rounding error for Kai's 30-day options and a real exposure for two-year LEAPS.</figcaption>
</figure>

| XYZ 100 strike | 7 days | 30 days | 90 days | 180 days | 1 year | 2 years | 3 years |
|---|---|---|---|---|---|---|---|
| Call \(\rho\) per 1% | 0.010 | 0.042 | 0.127 | 0.255 | 0.519 | 1.027 | 1.513 |
| Put \(\rho\) per 1% | −0.009 | −0.040 | −0.117 | −0.228 | −0.442 | −0.819 | −1.147 |

Compare with the other Greeks of the 30-day call: a $1 move in XYZ changes it by \(\$0.53\) (delta), one day by \(-\$0.04\) (theta), one vol point by \(\$0.11\) (vega), a whole point of rates by \(\$0.04\). Rates rarely move a full point in a month, so **for short-dated options rho is the smallest Greek by far**. For long-dated ones it is comparable to vega.

### ② Rates act through the forward (and through discounting)

Rewrite the call price with the forward \(F = Se^{(r-q)T}\) (this is the Black-76 form of [[black-scholes]]):

$$
C = e^{-rT}\,\big[\,F\,\N(d_1) - K\,\N(d_2)\,\big]
$$

where \(e^{-rT}\) discounts the expected payoff to today and the bracket is the expected payoff at expiry in the risk-neutral world. A higher \(r\) now acts through **two channels**:

1. **The forward rises.** The center of the risk-neutral distribution moves up (\(F\) goes from 104.08 to 105.13 when \(r\) goes from 4% to 5% for one year). That helps calls and hurts puts.
2. **Discounting bites harder.** Every payoff, call or put, is worth a little less today.

<figure>
<svg viewBox="0 0 640 240" role="img" aria-label="A higher interest rate moves option prices through the forward and through discounting">
<defs><marker id="rho-carry-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="20" y="92" width="120" height="56" rx="8" class="fx-hl"/>
<text x="80" y="116" text-anchor="middle" class="fx-t-b">rate r</text>
<text x="80" y="136" text-anchor="middle" class="fx-t">4% → 5%</text>
<rect x="200" y="22" width="210" height="76" rx="8" class="fx-box"/>
<text x="305" y="46" text-anchor="middle" class="fx-t-b">① forward rises</text>
<text x="305" y="66" text-anchor="middle" class="fx-t">F = 104.08 → 105.13</text>
<text x="305" y="86" text-anchor="middle" class="fx-t-sm">the distribution's center moves up</text>
<rect x="200" y="142" width="210" height="76" rx="8" class="fx-box"/>
<text x="305" y="166" text-anchor="middle" class="fx-t-b">② discounting bites</text>
<text x="305" y="186" text-anchor="middle" class="fx-t">every payoff worth less today</text>
<text x="305" y="206" text-anchor="middle" class="fx-t-sm">price × T is lost per unit of r</text>
<line x1="140" y1="110" x2="198" y2="62" class="fx-line" marker-end="url(#rho-carry-ah2)"/>
<line x1="140" y1="130" x2="198" y2="178" class="fx-line" marker-end="url(#rho-carry-ah2)"/>
<text x="440" y="50" class="fx-t-ok">call +0.618</text>
<text x="440" y="72" class="fx-t-bad">put −0.382</text>
<text x="440" y="170" class="fx-t-bad">call −0.099</text>
<text x="440" y="192" class="fx-t-bad">put −0.060</text>
<rect x="530" y="92" width="100" height="56" rx="8" class="fx-box2"/>
<text x="580" y="114" text-anchor="middle" class="fx-t-ok">call +0.519</text>
<text x="580" y="136" text-anchor="middle" class="fx-t-bad">put −0.442</text>
<line x1="520" y1="62" x2="560" y2="90" class="fx-line-muted" marker-end="url(#rho-carry-ah2)"/>
<line x1="520" y1="180" x2="560" y2="150" class="fx-line-muted" marker-end="url(#rho-carry-ah2)"/>
</svg>
<figcaption>Figure 2 · Two channels, one Greek. For the XYZ 1-year 100 options, a one-point rise in rates adds \(0.618\) to the call through the forward and takes \(0.099\) away through discounting: net rho \(+0.519\). For the put both channels hurt: \(-0.382 - 0.060 = -0.442\).</figcaption>
</figure>

> [!EXAMPLE] Checking the split
> The forward channel for a call is \(T \cdot S\,\N(d_1) = 1 \times 100 \times 0.6179 = 61.79\), i.e. \(+0.618\) per point; the discounting channel is \(-T \cdot C = -9.93\), i.e. \(-0.099\). Sum: \(0.618 - 0.099 = 0.519\), the rho from ①. For the put: \(-T \cdot S\,\N(-d_1) = -38.21\) and \(-T \cdot P = -6.00\), so \(-0.382 - 0.060 = -0.442\).

This view explains why the stock itself has no "rho" in the model: the stock is the thing you hold, not a deferred claim on it. It also explains why dividends and borrow costs belong in the same lesson. **Anything that changes the forward** — rates, dividends, borrow fees — moves option prices through channel ①, and in opposite directions for calls and puts.

> [!HISTORY] The 2022 rate shock
> In 2022 US policy rates went from near zero at the start of the year to above 4% by its end, and on to a 5.25–5.50% peak in July 2023. Hold XYZ at $100 and IV at 20% and rerun the arithmetic: moving \(r\) from 0.25% to 4.25% takes the 2-year at-the-money call from \(\$11.47\) to \(\$15.34\) and the put from \(\$10.97\) to \(\$7.19\). In real markets stocks and volatility moved at the same time, so rho was one force among several — but for anyone holding LEAPS, or quoting them, it stopped being a footnote.

### ③ Dividends: the forward's other lever, and early exercise

With a continuous dividend yield \(q\), the call formula becomes

$$
C = S\,e^{-qT}\,\N(d_1) - K\,e^{-rT}\,\N(d_2)
$$

where \(Se^{-qT}\) is the stock price minus the present value of the dividends you will not receive, and \(d_1, d_2\) use \(r - q\) in place of \(r\). The sensitivity to \(q\) (sometimes called *psi*) is \(-T\,S\,e^{-qT}\N(d_1)\) for a call and \(+T\,S\,e^{-qT}\N(-d_1)\) for a put: for XYZ's 1-year options, \(-0.618\) and \(+0.382\) per point of dividend yield — the forward channel from ②, with the sign flipped.

| XYZ 1-year 100 strike | q = 0% | 1% | 2% | 3% | 5% |
|---|---|---|---|---|---|
| Forward \(F\) | 104.08 | 103.05 | 102.02 | 101.01 | 99.00 |
| Call | $9.93 | $9.32 | $8.74 | $8.18 | $7.15 |
| Put | $6.00 | $6.39 | $6.80 | $7.22 | $8.10 |

Real stocks pay **discrete** dividends on known dates. The standard adjustment subtracts their present value from the spot: \(F = (S - PV(D))\,e^{rT}\). If XYZ paid one $1 dividend in three months, \(PV(D) = 1 \times e^{-0.04 \times 0.25} = 0.99\); pricing with \(S = 99.01\) gives a 1-year call of \(\$9.32\) and put of \(\$6.39\) — the same as a 1% yield, as you would expect.

Dividends also decide **early exercise of American calls** ([[exercise-assignment]]). Without dividends, exercising a call early throws away time value, so it never pays. Just before an ex-dividend date, though, exercising lets you capture the dividend. Roughly, exercise is worth it when the dividend exceeds what you give up: interest on the strike until expiry, \(K(1 - e^{-r\tau})\), plus the value of the put-like protection (tiny for a deep-in-the-money call).

<figure>
<svg viewBox="0 0 640 230" role="img" aria-label="Exercise before the ex-dividend date versus holding the call">
<defs><marker id="rho-carry-ah3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="20" y="86" width="150" height="62" rx="8" class="fx-hl"/>
<text x="95" y="108" text-anchor="middle" class="fx-t-b">today (cum-dividend)</text>
<text x="95" y="127" text-anchor="middle" class="fx-t">XYZ $100, 80 call</text>
<text x="95" y="143" text-anchor="middle" class="fx-t-sm">$1 dividend, ex tomorrow</text>
<line x1="170" y1="104" x2="248" y2="58" class="fx-line" marker-end="url(#rho-carry-ah3)"/>
<line x1="170" y1="132" x2="248" y2="176" class="fx-line" marker-end="url(#rho-carry-ah3)"/>
<rect x="250" y="20" width="370" height="72" rx="8" class="fx-ok"/>
<text x="266" y="44" class="fx-t-b">exercise now: pay $80, get the share + dividend</text>
<text x="266" y="64" class="fx-t">worth 99 + 1 = 100 → value $20.00</text>
<text x="266" y="82" class="fx-t-sm">gives up: interest on $80 for 29 days ≈ $0.25</text>
<rect x="250" y="140" width="370" height="72" rx="8" class="fx-box2"/>
<text x="266" y="164" class="fx-t-b">hold: XYZ opens ex-dividend at $99</text>
<text x="266" y="184" class="fx-t">call worth ≈ 19 + 0.25 = $19.25</text>
<text x="266" y="202" class="fx-t-sm">misses the $1 dividend</text>
<text x="20" y="222" class="fx-t-sm">29 days left after the ex-date; r 4%, σ 20%; per share (×100 per contract)</text>
</svg>
<figcaption>Figure 3 · A deep in-the-money American call the day before a $1 ex-dividend date. Exercising is worth \(\$20.00\); holding is worth \(\$19.25\) once the stock drops to $99. Because \(1.00 > 80\,(1 - e^{-0.04 \times 29/365}) \approx 0.25\), early exercise wins by \(\$75\) per contract. With a 10-cent dividend it would not.</figcaption>
</figure>

For the **seller** of that call the same arithmetic is a warning: a short in-the-money call on a stock about to go ex-dividend is likely to be assigned the evening before, and the seller then owes the dividend on the shares they are suddenly short. [[american-exercise]] treats the general exercise boundary; high interest rates play the mirror role for American **puts**, where interest earned on the strike can justify early exercise.

### ④ Borrow costs and hard-to-borrow stocks: carry read from parity

To hedge options a market maker must sometimes **short the stock**, which means borrowing it and paying a fee. For most large stocks the fee is small. For a **hard-to-borrow** stock — heavily shorted, few shares to lend — it can be tens of percent a year. The fee enters exactly like a dividend: the short seller pays it, the stock "costs" less to hold short, and the forward falls. Parity with a borrow fee \(b\) reads

$$
C - P = S\,e^{-(q+b)T} - K\,e^{-rT}
$$

where \(q\) is the dividend yield and \(b\) the annual borrow fee, both continuous. Turn it around and the quoted call and put **tell you the market's carry**: the implied forward is \(F = (C - P)\,e^{rT} + K\), and the implied total carry is \(q + b = r - \tfrac{1}{T}\ln(F/S)\).

> [!EXAMPLE] A hard-to-borrow twin of XYZ
> Same $100 price, same 30-day 100 strike, but the call trades at \(\$1.36\) and the put at \(\$3.46\). Implied forward: \(F = (1.36 - 3.46)\,e^{0.04 \times 30/365} + 100 = 97.89\) — below spot, although rates are 4%. Implied carry: \(q + b = 0.04 - \dfrac{\ln(0.9789)}{30/365} \approx 30\%\) a year. If you ignored the borrow and backed out implied vols with \(q = 0\), you would read **10.4% for the call and 31.7% for the put** at the same strike — a huge "skew" that is really just the borrow fee. With the 30% carry included, both are 20%.

::demo[rho-carry-borrow]

The mechanism that keeps quotes in line is the conversion and reversal trades of [[synthetics-boxes]]: a dealer who can borrow the stock cheaply would sell the "expensive" synthetic and buy the real thing. When shares cannot be borrowed at all, that arbitrage breaks, and parity only holds with the true borrow cost in it.

### ⑤ Carry in a book: when it matters, and the state of play

| Situation | Why carry matters | Size for XYZ |
|---|---|---|
| Kai's 30-day options | barely | 100 call \(\rho\) 0.042; Kai's collar (long 95 put, short 105 call): \(-\$3.15\) per contract per point |
| LEAPS (1–3 years) | rho grows with \(T\) | 1-year call \(\rho\) 0.52, 2-year 1.03 per point |
| Dividend stocks | forward lower, early exercise of calls | 2% yield: 1-year call −$1.19, put +$0.80 |
| Hard-to-borrow stocks | forward far below spot; puts look expensive | 30% borrow: 30-day put IV reads 31.7% instead of 20% |
| Box spreads | pure rate exposure | 1-year 90/110 box ≈ \(20e^{-rT} = \$19.22\), \(\rho = -0.19\) per point |

> [!FACT] The rate behind "r = 4%" (as of September 2026)
> The course's 4% is close to real money-market rates: after a 25 bp hike on 16 September 2026 the Fed funds target range is 3.75–4.00%, and the 3-month Treasury bill yielded about 4.24% on 25 September 2026 (Federal Reserve, US Treasury, via the course fact sheet). At these levels, carry is a first-order issue for anyone holding options a year or more — and a market pricing further hikes moves long-dated option prices through rho.

A practical point for the next lesson: rho, like vega, is **not one number in a book**. Short-dated and long-dated rates move differently, and dividends are forecasts that companies can change. Desks bucket rate risk by tenor and treat dividend risk as its own line. [[higher-order-greeks]] adds the last layer: how delta, vega and gamma themselves drift as vol, time and spot move — and how to put everything into one scenario grid.

## @analogy
Imagine you hold a **signed option to buy a rented-out apartment in a year** at a fixed price of $100,000 (in whatever currency you like).

- **Interest (rho).** Until you exercise, your $100,000 stays in your savings account. The higher the interest rate, the more that deferral earns you — so the option to buy later is worth more. Someone holding the right to **sell** the flat to you in a year, and receive the money only then, is worse off when rates rise: rho is negative for them.
- **Rent (dividends).** The current owner collects the rent all year; you, holding only the right to buy, get none of it. The more rent the flat throws off before you take it over, the less your right is worth, and the more a right to sell it is worth. Just before a big rent payment, it may even pay to **take ownership early** — that is early exercise before an ex-dividend date.
- **Longer contracts, bigger effects.** A right that runs for three months barely notices the interest rate; one that runs for three years notices it a lot.

Where the analogy breaks: the borrow fee has no clean equivalent in housing. It comes from people who want to bet *against* a stock paying to borrow shares; when few shares are available, that fee can dwarf interest and dividends and turn the whole call–put relationship on its head.

## @misconceptions
- **"Rho doesn't matter; nobody trades options on rates."** — For 30-day options it barely does (0.04 per point). For a 2-year at-the-money call it is about 1.03 per point — a four-point rate move is worth about $4 per share on a $15 option.
- **"Higher rates make options more expensive."** — Higher rates raise calls and lower puts. The forward rises, which helps calls; discounting hurts both, but the put loses on both channels.
- **"Dividends go to the stockholders, so they don't affect the options."** — They lower the forward: calls get cheaper, puts dearer. A 2% yield takes about $1.19 off XYZ's 1-year call. And they drive early exercise of American calls just before ex-dividend dates.
- **"If the at-the-money put costs more than the call, the market must be bearish."** — Not necessarily. With 4% rates and no dividends the ATM call should cost *more*. A put above the call usually means dividends or a borrow fee are pushing the forward below spot; check the implied carry before reading it as fear.
- **"American calls should never be exercised early."** — True only without dividends. Just before an ex-dividend date a deep in-the-money call is often worth exercising, which is why short in-the-money calls get assigned the night before.

## @takeaways
- Rho is the price change per one-point rise in rates: \(\rho_C = KTe^{-rT}\N(d_2)\); XYZ's 1-year call has \(+0.52\), its put \(-0.44\), its 30-day call only \(+0.04\).
- Rates act through two channels — a higher forward (helps calls, hurts puts) and heavier discounting (hurts both) — so calls gain and puts lose.
- Dividends and borrow fees also act through the forward, in the opposite direction to rates: calls cheaper, puts dearer.
- Parity turns quoted calls and puts into an implied forward and implied carry; a put far above its call often signals dividends or a hard-to-borrow stock, not just fear.
- Carry is small for short-dated options and material for LEAPS, dividend stocks, hard-to-borrow names and box spreads; American calls are exercised early mainly just before dividends.

## @quiz
1. XYZ's 1-year 100 call costs $9.93 with rho 0.519 per point. Rates rise from 4% to 5%, nothing else changes. The call is worth about:
   - [x] $10.45
   - [ ] $9.93, because rho only matters at expiry
   - [ ] $9.41, because higher rates reduce every option's present value
   - [ ] $14.92, because rho is per 0.1 point
   > \(9.93 + 0.519 \approx 10.45\) — the textbook check value, which is Kai's option at 5% instead of 4%. Discounting does reduce the call, but the higher forward adds more.
2. Which long position loses value when interest rates rise, all else equal?
   - [ ] a 1-year call
   - [ ] 100 shares of a non-dividend stock
   - [x] a 1-year put
   - [ ] a 30-day call
   > The put's holder receives the strike later, and both channels hurt it: the higher forward and heavier discounting. XYZ's 1-year put has rho \(-0.44\). The stock has no rate exposure in the model; the calls have positive rho.
3. XYZ, previously paying nothing, announces it will pay a 2% dividend yield. For the 1-year 100 options (r 4%, IV 20%), what happens?
   - [ ] both the call and the put get cheaper
   - [x] the call falls to about $8.74 and the put rises to about $6.80
   - [ ] the call rises, because the stock is now more attractive
   - [ ] nothing, because option holders don't receive dividends
   > Dividends lower the forward (104.08 to 102.02), which lowers calls and raises puts. Option holders don't receive dividends — that is exactly why the options reprice.
4. A $100 stock's 30-day 100 call trades at $1.36 and its 100 put at $3.46 (r = 4%). What is the most likely explanation?
   - [ ] the market expects the stock to fall sharply
   - [ ] the call is mispriced and should be bought
   - [ ] the put has a higher vega than the call
   - [x] the stock is expensive to borrow, which pushes the implied forward below spot
   > Parity gives \(F = (1.36 - 3.46)e^{0.04 \times 30/365} + 100 \approx 97.89\), an implied carry near 30% a year: a borrow fee. With that carry both options price at the same 20% vol. Call and put vega are equal.
5. You are short a deep in-the-money American XYZ 80 call (29 days left after tomorrow). XYZ trades at $100 and goes ex-dividend tomorrow with a $1 dividend. What is the main risk tonight?
   - [ ] the call expires worthless
   - [ ] rho: a rate change overnight
   - [x] early assignment, because exercising now is worth about $20.00 versus $19.25 for holding
   - [ ] nothing — American calls are never exercised early
   > The dividend ($1) exceeds the interest the holder gives up on the $80 strike (about $0.25), so exercising before the ex-date is rational. The seller is then short shares on the ex-date and owes the dividend.

## @further
- [Options Industry Council — options exercise FAQ](https://www.optionseducation.org/referencelibrary/faq/options-exercise) — when early exercise and assignment happen, including around dividends.
- [Merton (1973), Theory of Rational Option Pricing](https://doi.org/10.2307/3003143) — the paper that added dividends to the model and proved when American calls are never exercised early.
- [Put–call parity — Wikipedia](https://en.wikipedia.org/wiki/Put%E2%80%93call_parity) — the relation with dividends and carry, and its use to infer forwards.
- [Federal Reserve — FOMC statement, 16 September 2026](https://www.federalreserve.gov/newsevents/pressreleases/monetary20260916a.htm) — the rate decision behind this course's 4% assumption.

## @next
Every first-order Greek is now on the table. But none of them sits still: delta drifts when implied vol moves, vega grows as options move out of the money, and a hedge set on Friday is wrong by Monday even if nothing trades. The next lesson measures how the Greeks themselves change — and puts a whole position into one spot-by-vol grid.
