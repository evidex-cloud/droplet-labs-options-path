// Inline demo for lesson cash-secured-put: the effective purchase price K − p, the income on the collateral,
// and the short put's P&L next to simply buying the stock at 100 today.
import * as O from "./_opt.js";
import { payoffChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100, r = 0.04;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("被付钱等折扣：有效买入价与担保现金的收益", "Paid to wait for a discount: effective price and the return on collateral")}</div>
    <div class="demo-grid">
      ${slider("cse-k", T("卖出看跌的行权价 K", "Put strike K"), 85, 100, 1, 95)}
      ${slider("cse-d", T("到期天数", "Days to expiry"), 7, 60, 1, 30)}
      ${slider("cse-v", T("隐含波动率 σ", "Implied vol σ"), 10, 50, 1, 20)}
    </div>
    <div class="demo-math" id="cse-f"></div>
    <div id="cse-stats"></div>
    <div id="cse-chart"></div>
    <p class="demo-tip">${T("看什么：K 越接近现价，权利金越厚、有效买入价越“便宜”，但被指派的概率也越高。在有效买入价以下，卖出看跌和持股的线是平行的——同样的下跌，一分不少。", "What to notice: the closer K is to today's price, the fatter the premium and the “cheaper” the effective price — and the higher the chance of assignment. Below the effective price, the short put's line runs parallel to the stock's: the same fall, dollar for dollar.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  bindSliders(root, { "cse-k": (x) => "$" + x, "cse-d": (x) => x + T(" 天", " days"), "cse-v": (x) => x + "%" }, (v) => {
    const K = v["cse-k"], days = v["cse-d"], sigma = v["cse-v"] / 100, Tm = days / 365;
    const g = O.greeks({ S: S0, K, T: Tm, r, sigma, type: "put" });
    const p = g.price, coll = K * 100, interest = coll * (Math.exp(r * Tm) - 1);
    const inc = (p * 100 + interest) / coll, ann = Math.pow(1 + inc, 365 / days) - 1;
    $("#cse-f").innerHTML = tex(String.raw`\begin{gathered}\text{${T("有效买入价", "effective price")}} = K - p = ${K} - ${p.toFixed(2)} = ${(K - p).toFixed(2)} \\ \frac{100p + \text{${T("利息", "interest")}}}{100K} = \frac{${(p * 100).toFixed(0)} + ${interest.toFixed(0)}}{${coll.toLocaleString("en-US").replace(/,/g, "{,}")}} = ${(inc * 100).toFixed(2)}\%\end{gathered}`, true);
    $("#cse-stats").innerHTML = stats([
      [T("收到权利金", "Premium received"), "+$" + (p * 100).toFixed(0), "pos"],
      [T("担保现金", "Cash set aside"), "$" + coll.toLocaleString("en-US")],
      [T("现金利息（r = 4%）", "Interest on the cash (r = 4%)"), "+$" + interest.toFixed(0)],
      [T("未被指派时的收益（年化）", "Return if not assigned (annualised)"), (inc * 100).toFixed(2) + "% (" + (ann * 100).toFixed(1) + "%)"],
      [T("风险中性 P(被指派)", "Risk-neutral P(assigned)"), (g.probITM * 100).toFixed(1) + "%"],
      [T("Δ（1 张）", "Δ (1 contract)"), "+" + (-g.delta * 100).toFixed(0) + T(" 股", " sh")],
    ]);
    const legs = [{ type: "put", side: "short", K, premium: p, T: Tm }];
    $("#cse-chart").innerHTML = payoffChart({
      legs, lo: 75, hi: 115, spot: S0, mult: 100, today: null,
      xlabel: T("到期时 XYZ 价格", "XYZ price at expiry"), ylabel: T("盈亏（1 张，美元）", "P&L per contract ($)"),
      labels: { expiry: T("卖出看跌（不含利息）", "Short put (excl. interest)"), spot: T("现价", "spot"), be: T("有效价", "eff.") },
      extra: [{ f: (x) => (x - S0) * 100, cls: 5, dashed: true, label: T("今天以 100 买入 100 股", "Buy 100 shares at 100 today") }],
    }).html;
  });
}
