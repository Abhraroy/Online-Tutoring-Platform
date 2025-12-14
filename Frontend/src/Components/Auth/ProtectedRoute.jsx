import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import useZustandStore from "../Context/ZustandStore";

const ProtectedRoute = ({role,children}) => {
    const {user,loading,error} = useAuth();
    const {login} = useZustandStore();
    console.log("ProtectedRoute user", user);
    if(loading){
        return <div>Loading...</div>;
    }
    // If user is logged out (login is false), redirect to home instead of login
    if(!login){
        return <Navigate to="/" replace />;
    }
    if(error && !user){
        console.log("ProtectedRoute error",error);
        return <Navigate to="/" />;
    }
    if(!user){
        return <Navigate to="/login" />;
    }
    if(role && user.role !== role){
        return <Navigate to="/" replace />;
    }
    return children;
}

export default ProtectedRoute;