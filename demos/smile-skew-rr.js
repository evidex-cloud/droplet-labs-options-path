// Inline demo for lesson smile-skew: rebuild a smile from three quotes — ATM vol, 25-delta risk reversal, 25-delta butterfly —
// the way FX desks quote it, and price the 25-delta legs on XYZ's 30-day chain.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S = 100, r = 0.04, Tm = 30 / 365;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("三个报价拼出一条微笑：ATM、风险逆转、蝶式", "Three quotes make a smile: ATM, risk reversal, butterfly")}</div>
    <div class="demo-grid-3 demo-grid">
      ${slider("rr-atm", T("平值波动率", "ATM vol"), 10, 50, 0.5, 20)}
      ${slider("rr-rr", T("风险逆转 RR₂₅（看涨 − 看跌）", "Risk reversal RR₂₅ (call − put)"), -8, 8, 0.05, -2.75)}
      ${slider("rr-bf", T("蝶式 BF₂₅", "Butterfly BF₂₅"), 0, 3, 0.05, 0.35)}
    </div>
    <div class="demo-math" id="rr-f"></div>
    <div id="rr-chart"></div>
    <div id="rr-stats"></div>
    <p class="demo-tip">${T("看什么：RR 管倾斜，BF 管弯曲。把 RR 拉到 0，曲线变成对称的微笑；拉成正数，看涨一侧更贵（商品或加密牛市里见过的形状）。风险逆转的美元价格随 RR 一起变——这就是“交易偏斜”。", "What to notice: RR controls the tilt, BF the bend. Set RR to 0 and the curve becomes a symmetric smile; make it positive and the call side gets dearer (a shape seen in commodities and crypto rallies). The dollar price of the risk reversal moves with RR — that is what “trading skew” means.")}</p>
  </div>`;
  const $ = (q) => root.querySelector(q);
  bindSliders(root, { "rr-atm": (x) => (+x).toFixed(1) + "%", "rr-rr": (x) => (+x >= 0 ? "+" : "−") + Math.abs(+x).toFixed(2), "rr-bf": (x) => "+" + (+x).toFixed(2) }, (v) => {
    const atm = v["rr-atm"], rr = v["rr-rr"], bf = v["rr-bf"];
    const vc = atm + bf + rr / 2, vp = atm + bf - rr / 2;
    // quadratic through (0.25, vp), (0.5, atm), (0.75, vc) in u = put-side coordinate (u = 1 − call delta)
    const A = (vp - 2 * atm + vc) / (2 * 0.0625), B = (vc - vp) / 0.5;
    const volU = (u) => atm + B * (u - 0.5) + A * (u - 0.5) ** 2;
    $("#rr-f").innerHTML = tex(String.raw`\sigma_{25C} = \sigma_{\text{ATM}} + BF_{25} + \tfrac12 RR_{25} = ${atm.toFixed(1)} + ${bf.toFixed(2)} ${rr >= 0 ? "+" : "-"} ${Math.abs(rr / 2).toFixed(3)} = ${vc.toFixed(2)}\%`, true) +
      tex(String.raw`\sigma_{25P} = \sigma_{\text{ATM}} + BF_{25} - \tfrac12 RR_{25} = ${atm.toFixed(1)} + ${bf.toFixed(2)} ${rr >= 0 ? "-" : "+"} ${Math.abs(rr / 2).toFixed(3)} = ${vp.toFixed(2)}\%`, true);
    const lab = (u) => (Math.abs(u - 0.5) < 1e-9 ? "ATM" : u < 0.5 ? Math.round(u * 100) + "ΔP" : Math.round((1 - u) * 100) + "ΔC");
    $("#rr-chart").innerHTML = lineChart({
      H: 240, xmin: 0.1, xmax: 0.9, xfmt: lab, xlabel: T("← 虚值看跌（低行权价）· 虚值看涨（高行权价）→", "← OTM puts (low strikes) · OTM calls (high strikes) →"), ylabel: T("隐含波动率 %", "Implied vol %"), yfmt: (x) => x + "%",
      series: [{ f: volU, cls: 0, label: T("由三个报价插值的微笑", "Smile interpolated from three quotes") }, { f: () => atm, cls: 5, dashed: true, label: T("平值", "ATM") }],
      points: [{ x: 0.25, y: vp, cls: 2, label: "25ΔP" }, { x: 0.5, y: atm, cls: 5 }, { x: 0.75, y: vc, cls: 3, label: "25ΔC" }],
    });
    // strikes and prices of the 25-delta legs on XYZ 30-day
    const bis = (f, lo, hi) => { let flo = f(lo); for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2, fm = f(mid); if (flo * fm <= 0) hi = mid; else { lo = mid; flo = fm; } } return (lo + hi) / 2; };
    const sc = Math.max(vc, 1) / 100, sp = Math.max(vp, 1) / 100;
    const Kc = bis((K) => O.greeks({ S, K, T: Tm, r, sigma: sc, type: "call" }).delta - 0.25, 100, 200);
    const Kp = bis((K) => O.greeks({ S, K, T: Tm, r, sigma: sp, type: "put" }).delta + 0.25, 30, 100);
    const c = O.bsPrice({ S, K: Kc, T: Tm, r, sigma: sc, type: "call" }), p = O.bsPrice({ S, K: Kp, T: Tm, r, sigma: sp, type: "put" });
    const a0 = atm / 100, c0 = O.bsPrice({ S, K: Kc, T: Tm, r, sigma: a0, type: "call" }), p0 = O.bsPrice({ S, K: Kp, T: Tm, r, sigma: a0, type: "put" });
    $("#rr-stats").innerHTML = stats([
      [T("25Δ 看涨：K ", "25Δ call: K ") + Kc.toFixed(1) + T("，波动率 ", ", vol ") + vc.toFixed(2) + "%", "$" + c.toFixed(2)],
      [T("25Δ 看跌：K ", "25Δ put: K ") + Kp.toFixed(1) + T("，波动率 ", ", vol ") + vp.toFixed(2) + "%", "$" + p.toFixed(2)],
      [T("买看涨、卖看跌的成本", "Cost of long call, short put"), (c - p >= 0 ? "$" : "−$") + Math.abs(c - p).toFixed(2), c - p < 0 ? "pos" : "neg"],
      [T("同样两腿按平值波动率", "Same legs at ATM vol"), (c0 - p0 >= 0 ? "$" : "−$") + Math.abs(c0 - p0).toFixed(2)],
    ]);
  });
}
