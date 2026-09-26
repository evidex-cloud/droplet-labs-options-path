// Self-test for demos/_opt.js — node tools/test_opt.mjs
// Known values: Hull (Options, Futures & Other Derivatives), Haug (Complete Guide to Option Pricing Formulas), identities, convergence.
import * as O from "../demos/_opt.js";

let pass = 0, fail = 0;
const ok = (name, cond, extra = "") => { if (cond) pass++; else { fail++; console.log("✗", name, extra); } };
const near = (name, got, want, tol) => ok(name, Math.abs(got - want) <= tol, `got ${got}, want ${want} ± ${tol}`);

// normal distribution
near("N(0)", O.normCdf(0), 0.5, 1e-15);
near("N(1.96)", O.normCdf(1.96), 0.9750021048517795, 1e-13);
near("N(-1)", O.normCdf(-1), 0.15865525393145707, 1e-13);
near("N(0.35)", O.normCdf(0.35), 0.6368306511756191, 1e-13);
near("N(-6) rel", O.normCdf(-6) / 9.865876450376946e-10, 1, 1e-8);
near("Ninv(0.975)", O.normInv(0.975), 1.959963984540054, 1e-10);
near("Ninv(0.01)", O.normInv(0.01), -2.3263478740408408, 1e-10);

// Black–Scholes textbook: S=K=100, T=1, r=5%, σ=20% → C = 10.4506, P = 5.5735
near("BS call textbook", O.bsCall(100, 100, 1, 0.05, 0.2), 10.450583572185565, 1e-9);
near("BS put textbook", O.bsPut(100, 100, 1, 0.05, 0.2), 5.573526022256971, 1e-9);
// Hull Example 15.6: S=42, K=40, r=10%, σ=20%, T=0.5 → c = 4.76, p = 0.81
near("Hull 15.6 call", O.bsCall(42, 40, 0.5, 0.1, 0.2), 4.759422392871532, 1e-8);
near("Hull 15.6 put", O.bsPut(42, 40, 0.5, 0.1, 0.2), 0.8085993729000922, 1e-8);
// Haug: generalized BS with dividend yield. S=100,K=95,T=0.5,r=10%,q=5%,σ=20% put ≈ 2.4648
near("Haug q put", O.bsPut(100, 95, 0.5, 0.1, 0.2, 0.05), 2.4648, 1e-4);

// Parity: C − P = S e^{−qT} − K e^{−rT}
for (const [S, K, T, r, q, s] of [[100, 90, 0.3, 0.04, 0.01, 0.35], [50, 60, 2, 0.02, 0, 0.5], [100, 100, 30 / 365, 0.04, 0, 0.2]]) {
  const C = O.bsCall(S, K, T, r, s, q), P = O.bsPut(S, K, T, r, s, q);
  near(`parity ${S}/${K}`, O.parityGap(C, P, S, K, T, r, q), 0, 1e-10);
}

// Greeks vs finite differences
{
  const o = { S: 105, K: 100, T: 0.4, r: 0.03, q: 0.01, sigma: 0.27, type: "call" };
  const g = O.greeks(o), h = 1e-3, P = (x) => O.bsPrice({ ...o, ...x });
  near("delta FD", g.delta, (P({ S: o.S + h }) - P({ S: o.S - h })) / (2 * h), 1e-7);
  near("gamma FD", g.gamma, (P({ S: o.S + h }) - 2 * P({}) + P({ S: o.S - h })) / (h * h), 1e-5);
  near("vega FD (per 1%)", g.vega, (P({ sigma: o.sigma + h }) - P({ sigma: o.sigma - h })) / (2 * h) / 100, 1e-6);
  near("theta FD (per day)", g.theta, (P({ T: o.T - 1 / 365 / 2 }) - P({ T: o.T + 1 / 365 / 2 })), 1e-6);
  near("rho FD (per 1%)", g.rho, (P({ r: o.r + h }) - P({ r: o.r - h })) / (2 * h) / 100, 1e-6);
  const G = (x) => O.greeks({ ...o, ...x });
  near("vanna FD", g.vanna, (G({ sigma: o.sigma + h }).delta - G({ sigma: o.sigma - h }).delta) / (2 * h), 1e-5);
  near("volga FD", g.volga, (G({ sigma: o.sigma + 1e-5 }).vegaRaw - G({ sigma: o.sigma - 1e-5 }).vegaRaw) / 2e-5, 1e-3);
  near("charm FD", g.charm, (G({ T: o.T - h }).delta - G({ T: o.T + h }).delta) / (2 * h), 1e-5);
  near("speed FD", g.speed, (G({ S: o.S + h }).gamma - G({ S: o.S - h }).gamma) / (2 * h), 1e-6);
  near("dual delta FD", g.dualDelta, (P({ K: o.K + h }) - P({ K: o.K - h })) / (2 * h), 1e-7);
  const p = O.greeks({ ...o, type: "put" });
  near("put delta = call delta − e^{-qT}", p.delta, g.delta - Math.exp(-o.q * o.T), 1e-12);
  near("put gamma = call gamma", p.gamma, g.gamma, 1e-12);
}

// Implied vol round trip
for (const s of [0.05, 0.2, 0.8, 2.0]) {
  const o = { S: 100, K: 105, T: 0.25, r: 0.04, q: 0, type: "put" };
  near(`IV roundtrip σ=${s}`, O.impliedVol(O.bsPrice({ ...o, sigma: s }), o), s, 1e-7);
}
ok("IV below intrinsic → NaN", Number.isNaN(O.impliedVol(0.5, { S: 100, K: 90, T: 1, r: 0, type: "call" })));

// Black-76 = BS with q = r on futures; Bachelier sanity (ATM call = σN √T / √(2π))
near("Black76", O.black76({ F: 100 * Math.exp(0.05), K: 100, T: 1, r: 0.05, sigma: 0.2 }), 10.450583572185565, 1e-9);
near("Bachelier ATM", O.bachelier({ F: 100, K: 100, T: 1, r: 0, sigmaN: 20 }), 20 / Math.sqrt(2 * Math.PI), 1e-12);
// Digital: cash-or-nothing call = e^{-rT} N(d2)
near("digital", O.digital({ S: 100, K: 100, T: 1, r: 0.05, sigma: 0.2 }), Math.exp(-0.05) * O.normCdf(0.15), 1e-12);

// Binomial → BS; American put > European put; American call (no div) = European
near("CRR 2000 steps → BS", O.binomial({ S: 100, K: 100, T: 1, r: 0.05, sigma: 0.2, steps: 2000 }).price, 10.4506, 2e-3);
{
  // Hull Example 21.1-ish: American put S=50, K=50, r=10%, σ=40%, T=5 months → ≈ 4.49 (5 steps: 4.49; converged ≈ 4.28)
  const five = O.binomial({ S: 50, K: 50, T: 5 / 12, r: 0.1, sigma: 0.4, type: "put", steps: 5, american: true }).price;
  near("Hull American put 5 steps", five, 4.49, 0.01);
  const am = O.binomial({ S: 50, K: 50, T: 5 / 12, r: 0.1, sigma: 0.4, type: "put", steps: 1000, american: true }).price;
  near("American put converged", am, 4.28, 0.01);
  const eu = O.bsPut(50, 50, 5 / 12, 0.1, 0.4);
  ok("American put ≥ European put", am > eu);
  const amc = O.binomial({ S: 50, K: 50, T: 5 / 12, r: 0.1, sigma: 0.4, steps: 800, american: true }).price;
  const euc = O.binomial({ S: 50, K: 50, T: 5 / 12, r: 0.1, sigma: 0.4, steps: 800 }).price;
  near("American call no div = European", amc, euc, 1e-9);
}
// One-step replication: S=100, u=1.2, d=0.8, K=100, r=0 → Δ=0.5, price=10, q=0.5
{
  const s = O.oneStep({ S: 100, K: 100, u: 1.2, d: 0.8, r: 0, T: 1 });
  near("one-step delta", s.delta, 0.5, 1e-12); near("one-step price", s.price, 10, 1e-12); near("one-step q", s.q, 0.5, 1e-12);
  near("replication = risk-neutral", s.price, s.priceRN, 1e-12);
}

// Monte Carlo within 3 SE of BS
{
  const mc = O.mcEuropean({ S: 100, K: 100, T: 1, r: 0.05, sigma: 0.2, paths: 60000, seed: 1 });
  ok("MC within 3 SE", Math.abs(mc.price - 10.4506) < 3 * mc.se, JSON.stringify(mc));
}
// Finite differences (CN) close to BS; American FD put close to binomial
near("FD CN European call", O.fdPrice({ S: 100, K: 100, T: 1, r: 0.05, sigma: 0.2, M: 400, N: 400 }).price, 10.4506, 5e-3);
near("FD CN American put", O.fdPrice({ S: 50, K: 50, T: 5 / 12, r: 0.1, sigma: 0.4, type: "put", M: 400, N: 400, american: true }).price, 4.28, 0.01);

// Geometric Asian (Haug example: S=80, K=85, T=0.25, r=5%, q=−3% (b=8%), σ=20% → 1.3659)
{
  const a = O.asianGeometric({ S: 80, K: 85, T: 0.25, r: 0.05, q: -0.03, sigma: 0.2 });
  const mc = O.mcPath({ S: 80, T: 0.25, r: 0.05, q: -0.03, sigma: 0.2, steps: 400, paths: 20000, seed: 4, payoffFn: (p) => Math.max(Math.exp(p.reduce((s, x) => s + Math.log(x), 0) / p.length) - 85, 0) });
  near("Asian geometric ≈ MC", a, mc.price, 3 * mc.se + 0.01);
}
// Down-and-out call ≤ vanilla, and → vanilla as H → 0; MC agreement
{
  const van = O.bsCall(100, 100, 1, 0.05, 0.2);
  near("DOC with far barrier = vanilla", O.downOutCall({ S: 100, K: 100, H: 1, T: 1, r: 0.05, sigma: 0.2 }), van, 1e-8);
  const doc = O.downOutCall({ S: 100, K: 100, H: 90, T: 1, r: 0.05, sigma: 0.2 });
  const mc = O.mcPath({ S: 100, T: 1, r: 0.05, sigma: 0.2, steps: 1000, paths: 4000, seed: 5, payoffFn: (p) => (Math.min(...p) <= 90 ? 0 : Math.max(p[p.length - 1] - 100, 0)) });
  ok("DOC < vanilla", doc < van);
  ok("DOC ≈ MC (discrete monitoring slightly higher)", mc.price > doc - 3 * mc.se && mc.price - doc < 0.6, `analytic ${doc} mc ${mc.price}±${mc.se}`);
}

// Heston → BS when vol-of-vol is tiny and v0 = θ
{
  const h = O.hestonPrice({ S: 100, K: 100, T: 1, r: 0.05, v0: 0.04, kappa: 2, theta: 0.04, xi: 1e-4, rho: 0 });
  near("Heston ξ→0 = BS", h, 10.4506, 2e-3);
  // Known value (Albrecher et al. / common test): S=100,K=100,T=1,r=0,v0=0.04,κ=1.5,θ=0.04,ξ=0.3,ρ=−0.9 → call ≈ 7.8 (skew lowers ATM slightly)
  const h2 = O.hestonPrice({ S: 100, K: 100, T: 1, r: 0, v0: 0.04, kappa: 1.5, theta: 0.04, xi: 0.3, rho: -0.9 });
  ok("Heston ATM plausible (7–8.1)", h2 > 7 && h2 < 8.1, String(h2));
  const hp = O.hestonPrice({ S: 100, K: 90, T: 0.5, r: 0.03, v0: 0.05, kappa: 2, theta: 0.05, xi: 0.5, rho: -0.7, type: "put" });
  const hc = O.hestonPrice({ S: 100, K: 90, T: 0.5, r: 0.03, v0: 0.05, kappa: 2, theta: 0.05, xi: 0.5, rho: -0.7 });
  near("Heston parity", O.parityGap(hc, hp, 100, 90, 0.5, 0.03), 0, 1e-9);
  // MC cross-check of a Heston price (Euler, full truncation)
  const R = O.rng(9); let sum = 0; const N = 20000, steps = 200, dt = 0.5 / steps;
  for (let i = 0; i < N; i++) { let x = Math.log(100), v = 0.05; for (let k = 0; k < steps; k++) { const z1 = R.normal(), z2 = -0.7 * z1 + Math.sqrt(1 - 0.49) * R.normal(); const vp = Math.max(v, 0); x += (0.03 - vp / 2) * dt + Math.sqrt(vp * dt) * z1; v += 2 * (0.05 - vp) * dt + 0.5 * Math.sqrt(vp * dt) * z2; } sum += Math.max(Math.exp(x) - 90, 0); }
  const mc = Math.exp(-0.03 * 0.5) * sum / N;
  near("Heston ≈ MC", hc, mc, 0.15);
}

// SABR: ν=0, β=1 → flat vol α
near("SABR flat", O.sabrVol({ F: 100, K: 120, T: 1, alpha: 0.25, beta: 1, rho: 0, nu: 1e-9 }), 0.25, 1e-6);
// SVI: flat parameters → constant vol; g ≥ 0 for a sane slice
near("SVI flat", O.sviVol(0.3, 1, { a: 0.04, b: 0, rho: 0, m: 0, s: 0.1 }), 0.2, 1e-12);
ok("SVI butterfly-free sample", [-1, -0.5, 0, 0.5, 1].every((k) => O.sviG(k, { a: 0.02, b: 0.1, rho: -0.4, m: 0, s: 0.2 }) > 0));

// Breeden–Litzenberger density integrates to ≈ e^{-0}… (≈ 1) and has mean ≈ forward
{
  const T = 0.5, r = 0.04, call = (K) => O.bsCall(100, K, T, r, 0.25);
  let mass = 0, mean = 0;
  for (let K = 20; K <= 300; K += 0.5) { const f = O.rndFromCalls(call, K, T, r, 0.5); mass += f * 0.5; mean += K * f * 0.5; }
  near("RND mass", mass, 1, 2e-3); near("RND mean = forward", mean, O.forward(100, T, r), 0.2);
}
// VIX-style strip on a flat surface returns σ
{
  const S = 100, T = 30 / 365, r = 0.04, strikes = O.range(40, 200, 320);
  const { F, quotes } = O.otmStrip({ S, T, r, strikes, volAt: () => 0.2 });
  near("strip variance → flat σ", O.varianceFromStrip({ strikes, quotes, F, T, r }).vol, 0.2, 2e-3);
}
// Payoff scan: bull call spread 100/110 for 3.5 debit
{
  const legs = [{ type: "call", side: "long", K: 100, premium: 5 }, { type: "call", side: "short", K: 110, premium: 1.5 }];
  const st = O.payoffStats(legs, 50, 150);
  near("spread max profit", st.maxProfit, 6.5, 1e-9); near("spread max loss", st.maxLoss, -3.5, 1e-9); near("spread BE", st.breakevens[0], 103.5, 0.01);
  near("butterfly peak hit exactly on a coarse grid", O.payoffStats([{ type: "call", side: "long", K: 95 }, { type: "call", side: "short", K: 100, qty: 2 }, { type: "call", side: "long", K: 105 }], 50, 150, 97).maxProfit, 5, 1e-12);
  ok("naked short call unbounded", O.payoffStats([{ type: "call", side: "short", K: 100, premium: 2 }], 50, 150).maxLoss === -Infinity);
}
// Delta hedging: with σ_real = σ_imp the hedged P&L is small relative to premium; with σ_real > σ_imp short-gamma loses on average
{
  let a = 0, b = 0; const N = 200;
  for (let s = 1; s <= N; s++) { a += O.hedgeSim({ sigmaImp: 0.2, sigmaReal: 0.2, steps: 60, seed: s }).pnl; b += O.hedgeSim({ sigmaImp: 0.2, sigmaReal: 0.3, steps: 60, seed: s }).pnl; }
  ok("hedged P&L ≈ 0 when σ match", Math.abs(a / N) < 0.12, String(a / N));
  ok("short gamma loses when realized > implied", b / N < -0.4, String(b / N));
}
// Probabilities
near("probAbove ATM driftless", O.probAbove(100, 100, 1, 0.2, 0), O.normCdf(-0.1), 1e-12);
ok("touch ≈ 2× finish (OTM)", Math.abs(O.probTouch(100, 110, 0.25, 0.2) / O.probAbove(100, 110, 0.25, 0.2) - 2) < 0.12);
// Kelly
near("Kelly 60/40 even", O.kellyFraction(0.6, 1), 0.2, 1e-12);
// Perps
near("funding clamp inside", O.fundingRate(0.0003), 0.0001, 1e-12);
near("funding clamp far", O.fundingRate(0.002), 0.0015, 1e-12);
near("10x long liq", O.liqPrice(100000, 10, 0.005), 90500, 1e-6);
near("futures fair", O.futuresFair(100, 0.5, 0.04), 100 * Math.exp(0.02), 1e-12);

console.log(`\n_opt.js self-test: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
