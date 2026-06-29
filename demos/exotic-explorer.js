// 交互演示：奇异期权浏览器。.demo-seg [障碍 / 亚式 / 二元 / 回望]。
// 选中一种奇异期权 → 说明其回报规则 → 用一次 GBM 蒙特卡洛(50 步路径)定价 → 与普通期权对比。
// 解释为什么 障碍<普通、亚式<普通、回望>普通。用确定性 PRNG(同 monte-carlo.js)，数字可复现。真算。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const S0 = 100, K = 100, Tt = 1, r = 0.05, sigma = 0.2;
  const Bdown = 85;             // 下降敲出障碍
  const DIGI = 10;              // 二元固定赔付 $10

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function makeGauss(rng) {
    let spare = null;
    return function () {
      if (spare !== null) { const v = spare; spare = null; return v; }
      let u = 0, v = 0; while (u === 0) u = rng(); while (v === 0) v = rng();
      const mag = Math.sqrt(-2 * Math.log(u)); spare = mag * Math.sin(2 * Math.PI * v);
      return mag * Math.cos(2 * Math.PI * v);
    };
  }

  // 一次蒙特卡洛：对每条 50 步路径，同时算 vanilla / 各奇异回报；返回各自均价。
  function priceAll(N) {
    const steps = 50, dt = Tt / steps;
    const drift = (r - sigma * sigma / 2) * dt, vol = sigma * Math.sqrt(dt), disc = Math.exp(-r * Tt);
    const rng = mulberry32(20240626);
    const gauss = makeGauss(rng);
    let vanilla = 0, downout = 0, asian = 0, lookback = 0, digital = 0;
    for (let i = 0; i < N; i++) {
      let s = S0, mn = S0, mx = S0, avgsum = 0, ko = false;
      for (let t = 0; t < steps; t++) {
        s *= Math.exp(drift + vol * gauss());
        avgsum += s; if (s < mn) mn = s; if (s > mx) mx = s; if (s <= Bdown) ko = true;
      }
      const avg = avgsum / steps;
      vanilla += Math.max(s - K, 0);
      downout += ko ? 0 : Math.max(s - K, 0);
      asian += Math.max(avg - K, 0);
      lookback += Math.max(mx - K, 0);
      digital += s > K ? DIGI : 0;
    }
    return {
      vanilla: vanilla / N * disc,
      downout: downout / N * disc,
      asian: asian / N * disc,
      lookback: lookback / N * disc,
      digital: digital / N * disc,
    };
  }

  const P = priceAll(40000);

  const specs = {
    barrier: {
      label: T("障碍(下降敲出)", "Barrier (down-and-out)"),
      price: P.downout,
      rule: T(
        `<b>回报规则</b>：和普通看涨一样 max(S_T−K,0)，<b>但只要存续期内价格触碰下方障碍 B=${Bdown} 就立即作废</b>(敲出)。`,
        `<b>Payoff</b>: same as a vanilla call, max(S_T−K,0), <b>but it dies instantly if the price ever touches the lower barrier B=${Bdown}</b> (knock-out).`
      ),
      why: T(
        `<b>比普通便宜</b>：障碍砍掉了“中途跌破 ${Bdown}”的那些情形(哪怕到期本会实值)，买方放弃了这部分价值，所以权利金更低。障碍离现价越近越容易触碰、越便宜。代价：障碍附近 Delta 剧烈跳变，<b>极难对冲</b>。`,
        `<b>Cheaper than vanilla</b>: the barrier removes paths that dip below ${Bdown} (even if they'd finish ITM), so you pay less. The closer the barrier to spot, the cheaper. The catch: Delta jumps wildly near the barrier — <b>very hard to hedge</b>.`
      ),
      cheaper: true,
    },
    asian: {
      label: T("亚式(平均价)", "Asian (average)"),
      price: P.asian,
      rule: T(
        `<b>回报规则</b>：max(<b>均价</b>−K, 0)，其中均价是整条路径的平均，而非单一到期价 S_T。`,
        `<b>Payoff</b>: max(<b>average price</b> − K, 0), where the average is taken over the whole path, not the single terminal S_T.`
      ),
      why: T(
        `<b>比普通便宜不少</b>：平均会<b>熨平波动</b>，有效波动率被压低，而期权价随波动率递增(Vega 为正)，所以亚式明显更便宜(这里只有普通价的一半多)。实务最爱：企业关心的本就是一个周期的<b>平均</b>汇率/价格，且平均价<b>难被结算日操纵</b>。`,
        `<b>Notably cheaper</b>: averaging <b>smooths volatility</b>, lowering the effective vol; since option value rises with vol (positive Vega), the Asian is much cheaper (here roughly half the vanilla). Beloved in practice: firms care about an <b>average</b> rate over a period, and an average is <b>hard to manipulate</b> on settlement day.`
      ),
      cheaper: true,
    },
    digital: {
      label: T("二元(固定赔付)", "Digital (fixed payout)"),
      price: P.digital,
      isDigital: true,
      rule: T(
        `<b>回报规则</b>：一道是非题——到期若 S_T>K，赔<b>固定 $${DIGI}</b>；否则赔 0。赔付与价格涨多少<b>无关</b>(全或无)。`,
        `<b>Payoff</b>: a yes/no bet — if S_T>K at expiry, pay a <b>fixed $${DIGI}</b>; otherwise 0. The payout is <b>independent</b> of how far it rises (all-or-nothing).`
      ),
      why: T(
        `它本质是在给一个<b>概率</b>定价：价值 ≈ $${DIGI}×e^(−rT)×N(d2)(风险中性下到期实值的概率)。这里 MC 价 ≈ $${P.digital.toFixed(2)}，正与 ${DIGI}×0.951×0.56≈5.3 吻合。临界(贴着 K)、临到期时 Delta 会爆炸式跳变——对冲噩梦，零售“二元”产品多为高风险投机品。`,
        `It prices a <b>probability</b>: value ≈ $${DIGI}×e^(−rT)×N(d2) (risk-neutral chance of finishing ITM). Here MC ≈ $${P.digital.toFixed(2)}, matching ${DIGI}×0.951×0.56≈5.3. Right at K near expiry, Delta explodes — a hedging nightmare; retail 'binary' products are mostly high-risk gambling.`
      ),
      cheaper: null,
    },
    lookback: {
      label: T("回望(最优价)", "Lookback (best price)"),
      price: P.lookback,
      rule: T(
        `<b>回报规则</b>：max(<b>路径最高价 S_max</b> − K, 0)——相当于事后帮你<b>卖在全程最高点</b>(固定行权回望看涨)。`,
        `<b>Payoff</b>: max(<b>path maximum S_max</b> − K, 0) — as if it <b>sells you out at the highest price reached</b> (fixed-strike lookback call).`
      ),
      why: T(
        `<b>比普通贵得多</b>：它消除了“择时风险”，永远拿到路径上最有利的价格——这种“后悔药”价值极高(这里比普通看涨贵约 2/3)。天下没有免费的事后诸葛亮，权利金把这份特权老实收走。几乎纯路径依赖，只能靠蒙特卡洛定价。`,
        `<b>Much pricier than vanilla</b>: it removes timing risk — you always get the most favorable price on the path. This 'do-over' is very valuable (here ~2/3 above the vanilla call). No free hindsight: the premium charges for it. Almost purely path-dependent, priceable mainly by Monte Carlo.`
      ),
      cheaper: false,
    },
  };

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🧬 ${T("奇异期权浏览器：回报规则 + 蒙特卡洛定价 vs 普通期权", "Exotic explorer: payoff rules + Monte Carlo price vs vanilla")}</div>

      <div class="demo-seg" id="ex-seg" style="margin-bottom:10px">
        <button data-k="barrier" class="on">${specs.barrier.label}</button>
        <button data-k="asian">${specs.asian.label}</button>
        <button data-k="digital">${specs.digital.label}</button>
        <button data-k="lookback">${specs.lookback.label}</button>
      </div>

      <div class="detail" id="ex-rule"></div>

      <div class="bar2" style="margin-top:14px">
        <div class="lab">${T("普通看涨", "Vanilla call")}</div>
        <div class="track"><div class="fill" id="ex-bar-van" style="background:var(--muted)"></div></div>
        <div class="val" id="ex-van">–</div>
      </div>
      <div class="bar2">
        <div class="lab" id="ex-bar-lab">${T("奇异期权", "Exotic")}</div>
        <div class="track"><div class="fill" id="ex-bar-exo" style="background:var(--accent)"></div></div>
        <div class="val" id="ex-exo">–</div>
      </div>

      <div class="stat-row" style="margin-top:12px">
        <div class="stat"><div class="k">${T("奇异 MC 价", "Exotic MC price")}</div><div class="v acc" id="ex-price">–</div></div>
        <div class="stat"><div class="k">${T("普通看涨 MC 价", "Vanilla MC price")}</div><div class="v" id="ex-vanp">–</div></div>
        <div class="stat"><div class="k">${T("奇异 vs 普通", "Exotic vs vanilla")}</div><div class="v" id="ex-ratio">–</div></div>
      </div>

      <p class="demo-meta" id="ex-why" style="margin-top:10px"></p>
      <p class="demo-tip">${T(
        "四种奇异期权用<b>同一组 4 万条 GBM 路径</b>定价——主循环不变，<b>只换回报那一句</b>(取均价/查障碍/记极值/判是非)。这正是蒙特卡洛(阶段 9.1)在奇异期权里不可替代的原因：BS 公式处理不了路径依赖，而 MC 改一行就行。注意 障碍/亚式<普通、回望>普通——回报规则决定了贵贱。",
        "All four exotics are priced from the <b>same 40,000 GBM paths</b> — the main loop is unchanged, <b>only the payoff line differs</b> (average / check barrier / track extremes / yes-no). That's why Monte Carlo (Stage 9.1) is irreplaceable here: BS can't handle path dependence, MC just changes one line. Note barrier/Asian < vanilla, lookback > vanilla — the payoff rule sets the price."
      )}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  let cur = "barrier";
  const m = (v) => "$" + v.toFixed(2);

  function paint() {
    const sp = specs[cur];
    $("#ex-rule").innerHTML = sp.rule;
    $("#ex-why").innerHTML = sp.why;
    $("#ex-bar-lab").textContent = sp.label;

    const van = P.vanilla, exo = sp.price;
    const maxv = Math.max(van, exo, P.lookback); // 用回望做满刻度，便于横向比较
    $("#ex-bar-van").style.width = (van / maxv * 100).toFixed(1) + "%";
    $("#ex-bar-exo").style.width = (exo / maxv * 100).toFixed(1) + "%";
    $("#ex-van").textContent = m(van);
    $("#ex-exo").textContent = m(exo);

    $("#ex-price").textContent = m(exo);
    $("#ex-vanp").textContent = m(van);

    if (sp.isDigital) {
      $("#ex-ratio").textContent = T("固定赔付", "fixed payout");
      $("#ex-ratio").className = "v acc";
    } else {
      const pct = (exo / van - 1) * 100;
      $("#ex-ratio").textContent = (pct >= 0 ? "+" : "") + pct.toFixed(0) + "%";
      $("#ex-ratio").className = "v " + (sp.cheaper ? "neg" : "pos");
    }
  }

  $("#ex-seg").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    cur = b.dataset.k;
    [...$("#ex-seg").children].forEach((c) => c.classList.toggle("on", c === b));
    paint();
  });
  paint();
}
