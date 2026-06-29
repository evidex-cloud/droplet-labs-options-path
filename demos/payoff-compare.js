// 交互演示：期权 vs 股票 vs 期货 —— 损益“形状”的对比
// 分段切换三种工具，用同一个共享损益引擎画各自的到期损益（标的现价 100）。
// 重点：股票/期货是直线，期权是带拐点的折线。下方 .stat-row 列资金占用/最大亏损/杠杆。
import { payoffSVG, payoffBlock } from "./_payoff.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const SPOT = 100;
  const LO = 60, HI = 140;

  // 三种工具配置（每股口径；金额展示已按 ×100 合约/100 股折算）
  const INSTR = {
    stock: {
      label: T("持股", "Stock"),
      legs: [{ type: "stock", side: "long", entry: 100, qty: 1 }],
      shape: T("直线（线性、对称）", "Straight line (linear, symmetric)"),
      stats: [
        [T("资金占用", "Capital"), "$10,000", ""],
        [T("最大亏损", "Max loss"), "−$10,000", "neg"],
        [T("杠杆", "Leverage"), T("无 (1×)", "None (1×)"), ""],
      ],
      note: T(
        "买 100 股 = 全额 1 万元。涨跌 1:1，<b>一条 45° 直线</b>。最坏跌到 0（亏 1 万，但不会倒欠），没有到期、没有时间损耗。",
        "100 shares = full $10,000. Moves 1:1, <b>a 45° line</b>. Worst case zero (−$10,000, never owe more); no expiry, no time decay."
      ),
    },
    call: {
      label: T("买看涨", "Long Call"),
      legs: [{ type: "call", side: "long", strike: 105, premium: 5, qty: 1 }],
      shape: T("折线（不对称、有拐点）", "Kinked line (asymmetric, a bend)"),
      stats: [
        [T("资金占用", "Capital"), "$500", "acc"],
        [T("最大亏损", "Max loss"), "−$500", "neg"],
        [T("杠杆", "Leverage"), T("高·下行封顶", "High · floored"), ""],
      ],
      note: T(
        "1 张看涨（K=105, c=5）= 500 元。损益是<b>折线</b>：左边一条封顶的“地板”（最多亏 500），过 105 才 45° 上扬。<b>会因 Theta 随时间归零</b>——这是股票/期货都没有的。",
        "1 call (K=105, c=5) = $500. Payoff is a <b>kinked line</b>: a capped floor on the left (lose $500 max), rising 45° past 105. <b>Decays to zero via Theta</b> — unlike stock/futures."
      ),
    },
    futures: {
      label: T("期货", "Futures"),
      legs: [{ type: "stock", side: "long", entry: 100, qty: 1 }],  // 形状≈股票（线性），杠杆/义务在文案点明
      shape: T("直线（线性）· 但高杠杆+双向义务", "Straight line · but leveraged + two-way obligation"),
      stats: [
        [T("资金占用", "Capital"), T("约$1,000 保证金", "~$1,000 margin"), "acc"],
        [T("最大亏损", "Max loss"), T("可爆仓/倒欠", "Can blow up / owe"), "neg"],
        [T("杠杆", "Leverage"), T("高·双向", "High · two-way"), ""],
      ],
      note: T(
        "期货损益<b>形状和股票一样是直线</b>，但只交一小笔<b>保证金</b>（约 1000 元）就挂钩同等敞口——<b>杠杆双向放大</b>。双方都有义务，反向走要追保，扛不住<b>强平、甚至倒欠</b>。无时间损耗。",
        "Futures payoff is a <b>straight line like stock</b>, but you post only a small <b>margin</b> (~$1,000) for the same exposure — <b>leverage cuts both ways</b>. Both sides obligated; adverse moves trigger margin calls, forced liquidation, even owing money. No time decay."
      ),
    },
  };

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">📐 ${T("形状对比 · 股票 / 看涨 / 期货", "Shape Compare · Stock / Call / Futures")}</div>
      <div class="demo-seg" id="pc-seg">
        <button data-k="stock" class="on">${T("持股", "Stock")}</button>
        <button data-k="call">${T("买看涨", "Long Call")}</button>
        <button data-k="futures">${T("期货", "Futures")}</button>
      </div>

      <div class="scn" id="pc-shape" style="margin-top:12px"></div>
      <div id="pc-chart" style="margin-top:12px"></div>
      <div class="stat-row" id="pc-stats"></div>
      <p class="demo-tip" id="pc-note"></p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  const seg = $("#pc-seg");

  function render(key) {
    const it = INSTR[key];

    $("#pc-shape").innerHTML =
      `<div class="scn-q">${T("到期损益形状", "Payoff shape at expiry")}：<b>${it.shape}</b></div>`;

    const res = payoffSVG({
      legs: it.legs, lo: LO, hi: HI, spot: SPOT,
      spotLabel: T("现价", "Spot"), uid: "pc-" + key,
    });
    $("#pc-chart").innerHTML = payoffBlock(res, [
      ["var(--green-soft)", T("盈利", "Profit")],
      ["var(--red-soft)", T("亏损", "Loss")],
    ]);

    $("#pc-stats").innerHTML = it.stats
      .map(([k, v, cls]) => `<div class="stat"><div class="k">${k}</div><div class="v ${cls}">${v}</div></div>`)
      .join("");

    $("#pc-note").innerHTML = it.note;
  }

  seg.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    seg.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b === btn));
    render(btn.dataset.k);
  });

  render("stock");
}
