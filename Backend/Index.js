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

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(origin => origin.trim())
  : [];

console.log("allowedOrigins", allowedOrigins);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
    
        // Check if origin is in allowed list
        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
          // Return the exact origin (not *) when credentials are enabled
          return callback(null, true);
        }
    
        // Reject origin not in allowed list
        return callback(new Error(`CORS blocked for origin: ${origin}`));
      },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type"],
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

