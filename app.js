// Droplet Labs · 期权之路 · Options Path —— 渲染器（双语 + 难度 + persona）
// 内容在 content/ 下；中文正文 stageX-id.js，英文正文 content/lessons/en/ 同名文件（缺失则回退中文）。
// UI 文案用 t(中,英)。难度 1/2/3 与 persona 标签在 manifest 里。与 Satoshi Path 同一套渲染内核。

import { COURSE } from "./content/manifest.js?v=7"; // 改了 manifest 要随 app.js?v 一起 bump，破缓存
import { GLOSSARY } from "./content/glossary.js?v=1"; // 术语小卡片词库；改了它就 +1（并 bump app.js?v）

// 品牌 Logo —— Droplet Labs 水滴 + 内部"看涨期权损益曲线"（钩形 hockey-stick），内联 SVG
const LOGO = `<svg class="hd-logo-svg" viewBox="0 0 100 118" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Droplet Labs"><defs><linearGradient id="dropGrad" x1="22" y1="12" x2="80" y2="104" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0a6e63"/><stop offset=".55" stop-color="#0d9488"/><stop offset="1" stop-color="#4fc3b3"/></linearGradient></defs><path d="M50 10C31 39 18 55 18 74c0 19 15 31 32 31s32-12 32-31C82 55 69 39 50 10Z" stroke="url(#dropGrad)" stroke-width="3.4" stroke-linejoin="round"/><path d="M35 86 H71 M41 92 V52" stroke="url(#dropGrad)" stroke-width="1.4" opacity=".5" stroke-linecap="round"/><path d="M37 80 H53 L70 50" stroke="url(#dropGrad)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="53" cy="80" r="2.7" fill="url(#dropGrad)"/></svg>`;

const app = document.getElementById("app");
const PKEY = "options-path-v1";
const V = "13"; // 内容版本：改了 lessons/ 或 demos/ 后 +1，破除浏览器对动态 import 的缓存

/* ---------------- 状态 ---------------- */
function loadState() {
  try {
    return Object.assign({ done: {}, goal: null, lang: "zh" }, JSON.parse(localStorage.getItem(PKEY)) || {});
  } catch {
    return { done: {}, goal: null, lang: "zh" };
  }
}
function saveState(s) { localStorage.setItem(PKEY, JSON.stringify(s)); }
let state = loadState();

/* ---------------- i18n 助手 ---------------- */
const lang = () => state.lang === "en" ? "en" : "zh";
const t = (zh, en) => (lang() === "en" ? en : zh);
const L = (o, k) => (lang() === "en" && o[k + "En"] != null ? o[k + "En"] : o[k]);
const enModulePath = (m) => m.replace("./content/lessons/", "./content/lessons/en/");

const DIFF = { 1: ["基础", "Basic"], 2: ["进阶", "Intermediate"], 3: ["高级", "Advanced"] };
const diffLabel = (d) => t(DIFF[d][0], DIFF[d][1]);
const stars = (d) => `<span class="stars" title="${diffLabel(d)}">${"★".repeat(d)}<span class="off">${"★".repeat(3 - d)}</span></span>`;

/* ---------------- 工具 ---------------- */
const tierOf = (id) => COURSE.tiers.find((t) => t.id === id);
const isReady = (l) => l.status === "ready";
const readyLessons = () => COURSE.stages.flatMap((s) => s.lessons).filter(isReady);
const findLesson = (id) => {
  for (const s of COURSE.stages) {
    const l = s.lessons.find((x) => x.id === id);
    if (l) return { lesson: l, stage: s };
  }
  return null;
};
const relevant = (lesson) => !state.goal || (lesson.personas || []).includes(state.goal);

/* ---------------- 极简 Markdown ---------------- */
function esc(s) { return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }
function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}
function md(text) {
  if (!text) return "";
  return text.trim().split(/\n\s*\n/).map((block) => {
    const b = block.trim();
    if (b.startsWith("### ")) return `<h4 class="subhead">${inline(b.slice(4))}</h4>`;
    if (b.startsWith("$$")) {
      // 公式块：逐行用 <br> 连接，仅转义、不做行内 markdown（避免公式里的 * 被当成加粗）
      const body = b.replace(/^\$\$\s?/, "").split("\n").map((l) => esc(l.replace(/^\$\$\s?/, ""))).join("<br>");
      return `<div class="formula">${body}</div>`;
    }
    if (b.startsWith("- ")) {
      const items = b.split("\n").map((l) => `<li>${inline(l.replace(/^-\s+/, ""))}</li>`).join("");
      return `<ul>${items}</ul>`;
    }
    if (b.startsWith("> ")) return `<blockquote>${inline(b.replace(/^>\s?/gm, ""))}</blockquote>`;
    return `<p>${inline(b)}</p>`;
  }).join("");
}

/* ---------------- 术语小卡片 + 课程间交叉引用（渲染后自动处理正文） ---------------- */
// 阶段.序号 → 课程 id 的映射（用于把「阶段 X.Y」「Stage X.Y」变成可点链接）
const XREF = (() => {
  const m = new Map();
  for (const s of COURSE.stages) {
    s.lessons.forEach((l, i) => m.set(`${s.n}.${i + 1}`, l.id));
    if (s.lessons[0]) m.set(`${s.n}`, s.lessons[0].id);
  }
  return m;
})();

const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// 收集正文里可处理的文本节点（跳过代码/链接/标题/演示/测验/已处理过的）
function lessonTextNodes(root) {
  const SKIP_TAG = new Set(["CODE", "A", "H1", "H2", "H3", "H4", "H5", "BUTTON", "INPUT", "LABEL", "SELECT", "TEXTAREA", "SCRIPT", "STYLE", "SVG"]);
  const SKIP_SEL = ".section-h,.breadcrumb,.diff-badge,.lsn-tag,.fallback-note,.depth-toggle,.lsn-nav,#demo-mount,#quiz,.gloss,.xref,.further,.formula";
  const out = [];
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      let p = n.parentElement;
      while (p && p !== root) { if (SKIP_TAG.has(p.tagName)) return NodeFilter.FILTER_REJECT; p = p.parentElement; }
      if (n.parentElement && n.parentElement.closest(SKIP_SEL)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  while (w.nextNode()) out.push(w.currentNode);
  return out;
}

// 把一个文本节点里所有正则匹配替换成元素；makeEl 返回 null 则保留原文不处理该匹配
function wrapInNode(node, regex, makeEl) {
  const text = node.nodeValue;
  regex.lastIndex = 0;
  let m, last = 0, any = false;
  const frag = document.createDocumentFragment();
  while ((m = regex.exec(text))) {
    const el = makeEl(m);
    if (!el) continue;
    if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
    frag.appendChild(el);
    last = m.index + m[0].length;
    any = true;
  }
  if (any) {
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(frag, node);
  }
}

function decorateLesson(root) {
  if (!root) return;
  const l = lang();

  // 1) 交叉引用：阶段 X.Y / 回扣 X.Y / Stage X.Y / callback X.Y → 跳转链接
  const xrefRe = l === "en"
    ? /\b(?:Stage|callback)\s+(\d+)(?:\.(\d+))?/gi
    : /(?:阶段|回扣)\s*(\d+)(?:\.(\d+))?/g;
  for (const node of lessonTextNodes(root)) {
    wrapInNode(node, xrefRe, (m) => {
      const id = XREF.get(m[2] ? `${m[1]}.${m[2]}` : `${m[1]}`);
      if (!id) return null;
      const a = document.createElement("a");
      a.className = "xref"; a.href = `#lesson/${id}`; a.textContent = m[0];
      return a;
    });
  }

  // 2) 术语小卡片：词库里每个词在本节首次出现时加虚线下划线 + hover 定义
  if (Array.isArray(GLOSSARY) && GLOSSARY.length) {
    const defByKey = new Map(); const allTerms = [];
    for (const e of GLOSSARY) {
      const o = e[l]; if (!o || !o.terms) continue;
      for (const term of o.terms) {
        const key = l === "en" ? term.toLowerCase() : term;
        if (!defByKey.has(key)) defByKey.set(key, o.def); // 靠前的条目优先
        allTerms.push(term);
      }
    }
    const uniq = [...new Set(allTerms)].sort((a, b) => b.length - a.length);
    const alt = uniq.map(escRe).join("|");
    if (alt) {
      const glossRe = l === "en"
        ? new RegExp(`(?<![A-Za-z0-9])(?:${alt})(?![A-Za-z0-9])`, "gi")
        : new RegExp(`(?:${alt})`, "g");
      const used = new Set();
      for (const node of lessonTextNodes(root)) {
        wrapInNode(node, glossRe, (m) => {
          const key = l === "en" ? m[0].toLowerCase() : m[0];
          if (used.has(key) || !defByKey.has(key)) return null;
          used.add(key);
          const span = document.createElement("span");
          span.className = "gloss"; span.tabIndex = 0; span.textContent = m[0];
          const pop = document.createElement("span");
          pop.className = "gloss-pop"; pop.textContent = defByKey.get(key);
          span.appendChild(pop);
          return span;
        });
      }
    }
  }
}

/* ---------------- 语言切换按钮（常驻右上角） ---------------- */
function renderLangToggle() {
  let el = document.getElementById("lang-toggle");
  if (!el) {
    el = document.createElement("button");
    el.id = "lang-toggle";
    document.body.appendChild(el);
    el.addEventListener("click", () => {
      state.lang = lang() === "en" ? "zh" : "en";
      saveState(state);
      renderLangToggle();
      render();
    });
  }
  el.textContent = lang() === "en" ? "中文" : "EN";
  el.setAttribute("aria-label", lang() === "en" ? "Switch to Chinese" : "切换到 English");
}

/* ---------------- 路由 ---------------- */
async function render() {
  const hash = location.hash.replace(/^#/, "");
  if (hash.startsWith("lesson/")) await renderLesson(hash.slice("lesson/".length));
  else renderRoadmap();
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", render);

/* ---------------- 视图：路线图 ---------------- */
function renderRoadmap() {
  const total = readyLessons().length;
  const doneN = readyLessons().filter((l) => state.done[l.id]).length;
  const pct = total ? Math.round((doneN / total) * 100) : 0;

  let html = `
    <header class="hd">
      <h1 class="hd-title"><span class="hd-logo">${LOGO}</span>${L(COURSE, "title")}</h1>
      <p class="hd-sub">${L(COURSE, "subtitle")}</p>
      <div class="hd-bar">
        <div class="progress">
          <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="progress-text">${t("已完成", "Completed")} ${doneN} / ${total} ${t("节", "lessons")} · ${pct}%</div>
        </div>
        <div class="goals" role="group" aria-label="${t("学习目标", "Learning goal")}">
          <span class="goals-label">${t("我的目标：", "My goal:")}</span>
          ${COURSE.goals.map((g) => `<button class="goal-chip" data-goal="${g.id}" aria-pressed="${state.goal === g.id}">${L(g, "label")}</button>`).join("")}
        </div>
      </div>
    </header>`;

  html += `
    <section class="philosophy">
      <h2 class="ph-title">${t("设计理念", "Design Philosophy")}</h2>
      <p class="ph-lead">${t("把期权拆成一条<strong>从零到专家</strong>的主线：从“为什么需要期权”，一步步走到“看懂希腊字母、设计组合策略、用 Python 定价回测、在 AI 时代自动化执行”。", "Options laid out as one <strong>zero-to-expert</strong> path: from “why options exist” all the way to reading the Greeks, designing multi-leg strategies, pricing & backtesting in Python, and executing them in the AI era.")}</p>
      <div class="ph-grid">
        <div class="ph-card"><div class="ph-ic">🧭</div><h3>${t("一条主线", "One Path")}</h3><p>${t("12 个阶段、4 个深度层（入门 → 原理 → 策略系统 → 精通），后面的硬核都建立在前面的直觉之上。", "12 stages across 4 depth tiers (Beginner → Principles → Strategy Systems → Mastery); every hardcore part builds on earlier intuition.")}</p></div>
        <div class="ph-card"><div class="ph-ic">🔬</div><h3>${t("真能算的演示", "Demos That Compute")}</h3><p>${t("每节配一个浏览器内交互演示，很多是真算——真实 Black-Scholes 定价、实时希腊字母曲线、蒙特卡洛模拟、可拖动的损益图。", "Every lesson has an in-browser demo; many compute for real — true Black-Scholes pricing, live Greeks curves, Monte Carlo, draggable payoff diagrams.")}</p></div>
        <div class="ph-card"><div class="ph-ic">🧩</div><h3>${t("固定模板", "Fixed Template")}</h3><p>${t("直觉 → 原理（可折叠）→ 演示 → 类比 → 常见误解 → 自测 → 延伸，认知负担最小。", "Intuition → Mechanics (collapsible) → Demo → Analogy → Misconceptions → Quiz → Further reading. Minimal cognitive load.")}</p></div>
        <div class="ph-card"><div class="ph-ic">🤖</div><h3>${t("量化 × AI", "Quant × AI")}</h3><p>${t("把量化与 AI 的思维贯穿全程：从风险中性定价、波动率建模，到深度对冲、强化学习做市与用智能体执行策略。", "Quant and AI thinking woven throughout: from risk-neutral pricing and vol modeling to deep hedging, RL market-making, and executing strategies with agents.")}</p></div>
      </div>
      <div class="risk-note">${t("⚠️ <b>仅供教育</b>：本课程用于学习期权原理与方法，<b>不构成任何投资建议</b>。期权是高风险工具，可能损失全部本金、卖方风险甚至无限。所有数字与演示均为教学简化。你的学习进度<b>只存在本地浏览器</b>，不会上传。", "⚠️ <b>Educational only</b>: this course teaches how options work — it is <b>not investment advice</b>. Options are high-risk; you can lose your entire premium, and short positions can lose far more. All numbers and demos are simplified for teaching. Your progress lives <b>only in your local browser</b>.")}</div>
    </section>`;

  if (total > 0 && doneN === total) {
    html += `<div class="done-banner">${t(`🎉 恭喜！你已读完整条「期权之路」——全部 ${total} 节，从“为什么需要期权”到“用代码与 AI 执行一套策略”。`, `🎉 Congratulations! You've completed the entire Droplet Labs · Options Path — all ${total} lessons, from “why options exist” to “execute a strategy with code and AI.”`)}</div>`;
  }

  let lastTier = null;
  for (const s of COURSE.stages) {
    if (s.tier !== lastTier) { html += `<div class="tier-head">${L(tierOf(s.tier), "label")}</div>`; lastTier = s.tier; }
    html += stageHTML(s);
  }
  app.innerHTML = `<div class="home">${html}</div>`;

  app.querySelectorAll("[data-goal]").forEach((btn) =>
    btn.addEventListener("click", () => {
      state.goal = state.goal === btn.dataset.goal ? null : btn.dataset.goal;
      saveState(state);
      renderRoadmap();
    }));
  app.querySelectorAll("[data-open]").forEach((el) =>
    el.addEventListener("click", () => { location.hash = `lesson/${el.dataset.open}`; }));
}

function stageHTML(s) {
  const color = tierOf(s.tier).color;
  const ready = s.lessons.filter(isReady);
  const stageDone = ready.length > 0 && ready.every((l) => state.done[l.id]);
  const chips = s.lessons.length
    ? s.lessons.map((l) => {
        if (!isReady(l)) {
          return `
            <div class="chip chip-soon">
              <span class="chip-mark"></span>
              <span class="chip-title">${L(l, "title")}</span>
              ${stars(l.difficulty)}
              <span class="chip-soon-tag">${t("编写中", "Soon")}</span>
            </div>`;
        }
        const done = state.done[l.id];
        const rec = state.goal && relevant(l);
        const dim = state.goal && !relevant(l);
        return `
          <button class="chip ${dim ? "dim" : ""} ${rec ? "rec" : ""}" data-open="${l.id}">
            <span class="chip-mark ${done ? "done" : ""}">${done ? "✓" : ""}</span>
            <span class="chip-title">${L(l, "title")}</span>
            ${stars(l.difficulty)}
            ${rec ? `<span class="rec-badge">${t("推荐", "Pick")}</span>` : ""}
            <span class="chip-arrow">→</span>
          </button>`;
      }).join("")
    : `<div class="chip chip-soon"><span class="chip-mark"></span>${t("课程编写中…", "Coming soon…")}</div>`;

  return `
    <section class="stage ${stageDone ? "done" : ""}">
      <div class="stage-num" style="background:${color}">${stageDone ? "✓" : s.n}</div>
      <div class="stage-body">
        <div class="stage-title">${L(s, "title")}${stageDone ? `<span class="stage-done-badge">${t("已完成", "Done")}</span>` : ""}</div>
        <p class="stage-blurb">${L(s, "blurb")}</p>
        <div class="chips">${chips}</div>
      </div>
    </section>`;
}

/* ---------------- 左侧导航栏 ---------------- */
function sidebarHTML(currentId) {
  const total = readyLessons().length;
  const doneN = readyLessons().filter((l) => state.done[l.id]).length;
  const pct = total ? Math.round((doneN / total) * 100) : 0;
  let html = `<nav class="sidebar">
    <div class="sb-home" data-back><span class="hd-logo">${LOGO}</span>${L(COURSE, "title")}</div>
    <div class="sb-progress">${t("已完成", "Done")} ${doneN}/${total} · ${pct}%</div>`;
  for (const s of COURSE.stages) {
    const color = tierOf(s.tier).color;
    html += `<div class="sb-stage"><div class="sb-stage-h"><span class="n" style="background:${color}">${s.n}</span>${L(s, "title")}</div>`;
    html += s.lessons.length
      ? s.lessons.map((l) => {
          if (!isReady(l)) {
            return `<div class="sb-lesson soon"><span class="sb-check"></span><span class="sb-t">${L(l, "title")}</span>${stars(l.difficulty)}</div>`;
          }
          const dim = state.goal && !relevant(l);
          return `<div class="sb-lesson${l.id === currentId ? " active" : ""}${dim ? " dim" : ""}" data-go="${l.id}"><span class="sb-check">${state.done[l.id] ? "✓" : ""}</span><span class="sb-t">${L(l, "title")}</span>${stars(l.difficulty)}</div>`;
        }).join("")
      : `<div class="sb-lesson soon"><span class="sb-check"></span>${t("课程编写中…", "Coming soon…")}</div>`;
    html += `</div>`;
  }
  return html + `</nav>`;
}

/* ---------------- 视图：课程页 ---------------- */
async function renderLesson(id) {
  const hit = findLesson(id);
  if (!hit) { location.hash = ""; return; }

  if (!isReady(hit.lesson)) {
    app.innerHTML = `<button class="back" data-back>← ${t("返回路线图", "Back to roadmap")}</button>
      <h1 class="lsn-title">${L(hit.lesson, "title")}</h1>
      <div class="fallback-note">${t("本节正在编写中，敬请期待。", "This lesson is being written — check back soon.")}</div>`;
    app.querySelectorAll("[data-back]").forEach((b) => b.addEventListener("click", () => { location.hash = ""; }));
    return;
  }

  let data, fellBack = false;
  try {
    if (lang() === "en") {
      try { data = (await import(enModulePath(hit.lesson.module) + "?v=" + V)).default; }
      catch { data = (await import(hit.lesson.module + "?v=" + V)).default; fellBack = true; }
    } else {
      data = (await import(hit.lesson.module + "?v=" + V)).default;
    }
  } catch (e) {
    app.innerHTML = `<button class="back" data-back>← ${t("返回路线图", "Back to roadmap")}</button>
      <div class="demo-warn">${t("课程加载失败", "Failed to load lesson")}：${esc(String(e))}</div>`;
    app.querySelectorAll("[data-back]").forEach((b) => b.addEventListener("click", () => { location.hash = ""; }));
    return;
  }

  const done = !!state.done[id];
  const prereq = (data.prereqs || []).map((p) => {
    const ph = findLesson(p);
    return ph ? `<a href="#lesson/${p}">${L(ph.lesson, "title")}</a>` : p;
  }).join(t("、", ", "));

  const seq = readyLessons();
  const si = seq.findIndex((l) => l.id === id);
  const prevL = seq[si - 1], nextL = seq[si + 1];
  const navHTML = `
    <div class="lsn-nav">
      ${prevL ? `<button class="navbtn" data-go="${prevL.id}">← ${t("上一课", "Prev")}<span>${L(prevL, "title")}</span></button>` : "<span></span>"}
      ${nextL ? `<button class="navbtn navbtn-next" data-go="${nextL.id}">${t("下一课", "Next")} →<span>${L(nextL, "title")}</span></button>` : "<span></span>"}
    </div>`;

  const SH = (icon, zh, en) => `<div class="section-h">${icon} ${t(zh, en)}</div>`;

  app.innerHTML = `
    <div class="lesson-layout">
      <button class="sb-toggle" data-sbtoggle>📚 ${t("课程目录", "Lessons")}</button>
      ${sidebarHTML(id)}
      <div class="lesson-main">
    <div class="breadcrumb"><a data-back>${L(COURSE, "title")}</a> › ${t("阶段", "Stage")} ${hit.stage.n} · ${L(hit.stage, "title")}</div>
    <h1 class="lsn-title">${L(data, "title") || data.title}<span class="diff-badge" title="${diffLabel(hit.lesson.difficulty)}">${stars(hit.lesson.difficulty)} ${diffLabel(hit.lesson.difficulty)}</span></h1>
    ${fellBack ? `<div class="fallback-note">${t("（本节英文版正在翻译中，暂以中文显示）", "(English version of this lesson is being translated; showing Chinese for now.)")}</div>` : ""}
    ${prereq ? `<div class="lsn-tag">${t("前置：", "Prerequisites: ")}${prereq}</div>` : ""}
    <div class="oneliner">${inline(data.oneLiner)}</div>

    <label class="depth-toggle"><input type="checkbox" id="depth" /> ${t("只看直觉版（隐藏「深入原理」）", "Intuition only (hide Mechanics)")}</label>

    <div class="section">${SH("🧠", "直觉解释", "Intuition")}${md(data.intuition)}</div>
    ${data.mechanics ? `<div class="section deep" id="mech">${SH("⚙️", "深入原理", "Mechanics")}${md(data.mechanics)}</div>` : ""}
    ${data.demo ? `<div class="section">${SH("🔬", "动手玩一玩", "Try It Yourself")}<div id="demo-mount"></div></div>` : ""}
    ${data.analogy ? `<div class="section">${SH("🪞", "类比", "Analogy")}${md(data.analogy)}</div>` : ""}
    ${(data.misconceptions || []).length ? `<div class="section">${SH("⚠️", "常见误解", "Common Misconceptions")}<ul class="miscon">${data.misconceptions.map((m) => `<li>${inline(m)}</li>`).join("")}</ul></div>` : ""}
    ${(data.quiz || []).length ? `<div class="section">${SH("✅", "自测", "Quick Quiz")}<div id="quiz"></div></div>` : ""}
    ${(data.further || []).length ? `<div class="section">${SH("📚", "延伸阅读", "Further Reading")}<div class="further">${data.further.map((f) => `<a href="${f.url}" target="_blank" rel="noopener">${f.label} ↗</a>`).join("")}</div></div>` : ""}

    <button class="complete ${done ? "done" : ""}" id="complete">${done ? t("✓ 已完成本节", "✓ Completed") : t("标记为已完成", "Mark as complete")}</button>
    ${navHTML}
      </div>
    </div>
  `;

  app.querySelectorAll("[data-back]").forEach((b) => b.addEventListener("click", () => { location.hash = ""; }));
  app.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => { location.hash = `lesson/${b.dataset.go}`; }));
  app.querySelector("[data-sbtoggle]")?.addEventListener("click", () => {
    app.querySelector(".lesson-layout")?.classList.toggle("sb-open");
  });
  app.querySelector(".sb-lesson.active")?.scrollIntoView({ block: "nearest" });

  decorateLesson(app.querySelector(".lesson-main"));

  const depth = app.querySelector("#depth");
  const mech = app.querySelector("#mech");
  if (depth && mech) depth.addEventListener("change", () => { mech.hidden = depth.checked; });

  if (data.demo) {
    const mountEl = app.querySelector("#demo-mount");
    try {
      const demo = (await import(`./demos/${data.demo}.js?v=${V}`)).default;
      demo(mountEl, lang());
    } catch (e) {
      mountEl.innerHTML = `<div class="demo-warn">${t("演示加载失败", "Demo failed to load")}：${esc(String(e))}</div>`;
    }
  }

  if ((data.quiz || []).length) renderQuiz(app.querySelector("#quiz"), data.quiz);

  const btn = app.querySelector("#complete");
  btn.addEventListener("click", () => {
    if (state.done[id]) return;
    state.done[id] = true;
    saveState(state);
    btn.classList.add("done");
    btn.textContent = t("✓ 已完成本节", "✓ Completed");
    if (readyLessons().every((l) => state.done[l.id])) {
      btn.insertAdjacentHTML("afterend", `<div class="done-banner" style="margin-top:14px">${t("🎉 你已读完整条「期权之路」！回到路线图，看看你点亮的全程。", "🎉 You've finished the entire Droplet Labs · Options Path! Head back to the roadmap to see your whole journey lit up.")}</div>`);
    }
    const nb = app.querySelector(".navbtn-next");
    if (nb) nb.classList.add("pulse");
  });
}

function renderQuiz(root, quiz) {
  root.innerHTML = quiz.map((q, qi) => `
    <div class="quiz-q">
      <div class="quiz-stem">${qi + 1}. ${inline(q.q)}</div>
      <div class="quiz-opts">
        ${q.options.map((o, oi) => `<button class="quiz-opt" data-q="${qi}" data-o="${oi}">${inline(o)}</button>`).join("")}
      </div>
      <div class="quiz-explain" hidden data-explain="${qi}">${inline(q.explain || "")}</div>
    </div>`).join("");

  root.querySelectorAll(".quiz-opt").forEach((btn) =>
    btn.addEventListener("click", () => {
      const qi = +btn.dataset.q, oi = +btn.dataset.o;
      const q = quiz[qi];
      root.querySelectorAll(`.quiz-opt[data-q="${qi}"]`).forEach((b, i) => {
        b.disabled = true;
        if (i === q.answer) b.classList.add("correct");
      });
      if (oi !== q.answer) btn.classList.add("wrong");
      root.querySelector(`[data-explain="${qi}"]`).hidden = false;
    }));
}

/* ---------------- 启动 ---------------- */
renderLangToggle();
render();
