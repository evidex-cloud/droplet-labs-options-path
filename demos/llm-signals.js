// Main demo for lesson llm-signals: a toy text signal for earnings volatility, end to end.
// Synthetic earnings events (2019–2026) each come with two pre-event headline phrases whose tone is weakly related to how big
// the post-earnings move turns out. A toy scorer turns phrases into a number; we measure the information coefficient (IC),
// fit a regression of the realised/implied move ratio on the score, and backtest "buy the straddle when the score is high".
// The leak toggle simulates a language model whose training data runs past the test dates: before its cutoff it has
// effectively read the aftermath, so its scores secretly contain the outcome.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export const PHRASES = {
  up: [["guidance withdrawn", "撤回业绩指引"], ["CFO departs", "首席财务官离职"], ["regulator opens probe", "监管机构启动调查"], ["supplier delays", "供应商延迟交货"], ["warns on margins", "预警利润率"], ["restates prior results", "重述以往业绩"]],
  calm: [["reaffirms guidance", "重申业绩指引"], ["orders steady", "订单平稳"], ["in line with estimates", "与预期一致"], ["buyback extended", "延长回购计划"], ["on track for launch", "新品按计划推进"]],
  neutral: [["to report Tuesday", "周二发布财报"], ["analysts await call", "分析师等待电话会"], ["new CEO letter", "新 CEO 致股东信"], ["hosts investor day", "举办投资者日"]],
};

export function makeEvents({ n = 480, seed = 34 } = {}) {
  const R = O.rng(seed), ev = [];
  const sig = (x) => 1 / (1 + Math.exp(-x));
  for (let i = 0; i < n; i++) {
    const L = R.normal(), e = R.normal();
    const m = Math.exp(0.12 * L + 0.42 * e - 0.5 * (0.12 * 0.12 + 0.42 * 0.42)) * 0.93; // realised / implied move
    const ph = [];
    let s = 0;
    for (let k = 0; k < 2; k++) {
      const u = R(), pu = sig(0.9 * L - 1.1), pc = sig(-0.9 * L - 0.7);
      if (u < pu) { ph.push(["up", Math.floor(R() * PHRASES.up.length)]); s += 1; }
      else if (u < pu + pc) { ph.push(["calm", Math.floor(R() * PHRASES.calm.length)]); s -= 1; }
      else ph.push(["neutral", Math.floor(R() * PHRASES.neutral.length)]);
    }
    ev.push({ t: 2019 + (i / n) * 7.67, m, s, ph });
  }
  // standardised outcome, used only by the leak
  const mm = ev.reduce((a, x) => a + x.m, 0) / n, sd = Math.sqrt(ev.reduce((a, x) => a + (x.m - mm) ** 2, 0) / n);
  ev.forEach((x) => (x.z = (x.m - mm) / sd));
  return ev;
}

// Spearman rank correlation
export function rankIC(xs, ys) {
  const rank = (a) => { const idx = a.map((v, i) => [v, i]).sort((p, q) => p[0] - q[0]), r = new Array(a.length); let i = 0; while (i < idx.length) { let j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++; for (let k = i; k <= j; k++) r[idx[k][1]] = (i + j) / 2; i = j + 1; } return r; };
  const a = rank(xs), b = rank(ys), n = a.length, ma = a.reduce((p, q) => p + q, 0) / n, mb = b.reduce((p, q) => p + q, 0) / n;
  let c = 0, va = 0, vb = 0;
  for (let i = 0; i < n; i++) { c += (a[i] - ma) * (b[i] - mb); va += (a[i] - ma) ** 2; vb += (b[i] - mb) ** 2; }
  return c / Math.sqrt(va * vb);
}
export function ols(xs, ys) {
  const n = xs.length, mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
  const b = sxy / sxx, a = my - b * mx;
  let sse = 0;
  for (let i = 0; i < n; i++) sse += (ys[i] - a - b * xs[i]) ** 2;
  return { a, b, t: b / Math.sqrt(sse / (n - 2) / sxx) };
}

export function run(ev, { leak = false, cutoff = 2025, thr = 1, cost = 0.04, premium = 500, side = "long" }) {
  const score = ev.map((x) => (leak && x.t < cutoff ? x.s + 0.8 * x.z : x.s));
  const pre = ev.map((x, i) => i).filter((i) => ev[i].t < cutoff), post = ev.map((x, i) => i).filter((i) => ev[i].t >= cutoff);
  const icOf = (ids) => rankIC(ids.map((i) => score[i]), ids.map((i) => ev[i].m));
  const trades = [];
  let cum = 0;
  const curve = [[2019, 0]];
  ev.forEach((x, i) => {
    const go = side === "long" ? score[i] >= thr : score[i] <= -thr;
    if (go) { const pl = (side === "long" ? x.m - 1 : 1 - x.m) * premium - cost * premium; cum += pl; trades.push({ pl, post: x.t >= cutoff }); curve.push([x.t, cum]); }
  });
  const summ = (tr) => { const n = tr.length; if (!n) return { n: 0, mean: 0, win: 0, t: 0 }; const m = tr.reduce((a, b) => a + b.pl, 0) / n; const sd = Math.sqrt(tr.reduce((a, b) => a + (b.pl - m) ** 2, 0) / Math.max(1, n - 1)); return { n, mean: m, win: tr.filter((q) => q.pl > 0).length / n, t: sd > 0 ? (m / sd) * Math.sqrt(n) : 0 }; };
  const baseTr = ev.map((x) => ({ pl: (side === "long" ? x.m - 1 : 1 - x.m) * premium - cost * premium, post: x.t >= cutoff }));
  return { base: summ(baseTr), icPre: icOf(pre), icPost: icOf(post), reg: ols(score, ev.map((x) => x.m)), curve, all: summ(trades), pre: summ(trades.filter((q) => !q.post)), post: summ(trades.filter((q) => q.post)) };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const ev = makeEvents();
  let leak = false, side = "long";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("从标题到交易：一个玩具文本信号的回测，以及“读过未来”的模型", "From headlines to trades: backtesting a toy text signal — and a model that has read the future")}</div>
    <p class="demo-meta">${T("480 次模拟财报（2019–2026），每次有两条财报前的标题短语。规则：得分 ≥ 阈值就买入平值跨式（权利金 500 美元/张，按隐含波动的“预期波动”定价），财报后平仓。真实关系很弱：不确定性词汇略多时，实际波动略大。", "480 simulated earnings events (2019–2026), each with two pre-earnings headline phrases. Rule: when the score is at or above the threshold, buy the at-the-money straddle ($500 a contract, priced at the implied move) and close it after the report. The true relationship is weak: more uncertainty words go with slightly bigger moves.")}</p>
    <div class="demo-row"><div class="demo-field"><div class="demo-label">${T("打分模型", "Scoring model")}</div>${seg("ls-leak", [["no", T("训练截止在测试期之前（干净）", "Training cutoff before the test period (clean)")], ["yes", T("训练数据延伸到 2025 年（泄漏）", "Training data runs to 2025 (leaky)")]], "no")}</div></div>
    <div class="demo-row"><div class="demo-field"><div class="demo-label">${T("交易方向", "Trade")}</div>${seg("ls-side", [["long", T("得分高 → 买跨式（做多波动）", "High score → buy straddle (long vol)")], ["short", T("得分低 → 卖跨式（做空波动）", "Low score → sell straddle (short vol)")]], "long")}</div></div>
    <div class="demo-grid">
      ${slider("ls-thr", T("入场阈值 |s| ≥", "Entry threshold |s| ≥"), 1, 2, 1, 1)}
      ${slider("ls-cost", T("往返交易成本（占权利金）", "Round-trip cost (share of premium)"), 0, 10, 0.5, 4)}
    </div>
    <div id="ls-stats"></div>
    <div id="ls-chart"></div>
    <div class="demo-math" id="ls-f"></div>
    <div id="ls-sample"></div>
    <p class="demo-tip">${T("试试：打开“泄漏”——2025 年之前的 IC 暴涨、资金曲线笔直向上，一过模型的训练截止日就掉下悬崖。再把成本从 4% 拉到 0：干净信号买跨式仍然略亏——跨式平均比随后的实际波动贵，信号是真的，但比这份溢价小。最后换成“得分低 → 卖跨式”，看信号加上溢价之后的样子。", "Try this: switch on the leak — the IC before 2025 soars and the equity curve climbs in a straight line, then stalls at the model's training cutoff. Then slide the cost from 4% to 0: even free trading leaves the clean long-straddle rule slightly negative, because straddles are priced above the average move that follows — the signal is real but smaller than that premium. Finally switch to “Low score → sell straddle” to see the signal and the premium working together.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const r = run(ev, { leak, side, thr: v["ls-thr"], cost: v["ls-cost"] / 100 });
    const usd = (x) => (x < 0 ? "−$" : "$") + Math.abs(x).toFixed(0);
    $("#ls-stats").innerHTML = stats([
      [T("IC：2025 年前", "IC before 2025"), r.icPre.toFixed(3), r.icPre > 0.2 ? "neg" : "acc"],
      [T("IC：2025 年后", "IC from 2025"), r.icPost.toFixed(3), "acc"],
      [T("交易次数（前 / 后）", "Trades (before / from)"), r.pre.n + " / " + r.post.n],
      [T("每笔平均盈亏（前 / 后）", "Mean P&L per trade (before / from)"), usd(r.pre.mean) + " / " + usd(r.post.mean), r.post.mean > 0 ? "pos" : "neg"],
      [T("胜率（前 / 后）", "Win rate (before / from)"), (r.pre.win * 100).toFixed(0) + "% / " + (r.post.win * 100).toFixed(0) + "%"],
      [T("基准：每次财报都做（每笔）", "Baseline: trade every event (per trade)"), usd(r.base.mean)],
    ]);
    // with the leak on, keep the clean scorer's curve as a grey reference: same rule, same events, honest scores
    const clean = leak ? run(ev, { leak: false, side, thr: v["ls-thr"], cost: v["ls-cost"] / 100 }) : null;
    const series = [{ points: r.curve, cls: leak ? 2 : 0, label: leak ? T("泄漏的打分器（累计盈亏，每张合约）", "Leaky scorer (cumulative P&L per contract)") : T("累计盈亏（每张合约，美元）", "Cumulative P&L (per contract, $)") }];
    if (clean) series.push({ points: clean.curve, cls: 5, dashed: true, label: T("干净的打分器", "Clean scorer") });
    $("#ls-chart").innerHTML = lineChart({
      series,
      xmin: 2019, xmax: 2026.7, markers: [{ x: 2025, label: T("模型训练截止", "model training cutoff") }],
      xlabel: T("年份", "Year"), ylabel: T("累计盈亏（美元）", "Cumulative P&L ($)"), H: 240, xfmt: (x) => String(Math.round(x)), yfmt: (y) => (y < 0 ? "−$" : y > 0 ? "+$" : "$") + (Math.abs(y) >= 1000 ? (Math.abs(y) / 1000).toFixed(Math.abs(y) % 1000 ? 1 : 0) + "k" : Math.round(Math.abs(y))),
    });
    $("#ls-f").innerHTML = tex(String.raw`\frac{\text{${T("实际波动", "realized move")}}}{\text{${T("隐含波动", "implied move")}}} = ${r.reg.a.toFixed(3)} ${r.reg.b >= 0 ? "+" : "-"} ${Math.abs(r.reg.b).toFixed(3)}\,s \qquad (t = ${r.reg.t.toFixed(1)}), \qquad \text{IC} = \operatorname{corr}_{\text{rank}}(s_i,\ m_i)`, true);
    const ex = ev.slice(0, 4).map((x) => `<tr><td>${Math.floor(x.t)}-${String(Math.floor((x.t - Math.floor(x.t)) * 12) + 1).padStart(2, "0")}</td><td>${x.ph.map(([k, j]) => `<span class="tag${k === "up" ? " bad" : k === "calm" ? " ok" : ""}">${PHRASES[k][j][en ? 0 : 1]}</span>`).join(" ")}</td><td>${x.s > 0 ? "+" : ""}${x.s}</td><td>${x.m.toFixed(2)}</td></tr>`).join("");
    $("#ls-sample").innerHTML = `<table><tr><th>${T("时间", "Date")}</th><th>${T("标题短语", "Headline phrases")}</th><th>${T("得分 s", "Score s")}</th><th>${T("实际/隐含", "Realized/implied")}</th></tr>${ex}</table>`;
  };
  const rerun = bindSliders(root, { "ls-thr": (x) => x, "ls-cost": (x) => (+x).toFixed(1) + "%" }, draw);
  onSeg(root, "ls-leak", (v) => { leak = v === "yes"; rerun(); });
  onSeg(root, "ls-side", (v) => { side = v; rerun(); });
}
