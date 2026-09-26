// Inline demo for lesson tail-hedging: the convexity of out-of-the-money puts — premium vs payout multiple as the crash deepens,
// with a simple linear skew, and the value of "monetising" early when implied vol spikes.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, tex } from "./_viz.js";

// BASE = XYZ's at-the-money implied vol (20%); the skew adds `skew` vol points at 15% out of the money, linearly in moneyness.
const r = 0.04, Tm = 30 / 365, BASE = 0.2, STRIKES = [95, 90, 85, 80];

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("虚值看跌的凸性：花一点，崩盘时赔很多", "The convexity of out-of-the-money puts: pay a little, collect a lot in a crash")}</div>
    <div class="demo-grid">
      ${slider("tc-c", T("一个月内 XYZ 的跌幅", "XYZ's fall within the month"), 0, 50, 1, 25)}
      ${slider("tc-k", T("偏斜：15% 虚值处的隐含波动率加点", "Skew: extra implied vol at 15% out of the money (pts)"), 0, 20, 1, 8)}
      ${slider("tc-v", T("崩盘后的隐含波动率（平值）", "At-the-money implied vol after the crash"), 20, 80, 1, 50)}
    </div>
    <div class="demo-math" id="tc-f"></div>
    <div id="tc-t"></div>
    <div id="tc-c2"></div>
    <p class="demo-tip">${T("看什么：跌幅不到虚值距离时，所有看跌都归零；一旦越过行权价，越虚值的看跌赔付倍数涨得越猛——这就是凸性。偏斜加点越高，买入价越贵，倍数越低。“半个月时卖出”一列假设跌幅在前半个月就已发生：此时卖出，已经能拿到接近到期赔付的钱，离新股价最近的行权价还因隐含波动率飙升多出一截时间价值——现金落袋，不怕之后反弹。", "What to notice: until the fall passes a put's strike it pays nothing; once past, the further out of the money the put, the faster its multiple explodes — that is convexity. More skew makes the puts dearer and the multiples smaller. The “sell at mid-month” column assumes the fall happened in the first half of the month: selling then already collects about the expiry payout, and the strikes nearest the new price carry extra time value from the vol spike — cash in hand before any rebound can take it away.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const ivAt = (K, skew) => BASE + (skew / 0.15) * Math.max(0, 1 - K / 100);
  // After the crash the skew is measured from the NEW spot: strikes below it get extra vol, strikes above it (now in the
  // money) sit on the cheaper side of the skew. Floor at 5% so the linear rule never goes negative.
  const ivAfter = (K, ST, skew, atm) => Math.max(0.05, atm + (skew / 0.15) * (1 - K / ST));
  const draw = (v) => {
    const c = v["tc-c"] / 100, skew = v["tc-k"] / 100, ivPost = v["tc-v"] / 100, ST = 100 * (1 - c);
    const rows = STRIKES.map((K) => {
      const iv = ivAt(K, skew), p = O.bsPut(100, K, Tm, r, iv);
      const pay = Math.max(K - ST, 0);
      const mid = O.bsPut(ST, K, 15 / 365, r, ivAfter(K, ST, skew, ivPost));
      return { K, iv, p, pay, mult: pay / p, mid, multMid: mid / p };
    });
    const k85 = rows[2];
    $("#tc-f").innerHTML = tex(String.raw`\text{${T("倍数", "multiple")}} = \frac{\max(K - S_T,\,0)}{P_0}`, true) + tex(String.raw`K = 85,\ \sigma = ${(k85.iv * 100).toFixed(0)}\%:\quad \frac{\max(85 - ${ST.toFixed(0)},\,0)}{${k85.p.toFixed(3)}} = ${k85.mult.toFixed(0)}\times`, true);
    $("#tc-t").innerHTML = `<div style="overflow-x:auto"><table style="white-space:nowrap"><thead><tr><th>${T("行权价", "Strike")}</th><th>${T("隐含波动率", "Implied vol")}</th><th>${T("每股权利金", "Premium / share")}</th><th>${T("到期赔付", "Payout at expiry")}</th><th>${T("倍数", "Multiple")}</th><th>${T("半个月时卖出", "Sell at mid-month")}</th></tr></thead><tbody>${rows.map((x) => `<tr${x.pay > 0 ? ' class="itm"' : ""}><td>${x.K}</td><td>${(x.iv * 100).toFixed(0)}%</td><td>$${x.p.toFixed(3)}</td><td>$${x.pay.toFixed(2)}</td><td>${x.mult.toFixed(0)}×</td><td>$${x.mid.toFixed(2)} (${x.multMid.toFixed(0)}×)</td></tr>`).join("")}</tbody></table></div>`;
    const cls = [0, 1, 3, 4];
    $("#tc-c2").innerHTML = lineChart({
      xmin: 0, xmax: 50, logY: true, ymin: 1, H: 240, xlabel: T("一个月内的跌幅（%）", "Fall within the month (%)"), ylabel: T("到期赔付 ÷ 权利金", "Payout ÷ premium"),
      yfmt: (y) => y + "×",
      series: rows.map((x, i) => ({ f: (d) => { const pay = Math.max(x.K - 100 * (1 - d / 100), 0) / x.p; return pay > 0 ? pay : NaN; }, cls: cls[i], label: T("行权价 ", "strike ") + x.K })),
      markers: [{ x: c * 100, label: T("你选的跌幅", "your fall") }],
    });
  };
  bindSliders(root, { "tc-c": (x) => "−" + x + "%", "tc-k": (x) => "+" + x, "tc-v": (x) => x + "%" }, draw);
}
