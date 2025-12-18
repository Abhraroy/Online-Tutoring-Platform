import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import useZustandStore from "../Context/ZustandStore";

const ProtectedRoute = ({role,children}) => {
    const {user,loading,error} = useAuth();
    const {login} = useZustandStore();
    console.log("ProtectedRoute - login:", login, "user:", user, "loading:", loading);
    
    // Show loading while authentication is being checked
    if(loading){
        return <div>Loading...</div>;
    }
    
    // If user is logged out (login is false), redirect to landing page
    if(!login){
        return <Navigate to="/" replace />;
    }
    
    // If there's an auth error and no user, redirect to landing page
    if(error && error.response && (error.response.status === 401 || error.response.status === 403) && !user){
        console.log("ProtectedRoute - authentication error:", error);
        return <Navigate to="/" replace />;
    }
    
    // If login is true but user is not loaded yet, wait a bit more (AuthContext is still fetching)
    // This prevents premature redirects when login was just set to true
    if(login && !user){
        // Give AuthContext a moment to fetch the user
        // In practice, if login is true, user should be available soon
        // If it's taking too long, there might be an issue, but don't redirect immediately
        return <div>Loading...</div>;
    }
    
    // If we have a user but role doesn't match, redirect to landing page
    if(role && user && user.role !== role){
        console.log("ProtectedRoute - role mismatch. Expected:", role, "Got:", user.role);
        return <Navigate to="/" replace />;
    }
    
    return children;
}

export default ProtectedRoute;