import mongoose from "mongoose";

const ChoiceSchema = new mongoose.Schema(
  {
    _id: String,
    text: String,
    correct: { type: Boolean, default: false },
  },
  { _id: false }
);

const MultipleChoiceQuestionSchema = new mongoose.Schema(
  {
    _id: String,
    type: { type: String, default: "multiple_choice" },
    title: String,
    question: String, // can contain HTML (from WYSIWYG) or plain text
    points: { type: Number, default: 1 },
    choices: [ChoiceSchema],
  },
  { _id: false }
);

const TrueFalseQuestionSchema = new mongoose.Schema(
  {
    _id: String,
    type: { type: String, default: "true_false" },
    title: String,
    question: String,
    points: { type: Number, default: 1 },
    answerIsTrue: { type: Boolean, default: true },
  },
  { _id: false }
);

const FillBlankQuestionSchema = new mongoose.Schema(
  {
    _id: String,
    type: { type: String, default: "fill_blank" },
    title: String,
    question: String,
    points: { type: Number, default: 1 },
    answers: [String], // list of acceptable answers (case-insensitive compare on front-end/back-end)
  },
  { _id: false }
);

// A generic Question schema that can contain any of the above via a mixed array
const QuestionSchema = new mongoose.Schema(
  {
    _id: String,
    // We'll store question type to know which fields are present
    type: String, // "multiple_choice", "true_false", "fill_blank"
    // Common fields:
    title: String,
    question: String,
    points: { type: Number, default: 1 },
    // Specific fields:
    choices: [ChoiceSchema],
    answerIsTrue: Boolean,
    answers: [String],
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    _id: String,
    course: { type: String, ref: "CourseModel" },
    title: { type: String, default: "New Quiz" },
    description: { type: String, default: "" },
    quizType: { type: String, default: "graded_quiz" }, // "graded_quiz", "practice_quiz", "graded_survey", "ungraded_survey"
    assignmentGroup: { type: String, default: "Quizzes" },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimitMinutes: { type: Number, default: 20 },
    timeLimitEnabled: { type: Boolean, default: false },
    multipleAttempts: { type: Boolean, default: false },
    howManyAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: Boolean, default: false },
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    dueDate: Date,
    availableDate: Date,
    untilDate: Date,
    published: { type: Boolean, default: false },
    points: { type: Number, default: 0 }, // sum of question points; kept updated by dao
    questions: [QuestionSchema],
  },
  { collection: "quizzes" }
);

export default quizSchema;
