(function () {
  if (window.hasWaterPlugin) return;
  window.hasWaterPlugin = true;

  console.log("✅ ChatGPT Water Usage Tracker Initialized!");

  // --- Config ---
  const ML_PER_TOKEN = 0.3;
  const ALERT_THRESHOLD = 500; // mL/day
  const PANEL_ID = "water-usage-panel";
  const PANEL_POS_KEY = "waterPanelPos"; // 'br'|'tr'|'bl'|'tl'

  // --- State ---
  let tokenCount = 0;
  let lastTypedTime = Date.now();
  const today = new Date().toISOString().split("T")[0];
  const alertedTodayKey = `water-alerted-${today}`;
  let alertedToday = localStorage.getItem(alertedTodayKey) === "true";
  let inputEl = null;

  // --- Helpers ---
  function computeWaterUsage(tokens) { return tokens * ML_PER_TOKEN; }

  function getUsageLog() {
    try { return JSON.parse(localStorage.getItem("waterUsageLog")) || {}; }
    catch { return {}; }
  }
  function setUsageLog(log) { localStorage.setItem("waterUsageLog", JSON.stringify(log)); }

  function saveWaterUsage() {
    const usageLog = getUsageLog();
    const waterUsage = computeWaterUsage(tokenCount);
    usageLog[today] = (usageLog[today] || 0) + waterUsage;
    setUsageLog(usageLog);
    if (usageLog[today] > ALERT_THRESHOLD && !alertedToday) {
      alert("💡 You've used over 500 mL of water today. Consider shortening prompts when possible.");
      alertedToday = true;
      localStorage.setItem(alertedTodayKey, "true");
    }
  }

  function retrieveWaterUsage() {
    const usageLog = getUsageLog();
    const lines = Object.entries(usageLog)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, ml]) => `- ${date}: ${(+ml).toFixed(2)} mL`);
    alert(`📅 Water Usage Log:\n${lines.join("\n") || "(empty)"}`);
  }

  function exportWaterLogCSV() {
    // include unsent typing
    if (tokenCount > 0) {
      saveWaterUsage();
      tokenCount = 0;
    }
    const usageLog = getUsageLog();
    const headers = "Date,Water Usage (mL)\n";
    const rows = Object.entries(usageLog)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, usage]) => `${date},${(+usage).toFixed(2)}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "water_usage_log.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function clearToday() {
    const usageLog = getUsageLog();
    if (today in usageLog) delete usageLog[today];
    setUsageLog(usageLog);
    localStorage.removeItem(alertedTodayKey);
    alertedToday = false;
    updatePanel();
  }

  function estimateTokensFromText(text) {
    const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
    return Math.round(words * 1.33);
  }

  // --- Panel (attached to body) ---
  function applyPanelPosition(panel, pos) {
    panel.style.top = panel.style.left = panel.style.right = panel.style.bottom = "";
    if (pos === "br") { panel.style.right = "16px"; panel.style.bottom = "16px"; }
    if (pos === "tr") { panel.style.right = "16px"; panel.style.top = "16px"; }
    if (pos === "bl") { panel.style.left  = "16px"; panel.style.bottom = "16px"; }
    if (pos === "tl") { panel.style.left  = "16px"; panel.style.top = "16px"; }
  }
  function nextPos(pos) { return ({ br:"tr", tr:"tl", tl:"bl", bl:"br" })[pos] || "tr"; }

  function ensurePanel() {
    let panel = document.getElementById(PANEL_ID);
    if (panel) return panel;

    panel = document.createElement("div");
    panel.id = PANEL_ID;
    panel.style.position = "fixed";
    panel.style.zIndex = "2147483647";
    panel.style.background = "white";
    panel.style.border = "1px solid #e5e7eb";
    panel.style.borderRadius = "12px";
    panel.style.padding = "12px";
    panel.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
    panel.style.fontFamily = "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
    panel.style.fontSize = "12px";
    panel.style.color = "#111";
    panel.style.minWidth = "220px";

    const savedPos = localStorage.getItem(PANEL_POS_KEY) || "br";
    applyPanelPosition(panel, savedPos);

    panel.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <div style="font-weight:600;">💧 Water Tracker</div>
        <button id="water-move" class="wp-btn" title="Move panel">↔︎ Move</button>
      </div>
      <div id="water-usage-line" title="Each token has a small estimated water cost from datacenter cooling.">
        Estimated (this prompt): 0.00 mL
      </div>
      <div id="water-usage-today">Today total: 0.00 mL</div>
      <div style="display:flex; gap:6px; margin-top:10px; flex-wrap:wrap;">
        <button id="water-view-log" class="wp-btn">📊 Log</button>
        <button id="water-export" class="wp-btn">⬇️ Export</button>
        <button id="water-clear-today" class="wp-btn" title="Remove today's entry">🧹 Clear today</button>
      </div>
    `;

    const styleBtn = document.createElement("style");
    styleBtn.textContent = `
      #${PANEL_ID} .wp-btn {
        border: 1px solid #e5e7eb;
        background: #f9fafb;
        border-radius: 8px;
        padding: 6px 8px;
        cursor: pointer;
      }
      #${PANEL_ID} .wp-btn:hover { background: #f3f4f6; }
    `;
    panel.appendChild(styleBtn);

    document.body.appendChild(panel);

    // wire buttons
    document.getElementById("water-view-log").addEventListener("click", retrieveWaterUsage);
    document.getElementById("water-export").addEventListener("click", exportWaterLogCSV);
    document.getElementById("water-clear-today").addEventListener("click", clearToday);
    document.getElementById("water-move").addEventListener("click", () => {
      const current = localStorage.getItem(PANEL_POS_KEY) || "br";
      const pos = nextPos(current);
      localStorage.setItem(PANEL_POS_KEY, pos);
      applyPanelPosition(panel, pos);
    });

    return panel;
  }

  function updatePanel() {
    ensurePanel();
    const thisPromptMl = computeWaterUsage(tokenCount);
    const usageLog = getUsageLog();
    const baseToday = usageLog[today] || 0;
    const displayToday = baseToday + thisPromptMl; // live

    const lineEl  = document.getElementById("water-usage-line");
    const todayEl = document.getElementById("water-usage-today");
    const boundEl = document.getElementById("water-bound");

    if (lineEl)  lineEl.textContent  = `Estimated (this prompt): ${thisPromptMl.toFixed(2)} mL`;
    if (todayEl) todayEl.textContent = `Today total: ${displayToday.toFixed(2)} mL`;
  }

  // --- Input detection via document-level listeners ---
  function isComposerEl(el) {
    if (!el) return false;
    if (el.tagName === "TEXTAREA") return true;
    if (el.getAttribute && el.getAttribute("contenteditable") === "true") return true;
    return false;
  }
  function getCurrentInputText() {
    if (!inputEl) return "";
    if ("value" in inputEl) return inputEl.value || "";
    return inputEl.innerText || inputEl.textContent || "";
  }
  function handleAnyInputEvent() {
    const el = document.activeElement;
    if (!isComposerEl(el)) return;
    inputEl = el;
    lastTypedTime = Date.now();
    const text = getCurrentInputText();
    tokenCount = estimateTokensFromText(text);
    updatePanel();
  }
  function attachGlobalListeners() {
    document.addEventListener("input", handleAnyInputEvent, true);
    document.addEventListener("keyup", handleAnyInputEvent, true);
    document.addEventListener("paste", () => setTimeout(handleAnyInputEvent, 0), true);
    setInterval(() => {
      if (Date.now() - lastTypedTime > 5000) {
        tokenCount = 0;
        updatePanel();
      }
    }, 2500);
  }
  function isSendKey(e) {
    return e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey;
  }
  document.addEventListener("keydown", (e) => {
    if (!isComposerEl(document.activeElement)) return;
    if (!isSendKey(e)) return;
    const text = getCurrentInputText();
    tokenCount = estimateTokensFromText(text);
    saveWaterUsage();
    tokenCount = 0;
    updatePanel();
  }, true);

  // Init
  attachGlobalListeners();
  ensurePanel();
  updatePanel();

  // periodic save while typing
  setInterval(() => {
    if (tokenCount > 0) {
      saveWaterUsage();
      updatePanel();
    }
  }, 10000);
})();
