import mongoose from "mongoose";
import { Schema,ObjectId } from "mongoose";

const sessionSchema = new Schema({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tutor",
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes (e.g., 60)
    default: 60
  },
  status: {
    type: String,
    enum: ["pending", "booked"],
    default: "pending"
  },
  fee: {
    type: Number, // store fee at time of booking
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
});

const SessionModel = mongoose.model("Session", sessionSchema);
export default SessionModel;
