import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import StudentModel from "../DB/Models/StudentModel.js";
import TutorModel from "../DB/Models/TutorModel.js";
import SessionModel from "../DB/Models/SessionModel.js";
import isValidEmail from "../Utils/EmailTest.js";
import isValidPassword from "../Utils/PassWordTest.js";
import BookingModel from "../DB/Models/BookingModel.js";

export const registerStudent = async (req, res) => {
  console.log(req.body);
  //healthy
  try {
    const { name, email, password, grade } = req.body;
    if (!name || !email || !password || !grade) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (!isValidPassword(password)) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }
    const existingStudent = await StudentModel.findOne({ email });
    if (existingStudent) {
      return res
        .status(400)
        .json({ message: "Email already exists,Try logging in" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await StudentModel.create({
      name,
      email,
      password: hashedPassword,
      grade,
    });
    const sttoken = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "72h" }
    );

    res.cookie("token", sttoken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "Student created successfully", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginStudent = async (req, res) => {
  //healthy
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (!isValidPassword(password)) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }
    const existingStudent = await StudentModel.findOne({ email });
    if (!existingStudent) {
      return res
        .status(400)
        .json({ message: "No student found with this email" });
    }
    const matchPassword = await bcrypt.compare(
      password,
      existingStudent.password
    );
    if (!matchPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const sttoken = jwt.sign(
      { id: existingStudent._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "72h" }
    );
    res.cookie("token", sttoken, {
      httpOnly: true,
      secure: false,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.status(201).json({
      message: "Student logged in successfully",
      existingStudent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const bookSession = async (req, res) => {
  try {
    const studentId = req.userId;
    const role = req.role;
    if (role !== "student") {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    const { sessionId } = req.params;
    const session = await SessionModel.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    session.status = "booked";
    await session.save();
    const existingBooking = await BookingModel.findOne({
      sessionId,
      studentId,
      status: "confirmed",
    });
    if (existingBooking) {
      return res.status(400).json({ message: "Session already booked" });
    }

    const newBooking = await BookingModel.create({
      sessionId,
      tutorId: session.tutorId,
      studentId: studentId,
      status: "confirmed",
    });

    res
      .status(200)
      .json({ message: "Session booked successfully", newBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSessions = async (req, res) => {
  //healthy
  try {
    const role = req.role;
    const { subject, date, status, grade } = req.query;
    if (role !== "student") {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    let filter = {};
    if (subject) filter.subject = subject;
    if (date) filter.date = new Date(date); // ensure it's a Date
    if (status) filter.status = status;
    if (grade) filter.grade = grade;
    filter.status = "pending";
    filter.date = { $gte: new Date() };
    const sessions = await SessionModel.find(filter).populate(
      "tutorId",
      "name email subject grade"
    );
    if (sessions.length === 0) {
      return res.status(404).json({ message: "No sessions found" });
    }
    res
      .status(200)
      .json({ message: "Sessions fetched successfully", sessions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookedSessions = async (req, res) => {
  try {
    const studentId = req.userId;
    const role = req.role;
    if (role !== "student") {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    const sessions = await BookingModel.find({ studentId, status: "confirmed" })
      .populate("sessionId", "subject date duration capacity fee")
      .populate("tutorId", "name email");
    if (sessions.length === 0) {
      return res.status(404).json({ message: "No sessions found" });
    }
    res
      .status(200)
      .json({ message: "Sessions fetched successfully", sessions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const logoutStudent = async (req, res) => {
  try {
    res.clearCookie("token",{
      httpOnly: true,
      secure: false,
      maxAge: 0
    })
    res.status(200).json({message: "Student logged out successfully"});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}


export const getSessionById = async (req, res) => {
  try {
    const {sessionId} = req.params;
    const session = await SessionModel.findById(sessionId).populate("tutorId");
    if(!session){
      return res.status(404).json({message: "Session not found"});
    }
    res.status(200).json({message: "Session fetched successfully", session});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}


export const deleteBookedSession = async (req, res) => {
  try {
    const {sessionId} = req.params;
    const bookingSession = await BookingModel.findById(sessionId);
    const session = await SessionModel.findById({_id: bookingSession.sessionId}).populate("tutorId");
    if(!bookingSession || !session){
      return res.status(404).json({message: "Session not found"});
    }
    await bookingSession.deleteOne();
    session.status = "pending";
    await session.save();
    res.status(200).json({message: "Session deleted successfully"});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}