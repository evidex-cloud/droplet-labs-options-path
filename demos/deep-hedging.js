// Main demo for lesson deep-hedging: "train" a tiny hedging policy (a no-trade band around the BS delta)
// by minimising a risk measure (CVaR or standard deviation) of the hedged P&L on simulated paths with
// proportional trading costs, then test it on fresh paths — including worlds the policy never saw.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, stats, tex } from "./_viz.js";

const S0 = 100, K = 100, TT = 30 / 365, R_ = 0.04, SIG = 0.2;

// Simulate paths and cache the Black-Scholes delta (σ = 20%) at every hedge check — the "features" the policy sees.
export function makeWorld({ n = 1000, perDay = 4, seed = 11, sigReal = SIG, jumpInt = 0, jumpSize = -0.08 }) {
  const steps = 30 * perDay, dt = TT / steps, R = O.rng(seed), P = [];
  const drift = (R_ - (sigReal * sigReal) / 2) * dt, vol = sigReal * Math.sqrt(dt);
  for (let p = 0; p < n; p++) {
    const S = new Float64Array(steps + 1), D = new Float64Array(steps);
    S[0] = S0;
    let s = S0;
    for (let i = 0; i < steps; i++) {
      s *= Math.exp(drift + vol * R.normal());
      if (jumpInt > 0 && R() < jumpInt * dt) s *= 1 + jumpSize;
      S[i + 1] = s;
    }
    for (let i = 0; i < steps; i++) {
      const tau = TT - i * dt, v = SIG * Math.sqrt(tau);
      D[i] = O.normCdf((Math.log(S[i] / K) + (R_ + (SIG * SIG) / 2) * tau) / v);
    }
    P.push({ S, D });
  }
  return { P, steps, dt };
}

// Hedge a short call with a no-trade band of half-width b around delta; cost k × |shares traded| × S.
// Returns per-share P&L at expiry for every path (premium 2.45 received at t = 0, cash earns r).
export function runBand(world, k, b) {
  const { P, steps, dt } = world, prem = O.bsPrice({ S: S0, K, T: TT, r: R_, sigma: SIG, type: "call" });
  const g = Math.exp(R_ * dt), pl = new Float64Array(P.length);
  let trades = 0, costSum = 0;
  for (let p = 0; p < P.length; p++) {
    const { S, D } = P[p];
    let cash = prem, h = 0, cost = 0;
    for (let i = 0; i < steps; i++) {
      const lo = D[i] - b, hi = D[i] + b;
      const nh = h < lo ? lo : h > hi ? hi : h;
      if (nh !== h) { const q = nh - h, c = k * S[i] * Math.abs(q); cash -= q * S[i] + c; cost += c; h = nh; trades++; }
      cash *= g;
    }
    const ST = S[steps];
    pl[p] = cash + h * ST - Math.max(ST - K, 0);
    costSum += cost;
  }
  return { pl, trades: trades / P.length, cost: costSum / P.length };
}

// Risk measures on the loss L = −P&L
export function risk(pl, measure) {
  const n = pl.length, L = Array.from(pl, (x) => -x).sort((a, b) => a - b);
  const mean = -L.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(L.reduce((a, b) => a + (-b - mean) ** 2, 0) / (n - 1));
  const cvarAt = (al) => { const i = Math.floor(al * n), t = L.slice(i); return t.reduce((a, b) => a + b, 0) / t.length; };
  const out = { mean, sd, var95: L[Math.floor(0.95 * n)], cvar95: cvarAt(0.95), cvar99: cvarAt(0.99) };
  out.obj = measure === "sd" ? sd : measure === "cvar99" ? out.cvar99 : out.cvar95;
  return out;
}

export function train({ k, perDay, measure, n = 1000, w = null }) {
  w = w || makeWorld({ n, perDay, seed: 11 });
  const grid = [];
  let best = null;
  for (let b = 0; b <= 0.2 + 1e-9; b += 0.005) {
    const r = risk(runBand(w, k, b).pl, measure);
    grid.push([b, r.obj]);
    if (!best || r.obj < best.obj - 1e-12) best = { b, obj: r.obj };
  }
  return { grid, best };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let perDay = 4, measure = "cvar95", world = "same";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("训练一个会“偷懒”的对冲策略：无交易带 vs 机械 Delta", "Train a hedging policy that knows when not to trade: no-trade band vs mechanical delta")}</div>
    <p class="demo-meta">${T("场景：做市商卖出 1 张 XYZ 30 天、行权价 100 的看涨（每股 2.45 美元，σ = 20%，r = 4%），用股票对冲到期。策略只有一个参数：Delta 周围的“无交易带”半宽 b。b = 0 就是教科书式的 Delta 对冲。", "Setup: a dealer sells one XYZ 30-day 100 call ($2.45 per share, σ = 20%, r = 4%) and hedges with stock until expiry. The policy has one parameter: the half-width b of a no-trade band around delta. b = 0 is textbook delta hedging.")}</p>
    <div class="demo-grid">
      ${slider("dh-k", T("交易成本 k（占成交额）", "Trading cost k (of traded value)"), 0, 0.5, 0.05, 0.1)}
      <div class="demo-field"><div class="demo-label">${T("每天检查对冲几次", "Hedge checks per day")}</div>${seg("dh-freq", [["1", "1"], ["4", "4"], ["12", "12"]], "4")}</div>
    </div>
    <div class="demo-row"><div class="demo-field"><div class="demo-label">${T("训练目标（风险度量）", "Training objective (risk measure)")}</div>${seg("dh-m", [["cvar95", "CVaR 95%"], ["cvar99", "CVaR 99%"], ["sd", T("标准差", "Std. dev.")]], "cvar95")}</div>
    <div class="demo-field"><div class="demo-label">${T("测试世界", "Test world")}</div>${seg("dh-w", [["same", T("与训练相同", "Same as training")], ["vol", T("真实波动 30%", "Realized vol 30%")], ["jump", T("会跳空下跌", "Downward jumps")]], "same")}</div></div>
    <div class="demo-math" id="dh-f"></div>
    <div id="dh-train"></div>
    <div id="dh-stats"></div>
    <div id="dh-hist"></div>
    <div id="dh-tab"></div>
    <p class="demo-tip">${T("试试：把成本调到 0，最优带宽缩到接近 0（学回了 Delta 对冲）；成本越高，带越宽。再把测试世界换成“真实波动 30%”或“跳空”：两种策略都亏更多——策略只在它训练过的世界里最优。", "Try this: set the cost to 0 and the best band shrinks toward 0 (it rediscovers delta hedging); raise the cost and the band widens. Then switch the test world to “Realized vol 30%” or “Downward jumps”: both policies lose more — a policy is only optimal in the world it was trained on.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const usd = (x) => (x < 0 ? "−$" : "$") + Math.abs(x).toFixed(0);
  const mName = () => (measure === "sd" ? T("标准差", "std. dev.") : measure === "cvar99" ? "CVaR 99%" : "CVaR 95%");
  let cacheKey = "", testW = null, trainKey = 0, trainW = null;
  const draw = () => {
    const k = +$("#dh-k").value / 100;
    $("#dh-k-v").textContent = (+$("#dh-k").value).toFixed(2) + "%";
    if (trainKey !== perDay) { trainW = makeWorld({ n: 1000, perDay, seed: 11 }); trainKey = perDay; }
    const tr = train({ k, perDay, measure, w: trainW });
    const key = perDay + world;
    if (key !== cacheKey) {
      testW = makeWorld({ n: 1000, perDay, seed: 99, sigReal: world === "vol" ? 0.3 : SIG, jumpInt: world === "jump" ? 4 : 0 });
      cacheKey = key;
    }
    const d0 = runBand(testW, k, 0), db = runBand(testW, k, tr.best.b);
    const r0 = risk(d0.pl, measure), rb = risk(db.pl, measure);
    const rhoTex = measure === "sd" ? String.raw`\text{std}` : measure === "cvar99" ? String.raw`\text{CVaR}_{99\%}` : String.raw`\text{CVaR}_{95\%}`;
    $("#dh-f").innerHTML = tex(String.raw`b^{*} = \arg\min_{b}\ \rho\big(-\text{P\&L}_{b}\big) = ${tr.best.b.toFixed(3)}`, true)
      + tex(String.raw`\rho = ${rhoTex},\qquad k = ${(k * 100).toFixed(2)}\%,\qquad ${perDay}\ \text{${T("次/天", "checks/day")}}`, true);
    // show the band range around the optimum (at least 0–0.1) so the minimum is visible and nothing is clipped
    const bmax = Math.min(0.2, Math.max(0.1, Math.ceil((2.2 * tr.best.b + 0.02) * 20) / 20));
    const shown = tr.grid.filter(([b]) => b <= bmax + 1e-9), ys = shown.map((p) => p[1] * 100);
    const ylo = Math.min(...ys), yhi = Math.max(...ys), pad = Math.max(2, (yhi - ylo) * 0.08);
    $("#dh-train").innerHTML = lineChart({
      series: [{ points: shown.map(([b, v]) => [b, v * 100]), cls: 0, label: T("训练集上的风险（每张合约）", "Risk on training paths (per contract)"), dots: false }],
      xmin: 0, xmax: bmax, ymin: Math.max(0, ylo - pad), ymax: yhi + pad,
      xlabel: T("无交易带半宽 b（Delta 单位）", "No-trade band half-width b (delta units)"), ylabel: mName() + " ($)",
      points: [{ x: 0, y: tr.grid[0][1] * 100, cls: 2, label: T("Delta 对冲", "delta hedge") }, { x: tr.best.b, y: tr.best.obj * 100, cls: 3, label: "b* = " + tr.best.b.toFixed(3) }],
      H: 230, yfmt: (v) => "$" + v.toFixed(0),
    });
    $("#dh-stats").innerHTML = stats([
      [T("学到的带宽 b*", "Learned band b*"), tr.best.b.toFixed(3), "acc"],
      [T("测试：Delta 对冲的 ", "Test: delta hedge ") + mName(), usd(r0.obj * 100), "neg"],
      [T("测试：无交易带的 ", "Test: band policy ") + mName(), usd(rb.obj * 100), rb.obj < r0.obj ? "pos" : "neg"],
      [T("交易次数：Delta / 带", "Trades: delta / band"), d0.trades.toFixed(0) + " / " + db.trades.toFixed(0)],
    ]);
    // histogram of per-contract P&L on the test paths
    // histogram range from the data: 0.5th percentile of the worse policy to the best outcome, in $10 bins
    const all = [...d0.pl, ...db.pl].map((x) => x * 100).sort((a, b) => a - b);
    const lo = Math.floor(all[Math.floor(all.length * 0.005)] / 50) * 50, hi = Math.ceil(all[all.length - 1] / 50) * 50;
    const nb = Math.max(20, Math.min(60, Math.round((hi - lo) / 10))), w = (hi - lo) / nb;
    const hist = (pl) => { const c = new Array(nb).fill(0); for (const x of pl) { const v = x * 100; const i = Math.min(nb - 1, Math.max(0, Math.floor((v - lo) / w))); c[i]++; } return c.map((y, i) => [lo + (i + 0.5) * w, y / pl.length * 100]); };
    $("#dh-hist").innerHTML = lineChart({
      series: [{ points: hist(d0.pl), cls: 2, label: T("Delta 对冲（b = 0）", "Delta hedge (b = 0)") }, { points: hist(db.pl), cls: 3, label: T("学到的无交易带", "Learned no-trade band") }],
      xmin: lo, xmax: hi, ymin: 0, xlabel: T("到期对冲后盈亏，每张合约（美元，测试路径）", "Hedged P&L at expiry per contract ($, test paths)"), ylabel: T("路径占比 %", "% of paths"),
      markers: [{ x: -rb.var95 * 100, label: "VaR 95% " + T("（带）", "(band)") }], H: 240, xfmt: (v) => (v < 0 ? "−$" : "$") + Math.abs(Math.round(v)),
    });
    const row = (name, d, r) => `<tr><td>${name}</td><td>${usd(r.mean * 100)}</td><td>${usd(d.cost * 100)}</td><td>$${(r.sd * 100).toFixed(0)}</td><td>${usd(r.cvar95 * 100)}</td><td>${d.trades.toFixed(0)}</td></tr>`;
    $("#dh-tab").innerHTML = `<table><tr><th>${T("策略（测试路径，每张合约）", "Policy (test paths, per contract)")}</th><th>${T("平均盈亏", "Mean P&L")}</th><th>${T("平均成本", "Mean cost")}</th><th>${T("标准差", "Std. dev.")}</th><th>CVaR 95%</th><th>${T("交易次数", "Trades")}</th></tr>${row(T("Delta 对冲", "Delta hedge"), d0, r0)}${row(T("无交易带 b*", "No-trade band b*"), db, rb)}</table>`;
  };
  $("#dh-k").addEventListener("input", draw);
  onSeg(root, "dh-freq", (v) => { perDay = +v; draw(); });
  onSeg(root, "dh-m", (v) => { measure = v; draw(); });
  onSeg(root, "dh-w", (v) => { world = v; draw(); });
  draw();
}
