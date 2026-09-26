// Main demo for lesson vix: compute a VIX-style index from a generated option strip with the Cboe recipe
// (varianceFromStrip / otmStrip), for two expiries around 30 days, then interpolate total variance to 30 days.
import * as O from "./_opt.js";
import { barChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

const SMILES = {
  flat: { b: 0, rho: 0, m: 0, s: 0.05 },
  skew: { b: 0.012, rho: -0.8, m: 0.01, s: 0.05 }, // the 30-day smile of lesson smile-skew
  steep: { b: 0.035, rho: -0.8, m: 0, s: 0.04 },
};

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S = 100, r = 0.04, D1 = 23, D2 = 37;
  let smile = "skew", spacing = 1;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("自己算一个 VIX：虚值期权条带 → 方差 → 30 天指数", "Build a VIX yourself: OTM strip → variance → 30-day index")}</div>
    <div class="demo-row">${seg("vix-sm", [["flat", T("平坦微笑", "Flat smile")], ["skew", T("股票偏斜", "Equity skew")], ["steep", T("陡峭偏斜", "Steep skew")]], smile)}</div>
    <div class="demo-row"><span class="demo-label">${T("行权价间隔：", "Strike spacing:")}</span>${seg("vix-dk", [[1, "$1"], [2.5, "$2.5"], [5, "$5"]], spacing)}</div>
    <div class="demo-grid">
      ${slider("vix-atm", T("近月（23 天）平值波动率", "Near (23-day) ATM vol"), 8, 70, 0.5, 20)}
      ${slider("vix-slope", T("次月（37 天）比近月高几个点", "Next (37-day) minus near, vol pts"), -15, 10, 0.5, 0)}
    </div>
    <div class="demo-math" id="vix-f1"></div>
    <div class="demo-math" id="vix-f2"></div>
    <div id="vix-stats"></div>
    <div class="demo-label">${T("近月各行权价对方差的贡献（ΔK/K² × Q(K) 的占比）：左边是虚值看跌，右边是虚值看涨", "Near-term contribution of each strike (share of ΔK/K² × Q(K)): OTM puts on the left, OTM calls on the right")}</div>
    <div id="vix-bars"></div>
    <p class="demo-tip">${T("试试：平坦微笑 + $1 间隔时，指数几乎等于平值波动率；切到“股票偏斜”，平值不变，指数却涨了约一个点；“陡峭偏斜”下涨得更多；换成 $5 间隔，看粗糙的条带把结果推高多少。", "Try this: with a flat smile and $1 spacing the index almost equals ATM vol; switch to “Equity skew” and it rises by about a point while ATM is unchanged (more with “Steep skew”); switch to $5 spacing and see how much a coarse strip overstates it.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const strikes = () => { const a = []; for (let k = 40; k <= 170 + 1e-9; k += spacing) a.push(+k.toFixed(2)); return a; };
  const leg = (days, atm) => {
    const Tm = days / 365, F = O.forward(S, Tm, r), sc = Math.sqrt(Tm / (30 / 365));
    const sm = SMILES[smile], b = sm.b * sc, s = sm.s * sc, m = sm.m * sc, k0 = Math.log(S / F);
    // a is chosen so that the 100 strike carries the ATM vol, as in lesson smile-skew
    const p = { a: atm * atm * Tm - b * (sm.rho * (k0 - m) + Math.sqrt((k0 - m) ** 2 + s * s)), b, rho: sm.rho, m, s };
    const volAt = (K) => Math.max(O.sviVol(Math.log(K / F), Tm, p), 0.01);
    const ks = strikes();
    const st = O.otmStrip({ S, T: Tm, r, strikes: ks, volAt });
    const v = O.varianceFromStrip({ strikes: ks, quotes: st.quotes, F: st.F, T: Tm, r });
    return { Tm, F, ks, quotes: st.quotes, K0: v.K0, variance: v.variance, vol: v.vol, atm };
  };
  const draw = (vals) => {
    const a1 = vals["vix-atm"] / 100, a2 = Math.max(0.03, a1 + vals["vix-slope"] / 100);
    const n = leg(D1, a1), x = leg(D2, a2);
    const w1 = (D2 - 30) / (D2 - D1), w2 = (30 - D1) / (D2 - D1);
    const tv = (n.Tm * n.variance * w1 + x.Tm * x.variance * w2) * (365 / 30);
    const idx = 100 * Math.sqrt(Math.max(tv, 0));
    const atm30 = 100 * Math.sqrt((n.Tm * a1 * a1 * w1 + x.Tm * a2 * a2 * w2) * (365 / 30));
    $("#vix-f1").innerHTML = tex(String.raw`\sigma_1^2 = \frac{2}{T_1}\sum_i \frac{\Delta K_i}{K_i^2}e^{rT_1}Q(K_i) - \frac{1}{T_1}\Big(\frac{F_1}{K_0} - 1\Big)^2 = ${n.variance.toFixed(5)} \;(\sigma_1 = ${(n.vol * 100).toFixed(2)}\%),\qquad \sigma_2 = ${(x.vol * 100).toFixed(2)}\%`, true);
    $("#vix-f2").innerHTML = tex(String.raw`\text{VIX} = 100\sqrt{\Big[\tfrac{23}{365}\,\sigma_1^2 \times ${w1.toFixed(2)} + \tfrac{37}{365}\,\sigma_2^2 \times ${w2.toFixed(2)}\Big]\tfrac{365}{30}} = ${idx.toFixed(2)}`, true);
    $("#vix-stats").innerHTML = stats([
      [T("VIX 式指数", "VIX-style index"), idx.toFixed(2), "acc"],
      [T("30 天平值隐含波动率", "30-day ATM implied vol"), atm30.toFixed(2) + "%"],
      [T("指数 − 平值（偏斜溢价）", "Index − ATM (skew premium)"), (idx - atm30 >= 0 ? "+" : "") + (idx - atm30).toFixed(2), idx - atm30 > 0.5 ? "neg" : ""],
      [T("每个交易日的典型波动（÷16）", "Typical daily move (÷16)"), (idx / Math.sqrt(252)).toFixed(2) + "%"],
      [T("30 天 1σ 波动", "30-day 1σ move"), (idx * Math.sqrt(30 / 365)).toFixed(2) + "%"],
      [T("近月 K₀（远期 ", "Near K₀ (forward ") + n.F.toFixed(2) + T("）", ")"), String(n.K0)],
    ]);
    // contribution bars for the near expiry, strikes 70–130
    const contrib = n.ks.map((k, i) => {
      const dK = i === 0 ? n.ks[1] - n.ks[0] : i === n.ks.length - 1 ? n.ks[i] - n.ks[i - 1] : (n.ks[i + 1] - n.ks[i - 1]) / 2;
      return [k, (dK / (k * k)) * n.quotes[i]];
    });
    const tot = contrib.reduce((s, c) => s + c[1], 0);
    const shown = contrib.filter(([k]) => k >= 70 && k <= 130);
    const putShare = contrib.filter(([k]) => k < n.K0).reduce((s, c) => s + c[1], 0) / tot;
    $("#vix-bars").innerHTML = barChart({
      bars: shown.map(([k, c]) => ({ label: String(k), value: (c / tot) * 100, cls: k < n.K0 ? 2 : k === n.K0 ? 0 : 3 })),
      yfmt: (y) => y.toFixed(0) + "%", xlabel: T("行权价（红 = 虚值看跌，蓝 = K₀，绿 = 虚值看涨）", "strike (red = OTM put, blue = K₀, green = OTM call)"), ymin: 0,
    }) + `<p class="demo-meta">${T("虚值看跌占总方差的 ", "OTM puts supply ")}${(putShare * 100).toFixed(1)}%${T("。", " of the total.")}</p>`;
  };
  const run = bindSliders(root, { "vix-atm": (v) => (+v).toFixed(1) + "%", "vix-slope": (v) => (v > 0 ? "+" : "") + (+v).toFixed(1) }, draw);
  onSeg(root, "vix-sm", (v) => { smile = v; run(); });
  onSeg(root, "vix-dk", (v) => { spacing = +v; run(); });
}
