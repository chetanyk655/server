CREATE DATABASE accounts;

USE accounts;

CREATE TABLE member_accounts(
	member_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(30),
    password VARCHAR(255)
);
ALTER TABLE member_accounts
ADD COLUMN name VARCHAR(20);
ALTER TABLE member_accounts
ADD COLUMN  house_no INT;
CREATE TABLE notice(
	date VARCHAR(10),
    time VARCHAR(25),
	contents LONGTEXT,
    PRIMARY KEY (date,time)
);

CREATE TABLE admin_accounts(
	admin_id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(20) ,
    email VARCHAR(30),
    password VARCHAR(255)
);

CREATE TABLE feedbacks(
	f_id INT PRIMARY KEY AUTO_INCREMENT,
	feedback LONGTEXT,
    date VARCHAR(10),
    time VARCHAR(25)
);

CREATE TABLE complaints(
	c_id INT PRIMARY KEY AUTO_INCREMENT,
	complaint LONGTEXT,
    date VARCHAR(10),
    time VARCHAR(25)
);



DROP TABLE admin_accounts;
DROP TABLE member_accounts;
SELECT * FROM registration;
SELECT * FROM notice;