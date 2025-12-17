import mongoose from "mongoose";
const { Schema } = mongoose;

const followSchema = new Schema({
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

const FollowModel = mongoose.model("Follow", followSchema);
export default FollowModel;