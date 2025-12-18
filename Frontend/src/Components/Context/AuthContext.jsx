import { createContext,useEffect, useState, useContext } from 'react';
import axios from 'axios';
import useZustandStore from './ZustandStore';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const {login, setLogin, user, setUser, userData, setUserData} = useZustandStore();
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);

    // Initial auth check on mount
    useEffect(() => {
        const checkAuth = async () => {
            console.log("AuthContext - initial checkAuth");
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get("/api/user", { withCredentials: true });
                const decoded = res.data.decoded;
                if (decoded) {
                    setUser(decoded);
                    setLogin(true);
                    console.log("AuthContext - user authenticated:", decoded);

                    // Fetch full user profile data
                    if (decoded.role && decoded.id) {
                        try {
                            let profileResponse;
                            if (decoded.role === 'student') {
                                profileResponse = await axios.get('/student/profile', { withCredentials: true });
                                console.log("Student profile", profileResponse.data);
                                if (profileResponse.data && profileResponse.data.student) {
                                    setUserData(profileResponse.data.student);
                                }
                            } else if (decoded.role === 'tutor') {
                                profileResponse = await axios.get('/tutor/profile', { withCredentials: true });
                                console.log("Tutor profile", profileResponse.data);
                                if (profileResponse.data && profileResponse.data.tutor) {
                                    setUserData(profileResponse.data.tutor);
                                }
                            }
                        } catch (profileError) {
                            console.log("Error fetching user profile:", profileError);
                            // Don't fail auth if profile fetch fails - user data is optional
                        }
                    }
                } else {
                    setUser(null);
                    setUserData(null);
                    setLogin(false);
                }
            } catch (err) {
                console.log("AuthContext - not authenticated:", err.response?.status);
                setUser(null);
                setUserData(null);
                setLogin(false);
                // Only set error for auth errors, not for network errors on initial load
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    setError(err);
                }
            } finally {
                setLoading(false);
            }
        };
        
        checkAuth();
    }, []); // Run only on mount

    // Fetch user profile when login state changes to true (after login/signup)
    useEffect(() => {
        if (!login) {
            // If login is false, don't fetch
            return;
        }

        // If we already have user with userData, don't fetch again
        if (user && userData) {
            return;
        }

        // If we have user but no userData, still fetch userData
        // (userData is optional, but we should try to fetch it if we have a user)

        const fetchUserProfile = async () => {
            console.log("AuthContext - fetching user profile after login");
            setLoading(true);
            setError(null);
            
            try {
                // First, get the decoded token with role and id
                const response = await axios.get('/api/user', { withCredentials: true });
                const decoded = response.data.decoded;
                
                if (decoded) {
                    setUser(decoded);
                    console.log("AuthContext - user fetched:", decoded);

                    // Then, fetch full user data based on role
                    if (decoded.role && decoded.id) {
                        try {
                            let profileResponse;
                            if (decoded.role === 'student') {
                                profileResponse = await axios.get('/student/profile', { withCredentials: true });
                                console.log("Student profile", profileResponse.data);
                                if (profileResponse.data && profileResponse.data.student) {
                                    setUserData(profileResponse.data.student);
                                }
                            } else if (decoded.role === 'tutor') {
                                profileResponse = await axios.get('/tutor/profile', { withCredentials: true });
                                console.log("Tutor profile", profileResponse.data);
                                if (profileResponse.data && profileResponse.data.tutor) {
                                    setUserData(profileResponse.data.tutor);
                                }
                            }
                        } catch (profileError) {
                            console.log("Error fetching user profile:", profileError);
                            // Don't fail auth if profile fetch fails
                        }
                    }
                }
            } catch (err) {
                console.log("AuthContext - error fetching user:", err);
                // Only clear user data if it's a 401/403 (unauthorized)
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    console.log("Unauthorized - clearing user data");
                    setUser(null);
                    setUserData(null);
                    setLogin(false);
                    setError(err);
                } else {
                    // For other errors (network, timeout, etc.), keep login state
                    setError(err);
                }
            } finally {
                setLoading(false);
            }
        };

        // Add a small delay to ensure cookie is set after login/signup
        const timeoutId = setTimeout(() => {
            fetchUserProfile();
        }, 100);
        
        return () => clearTimeout(timeoutId);
    }, [login, setUser, setUserData, setLogin, user, userData]);
    return (
        <AuthContext.Provider value={{user, userData, loading, error}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

