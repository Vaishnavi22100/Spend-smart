# Spend Smart — Personal Expense Tracker

A clean multi-user personal expense tracking web application built using HTML, CSS, and JavaScript.

## 📌 Project Overview

Spend Smart helps users manage their personal finances by recording income and expenses, viewing spending summaries, searching transactions, editing or deleting entries, and exporting transaction data as a CSV file.

The application uses browser local storage to maintain separate transaction data for each logged-in user.

## ✨ Features

* Multi-user registration and login
* User-specific transaction storage
* Add income and expenses
* Edit existing transactions
* Delete transactions
* Search transactions
* Monthly income and expense summary
* Daily, weekly, and monthly expense breakdown
* Monthly overview chart
* Transaction sorting
* CSV transaction export
* Account information popup
* Logout functionality
* Dashboard login protection
* Responsive dashboard layout
* Light and dark theme support

## 🛠️ Tech Stack

**Frontend**

* HTML5
* CSS3
* JavaScript

**Libraries**

* Font Awesome

**Storage**

* Browser LocalStorage

**Development Tools**

* Visual Studio Code
* Git
* GitHub

## 📂 Project Structure

```text
Spend Smart/
│
├── assets/
│
├── css/
│   ├── style.css
│   ├── dark.css
│   ├── search.css
│   ├── transactions.css
│   ├── login.css
│   └── register.css
│
├── js/
│   ├── script.js
│   ├── search.js
│   ├── transactions.js
│   ├── export.js
│   ├── theme.js
│   └── auth.js
│
├── dashboard.html
├── index.html
├── login.html
├── register.html
├── .gitignore
└── README.md
```

## 🔐 User Data Flow

```text
Registration
     ↓
User account stored in LocalStorage
     ↓
Login
     ↓
Current user session created
     ↓
Dashboard
     ↓
User-specific transactions loaded
     ↓
Add / Edit / Delete / Search / Export
```

## 💾 Data Storage

Spend Smart uses browser LocalStorage for the project data.

Each user's transactions are associated with their email address, allowing different users on the same browser to maintain separate transaction records.

## 📊 Dashboard

The dashboard provides:

* Monthly income
* Monthly expenses
* Monthly comparison
* Expense breakdown
* Daily / weekly / monthly expense totals
* Monthly income and expense chart
* Recent transaction history

## 📤 Export

Users can export their transaction data as a CSV file that can be opened using spreadsheet applications such as Microsoft Excel or Google Sheets.

## 🎯 Learning Outcomes

This project demonstrates practical knowledge of:

* HTML page structure
* CSS layout and responsive design
* JavaScript DOM manipulation
* Event handling
* LocalStorage
* CRUD operations
* Client-side authentication flow
* Modular JavaScript and CSS organization
* Git and GitHub

## 🚀 Future Enhancements

* Backend database integration
* Cloud synchronization across devices
* Password hashing and secure authentication
* Advanced financial analytics
* Budget tracking and alerts
* Monthly report generation
* Mobile application version

## 👩‍💻 Author

**Vaishnavi22100**

GitHub:
https://github.com/Vaishnavi22100

## 📄 License

This project was developed as a college web development project.
