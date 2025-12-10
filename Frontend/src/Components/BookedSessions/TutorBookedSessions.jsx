import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
function TutorBookedSessions() {
    const [bookedSessions,setBookedSessions] = useState([])
    const navigate = useNavigate()
    useEffect(()=>{
      console.log("fetching booked sessions")
        const fetchBookedSessions = async ()=>{
           try{
            const response = await axios.get('/tutor/booked-sessions')
            console.log(response.data.bookedSessions)
            setBookedSessions((prev)=>[...prev,...response.data.bookedSessions])
           }catch(error){
            console.log(error)
           }
        }
        fetchBookedSessions()
    },[navigate])


  const handleCancelSession = async (sessionId) => {
    try {
      // TODO: Implement cancel session API call
      console.log('Cancelling session:', sessionId);
      const response = await axios.delete(`/tutor/booked-sessions/${sessionId}`)
      console.log(response.data)
      setBookedSessions(prev => prev.filter(session => session._id !== sessionId));
    } catch (error) {
      console.error('Error cancelling session:', error);
    }
  };

  return (
    <>
      <div className="w-full bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Booked Sessions</h1>
          
          {bookedSessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Booked Sessions</h2>
                <p className="text-gray-500">You don't have any booked sessions at the moment.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {bookedSessions.map((session) => (
                <div key={session._id} className="bg-gray-400/30 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6
                
                ">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {session.sessionId.subject || 'Subject Not Specified'}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      session.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : session.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {session.sessionId.status || 'Unknown'}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                
                    
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">Date:</span>
                      <span>{session.sessionId.date ? new Date(session.sessionId.date).toLocaleDateString() : 'Not specified'}</span>
                    </div>
              
                    
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">Duration:</span>
                      <span>{session.sessionId.duration || 'Not specified'} minutes</span>
                    </div>
                    
                    {session.notes && (
                      <div className="text-gray-600">
                        <span className="font-medium">Notes:</span>
                        <p className="text-sm mt-1">{session.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleCancelSession(session._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Cancel Session
                    </button>
                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default TutorBookedSessions