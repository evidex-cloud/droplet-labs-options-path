// 四种示意损益形状：现货 / 到期期货 / 带资金费拖累的永续 / 买入看涨
import { lineChart, chartBlock } from "./_chart.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">📐 ${T("四种形状 · 现货 / 到期期货 / 永续 / 看涨", "Four shapes · Spot / Dated future / Perp / Call")}</div>
      <div class="demo-grid-3">
        <div class="demo-block"><label class="demo-label">${T("入场价", "Entry")} = <b id="pv-e">100</b></label><input class="demo-slider" id="pv-es" type="range" min="80" max="120" step="1" value="100"/></div>
        <div class="demo-block"><label class="demo-label">${T("资金费拖累（教学）", "Funding drag (teaching)")} = <b id="pv-f">2.0</b></label><input class="demo-slider" id="pv-fs" type="range" min="0" max="8" step="0.5" value="2"/></div>
        <div class="demo-block"><label class="demo-label">${T("看涨权利金 c", "Call premium c")} = <b id="pv-c">5.0</b></label><input class="demo-slider" id="pv-cs" type="range" min="1" max="12" step="0.5" value="5"/></div>
      </div>
      <div class="demo-seg" id="pv-seg">
        <button data-k="spot" class="on">${T("现货", "Spot")}</button>
        <button data-k="fut">${T("到期期货", "Dated future")}</button>
        <button data-k="perp">${T("永续+资金费", "Perp + funding")}</button>
        <button data-k="call">${T("买入看涨", "Long call")}</button>
      </div>
      <div id="pv-chart"></div>
      <div class="stat-row">
        <div class="stat"><div class="k">${T("形状", "Shape")}</div><div class="v acc" id="pv-shape">–</div></div>
        <div class="stat"><div class="k">${T("时钟", "Clock")}</div><div class="v" id="pv-clock">–</div></div>
        <div class="stat"><div class="k">${T("最大亏损", "Max loss")}</div><div class="v neg" id="pv-ml">–</div></div>
      </div>
      <p class="demo-tip" id="pv-tip"></p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  let key = "spot";
  const K = 105;

  function paint() {
    const E = +$("#pv-es").value, F = +$("#pv-fs").value, c = +$("#pv-cs").value;
    $("#pv-e").textContent = E;
    $("#pv-f").textContent = F.toFixed(1);
    $("#pv-c").textContent = c.toFixed(1);

    const fns = {
      spot: { f: (S) => S - E, cls: "line" },
      fut: { f: (S) => S - E, cls: "line2" },
      perp: { f: (S) => S - E - F, cls: "line3" },
      call: { f: (S) => Math.max(S - K, 0) - c, cls: "line" },
    };
    const meta = {
      spot: [
        T("直线 · 1 币口径", "Line · 1-coin notional"),
        T("无到期", "No expiry"),
        T("跌到 0（全额本金）", "To zero (full capital)"),
        T("现货是全额买币：涨 1 赚 1。没有资金费，也没有期权那样的拐点。名义通常是 1 枚币，不是美股期权的 ×100。", "Spot is fully funded coin: +1 in price is +1 in P&L. No funding, no option kink. Notional is usually 1 coin — not the equity-options ×100."),
      ],
      fut: [
        T("直线（同现货形状）", "Line (same shape as spot)"),
        T("交割日 / 移仓", "Delivery date / roll"),
        T("可爆仓（保证金）", "Can liquidate (margin)"),
        T("CME 等交易所的到期期货：损益形状仍是直线，但只需保证金。到期要交割或移仓。它不是永续。", "An exchange dated future (e.g. CME): still a straight line, but on margin. It expires or you roll. It is not a perp."),
      ],
      perp: [
        T("直线下移（资金费）", "Line shifted down (funding)"),
        T("资金费结算", "Funding settlements"),
        T("可爆仓", "Can liquidate"),
        T("永续没有交割日，时钟改成资金费。正费率下多头持续付钱，整条直线被往下拖。拖累数字是教学示意，不是实测。", "A perp has no delivery; the clock is funding. With positive funding, longs keep paying and the whole line is dragged down. The drag figure is schematic, not a live print."),
      ],
      call: [
        T("钩形折线", "Hockey-stick kink"),
        T("到期 + Theta", "Expiry + Theta"),
        T("权利金封顶", "Premium-capped"),
        T("买入看涨是凸性：下行封在权利金，上行敞开。这是期权课的主线（阶段 1.1），和线性永续不是同一把工具。", "A long call is convex: downside capped at premium, upside open. That is the options course (Stage 1.1) — not the same tool as a linear perp."),
      ],
    };

    const res = lineChart({ fns: [fns[key]], lo: 70, hi: 140, xlabel: T("标的价", "Price"), markerX: E, markerLabel: T("入场", "Entry"), forceZero: true, uid: "pv" });
    $("#pv-chart").innerHTML = chartBlock(res, [["var(--accent)", meta[key][0]]]);
    $("#pv-shape").textContent = meta[key][0];
    $("#pv-clock").textContent = meta[key][1];
    $("#pv-ml").textContent = meta[key][2];
    $("#pv-tip").innerHTML = meta[key][3];
  }

  $("#pv-seg").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    key = b.dataset.k;
    $("#pv-seg").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    paint();
  });
  ["pv-es", "pv-fs", "pv-cs"].forEach((id) => $(`#${id}`).addEventListener("input", paint));
  paint();
}
