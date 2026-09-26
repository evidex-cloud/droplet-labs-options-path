// Main demo for lesson exercise-assignment: expiration Friday, step by step. Choose a position, where the stock closes
// at 4:00 p.m., how it moves after hours until the 5:30 p.m. decision deadline, and Monday's open → see what you hold.
import { seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let posType = "short-call", holder = "rational";
  const names = {
    "short-call": T("卖出看涨（如小凯的备兑看涨）", "Short call (like Kai's covered call)"),
    "long-call": T("买入看涨", "Long call"),
    "short-put": T("卖出看跌", "Short put"),
    "long-put": T("买入看跌", "Long put"),
  };
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("到期星期五模拟：4:00 收盘 → 5:30 截止 → 周一开盘", "Expiration Friday: 4:00 close → 5:30 deadline → Monday open")}</div>
    <div class="demo-row">${seg("ea-pos", Object.entries(names), posType)}</div>
    <div class="demo-row"><span class="demo-label">${T("持有人怎么决定", "How the holder decides")}</span>${seg("ea-h", [["rational", T("5:30 前看盘后价格再决定", "Decides at 5:30 using the after-hours price")], ["auto", T("不做指示（按收盘自动行权）", "No instructions (auto-exercise at the close)")]], holder)}</div>
    <div class="demo-grid">
      ${slider("ea-k", T("行权价 K", "Strike K"), 90, 110, 1, 105)}
      ${slider("ea-c", T("4:00 收盘价相对 K", "4:00 close relative to K"), -2, 2, 0.01, -0.05)}
      ${slider("ea-ah", T("盘后到 5:30 的变动", "After-hours move to 5:30"), -3, 3, 0.05, 1.05)}
      ${slider("ea-mon", T("周一开盘相对 5:30 的跳空", "Monday open gap vs 5:30"), -5, 5, 0.1, 0.5)}
    </div>
    <div class="tl" id="ea-tl"></div>
    <div class="demo-math" id="ea-f"></div>
    <div id="ea-stats"></div>
    <p class="demo-tip">${T("试试：卖出看涨，收盘价设在 K 下方 5 美分、盘后涨 1 美元——期权收盘是虚值，但理性的持有人仍会在 5:30 前行权。再换成买入看涨、收盘价设在 K 上方 2 美分、周一跳空 −3：一张只值 2 美元的期权，变成了亏 300 美元的股票。卖方这里假设正好被随机指派到。",
      "Try this: short call, close 5 cents below K, after-hours +$1 — the option closed out of the money, yet a rational holder still exercises before 5:30. Then switch to a long call closing 2 cents above K with a −$3 Monday gap: an option worth $2 becomes a $300 stock loss. For short positions we assume the random assignment lands on you.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const K = v["ea-k"], close = K + v["ea-c"], s530 = close + v["ea-ah"], mon = s530 + v["ea-mon"];
    const call = posType.endsWith("call"), long = posType.startsWith("long");
    const itm = (S) => (call ? S - K : K - S);
    const autoEx = itm(close) >= 0.01 - 1e-9;
    const exercised = holder === "auto" ? autoEx : itm(s530) > 0;
    const closeVal = Math.max(itm(close), 0) * 100 * (long ? 1 : -1); // what the position was worth at 4:00 (intrinsic)
    // stock and cash that result if exercised/assigned
    const sh = !exercised ? 0 : (call ? 100 : -100) * (long ? 1 : -1);
    const cashFlow = !exercised ? 0 : -sh * K;
    const monVal = sh * mon + cashFlow; // value of the resulting stock + cash at Monday's open
    const surprise = monVal - closeVal;
    const f2 = (x) => x.toFixed(2);
    const who = long ? T("你（持有人）", "You (holder)") : T("对面的持有人", "The holder on the other side");
    const shareTxt = sh === 0 ? T("没有股票变动", "no shares change hands") : sh > 0 ? T(`多出 +100 股（按 ${K} 买入）`, `+100 shares (bought at ${K})`) : T(`−100 股（按 ${K} 卖出${posType === "short-call" ? "；备兑时交出已有股票，否则变成做空" : ""}）`, `−100 shares (sold at ${K}${posType === "short-call" ? "; delivered from shares you own if covered, otherwise a short stock position" : ""})`);
    $("#ea-tl").innerHTML = `
      <div class="tl-item"><span class="when">${T("下午 4:00", "4:00 p.m.")}</span>${T(`XYZ 收在 ${f2(close)}：${itm(close) >= 0.01 ? `实值 ${f2(itm(close))}，将被自动行权` : "虚值（或实值不足 1 分），不会被自动行权"}。期权停止交易。`, `XYZ closes at ${f2(close)}: ${itm(close) >= 0.01 ? `in the money by ${f2(itm(close))}, set for automatic exercise` : "out of the money (or less than 1 cent in), no automatic exercise"}. The option stops trading.`)}</div>
      <div class="tl-item"><span class="when">${T("下午 5:30", "5:30 p.m.")}</span>${T(`盘后 XYZ 到 ${f2(s530)}。${who}${exercised ? "行权" : "不行权"}${holder === "rational" && exercised !== autoEx ? "（与收盘时的自动安排相反，提交了指示）" : ""}。`, `After hours XYZ is at ${f2(s530)}. ${who} ${exercised ? "exercises" : "does not exercise"}${holder === "rational" && exercised !== autoEx ? " (a contrary instruction, against the close-based default)" : ""}.`)}</div>
      <div class="tl-item"><span class="when">${T("周一", "Monday")}</span>${T(`${long ? "" : exercised ? "你被指派：" : ""}${shareTxt}${exercised ? `，现金 ${cashFlow >= 0 ? "+" : "−"}$${Math.abs(cashFlow).toLocaleString("en-US")}（T+1 交收）` : ""}。XYZ 开在 ${f2(mon)}。`, `${long ? "" : exercised ? "You are assigned: " : ""}${shareTxt}${exercised ? `, cash ${cashFlow >= 0 ? "+" : "−"}$${Math.abs(cashFlow).toLocaleString("en-US")} (settles T+1)` : ""}. XYZ opens at ${f2(mon)}.`)}</div>`;
    $("#ea-f").innerHTML = tex(String.raw`\underbrace{${sh} \times ${f2(mon)} ${cashFlow >= 0 ? "+" : "-"} ${Math.abs(cashFlow).toFixed(0)}}_{\text{${T("周一开盘时的价值", "value at Monday open")}}} - \underbrace{(${closeVal.toFixed(0)})}_{\text{${T("4:00 时的价值", "value at 4:00")}}} = ${surprise >= 0 ? "" : "-"}\$${Math.abs(surprise).toFixed(0)}`, true);
    $("#ea-stats").innerHTML = stats([
      [T("行权 / 指派？", "Exercised / assigned?"), exercised ? T("是", "Yes") : T("否", "No"), exercised ? "acc" : ""],
      [T("股票变动", "Shares"), (sh > 0 ? "+" : sh < 0 ? "−" : "") + Math.abs(sh)],
      [T("4:00 时头寸价值", "Position value at 4:00"), (closeVal >= 0 ? "$" : "−$") + Math.abs(closeVal).toFixed(0)],
      [T("相对 4:00 的意外", "Surprise vs 4:00"), (surprise >= 0 ? "+$" : "−$") + Math.abs(surprise).toFixed(0), surprise >= 0 ? "pos" : "neg"],
    ]);
  };
  const run = bindSliders(root, { "ea-k": (x) => String(x), "ea-c": (x) => (+x >= 0 ? "+" : "−") + Math.abs(+x).toFixed(2), "ea-ah": (x) => (+x >= 0 ? "+$" : "−$") + Math.abs(+x).toFixed(2), "ea-mon": (x) => (+x >= 0 ? "+$" : "−$") + Math.abs(+x).toFixed(1) }, draw);
  onSeg(root, "ea-pos", (v) => { posType = v; run(); });
  onSeg(root, "ea-h", (v) => { holder = v; run(); });
}
