// Main demo for lesson smile-skew: shape a 30-day SVI smile for XYZ and see what it does to option prices,
// the 25-delta risk reversal and butterfly, the implied crash probability, and the no-butterfly-arbitrage check.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

const S = 100, r = 0.04, Tm = 30 / 365, F = O.forward(S, Tm, r);
const PRESETS = {
  equity: { atm: 20, b: 0.012, rho: -0.8, m: 0.01, s: 0.05 },
  fx: { atm: 20, b: 0.012, rho: 0, m: 0, s: 0.05 },
  commodity: { atm: 20, b: 0.012, rho: 0.7, m: -0.01, s: 0.05 },
  flat: { atm: 20, b: 0, rho: 0, m: 0, s: 0.05 },
};

// raw SVI with a chosen so that the 100 strike has the requested ATM vol
function params(v) {
  const k0 = Math.log(100 / F), w0 = (v.atm / 100) ** 2 * Tm;
  const a = w0 - v.b * (v.rho * (k0 - v.m) + Math.sqrt((k0 - v.m) ** 2 + v.s * v.s));
  return { a, b: v.b, rho: v.rho, m: v.m, s: v.s };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let preset = "equity";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("捏一条 30 天微笑：它对期权价格做了什么", "Shape a 30-day smile and see what it does to prices")}</div>
    <div class="demo-row">${seg("sk-pre", [["equity", T("股指偏斜", "Equity skew")], ["fx", T("外汇微笑", "FX smile")], ["commodity", T("商品看涨偏斜", "Commodity call skew")], ["flat", T("平坦（BS 假设）", "Flat (BS assumption)")]], preset)}</div>
    <div class="demo-grid">
      ${slider("sk-atm", T("平值波动率（100 行权价）", "ATM vol (100 strike)"), 10, 60, 0.5, 20)}
      ${slider("sk-b", T("b：两翼陡峭度", "b: wing steepness"), 0, 0.04, 0.001, 0.012)}
      ${slider("sk-rho", T("ρ：倾斜方向", "ρ: tilt"), -0.95, 0.95, 0.05, -0.8)}
      ${slider("sk-m", T("m：左右平移", "m: shift"), -0.1, 0.1, 0.005, 0.01)}
      ${slider("sk-s", T("s：底部圆滑度", "s: roundness of the bottom"), 0.01, 0.2, 0.005, 0.05)}
    </div>
    <div class="demo-math" id="sk-f"></div>
    <div id="sk-chart"></div>
    <div id="sk-stats"></div>
    <div id="sk-warn"></div>
    <div id="sk-table"></div>
    <p class="demo-tip">${T("试试：从“股指偏斜”开始，把 ρ 拉向 0，看 90 看跌的价格倍数怎样缩小、风险逆转怎样归零；再把 b 拉到最大、s 拉到最小，微笑会变得太尖，蝶式无套利检查亮红灯。", "Try this: start from “Equity skew” and drag ρ toward 0 — watch the 90 put's multiple of its flat price shrink and the risk reversal go to zero. Then push b to the top and s to the bottom: the smile gets too sharp and the no-butterfly-arbitrage check turns red.")}</p>
  </div>`;
  const $ = (q) => root.querySelector(q);
  const draw = (v) => {
    const p = params({ atm: v["sk-atm"], b: v["sk-b"], rho: v["sk-rho"], m: v["sk-m"], s: v["sk-s"] });
    const volK = (K) => O.sviVol(Math.log(K / F), Tm, p);
    const atm = v["sk-atm"] / 100;
    const price = (K, type, sig) => O.bsPrice({ S, K, T: Tm, r, sigma: sig, type });
    // live SVI evaluation at the 90 strike
    const k90 = Math.log(90 / F), w90 = O.sviW(k90, p);
    $("#sk-f").innerHTML = tex(String.raw`w(k) = a + b\left(\rho(k-m) + \sqrt{(k-m)^2 + s^2}\right),\quad a = ${p.a.toFixed(5)}\ (\text{${T("由平值波动率决定", "set by the ATM vol")}})`, true) +
      tex(String.raw`k_{90} = \ln(90/F) = ${k90.toFixed(4)} \;\Rightarrow\; w = ${w90.toFixed(5)},\quad \sigma_{90} = \sqrt{w/T} = ${(volK(90) * 100).toFixed(2)}\%`, true);
    $("#sk-chart").innerHTML = lineChart({
      xmin: 75, xmax: 125, xlabel: T("行权价（XYZ = 100，30 天）", "Strike (XYZ = 100, 30 days)"), ylabel: T("隐含波动率 %", "Implied vol %"), yfmt: (x) => x + "%",
      series: [
        { f: (K) => volK(K) * 100, cls: 0, label: T("SVI 微笑", "SVI smile") },
        { f: () => atm * 100, cls: 5, dashed: true, label: T("平坦的 Black-Scholes", "Flat Black-Scholes") },
      ],
      points: [90, 95, 100, 105, 110].map((K) => ({ x: K, y: volK(K) * 100, cls: K < 100 ? 2 : K > 100 ? 3 : 0 })),
      markers: [{ x: F, label: "F" }],
    });
    // 25-delta strikes (each with its own smile vol)
    const bis = (f, lo, hi) => { let flo = f(lo); for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2, fm = f(mid); if (flo * fm <= 0) hi = mid; else { lo = mid; flo = fm; } } return (lo + hi) / 2; };
    const Kc = bis((K) => O.greeks({ S, K, T: Tm, r, sigma: volK(K), type: "call" }).delta - 0.25, 100, 160);
    const Kp = bis((K) => O.greeks({ S, K, T: Tm, r, sigma: volK(K), type: "put" }).delta + 0.25, 50, 100);
    const vc = volK(Kc) * 100, vp = volK(Kp) * 100, va = volK(100) * 100;
    const rr = vc - vp, bf = (vc + vp) / 2 - va;
    // risk-neutral P(S_T < 90) from the smile (digital put = dP/dK · e^{rT}) vs flat
    const h = 0.01, pSmile = Math.exp(r * Tm) * (price(90 + h, "put", volK(90 + h)) - price(90 - h, "put", volK(90 - h))) / (2 * h);
    const pFlat = 1 - O.probAbove(S, 90, Tm, atm, r);
    let gmin = Infinity, wmin = Infinity;
    for (let k = -0.6; k <= 0.6; k += 0.005) { gmin = Math.min(gmin, O.sviG(k, p)); wmin = Math.min(wmin, O.sviW(k, p)); }
    $("#sk-stats").innerHTML = stats([
      [T("25Δ 看涨波动率（K ", "25Δ call vol (K ") + Kc.toFixed(1) + T("）", ")"), vc.toFixed(2) + "%"],
      [T("25Δ 看跌波动率（K ", "25Δ put vol (K ") + Kp.toFixed(1) + T("）", ")"), vp.toFixed(2) + "%"],
      [T("风险逆转 RR₂₅", "Risk reversal RR₂₅"), (rr >= 0 ? "+" : "−") + Math.abs(rr).toFixed(2), rr < -0.05 ? "neg" : rr > 0.05 ? "pos" : ""],
      [T("蝶式 BF₂₅", "Butterfly BF₂₅"), (bf >= 0 ? "+" : "−") + Math.abs(bf).toFixed(2)],
      [T("风险中性 P(到期 < 90)：微笑", "Risk-neutral P(S_T < 90): smile"), (pSmile * 100).toFixed(1) + "%", "acc"],
      [T("同上：平坦波动率", "Same, flat vol"), (pFlat * 100).toFixed(1) + "%"],
    ]);
    const ok = gmin >= 0 && wmin > 0;
    $("#sk-warn").innerHTML = ok
      ? `<p class="demo-meta">${T("蝶式无套利检查：通过（g(k) 的最小值 ", "No-butterfly-arbitrage check: passed (minimum of g(k) = ")}${gmin.toFixed(3)} ≥ 0${T("）", ")")}</p>`
      : `<div class="demo-warn">${T("蝶式无套利检查：失败——这条微笑隐含某处的概率为负（g(k) 最小值 ", "No-butterfly-arbitrage check: FAILED — this smile implies a negative probability somewhere (minimum of g(k) = ")}${gmin.toFixed(3)}${T("）。某个蝶式价差的价格会小于零。", "). Some butterfly spread would have a negative price.")}</div>`;
    const rows = [85, 90, 95, 100, 105, 110, 115].map((K) => {
      const type = K < 100 ? "put" : "call", sig = volK(K), ps = price(K, type, sig), pf = price(K, type, atm);
      return `<tr${K === 100 ? ' class="hl"' : ""}><td>${K}</td><td>${type === "put" ? T("看跌", "put") : T("看涨", "call")}</td><td>${(sig * 100).toFixed(2)}%</td><td>$${ps.toFixed(ps < 0.1 ? 3 : 2)}</td><td>$${pf.toFixed(pf < 0.1 ? 3 : 2)}</td><td>${pf > 0.0005 ? (ps / pf).toFixed(2) + "×" : "–"}</td></tr>`;
    }).join("");
    $("#sk-table").innerHTML = `<table><thead><tr><th>${T("行权价", "Strike")}</th><th>${T("虚值期权", "OTM option")}</th><th>${T("微笑波动率", "Smile vol")}</th><th>${T("按微笑定价", "Smile price")}</th><th>${T("按平值波动率定价", "At ATM vol")}</th><th>${T("倍数", "Ratio")}</th></tr></thead><tbody>${rows}</tbody></table>`;
  };
  const f3 = (x) => (+x).toFixed(3), f2 = (x) => (+x).toFixed(2);
  const run = bindSliders(root, { "sk-atm": (x) => x + "%", "sk-b": f3, "sk-rho": f2, "sk-m": f3, "sk-s": f3 }, draw);
  onSeg(root, "sk-pre", (x) => {
    preset = x; const pr = PRESETS[x];
    $("#sk-atm").value = pr.atm; $("#sk-b").value = pr.b; $("#sk-rho").value = pr.rho; $("#sk-m").value = pr.m; $("#sk-s").value = pr.s;
    run();
  });
}
