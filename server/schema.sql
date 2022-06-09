\c qa

DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS photos;
​
CREATE TABLE questions (
  id SERIAL primary key,
  product_id INTEGER NOT NULL,
  question_body VARCHAR(255),
  question_date VARCHAR(255),
  asker_name VARCHAR(50),
  asker_email VARCHAR(50),
  reported INTEGER DEFAULT 0,
  question_helpfulness INTEGER DEFAULT 0
)
​
CREATE TABLE answers (
  id SERIAL primary key,
  question_id INTEGER NOT NULL,
  answer_body VARCHAR(255),
  answer_date VARCHAR(255),
  answerer_name VARCHAR(255),
  answerer_email VARCHAR(255),
  reported INTEGER DEFAULT 0,
  answer_helpfulness INTEGER
)
​
CREATE TABLE photos (
  id SERIAL primary key,
  answer_id INTEGER NOT NULL,
  url VARCHAR(255) NOT NULL
)
​
COPY questions(id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness) FROM '/Users/lucky8/hr/Q-A/data/questions.csv' DELIMITER ',' CSV HEADER
​
COPY answers(id, question_id, answer_body, answer_date, answerer_name, answerer_email, reported, answer_helpfulness) FROM '/Users/lucky8/hr/Q-A/data/answers.csv' DELIMITER ',' CSV HEADER
​
COPY photos(id, answer_id, url) FROM '/Users/lucky8/hr/Q-A/data/answers_photos.csv' DELIMITER ',' CSV HEADER