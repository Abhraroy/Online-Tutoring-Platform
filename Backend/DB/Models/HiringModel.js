import mongoose from "mongoose";
const { Schema } = mongoose;

const hiringSchema = new Schema({
  tutorId: {
    type: Schema.Types.ObjectId,
    ref: "Tutor",
    required: true
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true
  }
})

const HiringModel = mongoose.model("Hiring", hiringSchema);
export default HiringModel;