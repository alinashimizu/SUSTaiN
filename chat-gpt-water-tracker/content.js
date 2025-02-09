(function () {
    console.log("✅ ChatGPT Water Usage Tracker Loaded!");

    let tokenCount = 0;
    let lastTypedTime = Date.now();

    function computeWaterUsage(tokens) {
        const waterPerToken = 0.3; // More refined estimate
        return tokens * waterPerToken;
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

            // Attach below ChatGPT's input area
            const chatInput = document.querySelector("textarea");
            if (chatInput && chatInput.parentNode) {
                chatInput.parentNode.appendChild(tracker);
            } else {
                document.body.appendChild(tracker);
            }
        }

        const waterUsage = computeWaterUsage(tokenCount);
        tracker.textContent = `💧 Estimated Water: ${waterUsage.toFixed(2)} mL`;
    }

    function handleTyping(event) {
        const now = Date.now();
        if (now - lastTypedTime > 1000) {
            tokenCount = 0; // Reset after inactivity (new prompt)
        }
        lastTypedTime = now;

        // Increase token count on space or Enter key
        if (event.key === " " || event.key === "Enter") {
            tokenCount++;
            updateTracker();
        }
    }

    function handleDeletion(event) {
        if (event.key === "Backspace" && tokenCount > 0) {
            tokenCount--; // Reduce token count when deleting
            updateTracker();
        }
    }

    // Attach event listeners
    document.addEventListener("keydown", handleTyping);
    document.addEventListener("keydown", handleDeletion);

})();