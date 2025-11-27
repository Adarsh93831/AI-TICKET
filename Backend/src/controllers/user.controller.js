import User from "../models/user.models.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"

export const addOrUpdateSkills = asyncHandler(async (req, res) => {
    
    const { skills } = req?.body;
    if (!skills) {
        throw new ApiError(400, "Skills are required");
    }
    
    const user = await User.findById(req.user._id);

    if(!user)
    {
        throw new ApiError(404,"User not found");
    }
    

    user.skills = skills;
    await user.save();

    // Remove sensitive or irrelevant fields before sending the response
    const userObj = user.toObject();
    delete userObj.refreshToken;

    res.status(200).json(new ApiResponse(200, userObj, "Skills updated successfully"));
});

export const addOrUpdatePhoneNumber = asyncHandler(async (req, res) => {
    const { phoneNumber } = req?.body;
    if (!phoneNumber) {
        throw new ApiError(400, "Phone number is required");
    }

    const user = await User.findById(req.user._id);

    user.phoneNumber = phoneNumber;
    await user.save();

    const userObj = user.toObject();
    delete userObj.refreshToken;

    res.status(200).json(new ApiResponse(200, userObj, "Phone number updated successfully"));
});


export const updateUser=asyncHandler(async(req,res)=>{
    const {skills=[],role,email}=req.body;

    const requser=await User.findById(req.user._id);

    if(requser?.role!=="admin")
    {
        throw new ApiError(403,"Forbidden");
    }

    const user=await User.findOne({email});
    if(!user) {
        throw new ApiError(401,"User not found");
    }

    user.skills = skills.length ? skills : user.skills;
    user.role = role || user.role;
    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.refreshToken;

    return res.status(200).json(new ApiResponse(200, updatedUser, "User updated successfully"));
})

export const getUsers=asyncHandler(async(req,res)=>{
      if (req.user.role !== "admin") {
      return res.status(403).json(new ApiResponse(403, null, "Access denied. Admin privileges required."));
    }

    const users = await User.find().select("-password -refreshToken");
    return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
})