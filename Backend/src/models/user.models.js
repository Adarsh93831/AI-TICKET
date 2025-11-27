import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId:{ type : String },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "user", enum: ["user", "moderator","admin"] },
  skills: {
  type: [String],
  default: []
  },
  refreshToken:{
  type: String,
  default: null,
  },
  phoneNumber:{
    type: String,
   default: null,
  },
  createdAt: { type: Date, default: Date.now },
});




export default mongoose.model("User", userSchema);