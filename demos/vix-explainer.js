// 交互演示：VIX 与 SPX 的反向关系。
// 拖动 SPX 当日跌幅滑块 → 用一个单调映射推高 VIX；.stat-row 显示 SPX变动 / VIX水平 / 对应日波动。
// 附 VIX 水平(12/20/30/40+)的历史含义注解。把"反向相关"做到可触摸。真算(映射 + √252 换算)。

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const baseVix = 15;   // 平静基准 VIX
  const baseSpxMove = 0; // 基准日变动 0%
  const SQRT252 = Math.sqrt(252);

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">😱 ${T("VIX 恐慌指数：股市一跌，它就蹿——反向相关", "The VIX: when stocks drop, it spikes — the inverse correlation")}</div>

      <p class="demo-meta">${T(
        "拖动标普 500 (SPX) 的<b>当日涨跌</b>。下跌时投资者抢购看跌期权对冲，推高其隐含波动率，<b>VIX 随之飙升</b>；上涨或平静时 VIX 回落。这就是“恐慌指数”与股市的反向关系。",
        "Drag the S&P 500 (SPX) <b>daily move</b>. On down days, investors rush to buy puts for protection, pushing their implied vol up, so <b>VIX spikes</b>; on up/calm days it eases. That's the inverse relationship between the 'fear index' and stocks."
      )}</p>

      <div class="demo-block">
        <label class="demo-label">${T("SPX 当日涨跌", "SPX move today")} = <b id="vx-m-v">0.0</b>%</label>
        <input class="demo-slider" id="vx-m" type="range" min="-12" max="5" step="0.1" value="0"/>
      </div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("SPX 当日变动", "SPX move")}</div><div class="v" id="vx-spx">–</div></div>
        <div class="stat"><div class="k">${T("VIX 水平", "VIX level")}</div><div class="v acc" id="vx-vix">–</div></div>
        <div class="stat"><div class="k">${T("对应预期日波动", "Implied daily move")}</div><div class="v" id="vx-day">–</div></div>
      </div>

      <div class="bar2" style="margin-top:14px"><div class="lab">VIX</div><div class="track"><div class="fill" id="vx-bar" style="background:var(--red)"></div></div><div class="val" id="vx-bar-v">–</div></div>

      <div class="detail" id="vx-regime" style="margin-top:10px;text-align:center"></div>

      <div class="section-h" style="font-size:15px;margin-top:20px">📏 ${T("VIX 水平的历史含义", "What VIX levels have meant")}</div>
      <table class="ochain" id="vx-table"></table>

      <p class="demo-tip">${T(
        "VIX = 市场预期未来 30 天 SPX 的<b>年化</b>波动率。换成“一天大概动多少”就除以 √252≈15.87（回扣阶段 4.2）。注意：VIX 是<b>计算出的指数</b>，<b>不能直接买</b>——只能通过 VIX 期货/期权/ETP 参与，且受期限结构与滚动成本影响。",
        "VIX = the market's expected <b>annualized</b> 30-day vol of the SPX. To get a typical daily move, divide by √252≈15.87 (Stage 4.2). Note: VIX is a <b>computed index</b> you <b>cannot buy directly</b> — only via VIX futures/options/ETPs, subject to term structure and roll costs."
      )}</p>
    </div>`;

  const $ = (id) => root.querySelector(id);

  // 反向映射：SPX 下跌越多，VIX 越高。非线性——大跌时跳得更急。
  // move 为百分比（负=跌）。VIX = base + 下行放大；上涨小幅压低。
  function vixFromMove(movePct) {
    if (movePct <= 0) {
      const drop = -movePct;                 // 0..12
      // 凸函数：跌 1% 加 ~4，跌 5% 加 ~28，跌 10% 加 ~65（贴近历史观感）
      return baseVix + 3.6 * drop + 0.28 * drop * drop;
    }
    // 上涨：温和压低，地板 ~10
    return Math.max(10, baseVix - 1.0 * movePct);
  }

  const regimes = [
    { lo: 0, hi: 13, cls: "pill ok", zh: "极度平静（自满期）", en: "Very calm (complacency)" },
    { lo: 13, hi: 20, cls: "pill acc", zh: "正常 / 温和", en: "Normal / mild" },
    { lo: 20, hi: 30, cls: "pill gold", zh: "紧张 / 回调", en: "Nervous / correction" },
    { lo: 30, hi: 45, cls: "pill bad", zh: "恐慌 / 危机", en: "Fear / crisis" },
    { lo: 45, hi: 999, cls: "pill bad", zh: "系统性崩盘（2008/2020 级）", en: "Systemic crash (2008/2020-level)" },
  ];

  function paint() {
    const move = +$("#vx-m").value;
    $("#vx-m-v").textContent = move.toFixed(1);

    const vix = vixFromMove(move);
    const dayMove = vix / SQRT252; // 预期日波动 %

    $("#vx-spx").textContent = (move >= 0 ? "+" : "") + move.toFixed(1) + "%";
    $("#vx-spx").className = "v " + (move > 0 ? "pos" : move < 0 ? "neg" : "");
    $("#vx-vix").textContent = vix.toFixed(1);
    $("#vx-day").textContent = "±" + dayMove.toFixed(2) + "%";

    $("#vx-bar").style.width = Math.min(100, vix / 80 * 100) + "%";
    $("#vx-bar-v").textContent = vix.toFixed(1);

    const reg = regimes.find((r) => vix >= r.lo && vix < r.hi) || regimes[regimes.length - 1];
    $("#vx-regime").innerHTML =
      `<span class="${reg.cls}">VIX ${vix.toFixed(0)} · ${T(reg.zh, reg.en)}</span>` +
      `<div class="dk" style="margin-top:8px">${T(
        `市场预期未来 30 天 SPX 年化波动 ≈ ${vix.toFixed(0)}%，约合每天 ±${dayMove.toFixed(2)}%。`,
        `Market expects ≈ ${vix.toFixed(0)}% annualized 30-day SPX vol, about ±${dayMove.toFixed(2)}% per day.`
      )}</div>`;
  }

  // 历史含义表
  const rows = [
    ["12", T("超低：牛市、自满，期权便宜", "Ultra-low: bull market, complacency, cheap options"), (12 / SQRT252)],
    ["20", T("长期均值附近：正常波动", "Near long-run average: normal"), (20 / SQRT252)],
    ["30", T("市场紧张、明显回调", "Nervous market, clear correction"), (30 / SQRT252)],
    ["40+", T("恐慌、危机", "Fear, crisis"), (40 / SQRT252)],
    ["80", T("系统性崩盘（2008 / 2020）", "Systemic crash (2008 / 2020)"), (80 / SQRT252)],
  ];
  let thtml = `<caption>${T("VIX 水平 → 含义 → 对应预期日波动", "VIX level → meaning → implied daily move")}</caption><tr><th>VIX</th><th>${T("历史含义", "Historical meaning")}</th><th>${T("≈ 日波动", "≈ daily")}</th></tr>`;
  for (const [v, mean, dm] of rows) {
    thtml += `<tr><td class="strike-col">${v}</td><td style="text-align:left;font-family:var(--sans)">${mean}</td><td>±${dm.toFixed(2)}%</td></tr>`;
  }
  $("#vx-table").innerHTML = thtml;

  $("#vx-m").addEventListener("input", paint);
  paint();
}
