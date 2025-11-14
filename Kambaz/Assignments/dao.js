import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  function findAssignments() {
    return db.assignments || [];
  }

  function findAssignmentsForCourse(courseId) {
    const { assignments = [] } = db;
    return assignments.filter(a => a.course === courseId);
  }

  function findAssignmentById(assignmentId) {
    const { assignments = [] } = db;
    return assignments.find(a => a._id === assignmentId);
  }

  function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    db.assignments = [...(db.assignments || []), newAssignment];
    return newAssignment;
  }

  function updateAssignment(assignmentId, updates) {
    const { assignments = [] } = db;
    const assignment = assignments.find(a => a._id === assignmentId);
    if (!assignment) return null;
    Object.assign(assignment, updates);
    return assignment;
  }

  function deleteAssignment(assignmentId) {
    db.assignments = (db.assignments || []).filter(a => a._id !== assignmentId);
    return { deleted: true };
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
