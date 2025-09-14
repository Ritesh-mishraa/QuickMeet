import express from 'express';
import {createServer} from "node:http";

import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from 'cors';
import { connectToSocket } from './controllers/socketManager.js';
import userRoutes from './routes/user.routes.js';

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", (process.env.PORT || 8000));
app.use(cors());
app.use(express.json({limit: '40kb'}));
app.use(express.urlencoded({ limit: '40kb', extended: true }));

app.use("/api/v1/users", userRoutes);

const start = async () =>{
    const connectionDb = mongoose.connect("mongodb+srv://ritesh89:Raj1234@cluster0.wlilgea.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log(`Mongo Connected DB `)
    server.listen(app.get("port"), () => {
        console.log(`Server is running on port ${app.get("port")}`);
    });
}

start();