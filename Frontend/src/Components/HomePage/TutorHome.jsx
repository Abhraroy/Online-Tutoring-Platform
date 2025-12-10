import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
function TutorHome() {
  const navigate = useNavigate();
  const [sessions,setSessions] = useState([]);

  useEffect(()=>{
    const fetchsessions = async ()=>{
      try{
        const response = await axios.get('/tutor/sessions');
        setSessions((prev)=>[...prev,...response.data.sessions]);
      }catch(error){
        console.log(error);
      }
    }
    fetchsessions();
  },[navigate])



  return (
    <div className=' bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      {/* Header Section */}
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-6xl mx-auto px-4 py-8'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>Welcome back, Tutor!</h1>
              <p className='text-gray-600'>Manage your tutoring sessions and help students succeed</p>
              <div className='mt-3 flex items-center text-sm text-gray-500'>
                <svg className='w-4 h-4 mr-2 text-indigo-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                </svg>
                <span className='font-medium text-gray-700'>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
            <div className='mt-4 sm:mt-0'>
              <button className='bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg'
              onClick={() => navigate("/create-session")}
              >
                + Create New Session
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='max-w-6xl mx-auto px-4 py-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200'>
            <div className='flex items-center'>
              <div className='p-3 bg-blue-100 rounded-lg'>
                <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                </svg>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Total Sessions</p>
                <p className='text-2xl font-bold text-gray-900'>{sessions.length}</p>
              </div>
            </div>
          </div>
          
          <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200'>
            <div className='flex items-center'>
              <div className='p-3 bg-green-100 rounded-lg'>
                <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Completed</p>
                <p className='text-2xl font-bold text-gray-900'>0</p>
              </div>
            </div>
          </div>
          
          <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200'>
            <div className='flex items-center'>
              <div className='p-3 bg-yellow-100 rounded-lg'>
                <svg className='w-6 h-6 text-yellow-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Upcoming</p>
                <p className='text-2xl font-bold text-gray-900'>{sessions.length}</p>
              </div>
            </div>
          </div>
          
          <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200'>
            <div className='flex items-center'>
              <div className='p-3 bg-purple-100 rounded-lg'>
                <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
                </svg>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Students</p>
                <p className='text-2xl font-bold text-gray-900'>0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions Section */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-100'>
            <h2 className='text-xl font-semibold text-gray-900'>Your Sessions</h2>
            <p className='text-gray-600 text-sm mt-1'>Manage and track your tutoring sessions</p>
          </div>
          
          <div className='p-6'>
            {sessions && sessions.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {sessions.map((session) => (
                  <div key={session._id} className='group bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1'>
                    <div className='flex items-start justify-between mb-4'>
                      <div className='p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors duration-200'>
                        <svg className='w-6 h-6 text-indigo-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                        </svg>
                      </div>
                      <span className='px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full'>Active</span>
                    </div>
                    
                    <h3 className='text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-200'>{session.subject}</h3>
                    
                    <div className='space-y-2 mb-4'>
                      <div className='flex items-center text-sm text-gray-600'>
                        <svg className='w-4 h-4 mr-2 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                        </svg>
                        {new Date(session.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className='flex items-center text-sm text-gray-600'>
                        <svg className='w-4 h-4 mr-2 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        {session.duration} minutes
                      </div>
                    </div>
                    
                    <div className='flex gap-2'>
                      <button className='flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium'>
                        View Details
                      </button>
                      <button className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium'>
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-12'>
                <div className='mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6'>
                  <svg className='w-12 h-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>No sessions found</h3>
                <p className='text-gray-600 mb-6 max-w-md mx-auto'>You haven't created any sessions yet. Start by creating your first tutoring session to help students learn.</p>
                <button className='bg-indigo-600 text-white py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg'
                onClick={() => navigate("/create-session")}
                >
                  Create Your First Session
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorHome