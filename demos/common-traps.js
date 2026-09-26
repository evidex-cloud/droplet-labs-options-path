// Main demo for lesson common-traps: a scenario deck. Each card is a real trap with numbers computed live by the
// engine (_opt.js); pick what you would do, then see the mechanism, the number that springs it, and the defuse.
import * as O from "./_opt.js";
import { seg, onSeg, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const r = 0.04, D = 365;
  const bs = (S, K, days, sigma, type = "call") => O.bsPrice({ S, K, T: days / D, r, sigma, type });
  const usd = (x, d = 2) => O.fmtUsd(x, d);
  const tu = (x, d = 0) => (x < 0 ? "-" : "") + String.raw`\$` + Math.abs(x).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/,/g, "{,}");

  // ---- every number below is computed, not typed ----
  const div = (() => {
    const S = 112, K = 105, Dv = 0.5, days = 3;
    const P = bs(S - Dv, K, days, 0.2, "put"), I = K * (1 - Math.exp(-r * days / D));
    return { S, K, Dv, days, P, I, tv: P + I, hold: bs(S - Dv, K, days, 0.2), ex: S - K };
  })();
  const deepPut = (() => {
    const S = 80, K = 100, days = 20;
    const eu = bs(S, K, days, 0.2, "put");
    return { S, K, days, eu, intr: K - S, gap: K - S - eu };
  })();
  const zdte = (() => {
    const p0 = bs(100, 100, 1, 0.2), up = bs(101.05, 100, 1, 0.2);
    return { p0, up, loss: (up - p0) * 100 };
  })();
  const lot = (() => {
    const c = bs(100, 110, 30, 0.2), ask = 0.17;
    return { c, ask, pBE: O.probAbove(100, 110 + ask, 30 / D, 0.2, r), over: ask / c - 1 };
  })();
  const crush = (() => {
    const c0 = bs(100, 100, 7, 0.3694), p0 = bs(100, 100, 7, 0.3694, "put");
    const c1 = bs(103, 100, 6, 0.2), p1 = bs(103, 100, 6, 0.2, "put");
    return { st0: c0 + p0, st1: c1 + p1, pnl: (c1 + p1 - c0 - p0) * 100 };
  })();
  const shortPut = (() => {
    const p0 = bs(100, 95, 30, 0.2, "put"), p1 = bs(88, 95, 20, 0.3, "put");
    return { p0, p1, loss1: (p1 - p0) * 100, loss10: (p1 - p0) * 1000, nmax: Math.floor(400 / ((p1 - p0) * 100)) };
  })();
  const roll = (() => {
    const old = bs(88, 95, 20, 0.3, "put"), nw = bs(88, 95, 60, 0.28, "put");
    const gO = O.greeks({ S: 88, K: 95, T: 20 / D, r, sigma: 0.3, type: "put" }), gN = O.greeks({ S: 88, K: 95, T: 60 / D, r, sigma: 0.28, type: "put" });
    const p0 = bs(100, 95, 30, 0.2, "put");
    return { old, nw, credit: nw - old, realized: (old - p0) * 100, vO: gO.vega, vN: gN.vega, dN: gN.delta, at80: -Math.round((old - p0) * 100) - (15 - Math.round(nw * 100) / 100) * 100 };
  })();
  const wknd = (() => { const g = O.greeks({ S: 100, K: 100, T: 30 / D, r, sigma: 0.2, type: "call" }); return { th3: 3 * g.theta }; })();

  const cards = [
    { fam: "assign", tag: T("除息前的提前指派", "Early assignment before a dividend"),
      q: T(`你在一个看涨价差里<b>卖出</b>了 XYZ ${div.K} 看涨。XYZ 现价 ${usd(div.S)}，<b>明天除息</b>，股息 ${usd(div.Dv)}；期权 ${div.days} 天后到期。你怎么做？`,
        `You are <b>short</b> the XYZ ${div.K} call inside a call spread. XYZ is ${usd(div.S)}, a ${usd(div.Dv)} dividend goes <b>ex tomorrow</b>, and the call expires in ${div.days} days. What do you do?`),
      choices: [[T("周五到期再说", "Wait for Friday's expiry"), false], [T("今天平掉或展期这个价差（或行权自己的买入腿）", "Close or roll the spread today (or exercise your own long leg)"), true], [T("再多卖几张，多收权利金", "Sell a few more calls for extra premium"), false]],
      why: () => T(`持有人今天行权能拿到股息，只放弃时间价值：`, `Exercising today collects the dividend and gives up only the time value: `) +
        tex(String.raw`P + K(1 - e^{-r\tau}) = ${div.P.toFixed(4)} + ${div.I.toFixed(3)} = ${div.tv.toFixed(3)} \ll D = ${div.Dv.toFixed(2)}`) +
        T(`。几乎必然被指派——你会在除息日空着 100 股、欠下 50 美元股息。`, `. Assignment is almost certain — you would be short 100 shares on the ex-date and owe the $50 dividend.`) },
    { fam: "assign", tag: T("深度实值的卖出看跌", "Deep in-the-money short put"),
      q: T(`你卖出的 XYZ ${deepPut.K} 看跌期权还有 ${deepPut.days} 天到期，XYZ 已跌到 ${usd(deepPut.S)}。没有股息。你会被提前指派吗？`,
        `Your short XYZ ${deepPut.K} put has ${deepPut.days} days left and XYZ has fallen to ${usd(deepPut.S)}. No dividend. Can you be assigned early?`),
      choices: [[T("不会，没有股息就不会提前行权", "No — without a dividend nobody exercises early"), false], [T("会，任何一天都可能，要么平仓要么备好买股票的钱", "Yes, any day — close it or have the cash to buy the shares"), true]],
      why: () => T(`同样条件的欧式看跌只值 `, `The same put, European-style, is worth only `) + tex(String.raw`${deepPut.eu.toFixed(2)} < K - S = ${deepPut.intr.toFixed(2)}`) +
        T(`：现在拿到 100 美元还能赚利息，行权比持有多 ${usd(deepPut.gap)}/股。美式持有人会行权。`, `: taking $100 now and earning interest beats holding by ${usd(deepPut.gap)} a share. An American holder exercises.`) },
    { fam: "expiry", tag: T("钉住风险", "Pin risk"),
      q: T(`到期周五 15:30，你卖出的 5 张 XYZ 100 看涨，XYZ 在 100.02 附近晃。你怎么做？`, `Expiration Friday, 3:30 p.m. You are short five XYZ 100 calls and XYZ is hovering at 100.02. What do you do?`),
      choices: [[T("收盘前买回来，花几美分消除不确定性", "Buy them back before the close for a few cents"), true], [T("放着——实值只有 2 美分，不会被指派", "Leave them — two cents in the money won't get assigned"), false]],
      why: () => T(`收盘后持有人可以改主意，直到 17:30。你可能被指派 0 到 5 张，周一跳空 3 美元时：`, `Holders can change their minds until 5:30 p.m. You may be assigned on 0–5 contracts; with a $3 Monday gap: `) +
        tex(String.raw`\Pi = -n \times 100 \times 3 \in [-\$1{,}500,\ +\$1{,}500]`) },
    { fam: "expiry", tag: T("意外行权", "Accidental exercise"),
      q: T(`你买了 1 张 XYZ 100 看涨，打算“让它到期”。账户里只有 1,500 美元。XYZ 收在 100.05。会怎样？`, `You bought one XYZ 100 call and planned to “let it expire”. The account holds $1,500. XYZ closes at 100.05. What happens?`),
      choices: [[T("到期作废，什么都不会发生", "It expires; nothing happens"), false], [T("被自动行权，要付 10,000 美元买 100 股——保证金追缴", "It is auto-exercised: you owe $10,000 for 100 shares — a margin call"), true]],
      why: () => T(`实值 0.01 美元及以上会被自动行权：`, `Anything $0.01 or more in the money is auto-exercised: `) + tex(String.raw`100 \times \$100 = \$10{,}000 \gg \$1{,}500`) +
        T(`。收盘前卖出平仓，或提交“不行权”指示。`, `. Sell to close before the end of trading, or send a do-not-exercise instruction.`) },
    { fam: "price", tag: T("宽价差", "Wide spread"),
      q: T(`一只冷门股的期权报价 0.40 / 0.60。你估计这笔交易的优势约为权利金的 10%。怎么做？`, `An option on a thin stock is quoted 0.40 / 0.60. You estimate your edge at about 10% of the premium. What do you do?`),
      choices: [[T("市价买入——优势是正的", "Buy at market — the edge is positive"), false], [T("放弃，或只在中间价挂限价单", "Skip it, or only bid at the mid with a limit order"), true]],
      why: () => tex(String.raw`\frac{0.60 - 0.40}{0.50} = 40\%`) + T(` 的往返成本，远大于 10% 的优势：扣完成本期望值是负的。`, ` round-trip cost dwarfs a 10% edge: after costs the expected value is negative.`) },
    { fam: "price", tag: T("彩票期权", "Lottery ticket"),
      q: T(`XYZ 30 天期 110 看涨公平价 ${usd(lot.c)}，卖价 ${usd(lot.ask)}。“只要 17 美元，风险很小。”对吗？`, `XYZ's 30-day 110 call is worth ${usd(lot.c)} fair and offered at ${usd(lot.ask)}. “Only $17 — tiny risk.” True?`),
      choices: [[T("对：最多亏 17 美元", "Yes: the most I can lose is $17"), false], [T("金额小，但赔率很长，扣价差后期望为负", "Small amount, long odds, negative EV after the spread"), true]],
      why: () => T(`越过盈亏平衡点的风险中性概率 `, `Risk-neutral probability of finishing past breakeven: `) + tex(String.raw`P(S_T > ${(110 + lot.ask).toFixed(2)}) = ${(lot.pBE * 100).toFixed(1)}\%`) +
        T(`；比公平价多付 ${(lot.over * 100).toFixed(0)}%，这就是每张的期望亏损。`, `; paying ${(lot.over * 100).toFixed(0)}% over fair value is your expected loss per ticket.`) },
    { fam: "vol", tag: T("IV 崩塌", "IV crush"),
      q: T(`财报前一晚，XYZ 7 天期 100 跨式组合 ${usd(crush.st0)}（IV 约 37%）。你预期明天涨 3%。买它？`, `The night before earnings XYZ's 7-day 100 straddle costs ${usd(crush.st0)} (IV about 37%). You expect a 3% move. Buy it?`),
      choices: [[T("买：我确定会动", "Buy: I'm sure it will move"), false], [T("不买：3% 小于隐含的约 4%，崩塌会吃掉价值", "Don't: 3% is below the ~4% implied move, and the crush eats the value"), true]],
      why: () => T(`上涨 3%、IV 回到 20%：跨式组合值 `, `Up 3% with IV back at 20%: the straddle is worth `) + tex(String.raw`${crush.st1.toFixed(2)}`) +
        T(`，每张 ${O.fmtUsd(crush.pnl, 0)}。你付钱买的是“比市场预期更大的变动”。`, `, ${O.fmtUsd(crush.pnl, 0)} a contract. You pay for a move bigger than the market already expects.`) },
    { fam: "vol", tag: T("0DTE 的速度", "0DTE speed"),
      q: T(`你以 ${usd(zdte.p0)} 卖出 1 张 XYZ 1 天期 100 看涨，“反正今天就归零”。XYZ 上涨一次普通日内波动 1.05 美元。`, `You sell one XYZ 1-day 100 call for ${usd(zdte.p0)}: “it goes to zero today anyway”. XYZ rises one ordinary daily move, $1.05.`),
      choices: [[T("亏一点点，最多几十美元", "A small loss, a few dollars at most"), false], [T("期权涨到约 1.15 美元，亏损是收入的近三倍", "The call jumps to about $1.15 — the loss is nearly three times the premium"), true]],
      why: () => tex(String.raw`C: ${zdte.p0.toFixed(2)} \to ${zdte.up.toFixed(2)},\quad \Pi = ${tu(-zdte.loss)}`) + T(`。Gamma 0.38：每动 1 美元，delta 变 0.38。`, `. Gamma 0.38: every $1 changes delta by 0.38.`) },
    { fam: "vol", tag: T("周末 theta", "Weekend theta"),
      q: T(`周五下午卖出平值期权，“白赚三天的 theta”？`, `Sell an at-the-money option on Friday afternoon to “collect three days of theta for free”?`),
      choices: [[T("对，周末时间照样流逝", "Yes, time passes over the weekend"), false], [T("那部分通常一周里已计入价格，跳空风险却全归你", "That decay is usually priced in during the week; the gap risk is all yours"), true]],
      why: () => T(`30 天平值看涨三天的 theta 约 `, `Three days of theta on the 30-day ATM call is about `) + tex(String.raw`3 \times (${(wknd.th3 / 3).toFixed(3)}) = ${wknd.th3.toFixed(2)}`) +
        T(` 每股，而周末约 65 小时休市的跳空可以是好几美元。`, ` a share, while a gap over roughly 65 closed hours can be several dollars.`) },
    { fam: "lev", tag: T("小权利金，大义务", "Small premium, big obligation"),
      q: T(`账户 20,000 美元，单笔风险预算 400 美元。卖 10 张 XYZ 95 看跌，每张只收 ${usd(shortPut.p0)}？`, `$20,000 account, $400 risk budget per trade. Sell ten XYZ 95 puts at ${usd(shortPut.p0)} each?`),
      choices: [[T("可以：每张只冒 51 美元的险", "Fine: each one only risks $51"), false], [T("按压力亏损算，一张都不够格", "Sized by stress loss, not even one passes"), true]],
      why: () => T(`XYZ 跌到 88、IV 30%：每张亏 `, `XYZ at $88, IV 30%: each contract loses `) + tex(String.raw`(${shortPut.p1.toFixed(2)} - ${shortPut.p0.toFixed(2)}) \times 100 = \$${shortPut.loss1.toFixed(0)}`) +
        T(`；`, `; `) + tex(String.raw`\lfloor 400 / ${shortPut.loss1.toFixed(0)} \rfloor = ${shortPut.nmax}`) + T(`。十张就是 ${O.fmtUsd(-shortPut.loss10, 0)}。`, `. Ten contracts would be ${O.fmtUsd(-shortPut.loss10, 0)}.`) },
    { fam: "lev", tag: T("展期亏损仓", "Rolling a loser"),
      q: T(`上面那张 95 看跌亏了 ${O.fmtUsd(roll.realized, 0)}。把它展期到 60 天期 95 看跌，净收 ${usd(roll.credit)}。问题解决了？`, `That 95 put is down ${O.fmtUsd(roll.realized, 0)}. Roll it to the 60-day 95 put for a ${usd(roll.credit)} net credit. Problem solved?`),
      choices: [[T("解决了：我还收了钱", "Solved: I even got paid"), false], [T("亏损已实现，新头寸 vega 更大、时间更长——当作新交易来评估", "The loss is realized; the new position has more vega for longer — judge it as a fresh trade"), true]],
      why: () => T(`vega `, `Vega `) + tex(String.raw`${roll.vO.toFixed(3)} \to ${roll.vN.toFixed(3)}`) + T(`，delta 仍为 ${roll.dN.toFixed(2).replace("-", "−")}；若新到期日 XYZ 在 80：总亏损 `, `, delta still ${roll.dN.toFixed(2).replace("-", "−")}; if XYZ ends at $80: total loss `) +
        tex(tu(roll.at80)) },
    { fam: "paper", tag: T("调整后的合约", "Adjusted contract"),
      q: T(`XYZ 三拆二。你的 1 张 XYZ 100 看涨变成了什么？`, `XYZ splits 3-for-2. What does your one XYZ 100 call become?`),
      choices: [[T("1.5 张标准合约", "1.5 standard contracts"), false], [T("通常是 1 张交割 150 股、行权价约 66.67 的调整合约", "Usually one adjusted contract delivering 150 shares at a strike of about 66.67"), true]],
      why: () => tex(String.raw`100 \times \tfrac{3}{2} = 150 \text{ shares},\quad 100 \times \tfrac{2}{3} \approx 66.67`) + T(`。价值不变，但代码、流动性和“×100”都变了——先读 OCC 备忘录。`, `. Same value, but the symbol, liquidity and the “×100” shortcut all change — read the OCC memo first.`) },
  ];

  const fams = [["all", T("全部", "All")], ["assign", T("指派", "Assignment")], ["expiry", T("到期日", "Expiry day")], ["price", T("价格", "Price")], ["vol", T("波动与速度", "Vol & speed")], ["lev", T("杠杆与行为", "Leverage")], ["paper", T("文书", "Paperwork")]];
  let fam = "all", idx = 0;
  const answers = new Map(); // card index in `cards` → chosen choice index

  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("陷阱牌组：你会怎么做？", "Trap deck: what would you do?")}</div>
    <div class="demo-row">${seg("ct-fam", fams, fam)}</div>
    <div id="ct-strip" class="strip" style="display:flex;gap:4px;flex-wrap:wrap;margin:10px 0"></div>
    <div id="ct-card"></div>
    <div class="demo-btns"><button class="demo-btn" data-nav="-1">${T("← 上一张", "← Previous")}</button><button class="demo-btn" data-nav="1">${T("下一张 →", "Next →")}</button><button class="demo-btn" data-nav="reset">${T("重来", "Reset")}</button></div>
    <div id="ct-score"></div>
    <p class="demo-tip">${T("看什么：每张牌的数字都是引擎现算的。先凭直觉选，再看是哪条机制、哪个时刻触发了陷阱；所有“错误”选项都是真实交易者常说的话。", "What to notice: every number on a card is computed live by the engine. Pick on instinct first, then read which mechanism and which moment spring the trap; every wrong choice is something real traders say.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const list = () => cards.map((c, i) => i).filter((i) => fam === "all" || cards[i].fam === fam);

  function draw() {
    const L = list();
    if (idx >= L.length) idx = L.length - 1;
    if (idx < 0) idx = 0;
    const ci = L[idx], c = cards[ci], ans = answers.get(ci);
    $("#ct-strip").innerHTML = L.map((i, k) => {
      const a = answers.get(i);
      const cls = a == null ? (k === idx ? "on" : "") : cards[i].choices[a][1] ? "win" : "lose";
      return `<span class="strip-cell ${cls}" title="${k + 1}"></span>`;
    }).join("");
    const opts = c.choices.map(([label, good], k) => {
      const picked = ans === k;
      const mark = ans == null ? "" : good ? ` <span class="tag ok">${T("安全", "safe")}</span>` : picked ? ` <span class="tag bad">${T("陷阱", "trap")}</span>` : "";
      return `<button class="demo-btn${picked ? " on" : ""}" data-pick="${k}" style="display:block;width:100%;text-align:left;margin:6px 0">${label}${mark}</button>`;
    }).join("");
    let verdict = "";
    if (ans != null) {
      const good = c.choices[ans][1];
      verdict = `<div class="scn-meta"><span class="pill ${good ? "ok" : "bad"}">${good ? T("避开了", "Avoided") : T("踩中了", "Sprung")}</span> ${c.why()}</div>`;
    }
    $("#ct-card").innerHTML = `<div class="scn"><div class="demo-label"><span class="tag hl">${c.tag}</span> <small>${idx + 1} / ${L.length}</small></div><div class="scn-q">${c.q}</div>${opts}${verdict}</div>`;
    root.querySelectorAll("[data-pick]").forEach((b) => b.addEventListener("click", () => { answers.set(ci, +b.dataset.pick); draw(); }));
    const done = [...answers.entries()], ok = done.filter(([i, a]) => cards[i].choices[a][1]).length;
    $("#ct-score").innerHTML = `<div class="stat-row"><div class="stat"><div class="k">${T("已作答", "Answered")}</div><div class="v">${done.length} / ${cards.length}</div></div><div class="stat"><div class="k">${T("避开的陷阱", "Traps avoided")}</div><div class="v pos">${ok}</div></div><div class="stat"><div class="k">${T("踩中的陷阱", "Traps sprung")}</div><div class="v neg">${done.length - ok}</div></div></div>`;
  }
  onSeg(root, "ct-fam", (v) => { fam = v; idx = 0; draw(); });
  root.querySelectorAll("[data-nav]").forEach((b) => b.addEventListener("click", () => {
    const v = b.dataset.nav;
    if (v === "reset") { answers.clear(); idx = 0; } else idx += +v;
    draw();
  }));
  draw();
}
