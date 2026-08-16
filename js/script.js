let transactions = [];
let monthlyIncome = 0;
let monthlyExpenses = 0;
let selectedExpensePeriod = 'Monthly';
let editingTransactionId = null;

// Utility for week calculation
function getWeekNumber(d) {
    d = new Date(d);
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    var yearStart = new Date(d.getFullYear(),0,1);
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}

// Monthly totals for bar chart and dashboard
function getMonthlyTotals() {
    let months = Array.from({length:12}, () => ({income:0, expense:0}));
    transactions.forEach(tx => {
        let monthIdx = new Date(tx.date).getMonth();
        if (tx.type === 'income') months[monthIdx].income += tx.amount;
        else if (tx.type === 'expense') months[monthIdx].expense += Math.abs(tx.amount);
    });
    return months;
}

// DASHBOARD (top cards)
function updateDashboard() {
    document.querySelector('.income-amount').textContent = `₹${monthlyIncome.toLocaleString('en-IN')}.00`;
    document.querySelector('.expense-amount').textContent = `₹${monthlyExpenses.toLocaleString('en-IN')}.00`;
}

function updatePercentChange() {
    let now = new Date();
    let currMonthIdx = now.getMonth();
    let monthsData = getMonthlyTotals();
    function percent(current, prev) {
        if (prev == 0) return current == 0 ? "0%" : "100%";
        let p = ((current - prev) / Math.abs(prev)) * 100;
        return (p >= 0 ? "+" : "") + p.toFixed(2) + "%";
    }
    let currIncome = monthsData[currMonthIdx].income;
    let prevIncome = currMonthIdx>0 ? monthsData[currMonthIdx-1].income : 0;
    let currExpense = monthsData[currMonthIdx].expense;
    let prevExpense = currMonthIdx>0 ? monthsData[currMonthIdx-1].expense : 0;
    document.querySelector('.card .change').innerHTML =
        `<i class="fas fa-arrow-up"></i> ${percent(currIncome, prevIncome)} vs Last month`;
    document.querySelectorAll('.card .change')[1].innerHTML =
        `<i class="fas fa-arrow-up"></i> ${percent(currExpense, prevExpense)} vs Last month`;
}

// TRANSACTIONS TABLE
function updateTransactionsTable() {
    const tbody = document.querySelector('.transactions-table tbody');
    tbody.innerHTML = '';
    const recentTransactions = transactions.slice(0, 10);
    recentTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        const formattedDate = new Date(transaction.date).toLocaleDateString('en-IN', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
        const amountDisplay = transaction.amount > 0
            ? `+₹${transaction.amount.toLocaleString('en-IN')}.00`
            : `-₹${Math.abs(transaction.amount).toLocaleString('en-IN')}.00`;
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${transaction.category}</td>
            <td style="color: ${transaction.amount > 0 ? '#10b981' : '#ea580c'}">${amountDisplay}</td>
            <td><span class="status-success">${transaction.status}</span></td>
            <td>
    <button
        class="action-btn edit-btn"
        onclick="editTransaction(${transaction.id})">
        <i class="fas fa-edit"></i>
    </button>

    <button
        class="action-btn delete-btn"
        onclick="deleteTransaction(${transaction.id})">
        <i class="fas fa-trash"></i>
    </button>
</td>
        `;
        tbody.appendChild(row);
    });
    if (typeof filterTransactions === "function") {
      filterTransactions();
    } 
}

// ALL EXPENSES SECTION (breakdown)
function getExpensesTotals(period) {
    const now = new Date();
    let filtered = transactions.filter(tx => tx.type === 'expense');
    if (period === 'Daily') {
        filtered = filtered.filter(tx => new Date(tx.date).toDateString() === now.toDateString());
    } else if (period === 'Weekly') {
        filtered = filtered.filter(tx => getWeekNumber(tx.date) === getWeekNumber(now) && new Date(tx.date).getFullYear() === now.getFullYear());
    } else if (period === 'Monthly') {
        filtered = filtered.filter(tx => new Date(tx.date).getMonth() === now.getMonth() && new Date(tx.date).getFullYear() === now.getFullYear());
    }
    let byCategory = {};
    let total = 0;
    filtered.forEach(tx => {
        const cat = tx.category;
        if (!byCategory[cat]) byCategory[cat] = 0;
        byCategory[cat] += Math.abs(tx.amount);
        total += Math.abs(tx.amount);
    });
    return { byCategory, total };
}

function getAllPeriodExpenseTotals() {
    const now = new Date();
    // Daily
    let daily = transactions.filter(tx => tx.type === 'expense' && new Date(tx.date).toDateString() === now.toDateString())
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    // Weekly
    let weekly = transactions.filter(tx => tx.type === 'expense' && getWeekNumber(tx.date) === getWeekNumber(now) && new Date(tx.date).getFullYear() === now.getFullYear())
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    // Monthly
    let monthly = transactions.filter(tx => tx.type === 'expense' && new Date(tx.date).getMonth() === now.getMonth() && new Date(tx.date).getFullYear() === now.getFullYear())
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    // All time
    let all = transactions.filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    return { daily, weekly, monthly, all };
}

function getCategoryDotClass(category) {
    category = category.toLowerCase();
    if (category.includes('food')) return 'dot-food';
    if (category.includes('entertain')) return 'dot-entertainment';
    if (category.includes('shopping')) return 'dot-shopping';
    if (category.includes('investment')) return 'dot-investment';
    return 'dot-food'; // fallback
}

function updateAllExpensesBox() {
    let period = selectedExpensePeriod;
    const allTotals = getAllPeriodExpenseTotals();
    document.getElementById('totalExpenses').textContent = "₹" + allTotals.all.toLocaleString('en-IN');
    document.getElementById('periodValues').innerHTML = `
        <span>₹${allTotals.daily.toLocaleString('en-IN')}</span>
        <span>₹${allTotals.weekly.toLocaleString('en-IN')}</span>
        <span>₹${allTotals.monthly.toLocaleString('en-IN')}</span>
    `;
    const { byCategory } = getExpensesTotals(period);
    const ul = document.getElementById('expenseCategories');
    ul.innerHTML = '';
    Object.entries(byCategory).forEach(([cat, amount]) => {
        ul.innerHTML += `<li class="expense-category">
        <span><span class="category-dot ${getCategoryDotClass(cat)}"></span>${cat}</span>
        <span>₹${amount.toLocaleString('en-IN')}</span>
        </li>`;
    });
}

function setActivePeriodTab(period) {
    selectedExpensePeriod = period;
    document.querySelectorAll('.period-tab').forEach(tab => tab.classList.remove('active'));
    if (period === 'Daily') document.getElementById('dailyTab').classList.add('active');
    else if (period === 'Weekly') document.getElementById('weeklyTab').classList.add('active');
    else document.getElementById('monthlyTab').classList.add('active');
    updateAllExpensesBox();
}

// OVERVIEW BAR CHART
function renderMonthlyBarChart() {
    const monthsData = getMonthlyTotals();
    const maxValue = Math.max(
        ...monthsData.map(m => m.income + m.expense),
        1000
    );
    const chart = document.getElementById('monthlyBarChart');
    chart.innerHTML = '';
    monthsData.forEach((m, idx) => {
        const expenseHeight = m.expense ? Math.round(200 * m.expense / maxValue) : 0;
        const incomeHeight = m.income ? Math.round(200 * m.income / maxValue) : 0;
        const bar = document.createElement('div');
        bar.className = 'month-bar';
        bar.dataset.month = idx;
        const incDiv = document.createElement('div');
        incDiv.className = 'month-bar-income';
        incDiv.style.height = incomeHeight + 'px';
        const expDiv = document.createElement('div');
        expDiv.className = 'month-bar-expense';
        expDiv.style.height = expenseHeight + 'px';
        bar.appendChild(incDiv);
        bar.appendChild(expDiv);
        bar.addEventListener('mouseenter', function(e){
            showChartTooltip(idx, bar);
        });
        bar.addEventListener('mouseleave', function(e){
            hideChartTooltip();
        });
        chart.appendChild(bar);
    });
}

function showChartTooltip(monthIdx, barElem) {
    const months = ["Jan", "Feb", "Mar", "Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const totals = getMonthlyTotals()[monthIdx];
    const rect = barElem.getBoundingClientRect();
    const tooltip = document.getElementById('chartTooltip');
    tooltip.innerHTML = `<div class="month-label">${months[monthIdx]} ${new Date().getFullYear()}</div>
        <div class="income-label">Income: ₹${totals.income.toLocaleString('en-IN')}</div>
        <div class="expense-label">Expenses: ₹${totals.expense.toLocaleString('en-IN')}</div>`;
    tooltip.style.display = 'block';
    tooltip.style.top = (window.scrollY + rect.top - 97) + 'px';
    tooltip.style.left = (window.scrollX + rect.left + rect.width/2 - 70) + 'px';
}
function hideChartTooltip() {
    document.getElementById('chartTooltip').style.display = 'none';
}

// ALL DASHBOARD VISUALS update
function updateAllVisuals() {
    let now = new Date();
    let currMonthIdx = now.getMonth();
    let currMonthIncome = getMonthlyTotals()[currMonthIdx].income;
    monthlyIncome = currMonthIncome;
    let currMonthExpense = getMonthlyTotals()[currMonthIdx].expense;
    monthlyExpenses = currMonthExpense;
    updateDashboard();
    updateTransactionsTable();
    updateAllExpensesBox();
    renderMonthlyBarChart();
    updatePercentChange();
}

function saveTransactions() {
    const activeUser = localStorage.getItem('activeUser');
    if (!activeUser) return;
    localStorage.setItem('transactions_' + activeUser, JSON.stringify(transactions));
}

function addIncome() {
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const category = document.getElementById('incomeCategory').value;
    const description = document.getElementById('incomeDescription').value;
    const date = document.getElementById('incomeDate').value;
    if (!amount || !category || !date) {
        alert('Please fill in all required fields');
        return;
    }
    if(editingTransactionId){

    const index =
        transactions.findIndex(
            t => t.id === editingTransactionId
        );

    transactions[index] = {

        ...transactions[index],

        amount,

        category:
            category.charAt(0).toUpperCase() +
            category.slice(1),

        description,

        date

    };

    editingTransactionId = null;

    saveTransactions();

    updateAllVisuals();

    closeModal("incomeModal");

    showNotification(
        "Income updated successfully!"
    );

    return;

}
    const newTransaction = {
        id: transactions.length + 1,
        date,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount,
        status: 'Success',
        type: 'income',
        description
    };
    transactions.unshift(newTransaction);
    saveTransactions();
    updateAllVisuals();
    closeModal('incomeModal');
    showNotification('Income added successfully!', 'success');
}

function addExpense() {
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;
    const description = document.getElementById('expenseDescription').value;
    const date = document.getElementById('expenseDate').value;
    if (!amount || !category || !date) {
        alert('Please fill in all required fields');
        return;
    }
    if(editingTransactionId){

    const index =
        transactions.findIndex(
            t => t.id === editingTransactionId
        );

    transactions[index] = {

        ...transactions[index],

        amount:-amount,

        category:
            category.charAt(0).toUpperCase() +
            category.slice(1),

        description,

        date

    };

    editingTransactionId = null;

    saveTransactions();

    updateAllVisuals();

    closeModal("expenseModal");

    showNotification(
        "Expense updated successfully!"
    );

    return;

}
    const newTransaction = {
        id: transactions.length + 1,
        date,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount: -amount,
        status: 'Success',
        type: 'expense',
        description
    };
    transactions.unshift(newTransaction);
    saveTransactions();
    updateAllVisuals();
    closeModal('expenseModal');
    showNotification('Expense added successfully!', 'success');
}

// Popup notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 2rem; right: 2rem;
        background: ${type === 'success' ? '#10b981' : '#ea580c'};
        color: white; padding: 1rem 1.5rem; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => { document.body.removeChild(notification); }, 300);
    }, 3000);
}

// Startup/init
document.addEventListener('DOMContentLoaded', function() {
    const now = new Date();
    document.getElementById('todayDate').textContent = now.toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
    const todayStr = now.toISOString().split('T')[0];
    document.getElementById('incomeDate').value = todayStr;
    document.getElementById('expenseDate').value = todayStr;
    document.getElementById('dailyTab').addEventListener('click', function() {
        setActivePeriodTab('Daily');
    });
    document.getElementById('weeklyTab').addEventListener('click', function() {
        setActivePeriodTab('Weekly');
    });
    document.getElementById('monthlyTab').addEventListener('click', function() {
        setActivePeriodTab('Monthly');
    });
    displayProfile();
    loadUserData();
    
});

// Shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal('incomeModal');
        closeModal('expenseModal');
        closeModal('profileModal');
    }
    if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        openIncomeModal();
    }
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        openExpenseModal();
    }
});

// Load and save for current user
function loadUserData() {
    const activeUser = localStorage.getItem('activeUser');
    if (!activeUser) return;
    transactions = JSON.parse(localStorage.getItem('transactions_' + activeUser) || '[]');
    updateAllVisuals();
}

// PROFILE LOGIC
function openProfileModal() {

    const currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) return;

    const accountName =
        document.getElementById("accountName");

    const accountEmail =
        document.getElementById("accountEmail");

    if (accountName) {
        accountName.textContent =
            currentUser.name || "Your Name";
    }

    if (accountEmail) {
        accountEmail.textContent =
            currentUser.email || "";
    }

    document.getElementById("profileModal").style.display = "block";
    document.body.style.overflow = "hidden";
}


function displayProfile() {

    const currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) return;

    const name = currentUser.name || "Your Name";
    const email = currentUser.email || "";

    document.getElementById("profileNameDisplay").textContent = name;
    document.getElementById("profileEmailDisplay").textContent = email;

    const accountName = document.getElementById("accountName");
    const accountEmail = document.getElementById("accountEmail");

    if (accountName) {
        accountName.textContent = name;
    }

    if (accountEmail) {
        accountEmail.textContent = email;
    }
}
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';

    if (modalId === 'incomeModal') {
        document.getElementById('incomeForm').reset();
        document.getElementById('incomeDate').value =
            new Date().toISOString().split('T')[0];

    } else if (modalId === 'expenseModal') {
        document.getElementById('expenseForm').reset();
        document.getElementById('expenseDate').value =
            new Date().toISOString().split('T')[0];
    }
}
window.onclick = function(event) {
    ['incomeModal','expenseModal','profileModal'].forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) closeModal(modalId);
    });
};




function openIncomeModal() {
    document.getElementById('incomeModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}
function openExpenseModal() {
    document.getElementById('expenseModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}
