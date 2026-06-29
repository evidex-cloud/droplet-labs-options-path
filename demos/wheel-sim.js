// 交互演示：现金担保看跌 + 轮动(the Wheel)
// 上半：卖出看跌的损益图 + stat-row(最大盈利/被指派成本/盈亏平衡)。
// 下半：用 .scn 情景卡分步走一遍 Wheel 循环（卖看跌 → 接/不接 → 卖备兑 → 卖出/不卖 → 再卖看跌），
// 每步累计收到的权利金，结尾给一句 demo-tip。全部真算（netPL）。
import { payoffSVG, payoffBlock, netPL } from "./_payoff.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;

  const Kp = 95, cp = 3;       // 卖出看跌：行权价 95，收 3
  const Kc = 105, cc = 3;      // 接股后卖备兑看涨：行权价 105，收 3
  const ASSIGN_COST = Kp - cp; // 被指派后实际成本 92

  // Wheel 步骤脚本（每步：标题、说明、本步现金流、累计权利金、是否“持股中”）
  const steps = [
    {
      t: T("① 卖现金担保看跌", "① Sell a cash-secured put"),
      d: T(`卖出 K=${Kp} 的看跌，收 ${cp} 元/股 = +$${cp * MULT}，并锁住 $${Kp * MULT} 现金备接货。`,
           `Sell a K=${Kp} put, collect ${cp}/sh = +$${cp * MULT}, and lock $${Kp * MULT} cash to buy if assigned.`),
      cash: cp * MULT, hold: false,
    },
    {
      t: T("② 股价跌破 → 被指派接股", "② Price dips → assigned the shares"),
      d: T(`股价跌破 ${Kp}，被指派，按 ${Kp} 买入 100 股。实际成本 = ${Kp}−${cp} = $${ASSIGN_COST}/股。`,
           `Price falls below ${Kp}; assigned 100 shares at ${Kp}. Net cost = ${Kp}−${cp} = $${ASSIGN_COST}/sh.`),
      cash: 0, hold: true,
    },
    {
      t: T("③ 卖备兑看涨", "③ Sell a covered call"),
      d: T(`对手中 100 股卖出 K=${Kc} 的看涨，再收 ${cc} 元/股 = +$${cc * MULT}。继续薅时间价值。`,
           `Against the 100 shares, sell a K=${Kc} call, collect another ${cc}/sh = +$${cc * MULT}.`),
      cash: cc * MULT, hold: true,
    },
    {
      t: T("④ 股价涨过 → 被指派卖出", "④ Price rises → called away"),
      d: T(`股价涨过 ${Kc}，被指派按 ${Kc} 卖出。股票从 ${ASSIGN_COST} 成本卖到 ${Kc}，赚 $${(Kc - ASSIGN_COST) * MULT}。`,
           `Price rises above ${Kc}; called away at ${Kc}. Stock from $${ASSIGN_COST} cost to ${Kc} = +$${(Kc - ASSIGN_COST) * MULT}.`),
      cash: (Kc - ASSIGN_COST) * MULT, hold: false,
    },
    {
      t: T("⑤ 回到第①步，循环", "⑤ Back to step ①, repeat"),
      d: T("手里又只剩现金，再卖一张看跌，轮动继续。每转一圈都在收权利金。",
           "You're back to cash; sell another put and the Wheel turns again — collecting premium each loop."),
      cash: 0, hold: false,
    },
  ];

  let si = 0;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🎡 ${T("现金担保看跌 + 轮动(the Wheel)", "Cash-Secured Put + the Wheel")}</div>

      <div style="font-size:13.5px;color:var(--muted);margin-bottom:6px">${T("先看“卖出看跌”这一条腿的损益：", "First, the payoff of the short-put leg:")}</div>
      <div id="ws-chart"></div>
      <div class="stat-row">
        <div class="stat"><div class="k">${T("最大盈利", "Max profit")}</div><div class="v pos" id="ws-mp">–</div></div>
        <div class="stat"><div class="k">${T("被指派成本/股", "Assigned cost/sh")}</div><div class="v acc" id="ws-ac">–</div></div>
        <div class="stat"><div class="k">${T("盈亏平衡", "Breakeven")}</div><div class="v" id="ws-be">–</div></div>
        <div class="stat"><div class="k">${T("最大亏损(至S=0)", "Max loss (to S=0)")}</div><div class="v neg" id="ws-ml">–</div></div>
      </div>

      <div style="font-size:13.5px;color:var(--muted);margin:18px 0 6px">${T("再一步步走一遍轮动循环：", "Now step through the Wheel cycle:")}</div>
      <div class="scn" id="ws-scn"></div>
      <div class="bar2" style="margin-top:12px">
        <span class="lab">${T("累计权利金", "Premium so far")}</span>
        <div class="track"><div class="fill" id="ws-bar" style="background:var(--accent)"></div></div>
        <span class="val" id="ws-cum">$0</span>
      </div>
      <div class="demo-btns">
        <button class="demo-btn" id="ws-prev">← ${T("上一步", "Prev")}</button>
        <button class="demo-btn primary" id="ws-next">${T("下一步", "Next")} →</button>
        <button class="demo-btn" id="ws-reset">${T("重置", "Reset")}</button>
      </div>

      <p class="demo-tip">${T(`卖看跌 = 被付钱等折扣价：没跌破白赚权利金，跌破则以 $${ASSIGN_COST}/股 接货。轮动靠持续收租获利，但下行风险≈直接持股——崩盘时被指派后照样大亏，权利金只是薄缓冲。`,
        `Selling a put = getting paid to wait for a discount: keep the premium if it holds, or buy at $${ASSIGN_COST}/sh if assigned. The Wheel earns from steady premium, but its downside ≈ owning the stock — a crash still hurts; premium is only a thin cushion.`)}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);

  // 静态：卖出看跌损益图
  const putLegs = [{ type: "put", side: "short", strike: Kp, premium: cp, qty: 1 }];
  const res = payoffSVG({ legs: putLegs, lo: 60, hi: 140, spot: 100, spotLabel: T("现价", "spot"), uid: "ws" });
  $("#ws-chart").innerHTML = payoffBlock(res, [
    ["var(--green-soft)", T("盈利", "Profit")],
    ["var(--red-soft)", T("亏损", "Loss")],
    ["var(--gold)", T("行权价", "Strike")],
  ]);
  $("#ws-mp").textContent = "+$" + (cp * MULT).toFixed(0);
  $("#ws-ac").textContent = "$" + ASSIGN_COST.toFixed(0);
  $("#ws-be").textContent = ASSIGN_COST.toFixed(1);
  // 最大亏损：股价跌到 0，netPL = -(Kp - cp)
  $("#ws-ml").textContent = "−$" + Math.abs(netPL(putLegs, 0) * MULT).toFixed(0);

  const maxCum = steps.reduce((a, s) => a + s.cash, 0);

  function cumThrough(i) {
    let a = 0;
    for (let j = 0; j <= i; j++) a += steps[j].cash;
    return a;
  }

  function paint() {
    const s = steps[si];
    const cum = cumThrough(si);
    $("#ws-scn").innerHTML = `
      <div class="scn-q"><b>${s.t}</b></div>
      <div style="font-size:14px;line-height:1.65;color:var(--text)">${s.d}</div>
      <div class="scn-meta">
        ${T("本步现金流", "Cash flow this step")}: <b style="color:${s.cash > 0 ? "var(--green)" : "var(--muted)"}">${s.cash > 0 ? "+$" + s.cash : "$0"}</b>
        　·　${T("此刻", "Now")}: <b>${s.hold ? T("持有 100 股", "holding 100 sh") : T("持有现金", "holding cash")}</b>
        　·　${T("步骤", "Step")} ${si + 1}/${steps.length}
      </div>`;
    $("#ws-cum").textContent = "$" + cum.toFixed(0);
    $("#ws-bar").style.width = (cum / maxCum * 100).toFixed(1) + "%";
    $("#ws-prev").disabled = si === 0;
    $("#ws-next").disabled = si === steps.length - 1;
  }

  $("#ws-next").addEventListener("click", () => { if (si < steps.length - 1) { si++; paint(); } });
  $("#ws-prev").addEventListener("click", () => { if (si > 0) { si--; paint(); } });
  $("#ws-reset").addEventListener("click", () => { si = 0; paint(); });
  paint();
}
