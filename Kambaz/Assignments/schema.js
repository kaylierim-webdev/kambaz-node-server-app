import mongoose from "mongoose";

const assignmentsSchema = new mongoose.Schema(
  {
    _id: String,
    course: { type: String, ref: "CourseModel" },
    title: String,
    description: String,
    points: Number,
    dueDate: Date,
  },
  { collection: "assignments" }
);

export default assignmentsSchema;
