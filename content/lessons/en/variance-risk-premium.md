---
id: variance-risk-premium
prereqs: realized-vol, implied-vol, vix, straddle-strangle, position-sizing, delta-hedging
demo: variance-risk-premium
---

# The Variance Risk Premium: Why Selling Vol Pays — and Blows Up

## @hook
Over decades of data, index options have priced implied volatility three or four points above the volatility that actually followed. So option sellers make money “on average” — a small gain most months, a huge loss once in a while. This lesson answers two questions: why does this premium exist, and how can it hand back several years of profit in a single day?

## @bridge
The previous lesson, [[delta-hedging]], showed that an option with its delta hedged away is a bet on realized versus implied volatility. [[realized-vol]] taught you to measure realized volatility; [[implied-vol]] and [[vix]] taught you to read implied volatility. Now put the two side by side: over the long run, which one is higher? This lesson builds Idea ③ (implied is the quote, realized is the bill, and the gap is the trader's living) and Idea ④ (who carries the tail risk, and how much), and it sets up [[tail-hedging]] — the other side of the same trade.

## @intuition
Start with an insurance policy.

Suppose you run a small insurer that sells only “earthquake cover for one month”. Each month you collect premiums; most months nothing happens and you keep them. Then one month the earthquake comes, and a single payout can exceed several years of premiums. An insurer makes money over the long run because **premiums are set a little above the average payout** — that extra is its reward for carrying the risk.

Selling options is selling this kind of insurance. Sell XYZ's 30-day at-the-money straddle and you collect $4.57; if XYZ doesn't shake much in those 30 days, you pay back only a fraction at expiry. Implied volatility is the premium quote; realized volatility decides the actual payout.

> [!KAI] Kai does the insurance arithmetic
> XYZ's 30-day at-the-money straddle priced at 20% implied volatility costs **$4.57**. Suppose (for illustration) XYZ's realized volatility has averaged about 16% over the past year. At 16%, the straddle's “fair” value is about **$3.66**.
> Each straddle sold collects on average \(4.57 - 3.66 = 0.91\) dollars more than it pays — $91 per contract per month.
> But in a month when XYZ falls 15%, the straddle pays out $15 at expiry, and one contract loses \((15 - 4.57) \times 100 \approx \$1{,}043\) — almost a full year of average profit (\(12 \times \$91 = \$1{,}092\)) gone in one month.

The part of the premium above the average payout, measured in variance, is the **variance risk premium** (VRP); measured in volatility it is often called the volatility risk premium. For equity indexes it has been positive over the long run, but it is not steady: in normal times implied sits above realized; in a crisis realized shoots above implied.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Implied versus realized volatility (stylized)">
<rect x="375" y="30" width="60" height="180" class="fx-area-bad"/>
<line x1="55" y1="210" x2="610" y2="210" class="fx-axis"/>
<line x1="55" y1="30" x2="55" y2="210" class="fx-axis"/>
<polyline points="60,172.8 70,174.1 80,174.1 90,171.4 100,169.4 110,169.5 120,168.1 130,171.1 140,171.6 150,172.7 160,170.7 170,174.5 180,173.7 190,174.1 200,174.0 210,176.9 220,173.5 230,177.3 240,171.9 250,171.8 260,170.9 270,169.6 280,171.4 290,169.0 300,167.6 310,170.2 320,168.7 330,170.2 340,172.9 350,173.8 360,174.8 370,177.3 380,164.0 390,92.0 400,110.0 410,137.0 420,155.0 430,167.0 440,173.6 450,171.6 460,169.0 470,172.6 480,169.5 490,168.6 500,171.8 510,171.4 520,169.7 530,170.1 540,174.8 550,174.0 560,174.8 570,175.1 580,178.7 590,180.2 600,176.0" class="fx-line-hl"/>
<polyline points="60,186.2 70,187.2 80,186.8 90,179.2 100,178.6 110,185.8 120,183.0 130,178.6 140,184.1 150,191.9 160,188.0 170,186.1 180,183.7 190,189.7 200,184.1 210,184.4 220,186.4 230,178.4 240,189.5 250,184.4 260,186.4 270,176.3 280,182.8 290,189.1 300,181.9 310,181.9 320,190.7 330,178.7 340,184.9 350,189.1 360,197.5 370,196.7 380,98.0 390,56.0 400,110.0 410,143.0 420,164.0 430,176.0 440,182.7 450,182.0 460,176.4 470,182.0 480,170.8 490,179.4 500,173.1 510,188.2 520,182.8 530,190.6 540,197.0 550,187.3 560,191.3 570,185.7 580,183.7 590,180.6 600,183.2" class="fx-line-muted"/>
<text x="70" y="150" class="fx-t-hl">implied vol (the premium quote)</text>
<text x="140" y="228" class="fx-t-sm">realized vol (the actual payout), below it most of the time</text>
<text x="442" y="60" class="fx-t-bad">crisis: realized above implied</text>
<text x="442" y="78" class="fx-t-sm">sellers lose heavily here</text>
<text x="90" y="100" class="fx-t-ok">normal times: implied − realized ≈ a few pts</text>
<text x="90" y="118" class="fx-t-sm">sellers earn a little each month</text>
<text x="49" y="175" text-anchor="end" class="fx-t-sm">20</text>
<text x="49" y="125" text-anchor="end" class="fx-t-sm">35</text>
<text x="49" y="58" text-anchor="end" class="fx-t-sm">55</text>
<text x="605" y="246" text-anchor="end" class="fx-t-sm">time (stylized, not real data)</text>
</svg>
<figcaption>Figure 1 · The typical relationship between implied and realized volatility (stylized). Most of the time the blue line (implied) sits above the grey line (realized), and the gap is the seller's premium; at the start of a crisis realized volatility jumps first and implied catches up only later — in the red zone the premium turns negative.</figcaption>
</figure>

::demo[variance-risk-premium-swap]

The premium looks like free money, but it is really **payment for carrying someone else's worst case**. A seller's monthly returns look like this: small gains most months, huge losses in a few. Drawn as a histogram, the distribution drags a long tail to the left.

We'll take it in six parts:

- **① Defining the premium**: variance, volatility and expectations
- **② The evidence**: indexes, single stocks and crypto
- **③ Why the premium exists**: insurance demand and crash risk
- **④ Variance swaps**: the premium as a contract
- **⑤ The shape of the returns**: many small gains, one large loss
- **⑥ February 2018's “Volmageddon”**

## @mechanics
### ① Defining the premium

The cleanest definition uses variance (volatility squared):

$$
\text{VRP} = \IV^2 - \E^{\P}\!\left[\RV^2\right]
$$

where \(\IV\) is today's implied volatility (the option market's risk-neutral expectation; see [[risk-neutral]]), \(\RV\) is the volatility actually realized afterwards, and \(\E^{\P}\) is a real-world expectation. A positive VRP means options are “expensive on average”. Beware: papers differ in sign convention, and some define it as \(\RV^2 - \IV^2\) (which is then usually negative) — check the direction before reading the numbers.

> [!EXAMPLE] Kai's XYZ
> Implied 20%, expected realized 16%: \(\text{VRP} = 0.20^2 - 0.16^2 = 0.0400 - 0.0256 = 0.0144\). In volatility terms, that is “4 points higher”. In straddle terms, a quote of $4.57 against a fair value of $3.66 collects about $91 extra per contract per month.

Why variance rather than volatility? Variance is **additive** — variances over different periods simply add up ([[term-structure]]) — and it can be replicated exactly with a portfolio of options (see ④).

### ② The evidence: indexes, single stocks and crypto

> [!FACT] Implied has averaged above realized (as of July 2024)
> According to a CFA Institute blog analysis (July 2024), from 1990 to about 2024 the VIX averaged about **19.59**, while the subsequent 30-day realized volatility of the S&P 500 averaged about **15.50** — a gap of about **4.1 vol points**. Cboe cites similar 1990–2018 figures: 19.3 versus 15.1. The rule of thumb: **about 3–4 points on average, turning negative in crashes**.

In academic work, Carr and Wu (2009, *Review of Financial Studies*) synthesized variance-swap rates from option portfolios for five stock indexes and 35 individual stocks. They found the variance risk premium large and significant for the major indexes (significantly negative in their sign convention) and generally smaller and less consistent for individual stocks. Bollerslev, Tauchen and Zhou (2009) found that the size of the premium even helps predict index returns over the following quarter — a high premium tends to coincide with the market demanding more compensation.

How the three families compare, intuitively:

| Underlying | Typical premium | Why |
|---|---|---|
| Equity indexes (e.g. S&P 500) | Most stable and most visible | Institutions buy index puts for protection; index volatility in a crisis also includes “correlations spiking” |
| Single stocks | Smaller and noisier | Much single-stock risk is company-specific and diversifiable; events such as earnings make realized vol jump |
| Bitcoin and other crypto | Implied and realized both high; the gap is unstable | A younger market with a different participant mix; this course has no verified long-run figure, so treat any specific number with care |

Correlation spikes deserve one more sentence. Normally stocks move somewhat independently and the index is calm; in a crisis they fall together and index volatility is far above normal. Index option buyers are partly paying for this correlation risk — the “dispersion trade” in [[systematic-vol]] trades exactly that piece.

### ③ Why the premium exists

Two explanations, each with merit:

- **Risk compensation (the mainstream view).** A volatility seller's losses cluster in crashes and recessions — exactly when everyone is short of money and most afraid of losses. Carrying “lose in bad times” risk deserves a reward, just as earthquake premiums exceed average payouts. On this view the premium is not a free lunch but the price of tail risk.
- **Supply and demand.** Pension funds, asset managers and individuals buy puts for protection year after year ([[protective-put-collar]]), so demand is steady, while sellers able to absorb huge tail losses are limited by margin and capital. Demand exceeds supply, and the price stays high.

The two fit together: because sellers must bear a frightening tail, few are willing to sell, and the price stays high. A third voice argues that part of the premium comes from behavioral bias (people overweighting rare disasters) and can therefore be “harvested”. Whichever you favor, the shape of the returns is the same: small gains most of the time, a large loss occasionally.

> [!THINK] If selling volatility pays on average, why doesn't everyone sell until the premium disappears?
> Think first: what must a seller endure to collect that “average”?
> ---
> Because the average only arrives after surviving the tail. A seller needs enough capital not to be liquidated in a crash, and must keep selling after a huge mark-to-market loss. Most institutions face risk limits, margin requirements and client redemptions, and are forced to cut risk exactly when persistence matters most. Capital that can truly bear this risk is scarce, so the premium persists — it pays for still standing at the worst moment.

### ④ Variance swaps: the premium as a contract

A **variance swap** is a contract settled at maturity on realized variance. The buyer receives:

$$
\Pi_{\text{long}} = N_{\text{var}}\,\big(\sigma_R^2 - K^2\big), \qquad N_{\text{var}} = \frac{N_{\text{vega}}}{2K}
$$

Here \(\sigma_R\) is the volatility realized over the contract's life (in points, e.g. 15), \(K\) the strike volatility agreed at inception (e.g. 20), \(N_{\text{var}}\) the variance notional (dollars per “variance point”), and \(N_{\text{vega}}\) the vega notional (dollars per vol point when realized is near \(K\)). The seller's payoff is the mirror image. A short variance swap is the VRP in its purest form.

> [!EXAMPLE] $1,000 vega notional, strike 20
> \(N_{\text{var}} = 1{,}000/(2 \times 20) = 25\) dollars per variance point.
> - Realized 15: the buyer gets \(25 \times (15^2 - 20^2) = 25 \times (225 - 400) = -\$4{,}375\); the seller makes $4,375.
> - Realized 40: the buyer gets \(25 \times (1{,}600 - 400) = +\$30{,}000\); the seller loses $30,000.
> - Realized 80 (like the worst months of 2008): the seller loses \(25 \times (6{,}400 - 400) = \$150{,}000\).
>
> The seller can make at most \(25 \times 400 = \$10{,}000\) (if realized volatility were zero), while the loss has no cap and **accelerates** as volatility rises.

Why variance and not volatility? A variance swap can be replicated with a whole strip of out-of-the-money options (weighted in proportion to \(1/K^2\)) plus dynamic hedging (Carr and Madan, 1998) — the same idea behind the VIX formula ([[vix]]). The price is convexity: for the same notional, a variance swap loses far more in high volatility than a “volatility swap” settled linearly on \(\sigma_R - K\). The inline demo above compares the two directly.

### ⑤ The shape of the returns: many small gains, one large loss

Put “sell a 30-day at-the-money straddle every month” into a simplified world: normal realized volatility 15%, implied 3 points higher; on average one −20% crash every 10 years, after which realized volatility rises to 37.5% for 3 months while implied only catches up to 33%. Run the main demo's model over 100 histories of 20 years each and plot every month's return:

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Monthly return distribution of selling straddles">
<line x1="55" y1="200" x2="600" y2="200" class="fx-axis"/>
<rect x="62" y="187.4" width="22" height="12.6" class="fx-fill-red"/>
<rect x="114" y="187.4" width="22" height="12.6" class="fx-fill-red"/>
<rect x="140" y="180.0" width="22" height="20.0" class="fx-fill-red"/>
<rect x="166" y="167.3" width="22" height="32.7" class="fx-fill-red"/>
<rect x="192" y="150.6" width="22" height="49.4" class="fx-fill-red"/>
<rect x="218" y="133.6" width="22" height="66.4" class="fx-fill-red"/>
<rect x="244" y="133.6" width="22" height="66.4" class="fx-fill-red"/>
<rect x="270" y="127.9" width="22" height="72.1" class="fx-fill-red"/>
<rect x="296" y="131.4" width="22" height="68.6" class="fx-fill-red"/>
<rect x="322" y="125.9" width="22" height="74.1" class="fx-fill-red"/>
<rect x="348" y="114.1" width="22" height="85.9" class="fx-fill-red"/>
<rect x="374" y="96.9" width="22" height="103.1" class="fx-fill-red"/>
<rect x="400" y="77.7" width="22" height="122.3" class="fx-fill-red"/>
<rect x="426" y="61.2" width="22" height="138.8" class="fx-fill-red"/>
<rect x="452" y="48.7" width="22" height="151.3" class="fx-fill-red"/>
<rect x="478" y="40.7" width="22" height="159.3" class="fx-fill-green"/>
<rect x="504" y="35.6" width="22" height="164.4" class="fx-fill-green"/>
<rect x="530" y="61.2" width="22" height="138.8" class="fx-fill-green"/>
<rect x="556" y="119.0" width="22" height="81.0" class="fx-fill-green"/>
<text x="86" y="218" text-anchor="middle" class="fx-t-sm">−30%</text>
<text x="216" y="218" text-anchor="middle" class="fx-t-sm">−20%</text>
<text x="346" y="218" text-anchor="middle" class="fx-t-sm">−10%</text>
<text x="476" y="218" text-anchor="middle" class="fx-t-sm">0</text>
<text x="580" y="218" text-anchor="middle" class="fx-t-sm">+8%</text>
<text x="560" y="28" text-anchor="end" class="fx-t-ok">about 69% of months make money (mostly 0 to +4%)</text>
<text x="62" y="58" class="fx-t-bad">about 1% of months lose over 10%</text>
<text x="62" y="76" class="fx-t-bad">the left tail runs out to −30%</text>
<text x="600" y="242" text-anchor="end" class="fx-t-sm">monthly return (notional = 1× capital); vertical axis: months, log scale</text>
</svg>
<figcaption>Figure 2 · Monthly returns from selling volatility in the simplified model (24,000 simulated months). The vertical axis is logarithmic: the green bars near zero are thousands of small winning months, the red bars in the long left tail a few dozen disasters. The average month earns about +0.9%, but the distribution is heavily skewed to the left — “picking up nickels in front of a steamroller.”</figcaption>
</figure>

The model is only a sketch (no trading costs, none of the volatility clustering of real markets), but the shape is right. Three practical lessons follow:

1. **A backtest without a crash is misleading.** The grey dashed line in the main demo is “the same history with the crashes removed”: smooth and pretty, like a savings account. A real seller answers for the blue line.
2. **Leverage decides survival.** With the same parameters, notional at 1× capital gives a median maximum drawdown of about 27%; at 3× it is about 72%, and the worst month can lose more than half the account.
3. **When the premium is zero, only the tail is left.** Set the premium to 0 and the annual return drops below the risk-free rate while the drawdowns stay — selling volatility is worth the tail only when the price is rich enough.

For sizing, see [[position-sizing]]: in high-win-rate, low-payoff strategies the Kelly fraction is hypersensitive to the win rate, so positions should sit far below Kelly.

### ⑥ February 2018's “Volmageddon”

> [!HISTORY] February 5, 2018: Volmageddon
> That day the VIX rose **20.01 points (+115.6%)** to close at **37.32**, its largest one-day percentage rise ever; the S&P 500 fell about 4%.
> Credit Suisse's **XIV** (an ETN delivering the daily inverse of short-term VIX futures, with about $1.9 billion of assets the previous Friday) lost about **96%** of its value; on **February 6** Credit Suisse announced an acceleration (termination) event, with redemption expected around February 21. ProShares' **SVXY** lost about 90% but survived, and later cut its target to −0.5×.

How can a product lose 96% in one day? The key is the “daily inverse” structure. A −1× product must, at every close, hold a short position equal to its own net asset value. When VIX futures jump:

<figure>
<svg viewBox="0 0 660 220" role="img" aria-label="The rebalancing feedback loop of inverse volatility products">
<defs><marker id="variance-risk-premium-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="20" y="30" width="170" height="60" rx="8" class="fx-bad"/>
<text x="105" y="56" text-anchor="middle" class="fx-t-b">VIX futures jump</text>
<text x="105" y="76" text-anchor="middle" class="fx-t-sm">stocks fall, fear rises</text>
<rect x="245" y="30" width="170" height="60" rx="8" class="fx-box"/>
<text x="330" y="56" text-anchor="middle" class="fx-t-b">inverse NAV collapses</text>
<text x="330" y="76" text-anchor="middle" class="fx-t-sm">short now too big for NAV</text>
<rect x="470" y="30" width="170" height="60" rx="8" class="fx-box"/>
<text x="555" y="56" text-anchor="middle" class="fx-t-b">must cover by the close</text>
<text x="555" y="76" text-anchor="middle" class="fx-t-sm">buy lots of VIX futures</text>
<rect x="245" y="140" width="170" height="60" rx="8" class="fx-hl"/>
<text x="330" y="166" text-anchor="middle" class="fx-t-b">buying lifts VIX futures</text>
<text x="330" y="186" text-anchor="middle" class="fx-t-sm">every similar product buys</text>
<line x1="190" y1="60" x2="243" y2="60" class="fx-line" marker-end="url(#variance-risk-premium-ah)"/>
<line x1="415" y1="60" x2="468" y2="60" class="fx-line" marker-end="url(#variance-risk-premium-ah)"/>
<polyline points="555,90 555,170 417,170" class="fx-line" marker-end="url(#variance-risk-premium-ah)"/>
<polyline points="245,170 105,170 105,92" class="fx-line" marker-end="url(#variance-risk-premium-ah)"/>
<text x="560" y="130" class="fx-t-sm">buy higher</text>
<text x="110" y="130" class="fx-t-sm">feedback</text>
</svg>
<figcaption>Figure 3 · A daily-rebalanced inverse (or leveraged) volatility product is short gamma at heart: when VIX futures rise it must buy, when they fall it must sell. At large enough size, concentrated buying before the close pushes up the very thing it has to buy, closing a feedback loop.</figcaption>
</figure>

Do the arithmetic: a −1× product with $100 of net assets is short $100 of VIX futures. The futures rise 50%; the short loses $50, net assets fall to $50, and the short exposure has grown to $150. To get back to −1×, the product must **buy back $100** of futures before the close — more than its remaining assets. This is exactly short-gamma hedging from [[delta-hedging]]: buy after rises, sell after falls.

The lesson is not only “selling volatility is risky”. Structure (daily rebalancing, leverage) amplifies the tail; **crowding** (many players selling the same risk the same way) narrows the exit exactly when it is needed; and “it paid for years” is precisely when the risk is most underestimated. More systematic volatility-selling strategies and their crowding problems are in [[systematic-vol]].

## @analogy
The variance risk premium is **an earthquake insurer's profit**.

The insurer collects premiums every month; in most months it pays nothing, and the books look like a money machine. Its real risk is not the ordinary month but “the month of the big quake”. Premiums exceed average payouts because payouts land exactly when everyone is struggling; capital able to absorb a catastrophe is scarce; and buyers would rather pay a little extra to sleep well.

- The premium quote = implied volatility;
- The actual payout = realized volatility;
- Premium above the average payout = the variance risk premium;
- The big quake = a crash, when one month's claims can exceed years of premiums;
- A small insurer with no reserves, forced by its own rules to buy back cover at panic prices after every bad day = XIV, wiped out by one event.

The analogy misleads in one place: a real insurer can spread risk across many unrelated regions, while an index-option seller can barely diversify at all — in a crash everything falls together, and every “policy” pays out at once.

## @misconceptions
- **“Implied is always above realized, so selling options is a sure thing.”** — Only on average. In a crisis realized volatility jumps above implied, and the seller's losses concentrate in those few months, which can erase years of gains.
- **“The premium is a market mistake that smart people can pocket for free.”** — The mainstream explanation is risk compensation: the seller carries “lose in bad times” risk. Collecting the premium requires still having the capital not to be liquidated at the worst moment.
- **“Every inverse VIX product went to zero that day.”** — XIV lost about 96% and was terminated; SVXY lost about 90% but survived, and later cut its target to −0.5×.
- **“Variance swaps and volatility swaps are the same thing in different units.”** — A variance swap settles on \(\sigma_R^2\) and is convex: for the same notional, at realized 40 the seller loses $30,000, versus $20,000 on a volatility swap.
- **“The premium is just as reliable in single stocks and bitcoin.”** — Research finds it clearest in equity indexes, smaller and noisier in single stocks; in crypto, implied and realized are both high and the gap is unstable.

## @takeaways
- The variance risk premium \(\text{VRP} = \IV^2 - \E[\RV^2]\) is the part of option prices that is “expensive on average” — the seller's reward for carrying tail risk.
- As of a July 2024 analysis: since 1990 the VIX has averaged about 19.6 and subsequent realized volatility about 15.5, a gap of about 4 points; in a crisis the gap turns negative.
- Selling volatility produces many small gains and occasional huge losses, a heavily left-skewed distribution; backtests without crashes badly overstate it.
- A variance swap \(N_{\text{var}}(\sigma_R^2 - K^2)\) packages the premium as a contract; the seller's gain is capped while the loss accelerates with volatility.
- On February 5, 2018 the VIX rose 115.6% in a day and XIV lost about 96% and was terminated: daily rebalancing and crowding amplify the tail.

## @quiz
1. By this lesson's definition, what does a positive variance risk premium mean?
   - [ ] Realized volatility is on average higher than implied volatility
   - [x] Implied variance is on average above the variance subsequently realized — options are “expensive on average”
   - [ ] Option prices are bound to rise
   - [ ] Selling options makes money every month
   > \(\text{VRP} = \IV^2 - \E[\RV^2] > 0\): implied above the expectation of realized. It holds on average; in crisis months sellers still lose heavily. Note that some papers use the opposite sign.
2. You sell a variance swap with $1,000 vega notional and a strike of 20. Realized volatility comes in at 40. What is the seller's P&L?
   - [ ] −$20,000
   - [ ] +$20,000
   - [x] −$30,000
   - [ ] −$10,000
   > \(N_{\text{var}} = 1{,}000/40 = 25\); the buyer receives \(25 \times (40^2 - 20^2) = 30{,}000\), so the seller loses $30,000. −$20,000 is the same-notional volatility swap — the variance swap loses more because of convexity.
3. Which best explains why index implied volatility has stayed above realized volatility over the long run?
   - [ ] Exchanges require options to be quoted above historical volatility
   - [ ] Market makers always miscalculate volatility
   - [x] Investors will pay extra for crash protection, and sellers able to bear crash losses are limited
   - [ ] Index realized volatility falls every year
   > The mainstream explanation is risk compensation plus supply and demand: protection demand is steady, sellers must absorb losses at the worst time, and their capital is limited. It is neither a rule nor a simple miscalculation.
4. A monthly straddle-selling strategy backtests with 90% winning months and an 8% maximum drawdown over 10 years. What is the most important question to ask?
   - [ ] Can the win rate be pushed even higher?
   - [ ] Can leverage go to 5×?
   - [x] Did those 10 years include a real crash and a volatility spike?
   - [ ] What was the average monthly return?
   > Volatility selling's risk is concentrated in a few crash months. A sample without a crash badly understates drawdowns — the grey dashed line in the main demo is exactly such a “clean backtest”.
5. On February 5, 2018, why did daily inverse VIX products have to buy large amounts of VIX futures before the close?
   - [x] After their NAV collapsed, they had to cover shorts to bring exposure back to −1×
   - [ ] Regulators ordered them to liquidate that day
   - [ ] They already held VIX call options
   - [ ] VIX futures expired that day
   > A −1× product's short becomes too large relative to its shrunken NAV, so it must buy futures back to restore the target — buying after a rise, the short-gamma way. Many similar products covering at once pushed futures higher.

## @further
- [Carr & Wu (2009), Variance Risk Premiums](https://academic.oup.com/rfs/article-abstract/22/3/1311/1581057) — synthesizes variance swaps from options to measure the premium in indexes and single stocks.
- [Bollerslev, Tauchen & Zhou (2009), Expected Stock Returns and Variance Risk Premia](https://academic.oup.com/rfs/article-abstract/22/11/4463/1565787) — the size of the premium helps predict index returns.
- [CFA Institute: How well does the market predict volatility? (2024)](https://blogs.cfainstitute.org/investor/2024/07/31/how-well-does-the-market-predict-volatility/) — VIX against subsequent realized volatility over the long run.
- [BIS Quarterly Review (March 2018): the February volatility shock](https://www.bis.org/publ/qtrpdf/r_qt1803t.htm) — analysis of the February 2018 VIX spike and inverse products.
- [Cboe VIX methodology](https://cdn.cboe.com/resources/vix/VIX_Methodology.pdf) — the official formula for replicating variance with a strip of options.

## @next
Volatility sellers collect premiums — but what about the buyers? Buying tail protection year after year means paying premiums every year and getting paid back only in a crash. Is it worth it? The next lesson moves to the other side of the trade: tail hedging.
