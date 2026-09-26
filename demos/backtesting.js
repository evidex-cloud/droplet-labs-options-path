// Main demo for lesson backtesting: a synthetic 10-year, 5-stock monthly put-write backtest.
// Each pitfall can be switched on; the equity curve and the headline statistics change accordingly.
// The market is simulated (seeded): calm years, a stress episode in year 4, a smaller one in year 8,
// and one stock that collapses and is delisted in year 6. All numbers are illustrative.
import * as O from "./_opt.js";
import { lineChart, stats, tex } from "./_viz.js";

export const MONTHS = 120, STOCKS = 5, R_F = 0.04, TENOR = 30 / 365;

export function market(seed = 1) {
  const R = O.rng(seed), dt = 1 / 12, mu = 0.08, sig = [], jump = [];
  for (let t = 0; t < MONTHS; t++) {
    let s = 0.15, j = 0;
    if (t >= 38 && t <= 41) s = t === 38 ? 0.4 : 0.3;
    if (t === 38) j = -0.16;
    if (t === 90) { s = 0.3; j = -0.09; }
    if (t === 91) s = 0.25;
    sig.push(s); jump.push(j);
  }
  const S = Array.from({ length: STOCKS }, () => [100]);
  for (let t = 0; t < MONTHS; t++) {
    const zm = R.normal();
    for (let i = 0; i < STOCKS; i++) {
      const zi = R.normal(), s = sig[t] * (i === 4 ? 1.4 : 1.2);
      let x = (mu - (s * s) / 2) * dt + s * Math.sqrt(dt) * (0.6 * zm + 0.8 * zi) + jump[t];
      if (i === 4 && t === 70) x += Math.log(0.35); // stock 5 collapses and is delisted
      S[i].push(S[i][t] * Math.exp(x));
    }
  }
  return { S, sig };
}

// opts: mid (fills at mid), noFees, peek (vol filter uses this month's regime = look-ahead),
//       surv (drop the delisted stock from the universe), calm (test only the first 36 months), filter (honest vol filter)
export function run(mk, o = {}) {
  const { S, sig } = mk, rets = [];
  const rf = Math.exp(R_F / 12) - 1, end = o.calm ? 36 : MONTHS;
  for (let t = 0; t < end; t++) {
    let tot = 0, n = 0;
    for (let i = 0; i < STOCKS; i++) {
      if (o.surv && i === 4) continue;
      if (i === 4 && t > 70) { tot += rf; n++; continue; } // delisted: sleeve sits in cash
      const s0 = S[i][t], s1 = S[i][t + 1];
      const prev = t ? sig[t - 1] : 0.15;
      const iv = (0.6 * prev + 0.4 * 0.18 + 0.04) * (i === 4 ? 1.3 : 1.15);
      if (o.peek && sig[t] > 0.2) { tot += rf; n++; continue; } // uses the month's own volatility: not known at entry
      if (o.filter && prev > 0.2) { tot += rf; n++; continue; } // honest filter: last month's volatility, known at entry
      const K = 0.95 * s0, p = O.bsPrice({ S: s0, K, T: TENOR, r: R_F, sigma: iv, type: "put" });
      const half = o.mid ? 0 : Math.max((0.02 * s0) / 100, 0.08 * p), fee = o.noFees ? 0 : (0.0065 * s0) / 100;
      tot += (p - half - fee - Math.max(K - s1, 0)) / K + rf; n++;
    }
    rets.push(tot / n);
  }
  return rets;
}

export function metrics(rets) {
  const n = rets.length, m = rets.reduce((a, x) => a + x, 0) / n;
  const sd = Math.sqrt(rets.reduce((a, x) => a + (x - m) ** 2, 0) / (n - 1)), rf = Math.exp(R_F / 12) - 1;
  let eq = 1, pk = 1, dd = 0; const curve = [[0, 1]];
  rets.forEach((x, i) => { eq *= 1 + x; curve.push([(i + 1) / 12, eq]); pk = Math.max(pk, eq); dd = Math.min(dd, eq / pk - 1); });
  return { cagr: eq ** (12 / n) - 1, sharpe: ((m - rf) / sd) * Math.sqrt(12), dd, eq, curve, m, sd, worst: Math.min(...rets) };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const pits = [
    ["mid", T("按中间价成交", "Fill at mid")],
    ["noFees", T("不计手续费", "Ignore fees")],
    ["peek", T("前视：用当月的波动率决定是否开仓", "Look-ahead: vol filter uses this month's vol")],
    ["surv", T("幸存者：剔除已退市的股票", "Survivorship: drop the delisted stock")],
    ["calm", T("只测前 3 年（平静期）", "Test only the first 3 calm years")],
  ];
  const on = {};
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("一次卖出看跌的回测：把陷阱一个个打开", "A put-write backtest: switch the pitfalls on one by one")}</div>
    <p class="demo-meta">${T("模拟市场（示意）：5 只股票、10 年、每月卖出 30 天、行权价低 5% 的看跌期权，以现金全额担保。第 4 年有一次急跌，第 6 年一只股票暴跌 65% 后退市。", "Simulated market (illustrative): 5 stocks, 10 years; each month sell a 30-day put struck 5% below spot, fully cash-secured. A sharp sell-off hits in year 4; in year 6 one stock drops 65% and is delisted.")}</p>
    <div class="demo-btns" id="bt-pits">${pits.map(([k, l]) => `<button type="button" class="demo-btn" data-pit="${k}" aria-pressed="false">${l}</button>`).join("")}</div>
    <div class="demo-btns"><button type="button" class="demo-btn" id="bt-filter" aria-pressed="false">${T("诚实过滤器：上个月波动大就不卖（不是陷阱）", "Honest filter: skip if last month was volatile (not a pitfall)")}</button></div>
    <div class="demo-btns"><button type="button" class="demo-btn" data-all="1">${T("全部打开（“完美”回测）", "All on (the 'perfect' backtest)")}</button><button type="button" class="demo-btn" data-all="0">${T("全部关闭（诚实回测）", "All off (honest backtest)")}</button></div>
    <div id="bt-stats"></div>
    <div id="bt-chart"></div>
    <div class="demo-math" id="bt-f"></div>
    <p class="demo-tip">${T("试试：只打开“只测前 3 年”，夏普比率一下子冲到 3 以上——同一个策略、同样的成本，只是没见过坏日子。再全部关掉，看诚实的曲线在第 4 年那一跌里交出多少。", "Try this: switch on only 'first 3 calm years' and the Sharpe ratio jumps above 3 — same strategy, same costs, it just never saw a bad day. Then switch everything off and watch how much the honest curve gives back in year 4.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const mk = market(1);
  const honest = metrics(run(mk, {}));
  const draw = () => {
    const cur = metrics(run(mk, on));
    const pct = (x) => (x * 100).toFixed(1) + "%";
    const any = pits.some(([k]) => on[k]) || !!on.filter;
    $("#bt-stats").innerHTML = stats([
      [T("年化收益 CAGR", "CAGR"), pct(cur.cagr), any ? "acc" : ""],
      [T("夏普比率", "Sharpe ratio"), cur.sharpe.toFixed(2), any ? "acc" : ""],
      [T("最大回撤", "Max drawdown"), pct(cur.dd), "neg"],
      [T("最差月份", "Worst month"), pct(cur.worst), "neg"],
      [T("诚实版夏普", "Honest Sharpe"), honest.sharpe.toFixed(2)],
    ]);
    $("#bt-chart").innerHTML = lineChart({
      xmin: 0, xmax: 10, xlabel: T("年", "Years"), ylabel: T("净值（起始 = 1）", "Equity (start = 1)"),
      series: [
        { points: honest.curve, cls: 5, label: T("诚实回测", "Honest backtest") },
        { points: cur.curve, cls: 0, label: pits.some(([k]) => on[k]) ? T("打开陷阱后", "With pitfalls on") : on.filter ? T("诚实过滤器", "With the honest filter") : T("当前设置（= 诚实）", "Current setting (= honest)") },
      ],
      bands: [{ x0: 38 / 12, x1: 42 / 12, cls: 2, label: T("急跌", "sell-off") }, { x0: 70 / 12, x1: 71 / 12, cls: 1, label: T("退市", "delisting") }],
      yfmt: (v) => v.toFixed(2),
    });
    $("#bt-f").innerHTML = tex(String.raw`\text{SR} = \frac{\bar r - r_f}{s}\sqrt{12} = \frac{${(cur.m * 100).toFixed(3)}\% - ${(((Math.exp(R_F / 12) - 1)) * 100).toFixed(3)}\%}{${(cur.sd * 100).toFixed(3)}\%}\times\sqrt{12} = ${cur.sharpe.toFixed(2)}`, true);
  };
  const sync = () => {
    root.querySelectorAll("[data-pit]").forEach((b) => { const v = !!on[b.dataset.pit]; b.classList.toggle("on", v); b.setAttribute("aria-pressed", String(v)); });
    const fb = $("#bt-filter"); fb.classList.toggle("on", !!on.filter); fb.setAttribute("aria-pressed", String(!!on.filter));
  };
  root.querySelectorAll("[data-pit]").forEach((b) => b.addEventListener("click", () => { on[b.dataset.pit] = !on[b.dataset.pit]; sync(); draw(); }));
  root.querySelectorAll("[data-all]").forEach((b) => b.addEventListener("click", () => { for (const [k] of pits) on[k] = b.dataset.all === "1"; on.filter = false; sync(); draw(); }));
  $("#bt-filter").addEventListener("click", () => { on.filter = !on.filter; sync(); draw(); });
  draw();
}
