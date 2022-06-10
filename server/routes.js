const router = require('express').Router();

const controller = require('./controllers');

//Connect controller methods to their corresponding routes
router.get('/questions', controller.questions.getQuestions);

router.get('/questions/:question_id/answers', controller.answers.getAnswers);

router.post('/questions', controller.questions.postQuestion);

router.post('/questions/:question_id/answers', controller.answers.postAnswer);

router.put('/questions/:question_id/helpful', controller.questions.addHelpful);

router.put('/questions/:question_id/report', controller.questions.addReport);

router.put('/answers/:answer_id/helpful', controller.answers.addHelpful);

router.put('/answers/:answer_id/report', controller.answers.addReport);

module.exports = router;
