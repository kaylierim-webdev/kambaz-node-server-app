import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  app.post("/api/enrollments", (req, res) => {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) return res.status(400).send({ error: "userId and courseId required" });
    const result = dao.createEnrollment({ userId, courseId });
    res.json(result);
  });

  app.delete("/api/enrollments/:enrollmentId", (req, res) => {
    const { enrollmentId } = req.params;
    const result = dao.deleteEnrollment(enrollmentId);
    res.json(result);
  });

  app.get("/api/users/:userId/enrollments", (req, res) => {
    const { userId } = req.params;
    const enrollments = dao.findEnrollmentsForUser(userId);
    res.json(enrollments);
  });

  app.get("/api/courses/:courseId/enrollments", (req, res) => {
    const { courseId } = req.params;
    const enrollments = dao.findEnrollmentsForCourse(courseId);
    res.json(enrollments);
  });
}
