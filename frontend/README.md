# QuickMeet 🎥
Live Demo: https://quickmeetfrontend-2bay.onrender.com/

Connect with your Loved Ones, Team, and World. A premium, secure, and high-quality video conferencing application built for seamless communication.

QuickMeet provides a crystal-clear video calling experience with low latency, wrapped in a modern Dark Glassmorphism UI. Whether for professional meetings or catching up with friends, QuickMeet bridges the distance.

🚀 Features
-> High-Quality Video & Audio: Built on WebRTC for peer-to-peer real-time communication.

-> Real-time Chat: Integrated in-meeting messaging system using Socket.io.

-> Screen Sharing: Share your screen effortlessly for presentations and collaboration.

-> Secure Authentication:

    - Custom JWT Authentication (Login/Register).

    - Google OAuth integration for one-click sign-in.

    - Forgot Password flow via email.

-> Meeting History: Track your past meetings and join codes.

-> Premium UI/UX:

    - Fully responsive Dark Mode design.

    - Glassmorphism aesthetics using Material UI (MUI).

    - Smooth animations with Framer Motion.

-> Smart Meeting Controls: Toggle Audio/Video, "Picture-in-Picture" local view, and dynamic grid layout.

🛠 Tech Stack

# Frontend

-> React.js - Component-based UI library.

-> Material UI (MUI) - Styling and Design System.

-> Framer Motion - Animations and transitions.
-> Socket.io-client - Real-time signaling.

-> Context API - State management (Auth & Meeting state).

# Backend

-> Node.js - Runtime environment.

-> Express.js - Web framework.

-> Socket.io - WebSocket implementation for signaling and chat.

-> MongoDB - Database for user data and meeting history.

-> Mongoose - ODM for MongoDB.

-> JWT - Authentication tokens.

-> Nodemailer - Email service for password recovery.

-> Google OAuth - Third-party authentication.


⚙️ Installation & Setup

Follow these steps to run QuickMeet locally.

# Prerequisites

-> Node.js (v14+)

-> npm or yarn

-> MongoDB (Local or Atlas URL)

## Clone the Repository

    git clone https://github.com/your-username/QuickMeet.git
    cd QuickMeet

## Backend Setup
    cd backend
    npm install
    Create a .env file based on .env.example and fill in the required values.
    npm start

## Frontend Setup
    cd ../frontend
    npm install
    Create a .env file based on .env.example and fill in the required values.
    npm start

📖 Usage Guide

-> Register/Login: Create an account or sign in using Google.

# Dashboard:

-> Click "Create Meeting" to generate a unique code.

-> Copy the code to the clipboard.

-> Or, paste an existing code to "Join" a meeting.

# Lobby:

-> Preview your camera and microphone before entering.

# Meeting Room:

-> Use the bottom bar to mute audio, stop video, or share screen.

-> Open the Chat sidebar to send messages.

-> Click the Red Phone icon to leave.

🔒 Security & Privacy

-> End-to-end encryption for all video and audio streams.
-> Secure JWT-based authentication.
-> GDPR compliant data handling.
-> No data is stored without user consent.

🤝 Contributing

Contributions are always welcome! If you'd like to improve the UI or add features (like recording or background blur), feel free to fork the repo.

-> Fork the Project
-> Create your Feature Branch (git checkout -b feature/AmazingFeature)
-> Commit your Changes (git commit -m 'Add some AmazingFeature')
-> Push to the Branch (git push origin feature/AmazingFeature)
-> Open a Pull Request

📞 Contact
For any questions or support, reach out at:
rajmi8948360380@gmail.com



Project Link: https://github.com/Ritesh-mishraa/QuickMeet