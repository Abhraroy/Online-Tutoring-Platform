import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HiredSession = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHiredStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/tutor/hired-by-students', { withCredentials: true });
        if (response.status === 200) {
          const raw = response.data.hiredStudents || [];
          const mappedStudents = raw
            .map((item) => item?.studentId)
            .filter(Boolean);
          setStudents(mappedStudents);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setStudents([]);
        } else {
          console.error('Error fetching hired students:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHiredStudents();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-gray-50 flex items-center justify-center py-32 min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hired students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hired Students</h1>
            <p className="text-gray-600">
              Students who have hired you for ongoing or future sessions.
            </p>
          </div>
        </div>

        {students.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center">
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No students have hired you yet
            </h3>
            <p className="text-gray-600">
              When a student hires you, they will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {students.map((student) => (
              <div
                key={student._id}
                className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-4 p-5 sm:p-6">
                  <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-semibold flex-shrink-0">
                    {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                          {student.name || 'Student'}
                        </h2>
                        <p className="text-sm text-gray-500 truncate">
                          {student.email || 'Email not available'}
                        </p>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HiredSession;

