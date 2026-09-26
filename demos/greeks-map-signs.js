// Inline demo for lesson greeks-map: the sign table. Pick one of five positions on the 30-day XYZ 100 strike
// and read its Greeks per contract, what each sign means in words, and the shape (today vs expiry).
import * as O from "./_opt.js";
import { payoffChart, seg, onSeg, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let pos = "lc";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("符号表：五种头寸，五个仪表", "The sign table: five positions, five gauges")}</div>
    ${seg("gms-pos", [["lc", T("买看涨", "Long call")], ["sc", T("卖看涨", "Short call")], ["lp", T("买看跌", "Long put")], ["sp", T("卖看跌", "Short put")], ["st", T("100 股股票", "100 shares")]], pos)}
    <div id="gms-tab" style="margin-top:.6rem"></div>
    <div id="gms-chart"></div>
    <p class="demo-tip">${T("看什么：Gamma 和 Theta 几乎总是一正一负——买入期权的人每天付 Theta，换来 Gamma；卖出的人正好相反。股票只有 Delta，其余四项全是 0。", "What to notice: gamma and theta almost always carry opposite signs — the option buyer pays theta every day to own gamma, the seller the reverse. Stock has delta and nothing else.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const base = { S: 100, K: 100, T: 30 / 365, r: 0.04, sigma: 0.2 };
  const draw = () => {
    const isStock = pos === "st";
    const type = pos === "lc" || pos === "sc" ? "call" : "put";
    const s = pos === "sc" || pos === "sp" ? -1 : 1;
    const g = isStock ? { delta: 1, gamma: 0, theta: 0, vega: 0, rho: 0, price: 100 } : O.greeks({ ...base, type });
    const k = s * 100;
    const rows = [
      ["Δ", g.delta * k, T("股价涨 1 美元，头寸赚/亏多少（美元）", "Dollars made per +$1 in XYZ"), (x) => x > 0 ? T("希望上涨", "wants a rise") : T("希望下跌", "wants a fall")],
      ["Γ", g.gamma * k, T("股价涨 1 美元，Delta 变多少（股）", "Change in delta (shares) per +$1"), (x) => x > 0 ? T("大波动两边都受益", "gains from big moves either way") : T("大波动两边都受伤", "hurt by big moves either way")],
      ["Θ", g.theta * k, T("什么都不变，过一天赚/亏（美元）", "Dollars per calendar day, nothing else moving"), (x) => x > 0 ? T("时间站在你这边", "time is on your side") : T("每天付“租金”", "pays daily rent")],
      ["ν", g.vega * k, T("隐含波动率 +1 个点（美元）", "Dollars per +1 vol point of IV"), (x) => x > 0 ? T("希望波动率上升", "wants IV up") : T("希望波动率下降", "wants IV down")],
      ["ρ", g.rho * k, T("利率 +1%（美元）", "Dollars per +1% in rates"), (x) => x > 0 ? T("利率升有利", "helped by higher rates") : T("利率升不利", "hurt by higher rates")],
    ];
    const pill = (x) => Math.abs(x) < 1e-9 ? `<span class="pill">0</span>` : `<span class="pill ${x > 0 ? "ok" : "bad"}">${x > 0 ? "+" : "−"}</span>`;
    $("#gms-tab").innerHTML = `<table><thead><tr><th>${T("希腊字母", "Greek")}</th><th>${T("符号", "Sign")}</th><th>${T("每张合约", "Per contract")}</th><th>${T("单位", "Unit")}</th><th>${T("用大白话说", "In plain words")}</th></tr></thead><tbody>${rows.map(([n, x, u, f]) => `<tr><td>${tex(n === "ν" ? String.raw`\nu` : n === "Δ" ? String.raw`\Delta` : n === "Γ" ? String.raw`\Gamma` : n === "Θ" ? String.raw`\Theta` : String.raw`\rho`)}</td><td>${pill(x)}</td><td>${(x >= 0 ? "+" : "−") + Math.abs(x).toFixed(2)}</td><td><small>${u}</small></td><td>${Math.abs(x) < 1e-9 ? T("没有这项风险", "no exposure") : f(x)}</td></tr>`).join("")}</tbody></table>`;
    const legs = isStock
      ? [{ type: "stock", side: "long", entry: 100 }]
      : [{ type, side: s > 0 ? "long" : "short", K: 100, premium: g.price, T: base.T }];
    const pc = payoffChart({ legs, lo: 80, hi: 120, spot: 100, today: { elapsed: 0, sigma: 0.2, r: 0.04 }, mult: 100,
      xlabel: T("XYZ 价格", "XYZ price"), ylabel: T("每张盈亏（美元）", "P&L per contract ($)"),
      labels: { expiry: T("到期时", "At expiry"), today: T("今天（还剩 30 天）", "Today (30 days left)"), spot: T("现价", "spot"), be: T("盈亏平衡", "BE") } });
    $("#gms-chart").innerHTML = pc.html;
  };
  onSeg(root, "gms-pos", (v) => { pos = v; draw(); });
  draw();
}
