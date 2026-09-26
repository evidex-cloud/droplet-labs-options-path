// Main demo for lesson straddle-strangle: Monte Carlo of a straddle/strangle bought (or sold) at implied vol
// while the stock actually moves at realized vol — held to expiry or delta-hedged daily.
import * as O from "./_opt.js";
import { barChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let struct = "long-straddle", mode = "hold", seed = 7;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("隐含对实现：模拟几千笔跨式交易", "Implied vs realized: simulate thousands of straddle trades")}</div>
    <div class="demo-row">${seg("ssm-struct", [["long-straddle", T("买跨式 100", "Long straddle 100")], ["long-strangle", T("买宽跨 95/105", "Long strangle 95/105")], ["short-straddle", T("卖跨式", "Short straddle")], ["short-strangle", T("卖宽跨", "Short strangle")]], struct)}</div>
    <div class="demo-row">${seg("ssm-mode", [["hold", T("持有到期", "Hold to expiry")], ["hedge", T("每天 Delta 对冲", "Delta-hedge daily")]], mode)}
      <div class="demo-btns" style="margin:0"><button class="demo-btn" data-act="reseed">${T("换一批随机路径", "New random paths")}</button></div></div>
    <div class="demo-grid">
      ${slider("ssm-iv", T("隐含波动率（你付的价）", "Implied vol (the price you pay)"), 10, 50, 1, 20)}
      ${slider("ssm-rv", T("实现波动率（实际发生的）", "Realized vol (what actually happens)"), 5, 60, 1, 20)}
      ${slider("ssm-d", T("到期天数", "Days to expiry"), 7, 60, 1, 30)}
    </div>
    <div class="demo-math" id="ssm-f"></div>
    <div id="ssm-stats"></div>
    <div id="ssm-chart"></div>
    <p class="demo-meta" id="ssm-meta"></p>
    <p class="demo-tip">${T("试试：把实现波动率拉到和隐含一样（20%），平均损益接近 0；再拉到 30%，看“持有”与“对冲”两种模式的平均差不多、分布宽窄却完全不同。换成卖方，把实现波动率降到 15%，胜率很高，但留意最差的 5%。", "Try this: set realized equal to implied (20%) and the average P&L sits near zero; push realized to 30% and compare the two modes — similar averages, very different spreads. Switch to a seller, drop realized to 15%: a high win rate, but watch the worst 5%.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const r = 0.04, S0 = 100;
  const legsFor = (s) => {
    const sign = s.startsWith("short") ? -1 : 1;
    return s.endsWith("straddle") ? [["call", 100, sign], ["put", 100, sign]] : [["call", 105, sign], ["put", 95, sign]];
  };
  const draw = (v) => {
    const sI = v["ssm-iv"] / 100, sR = v["ssm-rv"] / 100, days = v["ssm-d"], Tm = days / 365;
    const legs = legsFor(struct), short = legs[0][2] < 0;
    const val = (S, tl) => legs.reduce((a, [ty, K, q]) => a + q * O.bsPrice({ S, K, T: tl, r, sigma: sI, type: ty }), 0);
    const del = (S, tl) => legs.reduce((a, [ty, K, q]) => a + q * O.greeks({ S, K, T: tl, r, sigma: sI, type: ty }).delta, 0);
    const vega = legs.reduce((a, [ty, K, q]) => a + q * O.greeks({ S: S0, K, T: Tm, r, sigma: sI, type: ty }).vega, 0);
    const prem = val(S0, Tm);
    const R = O.rng(seed), steps = days, dt = Tm / steps;
    const n = mode === "hold" ? 4000 : 1200;
    const out = [];
    for (let i = 0; i < n; i++) {
      let pnl;
      if (mode === "hold") {
        const ST = S0 * Math.exp((r - sR * sR / 2) * Tm + sR * Math.sqrt(Tm) * R.normal());
        pnl = legs.reduce((a, [ty, K, q]) => a + q * O.intrinsic(ty, ST, K), 0) - prem * Math.exp(r * Tm);
      } else {
        const path = O.gbmPath(R, S0, r, sR, Tm, steps);
        let cash = -prem, sh = -del(S0, Tm);
        cash -= sh * S0;
        for (let k = 1; k <= steps; k++) {
          cash *= Math.exp(r * dt);
          if (k < steps) { const nd = -del(path[k], Tm - k * dt); cash -= (nd - sh) * path[k]; sh = nd; }
        }
        const ST = path[steps];
        pnl = cash + sh * ST + legs.reduce((a, [ty, K, q]) => a + q * O.intrinsic(ty, ST, K), 0);
      }
      out.push(pnl * 100);
    }
    out.sort((a, b) => a - b);
    const mean = out.reduce((a, b) => a + b, 0) / n;
    const sd = Math.sqrt(out.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
    const win = out.filter((x) => x > 0).length / n;
    const p5 = out[Math.floor(n * 0.05)], p95 = out[Math.floor(n * 0.95)];
    const approx = Math.round(vega * (sR - sI) * 100 * 100) || 0; // per set of contracts
    $("#ssm-f").innerHTML = tex(String.raw`\begin{gathered}\E[\Pi] \approx \nu \times (\sigma_{\text{real}} - \sigma_{\text{imp}}) \\ = ${vega.toFixed(3)} \times (${(sR * 100).toFixed(0)} - ${(sI * 100).toFixed(0)}) \times 100 \approx ${approx < 0 ? "-" : ""}\$${Math.abs(approx).toFixed(0)}\ \text{${T("每组", "per set")}}\end{gathered}`, true);
    const money = (x) => (x < 0 ? "−$" : "$") + Math.abs(x).toFixed(0);
    $("#ssm-stats").innerHTML = stats([
      [short ? T("收到的权利金", "Premium received") : T("付出的权利金", "Premium paid"), "$" + (prem * 100 * (short ? -1 : 1)).toFixed(0), "acc"],
      [T("平均损益（模拟）", "Average P&L (simulated)"), money(mean), mean >= 0 ? "pos" : "neg"],
      [T("赚钱的比例", "Share of winners"), (win * 100).toFixed(0) + "%"],
      [T("标准差", "Std. deviation"), "$" + sd.toFixed(0)],
      [T("最差 5% 的门槛", "Worst-5% cutoff"), money(p5), "neg"],
      [T("最好 5% 的门槛", "Best-5% cutoff"), money(p95), "pos"],
    ]);
    const lo = out[Math.floor(n * 0.005)], hi = out[Math.ceil(n * 0.995) - 1];
    const nb = 22, w = Math.max((hi - lo) / nb, 1e-6), bins = new Array(nb).fill(0);
    for (const x of out) { const b = Math.min(nb - 1, Math.max(0, Math.floor((x - lo) / w))); bins[b]++; }
    $("#ssm-chart").innerHTML = barChart({
      bars: bins.map((c, i) => { const mid = lo + (i + 0.5) * w; return { label: (mid < 0 ? "−" : "") + Math.abs(mid).toFixed(0), value: (c / n) * 100, cls: mid >= 0 ? 3 : 2 }; }),
      yfmt: (y) => y.toFixed(0) + "%", xlabel: T("每组合约的损益（美元，×100）", "P&L per set of contracts ($, ×100)"),
    });
    $("#ssm-meta").textContent = T(
      `${n.toLocaleString("en-US")} 条模拟路径，真实漂移 4%，${mode === "hold" ? "只看到期价格" : "每天按隐含波动率的 Delta 调整股票仓位"}。公式是一阶近似；两者的差来自抽样与高阶项。`,
      `${n.toLocaleString("en-US")} simulated paths, real-world drift 4%, ${mode === "hold" ? "only the expiry price counts" : "shares re-balanced daily to the implied-vol delta"}. The formula is a first-order approximation; the gap to the simulation is sampling noise and higher-order terms.`);
  };
  const run = bindSliders(root, { "ssm-iv": (x) => x + "%", "ssm-rv": (x) => x + "%", "ssm-d": (x) => x + T(" 天", " days") }, draw);
  onSeg(root, "ssm-struct", (v) => { struct = v; run(); });
  onSeg(root, "ssm-mode", (v) => { mode = v; run(); });
  $('[data-act="reseed"]').addEventListener("click", () => { seed += 101; run(); });
}
