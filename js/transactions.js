let editingTransactionId = null;
let editingTransactionType = null;
function deleteTransaction(id){

    if(!confirm("Delete this transaction?"))
        return;

    transactions = transactions.filter(
        transaction => transaction.id !== id
    );

    saveTransactions();

    updateAllVisuals();

}
function editTransaction(id){

    const transaction = transactions.find(
        t => t.id === id
    );

    if(!transaction) return;

    editingTransactionId = id;
    editingTransactionType = transaction.type;

    if(transaction.type === "income"){

        openIncomeModal();

        document.getElementById("incomeAmount").value =
            transaction.amount;

        document.getElementById("incomeCategory").value =
            transaction.category.toLowerCase();

        document.getElementById("incomeDescription").value =
            transaction.description || "";

        document.getElementById("incomeDate").value =
            transaction.date;

    }

    else{

        openExpenseModal();

        document.getElementById("expenseAmount").value =
            Math.abs(transaction.amount);

        document.getElementById("expenseCategory").value =
            transaction.category.toLowerCase();

        document.getElementById("expenseDescription").value =
            transaction.description || "";

        document.getElementById("expenseDate").value =
            transaction.date;

    }

}