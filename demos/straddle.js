// demos/straddle.js —— 跨式 / 宽跨式 损益演示
// 分段切换 跨式(ATM call+put) / 宽跨式(OTM call+put)；滑块调权利金/行权价宽度。
// payoffSVG 画 V 形、标两个盈亏平衡点；stat-row 给 最大盈利(理论无限)/最大亏损/两个BE；
// 点出 +Vega / −Theta 的做多波动率本质。全部真算（netPL 引擎）。
import { payoffSVG, payoffBlock, netPL } from "./_payoff.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;
  const LO = 60, HI = 140, SPOT = 100;

  // 状态：模式 + 可调参数
  let mode = "straddle"; // 'straddle' | 'strangle'
  // 跨式：同 K=100，看涨/看跌权利金各 prem
  // 宽跨式：看涨 K=100+w，看跌 K=100−w，权利金各 premS
  let prem = 6;     // 跨式每条腿权利金
  let premS = 4;    // 宽跨式每条腿权利金
  let width = 5;    // 宽跨式行权价偏移

  function buildLegs() {
    if (mode === "straddle") {
      return [
        { type: "call", side: "long", strike: 100, premium: prem, qty: 1 },
        { type: "put", side: "long", strike: 100, premium: prem, qty: 1 },
      ];
    }
    return [
      { type: "call", side: "long", strike: 100 + width, premium: premS, qty: 1 },
      { type: "put", side: "long", strike: 100 - width, premium: premS, qty: 1 },
    ];
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🎢 ${T("跨式 / 宽跨式 · 押“会大动”", "Straddle / Strangle · betting on a big move")}</div>

      <div class="demo-row" style="margin-bottom:10px">
        <div class="demo-seg" id="st-seg">
          <button data-m="straddle" class="on">${T("跨式 Straddle", "Straddle")}</button>
          <button data-m="strangle">${T("宽跨式 Strangle", "Strangle")}</button>
        </div>
        <span class="pill acc" id="st-vega">+Vega · −Theta</span>
      </div>

      <div id="st-controls"></div>

      <div id="st-chart"></div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("最大盈利", "Max profit")}</div><div class="v pos" id="st-mp">–</div></div>
        <div class="stat"><div class="k">${T("最大亏损", "Max loss")}</div><div class="v neg" id="st-ml">–</div></div>
        <div class="stat"><div class="k">${T("下盈亏平衡", "Lower BE")}</div><div class="v acc" id="st-be1">–</div></div>
        <div class="stat"><div class="k">${T("上盈亏平衡", "Upper BE")}</div><div class="v acc" id="st-be2">–</div></div>
        <div class="stat"><div class="k">${T("总成本/张", "Cost/contract")}</div><div class="v" id="st-cost">–</div></div>
      </div>

      <p class="demo-tip" id="st-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);

  function renderControls() {
    if (mode === "straddle") {
      $("#st-controls").innerHTML = `
        <div class="demo-block">
          <div class="demo-label">${T("每条腿权利金（看涨=看跌）", "Premium per leg (call = put)")} <b id="st-pv">${prem.toFixed(1)}</b>
            <span style="color:var(--muted)">${T("行权价均为", "both strikes at")} K=100</span></div>
          <input class="demo-slider" id="st-p" type="range" min="2" max="12" step="0.5" value="${prem}"/>
        </div>`;
      $("#st-p").addEventListener("input", (e) => { prem = +e.target.value; $("#st-pv").textContent = prem.toFixed(1); paint(); });
    } else {
      $("#st-controls").innerHTML = `
        <div class="cmp" style="grid-template-columns:1fr 1fr;align-items:end">
          <div>
            <div class="demo-label">${T("行权价偏移（看涨 100+，看跌 100−）", "Strike offset (call 100+, put 100−)")} <b id="st-wv">${width}</b></div>
            <input class="demo-slider" id="st-w" type="range" min="2" max="20" step="1" value="${width}"/>
          </div>
          <div>
            <div class="demo-label">${T("每条腿权利金", "Premium per leg")} <b id="st-psv">${premS.toFixed(1)}</b></div>
            <input class="demo-slider" id="st-ps" type="range" min="1" max="8" step="0.5" value="${premS}"/>
          </div>
        </div>`;
      $("#st-w").addEventListener("input", (e) => { width = +e.target.value; $("#st-wv").textContent = width; paint(); });
      $("#st-ps").addEventListener("input", (e) => { premS = +e.target.value; $("#st-psv").textContent = premS.toFixed(1); paint(); });
    }
  }

  function paint() {
    const legs = buildLegs();
    const res = payoffSVG({ legs, lo: LO, hi: HI, spot: SPOT, spotLabel: T("现价", "spot"), uid: "st" });
    $("#st-chart").innerHTML = payoffBlock(res, [
      ["var(--green-soft)", T("盈利", "Profit")],
      ["var(--red-soft)", T("亏损", "Loss")],
      ["var(--gold)", T("行权价", "Strike")],
    ]);

    // 总成本（每股 → ×100）
    const costPS = legs.reduce((a, l) => a + l.premium, 0);
    const cost = costPS * MULT;

    // 最大盈利：上行无限；最大亏损：净付出（中间最痛）
    // 中间最痛点：跨式在 K=100；宽跨式在 [100-w,100+w] 整段平底，取该处亏损 = 总成本
    const maxLoss = costPS; // 每股
    const bes = res.breakevens;

    $("#st-mp").textContent = T("理论无限", "∞");
    $("#st-ml").textContent = "−$" + (maxLoss * MULT).toFixed(0);
    $("#st-be1").textContent = bes.length ? bes[0].toFixed(2) : "—";
    $("#st-be2").textContent = bes.length > 1 ? bes[1].toFixed(2) : "—";
    $("#st-cost").textContent = "$" + cost.toFixed(0);

    // 校验：跨式 BE = 100 ± 总成本；宽跨式 = (100−w)−总成本 / (100+w)+总成本
    let beCheck;
    if (mode === "straddle") {
      beCheck = `${(100 - costPS).toFixed(1)} / ${(100 + costPS).toFixed(1)}`;
    } else {
      beCheck = `${(100 - width - costPS).toFixed(1)} / ${(100 + width + costPS).toFixed(1)}`;
    }

    if (mode === "straddle") {
      $("#st-tip").innerHTML = T(
        `<b>跨式</b>：买平值看涨+看跌（均 K=100）。最痛点在正中央 S=100（亏满总成本 $${cost.toFixed(0)}）；两个盈亏平衡 = 100 ± 总成本 = <b>${beCheck}</b>。它 <b>+Vega</b>（盼 IV 涨）、<b>−Theta</b>（每天流失两份时间价值）——你押的是“动得够远”，方向无所谓。`,
        `<b>Straddle</b>: long ATM call + put (both K=100). Worst point is dead center at S=100 (lose the full cost $${cost.toFixed(0)}); the two breakevens = 100 ± total cost = <b>${beCheck}</b>. It is <b>+Vega</b> (wants IV up) and <b>−Theta</b> (bleeds two premiums a day) — you bet on a big enough move, direction irrelevant.`
      );
    } else {
      $("#st-tip").innerHTML = T(
        `<b>宽跨式</b>：买虚值看涨(K=${100 + width})+看跌(K=${100 - width})。比跨式便宜，但最大亏损是一整段<b>平底</b>（${100 - width}~${100 + width} 全亏 $${cost.toFixed(0)}）；两个盈亏平衡更远 = <b>${beCheck}</b>，需要更猛的行情才回本。同样 +Vega / −Theta。`,
        `<b>Strangle</b>: long OTM call (K=${100 + width}) + put (K=${100 - width}). Cheaper than a straddle, but max loss is a flat floor (${100 - width}~${100 + width}, losing $${cost.toFixed(0)}); the breakevens sit wider at <b>${beCheck}</b>, needing an even bigger move. Same +Vega / −Theta.`
      );
    }
  }

  // 分段切换
  $("#st-seg").querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", () => {
      mode = b.dataset.m;
      $("#st-seg").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
      renderControls();
      paint();
    });
  });

  renderControls();
  paint();
}
