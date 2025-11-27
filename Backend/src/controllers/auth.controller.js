import User from "../models/user.models.js"
import {generateAccessToken,generateRefreshToken} from "../utils/jwt.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken"

export const googleAuthCallback = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401,"Authentication Failed")
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000,
  };

  const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie('accessToken', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);

 
  const redirectUrl = `${process.env.APP_URL}/dashboard`;
  return res.redirect(redirectUrl);
});


export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Missing refresh token');
  }

  try {
    const decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new ApiError(401, 'Invalid refresh Token');
    }

   

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, 'Refresh Token expired so login again');
    }

    
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Update refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save();

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    };

    const refreshCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    // Set new cookies
    res.cookie('accessToken', newAccessToken, cookieOptions);
    res.cookie('refreshToken', newRefreshToken, refreshCookieOptions);

    // Send response
    res.status(200).json(new ApiResponse(200, {}, 'AccessToken Refreshed'));
  } catch (err) {
    throw new ApiError(401, err?.message || 'Invalid refresh Token');
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  // Clear refresh token from database
  user.refreshToken = undefined;
  await user.save({ validateBeforeSave: false });

  // Cookie options for clearing cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  // Clear both cookies and send response
  res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .status(200)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

export const checkAuth = asyncHandler(async (req, res, next) => {
    console.log("CheckAuth Called");
    
    if (!req.user) 
    {
        throw new ApiError(401, "Unauthorized");
    }
    const user=await User.findById(req.user._id).select("-password -refreshToken");
    res.status(200).json(new ApiResponse(200, user, "User authenticated successfully"));
});

