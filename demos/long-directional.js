// 交互演示：买入看涨/看跌 · 方向性押注
// 分段切换 看涨/看跌 → 拖动行权价 K、权利金、到期价 S →
// payoffSVG 画单腿钩形；stat-row 给最大盈利/最大亏损/盈亏平衡；
// 额外把“买一张期权”的百分比回报 vs “直接买 100 股股票”的百分比回报并排对比，凸显杠杆。
import { payoffSVG, payoffBlock, netPL } from "./_payoff.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;
  const SPOT = 100; // 标的现价（买股的成本基准）

  let kind = "call"; // 'call' | 'put'

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🎯 ${T("买入看涨/看跌 · 方向性押注", "Long Call / Put · Directional Bet")}</div>

      <div class="demo-seg" id="ld-seg" style="margin-bottom:14px">
        <button data-k="call" class="on">${T("买入看涨", "Long Call")}</button>
        <button data-k="put">${T("买入看跌", "Long Put")}</button>
      </div>

      <div class="demo-grid-3">
        <div class="demo-block"><label class="demo-label">${T("行权价 K", "Strike K")} = <b id="ld-kv">100</b></label><input class="demo-slider" id="ld-k" type="range" min="80" max="120" step="1" value="100"/></div>
        <div class="demo-block"><label class="demo-label">${T("权利金", "Premium")} = <b id="ld-cv">5.0</b></label><input class="demo-slider" id="ld-c" type="range" min="1" max="15" step="0.5" value="5"/></div>
        <div class="demo-block"><label class="demo-label">${T("到期价 S", "Price at expiry S")} = <b id="ld-sv">115</b></label><input class="demo-slider" id="ld-s" type="range" min="60" max="140" step="1" value="115"/></div>
      </div>

      <div id="ld-chart"></div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("最大盈利", "Max profit")}</div><div class="v pos" id="ld-mp">–</div></div>
        <div class="stat"><div class="k">${T("最大亏损", "Max loss")}</div><div class="v neg" id="ld-ml">–</div></div>
        <div class="stat"><div class="k">${T("盈亏平衡", "Breakeven")}</div><div class="v acc" id="ld-be">–</div></div>
      </div>

      <div class="cmp" style="margin-top:14px">
        <div class="cmp-cell">
          <h5>${T("买 1 张期权", "Buy 1 option")}</h5>
          <div style="font-size:13px;color:var(--muted);line-height:1.7">
            ${T("成本", "Cost")} <b id="ld-opt-cost" style="color:var(--ink)">–</b><br>
            ${T("到期盈亏", "P&L at S")} <b id="ld-opt-pl">–</b><br>
            ${T("回报率", "% return")} <b id="ld-opt-ret" style="font-size:16px">–</b>
          </div>
        </div>
        <div class="cmp-cell">
          <h5>${T("直接买 100 股股票", "Buy 100 shares")}</h5>
          <div style="font-size:13px;color:var(--muted);line-height:1.7">
            ${T("成本", "Cost")} <b style="color:var(--ink)">$${(SPOT * MULT).toLocaleString()}</b><br>
            ${T("到期盈亏", "P&L at S")} <b id="ld-stk-pl">–</b><br>
            ${T("回报率", "% return")} <b id="ld-stk-ret" style="font-size:16px">–</b>
          </div>
        </div>
      </div>

      <p class="demo-tip" id="ld-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const kSl = $("#ld-k"), cSl = $("#ld-c"), sSl = $("#ld-s");

  function paint() {
    const K = +kSl.value, c = +cSl.value, S = +sSl.value;
    $("#ld-kv").textContent = K;
    $("#ld-cv").textContent = c.toFixed(1);
    $("#ld-sv").textContent = S;

    const legs = [{ type: kind, side: "long", strike: K, premium: c, qty: 1 }];
    const res = payoffSVG({ legs, lo: 60, hi: 140, spot: S, spotLabel: T("到期价", "S"), uid: "ld" });
    $("#ld-chart").innerHTML = payoffBlock(res, [
      ["var(--green-soft)", T("盈利", "Profit")],
      ["var(--red-soft)", T("亏损", "Loss")],
      ["var(--gold)", T("行权价", "Strike")],
    ]);

    // 最大盈利/亏损/盈亏平衡（每股 ×100）
    $("#ld-ml").textContent = "−$" + (c * MULT).toFixed(0);
    if (kind === "call") {
      $("#ld-mp").textContent = T("理论无限", "∞");
      $("#ld-be").textContent = (K + c).toFixed(1);
    } else {
      $("#ld-mp").textContent = "+$" + ((K - c) * MULT).toFixed(0); // 标的跌到 0
      $("#ld-be").textContent = (K - c).toFixed(1);
    }

    // 期权这一张的到期盈亏与回报率
    const optPL = netPL(legs, S) * MULT;
    const optCost = c * MULT;
    const optRet = (optPL / optCost) * 100;
    $("#ld-opt-cost").textContent = "$" + optCost.toFixed(0);
    const optPLCell = $("#ld-opt-pl");
    optPLCell.textContent = (optPL >= 0 ? "+$" : "−$") + Math.abs(optPL).toFixed(0);
    optPLCell.style.color = optPL >= 0 ? "var(--green)" : "var(--red)";
    const optRetCell = $("#ld-opt-ret");
    optRetCell.textContent = (optRet >= 0 ? "+" : "") + optRet.toFixed(0) + "%";
    optRetCell.style.color = optRet >= 0 ? "var(--green)" : "var(--red)";

    // 直接买 100 股股票的到期盈亏与回报率（看跌方向时，做空才对称，这里按“买股票”口径）
    const stkPL = (S - SPOT) * MULT;
    const stkRet = ((S - SPOT) / SPOT) * 100;
    const stkPLCell = $("#ld-stk-pl");
    stkPLCell.textContent = (stkPL >= 0 ? "+$" : "−$") + Math.abs(stkPL).toFixed(0);
    stkPLCell.style.color = stkPL >= 0 ? "var(--green)" : "var(--red)";
    const stkRetCell = $("#ld-stk-ret");
    stkRetCell.textContent = (stkRet >= 0 ? "+" : "") + stkRet.toFixed(1) + "%";
    stkRetCell.style.color = stkPL >= 0 ? "var(--green)" : "var(--red)";

    const tip = kind === "call"
      ? T(`注意杠杆：同样押 100 股的上涨，期权只用 $${optCost.toFixed(0)} 本金、回报率被放大（也更易 −100% 归零）。盈亏平衡 = 行权价 + 权利金 = ${(K + c).toFixed(1)}，光涨到行权价还不够。`,
          `Notice the leverage: to bet on 100 shares' upside, the option risks only $${optCost.toFixed(0)} and amplifies the % return (and can hit −100%). Breakeven = strike + premium = ${(K + c).toFixed(1)}; reaching the strike alone isn't enough.`)
      : T(`买看跌押下跌：最大盈利 = (行权价−权利金)×100（标的跌到 0 封顶），不像看涨那样无限。盈亏平衡 = 行权价 − 权利金 = ${(K - c).toFixed(1)}。右栏“买股票”仅作对照（看跌其实对标的是做空敞口）。`,
          `A long put bets on a fall: max profit = (strike−premium)×100, capped at S=0 (unlike a call's unlimited upside). Breakeven = strike − premium = ${(K - c).toFixed(1)}. The "buy stock" column is for contrast only (a put is really short exposure).`);
    $("#ld-tip").textContent = tip;
  }

  $("#ld-seg").querySelectorAll("button").forEach((b) =>
    b.addEventListener("click", () => {
      kind = b.dataset.k;
      $("#ld-seg").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
      paint();
    }));
  [kSl, cSl, sSl].forEach((el) => el.addEventListener("input", paint));
  paint();
}
