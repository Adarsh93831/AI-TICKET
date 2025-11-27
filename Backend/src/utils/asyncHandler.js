import { ApiResponse } from "./ApiResponse.js";

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    const status =
      typeof err.statusCode === "number"
        ? err.statusCode
        : err.response?.status || 500;
    res.status(status).json(new ApiResponse(status, null, err.message, false));
  }
};
export { asyncHandler };
