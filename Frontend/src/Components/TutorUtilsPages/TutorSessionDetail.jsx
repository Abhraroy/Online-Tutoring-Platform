import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

function TutorSessionDetail() {
  const navigate = useNavigate()
  const { sessionId } = useParams()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true)
        // Fetch all tutor sessions and find the one matching sessionId
        const response = await axios.get('/tutor/sessions', { withCredentials: true })
        const sessions = response.data.sessions || []
        const foundSession = sessions.find(s => s._id === sessionId)
        setSession(foundSession || null)
      } catch (error) {
        console.error('Error fetching session:', error)
        setSession(null)
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [sessionId])

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
            onClick={() => navigate('/tutor-home')}
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

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString(undefined, {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const handleEdit = () => {
    // Navigate to edit session page with session data
    navigate(`/tutor/edit-session/${sessionId}`, { state: { sessionData: session } })
  }

  const handleDelete = async () => {
    // Confirm deletion
    const confirmed = window.confirm(
      `Are you sure you want to delete this session?\n\nTopic: ${session.topic || session.subject}\nSubject: ${session.subject}\n\nThis action cannot be undone.`
    )
    
    if (!confirmed) return

    try {
      setIsDeleting(true)
      const response = await axios.delete(`/tutor/sessions/${sessionId}`, { withCredentials: true })
      console.log('Session deleted successfully:', response.data)
      
      // Show success message and navigate back
      toast.success('Session deleted successfully!')
      navigate('/tutor-home')
    } catch (error) {
      console.error('Error deleting session:', error)
      toast.error(error.response?.data?.message || 'Failed to delete session. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/tutor-home')}
            className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-4 transition-all duration-300 font-medium group hover:translate-x-[-4px]"
          >
            <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:translate-x-[-2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Sessions
          </button>
        </div>

        {/* Single Rectangle Card with All Details */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-8 py-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {session.topic ? (
                  <>
                    <p className="text-sm font-semibold text-white/90 mb-2 uppercase tracking-wide">Session Topic</p>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                      {session.topic}
                    </h1>
                  </>
                ) : (
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                    Session Details
                  </h1>
                )}
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                    {session.subject}
                  </span>
                  {session.status && (
                    <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-bold border-2 ${getStatusBadge(session.status)}`}>
                      <span className="w-2 h-2 rounded-full mr-2 bg-current animate-pulse"></span>
                      {session.status?.charAt(0).toUpperCase() + session.status?.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card Body - Grid Layout */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Subject */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-5 border border-indigo-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Subject</p>
                </div>
                <p className="text-lg font-bold text-gray-900">{session.subject || 'N/A'}</p>
              </div>

              {/* Date & Time */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Date & Time</p>
                </div>
                <p className="text-lg font-bold text-gray-900">{formatDateTime(session.date)}</p>
              </div>

              {/* Duration */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Duration</p>
                </div>
                <p className="text-lg font-bold text-gray-900">{session.duration || 'N/A'} minutes</p>
              </div>

              {/* Grade Level */}
              {session.grade && (
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-5 border border-cyan-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Grade Level</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{session.grade}</p>
                </div>
              )}

              {/* Available Slots */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Available Slots</p>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-500 text-white mr-2">
                    {session.availableSlots || 0}
                  </span>
                  {session.availableSlots === 1 ? 'slot' : 'slots'} available
                </p>
              </div>

              {/* Session Fee */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-lg p-5 border border-pink-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Session Fee</p>
                </div>
                <p className="text-2xl font-extrabold text-indigo-600">
                  ${session.fee?.toFixed(2) || '0.00'}
                </p>
              </div>

              {/* Status */}
              {session.status && (
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-5 border border-emerald-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold border-2 ${getStatusBadge(session.status)}`}>
                      <span className="w-2 h-2 rounded-full mr-2 bg-current animate-pulse"></span>
                      {session.status?.charAt(0).toUpperCase() + session.status?.slice(1)}
                    </span>
                  </p>
                </div>
              )}

              {/* Created At */}
              {session.createdAt && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Created At</p>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{formatDateTime(session.createdAt)}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Session
                  </>
                )}
              </button>
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorSessionDetail

