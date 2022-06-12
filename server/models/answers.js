const db = require('../db/');

module.exports = {
  getAnswers: async (question_id, count = 5) => {
    try {
      const query = `SELECT
      a.id as answer_id,
      a.answer_body as body, a.answer_date as date,a.answerer_name as answerer_name, a.answer_helpfulness as helpfulness,
      (SELECT coalesce(json_agg(json_build_object(
        'id', photos.id, 'url', photos.url
        )), '[]'::json)
          as photos from photos
          where answer_id=a.id )
    FROM
      answers AS a
    WHERE
      a.reported = 0 AND
      question_id = ${question_id}
    GROUP BY
      a.id, question_id, body, date
    ORDER BY
      a.id
    LIMIT ${count};`;
      const answer = await db.query(query);
      return answer.rows;
    } catch (error) {
      res.sendStatus(404);
    }
  },

  postAnswer: async (
    question_id,
    body,
    name,
    email,
    photos = [],
    date_written = new Date().toISOString().slice(0, 10)
  ) => {
    try {
      const answer = await db.query(`
        INSERT INTO answers (question_id, answer_body, answer_date,  answerer_name, answerer_email)
        VALUES (${question_id}, '${body}', '${date_written}', '${name}', '${email}') RETURNING *`);
      const answer_id = answer.rows[0].id;

      for (let i = 0; i < photos.length; i++) {
        let url = photos[i];
        db.query(
          `INSERT INTO photos (answer_id, url) VALUES (${answer_id}, '${url}')`
        );
      }
      return answer.rows;
    } catch (error) {
      console.log(error);
    }
  },

  addHelpful: async (answer_id) => {
    try {
      const helpful = await db.query(`
        UPDATE answers
        SET answer_helpfulness = answer_helpfulness + 1
        WHERE id = ${answer_id}
        RETURNING *`);
      return helpful.rows;
    } catch (error) {
      console.log(error);
    }
  },

  addReport: async (answer_id) => {
    try {
      const reported = await db.query(`
        UPDATE answers
        SET reported = reported + 1
        WHERE id = ${answer_id}
        RETURNING *`);
      return reported.rows;
    } catch (error) {
      console.log(error);
    }
  },
};
