const db = require('../db/');

module.exports = {
  getAnswers: async (question_id, count) => {
    try {
      const query = `
      SELECT question_id, answer_body, answer_date, answerer_name, answerer_email, reported, answer_helpfulness
      FROM answers WHERE question_id = ${question_id} AND reported = 0`;

      const answer = await db.query(query);

      return answer.rows;
    } catch (error) {
      res.status(400).json({ message: error });
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
        INSERT INTO answers (question_id, answer_body, answer_date, answerer_name, answerer_email)
        VALUES (${question_id}, '${body}', '${date_written}', '${name}', '${email}' RETURNING *`);

      const answer_id = answer.rows[0].id;

      for (let i = 0; i < photos.length; i++) {
        let url = photos[i];
        db.query(
          `INSERT INTO photos (answer_id, url) VALUES (${answer_id}, '${url}')`
        );
      }
      return answer.rows;
    } catch (error) {
      res.status(400).json({ message: error });
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
      res.status(400).json({ message: error });
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
      res.status(400).json({ message: error });
    }
  },
};
