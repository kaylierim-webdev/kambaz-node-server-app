import AssignmentsDao from "./dao.js";
import { v4 as uuidv4 } from "uuid";

export default function AssignmentsRoutes(app) {
  const dao = AssignmentsDao();

  app.get("/api/courses/:cid/assignments", async (req, res) => {
    const assignments = await dao.findAssignmentsForCourse(req.params.cid);
    res.json(assignments);
  });

  app.post("/api/courses/:cid/assignments", async (req, res) => {
    const assignment = {
      ...req.body,
      _id: uuidv4(),
      course: req.params.cid,
    };
    const newAssignment = await dao.createAssignment(assignment);
    res.json(newAssignment);
  });

  app.put("/api/assignments/:aid", async (req, res) => {
    const status = await dao.updateAssignment(req.params.aid, req.body);
    res.send(status);
  });

  app.delete("/api/assignments/:aid", async (req, res) => {
    const status = await dao.deleteAssignment(req.params.aid);
    res.send(status);
  });
}
