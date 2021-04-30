CREATE DATABASE Ask;

USE Ask;

CREATE TABLE users(
	id INT AUTO_INCREMENT PRIMARY KEY,
	first_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,
    email VARCHAR(100),
    password VARCHAR(255),
    register_date DATETIME
);

SHOW TABLES;

CREATE TABLE questions(
	id INT AUTO_INCREMENT,
    user_id INT,
    content TEXT,
    no_like INT NULL,
    no_dislike INT NULL,
    post_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    PRIMARY KEY(id)
);

CREATE TABLE answers(
	id INT auto_increment,
    user_id INT,
    question_id INT,
    content TEXT,
	answer_time DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(user_id) REFERENCES users(id),
	FOREIGN KEY(question_id) REFERENCES questions(id),
    PRIMARY KEY(id)
);

