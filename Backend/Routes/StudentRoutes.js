import { Router } from "express";
import { registerStudent, loginStudent, bookSession, getSessions, getBookedSessions, logoutStudent, getSessionById, deleteBookedSession } from "../Controllers/StudentController.js";
import { authMiddleware } from "../Middleware/AuthMiddleware.js";

const router = Router();


router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.post("/logout", authMiddleware("student"), logoutStudent);
router.get("/session/:sessionId", authMiddleware("student"), getSessionById);
router.post("/book/:sessionId", authMiddleware("student"), bookSession);
router.get("/sessions", authMiddleware("student"), getSessions);
router.get("/booked-sessions", authMiddleware("student"), getBookedSessions);
router.delete("/booked-sessions/:sessionId", authMiddleware("student"), deleteBookedSession);




export default router;