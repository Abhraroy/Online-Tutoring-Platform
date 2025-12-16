import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateSession() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    grade: '',
    date: '',
    time: '',
    duration: 60,
    availableSlots: 1,
    fee: '',
    status: 'open'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjects = [
    'Mathematics', 'Science', 'English', 'History', 'Geography',
    'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics',
    'Literature', 'Art', 'Music', 'Foreign Languages', 'Test Prep',
    'SAT/ACT', 'GRE', 'GMAT', 'LSAT', 'MCAT', 'Other'
  ];

  const grades = [
    'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
    'College Freshman', 'College Sophomore', 'College Junior', 'College Senior',
    'Graduate', 'Adult'
  ];

  const durationOptions = [
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' }
  ];

  const statusOptions = [
    { value: 'open', label: 'Open', description: 'Session is open for bookings' },
    { value: 'closed', label: 'Closed', description: 'Session is closed and not accepting bookings' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subject.trim()) newErrors.subject = 'Please select a subject';
    if (!formData.topic.trim()) newErrors.topic = 'Please enter a topic';
    if (!formData.grade.trim()) newErrors.grade = 'Please select a grade level';
    if (!formData.date) newErrors.date = 'Please select a date';
    else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Session date cannot be in the past';
      }
      else if(selectedDate === today){
        newErrors.date = 'Session date must not be today but can be in the future';
      }
    }
    if (!formData.time) newErrors.time = 'Please select a time';
    if (!formData.duration) newErrors.duration = 'Please select session duration';
    if (!formData.availableSlots || formData.availableSlots < 1) {
      newErrors.availableSlots = 'Please enter available slots (minimum 1)';
    } else if (isNaN(formData.availableSlots) || parseInt(formData.availableSlots) < 1) {
      newErrors.availableSlots = 'Please enter a valid number of slots';
    }
    if (!formData.fee) newErrors.fee = 'Please enter the session fee';
    else if (isNaN(formData.fee) || parseFloat(formData.fee) <= 0) {
      newErrors.fee = 'Please enter a valid fee amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Combine date and time
        const sessionDateTime = new Date(`${formData.date}T${formData.time}`);
        
        const payload = {
          subject: formData.subject,
          topic: formData.topic.trim(),
          grade: formData.grade,
          date: sessionDateTime,
          duration: parseInt(formData.duration),
          availableSlots: parseInt(formData.availableSlots),
          fee: parseFloat(formData.fee),
          status: formData.status || 'open'
        };

        const response = await axios.post('/tutor/create-session', payload, { withCredentials: true });
        console.log('Session created successfully:', response.data);
        
        // Redirect to tutor home after successful creation
        navigate('/tutor-home');
      } catch (error) {
        console.error('Error creating session:', error.response?.data || error.message);
        setErrors({ submit: 'Failed to create session. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className=" bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Session</h1>
          <p className="text-gray-600">Set up a new tutoring session for your students</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject Selection */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.subject ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
              </div>

              {/* Grade Selection */}
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Level *
                </label>
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.grade ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a grade</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
                {errors.grade && <p className="mt-1 text-sm text-red-600">{errors.grade}</p>}
              </div>

              {/* Topic */}
              <div className="lg:col-span-2">
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                  Topic *
                </label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="e.g., Algebra Basics, World War II, Organic Chemistry"
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.topic ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.topic && <p className="mt-1 text-sm text-red-600">{errors.topic}</p>}
              </div>

              {/* Date and Time */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Session Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Session Time *
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.time ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
              </div>

              {/* Duration and Available Slots */}
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Session Duration *
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.duration ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  {durationOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
              </div>

              <div>
                <label htmlFor="availableSlots" className="block text-sm font-medium text-gray-700 mb-2">
                  Available Slots *
                </label>
                <input
                  type="number"
                  id="availableSlots"
                  name="availableSlots"
                  min="1"
                  value={formData.availableSlots}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.availableSlots ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.availableSlots && <p className="mt-1 text-sm text-red-600">{errors.availableSlots}</p>}
              </div>

              {/* Fee */}
              <div>
                <label htmlFor="fee" className="block text-sm font-medium text-gray-700 mb-2">
                  Session Fee (USD) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="fee"
                    name="fee"
                    min="0"
                    step="0.01"
                    value={formData.fee}
                    onChange={handleChange}
                    placeholder="25.00"
                    className={`block w-full pl-7 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.fee ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.fee && <p className="mt-1 text-sm text-red-600">{errors.fee}</p>}
              </div>

              {/* Session Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Session Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.status ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {formData.status && (
                  <p className="mt-1 text-xs text-gray-500">
                    {statusOptions.find(opt => opt.value === formData.status)?.description}
                  </p>
                )}
                {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/tutor-home')}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
              >
                {isSubmitting ? 'Creating Session...' : 'Create Session'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateSession;