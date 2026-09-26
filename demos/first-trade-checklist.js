// Inline demo for lesson first-trade: the pre-flight checklist. Tick items; critical ones block the order.
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const ITEMS = [
    { k: "thesis", crit: true, zh: "观点写成一句话：区间 + 期限 + 我接受的结果", en: "Thesis written as one sentence: range + horizon + an outcome I accept" },
    { k: "wrong", crit: true, zh: "写下什么情况说明我错了（收盘低于 95）", en: "Written what would prove me wrong (a close below 95)" },
    { k: "fit", crit: true, zh: "结构与观点一致，包括最难受的情景（财报后大涨被封顶）", en: "Structure fits the thesis, incl. its worst-feeling case (capped after an earnings jump)" },
    { k: "earn", crit: false, zh: "查过财报日与除息日", en: "Checked the earnings and ex-dividend dates" },
    { k: "liq", crit: true, zh: "价差 ≤ 中间价的 10%，未平仓量充足", en: "Spread ≤ 10% of mid, enough open interest" },
    { k: "size", crit: true, zh: "张数 = 股数 ÷ 100（没有裸卖）", en: "Contracts = shares ÷ 100 (nothing naked)" },
    { k: "worst", crit: false, zh: "算过最坏情况：跌到 80 时亏 1,929 美元，能承受", en: "Worst case computed: −$1,929 at 80, and affordable" },
    { k: "limit", crit: true, zh: "限价单挂在中间价，当日有效", en: "Limit order at the mid, day order" },
    { k: "rules", crit: true, zh: "止盈、展期区、失效线都写好了", en: "Take-profit, roll zone and thesis line written down" },
    { k: "alerts", crit: false, zh: "价格提醒 95 / 103 / 105，财报与到期提醒", en: "Price alerts at 95 / 103 / 105; earnings and expiry reminders" },
    { k: "cutoff", crit: false, zh: "知道券商的行权指示截止时间", en: "Know the broker's exercise-instruction cutoff" },
    { k: "paper", crit: true, zh: "已在模拟账户完整走过一次", en: "Completed the whole cycle once in paper trading" },
  ];
  const on = new Set();
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("下单前检查清单", "Pre-flight checklist")}</div>
    <div class="demo-btns"><button type="button" class="demo-btn" data-all="1">${T("填入小凯的答案", "Fill in Kai's answers")}</button><button type="button" class="demo-btn" data-all="0">${T("清空", "Clear")}</button></div>
    <div id="ftc-list"></div>
    <div id="ftc-out"></div>
    <p class="demo-tip">${T("看什么：带“必须”的项目只要缺一项，就不该发送订单——不管这笔交易看起来多有把握。“小凯的答案”故意跳过了模拟交易那一项。", "What to notice: if any item marked “must” is missing, the order should not be sent — however confident the trade feels. “Kai's answers” deliberately skip the paper-trading item.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = () => {
    $("#ftc-list").innerHTML = ITEMS.map((it) => `<button type="button" class="demo-btn${on.has(it.k) ? " on" : ""}" data-k="${it.k}" style="display:block;width:100%;text-align:left;margin:4px 0">${on.has(it.k) ? "☑" : "☐"} ${T(it.zh, it.en)}${it.crit ? ` <span class="tag bad">${T("必须", "must")}</span>` : ""}</button>`).join("");
    const missing = ITEMS.filter((it) => it.crit && !on.has(it.k));
    const done = ITEMS.filter((it) => on.has(it.k)).length;
    $("#ftc-out").innerHTML = `<div class="bar2"><span class="lab" style="width:110px">${T("完成度", "Completed")}</span><span class="track"><span class="fill" style="display:block;width:${(done / ITEMS.length) * 100}%;background:var(--orange)"></span></span><span class="val">${done}/${ITEMS.length}</span></div>`
      + (missing.length ? `<div class="demo-log bad">${T("还不能发送。缺少：", "Not ready to send. Missing: ")}${missing.map((m) => T(m.zh, m.en)).join(T("；", "; "))}</div>` : `<div class="demo-log ok">${T("必须项全部完成：可以发送订单。", "All must-have items done: the order can be sent.")}</div>`);
    root.querySelectorAll("#ftc-list [data-k]").forEach((b) => b.addEventListener("click", () => { const k = b.dataset.k; if (on.has(k)) on.delete(k); else on.add(k); draw(); }));
  };
  root.querySelectorAll("[data-all]").forEach((b) => b.addEventListener("click", () => {
    on.clear();
    if (b.dataset.all === "1") ITEMS.forEach((it) => { if (it.k !== "paper" && it.k !== "cutoff") on.add(it.k); });
    draw();
  }));
  draw();
}
