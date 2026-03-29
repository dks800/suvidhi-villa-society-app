# 🏢 Suvidhi Villa Society Management App

A modern, real-time society management web application built to simplify operations for residential communities.

---

## 🚀 Overview

Suvidhi Villa Society Management App is a full-featured platform designed to manage day-to-day society operations including members, maintenance, expenses, and funds — all in real-time.

The system follows a **ledger-first approach**, where the **Funds module acts as the single source of truth**, ensuring accurate financial tracking and auditability.

---

## ✨ Features

### 👥 Members Module

* Add, edit, and manage society members
* Maintain structured member records

### 💰 Maintenance Module

* Track maintenance per member and month
* Payment status tracking (Paid / Pending)
* Automatically syncs with Funds

### 💸 Expenses Module

* Record all society expenses
* Linked with Funds for real-time deduction

### 📊 Funds Module (Core)

* Centralized ledger system
* Tracks all credits and debits
* Running balance per transaction
* Acts as the financial backbone of the app

### 📈 Reports Module

* Members report
* Maintenance report (date range based)
* Funds ledger report
* Export to PDF

### 📊 Dashboard

* Module-based UI
* Quick navigation
* Ready for analytics and real-time stats

---

## ⚙️ Tech Stack

* **Frontend:** Next.js (App Router), React
* **Styling:** Tailwind CSS
* **Backend / Database:** Firebase Firestore (Realtime)
* **Authentication:** Firebase Auth

---

## 🧠 Architecture Principles

* 🔄 Realtime-first using `onSnapshot`
* 🧾 No data duplication across modules
* 💰 Funds as single source of truth
* 🧩 Modular and scalable design

---

## 📂 Project Structure (Simplified)

```
/components
  /members
  /maintenance
  /expenses
  /funds
  /reports

/hooks
/utils

/app (Next.js App Router)
```

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/your-username/suvidhi-villa-society-app.git
cd suvidhi-villa-society-app
```

### 2. Install dependencies

```
npm install
```

### 3. Configure Firebase

* Create a Firebase project
* Enable Firestore and Authentication
* Add your Firebase config to the project

### 4. Run the app

```
npm run dev
```

---

## 📌 Future Enhancements

* 📊 Advanced dashboard analytics
* 🔔 Notifications system
* 📱 Mobile responsiveness improvements
* 📤 Export to Excel
* 👨‍💼 Role-based access (Admin / Member)

---

## 🤝 Contribution

Contributions, issues, and feature requests are welcome.

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 🙌 Acknowledgement

Built with a focus on solving real-world society management problems using scalable and modern web technologies.
