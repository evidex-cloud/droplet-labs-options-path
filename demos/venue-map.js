// Q1 2026 CoinGlass 快照卡片。不是实时行情。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const cards = [
    {
      t: T("全市场衍生品 vs 现货", "All-exchange derivatives vs spot"),
      b: T("衍生品成交约 $18.6T；现货约 $1.94T。", "Derivatives volume ~$18.6T; spot ~$1.94T."),
      s: "CoinGlass Q1 2026 · secondary aggregator",
    },
    {
      t: T("Binance 衍生品", "Binance derivatives"),
      b: T("约 $4.9T，约占头部十家的 35%。CEX 仍主导成交。", "~$4.9T, ~35% of a top-10 slice. CEXs still dominate volume."),
      s: "CoinGlass Q1 2026",
    },
    {
      t: T("Hyperliquid", "Hyperliquid"),
      b: T("Q1 成交约 $492.7B，平均 OI 约 $6.0B，进入头部十家。链上订单簿，是 2026 的真实竞争者，不是玩具。不是“取代了 Binance”。", "Q1 volume ~$492.7B, avg OI ~$6.0B, entered a top-10 list. On-chain CLOB — a real 2026 competitor, not a toy. Not “replaced Binance.”"),
      s: "CoinGlass Q1 2026",
    },
    {
      t: T("份额快照（二手）", "Share snapshots (secondary)"),
      b: T("全所永续成交占比纪录 7.6%（2026-06-08，The Block/Buildix 二手）。相对 Binance 的 5 月成交比 14.4%（Gate News 二手）。HIP-3 5 月成交有报道 >$62B、当时 OI ~$3B（Gate）——早期、不确定。", "Record 7.6% of all-exchange perp volume on 2026-06-08 (The Block/Buildix, secondary). May 2026 volume vs Binance 14.4% (Gate News, secondary). HIP-3 May volume reported >$62B, OI ~$3B at time of writing (Gate) — early/uncertain."),
      s: "Secondary press · label as such",
    },
    {
      t: T("CME 到期期货", "CME dated futures"),
      b: T("受监管的比特币/以太到期期货，不是离岸永续。时钟是交割，不是资金费。", "Regulated BTC/ETH dated futures — not offshore perps. The clock is delivery, not funding."),
      s: "Product design, not a volume print",
    },
    {
      t: T("风险标签", "Risk label"),
      b: T("DEX 永续仍有预言机/标记价/验证者/桥的风险。不要写成“无对手方风险”。", "DEX perps still carry oracle / mark / validator / bridge risk. Do not write “no counterparty risk.”"),
      s: "Teaching",
    },
  ];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🗺️ ${T("场所地图 · 静态快照（截至资料日期）", "Venue map · static snapshot (as-of labeled)")}</div>
      <div class="cmp" id="vm-grid"></div>
      <p class="demo-tip">${T("这不是实时 OI/成交 feed。CoinGlass 是<b>二手聚合</b>。不要把卡片数字说成“此刻”的持仓。", "This is not a live OI/volume feed. CoinGlass is a <b>secondary aggregator</b>. Do not read the cards as “right now” open interest.")}</p>
    </div>`;

  root.querySelector("#vm-grid").innerHTML = cards.map((c) =>
    `<div class="cmp-cell"><h5>${c.t}</h5><p style="margin:0 0 8px;font-size:13.5px;line-height:1.55">${c.b}</p><div class="scn-meta">${c.s}</div></div>`
  ).join("");
}
