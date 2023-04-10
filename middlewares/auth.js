import jwt from "jsonwebtoken";
import { User } from "../models/user.js"

export const isAuthenticated = async (req, res,next) => {
    try {
        const {token} = req.cookies;
        if(!token) { 
            return res.status(401).json({ message: "Login First", success:false });
        }
       
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
       
        req.user = await User.findById(decoded._id);
       
        next();
    } catch (error) {
        res.status(500).json({ message: error.message,success:false });
    }
}
