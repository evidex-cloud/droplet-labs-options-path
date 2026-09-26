// Main demo for lesson forwards-carry: replicate a forward and arbitrage a mispriced one.
// Borrowing may cost more than lending, and shorting may cost a borrow fee, so the no-arbitrage
// forward is a band [reverse cash-and-carry, cash-and-carry]; a quote outside it gets the matching trade.
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("复制一张远期，再套利一张定错价的远期", "Replicate a forward, then arbitrage a mispriced one")}</div>
    <div class="demo-grid">
      ${slider("fc-s", T("现价 S", "Spot S"), 50, 150, 0.5, 100)}
      ${slider("fc-t", T("交割天数", "Days to delivery"), 1, 730, 1, 365)}
      ${slider("fc-r", T("借出利率 r", "Lending rate r"), 0, 10, 0.25, 4)}
      ${slider("fc-sp", T("借入比借出贵多少", "Borrowing spread over r"), 0, 3, 0.25, 0)}
      ${slider("fc-q", T("股息率 q", "Dividend yield q"), 0, 8, 0.25, 0)}
      ${slider("fc-b", T("借券费 b", "Stock borrow fee b"), 0, 30, 0.5, 0)}
      ${slider("fc-f", T("市场上的远期报价", "Quoted forward price"), 50, 180, 0.05, 106)}
    </div>
    <div class="demo-btns"><button class="demo-btn" data-fc="fair">${T("报价 = 公平价", "Quote = fair value")}</button><button class="demo-btn" data-fc="xyz">${T("小凯的 XYZ（1 年，报价 106）", "Kai's XYZ (1 year, quote 106)")}</button><button class="demo-btn" data-fc="htb">${T("难借券的股票（费率 10%）", "Hard-to-borrow stock (fee 10%)")}</button></div>
    <div class="demo-math" id="fc-f1"></div>
    <div id="fc-stats"></div>
    <div id="fc-trade"></div>
    <div id="fc-chart"></div>
    <p class="demo-tip">${T("试试：点“难借券的股票”——带子的下沿掉下去了：反向套利要付借券费，所以远期可以低于 ", "Try this: press “Hard-to-borrow stock” — the lower edge of the band drops: the reverse trade must pay the borrow fee, so the forward can sit below ")}${tex(String.raw`Se^{(r-q)T}`)}${T(" 而没人能套利。", " without anyone able to arbitrage it.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  let st = null;
  const draw = (v) => {
    const S = v["fc-s"], Tm = v["fc-t"] / 365, r = v["fc-r"] / 100, rb = r + v["fc-sp"] / 100, q = v["fc-q"] / 100, b = v["fc-b"] / 100, Fq = v["fc-f"];
    const fair = S * Math.exp((r - q) * Tm), up = S * Math.exp((rb - q) * Tm), lo = S * Math.exp((r - q - b) * Tm);
    st = { fair, S, Tm };
    $("#fc-f1").innerHTML = tex(String.raw`F = S\,e^{(r-q)T} = ${S}\,e^{(${(r * 100).toFixed(2)}\% - ${(q * 100).toFixed(2)}\%)\times ${Tm.toFixed(3)}} = ${fair.toFixed(2)}`, true)
      + tex(String.raw`\text{${T("无套利带", "no-arbitrage band")}}: \underbrace{S e^{(r-q-b)T}}_{${lo.toFixed(2)}} \;\le\; F \;\le\; \underbrace{S e^{(r_{\text{borrow}}-q)T}}_{${up.toFixed(2)}}`, true);
    $("#fc-stats").innerHTML = stats([
      [T("公平远期", "Fair forward"), "$" + fair.toFixed(2), "acc"],
      [T("基差 F − S", "Basis F − S"), (fair - S >= 0 ? "+" : "−") + "$" + Math.abs(fair - S).toFixed(2)],
      [T("报价", "Quote"), "$" + Fq.toFixed(2)],
      [T("报价 − 公平价", "Quote − fair"), (Fq - fair >= 0 ? "+" : "−") + "$" + Math.abs(Fq - fair).toFixed(2), Fq > up ? "neg" : Fq < lo ? "neg" : "pos"],
    ]);
    const n = Math.exp(-q * Tm); // shares bought today so that reinvested dividends leave exactly one at delivery
    let html;
    if (Fq > up + 1e-9) {
      const cost = S * n;
      html = `<div class="demo-log bad"><b>${T("报价太贵 → 正向持有套利（cash-and-carry）", "Quote too high → cash-and-carry")}</b></div>
      <table><thead><tr><th>${T("步骤", "Step")}</th><th>${T("今天", "Today")}</th><th>${T("交割日", "Delivery")}</th></tr></thead><tbody>
      <tr><td>${T("借入资金", "Borrow cash")}</td><td>+${cost.toFixed(2)}</td><td>−${up.toFixed(2)}</td></tr>
      <tr><td>${T("买入股票（股息再投资，交割时正好 1 股）", "Buy stock (dividends reinvested → exactly 1 share)")}</td><td>−${cost.toFixed(2)}</td><td>${T("交出这 1 股", "deliver the share")}</td></tr>
      <tr><td>${T("以报价卖出远期", "Sell the forward at the quote")}</td><td>0</td><td>+${Fq.toFixed(2)}</td></tr>
      <tr class="hl"><td><b>${T("合计", "Net")}</b></td><td>0</td><td><b>+${(Fq - up).toFixed(2)}</b></td></tr></tbody></table>`;
    } else if (Fq < lo - 1e-9) {
      const proceeds = S * Math.exp(-(q + b) * Tm);
      html = `<div class="demo-log bad"><b>${T("报价太便宜 → 反向持有套利（reverse cash-and-carry）", "Quote too low → reverse cash-and-carry")}</b></div>
      <table><thead><tr><th>${T("步骤", "Step")}</th><th>${T("今天", "Today")}</th><th>${T("交割日", "Delivery")}</th></tr></thead><tbody>
      <tr><td>${T("卖空股票（付股息和借券费后，交割时欠 1 股）", "Short stock (after dividends and the fee, you owe 1 share)")}</td><td>+${proceeds.toFixed(2)}</td><td>${T("还 1 股", "return 1 share")}</td></tr>
      <tr><td>${T("把卖空所得按 r 借出", "Lend the proceeds at r")}</td><td>−${proceeds.toFixed(2)}</td><td>+${lo.toFixed(2)}</td></tr>
      <tr><td>${T("以报价买入远期", "Buy the forward at the quote")}</td><td>0</td><td>−${Fq.toFixed(2)} ${T("，收到 1 股", ", receive 1 share")}</td></tr>
      <tr class="hl"><td><b>${T("合计", "Net")}</b></td><td>0</td><td><b>+${(lo - Fq).toFixed(2)}</b></td></tr></tbody></table>`;
    } else {
      html = `<div class="demo-log ok">${T("报价在无套利带里", "The quote is inside the no-arbitrage band")} [$${lo.toFixed(2)}, $${up.toFixed(2)}]${T("：扣掉借贷和借券成本后，两个方向的持有套利都赚不到钱。", ": after financing and borrow costs, neither carry trade makes money.")}</div>`;
    }
    $("#fc-trade").innerHTML = html;
    $("#fc-chart").innerHTML = lineChart({
      xmin: 0, xmax: 730, xlabel: T("交割天数", "Days to delivery"), ylabel: T("远期价格", "Forward price"),
      series: [
        { f: (d) => S * Math.exp((rb - q) * d / 365), cls: 2, dashed: true, label: T("带子上沿（正向）", "band top (cash-and-carry)") },
        { f: (d) => S * Math.exp((r - q) * d / 365), cls: 0, label: T("公平远期", "fair forward") },
        { f: (d) => S * Math.exp((r - q - b) * d / 365), cls: 3, dashed: true, label: T("带子下沿（反向）", "band bottom (reverse)") },
      ],
      hlines: [{ y: S, label: "S" }],
      points: [{ x: v["fc-t"], y: Fq, cls: Fq > up || Fq < lo ? 2 : 3, label: T("报价 ", "quote ") + Fq.toFixed(2) }],
    });
  };
  const run = bindSliders(root, { "fc-s": (x) => "$" + x, "fc-t": (x) => x + T(" 天", " days"), "fc-r": (x) => x + "%", "fc-sp": (x) => "+" + x + "%", "fc-q": (x) => x + "%", "fc-b": (x) => x + "%", "fc-f": (x) => "$" + (+x).toFixed(2) }, draw);
  const set = (vals) => { for (const [id, x] of Object.entries(vals)) $("#" + id).value = x; run(); };
  root.querySelectorAll("[data-fc]").forEach((b) => b.addEventListener("click", () => {
    const k = b.dataset.fc;
    if (k === "fair" && st) set({ "fc-f": (Math.round(st.fair / 0.05) * 0.05).toFixed(2) });
    if (k === "xyz") set({ "fc-s": 100, "fc-t": 365, "fc-r": 4, "fc-sp": 0, "fc-q": 0, "fc-b": 0, "fc-f": 106 });
    if (k === "htb") set({ "fc-s": 100, "fc-t": 365, "fc-r": 4, "fc-sp": 0, "fc-q": 0, "fc-b": 10, "fc-f": 97 });
  }));
}
