CREATE DATABASE student_management;

USE student_management;

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    course VARCHAR(50),
    year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO students (first_name, last_name, email, phone, course, year) VALUES
('John', 'Doe', 'john.doe@example.com', '9876543210', 'Computer Science', 2),
('Jane', 'Smith', 'jane.smith@example.com', '9876543211', 'Electronics', 3),
('Mike', 'Johnson', 'mike.j@example.com', '9876543212', 'Mechanical', 1);

SELECT * FROM students;