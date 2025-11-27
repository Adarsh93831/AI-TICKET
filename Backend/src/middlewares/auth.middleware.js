import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const verifyJWT = async(req, res, next) => {

  let token = req.cookies?.accessToken;
  

  
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
    
  }


  

  if (!token) {
    return res.status(401).json(new ApiResponse(401, null, 'Token not found'));
  }

  try {
   
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
 
    const user = await User.findById(decoded._id);
  

    req.user = user;
    
    
    next();
  } 
  catch (err) {
    console.log('❌ Token verification failed:', err.message);
    return res.status(403).json(new ApiResponse(403, null, 'Invalid or expired token'));
  }
};
