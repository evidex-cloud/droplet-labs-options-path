// Inline demo for lesson options-data: read the forward (and the hidden carry) out of a call/put pair,
// and see how the bid-ask spread turns the implied forward into a range.
import * as O from "./_opt.js";
import { slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("从一对看涨/看跌报价读出远期价", "Read the forward from one call/put pair")}</div>
    <div class="demo-grid">
      ${slider("odf-q", T("市场隐含的股息/借券成本 q（数据里看不到）", "Hidden dividend/borrow cost q (not in your data)"), 0, 6, 0.25, 0)}
      ${slider("odf-w", T("每条腿的买卖价差", "Bid-ask spread on each leg"), 0.02, 0.4, 0.02, 0.1)}
    </div>
    <div class="demo-math" id="odf-f"></div>
    <div id="odf-stats"></div>
    <p class="demo-tip">${T("看什么：把 q 调高，看涨变便宜、看跌变贵，平价把这个“看不见的”成本原样读了出来；把价差拉宽，隐含远期就从一个数变成一个区间——这就是为什么只用最接近平值、价差最窄的那一档。", "What to notice: raise q and the call cheapens while the put richens — parity reads the 'invisible' carry straight back out. Widen the spread and the implied forward becomes a range, which is why you use the tightest near-the-money strike.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const S = 100, K = 100, r = 0.04, Tm = 30 / 365;
  bindSliders(root, { "odf-q": (x) => x.toFixed(2) + "%", "odf-w": (x) => "$" + x.toFixed(2) }, (v) => {
    const q = v["odf-q"] / 100, w = v["odf-w"];
    const C = O.bsPrice({ S, K, T: Tm, r, q, sigma: 0.2, type: "call" }), P = O.bsPrice({ S, K, T: Tm, r, q, sigma: 0.2, type: "put" });
    const g = Math.exp(r * Tm);
    const Fm = K + g * (C - P);
    const Flo = K + g * (C - w / 2 - (P + w / 2)), Fhi = K + g * (C + w / 2 - (P - w / 2));
    const qImp = r - Math.log(Fm / S) / Tm;
    $("#odf-f").innerHTML =
      tex(String.raw`F = K + e^{rT}(C - P) = 100 + ${g.toFixed(5)} \times (${C.toFixed(3)} - ${P.toFixed(3)}) = ${Fm.toFixed(3)}`, true) +
      tex(String.raw`q_{\text{imp}} = r - \frac{1}{T}\ln\frac{F}{S} = 0.04 - \frac{365}{30}\ln\frac{${Fm.toFixed(3)}}{100} = ${(Math.abs(qImp) < 5e-5 ? 0 : qImp * 100).toFixed(2)}\%`, true);
    $("#odf-stats").innerHTML = stats([
      [T("看涨中间价", "Call mid"), "$" + C.toFixed(2)],
      [T("看跌中间价", "Put mid"), "$" + P.toFixed(2)],
      [T("隐含远期", "Implied forward"), Fm.toFixed(2), "acc"],
      [T("用买卖价算出的区间", "Range from bid/ask"), `${Flo.toFixed(2)} – ${Fhi.toFixed(2)}`],
      [T("无股息时的远期", "Forward if q = 0"), O.forward(S, Tm, r).toFixed(2)],
    ]);
  });
}
