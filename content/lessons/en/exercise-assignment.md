---
id: exercise-assignment
prereqs: call-option, put-option, contract-specs, orders
demo: exercise-assignment
---

# Exercise, Assignment & Expiration Day: American, European, Cash & Physical

## @hook
At 4:00 p.m. on expiration Friday the market closes, and most beginners think the game is over. For options it is not: holders can still decide until 5:30 p.m., stock keeps trading after hours, and on Monday some accounts wake up holding 100 shares they did not expect. This lesson follows a contract through the hours that decide what it turns into.

## @bridge
In [[orders]] every position ended with a closing trade. This lesson follows the ones that are *not* closed: they are exercised, assigned or expire. It builds on the contract terms from [[contract-specs]] (American or European, physical or cash) and on [[call-option]] and [[put-option]]. It touches Idea ② (no-arbitrage tells you when exercising early can make sense) and Idea ④ (risk: assignment, pin risk and after-hours moves are where option sellers get surprised).

## @intuition
Kai's covered call is the running example: Kai owns 100 XYZ shares (bought at $100) and sold the 30-day 105 call for $0.71. Expiration Friday arrives. What happens depends on where XYZ is, and when:

<figure>
<svg viewBox="0 0 700 250" role="img" aria-label="Expiration-day timeline for an equity option">
<defs><marker id="exercise-assignment-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<line x1="30" y1="120" x2="680" y2="120" class="fx-axis" marker-end="url(#exercise-assignment-ah)"/>
<rect x="60" y="104" width="260" height="32" rx="4" class="fx-area-ok"/>
<rect x="320" y="104" width="140" height="32" rx="4" class="fx-area-bad"/>
<rect x="460" y="104" width="200" height="32" rx="4" class="fx-area-blue"/>
<circle cx="60" cy="120" r="6" class="fx-fill-ink"/><text x="60" y="94" text-anchor="middle" class="fx-t-b">9:30 a.m.</text>
<text x="60" y="160" text-anchor="middle" class="fx-t-sm">market opens</text>
<circle cx="320" cy="120" r="6" class="fx-fill-ink"/><text x="320" y="94" text-anchor="middle" class="fx-t-b">4:00 p.m.</text>
<text x="320" y="160" text-anchor="middle" class="fx-t-sm">close: last trade for most</text>
<text x="320" y="176" text-anchor="middle" class="fx-t-sm">expiring equity options</text>
<circle cx="460" cy="120" r="6" class="fx-fill-red"/><text x="460" y="94" text-anchor="middle" class="fx-t-bad">5:30 p.m. ET</text>
<text x="460" y="160" text-anchor="middle" class="fx-t-sm">holders' final exercise</text>
<text x="460" y="176" text-anchor="middle" class="fx-t-sm">decision deadline</text>
<circle cx="640" cy="120" r="6" class="fx-fill-blue"/><text x="640" y="94" text-anchor="middle" class="fx-t-blue">weekend → Monday</text>
<text x="640" y="160" text-anchor="middle" class="fx-t-sm">assignment notices;</text>
<text x="640" y="176" text-anchor="middle" class="fx-t-sm">shares settle T+1</text>
<text x="190" y="40" text-anchor="middle" class="fx-t-ok">you can still close by trading</text>
<text x="390" y="40" text-anchor="middle" class="fx-t-bad">stock trades after hours,</text>
<text x="390" y="58" text-anchor="middle" class="fx-t-bad">options mostly don't</text>
<text x="560" y="40" text-anchor="middle" class="fx-t-blue">OCC processes exercises</text>
<text x="560" y="58" text-anchor="middle" class="fx-t-blue">and assigns writers</text>
<text x="30" y="226" class="fx-t-sm">At the close, options $0.01 or more in the money are exercised automatically unless the holder instructs otherwise (OIC, 2026).</text>
</svg>
<figcaption>Figure 1 · Expiration day for a standard US equity option. The red window is the dangerous one: you can no longer trade the option, but the stock keeps moving and holders can still change their minds until 5:30 p.m. ET.</figcaption>
</figure>

> [!KAI] Three Fridays for Kai's covered call
> - **XYZ closes at $103.** The 105 call is out of the money and expires worthless. Kai keeps the shares and the \(\$71\) premium.
> - **XYZ closes at $108.** The call is \(\$3\) in the money, so it is exercised automatically. Kai is **assigned**: Kai's 100 shares are sold at $105 and \(105 \times 100 = \$10{,}500\) arrives in the account. Total result: \((105 - 100) \times 100 + 71 = \$571\), the covered call's maximum.
> - **XYZ closes at $104.95, then jumps to $106 after hours on news.** At 4:00 the call is out of the money, so it will not be exercised automatically. But its holder can still file an exercise instruction before 5:30 p.m., and a rational holder will. Kai may find the shares gone on Monday.

> [!THINK] In the third case, what does the holder gain by exercising a call that closed out of the money?
> ---
> The right to buy at $105 a stock now trading at $106: about \((106 - 105) \times 100 = \$100\) per contract, captured by selling the shares or simply keeping them. The option's closing price was based on 4:00 p.m.; the decision is made with 5:30 p.m. information. That gap is why “it closed out of the money” is not the same as “it cannot be assigned”.

Four words need to be kept apart:

- **Exercise**: the holder uses the right (buys at the strike with a call, sells at the strike with a put).
- **Assignment**: a writer is chosen to fulfil the obligation when some holder exercises.
- **Expiration**: the end of the contract's life; whatever is still open is exercised automatically or expires.
- **Settlement**: what actually changes hands: 100 shares against cash (physical) or just the difference in cash.

We'll take it in six parts:

- **① How exercise and assignment travel through the OCC**
- **② Expiration day: automatic exercise and the 5:30 deadline**
- **③ Physical vs cash settlement, and AM vs PM for SPX**
- **④ Early exercise: dividends and deep in-the-money puts**
- **⑤ Pin risk and after-hours moves**
- **⑥ State of play (2026)**

## @mechanics
### ① How exercise and assignment travel through the OCC

Every US listed option is issued and guaranteed by the Options Clearing Corporation (OCC), the central counterparty ([[derivatives]]). You never know who sold you your call, and you do not need to: the OCC stands between every buyer and every writer. Exercise follows a fixed path:

<figure>
<svg viewBox="0 0 700 200" role="img" aria-label="How an exercise notice becomes an assignment">
<defs><marker id="exercise-assignment-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="10" y="60" width="120" height="64" rx="8" class="fx-ok"/><text x="70" y="88" text-anchor="middle" class="fx-t-b">Holder</text><text x="70" y="106" text-anchor="middle" class="fx-t-sm">“exercise 1 call”</text>
<rect x="150" y="60" width="120" height="64" rx="8" class="fx-box"/><text x="210" y="88" text-anchor="middle" class="fx-t-b">Holder's broker</text><text x="210" y="106" text-anchor="middle" class="fx-t-sm">sends notice</text>
<rect x="290" y="60" width="120" height="64" rx="8" class="fx-hl"/><text x="350" y="88" text-anchor="middle" class="fx-t-b">OCC</text><text x="350" y="106" text-anchor="middle" class="fx-t-sm">picks a firm at random</text>
<rect x="430" y="60" width="120" height="64" rx="8" class="fx-box"/><text x="490" y="88" text-anchor="middle" class="fx-t-b">Writer's broker</text><text x="490" y="106" text-anchor="middle" class="fx-t-sm">random or FIFO</text>
<rect x="570" y="60" width="120" height="64" rx="8" class="fx-bad"/><text x="630" y="88" text-anchor="middle" class="fx-t-b">Writer</text><text x="630" y="106" text-anchor="middle" class="fx-t-sm">assigned: delivers</text>
<line x1="130" y1="92" x2="146" y2="92" class="fx-line" marker-end="url(#exercise-assignment-ah2)"/>
<line x1="270" y1="92" x2="286" y2="92" class="fx-line" marker-end="url(#exercise-assignment-ah2)"/>
<line x1="410" y1="92" x2="426" y2="92" class="fx-line" marker-end="url(#exercise-assignment-ah2)"/>
<line x1="550" y1="92" x2="566" y2="92" class="fx-line" marker-end="url(#exercise-assignment-ah2)"/>
<text x="350" y="160" text-anchor="middle" class="fx-t">call: writer delivers 100 shares and receives K × 100 · put: writer pays K × 100 and receives 100 shares</text>
<text x="350" y="184" text-anchor="middle" class="fx-t-sm">stock from exercise and assignment settles T+1 (since May 28, 2024)</text>
</svg>
<figcaption>Figure 2 · An exercise notice flows from the holder to the OCC, which assigns it at random to a clearing firm with a matching short position; that firm passes it to one of its customers by a random or first-in-first-out method it discloses. The writer learns about it afterwards and cannot refuse.</figcaption>
</figure>

For a physically settled equity option, exercise is simply a stock trade at the strike. Its value to the holder at expiry is the payoff you already know from [[call-option]] and [[put-option]]:

$$
\text{call: } (S_T - K) \times 100, \qquad \text{put: } (K - S_T) \times 100 \qquad \text{(when in the money)}
$$

where \(S_T\) is the stock price when the exercise is decided and \(K\) the strike. Exercise does not create this value; it converts the option into stock (or cash) worth it. For Kai's assigned call at \(S_T = 108\), the holder buys at 105 shares worth 108: \((108 - 105) \times 100 = \$300\), which is exactly what Kai gave up above the strike.

**American** options (almost all US stock and ETF options) can be exercised on any business day before expiry, so their writers can be assigned on any day. **European** options (SPX, XSP and most index options) can only be exercised at expiry, so there is no early assignment.

### ② Expiration day: automatic exercise and the 5:30 deadline

At expiry the OCC applies **exercise by exception**: expiring options that are **$0.01 or more in the money** are exercised automatically for customer accounts (and for all accounts in index options), unless the holder's broker submits contrary instructions. For expiring equity options, holders' final exercise decisions are due by **5:30 p.m. ET** on expiration day (as of 2026, per the OIC). Brokers often set their own, earlier cut-off for customer instructions.

> [!WARN] A long option that finishes one cent in the money becomes a stock position
> Suppose Kai held the 100 call to expiry and XYZ closed at $100.02. The call is worth about \(\$2\), but it is exercised automatically: Kai now owes \(100 \times 100 = \$10{,}000\) for 100 shares. If the account cannot pay, the broker may act for Kai (for example by selling the shares). And over the weekend those shares carry the stock's full risk: a $3 gap down on Monday costs \(\$300\), far more than the \(\$2\) the option was worth. The “most I can lose is the premium” rule stops applying once the option turns into stock.

A holder who does *not* want an in-the-money option exercised (say, because the tiny intrinsic value is less than the commissions, or the cash is not there) can file a do-not-exercise instruction; one who wants an out-of-the-money option exercised (as in Kai's after-hours case) can file an exercise instruction. Both must reach the broker before its cut-off.

### ③ Physical vs cash settlement, and AM vs PM for SPX

**Physical settlement** delivers the underlying: 100 shares of a stock or ETF (SPY, QQQ, IWM, IBIT options are all American and physically settled). **Cash settlement** pays the difference in money, because an index cannot be delivered:

$$
\text{cash to the holder} = 100 \times \max\left(S_{\text{set}} - K,\ 0\right) \ \text{(call)}, \qquad 100 \times \max\left(K - S_{\text{set}},\ 0\right) \ \text{(put)}
$$

where \(S_{\text{set}}\) is the official settlement value of the index and 100 is the SPX multiplier (dollars per index point).

> [!EXAMPLE] An SPX call settles in cash (illustrative levels)
> An SPX 7,700 call with a settlement value of 7,742.50 pays \(100 \times (7{,}742.50 - 7{,}700) = \$4{,}250\) into the holder's account, taken from the assigned writer. No shares move.

Which index value counts matters. **Standard third-Friday SPX options are AM-settled**: their settlement value is the Special Opening Quotation (SOQ, ticker SET), built from the opening prices of the index's stocks on expiration morning. **SPX Weeklys (SPXW), including 0DTE, are PM-settled** at the close (Cboe VIX methodology). So a trader watching Thursday's 4:00 p.m. close of 7,720 on an AM-settled 7,700 call can see it settle at zero if Friday's opening prints produce an SOQ of 7,650. The product details are mapped in [[product-map]].

### ④ Early exercise: dividends and deep in-the-money puts

Exercising an American call early on a stock that pays no dividend throws money away: exercise gives you only the intrinsic value, while selling the option gives intrinsic plus time value. With XYZ at $104 and 20 days left, the 100 call is worth about $4.71; exercising captures \(\$4\), selling captures \(\$4.71\). There are two standard exceptions (OIC).

**Calls just before an ex-dividend date.** A shareholder on the ex-date receives the dividend \(D\); a call holder does not, and the stock drops by about \(D\). Exercising the day before swaps the call's remaining time value for the dividend. A good approximation of that remaining time value (from put-call parity, [[put-call-parity]]) is

$$
\text{time value left} \approx P\big(S - D,\,K,\,\tau\big) + K\left(1 - e^{-r\tau}\right)
$$

where \(P(S - D, K, \tau)\) is the same-strike put's value once the stock has dropped by the dividend, \(\tau\) the time from the ex-date to expiry, and \(K(1 - e^{-r\tau})\) the interest you give up by paying the strike early. Exercise tends to pay when \(D\) is larger than this.

> [!EXAMPLE] A hypothetical $1.00 dividend on XYZ
> Suppose XYZ goes ex-dividend tomorrow with \(D = \$1.00\) and 30 days left.
> Deep in-the-money 90 call: \(P(99, 90, 30\text{ days}) \approx 0.09\) and \(90 \times (1 - e^{-0.04 \times 30/365}) \approx 0.30\), so about \(0.39 < 1.00\): **exercise pays**, and writers of this call should expect assignment tonight.
> At-the-money 100 call: \(P(99, 100, 30\text{ days}) \approx 2.62\) plus \(0.33\), about \(2.95 > 1.00\): **keep the call**; exercising would throw away about $1.95 per share.

::demo[exercise-assignment-dividend]

> [!DEEP] Merton's necessary condition
> The put term is never negative, so a necessary condition for early exercise just before the ex-date is \(D > K\left(1 - e^{-r\tau}\right)\): the dividend must at least beat the interest on the strike. Without dividends this can never hold, which is Merton's (1973) result that an American call on a non-dividend-paying stock is worth the same as a European one. The full early-exercise boundary is computed with trees in [[american-exercise]].

**Deep in-the-money puts.** A put holder who exercises receives \(K\) in cash now instead of at expiry, and can earn interest on it. When the put is so deep that its remaining time value is smaller than that interest, exercising early wins. With XYZ at $100, a 30-day 120 put has intrinsic value \(\$20\) but a European value of only about \(\$19.61\); the interest on \(\$12{,}000\) for 30 days, \(120 \times (1 - e^{-0.04 \times 30/365}) \approx 0.39\) per share, outweighs what is left of its optionality. An American holder exercises at once. Rates matter here, which is why [[rho-carry]] returns to it.

### ⑤ Pin risk and after-hours moves

**Pin risk** is the uncertainty a writer faces when the stock closes very near the strike at expiry. If XYZ closes at $105.01, Kai's 105 call is technically in the money and likely to be exercised; at $104.99 it likely expires; but holders decide with after-hours information, and some exercise or abandon for their own reasons. Kai cannot know until the assignment notice arrives whether Monday starts with or without 100 shares.

The risk runs both ways:

- **Short options**: a call that closed just out of the money can still be exercised after an after-hours jump (Kai's third Friday). For a covered call that means giving up the shares at the strike; for an *uncovered* short call it means waking up short 100 shares.
- **Long options**: a call that closed just in the money is exercised automatically, and bad news over the weekend lands on a stock position (the WARN above).

Common ways traders handle it are closing positions near the strike before the close, filing explicit instructions, and knowing their broker's cut-off. Early assignment ahead of dividends, weekend gaps and similar surprises are collected in [[common-traps]].

### ⑥ State of play (2026)

> [!FACT] The mechanics as of September 2026
> - The OCC is the issuer and guarantor of every US listed option; exercise by exception applies to options **$0.01 or more** in the money (OIC).
> - Holders' final exercise decisions for expiring equity options are due by **5:30 p.m. ET** (OIC); brokers may set earlier cut-offs.
> - US securities settlement moved from T+2 to **T+1 on May 28, 2024**, so stock delivered by exercise or assignment now settles the next business day; option premiums already settled next day.
> - SPX lists an expiry **every weekday** (Tuesday and Thursday were added in April–May 2022), so for SPXW traders every day is expiration day, cash-settled at the close ([[zero-dte]]).

Exercise and assignment fees vary by broker. Extended trading sessions are spreading (SPX options trade nearly around the clock on weekdays, and pre- and post-market sessions for about 20 single-stock option classes were scheduled to launch on July 13, 2026), but the core lesson has not changed: **the moment that decides an option's fate is not always the moment you are watching.**

## @analogy
Think of an option as a **reservation voucher at a car-rental chain** that lets the holder buy a particular car model at a fixed price. The chain (the OCC) has issued thousands of these vouchers through many branches, and every voucher is backed by some branch that promised to supply a car.

When a holder hands in a voucher (exercise), head office does not look up who originally wrote it; it picks a branch at random, and that branch picks one of its promise-makers, at random or first-in-first-out (assignment). The branch cannot say no.

European vouchers can only be redeemed on the final day; American ones on any day, so their writers must always be ready. A physical voucher hands over the car; a cash voucher pays the difference between the car's value and the voucher price. And if the voucher is worth even a cent on the last day, the chain redeems it automatically unless the holder says otherwise, with a short grace period after the showroom closes during which the car's price can still change.

Where the analogy breaks: a car's price does not jump overnight on a press release, and nobody's rental agreement is automatically turned into a car they must pay for by Monday. Options do both.

## @misconceptions
- **“If my short option closes out of the money, it can't be assigned.”** — Holders decide until 5:30 p.m. ET with after-hours information and can exercise an option that closed slightly out of the money.
- **“My long option can never cost me more than the premium.”** — Its option P&L can't, but an option that finishes a cent in the money is exercised automatically into 100 shares (or a short of 100), with the stock's full weekend risk and the cash to pay for it.
- **“American options are exercised early all the time.”** — Early exercise usually throws away time value, so it is rare; the main cases are calls just before an ex-dividend date and deep in-the-money puts.
- **“Assignment goes to whoever sold first.”** — The OCC assigns clearing firms at random; firms allocate to customers by random or first-in-first-out methods they disclose. Any writer can be picked.
- **“SPX options settle at Friday's close.”** — SPX Weeklys (including 0DTE) do; standard third-Friday SPX options are AM-settled on the Special Opening Quotation from Friday's opening prices.

## @takeaways
- Exercise is the holder's choice; assignment is the writer's obligation, allocated at random through the OCC; settlement is what changes hands.
- At expiry, options $0.01 or more in the money are exercised automatically; holders can still decide until 5:30 p.m. ET, so after-hours moves matter.
- Physical settlement delivers 100 shares (settling T+1); cash settlement pays \(100 \times\) the in-the-money amount; standard SPX is AM-settled, SPXW PM-settled.
- Early exercise is rare and rational in two cases: calls when the dividend exceeds \(P + K(1 - e^{-r\tau})\), and deep puts when interest on \(K\) beats the remaining time value.

## @quiz
1. Kai holds one XYZ 105 call to expiry, and XYZ closes at $105.01. Kai gives no instructions. What happens?
   - [ ] It expires worthless because the in-the-money amount is too small
   - [ ] The broker sells it at the close for about $1
   - [x] It is exercised automatically: Kai buys 100 shares at $105 and needs $10,500 in the account
   - [ ] Kai receives $1 in cash
   > Exercise by exception applies to options $0.01 or more in the money. A physically settled call turns into 100 shares at the strike, and the account must pay \(105 \times 100 = \$10{,}500\).
2. A holder of an XYZ call exercises it on a Tuesday, two weeks before expiry. Who delivers the shares?
   - [ ] The person who originally sold that holder the call
   - [ ] The writer who has held a short call the longest, across all brokers
   - [ ] The market maker with the largest position
   - [x] A writer chosen through the OCC's random assignment to a clearing firm, which then allocates to a customer by random or FIFO method
   > The OCC breaks the link between buyer and seller. It assigns clearing firms at random, and each firm uses its disclosed method to pick a customer with a matching short position.
3. XYZ goes ex-dividend tomorrow with a $1.00 dividend. A deep in-the-money 90 call has about 0.39 of time value left after the dividend. What is the most likely outcome for writers of this call?
   - [ ] Nothing; American calls are never exercised before expiry
   - [x] Many holders exercise today to capture the dividend, so writers are likely to be assigned tonight
   - [ ] The strike is automatically reduced by the dividend
   - [ ] The holders sell the calls and the writers are unaffected
   > When \(D = 1.00\) exceeds the time value left (\(\approx 0.39\)), exercising before the ex-date is worth about \(\$61\) per contract to a holder. Covered-call writers lose the shares and the dividend.
4. An AM-settled SPX 7,700 call (standard third Friday): the index closes Thursday at 7,720, and the Special Opening Quotation on Friday morning comes out at 7,650. What does the call pay?
   - [ ] \(\$2{,}000\), based on Thursday's close
   - [ ] \(\$5{,}000\), based on the difference between 7,720 and 7,650
   - [ ] It is exercised into 100 shares of each index stock
   - [x] Nothing: it settles at 7,650, below the strike
   > Standard monthly SPX options settle on the SOQ from Friday's opening prices, not on Thursday's close. At 7,650 the 7,700 call is out of the money and pays zero; SPX is cash-settled, so no shares move.
5. XYZ is at $104 with 20 days left and no dividend. Kai's 100 call is worth about $4.71. Why would exercising it now be a mistake?
   - [ ] Exercise is not allowed before expiry for American options
   - [ ] Exercising would trigger an automatic assignment on Kai
   - [ ] The call's value will certainly rise if Kai waits
   - [x] Exercising captures only the $4 of intrinsic value, while selling the call captures $4.71
   > Early exercise discards the time value (\(4.71 - 4 = 0.71\) per share, \(\$71\) per contract). Without a dividend to capture, a call holder who wants out should sell the option, not exercise it.

## @further
- [Options exercise FAQ (OIC)](https://www.optionseducation.org/referencelibrary/faq/options-exercise) — exercise by exception, the 5:30 p.m. deadline and early exercise, from the industry's education body.
- [Understanding the T+1 conversion (OIC)](https://www.optionseducation.org/news/understanding-t-1-conversion) — what the move to next-day settlement changed for options.
- [Characteristics and Risks of Standardized Options (OCC)](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — the official rules on exercise, assignment and settlement.
- [Cboe VIX methodology (PDF)](https://cdn.cboe.com/resources/vix/VIX_Methodology.pdf) — among other things, confirms AM-settled standard SPX and PM-settled SPX Weeklys.

## @next
Kai's covered call never needed cash because the shares covered it. But what if Kai wanted to sell a put, or a call without owning the stock? Brokers then ask two questions: are you approved for it, and how much of your account must be set aside? The next lesson is about margin and approval levels.
