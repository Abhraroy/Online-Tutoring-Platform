import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useZustandStore from '../Context/ZustandStore';
import { useAuth } from '../Context/AuthContext';
const TutorSignup = () => {
  const { user, loading, error } = useAuth();
  const { login, setLogin, setUser, setUserData } = useZustandStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && user?.role === "tutor") {
      navigate("/tutor-home");
    }
    if (error) {
      console.log("TutorSignup error", error);
      navigate("/tutor-signup");
    }
  }, [loading, user, navigate, error]);

  

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    subjects: [],
    experience: '',
    education: '',
    hourlyRate: '',
    lowerGrade: '',
    upperGrade: '',
    bio: '',
    availability: [],
    certifications: '',
    languages: [],
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});

  const subjects = [
    'Mathematics', 'Science', 'English', 'History', 'Geography',
    'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics',
    'Literature', 'Art', 'Music', 'Foreign Languages', 'Test Prep',
    'SAT/ACT', 'GRE', 'GMAT', 'LSAT', 'MCAT', 'Other'
  ];

  const experienceLevels = [
    'Less than 1 year',
    '1-2 years',
    '3-5 years',
    '6-10 years',
    '10+ years'
  ];

  const educationLevels = [
    'High School Diploma',
    'Associate Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD/Doctorate',
    'Professional Certification'
  ];

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Russian'
  ];

  const gradeLevels = [
    'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
    '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade',
    'College Freshman', 'College Sophomore', 'College Junior', 'College Senior', 'Graduate Level'
  ];

  const availabilityDays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
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
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (formData.subjects.length === 0) newErrors.subjects = 'Please select at least one subject';
    if (!formData.experience) newErrors.experience = 'Please select your experience level';
    if (!formData.education) newErrors.education = 'Please select your education level';
    if (!formData.hourlyRate) newErrors.hourlyRate = 'Please enter your hourly rate';
    else if (isNaN(formData.hourlyRate) || formData.hourlyRate < 0) newErrors.hourlyRate = 'Please enter a valid hourly rate';
    if (!formData.lowerGrade) newErrors.lowerGrade = 'Please select the lowest grade you teach';
    if (!formData.upperGrade) newErrors.upperGrade = 'Please select the highest grade you teach';
    if (formData.bio.trim() && formData.bio.length < 50) newErrors.bio = 'Bio must be at least 50 characters';
    if (formData.availability.length === 0) newErrors.availability = 'Please select your availability';
    if (formData.languages.length === 0) newErrors.languages = 'Please select at least one language';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Tutor signup data:', formData);
      try {
        const payload = {
          name: formData.name.trim(),
          email: formData.email,
          password: formData.password,
          subjects: formData.subjects,
          hourlyRate: parseFloat(formData.hourlyRate),
          lowerGrade: formData.lowerGrade,
          upperGrade: formData.upperGrade,
          phone: formData.phone,
          experience: formData.experience,
          education: formData.education,
          bio: formData.bio,
          availability: formData.availability,
          certifications: formData.certifications,
          languages: formData.languages
        };

        const response = await axios.post('/tutor/register', payload);
        console.log('Registration successful:', response.data);
        // Handle successful registration (redirect, show success message, etc.)
        if (response.status !== 201) {
          navigate("/login");
        }
        else {
          setLogin(true);
          navigate("/tutor-home", { replace: true });
        }
      } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        // Handle error (show error message to user)
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center animate-gradient-xy relative overflow-hidden">

      {/* Background decoration circles */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl w-full space-y-8 relative z-10">
        <div className="text-center transform transition-all duration-500 hover:scale-105">
          <h2 className="mt-6 text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-200 tracking-tight drop-shadow-sm">
            Join as a Tutor
          </h2>
          <p className="mt-2 text-lg text-indigo-100 font-medium">
            Share your knowledge and help students succeed.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl py-8 px-4 shadow-[0_20px_50px_rgba(79,_70,_229,_0.6)] sm:rounded-3xl sm:px-10 border border-white/50 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(79,_70,_229,_0.8)]">
          <form className="space-y-8" onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="group transition-all duration-300 hover:bg-indigo-50/50 p-6 rounded-2xl border border-transparent hover:border-indigo-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center group-hover:text-indigo-600 transition-colors duration-300">
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300">1</span>
                  Personal Information
                </h3>
                <div className="space-y-6">
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
                        className={`appearance-none block w-full px-4 py-3 border ${errors.name ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'} rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5`}
                        placeholder="John Smith"
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
                        className={`appearance-none block w-full px-4 py-3 border ${errors.email ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'} rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5`}
                        placeholder="john.smith@example.com"
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
                        className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-20 focus:border-indigo-500 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
                        placeholder="+1 (555) 987-6543"
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Teaching Profile */}
              <div className="group transition-all duration-300 hover:bg-purple-50/50 p-6 rounded-2xl border border-transparent hover:border-purple-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center group-hover:text-purple-600 transition-colors duration-300">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300">2</span>
                  Teaching Profile
                </h3>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="education" className="block text-sm font-semibold text-gray-700 ml-1">
                      Highest Education
                    </label>
                    <div className="mt-1 relative">
                      <select
                        id="education"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 border ${errors.education ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'} rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 bg-white cursor-pointer`}
                      >
                        <option value="">Select highest qualification</option>
                        {educationLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    {errors.education && <p className="mt-1 text-sm text-red-500 font-medium pl-1 animate-pulse">{errors.education}</p>}
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 ml-1">
                      Experience
                    </label>
                    <div className="mt-1 relative">
                      <select
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 border ${errors.experience ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'} rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 bg-white cursor-pointer`}
                      >
                        <option value="">Select experience level</option>
                        {experienceLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    {errors.experience && <p className="mt-1 text-sm text-red-500 font-medium pl-1 animate-pulse">{errors.experience}</p>}
                  </div>

                  <div>
                    <label htmlFor="hourlyRate" className="block text-sm font-semibold text-gray-700 ml-1">
                      Hourly Rate (₹)
                    </label>
                    <div className="mt-1 relative rounded-xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-lg font-bold">₹</span>
                      </div>
                      <input
                        id="hourlyRate"
                        name="hourlyRate"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        className={`block w-full pl-9 pr-4 py-3 border ${errors.hourlyRate ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'} rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5`}
                        placeholder="500"
                      />
                    </div>
                    {errors.hourlyRate && <p className="mt-1 text-sm text-red-500 font-medium pl-1 animate-pulse">{errors.hourlyRate}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="lowerGrade" className="block text-sm font-semibold text-gray-700 ml-1">
                        Lowest Grade
                      </label>
                      <div className="mt-1 relative">
                        <select
                          id="lowerGrade"
                          name="lowerGrade"
                          value={formData.lowerGrade}
                          onChange={handleChange}
                          className={`block w-full px-4 py-3 border ${errors.lowerGrade ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'} rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 bg-white cursor-pointer`}
                        >
                          <option value="">Select</option>
                          {gradeLevels.map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                      </div>
                      {errors.lowerGrade && <p className="mt-1 text-sm text-red-500 font-medium pl-1 animate-pulse">{errors.lowerGrade}</p>}
                    </div>
                    <div>
                      <label htmlFor="upperGrade" className="block text-sm font-semibold text-gray-700 ml-1">
                        Highest Grade
                      </label>
                      <div className="mt-1 relative">
                        <select
                          id="upperGrade"
                          name="upperGrade"
                          value={formData.upperGrade}
                          onChange={handleChange}
                          className={`block w-full px-4 py-3 border ${errors.upperGrade ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'} rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 bg-white cursor-pointer`}
                        >
                          <option value="">Select</option>
                          {gradeLevels.map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                      </div>
                      {errors.upperGrade && <p className="mt-1 text-sm text-red-500 font-medium pl-1 animate-pulse">{errors.upperGrade}</p>}
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label htmlFor="certifications" className="block text-sm font-semibold text-gray-700 ml-1">
                      Certifications (Optional)
                    </label>
                    <div className="mt-1">
                      <input
                        id="certifications"
                        name="certifications"
                        type="text"
                        value={formData.certifications}
                        onChange={handleChange}
                        className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-20 focus:border-indigo-500 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
                        placeholder="Teaching License, etc."
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Expertise & Availability */}
            <div className="group transition-all duration-300 hover:bg-pink-50/50 p-6 rounded-2xl border border-transparent hover:border-pink-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center group-hover:text-pink-600 transition-colors duration-300">
                <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300">3</span>
                Expertise & Availability
              </h3>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">
                    Subjects to Teach
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
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
                            checked={formData.subjects.includes(subject)}
                            onChange={() => handleArrayChange('subjects', subject)}
                            className="sr-only"
                          />
                          {subject}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.subjects && <p className="mt-2 text-sm text-red-500 font-medium pl-1 animate-pulse">{errors.subjects}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">
                    Languages You Speak
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {languages.map(language => (
                      <label
                        key={language}
                        htmlFor={`lang-${language}`}
                        className={`flex items-center justify-center px-4 py-2 border rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${formData.languages.includes(language)
                            ? 'bg-pink-600 text-white border-transparent shadow-md transform scale-105'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                          }`}
                      >
                        <input
                          type="checkbox"
                          id={`lang-${language}`}
                          checked={formData.languages.includes(language)}
                          onChange={() => handleArrayChange('languages', language)}
                          className="sr-only"
                        />
                        {language}
                      </label>
                    ))}
                  </div>
                  {errors.languages && <p className="mt-2 text-sm text-red-500 font-medium pl-1 animate-pulse">{errors.languages}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">
                    Available Days
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {availabilityDays.map(day => (
                      <label
                        key={day}
                        htmlFor={`day-${day}`}
                        className={`flex items-center justify-center px-4 py-2 border rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 ${formData.availability.includes(day)
                            ? 'bg-purple-600 text-white border-transparent shadow-md transform scale-105'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                          }`}
                      >
                        <input
                          type="checkbox"
                          id={`day-${day}`}
                          checked={formData.availability.includes(day)}
                          onChange={() => handleArrayChange('availability', day)}
                          className="sr-only"
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                  {errors.availability && <p className="mt-2 text-sm text-red-500 font-medium pl-1 animate-pulse">{errors.availability}</p>}
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 ml-1 mb-1">
                    Professional Bio
                  </label>
                  <div className="relative">
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-4 py-3 border ${errors.bio ? 'border-red-300 ring-red-500' : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'} rounded-xl shadow-inner placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-200 resize-none`}
                      placeholder="Tell students about your teaching style and experience..."
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                      {formData.bio.length}/50
                    </div>
                  </div>
                  {errors.bio && <p className="mt-1 text-sm text-red-500 font-medium pl-1 animate-pulse">{errors.bio}</p>}
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="group transition-all duration-300 hover:bg-gray-50/80 p-6 rounded-2xl border border-transparent hover:border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center group-hover:text-gray-700 transition-colors duration-300">
                <span className="bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300">4</span>
                Security
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 underline decoration-2 decoration-transparent hover:decoration-indigo-500 transition-all duration-200">
                    Privacy Policy
                  </a>
                  . I understand that I will be subject to background checks and verification processes.
                </label>
              </div>
            </div>
            {errors.agreeToTerms && <p className="px-4 -mt-4 text-sm text-red-500 font-medium animate-pulse">{errors.agreeToTerms}</p>}

            <div className="px-4">
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]"
              >
                Create Tutor Account
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
                  <Link to="/tutor-login" className="font-bold text-indigo-600 hover:text-pink-600 transition-colors duration-200 hover:underline">
                    Sign in
                  </Link>
                </p>
                <span className="text-gray-300">|</span>
                <p className="text-sm text-gray-600">
                  Want to learn?{' '}
                  <Link to="/student-signup" className="font-bold text-indigo-600 hover:text-pink-600 transition-colors duration-200 hover:underline">
                    Join as a Student
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

export default TutorSignup;
