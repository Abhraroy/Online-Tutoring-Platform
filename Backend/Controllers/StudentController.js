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
    const { name, email, password, grade, subjects, phone, agreeToTerms } = req.body;
    if (!name || !email || !password || !grade || !subjects || !phone || !agreeToTerms) {
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
      subjects,
      phone,
      agreeToTerms: agreeToTerms === "true",
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

export const updateStudentProfile = async (req,res) =>{
  try{
    const studentId = req.userId;
    const role = req.role;
    if (role !== "student") {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    const { name, email, grade, subjects, phone, agreeToTerms } = req.body;
    const student = await StudentModel.findByIdAndUpdate(studentId, { name, email, grade, subjects, phone, agreeToTerms });
    if(!student){
      return res.status(400).json({ message: "Student not found" });
    }
    res.status(201).json({ message: "Student profile updated successfully", student });
  }catch(error){
    res.status(500).json({message: error.message});
  }
}












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
    
    // Check if session has available slots
    if (session.availableSlots <= 0) {
      return res.status(400).json({ message: "Session is fully booked" });
    }
    
    // Check if student already booked this session
    const existingBooking = await BookingModel.findOne({
      sessionId,
      studentId,
      status: "confirmed",
    });
    if (existingBooking) {
      return res.status(400).json({ message: "Session already booked" });
    }

    // Create the booking
    const newBooking = await BookingModel.create({
      sessionId,
      tutorId: session.tutorId,
      studentId: studentId,
      status: "confirmed",
    });

    // Decrement available slots
    session.availableSlots -= 1;
    
    // Only mark as "booked" when all slots are filled
    if (session.availableSlots === 0) {
      session.status = "booked";
    }
    
    await session.save();

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
    const { grade } = req.query;
    if (role !== "student") {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    console.log("Received grade query param:", grade);
    console.log("Grade type:", typeof grade);
    console.log("Role:", role);
    let filter = {};
    if (grade) {
      // Trim whitespace for exact match
      const normalizedGrade = String(grade).trim();
      filter.grade = normalizedGrade;
      console.log("Filter with grade (normalized):", filter);
    } else {
      console.log("No grade provided, fetching all sessions");
    }
    // Filter by available slots > 0 instead of just status === "pending"
    // This allows sessions with available slots to show even if some students have booked
    filter.availableSlots = { $gt: 0 };
    
    // Always filter to only show future sessions
    const now = new Date();
    filter.date = { $gte: now };
    
    const sessions = await SessionModel.find(filter).populate(
      "tutorId",
      "name email subject grade availableSlots topic"
    );
    console.log("Found sessions:", sessions.length);
    if (sessions.length > 0) {
      console.log("Sample session grades in DB:", sessions.slice(0, 3).map(s => s.grade));
    }
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
      .populate("sessionId", "subject date duration capacity fee availableSlots status topic grade")
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
    if(!bookingSession){
      return res.status(404).json({message: "Booking not found"});
    }
    const session = await SessionModel.findById(bookingSession.sessionId).populate("tutorId");
    if(!session){
      return res.status(404).json({message: "Session not found"});
    }
    await bookingSession.deleteOne();
    
    // Increment available slots when booking is cancelled
    session.availableSlots += 1;
    
    // If slots become available, change status back to "pending"
    if (session.availableSlots > 0) {
      session.status = "pending";
    }
    
    await session.save();
    res.status(200).json({message: "Session deleted successfully"});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

export const getStudentProfile = async (req, res) => {
  try {
    const studentId = req.userId;
    const role = req.role;
    if (role !== "student") {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    const student = await StudentModel.findById(studentId).select("name email grade subjects phone agreeToTerms");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student profile fetched successfully", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export const getAllTutors = async(req,res) =>{
  try{
    const role = req.role;
    if(role !== "student"){
      return res.status(403).json({message: "Forbidden: Access denied"});
    }
    const tutors = await TutorModel.find().select("name email subjects hourlyRate lowerGrade upperGrade experience education certifications");
    if(tutors.length === 0){
      return res.status(404).json({message: "No tutors found"});
    }
    res.status(200).json({message: "Tutors fetched successfully", tutors});

  }catch(error){
    res.status(500).json({message: error.message});
  }
}