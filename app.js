const typeLabels = {
  early: "EARLY",
  whale: "SMART MONEY",
  defi: "DEFI",
};

const riskLabels = {
  low: "较低",
  medium: "中等",
  high: "较高",
};

let opportunities = [];

function renderOpportunities(filter = "all") {
  const list = document.querySelector("#opportunity-list");
  const filtered = filter === "all"
    ? opportunities
    : opportunities.filter((item) => item.type === filter);

  if (!filtered.length) {
    list.innerHTML = '<div class="empty-state">NO MATCHING SIGNALS</div>';
    return;
  }

  list.innerHTML = filtered.map((item, index) => `
    <article class="opportunity-row">
      <span class="rank">${String(index + 1).padStart(2, "0")}</span>
      <div class="opportunity-name">
        <h3>${item.name}<span class="type-tag">${typeLabels[item.type]}</span></h3>
        <p>${item.summary}</p>
      </div>
      <div class="metric">
        <span>CHAIN</span>
        <strong>${item.chain}</strong>
      </div>
      <div class="metric">
        <span>PRIMARY SIGNAL</span>
        <strong>${item.signal}</strong>
      </div>
      <div class="metric">
        <span>RISK / SCORE</span>
        <strong class="risk-${item.risk}">${riskLabels[item.risk]} · <b class="score">${item.score}</b></strong>
      </div>
      <span class="arrow">↗</span>
    </article>
  `).join("");
}

async function loadData() {
  try {
    const response = await fetch("./data/opportunities.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    opportunities = data.opportunities.sort((a, b) => b.score - a.score);
    document.querySelector("#signal-count").textContent = String(data.signalCount).padStart(2, "0");
    document.querySelector("#hero-score").textContent = data.marketIndex;
    renderOpportunities();
  } catch (error) {
    document.querySelector("#opportunity-list").innerHTML =
      '<div class="empty-state">DATA UNAVAILABLE — PLEASE TRY AGAIN LATER</div>';
    console.error("Failed to load opportunity data:", error);
  }
}

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderOpportunities(button.dataset.filter);
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();
loadData();
