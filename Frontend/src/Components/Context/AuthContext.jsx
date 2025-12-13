import { createContext,useEffect, useState, useContext } from 'react';
import axios from 'axios';
import useZustandStore from './ZustandStore';

const AuthContext = createContext();


export const AuthProvider = ({children}) => {
    const {login,setLogin} = useZustandStore();
    const [user,setUser] = useState(null);
    const [userData,setUserData] = useState(null);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);

    useEffect(() => {
        console.log("AuthProvider mounted");
        setLoading(true);
        setError(null);
        const fetchUser = async () => {
            try {
                // First, get the decoded token with role and id
                const response = await axios.get('/api/user');
                console.log("AuthContext",response.data);
                const decoded = response.data.decoded;
                setUser(decoded);
                setError(null);
                console.log("AuthContext user",decoded);

                // Then, fetch full user data based on role
                if (decoded && decoded.role && decoded.id) {
                    try {
                        let profileResponse;
                        if (decoded.role === 'student') {
                            profileResponse = await axios.get('/student/profile');
                            console.log("Student profile", profileResponse.data);
                            setUserData(profileResponse.data.student);
                        } else if (decoded.role === 'tutor') {
                            profileResponse = await axios.get('/tutor/profile');
                            console.log("Tutor profile", profileResponse.data);
                            setUserData(profileResponse.data.tutor);
                        }
                    } catch (profileError) {
                        console.log("Error fetching user profile:", profileError);
                        // Don't set error here, just log it - user data is optional
                    }
                }
            } catch (error) {
                console.log("AuthContext error",error);
                setError(error);
                setUser(null);
                setUserData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [login]);
    return (
        <AuthContext.Provider value={{user, userData, loading, error}}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => useContext(AuthContext);

