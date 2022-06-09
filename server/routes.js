var router = require('express').Router();

const questions = require('./controllers/questions');
const answers = require('./controllers/answers');

//Connect controller methods to their corresponding routes
router.get('/', questions.getQuestions);

router.post('/', questions.postQuestion);

router.put('/:question_id/helpful', questions.addHelpful);

router.put('/:question_id/report', questions.addReport);

router.get('/:question_id/answers', answers.getAnswers);

router.post('/answers', answers.postAnswer);

router.put('/answers/:answer_id/helpful', answers.addHelpful);

router.put('/answers/:answer_id/report', answers.addReport);

module.exports = router;
