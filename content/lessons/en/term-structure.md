---
id: term-structure
prereqs: realized-vol, implied-vol, smile-skew
demo: term-structure
---

# Term Structure, Event Vol & the Vol Surface

## @hook
XYZ's 14-day options are quoted at 18% volatility, its 30-day options at 20%. The market is not confused: earnings fall between those two dates, and the gap tells you exactly how big a move the market has priced for that one day. The key is that **variance adds up over time like blocks** — once you see that, a row of expiries becomes a calendar you can read.

## @bridge
[[implied-vol]] turned every option price into one number, its implied volatility; [[smile-skew]] showed that at a single expiry that number changes with the strike. This lesson turns to the other axis: **the same strike, different expiries**. What does the pattern of implied vol across expiries say, how do you split a 30-day vol into "ordinary days" plus "the earnings day", and what does the full surface of strikes × expiries look like? It builds Idea ③ — volatility — using the fact from [[realized-vol]] that variance grows in proportion to time.

## @intuition
Kai opens the XYZ option chain and clicks through the expiry tabs. For the at-the-money (ATM) strike, the implied volatility is not the same in every tab (illustrative numbers):

| Expiry | 7 days | 14 days | 30 days | 60 days | 90 days | 1 year |
|---|---|---|---|---|---|---|
| ATM implied vol | 18.0% | 18.0% | **20.0%** | 19.0% | 18.7% | 18.2% |

This row — implied volatility plotted against time to expiry — is the **term structure of volatility**. Here it has a bump at 30 days. Why would the market expect XYZ to be more volatile over the next month than over the next two weeks or the next year?

> [!KAI] The earnings day is inside the 30-day option
> XYZ reports earnings in about three weeks — on day 21. The 7-day and 14-day options expire **before** the report, so they only carry ordinary days. The 30-day option expires **after** it, so its price includes one extra-large day. Kai realizes the bump is not a forecast that "the whole month will be wild"; it is one day's worth of risk averaged over 30 days.

Here is the picture that makes this precise. Think of uncertainty as **blocks of variance** (variance = volatility squared). Every ordinary day adds one small block. The earnings day adds one big block. An option that expires on day \(T\) collects every block between now and \(T\), and its implied volatility is simply "the average block size, annualized":

$$
\sigma^2(T)\,T \;=\; \underbrace{\text{all the variance blocks between today and } T}_{\text{total implied variance } w(T)}
$$

Here \(\sigma(T)\) is the implied volatility of the expiry \(T\) (in years), and \(w(T) = \sigma^2(T)\,T\) is its **total implied variance** — the whole amount of uncertainty the option is priced to carry. Blocks add up; volatilities do not. That is the one rule of this lesson.

> [!EXAMPLE] Kai's chain as blocks
> Ordinary XYZ days run at 18% annualized volatility. Thirty ordinary days carry \(0.18^2 \times \tfrac{30}{365} = 0.00266\) of variance. The 30-day option's 20% says the total is \(0.20^2 \times \tfrac{30}{365} = 0.00329\). The difference, \(0.003288 - 0.002663 = 0.000625\), is the earnings block. Its square root, \(\sqrt{0.000625} = 0.025\), is the market's one-standard-deviation earnings move: about **±2.5%, or ±$2.50** on a $100 stock.

The same block picture explains why the 1-year option shows only 18.2%. It contains the very same earnings block, but spread across 365 days of ordinary blocks it barely moves the average.

> [!THINK] Kai waits ten days. The report is now 11 days away and the "30-day" option has 20 days left. Does its implied volatility go up, down, or stay at 20%?
> Predict before you open the answer.
> ---
> It goes **up**. The earnings block is still inside, but it is now averaged over fewer days: \(\sqrt{0.0324 + 0.000625 \times \tfrac{365}{20}} \approx 20.9\%\). With 10 days left it would be about 23.5%, with 2 days left about 38%. Then, the morning after the report, the block is gone and the option drops back to 18%. That rise-then-collapse is the famous **IV crush** of [[earnings-events]].

Outside earnings season, term structures come in two everyday shapes. In calm markets, short-dated vol sits **below** long-dated vol and the curve slopes **up** (traders call this *contango* or a normal term structure). In a panic, short-dated vol shoots **above** long-dated vol and the curve **inverts** (*backwardation*). The reason is that volatility tends to drift back toward a long-run average: when today is unusually calm or unusually wild, the market expects that to fade, so the far expiries stay closer to "normal" than the near ones.

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Calm versus stressed volatility term structures">
<defs><marker id="term-structure-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="60" y1="220" x2="615" y2="220" class="fx-axis" marker-end="url(#term-structure-ah)"/>
<line x1="60" y1="220" x2="60" y2="20" class="fx-axis" marker-end="url(#term-structure-ah)"/>
<line x1="60" y1="125" x2="600" y2="125" class="fx-grid"/>
<line x1="60" y1="78" x2="600" y2="78" class="fx-grid"/>
<line x1="60" y1="173" x2="600" y2="173" class="fx-line-muted fx-dash"/>
<text x="596" y="167" text-anchor="end" class="fx-t-sm">long-run average 20%</text>
<polyline points="62,55 65,56 70,59 76,61 82,64 93,68 104,73 127,81 149,88 193,100 238,109 282,117 330,124 393,131 459,136 526,141 600,145" class="fx-line-bad"/>
<polyline points="62,201 65,200 70,199 76,198 82,197 93,196 104,194 127,192 149,189 193,186 238,184 282,182 330,181 393,179 459,178 526,177 600,177" class="fx-line-ok"/>
<text x="150" y="60" class="fx-t-bad">stress: inverted (backwardation)</text>
<text x="150" y="76" class="fx-t-sm">7 days 44.5% → 1 year 30.2% → 2 years 25.9%</text>
<text x="130" y="211" class="fx-t-ok">calm: upward sloping (contango)</text>
<text x="600" y="211" text-anchor="end" class="fx-t-sm">7 days 14.2% → 1 year 18.3%</text>
<text x="52" y="224" text-anchor="end" class="fx-t-sm">10%</text>
<text x="52" y="177" text-anchor="end" class="fx-t-sm">20%</text>
<text x="52" y="129" text-anchor="end" class="fx-t-sm">30%</text>
<text x="52" y="82" text-anchor="end" class="fx-t-sm">40%</text>
<text x="82" y="238" text-anchor="middle" class="fx-t-sm">30d</text>
<text x="193" y="238" text-anchor="middle" class="fx-t-sm">180d</text>
<text x="330" y="238" text-anchor="middle" class="fx-t-sm">1y</text>
<text x="600" y="238" text-anchor="middle" class="fx-t-sm">2y</text>
<text x="330" y="256" text-anchor="middle" class="fx-t-sm">time to expiry</text>
<text x="66" y="16" class="fx-t-sm">implied vol (ATM)</text>
</svg>
<figcaption>Figure 1 · Two term structures from one simple rule: expected variance drifts back toward a long-run level of 20%. Starting from a calm 14%, the curve slopes up; starting from a panicked 45%, it slopes down. Both flatten toward the long-run level at long expiries (illustrative parameters: mean-reversion speed 3 per year).</figcaption>
</figure>

Put the two directions together — strikes across (the smile of [[smile-skew]]) and expiries down (the term structure) — and implied volatility becomes a two-dimensional map \(\sigma(K, T)\): the **volatility surface**. Market makers quote the whole chain off that one map.

We'll take it in five parts:

- **① Total variance adds up: the rule and forward volatility**
- **② Event vol: pricing one day of earnings**
- **③ Contango, backwardation and how the curve moves**
- **④ The surface \(\sigma(K,T)\) and the calendar no-arbitrage rule**
- **⑤ Vega by tenor, and where this goes next**

## @mechanics
### ① Total variance adds up: the rule and forward volatility

Volatility grows with the square root of time, so volatilities cannot be added; variances can ([[random-walk]]). If an option expiring at \(T_1\) and one expiring at \(T_2 > T_1\) share the same stretch from today to \(T_1\), the longer one carries that stretch **plus** the gap from \(T_1\) to \(T_2\). The volatility the market implies for the gap alone is the **forward volatility**:

$$
\sigma_{\text{fwd}}^2 \;=\; \frac{\sigma_2^2\,T_2 - \sigma_1^2\,T_1}{T_2 - T_1}
$$

where \(\sigma_1, \sigma_2\) are the implied vols of the two expiries, \(T_1, T_2\) their times to expiry, and \(\sigma_{\text{fwd}}\) the implied volatility between the two dates, as seen today. Geometrically, \(\sigma_{\text{fwd}}^2\) is the **slope of the total-variance line** between the two points; any time unit works, as long as you use the same one top and bottom (the /365s cancel).

> [!EXAMPLE] The forward vol that contains earnings
> Kai's 14-day option is at 18%, the 30-day at 20%:
> $$
> \sigma_{\text{fwd}}^2 = \frac{0.20^2 \times 30 - 0.18^2 \times 14}{30 - 14} = \frac{1.2 - 0.4536}{16} = 0.04665, \qquad \sigma_{\text{fwd}} \approx 21.6\%
> $$
> The 16 days from day 14 to day 30 are priced at 21.6% — higher than either quote, because the earnings day is squeezed into that window.

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Total implied variance as a staircase over time">
<defs><marker id="term-structure-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="60" y1="220" x2="615" y2="220" class="fx-axis" marker-end="url(#term-structure-ah2)"/>
<line x1="60" y1="220" x2="60" y2="20" class="fx-axis" marker-end="url(#term-structure-ah2)"/>
<line x1="60" y1="181" x2="600" y2="181" class="fx-grid"/>
<line x1="60" y1="142" x2="600" y2="142" class="fx-grid"/>
<line x1="60" y1="103" x2="600" y2="103" class="fx-grid"/>
<line x1="60" y1="64" x2="600" y2="64" class="fx-grid"/>
<polyline points="60,220 186,184" class="fx-line-thick"/>
<polyline points="186,172 600,52" class="fx-line-thick"/>
<line x1="186" y1="184" x2="186" y2="172" class="fx-line-bad"/>
<rect x="176" y="172" width="20" height="12" class="fx-bad"/>
<polyline points="186,184 600,64" class="fx-line-muted fx-dash"/>
<line x1="60" y1="220" x2="240" y2="156" class="fx-line-hl fx-dash"/>
<circle cx="144" cy="196" r="5" class="fx-fill-green"/>
<circle cx="240" cy="156" r="5" class="fx-fill-orange"/>
<circle cx="420" cy="104" r="5" class="fx-fill-blue"/>
<text x="150" y="212" class="fx-t-sm">14d: 18%</text>
<text x="250" y="186" class="fx-t-hl">30d: 20%</text>
<text x="414" y="92" text-anchor="end" class="fx-t-blue">60d: 19.0%</text>
<text x="70" y="118" class="fx-t-bad">earnings block m² (day 21)</text>
<line x1="150" y1="124" x2="182" y2="166" class="fx-line-bad" marker-end="url(#term-structure-ah2)"/>
<text x="600" y="38" text-anchor="end" class="fx-t-sm">slope after the event = 18%²</text>
<text x="520" y="114" class="fx-t-sm">no event (dashed)</text>
<text x="66" y="46" class="fx-t-sm">dashed blue: slope from origin to a point = σ²</text>
<text x="52" y="224" text-anchor="end" class="fx-t-sm">0</text>
<text x="52" y="185" text-anchor="end" class="fx-t-sm">0.002</text>
<text x="52" y="146" text-anchor="end" class="fx-t-sm">0.004</text>
<text x="52" y="107" text-anchor="end" class="fx-t-sm">0.006</text>
<text x="52" y="68" text-anchor="end" class="fx-t-sm">0.008</text>
<text x="144" y="238" text-anchor="middle" class="fx-t-sm">14</text>
<text x="186" y="238" text-anchor="middle" class="fx-t-sm">21</text>
<text x="240" y="238" text-anchor="middle" class="fx-t-sm">30</text>
<text x="420" y="238" text-anchor="middle" class="fx-t-sm">60</text>
<text x="600" y="238" text-anchor="middle" class="fx-t-sm">90</text>
<text x="330" y="256" text-anchor="middle" class="fx-t-sm">days to expiry</text>
<text x="66" y="16" class="fx-t-sm">total implied variance w = σ²T</text>
</svg>
<figcaption>Figure 2 · The term structure as a staircase. Ordinary days add variance at a steady slope (\(0.18^2\) per year); the earnings day adds one step \(m^2\). Each expiry's implied variance \(\sigma^2\) is the slope of the line from the origin to its point, so the 30-day point, sitting just after the step, has the steepest line (20%). The slope between two points is the forward variance \(\sigma_{\text{fwd}}^2\).</figcaption>
</figure>

A **negative** forward variance is impossible: it would mean the longer option carries less total uncertainty than the shorter one, which it contains. Section ④ turns this into a trading rule.

### ② Event vol: pricing one day of earnings

The block picture gives a model with two numbers: a **base** (ex-event) volatility \(\sigma_{\text{base}}\) for ordinary days, and an **event move** \(m\), the standard deviation of the earnings-day return (not annualized). For any expiry after the event,

$$
\sigma_T^2\,T = \sigma_{\text{base}}^2\,T + m^2 \quad\Longrightarrow\quad m = \sqrt{\left(\sigma_T^2 - \sigma_{\text{base}}^2\right)T}
$$

where \(\sigma_T\) is the quoted implied vol of that expiry and \(T\) its time in years. The market does not quote \(\sigma_{\text{base}}\) directly; there are two standard ways to extract it:

- **One expiry before the event, one after.** Use the pre-event expiry's vol as the base. Kai's 14-day 18% and 30-day 20% give \(m \approx 2.5\%\), as in the intuition.
- **Two expiries after the event.** Both contain the same event block, so it cancels in the forward vol between them: \(\sigma_{\text{base}} = \sigma_{\text{fwd}}\). Then \(m^2 = \sigma_1^2 T_1 - \sigma_{\text{base}}^2 T_1\).

For example, suppose the 30-day is 20.00% and the 60-day 19.03%, both after the report. The forward vol between them is

$$
\sigma_{\text{base}}^2 = \frac{0.1903^2 \times 60 - 0.20^2 \times 30}{60 - 30} = \frac{2.1728 - 1.2}{30} \approx 0.0324 \;\Rightarrow\; \sigma_{\text{base}} \approx 18\%
$$

and then \(m = \sqrt{(0.04 - 0.0324) \times \tfrac{30}{365}} \approx 0.025\). Same story from different quotes: ordinary days at 18%, one earnings day worth ±2.5%.

How to read \(m\): it is a **one-standard-deviation** move. The *average absolute* move of a normal distribution is \(\sqrt{2/\pi} \approx 0.8\) of that, so the market prices XYZ's earnings reaction at about \(0.8 \times 2.5\% = 2.0\%\), or $2.00, on average. That is the same 0.8 factor that links an ATM straddle to the expected move in [[implied-vol]].

The model also predicts what happens to the event expiry's IV as the date approaches, with the event move and base vol held fixed. Plug the remaining time into \(\sigma_T = \sqrt{\sigma_{\text{base}}^2 + m^2/T}\):

| Days left in the option (event still ahead) | 30 | 20 | 10 | 2 | after the event |
|---|---|---|---|---|---|
| Implied vol | 20.0% | 20.9% | 23.5% | 38.3% | 18.0% |

The collapse on the last line is the **IV crush**. With XYZ unchanged at $100, a 10-day ATM straddle priced at 23.5% costs about $3.10; the next morning, with 9 days left at 18%, the same straddle is worth about $2.26. Most of that drop is the event block being "used up": if the stock moved less than the market priced, a long straddle loses even though a report happened. [[earnings-events]] builds trades around this; [[calendar-diagonal]] trades the step between the event expiry and the next one.

> [!WARN] What the model leaves out
> Real event pricing is lumpier than one normal block: earnings moves have fat tails, some expiries also contain a Fed meeting or an index rebalance, and weekends carry less variance than weekdays (desks often count "trading days" or weight days individually). Treat \(m\) as the market's *price* for the event in standard-deviation units — a risk-neutral number that includes a risk premium, not a forecast.

### ③ Contango, backwardation and how the curve moves

Why do calm curves slope up and panicked curves slope down? Volatility **mean-reverts** — it wanders but keeps being pulled back toward a long-run level ([[realized-vol]] showed its clustering). If the expected instantaneous variance starts at \(v_0\) and decays toward a long-run level \(\theta\) at speed \(\kappa\), the implied variance for expiry \(T\) is its average over \([0, T]\):

$$
\sigma^2(T) \;=\; \theta + \left(v_0 - \theta\right)\frac{1 - e^{-\kappa T}}{\kappa T}
$$

where \(v_0\) is today's variance (vol squared), \(\theta\) the long-run variance, \(\kappa\) how fast shocks fade (per year), and \(\frac{1 - e^{-\kappa T}}{\kappa T}\) the fraction of today's deviation that survives on average until \(T\) — close to 1 for short \(T\), close to 0 for long \(T\).

Figure 1 uses exactly this formula with \(\theta = 0.20^2\) and \(\kappa = 3\). Starting calm at \(v_0 = 0.14^2\), the 30-day vol is 14.8% and the 1-year 18.3%. Starting in a panic at \(v_0 = 0.45^2\), the 30-day is 42.9% and the 1-year 30.2%. Check the last one by hand: \(\frac{1 - e^{-3}}{3} = 0.317\), so \(\sigma^2 = 0.04 + (0.2025 - 0.04) \times 0.317 = 0.0915\) and \(\sigma = \sqrt{0.0915} = 30.2\%\).

This shape is also the backbone of stochastic-volatility models such as Heston ([[stochastic-vol]]). It explains two behaviors every vol trader knows:

- **The short end moves most.** A shock to today's variance \(v_0\) moves the 30-day vol a lot and the 1-year vol a little: in the example, going from calm to panic lifts the 30-day by 28 vol points and the 1-year by 12.
- **The curve's slope is a stress gauge.** When the front of the index term structure climbs above the back, markets are in stress. The [[vix]] measures one point of that curve — 30 days on the S&P 500 — and its futures show the same contango/backwardation pattern.

Traders describe moves of the curve as **level** (everything up or down), **slope** (front versus back) and **curvature** (a bump in the middle, such as an event). A single "vega" number hides which of these a position is exposed to.

### ④ The surface \(\sigma(K,T)\) and the calendar no-arbitrage rule

Each expiry has its own smile; stack them and you get the surface. Slicing it horizontally gives a smile (fixed \(T\)); slicing it vertically gives a term structure (fixed strike or fixed delta). In the illustrative XYZ surface below, the 30-day slice is exactly the smile of [[smile-skew]] (90 strike 25.2%, ATM 20%); the other expiries reuse its shape, stretched or squeezed across strikes in proportion to \(\sqrt{T}\), on top of this lesson's earnings term structure.

::demo[term-structure-surface]

<figure>
<svg viewBox="0 0 660 230" role="img" aria-label="Volatility surface as four smiles, one per expiry">
<line x1="50" y1="190" x2="170" y2="190" class="fx-axis"/>
<line x1="200" y1="190" x2="320" y2="190" class="fx-axis"/>
<line x1="350" y1="190" x2="470" y2="190" class="fx-axis"/>
<line x1="500" y1="190" x2="620" y2="190" class="fx-axis"/>
<line x1="50" y1="153" x2="170" y2="153" class="fx-grid"/>
<line x1="200" y1="153" x2="320" y2="153" class="fx-grid"/>
<line x1="350" y1="153" x2="470" y2="153" class="fx-grid"/>
<line x1="500" y1="153" x2="620" y2="153" class="fx-grid"/>
<line x1="50" y1="116" x2="170" y2="116" class="fx-grid"/>
<line x1="200" y1="116" x2="320" y2="116" class="fx-grid"/>
<line x1="350" y1="116" x2="470" y2="116" class="fx-grid"/>
<line x1="500" y1="116" x2="620" y2="116" class="fx-grid"/>
<line x1="50" y1="79" x2="170" y2="79" class="fx-grid"/>
<line x1="200" y1="79" x2="320" y2="79" class="fx-grid"/>
<line x1="350" y1="79" x2="470" y2="79" class="fx-grid"/>
<line x1="500" y1="79" x2="620" y2="79" class="fx-grid"/>
<polyline points="50,88 58,96 65,104 73,113 80,122 88,131 95,141 103,151 110,160 118,165 125,165 133,164 140,163 148,162 155,161 163,160 170,159" class="fx-line-thick"/>
<polyline points="200,114 208,119 215,124 223,129 230,134 238,139 245,144 253,149 260,153 268,156 275,157 283,157 290,157 298,157 305,157 313,156 320,156" class="fx-line-thick"/>
<polyline points="350,134 358,138 365,141 373,144 380,147 388,150 395,153 403,156 410,158 418,160 425,161 433,162 440,162 448,162 455,162 463,162 470,162" class="fx-line-thick"/>
<polyline points="500,148 508,150 515,152 523,153 530,155 538,156 545,157 553,159 560,160 568,161 575,162 583,162 590,163 598,163 605,164 613,164 620,164" class="fx-line-thick"/>
<circle cx="110" cy="160" r="4" class="fx-fill-orange"/>
<circle cx="260" cy="153" r="4" class="fx-fill-orange"/>
<circle cx="410" cy="158" r="4" class="fx-fill-orange"/>
<circle cx="560" cy="160" r="4" class="fx-fill-orange"/>
<text x="110" y="30" text-anchor="middle" class="fx-t-b">7 days</text>
<text x="260" y="30" text-anchor="middle" class="fx-t-b">30 days</text>
<text x="410" y="30" text-anchor="middle" class="fx-t-b">90 days</text>
<text x="560" y="30" text-anchor="middle" class="fx-t-b">1 year</text>
<text x="110" y="48" text-anchor="middle" class="fx-t-sm">ATM 18.0% · 90: 28.4%</text>
<text x="260" y="48" text-anchor="middle" class="fx-t-hl">ATM 20.0% · 90: 25.2%</text>
<text x="410" y="48" text-anchor="middle" class="fx-t-sm">ATM 18.7% · 90: 21.6%</text>
<text x="560" y="48" text-anchor="middle" class="fx-t-sm">ATM 18.2% · 90: 19.5%</text>
<text x="44" y="194" text-anchor="end" class="fx-t-sm">10%</text>
<text x="44" y="157" text-anchor="end" class="fx-t-sm">20%</text>
<text x="44" y="120" text-anchor="end" class="fx-t-sm">30%</text>
<text x="44" y="83" text-anchor="end" class="fx-t-sm">40%</text>
<text x="50" y="206" class="fx-t-sm">80</text>
<text x="160" y="206" class="fx-t-sm">120</text>
<text x="200" y="206" class="fx-t-sm">80</text>
<text x="310" y="206" class="fx-t-sm">120</text>
<text x="350" y="206" class="fx-t-sm">80</text>
<text x="460" y="206" class="fx-t-sm">120</text>
<text x="500" y="206" class="fx-t-sm">80</text>
<text x="610" y="206" class="fx-t-sm">120</text>
<text x="330" y="224" text-anchor="middle" class="fx-t-sm">strike (XYZ at 100); dot = at the money</text>
</svg>
<figcaption>Figure 3 · An illustrative XYZ surface as small multiples. The dots trace the term structure (18% → 20% → 18.7% → 18.2%, with the earnings bump at 30 days). Across strikes, the skew is steepest at 7 days (the 90 strike at 28.4% vs 18% ATM) and nearly flat at 1 year (19.5% vs 18.2%): measured in strike dollars, skew flattens as expiry lengthens, because a $10 drop is a bigger surprise in a week than in a year.</figcaption>
</figure>

Two regularities are worth memorising:

- **Skew flattens with tenor in strike space.** A $10 move is about 1.7 standard deviations over 30 days but only about half a standard deviation over a year, so the same fear of a drop shows up as a steep smile short-dated and a gentle one long-dated. Desks therefore often index the surface by **delta** or by standardized moneyness \(\ln(K/F)/(\sigma\sqrt{T})\) ([[moneyness]]), where the shapes line up across expiries.
- **Total variance must not decrease with expiry.** For options at the same forward-moneyness, the rule is

$$
w(K, T_2) \;\ge\; w(K, T_1) \quad\text{for } T_2 > T_1, \qquad w = \sigma^2 T
$$

where \(w\) is total implied variance at the same moneyness. A violation means the longer option is priced as carrying less uncertainty than the shorter one inside it — a **calendar arbitrage** (in the simplest case, sell the short-dated option and buy the long-dated one for a credit, a position that cannot be worth less than zero). It is the time-direction twin of the butterfly rule in [[arbitrage-bounds]]; together they are what [[surface-calibration]] enforces.

> [!THINK] A chain shows the 30-day ATM at 30% and the 60-day ATM at 20%. Arbitrage?
> Compare total variances, not vols.
> ---
> \(w_{30} = 0.30^2 \times \tfrac{30}{365} = 0.00740\) and \(w_{60} = 0.20^2 \times \tfrac{60}{365} = 0.00658\). The 60-day carries **less** total variance than the 30-day inside it, so the forward variance is negative — a calendar arbitrage, up to rates, dividends and bid–ask. An inverted curve is fine (30% vs 25% would pass); it is the *total* that must keep growing.

### ⑤ Vega by tenor, and where this goes next

Vega grows with \(\sqrt{T}\): the XYZ ATM call has vega 0.114 per vol point at 30 days, 0.196 at 90 days and 0.381 at 1 year (\(S = 100\), \(\sigma = 20\%\), \(r = 4\%\)). But the short end of the curve moves more (③). If a stress day lifts the 30-day vol by 10 points and the 1-year by 3, the 30-day call gains \(0.114 \times 10 = \$1.14\) and the 1-year call \(0.381 \times 3 = \$1.14\): the **same** P&L from very different vega numbers. That is why risk systems report **vega by tenor bucket**, and why a common convention scales each bucket by \(\sqrt{30/T_{\text{days}}}\) before adding them up. [[vega]] returns to this.

The term structure connects most of what follows:

- **Calendars and diagonals** ([[calendar-diagonal]]) are bets on the slope of the curve and on forward vol.
- **Earnings trades** ([[earnings-events]]) are bets on \(m\) versus the move that actually happens.
- **The VIX** ([[vix]]) is the 30-day point of the S&P 500 surface. Cboe builds it from SPX options with more than 23 and fewer than 37 days to expiry and interpolates their total variances to exactly 30 days — the additivity rule of ① in daily use (Cboe VIX methodology; weekly expiries included since October 6, 2014).

> [!FACT] The front of the curve got crowded (as of 2026)
> SPX has had an expiration every trading day since Cboe added Tuesday and Thursday Weeklys in April–May 2022, and same-day (0DTE) options were about two-thirds of SPX volume in July 2026 (Cboe). The index term structure now has a quoted point for every day of the coming weeks, so event blocks such as a CPI release or an FOMC day can be read almost directly from neighboring expiries. See [[zero-dte]].

## @analogy
Think of a **toll road priced by the kilometre**. Most kilometres cost the same small toll. One bridge, at kilometre 21, has its own big toll. A ticket to kilometre 14 costs 14 small tolls; a ticket to kilometre 30 costs 30 small tolls plus the bridge. If you divide each ticket's price by its distance, the 30-kilometre ticket looks "more expensive per kilometre" — not because the road got worse, but because the bridge is inside it. A 365-kilometre ticket contains the same bridge, yet its average per kilometre barely moves.

Implied volatility is that "average price per kilometre", annualized; total variance is the ticket price. Tickets add up, averages don't. Compare two tickets that both include the bridge and the bridge cancels, leaving the ordinary per-kilometre toll (the forward vol). Stand just before the bridge with a short ticket and the average looks huge; once you cross it, the average collapses (the IV crush).

The analogy breaks in two places. The tolls are not known in advance: the "price per kilometre" is the market's risk-neutral price for uncertainty, which rises and falls with fear, and it includes a premium for bearing risk. And a real road never charges less for a longer ticket than for a shorter one inside it — in options that can briefly appear on a screen, and it is an arbitrage.

## @misconceptions
- **"A 30-day IV of 20% means the market expects every day of the month to be 20%-volatile."** — It is an average of variance over the whole period. Kai's 20% is 29 ordinary days at 18% plus one earnings day worth ±2.5%; the days are anything but equal.
- **"You can interpolate implied vols linearly between expiries."** — Interpolate **total variance** \(\sigma^2 T\), not vol. Linear-in-vol interpolation can even create calendar arbitrage.
- **"An inverted term structure is an arbitrage."** — No. Short-dated vol above long-dated vol is normal in stress. Only *total* variance falling with expiry is an arbitrage.
- **"The IV crush after earnings means the market was wrong."** — The crush happens by design once the event block is used up. Whether a long option wins depends on the realized move versus the priced move \(m\), not on the crush itself.
- **"Long-dated options have more vega, so they are more exposed to volatility."** — Per vol point, yes; but long-dated vols move much less than short-dated ones. Compare exposures to realistic moves, bucket by tenor.

## @takeaways
- The term structure is implied vol against expiry; its natural unit is total variance \(w = \sigma^2 T\), which adds up over time while vol does not.
- Forward vol \(\sigma_{\text{fwd}}^2 = (\sigma_2^2 T_2 - \sigma_1^2 T_1)/(T_2 - T_1)\) is the slope of total variance between two expiries; it can never be negative.
- An event adds one block \(m^2\): \(m = \sqrt{(\sigma_T^2 - \sigma_{\text{base}}^2)T}\) is the market's one-standard-deviation event move; the event expiry's IV ramps up into the date and crushes after it.
- Mean reversion makes calm curves slope up and stressed curves invert; the short end moves most.
- The surface \(\sigma(K,T)\) stacks smiles by expiry; skew flattens with tenor in strike space, and total variance must rise with expiry (calendar no-arbitrage).

## @quiz
1. XYZ's 14-day ATM option (before earnings) is at 18% and its 30-day ATM option (after earnings) at 20%. Treating 18% as the ordinary-day vol, what one-standard-deviation earnings move is priced?
   - [ ] 2% — the difference between the two vols
   - [x] About 2.5% — the square root of the extra total variance \((0.20^2 - 0.18^2) \times 30/365\)
   - [ ] About 5.7% — the 30-day expected move
   - [ ] About 0.4% — the extra variance itself
   > Variances add, so the event block is \((0.04 - 0.0324) \times 30/365 \approx 0.000625\), and \(m = \sqrt{0.000625} \approx 2.5\%\). Subtracting vols (2%) is the classic mistake; 5.7% is the whole month's 1σ move.
2. The 30-day implied vol is 20% and the 90-day implied vol is 22%. What is the forward vol from day 30 to day 90?
   - [ ] 21%
   - [ ] 22%
   - [ ] 24%
   - [x] About 22.9%
   > \(\sigma_{\text{fwd}}^2 = (0.22^2 \times 90 - 0.20^2 \times 30)/60 = (4.356 - 1.2)/60 = 0.0526\), so \(\sigma_{\text{fwd}} \approx 22.9\%\). The forward is above the 90-day quote because the 90-day average includes the cheaper first 30 days.
3. A market falls sharply and fear spikes. Which change to the ATM term structure is most typical?
   - [ ] Short-dated vol falls, long-dated vol rises, steepening the upward slope
   - [x] Short-dated vol rises much more than long-dated vol, and the curve inverts
   - [ ] All expiries rise by exactly the same number of vol points
   - [ ] Nothing, because term structures only change at earnings
   > Volatility mean-reverts, so a shock to today's variance fades with horizon: the front jumps most and the curve slopes down (backwardation). Parallel moves are rare.
4. Which pair of quotes contains a calendar arbitrage (same forward-moneyness, ignoring costs)?
   - [ ] 30-day at 30%, 60-day at 25%
   - [ ] 30-day at 15%, 60-day at 18%
   - [x] 30-day at 30%, 60-day at 20%
   - [ ] 30-day at 20%, 60-day at 20%
   > Compare \(w = \sigma^2 T\): \(0.30^2 \times 30 = 2.7\) versus \(0.20^2 \times 60 = 2.4\) (measured in vol squared × days). The longer option has less total variance than the shorter one inside it. The 30%/25% pair is inverted but fine: \(0.25^2 \times 60 = 3.75 > 2.7\).
5. With XYZ unchanged, the event expiry's IV goes from 23.5% the day before earnings to 18% the day after. What best describes this?
   - [ ] The market decided XYZ became a safer company overnight
   - [ ] A data error, since IV should not move when the stock doesn't
   - [x] The earnings variance block was used up; only ordinary days remain in the option
   - [ ] Theta is removed from the option after an event
   > Before the report, the option's total variance includes the event block squeezed into few remaining days; after it, only ordinary days at the 18% base remain. That is the IV crush, predicted by \(\sigma_T = \sqrt{\sigma_{\text{base}}^2 + m^2/T}\).

## @further
- [Cboe VIX Index methodology (PDF)](https://cdn.cboe.com/resources/vix/VIX_Methodology.pdf) — how Cboe picks two expiries around 30 days and interpolates their total variance.
- [Cboe white paper on VIX interpolation (PDF)](https://cdn.cboe.com/resources/education/research_publications/VIXInterpolationWhitepaper.pdf) — the time-weighting details behind a 30-day point on the term structure.
- [Gatheral & Jacquier (2014), Arbitrage-free SVI volatility surfaces](https://arxiv.org/abs/1204.0646) — the calendar and butterfly no-arbitrage conditions for a whole surface.
- [Volatility smile (Wikipedia)](https://en.wikipedia.org/wiki/Volatility_smile) — overview of smiles, term structure and the implied volatility surface.
- [Heston (1993) model (Wikipedia)](https://en.wikipedia.org/wiki/Heston_model) — the mean-reverting variance process behind the term-structure formula in ③.

## @next
The surface tells you what the market charges for uncertainty at every strike and date. But prices across strikes also hide something more concrete: the market's probability for every range of outcomes. How do you read a probability distribution straight out of a row of option prices?
