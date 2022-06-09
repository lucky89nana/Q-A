const db = require('../db/');

module.exports = {
  getQuestions: async (product_id, count) => {
    try {
      const query = `
      SELECT ${product_id} AS product_id,
      coalesce(json_agg(json_build_object(
        'question_id', q.id, 'question_body', q.question_body, 'question_date', q.question_date,
        'question_helpfulness', q.question_helpfulness, 'reported', q.reported, 'asker_name', q.asker_name, 'answers',
        (
          SELECT coalesce(json_object_agg(a.id, json_build_object(
            'id', a.id, 'body', a.answer_body, 'date', a.answer_date,
            'answerer_name', a.answerer_name, 'helpfulness', a.answer_helpfulness, 'photos', (
            SELECT
              coalesce(json_agg(json_build_object(
                'id', photos.id, 'url', photos.url
                )), '[]'::json)
            FROM
              photos
            WHERE
              photos.answer_id = a.id
              )
              )), '{}'::json)
          FROM
          answers AS a
          WHERE
          a.question_id = q.id AND
          a.reported = 0
        )
      )), '[]'::json) AS results
      FROM
      questions as q
      WHERE
      q.product_id = ${product_id} AND
      q.reported = 0;
      `;

      const questions = await db.query(query);
      return questions.rows[0];
    } catch (error) {
      console.log(error);
    }
  },

  postQuestion: async (
    product_id,
    body,
    name,
    email,
    date_written = new Date().toISOString().slice(0, 10)
  ) => {
    try {
      const question = await db.query(`
        INSERT INTO questions (product_id, question_body, question_date, asker_name, asker_email)
        VALUES (${product_id}, '${body}', '${date_written}', '${name}', '${email}' RETURNING *`);
      return question.rows;
    } catch (error) {
      console.log(error);
    }
  },

  addHelpful: async (question_id) => {
    try {
      const helpful = await db.query(`
        UPDATE questions
        SET question_helpfulness = question_helpfulness + 1
        WHERE id = ${question_id}
        RETURNING *`);
      return helpful.rows;
    } catch (error) {
      console.log(error);
    }
  },

  addReport: async (question_id) => {
    try {
      const reported = await db.query(`
        UPDATE questions
        SET reported = reported + 1
        WHERE id = ${question_id}
        RETURNING *`);
      return reported.rows;
    } catch (error) {
      console.log(error);
    }
  },
};
