(function () {
    if (window.hasWaterPlugin) return;
    window.hasWaterPlugin = true;
    window.WaterPlugin = {};

    console.log("✅ ChatGPT Water Usage Tracker Initialized!");

    let tokenCount = 0;
    let lastTypedTime = Date.now();
    const ALERT_THRESHOLD = 500;

    const today = new Date().toISOString().split('T')[0];
    const alertedTodayKey = `alerted-${today}`;
    let alertedToday = localStorage.getItem(alertedTodayKey) === "true";

    function computeWaterUsage(tokens) {
        const waterPerToken = 0.3;
        return tokens * waterPerToken;
    }

    function saveWaterUsage() {
        let usageLog = JSON.parse(localStorage.getItem("waterUsageLog")) || {};
        const waterUsage = computeWaterUsage(tokenCount);
        usageLog[today] = (usageLog[today] || 0) + waterUsage;
        localStorage.setItem("waterUsageLog", JSON.stringify(usageLog));

        if (usageLog[today] > ALERT_THRESHOLD && !alertedToday) {
            alert("💡 You've used over 500 mL of water today. Consider shortening prompts when possible.");
            alertedToday = true;
            localStorage.setItem(alertedTodayKey, "true");
        }
    }

    function retrieveWaterUsage() {
        let usageLog = JSON.parse(localStorage.getItem("waterUsageLog")) || {};
        let message = "📅 Water Usage Log:\n";
        for (let date in usageLog) {
            message += `- ${date}: ${usageLog[date].toFixed(2)} mL\n`;
        }
        alert(message);
    }

    function exportWaterLogCSV() {
        const usageLog = JSON.parse(localStorage.getItem("waterUsageLog")) || {};
        const headers = "Date,Water Usage (mL)\n";
        const rows = Object.entries(usageLog)
            .map(([date, usage]) => `${date},${usage.toFixed(2)}`)
            .join("\n");
        const blob = new Blob([headers + rows], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "water_usage_log.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function updateTracker() {
        let tracker = document.getElementById("water-usage-tracker");
        if (!tracker) {
            tracker = document.createElement("div");
            tracker.id = "water-usage-tracker";
            tracker.style.fontSize = "12px";
            tracker.style.color = "#888";
            tracker.style.marginTop = "4px";
            tracker.style.textDecoration = "underline";
            tracker.style.fontFamily = "Arial, sans-serif";
            tracker.title = "Each token represents a small water cost from data center usage. Learn more.";
            appendToChatInputOnce(tracker);
        }
        const waterUsage = computeWaterUsage(tokenCount);
        tracker.textContent = `💧 Estimated Water: ${waterUsage.toFixed(2)} mL`;
        saveWaterUsage();
    }

    function handleTyping(event) {
        const now = Date.now();
        if (now - lastTypedTime > 5000) {
            tokenCount = 0;
        }
        lastTypedTime = now;

        const input = document.querySelector("textarea");
        if (input) {
            const wordCount = input.value.trim().split(/\s+/).length;
            tokenCount = Math.round(wordCount * 1.33);
            updateTracker();
        }
    }

    function appendToChatInputOnce(element) {
        const existing = document.getElementById(element.id);
        if (existing) return;

        const observer = new MutationObserver((mutations, obs) => {
            const chatInput = document.querySelector("textarea");
            if (chatInput && chatInput.parentNode) {
                try {
                    if (!document.getElementById(element.id)) {
                        chatInput.parentNode.appendChild(element);
                    }
                    obs.disconnect();
                } catch (e) {
                    console.error("Water Plugin append error:", e);
                    obs.disconnect();
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function addRetrieveButton() {
        const buttonId = "water-log-button";
        if (document.getElementById(buttonId)) return;

        const button = document.createElement("button");
        button.id = buttonId;
        button.textContent = "📊 View Water Log";
        button.style.marginTop = "10px";
        button.style.fontSize = "12px";
        button.style.padding = "5px";
        button.style.cursor = "pointer";
        button.style.backgroundColor = "#ddd";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.addEventListener("click", retrieveWaterUsage);
        appendToChatInputOnce(button);
    }

    function addExportButton() {
        const buttonId = "water-export-button";
        if (document.getElementById(buttonId)) return;

        const button = document.createElement("button");
        button.id = buttonId;
        button.textContent = "⬇️ Export Log as CSV";
        button.style.marginTop = "10px";
        button.style.fontSize = "12px";
        button.style.padding = "5px";
        button.style.cursor = "pointer";
        button.style.backgroundColor = "#ddd";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.addEventListener("click", exportWaterLogCSV);
        appendToChatInputOnce(button);
    }

    document.addEventListener("keydown", handleTyping);
    addRetrieveButton();
    addExportButton();
    updateTracker();
})();
