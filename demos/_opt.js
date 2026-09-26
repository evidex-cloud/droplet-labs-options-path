// demos/_opt.js —— the shared, tested options engine (Options Path v3).
// Pure functions, no DOM. Every lesson and demo computes with THIS file so numbers agree across the course.
// Self-test: node tools/test_opt.mjs   (known values from Hull / Haug, parity, convergence, finite-difference Greek checks)
//
// Conventions
//   S spot · K strike · T years to expiry · r risk-free (cont. comp., decimal) · q dividend/borrow yield (decimal)
//   sigma annualised volatility (decimal, 0.20 = 20%) · type "call" | "put"
//   Option prices are PER SHARE. A US equity option contract covers 100 shares → multiply by MULT to get dollars.
//   greeks() returns TRADING units (vega per 1 vol point, theta per calendar day, rho per 1% rate) and the raw
//   calculus values (…Raw). Days → years: T = days / 365.
export { tex } from "../math.js?v=1";

export const MULT = 100;
export const DAYS = 365;

/* ---------------- formatting ---------------- */
export const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
export const fmt = (x, d = 2) => (isFinite(x) ? Number(x).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }) : "–");
export const fmtUsd = (x, d = 2) => (isFinite(x) ? (x < 0 ? "−$" : "$") + Math.abs(x).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }) : "–");
export const fmtPct = (x, d = 1) => (isFinite(x) ? (x * 100).toFixed(d) + "%" : "–");
export const fmtSigned = (x, d = 2) => (isFinite(x) ? (x > 0 ? "+" : x < 0 ? "−" : "") + Math.abs(x).toFixed(d) : "–");
export const fmtBig = (x, d = 1) => {
  if (!isFinite(x)) return "–";
  const a = Math.abs(x), s = x < 0 ? "−" : "";
  if (a >= 1e12) return s + (a / 1e12).toFixed(d) + "T";
  if (a >= 1e9) return s + (a / 1e9).toFixed(d) + "B";
  if (a >= 1e6) return s + (a / 1e6).toFixed(d) + "M";
  if (a >= 1e3) return s + (a / 1e3).toFixed(d) + "K";
  return s + a.toFixed(d);
};
export const range = (lo, hi, n) => Array.from({ length: n + 1 }, (_, i) => lo + ((hi - lo) * i) / n);

/* ---------------- the normal distribution ---------------- */
// Standard normal CDF, Hart (1968) double-precision algorithm as given by West (2005): |error| < 1e-14.
export function normCdf(x) {
  const a = Math.abs(x);
  let c;
  if (a > 37) c = 0;
  else {
    const e = Math.exp((-a * a) / 2);
    if (a < 7.07106781186547) {
      let b = 3.52624965998911e-2 * a + 0.700383064443688;
      b = b * a + 6.37396220353165; b = b * a + 33.912866078383; b = b * a + 112.079291497871;
      b = b * a + 221.213596169931; b = b * a + 220.206867912376;
      c = e * b;
      b = 8.83883476483184e-2 * a + 1.75566716318264;
      b = b * a + 16.064177579207; b = b * a + 86.7807322029461; b = b * a + 296.564248779674;
      b = b * a + 637.333633378831; b = b * a + 793.826512519948; b = b * a + 440.413735824752;
      c = c / b;
    } else {
      let b = a + 0.65;
      b = a + 4 / b; b = a + 3 / b; b = a + 2 / b; b = a + 1 / b;
      c = e / b / 2.506628274631;
    }
  }
  return x > 0 ? 1 - c : c;
}
export const normPdf = (x) => 0.3989422804014327 * Math.exp((-x * x) / 2);
// Inverse normal CDF (Acklam) + one Newton step → ~1e-15
export function normInv(p) {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425;
  let x;
  if (p < pl) { const q = Math.sqrt(-2 * Math.log(p)); x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  else if (p <= 1 - pl) { const q = p - 0.5, r = q * q; x = ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); }
  else { const q = Math.sqrt(-2 * Math.log(1 - p)); x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  const e = normCdf(x) - p, u = e * Math.sqrt(2 * Math.PI) * Math.exp((x * x) / 2);
  return x - u / (1 + (x * u) / 2);
}

/* ---------------- forwards & intrinsic value ---------------- */
export const forward = (S, T, r = 0, q = 0) => S * Math.exp((r - q) * T);
export const discount = (T, r) => Math.exp(-r * T);
export const intrinsic = (type, S, K) => (type === "put" ? Math.max(K - S, 0) : Math.max(S - K, 0));

/* ---------------- Black–Scholes–Merton ---------------- */
export function d1d2({ S, K, T, r = 0, q = 0, sigma }) {
  const v = sigma * Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r - q + (sigma * sigma) / 2) * T) / v;
  return { d1, d2: d1 - v };
}
// European option price (per share). o = {S,K,T,r,q,sigma,type}
export function bsPrice(o) {
  const { S, K, T, r = 0, q = 0, sigma, type = "call" } = o;
  if (T <= 0 || sigma <= 0) {
    // zero vol: deterministic forward; zero time: intrinsic
    if (T <= 0) return intrinsic(type, S, K);
    const F = forward(S, T, r, q), df = discount(T, r);
    return df * intrinsic(type, F, K);
  }
  const { d1, d2 } = d1d2(o);
  const dfR = Math.exp(-r * T), dfQ = Math.exp(-q * T);
  return type === "put" ? K * dfR * normCdf(-d2) - S * dfQ * normCdf(-d1) : S * dfQ * normCdf(d1) - K * dfR * normCdf(d2);
}
export const bsCall = (S, K, T, r, sigma, q = 0) => bsPrice({ S, K, T, r, q, sigma, type: "call" });
export const bsPut = (S, K, T, r, sigma, q = 0) => bsPrice({ S, K, T, r, q, sigma, type: "put" });

// Full Greek set. Trading units: delta per $1, gamma per $1, vega per 1 vol point, theta per calendar day, rho per 1% rate.
// Second order (raw calculus units): vanna = ∂Δ/∂σ, volga = ∂²V/∂σ², charm = ∂Δ/∂t (per year, as time passes), speed = ∂Γ/∂S.
export function greeks(o) {
  const { S, K, T, r = 0, q = 0, sigma, type = "call" } = o;
  const price = bsPrice(o);
  if (T <= 0 || sigma <= 0) {
    const itm = type === "put" ? S < K : S > K;
    const delta = itm ? (type === "put" ? -1 : 1) : 0;
    return { price, delta, gamma: 0, vega: 0, theta: 0, rho: 0, vegaRaw: 0, thetaYear: 0, rhoRaw: 0, vanna: 0, volga: 0, charm: 0, speed: 0, d1: NaN, d2: NaN, probITM: itm ? 1 : 0, dualDelta: itm ? (type === "put" ? 1 : -1) : 0 };
  }
  const { d1, d2 } = d1d2(o);
  const sq = Math.sqrt(T), dfR = Math.exp(-r * T), dfQ = Math.exp(-q * T), nd1 = normPdf(d1);
  const call = type !== "put";
  const delta = call ? dfQ * normCdf(d1) : dfQ * (normCdf(d1) - 1);
  const gamma = (dfQ * nd1) / (S * sigma * sq);
  const vegaRaw = S * dfQ * nd1 * sq;
  const thetaYear = call
    ? (-S * dfQ * nd1 * sigma) / (2 * sq) - r * K * dfR * normCdf(d2) + q * S * dfQ * normCdf(d1)
    : (-S * dfQ * nd1 * sigma) / (2 * sq) + r * K * dfR * normCdf(-d2) - q * S * dfQ * normCdf(-d1);
  const rhoRaw = call ? K * T * dfR * normCdf(d2) : -K * T * dfR * normCdf(-d2);
  const vanna = (-dfQ * nd1 * d2) / sigma;
  const volga = (vegaRaw * d1 * d2) / sigma;
  const charmCommon = dfQ * nd1 * ((2 * (r - q) * T - d2 * sigma * sq) / (2 * T * sigma * sq));
  const charm = call ? q * dfQ * normCdf(d1) - charmCommon : -q * dfQ * normCdf(-d1) - charmCommon; // −∂Δ/∂T
  const speed = (-gamma / S) * (d1 / (sigma * sq) + 1);
  const probITM = call ? normCdf(d2) : normCdf(-d2); // risk-neutral probability of finishing in the money
  const dualDelta = call ? -dfR * normCdf(d2) : dfR * normCdf(-d2); // ∂V/∂K
  return { price, delta, gamma, vega: vegaRaw / 100, theta: thetaYear / DAYS, rho: rhoRaw / 100, vegaRaw, thetaYear, rhoRaw, vanna, volga, charm, speed, d1, d2, probITM, dualDelta };
}

// Implied volatility from a price: safeguarded Newton (falls back to bisection). Returns NaN if no solution.
export function impliedVol(price, o) {
  const { S, K, T, r = 0, q = 0, type = "call" } = o;
  const lower = type === "put" ? Math.max(K * Math.exp(-r * T) - S * Math.exp(-q * T), 0) : Math.max(S * Math.exp(-q * T) - K * Math.exp(-r * T), 0);
  const upper = type === "put" ? K * Math.exp(-r * T) : S * Math.exp(-q * T);
  if (!(price > lower + 1e-12) || price >= upper) return NaN;
  let lo = 1e-6, hi = 10, v = 0.3;
  for (let i = 0; i < 100; i++) {
    const p = bsPrice({ S, K, T, r, q, sigma: v, type });
    const diff = p - price;
    if (Math.abs(diff) < 1e-10) return v;
    if (diff > 0) hi = v; else lo = v;
    const vega = S * Math.exp(-q * T) * normPdf(d1d2({ S, K, T, r, q, sigma: v }).d1) * Math.sqrt(T);
    let nv = vega > 1e-10 ? v - diff / vega : (lo + hi) / 2;
    if (!(nv > lo && nv < hi)) nv = (lo + hi) / 2;
    v = nv;
  }
  return v;
}

// Black-76 (options on a forward/future F) and Bachelier (normal model; sigmaN in price units per √year)
export function black76({ F, K, T, r = 0, sigma, type = "call" }) {
  if (T <= 0 || sigma <= 0) return Math.exp(-r * T) * intrinsic(type, F, K);
  const v = sigma * Math.sqrt(T), d1 = (Math.log(F / K) + (v * v) / 2) / v, d2 = d1 - v, df = Math.exp(-r * T);
  return type === "put" ? df * (K * normCdf(-d2) - F * normCdf(-d1)) : df * (F * normCdf(d1) - K * normCdf(d2));
}
export function bachelier({ F, K, T, r = 0, sigmaN, type = "call" }) {
  const df = Math.exp(-r * T);
  if (T <= 0 || sigmaN <= 0) return df * intrinsic(type, F, K);
  const s = sigmaN * Math.sqrt(T), d = (F - K) / s;
  const call = df * ((F - K) * normCdf(d) + s * normPdf(d));
  return type === "put" ? call - df * (F - K) : call;
}
// Digital (cash-or-nothing) option paying 1 if ITM at expiry
export function digital({ S, K, T, r = 0, q = 0, sigma, type = "call" }) {
  if (T <= 0) return (type === "put" ? S < K : S > K) ? 1 : 0;
  const { d2 } = d1d2({ S, K, T, r, q, sigma });
  return Math.exp(-r * T) * (type === "put" ? normCdf(-d2) : normCdf(d2));
}

/* ---------------- parity, bounds, expected move, probabilities ---------------- */
// C − P = S·e^(−qT) − K·e^(−rT)
export const parityGap = (C, P, S, K, T, r = 0, q = 0) => C - P - (S * Math.exp(-q * T) - K * Math.exp(-r * T));
export const putFromCall = (C, S, K, T, r = 0, q = 0) => C - S * Math.exp(-q * T) + K * Math.exp(-r * T);
export const callFromPut = (P, S, K, T, r = 0, q = 0) => P + S * Math.exp(-q * T) - K * Math.exp(-r * T);
export function bounds({ S, K, T, r = 0, q = 0, type = "call" }) {
  const Sd = S * Math.exp(-q * T), Kd = K * Math.exp(-r * T);
  return type === "put" ? { lower: Math.max(Kd - Sd, 0), upper: Kd } : { lower: Math.max(Sd - Kd, 0), upper: Sd };
}
// One-standard-deviation move over T years: S·σ·√T (the rule traders use; ≈ 68% two-sided)
export const expectedMove = (S, sigma, T) => S * sigma * Math.sqrt(T);
// ATM straddle ≈ 0.8 · S · σ · √T  (√(2/π) ≈ 0.798): straddle-implied move
export const straddleApprox = (S, sigma, T) => Math.sqrt(2 / Math.PI) * S * sigma * Math.sqrt(T);
// Probability S_T > K under a lognormal with drift mu (use mu = r − q for risk-neutral)
export function probAbove(S, K, T, sigma, mu = 0) {
  if (T <= 0) return S > K ? 1 : 0;
  const z = (Math.log(S / K) + (mu - (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
  return normCdf(z);
}
// Probability of touching a barrier H before T (driftless-in-log approximation, reflection principle): ≈ 2 × P(finish beyond H)
export function probTouch(S, H, T, sigma, mu = 0) {
  if (T <= 0) return (H >= S ? S >= H : S <= H) ? 1 : 0;
  const nu = mu - (sigma * sigma) / 2, s = sigma * Math.sqrt(T), b = Math.log(H / S);
  if (b > 0) return normCdf((-b + nu * T) / s) + Math.exp((2 * nu * b) / (sigma * sigma)) * normCdf((-b - nu * T) / s);
  if (b < 0) return normCdf((b - nu * T) / s) + Math.exp((2 * nu * b) / (sigma * sigma)) * normCdf((b + nu * T) / s);
  return 1;
}
// Lognormal density of S_T (for drawing distributions)
export function lognormalPdf(x, S, T, sigma, mu = 0) {
  if (x <= 0 || T <= 0) return 0;
  const s = sigma * Math.sqrt(T), m = Math.log(S) + (mu - (sigma * sigma) / 2) * T;
  return Math.exp(-((Math.log(x) - m) ** 2) / (2 * s * s)) / (x * s * Math.sqrt(2 * Math.PI));
}

/* ---------------- payoffs & positions ---------------- */
// leg = { type: "call"|"put"|"stock"|"cash", side: "long"|"short" (or +1/−1), K, qty (default 1), premium (per share, paid/received),
//         entry (stock entry price), T (years to this leg's expiry, for mark-to-model), sigma (optional per-leg vol) }
const sgn = (leg) => (leg.side === "short" || leg.side === -1 ? -1 : 1);
const qtyOf = (leg) => (leg.qty == null ? 1 : leg.qty);
// Expiry P&L per share (premium included)
export function legPL(leg, S) {
  const s = sgn(leg), n = qtyOf(leg);
  if (leg.type === "stock") return s * (S - leg.entry) * n;
  if (leg.type === "cash") return s * (leg.amount || 0) * n;
  return s * (intrinsic(leg.type, S, leg.K) - (leg.premium || 0)) * n;
}
export const netPL = (legs, S) => legs.reduce((a, l) => a + legPL(l, S), 0);
// Payoff at expiry WITHOUT premiums (the pure shape)
export const netPayoff = (legs, S) => legs.reduce((a, l) => a + (l.type === "stock" ? sgn(l) * S * qtyOf(l) : l.type === "cash" ? 0 : sgn(l) * intrinsic(l.type, S, l.K) * qtyOf(l)), 0);
// Mark-to-model P&L before expiry: option legs repriced with Black–Scholes at time `elapsed` years after entry
export function netPLAt(legs, S, { elapsed = 0, sigma = 0.2, r = 0, q = 0 } = {}) {
  return legs.reduce((a, l) => {
    const s = sgn(l), n = qtyOf(l);
    if (l.type === "stock") return a + s * (S - l.entry) * n;
    if (l.type === "cash") return a;
    const Tleft = Math.max((l.T ?? 0) - elapsed, 0);
    const v = bsPrice({ S, K: l.K, T: Tleft, r, q, sigma: l.sigma ?? sigma, type: l.type });
    return a + s * (v - (l.premium || 0)) * n;
  }, 0);
}
// Position Greeks (per share units; multiply by MULT for a contract)
export function positionGreeks(legs, S, { elapsed = 0, sigma = 0.2, r = 0, q = 0 } = {}) {
  const g = { delta: 0, gamma: 0, vega: 0, theta: 0, rho: 0, value: 0 };
  for (const l of legs) {
    const s = sgn(l) * qtyOf(l);
    if (l.type === "stock") { g.delta += s; g.value += s * S; continue; }
    if (l.type === "cash") continue;
    const x = greeks({ S, K: l.K, T: Math.max((l.T ?? 0) - elapsed, 0), r, q, sigma: l.sigma ?? sigma, type: l.type });
    g.delta += s * x.delta; g.gamma += s * x.gamma; g.vega += s * x.vega; g.theta += s * x.theta; g.rho += s * x.rho; g.value += s * x.price;
  }
  return g;
}
// Scan the expiry P&L on [lo, hi]: breakevens, max profit/loss, and whether the tails are unbounded
export function payoffStats(legs, lo, hi, n = 2000) {
  // grid plus every strike exactly, so kinks (a butterfly's body, a condor's shoulders) are never stepped over
  const ks = legs.filter((l) => l.K != null && l.K > lo && l.K < hi).map((l) => l.K);
  const xs = [...new Set([...range(lo, hi, n), ...ks])].sort((a, b) => a - b), ys = xs.map((x) => netPL(legs, x));
  const be = [];
  for (let i = 1; i < xs.length; i++) {
    const a = ys[i - 1], b = ys[i];
    if (a === 0 && (i === 1 || ys[i - 2] !== 0)) be.push(xs[i - 1]);
    else if ((a < 0 && b > 0) || (a > 0 && b < 0)) be.push(xs[i - 1] + ((xs[i] - xs[i - 1]) * a) / (a - b));
  }
  // slope beyond the grid: count calls (right tail) and stock
  let slopeR = 0;
  for (const l of legs) if (l.type === "call" || l.type === "stock") slopeR += sgn(l) * qtyOf(l);
  const slopeL = legs.reduce((a, l) => a + (l.type === "put" ? -sgn(l) * qtyOf(l) : l.type === "stock" ? sgn(l) * qtyOf(l) : 0), 0);
  // left tail: price can only fall to 0, so the P&L at S = 0 is the true left extreme
  const at0 = netPL(legs, 0);
  const maxP = Math.max(...ys, at0), minP = Math.min(...ys, at0);
  return {
    breakevens: be.map((x) => Math.round(x * 100) / 100),
    maxProfit: slopeR > 0 ? Infinity : maxP,
    maxLoss: slopeR < 0 ? -Infinity : minP,
    slopeRight: slopeR, slopeLeft: slopeL, atZero: at0,
  };
}

/* ---------------- binomial trees (Cox–Ross–Rubinstein) ---------------- */
// One step: returns replication (Δ shares + B in bonds), risk-neutral q, and the price
export function oneStep({ S, K, u, d, r = 0, T = 1, type = "call" }) {
  const Su = S * u, Sd = S * d, Vu = intrinsic(type, Su, K), Vd = intrinsic(type, Sd, K);
  const delta = (Vu - Vd) / (Su - Sd);
  const growth = Math.exp(r * T);
  const bond = (Vu - delta * Su) / growth; // money in the bank today (negative = borrowed)
  const qProb = (growth - d) / (u - d);
  const price = delta * S + bond;
  return { Su, Sd, Vu, Vd, delta, bond, q: qProb, price, priceRN: (qProb * Vu + (1 - qProb) * Vd) / growth };
}
// n-step CRR tree. american: allow early exercise. Returns {price, delta, gamma, theta, tree?}
export function binomial({ S, K, T, r = 0, q = 0, sigma, type = "call", steps = 200, american = false, keepTree = false }) {
  const n = Math.max(1, Math.round(steps)), dt = T / n;
  const u = Math.exp(sigma * Math.sqrt(dt)), d = 1 / u, disc = Math.exp(-r * dt);
  const p = (Math.exp((r - q) * dt) - d) / (u - d);
  let V = new Array(n + 1);
  for (let j = 0; j <= n; j++) V[j] = intrinsic(type, S * u ** j * d ** (n - j), K);
  const tree = keepTree ? [V.map((v, j) => ({ S: S * u ** j * d ** (n - j), V: v, ex: v > 0 }))] : null;
  let v1 = null, v2 = null;
  for (let i = n - 1; i >= 0; i--) {
    const W = new Array(i + 1), row = keepTree ? [] : null;
    for (let j = 0; j <= i; j++) {
      const Sij = S * u ** j * d ** (i - j);
      const cont = disc * (p * V[j + 1] + (1 - p) * V[j]);
      const ex = intrinsic(type, Sij, K);
      const early = american && ex > cont + 1e-12;
      W[j] = early ? ex : cont;
      if (keepTree) row.push({ S: Sij, V: W[j], ex: early });
    }
    V = W;
    if (keepTree) tree.unshift(row);
    if (i === 2) v2 = V.slice();
    if (i === 1) v1 = V.slice();
  }
  const price = V[0];
  let delta = NaN, gamma = NaN, theta = NaN;
  if (v1) delta = (v1[1] - v1[0]) / (S * u - S * d);
  if (v2) {
    const Suu = S * u * u, Sud = S, Sdd = S * d * d;
    const dUp = (v2[2] - v2[1]) / (Suu - Sud), dDn = (v2[1] - v2[0]) / (Sud - Sdd);
    gamma = (dUp - dDn) / ((Suu - Sdd) / 2);
    theta = (v2[1] - price) / (2 * dt) / DAYS;
  }
  return { price, delta, gamma, theta, u, d, p, dt, tree };
}

/* ---------------- random numbers & simulation ---------------- */
// Deterministic PRNG (mulberry32) so demos are reproducible; randn by Box–Muller
export function rng(seed = 42) {
  let a = seed >>> 0;
  const next = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  let spare = null;
  next.normal = () => {
    if (spare !== null) { const s = spare; spare = null; return s; }
    let u = 0, v = 0; while (u === 0) u = next(); v = next();
    const m = Math.sqrt(-2 * Math.log(u)); spare = m * Math.sin(2 * Math.PI * v); return m * Math.cos(2 * Math.PI * v);
  };
  return next;
}
// Geometric Brownian motion path: returns [S_0, …, S_steps]
export function gbmPath(R, S0, mu, sigma, T, steps) {
  const dt = T / steps, out = [S0];
  let S = S0;
  for (let i = 0; i < steps; i++) { S *= Math.exp((mu - (sigma * sigma) / 2) * dt + sigma * Math.sqrt(dt) * R.normal()); out.push(S); }
  return out;
}
// Monte Carlo European price with optional antithetic variates. Returns {price, se, n}
export function mcEuropean({ S, K, T, r = 0, q = 0, sigma, type = "call", paths = 20000, seed = 7, antithetic = true, payoff }) {
  const R = rng(seed), df = Math.exp(-r * T), drift = (r - q - (sigma * sigma) / 2) * T, vol = sigma * Math.sqrt(T);
  const pay = payoff || ((ST) => intrinsic(type, ST, K));
  let sum = 0, sum2 = 0, n = 0;
  for (let i = 0; i < paths; i++) {
    const z = R.normal();
    let x = pay(S * Math.exp(drift + vol * z));
    if (antithetic) x = (x + pay(S * Math.exp(drift - vol * z))) / 2;
    sum += x; sum2 += x * x; n++;
  }
  const mean = sum / n, varr = Math.max(sum2 / n - mean * mean, 0);
  return { price: df * mean, se: (df * Math.sqrt(varr)) / Math.sqrt(n), n };
}
// Path-dependent Monte Carlo: payoffFn(pathArray) → payoff. Returns {price, se}
export function mcPath({ S, T, r = 0, q = 0, sigma, steps = 64, paths = 5000, seed = 11, payoffFn }) {
  const R = rng(seed), df = Math.exp(-r * T);
  let sum = 0, sum2 = 0;
  for (let i = 0; i < paths; i++) { const x = payoffFn(gbmPath(R, S, r - q, sigma, T, steps)); sum += x; sum2 += x * x; }
  const mean = sum / paths, varr = Math.max(sum2 / paths - mean * mean, 0);
  return { price: df * mean, se: (df * Math.sqrt(varr)) / Math.sqrt(paths) };
}

/* ---------------- exotic closed forms ---------------- */
// Geometric-average Asian call/put (continuous monitoring, Kemna–Vorst)
export function asianGeometric({ S, K, T, r = 0, q = 0, sigma, type = "call" }) {
  const sigA = sigma / Math.sqrt(3), bA = 0.5 * (r - q - (sigma * sigma) / 6); // carry of the average
  return bsPrice({ S, K, T, r, q: r - bA, sigma: sigA, type });
}
// Down-and-out call, barrier H < K, no rebate (Merton / Reiner–Rubinstein, continuous monitoring)
export function downOutCall({ S, K, H, T, r = 0, q = 0, sigma }) {
  if (S <= H) return 0;
  const lam = (r - q + (sigma * sigma) / 2) / (sigma * sigma);
  const y = Math.log((H * H) / (S * K)) / (sigma * Math.sqrt(T)) + lam * sigma * Math.sqrt(T);
  const cdi = S * Math.exp(-q * T) * (H / S) ** (2 * lam) * normCdf(y) - K * Math.exp(-r * T) * (H / S) ** (2 * lam - 2) * normCdf(y - sigma * Math.sqrt(T));
  return bsPrice({ S, K, T, r, q, sigma, type: "call" }) - cdi; // in–out parity
}

/* ---------------- finite differences (Crank–Nicolson on S) ---------------- */
// Returns {price, grid: {S:[…], V:[…]} at t = 0}. american: projected (early-exercise) CN.
export function fdPrice({ S, K, T, r = 0, q = 0, sigma, type = "call", M = 200, N = 200, american = false, scheme = "cn" }) {
  const Smax = Math.max(S, K) * 4, dS = Smax / M, dt = T / N;
  const theta = scheme === "explicit" ? 0 : scheme === "implicit" ? 1 : 0.5;
  const Sg = range(0, Smax, M);
  let V = Sg.map((s) => intrinsic(type, s, K));
  const a = [], b = [], c = [];
  for (let i = 0; i <= M; i++) {
    const s2 = sigma * sigma * i * i, rq = (r - q) * i;
    a[i] = 0.5 * (s2 - rq); b[i] = -(s2 + r); c[i] = 0.5 * (s2 + rq);
  }
  for (let n = 1; n <= N; n++) {
    const tau = n * dt;
    const lowB = type === "put" ? K * Math.exp(-r * tau) : 0;
    const highB = type === "call" ? Smax * Math.exp(-q * tau) - K * Math.exp(-r * tau) : 0;
    const rhs = new Array(M + 1).fill(0);
    for (let i = 1; i < M; i++) rhs[i] = V[i] + (1 - theta) * dt * (a[i] * V[i - 1] + b[i] * V[i] + c[i] * V[i + 1]);
    // tridiagonal system: −θdt·a V_{i−1} + (1 − θdt·b) V_i − θdt·c V_{i+1} = rhs
    const A = [], B = [], C = [], D = [];
    for (let i = 1; i < M; i++) { A[i] = -theta * dt * a[i]; B[i] = 1 - theta * dt * b[i]; C[i] = -theta * dt * c[i]; D[i] = rhs[i]; }
    D[1] -= A[1] * lowB; D[M - 1] -= C[M - 1] * highB;
    let W;
    if (theta === 0) { W = [lowB, ...D.slice(1, M), highB]; }
    else {
      const cp = [], dp = [];
      cp[1] = C[1] / B[1]; dp[1] = D[1] / B[1];
      for (let i = 2; i < M; i++) { const m = B[i] - A[i] * cp[i - 1]; cp[i] = C[i] / m; dp[i] = (D[i] - A[i] * dp[i - 1]) / m; }
      W = new Array(M + 1); W[0] = lowB; W[M] = highB; W[M - 1] = dp[M - 1];
      for (let i = M - 2; i >= 1; i--) W[i] = dp[i] - cp[i] * W[i + 1];
    }
    if (american) for (let i = 0; i <= M; i++) W[i] = Math.max(W[i], intrinsic(type, Sg[i], K));
    V = W;
  }
  const i = Math.min(M - 1, Math.floor(S / dS)), w = (S - Sg[i]) / dS;
  return { price: V[i] * (1 - w) + V[i + 1] * w, grid: { S: Sg, V } };
}

/* ---------------- volatility: realized, forecasting, smiles ---------------- */
export const logReturns = (prices) => prices.slice(1).map((p, i) => Math.log(p / prices[i]));
export function realizedVol(prices, periodsPerYear = 252) {
  const r = logReturns(prices); if (r.length < 2) return NaN;
  const m = r.reduce((a, x) => a + x, 0) / r.length;
  const v = r.reduce((a, x) => a + (x - m) ** 2, 0) / (r.length - 1);
  return Math.sqrt(v * periodsPerYear);
}
// Parkinson high-low estimator (per-period highs/lows)
export function parkinsonVol(highs, lows, periodsPerYear = 252) {
  const n = highs.length; let s = 0;
  for (let i = 0; i < n; i++) s += Math.log(highs[i] / lows[i]) ** 2;
  return Math.sqrt((s / (4 * n * Math.LN2)) * periodsPerYear);
}
export function ewmaVol(returns, lambda = 0.94, periodsPerYear = 252) {
  let v = returns.slice(0, 20).reduce((a, x) => a + x * x, 0) / Math.min(20, returns.length || 1);
  for (const x of returns) v = lambda * v + (1 - lambda) * x * x;
  return Math.sqrt(v * periodsPerYear);
}
// GARCH(1,1): σ²_{t+1} = ω + α ε²_t + β σ²_t. Returns filtered daily variances and an h-step forecast function.
export function garch11(returns, { omega, alpha, beta }) {
  let v = omega / Math.max(1e-12, 1 - alpha - beta);
  const out = [];
  for (const e of returns) { out.push(v); v = omega + alpha * e * e + beta * v; }
  const longRun = omega / (1 - alpha - beta);
  const forecast = (h) => longRun + (alpha + beta) ** (h - 1) * (v - longRun);
  return { variances: out, next: v, longRun, forecast };
}
// Variance swap / VIX-style fair variance from an OTM strip (Cboe methodology): σ² = (2/T) Σ ΔK/K² e^{rT} Q(K) − (1/T)(F/K0 − 1)²
export function varianceFromStrip({ strikes, quotes, F, T, r = 0 }) {
  const K0 = Math.max(...strikes.filter((k) => k <= F));
  let s = 0;
  for (let i = 0; i < strikes.length; i++) {
    const k = strikes[i];
    const dK = i === 0 ? strikes[1] - strikes[0] : i === strikes.length - 1 ? strikes[i] - strikes[i - 1] : (strikes[i + 1] - strikes[i - 1]) / 2;
    s += (dK / (k * k)) * Math.exp(r * T) * quotes[i];
  }
  const v = (2 / T) * s - (1 / T) * (F / K0 - 1) ** 2;
  return { variance: v, vol: Math.sqrt(Math.max(v, 0)), K0 };
}
// Build the OTM quote strip (puts below K0, calls above, average at K0) from a pricing function
export function otmStrip({ S, T, r = 0, q = 0, strikes, volAt }) {
  const F = forward(S, T, r, q), K0 = Math.max(...strikes.filter((k) => k <= F));
  const quotes = strikes.map((k) => {
    const sig = volAt ? volAt(k) : 0.2;
    if (k < K0) return bsPrice({ S, K: k, T, r, q, sigma: sig, type: "put" });
    if (k > K0) return bsPrice({ S, K: k, T, r, q, sigma: sig, type: "call" });
    return (bsPrice({ S, K: k, T, r, q, sigma: sig, type: "put" }) + bsPrice({ S, K: k, T, r, q, sigma: sig, type: "call" })) / 2;
  });
  return { F, K0, quotes };
}
// Breeden–Litzenberger: risk-neutral density f(K) = e^{rT} ∂²C/∂K² (central difference with step h)
export const rndFromCalls = (callAt, K, T, r = 0, h = 0.5) => Math.exp(r * T) * (callAt(K + h) - 2 * callAt(K) + callAt(K - h)) / (h * h);
// Raw SVI total implied variance w(k), k = ln(K/F): a + b(ρ(k − m) + √((k − m)² + s²))
export const sviW = (k, { a, b, rho, m, s }) => a + b * (rho * (k - m) + Math.sqrt((k - m) ** 2 + s * s));
export const sviVol = (k, T, p) => Math.sqrt(Math.max(sviW(k, p), 0) / T);
// Gatheral–Jacquier butterfly-arbitrage density g(k) ≥ 0 required
export function sviG(k, p, h = 1e-4) {
  const w = sviW(k, p), w1 = (sviW(k + h, p) - sviW(k - h, p)) / (2 * h), w2 = (sviW(k + h, p) - 2 * w + sviW(k - h, p)) / (h * h);
  return (1 - (k * w1) / (2 * w)) ** 2 - ((w1 * w1) / 4) * (1 / w + 0.25) + w2 / 2;
}
// Hagan et al. (2002) SABR lognormal implied vol approximation
export function sabrVol({ F, K, T, alpha, beta, rho, nu }) {
  const eps = 1e-7;
  if (Math.abs(F - K) < eps) {
    const Fb = F ** (1 - beta);
    const term = 1 + ((((1 - beta) ** 2) / 24) * (alpha * alpha) / Fb ** 2 + (rho * beta * nu * alpha) / (4 * Fb) + ((2 - 3 * rho * rho) / 24) * nu * nu) * T;
    return (alpha / Fb) * term;
  }
  const lfk = Math.log(F / K), fkb = (F * K) ** ((1 - beta) / 2);
  const z = (nu / alpha) * fkb * lfk;
  const x = Math.log((Math.sqrt(1 - 2 * rho * z + z * z) + z - rho) / (1 - rho));
  const denom = fkb * (1 + (((1 - beta) ** 2) / 24) * lfk * lfk + (((1 - beta) ** 4) / 1920) * lfk ** 4);
  const term = 1 + ((((1 - beta) ** 2) / 24) * (alpha * alpha) / fkb ** 2 + (rho * beta * nu * alpha) / (4 * fkb) + ((2 - 3 * rho * rho) / 24) * nu * nu) * T;
  return (alpha / denom) * (Math.abs(z) < eps ? 1 : z / x) * term;
}
// Heston (1993) European price via the characteristic function ("little Heston trap" form, Albrecher et al. 2007),
// midpoint rule on u in (0, umax]. Accurate to ~1e-6 for ordinary parameters.
export function hestonPrice({ S, K, T, r = 0, q = 0, v0, kappa, theta, xi, rho, type = "call", n = 4000, umax = 250 }) {
  const cx = (re, im = 0) => ({ re, im });
  const add = (a, b) => cx(a.re + b.re, a.im + b.im), sub = (a, b) => cx(a.re - b.re, a.im - b.im);
  const mul = (a, b) => cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
  const div = (a, b) => { const d = b.re * b.re + b.im * b.im; return cx((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
  const cexp = (a) => { const e = Math.exp(a.re); return cx(e * Math.cos(a.im), e * Math.sin(a.im)); };
  const clog = (a) => cx(Math.log(Math.hypot(a.re, a.im)), Math.atan2(a.im, a.re));
  const csqrt = (a) => { const m = Math.sqrt(Math.hypot(a.re, a.im)), th = Math.atan2(a.im, a.re) / 2; return cx(m * Math.cos(th), m * Math.sin(th)); };
  const sc = (a, s) => cx(a.re * s, a.im * s);
  const I = cx(0, 1), ONE = cx(1);
  const lnS = Math.log(S), lnK = Math.log(K);
  // characteristic function of ln S_T at complex argument w
  const phi = (w) => {
    const iw = mul(I, w);
    const b = sub(cx(kappa), sc(iw, rho * xi));                        // κ − iρξw
    const d = csqrt(add(mul(b, b), sc(add(iw, mul(w, w)), xi * xi)));  // √(b² + ξ²(iw + w²))
    const g = div(sub(b, d), add(b, d));
    const e = cexp(sc(d, -T));
    const Cc = add(mul(iw, cx(lnS + (r - q) * T)),
      sc(sub(sc(sub(b, d), T), sc(clog(div(sub(ONE, mul(g, e)), sub(ONE, g))), 2)), (kappa * theta) / (xi * xi)));
    const D = mul(sc(sub(b, d), 1 / (xi * xi)), div(sub(ONE, e), sub(ONE, mul(g, e))));
    return cexp(add(Cc, sc(D, v0)));
  };
  const fwd = S * Math.exp((r - q) * T);
  let P1 = 0, P2 = 0;
  const h = umax / n;
  for (let k = 1; k <= n; k++) {
    const u = (k - 0.5) * h;
    const eK = cx(Math.cos(u * lnK), -Math.sin(u * lnK)); // e^{−iu lnK}
    const iu = cx(0, u);
    P2 += div(mul(eK, phi(cx(u))), iu).re * h;
    P1 += div(mul(eK, phi(cx(u, -1))), sc(iu, fwd)).re * h;
  }
  P1 = 0.5 + P1 / Math.PI; P2 = 0.5 + P2 / Math.PI;
  const call = S * Math.exp(-q * T) * P1 - K * Math.exp(-r * T) * P2;
  return type === "put" ? call - S * Math.exp(-q * T) + K * Math.exp(-r * T) : call;
}

/* ---------------- hedging simulation ---------------- */
// Short one call at implied vol, delta-hedge at discrete steps along a GBM path with realized vol.
// Returns {pnl (per share, at expiry), path, hedgePnl series}. Theory: P&L ≈ Σ ½Γ S² (σ_imp² − σ_real²) dt
export function hedgeSim({ S0 = 100, K = 100, T = 30 / DAYS, r = 0, sigmaImp = 0.2, sigmaReal = 0.2, steps = 30, seed = 3, mu = 0 }) {
  const R = rng(seed), dt = T / steps;
  const path = gbmPath(R, S0, mu, sigmaReal, T, steps);
  let cash = bsPrice({ S: S0, K, T, r, sigma: sigmaImp, type: "call" }); // premium received
  let shares = greeks({ S: S0, K, T, r, sigma: sigmaImp, type: "call" }).delta;
  cash -= shares * S0;
  const series = [0];
  for (let i = 1; i <= steps; i++) {
    const S = path[i], tLeft = T - i * dt;
    cash *= Math.exp(r * dt);
    const optVal = bsPrice({ S, K, T: tLeft, r, sigma: sigmaImp, type: "call" });
    series.push(cash + shares * S - optVal);
    if (i < steps) {
      const nd = greeks({ S, K, T: tLeft, r, sigma: sigmaImp, type: "call" }).delta;
      cash -= (nd - shares) * S; shares = nd;
    }
  }
  const ST = path[steps];
  const pnl = cash + shares * ST - intrinsic("call", ST, K);
  return { pnl, path, series };
}

/* ---------------- sizing ---------------- */
// Kelly fraction for a bet that wins b× stake with prob p (loses stake otherwise): f* = p − (1 − p)/b
export const kellyFraction = (p, b) => p - (1 - p) / b;
// Expected log growth per bet at fraction f
export const kellyGrowth = (f, p, b) => p * Math.log(1 + f * b) + (1 - p) * Math.log(Math.max(1 - f, 1e-12));

/* ---------------- futures & perpetuals ---------------- */
export const futuresFair = (S, T, r = 0, q = 0) => S * Math.exp((r - q) * T);
export const annualizedBasis = (F, S, T) => Math.log(F / S) / T;
// Binance-style funding: F = P + clamp(I − P, −c, +c); defaults: interest 0.01% per 8h, clamp 0.05%
export const fundingRate = (premiumIndex, interest = 0.0001, clampC = 0.0005) => premiumIndex + clamp(interest - premiumIndex, -clampC, clampC);
// Payment for one funding interval (positive → longs pay shorts)
export const fundingPayment = (notional, rate) => notional * rate;
export const fundingAPR = (ratePerInterval, intervalsPerDay = 3) => ratePerInterval * intervalsPerDay * DAYS;
// Linear (USDT-margined) isolated liquidation price, simplified: long liq ≈ entry·(1 − 1/L + mmr), short ≈ entry·(1 + 1/L − mmr)
export const liqPrice = (entry, leverage, mmr = 0.005, side = "long") => (side === "long" ? entry * (1 - 1 / leverage + mmr) : entry * (1 + 1 / leverage - mmr));
export const linearPnL = (entry, exit, size, side = "long") => (side === "long" ? 1 : -1) * (exit - entry) * size;
// Inverse (coin-margined) contract P&L in coin: contracts × face × (1/entry − 1/exit)
export const inversePnL = (entry, exit, usdNotional, side = "long") => (side === "long" ? 1 : -1) * usdNotional * (1 / entry - 1 / exit);

/* ---------------- the course's standard numbers (see AUTHORING.md §0.2) ---------------- */
export const XYZ = { S: 100, r: 0.04, q: 0, sigma: 0.2 };
