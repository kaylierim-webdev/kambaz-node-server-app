// quizzes/routes.js
import QuizzesDao from "./dao.js";
import { v4 as uuidv4 } from "uuid";

export default function QuizzesRoutes(app, db) {
  const dao = QuizzesDao(db);

  // List quizzes for a course (sorted by availableDate by dao)
  app.get("/api/courses/:cid/quizzes", async (req, res) => {
    try {
      const quizzes = await dao.findQuizzesForCourse(req.params.cid);
      res.json(quizzes);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

  // Create a new quiz with defaults and return it
  app.post("/api/courses/:cid/quizzes", async (req, res) => {
    try {
      const quizBody = req.body || {};
      const newQuiz = await dao.createQuiz(req.params.cid, quizBody);
      res.json(newQuiz);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

  // Get a single quiz
  app.get("/api/quizzes/:qid", async (req, res) => {
    try {
      const quiz = await dao.findQuizById(req.params.qid);
      if (!quiz) {
        res.sendStatus(404);
        return;
      }
      res.json(quiz);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

  // Update whole quiz (metadata / questions)
  app.put("/api/quizzes/:qid", async (req, res) => {
    try {
      const status = await dao.updateQuiz(req.params.qid, req.body);
      res.send(status);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

  // Delete quiz
  app.delete("/api/quizzes/:qid", async (req, res) => {
    try {
      const status = await dao.deleteQuiz(req.params.qid);
      res.send(status);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

  // Publish/unpublish toggle endpoint - payload { published: true|false } (or PUT to toggle)
  app.put("/api/quizzes/:qid/publish", async (req, res) => {
    try {
      const { published } = req.body;
      const status = await dao.setPublished(req.params.qid, !!published);
      res.send(status);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

  // Question-level endpoints
  // Add a new question to quiz
  app.post("/api/quizzes/:qid/questions", async (req, res) => {
    try {
      const question = req.body || {};
      const newQuestion = await dao.addQuestion(req.params.qid, question);
      res.json(newQuestion);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Update a question
  app.put("/api/quizzes/:qid/questions/:qqid", async (req, res) => {
    try {
      const updated = await dao.updateQuestion(
        req.params.qid,
        req.params.qqid,
        req.body
      );
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Delete a question
  app.delete("/api/quizzes/:qid/questions/:qqid", async (req, res) => {
    try {
      const status = await dao.deleteQuestion(req.params.qid, req.params.qqid);
      res.json(status);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
}
