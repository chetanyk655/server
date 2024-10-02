CREATE DATABASE admin_features;
USE admin_features;

CREATE TABLE notice(
	date VARCHAR(10),
    time VARCHAR(25),
	contents LONGTEXT,
    PRIMARY KEY (date,time)
);

CREATE TABLE bills (
	b_id INT PRIMARY KEY AUTO_INCREMENT,
    bill_amount double,
    m_email VARCHAR(25),
    name VARCHAR(255),
    type VARCHAR(50),  -- To store file type (e.g., pdf, image/jpeg, etc.)
    file_data LONGBLOB
)AUTO_INCREMENT = 100;


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

CREATE TABLE maintenance (
	maint_id INT PRIMARY KEY AUTO_INCREMENT,
    bill_id INT,
    amount double,
    m_email VARCHAR(30),
    pay_status VARCHAR(10)
);




    

