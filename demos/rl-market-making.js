// Main demo for lesson rl-market-making: a tabular Q-learning market maker trained by trial and error in a simulated
// limit-order market, compared with the Avellaneda–Stoikov (AS) formula and a naive symmetric quote.
// Two worlds: the AS model's own world, and a "toxic flow" world where every fill is followed by an adverse price move.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, stats, tex } from "./_viz.js";

export const MM = { s0: 100, sigma: 2, T: 1, steps: 200, gamma: 0.1, k: 1.5, A: 140, Qmax: 8 };
const dt = MM.T / MM.steps;
const HS = [0.6, 0.9, 1.2, 1.5], SK = [-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2];
export const NA = HS.length * SK.length;
const NS = 2 * MM.Qmax + 1;
export const action = (a) => { const h = HS[Math.floor(a / SK.length)], s = SK[a % SK.length]; return { db: h + s, da: h - s, h, s }; };
const sidx = (q) => Math.max(-MM.Qmax, Math.min(MM.Qmax, q)) + MM.Qmax;

// One trading session. policy(q, tau, s) → {db, da, a}. onStep(q, a, reward, q2) for learning. world.tox = adverse move after fills.
export function session(policy, R, world, onStep) {
  let s = MM.s0, q = 0, cash = 0, pen = 0;
  const sq = Math.sqrt(dt) * MM.sigma, tox = world.tox || 0;
  for (let i = 0; i < MM.steps; i++) {
    const tau = MM.T - i * dt, q0 = q, pol = policy(q, tau, s);
    let edge = 0, adverse = 0;
    if (q < MM.Qmax && R() < MM.A * Math.exp(-MM.k * pol.db) * dt) { q += 1; cash -= s - pol.db; edge += pol.db; adverse -= tox; }
    if (q > -MM.Qmax && R() < MM.A * Math.exp(-MM.k * pol.da) * dt) { q -= 1; cash += s + pol.da; edge += pol.da; adverse += tox; }
    if (adverse) s += adverse;
    s += R() < 0.5 ? sq : -sq;
    const p = 0.5 * MM.gamma * MM.sigma * MM.sigma * q * q * dt;
    pen += p;
    // learning signal: spread earned + loss from adverse moves − inventory penalty (the zero-mean random wiggle q·dW is left out)
    if (onStep) onStep(q0, pol.a, edge + q * adverse - p, q);
  }
  return { pnl: cash + q * s, pen, q };
}

export const asQuotes = (q, tau) => {
  const res = -q * MM.gamma * MM.sigma ** 2 * tau; // reservation price minus mid
  const half = 0.5 * MM.gamma * MM.sigma ** 2 * tau + (1 / MM.gamma) * Math.log(1 + MM.gamma / MM.k);
  return { db: half - res, da: half + res, res, half };
};
export const asPolicy = (q, tau) => ({ ...asQuotes(q, tau), a: -1 });
export const symPolicy = () => { const h = asQuotes(0, 0.5).half; return { db: h, da: h, a: -1 }; };

export function makeLearner(seed = 3) {
  const Q = new Float64Array(NS * NA), N = new Float64Array(NS * NA), R = O.rng(seed);
  let eps = 1;
  const greedyA = (q) => { const b = sidx(q) * NA; let a = 0; for (let j = 1; j < NA; j++) if (Q[b + j] > Q[b + a]) a = j; return a; };
  const behave = (q) => { const a = R() < eps ? Math.floor(R() * NA) : greedyA(q); return { ...action(a), a }; };
  const onStep = (q, a, r, q2) => {
    const idx = sidx(q) * NA + a, b = sidx(q2) * NA;
    let m = -Infinity;
    for (let j = 0; j < NA; j++) if (Q[b + j] > m) m = Q[b + j];
    N[idx]++;
    Q[idx] += Math.max(0.01, 1 / N[idx]) * (r + 0.99 * m - Q[idx]);
  };
  return {
    train(world, episodes, done, total) {
      for (let e = 0; e < episodes; e++) { eps = Math.max(0.05, 1 - (done + e) / (total * 0.7)); session(behave, R, world, onStep); }
    },
    greedy: (q) => { const a = greedyA(q); return { ...action(a), a }; },
  };
}

export function evaluate(policy, world, n = 1000, seed = 42) {
  const R = O.rng(seed), pn = [], ra = [];
  let aq = 0;
  for (let e = 0; e < n; e++) { const r = session(policy, R, world, null); pn.push(r.pnl); ra.push(r.pnl - r.pen); aq += Math.abs(r.q); }
  const mean = pn.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(pn.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1));
  return { mean, sd, risk: ra.reduce((a, b) => a + b, 0) / n, absq: aq / n };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let worldName = "as", total = 20000, busy = false, curve = [];
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("强化学习做市商 vs Avellaneda–Stoikov 公式", "A reinforcement-learning market maker vs the Avellaneda–Stoikov formula")}</div>
    <p class="demo-meta">${T("一个程式化市场：中间价 100，每步随机上下跳动，σ = 2（每个交易时段），200 步；我们的报价离中间价越远，成交概率越低（λ(δ) = 140·e^(−1.5δ)）；库存上限 ±8；风险厌恶 γ = 0.1。智能体只看到自己的库存 q，从 28 种报价（4 种半价差 × 7 种偏移）里选。", "A stylized market: mid price 100 that ticks randomly up or down, σ = 2 per session, 200 steps; the further our quote from the mid, the less likely it fills (λ(δ) = 140·e^(−1.5δ)); inventory limit ±8; risk aversion γ = 0.1. The agent sees only its inventory q and picks one of 28 quotes (4 half-spreads × 7 skews).")}</p>
    <div class="demo-row"><div class="demo-field"><div class="demo-label">${T("市场世界", "Market world")}</div>${seg("rl-w", [["as", T("AS 模型本身的世界", "The AS model's own world")], ["toxic", T("有“毒性”订单流", "Toxic order flow")]], "as")}</div>
    <div class="demo-field"><div class="demo-label">${T("训练回合数", "Training sessions")}</div>${seg("rl-n", [["5000", "5,000"], ["20000", "20,000"]], "20000")}</div>
    <div class="demo-btns" style="margin:0"><button class="demo-btn" data-train>${T("开始训练", "Train the agent")}</button></div></div>
    <div id="rl-curve"></div>
    <div id="rl-stats"></div>
    <div id="rl-table"></div>
    <div class="demo-math" id="rl-f"></div>
    <p class="demo-tip">${T("试试：先在“AS 的世界”里训练——智能体逐渐逼近公式，但很难超过它（公式在它自己的世界里就是最优）。再换到“毒性订单流”：每次成交后价格都朝对你不利的方向跳 0.8，公式不知道这件事，智能体却从试错里学会把报价放宽。", "Try this: train in the AS world first — the agent creeps up toward the formula but struggles to beat it (the formula is optimal in its own world). Then switch to “Toxic order flow”, where every fill is followed by a 0.8 move against you: the formula does not know this, but the agent learns by trial and error to widen its quotes.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const world = () => (worldName === "toxic" ? { tox: 0.8 } : {});
  let base = null;
  const showBase = () => {
    base = { as: evaluate(asPolicy, world()), sym: evaluate(symPolicy, world()) };
    curve = [];
    render(null);
  };
  const render = (learner) => {
    const rl = learner ? evaluate(learner.greedy, world()) : null;
    // y-range: frame the two baselines and the learning curve, rounded to 5s, so the lines and their labels stay apart
    const ys = [base.as.risk, base.sym.risk, ...curve.map((p) => p[1])];
    const yLo = Math.floor((Math.min(...ys) - 8) / 5) * 5, yHi = Math.ceil((Math.max(...ys) + 4) / 5) * 5;
    $("#rl-curve").innerHTML = lineChart({
      series: curve.length ? [{ points: curve, cls: 0, dots: true, label: T("智能体（贪婪策略，风险调整后盈亏）", "Agent (greedy policy, risk-adjusted P&L)") }] : [{ points: [[0, base.as.risk]], cls: 0, dotsOnly: true }],
      xmin: 0, xmax: total, ymin: yLo, ymax: yHi,
      hlines: [{ y: base.as.risk, label: T("AS 公式", "AS formula") + " " + base.as.risk.toFixed(1) }, { y: base.sym.risk, label: T("对称报价", "symmetric quote") + " " + base.sym.risk.toFixed(1) }],
      xlabel: T("训练回合", "Training sessions"), ylabel: T("风险调整后盈亏 / 时段", "Risk-adjusted P&L per session"), H: 230,
    });
    $("#rl-stats").innerHTML = `<table><tr><th>${T("策略（1,000 个测试时段）", "Policy (1,000 test sessions)")}</th><th>${T("平均盈亏", "Mean P&L")}</th><th>${T("标准差", "Std. dev.")}</th><th>${T("风险调整后", "Risk-adjusted")}</th><th>${T("收盘 |库存|", "Closing |q|")}</th></tr>`
      + [[T("对称报价（不看库存）", "Symmetric (ignores inventory)"), base.sym], [T("AS 公式", "AS formula"), base.as], [T("Q-learning 智能体", "Q-learning agent"), rl]].map(([n, r]) => `<tr${r === rl ? ' class="hl"' : ""}><td>${n}</td>${r ? `<td>${r.mean.toFixed(1)}</td><td>${r.sd.toFixed(1)}</td><td>${r.risk.toFixed(1)}</td><td>${r.absq.toFixed(2)}</td>` : `<td colspan="4">${busy ? T("训练中……", "training…") + " " + (curve.length ? curve[curve.length - 1][0].toLocaleString("en-US") : 0) + " / " + total.toLocaleString("en-US") : T("按“开始训练”（约 1 秒）", "press “Train the agent” (about a second)")}</td>`}</tr>`).join("") + `</table>`;
    if (learner) {
      let h = `<table><tr><th>${T("库存 q", "Inventory q")}</th>${[-4, -2, -1, 0, 1, 2, 4].map((q) => `<th>${q}</th>`).join("")}</tr>`;
      h += `<tr><td>${T("智能体：买价/卖价偏移", "Agent: bid / ask offset")}</td>${[-4, -2, -1, 0, 1, 2, 4].map((q) => { const p = learner.greedy(q); return `<td>${p.db.toFixed(1)} / ${p.da.toFixed(1)}</td>`; }).join("")}</tr>`;
      h += `<tr><td>${T("AS（时段中点）", "AS (mid-session)")}</td>${[-4, -2, -1, 0, 1, 2, 4].map((q) => { const p = asQuotes(q, 0.5); return `<td>${p.db.toFixed(1)} / ${p.da.toFixed(1)}</td>`; }).join("")}</tr></table>`;
      $("#rl-table").innerHTML = h;
      const p0 = learner.greedy(0);
      $("#rl-f").innerHTML = tex(String.raw`Q(q,a) \leftarrow Q(q,a) + \alpha\big[\,r + 0.99\max_{a'}Q(q',a') - Q(q,a)\,\big]`, true)
        + tex(String.raw`\text{${T("学到：q = 0 时半价差", "learned half-spread at q = 0")}} = ${p0.h.toFixed(1)}\qquad \text{${T("（AS 公式在时段中点：", "(AS formula, mid-session: ")}}${asQuotes(0, 0.5).half.toFixed(2)}\text{${T("）", ")")}}`, true);
    } else { $("#rl-table").innerHTML = ""; $("#rl-f").innerHTML = tex(String.raw`r_{\text{AS}} = s - q\,\gamma\sigma^2(T-t), \qquad \delta^a + \delta^b = \gamma\sigma^2(T-t) + \tfrac{2}{\gamma}\ln\!\big(1 + \tfrac{\gamma}{k}\big)`, true); }
  };
  // Training runs in small slices (250 sessions, ~10 ms each) with a pause between them, so the page never freezes.
  // Changing the world or the session count mid-run cancels the run (runId).
  let runId = 0;
  const trainAll = () => {
    if (busy) return;
    busy = true;
    const id = ++runId, w = world(), n = total, learner = makeLearner(3), slice = 250, every = n / 20;
    let done = 0;
    curve = [];
    const btn = $("[data-train]");
    btn.disabled = true;
    const step = () => {
      if (!root.isConnected || id !== runId) { busy = false; btn.disabled = false; return; }
      learner.train(w, slice, done, n);
      done += slice;
      if (done % every === 0) { curve.push([done, evaluate(learner.greedy, w, 200, 7).risk]); render(null); }
      if (done < n) setTimeout(step, 4); else { busy = false; btn.disabled = false; render(learner); }
    };
    step();
  };
  const cancel = () => { runId++; busy = false; $("[data-train]").disabled = false; };
  onSeg(root, "rl-w", (v) => { worldName = v; cancel(); showBase(); });
  onSeg(root, "rl-n", (v) => { total = +v; cancel(); showBase(); });
  $("[data-train]").addEventListener("click", trainAll);
  showBase();
}
