// Main demo for lesson why-options: the same bullish view three ways — $10,000 in 100 shares, one 30-day call
// (premium from the engine), or the call's premium spent on shares — across XYZ moves from −20% to +20%.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const base = { S: 100, T: 30 / 365, r: 0.04, sigma: 0.2, type: "call" };
  let K = 100;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("同一个看涨观点，三种下注方式", "One bullish view, three ways to bet")}</div>
    <div class="demo-row"><span class="demo-label">${T("看涨期权的行权价：", "Call strike: ")}</span>${seg("wo-k", [[95, "95"], [100, "100"], [105, "105"], [110, "110"]], K)}</div>
    ${slider("wo-m", T("30 天后 XYZ 的涨跌", "XYZ's move over 30 days"), -20, 20, 1, 10)}
    <div class="demo-math" id="wo-f"></div>
    <div id="wo-stats"></div>
    <div id="wo-chart"></div>
    <p class="demo-tip">${T("试试：先看 +10%，再看 +2% 和 −5%。期权把小额资金放大成大比例收益，但只要涨得不够多（低于盈亏平衡价），整笔权利金就归零；换成更虚值的 105 或 110 行权价，放大倍数更高、归零的机会也更大。", "Try this: look at +10%, then +2% and −5%. The call turns a small stake into a large percentage return, but unless XYZ rises past the breakeven the whole premium is gone; the further-out 105 and 110 strikes multiply more and expire worthless more often.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const usd = (x) => (x < 0 ? "−$" : x > 0 ? "+$" : "$") + Math.abs(x).toLocaleString("en-US", { maximumFractionDigits: 0 });
  const pct = (x) => (x > 0 ? "+" : x < 0 ? "−" : "") + Math.abs(x * 100).toFixed(0) + "%";
  const draw = (v) => {
    const m = v["wo-m"] / 100, ST = 100 * (1 + m);
    const c = Math.round(O.bsPrice({ ...base, K }) * 100) / 100; // premium per share, rounded to cents
    const budget = c * 100;
    const rCall = (x) => (Math.max(x - K, 0) - c) / c, rStock = (x) => (x - 100) / 100;
    const plCall = (Math.max(ST - K, 0) - c) * 100, plShares = (ST - 100) * 100, plSmall = (ST - 100) * (budget / 100);
    const st = ST.toFixed(0);
    $("#wo-f").innerHTML = tex(String.raw`R_{\text{${T("期权", "call")}}} = \frac{\max(S_T - K,\,0) - c}{c} = \frac{\max(${st} - ${K},\,0) - ${c.toFixed(2)}}{${c.toFixed(2)}} = ${(rCall(ST) * 100).toFixed(0)}\%`, true) + tex(String.raw`R_{\text{${T("股票", "stock")}}} = \frac{S_T - S_0}{S_0} = \frac{${st} - 100}{100} = ${(m * 100).toFixed(0)}\%`, true);
    $("#wo-stats").innerHTML = stats([
      [T(`100 股（投入 $10,000）`, `100 shares ($10,000 in)`), `${usd(plShares)} · ${pct(rStock(ST))}`, plShares >= 0 ? "pos" : "neg"],
      [T(`1 张 ${K} 看涨（投入 $${budget.toFixed(0)}）`, `One ${K} call ($${budget.toFixed(0)} in)`), `${usd(plCall)} · ${pct(rCall(ST))}`, plCall >= 0 ? "pos" : "neg"],
      [T(`同样 $${budget.toFixed(0)} 买股票`, `The same $${budget.toFixed(0)} in shares`), `${usd(plSmall)} · ${pct(rStock(ST))}`, plSmall >= 0 ? "pos" : "neg"],
      [T("期权盈亏平衡价", "Call breakeven"), "$" + (K + c).toFixed(2), "acc"],
    ]);
    $("#wo-chart").innerHTML = lineChart({
      xmin: -20, xmax: 20, xstep: 5, xfmt: (x) => (x > 0 ? "+" : "") + x + "%", yfmt: (y) => y + "%",
      xlabel: T("30 天后 XYZ 的涨跌", "XYZ move over 30 days"), ylabel: T("收益率", "Return"),
      series: [
        { f: (x) => rCall(100 * (1 + x / 100)) * 100, cls: 3, label: T(`${K} 看涨期权`, `${K} call`) },
        { f: (x) => x, cls: 5, label: T("股票（无论投入多少）", "Shares (any amount)") },
      ],
      markers: [{ x: m * 100, label: pct(m) }], hlines: [{ y: -100, label: T("−100%：权利金全部损失", "−100%: premium lost") }],
      points: [{ x: m * 100, y: rCall(ST) * 100, cls: 3, label: pct(rCall(ST)) }],
    });
  };
  const run = bindSliders(root, { "wo-m": (x) => (x > 0 ? "+" : "") + x + "%" }, draw);
  onSeg(root, "wo-k", (k) => { K = +k; run(); });
}
