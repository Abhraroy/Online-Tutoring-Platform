import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

function TutorDetail() {
  const location = useLocation()
  const navigate = useNavigate()
  const { tutorId } = useParams()

  // Prefer state passed from navigation; fallback to location.state?.tutor
  const tutor = location.state?.tutor || null

  const goBack = () => {
    if (location.state?.fromFindTutors) {
      navigate(-1)
    } else {
      navigate('/find-tutors')
    }
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="mx-auto h-20 w-20 text-gray-300 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tutor not found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't load the tutor details. Please go back and select a tutor again.
          </p>
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to tutors
          </button>
          {tutorId && (
            <p className="mt-3 text-xs text-gray-400">
              Tutor ID: <span className="font-mono">{tutorId}</span>
            </p>
          )}
        </div>
      </div>
    )
  }

  const getAverageRating = () => {
    if (!Array.isArray(tutor.rating) || tutor.rating.length === 0) return null
    const sum = tutor.rating.reduce((acc, val) => acc + (Number(val) || 0), 0)
    const avg = sum / tutor.rating.length
    if (!isFinite(avg) || avg <= 0) return null
    return avg.toFixed(1)
  }

  const averageRating = getAverageRating()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/40 to-purple-50/40 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-2 transition-all duration-200 font-medium group"
          >
            <svg
              className="w-5 h-5 mr-2 transition-transform duration-200 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to tutors
          </button>
        </div>

        {/* Header card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-6 sm:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {tutor.name?.charAt(0)?.toUpperCase() || 'T'}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{tutor.name}</h1>
                  <p className="text-sm text-white/90 break-all">{tutor.email}</p>
                  {tutor.subjects && tutor.subjects.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tutor.subjects.slice(0, 3).map((subject, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30"
                        >
                          {subject}
                        </span>
                      ))}
                      {tutor.subjects.length > 3 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30">
                          +{tutor.subjects.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col sm:items-end gap-3">
                <div className="flex items-center gap-3 sm:justify-end">
                  {averageRating ? (
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-yellow-100/90 text-yellow-800 text-xs font-semibold border border-yellow-300 shadow-sm">
                      <svg className="h-4 w-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.383 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118L10 14.347l-3.383 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.618 9.401C1.835 8.83 2.237 7.59 3.206 7.59h4.178a1 1 0 00.95-.69l1.286-3.974z" />
                      </svg>
                      <span>{averageRating} / 5</span>
                      <span className="ml-1 text-[11px] text-yellow-700/80">({tutor.rating.length} ratings)</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold border border-white/30">
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.383 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118L12 17.347l-3.383 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L4.618 9.401C3.835 8.83 4.237 7.59 5.206 7.59h4.178a1 1 0 00.95-.69l1.286-3.974z"
                        />
                      </svg>
                      No ratings yet
                    </div>
                  )}

                  {tutor.hourlyRate && (
                    <div className="px-4 py-2 rounded-xl bg-black/20 text-white backdrop-blur-sm border border-white/30">
                      <p className="text-[11px] uppercase tracking-wide text-white/80 font-semibold">Hourly Rate</p>
                      <p className="text-lg font-extrabold">
                        ${tutor.hourlyRate}
                        <span className="text-xs font-medium text-white/80 ml-1">/hr</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left: About & Qualifications */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                About {tutor.name?.split(' ')[0] || 'Tutor'}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {tutor.bio ||
                  'This tutor has not added a bio yet. Check their qualifications, subjects, and experience to learn more about them.'}
              </p>
            </div>

            {/* Qualifications */}
            {(tutor.education || tutor.experience || tutor.certifications) && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  Qualifications
                </h2>
                <div className="space-y-3">
                  {tutor.education && (
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-0.5">Education</p>
                        <p className="text-sm text-gray-800">{tutor.education}</p>
                      </div>
                    </div>
                  )}

                  {tutor.experience && (
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-0.5">Experience</p>
                        <p className="text-sm text-gray-800">{tutor.experience}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-0.5">Certifications</p>
                      <p className="text-sm text-gray-800">{tutor.certifications || 'No certifications'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Side info */}
          <div className="space-y-6">
            {/* Grade Range / Subjects */}
            {(tutor.lowerGrade || tutor.upperGrade || (tutor.subjects && tutor.subjects.length > 0)) && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Teaching profile
                </h2>

                <div className="space-y-3 text-sm text-gray-800">
                  {tutor.lowerGrade && tutor.upperGrade && (
                    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-blue-50 border border-blue-100">
                      <span className="font-medium text-gray-700">Grade Range</span>
                      <span className="font-semibold text-blue-700">
                        {tutor.lowerGrade} – {tutor.upperGrade}
                      </span>
                    </div>
                  )}

                  {tutor.subjects && tutor.subjects.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Subjects</p>
                      <div className="flex flex-wrap gap-2">
                        {tutor.subjects.map((subject, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact info */}
            {(tutor.phone || (tutor.languages && tutor.languages.length > 0)) && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Contact & languages
                </h2>

                <div className="space-y-3 text-sm text-gray-800">
                  {tutor.phone && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span>{tutor.phone}</span>
                    </div>
                  )}

                  {tutor.languages && tutor.languages.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Languages</p>
                      <div className="flex flex-wrap gap-2">
                        {tutor.languages.map((lang, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 border border-teal-200"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorDetail
