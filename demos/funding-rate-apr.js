// Inline demo for lesson funding-rate: normalise a displayed funding rate to one interval, annualise it,
// and turn it into dollars and a share of margin for a given notional and leverage.
import { seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let hours = 8;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("资金费换算器：先统一口径，再谈贵不贵", "Funding converter: same interval first, then judge the cost")}</div>
    <div class="demo-row"><span class="demo-label" style="margin:0">${T("界面显示的费率是每", "The displayed rate is per")}</span>${seg("fra-h", [["1", T("1 小时", "1 hour")], ["4", T("4 小时", "4 hours")], ["8", T("8 小时", "8 hours")], ["12", T("12 小时", "12 hours")]], "8")}</div>
    <div class="demo-grid">
      ${slider("fra-rate", T("显示的费率", "Displayed rate"), -0.1, 0.3, 0.00125, 0.01)}
      ${slider("fra-n", T("名义价值（美元）", "Notional (USD)"), 1000, 100000, 1000, 10000)}
      ${slider("fra-lev", T("杠杆（决定保证金）", "Leverage (sets the margin)"), 1, 50, 1, 10)}
    </div>
    <div class="demo-math" id="fra-f"></div>
    <div id="fra-stats"></div>
    <p class="demo-tip">${T("试试：选“1 小时”，把费率调到 0.00125%——折合每 8 小时正好 0.01%，年化 10.95%，和 8 小时一结的基准一样。再把它调到 0.01% 每小时：年化 87.6%，这才是“贵八倍”的情形。最后把杠杆拉到 20：同样的费率，每月吃掉的保证金比例翻倍。", "Try this: choose 1 hour and set the rate to 0.00125%: that is exactly 0.01% per 8 hours and 10.95% a year, the same as the 8-hour baseline. Now set 0.01% per hour: 87.6% a year, the only case that is really eight times more. Finally raise leverage to 20: the same rate eats twice the share of margin each month.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const money = (x) => (x < 0 ? "−$" : "$") + Math.abs(x).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  const pct = (x, d = 3) => (x * 100).toFixed(d) + "%";
  const run = bindSliders(root, { "fra-rate": (x) => x.toFixed(5) + "%", "fra-n": (x) => "$" + x.toLocaleString("en-US"), "fra-lev": (x) => x + "×" }, (v) => {
    const f = v["fra-rate"] / 100, N = v["fra-n"], L = v["fra-lev"], M = N / L;
    const perDay = 24 / hours, f8 = f * (8 / hours), apr = f * perDay * 365;
    const apy = f > -1 ? Math.pow(1 + f, perDay * 365) - 1 : -1;
    const month = N * f * perDay * 30;
    $("#fra-f").innerHTML = tex(String.raw`f_{8\text{h}} = f_{\Delta} \times \frac{8}{\Delta} = ${(f * 100).toFixed(5)}\% \times \frac{8}{${hours}} = ${(f8 * 100).toFixed(4)}\%,\qquad \text{APR} = f_{\Delta} \times \frac{24}{\Delta} \times 365 = ${(apr * 100).toFixed(2)}\%`, true) +
      tex(String.raw`\text{${T("每次付款", "payment")}} = N \times f_{\Delta} = ${N.toLocaleString("en-US").replace(/,/g, "{,}")} \times ${(f * 100).toFixed(5)}\% = \$${(N * f).toFixed(2)}`, true);
    $("#fra-stats").innerHTML = stats([
      [T("折合每 8 小时", "Per-8-hour equivalent"), pct(f8, 4), "acc"],
      [T("单利年化 APR", "Simple APR"), pct(apr, 2), apr > 0 ? "neg" : "pos"],
      [T("复利年化", "Compounded (APY)"), pct(apy, 2)],
      [T("多头每天付", "Long pays per day"), money(N * f * perDay)],
      [T("30 天合计", "Over 30 days"), money(month)],
      [T("占保证金（30 天）", "Share of margin (30 days)"), pct(month / M, 1), month > 0 ? "neg" : "pos"],
    ]);
  });
  onSeg(root, "fra-h", (h) => { hours = +h; run(); });
}
