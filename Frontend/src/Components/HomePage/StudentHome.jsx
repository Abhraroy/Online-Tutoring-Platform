import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../Context/AuthContext'
import useZustandStore from '../Context/ZustandStore'

function StudentHome() {
  const navigate = useNavigate()
  const { userData } = useAuth()
  const [sessions, setSessions] = useState([])
  const [filteredSessions, setFilteredSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedSubject, setSelectedSubject] = useState('All')

  // Get subjects from student profile or use default list
  const studentSubjects = userData?.subjects || []
  const defaultSubjects = [
    'All',
    'Mathematics',
    'Science',
    'English',
    'History',
    'Computer Science',
    'Physics',
    'Chemistry',
    'Biology',
    'Art',
    'Music',
    'Languages'
  ]
  
  // Combine student subjects with default, removing duplicates
  const allSubjects = ['All', ...new Set([...studentSubjects, ...defaultSubjects.filter(s => s !== 'All')])]

  // Function to normalize student grade to match session grade format
  // Sessions use: "Grade 1", "Grade 10", "Kindergarten", "College Freshman", etc.
  const normalizeGrade = (grade) => {
    if (!grade) return null
    
    const gradeStr = String(grade).trim()
    
    // If already in correct format (starts with "Grade" or is a special grade), return as is
    if (gradeStr.match(/^(Grade|Kindergarten|College|Graduate|Adult)/i)) {
      return gradeStr
    }
    
    // Handle numeric grades (1-12)
    const numericGrade = parseInt(gradeStr)
    if (!isNaN(numericGrade)) {
      if (numericGrade === 0) return 'Kindergarten'
      if (numericGrade >= 1 && numericGrade <= 12) {
        return `Grade ${numericGrade}`
      }
      // Handle college years
      if (numericGrade === 13) return 'College Freshman'
      if (numericGrade === 14) return 'College Sophomore'
      if (numericGrade === 15) return 'College Junior'
      if (numericGrade === 16) return 'College Senior'
    }
    
    // Handle text variations
    const lowerGrade = gradeStr.toLowerCase()
    if (lowerGrade.includes('kindergarten') || lowerGrade === 'k') return 'Kindergarten'
    if (lowerGrade.includes('freshman') || lowerGrade.includes('college 1')) return 'College Freshman'
    if (lowerGrade.includes('sophomore') || lowerGrade.includes('college 2')) return 'College Sophomore'
    if (lowerGrade.includes('junior') && lowerGrade.includes('college')) return 'College Junior'
    if (lowerGrade.includes('senior') && lowerGrade.includes('college')) return 'College Senior'
    if (lowerGrade.includes('graduate')) return 'Graduate'
    if (lowerGrade.includes('adult')) return 'Adult'
    
    // Try to extract number from strings like "10th grade", "grade 10", etc.
    const numberMatch = gradeStr.match(/\d+/)
    if (numberMatch) {
      const num = parseInt(numberMatch[0])
      if (num === 0) return 'Kindergarten'
      if (num >= 1 && num <= 12) return `Grade ${num}`
    }
    
    // If we can't normalize, return null (don't filter by grade)
    console.warn(`Could not normalize grade: ${gradeStr}`)
    return null
  }

  // Carousel slides data - Replace colored divs with images later
  const carouselSlides = [
    {
      id: 1,
      color: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500',
      title: 'Learn from Expert Tutors',
      description: 'Discover personalized learning experiences tailored to your needs'
    },
    {
      id: 2,
      color: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500',
      title: 'Expert Tutors',
      description: 'Learn from the best in the industry'
    },
    {
      id: 3,
      color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500',
      title: 'Flexible Learning',
      description: 'Study at your own pace and schedule'
    },
    {
      id: 4,
      color: 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500',
      title: 'Interactive Sessions',
      description: 'Engage and learn together with interactive sessions'
    }
  ]

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true)
        // Build query parameters - only include grade if student has one
        let queryParams = ''
        if (userData?.grade) {
          // Normalize the grade to match session grade format (e.g., "10" -> "Grade 10")
          const normalizedGrade = normalizeGrade(userData.grade)
          if (normalizedGrade) {
            queryParams = `?grade=${encodeURIComponent(normalizedGrade)}`
          }
        }
        console.log("Student grade from userData:", userData?.grade)
        console.log("Normalized grade:", normalizeGrade(userData?.grade))
        console.log("Query params:", queryParams)
        console.log("Full URL:", `/student/sessions${queryParams}`)
        // Fetch sessions with grade filter if available
        const response = await axios.get(`/student/sessions${queryParams}`)
        const allSessions = response.data.sessions || []
        console.log("Sessions received:", allSessions.length)
        console.log("Sample session grades:", allSessions.slice(0, 3).map(s => s.grade))
        setSessions(allSessions)
        
        // If student has subjects, filter sessions to match student's subjects
        if (userData?.subjects && userData.subjects.length > 0) {
          const filtered = allSessions.filter(session => 
            userData.subjects.includes(session.subject)
          )
          setFilteredSessions(filtered)
        } else {
          setFilteredSessions(allSessions)
        }
      } catch (error) {
        console.log(error)
        setSessions([])
        setFilteredSessions([])
      } finally {
        setLoading(false)
      }
    }
    fetchSessions()
  }, [navigate, userData])

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [carouselSlides.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
  }



  const formatDateTime = (iso) => {
    try {
      return new Date(iso).toLocaleString(undefined, {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    } catch {
      return iso
    }
  }

  const getCurrentDate = () => {
    return new Date().toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading available sessions...</p>
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  // if (sessions.length === 0) {
  //   return (
  //     <div className="bg-gray-50 py-8">
  //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  //         <div className="text-center py-12">
  //           <div className="mx-auto h-24 w-24 text-gray-400 mb-6">
  //             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  //             </svg>
  //           </div>
  //           <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions available</h3>
  //           <p className="text-gray-500">Check back later for new tutoring sessions.</p>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="bg-gray-50">
      {/* Hero Carousel Section - Full Width */}
      <div className="relative w-full mb-8 overflow-hidden" style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }}>
        <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full">
          {/* Carousel Slides */}
          {carouselSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Placeholder colored div - Replace with <img> tag later */}
              <div className={`w-full h-full ${slide.color} relative`}>
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white px-6 z-10 max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg animate-fade-in">
                      {slide.title}
                    </h2>
                    <p className="text-xl md:text-2xl lg:text-3xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
                      {slide.description}
                    </p>
                  </div>
                </div>
                
                {/* Replace the above div with image when ready:
                <img 
                  src={`/path-to-image-${slide.id}.jpg`} 
                  alt={slide.title} 
                  className="w-full h-full object-cover" 
                />
                */}
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Indicator Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? 'w-8 h-3 bg-white'
                    : 'w-3 h-3 bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Subjects Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Browse by Subject</h2>
          <div className="flex flex-wrap gap-3">
            {allSubjects.map((subject) => {
              const isStudentSubject = studentSubjects.includes(subject)
              return (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 relative ${
                    selectedSubject === subject
                      ? 'bg-indigo-600 text-white shadow-lg scale-105'
                      : isStudentSubject
                      ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-300 hover:border-indigo-400 hover:bg-indigo-100'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700'
                  }`}
                >
                  {subject}
                  {isStudentSubject && subject !== 'All' && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white"></span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Available Sessions Section - Full Width */}
      <div className="w-full pb-8" style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }}>
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Sessions</h1>
                  <p className="text-gray-600 text-lg">Browse and book sessions from expert tutors</p>
                  <div className="mt-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-500">{getCurrentDate()}</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center space-x-4">
                  <div className="bg-indigo-50 rounded-full px-4 py-2">
                    <span className="text-indigo-700 font-semibold">
                      {(() => {
                        const displaySessions = selectedSubject === 'All' 
                          ? (userData?.subjects && userData.subjects.length > 0 ? filteredSessions : sessions)
                          : sessions.filter(s => s.subject === selectedSubject)
                        return displaySessions.length
                      })()} Sessions Available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sessions Grid */}
          {(() => {
            // Filter sessions based on selected subject
            const displaySessions = selectedSubject === 'All' 
              ? (userData?.subjects && userData.subjects.length > 0 ? filteredSessions : sessions)
              : sessions.filter(s => s.subject === selectedSubject)
            
            return displaySessions.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="max-w-md mx-auto">
                  <div className="mx-auto h-32 w-32 text-gray-300 mb-6">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Sessions Available</h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    {selectedSubject !== 'All' 
                      ? `No sessions found for ${selectedSubject}. Try selecting a different subject.`
                      : userData?.subjects && userData.subjects.length > 0
                      ? "No sessions found for your selected subjects. Check back later or browse all sessions."
                      : "There are currently no tutoring sessions available. Check back later for new sessions from expert tutors."
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => navigate('/find-tutors')}
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Find Tutors
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {displaySessions.map((s) => (
            <div 
              key={s._id} 
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-200 group overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-indigo-700 transition-colors">
                      {s.subject}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
                      <span className="text-sm font-medium text-gray-600">{s.tutorName}</span>
                    </div>
                  </div>
                  <span className={`shrink-0 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    s.capacity === 1 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {s.capacity === 1 ? '1:1' : `${s.capacity} seats`}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Date & Time</p>
                      <p className="text-sm text-gray-600">{formatDateTime(s.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Duration</p>
                      <p className="text-sm text-gray-600">{s.duration} minutes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Status</p>
                      <p className="text-sm text-gray-600 capitalize">{s.status}</p>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-xs text-gray-500 font-medium">Session Fee</p>
                      <p className="text-2xl font-bold text-indigo-600">${s.fee.toFixed(2)}</p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
                      onClick={() => navigate(`/session-detail/${s._id}`)}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      Book Session
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
            </div>
          )
          })()}
          </div>
      </div>
    </div>
  )
}

export default StudentHome