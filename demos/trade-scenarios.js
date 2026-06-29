// 交互演示：交易纪律情景测验。
// ~6 张 .scn 卡，每张一个诱人的坏决定（报复单、10×超仓、财报前裸卖、亏损摊低、
// 流动性差的 0.10/0.90 价差、没有退出计划）；用户选「纪律的做法」vs「冲动的做法」，
// 揭示后果 + .scn-meta。底部维护一个纪律分。

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // 每个情景：题干、两个选项（disciplined / impulsive）、各自后果。
  const scenarios = [
    {
      q: T("你刚亏了一笔 −$500。一股劲想立刻“赢回来”。下一单你？",
           "You just lost −$500 and feel an urge to win it back right now. Your next trade?"),
      disc: T("回到计划：照常规仓位，或干脆今天收手、冷静一下",
              "Stick to the plan: normal size, or stop trading for the day to cool off"),
      imp: T("把仓位翻倍，押下一单立刻扳回这 $500",
             "Double the size to win the $500 back on the very next trade"),
      meta: T("这是【报复性交易】。情绪覆盖规则，最常把一次小亏滚成灾难。亏损后应强制冷静期、绝不加码扳本。",
              "This is REVENGE TRADING. Emotion overrides rules and most often turns a small loss into a disaster. After a loss: forced cool-down, never up-size to get even."),
    },
    {
      q: T("账户 $20,000，每笔上限 1%（$200）。一个“必胜”机会出现，你想？",
           "Account $20,000, 1% cap per trade ($200). A 'sure thing' appears. You want to?"),
      disc: T("照 1% 规则：最坏亏损 ≤ $200，按最大亏损反推张数",
              "Honor the 1% rule: worst loss ≤ $200, size from max loss"),
      imp: T("这次例外，押上 10×（$2,000 风险），机会太好了",
             "Make an exception, bet 10× ($2,000 at risk) — it's too good to pass"),
      meta: T("这是【过度下注】，头号账户杀手。哪怕真有优势，一次 10× 的超仓踩雷就能重创账户（阶段 8.1 的爆仓风险）。规则没有“这次例外”。",
              "This is OVERSIZING, the #1 account killer. Even with a real edge, one 10× bet that hits a landmine can cripple the account (Stage 8.1 risk of ruin). Rules have no 'just this once'."),
    },
    {
      q: T("一只票明天盘后出财报，期权 IV 很高、权利金诱人。你考虑？",
           "A stock reports earnings tomorrow after close; option IV is high and premium is juicy. You consider?"),
      disc: T("不裸卖进财报；若要做，用定义好风险的价差（最大亏损封顶）",
              "Don't sell naked into earnings; if anything, use a defined-risk spread (capped loss)"),
      imp: T("财报前裸卖期权，收这笔肥权利金",
             "Sell naked options before earnings to pocket the fat premium"),
      meta: T("财报是【已知的大跳空】。裸卖（无限风险）等于在压路机加速时捡硬币；IV 虚高正是市场在为跳空定价。要做就用价差锁死最大亏损（阶段 8.3、8.4）。",
              "Earnings is a KNOWN GAP risk. Selling naked (unlimited risk) is picking up pennies as the steamroller accelerates; the high IV is the market pricing that gap. If anything, cap loss with a spread (Stages 8.3, 8.4)."),
    },
    {
      q: T("你买的看涨亏了 50%，论点已被证伪。你的处理？",
           "Your long call is down 50% and your thesis is now invalidated. You?"),
      disc: T("按预设止损离场，认这笔亏损，把资金留给下一个机会",
              "Exit at your preset stop, take the loss, save capital for the next setup"),
      imp: T("再加倍买入摊低成本，‘等它回来’",
             "Double down to average down and 'wait for it to come back'"),
      meta: T("这是【死扛亏损 + 摊低成本】（处置效应）。论点已错却加码，是把小亏变巨亏。期权还有 Theta 衰减，‘等它回来’越等越贵（阶段 5.4、8.6）。",
              "This is HOLDING A LOSER + AVERAGING DOWN (disposition effect). Adding to a broken thesis turns a small loss into a huge one. With Theta decay, 'waiting for it to come back' only gets costlier (Stages 5.4, 8.6)."),
    },
    {
      q: T("一个心仪的期权报价 bid $0.10 / ask $0.90（价差极宽、未平仓量极低）。你？",
           "An option you like quotes bid $0.10 / ask $0.90 (huge spread, tiny open interest). You?"),
      disc: T("跳过它，或改用流动性好（窄价差、高未平仓量）的合约/到期",
              "Skip it, or switch to a liquid contract/expiry (tight spread, high open interest)"),
      imp: T("直接按市价单买入，反正我看好方向",
             "Just market-buy it — I like the direction anyway"),
      meta: T("这是【无视流动性】。0.10/0.90 的价差意味着一进一出先亏掉巨大滑点，足以吃光你的全部优势。永远先查价差和未平仓量（阶段 2.4、10.6）。",
              "This is IGNORING LIQUIDITY. A 0.10/0.90 spread means round-trip slippage that can erase your entire edge. Always check spread and open interest first (Stages 2.4, 10.6)."),
    },
    {
      q: T("你正要开仓，但还没想好什么时候止盈、什么时候止损。你？",
           "You're about to open a trade but haven't decided when to take profit or cut losses. You?"),
      disc: T("开仓前先写下入场理由、目标、止损和最大可亏，再下单",
              "Write the entry reason, target, stop, and max loss BEFORE placing the order"),
      imp: T("先开仓再说，盘中看着走势随机应变",
             "Open first, then wing it based on how the price moves"),
      meta: T("这是【没有交易计划】。没有预设的止盈止损，盘中每个波动都交给情绪——而情绪系统性地犯错。用开仓前 checklist 把决策前置（阶段 8.6）。",
              "This is NO TRADING PLAN. Without preset exits, every wiggle is handed to emotion — which is systematically wrong. Front-load decisions with a pre-trade checklist (Stage 8.6)."),
    },
  ];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🧭 ${T("交易纪律测验：纪律的做法 vs 冲动的做法", "Trading-discipline quiz: the disciplined vs the impulsive move")}</div>
      <div class="demo-row">
        <div class="demo-meta">${T("逐题选择，看后果，攒纪律分。", "Pick on each card, see the consequence, build your discipline score.")}</div>
        <div><span class="pill acc">${T("纪律分", "Discipline")} <b id="ts-score">0</b> / ${scenarios.length}</span></div>
      </div>
      <div class="demo-bar" style="margin-bottom:6px"><span id="ts-bar"></span></div>
      <div id="ts-cards"></div>
      <p class="demo-tip" id="ts-tip">${T("规则在冷静时写好，在冲动时执行——这就是活下来的全部秘密。",
                                          "Rules are written when calm and executed when tempted — that's the whole secret to surviving.")}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const answered = new Array(scenarios.length).fill(null); // 'disc'|'imp'|null

  function render() {
    const cards = scenarios.map((s, i) => {
      const done = answered[i];
      const discCls = done === "disc" ? "primary sel" : "";
      const impCls = done === "imp" ? "sel" : "";
      let reveal = "";
      if (done) {
        const good = done === "disc";
        reveal = `<div class="scn-meta" style="border-left:3px solid ${good ? "var(--green)" : "var(--red)"};padding-left:10px;margin-top:10px">
          <b style="color:${good ? "var(--green)" : "var(--red)"}">${good ? T("✓ 纪律的做法", "✓ Disciplined") : T("✗ 冲动的做法", "✗ Impulsive")}</b> — ${s.meta}</div>`;
      }
      return `<div class="scn" data-i="${i}">
        <div class="scn-q"><b>${i + 1}.</b> ${s.q}</div>
        <div class="demo-btns">
          <button class="demo-btn ${discCls}" data-i="${i}" data-c="disc" ${done ? "disabled" : ""}>${s.disc}</button>
          <button class="demo-btn ${impCls}" data-i="${i}" data-c="imp" ${done ? "disabled" : ""}>${s.imp}</button>
        </div>
        ${reveal}
      </div>`;
    }).join("");
    $("#ts-cards").innerHTML = cards;

    const score = answered.filter((a) => a === "disc").length;
    const done = answered.filter((a) => a !== null).length;
    $("#ts-score").textContent = score;
    $("#ts-bar").style.width = (done / scenarios.length * 100) + "%";
    $("#ts-bar").style.background = score === done ? "var(--green)" : "var(--accent)";

    if (done === scenarios.length) {
      const perfect = score === scenarios.length;
      $("#ts-tip").innerHTML = perfect
        ? T(`<b>满分 ${score}/${scenarios.length}！</b> 你识破了全部六个经典账户杀手：报复交易、过度下注、财报裸卖、摊低亏损、无视流动性、没有计划。但记住——测验里看清很容易，<b>真金白银亏损当下还能照做，才是真功夫</b>。把这些写进你的 checklist 和交易日志（阶段 8.6）。`,
            `<b>Perfect ${score}/${scenarios.length}!</b> You spotted all six classic account killers: revenge, oversizing, naked-into-earnings, averaging down, ignoring liquidity, no plan. But remember — seeing it in a quiz is easy; <b>doing it while real money bleeds is the real skill</b>. Put these into your checklist and journal (Stage 8.6).`)
        : T(`你得了 <b>${score}/${scenarios.length}</b>。每一个“冲动的做法”都是真实账户的常见死法。回看你选冲动的那几张——它们对应的，正是把决策从情绪手里夺回、交给<b>事先写好的规则</b>所要防住的模式（阶段 8.6）。`,
            `You scored <b>${score}/${scenarios.length}</b>. Every 'impulsive' choice is a common way real accounts die. Revisit the ones you picked impulsively — they're exactly the patterns that pre-written rules, not in-the-moment emotion, exist to prevent (Stage 8.6).`);
    }
  }

  $("#ts-cards").addEventListener("click", (e) => {
    const btn = e.target.closest("button"); if (!btn) return;
    const i = +btn.dataset.i;
    if (answered[i]) return;
    answered[i] = btn.dataset.c;
    render();
  });

  render();
}
