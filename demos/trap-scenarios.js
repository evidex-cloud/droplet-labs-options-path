// 交互演示：6 张 .scn 陷阱卡。每张一个真实机制陷阱（除息提前指派、钉住、财报IV崩塌、
// 流动性差、自动行权、过度杠杆）；用户在“安全做法 vs 危险做法”中选，揭示后果 + .scn-meta。
// 底部维护一个“避坑分”。强调：这些是方向之外的机制性风险，下单时看不见。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const traps = [
    {
      tag: T("除息前提前指派", "Ex-dividend early assignment"),
      qZh: "你卖了一张<b>深度实值</b>的看涨（备兑）。标的<b>明天除息</b>，你这张看涨的剩余时间价值只剩 $0.03，而股息 $0.40。你？",
      qEn: "You're short a <b>deep-ITM</b> covered call. The stock goes <b>ex-dividend tomorrow</b>; your call has only $0.03 time value left vs a $0.40 dividend. You?",
      safeZh: "今天主动平仓或滚动这张看涨，避开除息前被提前指派",
      safeEn: "Close or roll the call today, before ex-div early assignment",
      riskZh: "什么都不做，反正还没到期",
      riskEn: "Do nothing — it's not expiration yet",
      metaZh: "美式看涨可<b>随时行权</b>。当深度实值看涨的<b>剩余时间价值 &lt; 股息</b>，持有者会抢在除息日前行权领息——被指派的就是你，提前一天失去头寸、还可能拆散价差。<b>怎么避开：临近除息、深度实值且时间价值薄时，主动平仓/滚动，盯紧除息日历</b>（阶段 2.4）。",
      metaEn: "American calls exercise <b>any time</b>. When a deep-ITM call's <b>time value &lt; dividend</b>, holders exercise before ex-div to grab the dividend — and you get assigned, losing the position a day early and maybe breaking a spread. <b>Avoid: when near ex-div, deep ITM, thin time value, close/roll; watch the dividend calendar</b> (Stage 2.4).",
    },
    {
      tag: T("钉住风险", "Pin risk"),
      qZh: "到期日，你空头看跌的标的价<b>恰好贴在行权价 $50 附近</b>来回晃。你？",
      qEn: "On expiration day, your short put's underlying is <b>hovering right at the $50 strike</b>. You?",
      safeZh: "直接平仓，了结“会不会被指派”的不确定性",
      safeEn: "Close the position, ending the assignment uncertainty",
      riskZh: "赌它不会被指派，放到收盘",
      riskEn: "Bet it won't be assigned, hold to the close",
      metaZh: "这是<b>钉住风险</b>：价≈行权价时，是否被指派<b>高度不确定</b>。你以为不会，结果被指派、周一开盘多出 100 股的<b>裸露方向敞口</b>，承担意外的隔夜跳空。<b>怎么避开：临界时主动平仓了结不确定性，别赌</b>（阶段 2.4、11.6）。",
      metaEn: "This is <b>pin risk</b>: at price≈strike, assignment is <b>highly uncertain</b>. You assume no, get assigned, and Monday open you're long 100 shares of <b>naked directional exposure</b> with surprise gap risk. <b>Avoid: close at the pin to end the uncertainty — don't gamble</b> (Stages 2.4, 11.6).",
    },
    {
      tag: T("财报 IV 崩塌", "Earnings IV crush"),
      qZh: "一只票<b>明天盘后出财报</b>，期权 IV 冲到很高、权利金很贵。你想赌它大动，于是？",
      qEn: "A stock <b>reports after the close tomorrow</b>; option IV is sky-high and premium rich. You want to bet on a big move, so you?",
      safeZh: "明白高 IV 已为跳空定价，避开“财报前买贵期权”这个坑",
      safeEn: "Recognize high IV already prices the gap; skip buying pricey pre-earnings premium",
      riskZh: "财报前买入平值跨式，赌它大动",
      riskEn: "Buy an ATM straddle before earnings to bet on a move",
      metaZh: "财报是<b>已知的大跳空</b>，IV 冲高正是市场在<b>为它定价</b>。财报前买期权 = <b>买在最贵</b>；财报一出不确定性消失，<b>IV 崩塌（vol crush）</b>，哪怕股价真动了，Vega 暴跌也可能让你<b>方向对却亏钱</b>。<b>怎么避开：别赌“买贵的赌大动”，没有免费午餐；要做就用定义好风险的结构</b>（阶段 4.2、5.5、8.6）。",
      metaEn: "Earnings is a <b>known gap</b>; the IV spike is the market <b>pricing it in</b>. Buying before earnings = <b>buying at the most expensive</b>; once it's out, uncertainty vanishes, <b>IV crushes</b>, and even if the stock moves, collapsing Vega can leave you <b>right on direction yet losing money</b>. <b>Avoid: no free lunch in buying pricey pre-earnings premium; if anything use defined-risk</b> (Stages 4.2, 5.5, 8.6).",
    },
    {
      tag: T("流动性差", "Poor liquidity"),
      qZh: "你看中的期权报价 <b>bid $0.10 / ask $0.90</b>，未平仓量极低。你看好方向，于是？",
      qEn: "An option you like quotes <b>bid $0.10 / ask $0.90</b> with tiny open interest. You like the direction, so you?",
      safeZh: "跳过它，改用窄价差、高未平仓量的合约/到期",
      safeEn: "Skip it; switch to a tight-spread, high-open-interest contract",
      riskZh: "直接市价买入，反正方向看对",
      riskEn: "Just market-buy it — the direction is right",
      metaZh: "<b>0.10/0.90</b> 的价差意味着你买按 ask、卖按 bid，<b>一进一出先亏掉巨大滑点</b>，足以吃光全部优势；想平仓时还可能没人接你的价。<b>怎么避开：下单前必查价差与未平仓量，优先流动性好的合约</b>（阶段 2.1、10.6）。",
      metaEn: "A <b>0.10/0.90</b> spread means you buy at ask, sell at bid — <b>round-trip slippage that can erase your entire edge</b>, and you may find no one to take your price on exit. <b>Avoid: always check spread and open interest first; prefer liquid contracts</b> (Stages 2.1, 10.6).",
    },
    {
      tag: T("自动行权意外", "Auto-exercise surprise"),
      qZh: "你买的看涨到期时<b>勉强实值</b>（S 比 K 高 $0.05），你本只想赚权利金差价、没钱接 100 股。你？",
      qEn: "Your long call expires <b>barely ITM</b> (S is $0.05 above K); you only wanted the premium gain and lack cash to take 100 shares. You?",
      safeZh: "到期前卖出平仓，或提交“不自动行权”指令",
      safeEn: "Sell to close before expiry, or file a do-not-exercise instruction",
      riskZh: "放着不管，反正快到期了",
      riskEn: "Leave it alone — it's about to expire anyway",
      metaZh: "多数券商对到期<b>实值</b>期权<b>自动行权</b>（常见阈值 0.01）。勉强实值也会被自动行权，让你<b>被动接下 100 股</b>、占用大笔资金，资金不足还触发追加保证金。<b>怎么避开：到期日主动处理临界实值——想了结就卖出平仓，不想接股就提交“不自动行权”指令</b>（阶段 2.4、11.1）。",
      metaEn: "Most brokers <b>auto-exercise</b> ITM options at expiry (threshold often 0.01). Even barely-ITM gets exercised, leaving you <b>long 100 shares</b>, tying up cash and possibly triggering a margin call. <b>Avoid: handle marginal ITM at expiry — sell to close to finish, or file a do-not-exercise instruction</b> (Stages 2.4, 11.1).",
    },
    {
      tag: T("过度杠杆", "Over-leverage"),
      qZh: "账户 $20,000，你的规则是每笔风险 ≤ 1%（$200）。一个“必胜”机会出现，你想？",
      qEn: "Account $20,000; your rule is risk ≤ 1% ($200) per trade. A 'sure thing' appears. You want to?",
      safeZh: "照 1% 规则，从最大亏损反推张数（≤ $200）",
      safeEn: "Honor the 1% rule; size from max loss (≤ $200)",
      riskZh: "这次例外，押 10×（$2,000 风险），机会太好",
      riskEn: "Make an exception, bet 10× ($2,000 at risk) — too good",
      metaZh: "一张合约控制 100 股、本金又小，<b>极易不知不觉建立超额敞口</b>。一次 10× 超仓押注踩雷，就能造成无法挽回的<b>爆仓风险</b>。最常杀死账户的不是看错方向，而是<b>单笔下太大</b>。<b>怎么避开：按单笔最大亏损反推张数，规则没有“这次例外”</b>（阶段 8.1、8.6）。",
      metaEn: "One contract controls 100 shares on small capital, making it <b>easy to build outsized exposure unnoticed</b>. One 10× oversized bet that hits a landmine can cause irreversible <b>risk of ruin</b>. Accounts die not from wrong direction but from <b>betting too big on one trade</b>. <b>Avoid: size from max loss; rules have no 'just this once'</b> (Stages 8.1, 8.6).",
    },
  ];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🪤 ${T("陷阱情景：选“安全的做法”，看会发生什么", "Trap scenarios: pick the safe move, see what happens")}</div>
      <div class="demo-row">
        <div class="demo-meta">${T("这些都是<b>方向之外</b>的机制性风险——下单时看不见，特定时点才现身。", "These are mechanical risks <b>beyond direction</b> — invisible at order time, surfacing only at a specific moment.")}</div>
        <div><span class="pill acc">${T("避坑分", "Avoided")} <b id="tp-score">0</b> / ${traps.length}</span></div>
      </div>
      <div class="demo-bar" style="margin-bottom:6px"><span id="tp-bar"></span></div>
      <div id="tp-cards"></div>
      <p class="demo-tip" id="tp-tip">${T("避坑的人不是运气好，而是手里有张<b>标好了所有坑何时塌陷</b>的地图。把除息、到期、财报、流动性、仓位都写进开仓前 checklist（阶段 8.6）。",
        "Those who avoid traps aren't lucky — they hold a map <b>marking when each pitfall caves in</b>. Put ex-div, expiry, earnings, liquidity, and sizing into a pre-trade checklist (Stage 8.6).")}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const answered = new Array(traps.length).fill(null);    // 'safe'|'risk'|null

  function render() {
    $("#tp-cards").innerHTML = traps.map((s, i) => {
      const done = answered[i];
      const safeCls = done === "safe" ? "primary sel" : "";
      const riskCls = done === "risk" ? "sel" : "";
      let reveal = "";
      if (done) {
        const good = done === "safe";
        reveal = `<div class="scn-meta" style="border-left:3px solid ${good ? "var(--green)" : "var(--red)"};padding-left:10px;margin-top:10px">
          <b style="color:${good ? "var(--green)" : "var(--red)"}">${good ? T("✓ 安全的做法", "✓ Safe move") : T("✗ 踩坑了", "✗ Stepped in it")}</b> — ${en ? s.metaEn : s.metaZh}</div>`;
      }
      return `<div class="scn" data-i="${i}">
        <div style="margin-bottom:8px"><span class="pill bad">${s.tag}</span></div>
        <div class="scn-q">${i + 1}. ${en ? s.qEn : s.qZh}</div>
        <div class="demo-btns">
          <button class="demo-btn ${safeCls}" data-i="${i}" data-c="safe" ${done ? "disabled" : ""}>${en ? s.safeEn : s.safeZh}</button>
          <button class="demo-btn ${riskCls}" data-i="${i}" data-c="risk" ${done ? "disabled" : ""}>${en ? s.riskEn : s.riskZh}</button>
        </div>
        ${reveal}
      </div>`;
    }).join("");

    const score = answered.filter((a) => a === "safe").length;
    const done = answered.filter((a) => a !== null).length;
    $("#tp-score").textContent = score;
    $("#tp-bar").style.width = (done / traps.length * 100) + "%";
    $("#tp-bar").style.background = score === done ? "var(--green)" : "var(--accent)";

    if (done === traps.length) {
      const perfect = score === traps.length;
      $("#tp-tip").innerHTML = perfect
        ? T(`<b>满分 ${score}/${traps.length}！</b> 你避开了全部六个机制陷阱：除息提前指派、钉住、财报 IV 崩塌、流动性差、自动行权、过度杠杆。它们共同的对策是——<b>提前把日期标在地图上、盯紧流动性和仓位、临界时主动平仓而不是赌运气</b>。`,
            `<b>Perfect ${score}/${traps.length}!</b> You dodged all six mechanical traps: ex-div assignment, pin risk, earnings IV crush, poor liquidity, auto-exercise, over-leverage. The shared fix — <b>mark the dates on your map, watch liquidity and sizing, and close at the edge instead of gambling</b>.`)
        : T(`你得了 <b>${score}/${traps.length}</b>。回看选“危险做法”的那几张——它们都是<b>方向之外</b>的机制坑，方向看对照样亏。把对应的检查项写进开仓前/到期前 checklist（阶段 8.6、11.6）。`,
            `You scored <b>${score}/${traps.length}</b>. Revisit the risky picks — they're mechanical traps <b>beyond direction</b> that bite even when you're right. Put each into a pre-trade / pre-expiry checklist (Stages 8.6, 11.6).`);
    }
  }

  $("#tp-cards").addEventListener("click", (e) => {
    const btn = e.target.closest("button"); if (!btn) return;
    const i = +btn.dataset.i;
    if (answered[i]) return;
    answered[i] = btn.dataset.c;
    render();
  });

  render();
}
