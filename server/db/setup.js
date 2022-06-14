require('dotenv').config();
const { Pool, Client } = require('pg');

const client = new Client({
  database: 'template1',
});

(async () => {
  try {
    await client.connect();
    await client.query(
      `DROP DATABASE IF EXISTS ${process.env.DB_DATABASENAME};`
    );
    await client.query(`CREATE DATABASE ${process.env.DB_DATABASENAME};`);
    await client.end();
    console.log(`Database ${process.env.DB_DATABASENAME} created.`);

    const db = new Pool({
      user: process.env.DB_USERNAME,
      database: process.env.DB_DATABASENAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      dialect: 'postgres',
      port: process.env.DB_PORT,
    });

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
        question_body text NOT NULL,
        question_date bigint,
        asker_name text NOT NULL,
        asker_email text NOT NULL,
        reported boolean DEFAULT FALSE,
        question_helpfulness INTEGER DEFAULT 0
      );
      CREATE TABLE if not exists answers (
        id SERIAL PRIMARY KEY,
        question_id INTEGER NOT NULL,
        answer_body text NOT NULL,
        answer_date bigint,
        answerer_name text NOT NULL,
        answerer_email text NOT NULL,
        reported boolean DEFAULT FALSE,
        answer_helpfulness INTEGER DEFAULT 0
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
        `COPY questions(id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness) FROM '${process.env.DB_PATH}/questions.csv' DELIMITER ',' CSV HEADER;`
      ),

      await db.query(
        `COPY answers(id, question_id, answer_body, answer_date, answerer_name, answerer_email, reported, answer_helpfulness) FROM '${process.env.DB_PATH}/answers.csv' DELIMITER ',' CSV HEADER;`
      ),

      await db.query(
        `COPY photos(id, answer_id, url) FROM '${process.env.DB_PATH}/answers_photos.csv' DELIMITER ',' CSV HEADER;`
      ),
    ]);
    console.log('Questions, answers, and photos tables are populated.');

    await db.query(
      `ALTER TABLE answers ALTER COLUMN answer_date TYPE TIMESTAMP USING (to_timestamp(answer_date::decimal/1000));
      ALTER TABLE questions ALTER COLUMN question_date TYPE TIMESTAMP USING (to_timestamp(question_date::decimal/1000));`
    );
    console.log(
      'Columns question_date and answer_date are converted to type timestamp.'
    );

    await db.query(
      `CREATE INDEX idx_product_id ON questions(product_id);
      CREATE INDEX questions_reported_index ON questions (reported);
      CREATE INDEX idx_question_id ON answers(question_id);
      CREATE INDEX answers_reported_index ON answers (reported);
      CREATE INDEX idx_answer_id ON photos(answer_id);`
    );
    console.log('CREATE INDEX FOR QUESTIONS, ANSWERS AND PHOTOS TABLES');

    await db.query(
      `SELECT setval('questions_id_seq', (SELECT max(id) FROM questions));
      SELECT setval('answers_id_seq', (SELECT max(id) FROM answers));
      SELECT setval('photos_id_seq', (SELECT max(id) FROM photos));`
    );
    console.log('RESET INCREMENTING ID TO THE LAST ITEM IN THE TABLE');
  } catch (error) {
    console.log(error);
  }
})();
