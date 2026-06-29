// demos/_bs.js —— 共享 Black-Scholes 定价 + 希腊字母引擎（被定价/波动率/希腊字母演示 import）
// 全部真算。约定：T 为年化到期时间，sigma/r/q 为年化小数（如 0.20 = 20%）。
// 希腊字母按常见交易口径缩放：vega=每 +1% 波动率，theta=每过 1 天(日历)，rho=每 +1% 利率。

// 标准正态 CDF（Abramowitz–Stegun 7.1.26，精度足够教学与交易）
export function normCDF(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989422804014327 * Math.exp(-x * x / 2);
  let p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return x >= 0 ? 1 - p : p;
}
export function normPDF(x) { return 0.3989422804014327 * Math.exp(-x * x / 2); }

function d1d2(S, K, T, r, sigma, q) {
  const s = sigma * Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r - q + sigma * sigma / 2) * T) / s;
  return [d1, d1 - s];
}

// 期权理论价。o = {S,K,T,r,sigma,type:'call'|'put',q=0}
export function bsPrice(o) {
  const { S, K, T, r, sigma, type } = o, q = o.q || 0;
  if (T <= 0 || sigma <= 0) { // 退化为内在价值
    return type === "put" ? Math.max(K - S, 0) : Math.max(S - K, 0);
  }
  const [d1, d2] = d1d2(S, K, T, r, sigma, q);
  const dfR = Math.exp(-r * T), dfQ = Math.exp(-q * T);
  return type === "put"
    ? K * dfR * normCDF(-d2) - S * dfQ * normCDF(-d1)
    : S * dfQ * normCDF(d1) - K * dfR * normCDF(d2);
}

// 希腊字母（交易口径）。返回 {price, delta, gamma, theta, vega, rho, d1, d2}
export function greeks(o) {
  const { S, K, T, r, sigma, type } = o, q = o.q || 0;
  const price = bsPrice(o);
  if (T <= 0 || sigma <= 0) {
    const itm = type === "put" ? S < K : S > K;
    return { price, delta: itm ? (type === "put" ? -1 : 1) : 0, gamma: 0, theta: 0, vega: 0, rho: 0, d1: 0, d2: 0 };
  }
  const [d1, d2] = d1d2(S, K, T, r, sigma, q);
  const dfR = Math.exp(-r * T), dfQ = Math.exp(-q * T), nd1 = normPDF(d1);
  const delta = type === "put" ? dfQ * (normCDF(d1) - 1) : dfQ * normCDF(d1);
  const gamma = dfQ * nd1 / (S * sigma * Math.sqrt(T));
  const vega = S * dfQ * nd1 * Math.sqrt(T) / 100; // 每 +1% 波动率
  const thetaYr = type === "put"
    ? -(S * dfQ * nd1 * sigma) / (2 * Math.sqrt(T)) + r * K * dfR * normCDF(-d2) - q * S * dfQ * normCDF(-d1)
    : -(S * dfQ * nd1 * sigma) / (2 * Math.sqrt(T)) - r * K * dfR * normCDF(d2) + q * S * dfQ * normCDF(d1);
  const theta = thetaYr / 365; // 每过 1 天
  const rho = (type === "put" ? -K * T * dfR * normCDF(-d2) : K * T * dfR * normCDF(d2)) / 100; // 每 +1% 利率
  return { price, delta, gamma, theta, vega, rho, d1, d2 };
}

// 由市场价反解隐含波动率（二分法，稳健）。返回小数或 NaN
export function impliedVol(price, o) {
  const intrinsic = o.type === "put" ? Math.max(o.K - o.S, 0) : Math.max(o.S - o.K, 0);
  if (price <= intrinsic + 1e-8) return NaN; // 低于内在价值无解
  let lo = 1e-4, hi = 5;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    const p = bsPrice({ ...o, sigma: mid });
    if (Math.abs(p - price) < 1e-6) return mid;
    if (p > price) hi = mid; else lo = mid;
  }
  return (lo + hi) / 2;
}
