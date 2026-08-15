document.addEventListener("DOMContentLoaded", () => {

    const exportBtn = document.getElementById("exportBtn");

    if (!exportBtn) return;

    exportBtn.addEventListener("click", exportCSV);

});

function exportCSV() {

    if (transactions.length === 0) {

        alert("No transactions available to export.");
        return;

    }

    let csv =
        "Date,Category,Amount,Type,Status,Description\n";

    transactions.forEach(transaction => {

        csv += `"${transaction.date}",`;
        csv += `"${transaction.category}",`;
        csv += `"${transaction.amount}",`;
        csv += `"${transaction.type}",`;
        csv += `"${transaction.status}",`;
        csv += `"${transaction.description || ""}"\n`;

    });

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "transactions.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}