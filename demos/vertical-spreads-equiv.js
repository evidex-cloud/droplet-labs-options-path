// Inline demo for lesson vertical-spreads: a bull call spread (debit) and a bull put spread (credit) on the same strikes
// have the same shape; parity says debit + credit = width × e^{-rT}, so they differ only by interest on the width.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100, sigma = 0.2;
  let W = 5;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("借记与贷记：同一个形状，两种付款方式", "Debit and credit: one shape, two ways to pay")}</div>
    <div class="demo-row">${seg("vse-w", [["5", T("宽度 5", "width 5")], ["10", T("宽度 10", "width 10")]], "5")}</div>
    <div class="demo-grid">
      ${slider("vse-k", T("较低的行权价 K₁", "Lower strike K₁"), 90, 110, 1, 100)}
      ${slider("vse-d", T("到期天数", "Days to expiry"), 7, 365, 1, 30)}
      ${slider("vse-r", T("利率 r", "Rate r"), 0, 10, 0.5, 4)}
    </div>
    <div class="demo-math" id="vse-f"></div>
    <div id="vse-chart"></div>
    <p class="demo-tip">${T("看什么：两条线几乎重合，差距恰好是“宽度的利息”。把天数拉到 365、利率拉到 10%，差距变大；利率拉到 0，两条线完全重合。选借记还是贷记，是融资选择，不是观点选择。", "What to notice: the two lines almost coincide, and the gap is exactly the interest on the width. Push days to 365 and the rate to 10% and the gap widens; set the rate to 0 and the lines coincide exactly. Debit or credit is a financing choice, not a view.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  let v = {};
  function draw() {
    const K1 = v["vse-k"], K2 = K1 + W, Tm = v["vse-d"] / 365, r = v["vse-r"] / 100;
    const D = O.bsCall(S0, K1, Tm, r, sigma) - O.bsCall(S0, K2, Tm, r, sigma);
    const Cr = O.bsPut(S0, K2, Tm, r, sigma) - O.bsPut(S0, K1, Tm, r, sigma);
    const pv = W * Math.exp(-r * Tm);
    $("#vse-f").innerHTML = tex(String.raw`\begin{gathered}\underbrace{${D.toFixed(4)}}_{\text{${T("牛市看涨借记", "bull call debit")}}} + \underbrace{${Cr.toFixed(4)}}_{\text{${T("牛市看跌贷记", "bull put credit")}}} = ${(D + Cr).toFixed(4)} \\ = (K_2 - K_1)\,e^{-rT} = ${W} \times e^{-${r.toFixed(3)} \times ${Tm.toFixed(3)}}\end{gathered}`, true);
    const bc = (x) => Math.min(Math.max(x - K1, 0), W) - D;
    const bp = (x) => Cr - Math.min(Math.max(K2 - x, 0), W);
    $("#vse-chart").innerHTML = lineChart({
      xmin: K1 - 10, xmax: K2 + 10, xlabel: T("到期时 XYZ 价格", "XYZ price at expiry"), ylabel: T("每股盈亏", "P&L per share"),
      series: [{ f: bc, cls: 0, label: T("牛市看涨价差（先付钱）", "Bull call spread (pay now)") }, { f: bp, cls: 1, dashed: true, label: T("牛市看跌价差（先收钱）", "Bull put spread (paid now)") }],
      markers: [{ x: K1, label: "K₁" }, { x: K2, label: "K₂" }],
      hlines: [{ y: 0 }],
    }) + `<div class="demo-meta">${T("到期时“牛市看涨 − 牛市看跌”的盈亏差（不计权利金的利息）", "Bull call minus bull put at expiry (ignoring interest on the premiums)")} = ${(bc(S0) - bp(S0)).toFixed(4)} = ${T("宽度的利息", "interest on the width")} ${(W - pv).toFixed(4)}. ${T("把贷记收到的钱按 r 存到到期，差距就消失。", "Invest the credit at r until expiry and the gap disappears.")}</div>`;
  }
  bindSliders(root, { "vse-k": (x) => "$" + x, "vse-d": (x) => x + T(" 天", " days"), "vse-r": (x) => x + "%" }, (vals) => { v = vals; draw(); });
  onSeg(root, "vse-w", (x) => { W = +x; draw(); });
}
