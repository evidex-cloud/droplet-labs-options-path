// Droplet Labs · 期权之路 · Options Path — renderer (v3, 2026-09 full renewal; UI in the Droplet Labs brand language)
// Lessons are Markdown: content/lessons/zh/<id>.md and content/lessons/en/<id>.md (format: AUTHORING.md).
// This file only renders; all course content lives in content/ and demos/. UI strings use t(zh, en).

import { COURSE } from "./content/manifest.js?v=3";
import { GLOSSARY } from "./content/glossary.js?v=4";
import { tex } from "./math.js?v=1";

const V = "4"; // content version: bump after editing lessons/ or demos/ (busts the cache for fetch/import)
const PKEY = "options-path-v3";

const LOGO_H = "assets/logo-horizontal-dark-t.png";
const LOGO_S = "assets/logo-stacked-dark-t.png";
const MARK = "assets/mark-accent.svg";
const LINKS = { site: "https://dropletlabs.xyz/", paths: "https://evidex-cloud.github.io/" };
const app = document.getElementById("app");

/* ---------------- state ---------------- */
function loadState() {
  const base = { done: {}, quiz: {}, goal: null, lang: "zh", brief: false };
  try { return Object.assign(base, JSON.parse(localStorage.getItem(PKEY)) || {}); } catch { return base; }
}
function saveState(s) { try { localStorage.setItem(PKEY, JSON.stringify(s)); } catch { /* private mode */ } }
let state = loadState();
if (!state.quiz) state.quiz = {};
try { const ql = new URLSearchParams(location.search).get("lang"); if (ql === "en" || ql === "zh") { state.lang = ql; saveState(state); } } catch { /* */ }

/* ---------------- i18n ---------------- */
const lang = () => (state.lang === "en" ? "en" : "zh");
const t = (zh, en) => (lang() === "en" ? en : zh);
const L = (o, k) => (lang() === "en" && o[k + "En"] != null ? o[k + "En"] : o[k]);
const DIFF = { 1: ["基础", "Basic"], 2: ["进阶", "Intermediate"], 3: ["高级", "Advanced"] };
const diffLabel = (d) => t(DIFF[d][0], DIFF[d][1]);
const stars = (d) => `<span class="stars" title="${diffLabel(d)}" aria-label="${diffLabel(d)}">${[1, 2, 3].map((i) => `<i class="${i <= d ? "" : "off"}"></i>`).join("")}</span>`;

/* ---------------- course helpers ---------------- */
const tierOf = (id) => COURSE.tiers.find((x) => x.id === id);
const allLessons = () => COURSE.stages.flatMap((s) => s.lessons);
const LESSON_INDEX = new Map();
COURSE.stages.forEach((s) => s.lessons.forEach((l, i) => LESSON_INDEX.set(l.id, { lesson: l, stage: s, index: i, num: `${s.n}.${i + 1}` })));
const findLesson = (id) => LESSON_INDEX.get(id) || null;
const relevant = (lesson) => !state.goal || (lesson.personas || []).includes(state.goal);
const doneCount = (list) => list.filter((l) => state.done[l.id]).length;
const escHTML = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const escAttr = escHTML;
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };

/* ---------------- Markdown ---------------- */
// Inline: protect code, math \( … \) and [[links]] first, then Markdown, then restore.
function inline(src) {
  if (!src) return "";
  const store = [];
  const keep = (html) => `\u0000${store.push(html) - 1}\u0000`;
  let s = src;
  s = s.replace(/`([^`]+)`/g, (_, c) => keep(`<code>${escHTML(c)}</code>`));
  s = s.replace(/\\\(([\s\S]+?)\\\)/g, (_, m) => keep(tex(m.trim(), false)));
  s = s.replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (_, id, text) => keep(xrefLink(id, text)));
  s = s.replace(/\\\$/g, "$"); // an escaped dollar outside math is just a dollar sign
  s = escHTML(s);
  s = s.replace(/&lt;(\/?)(sub|sup|kbd|br|mark|small)\s*\/?&gt;/g, "<$1$2>");
  s = s.replace(/\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)/g, (_, text, url) =>
    /^#/.test(url) ? `<a href="${url}">${text}</a>` : `<a href="${url}" target="_blank" rel="noopener">${text}</a>`);
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*\w])\*(?!\s)(.+?)(?<!\s)\*(?!\*)/g, "$1<em>$2</em>");
  for (let k = 0; k < 3 && /\u0000\d+\u0000/.test(s); k++) s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => store[+i]);
  return s;
}
function xrefLink(id, text) {
  const hit = findLesson(id);
  if (!hit) return `<span class="xref-missing" title="missing lesson: ${escAttr(id)}">${escHTML(text || id)}</span>`;
  const label = text ? inline(text) : escHTML(L(hit.lesson, "title"));
  return `<a class="xref" href="#lesson/${id}" title="${t("阶段", "Stage")} ${hit.num} · ${escAttr(L(hit.lesson, "title"))}"><span class="xref-num">${hit.num}</span>${label}</a>`;
}

const CALLOUTS = {
  key:     ["key", "核心结论", "Key idea"],
  example: ["calc", "算一算", "Worked example"],
  think:   ["think", "想一想", "Think first"],
  recall:  ["recall", "回顾", "Recall"],
  warn:    ["warn", "注意", "Watch out"],
  history: ["history", "历史", "History"],
  deep:    ["deep", "深挖一层", "Going deeper"],
  fact:    ["fact", "最新现状", "State of play"],
  kai:     ["kai", "小凯的交易", "Kai's trade"],
  formula: ["formula", "公式卡", "Formula card"],
};
const CALLOUT_ICON = {
  key: `<path d="M8 7a3 3 0 1 1 2.8 3H10l-1 1H8v1H7v1H5v-2l3.2-3.2A3 3 0 0 1 8 7Z"/><circle cx="11" cy="6" r=".8"/>`,
  calc: `<rect x="3.5" y="2.5" width="9" height="11" rx="1.6"/><path d="M5.5 5h5M5.5 8h1M8 8h1M10.4 8h.1M5.5 10.5h1M8 10.5h1M10.4 10.5h.1"/>`,
  think: `<path d="M8 2.5a4 4 0 0 0-2.3 7.3V11h4.6V9.8A4 4 0 0 0 8 2.5ZM6.3 13h3.4"/>`,
  recall: `<path d="M3.5 8a4.5 4.5 0 1 0 1.3-3.2M3.5 3v2.5H6"/>`,
  warn: `<path d="M8 2.8 14 13H2L8 2.8ZM8 6.5v3M8 11.3v.1"/>`,
  history: `<path d="M4 2.5h7.5v11H4a1.5 1.5 0 0 1 0-3h7.5M6.5 5.5h3"/>`,
  deep: `<circle cx="7" cy="7" r="4"/><path d="m10 10 3.5 3.5M5.5 7h3M7 5.5v3"/>`,
  fact: `<path d="M8 13.5s4.5-4 4.5-7.2a4.5 4.5 0 0 0-9 0C3.5 9.5 8 13.5 8 13.5Z"/><circle cx="8" cy="6.3" r="1.5"/>`,
  kai: `<circle cx="8" cy="5.5" r="2.6"/><path d="M3 13.5c.6-2.6 2.6-4 5-4s4.4 1.4 5 4"/>`,
  formula: `<path d="M11.5 3H5l3.5 5L5 13h6.5"/>`,
};
const icon = (k) => `<svg class="ci" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CALLOUT_ICON[k] || ""}</svg>`;

const HTML_BLOCK = /^<(figure|svg|div|table|details|aside)\b/i;
const LIST_RE = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;

function md(text) {
  if (!text) return "";
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  let i = 0, out = "";
  const isBlank = (l) => !l || !l.trim();
  const startsBlock = (l) => /^(#{2,4}\s|```|\$\$|>|\||::demo\[)/.test(l.trim()) || HTML_BLOCK.test(l.trim()) || LIST_RE.test(l);
  while (i < lines.length) {
    const line = lines[i], tl = line.trim();
    if (isBlank(line)) { i++; continue; }
    if (tl.startsWith("```")) { // fenced code
      const langTag = tl.slice(3).trim(); const buf = []; i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) buf.push(lines[i++]);
      i++;
      out += `<pre class="code"${langTag ? ` data-lang="${escAttr(langTag)}"` : ""}><code>${escHTML(buf.join("\n"))}</code></pre>`;
      continue;
    }
    if (tl.startsWith("$$")) { // display math, may span lines
      let body = tl.slice(2);
      if (body.trim().endsWith("$$") && body.trim().length >= 2) { body = body.trim().slice(0, -2); i++; }
      else {
        const buf = [body]; i++;
        while (i < lines.length && !lines[i].trim().endsWith("$$")) buf.push(lines[i++]);
        if (i < lines.length) { buf.push(lines[i].trim().slice(0, -2)); i++; }
        body = buf.join("\n");
      }
      out += `<div class="formula">${tex(body.trim(), true)}</div>`;
      continue;
    }
    const dm = tl.match(/^::demo\[([a-z0-9-]+)\]$/);
    if (dm) { out += `<div class="inline-demo" data-demo="${dm[1]}"></div>`; i++; continue; }
    const hm = tl.match(HTML_BLOCK);
    if (hm) { // raw HTML block, passed through until its tag closes
      const tag = hm[1].toLowerCase(); const buf = []; let depth = 0;
      const openRe = new RegExp(`<${tag}\\b`, "gi"), closeRe = new RegExp(`</${tag}>`, "gi");
      do { const l = lines[i]; depth += (l.match(openRe) || []).length - (l.match(closeRe) || []).length; buf.push(l); i++; } while (i < lines.length && depth > 0);
      out += processRawHTML(buf.join("\n"));
      continue;
    }
    const h = tl.match(/^(#{2,4})\s+(.*)$/);
    if (h) {
      const lvl = h[1].length, txt = h[2];
      const tag = lvl === 2 ? "h3" : lvl === 3 ? "h3" : "h4";
      out += `<${tag} class="subhead lvl${lvl}" id="s-${slugify(txt)}">${inline(txt)}</${tag}>`;
      i++; continue;
    }
    if (tl.startsWith(">")) { // blockquote / callout
      const buf = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) buf.push(lines[i++].trim().replace(/^>\s?/, ""));
      const cm = buf[0].match(/^\[!(\w+)\]\s*(.*)$/);
      if (cm && CALLOUTS[cm[1].toLowerCase()]) {
        const type = cm[1].toLowerCase(), [ic, zh, en] = CALLOUTS[type];
        const title = cm[2] ? inline(cm[2]) : t(zh, en);
        const body = buf.slice(1);
        if (type === "think") {
          const sep = body.findIndex((l) => /^-{3,}$/.test(l.trim()));
          const qq = sep >= 0 ? body.slice(0, sep) : body, a = sep >= 0 ? body.slice(sep + 1) : [];
          out += `<div class="callout callout-think"><div class="callout-title">${icon(ic)}<span>${title}</span></div>${md(qq.join("\n"))}` +
            (a.length ? `<details class="reveal"><summary>${t("想好了？点开看答案", "Got an answer? Reveal")}</summary><div class="reveal-body">${md(a.join("\n"))}</div></details>` : "") + `</div>`;
        } else out += `<div class="callout callout-${type}"><div class="callout-title">${icon(ic)}<span>${title}</span></div>${md(body.join("\n"))}</div>`;
      } else out += `<blockquote>${md(buf.join("\n"))}</blockquote>`;
      continue;
    }
    if (tl.startsWith("|") && i + 1 < lines.length && /^\|?\s*:?-{2,}/.test(lines[i + 1].trim())) { // GFM table
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(lines[i++].trim());
      const split = (r) => r.replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, "|"));
      const head = split(rows[0]), aligns = split(rows[1]).map((c) => (/^:-+:$/.test(c) ? "center" : /-+:$/.test(c) ? "right" : ""));
      const th = head.map((c, k) => `<th${aligns[k] ? ` style="text-align:${aligns[k]}"` : ""}>${inline(c)}</th>`).join("");
      const body = rows.slice(2).map((r) => `<tr>${split(r).map((c, k) => `<td${aligns[k] ? ` style="text-align:${aligns[k]}"` : ""}>${inline(c)}</td>`).join("")}</tr>`).join("");
      out += `<div class="table-wrap"><table><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table></div>`;
      continue;
    }
    if (LIST_RE.test(line)) { // lists (one nested level)
      const buf = [];
      while (i < lines.length) {
        const l = lines[i];
        if (isBlank(l)) { if (i + 1 < lines.length && (LIST_RE.test(lines[i + 1]) || /^\s{2,}\S/.test(lines[i + 1]))) { buf.push(""); i++; continue; } break; }
        if (!LIST_RE.test(l) && !/^\s{2,}\S/.test(l) && buf.length && startsBlock(l)) break;
        buf.push(l); i++;
      }
      out += renderList(buf);
      continue;
    }
    const buf = []; // paragraph
    while (i < lines.length && !isBlank(lines[i]) && !(buf.length && startsBlock(lines[i]))) buf.push(lines[i++].trim());
    out += `<p>${inline(buf.join(" "))}</p>`;
  }
  return out;
}
function renderList(lines) {
  const items = []; let cur = null;
  const baseIndent = Math.min(...lines.filter((l) => LIST_RE.test(l)).map((l) => l.match(/^\s*/)[0].length));
  let ordered = false;
  for (const l of lines) {
    const m = l.match(LIST_RE);
    if (m && m[1].length === baseIndent) { if (cur === null) ordered = /\d/.test(m[2]); cur = { first: m[3], rest: [] }; items.push(cur); }
    else if (cur) cur.rest.push(l.slice(Math.min(baseIndent + 2, l.match(/^\s*/)[0].length)));
  }
  const tag = ordered ? "ol" : "ul";
  return `<${tag}>${items.map((it) => `<li>${inline(it.first)}${it.rest.filter((x) => x.trim()).length ? md(it.rest.join("\n")) : ""}</li>`).join("")}</${tag}>`;
}
// Raw HTML blocks (figures, tables): typeset \( … \) and inline Markdown inside captions and cells; never touch <svg> internals.
function processRawHTML(html) {
  const parts = html.split(/(<svg[\s\S]*?<\/svg>)/);
  return parts.map((p) => {
    if (p.startsWith("<svg")) return p;
    // typeset math first (so a "<" inside \( … \) can't split the text run), then Markdown in captions and cells
    const math = [];
    const hold = (html) => `\u0001${math.push(html) - 1}\u0001`;
    const q = p.replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => hold(`<div class="formula">${tex(m.trim(), true)}</div>`))
      .replace(/\\\(([\s\S]+?)\\\)/g, (_, m) => hold(tex(m.trim(), false)))
      .replace(/(<(?:figcaption|td|th|li|p|span|div|b|strong)[^>]*>)([^<]+)/g, (all, open, txt) => (/\[\[|\*\*|`/.test(txt) ? open + inline(txt.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")) : all));
    return q.replace(/\u0001(\d+)\u0001/g, (_, i) => math[+i]);
  }).join("");
}
function slugify(s) { return s.toLowerCase().replace(/\\\(.*?\\\)/g, "").replace(/[`*\\{}()[\]]/g, "").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 60) || "h"; }

/* ---------------- lesson file parser ---------------- */
function parseLesson(src) {
  src = src.replace(/\r\n?/g, "\n").replace(/^﻿/, "");
  const meta = {};
  const fm = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (fm) { for (const line of fm[1].split("\n")) { const m = line.match(/^(\w+):\s*(.*)$/); if (m) meta[m[1]] = m[2].trim(); } src = src.slice(fm[0].length); }
  const tm = src.match(/^#\s+(.+)$/m);
  const parts = src.split(/^##\s+@(\w+)\s*$/m);
  const sections = {};
  for (let k = 1; k < parts.length; k += 2) sections[parts[k].toLowerCase()] = parts[k + 1].trim();
  return { meta, title: tm ? tm[1].trim() : "", sections };
}
function parseQuiz(text) {
  const qs = []; let cur = null;
  for (const raw of (text || "").split("\n")) {
    const l = raw.trim(); if (!l) continue; let m;
    if ((m = l.match(/^\d+[.)]\s+(.*)$/))) { cur = { q: m[1], options: [], answer: -1, explain: "" }; qs.push(cur); }
    else if (cur && (m = l.match(/^[-*]\s+\[([ xX])\]\s+(.*)$/))) { if (m[1] !== " ") cur.answer = cur.options.length; cur.options.push(m[2]); }
    else if (cur && l.startsWith(">")) cur.explain += (cur.explain ? " " : "") + l.replace(/^>\s?/, "");
    else if (cur && !cur.options.length) cur.q += " " + l;
  }
  return qs.filter((q) => q.options.length >= 2 && q.answer >= 0);
}
function listItems(text) {
  const items = [];
  for (const raw of (text || "").split("\n")) {
    const m = raw.match(/^[-*]\s+(.*)$/);
    if (m) items.push(m[1]);
    else if (raw.trim() && items.length) items[items.length - 1] += " " + raw.trim();
  }
  return items;
}

/* ---------------- glossary hover cards ---------------- */
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const SKIP_TAG = new Set(["CODE", "PRE", "A", "H1", "H2", "H3", "H4", "H5", "BUTTON", "INPUT", "LABEL", "SELECT", "TEXTAREA", "SCRIPT", "STYLE", "SVG", "SUMMARY"]);
const SKIP_SEL = ".katex,.formula,.section-h,.breadcrumb,.lsn-tag,.lsn-meta,.lsn-nav,.demo-host,.inline-demo,.quiz,.gloss,.xref,.further,.callout-title,figure,.toc,.next-card,.view-switch";
function textNodes(root) {
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
let glossCache = null;
function glossIndex() {
  const l = lang();
  if (glossCache && glossCache.lang === l) return glossCache;
  const byKey = new Map(), all = [];
  for (const e of GLOSSARY) {
    const o = e[l]; if (!o || !o.terms) continue;
    for (const term of o.terms) { const key = l === "en" ? term.toLowerCase() : term; if (!byKey.has(key)) byKey.set(key, { def: o.def, title: o.terms[0] }); all.push(term); }
  }
  const alt = [...new Set(all)].sort((a, b) => b.length - a.length).map(escRe).join("|");
  const re = alt ? (l === "en" ? new RegExp(`(?<![A-Za-z0-9-])(?:${alt})(?![A-Za-z0-9-])`, "gi") : new RegExp(`(?:${alt})`, "g")) : null;
  glossCache = { lang: l, re, byKey };
  return glossCache;
}
function decorateGlossary(root) {
  const { re, byKey } = glossIndex();
  if (!re) return;
  const l = lang(), used = new Set();
  for (const node of textNodes(root)) {
    const text = node.nodeValue; re.lastIndex = 0;
    let m, last = 0, any = false; const frag = document.createDocumentFragment();
    while ((m = re.exec(text))) {
      const key = l === "en" ? m[0].toLowerCase() : m[0], hit = byKey.get(key);
      if (!hit || used.has(hit.title)) continue;
      used.add(hit.title);
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      const span = document.createElement("span");
      span.className = "gloss"; span.tabIndex = 0; span.textContent = m[0];
      const card = document.createElement("span");
      card.className = "gloss-card"; card.setAttribute("role", "note");
      const b = document.createElement("b"); b.textContent = hit.title; card.appendChild(b);
      card.appendChild(document.createTextNode(hit.def));
      span.appendChild(card); frag.appendChild(span);
      last = m.index + m[0].length; any = true;
    }
    if (any) { if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last))); node.parentNode.replaceChild(frag, node); }
  }
}
function wireGlossFlip(root) {
  const place = (g) => {
    const card = g.querySelector(".gloss-card");
    if (!card || window.matchMedia("(max-width: 640px)").matches) return;
    card.classList.remove("flip");
    const shown = card.getBoundingClientRect().width > 0;
    if (!shown) card.style.display = "block";
    const limit = Math.min(root.getBoundingClientRect().right, window.innerWidth) - 8;
    if (card.getBoundingClientRect().right > limit) card.classList.add("flip");
    if (!shown) card.style.display = "";
  };
  const hit = (e) => { const g = e.target.closest?.(".gloss"); if (g) place(g); };
  root.addEventListener("pointerover", hit);
  root.addEventListener("focusin", hit);
}
function decorateFigures(root) {
  root.querySelectorAll(".lesson-main figure").forEach((f) => {
    if (f.querySelector(".fig-hint")) return;
    const p = document.createElement("span");
    p.className = "fig-hint"; p.textContent = t("← 左右滑动查看完整图示 →", "← Swipe to see the whole diagram →");
    f.prepend(p);
  });
}

/* ---------------- chrome: nav + closing ---------------- */
const ICON_MENU = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M2 4h12M2 8h12M2 12h8"/></svg>`;
function ringSVG(pct) {
  const r = 8.5, c = 2 * Math.PI * r;
  return `<svg class="ring" viewBox="0 0 22 22" aria-hidden="true"><circle class="bg" cx="11" cy="11" r="${r}"/><circle class="fg" cx="11" cy="11" r="${r}" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${(c * (1 - pct / 100)).toFixed(2)}" transform="rotate(-90 11 11)"/></svg>`;
}
function renderChrome(view) {
  document.documentElement.lang = lang() === "en" ? "en" : "zh-CN";
  document.title = `${L(COURSE, "title")}${view.title ? " · " + view.title : ""}`;
  const all = allLessons(), total = all.length, doneN = doneCount(all);
  const pct = total ? Math.round((doneN / total) * 100) : 0;
  let nav = document.getElementById("nav");
  if (!nav) {
    nav = document.createElement("header"); nav.className = "nav"; nav.id = "nav"; document.body.prepend(nav);
    const bar = document.createElement("div"); bar.className = "readbar"; bar.id = "readbar"; document.body.prepend(bar);
  }
  nav.innerHTML = `
    <div class="nav-inner">
      <a class="nav-brand" href="#" aria-label="${t("期权之路 · 路线图", "Options Path · roadmap")}">
        <img class="nav-logo" src="${LOGO_H}" alt="Droplet Labs" width="1422" height="314">
        <span class="nav-sep"></span>
        <span class="nav-course">${t("<b>期权</b>之路", "<b>Options</b> Path")}</span>
      </a>
      <span class="nav-spacer"></span>
      <div class="nav-actions">
        <span class="nav-prog" title="${t("已完成", "Completed")} ${doneN}/${total}">${ringSVG(pct)}<span class="t">${doneN} / ${total}</span></span>
        ${view.kind === "lesson" ? `<button class="nav-btn nav-menu-btn" data-sbtoggle aria-label="${t("课程目录", "Lessons")}">${ICON_MENU}<span class="t">${t("目录", "Lessons")}</span></button>` : ""}
        <button class="nav-btn paper" data-lang aria-label="${t("Switch to English", "切换到中文")}">${t("EN", "中文")}</button>
      </div>
    </div>`;
  let foot = document.getElementById("closing");
  if (!foot) { foot = document.createElement("footer"); foot.className = "closing"; foot.id = "closing"; document.body.appendChild(foot); }
  foot.innerHTML = `
    <div class="closing-inner">
      <div class="closing-top">
        <div>
          <h2>${t("先看懂形状，再谈价格与风险。", "Understand the shape first. Then the price, then the risk.")}</h2>
          <p>${t("期权之路是 Droplet Labs 学习路径系列的一门：用四个观念——形状、无套利、波动率、风险——把期权从一张合约讲到一本被认真管理的交易账。", "Options Path is part of the Droplet Labs learning paths: four ideas — shape, no-arbitrage, volatility and risk — carry you from a single contract to a well-run options book.")}</p>
        </div>
        <div class="closing-links">
          <a class="btn btn-line btn-sm" href="${LINKS.paths}" target="_blank" rel="noopener">${t("全部学习路径", "All learning paths")} <span class="arrow">↗</span></a>
          <a class="btn btn-paper btn-sm" href="${LINKS.site}" target="_blank" rel="noopener">Droplet Labs <span class="arrow">↗</span></a>
        </div>
      </div>
      <div class="closing-bottom">
        <img class="footer-logo" src="${LOGO_S}" alt="Droplet Labs" width="1005" height="405">
        <div class="legal">
          <span>© 2026 Droplet Labs</span>
          <span>${t("仅供教育：期权与永续都是高风险工具，本课程不构成任何投资建议。", "Education only: options and perpetuals are high-risk instruments; nothing here is investment advice.")}</span>
        </div>
        <div class="closing-actions">
          <button type="button" data-lang>${t("English", "中文")}</button>
          <a href="#" data-top>${t("回到顶部 ↑", "Back to top ↑")}</a>
        </div>
      </div>
    </div>`;
  document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => { state.lang = lang() === "en" ? "zh" : "en"; saveState(state); glossCache = null; render({ keepScroll: false }); }));
  foot.querySelector("[data-top]").addEventListener("click", (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });
  nav.querySelector("[data-sbtoggle]")?.addEventListener("click", () => document.body.classList.toggle("sb-open"));
}

/* ---------------- routing ---------------- */
let cleanup = [], renderToken = 0;
const onCleanup = (fn) => cleanup.push(fn);
async function render(opts = {}) {
  cleanup.forEach((fn) => { try { fn(); } catch { /* */ } }); cleanup = [];
  document.body.classList.remove("sb-open");
  const hash = location.hash.replace(/^#/, ""), token = ++renderToken;
  if (hash.startsWith("lesson/")) await renderLesson(hash.slice(7), token);
  else renderRoadmap(hash);
  if (!opts.keepScroll && !(hash && !hash.startsWith("lesson/"))) window.scrollTo(0, 0);
}
window.addEventListener("hashchange", () => render());

/* ---------------- home / roadmap ---------------- */
const IDEAS = [
  { zh: ["形状", "期权是一种形状：买方的损益像一根曲棍球杆——亏损封顶、收益敞开。任何策略都是几块形状的叠加，先看懂形状，才谈得上别的。", "阶段 0 · 2 · 8 · 9"],
    en: ["Shape", "An option is a shape: the buyer's P&L is a hockey stick — capped loss, open upside. Every strategy is shapes added together; read the shape before anything else.", "Stages 0 · 2 · 8 · 9"] },
  { zh: ["无套利", "价格不是猜出来的：能用股票和现金复制出来的东西，就只能卖复制的成本。平价关系、二叉树、Black-Scholes，都是这一个想法。", "阶段 4 · 5 · 13"],
    en: ["No-arbitrage", "Prices aren't guesses: anything you can replicate with stock and cash must cost what the replication costs. Parity, binomial trees and Black-Scholes are all this one idea.", "Stages 4 · 5 · 13"] },
  { zh: ["波动率", "期权真正买卖的是“会动多少”。隐含波动率是市场的报价，实际波动率是结算的现实，两者之差就是期权交易者的饭碗。", "阶段 6 · 9 · 10 · 14"],
    en: ["Volatility", "Options really trade how much a price will move. Implied vol is the market's quote, realized vol is the bill that arrives; the gap between them is the options trader's living.", "Stages 6 · 9 · 10 · 14"] },
  { zh: ["风险", "希腊字母把风险拆成可以度量的零件；Gamma 与 Theta 是同一枚硬币的两面。谁承担风险、怎样对冲、杠杆何时反噬——决定了你能活多久。", "阶段 7 · 10 · 11 · 12"],
    en: ["Risk", "The Greeks break risk into measurable parts; gamma and theta are two sides of one coin. Who holds the risk, how it's hedged and when leverage bites decide how long you survive.", "Stages 7 · 10 · 11 · 12"] },
];
const STEPS = [["直觉", "Intuition"], ["原理", "Mechanics"], ["演示", "Demo"], ["类比", "Analogy"], ["误解", "Myths"], ["要点", "Takeaways"], ["自测", "Quiz"]];

function renderRoadmap(anchor) {
  renderChrome({ kind: "home" });
  const all = allLessons(), total = all.length, doneN = doneCount(all);
  const pct = total ? Math.round((doneN / total) * 100) : 0;
  const next = all.find((l) => !state.done[l.id]) || null;
  const tiers = COURSE.tiers.map((tr) => { const ls = COURSE.stages.filter((s) => s.tier === tr.id).flatMap((s) => s.lessons); return { ...tr, total: ls.length, done: doneCount(ls) }; });
  const cta = next
    ? `<a class="btn btn-ink" href="#lesson/${next.id}"><span class="btn-text"><small>${doneN ? t("继续学习", "Continue") : t("从这里开始", "Start here")} · ${findLesson(next.id).num}</small>${escHTML(L(next, "title"))}</span><span class="arrow">→</span></a>`
    : `<a class="btn btn-ink" href="#lesson/${all[0].id}">${t("重温第一课", "Revisit lesson 0.1")} <span class="arrow">→</span></a>`;
  let html = `
    <section class="hero">
      <div class="hero-copy">
        <span class="chip-label">Droplet Labs · ${t("学习路径", "Learning Path")}</span>
        <h1>${t("期权<em>之路</em>", "Options <em>Path</em>")}</h1>
        <p class="hero-lede">${escHTML(L(COURSE, "subtitle"))}</p>
        <ul class="hero-facts">
          <li><b>${COURSE.stages.length}</b>${t("个阶段", "stages")}</li>
          <li><b>${total}</b>${t("节课", "lessons")}</li>
          <li><b>207</b>${t("个交互演示", "live demos")}</li>
          <li><b>2</b>${t("种语言", "languages")}</li>
        </ul>
        <div class="hero-cta">${cta}<a class="btn btn-line" href="#roadmap">${t("浏览路线图", "Browse the roadmap")} <span class="arrow">↓</span></a></div>
      </div>
      <aside class="panel prog-panel" aria-label="${t("学习进度", "Progress")}">
        <img class="mark" src="${MARK}" alt="" aria-hidden="true">
        <div class="label">${t("你的进度", "Your progress")}</div>
        <div class="prog-top" style="margin-top:14px"><div><div class="prog-big">${pct}<small>%</small></div><div class="prog-sub">${t(`已完成 ${doneN} / ${total} 节`, `${doneN} of ${total} lessons completed`)}</div></div></div>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="tier-meter" style="grid-template-columns:repeat(${tiers.length},1fr)">${tiers.map((tr) => `<i style="--c:${tr.color}" title="${escHTML(L(tr, "label"))} · ${tr.done}/${tr.total}"><b style="width:${tr.total ? (tr.done / tr.total) * 100 : 0}%"></b></i>`).join("")}</div>
        ${next ? `<div class="next-up"><div class="label">${t("下一课", "Up next")}</div><a href="#lesson/${next.id}"><span class="code">${findLesson(next.id).num}</span>${escHTML(L(next, "title"))}</a></div>` : ""}
        <div class="goals" role="group" aria-label="${t("学习目标", "Learning goal")}">
          <div class="label">${t("按目标突出课程", "Highlight lessons for")}</div>
          <div class="goal-row">${COURSE.goals.map((g) => `<button class="goal-chip" data-goal="${g.id}" aria-pressed="${state.goal === g.id}">${escHTML(L(g, "label"))}</button>`).join("")}</div>
        </div>
      </aside>
    </section>`;
  if (total > 0 && doneN === total) html += `<div class="done-banner">${t(`恭喜！你已走完整条「期权之路」——全部 ${total} 节。`, `Congratulations — you've completed the entire Options Path, all ${total} lessons.`)}</div>`;
  html += `
    <section class="sec">
      <div class="sec-grid">
        <div class="sec-head"><span class="label"><span class="dot"></span>${t("贯穿全课的主线", "The spine")}</span><h2>${t("四个观念，串起每一节", "Four ideas behind every lesson")}</h2><p>${t("每节课开头都会告诉你：我们走到哪了、这一节落在哪个观念上、它接着前面哪一课。", "Every lesson opens by saying where we are, which idea it builds, and which lesson it continues.")}</p></div>
        <div class="ideas">${IDEAS.map((d, i) => { const x = d[lang()]; return `<article class="idea"><div class="idea-n">${"①②③④"[i]}</div><h3>${x[0]}</h3><p>${x[1]}</p><div class="where">${x[2]}</div></article>`; }).join("")}</div>
      </div>
    </section>
    <section class="sec">
      <div class="sec-grid">
        <div class="sec-head"><span class="label"><span class="dot"></span>${t("每节课怎么学", "How a lesson works")}</span><h2>${t("先图像，后公式，再动手", "Picture first, then formula, then hands-on")}</h2></div>
        <div>
          <ol class="steps">${STEPS.map((s) => `<li>${t(s[0], s[1])}</li>`).join("")}</ol>
          <div class="principles">
            <div><h4>${t("看得懂的公式", "Readable formulas")}</h4><p>${t("每个公式都排版成真正的数学式，逐项解释，并立刻代入小凯的 XYZ 期权算一遍。", "Every formula is typeset as real math, explained symbol by symbol, and immediately worked with Kai's XYZ options.")}</p></div>
            <div><h4>${t("真算的演示", "Demos that compute")}</h4><p>${t("Black-Scholes、希腊字母、二叉树、蒙特卡洛、波动率曲面、资金费与强平——全部在浏览器里真算，用同一个经过测试的引擎。", "Black-Scholes, Greeks, trees, Monte Carlo, vol surfaces, funding and liquidation — all computed live in your browser by one tested engine.")}</p></div>
            <div><h4>${t("本地优先 · 非投资建议", "Local-first · not advice")}</h4><p>${t("进度只存在你自己的浏览器；课程只讲机制、定价与风险，不构成投资建议。", "Progress stays in your own browser; the course teaches mechanics, pricing and risk — never investment advice.")}</p></div>
          </div>
        </div>
      </div>
    </section>
    <section class="sec" id="roadmap">
      <div class="sec-head" style="margin-bottom:18px"><span class="label"><span class="dot"></span>${t("路线图", "Roadmap")}</span><h2>${t(`从零到专家的 ${COURSE.stages.length} 个阶段`, `${COURSE.stages.length} stages from zero to expert`)}</h2></div>
      <nav class="tier-nav" aria-label="${t("按层跳转", "Jump to tier")}">${tiers.map((tr, i) => `<a href="#tier-${tr.id}" data-tier="${tr.id}" style="--c:${tr.color}"><i></i>${i + 1} · ${escHTML(L(tr, "label").split(" · ")[0])}</a>`).join("")}</nav>`;
  for (const tr of tiers) {
    const stages = COURSE.stages.filter((s) => s.tier === tr.id);
    const [head, ...rest] = L(tr, "label").split(" · ");
    html += `
      <section class="tier" id="tier-${tr.id}">
        <div class="tier-grid">
          <div class="tier-side" style="--c:${tr.color}">
            <span class="label"><i></i>${escHTML(head)}</span>
            <h2>${escHTML(rest.join(" · ") || head)}</h2>
            <p class="tier-blurb">${escHTML(L(tr, "blurb") || "")}</p>
            <div class="tp">${tr.done} / ${tr.total} ${t("节已完成", "done")}<div class="bar"><b style="width:${tr.total ? (tr.done / tr.total) * 100 : 0}%"></b></div></div>
          </div>
          <div class="stages-list">${stages.map((s) => stageHTML(s, tr.color)).join("")}</div>
        </div>
      </section>`;
  }
  app.innerHTML = `<div class="home">${html}</div>`;
  app.querySelectorAll("[data-goal]").forEach((btn) => btn.addEventListener("click", () => {
    state.goal = state.goal === btn.dataset.goal ? null : btn.dataset.goal; saveState(state);
    const y = window.scrollY; renderRoadmap(); window.scrollTo(0, y);
  }));
  app.querySelectorAll("[data-open]").forEach((el) => el.addEventListener("click", () => { location.hash = `lesson/${el.dataset.open}`; }));
  app.querySelectorAll('a[href^="#tier-"], a[href="#roadmap"]').forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault(); document.querySelector(a.getAttribute("href"))?.scrollIntoView({ behavior: "smooth", block: "start" });
  }));
  const links = [...app.querySelectorAll(".tier-nav a")];
  const io = new IntersectionObserver((ents) => { ents.forEach((en) => { if (en.isIntersecting) links.forEach((l) => l.classList.toggle("on", l.dataset.tier === en.target.id.slice(5))); }); }, { rootMargin: "-45% 0px -50% 0px" });
  app.querySelectorAll(".tier").forEach((s) => io.observe(s));
  onCleanup(() => io.disconnect());
  setReadbar(null);
  if (anchor) document.getElementById(anchor)?.scrollIntoView({ block: "start" });
}
function stageHTML(s, color) {
  const d = doneCount(s.lessons), stageDone = s.lessons.length > 0 && d === s.lessons.length;
  const chips = s.lessons.map((l, i) => {
    const done = state.done[l.id], rec = state.goal && relevant(l), dim = state.goal && !relevant(l);
    return `<button class="chip ${dim ? "dim" : ""} ${rec ? "rec" : ""}" data-open="${l.id}">
        <span class="chip-mark ${done ? "done" : ""}">${done ? "✓" : ""}</span>
        <span class="chip-code">${s.n}.${i + 1}</span>
        <span class="chip-title">${escHTML(L(l, "title"))}${rec ? ` <span class="rec-badge">${t("推荐", "Pick")}</span>` : ""}</span>
        ${stars(l.difficulty)}
        <span class="chip-arrow">→</span>
      </button>`;
  }).join("");
  return `
    <article class="stage ${stageDone ? "done" : ""}">
      <div class="stage-top">
        <div class="stage-num" style="background:${color}">${stageDone ? "✓" : s.n}</div>
        <div class="stage-body">
          <div class="stage-title">${escHTML(L(s, "title"))}<span class="stage-count">${d}/${s.lessons.length}</span>${stageDone ? `<span class="stage-done-badge">${t("已完成", "Done")}</span>` : ""}</div>
          ${s.question ? `<p class="stage-q">${escHTML(L(s, "question"))}</p>` : ""}
          <p class="stage-blurb">${escHTML(L(s, "blurb"))}</p>
        </div>
      </div>
      <div class="chips">${chips}</div>
    </article>`;
}

/* ---------------- sidebar ---------------- */
function sidebarHTML(currentId, currentStage) {
  const all = allLessons();
  let html = `<aside class="sidebar" id="sidebar" aria-label="${t("课程目录", "Lessons")}">
    <div class="sb-head"><button class="sb-home" data-back>← ${t("路线图", "Roadmap")}</button><span class="sb-progress">${doneCount(all)}/${all.length}</span><button class="sb-close" data-sbclose aria-label="${t("关闭", "Close")}">✕</button></div>`;
  for (const s of COURSE.stages) {
    const color = tierOf(s.tier).color;
    html += `<details class="sb-stage"${s === currentStage ? " open" : ""}>
      <summary><span class="n" style="background:${color}">${s.n}</span><span class="t">${escHTML(L(s, "title"))}</span><span class="c">${doneCount(s.lessons)}/${s.lessons.length}</span></summary>
      <div class="sb-list">${s.lessons.map((l, i) => `<div class="sb-lesson${l.id === currentId ? " active" : ""}${state.goal && !relevant(l) ? " dim" : ""}" data-go="${l.id}" role="link" tabindex="0"><span class="sb-check">${state.done[l.id] ? "✓" : ""}</span><span class="cd">${s.n}.${i + 1}</span><span class="sb-t">${escHTML(L(l, "title"))}</span></div>`).join("")}</div>
    </details>`;
  }
  return html + `</aside>`;
}

/* ---------------- reading progress ---------------- */
function setReadbar(el) {
  const bar = document.getElementById("readbar");
  if (!bar) return;
  if (!el) { bar.style.width = "0"; return; }
  const upd = () => { const r = el.getBoundingClientRect(), h = r.height - window.innerHeight * 0.6; bar.style.width = `${Math.max(0, Math.min(1, -r.top / (h > 0 ? h : 1))) * 100}%`; };
  upd();
  window.addEventListener("scroll", upd, { passive: true }); window.addEventListener("resize", upd);
  onCleanup(() => { window.removeEventListener("scroll", upd); window.removeEventListener("resize", upd); bar.style.width = "0"; });
}

/* ---------------- lesson view ---------------- */
const lessonCache = new Map();
async function fetchLesson(id) {
  const key = lang() + "/" + id;
  if (lessonCache.has(key)) return lessonCache.get(key);
  let fellBack = false;
  let res = await fetch(`./content/lessons/${lang()}/${id}.md?v=${V}`);
  if (!res.ok && lang() === "en") { res = await fetch(`./content/lessons/zh/${id}.md?v=${V}`); fellBack = true; }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = { ...parseLesson(await res.text()), fellBack };
  lessonCache.set(key, data);
  return data;
}
function readingMinutes(text) {
  const clean = text.replace(/<svg[\s\S]*?<\/svg>/g, " ").replace(/\$\$[\s\S]*?\$\$/g, " ");
  const cjk = (clean.match(/[一-鿿]/g) || []).length;
  const words = (clean.replace(/[一-鿿]/g, " ").match(/[A-Za-z0-9’']+/g) || []).length;
  return Math.max(4, Math.round(cjk / 380 + words / 220));
}

async function renderLesson(id, token) {
  const hit = findLesson(id);
  if (!hit) { location.hash = ""; return; }
  let data;
  try { data = await fetchLesson(id); } catch (e) {
    renderChrome({ kind: "lesson" });
    app.innerHTML = `<button class="btn btn-line btn-sm" data-back>← ${t("返回路线图", "Back to roadmap")}</button><div class="demo-warn" style="margin-top:16px">${t("这节课还没有写好，或加载失败", "This lesson isn't available yet, or failed to load")}：${escHTML(String(e))}</div>`;
    app.querySelector("[data-back]").addEventListener("click", () => { location.hash = ""; });
    return;
  }
  if (token !== renderToken) return;
  const S = data.sections, meta = data.meta;
  const title = L(hit.lesson, "title");
  renderChrome({ kind: "lesson", title });
  const tier = tierOf(hit.stage.tier);
  const seq = allLessons(), si = seq.findIndex((l) => l.id === id);
  const prevL = seq[si - 1], nextL = seq[si + 1];
  const done = !!state.done[id];
  const prereqs = (meta.prereqs || "").split(/[,\s]+/).filter(Boolean);
  const quiz = parseQuiz(S.quiz), miscon = listItems(S.misconceptions), takeaways = listItems(S.takeaways), further = listItems(S.further);
  const inlined = new Set([...[S.intuition, S.mechanics, S.analogy].join("\n").matchAll(/^::demo\[([a-z0-9-]+)\]/gm)].map((m) => m[1]));
  const demos = (meta.demo || "").split(/[,\s]+/).filter((d) => d && !inlined.has(d));
  const mins = readingMinutes([S.intuition, S.mechanics, S.analogy].join("\n"));

  const secs = [];
  const add = (key, zh, en, body, extra = "") => { if (body) secs.push({ key, label: t(zh, en), body, extra }); };
  add("intuition", "直觉", "Intuition", md(S.intuition));
  add("mechanics", "深入原理", "How it really works", md(S.mechanics), " deep");
  add("demo", "动手玩一玩", "Try it yourself", demos.map((d) => `<div class="demo-host" data-demo="${d}"></div>`).join(""));
  add("analogy", "类比", "Analogy", md(S.analogy));
  add("miscon", "常见误解", "Common misconceptions", miscon.length ? `<ul class="miscon">${miscon.map((m) => `<li>${inline(m)}</li>`).join("")}</ul>` : "");
  add("takeaways", "本节要点", "Key takeaways", takeaways.length ? `<ol class="takeaways">${takeaways.map((m) => `<li>${inline(m)}</li>`).join("")}</ol>` : "");
  add("quiz", "自测", "Quick quiz", quiz.length ? `<div class="quiz" id="quiz"></div>` : "");
  add("further", "延伸阅读", "Further reading", further.length ? `<div class="further">${further.map((f) => {
    const m = f.match(/^\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)\s*(?:[—–-]\s*)?(.*)$/); // URLs may contain one level of (…), e.g. Wikipedia
    return m ? `<a href="${escAttr(m[2])}" target="_blank" rel="noopener"><span>${inline(m[1])}${m[3] ? `<em>${inline(m[3])}</em>` : ""}<small>${escHTML(host(m[2]))}</small></span><span class="ext">↗</span></a>` : `<div class="further-plain">${inline(f)}</div>`;
  }).join("")}</div>` : "");
  const secHTML = secs.map((s, i) => `
    <section class="section${s.extra}" id="s-${s.key}"${s.key === "mechanics" ? " data-mech" : ""}>
      <h2 class="section-h"><span class="no">${String(i + 1).padStart(2, "0")}</span>${s.label}</h2>
      ${s.body}
    </section>`).join("");

  app.innerHTML = `
    <div class="lesson-layout">
      ${sidebarHTML(id, hit.stage)}
      <article class="lesson-main">
        <nav class="breadcrumb" aria-label="${t("位置", "Location")}"><a data-back>${t("路线图", "Roadmap")}</a><span class="sep">/</span><span class="tierdot" style="background:${tier.color}"></span><span>${escHTML(L(tier, "label").split(" · ")[0])}</span><span class="sep">/</span><span>${t("阶段", "Stage")} ${hit.stage.n} · ${escHTML(L(hit.stage, "title"))}</span></nav>
        <h1 class="lsn-title"><span class="lsn-num">${hit.num}</span>${escHTML(title)}</h1>
        <div class="lsn-meta">
          <span class="meta-pill">${stars(hit.lesson.difficulty)}${diffLabel(hit.lesson.difficulty)}</span>
          <span class="meta-pill">≈ ${mins} ${t("分钟阅读", "min read")}</span>
          ${done ? `<span class="meta-pill" style="color:var(--green)">✓ ${t("已完成", "Completed")}</span>` : ""}
        </div>
        ${data.fellBack ? `<div class="fallback-note">(English version of this lesson is being written; showing Chinese for now.)</div>` : ""}
        ${prereqs.length ? `<div class="lsn-tag">${t("前置：", "Builds on: ")}${prereqs.map((p) => xrefLink(p)).join(" ")}</div>` : ""}
        <div class="oneliner">${inline((S.hook || "").replace(/\n/g, " "))}</div>
        ${S.bridge ? `<div class="bridge"><div class="bridge-h">${t("我们走到哪了", "Where we are")}</div>${md(S.bridge)}</div>` : ""}
        ${S.mechanics ? `<div class="view-switch"><div class="seg" role="group" aria-label="${t("阅读深度", "Reading depth")}"><button data-depth="full" class="${state.brief ? "" : "on"}">${t("完整版", "Full lesson")}</button><button data-depth="brief" class="${state.brief ? "on" : ""}">${t("只看直觉版", "Intuition only")}</button></div></div>` : ""}
        ${secHTML}
        ${nextL ? `<a class="next-card" href="#lesson/${nextL.id}"><div class="next-k">${t("下一课", "Up next")} · ${findLesson(nextL.id).num}</div><div class="next-t">${escHTML(L(nextL, "title"))} →</div>${S.next ? `<div class="next-why">${inline(S.next.replace(/\n/g, " "))}</div>` : ""}</a>` : ""}
        <button class="complete ${done ? "done" : ""}" id="complete">${done ? t("✓ 已完成本节", "✓ Completed") : t("标记为已完成", "Mark as complete")}</button>
        <div class="lsn-nav">
          ${prevL ? `<button class="navbtn" data-go="${prevL.id}">← ${t("上一课", "Previous")} · ${findLesson(prevL.id).num}<span>${escHTML(L(prevL, "title"))}</span></button>` : "<span></span>"}
          ${nextL ? `<button class="navbtn navbtn-next" data-go="${nextL.id}">${t("下一课", "Next")} · ${findLesson(nextL.id).num} →<span>${escHTML(L(nextL, "title"))}</span></button>` : "<span></span>"}
        </div>
        <div class="kbd-hint">${t("键盘", "Keyboard")}：<kbd>←</kbd> <kbd>→</kbd> ${t("切换上一课 / 下一课", "previous / next lesson")}</div>
      </article>
      <nav class="toc" aria-label="${t("本页目录", "On this page")}"></nav>
    </div>
    <div class="scrim" data-sbclose></div>`;

  app.querySelectorAll("[data-back]").forEach((b) => b.addEventListener("click", () => { location.hash = ""; }));
  app.querySelectorAll("[data-go]").forEach((b) => {
    const go = () => { location.hash = `lesson/${b.dataset.go}`; };
    b.addEventListener("click", go); b.addEventListener("keydown", (e) => { if (e.key === "Enter") go(); });
  });
  app.querySelectorAll("[data-sbclose]").forEach((b) => b.addEventListener("click", () => document.body.classList.remove("sb-open")));
  const active = app.querySelector(".sb-lesson.active");
  if (active) { const sb = app.querySelector(".sidebar"); sb.scrollTop = active.offsetTop - sb.clientHeight / 3; }

  const mainEl = app.querySelector(".lesson-main");
  const mech = app.querySelector("[data-mech]");
  const applyDepth = () => { if (mech) mech.hidden = !!state.brief; buildToc(); };
  app.querySelectorAll("[data-depth]").forEach((b) => b.addEventListener("click", () => {
    state.brief = b.dataset.depth === "brief"; saveState(state);
    app.querySelectorAll("[data-depth]").forEach((x) => x.classList.toggle("on", x === b));
    applyDepth();
  }));

  try { decorateGlossary(mainEl); wireGlossFlip(mainEl); decorateFigures(mainEl); } catch { /* decoration never blocks reading */ }
  for (const el of app.querySelectorAll(".demo-host[data-demo], .inline-demo[data-demo]")) mountDemo(el, el.dataset.demo);
  if (quiz.length) renderQuiz(app.querySelector("#quiz"), quiz, id);

  function buildToc() {
    const toc = app.querySelector(".toc");
    if (!toc) return;
    const items = [];
    secs.forEach((s) => {
      if (s.key === "mechanics" && state.brief) return;
      items.push(`<li><a href="#s-${s.key}" data-sec="s-${s.key}">${s.label}</a></li>`);
      if (s.key === "mechanics") mainEl.querySelectorAll("#s-mechanics .subhead.lvl3").forEach((h) => {
        const c = h.cloneNode(true); c.querySelectorAll(".gloss-card,.katex-mathml").forEach((x) => x.remove());
        const full = c.textContent.trim(), txt = full.replace(/^[①②③④⑤⑥⑦⑧\s]+/, "");
        items.push(`<li class="sub"><a href="#${h.id}" data-sec="${h.id}">${escHTML(full.charAt(0))} ${escHTML(txt.length > 42 ? txt.slice(0, 40) + "…" : txt)}</a></li>`);
      });
    });
    toc.innerHTML = `<div class="label">${t("本页目录", "On this page")}</div><ol>${items.join("")}</ol><div class="toc-actions"><button data-totop>↑ ${t("回到顶部", "Back to top")}</button></div>`;
    toc.querySelectorAll("a[data-sec]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); document.getElementById(a.dataset.sec)?.scrollIntoView({ behavior: "smooth", block: "start" }); }));
    toc.querySelector("[data-totop]").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
  applyDepth();
  const spy = new IntersectionObserver((ents) => { ents.forEach((en) => { if (en.isIntersecting) app.querySelectorAll(".toc a").forEach((a) => a.classList.toggle("on", a.dataset.sec === en.target.id)); }); }, { rootMargin: "-18% 0px -72% 0px" });
  mainEl.querySelectorAll(".section, #s-mechanics .subhead.lvl3").forEach((el) => spy.observe(el));
  onCleanup(() => spy.disconnect());
  setReadbar(mainEl);

  const onKey = (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const tag = (e.target.tagName || "").toLowerCase();
    if (["input", "textarea", "select", "button"].includes(tag) || e.target.isContentEditable) return;
    if (e.key === "ArrowLeft" && prevL) location.hash = `lesson/${prevL.id}`;
    if (e.key === "ArrowRight" && nextL) location.hash = `lesson/${nextL.id}`;
    if (e.key === "Escape") document.body.classList.remove("sb-open");
  };
  document.addEventListener("keydown", onKey);
  onCleanup(() => document.removeEventListener("keydown", onKey));

  const btn = app.querySelector("#complete");
  btn.addEventListener("click", () => {
    state.done[id] = !state.done[id]; saveState(state);
    btn.classList.toggle("done", !!state.done[id]);
    btn.textContent = state.done[id] ? t("✓ 已完成本节", "✓ Completed") : t("标记为已完成", "Mark as complete");
    const y = window.scrollY; renderChrome({ kind: "lesson", title }); window.scrollTo(0, y);
    const sb = app.querySelector(".sb-lesson.active .sb-check"); if (sb) sb.textContent = state.done[id] ? "✓" : "";
    if (state.done[id]) app.querySelector(".next-card")?.classList.add("pulse");
  });
}

async function mountDemo(el, name) {
  el.classList.add("demo-host");
  try {
    const mod = await import(`./demos/${name}.js?v=${V}`);
    await mod.default(el, lang());
  } catch (e) {
    el.innerHTML = `<div class="demo-warn">${t("演示加载失败", "Demo failed to load")}（${escHTML(name)}）：${escHTML(String((e && e.message) || e))}</div>`;
    console.error(e);
  }
}

// deterministic shuffle: answer positions vary but stay stable across visits
function seededOrder(n, seedStr) {
  let h = 2166136261;
  for (const c of seedStr) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const idx = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) { h = Math.imul(h ^ (h >>> 13), 1274126177); const j = (h >>> 0) % (i + 1); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  return idx;
}
function renderQuiz(root, quiz, id) {
  const answered = new Map();
  root.innerHTML = quiz.map((q, qi) => {
    const order = seededOrder(q.options.length, id + ":" + qi);
    return `<div class="quiz-q">
      <div class="quiz-stem"><span class="qn">${qi + 1}</span><span>${inline(q.q)}</span></div>
      <div class="quiz-opts">${order.map((oi) => `<button class="quiz-opt" data-q="${qi}" data-o="${oi}"><span>${inline(q.options[oi])}</span></button>`).join("")}</div>
      <div class="quiz-explain" hidden data-explain="${qi}"></div>
    </div>`;
  }).join("") + `<div class="quiz-score" hidden></div>`;
  root.querySelectorAll(".quiz-opt").forEach((btn) => btn.addEventListener("click", () => {
    const qi = +btn.dataset.q, oi = +btn.dataset.o, q = quiz[qi];
    if (answered.has(qi)) return;
    answered.set(qi, oi === q.answer);
    root.querySelectorAll(`.quiz-opt[data-q="${qi}"]`).forEach((b) => { b.disabled = true; if (+b.dataset.o === q.answer) b.classList.add("correct"); });
    if (oi !== q.answer) btn.classList.add("wrong");
    const ex = root.querySelector(`[data-explain="${qi}"]`);
    ex.innerHTML = `<b>${oi === q.answer ? t("✓ 答对了。", "✓ Correct.") : t("✗ 再想想。", "✗ Not quite.")}</b> ${inline(q.explain || "")}`;
    ex.hidden = false;
    if (answered.size === quiz.length) {
      const score = [...answered.values()].filter(Boolean).length;
      state.quiz[id] = Math.max(state.quiz[id] || 0, score); saveState(state);
      const sc = root.querySelector(".quiz-score");
      sc.hidden = false;
      sc.innerHTML = score === quiz.length
        ? t(`全对（${score}/${quiz.length}）！可以放心进入下一课。`, `Perfect (${score}/${quiz.length})! You're ready for the next lesson.`)
        : t(`得分 ${score}/${quiz.length}。看看解析，必要时回到上面对应的小节再读一遍。`, `Score ${score}/${quiz.length}. Read the explanations and revisit the matching section above if needed.`);
    }
  }));
}

/* ---------------- boot ---------------- */
render();
