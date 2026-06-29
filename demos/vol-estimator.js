// 交互演示：隐含波动率求解器 + HV vs IV 贵贱判定
// (a) IV 求解：拖动某期权的市场价滑块，用 impliedVol() 反解 IV 并显示。
// (b) HV vs IV：几个预设 HV 与当前 IV 对比 → "期权偏贵/偏便宜" 判定。真算。
import { bsPrice, impliedVol, greeks } from "./_bs.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // 固定一张参考期权：S=100, K=100, 30 天, r=4%, 看涨。只让“市场价”变，反解 IV。
  const base = { S: 100, K: 100, T: 30 / 365, r: 0.04, type: "call" };
  // 价格滑块范围：从略高于内在价值(=0)到一个较大的时间价值
  const priceMin = 0.6, priceMax = 6.0, priceInit = 3.02; // 3.02 ≈ IV 25%

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🔎 ${T("隐含波动率求解器 + 期权贵贱判定", "Implied-vol solver + cheap/rich gauge")}</div>

      <p class="demo-meta">${T(
        "参考期权：S=100、行权价 100、<b>30 天</b>到期、r=4% 的 ATM <b>看涨</b>。拖动它在市场上的成交价，看反解出的 IV 怎样变——价格越高，IV 越高。",
        "Reference option: S=100, strike 100, <b>30-day</b>, r=4% ATM <b>call</b>. Drag its market price and watch the implied vol back out — higher price, higher IV."
      )}</p>

      <div class="demo-block">
        <label class="demo-label">${T("市场成交价（每股）", "Market price (per share)")} = <b id="ve-p-v">3.02</b></label>
        <input class="demo-slider" id="ve-p" type="range" min="${priceMin}" max="${priceMax}" step="0.01" value="${priceInit}"/>
      </div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("反解隐含波动率 IV", "Implied vol")}</div><div class="v acc" id="ve-iv">–</div></div>
        <div class="stat"><div class="k">${T("内在价值", "Intrinsic")}</div><div class="v" id="ve-intr">–</div></div>
        <div class="stat"><div class="k">${T("时间价值", "Time value")}</div><div class="v" id="ve-tv">–</div></div>
        <div class="stat"><div class="k">Vega /1%</div><div class="v pos" id="ve-vega">–</div></div>
      </div>
      <p class="demo-meta" id="ve-solve"></p>

      <div class="section-h" style="font-size:15px;margin-top:22px">⚖️ ${T("贵还是便宜？把当前 IV 和历史波动率 HV 比", "Rich or cheap? Compare IV against historical vol")}</div>
      <p class="demo-meta">${T(
        "选一个该标的近期的<b>历史波动率（HV）</b>，和上面反解出的<b>当前 IV</b> 比较。IV 明显高于 HV → 期权<b>偏贵</b>（利于卖方）；IV 低于 HV → <b>偏便宜</b>（利于买方）。",
        "Pick the underlying's recent <b>historical vol (HV)</b> and compare with the <b>current IV</b> above. IV well above HV → options look <b>rich</b> (favors sellers); IV below HV → <b>cheap</b> (favors buyers)."
      )}</p>
      <div class="demo-seg" id="ve-hv" style="margin-bottom:10px">
        <button data-hv="14" class="on">HV 14%</button>
        <button data-hv="20">HV 20%</button>
        <button data-hv="30">HV 30%</button>
      </div>

      <div class="bar2"><div class="lab">${T("当前 IV", "Current IV")}</div><div class="track"><div class="fill" id="ve-bar-iv" style="background:var(--accent)"></div></div><div class="val" id="ve-bar-iv-v">–</div></div>
      <div class="bar2"><div class="lab">${T("历史 HV", "Historical HV")}</div><div class="track"><div class="fill" id="ve-bar-hv" style="background:var(--gold)"></div></div><div class="val" id="ve-bar-hv-v">–</div></div>

      <div class="detail" id="ve-verdict" style="margin-top:12px;text-align:center"></div>

      <p class="demo-tip">${T(
        "IV 是把市场价代入 Black-Scholes <b>反解</b>出来的，是期权真正的“价格刻度”。把它和标的实际兑现的 HV 一比，就能判断期权的相对贵贱——但记住：IV 长期略高于 HV 是<b>常态</b>（方差风险溢价，阶段 8.3），不是免费套利。",
        "IV is <b>solved</b> by inverting Black-Scholes on the market price — the real price gauge of an option. Comparing it with the underlying's realized HV tells you rich vs cheap — but note: IV sitting slightly above HV is <b>normal</b> (the variance risk premium, Stage 8.3), not a free arb."
      )}</p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  const pct = (x) => (x * 100).toFixed(1) + "%";
  const money = (v) => "$" + v.toFixed(2);
  let hv = 0.14;

  function paint() {
    const price = +$("#ve-p").value;
    $("#ve-p-v").textContent = price.toFixed(2);

    const iv = impliedVol(price, base); // 小数或 NaN
    const intrinsic = Math.max(base.S - base.K, 0); // ATM → 0
    const tv = price - intrinsic;

    $("#ve-intr").textContent = money(intrinsic);
    $("#ve-tv").textContent = money(tv);

    if (isFinite(iv)) {
      $("#ve-iv").textContent = pct(iv);
      const g = greeks({ ...base, sigma: iv });
      $("#ve-vega").textContent = g.vega.toFixed(3);
      // 验证：用反解 IV 回代 BS，应复现市场价
      const back = bsPrice({ ...base, sigma: iv });
      $("#ve-solve").innerHTML = T(
        `求解：试不同 σ 使 BS 理论价 = 市场价 ${money(price)}。命中 σ=<b>${pct(iv)}</b> 时，BS 回代价 = ${money(back)} ✓。价格全是时间价值（ATM 内在价值为 0）。`,
        `Solve: find σ so BS price = market ${money(price)}. At σ=<b>${pct(iv)}</b>, BS recomputes ${money(back)} ✓. The price is all time value (ATM intrinsic is 0).`
      );
    } else {
      $("#ve-iv").textContent = "—";
      $("#ve-vega").textContent = "—";
      $("#ve-solve").innerHTML = T(
        "市场价低于或等于内在价值，IV 无解（时间价值不可能为负）。",
        "Market price is at/below intrinsic — no IV solution (time value can't be negative)."
      );
    }
    updateVerdict(iv);
  }

  function updateVerdict(iv) {
    const ivPct = isFinite(iv) ? iv * 100 : 0;
    const hvPct = hv * 100;
    const scale = 60; // 满刻度 60% IV
    $("#ve-bar-iv").style.width = Math.min(100, ivPct / scale * 100) + "%";
    $("#ve-bar-hv").style.width = Math.min(100, hvPct / scale * 100) + "%";
    $("#ve-bar-iv-v").textContent = isFinite(iv) ? ivPct.toFixed(1) + "%" : "—";
    $("#ve-bar-hv-v").textContent = hvPct.toFixed(0) + "%";

    if (!isFinite(iv)) { $("#ve-verdict").innerHTML = ""; return; }
    const ratio = iv / hv;
    let cls, verdict, note;
    if (ratio >= 1.15) {
      cls = "pill bad"; verdict = T("期权偏贵 (IV ≫ HV)", "Options RICH (IV ≫ HV)");
      note = T("市场对未来波动的要价明显高于标的实际兑现 → 相对有利于<b>卖方</b>（卖跨式、铁鹰等）。", "Market is charging well above realized vol → favors <b>sellers</b> (short straddles, condors).");
    } else if (ratio <= 0.9) {
      cls = "pill ok"; verdict = T("期权偏便宜 (IV < HV)", "Options CHEAP (IV < HV)");
      note = T("市场要价低于标的实际兑现 → 相对有利于<b>买方</b>（买跨式、日历价差等）。", "Market is charging below realized vol → favors <b>buyers</b> (long straddles, calendars).");
    } else {
      cls = "pill acc"; verdict = T("大致公允 (IV ≈ HV)", "Roughly fair (IV ≈ HV)");
      note = T("IV 略高于 HV 属正常（方差风险溢价）；没有明显贵贱信号。", "IV slightly above HV is normal (variance risk premium); no strong edge either way.");
    }
    $("#ve-verdict").innerHTML =
      `<span class="${cls}">${verdict}</span>` +
      `<div class="dk" style="margin-top:8px">IV / HV = ${ratio.toFixed(2)}× · ${note}</div>`;
  }

  $("#ve-hv").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    hv = +b.dataset.hv / 100;
    [...$("#ve-hv").children].forEach((c) => c.classList.toggle("on", c === b));
    paint();
  });
  $("#ve-p").addEventListener("input", paint);
  paint();
}
