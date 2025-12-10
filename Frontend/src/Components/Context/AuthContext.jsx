import { createContext,useEffect, useState, useContext } from 'react';
import axios from 'axios';
import useZustandStore from './ZustandStore';

const AuthContext = createContext();


export const AuthProvider = ({children}) => {
    const {login,setLogin} = useZustandStore();
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);

    useEffect(() => {
        console.log("AuthProvider mounted");
        setLoading(true);
        setError(null);
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/user');
                console.log("AuthContext",response.data);
                setUser(response.data.decoded);
                setError(null);
                console.log("AuthContext user",response.data.decoded);
            } catch (error) {
                console.log("AuthContext error",error);
                setError(error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [login]);
    return (
        <AuthContext.Provider value={{user,loading,error}}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => useContext(AuthContext);

