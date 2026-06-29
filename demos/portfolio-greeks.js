// 交互演示：组合希腊字母。预设结构（多头跨式 / 备兑开仓 / 牛市看涨价差）或自定义加腿。
// 把每条腿的希腊字母 × 张数 × 100（空头取负）相加 → 净 Delta/Gamma/Theta/Vega（一张合约金额口径）。
// 展示“Delta 中性也能有巨大 Gamma/Vega”。真算：greeks() per leg。
import { greeks } from "./_bs.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // 共同市场参数（每条腿可有自己的 K、type、side、qty；到期/IV 统一）
  const S = 100, r = 0.04, sigma = 0.2, days = 30, M = 100; // 合约乘数
  const Tyr = days / 365;

  // 预设：legs 数组。stock 腿 type:'stock'（每股 delta ±1，其余 0）。
  const PRESETS = {
    straddle: {
      label: T("多头跨式", "Long straddle"),
      legs: [
        { type: "call", side: "long", K: 100, qty: 1 },
        { type: "put", side: "long", K: 100, qty: 1 },
      ],
    },
    covered: {
      label: T("备兑开仓", "Covered call"),
      legs: [
        { type: "stock", side: "long", qty: 1 }, // 1 “手” = 100 股
        { type: "call", side: "short", K: 105, qty: 1 },
      ],
    },
    bullcall: {
      label: T("牛市看涨价差", "Bull call spread"),
      legs: [
        { type: "call", side: "long", K: 100, qty: 1 },
        { type: "call", side: "short", K: 110, qty: 1 },
      ],
    },
  };

  let legs = PRESETS.straddle.legs.map((l) => ({ ...l }));

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🧮 ${T("组合希腊字母：净暴露 = Σ(每腿 × 张数 ×100，空头取负)", "Portfolio Greeks: net = Σ(each leg × qty ×100, short negated)")}</div>

      <div class="demo-row" style="margin-bottom:4px">
        <div class="demo-seg" id="pg-preset">
          <button data-p="straddle" class="on">${PRESETS.straddle.label}</button>
          <button data-p="covered">${PRESETS.covered.label}</button>
          <button data-p="bullcall">${PRESETS.bullcall.label}</button>
        </div>
      </div>
      <div class="demo-meta">${T(`统一参数：标的 S=${S}、到期 ${days} 天、IV ${sigma * 100}%、利率 ${r * 100}%。希腊字母为“一张合约 (×100)”金额口径。`, `Shared: S=${S}, ${days}d, IV ${sigma * 100}%, r ${r * 100}%. Greeks shown per-contract (×100), in dollars.`)}</div>

      <div class="legs" id="pg-legs"></div>

      <div class="demo-btns">
        <button class="demo-btn" data-add="call-long">+ ${T("买看涨", "Buy call")}</button>
        <button class="demo-btn" data-add="call-short">+ ${T("卖看涨", "Sell call")}</button>
        <button class="demo-btn" data-add="put-long">+ ${T("买看跌", "Buy put")}</button>
        <button class="demo-btn" data-add="put-short">+ ${T("卖看跌", "Sell put")}</button>
        <button class="demo-btn" data-add="stock-long">+ ${T("买100股", "Buy 100sh")}</button>
      </div>

      <div class="detail" style="margin-top:6px">
        <div class="dk" style="margin-bottom:8px">${T("组合净希腊字母（一张合约口径）", "Net portfolio Greeks (per-contract)")}</div>
        <div class="stat-row">
          <div class="stat"><div class="k">${T("净 Delta (股)", "Net Delta (sh)")}</div><div class="v acc" id="pg-delta">–</div></div>
          <div class="stat"><div class="k">${T("净 Gamma", "Net Gamma")}</div><div class="v" id="pg-gamma">–</div></div>
          <div class="stat"><div class="k">${T("净 Theta /天", "Net Theta /day")}</div><div class="v" id="pg-theta">–</div></div>
          <div class="stat"><div class="k">${T("净 Vega /1%", "Net Vega /1%")}</div><div class="v" id="pg-vega">–</div></div>
        </div>
      </div>

      <p class="demo-tip" id="pg-tip"></p>
    </div>`;

  const $ = (id) => root.querySelector(id);

  // 计算单腿“每股”希腊字母（stock 腿特判）
  function legGreeks(leg) {
    if (leg.type === "stock") return { price: S, delta: 1, gamma: 0, theta: 0, vega: 0, rho: 0 };
    return greeks({ S, K: leg.K, T: Tyr, r, sigma, type: leg.type });
  }
  const sign = (leg) => (leg.side === "long" ? 1 : -1);
  // 一条腿对净希腊字母的贡献：sign × qty × 100 × 每股值。stock 的 qty=“手”，1 手=100 股 → 同样 ×100。
  const contrib = (leg, key) => sign(leg) * leg.qty * M * legGreeks(leg)[key];

  function legLabel(leg) {
    if (leg.type === "stock") return T("100 股标的", "100 shares");
    const t = leg.type === "call" ? "Call" : "Put";
    return `${t} K=${leg.K}`;
  }

  function renderLegs() {
    $("#pg-legs").innerHTML = legs.map((leg, i) => {
      const sideCls = leg.side === "long" ? "side-buy" : "side-sell";
      const sideTxt = leg.side === "long" ? T("买", "Long") : T("卖", "Short");
      const pill = leg.type === "stock" ? "" :
        `<span class="leg-pill ${leg.type}">${leg.type === "call" ? "CALL" : "PUT"}</span>`;
      const g = legGreeks(leg);
      const per = leg.type === "stock"
        ? T("Δ +1/股", "Δ +1/sh")
        : `Δ ${g.delta.toFixed(2)} Γ ${g.gamma.toFixed(3)} Θ ${g.theta.toFixed(3)} ν ${g.vega.toFixed(3)}`;
      return `
        <div class="leg">
          <span class="${sideCls}">${sideTxt}</span>
          ${pill}
          <span>${legLabel(leg)}</span>
          <span class="leg-tag">× ${leg.qty}</span>
          <span class="leg-tag">${per}</span>
          <button class="x" data-del="${i}" title="${T("删除", "remove")}">×</button>
        </div>`;
    }).join("") || `<div class="demo-meta">${T("（空组合，添加几条腿）", "(empty — add some legs)")}</div>`;
  }

  function paint() {
    renderLegs();
    const nd = legs.reduce((s, l) => s + contrib(l, "delta"), 0);
    const ng = legs.reduce((s, l) => s + contrib(l, "gamma"), 0);
    const nt = legs.reduce((s, l) => s + contrib(l, "theta"), 0);
    const nv = legs.reduce((s, l) => s + contrib(l, "vega"), 0);

    $("#pg-delta").textContent = (nd >= 0 ? "+" : "") + nd.toFixed(0);
    $("#pg-gamma").textContent = (ng >= 0 ? "+" : "") + ng.toFixed(2);
    $("#pg-theta").textContent = (nt >= 0 ? "+" : "") + nt.toFixed(1);
    $("#pg-vega").textContent = (nv >= 0 ? "+" : "") + nv.toFixed(1);
    // 着色：按符号
    $("#pg-gamma").className = "v " + (ng > 0.01 ? "pos" : ng < -0.01 ? "neg" : "");
    $("#pg-theta").className = "v " + (nt > 0.5 ? "pos" : nt < -0.5 ? "neg" : "");
    $("#pg-vega").className = "v " + (nv > 0.5 ? "pos" : nv < -0.5 ? "neg" : "");

    const deltaNeutral = Math.abs(nd) < 15;
    let msg;
    if (deltaNeutral && (Math.abs(ng) > 1 || Math.abs(nv) > 1)) {
      msg = T(
        `⚠️ <b>净 Delta ≈ ${nd.toFixed(0)} 股（接近中性）</b>，但净 Gamma ${ng.toFixed(1)}、净 Vega ${nv.toFixed(1)} 都不小——<b>“没方向”不等于没风险！</b> 这个组合不赌方向，却重仓押 ${ng > 0 ? "标的大动 / IV 上涨（+Gamma +Vega）" : "标的不动 / IV 下跌（−Gamma −Vega）"}，每天 Theta ${nt.toFixed(1)}。这正是组合希腊字母的核心一课（阶段 5.7）。`,
        `⚠️ <b>Net Delta ≈ ${nd.toFixed(0)} sh (near neutral)</b>, yet net Gamma ${ng.toFixed(1)} and Vega ${nv.toFixed(1)} are large — <b>"no direction" ≠ no risk!</b> This book doesn't bet direction but heavily bets ${ng > 0 ? "a big move / rising IV (+Gamma +Vega)" : "calm / falling IV (−Gamma −Vega)"}, with daily Theta ${nt.toFixed(1)}. The core lesson of portfolio Greeks (Stage 5.7).`
      );
    } else {
      msg = T(
        `净 Delta ${nd.toFixed(0)} 股是方向暴露；净 Gamma ${ng.toFixed(1)}、Theta ${nt.toFixed(1)}、Vega ${nv.toFixed(1)} 各管一个维度。希腊字母<b>直接相加</b>（空头取负、×张数×100）——任何复杂组合都能压成这四个数。切到<b>备兑</b>看 −Gamma/−Vega/+Theta（卖波动率），切到<b>价差</b>看 Gamma/Vega 被两腿对冲掉。`,
        `Net Delta ${nd.toFixed(0)} sh is direction; net Gamma ${ng.toFixed(1)}, Theta ${nt.toFixed(1)}, Vega ${nv.toFixed(1)} each own a dimension. Greeks <b>add directly</b> (short negated, × qty ×100) — any book compresses to these four numbers. Switch to <b>covered call</b> for −Gamma/−Vega/+Theta (selling vol); to the <b>spread</b> to see Gamma/Vega largely cancel between legs.`
      );
    }
    $("#pg-tip").innerHTML = msg;
  }

  // 预设切换
  $("#pg-preset").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    legs = PRESETS[b.dataset.p].legs.map((l) => ({ ...l }));
    [...$("#pg-preset").children].forEach((c) => c.classList.toggle("on", c === b));
    paint();
  });

  // 加腿（自定义；落在“当前自定义”状态，取消预设高亮）
  root.querySelectorAll("[data-add]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const [type, side] = btn.dataset.add.split("-");
      if (type === "stock") legs.push({ type: "stock", side: "long", qty: 1 });
      else legs.push({ type, side, K: 100, qty: 1 });
      [...$("#pg-preset").children].forEach((c) => c.classList.remove("on"));
      paint();
    }));

  // 删腿（事件委托）
  $("#pg-legs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-del]"); if (!b) return;
    legs.splice(+b.dataset.del, 1);
    [...$("#pg-preset").children].forEach((c) => c.classList.remove("on"));
    paint();
  });

  paint();
}
