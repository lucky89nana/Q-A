const mongoose = require('mongoose');

const answerPhotosSchema = new mongoose.Schema({
  photoId: Number,
  url: String,
});

const answersSchema = new mongoose.Schema({
  answerId: Number,
  text: String,
  name: String,
  email: String,
  reported: Boolean,
  helpful: Number,
  photos: [answerPhotosSchema],
});

const questionsSchema = new mongoose.Schema({
  questionId: Number,
  dateWritten: Date,
  text: String,
  name: String,
  email: String,
  reported: Boolean,
  helpful: Number,
  answers: [answersSchema],
});

const qASchema = new mongoose.Schema({
  productId: Number,
  questions: [questionsSchema],
});

const qAModel = mongoose.model('QuestionsAndAnswers', qASchema);

module.exports = {
  qAModel,
};
