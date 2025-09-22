import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing";
import Authentication from "./pages/authentication";
import { AuthProvider } from "./context/AuthContext";
import VideoMeet from "./pages/videoMeet";
import History from "./pages/history";
import HomeComponent from "./pages/home";
import ForgotPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPasssword";


function App() {
  return (
    <>
      
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route path="/auth" element={<Authentication />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path="/home" element={<HomeComponent />} />

            <Route path="/history" element={<History />} />

            <Route path="/:url" element={<VideoMeet />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
