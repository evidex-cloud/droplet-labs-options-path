// Main demo for lesson intrinsic-time-value: premium = intrinsic value + time value, as stacked bars across
// XYZ strikes 80–120 (S = 100, r = 4%, Black-Scholes, European). Days and volatility sliders reshape the time value.
import * as O from "./_opt.js";
import { seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S = 100, r = 0.04, strikes = [80, 85, 90, 95, 100, 105, 110, 115, 120];
  let type = "call";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("权利金 = 内在价值 + 时间价值（XYZ 现价 100）", "Premium = intrinsic + time value (XYZ at $100)")}</div>
    <div class="demo-row">${seg("itv-type", [["call", T("看涨", "Calls")], ["put", T("看跌", "Puts")]], type)}</div>
    <div class="demo-grid">
      ${slider("itv-d", T("离到期天数", "Days to expiry"), 0, 180, 1, 30)}
      ${slider("itv-v", T("波动率 σ", "Volatility σ"), 5, 60, 1, 20)}
      ${slider("itv-k", T("细看哪个行权价", "Strike to inspect"), 80, 120, 5, 105)}
    </div>
    <div id="itv-chart"></div>
    <div class="demo-math" id="itv-f"></div>
    <div id="itv-stats"></div>
    <p class="demo-tip">${T("试试：把天数拉到 0——所有蓝色（时间价值）消失，只剩绿色（内在价值），也就是到期的曲棍球杆。再把 σ 调高：内在价值一点不变，时间价值鼓起来，而且平值那根鼓得最多。切到看跌、行权价 110 以上，会看到欧式模型下时间价值是负的。", "Try this: drag days to 0 — every blue block (time value) vanishes and only green (intrinsic) remains: the hockey stick at expiry. Then raise σ: intrinsic value doesn't move, time value swells, most of all at the money. Switch to puts at strikes 110+ to see negative time value in the European model.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const days = v["itv-d"], sigma = v["itv-v"] / 100, Kx = v["itv-k"], Tm = days / 365;
    const rows = strikes.map((K) => { const p = O.bsPrice({ S, K, T: Tm, r, sigma, type }), iv = O.intrinsic(type, S, K); return { K, p, iv, tv: p - iv }; });
    // stacked bars drawn by hand: green = intrinsic, blue = time value (red if negative)
    const W = 600, H = 250, mL = 44, mR = 10, mT = 14, mB = 40;
    const top = Math.max(...rows.map((x) => x.p), 1) * 1.08, bot = Math.min(0, ...rows.map((x) => x.tv)) * 1.3;
    const Y = (y) => mT + ((top - y) / (top - bot)) * (H - mT - mB), bw = (W - mL - mR) / rows.length;
    let g = "";
    for (let t = 0; t <= top; t += top > 12 ? 5 : top > 5 ? 2 : 1) g += `<line class="grid" x1="${mL}" y1="${Y(t)}" x2="${W - mR}" y2="${Y(t)}"/><text class="lbl-axis" x="${mL - 6}" y="${Y(t) + 4}" text-anchor="end">${t}</text>`;
    const ki = rows.findIndex((q) => q.K === Kx);
    if (ki >= 0) g += `<rect x="${(mL + ki * bw + bw * 0.05).toFixed(1)}" y="${mT}" width="${(bw * 0.9).toFixed(1)}" height="${(H - mB - mT).toFixed(1)}" class="band0"/>`;
    rows.forEach((x, i) => {
      const x0 = mL + i * bw + bw * 0.15, w = bw * 0.7;
      if (x.iv > 0) g += `<rect class="f3" x="${x0.toFixed(1)}" y="${Y(x.iv).toFixed(1)}" width="${w.toFixed(1)}" height="${(Y(0) - Y(x.iv)).toFixed(1)}" rx="2"/>`;
      if (x.tv >= 0) g += `<rect class="f0" x="${x0.toFixed(1)}" y="${Y(x.iv + x.tv).toFixed(1)}" width="${w.toFixed(1)}" height="${Math.max(Y(x.iv) - Y(x.iv + x.tv), 0).toFixed(1)}" rx="2"/>`;
      else g += `<rect class="f2" x="${x0.toFixed(1)}" y="${Y(0).toFixed(1)}" width="${w.toFixed(1)}" height="${(Y(x.tv) - Y(0)).toFixed(1)}" rx="2"/>`;
      g += `<text class="lbl-axis" x="${(x0 + w / 2).toFixed(1)}" y="${H - mB + 15}" text-anchor="middle"${x.K === Kx ? ' font-weight="700"' : ""}>${x.K}</text>`;
    });
    g += `<line class="axis" x1="${mL}" y1="${Y(0)}" x2="${W - mR}" y2="${Y(0)}"/><text class="lbl-axis" x="${(mL + W - mR) / 2}" y="${H - 6}" text-anchor="middle">${T("行权价 K（XYZ 现价 100）", "Strike K (XYZ at 100)")}</text>`;
    $("#itv-chart").innerHTML = `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img">${g}</svg><div class="chart-legend"><span><i class="c3"></i>${T("内在价值", "Intrinsic value")}</span><span><i class="c0"></i>${T("时间价值", "Time value")}</span><span><i class="c2"></i>${T("负的时间价值（欧式）", "Negative time value (European)")}</span></div></div>`;
    const x = rows.find((q) => q.K === Kx);
    const ivTex = type === "call" ? String.raw`\max(${S} - ${Kx},\,0)` : String.raw`\max(${Kx} - ${S},\,0)`;
    $("#itv-f").innerHTML = tex(String.raw`\underbrace{${x.p.toFixed(2)}}_{\text{${T("权利金", "premium")}}} = \underbrace{${x.iv.toFixed(2)}}_{\text{${T("内在价值", "intrinsic")}}} + \underbrace{${x.tv < 0 ? "(" + x.tv.toFixed(2) + ")" : x.tv.toFixed(2)}}_{\text{${T("时间价值", "time value")}}}`, true)
      + tex(String.raw`\text{${T("内在价值", "intrinsic")}} = ${ivTex} = ${x.iv.toFixed(2)}`, true);
    $("#itv-stats").innerHTML = stats([
      [T("权利金（每股）", "Premium per share"), "$" + x.p.toFixed(2), "acc"],
      [T("内在价值", "Intrinsic value"), "$" + x.iv.toFixed(2), "pos"],
      [T("时间价值", "Time value"), (x.tv < 0 ? "−$" : "$") + Math.abs(x.tv).toFixed(2), x.tv < 0 ? "neg" : ""],
      [T("时间价值占权利金", "Time value share"), x.p > 0.005 ? ((x.tv / x.p) * 100).toFixed(0) + "%" : "–"],
    ]) + (x.tv < -0.005 ? `<div class="demo-warn">${T("欧式看跌深度实值时，时间价值可以为负：现在就能拿到的行权价 K，要等到期才拿到，损失了利息。XYZ 是美式期权，可以提前行权，所以真实报价不会低于内在价值。", "A deep-ITM European put can have negative time value: the strike K you would collect is only paid at expiry, so you lose the interest. XYZ options are American and can be exercised early, so their real quotes don't fall below intrinsic value.")}</div>` : "");
  };
  const run = bindSliders(root, { "itv-d": (x) => x + T(" 天", " days"), "itv-v": (x) => x + "%", "itv-k": (x) => "$" + x }, draw);
  onSeg(root, "itv-type", (v) => { type = v; run(); });
}
