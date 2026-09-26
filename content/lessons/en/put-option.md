---
id: put-option
prereqs: why-options, linear-vs-convex, call-option
demo: put-option
---

# The Put: The Right to Sell

## @hook
A put is the right to sell a stock at a fixed price. It pays when the stock falls, which makes it two things at once: a bet on a decline, and insurance for shares you already own. For $0.51 a share, Kai can make sure the 100 XYZ shares cannot lose more than $551 over the next 30 days — however bad the earnings are.

## @bridge
[[call-option]] gave Kai the right to *buy* XYZ at a fixed price and drew the hockey stick that pays on the way up. This lesson flips it: the put, the right to *sell*, pays on the way down. We'll compute its payoff and P&L, see why its gain has a ceiling while the call's doesn't, and use it for the first of Kai's three wishes — protecting the shares. It builds Idea ① (shape — the put is the call's mirror image) and Idea ④ (risk — a put turns an open-ended loss into a known one). Next, [[contract-specs]] reads the fine print both contracts share.

## @intuition
Kai owns 100 shares of XYZ bought at $100 ($10,000; XYZ is a fictional stock used for illustration). Earnings arrive in about three weeks. Kai hopes they are good, but a bad report could knock the stock down 15 or 20% in a day. Selling the shares now would remove the risk and also the hope. Is there something in between?

There is. For **$0.51 per share** ($51 for one contract of 100 shares), Kai can buy **the right, but not the obligation, to sell 100 XYZ at $95 each, at any time over the next 30 days**. That contract is a **put option**. The $95 is its strike; the $0.51 is its premium, which we write \(p\) for a put.

Look at what the right does in a few scenarios at expiry:

| XYZ at expiry | Kai's shares | The 95 put | Shares + put (per share) | Per 100 shares |
|---|---|---|---|---|
| $80 | \(-20\) | sell at 95: \(15 - 0.51 = +14.49\) | \(-5.51\) | −$551 |
| $90 | \(-10\) | \(5 - 0.51 = +4.49\) | \(-5.51\) | −$551 |
| $95 | \(-5\) | worthless: \(-0.51\) | \(-5.51\) | −$551 |
| $100 | \(0\) | \(-0.51\) | \(-0.51\) | −$51 |
| $110 | \(+10\) | \(-0.51\) | \(+9.49\) | +$949 |

Below $95, the put's gains grow exactly as fast as the shares' losses, so the combination stops falling: **a floor at −$5.51 a share**. Above $95 the put expires worthless and Kai keeps all of the stock's upside, minus the $0.51 paid for the protection.

> [!KAI] The first wish: protection
> Kai's worst case over the next 30 days is now known today: \(-\$551\) on a $10,000 position — $500 of “deductible” (the gap between $100 and the $95 strike) plus the $51 premium. Without the put, a drop to $80 would cost $2,000. The price of this certainty is $51, lost if nothing bad happens.

Before insurance, let's look at the put on its own. Take the at-the-money 30-day 100 put, which costs $2.12. Its expiry P&L is a hockey stick facing the other way:

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Payoff of a long put: rising profit as the price falls, flat loss above the strike">
<defs><marker id="put-option-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="50" y1="30" x2="50" y2="200" class="fx-axis"/>
<line x1="50" y1="170" x2="625" y2="170" class="fx-axis" marker-end="url(#put-option-ah)"/>
<line x1="50" y1="70" x2="620" y2="70" class="fx-grid"/>
<line x1="50" y1="120" x2="620" y2="120" class="fx-grid"/>
<polygon points="60,55.6 368.9,170 60,170" class="fx-area-ok"/>
<polygon points="368.9,170 397.5,180.6 600,180.6 600,170" class="fx-area-bad"/>
<polyline points="60,55.6 397.5,180.6 600,180.6" class="fx-line-thick"/>
<line x1="397.5" y1="66" x2="397.5" y2="200" class="fx-line-muted fx-dash"/>
<circle cx="368.9" cy="170" r="5" class="fx-fill-orange"/>
<text x="360" y="192" text-anchor="end" class="fx-t-hl">breakeven 97.88</text>
<text x="45" y="74" text-anchor="end" class="fx-t-sm">+20</text>
<text x="45" y="124" text-anchor="end" class="fx-t-sm">+10</text>
<text x="45" y="174" text-anchor="end" class="fx-t-sm">0</text>
<text x="45" y="190" text-anchor="end" class="fx-t-sm">−2.12</text>
<text x="127.5" y="216" text-anchor="middle" class="fx-t-sm">80</text>
<text x="262.5" y="216" text-anchor="middle" class="fx-t-sm">90</text>
<text x="397.5" y="216" text-anchor="middle" class="fx-t-b">K = 100</text>
<text x="532.5" y="216" text-anchor="middle" class="fx-t-sm">110</text>
<text x="600" y="216" text-anchor="middle" class="fx-t-sm">115</text>
<line x1="150" y1="44" x2="72" y2="52" class="fx-line-ok" marker-end="url(#put-option-ah)"/>
<text x="156" y="40" class="fx-t-ok">keeps rising as XYZ falls, but stops at XYZ = 0:</text>
<text x="156" y="56" class="fx-t-ok">max gain 100 − 2.12 = 97.88 a share ($9,788)</text>
<text x="412" y="198" class="fx-t-bad">max loss = premium: $2.12</text>
<text x="620" y="240" text-anchor="end" class="fx-t-sm">XYZ price at expiry ($)</text>
<text x="60" y="26" class="fx-t-sm">P&amp;L per share ($)</text>
</svg>
<figcaption>Figure 1 · The 30-day 100 put at expiry. Above the strike it is flat at −2.12, the premium. Below the strike it gains $1 a share for every $1 XYZ falls, crossing zero at \(K - p = 97.88\). Unlike a call, the gain has a ceiling: a stock cannot fall below zero.</figcaption>
</figure>

Now combine it with shares. The picture below is the whole idea of a protective put in three panels: a straight line (shares), plus a hockey stick (the put), equals a line with a floor.

<figure>
<svg viewBox="0 0 680 230" role="img" aria-label="Shares plus a put equals a position with a floor">
<line x1="20" y1="110" x2="200" y2="110" class="fx-axis"/>
<line x1="250" y1="110" x2="430" y2="110" class="fx-axis"/>
<line x1="480" y1="110" x2="660" y2="110" class="fx-axis"/>
<line x1="317.5" y1="40" x2="317.5" y2="175" class="fx-line-muted fx-dash"/>
<line x1="547.5" y1="40" x2="547.5" y2="128" class="fx-line-muted fx-dash"/><line x1="547.5" y1="168" x2="547.5" y2="178" class="fx-line-muted fx-dash"/>
<polyline points="20,170 200,50" class="fx-line-thick"/>
<polyline points="250,66.5 317.5,111.5 430,111.5" class="fx-line-hl"/>
<polygon points="480,110 480,126.5 547.5,126.5 572.3,110" class="fx-area-bad"/>
<polyline points="480,126.5 547.5,126.5 660,51.5" class="fx-line-thick"/>
<text x="225" y="116" text-anchor="middle" class="fx-t-b">+</text>
<text x="455" y="116" text-anchor="middle" class="fx-t-b">=</text>
<text x="110" y="30" text-anchor="middle" class="fx-t-b">100 shares bought at $100</text>
<text x="340" y="30" text-anchor="middle" class="fx-t-b">one 95 put for $0.51</text>
<text x="570" y="30" text-anchor="middle" class="fx-t-b">shares + put</text>
<text x="317.5" y="190" text-anchor="middle" class="fx-t-sm">K = 95</text>
<text x="547.5" y="190" text-anchor="middle" class="fx-t-sm">K = 95</text>
<text x="485" y="146" class="fx-t-bad">floor: −5.51 a share</text>
<text x="485" y="162" class="fx-t-bad">= −$551 at most</text>
<text x="110" y="208" text-anchor="middle" class="fx-t-sm">loses $1 per $1 fall, no bottom</text>
<text x="340" y="208" text-anchor="middle" class="fx-t-sm">gains $1 per $1 fall below 95</text>
<text x="570" y="208" text-anchor="middle" class="fx-t-sm">the two cancel below 95</text>
<text x="340" y="226" text-anchor="middle" class="fx-t-sm">horizontal axes: XYZ at expiry, 80 to 120</text>
</svg>
<figcaption>Figure 2 · Why a put is insurance. Below the strike the put gains exactly what the shares lose, so the sum goes flat — the floor \(K - S_0 - p = 95 - 100 - 0.51 = -5.51\) a share. Above the strike the put is worthless and the shares keep their upside.</figcaption>
</figure>

::demo[put-option-floor]

> [!THINK] XYZ goes bankrupt and trades at $0. How much can the 30-day 100 put pay, at most?
> A call's gain has no ceiling. Is a put the same? Predict first.
> ---
> No. The put lets you sell at $100 something worth $0, so its payoff tops out at $100 a share. After the $2.12 premium the maximum gain is \(100 - 2.12 = 97.88\) a share, or $9,788 a contract. Prices have a floor at zero, so a put's gain is large but capped — the one place where the put is not a perfect mirror of the call.

We'll take it in five parts:

- **① The contract**: the right to sell, the obligation to buy
- **② Payoff and profit**: the mirror formulas
- **③ The three numbers**: maximum loss, breakeven, maximum gain
- **④ The put as insurance**: Kai's floor, premium and deductible
- **⑤ The put as a bet, and its link to the call**

## @mechanics
### ① The contract: the right to sell, the obligation to buy

The roles mirror the call:

- The **put buyer (holder)** pays the premium and gets the right to *sell* 100 shares at the strike until expiry. Exercising a stock put means delivering 100 shares and receiving \(K \times 100\) in cash.
- The **put writer (seller)** collects the premium and takes on the obligation to *buy* 100 shares at the strike if assigned — even if the market price has collapsed.

The buyer does **not** need to own the stock. A holder without shares can sell the put back into the market before expiry (the usual route), or, at expiry, buy shares in the market and deliver them. Owning the shares and buying a put to protect them is called a **protective put**; buying a put without shares is simply a bearish position. The contract is the same either way.

As with calls, quotes are per share and one contract covers 100 shares: the 95 put quoted at 0.51 costs \(0.51 \times 100 = \$51\). XYZ puts are American style, so they can be exercised any business day until expiry ([[exercise-assignment]]).

### ② Payoff and profit: the mirror formulas

A put pays when the stock finishes **below** the strike, by the amount it is below:

$$
\text{payoff} = \max(K - S_T,\ 0), \qquad \Pi = \max(K - S_T,\ 0) - p
$$

where:

- \(S_T\) is XYZ's price at expiry and \(K\) the strike;
- \(p\) is the put premium paid today;
- \(\max(K - S_T, 0)\) is zero whenever the stock finishes at or above the strike — the holder simply doesn't exercise;
- \(\Pi\) is the profit or loss per share; multiply by 100 for one contract.

Compare with the call's \(\max(S_T - K, 0)\): the two letters swap places, and that is the whole difference in shape.

> [!EXAMPLE] The 30-day 100 put ($2.12) at three prices
> - XYZ at $90: \(\Pi = \max(100 - 90, 0) - 2.12 = 10 - 2.12 = 7.88\) per share, \(7.88 \times 100 = \$788\) per contract.
> - XYZ at $99: \(\Pi = \max(1, 0) - 2.12 = -1.12\), \(-\$112\) — in the money, exercised, still a loss.
> - XYZ at $110: \(\Pi = 0 - 2.12 = -2.12\), \(-\$212\) — the whole premium.

### ③ The three numbers every put buyer should know

**Maximum loss = the premium**, whenever \(S_T \ge K\).

**Breakeven = strike − premium.** Below the strike, \(K - S_T - p = 0\) gives

$$
S_{\text{BE}} = K - p, \qquad \Pi_{\max} = K - p \ \ (\text{reached at } S_T = 0)
$$

where \(S_{\text{BE}}\) is the expiry price at which the put breaks even and \(\Pi_{\max}\) is its largest possible profit per share. They are the same number, because at \(S_T = 0\) the payoff is exactly \(K\): the put pays one dollar per dollar of fall, and the stock has exactly \(K\) dollars of fall below the strike.

> [!EXAMPLE] The 30-day XYZ put menu
> | Strike | Premium | Per contract | Breakeven \(K - p\) | Fall needed | Max gain per contract |
> |---|---|---|---|---|---|
> | 90 | 0.06 | $6 | 89.94 | −10.1% | $8,994 |
> | 95 | 0.51 | $51 | 94.49 | −5.5% | $9,449 |
> | 100 | 2.12 | $212 | 97.88 | −2.1% | $9,788 |
> | 105 | 5.37 | $537 | 99.63 | −0.4% | $9,963 |
>
> The 100 put: \(S_{\text{BE}} = 100 - 2.12 = 97.88\), and \(\Pi_{\max} = 97.88 \times 100 = \$9{,}788\).

The pattern mirrors the call menu: **higher-strike puts cost more but pay sooner; lower-strike puts are cheap because they need a bigger fall.** (The 105 put is already $5 in the money; most of its $5.37 is that $5, a split explained in [[intrinsic-time-value]].)

> [!WARN] A falling stock is not enough
> If XYZ drifts down to $96, the 95 put expires worthless and Kai loses the $51. A put profits only if the fall is large enough to pass \(K - p\) by expiry, or if the market reprices the put higher before then.

### ④ The put as insurance: Kai's floor

For someone who owns the stock, a put is an insurance policy with three familiar parts:

- the **premium** is the insurance premium ($0.51 a share);
- the **gap between today's price and the strike** is the **deductible** — the loss Kai absorbs before the policy pays ($100 − $95 = $5);
- the **expiry** is the end of the coverage period (30 days).

The worst the protected position can do is fixed by these three numbers:

$$
\Pi_{\text{floor}} = K - S_0 - p
$$

where \(S_0\) is the price Kai paid for the shares ($100), \(K\) the put strike, and \(p\) the premium. Below the strike, the shares' loss \(S_T - S_0\) and the put's gain \(K - S_T\) add up to \(K - S_0\) whatever \(S_T\) is; subtract the premium and you have the floor.

> [!RECALL] Three policies, already priced in [[why-options]]
> The 90 put costs $6 and sets a floor of \(90 - 100 - 0.06 = -10.06\) a share (−$1,006 on 100 shares); the 95 put costs $51 for a floor of −$551; the 100 put costs $212 for a floor of −$212. The more complete the protection, the more it costs. The 95 put costs 0.51% of the position for 30 days; bought again every month at similar prices, that is roughly 6% a year — the drag that [[protective-put-collar]] weighs against the protection.

There is no free choice here, only a trade-off: a low deductible (high strike) costs more premium, a cheap policy (low strike) leaves more loss on Kai's side. What the policy should cost is set by how likely a big fall is — Idea ③, volatility, which [[implied-vol]] develops.

### ⑤ The put as a bet, and its link to the call

Someone who does not own XYZ can buy a put simply because they expect a fall. Compare with the classic bearish trade, **short selling** (borrowing shares and selling them, hoping to buy back cheaper): a short seller gains $1 for every $1 the stock falls, but loses $1 for every $1 it rises — with no limit. The put buyer's loss is limited to the premium. If XYZ drops to $90, the 100 put earns \(7.88 / 2.12 \approx 3.7\) times its cost (+372%); if XYZ rises to $130, the short seller has lost $3,000 on 100 shares while the put buyer has lost $212.

The put buyer pays for that safety in a currency the short seller doesn't: **time**. A short sale can wait months for the fall. A 30-day put needs the fall to happen within 30 days, and to be big enough to clear the premium. A bearish view that is right but late loses the whole premium — a trade-off that returns in [[long-options]] when choosing expiries.

Who sells these puts, and why? The seller collects $2.12 today and promises to buy XYZ at $100 if asked. If XYZ stays above $100, the seller keeps the $212 for doing nothing; if XYZ collapses, the seller buys shares worth far less than $100. That is exactly an insurer's business — collect many small premiums, occasionally pay a large claim — and [[four-positions]] looks at it from the seller's chair.

Calls and puts on the same strike and expiry are tied together. For XYZ's 30-day 100 options:

$$
C - P = S - Ke^{-rT}
$$

where \(C\) and \(P\) are the call and put prices, \(S\) the stock price, and \(Ke^{-rT}\) the strike discounted to today at the risk-free rate \(r\) (the present value of $100 paid in 30 days).

Check it with XYZ's numbers: \(C - P = 2.45 - 2.12 = 0.33\), and \(S - Ke^{-rT} = 100 - 100\,e^{-0.04 \times 30/365} = 100 - 99.67 = 0.33\). The call costs a little more than the put because owning the stock through a call lets you keep the $100 in the bank for 30 days, earning interest. This is **put-call parity**, the first great no-arbitrage result, proved in [[put-call-parity]]. For now, the takeaway is simple: the call and the put are not two unrelated products. Knowing one price tells you the other.

> [!HISTORY] 1977: puts arrive
> The CBOE opened in 1973 with calls only. The SEC let it list puts in June 1977, starting with five stock classes. Since then puts have become the main tool for hedging stock portfolios — and on stock indexes they tend to be priced richly relative to calls, because so many investors want the insurance. That asymmetry has a name, the volatility skew ([[smile-skew]]).

## @analogy
A put is **car insurance for a stock**. Kai pays a premium ($51) for a policy that runs for a fixed period (30 days). The policy has a deductible: the first $5 a share of damage is Kai's problem. Beyond that, the insurer covers every dollar of loss, up to the total value of the car (the stock can only fall to zero).

A cheaper policy with a higher deductible (the 90 put) or a pricier one with no deductible (the 100 put) are both on offer; the insurer charges more when accidents look more likely (higher volatility). If the car survives the month untouched, the premium is simply gone — that is not a mistake, it is what insurance costs.

The analogy breaks in two places. A real insurer only pays if you own the car and it is damaged; a put pays anyone who holds it whenever the price is below the strike at expiry — you can “insure” a car you don't own, which is exactly what a bearish put buyer does. And a car insurance policy can't be resold; a put can, and its price changes every second with XYZ.

## @misconceptions
- **“A put's profit is unlimited, like a call's.”** — It is capped at \(K - p\) per share, reached only if the stock goes to zero. Big, but finite.
- **“You have to own the stock to buy a put.”** — No. Anyone can buy a put; with shares it is protection, without shares it is a bearish bet.
- **“Buying a put is the same as shorting the stock.”** — Both gain when the price falls, but a short seller's loss is unlimited if the price rises, while the put buyer can lose only the premium — and pays for that with time decay.
- **“The cheapest put is the best insurance.”** — A cheap put has a large deductible. The 90 put costs $6, but Kai can still lose over $1,000 before it pays anything.
- **“If the stock goes down, my put makes money.”** — Only if it falls below \(K - p\) by expiry. A slide from $100 to $96 leaves the 95 put worthless.

## @takeaways
- A put is the right, not the obligation, to sell 100 shares at the strike until expiry; its writer must buy at the strike if assigned.
- Payoff \(\max(K - S_T, 0)\); P&L subtracts the premium \(p\). Maximum loss = premium; breakeven = \(K - p\).
- The maximum gain is also \(K - p\), because a price cannot fall below zero.
- Shares plus a put create a floor at \(K - S_0 - p\): Kai's 95 put limits the 30-day loss on 100 shares to $551.
- Calls and puts on the same strike are linked: \(C - P = S - Ke^{-rT}\) (2.45 − 2.12 = 0.33).

## @quiz
1. Kai buys one 30-day XYZ 100 put for $2.12. At expiry XYZ is $93. What is the P&L on the contract?
   - [x] +$488
   - [ ] +$700
   - [ ] −$212
   - [ ] +$912
   > Per share \(\max(100 - 93, 0) - 2.12 = 4.88\); per contract \(4.88 \times 100 = \$488\). $700 forgets the premium; $912 adds it.
2. What is the largest possible profit on that 100 put?
   - [ ] Unlimited
   - [ ] $10,000
   - [x] $9,788
   - [ ] $212
   > The best case is XYZ at 0: the put pays \(100 - 0 = 100\) a share, minus the 2.12 premium, so 97.88 a share or $9,788 a contract.
3. Kai owns 100 XYZ bought at $100 and buys the 30-day 95 put for $0.51. XYZ collapses to $70 by expiry. What is Kai's total P&L on shares plus put?
   - [ ] −$3,051
   - [x] −$551
   - [ ] −$500
   - [ ] −$2,449
   > Shares \(-30\), put \(\max(95 - 70, 0) - 0.51 = 24.49\); total \(-5.51\) a share, −$551. That is the floor \(K - S_0 - p\); −$3,051 forgets that the put pays, −$500 forgets the premium.
4. What is the breakeven at expiry of the 95 put bought for $0.51?
   - [ ] $95.51
   - [ ] $95.00
   - [ ] $99.49
   - [x] $94.49
   > For a put, breakeven = strike − premium \(= 95 - 0.51 = 94.49\). XYZ must finish below that for the put to make money.
5. A trader expects XYZ to fall and compares buying the 100 put with short selling 100 shares. Which statement is correct?
   - [x] The put's loss is limited to the premium; the short sale's loss grows without limit if XYZ rises
   - [ ] Both have unlimited loss if XYZ rises
   - [ ] The short sale has limited loss because a stock can only rise so far
   - [ ] The put gains more than the short sale for every price below 100
   > A short seller loses $1 for every $1 XYZ rises, with no ceiling. The put buyer can lose only the $212 premium. The price of that protection: below 100 the put always earns $212 less than the short sale.

## @further
- [Put option (Wikipedia)](https://en.wikipedia.org/wiki/Put_option) — definitions, payoff, and the protective put.
- [Characteristics and Risks of Standardized Options (OCC)](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the official US options disclosure; defines puts, exercise and assignment.
- [Options exercise FAQ (Options Industry Council)](https://www.optionseducation.org/referencelibrary/faq/options-exercise) — how put exercise and assignment work in practice.
- [A history of listed options (The Option Strategist)](https://www.optionstrategist.com/blog/2024/04/history-listed-options-1209) — from calls-only in 1973 to puts in 1977 and beyond.
- [New Finance Path](https://evidex-cloud.github.io/droplet-labs-finance-path/) — the sister course, for how insurance and risk transfer work across finance.

## @next
Calls and puts share a vocabulary: strikes, expiries, premiums, the ×100 multiplier, exercise style, settlement. Before trading either, Kai needs to read a contract's fine print — and a symbol like `XYZ   261016C00105000`. The next lesson decodes it.
