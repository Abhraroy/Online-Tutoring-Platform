import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';
function FindTutor() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followedTutors, setFollowedTutors] = useState(new Set());
  const [student, setStudent] = useState(null);
  const studentData = useAuth().userData;
  useEffect(() => {
    setStudent(studentData);
  }, [studentData]);

  const getAverageRating = (tutor) => {
    if (!tutor || !Array.isArray(tutor.rating) || tutor.rating.length === 0) return null;
    const sum = tutor.rating.reduce((acc, val) => acc + (Number(val) || 0), 0);
    const avg = sum / tutor.rating.length;
    if (!isFinite(avg) || avg <= 0) return null;
    return avg.toFixed(1);
  };

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/student/all-tutors', { withCredentials: true });
        if (response.status === 200) {
          setTutors(response.data.tutors || []);
        }
      } catch (err) {
        console.error('Error fetching tutors:', err);
        setError('Failed to load tutors. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  const handleFollow = async (tutorId, tutorName) => {
    try {
      const response = await axios.post(`/student/follow/${tutorId}`, {}, { withCredentials: true });
      if (response.status === 200) {
        setFollowedTutors(prev => {
          const newSet = new Set(prev);
          newSet.add(tutorId);
          return newSet;
        });
      } else {
        toast.error(`Failed to follow tutor ${tutorName}`);
      }
    } catch (error) {
      console.error('Error following tutor:', error);
      toast.error(`Failed to follow tutor ${tutorName}`);
    }
  };

  const handleUnfollow = async (tutorId, tutorName) => {
    try {
      const response = await axios.post(`/student/unfollow/${tutorId}`, {}, { withCredentials: true });
      if (response.status === 200) {
        toast.success(`Tutor ${tutorName} unfollowed successfully`);
      } else {
        toast.error(`Failed to unfollow tutor ${tutorName}`);
      }
    } catch (error) {
      console.error('Error unfollowing tutor:', error);
      toast.error(`Failed to unfollow tutor ${tutorName}`);
    }
  };

  const handleHire = async (tutor) => {
    
    // Navigate to tutor's sessions or create a booking
    console.log('Hire tutor:', tutor);
    console.log('Student:', student);
    // You can add navigation logic here
    try {
      const response = await axios.post(`/student/hire/${tutor._id}`, { tutorId: tutor._id }, { withCredentials: true });
      const emailResponse = await axios.post(`/student/send-email`,
         { to: tutor.email, subject: "You have been hired",
          text: `You have been hired by a student. Please contact them to schedule a session.
          Student Name: ${student.name}
          Student Email: ${student.email}
          Student Phone: ${student.phone}
          Student Grade: ${student.grade}
          Student Subjects: ${student.subjects.join(', ')}` }, { withCredentials: true });
      const studentEmailResponse = await axios.post(`/student/send-email`,
         { to: student.email, subject: "You have a tutor",
          text: `You have  hired a tutor. Please contact them to schedule a session.
          Tutor Name: ${tutor.name}
          Tutor Email: ${tutor.email}
          Tutor Phone: ${tutor.phone}
          Tutor Subjects: ${tutor.subjects.join(', ')}` }, { withCredentials: true });
      if (response.status === 200 && emailResponse.status === 200) {
        toast.success(`Tutor ${tutor.name} hired successfully`);
      } else if (response.status === 409) {
        toast.error(`Failed to hire tutor ${tutor.name} or send email`);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.info('Tutor already hired');
      } else {
        toast.error(`Failed to hire tutor ${tutor.name} or send email`);
      }
      console.error('Error hiring tutor:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-50 flex items-center justify-center py-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tutors...</p>
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Tutors</h1>
          <p className="text-gray-600">Discover expert tutors to help you learn</p>
        </div>

        {/* Tutors Grid */}
        {tutors.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tutors Found</h3>
            <p className="text-gray-600">There are currently no tutors available.</p>
          </div>
        ) : (
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x md:snap-none snap-mandatory">
            {tutors.map((tutor) => (
              <div
                key={tutor._id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6 min-w-[260px] sm:min-w-[300px] md:min-w-0 snap-start"
              >
                {/* Tutor Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {tutor.name}
                      </h3>
                      <p className="text-sm text-gray-500">{tutor.email}</p>
                      <div className="mt-1 flex items-center gap-2">
                        {getAverageRating(tutor) ? (
                          <>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-50 text-xs font-medium text-yellow-800 border border-yellow-200">
                              <svg className="h-3.5 w-3.5 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.383 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118L10 14.347l-3.383 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.618 9.401C1.835 8.83 2.237 7.59 3.206 7.59h4.178a1 1 0 00.95-.69l1.286-3.974z" />
                              </svg>
                              {getAverageRating(tutor)} / 5
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">No ratings yet</span>
                        )}
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold text-lg">
                        {tutor.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subjects */}
                {tutor.subjects && tutor.subjects.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Subjects
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tutor.subjects.slice(0, 3).map((subject, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md"
                        >
                          {subject}
                        </span>
                      ))}
                      {tutor.subjects.length > 3 && (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                          +{tutor.subjects.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Grade Range */}
                {(tutor.lowerGrade || tutor.upperGrade) && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Grade Range
                    </p>
                    <p className="text-sm text-gray-700">
                      {tutor.lowerGrade} - {tutor.upperGrade}
                    </p>
                  </div>
                )}

                {/* Hourly Rate */}
                {tutor.hourlyRate && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Hourly Rate
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${tutor.hourlyRate}/hr
                    </p>
                  </div>
                )}

                {/* Qualifications */}
                {(tutor.education || tutor.experience || tutor.certifications) && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Qualifications
                    </p>
                    <div className="space-y-2">
                      {tutor.education && (
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <p className="text-sm text-gray-700">{tutor.education}</p>
                        </div>
                      )}
                      {tutor.experience && (
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm text-gray-700">{tutor.experience}</p>
                        </div>
                      )}
                      {tutor.certifications && (
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          <p className="text-sm text-gray-700">{tutor.certifications}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleFollow(tutor._id, tutor.name)}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${followedTutors.has(tutor._id)
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } active:scale-95`}
                  >
                    {followedTutors.has(tutor._id) ? 'Unfollow' : 'Follow'}
                  </button>
                  <button
                    onClick={() => handleHire(tutor)}
                    className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-all duration-200 active:scale-95"
                  >
                    Hire
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FindTutor;

