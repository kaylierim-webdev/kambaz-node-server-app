import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db);

  // retrieve all assignments for a course
  app.get("/api/courses/:courseId/assignments", (req, res) => {
    const { courseId } = req.params;
    const assignments = dao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  });

  // create an assignment under a course
  app.post("/api/courses/:courseId/assignments", (req, res) => {
    const { courseId } = req.params;
    const assignment = { ...req.body, course: courseId };
    const newAssignment = dao.createAssignment(assignment);
    res.json(newAssignment);
  });

  // retrieve a single assignment by id (optional but useful)
  app.get("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    const assignment = dao.findAssignmentById(assignmentId);
    if (!assignment) return res.status(404).send({ error: "Not found" });
    res.json(assignment);
  });

  // update assignment by id
  app.put("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    const updates = req.body;
    const updated = dao.updateAssignment(assignmentId, updates);
    if (!updated) return res.status(404).send({ error: "Not found" });
    res.json(updated);
  });

  // delete assignment by id
  app.delete("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    const result = dao.deleteAssignment(assignmentId);
    res.json(result);
  });
}
