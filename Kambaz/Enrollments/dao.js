import { v4 as uuidv4 } from "uuid";
export default function EnrollmentsDao(db) {
  function enrollUserInCourse(userId, courseId) {
    const { enrollments } = db;
    enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
  }
  function findEnrollments() {
    return db.enrollments || [];
  }

  function findEnrollmentsForUser(userId) {
    return (db.enrollments || []).filter(e => e.userId === userId);
  }

  function findEnrollmentsForCourse(courseId) {
    return (db.enrollments || []).filter(e => e.courseId === courseId);
  }

  function findEnrollmentById(enrollmentId) {
    return (db.enrollments || []).find(e => e._id === enrollmentId);
  }

  function createEnrollment({ userId, courseId }) {
    const exists = (db.enrollments || []).some(e => e.userId === userId && e.courseId === courseId);
    if (exists) return { alreadyEnrolled: true };

    const newEnrollment = { _id: uuidv4(), userId, courseId, enrolledAt: new Date().toISOString() };
    db.enrollments = [...(db.enrollments || []), newEnrollment];
    return newEnrollment;
  }

  function deleteEnrollment(enrollmentId) {
    db.enrollments = (db.enrollments || []).filter(e => e._id !== enrollmentId);
    return { deleted: true };
  }
  return { enrollUserInCourse,
    findEnrollments,
    findEnrollmentsForUser,
    findEnrollmentsForCourse,
    findEnrollmentById,
    createEnrollment,
    deleteEnrollment,
   };
}
