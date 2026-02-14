import dotenv from "dotenv";
import mongoose from "mongoose";
import { app, server } from "./app.js";

dotenv.config({ path: './.env', debug: true });

const start = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error("MONGO_URI not found in environment variables");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log(`MongoDB connected successfully`);
        server.listen(app.get("port"), () => {
            console.log(`Server is running on port ${app.get("port")}`);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

start();
