import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HistorySession = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPastSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/tutor/past-sessions', { withCredentials: true });
        if (response.status === 200) {
          const allSessions = response.data.pastSessions || [];
          setSessions(allSessions);
        }
      } catch (err) {
        // 404 => no past sessions, show empty state instead of error
        if (err.response && err.response.status === 404) {
          setSessions([]);
          setError(null);
        } else {
          console.error('Error fetching tutor past sessions:', err);
          setError('Failed to load past sessions. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPastSessions();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-gray-50 flex items-center justify-center py-32 min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading past sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gray-50 flex items-center justify-center py-32 min-h-screen">
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
    <div className="w-full bg-gray-50 py-8 px-3 sm:px-4 lg:px-6 min-h-screen">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Past Sessions</h1>
          <p className="text-gray-600">History of sessions you have completed as a tutor.</p>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-xl p-10 text-center">
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No past sessions yet</h3>
            <p className="text-gray-600">
              Once you complete sessions with students, they will appear here.
            </p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {sessions.map((item) => {
              const session = item.sessionId || {};
              const student = item.studentId || {};
              const sessionDate = session.date ? new Date(session.date) : null;

              return (
                <div
                  key={item._id}
                  className="w-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 min-w-[300px] sm:min-w-[360px] lg:min-w-[420px] snap-start"
                >
                  <div className="flex flex-col lg:flex-row gap-4 p-5 lg:p-6">
                    {/* Session details */}
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
                      <p className="text-sm text-gray-500 mb-3">
                        {session.description || 'No description provided.'}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{sessionDate ? sessionDate.toLocaleString() : 'Date unavailable'}</span>
                        </div>
                        {session.duration && (
                          <div className="flex items-center gap-2">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{session.duration} mins</span>
                          </div>
                        )}
                        {session.fee && (
                          <div className="flex items-center gap-2">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 1.343-3 3m3-3c1.657 0 3 1.343 3 3m-3-3v10m0 0c-1.657 0-3-1.343-3-3m3 3c1.657 0 3-1.343 3-3"
                              />
                            </svg>
                            <span>${session.fee}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Student details */}
                    <div className="w-full lg:w-72 xl:w-80 bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-lg font-semibold">
                          {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Student</p>
                          <p className="text-base font-semibold text-gray-900">
                            {student.name || 'Student'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {student.email || 'Email not available'}
                          </p>
                        </div>
                      </div>
                      {student.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <svg
                            className="h-4 w-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 19.72V23a2 2 0 01-2 2h-1C9.163 25 3 18.837 3 11V10a2 2 0 012-2h0z"
                            />
                          </svg>
                          <span>{student.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorySession;

