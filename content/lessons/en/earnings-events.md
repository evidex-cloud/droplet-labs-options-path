---
id: earnings-events
prereqs: term-structure, vega, straddle-strangle, calendar-diagonal, iron-condor, butterfly
demo: earnings-events
---

# Trading Earnings & Events: The IV Crush

## @hook
The night before XYZ reports, its weekly straddle costs $5.75 — the market's price for a 5.75% move. The next morning XYZ jumps 5% and the straddle *loses* money. Nothing went wrong: a lump of variance that existed only because of the announcement vanished with it. This lesson is about pricing that lump, reading it off the chain, and choosing a structure for it.

## @bridge
Kai's story began with earnings "in about three weeks" ([[welcome]]). The tools for that moment are now all on the table: [[term-structure]] and [[calendar-diagonal]] taught that variance adds up over time and that two expiries imply a forward vol; [[straddle-strangle]] showed that a straddle's price is the market's expected move; [[vega]] measured what a drop in implied vol costs; [[iron-condor]] and [[butterfly]] sell and shape the distribution. This lesson answers: **how much move is priced into an event, how do you extract it, and what happens to each structure when the news lands?** It builds Idea ③ (volatility as a quantity that can be scheduled).

## @intuition
Most days, XYZ's price drifts on the ordinary flow of news. One day a quarter it doesn't drift — it **jumps**, because the company publishes its results after the close. Options that expire after that day must pay for the jump; options that expire before it don't.

Picture variance as a **staircase**. Each ordinary day adds a small, equal step. Earnings day adds one big step. An option's price reflects the total height of the stairs up to its expiry. The 30-day option includes the big step; so does the 60-day option, but it spreads it over twice as many days. That is why, three weeks before earnings, XYZ's 30-day implied vol is **30%** while its 60-day vol is only **25%** (for illustration) — an inverted term structure, created by one date.

<figure>
<svg viewBox="0 0 640 240" role="img" aria-label="The variance staircase: a daily slope plus an event step"><defs><marker id="earnings-events-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs><line x1="65.0" y1="190.0" x2="612.0" y2="190.0" class="fx-axis" marker-end="url(#earnings-events-ah)"/><line x1="70.0" y1="195.0" x2="70.0" y2="24.0" class="fx-axis"/><polyline points="70.0,190.0 243.9,162.0" class="fx-line-thick"/><polyline points="243.9,99.1 583.4,44.4" class="fx-line-thick"/><line x1="243.9" y1="162.0" x2="243.9" y2="99.1" class="fx-line-hl"/><rect x="238.9" y="99.1" width="10" height="62.9" class="fx-hl"/><circle cx="318.4" cy="87.1" r="5" class="fx-fill-ink"/><circle cx="566.9" cy="47.1" r="5" class="fx-fill-ink"/><text x="70.0" y="206.0" text-anchor="middle" class="fx-t-sm">0</text><text x="194.2" y="206.0" text-anchor="middle" class="fx-t-sm">15</text><text x="243.9" y="206.0" text-anchor="middle" class="fx-t-sm">21</text><text x="318.4" y="206.0" text-anchor="middle" class="fx-t-sm">30</text><text x="442.7" y="206.0" text-anchor="middle" class="fx-t-sm">45</text><text x="566.9" y="206.0" text-anchor="middle" class="fx-t-sm">60</text><text x="600.0" y="226.0" text-anchor="end" class="fx-t-sm">days from today (earnings on day 21)</text><text x="76.0" y="22.0" class="fx-t-sm">cumulative total variance</text><text x="256.3" y="140.0" class="fx-t-hl">earnings step: 0.0045</text><text x="256.3" y="156.0" class="fx-t-hl">(≈ one 6.7% day)</text><text x="232" y="149.3" text-anchor="end" class="fx-t-sm">daily slope = 18.7%²</text><text x="326.4" y="105.1" class="fx-t-b">30-day: IV 30%</text><text x="560.9" y="35.1" text-anchor="end" class="fx-t-b">60-day: IV 25%</text></svg>
<figcaption>Figure 1 · XYZ's cumulative total variance \(\sigma^2 T\). Ordinary days add a steady slope (a base vol of 18.7%); earnings day on day 21 adds a jump of about 0.0045, the variance of a 6.7% one-day move. Both the 30-day (30%) and 60-day (25%) quotes are points on this staircase — which is how you back out the size of the step.</figcaption>
</figure>

> [!KAI] Kai decides what to do about earnings
> Kai still owns 100 XYZ at $100 and still has no idea which way the results will go. The night before, the weekly options that expire six days after the announcement trade at **52%** implied vol, and the at-the-money straddle costs **$5.75**. Kai reads that as: "the market expects XYZ to move about 5.75% by the end of the week, most of it on the announcement". The question is no longer *will it move*, but *will it move more or less than 5.75%* — and how each choice (do nothing, hedge with a put, buy a straddle, sell premium) behaves after the jump.

The next morning, whatever the stock does, the big step is gone. The remaining days are ordinary days, and the weekly's implied vol falls from 52% to about the base 18.7%. That fall is the **IV crush**. It isn't a market mood swing; it is arithmetic: the variance that was in the price has been *realized* (by the jump) and removed from the future.

> [!THINK] The straddle cost 5.75 (implied move 5.75%). XYZ jumps exactly 5%. Profit or loss?
> Predict before opening the answer.
> ---
> A loss of about 0.64 per share. After the event the straddle is worth about 5.10: the 5-dollar intrinsic value plus a little time value at 18.7% vol for six days. The jump was big, but slightly smaller than the one priced in — and the event premium on top of it is gone.

We'll take it in five parts:

- **① Event variance: the step in the staircase**
- **② The implied move and how to read it**
- **③ The IV crush**
- **④ Four structures for one event**
- **⑤ Other scheduled events, and the state of play (2026)**

## @mechanics
### ① Event variance: the step in the staircase

Treat an event as a one-day jump with its own variance \(\sigma_{\text{event}}^2\) (total, not annualised), added to an ordinary base vol \(\sigma_{\text{base}}\). An option expiring at \(T_1\), after the event, then carries total variance \(\sigma_{\text{front}}^2 T_1 = \sigma_{\text{base}}^2 T_1 + \sigma_{\text{event}}^2\), so

$$
\sigma_{\text{event}}^2 = \sigma_{\text{front}}^2\,T_1 - \sigma_{\text{base}}^2\,T_1
$$

where \(\sigma_{\text{front}}\) is the implied vol of an expiry that contains the event and \(T_1\) its time to expiry in years.

Where does \(\sigma_{\text{base}}\) come from? If two expiries both contain the event, the event's variance is the same in both, so it cancels in their difference: the base vol is exactly the **forward vol** between them from [[calendar-diagonal]].

> [!EXAMPLE] Extracting XYZ's earnings step (30-day 30%, 60-day 25%)
> Base vol (forward vol from 30 to 60 days): \(\sigma_{\text{base}}^2 = (0.25^2 \times 60 - 0.30^2 \times 30)/30 = 0.035\), so \(\sigma_{\text{base}} \approx 18.7\%\).
> Event variance: \(\sigma_{\text{event}}^2 = 0.09 \times \tfrac{30}{365} - 0.035 \times \tfrac{30}{365} = 0.007397 - 0.002877 = 0.00452\).
> Event standard deviation \(\sqrt{0.00452} \approx 6.7\%\); expected absolute event move \(\approx 0.8 \times 6.7\% \approx 5.4\%\).

::demo[earnings-events-extract]

> [!DEEP] Refinements desks make
> The event day itself isn't an ordinary day, so strictly \(\sigma_{\text{front}}^2 T_1 = \sigma_{\text{base}}^2 (T_1 - \tfrac{1}{365}) + \sigma_{\text{event}}^2\); for XYZ that nudges the event std from 6.72% to 6.79%. Desks also count trading days rather than calendar days, add weekend effects, and fit the base vol from several expiries. The structure of the answer — a slope plus a step — stays the same.

### ② The implied move and how to read it

For the expiry just after the event, the at-the-money straddle gives the quickest read ([[straddle-strangle]]): it prices the expected absolute move to expiry.

$$
\text{Implied move} \approx \frac{\text{Straddle}_{\text{ATM}}}{S} \approx 0.8\,\sqrt{\sigma_{\text{base}}^2\,T + \sigma_{\text{event}}^2}
$$

where \(T\) is the time to that expiry and the square root is the total standard deviation (ordinary days plus the event).

> [!EXAMPLE] XYZ the night before
> The weekly with 7 days left has total variance \(0.035 \times 7/365 + 0.00452 = 0.00519\), an implied vol of \(\sqrt{0.00519 / (7/365)} \approx 52\%\), and a straddle of **5.75** → implied move 5.75%. About 5.4 points of it are the event; the six ordinary days add the rest.

What do you compare it with? The honest benchmark is **the stock's own history of earnings moves**, measured the same way — absolute moves, from the close before to the close after. Suppose (for illustration) XYZ's last eight reactions were +3.1%, −7.4%, +2.2%, −4.0%, +9.5%, −1.8%, +5.0% and −3.3%. The average absolute move is 4.5%; the root-mean-square is 5.2%. Against a 5.75% implied move, the options look somewhat rich — but eight observations is a tiny sample, one +9.5% day moves the average a lot, and a company's situation this quarter may differ from the past two years. Traders treat the comparison as evidence, not proof.

> [!WARN] Compare like with like
> A straddle prices the *average absolute* move (≈ 0.8 standard deviations); a "one-standard-deviation" figure is 25% larger. Comparing a straddle-implied 5.75% with a historical standard deviation of 5.2%, or quoting the event move alone against a straddle that includes a week of ordinary days, produces confident conclusions from mismatched numbers.

### ③ The IV crush

After the announcement the step is gone, and the remaining expiry is priced at base vol. The drop in implied vol is large and predictable; what it costs a position is its vega times the drop:

$$
\Delta V_{\text{crush}} \approx \nu \times \big(\sigma_{\text{after}} - \sigma_{\text{before}}\big)
$$

where \(\nu\) is the position's vega per vol point and the vols are in points.

> [!EXAMPLE] The weekly straddle's crush
> Vega of the 7-day straddle at 52%: about 0.110 per point. The crush takes IV from 52.0% to 18.7%, about 33 points: \(0.110 \times (-33.3) \approx -3.68\). Add one day of ordinary decay and a no-move result is about **−3.83**. The jump has to earn that back.

<figure>
<svg viewBox="0 0 640 240" role="img" aria-label="Front- and back-month implied vol around earnings"><line x1="70.0" y1="146.0" x2="600.0" y2="146.0" class="fx-grid"/><text x="62.0" y="150.0" text-anchor="end" class="fx-t-sm">20%</text><line x1="70.0" y1="106.0" x2="600.0" y2="106.0" class="fx-grid"/><text x="62.0" y="110.0" text-anchor="end" class="fx-t-sm">30%</text><line x1="70.0" y1="66.0" x2="600.0" y2="66.0" class="fx-grid"/><text x="62.0" y="70.0" text-anchor="end" class="fx-t-sm">40%</text><line x1="70.0" y1="26.0" x2="600.0" y2="26.0" class="fx-grid"/><text x="62.0" y="30.0" text-anchor="end" class="fx-t-sm">50%</text><line x1="70.0" y1="186.0" x2="605.0" y2="186.0" class="fx-axis"/><line x1="467.5" y1="20.0" x2="467.5" y2="186.0" class="fx-line fx-dash"/><polyline points="70.0,106.0 74.7,105.7 79.5,105.4 84.2,105.1 88.9,104.7 93.6,104.4 98.4,104.1 103.1,103.7 107.8,103.4 112.6,103.1 117.3,102.7 122.0,102.4 126.8,102.0 131.5,101.6 136.2,101.2 140.9,100.9 145.7,100.5 150.4,100.1 155.1,99.7 159.9,99.3 164.6,98.9 169.3,98.5 174.1,98.0 178.8,97.6 183.5,97.2 188.2,96.7 193.0,96.3 197.7,95.8 202.4,95.3 207.2,94.8 211.9,94.3 216.6,93.8 221.4,93.3 226.1,92.8 230.8,92.3 235.5,91.8 240.3,91.2 245.0,90.6 249.7,90.1 254.5,89.5 259.2,88.9 263.9,88.3 268.7,87.7 273.4,87.0 278.1,86.4 282.8,85.7 287.6,85.0 292.3,84.4 297.0,83.7 301.8,82.9 306.5,82.2 311.2,81.4 316.0,80.7 320.7,79.9 325.4,79.0 330.1,78.2 334.9,77.4 339.6,76.5 344.3,75.6 349.1,74.7 353.8,73.7 358.5,72.7 363.3,71.7 368.0,70.7 372.7,69.6 377.4,68.5 382.2,67.4 386.9,66.3 391.6,65.1 396.4,63.8 401.1,62.6 405.8,61.3 410.6,59.9 415.3,58.5 420.0,57.1 424.7,55.6 429.5,54.0 434.2,52.4 438.9,50.7 443.7,49.0 448.4,47.2 453.1,45.3 457.9,43.3 462.6,41.3 467.3,39.2" class="fx-line-hl"/><polyline points="467.5,151.2 472.2,151.2 477.0,151.2 481.7,151.2 486.4,151.2 491.2,151.2 495.9,151.2 500.6,151.2 505.4,151.2 510.1,151.2 514.8,151.2 519.6,151.2 524.3,151.2 529.0,151.2 533.8,151.2 538.5,151.2 543.2,151.2 547.9,151.2 552.7,151.2 557.4,151.2 562.1,151.2 566.9,151.2 571.6,151.2 576.3,151.2 581.1,151.2 585.8,151.2 590.5,151.2 595.3,151.2 600.0,151.2" class="fx-line-hl"/><polyline points="70.0,126.0 74.7,125.9 79.5,125.8 84.2,125.7 88.9,125.6 93.6,125.5 98.4,125.4 103.1,125.3 107.8,125.2 112.6,125.1 117.3,125.0 122.0,124.9 126.8,124.8 131.5,124.7 136.2,124.6 140.9,124.5 145.7,124.4 150.4,124.3 155.1,124.2 159.9,124.1 164.6,124.0 169.3,123.9 174.1,123.8 178.8,123.7 183.5,123.6 188.2,123.5 193.0,123.4 197.7,123.2 202.4,123.1 207.2,123.0 211.9,122.9 216.6,122.8 221.4,122.7 226.1,122.6 230.8,122.4 235.5,122.3 240.3,122.2 245.0,122.1 249.7,121.9 254.5,121.8 259.2,121.7 263.9,121.6 268.7,121.4 273.4,121.3 278.1,121.2 282.8,121.0 287.6,120.9 292.3,120.8 297.0,120.6 301.8,120.5 306.5,120.4 311.2,120.2 316.0,120.1 320.7,119.9 325.4,119.8 330.1,119.7 334.9,119.5 339.6,119.4 344.3,119.2 349.1,119.1 353.8,118.9 358.5,118.8 363.3,118.6 368.0,118.5 372.7,118.3 377.4,118.1 382.2,118.0 386.9,117.8 391.6,117.7 396.4,117.5 401.1,117.3 405.8,117.2 410.6,117.0 415.3,116.8 420.0,116.6 424.7,116.5 429.5,116.3 434.2,116.1 438.9,115.9 443.7,115.7 448.4,115.6 453.1,115.4 457.9,115.2 462.6,115.0 467.3,114.8" class="fx-line-blue"/><polyline points="467.5,151.2 472.2,151.2 477.0,151.2 481.7,151.2 486.4,151.2 491.2,151.2 495.9,151.2 500.6,151.2 505.4,151.2 510.1,151.2 514.8,151.2 519.6,151.2 524.3,151.2 529.0,151.2 533.8,151.2 538.5,151.2 543.2,151.2 547.9,151.2 552.7,151.2 557.4,151.2 562.1,151.2 566.9,151.2 571.6,151.2 576.3,151.2 581.1,151.2 585.8,151.2 590.5,151.2 595.3,151.2 600.0,151.2" class="fx-line-blue"/><line x1="467.5" y1="39.2" x2="467.5" y2="151.2" class="fx-line-hl fx-dash"/><text x="70.0" y="202.0" text-anchor="middle" class="fx-t-sm">0</text><text x="202.5" y="202.0" text-anchor="middle" class="fx-t-sm">7</text><text x="335.0" y="202.0" text-anchor="middle" class="fx-t-sm">14</text><text x="467.5" y="202.0" text-anchor="middle" class="fx-t-sm">21</text><text x="600.0" y="202.0" text-anchor="middle" class="fx-t-sm">28</text><text x="600.0" y="222.0" text-anchor="end" class="fx-t-sm">days from today</text><text x="473.5" y="34.0" class="fx-t-b">earnings</text><text x="458.0" y="43.2" text-anchor="end" class="fx-t-hl">front 46.7%</text><text x="88.9" y="72" class="fx-t-hl">front (30-day) starts at 30%</text><text x="88.9" y="142.0" class="fx-t-blue">back (60-day) 25%</text><text x="477.0" y="169.2" class="fx-t-b">after: both ≈ 18.7%</text></svg>
<figcaption>Figure 2 · Implied vol through the event, for a constant base vol of 18.7% and one earnings step on day 21. The front month (30-day at the start) climbs as its remaining days shrink and the step weighs more — to about 46.7% the day before — then collapses to base. The 60-day month drifts up far less and falls far less. Short-dated options carry the event most intensely.</figcaption>
</figure>

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Straddle P&amp;L after earnings versus the actual move"><defs><marker id="earnings-events-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs><polygon points="60.0,121.3 60.0,32.5 63.8,34.9 67.6,37.3 71.5,39.7 75.3,42.0 79.1,44.4 82.9,46.8 86.7,49.2 90.6,51.6 94.4,54.0 98.2,56.4 102.0,58.8 105.8,61.2 109.7,63.6 113.5,66.0 117.3,68.4 121.1,70.8 124.9,73.2 128.8,75.6 132.6,77.9 136.4,80.3 140.2,82.7 144.0,85.1 147.8,87.5 151.7,89.9 155.5,92.3 159.3,94.7 163.1,97.1 166.9,99.5 170.8,101.9 174.6,104.2 178.4,106.6 182.2,109.0 186.0,111.4 189.9,113.8 193.7,116.1 197.5,118.5 201.3,120.9 202.1,121.3 202.1,121.3" class="fx-area-ok"/><polygon points="202.1,121.3 202.1,121.3 205.1,123.2 209.0,125.6 212.8,127.9 216.6,130.3 220.4,132.6 224.2,134.9 228.1,137.1 231.9,139.4 235.7,141.6 239.5,143.9 243.3,146.0 247.2,148.2 251.0,150.3 254.8,152.3 258.6,154.4 262.4,156.3 266.3,158.2 270.1,160.1 273.9,161.8 277.7,163.5 281.5,165.1 285.3,166.7 289.2,168.1 293.0,169.4 296.8,170.6 300.6,171.8 304.4,172.8 308.3,173.7 312.1,174.4 315.9,175.1 319.7,175.6 323.5,176.0 327.4,176.2 331.2,176.4 335.0,176.4 338.8,176.2 342.6,175.9 346.5,175.5 350.3,175.0 354.1,174.4 357.9,173.6 361.7,172.7 365.6,171.7 369.4,170.5 373.2,169.3 377.0,168.0 380.8,166.6 384.7,165.1 388.5,163.5 392.3,161.8 396.1,160.0 399.9,158.2 403.8,156.4 407.6,154.4 411.4,152.4 415.2,150.4 419.0,148.3 422.8,146.2 426.7,144.1 430.5,141.9 434.3,139.7 438.1,137.4 441.9,135.2 445.8,132.9 449.6,130.6 453.4,128.3 457.2,126.0 461.0,123.6 464.8,121.3 464.8,121.3" class="fx-area-bad"/><polygon points="464.8,121.3 464.8,121.3 464.9,121.3 468.7,118.9 472.5,116.6 476.3,114.2 480.1,111.8 484.0,109.5 487.8,107.1 491.6,104.7 495.4,102.3 499.2,100.0 503.1,97.6 506.9,95.2 510.7,92.8 514.5,90.4 518.3,88.0 522.2,85.6 526.0,83.2 529.8,80.8 533.6,78.4 537.4,76.1 541.3,73.7 545.1,71.3 548.9,68.9 552.7,66.5 556.5,64.1 560.3,61.7 564.2,59.3 568.0,56.9 571.8,54.5 575.6,52.1 579.4,49.7 583.3,47.3 587.1,44.9 590.9,42.6 594.7,40.2 598.5,37.8 602.4,35.4 606.2,33.0 610.0,30.6 610.0,121.3" class="fx-area-ok"/><line x1="105.8" y1="28.0" x2="105.8" y2="196.0" class="fx-grid"/><line x1="220.4" y1="28.0" x2="220.4" y2="196.0" class="fx-grid"/><line x1="335.0" y1="28.0" x2="335.0" y2="196.0" class="fx-grid"/><line x1="449.6" y1="28.0" x2="449.6" y2="196.0" class="fx-grid"/><line x1="564.2" y1="28.0" x2="564.2" y2="196.0" class="fx-grid"/><line x1="55.0" y1="121.3" x2="620.0" y2="121.3" class="fx-axis" marker-end="url(#earnings-events-ah2)"/><polyline points="60.0,32.5 63.8,34.9 67.6,37.3 71.5,39.7 75.3,42.0 79.1,44.4 82.9,46.8 86.7,49.2 90.6,51.6 94.4,54.0 98.2,56.4 102.0,58.8 105.8,61.2 109.7,63.6 113.5,66.0 117.3,68.4 121.1,70.8 124.9,73.2 128.8,75.6 132.6,77.9 136.4,80.3 140.2,82.7 144.0,85.1 147.8,87.5 151.7,89.9 155.5,92.3 159.3,94.7 163.1,97.1 166.9,99.5 170.8,101.9 174.6,104.2 178.4,106.6 182.2,109.0 186.0,111.4 189.9,113.8 193.7,116.1 197.5,118.5 201.3,120.9 205.1,123.2 209.0,125.6 212.8,127.9 216.6,130.3 220.4,132.6 224.2,134.9 228.1,137.1 231.9,139.4 235.7,141.6 239.5,143.9 243.3,146.0 247.2,148.2 251.0,150.3 254.8,152.3 258.6,154.4 262.4,156.3 266.3,158.2 270.1,160.1 273.9,161.8 277.7,163.5 281.5,165.1 285.3,166.7 289.2,168.1 293.0,169.4 296.8,170.6 300.6,171.8 304.4,172.8 308.3,173.7 312.1,174.4 315.9,175.1 319.7,175.6 323.5,176.0 327.4,176.2 331.2,176.4 335.0,176.4 338.8,176.2 342.6,175.9 346.5,175.5 350.3,175.0 354.1,174.4 357.9,173.6 361.7,172.7 365.6,171.7 369.4,170.5 373.2,169.3 377.0,168.0 380.8,166.6 384.7,165.1 388.5,163.5 392.3,161.8 396.1,160.0 399.9,158.2 403.8,156.4 407.6,154.4 411.4,152.4 415.2,150.4 419.0,148.3 422.8,146.2 426.7,144.1 430.5,141.9 434.3,139.7 438.1,137.4 441.9,135.2 445.8,132.9 449.6,130.6 453.4,128.3 457.2,126.0 461.0,123.6 464.9,121.3 468.7,118.9 472.5,116.6 476.3,114.2 480.1,111.8 484.0,109.5 487.8,107.1 491.6,104.7 495.4,102.3 499.2,100.0 503.1,97.6 506.9,95.2 510.7,92.8 514.5,90.4 518.3,88.0 522.2,85.6 526.0,83.2 529.8,80.8 533.6,78.4 537.4,76.1 541.3,73.7 545.1,71.3 548.9,68.9 552.7,66.5 556.5,64.1 560.3,61.7 564.2,59.3 568.0,56.9 571.8,54.5 575.6,52.1 579.4,49.7 583.3,47.3 587.1,44.9 590.9,42.6 594.7,40.2 598.5,37.8 602.4,35.4 606.2,33.0 610.0,30.6" class="fx-line-thick"/><line x1="203.2" y1="28.0" x2="203.2" y2="196.0" class="fx-line-hl fx-dash"/><line x1="466.8" y1="28.0" x2="466.8" y2="196.0" class="fx-line-hl fx-dash"/><text x="105.8" y="214.0" text-anchor="middle" class="fx-t-sm">−10%</text><text x="220.4" y="214.0" text-anchor="middle" class="fx-t-sm">−5%</text><text x="335.0" y="214.0" text-anchor="middle" class="fx-t-sm">0%</text><text x="449.6" y="214.0" text-anchor="middle" class="fx-t-sm">+5%</text><text x="564.2" y="214.0" text-anchor="middle" class="fx-t-sm">+10%</text><text x="610.0" y="236.0" text-anchor="end" class="fx-t-sm">XYZ's actual earnings move</text><text x="460.8" y="42.0" text-anchor="end" class="fx-t-hl">implied move ±5.75%</text><text x="335.0" y="198.3" text-anchor="middle" class="fx-t-bad">no move: −3.83 (IV crush)</text></svg>
<figcaption>Figure 3 · The weekly straddle (bought at 5.75) the morning after, against XYZ's actual move. With no move it loses 3.83 (the crush); it breaks even only near the implied move of ±5.75%; beyond that it gains roughly one for one. The event straddle is a bet on the size of the jump against the price of the jump.</figcaption>
</figure>

### ④ Four structures for one event

The same event, four ways to trade it — priced the night before (weekly at 52%, 30-day at 30%), valued the morning after with all implied vols back to 18.7%. Per share; up and down moves are close, so the table shows moves in either direction.

| Structure | Cash the night before | No move | ±2% | ±4% | ±6% | ±10% |
|---|---|---|---|---|---|---|
| Long straddle 100 (weekly) | pay 5.75 | −3.83 | −3.2 | −1.6 to −1.7 | +0.2 to +0.3 | +4.2 to +4.3 |
| Short iron condor 95/105, wings 90/110 (weekly) | receive 1.53 | +1.50 | +1.4 | +0.9 to +1.1 | about 0 | −2.5 to −2.6 |
| Calendar: sell weekly 100 call, buy 30-day 100 call | pay 0.68 | +0.59 | +0.4 to +0.5 | 0 to +0.2 | −0.1 to −0.3 | −0.4 to −0.6 |
| Long call fly 95/100/105 (weekly) | pay 1.33 | +1.79 | +1.2 to +1.3 | +0.1 | −0.8 | −1.3 |

Read it as four different bets on one number, the realized jump:

- **Straddle:** wins only if the jump exceeds the implied move. Pure long event vol.
- **Iron condor:** sells the event premium with capped risk; wins on anything smaller than about 6%. At 52% implied vol the credit is richer (1.53) than the same condor in a normal month (1.02, [[iron-condor]]), but so is the risk.
- **Calendar:** sells the front month's inflated vol and owns a back month that crushes less. Its result depends on the back month's vol afterwards: if implied vol after the event settles at 25% instead of falling back to 18.7% (both legs repriced there), the no-move result improves from +0.59 to about +0.98.
- **Butterfly:** a cheap bet that the stock barely moves; best if XYZ lands near 100, but it needs the jump to be small, not just smaller than implied.

> [!EXAMPLE] Kai's choice, in numbers
> If Kai's only aim is to protect the 100 shares through the event, a weekly 95 put bought at 52% vol costs about **0.97** for one week of cover — nearly twice the 0.51 that a whole month of the same protection cost at 20% vol in [[protective-put-collar]]. Insurance bought the night before a known event is priced like one. That is why hedgers often buy protection before the event premium builds, or finance it with a call sold at the same inflated vol.

### ⑤ Other scheduled events, and the state of play (2026)

- **Macro releases.** FOMC decisions, CPI and payroll reports are scheduled index-level events. Their variance shows up as small kinks in the SPX and VIX term structures ([[vix]]); short-dated index options around them follow the same staircase logic.
- **Binary events.** A drug-approval decision or a court ruling can produce a **bimodal** distribution: the stock goes up a lot or down a lot, rarely in between. A straddle or butterfly priced with a lognormal model misreads that shape; the chain's own butterflies ([[butterfly]]) often show the two humps.
- **Elections and policy.** Known dates with uncertain outcomes create event premia in index, currency and sector options; the same extraction works, with less history to compare against.
- **Text and AI.** Earnings calls and filings are exactly the data that language-model signals try to read before and after the event ([[llm-signals]]) — with the look-ahead and leakage traps discussed there.

> [!FACT] More expiries around single-stock events (as of 2026)
> In January 2026 the SEC approved Nasdaq's rule allowing Monday and Wednesday expirations for certain large single stocks and ETFs (among them TSLA, NVDA, AAPL, AMZN, META, AVGO, GOOGL, MSFT and IBIT), listed from 26 January 2026. With several expiries a week, traders can pick an expiry that sits just after an announcement, which isolates the event variance more cleanly — and concentrates the crush.

## @analogy
An earnings event is like **a scheduled hurricane forecast for one coastal town**. Insurance premiums in that town rise as the date approaches — not because the weather is worse today, but because everyone knows a storm is due on a known day. The day after the storm passes, premiums fall back to normal, whether the storm flattened the town or fizzled out at sea.

A homeowner who buys storm insurance the night before (the straddle) pays the peak price and profits only if the damage exceeds what the premium assumed. An insurer who writes policies that night (the condor) earns a rich premium but pays out if the storm is worse than forecast. A broker who sells this week's storm cover and buys next month's ordinary cover (the calendar) bets that this week's price is inflated relative to normal times.

The *forecast* — how much damage the storm will do — is the implied move. The history of past storms is your check on it, but every storm is different, and the sample of past storms is small.

Where the analogy breaks: hurricanes rarely hit the town exactly as predicted, while stock prices after earnings can land anywhere in a wide range, including right in the middle, where the storm buyer loses the most.

## @misconceptions
- **“If I'm sure the stock will move a lot, buying a straddle before earnings is a good bet.”** — Everyone knows it will move; the price already contains a 5.75% move. You need the move to exceed that, and the crush removes the event premium either way.
- **“The IV crush is a surprise that hurts option buyers randomly.”** — It is scheduled arithmetic: the event variance leaves the price once the event is over. What's uncertain is the jump, not the crush.
- **“Selling premium before earnings is easy money because IV always falls.”** — IV falls, but the jump is realized: a 10% move costs the short condor about 2.5 per share against a 1.53 credit.
- **“The implied move is the market's forecast of direction.”** — It is a forecast of size only; the straddle is symmetric.
- **“Past earnings moves tell me whether options are cheap.”** — They are useful evidence, but a handful of observations, fat tails and a changing company make the comparison noisy; compare like with like (absolute moves vs straddle).

## @takeaways
- An event adds a step of variance: \(\sigma_{\text{event}}^2 = \sigma_{\text{front}}^2T_1 - \sigma_{\text{base}}^2T_1\), with the base vol taken as the forward vol between two expiries.
- The at-the-money straddle of the first post-event expiry, divided by spot, is the implied move (≈ 0.8 × total standard deviation): 5.75% for XYZ.
- After the announcement the event variance leaves the price: the IV crush costs roughly vega × the vol drop (about −3.7 for XYZ's weekly straddle).
- Straddle, condor, calendar and butterfly are four bets on one number — the realized jump versus the implied one — with very different payoffs and risks.
- Compare the implied move with a stock's own history of absolute moves, knowing that the sample is small and tails are fat.

## @quiz
1. XYZ's 30-day IV is 30% (contains earnings) and the forward vol between 30 and 60 days is 18.7%. What is the event variance?
   - [ ] \(0.30 - 0.187 = 0.113\)
   - [x] \((0.30^2 - 0.187^2) \times 30/365 \approx 0.0045\)
   - [ ] \(0.30^2 \times 30/365 \approx 0.0074\)
   - [ ] \(0.187^2 \approx 0.035\)
   > The event is the part of the front's total variance not explained by ordinary days: \(\sigma_{\text{front}}^2T_1 - \sigma_{\text{base}}^2T_1\). Subtracting vols instead of variances is the classic slip.
2. The night before earnings, the weekly ATM straddle costs $5.75 with XYZ at $100. What does the market expect?
   - [ ] XYZ to rise 5.75%
   - [x] An average absolute move of about 5.75% by that expiry, direction unknown
   - [ ] A 5.75% move with 100% certainty
   - [ ] A one-standard-deviation move of 5.75% exactly
   > Straddle / spot is the expected absolute move; it says nothing about direction, and one standard deviation is about 25% larger than the average absolute move.
3. After the announcement XYZ hasn't moved at all. Why does the straddle lose about 3.83?
   - [ ] Because of a day of ordinary time decay only
   - [ ] Because the market maker widened the spread
   - [x] Because implied vol falls from about 52% to 18.7%, and the straddle's vega of 0.11 times −33 points is about −3.7, plus a day of decay
   - [ ] Because delta was negative
   > The crush is the event variance leaving the price. It is predictable in size; only the jump that could offset it is uncertain.
4. Which structure profits most if XYZ moves only 2% on the news?
   - [ ] The long straddle
   - [x] The short iron condor or the butterfly
   - [ ] None of them; all lose on small moves
   - [ ] Only the calendar
   > A small move with a collapsing IV favours the premium sellers: the condor keeps about +1.4 and the fly about +1.2 per share, while the straddle loses about 3.2.
5. XYZ's last eight earnings moves average 4.5% in absolute size, and the implied move is 5.75%. What is the most careful conclusion?
   - [ ] Options are definitely overpriced; sell the straddle
   - [ ] Options are definitely underpriced; buy the straddle
   - [x] The options look somewhat rich, but eight observations and fat tails make this weak evidence
   - [ ] Historical moves are irrelevant to option prices
   > The comparison is like-for-like (absolute moves against a straddle) and suggestive, but one extra 10% reaction would change the average a lot.

## @further
- [Nasdaq Options Trader Alert: Monday and Wednesday expirations](https://www.nasdaqtrader.com/MicroNews.aspx?id=OTA2026-3) — the 2026 listing of extra weekly expiries for large single stocks.
- [Cboe VIX methodology](https://cdn.cboe.com/resources/vix/VIX_Methodology.pdf) — the variance arithmetic behind "event steps" in an index term structure.
- [FINRA: Zeroing in on options trading strategies](https://www.finra.org/investors/insights/zeroing-in-options-trading-strategy) — risk notes for short-dated option strategies, which event trades usually are.
- [Implied volatility (Wikipedia)](https://en.wikipedia.org/wiki/Implied_volatility) — background on how the market's volatility quote is backed out of prices.

## @next
Every trade in this stage has a known worst case or a known danger zone — but none of them says how big it should be. Is a $398 worst case too much for Kai's account? The next lesson, [[position-sizing]], turns expected value and tail risk into a size: the Kelly criterion, risk of ruin, and why short-volatility traders need it most.
