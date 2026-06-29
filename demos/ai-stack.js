// 交互演示：AI 辅助交易工作流的 7 段流水线 + 人工检查点清单。
// 点击任一段：展示“谁主导 / 工具 / 你要验证什么”。🔴 = 动真钱或下结论的关键闸门。
// 底部一个“放行清单”：勾完所有🔴闸门才点亮“可上小额实盘”。强调 AI 提速、你把关。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // 七段。who: human/agent/both；gate: 是否关键闸门；tools, verify。
  const stages = [
    {
      icon: "🔌", zh: "数据接入", en: "Data ingestion", who: "human", gate: false,
      toolsZh: "券商/数据商 API、Python（pandas）", toolsEn: "Broker/data API, Python (pandas)",
      vZh: "数据<b>干净、对齐、无前视</b>：时间戳对、无缺失、已复权。垃圾进垃圾出，后面所有结论都建在这层上。",
      vEn: "Data is <b>clean, aligned, no look-ahead</b>: right timestamps, no gaps, adjusted. Garbage in, garbage out — everything downstream rests on this.",
    },
    {
      icon: "🔎", zh: "LLM 研究/筛选", en: "LLM research/screen", who: "agent", gate: true,
      toolsZh: "LLM / 智能体（阶段 10.5）", toolsEn: "LLM / agent (Stage 10.5)",
      vZh: "🔴 <b>交叉验证它给的每个事实与来源</b>。LLM 会<b>幻觉</b>——编造论文、记错数字。它的输出是“待核实线索”，不是证据。",
      vEn: "🔴 <b>Cross-verify every fact and source it gives.</b> LLMs <b>hallucinate</b> — fake papers, wrong numbers. Its output is a lead to check, not evidence.",
    },
    {
      icon: "⌨️", zh: "AI 辅助写代码", en: "AI-assisted coding", who: "agent", gate: true,
      toolsZh: "LLM、Python、notebook（定价见 11.3）", toolsEn: "LLM, Python, notebook (pricing: 11.3)",
      vZh: "🔴 <b>逐行读懂 + 用已知答案对数</b>。让它的 BS 函数算经典基准 S=K=100,T=1,r=5%,σ=20% → 必须 ≈ <b>10.45</b>，否则有 bug。把 assert 写进代码当自动验收。",
      vEn: "🔴 <b>Read every line + test vs a known answer.</b> Make its BS function price S=K=100,T=1,r=5%,σ=20% → must be ≈ <b>10.45</b>, else it's buggy. Put the assert in the code.",
    },
    {
      icon: "🧑‍⚖️", zh: "人工复核", en: "Human review", who: "human", gate: true,
      toolsZh: "你的判断 + 三关 checklist", toolsEn: "Your judgment + 3-gate checklist",
      vZh: "🔴 <b>不可跳过的闸门</b>。审三关：① 有无<b>前视/泄漏</b>（11.4）？② <b>成本/滑点</b>扣了吗（阶段 10.6）？③ 样本外稳吗、是否<b>过拟合</b>（阶段 9.6）？决定：推进，还是推翻重来。",
      vEn: "🔴 <b>The non-skippable gate.</b> Three gates: ① any <b>look-ahead/leakage</b> (11.4)? ② <b>costs/slippage</b> included (Stage 10.6)? ③ robust out-of-sample or <b>overfit</b> (Stage 9.6)? Decide: proceed, or kill it.",
    },
    {
      icon: "📝", zh: "纸上交易", en: "Paper trade", who: "both", gate: true,
      toolsZh: "券商纸上交易/沙盒（阶段 11.1）", toolsEn: "Broker paper account/sandbox (Stage 11.1)",
      vZh: "🔴 <b>碰真钱前最后一道验证</b>。回测好看、纸上常露馅：宽价差、成交难、滑点吃掉 alpha。真实行为与回测<b>一致</b>才放行。",
      vEn: "🔴 <b>Last check before real money.</b> Good in backtest often cracks on paper: wide spreads, hard fills, slippage eating alpha. Release only if live behavior <b>matches</b> the backtest.",
    },
    {
      icon: "🚀", zh: "小额实盘", en: "Small live", who: "human", gate: true,
      toolsZh: "券商 API + 实时风控/止损", toolsEn: "Broker API + live risk controls/stops",
      vZh: "🔴 <b>动真钱闸门：触发真实资金的动作由你显式授权，永不外包</b>。副驾(AI)做大部分操作，机长(你)亲手确认。从最小、可回滚仓位起步（阶段 8.1）。",
      vEn: "🔴 <b>Real-money gate: actions that move real money are authorized by you, never outsourced.</b> Co-pilot (AI) does most; captain (you) confirms. Start smallest, reversible (Stage 8.1).",
    },
    {
      icon: "📒", zh: "监控 / 交易日志", en: "Monitor / journal", who: "both", gate: false,
      toolsZh: "AI 盯盘报警 + 交易日志（阶段 8.6）", toolsEn: "AI monitoring/alerts + journal (Stage 8.6)",
      vZh: "实盘与回测/纸上的<b>偏离</b>有多大、为什么。日志是你识别自身错误模式、持续改进的唯一可靠依据。",
      vEn: "How far live <b>diverges</b> from backtest/paper, and why. The journal is your only reliable basis for spotting your own error patterns and improving.",
    },
  ];

  const gates = stages.map((s, i) => ({ i, gate: s.gate })).filter((g) => g.gate);

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🤖 ${T("AI 辅助交易工作流：AI 提速，你把关", "AI-assisted trading workflow: AI accelerates, you adjudicate")}</div>
      <div class="demo-meta" style="margin-bottom:8px">${T("点击每段 → 谁主导 / 工具 / 你验证什么。🔴 = 动真钱或下结论的关键闸门。",
        "Click a stage → who leads / tools / what you verify. 🔴 = a critical gate that moves money or draws a conclusion.")}</div>

      <div id="as-steps" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center"></div>

      <div class="scn" id="as-detail" style="margin-top:14px"></div>

      <div class="demo-block" style="margin-top:16px;padding-top:12px;border-top:1px solid var(--line-soft)">
        <div class="demo-label">${T("放行清单：勾掉每一道🔴闸门，才允许上小额实盘", "Release checklist: clear every 🔴 gate before going to small live")}</div>
        <div id="as-checks" style="display:flex;flex-direction:column;gap:7px;margin-top:6px"></div>
        <div class="demo-bar" style="margin-top:10px"><span id="as-bar"></span></div>
        <div id="as-verdict" style="margin-top:10px"></div>
      </div>

      <p class="demo-tip">${T(
        "一句话：<b>AI 起草的环节</b>（研究/写码/回测/盯盘）享受九成提速；<b>你把守的🔴闸门</b>（核实事实、对数验收、复核结论、放行实盘、授权真钱）一个都不能让 AI 替你按。这就是 AI 时代散户量化的正确姿势（阶段 11.5）。",
        "In one line: <b>AI-drafted stages</b> (research/code/backtest/monitor) get ~90% speedup; the <b>🔴 gates you guard</b> (verify facts, test code, review conclusions, release to live, authorize real money) are never pressed by the AI. That's the right posture for retail quant in the AI era (Stage 11.5)."
      )}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  let active = 0;
  const cleared = {};                 // gate index -> bool

  function whoBadge(who) {
    if (who === "human") return `<span class="pill acc">${T("你主导", "you lead")}</span>`;
    if (who === "agent") return `<span class="pill gold">${T("智能体起草", "agent drafts")}</span>`;
    return `<span class="pill ok">${T("协作", "collaborate")}</span>`;
  }

  function renderSteps() {
    $("#as-steps").innerHTML = stages.map((s, i) => {
      const on = i === active;
      const dot = s.gate ? "🔴" : "";
      const arrow = i < stages.length - 1 ? `<span style="color:var(--muted)">→</span>` : "";
      return `<button class="demo-btn ${on ? "primary" : ""}" data-i="${i}" style="padding:7px 10px;font-size:12.5px">${s.icon} ${i + 1}.${en ? s.en : s.zh}${dot}</button>${arrow}`;
    }).join("");
  }

  function renderDetail() {
    const s = stages[active];
    const gateTag = s.gate ? `<span class="pill bad" style="margin-left:8px">🔴 ${T("关键闸门", "critical gate")}</span>` : "";
    $("#as-detail").innerHTML = `
      <div class="scn-q">${s.icon} ${T("第", "Stage")} ${active + 1} · ${en ? s.en : s.zh} ${whoBadge(s.who)}${gateTag}</div>
      <div style="font-size:13px;color:var(--muted);margin-bottom:8px"><b>${T("工具", "Tools")}:</b> ${en ? s.toolsEn : s.toolsZh}</div>
      <div style="font-size:14px;line-height:1.75;padding:11px;border-radius:8px;background:${s.gate ? "var(--red-soft)" : "var(--accent-soft)"}">
        <div style="color:var(--muted);font-weight:600;font-size:12px;letter-spacing:.03em;margin-bottom:3px">${s.gate ? T("🔴 你把守的闸门 · 验证什么", "🔴 THE GATE YOU GUARD · WHAT TO VERIFY") : T("你要验证什么", "WHAT YOU VERIFY")}</div>
        ${en ? s.vEn : s.vZh}
      </div>`;
    $("#as-steps").querySelectorAll("button").forEach((b) => b.classList.toggle("primary", +b.dataset.i === active));
  }

  function renderChecks() {
    $("#as-checks").innerHTML = gates.map((g) => {
      const s = stages[g.i];
      return `<label class="demo-check"><input type="checkbox" data-g="${g.i}" ${cleared[g.i] ? "checked" : ""}/> 🔴 ${s.icon} ${en ? s.en : s.zh}</label>`;
    }).join("");
    $("#as-checks").querySelectorAll("input").forEach((inp) => {
      inp.addEventListener("change", () => { cleared[inp.dataset.g] = inp.checked; updateVerdict(); });
    });
  }

  function updateVerdict() {
    const done = gates.filter((g) => cleared[g.i]).length;
    $("#as-bar").style.width = (done / gates.length * 100) + "%";
    $("#as-bar").style.background = done === gates.length ? "var(--green)" : "var(--accent)";
    if (done === gates.length) {
      $("#as-verdict").innerHTML = `<div class="pill ok" style="font-size:13px">✓ ${T("全部 " + gates.length + " 道闸门已把守 → 可上最小额、可回滚实盘", "All " + gates.length + " gates cleared → OK for smallest, reversible live")}</div>`;
    } else {
      $("#as-verdict").innerHTML = `<div class="pill bad" style="font-size:13px">${T("还剩 " + (gates.length - done) + " 道🔴闸门未把守——不得碰真钱", (gates.length - done) + " 🔴 gate(s) unguarded — do not touch real money")}</div>`;
    }
  }

  $("#as-steps").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    active = +b.dataset.i; renderSteps(); renderDetail();
  });

  renderSteps();
  renderDetail();
  renderChecks();
  updateVerdict();
}
