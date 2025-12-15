import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useZustandStore from '../Context/ZustandStore';

const TutorLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { setLogin, setUser, setUserData } = useZustandStore();
  const handleLogout = async () => {
    try{const response = await axios.post('/tutor/logout');
    if(response.status === 200){
      console.log("Tutor logged out successfully");
      setLogin(false);
      setUser(null);
      setUserData(null);
      navigate("/");
    }else{
      console.log("Tutor logged out failed",response.data.message);
    }
}catch(error){
      console.log("Tutor logged out failed",error);
    }
  };

  return (
    <div className="min-h-[100vh] flex flex-col overflow-x-hidden overflow-y-auto bg-gray-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Brand */}
            <div className="flex items-center gap-3">
              <Link to="/tutor-home" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold">
                  TC
                </div>
                <span className="hidden sm:inline text-lg font-semibold text-gray-900">TutorConnect</span>
              </Link>
            </div>

            {/* Center: Desktop Nav */}
            <nav className="hidden md:flex items-center gap-3">
              <NavLink
                to="/tutor-home"
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-out
                  ${isActive
                    ? 'text-indigo-700 bg-indigo-100 shadow-md shadow-indigo-100 scale-[1.02]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5'}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/tutor/booked-sessions"
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-out
                  ${isActive
                    ? 'text-indigo-700 bg-indigo-100 shadow-md shadow-indigo-100 scale-[1.02]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5'}`
                }
              >
                Booked Sessions
              </NavLink>
              <NavLink
                to="/tutor/hired-by-students"
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-out
                  ${isActive
                    ? 'text-indigo-700 bg-indigo-100 shadow-md shadow-indigo-100 scale-[1.02]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5'}`
                }
              >
                Hired Sessions
              </NavLink>
              <NavLink
                to="/tutor/past-sessions"
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-out
                  ${isActive
                    ? 'text-indigo-700 bg-indigo-100 shadow-md shadow-indigo-100 scale-[1.02]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5'}`
                }
              >
                History
              </NavLink>
            </nav>

            {/* Right: Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/tutor/profile"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-full transition-all duration-200 ease-out hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5"
              >
                Profile
              </Link>
              <button
                type="button"
                className="text-sm font-medium text-gray-600 hover:text-red-600 cursor-pointer px-3 py-1.5 rounded-full border border-transparent hover:border-red-100 transition-all duration-200 ease-out hover:bg-red-50 hover:shadow-md hover:-translate-y-0.5"
              onClick={() => handleLogout()}
              >
                Logout
              </button>
            </div>

            {/* Mobile: Hamburger */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 transition-colors duration-150"
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
              <NavLink
                to="/tutor-home"
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-base font-medium transition-all duration-200
                  ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'}`
                }
                onClick={() => setIsOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/tutor/booked-sessions"
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-base font-medium transition-all duration-200
                  ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'}`
                }
                onClick={() => setIsOpen(false)}
              >
                Booked Sessions
              </NavLink>
              <NavLink
                to="/tutor/hired-by-students"
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-base font-medium transition-all duration-200
                  ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'}`
                }
                onClick={() => setIsOpen(false)}
              >
                Hired Sessions
              </NavLink>
              <NavLink
                to="/tutor/past-sessions"
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-base font-medium transition-all duration-200
                  ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'}`
                }
                onClick={() => setIsOpen(false)}
              >
                History
              </NavLink>
              <div className="flex items-center gap-3 px-3 pt-2">
                <Link to="/tutor/profile" onClick={() => setIsOpen(false)} className="text-base font-medium text-gray-700">Profile</Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="text-base font-medium text-gray-700 cursor-pointer px-3 py-1.5 rounded-full border border-transparent hover:border-red-100 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="w-[100vw] flex-1 flex justify-center items-start p-2 sm:p-4 bg-gray-50">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 bg-white/90 backdrop-blur-sm mt-auto">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">TutorConnect</span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/help-center" className="hover:text-indigo-600 transition-colors">
              Help Center
            </Link>
            <Link to="/support" className="hover:text-indigo-600 transition-colors">
              Support
            </Link>
            <Link to="/privacy" className="hover:text-indigo-600 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-indigo-600 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TutorLayout;
