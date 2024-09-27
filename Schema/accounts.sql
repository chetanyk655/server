CREATE DATABASE accounts;
USE accounts;

CREATE TABLE admin_accounts(
	admin_id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(20) ,
    email VARCHAR(30),
    password VARCHAR(255)
);

CREATE TABLE member_accounts(
	member_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20),
    house_no INT UNIQUE,
    email VARCHAR(30),
    password VARCHAR(255)
);

