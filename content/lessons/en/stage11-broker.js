export default {
  id: "choose-broker",
  stage: 11,
  order: 1,
  title: "Choosing a Broker & Platform",
  difficulty: 1,
  prereqs: ["orders-margin"],

  oneLiner:
    "To choose a broker, look first at the **option approval level** (it decides which strategies you can run), then at **commissions and fees, the platform and analytics tools, tradable underlyings and expiries, assignment/exercise handling, paper trading, and the API** — match these against your style instead of just comparing who's cheaper.",

  intuition: `
You already know how to read an option chain, draw payoff diagrams, and place limit orders (Stage 2.5). But all of that has to execute in a concrete **brokerage account.** Pick the wrong platform and, at best, you overpay commissions and can't run the strategies you want; at worst, you take hidden hits on assignment and margin.

A common beginner mistake is to pick a broker by "which app looks nice" or "which is commission-free." What actually determines your experience is a string of **features**, weighted completely differently for different styles:

- A long-term holder who only wants to **sell covered calls** for a little rent cares most about "can I enable covered calls, and are commissions expensive?"
- A trader who wants to do **iron condors and spreads** cares most about "is the approval level high enough, are multi-leg orders easy to place, are the analytics complete?"
- A quant who wants to **run backtests and auto-place orders with Python** cares most about "is there an API, a data interface, a paper-trading sandbox?"

So this lesson recommends no specific broker but gives you a **selection checklist**: break each feature down and explain why it matters and to whom, so you can match it against your own goals.

**In this lesson we break "choosing a broker" into six pieces:**

- **① Option approval levels: which strategies you're allowed to run**
- **② Commissions and fees: the costs that nibble away at returns**
- **③ Platform and analytics: chains, Greeks, payoff diagrams, risk views**
- **④ Tradable underlyings, expiries, and assignment/exercise handling**
- **⑤ Paper trading: a free practice ground**
- **⑥ The API: for the quant and the automator**
`,

  mechanics: `
### ① Option approval levels: which strategies you're allowed to run

Almost every broker tiers accounts by risk into **option approval levels / tiers.** When you open the account you fill out a questionnaire (capital, income, experience, risk tolerance), and the broker grants a level on that basis. The higher the level, the more aggressive the strategies you can run. A common breakdown looks like this (each firm names them a bit differently):

- **Level 1**: only **covered calls** and **protective puts** — both require you to already hold the stock, lowest risk.
- **Level 2**: **buying calls/puts** (long) and **cash-secured puts.** Max loss is capped at the premium or the secured cash.
- **Level 3**: **spreads** — verticals, iron condors, butterflies, and other defined-risk multi-leg structures (Stage 7.3's iron condor lives at this level).
- **Level 4**: **naked** calls/puts — theoretically unlimited or huge risk, the highest bar, scrutinized most strictly for retail.

**This is the first thing to confirm when choosing a broker**: the strategy you want to run corresponds to which level? If you plan to do iron condors but are only approved to Level 2, then for you this broker "can't do the real work." The good news is that levels can be **upgraded by application**, though usually with proof of more experience or capital.

> Why do brokers tier? Because options' risk is highly asymmetric (Stage 2.5 covered the buyer's capped risk vs. the seller's potentially unlimited risk). The approval level is a gate that **protects retail and the broker alike** — it stops a novice from selling naked calls on day one and going into debt during a melt-up.

### ② Commissions and fees

"Commission-free" has become a selling point in recent years, but options differ from stocks — **very rarely is it truly all free.** The costs you must tally up include at least:

- **Per-contract commission**: U.S. retail folklore often quotes **$0–0.65** per contract — a **typical range, not a 2026 survey**. Buy 10, in and out once, at $0.65 is 0.65 × 10 × 2 = **$13.** High-frequency traders especially should mind this; use your broker's live schedule.
- **Exchange/regulatory fees**: small but real (a few cents per contract), adding up with multi-leg and high volume.
- **Exercise/assignment fees**: a charge may apply when you're assigned or exercise actively (some free, some a few dollars each time).
- **The hidden cost — spread and execution quality**: this is the big one. A platform that routes your order to a worse pool with worse fills will give back the commission savings to **slippage** (Stage 10.6), and then some.

Remember one line: **true cost = commission + fees + spread/slippage.** Staring only at the commission column is seeing only the tip of the iceberg. Frequent traders optimize for commissions; for long-term holders the impact is much smaller.

### ③ Platform and analytics

Placing the order is just the last step; **the analysis beforehand** is what decides whether you make money. A capable options platform should let you easily see:

- **Option chain**: clearly displays each strike's and expiry's bid/ask, volume, open interest, and implied volatility (callback 2.1 on how to read a chain).
- **Greeks**: each contract's and the whole portfolio's Delta/Gamma/Theta/Vega (Stage 5.1's dashboard), ideally the **net portfolio Greeks.**
- **Payoff-diagram tools**: draw the strategy's payoff curve, breakeven, and max profit/loss before you order.
- **Multi-leg ordering**: place an iron condor/spread as **one combo order** on the net price with a limit, instead of manually splitting it into four legs that fill separately (which carries more slippage and leg risk).
- **Risk view**: margin used, max loss, near-expiry reminders.

A full-featured platform (such as a professional terminal aimed at active traders) has all of this, even a volatility surface and probability analysis; a lightweight app may only have a basic chain and simple ordering. **The more complex your strategy, the more you need analytical depth.**

### ④ Tradable underlyings, expiries, and assignment/exercise handling

- **Tradable underlyings and expiries (checklist)**: stocks, ETFs, **index (SPX/XSP)**, **0DTE**, **IBIT**? Index is European cash, and you still ask AM vs PM (Stages 2.4, 2.6, **2.7 product map**). Without index/0DTE/IBIT coverage, later strategy lessons stay theoretical.
- **Assignment and exercise handling**: how does the broker handle your in-the-money options at expiry? Most have **auto-exercise**: in-the-money at expiry is usually auto-exercised (a common threshold is 0.01). You need to know the platform's rules, the **cutoff time**, and how to submit a "do-not-exercise" instruction — otherwise you may passively take delivery of unwanted stock at a borderline price (pin risk) (Stage 11.6 covers these traps specifically).
- **Ability to take stock**: assigned on a cash-secured put, you must take 100 shares, and the account needs enough funds/margin or it triggers a margin call.

### ⑤ Paper trading

**Paper trading = practicing order placement with virtual money and real market data.** It's the feature beginners should use most yet ignore most often. It lets you:

- **Run the whole flow** (pick strategy → choose strikes → place limit → manage → close, Stage 11.2) without spending a cent.
- Verify that your understanding of orders, margin, and the Greeks matches the platform's actual behavior.
- For quants, use it as a **sandbox** to connect the API and test automation logic (Stage 11.5).

When choosing a broker, glance at: **is there paper trading? Is the data real-time or delayed? Can you test multi-leg orders and the API?** A good simulation environment lets you pay the "tuition you can't afford" in a virtual account.

### ⑥ The API: for the quant and the automator

If you plan to **pull data, run backtests, or even auto-place orders with Python** (Stages 11.3, 11.4, 11.5), then **whether the broker has an API** is nearly decisive. Look at:

- **Market/historical data API**: can you programmatically obtain option chains, Greeks, and historical prices to feed a backtest?
- **Order API**: can you submit limit orders, combo orders, and query positions and margin in code?
- **Sandbox/paper-trading API**: validate the strategy in a simulated environment first, then switch to live.
- **Rate limits and documentation**: call-frequency limits, documentation quality, community libraries (if there's a ready-made Python wrapper).

To tie this lesson together: **first use the approval level to screen out brokers that "can't run your strategy," then use commissions/platform/underlyings/assignment handling/paper trading/API as the yardsticks, scoring against whether you're a holder, a trader, or a quant.** There is no "best broker," only "the broker that best fits your style."
`,

  demo: "broker-compare",

  analogy: `
Choosing a broker is like **picking a workshop for yourself.**

- **Option approval level** = **which tools the workshop lets you use.** The beginner workshop gives you only a screwdriver and a hammer (covered calls, long options); only the master's workshop lets you touch the chainsaw and welding torch (naked selling, complex spreads). If the work you want to do outranks your tool permissions, no price is cheap enough.
- **Commissions and fees** = **the admission and consumables fee per visit.** If you come occasionally to make one big piece of furniture, a pricier ticket doesn't matter; for someone who comes daily, a small ticket compounds into a big number.
- **Platform and analytics** = whether the workshop's **measuring tools and drafting table** are complete. Can you draw the finished piece clearly (payoff diagram, Greeks) on the table before you start cutting?
- **Paper trading** = the **free practice room** next door, where you practice freely with scrap, then move to real material once you've got it.
- **API** = whether the workshop **lets you hook up automated machinery** — the handcrafters don't care, but a quant wanting batch production can't move an inch without it.

Picking a workshop isn't about the prettiest or cheapest one, but the one whose **tool permissions, fees, measuring tools, practice room, and automation interface** best fit the work you want to do.
`,

  misconceptions: [
    "**\"A commission-free broker is always the best deal.\"** — Not necessarily. Options' true cost = commission + fees + **spread/slippage.** A platform with poor execution quality that routes your order to a bad pool gives back the commission savings to slippage, and then some (Stage 10.6). Frequent traders especially should look at total cost, not just the commission column.",
    "**\"Once the account is open, you can run any options strategy.\"** — No. Brokers limit strategies by **approval level**: low levels can only do covered calls/long options, spreads need Level 3, and naked selling needs the highest level. Confirm which level your strategy corresponds to before ordering, and apply to upgrade if needed.",
    "**\"I don't have to worry about in-the-money options at expiry — the broker handles it.\"** — Don't dump it all on them. Most brokers **auto-exercise** in-the-money options at expiry (a common threshold is 0.01), but you must know the platform's rules, the cutoff time, and how to submit a \"do-not-exercise\" instruction, or you may passively take delivery of stock at a borderline price (Stage 11.6's pin risk).",
    "**\"Paper trading is a waste of time — better to go straight to real money.\"** — Exactly the opposite. Paper trading uses virtual money and real market data, letting you run the whole order flow (Stage 11.2) first and verify your understanding of the platform, paying the tuition you can't afford in a simulated account. Quants can also use it as an API sandbox.",
    "**\"Any broker can run my Python automation.\"** — No. Whether you can trade programmatically depends on whether the broker **has an API**, data interfaces, a paper-trading sandbox, and reasonable rate limits. For anyone planning quant/automation (Stages 11.3–11.5), the API is nearly the decisive factor in the choice.",
  ],

  quiz: [
    {
      q: "You want to run an **iron condor** (selling an OTM call spread + an OTM put spread) in your account. What is the minimum option approval level generally required?",
      options: ["Level 1 (covered calls/protective puts)", "Level 2 (buying calls/puts)", "Level 3 (spreads)", "No approval needed at all"],
      answer: 2,
      explain: "An iron condor is a **multi-leg spread** structure, usually requiring **Level 3 (spread permission).** Level 1 only allows covered calls/protective puts, Level 2 allows long positions and cash-secured puts, and only naked selling needs the highest level. Confirm your strategy's level first when choosing a broker.",
    },
    {
      q: "You do dozens of options trades a month and trade frequently. When evaluating a broker's cost, which statement is most accurate?",
      options: [
        "Just look at the per-contract commission; ignore everything else",
        "True cost = commission + fees + spread/slippage, and execution quality matters just as much",
        "A commission-free broker is definitely cheapest for you",
        "Commissions matter least to frequent traders",
      ],
      answer: 1,
      explain: "For a frequent trader, every trade's **commission, fees, and spread/slippage** all add up. A platform with poor execution quality gives back the commission savings to worse fills (Stage 10.6). Look at total cost — don't stare only at the commission column.",
    },
    {
      q: "Regarding \"paper trading,\" which is its correct use?",
      options: [
        "Small-size trial and error with real capital",
        "Use virtual capital + real market data to run the whole order flow for free and verify your understanding of the platform",
        "A kind of commission-free real trading",
        "Only quants use it; it's useless for ordinary traders",
      ],
      answer: 1,
      explain: "Paper trading uses **virtual money and real market data**, letting you rehearse the whole flow of pick strategy → choose strikes → place limit → manage → close (Stage 11.2) without spending a cent, and serve as an API sandbox. It is extremely valuable for both beginners and quants.",
    },
    {
      q: "A quant plans to pull options data, run backtests, and auto-place orders with Python. Which feature is most decisive when choosing a broker?",
      options: ["Whether the app interface looks nice", "Whether it provides a market/order API and a paper-trading sandbox", "Whether it has physical branches", "Whether it gives an account-opening cash bonus"],
      answer: 1,
      explain: "Programmatic trading (Stages 11.3–11.5) depends on whether the broker **has an API**: can you programmatically obtain chains/Greeks/historical data, submit limit and combo orders, and validate in a sandbox first. Without an API, automation is impossible — this is decisive for a quant.",
    },
  ],

  further: [
    { label: "Investopedia: How to Choose an Options Broker", url: "https://www.investopedia.com/best-brokers-for-options-4587873" },
    { label: "OCC: Options Disclosure Document (the options risk disclosure, required reading before opening an account)", url: "https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document" },
    { label: "Options Industry Council (OIC): Getting Started", url: "https://www.optionseducation.org/" },
  ],
};
