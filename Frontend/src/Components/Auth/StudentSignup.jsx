import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useZustandStore from '../Context/ZustandStore';
import { useAuth } from '../Context/AuthContext';

const StudentSignup = () => {
  const { login, setLogin ,user} = useZustandStore();
  const {  loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.role === "student") {
      console.log("StudentSignup user",user);
      navigate("/student-home");
    }
    if (error) {
      console.log("StudentSignup error", error);
      navigate("/student-signup");
    }
  }, [loading, user, navigate, error]);









  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade: '',
    subjects: [],
    phone: '',
    agreeToTerms: false
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
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.grade) newErrors.grade = 'Please select your grade level';
    if (formData.subjects.length === 0) newErrors.subjects = 'Please select at least one subject';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';

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
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          grade: formData.grade,
          subjects: formData.subjects,
          phone: formData.phone,
          agreeToTerms: formData.agreeToTerms
        }
        const response = await axios.post("/student/register", payload, { withCredentials: true });
        console.log(response.data);
        if (response.status !== 201) {
          navigate("/login");
        }
        else {
          setLogin(true);
          navigate("/student-home", { replace: true });
        }

      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center animate-gradient-xy relative overflow-hidden">

      {/* Background decoration circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-4xl w-full space-y-8 relative z-10">
        <div className="text-center transform transition-all duration-500 hover:scale-105">
          <h2 className="mt-6 text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200 tracking-tight drop-shadow-sm">
            Join as a Student
          </h2>
          <p className="mt-2 text-lg text-indigo-100 font-medium">
            Start your learning journey with expert tutors today.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl py-8 px-4 shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] sm:rounded-3xl sm:px-10 border border-white/50 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(8,_112,_184,_0.9)]">
          <form className="space-y-8" onSubmit={handleSubmit}>

            {/* Personal Information Section */}
            <div className="group transition-all duration-300 hover:bg-indigo-50/50 p-4 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center group-hover:text-indigo-600 transition-colors duration-300">
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300">1</span>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
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
                      className={`appearance-none block w-full px-4 py-3 border ${errors.name ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'} rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-500 font-medium pl-1 animate-pulse">{errors.name}</p>}
                </div>

                <div className="sm:col-span-2">
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
                      className={`appearance-none block w-full px-4 py-3 border ${errors.email ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'} rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5`}
                      placeholder="jane.doe@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-500 font-medium pl-1 animate-pulse">{errors.email}</p>}
                </div>

                <div className="sm:col-span-2">
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
                      className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-20 focus:border-indigo-500 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
                      placeholder="+1 (555) 987-6543"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Information Section */}
            <div className="group transition-all duration-300 hover:bg-indigo-50/50 p-4 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center group-hover:text-indigo-600 transition-colors duration-300">
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300">2</span>
                Academic Information
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="grade" className="block text-sm font-semibold text-gray-700 ml-1">
                    Grade Level
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="grade"
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 border ${errors.grade ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'} rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 bg-white cursor-pointer`}
                    >
                      <option value="">Select your grade level</option>
                      {grades.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>
                  {errors.grade && <p className="mt-1 text-sm text-red-500 font-medium pl-1 animate-pulse">{errors.grade}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">
                    Subjects of Interest
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {subjects.map(subject => (
                      <div key={subject} className="relative">
                        <label
                          htmlFor={`subject-${subject}`}
                          className={`flex items-center justify-center px-4 py-2 border rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 ${formData.subjects.includes(subject)
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

            {/* Account Security Section */}
            <div className="group transition-all duration-300 hover:bg-indigo-50/50 p-4 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center group-hover:text-indigo-600 transition-colors duration-300">
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300">3</span>
                Security
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 ml-1">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-4 py-3 border ${errors.password ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'} rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-500 font-medium pl-1 animate-pulse">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 ml-1">
                    Confirm Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'} rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-500 font-medium pl-1 animate-pulse">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 px-4">
              <div className="flex items-center">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer transition duration-150 ease-in-out hover:scale-110"
                />
                <label htmlFor="agreeToTerms" className="ml-3 block text-sm text-gray-900">
                  I agree to the{' '}
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 underline decoration-2 decoration-transparent hover:decoration-indigo-500 transition-all duration-200">
                    Terms
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 underline decoration-2 decoration-transparent hover:decoration-indigo-500 transition-all duration-200">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>
            {errors.agreeToTerms && <p className="px-4 -mt-4 text-sm text-red-500 font-medium animate-pulse">{errors.agreeToTerms}</p>}

            <div className="px-4">
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]"
              >
                Create Account
              </button>
            </div>

            <div className="mt-6 px-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-6">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/student-login" className="font-bold text-indigo-600 hover:text-purple-600 transition-colors duration-200 hover:underline">
                    Sign in
                  </Link>
                </p>
                <span className="text-gray-300">|</span>
                <p className="text-sm text-gray-600">
                  Want to teach?{' '}
                  <Link to="/tutor-signup" className="font-bold text-indigo-600 hover:text-purple-600 transition-colors duration-200 hover:underline">
                    Become a Tutor
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;
