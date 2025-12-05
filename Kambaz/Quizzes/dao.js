import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function QuizzesDao() {
  async function findQuizzesForCourse(courseId) {
    // return quizzes for a course, sorted by availableDate (oldest first),
    // unpublished quizzes should also be returned.
    return model.find({ course: courseId }).sort({ availableDate: 1 });
  }

  async function findQuizById(quizId) {
    return model.findById(quizId);
  }

  async function createQuiz(courseId, quiz = {}) {
    const defaultQuiz = {
      _id: uuidv4(),
      course: courseId,
      title: "New Quiz",
      description: "",
      quizType: "graded_quiz",
      assignmentGroup: "Quizzes",
      shuffleAnswers: true,
      timeLimitEnabled: false,
      timeLimitMinutes: 20,
      multipleAttempts: false,
      howManyAttempts: 1,
      showCorrectAnswers: false,
      accessCode: "",
      oneQuestionAtATime: true,
      webcamRequired: false,
      lockQuestionsAfterAnswering: false,
      published: false,
      points: 0,
      questions: [],
    };
    const newQuiz = {
      ...defaultQuiz,
      ...quiz,
      _id: uuidv4(),
      course: courseId,
    };
    return model.create(newQuiz);
  }

  async function updateQuiz(quizId, quizUpdates) {
    // if questions or points are included, they will be saved
    // keep points consistent (front-end might compute, but recompute here if questions provided)
    if (quizUpdates.questions) {
      quizUpdates.points = (quizUpdates.questions || []).reduce(
        (sum, q) => sum + (Number(q.points) || 0),
        0
      );
    }
    return model.updateOne({ _id: quizId }, { $set: quizUpdates });
  }

  async function deleteQuiz(quizId) {
    return model.deleteOne({ _id: quizId });
  }

  async function setPublished(quizId, published) {
    return model.updateOne({ _id: quizId }, { $set: { published } });
  }

  // question level
  async function addQuestion(quizId, question) {
    const q = { ...question, _id: uuidv4() };
    // ensure numeric points
    if (q.points == null) q.points = 1;
    // push question and update points sum atomically:
    const quiz = await model.findById(quizId);
    if (!quiz) throw new Error("Quiz not found");
    quiz.questions.push(q);
    quiz.points = (quiz.questions || []).reduce(
      (s, x) => s + (Number(x.points) || 0),
      0
    );
    await quiz.save();
    return q;
  }

  async function updateQuestion(quizId, questionId, questionUpdates) {
    // use positional operator
    const quiz = await model.findOne({
      _id: quizId,
      "questions._id": questionId,
    });
    if (!quiz) throw new Error("Quiz or question not found");
    const idx = quiz.questions.findIndex((q) => q._id === questionId);
    if (idx === -1) throw new Error("Question not found");
    // merge updates
    quiz.questions[idx] = {
      ...quiz.questions[idx].toObject(),
      ...questionUpdates,
    };
    // recompute points
    quiz.points = (quiz.questions || []).reduce(
      (s, x) => s + (Number(x.points) || 0),
      0
    );
    await quiz.save();
    return quiz.questions[idx];
  }

  async function deleteQuestion(quizId, questionId) {
    const quiz = await model.findById(quizId);
    if (!quiz) throw new Error("Quiz not found");
    quiz.questions = quiz.questions.filter((q) => q._id !== questionId);
    quiz.points = (quiz.questions || []).reduce(
      (s, x) => s + (Number(x.points) || 0),
      0
    );
    await quiz.save();
    return { deleted: true };
  }

  return {
    findQuizzesForCourse,
    findQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    setPublished,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  };
}
