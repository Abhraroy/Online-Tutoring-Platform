import jwt from "jsonwebtoken";

export const getUser = async(req, res) => {
    console.log("Healthy usercontroller")
    console.log("UserController",req);
    console.log("UserController",req.cookies);
    try {
        const token = req.cookies?.token;
        console.log("UserController",token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("UserController",decoded);
        res.status(200).json({ message: "User fetched successfully", decoded });
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};