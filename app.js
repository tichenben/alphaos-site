const typeLabels = { early: "NEW POOL", defi: "EMERGING PROTOCOL" };
const riskLabels = { low: "较低", medium: "中等", high: "较高" };
let opportunities = [];

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
}[char]));
const formatTime = (value) => new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Shanghai", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit",
}).format(new Date(value));

function renderOpportunities(filter = "all") {
  const list = document.querySelector("#opportunity-list");
  const filtered = filter === "all" ? opportunities : opportunities.filter((item) => item.type === filter);
  if (!filtered.length) {
    list.innerHTML = '<div class="empty-state">NO MATCHING VERIFIED SIGNALS</div>';
    return;
  }
  list.innerHTML = filtered.map((item, index) => `
    <article class="opportunity-row opportunity-detail">
      <span class="rank">${String(index + 1).padStart(2, "0")}</span>
      <div class="opportunity-name">
        <h3>${escapeHtml(item.name)}<span class="type-tag">${typeLabels[item.type]}</span></h3>
        <p>${escapeHtml(item.summary)}</p>
        <ul class="evidence">${item.evidence.slice(0, 4).map((fact) => `<li>${escapeHtml(fact)}</li>`).join("")}</ul>
        <p class="risk-reason">${item.risk.reasons.map(escapeHtml).join(" · ")}</p>
      </div>
      <div class="metric"><span>CHAIN</span><strong>${escapeHtml(item.chain)}</strong></div>
      <div class="metric"><span>OBSERVED</span><strong>${formatTime(item.observedAt)}</strong></div>
      <div class="metric"><span>RISK / SCORE</span><strong class="risk-${item.risk.level}">${riskLabels[item.risk.level]} · <b class="score">${item.score}</b></strong></div>
      <a class="arrow" href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener noreferrer" aria-label="查看数据来源">↗</a>
    </article>
  `).join("");
}

function updateStatus(data) {
  document.querySelector("#signal-count").textContent = String(data.signalCount).padStart(2, "0");
  document.querySelector("#hero-score").textContent = data.marketIndex;
  document.querySelector("#updated-at").textContent = formatTime(data.generatedAt);
  document.querySelector("#data-mode").textContent = data.stale ? "STALE" : "LIVE";
  for (const chain of ["ethereum", "bsc", "solana"]) {
    const node = document.querySelector(`#status-${chain}`);
    const ok = data.chainHeads[chain]?.status === "ok";
    node.textContent = ok ? `● #${data.chainHeads[chain].height}` : "● DEGRADED";
    if (!ok) node.classList.add("risk-high");
  }
}

async function loadOpportunities() {
  try {
    const response = await fetch("./data/opportunities.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    opportunities = [...data.opportunities].sort((a, b) => b.score - a.score);
    updateStatus(data);
    renderOpportunities();
  } catch (error) {
    document.querySelector("#opportunity-list").innerHTML =
      '<div class="empty-state">LIVE DATA UNAVAILABLE — LAST UPDATE FAILED</div>';
    console.error("Failed to load opportunity data:", error);
  }
}

async function loadNews() {
  try {
    const response = await fetch("./data/news.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const items = await response.json();
    document.querySelector("#news-list").innerHTML = items.length
      ? items.map((item) => `
        <article class="news-item">
          <div><span class="type-tag">${escapeHtml(item.category)}</span><time>${formatTime(item.publishedAt)}</time></div>
          <h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p>
          <a href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">查看来源 ↗</a>
        </article>`).join("")
      : '<div class="empty-state">暂无已审核快讯</div>';
  } catch {
    document.querySelector("#news-list").innerHTML = '<div class="empty-state">NEWS UNAVAILABLE</div>';
  }
}

document.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  renderOpportunities(button.dataset.filter);
}));
document.querySelector("#year").textContent = new Date().getFullYear();
Promise.all([loadOpportunities(), loadNews()]);
