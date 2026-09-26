// Inline demo for lesson arbitrage-bounds: the allowed band for a call price vs the stock price,
// the model price inside it, and a draggable "quote" that is judged against the walls.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const K = 100, r = 0.04;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("看涨价格被允许待在哪里？", "Where is a call price allowed to live?")}</div>
    <div class="demo-grid">
      ${slider("abr-s", T("现价 S", "Spot S"), 20, 180, 1, 100)}
      ${slider("abr-t", T("到期天数", "Days to expiry"), 1, 730, 1, 30)}
      ${slider("abr-v", T("模型用的波动率 σ", "Model volatility σ"), 5, 80, 1, 20)}
      ${slider("abr-q", T("市场报价（每股）", "Market quote (per share)"), 0, 110, 0.05, 2.45)}
    </div>
    <div class="demo-btns"><button class="demo-btn" data-abr="fair">${T("报价 = 模型价", "Quote = model price")}</button><button class="demo-btn" data-abr="low">${T("报价跌破地板", "Quote below the floor")}</button><button class="demo-btn" data-abr="high">${T("报价高过股价", "Quote above the stock")}</button></div>
    <div class="demo-math" id="abr-f"></div>
    <div id="abr-verdict"></div>
    <div id="abr-chart"></div>
    <p class="demo-tip">${T("试试：把天数拉到 730，带子在平值附近变得更宽；再把 S 拉到 160，模型价几乎贴着地板——深度实值的期权几乎没有时间价值。", "Try this: stretch days to 730 and the band widens near the money; push S to 160 and the model price hugs the floor — a deep in-the-money option has almost no time value.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  let last = null;
  const draw = (v) => {
    const S = v["abr-s"], Tm = v["abr-t"] / 365, sigma = v["abr-v"] / 100, quote = v["abr-q"];
    const pvk = K * Math.exp(-r * Tm), lo = Math.max(S - pvk, 0), hi = S;
    const model = O.bsPrice({ S, K, T: Tm, r, sigma, type: "call" });
    last = { S, lo, hi, model };
    $("#abr-f").innerHTML = tex(String.raw`\max(S - Ke^{-rT},0) = \max(${S} - ${pvk.toFixed(2)},\,0) = ${lo.toFixed(2)} \;\le\; C \;\le\; S = ${S}`, true);
    let html;
    if (quote < lo - 1e-9) {
      const edge = lo - quote;
      html = `<div class="demo-log bad"><div>${T("报价低于地板 ", "Quote is below the floor by ")}$${edge.toFixed(2)}. ${T("套利：买入看涨、卖空 1 股、把 ", "Arbitrage: buy the call, short one share, lend ")}$${pvk.toFixed(2)}${T(" 存到到期。今天净收 ", " until expiry. Net cash today ")}${tex(String.raw`-${quote.toFixed(2)} + ${S} - ${pvk.toFixed(2)} = +${edge.toFixed(2)}`)}${T("，到期不欠任何钱。", "; you owe nothing at expiry.")}</div></div>`;
    } else if (quote > hi + 1e-9) {
      const edge = quote - hi;
      html = `<div class="demo-log bad"><div>${T("报价高于股价 ", "Quote is above the stock by ")}$${edge.toFixed(2)}. ${T("套利：卖出看涨、买入 1 股。今天净收 ", "Arbitrage: sell the call, buy one share. Net cash today ")}${tex(String.raw`${quote.toFixed(2)} - ${S} = +${edge.toFixed(2)}`)}${T("；被行权就交出这股，还能收到行权价。", "; if exercised you deliver the share and even receive the strike.")}</div></div>`;
    } else {
      html = `<div class="demo-log ok"><div>${T("报价在带子里：这两堵墙挡不住它。模型价（σ = ", "The quote is inside the band: these walls can't object. Model price (σ = ")}${v["abr-v"]}%${T("）是 ", ") is ")}$${model.toFixed(2)}${T("——但带子本身从 ", " — but the band itself runs from ")}$${lo.toFixed(2)}${T(" 一直到 ", " all the way to ")}$${hi.toFixed(2)}.</div></div>`;
    }
    $("#abr-verdict").innerHTML = html;
    $("#abr-chart").innerHTML = lineChart({
      xmin: 0, xmax: 200, ymin: 0, ymax: 120, xlabel: T("股价 S（K = 100，r = 4%）", "Stock price S (K = 100, r = 4%)"), ylabel: T("看涨价格", "Call price"),
      series: [
        { f: (x) => x, cls: 2, dashed: true, label: T("上墙 C ≤ S", "upper wall C ≤ S") },
        { f: (x) => Math.max(x - pvk, 0), cls: 3, dashed: true, label: T("下墙 C ≥ S − PV(K)", "lower wall C ≥ S − PV(K)") },
        { f: (x) => O.bsPrice({ S: x, K, T: Tm, r, sigma, type: "call" }), cls: 0, label: T("模型价", "model price") },
      ],
      markers: [{ x: S, label: "S" }],
      points: [{ x: S, y: quote, cls: quote < lo - 1e-9 || quote > hi + 1e-9 ? 2 : 3, label: T("报价 ", "quote ") + "$" + quote.toFixed(2) }],
    });
  };
  const run = bindSliders(root, { "abr-s": (x) => "$" + x, "abr-t": (x) => x + T(" 天", " days"), "abr-v": (x) => x + "%", "abr-q": (x) => "$" + (+x).toFixed(2) }, draw);
  root.querySelectorAll("[data-abr]").forEach((b) => b.addEventListener("click", () => {
    if (!last) return;
    const k = b.dataset.abr;
    const val = k === "fair" ? last.model : k === "low" ? Math.max(last.lo - 0.3, 0) : Math.min(last.hi + 3, 110);
    $("#abr-q").value = (Math.round(val / 0.05) * 0.05).toFixed(2);
    run();
  }));
}
