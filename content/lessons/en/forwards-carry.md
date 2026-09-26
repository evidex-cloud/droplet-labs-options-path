---
id: forwards-carry
prereqs: derivatives, price-drivers, arbitrage-bounds
demo: forwards-carry
---

# Forward Price & Cost of Carry: The Anchor of Option Pricing

## @hook
What is the fair price, agreed today, for a share of XYZ delivered in one year? Not $100, and not what you think XYZ will be worth. It is $104.08 — exactly what it costs to buy the share now and carry it for a year. Any other price hands someone a riskless profit. That number, the forward, is the true centre of the option world.

## @bridge
[[derivatives]] introduced the forward contract as a way to lock in a price. [[price-drivers]] found that rates and dividends move option prices through the forward, and [[arbitrage-bounds]] kept running into the present value of the strike, \(Ke^{-rT}\). This lesson prices the forward itself — the simplest instrument that no-arbitrage prices *exactly* — and sets up the next lesson, [[put-call-parity]], where options and forwards meet. It builds Idea ② — no-arbitrage: the price of anything you can replicate is the cost of replicating it.

## @intuition
Kai's friend makes an offer: "In one year I'll sell you one share of XYZ. Name the price now; we both sign." XYZ trades at $100 today and cash earns 4% a year. What price is fair?

Your first instinct may be your *forecast*. If you think XYZ will be $120 in a year, surely the price should be near $120? It shouldn't, and here is why. There are two ways for Kai to end up owning one share of XYZ in a year:

1. **Buy it now.** Borrow $100 at 4%, buy the share today, and hold it. In a year Kai owes \(100\,e^{0.04} = \$104.08\) on the loan and owns the share.
2. **Sign the forward.** Pay nothing now, pay the agreed price \(F\) in a year, receive the share.

Both routes end in the same place: one share in hand, one payment made in a year. So they must cost the same: \(F = \$104.08\). The forecast never entered. The stock's future price is uncertain, but the cost of *carrying* the stock for a year is not.

> [!KAI] What if Kai is sure XYZ will hit $120?
> Suppose the friend agrees to $120 because they share Kai's optimism. Now anyone can play the friend's role and win for sure: sell the forward at $120, borrow $100, buy a share today. In a year, deliver the share, receive $120, repay $104.08, and keep \(120 - 104.08 = \$15.92\) — whatever XYZ is doing. Opinions about XYZ move the stock's price *today*; they don't change the cost of carrying it.

This trade has a name: **cash-and-carry** (buy the asset with borrowed cash, carry it, deliver it into a forward sale). Its mirror image, the **reverse cash-and-carry**, shorts the asset and lends the proceeds. Between them, they squeeze the forward to one price.

<figure>
<svg viewBox="0 0 660 260" role="img" aria-label="Cash-and-carry cash flows today and at expiry">
<defs><marker id="forwards-carry-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<text x="150" y="26" text-anchor="middle" class="fx-t-b">Today (t = 0)</text>
<text x="500" y="26" text-anchor="middle" class="fx-t-b">In one year (T = 1)</text>
<rect x="30" y="42" width="240" height="44" rx="8" class="fx-box"/>
<text x="150" y="61" text-anchor="middle" class="fx-t">borrow from the bank</text>
<text x="150" y="78" text-anchor="middle" class="fx-t-ok">+100.00</text>
<rect x="30" y="98" width="240" height="44" rx="8" class="fx-box"/>
<text x="150" y="117" text-anchor="middle" class="fx-t">buy one XYZ share</text>
<text x="150" y="134" text-anchor="middle" class="fx-t-bad">−100.00</text>
<rect x="30" y="154" width="240" height="44" rx="8" class="fx-box2"/>
<text x="150" y="173" text-anchor="middle" class="fx-t">sell the forward at F</text>
<text x="150" y="190" text-anchor="middle" class="fx-t-sm">no cash changes hands</text>
<rect x="380" y="42" width="240" height="44" rx="8" class="fx-box"/>
<text x="500" y="61" text-anchor="middle" class="fx-t">repay the loan with interest</text>
<text x="500" y="78" text-anchor="middle" class="fx-t-bad">−104.08</text>
<rect x="380" y="98" width="240" height="44" rx="8" class="fx-box"/>
<text x="500" y="117" text-anchor="middle" class="fx-t">deliver the share</text>
<text x="500" y="134" text-anchor="middle" class="fx-t-sm">whatever XYZ is worth</text>
<rect x="380" y="154" width="240" height="44" rx="8" class="fx-box2"/>
<text x="500" y="173" text-anchor="middle" class="fx-t">receive the forward price</text>
<text x="500" y="190" text-anchor="middle" class="fx-t-ok">+F</text>
<line x1="275" y1="64" x2="372" y2="64" class="fx-line" marker-end="url(#forwards-carry-ah)"/>
<line x1="275" y1="120" x2="372" y2="120" class="fx-line" marker-end="url(#forwards-carry-ah)"/>
<line x1="275" y1="176" x2="372" y2="176" class="fx-line" marker-end="url(#forwards-carry-ah)"/>
<text x="150" y="228" text-anchor="middle" class="fx-t-b">net today: 0</text>
<text x="500" y="228" text-anchor="middle" class="fx-t-hl">net in a year: F − 104.08</text>
<text x="330" y="252" text-anchor="middle" class="fx-t-sm">no risk and no money down, so the only fair F is 104.08 (XYZ at 100, r = 4%)</text>
</svg>
<figcaption>Figure 1 · The cash-and-carry. Every cash flow is known today except the share's value in a year — and the share is simply handed over, so its value never matters. If \(F > 104.08\), this trade earns \(F - 104.08\) for nothing; if \(F \lt 104.08\), the reverse trade (short the share, lend the cash, buy the forward) does.</figcaption>
</figure>

Two more things make the forward matter for options. First, **dividends and borrowing fees change it**: if XYZ pays dividends, the buyer who carries the share collects them, so the forward is lower. Second, **options are really written on the forward**. A call is the right to buy at \(K\) at expiry; the natural question is whether \(K\) is above or below where the stock is priced *for delivery at expiry* — that's \(F\), not \(S\).

We'll take it in five parts:

- **① Pricing a forward by replication**, with both arbitrages worked out
- **② The cost of carry**: interest, dividends, borrow fees, storage
- **③ Discrete dividends**
- **④ The forward is the centre of the option world**
- **⑤ Futures, basis and the real-world band**

## @mechanics
### ① Pricing a forward by replication

With no dividends and a continuously compounded rate \(r\):

$$
F = S\,e^{rT}
$$

where \(F\) is the forward price for delivery in \(T\) years, \(S\) the spot price today and \(e^{rT}\) the growth of $1 at rate \(r\) over \(T\) years. XYZ: \(F = 100\,e^{0.04} = \$104.08\) for one year and \(100\,e^{0.04 \times 30/365} = \$100.33\) for 30 days.

Replication gives the price; arbitrage enforces it from both sides.

> [!EXAMPLE] Worked arbitrages on a mispriced 1-year forward
> **Forward quoted at $106 (too high) — cash-and-carry:**
>
> | | Today | In one year |
> |---|---|---|
> | Borrow $100 | +100.00 | −104.08 |
> | Buy one share | −100.00 | deliver it |
> | Sell the forward at 106 | 0 | +106.00 |
> | **Net** | **0** | **+1.92** |
>
> **Forward quoted at $102 (too low) — reverse cash-and-carry:**
>
> | | Today | In one year |
> |---|---|---|
> | Short one share | +100.00 | return it |
> | Lend $100 | −100.00 | +104.08 |
> | Buy the forward at 102 | 0 | −102.00, receive the share |
> | **Net** | **0** | **+2.08** |
>
> Per 100 shares: $192 and $208, with no money down and no exposure to XYZ. Today's value of the first gain is \(1.92\,e^{-0.04} = \$1.84\).

The forward price is **not a forecast**. If investors expect XYZ to return 10% a year, the *expected* price in a year is about $110, yet the forward is $104.08. The gap is the equity risk premium — the reward for bearing XYZ's risk — and the forward doesn't include it, because the forward can be built without bearing any risk. This is the first appearance of an idea that will become [[risk-neutral]] pricing.

### ② The cost of carry

Holding an asset from now until delivery costs something (financing, storage) and may pay something (dividends, lease income). The forward is the spot price grown at the **net cost of carry**:

$$
F = S\,e^{(r - q)T}
$$

where \(q\) is the income yield of holding the asset — for a stock, its continuous dividend yield. The carrier borrows at \(r\) but collects \(q\), so only the net \(r - q\) accrues.

| What carrying XYZ involves | Effect on the forward | XYZ, 1 year |
|---|---|---|
| financing at \(r = 4\%\) | raises F | \(100\,e^{0.04} = 104.08\) |
| dividend yield \(q = 2\%\) | lowers F | \(100\,e^{0.02} = 102.02\) |
| hard to borrow: lender's fee \(b = 10\%\) | lowers F (see below) | \(100\,e^{(0.04 - 0.10)} = 94.18\) |
| commodity storage \(u\), convenience yield \(y\) | \(F = Se^{(r + u - y)T}\) | — |

The **borrow fee** deserves a word. The reverse cash-and-carry needs a *short sale*, and to short a share you must borrow it from someone who charges a fee. For most large stocks the fee is tiny. For a heavily shorted, "hard-to-borrow" stock it can be large. The arbitrage that pulls a too-low forward back up then costs the fee, so the forward can sit below \(Se^{(r-q)T}\) by about the fee — a stock's borrow cost behaves exactly like an extra dividend yield. This is the source of the rich puts and cheap calls on hard-to-borrow names that [[put-call-parity]] will decode.

> [!DEEP] Carry across asset classes
> The same formula prices every forward once you name the carry. **Currencies:** the "dividend" is the foreign interest rate, \(F = Se^{(r_{\text{dom}} - r_{\text{for}})T}\) — covered interest parity. **Commodities:** storage costs add to carry, while the **convenience yield** — the benefit of physically holding oil or copper when it is scarce — subtracts; a large convenience yield produces *backwardation*, forward prices below spot. **Bitcoin:** there is no dividend or storage fee to speak of, so a futures basis well above the interest rate reflects demand for leveraged longs rather than carry ([[futures-basis]], [[basis-trades]]).

### ③ Discrete dividends

Real stocks pay dividends in lumps on known dates, not as a smooth yield. The replication adjusts naturally: the carrier receives each dividend and can use it to repay part of the loan. So subtract the present value of the dividends from the spot, then grow the rest:

$$
F = \big(S - \mathrm{PV}(D)\big)\,e^{rT}, \qquad \mathrm{PV}(D) = \sum_i D_i\,e^{-r t_i}
$$

where \(D_i\) is the dividend paid at time \(t_i\) (in years, before expiry \(T\)), and \(\mathrm{PV}(D)\) is today's value of all dividends paid before delivery.

> [!EXAMPLE] XYZ pays $1 in six months
> \(\mathrm{PV}(D) = 1 \times e^{-0.04 \times 0.5} = 0.9802\). Then
> $$
> F = (100 - 0.9802)\,e^{0.04} = 99.0198 \times 1.0408 = \$103.06
> $$
> Same answer from the other direction: carry costs \(100\,e^{0.04} = 104.08\); the $1 dividend, reinvested at 4% for the last six months, returns \(1 \times e^{0.02} = 1.02\); \(104.08 - 1.02 = 103.06\).
> As a yield, this dividend is worth about \(q \approx 0.99\%\) a year: \(100\,e^{(0.04 - 0.0099)} \approx 103.06\).

<figure>
<svg viewBox="0 0 660 250" role="img" aria-label="Waterfall from spot to forward price">
<line x1="60" y1="210" x2="620" y2="210" class="fx-axis"/>
<line x1="60" y1="128.2" x2="620" y2="128.2" class="fx-grid"/>
<rect x="80" y="128.2" width="90" height="81.8" rx="3" class="fx-box2"/>
<rect x="210" y="61.4" width="90" height="66.8" rx="3" class="fx-ok"/>
<rect x="340" y="61.4" width="90" height="16.7" rx="3" class="fx-bad"/>
<rect x="470" y="78.1" width="90" height="131.9" rx="3" class="fx-hl"/>
<line x1="170" y1="128.2" x2="210" y2="128.2" class="fx-line fx-dash"/>
<line x1="300" y1="61.4" x2="340" y2="61.4" class="fx-line fx-dash"/>
<line x1="430" y1="78.1" x2="470" y2="78.1" class="fx-line fx-dash"/>
<text x="125" y="120" text-anchor="middle" class="fx-t-b">100.00</text>
<text x="255" y="53" text-anchor="middle" class="fx-t-ok">+4.08</text>
<text x="385" y="53" text-anchor="middle" class="fx-t-bad">−1.02</text>
<text x="515" y="70" text-anchor="middle" class="fx-t-hl">103.06</text>
<text x="125" y="228" text-anchor="middle" class="fx-t">spot S</text>
<text x="255" y="228" text-anchor="middle" class="fx-t">interest on 100</text>
<text x="385" y="228" text-anchor="middle" class="fx-t">dividend + its interest</text>
<text x="515" y="228" text-anchor="middle" class="fx-t">1-year forward F</text>
<text x="56" y="214" text-anchor="end" class="fx-t-sm">95</text>
<text x="56" y="132" text-anchor="end" class="fx-t-sm">100</text>
<text x="620" y="246" text-anchor="end" class="fx-t-sm">axis starts at 95 · XYZ, r = 4%, $1 dividend in 6 months</text>
</svg>
<figcaption>Figure 2 · The forward as a waterfall: start from today's price, add the interest you pay to carry the share, subtract the dividend you collect along the way (plus the interest it earns). Everything on this chart is known today — nothing depends on where XYZ goes.</figcaption>
</figure>

The widget below lets you place up to two dividends anywhere before expiry and compare the exact forward with the smooth-yield approximation.

::demo[forwards-carry-divs]

Why care about the difference? Around a big dividend the forward *jumps*: a 30-day forward that expires the day before the ex-dividend date includes no dividend, while one that expires the day after subtracts the whole amount. Option prices on either side of an ex-date behave accordingly, which matters for early exercise of American calls ([[exercise-assignment]]).

### ④ The forward is the centre of the option world

Options expire at \(T\), and the forward is the price, agreed today, for the stock *at* \(T\). So strikes are naturally measured against \(F\), not \(S\).

- **At-the-money forward (ATMF).** The strike equal to the forward is special: with no dividends, the call and put at \(K = F\) cost exactly the same. For XYZ at one year, \(K = 104.08\): call $7.97, put $7.97.
- **"At the money" is ambiguous.** The 1-year 100-strike call ($9.93) costs much more than the 100 put ($6.00) even though XYZ sits exactly at $100. Measured against the forward, the 100 strike is \(4.08\) *below* where the stock is priced for delivery: the call is in the money forward.
- **Rates and dividends act only through \(F\).** Give Black-Scholes the forward and the discount factor and it no longer needs \(S\), \(r\) or \(q\) separately. That version — the **Black-76** formula for options on forwards and futures — is how futures options and much of the professional world quote.

> [!THINK] XYZ's 1-year 100 call costs $9.93 and the 100 put $6.00. Without looking below, what forward price do these two quotes imply?
> Hint: which strike would make the call and the put cost the same?
> ---
> About $104.08. With no dividends, \(C - P = S - Ke^{-rT}\), so \(F = K + e^{rT}(C - P) = 100 + e^{0.04} \times 3.921 \approx 104.08\) (with the unrounded gap; the rounded quotes differ by 3.93). Traders run this in reverse on real chains: the call-minus-put gap at each strike reveals the forward the market is using, dividends and borrow costs included. The next lesson derives the formula.

### ⑤ Futures, basis and the real-world band

A **futures** contract is a forward that trades on an exchange with standardised terms and **daily margining**: gains and losses are settled in cash every day through a clearing house ([[derivatives]]). For most purposes its price obeys the same carry formula. The difference between the two is the **basis**:

$$
\text{basis} = F - S
$$

where \(F\) is the futures or forward price and \(S\) the spot price. For XYZ at one year the basis is \(104.08 - 100 = \$4.08\), about 4% — exactly the carry. As expiry approaches, the carry shrinks and the basis goes to zero: the futures price **converges** to spot at delivery. Annualised basis compared with interest rates is how traders spot rich or cheap futures; [[futures-basis]] develops this for index and bitcoin futures.

In practice the forward is a narrow band rather than a single number:

- **Borrowing costs more than lending.** An arbitrageur who borrows at 5% but lends at 4% can only enforce \(F\) within \([100\,e^{0.04},\ 100\,e^{0.05}] = [104.08,\ 105.13]\) at one year.
- **Short-sale frictions** (borrow fees, recall risk) widen the lower side.
- **Bid-ask spreads and dividend uncertainty** add a little on both sides.

> [!WARN] Carry trades are not free of risk in real life
> On paper cash-and-carry is riskless. In practice it relies on financing that must stay available, a short that must not be recalled, margin that must be posted daily on the futures leg, and a counterparty that must pay. When funding markets seize up, basis trades can lose money before they converge — a theme in [[basis-trades]].

## @analogy
The forward price is like the price of **a bag of rice you agree to buy from the shop in a year**.

The shop could simply buy the rice today for $100, keep it in its storeroom, and hand it to you in a year. What does that cost the shop? The $100 it could have kept in the bank (and the interest it gives up), plus the cost of the storeroom, minus anything the rice earns while it sits there (nothing, for rice; dividends, for a share). Add it up and you have the fair price for delivery in a year. It doesn't matter whether the shopkeeper thinks rice will be scarce next year: they aren't guessing, they're **carrying**. If you offered much more than the carry cost, every shop in town would sign your contract, buy rice today and pocket the difference; if you offered much less, you'd have no takers — and a trader with rice to spare could sell it now, lend the money, and buy it back through you more cheaply.

The analogy breaks at shorting: you can't easily "borrow" a bag of rice to sell it now, so a rice forward can drift below its carry cost when rice is scarce — that is the convenience yield. Shares can be borrowed and sold short, which is why stock forwards stick so closely to \(Se^{(r-q)T}\).

## @misconceptions
- **"The forward price is the market's forecast of the future price."** — The forward is the cost of carry. The expected future price also includes a risk premium; at one year XYZ's forward is $104.08 whatever investors expect it to return.
- **"If a forward trades above spot, the market expects the price to rise."** — It trades above spot because carrying the stock costs interest. With a high dividend yield or borrow fee, the forward sits below spot — no bearish forecast required.
- **"At the money means strike equals spot."** — For pricing, the meaningful centre is the forward. The 1-year 100 call costs $9.93 and the put $6.00 at \(S = 100\); at the forward strike 104.08 they both cost $7.97.
- **"Dividends don't affect options because option holders don't receive them."** — That is exactly why they do: they lower the forward, making calls cheaper and puts dearer.
- **"Cash-and-carry is always riskless."** — Only with guaranteed financing, a stable stock borrow and no margin stress. Those frictions give the real forward a band, and occasionally the band breaks.

## @takeaways
- A forward is priced by replication: buy the asset now with borrowed money and carry it, so \(F = Se^{(r-q)T}\). XYZ: $104.08 at one year, $100.33 at 30 days.
- A forward above the carry value invites cash-and-carry (borrow, buy, sell forward); one below invites the reverse (short, lend, buy forward).
- The cost of carry is financing minus income: interest raises the forward; dividends, borrow fees and convenience yields lower it. Discrete dividends enter as \(F = (S - \mathrm{PV}(D))e^{rT}\).
- The forward, not the spot, is the centre of the option world: at the forward strike, call and put cost the same, and rates and dividends affect options only through \(F\).
- In practice the forward lives in a narrow band set by borrowing versus lending rates, borrow costs and spreads.

## @quiz
1. XYZ trades at $100, the interest rate is 4%, no dividends. Kai is sure XYZ will be worth $120 in a year. What is the fair 1-year forward price?
   - [ ] $120, because that is Kai's expected price
   - [ ] $100, because that is today's price
   - [x] About $104.08, the cost of buying today and carrying the share for a year
   - [ ] $110, the average of today's price and the forecast
   > The forward is set by replication: borrow $100, buy the share, owe \(100\,e^{0.04} = 104.08\) in a year. Any other forward price allows a riskless carry trade; Kai's forecast never enters.
2. The 1-year XYZ forward is quoted at $102 while its carry value is $104.08. Which trade earns the difference?
   - [ ] Borrow $100, buy a share, sell the forward
   - [x] Short a share, lend the $100, buy the forward
   - [ ] Buy the forward and wait for XYZ to rise
   - [ ] Sell the forward and short the share
   > The forward is too cheap, so buy it and sell the "expensive" route — owning the stock via a short sale, whose proceeds are lent at 4%. In a year: receive 104.08, pay 102 for the share, return it: +2.08.
3. Which change *lowers* XYZ's forward price, everything else equal?
   - [ ] A rise in the interest rate
   - [ ] A longer time to delivery
   - [ ] A higher forecast for XYZ's earnings
   - [x] A higher dividend yield or a higher fee to borrow the stock
   > The carrier collects dividends, and a short seller pays the borrow fee; both reduce the net cost of carry \(r - q\). Rates and time raise the forward; forecasts don't enter.
4. XYZ will pay a $1 dividend in six months. What is the 1-year forward price (r = 4%)?
   - [x] About $103.06
   - [ ] $104.08
   - [ ] $103.08
   - [ ] $105.10
   > \(F = (100 - e^{-0.02})\,e^{0.04} = 99.0198 \times 1.0408 \approx 103.06\). Equivalently, \(104.08\) of carry minus the dividend plus six months of interest on it (\(1.02\)). 103.08 would forget that interest.
5. XYZ's 1-year 100 call costs $9.93 and the 100 put $6.00, with XYZ at exactly $100. Why is the call dearer?
   - [ ] Because calls are always more expensive than puts
   - [x] Because the strike of 100 is below the 1-year forward of 104.08, so the call is in the money relative to the forward
   - [ ] Because the market expects XYZ to rise
   - [ ] Because volatility affects calls more than puts
   > Options are centred on the forward. At \(K = F = 104.08\) the call and put would both cost $7.97. The gap at \(K = 100\) is pure carry, not a forecast.

## @further
- [Forward price — Wikipedia](https://en.wikipedia.org/wiki/Forward_price) — the replication argument and the cost-of-carry formula with dividends and storage.
- [Cost of carry — Wikipedia](https://en.wikipedia.org/wiki/Cost_of_carry) — carry across stocks, currencies and commodities.
- [CME Group education](https://www.cmegroup.com/education.html) — how exchange-traded futures, margining and basis work in practice.
- [Merton (1973), Theory of Rational Option Pricing](https://doi.org/10.2307/3003143) — shows how no-arbitrage arguments treat dividends and the forward.
- [New Finance Path (sister course)](https://evidex-cloud.github.io/droplet-labs-finance-path/) — interest rates, discounting and the time value of money from first principles.

## @next
We can now price a stock for delivery in a year. A call minus a put, same strike and expiry, turns out to be exactly that: a forward purchase at the strike. The next lesson turns that observation into put-call parity — the conservation law that ties calls, puts, stock and cash together to the cent.
