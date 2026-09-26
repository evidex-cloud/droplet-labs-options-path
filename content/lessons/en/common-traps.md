---
id: common-traps
prereqs: exercise-assignment, liquidity-spreads, earnings-events, zero-dte, trading-psychology, first-trade
demo: common-traps
---

# Common Traps: Assignment, Pin Risk, Liquidity, Dividends & Earnings

## @hook
Most money lost in options is not lost by being wrong about direction. It is lost to machinery nobody checked when the order went in: a dividend that triggers early assignment, a close that lands on the strike, a spread that eats the edge, an implied vol that collapses overnight. This lesson is a field guide: each trap, the number that springs it, and the one check that defuses it.

## @bridge
[[first-trade]] walked one trade from thesis to journal. Along the way the course explained each piece of machinery on its own: exercise and assignment in [[exercise-assignment]], spreads in [[liquidity-spreads]], the post-earnings collapse in [[earnings-events]], same-day options in [[zero-dte]], and our own worst habits in [[trading-psychology]]. This lesson collects the places where that machinery bites, as scenarios with real numbers. It builds Idea ④ — risk: almost every trap is a risk you took without measuring it. The checklist at the end is the one you will carry into the [[capstone]].

## @intuition
Start with a story that surprises almost everyone the first time.

> [!KAI] The covered call that disappeared a day early
> Kai owns 100 XYZ bought at $100 and sold the 30-day 105 call for $0.71 (the covered call from [[covered-call]]). Three weeks later XYZ has rallied to **$112**. XYZ has also just declared its first dividend: **$0.50 a share**, and the ex-dividend date is tomorrow. The call expires in three days. Kai thinks: “Expiry is Friday. I'll decide then.”
> The next morning the shares are gone. Kai was **assigned early**, one day before the dividend, and the $50 Kai expected (\(0.50 \times 100\)) went to whoever held the call.

Nobody did anything wrong or unusual. Look at it from the call holder's side. Holding the call over the ex-date means watching XYZ drop by the dividend at the open and receiving nothing for it. Exercising today means paying $105, receiving the stock, and collecting the $0.50 dividend. The only thing the holder gives up by exercising early is the call's remaining **time value** — and with three days left and the call $7 in the money, that is about **three cents**. Fifty cents beats three cents. Every holder who is paying attention exercises.

For Kai the damage is small: the shares were going to be sold at $105 anyway; Kai just lost the dividend. For someone who holds the 105 call as the short leg of a spread, the same event is worse: they wake up **short 100 shares on the ex-date and owe the $50 dividend** themselves.

This is the pattern of every trap in this lesson. A trap has three parts:

1. **a mechanism** — a rule of the contract or of the market (American exercise, auto-exercise, the bid-ask spread, the way implied vol is priced);
2. **a moment** — the time the mechanism fires (the eve of an ex-date, 4:00 p.m. on expiration day, earnings night, a weekend);
3. **a position that did not plan for that moment.**

The first two are public and predictable. Only the third is up to you. That is why traps are avoidable: almost all of them can be seen in advance on a calendar and an option chain.

<figure>
<svg viewBox="0 0 680 260" role="img" aria-label="When each trap springs, along the life of a trade">
<defs><marker id="common-traps-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="30" y1="130" x2="660" y2="130" class="fx-axis" marker-end="url(#common-traps-ah)"/>
<circle cx="60" cy="130" r="7" class="fx-fill-orange"/>
<circle cx="190" cy="130" r="7" class="fx-fill-muted"/>
<circle cx="300" cy="130" r="7" class="fx-fill-red"/>
<circle cx="400" cy="130" r="7" class="fx-fill-red"/>
<circle cx="505" cy="130" r="7" class="fx-fill-red"/>
<circle cx="600" cy="130" r="7" class="fx-fill-muted"/>
<text x="60" y="152" text-anchor="middle" class="fx-t-b">order entry</text>
<text x="190" y="152" text-anchor="middle" class="fx-t-b">holding</text>
<text x="300" y="152" text-anchor="middle" class="fx-t-b">ex-dividend</text>
<text x="300" y="167" text-anchor="middle" class="fx-t-sm">eve</text>
<text x="400" y="152" text-anchor="middle" class="fx-t-b">earnings</text>
<text x="400" y="167" text-anchor="middle" class="fx-t-sm">night</text>
<text x="505" y="152" text-anchor="middle" class="fx-t-b">expiry day</text>
<text x="505" y="167" text-anchor="middle" class="fx-t-sm">4:00–5:30 pm</text>
<text x="600" y="152" text-anchor="middle" class="fx-t-b">Monday</text>
<text x="600" y="167" text-anchor="middle" class="fx-t-sm">open</text>
<rect x="14" y="22" width="92" height="84" rx="8" class="fx-box"/>
<text x="60" y="42" text-anchor="middle" class="fx-t-sm">wide spread</text>
<text x="60" y="60" text-anchor="middle" class="fx-t-sm">market order</text>
<text x="60" y="78" text-anchor="middle" class="fx-t-sm">lottery ticket</text>
<text x="60" y="96" text-anchor="middle" class="fx-t-sm">oversizing</text>
<rect x="136" y="40" width="108" height="66" rx="8" class="fx-box"/>
<text x="190" y="60" text-anchor="middle" class="fx-t-sm">margin call</text>
<text x="190" y="78" text-anchor="middle" class="fx-t-sm">rolling a loser</text>
<text x="190" y="96" text-anchor="middle" class="fx-t-sm">corporate action</text>
<rect x="252" y="58" width="96" height="48" rx="8" class="fx-bad"/>
<text x="300" y="78" text-anchor="middle" class="fx-t-sm">early</text>
<text x="300" y="96" text-anchor="middle" class="fx-t-sm">assignment</text>
<rect x="356" y="58" width="88" height="48" rx="8" class="fx-bad"/>
<text x="400" y="78" text-anchor="middle" class="fx-t-sm">IV crush</text>
<text x="400" y="96" text-anchor="middle" class="fx-t-sm">gap move</text>
<rect x="452" y="22" width="106" height="84" rx="8" class="fx-bad"/>
<text x="505" y="42" text-anchor="middle" class="fx-t-sm">0DTE speed</text>
<text x="505" y="60" text-anchor="middle" class="fx-t-sm">pin risk</text>
<text x="505" y="78" text-anchor="middle" class="fx-t-sm">after-hours move</text>
<text x="505" y="96" text-anchor="middle" class="fx-t-sm">auto-exercise</text>
<rect x="566" y="58" width="80" height="48" rx="8" class="fx-box"/>
<text x="606" y="78" text-anchor="middle" class="fx-t-sm">weekend</text>
<text x="606" y="96" text-anchor="middle" class="fx-t-sm">gap</text>
<text x="60" y="192" text-anchor="middle" class="fx-t-hl">visible in</text>
<text x="60" y="208" text-anchor="middle" class="fx-t-hl">the quote</text>
<text x="190" y="192" text-anchor="middle" class="fx-t-sm">visible in</text>
<text x="190" y="208" text-anchor="middle" class="fx-t-sm">your sizing</text>
<text x="450" y="192" text-anchor="middle" class="fx-t-bad">visible only on the calendar</text>
<text x="450" y="208" text-anchor="middle" class="fx-t-sm">ex-dates, earnings dates, expiry times</text>
<text x="340" y="244" text-anchor="middle" class="fx-t-sm">time →  (red dots: a date you can look up before you trade)</text>
</svg>
<figcaption>Figure 1 · The trap map. Traps on the left show up in the price or the size when you place the order. The red ones spring on a specific date — an ex-dividend date, an earnings release, 4:00 p.m. on expiration day — that you can look up before you trade but that the quote itself does not warn you about.</figcaption>
</figure>

> [!THINK] Which of these traps could Kai have seen coming on the day the covered call was sold?
> Think about what was on the screen and what was on the calendar.
> ---
> The spread and the size were on the screen. The dividend was not declared yet, but the *possibility* was: any stock can declare one, and the ex-date calendar is public. The real lesson is procedural: **every open short option needs a weekly check against the ex-dividend and earnings calendars**, not just a check on the day it was sold.

The traps fall into a few families. Some live in the contract's rules, some in the price you pay, some in volatility and speed, some in your own behavior. We'll take them in six parts:

- **① Assignment traps: dividends and early exercise**
- **② Expiration-day traps: pin risk, after-hours moves and accidental exercise**
- **③ Price traps: wide spreads and lottery tickets**
- **④ Volatility and speed traps: IV crush, 0DTE and weekends**
- **⑤ Leverage and behavior traps: margin calls, oversizing and rolling losers**
- **⑥ Paperwork traps, the checklist and the state of play (2026)**

## @mechanics
### ① Assignment traps: dividends and early exercise

An American option can be exercised on any business day ([[exercise-assignment]]). When a holder exercises, the Options Clearing Corporation (OCC) assigns the exercise to a clearing firm at random, and that firm passes it to one of its customers who is short the same series. If you are short, **you never choose the moment; someone else does.** So the question is: when does exercising early make sense for the holder?

For a call, the answer is almost always “just before an ex-dividend date”. On the ex-date the stock opens lower by about the dividend \(D\), and the call holder does not receive it. Exercising the day before collects the dividend but throws away whatever time value the call still has. Using put-call parity for what the call is worth after the dividend, the rule is:

$$
\text{exercise the call before the ex-date if}\quad D \;>\; \underbrace{C(S - D) - (S - D - K)}_{\text{call's time value after the dividend}} \;\approx\; P(S - D) + K\left(1 - e^{-r\tau}\right)
$$

where \(S\) is the stock price the day before the ex-date, \(K\) the strike, \(\tau\) the time (in years) from the ex-date to expiry, \(C(\cdot)\) and \(P(\cdot)\) the call and put with the same strike and expiry valued at the ex-dividend price \(S - D\), and \(K(1 - e^{-r\tau})\) the interest the holder saves by paying the strike later instead of now. In words: **exercise early when the dividend is worth more than the option's insurance value plus the interest on the strike.**

> [!EXAMPLE] Kai's 105 call, three ways (XYZ σ 20%, r 4%, dividend $0.50)
> - **XYZ $112, 3 days left:** the put is worth almost nothing (\(\approx \$0.0002\)) and the interest is \(105 \times (1 - e^{-0.04 \times 3/365}) \approx \$0.035\). Time value \(\approx \$0.035 \ll \$0.50\): **early exercise is nearly certain.** The holder gains \(0.50 - 0.035 = \$0.465\) a share, \(\$46.50\) a contract.
> - **XYZ $108, 8 days left:** time value \(\approx 0.362 + 0.092 = \$0.454 < \$0.50\). Exercise wins by less than five cents a share — marginal, but large holders who watch this closely will do it.
> - **XYZ $106, 30 days left:** time value \(\approx \$2.35 > \$0.50\). Nobody sensible exercises; Kai keeps the shares and the dividend.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Exercise value versus hold value of the 105 call the day before a 50-cent ex-dividend date">
<line x1="60" y1="200" x2="610" y2="200" class="fx-axis"/>
<line x1="60" y1="20" x2="60" y2="200" class="fx-axis"/>
<polygon points="267.9,172.8 600,20 600,27.6 583.1,35.8 549.4,52.2 515.6,68.5 481.9,84.9 448.1,101.2 414.4,117.6 380.6,133.8 346.9,149.6 313.1,164.4 296.3,171.1" class="fx-area-bad"/>
<polyline points="60,200 228.75,200 600,20" class="fx-line-thick"/>
<polyline points="60.0,200.0 76.9,200.0 93.8,199.9 110.6,199.8 127.5,199.6 144.4,199.3 161.3,198.6 178.1,197.6 195.0,196.1 211.9,194.0 228.8,191.0 245.6,187.3 262.5,182.7 279.4,177.3 296.3,171.1 313.1,164.4 330.0,157.1 346.9,149.6 363.8,141.7 380.6,133.8 397.5,125.7 414.4,117.6 431.3,109.4 448.1,101.2 465.0,93.1 481.9,84.9 498.8,76.7 515.6,68.5 532.5,60.3 549.4,52.2 566.3,44.0 583.1,35.8 600.0,27.6" class="fx-line-hl"/>
<polyline points="60.0,190.0 76.9,188.3 93.8,186.4 110.6,184.3 127.5,181.9 144.4,179.2 161.3,176.3 178.1,173.2 195.0,169.8 211.9,166.1 228.8,162.1 245.6,157.9 262.5,153.4 279.4,148.6 296.3,143.6 313.1,138.3 330.0,132.8 346.9,127.0 363.8,121.0 380.6,114.8 397.5,108.4 414.4,101.8 431.3,95.1 448.1,88.2 465.0,81.1 481.9,73.9 498.8,66.6 515.6,59.2 532.5,51.6 549.4,44.0 566.3,36.3 583.1,28.6 600.0,20.7" class="fx-line-blue fx-dash"/>
<line x1="267.9" y1="172.8" x2="267.9" y2="200" class="fx-line-muted fx-dash"/>
<line x1="567.3" y1="22" x2="567.3" y2="200" class="fx-line-muted fx-dash"/>
<circle cx="465" cy="85.5" r="4.5" class="fx-fill-ink"/>
<circle cx="465" cy="93.1" r="4.5" class="fx-fill-orange"/>
<text x="60" y="218" text-anchor="middle" class="fx-t-sm">100</text>
<text x="195" y="218" text-anchor="middle" class="fx-t-sm">104</text>
<text x="330" y="218" text-anchor="middle" class="fx-t-sm">108</text>
<text x="465" y="218" text-anchor="middle" class="fx-t-sm">112</text>
<text x="600" y="218" text-anchor="middle" class="fx-t-sm">116</text>
<text x="610" y="240" text-anchor="end" class="fx-t-sm">XYZ the day before the ex-date (K = 105, D = $0.50)</text>
<text x="52" y="204" text-anchor="end" class="fx-t-sm">0</text>
<text x="52" y="105" text-anchor="end" class="fx-t-sm">6</text>
<text x="52" y="40" text-anchor="end" class="fx-t-sm">10</text>
<text x="72" y="34" class="fx-t-b">exercise now: S − K (keeps the dividend)</text>
<text x="72" y="52" class="fx-t-hl">hold, 3 days left: C(S − D)</text>
<text x="72" y="70" class="fx-t-blue">hold, 30 days left: C(S − D)</text>
<text x="272" y="192" class="fx-t-sm">S* ≈ 106.2</text>
<text x="562" y="190" text-anchor="end" class="fx-t-sm">S* ≈ 115.0</text>
<text x="474" y="112" class="fx-t-sm">7.00 vs 6.53</text>
<text x="400" y="176" class="fx-t-bad">red: exercise beats holding (3 days)</text>
</svg>
<figcaption>Figure 2 · The day before the ex-date, a call holder compares exercising now (black line, which captures the dividend) with holding the call through the dividend drop (curves). With three days left, exercise wins anywhere above about $106.2; at $112 it is worth $7.00 against $6.53 for holding. With 30 days left the hold curve stays above the line until about $115 — time value protects the short side.</figcaption>
</figure>

::demo[common-traps-dividend]

Who gets hurt, and how badly?

- **Covered call writers** (Kai): shares are called away a day early and the dividend is lost. Annoying, rarely dangerous.
- **Spread traders:** in a bear call spread or a call-spread leg, the short call is assigned but the long call is not. You are **short 100 shares over the ex-date and owe the dividend**. The defense is to close or roll the spread before the ex-date, or to exercise your own long call the same day.
- **Short deep-in-the-money puts** can be assigned early **without any dividend**: with \(r = 4\%\), a put far enough in the money is worth more exercised (the holder receives \(K\) now and earns interest on it) than held. The deeper the put and the lower its time value, the higher the risk — on any day, not just around ex-dates.

### ② Expiration-day traps: pin risk, after-hours moves and accidental exercise

Expiration day runs on a clock. The stock market closes at 4:00 p.m. ET. The OCC then **automatically exercises every expiring equity option that is at least $0.01 in the money** (“exercise by exception”), unless the holder instructs otherwise. Holders can submit or change instructions until **5:30 p.m. ET**. Assignment notices reach the short side the next business day. Three traps live in that clock.

**Pin risk.** Suppose you are short five XYZ 100 calls and XYZ closes at **$100.02**. Each call is two cents in the money, so each will be auto-exercised — unless its holder says no, which some will, especially if news moves the stock after the close. You will be assigned on anywhere from zero to five contracts, and **you will not know which until the next morning.** Your exposure on the following open is

$$
\Pi_{\text{next open}} = -\,n_{\text{assigned}} \times 100 \times \Delta S_{\text{gap}}, \qquad n_{\text{assigned}} \in \{0, 1, \dots, 5\}
$$

where \(n_{\text{assigned}}\) is the number of contracts assigned against you and \(\Delta S_{\text{gap}}\) the stock's move from Friday's close to Monday's open. With a $3 gap either way, the result ranges from \(-5 \times 100 \times 3 = -\$1{,}500\) to \(+\$1{,}500\) — on a position you thought had expired. The defense is cheap: **buy back short options that are within about a percent of the strike before the close.** A two-cent call costs little to close; the uncertainty it removes can cost a lot.

<figure>
<svg viewBox="0 0 640 230" role="img" aria-label="Pin risk: four outcomes for a short call that closes at the strike">
<rect x="150" y="40" width="220" height="70" rx="8" class="fx-box2"/>
<rect x="390" y="40" width="220" height="70" rx="8" class="fx-box2"/>
<rect x="150" y="125" width="220" height="70" rx="8" class="fx-ok"/>
<rect x="390" y="125" width="220" height="70" rx="8" class="fx-bad"/>
<text x="260" y="28" text-anchor="middle" class="fx-t-b">Monday opens $3 lower</text>
<text x="500" y="28" text-anchor="middle" class="fx-t-b">Monday opens $3 higher</text>
<text x="140" y="70" text-anchor="end" class="fx-t-b">not assigned</text>
<text x="140" y="88" text-anchor="end" class="fx-t-sm">(holder said no)</text>
<text x="140" y="155" text-anchor="end" class="fx-t-b">assigned</text>
<text x="140" y="173" text-anchor="end" class="fx-t-sm">(now short 100 shares)</text>
<text x="260" y="72" text-anchor="middle" class="fx-t">flat: $0</text>
<text x="260" y="92" text-anchor="middle" class="fx-t-sm">the option simply expired</text>
<text x="500" y="72" text-anchor="middle" class="fx-t">flat: $0</text>
<text x="500" y="92" text-anchor="middle" class="fx-t-sm">you missed nothing</text>
<text x="260" y="157" text-anchor="middle" class="fx-t-ok">+$300 per contract</text>
<text x="260" y="177" text-anchor="middle" class="fx-t-sm">short stock fell</text>
<text x="500" y="157" text-anchor="middle" class="fx-t-bad">−$300 per contract</text>
<text x="500" y="177" text-anchor="middle" class="fx-t-sm">short stock rose — and it is Monday</text>
<text x="380" y="218" text-anchor="middle" class="fx-t-sm">short XYZ 100 call, Friday close $100.02 · you learn which row you are in only after the fact</text>
</svg>
<figcaption>Figure 3 · Pin risk as a 2×2. The column is the weekend news; the row is someone else's exercise decision. You control neither, and you find out which box you are in only when the assignment notice arrives. Closing the short option before 4:00 p.m. collapses all four boxes to one.</figcaption>
</figure>

**After-hours moves.** The stock keeps trading after 4:00 p.m. while holders still have until 5:30 p.m. to decide. A call that closed a few cents out of the money can become worth exercising if good news hits at 4:30 p.m., and a holder can instruct the OCC to exercise it; the short side cannot know. The reverse also happens: a call that closed a few cents in the money is auto-exercised, the stock drops after hours, and its owner now holds shares bought above the market.

> [!WARN] Accidental exercise in a small account
> A beginner buys one XYZ 100 call for $245 and plans to “just let it expire”. XYZ closes at **$100.05**. The call is auto-exercised: the account now owes **$10,000** for 100 shares, settling the next business day (T+1). With $1,500 in the account, that is a margin call; brokers commonly close such positions themselves, often at Monday's open, at whatever price the weekend left. Two defenses: **sell to close before the end of trading** on expiration day, or send your broker a “do not exercise” instruction before its own cutoff (usually earlier than the OCC's 5:30 p.m.).

### ③ Price traps: wide spreads and lottery tickets

Some traps are visible in the quote itself. The first is the **bid-ask spread** ([[liquidity-spreads]]). Measure it against the mid price:

$$
\text{spread \%} = \frac{\text{ask} - \text{bid}}{\text{mid}}, \qquad \text{round-trip cost} \approx (\text{ask} - \text{bid}) \times 100 \ \text{per contract}
$$

where the mid is \((\text{bid} + \text{ask})/2\), and the round-trip cost assumes you cross half the spread going in and half coming out. For XYZ's liquid 30-day 100 call quoted \(2.43 / 2.47\), the spread is \(0.04 / 2.45 = 1.6\%\) and a round trip costs about \(\$4\) a contract. For an option on a thinly traded stock quoted \(0.40 / 0.60\), the spread is \(0.20 / 0.50 = 40\%\): a round trip costs \(\$20\) on a \(\$50\) option. **The option has to gain 40% just for you to break even against the mid.** A market order in that book can do even worse. Use limit orders at or near the mid ([[orders]]), and never put a stop order on an option: a single wide quote can trigger it.

The second price trap is the **cheap lottery ticket**. XYZ's 30-day 110 call costs $0.14 — $14 a contract. It feels like a small risk. Look at the numbers:

- risk-neutral probability of finishing in the money: \(\N(d_2) \approx 5.1\%\);
- probability of finishing above the breakeven \(110.14\): about **4.9%** (risk-neutral), about **5.8%** even if you assume XYZ drifts up 10% a year;
- payoff when it works: at $115, \((5 - 0.14)/0.14 \approx 35\) times the premium.

At a fair price the expected value is roughly zero before costs — you are paid for the long odds, but no more. Now add the spread: bought at an ask of $0.17 against a fair value of $0.138, you pay about 23% over fair value on every ticket, and that becomes your expected loss per ticket ([[probability-ev]]). A string of tickets loses small amounts almost every time. **Cheap in dollars is not cheap in odds.**

### ④ Volatility and speed traps: IV crush, 0DTE and weekends

The most common beginner loss after “wrong direction” is **being right and losing anyway** after earnings ([[earnings-events]]). Before a scheduled event, implied volatility for short-dated options rises to price the jump. After the release, the uncertainty is gone and IV falls back — the **IV crush**.

> [!EXAMPLE] XYZ earnings week: “I was right and still lost”
> The night before earnings, XYZ's 7-day 100 options trade at an implied vol of about **37%** (the 20% everyday vol plus the earnings jump; precisely 36.9%, the same earnings day that lifts the 30-day chain only to 25% in the [[capstone]]). The call costs **$2.08**, the put $2.00; the straddle costs **$4.08**, an implied move of about ±4.1%. The next morning IV is back to 20% with 6 days left.
> - XYZ **+3%** to $103: the call is worth $3.22, **+$114** a contract. The straddle is worth $3.37, **−$71**: the move was real, just smaller than the 4.1% already paid for.
> - XYZ **unchanged**: the call loses **$102**, the straddle **$203**.
> - Where the call's +$114 came from (exact repricing, per share): stock move \(+1.88\), vol drop \(-0.69\), one day of time \(-0.05\).
> The call breaks even only above about **$101.61** — the crush alone costs it more than half a dollar.

A Greek-by-Greek decomposition tells the same story ([[greeks-map]]):

$$
\Delta V \;\approx\; \underbrace{\Delta\,\Delta S + \tfrac12\,\Gamma\,(\Delta S)^2}_{\text{stock move}} \;+\; \underbrace{\nu\,\Delta\sigma}_{\text{IV crush}} \;+\; \underbrace{\Theta\,\Delta t}_{\text{time}}
$$

where \(\Delta, \Gamma, \nu, \Theta\) are the option's Greeks before the event, \(\Delta S\) the stock move, \(\Delta\sigma\) the change in implied vol in points and \(\Delta t\) the days passed. With vega 0.055 per point and a 17-point crush, the vega term alone predicts about \(-0.94\) — more than the exact \(-0.69\), because vega shrinks as the call moves into the money and as vol falls. **For a crush this large, reprice; the Greeks give you the sign and the rough size.**

::demo[common-traps-crush]

**0DTE speed.** Options on their last day compress weeks of gamma into hours ([[zero-dte]]). XYZ's 1-day 100 call costs $0.42 with gamma 0.381 and theta −$0.21 a day. One ordinary daily move of $1.05 up takes it to **$1.15 (+172%)**; the same move down takes it to **$0.09 (−79%)**, and its delta jumps from 0.51 to 0.84 in a single move. A short position gets the same speed against it, with no time to adjust. “Defined risk” helps — a spread caps the loss — but a capped loss can still be the whole spread width, reached in an afternoon.

**Weekends.** Theta is quoted per calendar day, so the 30-day ATM call “loses” about \(3 \times 0.044 = \$0.13\) between Friday and Monday. Sellers who sell on Friday to “collect weekend theta” usually find it was already priced in during the week, while the gap risk over roughly 65 closed hours is fully theirs. Crypto options trade through the weekend on thinner books, which moves the problem rather than removing it ([[crypto-options]]).

### ⑤ Leverage and behavior traps: margin calls, oversizing and rolling losers

**Small premium, large obligation.** Selling XYZ's 30-day 95 put brings in $0.51 — $51. The obligation behind it is to buy 100 shares at $95: \(\$9{,}500\). Suppose XYZ falls to $88 within ten days and implied vol rises to 30%. The put is now worth about **$7.27**: a loss of **$676 a contract, 13 times the premium collected**. Someone who sold ten “because each one only risks $51” is down $6,760, while their broker's margin requirement rises with every dollar XYZ falls. If the cash is not there, the broker liquidates — at the worst moment, by construction.

The defense is to size every trade by its stress loss, not its premium ([[position-sizing]]):

$$
n_{\max} = \left\lfloor \frac{\text{risk budget}}{\text{loss per contract in the stress scenario}} \right\rfloor
$$

where the risk budget is the most you allow one trade to lose (say 2% of a $20,000 account, $400) and the stress scenario is a move you consider plausible (here XYZ −12% with vol up). For the short put: \(\lfloor 400 / 676 \rfloor = 0\) — **not even one contract passes.** For the long 30-day 100 call, whose worst case is the $245 premium, \(\lfloor 400 / 245 \rfloor = 1\).

**Rolling a loser.** Faced with that $676 loss, the tempting move is to “roll”: buy back the 20-day 95 put at $7.27 and sell a 60-day 95 put at about $8.08 (priced at 28% implied vol, since longer expiries rise less in a sell-off), for a **net credit of $0.81**. It feels like being paid to wait. In fact:

- the $676 loss is **realized** the moment you buy back the first put;
- the new put has delta −0.71 (not far from the old −0.85), **2.5 times the vega** (0.122 against 0.049) and 40 extra days of exposure;
- if XYZ is at $80 at the new expiry, the total loss is \(-676 - (15 - 8.08) \times 100 \approx -\$1{,}368\): **double the loss you refused to take.**

Rolling is a legitimate tool when the new position is one you would open from scratch today, at that size. The test is simple: *if I had no history with this trade, would I open this one now?* The pull to avoid realizing a loss is the sunk-cost and loss-aversion bias from [[trading-psychology]].

### ⑥ Paperwork traps, the checklist and the state of play (2026)

**Adjusted contracts.** Corporate actions change what a contract delivers. After a 2-for-1 split, one 100-strike call on 100 shares usually becomes two 50-strike calls on 100 shares each — same value, more contracts. An odd ratio such as 3-for-2 typically leaves one contract that delivers **150 shares** at a strike of about 66.67: an adjusted, non-standard series with its own symbol, thin quotes, and a “×100” shortcut that is now wrong. Special cash dividends and mergers can change the deliverable to cash plus other shares; a cash-out merger at a fixed price removes the volatility and most of the time value. The OCC publishes an information memo for every adjustment — read it before trading an adjusted series ([[contract-specs]]).

**Taxes (US; mention only, not advice).** Wash-sale rules can disallow a loss if you buy substantially identical securities within 30 days, and options on the same stock can count. Broad-based index options such as SPX, XSP, NDX, RUT and VIX are “Section 1256 contracts”: gains and losses are treated as 60% long-term and 40% short-term and marked to market at year-end; SPY options are not. Check with a tax professional before trading around a loss.

| Trap | When it springs | The check | The defuse |
|---|---|---|---|
| Early assignment | eve of an ex-date | short ITM call: time value vs dividend | close or roll before the ex-date |
| Deep ITM short put | any day | time value vs interest on the strike | close, or be ready to buy the shares |
| Pin risk | expiry close near a short strike | shorts within ~1% at 3:30 p.m. | buy back the short leg |
| After-hours / auto-exercise | 4:00–5:30 p.m. ET | long options within cents of the strike | sell before the close or instruct |
| Wide spread | order entry | spread as % of mid vs your edge | limit orders; skip thin series |
| Lottery ticket | order entry | probability past breakeven, EV after costs | size it as a lottery or use a spread |
| IV crush | earnings night | implied move vs your expected move | low-vega structures |
| 0DTE speed | intraday | gamma per $1; distance to breakeven | small size; capped ≠ small |
| Weekend gap | Friday close | short gamma into a 65-hour gap | reduce before Friday |
| Margin call | any sell-off | stress loss vs free cash | size by stress, not premium |
| Rolling a loser | after a loss | “would I open this today?” | take the loss or roll into a fresh trade |
| Adjusted contract | corporate action | deliverable per contract | read the OCC memo |

> [!FACT] What changed by 2026 (as of September 2026)
> The OCC still auto-exercises expiring equity options $0.01 or more in the money, with a 5:30 p.m. ET deadline for holders' instructions, and US stock settles T+1 (since May 28, 2024), including stock from exercise and assignment. Several changes add *moments* for traps to spring: Nasdaq added **Monday and Wednesday expiries** for nine large names, including TSLA, NVDA, AAPL and IBIT, from January 26, 2026, so those names now expire several times a week; Cboe received approval for **extended hours** for about 20 single-stock option classes (7:30–9:25 a.m. and 4:00–4:15 p.m. ET), with a launch date of July 13, 2026 — the stock still trades long after 4:15 p.m.; and 0DTE options reached about **two-thirds of SPX volume** (66.2% in July 2026). Cboe reports that over 95% of SPX 0DTE trades are limited-risk (Cboe is an interested party). In margin rules, FINRA's Pattern Day Trader $25,000 minimum was replaced by intraday margin standards effective June 4, 2026, though brokers may take until October 20, 2027 to switch.

## @analogy
Think of renting a car. You can drive perfectly — right route, right speed, no accidents — and still pay far more than the quoted price. You returned it an hour late (an expiry cutoff). You didn't refuel, so the company did it at its own price (the spread). The toll transponder billed you automatically for a road you barely used (auto-exercise at a cent in the money). You booked on a holiday weekend, when prices triple and then collapse on Monday (the IV before and after earnings). And the car you reserved was swapped for a different model, so the fuel economy you planned on no longer applies (an adjusted contract).

None of these charges is hidden: they are all in the rental agreement, and they are all tied to a clock or a calendar. The experienced renter isn't luckier; they read the agreement once, then run the same short check at pickup and at return. That is exactly what the checklist in this lesson is for.

The analogy breaks in two places. A rental company's fees are fixed and printed; option traps are probabilistic, and their size moves with the market. And some option traps are triggered by **another person's decision** — the call holder who exercises early, the holder who changes their mind at 5 p.m. You are not only reading a contract; you are sharing it with a counterparty who is reading it too.

## @misconceptions
- **“If I'm short an option, nothing can happen until expiry.”** — American options can be exercised any business day. Short in-the-money calls are at risk before ex-dividend dates, and deep in-the-money puts at any time once the interest on the strike beats their time value.
- **“If it closes a penny out of the money, the option just expires.”** — Holders can still exercise until 5:30 p.m. ET if an after-hours move makes it worthwhile. The short side finds out the next morning. Close near-the-money shorts before 4:00 p.m.
- **“Buying before earnings is easy money if I get the direction right.”** — The implied move is already in the price. A 3% move against a 4.1% implied move loses money on a straddle, and even a correct call needs to overcome the vol crush.
- **“A $14 option is a small risk.”** — It is a small amount with a roughly 5% chance of paying. After the spread, a steady habit of buying such tickets has a negative expected value, whatever the occasional big win feels like.
- **“Rolling for a credit turns a loser into a winner.”** — Buying back the losing option realizes the loss. The new position usually carries as much risk for longer. Roll only into a trade you would open fresh today.
- **“Defined-risk trades can't really hurt me.”** — They cap the loss, they don't shrink it. A 0DTE spread can go from its entry price to its full width in hours, and a portfolio of capped losses can still be too large.

## @takeaways
- A trap is a mechanism plus a moment plus a position that did not plan for that moment; the mechanism and the moment are public, so most traps are avoidable.
- Short in-the-money calls face early assignment when the dividend exceeds their time value, roughly \(P + K(1 - e^{-r\tau})\); check every short against the ex-dividend calendar.
- Expiration day runs on a clock — 4:00 p.m. close, auto-exercise at $0.01, instructions until 5:30 p.m. — so close near-the-money shorts before the bell.
- Measure the spread as a percentage of the mid and treat cheap options as long odds, not small risks.
- Size by the stress loss, not the premium, and roll only into positions you would open fresh.

## @quiz
1. You are short the XYZ 105 call as part of a spread. XYZ is at $112, a $0.50 dividend goes ex tomorrow, and the call expires in three days. What is most likely?
   - [ ] Nothing happens until expiry: American options are exercised at expiry in practice
   - [x] The call is exercised today, because the $0.50 dividend is worth far more than its roughly $0.03 of remaining time value
   - [ ] The call is exercised only if XYZ falls below $105 tomorrow
   - [ ] The dividend lowers the strike automatically, so you are protected
   > Exercising the day before the ex-date collects the dividend and gives up only the time value, about \(P + K(1 - e^{-r\tau}) \approx \$0.035\). Ordinary cash dividends do not adjust strikes. If assigned, you are short 100 shares over the ex-date and owe the dividend.
2. You are short five XYZ 100 calls and XYZ closes at $100.02 on expiration Friday. What do you know on Friday evening?
   - [ ] All five will be assigned because they are in the money
   - [ ] None will be assigned because they are only two cents in the money
   - [ ] You can still buy them back in the after-hours session at any time
   - [x] You may be assigned on anywhere from zero to five contracts, and you will learn how many only after holders' decisions are processed
   > Auto-exercise applies unless holders instruct otherwise, and they have until 5:30 p.m. ET to decide — after-hours news can change their minds. That uncertainty is pin risk; the cure was buying the calls back before the close.
3. The night before earnings you buy XYZ's 7-day 100 straddle for $4.08 (IV about 37%). The next morning XYZ is up 3% and IV is 20%. Why is the straddle down about $71?
   - [x] The move was smaller than the roughly 4.1% move already priced in, and the IV collapse cut the value of both options
   - [ ] Straddles lose money whenever the stock goes up
   - [ ] The put expired worthless overnight
   - [ ] Theta for one day on a 7-day option is about $0.71 a share
   > The straddle price is the market's expected move. A 3% move is real but smaller than the 4.1% implied, and the crush from 37% to 20% removes most of the remaining time value. One day of theta is only a few cents of the loss.
4. XYZ fell from $100 to $88 and your short 95 put (sold for $0.51) is worth $7.27. You roll into a 60-day 95 put for a net credit of $0.81. What is the most accurate description?
   - [ ] The roll turned the loss into a $0.81 profit
   - [ ] The roll reduced the risk because the new put has less delta
   - [x] The $676 loss is realized, and the new position carries more vega and 40 more days of exposure to the same risk
   - [ ] The roll is free because the credit covers the commission
   > Buying back the first put realizes the loss. The new put still has delta −0.71, 2.5 times the vega and a longer life; if XYZ ends at $80 the total loss is about $1,368. Roll only into a trade you would open fresh.
5. An option on a thinly traded stock is quoted 0.40 bid / 0.60 ask. Roughly what does a round trip cost if you cross the spread both times?
   - [ ] $0.20 a contract — the spread is only 20 cents
   - [ ] $2 a contract
   - [x] About $20 a contract, 40% of the option's $50 mid value
   - [ ] Nothing, if you use a market order
   > You pay about half the spread entering and half leaving: \(0.20 \times 100 = \$20\) per contract, against a mid of $0.50 × 100 = $50. The option must gain 40% just to break even against the mid. Market orders make it worse, not better.
6. XYZ's 1-day 100 call costs $0.42 with gamma 0.38. XYZ rises by one ordinary daily move, $1.05. The call is now worth about:
   - [ ] $0.47 — delta 0.5 times a small move
   - [x] $1.15 — gamma makes the gain much larger than the starting delta suggests
   - [ ] $0.95 — delta times the move, plus the old price
   - [ ] $1.47 — the option gains the full move
   > Delta alone gives \(0.42 + 0.51 \times 1.05 \approx 0.95\); the gamma term \(\tfrac12 \times 0.381 \times 1.05^2 \approx 0.21\) brings it to about $1.16, and the exact price is $1.15 (+172%). The same move down leaves $0.09. That is 0DTE speed.

## @further
- [OIC: Options exercise FAQ](https://www.optionseducation.org/referencelibrary/faq/options-exercise) — auto-exercise, the 5:30 p.m. deadline and early exercise around dividends, from the industry's education arm.
- [OCC: Characteristics and Risks of Standardized Options](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the disclosure document every US options trader receives; the sections on exercise, assignment and adjustments are the source of most rules here.
- [OCC: Equity options product specifications](https://www.theocc.com/market-data/market-data-reports/series-and-trading-data/equity-options-product-specifications) — the standard contract, against which adjusted series differ.
- [FINRA: Zeroing in on 0DTE options](https://www.finra.org/investors/insights/zeroing-in-options-trading-strategy) — the regulator's investor note on same-day options risks.
- [IRS Publication 550: Investment Income and Expenses](https://www.irs.gov/publications/p550) — the official source on wash sales and option taxation in the US (read with a professional).

## @next
You now have the whole toolkit and the list of places it can fail. What does it look like to use all of it at once — on one view, one chain, one budget — from the first idea to the post-mortem? That is the capstone.
