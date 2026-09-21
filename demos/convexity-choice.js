// 同一看涨观点：BTC 永续 / Deribit 看涨 / IBIT 看涨 三条示意损益
import { lineChart, chartBlock } from "./_chart.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🔀 ${T("同一看涨 · 三把工具", "Same bullish view · three tools")}</div>
      <div class="demo-grid-3">
        <div class="demo-block"><label class="demo-label">${T("入场（示意指数）", "Entry (schematic index)")} = <b id="cx-e">100</b></label><input class="demo-slider" id="cx-es" type="range" min="80" max="120" step="1" value="100"/></div>
        <div class="demo-block"><label class="demo-label">${T("永续资金费拖累", "Perp funding drag")} = <b id="cx-f">1.5</b></label><input class="demo-slider" id="cx-fs" type="range" min="0" max="6" step="0.5" value="1.5"/></div>
        <div class="demo-block"><label class="demo-label">${T("看涨权利金", "Call premium")} = <b id="cx-c">6</b></label><input class="demo-slider" id="cx-cs" type="range" min="2" max="15" step="0.5" value="6"/></div>
      </div>
      <div class="demo-seg" id="cx-seg">
        <button data-k="perp" class="on">${T("BTC 永续", "BTC perp")}</button>
        <button data-k="coin">${T("币本位看涨（Deribit 示意）", "Coin-margined call (Deribit-like)")}</button>
        <button data-k="ibit">${T("IBIT 看涨（股票期权）", "IBIT call (equity option)")}</button>
      </div>
      <div id="cx-chart"></div>
      <div class="stat-row">
        <div class="stat"><div class="k">${T("损益形状", "Payoff")}</div><div class="v acc" id="cx-sh">–</div></div>
        <div class="stat"><div class="k">${T("时钟", "Clock")}</div><div class="v" id="cx-cl">–</div></div>
        <div class="stat"><div class="k">${T("买方最大亏", "Buyer max loss")}</div><div class="v neg" id="cx-ml">–</div></div>
      </div>
      <p class="demo-tip" id="cx-tip"></p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  let key = "perp";

  function paint() {
    const E = +$("#cx-es").value, F = +$("#cx-fs").value, c = +$("#cx-cs").value;
    $("#cx-e").textContent = E;
    $("#cx-f").textContent = F.toFixed(1);
    $("#cx-c").textContent = c;
    const K = E + 5;
    const fns = {
      perp: { f: (S) => (S - E) - F, cls: "line3" },
      coin: { f: (S) => Math.max(S - K, 0) - c, cls: "line" },
      ibit: { f: (S) => (Math.max(S - K, 0) - c) * 100, cls: "line2" },
    };
    const meta = {
      perp: [
        T("线性，可被资金费下移", "Linear, can be shifted by funding"),
        T("资金费", "Funding"),
        T("保证金；可被强平/ADL", "Margin; liq / ADL"),
        T("BTC 永续是 USDT（或币）名义的线性互换，通常 1 币口径。涨 1 赚 1，但会爆仓，且正费率会慢慢抽水。", "A BTC perp is a linear swap on a USDT (or coin) notional, usually 1-coin size. +1 in price is +1 in P&L, but you can liquidate, and positive funding leaks."),
      ],
      coin: [
        T("钩形 · 币/USD 凸性", "Hook · coin/USD convexity"),
        T("到期 + Theta", "Expiry + Theta"),
        T("权利金（买方）", "Premium (buyer)"),
        T("Deribit 是加密期权主场（Coinbase 已于 2025-08-14 收购；机构迁移 CIE→Deribit 目标 2026-09-09）。买方亏权利金，不是强平线。", "Deribit is the crypto-options venue (Coinbase acquired it 14 Aug 2025; CIE institutional migration onto Deribit targeted 9 Sep 2026). The buyer loses premium, not a liq price."),
      ],
      ibit: [
        T("钩形 · 每股×100", "Hook · per-share ×100"),
        T("到期 + Theta", "Expiry + Theta"),
        T("权利金 ×100 / 张", "Premium ×100 / contract"),
        T("IBIT 是美股上市的比特币现货 ETF。它的期权是<b>股票期权</b>：1 张通常 = 100 股，金额要 ×100。底层是股份，不是链上的币，也不是永续。", "IBIT is a listed BTC spot ETF. Its options are <b>equity options</b>: 1 contract is usually 100 shares, so money ×100. The underlying is shares — not on-chain coin, not a perp."),
      ],
    };
    const res = lineChart({ fns: [fns[key]], lo: 70, hi: 140, forceZero: true, xlabel: T("标的（示意）", "Underlying (schematic)"), markerX: E, uid: "cx" });
    $("#cx-chart").innerHTML = chartBlock(res, [["var(--accent)", meta[key][0]]]);
    $("#cx-sh").textContent = meta[key][0];
    $("#cx-cl").textContent = meta[key][1];
    $("#cx-ml").textContent = meta[key][2];
    $("#cx-tip").innerHTML = meta[key][3];
  }

  $("#cx-seg").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    key = b.dataset.k;
    $("#cx-seg").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    paint();
  });
  ["cx-es", "cx-fs", "cx-cs"].forEach((id) => $(`#${id}`).addEventListener("input", paint));
  paint();
}
