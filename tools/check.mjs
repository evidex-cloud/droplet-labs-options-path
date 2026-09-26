// Lesson + demo validator.   node tools/check.mjs [lesson-id …]      (no ids = whole course)
// Checks structure, lengths, links, quiz, figures, every formula (KaTeX, vendored), the "$ is money, \( \) is math" rule,
// plain-text formulas left outside math, and that every referenced demo imports and follows the demo contract.
// Add --warn to print warnings (default prints them too; --quiet hides them).
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { COURSE } = await import(pathToFileURL(path.join(ROOT, "content/manifest.js")).href + "?t=" + Date.now());
const { texError } = await import(pathToFileURL(path.join(ROOT, "math.js")).href);

const argv = process.argv.slice(2);
const quiet = argv.includes("--quiet");
const want = argv.filter((a) => !a.startsWith("--"));
const lessons = COURSE.stages.flatMap((s) => s.lessons.map((l, i) => ({ ...l, stage: s.n, num: `${s.n}.${i + 1}` })));
const ids = new Set(lessons.map((l) => l.id));
const order = new Map(lessons.map((l, i) => [l.id, i]));
const targets = want.length ? lessons.filter((l) => want.includes(l.id)) : lessons;
for (const w of want) if (!ids.has(w)) console.log("unknown lesson id:", w);

function parseLesson(src) {
  src = src.replace(/\r\n?/g, "\n").replace(/^﻿/, "");
  const meta = {};
  const fm = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (fm) { for (const line of fm[1].split("\n")) { const m = line.match(/^(\w+):\s*(.*)$/); if (m) meta[m[1]] = m[2].trim(); } src = src.slice(fm[0].length); }
  const tm = src.match(/^#\s+(.+)$/m);
  const parts = src.split(/^##\s+@(\w+)\s*$/m);
  const sections = {};
  for (let k = 1; k < parts.length; k += 2) sections[parts[k].toLowerCase()] = parts[k + 1].trim();
  return { meta, title: tm ? tm[1].trim() : null, sections, hasFM: !!fm, body: src };
}
const items = (t) => (t || "").split("\n").filter((l) => /^[-*]\s+/.test(l));
function quiz(t) {
  const qs = []; let cur = null;
  for (const raw of (t || "").split("\n")) {
    const l = raw.trim(); let m;
    if ((m = l.match(/^\d+[.)]\s+(.*)$/))) { cur = { q: m[1], opts: 0, correct: 0, explain: false, pos: -1 }; qs.push(cur); }
    else if (cur && (m = l.match(/^[-*]\s+\[([ xX])\]\s+/))) { if (m[1] !== " ") { cur.correct++; cur.pos = cur.opts; } cur.opts++; }
    else if (cur && l.startsWith(">")) cur.explain = true;
  }
  return qs;
}
// Split text into math segments and the prose that remains (code and SVG removed first)
function segments(text) {
  const math = [];
  let s = text.replace(/```[\s\S]*?```/g, " ").replace(/`[^`\n]+`/g, " ").replace(/<svg[\s\S]*?<\/svg>/g, " ");
  s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => { math.push({ tex: m.trim(), display: true }); return " ⟦M⟧ "; });
  s = s.replace(/\\\(([\s\S]+?)\\\)/g, (_, m) => { math.push({ tex: m.trim(), display: false }); return " ⟦m⟧ "; });
  return { math, prose: s };
}

let errors = 0, warnings = 0;
const report = [];
const E = (id, lang, msg) => { errors++; report.push(`  ✗ [${id}/${lang}] ${msg}`); };
const W = (id, lang, msg) => { warnings++; if (!quiet) report.push(`  · [${id}/${lang}] ${msg}`); };
const demoChecked = new Set();

async function checkDemo(name, owner) {
  if (demoChecked.has(name)) return;
  demoChecked.add(name);
  const f = path.join(ROOT, "demos", name + ".js");
  if (!fs.existsSync(f)) { E(owner, "demo", `demo file demos/${name}.js is missing`); return; }
  const src = fs.readFileSync(f, "utf8");
  const code = src.replace(/\/\/.*$/gm, "");
  if (!/export\s+default\s+(async\s+)?function/.test(src)) E(owner, "demo", `${name}.js has no "export default function mount(root, lang)"`);
  if (/(fill|stroke|color|background)\s*[:=]\s*["']?#[0-9a-fA-F]{3,8}\b/.test(code) || /["'`]#[0-9a-fA-F]{6}["'`]/.test(code)) E(owner, "demo", `${name}.js hard-codes a hex colour; use CSS variables / classes`);
  if (!src.includes("demo-tip")) E(owner, "demo", `${name}.js has no .demo-tip line`);
  if (!/lang\s*===\s*["']en["']|tr\(lang\)/.test(src)) E(owner, "demo", `${name}.js is not bilingual (no lang === "en" / tr(lang))`);
  if (/\bfetch\(|XMLHttpRequest|WebSocket|document\.getElementById|document\.querySelector\(/.test(code)) E(owner, "demo", `${name}.js uses the network or global DOM queries (use root.querySelector, no fetch)`);
  if (/\balert\(|\bconfirm\(|\bprompt\(/.test(code)) E(owner, "demo", `${name}.js uses alert/confirm/prompt`);
  // LaTeX inside normal JS strings needs doubled backslashes; String.raw templates need single ones.
  const noRaw = code.replace(/String\.raw`[^`]*`/g, "");
  const bad = noRaw.match(/(?<!\\)\\(times|text|frac|dfrac|theta|tau|beta|rho|right|left|bar|approx|cdot|sqrt|sum|log|ln|max|min|mathbb|mathrm|operatorname|infty|alpha|lambda|mu|sigma|Delta|Gamma|pi|ldots|dots|quad|le|ge|pm|partial|N|E)(?![a-zA-Z])/);
  if (bad) E(owner, "demo", `${name}.js: single-backslash LaTeX "${bad[0]}" in a normal JS string — use tex(String.raw\`…\`) or double the backslash`);
  try { await import(pathToFileURL(f).href + "?t=" + Date.now()); } catch (e) { E(owner, "demo", `${name}.js fails to import: ${e.message}`); }
}

const CJK = /[一-鿿]/;
for (const Ls of targets) {
  const idx = order.get(Ls.id), isLast = idx === lessons.length - 1, isFirst = idx === 0;
  const answerPos = [];
  for (const lang of ["zh", "en"]) {
    const file = path.join(ROOT, "content/lessons", lang, Ls.id + ".md");
    if (!fs.existsSync(file)) { E(Ls.id, lang, "file missing: " + path.relative(ROOT, file)); continue; }
    const raw = fs.readFileSync(file, "utf8");
    const P = parseLesson(raw), S = P.sections, meta = P.meta;
    if (!P.hasFM) E(Ls.id, lang, "missing front matter (--- … ---)");
    if (meta.id !== Ls.id) E(Ls.id, lang, `front-matter id "${meta.id}" ≠ manifest id`);
    const wantTitle = lang === "en" ? Ls.titleEn : Ls.title;
    if (P.title !== wantTitle) E(Ls.id, lang, `title "${P.title}" ≠ manifest "${wantTitle}"`);
    for (const p of (meta.prereqs || "").split(/[,\s]+/).filter(Boolean)) {
      if (!ids.has(p)) E(Ls.id, lang, `prereq "${p}" is not a lesson id`);
      else if (order.get(p) >= idx) E(Ls.id, lang, `prereq "${p}" comes after this lesson`);
    }
    const need = ["hook", "bridge", "intuition", "mechanics", "analogy", "misconceptions", "takeaways", "quiz", "further"];
    if (!isLast) need.push("next");
    for (const s of need) if (!S[s]) E(Ls.id, lang, `missing section "## @${s}"`);
    const heads = [...(S.mechanics || "").matchAll(/^###\s+(.+)$/gm)].map((m) => m[1]);
    if (S.mechanics && (heads.length < 3 || heads.length > 7)) E(Ls.id, lang, `mechanics should have 3–7 "###" subsections (has ${heads.length})`);
    if (heads.some((h) => !/^[①②③④⑤⑥⑦]/.test(h))) E(Ls.id, lang, 'every mechanics "###" heading must start with ① ② ③ …');
    const mc = items(S.misconceptions).length; if (S.misconceptions && (mc < 4 || mc > 6)) E(Ls.id, lang, `misconceptions: ${mc} items (want 4–6)`);
    const tk = items(S.takeaways).length; if (S.takeaways && (tk < 3 || tk > 6)) E(Ls.id, lang, `takeaways: ${tk} items (want 3–6)`);
    const fr = items(S.further); if (S.further && (fr.length < 3 || fr.length > 7)) E(Ls.id, lang, `further: ${fr.length} items (want 3–7)`);
    if (fr.some((f) => !/^[-*]\s+\[[^\]]+\]\(https?:\/\/[^)\s]+\)/.test(f))) E(Ls.id, lang, "every further-reading item must start with [label](https://…)");
    const qz = quiz(S.quiz);
    if (S.quiz && (qz.length < 4 || qz.length > 6)) E(Ls.id, lang, `quiz: ${qz.length} questions (want 4–6)`);
    qz.forEach((q, i) => {
      if (q.opts !== 4) E(Ls.id, lang, `quiz Q${i + 1}: ${q.opts} options (want exactly 4)`);
      if (q.correct !== 1) E(Ls.id, lang, `quiz Q${i + 1}: ${q.correct} options marked [x] (want exactly 1)`);
      if (!q.explain) E(Ls.id, lang, `quiz Q${i + 1}: no "> explanation" line`);
      if (/\b(option|选项)\s*[A-D]\b|[（(][A-D][)）]/.test(q.q)) W(Ls.id, lang, `quiz Q${i + 1}: don't refer to option letters (options are shuffled)`);
    });
    answerPos.push(qz.map((q) => q.pos).join(","));
    // length
    const body = [S.intuition, S.mechanics, S.analogy].join("\n").replace(/<svg[\s\S]*?<\/svg>/g, " ").replace(/\$\$[\s\S]*?\$\$/g, " ").replace(/```[\s\S]*?```/g, " ");
    const short = meta.short === "true";
    if (lang === "zh") {
      const cjk = (body.match(/[一-鿿]/g) || []).length, min = short ? 1500 : 2400;
      if (cjk < min) E(Ls.id, lang, `too short: ${cjk} Chinese characters in intuition+mechanics+analogy (want ≥ ${min})`);
      if (/\bStage\s+\d/.test(raw)) W(Ls.id, lang, 'Chinese file says "Stage" — write 阶段 or use [[links]]');
    } else {
      const words = (body.replace(/<[^>]+>/g, " ").match(/[A-Za-z][A-Za-z'’-]*/g) || []).length, min = short ? 1000 : 1700;
      if (words < min) E(Ls.id, lang, `too short: ${words} words in intuition+mechanics+analogy (want ≥ ${min})`);
      const cj = raw.match(/[一-鿿]/g);
      if (cj) E(Ls.id, lang, `English file contains ${cj.length} Chinese characters (e.g. "${cj.slice(0, 6).join("")}")`);
    }
    // links
    const refs = [...raw.matchAll(/\[\[([a-z0-9-]+)(?:\|[^\]]+)?\]\]/g)].map((m) => m[1]);
    for (const r of refs) if (!ids.has(r)) E(Ls.id, lang, `[[${r}]] is not a lesson id`);
    const uniq = new Set(refs.filter((r) => r !== Ls.id && ids.has(r)));
    if (uniq.size < 3) E(Ls.id, lang, `only ${uniq.size} distinct [[lesson]] links (want ≥ 3)`);
    if (!isFirst && ![...uniq].some((r) => order.get(r) < idx)) E(Ls.id, lang, "no [[link]] back to an earlier lesson");
    if (!isLast && ![...uniq].some((r) => order.get(r) > idx)) E(Ls.id, lang, "no [[link]] forward to a later lesson");
    if (/(阶段|回扣)\s*\d+\.\d+|\bStage\s+\d+\.\d+/.test(raw.replace(/\[\[[^\]]+\]\]/g, ""))) W(Ls.id, lang, 'plain "Stage X.Y" / "阶段 X.Y" text — use [[lesson-id]] links instead');
    if (/右边|右侧|左边的演示|on the right|to the right/i.test(raw)) W(Ls.id, lang, 'mentions a demo "on the right" — demos appear below/inline');
    // visuals
    const figs = (raw.match(/<figure\b/g) || []).length, inl = (raw.match(/^::demo\[[a-z0-9-]+\]\s*$/gm) || []).length;
    const disp = (raw.match(/\$\$/g) || []).length / 2, tables = (raw.match(/^\|.*\|\s*$\n^\|?\s*:?-{2,}/gm) || []).length;
    if (figs < 1 && !short) E(Ls.id, lang, "no <figure> diagram (want ≥ 1 inline SVG figure)");
    if (inl < 1 && !short) E(Ls.id, lang, "no ::demo[…] inline widget in intuition/mechanics (want ≥ 1)");
    if (figs + inl + disp + tables < 4 && !short) W(Ls.id, lang, `only ${figs + inl + disp + tables} visual elements (figures + inline demos + display formulas + tables); aim for ≥ 4`);
    if (/(fill|stroke|color|background)\s*[:=]\s*["']?#[0-9a-fA-F]{3,8}/.test(raw)) E(Ls.id, lang, "hard-coded hex colour in an SVG/HTML block — use fx-* classes");
    if ((raw.match(/<figure[\s\S]*?<\/figure>/g) || []).some((f) => /\n\s*\n/.test(f))) E(Ls.id, lang, "blank line inside a <figure> block (breaks the block)");
    for (const m of raw.matchAll(/<marker[^>]*id="([^"]+)"/g)) if (!m[1].startsWith(Ls.id)) W(Ls.id, lang, `SVG marker id "${m[1]}" should start with the lesson id (unique ids across a page)`);
    const ctl = raw.replace(/```[\s\S]*?```/g, "").match(/[\x08\x0b\x0c\t]/); // a TAB outside code = a "\t…" LaTeX command eaten by a shell
    if (ctl) E(Ls.id, lang, "control character in the text (a backslash eaten by a script?)");
    if (/<script/i.test(raw)) E(Ls.id, lang, "<script> is not allowed in lessons");
    // math
    const { math, prose } = segments(raw.replace(/^---[\s\S]*?\n---\n/, ""));
    for (const m of math) {
      const err = texError(m.tex, m.display);
      if (err) E(Ls.id, lang, `KaTeX error in "${m.tex.slice(0, 70)}": ${err}`);
      if (/(?<!\\)%/.test(m.tex)) E(Ls.id, lang, `unescaped % in formula (write \\%): ${m.tex.slice(0, 60)}`);
      if (/[²³¹⁰⁴-⁹ⁿ₀-₉]/.test(m.tex)) E(Ls.id, lang, `Unicode super/subscript inside a formula — use ^{…} / _{…}: ${m.tex.slice(0, 60)}`);
      if (!m.display && m.tex.length > 140) W(Ls.id, lang, `very long inline formula — consider a $$ display block: ${m.tex.slice(0, 60)}…`);
    }
    // "$" rule: money is $<digit>; math is \( \) or $$ … $$. Flag $x$, $\sigma$ … outside math.
    for (const m of prose.matchAll(/\$(?![\d\s,.(−-])[^\n]{0,40}/g)) E(Ls.id, lang, `"$" not followed by a number outside math — inline math must be \\( … \\), money is $12.50: "${m[0].slice(0, 40)}"`);
    for (const line of prose.split("\n")) {
      if (/^#\s/.test(line)) continue; // the title must match the manifest verbatim
      const L0 = line.replace(/⟦[Mm]⟧/g, " ").replace(/\[[^\]]*\]\([^)]*\)/g, " ").replace(/<[^>]+>/g, " ").replace(/https?:\/\/\S+/g, " ");
      if (/\\(frac|sqrt|sigma|Delta|Gamma|theta|times|cdot|approx|sum|int|partial|mathrm|text)\b/.test(L0)) E(Ls.id, lang, `LaTeX command outside math (missing \\( … \\)?): "${L0.trim().slice(0, 80)}"`);
      else if (/[√²³₁₂ⁿ∑∫∂]|\b[a-zA-Z]\^[\w({]|\bN\(d[12]\)|\bd[12]\s*=|σ\s*√|e\^\(?[−-]/.test(L0)) W(Ls.id, lang, `plain-text formula outside math — typeset it with \\( … \\): "${L0.trim().slice(0, 90)}"`);
    }
    if (Ls.difficulty >= 2 && math.filter((m) => m.display).length === 0 && meta.noformula !== "true") W(Ls.id, lang, "no display formula ($$…$$) — fine only if the topic really has none (set noformula: true)");
    // callouts
    const callouts = (raw.match(/^>\s*\[!(\w+)\]/gm) || []).map((x) => x.match(/\[!(\w+)\]/)[1].toUpperCase());
    const known = new Set(["KEY", "EXAMPLE", "THINK", "RECALL", "WARN", "HISTORY", "DEEP", "FACT", "KAI", "FORMULA"]);
    for (const c of callouts) if (!known.has(c)) E(Ls.id, lang, `unknown callout [!${c}]`);
    if (!short && callouts.length < 3) W(Ls.id, lang, `only ${callouts.length} callouts (aim 3–7, incl. one THINK)`);
    if (!short && !callouts.includes("THINK")) W(Ls.id, lang, "no [!THINK] pause-and-predict callout");
    // gendered pronouns for the running character
    if (lang === "en" && /\bKai\b[^.]{0,80}\b(he|she|his|her|him)\b/.test(raw)) W(Ls.id, lang, "gendered pronoun near Kai — use Kai / they");
    if (lang === "zh" && /小凯[^。]{0,40}[他她]/.test(raw)) W(Ls.id, lang, "小凯 附近出现“他/她”——用“小凯”或“对方”");
    // demos
    const demoNames = [...(meta.demo || "").split(/[,\s]+/).filter(Boolean), ...[...raw.matchAll(/^::demo\[([a-z0-9-]+)\]/gm)].map((m) => m[1])];
    if (!meta.demo) E(Ls.id, lang, "front matter has no demo: (every lesson has a main hands-on demo)");
    for (const d of demoNames) await checkDemo(d, Ls.id);
  }
  if (answerPos.length === 2 && answerPos[0] !== answerPos[1]) E(Ls.id, "zh+en", `quiz answers differ between languages (${answerPos[0]} vs ${answerPos[1]}) — keep the same questions in the same order`);
}

console.log(report.join("\n"));
console.log(`\n${targets.length} lesson(s) checked · ${errors} error(s) · ${warnings} warning(s) · formulas type-checked with KaTeX`);
process.exit(errors ? 1 : 0);
