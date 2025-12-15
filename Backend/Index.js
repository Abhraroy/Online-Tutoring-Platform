import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import { DB_CONNECT } from "./DB/DB_CONNECT.js";
import StudentRoutes from "./Routes/StudentRoutes.js";
import TutorRoutes from "./Routes/TutorRoutes.js";
import userRoutes from "./Routes/UserRoutes.js";

const app = express();

app.use(cors({
    origin:process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);
app.enable("trust proxy");






app.use("/student", StudentRoutes);
app.use("/tutor", TutorRoutes);
app.use("/api/user",userRoutes);


app.listen(3000, async() => {
    try{
        await DB_CONNECT();
        console.log("Server is running on port 3000");
    }catch(error){
        console.log(error);
    }
});


