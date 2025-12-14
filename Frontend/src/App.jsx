import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './Components/Landing/Landing'
import StudentSignup from './Components/Auth/StudentSignup'
import TutorSignup from './Components/Auth/TutorSignup'
import ProtectedRoute from './Components/Auth/ProtectedROute'
import StudentHome from './Components/HomePage/StudentHome'
import StudentLayout from './Components/Layouts/StudentLayout'
import TutorLayout from './Components/Layouts/TutorLayout'
import TutorHome from './Components/HomePage/TutorHome'
import CreateSession from './Components/TutorUtilsPages/CreateSession'
import EditSession from './Components/TutorUtilsPages/EditSession'
import TutorBookedSessions from './Components/BookedSessions/TutorBookedSessions'
import StudentLogin from './Components/Auth/StudentLogin'
import TutorLogin from './Components/Auth/TutorLogin'
import SessionDetail from './Components/StudentUtilsPage.jsx/SessionDetail'
import StudentBookedSessions from './Components/BookedSessions/StudentBookedSessions'
import TutorSessionDetail from './Components/TutorUtilsPages/TutorSessionDetail'
import StudentProfile from './Components/Profile.jsx/StudentProfile'
import TutorProfile from './Components/Profile.jsx/TutorPrrofile'
import StudentEditProfile from './Components/Profile.jsx/StudentEditProfile'
import TutorEditProfile from './Components/Profile.jsx/TutorEditProfile'
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/tutor-login" element={<TutorLogin />} />
        <Route path="/student-signup" element={<StudentSignup />} />
        <Route path="/tutor-signup" element={<TutorSignup />} />
        

         { /* studentRoutes */ }
        
        
       <Route element={<StudentLayout />} >
            <Route path="/student-home" element={
            <ProtectedRoute role="student">
              <StudentHome />
            </ProtectedRoute>
            } />
            <Route path="/session-detail/:sessionId" element={
              <ProtectedRoute role="student">
                <SessionDetail />
              </ProtectedRoute>
            } />
            <Route path="/booked-sessions" element={
              <ProtectedRoute role="student">
                <StudentBookedSessions />
              </ProtectedRoute>
            } />
            <Route path="/student/profile" element={
              <ProtectedRoute role="student">
                <StudentProfile />
              </ProtectedRoute>
            } />
            <Route path="/student/edit-profile" element={
              <ProtectedRoute role="student">
                <StudentEditProfile />
              </ProtectedRoute>
            } />
       </Route>
        
        {/* tutorRoutes */}
        <Route element ={<TutorLayout />} >
            <Route path="/tutor-home" element={
              <ProtectedRoute role="tutor">
                <TutorHome />
              </ProtectedRoute>
            } />
            <Route path="/create-session" element={
              <ProtectedRoute role="tutor">
                <CreateSession />
              </ProtectedRoute>
            } />
            <Route path="/tutor/edit-session/:sessionId" element={
              <ProtectedRoute role="tutor">
                <EditSession />
              </ProtectedRoute>
            } />
            <Route path="/tutor/booked-sessions" element={
              <ProtectedRoute role="tutor">
                <TutorBookedSessions />
              </ProtectedRoute>
            } />
            <Route path="/tutor/session-detail/:sessionId" element={
              <ProtectedRoute role="tutor">
                <TutorSessionDetail />
              </ProtectedRoute>
            } />
            <Route path="/tutor/profile" element={
              <ProtectedRoute role="tutor">
                <TutorProfile />
              </ProtectedRoute>
            } />
            <Route path="/tutor/edit-profile" element={
              <ProtectedRoute role="tutor">
                <TutorEditProfile />
              </ProtectedRoute>
            } />
        </Route>





      </Routes>




    </Router>
  )
}

export default App