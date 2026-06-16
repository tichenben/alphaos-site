var e=e=>String(e??``).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#039;`})[e]);function t(t){return t?`
    <h2>深度分析</h2>
    <p class="modal-copy">${e(t.id)} · ${e(t.kind)}</p>
    <h3>评分拆解</h3>
    <div class="component-list">
      ${(t.scoreComponents??[]).map(t=>`
        <div><span>${e(t.label)}</span><strong>${e(t.value)}</strong></div>
      `).join(``)}
    </div>
    <h3>完整风险</h3>
    <ul class="evidence">${(t.risk?.reasons??[]).map(t=>`<li>${e(t)}</li>`).join(``)}</ul>
    <h3>扩展证据</h3>
    <ul class="evidence">${(t.evidence??[]).map(t=>`<li>${e(t)}</li>`).join(``)}</ul>
    <h3>原始指标</h3>
    <pre class="raw-json">${e(JSON.stringify(t.rawMetrics,null,2))}</pre>
  `:`
      <h2>深度分析</h2>
      <p class="modal-copy">连接钱包后可查看评分拆解、完整风险、更多证据和原始指标。</p>
    `}export{t as renderResearchPanel};