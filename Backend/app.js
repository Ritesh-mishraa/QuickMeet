import dotenv from "dotenv";

import express from 'express';
import {createServer} from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from 'cors';

import { connectToSocket } from './src/controllers/socketManager.js';
import userRoutes from './src/routes/user.routes.js';

dotenv.config({ path: '../.env', debug: true }); 
const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.use((req, res, next) => {
  // Allow communication from pop-up windows
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

app.set("port", process.env.PORT || 8000); 

app.use(express.json({limit: '40kb'}));
app.use(express.urlencoded({ limit: '40kb', extended: true }));

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8000', 'https://quickmeetfrontend-2bay.onrender.com'],
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

start();