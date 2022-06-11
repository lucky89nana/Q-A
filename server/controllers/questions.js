const models = require('../models');

module.exports = {
  getQuestions: (req, res) => {
    const { product_id, page, count } = req.query;
    models.questions
      .getQuestions(product_id, count)
      .then((results) => {
        res.status(200).send(results);
      })
      .catch((error) => res.sendStatus(404));
  },

  postQuestion: (req, res) => {
    const { body, name, email, product_id } = req.body;
    models.questions
      .postQuestion(product_id, body, name, email)
      .then((result) => {
        if (result.length) {
          res.status(201).send('Thank you for posting!');
        } else {
          res.sendStatus(400);
        }
      })
      .catch((error) => res.sendStatus(400));
  },

  addHelpful: (req, res) => {
    const { question_id } = req.params;
    models.questions
      .addHelpful(question_id)
      .then((result) => {
        if (helpful.length) {
          res.status(204).send('Thank you for adding helpfulnesse!');
        } else {
          res.sendStatus(400);
        }
      })
      .catch((error) => res.sendStatus(400));
  },

  addReport: (req, res) => {
    const { question_id } = req.params;
    models.questions
      .addReport(question_id)
      .then((result) => {
        if (reported.length) {
          res.status(204).send('Thank you for reporting!');
        } else {
          res.sendStatus(400);
        }
      })
      .catch((error) => res.sendStatus(400));
  },
};
