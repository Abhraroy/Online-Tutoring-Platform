import { Router } from "express";
import { registerStudent, loginStudent, bookSession, getSessions, getBookedSessions, logoutStudent, getSessionById, deleteBookedSession, getStudentProfile, updateStudentProfile, getAllTutors, hireTutor, followTutor, unfollowTutor, getFollowedTutors, pastSessions } from "../Controllers/StudentController.js";
import { authMiddleware } from "../Middleware/AuthMiddleware.js";

const router = Router();


router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.post("/logout", authMiddleware("student"), logoutStudent);
router.get("/session/:sessionId", authMiddleware("student"), getSessionById);
router.post("/book/:sessionId", authMiddleware("student"), bookSession);
router.get("/sessions", authMiddleware("student"), getSessions);
router.get("/booked-sessions", authMiddleware("student"), getBookedSessions);
router.get("/profile", authMiddleware("student"), getStudentProfile);
router.delete("/booked-sessions/:sessionId", authMiddleware("student"), deleteBookedSession);
router.put("/profile", authMiddleware("student"), updateStudentProfile);
router.get("/all-tutors", authMiddleware("student"), getAllTutors);
router.post("/hire/:tutorId", authMiddleware("student"), hireTutor);
router.post("/follow/:tutorId", authMiddleware("student"), followTutor);
router.post("/unfollow/:tutorId", authMiddleware("student"), unfollowTutor);
router.get("/followed-tutors", authMiddleware("student"), getFollowedTutors);
router.get("/past-sessions", authMiddleware("student"), pastSessions);

export default router;