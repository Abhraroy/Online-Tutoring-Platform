import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useZustandStore from '../Context/ZustandStore';

const StudentLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const { setLogin, setUser, setUserData } = useZustandStore();

  const handleLogout = async () => {
    const response = await axios.post('/student/logout');
    if(response.status === 200){
      setLogin(false);
      setUser(null);
      setUserData(null);
      navigate('/');
    }
  }

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality here
    console.log('Searching for:', searchQuery);
  }

  return (
    <div className="h-[100vh] bg-gray-50 text-gray-800 overflow-x-hidden">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Left: Logo */}
            <Link 
              to="/student-home" 
              className="flex items-center gap-2 group flex-shrink-0"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                TC
              </div>
              <span className="hidden sm:inline text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                TutorConnect
              </span>
            </Link>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-2xl mx-4 hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tutors, subjects..."
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg 
                      className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Center: Navigation Items (My Sessions & Find Tutors) */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              <NavLink
                to="/booked-sessions"
                className={({ isActive }) => 
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-indigo-100 text-indigo-700 shadow-sm' 
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100'
                  }`
                }
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>My Sessions</span>
              </NavLink>
              <NavLink
                to="/find-tutors"
                className={({ isActive }) => 
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-indigo-100 text-indigo-700 shadow-sm' 
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100'
                  }`
                }
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Find Tutors</span>
              </NavLink>
            </div>

            {/* Right: Profile Dropdown */}
            <div className="relative flex-shrink-0" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300 group"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-700">Profile</span>
                <svg 
                  className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-gray-200 py-2 transform transition-all duration-200 ease-out opacity-100 translate-y-0">
                  <Link
                    to="/student/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>View Profile</span>
                  </Link>
                  <Link
                    to="/messages"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Messages</span>
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile: Hamburger */}
            <button
              type="button"
              className="md:hidden lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors duration-300"
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Toggle navigation"
              aria-expanded={isOpen}
            >
              <svg 
                className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="border-t border-gray-200 bg-white px-4 pb-4 pt-2">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tutors, subjects..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-1">
              <NavLink 
                to="/student-home" 
                className={({ isActive }) => 
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                } 
                onClick={() => setIsOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Home</span>
              </NavLink>
              <NavLink 
                to="/booked-sessions" 
                className={({ isActive }) => 
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                } 
                onClick={() => setIsOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>My Sessions</span>
              </NavLink>
              <NavLink 
                to="/find-tutors" 
                className={({ isActive }) => 
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                } 
                onClick={() => setIsOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Find Tutors</span>
              </NavLink>
              <NavLink 
                to="/messages" 
                className={({ isActive }) => 
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                } 
                onClick={() => setIsOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Messages</span>
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
        <div className="w-[100vw] flex justify-center items-start p-2 sm:p-4 gap-2 sm:gap-4 bg-gray-50">
          <Outlet />
        </div>
    </div>
  );
};

export default StudentLayout;
