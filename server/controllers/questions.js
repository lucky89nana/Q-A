const Questions = require('../models/questions');

module.exports = {
  getQuestions: async (req, res) => {
    try {
      const { product_id, page, count } = req.query;
      const questions = await Questions.getQuestions(product_id, count);
      res.send(questions);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  },

  postQuestion: async (req, res) => {
    try {
      const { body, name, email, product_id } = req.body;
      const question = await Questions.postQuestion(
        product_id,
        body,
        name,
        email
      );
      if (question.length) {
        res.sendStatus(201);
      } else {
        res.sendStatus(400);
      }
    } catch (error) {
      res.status(400).json({ message: error });
    }
  },

  addHelpful: async (req, res) => {
    try {
      const { question_id } = req.params;
      const helpful = await Questions.addHelpful(question_id);
      if (helpful.length) {
        res.sendStatus(204);
      } else {
        res.sendStatus(400);
      }
    } catch (error) {
      res.status(400).json({ message: error });
    }
  },

  addReport: async (req, res) => {
    try {
      const { question_id } = req.params;
      const reported = await Questions.addReport(question_id);
      if (reported.length) {
        res.sendStatus(204);
      } else {
        res.sendStatus(400);
      }
    } catch (error) {
      res.status(400).json({ message: error });
    }
  },
};
