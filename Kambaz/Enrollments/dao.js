import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function EnrollmentsDao(db) {
  async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
  }
  function enrollUserInCourse(userId, courseId) {
    return model.create({
      user: userId,
      course: courseId,
      _id: `${userId}-${courseId}`,
    });
  }
  function unenrollUserFromCourse(user, course) {
    return model.deleteOne({ user, course });
  }
  function unenrollAllUsersFromCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }

  async function findUsersForCourse(courseId) {
    const enrollments = await model
      .find({
        course: courseId,
      })
      .populate("user");
    return enrollments.map((e) => e.user);
  }

  function findEnrollments() {
    return db.enrollments || [];
  }

  function findEnrollmentsForUser(userId) {
    return (db.enrollments || []).filter((e) => e.userId === userId);
  }

  function findEnrollmentsForCourse(courseId) {
    return (db.enrollments || []).filter((e) => e.courseId === courseId);
  }

  function findEnrollmentById(enrollmentId) {
    return (db.enrollments || []).find((e) => e._id === enrollmentId);
  }

  function createEnrollment({ userId, courseId }) {
    const exists = (db.enrollments || []).some(
      (e) => e.userId === userId && e.courseId === courseId
    );
    if (exists) return { alreadyEnrolled: true };

    const newEnrollment = {
      _id: uuidv4(),
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
    };
    db.enrollments = [...(db.enrollments || []), newEnrollment];
    return newEnrollment;
  }

  function deleteEnrollment(enrollmentId) {
    db.enrollments = (db.enrollments || []).filter(
      (e) => e._id !== enrollmentId
    );
    return { deleted: true };
  }
  return {
    findCoursesForUser,
    enrollUserInCourse,
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse,
    findUsersForCourse,
    findEnrollments,
    findEnrollmentsForUser,
    findEnrollmentsForCourse,
    findEnrollmentById,
    createEnrollment,
    deleteEnrollment,
  };
}
