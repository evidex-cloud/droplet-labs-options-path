// 交互演示：有限差分网格 —— 把 BS 的 PDE 铺在“价格×时间”网格上，从到期边界向今天逐列倒解。
// 真算：一个粗网格上的显式格式给欧式看涨定价；按“后退一列”逐步着色，演示逆向归纳；读出 V(S0,t0)。
// 颜色表示该格点期权价高低（越值钱越青）。对照 BS 真值，可调网格密度。
import { bsPrice } from "./_bs.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const K = 100, Tt = 1, r = 0.05, sigma = 0.2, S0 = 100;
  const Smax = 200;                 // 价格上界
  const BS = bsPrice({ S: S0, K, T: Tt, r, sigma, type: "call" });

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🔲 ${T("有限差分网格：从到期边界倒解 Black-Scholes PDE", "Finite-difference grid: solving the BS PDE back from expiry")}</div>

      <div class="demo-row" style="margin-bottom:6px">
        <div class="demo-seg" id="fd-grid-seg">
          <button data-m="10" class="on">${T("粗网格", "Coarse")}</button>
          <button data-m="20">${T("中网格", "Medium")}</button>
        </div>
        <div class="demo-btns" style="margin:0">
          <button class="demo-btn" id="fd-step">${T("后退一列 ◀", "Step back ◀")}</button>
          <button class="demo-btn primary" id="fd-solve">${T("一次解完", "Solve all")}</button>
          <button class="demo-btn" id="fd-reset">${T("重置", "Reset")}</button>
        </div>
      </div>

      <div class="payoff" id="fd-grid"></div>

      <div class="stat-row" style="margin-top:12px">
        <div class="stat"><div class="k">${T("已解到时刻", "Solved to time")}</div><div class="v" id="fd-tcol">–</div></div>
        <div class="stat"><div class="k">${T("网格价 V(S₀,0)", "Grid V(S₀,0)")}</div><div class="v acc" id="fd-val">–</div></div>
        <div class="stat"><div class="k">${T("BS 真值", "BS truth")}</div><div class="v" id="fd-bs">–</div></div>
      </div>

      <p class="demo-meta" id="fd-note"></p>

      <p class="demo-tip">${T(
        "最右列(到期)是已知边界：每个股价档的值=回报 max(S−K,0)(看涨)。每按一次“后退一列”，就用差分公式由右边已解的列算出左边一列——颜色越青代表期权越值钱。倒解到最左列(今天)，找到 S₀=100 那一格，<b>它就是今天的期权价</b>，和 BS 真值对得上。这正是二叉树逆向归纳的连续版(阶段 3.4)。",
        "The rightmost column (expiry) is the known boundary: each price level's value = payoff max(S−K,0) for a call. Each 'Step back' uses the difference formula to compute the next column to the left from the already-solved one — greener means more valuable. Solve to the leftmost column (today), read the S₀=100 cell: <b>that is today's option price</b>, matching BS. This is the continuous version of binomial backward induction (Stage 3.4)."
      )}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const m = (v) => "$" + v.toFixed(2);

  let M = 10;          // 价格档数（0..M）
  let N;               // 时间步数（按稳定性自适应）
  let grid;            // grid[j][i] 期权价，j 时间列(0今天..N到期)，i 价格档(0..M)
  let solvedCol;       // 已解到第几列（从 N 开始，向 0 递减）。N=只有边界，0=全解完
  let dS, dt;

  // 用稳定的显式格式建表并按列倒解；返回完整解（也用于一次解完）
  function buildGrid() {
    dS = Smax / M;
    // 显式格式稳定性：dt <= 1/(σ² M²) 量级，这里取保守值并保证整除 T
    const Nmin = Math.ceil(Tt * sigma * sigma * M * M) + 4;
    N = Math.max(Nmin, 8);
    dt = Tt / N;

    grid = [];
    for (let j = 0; j <= N; j++) grid[j] = new Array(M + 1).fill(0);

    // 到期边界（列 j=N）
    for (let i = 0; i <= M; i++) grid[N][i] = Math.max(i * dS - K, 0);
    solvedCol = N; // 仅边界已知
  }

  // 由列 j+1 解出列 j（显式：V_j[i] = a·V_{j+1}[i-1] + b·V_{j+1}[i] + c·V_{j+1}[i+1]）
  function solveColumn(j) {
    const next = grid[j + 1];
    const col = grid[j];
    // 上下边界（看涨）：S=0 → 0；S=Smax → Smax − K·e^{-r·(剩余)}
    col[0] = 0;
    const tau = (N - j) * dt;
    col[M] = Smax - K * Math.exp(-r * tau);
    for (let i = 1; i < M; i++) {
      const a = 0.5 * dt * (sigma * sigma * i * i - r * i);
      const b = 1 - dt * (sigma * sigma * i * i + r);
      const c = 0.5 * dt * (sigma * sigma * i * i + r * i);
      col[i] = a * next[i - 1] + b * next[i] + c * next[i + 1];
    }
  }

  function stepBack() {
    if (solvedCol <= 0) return;
    solveColumn(solvedCol - 1);
    solvedCol--;
    paint();
  }
  function solveAll() {
    while (solvedCol > 0) solveColumn(solvedCol - 1), solvedCol--;
    paint();
  }

  // 把 S0 处的网格价插值出来（列 0）
  function valueAtSpot() {
    const x = S0 / dS;
    const i0 = Math.floor(x), frac = x - i0;
    const col = grid[0];
    if (i0 >= M) return col[M];
    return col[i0] * (1 - frac) + col[i0 + 1] * frac;
  }

  // 颜色：按期权价占当前最大值的比例，从透明到青
  function cellColor(v, vmax, solved) {
    if (!solved) return "var(--surface-2)";
    const t = vmax > 0 ? Math.min(1, v / vmax) : 0;
    const alpha = (0.12 + 0.78 * t).toFixed(2);
    return `rgba(13,148,136,${alpha})`;
  }

  function drawGrid() {
    // 为了可读，列方向最多画 ~14 列：若 N 大，则抽样画列（但计算仍是全列）
    const maxCols = 14;
    const colStride = Math.max(1, Math.ceil(N / maxCols));
    const shownCols = [];
    for (let j = 0; j <= N; j += colStride) shownCols.push(j);
    if (shownCols[shownCols.length - 1] !== N) shownCols.push(N);

    const W = 580, H = 300;
    const mL = 40, mR = 64, mT = 16, mB = 26;
    const plotL = mL, plotR = W - mR, plotT = mT, plotB = H - mB;
    const cols = shownCols.length;
    const cw = (plotR - plotL) / cols;
    const ch = (plotB - plotT) / (M + 1);

    // 当前已解列里期权价的最大值（用于配色比例）
    let vmax = 0;
    for (let j = solvedCol; j <= N; j++) for (let i = 0; i <= M; i++) if (grid[j][i] > vmax) vmax = grid[j][i];

    let rects = "";
    for (let c = 0; c < cols; c++) {
      const j = shownCols[c];
      const solved = j >= solvedCol;
      for (let i = 0; i <= M; i++) {
        const x = plotL + c * cw;
        const y = plotB - (i + 1) * ch;   // i=0(低价)在下，i=M(高价)在上
        const v = grid[j][i];
        rects += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(cw - 1).toFixed(1)}" height="${(ch - 1).toFixed(1)}" `
          + `fill="${cellColor(v, vmax, solved)}" stroke="var(--line-soft)" stroke-width="0.5"/>`;
      }
    }

    // 标注：到期列、今天列、S0 行、K 行
    let labels = "";
    // 列标签：今天 / 到期
    labels += `<text class="lbl-axis" x="${plotL.toFixed(1)}" y="${(plotB + 16).toFixed(1)}" text-anchor="start">${T("今天 t=0", "today t=0")}</text>`;
    labels += `<text class="lbl-axis" x="${plotR.toFixed(1)}" y="${(plotB + 16).toFixed(1)}" text-anchor="end">${T("到期 T", "expiry T")}</text>`;
    // 行标签：S0、K、Smax、0（在右侧）
    const rowY = (i) => plotB - (i + 0.5) * ch;
    const iS0 = Math.round(S0 / dS), iK = Math.round(K / dS);
    labels += `<text class="lbl-axis" x="${(plotR + 6).toFixed(1)}" y="${(rowY(M) + 3).toFixed(1)}" text-anchor="start">S=${Smax}</text>`;
    labels += `<text class="lbl-axis" x="${(plotR + 6).toFixed(1)}" y="${(rowY(iS0) + 3).toFixed(1)}" text-anchor="start" style="fill:var(--accent-ink);font-weight:700">S₀=${S0}</text>`;
    labels += `<text class="lbl-axis" x="${(plotR + 6).toFixed(1)}" y="${(rowY(iK) + 3).toFixed(1)}" text-anchor="start" style="fill:var(--gold)">K=${K}</text>`;
    labels += `<text class="lbl-axis" x="${(plotR + 6).toFixed(1)}" y="${(rowY(0) + 3).toFixed(1)}" text-anchor="start">S=0</text>`;

    // 高亮今天那一列的 S0 格（若已解）
    let hi = "";
    if (solvedCol === 0) {
      const x = plotL + 0 * cw;
      const y = plotB - (iS0 + 1) * ch;
      hi = `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(cw - 1).toFixed(1)}" height="${(ch - 1).toFixed(1)}" fill="none" stroke="var(--accent)" stroke-width="2.5"/>`;
    }
    // 标出到期边界列箭头
    const dir = `<text class="lbl-axis" x="${((plotL + plotR) / 2).toFixed(1)}" y="${(plotT - 2).toFixed(1)}" text-anchor="middle" style="fill:var(--muted)">${T("◀ 倒解方向（从到期回到今天）", "◀ solve direction (expiry → today)")}</text>`;

    $("#fd-grid").innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">${rects}${hi}${labels}${dir}</svg>`;
  }

  function paint() {
    drawGrid();
    const colsLeft = solvedCol;
    const tau = solvedCol * dt;
    $("#fd-tcol").textContent = solvedCol >= N ? T("仅边界", "boundary") : "t=" + (tau).toFixed(2);
    $("#fd-bs").textContent = m(BS);

    if (solvedCol === 0) {
      const v = valueAtSpot();
      $("#fd-val").textContent = m(v);
      const err = v - BS;
      $("#fd-note").innerHTML = T(
        `全网格解完。今天 S₀=${S0} 处的网格价 <b>${m(v)}</b>，BS 真值 ${m(BS)}，差 <b>${(err >= 0 ? "+" : "") + err.toFixed(2)}</b>(粗网格的离散误差，加密网格会更准)。注意：相邻格点相减即可直接读出 Delta、Gamma——网格法白送全套希腊字母。`,
        `Grid fully solved. Value at today's S₀=${S0} is <b>${m(v)}</b> vs BS ${m(BS)}, off by <b>${(err >= 0 ? "+" : "") + err.toFixed(2)}</b> (coarse-grid discretization error; a finer grid is more accurate). Note: subtracting adjacent cells reads off Delta and Gamma directly — the grid hands you the Greeks for free.`
      );
    } else {
      $("#fd-val").textContent = "–";
      $("#fd-note").innerHTML = T(
        `还剩 <b>${colsLeft}</b> 列要倒解。已知的最右列是到期回报，正在用差分公式 V_j[i]=a·V_{j+1}[i−1]+b·V_{j+1}[i]+c·V_{j+1}[i+1] 一列列往今天推。继续点“后退一列”，或“一次解完”。`,
        `<b>${colsLeft}</b> columns left to solve. The known rightmost column is the expiry payoff; we march left with V_j[i]=a·V_{j+1}[i−1]+b·V_{j+1}[i]+c·V_{j+1}[i+1]. Keep clicking 'Step back', or 'Solve all'.`
      );
    }
  }

  function reset() { buildGrid(); paint(); }

  $("#fd-grid-seg").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    M = +b.dataset.m;
    [...$("#fd-grid-seg").children].forEach((c) => c.classList.toggle("on", c === b));
    reset();
  });
  $("#fd-step").addEventListener("click", stepBack);
  $("#fd-solve").addEventListener("click", solveAll);
  $("#fd-reset").addEventListener("click", reset);

  reset();
}
