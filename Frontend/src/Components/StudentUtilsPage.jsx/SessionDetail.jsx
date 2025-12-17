import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';
function SessionDetail({ showBookButton: propShowBookButton = true }) {
  const { userData } = useAuth();
  const navigate = useNavigate()
  const location = useLocation()
  const { sessionId } = useParams()
  
  // Get showBookButton from location state (when navigating from booked sessions) or prop
  const showBookButton = location.state?.showBookButton !== undefined 
    ? location.state.showBookButton 
    : propShowBookButton
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/student/session/${sessionId}`, { withCredentials: true })
        setSession(response.data.session)
      } catch (error) {
        console.error('Error fetching session:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [sessionId])

  const handleBooking = async () => {
    try {
      setBooking(true) 
      
      const response = await axios.post(`/student/book/${sessionId}`, {}, { withCredentials: true })
      
      // Format date and time for email
      const sessionDate = session.date ? new Date(session.date).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      }) : 'Not specified';
      const sessionTime = session.date ? new Date(session.date).toLocaleTimeString(undefined, {
        hour: '2-digit', minute: '2-digit', hour12: true
      }) : 'Not specified';
      
      const emailResponse = await axios.post(`/student/send-email`,
         { 
           to: session.tutorId.email,
           subject: "📅 Your Session Has Been Booked!",
           text: `
Hello ${session.tutorId.name},

Great news! Your tutoring session has been booked by a student.

📌 Session Details:
• Topic: ${session.topic || session.subject}
• Subject: ${session.subject}
• Date: ${sessionDate}
• Time: ${sessionTime}
• Duration: ${session.duration} minutes
• Grade Level: ${session.grade || 'Not specified'}
• Session Fee: $${session.fee?.toFixed(2) || '0.00'}

📌 Student Details:
• Name: ${userData.name}
• Email: ${userData.email}
• Phone: ${userData.phone || 'Not provided'}
• Grade: ${userData.grade || 'Not specified'}
• Subjects: ${userData.subjects?.join(", ") || 'Not specified'}

Please prepare for the session and contact the student if you need any additional information.

Best regards,
Online Tutoring Platform Team
           `.trim()
         }, { withCredentials: true });
      const studentEmailResponse = await axios.post(`/student/send-email`,
         { 
           to: userData.email,
           subject: "✅ Session Booking Confirmed!",
           text: `
Hello ${userData.name},

Your session booking has been confirmed!

📌 Session Details:
• Topic: ${session.topic || session.subject}
• Subject: ${session.subject}
• Date: ${sessionDate}
• Time: ${sessionTime}
• Duration: ${session.duration} minutes
• Grade Level: ${session.grade || 'Not specified'}
• Session Fee: $${session.fee?.toFixed(2) || '0.00'}

📌 Tutor Details:
• Name: ${session.tutorId.name}
• Email: ${session.tutorId.email}
• Phone: ${session.tutorId.phone || 'Not provided'}
• Subjects: ${session.tutorId.subjects?.join(", ") || 'Not specified'}

Please mark your calendar and be ready for the session. If you have any questions, feel free to contact your tutor directly.

We hope you have a great learning experience!

Best regards,
Online Tutoring Platform Team
           `.trim()
         }, { withCredentials: true });
      if (response.status === 200 && emailResponse.status === 200) {
        toast.success('Session booked successfully');
      } 
      console.log(response.data)
      navigate('/student-home')
    } catch (error) {
      if (error.response?.status === 409) {
        toast.info('Session already booked');
      } else if (error.response?.status === 400) {
        toast.error('Failed to book session');
      } else if (error.response?.status === 500) {
        toast.error('Internal server error');
      } else {
        console.error('Error booking session:', error)
        toast.error('Failed to book session or send email');
      }
    } finally {
      setBooking(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleTimeString(undefined, {
        hour: '2-digit', minute: '2-digit'
      })
    } catch {
      return 'N/A'
    }
  }
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading session details...</p>
        </div>
      </div>
    )
  }

  // Session not found
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-6">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Session Not Found</h3>
          <p className="text-gray-500 mb-6">The session you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/student-home')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300', shadow: 'shadow-emerald-200' },
      closed: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', shadow: 'shadow-red-200' },
      booked: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', shadow: 'shadow-blue-200' }
    }
    const config = statusConfig[status?.toLowerCase()] || statusConfig.open
    return `${config.bg} ${config.text} ${config.border} ${config.shadow}`
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 py-8 pb-24">
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/student-home')}
            className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-all duration-300 font-medium group hover:translate-x-[-4px]"
          >
            <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:translate-x-[-2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Sessions
          </button>
          
          {/* Topic Display - Prominent */}
          {session.topic && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 md:p-8 shadow-lg border border-indigo-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm md:text-base font-semibold text-indigo-600 mb-2 uppercase tracking-wide">Topic</p>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-3 leading-tight">
                      {session.topic}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                        {session.subject}
                      </span>
                      {session.status && (
                        <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-bold border-2 shadow-sm ${getStatusBadge(session.status)}`}>
                          <span className="w-2 h-2 rounded-full mr-2 bg-current animate-pulse"></span>
                          {session.status?.charAt(0).toUpperCase() + session.status?.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!session.topic && (
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Session Details
              </h1>
              <p className="text-gray-600 text-lg">Review session information and complete your booking</p>
            </div>
          )}
        </div>

        {/* Responsive Grid Layout - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 pb-30">
          {/* Session Information Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01] group">
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-6 py-5 border-b border-indigo-100">
              <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Session Information
              </h2>
            </div>
              <div className="p-6">
                <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-indigo-50/50 transition-all duration-300 group/item">
                      <div className="flex-shrink-0 w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center shadow-sm group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                        <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Subject</p>
                        <p className="text-lg font-bold text-gray-900 group-hover/item:text-indigo-600 transition-colors duration-300">{session.subject || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-green-50/50 transition-all duration-300 group/item">
                      <div className="flex-shrink-0 w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center shadow-sm group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                        <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Date</p>
                        <p className="text-lg font-bold text-gray-900 group-hover/item:text-green-600 transition-colors duration-300">{formatDate(session.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-yellow-50/50 transition-all duration-300 group/item">
                      <div className="flex-shrink-0 w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center shadow-sm group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                        <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Time</p>
                        <p className="text-lg font-bold text-gray-900 group-hover/item:text-yellow-600 transition-colors duration-300">{formatTime(session.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-purple-50/50 transition-all duration-300 group/item">
                      <div className="flex-shrink-0 w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center shadow-sm group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                        <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Duration</p>
                        <p className="text-lg font-bold text-gray-900 group-hover/item:text-purple-600 transition-colors duration-300">{session.duration || 'N/A'} minutes</p>
                      </div>
                    </div>

                    {session.grade && (
                      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-cyan-50/50 transition-all duration-300 group/item">
                        <div className="flex-shrink-0 w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center shadow-sm group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                          <svg className="w-7 h-7 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Grade Level</p>
                          <p className="text-lg font-bold text-gray-900 group-hover/item:text-cyan-600 transition-colors duration-300">{session.grade}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50/50 transition-all duration-300 group/item">
                      <div className="flex-shrink-0 w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                        <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Available Slots</p>
                        <p className="text-lg font-bold text-gray-900 group-hover/item:text-blue-600 transition-colors duration-300">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700 mr-2">
                            {session.availableSlots || 0}
                          </span>
                          {session.availableSlots === 1 ? 'slot' : 'slots'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-pink-50/50 transition-all duration-300 group/item">
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center shadow-sm group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                        <svg className="w-7 h-7 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Session Fee</p>
                        <p className="text-2xl font-extrabold text-indigo-600 group-hover/item:text-pink-600 transition-all duration-300">
                          ${session.fee?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                </div>
              </div>
            </div>

          {/* Tutor Information Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01] group">
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 px-6 py-5 border-b border-emerald-100">
              <h2 className="text-2xl font-bold text-emerald-700 flex items-center gap-2">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Tutor Information
              </h2>
            </div>
              <div className="p-6">
                <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-emerald-50/50 transition-all duration-300 group/item">
                      <div className="flex-shrink-0 w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center shadow-sm group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                        <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Name</p>
                        <p className="text-lg font-bold text-gray-900 group-hover/item:text-emerald-600 transition-colors duration-300">{session.tutorId?.name || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50/50 transition-all duration-300 group/item">
                      <div className="flex-shrink-0 w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                        <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Email</p>
                        <p className="text-lg font-bold text-gray-900 break-words group-hover/item:text-blue-600 transition-colors duration-300">{session.tutorId?.email || 'N/A'}</p>
                      </div>
                    </div>

                    {session.tutorId?.phone && (
                      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-orange-50/50 transition-all duration-300 group/item">
                        <div className="flex-shrink-0 w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center shadow-sm group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                          <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Phone</p>
                          <p className="text-lg font-bold text-gray-900 group-hover/item:text-orange-600 transition-colors duration-300">{session.tutorId.phone}</p>
                        </div>
                      </div>
                    )}

                    {session.tutorId?.education && (
                      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-red-50/50 transition-all duration-300 group/item">
                        <div className="flex-shrink-0 w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center shadow-sm group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                          <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Education</p>
                          <p className="text-lg font-bold text-gray-900 group-hover/item:text-red-600 transition-colors duration-300">{session.tutorId.education}</p>
                        </div>
                      </div>
                    )}
                    {session.tutorId?.experience && (
                      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-indigo-50/50 transition-all duration-300 group/item">
                        <div className="flex-shrink-0 w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center shadow-sm group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                          <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Experience</p>
                          <p className="text-lg font-bold text-gray-900 group-hover/item:text-indigo-600 transition-colors duration-300">{session.tutorId.experience}</p>
                        </div>
                      </div>
                    )}

                    {session.tutorId?.hourlyRate && (
                      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-green-50/50 transition-all duration-300 group/item">
                        <div className="flex-shrink-0 w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center shadow-sm group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                          <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Hourly Rate</p>
                          <p className="text-lg font-bold text-gray-900 group-hover/item:text-green-600 transition-colors duration-300">
                            <span className="text-2xl">${session.tutorId.hourlyRate?.toFixed(2) || '0.00'}</span>
                            <span className="text-sm text-gray-500 ml-1">/hr</span>
                          </p>
                        </div>
                      </div>
                    )}

                    {session.tutorId?.lowerGrade && session.tutorId?.upperGrade && (
                      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-cyan-50/50 transition-all duration-300 group/item">
                        <div className="flex-shrink-0 w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center shadow-sm group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                          <svg className="w-7 h-7 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Grade Range</p>
                          <p className="text-lg font-bold text-gray-900 group-hover/item:text-cyan-600 transition-colors duration-300">{session.tutorId.lowerGrade} - {session.tutorId.upperGrade}</p>
                        </div>
                      </div>
                    )}

                    {session.tutorId?.subjects && session.tutorId.subjects.length > 0 && (
                      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-purple-50/50 transition-all duration-300 group/item">
                        <div className="flex-shrink-0 w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center shadow-sm group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                          <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Subjects Taught</p>
                          <div className="flex flex-wrap gap-2">
                            {session.tutorId.subjects.map((subject, idx) => (
                              <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200 hover:scale-110 hover:shadow-sm transition-all duration-300 cursor-default">
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                </div>

                {/* Additional Tutor Information */}
                {(session.tutorId?.bio || session.tutorId?.certifications || (session.tutorId?.languages && session.tutorId.languages.length > 0)) && (
                  <div className="mt-6 pt-6 border-t-2 border-gray-200 space-y-6">
                    {session.tutorId?.bio && (
                      <div className="p-5 rounded-xl bg-gradient-to-br from-gray-50 to-indigo-50/30 border border-gray-200 hover:shadow-md transition-all duration-300">
                        <p className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          About
                        </p>
                        <p className="text-gray-700 leading-relaxed text-base">{session.tutorId.bio}</p>
                      </div>
                    )}

                    {session.tutorId?.certifications && (
                      <div className="p-5 rounded-xl bg-gradient-to-br from-gray-50 to-emerald-50/30 border border-gray-200 hover:shadow-md transition-all duration-300">
                        <p className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          Certifications
                        </p>
                        <p className="text-gray-700 text-base">{session.tutorId.certifications}</p>
                      </div>
                    )}

                    {session.tutorId?.languages && session.tutorId.languages.length > 0 && (
                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Languages</p>
                        <div className="flex flex-wrap gap-2">
                          {session.tutorId.languages.map((lang, idx) => (
                            <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 border border-teal-200 hover:scale-110 hover:shadow-md transition-all duration-300 cursor-default">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animated Book Session Button */}
      {showBookButton && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-indigo-200 p-4 backdrop-blur-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Session Fee</p>
              <p className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                ${session.fee?.toFixed(2) || '0.00'}
              </p>
            </div>
            {session.availableSlots !== undefined && (
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Slots</p>
                <p className="text-lg font-bold text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                    {session.availableSlots}
                  </span>
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleBooking}
            disabled={booking || session.availableSlots === 0 || session.status === 'closed'}
            className="w-full relative overflow-hidden inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-extrabold rounded-xl text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 shadow-2xl hover:shadow-indigo-500/50 transform hover:scale-105 active:scale-95 disabled:hover:scale-100 animate-gradient"
            style={{
              background: 'linear-gradient(90deg, #4f46e5, #9333ea, #ec4899, #f43f5e, #4f46e5)',
              backgroundSize: '200% 100%'
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
            {booking ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="relative z-10">Processing...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6 mr-3 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="relative z-10">Book Session</span>
              </>
            )}
          </button>
          {session.availableSlots === 0 && (
            <p className="text-sm text-red-600 text-center mt-3 font-semibold">
              ⚠️ No slots available
            </p>
          )}
          <p className="text-xs text-gray-500 text-center mt-3 leading-relaxed">
            By booking, you agree to our terms and conditions
          </p>
        </div>
      </div>
      )}
    </>
  )
}

export default SessionDetail