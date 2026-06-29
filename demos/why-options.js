// 交互演示：为什么需要期权 —— 保险 / 杠杆 / 收租 三个动机
// 分段切换三种场景，每种给出一个具体数字情景 + 一张到期损益图（共享引擎），
// 并用 .stat-row 列出关键数字。标的统一现价 100。
import { payoffSVG, payoffBlock } from "./_payoff.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;
  const SPOT = 100;

  // 三种场景的配置
  const CASES = {
    insure: {
      label: T("保险", "Insurance"),
      legs: [
        { type: "stock", side: "long", entry: 100, qty: 1 },
        { type: "put", side: "long", strike: 95, premium: 3, qty: 1 },
      ],
      lo: 60, hi: 140,
      desc: T(
        "持有 100 股（成本 100），再买 1 张行权价 95、保费 <b>3 元/股</b> 的看跌期权（一张 <b>300 元</b>）。这就是给股票上了一份“下跌险”。",
        "Hold 100 shares (cost 100), plus 1 put at strike 95 costing <b>3/sh</b> (<b>$300</b> a contract). That is a downside insurance policy on the stock."
      ),
      stats: [
        ["k", T("保费(每张)", "Premium /contract"), "−$300", "neg"],
        ["k", T("最大亏损(组合)", "Max loss (combo)"), "−$800", "neg"],
        ["k", T("跌到 70 时", "If S = 70"), "−$800", "neg"],
      ],
      note: T(
        "看跌把“跌到 70”的 3000 元亏损，封顶到了 800 元 = (100−95 + 3)×100。涨了则保险作废，只损失 300 元保费，股票照样赚。",
        "The put caps a 70-print loss from $3000 down to $800 = (100−95 + 3)×100. If it rises, the put lapses (−$300) and the stock still profits."
      ),
    },
    leverage: {
      label: T("杠杆", "Leverage"),
      legs: [{ type: "call", side: "long", strike: 105, premium: 5, qty: 1 }],
      lo: 70, hi: 140,
      desc: T(
        "看好上涨，但不想花 <b>10,000 元</b> 买 100 股。改花 <b>500 元</b> 买 1 张行权价 105、权利金 5 的看涨期权——用小钱博大涨。",
        "Bullish, but you don't want to spend <b>$10,000</b> on 100 shares. Instead spend <b>$500</b> on 1 call at strike 105, premium 5 — a small stake on a big move."
      ),
      stats: [
        ["k", T("买100股需", "100 shares cost"), "$10,000", ""],
        ["k", T("买1张看涨", "1 call costs"), "$500", "acc"],
        ["k", T("涨到130 (期权)", "S=130 (option)"), "+$2,000", "pos"],
      ],
      note: T(
        "涨到 130：看涨每股 max(130−105,0)−5 = 20，一张赚 2000（+400%）；而 100 股只赚 3000（+30%）。看错最多亏 500 元，下行封死。",
        "At 130: the call earns max(130−105,0)−5 = 20/sh → $2000 a contract (+400%); 100 shares earn only $3000 (+30%). Wrong? You lose $500 max — floor."
      ),
    },
    income: {
      label: T("收租", "Income"),
      legs: [{ type: "put", side: "short", strike: 95, premium: 3, qty: 1 }],
      lo: 60, hi: 140,
      desc: T(
        "换位当<b>卖方</b>。卖出 1 张行权价 95、权利金 3 的看跌，先把 <b>300 元</b> 权利金收进口袋（需备好保证金/接货现金）。",
        "Flip to the <b>seller</b> side. Sell 1 put at strike 95, premium 3, collecting <b>$300</b> up front (margin / cash to take assignment required)."
      ),
      stats: [
        ["k", T("先收权利金", "Premium collected"), "+$300", "pos"],
        ["k", T("最大盈利", "Max gain"), "+$300", "pos"],
        ["k", T("跌到88时", "If S = 88"), "−$400", "neg"],
      ],
      note: T(
        "到期 S≥95：买方不行权，300 元全赚。跌破 95 就被指派、按 95 接货：跌到 88，每股亏 (95−88)−3 = 4，一张亏 400 元。收益封顶、风险敞开——这就是卖方。",
        "If S≥95 at expiry, keep the full $300. Below 95 you're assigned at 95: at 88 you lose (95−88)−3 = 4/sh → $400. Capped gain, open risk — the seller's deal."
      ),
    },
  };

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🎯 ${T("为什么需要期权 · 三个动机", "Why Options · Three Motives")}</div>
      <div class="demo-seg" id="wo-seg">
        <button data-k="insure" class="on">${T("① 保险", "① Insure")}</button>
        <button data-k="leverage">${T("② 杠杆", "② Leverage")}</button>
        <button data-k="income">${T("③ 收租", "③ Income")}</button>
      </div>
      <div class="scn" id="wo-scn" style="margin-top:12px"></div>
      <div id="wo-chart" style="margin-top:12px"></div>
      <div class="stat-row" id="wo-stats"></div>
      <p class="demo-tip" id="wo-note"></p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  const seg = $("#wo-seg");

  function render(key) {
    const c = CASES[key];
    $("#wo-scn").innerHTML = `<div class="scn-q">${c.desc}</div>`;

    const res = payoffSVG({
      legs: c.legs, lo: c.lo, hi: c.hi, spot: SPOT,
      spotLabel: T("现价", "Spot"), uid: "wo-" + key,
    });
    $("#wo-chart").innerHTML = payoffBlock(res, [
      ["var(--green-soft)", T("盈利", "Profit")],
      ["var(--red-soft)", T("亏损", "Loss")],
    ]);

    $("#wo-stats").innerHTML = c.stats
      .map(([, k, v, cls]) => `<div class="stat"><div class="k">${k}</div><div class="v ${cls}">${v}</div></div>`)
      .join("");

    $("#wo-note").innerHTML = c.note;
  }

  seg.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    seg.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b === btn));
    render(btn.dataset.k);
  });

  render("insure");
}
