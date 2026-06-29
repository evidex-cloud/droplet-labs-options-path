// 交互演示：标的 vs 衍生品 —— 期权的价值是标的价格的“影子”
// 拖动标的价 S，看“持有股票”的价值如何 1:1 跟随 S，
// 而一张简单看涨（K=100）的到期价值如何“派生”自 S（在 K 处出现拐点）。
// 概念为主：强调衍生品没有独立价值，它的形状由本体（S）决定。

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;
  const K = 100;        // 看涨行权价
  const PREM = 5;       // 权利金（每股）

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🌓 ${T("标的 vs 衍生品 · 拖动看“影子”", "Underlying vs Derivative · Drag to see the shadow")}</div>

      <div class="demo-block">
        <label class="demo-label">${T("标的价格 S（本体）", "Underlying price S (the body)")} = <b id="sd-s">100</b></label>
        <input class="demo-slider" id="sd-ss" type="range" min="50" max="150" step="1" value="100"/>
      </div>

      <div class="bar2">
        <div class="lab">${T("① 持有 100 股", "① Hold 100 shares")}</div>
        <div class="track"><div class="fill" id="sd-stockbar" style="background:var(--accent)"></div></div>
        <div class="val" id="sd-stockval">–</div>
      </div>
      <div class="bar2">
        <div class="lab">${T("② 看涨到期价值", "② Call value @ expiry")}</div>
        <div class="track"><div class="fill" id="sd-callbar" style="background:var(--gold)"></div></div>
        <div class="val" id="sd-callval">–</div>
      </div>

      <div class="detail">
        <div><span class="dk">${T("这张看涨（行权价 K=100）的到期内在价值", "This call (strike K=100) intrinsic value at expiry")}</span></div>
        <div style="margin-top:6px">max(S − K, 0) = max(<span class="num" id="sd-s2">100</span> − 100, 0) = <span class="num" id="sd-intr">0</span> ${T("元/股", "/sh")}</div>
        <div style="margin-top:6px">${T("一张合约（×100）≈", "Per contract (×100) ≈")} <span class="num" id="sd-intr100">0</span> ${T("元", "")}</div>
      </div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("股票价值(每股)", "Stock value /sh")}</div><div class="v acc" id="sd-st">–</div></div>
        <div class="stat"><div class="k">${T("看涨价值(每股)", "Call value /sh")}</div><div class="v" id="sd-cl">–</div></div>
        <div class="stat"><div class="k">${T("派生关系", "Derived as")}</div><div class="v acc" id="sd-rel" style="font-size:13px">f(S)</div></div>
      </div>

      <p class="demo-tip">${T("看出来了吗？股票价值<b>就是</b> S（一条 1:1 的直线），而看涨的价值是<b>从 S 派生</b>出来的——在行权价 100 以下永远是 0（一片“地板”），越过 100 才开始跟着 S 抬升。衍生品自己没有价格，它是<b>标的价格的影子</b>。", "See it? The stock value <b>is</b> S (a 1:1 line), while the call value is <b>derived</b> from S — flat at 0 below the strike (100), only lifting once S clears it. A derivative has no price of its own; it is a <b>shadow of the underlying</b>.")}</p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  const ss = $("#sd-ss");

  function paint() {
    const S = +ss.value;
    const intrinsic = Math.max(S - K, 0);           // 看涨到期内在价值（每股）
    const SCALE = 150;                               // 进度条满刻度（≈ S 上限）

    $("#sd-s").textContent = S;
    $("#sd-s2").textContent = S;
    $("#sd-intr").textContent = intrinsic.toFixed(0);
    $("#sd-intr100").textContent = (intrinsic * MULT).toFixed(0);

    // 对比柱：股票价值 = S；看涨到期价值 = 内在价值
    $("#sd-stockbar").style.width = Math.min(100, (S / SCALE) * 100).toFixed(1) + "%";
    $("#sd-callbar").style.width = Math.min(100, (intrinsic / SCALE) * 100).toFixed(1) + "%";
    $("#sd-stockval").textContent = "$" + S;
    $("#sd-callval").textContent = "$" + intrinsic.toFixed(0);

    $("#sd-st").textContent = "$" + S;
    const cl = $("#sd-cl");
    cl.textContent = "$" + intrinsic.toFixed(0);
    cl.className = "v " + (intrinsic > 0 ? "pos" : "");

    // 派生关系小标签
    $("#sd-rel").textContent = S > K
      ? T("S − 100", "S − 100")
      : T("= 0（地板）", "= 0 (floor)");
  }

  ss.addEventListener("input", paint);
  paint();
}
