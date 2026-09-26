---
id: breakeven-returns
prereqs: payoff-diagrams, call-option, put-option
demo: breakeven-returns
---

# Breakeven, Max Profit, Max Loss & Return on Risk

## @hook
Being right about the direction is not the same as making money. Three numbers tell you what a trade really needs and really risks: the breakeven (how far the stock must go), the maximum profit and the maximum loss. A fourth, return on risk, lets you compare trades of very different sizes, as long as you don't let an annualized yield fool you.

## @bridge
In [[payoff-diagrams]] we learned to read a trade as a picture: kinks at strikes, slopes, and the point where the line crosses zero. This lesson turns that picture into numbers you can write on a trade ticket, and asks: how far must XYZ move, what is the best and worst case in dollars, and how do you compare a $174 bet with a $9,449 one? It builds Idea ① (shape): every number here is read straight off the shape. Later lessons add what these numbers leave out: what happens before expiry ([[before-expiry]]) and how likely each outcome is ([[probability-ev]]).

## @intuition
Kai has a friend who is sure XYZ will go up. The friend buys the 30-day $100 call for **$2.45** ($245 per contract). Thirty days later XYZ closes at **$101.50**. The friend was right: XYZ rose. The call is worth \(101.50 - 100 = 1.50\) at expiry. And yet the trade lost money:

$$
\Pi = \max(101.50 - 100,\ 0) - 2.45 = 1.50 - 2.45 = -0.95
$$

That is −$95 per contract, on a correct forecast. The friend was **right about the direction and wrong about the distance**. The premium is a cost that has to be earned back first, so the stock must travel past the strike *plus* the premium: \(100 + 2.45 = 102.45\). That price is the **breakeven**, the point where the P&L line in [[payoff-diagrams]] crosses zero.

Every option trade has three headline numbers you can read off its diagram before you place it:

- **Breakeven(s)**: where the stock must be at expiry for the trade to stop losing. Some trades have one, some two.
- **Maximum profit**: the highest point of the P&L line, or "unlimited" if the last piece keeps rising.
- **Maximum loss**: the lowest point, or "unlimited" if the last piece keeps falling. Always check the \(S_T = 0\) end.

Put Kai's standard trades side by side and the breakeven alone tells a story. Some need XYZ to move a lot, some a little, some profit even if XYZ slips.

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Breakeven ruler: where each of Kai's trades breaks even, compared with a one-standard-deviation band">
<defs><marker id="breakeven-returns-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead-hl"/></marker></defs>
<rect x="287.6" y="28" width="214.8" height="197" class="fx-area-hl"/>
<line x1="395" y1="22" x2="395" y2="225" class="fx-line-muted fx-dash"/>
<line x1="170" y1="225" x2="620" y2="225" class="fx-axis"/>
<text x="207.5" y="242" text-anchor="middle" class="fx-t-sm">90</text>
<text x="301.3" y="242" text-anchor="middle" class="fx-t-sm">95</text>
<text x="395" y="242" text-anchor="middle" class="fx-t-b">100 = today</text>
<text x="488.8" y="242" text-anchor="middle" class="fx-t-sm">105</text>
<text x="582.5" y="242" text-anchor="middle" class="fx-t-sm">110</text>
<text x="395" y="18" text-anchor="middle" class="fx-t-sm">shaded: ±1 standard deviation in 30 days (94.27 to 105.73)</text>
<text x="10" y="54" class="fx-t-sm">Long 95 put (pay 0.51)</text>
<line x1="291.7" y1="50" x2="215" y2="50" class="fx-line-hl" marker-end="url(#breakeven-returns-ah)"/>
<circle cx="291.7" cy="50" r="5" class="fx-fill-ink"/>
<text x="297" y="44" class="fx-t-sm">94.49</text>
<text x="10" y="84" class="fx-t-sm">Long 100 put (pay 2.12)</text>
<line x1="355.2" y1="80" x2="215" y2="80" class="fx-line-hl" marker-end="url(#breakeven-returns-ah)"/>
<circle cx="355.2" cy="80" r="5" class="fx-fill-ink"/>
<text x="360" y="74" class="fx-t-sm">97.88</text>
<text x="10" y="114" class="fx-t-sm">Covered call (get 0.71)</text>
<line x1="381.7" y1="110" x2="600" y2="110" class="fx-line-hl" marker-end="url(#breakeven-returns-ah)"/>
<circle cx="381.7" cy="110" r="5" class="fx-fill-ink"/>
<text x="376" y="104" text-anchor="end" class="fx-t-sm">99.29</text>
<text x="10" y="144" class="fx-t-sm">Long 100 call (pay 2.45)</text>
<line x1="440.9" y1="140" x2="600" y2="140" class="fx-line-hl" marker-end="url(#breakeven-returns-ah)"/>
<circle cx="440.9" cy="140" r="5" class="fx-fill-ink"/>
<text x="447" y="133" class="fx-t-sm">102.45</text>
<text x="10" y="174" class="fx-t-sm">Long 105 call (pay 0.71)</text>
<line x1="502.1" y1="170" x2="600" y2="170" class="fx-line-hl" marker-end="url(#breakeven-returns-ah)"/>
<circle cx="502.1" cy="170" r="5" class="fx-fill-ink"/>
<text x="496" y="164" text-anchor="end" class="fx-t-sm">105.71</text>
<text x="10" y="204" class="fx-t-sm">Long straddle (pay 4.57)</text>
<line x1="309.3" y1="200" x2="215" y2="200" class="fx-line-hl" marker-end="url(#breakeven-returns-ah)"/>
<line x1="480.7" y1="200" x2="600" y2="200" class="fx-line-hl" marker-end="url(#breakeven-returns-ah)"/>
<circle cx="309.3" cy="200" r="5" class="fx-fill-ink"/>
<circle cx="480.7" cy="200" r="5" class="fx-fill-ink"/>
<text x="315" y="194" class="fx-t-sm">95.43</text>
<text x="475" y="194" text-anchor="end" class="fx-t-sm">104.57</text>
</svg>
<figcaption>Figure 1 · The breakeven ruler. Each dot is where a trade stops losing at expiry; the arrow points to the side where it makes money. The shaded band is one standard deviation of XYZ's 30-day move, \(S\sigma\sqrt{T} \approx \$5.73\): the 105 call needs a rise to the very edge of that band just to break even, while the covered call starts profiting below today's price.</figcaption>
</figure>

> [!THINK] Which of these trades needs XYZ to move least?
> Look at the ruler before reading on. Then ask: is "needs the smallest move" the same as "best trade"?
> ---
> The covered call: its breakeven, 99.29, is *below* today's $100, so it makes money even if XYZ drifts down 71 cents. But it pays for that comfort with a cap: its best case is +5.71 per share, however far XYZ rises. The 105 call is the opposite: it needs a large move (5.71%) just to break even, and in exchange its upside is open. A breakeven tells you how far the stock must go; it says nothing about how much you win when it gets there. You need all three numbers.

Once you have the three numbers, one more question remains: is the reward big enough for the risk? A bet that risks $174 to make $326 and one that risks $9,449 to make $51 cannot be compared in dollars. They can be compared as ratios, and that is what returns are for. We'll take it in five parts:

- **① Breakevens of single options and of stock-plus-option trades**
- **② Spreads, two breakevens, and max profit and loss from the width**
- **③ Return on risk and return on capital**
- **④ Annualized returns, and why they flatter**
- **⑤ What moves a breakeven: fees, spreads, early exits**

## @mechanics
### ① Breakevens of single options and of stock-plus-option trades

The rule is always the same: **write the P&L at expiry, set it to zero, and solve for \(S_T\).** For a single option the premium must be earned back from intrinsic value:

$$
\text{BE}_{\text{call}} = K + c, \qquad \text{BE}_{\text{put}} = K - p
$$

where \(K\) is the strike, \(c\) the call premium and \(p\) the put premium, all per share. A call needs the stock to rise above the strike by the premium; a put needs it to fall below the strike by the premium.

> [!EXAMPLE] Kai's standard options (30 days, σ 20%, r 4%)
> - 100 call at 2.45: \(\text{BE} = 100 + 2.45 = 102.45\), a rise of \(2.45\%\).
> - 105 call at 0.71: \(\text{BE} = 105 + 0.71 = 105.71\), a rise of \(5.71\%\).
> - 100 put at 2.12: \(\text{BE} = 100 - 2.12 = 97.88\), a fall of \(2.12\%\).
> - 95 put at 0.51: \(\text{BE} = 95 - 0.51 = 94.49\), a fall of \(5.51\%\).
>
> Compare the moves with XYZ's one-standard-deviation 30-day move, \(100 \times 0.20 \times \sqrt{30/365} \approx \$5.73\). The two out-of-the-money options need roughly a full standard deviation just to break even. The at-the-money ones need less than half of one.

The **seller** of each option has the same breakeven, on the other side. Whoever sells the 100 call keeps money below 102.45 and loses above it: every point of profit on one side is a point of loss on the other ([[four-positions]]).

When shares are part of the trade, the entry price of the shares replaces the strike:

- **Covered call** (own shares at \(S_0\), sell a call for \(c\)): \(\text{BE} = S_0 - c\). Kai's: \(100 - 0.71 = 99.29\). The premium cushions a small fall.
- **Protective put** (own shares, buy a put for \(p\)): \(\text{BE} = S_0 + p\). Kai's 95 put: \(100 + 0.51 = 100.51\). Insurance means the stock has to rise a little to pay for itself.

### ② Spreads, two breakevens, and max profit and loss from the width

A **vertical spread** buys one option and sells another of the same type and expiry at a different strike. Take the **bull call spread**: buy the 100 call for 2.45, sell the 105 call for 0.71. You pay a **net debit** \(D = 2.45 - 0.71 = 1.74\) per share. The diagram has two kinks and three pieces: flat, rising, flat. So:

$$
\text{max loss} = D, \qquad \text{max profit} = (K_2 - K_1) - D, \qquad \text{BE} = K_1 + D
$$

where \(K_1 < K_2\) are the two strikes, \(K_2 - K_1\) is the **width** of the spread, and \(D\) is the net debit per share.

> [!EXAMPLE] The 100/105 bull call spread, in dollars
> Width \(= 105 - 100 = 5\). Max profit \(= 5 - 1.74 = 3.26\), or \(\$326\) per spread. Max loss \(= 1.74\), or \(\$174\). Breakeven \(= 100 + 1.74 = 101.74\).
> Compare with the plain 100 call: selling the 105 call lowers the breakeven from 102.45 to 101.74 and the cost from $245 to $174, and gives up everything above 105.

<figure>
<svg viewBox="0 0 640 270" role="img" aria-label="Bull call spread 100/105 with max loss, max profit, breakeven and width annotated">
<defs><marker id="breakeven-returns-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<polygon points="60,148.8 60,190.1 280,190.1 318.3,148.8" class="fx-area-bad"/>
<polygon points="318.3,148.8 390,71.3 610,71.3 610,148.8" class="fx-area-ok"/>
<line x1="60" y1="148.8" x2="620" y2="148.8" class="fx-axis" marker-end="url(#breakeven-returns-ah2)"/>
<line x1="60" y1="225" x2="60" y2="22" class="fx-axis" marker-end="url(#breakeven-returns-ah2)"/>
<polyline points="60,190.1 280,190.1 390,71.3 610,71.3" class="fx-line-thick"/>
<line x1="280" y1="30" x2="280" y2="225" class="fx-line-muted fx-dash"/>
<line x1="390" y1="30" x2="390" y2="225" class="fx-line-muted fx-dash"/>
<circle cx="318.3" cy="148.8" r="5" class="fx-fill-ink"/>
<line x1="280" y1="42" x2="390" y2="42" class="fx-line" marker-start="url(#breakeven-returns-ah2)" marker-end="url(#breakeven-returns-ah2)"/>
<text x="335" y="36" text-anchor="middle" class="fx-t-sm">width 5</text>
<text x="54" y="152" text-anchor="end" class="fx-t-sm">0</text>
<text x="54" y="75" text-anchor="end" class="fx-t-sm">+3.26</text>
<text x="54" y="194" text-anchor="end" class="fx-t-sm">−1.74</text>
<text x="170" y="242" text-anchor="middle" class="fx-t-sm">95</text>
<text x="280" y="242" text-anchor="middle" class="fx-t-b">K₁ = 100</text>
<text x="390" y="242" text-anchor="middle" class="fx-t-b">K₂ = 105</text>
<text x="500" y="242" text-anchor="middle" class="fx-t-sm">110</text>
<text x="610" y="262" text-anchor="end" class="fx-t-sm">S<tspan baseline-shift="sub" font-size="10">T</tspan></text>
<text x="66" y="212" class="fx-t-bad">max loss = debit 1.74 ($174)</text>
<text x="398" y="64" class="fx-t-ok">max profit = 5 − 1.74 = 3.26 ($326)</text>
<text x="324" y="167" class="fx-t-sm">BE 101.74</text>
<text x="66" y="28" class="fx-t-sm">P&amp;L per share</text>
</svg>
<figcaption>Figure 2 · The 100/105 bull call spread. Every headline number comes from two inputs: the width \(K_2 - K_1 = 5\) and the net debit \(D = 1.74\). The loss is capped by the long call, the profit by the short call.</figcaption>
</figure>

A **credit spread** turns this around. The **bull put spread** sells the 100 put for 2.12 and buys the 95 put for 0.51, collecting a net credit of \(2.12 - 0.51 = 1.61\). Now the credit is the best case, and the worst case is the width minus the credit: max profit \(1.61\) ($161), max loss \(5 - 1.61 = 3.39\) ($339), breakeven \(100 - 1.61 = 98.39\). The full family of four verticals lives in [[vertical-spreads]].

Some trades cross zero **twice**. The long straddle buys the 100 call and the 100 put for \(2.45 + 2.12 = 4.57\). Its V-shaped line crosses zero at \(100 - 4.57 = 95.43\) and \(100 + 4.57 = 104.57\): it needs a move of more than 4.57 in *either* direction. The general method never changes. Count how many times the line crosses zero, find the straight piece each crossing lies in, and solve that piece's equation. The main demo does this for any of seven structures.

| Structure (30 days) | Net premium | Max profit | Max loss | Breakeven(s) |
|---|---|---|---|---|
| Long 100 call | pay 2.45 | unlimited | 2.45 | 102.45 |
| Covered call (shares + short 105 call) | get 0.71 | 5.71 | 99.29 (at \(S_T = 0\)) | 99.29 |
| Short 95 put | get 0.51 | 0.51 | 94.49 (at \(S_T = 0\)) | 94.49 |
| Bull call spread 100/105 | pay 1.74 | 3.26 | 1.74 | 101.74 |
| Bull put spread 95/100 | get 1.61 | 1.61 | 3.39 | 98.39 |
| Long straddle 100 | pay 4.57 | unlimited | 4.57 | 95.43 and 104.57 |

### ③ Return on risk and return on capital

Dollars don't compare across sizes. A ratio does. The cleanest one uses the two extremes of the diagram:

$$
\text{return on risk} = \frac{\text{max profit}}{\text{max loss}}
$$

It answers: for every dollar I can lose, how many can I make at best?

> [!EXAMPLE] Two spreads, two very different ratios
> - Bull call spread 100/105: \(3.26 / 1.74 \approx 1.87\), i.e. **187%**. Risk $174 to make up to $326.
> - Bull put spread 95/100: \(1.61 / 3.39 \approx 0.47\), i.e. **47%**. Risk $339 to make up to $161.
>
> The first looks far better. It isn't automatically: its breakeven, 101.74, requires XYZ to rise, while the second profits anywhere above 98.39, even if XYZ slips a little. A high return on risk usually comes with a lower chance of collecting it, a trade-off that [[probability-ev]] makes exact.

Return on risk breaks down when the maximum loss is unlimited (a short call) or enormous compared with what is really at stake (a covered call, whose "max loss" is the whole share price). For those, traders use **return on capital**: profit divided by the money the trade ties up.

- **Covered call**: the capital is the shares, $10,000 for Kai. If XYZ stays at $100, Kai keeps the 0.71: \(0.71 / 100 = 0.71\%\) in 30 days. If XYZ is called away at 105: \(5.71 / 100 = 5.71\%\).
- **Cash-secured put** (sell the 95 put and keep \(95 \times 100 = \$9{,}500\) in cash to buy the shares if assigned): \(0.51 / 95 \approx 0.54\%\) in 30 days ([[cash-secured-put]]).
- **Long options**: the capital is the premium. At \(S_T = 110\) the 100 call returns \(7.55 / 2.45 \approx +308\%\), while the shares return \(+10\%\).

> [!WARN] Returns on premium are dramatic in both directions
> A long call's return is measured on a small base, so wins look enormous (+308%). But the same base makes the losses total: at any \(S_T \le 100\) the return is exactly **−100%**. A trade that is −100% often and +300% sometimes is not obviously good or bad. That depends on how often each happens, which is the subject of [[probability-ev]].

### ④ Annualized returns, and why they flatter

Income trades are short, so their returns are small numbers over short periods. To compare them with a yearly interest rate, people **annualize**:

$$
R_{\text{ann}} = (1 + R)^{365/d} - 1
$$

where \(R\) is the return over one trade (as a decimal) and \(d\) the number of days the trade lasts. The exponent \(365/d\) is how many such trades fit in a year; compounding assumes each trade's proceeds are reinvested in the next.

> [!KAI] Kai's covered call, annualized
> Flat outcome: \(R = 0.0071\), \(d = 30\): \(R_{\text{ann}} = 1.0071^{12.17} - 1 \approx 8.99\%\). The simple version, \(0.71\% \times \tfrac{365}{30} \approx 8.64\%\), ignores compounding.
> Called-away outcome: \(R = 0.0571\): \(1.0571^{12.17} - 1 \approx 96.5\%\) a year. That number is technically correct and practically meaningless.

Why meaningless? Because the formula quietly assumes **the same outcome every month for a year**. That is the caveat that belongs next to every annualized yield. Suppose eleven months go as planned (+0.71% each) and in one month XYZ falls to $90. That month the covered call loses \(90 - 100 + 0.71 = -9.29\) per share, −9.29%. The year's result:

$$
1.0071^{11} \times (1 - 0.0929) - 1 \approx -1.95\%
$$

One bad month out of twelve turns "about 9% a year" into a small loss. Income strategies collect small, frequent gains and occasionally give back a large amount at once. The annualized number shows the first part only. Slide the numbers yourself:

::demo[breakeven-returns-annualize]

### ⑤ What moves a breakeven: fees, spreads, early exits

The textbook breakeven assumes you trade at exactly the quoted price and hold to expiry. Three real-world details move it.

- **Paying the ask instead of the middle.** If the 100 call is quoted 2.42 bid / 2.48 ask (as on the XYZ chain in [[option-chain]]) and you buy at 2.48, your breakeven is 102.48, not 102.45. For a spread you cross two bid–ask spreads. How to judge this cost is in [[liquidity-spreads]].
- **Fees.** A fee of, say, $1 per contract (a round illustrative figure; fees vary by broker) is \(\$1 / 100 = \$0.01\) per share: small for one contract, but it is paid on the way in *and* on the way out.
- **Closing early.** The breakeven is an expiry concept. Before expiry the option still has time value, so the price at which you break even *today* is different, and it drifts as the days pass. That is the dashed curve of [[before-expiry]].

Breakeven, max profit, max loss and return on risk are the minimum description of a trade, and a good trade plan writes all four down before the order is sent ([[first-trade]]). They are still silent on the question every trader asks next: how likely is each outcome?

## @analogy
Think of a **lemonade stand at a summer fair**. Kai pays $50 up front for the pitch, lemons and cups, and sells each cup for $1. The breakeven is 50 cups: before the fiftieth cup Kai is still losing, however busy the stand looks. The maximum loss is the $50 (nobody buys anything). The maximum profit is set by the supply: 200 cups means at most $150 of profit. Return on risk: \(150 / 50 = 3\).

Now a friend boasts, "I made $10 on a stand that cost me $20, in one afternoon. That's 50% a day, over 18,000% a year!" The arithmetic is right; the assumption behind it (every afternoon of the year is a sunny fair day with the same customers) is not. One rainy week, and the stand's year looks very different.

Where the analogy breaks: at a lemonade stand you can see the crowd and adjust the price. With options, the premium is set before you know where the stock will end, and the market that sets it has already weighed how likely each ending is. That is why a trade with a great-looking return on risk is often a trade the market thinks is unlikely to pay.

## @misconceptions
- **“If the stock moves my way, I make money.”** — Only if it moves past the breakeven. XYZ at $101.50 is up, and the $2.45 call bought at 100 still loses $95 per contract.
- **“In the money means profitable.”** — In the money means the option has intrinsic value at expiry. Profitable means that value exceeds the premium: for the 100 call, between 100 and 102.45 it is in the money and still losing.
- **“The trade with the higher return on risk is the better trade.”** — High return on risk usually comes with a breakeven that is harder to reach. Without probabilities the ratio is half a comparison.
- **“This covered call yields 96% a year.”** — That figure assumes the best outcome repeats every month. One month with a 10% drop can erase a year of premiums.
- **“The breakeven is the price at which I can close the trade without a loss today.”** — The breakeven is defined at expiry. Before expiry the option still carries time value, and the break-even price today is somewhere else.

## @takeaways
- Breakeven = where the P&L at expiry is zero: \(K + c\) for a long call, \(K - p\) for a long put, \(S_0 - c\) for a covered call, \(K_1 + D\) for a debit call spread.
- Max profit and max loss come from the flat pieces and the ends of the diagram; always check \(S_T = 0\) and whether the last slope is zero.
- For spreads, the width and the net premium give every headline number.
- Return on risk (max profit ÷ max loss) and return on capital put trades of different sizes on one scale, but say nothing about how likely the profit is.
- Annualized yields \((1+R)^{365/d} - 1\) assume every period repeats the same outcome; one bad period can flip the sign.

## @quiz
1. Kai's friend buys the 30-day 100 call for $2.45 and XYZ ends at $101.50. What happened?
   - [ ] A profit of $150 per contract, because the call finished in the money
   - [ ] A loss of $245, because the call expired worthless
   - [x] A loss of $95 per contract: in the money, but below the 102.45 breakeven
   - [ ] Breakeven, because the stock went up
   > The call is worth \(1.50\) at expiry, less the \(2.45\) premium: \(-0.95\) per share, \(-\$95\) per contract. In the money is not the same as profitable.
2. You buy the 95 put for $0.51 and sell the 100 put for $2.12 (a bull put spread). What is the maximum loss per spread?
   - [ ] $161
   - [ ] $500
   - [ ] $212
   - [x] $339
   > The net credit is \(2.12 - 0.51 = 1.61\). The worst case, below 95, loses the width minus the credit: \(5 - 1.61 = 3.39\) per share, \(\$339\) per spread. $161 is the maximum profit.
3. Why does a 100/105 bull call spread (debit 1.74) have a higher return on risk than a 95/100 bull put spread (credit 1.61)?
   - [ ] Because debit spreads are always better trades
   - [x] Because its reward is large relative to its cost, but it needs XYZ to rise above 101.74 to profit, while the put spread profits above 98.39
   - [ ] Because the call spread has unlimited upside
   - [ ] Because the put spread has a higher maximum loss than the stock
   > Return on risk: \(3.26/1.74 \approx 187\%\) versus \(1.61/3.39 \approx 47\%\). The price of the better ratio is a harder-to-reach breakeven. Both spreads have capped profit and capped loss.
4. A trade returns 0.5% in 14 days. Which is the compounded annualized figure, and what does it assume?
   - [x] About 13.9%, assuming the same 0.5% is earned every 14 days all year and reinvested
   - [ ] About 13.0%, assuming nothing, because annualizing is exact
   - [ ] About 7%, because returns must be halved for risk
   - [ ] 0.5%, because returns cannot be annualized
   > \((1.005)^{365/14} - 1 = 1.005^{26.07} - 1 \approx 13.9\%\) (the simple version gives \(0.5\% \times 26.07 \approx 13.0\%\)). The formula assumes the outcome repeats every period, which is exactly what fails in a bad month.
5. Kai owns 100 XYZ at $100 and sells the 105 call for $0.71. What are the breakeven and the maximum profit per share?
   - [ ] Breakeven 105.71; max profit unlimited
   - [ ] Breakeven 100; max profit 0.71
   - [ ] Breakeven 99.29; max profit 0.71
   - [x] Breakeven 99.29; max profit 5.71
   > Breakeven \(= S_0 - c = 100 - 0.71 = 99.29\). Above 105 the shares are called away: \((105 - 100) + 0.71 = 5.71\) per share, \(\$571\) in total. The 0.71 is only the flat-price outcome.

## @further
- [Options Industry Council (OIC): strategies](https://www.optionseducation.org/) — each strategy page lists breakeven, maximum gain and maximum loss the same way this lesson does.
- [Characteristics and Risks of Standardized Options (OCC)](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the official risk disclosure, including the risks of uncovered (naked) positions whose maximum loss is open.
- [Vertical spread, Wikipedia](https://en.wikipedia.org/wiki/Vertical_spread) — the four vertical spreads and their payoff formulas.
- [Compound interest, Wikipedia](https://en.wikipedia.org/wiki/Compound_interest) — the arithmetic behind the annualizing formula and the difference between simple and compound rates.

## @next
The spread, the straddle and the covered call in this lesson were simply written down as finished shapes. Where do they come from, and could you build any shape you want out of calls, puts and shares? The next lesson treats diagrams like Lego bricks: add them point by point, and new strategies appear.
