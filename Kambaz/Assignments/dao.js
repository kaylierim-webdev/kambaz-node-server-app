import model from "./model.js";

export default function AssignmentsDao() {
  function findAssignments() {
    return model.find();
  }

  function findAssignmentsForCourse(courseId) {
    return model.find({ course: courseId });
  }

  function findAssignmentById(assignmentId) {
    return model.findById(assignmentId);
  }

  function createAssignment(assignment) {
    return model.create(assignment);
  }

  function updateAssignment(assignmentId, assignment) {
    return model.updateOne({ _id: assignmentId }, assignment);
  }

  function deleteAssignment(assignmentId) {
    return model.deleteOne({ _id: assignmentId });
  }

  return {
    findAssignments,
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}
