// 交互演示：可筛选的速查卡。.demo-seg 切换 [损益公式 / 希腊字母 / 定价 / 策略选择]，
// 渲染对应参考卡（公式以文本呈现、希腊字母符号、策略速配）。每条标回扣阶段。一个会反复回来用的 recap。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const tabs = [
    { key: "pl", zh: "损益公式", en: "P&L formulas" },
    { key: "greeks", zh: "希腊字母", en: "Greeks" },
    { key: "pricing", zh: "定价", en: "Pricing" },
    { key: "strat", zh: "策略选择", en: "Strategy by view" },
  ];
  let active = "pl";

  // 一个公式卡片：标题、若干公式行（文本）、回扣阶段
  const card = (titleZh, titleEn, lines, refZh, refEn) => `
    <div class="detail" style="margin-top:10px">
      <div style="margin-bottom:8px"><span class="pill acc">${en ? titleEn : titleZh}</span>
        <span class="dk" style="margin-left:8px">${en ? refEn : refZh}</span></div>
      <div class="formula" style="margin:0">${lines.join("<br>")}</div>
    </div>`;

  function plCards() {
    return [
      card("买入看涨 Long Call", "Long Call",
        ["P&L = max(S − K, 0) − c",
         "最大亏损 = c　最大盈利 = 无上限",
         "盈亏平衡 BE = K + c"],
        T("回扣 1.1", "↩ Stage 1.1"), "↩ Stage 1.1"),
      card("买入看跌 Long Put", "Long Put",
        ["P&L = max(K − S, 0) − p",
         "最大亏损 = p　最大盈利 = K − p",
         "盈亏平衡 BE = K − p"],
        T("回扣 1.2", "↩ Stage 1.2"), "↩ Stage 1.2"),
      card("牛市看涨价差（借记）", "Bull Call Spread (debit)",
        ["买低 K1 / 卖高 K2，净付 D",
         "最大亏损 = D　最大盈利 = (K2 − K1) − D",
         "盈亏平衡 BE = K1 + D"],
        T("回扣 6.5", "↩ Stage 6.5"), "↩ Stage 6.5"),
      card("牛市看跌价差（贷记）", "Bull Put Spread (credit)",
        ["卖高 K2 / 买低 K1，净收 Cr，宽度 W = K2 − K1",
         "最大盈利 = Cr　最大亏损 = W − Cr",
         "盈亏平衡 BE = K2 − Cr"],
        T("回扣 6.5 · 11.2", "↩ Stage 6.5 · 11.2"), "↩ Stage 6.5 · 11.2"),
      card("跨式 Long Straddle", "Long Straddle",
        ["同 K 买 call + put，成本 = c + p",
         "最大亏损 = c + p（S 收在 K）",
         "双侧盈亏平衡 = K ± (c + p)"],
        T("回扣 7.1", "↩ Stage 7.1"), "↩ Stage 7.1"),
      card("铁鹰 Iron Condor", "Iron Condor",
        ["卖虚值 call 价差 + put 价差，净收 Cr，单侧宽 W",
         "最大盈利 = Cr　最大亏损 = W − Cr",
         "盈利区 = 两卖出行权价之间"],
        T("回扣 7.3", "↩ Stage 7.3"), "↩ Stage 7.3"),
    ].join("") + `
      <div class="scn-meta" style="margin-top:10px;padding:10px;background:var(--gold-soft);border-radius:8px">
        ${T("<b>万能口诀</b>：贷记类（收权利金）最大盈利 = 收到的权利金；借记类（付权利金）最大亏损 = 付出的权利金。记不住别的，先记这条。金额都 × 100。",
            "<b>One rule</b>: credit trades' max gain = credit received; debit trades' max loss = debit paid. If you remember nothing else, remember this. All amounts × 100.")}</div>`;
  }

  function greeksCards() {
    const rows = [
      ["Delta", T("标的每 ±1，期权价变多少；近似实值概率", "Δ price per ±1 in spot; ~prob ITM"), T("看涨 0→+1 · 看跌 −1→0", "call 0→+1 · put −1→0"), "5.2"],
      ["Gamma", T("Delta 的变化率（加速度）", "rate of change of Delta"), T("买方 + · 平值近到期最大", "long + · max ATM near expiry"), "5.3"],
      ["Theta", T("每过一天损失的时间价值", "value lost per day"), T("买方 − · 卖方 +", "long − · short +"), "5.4"],
      ["Vega", T("IV 每 ±1% 的影响", "per ±1% in IV"), T("买方 + · 远月/平值最大", "long + · max far/ATM"), "5.5"],
      ["Rho", T("利率每 ±1% 的影响", "per ±1% in rates"), T("长期期权才显著", "matters for long-dated"), "5.6"],
    ];
    return `
      <div class="detail" style="margin-top:10px">
        <div style="margin-bottom:8px"><span class="pill acc">${T("五个希腊字母与符号", "The five Greeks & signs")}</span></div>
        <table class="ochain" style="margin:0">
          <thead><tr>
            <th style="text-align:left">Greek</th>
            <th style="text-align:left">${T("它在算什么", "What it measures")}</th>
            <th>${T("买方符号 / 范围", "Long sign / range")}</th>
            <th>${T("回扣", "Ref")}</th>
          </tr></thead>
          <tbody>
            ${rows.map(([g, what, sign, ref]) => `<tr>
              <td class="strike-col" style="text-align:left">${g}</td>
              <td style="text-align:left;font-family:var(--sans);color:var(--text)">${what}</td>
              <td>${sign}</td>
              <td class="otm">${ref}</td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="formula" style="margin-top:10px">
        ${T("买入期权（多头）：Delta 看涨+/看跌− · Gamma + · Theta − · Vega +", "Long option: Delta call+/put− · Gamma + · Theta − · Vega +")}<br>
        ${T("卖出期权（空头）：全部取反 → Gamma − · Theta + · Vega −", "Short option: all flip → Gamma − · Theta + · Vega −")}
      </div>
      <div class="scn-meta" style="margin-top:8px">${T("卖方时间是朋友（Theta +）、买方时间是敌人——符号一翻，风险形态全变（回扣 5.1）。",
        "For sellers time is a friend (Theta +); for buyers it's the enemy — flip the signs and the whole risk shape flips (Stage 5.1).")}</div>`;
  }

  function pricingCards() {
    return `
      ${card("Black-Scholes（欧式）", "Black-Scholes (European)",
        ["d1 = [ln(S/K) + (r + σ²/2)·T] / (σ·√T)",
         "d2 = d1 − σ·√T",
         "Call = S·N(d1) − K·e^(−rT)·N(d2)",
         "Put  = K·e^(−rT)·N(−d2) − S·N(−d1)"],
        T("回扣 4.1 · 代码见 11.3", "↩ Stage 4.1 · code 11.3"), "↩ Stage 4.1 · code 11.3")}
      ${card("看跌看涨平价 Put-Call Parity", "Put-Call Parity",
        ["C − P = S − K·e^(−rT)",
         "即：买 call + 卖 put ≈ 持有标的（同 K、同到期）"],
        T("回扣 3.2 · 合成 7.5", "↩ Stage 3.2 · 7.5"), "↩ Stage 3.2 · 7.5")}
      <div class="scn-meta" style="margin-top:10px;padding:10px;background:var(--accent-soft);border-radius:8px">
        ${T("<b>经典对数锚</b>：S=K=100、T=1、r=5%、σ=20% → Call ≈ <b>10.45</b>，Delta ≈ 0.64。任何 BS 实现（含 AI 写的）先过这关（阶段 11.3、11.5）。N(·) = 标准正态累积分布。",
            "<b>Classic check</b>: S=K=100, T=1, r=5%, σ=20% → Call ≈ <b>10.45</b>, Delta ≈ 0.64. Any BS implementation (incl. AI-written) must pass this first (Stages 11.3, 11.5). N(·) = standard normal CDF.")}</div>`;
  }

  function stratCards() {
    const rows = [
      [T("强烈看涨", "Strongly bullish"), T("买入看涨 / 牛市看涨价差", "Long call / bull call spread"), "6.1 · 6.5"],
      [T("温和看涨 / 中性偏多", "Mildly bullish / neutral-up"), T("牛市看跌价差（贷记）/ 现金担保看跌", "Bull put spread / CSP"), "11.2 · 6.3"],
      [T("持股增收", "Income on stock"), T("备兑看涨", "Covered call"), "6.2"],
      [T("看跌 / 保护持仓", "Bearish / protect"), T("买入看跌 / 保护性看跌 / 领口", "Long put / protective put / collar"), "6.4 · 6.6"],
      [T("押会大动（不知方向）", "Big move, either way"), T("跨式 / 宽跨式（防财报 IV 崩塌）", "Straddle / strangle (mind IV crush)"), "7.1 · 11.6"],
      [T("押会盘整（区间收租）", "Range-bound / rent range"), T("铁鹰 / 蝶式", "Iron condor / butterfly"), "7.3 · 7.2"],
      [T("交易时间 / 期限", "Trade time / term"), T("日历价差", "Calendar spread"), "7.4"],
    ];
    return `
      <div class="detail" style="margin-top:10px">
        <div style="margin-bottom:8px"><span class="pill acc">${T("按市场观点选策略", "Pick a strategy by your view")}</span></div>
        <table class="ochain" style="margin:0">
          <thead><tr>
            <th style="text-align:left">${T("你的观点", "Your view")}</th>
            <th style="text-align:left">${T("常用结构", "Common structure")}</th>
            <th>${T("回扣", "Ref")}</th>
          </tr></thead>
          <tbody>
            ${rows.map(([view, strat, ref]) => `<tr>
              <td class="strike-col" style="text-align:left">${view}</td>
              <td style="text-align:left;font-family:var(--sans);color:var(--text)">${strat}</td>
              <td class="otm">${ref}</td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="scn-meta" style="margin-top:10px;padding:10px;background:var(--accent-soft);border-radius:8px">
        ${T("<b>下一步</b>：用 Python 跑公式画希腊字母（11.3）→ 亲手回测、老实扣成本（11.4）→ 搭 AI 工作流，AI 提速你把关（11.5）→ 永远先纸上交易、再小额实盘，把每个坑写进 checklist（11.6 · 8.6）。",
            "<b>Next</b>: run the formulas & plot Greeks in Python (11.3) → backtest honestly with costs (11.4) → build an AI workflow, AI accelerates you adjudicate (11.5) → always paper-trade then go small live, with every trap in your checklist (11.6 · 8.6).")}</div>`;
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">📑 ${T("速查卡：按需筛选，随时回来翻", "Cheat sheet: filter what you need, come back anytime")}</div>
      <div class="demo-seg" id="fs-tabs">
        ${tabs.map((t) => `<button data-k="${t.key}" class="${t.key === active ? "on" : ""}">${en ? t.en : t.zh}</button>`).join("")}
      </div>
      <div id="fs-body"></div>
      <p class="demo-tip">${T(
        "把这张卡当交易桌上压在玻璃板下的“地图册”——损益公式给起点/终点/盈亏平衡，希腊字母给图例（+/− 符号），定价给比例尺（BS + 平价），策略表给“想去哪走哪条路”的索引。每条都标了回扣阶段，看不懂就跳回去。",
        "Treat this as the map under the glass on your desk — P&L formulas give start/end/breakeven, the Greeks give the legend (+/− signs), pricing gives the scale (BS + parity), the strategy table is the 'which road to take' index. Each line cites the stage to jump back to."
      )}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);

  function paint() {
    const map = { pl: plCards, greeks: greeksCards, pricing: pricingCards, strat: stratCards };
    $("#fs-body").innerHTML = map[active]();
  }

  $("#fs-tabs").querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", () => {
      $("#fs-tabs").querySelectorAll("button").forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
      active = b.dataset.k;
      paint();
    });
  });

  paint();
}
