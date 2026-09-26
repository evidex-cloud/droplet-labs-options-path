// Main demo for lesson python-backtest: the lesson's pandas put-write backtest, mirrored line by line in JS.
// synthPrices ↔ synthetic_prices, runPutWrite ↔ backtest_putwrite, btMetrics ↔ metrics. Same rules, same
// fills, same ledger; the random paths come from the course engine's seeded generator, not numpy's.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, esc } from "./_viz.js";

// Python's round(): halves go to the even neighbour
export const pyRound = (x) => { const f = Math.floor(x), d = x - f; if (Math.abs(d - 0.5) < 1e-12) return f % 2 === 0 ? f : f + 1; return Math.round(x); };

export function synthPrices({ days = 3650, s0 = 100, mu = 0.08, sigma = 0.15, jumpProb = 0.0005, jump = -0.2, seed = 7 } = {}) {
  const R = O.rng(seed), dt = 1 / 365, z = [], u = [];
  for (let i = 0; i < days; i++) z.push(R.normal());
  for (let i = 0; i < days; i++) u.push(R());
  const out = [s0];
  let lx = 0;
  for (let i = 0; i < days; i++) { lx += (mu - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * z[i] + (u[i] < jumpProb ? Math.log(1 + jump) : 0); out.push(s0 * Math.exp(lx)); }
  return out;
}

export function runPutWrite(close, { capital = 100000, moneyness = 0.95, dte = 30, iv = 0.2, r = 0.04, spread = 0.1, fee = 0.65, fill = "bid", skipAbove = null, lookahead = false } = {}) {
  const N = close.length, lr = [NaN];
  for (let i = 1; i < N; i++) lr.push(Math.log(close[i] / close[i - 1]));
  const rv = close.map((_, i) => {
    if (i < 20) return NaN;
    const w = lr.slice(i - 19, i + 1), m = w.reduce((a, b) => a + b, 0) / 20;
    return Math.sqrt(w.reduce((a, b) => a + (b - m) ** 2, 0) / 19) * Math.sqrt(365);
  });
  const signal = lookahead ? close.map((_, i) => (i + 20 < N ? rv[i + 20] : NaN)) : rv;
  let cash = capital, K = null, n = 0, expiry = null, next = 0, prem = 0;
  const rows = [], cycles = [];
  for (let i = 0; i < N; i++) {
    const S = close[i];
    if (i > 0) cash *= Math.exp(r / 365);
    if (K !== null && i === expiry) {
      const pay = n * 100 * Math.max(K - S, 0);
      cash -= pay; cycles.push({ i, K, ST: S, premium: prem, payout: pay }); K = null;
    }
    let opened = null;
    if (i === next && i + dte < N) {
      next = i + dte;
      const skip = skipAbove != null && signal[i] > skipAbove;
      if (!skip) {
        K = pyRound(S * moneyness); n = Math.floor(cash / (K * 100));
        const mid = O.bsPrice({ S, K, T: dte / 365, r, sigma: iv, type: "put" });
        const half = Math.max(spread * mid, 0.01), px = fill === "mid" ? mid : Math.max(mid - half, 0);
        prem = n * (100 * px - fee); cash += prem; expiry = i + dte;
        opened = { K, n, mid, px, prem };
      }
    }
    let put = 0, delta = 0, vega = 0;
    if (K !== null) { const g = O.greeks({ S, K, T: (expiry - i) / 365, r, sigma: iv, type: "put" }); put = g.price; delta = -n * 100 * g.delta; vega = -n * 100 * g.vega; }
    rows.push({ i, S, cash, put, K, n, equity: cash - n * 100 * put, delta, vega, opened });
  }
  return { rows, cycles };
}

export function btMetrics(rows, cycles, { r = 0.04, dte = 30 } = {}) {
  const eq = rows.map((x) => x.equity), N = eq.length, years = (N - 1) / 365;
  const cagr = (eq[N - 1] / eq[0]) ** (1 / years) - 1;
  let pk = -Infinity, mdd = 0;
  for (const e of eq) { pk = Math.max(pk, e); mdd = Math.min(mdd, e / pk - 1); }
  const s = [];
  for (let i = 0; i < N; i += dte) s.push(eq[i]);
  const cyc = s.slice(1).map((x, i) => x / s[i] - 1), n = cyc.length;
  const m = cyc.reduce((a, b) => a + b, 0) / n, sd = Math.sqrt(cyc.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1));
  const rf = Math.exp((r * dte) / 365) - 1, sharpe = ((m - rf) / sd) * Math.sqrt(365 / dte);
  const m2 = cyc.reduce((a, b) => a + (b - m) ** 2, 0) / n, m3 = cyc.reduce((a, b) => a + (b - m) ** 3, 0) / n;
  const skew = n > 2 && m2 > 0 ? (m3 / m2 ** 1.5) * (Math.sqrt(n * (n - 1)) / (n - 2)) : 0;
  const win = cycles.length ? cycles.filter((c) => c.payout < c.premium).length / cycles.length : 0;
  return { CAGR: cagr, max_drawdown: mdd, sharpe, worst_cycle: n ? Math.min(...cyc) : 0, skew, win_rate: win, cycles: cycles.length, cyc };
}

// print(pd.Series(...).round(3)) in pandas' layout
export function pandasSeries(m) {
  const keys = ["CAGR", "max_drawdown", "sharpe", "worst_cycle", "skew", "win_rate", "cycles"];
  const vals = keys.map((k) => (isFinite(m[k]) ? m[k].toFixed(3) : "NaN"));
  const w = Math.max(...vals.map((v) => v.length)), kw = Math.max(...keys.map((k) => k.length)) + 4;
  return keys.map((k, i) => k.padEnd(kw) + vals[i].padStart(w)).join("\n") + "\ndtype: float64";
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const st = { fill: "bid", filter: "off", dte: 30 };
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("同一个回测，用 JS 逐行镜像", "The same backtest, mirrored line by line in JS")}</div>
    <div class="demo-label">${T("数据（合成价格）", "Data (synthetic prices)")}</div>
    <div class="demo-grid">
      ${slider("pbt-seed", T("随机种子（换一段“历史”）", "Seed (a different “history”)"), 1, 20, 1, 3)}
      ${slider("pbt-sig", T("扩散波动率 σ", "Diffusive vol σ"), 5, 40, 1, 15)}
      ${slider("pbt-jp", T("每日跳跃概率", "Daily jump probability"), 0, 30, 1, 5)}
      ${slider("pbt-js", T("跳跃幅度", "Jump size"), -40, 0, 1, -20)}
    </div>
    <div class="demo-label">${T("策略与成交", "Strategy and fills")}</div>
    <div class="demo-grid">
      ${slider("pbt-m", T("行权价 / 现价", "Strike / spot"), 0.85, 1, 0.01, 0.95)}
      ${slider("pbt-iv", T("定价用的隐含波动率", "Implied vol used to price"), 10, 40, 1, 20)}
      ${slider("pbt-sp", T("半个价差（占中间价）", "Half-spread (share of mid)"), 0, 30, 1, 10)}
      ${slider("pbt-fee", T("每张费用", "Fee per contract"), 0, 1.3, 0.05, 0.65)}
    </div>
    <div class="demo-row">${seg("pbt-dte", [["14", T("14 天", "14 days")], ["30", T("30 天", "30 days")], ["45", T("45 天", "45 days")]], "30")}
      ${seg("pbt-fill", [["bid", T("按买价成交", "fill at bid")], ["mid", T("按中间价成交（坑）", "fill at mid (pitfall)")]], "bid")}</div>
    <div class="demo-row">${seg("pbt-filter", [["off", T("不过滤", "no filter")], ["honest", T("波动率过滤（诚实）", "vol filter (honest)")], ["look", T("波动率过滤（偷看未来）", "vol filter (look-ahead bug)")]], "off")}</div>
    <pre class="demo-out" id="pbt-print" style="white-space:pre-wrap;overflow-wrap:anywhere"></pre>
    <div id="pbt-eq"></div>
    <div id="pbt-delta"></div>
    <p class="demo-tip">${T("试试：只换种子，规则和参数完全不变，夏普比率会从负数跳到 2 以上——一条历史只是一次抽样。再打开“偷看未来”，看一个错位的索引能凭空造出多高的夏普。", "Try this: change only the seed — same rules, same parameters — and the Sharpe ratio swings from negative to above 2: one history is one draw. Then switch on the look-ahead filter and see how high one shifted index can push the Sharpe ratio.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const close = synthPrices({ seed: v["pbt-seed"], sigma: v["pbt-sig"] / 100, jumpProb: v["pbt-jp"] / 10000, jump: v["pbt-js"] / 100 });
    const p = { moneyness: v["pbt-m"], iv: v["pbt-iv"] / 100, spread: v["pbt-sp"] / 100, fee: v["pbt-fee"], fill: st.fill, dte: st.dte,
      skipAbove: st.filter === "off" ? null : 0.2, lookahead: st.filter === "look" };
    const { rows, cycles } = runPutWrite(close, p);
    const M = btMetrics(rows, cycles, { dte: st.dte });
    const call = `backtest_putwrite(close, moneyness=${p.moneyness.toFixed(2)}, dte=${p.dte}, iv=${p.iv.toFixed(2)}, spread=${p.spread.toFixed(2)}, fee=${p.fee.toFixed(2)}, fill="${p.fill}"${p.skipAbove != null ? `, skip_rv_above=0.20${p.lookahead ? ", lookahead=True" : ""}` : ""})`;
    $("#pbt-print").innerHTML = `<span style="color:var(--muted)">${esc(`>>> close = synthetic_prices(sigma=${(v["pbt-sig"] / 100).toFixed(2)}, jump_prob=${(v["pbt-jp"] / 10000).toFixed(4)}, jump=${(v["pbt-js"] / 100).toFixed(2)}, seed=${v["pbt-seed"]})`)}\n${esc(">>> daily, cycles = " + call)}\n${esc(">>> print(metrics(daily, cycles, dte=" + p.dte + ").round(3))")}</span>\n<b>${esc(pandasSeries(M))}</b>`;
    const step = 5, eqPts = [], bhPts = [], cashPts = [], dPts = [];
    for (let i = 0; i < rows.length; i += step) {
      const yr = i / 365;
      eqPts.push([yr, rows[i].equity / 1000]); bhPts.push([yr, (close[i] / close[0]) * 100]); cashPts.push([yr, 100 * Math.exp(0.04 * yr)]); dPts.push([yr, rows[i].delta]);
    }
    $("#pbt-eq").innerHTML = lineChart({
      xmin: 0, xmax: 10, xlabel: T("年", "years"), ylabel: T("千美元", "$ thousands"), H: 250,
      series: [{ points: eqPts, cls: 0, label: T("卖看跌（权益）", "put-write equity") }, { points: cashPts, cls: 5, dashed: true, label: T("只拿国库券 4%", "T-bills only, 4%") }, { points: bhPts, cls: 1, label: T("买入持有股票", "buy and hold the stock") }],
    });
    $("#pbt-delta").innerHTML = lineChart({
      xmin: 0, xmax: 10, xlabel: T("年", "years"), ylabel: T("Delta（股）", "delta (shares)"), H: 180,
      series: [{ points: dPts, cls: 2, label: T("卖出看跌的等效股数", "shares-equivalent of the short puts") }],
    });
  };
  const spec = { "pbt-seed": (x) => String(x), "pbt-sig": (x) => x + "%", "pbt-jp": (x) => (x / 10000).toFixed(4) + (x > 0 ? T(`（约每 ${(10000 / x / 365).toFixed(1)} 年一次）`, ` (about one every ${(10000 / x / 365).toFixed(1)} years)`) : ""), "pbt-js": (x) => x + "%", "pbt-m": (x) => x.toFixed(2), "pbt-iv": (x) => x + "%", "pbt-sp": (x) => x + "%", "pbt-fee": (x) => "$" + x.toFixed(2) };
  const run = bindSliders(root, spec, draw);
  onSeg(root, "pbt-fill", (k) => { st.fill = k; run(); });
  onSeg(root, "pbt-filter", (k) => { st.filter = k; run(); });
  onSeg(root, "pbt-dte", (k) => { st.dte = +k; run(); });
}
