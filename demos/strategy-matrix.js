// Main demo for lesson strategy-matrix: pick a direction, a volatility view and a horizon; get candidate structures on XYZ,
// their payoff (expiry + before-expiry, or front-expiry curves for time spreads) and their Greek signature.
import * as O from "./_opt.js";
import { payoffChart, lineChart, seg, onSeg, stats } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100, r = 0.04, sigma = 0.2;
  let dir = "bull", vol = "long", days = 30, pick = 0;
  const L = (type, side, K, Td, qty = 1) => ({ type, side, K, qty, T: Td / 365, premium: O.bsPrice({ S: S0, K, T: Td / 365, r, sigma, type }) });
  const STOCK = { type: "stock", side: "long", entry: S0 };
  // catalogue: [zh name, en name, legs(d), wins (zh,en), time spread?]
  const CAT = {
    "bull-long": [
      ["买入平值看涨 100", "Long ATM call 100", (d) => [L("call", "long", 100, d)], ["大涨，且涨得早", "a big rally that comes early"]],
      ["买入虚值看涨 105", "Long OTM call 105", (d) => [L("call", "long", 105, d)], ["涨过 105 很多", "a rally well past 105"]],
      ["牛市看涨价差 100/105", "Bull call spread 100/105", (d) => [L("call", "long", 100, d), L("call", "short", 105, d)], ["温和上涨到 105 附近", "a moderate rise to about 105"]],
    ],
    "bull-short": [
      ["现金担保卖出看跌 95", "Cash-secured put 95", (d) => [L("put", "short", 95, d)], ["不跌破 95，最好慢慢涨", "no fall below 95, ideally a slow drift up"]],
      ["牛市看跌价差 95/100", "Bull put spread 95/100", (d) => [L("put", "short", 100, d), L("put", "long", 95, d)], ["收在 100 以上", "a close above 100"]],
      ["备兑看涨 105", "Covered call 105", (d) => [STOCK, L("call", "short", 105, d)], ["慢慢涨到 105 附近再停住", "drift up to about 105 and stop"]],
    ],
    "bull-time": [["看涨对角：买远期 100、卖近期 105", "Call diagonal: long far 100, short near 105", (d) => [L("call", "long", 100, 2 * d), L("call", "short", 105, d)], ["近期温和上涨，远期隐含波动率不降", "a gentle rise near term, back-month implied vol holding up"], true]],
    "neutral-long": [
      ["买入跨式 100", "Long straddle 100", (d) => [L("call", "long", 100, d), L("put", "long", 100, d)], ["任一方向的大波动", "a big move either way"]],
      ["买入宽跨式 95/105", "Long strangle 95/105", (d) => [L("call", "long", 105, d), L("put", "long", 95, d)], ["更大的波动（更便宜、更宽）", "an even bigger move (cheaper, wider)"]],
    ],
    "neutral-short": [
      ["铁鹰 90/95/105/110", "Iron condor 90/95/105/110", (d) => [L("put", "long", 90, d), L("put", "short", 95, d), L("call", "short", 105, d), L("call", "long", 110, d)], ["留在 95 到 105 之间", "staying between 95 and 105"]],
      ["买入蝶式 95/100/105", "Long butterfly 95/100/105", (d) => [L("call", "long", 95, d), L("call", "short", 100, d, 2), L("call", "long", 105, d)], ["到期正好停在 100 附近", "pinning near 100 at expiry"]],
      ["卖出跨式 100（亏损无上限）", "Short straddle 100 (unlimited loss)", (d) => [L("call", "short", 100, d), L("put", "short", 100, d)], ["几乎不动；大波动时亏损无上限", "barely moving; unlimited loss on a big move"]],
    ],
    "neutral-time": [["日历价差：买远期 100、卖近期 100", "Calendar: long far 100, short near 100", (d) => [L("call", "long", 100, 2 * d), L("call", "short", 100, d)], ["近期停在 100 附近，远期隐含波动率不降", "staying near 100 near term, back-month implied vol holding up"], true]],
    "bear-long": [
      ["买入平值看跌 100", "Long ATM put 100", (d) => [L("put", "long", 100, d)], ["大跌，且跌得早", "a big drop that comes early"]],
      ["买入虚值看跌 95", "Long OTM put 95", (d) => [L("put", "long", 95, d)], ["跌破 95 很多", "a drop well below 95"]],
      ["熊市看跌价差 100/95", "Bear put spread 100/95", (d) => [L("put", "long", 100, d), L("put", "short", 95, d)], ["温和下跌到 95 附近", "a moderate fall to about 95"]],
    ],
    "bear-short": [
      ["熊市看涨价差 100/105", "Bear call spread 100/105", (d) => [L("call", "short", 100, d), L("call", "long", 105, d)], ["收在 100 以下", "a close below 100"]],
      ["熊市看涨价差 105/110", "Bear call spread 105/110", (d) => [L("call", "short", 105, d), L("call", "long", 110, d)], ["不涨过 105", "no rise past 105"]],
    ],
    "bear-time": [["看跌对角：买远期 100、卖近期 95", "Put diagonal: long far 100, short near 95", (d) => [L("put", "long", 100, 2 * d), L("put", "short", 95, d)], ["近期温和下跌，远期隐含波动率不降", "a gentle fall near term, back-month implied vol holding up"], true]],
  };
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("策略地图：先选格子，再选结构", "The strategy map: pick the cell, then the structure")}</div>
    <div class="demo-row">${seg("sm-dir", [["bull", T("看涨", "Bullish")], ["neutral", T("中性", "Neutral")], ["bear", T("看跌", "Bearish")]], dir)}</div>
    <div class="demo-row">${seg("sm-vol", [["long", T("做多波动率（实际会大于隐含）", "Long vol (realized will beat implied)")], ["short", T("做空波动率（实际会小于隐含）", "Short vol (realized will fall short)")], ["time", T("时间结构（近期 vs 远期）", "Term structure (near vs far)")]], vol)}</div>
    <div class="demo-row">${seg("sm-h", [["7", T("7 天", "7 days")], ["30", T("30 天", "30 days")], ["90", T("90 天", "90 days")]], "30")}</div>
    <div class="demo-label">${T("候选结构", "Candidate structures")}</div>
    <div class="demo-btns" id="sm-cands"></div>
    <div class="legs" id="sm-legs"></div>
    <div id="sm-chart"></div>
    <div class="demo-label">${T("希腊字母签名（每 1 份，× 100 股）", "Greek signature (per unit, × 100 shares)")}</div>
    <div id="sm-greeks"></div>
    <div class="demo-meta" id="sm-wins"></div>
    <p class="demo-tip">${T("试试：固定“看涨”，在三种波动率观点之间切换——Delta 一直为正，Gamma 和 Vega 的符号却跟着你的波动率观点翻转。再把期限从 7 天换到 90 天：同一个结构，短期的 Γ 和 Θ 更大，长期的 ν 更大。", "Try this: stay on “Bullish” and switch between the three volatility views — delta stays positive, but the signs of gamma and vega flip with your volatility view. Then change the horizon from 7 to 90 days: the same structure has bigger Γ and Θ short-dated, and bigger ν long-dated.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  function draw() {
    const list = CAT[`${dir}-${vol}`];
    if (pick >= list.length) pick = 0;
    $("#sm-cands").innerHTML = list.map((c, i) => `<button type="button" class="demo-btn${i === pick ? " on" : ""}" data-c="${i}">${en ? c[1] : c[0]}</button>`).join("");
    root.querySelectorAll("[data-c]").forEach((b) => b.addEventListener("click", () => { pick = +b.dataset.c; draw(); }));
    const [zh, eng, mk, wins, timeSpread] = list[pick];
    const legs = mk(days);
    $("#sm-legs").innerHTML = legs.map((l) => l.type === "stock"
      ? `<div class="leg"><span class="side-long">${T("持有", "Own")}</span> 100 ${T("股 XYZ @ 100", "XYZ shares @ 100")}</div>`
      : `<div class="leg"><span class="${l.side === "long" ? "side-long" : "side-short"}">${l.side === "long" ? T("买入", "Buy") : T("卖出", "Sell")}${l.qty > 1 ? " ×" + l.qty : ""}</span> ${Math.round(l.T * 365)}${T(" 天", "-day")} ${l.K} ${l.type === "call" ? T("看涨", "call") : T("看跌", "put")} <span class="demo-meta" style="margin:0">@ ${l.premium.toFixed(2)}</span></div>`).join("");
    const labels = { expiry: T("到期时", "At expiry"), today: T(`过了 ${Math.round(days / 2)} 天`, `After ${Math.round(days / 2)} days`), spot: T("现价", "spot"), be: T("平衡", "BE") };
    if (timeSpread) {
      const at = (el) => (x) => O.netPLAt(legs, x, { elapsed: el / 365, sigma, r }) * 100;
      $("#sm-chart").innerHTML = lineChart({
        xmin: 75, xmax: 125, xlabel: T("XYZ 价格", "XYZ price"), ylabel: T("盈亏（美元）", "P&L ($)"),
        series: [{ f: at(0), cls: 5, dashed: true, label: T("今天", "Today") }, { f: at(days / 2), cls: 1, dashed: true, label: labels.today }, { f: at(days), cls: 0, label: T("近期到期时（远期腿按 BS 估值）", "At the near expiry (far leg valued with BS)") }],
        hlines: [{ y: 0 }], markers: [{ x: S0, label: "S" }],
      });
    } else {
      $("#sm-chart").innerHTML = payoffChart({ legs, lo: 75, hi: 125, spot: S0, mult: 100, today: { elapsed: days / 2 / 365, sigma, r }, xlabel: T("XYZ 价格", "XYZ price"), ylabel: T("盈亏（美元）", "P&L ($)"), labels }).html;
    }
    const g = O.positionGreeks(legs, S0, { elapsed: 0, sigma, r });
    const tag = (name, x, d) => { const s = Math.abs(x) < 0.0005 * (name === "Δ" ? 10 : 1) ? "≈0" : x > 0 ? "+" : "−"; return [name + " " + s, (x >= 0 ? "+" : "−") + Math.abs(x * 100).toFixed(d), s === "+" ? "pos" : s === "−" ? "neg" : ""]; };
    $("#sm-greeks").innerHTML = stats([tag("Δ", g.delta, 1), tag("Γ", g.gamma, 2), tag("Θ", g.theta, 2), tag("ν", g.vega, 2)]);
    $("#sm-wins").textContent = T("最有利的情形：", "Wins with: ") + (en ? wins[1] : wins[0]) + (vol === "short" ? T("。卖出波动率的结构：平时小赚，大波动时亏损集中。", ". A short-volatility structure: small, frequent gains; losses concentrated in big moves.") : vol === "long" ? T("。买入波动率的结构：每天付 Θ，靠大波动回本。", ". A long-volatility structure: pays theta daily, needs a big move to pay off.") : T("。时间价差：同时交易两个到期日的隐含波动率。", ". A time spread: trades the implied volatility of two expiries at once."));
  }
  onSeg(root, "sm-dir", (x) => { dir = x; pick = 0; draw(); });
  onSeg(root, "sm-vol", (x) => { vol = x; pick = 0; draw(); });
  onSeg(root, "sm-h", (x) => { days = +x; draw(); });
  draw();
}
