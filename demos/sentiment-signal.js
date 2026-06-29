// 交互演示（说明性 / illustrative，模拟 LLM 输出）：6 条样本头条，每条带一个“LLM 情绪分”(−1…+1)、
// 来源权重(可信度/相关性)、以及一个“不确定性/波动语气”分。聚合成：加权情绪、观点分歧(std)、波动语气分。
// 阈值滑块把“加权情绪”变成方向信号(看多/中性/看空)；分歧或波动语气高 → 叠加“做多波动”视图。
// 教学点：① 情绪要加权聚合、阈值要选；② 对期权人，文本预告“波动”常比“方向”更值钱——
//   这里聚合情绪接近中性、但分歧很大 → 不是方向押注，而是买跨式(做多波动)的信号。
// 情绪分是 mock 的 LLM 输出，绝非真理；真实里要严格防泄漏、防过拟合、且信号会衰减/拥挤（阶段 9.6、10.1）。

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // 6 条样本头条（情绪/权重/波动语气均为示意）
  const items = [
    { zh: "卖方研报上调目标价，重申“买入”", en: "Analyst raises target price, reiterates “Buy”", s: +0.62, w: 1.0, vol: 0.2, src: zhSrc("研报", "Analyst") },
    { zh: "高管申报增持公司股票", en: "Executive files to buy more company stock", s: +0.45, w: 0.8, vol: 0.1, src: zhSrc("披露", "Filing") },
    { zh: "供应链报道：关键零件交期延长", en: "Report: supply-chain lead times lengthen", s: -0.55, w: 0.85, vol: 0.5, src: zhSrc("新闻", "News") },
    { zh: "新产品发布在社媒引发讨论", en: "New product launch sparks social buzz", s: +0.35, w: 0.7, vol: 0.2, src: zhSrc("社媒", "Social") },
    { zh: "财报电话会语气“罕见谨慎”，多次提及风险", en: "Earnings call tone “unusually cautious”, risk cited often", s: -0.15, w: 0.75, vol: 0.85, src: zhSrc("纪要", "Transcript") },
    { zh: "论坛恐慌情绪蔓延（来源可信度低）", en: "Forum panic spreads (low-credibility source)", s: -0.60, w: 0.45, vol: 0.6, src: zhSrc("论坛", "Forum") },
  ];
  function zhSrc(z, e) { return en ? e : z; }

  // 聚合
  const W = items.reduce((a, b) => a + b.w, 0);
  const agg = items.reduce((a, b) => a + b.s * b.w, 0) / W;                       // 加权情绪
  const varS = items.reduce((a, b) => a + b.w * (b.s - agg) * (b.s - agg), 0) / W;
  const disagree = Math.sqrt(varS);                                              // 观点分歧
  const volScore = items.reduce((a, b) => a + b.vol * b.w, 0) / W;               // 波动语气

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">📰 ${T("从文本到信号：6 条头条 → 聚合情绪 → 可交易倾向", "From text to signal: 6 headlines → aggregate sentiment → a tradable view")}
        <span class="pill gold" style="margin-left:8px">${T("模拟 LLM 输出 / 示意", "mock LLM / illustrative")}</span>
      </div>

      <div id="ss-cards"></div>

      <div class="demo-block" style="margin-top:16px">
        <label class="demo-label">${T("方向信号阈值（|加权情绪| 要多强才算有方向）", "Direction threshold (how strong |sentiment| must be to call a direction)")} = <b id="ss-thr-v">0.20</b></label>
        <input class="demo-slider" id="ss-thr" type="range" min="0.05" max="0.50" step="0.01" value="0.20"/>
      </div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("加权情绪", "Wtd sentiment")}</div><div class="v" id="ss-agg">–</div></div>
        <div class="stat"><div class="k">${T("观点分歧", "Disagreement")}</div><div class="v" id="ss-dis">–</div></div>
        <div class="stat"><div class="k">${T("波动语气分", "Vol-tone score")}</div><div class="v" id="ss-vol">–</div></div>
      </div>

      <div class="scn" id="ss-verdict" style="margin-top:14px"></div>

      <p class="demo-tip" id="ss-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);

  // 头条卡片：情绪用颜色条表达
  function cards() {
    return items.map((it) => {
      const s = it.s;
      const col = s > 0.1 ? "var(--green)" : s < -0.1 ? "var(--red)" : "var(--muted)";
      const sign = s >= 0 ? "+" : "";
      const barW = Math.round(Math.abs(s) * 50); // 0..50px 每侧
      const left = s < 0 ? `<div style="width:${barW}px;height:8px;border-radius:4px;background:${col}"></div>` : "";
      const right = s >= 0 ? `<div style="width:${barW}px;height:8px;border-radius:4px;background:${col}"></div>` : "";
      const volTag = it.vol >= 0.5 ? `<span class="pill gold" style="margin-left:6px">${T("高波动语气", "high vol-tone")}</span>` : "";
      return `<div class="bar2" style="align-items:flex-start;margin:8px 0">
        <div style="flex:1">
          <div style="font-size:13.5px;color:var(--ink)">${en ? it.en : it.zh}
            <span class="demo-meta" style="display:inline">· ${it.src} · ${T("权重", "w")} ${it.w.toFixed(2)}</span>${volTag}</div>
          <div style="display:flex;align-items:center;gap:6px;margin-top:5px">
            <div style="width:50px;display:flex;justify-content:flex-end">${left}</div>
            <div style="width:1px;height:12px;background:var(--line)"></div>
            <div style="width:50px">${right}</div>
            <div style="font-size:12.5px;color:${col};font-weight:700;font-variant-numeric:tabular-nums">${sign}${s.toFixed(2)}</div>
          </div>
        </div>
      </div>`;
    }).join("");
  }

  function paint() {
    const thr = +$("#ss-thr").value;
    $("#ss-thr-v").textContent = thr.toFixed(2);

    $("#ss-agg").textContent = (agg >= 0 ? "+" : "") + agg.toFixed(2);
    $("#ss-agg").className = "v " + (agg > 0.1 ? "pos" : agg < -0.1 ? "neg" : "");
    $("#ss-dis").textContent = disagree.toFixed(2);
    $("#ss-vol").textContent = volScore.toFixed(2);
    $("#ss-vol").className = "v " + (volScore > 0.4 ? "acc" : "");

    let dir, dirCol;
    if (agg > thr) { dir = T("方向：温和看多", "Direction: mildly bullish"); dirCol = "var(--green)"; }
    else if (agg < -thr) { dir = T("方向：温和看空", "Direction: mildly bearish"); dirCol = "var(--red)"; }
    else { dir = T("方向：中性（情绪未过阈值，无方向把握）", "Direction: neutral (sentiment below threshold, no conviction)"); dirCol = "var(--muted)"; }

    const highVol = volScore > 0.4 || disagree > 0.45;
    const volLine = highVol
      ? T("<b>波动视图：偏高</b> —— 观点分歧大 / 风险语气重，文本在喊“要大动”。", "<b>Volatility view: elevated</b> — high disagreement / heavy risk-tone: the text screams “big move coming”.")
      : T("波动视图：平静 —— 文本一致且语气平和。", "Volatility view: calm — text is consistent and the tone is mild.");

    // 映射到期权结构
    let structure;
    if (highVol && Math.abs(agg) <= thr) {
      structure = T(
        "→ <b>核心信号：做多波动</b>。方向不明但‘要出事’——比起追多空，<b>买跨式/宽跨式或日历</b>（押 IV 被低估）更贴合（阶段 7.1、8.2）。",
        "→ <b>Core signal: long volatility</b>. Direction unclear but something's brewing — rather than chasing a side, <b>buy a straddle/strangle or calendar</b> (betting IV is underpriced) fits better (Stages 7.1, 8.2)."
      );
    } else if (highVol) {
      structure = T(
        "→ 方向有微弱倾向且波动偏高：可考虑<b>带方向的波动结构</b>（如偏斜的跨式 / 价差+保护），别裸押单边（阶段 7.1）。",
        "→ Faint directional lean plus elevated vol: consider a <b>directional-vol structure</b> (skewed straddle / spread + protection) rather than a naked one-way bet (Stage 7.1)."
      );
    } else {
      structure = T(
        "→ 方向温和、波动平静：若要表达方向，<b>垂直价差</b>比裸买期权更省 Theta（阶段 6.5）。",
        "→ Mild direction, calm vol: to express direction, a <b>vertical spread</b> bleeds less Theta than a naked option (Stage 6.5)."
      );
    }

    $("#ss-verdict").innerHTML =
      `<div class="scn-q" style="color:${dirCol}">${dir}</div>` +
      `<div style="font-size:13.5px;line-height:1.7">${volLine}<br>${structure}</div>`;

    $("#ss-tip").innerHTML = T(
      `注意这组文本：加权情绪只有 <b>${(agg >= 0 ? "+" : "") + agg.toFixed(2)}</b>（接近中性），但<b>分歧高达 ${disagree.toFixed(2)}</b>、波动语气 ${volScore.toFixed(2)}。<b>关键洞察</b>：方向几乎是噪声，真正的信号是“<b>分歧大 = 要大动 = 做多波动</b>”——这正是文本对期权人比对股票人更值钱的地方。拖动阈值：调太低，微弱情绪就被误读成方向（噪声）；调太高，只剩波动视图。真实里这条阈值必须靠<b>样本外</b>定，且整条信号会随时间<b>衰减、拥挤</b>（阶段 10.1）。`,
      `Notice this set: weighted sentiment is only <b>${(agg >= 0 ? "+" : "") + agg.toFixed(2)}</b> (near neutral), yet <b>disagreement is ${disagree.toFixed(2)}</b> and vol-tone ${volScore.toFixed(2)}. <b>Key insight</b>: direction is almost noise here; the real signal is “<b>high disagreement = big move = go long vol</b>” — exactly why text is worth more to an options trader than a stock trader. Drag the threshold: too low and faint sentiment gets misread as direction (noise); too high and only the vol view remains. In reality this threshold must be set <b>out-of-sample</b>, and the whole signal <b>decays and crowds</b> over time (Stage 10.1).`
    );
  }

  $("#ss-cards").innerHTML = cards();
  $("#ss-thr").addEventListener("input", paint);
  paint();
}
