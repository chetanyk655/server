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
    time VARCHAR(25)
);

CREATE TABLE complaints(
	c_id INT PRIMARY KEY AUTO_INCREMENT,
	complaint LONGTEXT,
    date VARCHAR(10),
    time VARCHAR(25)
);
