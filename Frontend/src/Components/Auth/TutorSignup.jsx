import React, { useState,useEffect } from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import axios from 'axios';
import useZustandStore from '../Context/ZustandStore';
import { useAuth } from '../Context/AuthContext';
const TutorSignup = () => {
  const {user,loading,error} = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && user?.role === "tutor") {
      navigate("/tutor-home");
    }
    if(error){
      console.log("TutorSignup error",error);
      navigate("/tutor-signup");
    }
  }, [loading,user,navigate,error]);

  const {login,setLogin} = useZustandStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
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
          name: formData.firstName + " " + formData.lastName,
          email: formData.email,
          password: formData.password,
          subject: formData.subjects.join(', '), // Convert array to string for backend
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
        if(response.status !== 201){
          navigate("/login");
        }
        else{
          setLogin(true);
          navigate("/tutor-home",{replace:true});
        }
      } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        // Handle error (show error message to user)
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Join as a Tutor
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Share your knowledge and help students succeed
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Teaching Information */}
            <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Teaching Information</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                      Teaching Experience *
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.experience ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select experience level</option>
                      {experienceLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                    {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
                  </div>
                  <div>
                    <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                      Education Level *
                    </label>
                    <select
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.education ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select education level</option>
                      {educationLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                    {errors.education && <p className="mt-1 text-sm text-red-600">{errors.education}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjects You Teach * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {subjects.map(subject => (
                      <label key={subject} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.subjects.includes(subject)}
                          onChange={() => handleArrayChange('subjects', subject)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{subject}</span>
                      </label>
                    ))}
                  </div>
                  {errors.subjects && <p className="mt-1 text-sm text-red-600">{errors.subjects}</p>}
                </div>

                <div>
                  <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                    Hourly Rate (USD) *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      id="hourlyRate"
                      name="hourlyRate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.hourlyRate}
                      onChange={handleChange}
                      className={`block w-full pl-7 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.hourlyRate ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="25.00"
                    />
                  </div>
                  {errors.hourlyRate && <p className="mt-1 text-sm text-red-600">{errors.hourlyRate}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="lowerGrade" className="block text-sm font-medium text-gray-700">
                      Lowest Grade You Teach *
                    </label>
                    <select
                      id="lowerGrade"
                      name="lowerGrade"
                      value={formData.lowerGrade}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.lowerGrade ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select lowest grade</option>
                      {gradeLevels.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                    {errors.lowerGrade && <p className="mt-1 text-sm text-red-600">{errors.lowerGrade}</p>}
                  </div>
                  <div>
                    <label htmlFor="upperGrade" className="block text-sm font-medium text-gray-700">
                      Highest Grade You Teach *
                    </label>
                    <select
                      id="upperGrade"
                      name="upperGrade"
                      value={formData.upperGrade}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.upperGrade ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select highest grade</option>
                      {gradeLevels.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                    {errors.upperGrade && <p className="mt-1 text-sm text-red-600">{errors.upperGrade}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio * (Tell students about yourself)
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.bio ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="I have been teaching mathematics for 5 years and love helping students understand complex concepts..."
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.bio.length}/50 characters minimum
                  </p>
                  {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
                </div>

                <div>
                  <label htmlFor="certifications" className="block text-sm font-medium text-gray-700">
                    Certifications (Optional)
                  </label>
                  <input
                    id="certifications"
                    name="certifications"
                    type="text"
                    value={formData.certifications}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Teaching License, Subject-specific certifications, etc."
                  />
                </div>
              </div>
            </div>

            {/* Availability & Languages */}
            <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Availability & Languages</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Days * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                    {availabilityDays.map(day => (
                      <label key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.availability.includes(day)}
                          onChange={() => handleArrayChange('availability', day)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{day}</span>
                      </label>
                    ))}
                  </div>
                  {errors.availability && <p className="mt-1 text-sm text-red-600">{errors.availability}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages You Speak * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {languages.map(language => (
                      <label key={language} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.languages.includes(language)}
                          onChange={() => handleArrayChange('languages', language)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{language}</span>
                      </label>
                    ))}
                  </div>
                  {errors.languages && <p className="mt-1 text-sm text-red-600">{errors.languages}</p>}
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Create a strong password"
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

          </div>

          {/* Terms and Conditions */}
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-500">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-500">
                  Privacy Policy
                </a>
                . I understand that I will be subject to background checks and verification processes.
              </label>
            </div>
            {errors.agreeToTerms && <p className="text-sm text-red-600">{errors.agreeToTerms}</p>}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Create Tutor Account
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/tutor-login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in here
              </Link>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Want to learn instead?{' '}
              <Link to="/student-signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up as a student
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TutorSignup;
