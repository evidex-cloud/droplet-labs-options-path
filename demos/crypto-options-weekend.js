// Inline demo for lesson crypto-options: one weekend, two venues. A short 7-day bitcoin put (strike 90% of Friday's price,
// sold Friday 4 p.m. ET at 50% implied vol) held on a 24/7 crypto venue (marked and margin-checked every hour) and the same
// exposure through an option on a bitcoin ETF (no trading or margin checks until Monday 9:30). Illustrative numbers.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

const S0 = 100000, K = 90000, IV = 0.5, DAYS = 7, HOURS = 65.5, MAINT = 2500;
const putAt = (S, h) => O.bsPrice({ S, K, T: (DAYS - h / 24) / 365, r: 0, sigma: IV, type: "put" });
// weekend path: drifts to Monday's level, with an extra dip that is deepest on Saturday night
const btcAt = (h, move, dip) => S0 * (1 + move * (h / HOURS) - dip * Math.sin((Math.PI * h) / HOURS));
const dayName = (h, en) => {
  const t = 16 + h, d = Math.floor(t / 24), hh = Math.floor(t % 24);
  const names = en ? ["Fri", "Sat", "Sun", "Mon"] : ["周五", "周六", "周日", "周一"];
  return `${names[Math.min(3, d)]} ${String(hh).padStart(2, "0")}:00`;
};

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let coll = "usd";
  const prem = putAt(S0, 0);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("一个周末，两种场所：24/7 的保证金与周一的跳空", "One weekend, two venues: 24/7 margin versus a Monday gap")}</div>
    <p class="demo-meta">${T(`周五 16:00 以 ${prem.toFixed(0)} 美元卖出一张 7 天、行权价 90,000 的比特币看跌（BTC 示意价 100,000，隐含波动率 50%）。维持保证金 ${MAINT.toLocaleString("en-US")} 美元。`, `Sold Friday 4 p.m.: one 7-day bitcoin put, strike 90,000, for $${prem.toFixed(0)} (illustrative BTC 100,000, implied vol 50%). Maintenance margin $${MAINT.toLocaleString("en-US")}.`)}</p>
    <div class="demo-row">${seg("cw-c", [["usd", T("保证金是美元稳定币", "Collateral in a dollar stablecoin")], ["btc", T("保证金是 BTC（币本位）", "Collateral in BTC (coin-margined)")]], coll)}</div>
    <div class="demo-grid">
      ${slider("cw-m", T("周一开盘时 BTC 的净变化", "BTC's net change by Monday's open"), -30, 10, 1, -8)}
      ${slider("cw-dip", T("周末途中的额外下探", "Extra dip during the weekend"), 0, 15, 1, 10)}
      ${slider("cw-c0", T("存入的保证金（美元价值）", "Collateral posted (dollar value)"), 5000, 40000, 1000, 7000)}
    </div>
    <div id="cw-chart"></div>
    <div class="demo-math" id="cw-f"></div>
    <div id="cw-stats"></div>
    <p class="demo-tip">${T("看什么：加密场所每小时盯市，途中的下探可能在周六深夜就触发强平，把亏损锁在最低点；ETF 期权的账户周末不动，周一只看到净跳空。换成 BTC 保证金，同样的下跌还会让保证金本身缩水。", "What to notice: the crypto venue marks every hour, so a dip on the way can trigger liquidation on Saturday night and lock in the loss at the low; the ETF-option account does not move all weekend and only sees Monday's net gap. With BTC collateral the same drop also shrinks the collateral itself.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const move = v["cw-m"] / 100, dip = v["cw-dip"] / 100, C0 = v["cw-c0"];
    const collBtc = C0 / S0;
    const equity = (S, h) => (coll === "usd" ? C0 : collBtc * S) + prem - putAt(S, h);
    const pts = [], etf = [];
    let liqH = null, liqEq = null;
    for (let i = 0; i <= 131; i++) {
      const h = Math.min(HOURS, i * 0.5), S = btcAt(h, move, dip);
      if (liqH == null) {
        const e = equity(S, h);
        pts.push([h, e]);
        if (e < MAINT) { liqH = h; liqEq = e; }
      } else pts.push([h, liqEq]);
      etf.push([h, h < HOURS ? equity(S0, 0) : equity(S, HOURS)]);
    }
    const Smon = btcAt(HOURS, move, dip), low = Math.min(...Array.from({ length: 132 }, (_, i) => btcAt(Math.min(HOURS, i * 0.5), move, dip)));
    $("#cw-chart").innerHTML = lineChart({
      xmin: 0, xmax: HOURS, xlabel: T("周五 16:00 之后的小时数（65.5 = 周一 9:30）", "Hours after Friday 4 p.m. (65.5 = Monday 9:30)"), ylabel: T("账户权益（美元）", "Account equity ($)"),
      series: [
        { points: etf, cls: 1, dashed: true, label: T("ETF 期权账户（周末不盯市）", "ETF-option account (no weekend marks)") },
        { points: pts, cls: 4, label: T("24/7 加密场所", "24/7 crypto venue") },
      ],
      hlines: [{ y: MAINT, label: T("维持保证金", "maintenance margin") }],
      markers: liqH != null ? [{ x: liqH, label: T("强平", "liquidated") }] : [],
    });
    const eMon = equity(Smon, HOURS);
    const collTex = coll === "usd" ? "\\$" + C0.toLocaleString("en-US").replace(/,/g, "{,}") : collBtc.toFixed(3) + "\\ \\text{BTC} \\times S_t";
    $("#cw-f").innerHTML = tex(String.raw`\text{${T("权益", "equity")}} = \underbrace{${collTex}}_{\text{${T("保证金", "collateral")}}} + \underbrace{\$${prem.toFixed(0)}}_{\text{${T("收到的权利金", "premium")}}} - \underbrace{P(S_t)}_{\text{${T("看跌的盯市价", "put's mark")}}}`, true);
    const usd = (x) => (x < 0 ? "−$" : "$") + Math.abs(x).toLocaleString("en-US", { maximumFractionDigits: 0 });
    $("#cw-stats").innerHTML = stats([
      [T("周末最低 BTC", "Weekend low for BTC"), usd(low)],
      [T("周一 9:30 的 BTC", "BTC at Monday 9:30"), usd(Smon)],
      [T("加密场所", "Crypto venue"), liqH != null ? T("在 ", "liquidated ") + dayName(liqH, en) + T(" 被强平", "") : T("挺过周末", "survived the weekend"), liqH != null ? "neg" : "pos"],
      [T("加密场所：周一的权益", "Crypto venue: equity on Monday"), usd(liqH != null ? liqEq : eMon), (liqH != null ? liqEq : eMon) >= MAINT ? "pos" : "neg"],
      [T("ETF 期权账户：周一开盘的权益", "ETF-option account: equity at Monday's open"), usd(eMon), eMon >= MAINT ? "pos" : "neg"],
    ]);
  };
  const rerun = bindSliders(root, { "cw-m": (x) => (x > 0 ? "+" : "") + x + "%", "cw-dip": (x) => "−" + x + "%", "cw-c0": (x) => "$" + (+x).toLocaleString("en-US") }, draw);
  onSeg(root, "cw-c", (x) => { coll = x; rerun(); });
}
