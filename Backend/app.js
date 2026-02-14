import dotenv from "dotenv";

import express from 'express';
import {createServer} from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from 'cors';

import { connectToSocket } from './src/controllers/socketManager.js';
import userRoutes from './src/routes/user.routes.js';

dotenv.config({ path: './.env', debug: true }); 
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




// Export app and server for server.js
export { app, server };