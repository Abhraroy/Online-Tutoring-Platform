import React from 'react';

const Contact = () => {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4">
          This is a static contact page. For demo purposes, the details below are placeholders and do not send real messages.
        </p>
        <ul className="text-gray-600 text-sm sm:text-base space-y-2">
          <li><span className="font-semibold text-gray-800">Email:</span> support@tutorconnect.example</li>
          <li><span className="font-semibold text-gray-800">Phone:</span> +1 (000) 000-0000</li>
          <li><span className="font-semibold text-gray-800">Hours:</span> Monday – Friday, 9:00 AM – 6:00 PM</li>
        </ul>
      </div>
    </div>
  );
};

export default Contact;

