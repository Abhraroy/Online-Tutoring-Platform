import mongoose from "mongoose";
const { Schema } = mongoose;

const bookingSchema = new Schema({
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: "Session",
    required: true
  },
  tutorId: {
    type: Schema.Types.ObjectId,
    ref: "Tutor",
    required: true
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  status: {
    type: String,
    enum: ["completed", "pending"],
    default: "pending"
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

// Optional: Prevent double booking for the same session by the same student
bookingSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });

const BookingModel = mongoose.model("Booking", bookingSchema);
export default BookingModel;
