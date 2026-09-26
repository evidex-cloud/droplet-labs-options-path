// Inline demo for lesson stochastic-vol: the SABR smile (Hagan et al. 2002 formula from the engine) and its "backbone":
// what happens to the whole smile when the forward moves while alpha, beta, rho, nu stay fixed.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let beta = 0.5, shift = -5;
  const Tm = 1, F0 = 100;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("SABR 微笑与“骨架”：远期价变了，微笑怎么动？", "SABR smile and its backbone: when the forward moves, how does the smile move?")}</div>
    <div class="demo-row"><span class="demo-label">β</span>${seg("sb-b", [["0", "0 " + T("（正态）", "(normal)")], ["0.5", "0.5"], ["1", "1 " + T("（对数正态）", "(lognormal)")]], "0.5")}
      <span class="demo-label">${T("远期价移动", "Forward moves")}</span>${seg("sb-m", [["-5", "100 → 95"], ["5", "100 → 105"]], "-5")}</div>
    <div class="demo-grid">
      ${slider("sb-a", T("平值波动率水平（设定 α）", "ATM vol level (sets α)"), 10, 40, 1, 20)}
      ${slider("sb-r", T("相关系数 ρ", "Correlation ρ"), -0.9, 0.9, 0.05, -0.3)}
      ${slider("sb-n", T("波动率的波动率 ν", "Vol of vol ν"), 0.05, 1.2, 0.05, 0.4)}
    </div>
    <div class="demo-math" id="sb-f"></div>
    <div id="sb-stats"></div>
    <div id="sb-chart"></div>
    <p class="demo-tip">${T("看什么：β = 0.5 时远期跌到 95，平值波动率沿着“骨架”上升；β = 1 时几乎不动。ρ 决定倾斜，ν 决定两翼翘多高。", "What to notice: with β = 0.5 a drop of the forward to 95 lifts at-the-money vol along the backbone; with β = 1 it barely moves. ρ sets the tilt, ν how high the wings curl.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  let v = {};
  const draw = () => {
    const alpha = (v["sb-a"] / 100) * F0 ** (1 - beta), rho = v["sb-r"], nu = v["sb-n"], F1 = F0 + shift;
    const vol = (F, K) => 100 * O.sabrVol({ F, K, T: Tm, alpha, beta, rho, nu });
    const Fb = F0 ** (1 - beta);
    const c = ((1 - beta) ** 2 / 24) * alpha * alpha / (Fb * Fb) + (rho * beta * nu * alpha) / (4 * Fb) + ((2 - 3 * rho * rho) / 24) * nu * nu;
    $("#sb-f").innerHTML = tex(String.raw`\sigma_{\text{ATM}} \approx \frac{\alpha}{F^{1-\beta}}\big[1 + c\,T\big]`, true) + tex(String.raw`= \frac{${alpha.toFixed(3)}}{${F0}^{${(1 - beta).toFixed(1)}}}\big[1 + ${c.toFixed(5)} \times 1\big] = ${(alpha / Fb * (1 + c * Tm) * 100).toFixed(2)}\%`, true);
    const a0 = vol(F0, F0), a1 = vol(F1, F1);
    $("#sb-stats").innerHTML = stats([
      ["α", alpha.toFixed(3)],
      [T("平值 IV（F = 100）", "ATM IV (F = 100)"), a0.toFixed(2) + "%", "acc"],
      [T("平值 IV（F = ", "ATM IV (F = ") + F1 + ")", a1.toFixed(2) + "%", a1 > a0 + 0.05 ? "neg" : a1 < a0 - 0.05 ? "pos" : ""],
      ["IV(80) − IV(120)", (vol(F0, 80) - vol(F0, 120)).toFixed(2) + T(" 点", " pts")],
    ]);
    $("#sb-chart").innerHTML = lineChart({
      xmin: 70, xmax: 130, xlabel: T("行权价 K（1 年）", "Strike K (1 year)"), ylabel: T("隐含波动率（%）", "Implied vol (%)"),
      series: [
        { f: (K) => vol(F0, K), cls: 0, label: T("F = 100 时的微笑", "Smile at F = 100") },
        { f: (K) => vol(F1, K), cls: 1, dashed: true, label: T("F = ", "Smile at F = ") + F1 + T(" 时的微笑", "") },
      ],
      points: [{ x: F0, y: a0, cls: 0, label: "ATM" }, { x: F1, y: a1, cls: 1, label: "ATM" }],
      markers: [{ x: F0, label: "100" }, { x: F1, label: String(F1) }],
    });
  };
  const run = bindSliders(root, { "sb-a": (x) => x + "%", "sb-r": (x) => x.toFixed(2), "sb-n": (x) => x.toFixed(2) }, (vals) => { v = vals; draw(); });
  onSeg(root, "sb-b", (x) => { beta = +x; run(); });
  onSeg(root, "sb-m", (x) => { shift = +x; run(); });
}
