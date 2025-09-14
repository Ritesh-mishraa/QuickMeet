import mongoose, { Schema } from "mongoose";

const userScheme = new Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        email: { type: String, unique: true, sparse: true },
        token: { type: String }
    }
)

const User = mongoose.model("User", userScheme);

export { User };