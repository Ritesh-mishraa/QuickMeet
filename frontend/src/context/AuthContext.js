
import { StatusCodes } from "http-status-codes"; 
import axios from "axios";
import httpStatus from "http-status";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
//import server from "../environment";


export const AuthContext = createContext({});

const client = axios.create({
    baseURL: `http://localhost:8000/api/v1/users`
})


export const AuthProvider = ({ children }) => {

    const authContext = useContext(AuthContext);


    const [userData, setUserData] = useState(authContext);


    const router = useNavigate();

    const handleRegister = async (name, username, password, email) => {
        try {
            let request = await client.post("/register", {
                name,
                username,
                email,
                password
            })

            return request.data.message;

            
        } catch (err) {
    // Safely throw a clear error
    const message = err?.response?.data?.message || err.message || "Registration failed";
    throw new Error(message);
  }
    }

    const handleLogin = async (username, password) => {
        try {
            
            let request = await client.post("/login", {
                username,
                password
            });

            

            if (request.status === StatusCodes.OK) {
                localStorage.setItem("token", request.data.token);
                router("/home")
            }
        } catch (err) {
            throw err;
        }
    }

    const getHistoryOfUser = async () => {
        try {
            let request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token")
                }
            });
            return request.data
        } catch
         (err) {
            throw err;
        }
    }

    const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            });
            return request
        } catch (e) {
            throw e;
        }
    }

    

    const data = {
        userData, setUserData, handleRegister, handleLogin, getHistoryOfUser, addToUserHistory
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )

}
