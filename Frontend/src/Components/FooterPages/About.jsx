import React from 'react';

const About = () => {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">About TutorConnect</h1>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
          TutorConnect is a demo online tutoring platform where students can discover tutors and manage
          learning sessions, and tutors can organize and track their teaching. This page is static and
          intended only to provide example informational content for the footer navigation.
        </p>
      </div>
    </div>
  );
};

export default About;


