import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function TutorBookedSessions() {
    const [bookedSessions,setBookedSessions] = useState([])
    const [groupedSessions, setGroupedSessions] = useState({})
    const [selectedSessionId, setSelectedSessionId] = useState(null)
    const [showStudentsModal, setShowStudentsModal] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
      console.log("fetching booked sessions")
        const fetchBookedSessions = async ()=>{
           try{
            const response = await axios.get('/tutor/booked-sessions', { withCredentials: true })
            console.log(response.data.bookedSessions)
            const sessions = response.data.bookedSessions || []
            setBookedSessions(sessions)
            
            // Group sessions by sessionId
            const grouped = {}
            sessions.forEach(booking => {
              const sessionId = booking.sessionId?._id || booking.sessionId
              if (!grouped[sessionId]) {
                grouped[sessionId] = {
                  session: booking.sessionId,
                  students: []
                }
              }
              if (booking.studentId) {
                grouped[sessionId].students.push(booking.studentId)
              }
            })
            setGroupedSessions(grouped)
           }catch(error){
            console.log(error)
            setBookedSessions([])
            setGroupedSessions({})
           }
        }
        fetchBookedSessions()
    },[navigate])

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
      })
    } catch {
      return 'N/A'
    }
  }

  const handleViewStudents = (sessionId) => {
    setSelectedSessionId(sessionId)
    setShowStudentsModal(true)
  }

  const handleCloseModal = () => {
    setShowStudentsModal(false)
    setSelectedSessionId(null)
  }

  const getSelectedSessionStudents = () => {
    if (!selectedSessionId || !groupedSessions[selectedSessionId]) return []
    return groupedSessions[selectedSessionId].students || []
  }

  const handleMarkCompleted = async (sessionId) => {
    // Find all booking documents for this sessionId
    const bookingsForSession = bookedSessions.filter(b => {
      const sid = b.sessionId?._id || b.sessionId
      return sid === sessionId
    })

    if (bookingsForSession.length === 0) return

    try {
      // Mark all bookings for this session as completed
      for (const booking of bookingsForSession) {
        if (!booking._id) continue
        await axios.put(`/tutor/booked-sessions/${booking._id}`, { status: "completed" }, { withCredentials: true })
      }

      // Remove this session group from current view
      const updatedGrouped = { ...groupedSessions }
      delete updatedGrouped[sessionId]
      setGroupedSessions(updatedGrouped)
      setBookedSessions(prev => prev.filter(b => {
        const sid = b.sessionId?._id || b.sessionId
        return sid !== sessionId
      }))

      toast.success('Session marked as completed. You can now view it under Past Sessions.')
    } catch (error) {
      console.error('Error marking session as completed:', error)
      toast.error('Failed to mark session as completed. Please try again.')
    }
  }

  const uniqueSessions = Object.values(groupedSessions)

  return (
    <>
      <div className="w-full bg-gray-50 py-8 px-4 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Booked Sessions</h1>
          
          {uniqueSessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Booked Sessions</h2>
                <p className="text-gray-500">You don't have any booked sessions at the moment.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {uniqueSessions.map((group) => {
                const session = group.session
                const sessionId = session?._id || session
                const students = group.students || []
                
                return (
                  <div key={sessionId} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200">
                    {/* Header */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 flex-1">
                          {session?.subject || 'Subject Not Specified'}
                        </h3>
                        {session?.status && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            session.status === 'open' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : session.status === 'closed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {session.status}
                          </span>
                        )}
                      </div>
                      
                      {/* Topic */}
                      {session?.topic && (
                        <p className="text-sm font-medium text-indigo-600 mb-3">
                          {session.topic}
                        </p>
                      )}
                    </div>
                    
                    {/* Session Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">Time:</span>
                        <span className="text-sm ml-2">{formatTime(session?.date)}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium">Date:</span>
                        <span className="text-sm ml-2">{formatDate(session?.date)}</span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm font-medium">Students:</span>
                        <span className="text-sm ml-2 font-semibold text-indigo-600">{students.length} booked</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-2">
                      {/* View Students Button */}
                      <button
                        onClick={() => handleViewStudents(sessionId)}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        View All Students ({students.length})
                      </button>
                      <button
                        onClick={() => handleMarkCompleted(sessionId)}
                        className="w-full border border-green-600 text-green-700 hover:bg-green-50 font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Mark as Completed
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Students Modal */}
      {showStudentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Students Who Booked This Session</h2>
              <button
                onClick={handleCloseModal}
                className="text-white hover:text-gray-200 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {getSelectedSessionStudents().length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No students have booked this session yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getSelectedSessionStudents().map((student, index) => (
                    <div key={index} className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            {student?.name?.charAt(0)?.toUpperCase() || 'S'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {student?.name || 'Unknown Student'}
                          </h3>
                          <div className="space-y-1">
                            {student?.email && (
                              <div className="flex items-center text-gray-600 text-sm">
                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {student.email}
                              </div>
                            )}
                            {student?.phone && (
                              <div className="flex items-center text-gray-600 text-sm">
                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {student.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TutorBookedSessions