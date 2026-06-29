// 交互演示：凯利公式与仓位管理。
// 输入胜率 p、盈亏比 b（滑块）→ 实算 f* = p − (1−p)/b；展示满/半/四分之一凯利；
// 一个 ~100 笔交易的资金增长模拟，比较“欠注/最优/过度下注”——过度下注会爆仓。
// 用确定性的胜负序列（按 index，不用 Math.random），保证每次结果可复现。
// 真算：凯利公式 + 逐笔复利。.stat-row。

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const N = 100; // 交易笔数
  const START = 10000; // 起始资金

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🎲 ${T("凯利公式与仓位：押多大，比押什么更重要", "Kelly & sizing: how much matters more than what")}</div>

      <div class="demo-block">
        <label class="demo-label">${T("胜率 p", "Win probability p")} = <b id="k-p-v">55</b>%</label>
        <input class="demo-slider" id="k-p" type="range" min="35" max="75" step="1" value="55"/>
      </div>
      <div class="demo-block">
        <label class="demo-label">${T("盈亏比 b（平均盈利 ÷ 平均亏损）", "Win/loss ratio b (avg win ÷ avg loss)")} = <b id="k-b-v">1.0</b></label>
        <input class="demo-slider" id="k-b" type="range" min="0.5" max="3" step="0.1" value="1.0"/>
      </div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("优势（期望/注）", "Edge (E per bet)")}</div><div class="v" id="k-edge">–</div></div>
        <div class="stat"><div class="k">${T("满凯利 f*", "Full Kelly f*")}</div><div class="v acc" id="k-full">–</div></div>
        <div class="stat"><div class="k">${T("半凯利", "Half Kelly")}</div><div class="v" id="k-half">–</div></div>
        <div class="stat"><div class="k">${T("四分之一凯利", "Quarter Kelly")}</div><div class="v" id="k-quarter">–</div></div>
      </div>

      <div id="k-noedge" class="demo-warn" style="margin-top:12px;display:none"></div>

      <div class="demo-label" style="margin-top:18px">${T(
        "同一串运气（确定性序列），不同下注比例，100 笔后的资金：",
        "Same luck (deterministic sequence), different bet sizes, capital after 100 trades:"
      )}</div>
      <div id="k-bars"></div>

      <div class="stat-row" style="margin-top:12px">
        <div class="stat"><div class="k">${T("欠注（¼凯利）终值", "Under (¼ Kelly) final")}</div><div class="v" id="k-end-u">–</div></div>
        <div class="stat"><div class="k">${T("最优（满凯利）终值", "Optimal (full) final")}</div><div class="v" id="k-end-o">–</div></div>
        <div class="stat"><div class="k">${T("过度（3×凯利）终值", "Over (3× Kelly) final")}</div><div class="v" id="k-end-x">–</div></div>
      </div>

      <p class="demo-tip" id="k-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const money = (v) => "$" + Math.round(v).toLocaleString("en-US");

  // 凯利：f* = p − (1−p)/b
  const kelly = (p, b) => p - (1 - p) / b;

  // 确定性胜负序列：把 p 量化到每 20 笔中 round(p*20) 笔为胜，交错分布以避免连胜/连负偏置。
  function sequence(p) {
    const seq = [];
    const winsPer20 = Math.round(p * 20);
    for (let i = 0; i < N; i++) {
      // 在每个长度 20 的窗口里，用“余数法”把胜均匀铺开
      const slot = i % 20;
      // 胜的位置：slot * winsPer20 在 [0,20) 里是否跨过一个整数边界
      const isWin = Math.floor((slot * winsPer20) / 20) !== Math.floor(((slot + 1) * winsPer20) / 20);
      seq.push(isWin);
    }
    return seq;
  }

  // 用某个下注比例 f 跑完整条序列，返回资金曲线（数组）。亏损封顶在全损（不会倒欠）。
  function run(seq, b, f) {
    const frac = Math.max(0, Math.min(f, 1)); // 押注比例限制在 [0,1]
    let cap = START;
    const curve = [cap];
    for (const win of seq) {
      if (cap <= 0) { curve.push(0); continue; }
      cap = win ? cap * (1 + frac * b) : cap * (1 - frac);
      if (cap < 1e-6) cap = 0;
      curve.push(cap);
    }
    return curve;
  }

  function bar(label, val, color, maxVal) {
    const pct = Math.max(2, Math.min(100, (val / maxVal) * 100));
    return `<div class="bar2">
      <div class="lab">${label}</div>
      <div class="track"><div class="fill" style="width:${pct}%;background:${color}"></div></div>
      <div class="val">${money(val)}</div>
    </div>`;
  }

  function paint() {
    const p = +$("#k-p").value / 100;
    const b = +$("#k-b").value;
    $("#k-p-v").textContent = (p * 100).toFixed(0);
    $("#k-b-v").textContent = b.toFixed(1);

    const f = kelly(p, b);
    const edge = p * b - (1 - p); // 每注期望（以注为单位）
    $("#k-edge").textContent = (edge >= 0 ? "+" : "") + edge.toFixed(3);
    $("#k-edge").className = "v " + (edge > 0 ? "pos" : "neg");

    const fullPct = (f * 100);
    $("#k-full").textContent = (f * 100).toFixed(1) + "%";
    $("#k-half").textContent = (Math.max(0, f / 2) * 100).toFixed(1) + "%";
    $("#k-quarter").textContent = (Math.max(0, f / 4) * 100).toFixed(1) + "%";
    $("#k-full").className = "v " + (f > 0 ? "acc" : "neg");

    const warn = $("#k-noedge");
    if (f <= 0) {
      warn.style.display = "block";
      warn.innerHTML = T(
        `⚠️ <b>没有优势（f* ≤ 0）</b>：在 p=${(p * 100).toFixed(0)}%、b=${b.toFixed(1)} 下，期望为负，凯利给出的最优仓位是 <b>0</b>——正确的做法是<b>根本不下注</b>。`,
        `⚠️ <b>No edge (f* ≤ 0)</b>: at p=${(p * 100).toFixed(0)}%, b=${b.toFixed(1)} the expectation is negative; Kelly's optimal size is <b>0</b> — the right move is <b>not to bet at all</b>.`
      );
    } else {
      warn.style.display = "none";
    }

    // 资金模拟
    const seq = sequence(p);
    const fU = Math.max(0, f / 4);   // 欠注：四分之一凯利
    const fO = Math.max(0, f);        // 最优：满凯利
    const fX = Math.max(0, f * 3);    // 过度：3 倍凯利
    const endU = run(seq, b, fU).at(-1);
    const endO = run(seq, b, fO).at(-1);
    const endX = run(seq, b, fX).at(-1);

    const maxVal = Math.max(endU, endO, endX, START);
    $("#k-bars").innerHTML =
      bar(T("¼ 凯利", "¼ Kelly"), endU, "var(--accent)", maxVal) +
      bar(T("满凯利", "Full Kelly"), endO, "var(--gold)", maxVal) +
      bar(T("3× 凯利", "3× Kelly"), endX, "var(--red)", maxVal);

    $("#k-end-u").textContent = money(endU);
    $("#k-end-o").textContent = money(endO);
    $("#k-end-x").textContent = money(endX);
    $("#k-end-u").className = "v " + (endU >= START ? "pos" : "neg");
    $("#k-end-o").className = "v " + (endO >= START ? "pos" : "neg");
    $("#k-end-x").className = "v " + (endX >= START ? "pos" : "neg");

    if (f <= 0) {
      $("#k-tip").innerHTML = T(
        `f* ≤ 0 时无优势：任何正的下注比例长期都亏。把 <b>胜率</b>或<b>盈亏比</b>拖高，让 f* 变正，再看仓位如何决定命运。`,
        `With f* ≤ 0 there is no edge: any positive bet size loses long-run. Raise <b>win rate</b> or <b>ratio</b> until f* turns positive, then watch how sizing decides fate.`
      );
    } else {
      const overBust = endX < START;
      $("#k-tip").innerHTML = T(
        `起始 <b>${money(START)}</b>、同一串运气。<b>满凯利</b>（${fullPct.toFixed(1)}%）这串里增长最快，但回撤剧烈；<b>¼ 凯利</b>更平滑、更能扛。而 <b>3× 凯利</b>（${(fX * 100).toFixed(1)}%）${overBust ? `把账户打到 <b>${money(endX)}</b>——<b>过度下注让正期望系统也爆仓</b>` : `虽然这串没爆，但其极端波动随时会团灭`}。教训：<b>有优势只是前提，押对大小才决定生死</b>（阶段 8.1）。`,
        `Start <b>${money(START)}</b>, same luck. <b>Full Kelly</b> (${fullPct.toFixed(1)}%) grows fastest here but with violent drawdowns; <b>¼ Kelly</b> is smoother and survivable. <b>3× Kelly</b> (${(fX * 100).toFixed(1)}%) ${overBust ? `crashes the account to <b>${money(endX)}</b> — <b>over-betting busts even a positive-edge system</b>` : `barely survives this run but its extreme swings invite ruin`}. Lesson: <b>edge is only the premise; sizing decides survival</b> (Stage 8.1).`
      );
    }
  }

  $("#k-p").addEventListener("input", paint);
  $("#k-b").addEventListener("input", paint);
  paint();
}
