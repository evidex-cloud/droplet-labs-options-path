// 交互演示：一笔定义好风险的交易，端到端 6 步 .scn 步进器，数字一路串下来。
// 例子：XYZ=100，温和偏多 → 牛市看跌价差（卖 95 / 买 90，~32DTE）。
// 数字与引擎一致：净贷记 0.70/股 → 收 $70；最大亏损 $430；盈亏平衡 94.30；
// 短腿 ~ -0.25 Delta → POP ~75%；50% 止盈买回 0.35 / 留 $35。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // 交易的核心数字（每股口径，金额 ×100）
  const D = {
    spot: 100, sellK: 95, buyK: 90, dte: 32,
    sellMid: 1.40, buyMid: 0.70,            // 两腿中间价
    credit: 0.70, width: 5,                  // 净贷记、宽度
  };
  const maxProfit = +(D.credit * 100).toFixed(0);          // 70
  const maxLoss = +((D.width - D.credit) * 100).toFixed(0); // 430
  const be = +(D.sellK - D.credit).toFixed(2);             // 94.30
  const ror = (maxProfit / maxLoss * 100).toFixed(0);      // 16
  const target = (D.credit / 2).toFixed(2);                // 0.35
  const keep = (maxProfit / 2).toFixed(0);                 // 35

  const steps = [
    {
      icon: "💡", zh: "① 形成论点", en: "① Thesis",
      qZh: `XYZ 现价 <b>$${D.spot}</b>。你的研究结论：未来约 ${D.dte} 天 <b>温和偏多到中性</b>，关键是<b>不会跌破 $${D.sellK}</b>（有支撑、近期无财报）。`,
      qEn: `XYZ at <b>$${D.spot}</b>. Your research: <b>mildly bullish-to-neutral</b> over ~${D.dte} days — the key call is it <b>won't break $${D.sellK}</b> (support holds, no earnings soon).`,
      metaZh: `论点决定策略。你赌的是“<b>不大跌</b>”，不是“<b>大涨</b>”——所以不该买看涨（要真涨上去才赚），而该用一个“只要不大跌就赚”的结构。`,
      metaEn: `The thesis picks the strategy. You're betting on "<b>no big drop</b>", not "<b>a big rally</b>" — so not a long call (which needs an actual rise) but a structure that pays if it simply doesn't fall hard.`,
    },
    {
      icon: "🧩", zh: "② 选策略", en: "② Strategy",
      qZh: `选 <b>牛市看跌价差</b>（贷记）：<span class="side-sell">卖出 ${D.sellK} 看跌</span> + <span class="side-buy">买入 ${D.buyK} 看跌</span>，同到期。净<b>收</b>权利金，下方风险被买腿封死。`,
      qEn: `Use a <b>bull put credit spread</b>: <span class="side-sell">sell the ${D.sellK} put</span> + <span class="side-buy">buy the ${D.buyK} put</span>, same expiry. Net <b>credit</b> in, downside capped by the long put.`,
      metaZh: `“不大跌就赚”天然对应<b>卖看跌</b>；但裸卖风险大、占保证金多。再<b>买一个更低行权价的看跌当保险</b>，就把尾部锁死——这就是定义好风险的价差。Theta 站在你这边。`,
      metaEn: `"No big drop ⇒ profit" naturally means <b>selling a put</b>; but naked is risky and margin-heavy. <b>Buying a lower put as insurance</b> caps the tail — a defined-risk spread. Theta works for you.`,
    },
    {
      icon: "📋", zh: "③ 挑到期/行权价", en: "③ Pick expiry/strikes",
      qZh: `从期权链选 <b>${D.dte} 天</b>到期。卖腿挑 ~0.25 Delta 的虚值看跌 = <b>${D.sellK}</b>（中间价 ${D.sellMid}），买腿 <b>${D.buyK}</b>（中间价 ${D.buyMid}），构成 <b>$${D.width} 宽</b>价差。`,
      qEn: `From the chain pick the <b>${D.dte}-day</b> expiry. Short leg ~0.25-delta OTM put = <b>${D.sellK}</b> (mid ${D.sellMid}), long leg <b>${D.buyK}</b> (mid ${D.buyMid}) → a <b>$${D.width}-wide</b> spread.`,
      metaZh: `30–45 天是收租型价差甜区（Theta 与容错平衡）。净中间价 = ${D.sellMid} − ${D.buyMid} = <b>${D.credit.toFixed(2)}</b>，这就是你想收的权利金（阶段 2.1 读链）。`,
      metaEn: `30–45 days is the sweet spot (balancing Theta and room for error). Net mid = ${D.sellMid} − ${D.buyMid} = <b>${D.credit.toFixed(2)}</b> — the credit you aim to collect (Stage 2.1).`,
    },
    {
      icon: "🔬", zh: "④ 查希腊/流动性", en: "④ Greeks/liquidity",
      qZh: `两腿都<b>窄价差、高未平仓量</b> ✓。净 Delta ≈ <b>+0.13</b>（温和偏多）、净 <b>Theta &gt; 0</b>。短腿 ~ −0.25 Delta → 粗略 <b>POP ≈ 75%</b>。`,
      qEn: `Both legs <b>tight spread, high open interest</b> ✓. Net Delta ≈ <b>+0.13</b> (mildly bullish), net <b>Theta &gt; 0</b>. Short leg ~ −0.25 Delta → rough <b>POP ≈ 75%</b>.`,
      metaZh: `下单前的体检：流动性差（如 0.10/0.90）直接跳过（阶段 11.6）。三个关键数已知 → <b>收 $${maxProfit}（最大盈利）/ 最大亏损 $${maxLoss} / 盈亏平衡 ${be}</b>，回报∶风险 ≈ <b>${ror}%</b>。觉得这个赔率可接受才继续。`,
      metaEn: `Pre-trade check: skip illiquid (e.g. 0.10/0.90) names (Stage 11.6). The three numbers are known → <b>collect $${maxProfit} (max gain) / max loss $${maxLoss} / BE ${be}</b>, reward∶risk ≈ <b>${ror}%</b>. Proceed only if the odds are acceptable.`,
    },
    {
      icon: "🧾", zh: "⑤ 挂限价组合单", en: "⑤ Limit combo order",
      qZh: `作为<b>一个组合单</b>、按净中间价挂限价 <b>贷记 ${D.credit.toFixed(2)}</b>。成交后立刻收 <b>$${maxProfit}</b>，冻结约 <b>$${maxLoss}</b> 保证金（=最大亏损）。`,
      qEn: `Place it as <b>one combo order</b>, limit at net mid <b>credit ${D.credit.toFixed(2)}</b>. On fill you collect <b>$${maxProfit}</b> and ~<b>$${maxLoss}</b> margin is held (= max loss).`,
      metaZh: `期权铁律：<b>永远限价、锚中间价</b>（阶段 2.5）。价差必须整体成交，<b>别拆两条腿分别下</b>——否则可能只成交一条、裸着另一半（腿险）。不立刻成交可小幅调价逼近，别直接收两腿 bid。`,
      metaEn: `Iron rule: <b>always limit, anchored to mid</b> (Stage 2.5). Fill the spread as one unit; <b>don't leg in separately</b> or you may fill one side and be naked the other (leg risk). Nudge the price if needed; don't just hit both bids.`,
    },
    {
      icon: "🎯", zh: "⑥ 管理 → 收尾", en: "⑥ Manage → exit",
      qZh: `<b>止盈</b>：赚到 50%（价差从 ${D.credit.toFixed(2)} 跌到 <b>${target}</b>）买回，落袋 <b>$${keep}</b>。<b>止损</b>：浮亏 1–2× 权利金或<b>跌破 ${be}</b>就认输。`,
      qEn: `<b>Take profit</b>: at 50% (spread from ${D.credit.toFixed(2)} down to <b>${target}</b>) buy back, keep <b>$${keep}</b>. <b>Stop</b>: at 1–2× credit loss or <b>below ${be}</b>, bail.`,
      metaZh: `<b>开仓前就写好出场</b>（阶段 8.6）。到期若 XYZ&gt;${D.sellK}：两看跌作废、留全部 $${maxProfit}（多数人 50% 就走了）。若跌破区间：别裸等到期（指派/钉住，阶段 11.6），主动平仓把亏损锁在已知范围。论点已错就止损，不要一味滚动。`,
      metaEn: `<b>Write exits before entry</b> (Stage 8.6). At expiry if XYZ&gt;${D.sellK}: both puts expire worthless, keep all $${maxProfit} (most exit at 50% first). If it breaks the range: don't sit to expiry (assignment/pin risk, Stage 11.6) — close and lock the loss in a known range. If the thesis is wrong, stop out; don't just roll.`,
    },
  ];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🚶 ${T("一笔交易的全流程：点 6 步，数字一路串下来", "One trade, end to end: click the 6 steps, numbers carry through")}</div>
      <div id="tw-steps" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:6px"></div>

      <div class="scn" id="tw-detail" style="margin-top:10px"></div>

      <div class="stat-row" style="margin-top:12px">
        <div class="stat"><div class="k">${T("净贷记/张", "Credit/contract")}</div><div class="v pos">+$${maxProfit}</div></div>
        <div class="stat"><div class="k">${T("最大亏损", "Max loss")}</div><div class="v neg">−$${maxLoss}</div></div>
        <div class="stat"><div class="k">${T("盈亏平衡", "Breakeven")}</div><div class="v">${be}</div></div>
        <div class="stat"><div class="k">${T("回报/风险", "Reward/risk")}</div><div class="v acc">${ror}%</div></div>
      </div>

      <p class="demo-tip">${T(
        "全程一句话：<b>论点 → 定义好风险的价差 → 从链挑到期/行权价 → 查希腊/流动性 → 中间价限价组合单 → 写好止盈止损</b>。三个关键数（收 $" + maxProfit + " / 亏 $" + maxLoss + " / BE " + be + "）在<b>按下单之前</b>就全知道——这正是“定义好风险”的意义。教育演示，非投资建议。",
        "In one line: <b>thesis → defined-risk spread → pick expiry/strikes from the chain → check Greeks/liquidity → limit combo at mid → write exits first</b>. All three numbers (collect $" + maxProfit + " / risk $" + maxLoss + " / BE " + be + ") are known <b>before</b> you click buy — that's what 'defined risk' means. Educational, not advice."
      )}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  let active = 0;

  function renderSteps() {
    $("#tw-steps").innerHTML = steps.map((s, i) => {
      const on = i === active;
      const arrow = i < steps.length - 1 ? `<span style="color:var(--muted)">→</span>` : "";
      return `<button class="demo-btn ${on ? "primary" : ""}" data-i="${i}" style="padding:7px 11px;font-size:13px">${s.icon.slice(0, 2)} ${en ? s.en : s.zh}</button>${arrow}`;
    }).join("");
  }

  function renderDetail() {
    const s = steps[active];
    $("#tw-detail").innerHTML = `
      <div class="scn-q">${s.icon} ${en ? s.en : s.zh}</div>
      <div style="font-size:14.5px;line-height:1.75;margin-bottom:8px">${en ? s.qEn : s.qZh}</div>
      <div class="scn-meta" style="border-left:3px solid var(--accent);padding-left:11px">${en ? s.metaEn : s.metaZh}</div>
      <div class="demo-row" style="margin-top:12px">
        <button class="demo-btn" id="tw-prev" ${active === 0 ? "disabled" : ""}>← ${T("上一步", "Prev")}</button>
        <span class="dk">${active + 1} / ${steps.length}</span>
        <button class="demo-btn ${active < steps.length - 1 ? "primary" : ""}" id="tw-next" ${active === steps.length - 1 ? "disabled" : ""}>${T("下一步", "Next")} →</button>
      </div>`;
    $("#tw-prev").addEventListener("click", () => { if (active > 0) { active--; renderSteps(); renderDetail(); } });
    $("#tw-next").addEventListener("click", () => { if (active < steps.length - 1) { active++; renderSteps(); renderDetail(); } });
  }

  $("#tw-steps").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    active = +b.dataset.i;
    renderSteps();
    renderDetail();
  });

  renderSteps();
  renderDetail();
}
