export default {
  id: "python-pricing",
  stage: 11,
  order: 3,
  title: "Pricing & Plotting Greeks in Python",
  difficulty: 3,
  prereqs: ["black-scholes", "greeks-overview"],

  oneLiner:
    "Turn Black-Scholes and the Greeks from formulas into **a few dozen lines of runnable Python**: write pricing and Greek functions with `scipy.stats.norm`, back out implied volatility with the **bisection method**, then plot payoff and Greek curves with `matplotlib` — this is the starting point of quant options work.",

  intuition: `
In the earlier stages you've already mastered the Black-Scholes formula (Stage 4.1) and the meaning of the five Greeks (Stage 5.1). But a formula stuck on paper has no power — **real quant work is turning it into code that runs, is reusable, and can plot.** This lesson writes it out in Python step by step.

The good news: **this whole set is under 40 lines at its core.** All you need are two libraries:

- **NumPy**: for numerical computation (log, exp, square root, arrays).
- **SciPy's \`norm\`**: provides the standard normal's cumulative function \`norm.cdf\` and density function \`norm.pdf\` — exactly the two N(·) in the Black-Scholes formula.

We'll write four things, each corresponding to a concept you already understand:

- **A pricing function** \`bs_price\`: input S, K, T, r, σ, output the theoretical price (Stage 4.1).
- **A Greeks function** \`greeks\`: compute Delta/Gamma/Theta/Vega/Rho at once (Stage 5.1).
- **An implied-volatility solver** \`implied_vol\`: given the market price, back out the IV with the **bisection method.**
- **Plotting**: use matplotlib to draw the payoff curve, or some Greek's variation with the stock price.

The demo on the right uses **exactly the same math** as this Python (the same formulas), so the prices and Greeks you see as you drag the sliders are what this code would \`print\` — code and live numbers correspond one to one.

**In this lesson we break "doing options in Python" into five pieces:**

- **① Setup: import numpy and scipy.stats.norm**
- **② Pricing function: Black-Scholes in a few lines**
- **③ Greeks function: compute all five at once**
- **④ Implied volatility: back it out with bisection**
- **⑤ Plotting: trace payoff/Greek curves with matplotlib**
`,

  mechanics: `
### ① Setup: imports and conventions

First, get the tools ready. We'll use an **annualized, decimal** convention throughout: T is the annualized time to expiry (30 days = 30/365), and σ and r are decimals (20% = 0.20).

\`\`\`python
import numpy as np
from scipy.stats import norm   # norm.cdf = N(·), norm.pdf = N'(·)
\`\`\`

\`norm.cdf(x)\` is the standard normal's cumulative distribution function N(x), and \`norm.pdf(x)\` is the density N'(x). All the N(·) appearing in Black-Scholes use these. The two functions support **vectorization** — pass in a numpy array and they return an array element-wise, which lets us compute a whole row in one line when plotting curves.

### ② Pricing function: Black-Scholes

Translate Stage 4.1's formula directly. Compute d1, d2 first, then combine by call/put:

$$d_1 = [ln(S/K) + (r + σ²/2)·T] / (σ·√T)
$$d_2 = d_1 − σ·√T
$$call = S·N(d_1) − K·e^{−rT}·N(d_2),  put = K·e^{−rT}·N(−d_2) − S·N(−d_1)

\`\`\`python
def bs_price(S, K, T, r, sigma, kind="call"):
    if T <= 0 or sigma <= 0:                 # degenerate to intrinsic value
        return max(S - K, 0.0) if kind == "call" else max(K - S, 0.0)
    d1 = (np.log(S / K) + (r + sigma**2 / 2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    if kind == "call":
        return S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)
    else:
        return K * np.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)
\`\`\`

**Read it block by block**: the first line handles the boundary (at expiry or zero volatility the value is just intrinsic value, avoiding division by zero); the middle two lines compute d1, d2; the last returns by type. This is the literal implementation of Stage 4.1's formula.

> **Sanity-check against a known answer (mandatory)**: test it with the classic benchmark S=K=100, T=1, r=5%, σ=20%, and \`bs_price(100,100,1,0.05,0.20)\` should give about **10.45.** Any BS implementation (including one AI writes for you, Stage 11.5) should pass this gate first — "it runs" doesn't mean "it computes correctly."

### ③ Greeks function: compute all five at once

The Greeks are the price's partial derivatives with respect to each input. We scale them by **trading convention**, consistent with what you see on the dashboard (Stage 5.1): **vega per +1% of volatility, theta per 1 day passing (calendar), rho per +1% of interest rate.**

\`\`\`python
def greeks(S, K, T, r, sigma, kind="call"):
    d1 = (np.log(S / K) + (r + sigma**2 / 2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    pdf = norm.pdf(d1)
    if kind == "call":
        delta = norm.cdf(d1)
        theta = (-S * pdf * sigma / (2 * np.sqrt(T))
                 - r * K * np.exp(-r * T) * norm.cdf(d2))
        rho = K * T * np.exp(-r * T) * norm.cdf(d2)
    else:
        delta = norm.cdf(d1) - 1
        theta = (-S * pdf * sigma / (2 * np.sqrt(T))
                 + r * K * np.exp(-r * T) * norm.cdf(-d2))
        rho = -K * T * np.exp(-r * T) * norm.cdf(-d2)
    gamma = pdf / (S * sigma * np.sqrt(T))   # same for call and put
    vega = S * pdf * np.sqrt(T)              # derivative w.r.t. sigma (decimal)
    return {
        "delta": delta,
        "gamma": gamma,
        "theta": theta / 365,    # per 1 day
        "vega": vega / 100,      # per +1% volatility
        "rho": rho / 100,        # per +1% interest rate
    }
\`\`\`

**Read it block by block**: \`delta\` is N(d1) for a call and N(d1)−1 for a put; \`gamma\` and \`vega\` are **identical** for call and put (convexity and volatility sensitivity have no direction); \`theta\` and \`rho\` branch by type. The last three are divided by 365 / 100 for unit scaling, giving the "per day," "per 1%" convention traders are used to.

> **Benchmark check**: under the classic parameters above, the call's Delta ≈ **0.637**, Gamma ≈ **0.0188**, Vega ≈ **0.375** (per +1%), Theta ≈ **−0.018** (per day). These match the demo's numbers on the right under the same inputs — because it runs the same math.

### ④ Implied volatility: back it out with bisection

Pricing is "given σ, find the price"; **implied volatility is the reverse** — given the market price, find the σ that makes the model price equal the market price (Stage 4.2). The BS price is **monotonically increasing** in σ, so we can use the most robust method, **bisection**: repeatedly take the midpoint of [lo, hi], guess lower if the price is too high and higher if too low, halving the interval each time.

\`\`\`python
def implied_vol(price, S, K, T, r, kind="call", lo=1e-4, hi=5.0, tol=1e-6):
    intrinsic = max(S - K, 0.0) if kind == "call" else max(K - S, 0.0)
    if price <= intrinsic + 1e-8:     # below intrinsic value → no solution
        return float("nan")
    for _ in range(100):
        mid = (lo + hi) / 2
        diff = bs_price(S, K, T, r, mid, kind) - price
        if abs(diff) < tol:
            return mid
        if diff > 0:                  # model price too high → guessed vol too large
            hi = mid
        else:
            lo = mid
    return (lo + hi) / 2
\`\`\`

**Read it block by block**: first rule out "market price below intrinsic value" (meaningless, no solution); then loop at most 100 times, each time pricing at the midpoint, comparing, and narrowing the interval. Unlike Newton's method, bisection doesn't rely on the derivative, **always converges and never diverges** — ideal for teaching and robust production alike.

> **Round-trip test**: first compute a price with \`bs_price(100,105,0.25,0.04,0.30,"call")\`, then feed that price back into \`implied_vol(...)\`, and it should **recover 0.30 exactly.** This "forward pricing → reverse IV" round-trip test is a good way to verify both functions are correct.

### ⑤ Plotting: with matplotlib

With the functions in hand, plotting is a few lines. Using numpy's vectorization, feed in a whole row of stock prices at once, then \`plot\`. For example, draw an **expiry payoff diagram** (long call) or a **Delta-vs-spot curve**:

\`\`\`python
import matplotlib.pyplot as plt

S = np.linspace(60, 140, 200)              # a row of stock prices
prem = bs_price(100, 100, 30/365, 0.04, 0.25, "call")   # entry premium
payoff = np.maximum(S - 100, 0) - prem     # per-share payoff at expiry
delta_curve = norm.cdf(                      # current Delta as S varies
    (np.log(S/100) + (0.04 + 0.25**2/2)*(30/365)) / (0.25*np.sqrt(30/365)))

fig, ax = plt.subplots(1, 2, figsize=(10, 4))
ax[0].plot(S, payoff); ax[0].axhline(0, ls="--"); ax[0].set_title("Long Call P&L")
ax[1].plot(S, delta_curve); ax[1].set_title("Call Delta vs Spot")
plt.tight_layout(); plt.show()
\`\`\`

**What this drew**: the left plot is the classic **hockey-stick payoff** (a floor at −premium, rising at 45° past the strike, callback 1.1); the right is the **S-shaped curve** of Delta climbing smoothly from 0 to 1 (Stage 5.2). \`np.linspace\` generates 200 stock-price points, the vectorized functions compute the whole line at once, and \`plot\` traces it out — exactly what the demo on the right does in the browser, only it uses JS to redraw in real time.

Connecting the five pieces: **import two libraries → a few lines for pricing → a few lines for the Greeks → bisection to back out IV → matplotlib to plot curves.** This under-a-hundred-lines of code is the foundation for your later backtesting (Stage 11.4) and AI workflow (Stage 11.5). What market makers and quants use every day is, in essence, an industrial-strength scale-up of it — but the skeleton, you can already type out yourself.
`,

  demo: "python-greeks",

  analogy: `
Writing a formula into code is like **turning a sheet of music into a piano that actually sounds.**

- **The Black-Scholes formula** (Stage 4.1) is the **sheet music**: beautifully written, but silent on paper.
- **\`numpy\` + \`scipy.stats.norm\`** are the **keys and hammers**: the two "notes" N(·) are provided ready-made by \`norm.cdf\` and \`norm.pdf\`, so you don't build them from scratch.
- **The \`bs_price\` / \`greeks\` functions** are **recording the score into the piano**: once recorded, pressing the keys anytime (passing in S, K, T, r, σ) instantly plays the corresponding price and Greeks.
- **Bisection for IV** is **tuning**: in reverse, hearing the note the market plays (the market price), you turn the peg little by little (narrowing the interval) until the model's note matches it — the tightness of that string is the implied volatility.
- **matplotlib plotting** is drawing the whole piece as a **waveform**: play through a row of stock prices, and the hockey stick of the payoff and the S-shape of Delta take shape.

Reading the sheet music (understanding the formula) is one thing; making the piano sound and even tuning it for it (writing runnable, invertible code) is another — the latter is the real skill of a quant.
`,

  misconceptions: [
    "**\"The Black-Scholes formula is too hard, so coding it must be long.\"** — Not long. With the N(·) provided by \`scipy.stats.norm\`, core pricing + the Greeks + backing out IV add up to **under 40 lines.** The hard part is understanding the formula, and you already learned that in Stages 4.1, 5.1.",
    "**\"If the code prints a number, it's correct.\"** — Not necessarily. You must **sanity-check against a known benchmark**: the call with S=K=100, T=1, r=5%, σ=20% must give ≈ **10.45.** 'It runs' ≠ 'it computes correctly,' and code AI writes for you especially must pass this gate first (Stage 11.5).",
    "**\"Backing out implied volatility needs an advanced algorithm like Newton's method.\"** — No need. The BS price is monotone in σ, so the most naive **bisection always converges and never diverges**, robust and fast enough. Bracket it with lo=1e-4, hi=5 first, then keep taking the midpoint to narrow it.",
    "**\"Just use Theta straight from the formula.\"** — Mind the units. The textbook formula gives **annualized** Theta; the trading convention is to **divide by 365** (per day); likewise vega ÷ 100 (per +1%), rho ÷ 100. Without scaling, your numbers won't match the broker's dashboard (Stage 5.1).",
    "**\"Plotting Greek curves needs a loop, computing point by point.\"** — Use numpy **vectorization**: \`np.linspace\` makes a row of stock prices, pass the whole row into the function, get the whole curve back at once, then \`plot\` — faster and cleaner than a for loop. This is exactly why numpy exists.",
  ],

  quiz: [
    {
      q: "You've written \`bs_price(S,K,T,r,sigma)\`. Which set of inputs makes the best **sanity-check against a known answer**, and what is the correct result approximately?",
      options: [
        "bs_price(100,100,1,0.05,0.20) ≈ 10.45",
        "bs_price(100,100,1,0.05,0.20) ≈ 5.00",
        "bs_price(50,100,0.1,0,0) ≈ 50",
        "Any set of inputs, as long as it doesn't error",
      ],
      answer: 0,
      explain: "The classic benchmark S=K=100, T=1, r=5%, σ=20% call should give ≈ **10.45.** Checking against a known answer is the standard way to verify a pricing function (including AI-generated ones) — it running doesn't mean it computes correctly (Stage 11.5).",
    },
    {
      q: "In a Python implementation of Black-Scholes, what usually provides the two N(·) (the standard normal cumulative distribution) in the formula?",
      options: ["np.mean", "scipy.stats.norm.cdf", "np.exp", "a hand-written sorting function"],
      answer: 1,
      explain: "The standard normal cumulative distribution N(·) is provided by **\`scipy.stats.norm.cdf\`**, and the density N'(·) by \`norm.pdf\`. They support vectorization and correspond exactly to N(d1) and N(d2) in the BS formula.",
    },
    {
      q: "When backing out implied volatility with the **bisection method**, why is this method especially robust on BS?",
      options: [
        "Because the BS price is monotonically increasing in σ, so halving the interval each time must converge",
        "Because bisection is more computationally expensive than Newton's method",
        "Because it needs to know the price's derivative with respect to σ",
        "Because implied volatility always equals 0.20",
      ],
      answer: 0,
      explain: "The BS price is **monotonically increasing** in volatility, so taking the midpoint in [lo,hi] and narrowing by price comparison **must converge.** Bisection doesn't depend on the derivative and never diverges, more robust than Newton's method (though a bit slower).",
    },
    {
      q: "To plot the \"call Delta vs. stock price\" curve with matplotlib, what is the most Pythonic and efficient approach?",
      options: [
        "Write a for loop computing Delta one stock price at a time and append",
        "Make a row of stock prices with np.linspace, pass the whole row vectorized into the function to get the whole curve at once, then plot",
        "Compute only one stock-price point and connect it into a straight line",
        "It's impossible to plot the Greeks with matplotlib",
      ],
      answer: 1,
      explain: "Use numpy **vectorization**: \`np.linspace\` generates a row of stock prices, feed the whole row into the function written with \`norm.cdf\`, get the whole curve back at once, then \`plot\`. Faster and cleaner than a for loop — this is numpy's core usage.",
    },
  ],

  further: [
    { label: "SciPy docs: scipy.stats.norm (the normal distribution's cdf/pdf)", url: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.norm.html" },
    { label: "Matplotlib: Pyplot tutorial", url: "https://matplotlib.org/stable/tutorials/pyplot.html" },
    { label: "QuantPy: Black-Scholes in Python (with the Greeks and plotting)", url: "https://quantpy.com.au/black-scholes-model/" },
  ],
};
