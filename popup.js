document.addEventListener("DOMContentLoaded", () => {
    // intial message elements
    const initialContentEl = document.querySelector(".initial-message-section");
    const btnEl = document.getElementById("tosdr-btn");

    // loading elements
    const loadingContentEl = document.querySelector(".loading-section");
    loadingContentEl.style.display = "none";
    const loadingItemEl = document.getElementById("loading-item");

    // ai response elements
    const aiContentEl = document.querySelector(".ai-res-section");
    const outEl = document.getElementById("output");
    const summaryEl = document.getElementById("summary");
    aiContentEl.style.display = "none"; // hide by default
    
    btnEl.addEventListener("click", async () => {
        // switch to loading view
        initialContentEl.style.display = "none";
        loadingContentEl.style.display = "flex";
        const loadingInterval = loadingAnimation(loadingItemEl);

        // retreive text with injected script
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript(
            {
                target: { tabId: tab.id },
                function: () => {
                    console.log("Getting text...");
                    return window.getSelection().toString();
                }
            },
            async (res) => {
                // get selected text
                const selected = res[0].result;
                if (!selected) {
                    alert("Please select text by highlighting it with your cursor.");
                    initialContentEl.style.display = "flex";
                    loadingContentEl.style.display = "none";
                    clearInterval(loadingInterval);
                    return;
                } else {
                    // send text to cloudflare
                    console.log("Sending highlighted text to cloudflare...");
                    const analysis = await analyseToS(selected);

                    // clear loading view
                    clearInterval(loadingInterval);
                    loadingContentEl.style.display = "none";
                    aiContentEl.style.display = "flex";

                    // display response
                    if (analysis.ok) {
                        console.log("OK response recieved");
                        console.log(JSON.stringify(analysis));
                        const result = analysis.result.response;
                        console.log(result);
                        const grade = new String(100 - result.percentage_grade).toString() + "%";
                        const summary = result.summary;
                        outEl.textContent = grade;
                        summaryEl.textContent = summary;
                    } else {
                        console.log("Response not OK");
                        console.log(JSON.stringify(analysis));
                        outEl.textContent = analysis.error;
                    }
                }
            }
        )
    });
});

async function analyseToS(text) {
    const res = await fetch("https://proud-sound-743c.eboyden42.workers.dev/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
    });
    const data = await res.json();
    return data;
}

function loadingAnimation(loadingItemEl) {
    const loadingItems = ["suspicious clauses...", "data selling...", "privacy violations...", "dark patterns...", "legal jargon...", "the holy gail...", "love...", "waldo..."];

    let index = 1;
    return setInterval(() => {
        loadingItemEl.textContent = loadingItems[index];
        index = (index + 1) % loadingItems.length;
    }, 2000);
}