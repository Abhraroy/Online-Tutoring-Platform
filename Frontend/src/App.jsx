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
import TutorBookedSessions from './Components/BookedSessions/TutorBookedSessions'
import StudentLogin from './Components/Auth/StudentLogin'
import TutorLogin from './Components/Auth/TutorLogin'
import SessionDetail from './Components/StudentUtilsPage.jsx/SessionDetail'
import StudentBookedSessions from './Components/BookedSessions/StudentBookedSessions'

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
            <Route path="/tutor/booked-sessions" element={
              <ProtectedRoute role="tutor">
                <TutorBookedSessions />
              </ProtectedRoute>
            } />
        </Route>





      </Routes>




    </Router>
  )
}

export default App