# 📚 Library Book Tracker

A modern **Library Management System** built using **Spring Boot, HTML, CSS, and JavaScript**.
This project helps manage books, track borrowing activity, and visualize data through a clean and interactive dashboard.

---

## 🚀 Features

* 🔐 **Login System** (Admin & Student roles)
* 📊 **Dashboard** with real-time statistics
* 📚 **Add, Delete, Search Books**
* 🔄 **Borrow & Return System**
* 🖼️ **Book Gallery View**
* 🌙 **Dark Mode Toggle**
* 🎯 **Role-Based Access Control**
* 📱 **Responsive UI Design**

---

## 🛠️ Tech Stack

| Layer    | Technology                 |
| -------- | -------------------------- |
| Backend  | Spring Boot (Java)         |
| Frontend | HTML, CSS, JavaScript      |
| Database | MySQL                      |
| Tools    | IntelliJ IDEA, Git, GitHub |

---

## 📁 Project Structure

```
Library-Book-Tracker/
│
├── src/
│   ├── main/
│   │   ├── java/com/library/libraryproject/
│   │   │   ├── Book.java
│   │   │   ├── BookRepository.java
│   │   │   ├── HomeController.java
│   │   │   ├── LibraryApplication.java
│   │   │   └── Stats.java
│   │   │
│   │   ├── resources/
│   │   │   ├── static/
│   │   │   │   ├── index.html
│   │   │   │   ├── script.js
│   │   │   │   ├── style.css
│   │   │   │   └── images/
│   │   │   │
│   │   │   └── application.properties
│
├── pom.xml
└── README.md
```

---

## ⚙️ How to Run the Project

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Harshitsinha27/Library-Book-Tracker.git
```

### 2️⃣ Open in IntelliJ IDEA

* Import as **Maven Project**

### 3️⃣ Configure Database (MySQL)

Update in `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/library
spring.datasource.username=root
spring.datasource.password=your_password
```

### 4️⃣ Run the application

* Run `LibraryApplication.java`

### 5️⃣ Open in browser

```
http://localhost:8080
```

---

## 🔑 Default Login

```
Username: admin
Password: 1234
```

---

## 📡 API Endpoints

| Endpoint             | Description     |
| -------------------- | --------------- |
| `/books`             | Get all books   |
| `/add?name=&author=` | Add new book    |
| `/borrow/{id}`       | Borrow book     |
| `/return/{id}`       | Return book     |
| `/delete/{id}`       | Delete book     |
| `/stats`             | Dashboard stats |

---

## 📸 Screenshots

> 👉 Add screenshots here for better presentation

Example:

* Dashboard UI
* Book Table
* Gallery View
* Login Page

---

## 🎯 Future Improvements

* 📅 Due Date & Overdue Tracking
* 👤 User Management System
* 📊 Charts & Analytics
* 🌐 Deployment (Cloud Hosting)

---

## 👨‍💻 Author

**Harshit Sinha**
🔗 GitHub: https://github.com/Harshitsinha27

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---
