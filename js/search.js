document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("searchTransaction");

    if (!searchInput) return;

    searchInput.addEventListener("input", filterTransactions);

});

function filterTransactions() {

    const keyword = document
        .getElementById("searchTransaction")
        .value
        .toLowerCase()
        .trim();

    const rows = document.querySelectorAll(".transactions-table tbody tr");

    rows.forEach(row => {

        const text = row.textContent.toLowerCase();

        row.style.display = text.includes(keyword) ? "" : "none";

    });

}