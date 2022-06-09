const db = require('../db/');

module.exports = {
  getQuestions: async (product_id, count) => {
    try {
      const query = `
      SELECT question_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness
      FROM questions WHERE product_id = ${product_id} AND reported = 0`;

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
