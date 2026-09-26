// Main demo for lesson put-call-parity: parity explorer + violation finder.
// Type in (or preset) a call and a put quote; see both sides of C + Ke^{-rT} = P + Se^{-qT}, the implied forward,
// implied dividend/borrow yield and implied vols, and — if the gap beats trading frictions — the conversion or reversal.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const inp = (id, label) => `<div class="demo-field"><label class="demo-label" for="${id}">${label}</label><input class="demo-inp" id="${id}" type="number" step="0.01" min="0"></div>`;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("平价探测器：输入一对看涨与看跌报价", "Parity explorer: enter a call and a put quote")}</div>
    <div class="demo-grid">
      ${slider("pp-s", T("现价 S", "Spot S"), 80, 120, 0.5, 100)}
      ${slider("pp-k", T("行权价 K", "Strike K"), 80, 120, 1, 100)}
      ${slider("pp-t", T("到期天数", "Days to expiry"), 5, 730, 1, 30)}
      ${slider("pp-r", T("利率 r", "Rate r"), 0, 8, 0.25, 4)}
      ${slider("pp-q", T("已知股息率 q", "Known dividend yield q"), 0, 6, 0.25, 0)}
      ${slider("pp-c", T("交易摩擦（每组、每股）", "Trading frictions (per set, per share)"), 0, 0.5, 0.01, 0.04)}
    </div>
    <div class="demo-grid">${inp("pp-cq", T("看涨报价 C", "Call quote C"))}${inp("pp-pq", T("看跌报价 P", "Put quote P"))}</div>
    <div class="demo-btns">
      <button class="demo-btn" data-pp="fair">${T("公平报价（σ = 20%）", "Fair quotes (σ = 20%)")}</button>
      <button class="demo-btn" data-pp="crich">${T("看涨贵了（2.60）", "Rich call (2.60)")}</button>
      <button class="demo-btn" data-pp="ccheap">${T("看涨便宜了（2.30）", "Cheap call (2.30)")}</button>
      <button class="demo-btn" data-pp="htb">${T("难借券股票（费率 10%）", "Hard-to-borrow stock (10% fee)")}</button>
      <button class="demo-btn" data-pp="year">${T("小凯的 1 年期", "Kai's 1-year pair")}</button>
    </div>
    <div class="demo-math" id="pp-f"></div>
    <div id="pp-stats"></div>
    <div id="pp-trade"></div>
    <div id="pp-chart"></div>
    <p class="demo-tip">${T("试试：点“难借券股票”。看上去有 0.82 的“套利”，但隐含股息率正好是 10%——那就是借券费。把“已知股息率”拉到 10%，缺口消失。", "Try this: press “Hard-to-borrow stock”. It looks like a $0.82 arbitrage, but the implied yield is exactly 10% — the borrow fee. Slide the known yield to 10% and the gap vanishes.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  let env = null;
  const val = (id) => parseFloat($("#" + id).value);
  const setQ = (c, p) => { $("#pp-cq").value = c.toFixed(2); $("#pp-pq").value = p.toFixed(2); calc(); };
  const fair = (qq) => {
    const o = { S: env.S, K: env.K, T: env.Tm, r: env.r, q: qq ?? env.q, sigma: 0.2 };
    return [O.bsPrice({ ...o, type: "call" }), O.bsPrice({ ...o, type: "put" })];
  };
  const calc = () => {
    if (!env) return;
    const { S, K, Tm, r, q, fr } = env, C = val("pp-cq"), P = val("pp-pq");
    if (!isFinite(C) || !isFinite(P)) return;
    const pvk = K * Math.exp(-r * Tm), sq = S * Math.exp(-q * Tm);
    const left = C + pvk, right = P + sq, gap = left - right;
    const Fimp = K + Math.exp(r * Tm) * (C - P);
    const inner = C - P + pvk;
    const qimp = inner > 0 ? -Math.log(inner / S) / Tm : NaN;
    const ivc = O.impliedVol(C, { S, K, T: Tm, r, q, type: "call" }), ivp = O.impliedVol(P, { S, K, T: Tm, r, q, type: "put" });
    $("#pp-f").innerHTML = tex(String.raw`\underbrace{C + Ke^{-rT}}_{${C.toFixed(2)} + ${pvk.toFixed(2)} \,=\, ${left.toFixed(2)}} \quad\text{vs}\quad \underbrace{P + Se^{-qT}}_{${P.toFixed(2)} + ${sq.toFixed(2)} \,=\, ${right.toFixed(2)}}`, true)
      + tex(String.raw`F_{\text{${T("隐含", "implied")}}} = K + e^{rT}(C - P) = ${K} + ${Math.exp(r * Tm).toFixed(4)} \times (${(C - P).toFixed(2)}) = ${Fimp.toFixed(2)}`, true);
    const pct = (x) => (isFinite(x) ? (Math.abs(x) < 0.0005 ? "0.0%" : (x * 100).toFixed(1) + "%") : "–");
    $("#pp-stats").innerHTML = stats([
      [T("缺口（左 − 右）", "Gap (left − right)"), (gap >= 0 ? "+" : "−") + "$" + Math.abs(gap).toFixed(2), Math.abs(gap) > fr ? "neg" : "pos"],
      [T("隐含远期", "Implied forward"), "$" + Fimp.toFixed(2), "acc"],
      [T("隐含股息/借券率", "Implied dividend/borrow yield"), pct(qimp)],
      [T("看涨隐含波动率", "Call implied vol"), pct(ivc)],
      [T("看跌隐含波动率", "Put implied vol"), pct(ivp)],
    ]);
    let html;
    if (Math.abs(gap) <= fr) {
      html = `<div class="demo-log ok">${T("缺口在交易摩擦之内：平价成立（在成本范围内），没有可做的套利。", "The gap is inside trading frictions: parity holds within costs, nothing to harvest.")}</div>`;
    } else if (gap > 0) {
      html = `<div class="demo-log bad"><b>${T("看涨一侧太贵 → 转换（conversion）", "Call side too rich → conversion")}</b></div>
        <table><thead><tr><th>${T("腿", "Leg")}</th><th>${T("今天", "Today")}</th><th>${T("到期", "Expiry")}</th></tr></thead><tbody>
        <tr><td>${T("卖出看涨", "Sell the call")}</td><td>+${C.toFixed(2)}</td><td rowspan="3">${T("股票 + 看跌 − 看涨 = 正好 K", "stock + put − call = exactly K")} = ${K}</td></tr>
        <tr><td>${T("买入看跌", "Buy the put")}</td><td>−${P.toFixed(2)}</td></tr>
        <tr><td>${T("买入股票（股息再投资）", "Buy the stock (dividends reinvested)")}</td><td>−${sq.toFixed(2)}</td></tr>
        <tr><td>${T("借入 K 的现值", "Borrow PV(K)")}</td><td>+${pvk.toFixed(2)}</td><td>−${K}</td></tr>
        <tr class="hl"><td><b>${T("合计（扣摩擦前 / 后）", "Net (before / after frictions)")}</b></td><td><b>+${gap.toFixed(2)} / +${(gap - fr).toFixed(2)}</b></td><td>0</td></tr></tbody></table>`;
    } else {
      html = `<div class="demo-log bad"><b>${T("看跌一侧太贵 → 反转换（reversal）", "Put side too rich → reversal")}</b></div>
        <table><thead><tr><th>${T("腿", "Leg")}</th><th>${T("今天", "Today")}</th><th>${T("到期", "Expiry")}</th></tr></thead><tbody>
        <tr><td>${T("买入看涨", "Buy the call")}</td><td>−${C.toFixed(2)}</td><td rowspan="3">${T("看涨 − 看跌 − 股票 = 正好 −K", "call − put − stock = exactly −K")}</td></tr>
        <tr><td>${T("卖出看跌", "Sell the put")}</td><td>+${P.toFixed(2)}</td></tr>
        <tr><td>${T("卖空股票（需要借券！）", "Short the stock (needs a borrow!)")}</td><td>+${sq.toFixed(2)}</td></tr>
        <tr><td>${T("借出 K 的现值", "Lend PV(K)")}</td><td>−${pvk.toFixed(2)}</td><td>+${K}</td></tr>
        <tr class="hl"><td><b>${T("合计（扣摩擦前 / 后）", "Net (before / after frictions)")}</b></td><td><b>+${(-gap).toFixed(2)} / +${(-gap - fr).toFixed(2)}</b></td><td>0</td></tr></tbody></table>
        ${qimp > q + 0.01 ? `<div class="demo-log warn">${T("注意：隐含股息/借券率比已知股息率高出 ", "Careful: the implied yield exceeds the known dividend yield by ")}${((qimp - q) * 100).toFixed(1)}${T(" 个百分点。卖空这只股票的借券费如果有这么高，这个“套利”就不存在。", " points. If borrowing the stock costs that much, this “arbitrage” is not there.")}</div>` : ""}`;
    }
    $("#pp-trade").innerHTML = html;
    $("#pp-chart").innerHTML = lineChart({
      xmin: 80, xmax: 120, xlabel: T("行权价 K", "Strike K"), ylabel: "C − P",
      series: [{ f: (k) => sq - k * Math.exp(-r * Tm), cls: 0, label: T("平价线：各行权价上 C − P 的无套利值", "parity line: the no-arbitrage C − P at each strike") }],
      hlines: [{ y: 0 }],
      points: [{ x: K, y: C - P, cls: Math.abs(gap) > fr ? 2 : 3, label: T("你的报价 ", "your quotes ") + (C - P).toFixed(2) }],
    });
  };
  const run = bindSliders(root, { "pp-s": (x) => "$" + x, "pp-k": (x) => "$" + x, "pp-t": (x) => x + T(" 天", " days"), "pp-r": (x) => x + "%", "pp-q": (x) => x + "%", "pp-c": (x) => "$" + (+x).toFixed(2) }, (v) => {
    env = { S: v["pp-s"], K: v["pp-k"], Tm: v["pp-t"] / 365, r: v["pp-r"] / 100, q: v["pp-q"] / 100, fr: v["pp-c"] };
    if (!isFinite(val("pp-cq"))) { const [c, p] = fair(); setQ(c, p); } else calc();
  });
  ["pp-cq", "pp-pq"].forEach((id) => $("#" + id).addEventListener("input", calc));
  const setS = (vals) => { for (const [id, x] of Object.entries(vals)) $("#" + id).value = x; run(); };
  root.querySelectorAll("[data-pp]").forEach((b) => b.addEventListener("click", () => {
    const k = b.dataset.pp;
    if (k === "fair") { const [c, p] = fair(); setQ(c, p); return; }
    const kai = { "pp-s": 100, "pp-k": 100, "pp-t": 30, "pp-r": 4, "pp-q": 0 };
    if (k === "year") kai["pp-t"] = 365;
    setS(kai);
    if (k === "crich") setQ(2.60, 2.12);
    else if (k === "ccheap") setQ(2.30, 2.12);
    else if (k === "htb") { const [c, p] = fair(0.10); setQ(c, p); }
    else { const [c, p] = fair(); setQ(c, p); }
  }));
}
