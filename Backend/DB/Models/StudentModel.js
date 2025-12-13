import mongoose from "mongoose";
import { Schema,ObjectId } from "mongoose";

const StudentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    grade:{
     type:String,
    },
    subjects: [{
        type: String
    }],
    phone: {
        type: String,
        required: true
    },
    agreeToTerms: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

const StudentModel = mongoose.model("Student", StudentSchema);
export default StudentModel;