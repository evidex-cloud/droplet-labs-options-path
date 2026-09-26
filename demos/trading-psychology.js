// Main demo for lesson trading-psychology: a trade-journal analyser. Paste or edit trades (one per line:
// strategy, P&L in $, contracts, rolled y/n) → win rate, payoff ratio, expectancy, streaks, and simple bias flags.
import { lineChart, barChart, stats, tex } from "./_viz.js";

const PRESETS = {
  kai: `covered call, 58, 1, n
short put, 51, 1, n
covered call, 71, 1, n
short put, 45, 2, n
short put, 66, 2, n
short put, -380, 3, y
covered call, 62, 1, n
short put, 55, 1, n
covered call, 70, 2, n
short put, 62, 2, n
short put, -290, 3, y
OTM call, -14, 1, n`,
  lottery: `OTM call, -28, 2, n
OTM call, -28, 2, n
OTM call, -28, 2, n
OTM call, 250, 2, n
OTM call, -70, 5, n
OTM call, -70, 5, n
OTM call, -70, 5, n
OTM call, -70, 5, n
OTM call, -70, 5, n
OTM call, 300, 5, n
OTM call, -140, 10, n
OTM call, -140, 10, n`,
  spreads: `bull call spread, 150, 2, n
bull call spread, -174, 2, n
put spread, 45, 2, n
bull call spread, 160, 2, n
put spread, -210, 2, n
put spread, 45, 2, n
bull call spread, -174, 2, n
bull call spread, 200, 2, n
put spread, 45, 2, n
put spread, 45, 2, n
bull call spread, 120, 2, n
put spread, -150, 2, n`,
};

export function analyse(text) {
  const trades = [];
  for (const raw of String(text).split("\n")) {
    const parts = raw.split(",").map((s) => s.trim());
    if (parts.length < 2) continue;
    const pnl = parseFloat(parts[1]);
    if (!isFinite(pnl)) continue;
    const size = isFinite(parseFloat(parts[2])) ? parseFloat(parts[2]) : 1;
    trades.push({ strat: parts[0] || "?", pnl, size, rolled: /^y/i.test(parts[3] || "") });
  }
  const n = trades.length, wins = trades.filter((t) => t.pnl > 0), losses = trades.filter((t) => t.pnl <= 0);
  const sum = (a) => a.reduce((s, t) => s + t.pnl, 0);
  const p = n ? wins.length / n : 0, W = wins.length ? sum(wins) / wins.length : 0, Lb = losses.length ? -sum(losses) / losses.length : 0;
  const E = p * W - (1 - p) * Lb, pStar = W + Lb > 0 ? Lb / (W + Lb) : 0, pf = losses.length && sum(losses) !== 0 ? sum(wins) / -sum(losses) : Infinity;
  let streak = 0, maxStreak = 0; for (const t of trades) { streak = t.pnl <= 0 ? streak + 1 : 0; maxStreak = Math.max(maxStreak, streak); }
  const afterWin = [], afterLoss = [];
  for (let i = 1; i < n; i++) (trades[i - 1].pnl > 0 ? afterWin : afterLoss).push(trades[i].size);
  const avg = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN);
  const rolledLoss = -sum(losses.filter((t) => t.rolled)), totalLoss = -sum(losses);
  const lottery = trades.filter((t) => /otm|lottery|彩票|虚值/i.test(t.strat));
  const worst = n ? Math.min(...trades.map((t) => t.pnl)) : 0;
  return { trades, n, p, W, L: Lb, E, pStar, pf, maxStreak, sizeAfterWin: avg(afterWin), sizeAfterLoss: avg(afterLoss), rolledLoss, totalLoss, lottery, worst, total: sum(trades), grossWin: sum(wins) };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("交易日志分析器", "Trade-journal analyser")}</div>
    <div class="demo-btns">
      <button class="demo-btn" data-pre="kai">${T("小凯的 12 笔交易", "Kai's 12 trades")}</button>
      <button class="demo-btn" data-pre="lottery">${T("彩票买家", "Lottery buyer")}</button>
      <button class="demo-btn" data-pre="spreads">${T("守纪律的价差交易者", "Disciplined spread trader")}</button>
    </div>
    <label class="demo-label" for="tp-in">${T("每行一笔：策略, 损益（美元）, 张数, 是否展期（y/n）", "One trade per line: strategy, P&L ($), contracts, rolled (y/n)")}</label>
    <textarea class="demo-inp" id="tp-in" rows="8" style="width:100%;font-family:var(--mono, monospace)"></textarea>
    <div class="demo-math" id="tp-f"></div>
    <div id="tp-s"></div>
    <div id="tp-flags"></div>
    <div class="demo-label">${T("累计损益（美元）", "Cumulative P&L ($)")}</div>
    <div id="tp-eq"></div>
    <div id="tp-bars"></div>
    <p class="demo-tip">${T("试试：载入“小凯的 12 笔交易”——胜率 75%，期望值却是负的，两笔展期的亏损吃掉了所有利润。改一行数字（比如把 −380 改成 −120，相当于按计划止损），看期望值怎样翻正。", "Try this: load “Kai's 12 trades” — a 75% win rate with negative expectancy, as two rolled losers eat every profit. Edit one line (say −380 to −120, as if the planned exit had been honoured) and watch the expectancy turn positive.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const ta = $("#tp-in");
  ta.value = PRESETS.kai;
  const money = (x) => (x >= 0 ? "+$" : "−$") + Math.abs(x).toFixed(0);
  const draw = () => {
    const a = analyse(ta.value);
    if (!a.n) { $("#tp-s").innerHTML = `<p class="demo-warn">${T("没有读到有效的交易行。", "No valid trade lines found.")}</p>`; $("#tp-f").innerHTML = ""; $("#tp-flags").innerHTML = ""; $("#tp-eq").innerHTML = ""; $("#tp-bars").innerHTML = ""; return; }
    $("#tp-f").innerHTML = tex(String.raw`E = p\,\bar W - (1-p)\,\bar L`, true) + tex(String.raw`= ${a.p.toFixed(2)} \times ${a.W.toFixed(0)} - ${(1 - a.p).toFixed(2)} \times ${a.L.toFixed(0)} = ${a.E.toFixed(1)}`, true) + tex(String.raw`p^* = \frac{\bar L}{\bar W + \bar L} = ${(a.pStar * 100).toFixed(0)}\%`, true);
    $("#tp-s").innerHTML = stats([
      [T("交易笔数", "Trades"), String(a.n)],
      [T("胜率 p", "Win rate p"), (a.p * 100).toFixed(0) + "%"],
      [T("平均盈利 / 平均亏损", "Avg win / avg loss"), "$" + a.W.toFixed(0) + " / $" + a.L.toFixed(0)],
      [T("赔率（盈亏比）", "Payoff ratio"), a.L > 0 ? (a.W / a.L).toFixed(2) : "–"],
      [T("每笔期望值", "Expectancy per trade"), money(a.E), a.E >= 0 ? "pos" : "neg"],
      [T("打平所需胜率", "Break-even win rate"), (a.pStar * 100).toFixed(0) + "%", "acc"],
      [T("盈利因子", "Profit factor"), isFinite(a.pf) ? a.pf.toFixed(2) : "∞"],
      [T("最长连亏", "Longest losing streak"), String(a.maxStreak)],
    ]);
    const flags = [];
    if (a.p >= 0.65 && a.L >= 3 * a.W && a.W > 0) flags.push(["bad", T("“捡硬币”特征：胜率高，但平均亏损是平均盈利的 3 倍以上——典型的卖权利金、不止损。", "“Picking up pennies” signature: high win rate, but the average loss is over 3× the average win — classic premium selling without exits.")]);
    if (a.rolledLoss > 0 && a.totalLoss > 0) flags.push([a.rolledLoss / a.totalLoss > 0.4 ? "bad" : "warn", T(`展期过的亏损单占全部亏损的 ${((a.rolledLoss / a.totalLoss) * 100).toFixed(0)}%——“不认输、往后滚”的代价。`, `Rolled losers account for ${((a.rolledLoss / a.totalLoss) * 100).toFixed(0)}% of all losses — the price of “not admitting it, rolling it out”.`)]);
    if (isFinite(a.sizeAfterWin) && isFinite(a.sizeAfterLoss) && a.sizeAfterWin > 1.3 * a.sizeAfterLoss) flags.push(["warn", T(`赢了之后平均下 ${a.sizeAfterWin.toFixed(1)} 张，输了之后 ${a.sizeAfterLoss.toFixed(1)} 张：连赢后加码，可能是过度自信。`, `Average size after a win ${a.sizeAfterWin.toFixed(1)} vs ${a.sizeAfterLoss.toFixed(1)} after a loss: sizing up after wins may be overconfidence.`)]);
    if (isFinite(a.sizeAfterWin) && isFinite(a.sizeAfterLoss) && a.sizeAfterLoss > 1.3 * a.sizeAfterWin) flags.push(["warn", T(`输了之后平均下 ${a.sizeAfterLoss.toFixed(1)} 张，赢了之后 ${a.sizeAfterWin.toFixed(1)} 张：亏了加倍想扳回？`, `Average size after a loss ${a.sizeAfterLoss.toFixed(1)} vs ${a.sizeAfterWin.toFixed(1)} after a win: doubling up to win it back?`)]);
    if (a.lottery.length >= a.n / 2) flags.push(["warn", T(`一半以上的交易是虚值期权“彩票”（${a.lottery.length} 笔）：胜率低、连亏长，每笔风险要更小。`, `Over half the trades are out-of-the-money “lottery tickets” (${a.lottery.length}): low win rate, long losing streaks — size each one smaller.`)]);
    if (a.grossWin > 0 && -a.worst > 0.5 * a.grossWin) flags.push(["bad", T(`最大单笔亏损 ${money(a.worst)} 超过全部盈利的一半：一笔交易决定了整本日志。`, `The single worst loss (${money(a.worst)}) exceeds half of all gains: one trade decides the whole journal.`)]);
    if (!flags.length) flags.push(["ok", T("没有触发明显的偏差信号。继续记录，样本越多，结论越可靠。", "No obvious bias flags. Keep logging: more trades, more reliable conclusions.")]);
    $("#tp-flags").innerHTML = flags.map(([c, t]) => `<div class="demo-log ${c}">${t}</div>`).join("");
    let cum = 0; const pts = [[0, 0]]; a.trades.forEach((t, i) => { cum += t.pnl; pts.push([i + 1, cum]); });
    $("#tp-eq").innerHTML = lineChart({ xmin: 0, xmax: a.n, H: 190, xlabel: T("第几笔", "Trade number"), series: [{ points: pts, cls: 0, dots: true }], hlines: [{ y: 0 }] });
    $("#tp-bars").innerHTML = barChart({ H: 160, bars: a.trades.map((t, i) => ({ label: String(i + 1), value: t.pnl, cls: t.pnl >= 0 ? 3 : 2 })), xlabel: T("每笔损益（美元）", "P&L per trade ($)") });
  };
  ta.addEventListener("input", draw);
  root.querySelectorAll("[data-pre]").forEach((b) => b.addEventListener("click", () => { ta.value = PRESETS[b.dataset.pre]; draw(); }));
  draw();
}
