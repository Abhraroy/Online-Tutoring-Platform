import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function StudentBookedSessions() {
  const [bookedSessions, setBookedSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)
  const [cancelError, setCancelError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBookedSessions = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/student/booked-sessions', { withCredentials: true })
        console.log(response.data.sessions)
        setBookedSessions(response.data.sessions || [])
      } catch (error) {
        console.error('Error fetching booked sessions:', error)
        setBookedSessions([])
      } finally {
        setLoading(false)
      }
    }
    fetchBookedSessions()
  }, [navigate])

  const handleCancelSession = async (sessionId) => {
    // Ask for confirmation before cancelling
    const confirmed = window.confirm('Are you sure you want to cancel this session?')
    if (!confirmed) return

    try {
      setCancelError(null)
      setCancelling(sessionId)
      // Must include the /student prefix to match backend route: DELETE /student/booked-sessions/:sessionId
      const response = await axios.delete(`/student/booked-sessions/${sessionId}`, { withCredentials: true })
      console.log(response.data)
      setBookedSessions(prev => prev.filter(session => session._id !== sessionId))
    } catch (error) {
      console.error('Error cancelling session:', error)
      setCancelError('Failed to cancel the session. Please try again.')
    } finally {
      setCancelling(null)
    }
  }

  const handleViewDetails = (sessionId) => {
    navigate(`/session-detail/${sessionId}`, { state: { showBookButton: false } })
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not specified'
    try {
      return new Date(dateString).toLocaleString(undefined, {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your booked sessions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Booked Sessions</h1>
                <p className="text-gray-600 text-lg">View and manage your upcoming and past tutoring sessions</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-50 rounded-full px-4 py-2">
                  <span className="text-indigo-700 font-semibold">{bookedSessions.length} Sessions Booked</span>
                </div>
              </div>
            </div>
            {cancelError && (
              <div className="mt-4 px-4 py-2 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
                {cancelError}
              </div>
            )}
          </div>
        </div>

        {/* Sessions Grid */}
        {bookedSessions.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 max-w-2xl mx-auto">
              <div className="mx-auto h-32 w-32 text-gray-300 mb-6">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Booked Sessions</h3>
              <p className="text-gray-600 mb-8 text-lg">You haven't booked any tutoring sessions yet. Start exploring available sessions from expert tutors.</p>
              <button
                onClick={() => navigate('/student-home')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Browse Sessions
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookedSessions.map((session) => (
              <div 
                key={session._id} 
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 group overflow-hidden flex flex-col h-full"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 border-b border-gray-100">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-indigo-700 transition-colors truncate">
                        {session.sessionId?.topic || session.sessionId?.subject || 'Session'}
                      </h3>
                      <p className="text-sm font-medium text-indigo-700 truncate">
                        {session.sessionId?.subject || 'Subject not specified'}
                      </p>
                      <div className="mt-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Tutor
                        </p>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-800 truncate">
                            {session.tutorId?.name || 'Tutor Name'}
                          </span>
                          <span className="text-xs text-gray-600 truncate">
                            {session.tutorId?.email || 'Email not available'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`shrink-0 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border whitespace-nowrap ${getStatusColor(session.status)}`}>
                      {session.status || 'Unknown'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1">Date & Time</p>
                        <p className="text-sm text-gray-600 break-words">{formatDateTime(session.sessionId?.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1">Duration</p>
                        <p className="text-sm text-gray-600">{session.sessionId?.duration || 'Not specified'} minutes</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1">Session Fee</p>
                        <p className="text-lg font-bold text-indigo-600">${session.sessionId?.fee?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>

                    {session.notes && (
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 mb-1">Notes</p>
                          <p className="text-sm text-gray-600 break-words">{session.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleViewDetails(session.sessionId?._id)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </button>

                      {session.status !== 'completed' && session.status !== 'cancelled' ? (
                        <button
                          onClick={() => handleCancelSession(session._id)}
                          disabled={cancelling === session._id}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          {cancelling === session._id ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Cancel
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-500 bg-gray-100 border border-gray-200 cursor-default">
                          {session.status === 'completed' ? 'Completed' : 'Cancelled'}
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
  )
}

export default StudentBookedSessions
