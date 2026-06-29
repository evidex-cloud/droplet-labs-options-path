// 交互演示：二叉树定价 + 逆向归纳（SVG 树）
// 输入 S0/u/d/r/K/步数(1-3)/看涨看跌；算风险中性概率 p，逐节点回报，向后归纳到根=期权价。
// 节点画成 SVG：上行股价、下行期权价。步数加大时与 Black-Scholes(CRR 标定)对比，看收敛。真算。
import { bsPrice } from "./_bs.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🌳 ${T("二叉树定价：逆向归纳，从到期倒推回今天", "Binomial pricing: backward induction from expiry to today")}</div>

      <div class="demo-row" style="margin-bottom:4px">
        <div class="demo-seg" id="bt-seg">
          <button data-t="call" class="on">${T("看涨 Call", "Call")}</button>
          <button data-t="put">${T("看跌 Put", "Put")}</button>
        </div>
        <div class="demo-seg" id="bt-steps">
          <button data-n="1">${T("1 步", "1 step")}</button>
          <button data-n="2" class="on">${T("2 步", "2 steps")}</button>
          <button data-n="3">${T("3 步", "3 steps")}</button>
        </div>
      </div>

      <div class="demo-grid-3">
        <div class="demo-block"><label class="demo-label">S₀ = <b id="bt-s-v">100</b></label><input class="demo-slider" id="bt-s" type="range" min="60" max="140" step="1" value="100"/></div>
        <div class="demo-block"><label class="demo-label">${T("行权价 K", "Strike K")} = <b id="bt-k-v">100</b></label><input class="demo-slider" id="bt-k" type="range" min="60" max="140" step="1" value="100"/></div>
        <div class="demo-block"><label class="demo-label">u = <b id="bt-u-v">1.20</b></label><input class="demo-slider" id="bt-u" type="range" min="1.05" max="1.5" step="0.01" value="1.2"/></div>
        <div class="demo-block"><label class="demo-label">d = <b id="bt-d-v">0.80</b></label><input class="demo-slider" id="bt-d" type="range" min="0.55" max="0.97" step="0.01" value="0.8"/></div>
        <div class="demo-block"><label class="demo-label">${T("利率 r", "Rate r")} = <b id="bt-r-v">5.0</b>%</label><input class="demo-slider" id="bt-r" type="range" min="0" max="8" step="0.5" value="5"/></div>
        <div class="demo-block"><label class="demo-label">${T("总期限 T (年)", "Total T (yr)")} = <b id="bt-tt-v">1.0</b></label><input class="demo-slider" id="bt-tt" type="range" min="0.25" max="2" step="0.25" value="1"/></div>
      </div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("风险中性概率 p", "Risk-neutral p")}</div><div class="v acc" id="bt-p">–</div></div>
        <div class="stat"><div class="k">${T("期权理论价", "Option value")}</div><div class="v acc" id="bt-val">–</div></div>
        <div class="stat"><div class="k">${T("每步 Δt", "Step Δt")}</div><div class="v" id="bt-dt">–</div></div>
      </div>

      <div class="payoff" id="bt-tree" style="margin-top:14px"></div>
      <p class="demo-meta" id="bt-conv"></p>

      <p class="demo-tip">${T("每个节点上行是股价、下行是<b>该处期权价</b>。末端(最右)期权价=到期回报；往左每个节点 = e^(−rΔt)·[p·上子 + (1−p)·下子]，逐层倒推到根=今天的价。p = (e^(rΔt)−d)/(u−d)，<b>不是真实涨概率</b>。把步数从 1 加到 3，价格逐步向 Black-Scholes 收敛(下方对比)。", "At each node the top is the stock price, the bottom is the <b>option value there</b>. Terminal (right) values are the expiry payoff; each node to the left = e^(−rΔt)·[p·up-child + (1−p)·down-child], rolled back to the root = today's price. p = (e^(rΔt)−d)/(u−d), <b>not the real up-probability</b>. Raise the steps 1→3 and watch it converge toward Black-Scholes (compared below).")}</p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  const els = { s: $("#bt-s"), k: $("#bt-k"), u: $("#bt-u"), d: $("#bt-d"), r: $("#bt-r"), tt: $("#bt-tt") };
  let type = "call", steps = 2;
  const m = (v) => "$" + v.toFixed(2);

  // 通用二叉树定价：返回 {p, price, stock[], opt[]} （stock/opt 按层存：层 s 有 s+1 个节点，i=向下次数）
  function priceTree(S0, K, u, d, r, dt, N, type) {
    const grow = Math.exp(r * dt), disc = Math.exp(-r * dt);
    const p = (grow - d) / (u - d);
    const stock = [], opt = [];
    for (let s = 0; s <= N; s++) {
      stock[s] = [];
      for (let i = 0; i <= s; i++) stock[s][i] = S0 * Math.pow(u, s - i) * Math.pow(d, i);
    }
    opt[N] = stock[N].map((ST) => (type === "put" ? Math.max(K - ST, 0) : Math.max(ST - K, 0)));
    for (let s = N - 1; s >= 0; s--) {
      opt[s] = [];
      for (let i = 0; i <= s; i++) opt[s][i] = disc * (p * opt[s + 1][i] + (1 - p) * opt[s + 1][i + 1]);
    }
    return { p, price: opt[0][0], stock, opt };
  }

  function paint() {
    const S0 = +els.s.value, K = +els.k.value;
    let u = +els.u.value, d = +els.d.value;
    const r = +els.r.value / 100, Ttot = +els.tt.value;
    const dt = Ttot / steps;

    $("#bt-s-v").textContent = S0;
    $("#bt-k-v").textContent = K;
    $("#bt-u-v").textContent = u.toFixed(2);
    $("#bt-d-v").textContent = d.toFixed(2);
    $("#bt-r-v").textContent = (r * 100).toFixed(1);
    $("#bt-tt-v").textContent = Ttot.toFixed(2);

    const res = priceTree(S0, K, u, d, r, dt, steps, type);
    $("#bt-p").textContent = res.p.toFixed(3);
    $("#bt-val").textContent = m(res.price);
    $("#bt-dt").textContent = dt.toFixed(3) + T(" 年", " yr");

    drawTree(res, steps);

    // 收敛对比：用 CRR(u=e^{σ√Δt}) 标定，使树的波动率与一个隐含 σ 一致，再和 BS 比。
    // 由当前 u 反推等效 σ：σ = ln(u)/√dt
    const sigma = Math.log(u) / Math.sqrt(dt);
    const bs = bsPrice({ S: S0, K, T: Ttot, r, sigma, type });
    const crr = (N) => {
      const ddt = Ttot / N, uu = Math.exp(sigma * Math.sqrt(ddt)), dd = 1 / uu;
      return priceTree(S0, K, uu, dd, r, ddt, N, type).price;
    };
    $("#bt-conv").innerHTML =
      `${T("收敛检查", "Convergence")} (CRR, σ≈${(sigma * 100).toFixed(0)}%): ` +
      `N=5 → ${m(crr(5))}, N=25 → ${m(crr(25))}, N=100 → ${m(crr(100))} ` +
      `<span class="pill acc">Black-Scholes = ${m(bs)}</span>`;
  }

  // SVG 二叉树：x 按层、y 按节点。上行股价、下行期权价。
  function drawTree(res, N) {
    const W = 580, H = 90 + N * 78;
    const mL = 44, mR = 70, mT = 30, mB = 18;
    const plotL = mL, plotR = W - mR;
    const colX = (s) => plotL + (plotR - plotL) * (N === 0 ? 0 : s / N);
    const rowY = (s, i) => {
      const span = H - mT - mB;
      if (s === 0) return mT + span / 2;
      const slots = N; // 用最大层确定行距，使树张开
      const step = span / (slots);
      const top = mT + span / 2 - (s * step) / 2;
      return top + i * step;
    };

    let edges = "", nodes = "";
    for (let s = 0; s < N; s++) {
      for (let i = 0; i <= s; i++) {
        const x1 = colX(s), y1 = rowY(s, i);
        const x2 = colX(s + 1);
        // up child = i, down child = i+1
        edges += `<line class="grid" x1="${x1}" y1="${y1}" x2="${x2}" y2="${rowY(s + 1, i)}" style="stroke:var(--accent-line)"/>`;
        edges += `<line class="grid" x1="${x1}" y1="${y1}" x2="${x2}" y2="${rowY(s + 1, i + 1)}" style="stroke:var(--accent-line)"/>`;
      }
    }
    for (let s = 0; s <= N; s++) {
      for (let i = 0; i <= s; i++) {
        const x = colX(s), y = rowY(s, i);
        const St = res.stock[s][i], Ov = res.opt[s][i];
        const term = s === N;
        nodes += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${term ? "var(--gold)" : "var(--accent)"}"/>`;
        nodes += `<text x="${x.toFixed(1)}" y="${(y - 8).toFixed(1)}" text-anchor="middle" class="lbl-axis" style="fill:var(--muted)">${St.toFixed(0)}</text>`;
        nodes += `<text x="${x.toFixed(1)}" y="${(y + 16).toFixed(1)}" text-anchor="middle" class="lbl-be" style="font-weight:700">${Ov.toFixed(2)}</text>`;
      }
    }
    // 标注
    const note = `<text x="${plotL}" y="14" class="lbl-axis" style="fill:var(--muted)">${T("上=股价   下=期权价", "top = stock   bottom = option")}</text>`;
    $("#bt-tree").innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">${edges}${nodes}${note}</svg>`;
  }

  $("#bt-seg").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    type = b.dataset.t;
    [...$("#bt-seg").children].forEach((c) => c.classList.toggle("on", c === b));
    paint();
  });
  $("#bt-steps").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    steps = +b.dataset.n;
    [...$("#bt-steps").children].forEach((c) => c.classList.toggle("on", c === b));
    paint();
  });
  Object.values(els).forEach((el) => el.addEventListener("input", paint));
  paint();
}
