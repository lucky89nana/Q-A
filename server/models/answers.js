const db = require('../db/');

module.exports = {
  getAnswers: (question_id, page = 1, count = 5) => {
    const skipPage = count * (page - 1);
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
      a.reported = false AND
      question_id = ${question_id}
    GROUP BY
      a.id, question_id, body, date
    ORDER BY
      a.id
    LIMIT ${count} OFFSET ${skipPage};`;
    return db
      .query(query)
      .then((res) => {
        const answer = {
          question: question_id,
          page: page,
          count: count,
          results: res.rows,
        };
        return answer;
      })
      .catch((error) => console.log(error));
  },

  postAnswer: (
    question_id,
    body,
    name,
    email,
    photos = [],
    date_written = new Date().toISOString().slice(0, 10)
  ) => {
    const query = `
        INSERT INTO answers (question_id, answer_body, answer_date,  answerer_name, answerer_email)
        VALUES (${question_id}, '${body}', '${date_written}', '${name}', '${email}') RETURNING *`;

    return db
      .query(query)
      .then((res) => {
        const answer_id = res.rows[0].id;
        for (let i = 0; i < photos.length; i++) {
          let url = photos[i];
          db.query(
            `INSERT INTO photos (answer_id, url) VALUES (${answer_id}, '${url}')`
          );
        }
        return res.rows;
      })
      .catch((error) => console.log(error));
  },

  addHelpful: (answer_id) => {
    const query = `
        UPDATE answers
        SET answer_helpfulness = answer_helpfulness + 1
        WHERE id = ${answer_id}
        RETURNING *`;
    return db
      .query(query)
      .then((res) => res.rows)
      .catch((error) => console.log(error));
  },

  addReport: (answer_id) => {
    const query = `
        UPDATE answers
        SET reported = true
        WHERE id = ${answer_id}
        RETURNING *`;
    return db
      .query(query)
      .then((res) => res.rows)
      .catch((error) => console.log(error));
  },
};
