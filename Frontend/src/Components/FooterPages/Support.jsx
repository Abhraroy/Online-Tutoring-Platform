import React from 'react';

const Support = () => {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Support</h1>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-3">
          This static support page explains how users might reach out for technical or account assistance
          when using TutorConnect.
        </p>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
          In a real deployment, this page would contain links to FAQs, email addresses, and live chat or
          ticketing options. In this demo, it simply serves as placeholder content.
        </p>
      </div>
    </div>
  );
};

export default Support;

