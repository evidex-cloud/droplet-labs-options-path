// Inline demo for lesson synthetics-boxes: you SOLD a 1-year XYZ 90/110 box built from American options.
// Move XYZ and the clock: the engine's American tree tells you when the short 110 put has no time value left
// (so its owner may exercise), and what cash an assignment would demand from your account.
import * as O from "./_opt.js";
import { slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const K1 = 90, K2 = 110, r = 0.04, sigma = 0.2, proceeds = 20 * Math.exp(-r) * 100;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("你卖出了一个美式箱体：会被提前指派吗？", "You sold an American-style box: will you be assigned early?")}</div>
    <div class="demo-meta">${T("开仓：卖出 1 年期 XYZ 90/110 箱体，收 ", "Opened: sold a 1-year XYZ 90/110 box for ")}$${proceeds.toFixed(0)}${T("（每张）。空头腿：90 看涨、110 看跌。", " per box. Short legs: the 90 call and the 110 put.")}</div>
    <div class="demo-grid">
      ${slider("sba-s", T("XYZ 现在的价格", "XYZ now"), 50, 150, 1, 85)}
      ${slider("sba-d", T("剩余天数", "Days left"), 1, 365, 1, 270)}
      ${slider("sba-n", T("卖出的箱体数量", "Boxes sold"), 1, 20, 1, 1)}
      ${slider("sba-c", T("账户里的其他现金", "Other cash in the account"), 0, 50000, 500, 2000)}
    </div>
    <div class="demo-math" id="sba-f"></div>
    <div id="sba-stats"></div>
    <div id="sba-verdict"></div>
    <p class="demo-tip">${T("试试：把 XYZ 从 100 慢慢拉到 85——在某个价格，110 看跌的美式价值跌到正好等于内在价值（时间价值为零），对方随时可能行权。再把箱体数量加到 10，看现金缺口有多大。", "Try this: slide XYZ from 100 down to 85 — at some price the American 110 put is worth exactly its intrinsic value (zero time value) and its owner may exercise any day. Then raise the number of boxes to 10 and watch the cash gap.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  bindSliders(root, { "sba-s": (x) => "$" + x, "sba-d": (x) => x + T(" 天", " days"), "sba-n": (x) => String(x), "sba-c": (x) => "$" + (+x).toLocaleString("en-US") }, (v) => {
    const S = v["sba-s"], Tm = v["sba-d"] / 365, n = v["sba-n"], cash = v["sba-c"];
    const amerPut = O.binomial({ S, K: K2, T: Tm, r, sigma, type: "put", steps: 200, american: true }).price;
    const intrPut = Math.max(K2 - S, 0), tvPut = amerPut - intrPut;
    const callVal = O.bsPrice({ S, K: K1, T: Tm, r, sigma, type: "call" }), intrCall = Math.max(S - K1, 0);
    const boxNow = (K2 - K1) * Math.exp(-r * Tm);
    $("#sba-f").innerHTML = tex(String.raw`P_{A}(110) = ${amerPut.toFixed(2)},\quad \text{${T("内在价值", "intrinsic")}} = \max(110 - ${S},0) = ${intrPut.toFixed(2)},\quad \text{${T("时间价值", "time value")}} = ${tvPut.toFixed(2)}`, true);
    const atRisk = intrPut > 0 && tvPut < 0.01;
    const need = K2 * 100 * n, have = proceeds * n + cash, gap = need - have;
    $("#sba-stats").innerHTML = stats([
      [T("箱体现在的理论价值（每股）", "Box value now (per share)"), "$" + boxNow.toFixed(2)],
      [T("110 看跌的时间价值", "Time value of the 110 put"), "$" + tvPut.toFixed(2), atRisk ? "neg" : "pos"],
      [T("90 看涨的时间价值", "Time value of the 90 call"), "$" + (callVal - intrCall).toFixed(2), "pos"],
      [T("若被指派需付现金", "Cash needed if assigned"), "$" + need.toLocaleString("en-US"), "acc"],
      [T("账户可用现金", "Cash available"), "$" + Math.round(have).toLocaleString("en-US")],
    ]);
    let html = atRisk
      ? `<div class="demo-log bad"><b>${T("110 看跌已经没有时间价值：持有人提前行权是理性的。", "The 110 put has no time value left: early exercise by its owner is rational.")}</b> ${T("被指派后，你要以 110 美元买入 ", "If assigned you must buy ")}${(100 * n).toLocaleString("en-US")}${T(" 股，今天就付 ", " shares at $110, paying ")}$${need.toLocaleString("en-US")}${T("。", " today.")}</div>`
      : `<div class="demo-log ok">${T("110 看跌还有时间价值，理性的持有人现在不会行权（但任何人都有权随时行权）。", "The 110 put still has time value, so a rational owner won't exercise yet (though any owner may, at any time).")}</div>`;
    html += gap > 0
      ? `<div class="demo-log warn">${T("现金缺口：", "Cash shortfall: ")}$${Math.round(gap).toLocaleString("en-US")}${T("。经济上你仍然被对冲（剩余的腿加上股票，到期每股至少值 90），但账户付不出这笔钱——券商会发出追加保证金通知，或按市场价强行平仓。", ". Economically you are still hedged (the remaining legs plus the shares are worth at least $90 per share at expiry), but the account can't pay — expect a margin call or forced closing at market prices.")}</div>`
      : `<div class="demo-log ok">${T("即使被指派，账户现金也够付。", "Even if assigned, the account has the cash to pay.")}</div>`;
    html += `<div class="demo-meta">${T("90 看涨：不分红的股票上，提前行权美式看涨从不划算；有股息时，除息日前就可能被行权。", "90 call: on a stock without dividends, exercising an American call early never pays; with a dividend it can be exercised just before the ex-date.")}</div>`;
    $("#sba-verdict").innerHTML = html;
  });
}
