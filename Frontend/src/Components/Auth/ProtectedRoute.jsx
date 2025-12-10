import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const ProtectedRoute = ({role,children}) => {
    const {user,loading,error} = useAuth();
    if(loading){
        return <div>Loading...</div>;
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