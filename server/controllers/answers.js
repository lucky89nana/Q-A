const models = require('../models');

module.exports = {
  getAnswers: (req, res) => {
    const { question_id } = req.params;
    const { count } = req.query;
    const result = {
      question: question_id,
      results: [],
    };
    models.answers
      .getAnswers(question_id, count)
      .then((results) => {
        result.results = results;
        res.status(200).send(result);
      })
      .catch((error) => res.sendStatus(404));
  },

  postAnswer: (req, res) => {
    const { question_id } = req.query;
    const { body, name, email, photos } = req.body;
    models.answers
      .postAnswer(question_id, body, name, email, photos)
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
    const { answer_id } = req.params;
    models.answers
      .addHelpful(answer_id)
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
    const { answer_id } = req.params;
    models.answers
      .addReport(answer_id)
      .then((result) => {
        if (reported.length) {
          res.status(204).send('Thank you for reporting!');
        } else {
          res.sendStatus(400);
        }
      })
      .catch((error) => res.res.sendStatus(400));
  },
};
