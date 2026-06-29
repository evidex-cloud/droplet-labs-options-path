// 交互演示：美式 vs 欧式看跌的二叉树定价（CRR）。步数滑块；同一棵树跑两遍。
// 美式在每个节点取 max(立即行权, 继续持有的贴现期望)；高亮“提前行权更优(E>H)”的节点。
// 展示 美式≥欧式 与 美式溢价；可调利率/波动率看溢价变化。真算。
import { bsPrice } from "./_bs.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🌲 ${T("美式 vs 欧式看跌：每个节点 max(立即行权, 继续持有)", "American vs European put: max(exercise, hold) at every node")}</div>

      <div class="demo-grid-3">
        <div class="demo-block"><label class="demo-label">S₀ = <b id="ab-s-v">100</b></label><input class="demo-slider" id="ab-s" type="range" min="70" max="130" step="1" value="100"/></div>
        <div class="demo-block"><label class="demo-label">${T("行权价 K", "Strike K")} = <b id="ab-k-v">100</b></label><input class="demo-slider" id="ab-k" type="range" min="70" max="130" step="1" value="100"/></div>
        <div class="demo-block"><label class="demo-label">${T("利率 r", "Rate r")} = <b id="ab-r-v">5.0</b>%</label><input class="demo-slider" id="ab-r" type="range" min="0" max="10" step="0.5" value="5"/></div>
        <div class="demo-block"><label class="demo-label">${T("波动率 σ", "Vol σ")} = <b id="ab-sig-v">20</b>%</label><input class="demo-slider" id="ab-sig" type="range" min="10" max="50" step="1" value="20"/></div>
        <div class="demo-block"><label class="demo-label">${T("到期 T (年)", "Expiry T (yr)")} = <b id="ab-tt-v">1.0</b></label><input class="demo-slider" id="ab-tt" type="range" min="0.25" max="2" step="0.25" value="1"/></div>
        <div class="demo-block"><label class="demo-label">${T("二叉树步数(画图)", "Tree steps (drawn)")} = <b id="ab-n-v">4</b></label><input class="demo-slider" id="ab-n" type="range" min="2" max="6" step="1" value="4"/></div>
      </div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("欧式看跌", "European put")}</div><div class="v" id="ab-euro">–</div></div>
        <div class="stat"><div class="k">${T("美式看跌", "American put")}</div><div class="v acc" id="ab-amer">–</div></div>
        <div class="stat"><div class="k">${T("美式溢价", "Early-exercise premium")}</div><div class="v pos" id="ab-prem">–</div></div>
      </div>

      <div class="payoff" id="ab-tree" style="margin-top:14px"></div>
      <p class="demo-meta" id="ab-conv"></p>

      <p class="demo-tip">${T(
        "树用步数较多(如 200)精算价格；下方画的是你选的步数那棵小树。每个节点上=股价、下=<b>美式期权价</b>；<b style='color:var(--gold)'>金色描边</b>的节点表示<b>提前行权更优(立即行权回报 > 继续持有)</b>。把<b>S₀ 拖低</b>(看跌变实值)或<b>利率拖高</b>，金色节点变多、美式溢价变大——因为看跌行权是‘收钱’，早收 K 早吃利息。看涨(无股息)几乎没有溢价，可对照阶段 9.5。",
        "The tree prices with many steps (e.g. 200); the small tree below uses your chosen step count. Each node shows stock on top, <b>American value</b> below; <b style='color:var(--gold)'>gold-outlined</b> nodes are where <b>early exercise beats holding</b>. Drag <b>S₀ lower</b> (put goes ITM) or <b>rate higher</b> and the gold nodes multiply and the premium grows — because exercising a put <b>collects K</b>, and collecting it early earns interest. A call (no dividend) shows almost no premium — compare Stage 9.5."
      )}</p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  const els = { s: $("#ab-s"), k: $("#ab-k"), r: $("#ab-r"), sig: $("#ab-sig"), tt: $("#ab-tt"), n: $("#ab-n") };
  const m = (v) => "$" + v.toFixed(2);

  // CRR 二叉树给看跌定价。american=true 时每节点取 max(行权,持有)。
  // 返回 {price, stock[][], opt[][], ex[][]}（ex 标记该节点是否提前行权更优）
  function priceTree(S0, K, r, sigma, Tt, N, american) {
    const dt = Tt / N, u = Math.exp(sigma * Math.sqrt(dt)), d = 1 / u;
    const disc = Math.exp(-r * dt), p = (Math.exp(r * dt) - d) / (u - d);
    const stock = [], opt = [], ex = [];
    for (let s = 0; s <= N; s++) {
      stock[s] = []; ex[s] = [];
      for (let i = 0; i <= s; i++) { stock[s][i] = S0 * Math.pow(u, s - i) * Math.pow(d, i); ex[s][i] = false; }
    }
    opt[N] = stock[N].map((ST) => Math.max(K - ST, 0));
    for (let s = N - 1; s >= 0; s--) {
      opt[s] = [];
      for (let i = 0; i <= s; i++) {
        const hold = disc * (p * opt[s + 1][i] + (1 - p) * opt[s + 1][i + 1]);
        if (american) {
          const intrinsic = Math.max(K - stock[s][i], 0);
          if (intrinsic > hold + 1e-9) { opt[s][i] = intrinsic; ex[s][i] = true; }
          else opt[s][i] = hold;
        } else opt[s][i] = hold;
      }
    }
    return { price: opt[0][0], stock, opt, ex };
  }

  function drawTree(res, N) {
    const W = 580, H = 90 + N * 64;
    const mL = 40, mR = 66, mT = 28, mB = 16;
    const plotL = mL, plotR = W - mR;
    const colX = (s) => plotL + (plotR - plotL) * (N === 0 ? 0 : s / N);
    const rowY = (s, i) => {
      const span = H - mT - mB, step = span / N;
      const top = mT + span / 2 - (s * step) / 2;
      return top + i * step;
    };
    let edges = "", nodes = "";
    for (let s = 0; s < N; s++) for (let i = 0; i <= s; i++) {
      const x1 = colX(s), y1 = rowY(s, i), x2 = colX(s + 1);
      edges += `<line class="grid" x1="${x1}" y1="${y1}" x2="${x2}" y2="${rowY(s + 1, i)}" style="stroke:var(--accent-line)"/>`;
      edges += `<line class="grid" x1="${x1}" y1="${y1}" x2="${x2}" y2="${rowY(s + 1, i + 1)}" style="stroke:var(--accent-line)"/>`;
    }
    for (let s = 0; s <= N; s++) for (let i = 0; i <= s; i++) {
      const x = colX(s), y = rowY(s, i), St = res.stock[s][i], Ov = res.opt[s][i], exNode = res.ex[s][i];
      const term = s === N;
      const fill = exNode ? "var(--gold)" : (term ? "var(--accent-line)" : "var(--accent)");
      const ring = exNode ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="none" stroke="var(--gold)" stroke-width="2"/>` : "";
      nodes += ring + `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${fill}"/>`;
      nodes += `<text x="${x.toFixed(1)}" y="${(y - 8).toFixed(1)}" text-anchor="middle" class="lbl-axis" style="fill:var(--muted)">${St.toFixed(0)}</text>`;
      nodes += `<text x="${x.toFixed(1)}" y="${(y + 16).toFixed(1)}" text-anchor="middle" class="lbl-be" style="font-weight:700;${exNode ? "fill:var(--gold)" : ""}">${Ov.toFixed(2)}</text>`;
    }
    const note = `<text x="${plotL}" y="14" class="lbl-axis" style="fill:var(--muted)">${T("上=股价  下=美式看跌价  ", "top=stock  bottom=American put  ")}</text>`
      + `<text x="${(plotL + 250).toFixed(1)}" y="14" class="lbl-axis" style="fill:var(--gold)">${T("● 金=提前行权更优", "● gold = early exercise optimal")}</text>`;
    $("#ab-tree").innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">${edges}${nodes}${note}</svg>`;
  }

  function paint() {
    const S0 = +els.s.value, K = +els.k.value, r = +els.r.value / 100, sigma = +els.sig.value / 100, Tt = +els.tt.value, Ndraw = +els.n.value;
    $("#ab-s-v").textContent = S0; $("#ab-k-v").textContent = K;
    $("#ab-r-v").textContent = (r * 100).toFixed(1); $("#ab-sig-v").textContent = (sigma * 100).toFixed(0);
    $("#ab-tt-v").textContent = Tt.toFixed(2); $("#ab-n-v").textContent = Ndraw;

    // 精算价用 200 步；画图用 Ndraw 步
    const euroAcc = priceTree(S0, K, r, sigma, Tt, 200, false).price;
    const amerAcc = priceTree(S0, K, r, sigma, Tt, 200, true).price;
    const prem = amerAcc - euroAcc;

    $("#ab-euro").textContent = m(euroAcc);
    $("#ab-amer").textContent = m(amerAcc);
    $("#ab-prem").textContent = "+" + prem.toFixed(2);
    $("#ab-prem").className = "v " + (prem > 0.01 ? "pos" : "");

    const drawn = priceTree(S0, K, r, sigma, Tt, Ndraw, true);
    drawTree(drawn, Ndraw);

    // 对照：同条件美式看涨(无股息)溢价≈0
    const callE = priceTree(S0, K, r, sigma, Tt, 200, false).price; // 注意这是看跌树；下面单独算看涨
    // 看涨溢价用一个临时函数
    const callTree = (american) => {
      const N = 200, dt = Tt / N, u = Math.exp(sigma * Math.sqrt(dt)), d = 1 / u, disc = Math.exp(-r * dt), p = (Math.exp(r * dt) - d) / (u - d);
      let opt = [];
      for (let i = 0; i <= N; i++) opt[i] = Math.max(S0 * Math.pow(u, N - i) * Math.pow(d, i) - K, 0);
      for (let s = N - 1; s >= 0; s--) { const nx = []; for (let i = 0; i <= s; i++) { const hold = disc * (p * opt[i] + (1 - p) * opt[i + 1]); if (american) { const intr = Math.max(S0 * Math.pow(u, s - i) * Math.pow(d, i) - K, 0); nx[i] = Math.max(hold, intr); } else nx[i] = hold; } opt = nx; }
      return opt[0];
    };
    const callPrem = callTree(true) - callTree(false);

    $("#ab-conv").innerHTML = T(
      `精算(200 步)：欧式看跌 ${m(euroAcc)}，美式看跌 ${m(amerAcc)}，<b>美式溢价 +${prem.toFixed(2)}</b>。对照同条件<b>美式看涨</b>(无股息)溢价仅 +${callPrem.toFixed(2)}≈0——看涨行权要付 K(晚付才好)，看跌行权收 K(早收才好)，利率撑起这条不对称。`,
      `Accurate (200 steps): European put ${m(euroAcc)}, American put ${m(amerAcc)}, <b>premium +${prem.toFixed(2)}</b>. For comparison the same <b>American call</b> (no dividend) has premium +${callPrem.toFixed(2)}≈0 — a call pays K on exercise (better late), a put collects K (better early); the interest rate drives this asymmetry.`
    );
  }

  Object.values(els).forEach((el) => el.addEventListener("input", paint));
  paint();
}
