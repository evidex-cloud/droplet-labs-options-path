---
id: vertical-spreads
prereqs: payoff-lego, put-call-parity, breakeven-returns, long-options, protective-put-collar
demo: vertical-spreads
---

# Vertical Spreads: Debit and Credit

## @hook
One 30-day 100 call costs $245, and theta eats about $4.40 of it every day. Sell a 105 call against it and the cost drops to $174, the daily decay shrinks to about $1.30, and three quarters of the sensitivity to implied volatility disappears. The price: you can make at most $326. **A vertical spread frames a directional view between two strikes** — cheaper, steadier, and capped.

## @bridge
In [[long-options]], a single long option carried two burdens, theta and vega; in [[protective-put-collar]], the collar used a sold call to subsidise a bought put. A vertical spread applies the same idea without any stock: two options of the same type and expiry but different strikes, one bought and one sold ([[payoff-lego]]). The four verticals come in pairs, and put-call parity ([[put-call-parity]]) will show that the “pay first” and “get paid first” versions are the same shape. This lesson builds Idea ① (shape) and Idea ② (no-arbitrage).

## @intuition
Kai expects XYZ to rise gently over the next month but doesn't believe it will go past 105. A single 100 call makes Kai pay for the upside above 105 — upside Kai doesn't believe in. So Kai:

- **buys** the 30-day 100 call for 2.45;
- **sells** the 30-day 105 call for 0.71;
- pays a net \(2.45 - 0.71 = 1.74\), or $174 per spread.

This is a **bull call spread**.

> [!KAI] Kai's spread at expiry
> - XYZ below 100: both calls expire and Kai loses the 1.74;
> - XYZ at 101.74: breakeven;
> - XYZ above 105: the 100 call is worth \(S_T - 100\) and the 105 call costs \(S_T - 105\); the difference is fixed at 5, for a profit of \(5 - 1.74 = 3.26\), or $326 per spread.

The two strikes sit one above the other on the option chain, hence the name “vertical” spread. The same bricks build four versions: the direction can be bullish or bearish, and the payment can be a **debit** (you pay up front) or a **credit** (you are paid up front).

<figure>
<svg viewBox="0 0 660 444" role="img" aria-label="The four vertical spreads"><text x="190" y="20" text-anchor="middle" class="fx-t-b">bullish</text><text x="500" y="20" text-anchor="middle" class="fx-t-b">bearish</text><rect x="40" y="30" width="300" height="175" rx="10" class="fx-box"/><text x="190" y="50" text-anchor="middle" class="fx-t-b">Bull call spread (debit)</text><text x="190" y="68" text-anchor="middle" class="fx-t-sm">buy 100 call, sell 105 call</text><polygon points="56,129 56,129 58.2,129 60.5,129 62.7,129 64.9,129 67.2,129 69.4,129 71.6,129 73.9,129 76.1,129 78.3,129 80.6,129 82.8,129 85,129 87.3,129 89.5,129 91.7,129 94,129 96.2,129 98.4,129 100.7,129 102.9,129 105.1,129 107.4,129 109.6,129 111.8,129 114.1,129 116.3,129 118.5,129 120.8,129 123,129 125.2,129 127.5,129 129.7,129 131.9,129 134.2,129 136.4,129 138.6,129 140.9,129 143.1,129 145.3,129 147.6,129 149.8,129 152,129 154.3,129 156.5,129 158.7,129 161,129 163.2,129 165.4,129 167.7,129 169.9,129 172.1,129 174.4,129 176.6,129 178.8,129 181.1,129 183.3,129 185.5,126.7 187.8,123 190,119.3 192.2,115.6 194.5,111.9 196.7,108.1 198.9,104.4 201.2,100.7 203.4,97 205.6,93.3 207.9,89.5 210.1,87.4 212.3,87.4 214.6,87.4 216.8,87.4 219,87.4 221.3,87.4 223.5,87.4 225.7,87.4 228,87.4 230.2,87.4 232.4,87.4 234.7,87.4 236.9,87.4 239.1,87.4 241.4,87.4 243.6,87.4 245.8,87.4 248.1,87.4 250.3,87.4 252.5,87.4 254.8,87.4 257,87.4 259.2,87.4 261.5,87.4 263.7,87.4 265.9,87.4 268.2,87.4 270.4,87.4 272.6,87.4 274.9,87.4 277.1,87.4 279.3,87.4 281.6,87.4 283.8,87.4 286,87.4 288.3,87.4 290.5,87.4 292.7,87.4 295,87.4 297.2,87.4 299.4,87.4 301.7,87.4 303.9,87.4 306.1,87.4 308.4,87.4 310.6,87.4 312.8,87.4 315.1,87.4 317.3,87.4 319.5,87.4 321.8,87.4 324,87.4 324,129" class="fx-area-ok"/><polygon points="56,129 56,151.2 58.2,151.2 60.5,151.2 62.7,151.2 64.9,151.2 67.2,151.2 69.4,151.2 71.6,151.2 73.9,151.2 76.1,151.2 78.3,151.2 80.6,151.2 82.8,151.2 85,151.2 87.3,151.2 89.5,151.2 91.7,151.2 94,151.2 96.2,151.2 98.4,151.2 100.7,151.2 102.9,151.2 105.1,151.2 107.4,151.2 109.6,151.2 111.8,151.2 114.1,151.2 116.3,151.2 118.5,151.2 120.8,151.2 123,151.2 125.2,151.2 127.5,151.2 129.7,151.2 131.9,151.2 134.2,151.2 136.4,151.2 138.6,151.2 140.9,151.2 143.1,151.2 145.3,151.2 147.6,151.2 149.8,151.2 152,151.2 154.3,151.2 156.5,151.2 158.7,151.2 161,151.2 163.2,151.2 165.4,151.2 167.7,151.2 169.9,151.2 172.1,149 174.4,145.3 176.6,141.6 178.8,137.9 181.1,134.2 183.3,130.4 185.5,129 187.8,129 190,129 192.2,129 194.5,129 196.7,129 198.9,129 201.2,129 203.4,129 205.6,129 207.9,129 210.1,129 212.3,129 214.6,129 216.8,129 219,129 221.3,129 223.5,129 225.7,129 228,129 230.2,129 232.4,129 234.7,129 236.9,129 239.1,129 241.4,129 243.6,129 245.8,129 248.1,129 250.3,129 252.5,129 254.8,129 257,129 259.2,129 261.5,129 263.7,129 265.9,129 268.2,129 270.4,129 272.6,129 274.9,129 277.1,129 279.3,129 281.6,129 283.8,129 286,129 288.3,129 290.5,129 292.7,129 295,129 297.2,129 299.4,129 301.7,129 303.9,129 306.1,129 308.4,129 310.6,129 312.8,129 315.1,129 317.3,129 319.5,129 321.8,129 324,129 324,129" class="fx-area-bad"/><line x1="56" y1="129" x2="324" y2="129" class="fx-axis"/><polyline points="56,151.2 170.9,151.2 209.1,87.4 324,87.4" class="fx-line-thick"/><text x="320" y="196" text-anchor="end" class="fx-t-sm">max gain 3.26 · max loss 1.74</text><text x="170.9" y="165" text-anchor="middle" class="fx-t-sm">100</text><text x="214" y="102" class="fx-t-sm">105</text><rect x="350" y="30" width="300" height="175" rx="10" class="fx-box"/><text x="500" y="50" text-anchor="middle" class="fx-t-b">Bear put spread (debit)</text><text x="500" y="68" text-anchor="middle" class="fx-t-sm">buy 100 put, sell 95 put</text><polygon points="366,129 366,85.8 368.2,85.8 370.5,85.8 372.7,85.8 374.9,85.8 377.2,85.8 379.4,85.8 381.6,85.8 383.9,85.8 386.1,85.8 388.3,85.8 390.6,85.8 392.8,85.8 395,85.8 397.3,85.8 399.5,85.8 401.7,85.8 404,85.8 406.2,85.8 408.4,85.8 410.7,85.8 412.9,85.8 415.1,85.8 417.4,85.8 419.6,85.8 421.8,85.8 424.1,85.8 426.3,85.8 428.5,85.8 430.8,85.8 433,85.8 435.2,85.8 437.5,85.8 439.7,85.8 441.9,85.8 444.2,85.8 446.4,85.8 448.6,85.8 450.9,85.8 453.1,85.8 455.3,85.8 457.6,85.8 459.8,85.8 462,85.8 464.3,85.8 466.5,85.8 468.7,85.8 471,85.8 473.2,85.8 475.4,85.8 477.7,85.8 479.9,85.8 482.1,88 484.4,91.7 486.6,95.4 488.8,99.1 491.1,102.8 493.3,106.5 495.5,110.3 497.8,114 500,117.7 502.2,121.4 504.5,125.1 506.7,128.9 508.9,129 511.2,129 513.4,129 515.6,129 517.9,129 520.1,129 522.3,129 524.6,129 526.8,129 529,129 531.3,129 533.5,129 535.7,129 538,129 540.2,129 542.4,129 544.7,129 546.9,129 549.1,129 551.4,129 553.6,129 555.8,129 558.1,129 560.3,129 562.5,129 564.8,129 567,129 569.2,129 571.5,129 573.7,129 575.9,129 578.2,129 580.4,129 582.6,129 584.9,129 587.1,129 589.3,129 591.6,129 593.8,129 596,129 598.3,129 600.5,129 602.7,129 605,129 607.2,129 609.4,129 611.7,129 613.9,129 616.1,129 618.4,129 620.6,129 622.8,129 625.1,129 627.3,129 629.5,129 631.8,129 634,129 634,129" class="fx-area-ok"/><polygon points="366,129 366,129 368.2,129 370.5,129 372.7,129 374.9,129 377.2,129 379.4,129 381.6,129 383.9,129 386.1,129 388.3,129 390.6,129 392.8,129 395,129 397.3,129 399.5,129 401.7,129 404,129 406.2,129 408.4,129 410.7,129 412.9,129 415.1,129 417.4,129 419.6,129 421.8,129 424.1,129 426.3,129 428.5,129 430.8,129 433,129 435.2,129 437.5,129 439.7,129 441.9,129 444.2,129 446.4,129 448.6,129 450.9,129 453.1,129 455.3,129 457.6,129 459.8,129 462,129 464.3,129 466.5,129 468.7,129 471,129 473.2,129 475.4,129 477.7,129 479.9,129 482.1,129 484.4,129 486.6,129 488.8,129 491.1,129 493.3,129 495.5,129 497.8,129 500,129 502.2,129 504.5,129 506.7,129 508.9,132.6 511.2,136.3 513.4,140 515.6,143.7 517.9,147.5 520.1,149.6 522.3,149.6 524.6,149.6 526.8,149.6 529,149.6 531.3,149.6 533.5,149.6 535.7,149.6 538,149.6 540.2,149.6 542.4,149.6 544.7,149.6 546.9,149.6 549.1,149.6 551.4,149.6 553.6,149.6 555.8,149.6 558.1,149.6 560.3,149.6 562.5,149.6 564.8,149.6 567,149.6 569.2,149.6 571.5,149.6 573.7,149.6 575.9,149.6 578.2,149.6 580.4,149.6 582.6,149.6 584.9,149.6 587.1,149.6 589.3,149.6 591.6,149.6 593.8,149.6 596,149.6 598.3,149.6 600.5,149.6 602.7,149.6 605,149.6 607.2,149.6 609.4,149.6 611.7,149.6 613.9,149.6 616.1,149.6 618.4,149.6 620.6,149.6 622.8,149.6 625.1,149.6 627.3,149.6 629.5,149.6 631.8,149.6 634,149.6 634,129" class="fx-area-bad"/><line x1="366" y1="129" x2="634" y2="129" class="fx-axis"/><polyline points="366,85.8 480.9,85.8 519.1,149.6 634,149.6" class="fx-line-thick"/><text x="630" y="196" text-anchor="end" class="fx-t-sm">max gain 3.39 · max loss 1.61</text><text x="476" y="101" text-anchor="end" class="fx-t-sm">95</text><text x="519.1" y="164" text-anchor="middle" class="fx-t-sm">100</text><rect x="40" y="227" width="300" height="175" rx="10" class="fx-box2"/><text x="190" y="247" text-anchor="middle" class="fx-t-b">Bull put spread (credit)</text><text x="190" y="265" text-anchor="middle" class="fx-t-sm">sell 100 put, buy 95 put</text><polygon points="56,326 56,326 58.2,326 60.5,326 62.7,326 64.9,326 67.2,326 69.4,326 71.6,326 73.9,326 76.1,326 78.3,326 80.6,326 82.8,326 85,326 87.3,326 89.5,326 91.7,326 94,326 96.2,326 98.4,326 100.7,326 102.9,326 105.1,326 107.4,326 109.6,326 111.8,326 114.1,326 116.3,326 118.5,326 120.8,326 123,326 125.2,326 127.5,326 129.7,326 131.9,326 134.2,326 136.4,326 138.6,326 140.9,326 143.1,326 145.3,326 147.6,326 149.8,326 152,326 154.3,326 156.5,326 158.7,326 161,326 163.2,326 165.4,326 167.7,326 169.9,326 172.1,326 174.4,326 176.6,326 178.8,326 181.1,326 183.3,326 185.5,326 187.8,326 190,326 192.2,326 194.5,326 196.7,326 198.9,322.4 201.2,318.7 203.4,315 205.6,311.3 207.9,307.5 210.1,305.4 212.3,305.4 214.6,305.4 216.8,305.4 219,305.4 221.3,305.4 223.5,305.4 225.7,305.4 228,305.4 230.2,305.4 232.4,305.4 234.7,305.4 236.9,305.4 239.1,305.4 241.4,305.4 243.6,305.4 245.8,305.4 248.1,305.4 250.3,305.4 252.5,305.4 254.8,305.4 257,305.4 259.2,305.4 261.5,305.4 263.7,305.4 265.9,305.4 268.2,305.4 270.4,305.4 272.6,305.4 274.9,305.4 277.1,305.4 279.3,305.4 281.6,305.4 283.8,305.4 286,305.4 288.3,305.4 290.5,305.4 292.7,305.4 295,305.4 297.2,305.4 299.4,305.4 301.7,305.4 303.9,305.4 306.1,305.4 308.4,305.4 310.6,305.4 312.8,305.4 315.1,305.4 317.3,305.4 319.5,305.4 321.8,305.4 324,305.4 324,326" class="fx-area-ok"/><polygon points="56,326 56,369.2 58.2,369.2 60.5,369.2 62.7,369.2 64.9,369.2 67.2,369.2 69.4,369.2 71.6,369.2 73.9,369.2 76.1,369.2 78.3,369.2 80.6,369.2 82.8,369.2 85,369.2 87.3,369.2 89.5,369.2 91.7,369.2 94,369.2 96.2,369.2 98.4,369.2 100.7,369.2 102.9,369.2 105.1,369.2 107.4,369.2 109.6,369.2 111.8,369.2 114.1,369.2 116.3,369.2 118.5,369.2 120.8,369.2 123,369.2 125.2,369.2 127.5,369.2 129.7,369.2 131.9,369.2 134.2,369.2 136.4,369.2 138.6,369.2 140.9,369.2 143.1,369.2 145.3,369.2 147.6,369.2 149.8,369.2 152,369.2 154.3,369.2 156.5,369.2 158.7,369.2 161,369.2 163.2,369.2 165.4,369.2 167.7,369.2 169.9,369.2 172.1,367 174.4,363.3 176.6,359.6 178.8,355.9 181.1,352.2 183.3,348.5 185.5,344.7 187.8,341 190,337.3 192.2,333.6 194.5,329.9 196.7,326.1 198.9,326 201.2,326 203.4,326 205.6,326 207.9,326 210.1,326 212.3,326 214.6,326 216.8,326 219,326 221.3,326 223.5,326 225.7,326 228,326 230.2,326 232.4,326 234.7,326 236.9,326 239.1,326 241.4,326 243.6,326 245.8,326 248.1,326 250.3,326 252.5,326 254.8,326 257,326 259.2,326 261.5,326 263.7,326 265.9,326 268.2,326 270.4,326 272.6,326 274.9,326 277.1,326 279.3,326 281.6,326 283.8,326 286,326 288.3,326 290.5,326 292.7,326 295,326 297.2,326 299.4,326 301.7,326 303.9,326 306.1,326 308.4,326 310.6,326 312.8,326 315.1,326 317.3,326 319.5,326 321.8,326 324,326 324,326" class="fx-area-bad"/><line x1="56" y1="326" x2="324" y2="326" class="fx-axis"/><polyline points="56,369.2 170.9,369.2 209.1,305.4 324,305.4" class="fx-line-thick"/><text x="320" y="397" text-anchor="end" class="fx-t-sm">max gain 1.61 · max loss 3.39</text><text x="170.9" y="383" text-anchor="middle" class="fx-t-sm">95</text><text x="214" y="320" class="fx-t-sm">100</text><rect x="350" y="227" width="300" height="175" rx="10" class="fx-box2"/><text x="500" y="247" text-anchor="middle" class="fx-t-b">Bear call spread (credit)</text><text x="500" y="265" text-anchor="middle" class="fx-t-sm">sell 100 call, buy 105 call</text><polygon points="366,326 366,303.8 368.2,303.8 370.5,303.8 372.7,303.8 374.9,303.8 377.2,303.8 379.4,303.8 381.6,303.8 383.9,303.8 386.1,303.8 388.3,303.8 390.6,303.8 392.8,303.8 395,303.8 397.3,303.8 399.5,303.8 401.7,303.8 404,303.8 406.2,303.8 408.4,303.8 410.7,303.8 412.9,303.8 415.1,303.8 417.4,303.8 419.6,303.8 421.8,303.8 424.1,303.8 426.3,303.8 428.5,303.8 430.8,303.8 433,303.8 435.2,303.8 437.5,303.8 439.7,303.8 441.9,303.8 444.2,303.8 446.4,303.8 448.6,303.8 450.9,303.8 453.1,303.8 455.3,303.8 457.6,303.8 459.8,303.8 462,303.8 464.3,303.8 466.5,303.8 468.7,303.8 471,303.8 473.2,303.8 475.4,303.8 477.7,303.8 479.9,303.8 482.1,306 484.4,309.7 486.6,313.4 488.8,317.1 491.1,320.8 493.3,324.6 495.5,326 497.8,326 500,326 502.2,326 504.5,326 506.7,326 508.9,326 511.2,326 513.4,326 515.6,326 517.9,326 520.1,326 522.3,326 524.6,326 526.8,326 529,326 531.3,326 533.5,326 535.7,326 538,326 540.2,326 542.4,326 544.7,326 546.9,326 549.1,326 551.4,326 553.6,326 555.8,326 558.1,326 560.3,326 562.5,326 564.8,326 567,326 569.2,326 571.5,326 573.7,326 575.9,326 578.2,326 580.4,326 582.6,326 584.9,326 587.1,326 589.3,326 591.6,326 593.8,326 596,326 598.3,326 600.5,326 602.7,326 605,326 607.2,326 609.4,326 611.7,326 613.9,326 616.1,326 618.4,326 620.6,326 622.8,326 625.1,326 627.3,326 629.5,326 631.8,326 634,326 634,326" class="fx-area-ok"/><polygon points="366,326 366,326 368.2,326 370.5,326 372.7,326 374.9,326 377.2,326 379.4,326 381.6,326 383.9,326 386.1,326 388.3,326 390.6,326 392.8,326 395,326 397.3,326 399.5,326 401.7,326 404,326 406.2,326 408.4,326 410.7,326 412.9,326 415.1,326 417.4,326 419.6,326 421.8,326 424.1,326 426.3,326 428.5,326 430.8,326 433,326 435.2,326 437.5,326 439.7,326 441.9,326 444.2,326 446.4,326 448.6,326 450.9,326 453.1,326 455.3,326 457.6,326 459.8,326 462,326 464.3,326 466.5,326 468.7,326 471,326 473.2,326 475.4,326 477.7,326 479.9,326 482.1,326 484.4,326 486.6,326 488.8,326 491.1,326 493.3,326 495.5,328.3 497.8,332 500,335.7 502.2,339.4 504.5,343.1 506.7,346.9 508.9,350.6 511.2,354.3 513.4,358 515.6,361.7 517.9,365.5 520.1,367.6 522.3,367.6 524.6,367.6 526.8,367.6 529,367.6 531.3,367.6 533.5,367.6 535.7,367.6 538,367.6 540.2,367.6 542.4,367.6 544.7,367.6 546.9,367.6 549.1,367.6 551.4,367.6 553.6,367.6 555.8,367.6 558.1,367.6 560.3,367.6 562.5,367.6 564.8,367.6 567,367.6 569.2,367.6 571.5,367.6 573.7,367.6 575.9,367.6 578.2,367.6 580.4,367.6 582.6,367.6 584.9,367.6 587.1,367.6 589.3,367.6 591.6,367.6 593.8,367.6 596,367.6 598.3,367.6 600.5,367.6 602.7,367.6 605,367.6 607.2,367.6 609.4,367.6 611.7,367.6 613.9,367.6 616.1,367.6 618.4,367.6 620.6,367.6 622.8,367.6 625.1,367.6 627.3,367.6 629.5,367.6 631.8,367.6 634,367.6 634,326" class="fx-area-bad"/><line x1="366" y1="326" x2="634" y2="326" class="fx-axis"/><polyline points="366,303.8 480.9,303.8 519.1,367.6 634,367.6" class="fx-line-thick"/><text x="630" y="397" text-anchor="end" class="fx-t-sm">max gain 1.74 · max loss 3.26</text><text x="476" y="318" text-anchor="end" class="fx-t-sm">100</text><text x="519.1" y="382" text-anchor="middle" class="fx-t-sm">105</text><text x="40" y="422" class="fx-t-sm">Top row: you pay (debit). Bottom row: you are paid (credit).</text><text x="40" y="438" class="fx-t-sm">Each column shares a direction; opposite corners are mirror images.</text></svg>
<figcaption>Figure 1 · The four vertical spreads (30 days, XYZ = 100, σ = 20%). Left column bullish, right column bearish; top row debit, bottom row credit. Each is a ramp with a limited gain and a limited loss; they differ only in which way the ramp tilts and which way the money flows first.</figcaption>
</figure>

| Spread (30 days) | Structure | Net | Max profit | Max loss | Breakeven |
|---|---|---|---|---|---|
| Bull call 100/105 | buy 100C, sell 105C | pay 1.74 | 3.26 | 1.74 | 101.74 |
| Bear put 100/95 | buy 100P, sell 95P | pay 1.61 | 3.39 | 1.61 | 98.39 |
| Bull put 95/100 | sell 100P, buy 95P | receive 1.61 | 1.61 | 3.39 | 98.39 |
| Bear call 100/105 | sell 100C, buy 105C | receive 1.74 | 1.74 | 3.26 | 101.74 |

Notice the mirror images in the table: the bear call spread is the other side of the bull call spread — your maximum profit is its maximum loss.

Vertical spreads are the workhorse of options trading because they do three things at once: **the risk is defined in advance** (you know the maximum loss when you place the order), **the cost is below a single leg** (the sold leg subsidises the bought one), and **the view is expressed more precisely** (the two strikes spell out “where I start making money, and where I stop”). What they give up is the single option's open-ended tail.

> [!THINK] The bull call spread (100/105, debit) and the bull put spread (95/100, credit) are both bullish. Which one wins more often? Which one is better?
> Guess first, then read on.
> ---
> Under risk-neutral probabilities, the bull call spread finishes profitable (XYZ above 101.74) about 39% of the time; the bull put spread (XYZ above 98.39) about 62% of the time. But the credit spread makes only 1.61 when it wins and can lose up to 3.39. Under fair pricing both have an expected P&L of about zero: **a high win rate always comes with a low reward-to-risk ratio.** Neither is “better” — only better matched to your view of how far the stock will move.

We'll take it in six parts:

- **① Three numbers: max profit, max loss, breakeven**
- **② Debit ≡ credit: the parity link**
- **③ The signature: a spread's Greeks and its behaviour before expiry**
- **④ Width and strikes: trading reward-to-risk for win rate**
- **⑤ Practice: combo orders, margin, early assignment and pin risk**
- **⑥ Management: how a spread's value travels to expiry**

## @mechanics
### ① Three numbers: max profit, max loss, breakeven

Take two strikes \(K_1 < K_2\) and the width \(W = K_2 - K_1\). At expiry a spread is worth somewhere between 0 and \(W\), so all you need is the net premium at entry:

$$
\begin{gathered}\text{debit spread:}\ \Pi_{\max} = W - D,\quad \text{max loss} = D \\ \text{credit spread:}\ \Pi_{\max} = C_r,\quad \text{max loss} = W - C_r\end{gathered}
$$

where \(D\) is the net premium paid for a debit spread and \(C_r\) the net premium received for a credit spread (per share; × 100 per spread). The breakeven is measured from the end where the spread starts to pay:

- call spreads (bull call, bear call): breakeven \(= K_1 + \text{net premium}\);
- put spreads (bear put, bull put): breakeven \(= K_2 - \text{net premium}\).

> [!EXAMPLE] The 100/105 bull call spread
> \(W = 5\), \(D = 2.45 - 0.71 = 1.74\):
> $$
> \begin{gathered}\Pi_{\max} = 5 - 1.74 = 3.26 \;\Rightarrow\; \$326 \\ \text{max loss} = \$174 \\ \text{breakeven} = 100 + 1.74 = 101.74\end{gathered}
> $$
> The reward-to-risk ratio is \(3.26 / 1.74 \approx 1.9\): for each dollar at risk, at most about 1.9 dollars of profit.

### ② Debit ≡ credit: the parity link

With the same two strikes, 100/105, a bullish view can be built from calls (bull call spread, a debit) or from puts (sell the 105 put, buy the 100 put: a bull put spread, a credit). Both have exactly the same shape at expiry. Write put-call parity at each strike and subtract:

$$
\underbrace{\big[C(K_1) - C(K_2)\big]}_{\text{debit } D} + \underbrace{\big[P(K_2) - P(K_1)\big]}_{\text{credit } C_r} = (K_2 - K_1)\,e^{-rT}
$$

where \(C(K)\) and \(P(K)\) are the call and put prices at strike \(K\), and \(e^{-rT}\) is the discount factor.

> [!EXAMPLE] Checking with XYZ
> The 100/105 bull call spread costs 1.7383; the 100/105 bull put spread (sell the 105P for 5.3683, buy the 100P for 2.1230) brings in 3.2453:
> $$
> 1.7383 + 3.2453 = 4.9836 = 5 \times e^{-0.04 \times 30/365}
> $$
> The debit version pays 1.74 and can make 3.26; the credit version receives 3.25 and can lose 1.75. The only difference is one month of interest on the $5 width.

::demo[vertical-spreads-equiv]

So **choosing debit or credit is a financing choice, not a view.** Put a bull call spread and a bear put spread on the same two strikes together and all risk cancels, leaving a “box” that pays exactly 5 at expiry — the box spread, which is really a loan ([[synthetics-boxes]]).

In theory the two versions are equivalent; in practice there are three small differences:

- **Execution cost:** in the 100/105 bull put version, the sold 105 put is in the money from the start, and in-the-money options usually have wider bid-ask spreads, so a round trip can cost more ([[liquidity-spreads]]).
- **Early assignment:** an in-the-money short put that goes deep in the money can be exercised early; in the debit version the short 105 call is out of the money, so this risk is smaller.
- **Capital:** the debit version pays $174 once; the credit version takes in $325 up front but must keep margin equal to its maximum loss (about $175) in the account.

### ③ The signature: a spread's Greeks and its behaviour before expiry

The sold leg cancels most of the bought leg's gamma, theta and vega:

| 30 days, XYZ = 100 (per spread) | Δ | Γ | Θ per day | ν per vol point |
|---|---|---|---|---|
| 100 call alone | +53.4 shares | +6.9 | −$4.36 | +$11.40 |
| 100/105 bull call spread | +31.2 shares | +1.7 | −$1.28 | +$2.86 |

The spread keeps only about a quarter of the single leg's vega: **moves in implied volatility barely touch it.** That is why spreads are used to express a directional view ahead of earnings — the volatility crush that hurts single long options mostly leaves a spread alone ([[earnings-events]]).

> [!EXAMPLE] Around earnings: a single leg versus a spread
> Before earnings implied volatility has been bid up to 40%: the 30-day 100 call costs 4.73 and the 100/105 bull call spread 2.02. The next day the report is out, XYZ is at 103 and implied volatility is back to 20%:
> - the single call is worth 4.31, **a 0.42 loss** — right on direction, beaten by ν;
> - the spread is worth 2.72, **a 0.70 gain** — the sold 105 call “crushed” too, so the two legs' vega largely cancelled.

The price is that **a spread pays out slowly before expiry.**

<figure>
<svg viewBox="0 0 660 270" role="img" aria-label="Bull call spread P&L before expiry"><defs><marker id="vertical-spreads-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs><line x1="60" y1="148.1" x2="630" y2="148.1" class="fx-axis" marker-end="url(#vertical-spreads-ah)"/><text x="60" y="236" text-anchor="middle" class="fx-t-sm">90</text><line x1="60" y1="24" x2="60" y2="220" class="fx-grid"/><text x="172" y="236" text-anchor="middle" class="fx-t-sm">95</text><line x1="172" y1="24" x2="172" y2="220" class="fx-grid"/><text x="284" y="236" text-anchor="middle" class="fx-t-sm">100</text><line x1="284" y1="24" x2="284" y2="220" class="fx-grid"/><text x="396" y="236" text-anchor="middle" class="fx-t-sm">105</text><line x1="396" y1="24" x2="396" y2="220" class="fx-grid"/><text x="508" y="236" text-anchor="middle" class="fx-t-sm">110</text><line x1="508" y1="24" x2="508" y2="220" class="fx-grid"/><text x="620" y="236" text-anchor="middle" class="fx-t-sm">115</text><line x1="620" y1="24" x2="620" y2="220" class="fx-grid"/><text x="52" y="217.5" text-anchor="end" class="fx-t-sm">−2</text><line x1="60" y1="213.5" x2="620" y2="213.5" class="fx-grid"/><text x="52" y="184.8" text-anchor="end" class="fx-t-sm">−1</text><line x1="60" y1="180.8" x2="620" y2="180.8" class="fx-grid"/><text x="52" y="119.5" text-anchor="end" class="fx-t-sm">+1</text><line x1="60" y1="115.5" x2="620" y2="115.5" class="fx-grid"/><text x="52" y="86.8" text-anchor="end" class="fx-t-sm">+2</text><line x1="60" y1="82.8" x2="620" y2="82.8" class="fx-grid"/><text x="52" y="54.1" text-anchor="end" class="fx-t-sm">+3</text><line x1="60" y1="50.1" x2="620" y2="50.1" class="fx-grid"/><polyline points="60,202.5 65.6,202.2 71.2,201.9 76.8,201.5 82.4,201.1 88,200.7 93.6,200.2 99.2,199.6 104.8,199.1 110.4,198.5 116,197.8 121.6,197.1 127.2,196.3 132.8,195.5 138.4,194.6 144,193.6 149.6,192.6 155.2,191.6 160.8,190.4 166.4,189.2 172,187.9 177.6,186.6 183.2,185.2 188.8,183.7 194.4,182.1 200,180.5 205.6,178.8 211.2,177 216.8,175.1 222.4,173.2 228,171.2 233.6,169.2 239.2,167.1 244.8,164.9 250.4,162.6 256,160.4 261.6,158 267.2,155.6 272.8,153.2 278.4,150.7 284,148.1 289.6,145.6 295.2,143 300.8,140.3 306.4,137.7 312,135 317.6,132.4 323.2,129.7 328.8,127 334.4,124.3 340,121.6 345.6,118.9 351.2,116.3 356.8,113.6 362.4,111 368,108.4 373.6,105.9 379.2,103.3 384.8,100.8 390.4,98.4 396,96 401.6,93.6 407.2,91.3 412.8,89.1 418.4,86.9 424,84.7 429.6,82.7 435.2,80.6 440.8,78.7 446.4,76.8 452,74.9 457.6,73.2 463.2,71.5 468.8,69.8 474.4,68.2 480,66.7 485.6,65.3 491.2,63.9 496.8,62.5 502.4,61.3 508,60.1 513.6,58.9 519.2,57.8 524.8,56.8 530.4,55.8 536,54.9 541.6,54 547.2,53.2 552.8,52.4 558.4,51.6 564,50.9 569.6,50.3 575.2,49.7 580.8,49.1 586.4,48.6 592,48.1 597.6,47.6 603.2,47.1 608.8,46.7 614.4,46.4 620,46" class="fx-line-hl fx-dash"/><polyline points="60,204.7 65.6,204.7 71.2,204.6 76.8,204.5 82.4,204.4 88,204.3 93.6,204.2 99.2,204.1 104.8,203.9 110.4,203.7 116,203.5 121.6,203.2 127.2,202.9 132.8,202.6 138.4,202.2 144,201.7 149.6,201.2 155.2,200.6 160.8,199.9 166.4,199.2 172,198.4 177.6,197.5 183.2,196.4 188.8,195.3 194.4,194.1 200,192.8 205.6,191.3 211.2,189.8 216.8,188.1 222.4,186.2 228,184.3 233.6,182.2 239.2,180 244.8,177.6 250.4,175.1 256,172.5 261.6,169.7 267.2,166.9 272.8,163.9 278.4,160.8 284,157.6 289.6,154.3 295.2,150.9 300.8,147.5 306.4,143.9 312,140.4 317.6,136.7 323.2,133.1 328.8,129.4 334.4,125.7 340,122 345.6,118.3 351.2,114.7 356.8,111 362.4,107.5 368,104 373.6,100.5 379.2,97.1 384.8,93.9 390.4,90.7 396,87.6 401.6,84.6 407.2,81.7 412.8,78.9 418.4,76.3 424,73.8 429.6,71.3 435.2,69.1 440.8,66.9 446.4,64.9 452,62.9 457.6,61.1 463.2,59.4 468.8,57.9 474.4,56.4 480,55 485.6,53.8 491.2,52.6 496.8,51.5 502.4,50.5 508,49.6 513.6,48.8 519.2,48.1 524.8,47.4 530.4,46.8 536,46.2 541.6,45.7 547.2,45.3 552.8,44.8 558.4,44.5 564,44.2 569.6,43.9 575.2,43.6 580.8,43.4 586.4,43.2 592,43 597.6,42.9 603.2,42.7 608.8,42.6 614.4,42.5 620,42.4" class="fx-line-blue fx-dash"/><polyline points="60,204.9 65.6,204.9 71.2,204.9 76.8,204.9 82.4,204.9 88,204.9 93.6,204.9 99.2,204.9 104.8,204.9 110.4,204.9 116,204.9 121.6,204.9 127.2,204.9 132.8,204.9 138.4,204.9 144,204.8 149.6,204.8 155.2,204.8 160.8,204.7 166.4,204.6 172,204.5 177.6,204.4 183.2,204.2 188.8,203.9 194.4,203.6 200,203.2 205.6,202.7 211.2,202.1 216.8,201.3 222.4,200.4 228,199.3 233.6,198 239.2,196.5 244.8,194.7 250.4,192.7 256,190.3 261.6,187.7 267.2,184.8 272.8,181.5 278.4,178 284,174.1 289.6,169.9 295.2,165.4 300.8,160.7 306.4,155.7 312,150.5 317.6,145.1 323.2,139.5 328.8,133.9 334.4,128.2 340,122.5 345.6,116.7 351.2,111.1 356.8,105.5 362.4,100.1 368,94.9 373.6,89.8 379.2,85 384.8,80.5 390.4,76.2 396,72.3 401.6,68.6 407.2,65.2 412.8,62.1 418.4,59.3 424,56.8 429.6,54.6 435.2,52.6 440.8,50.9 446.4,49.4 452,48.1 457.6,46.9 463.2,46 468.8,45.2 474.4,44.5 480,43.9 485.6,43.5 491.2,43.1 496.8,42.8 502.4,42.5 508,42.4 513.6,42.2 519.2,42.1 524.8,42 530.4,41.9 536,41.8 541.6,41.8 547.2,41.8 552.8,41.7 558.4,41.7 564,41.7 569.6,41.7 575.2,41.7 580.8,41.7 586.4,41.7 592,41.7 597.6,41.7 603.2,41.7 608.8,41.7 614.4,41.7 620,41.7" class="fx-line-ok fx-dash"/><polyline points="60,204.9 284,204.9 396,41.6 620,41.6" class="fx-line-thick"/><circle cx="508" cy="57" r="5" class="fx-fill-orange"/><text x="514" y="90" class="fx-t-hl">day 5 at 110: +2.79</text><text x="608.8" y="33.6" text-anchor="end" class="fx-t-b">expiry: max +3.26</text><text x="82.4" y="37.1" class="fx-t-hl">day 0</text><text x="82.4" y="53.4" class="fx-t-blue">day 15</text><text x="82.4" y="69.7" class="fx-t-ok">day 25</text><text x="82.4" y="86.1" class="fx-t-b">expiry (day 30)</text><text x="620" y="262" text-anchor="end" class="fx-t-sm">30-day 100/105 bull call spread (debit 1.74), σ = 20%; vertical axis = P&L per share</text></svg>
<figcaption>Figure 2 · The 100/105 bull call spread's P&L on days 0, 15 and 25, and at expiry. Even if XYZ jumps to 110 on day 5, the spread shows only +2.79, still short of its 3.26 maximum; only as time passes does the curve settle onto the expiry shape.</figcaption>
</figure>

> [!EXAMPLE] A jump to 110 on day 5
> The spread shows +2.79 (86% of the maximum); the 100 call alone shows +7.89. And the spread's signature has flipped: \(\Theta = +0.020\) (time now helps) and \(\nu = -0.053\) (rising implied volatility now hurts). **A spread's Greeks change sign with the stock's position:** below both strikes it behaves like a buyer, above both like a seller, and in between it is nearly neutral.

### ④ Width and strikes: trading reward-to-risk for win rate

All bullish, 30 days, σ = 20%:

| Bull call spread | Debit | Max profit | Breakeven | Reward : risk | Risk-neutral P(profit at expiry) |
|---|---|---|---|---|---|
| 95/105 (starts ITM) | 5.11 | 4.89 | 100.11 | 0.96 | 50.4% |
| 100/105 (starts ATM) | 1.74 | 3.26 | 101.74 | 1.88 | 39.3% |
| 100/110 (wider) | 2.31 | 7.69 | 102.31 | 3.32 | 35.6% |
| 105/110 (OTM) | 0.58 | 4.42 | 105.58 | 7.69 | 17.9% |

The pattern is exactly the elasticity trade-off from [[long-options]]: **the higher the reward-to-risk, the lower the win rate.** Under risk-neutral pricing every row has an expected P&L of about zero; which row you pick depends on how far you think the stock can go. One practical way to line the structure up with the view: **put the sold strike near your target.** Kai thinks XYZ tops out around 105, so there is no reason to pay for upside beyond it.

> [!WARN] Win rate is not expected value
> Credit spreads are often sold as “high probability.” For the 95/100 bull put spread, the risk-neutral picture is: about 62% of outcomes are profitable, but they make at most 1.61; about 18% (below 95) lose the full 3.39; the remaining 20% or so lose part of it. Weight those outcomes by their probabilities and the expected P&L is about zero — the high win rate is exactly offset by the larger losses. The win rate is half the story; the other half is how much you lose when you lose ([[probability-ev]]).

### ⑤ Practice: combo orders, margin, early assignment and pin risk

- **Trade it as one combo order:** both legs fill together at a net limit price (debit or credit), avoiding the “legging risk” of filling one leg and watching the other run away ([[orders]]).
- **Margin:** a debit spread just needs the premium paid in full; a credit spread usually requires at least the maximum loss in the account (width × 100 minus the credit received; exact rules vary by broker, see [[margin-approval]]).
- **Early assignment:** the sold leg is an American option and can be exercised early — a short call before an ex-dividend date, a short put when it is deep in the money ([[exercise-assignment]]). After assignment you suddenly hold (or owe) 100 shares while the long leg is still there; the risk stays bounded, but it takes capital and action.
- **Pin risk:** if the stock closes right at the short strike on expiry day, you can't know whether you'll be assigned. The safest course is to close the whole spread before expiry.

Put two credit spreads together — a bear call spread above and a bull put spread below — and you have an [[iron-condor]]: renting out a price range.

### ⑥ Management: how a spread's value travels to expiry

The value of the 100/105 bull call spread (cost 1.74, worth at most 5 at expiry) at different prices and dates:

| XYZ price | Day 0 | Day 15 | Day 25 | Expiry |
|---|---|---|---|---|
| 95 | 0.52 | 0.20 | 0.01 | 0 |
| 100 | 1.74 | 1.45 | 0.94 | 0 |
| 102.5 (midway between the strikes) | 2.55 | 2.54 | 2.52 | 2.50 |
| 105 (the sold strike) | 3.33 | 3.59 | 4.06 | 5.00 |
| 110 | 4.43 | 4.75 | 4.98 | 5.00 |

The table turns section ③'s “sign-changing signature” into numbers:

- **with the stock near the midpoint**, the spread's value barely changes with time (Θ ≈ 0);
- **with the stock at or below the bought strike**, value drains away with time (like a buyer);
- **with the stock at or above the sold strike**, value grows with time (like a seller) — and **the last stretch comes slowest and is packed into the final days:** with the stock sitting at 105, the spread is worth only 4.06 on day 25, and the remaining 0.94 arrives in the last five days, along with pin risk.

That is why a common practice (a description, not advice) is to close early once the profit reaches some share of the maximum rather than waiting for the last day, or to close at a preset loss when the view is invalidated. A spread's loss is capped, but when to leave still needs to be written down in advance ([[trading-psychology]]).

## @analogy
A vertical spread is like **buying a discounted plane ticket with a cap on how far it goes**.

A full-fare ticket (a single long call) can be changed and upgraded any time — fully flexible, fully priced — and the value of that flexibility melts faster the closer departure gets (theta). The discounted ticket (a bull call spread) sells off some rights you won't use — “flying further than 105” — so it is much cheaper and its flexibility melts much more slowly.

- If you only plan to fly as far as 105, the extra you'd pay for a full fare buys miles you will never use.
- If you suddenly want to fly to 120, the discounted ticket won't take you: it stops at 105.

Debit versus credit is like “pay the fare up front” versus “take a deposit up front and promise a capped refund”: the airline (the credit side) holds the money first and promises to pay back a limited amount in the worst case. Economically the two are the same; they differ only in who holds the money meanwhile and earns the interest on it.

Where the analogy fails: a ticket's price isn't recalculated every minute with the weather, while a spread's value keeps moving with the stock, time and implied volatility until expiry — just much more gently than a single option's.

## @misconceptions
- **“Spreads are safer than single options, so I can trade them bigger.”** — The loss is capped, but the most common outcome for a debit spread is still losing the whole debit. Size by maximum loss, not by how cheap it looks ([[position-sizing]]).
- **“Credit spreads have a high win rate, so they're better.”** — The win rate is high because the wins are small and the losses large. Under fair pricing, a high win rate and a low reward-to-risk are the same thing.
- **“Debit spreads and credit spreads express different views.”** — A bull call spread (debit) and a bull put spread (credit) on the same two strikes have the same shape, differing only by interest on the width. They are two ways of paying for one view.
- **“Once the stock is past the upper strike, the maximum profit is locked in.”** — Not before expiry: the spread still carries time value, and on day 5 at 110 it is worth only about 86% of the maximum. Closing now leaves some on the table; holding to expiry risks the stock falling back.
- **“Spreads don't care about implied volatility.”** — They care much less, but not zero — and once the stock moves past both strikes, vega changes sign.

## @takeaways
- A vertical spread = buy one and sell one option of the same type and expiry at different strikes; its value is boxed between 0 and the width \(W\).
- Debit spread: max profit \(W - D\), max loss \(D\). Credit spread: max profit \(C_r\), max loss \(W - C_r\).
- By parity, \(D + C_r = W e^{-rT}\): the debit and credit versions on the same strikes are one shape, and the choice between them is about financing.
- The sold leg cancels most of Γ, Θ and ν: spreads are insensitive to time and implied volatility, but they pay out slowly before expiry and their Greeks change sign with the stock's position.
- Width and strikes trade reward-to-risk against win rate; placing the sold strike near your target is a simple way to fit the structure to the view.

## @quiz
1. Kai buys the 30-day 100 call (2.45) and sells the 30-day 105 call (0.71). At expiry XYZ closes at 112. How much does the spread make?
   - [ ] $954
   - [ ] $700
   - [x] $326
   - [ ] $174
   > Above 105 the spread is worth the full width of 5, for a profit of \(5 - 1.74 = 3.26\), or $326. $954 is the result for the 100 call alone; the difference is the upside given away by selling the 105 call.
2. A bear call spread sells the 100 call and buys the 105 call for a net credit of 1.74. Its maximum loss is:
   - [ ] 1.74
   - [x] 3.26
   - [ ] 5.00
   - [ ] unlimited
   > For a credit spread the maximum loss is \(W - C_r = 5 - 1.74 = 3.26\). The long 105 call caps the loss on the upside, so it isn't unlimited.
3. On the same 100/105 strikes, 30 days, the bull call spread costs 1.74 and the bull put spread brings in 3.25. What does their sum of 4.98 tell you?
   - [ ] There is an arbitrage — do both
   - [x] The sum equals the present value of the width, \(5e^{-rT}\): they are one shape paid for in two ways
   - [ ] The credit spread is the better deal because it brings in more cash
   - [ ] Both have the same maximum profit
   > By parity, \(D + C_r = (K_2 - K_1)e^{-rT} = 4.98\). The debit version can make 3.26 and the credit version 3.25; the difference is a month of interest.
4. Compared with the 100 call alone, the most striking change in the 100/105 bull call spread's Greeks is:
   - [ ] Delta turns negative
   - [ ] Gamma grows
   - [x] Theta and vega shrink to roughly a quarter to a third
   - [ ] Theta turns positive and vega grows
   > Theta falls from −$4.36 to −$1.28 a day, vega from 11.40 to 2.86. The sold 105 call cancels most of the time and volatility exposure; delta stays positive (about 31 shares).
5. On day 5 XYZ is already at 110 and the 100/105 bull call spread shows a profit of 2.79 (maximum 3.26). Which statement is correct?
   - [ ] The spread has locked in its maximum; there is no point holding on
   - [x] The spread still holds time value; its Θ is now positive and ν negative, and the remaining 0.47 must be earned by the passage of time
   - [ ] The spread is mispriced and should be worth 3.26
   - [ ] The spread's ν is now positive, so rising implied volatility would push it toward 3.26
   > With both strikes in the money the spread behaves like a short position: time helps (Θ positive) and rising implied volatility pushes its value down (ν negative). The remaining 0.47 arrives only as time passes.

## @further
- [Vertical spread (Wikipedia)](https://en.wikipedia.org/wiki/Vertical_spread) — structure and payoff of the four verticals.
- [Bull spread (Wikipedia)](https://en.wikipedia.org/wiki/Bull_spread) — building a bull spread with calls or with puts.
- [Bear spread (Wikipedia)](https://en.wikipedia.org/wiki/Bear_spread) — the two constructions of a bear spread.
- [Options Industry Council (OIC)](https://www.optionseducation.org/) — strategy pages on spreads and notes on multi-leg orders.
- [OCC: Characteristics and Risks of Standardized Options](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the official account of combination strategies and early-assignment risk.

## @next
We now have a toolbox: long options, covered calls, short puts, protective puts and collars, and the four verticals. Faced with a concrete view, which drawer do you open? The next lesson lays every strategy out on one map: direction × volatility × time.
