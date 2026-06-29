// 旗舰演示：多腿损益图构建器
// 预设按钮加载经典策略 → 以 .legs 列出各腿（可单独删除）→ payoffSVG 画组合损益 →
// .stat-row 显示 最大盈利/最大亏损/盈亏平衡(可多个) → 还能用小控件自定义加一条腿。
// 全部真算：组合盈亏 = 各腿 netPL 之和；max/min 通过在宽区间采样 netPL 估计。
import { payoffSVG, payoffBlock, netPL } from "./_payoff.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;
  const LO = 60, HI = 140, SPOT = 100;

  // 预设策略（每股口径；stock 腿用 entry）
  const PRESETS = {
    longcall: {
      name: T("买入看涨", "Long Call"),
      legs: [{ type: "call", side: "long", strike: 100, premium: 5, qty: 1 }],
    },
    longput: {
      name: T("买入看跌", "Long Put"),
      legs: [{ type: "put", side: "long", strike: 100, premium: 5, qty: 1 }],
    },
    coveredcall: {
      name: T("备兑看涨", "Covered Call"),
      legs: [
        { type: "stock", side: "long", entry: 100, qty: 1 },
        { type: "call", side: "short", strike: 105, premium: 3, qty: 1 },
      ],
    },
    bullcall: {
      name: T("牛市看涨价差", "Bull Call Spread"),
      legs: [
        { type: "call", side: "long", strike: 100, premium: 6.5, qty: 1 },
        { type: "call", side: "short", strike: 110, premium: 2.5, qty: 1 },
      ],
    },
    straddle: {
      name: T("跨式", "Straddle"),
      legs: [
        { type: "call", side: "long", strike: 100, premium: 4, qty: 1 },
        { type: "put", side: "long", strike: 100, premium: 4, qty: 1 },
      ],
    },
  };

  let legs = PRESETS.longcall.legs.map((l) => ({ ...l }));

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🗺️ ${T("损益图构建器 · 叠腿造策略", "Payoff Builder · stack legs into strategies")}</div>
      <div class="demo-btns" id="pb-presets">
        <button class="demo-btn" data-p="longcall">${PRESETS.longcall.name}</button>
        <button class="demo-btn" data-p="longput">${PRESETS.longput.name}</button>
        <button class="demo-btn" data-p="coveredcall">${PRESETS.coveredcall.name}</button>
        <button class="demo-btn" data-p="bullcall">${PRESETS.bullcall.name}</button>
        <button class="demo-btn" data-p="straddle">${PRESETS.straddle.name}</button>
        <button class="demo-btn" data-p="clear">${T("清空", "Clear")}</button>
      </div>

      <div class="legs" id="pb-legs"></div>

      <div class="cmp" style="grid-template-columns:1fr 1fr 1fr 1fr;align-items:end;margin-bottom:6px">
        <div>
          <div class="demo-label">${T("类型", "Type")}</div>
          <select class="demo-inp" id="pb-type">
            <option value="call">${T("看涨 Call", "Call")}</option>
            <option value="put">${T("看跌 Put", "Put")}</option>
            <option value="stock">${T("股票 Stock", "Stock")}</option>
          </select>
        </div>
        <div>
          <div class="demo-label">${T("方向", "Side")}</div>
          <select class="demo-inp" id="pb-side">
            <option value="long">${T("买入 Long", "Long")}</option>
            <option value="short">${T("卖出 Short", "Short")}</option>
          </select>
        </div>
        <div>
          <div class="demo-label">${T("行权价/成本", "Strike/Entry")} <b id="pb-kv">100</b></div>
          <input class="demo-slider" id="pb-k" type="range" min="70" max="130" step="1" value="100"/>
        </div>
        <div>
          <div class="demo-label">${T("权利金", "Premium")} <b id="pb-cv">4.0</b></div>
          <input class="demo-slider" id="pb-c" type="range" min="0.5" max="20" step="0.5" value="4"/>
        </div>
      </div>
      <button class="demo-btn primary" id="pb-add" style="margin-bottom:6px">+ ${T("加入这条腿", "Add this leg")}</button>

      <div id="pb-chart"></div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("最大盈利", "Max profit")}</div><div class="v pos" id="pb-mp">–</div></div>
        <div class="stat"><div class="k">${T("最大亏损", "Max loss")}</div><div class="v neg" id="pb-ml">–</div></div>
        <div class="stat"><div class="k">${T("盈亏平衡", "Breakeven")}</div><div class="v acc" id="pb-be">–</div></div>
        <div class="stat"><div class="k">${T("净权利金", "Net premium")}</div><div class="v" id="pb-net">–</div></div>
      </div>

      <p class="demo-tip">${T("点预设看经典形状，或用下方控件自定义加腿。组合曲线 = 各腿在每个价位上纵向相加。绿区赚/红区亏，圆点是盈亏平衡(可能两个)，金色竖线是行权价。金额均 ×100/张。",
        "Click a preset or add custom legs below. The combined curve sums each leg vertically at every price. Green = profit, red = loss; dots are breakevens (can be two), gold lines are strikes. All amounts ×100 per contract.")}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);

  // 估计最大盈利/亏损。左端价格地板在 0（标的不会为负）→ 左侧永远有界，只取样到 0；
  // 只有右端(S→∞)才可能真正无界：由“净敞口斜率”判断——净多头股 + 净多头看涨为正斜率(盈利无界)、
  // 净空头看涨为负斜率(亏损无界)。看跌在右端斜率为 0，股票/看涨决定右尾。
  function extremes() {
    const lo = 0, hi = 400, n = 1600;
    let mn = Infinity, mx = -Infinity;
    for (let i = 0; i <= n; i++) {
      const S = lo + (hi - lo) * (i / n);
      const y = netPL(legs, S);
      if (y < mn) mn = y;
      if (y > mx) mx = y;
    }
    // 右端渐近斜率：每单位 S 的净变化（股票=±1、看涨多头=+1/空头=−1、看跌→0）
    let slopeR = 0;
    for (const l of legs) {
      const sgn = l.side === "short" ? -1 : 1;
      const q = l.qty == null ? 1 : l.qty;
      if (l.type === "stock") slopeR += sgn * q;
      else if (l.type === "call") slopeR += sgn * q;
      // put 在 S→∞ 斜率为 0
    }
    const profitUnbounded = slopeR > 1e-9;   // 右端持续上行
    const lossUnbounded = slopeR < -1e-9;    // 右端持续下行
    return { mn, mx, profitUnbounded, lossUnbounded };
  }

  function legRow(leg, i) {
    const buy = leg.side === "long";
    const sideCls = buy ? "side-buy" : "side-sell";
    const sideTxt = buy ? T("买入", "BUY") : T("卖出", "SELL");
    if (leg.type === "stock") {
      return `<div class="leg">
        <span class="${sideCls}">${sideTxt}</span>
        <span class="leg-pill" style="background:var(--accent-soft);color:var(--accent-ink)">${T("股票", "STOCK")}</span>
        <span class="leg-tag">${leg.qty * MULT} ${T("股 @ ", "sh @ ")}${leg.entry}</span>
        <button class="x" data-i="${i}" title="${T("移除", "remove")}">×</button>
      </div>`;
    }
    const pillCls = leg.type === "call" ? "call" : "put";
    const pillTxt = leg.type === "call" ? "CALL" : "PUT";
    return `<div class="leg">
      <span class="${sideCls}">${sideTxt}</span>
      <span class="leg-pill ${pillCls}">${pillTxt}</span>
      <span class="leg-tag">K=${leg.strike}　${T("权利金", "prem")} ${leg.premium.toFixed(1)}　×${leg.qty}</span>
      <button class="x" data-i="${i}" title="${T("移除", "remove")}">×</button>
    </div>`;
  }

  function paint() {
    // 腿列表
    if (legs.length === 0) {
      $("#pb-legs").innerHTML = `<div class="leg" style="justify-content:center;color:var(--muted)">${T("（空仓——点上方预设或加一条腿）", "(empty — pick a preset or add a leg)")}</div>`;
    } else {
      $("#pb-legs").innerHTML = legs.map((l, i) => legRow(l, i)).join("");
      $("#pb-legs").querySelectorAll(".x").forEach((b) => {
        b.addEventListener("click", () => { legs.splice(+b.dataset.i, 1); paint(); });
      });
    }

    // 损益图
    const res = payoffSVG({ legs: legs.length ? legs : [{ type: "call", side: "long", strike: 1e9, premium: 0, qty: 1 }], lo: LO, hi: HI, spot: SPOT, spotLabel: T("现价", "spot"), uid: "pb" });
    $("#pb-chart").innerHTML = payoffBlock(res, [
      ["var(--green-soft)", T("盈利", "Profit")],
      ["var(--red-soft)", T("亏损", "Loss")],
      ["var(--gold)", T("行权价", "Strike")],
    ]);

    // 统计
    if (legs.length === 0) {
      $("#pb-mp").textContent = "–"; $("#pb-ml").textContent = "–"; $("#pb-be").textContent = "–"; $("#pb-net").textContent = "–";
      return;
    }
    const { mn, mx, profitUnbounded, lossUnbounded } = extremes();
    $("#pb-mp").textContent = profitUnbounded ? T("理论无限", "∞") : "+$" + (mx * MULT).toFixed(0);
    $("#pb-ml").textContent = lossUnbounded ? T("理论无限", "∞") : (mn >= 0 ? "$0" : "−$" + Math.abs(mn * MULT).toFixed(0));

    const bes = res.breakevens;
    $("#pb-be").textContent = bes.length === 0 ? "—" : bes.map((b) => b.toFixed(1)).join(" / ");

    // 净权利金（含 stock 现金流：买股 = 付出，按口径计为负的现金流仅展示期权净权利金更直观，这里只算期权腿）
    let net = 0;
    for (const l of legs) {
      if (l.type === "stock") continue;
      net += (l.side === "long" ? -1 : 1) * l.premium * l.qty;
    }
    const netCell = $("#pb-net");
    const netAmt = net * MULT;
    netCell.textContent = (net >= 0 ? T("+收 $", "+$") : T("−付 $", "−$")) + Math.abs(netAmt).toFixed(0);
    netCell.className = "v " + (net >= 0 ? "pos" : "neg");
  }

  // 预设按钮
  $("#pb-presets").querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", () => {
      const p = b.dataset.p;
      if (p === "clear") legs = [];
      else legs = PRESETS[p].legs.map((l) => ({ ...l }));
      paint();
    });
  });

  // 自定义加腿
  const kSl = $("#pb-k"), cSl = $("#pb-c"), typeSel = $("#pb-type");
  function syncControls() {
    $("#pb-kv").textContent = kSl.value;
    $("#pb-cv").textContent = (+cSl.value).toFixed(1);
    // 股票腿隐藏权利金语义（权利金滑块对 stock 无意义，禁用）
    const isStock = typeSel.value === "stock";
    cSl.disabled = isStock;
    cSl.style.opacity = isStock ? ".4" : "1";
  }
  kSl.addEventListener("input", syncControls);
  cSl.addEventListener("input", syncControls);
  typeSel.addEventListener("change", syncControls);
  $("#pb-add").addEventListener("click", () => {
    const type = typeSel.value, side = $("#pb-side").value;
    const K = +kSl.value, c = +cSl.value;
    if (type === "stock") legs.push({ type: "stock", side, entry: K, qty: 1 });
    else legs.push({ type, side, strike: K, premium: c, qty: 1 });
    paint();
  });

  syncControls();
  paint();
}
