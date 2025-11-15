const btnEl = document.getElementById("tosdr-btn");
const outEl = document.getElementById("output");

btnEl.addEventListener("click", () => {
    if (outEl.textContent === "CLICKED") {
        outEl.textContent = "";
    } else {
        outEl.textContent = "CLICKED"
    }
});
