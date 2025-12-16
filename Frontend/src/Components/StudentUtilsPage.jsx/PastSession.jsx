import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PastSession = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const getAverageRating = (tutor) => {
    if (!tutor || !Array.isArray(tutor.rating) || tutor.rating.length === 0) return null;
    const sum = tutor.rating.reduce((acc, val) => acc + (Number(val) || 0), 0);
    const avg = sum / tutor.rating.length;
    if (!isFinite(avg) || avg <= 0) return null;
    return avg.toFixed(1);
  };

  useEffect(() => {
    const fetchPastSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/student/past-sessions', { withCredentials: true });
        if (response.status === 200) {
          const allSessions = response.data.pastSessions || [];
          setSessions(allSessions);
        }
      } catch (err) {
        // If no past sessions found (404), show empty state instead of error
        if (err.response && err.response.status === 404) {
          setSessions([]);
          setError(null);
        } else {
          console.error('Error fetching past sessions:', err);
          setError('Failed to load past sessions. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPastSessions();
  }, []);

  const handleRateTutor = (tutor) => {
    if (!tutor || !tutor._id) return;
    setSelectedTutor(tutor);
    setSelectedRating(0);
    setHoverRating(0);
    setShowRatingModal(true);
  };

  const submitRating = async () => {
    if (!selectedTutor || !selectedTutor._id || !selectedRating) return;
    try {
      setSubmitting(true);
      await axios.post(`/student/rate-tutor/${selectedTutor._id}`, {
        rating: selectedRating,
      }, { withCredentials: true });
      alert('Thank you for rating your tutor!');
      setShowRatingModal(false);
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-50 flex items-center justify-center py-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading past sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gray-50 flex items-center justify-center py-32">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors active:scale-95"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Past Sessions</h1>
          <p className="text-gray-600">Sessions you already attended.</p>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-xl p-10 text-center">
            <div className="mx-auto h-20 w-20 text-gray-300 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No past sessions yet</h3>
            <p className="text-gray-600">You have not booked any sessions yet.</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {sessions.map((item) => {
              const session = item.sessionId || {};
              const tutor = item.tutorId || {};
              const sessionDate = session.date ? new Date(session.date) : null;
              return (
                <div
                  key={item._id}
                  className="w-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 min-w-[300px] sm:min-w-[360px] lg:min-w-[420px] snap-start"
                >
                  <div className="flex flex-col lg:flex-row gap-4 p-5 lg:p-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-full">
                          {session.topic || 'Session'}
                        </span>
                        <span className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
                          {session.subject || 'Subject'}
                        </span>
                        {session.grade && (
                          <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full">
                            Grade {session.grade}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {session.topic || 'Session'}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">{session.description || 'No description provided.'}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{sessionDate ? sessionDate.toLocaleString() : 'Date unavailable'}</span>
                        </div>
                        {session.duration && (
                          <div className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{session.duration} mins</span>
                          </div>
                        )}
                        {session.fee && (
                          <div className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3m3-3c1.657 0 3 1.343 3 3m-3-3v10m0 0c-1.657 0-3-1.343-3-3m3 3c1.657 0 3-1.343 3-3" />
                            </svg>
                            <span>${session.fee}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="w-full lg:w-72 xl:w-80 bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-lg font-semibold">
                          {tutor.name ? tutor.name.charAt(0).toUpperCase() : 'T'}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Tutor</p>
                          <p className="text-base font-semibold text-gray-900">{tutor.name || 'Tutor'}</p>
                          <p className="text-sm text-gray-500">{tutor.email || 'Email not available'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {getAverageRating(tutor) ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-50 text-xs font-medium text-yellow-800 border border-yellow-200">
                            <svg className="h-3.5 w-3.5 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.383 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118L10 14.347l-3.383 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.618 9.401C1.835 8.83 2.237 7.59 3.206 7.59h4.178a1 1 0 00.95-.69l1.286-3.974z" />
                            </svg>
                            {getAverageRating(tutor)} / 5
                          </span>
                        ) : (
                          <span>No ratings yet</span>
                        )}
                      </div>
                      {tutor.subjects && tutor.subjects.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Subjects</p>
                          <div className="flex flex-wrap gap-2">
                            {tutor.subjects.slice(0, 3).map((subject, index) => (
                              <span
                                key={`${tutor._id || 'tutor'}-${subject}-${index}`}
                                className="px-2.5 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-md"
                              >
                                {subject}
                              </span>
                            ))}
                            {tutor.subjects.length > 3 && (
                              <span className="px-2.5 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-md">
                                +{tutor.subjects.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => handleRateTutor(tutor)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.383 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118l-3.383-2.46a1 1 0 00-1.175 0l-3.383 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118l-3.383-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.974z" />
                        </svg>
                        Rate Tutor
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedTutor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Rate your tutor</h2>
                <p className="text-sm text-gray-500">
                  How was your experience with <span className="font-semibold">{selectedTutor.name}</span>?
                </p>
              </div>
              <button
                onClick={() => !submitting && setShowRatingModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-center gap-4 py-4">
              <div className="flex items-center justify-center gap-3">
                {[
                  { value: 1, emoji: '😡', label: 'Very Bad' },
                  { value: 2, emoji: '☹️', label: 'Bad' },
                  { value: 3, emoji: '😐', label: 'Okay' },
                  { value: 4, emoji: '😊', label: 'Good' },
                  { value: 5, emoji: '🤩', label: 'Excellent' },
                ].map((item) => {
                  const isActive = (hoverRating || selectedRating) >= item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      disabled={submitting}
                      onMouseEnter={() => setHoverRating(item.value)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setSelectedRating(item.value)}
                      className={`flex flex-col items-center gap-1 transition-all duration-150 ${
                        isActive ? 'scale-110' : 'scale-100'
                      } ${submitting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span
                        className={`text-3xl sm:text-4xl transition-transform duration-150 ${
                          isActive ? 'drop-shadow-lg' : 'opacity-80'
                        }`}
                      >
                        {item.emoji}
                      </span>
                      <span
                        className={`text-[11px] sm:text-xs font-medium uppercase tracking-wide ${
                          isActive ? 'text-indigo-600' : 'text-gray-400'
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-gray-500">
                1 = Very Bad, 5 = Excellent
              </p>
            </div>

            <button
              type="button"
              onClick={submitRating}
              disabled={!selectedRating || submitting}
              className={`mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors ${
                !selectedRating || submitting
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.383 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118l-3.383-2.46a1 1 0 00-1.175 0l-3.383 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118l-3.383-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.974z"
                    />
                  </svg>
                  Submit Rating
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PastSession;
