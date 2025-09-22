import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Not required for OAuth users
  picture: String,
  googleId: String,
  authProvider: { 
    type: String, 
    enum: ['local', 'google'], 
    default: 'local' 
  },
  isEmailVerified: { type: Boolean, default: false },
  token: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

const User = mongoose.model("User", userSchema);

export { User };
