// 交互演示：Delta 的 S 形曲线（Delta vs 标的价 S），用 _chart.js 的 lineChart 画。
// .demo-seg 切看涨/看跌；滑块控制到期天数，展示临近到期 Delta 曲线变陡（趋向阶跃）。
// markerX 在 K=100；读出 ATM Delta ≈ ±0.5。真算：greeks()。
import { greeks } from "./_bs.js";
import { lineChart, chartBlock } from "./_chart.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const K = 100, lo = 60, hi = 140, r = 0.04, sigma = 0.2;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">📈 ${T("Delta 的 S 形曲线：随标的从 0 爬到 ±1", "Delta's S-curve: from 0 to ±1 across spot")}</div>

      <div class="demo-row">
        <div class="demo-seg" id="dc-type">
          <button data-t="call" class="on">${T("看涨 Call", "Call")}</button>
          <button data-t="put">${T("看跌 Put", "Put")}</button>
        </div>
      </div>

      <div class="demo-block">
        <label class="demo-label">${T("到期天数", "Days to expiry")} = <b id="dc-d-v">90</b> ${T("（越小，曲线在平值越陡）", "(smaller → steeper at ATM)")}</label>
        <input class="demo-slider" id="dc-d" type="range" min="2" max="365" step="1" value="90"/>
      </div>

      <div id="dc-chart"></div>

      <div class="stat-row" style="margin-top:12px">
        <div class="stat"><div class="k">${T("虚值 S=80 Delta", "OTM S=80 Delta")}</div><div class="v" id="dc-otm">–</div></div>
        <div class="stat"><div class="k">${T("平值 S=100 Delta", "ATM S=100 Delta")}</div><div class="v acc" id="dc-atm">–</div></div>
        <div class="stat"><div class="k">${T("实值 S=120 Delta", "ITM S=120 Delta")}</div><div class="v" id="dc-itm">–</div></div>
      </div>

      <p class="demo-tip" id="dc-tip"></p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  let type = "call";

  function deltaAt(S, days) {
    return greeks({ S, K, T: days / 365, r, sigma, type }).delta;
  }

  function paint() {
    const days = +$("#dc-d").value;
    $("#dc-d-v").textContent = days;

    const res = lineChart({
      fns: [{ f: (S) => deltaAt(S, days), cls: type === "call" ? "line" : "line3" }],
      lo, hi,
      xlabel: T("标的价 S（行权价 K=100）", "Spot S (strike K=100)"),
      markerX: K,
      markerLabel: "K=100",
      forceZero: true,
    });
    $("#dc-chart").innerHTML = chartBlock(res, [[
      type === "call" ? "var(--accent)" : "var(--red)",
      T(`${type === "call" ? "看涨" : "看跌"} Delta vs 标的价`, `${type === "call" ? "Call" : "Put"} Delta vs spot`),
    ]]);

    const dOtm = deltaAt(80, days), dAtm = deltaAt(100, days), dItm = deltaAt(120, days);
    $("#dc-otm").textContent = dOtm.toFixed(3);
    $("#dc-atm").textContent = (dAtm >= 0 ? "+" : "") + dAtm.toFixed(3);
    $("#dc-itm").textContent = dItm.toFixed(3);

    $("#dc-tip").innerHTML = T(
      `平值 Delta ≈ <b>${dAtm.toFixed(2)}</b>（${type === "call" ? "看涨约 +0.5" : "看跌约 −0.5"}）。看涨 0→+1、看跌 −1→0，曲线是 S 形：虚值≈0（几乎不跟标的动）、实值≈±1（几乎 1:1 跟动）。把<b>天数</b>拖小 → 曲线在 K=100 附近<b>越来越陡</b>，趋向到期日的阶跃——这“陡度”正是 Gamma（阶段 5.3）。Delta 还约等于“到期实值的概率”（阶段 5.2）。`,
      `ATM Delta ≈ <b>${dAtm.toFixed(2)}</b> (${type === "call" ? "call ≈ +0.5" : "put ≈ −0.5"}). Calls run 0→+1, puts −1→0, in an S-shape: OTM ≈ 0 (barely tracks spot), ITM ≈ ±1 (tracks ~1:1). Drag <b>days</b> down → the curve gets <b>steeper</b> near K=100, approaching a step at expiry — that steepness IS Gamma (Stage 5.3). Delta also ≈ probability of finishing ITM (Stage 5.2).`
    );
  }

  $("#dc-type").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    type = b.dataset.t;
    [...$("#dc-type").children].forEach((c) => c.classList.toggle("on", c === b));
    paint();
  });
  $("#dc-d").addEventListener("input", paint);
  paint();
}
