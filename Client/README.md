Expense Tracker Web App
A full-stack web application to track your daily expenses with features like user authentication, expense add/update/delete, and visual summary using a pie chart.

Built with React.js, Node.js/Express, and MySQL.
UI with Material-UI (MUI)

Features:

1. User Registration & Login
2. Add Expenses (with category, amount, and comments)
3. Edit or Delete Expenses
4. Pie Chart to visualize spending by category


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
        Use the checkboxes in the table to select multiple expenses.

        Click the 🗑️ delete icon button at the top of the table.
        
        All selected expenses will be deleted at once.

    4. Update Expense
       Click the Update button next to the expense you want to edit.

        A popup dialog will appear with the current details pre-filled.
        
        Modify the Category, Amount, or Comment.
        
        Click Save Changes.
        
        The table and chart will refresh to reflect the updated expense.

    Note: All actions are user-specific; you will only see and modify your own expenses.
