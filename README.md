Expense Tracker Web App
A full-stack web application to track your daily expenses with features like user authentication, expense add/update/delete, and visual summary using a pie chart.

Built with React.js, Node.js/Express, and MySQL.
UI with Material-UI (MUI)

Features:

1. User Registration & Login
2. Add Expenses (with category, amount, and comments)
3. Edit or Delete Expenses
4. Pie Chart to visualize spending by category

File Structure:
project-root/
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/       # LoginPage, ExpensePage
│   │   └── App.js
├── server/              # Express backend
│   ├── index.js         # Server   
│ 
└── db.js                # MySQL connection
└── README.md

Edit db.js:

    DB_HOST=localhost
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_NAME=your_database_name
    PORT=5000


Database Schema:

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE expense (
    expense_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    category VARCHAR(50),
    amount INT,
    comments VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

Operating Instructions:

    1. Login & Registration:
        Register: New users must register with a unique username and password.

        Login: Enter your registered credentials to log in.

        Invalid login attempts will show an error message.

    2. Add Expense:
        Go to the Expense Page after login.

        Enter the amount and select a category (e.g., Food, Clothing).

        Optionally, add a comment.

        Click "Add Expense" to store the data.

    3. Delete Expense:
        Enter the Expense ID (visible in the expense table).

        Click "Delete Expense" to remove it from the database.

    4. Update Expense
        Enter the existing Expense ID.

        Fill in the new amount, category, or comment.

        Click "Update Expense" to update the record.

    Note: All actions are user-specific; you will only see and modify your own expenses.
