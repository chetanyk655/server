CREATE DATABASE admin_features;
USE admin_features;

CREATE TABLE notice(
	date VARCHAR(10),
    time VARCHAR(25),
	contents LONGTEXT,
    PRIMARY KEY (date,time)
);

CREATE TABLE payments (
	p_id INT PRIMARY KEY AUTO_INCREMENT,
    bill_amount double,
    email VARCHAR(25)
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