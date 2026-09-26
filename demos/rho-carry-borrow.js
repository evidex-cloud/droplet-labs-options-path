// Inline demo for lesson rho-carry: read the implied forward and implied carry (dividends + borrow) from a call and put quote,
// and see how ignoring carry fakes a "skew" between call and put implied vols.
import * as O from "./_opt.js";
import { slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("从报价读出持有成本：隐含远期与隐含融券费", "Read the carry from the quotes: implied forward and implied borrow")}</div>
    <div class="demo-btns">
      <button class="demo-btn" data-p="norm">${T("普通股票（2.45 / 2.12）", "Ordinary stock (2.45 / 2.12)")}</button>
      <button class="demo-btn" data-p="div">${T("分红股票（2.32 / 2.24）", "Dividend payer (2.32 / 2.24)")}</button>
      <button class="demo-btn" data-p="htb">${T("难借股票（1.36 / 3.46）", "Hard to borrow (1.36 / 3.46)")}</button>
    </div>
    <div class="demo-grid">
      ${slider("rb-c", T("30 天 100 看涨报价", "30d 100 call quote"), 0.5, 4, 0.01, 1.36)}
      ${slider("rb-p", T("30 天 100 看跌报价", "30d 100 put quote"), 0.5, 5, 0.01, 3.46)}
    </div>
    <div class="demo-math" id="rb-f"></div>
    <div id="rb-stats"></div>
    <p class="demo-tip">${T("看什么：S = 100、r = 4%。点“难借股票”，按 q = 0 算出的看涨 IV 和看跌 IV 相差二十多个点；把隐含持有成本放回去，两者一样。", "What to notice: S = 100, r = 4%. Pick “hard to borrow”: computed with q = 0, the call and put IVs differ by more than twenty points; put the implied carry back in and they match.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const S = 100, K = 100, r = 0.04, Tm = 30 / 365;
  const pct = (x) => (isFinite(x) ? (x * 100).toFixed(1) + "%" : "—");
  const draw = (v) => {
    const C = v["rb-c"], P = v["rb-p"];
    const F = (C - P) * Math.exp(r * Tm) + K;
    const c0 = F > 0 ? r - Math.log(F / S) / Tm : NaN;
    const carry = Math.abs(c0) < 5e-4 ? 0 : c0;
    const qUse = isFinite(carry) ? carry : 0;
    const ivC0 = O.impliedVol(C, { S, K, T: Tm, r, q: 0, type: "call" }), ivP0 = O.impliedVol(P, { S, K, T: Tm, r, q: 0, type: "put" });
    const ivC1 = O.impliedVol(C, { S, K, T: Tm, r, q: qUse, type: "call" }), ivP1 = O.impliedVol(P, { S, K, T: Tm, r, q: qUse, type: "put" });
    $("#rb-f").innerHTML =
      tex(String.raw`F = (C - P)\,e^{rT} + K = (${C.toFixed(2)} - ${P.toFixed(2)})\,e^{0.04 \times 30/365} + 100 = ${F.toFixed(2)}`, true) +
      tex(String.raw`q + b = r - \tfrac{1}{T}\ln(F/S) = ${isFinite(carry) ? (carry * 100).toFixed(1) : "?"}\%\ \text{${T("每年", "per year")}}`, true);
    $("#rb-stats").innerHTML = stats([
      [T("隐含远期", "Implied forward"), F.toFixed(2), "acc"],
      [T("隐含持有成本 q+b", "Implied carry q+b"), pct(carry), carry > 0.05 ? "neg" : ""],
      [T("看涨 IV（按 q = 0）", "Call IV (q = 0)"), pct(ivC0)],
      [T("看跌 IV（按 q = 0）", "Put IV (q = 0)"), pct(ivP0)],
      [T("含持有成本的 IV（看涨 / 看跌）", "IV with carry (call / put)"), pct(ivC1) + " / " + pct(ivP1), "pos"],
    ]);
  };
  const run = bindSliders(root, { "rb-c": (x) => "$" + x.toFixed(2), "rb-p": (x) => "$" + x.toFixed(2) }, draw);
  const presets = { norm: [2.45, 2.12], div: [2.32, 2.24], htb: [1.36, 3.46] };
  root.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => {
    const [c, p] = presets[b.dataset.p];
    $("#rb-c").value = c; $("#rb-p").value = p; run();
  }));
}
