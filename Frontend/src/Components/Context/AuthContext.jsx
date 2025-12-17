import { createContext,useEffect, useState, useContext } from 'react';
import axios from 'axios';
import useZustandStore from './ZustandStore';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const {login, setLogin, user, setUser, userData, setUserData} = useZustandStore();
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            console.log("AuthContext checkAuth");
            try {
              const res = await axios.get("/api/user", { withCredentials: true }); // cookie-based
              setUser(res.data.decoded);
              console.log("AuthContext",res.data.decoded);
              setLogin(true);
              console.log("AuthContext login",res);
            } catch {
              console.log("AuthContext error",error);
              setUser(null);
              setLogin(false);
            } finally {
              setLoading(false);
            }
        }
        checkAuth();
        // If login is true, fetch user data
        setLoading(true);
        setError(null);

        const fetchUser = async () => {
            // Only fetch if login is still true (check again in case it changed)
            if (!login) {
                console.log("Login state changed to false, skipping fetch");
                setLoading(false);
                return;
            }

            try {
                // First, get the decoded token with role and id
                const response = await axios.get('/api/user',{withCredentials:true});
                console.log("AuthContext",response.data);
                const decoded = response.data.decoded;
                if (decoded) {
                    setUser(decoded);
                    setError(null);
                    console.log("AuthContext user",decoded);

                    // Then, fetch full user data based on role
                    if (decoded.role && decoded.id) {
                        try {
                            let profileResponse;
                            if (decoded.role === 'student') {
                                profileResponse = await axios.get('/student/profile',{withCredentials:true});
                                console.log("Student profile", profileResponse.data);
                                if (profileResponse.data && profileResponse.data.student) {
                                    setUserData(profileResponse.data.student);
                                }
                            } else if (decoded.role === 'tutor') {
                                profileResponse = await axios.get('/tutor/profile',{withCredentials:true});
                                console.log("Tutor profile", profileResponse.data);
                                if (profileResponse.data && profileResponse.data.tutor) {
                                    setUserData(profileResponse.data.tutor);
                                }
                            }
                        } catch (profileError) {
                            console.log("Error fetching user profile:", profileError);
                            // Don't set error here, just log it - user data is optional
                            // Keep the decoded user even if profile fetch fails
                        }
                    }
                }
            } catch (error) {
                console.log("AuthContext error",error);
                // Only clear user data if it's a 401/403 (unauthorized) and login is still true
                // Also check login state again before clearing to prevent race conditions
                if (error.response && (error.response.status === 401 || error.response.status === 403) && login) {
                    console.log("Unauthorized - clearing user data");
                    setUser(null);
                    setUserData(null);
                    setLogin(false);
                    setError(error);
                } else {
                    // For other errors (network, timeout, etc.), don't clear login state
                    // Just set error but keep login state as true
                    // This prevents clearing login state on temporary network issues
                    setError(error);
                    // Don't clear user/userData on network errors or other issues
                    // The login state should remain true if it was true before
                }
            } finally {
                setLoading(false);
            }
        };
        
        // Add a small delay to ensure cookie is set after login
        const timeoutId = setTimeout(() => {
            fetchUser();
        }, 50);
        
        return () => clearTimeout(timeoutId);
    }, [login, setUser, setUserData, setLogin]);
    return (
        <AuthContext.Provider value={{user, userData, loading, error}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

