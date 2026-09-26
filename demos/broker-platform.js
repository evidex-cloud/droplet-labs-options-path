// Main demo for lesson broker-platform: all-in cost of your trading style at two brokers
// (commission + fees + the part of the spread you pay), with the break-even fill improvement.
import { seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

const PRESETS = {
  kai: { legs: 1, ct: 1, tpy: 12, w: 0.02, close: 50 },
  spread: { legs: 4, ct: 5, tpy: 48, w: 0.05, close: 100 },
  active: { legs: 2, ct: 10, tpy: 240, w: 0.05, close: 60 },
};

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const money = (x, d = 2) => "$" + x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("全部成本计算器：你的交易风格在两家券商各花多少", "All-in cost calculator: what your style costs at two brokers")}</div>
    <div class="demo-row">${seg("bpc-p", [["kai", T("小凯：每月一张备兑", "Kai: one covered call a month")], ["spread", T("价差交易者：铁鹰 ×5", "Spread trader: condor ×5")], ["active", T("活跃短线：双腿 ×10", "Active short-dated: 2 legs ×10")]], "kai")}</div>
    <div class="demo-label">${T("你的交易风格", "Your trading style")}</div>
    <div class="demo-grid">
      ${slider("bpc-legs", T("每笔交易的腿数", "Legs per trade"), 1, 4, 1, 1)}
      ${slider("bpc-ct", T("每条腿的合约张数", "Contracts per leg"), 1, 20, 1, 1)}
      ${slider("bpc-tpy", T("每年开仓次数", "Trades opened per year"), 1, 500, 1, 12)}
      ${slider("bpc-w", T("每条腿的买卖价差（每股）", "Quote width per leg (per share)"), 0.01, 0.5, 0.01, 0.02)}
      ${slider("bpc-x", T("到期前平仓的比例", "Share of trades closed before expiry"), 0, 100, 5, 50)}
      ${slider("bpc-f", T("交易所与监管费（每张每边，示意）", "Fees per contract per side (illustrative)"), 0, 0.2, 0.01, 0.05)}
    </div>
    <div class="demo-grid">
      <div class="demo-block"><div class="demo-label"><b>${T("券商 A", "Broker A")}</b></div>
        ${slider("bpc-ca", T("佣金（每张每边）", "Commission (per contract per side)"), 0, 1, 0.05, 0)}
        ${slider("bpc-ha", T("成交位置：0 = 中间价，100 = 对手价", "Fill: 0 = mid, 100 = natural (far side)"), 0, 100, 5, 60)}</div>
      <div class="demo-block"><div class="demo-label"><b>${T("券商 B", "Broker B")}</b></div>
        ${slider("bpc-cb", T("佣金（每张每边）", "Commission (per contract per side)"), 0, 1, 0.05, 0.65)}
        ${slider("bpc-hb", T("成交位置：0 = 中间价，100 = 对手价", "Fill: 0 = mid, 100 = natural (far side)"), 0, 100, 5, 20)}</div>
    </div>
    <div class="demo-math" id="bpc-f1"></div>
    <div id="bpc-bars"></div>
    <div id="bpc-stats"></div>
    <div class="demo-math" id="bpc-f2"></div>
    <p class="demo-tip">${T("试试：在“小凯”预设下，把 A 的成交位置从 60 调到 0——A 每年的成本从约 12 美元降到 1 美元以下，动的是成交价，不是佣金。再切到“价差交易者”，看红色（价差）怎样压过蓝色（佣金）。佣金与费率都是示意值，请以你的券商费率表为准。", "Try this: with the Kai preset, move broker A's fill from 60 to 0 — A's yearly cost falls from about $12 to under $1, and it was the fill, not the commission, that moved. Then switch to the spread trader and watch the red (spread) dwarf the blue (commission). Commissions and fees here are illustrative; use your broker's schedule.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const cost = (v, c, fillPct) => {
    const N = v["bpc-legs"] * v["bpc-ct"], sides = 1 + v["bpc-x"] / 100, h = (fillPct / 100) * v["bpc-w"] / 2;
    const comm = N * sides * c, fees = N * sides * v["bpc-f"], spr = N * sides * 100 * h;
    return { N, sides, h, comm, fees, spr, total: comm + fees + spr };
  };
  const draw = (v) => {
    const A = cost(v, v["bpc-ca"], v["bpc-ha"]), B = cost(v, v["bpc-cb"], v["bpc-hb"]), n = v["bpc-tpy"];
    const yd = Math.max(A.total, B.total) * n < 1000 ? 2 : 0; // cents for small yearly bills, so the three numbers add up
    $("#bpc-f1").innerHTML = tex(String.raw`C_{\text{trade}} = N\,(1 + x)\,(c + f + 100\,h)`, true)
      + tex(String.raw`N = ${v["bpc-legs"]} \times ${v["bpc-ct"]} = ${A.N},\; 1 + x = ${A.sides.toFixed(2)}`, true)
      + tex(String.raw`\text{A: } ${A.N} \times ${A.sides.toFixed(2)} \times (${v["bpc-ca"].toFixed(2)} + ${v["bpc-f"].toFixed(2)} + 100 \times ${A.h.toFixed(4)}) = \$${A.total.toFixed(2)}`, true)
      + tex(String.raw`\text{B: } ${B.N} \times ${B.sides.toFixed(2)} \times (${v["bpc-cb"].toFixed(2)} + ${v["bpc-f"].toFixed(2)} + 100 \times ${B.h.toFixed(4)}) = \$${B.total.toFixed(2)}`, true);
    const max = Math.max(A.total, B.total, 1e-9);
    const bar = (label, X) => `<div class="bar2"><span class="lab" style="width:90px">${label}</span><span class="track" style="display:flex">
      <span style="display:block;height:100%;width:${(X.comm / max) * 100}%;background:var(--orange)"></span>
      <span style="display:block;height:100%;width:${(X.fees / max) * 100}%;background:var(--muted)"></span>
      <span style="display:block;height:100%;width:${(X.spr / max) * 100}%;background:var(--red)"></span></span><span class="val">${money(X.total)}</span></div>`;
    $("#bpc-bars").innerHTML = `<div class="demo-label">${T("每笔交易的全部成本：蓝 = 佣金，灰 = 费用，红 = 付出的价差", "All-in cost per trade: blue = commission, gray = fees, red = spread paid")}</div>` + bar(T("券商 A", "Broker A"), A) + bar(T("券商 B", "Broker B"), B);
    const cheaper = A.total < B.total - 1e-9 ? T("A 更便宜", "A is cheaper") : B.total < A.total - 1e-9 ? T("B 更便宜", "B is cheaper") : T("打平", "a tie");
    $("#bpc-stats").innerHTML = stats([
      [T("A 每年", "A per year"), money(A.total * n, yd), A.total <= B.total ? "pos" : "neg"],
      [T("B 每年", "B per year"), money(B.total * n, yd), B.total <= A.total ? "pos" : "neg"],
      [T("每年差额", "Yearly difference"), money(Math.abs(A.total - B.total) * n, yd), "acc"],
      [T("A 中价差占比", "Spread share of A's cost"), A.total > 0 ? ((A.spr / A.total) * 100).toFixed(0) + "%" : "0%"],
      [T("结论", "Verdict"), cheaper],
    ]);
    const dc = v["bpc-cb"] - v["bpc-ca"], dh = A.h - B.h;
    $("#bpc-f2").innerHTML = tex(String.raw`\delta^{*} = \frac{c_B - c_A}{100} = \frac{${dc.toFixed(2)}}{100} = ${(dc / 100).toFixed(4)} \text{ per share}`, true)
      + tex(String.raw`\text{actual fill gap } h_A - h_B = ${dh.toFixed(4)}`, true)
      + `<p class="demo-meta">${T(dh > dc / 100 + 1e-12 ? "B 的成交比 A 好出的部分，超过了 B 多收的佣金。" : dh < dc / 100 - 1e-12 ? "B 的成交优势不足以抵消它多收的佣金。" : "成交差距正好抵消佣金差。", dh > dc / 100 + 1e-12 ? "B's better fills outweigh the extra commission it charges." : dh < dc / 100 - 1e-12 ? "B's better fills are not enough to pay for its extra commission." : "The fill gap exactly offsets the commission gap.")}</p>`;
  };
  const spec = {
    "bpc-legs": (x) => String(x), "bpc-ct": (x) => String(x), "bpc-tpy": (x) => String(x), "bpc-w": (x) => money(x), "bpc-x": (x) => x + "%",
    "bpc-f": (x) => money(x), "bpc-ca": (x) => money(x), "bpc-cb": (x) => money(x), "bpc-ha": (x) => String(x), "bpc-hb": (x) => String(x),
  };
  const run = bindSliders(root, spec, draw);
  onSeg(root, "bpc-p", (k) => {
    const p = PRESETS[k];
    $("#bpc-legs").value = p.legs; $("#bpc-ct").value = p.ct; $("#bpc-tpy").value = p.tpy; $("#bpc-w").value = p.w; $("#bpc-x").value = p.close;
    run();
  });
}
