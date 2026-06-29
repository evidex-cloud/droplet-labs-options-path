// 交互演示：AI 辅助交易工作流的 7 步流水线。点击任一步，展开“智能体做什么”+“人工检查点”。
// 强调 human-in-the-loop：每个动真钱/下结论的节点都立着由人把守的闸门。
// 非数值演示，重在流程与验证意识。用一个可点的步骤条 + 展开卡片（.scn 风格 + .term 代码块）。
// 串起阶段 11.3/11.4/11.5、10.1/10.6/9.6。

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // 七步。each: 标题、智能体动作、人工检查点(关键节点标红)、是否“动真钱闸门”
  const steps = [
    {
      icon: "💡",
      zh: "提出想法", en: "Pose the idea",
      who: "human",
      agentZh: "由<b>你</b>定义问题与假设：例如“财报前买入跨式是否有正期望？”明确标的范围、持有期、入场/出场规则。",
      agentEn: "<b>You</b> define the question & hypothesis: e.g. “Does buying a straddle before earnings have positive expectancy?” Fix the universe, holding window, entry/exit rules.",
      checkZh: "想法与假设来自你的判断——AI 还没上场。把问题问清楚，是好研究的一半。",
      checkEn: "The idea and hypothesis come from your judgment — the AI isn't involved yet. A well-posed question is half the work.",
      gate: false,
    },
    {
      icon: "🔎",
      zh: "LLM 研究", en: "LLM research",
      who: "agent",
      agentZh: "智能体调研：这个策略的<b>已知证据</b>、常见<b>坑</b>（财报后 IV 崩塌 / vol crush）、相关指标（IV 百分位、预期波动）。给你一份要点摘要与参考。",
      agentEn: "The agent surveys: <b>known evidence</b>, common <b>pitfalls</b> (post-earnings IV crush), relevant metrics (IV rank, expected move). Returns a digest with references.",
      checkZh: "<b>人工检查点：交叉验证它给的事实与来源。</b> LLM 会<b>幻觉</b>——编造论文、记错数字。一手来源核对，别把它的“记忆”当证据（阶段 10.4）。",
      checkEn: "<b>Checkpoint: cross-verify its facts and sources.</b> LLMs <b>hallucinate</b> — fake papers, wrong numbers. Confirm against primary sources; don't treat its “memory” as evidence (Stage 10.4).",
      gate: false,
    },
    {
      icon: "⌨️",
      zh: "生成代码", en: "Generate code",
      who: "agent",
      agentZh: "智能体写出<b>数据拉取 + 回测</b>代码（定价与希腊字母见阶段 11.3，回测框架见 11.4）。几分钟产出过去要写几天的样板。",
      agentEn: "The agent writes <b>data-pull + backtest</b> code (pricing & Greeks per Stage 11.3, backtest engine per 11.4). Minutes of work that used to take days.",
      checkZh: "<b>人工检查点：逐行读懂 + 用已知答案对数。</b> ‘能跑’≠‘正确’。让它的 BS 函数算经典 S=K=100,T=1,r=5%,σ=20% → 必须得 <b>10.45</b>（阶段 9.1），否则有 bug。",
      checkEn: "<b>Checkpoint: read every line + test against a known answer.</b> ‘Runs’ ≠ ‘correct’. Make its BS function price the classic S=K=100,T=1,r=5%,σ=20% → must give <b>10.45</b> (Stage 9.1), else it's buggy.",
      gate: false,
      code: true,
    },
    {
      icon: "📊",
      zh: "回测", en: "Backtest",
      who: "agent",
      agentZh: "智能体在历史数据上跑回测，汇报<b>收益 / 夏普 / 最大回撤</b>。比如：年化 18%、夏普 1.4、回撤 12%。",
      agentEn: "The agent runs the backtest on history and reports <b>return / Sharpe / max drawdown</b>. E.g. 18% annualized, Sharpe 1.4, 12% drawdown.",
      checkZh: "<b>人工检查点：审三关 checklist。</b> ① 有没有<b>前视偏差/泄漏</b>（财报后数据漏进财报前？阶段 10.1）？② 算<b>交易成本/滑点</b>了吗（阶段 10.6）？③ 样本外稳吗、是不是<b>过拟合</b>（阶段 9.6）？",
      checkEn: "<b>Checkpoint: run the three-gate checklist.</b> ① Any <b>look-ahead/leakage</b> (post-earnings data bleeding in? Stage 10.1)? ② Are <b>costs/slippage</b> included (Stage 10.6)? ③ Robust out-of-sample or <b>overfit</b> (Stage 9.6)?",
      gate: false,
    },
    {
      icon: "🧑‍⚖️",
      zh: "人工复核", en: "Human review",
      who: "human",
      agentZh: "这是<b>不可跳过</b>的闸门：你坐下来判断——这个结论<b>可信吗</b>？风险藏在哪？假设站得住吗？",
      agentEn: "The <b>non-skippable</b> gate: you sit down and judge — is this conclusion <b>trustworthy</b>? Where's the hidden risk? Do the assumptions hold?",
      checkZh: "<b>判断权在你。</b> AI 把每步从几小时压到几分钟，但‘信不信’这个动作必须由你做。决定：继续推进，还是<b>推翻重来</b>。",
      checkEn: "<b>The judgment is yours.</b> AI cut each step from hours to minutes, but the act of ‘believing it’ must be yours. Decide: proceed, or <b>kill it</b>.",
      gate: true,
    },
    {
      icon: "📝",
      zh: "纸上交易", en: "Paper trade",
      who: "both",
      agentZh: "在<b>模拟盘</b>上实时跑一段：验证执行、<b>滑点</b>、信号时机，看真实行为是否与回测吻合（AI 可辅助监控）。",
      agentEn: "Run it live on a <b>paper account</b> for a while: validate execution, <b>slippage</b>, signal timing — does live behavior match the backtest? (AI can help monitor.)",
      checkZh: "<b>人工检查点：实盘前的最后一道验证。</b> 回测看着好、纸上常露馅——宽价差、成交难、滑点吃掉 alpha。确认一致，才允许碰真钱。",
      checkEn: "<b>Checkpoint: the last validation before real money.</b> What looks good in backtest often cracks on paper — wide spreads, hard fills, slippage eating alpha. Confirm consistency before any real capital.",
      gate: true,
    },
    {
      icon: "🚀",
      zh: "执行（真钱）", en: "Execute (real $)",
      who: "human",
      agentZh: "<b>小额</b>实盘起步。AI 可辅助下单与监控，但<b>触发真实资金的动作由你显式授权</b>，并配实时风控与止损。",
      agentEn: "Start with <b>small size</b>. AI can assist order placement & monitoring, but <b>actions that move real money are explicitly authorized by you</b>, with live risk controls and stops.",
      checkZh: "<b>动真钱闸门：授权权永不外包。</b> 副驾(AI)能做绝大部分操作，机长(你)必须亲自确认起落架。从最小额开始、可回滚、带风控（阶段 8.1、10.6）。",
      checkEn: "<b>Real-money gate: authorization is never outsourced.</b> The co-pilot (AI) does most of the work; the captain (you) confirms the landing gear. Smallest size, reversible, risk-managed (Stages 8.1, 10.6).",
      gate: true,
    },
  ];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🤖 ${T("AI 辅助交易工作流：点开每一步，看‘智能体做什么’+‘你把哪道关’", "AI-assisted trading workflow: click each step for ‘what the agent does’ + ‘the gate you guard’")}</div>

      <div class="demo-meta" style="margin-bottom:8px">${T("点击步骤 →（🔴 = 必须由你把守的关键闸门）", "Click a step → (🔴 = a critical gate you must guard)")}</div>
      <div id="aw-steps" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center"></div>

      <div class="scn" id="aw-detail" style="margin-top:14px"></div>

      <p class="demo-tip">${T(
        "全程一句话：<b>AI 提速，你把关。</b> 智能体把研究→编码→回测→监控的工程耗时砍掉九成，让你一个人覆盖全链路；但每个<b>动真钱或下结论</b>的节点（🔴）都立着一道由你亲自把守的闸门。这正是阶段 11.5 要落地的工作流，也是 AI 时代散户量化的正确姿势。",
        "In one line: <b>AI accelerates, you adjudicate.</b> The agent cuts research→code→backtest→monitor engineering by ~90%, letting one person cover the whole chain; but every node that <b>moves real money or draws a conclusion</b> (🔴) has a gate you guard yourself. This is the workflow Stage 11.5 builds — and the right posture for retail quant in the AI era."
      )}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  let active = 0;

  function renderSteps() {
    $("#aw-steps").innerHTML = steps.map((s, i) => {
      const on = i === active;
      const dot = s.gate ? "🔴" : "";
      const arrow = i < steps.length - 1 ? `<span style="color:var(--muted)">→</span>` : "";
      return `<button class="demo-btn ${on ? "primary" : ""}" data-i="${i}" style="padding:7px 11px;font-size:13px">${s.icon} ${i + 1}.${en ? s.en : s.zh}${dot}</button>${arrow}`;
    }).join("");
  }

  function whoBadge(who) {
    if (who === "human") return `<span class="pill acc">${T("你主导", "you lead")}</span>`;
    if (who === "agent") return `<span class="pill gold">${T("智能体起草", "agent drafts")}</span>`;
    return `<span class="pill ok">${T("协作", "collaborate")}</span>`;
  }

  // 第 3 步“生成代码”示意一段 Python（用 .term 代码块外观）
  function codeSnippet() {
    const c1 = '<span class="com"># AI 起草、你来复核：先用已知答案对数！</span>';
    const c2 = '<span class="kw">from</span> scipy.stats <span class="kw">import</span> norm';
    const c3 = '<span class="kw">import</span> numpy <span class="kw">as</span> np';
    const c4 = '<span class="kw">def</span> <span class="cmd">bs_call</span>(S, K, T, r, sigma):';
    const c5 = '    d1 = (np.log(S/K) + (r + sigma**<span class="num">2</span>/<span class="num">2</span>)*T) / (sigma*np.sqrt(T))';
    const c6 = '    d2 = d1 - sigma*np.sqrt(T)';
    const c7 = '    <span class="kw">return</span> S*norm.cdf(d1) - K*np.exp(-r*T)*norm.cdf(d2)';
    const c8 = '';
    const c9 = '<span class="com"># 验收对数：经典基准应得 10.45（阶段 9.1）</span>';
    const c10 = '<span class="kw">assert</span> <span class="cmd">abs</span>(bs_call(<span class="num">100</span>,<span class="num">100</span>,<span class="num">1</span>,<span class="num">0.05</span>,<span class="num">0.2</span>) - <span class="num">10.45</span>) &lt; <span class="num">0.01</span>';
    const c11 = '<span class="out">#  ✓ 通过 → 这个函数可信；✗ 不过 → 代码有 bug，别上线</span>';
    return `<div class="term">${[c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11].join("\n")}</div>`;
  }

  function renderDetail() {
    const s = steps[active];
    const gateTag = s.gate
      ? `<span class="pill bad" style="margin-left:8px">🔴 ${T("关键闸门", "critical gate")}</span>`
      : "";
    $("#aw-detail").innerHTML = `
      <div class="scn-q">${s.icon} ${T("第", "Step")} ${active + 1} ${en ? "" : "步"} · ${en ? s.en : s.zh} ${whoBadge(s.who)}${gateTag}</div>
      <div style="font-size:14px;line-height:1.75;margin-bottom:10px">
        <div style="color:var(--muted);font-weight:600;font-size:12px;letter-spacing:.03em;margin-bottom:3px">${T("智能体/流程做什么", "WHAT THE AGENT / STEP DOES")}</div>
        ${en ? s.agentEn : s.agentZh}
      </div>
      ${s.code ? codeSnippet() : ""}
      <div style="font-size:14px;line-height:1.75;margin-top:10px;padding:11px;border-radius:8px;background:${s.gate ? "var(--red-soft)" : "var(--accent-soft)"}">
        <div style="color:var(--muted);font-weight:600;font-size:12px;letter-spacing:.03em;margin-bottom:3px">${s.gate ? T("🔴 你把守的闸门", "🔴 THE GATE YOU GUARD") : T("人工检查点", "HUMAN CHECKPOINT")}</div>
        ${en ? s.checkEn : s.checkZh}
      </div>`;
  }

  $("#aw-steps").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    active = +b.dataset.i;
    renderSteps();
    renderDetail();
  });

  renderSteps();
  renderDetail();
}
