---
id: neural-pricing
prereqs: stochastic-vol, surface-calibration, monte-carlo, deep-hedging
demo: neural-pricing
---

# Neural Pricing & Deep Calibration

## @hook
Fitting a stochastic-volatility model to one options surface can take a hundred thousand price calculations. If each takes milliseconds, the fit takes minutes; if each needs Monte Carlo, far longer. Train a network once to imitate the slow pricer and the same fit takes well under a second. The catch is the whole lesson: the imitation is only trustworthy where it was trained.

## @bridge
[[stochastic-vol]] gave us models such as Heston and rough volatility that reproduce the smile far better than Black-Scholes — and are much slower to price. [[surface-calibration]] fitted a model to quotes by minimizing a loss, which means calling the pricer over and over. [[deep-hedging]] used a network as a *decision rule*; this lesson uses one as a *fast function*: a stand-in for a slow model, called a **surrogate**. It builds Idea ③ (the volatility surface is the thing being fitted) and leans on Idea ② (a fast pricer is useless if its prices allow arbitrage).

## @intuition
Start with the smallest calibration there is.

The market shows nine XYZ 30-day calls with strikes from about $90 to $110. Which single volatility σ makes Black-Scholes match them best? A computer answers by trial: guess σ, price all nine options, measure the misfit, adjust σ, repeat. In the main demo this search calls the pricer **1,026 times** to pin σ down to a hundredth of a percent. Black-Scholes is instant, so nobody notices.

Now make it realiztic. Heston has five parameters, and a real surface has a few hundred quotes across strikes and expiries. A gradient-based optimizer that needs 100 iterations, each pricing 200 quotes six times (once for the loss, five more for the slopes), makes about **120,000 pricing calls**. In this course's engine one Heston price takes a few milliseconds in a browser — call it 4 ms — so that is \(120{,}000 \times 4\ \text{ms} = 480\ \text{s}\), eight minutes, for one fit. Rough-volatility models, which usually need Monte Carlo ([[monte-carlo]]), are slower still. Desks refit many times a day.

> [!KAI] The surface on Kai's screen
> Kai's trading app draws a smooth implied-volatility surface for XYZ and redraws it as quotes change. A smooth surface is a *fitted* surface: somewhere a model is being refitted to hundreds of noisy quotes, again and again. The faster the pricer, the richer the model a platform can afford to refit every few seconds.

The trick is to split the work in two. **Offline**, once, with no time pressure: pick many parameter sets, price them with the slow model, and train a network to reproduce the results. **Online**, every time you calibrate: let the optimizer call the network instead of the slow model. The network answers in microseconds. In the demo the surrogate prices an option in about 3 µs, roughly a thousand times faster than the Heston engine.

<figure>
<svg viewBox="0 0 680 270" role="img" aria-label="Offline training and online calibration pipeline for a neural pricing surrogate">
<defs><marker id="neural-pricing-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-arrowhead"/></marker></defs>
<text x="20" y="22" class="fx-t-b">Offline — once, slow, no deadline</text>
<rect x="20" y="34" width="190" height="66" rx="8" class="fx-box2"/>
<text x="115" y="60" text-anchor="middle" class="fx-t-b">Sample parameters θ</text>
<text x="115" y="80" text-anchor="middle" class="fx-t-sm">many model settings</text>
<rect x="245" y="34" width="190" height="66" rx="8" class="fx-box2"/>
<text x="340" y="60" text-anchor="middle" class="fx-t-b">Slow pricer</text>
<text x="340" y="80" text-anchor="middle" class="fx-t-sm">Fourier or Monte Carlo</text>
<rect x="470" y="34" width="190" height="66" rx="8" class="fx-hl"/>
<text x="565" y="60" text-anchor="middle" class="fx-t-b">Train network F</text>
<text x="565" y="80" text-anchor="middle" class="fx-t-sm">θ → prices or IV grid</text>
<line x1="210" y1="67" x2="243" y2="67" class="fx-line" marker-end="url(#neural-pricing-ah)"/>
<line x1="435" y1="67" x2="468" y2="67" class="fx-line" marker-end="url(#neural-pricing-ah)"/>
<line x1="565" y1="100" x2="565" y2="168" class="fx-line-hl fx-dash" marker-end="url(#neural-pricing-ah)"/>
<text x="572" y="140" class="fx-t-hl">frozen weights</text>
<text x="20" y="150" class="fx-t-b">Online — every calibration, milliseconds</text>
<rect x="20" y="170" width="190" height="66" rx="8" class="fx-box"/>
<text x="115" y="196" text-anchor="middle" class="fx-t-b">Market quotes</text>
<text x="115" y="216" text-anchor="middle" class="fx-t-sm">IVs across strikes, expiries</text>
<rect x="245" y="170" width="190" height="66" rx="8" class="fx-box"/>
<text x="340" y="196" text-anchor="middle" class="fx-t-b">Optimizer</text>
<text x="340" y="216" text-anchor="middle" class="fx-t-sm">proposes θ, measures misfit</text>
<rect x="470" y="170" width="190" height="66" rx="8" class="fx-hl"/>
<text x="565" y="196" text-anchor="middle" class="fx-t-b">Network F</text>
<text x="565" y="216" text-anchor="middle" class="fx-t-sm">answers in microseconds</text>
<line x1="210" y1="203" x2="243" y2="203" class="fx-line" marker-end="url(#neural-pricing-ah)"/>
<line x1="435" y1="195" x2="468" y2="195" class="fx-line" marker-end="url(#neural-pricing-ah)"/>
<line x1="468" y1="213" x2="437" y2="213" class="fx-line" marker-end="url(#neural-pricing-ah)"/>
<text x="340" y="258" text-anchor="middle" class="fx-t-sm">thousands of round trips → calibrated parameters θ̂</text>
</svg>
<figcaption>Figure 1 · Deep calibration splits the job. The expensive part (generating training prices with the slow model) is done once; the part that must be fast (the optimizer's thousands of calls) goes to the trained network. The slow model is never thrown away — it produced every training label, and it is used again to check the answers.</figcaption>
</figure>

There is a price for the speed. A network does not *know* option theory; it has only seen examples. Inside the region it was trained on it can be excellent. Outside, it has nothing to go on — and it does not say “I don't know”. It just returns a number.

::demo[neural-pricing-extrap]

> [!THINK] The surrogate in the main demo was trained on σ between 10% and 40%. A panic pushes the market's true σ to 60%. What will calibrating with the surrogate report?
> Predict before you open the answer.
> ---
> Not 60%. With 300 features the surrogate calibrates to about 48.8% — and the exact pricer finds 60.0% from the same quotes. The optimizer did its job; the pricer it was given simply has no idea what a 60% world looks like. Worse, nothing in the output warns you. The only defense is to check inputs against the training box before trusting the answer.

We'll take it in five parts:

- **① Why calibration needs speed**
- **② Surrogates: learning the pricer offline**
- **③ Inside the demo's network: random features and ridge regression**
- **④ Three ways a surrogate fails**
- **⑤ Where neural pricing stands in 2026**

## @mechanics
### ① Why calibration needs speed

Calibration is an optimization over model parameters \(\theta\) (for Heston: \(v_0, \kappa, \theta_v, \xi, \rho\)):

$$
\hat\theta = \arg\min_{\theta}\ \sum_{i=1}^{n} w_i\,\big(\sigma^{\text{model}}_i(\theta) - \sigma^{\text{mkt}}_i\big)^2
$$

where \(\sigma^{\text{mkt}}_i\) is the market's implied volatility for quote \(i\) (one strike and expiry), \(\sigma^{\text{model}}_i(\theta)\) the implied volatility the model produces with parameters \(\theta\), \(w_i\) a weight (often larger for liquid, near-the-money quotes; [[surface-calibration]]) and \(n\) the number of quotes. Each evaluation of the sum needs \(n\) model prices, and the optimizer needs many evaluations.

> [!EXAMPLE] Counting the calls
> One-parameter toy (the demo): 9 quotes; a coarse grid of 96 values of σ plus a golden-section refinement of 18 steps → \((96 + 18) \times 9 = 1{,}026\) pricing calls.
> Heston on a real surface: \(n = 200\) quotes, 100 iterations, 6 loss evaluations each (value plus five finite-difference slopes) → \(200 \times 100 \times 6 = 120{,}000\) calls. At 4 ms each: 480 s. At 3 µs each (the surrogate): 0.36 s.

A thousandfold speed-up changes what is possible: refitting intraday, calibrating to many underlyings at once, running risk scenarios that recalibrate in every scenario, or using models (rough volatility) that would otherwise be too slow for daily use.

### ② Surrogates: learning the pricer offline

A **surrogate** \(F_w\) is a function with weights \(w\) trained to imitate the slow pricer \(P\):

$$
\min_{w}\ \frac{1}{M}\sum_{m=1}^{M} \big\lVert F_w(x_m) - P(x_m) \big\rVert^2
$$

where each training input \(x_m\) combines model parameters and contract terms (for example \(\theta\), strike and expiry), \(P(x_m)\) is the slow model's answer (a price, or a whole grid of implied volatilities), and \(M\) is the number of training examples — often hundreds of thousands, generated offline.

Three designs appear in the literature:

- **Pointwise:** input = parameters + one strike and expiry, output = one price or implied vol. Flexible, like the demo.
- **Grid-based:** input = parameters only, output = implied vols on a fixed strike × expiry grid. One call returns a whole surface; market quotes are interpolated onto the grid. Horvath, Muguruza and Tomas (*Deep learning volatility*, Quantitative Finance, 2021) used this design to calibrate rough-volatility models to a full surface in milliseconds.
- **Inverse map:** input = market quotes, output = the calibrated parameters directly, so no optimizer runs at all. Hernandez (2016) did this for an interest-rate model. It is the fastest, but the network now has to learn the optimizer's job as well, and it cannot tell you how well the result fits.

The two-step (grid or pointwise) designs keep a classical optimizer and a visible misfit, which is why they are the more common choice for equity volatility models.

**The labels are the expensive part.** Every training example needs a slow-model price, so generating the data can take hours of computing. That cost is paid once. The rule for accuracy is simple: the surrogate's error must sit well inside the bid-ask spread of the quotes you calibrate to, or the calibration will fit the surrogate's mistakes instead of the market.

> [!EXAMPLE] The demo's error budget
> With 300 hidden features and 3,000 Black-Scholes training prices, the demo's surrogate has an in-box test error (root mean square) of about **2.3 cents** and a worst case of about **22 cents**. For Kai's 30-day 100 call it says $2.42 against the true $2.45; for the 105 call, $0.73 against $0.71. The average is tolerable; the worst case is not — a 22-cent error on a contract quoted 5 cents wide would dominate any fit. **Always look at the maximum error, not just the average.**

### ③ Inside the demo's network: random features and ridge regression

The demo uses the simplest network that can be trained in a browser in a fraction of a second: one hidden layer whose weights are *random and frozen*, with only the output layer fitted:

$$
F(x) = \sum_{j=1}^{J} \beta_j\,\tanh\!\big(a_j^{\top} u(x) + c_j\big), \qquad \beta = \big(\Phi^{\top}\Phi + \lambda I\big)^{-1}\Phi^{\top} y
$$

where \(u(x)\) rescales the three inputs (log-moneyness \(\ln(K/S)\), days to expiry, σ) to the interval \([-1, 1]\) over the training box; \(a_j, c_j\) are random hidden weights; \(\tanh\) is the activation, an S-shaped curve that flattens out at \(\pm 1\); \(\Phi\) is the table of hidden-feature values, one row per training example and one column per feature; \(y\) holds the true prices; \(\lambda\) is a small ridge penalty that keeps the weights \(\beta\) from blowing up; and \(I\) is the identity matrix.

Because the hidden layer is fixed, training is one linear solve — no gradient descent. The demo builds a \(304 \times 304\) system (300 features plus a constant and three linear terms) from 3,000 prices and solves it in well under a second. A full deep network trains all layers by gradient descent and reaches far smaller errors, but it fails in the same ways, which is why this small version is worth playing with.

> [!DEEP] Why tanh networks flatten out
> Far outside the training box, \(a_j^{\top}u\) becomes large for most features, so each \(\tanh\) sits near \(+1\) or \(-1\) and stops changing. The network then behaves like a constant plus whatever linear terms it has — it flattens or drifts in a straight line, regardless of what the true price does. Other activations fail differently (ReLU networks extend their last linear pieces forever), but none of them *know* the price should keep growing with volatility.

### ④ Three ways a surrogate fails

**1. Extrapolation.** Inside the box the demo's surrogate is within a few cents. Outside it is wrong by dollars:

| Query (the box is 7–90 days, σ 10–40%, \(\lvert\ln(K/S)\rvert \le 0.2\)) | True price | Surrogate |
|---|---|---|
| ATM, 30 days, σ = 20% (inside) | $2.45 | $2.42 |
| ATM, 30 days, σ = 60% | $7.01 | $17.65 |
| ATM, 180 days, σ = 20% | $6.57 | $15.53 |
| ATM, 1 year, σ = 20% | $9.93 | $64.10 |

<figure>
<svg viewBox="0 0 660 250" role="img" aria-label="A one-input surrogate flattens outside its training range">
<line x1="70" y1="200" x2="620" y2="200" class="fx-axis"/>
<line x1="70" y1="30" x2="70" y2="200" class="fx-axis"/>
<rect x="98" y="30" width="171" height="170" class="fx-area-hl"/>
<text x="183" y="46" text-anchor="middle" class="fx-t-hl">training range</text>
<text x="183" y="62" text-anchor="middle" class="fx-t-sm">σ 10%–40%</text>
<polyline points="70,190 84,186 98,182 113,178 127,174 141,170 155,166 169,162 184,158 198,154 212,150 226,146 241,142 255,138 269,134 283,130 297,126 312,122 326,118 340,114 354,110 368,106 383,102 397,98 411,94 425,90 439,86 454,82 468,78 482,74 496,70 511,66 525,62 539,58 553,54 567,50 582,46 596,42 610,38" class="fx-line-muted"/>
<polyline points="70,190 84,186 98,182 113,178 127,174 141,170 155,166 169,162 184,158 198,154 212,150 226,146 241,142 255,138 269,134 283,130 297,126 312,122 326,118 340,115 354,112 368,110 383,108 397,107 411,105 425,104 439,102 454,101 468,99 482,98 496,96 511,95 525,93 539,92 553,90 567,88 582,87 596,85 610,83" class="fx-line-hl"/>
<line x1="610" y1="38" x2="610" y2="83" class="fx-line-bad"/>
<text x="604" y="142" text-anchor="end" class="fx-t-bad">at σ = 100%: true $11.54,</text>
<text x="604" y="158" text-anchor="end" class="fx-t-bad">surrogate $8.34</text>
<text x="440" y="75" class="fx-t-sm">true price</text>
<text x="440" y="118" class="fx-t-hl">surrogate</text>
<text x="62" y="204" text-anchor="end" class="fx-t-sm">$0</text>
<text x="62" y="134" text-anchor="end" class="fx-t-sm">$5</text>
<text x="62" y="64" text-anchor="end" class="fx-t-sm">$10</text>
<text x="98" y="218" text-anchor="middle" class="fx-t-sm">10%</text>
<text x="269" y="218" text-anchor="middle" class="fx-t-sm">40%</text>
<text x="439" y="218" text-anchor="middle" class="fx-t-sm">70%</text>
<text x="610" y="218" text-anchor="middle" class="fx-t-sm">100%</text>
<text x="345" y="240" text-anchor="middle" class="fx-t-sm">volatility σ — XYZ 30-day ATM call, surrogate with 20 tanh features</text>
</svg>
<figcaption>Figure 2 · The inline demo's default surrogate. Inside the shaded range the two curves are indistinguishable; beyond 40% the surrogate's hidden units saturate and it flattens, while the true price keeps rising almost linearly in σ. At σ = 100% it is off by more than $3.</figcaption>
</figure>

The defense is boring and essential: record the training box, check every input against it, and fall back to the slow model (or refuse) outside it. Sample the box generously — markets visit extreme volatilities exactly when accuracy matters most.

**2. Arbitrage violations.** A surrogate fitted to prices does not automatically respect the no-arbitrage rules from [[arbitrage-bounds]]: prices must be non-negative, fall as the strike rises, and be convex in the strike (butterflies worth at least zero). The demo's surrogate breaks these *inside* its own training box: about 4% of the points on a fine grid get slightly negative prices (deep out-of-the-money, where the true price is near zero), and on a 1% strike grid roughly one butterfly check in ten comes out negative. Fixes include penalizing violations in the training loss, fitting a representation that is arbitrage-free by construction (for example outputting SVI parameters and applying the conditions from [[surface-calibration]]), or projecting the output onto the arbitrage-free set.

**3. Greeks and explainability.** A surrogate that is accurate in *price* can be poor in *slope*. Greeks computed by differentiating the network (automatic differentiation makes that easy) inherit its wiggles; a gamma computed from a slightly wavy price curve can be badly wrong. Validation therefore compares Greeks as well as prices against the slow model, on points the network never saw.

> [!WARN] A surrogate is a cache, not a model
> The network knows nothing the slow model did not tell it. It cannot be *more* right than the model it imitates, it is only accurate where it was trained, and its errors are silent. Treat it like a cache in front of the real pricer: fast on the common path, checked regularly, and bypassed whenever an input falls outside what was cached.

### ⑤ Where neural pricing stands in 2026

Three uses have moved beyond demonstrations:

- **Deep calibration.** Hernandez (2016) showed that a network could replace a calibration routine; from 2019, work such as Horvath, Muguruza and Tomas trained networks to map model parameters to implied-volatility grids, making rough-volatility models ([[stochastic-vol]]) fast enough to calibrate routinely. The two-step design in Figure 1 is the standard pattern.
- **Speeding up risk engines.** Whole-portfolio valuation under thousands of scenarios (for margin, capital or counterparty risk) calls pricers millions of times; surrogates for the slowest products are a natural fit, with the slow model kept for validation.
- **Surface nowcasting and interpolation.** Networks trained on historical surfaces fill gaps between quotes, smooth stale strikes and suggest where the surface is heading. Here the target is market data, not a model, so the concerns of [[vol-forecasting]] and [[options-data]] — noise, look-ahead, regime change — come back in full.

What has not changed: the model still sets the economics, the surrogate only makes it fast. How widely any particular firm runs surrogates in production is not public, so treat claims with care. The next lesson, [[rl-market-making]], swaps the “learn a function” framing for “learn a strategy by trial and error”.

## @analogy
Think of a student facing a timed exam who has memorized the answers to a big book of past papers instead of learning the method. On any question that looks like the book, the student answers instantly and correctly — far faster than a classmate who works everything out from first principles. That is the surrogate: the slow classmate is the Heston pricer, the book of past papers is the training set, and memorizing is training.

Give the student a question from outside the book — a different kind of problem, bigger numbers than anything they practiced — and they still answer instantly, with the same confidence, but now they are guessing from the nearest thing they remember. They do not say “I have not seen this”. A smart teacher does two things: writes the book to cover every kind of question likely to appear (sample the training box generously, especially the extremes), and checks the student's answers against the slow classmate from time to time (validation against the real model).

Where the analogy breaks: a student who memorized enough examples often *does* start to grasp the method. A surrogate never does — it can interpolate smoothly between examples, but it has no idea why the answers are what they are, so no amount of memorizing makes it trustworthy outside the book.

## @misconceptions
- **“A neural pricer is a better model than Heston.”** — It imitates Heston (or whatever produced its training data). It can be faster, never more correct: its best case is to reproduce the model it learned from.
- **“Low average error means the surrogate is safe.”** — The demo averages 2.3 cents but its worst case is about 22 cents, and the worst cases cluster at the edges of the training box — exactly where stressed markets go. Check the maximum error and the Greeks, not just the mean.
- **“Networks generalize, so they handle unusual markets.”** — They interpolate between examples. Outside the training box the demo's surrogate prices a 1-year ATM call at $64.10 instead of $9.93, with no warning.
- **“If it fits the prices, it is arbitrage-free.”** — Small errors are enough to create negative prices or negative butterflies, and the demo's surrogate has both inside its own training box. No-arbitrage has to be imposed, not hoped for.
- **“Deep calibration means you no longer need the slow model.”** — The slow model generated every training label and remains the reference for validation and for any input outside the training box.

## @takeaways
- Calibration calls the pricer thousands to hundreds of thousands of times; a surrogate trained offline makes each call microseconds instead of milliseconds.
- A surrogate \(F_w\) is trained to minimize its squared error against a slow pricer on sampled parameters; generating the labels is the expensive, one-off step.
- Surrogates are accurate only inside their training region; outside they are confidently wrong, so inputs must be checked against the box.
- Fitting prices does not guarantee no-arbitrage; constraints must be built into the loss or the output representation.
- A surrogate is a cache in front of the real model — validated against it, never a replacement for it.

## @quiz
1. Why does deep calibration train the network *offline* and use it *online*?
   - [ ] Because the network must be retrained on every new set of quotes
   - [x] Because generating slow-model prices for training is expensive but done once, while the optimizer's thousands of calls must be fast every time
   - [ ] Because networks are more accurate than the slow model offline
   - [ ] Because online training would create look-ahead bias
   > The slow pricer produces the labels once, with no deadline. During calibration the optimizer calls the frozen network thousands of times — microseconds each instead of milliseconds.
2. The demo's surrogate was trained on σ from 10% to 40%. Calibrated to quotes generated at σ = 60%, it reports about 48.8%. What is the best explanation?
   - [ ] The optimizer stopped too early
   - [ ] The quotes contained too much noise
   - [x] The inputs lie outside the training box, where the surrogate's prices are meaningless, so the optimizer fits the wrong function
   - [ ] Black-Scholes cannot price options at 60% volatility
   > The exact pricer finds 60.0% from the same quotes, so the optimizer and the data are fine. The surrogate has never seen a 60% market and silently returns wrong prices there.
3. A surrogate has an average pricing error of 2.3 cents but a maximum error of 22 cents inside its training box. You calibrate to quotes about 5 cents wide. What should worry you most?
   - [x] The worst-case errors are several times the spread, so the fit may chase the surrogate's mistakes rather than the market
   - [ ] Nothing, since the average error is below the spread
   - [ ] The average error, because it is above one cent
   - [ ] The training time
   > A calibration is only as good as the pricer's error relative to the quote uncertainty. Averages hide the edges of the box, where both the largest errors and the most stressed markets tend to be.
4. The demo's surrogate gives slightly negative prices for some deep out-of-the-money calls inside its training box. Which fix addresses the cause rather than the symptom?
   - [ ] Adding more hidden features until the errors look small
   - [ ] Rounding negative prices up to zero after the fact
   - [ ] Training on fewer, cleaner examples
   - [x] Building the no-arbitrage conditions into the training loss or into an arbitrage-free output representation
   > More features reduce errors but do not guarantee the constraints; clipping hides one symptom and leaves butterfly violations. Imposing the conditions during training — or outputting, for example, SVI parameters with the no-arbitrage checks — tackles the cause.
5. Which statement about a surrogate trained on Heston prices is correct?
   - [ ] It can be more accurate than Heston because it learns from many examples
   - [ ] It makes the Heston model unnecessary once trained
   - [x] At best it reproduces Heston, faster; it must be validated against Heston and should not be used outside its training region
   - [ ] It automatically captures features of the market that Heston misses
   > The network only knows what its training labels told it. Speed is the benefit; the model's economics, errors and limits all carry over, plus new errors of its own.

## @further
- [Horvath, Muguruza & Tomas (2021), Deep learning volatility (arXiv)](https://arxiv.org/abs/1901.09647) — the grid-based, two-step deep calibration of rough-volatility models; published in Quantitative Finance 21(1).
- [Hernandez (2016), Model Calibration with Neural Networks (SSRN)](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2812140) — an early paper that trains a network to output calibrated parameters directly.
- [Heston (1993), A Closed-Form Solution for Options with Stochastic Volatility](https://doi.org/10.1093/rfs/6.2.327) — the classic model that surrogates are most often trained to imitate.
- [Gatheral, Jaisson & Rosenbaum (2018), Volatility is rough (arXiv)](https://arxiv.org/abs/1410.3394) — the rough-volatility evidence behind models slow enough to need deep calibration.
- [Gatheral & Jacquier (2014), Arbitrage-free SVI volatility surfaces (arXiv)](https://arxiv.org/abs/1204.0646) — conditions an output representation can build in to avoid arbitrage.
- [Ridge regression (Wikipedia)](https://en.wikipedia.org/wiki/Ridge_regression) — the linear solve that trains the demo's output layer.

## @next
Hedging and pricing are problems with a right answer under a model. Quoting as a market maker is different: every quote changes your inventory, which changes the next quote. Can an agent learn a quoting strategy by trial and error — and does it beat the textbook formula of Avellaneda and Stoikov? That is [[rl-market-making]].
