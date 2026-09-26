---
id: perps-vs-options
prereqs: linear-vs-convex, long-options, crypto-options, what-is-perp, funding-rate, margin-liquidation, insurance-adl
demo: perps-vs-options
---

# Perps vs Options: Linear, Convex & the Common Traps

## @hook
You think bitcoin will rise over the next month. You can say it with a 10× perp or with a call. The perp wins bigger if you are right in a straight line; the call survives if you are right *eventually*. This lesson puts the two side by side (payoff, path, holding cost, traps) and shows why the difference is Idea ① all over again.

## @bridge
In [[linear-vs-convex]] we met the course's first big idea: stocks and futures pay in straight lines, options pay in kinked, convex shapes, and you pay a premium for the kink. The lessons since [[futures-basis]] built the straight-line world in detail: [[what-is-perp]], [[funding-rate]], [[margin-liquidation]] and [[insurance-adl]]. [[crypto-options]] showed where bitcoin options trade. This last lesson of the Markets tier brings the two worlds together on one view and one budget. It closes the loop on Idea ① (shape) and Idea ④ (risk: *when leverage bites decides survival*).

## @intuition
Take one view and express it two ways. All numbers are illustrative: bitcoin at **$100,000**, implied volatility **50%**, rate 4%, horizon **30 days**, size **1 BTC**.

- **The perp:** a 10× long of 1 BTC. You post **$10,000** of margin. Every $1 bitcoin moves, you gain or lose $1. Funding at the baseline +0.01% every 8 hours costs about **$30 a day**, $900 over 30 days. Liquidation near **$90,500**.
- **The call:** a 30-day call with strike $100,000. Black-Scholes at 50% vol and a 4% rate prices it at **$5,870** ([[crypto-options]] got $5,714 by setting the rate to zero). That is the most you can lose. It gains about $0.54 per $1 move today (its delta), more as bitcoin rises, less as it falls.

Now let four different months happen:

| What bitcoin does in 30 days | 10× perp | 30-day 100k call |
|---|---|---|
| Rises steadily to $115,000 | **+$14,100** (15,000 − 900 funding) | +$9,130 (15,000 − 5,870) |
| Goes nowhere, ends at $100,000 | −$900 (funding) | **−$5,870** (all time value) |
| Dips to $90,000 on day 5, ends at $115,000 | **−$10,000** (liquidated on day 5) | **+$9,130** (dip survived) |
| Falls to $80,000 | −$10,000 (liquidated) | −$5,870 |

Each row teaches something. In a clean rally, the perp's straight line beats the call: you did not pay a premium for protection you never used. In a flat month, the perp's rent is small and the call's time value melts away completely. But look at the third row: **the same final price, $115,000, gives the two opposite outcomes.** The perp was judged on the path; the call was judged at the end.

<figure>
<svg viewBox="0 0 640 260" role="img" aria-label="Perp versus call at 30 days, with the liquidation cliff">
<defs><marker id="perps-vs-options-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="60" y="30" width="141.75" height="200" class="fx-area-bad"/>
<line x1="50" y1="160" x2="615" y2="160" class="fx-axis" marker-end="url(#perps-vs-options-ah)"/>
<line x1="330" y1="30" x2="330" y2="230" class="fx-grid"/>
<polyline points="60,210 201.75,210" class="fx-line-btc"/>
<line x1="201.75" y1="210" x2="201.75" y2="212" class="fx-line-btc"/>
<polyline points="201.75,212 600,64.5" class="fx-line-btc"/>
<polyline points="60,189.35 330,189.35 600,89.35" class="fx-line-thick"/>
<circle cx="262.9" cy="189.35" r="4" class="fx-fill-muted"/>
<circle cx="342.2" cy="160" r="4.5" class="fx-fill-btc"/>
<circle cx="409.2" cy="160" r="4.5" class="fx-fill-ink"/>
<text x="68" y="48" class="fx-t-bad">touch 90,500 at any time</text>
<text x="68" y="64" class="fx-t-bad">→ perp out: −$10,000</text>
<text x="590" y="58" text-anchor="end" class="fx-t-btc">10× perp (held 30 days)</text>
<text x="596" y="144" text-anchor="end" class="fx-t-b">100k call</text>
<text x="222" y="182" class="fx-t-sm">95,030</text>
<text x="336" y="150" text-anchor="end" class="fx-t-btc">BE 100,900</text>
<text x="415" y="176" class="fx-t-b">BE 105,870</text>
<text x="56" y="206" text-anchor="end" class="fx-t-sm">−10k</text>
<text x="56" y="193" text-anchor="end" class="fx-t-sm">−5.9k</text>
<text x="56" y="164" text-anchor="end" class="fx-t-sm">0</text>
<text x="56" y="92" text-anchor="end" class="fx-t-sm">+14k</text>
<text x="60" y="248" class="fx-t-sm">80,000</text>
<text x="330" y="248" text-anchor="middle" class="fx-t-sm">100,000</text>
<text x="600" y="248" text-anchor="end" class="fx-t-sm">120,000 · bitcoin in 30 days</text>
</svg>
<figcaption>Figure 1 · The two P&L lines at 30 days (1 BTC, illustrative). Above about $95,030 the perp beats the call by the premium minus the funding; below it the call's floor is better. The red zone is the catch: the perp's line only applies to paths that never touched $90,500; every path that did ends at −$10,000, wherever it finishes.</figcaption>
</figure>

> [!KAI] Kai picks a tool, not a slogan
> Kai's options habit is to ask three questions before any trade: *what is the most I can lose, when can I lose it, and what does it cost me to wait?* For the call: $5,870, only at expiry, about $100 a day of time decay that speeds up. For the 10× perp: $10,000, **at any moment the mark touches $90,500**, about $30 a day of funding that can change sign. Neither is “better”. They answer different questions: the perp is a cheap way to be right *now*; the call is an expensive way to be allowed to be wrong for a while.

::demo[perps-vs-options-cost]

We'll take it in five parts:

- **① Linear vs convex, in numbers**
- **② Path dependence: the liquidation barrier versus the expiry snapshot**
- **③ Funding vs theta: two kinds of rent**
- **④ Combining them: a perp with a put, and parity**
- **⑤ The traps, a checklist, and what comes next**

## @mechanics
### ① Linear vs convex, in numbers

The perp's P&L on \(Q\) coins is a straight line; the call's is a hockey stick:

$$
\Pi_{\text{perp}} = Q\,(S_T - P_0) - \text{funding}, \qquad \Pi_{\text{call}} = Q\left[\max(S_T - K,\ 0) - C\right]
$$

where \(P_0\) is the perp entry price, \(S_T\) bitcoin's price at the end, \(K\) the strike and \(C\) the premium per coin. The perp has a delta of 1 per coin and **zero gamma**: it never speeds up or slows down. The call starts with a delta of 0.54 and positive gamma: its delta climbs toward 1 in a rally and falls toward 0 in a sell-off ([[gamma]]).

Setting each P&L to zero gives the breakevens:

$$
S^{*}_{\text{perp}} = P_0\,(1 + f\,n\,d), \qquad S^{*}_{\text{call}} = K + C
$$

where \(f\) is the funding rate per interval, \(n\) the intervals per day and \(d\) the days held.

> [!EXAMPLE] Where each one starts to pay
> - Perp: \(100{,}000 \times (1 + 0.0001 \times 3 \times 30) = \$100{,}900\).
> - Call: \(100{,}000 + 5{,}870 = \$105{,}870\).
> - Above the strike, the perp is ahead by \(C - \text{funding} = 5{,}870 - 900 = \$4{,}970\). Below it the gap shrinks, and the two are level at \(100{,}000 + 900 - 5{,}870 = \$95{,}030\); below that, the call's floor wins.

Why pay $5,870 for the kink? Because of Jensen's inequality from [[linear-vs-convex]]: for a convex payoff, uncertainty itself has value. **For the call, volatility is a friend**: a wider spread of outcomes raises its expected payoff. For the leveraged perp, volatility is an enemy: the line itself does not care about volatility, but the liquidation barrier does, because more volatility means more paths that touch it.

### ② Path dependence: the liquidation barrier versus the expiry snapshot

The third row of the table is the whole lesson in one example. Bitcoin falls to $90,000 on day 5, then climbs to $115,000 by day 30.

- The perp touched $90,500 on day 5. It was liquidated: −$10,000. The later rally belongs to someone else.
- The call on day 5, with bitcoin at $90,000 and 25 days left, is still worth about **$1,530**: bruised, not dead. On day 30 it pays \(115{,}000 - 100{,}000 = \$15{,}000\), a profit of $9,130.

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="A path that dips below the liquidation price and recovers">
<rect x="60" y="177.5" width="540" height="27.5" class="fx-area-bad"/>
<line x1="60" y1="205" x2="610" y2="205" class="fx-axis"/>
<line x1="60" y1="130" x2="600" y2="130" class="fx-line-muted fx-dash"/>
<line x1="60" y1="177.5" x2="600" y2="177.5" class="fx-line-bad"/>
<polyline points="60,130 78,137.5 96,145 114,157.5 132,170 150,180 186,167.5 240,145 294,135 348,115 402,125 456,100 510,80 564,70 600,55" class="fx-line-thick"/>
<circle cx="150" cy="180" r="6" class="fx-fill-red"/>
<circle cx="600" cy="55" r="6" class="fx-fill-green"/>
<text x="162" y="222" class="fx-t-bad">day 5: perp liquidated (−$10,000); call still worth $1,530</text>
<text x="590" y="44" text-anchor="end" class="fx-t-ok">day 30: $115,000 → call +$9,130, perp gone</text>
<text x="56" y="134" text-anchor="end" class="fx-t-sm">100,000</text>
<text x="56" y="181" text-anchor="end" class="fx-t-bad">90,500</text>
<text x="66" y="124" class="fx-t-sm">entry / strike</text>
<text x="600" y="240" text-anchor="end" class="fx-t-sm">days 0 → 30 · illustrative</text>
</svg>
<figcaption>Figure 2 · Same view, same final price, opposite results. A barrier (liquidation) looks at every point of the path; an expiry payoff looks only at the last one. Leverage turns a linear contract into a path-dependent one.</figcaption>
</figure>

How often does this happen? With 50% volatility and no drift, a 10× long touches its liquidation price within 30 days on about **51%** of paths ([[margin-liquidation]]), while the call loses its whole premium only if bitcoin ends below $100,000, about 53% of the time under the same assumptions, but that loss is $5,870, not $10,000, and it is decided on day 30, not on a bad afternoon.

> [!THINK] Kai lowers the perp to 3×, with margin $33,333 for the same 1 BTC. Is it now “like a call”?
> Predict before opening: what happens to the barrier, and what happens to the most you can lose?
> ---
> The barrier moves far away (about $67,167; touched on under 1% of 30-day paths), so path risk nearly disappears. But the loss is now a straight line all the way down to $67,167 (up to about $33,000) and the upside is still linear. Lower leverage buys survival with more capital at risk. Only an option (or an option added to the perp, part ④) gives a small, fixed maximum loss *and* survival.

### ③ Funding vs theta: two kinds of rent

Both positions pay to wait, in different currencies.

$$
\text{daily cost}_{\text{perp}} = f \times n \times Q\,P, \qquad \text{daily cost}_{\text{call}} \approx -\Theta \times Q
$$

where \(f\) is the funding per interval, \(n\) intervals per day, \(P\) the mark price and \(\Theta\) the call's theta per day (negative for a long option). With baseline funding the perp costs \(0.0001 \times 3 \times 100{,}000 = \$30\) a day, steady. The call's theta is about **−$100** a day with 30 days left, **−$170** with 10 days left and **−$527** on the last day: time decay accelerates ([[theta]]).

| | 10× perp | 30-day call |
|---|---|---|
| Rent while waiting | funding: ≈ $30/day at baseline; **sign can flip** | theta: ≈ $100/day now, rising to ≈ $527 on the last day; **always a cost to the buyer** |
| Total rent over 30 days if bitcoin sits still | ≈ $900 | $5,870 (the whole premium) |
| What the rent buys | leverage without a loan | the right to be wrong without being liquidated |
| What raises it | crowded longs (hot funding) | high implied volatility, short time to expiry |

The perp is cheaper to hold in quiet markets, but the cost is not fixed: in a hot market at +0.03% per 8 hours it triples to $90 a day, and in a negative-funding market the long is *paid* to wait. The call's rent is known in advance and tops out at the premium.

### ④ Combining them: a perp with a put, and parity

Can you keep the perp's cheap rent and add the option's floor? Buy a put. A 30-day $90,000 put costs about **$1,754** at 50% vol. Held with a long perp, the payoff at expiry is

$$
\underbrace{(S_T - P_0)}_{\text{perp}} + \underbrace{\max(K - S_T,\ 0)}_{\text{put}} = \max(S_T - K,\ 0) + (K - P_0)
$$

where \(K = 90{,}000\) is the put's strike. That is a call plus a constant: put-call parity from [[put-call-parity]] (Idea ②). The combination behaves like a 90k call: loss floored at \(10{,}000 + 900 + 1{,}754 = \$12{,}654\), versus about $12,049 for buying the 90k call outright. The $605 gap is the funding paid ($900) minus the interest the call buyer did not have to lend (about $295).

> [!WARN] The put does not protect a 10× isolated perp
> At 10× the perp is liquidated at $90,500, **before** a $90,000 put is even in the money. You are left holding the put and no perp. The floor only works if the perp has enough margin to survive down to the put's strike (here, roughly 2× or less), or if both sit in one portfolio-margined account that counts the put's value. Check this before you believe you are hedged.

### ⑤ The traps, a checklist, and what comes next

Most painful perp and option mistakes are one of these:

- **Hidden leverage.** “I only put $1,000 in.” At 50× that is $50,000 of bitcoin and a 1.5% barrier. Always convert to notional and to the dollar loss at the liquidation price.
- **Fake APR.** One funding print × 1,095 ([[basis-trades]]). Rates change sign; the hottest ones end fastest.
- **Mark vs last.** Liquidations and ADL use the mark price ([[mark-index-last]]); a wick on one venue's last price is not the whole story, but a mark move is.
- **ADL and venue risk.** Even a winning perp can be closed by auto-deleveraging, and collateral sits on a venue that can fail ([[insurance-adl]]).
- **The option buyer's traps.** Buying after implied volatility has spiked (you pay for moves that were already priced), wide spreads on far strikes, coin-settled payoffs measured in BTC rather than dollars, and the multiplier (×100 for IBIT options, per-coin on Deribit).

> [!FACT] The venues, as of September 2026
> Bitcoin options trade mostly on Deribit (about 49% of crypto options volume in H1 2026, per CoinGlass), which Coinbase acquired in a deal that closed on August 14, 2025; US-listed options on the IBIT bitcoin ETF have traded since November 19, 2024 ([[crypto-options]]). On the perp side, the CFTC set out a framework for listing perpetual contracts on May 29, 2026, Coinbase has offered US “perpetual-style” futures since July 21, 2025, and BitMEX, which launched the first perpetual swap on May 13, 2016, announced on September 4, 2026 that it would close its exchange.

A five-line checklist before either trade:

1. What is the notional, and what is the dollar loss at my exit (liquidation price or premium)?
2. Is my risk judged on the path (perp) or at expiry (option)?
3. What is my daily rent (funding and its sign, or theta), and how will it change?
4. What happens in a 20% gap overnight: am I liquidated, ADL'd, or just down the premium?
5. Would the other tool express my view better? (Right soon → perp; right eventually, or big move either way → option.)

This lesson compared the perp and the call by imagining thousands of possible months and counting what happened to each. That is exactly the idea behind [[monte-carlo]], the first lesson of the Mastery tier: simulate many paths, average the payoffs, and you have a price, even for payoffs, like barriers, that no closed-form formula handles easily.

## @analogy
A 10× perp is a **fast motorbike on a mountain road with no guardrail**. On a clear, straight stretch it gets you there sooner and cheaper than anything else; the fuel (funding) costs little. But the road has a cliff edge 9.5% to your left, and one gust of wind at the wrong moment is enough. Where you *would* have ended up if you had stayed on the road is irrelevant once you are off it.

A call is a **bus ticket valid for 30 days**. It costs more up front and the ticket loses value each day you don't use it (theta). But there is no cliff: however the road twists, the most you can lose is the ticket. If the destination turns out to be worth visiting on day 30, you get there.

A perp with a put is the motorbike with a **guardrail you rent**, useful only if the guardrail is built before the edge, not a few metres beyond it.

Where the analogy breaks: the bus ticket's price depends on how bumpy the road is expected to be (implied volatility), and sometimes the ticket is overpriced for the ride you actually get. Choosing between them is not only about safety; it is also about whether the ticket is fairly priced, the question the whole volatility part of this course was about.

## @misconceptions
- **“A 10× perp is just a cheap call.”** — A call's loss is capped by shape and decided at expiry. A perp's loss is capped by a forced exit decided on the path, and you lose the upside that follows.
- **“If I'm right about the final price, I make money either way.”** — Not with leverage. The same $115,000 ending made +$9,130 on the call and −$10,000 on a perp liquidated on day 5.
- **“Funding is cheaper than theta, so perps are always the cheaper way to wait.”** — In quiet markets, yes; but funding can triple in hot markets, and the perp's real cost of waiting is the chance of being liquidated before you are right.
- **“Adding a put makes my leveraged perp safe.”** — Only if the perp survives down to the put's strike. A 10× isolated long is liquidated at $90,500, before a $90,000 put pays anything.
- **“Lower leverage turns a perp into an option.”** — It moves the barrier away but makes the loss larger and still linear. Only convexity gives a small fixed maximum loss together with open upside.

## @takeaways
- A perp is linear with zero gamma; a call is convex. Leverage adds a liquidation barrier that makes the perp path-dependent.
- Breakevens: perp \(P_0(1 + f\,n\,d)\) = $100,900; call \(K + C\) = $105,870. The perp wins a clean rally; the call wins a flat month with a dip or any path that touches the barrier.
- Rent: funding (≈ $30/day at baseline, can flip sign) versus theta (≈ $100/day now, accelerating, always a cost to the buyer).
- Perp + put ≈ call by parity, but only if the perp's margin survives down to the put's strike.
- Before any leveraged trade, write down the notional, the exit loss, whether risk is judged on the path, and the daily rent, then choose the tool that fits the view.

## @quiz
1. Bitcoin goes from $100,000 to $90,000 on day 5 and ends at $115,000 on day 30. Compare a 10× isolated long perp ($10,000 margin, 1 BTC) with a 30-day $100,000 call bought for $5,870.
   - [ ] Both make about the same profit, because the final price is the same
   - [x] The perp loses about $10,000 (liquidated on day 5); the call makes about $9,130
   - [ ] The perp makes $15,000 and the call makes $9,130
   - [ ] Both lose money, because both were down on day 5
   > The perp touched its $90,500 liquidation price and was closed. The call was worth about $1,530 on day 5 but was not closed; at expiry it pays $15,000 − $5,870 = $9,130.
2. With baseline funding for 30 days, where do the perp and the call break even?
   - [ ] Both at $100,000
   - [ ] Perp $105,870; call $100,900
   - [ ] Perp $100,000; call $105,870
   - [x] Perp about $100,900; call about $105,870
   > Perp: \(100{,}000 \times (1 + 0.0001 \times 3 \times 30) = 100{,}900\). Call: \(K + C = 100{,}000 + 5{,}870\). The perp's cost of waiting is funding; the call's is the premium.
3. Why is higher volatility good for the call buyer but bad for the 10× perp holder?
   - [x] The call is convex, so a wider spread of outcomes raises its expected payoff; the perp's barrier is touched on more paths when volatility is higher
   - [ ] Higher volatility raises funding rates, which only perps pay
   - [ ] Higher volatility lowers the call's theta
   - [ ] Higher volatility moves the perp's liquidation price closer
   > Jensen's inequality: convex payoffs gain from uncertainty. The perp's line is unaffected, but its liquidation barrier is path-dependent, and more volatility means more touches. The liquidation price itself does not move with volatility.
4. You hold a 10× isolated long perp at $100,000 and buy a 30-day $90,000 put to “protect” it. Bitcoin falls to $85,000. What happens?
   - [ ] The put pays $5,000 and the perp's loss stops at $10,000, so you lose about $6,754 in total
   - [ ] The put prevents the liquidation
   - [x] The perp is liquidated at $90,500 first; you are left with the put, which pays only if bitcoin stays below $90,000 at expiry
   - [ ] Nothing happens until expiry, because puts and perps settle together
   > The put's floor starts at $90,000, below the 10× liquidation price. The hedge only works if the perp has enough margin to survive down to the strike, or if both share a portfolio-margined account.
5. Which statement about the cost of waiting is correct?
   - [ ] Theta and funding are the same thing measured in different units
   - [ ] Funding is always paid by longs to shorts
   - [x] Theta is always a cost to an option buyer and accelerates near expiry; funding is usually smaller day to day but can change size and sign
   - [ ] A perp has no cost of waiting because it never expires
   > The ATM call's theta goes from about −$100 a day with 30 days left to about −$527 on the last day. Funding was ≈ $30 a day at baseline, can triple in a hot market, and turns negative when shorts crowd in.

## @further
- [Deribit insights](https://insights.deribit.com/) — the largest bitcoin options venue's research and product notes, including DVOL.
- [CFTC: perpetual contracts policy statement (May 2026)](https://www.cftc.gov/PressRoom/PressReleases/pr-9242-26) — the US regulator's framework for listing perps.
- [BitMEX: announcing the perpetual XBTUSD leveraged swap (2016)](https://blog.bitmex.com/announcing-the-launch-of-the-perpetual-xbtusd-leveraged-swap/) — where the perpetual swap began.
- [Options Industry Council](https://www.optionseducation.org/) — plain-language education on listed options, including ETF options such as IBIT.
- [Satoshi Path](https://evidex-cloud.github.io/nextdawn-satoshi-path/) — the sister course on how bitcoin itself works.

## @next
Throughout this stage we judged trades by imagining many possible paths and counting outcomes. The Mastery tier begins by turning that habit into a pricing machine: simulate thousands of risk-neutral paths, average the discounted payoffs, and read off a price, with an error bar. How many paths do you need, and how do you make each one count?
