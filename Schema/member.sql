CREATE DATABASE member_features;
USE member_features;

CREATE TABLE notice(
	date VARCHAR(10),
    time VARCHAR(25),
	contents LONGTEXT,
    PRIMARY KEY (date,time)
);

CREATE TABLE feedbacks(
	f_id INT PRIMARY KEY AUTO_INCREMENT,
	feedback LONGTEXT,
    date VARCHAR(10),
    time VARCHAR(25),
    filename VARCHAR(120),
    image LONGBLOB
);

CREATE TABLE complaints(
	c_id INT PRIMARY KEY AUTO_INCREMENT,
	complaint LONGTEXT,
    date VARCHAR(10),
    time VARCHAR(25),
    filename VARCHAR(120),
    image LONGBLOB
);

CREATE TABLE marketplace(
	prod_id INT PRIMARY KEY AUTO_INCREMENT,
    p_name VARCHAR(35),
    price DOUBLE,
    descp LONGTEXT,
    filename LONGTEXT,
    image LONGBLOB
);

CREATE TABLE facility(
	f_id INT PRIMARY KEY AUTO_INCREMENT,
    e_name VARCHAR(30),
    usr_mail VARCHAR(25),
    e_date DATE,
    e_time VARCHAR(15),
    e_desc LONGTEXT
);

