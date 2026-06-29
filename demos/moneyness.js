// 交互演示：钱在哪 —— 拖动现价，看 看涨/看跌 各自的 实值/平值/虚值 与内在价值
// 固定行权价 K=100，滑块拖动现价 S(70–130)。两行（看涨、看跌）各显示一个 .pill 状态
// 和一根 .bar2 内在价值条。|S−K|<1 视为平值。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const K = 100;
  const SREF = 30;   // 内在价值条满刻度参考（用于柱宽，最大约 |S−K| 上限 30）

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🎯 ${T("钱在哪 · 拖动现价看 moneyness", "Where the Money Is · Drag spot")} <span style="color:var(--muted);font-weight:400">(K=100)</span></div>

      <div class="demo-block">
        <label class="demo-label">${T("标的现价 S", "Underlying price S")} = <b id="mn-s">100</b><span style="color:var(--muted)"> &nbsp;|&nbsp; ${T("行权价", "Strike")} K = 100</span></label>
        <input class="demo-slider" id="mn-ss" type="range" min="70" max="130" step="1" value="100"/>
      </div>

      <div class="cmp" style="margin-top:6px">
        <div class="cmp-cell">
          <h5>${T("看涨 Call（按 100 买入的权利）", "Call (right to buy at 100)")}</h5>
          <div style="margin:6px 0"><span class="pill" id="mn-c-pill">–</span></div>
          <div class="bar2"><span class="lab">${T("内在价值", "Intrinsic")}</span><span class="track"><span class="fill" id="mn-c-bar" style="background:var(--green)"></span></span><span class="val" id="mn-c-iv">–</span></div>
          <div class="scn-meta" id="mn-c-note"></div>
        </div>
        <div class="cmp-cell">
          <h5>${T("看跌 Put（按 100 卖出的权利）", "Put (right to sell at 100)")}</h5>
          <div style="margin:6px 0"><span class="pill" id="mn-p-pill">–</span></div>
          <div class="bar2"><span class="lab">${T("内在价值", "Intrinsic")}</span><span class="track"><span class="fill" id="mn-p-bar" style="background:var(--green)"></span></span><span class="val" id="mn-p-iv">–</span></div>
          <div class="scn-meta" id="mn-p-note"></div>
        </div>
      </div>

      <p class="demo-tip">${T("注意<b>镜像</b>：现价<b>高于</b> 100 时看涨实值、看跌虚值；<b>低于</b> 100 时反过来。S≈100 时两者都是<b>平值</b>。实值期权的内在价值 = 那段价差；虚值内在价值为 0，价格全是时间价值（阶段 1.6）。", "Note the mirror: above 100 the call is ITM and the put OTM; below 100 it flips. Near 100 both are ATM. An ITM option's intrinsic value is that gap; OTM intrinsic is 0 — all time value (阶段 1.6).")}</p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  const ss = $("#mn-ss");

  function state(intrinsic, S) {
    if (Math.abs(S - K) < 1) return ["ATM", "acc", T("平值", "ATM")];
    if (intrinsic > 0) return ["ITM", "ok", T("实值", "ITM")];
    return ["OTM", "bad", T("虚值", "OTM")];
  }

  function row(prefix, intrinsic, S, isCall) {
    const [, cls, label] = state(intrinsic, S);
    const pill = $("#mn-" + prefix + "-pill");
    pill.className = "pill " + cls;
    pill.textContent = label;
    $("#mn-" + prefix + "-iv").textContent = "$" + intrinsic.toFixed(0);
    $("#mn-" + prefix + "-bar").style.width = Math.min(100, intrinsic / SREF * 100).toFixed(0) + "%";
    const note = intrinsic > 0
      ? T(`内在价值 = max(${isCall ? "S−K" : "K−S"},0) = <b>${intrinsic.toFixed(0)}</b>`, `Intrinsic = max(${isCall ? "S−K" : "K−S"},0) = <b>${intrinsic.toFixed(0)}</b>`)
      : (Math.abs(S - K) < 1
        ? T("正卡在分界线上——时间价值最厚（阶段 5.3）", "Right on the line — most time value (阶段 5.3)")
        : T("无内在价值，价格全是时间价值", "No intrinsic value — all time value"));
    $("#mn-" + prefix + "-note").innerHTML = note;
  }

  function paint() {
    const S = +ss.value;
    $("#mn-s").textContent = S;
    const callIV = Math.max(S - K, 0);
    const putIV = Math.max(K - S, 0);
    row("c", callIV, S, true);
    row("p", putIV, S, false);
  }
  ss.addEventListener("input", paint);
  paint();
}
