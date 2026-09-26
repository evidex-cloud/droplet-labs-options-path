---
id: calendar-diagonal
prereqs: term-structure, theta, vega, before-expiry, butterfly
demo: calendar-diagonal
---

# Calendars & Diagonals: Trading the Term Structure

## @hook
Sell a 30-day XYZ call and buy a 60-day call at the same strike. You pay $111, and in a month you have either +$134 or a loss — depending less on where XYZ goes than on one number: what the market will charge for volatility *after* the first option dies. A calendar is a bet on the future price of volatility.

## @bridge
Every structure so far in this stage used a single expiry: [[straddle-strangle]], [[iron-condor]] and [[butterfly]] all bet on the distribution of one future price. [[term-structure]] showed that implied vol differs by expiry and that two expiries together imply a *forward* volatility; [[theta]] and [[vega]] showed that short-dated options decay faster and long-dated ones carry more vega. This lesson answers: **what do you own when you are short one expiry and long another, and how do you read the trade from the term structure?** It builds Idea ③ (volatility, now along the time axis) and touches Idea ④ (a position whose Greeks change sign with time).

## @intuition
Two options with the same strike but different lives age at different speeds. From [[theta]]: XYZ's 30-day 100 call loses $0.044 a day, the 60-day one only $0.032. If XYZ sits still, the one you sold melts faster than the one you own. That speed difference is the first half of a calendar.

> [!KAI] Kai rents out the near month
> Kai likes the covered call's idea of earning time decay but doesn't want to own 100 shares. For illustration (σ = 20%, r = 4%):
> - sell the 30-day 100 call for $2.45;
> - buy the 60-day 100 call for $3.56;
> - net cost \(3.56 - 2.45 = 1.11\) per share, **$111**.
>
> In 30 days the short call expires. If XYZ is at 100, it expires worthless, and Kai's 60-day call — now a 30-day call — is worth $2.45 again (same strike, same vol, 30 days left). Profit \(2.45 - 1.11 = +1.34\) per share, **+$134**.

If XYZ runs far away in either direction, both calls end up worth about the same (deep in the money: both ≈ intrinsic; far out of the money: both ≈ 0), and Kai loses about the $111 paid. So the calendar pays most when XYZ is **near the strike at the first expiry** — a hump, like a butterfly but smoother, because the back option still has time value.

The second half of the calendar is less obvious. At the front expiry Kai still owns a 30-day option — and its price depends on the implied vol the market quotes *on that day*. If 30-day vol is 23% then, the hump peaks at +$168; if it is 17%, only +$100. The calendar is long the back month's vega: **it is a bet on the level of implied volatility one month from now.**

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Calendar spread P&amp;L on the front expiry"><defs><marker id="calendar-diagonal-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs><polygon points="60.0,124.0 60.0,177.2 63.4,177.2 66.9,177.2 70.3,177.1 73.7,177.1 77.2,177.1 80.6,177.1 84.1,177.0 87.5,177.0 90.9,176.9 94.4,176.9 97.8,176.8 101.3,176.8 104.7,176.7 108.1,176.6 111.6,176.5 115.0,176.4 118.4,176.3 121.9,176.2 125.3,176.1 128.8,175.9 132.2,175.8 135.6,175.6 139.1,175.4 142.5,175.2 145.9,175.0 149.4,174.7 152.8,174.4 156.2,174.1 159.7,173.8 163.1,173.4 166.6,173.0 170.0,172.6 173.4,172.1 176.9,171.6 180.3,171.0 183.8,170.4 187.2,169.8 190.6,169.1 194.1,168.4 197.5,167.6 200.9,166.7 204.4,165.8 207.8,164.8 211.2,163.8 214.7,162.7 218.1,161.5 221.6,160.3 225.0,158.9 228.4,157.5 231.9,156.0 235.3,154.4 238.8,152.8 242.2,151.0 245.6,149.1 249.1,147.2 252.5,145.1 255.9,143.0 259.4,140.7 262.8,138.3 266.3,135.8 269.7,133.2 273.1,130.5 276.6,127.6 280.0,124.7 280.7,124.0 280.7,124.0" class="fx-area-bad"/><polygon points="280.7,124.0 280.7,124.0 283.4,121.6 286.9,118.4 290.3,115.0 293.7,111.6 297.2,108.0 300.6,104.2 304.1,100.4 307.5,96.4 310.9,92.3 314.4,88.0 317.8,83.6 321.3,79.1 324.7,74.4 328.1,69.6 331.6,64.7 335.0,59.6 338.4,64.0 341.9,68.3 345.3,72.5 348.7,76.5 352.2,80.4 355.6,84.1 359.1,87.7 362.5,91.2 365.9,94.6 369.4,97.9 372.8,101.0 376.3,104.0 379.7,106.9 383.1,109.7 386.6,112.4 390.0,115.0 393.4,117.5 396.9,119.8 400.3,122.1 403.4,124.0 403.4,124.0" class="fx-area-ok"/><polygon points="403.4,124.0 403.4,124.0 403.8,124.3 407.2,126.3 410.6,128.3 414.1,130.2 417.5,132.0 420.9,133.7 424.4,135.3 427.8,136.9 431.2,138.4 434.7,139.8 438.1,141.1 441.6,142.4 445.0,143.6 448.4,144.7 451.9,145.8 455.3,146.8 458.8,147.7 462.2,148.7 465.6,149.5 469.1,150.3 472.5,151.1 475.9,151.8 479.4,152.5 482.8,153.1 486.2,153.7 489.7,154.2 493.1,154.8 496.6,155.2 500.0,155.7 503.4,156.1 506.9,156.5 510.3,156.9 513.8,157.2 517.2,157.6 520.6,157.9 524.1,158.2 527.5,158.4 530.9,158.7 534.4,158.9 537.8,159.1 541.3,159.3 544.7,159.5 548.1,159.6 551.6,159.8 555.0,159.9 558.4,160.1 561.9,160.2 565.3,160.3 568.7,160.4 572.2,160.5 575.6,160.6 579.1,160.7 582.5,160.8 585.9,160.8 589.4,160.9 592.8,160.9 596.3,161.0 599.7,161.1 603.1,161.1 606.6,161.1 610.0,161.2 610.0,124.0" class="fx-area-bad"/><line x1="77.2" y1="28.0" x2="77.2" y2="196.0" class="fx-grid"/><line x1="163.1" y1="28.0" x2="163.1" y2="196.0" class="fx-grid"/><line x1="249.1" y1="28.0" x2="249.1" y2="196.0" class="fx-grid"/><line x1="335.0" y1="28.0" x2="335.0" y2="196.0" class="fx-grid"/><line x1="420.9" y1="28.0" x2="420.9" y2="196.0" class="fx-grid"/><line x1="506.9" y1="28.0" x2="506.9" y2="196.0" class="fx-grid"/><line x1="592.8" y1="28.0" x2="592.8" y2="196.0" class="fx-grid"/><line x1="55.0" y1="124.0" x2="620.0" y2="124.0" class="fx-axis" marker-end="url(#calendar-diagonal-ah)"/><polyline points="60.0,176.9 63.4,176.8 66.9,176.8 70.3,176.7 73.7,176.6 77.2,176.5 80.6,176.5 84.1,176.4 87.5,176.3 90.9,176.1 94.4,176.0 97.8,175.9 101.3,175.7 104.7,175.6 108.1,175.4 111.6,175.2 115.0,175.0 118.4,174.7 121.9,174.5 125.3,174.2 128.8,173.9 132.2,173.6 135.6,173.3 139.1,172.9 142.5,172.5 145.9,172.1 149.4,171.6 152.8,171.1 156.2,170.6 159.7,170.0 163.1,169.4 166.6,168.8 170.0,168.1 173.4,167.4 176.9,166.6 180.3,165.8 183.8,164.9 187.2,164.0 190.6,163.0 194.1,161.9 197.5,160.8 200.9,159.6 204.4,158.4 207.8,157.1 211.2,155.7 214.7,154.3 218.1,152.8 221.6,151.2 225.0,149.5 228.4,147.7 231.9,145.9 235.3,144.0 238.8,142.0 242.2,139.8 245.6,137.7 249.1,135.4 252.5,133.0 255.9,130.5 259.4,127.9 262.8,125.2 266.3,122.4 269.7,119.5 273.1,116.5 276.6,113.4 280.0,110.2 283.4,106.9 286.9,103.5 290.3,99.9 293.7,96.2 297.2,92.5 300.6,88.6 304.1,84.6 307.5,80.4 310.9,76.2 314.4,71.8 317.8,67.4 321.3,62.8 324.7,58.1 328.1,53.2 331.6,48.3 335.0,43.2 338.4,47.7 341.9,52.0 345.3,56.2 348.7,60.2 352.2,64.2 355.6,68.1 359.1,71.8 362.5,75.5 365.9,79.0 369.4,82.4 372.8,85.7 376.3,88.9 379.7,92.0 383.1,95.0 386.6,98.0 390.0,100.8 393.4,103.5 396.9,106.1 400.3,108.6 403.8,111.1 407.2,113.4 410.6,115.7 414.1,117.8 417.5,119.9 420.9,121.9 424.4,123.9 427.8,125.7 431.2,127.5 434.7,129.2 438.1,130.8 441.6,132.4 445.0,133.9 448.4,135.4 451.9,136.7 455.3,138.0 458.8,139.3 462.2,140.5 465.6,141.6 469.1,142.7 472.5,143.8 475.9,144.8 479.4,145.7 482.8,146.6 486.2,147.4 489.7,148.3 493.1,149.0 496.6,149.8 500.0,150.5 503.4,151.1 506.9,151.7 510.3,152.3 513.8,152.9 517.2,153.4 520.6,153.9 524.1,154.4 527.5,154.8 530.9,155.3 534.4,155.7 537.8,156.0 541.3,156.4 544.7,156.7 548.1,157.0 551.6,157.3 555.0,157.6 558.4,157.9 561.9,158.1 565.3,158.3 568.7,158.6 572.2,158.8 575.6,159.0 579.1,159.1 582.5,159.3 585.9,159.5 589.4,159.6 592.8,159.7 596.3,159.9 599.7,160.0 603.1,160.1 606.6,160.2 610.0,160.3" class="fx-line-ok fx-dash"/><polyline points="60.0,177.3 63.4,177.3 66.9,177.3 70.3,177.3 73.7,177.3 77.2,177.3 80.6,177.3 84.1,177.3 87.5,177.3 90.9,177.2 94.4,177.2 97.8,177.2 101.3,177.2 104.7,177.2 108.1,177.2 111.6,177.1 115.0,177.1 118.4,177.1 121.9,177.0 125.3,177.0 128.8,176.9 132.2,176.9 135.6,176.8 139.1,176.7 142.5,176.6 145.9,176.6 149.4,176.4 152.8,176.3 156.2,176.2 159.7,176.0 163.1,175.8 166.6,175.7 170.0,175.4 173.4,175.2 176.9,174.9 180.3,174.6 183.8,174.3 187.2,173.9 190.6,173.5 194.1,173.1 197.5,172.6 200.9,172.1 204.4,171.5 207.8,170.9 211.2,170.2 214.7,169.4 218.1,168.6 221.6,167.7 225.0,166.8 228.4,165.8 231.9,164.7 235.3,163.5 238.8,162.2 242.2,160.8 245.6,159.4 249.1,157.8 252.5,156.1 255.9,154.3 259.4,152.5 262.8,150.4 266.3,148.3 269.7,146.1 273.1,143.7 276.6,141.2 280.0,138.5 283.4,135.8 286.9,132.8 290.3,129.8 293.7,126.6 297.2,123.2 300.6,119.7 304.1,116.0 307.5,112.2 310.9,108.2 314.4,104.1 317.8,99.8 321.3,95.4 324.7,90.8 328.1,86.0 331.6,81.1 335.0,76.0 338.4,80.4 341.9,84.6 345.3,88.7 348.7,92.6 352.2,96.4 355.6,100.0 359.1,103.4 362.5,106.7 365.9,109.9 369.4,113.0 372.8,115.9 376.3,118.6 379.7,121.3 383.1,123.8 386.6,126.2 390.0,128.4 393.4,130.6 396.9,132.6 400.3,134.6 403.8,136.4 407.2,138.1 410.6,139.7 414.1,141.3 417.5,142.7 420.9,144.1 424.4,145.4 427.8,146.6 431.2,147.7 434.7,148.7 438.1,149.7 441.6,150.6 445.0,151.5 448.4,152.3 451.9,153.0 455.3,153.7 458.8,154.4 462.2,155.0 465.6,155.5 469.1,156.0 472.5,156.5 475.9,156.9 479.4,157.3 482.8,157.7 486.2,158.1 489.7,158.4 493.1,158.7 496.6,158.9 500.0,159.2 503.4,159.4 506.9,159.6 510.3,159.8 513.8,160.0 517.2,160.1 520.6,160.2 524.1,160.4 527.5,160.5 530.9,160.6 534.4,160.7 537.8,160.8 541.3,160.9 544.7,160.9 548.1,161.0 551.6,161.1 555.0,161.1 558.4,161.2 561.9,161.2 565.3,161.2 568.7,161.3 572.2,161.3 575.6,161.3 579.1,161.4 582.5,161.4 585.9,161.4 589.4,161.4 592.8,161.4 596.3,161.4 599.7,161.5 603.1,161.5 606.6,161.5 610.0,161.5" class="fx-line-bad fx-dash"/><polyline points="60.0,177.2 63.4,177.2 66.9,177.2 70.3,177.1 73.7,177.1 77.2,177.1 80.6,177.1 84.1,177.0 87.5,177.0 90.9,176.9 94.4,176.9 97.8,176.8 101.3,176.8 104.7,176.7 108.1,176.6 111.6,176.5 115.0,176.4 118.4,176.3 121.9,176.2 125.3,176.1 128.8,175.9 132.2,175.8 135.6,175.6 139.1,175.4 142.5,175.2 145.9,175.0 149.4,174.7 152.8,174.4 156.2,174.1 159.7,173.8 163.1,173.4 166.6,173.0 170.0,172.6 173.4,172.1 176.9,171.6 180.3,171.0 183.8,170.4 187.2,169.8 190.6,169.1 194.1,168.4 197.5,167.6 200.9,166.7 204.4,165.8 207.8,164.8 211.2,163.8 214.7,162.7 218.1,161.5 221.6,160.3 225.0,158.9 228.4,157.5 231.9,156.0 235.3,154.4 238.8,152.8 242.2,151.0 245.6,149.1 249.1,147.2 252.5,145.1 255.9,143.0 259.4,140.7 262.8,138.3 266.3,135.8 269.7,133.2 273.1,130.5 276.6,127.6 280.0,124.7 283.4,121.6 286.9,118.4 290.3,115.0 293.7,111.6 297.2,108.0 300.6,104.2 304.1,100.4 307.5,96.4 310.9,92.3 314.4,88.0 317.8,83.6 321.3,79.1 324.7,74.4 328.1,69.6 331.6,64.7 335.0,59.6 338.4,64.0 341.9,68.3 345.3,72.5 348.7,76.5 352.2,80.4 355.6,84.1 359.1,87.7 362.5,91.2 365.9,94.6 369.4,97.9 372.8,101.0 376.3,104.0 379.7,106.9 383.1,109.7 386.6,112.4 390.0,115.0 393.4,117.5 396.9,119.8 400.3,122.1 403.8,124.3 407.2,126.3 410.6,128.3 414.1,130.2 417.5,132.0 420.9,133.7 424.4,135.3 427.8,136.9 431.2,138.4 434.7,139.8 438.1,141.1 441.6,142.4 445.0,143.6 448.4,144.7 451.9,145.8 455.3,146.8 458.8,147.7 462.2,148.7 465.6,149.5 469.1,150.3 472.5,151.1 475.9,151.8 479.4,152.5 482.8,153.1 486.2,153.7 489.7,154.2 493.1,154.8 496.6,155.2 500.0,155.7 503.4,156.1 506.9,156.5 510.3,156.9 513.8,157.2 517.2,157.6 520.6,157.9 524.1,158.2 527.5,158.4 530.9,158.7 534.4,158.9 537.8,159.1 541.3,159.3 544.7,159.5 548.1,159.6 551.6,159.8 555.0,159.9 558.4,160.1 561.9,160.2 565.3,160.3 568.7,160.4 572.2,160.5 575.6,160.6 579.1,160.7 582.5,160.8 585.9,160.8 589.4,160.9 592.8,160.9 596.3,161.0 599.7,161.1 603.1,161.1 606.6,161.1 610.0,161.2" class="fx-line-thick"/><text x="77.2" y="214.0" text-anchor="middle" class="fx-t-sm">85</text><text x="163.1" y="214.0" text-anchor="middle" class="fx-t-sm">90</text><text x="249.1" y="214.0" text-anchor="middle" class="fx-t-sm">95</text><text x="335.0" y="214.0" text-anchor="middle" class="fx-t-sm">100</text><text x="420.9" y="214.0" text-anchor="middle" class="fx-t-sm">105</text><text x="506.9" y="214.0" text-anchor="middle" class="fx-t-sm">110</text><text x="592.8" y="214.0" text-anchor="middle" class="fx-t-sm">115</text><text x="610.0" y="236.0" text-anchor="end" class="fx-t-sm">XYZ price on the front expiry</text><text x="408" y="35.2" class="fx-t-ok">back IV up to 23%: peak +1.68</text><text x="408" y="52.0" class="fx-t-b">back IV still 20%: peak +1.34</text><text x="408" y="68.8" class="fx-t-bad">back IV down to 17%: peak +1.00</text><circle cx="280.9" cy="124.0" r="4.5" class="fx-fill-ink"/><circle cx="403.4" cy="124.0" r="4.5" class="fx-fill-ink"/><text x="287" y="142" class="fx-t-b">96.84</text><text x="397" y="142" text-anchor="end" class="fx-t-b">103.98</text><text x="68.6" y="192.2" class="fx-t-bad">far from 100: lose up to the 1.11 debit</text></svg>
<figcaption>Figure 1 · The 30/60-day XYZ 100 call calendar on the day the front option expires. The hump is curved because the back option is priced with Black-Scholes, not at intrinsic. Its height depends on the back month's implied vol that day: 23% (green), 20% (black) or 17% (red). Breakevens at 20%: about 96.84 and 103.98.</figcaption>
</figure>

> [!THINK] Front-month IV 30%, back-month IV 25%. Is the back month "cheap"?
> Predict first: which vol does the calendar really buy?
> ---
> Not necessarily cheap — but the gap is revealing. The 60-day option's variance includes the first 30 days (priced at 30%). Strip them out and the market is pricing only about **18.7%** for days 31–60 — the forward vol. If you think XYZ's normal vol is 20%, the calendar buys that second month below your estimate. That is the real trade.

We'll take it in six parts:

- **① The P&L at the front expiry**
- **② The Greeks: long vega, short gamma, long theta**
- **③ The term structure and forward volatility**
- **④ When the two vols don't move together**
- **⑤ Diagonals: adding a direction**
- **⑥ State of play and connections**

## @mechanics
### ① The P&L at the front expiry

Let the front option expire at \(T_1\) and the back one at \(T_2\), both with strike \(K\), bought for a net debit \(D\). At \(T_1\) the short leg is worth its intrinsic value, but the long leg still has \(T_2 - T_1\) to live:

$$
\Pi(S_{T_1}) = C\big(S_{T_1},\,K,\,T_2 - T_1,\,\sigma_B'\big) - \big(S_{T_1} - K\big)^+ - D
$$

where \(C(\cdot)\) is the Black-Scholes call price, \(S_{T_1}\) the price at the front expiry, and \(\sigma_B'\) the back option's implied vol **on that day** — unknown when you open the trade.

> [!EXAMPLE] Reading the XYZ calendar at the front expiry
> Debit \(D = 3.5618 - 2.4513 = 1.1105\).
> - \(S_{T_1} = 100,\ \sigma_B' = 20\%\): \(2.4513 - 0 - 1.1105 = +1.34\).
> - \(S_{T_1} = 100,\ \sigma_B' = 23\%\): the back call is worth 2.79 → \(+1.68\); at 17% it is 2.11 → \(+1.00\). Each vol point is worth the 30-day vega, about 0.114.
> - \(S_{T_1} = 90\): back call ≈ 0.08 → \(-1.03\). \(S_{T_1} = 110\): back call 10.43, short call −10 → \(-0.68\).
> - Breakevens (at 20%): about 96.84 and 103.98 — asymmetric, because the call leans with the forward.

The expiry diagram of [[payoff-diagrams]] can't draw this: one leg is still alive. Calendars are the first structure in the course whose "payoff" needs a pricing model, exactly as [[before-expiry]] warned.

### ② The Greeks: long vega, short gamma, long theta

| 30-day XYZ 100 call vs 60-day | Front (short) | Back (long) | Calendar |
|---|---|---|---|
| Price | −2.45 | +3.56 | −1.11 (debit) |
| Δ | −0.534 | +0.548 | +0.014 |
| Γ | −0.069 | +0.049 | −0.020 |
| Θ per day | +0.044 | −0.032 | +0.011 |
| Vega per vol point | −0.114 | +0.161 | +0.047 |

The signs follow from the \(\sqrt{T}\) rules of [[theta]] and [[vega]]: gamma and theta are bigger for the short-dated option, vega is bigger for the long-dated one. So the calendar **collects theta and pays with gamma** (like the short straddle) while being **long vega** (like the long straddle). It is the only common structure that is short gamma and long vega at the same time — which is why it is a pure term-structure trade.

The gamma–theta balance is the same as always: the calendar earns about $0.011 a day if XYZ moves less than its implied daily move; a big move costs roughly \(\tfrac12 \times 0.020 \times (\Delta S)^2\) — a 5-dollar day costs about 0.25, more than three weeks of theta.

Like the butterfly, the calendar **pays late**. With XYZ pinned at 100 and both vols unchanged:

| Days since entry | 0 | 10 | 20 | 25 | 29 | 30 (front expiry) |
|---|---|---|---|---|---|---|
| Calendar P&L at 100 (per share) | 0.00 | +0.14 | +0.37 | +0.59 | +0.96 | +1.34 |
| Calendar P&L at 95 (per share) | −0.30 | −0.28 | −0.29 | −0.35 | −0.45 | −0.48 |

Two-thirds of the profit arrives in the last five days, because that is when the short option's theta is steepest ([[theta]]). Its gamma is steepest then too: with one day left the calendar's net gamma at 100 is about −0.31 (the 1-day call's 0.381 against the back call's 0.068), so a 2-dollar move on the last day costs about \(\tfrac12 \times 0.31 \times 2^2 \approx 0.62\) — nearly half the final profit. Holding a calendar into the front expiry is holding the sharpest part of a short-gamma position.

### ③ The term structure and forward volatility

Variance, not volatility, adds up over time ([[term-structure]]). If the market quotes \(\sigma_1\) for expiry \(T_1\) and \(\sigma_2\) for \(T_2\), the vol it implies for the period between them is

$$
\sigma_{\text{fwd}}^2 = \frac{\sigma_2^2\,T_2 - \sigma_1^2\,T_1}{T_2 - T_1}
$$

where \(\sigma_1^2 T_1\) and \(\sigma_2^2 T_2\) are the total variances to each expiry and \(\sigma_{\text{fwd}}\) is the forward volatility between \(T_1\) and \(T_2\).

> [!EXAMPLE] Three term structures, three forward vols (30 and 60 days)
> - Flat: \(\sigma_1 = \sigma_2 = 20\%\) → \(\sigma_{\text{fwd}} = 20\%\).
> - Inverted (event or stress in the front): \(\sigma_1 = 30\%,\ \sigma_2 = 25\%\) → \(\sigma_{\text{fwd}}^2 = (0.25^2 \times 60 - 0.30^2 \times 30)/(60 - 30) = (3.75 - 2.70)/30 = 0.035\), so \(\sigma_{\text{fwd}} \approx 18.7\%\) (the days cancel, so no need to convert to years).
> - Upward: \(\sigma_1 = 18\%,\ \sigma_2 = 22\%\) → \(\sigma_{\text{fwd}} \approx 25.4\%\).
>
> The upward curve looks "normal", but it prices the second month at 25.4% — well above either quoted vol.

<figure>
<svg viewBox="0 0 640 240" role="img" aria-label="Total variance by expiry and the forward volatility"><defs><marker id="calendar-diagonal-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs><line x1="65.0" y1="190.0" x2="612.0" y2="190.0" class="fx-axis" marker-end="url(#calendar-diagonal-ah2)"/><line x1="70.0" y1="195.0" x2="70.0" y2="24.0" class="fx-axis"/><polygon points="318.4,87.1 566.9,47.1 566.9,87.1" class="fx-area-hl"/><polyline points="70.0,190.0 318.4,87.1" class="fx-line-thick"/><polyline points="318.4,87.1 566.9,47.1" class="fx-line-hl"/><polyline points="70.0,190.0 566.9,98.5" class="fx-line-muted fx-dash"/><circle cx="318.4" cy="87.1" r="5" class="fx-fill-ink"/><circle cx="566.9" cy="47.1" r="5" class="fx-fill-ink"/><text x="70.0" y="206.0" text-anchor="middle" class="fx-t-sm">0</text><text x="194.2" y="206.0" text-anchor="middle" class="fx-t-sm">15</text><text x="318.4" y="206.0" text-anchor="middle" class="fx-t-sm">30</text><text x="442.7" y="206.0" text-anchor="middle" class="fx-t-sm">45</text><text x="566.9" y="206.0" text-anchor="middle" class="fx-t-sm">60</text><text x="600.0" y="226.0" text-anchor="end" class="fx-t-sm">days to expiry</text><text x="76.0" y="22.0" class="fx-t-sm">total variance σ²T</text><text x="328.4" y="107.1" class="fx-t-b">30 days: IV 30%</text><text x="566" y="80" text-anchor="end" class="fx-t-b">60 days: IV 25%</text><text x="86.6" y="42.5" class="fx-t-hl">slope of the blue segment (30→60 days) = forward variance</text><text x="86.6" y="60.5" class="fx-t-hl">→ forward vol only 18.7%</text><text x="401.3" y="151.0" class="fx-t-sm">dashed: a flat 20%</text></svg>
<figcaption>Figure 2 · Total variance \(\sigma^2 T\) against expiry. The slope from 0 to 30 days is the front vol squared (30%); the slope of the blue segment from 30 to 60 days is the forward variance — only 18.7%. A calendar is, to first order, long that segment: it profits if the vol actually charged for days 31–60 turns out higher than 18.7%.</figcaption>
</figure>

::demo[calendar-diagonal-fwdvol]

Two consequences:

**First, the calendar's “fair value” is a forward vol.** At the front expiry the back option becomes a 30-day option priced at whatever 30-day vol is then. If that vol equals today's forward vol, the term-structure part of the trade breaks even; above it, you gain about 0.114 per vol point.

> [!EXAMPLE] The event calendar at the front expiry
> Open the calendar when the curve is 30%/25%: the 30-day call at 30% costs 3.59, the 60-day at 25% costs 4.36, debit **0.77** — cheaper than the flat-curve 1.11, because you sell the rich front.
> At the front expiry with XYZ at 100, the back call (now 30 days) is priced at whatever 30-day vol is then:
> - at the forward vol, 18.7%: worth 2.30 → **+1.53**; the term-structure bet breaks even, the theta you earned while XYZ stayed at 100 is the profit;
> - at 20%: worth 2.45 → **+1.68**; at 25% → **+2.25**.
>
> The same calendar on a flat 20% curve made +1.34. Selling the front when it is rich lowers the entry price; the risk is that the event behind that richness also moves XYZ away from 100.

**Second, total variance must not fall.** If \(\sigma_2^2 T_2 < \sigma_1^2 T_1\), the forward variance would be negative — impossible. For options on the same stock and strike (no dividends), a longer-dated call can't be cheaper than a shorter one ([[arbitrage-bounds]]); a calendar quoted at a credit is an arbitrage, and fitted surfaces are checked for it ([[surface-calibration]]).

### ④ When the two vols don't move together

Treating the calendar as "long vega 0.047" hides that it holds two vegas of opposite sign on different expiries:

$$
\Delta \Pi_{\text{vol}} \approx \nu_B\,\Delta\sigma_B - \nu_F\,\Delta\sigma_F
$$

where \(\nu_F = 0.114\) and \(\nu_B = 0.161\) are the front and back vegas, and \(\Delta\sigma_F,\ \Delta\sigma_B\) the changes in each implied vol (in points).

> [!EXAMPLE] Same +5 points, three different results (XYZ at 100, immediately)
> - Both vols +5: \(+0.23\) — the "net vega" picture.
> - Front vol only +5: \(-0.57\).
> - Back vol only +5: \(+0.80\).

Short-dated implied vol moves far more than long-dated vol: in a sell-off or before an event the front end jumps and the curve **inverts**; in calm times it sags below the back. A calendar opened in a calm, upward-sloping curve and hit by a front-end spike loses on the vol leg even if the "net vega" says it should gain — and the price move that caused the spike hurts its short gamma too.

> [!WARN] Where calendars actually lose
> XYZ drops to 92 in ten days. With vols unchanged, the calendar opened at 20/20 is down about 0.65 per share; if the front jumps to 30% and the back to 26%, it is down about 0.44. The vol rise helped a little — the move itself did the damage. A calendar is a bet on **both** "XYZ stays near the strike" and "the back month's vol holds up". Losing one is usually enough to lose the trade.

**Event calendars** use this deliberately. If earnings fall between the two expiries, the front option carries the whole event premium while the back option spreads it over more days — the 30%/25% curve above. Selling the front and buying the back sells the event premium at its richest point; after the announcement the front vol collapses. The mechanics, and the traps, are in [[earnings-events]].

### ⑤ Diagonals: adding a direction

A **diagonal** is a calendar with different strikes. Moving the short strike away from spot adds delta.

- **Call diagonal:** sell the 30-day 105 call (0.71), buy the 60-day 100 call (3.56), debit 2.85, delta about +0.33. At the front expiry it earns most near 105 (+3.06 per share), loses about 0.40 at 100 and about 2.77 at 90. It is a bullish calendar: "XYZ drifts up to 105 and vol holds."
- **"Poor man's covered call":** buy a deep in-the-money long-dated call instead of the shares, and sell short-dated calls against it. Buy the 1-year 85 call (19.80, delta 0.87) and sell the 30-day 105 call (0.71). The long call stands in for about 87 shares for $1,980 instead of $10,000.

| After 30 days | XYZ 90 | 95 | 100 | 105 | 110 |
|---|---|---|---|---|---|
| Covered call (100 shares + short 105 call) | −9.29 | −4.29 | +0.71 | +5.71 | +5.71 |
| Diagonal (long 1-year 85 call + short 105 call) | −7.72 | −3.89 | +0.31 | +4.79 | +4.47 |

The diagonal risks less capital and loses less in a sell-off, but earns less when right: the long call bleeds time value (about $0.013 a day) and its delta falls as XYZ falls. It is also exposed to the long call's vega, and it leaves an early-assignment risk on the short call ([[exercise-assignment]]). Leverage, not magic: per dollar of capital, the diagonal's losses are larger.

### ⑥ State of play and connections

- **VIX futures are a term structure you can trade.** Each VIX future settles on 30-day SPX implied variance at a future date — they *are* forward vols. Most of the time the curve slopes up (contango) and futures roll down towards spot VIX; in stress it inverts ([[vix]]). A calendar in VIX futures is the index-level version of this lesson.
- **Stress shows up at the front first.** On 5 August 2024 the VIX hit about 65.7 intraday and closed near 38.6 — the largest gap ever between its intraday high and close, as of 2026 (Macroption / SEC DERA working paper). The front end can spike and collapse within hours; back-month vol barely moves by comparison. That asymmetry is what calendar and diagonal traders live with.
- **Idea ③ along the time axis.** A straddle bets on realized vs implied; a calendar bets on implied tomorrow vs forward implied today. The same "variance adds up" arithmetic reappears in [[variance-risk-premium]] (variance swaps) and in how desks bucket vega by tenor in [[portfolio-risk]].

## @analogy
A calendar is like **subletting a flat you have leased for longer**. You sign a two-month lease (the 60-day call) and immediately sublet the first month to someone else (sell the 30-day call). Their rent covers most of your cost.

At the end of the first month the subtenant leaves and you still hold one month of lease. What that remaining month is worth depends on what one-month rentals cost *then* — the implied vol on the front-expiry day. If the market is hot, your leftover month is valuable; if it's dead, you've paid for a month nobody wants much.

The flat's location matters too: the sublet works best if the neighbourhood stays as it is (XYZ near the strike). If a motorway is built next door or the area becomes the hottest in town (a big move either way), the difference between the two leases shrinks to nothing and you lose what you paid.

Where the analogy breaks: rents rarely jump 50% overnight, but short-dated implied vol can — and the jump hits the month you sublet (your short leg) harder than the month you kept.

## @misconceptions
- **“A calendar is a low-risk theta trade.”** — It collects theta by being short gamma; a 5-dollar move in XYZ costs more than three weeks of its theta, and a big move either way loses most of the debit.
- **“The calendar is long vega, so any rise in implied vol helps.”** — Only a rise in the *back* month helps. A front-month spike alone costs about 0.57 per 5 points on the XYZ calendar.
- **“If front vol is higher than back vol, the back month is cheap.”** — The relevant comparison is the forward vol (18.7% for a 30%/25% curve) against what you expect vol to be in that later period.
- **“The P&L at the first expiry is just a payoff diagram.”** — The long leg is still alive; its value needs a pricing model and a guess about future implied vol.
- **“A deep in-the-money diagonal is a covered call with less risk.”** — It uses less capital, so per dollar invested it is leveraged; it also bleeds the long call's time value and carries its vega.

## @takeaways
- A calendar sells the fast-decaying near option and buys the slower far one: long theta and short gamma near the strike, but long the back month's vega.
- Its P&L at the front expiry needs Black-Scholes for the surviving leg; the hump's height is set by the implied vol quoted on that day.
- The trade's fair value is the forward vol \(\sigma_{\text{fwd}}^2 = (\sigma_2^2T_2 - \sigma_1^2T_1)/(T_2 - T_1)\); an inverted 30%/25% curve prices days 31–60 at only 18.7%.
- Front and back vols move differently; think in two vegas (\(\nu_B\Delta\sigma_B - \nu_F\Delta\sigma_F\)), not one.
- Diagonals add direction (and leverage); event calendars sell the front-month event premium, the subject of the next lesson.

## @quiz
1. Kai's 30/60-day XYZ 100 call calendar costs 1.11. XYZ is at 100 on the front expiry and 30-day implied vol is still 20%. What is the P&L per share?
   - [ ] −1.11, because the short call expired worthless
   - [x] About +1.34: the surviving call is worth 2.45 again
   - [ ] +2.45, the full value of the back call
   - [ ] Exactly 0, because calendars are delta-neutral
   > At the front expiry the back option is a 30-day 100 call priced at 20%: 2.45. Subtract the 1.11 paid: +1.34.
2. The 30-day IV is 30% and the 60-day IV is 25%. What volatility is the market pricing for days 31 to 60?
   - [ ] 27.5%, the average
   - [ ] 25%, the back-month quote
   - [x] About 18.7%, from the forward-variance formula
   - [ ] About 35%, because the curve is inverted
   > \(\sigma_{\text{fwd}} = \sqrt{(0.25^2 \times 60 - 0.30^2 \times 30)/30} \approx 18.7\%\). Variance adds, not volatility.
3. Which Greek profile describes a long at-the-money calendar at entry?
   - [ ] Long gamma, long vega, short theta
   - [ ] Short gamma, short vega, long theta
   - [x] Short gamma, long vega, long theta
   - [ ] Long gamma, short vega, short theta
   > Front options have more gamma and theta, back options more vega: XYZ's calendar has \(\Gamma = -0.020\), vega \(+0.047\), \(\Theta = +0.011\) per day.
4. Right after Kai opens the calendar, the front month's implied vol jumps 5 points while the back month's is unchanged. What happens?
   - [ ] The calendar gains, because it is net long vega
   - [ ] Nothing, because vega only matters at expiry
   - [ ] The calendar gains about 0.80
   - [x] The calendar loses about 0.57, because Kai is short the front month's vega
   > \(\Delta\Pi \approx \nu_B\Delta\sigma_B - \nu_F\Delta\sigma_F = 0 - 0.114 \times 5 = -0.57\). "Net vega" assumes both vols move together.
5. A quote shows the 60-day 100 call below the 30-day 100 call on the same non-dividend stock. What should you conclude?
   - [x] It violates no-arbitrage: total variance can't fall with maturity, so buying the calendar at a credit would be a free lunch
   - [ ] The market expects volatility to fall
   - [ ] It is normal when the curve is inverted
   - [ ] The 60-day option must be American
   > A longer-dated call is worth at least as much as a shorter one here; a negative forward variance is impossible.

## @further
- [Calendar spread (Wikipedia)](https://en.wikipedia.org/wiki/Calendar_spread) — horizontal spreads in options and futures.
- [Diagonal spread (Wikipedia)](https://en.wikipedia.org/wiki/Diagonal_spread) — calendars with different strikes.
- [Cboe VIX methodology](https://cdn.cboe.com/resources/vix/VIX_Methodology.pdf) — how two expiries are interpolated in variance to a constant 30 days.
- [SEC DERA working paper: Demystify the Surge in VIX](https://www.sec.gov/files/dera-vix-working-paper-2504.pdf) — the August 2024 front-end spike examined.

## @next
The event calendar hinted at a bigger story: before earnings the front month carries a lump of variance that vanishes the moment the news is out. How big is that lump, how do you read it from the option chain, and which structures profit when it collapses? The next lesson is all about the IV crush.
