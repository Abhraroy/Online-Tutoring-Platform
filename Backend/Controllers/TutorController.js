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

export const registerTutor = async (req, res) => { //healthy
  try {
    const { 
      name, 
      email, 
      password, 
      subject, 
      subjects,
      hourlyRate, 
      lowerGrade, 
      upperGrade,
      phone,
      experience,
      education,
      bio,
      availability,
      certifications,
      languages
    } = req.body;
    
    if (!name || !email || !password || !subject || !hourlyRate || !lowerGrade || !upperGrade) {
      return res.status(400).json({ message: "All required fields are missing" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (!isValidPassword(password)) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }
    const existingTutor = await TutorModel.findOne({ email });
    if (existingTutor) {
      return res
        .status(400)
        .json({ message: "Email already exists,Try logging in" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const tutor = await TutorModel.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      subject,
      subjects: subjects || [],
      hourlyRate,
      lowerGrade,
      upperGrade,
      experience: experience || '',
      education: education || '',
      bio: bio || '',
      availability: availability || [],
      certifications: certifications || '',
      languages: languages || []
    });
    const ttoken = jwt.sign(
      { id: tutor._id, role: "tutor" },
      process.env.JWT_SECRET,
      { expiresIn: "72h" }
    );
    res.cookie("token", ttoken, { httpOnly: true, secure: false, maxAge: 72 * 60 * 60 * 1000 });
    res
      .status(201)
      .json({ message: "Tutor created successfully", tutor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginTutor = async (req, res) => {
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
    const existingTutor = await TutorModel.findOne({ email });
    if (!existingTutor) {
      return res
        .status(400)
        .json({ message: "No tutor found with this email" });
    }
    const matchPassword = await bcrypt.compare(
      password,
      existingTutor.password
    );
    if (!matchPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const ttoken = jwt.sign(
      { id: existingTutor._id, role: "tutor" },
      process.env.JWT_SECRET,
      { expiresIn: "72h" }
    );
    res.cookie("token", ttoken, { httpOnly: true, secure: false, maxAge: 72 * 60 * 60 * 1000 });
    res.status(201).json({
      message: "Tutor logged in successfully",
      existingTutor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const createTutorSession = async (req, res) => { //healthy
  try {
    const tutorId = req.userId;
    const role = req.role;
    if (role !== "tutor") {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    const { subject, date, duration, fee, topic, grade, availableSlots } = req.body;
    const session = await SessionModel.create({
      tutorId,
      subject,
      date,
      duration,
      fee,
      topic,
      grade,
      availableSlots
    });
    await session.save();
    if(!session){
      return res.status(400).json({ message: "Session not created" });
    }
    res.status(201).json({ message: "Session created successfully", session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTutorSessions = async (req, res) => {
  try {
    const tutorId = req.userId;
    const role = req.role;
    if (role !== "tutor") {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    const sessions = await SessionModel.find({tutorId});
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


export const getBookedTutorSessions = async (req, res) => {
  try {
    const tutorId = req.userId;
    const role = req.role;
    if(role !== "tutor"){
      return res.status(403).json({message: "Forbidden: Access denied"});
    }
    const bookedSessions = await BookingModel.find({tutorId, status: "confirmed"}).populate("studentId", "name email").populate("sessionId", "subject date duration capacity fee");
    if(bookedSessions.length === 0){
      return res.status(404).json({message: "No sessions found"});
    }
    console.log(bookedSessions)
    res.status(200).json({message: "Sessions fetched successfully", bookedSessions});
  }catch(error){
    res.status(500).json({message: error.message});
  }
}





export const deleteTutorSession = async (req, res) => {
  try{
    const tutorId = req.userId;
    const role = req.role;
    if(role !== "tutor"){
      return res.status(403).json({message: "Forbidden: Access denied"});
    }
    const {sessionId} = req.params;
    const session = await SessionModel.findById(sessionId);
    if(!session){
      return res.status(404).json({message: "Session not found"});
    }
    await session.deleteOne();
    res.status(200).json({message: "Session deleted successfully"});
  }catch(error){
    res.status(500).json({message: error.message});
  }
}


export const deleteBookedTutorSession = async (req, res) => {
  try{
    const tutorId = req.userId;
    const role = req.role;
    if(role !== "tutor"){
      return res.status(403).json({message: "Forbidden: Access denied"});
    }
    const {sessionId} = req.params;
    const bookingSession = await BookingModel.findById(sessionId);
    const session = await SessionModel.findById({_id: bookingSession.sessionId});
    console.log(bookingSession,session)
    if(!bookingSession || !session){
      return res.status(404).json({message: "Booking session not found"});
    }
    const studentId = bookingSession.studentId;
    const student = await StudentModel.findById(studentId);
    if(!student){
      return res.status(404).json({message: "Student not found"});
    }
    





    
    await bookingSession.deleteOne();
    await session.deleteOne();
    res.status(200).json({message: "Booking session deleted successfully"});
  }catch(error){
    res.status(500).json({message: error.message});
  }
}













export const logoutTutor = async (req, res) => {
  try {
    res.clearCookie("token",{
      httpOnly: true,
      secure: false,
      maxAge: 0
    })
    res.status(200).json({message: "Tutor logged out successfully"});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

export const getTutorProfile = async (req, res) => {
  try {
    const tutorId = req.userId;
    const role = req.role;
    if (role !== "tutor") {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    const tutor = await TutorModel.findById(tutorId).select("-password");
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }
    res.status(200).json({ message: "Tutor profile fetched successfully", tutor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}