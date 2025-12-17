import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const FollowedTutor = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAverageRating = (tutor) => {
    if (!tutor || !Array.isArray(tutor.rating) || tutor.rating.length === 0) return null;
    const sum = tutor.rating.reduce((acc, val) => acc + (Number(val) || 0), 0);
    const avg = sum / tutor.rating.length;
    if (!isFinite(avg) || avg <= 0) return null;
    return avg.toFixed(1);
  };

  useEffect(() => {
    const fetchFollowedTutors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/student/followed-tutors', { withCredentials: true });
        if (response.status === 200) {
          const raw = response.data.followedTutors || [];
          const mappedTutors = raw
            .map((item) => item?.tutorId)
            .filter(Boolean);
          setTutors(mappedTutors);
        }
      } catch (err) {
        console.error('Error fetching followed tutors:', err);
        setError('Failed to load followed tutors. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedTutors();
  }, []);

  const handleUnfollow = async (tutorId) => {
    try {
      const response = await axios.post(`/student/unfollow/${tutorId}`, {}, { withCredentials: true });
      if (response.status === 200) {
        setTutors((prev) => prev.filter((tutor) => tutor._id !== tutorId));
        toast.success('Tutor unfollowed successfully.');
      } else {
        toast.error('Failed to unfollow tutor. Please try again.');
      }
    } catch (err) {
      console.error('Error unfollowing tutor:', err);
      toast.error('Failed to unfollow tutor. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-50 flex items-center justify-center py-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading followed tutors...</p>
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
    <div className="w-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Followed Tutors</h1>
            <p className="text-gray-600">Manage tutors you are currently following.</p>
          </div>
          <a
            href="/find-tutors"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-colors duration-200"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Find Tutors
          </a>
        </div>

        {tutors.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-xl">
            <div className="mx-auto h-20 w-20 text-gray-300 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No followed tutors</h3>
            <p className="text-gray-600 mb-4">Follow tutors to quickly find them here.</p>
            <a
              href="/find-tutors"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Browse Tutors
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <div
                key={tutor._id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{tutor.name}</h3>
                    <p className="text-sm text-gray-500">{tutor.email}</p>
                    <div className="mt-1 flex items-center gap-2">
                      {getAverageRating(tutor) ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-50 text-xs font-medium text-yellow-800 border border-yellow-200">
                          <svg className="h-3.5 w-3.5 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.383 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118L10 14.347l-3.383 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.618 9.401C1.835 8.83 2.237 7.59 3.206 7.59h4.178a1 1 0 00.95-.69l1.286-3.974z" />
                          </svg>
                          {getAverageRating(tutor)} / 5
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">No ratings yet</span>
                      )}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
                    <span className="text-indigo-700 font-semibold text-lg">
                      {tutor.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                {tutor.subjects && tutor.subjects.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Subjects
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tutor.subjects.slice(0, 4).map((subject, index) => (
                        <span
                          key={`${tutor._id}-${subject}-${index}`}
                          className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md"
                        >
                          {subject}
                        </span>
                      ))}
                      {tutor.subjects.length > 4 && (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                          +{tutor.subjects.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {(tutor.lowerGrade || tutor.upperGrade) && (
                  <div className="text-sm text-gray-700">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Grade Range
                    </p>
                    <p>{tutor.lowerGrade} - {tutor.upperGrade}</p>
                  </div>
                )}

                {tutor.hourlyRate && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Hourly Rate
                    </p>
                    <p className="text-lg font-semibold text-gray-900">${tutor.hourlyRate}/hr</p>
                  </div>
                )}

                <div className="flex items-center justify-end mt-auto">
                  <button
                    onClick={() => handleUnfollow(tutor._id)}
                    className="px-3 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200"
                  >
                    Unfollow
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowedTutor;
