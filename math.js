// math.js — one typesetting path for the whole course (KaTeX, vendored in vendor/katex, works offline).
// Lessons (Markdown):   inline  \( … \)        display  $$ … $$  (own paragraph; may span lines)
// Demos (JavaScript):   import { tex } from "./_opt.js";  tex(String.raw`\frac{a}{b} = ${x}`, true)
// app.js, demos/_opt.js and tools/check.mjs all import this file, so what readers see is what the checker validates.
import katex from "./vendor/katex/katex.mjs";

// Course-wide macros (usable in lessons and demos)
export const MACROS = {
  "\\N": "N",                     // standard normal CDF  N(·) (italic N, as in Hull)
  "\\E": "\\mathbb{E}",           // expectation
  "\\Q": "\\mathbb{Q}",           // risk-neutral measure
  "\\P": "\\mathbb{P}",           // real-world measure
  "\\dd": "\\,\\mathrm{d}",       // differential  \dd t
  "\\Var": "\\operatorname{Var}",
  "\\IV": "\\sigma_{\\text{imp}}",
  "\\RV": "\\sigma_{\\text{real}}",
};
const OPTS = { throwOnError: false, strict: "ignore", output: "html", trust: false };
const escHTML = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Render one LaTeX string. display = true → block formula. Never throws: on error shows the source in red.
export function tex(src, display = false) {
  try { return katex.renderToString(String(src), { ...OPTS, displayMode: display, macros: { ...MACROS } }); }
  catch { return `<code class="tex-err">${escHTML(src)}</code>`; }
}
// Strict render used by the checker: returns null if OK, else the error message.
export function texError(src, display = false) {
  try { katex.renderToString(String(src), { displayMode: display, throwOnError: true, strict: (c) => (c === "unicodeTextInMathMode" ? "error" : "ignore"), macros: { ...MACROS } }); return null; }
  catch (e) { return String(e.message || e).replace(/\s+/g, " ").slice(0, 180); }
}
