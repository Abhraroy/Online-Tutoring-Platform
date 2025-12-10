import mongoose from "mongoose";
import { Schema,ObjectId } from "mongoose";

const TutorSchema = new Schema({
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
    phone: {
        type: String,
        required: false
    },
    subject: {
        type: String,
        required: true
    },
    subjects: [{
        type: String
    }],
    hourlyRate: {
        type: Number,
        required: true
    },
    lowerGrade: {
        type: String,
        required: true
    },
    upperGrade: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: false
    },
    education: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    availability: [{
        type: String
    }],
    certifications: {
        type: String,
        required: false
    },
    languages: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

const TutorModel = mongoose.model("Tutor", TutorSchema);
export default TutorModel;