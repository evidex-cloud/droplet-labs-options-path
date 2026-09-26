---
id: smile-skew
prereqs: implied-vol, bs-assumptions, moneyness
demo: smile-skew
---

# The Volatility Smile & Skew

## @hook
If Black-Scholes were right, every strike on XYZ's 30-day chain would imply the same 20%. In a typical equity market they don't: the 90 put trades near 25 vol, the 110 call near 19. Plot implied vol against strike and you get a curve — the **skew**. It is the market's price for crash risk, and a map of exactly where it thinks the bell curve is wrong.

## @bridge
[[implied-vol]] turned every option price into its own implied volatility. [[bs-assumptions]] listed what Black-Scholes gets wrong: fat tails, jumps, volatility that moves. This lesson puts the two together: **line up the implied vols of one expiry by strike, and the broken assumptions become visible as a curve.** It builds Idea ③ (volatility — now a whole curve rather than one number), with a thread of Idea ② (the curve must obey no-arbitrage, and it encodes a probability distribution, [[risk-neutral-density]]). Next, [[term-structure]] adds the time dimension and turns the curve into a surface.

## @intuition
Take XYZ's 30-day options (spot $100, rate 4%) and compute each strike's implied vol. Here is what a typical equity-style market looks like (illustrative numbers, generated with a standard smile model):

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Implied volatility by strike: flat Black-Scholes line versus an equity skew">
<line x1="60" y1="220" x2="610" y2="220" class="fx-axis"/>
<line x1="60" y1="40" x2="60" y2="220" class="fx-axis"/>
<line x1="60" y1="167.1" x2="610" y2="167.1" class="fx-line-muted fx-dash"/>
<line x1="60" y1="114.1" x2="610" y2="114.1" class="fx-grid"/>
<line x1="60" y1="61.2" x2="610" y2="61.2" class="fx-grid"/>
<text x="52" y="224" text-anchor="end" class="fx-t-sm">15%</text>
<text x="52" y="171" text-anchor="end" class="fx-t-sm">20%</text>
<text x="52" y="118" text-anchor="end" class="fx-t-sm">25%</text>
<text x="52" y="65" text-anchor="end" class="fx-t-sm">30%</text>
<rect x="70" y="40" width="260" height="180" class="fx-area-bad"/>
<polyline points="70,54.5 96,65.8 122,77.2 148,88.6 174,100.2 200,111.9 226,123.6 252,135.4 278,146.9 304,157.7 330,167.0 356,173.8 382,177.7 408,179.4 434,179.9 460,179.8 486,179.2 512,178.4 538,177.5 564,176.5 590,175.4" class="fx-line-thick"/>
<circle cx="200" cy="111.9" r="5" class="fx-fill-red"/>
<circle cx="265" cy="141.2" r="5" class="fx-fill-red"/>
<circle cx="330" cy="167" r="5" class="fx-fill-ink"/>
<circle cx="395" cy="178.7" r="5" class="fx-fill-green"/>
<circle cx="460" cy="179.8" r="5" class="fx-fill-green"/>
<text x="208" y="104" class="fx-t-bad">90 put 25.2%</text>
<text x="273" y="134" class="fx-t-bad">95 put 22.4%</text>
<text x="338" y="160" class="fx-t">ATM 20.0%</text>
<text x="395" y="200" text-anchor="middle" class="fx-t-ok">105 call 18.9%</text>
<text x="490" y="200" class="fx-t-ok">110 call 18.8%</text>
<text x="600" y="160" text-anchor="end" class="fx-t-sm">Black-Scholes: flat 20%</text>
<text x="80" y="58" class="fx-t-sm">OTM puts: dearer</text>
<text x="70" y="238" text-anchor="middle" class="fx-t-sm">80</text>
<text x="200" y="238" text-anchor="middle" class="fx-t-sm">90</text>
<text x="330" y="238" text-anchor="middle" class="fx-t-sm">100</text>
<text x="460" y="238" text-anchor="middle" class="fx-t-sm">110</text>
<text x="590" y="238" text-anchor="middle" class="fx-t-sm">120</text>
<text x="600" y="254" text-anchor="end" class="fx-t-sm">strike (XYZ at 100, 30 days)</text>
</svg>
<figcaption>Figure 1 · Black-Scholes says one number (dashed); the market draws a curve. Strikes below spot — where out-of-the-money puts live — carry several extra vol points; strikes above carry slightly fewer, with a small uptick far out. The downward slope is the skew; the curvature is the smile.</figcaption>
</figure>

What do those vol points mean in dollars? Price each option at its own implied vol and compare with the flat-20% Black-Scholes price:

| Option (30-day) | Implied vol | Market price | Flat 20% price | Ratio |
|---|---|---|---|---|
| 90 put | 25.2% | $0.20 | $0.06 | 3.3× |
| 95 put | 22.4% | $0.69 | $0.51 | 1.36× |
| 100 call | 20.0% | $2.45 | $2.45 | 1.00× |
| 105 call | 18.9% | $0.62 | $0.71 | 0.87× |
| 110 call | 18.8% | $0.10 | $0.14 | 0.74× |

**Far out-of-the-money puts cost several times their textbook price; out-of-the-money calls cost less.** The at-the-money option, the one everybody quotes, hides all of this.

> [!KAI] Kai's collar in a skewed market
> With flat vol, Kai's collar was neat: buy the 95 put for $0.51, sell the 105 call for $0.71, collect a **net credit of $0.20**. In the skewed market the put costs $0.69 and the call brings in only $0.62: the collar now costs a **net debit of $0.07** (\(0.62 - 0.69 = -0.07\), or −$7 per contract). Nothing about XYZ's spot, rate or ATM vol changed. The skew alone moved $27 per contract against the hedger — which is exactly why protection is more expensive than the flat-vol textbook suggests ([[protective-put-collar]]).

> [!THINK] The 90 put trades at $0.20, over three times its flat-vol price of $0.06. Is the market simply overpaying — should everyone sell 90 puts?
> Decide before you open the answer.
> ---
> Not simply. The $0.06 assumes returns follow a bell curve with 20% vol, under which a fall below $90 in a month has a risk-neutral probability of about 3.1%. The market's prices imply about 5.2% ([[risk-neutral-density]] shows how to read that off the smile). History supports fatter left tails: on 19 October 1987 the S&P 500 fell 20.5% in one day — more than 16 daily standard deviations at 20% vol, an event a bell curve says should essentially never happen. Put sellers do earn a premium on average ([[variance-risk-premium]]), but they are paid for carrying that tail, and the tail occasionally arrives ([[tail-hedging]]).

So implied vol is not one number per stock. It is a **function of strike** (and, next lesson, of expiry). The smile is how the market patches Black-Scholes: keep the formula, but feed each strike its own σ so that the formula reproduces prices that reflect fat tails, crash fear and supply and demand.

We'll take it in six parts:

- **① Reading a smile**: axes, moneyness and which options to use
- **② Three shapes**: equity skew, FX smile, commodity and crypto variations
- **③ Why equities skew**: 1987, fat tails, the leverage effect, and who buys and sells
- **④ Measuring it**: the 25-delta risk reversal and butterfly
- **⑤ When the stock moves**: sticky strike versus sticky delta
- **⑥ What the smile means**: prices, probabilities, no-arbitrage and models

## @mechanics
### ① Reading a smile

A smile is drawn for **one underlying and one expiry**. The vertical axis is implied vol. The horizontal axis comes in three common flavors.

**Strike** \(K\) is what you see on a chain (Figure 1). But a $10 distance means something different for a 7-day and a 1-year option, so for comparisons traders use **log-moneyness** relative to the forward, or its standardized version:

$$
k = \ln\frac{K}{F}, \qquad z = \frac{\ln(K/F)}{\sigma\sqrt{T}}
$$

where \(F = Se^{(r-q)T}\) is the forward price ([[forwards-carry]]), \(\sigma\) the ATM vol and \(\sqrt{T}\) the square root of time to expiry. \(z\) counts how many standard deviations the strike sits from the forward ([[moneyness]]). For the 30-day 90 strike: \(F = 100.33\), \(k = \ln(90/100.33) = -0.109\) and \(z = -0.109/(0.20 \times 0.287) = -1.9\) — about two standard deviations below the forward. The same 90 strike on a 1-year option is much closer (\(z \approx -0.7\)).

**Delta** is the third flavor: traders label points by the delta of the option there — the “25-delta put” (about the 96.4 strike on XYZ's 30-day chain) and the “25-delta call” (about 104.2). Delta rescales automatically with vol and time.

Which options are used? By put-call parity ([[put-call-parity]]) a call and a put at the same strike share one implied vol, so the smile is a property of the **strike**, not of calls or puts. In practice desks read the left side from **out-of-the-money puts** and the right side from **out-of-the-money calls**, because OTM options are the liquid ones and their prices are almost pure volatility, not intrinsic value.

### ② Three shapes

<figure>
<svg viewBox="0 0 650 200" role="img" aria-label="Three smile shapes: equity skew, FX smile, commodity call skew">
<rect x="20" y="30" width="190" height="130" rx="6" class="fx-box2"/>
<rect x="230" y="30" width="190" height="130" rx="6" class="fx-box2"/>
<rect x="440" y="30" width="190" height="130" rx="6" class="fx-box2"/>
<line x1="30" y1="113.3" x2="200" y2="113.3" class="fx-line-muted fx-dash"/>
<line x1="240" y1="113.3" x2="410" y2="113.3" class="fx-line-muted fx-dash"/>
<line x1="450" y1="113.3" x2="620" y2="113.3" class="fx-line-muted fx-dash"/>
<polyline points="30,48.4 38,54.9 46,61.4 54,68.1 62,74.7 70,81.5 78,88.3 86,95.0 94,101.7 102,107.9 110,113.3 118,117.2 126,119.4 134,120.5 142,120.8 150,120.7 158,120.3 166,119.9 174,119.4 182,118.8 190,118.2" class="fx-line-thick"/>
<polyline points="240,77.9 248,82.1 256,86.3 264,90.5 272,94.6 280,98.7 288,102.7 296,106.4 304,109.7 312,112.2 320,113.3 328,112.8 336,110.8 344,108.0 352,104.9 360,101.7 368,98.5 376,95.2 384,92.1 392,89.1 400,86.1" class="fx-line-blue"/>
<polyline points="450,109.9 458,111.4 466,112.8 474,114.1 482,115.3 490,116.4 498,117.3 506,117.7 514,117.5 522,116.2 530,113.3 538,108.9 546,103.7 554,98.1 562,92.6 570,87.2 578,81.9 586,76.9 594,72.0 602,67.4 610,62.9" class="fx-line-btc"/>
<text x="115" y="22" text-anchor="middle" class="fx-t-b">equity index: skew</text>
<text x="325" y="22" text-anchor="middle" class="fx-t-b">FX: smile</text>
<text x="535" y="22" text-anchor="middle" class="fx-t-b">commodity: call skew</text>
<text x="30" y="176" class="fx-t-sm">80</text>
<text x="110" y="176" text-anchor="middle" class="fx-t-sm">ATM</text>
<text x="200" y="176" text-anchor="end" class="fx-t-sm">120</text>
<text x="240" y="176" class="fx-t-sm">80</text>
<text x="320" y="176" text-anchor="middle" class="fx-t-sm">ATM</text>
<text x="410" y="176" text-anchor="end" class="fx-t-sm">120</text>
<text x="450" y="176" class="fx-t-sm">80</text>
<text x="530" y="176" text-anchor="middle" class="fx-t-sm">ATM</text>
<text x="620" y="176" text-anchor="end" class="fx-t-sm">120</text>
<text x="115" y="194" text-anchor="middle" class="fx-t-sm">crash fear: puts dear</text>
<text x="325" y="194" text-anchor="middle" class="fx-t-sm">big moves both ways</text>
<text x="535" y="194" text-anchor="middle" class="fx-t-sm">spike fear: calls dear</text>
</svg>
<figcaption>Figure 2 · Three stylized 30-day smiles, all with 20% ATM vol (dashed) and the same curvature parameter; only the tilt differs. Where the curve rises tells you which tail the market fears — and pays up for.</figcaption>
</figure>

- **Equity indexes: a downward skew** (also called a *smirk*). Low strikes carry much higher vol than high strikes; at the highest strikes the curve flattens or turns up slightly.
- **Single stocks** usually have a **flatter** skew than their index, often with a more pronounced call wing: a single company can jump up on a takeover or a surprise, while an index of 500 companies rarely does.
- **Currencies: a smile.** Big moves are feared in both directions, so both wings rise; the tilt depends on the pair and changes with the news — a “safe-haven” currency's calls get bid in a crisis.
- **Commodities: often a call skew.** For many commodities the scary scenario is a supply shock — a drought, an outage — that sends prices up, so upside calls carry the premium.
- **Crypto: the tilt changes with the regime.** Bitcoin options have at times shown a call-side premium during speculative rallies, when leveraged demand for upside chases calls, and a put-side premium in sell-offs. The sign of the skew is itself a sentiment gauge; check live data rather than assuming either shape.

### ③ Why equities skew

Four forces stack up, and together they explain why the equity skew is persistent rather than occasional.

> [!HISTORY] October 1987: the day the smile appeared
> On 19 October 1987 the Dow fell 22.6% and the S&P 500 20.5% in a single session, with portfolio-insurance selling in index futures amplifying the fall. Before the crash, index option smiles were close to flat, much as Black-Scholes assumes. Afterwards a steep put skew appeared and has never gone away — a lasting fear that Mark Rubinstein nicknamed “crash-o-phobia”. The market had learned that the left tail was real, and it has charged for it ever since.

1. **Fat left tail and jumps.** Equity returns crash down faster than they rally up; big down days are more common than big up days of the same size. A lognormal model with one σ underprices exactly those strikes ([[bs-assumptions]]).
2. **The leverage effect (spot–vol correlation).** When a stock falls, its debt-to-equity ratio rises and the firm becomes riskier, so volatility tends to rise; more generally, falling markets are nervous markets. An option struck at 90 pays off in a world where XYZ has fallen — and that world is a higher-vol world. Its implied vol reflects the vol expected *in the scenario where it matters*. Stochastic-volatility models capture this with a negative correlation between price and vol shocks ([[stochastic-vol]]).
3. **Demand for protection.** Investors are structurally long stocks and buy puts to insure them ([[protective-put-collar]]); the natural sellers of those puts demand a premium for bearing crash risk.
4. **Supply of calls.** Many holders sell upside calls for income ([[covered-call]]), which pushes call vols down at the high-strike end of the curve.

> [!FACT] The call supply is large (as of mid-2026)
> Morningstar's derivative-income ETF category — funds that sell options, mostly calls, against stock portfolios — grew from under $1 billion at the end of 2020 to about $180 billion by mid-2026. Structured products and overwriting programs add further supply. That steady supply of upside calls helps keep the high-strike side of the equity smile low.

### ④ Measuring it: risk reversal and butterfly

A whole curve is hard to quote, so markets summarize it with three numbers at standard points: the ATM vol, and the vols of the **25-delta put** and **25-delta call**. From these:

$$
RR_{25} = \sigma_{25C} - \sigma_{25P}, \qquad BF_{25} = \tfrac12\left(\sigma_{25C} + \sigma_{25P}\right) - \sigma_{\text{ATM}}
$$

where \(\sigma_{25C}\) and \(\sigma_{25P}\) are the implied vols of the 25-delta call and put and \(\sigma_{\text{ATM}}\) the at-the-money vol. The **risk reversal** \(RR_{25}\) measures the **tilt** (skew): negative when puts are dearer than calls. The **butterfly** \(BF_{25}\) measures the **curvature** (smile): how much both wings sit above the middle.

> [!EXAMPLE] XYZ's 30-day skew in two numbers
> In the smile of Figure 1 the 25-delta call is the 104.23 strike, with vol 18.97%, and the 25-delta put is the 96.39 strike, with vol 21.70%. Using the 100 strike's 20.00% as ATM:
> $$
> RR_{25} = 18.97 - 21.70 = -2.73, \qquad BF_{25} = \tfrac12(18.97 + 21.70) - 20.00 = 0.34
> $$
> So puts are about 2.7 vol points dearer than calls at the same distance from the money, and the wings together sit about a third of a point above ATM. In dollars, the 25-delta put costs $0.96 and the 25-delta call $0.79.

Turn the definitions around and three quotes rebuild the three points of the smile:

$$
\sigma_{25C} = \sigma_{\text{ATM}} + BF_{25} + \tfrac12 RR_{25}, \qquad \sigma_{25P} = \sigma_{\text{ATM}} + BF_{25} - \tfrac12 RR_{25}
$$

Check with the example: \(20.00 + 0.335 - 1.365 = 18.97\) and \(20.00 + 0.335 + 1.365 = 21.70\). This is exactly how FX options are quoted — ATM, risk reversal and butterfly, per expiry — and how skew trades are expressed: buying a risk reversal (long the call, short the put) is a bet that the skew flattens ([[ratios-risk-reversals]]). Build a smile from the three quotes:

::demo[smile-skew-rr]

Conventions differ, so always check the sign. FX markets quote \(RR = \sigma_{\text{call}} - \sigma_{\text{put}}\), as above. Equity desks often speak of “put skew” as \(\sigma_{\text{put}} - \sigma_{\text{call}}\) (positive, +2.7 here), or quote the vol difference between the 90% and 110% strikes. Another common summary is the slope near the money: here the 90 and 110 strikes differ by \(25.21 - 18.80 = 6.4\) vol points, about 0.32 points per dollar of strike.

### ⑤ When the stock moves: sticky strike vs sticky delta

A smile is a snapshot. When XYZ moves, does the curve stay attached to the **strikes** or to the **spot price**? Two simple rules bracket the answer:

- **Sticky strike**: each strike keeps its implied vol. If XYZ falls from 100 to 95, the 95 strike keeps its 22.44%, and since 95 is now at the money, **ATM vol rises to 22.4%**.
- **Sticky moneyness** (close to **sticky delta**): the smile slides along with spot. After the fall, the new ATM strike (95) inherits the old ATM vol, **20.0%**, and every fixed strike's vol shifts.

<figure>
<svg viewBox="0 0 660 250" role="img" aria-label="Sticky strike versus sticky moneyness when spot falls from 100 to 95">
<line x1="30" y1="200" x2="300" y2="200" class="fx-axis"/>
<line x1="350" y1="200" x2="620" y2="200" class="fx-axis"/>
<line x1="30" y1="160" x2="300" y2="160" class="fx-grid"/>
<line x1="30" y1="120" x2="300" y2="120" class="fx-grid"/>
<line x1="30" y1="80" x2="300" y2="80" class="fx-grid"/>
<line x1="350" y1="160" x2="620" y2="160" class="fx-grid"/>
<line x1="350" y1="120" x2="620" y2="120" class="fx-grid"/>
<line x1="350" y1="80" x2="620" y2="80" class="fx-grid"/>
<text x="26" y="164" text-anchor="end" class="fx-t-sm">20%</text>
<text x="26" y="124" text-anchor="end" class="fx-t-sm">25%</text>
<text x="26" y="84" text-anchor="end" class="fx-t-sm">30%</text>
<polyline points="30,66.5 42.5,75.0 55,83.5 67.5,92.1 80,100.7 92.5,109.5 105,118.3 117.5,127.2 130,136.1 142.5,144.8 155,153.0 167.5,160.0 180,165.1 192.5,168.0 205,169.3 217.5,169.7 230,169.6 242.5,169.2 255,168.6 267.5,167.9 280,167.1" class="fx-line-thick"/>
<polyline points="350,66.5 362.5,75.0 375,83.5 387.5,92.1 400,100.7 412.5,109.5 425,118.3 437.5,127.2 450,136.1 462.5,144.8 475,153.0 487.5,160.0 500,165.1 512.5,168.0 525,169.3 537.5,169.7 550,169.6 562.5,169.2 575,168.6 587.5,167.9 600,167.1" class="fx-line-muted fx-dash"/>
<polyline points="350,83.9 362.5,93.0 375,102.1 387.5,111.3 400,120.6 412.5,130.0 425,139.3 437.5,148.3 450,156.5 462.5,162.9 475,167.0 487.5,169.0 500,169.7 512.5,169.7 525,169.3 537.5,168.7 550,168.0 562.5,167.2 575,166.3 587.5,165.5 600,164.6" class="fx-line-thick"/>
<circle cx="167.5" cy="160" r="5" class="fx-fill-muted"/>
<circle cx="136.25" cy="140.5" r="6" class="fx-fill-red"/>
<circle cx="487.5" cy="160" r="5" class="fx-fill-muted"/>
<circle cx="456.25" cy="160" r="6" class="fx-fill-red"/>
<text x="176" y="152" class="fx-t-sm">old ATM (100): 20.0%</text>
<text x="128" y="132" text-anchor="end" class="fx-t-bad">new ATM (95): 22.4%</text>
<text x="496" y="152" class="fx-t-sm">old curve (dashed)</text>
<text x="448" y="186" text-anchor="end" class="fx-t-bad">new ATM (95): 20.0%</text>
<text x="42.5" y="216" text-anchor="middle" class="fx-t-sm">80</text>
<text x="105" y="216" text-anchor="middle" class="fx-t-sm">90</text>
<text x="167.5" y="216" text-anchor="middle" class="fx-t-sm">100</text>
<text x="230" y="216" text-anchor="middle" class="fx-t-sm">110</text>
<text x="362.5" y="216" text-anchor="middle" class="fx-t-sm">80</text>
<text x="425" y="216" text-anchor="middle" class="fx-t-sm">90</text>
<text x="487.5" y="216" text-anchor="middle" class="fx-t-sm">100</text>
<text x="550" y="216" text-anchor="middle" class="fx-t-sm">110</text>
<text x="165" y="24" text-anchor="middle" class="fx-t-b">sticky strike</text>
<text x="165" y="42" text-anchor="middle" class="fx-t-sm">curve stays put; ATM slides up the skew</text>
<text x="485" y="24" text-anchor="middle" class="fx-t-b">sticky moneyness / delta</text>
<text x="485" y="42" text-anchor="middle" class="fx-t-sm">curve slides left with spot</text>
<text x="330" y="240" text-anchor="middle" class="fx-t-sm">strike · XYZ falls from 100 to 95</text>
</svg>
<figcaption>Figure 3 · Two rules for how the smile reacts when XYZ drops from 100 to 95. Under sticky strike (left) the curve doesn't move, so the new at-the-money strike inherits the higher skew vol, 22.4%. Under sticky moneyness (right) the whole curve shifts left with spot and ATM vol stays 20.0%.</figcaption>
</figure>

The difference is real money. After the drop, the now-at-the-money 95 put is worth $2.28 under sticky strike and $2.02 under sticky moneyness. It also changes the **hedge ratio**: under sticky strike, an option's vol doesn't change when spot moves, so the Black-Scholes delta is the right hedge; under sticky moneyness a fall *lowers* the vol of a fixed low strike, and the correct (“smile-adjusted”) delta differs from the Black-Scholes one. For equity indexes, ATM vol usually does rise when the market falls, which puts reality closer to sticky strike than to sticky delta — and in sharp sell-offs ATM vol can rise faster than either rule predicts. Neither rule is a law; they are the two reference points desks use to describe what the smile actually did.

### ⑥ What the smile means: prices, probabilities, no-arbitrage and models

**It is Black-Scholes, patched.** A trader who prices every strike with its own σ from the smile gets the market's prices back — the formula has become a translation device, as [[implied-vol]] suggested. A trader who prices everything at the ATM vol gets out-of-the-money puts too cheap and out-of-the-money calls too dear.

**It encodes a probability distribution.** Higher vol on low strikes means more risk-neutral probability of large falls than a lognormal allows: a **skewed, fat-left-tailed distribution**. In the THINK above, the chance of finishing below $90 rose from 3.1% (flat) to about 5.2% (skewed). [[risk-neutral-density]] shows how to read the whole distribution off the curve.

**It must obey no-arbitrage.** Not every curve is allowed. Call prices must fall as the strike rises and must be convex in the strike — every butterfly spread must cost something ([[arbitrage-bounds]]). A smile that is too steep or too kinked breaks these rules and implies a negative probability somewhere. So practitioners fit smiles with parameterizations that are easy to check. The most widely used is Gatheral's **SVI** (2004), which describes total implied variance \(w = \sigma^2 T\) as a function of log-moneyness \(k = \ln(K/F)\):

$$
w(k) = a + b\left(\rho\,(k - m) + \sqrt{(k - m)^2 + s^2}\right)
$$

where \(a\) sets the overall level, \(b\) the steepness of the wings, \(\rho\) (between −1 and 1) the tilt, \(m\) shifts the curve left or right, and \(s\) rounds off the bottom. The smile in Figure 1 uses \(a = 0.00254,\ b = 0.012,\ \rho = -0.8,\ m = 0.01,\ s = 0.05\).

> [!DEEP] Reading one point of the SVI smile
> For the 90 strike, \(k = \ln(90/100.33) = -0.1086\), so \(k - m = -0.1186\).
> $$
> w = 0.00254 + 0.012 \times \left(-0.8 \times (-0.1186) + \sqrt{0.1186^2 + 0.05^2}\right) = 0.00254 + 0.012 \times (0.0949 + 0.1288) = 0.00522
> $$
> Implied vol \(= \sqrt{w/T} = \sqrt{0.00522/0.0822} = 0.252\), the 25.2% in the table. Negative \(\rho\) is what tilts the curve up on the left. Gatheral and Jacquier (2014) give conditions on the five parameters that rule out butterfly arbitrage; the main demo checks them live, and [[surface-calibration]] fits SVI to real quotes.

**Models explain it.** Why does the market's distribution have a fat left tail? Two families of models reproduce the skew from first principles: **stochastic volatility** (Heston: volatility is random and negatively correlated with price) and **jumps** (Merton: occasional sudden drops). Both appear in [[stochastic-vol]]. And every strategy with legs at different strikes — verticals, collars, ratios, risk reversals — is priced off this curve, not off one σ.

## @analogy
Think of **flood insurance on a hillside**. An insurer prices policies for a row of houses running from the riverbank up the slope. If floods followed a gentle bell curve, the premium per dollar of risk would be the same for every house — that's Black-Scholes' flat line.

But the insurer knows how floods really behave: most years nothing happens, and once in a long while the river jumps its banks violently. So the houses by the river — the out-of-the-money puts, which pay only in a crash — are charged far more than the bell curve says, per dollar of expected damage. Everyone on the riverbank wants a policy, which pushes the price up further. Up the hill, the owners are happy to *sell* cheap coverage against the unlikely “flood from above” to earn a little income — that's the covered-call supply keeping upside calls cheap. Plot the premium rate against the height of the house and you get a curve falling from the river up the hill: the skew.

Where the analogy breaks: floods don't respond to insurance prices, and the river's level doesn't depend on who holds policies. In markets, the hedging done by option sellers can itself move the stock (dealers selling shares into a fall), so the skew partly reflects the market's own plumbing, not only the “weather”. And unlike a hillside, the whole curve slides and tilts every day as the stock moves.

## @misconceptions
- **“The skew means out-of-the-money puts are mispriced — sell them.”** — The skew prices real features (fat left tails, jumps, higher vol in falling markets) plus a risk premium. Selling puts earns that premium on average, but the payoff is small gains punctuated by large losses; that's compensation, not an arbitrage.
- **“A call and a put at the same strike can sit at different points of the smile.”** — Put-call parity gives them the same implied vol. The smile is a function of strike; OTM puts are used for the left side and OTM calls for the right only because they are the liquid ones.
- **“Because of skew, a bull put spread is cheaper than a bull call spread on the same strikes.”** — By put-call parity the call spread's debit plus the put spread's credit always equals the discounted strike width, so skew moves both by the same amount; the two are the same trade in different wrappers. Skew changes what a vertical costs relative to flat vol, not which version you use.
- **“The smile is a fixed shape — measure it once.”** — It tilts and bends with the market: put skew typically steepens in sell-offs, the curve moves with spot (sticky strike vs sticky delta), and each expiry has its own curve.
- **“Every asset has a put skew.”** — Equity indexes do; currencies often show a two-sided smile; many commodities show a call skew; crypto's tilt has changed sign with the regime. The shape tells you which tail the market fears.

## @takeaways
- Implied vol varies by strike: for equities, OTM puts carry higher vol than ATM and OTM calls less — the skew; the curvature is the smile.
- The skew is the market patching Black-Scholes for fat left tails, jumps, the leverage effect, and protection demand versus call supply; it appeared after the 1987 crash and never left.
- Summarize a smile with \(RR_{25} = \sigma_{25C} - \sigma_{25P}\) (tilt) and \(BF_{25}\) (curvature); XYZ's example: −2.7 and +0.3 vol points.
- When spot moves, sticky strike and sticky delta are the two reference rules; which one holds changes prices and hedge ratios.
- The smile encodes a fat-left-tailed risk-neutral distribution, must obey no-arbitrage (butterflies ≥ 0), and is usually fitted with SVI.

## @quiz
1. You plot the 30-day implied vols of an equity index against strike. Which shape is typical?
   - [ ] A flat line at the ATM vol, as Black-Scholes assumes
   - [x] Higher vols at low strikes, falling toward higher strikes (a put skew)
   - [ ] Higher vols at high strikes, because calls are in greater demand
   - [ ] A random pattern that changes completely from day to day
   > Equity indexes show a persistent put skew: OTM puts carry several vol points more than ATM, reflecting fat left tails, the leverage effect and demand for protection. The flat line is only the model's assumption.
2. In XYZ's skewed chain the 95 put costs $0.69 and the 105 call $0.62 (flat-vol prices: $0.51 and $0.71). What does Kai's collar — long 95 put, short 105 call — cost now?
   - [ ] A net credit of $0.20, as before
   - [ ] A net credit of $0.07
   - [x] A net debit of $0.07
   - [ ] A net debit of $0.20
   > Premium received \(0.62\) minus premium paid \(0.69\) gives \(-0.07\): a net debit of $7 per contract instead of a $20 credit. The skew makes the protective leg dearer and the income leg cheaper.
3. The 25-delta call trades at 18.97% vol, the 25-delta put at 21.70%, and ATM at 20.00%. What are the 25-delta risk reversal \(\sigma_{25C} - \sigma_{25P}\) and butterfly?
   - [x] RR = −2.73, BF ≈ +0.34
   - [ ] RR = +2.73, BF ≈ −0.34
   - [ ] RR = −2.73, BF = 0
   - [ ] RR = −1.03, BF ≈ +1.70
   > \(RR = 18.97 - 21.70 = -2.73\) (puts dearer: a put skew). \(BF = \tfrac12(18.97 + 21.70) - 20.00 = 0.335\): the wings together sit about a third of a point above ATM.
4. XYZ falls from 100 to 95. Under **sticky strike**, what happens to the at-the-money implied vol?
   - [ ] It stays at 20%, because the smile moves with spot
   - [ ] It falls, because lower strikes have lower vol
   - [ ] It is undefined until a new smile is fitted
   - [x] It rises to about 22.4%, the vol the 95 strike already had
   > Under sticky strike every strike keeps its vol, so the new ATM strike (95) brings its skew vol of 22.4% with it. Under sticky moneyness the curve would slide with spot and ATM vol would stay 20%.
5. Why must a fitted smile be checked for “butterfly arbitrage”?
   - [ ] Because butterflies are illegal on most exchanges
   - [x] Because a too-steep or too-kinked curve can make some butterfly spread worth less than zero, which implies a negative probability
   - [ ] Because a smile with any curvature at all is an arbitrage
   - [ ] Because butterfly spreads always have the highest implied vol
   > Call prices must be convex in strike, so every long butterfly costs at least zero ([[arbitrage-bounds]]). The butterfly's price is proportional to the risk-neutral probability of landing near its middle strike; a negative price would mean a negative probability. Parameterizations like SVI come with conditions that rule this out.

## @further
- [Volatility smile — Wikipedia](https://en.wikipedia.org/wiki/Volatility_smile) — shapes, history and the main explanations in one place.
- [Gatheral & Jacquier (2014), Arbitrage-free SVI volatility surfaces](https://arxiv.org/abs/1204.0646) — the SVI parameterization and the conditions that keep it arbitrage-free.
- [Stock market crash of 1987 — Federal Reserve History](https://www.federalreservehistory.org/essays/stock-market-crash-of-1987) — what happened on the day that created the equity skew.
- [Gatheral, Jaisson & Rosenbaum (2018), Volatility is rough](https://arxiv.org/abs/1410.3394) — modern research on how volatility itself moves, which shapes the short-dated skew.
- [Cboe VIX methodology (PDF)](https://cdn.cboe.com/resources/vix/VIX_Methodology.pdf) — the VIX is built from the whole OTM smile, so skewed put prices feed directly into it.

## @next
One expiry gave us a curve. Line up every expiry — 1 week, 1 month, 1 year — and the curve becomes a surface. Why does 1-month vol sometimes sit above 1-year vol, and how do you pull the “earnings day” out of a single option price?
