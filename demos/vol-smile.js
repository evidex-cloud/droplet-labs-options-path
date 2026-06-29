// 交互演示：波动率微笑/偏斜曲线（IV vs 行权价），用 _chart.js 的 lineChart 画。
// .demo-seg 切换 [股票偏斜 skew / 外汇微笑 smile / 平坦 flat(错)]，按形状画 IV(K)。
// 标出 ATM；指出股票偏斜里低行权看跌 IV 更高。真算（曲线由解析函数生成）。
import { lineChart, chartBlock } from "./_chart.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const S = 100;           // 当前价（ATM 基准）
  const atmIV = 20;        // ATM 隐含波动率（%）
  const lo = 70, hi = 130; // 行权价范围

  // 三种形状的 IV(K)，单位 %。以 moneyness m = (K - S)/S 为自变量。
  // 股票偏斜：随行权价单调递减、且凸（低行权 IV 高）。
  // 外汇微笑：对称、两端翘起。
  // 平坦：常数（BS 假设，现实错误）。
  const shapes = {
    skew: {
      f: (K) => {
        const m = (K - S) / S;            // -0.3 ~ +0.3
        return atmIV - 30 * m + 40 * m * m; // 递减 + 凸
      },
      label: T("股票偏斜 (skew)", "Equity skew"),
      note: T(
        "股票/股指典型：<b>低行权价（看跌）IV 明显更高</b>，越往高行权 IV 越低——市场为崩盘恐惧（肥尾 + 单向保护买盘）明码标价。",
        "Typical for equities/indices: <b>low strikes (puts) carry much higher IV</b>, falling toward high strikes — the market pricing crash fear (fat tails + one-way protective demand)."
      ),
    },
    smile: {
      f: (K) => {
        const m = (K - S) / S;
        return atmIV + 95 * m * m;        // 对称两端翘起
      },
      label: T("外汇微笑 (smile)", "FX smile"),
      note: T(
        "外汇/商品典型：曲线对称，<b>ATM 最低、两侧虚值都更高</b>——市场对涨和跌的尾部恐惧大致对称（主要由肥尾驱动）。",
        "Typical for FX/commodities: symmetric, <b>lowest at ATM, higher on both wings</b> — roughly symmetric tail fear up and down (driven mainly by fat tails)."
      ),
    },
    flat: {
      f: () => atmIV,                      // 常数
      label: T("平坦 (BS 假设·错)", "Flat (BS assumption · wrong)"),
      note: T(
        "这是 Black-Scholes 的假设：σ 对所有行权价相等，画出来是一条水平线。<b>现实中从不成立</b>——真实市场总是微笑或偏斜。",
        "This is the Black-Scholes assumption: σ equal across all strikes, a flat line. <b>It never holds in reality</b> — real markets always smile or skew."
      ),
    },
  };

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">📉 ${T("波动率微笑与偏斜：IV 怎样随行权价变化", "The vol smile & skew: how IV varies across strikes")}</div>

      <div class="demo-seg" id="vs-seg" style="margin-bottom:10px">
        <button data-s="skew" class="on">${shapes.skew.label}</button>
        <button data-s="smile">${shapes.smile.label}</button>
        <button data-s="flat">${shapes.flat.label}</button>
      </div>

      <div id="vs-chart"></div>

      <div class="stat-row" style="margin-top:12px">
        <div class="stat"><div class="k">${T("低行权 K=80 IV", "Low strike K=80 IV")}</div><div class="v" id="vs-lo">–</div></div>
        <div class="stat"><div class="k">${T("平值 ATM K=100 IV", "ATM K=100 IV")}</div><div class="v acc" id="vs-atm">–</div></div>
        <div class="stat"><div class="k">${T("高行权 K=120 IV", "High strike K=120 IV")}</div><div class="v" id="vs-hi">–</div></div>
      </div>

      <p class="demo-meta" id="vs-note" style="margin-top:10px"></p>
      <p class="demo-tip">${T(
        "竖线是当前价（ATM）。注意<b>股票偏斜</b>里 K=80（虚值看跌）的 IV 远高于 K=120（虚值看涨）——这就是“崩盘恐惧溢价”。Black-Scholes 假设的“平坦”从不出现在真实市场（阶段 4.1 的假设破绽）。",
        "The vertical line is spot (ATM). In <b>equity skew</b>, K=80 (downside puts) has far higher IV than K=120 (upside calls) — the crash-fear premium. The Black-Scholes 'flat' line never shows up in real markets (the broken assumption from Stage 4.1)."
      )}</p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  let cur = "skew";

  function paint() {
    const shp = shapes[cur];
    const res = lineChart({
      fns: [{ f: shp.f, cls: cur === "skew" ? "line" : cur === "smile" ? "line2" : "line3", label: "IV" }],
      lo, hi,
      xlabel: T("行权价 K", "Strike K"),
      markerX: S,
      markerLabel: T("现价/ATM", "Spot/ATM"),
      forceZero: false,
    });
    $("#vs-chart").innerHTML = chartBlock(res, [[
      cur === "skew" ? "var(--accent)" : cur === "smile" ? "var(--gold)" : "var(--red)",
      T("隐含波动率 IV (%) vs 行权价", "Implied vol IV (%) vs strike"),
    ]]);

    const ivLo = shp.f(80), ivAtm = shp.f(100), ivHi = shp.f(120);
    $("#vs-lo").textContent = ivLo.toFixed(1) + "%";
    $("#vs-atm").textContent = ivAtm.toFixed(1) + "%";
    $("#vs-hi").textContent = ivHi.toFixed(1) + "%";
    // 着色：偏斜里低行权更“贵”
    $("#vs-lo").className = "v" + (ivLo > ivAtm + 0.5 ? " neg" : "");
    $("#vs-hi").className = "v" + (ivHi > ivAtm + 0.5 ? " neg" : "");
    $("#vs-note").innerHTML = shp.note;
  }

  $("#vs-seg").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    cur = b.dataset.s;
    [...$("#vs-seg").children].forEach((c) => c.classList.toggle("on", c === b));
    paint();
  });
  paint();
}
