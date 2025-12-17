
import { Router } from "express";
import { getUser } from "../Controllers/Usercontroller.js";

const router = Router();
router.get("/",getUser);

export default router;