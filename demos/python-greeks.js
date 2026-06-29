// 交互演示：Python BS+希腊字母代码（.term 深色块）+ 下方滑块跑“同一套数学”(via ./_bs.js)，
// 显示这段 Python 会 print 出来的“输出”。代码与实时数字一一对应。.stat-row 展示 price+greeks。
import { greeks } from "./_bs.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // 初值（与课文/验证脚本一致）：S=K=100, IV=25%, 30 天, r=4%, call
  let S = 100, K = 100, ivPct = 25, days = 30, kind = "call";
  const R = 0.04;

  // —— .term 里的 Python 代码（用 spans 上色；注意 < 用 &lt; 转义）——
  function codeBlock() {
    const L = [
      '<span class="com"># Black-Scholes 价格 + 希腊字母（交易口径）</span>',
      '<span class="kw">import</span> numpy <span class="kw">as</span> np',
      '<span class="kw">from</span> scipy.stats <span class="kw">import</span> norm   <span class="com"># norm.cdf=N(·), norm.pdf=N\'(·)</span>',
      '',
      '<span class="kw">def</span> <span class="cmd">greeks</span>(S, K, T, r, sigma, kind=<span class="num">"call"</span>):',
      '    d1 = (np.log(S/K) + (r + sigma**<span class="num">2</span>/<span class="num">2</span>)*T) / (sigma*np.sqrt(T))',
      '    d2 = d1 - sigma*np.sqrt(T)',
      '    pdf = norm.pdf(d1)',
      '    <span class="kw">if</span> kind == <span class="num">"call"</span>:',
      '        price = S*norm.cdf(d1) - K*np.exp(-r*T)*norm.cdf(d2)',
      '        delta = norm.cdf(d1)',
      '        theta = (-S*pdf*sigma/(<span class="num">2</span>*np.sqrt(T))',
      '                 - r*K*np.exp(-r*T)*norm.cdf(d2))',
      '        rho   = K*T*np.exp(-r*T)*norm.cdf(d2)',
      '    <span class="kw">else</span>:',
      '        price = K*np.exp(-r*T)*norm.cdf(-d2) - S*norm.cdf(-d1)',
      '        delta = norm.cdf(d1) - <span class="num">1</span>',
      '        theta = (-S*pdf*sigma/(<span class="num">2</span>*np.sqrt(T))',
      '                 + r*K*np.exp(-r*T)*norm.cdf(-d2))',
      '        rho   = -K*T*np.exp(-r*T)*norm.cdf(-d2)',
      '    gamma = pdf / (S*sigma*np.sqrt(T))     <span class="com"># 看涨看跌相同</span>',
      '    vega  = S*pdf*np.sqrt(T)',
      '    <span class="kw">return</span> <span class="cmd">dict</span>(price=price, delta=delta, gamma=gamma,',
      '                theta=theta/<span class="num">365</span>, vega=vega/<span class="num">100</span>, rho=rho/<span class="num">100</span>)',
      '',
      '<span class="com"># 验收对数：经典基准应得 10.45（阶段 11.3）</span>',
      '<span class="kw">assert</span> <span class="cmd">abs</span>(greeks(<span class="num">100</span>,<span class="num">100</span>,<span class="num">1</span>,<span class="num">0.05</span>,<span class="num">0.2</span>)[<span class="num">"price"</span>] - <span class="num">10.45</span>) &lt; <span class="num">0.01</span>',
    ];
    return `<div class="term" id="pg-code">${L.join("\n")}</div>`;
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🐍 ${T("Python 定价 + 希腊字母：代码与实时数字同源", "Python pricing + Greeks: code and live numbers, one source")}</div>

      ${codeBlock()}

      <div class="demo-meta" style="margin:12px 0 4px">${T("拖动滑块 → 下面跑的是<b>同一套数学</b>（via ./_bs.js），相当于这段 Python 的 print 输出：",
        "Drag the sliders → the block below runs the <b>same math</b> (via ./_bs.js) — i.e. what this Python would print:")}</div>

      <div class="demo-grid">
        <div class="demo-block" style="margin:6px 0">
          <label class="demo-label">S (${T("标的价", "spot")}) = <b id="pg-Sv">${S}</b></label>
          <input class="demo-slider" id="pg-S" type="range" min="60" max="140" step="1" value="${S}"/>
        </div>
        <div class="demo-block" style="margin:6px 0">
          <label class="demo-label">K (${T("行权价", "strike")}) = <b id="pg-Kv">${K}</b></label>
          <input class="demo-slider" id="pg-K" type="range" min="70" max="130" step="1" value="${K}"/>
        </div>
        <div class="demo-block" style="margin:6px 0">
          <label class="demo-label">σ (IV) = <b id="pg-ivv">${ivPct}</b>%</label>
          <input class="demo-slider" id="pg-iv" type="range" min="5" max="80" step="1" value="${ivPct}"/>
        </div>
        <div class="demo-block" style="margin:6px 0">
          <label class="demo-label">${T("到期", "days to expiry")} = <b id="pg-dv">${days}</b> ${T("天", "d")}</label>
          <input class="demo-slider" id="pg-d" type="range" min="1" max="365" step="1" value="${days}"/>
        </div>
      </div>

      <div class="demo-seg" id="pg-kind" style="margin:4px 0 2px">
        <button data-k="call" class="on">${T("看涨 Call", "Call")}</button>
        <button data-k="put">${T("看跌 Put", "Put")}</button>
      </div>

      <div class="demo-out" id="pg-print" style="margin-top:10px"></div>

      <div class="stat-row" id="pg-stats"></div>

      <p class="demo-tip">${T(
        "上面的 Python 和下面的实时数字跑的是<b>完全相同</b>的 Black-Scholes 公式——所以你拖出的每个价格/希腊字母，就是这段代码 print 出来的结果。把参数拖回 S=K=100、σ=20%、365 天，price 应 ≈ <b>10.45</b>（经典对数锚，阶段 11.3）。",
        "The Python above and the live numbers below run the <b>identical</b> Black-Scholes formula — so every price/Greek you drag out is what this code would print. Drag back to S=K=100, σ=20%, 365 days and price ≈ <b>10.45</b> (the classic check, Stage 11.3)."
      )}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const f = (x, n) => Number(x).toFixed(n);

  function paint() {
    const T_ = days / 365;
    const g = greeks({ S, K, T: T_, r: R, sigma: ivPct / 100, type: kind });

    // 模拟 Python 的 print(greeks(...))
    $("#pg-print").innerHTML =
      `<span class="dim">&gt;&gt;&gt; greeks(${S}, ${K}, ${f(T_, 4)}, ${R}, ${f(ivPct / 100, 2)}, "${kind}")</span>\n` +
      `{'price': ${f(g.price, 4)}, 'delta': ${f(g.delta, 4)}, 'gamma': ${f(g.gamma, 4)},\n` +
      ` 'theta': ${f(g.theta, 4)}, 'vega': ${f(g.vega, 4)}, 'rho': ${f(g.rho, 4)}}`;

    const sgn = (v) => (v > 0 ? "pos" : v < 0 ? "neg" : "");
    $("#pg-stats").innerHTML = `
      <div class="stat"><div class="k">price</div><div class="v acc">${f(g.price, 2)}</div></div>
      <div class="stat"><div class="k">Δ delta</div><div class="v ${sgn(g.delta)}">${f(g.delta, 3)}</div></div>
      <div class="stat"><div class="k">Γ gamma</div><div class="v">${f(g.gamma, 4)}</div></div>
      <div class="stat"><div class="k">Θ theta/${T("天", "d")}</div><div class="v ${sgn(g.theta)}">${f(g.theta, 3)}</div></div>
      <div class="stat"><div class="k">ν vega/1%</div><div class="v ${sgn(g.vega)}">${f(g.vega, 3)}</div></div>
      <div class="stat"><div class="k">ρ rho/1%</div><div class="v ${sgn(g.rho)}">${f(g.rho, 3)}</div></div>`;
  }

  // 绑定滑块
  const bind = (id, setter, labId, suffix = "") => {
    const el = $(id);
    el.addEventListener("input", () => {
      setter(+el.value);
      $(labId).textContent = el.value + suffix;
      paint();
    });
  };
  bind("#pg-S", (v) => (S = v), "#pg-Sv");
  bind("#pg-K", (v) => (K = v), "#pg-Kv");
  bind("#pg-iv", (v) => (ivPct = v), "#pg-ivv");
  bind("#pg-d", (v) => (days = v), "#pg-dv");

  $("#pg-kind").querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", () => {
      $("#pg-kind").querySelectorAll("button").forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
      kind = b.dataset.k;
      paint();
    });
  });

  paint();
}
