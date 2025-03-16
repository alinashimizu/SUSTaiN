(function () {
    console.log("✅ ChatGPT Water Usage Tracker Loaded!");

    let tokenCount = 0;
    let lastTypedTime = Date.now();
    let backspaceCount = 0;
    let lastBackspaceTime = Date.now();

    function computeWaterUsage(tokens) {
        const waterPerToken = 0.3;
        return tokens * waterPerToken;
    }

    function saveWaterUsage() {
        const today = new Date().toISOString().split('T')[0];
        let usageLog = JSON.parse(localStorage.getItem("waterUsageLog")) || {};

        const waterUsage = computeWaterUsage(tokenCount);

        usageLog[today] = waterUsage; //always overwrite with the latest value
        localStorage.setItem("waterUsageLog", JSON.stringify(usageLog));
    }

    function retrieveWaterUsage() {
        let usageLog = JSON.parse(localStorage.getItem("waterUsageLog")) || {};
        let message = "📅 Water Usage Log:\n";

        for (let date in usageLog) {
            message += `- ${date}: ${usageLog[date].toFixed(2)} mL\n`;
        }

        alert(message);
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

            attachToChatInput(tracker);
        }

        const waterUsage = computeWaterUsage(tokenCount);
        tracker.textContent = `💧 Estimated Water: ${waterUsage.toFixed(2)} mL`;

        saveWaterUsage(); //update saved log in real time
    }

    function handleTyping(event) {
        const now = Date.now();
        if (now - lastTypedTime > 5000) {
            tokenCount = 0;
        }
        lastTypedTime = now;

        if (event.key === " " || event.key === "Enter") {
            tokenCount++;
            updateTracker();
        }
    }

    function handleDeletion(event) {
        if (event.key === "Backspace") {
            const now = Date.now();

            if (now - lastBackspaceTime > 1500) {
                backspaceCount = 0;
            }

            backspaceCount++;
            lastBackspaceTime = now;

            if (backspaceCount >= 4 && tokenCount > 0) {
                tokenCount--;
                updateTracker();
                backspaceCount = 0;
            }
        }
    }

    function attachToChatInput(element) {
        const waitForChatInput = setInterval(() => {
            const chatInput = document.querySelector("textarea");
            if (chatInput && chatInput.parentNode) {
                chatInput.parentNode.appendChild(element);
                clearInterval(waitForChatInput);
            }
        }, 500);
    }

    function addRetrieveButton() {
        let button = document.createElement("button");
        button.textContent = "📊 View Water Log";
        button.style.marginTop = "10px";
        button.style.fontSize = "12px";
        button.style.padding = "5px";
        button.style.cursor = "pointer";
        button.style.backgroundColor = "#ddd";
        button.style.border = "none";
        button.style.borderRadius = "5px";

        button.addEventListener("click", retrieveWaterUsage);
        attachToChatInput(button);
    }

    document.addEventListener("keydown", handleTyping);
    document.addEventListener("keydown", handleDeletion);

    addRetrieveButton();
    updateTracker();
})();
