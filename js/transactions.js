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

    alert("Edit feature coming next!");

}