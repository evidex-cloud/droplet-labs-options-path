// 交互演示：盈亏平衡 & 回报计算器
// .demo-seg 选 [买入看涨 / 买入看跌 / 牛市看涨价差]，滑块调行权价与权利金。
// 显示盈亏平衡(可两个)、最大盈利、最大亏损、风险回报比；payoffSVG 画图，netPL 交叉验证。
import { payoffSVG, payoffBlock, netPL } from "./_payoff.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;
  const LO = 60, HI = 140, SPOT = 100;

  let strat = "longcall";

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🎯 ${T("盈亏平衡 & 回报计算器", "Breakeven & Return Calculator")}</div>
      <div class="demo-seg" id="bc-seg" style="margin-bottom:6px">
        <button data-s="longcall" class="on">${T("买入看涨", "Long Call")}</button>
        <button data-s="longput">${T("买入看跌", "Long Put")}</button>
        <button data-s="bullcall">${T("牛市看涨价差", "Bull Call Spread")}</button>
      </div>

      <div id="bc-controls"></div>

      <div id="bc-chart"></div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("盈亏平衡", "Breakeven")}</div><div class="v acc" id="bc-be">–</div></div>
        <div class="stat"><div class="k">${T("最大盈利/张", "Max profit")}</div><div class="v pos" id="bc-mp">–</div></div>
        <div class="stat"><div class="k">${T("最大亏损/张", "Max loss")}</div><div class="v neg" id="bc-ml">–</div></div>
        <div class="stat"><div class="k">${T("风险回报比", "Reward∶Risk")}</div><div class="v" id="bc-rr">–</div></div>
      </div>

      <div id="bc-detail"></div>

      <p class="demo-tip">${T("公式与图上的圆点应当一致：看涨 BE=K+权利金、看跌 BE=K−权利金、价差 BE=低腿K+净权利金。风险回报比只是赔率——还要乘上胜率才是期望(见阶段 8.6)。",
        "The formula and the dots on the chart should agree: call BE=K+prem, put BE=K−prem, spread BE=long strike+net debit. Reward∶Risk is only the odds — multiply by win-rate for expectancy (see 8.6).")}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);

  function controlsHTML() {
    if (strat === "bullcall") {
      return `
        <div class="demo-grid">
          <div class="demo-block"><label class="demo-label">${T("买入腿行权价 K1", "Long strike K1")} = <b id="bc-k1v">100</b></label><input class="demo-slider" id="bc-k1" type="range" min="85" max="110" step="1" value="100"/></div>
          <div class="demo-block"><label class="demo-label">${T("卖出腿行权价 K2", "Short strike K2")} = <b id="bc-k2v">110</b></label><input class="demo-slider" id="bc-k2" type="range" min="95" max="125" step="1" value="110"/></div>
          <div class="demo-block"><label class="demo-label">${T("买入腿权利金 c1", "Long prem c1")} = <b id="bc-c1v">6.5</b></label><input class="demo-slider" id="bc-c1" type="range" min="1" max="15" step="0.5" value="6.5"/></div>
          <div class="demo-block"><label class="demo-label">${T("卖出腿权利金 c2", "Short prem c2")} = <b id="bc-c2v">2.5</b></label><input class="demo-slider" id="bc-c2" type="range" min="0.5" max="12" step="0.5" value="2.5"/></div>
        </div>`;
    }
    const label = strat === "longcall" ? T("看涨", "call") : T("看跌", "put");
    return `
      <div class="demo-grid">
        <div class="demo-block"><label class="demo-label">${T("行权价 K", "Strike K")} = <b id="bc-kv">100</b></label><input class="demo-slider" id="bc-k" type="range" min="80" max="120" step="1" value="100"/></div>
        <div class="demo-block"><label class="demo-label">${T("权利金", "Premium")} (${label}) = <b id="bc-cv">5.0</b></label><input class="demo-slider" id="bc-c" type="range" min="1" max="15" step="0.5" value="5"/></div>
      </div>`;
  }

  function getLegs() {
    if (strat === "longcall") {
      const K = +$("#bc-k").value, c = +$("#bc-c").value;
      return { legs: [{ type: "call", side: "long", strike: K, premium: c, qty: 1 }], meta: { K, c } };
    }
    if (strat === "longput") {
      const K = +$("#bc-k").value, c = +$("#bc-c").value;
      return { legs: [{ type: "put", side: "long", strike: K, premium: c, qty: 1 }], meta: { K, c } };
    }
    // bull call spread
    let K1 = +$("#bc-k1").value, K2 = +$("#bc-k2").value;
    const c1 = +$("#bc-c1").value, c2 = +$("#bc-c2").value;
    if (K2 <= K1) K2 = K1 + 1; // 保证卖腿行权价更高
    return {
      legs: [
        { type: "call", side: "long", strike: K1, premium: c1, qty: 1 },
        { type: "call", side: "short", strike: K2, premium: c2, qty: 1 },
      ],
      meta: { K1, K2, c1, c2 },
    };
  }

  function paint() {
    // 同步滑块标签
    if (strat === "bullcall") {
      $("#bc-k1v").textContent = $("#bc-k1").value;
      $("#bc-k2v").textContent = $("#bc-k2").value;
      $("#bc-c1v").textContent = (+$("#bc-c1").value).toFixed(1);
      $("#bc-c2v").textContent = (+$("#bc-c2").value).toFixed(1);
    } else {
      $("#bc-kv").textContent = $("#bc-k").value;
      $("#bc-cv").textContent = (+$("#bc-c").value).toFixed(1);
    }

    const { legs, meta } = getLegs();
    const res = payoffSVG({ legs, lo: LO, hi: HI, spot: SPOT, spotLabel: T("现价", "spot"), uid: "bc" });
    $("#bc-chart").innerHTML = payoffBlock(res, [
      ["var(--green-soft)", T("盈利", "Profit")],
      ["var(--red-soft)", T("亏损", "Loss")],
      ["var(--gold)", T("行权价", "Strike")],
    ]);

    // 闭式计算 + netPL 交叉验证
    let beTxt, maxProfit, maxLoss, beFormula, mpInf = false;
    if (strat === "longcall") {
      const { K, c } = meta;
      const be = K + c;
      beTxt = be.toFixed(1);
      maxLoss = c * MULT;
      mpInf = true;
      beFormula = `BE = K + ${T("权利金", "prem")} = ${K} + ${c} = ${be.toFixed(1)}`;
    } else if (strat === "longput") {
      const { K, c } = meta;
      const be = K - c;
      beTxt = be.toFixed(1);
      maxLoss = c * MULT;
      maxProfit = (K - c) * MULT; // 标的到 0
      beFormula = `BE = K − ${T("权利金", "prem")} = ${K} − ${c} = ${be.toFixed(1)}`;
    } else {
      const { K1, K2, c1, c2 } = meta;
      const K2e = K2 <= K1 ? K1 + 1 : K2;
      const net = c1 - c2;               // 净付出
      const be = K1 + net;
      beTxt = be.toFixed(1);
      maxProfit = ((K2e - K1) - net) * MULT;
      maxLoss = net * MULT;
      beFormula = `BE = K1 + (c1−c2) = ${K1} + (${c1}−${c2}) = ${be.toFixed(1)}`;
    }

    // netPL 交叉验证盈亏平衡（用引擎找到的圆点）
    const beEngine = res.breakevens.map((b) => b.toFixed(1)).join(" / ") || "—";
    $("#bc-be").textContent = res.breakevens.length ? beEngine : beTxt;
    $("#bc-mp").textContent = mpInf ? T("理论无限", "∞") : "+$" + maxProfit.toFixed(0);
    $("#bc-ml").textContent = "−$" + maxLoss.toFixed(0);

    let rr;
    if (mpInf) rr = T("无限", "∞");
    else rr = (maxProfit / maxLoss).toFixed(2) + " ∶ 1";
    $("#bc-rr").textContent = rr;

    // 详情：公式 + 回报率 + netPL 抽检
    const probe = strat === "longput" ? (meta.K - meta.c - 4) : (meta.K !== undefined ? meta.K + (meta.c || 0) + 5 : 115);
    const checkS = strat === "bullcall" ? (meta.K2 + 5) : probe;
    const checkPL = (netPL(legs, checkS) * MULT).toFixed(0);
    const retTxt = mpInf
      ? T("（上行无封顶，回报率随标的上涨而升）", "(uncapped — return rises with the underlying)")
      : T("最大回报率 = 最大盈利 ÷ 最大亏损 = ", "Max return = max profit ÷ max loss = ") +
        ((maxProfit / maxLoss) * 100).toFixed(0) + "%";
    $("#bc-detail").innerHTML = `
      <div class="detail">
        <div><span class="dk">${T("盈亏平衡公式", "Breakeven formula")}：</span><span class="num">${beFormula}</span></div>
        <div style="margin-top:6px"><span class="dk">${retTxt ? "" : ""}</span>${retTxt}</div>
        <div style="margin-top:6px" class="dk">${T("引擎交叉验证", "Engine cross-check")}：netPL(@S=${checkS.toFixed(0)}) = <span class="num">${checkPL >= 0 ? "+$" : "−$"}${Math.abs(checkPL)}</span> / ${T("张", "ctr")}</div>
      </div>`;
  }

  function rebuild() {
    $("#bc-controls").innerHTML = controlsHTML();
    $("#bc-controls").querySelectorAll("input").forEach((el) => el.addEventListener("input", paint));
    paint();
  }

  $("#bc-seg").querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", () => {
      $("#bc-seg").querySelectorAll("button").forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
      strat = b.dataset.s;
      rebuild();
    });
  });

  rebuild();
}
