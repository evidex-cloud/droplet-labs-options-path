---
id: welcome
prereqs:
demo: welcome
short: true
---

# What an Option Is: A Contract That Keeps Your Choices Open

## @hook
Kai owns 100 shares of a stock and is nervous about next month. For $51, Kai can make sure that even a crash costs no more than $551. That $51 buys an **option**: a right, not an obligation. This course is about what such rights do, what they cost, and why.

## @bridge
This is the front door of the course: nothing is assumed. We meet the running example (Kai and the stock XYZ), give the one-sentence definition of an option, and lay out the map of the whole course. Next, [[derivatives]] places options in their family, and [[call-option]] takes the first option apart piece by piece. This lesson plants Idea ① — an option is a *shape* — and Idea ④ — risk is something you can measure and choose.

## @intuition
Meet **Kai**, a curious beginner. Kai owns **100 shares of XYZ**, bought at **$100** each: $10,000 in total. XYZ is a fictional, busy US stock that we will use for illustration throughout the course. It reports earnings in about three weeks, and earnings days can move a stock a lot in either direction.

Kai has three wishes, and each one is something plain shares cannot do.

> [!KAI] Kai's three wishes
> 1. **Protect**: “If earnings go badly, I don't want to lose thousands.”
> 2. **Earn income**: “While I wait, can my shares pay me something?”
> 3. **Bet on a big move with a capped loss**: “If I'm right about a jump, I want to profit; if I'm wrong, I want to lose only a small, known amount.”

Options grant all three wishes. Here is the one sentence to remember:

> [!KEY] An option in one sentence
> An option is **the right, but not the obligation, to buy (a call) or sell (a put) something at a fixed price (the strike) until a set date (the expiry)**, bought today for a price called the **premium**.

“Right, not obligation” is the whole trick. If using the right helps you, you use it. If it doesn't, you walk away, and all you have lost is the premium.

Here is how each wish becomes one trade, using the course's standard 30-day XYZ options (the prices are computed in later lessons; for now, take them as given):

- **Protect**: Kai buys a **put with strike $95** for $0.51 a share. Options come in contracts of 100 shares, so that is \(0.51 \times 100 = \$51\). Whatever happens, Kai can sell the shares for $95.
- **Earn income**: Kai sells someone a **call with strike $105** and collects $0.71 a share, \(0.71 \times 100 = \$71\), today. In exchange, Kai must sell the shares at $105 if the buyer asks.
- **Bet on a big move**: instead of shares, Kai could buy a **call with strike $100** for $2.45 a share, \(2.45 \times 100 = \$245\). If XYZ jumps, the call rises with it; if XYZ falls, Kai loses the $245 and nothing more.

Draw each trade's profit or loss at expiry against XYZ's final price and three different *shapes* appear:

<figure>
<svg data-fig="welcome-wishes" viewBox="0 0 722 274" role="img" aria-label="Kai's three wishes as three shapes"><rect x="8" y="8" width="226" height="258" rx="8" class="fx-box"/><text x="121" y="32" text-anchor="middle" class="fx-t-b">Wish 1: protect</text><text x="121" y="50" text-anchor="middle" class="fx-t-sm">100 shares + buy the 95 put</text><polygon points="30,158 30,158 31.2,158 32.3,158 33.5,158 34.6,158 35.8,158 36.9,158 38.1,158 39.2,158 40.4,158 41.5,158 42.7,158 43.8,158 45,158 46.1,158 47.3,158 48.4,158 49.6,158 50.7,158 51.9,158 53,158 54.2,158 55.3,158 56.5,158 57.6,158 58.8,158 59.9,158 61.1,158 62.2,158 63.4,158 64.5,158 65.7,158 66.8,158 67.9,158 69.1,158 70.3,158 71.4,158 72.6,158 73.7,158 74.9,158 76,158 77.2,158 78.3,158 79.4,158 80.6,158 81.8,158 82.9,158 84.1,158 85.2,158 86.4,158 87.5,158 88.7,158 89.8,158 90.9,158 92.1,158 93.3,158 94.4,158 95.6,158 96.7,158 97.9,158 99,158 100.1,158 101.3,158 102.5,158 103.6,158 104.8,158 105.9,158 107.1,158 108.2,158 109.4,158 110.5,158 111.7,158 112.8,158 114,158 115.1,158 116.3,158 117.4,158 118.6,158 119.7,158 120.9,158 122,158 123.2,158 124.3,158 125.5,157.2 126.6,156.3 127.8,155.5 128.9,154.6 130.1,153.8 131.2,152.9 132.4,152.1 133.5,151.2 134.6,150.4 135.8,149.5 137,148.7 138.1,147.8 139.3,147 140.4,146.1 141.6,145.3 142.7,144.4 143.9,143.6 145,142.7 146.1,141.9 147.3,141 148.5,140.2 149.6,139.3 150.8,138.5 151.9,137.6 153.1,136.8 154.2,135.9 155.4,135.1 156.5,134.2 157.6,133.4 158.8,132.5 160,131.7 161.1,130.8 162.3,130 163.4,129.1 164.5,128.3 165.7,127.4 166.9,126.6 168,125.7 169.2,124.9 170.3,124 171.5,123.2 172.6,122.3 173.8,121.5 174.9,120.6 176,119.8 177.2,118.9 178.4,118.1 179.5,117.2 180.7,116.4 181.8,115.5 183,114.7 184.1,113.8 185.3,113 186.4,112.1 187.5,111.3 188.7,110.4 189.9,109.6 191,108.7 192.2,107.9 193.3,107 194.5,106.2 195.6,105.3 196.8,104.5 197.9,103.6 199,102.8 200.2,101.9 201.4,101.1 202.5,100.2 203.7,99.4 204.8,98.5 206,97.7 207.1,96.8 208.3,96 209.4,95.1 210.6,94.3 211.7,93.4 212.9,92.6 214,91.7 214,158" class="fx-area-ok"/><polygon points="30,158 30,176.7 31.2,176.7 32.3,176.7 33.5,176.7 34.6,176.7 35.8,176.7 36.9,176.7 38.1,176.7 39.2,176.7 40.4,176.7 41.5,176.7 42.7,176.7 43.8,176.7 45,176.7 46.1,176.7 47.3,176.7 48.4,176.7 49.6,176.7 50.7,176.7 51.9,176.7 53,176.7 54.2,176.7 55.3,176.7 56.5,176.7 57.6,176.7 58.8,176.7 59.9,176.7 61.1,176.7 62.2,176.7 63.4,176.7 64.5,176.7 65.7,176.7 66.8,176.7 67.9,176.7 69.1,176.7 70.3,176.7 71.4,176.7 72.6,176.7 73.7,176.7 74.9,176.7 76,176.7 77.2,176.7 78.3,176.7 79.4,176.7 80.6,176.7 81.8,176.7 82.9,176.7 84.1,176.7 85.2,176.7 86.4,176.7 87.5,176.7 88.7,176.7 89.8,176.7 90.9,176.7 92.1,176.7 93.3,176.7 94.4,176.7 95.6,176.7 96.7,176.7 97.9,176.7 99,176.7 100.1,175.9 101.3,175 102.5,174.2 103.6,173.3 104.8,172.5 105.9,171.6 107.1,170.8 108.2,169.9 109.4,169.1 110.5,168.2 111.7,167.4 112.8,166.5 114,165.7 115.1,164.8 116.3,164 117.4,163.1 118.6,162.3 119.7,161.4 120.9,160.6 122,159.7 123.2,158.9 124.3,158 125.5,158 126.6,158 127.8,158 128.9,158 130.1,158 131.2,158 132.4,158 133.5,158 134.6,158 135.8,158 137,158 138.1,158 139.3,158 140.4,158 141.6,158 142.7,158 143.9,158 145,158 146.1,158 147.3,158 148.5,158 149.6,158 150.8,158 151.9,158 153.1,158 154.2,158 155.4,158 156.5,158 157.6,158 158.8,158 160,158 161.1,158 162.3,158 163.4,158 164.5,158 165.7,158 166.9,158 168,158 169.2,158 170.3,158 171.5,158 172.6,158 173.8,158 174.9,158 176,158 177.2,158 178.4,158 179.5,158 180.7,158 181.8,158 183,158 184.1,158 185.3,158 186.4,158 187.5,158 188.7,158 189.9,158 191,158 192.2,158 193.3,158 194.5,158 195.6,158 196.8,158 197.9,158 199,158 200.2,158 201.4,158 202.5,158 203.7,158 204.8,158 206,158 207.1,158 208.3,158 209.4,158 210.6,158 211.7,158 212.9,158 214,158 214,158" class="fx-area-bad"/><line x1="30" y1="158" x2="214" y2="158" class="fx-axis"/><line x1="30" y1="226" x2="214" y2="90" class="fx-line-muted fx-dash"/><polyline points="30,176.7 32.3,176.7 34.6,176.7 36.9,176.7 39.2,176.7 41.5,176.7 43.8,176.7 46.1,176.7 48.4,176.7 50.7,176.7 53,176.7 55.3,176.7 57.6,176.7 59.9,176.7 62.2,176.7 64.5,176.7 66.8,176.7 69.1,176.7 71.4,176.7 73.7,176.7 76,176.7 78.3,176.7 80.6,176.7 82.9,176.7 85.2,176.7 87.5,176.7 89.8,176.7 92.1,176.7 94.4,176.7 96.7,176.7 99,176.7 101.3,175 103.6,173.3 105.9,171.6 108.2,169.9 110.5,168.2 112.8,166.5 115.1,164.8 117.4,163.1 119.7,161.4 122,159.7 124.3,158 126.6,156.3 128.9,154.6 131.2,152.9 133.5,151.2 135.8,149.5 138.1,147.8 140.4,146.1 142.7,144.4 145,142.7 147.3,141 149.6,139.3 151.9,137.6 154.2,135.9 156.5,134.2 158.8,132.5 161.1,130.8 163.4,129.1 165.7,127.4 168,125.7 170.3,124 172.6,122.3 174.9,120.6 177.2,118.9 179.5,117.2 181.8,115.5 184.1,113.8 186.4,112.1 188.7,110.4 191,108.7 193.3,107 195.6,105.3 197.9,103.6 200.2,101.9 202.5,100.2 204.8,98.5 207.1,96.8 209.4,95.1 211.7,93.4 214,91.7" class="fx-line-thick"/><line x1="99" y1="154" x2="99" y2="162" class="fx-line"/><text x="95" y="150" text-anchor="end" class="fx-t-sm">K = 95</text><text x="108" y="195" class="fx-t-bad">worst case −$551</text><text x="121" y="248" text-anchor="middle" class="fx-t-sm">XYZ at expiry: 80 → 120</text><rect x="246" y="8" width="226" height="258" rx="8" class="fx-box"/><text x="359" y="32" text-anchor="middle" class="fx-t-b">Wish 2: earn income</text><text x="359" y="50" text-anchor="middle" class="fx-t-sm">100 shares + sell the 105 call</text><polygon points="268,158 268,158 269.2,158 270.3,158 271.5,158 272.6,158 273.8,158 274.9,158 276.1,158 277.2,158 278.4,158 279.5,158 280.7,158 281.8,158 283,158 284.1,158 285.3,158 286.4,158 287.6,158 288.7,158 289.9,158 291,158 292.2,158 293.3,158 294.5,158 295.6,158 296.8,158 297.9,158 299.1,158 300.2,158 301.4,158 302.5,158 303.7,158 304.8,158 306,158 307.1,158 308.3,158 309.4,158 310.6,158 311.7,158 312.9,158 314,158 315.2,158 316.3,158 317.5,158 318.6,158 319.8,158 320.9,158 322.1,158 323.2,158 324.4,158 325.5,158 326.7,158 327.8,158 329,158 330.1,158 331.3,158 332.4,158 333.6,158 334.7,158 335.9,158 337,158 338.2,158 339.3,158 340.5,158 341.6,158 342.8,158 343.9,158 345.1,158 346.2,158 347.4,158 348.5,158 349.7,158 350.8,158 352,158 353.1,158 354.3,158 355.4,158 356.6,158 357.7,157.3 358.9,156.4 360,155.6 361.2,154.7 362.3,153.9 363.5,153 364.6,152.2 365.8,151.3 366.9,150.5 368.1,149.6 369.2,148.8 370.4,147.9 371.5,147.1 372.7,146.2 373.8,145.4 375,144.5 376.1,143.7 377.3,142.8 378.4,142 379.6,141.1 380.7,140.3 381.9,139.4 383,138.6 384.2,138.6 385.3,138.6 386.5,138.6 387.6,138.6 388.8,138.6 389.9,138.6 391.1,138.6 392.2,138.6 393.4,138.6 394.5,138.6 395.7,138.6 396.8,138.6 398,138.6 399.1,138.6 400.3,138.6 401.4,138.6 402.5,138.6 403.7,138.6 404.9,138.6 406,138.6 407.2,138.6 408.3,138.6 409.5,138.6 410.6,138.6 411.8,138.6 412.9,138.6 414.1,138.6 415.2,138.6 416.4,138.6 417.5,138.6 418.7,138.6 419.8,138.6 421,138.6 422.1,138.6 423.3,138.6 424.4,138.6 425.6,138.6 426.7,138.6 427.9,138.6 429,138.6 430.2,138.6 431.3,138.6 432.5,138.6 433.6,138.6 434.8,138.6 435.9,138.6 437.1,138.6 438.2,138.6 439.4,138.6 440.5,138.6 441.7,138.6 442.8,138.6 444,138.6 445.1,138.6 446.3,138.6 447.4,138.6 448.6,138.6 449.7,138.6 450.9,138.6 452,138.6 452,158" class="fx-area-ok"/><polygon points="268,158 268,223.6 269.2,222.7 270.3,221.9 271.5,221 272.6,220.2 273.8,219.3 274.9,218.5 276.1,217.6 277.2,216.8 278.4,215.9 279.5,215.1 280.7,214.2 281.8,213.4 283,212.5 284.1,211.7 285.3,210.8 286.4,210 287.6,209.1 288.7,208.3 289.9,207.4 291,206.6 292.2,205.7 293.3,204.9 294.5,204 295.6,203.2 296.8,202.3 297.9,201.5 299.1,200.6 300.2,199.8 301.4,198.9 302.5,198.1 303.7,197.2 304.8,196.4 306,195.5 307.1,194.7 308.3,193.8 309.4,193 310.6,192.1 311.7,191.3 312.9,190.4 314,189.6 315.2,188.7 316.3,187.9 317.5,187 318.6,186.2 319.8,185.3 320.9,184.5 322.1,183.6 323.2,182.8 324.4,181.9 325.5,181.1 326.7,180.2 327.8,179.4 329,178.5 330.1,177.7 331.3,176.8 332.4,176 333.6,175.1 334.7,174.3 335.9,173.4 337,172.6 338.2,171.7 339.3,170.9 340.5,170 341.6,169.2 342.8,168.3 343.9,167.5 345.1,166.6 346.2,165.8 347.4,164.9 348.5,164.1 349.7,163.2 350.8,162.4 352,161.5 353.1,160.7 354.3,159.8 355.4,159 356.6,158.1 357.7,158 358.9,158 360,158 361.2,158 362.3,158 363.5,158 364.6,158 365.8,158 366.9,158 368.1,158 369.2,158 370.4,158 371.5,158 372.7,158 373.8,158 375,158 376.1,158 377.3,158 378.4,158 379.6,158 380.7,158 381.9,158 383,158 384.2,158 385.3,158 386.5,158 387.6,158 388.8,158 389.9,158 391.1,158 392.2,158 393.4,158 394.5,158 395.7,158 396.8,158 398,158 399.1,158 400.3,158 401.4,158 402.5,158 403.7,158 404.9,158 406,158 407.2,158 408.3,158 409.5,158 410.6,158 411.8,158 412.9,158 414.1,158 415.2,158 416.4,158 417.5,158 418.7,158 419.8,158 421,158 422.1,158 423.3,158 424.4,158 425.6,158 426.7,158 427.9,158 429,158 430.2,158 431.3,158 432.5,158 433.6,158 434.8,158 435.9,158 437.1,158 438.2,158 439.4,158 440.5,158 441.7,158 442.8,158 444,158 445.1,158 446.3,158 447.4,158 448.6,158 449.7,158 450.9,158 452,158 452,158" class="fx-area-bad"/><line x1="268" y1="158" x2="452" y2="158" class="fx-axis"/><line x1="268" y1="226" x2="452" y2="90" class="fx-line-muted fx-dash"/><polyline points="268,223.6 270.3,221.9 272.6,220.2 274.9,218.5 277.2,216.8 279.5,215.1 281.8,213.4 284.1,211.7 286.4,210 288.7,208.3 291,206.6 293.3,204.9 295.6,203.2 297.9,201.5 300.2,199.8 302.5,198.1 304.8,196.4 307.1,194.7 309.4,193 311.7,191.3 314,189.6 316.3,187.9 318.6,186.2 320.9,184.5 323.2,182.8 325.5,181.1 327.8,179.4 330.1,177.7 332.4,176 334.7,174.3 337,172.6 339.3,170.9 341.6,169.2 343.9,167.5 346.2,165.8 348.5,164.1 350.8,162.4 353.1,160.7 355.4,159 357.7,157.3 360,155.6 362.3,153.9 364.6,152.2 366.9,150.5 369.2,148.8 371.5,147.1 373.8,145.4 376.1,143.7 378.4,142 380.7,140.3 383,138.6 385.3,138.6 387.6,138.6 389.9,138.6 392.2,138.6 394.5,138.6 396.8,138.6 399.1,138.6 401.4,138.6 403.7,138.6 406,138.6 408.3,138.6 410.6,138.6 412.9,138.6 415.2,138.6 417.5,138.6 419.8,138.6 422.1,138.6 424.4,138.6 426.7,138.6 429,138.6 431.3,138.6 433.6,138.6 435.9,138.6 438.2,138.6 440.5,138.6 442.8,138.6 445.1,138.6 447.4,138.6 449.7,138.6 452,138.6" class="fx-line-thick"/><line x1="383" y1="154" x2="383" y2="162" class="fx-line"/><text x="383" y="174" text-anchor="middle" class="fx-t-sm">K = 105</text><line x1="419.8" y1="84" x2="419.8" y2="133.6" class="fx-line-muted"/><text x="462" y="78" text-anchor="end" class="fx-t-ok">best case +$571</text><text x="359" y="248" text-anchor="middle" class="fx-t-sm">XYZ at expiry: 80 → 120</text><rect x="484" y="8" width="226" height="258" rx="8" class="fx-box"/><text x="597" y="32" text-anchor="middle" class="fx-t-b">Wish 3: bet on a big move</text><text x="597" y="50" text-anchor="middle" class="fx-t-sm">just the 100 call, no shares</text><polygon points="506,158 506,158 507.2,158 508.3,158 509.5,158 510.6,158 511.8,158 512.9,158 514.1,158 515.2,158 516.4,158 517.5,158 518.7,158 519.8,158 521,158 522.1,158 523.3,158 524.4,158 525.6,158 526.7,158 527.9,158 529,158 530.2,158 531.3,158 532.5,158 533.6,158 534.8,158 535.9,158 537.1,158 538.2,158 539.4,158 540.5,158 541.7,158 542.8,158 544,158 545.1,158 546.3,158 547.4,158 548.6,158 549.7,158 550.9,158 552,158 553.2,158 554.3,158 555.5,158 556.6,158 557.8,158 558.9,158 560.1,158 561.2,158 562.4,158 563.5,158 564.7,158 565.8,158 567,158 568.1,158 569.3,158 570.4,158 571.6,158 572.7,158 573.9,158 575,158 576.2,158 577.3,158 578.5,158 579.6,158 580.8,158 581.9,158 583.1,158 584.2,158 585.4,158 586.5,158 587.7,158 588.8,158 590,158 591.1,158 592.3,158 593.4,158 594.6,158 595.7,158 596.9,158 598,158 599.2,158 600.3,158 601.5,158 602.6,158 603.8,158 604.9,158 606.1,158 607.2,158 608.4,158 609.5,157.8 610.7,157 611.8,156.1 613,155.3 614.1,154.4 615.3,153.6 616.4,152.7 617.6,151.9 618.7,151 619.9,150.2 621,149.3 622.2,148.5 623.3,147.6 624.5,146.8 625.6,145.9 626.8,145.1 627.9,144.2 629.1,143.4 630.2,142.5 631.4,141.7 632.5,140.8 633.7,140 634.8,139.1 636,138.3 637.1,137.4 638.3,136.6 639.4,135.7 640.6,134.9 641.7,134 642.9,133.2 644,132.3 645.2,131.5 646.3,130.6 647.5,129.8 648.6,128.9 649.8,128.1 650.9,127.2 652.1,126.4 653.2,125.5 654.4,124.7 655.5,123.8 656.7,123 657.8,122.1 659,121.3 660.1,120.4 661.3,119.6 662.4,118.7 663.6,117.9 664.7,117 665.9,116.2 667,115.3 668.2,114.5 669.3,113.6 670.5,112.8 671.6,111.9 672.8,111.1 673.9,110.2 675.1,109.4 676.2,108.5 677.4,107.7 678.5,106.8 679.7,106 680.8,105.1 682,104.3 683.1,103.4 684.3,102.6 685.4,101.7 686.6,100.9 687.7,100 688.9,99.2 690,98.3 690,158" class="fx-area-ok"/><polygon points="506,158 506,166.3 507.2,166.3 508.3,166.3 509.5,166.3 510.6,166.3 511.8,166.3 512.9,166.3 514.1,166.3 515.2,166.3 516.4,166.3 517.5,166.3 518.7,166.3 519.8,166.3 521,166.3 522.1,166.3 523.3,166.3 524.4,166.3 525.6,166.3 526.7,166.3 527.9,166.3 529,166.3 530.2,166.3 531.3,166.3 532.5,166.3 533.6,166.3 534.8,166.3 535.9,166.3 537.1,166.3 538.2,166.3 539.4,166.3 540.5,166.3 541.7,166.3 542.8,166.3 544,166.3 545.1,166.3 546.3,166.3 547.4,166.3 548.6,166.3 549.7,166.3 550.9,166.3 552,166.3 553.2,166.3 554.3,166.3 555.5,166.3 556.6,166.3 557.8,166.3 558.9,166.3 560.1,166.3 561.2,166.3 562.4,166.3 563.5,166.3 564.7,166.3 565.8,166.3 567,166.3 568.1,166.3 569.3,166.3 570.4,166.3 571.6,166.3 572.7,166.3 573.9,166.3 575,166.3 576.2,166.3 577.3,166.3 578.5,166.3 579.6,166.3 580.8,166.3 581.9,166.3 583.1,166.3 584.2,166.3 585.4,166.3 586.5,166.3 587.7,166.3 588.8,166.3 590,166.3 591.1,166.3 592.3,166.3 593.4,166.3 594.6,166.3 595.7,166.3 596.9,166.3 598,166.3 599.2,165.5 600.3,164.6 601.5,163.8 602.6,162.9 603.8,162.1 604.9,161.2 606.1,160.4 607.2,159.5 608.4,158.7 609.5,158 610.7,158 611.8,158 613,158 614.1,158 615.3,158 616.4,158 617.6,158 618.7,158 619.9,158 621,158 622.2,158 623.3,158 624.5,158 625.6,158 626.8,158 627.9,158 629.1,158 630.2,158 631.4,158 632.5,158 633.7,158 634.8,158 636,158 637.1,158 638.3,158 639.4,158 640.6,158 641.7,158 642.9,158 644,158 645.2,158 646.3,158 647.5,158 648.6,158 649.8,158 650.9,158 652.1,158 653.2,158 654.4,158 655.5,158 656.7,158 657.8,158 659,158 660.1,158 661.3,158 662.4,158 663.6,158 664.7,158 665.9,158 667,158 668.2,158 669.3,158 670.5,158 671.6,158 672.8,158 673.9,158 675.1,158 676.2,158 677.4,158 678.5,158 679.7,158 680.8,158 682,158 683.1,158 684.3,158 685.4,158 686.6,158 687.7,158 688.9,158 690,158 690,158" class="fx-area-bad"/><line x1="506" y1="158" x2="690" y2="158" class="fx-axis"/><line x1="506" y1="226" x2="690" y2="90" class="fx-line-muted fx-dash"/><polyline points="506,166.3 508.3,166.3 510.6,166.3 512.9,166.3 515.2,166.3 517.5,166.3 519.8,166.3 522.1,166.3 524.4,166.3 526.7,166.3 529,166.3 531.3,166.3 533.6,166.3 535.9,166.3 538.2,166.3 540.5,166.3 542.8,166.3 545.1,166.3 547.4,166.3 549.7,166.3 552,166.3 554.3,166.3 556.6,166.3 558.9,166.3 561.2,166.3 563.5,166.3 565.8,166.3 568.1,166.3 570.4,166.3 572.7,166.3 575,166.3 577.3,166.3 579.6,166.3 581.9,166.3 584.2,166.3 586.5,166.3 588.8,166.3 591.1,166.3 593.4,166.3 595.7,166.3 598,166.3 600.3,164.6 602.6,162.9 604.9,161.2 607.2,159.5 609.5,157.8 611.8,156.1 614.1,154.4 616.4,152.7 618.7,151 621,149.3 623.3,147.6 625.6,145.9 627.9,144.2 630.2,142.5 632.5,140.8 634.8,139.1 637.1,137.4 639.4,135.7 641.7,134 644,132.3 646.3,130.6 648.6,128.9 650.9,127.2 653.2,125.5 655.5,123.8 657.8,122.1 660.1,120.4 662.4,118.7 664.7,117 667,115.3 669.3,113.6 671.6,111.9 673.9,110.2 676.2,108.5 678.5,106.8 680.8,105.1 683.1,103.4 685.4,101.7 687.7,100 690,98.3" class="fx-line-thick"/><line x1="598" y1="154" x2="598" y2="162" class="fx-line"/><text x="594" y="150" text-anchor="end" class="fx-t-sm">K = 100</text><text x="704" y="188" text-anchor="end" class="fx-t-bad">worst case −$245</text><text x="597" y="248" text-anchor="middle" class="fx-t-sm">XYZ at expiry: 80 → 120</text><text x="16" y="84" class="fx-t-sm">dashed = shares only</text></svg>
<figcaption>Figure 1 · Kai's three wishes as three shapes (profit or loss per share at expiry; green = profit, red = loss; the dashed line is the shares alone). The put puts a floor under the loss, the sold call puts a ceiling on the gain in return for cash today, and the call alone gives the upside with a loss that can never exceed the premium.</figcaption>
</figure>

A call's value at expiry has a tidy formula. If XYZ finishes at \(S_T\) (the price at expiry) and the strike is \(K\), the call is worth whatever is left after paying the strike, or nothing if that would be negative:

$$
\text{call payoff at expiry} = \max(S_T - K,\ 0)
$$

With \(K = 100\): if XYZ ends at $110, the call is worth \(\max(110 - 100, 0) = 10\) a share, or \(10 \times 100 = \$1{,}000\) per contract; after the $245 premium Kai keeps \(\$1{,}000 - \$245 = \$755\). If XYZ ends at $90, the call is worth \(\max(90 - 100, 0) = 0\): Kai simply doesn't use it.

> [!THINK] Why would anyone sell Kai that $95 put for only $51?
> The seller promises to buy Kai's shares at $95 even if XYZ crashes to $60. Why take that deal?
> ---
> For the same reason an insurance company sells fire insurance: most months nothing bad happens and the seller keeps the $51. The seller is betting that $51 is enough to pay for the rare months when XYZ collapses. Whether $51 is the *right* price is the central question of the course's second tier — and the answer turns out to depend mostly on how much XYZ tends to move.

We'll take this front door in five parts:

- **① The definition, word by word**
- **② Kai's choices in dollars**
- **③ The four ideas that hold the course together**
- **④ Five tiers, seventeen stages: the map**
- **⑤ How to use a lesson**

::demo[welcome-ideas]

## @mechanics
### ① The definition, word by word

Every word in the one-sentence definition does a job:

| Word | Meaning | For XYZ |
|---|---|---|
| **Right, not obligation** | the buyer chooses; the seller must follow that choice | Kai may use the put, or not |
| **Call / put** | a call is the right to *buy*; a put is the right to *sell* | the 100 call; the 95 put |
| **Strike** \(K\) | the fixed price at which you may buy or sell | $95, $100, $105 |
| **Expiry** | the last day the right exists | 30 days from now |
| **Premium** | the price of the right, paid up front, never refunded | $0.51, $0.71, $2.45 a share |
| **Contract** | one option covers 100 shares | quoted $2.45 → pay $245 |

A put's payoff mirrors the call's. It pays when the price ends *below* the strike:

$$
\text{put payoff at expiry} = \max(K - S_T,\ 0)
$$

where \(K\) is the strike and \(S_T\) is the price at expiry, both per share. Multiply by 100 for one contract. [[put-option]] takes the put apart the way [[call-option]] does the call.

> [!EXAMPLE] Kai's put after bad earnings
> XYZ drops to $80. Kai's shares lost \((80 - 100) \times 100 = -\$2{,}000\). The 95 put pays \(\max(95 - 80, 0) \times 100 = \$1{,}500\). Net of the $51 premium: \(-2{,}000 + 1{,}500 - 51 = -\$551\). Had XYZ fallen to $50, the answer would be the same \(-\$551\): the put pays more exactly as the shares lose more.

The two sides of an option are not symmetric. The **buyer** pays the premium and gets a choice. The **seller** (also called the writer) collects the premium and takes on an obligation. That is why the seller of a call can lose far more than the premium collected, a point [[four-positions]] develops carefully.

### ② Kai's choices in dollars

Put the choices side by side at expiry, per 100 shares or one contract:

| Choice | Paid (−) or received (+) today | Worst case | Best case | Breakeven |
|---|---|---|---|---|
| Shares only | owns $10,000 of stock | −$10,000 (XYZ to zero) | unlimited | $100 |
| Shares + buy the 95 put | −$51 | **−$551** | unlimited | $100.51 |
| Shares + sell the 105 call | +$71 | −$9,929 | **+$571** | $99.29 |
| The 100 call, no shares | −$245 | **−$245** | unlimited | $102.45 |
| Collar: shares + put + sold call | +$20 | −$480 | +$520 | $99.80 |

Read the table as trades of one thing for another. The put trades $51 for a floor. The sold call trades gains above $105 for $71 today. The call trades a known $245 for most of the upside. The **collar** combines the first two: the call's $71 pays for the put's $51 and leaves a net \(71 - 51 = \$20\) credit, in exchange for a band of outcomes between −$480 and +$520. Nothing is free; every shape is paid for with something. The main demo below plots all of these against XYZ's final price.

> [!WARN] Education, not advice
> This course explains how options work, what they cost and how they can hurt you. It never tells you what to buy or sell. Options can lose value fast, a bought option can expire worthless, and some sold options can lose many times the premium collected. The XYZ numbers are for illustration only.

### ③ The four ideas that hold the course together

The old way to teach options is a long list of topics. This course follows **four ideas** instead, and every lesson says which one it builds:

| Idea | One sentence | First taste with XYZ |
|---|---|---|
| **① Shape** | An option is a shape: a floor under the loss, open upside. Every strategy is shapes added together. | the put floors Kai's loss at −$551 |
| **② No-arbitrage** | Anything you can build from stock and cash must cost what building it costs. | the 100 call minus the 100 put: \(2.45 - 2.12 = 0.33 = 100 - 99.67\) |
| **③ Volatility** | Options really trade *how much* a price will move. | a 30-day at-the-money call is worth about \(0.4 \times 100 \times 0.20 \times \sqrt{30/365} \approx 2.29\) at zero rates |
| **④ Risk** | The Greeks split risk into parts; who holds it and how leverage bites decide survival. | if nothing moves, the 100 call loses about \(0.044 \times 100 = \$4.36\) a day per contract |

Click through them in the widget at the end of the intuition section: each idea shows its first number and the stages that build it. Don't worry if the XYZ numbers look mysterious — each one gets a lesson.

### ④ Five tiers, seventeen stages: the map

<figure>
<svg data-fig="welcome-map" viewBox="0 0 722 368" role="img" aria-label="Course map: five tiers, seventeen stages"><defs><marker id="welcome-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs><rect x="6" y="10" width="158" height="62" rx="6" class="fx-box2"/><text x="16" y="36" class="fx-t-b">Tier 1 · Beginner</text><text x="16" y="55" class="fx-t-sm">Reading options</text><line x1="85" y1="72" x2="85" y2="82" class="fx-line" marker-end="url(#welcome-ah)"/><rect x="172" y="10" width="130" height="62" rx="6" class="fx-hl"/><text x="182" y="29" class="fx-t-sm">Stage 0 · ①</text><text x="182" y="52" class="fx-t">Why options exist</text><rect x="308" y="10" width="130" height="62" rx="6" class="fx-box"/><text x="318" y="29" class="fx-t-sm">Stage 1 · ①</text><text x="318" y="48" class="fx-t">Anatomy of</text><text x="318" y="64" class="fx-t">an option</text><rect x="444" y="10" width="130" height="62" rx="6" class="fx-box"/><text x="454" y="29" class="fx-t-sm">Stage 2 · ①</text><text x="454" y="52" class="fx-t">Payoff diagrams</text><rect x="580" y="10" width="130" height="62" rx="6" class="fx-box"/><text x="590" y="29" class="fx-t-sm">Stage 3</text><text x="590" y="48" class="fx-t">Markets &amp;</text><text x="590" y="64" class="fx-t">mechanics</text><rect x="6" y="82" width="158" height="62" rx="6" class="fx-box2"/><text x="16" y="108" class="fx-t-b">Tier 2 · Principles</text><text x="16" y="127" class="fx-t-sm">Pricing, vol &amp; Greeks</text><line x1="85" y1="144" x2="85" y2="154" class="fx-line" marker-end="url(#welcome-ah)"/><rect x="172" y="82" width="130" height="62" rx="6" class="fx-box"/><text x="182" y="101" class="fx-t-sm">Stage 4 · ②</text><text x="182" y="124" class="fx-t">No-arbitrage</text><rect x="308" y="82" width="130" height="62" rx="6" class="fx-box"/><text x="318" y="101" class="fx-t-sm">Stage 5 · ②</text><text x="318" y="120" class="fx-t">Binomial trees</text><text x="318" y="136" class="fx-t">to Black-Scholes</text><rect x="444" y="82" width="130" height="62" rx="6" class="fx-box"/><text x="454" y="101" class="fx-t-sm">Stage 6 · ③</text><text x="454" y="124" class="fx-t">Volatility</text><rect x="580" y="82" width="130" height="62" rx="6" class="fx-box"/><text x="590" y="101" class="fx-t-sm">Stage 7 · ④</text><text x="590" y="124" class="fx-t">The Greeks</text><rect x="6" y="154" width="158" height="62" rx="6" class="fx-box2"/><text x="16" y="180" class="fx-t-b">Tier 3 · Strategy</text><text x="16" y="199" class="fx-t-sm">Strategies &amp; risk</text><line x1="85" y1="216" x2="85" y2="226" class="fx-line" marker-end="url(#welcome-ah)"/><rect x="172" y="154" width="130" height="62" rx="6" class="fx-box"/><text x="182" y="173" class="fx-t-sm">Stage 8 · ①</text><text x="182" y="192" class="fx-t">Directional &amp;</text><text x="182" y="208" class="fx-t">income strategies</text><rect x="308" y="154" width="130" height="62" rx="6" class="fx-box"/><text x="318" y="173" class="fx-t-sm">Stage 9 · ①③</text><text x="318" y="192" class="fx-t">Volatility &amp; time</text><text x="318" y="208" class="fx-t">strategies</text><rect x="444" y="154" width="130" height="62" rx="6" class="fx-box"/><text x="454" y="173" class="fx-t-sm">Stage 10 · ③④</text><text x="454" y="192" class="fx-t">Running an</text><text x="454" y="208" class="fx-t">options book</text><rect x="6" y="226" width="158" height="62" rx="6" class="fx-box2"/><text x="16" y="252" class="fx-t-b">Tier 4 · Markets</text><text x="16" y="271" class="fx-t-sm">Structure &amp; perps</text><line x1="85" y1="288" x2="85" y2="298" class="fx-line" marker-end="url(#welcome-ah)"/><rect x="172" y="226" width="130" height="62" rx="6" class="fx-box"/><text x="182" y="245" class="fx-t-sm">Stage 11 · ④</text><text x="182" y="268" class="fx-t">Market structure</text><rect x="308" y="226" width="130" height="62" rx="6" class="fx-box"/><text x="318" y="245" class="fx-t-sm">Stage 12 · ④</text><text x="318" y="264" class="fx-t">Futures &amp;</text><text x="318" y="280" class="fx-t">perpetuals</text><rect x="6" y="298" width="158" height="62" rx="6" class="fx-box2"/><text x="16" y="324" class="fx-t-b">Tier 5 · Mastery</text><text x="16" y="343" class="fx-t-sm">Quant, AI &amp; practice</text><rect x="172" y="298" width="130" height="62" rx="6" class="fx-box"/><text x="182" y="317" class="fx-t-sm">Stage 13 · ②</text><text x="182" y="336" class="fx-t">Quantitative</text><text x="182" y="352" class="fx-t">pricing</text><rect x="308" y="298" width="130" height="62" rx="6" class="fx-box"/><text x="318" y="317" class="fx-t-sm">Stage 14 · ③</text><text x="318" y="336" class="fx-t">Quant trading</text><text x="318" y="352" class="fx-t">&amp; research</text><rect x="444" y="298" width="130" height="62" rx="6" class="fx-box"/><text x="454" y="317" class="fx-t-sm">Stage 15</text><text x="454" y="336" class="fx-t">Options in</text><text x="454" y="352" class="fx-t">the AI era</text><rect x="580" y="298" width="130" height="62" rx="6" class="fx-box"/><text x="590" y="317" class="fx-t-sm">Stage 16 · ①②③④</text><text x="590" y="340" class="fx-t">Hands-on</text><text x="590" y="181" class="fx-t-sm">blue card =</text><text x="590" y="200" class="fx-t-hl">you are here</text></svg>
<figcaption>Figure 2 · The course map. Five tiers go from reading an option to building and testing trades in code; the circled numbers show which of the four ideas each stage builds. Stage 16 (hands-on) uses all four in one complete trade.</figcaption>
</figure>

- **Tier 1 · Beginner (stages 0–3)**: what options are, how a contract is specified, payoff diagrams ([[payoff-diagrams]]), and how orders, exercise and margin work. Afterwards you can read any option trade.
- **Tier 2 · Principles (stages 4–7)**: why an option costs what it costs — no-arbitrage, binomial trees, [[black-scholes]], volatility and the Greeks ([[greeks-map]]).
- **Tier 3 · Strategy (stages 8–10)**: covered calls, protective puts, spreads, straddles, condors and how to run a book of them.
- **Tier 4 · Markets (stages 11–12)**: who is on the other side, 0DTE, crypto options, and the linear cousins: futures and perpetuals.
- **Tier 5 · Mastery (stages 13–16)**: numerical pricing, research, AI, and a full trade from idea to post-mortem in the [[capstone]].

> [!FACT] How big is this market?
> Options are no longer a niche. US listed options set a sixth straight annual record in 2025 with about 15 billion contracts traded (Cboe, as of January 2026), and through August 2026 the average was about 71 million contracts a day (OCC, as of September 2026).

### ⑤ How to use a lesson

Every lesson has the same parts, in the same order:

1. **The question and “Where we are”**: one line on what the lesson answers, then a box on where it sits in the story and which idea it builds.
2. **Intuition**: the picture, readable on its own. The switch at the top of a lesson (“Full lesson / Intuition only”) hides the heavier material on a first read.
3. **How it really works**: the precise version, with formulas worked in real numbers, figures and small inline widgets.
4. **Try it yourself**: the main demo — a sandbox that computes everything live.
5. **Analogy, common misconceptions, key takeaways, quick quiz**: the quiz explains every answer, right or wrong.

Coloured boxes mark the type of note: **Key idea**, **Worked example**, **Think first** (predict, then click to reveal the answer), **Watch out**, **History**, **State of play** (a current fact with its date), **Going deeper** (optional expert detail) and **Kai's trade** (the running story). Terms with a dotted underline show a definition on hover. On the roadmap page, pick a goal (newcomer, trader, investor or hedger, quant or developer) to highlight the lessons that matter most for you. Progress is saved only in your own browser.

## @analogy
An option is like a **non-refundable deposit that holds a price**. You pay a landlord $200 to hold an apartment at $1,500 a month until Friday. If a better place turns up, you walk away and lose the $200. If rents in the neighbourhood jump, your deposit locks in $1,500 while everyone else pays more.

Three pieces of the option are in the story: the fixed price (the strike), the deadline (the expiry), and the deposit you never get back (the premium). The deposit buys you *time to decide*, and the more uncertain the rental market, the more that time is worth — which is why an option's price depends so much on how much the price moves.

Where the analogy breaks: a deposit usually can't be resold, but an option trades on an exchange every second and its price changes with the stock. And the other side is rarely a landlord who needs a tenant; it is often a professional market maker who prices the risk and hedges it ([[market-makers]]).

## @misconceptions
- **“Options are just gambling.”** — An option is a tool. Kai's put is insurance that reduces risk; the same contract bought without owning shares is a bet. What matters is how it fits what you already hold.
- **“If I buy a call, I have to buy the stock at expiry.”** — A call is a right. If buying at the strike is a bad deal, you let the call expire and lose only the premium.
- **“The premium counts toward the price of the shares.”** — The premium is gone once paid. Exercising the 100 call still costs $100 a share on top of the $2.45 already spent, which is why the breakeven is $102.45.
- **“Selling options is free money because most expire worthless.”** — The seller's best case is the premium; the worst case can be many times larger. Kai's sold 105 call earns at most $71 but gives away every dollar above $105.
- **“One contract is one share.”** — A standard US stock option covers 100 shares. A quote of $2.45 costs \(2.45 \times 100 = \$245\) per contract.

## @takeaways
- An option is the right, but not the obligation, to buy (call) or sell (put) at a fixed strike until expiry, bought for a premium.
- The buyer holds a choice and can lose at most the premium; the seller collects the premium and carries the obligation.
- A call pays \(\max(S_T - K, 0)\) and a put pays \(\max(K - S_T, 0)\) per share at expiry; one contract is 100 shares.
- Kai's three wishes become three shapes: a floor (buy a put), a ceiling paid in cash (sell a call), and capped-loss upside (buy a call).
- The course follows four ideas — shape, no-arbitrage, volatility, risk — across five tiers and seventeen stages.

## @quiz
1. Which statement describes a call option?
   - [ ] An obligation to buy 100 shares at the strike on the expiry date
   - [x] The right, but not the obligation, to buy at the strike until expiry
   - [ ] The right to sell at the strike until expiry
   - [ ] A loan that lets you buy shares with borrowed money
   > A call is a right to buy. The obligation belongs to the seller. A right to sell is a put, and a loan is margin, not an option.
2. Kai buys the 30-day 100 call for $2.45 a share. XYZ ends at $108. What is Kai's profit on one contract?
   - [ ] $800
   - [ ] $245
   - [ ] $1,045
   - [x] $555
   > The call is worth \(\max(108 - 100, 0) = 8\) a share, or $800 per contract. Subtract the $245 premium: \(800 - 245 = \$555\). $800 forgets the premium; $1,045 adds it instead of subtracting.
3. Kai holds 100 shares and buys the 95 put for $51. XYZ falls to $70 after earnings. What is Kai's total result?
   - [x] −$551
   - [ ] −$3,051
   - [ ] −$3,000
   - [ ] −$51
   > Shares: \((70 - 100) \times 100 = -\$3{,}000\). The put pays \((95 - 70) \times 100 = \$2{,}500\). Net of the premium: \(-3{,}000 + 2{,}500 - 51 = -\$551\) — the floor. The put limits the loss; it doesn't erase the first $5 of the drop or its own cost.
4. Kai sells the 105 call on the 100 shares for $71. What does Kai give up in return?
   - [ ] Nothing — the $71 is free income
   - [ ] Protection against a fall in XYZ
   - [ ] The right to sell the shares at $105
   - [x] Any gain above $105 a share, because the buyer can call the shares away at $105
   > Selling the call is an obligation to deliver the shares at $105 if asked. Kai keeps the $71 either way, but every dollar above $105 goes to the buyer. It gives no protection against a fall beyond the $71 cushion.
5. Which of the course's four ideas says that an option is a floor under the loss with open upside?
   - [ ] ② No-arbitrage
   - [ ] ③ Volatility
   - [x] ① Shape
   - [ ] ④ Risk
   > Idea ① is the shape — capped loss, open upside — that every strategy is built from. No-arbitrage explains prices, volatility explains what options really trade, and risk is about measuring and surviving exposure.

## @further
- [Characteristics and Risks of Standardized Options (OCC)](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the official disclosure document every US broker must give you before you trade options.
- [Options Industry Council](https://www.optionseducation.org/) — free, non-commercial education from the industry body, from first definitions onward.
- [Option (finance) — Wikipedia](https://en.wikipedia.org/wiki/Option_%28finance%29) — a compact overview of types, history and terms.
- [New Finance Path](https://evidex-cloud.github.io/droplet-labs-finance-path/) — the sister course, if you want the wider map of money, markets and crypto first.

## @next
Options belong to a bigger family: contracts whose value is written on another price. What do forwards, futures, swaps and perps have in common with options, and what is the one thing only options have?
