---
id: why-options
prereqs: welcome, derivatives
demo: why-options
---

# Why People Use Options: Insurance, Leverage, Income & Optionality

## @hook
A forward costs nothing to enter, so why would anyone *pay* for an option? Because a right can do four things an obligation can't: **insure** what you own, **lever** a small stake onto a big position, pay **income** to whoever sells it, and buy cheap exposure to an uncertain **upside**. Each use has a price, and someone takes the other side for a reason.

## @bridge
[[derivatives]] split the family into obligations (forwards, futures, swaps, perps) and rights (options). This lesson asks what the rights are *for*, using Kai's three wishes from [[welcome]] and one more. It builds Idea ① — each use is a different shape — and Idea ④ — every shape moves risk to someone, and you should know who and at what cost. The next lesson, [[linear-vs-convex]], explains why all four uses come from the same bend.

## @intuition
Kai still owns 100 XYZ at $100, earnings are three weeks away, and the standard 30-day options are on the screen. Each of the four uses answers a different question.

> [!KAI] Four questions, four uses
> - **Insurance**: “How do I keep a bad earnings day from costing me thousands?” → buy the 95 put for $51.
> - **Leverage**: “How do I get the upside of $10,000 of stock without risking $10,000?” → buy the 100 call for $245.
> - **Income**: “Can my shares pay me while I wait?” → sell the 105 call for $71.
> - **Optionality**: “How do I pay a small, known amount for a large, uncertain upside?” → any bought option, and many rights hidden in ordinary contracts.

The first three are the buy and sell sides of the same few contracts. Arrange them by *who pays* and *what for*, and a 2×2 grid appears:

<figure>
<svg data-fig="why-2x2" viewBox="0 0 722 302" role="img" aria-label="Buy or sell × protect or take a view"><text x="262" y="24" text-anchor="middle" class="fx-t-b">Around shares you own</text><text x="570" y="24" text-anchor="middle" class="fx-t-b">A view without owning</text><rect x="6" y="36" width="100" height="126" rx="6" class="fx-box2"/><text x="56" y="94" text-anchor="middle" class="fx-t-b">BUY</text><text x="56" y="112" text-anchor="middle" class="fx-t-sm">pay premium</text><rect x="6" y="170" width="100" height="126" rx="6" class="fx-box2"/><text x="56" y="228" text-anchor="middle" class="fx-t-b">SELL</text><text x="56" y="246" text-anchor="middle" class="fx-t-sm">collect premium</text><rect x="112" y="36" width="300" height="126" rx="6" class="fx-box"/><text x="124" y="60" class="fx-t-b">Protective put (insurance)</text><text x="124" y="86" class="fx-t-sm">Kai buys the 95 put: pays $51</text><text x="124" y="106" class="fx-t-sm">Worst case: −$551</text><text x="124" y="126" class="fx-t-sm">Buys: a floor under the shares</text><polygon points="308,120 308,120 309.2,120 310.3,120 311.5,120 312.6,120 313.8,120 314.9,120 316.1,120 317.2,120 318.4,120 319.5,120 320.7,120 321.8,120 323,120 324.1,120 325.3,120 326.4,120 327.6,120 328.7,120 329.9,120 331,120 332.2,120 333.3,120 334.5,120 335.6,120 336.8,120 337.9,120 339.1,120 340.2,120 341.4,120 342.5,120 343.7,120 344.8,120 346,120 347.1,120 348.3,120 349.4,120 350.6,120 351.7,120 352.9,120 354,120 355.2,120 356.3,119.2 357.5,118.4 358.6,117.6 359.8,116.8 360.9,116 362.1,115.2 363.2,114.4 364.4,113.6 365.5,112.8 366.7,112 367.8,111.2 369,110.4 370.1,109.6 371.3,108.8 372.4,108 373.6,107.2 374.7,106.4 375.9,105.6 377,104.8 378.2,104 379.3,103.2 380.5,102.4 381.6,101.6 382.8,100.8 383.9,100 385.1,99.2 386.2,98.4 387.4,97.6 388.5,96.8 389.7,96 390.8,95.2 392,94.4 393.1,93.6 394.3,92.8 395.4,92 396.6,91.2 397.7,90.4 398.9,89.6 400,88.8 400,120" class="fx-area-ok"/><polygon points="308,120 308,128.8 309.2,128.8 310.3,128.8 311.5,128.8 312.6,128.8 313.8,128.8 314.9,128.8 316.1,128.8 317.2,128.8 318.4,128.8 319.5,128.8 320.7,128.8 321.8,128.8 323,128.8 324.1,128.8 325.3,128.8 326.4,128.8 327.6,128.8 328.7,128.8 329.9,128.8 331,128.8 332.2,128.8 333.3,128.8 334.5,128.8 335.6,128.8 336.8,128.8 337.9,128.8 339.1,128.8 340.2,128.8 341.4,128.8 342.5,128.8 343.7,128 344.8,127.2 346,126.4 347.1,125.6 348.3,124.8 349.4,124 350.6,123.2 351.7,122.4 352.9,121.6 354,120.8 355.2,120 356.3,120 357.5,120 358.6,120 359.8,120 360.9,120 362.1,120 363.2,120 364.4,120 365.5,120 366.7,120 367.8,120 369,120 370.1,120 371.3,120 372.4,120 373.6,120 374.7,120 375.9,120 377,120 378.2,120 379.3,120 380.5,120 381.6,120 382.8,120 383.9,120 385.1,120 386.2,120 387.4,120 388.5,120 389.7,120 390.8,120 392,120 393.1,120 394.3,120 395.4,120 396.6,120 397.7,120 398.9,120 400,120 400,120" class="fx-area-bad"/><line x1="308" y1="120" x2="400" y2="120" class="fx-axis"/><polyline points="308,128.8 309.2,128.8 310.3,128.8 311.5,128.8 312.6,128.8 313.8,128.8 314.9,128.8 316.1,128.8 317.2,128.8 318.4,128.8 319.5,128.8 320.7,128.8 321.8,128.8 323,128.8 324.1,128.8 325.3,128.8 326.4,128.8 327.6,128.8 328.7,128.8 329.9,128.8 331,128.8 332.2,128.8 333.3,128.8 334.5,128.8 335.6,128.8 336.8,128.8 337.9,128.8 339.1,128.8 340.2,128.8 341.4,128.8 342.5,128.8 343.7,128 344.8,127.2 346,126.4 347.1,125.6 348.3,124.8 349.4,124 350.6,123.2 351.7,122.4 352.9,121.6 354,120.8 355.2,120 356.3,119.2 357.5,118.4 358.6,117.6 359.8,116.8 360.9,116 362.1,115.2 363.2,114.4 364.4,113.6 365.5,112.8 366.7,112 367.8,111.2 369,110.4 370.1,109.6 371.3,108.8 372.4,108 373.6,107.2 374.7,106.4 375.9,105.6 377,104.8 378.2,104 379.3,103.2 380.5,102.4 381.6,101.6 382.8,100.8 383.9,100 385.1,99.2 386.2,98.4 387.4,97.6 388.5,96.8 389.7,96 390.8,95.2 392,94.4 393.1,93.6 394.3,92.8 395.4,92 396.6,91.2 397.7,90.4 398.9,89.6 400,88.8" class="fx-line-thick"/><rect x="418" y="36" width="300" height="126" rx="6" class="fx-box"/><text x="430" y="60" class="fx-t-b">Long call (leverage)</text><text x="430" y="86" class="fx-t-sm">Buy the 100 call: pay $245</text><text x="430" y="106" class="fx-t-sm">Worst case: −$245</text><text x="430" y="126" class="fx-t-sm">Buys: most of the upside</text><polygon points="614,120 614,120 615.2,120 616.3,120 617.5,120 618.6,120 619.8,120 620.9,120 622.1,120 623.2,120 624.4,120 625.5,120 626.7,120 627.8,120 629,120 630.1,120 631.3,120 632.4,120 633.6,120 634.7,120 635.9,120 637,120 638.2,120 639.3,120 640.5,120 641.6,120 642.8,120 643.9,120 645.1,120 646.2,120 647.4,120 648.5,120 649.7,120 650.8,120 652,120 653.1,120 654.3,120 655.4,120 656.6,120 657.7,120 658.9,120 660,120 661.2,120 662.3,120 663.5,120 664.6,120 665.8,119.9 666.9,119.1 668.1,118.3 669.2,117.5 670.4,116.7 671.5,115.9 672.7,115.1 673.8,114.3 675,113.5 676.1,112.7 677.3,111.9 678.4,111.1 679.6,110.3 680.7,109.5 681.9,108.7 683,107.9 684.2,107.1 685.3,106.3 686.5,105.5 687.6,104.7 688.8,103.9 689.9,103.1 691.1,102.3 692.2,101.5 693.4,100.7 694.5,99.9 695.7,99.1 696.8,98.3 698,97.5 699.1,96.7 700.3,95.9 701.4,95.1 702.6,94.3 703.7,93.5 704.9,92.7 706,91.9 706,120" class="fx-area-ok"/><polygon points="614,120 614,123.9 615.2,123.9 616.3,123.9 617.5,123.9 618.6,123.9 619.8,123.9 620.9,123.9 622.1,123.9 623.2,123.9 624.4,123.9 625.5,123.9 626.7,123.9 627.8,123.9 629,123.9 630.1,123.9 631.3,123.9 632.4,123.9 633.6,123.9 634.7,123.9 635.9,123.9 637,123.9 638.2,123.9 639.3,123.9 640.5,123.9 641.6,123.9 642.8,123.9 643.9,123.9 645.1,123.9 646.2,123.9 647.4,123.9 648.5,123.9 649.7,123.9 650.8,123.9 652,123.9 653.1,123.9 654.3,123.9 655.4,123.9 656.6,123.9 657.7,123.9 658.9,123.9 660,123.9 661.2,123.1 662.3,122.3 663.5,121.5 664.6,120.7 665.8,120 666.9,120 668.1,120 669.2,120 670.4,120 671.5,120 672.7,120 673.8,120 675,120 676.1,120 677.3,120 678.4,120 679.6,120 680.7,120 681.9,120 683,120 684.2,120 685.3,120 686.5,120 687.6,120 688.8,120 689.9,120 691.1,120 692.2,120 693.4,120 694.5,120 695.7,120 696.8,120 698,120 699.1,120 700.3,120 701.4,120 702.6,120 703.7,120 704.9,120 706,120 706,120" class="fx-area-bad"/><line x1="614" y1="120" x2="706" y2="120" class="fx-axis"/><polyline points="614,123.9 615.2,123.9 616.3,123.9 617.5,123.9 618.6,123.9 619.8,123.9 620.9,123.9 622.1,123.9 623.2,123.9 624.4,123.9 625.5,123.9 626.7,123.9 627.8,123.9 629,123.9 630.1,123.9 631.3,123.9 632.4,123.9 633.6,123.9 634.7,123.9 635.9,123.9 637,123.9 638.2,123.9 639.3,123.9 640.5,123.9 641.6,123.9 642.8,123.9 643.9,123.9 645.1,123.9 646.2,123.9 647.4,123.9 648.5,123.9 649.7,123.9 650.8,123.9 652,123.9 653.1,123.9 654.3,123.9 655.4,123.9 656.6,123.9 657.7,123.9 658.9,123.9 660,123.9 661.2,123.1 662.3,122.3 663.5,121.5 664.6,120.7 665.8,119.9 666.9,119.1 668.1,118.3 669.2,117.5 670.4,116.7 671.5,115.9 672.7,115.1 673.8,114.3 675,113.5 676.1,112.7 677.3,111.9 678.4,111.1 679.6,110.3 680.7,109.5 681.9,108.7 683,107.9 684.2,107.1 685.3,106.3 686.5,105.5 687.6,104.7 688.8,103.9 689.9,103.1 691.1,102.3 692.2,101.5 693.4,100.7 694.5,99.9 695.7,99.1 696.8,98.3 698,97.5 699.1,96.7 700.3,95.9 701.4,95.1 702.6,94.3 703.7,93.5 704.9,92.7 706,91.9" class="fx-line-thick"/><rect x="112" y="170" width="300" height="126" rx="6" class="fx-box"/><text x="124" y="194" class="fx-t-b">Covered call (income)</text><text x="124" y="220" class="fx-t-sm">Kai sells the 105 call: gets $71</text><text x="124" y="240" class="fx-t-sm">Gives up: gains above $105</text><text x="124" y="260" class="fx-t-sm">Still owns the downside</text><polygon points="308,254 308,254 309.2,254 310.3,254 311.5,254 312.6,254 313.8,254 314.9,254 316.1,254 317.2,254 318.4,254 319.5,254 320.7,254 321.8,254 323,254 324.1,254 325.3,254 326.4,254 327.6,254 328.7,254 329.9,254 331,254 332.2,254 333.3,254 334.5,254 335.6,254 336.8,254 337.9,254 339.1,254 340.2,254 341.4,254 342.5,254 343.7,254 344.8,254 346,254 347.1,254 348.3,254 349.4,254 350.6,254 351.7,254 352.9,253.7 354,252.9 355.2,252.1 356.3,251.3 357.5,250.5 358.6,249.7 359.8,248.9 360.9,248.1 362.1,247.3 363.2,246.5 364.4,245.7 365.5,244.9 366.7,244.9 367.8,244.9 369,244.9 370.1,244.9 371.3,244.9 372.4,244.9 373.6,244.9 374.7,244.9 375.9,244.9 377,244.9 378.2,244.9 379.3,244.9 380.5,244.9 381.6,244.9 382.8,244.9 383.9,244.9 385.1,244.9 386.2,244.9 387.4,244.9 388.5,244.9 389.7,244.9 390.8,244.9 392,244.9 393.1,244.9 394.3,244.9 395.4,244.9 396.6,244.9 397.7,244.9 398.9,244.9 400,244.9 400,254" class="fx-area-ok"/><polygon points="308,254 308,284.9 309.2,284.1 310.3,283.3 311.5,282.5 312.6,281.7 313.8,280.9 314.9,280.1 316.1,279.3 317.2,278.5 318.4,277.7 319.5,276.9 320.7,276.1 321.8,275.3 323,274.5 324.1,273.7 325.3,272.9 326.4,272.1 327.6,271.3 328.7,270.5 329.9,269.7 331,268.9 332.2,268.1 333.3,267.3 334.5,266.5 335.6,265.7 336.8,264.9 337.9,264.1 339.1,263.3 340.2,262.5 341.4,261.7 342.5,260.9 343.7,260.1 344.8,259.3 346,258.5 347.1,257.7 348.3,256.9 349.4,256.1 350.6,255.3 351.7,254.5 352.9,254 354,254 355.2,254 356.3,254 357.5,254 358.6,254 359.8,254 360.9,254 362.1,254 363.2,254 364.4,254 365.5,254 366.7,254 367.8,254 369,254 370.1,254 371.3,254 372.4,254 373.6,254 374.7,254 375.9,254 377,254 378.2,254 379.3,254 380.5,254 381.6,254 382.8,254 383.9,254 385.1,254 386.2,254 387.4,254 388.5,254 389.7,254 390.8,254 392,254 393.1,254 394.3,254 395.4,254 396.6,254 397.7,254 398.9,254 400,254 400,254" class="fx-area-bad"/><line x1="308" y1="254" x2="400" y2="254" class="fx-axis"/><polyline points="308,284.9 309.2,284.1 310.3,283.3 311.5,282.5 312.6,281.7 313.8,280.9 314.9,280.1 316.1,279.3 317.2,278.5 318.4,277.7 319.5,276.9 320.7,276.1 321.8,275.3 323,274.5 324.1,273.7 325.3,272.9 326.4,272.1 327.6,271.3 328.7,270.5 329.9,269.7 331,268.9 332.2,268.1 333.3,267.3 334.5,266.5 335.6,265.7 336.8,264.9 337.9,264.1 339.1,263.3 340.2,262.5 341.4,261.7 342.5,260.9 343.7,260.1 344.8,259.3 346,258.5 347.1,257.7 348.3,256.9 349.4,256.1 350.6,255.3 351.7,254.5 352.9,253.7 354,252.9 355.2,252.1 356.3,251.3 357.5,250.5 358.6,249.7 359.8,248.9 360.9,248.1 362.1,247.3 363.2,246.5 364.4,245.7 365.5,244.9 366.7,244.9 367.8,244.9 369,244.9 370.1,244.9 371.3,244.9 372.4,244.9 373.6,244.9 374.7,244.9 375.9,244.9 377,244.9 378.2,244.9 379.3,244.9 380.5,244.9 381.6,244.9 382.8,244.9 383.9,244.9 385.1,244.9 386.2,244.9 387.4,244.9 388.5,244.9 389.7,244.9 390.8,244.9 392,244.9 393.1,244.9 394.3,244.9 395.4,244.9 396.6,244.9 397.7,244.9 398.9,244.9 400,244.9" class="fx-line-thick"/><rect x="418" y="170" width="300" height="126" rx="6" class="fx-box"/><text x="430" y="194" class="fx-t-b">Short put (paid to wait)</text><text x="430" y="220" class="fx-t-sm">Sell the 95 put: get $51</text><text x="430" y="240" class="fx-t-sm">Best case: +$51</text><text x="430" y="260" class="fx-t-sm">Risk: must buy at $95 if it falls</text><polygon points="614,254 614,254 615.2,254 616.3,254 617.5,254 618.6,254 619.8,254 620.9,254 622.1,254 623.2,254 624.4,254 625.5,254 626.7,254 627.8,254 629,254 630.1,254 631.3,254 632.4,254 633.6,254 634.7,254 635.9,254 637,254 638.2,254 639.3,254 640.5,254 641.6,254 642.8,254 643.9,254 645.1,254 646.2,254 647.4,254 648.5,253.2 649.7,253.2 650.8,253.2 652,253.2 653.1,253.2 654.3,253.2 655.4,253.2 656.6,253.2 657.7,253.2 658.9,253.2 660,253.2 661.2,253.2 662.3,253.2 663.5,253.2 664.6,253.2 665.8,253.2 666.9,253.2 668.1,253.2 669.2,253.2 670.4,253.2 671.5,253.2 672.7,253.2 673.8,253.2 675,253.2 676.1,253.2 677.3,253.2 678.4,253.2 679.6,253.2 680.7,253.2 681.9,253.2 683,253.2 684.2,253.2 685.3,253.2 686.5,253.2 687.6,253.2 688.8,253.2 689.9,253.2 691.1,253.2 692.2,253.2 693.4,253.2 694.5,253.2 695.7,253.2 696.8,253.2 698,253.2 699.1,253.2 700.3,253.2 701.4,253.2 702.6,253.2 703.7,253.2 704.9,253.2 706,253.2 706,254" class="fx-area-ok"/><polygon points="614,254 614,277.2 615.2,276.4 616.3,275.6 617.5,274.8 618.6,274 619.8,273.2 620.9,272.4 622.1,271.6 623.2,270.8 624.4,270 625.5,269.2 626.7,268.4 627.8,267.6 629,266.8 630.1,266 631.3,265.2 632.4,264.4 633.6,263.6 634.7,262.8 635.9,262 637,261.2 638.2,260.4 639.3,259.6 640.5,258.8 641.6,258 642.8,257.2 643.9,256.4 645.1,255.6 646.2,254.8 647.4,254 648.5,254 649.7,254 650.8,254 652,254 653.1,254 654.3,254 655.4,254 656.6,254 657.7,254 658.9,254 660,254 661.2,254 662.3,254 663.5,254 664.6,254 665.8,254 666.9,254 668.1,254 669.2,254 670.4,254 671.5,254 672.7,254 673.8,254 675,254 676.1,254 677.3,254 678.4,254 679.6,254 680.7,254 681.9,254 683,254 684.2,254 685.3,254 686.5,254 687.6,254 688.8,254 689.9,254 691.1,254 692.2,254 693.4,254 694.5,254 695.7,254 696.8,254 698,254 699.1,254 700.3,254 701.4,254 702.6,254 703.7,254 704.9,254 706,254 706,254" class="fx-area-bad"/><line x1="614" y1="254" x2="706" y2="254" class="fx-axis"/><polyline points="614,277.2 615.2,276.4 616.3,275.6 617.5,274.8 618.6,274 619.8,273.2 620.9,272.4 622.1,271.6 623.2,270.8 624.4,270 625.5,269.2 626.7,268.4 627.8,267.6 629,266.8 630.1,266 631.3,265.2 632.4,264.4 633.6,263.6 634.7,262.8 635.9,262 637,261.2 638.2,260.4 639.3,259.6 640.5,258.8 641.6,258 642.8,257.2 643.9,256.4 645.1,255.6 646.2,254.8 647.4,254 648.5,253.2 649.7,253.2 650.8,253.2 652,253.2 653.1,253.2 654.3,253.2 655.4,253.2 656.6,253.2 657.7,253.2 658.9,253.2 660,253.2 661.2,253.2 662.3,253.2 663.5,253.2 664.6,253.2 665.8,253.2 666.9,253.2 668.1,253.2 669.2,253.2 670.4,253.2 671.5,253.2 672.7,253.2 673.8,253.2 675,253.2 676.1,253.2 677.3,253.2 678.4,253.2 679.6,253.2 680.7,253.2 681.9,253.2 683,253.2 684.2,253.2 685.3,253.2 686.5,253.2 687.6,253.2 688.8,253.2 689.9,253.2 691.1,253.2 692.2,253.2 693.4,253.2 694.5,253.2 695.7,253.2 696.8,253.2 698,253.2 699.1,253.2 700.3,253.2 701.4,253.2 702.6,253.2 703.7,253.2 704.9,253.2 706,253.2" class="fx-line-thick"/></svg>
<figcaption>Figure 1 · Buy or sell, around shares you own or as a stand-alone view (P&L per share at expiry, XYZ from 80 to 120). Buyers pay a premium and get a bent shape with a capped loss; sellers collect the premium and take the opposite shape. The short put in the bottom right is the insurer's side of Kai's protection.</figcaption>
</figure>

Look at the insurance cell first. For $51, Kai caps the loss on $10,000 of stock at $551, however bad earnings are. If XYZ drops 15% to $85, the shares lose $1,500 and the put pays $1,000, so Kai loses $551 instead of $1,500. If XYZ rises instead, the put expires worthless and the $51 is simply spent — just like a year without a car accident.

Now the leverage cell. If XYZ rises 10% to $110, the shares make \((110 - 100) \times 100 = \$1{,}000\), a 10% return on $10,000. The 100 call is worth \(110 - 100 = 10\) a share, $1,000 per contract, so Kai makes \(1{,}000 - 245 = \$755\) on $245: about **+308%**. But if XYZ merely stays at $100, the shares make nothing and the call loses **100%** of its premium.

> [!THINK] The call made +308% while the shares made +10%. Is the call the better investment?
> Before you open this, ask what happens at +2%, at 0%, and at −10%.
> ---
> Not necessarily. At +2% the call still loses money (its breakeven is $102.45), and at 0% or −10% it loses everything, while the shares lose 0% or 10%. Leverage multiplies percentages in both directions. Which one is “better” depends on how likely each outcome is and on whether the $2.45 was a fair price for that distribution — the question behind [[probability-ev]] and the whole second tier of the course.

The income cell is the insurance cell seen from the other side: someone collects premium in exchange for carrying a risk. And optionality is the common thread: in every bought option you pay a small, known amount for the right to an uncertain gain.

We'll take the four uses, then the other side, in five parts:

- **① Insurance**: the protective put and what it really costs
- **② Leverage**: calls versus shares, and calls plus cash
- **③ Income**: selling premium, and what the seller is paid for
- **④ Optionality**: rights hidden in bonds, pay packages and projects
- **⑤ Who takes the other side, and what options cost you**

## @mechanics
### ① Insurance: the protective put

A **protective put** is shares plus a bought put. Its worst case is fixed the moment you buy it:

$$
\Pi_{\min} = (K - S_0 - p) \times 100
$$

where \(K\) is the put's strike, \(S_0\) the price you paid for the shares and \(p\) the put's premium per share. For Kai, \((95 - 100 - 0.51) \times 100 = -\$551\). The gap \(S_0 - K = \$5\) is the **deductible**: the first $5 of any fall is Kai's to bear; the premium is the price of the policy.

Cheaper policies have bigger deductibles. Here are the three strikes Kai could choose, priced with the course engine (XYZ \(S = 100\), \(\sigma = 20\%\), \(r = 4\%\), 30 days):

| Put | Premium (1 contract) | Cost as % of $10,000 | Deductible | Worst case |
|---|---|---|---|---|
| 90 put | $6 | 0.06% | $10 a share | −$1,006 |
| 95 put | $51 | 0.51% | $5 a share | −$551 |
| 100 put | $212 | 2.12% | none | −$212 |

> [!EXAMPLE] Kai's 95 put in a −15% earnings drop
> XYZ falls to $85. Shares: \((85 - 100) \times 100 = -\$1{,}500\). Put: \((95 - 85) \times 100 = +\$1{,}000\). Premium: −$51. Total: \(-1{,}500 + 1{,}000 - 51 = -\$551\). The put saved \(1{,}000 - 51 = \$949\) compared with no insurance. If XYZ had risen to $110 instead, Kai would make \(1{,}000 - 51 = \$949\) rather than $1,000: the premium is the cost of sleeping well.

::demo[why-options-insurance]

Insurance has a running cost. The 95 put costs 0.51% of the position for 30 days. Bought month after month at similar prices, that is roughly \(0.51\% \times 365/30 \approx 6.2\%\) a year — a large drag against a stock's typical return. That is why investors rarely insure everything all the time; they insure specific risks, such as an earnings date, or use cheaper structures like the collar from [[welcome]]. [[protective-put-collar]] and [[tail-hedging]] weigh these trade-offs carefully.

### ② Leverage: calls versus shares

Leverage compares returns on the money actually put in. For a bought call and for shares:

$$
R_{\text{call}} = \frac{\max(S_T - K,\,0) - c}{c}, \qquad R_{\text{stock}} = \frac{S_T - S_0}{S_0}
$$

where \(c\) is the call's premium, \(S_T\) the price at expiry and \(S_0\) today's price. For the 30-day 100 call, \(c = 2.45\):

| XYZ in 30 days | $100 → | Shares | 100 call |
|---|---|---|---|
| −10% | $90 | −10% | −100% |
| 0% | $100 | 0% | −100% |
| +2.45% | $102.45 | +2.45% | 0% (breakeven) |
| +5% | $105 | +5% | +104% |
| +10% | $110 | +10% | +308% |
| +20% | $120 | +20% | +716% |

<figure>
<svg data-fig="why-leverage" viewBox="0 0 660 258" role="img" aria-label="Return on money in: shares vs one call"><line x1="70" y1="214" x2="630" y2="214" class="fx-grid"/><text x="62" y="218" text-anchor="end" class="fx-t-sm">−100%</text><line x1="70" y1="170" x2="630" y2="170" class="fx-grid"/><text x="62" y="174" text-anchor="end" class="fx-t-sm">0%</text><line x1="70" y1="126" x2="630" y2="126" class="fx-grid"/><text x="62" y="130" text-anchor="end" class="fx-t-sm">+100%</text><line x1="70" y1="82" x2="630" y2="82" class="fx-grid"/><text x="62" y="86" text-anchor="end" class="fx-t-sm">+200%</text><line x1="70" y1="38" x2="630" y2="38" class="fx-grid"/><text x="62" y="42" text-anchor="end" class="fx-t-sm">+300%</text><line x1="70" y1="170" x2="630" y2="170" class="fx-axis"/><rect x="94" y="170" width="42" height="4.4" class="fx-fill-muted"/><rect x="144" y="170" width="42" height="44" class="fx-fill-red"/><text x="115" y="188.4" text-anchor="middle" class="fx-t-sm">−10%</text><text x="165" y="188" text-anchor="middle" style="font-size:11px" class="fx-t-inv">−100%</text><text x="140" y="246" text-anchor="middle" class="fx-t-b">XYZ −10%</text><rect x="234" y="170" width="42" height="1.5" class="fx-fill-muted"/><rect x="284" y="170" width="42" height="44" class="fx-fill-red"/><text x="255" y="164" text-anchor="middle" class="fx-t-sm">0%</text><text x="305" y="188" text-anchor="middle" style="font-size:11px" class="fx-t-inv">−100%</text><text x="280" y="246" text-anchor="middle" class="fx-t-b">XYZ 0%</text><rect x="374" y="167.8" width="42" height="2.2" class="fx-fill-muted"/><rect x="424" y="124.2" width="42" height="45.8" class="fx-fill-green"/><text x="395" y="161.8" text-anchor="middle" class="fx-t-sm">+5%</text><text x="445" y="118.2" text-anchor="middle" class="fx-t-sm">+104%</text><text x="420" y="246" text-anchor="middle" class="fx-t-b">XYZ +5%</text><rect x="514" y="165.6" width="42" height="4.4" class="fx-fill-muted"/><rect x="564" y="34.4" width="42" height="135.6" class="fx-fill-green"/><text x="535" y="159.6" text-anchor="middle" class="fx-t-sm">+10%</text><text x="585" y="28.4" text-anchor="middle" class="fx-t-sm">+308%</text><text x="560" y="246" text-anchor="middle" class="fx-t-b">XYZ +10%</text><rect x="84" y="20" width="12" height="12" class="fx-fill-muted"/><text x="102" y="31" class="fx-t-sm">100 shares ($10,000 in)</text><rect x="84" y="40" width="12" height="12" class="fx-fill-green"/><text x="102" y="51" class="fx-t-sm">one 100 call ($245 in)</text></svg>
<figcaption>Figure 2 · Return on the money put in, for 100 shares ($10,000) and for one 100 call ($245). The call's returns are huge when XYZ rallies and a total loss when it doesn't; below the $102.45 breakeven the call loses money even though XYZ went up.</figcaption>
</figure>

There are two quite different ways to use this leverage:

1. **Same money, more exposure**: spend $245 on a call instead of 2.45 shares. This is the lottery-ticket use, and the table above shows its shape.
2. **Same exposure, less money at risk**: buy one call instead of 100 shares and keep the other $9,755 in cash. This is **stock replacement**, and it looks far less like a bet.

> [!EXAMPLE] One call plus cash versus 100 shares
> Kai sells the shares, buys the 100 call for $245 and puts the remaining $9,755 in a 4% account: 30 days of interest is \(9{,}755 \times (e^{0.04 \times 30/365} - 1) \approx \$32\). At expiry:
> - XYZ at $80: shares lose $2,000; call plus cash: \(-245 + 32 = -\$213\).
> - XYZ at $110: shares make $1,000; call plus cash: \(755 + 32 = +\$787\).
>
> Now compare **shares plus the 100 put** (cost $212): at $80 it loses $212, at $110 it makes \(1{,}000 - 212 = \$788\). The two positions match to within rounding. That is no coincidence — it is **put-call parity**, the first result of Idea ② ([[put-call-parity]]).

So a call is not only a way to gamble. Held with cash, it *is* a protected stock position, bought in a different wrapper. [[long-options]] shows how to choose strike and expiry for a directional view.

### ③ Income: selling premium

Every option bought is an option sold. The seller collects the premium today and takes on the obligation. Two common income trades use Kai's numbers:

- **Covered call**: own the shares, sell the 105 call for $0.71. Best case \((K - S_0) + c = (105 - 100) + 0.71 = 5.71\) a share, or $571. Below that, Kai still owns all the downside, cushioned by $71. See [[covered-call]].
- **Cash-secured put**: hold \(95 \times 100 = \$9{,}500\) in cash and sell the 95 put for $0.51. If XYZ stays above $95, keep $51. If it falls below, buy 100 shares at $95, an effective price of \(95 - 0.51 = \$94.49\). See [[cash-secured-put]].

Why would premium sellers expect to be paid over time? For the same reason insurers do: buyers pay extra to get rid of risk. For the US stock index this shows up as implied volatility (the volatility priced into options) sitting above the volatility that actually follows.

> [!FACT] Do option sellers get paid on average?
> From 1990 to about 2024, the VIX (the S&P 500's 30-day implied volatility) averaged about 19.6%, while the S&P 500's subsequent 30-day realised volatility averaged about 15.5% — a gap of roughly 4 volatility points (CFA Institute Enterprising Investor, July 2024). The gap turns sharply negative in crashes, which is exactly when sellers take their largest losses. [[variance-risk-premium]] studies it.

> [!WARN] Income is a payment for risk, not a gift
> A sold option has a small, capped gain and a large loss that arrives rarely and suddenly. Kai's sold 105 call earns at most $71 but gives away every dollar above $105; a call sold *without* the shares can lose without limit. High win rates and rare large losses are the signature of selling premium — size such trades so the rare loss is survivable.

### ④ Optionality: rights hidden everywhere

Options aren't only the contracts on an exchange screen. Many ordinary contracts contain a right, and recognising it tells you how to value it:

- **Convertible bonds**: a bond plus the right to convert it into shares. Investors accept a lower interest rate in exchange for that embedded call.
- **Employee stock options**: a company pays staff partly with calls on its own shares, often with several years to expiry.
- **Mortgage prepayment**: in many countries a borrower may repay a fixed-rate loan early. When rates fall, they refinance — the borrower owns a call on the loan, and the lender charges for it in the rate.
- **Real options**: a firm's right to expand a successful project or abandon a failing one. Thales reserving the olive presses ([[derivatives]]) was buying one.

The pattern is the same every time: pay a small, known price for a capped downside and an open upside. And the value of that right grows with **uncertainty** — the more the outcome can swing, the more a right to pick the good side is worth. That sentence is the seed of Idea ③, and [[linear-vs-convex]] makes it precise.

### ⑤ Who takes the other side, and what options cost you

The other side of Kai's put is an **insurer**: someone who collects premium and expects, over many policies, to pay out less than they collect. Their price is roughly *expected payout + a charge for bearing risk + costs*. In US listed options the immediate counterparty is usually a **market maker** who quotes both sides, keeps the spread, and hedges the risk in the stock market ([[market-makers]]); behind them stand income sellers, covered-call funds and other institutions.

For the buyer, three costs are always present:

| Cost | What it is | XYZ example |
|---|---|---|
| **Premium** | the price of the right; never refunded | $245 for the 100 call |
| **Time decay** | an option's value melts as expiry nears if nothing moves | the 100 call loses about \(0.044 \times 100 \approx \$4.36\) a day at 30 days out, and about $21 a day with one day left ([[theta]]) |
| **Bid-ask spread** | buying at the ask and selling at the bid | with a quote of 2.40 / 2.50 (for illustration), buying and immediately selling one contract costs \((2.50 - 2.40) \times 100 = \$10\) ([[liquidity-spreads]]) |

None of these costs is a reason to avoid options. They are reasons to know what you are paying for, and to check whether the shape you are buying is worth its price.

## @analogy
Options work like the **insurance industry seen from both counters**.

At one counter, customers buy policies: a homeowner pays a small premium so a fire can't ruin them (the protective put); a young driver pays for a policy mainly for peace of mind. At the same counter someone buys a lottery-like contract: a small payment for a large, uncertain payout (the call bought as a bet).

At the other counter sits the insurer. It collects many small premiums, pays a few large claims, and over a long run of ordinary years usually keeps a margin (income from selling premium). It must hold reserves, because one bad year can cost more than a decade of premiums (margin, and the fat tail).

The analogy breaks in two useful places. First, insurance is usually bought only against losses, while options can be bought on either side — a call is “insurance” against missing a rally. Second, an insurer can't hedge a house fire by trading anything, but an option seller often can: by trading the stock continuously, a market maker offsets much of the risk, which is why option prices are pinned more by **replication** than by actuarial tables. That difference is Idea ②, and it is why option pricing is a science of its own.

## @misconceptions
- **“Protective puts are a free lunch for long-term investors.”** — Bought month after month, Kai's 95 put would cost roughly 6% a year at similar prices. Insurance is worth buying for specific risks or when its price is fair, not by reflex.
- **“A call is just a cheaper way to buy the stock.”** — A call gives the upside above the strike for a fee that is lost if the stock doesn't rise past the breakeven. At +2% the 100 call still loses money while the shares gain.
- **“Leverage with options is always riskier than owning shares.”** — It depends on how you use it. One call plus cash risks at most the premium; it behaves like shares plus a put. The risky version is spending the whole account on calls.
- **“Selling options is free income because most expire worthless.”** — The seller is paid to carry rare, large losses. A high win rate says nothing about whether the premium covers the tail.
- **“The other side of my trade is betting against me.”** — Usually it is a market maker who hedges and earns the spread, or an investor with a different goal, such as a fund selling covered calls for income. They need not have any view on XYZ.

## @takeaways
- Options have four uses: insurance (buy puts on what you own), leverage (buy calls instead of shares), income (sell premium) and optionality (pay a small price for an uncertain upside).
- Insurance has a deductible (strike below spot) and a running cost; Kai's 95 put costs 0.51% a month and caps the loss at −$551.
- Leverage multiplies percentages both ways: the 100 call returns +308% at +10% and −100% at 0%; a call plus cash behaves like shares plus a put.
- Premium sellers earn small, frequent gains in exchange for rare, large losses; index implied vol has averaged about 4 points above realised vol, but not in crashes.
- The buyer always pays the premium, time decay and the spread; the other side is usually a hedged market maker or an income seller.

## @quiz
1. Kai holds 100 XYZ bought at $100 and buys the 95 put for $0.51. What is the most Kai can lose by expiry?
   - [ ] $51
   - [ ] $500
   - [x] $551
   - [ ] $9,500
   > The floor is \((K - S_0 - p) \times 100 = (95 - 100 - 0.51) \times 100 = -\$551\): the $5 deductible plus the premium. $51 forgets the deductible; $500 forgets the premium.
2. The 30-day 100 call costs $2.45. XYZ ends at $102. What is the call buyer's return on the premium?
   - [ ] +2%
   - [x] about −18%
   - [ ] +82%
   - [ ] −100%
   > Payoff \(\max(102 - 100, 0) = 2\); return \((2 - 2.45)/2.45 \approx -18\%\). XYZ rose, but not past the $102.45 breakeven. The shares would have made +2%.
3. Which position has almost the same outcomes as 100 XYZ shares plus the 100 put?
   - [ ] 100 shares plus a sold 105 call
   - [ ] Two 100 calls and no cash
   - [ ] A sold 95 put with cash set aside
   - [x] One 100 call plus the rest of the money in cash
   > Call plus cash loses about $213 on a fall and makes about $787 at $110; shares plus the 100 put lose $212 and make $788. Same shape — put-call parity. The other choices have different shapes.
4. Why do option sellers, on average, expect to earn money over long periods?
   - [ ] Because most options expire worthless, so the premium is pure profit
   - [x] Because buyers pay extra to shed risk, so implied volatility has tended to exceed the volatility that follows
   - [ ] Because exchanges pay sellers a rebate
   - [ ] Because sellers can see the buyers' orders
   > Sellers are paid for carrying risk, the way insurers are. For the S&P 500 the implied-minus-realised gap has averaged about 4 volatility points since 1990, but it turns sharply negative in crashes — the risk being paid for.
5. Which of these is an option hidden inside an ordinary contract?
   - [ ] A fixed-price supply agreement both sides must honour
   - [ ] A savings account paying 4%
   - [x] A fixed-rate mortgage the borrower may repay early without penalty
   - [ ] A futures contract on wheat
   > The borrower has the right, not the obligation, to repay and refinance when rates fall — a call on the loan. A supply agreement or a future binds both sides; a savings account has no choice in it.

## @further
- [Protective put — Wikipedia](https://en.wikipedia.org/wiki/Protective_put) — a short reference on the insurance use of puts.
- [How well does the market predict volatility? (CFA Institute Enterprising Investor, 2024)](https://blogs.cfainstitute.org/investor/2024/07/31/how-well-does-the-market-predict-volatility/) — the implied-versus-realised gap behind "sellers get paid on average".
- [Carr & Wu (2009), Variance Risk Premiums](https://academic.oup.com/rfs/article-abstract/22/3/1311/1581057) — the academic evidence that index volatility sellers are compensated.
- [Real options valuation — Wikipedia](https://en.wikipedia.org/wiki/Real_options_valuation) — how the option idea extends to projects and business decisions.
- [Convertible bond — Wikipedia](https://en.wikipedia.org/wiki/Convertible_bond) — the bond-plus-call structure described above.

## @next
Insurance, leverage, income and optionality all come from one geometric fact: an option's payoff bends where a stock's is straight. Why does that bend make uncertainty itself valuable? The next lesson draws the line and the hockey stick side by side.
