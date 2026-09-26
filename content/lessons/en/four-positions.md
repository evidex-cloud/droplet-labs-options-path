---
id: four-positions
prereqs: call-option, put-option, intrinsic-time-value
demo: four-positions
---

# The Four Basic Positions: Buyers and Sellers as Mirror Images

## @hook
Every option has two sides. Two contracts times two sides makes four positions: long call, short call, long put, short put. Each is the exact mirror image of another — what one side wins at expiry, the other loses, dollar for dollar. The punchline: **buyers pay time value and keep their losses capped; sellers collect it and hold the tail**, and a call sold without shares has no ceiling on its loss.

## @bridge
So far we have sat in the buyer's chair: [[call-option]] and [[put-option]] drew the buyer's hockey sticks, and [[intrinsic-time-value]] showed that most of what a buyer pays is time value. This lesson walks round the table to the seller: what each of the four positions pays, where it wins and loses, why the two sides always sum to zero, and what a seller must post as collateral. It builds Idea ① — **shape**: these four hockey sticks are the bricks every strategy is built from — and Idea ④ — **risk**: an option moves risk from one side to the other, and someone always ends up holding the tail. It hands over to [[payoff-diagrams]], which teaches you to read any such picture.

## @intuition
Look at Kai's three wishes again. To **protect** the shares, Kai *buys* a put. To **earn income**, Kai *sells* a call. To **bet on a big move with a capped loss**, Kai *buys* a call. So Kai is a buyer in some trades and a seller in others. Both chairs matter.

Two words name the chairs:

- **Long** means you bought the option: you own the right. You paid the premium.
- **Short** means you sold (wrote) the option: you owe the obligation. You received the premium. Opening a new short position is called “sell to open”; you do not need to own an option to sell one.

With XYZ's 30-day 100 options (call $2.45, put $2.12), the four positions at expiry look like this:

<figure>
<svg viewBox="0 0 660 356" role="img" aria-label="The four basic option positions as a two-by-two grid of payoff shapes">
<rect x="10" y="10" width="310" height="155" rx="10" class="fx-box"/>
<polygon points="178.5,118 275,75.9 275,118" class="fx-area-ok"/>
<polygon points="55,118 55,123.9 165,123.9 178.5,118" class="fx-area-bad"/>
<line x1="50" y1="118" x2="280" y2="118" class="fx-axis"/>
<line x1="165" y1="70" x2="165" y2="160" class="fx-line-muted fx-dash"/>
<polyline points="55,123.9 165,123.9 275,75.9" class="fx-line-thick"/>
<text x="22" y="32" class="fx-t-b">Long call</text>
<text x="22" y="48" class="fx-t-sm">pay $2.45 · max loss −$245</text>
<text x="22" y="63" class="fx-t-sm">max gain: unlimited</text>
<text x="165" y="160" text-anchor="middle" class="fx-t-sm">K</text>
<rect x="340" y="10" width="310" height="155" rx="10" class="fx-box"/>
<polygon points="385,118 385,112.1 495,112.1 508.5,118" class="fx-area-ok"/>
<polygon points="508.5,118 605,160.1 605,118" class="fx-area-bad"/>
<line x1="380" y1="118" x2="610" y2="118" class="fx-axis"/>
<line x1="495" y1="70" x2="495" y2="160" class="fx-line-muted fx-dash"/>
<polyline points="385,112.1 495,112.1 605,160.1" class="fx-line-thick"/>
<text x="352" y="32" class="fx-t-b">Short call</text>
<text x="352" y="48" class="fx-t-sm">receive $2.45 · max gain +$245</text>
<text x="352" y="63" class="fx-t-bad">max loss: unlimited</text>
<text x="495" y="160" text-anchor="middle" class="fx-t-sm">K</text>
<rect x="10" y="175" width="310" height="155" rx="10" class="fx-box"/>
<polygon points="55,240.1 153.3,283 55,283" class="fx-area-ok"/>
<polygon points="153.3,283 165,288.1 275,288.1 275,283" class="fx-area-bad"/>
<line x1="50" y1="283" x2="280" y2="283" class="fx-axis"/>
<line x1="165" y1="235" x2="165" y2="325" class="fx-line-muted fx-dash"/>
<polyline points="55,240.1 165,288.1 275,288.1" class="fx-line-thick"/>
<text x="22" y="197" class="fx-t-b">Long put</text>
<text x="22" y="213" class="fx-t-sm">pay $2.12 · max loss −$212</text>
<text x="22" y="228" class="fx-t-sm">max gain +$9,788 (XYZ at 0)</text>
<text x="165" y="325" text-anchor="middle" class="fx-t-sm">K</text>
<rect x="340" y="175" width="310" height="155" rx="10" class="fx-box"/>
<polygon points="385,325.9 483.3,283 385,283" class="fx-area-bad"/>
<polygon points="483.3,283 495,277.9 605,277.9 605,283" class="fx-area-ok"/>
<line x1="380" y1="283" x2="610" y2="283" class="fx-axis"/>
<line x1="495" y1="235" x2="495" y2="325" class="fx-line-muted fx-dash"/>
<polyline points="385,325.9 495,277.9 605,277.9" class="fx-line-thick"/>
<text x="352" y="197" class="fx-t-b">Short put</text>
<text x="352" y="213" class="fx-t-sm">receive $2.12 · max gain +$212</text>
<text x="352" y="228" class="fx-t-bad">max loss −$9,788 (XYZ at 0)</text>
<text x="495" y="325" text-anchor="middle" class="fx-t-sm">K</text>
<text x="330" y="350" text-anchor="middle" class="fx-t-sm">each panel: XYZ at expiry from 80 to 120 (left to right), strike 100, P&amp;L at expiry</text>
</svg>
<figcaption>Figure 1 · The four basic positions. Each row is a mirror pair: flip the long call upside down and you get the short call; flip the long put and you get the short put. Buyers (left) have a flat, limited loss and a sloping gain; sellers (right) have a flat, limited gain and a sloping loss.</figcaption>
</figure>

The same information as a table, per contract:

| Position | Your view | Premium | Max gain | Max loss | Breakeven |
|---|---|---|---|---|---|
| Long call | up, a lot | pay $245 | unlimited | −$245 | 102.45 |
| Short call | not up | receive $245 | +$245 | unlimited | 102.45 |
| Long put | down, a lot | pay $212 | +$9,788 | −$212 | 97.88 |
| Short put | not down | receive $212 | +$212 | −$9,788 | 97.88 |

Notice the views. A buyer needs the stock to **move** — far enough, fast enough. A seller needs it **not** to move against them; standing still is a win. That is the time value from the last lesson changing hands: the buyer pays for possibility, the seller is paid for bearing it.

::demo[four-positions-mirror]

> [!KAI] Kai's covered call is a short call — with a seat belt
> Kai's income trade sells the 105 call for $0.71. On its own, a short call has unlimited loss. But Kai owns the 100 shares that the call might have to deliver, so if XYZ soars to $130 Kai simply hands over shares bought at $100 and keeps \(105 - 100 + 0.71 = 5.71\) a share. The shares cancel the short call's open-ended loss — that combination is the **covered call** ([[covered-call]]). Selling the same call without shares is called **naked**, and it is a different animal.

> [!THINK] Suppose Kai had instead *sold* the 95 put for $0.51. At expiry XYZ is at $90. What happens, and what did Kai effectively pay for the shares?
> Think about who can force whom to do what.
> ---
> The put holder exercises: they sell 100 shares to Kai at $95 although the market pays $90. Kai must buy (this is **assignment**) and now owns 100 XYZ at a cost of $95, minus the $0.51 collected: an effective price of \(95 - 0.51 = 94.49\). Marked to the $90 market, that is \(-4.49\) a share, or −$449. Selling a put is, in effect, **agreeing in advance to buy the stock at \(K - p\)** if it falls — the core of the cash-secured put ([[cash-secured-put]]).

We'll take it in five parts:

- **① Long and short**: the four P&L formulas
- **② Zero-sum**: why buyer + seller = 0, and why options still exist
- **③ The seller's side**: frequent small wins, rare large losses
- **④ Collateral and approval**: what brokers require from sellers
- **⑤ Building blocks**: assignment, and how the four combine into everything else

## @mechanics
### ① Long and short: the four P&L formulas

With \(c\) and \(p\) the premiums of a call and a put with strike \(K\), and \(S_T\) the stock price at expiry, per share:

$$
\begin{aligned}
\text{long call:}\quad \Pi &= \max(S_T - K,\ 0) - c \\
\text{short call:}\quad \Pi &= c - \max(S_T - K,\ 0) \\
\text{long put:}\quad \Pi &= \max(K - S_T,\ 0) - p \\
\text{short put:}\quad \Pi &= p - \max(K - S_T,\ 0)
\end{aligned}
$$

where \(\Pi\) is profit and loss per share (×100 per contract). A short position is literally the long formula with the sign flipped: the seller *receives* the premium and *pays* the payoff.

> [!EXAMPLE] All four at XYZ = $110 at expiry (strike 100)
> - Long call: \(\max(110 - 100, 0) - 2.45 = 7.55\) → +$755
> - Short call: \(2.45 - \max(110 - 100, 0) = -7.55\) → −$755
> - Long put: \(\max(100 - 110, 0) - 2.12 = -2.12\) → −$212
> - Short put: \(2.12 - \max(100 - 110, 0) = 2.12\) → +$212
>
> Each mirror pair sums to zero: \(7.55 + (-7.55) = 0\) and \(-2.12 + 2.12 = 0\).

### ② Zero-sum: why buyer + seller = 0

Every contract has exactly one long side and one short side, and the money only moves between them: the premium from buyer to seller today, the payoff (if any) from seller to buyer at expiry. So at every expiry price:

$$
\Pi_{\text{long}}(S_T) + \Pi_{\text{short}}(S_T) = 0
$$

where \(\Pi_{\text{long}}\) and \(\Pi_{\text{short}}\) are the two sides' P&L on the same contract. The option creates no money and destroys none. The same bookkeeping holds for the whole market: add up every XYZ October 105 call in existence and the long positions exactly match the short ones. The number of such matched pairs still open is the contract's **open interest**, a figure you'll meet on every option chain ([[option-chain]]). (Commissions, the bid-ask spread and exchange fees make the sum slightly negative for the two traders together; those costs go to brokers, market makers and exchanges — [[liquidity-spreads]].)

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Long call and short call P&L are mirror images across the zero line">
<defs><marker id="four-positions-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="50" y1="130" x2="615" y2="130" class="fx-axis" marker-end="url(#four-positions-ah)"/>
<line x1="50" y1="40" x2="50" y2="220" class="fx-axis"/>
<line x1="330" y1="40" x2="330" y2="140" class="fx-line-muted fx-dash"/><line x1="330" y1="166" x2="330" y2="220" class="fx-line-muted fx-dash"/>
<polyline points="60,144.7 330,144.7 600,54.7" class="fx-line-ok"/>
<polyline points="60,115.3 330,115.3 600,205.3" class="fx-line-bad"/>
<line x1="510" y1="84.7" x2="510" y2="175.3" class="fx-line fx-dash"/>
<circle cx="510" cy="84.7" r="5" class="fx-fill-green"/>
<circle cx="510" cy="175.3" r="5" class="fx-fill-red"/>
<text x="518" y="106" class="fx-t-ok">buyer +$755</text>
<text x="518" y="162" class="fx-t-bad">seller −$755</text>
<text x="70" y="178" class="fx-t-ok">long call: −$245 below 100</text>
<text x="70" y="108" class="fx-t-bad">short call: +$245 below 100</text>
<circle cx="374.1" cy="130" r="4.5" class="fx-fill-orange"/>
<text x="366" y="160" text-anchor="end" class="fx-t-hl">both break even at 102.45</text>
<text x="150" y="238" text-anchor="middle" class="fx-t-sm">90</text>
<text x="330" y="238" text-anchor="middle" class="fx-t-b">K = 100</text>
<text x="510" y="238" text-anchor="middle" class="fx-t-sm">110</text>
<text x="600" y="238" text-anchor="middle" class="fx-t-sm">115</text>
<text x="60" y="30" class="fx-t-sm">today: buyer pays $245 to seller · at expiry: seller pays buyer (price − 100) × 100 if above 100</text>
<text x="615" y="256" text-anchor="end" class="fx-t-sm">XYZ price at expiry ($)</text>
</svg>
<figcaption>Figure 2 · The long call (green) and the short call (red) on the same contract are reflections of each other across the zero line. At $110 the buyer is up $755 and the seller down exactly $755. Every point on one line has its twin on the other.</figcaption>
</figure>

If the game is zero-sum, why does anyone play? Because the two sides are usually not in the same situation. Kai buys the 95 put not to make money on the put but to cap a loss on shares; a lower worst case is worth $51 to Kai even though, on the put alone, the expected gain may be negative. The seller takes on that risk for a fee, like an insurer. **The contract is zero-sum; the two sides' whole portfolios are not.** This is the risk-transfer story from [[why-options]], now seen from both chairs.

### ③ The seller's side: frequent small wins, rare large losses

Buyers and sellers experience the same contract very differently.

- **How often each side wins.** Using the market's own pricing probabilities (the risk-neutral ones behind Black-Scholes), XYZ finishes below the long call's breakeven of 102.45 about 65% of the time. So the short call ends with a profit in roughly two out of three outcomes and the long call in one out of three. These are risk-neutral odds, not a forecast; [[probability-ev]] explains the difference.
- **How much each side wins.** The seller's gain is capped at $245; the buyer's is not. The high win rate is paid for by the size of the rare losses.
- **The tail.** A naked short call loses $2,755 if XYZ jumps to $130 and $4,755 at $150, with no limit. A short put loses at most \(K - p\) per share — still $9,788 per contract if XYZ goes to zero.

A high win rate is not an edge. In the pricing model, the premium is exactly what the payoff is worth on average (discounted), so under those same probabilities both sides expect to break even: the seller's many small wins are paid for, on average, by the few large losses. Whether sellers earn anything in the real world depends on whether option buyers habitually pay more than the moves turn out to be worth — an empirical question with a long history, taken up in [[variance-risk-premium]]. What a seller certainly gets is a different *shape* of outcomes, not a free lunch.

The short put deserves a formula of its own, because it has a very concrete meaning. If assigned, the seller buys 100 shares at \(K\), having already collected \(p\):

$$
\text{effective purchase price} = K - p
$$

where \(K\) is the put's strike and \(p\) the premium received.

> [!EXAMPLE] Two short puts on XYZ
> - Sell the 30-day 100 put for $2.12: if assigned, the seller owns XYZ at \(100 - 2.12 = 97.88\) — a bit below today's price, paid for with the risk of owning shares in a falling market.
> - Sell the 95 put for $0.51: if assigned, the effective price is \(95 - 0.51 = 94.49\). If XYZ never drops below $95, the seller simply keeps $51.
>
> Either way, the seller's worst case is XYZ going to zero: \(-(K - p) \times 100\).

> [!WARN] Unlimited means unlimited
> A naked short call has no maximum loss: a takeover bid or a short squeeze can gap a stock far above the strike overnight, and the seller must deliver shares at \(K\) whatever they cost. Short options also look calm for long stretches — many small wins — and then lose many months of premium in a day. That pattern, and how professionals size and hedge it, returns in [[variance-risk-premium]] and [[position-sizing]].

### ④ Collateral and approval: what brokers require from sellers

Because a seller's obligation can be large, brokers require collateral and permission:

- **Buying** options is the simplest case: under Regulation T, long options generally must be paid for in full, and that premium is the whole risk.
- **Selling** options requires **margin**: money or securities held by the broker to guarantee the obligation. A **covered** call (shares held) or a **cash-secured** put (cash equal to \(K \times 100\) set aside — $9,500 for one 95 put) needs no borrowing. A naked short needs a margin account and a requirement that rises as the position moves against you.
- **Approval levels**: before trading options, a US broker must approve the account for specific activities — covered writing, spreads, uncovered (naked) writing — under FINRA Rule 2360, and deliver the options disclosure document. The numbering of “levels” (1–4 or 1–5) is each broker's own, but naked selling is always at the top.

The exact formulas, portfolio margin and what happens in a margin call are in [[margin-approval]].

### ⑤ Building blocks: assignment, and how the four combine

Two last facts turn these four shapes into a toolkit.

**A short American option can be assigned at any time.** The seller doesn't choose when; the holder does, and the OCC assigns exercises to short positions at random. For most options early exercise is rare because it throws away time value ([[call-option]]), but it happens — typically near expiry, for deep in-the-money options, and for calls just before an ex-dividend date ([[exercise-assignment]]).

**Every strategy is these four bricks plus stock.** A covered call is long stock + short call. A protective put is long stock + long put. A collar adds both. Spreads combine longs and shorts at different strikes ([[vertical-spreads]]). The bricks also combine with each other in a surprising way:

> [!DEEP] A long call plus a short put is a share of stock
> Buy the 100 call ($2.45) and sell the 100 put ($2.12). Net cost \(2.45 - 2.12 = 0.33\). At expiry the call pays \(\max(S_T - 100, 0)\) and the short put costs \(\max(100 - S_T, 0)\); together they pay exactly \(S_T - 100\) at every price. The position behaves like 100 shares bought for \(100 + 0.33 = 100.33\) — which is XYZ's 30-day forward price. This “synthetic stock” is put-call parity in action ([[put-call-parity]], [[synthetics-boxes]]).

The next stage turns this into a skill: reading any payoff picture ([[payoff-diagrams]]) and stacking bricks into new shapes ([[payoff-lego]]).

## @analogy
The four positions are the two sides of an **insurance policy**, written for two different disasters.

A long put is **buying home insurance**: you pay a premium, and if disaster strikes (the stock falls), the policy pays. A short put is **being the insurer** of that home: you collect premiums year after year and pay out, possibly a lot, when the disaster comes. A long call is the same trade for an upside “disaster” — you pay a premium for the chance of a windfall. A short call is **insuring someone else's windfall**: you collect a fee and owe them the jackpot if it arrives.

Across any one policy, what the insurer pays the insured receives: zero-sum. Yet insurance exists because it moves risk from people who can't bear it to people who are paid to. And insurers, like option sellers, have a characteristic life: steady small income, rare large claims. The good ones survive by sizing and spreading their risk; the careless ones are wiped out by a single catastrophe.

Where the analogy breaks: a real insurer covers only a genuine loss the policyholder actually suffers, while an option pays anyone holding it, whether or not they own the stock. And the insurer on a short call faces a “claim” with no policy limit.

## @misconceptions
- **“Selling options is safer because you win most of the time.”** — Win rate and risk are different things. The short call wins about two times in three here, but its occasional loss has no ceiling.
- **“Buyers and sellers can both come out ahead on the same contract.”** — At expiry, one side's gain is exactly the other's loss. Both can be better off only in terms of their wider portfolios (a hedger buying insurance), not on the contract itself.
- **“A short put is a bearish trade.”** — The opposite: the seller wants the stock to stay above the strike, and if it falls, ends up owning shares at \(K - p\). It is a neutral-to-bullish position.
- **“If I sell an option, I can't be assigned until expiry.”** — Short American options can be assigned any business day, especially when deep in the money or before a dividend.
- **“Long call and short put are the same trade because both are bullish.”** — Both gain when XYZ rises, but the long call has limited loss and unlimited gain, while the short put has limited gain and a large loss. Together they make synthetic stock.

## @takeaways
- Long = bought the right and paid the premium; short = sold the obligation and received it. Four positions: long/short call, long/short put.
- A short position's P&L is the long formula with the sign flipped; buyer + seller = 0 at every expiry price.
- Buyers have capped losses and need movement; sellers have capped gains, win more often and carry the tail — unlimited for a naked short call, \(K - p\) per share for a short put.
- Selling a put is agreeing to buy the stock at \(K - p\); selling a call against owned shares (covered) removes the unlimited loss.
- Sellers post collateral and need broker approval; short American options can be assigned early. Every strategy is built from these four bricks plus stock.

## @quiz
1. At expiry XYZ is $110. What is the P&L on one short 30-day 100 call sold for $2.45?
   - [ ] +$245
   - [ ] +$755
   - [x] −$755
   - [ ] −$1,000
   > Per share \(2.45 - \max(110 - 100, 0) = -7.55\), so −$755. The seller keeps the premium but pays the $10 payoff. −$1,000 forgets the premium received.
2. Which position has an unlimited maximum loss?
   - [ ] The long call
   - [ ] The short put
   - [ ] The long put
   - [x] The short call without shares
   > A naked short call must deliver shares at \(K\) however high the price goes. The short put's loss is large but capped at \(K - p\) per share, because the price cannot fall below zero.
3. Kai sells the 30-day 95 put for $0.51 and is assigned when XYZ is $90 at expiry. What is Kai's effective purchase price for the shares?
   - [ ] $90.00
   - [x] $94.49
   - [ ] $95.51
   - [ ] $95.00
   > Assignment makes Kai buy at $95, and Kai already collected $0.51, so the effective price is \(95 - 0.51 = 94.49\). Against the $90 market that is −$449 per contract.
4. For the same contract at the same expiry price, how are the buyer's and the seller's P&L related?
   - [x] They add up to zero (before trading costs)
   - [ ] The seller's P&L is always the premium
   - [ ] Both are positive when the option expires out of the money
   - [ ] The buyer's P&L is always larger in absolute size
   > Money only moves between the two sides — premium one way, payoff the other — so one side's gain is exactly the other's loss. Fees and spreads make the total slightly negative.
5. Why do people pay for options if the contract is zero-sum?
   - [ ] Because buyers always win on average
   - [ ] Because the exchange adds money to each contract
   - [x] Because the two sides are in different situations: a hedger values the reduced risk, and the seller is paid to bear it
   - [ ] Because sellers are required by law to lose money
   > The contract is zero-sum, but whole portfolios are not. Kai's put caps a loss on shares Kai already owns; the seller earns a premium for taking that risk, like an insurer.

## @further
- [Characteristics and Risks of Standardized Options (OCC)](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the official disclosure; its risk chapter covers the seller's obligations and uncovered writing.
- [FINRA Rule 2360: Options](https://www.finra.org/rules-guidance/rulebooks/finra-rules/2360) — the rule behind options account approval and suitability.
- [Margin accounts (FINRA)](https://www.finra.org/rules-guidance/key-topics/margin-accounts) — how margin works and why brokers can demand more collateral.
- [Options exercise FAQ (Options Industry Council)](https://www.optionseducation.org/referencelibrary/faq/options-exercise) — assignment, and why short American options can be assigned early.
- [Satoshi Path](https://evidex-cloud.github.io/nextdawn-satoshi-path/) — the sister course, for the crypto markets where the same buyer-seller mirror appears in options and perpetuals.

## @next
Four hockey sticks, each the mirror of another. Every options strategy you will ever meet is a picture made by stacking them. How do you read such a picture at a glance — where it bends, how steep each piece is, where it crosses zero? [[payoff-diagrams]] teaches exactly that.
