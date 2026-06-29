// demos/iron-condor.js —— 铁鹰 损益演示
// 卖出虚值看跌价差 + 卖出虚值看涨价差；滑块调“卖出行权价离现价多远”与“保护翼宽度”。
// payoffSVG 画梯形台面、标两个BE；stat-row 给 净收入/最大盈利(=净收入)/最大亏损(=宽度−收入)/两个BE。
// 全部真算（netPL 引擎）。
import { payoffSVG, payoffBlock, netPL } from "./_payoff.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;
  const SPOT = 100;

  // dist = 卖出行权价离现价的距离（下卖 100−dist、上卖 100+dist）
  // wing = 保护翼宽度（买在卖出行权价更外侧 wing 元处）
  let dist = 10;
  let wing = 5;

  // 卖出腿权利金按“离现价越远越便宜”近似；保护翼比对应卖出腿便宜（更虚）。
  // 保证净收入 > 0 且 < 翼宽（这样最大亏损 = 翼宽 − 净收入 > 0）。
  function premiums(d, w) {
    // 卖出腿（虚值 d 元）：远则便宜
    const sell = Math.max(0.6, 5.5 - 0.32 * d);
    // 买入保护翼（虚值 d+w 元）：再便宜一截
    const buy = Math.max(0.2, 5.5 - 0.32 * (d + w));
    return { sell, buy };
  }

  function buildLegs() {
    const { sell, buy } = premiums(dist, wing);
    const putSell = 100 - dist, putBuy = 100 - dist - wing;
    const callSell = 100 + dist, callBuy = 100 + dist + wing;
    return [
      { type: "put", side: "short", strike: putSell, premium: sell, qty: 1 },
      { type: "put", side: "long", strike: putBuy, premium: buy, qty: 1 },
      { type: "call", side: "short", strike: callSell, premium: sell, qty: 1 },
      { type: "call", side: "long", strike: callBuy, premium: buy, qty: 1 },
    ];
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🦅 ${T("铁鹰 · 区间收租", "Iron condor · renting out a range")}</div>

      <div class="cmp" style="grid-template-columns:1fr 1fr;align-items:end;margin-bottom:6px">
        <div>
          <div class="demo-label">${T("卖出行权价离现价（区间半宽）", "Short strikes from spot (half-range)")} <b id="ic-dv">${dist}</b></div>
          <input class="demo-slider" id="ic-d" type="range" min="5" max="18" step="1" value="${dist}"/>
        </div>
        <div>
          <div class="demo-label">${T("保护翼宽度", "Protective wing width")} <b id="ic-wv">${wing}</b></div>
          <input class="demo-slider" id="ic-w" type="range" min="2" max="12" step="1" value="${wing}"/>
        </div>
      </div>

      <div class="legs" id="ic-legs"></div>

      <div id="ic-chart"></div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("净收入(贷记)", "Net credit")}</div><div class="v pos" id="ic-cr">–</div></div>
        <div class="stat"><div class="k">${T("最大盈利", "Max profit")}</div><div class="v pos" id="ic-mp">–</div></div>
        <div class="stat"><div class="k">${T("最大亏损", "Max loss")}</div><div class="v neg" id="ic-ml">–</div></div>
        <div class="stat"><div class="k">${T("下盈亏平衡", "Lower BE")}</div><div class="v acc" id="ic-be1">–</div></div>
        <div class="stat"><div class="k">${T("上盈亏平衡", "Upper BE")}</div><div class="v acc" id="ic-be2">–</div></div>
      </div>

      <p class="demo-tip" id="ic-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);

  function legRow(leg) {
    const buy = leg.side === "long";
    const sideTxt = buy ? T("买入", "BUY") : T("卖出", "SELL");
    const sideCls = buy ? "side-buy" : "side-sell";
    const pill = leg.type === "call" ? "call" : "put";
    const pillTxt = leg.type === "call" ? "CALL" : "PUT";
    return `<div class="leg">
      <span class="${sideCls}">${sideTxt}</span>
      <span class="leg-pill ${pill}">${pillTxt}</span>
      <span class="leg-tag">K=${leg.strike}　${T("权利金", "prem")} ${leg.premium.toFixed(2)}</span>
    </div>`;
  }

  function paint() {
    const legs = buildLegs();
    const LO = Math.max(40, 100 - dist - wing - 8), HI = 100 + dist + wing + 8;

    $("#ic-legs").innerHTML = legs.map(legRow).join("");

    const res = payoffSVG({ legs, lo: LO, hi: HI, spot: SPOT, spotLabel: T("现价", "spot"), uid: "ic" });
    $("#ic-chart").innerHTML = payoffBlock(res, [
      ["var(--green-soft)", T("盈利", "Profit")],
      ["var(--red-soft)", T("亏损", "Loss")],
      ["var(--gold)", T("行权价", "Strike")],
    ]);

    // 净收入（每股）= 卖出收 − 买入付
    const creditPS = legs.reduce((a, l) => a + (l.side === "short" ? 1 : -1) * l.premium, 0);
    // 真算：最大盈利（区间内，取现价100处）与最大亏损（远离，取最外侧）
    const maxProfitPS = netPL(legs, 100);             // 区间内平台
    const maxLossPS = netPL(legs, 100 + dist + wing + 5); // 击穿上翼外
    const bes = res.breakevens;

    $("#ic-cr").textContent = "+$" + (creditPS * MULT).toFixed(0);
    $("#ic-mp").textContent = "+$" + (maxProfitPS * MULT).toFixed(0);
    $("#ic-ml").textContent = "−$" + Math.abs(maxLossPS * MULT).toFixed(0);
    $("#ic-be1").textContent = bes.length ? bes[0].toFixed(2) : "—";
    $("#ic-be2").textContent = bes.length > 1 ? bes[1].toFixed(2) : "—";

    const theoLoss = wing - creditPS; // 每股
    $("#ic-tip").innerHTML = T(
      `先收净权利金 <b>+$${(creditPS * MULT).toFixed(0)}</b>。只要到期价落在两个卖出行权价之间（<b>${100 - dist}~${100 + dist}</b>），四腿全废、权利金全收（最大盈利 $${(maxProfitPS * MULT).toFixed(0)}）。冲出保护翼外则亏封顶 = 翼宽 ${wing} − 净收入 = $${(theoLoss * MULT).toFixed(0)}。两个盈亏平衡 = 卖出行权价 ± 净收入 = <b>${(100 - dist - creditPS).toFixed(1)} / ${(100 + dist + creditPS).toFixed(1)}</b>。它 <b>+Theta · −Vega</b>：卖得越虚（拖右）胜率越高但收得越少；高 IV 时建仓收得更肥。`,
      `Collect a net credit <b>+$${(creditPS * MULT).toFixed(0)}</b> up front. As long as expiry lands between the short strikes (<b>${100 - dist}~${100 + dist}</b>), all four legs expire worthless and you keep it all (max profit $${(maxProfitPS * MULT).toFixed(0)}). Break past a wing and loss is capped at width ${wing} − credit = $${(theoLoss * MULT).toFixed(0)}. The two breakevens = short strikes ± credit = <b>${(100 - dist - creditPS).toFixed(1)} / ${(100 + dist + creditPS).toFixed(1)}</b>. It is <b>+Theta · −Vega</b>: selling further out (drag right) raises win rate but collects less; build it when IV is high to collect fatter.`
    );
  }

  $("#ic-d").addEventListener("input", (e) => { dist = +e.target.value; $("#ic-dv").textContent = dist; paint(); });
  $("#ic-w").addEventListener("input", (e) => { wing = +e.target.value; $("#ic-wv").textContent = wing; paint(); });

  paint();
}
