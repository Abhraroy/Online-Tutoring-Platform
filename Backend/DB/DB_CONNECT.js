import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const DB_CONNECT = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}