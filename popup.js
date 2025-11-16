// intial message elements
const initialContentEl = document.querySelector(".initial-message-section");
const scanBtnEl = document.getElementById("tosdr-btn");

// loading elements
const loadingContentEl = document.querySelector(".loading-section");
loadingContentEl.style.display = "none";
const loadingItemEl = document.getElementById("loading-item");

// ai response elements
const aiContentEl = document.querySelector(".ai-res-section");
const outEl = document.getElementById("output");
const summaryEl = document.getElementById("summary");
aiContentEl.style.display = "none";

// init soul tracking
initSoul();
let soulForOneScan = 0;
const soulContentEl = document.querySelector(".soul-meter-section");
soulContentEl.style.display = "none";
const soulFillEl = document.getElementById("soul-fill");
const soulPercentageEl = document.getElementById("soul-percentage");
const scanAgainBtnEl = document.getElementById("scan-again-btn");


// main process scan listener
scanBtnEl.addEventListener("click", async () => {
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
                    const soulCost = 100 - result.percentage_grade;
                    soulForOneScan = soulCost;
                    const grade = new String(soulCost).toString() + "%";
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

// reset soul button
document.getElementById("reset").addEventListener("click", () => {
    chrome.storage.local.set({ soul: 100 }, () => {
        console.log("Reset soul to 100%");
        soulPercentageEl.textContent = "100%";
        soulFillEl.style.width = "100%";
    });
});

// accept ToS button
document.getElementById("accept-btn").addEventListener("click", () => {
    // switch to soul meter view
    aiContentEl.style.display = "none";
    soulContentEl.style.display = "flex";
    // update 
    updateSoul(-soulForOneScan, (soul) => {
        soulPercentageEl.textContent = soul + "%";
        soulFillEl.style.width = soul + "%";
    });
});

// reject ToS button
document.getElementById("reject-btn").addEventListener("click", () => {
    // switch to soul meter view
    aiContentEl.style.display = "none";
    soulContentEl.style.display = "flex";
});

// scan again button
scanAgainBtnEl.addEventListener("click", () => {
    // switch to initial view
    soulContentEl.style.display = "none";
    initialContentEl.style.display = "flex";
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

async function initSoul() {
    chrome.storage.local.get(["soul"], (data) => {
        if (data.soul === undefined) {
            chrome.storage.local.set({ soul: 100 }, () => {
                console.log("Initialized soul to 100%");
                soulPercentageEl.textContent = "100%";
            });
        }
    });
    updateSoul(0, (soul) => {
        soulPercentageEl.textContent = soul + "%";
    });
}

function updateSoul(amount, callback) {
    chrome.storage.local.get(["soul"], (data) => {
        let newSoul = data.soul + amount;
        if (newSoul > 100) newSoul = 100;
        if (newSoul < 0) newSoul = 0;
        chrome.storage.local.set({ soul: newSoul }, () => {
            console.log(`Updated soul to ${newSoul}%`);
            callback && callback(newSoul);
        });
    });
}