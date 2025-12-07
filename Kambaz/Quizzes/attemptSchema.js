import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: String,
    user: String,
    attemptNumber: { type: Number, default: 1 },
    answers: [
      {
        questionId: String,
        answer: mongoose.Schema.Types.Mixed,
        isCorrect: Boolean,
      },
    ],
    score: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
  },
  { collection: "quiz_attempts" }
);

export default attemptSchema;