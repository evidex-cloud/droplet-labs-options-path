// Inline demo for lesson delta-hedging: the distribution of a delta-hedged long call's P&L over many simulated paths
// (engine hedgeSim), for a chosen realized vol and hedging frequency.
import * as O from "./_opt.js";
import { barChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

const K = 100, S0 = 100, T0 = 30 / 365, r = 0.04, IV = 0.2, PATHS = 300;

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let steps = 30;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("300 条路径：多 Gamma 对冲的损益分布", "300 paths: the P&L distribution of a long-gamma hedge")}</div>
    <div class="demo-row">${seg("dhp-steps", [["4", T("每周", "Weekly")], ["30", T("每天", "Daily")], ["120", T("每天 4 次", "4× a day")]], String(steps))}</div>
    ${slider("dhp-rv", T("实际波动率（隐含固定为 20%）", "Realized vol (implied fixed at 20%)"), 10, 35, 1, 25)}
    <div class="demo-math" id="dhp-f"></div>
    <div id="dhp-s"></div>
    <div id="dhp-h"></div>
    <p class="demo-tip">${T("看什么：默认实际 25%、隐含 20%，你“看对了”，分布中心在 +57 美元附近，但仍有一小部分路径亏钱。把实际波动率拉回 20%，分布以 0 为中心，宽度全部来自离散对冲；对冲频率提高 4 倍，宽度约减半。实际波动率每比隐含高 1 个点，中心右移约 11 美元（Vega × 100）。", "What to notice: by default realized is 25% against 20% implied — you are right, and the centre sits near +$57, yet a few paths still lose. Drag realized back to 20% and the distribution centres on zero, its width coming purely from discrete hedging; hedge 4× as often and the width roughly halves. Each vol point of realized above implied moves the centre right by about $11 (vega × 100).")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const rv = v["dhp-rv"] / 100;
    const xs = [];
    for (let i = 0; i < PATHS; i++) xs.push(-O.hedgeSim({ S0, K, T: T0, r, sigmaImp: IV, sigmaReal: rv, steps, seed: 1000 + i }).pnl * 100);
    const mean = xs.reduce((a, x) => a + x, 0) / PATHS;
    const sd = Math.sqrt(xs.reduce((a, x) => a + (x - mean) ** 2, 0) / (PATHS - 1));
    const lose = xs.filter((x) => x < 0).length / PATHS;
    const theo = (O.bsCall(S0, K, T0, r, rv) - O.bsCall(S0, K, T0, r, IV)) * 100;
    const vega = O.greeks({ S: S0, K, T: T0, r, sigma: IV, type: "call" }).vega;
    const dk = Math.sqrt(Math.PI / 4) * vega * 100 * (IV * 100) / Math.sqrt(steps);
    $("#dhp-f").innerHTML = tex(String.raw`\E[\Pi] \approx \big[C(\RV) - C(\IV)\big] \times 100 = ${theo >= 0 ? "" : "-"}\$${Math.abs(theo).toFixed(0)}`, true) +
      tex(String.raw`\text{sd}_{\RV = \IV} \approx \sqrt{\tfrac{\pi}{4}}\,\frac{\nu\,\sigma}{\sqrt{N}} = \$${dk.toFixed(0)}`, true);
    $("#dhp-s").innerHTML = stats([
      [T("平均损益 / 张", "Mean P&L / contract"), (mean >= 0 ? "+$" : "−$") + Math.abs(mean).toFixed(0), mean >= 0 ? "pos" : "neg"],
      [T("标准差", "Standard deviation"), "$" + sd.toFixed(0)],
      [T("亏钱的路径", "Paths that lose"), (lose * 100).toFixed(0) + "%", lose > 0.3 ? "neg" : ""],
      [T("对冲次数 N", "Rebalances N"), String(steps)],
    ]);
    // 20-dollar bins centred on −200, −180, …, 260; label every 80 dollars (bin centres)
    const lo = -210, hi = 270, w = 20, nb = (hi - lo) / w, counts = new Array(nb).fill(0);
    for (const x of xs) counts[Math.min(nb - 1, Math.max(0, Math.floor((x - lo) / w)))]++;
    $("#dhp-h").innerHTML = barChart({
      H: 210, xlabel: T("每张合约的对冲损益（美元，两端已并入边缘格）", "Hedged P&L per contract ($; tails folded into the end bins)"),
      bars: counts.map((c, i) => {
        const mid = lo + i * w + w / 2;
        return { label: mid % 80 === 0 ? String(mid) : "", value: c, cls: mid < 0 ? 2 : 3 };
      }),
    });
  };
  const run = bindSliders(root, { "dhp-rv": (x) => x + "%" }, draw);
  onSeg(root, "dhp-steps", (x) => { steps = +x; run(); });
}
