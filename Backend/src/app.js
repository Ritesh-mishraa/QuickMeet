import express from 'express';
import {createServer} from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv'; // Import dotenv
import { connectToSocket } from './controllers/socketManager.js';
import userRoutes from './routes/user.routes.js';

dotenv.config({ path: '../.env', debug: true }); 
const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000); // Use PORT from .env
app.use(cors());
app.use(express.json({limit: '40kb'}));
app.use(express.urlencoded({ limit: '40kb', extended: true }));

app.use("/api/v1/users", userRoutes);



const start = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        
        process.exit(1); // Exit the process with an error code
    }

    try {
        await mongoose.connect(mongoUri); // Use MONGO_URI from .env
        console.log(`MongoDB connected successfully`);
        server.listen(app.get("port"), () => {
            console.log(`Server is running on port ${app.get("port")}`);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit the process with an error code
    }
};

start();