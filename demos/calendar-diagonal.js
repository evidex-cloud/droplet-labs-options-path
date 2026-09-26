// Main demo for lesson calendar-diagonal: P&L of a call calendar / diagonal on the day the front option expires,
// with separate implied vols for each leg at entry and for the surviving back leg at the front expiry.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("日历 / 对角价差：近月到期那天的损益", "Calendar / diagonal: P&L on the front expiry")}</div>
    <div class="demo-btns">
      <button class="demo-btn on" data-preset="cal">${T("日历 100/100（20%/20%）", "Calendar 100/100 (20%/20%)")}</button>
      <button class="demo-btn" data-preset="diag">${T("对角：卖 105、买 100", "Diagonal: sell 105, buy 100")}</button>
      <button class="demo-btn" data-preset="event">${T("事件日历（30%/25%）", "Event calendar (30%/25%)")}</button>
    </div>
    <div class="demo-grid">
      ${slider("cd-ks", T("卖出（近月）行权价", "Short (front) strike"), 90, 115, 1, 100)}
      ${slider("cd-kl", T("买入（远月）行权价", "Long (back) strike"), 85, 110, 1, 100)}
      ${slider("cd-t1", T("近月天数", "Front days"), 7, 45, 1, 30)}
      ${slider("cd-t2", T("远月天数", "Back days"), 30, 120, 1, 60)}
      ${slider("cd-v1", T("近月 IV（建仓）", "Front IV (entry)"), 10, 60, 1, 20)}
      ${slider("cd-v2", T("远月 IV（建仓）", "Back IV (entry)"), 10, 60, 1, 20)}
      ${slider("cd-v3", T("远月 IV（近月到期那天）", "Back IV (on the front expiry)"), 10, 60, 1, 20)}
    </div>
    <div class="demo-math" id="cd-f"></div>
    <div id="cd-stats"></div>
    <div id="cd-chart"></div>
    <p class="demo-tip">${T("试试：只动最后一个滑块（远月在近月到期那天的 IV），整座驼峰上下平移——这就是日历价差的 Vega 赌注。按“事件日历”，看倒挂曲线隐含的远期波动率有多低；再按“对角”，驼峰的峰移到了卖出的行权价附近。", "Try this: move only the last slider (the back month's IV on the front expiry) and the whole hump shifts up or down — that is the calendar's vega bet. Press “Event calendar” to see how low the forward vol of an inverted curve is; press “Diagonal” and the peak moves to the short strike.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const sg = (x, d = 3) => (x >= 0 ? "+" : "−") + Math.abs(x).toFixed(d);
  const r = 0.04, S0 = 100;
  const draw = (v) => {
    const Ks = v["cd-ks"], Kl = v["cd-kl"], d1 = v["cd-t1"], d2 = Math.max(v["cd-t2"], d1 + 7), s1 = v["cd-v1"] / 100, s2 = v["cd-v2"] / 100, s3 = v["cd-v3"] / 100;
    if (v["cd-t2"] < d1 + 7) { $("#cd-t2").value = String(d2); $("#cd-t2-v").textContent = d2 + T(" 天", " days"); }
    const T1 = d1 / 365, T2 = d2 / 365;
    const gF = O.greeks({ S: S0, K: Ks, T: T1, r, sigma: s1, type: "call" }), gB = O.greeks({ S: S0, K: Kl, T: T2, r, sigma: s2, type: "call" });
    const D = gB.price - gF.price;
    const pl = (S, sb) => O.bsPrice({ S, K: Kl, T: T2 - T1, r, sigma: sb, type: "call" }) - Math.max(S - Ks, 0) - D;
    const fv2 = (s2 * s2 * T2 - s1 * s1 * T1) / (T2 - T1);
    const fwd = fv2 > 0 ? Math.sqrt(fv2) : NaN;
    // peak and breakevens on a grid
    let best = -Infinity, bestS = S0, prev = null; const bes = [];
    for (let S = 60; S <= 140; S += 0.05) { const y = pl(S, s3); if (y > best) { best = y; bestS = S; } if (prev !== null && Math.sign(y) !== Math.sign(prev)) bes.push(S - 0.05 * y / (y - prev)); prev = y; }
    $("#cd-f").innerHTML = tex(String.raw`\begin{gathered}\Pi(S_{T_1}) = C\big(S_{T_1}, ${Kl}, ${d2 - d1}\text{d}, ${(s3 * 100).toFixed(0)}\%\big) \\ - (S_{T_1} - ${Ks})^+ - ${D.toFixed(2)} \\ \sigma_{\text{fwd}} = \sqrt{\frac{\sigma_2^2 T_2 - \sigma_1^2 T_1}{T_2 - T_1}} = ${isFinite(fwd) ? (fwd * 100).toFixed(1) + "\\%" : "\\text{" + T("负方差：套利！", "negative variance: arbitrage!") + "}"}\end{gathered}`, true);
    $("#cd-stats").innerHTML = stats([
      [D >= 0 ? T("净支出", "Net debit") : T("净收入", "Net credit"), "$" + Math.abs(D * 100).toFixed(0), "acc"],
      [T("近月到期时的峰值", "Peak on the front expiry"), (best >= 0 ? "+$" : "−$") + Math.abs(best * 100).toFixed(0) + T(`（S ≈ ${bestS.toFixed(0)}）`, ` (S ≈ ${bestS.toFixed(0)})`), best >= 0 ? "pos" : "neg"],
      [T("盈亏平衡点", "Breakevens"), bes.length ? bes.map((b) => b.toFixed(2)).join(" / ") : "–"],
      [T("远期波动率", "Forward vol"), isFinite(fwd) ? (fwd * 100).toFixed(1) + "%" : T("负方差", "negative"), isFinite(fwd) ? "" : "neg"],
      [T("建仓 Δ / Γ", "Entry Δ / Γ"), `${sg(gB.delta - gF.delta)} / ${sg(gB.gamma - gF.gamma)}`],
      [T("每天 Θ", "Θ per day"), sg(gB.theta - gF.theta)],
      [T("净 Vega（远 − 近）", "Net vega (back − front)"), sg(gB.vega - gF.vega)],
    ]);
    $("#cd-chart").innerHTML = lineChart({
      series: [
        { f: (S) => pl(S, s3 + 0.03) * 100, cls: 3, dashed: true, label: T(`远月 IV ${((s3 + 0.03) * 100).toFixed(0)}%`, `back IV ${((s3 + 0.03) * 100).toFixed(0)}%`) },
        { f: (S) => pl(S, s3) * 100, cls: 0, label: T(`远月 IV ${(s3 * 100).toFixed(0)}%（情景）`, `back IV ${(s3 * 100).toFixed(0)}% (scenario)`) },
        { f: (S) => pl(S, Math.max(0.03, s3 - 0.03)) * 100, cls: 2, dashed: true, label: T(`远月 IV ${(Math.max(0.03, s3 - 0.03) * 100).toFixed(0)}%`, `back IV ${(Math.max(0.03, s3 - 0.03) * 100).toFixed(0)}%`) },
      ],
      xmin: 80, xmax: 120, markers: [{ x: Ks, label: T("卖出 K", "short K") }, ...(Kl !== Ks ? [{ x: Kl, label: T("买入 K", "long K") }] : [])],
      hlines: [{ y: 0 }], xlabel: T("近月到期那天 XYZ 的价格", "XYZ price on the front expiry"), ylabel: T("每组损益（美元）", "P&L per set ($)"),
    });
  };
  const spec = { "cd-ks": (x) => "$" + x, "cd-kl": (x) => "$" + x, "cd-t1": (x) => x + T(" 天", " days"), "cd-t2": (x) => x + T(" 天", " days"), "cd-v1": (x) => x + "%", "cd-v2": (x) => x + "%", "cd-v3": (x) => x + "%" };
  const run = bindSliders(root, spec, draw);
  const presets = {
    cal: { "cd-ks": 100, "cd-kl": 100, "cd-t1": 30, "cd-t2": 60, "cd-v1": 20, "cd-v2": 20, "cd-v3": 20 },
    diag: { "cd-ks": 105, "cd-kl": 100, "cd-t1": 30, "cd-t2": 60, "cd-v1": 20, "cd-v2": 20, "cd-v3": 20 },
    event: { "cd-ks": 100, "cd-kl": 100, "cd-t1": 30, "cd-t2": 60, "cd-v1": 30, "cd-v2": 25, "cd-v3": 19 },
  };
  root.querySelectorAll("[data-preset]").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll("[data-preset]").forEach((x) => x.classList.toggle("on", x === b));
    for (const [id, x] of Object.entries(presets[b.dataset.preset])) $("#" + id).value = String(x);
    run();
  }));
}
