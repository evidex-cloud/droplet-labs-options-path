---
id: broker-platform
prereqs: margin-approval, liquidity-spreads, orders, product-map
demo: broker-platform
---

# Choosing a Broker & Trading Platform

## @hook
Every lesson so far becomes real only inside a brokerage account. Choose that account by what you will trade, not by the color of the app: the permissions it grants, what a round trip really costs, the tools and products it offers, and the rules it enforces. Then rehearse in paper trading before any real money moves.

## @bridge
[[margin-approval]] showed that brokers gate options by approval level and account type. [[liquidity-spreads]] and [[orders]] showed that the spread and your limit price usually cost more than the commission. This lesson turns those pieces into a checklist for picking a platform, and it builds Idea ④ (risk): the account's rules decide which risks you are allowed to take and what happens when something goes wrong. No broker is recommended here — the goal is to know what to ask. The next lessons use the account: [[first-trade]] walks one real trade end to end and [[python-pricing]] connects code to the same numbers.

## @intuition
Start with what Kai actually wants to do. Kai owns 100 shares of XYZ at $100 and has three wishes: **protect** the shares, **earn income** while waiting, and perhaps later **bet on a big move with a capped loss**. Each wish needs a different permission from the broker:

- **Earn income** → sell the 30-day 105 call against the shares (a covered call, [[covered-call]]). Brokers call this *covered writing*.
- **Protect** → buy the 30-day 95 put for $0.51 (a long option, [[protective-put-collar]]).
- **Bet with a capped loss** → buy a call, or later a spread ([[vertical-spreads]]).

All three are among the least risky things you can do with options, because the worst case is known in advance. Kai does not need permission to sell naked options, does not need portfolio margin, and does not need an API. Kai does need a clean option chain, a limit-order ticket, and the ability to see what the position is worth before expiry.

Now picture two other people with the same broker menu. An active spread trader places iron condors every week: four legs, five contracts each, dozens of times a year. A quant wants to download chains and send orders from code. **Same brokers, completely different winners.** The trader cares about multi-leg tickets and cost per contract; the quant cares about data and an API; Kai cares about simplicity and fill quality on one contract a month.

<figure>
<svg viewBox="0 0 700 300" role="img" aria-label="Decision tree from what you trade to what the broker must offer">
<defs><marker id="broker-platform-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="250" y="12" width="200" height="40" rx="8" class="fx-hl"/>
<text x="350" y="37" text-anchor="middle" class="fx-t-b">What will you trade?</text>
<line x1="350" y1="52" x2="95" y2="96" class="fx-line" marker-end="url(#broker-platform-ah)"/>
<line x1="350" y1="52" x2="265" y2="96" class="fx-line" marker-end="url(#broker-platform-ah)"/>
<line x1="350" y1="52" x2="435" y2="96" class="fx-line" marker-end="url(#broker-platform-ah)"/>
<line x1="350" y1="52" x2="605" y2="96" class="fx-line" marker-end="url(#broker-platform-ah)"/>
<rect x="15" y="98" width="160" height="56" rx="8" class="fx-ok"/>
<text x="95" y="120" text-anchor="middle" class="fx-t-b">Covered calls,</text>
<text x="95" y="138" text-anchor="middle" class="fx-t-b">long puts/calls</text>
<rect x="185" y="98" width="160" height="56" rx="8" class="fx-box"/>
<text x="265" y="120" text-anchor="middle" class="fx-t-b">Spreads,</text>
<text x="265" y="138" text-anchor="middle" class="fx-t-b">iron condors</text>
<rect x="355" y="98" width="160" height="56" rx="8" class="fx-bad"/>
<text x="435" y="120" text-anchor="middle" class="fx-t-b">Naked short</text>
<text x="435" y="138" text-anchor="middle" class="fx-t-b">options</text>
<rect x="525" y="98" width="160" height="56" rx="8" class="fx-blue"/>
<text x="605" y="120" text-anchor="middle" class="fx-t-b">Code-driven</text>
<text x="605" y="138" text-anchor="middle" class="fx-t-b">research/trading</text>
<text x="95" y="178" text-anchor="middle" class="fx-t-sm">lowest approval tier</text>
<text x="95" y="194" text-anchor="middle" class="fx-t-sm">cash account can work</text>
<text x="95" y="210" text-anchor="middle" class="fx-t-sm">needs: clean chain,</text>
<text x="95" y="226" text-anchor="middle" class="fx-t-sm">limit tickets, alerts</text>
<text x="265" y="178" text-anchor="middle" class="fx-t-sm">spread permission</text>
<text x="265" y="194" text-anchor="middle" class="fx-t-sm">usually a margin account</text>
<text x="265" y="210" text-anchor="middle" class="fx-t-sm">needs: multi-leg tickets,</text>
<text x="265" y="226" text-anchor="middle" class="fx-t-sm">risk graph, cost/contract</text>
<text x="435" y="178" text-anchor="middle" class="fx-t-sm">highest approval tier</text>
<text x="435" y="194" text-anchor="middle" class="fx-t-sm">margin; maybe portfolio</text>
<text x="435" y="210" text-anchor="middle" class="fx-t-sm">margin (broker minimums)</text>
<text x="435" y="226" text-anchor="middle" class="fx-t-sm">needs: stress tests, alerts</text>
<text x="605" y="178" text-anchor="middle" class="fx-t-sm">any tier it trades</text>
<text x="605" y="194" text-anchor="middle" class="fx-t-sm">needs: data + order API,</text>
<text x="605" y="210" text-anchor="middle" class="fx-t-sm">paper sandbox, rate limits,</text>
<text x="605" y="226" text-anchor="middle" class="fx-t-sm">clear documentation</text>
<rect x="15" y="246" width="670" height="42" rx="8" class="fx-box2"/>
<text x="350" y="266" text-anchor="middle" class="fx-t">Then, on every branch: all-in cost · products and hours · expiry handling · registration</text>
<text x="350" y="282" text-anchor="middle" class="fx-t-sm">Kai sits on the green branch: the simplest permissions, where fill quality matters more than features</text>
</svg>
<figcaption>Figure 1 · Choose the broker from the trade backwards. What you plan to trade fixes the permission tier and account type you need; only then do cost, tools and products decide between the brokers that remain.</figcaption>
</figure>

That picture is the whole method: **start from the trade, derive the requirements, and only then compare brokers.** Most bad choices come from the reverse order — picking the app first and discovering later that it cannot place a spread as one order, charges per leg in a way that hurts, or does not list the product you wanted.

Try the checklist yourself. Tick what you plan to trade and see which permissions, account type and features follow:

::demo[broker-platform-checklist]

> [!THINK] Broker A charges no commission; broker B charges $0.65 per contract. Kai sells one 105 call a month. On one trade, broker A fills Kai one cent worse per share than broker B. Which broker was cheaper for that trade?
> Work it out per contract before opening.
> ---
> Broker B. One cent per share is \(0.01 \times 100 = \$1.00\) per contract, more than the \(\$0.65\) commission. Options trade in ticks of $0.01 (or $0.05 above $3.00 in many classes), so **a single tick of fill quality is worth more than a typical commission.** The commission is the visible cost; the fill is the larger, invisible one. That does not mean zero-commission brokers fill worse — it means you should measure your own fills against the mid.

We'll take it in six parts:

- **① Permissions and account type**: approval tiers, cash vs margin, the 2026 day-trading change, portfolio margin
- **② The all-in cost of a round trip**: commission, fees and the spread you actually pay; payment for order flow
- **③ Tools that match your style**: chain, risk graph, multi-leg tickets, alerts
- **④ Products, hours, venues and expiry handling**
- **⑤ APIs and paper trading**
- **⑥ Safety checks and the state of play in 2026**

## @mechanics
### ① Permissions and account type

In the US, a broker must approve an account for options before it can trade them. FINRA Rule 2360 requires the firm to do due diligence on the customer — experience, finances, objectives — and to approve the account for specific kinds of activity, such as covered writing, spreads or uncovered writing. Before approval the firm must deliver the *Characteristics and Risks of Standardized Options*, the Options Disclosure Document (ODD) published by the OCC. Many brokers organize approval into numbered levels, but **the numbering is each broker's own, not a FINRA standard** (facts as of September 2026). A typical ladder looks like this:

| Typical tier (names vary) | What it allows | Kai's wishes covered |
|---|---|---|
| Lowest | covered calls, protective puts (you own the stock) | income, protection |
| Next | buying calls and puts; often cash-secured puts | the capped-loss bet |
| Spreads | verticals, iron condors, butterflies (defined risk) | later strategies |
| Highest | uncovered (naked) calls and puts | not needed |

The account type matters as much as the tier. In a **cash account** you pay for everything in full: long options, the shares behind a covered call, the cash behind a cash-secured put. A **margin account** lets you borrow and is needed at most brokers for spreads and naked positions. Under Regulation T the initial margin for buying stock is 50%, and **long options must generally be paid in full** — you cannot buy calls with borrowed money ([[margin-approval]]).

> [!FACT] The day-trading rule changed in 2026
> For years a US margin account flagged as a *pattern day trader* needed $25,000 of equity. The SEC approved FINRA's amendments to Rule 4210 on April 14, 2026, and FINRA Regulatory Notice 26-10 replaced the pattern-day-trader designation and the $25,000 minimum with **intraday margin standards**, effective June 4, 2026. Firms have until October 20, 2027 to implement the change, so **some brokers may still apply the old rule for a while**. Ask your broker which regime your account is under (as of September 2026).

Above the ordinary margin account sits **portfolio margin**, allowed under FINRA Rule 4210(g). Instead of fixed formulas per position, the requirement comes from stress scenarios on the whole portfolio — the kind of spot-and-vol grid you met in [[portfolio-risk]]. For hedged books it can be far lower than strategy-based margin; for concentrated short options it can be higher. Eligibility is set by broker policy: one large US broker (Schwab) publishes a **$125,000** minimum plus approval for uncovered options, and minimums of **about $100,000–125,000 or more** are common (as of September 2026). Kai needs none of this. A portfolio-margin account magnifies both good risk management and bad, which is why brokers restrict it.

### ② The all-in cost of a round trip

The price of a trade has three parts: the commission the broker charges, small exchange and regulatory fees, and **the part of the bid–ask spread you give up** by filling away from the mid ([[liquidity-spreads]]). For one round trip (open and close):

$$
C_{\text{RT}} = N \times \Big(\underbrace{2c}_{\text{commission}} \;+\; \underbrace{2f}_{\text{fees}} \;+\; \underbrace{2 \times 100 \times h}_{\text{spread you pay}}\Big)
$$

where:

- \(N\) is the number of contracts per side, summed over all legs (a 4-leg condor of 5 contracts is \(N = 20\));
- \(c\) is the commission per contract per side, \(f\) the exchange, clearing and regulatory fees per contract per side;
- \(h\) is how far your fill sits from the mid, per share: a market order pays the half-spread, a patient limit at the mid pays about 0;
- the factor 2 counts the opening and the closing trade; the 100 converts a per-share price into a per-contract one.

Commissions are often quoted around $0.50–0.65 per contract, but schedules vary widely and some brokers charge nothing; treat any single number as illustrative and read your broker's schedule. The fee \(f\) below is also illustrative.

> [!EXAMPLE] Kai's covered call versus a spread trader's condor
> **Kai**, 1 contract of the 105 call (quote 0.70 / 0.72, half-spread 0.01), \(c = 0.65\), \(f = 0.05\):
> $$
> C_{\text{RT}} = 1 \times (1.30 + 0.10 + 2 \times 100 \times 0.01) = \$3.40 \text{ with market orders}, \qquad \$1.40 \text{ at the mid}
> $$
> **Spread trader**, iron condor, 4 legs × 5 contracts (\(N = 20\)), each leg 0.05 wide (half-spread 0.025):
> $$
> C_{\text{RT}} = 20 \times (1.30 + 0.10 + 2 \times 100 \times 0.025) = 20 \times 6.40 = \$128
> $$
> Of that \(\$128\), \(\$100\) is spread. Filled at the mid it would be \(\$28\). Forty-eight condors a year at the natural price cost about \(48 \times 128 = \$6{,}144\).

An option held to expiry crosses the spread only once. If only a fraction \(x\) of your trades are closed early, replace each factor 2 by \(1 + x\); the calculator at the end of the lesson does exactly that, for two brokers side by side.

<figure>
<svg viewBox="0 0 680 250" role="img" aria-label="Stacked bars of commission, fees and spread for four round trips">
<text x="20" y="24" class="fx-t-b">All-in cost of one round trip, split by source (illustrative c = $0.65, f = $0.05)</text>
<text x="200" y="62" text-anchor="end" class="fx-t">Kai, market orders</text>
<rect x="210" y="48" width="39" height="22" class="fx-fill-blue"/>
<rect x="249" y="48" width="3" height="22" class="fx-fill-muted"/>
<rect x="252" y="48" width="60" height="22" class="fx-fill-red"/>
<text x="320" y="64" class="fx-t-sm">$3.40</text>
<text x="200" y="100" text-anchor="end" class="fx-t">Kai, limit at mid</text>
<rect x="210" y="86" width="39" height="22" class="fx-fill-blue"/>
<rect x="249" y="86" width="3" height="22" class="fx-fill-muted"/>
<text x="260" y="102" class="fx-t-sm">$1.40</text>
<text x="200" y="138" text-anchor="end" class="fx-t">Condor ×5, natural</text>
<rect x="210" y="124" width="87" height="22" class="fx-fill-blue"/>
<rect x="297" y="124" width="7" height="22" class="fx-fill-muted"/>
<rect x="304" y="124" width="333" height="22" class="fx-fill-red"/>
<text x="632" y="119" text-anchor="end" class="fx-t-sm">$128</text>
<text x="200" y="176" text-anchor="end" class="fx-t">Condor ×5, at mid</text>
<rect x="210" y="162" width="87" height="22" class="fx-fill-blue"/>
<rect x="297" y="162" width="7" height="22" class="fx-fill-muted"/>
<text x="312" y="178" class="fx-t-sm">$28</text>
<rect x="210" y="208" width="14" height="12" class="fx-fill-blue"/>
<text x="230" y="218" class="fx-t-sm">commission</text>
<rect x="320" y="208" width="14" height="12" class="fx-fill-muted"/>
<text x="340" y="218" class="fx-t-sm">fees</text>
<rect x="400" y="208" width="14" height="12" class="fx-fill-red"/>
<text x="420" y="218" class="fx-t-sm">spread paid (distance from mid)</text>
<text x="20" y="242" class="fx-t-sm">Kai's bars use a 9× larger scale than the condor's so both are readable; compare within each pair.</text>
</svg>
<figcaption>Figure 2 · The same formula, four trades. The red part — spread paid — is usually the largest item and the one your order type controls. Commission is visible on the statement; the spread is hidden in the fill price.</figcaption>
</figure>

A second formula settles the “commission-free” question. If broker A charges \(c_A\) per contract per side and broker B charges \(c_B\), and B fills you \(\delta\) per share better on each side, B is cheaper when

$$
\delta \times 100 \;>\; c_B - c_A \qquad \Longleftrightarrow \qquad \delta > \frac{c_B - c_A}{100}
$$

With \(c_B - c_A = 0.65\), the break-even is \(\delta = 0.0065\) — less than one penny per share. Options quote in pennies below $3.00 and in nickels above it for most classes (SPY, QQQ and IWM trade in pennies at all prices), so **one tick of fill quality outweighs the whole commission difference.** This is why the right comparison is *all-in*, measured on your own fills.

**Payment for order flow (PFOF)** is where fill quality and commissions meet. Many US retail brokers route option orders to market makers who pay for that flow. As of September 2026 PFOF is legal in the US and disclosed in each broker's quarterly **Rule 606** routing report; the SEC withdrew its proposed Order Competition Rule and Regulation Best Execution on June 12, 2025. The EU banned PFOF under MiFIR, with the last national exemption (Germany's) ending on June 30, 2026, and the UK has barred it since 2012. Supporters argue it funds low commissions and that retail orders often fill at or better than the quote; critics point to the conflict of interest and to orders not facing full competition ([[orders]] has both sides). You do not need to settle the debate to act on it: **read the 606 report, and compare your fills with the mid at the moment you traded** — the method professionals call transaction cost analysis ([[execution-tca]]).

Two smaller items belong in the all-in number: fees some brokers charge for **exercise and assignment** (from nothing to a few dollars — check the schedule), and whether the broker charges per contract or per leg of a combination.

### ③ Tools that match your style

A platform earns its keep before you press *send*. For options, the useful tools are:

| Tool | What it answers | Kai | Spread trader | Quant |
|---|---|---|---|---|
| Chain with IV, delta, open interest | what is tradeable and at what vol ([[option-chain]]) | essential | essential | via API |
| Risk graph (today and at expiry) | the P&L curve before and at expiry ([[before-expiry]]) | useful | essential | builds own |
| Position Greeks, aggregated | total delta, theta, vega of the account ([[greeks-map]]) | nice | essential | builds own |
| Multi-leg ticket at a net price | one order for the whole spread ([[orders]]) | not yet | essential | via API |
| Price and expiry alerts | a message when XYZ nears 105 or expiry nears | essential | essential | own code |
| Scenario / stress view | P&L if XYZ −15% and IV +10 points | nice | essential | own code |

Two checks catch most weak platforms. First, **can you place a spread as a single order at a net limit price?** Legging in one side at a time is a small directional bet between fills. Second, **does the risk graph use today's implied volatility and show the position before expiry**, not only the hockey stick at expiry? A tool that only shows the expiry shape hides the effect of time and volatility — the reason [[before-expiry]] exists.

### ④ Products, hours, venues and expiry handling

Next, check that the broker lists what you want to trade ([[product-map]]):

- **Equity and ETF options** (American, physically settled) are nearly universal.
- **Index options** such as SPX and XSP (European, cash-settled) are not offered everywhere, and daily expirations used for [[zero-dte]] trading need both the product and the permission.
- **Options on futures**, and **options on bitcoin ETFs** such as IBIT (listed since November 19, 2024, American-style on fund shares) need the right account type.
- **Hours:** SPX and VIX options trade almost around the clock on weekdays through Cboe's Global Trading Hours, and Cboe received SEC approval for pre-market (7:30–9:25 a.m. ET) and post-market (4:00–4:15 p.m. ET) sessions in about 20 single-stock option classes, with a launch date of July 13, 2026. Whether *your* broker routes orders in those sessions is a separate question.

Crypto options live mostly on dedicated venues ([[crypto-options]]). Deribit, owned by Coinbase since the acquisition closed on August 14, 2025, handled about 49% of crypto options volume in the first half of 2026 by one aggregator's count (CoinGlass); CME lists options on bitcoin futures and moved to 24/7 crypto futures and options trading on May 29, 2026. These venues differ in who may use them by jurisdiction, in whether options are margined in coins or dollars, and in what happens if the venue itself fails. **Venue risk is part of the product.**

Finally, **expiry handling**. The OCC automatically exercises expiring options that are at least $0.01 in the money unless told otherwise, and the final decision deadline for expiring equity options is 5:30 p.m. ET on expiry day. Brokers often set **earlier internal cutoffs** for instructions and may close positions they consider risky near expiry. Know the cutoff before you need it: a short option left open into expiry can turn into shares you did not plan to own ([[exercise-assignment]], [[common-traps]]).

### ⑤ APIs and paper trading

For code, the questions are concrete:

- **Market data:** can you download chains with bids, asks, IV and Greeks, live and historical? End-of-day or intraday? ([[options-data]])
- **Orders:** can code send limit orders and multi-leg orders, query positions, margin and fills?
- **Sandbox:** is there a paper environment with the same API, so a script can be tested before it touches money?
- **Limits and docs:** rate limits, authentication, and whether the documentation shows complete, working examples.

This is where [[python-pricing]] and [[python-backtest]] meet a real account. It is also where guardrails live: position limits, a maximum loss, human approval for new orders and a kill switch are easier to enforce when the API supports them ([[ai-agents]]).

**Paper trading** — simulated orders against real quotes — is the cheapest lesson you will ever buy. Use it to run a complete trade: open, set alerts, manage, close or let expire, and check what the statement shows. Know its limits: paper fills are often **too generous** (instantly at the mid, in any size), assignment may not be simulated realistically, and no money at risk means no fear. **Paper trading tests the mechanics and your plan, not your nerves.**

### ⑥ Safety checks and the state of play in 2026

A few checks have nothing to do with options but everything to do with keeping your money:

- **Registration.** Look the firm up on FINRA's BrokerCheck; a US broker-dealer should be registered and a member of SIPC. SIPC protection concerns a failing firm, not market losses.
- **Security.** Two-factor authentication, trusted-device lists and withdrawal confirmations.
- **Documents.** Read the ODD, the margin agreement and the fee schedule, and download the Rule 606 report once.
- **Support.** Can you reach a person who understands options on expiry Friday afternoon?

> [!KEY] The checklist in one line
> **Trade → permission tier and account → products and hours → all-in cost on your own fills → tools and API → registration and security → paper trade the whole cycle.** No broker wins every line; the right one wins the lines your trades depend on.

The environment keeps changing. Between 2025 and 2026 alone: the PDT minimum was replaced by intraday margin standards (effective June 4, 2026, with implementation until October 2027), PFOF became banned across the EU (June 30, 2026) while remaining legal and disclosed in the US, Cboe won approval to extend single-stock option hours (launch set for July 13, 2026), and CME moved crypto futures and options to 24/7 trading. Re-read your broker's notices at least once a year; the checklist stays, the answers move.

## @analogy
Choosing a broker is like **choosing a workshop**. Before you compare workshops, you decide what you want to build. A birdhouse (Kai's covered call) needs a saw, a drill and a clear workbench; a cabinet (an iron condor) needs clamps that hold four pieces at once; a production line (a quant's code) needs power outlets for machines. The workshop's **membership levels** decide which tools you may touch — nobody hands a first-day member the table saw (naked options). The **entry fee** (commission) is printed on the door, but the **wood you waste** on each cut (the spread paid) often costs more, and a workshop with sharp blades wastes less. The **practice room** in the back (paper trading) lets you rehearse the cuts with scrap before touching the expensive walnut.

Where the analogy breaks: a workshop cannot change the rules halfway through a project, but a broker can raise margin requirements, restrict a product, or close your position near expiry, and markets can move while you are locked out. That is why part of choosing a broker is reading the rules it may apply to you, not only the tools it offers.

## @misconceptions
- **“Zero commission means the trade is free.”** — The spread you pay is usually the larger cost: one penny per share is $1 per contract, more than a typical commission. Compare all-in cost on real fills, not the commission line.
- **“Approval level 3 means the same thing everywhere.”** — Level numbering is each broker's own; FINRA Rule 2360 requires approval for kinds of activity, not a universal ladder. Read what your tier actually permits.
- **“You still need $25,000 to day-trade options in a margin account.”** — The PDT designation and its $25,000 minimum were replaced by intraday margin standards effective June 4, 2026, but firms may take until October 20, 2027 to switch. Ask which rule your broker applies (as of September 2026).
- **“Paper-trading results show what I will earn.”** — Paper fills are often instant and at the mid, in any size, and no real money changes how you decide. Paper trading tests the plan and the mechanics, not the returns or your nerves.
- **“The broker will handle expiry for me.”** — The OCC auto-exercises options $0.01 or more in the money, and brokers may act on their own cutoffs. If you do not want shares, close or instruct before the cutoff.

## @takeaways
- Choose from the trade backwards: what you will trade fixes the permission tier and account type; only then compare brokers.
- All-in round-trip cost is \(N \times (2c + 2f + 200h)\): commission, fees and the spread you pay; the spread term usually dominates, and one tick of fill quality beats a typical commission.
- US rules as of September 2026: approval tiers are broker-specific under FINRA Rule 2360; the PDT $25,000 minimum was replaced by intraday margin standards (effective June 4, 2026; firms may take until October 2027); portfolio margin has broker minimums around $100,000–125,000+; PFOF is legal and disclosed in Rule 606 reports.
- Check products, hours, venues and expiry cutoffs before you need them; crypto venues add venue risk.
- Paper trade a full cycle first; it tests mechanics and the plan, and its fills are kinder than reality.

## @quiz
1. Kai wants to sell covered calls and buy protective puts on shares already owned. What is the minimum that Kai needs from a broker?
   - [ ] Portfolio margin and approval for uncovered options
   - [x] Options approval for covered writing and buying options; a cash account can be enough
   - [ ] A margin account with the highest approval tier
   - [ ] An API with a paper-trading sandbox
   > Covered calls and long puts sit at the lowest tiers because the worst case is known: the shares cover the call and the put's premium is paid in full. Portfolio margin and naked approval are for far riskier books; an API is a convenience, not a requirement.
2. A spread trader places a 4-leg iron condor, 5 contracts per leg, with a commission of $0.65 per contract, fees of $0.05, and fills at the mid on both the open and the close. What is the all-in round-trip cost?
   - [ ] $6.40
   - [ ] $128
   - [x] $28
   - [ ] $13
   > \(N = 20\) contracts per side; at the mid \(h = 0\), so \(C_{\text{RT}} = 20 \times (1.30 + 0.10) = \$28\). With market orders on 0.05-wide legs the spread term adds \(20 \times 2 \times 100 \times 0.025 = \$100\), giving $128.
3. Broker B charges $0.65 per contract more than broker A. How much better must B's fills be, per share and per side, to make B the cheaper broker?
   - [ ] At least $0.65 per share
   - [ ] At least $0.10 per share
   - [ ] B can never be cheaper than a zero-commission broker
   - [x] More than $0.0065 per share — less than one penny
   > A better fill of \(\delta\) per share saves \(100\delta\) per contract. B wins when \(100\delta > 0.65\), so \(\delta > 0.0065\). One tick (a penny) already outweighs the commission difference.
4. Which statement about the US pattern-day-trader rule is accurate as of September 2026?
   - [ ] It still requires $25,000 of equity at every broker, unchanged
   - [ ] It was replaced in 2024 together with the move to T+1 settlement
   - [x] It was replaced by intraday margin standards effective June 4, 2026, but firms may take until October 20, 2027 to implement
   - [ ] It never applied to options
   > FINRA Regulatory Notice 26-10 (after SEC approval on April 14, 2026) replaced the PDT designation and the $25,000 minimum with intraday margin standards effective June 4, 2026, with implementation allowed until October 20, 2027 — so some brokers may still apply the old rule.
5. What is paper trading good for?
   - [ ] Estimating the returns you will earn with real money
   - [ ] Testing how your fills compare with a real market maker's
   - [ ] Getting approval for a higher options tier
   - [x] Rehearsing a full trade cycle — orders, alerts, management, expiry — without risking money
   > Paper trading uses real quotes but simulated fills, which are usually kinder than reality (instant, at the mid, any size). It tests mechanics and the plan; it does not measure real fills, returns or how you behave with money at risk.

## @further
- [FINRA Rule 2360 (Options)](https://www.finra.org/rules-guidance/rulebooks/finra-rules/2360) — the rule behind options account approval and the ODD delivery requirement.
- [FINRA Regulatory Notice 26-10](https://www.finra.org/rules-guidance/notices/26-10) — the 2026 replacement of the pattern-day-trader rule by intraday margin standards.
- [OCC: Options Disclosure Document](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document) — “Characteristics and Risks of Standardized Options”, required reading before approval.
- [FINRA: Margin accounts](https://www.finra.org/rules-guidance/key-topics/margin-accounts) — Regulation T, maintenance margin and how margin calls work.
- [SEC: Order Competition Rule (withdrawn)](https://www.sec.gov/rules-regulations/2025/06/order-competition-rule) — the proposal on retail order routing withdrawn on June 12, 2025.
- [FINRA BrokerCheck](https://brokercheck.finra.org/) — look up whether a firm or person is registered.

## @next
The account is open and the checklist is done. What does a single real trade look like when every step is written down — the thesis, the strike, the liquidity check, the size, the order, the rules for managing it and the journal entry afterwards? The next lesson walks Kai's covered call from idea to post-mortem.
