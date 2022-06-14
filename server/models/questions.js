const db = require('../db/');

module.exports = {
  getQuestions: (product_id, page = 1, count = 5) => {
    const skipPage = count * (page - 1);
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
          a.reported = false
        )
      )), '[]'::json) AS results
      FROM
      questions as q
      WHERE
      q.product_id = ${product_id} AND
      q.reported = false LIMIT ${count} OFFSET ${skipPage};
      `;
    return db
      .query(query)
      .then((res) => res.rows[0])
      .catch((error) => console.log(error));
  },

  postQuestion: (
    product_id,
    body,
    name,
    email,
    date_written = new Date().toISOString().slice(0, 10)
  ) => {
    const query = `
        INSERT INTO questions (product_id, question_body, question_date, asker_name, asker_email)
        VALUES (${product_id}, '${body}', '${date_written}', '${name}', '${email}') RETURNING *`;
    return db
      .query(query)
      .then((res) => res.rows)
      .catch((error) => console.log(error));
  },

  addHelpful: (question_id) => {
    const query = `
        UPDATE questions
        SET question_helpfulness = question_helpfulness + 1
        WHERE id = ${question_id}
        RETURNING *`;
    return db
      .query(query)
      .then((res) => res.rows)
      .catch((error) => console.log(error));
  },

  addReport: (question_id) => {
    const query = `
        UPDATE questions
        SET reported = true
        WHERE id = ${question_id}
        RETURNING *`;
    return db
      .query(query)
      .then((res) => res.rows)
      .catch((error) => console.log(error));
  },
};
