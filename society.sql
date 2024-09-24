CREATE DATABASE accounts;

USE accounts;

CREATE TABLE registration(
	user_id INT PRIMARY KEY,
	username VARCHAR(20),
    password VARCHAR(30) NOT NULL
);

INSERT INTO  registration (user_id,username,password) VALUES (100,"chetanyk655","123456yk655");

SELECT * FROM registration;