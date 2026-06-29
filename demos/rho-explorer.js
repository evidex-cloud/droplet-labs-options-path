// 交互演示：Rho 与股息。lineChart 画 价格 vs 无风险利率 r（看涨 line/青、看跌 line2/金）。
// 滑块：到期天数（看 Rho 随期限变大，LEAPS）+ 股息率 q（看涨↓/看跌↑）。
// .stat-row 显示当前 call/put 的 Rho。真算：bsPrice() / greeks()。
import { bsPrice, greeks } from "./_bs.js";
import { lineChart, chartBlock } from "./_chart.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const S = 100, K = 100, sigma = 0.2;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🏦 ${T("Rho 与股息：利率与分红怎样推动期权价", "Rho & dividends: how rates and payouts move prices")}</div>

      <div class="demo-grid">
        <div class="demo-block"><label class="demo-label">${T("到期天数", "Days to expiry")} = <b id="re-d-v">365</b> ${T("（越长 Rho 越显著）", "(longer → bigger Rho)")}</label><input class="demo-slider" id="re-d" type="range" min="30" max="730" step="5" value="365"/></div>
        <div class="demo-block"><label class="demo-label">${T("股息率 q", "Dividend yield q")} = <b id="re-q-v">0.0</b>%</label><input class="demo-slider" id="re-q" type="range" min="0" max="8" step="0.1" value="0"/></div>
      </div>

      <div id="re-chart"></div>

      <div class="stat-row" style="margin-top:12px">
        <div class="stat"><div class="k">${T("看涨 Rho /1%", "Call Rho /1%")}</div><div class="v pos" id="re-rc">–</div></div>
        <div class="stat"><div class="k">${T("看跌 Rho /1%", "Put Rho /1%")}</div><div class="v neg" id="re-rp">–</div></div>
        <div class="stat"><div class="k">${T("看涨价 @r=4%", "Call @r=4%")}</div><div class="v acc" id="re-pc">–</div></div>
        <div class="stat"><div class="k">${T("看跌价 @r=4%", "Put @r=4%")}</div><div class="v" id="re-pp">–</div></div>
      </div>

      <p class="demo-tip" id="re-tip"></p>
    </div>`;

  const $ = (id) => root.querySelector(id);

  function paint() {
    const days = +$("#re-d").value, q = +$("#re-q").value / 100;
    $("#re-d-v").textContent = days;
    $("#re-q-v").textContent = (q * 100).toFixed(1);
    const Tyr = days / 365;

    // x = 利率 r (%), 0 ~ 10
    const callAt = (rPct) => bsPrice({ S, K, T: Tyr, r: rPct / 100, sigma, type: "call", q });
    const putAt = (rPct) => bsPrice({ S, K, T: Tyr, r: rPct / 100, sigma, type: "put", q });

    const res = lineChart({
      fns: [
        { f: callAt, cls: "line" },  // 看涨（青）：随 r 上升
        { f: putAt, cls: "line2" },  // 看跌（金）：随 r 下降
      ],
      lo: 0, hi: 10,
      xlabel: T("无风险利率 r (%)", "Risk-free rate r (%)"),
      markerX: 4,
      markerLabel: "r=4%",
      forceZero: false,
    });
    $("#re-chart").innerHTML = chartBlock(res, [
      ["var(--accent)", T("看涨价 vs 利率（+Rho，上升）", "Call vs rate (+Rho, rising)")],
      ["var(--gold)", T("看跌价 vs 利率（−Rho，下降）", "Put vs rate (−Rho, falling)")],
    ]);

    const r0 = 0.04;
    const gc = greeks({ S, K, T: Tyr, r: r0, sigma, type: "call", q });
    const gp = greeks({ S, K, T: Tyr, r: r0, sigma, type: "put", q });
    $("#re-rc").textContent = "+" + gc.rho.toFixed(3);
    $("#re-rp").textContent = gp.rho.toFixed(3);
    $("#re-pc").textContent = "$" + gc.price.toFixed(2);
    $("#re-pp").textContent = "$" + gp.price.toFixed(2);

    // 股息影响参照（q=0 对照）
    const cNoDiv = bsPrice({ S, K, T: Tyr, r: r0, sigma, type: "call", q: 0 });
    const pNoDiv = bsPrice({ S, K, T: Tyr, r: r0, sigma, type: "put", q: 0 });

    $("#re-tip").innerHTML = T(
      `<b>青线（看涨）随利率上升、金线（看跌）随利率下降</b>——看涨 +Rho、看跌 −Rho，根源是利率压低了行权价的现值 K·e^(−rT)。把<b>天数</b>拖到 730（2 年 LEAPS）：看涨 Rho 从短期的几分钱涨到 <b>+${gc.rho.toFixed(2)}</b>/1%——这就是“Rho 只在长期权显著”。再拖<b>股息 q</b>：当前 q=${(q * 100).toFixed(1)}% 让看涨从 $${cNoDiv.toFixed(2)}(q=0) 压到 <b>$${gc.price.toFixed(2)}</b>、看跌从 $${pNoDiv.toFixed(2)} 抬到 <b>$${gp.price.toFixed(2)}</b>（股息方向与利率相反，阶段 5.6）。`,
      `The <b>cyan (call) line rises with rates, gold (put) falls</b> — call +Rho, put −Rho, because rates shrink the present value of the strike K·e^(−rT). Drag <b>days</b> to 730 (2yr LEAPS): call Rho grows from cents to <b>+${gc.rho.toFixed(2)}</b>/1% — that is why Rho matters mainly for long-dated options. Drag <b>dividend q</b>: current q=${(q * 100).toFixed(1)}% pushes the call from $${cNoDiv.toFixed(2)} (q=0) down to <b>$${gc.price.toFixed(2)}</b> and the put from $${pNoDiv.toFixed(2)} up to <b>$${gp.price.toFixed(2)}</b> (dividends move opposite to rates, Stage 5.6).`
    );
  }

  $("#re-d").addEventListener("input", paint);
  $("#re-q").addEventListener("input", paint);
  paint();
}
