import React from 'react';

const Terms = () => {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Terms of Use</h1>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-3">
          This static page outlines example terms and conditions for using the TutorConnect platform.
        </p>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
          By using this demo application, you agree that all data, sessions, and accounts are for testing
          and educational purposes only, and do not represent a live production service.
        </p>
      </div>
    </div>
  );
};

export default Terms;

