import jwt from "jsonwebtoken";

export const authMiddleware = (allowedRole) => {
    return (req, res, next) => {
        console.log("Healthy authmiddleware")
        console.log("AuthMiddleware",req.cookies);
        try {
            // Get token from headers (you can also use 'Authorization' header)
            const token = req.cookies?.token;
            console.log("AuthMiddleware",token);
            if (!token) return res.status(401).json({ message: "Token missing" });

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("AuthMiddleware",decoded);
            // Role check
            if (allowedRole && decoded.role !== allowedRole) {
                return res.status(403).json({ message: "Forbidden: Access denied" });
            }

            // Attach user info to request
           
            req.userId = decoded.id;
            req.role = decoded.role;

            next(); // proceed to route
        } catch (error) {
            res.status(401).json({ message: "Invalid or expired token" });
        }
    };
};
