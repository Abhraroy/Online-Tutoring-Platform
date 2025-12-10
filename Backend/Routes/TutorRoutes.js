import { Router } from "express";
import { registerTutor, loginTutor, createTutorSession, getTutorSessions, getBookedTutorSessions, logoutTutor, deleteBookedTutorSession, deleteTutorSession } from "../Controllers/TutorController.js";
import { authMiddleware } from "../Middleware/AuthMiddleware.js";
const router = Router();


router.post("/register", registerTutor);
router.post("/login", loginTutor);
router.post("/logout", authMiddleware("tutor"), logoutTutor);
router.post("/create-session", authMiddleware("tutor"), createTutorSession);
router.get("/sessions", authMiddleware("tutor"), getTutorSessions);
router.get("/booked-sessions", authMiddleware("tutor"), getBookedTutorSessions);
router.delete("/booked-sessions/:sessionId", authMiddleware("tutor"), deleteBookedTutorSession);
router.delete("/sessions/:sessionId", authMiddleware("tutor"), deleteTutorSession);

export default router;