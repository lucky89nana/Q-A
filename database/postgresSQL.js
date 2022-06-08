CREATE TABLE Questions (
  id BIGSERIAL,
  product_id INTEGER,
  question_body VARCHAR(250),
  question_date TIMESTAMP,
  asker_name VARCHAR(50),
  question_helpfulness INTEGER,
  reported BOOLEAN
 );



 CREATE TABLE Answers (
  id BIGSERIAL,
  question_id INTEGER,
  answerer_name VARCHAR(50),
  answer_body VARCHAR(250),
  answer_date TIMESTAMP,
  helpfulness INTEGER,
  reported BOOLEAN
 );


 CREATE TABLE Photos (
  id BIGSERIAL,
  answer_id INTEGER,
  url VARCHAR(100)
 );


 CREATE TABLE Products (
  id BIGSERIAL
 );