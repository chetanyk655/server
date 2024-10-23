CREATE DATABASE member_features;
USE member_features;



CREATE TABLE feedbacks(
	f_id INT PRIMARY KEY AUTO_INCREMENT,
	feedback LONGTEXT,
    usr_mail VARCHAR(25),
    date VARCHAR(10),
    time VARCHAR(25),
    filename VARCHAR(120),
    image LONGBLOB,
    f_status VARCHAR(15) DEFAULT "UNAVAILABLE"
);

CREATE TABLE complaints(
	c_id INT PRIMARY KEY AUTO_INCREMENT,
	complaint LONGTEXT,
    usr_mail VARCHAR(25),
    date VARCHAR(10),
    time VARCHAR(25),
    filename VARCHAR(120),
    image LONGBLOB,
    c_status VARCHAR(15) DEFAULT "UNAVAILABLE"
);

CREATE TABLE marketplace(
	prod_id INT PRIMARY KEY AUTO_INCREMENT,
    p_name VARCHAR(35),
    price DOUBLE,
    descp LONGTEXT,
    filename LONGTEXT,
    image LONGBLOB,
    ph_no LONG
);

CREATE TABLE facility(
	f_id INT PRIMARY KEY AUTO_INCREMENT,
    e_name VARCHAR(30),
    usr_mail VARCHAR(25),
    e_date DATE,
    e_time VARCHAR(15),
    e_desc LONGTEXT,
    f_status VARCHAR(15) DEFAULT "UNAVAILABLE"
);

