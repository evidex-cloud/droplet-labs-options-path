// Headless demo smoke test: mounts demos into a fake DOM (linkedom) in both languages and clicks every button once.
//   NODE_MODULES=<dir containing linkedom> node tools/smoke.mjs [demo-name …]     (no names = every demos/*.js not starting with "_")
// Catches: import errors, exceptions in mount(), exceptions in click/input handlers, leftover "undefined"/"NaN" in the output.
// It cannot judge layout — the lead editor still checks every page in a real browser.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NM = process.env.NODE_MODULES || "C:/Users/ysh85/AppData/Local/Temp/claude/C--claude-projects/56dfcc34-808b-454a-b570-9170cf970bcf/scratchpad/node_modules";
const { parseHTML } = await import(pathToFileURL(path.join(NM, "linkedom/esm/index.js")).href);

const { window, document } = parseHTML("<!doctype html><html><head></head><body><main id='app'></main></body></html>");
globalThis.window = window; globalThis.document = document;
try { Object.defineProperty(document, "compatMode", { value: "CSS1Compat" }); } catch { /* */ }
for (const k of ["HTMLElement", "Node", "NodeFilter", "Event", "CustomEvent", "getComputedStyle"]) if (window[k] && !globalThis[k]) globalThis[k] = window[k];

globalThis.requestAnimationFrame = (f) => setTimeout(() => f(performance.now()), 16);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
window.requestAnimationFrame = globalThis.requestAnimationFrame;
window.matchMedia = () => ({ matches: false, addEventListener() {} });
globalThis.matchMedia = window.matchMedia;
if (!globalThis.localStorage) globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };

const names = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs.readdirSync(path.join(ROOT, "demos")).filter((f) => f.endsWith(".js") && !f.startsWith("_")).map((f) => f.slice(0, -3));

let bad = 0;
const errors = [];
process.on("unhandledRejection", (e) => errors.push("unhandled rejection: " + (e && e.message || e)));
process.on("uncaughtException", (e) => errors.push("uncaught: " + (e && e.message || e)));

for (const name of names) {
  for (const lang of ["zh", "en"]) {
    errors.length = 0;
    const root = document.createElement("div");
    document.getElementById("app").appendChild(root);
    try {
      const mod = await import(pathToFileURL(path.join(ROOT, "demos", name + ".js")).href);
      // linkedom doesn't reflect the `checked` attribute into the property; demos read .checked, so sync it first
      await mod.default(root, lang);
      for (const cb of root.querySelectorAll("input[type=checkbox][checked], input[type=radio][checked]")) cb.checked = true;
      await new Promise((r) => setTimeout(r, 30));
      const clickables = [...root.querySelectorAll("button, [data-v], input[type=checkbox]")].slice(0, 40);
      for (const el of clickables) {
        if (!root.contains(el)) continue; // removed by an earlier click (e.g. tab switch)
        try { if (el.type === "checkbox" || el.type === "radio") { el.checked = !el.checked; el.dispatchEvent(new window.Event("change", { bubbles: true })); el.dispatchEvent(new window.Event("input", { bubbles: true })); } el.dispatchEvent(new window.Event("click", { bubbles: true })); } catch (e) { errors.push("click: " + e.message); }
        await new Promise((r) => setTimeout(r, 5));
      }
      for (const el of [...root.querySelectorAll("input, select, textarea")].slice(0, 40)) {
        try { el.dispatchEvent(new window.Event("input", { bubbles: true })); el.dispatchEvent(new window.Event("change", { bubbles: true })); } catch (e) { errors.push("input: " + e.message); }
      }
      await new Promise((r) => setTimeout(r, 400));
      const text = root.textContent || "";
      if (/\bundefined\b|\bNaN\b|\[object Object\]/.test(text)) errors.push(`rendered text contains undefined/NaN/[object Object]: “…${text.match(/.{0,40}(undefined|NaN|\[object Object\]).{0,40}/)[0]}…”`);
      if (!root.querySelector(".demo-tip")) errors.push("no .demo-tip rendered");
      const kerr = root.querySelector(".katex-error, .tex-err");
      if (kerr) errors.push("KaTeX failed to render a formula (after interaction): " + (kerr.getAttribute("title") || kerr.textContent || "").slice(0, 120));
      if (lang === "en" && /[\u4e00-\u9fff]/.test(text)) errors.push("English mount shows Chinese text: “" + text.match(/.{0,20}[\u4e00-\u9fff]+.{0,20}/)[0] + "”");
    } catch (e) {
      errors.push("mount threw: " + (e && e.stack ? e.stack.split("\n").slice(0, 3).join(" | ") : e));
    }
    root.remove();
    if (errors.length) { bad++; console.log(`✗ ${name} [${lang}]\n   - ${[...new Set(errors)].join("\n   - ")}`); }
    else console.log(`✓ ${name} [${lang}]`);
  }
}
console.log(`\n${names.length} demo(s) · ${bad} failing mount(s)`);
process.exit(bad ? 1 : 0);
