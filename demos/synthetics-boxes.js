// Main demo for lesson synthetics-boxes. Two tools:
//  (1) synthetic builder — pick a target, see the parity recipe, both costs today and both expiry payoffs;
//  (2) box-rate calculator — strike width, expiry and box price → implied interest rate vs a bill rate, and the arbitrage.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let tab = "syn", target = "stock";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("合成头寸与箱式价差工作台", "Synthetics & box-spread workbench")}</div>
    ${seg("sb-tab", [["syn", T("合成头寸", "Synthetic builder")], ["box", T("箱式价差利率", "Box-rate calculator")]], tab)}
    <div id="sb-syn">
      ${seg("sb-target", [["stock", T("多股票", "long stock")], ["short", T("空股票", "short stock")], ["call", T("多看涨", "long call")], ["put", T("多看跌", "long put")], ["sput", T("空看跌", "short put")], ["bill", T("国库券", "bill")]], target)}
      <div class="demo-grid">
        ${slider("sb-k", T("行权价 K", "Strike K"), 80, 120, 1, 100)}
        ${slider("sb-t", T("到期天数", "Days to expiry"), 7, 365, 1, 30)}
      </div>
      <div class="demo-math" id="sb-recipe"></div>
      <div id="sb-cost"></div>
      <div id="sb-chart"></div>
    </div>
    <div id="sb-box" style="display:none">
      <div class="demo-grid">
        ${slider("bx-k1", T("低行权价 K₁", "Lower strike K₁"), 50, 150, 5, 90)}
        ${slider("bx-k2", T("高行权价 K₂", "Upper strike K₂"), 55, 200, 5, 110)}
        ${slider("bx-t", T("到期天数", "Days to expiry"), 7, 1095, 1, 365)}
        ${slider("bx-p", T("箱体报价（占宽度 %）", "Box price (% of width)"), 85, 100, 0.01, 96.08)}
        ${slider("bx-r", T("你能借贷的利率", "Your borrow/lend rate"), 0, 8, 0.05, 4)}
      </div>
      <div class="demo-math" id="bx-f"></div>
      <div id="bx-stats"></div>
      <div id="bx-trade"></div>
      <div id="bx-chart"></div>
    </div>
    <p class="demo-tip">${T("试试：在“合成头寸”里选“多看涨”——股票 + 看跌 − 国库券的曲线和真正的看涨完全重合。再到“箱式价差利率”，把报价拖过公平价，看借钱和放钱的方向怎么翻转。", "Try this: in the builder pick “long call” — stock + put − bill lands exactly on the real call. Then in the box calculator drag the price across fair value and watch lending turn into borrowing.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const r = 0.04, sigma = 0.2, S = 100;
  // ---- synthetic builder ----
  const recipes = {
    stock: { tgt: "S", rec: String.raw`S = C - P + B`, legs: [[1, "call"], [-1, "put"], [1, "bill"]], name: T("多股票", "long stock") },
    short: { tgt: "-S", rec: String.raw`-S = P - C - B`, legs: [[-1, "call"], [1, "put"], [-1, "bill"]], name: T("空股票", "short stock") },
    call: { tgt: "C", rec: String.raw`C = S + P - B`, legs: [[1, "stock"], [1, "put"], [-1, "bill"]], name: T("多看涨", "long call") },
    put: { tgt: "P", rec: String.raw`P = C - S + B`, legs: [[1, "call"], [-1, "stock"], [1, "bill"]], name: T("多看跌", "long put") },
    sput: { tgt: "-P", rec: String.raw`-P = S - C - B`, legs: [[1, "stock"], [-1, "call"], [-1, "bill"]], name: T("空看跌（= 备兑看涨 − 国库券）", "short put (= covered call − bill)") },
    bill: { tgt: "B", rec: String.raw`B = S + P - C`, legs: [[1, "stock"], [1, "put"], [-1, "call"]], name: T("国库券（转换）", "bill (a conversion)") },
  };
  const legName = { call: T("看涨", "call"), put: T("看跌", "put"), stock: T("股票", "stock"), bill: T("国库券", "bill") };
  const drawSyn = (v) => {
    const K = v["sb-k"], Tm = v["sb-t"] / 365;
    const px = { call: O.bsPrice({ S, K, T: Tm, r, sigma, type: "call" }), put: O.bsPrice({ S, K, T: Tm, r, sigma, type: "put" }), stock: S, bill: K * Math.exp(-r * Tm) };
    const pay = { call: (x) => Math.max(x - K, 0), put: (x) => Math.max(K - x, 0), stock: (x) => x, bill: () => K };
    const R = recipes[target];
    const synCost = R.legs.reduce((a, [s, l]) => a + s * px[l], 0);
    const direct = { stock: px.stock, short: -px.stock, call: px.call, put: px.put, sput: -px.put, bill: px.bill }[target];
    const directPay = { stock: pay.stock, short: (x) => -x, call: pay.call, put: pay.put, sput: (x) => -pay.put(x), bill: pay.bill }[target];
    const synPay = (x) => R.legs.reduce((a, [s, l]) => a + s * pay[l](x), 0);
    const terms = R.legs.map(([s, l]) => `${s > 0 ? "+" : "-"}\\,${px[l].toFixed(2)}`).join(" ");
    $("#sb-recipe").innerHTML = tex(R.rec, true) + tex(String.raw`\text{${T("今天的成本", "cost today")}}: ${terms} = ${synCost.toFixed(2)}\qquad (B = Ke^{-rT} = ${px.bill.toFixed(2)})`, true);
    $("#sb-cost").innerHTML = stats([
      [T("直接持有的成本", "Cost of the real thing"), (direct < 0 ? "−$" : "$") + Math.abs(direct).toFixed(2), "acc"],
      [T("合成的成本", "Cost of the synthetic"), (synCost < 0 ? "−$" : "$") + Math.abs(synCost).toFixed(2), "acc"],
      [T("差额", "Difference"), "$" + Math.abs(direct - synCost).toFixed(2)],
      [T("配方", "Recipe"), `<span style="display:block;font-size:.82rem;line-height:1.4;font-weight:600">${R.legs.map(([s, l]) => (s > 0 ? T("买 ", "long ") : T("卖 ", "short ")) + legName[l]).join(" + ")}</span>`],
    ]);
    $("#sb-chart").innerHTML = lineChart({
      xmin: 60, xmax: 140, xlabel: T("到期时 XYZ", "XYZ at expiry"), ylabel: T("到期价值", "Value at expiry"),
      series: [
        { f: directPay, cls: 0, label: T("目标：", "target: ") + R.name },
        { f: synPay, cls: 1, dashed: true, label: T("合成（平价配方）", "synthetic (parity recipe)") },
      ],
      markers: [{ x: K, label: "K" }],
    });
  };
  // ---- box calculator ----
  const drawBox = (v) => {
    let K1 = v["bx-k1"], K2 = v["bx-k2"];
    if (K2 <= K1) K2 = K1 + 5;
    const Tm = v["bx-t"] / 365, w = K2 - K1, price = (v["bx-p"] / 100) * w, rb = v["bx-r"] / 100;
    const fair = w * Math.exp(-rb * Tm), impl = -Math.log(price / w) / Tm;
    const legs = [["call", K1, 1], ["call", K2, -1], ["put", K2, 1], ["put", K1, -1]].map(([type, K, s]) => s * O.bsPrice({ S, K, T: Tm, r: rb, sigma, type }));
    $("#bx-f").innerHTML = tex(String.raw`r_{\text{box}} = -\frac{1}{T}\ln\frac{\text{${T("箱体价", "box price")}}}{K_2 - K_1} = -\frac{1}{${Tm.toFixed(3)}}\ln\frac{${price.toFixed(2)}}{${w}} = ${(impl * 100).toFixed(2)}\%`, true)
      + tex(String.raw`\text{${T("公平价", "fair value")}}: (K_2-K_1)e^{-rT} = ${w}\,e^{-${rb.toFixed(4)}\times ${Tm.toFixed(3)}} = ${fair.toFixed(2)} \;=\; \underbrace{${(legs[0] + legs[1]).toFixed(2)}}_{\text{${T("看涨价差", "call spread")}}} + \underbrace{${(legs[2] + legs[3]).toFixed(2)}}_{\text{${T("看跌价差", "put spread")}}}`, true);
    $("#bx-stats").innerHTML = stats([
      [T("到期必付", "Pays at expiry"), "$" + w.toFixed(0) + T("（每张 $", " ($") + (w * 100).toLocaleString("en-US") + (en ? " per box)" : "）")],
      [T("报价", "Quoted price"), "$" + price.toFixed(2)],
      [T("隐含箱体利率", "Implied box rate"), (impl * 100).toFixed(2) + "%", "acc"],
      [T("你的利率", "Your rate"), (rb * 100).toFixed(2) + "%"],
    ]);
    const edge = fair - price;
    let html;
    if (Math.abs(edge) < 0.005) html = `<div class="demo-log ok">${T("箱体利率等于你的利率：买箱体（放钱）和卖箱体（借钱）都没有额外好处。", "The box rate equals your rate: buying (lending) or selling (borrowing) the box gains nothing extra.")}</div>`;
    else if (edge > 0) html = `<div class="demo-log bad"><b>${T("箱体便宜 → 买入箱体（以 ", "Box is cheap → buy it (lend at ")}${(impl * 100).toFixed(2)}%${T(" 放钱），同时按你的利率借钱", "), and borrow at your rate")}</b><div>${T("今天：", "Today: ")}${tex(String.raw`-${price.toFixed(2)} + ${fair.toFixed(2)} = +${edge.toFixed(2)}`)} · ${T("到期：箱体付 ", "At expiry: the box pays ")}${w}${T("，还款 ", ", repay ")}${w} → 0 · ${T("每张 ", "per box ")}+$${(edge * 100).toFixed(0)}</div></div>`;
    else html = `<div class="demo-log bad"><b>${T("箱体贵 → 卖出箱体（以 ", "Box is rich → sell it (borrow at ")}${(impl * 100).toFixed(2)}%${T(" 借钱），同时按你的利率放钱", "), and lend at your rate")}</b><div>${T("今天：", "Today: ")}${tex(String.raw`+${price.toFixed(2)} - ${fair.toFixed(2)} = +${(-edge).toFixed(2)}`)} · ${T("到期：收回 ", "At expiry: collect ")}${w}${T("，付给箱体买方 ", ", pay the box holder ")}${w} → 0 · ${T("每张 ", "per box ")}+$${(-edge * 100).toFixed(0)}</div></div>`;
    if (Math.abs(edge) >= 0.005) html += `<div class="demo-log warn">${T("前提：箱体用的是欧式、现金结算的期权。美式期权的空头腿可能被提前指派（见本课第 ⑤ 部分）。", "Only if the box uses European, cash-settled options. On American options a short leg can be assigned early (part ⑤ of the lesson).")}</div>`;
    $("#bx-trade").innerHTML = html;
    $("#bx-chart").innerHTML = lineChart({
      xmin: Math.max(1, K1 - 40), xmax: K2 + 40, ymin: 0, ymax: w * 1.4, xlabel: T("到期时的标的价格", "Underlying at expiry"), ylabel: T("到期收益", "Payoff at expiry"),
      series: [
        { f: (x) => Math.max(x - K1, 0) - Math.max(x - K2, 0), cls: 0, dashed: true, label: T("牛市看涨价差", "bull call spread") },
        { f: (x) => Math.max(K2 - x, 0) - Math.max(K1 - x, 0), cls: 1, dashed: true, label: T("熊市看跌价差", "bear put spread") },
        { f: () => w, cls: 3, label: T("箱体 = 宽度", "box = width") },
      ],
      markers: [{ x: K1, label: "K₁" }, { x: K2, label: "K₂" }],
    });
  };
  const runSyn = bindSliders(root, { "sb-k": (x) => "$" + x, "sb-t": (x) => x + T(" 天", " days") }, drawSyn);
  bindSliders(root, { "bx-k1": (x) => "$" + x, "bx-k2": (x) => "$" + x, "bx-t": (x) => x + T(" 天", " days"), "bx-p": (x) => (+x).toFixed(2) + "%", "bx-r": (x) => (+x).toFixed(2) + "%" }, drawBox);
  onSeg(root, "sb-target", (v) => { target = v; runSyn(); });
  onSeg(root, "sb-tab", (v) => { tab = v; $("#sb-syn").style.display = v === "syn" ? "" : "none"; $("#sb-box").style.display = v === "box" ? "" : "none"; });
}
