import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useZustandStore from '../Context/ZustandStore';
import { useAuth } from '../Context/AuthContext';

const StudentEditProfile = () => {
  const { login, setLogin } = useZustandStore();
  const { user, loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.role === "student") {
      console.log("StudentEditProfile user",user);
      const fetchProfile = async () => {
        const response = await axios.get("/student/profile", { withCredentials: true });
        if (response.status !== 200) {
          navigate("/student/profile");
        }
        console.log("StudentEditProfile response", response.data);
        const { name, email, grade, subjects, phone } = response.data.student;
        setFormData({
          name: name || '',
          email: email || '',
          grade: grade || '',
          subjects: subjects || [],
          phone: phone || ''
        });
        console.log("StudentEditProfile formData", formData);
      }
      fetchProfile();
      navigate("/student/edit-profile");
    }
    if (error) {
      console.log("StudentEditProfile error", error);
      navigate("/student/profile");
    }
  }, [loading, user, navigate, error]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: '',
    subjects: [],
    phone: ''
  });

  const [errors, setErrors] = useState({});

  const subjects = [
    'Mathematics', 'Science', 'English', 'History', 'Geography',
    'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics',
    'Literature', 'Art', 'Music', 'Foreign Languages', 'Other'
  ];

  const grades = [
    'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
    'College Freshman', 'College Sophomore', 'College Junior', 'College Senior',
    'Graduate', 'Adult'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubjectChange = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.grade) newErrors.grade = 'Please select your grade level';
    if (formData.subjects.length === 0) newErrors.subjects = 'Please select at least one subject';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        console.log(formData);
        const payload = {
          name: formData.name.trim(),
          email: formData.email,
          grade: formData.grade,
          subjects: formData.subjects,
          phone: formData.phone
        }
        const response = await axios.put("/student/profile", payload, { withCredentials: true });
        console.log(response.data);
        if (response.status !== 201) {
          navigate("/student/edit-profile");
        }
        else {
          navigate("/student-home", { replace: true });
        }

      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-6 lg:py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">

      <div className="max-w-7xl w-full space-y-4 lg:space-y-6 relative z-10">
        <div className="text-center transform transition-all duration-500 hover:scale-105">
          <h2 className="mt-2 lg:mt-4 text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Edit Profile
          </h2>
          <p className="mt-1 lg:mt-2 text-base lg:text-lg text-slate-600 font-medium">
            Edit your profile information
          </p>
        </div>

        <div className="bg-white py-4 lg:py-6 px-4 shadow-lg sm:rounded-3xl sm:px-6 lg:px-8 border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <form className="space-y-4 lg:space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">

              {/* Personal Information Section */}
              <div className="group transition-all duration-300 hover:bg-indigo-50/50 p-3 lg:p-4 rounded-2xl">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4 flex items-center group-hover:text-indigo-600 transition-colors duration-300">
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full h-7 w-7 lg:h-8 lg:w-8 flex items-center justify-center text-xs lg:text-sm mr-2 lg:mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300">1</span>
                  Personal Information
                </h3>
                <div className="space-y-3 lg:space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 ml-1">
                      Full Name *
                    </label>
                    <div className="mt-1">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`appearance-none block w-full px-3 lg:px-4 py-2 lg:py-2.5 border ${errors.name ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'} rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-500 font-medium pl-1 animate-pulse">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 ml-1">
                      Email Address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`appearance-none block w-full px-3 lg:px-4 py-2 lg:py-2.5 border ${errors.email ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'} rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5`}
                        placeholder="jane.doe@example.com"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-500 font-medium pl-1 animate-pulse">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 ml-1">
                      Phone Number
                    </label>
                    <div className="mt-1">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 lg:px-4 py-2 lg:py-2.5 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-20 focus:border-indigo-500 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
                        placeholder="+1 (555) 987-6543"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="group transition-all duration-300 hover:bg-indigo-50/50 p-3 lg:p-4 rounded-2xl">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4 flex items-center group-hover:text-indigo-600 transition-colors duration-300">
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full h-7 w-7 lg:h-8 lg:w-8 flex items-center justify-center text-xs lg:text-sm mr-2 lg:mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300">2</span>
                  Academic Information
                </h3>
                <div className="space-y-3 lg:space-y-4">
                  <div>
                    <label htmlFor="grade" className="block text-sm font-semibold text-gray-700 ml-1">
                      Grade Level
                    </label>
                    <div className="mt-1 relative">
                      <select
                        id="grade"
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        className={`block w-full px-3 lg:px-4 py-2 lg:py-2.5 border ${errors.grade ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'} rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 bg-white cursor-pointer`}
                      >
                        <option value="">Select your grade level</option>
                        {grades.map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>
                    {errors.grade && <p className="mt-1 text-sm text-red-500 font-medium pl-1 animate-pulse">{errors.grade}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3 ml-1">
                      Subjects of Interest
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">
                      {subjects.map(subject => (
                        <div key={subject} className="relative">
                          <label
                            htmlFor={`subject-${subject}`}
                            className={`flex items-center justify-center px-3 lg:px-4 py-1.5 lg:py-2 border rounded-xl text-xs lg:text-sm font-medium cursor-pointer transition-all duration-200 ${formData.subjects.includes(subject)
                                ? 'bg-indigo-600 text-white border-transparent shadow-md transform scale-105'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                              }`}
                          >
                            <input
                              id={`subject-${subject}`}
                              name={`subject-${subject}`}
                              type="checkbox"
                              className="sr-only"
                              checked={formData.subjects.includes(subject)}
                              onChange={() => handleSubjectChange(subject)}
                            />
                            {subject}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.subjects && <p className="mt-2 text-sm text-red-500 font-medium pl-1 animate-pulse">{errors.subjects}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 lg:pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-3 lg:py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentEditProfile;
