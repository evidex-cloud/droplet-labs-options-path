---
id: python-pricing
prereqs: black-scholes, greeks-map, implied-vol, binomial-trees, monte-carlo, options-data
demo: python-pricing
---

# Pricing & Plotting the Greeks in Python

## @hook
Every price, Greek and implied volatility in this course came from about forty lines of code. This lesson writes those lines in Python with numpy and scipy, and — more important than the code — tests them against numbers you already trust: the textbook call of 10.45 and put of 5.57. Code that passes those tests can be trusted; code that merely runs cannot.

## @bridge
[[black-scholes]] gave the formula and [[greeks-map]] the trading units of the Greeks. [[implied-vol]] inverted the formula with Newton's method, and [[binomial-trees]] and [[monte-carlo]] priced the same options two other ways. Here the four become one small Python module with tests. It builds Idea ② (no-arbitrage: three different methods must agree on one price, and parity must hold to machine precision) and Idea ③ (volatility: implied vol is the number the market quotes, so the solver matters). The module is used again in [[python-backtest]], and it is exactly the kind of code an AI assistant writes quickly and gets subtly wrong ([[ai-agents]]) — which is why the tests come first.

## @intuition
Start with the smallest possible program. Kai's 1-year XYZ call from [[black-scholes]] is \(C = S\,\N(d_1) - Ke^{-rT}\N(d_2)\). In Python the standard normal distribution function \(\N(\cdot)\) is `norm.cdf` from `scipy.stats`, the logarithm is `np.log`, and the formula becomes four lines:

```python
import numpy as np
from scipy.stats import norm

S, K, T, r, sigma = 100, 100, 1.0, 0.04, 0.20
d1 = (np.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
d2 = d1 - sigma * np.sqrt(T)
print(S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2))   # 9.925053...
```

It prints 9.925, the $9.93 you have seen since [[black-scholes]]. That is the whole trick: **the formula on paper and the code are the same object**, written in two notations.

The hard part is not writing it. The hard part is knowing it is right. Suppose you had typed `T = 365` instead of `T = 1.0` — days instead of years. The program would still run and print a number (about 100, since a 365-year option on a non-dividend stock is worth nearly the stock itself). Nothing crashes. **A wrong pricing function fails silently.** So every function in this lesson comes with a test: a known answer it must reproduce.

<figure>
<svg viewBox="0 0 700 220" role="img" aria-label="Pipeline: inputs, pricing functions, numbers, tests and plots">
<defs><marker id="python-pricing-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<rect x="10" y="30" width="120" height="84" rx="8" class="fx-box2"/>
<text x="70" y="54" text-anchor="middle" class="fx-t-b">Inputs</text>
<text x="70" y="74" text-anchor="middle" class="fx-t-sm fx-mono">S, K, T, r, σ, q</text>
<text x="70" y="92" text-anchor="middle" class="fx-t-sm">T in years</text>
<text x="70" y="106" text-anchor="middle" class="fx-t-sm">σ as a decimal</text>
<rect x="160" y="30" width="150" height="84" rx="8" class="fx-hl"/>
<text x="235" y="54" text-anchor="middle" class="fx-t-b">pricing.py</text>
<text x="235" y="74" text-anchor="middle" class="fx-t-sm fx-mono">bs_price</text>
<text x="235" y="90" text-anchor="middle" class="fx-t-sm fx-mono">greeks</text>
<text x="235" y="106" text-anchor="middle" class="fx-t-sm fx-mono">implied_vol</text>
<rect x="340" y="30" width="150" height="84" rx="8" class="fx-box"/>
<text x="415" y="54" text-anchor="middle" class="fx-t-b">Numbers</text>
<text x="415" y="74" text-anchor="middle" class="fx-t-sm">one option, or a</text>
<text x="415" y="90" text-anchor="middle" class="fx-t-sm">whole chain as arrays</text>
<text x="415" y="106" text-anchor="middle" class="fx-t-sm">(pandas DataFrame)</text>
<rect x="520" y="30" width="170" height="84" rx="8" class="fx-box"/>
<text x="605" y="54" text-anchor="middle" class="fx-t-b">Plots</text>
<text x="605" y="74" text-anchor="middle" class="fx-t-sm">Greeks vs price,</text>
<text x="605" y="90" text-anchor="middle" class="fx-t-sm">vs time, vs vol</text>
<text x="605" y="106" text-anchor="middle" class="fx-t-sm">(matplotlib)</text>
<line x1="130" y1="72" x2="158" y2="72" class="fx-line" marker-end="url(#python-pricing-ah)"/>
<line x1="310" y1="72" x2="338" y2="72" class="fx-line" marker-end="url(#python-pricing-ah)"/>
<line x1="490" y1="72" x2="518" y2="72" class="fx-line" marker-end="url(#python-pricing-ah)"/>
<rect x="160" y="150" width="330" height="56" rx="8" class="fx-ok"/>
<text x="325" y="172" text-anchor="middle" class="fx-t-b">test_pricing.py — known answers</text>
<text x="325" y="192" text-anchor="middle" class="fx-t-sm">10.4506 / 5.5735 · parity · delta vs a bump · IV round trip</text>
<line x1="235" y1="148" x2="235" y2="118" class="fx-line-ok" marker-end="url(#python-pricing-ah)"/>
<line x1="415" y1="118" x2="415" y2="148" class="fx-line-ok" marker-end="url(#python-pricing-ah)"/>
<text x="245" y="138" class="fx-t-sm">calls</text>
<text x="425" y="138" class="fx-t-sm">checks</text>
</svg>
<figcaption>Figure 1 · The shape of this lesson. Three functions turn inputs into numbers and plots; a separate test file checks the numbers against answers known in advance. The tests are what make the numbers usable.</figcaption>
</figure>

Before reading any more code, play with the tests. The panel below runs the four checks this lesson writes in Python, plus a matching check for vega, against a correct implementation and against four realistic bugs. Notice which test catches which bug — and which bugs slip past a test you might have thought was enough:

::demo[python-pricing-check]

> [!THINK] Your function takes `T` in days by mistake, but you use it consistently for both calls and puts. Does the put–call parity test \(C - P = S - Ke^{-rT}\) catch the bug?
> Decide before you open the answer.
> ---
> No. With the same wrong \(T\) everywhere, the call and the put are both priced for a 365-year option, and parity holds exactly for *that* option — the identity doesn't care what \(T\) is. Only a test against an **external** known value (10.4506 for the textbook call) catches it. Internal-consistency tests (parity, round trips, bumps) prove the code agrees with itself; known-answer tests prove it agrees with the world. You need both.

We'll build the module in seven parts:

- **① Setup and the pricing function**
- **② Greeks in trading units**
- **③ Implied volatility with a bracketing solver**
- **④ Whole chains at once: vectorizing with numpy and pandas**
- **⑤ Tests: known answers and self-consistency**
- **⑥ Plotting the Greeks**
- **⑦ Cross-checks: a binomial tree and Monte Carlo**

## @mechanics
### ① Setup and the pricing function

You need Python 3 with four packages: `pip install numpy scipy pandas matplotlib`. Fix the conventions before writing a line, because most pricing bugs are unit bugs:

- time \(T\) in **years**, as calendar days / 365 (30 days → `30 / 365`);
- rates \(r\) and dividend yield \(q\) **continuously compounded decimals** (4% → `0.04`);
- volatility \(\sigma\) as a **decimal** (20% → `0.20`);
- prices **per share**; multiply by 100 for a contract.

The function implements Black–Scholes–Merton with a dividend yield:

$$
C = S e^{-qT}\N(d_1) - K e^{-rT}\N(d_2), \qquad P = K e^{-rT}\N(-d_2) - S e^{-qT}\N(-d_1), \qquad d_{1,2} = \frac{\ln(S/K) + \left(r - q \pm \tfrac12\sigma^2\right)T}{\sigma\sqrt{T}}
$$

where \(S\) is spot, \(K\) the strike, \(\N\) the standard normal distribution function (`norm.cdf`) and \(e^{-qT}\), \(e^{-rT}\) discount the stock and the strike. With \(q = 0\) it is exactly the formula from [[black-scholes]].

```python
import numpy as np
from scipy.stats import norm
from scipy.optimize import brentq


def bs_price(S, K, T, r, sigma, kind="call", q=0.0):
    """Black-Scholes-Merton price per share. Needs T > 0 and sigma > 0.
    S, K, T or sigma may be numpy arrays: the formula is applied element by element."""
    sqT = np.sqrt(T)
    d1 = (np.log(S / K) + (r - q + 0.5 * sigma**2) * T) / (sigma * sqT)
    d2 = d1 - sigma * sqT
    if kind == "call":
        return S * np.exp(-q * T) * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)
    return K * np.exp(-r * T) * norm.cdf(-d2) - S * np.exp(-q * T) * norm.cdf(-d1)
```

Two design choices matter. First, the function **refuses to handle expiry**: at \(T = 0\) the formula divides by zero, so the caller must use intrinsic value \(\max(S - K, 0)\) instead — an explicit rule is safer than a hidden special case. Second, every operation is a numpy operation, so the same function prices one option or ten thousand.

> [!EXAMPLE] The first four prints
> ```python
> print(f"{bs_price(100, 100, 1, 0.05, 0.20):.4f}")          # 10.4506  textbook call
> print(f"{bs_price(100, 100, 1, 0.05, 0.20, 'put'):.4f}")   # 5.5735   textbook put
> print(f"{bs_price(100, 100, 1, 0.04, 0.20):.4f}")          # 9.9251   Kai's 1-year call
> print(f"{bs_price(100, 100, 1, 0.04, 0.20, 'put'):.4f}")   # 6.0040   Kai's 1-year put
> ```
> The first pair is the textbook check set (\(S = K = 100,\ T = 1,\ r = 5\%,\ \sigma = 20\%\)) found in Hull and most other texts. The second pair is the course's own XYZ at \(r = 4\%\): \(9.93 - 6.00 = 3.93 \approx 100 - 96.08\), parity as in [[put-call-parity]].

> [!DEEP] Numerical care: why the put uses \(\N(-d)\) and not \(1 - \N(d)\)
> Mathematically \(\N(-d_2) = 1 - \N(d_2)\), but in floating point they are not equally accurate. For a far out-of-the-money put, \(d_2\) might be 8; \(\N(8)\) is \(1 - 6.2 \times 10^{-16}\), and subtracting it from 1 leaves mostly rounding noise, while `norm.cdf(-8)` returns \(6.2 \times 10^{-16}\) to full precision. The same care applies elsewhere: handle \(T = 0\) explicitly instead of letting \(d_1\) become infinite, and do not trust implied volatilities computed from prices of one or two ticks, where a one-cent change in price moves the answer by many vol points because vega is tiny. Libraries that price millions of options add vectorized special functions (`scipy.special.ndtr` sits underneath `norm.cdf`) and compiled code, but the arithmetic is the same.

### ② Greeks in trading units

The Greeks are the formula's partial derivatives. Calculus gives them in “per 1.00” units — per \(\$1\) of stock, per year, per 100 vol points — but traders and broker screens quote theta **per day**, vega **per vol point** and rho **per 1% of rate** ([[greeks-map]]). Convert once, inside the function:

$$
\Theta_{\text{day}} = \frac{\Theta_{\text{year}}}{365}, \qquad \nu_{\text{pt}} = \frac{\nu}{100}, \qquad \rho_{1\%} = \frac{\rho}{100}
$$

where \(\Theta_{\text{year}} = \partial V/\partial t\) in dollars per year, \(\nu = \partial V/\partial\sigma\) per 1.00 of volatility and \(\rho = \partial V/\partial r\) per 1.00 of rate.

```python
def greeks(S, K, T, r, sigma, kind="call", q=0.0):
    """Greeks in trading units: delta per $1, gamma per $1, vega per vol point,
    theta per calendar day, rho per 1% of rate."""
    sqT = np.sqrt(T)
    d1 = (np.log(S / K) + (r - q + 0.5 * sigma**2) * T) / (sigma * sqT)
    d2 = d1 - sigma * sqT
    dq, dr, pdf = np.exp(-q * T), np.exp(-r * T), norm.pdf(d1)
    gamma = dq * pdf / (S * sigma * sqT)
    vega = S * dq * pdf * sqT                                  # per 1.00 of sigma
    decay = -S * dq * pdf * sigma / (2 * sqT)
    if kind == "call":
        delta = dq * norm.cdf(d1)
        theta = decay - r * K * dr * norm.cdf(d2) + q * S * dq * norm.cdf(d1)
        rho = K * T * dr * norm.cdf(d2)
    else:
        delta = -dq * norm.cdf(-d1)
        theta = decay + r * K * dr * norm.cdf(-d2) - q * S * dq * norm.cdf(-d1)
        rho = -K * T * dr * norm.cdf(-d2)
    return {"delta": delta, "gamma": gamma, "vega": vega / 100,
            "theta": theta / 365, "rho": rho / 100}
```

> [!EXAMPLE] The standard 30-day call, printed
> ```python
> g = greeks(100, 100, 30 / 365, 0.04, 0.20)
> print({k: round(float(v), 4) for k, v in g.items()})
> # {'delta': 0.5343, 'gamma': 0.0693, 'vega': 0.114, 'theta': -0.0436, 'rho': 0.0419}
> ```
> These are the course's standard numbers for the 30-day at-the-money call: Δ 0.534, Γ 0.069, vega 0.114 per vol point, Θ −0.044 per day. Per contract, multiply by 100: the call loses about \(0.0436 \times 100 = \$4.36\) a day if nothing else changes.

Gamma and vega have no `if`: they are identical for a call and a put with the same inputs, because by parity the two differ only by a stock position and a bond, whose second derivative in \(S\) and derivative in \(\sigma\) are zero.

### ③ Implied volatility with a bracketing solver

Implied volatility runs the formula backwards: find the \(\sigma\) for which the model price equals the market price ([[implied-vol]]). Write it as a root-finding problem:

$$
f(\sigma) = C_{\text{BS}}(\sigma) - C_{\text{mkt}} = 0
$$

where \(C_{\text{BS}}(\sigma)\) is `bs_price` at volatility \(\sigma\) and \(C_{\text{mkt}}\) the observed price. Because the price rises with \(\sigma\) (vega is positive), \(f\) crosses zero exactly once — **if** the market price lies inside the no-arbitrage bounds of [[arbitrage-bounds]]. Below the lower bound no volatility can produce the price; at or above the upper bound neither can.

[[implied-vol]] solved this with Newton's method, which is fast but divides by vega and can overshoot when vega is tiny (deep out-of-the-money or very short-dated options). Here we use **Brent's method** (`scipy.optimize.brentq`): give it a bracket \([a, b]\) where \(f(a) < 0 < f(b)\), and it is guaranteed to converge, combining bisection's safety with faster interpolation steps.

```python
def implied_vol(price, S, K, T, r, kind="call", q=0.0):
    """The sigma that makes bs_price match `price`; nan if no sigma can."""
    fwd_S, pv_K = S * np.exp(-q * T), K * np.exp(-r * T)
    lower = max(fwd_S - pv_K, 0.0) if kind == "call" else max(pv_K - fwd_S, 0.0)
    upper = fwd_S if kind == "call" else pv_K
    if not (lower < price < upper):
        return np.nan                                       # outside no-arbitrage bounds
    f = lambda s: bs_price(S, K, T, r, s, kind, q) - price
    return brentq(f, 1e-6, 5.0, xtol=1e-10)   # f(1e-6) < 0; f(5) > 0 for any vol below 500%
```

<figure>
<svg viewBox="0 0 660 250" role="img" aria-label="The function f(sigma) crossing zero inside the bracket">
<line x1="60" y1="156.7" x2="620" y2="156.7" class="fx-axis"/>
<line x1="60" y1="30" x2="60" y2="225" class="fx-axis"/>
<text x="52" y="160" text-anchor="end" class="fx-t-sm">0</text>
<text x="52" y="110" text-anchor="end" class="fx-t-sm">+2</text>
<text x="52" y="59" text-anchor="end" class="fx-t-sm">+4</text>
<text x="52" y="211" text-anchor="end" class="fx-t-sm">−2</text>
<line x1="60" y1="106" x2="620" y2="106" class="fx-grid"/>
<line x1="60" y1="55.3" x2="620" y2="55.3" class="fx-grid"/>
<line x1="60" y1="207.3" x2="620" y2="207.3" class="fx-grid"/>
<polyline points="69.0,210.0 78.0,207.9 87.0,205.3 96.0,202.5 105.0,199.7 114.0,196.9 123.0,194.1 132.0,191.2 141.0,188.3 150.0,185.5 159.0,182.6 168.0,179.7 177.0,176.8 186.0,173.9 195.0,171.1 204.0,168.2 213.0,165.3 222.0,162.4 231.0,159.5 240.0,156.6 249.0,153.7 258.0,150.9 267.0,148.0 276.0,145.1 285.0,142.2 294.0,139.3 303.0,136.4 312.0,133.5 321.0,130.6 330.0,127.8 339.0,124.9 348.0,122.0 357.0,119.1 366.0,116.2 375.0,113.3 384.0,110.4 393.0,107.5 402.0,104.7 411.0,101.8 420.0,98.9 429.0,96.0 438.0,93.1 447.0,90.2 456.0,87.3 465.0,84.5 474.0,81.6 483.0,78.7 492.0,75.8 501.0,72.9 510.0,70.0 519.0,67.1 528.0,64.3 537.0,61.4 546.0,58.5 555.0,55.6 564.0,52.7 573.0,49.8 582.0,47.0 591.0,44.1 600.0,41.2" class="fx-line-thick"/>
<circle cx="60" cy="211" r="6" class="fx-fill-red"/>
<text x="72" y="228" class="fx-t-bad">a = 0.000001: f = −2.12</text>
<circle cx="240" cy="156.7" r="6" class="fx-fill-orange"/>
<text x="248" y="176" class="fx-t-hl">root σ = 0.1999</text>
<line x1="600" y1="41" x2="630" y2="22" class="fx-line-ok fx-dash"/>
<text x="628" y="18" text-anchor="end" class="fx-t-ok">b = 5.0: f = +50.3 (off the chart)</text>
<text x="60" y="246" class="fx-t-sm">σ from 0 to 0.60 · 30-day 100 call, market price 2.45 · f(σ) = C_BS(σ) − 2.45</text>
<text x="380" y="190" class="fx-t-sm">brentq only needs the sign change</text>
</svg>
<figcaption>Figure 2 · Solving for implied volatility. At almost zero volatility the call is worth only its discounted forward intrinsic value (0.33), so \(f\) is negative; at σ = 5 it is worth almost the stock, so \(f\) is hugely positive. One sign change guarantees one root — here σ = 0.1999, because the quote 2.45 is the model price 2.4513 rounded down.</figcaption>
</figure>

> [!EXAMPLE] Four implied vols, one of them impossible
> ```python
> T = 30 / 365
> print(round(implied_vol(2.45, 100, 100, T, 0.04), 4))   # 0.1999  the quoted 2.45
> print(round(implied_vol(0.70, 100, 105, T, 0.04), 4))   # 0.1985  105 call at the bid
> print(round(implied_vol(0.72, 100, 105, T, 0.04), 4))   # 0.2008  105 call at the ask
> print(implied_vol(0.01, 100, 90, T, 0.04))              # nan     below intrinsic: impossible
> ```
> The 105 call's quote of 0.70 / 0.72 is a spread of \(20.08\% - 19.85\% = 0.23\) vol points — the same number Kai used in [[first-trade]]. The last line asks for a 90-strike call at 0.01 when it is worth at least \(100 - 90e^{-0.04 \times 30/365} = 10.30\): no volatility can do that, and the function says so with `nan` instead of returning garbage.

### ④ Whole chains at once: vectorizing with numpy and pandas

Because every operation is element-wise, passing an array of strikes prices a whole chain in one call — no Python loop. pandas then turns the arrays into a table ([[option-chain]]):

```python
import pandas as pd

T = 30 / 365
strikes = np.arange(90, 111, 5.0)
g = greeks(100, strikes, T, 0.04, 0.20)
chain = pd.DataFrame({
    "strike": strikes,
    "call": bs_price(100, strikes, T, 0.04, 0.20),
    "put": bs_price(100, strikes, T, 0.04, 0.20, "put"),
    "delta": g["delta"],
    "gamma": g["gamma"],
})
print(chain.round(4).to_string(index=False))
gap = chain["call"] - chain["put"] - (100 - chain["strike"] * np.exp(-0.04 * T))
print(np.allclose(gap, 0))
```

It prints (column spacing can differ slightly between pandas versions):

```text
 strike    call    put  delta  gamma
   90.0 10.3562 0.0608 0.9728 0.0109
   95.0  5.8207 0.5089 0.8366 0.0430
  100.0  2.4513 2.1230 0.5343 0.0693
  105.0  0.7129 5.3683 0.2222 0.0519
  110.0  0.1379 9.7768 0.0575 0.0201
True
```

Every row is a number you have met: 2.45 and 2.12 at the money, 0.71 for Kai's 105 call, 0.51 for the 95 put. The last line checks parity on every row at once. Try other inputs in the widget — it prints the same table live:

::demo[python-pricing-chain]

On real data, the inputs come from the cleaning pipeline of [[options-data]]: an implied forward from parity, a rate, and mids rather than last trades. Vectorizing matters there — a full index chain has thousands of strikes across dozens of expiries, and a loop in pure Python would be far slower than one numpy call.

### ⑤ Tests: known answers and self-consistency

A test file makes the checks automatic. With `pytest` installed, running `pytest` finds every function named `test_…` and reports failures:

```python
import numpy as np
from pricing import bs_price, greeks, implied_vol


def test_textbook_values():                      # Hull-style check set: S = K = 100, T = 1, r = 5%, sigma = 20%
    assert abs(bs_price(100, 100, 1, 0.05, 0.20) - 10.4506) < 1e-4
    assert abs(bs_price(100, 100, 1, 0.05, 0.20, "put") - 5.5735) < 1e-4


def test_put_call_parity():
    S, K, T, r = 100, 105, 30 / 365, 0.04
    c, p = bs_price(S, K, T, r, 0.2), bs_price(S, K, T, r, 0.2, "put")
    assert abs((c - p) - (S - K * np.exp(-r * T))) < 1e-10


def test_delta_matches_a_bump():                 # analytic delta vs a finite difference
    h, T = 0.01, 30 / 365
    bump = (bs_price(100 + h, 100, T, 0.04, 0.2) - bs_price(100 - h, 100, T, 0.04, 0.2)) / (2 * h)
    assert abs(greeks(100, 100, T, 0.04, 0.2)["delta"] - bump) < 1e-6


def test_iv_round_trip():
    price = bs_price(100, 95, 30 / 365, 0.04, 0.27, "put")
    assert abs(implied_vol(price, 100, 95, 30 / 365, 0.04, "put") - 0.27) < 1e-8
```

The four tests are of two kinds. **Known-answer tests** (the first) compare with numbers computed independently — textbooks, another library, a colleague's spreadsheet. **Self-consistency tests** (the other three) check that the code agrees with itself: parity, a central finite difference \(\frac{V(S+h) - V(S-h)}{2h}\) that should match the analytic delta to about \(h^2\), and price → vol → price. Self-consistency catches sign and algebra slips; only known answers catch a consistent misunderstanding, like days instead of years. The tolerances are deliberate: \(10^{-4}\) for published four-decimal values, \(10^{-10}\) for an identity that should hold to rounding error.

> [!WARN] Code from an AI assistant gets the same tests
> Language models write this module in seconds, and usually correctly. The failures are the silent kind: theta per year instead of per day, vega per 1.00 instead of per point, a put built with \(\N(d_2)\) instead of \(\N(-d_2)\), a dividend yield subtracted in the wrong place. Run the tests before you use any number ([[ai-agents]]).

### ⑥ Plotting the Greeks

With vectorized functions, a plot is a few lines of matplotlib. This draws the gamma and daily theta of the 100 call for three expiries:

```python
import matplotlib.pyplot as plt

S = np.linspace(70, 130, 241)
fig, ax = plt.subplots(1, 2, figsize=(10, 4))
for days in (7, 30, 90):
    g = greeks(S, 100, days / 365, 0.04, 0.20)
    ax[0].plot(S, g["gamma"], label=f"{days} days")
    ax[1].plot(S, g["theta"], label=f"{days} days")
ax[0].set_title("Gamma of the 100 call")
ax[1].set_title("Theta per day")
for a in ax:
    a.set_xlabel("XYZ price")
    a.axvline(100, ls=":", c="grey")
    a.legend()
plt.tight_layout()
plt.show()
```

<figure>
<svg viewBox="0 0 660 260" role="img" aria-label="Gamma of the 100 call against the stock price for 7, 30 and 90 days">
<line x1="60" y1="220" x2="625" y2="220" class="fx-axis"/>
<line x1="60" y1="25" x2="60" y2="220" class="fx-axis"/>
<line x1="60" y1="156.7" x2="620" y2="156.7" class="fx-grid"/>
<line x1="60" y1="93.3" x2="620" y2="93.3" class="fx-grid"/>
<line x1="60" y1="30" x2="620" y2="30" class="fx-grid"/>
<text x="52" y="224" text-anchor="end" class="fx-t-sm">0</text>
<text x="52" y="160" text-anchor="end" class="fx-t-sm">0.05</text>
<text x="52" y="97" text-anchor="end" class="fx-t-sm">0.10</text>
<text x="52" y="34" text-anchor="end" class="fx-t-sm">0.15</text>
<text x="60" y="238" text-anchor="middle" class="fx-t-sm">70</text>
<text x="200" y="238" text-anchor="middle" class="fx-t-sm">85</text>
<text x="340" y="238" text-anchor="middle" class="fx-t-sm">100</text>
<text x="480" y="238" text-anchor="middle" class="fx-t-sm">115</text>
<text x="620" y="238" text-anchor="middle" class="fx-t-sm">130</text>
<line x1="340" y1="25" x2="340" y2="220" class="fx-line-muted fx-dash"/>
<polyline points="60.0,219.8 64.7,219.8 69.3,219.7 74.0,219.6 78.7,219.5 83.3,219.4 88.0,219.3 92.7,219.1 97.3,218.9 102.0,218.7 106.7,218.4 111.3,218.1 116.0,217.8 120.7,217.4 125.3,217.0 130.0,216.5 134.7,215.9 139.3,215.3 144.0,214.6 148.7,213.8 153.3,213.0 158.0,212.0 162.7,211.0 167.3,209.9 172.0,208.8 176.7,207.5 181.3,206.2 186.0,204.8 190.7,203.3 195.3,201.8 200.0,200.2 204.7,198.5 209.3,196.8 214.0,195.1 218.7,193.3 223.3,191.5 228.0,189.7 232.7,188.0 237.3,186.2 242.0,184.4 246.7,182.7 251.3,181.0 256.0,179.4 260.7,177.9 265.3,176.4 270.0,175.1 274.7,173.8 279.3,172.7 284.0,171.6 288.7,170.7 293.3,169.9 298.0,169.3 302.7,168.8 307.3,168.4 312.0,168.2 316.7,168.1 321.3,168.2 326.0,168.3 330.7,168.7 335.3,169.1 340.0,169.7 344.7,170.4 349.3,171.2 354.0,172.1 358.7,173.1 363.3,174.1 368.0,175.3 372.7,176.5 377.3,177.8 382.0,179.1 386.7,180.5 391.3,181.9 396.0,183.4 400.7,184.8 405.3,186.3 410.0,187.8 414.7,189.3 419.3,190.7 424.0,192.2 428.7,193.6 433.3,195.0 438.0,196.3 442.7,197.7 447.3,199.0 452.0,200.2 456.7,201.4 461.3,202.6 466.0,203.7 470.7,204.8 475.3,205.8 480.0,206.8 484.7,207.8 489.3,208.6 494.0,209.5 498.7,210.3 503.3,211.0 508.0,211.7 512.7,212.4 517.3,213.0 522.0,213.5 526.7,214.1 531.3,214.6 536.0,215.0 540.7,215.5 545.3,215.9 550.0,216.2 554.7,216.6 559.3,216.9 564.0,217.2 568.7,217.4 573.3,217.7 578.0,217.9 582.7,218.1 587.3,218.3 592.0,218.5 596.7,218.6 601.3,218.8 606.0,218.9 610.7,219.0 615.3,219.1 620.0,219.2" class="fx-line-blue"/>
<polyline points="60.0,220.0 64.7,220.0 69.3,220.0 74.0,220.0 78.7,220.0 83.3,220.0 88.0,220.0 92.7,220.0 97.3,220.0 102.0,220.0 106.7,220.0 111.3,220.0 116.0,220.0 120.7,220.0 125.3,220.0 130.0,220.0 134.7,220.0 139.3,220.0 144.0,220.0 148.7,219.9 153.3,219.9 158.0,219.9 162.7,219.8 167.3,219.7 172.0,219.6 176.7,219.5 181.3,219.3 186.0,219.0 190.7,218.7 195.3,218.2 200.0,217.6 204.7,216.9 209.3,216.0 214.0,214.8 218.7,213.5 223.3,211.9 228.0,209.9 232.7,207.7 237.3,205.1 242.0,202.2 246.7,198.9 251.3,195.2 256.0,191.3 260.7,187.0 265.3,182.4 270.0,177.7 274.7,172.7 279.3,167.7 284.0,162.7 288.7,157.8 293.3,153.1 298.0,148.6 302.7,144.5 307.3,140.9 312.0,137.7 316.7,135.1 321.3,133.2 326.0,131.9 330.7,131.3 335.3,131.4 340.0,132.2 344.7,133.6 349.3,135.6 354.0,138.2 358.7,141.3 363.3,144.8 368.0,148.6 372.7,152.7 377.3,157.0 382.0,161.4 386.7,165.9 391.3,170.3 396.0,174.7 400.7,179.0 405.3,183.0 410.0,186.9 414.7,190.6 419.3,194.0 424.0,197.1 428.7,200.0 433.3,202.6 438.0,205.0 442.7,207.1 447.3,209.0 452.0,210.6 456.7,212.1 461.3,213.3 466.0,214.4 470.7,215.4 475.3,216.1 480.0,216.8 484.7,217.4 489.3,217.9 494.0,218.3 498.7,218.6 503.3,218.9 508.0,219.1 512.7,219.3 517.3,219.4 522.0,219.5 526.7,219.6 531.3,219.7 536.0,219.8 540.7,219.8 545.3,219.9 550.0,219.9 554.7,219.9 559.3,219.9 564.0,220.0 568.7,220.0 573.3,220.0 578.0,220.0 582.7,220.0 587.3,220.0 592.0,220.0 596.7,220.0 601.3,220.0 606.0,220.0 610.7,220.0 615.3,220.0 620.0,220.0" class="fx-line-hl"/>
<polyline points="60.0,220.0 64.7,220.0 69.3,220.0 74.0,220.0 78.7,220.0 83.3,220.0 88.0,220.0 92.7,220.0 97.3,220.0 102.0,220.0 106.7,220.0 111.3,220.0 116.0,220.0 120.7,220.0 125.3,220.0 130.0,220.0 134.7,220.0 139.3,220.0 144.0,220.0 148.7,220.0 153.3,220.0 158.0,220.0 162.7,220.0 167.3,220.0 172.0,220.0 176.7,220.0 181.3,220.0 186.0,220.0 190.7,220.0 195.3,220.0 200.0,220.0 204.7,220.0 209.3,220.0 214.0,220.0 218.7,220.0 223.3,220.0 228.0,220.0 232.7,220.0 237.3,220.0 242.0,219.9 246.7,219.8 251.3,219.6 256.0,219.3 260.7,218.7 265.3,217.6 270.0,215.8 274.7,212.9 279.3,208.6 284.0,202.5 288.7,193.9 293.3,182.7 298.0,168.6 302.7,151.9 307.3,132.9 312.0,112.5 316.7,92.1 321.3,73.1 326.0,56.9 330.7,45.0 335.3,38.4 340.0,37.7 344.7,42.9 349.3,53.3 354.0,68.0 358.7,85.6 363.3,104.8 368.0,124.2 372.7,142.7 377.3,159.4 382.0,173.8 386.7,185.8 391.3,195.4 396.0,202.8 400.7,208.3 405.3,212.2 410.0,215.0 414.7,216.8 419.3,218.1 424.0,218.8 428.7,219.3 433.3,219.6 438.0,219.8 442.7,219.9 447.3,219.9 452.0,220.0 456.7,220.0 461.3,220.0 466.0,220.0 470.7,220.0 475.3,220.0 480.0,220.0 484.7,220.0 489.3,220.0 494.0,220.0 498.7,220.0 503.3,220.0 508.0,220.0 512.7,220.0 517.3,220.0 522.0,220.0 526.7,220.0 531.3,220.0 536.0,220.0 540.7,220.0 545.3,220.0 550.0,220.0 554.7,220.0 559.3,220.0 564.0,220.0 568.7,220.0 573.3,220.0 578.0,220.0 582.7,220.0 587.3,220.0 592.0,220.0 596.7,220.0 601.3,220.0 606.0,220.0 610.7,220.0 615.3,220.0 620.0,220.0" class="fx-line-bad"/>
<text x="352" y="40" class="fx-t-bad">7 days: 0.144</text>
<text x="398" y="160" class="fx-t-hl">30 days: 0.069</text>
<text x="470" y="192" class="fx-t-blue">90 days: 0.040</text>
<text x="620" y="256" text-anchor="end" class="fx-t-sm">XYZ price · 100 call, σ = 20%, r = 4%</text>
</svg>
<figcaption>Figure 3 · What the left-hand plot shows (computed with the same formulas). Gamma peaks at the strike and the peak roughly doubles each time the time to expiry is quartered, like \(1/\sqrt{T}\): 0.040 at 90 days, 0.069 at 30, 0.144 at 7 — the reason short-dated options are so jumpy ([[gamma]]).</figcaption>
</figure>

### ⑦ Cross-checks: a binomial tree and Monte Carlo

The strongest test of a pricing function is a **different method** that must agree. Two are short enough to write here. The Cox–Ross–Rubinstein tree from [[binomial-trees]], vectorized across each time step and able to exercise early:

```python
def crr_price(S, K, T, r, sigma, kind="put", steps=500, american=True):
    """Cox-Ross-Rubinstein tree; american=True checks early exercise at every node."""
    dt = T / steps
    u = np.exp(sigma * np.sqrt(dt))
    d = 1 / u
    p = (np.exp(r * dt) - d) / (u - d)                 # risk-neutral up-probability
    disc = np.exp(-r * dt)
    j = np.arange(steps + 1)
    ST = S * u**j * d**(steps - j)                     # prices at expiry, lowest first
    payoff = (lambda x: np.maximum(K - x, 0.0)) if kind == "put" else (lambda x: np.maximum(x - K, 0.0))
    V = payoff(ST)
    for i in range(steps - 1, -1, -1):                 # walk back one step at a time
        ST = ST[: i + 1] * u                           # node prices one step earlier
        V = disc * (p * V[1:] + (1 - p) * V[:-1])
        if american:
            V = np.maximum(V, payoff(ST))
    return float(V[0])
```

With the textbook inputs it prints **6.0888** for the American put and **5.5695** for the European one, against the formula's 5.5735 — the tree's small gap is its discretization error, which shrinks as `steps` grows. The difference \(6.09 - 5.57 = 0.52\) is the **early-exercise premium** that no Black–Scholes formula can give you ([[american-exercise]]).

Monte Carlo ([[monte-carlo]]) averages discounted payoffs over simulated risk-neutral prices. Its estimate is random, so it must be reported with a standard error:

$$
\hat C = e^{-rT}\,\frac{1}{n}\sum_{i=1}^{n} \max\!\big(S_T^{(i)} - K,\ 0\big), \qquad \text{SE} = \frac{s}{\sqrt{n}}
$$

where \(S_T^{(i)} = S\exp\!\big((r - \tfrac12\sigma^2)T + \sigma\sqrt{T}\,Z_i\big)\) is the \(i\)-th simulated price, \(s\) the sample standard deviation of the discounted payoffs and \(n\) the number of independent samples.

```python
def mc_call(S, K, T, r, sigma, n=100_000, seed=42):
    """Monte Carlo under Q with antithetic pairs. Returns (price, standard error)."""
    rng = np.random.default_rng(seed)
    z = rng.standard_normal(n // 2)
    drift, vol = (r - 0.5 * sigma**2) * T, sigma * np.sqrt(T)
    pay_up = np.maximum(S * np.exp(drift + vol * z) - K, 0.0)
    pay_dn = np.maximum(S * np.exp(drift - vol * z) - K, 0.0)
    pairs = np.exp(-r * T) * 0.5 * (pay_up + pay_dn)   # one number per antithetic pair
    return pairs.mean(), pairs.std(ddof=1) / np.sqrt(len(pairs))
```

> [!EXAMPLE] What the Monte Carlo check should print
> For the textbook call, 100,000 draws in 50,000 antithetic pairs give a standard error of about **0.03**. So `mc_call(100, 100, 1, 0.05, 0.20)` should land within about \(2 \times 0.033 \approx 0.07\) of 10.4506 — the exact digits depend on the random generator and the seed. A test for it compares with a tolerance of a few standard errors, never with equality: `assert abs(price - 10.4506) < 4 * se`.

Three methods, one number: the formula's 10.4506, the tree converging to it, the simulation scattering around it. **When independent methods agree, you can trust all three; when they disagree, one of them has a bug** — which is Idea ② seen from the programmer's side.

## @analogy
Writing a pricing library is like **building a kitchen scale**. Getting it to show a number is easy — any spring and a dial will do. Knowing the number is *right* takes calibration weights: a 1-kilogram weight that must read exactly 1.000 (the textbook 10.4506). Then consistency checks: put two items on together and the reading must equal the sum of their separate readings (parity); add one gram and the reading must rise by one gram (the delta bump). A scale that reads every item 3% heavy passes the consistency checks perfectly — only the calibration weight exposes it (days instead of years). Finally, a second scale of a different design (the tree, the simulation) should agree with the first.

The analogy breaks at one point: a kitchen scale measures something that exists. A pricing model computes a *fair value under assumptions*. Passing every test proves the code implements Black–Scholes correctly; it does not prove Black–Scholes is the right model for the option ([[bs-assumptions]]).

## @misconceptions
- **“It runs without errors, so it's correct.”** — Pricing bugs fail silently: days instead of years, vega per 1.00 instead of per point, a missing discount factor. Only tests against known values catch them.
- **“Put–call parity is a complete test.”** — Parity checks internal consistency. A function that uses the wrong time unit everywhere satisfies parity exactly; you also need an external known answer such as 10.4506.
- **“Implied volatility always exists.”** — Only for prices strictly inside the no-arbitrage bounds. Below intrinsic (or its discounted form) no volatility fits, and a robust solver returns `nan` rather than a meaningless number.
- **“Newton's method is always the right solver.”** — It is fast near the money but divides by vega, which is tiny for deep out-of-the-money and very short options. A bracketing solver such as Brent's method is guaranteed to converge when the bracket has a sign change.
- **“A Monte Carlo price should equal the formula exactly.”** — It is an estimate with a standard error of about \(s/\sqrt{n}\). Test it with a tolerance of a few standard errors, and expect different digits with a different seed.

## @takeaways
- The Black–Scholes–Merton function is about ten lines of numpy; fix units first (T in years, σ and rates as decimals, prices per share) because most bugs are unit bugs.
- Convert Greeks to trading units inside the function: theta per day (÷365), vega per vol point (÷100), rho per 1% (÷100); for the 30-day ATM call: Δ 0.5343, Γ 0.0693, vega 0.114, Θ −0.0436.
- Solve implied volatility with a bracketing root-finder (`brentq`) after checking the no-arbitrage bounds; return `nan` when no volatility fits.
- Test with both known answers (10.4506 / 5.5735; 9.9251 / 6.0040) and self-consistency (parity, a finite-difference delta, an IV round trip); consistency alone misses consistent mistakes.
- Cross-check with independent methods: the CRR tree gives 6.0888 for the American put (5.5695 European vs 5.5735 exact); Monte Carlo agrees within its standard error.

## @quiz
1. Your `bs_price(100, 100, 1, 0.05, 0.20)` prints 10.4506 and the put prints 5.5735. Which statement is justified?
   - [ ] The function is correct for every input
   - [x] It reproduces the textbook check set, a strong sign the formula and units are right for these inputs
   - [ ] Black–Scholes is the right model for real options
   - [ ] No further tests are needed for the Greeks
   > A known-answer test is the strongest single check, but it tests these inputs and this function. The Greeks need their own tests, and passing tests proves the code implements the model, not that the model fits the market.
2. A colleague's function passes the parity test and the IV round-trip test but prints about 100 for the textbook call. What is the most likely bug?
   - [ ] The put formula uses \(\N(d_2)\) instead of \(\N(-d_2)\)
   - [ ] Vega is not divided by 100
   - [ ] The strike is not discounted
   - [x] Time is passed in days instead of years
   > With \(T = 365\) used consistently, parity and round trips hold exactly, but the option priced is a 365-year call, worth nearly the stock. A wrong put formula or a missing discount would break parity; the vega bug does not affect prices.
3. Why does the lesson use `brentq` with the bracket \([10^{-6}, 5]\) for implied volatility?
   - [x] The price rises with σ, so if the market price is inside the no-arbitrage bounds, \(f(\sigma)\) changes sign once in the bracket and a bracketing method must converge
   - [ ] Because Newton's method cannot be written in Python
   - [ ] Because implied volatility is always between 0 and 1
   - [ ] Because `brentq` does not need the price function
   > Brent's method needs only a sign change and is guaranteed to converge; Newton's method divides by vega and can overshoot when vega is small. The bounds check first rules out prices no volatility can produce.
4. `greeks(100, 100, 30/365, 0.04, 0.20)` returns theta −0.0436. What does that mean for one contract?
   - [ ] It loses $0.0436 a day
   - [ ] It loses $4.36 a year
   - [x] It loses about $4.36 a day if nothing else changes
   - [ ] It loses 4.36% of its value a day
   > The function returns theta per share per calendar day (the yearly theta ÷ 365). One contract is 100 shares: \(0.0436 \times 100 = \$4.36\) a day, all else equal.
5. A Monte Carlo call price with 50,000 antithetic pairs prints 10.47 with a standard error of 0.03. The formula gives 10.4506. What should the test conclude?
   - [ ] Failure: the numbers are not equal
   - [x] Pass: the difference of 0.02 is well within a few standard errors
   - [ ] Failure: Monte Carlo must be within 0.0001
   - [ ] Pass only if the seed is 42
   > A simulated price is an estimate; the right test is \(|\hat C - C| <\) a few standard errors. \(|10.47 - 10.4506| \approx 0.02 < 4 \times 0.03\). Different seeds give different digits, all consistent with the formula.

## @further
- [SciPy: scipy.stats.norm](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.norm.html) — the distribution functions behind \(\N(\cdot)\) and \(\varphi(\cdot)\).
- [SciPy: scipy.optimize.brentq](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.brentq.html) — Brent's bracketing root-finder used for implied volatility.
- [NumPy: broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html) — why one function prices a whole chain without loops.
- [pytest documentation](https://docs.pytest.org/) — writing and running the test file.
- [Black & Scholes (1973), The Pricing of Options and Corporate Liabilities](https://doi.org/10.1086/260062) — the formula the module implements.
- [Binomial options pricing model (Wikipedia)](https://en.wikipedia.org/wiki/Binomial_options_pricing_model) — the Cox–Ross–Rubinstein tree used as a cross-check, with its history.

## @next
A tested pricing function is a building block. The next question is the one every income trader eventually asks: what would a rule like “sell a 5% out-of-the-money put every month” have done over years of prices, once spreads, fees and the occasional crash are included? The next lesson builds that backtest in pandas, line by line.
