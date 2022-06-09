require('dotenv').config();
const { Pool } = require('pg');

const db = new Pool({
  user: process.env.DB_USERNAME,
  database: process.env.DB_DATABASENAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: process.env.DB_PORT,
});

db.connect()
  .then(() => console.log('Database is connected!'))
  .then(async () => {
    try {
      await db.query(
        `DROP TABLE IF EXISTS questions CASCADE;
        DROP TABLE IF EXISTS answers CASCADE;
        DROP TABLE IF EXISTS photos CASCADE;`
      );
      console.log('Existing tables are deleted...');

      await db.query(
        `CREATE TABLE if not exists questions (
          id SERIAL PRIMARY KEY,
          product_id INTEGER NOT NULL,
          question_body VARCHAR(255),
          question_date bigint,
          asker_name VARCHAR(50),
          asker_email VARCHAR(50),
          reported INTEGER DEFAULT 0,
          question_helpfulness INTEGER DEFAULT 0
        );
        CREATE TABLE if not exists answers (
          id SERIAL PRIMARY KEY,
          question_id INTEGER NOT NULL,
          answer_body VARCHAR(255),
          answer_date bigint,
          answerer_name VARCHAR(255),
          answerer_email VARCHAR(255),
          reported INTEGER DEFAULT 0,
          answer_helpfulness INTEGER
        );
        CREATE TABLE if not exists photos (
          id SERIAL PRIMARY KEY,
          answer_id INTEGER NOT NULL,
          url VARCHAR(255) NOT NULL
        );`
      );
      console.log('Questions, answers, and photos tables are created.');

      await Promise.all([
        await db.query(
          `COPY questions(id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness) FROM '/Users/lucky8/hr/Q-A/data/questions.csv' DELIMITER ',' CSV HEADER;`
        ),

        await db.query(
          `COPY answers(id, question_id, answer_body, answer_date, answerer_name, answerer_email, reported, answer_helpfulness) FROM '/Users/lucky8/hr/Q-A/data/answers.csv' DELIMITER ',' CSV HEADER;`
        ),

        await db.query(
          `COPY photos(id, answer_id, url) FROM '/Users/lucky8/hr/Q-A/data/answers_photos.csv' DELIMITER ',' CSV HEADER;`
        ),
      ]);
      console.log('Questions, answers, and photos tables are populated.');

      await db.query(`
      ALTER TABLE answers ADD COLUMN temp_date TIMESTAMP WITHOUT TIME ZONE NULL;
      UPDATE answers SET temp_date = to_timestamp(answer_date / 1000)::TIMESTAMP;
      ALTER TABLE answers ALTER COLUMN answer_date TYPE TIMESTAMP WITHOUT TIME ZONE USING temp_date;
      ALTER TABLE answers DROP COLUMN temp_date;
      ALTER TABLE questions ADD COLUMN temp_date TIMESTAMP WITHOUT TIME ZONE NULL;
      UPDATE questions SET temp_date = to_timestamp(question_date / 1000)::TIMESTAMP;
      ALTER TABLE questions ALTER COLUMN question_date TYPE TIMESTAMP WITHOUT TIME ZONE USING temp_date;
      ALTER TABLE questions DROP COLUMN temp_date;
      `);
      console.log(
        'Columns question_date and answer_date are converted to type timestamp.'
      );
    } catch (error) {
      console.log(error);
    }
  });

module.exports = db;
