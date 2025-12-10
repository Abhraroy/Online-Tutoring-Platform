
import { Router } from "express";
import { getUser } from "../Controllers/UserController.js";

const router = Router();
router.get("/",getUser);


export default router;