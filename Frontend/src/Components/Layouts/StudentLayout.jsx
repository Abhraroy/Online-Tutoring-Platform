import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async ()=>{
    const response = await axios.post('/student/logout');
    if(response.status === 200){
      navigate('/');
    }
  }

  return (
    <div className="h-[100vh] bg-gray-50 text-gray-800 overflow-x-hidden">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Brand */}
            <div className="flex items-center gap-3">
              <Link to="/student-home" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold">
                  TC
                </div>
                <span className="hidden sm:inline text-lg font-semibold text-gray-900">TutorConnect</span>
              </Link>
            </div>

            {/* Center: Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <NavLink
                to="/student-home"
                className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Home
              </NavLink>
              <NavLink
                to="/booked-sessions"
                className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                My Sessions
              </NavLink>
              <NavLink
                to="/find-tutors"
                className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Find Tutors
              </NavLink>
              <NavLink
                to="/messages"
                className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Messages
              </NavLink>
            </nav>

            {/* Right: Actions */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/profile"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Profile
              </Link>
              <span className="text-sm font-medium text-gray-600 hover:text-gray-900" onClick={handleLogout}>Logout</span>
            </div>

            {/* Mobile: Hamburger */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100"
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Toggle navigation"
              aria-expanded={isOpen}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="px-4 pb-4 pt-2 space-y-1">
              <NavLink to="/student-home" className={({ isActive }) => `block rounded-md px-3 py-2 text-base font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setIsOpen(false)}>Home</NavLink>
              <NavLink to="/booked-sessions" className={({ isActive }) => `block rounded-md px-3 py-2 text-base font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setIsOpen(false)}>My Sessions</NavLink>
              <NavLink to="/find-tutors" className={({ isActive }) => `block rounded-md px-3 py-2 text-base font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setIsOpen(false)}>Find Tutors</NavLink>
              <NavLink to="/messages" className={({ isActive }) => `block rounded-md px-3 py-2 text-base font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setIsOpen(false)}>Messages</NavLink>
              <div className="flex items-center gap-3 px-3 pt-2">
                <Link to="/profile" onClick={() => setIsOpen(false)} className="text-base font-medium text-gray-700">Profile</Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Content */}
        <div className="w-[100vw] flex justify-center items-start p-2 sm:p-4 gap-2 sm:gap-4 bg-gray-50">
          <Outlet />
        </div>
    </div>
  );
};

export default StudentLayout;
