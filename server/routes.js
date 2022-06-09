var router = require('express').Router();

const questions = require('./controllers/questions');
const answers = require('./controllers/answers');

//Connect controller methods to their corresponding routes
router.get('/questions', questions.getQuestions);

router.get('/questions/:question_id/answers', answers.getAnswers);

router.post('/questions', questions.postQuestion);

router.post('/questions/:question_id/answers', answers.postAnswer);

router.put('/questions/:question_id/helpful', questions.addHelpful);

router.put('/questions/:question_id/report', questions.addReport);

router.put('/answers/:answer_id/helpful', answers.addHelpful);

router.put('/answers/:answer_id/report', answers.addReport);

module.exports = router;
