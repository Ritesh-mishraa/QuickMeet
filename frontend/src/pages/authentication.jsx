import * as React from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Divider,
  Snackbar,
  Alert,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  IconButton,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";
import { AuthContext } from "../context/AuthContext";

export default function Authentication() {
  const navigate = useNavigate();
  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");

  const [formState, setFormState] = React.useState(0);
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (formState === 0) {
        if (!username.trim() || !password.trim()) {
          throw new Error("Username and password are required");
        }
        await handleLogin(username, password);
        setMessage("Login successful!");
      } else {
        if (!name || !username || !password || !email)
          throw new Error("All fields are required");

        if (!isValidEmail(email)) throw new Error("Invalid email");
        if (password.length < 6)
          throw new Error("Password must be at least 6 characters");

        await handleRegister(name, username, password, email);
        setMessage("Registration successful! Please login.");
        setFormState(0);

        setName("");
        setEmail("");
        setUsername("");
        setPassword("");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setOpen(true);
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const token = credentialResponse.credential;

      if (!token) {
        throw new Error("No token received from Google");
      }

      const backendUrl =
        process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

      const response = await axios.post(
        `${backendUrl}/api/v1/users/google-login`,
        { token },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );

      if (!response.data || !response.data.token) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", response.data.token);
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      setMessage("Google Login successful!");
      setError("");
      setOpen(true);

      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (err) {
      console.error("Google login failed:", err);
      let errorMessage = "Google login failed";

      if (err.response) {
        errorMessage =
          err.response.data?.error ||
          err.response.data?.message ||
          errorMessage;
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection.";
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please try again.";
      }

      setError(errorMessage);
      setMessage("");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error("Google Login Error");
    setError("Google Login failed. Please try again.");
    setMessage("");
    setOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          background: `
            radial-gradient(circle at 15% 15%, rgba(255, 152, 57, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 85% 85%, rgba(125, 42, 232, 0.15) 0%, transparent 50%),
            #050511
          `,
          backgroundSize: "cover",
          px: { xs: 1.5, sm: 3, md: 4 },
          py: { xs: 2, sm: 3 },
          position: "relative",
        }}
      >
        <IconButton
          onClick={() => navigate("/")}
          sx={{
            position: "absolute",
            top: { xs: 10, sm: 20, md: 25 },
            left: { xs: 10, sm: 20, md: 25 },
            color: "white",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 2,
            p: { xs: 0.8, sm: 1.2 },
            transition: "all 0.2s",
            "&:hover": {
              background: "rgba(255,255,255,0.15)",
              transform: "translateY(-2px)",
            },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: { xs: 22, sm: 24, md: 26 } }} />
        </IconButton>

        <Paper
          elevation={24}
          sx={{
            width: "100%",
            maxWidth: { xs: 340, sm: 420, md: 430 },
            p: { xs: 2.5, sm: 3.5, md: 4 },
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: "transparent",
                border: "2px solid #FF9839",
                width: { xs: 50, sm: 60 },
                height: { xs: 50, sm: 60 },
                color: "#FF9839",
              }}
            >
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
          </Box>

          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 800,
              mb: 1.5,
              fontSize: { xs: "1.8rem", sm: "2rem" },
              background: "linear-gradient(90deg, #fff, #ccc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            QuickMeet
          </Typography>

          <Tabs
            value={formState}
            onChange={(e, v) => {
              setFormState(v);
              setError("");
              setMessage("");
            }}
            centered
            sx={{
              "& .MuiTab-root": {
                color: "#888",
                fontWeight: 600,
                fontSize: { xs: "0.85rem", sm: "1rem" },
                transition: "color 0.2s",
                "&:hover": { color: "#fff" },
              },
              "& .Mui-selected": {
                color: "#FF9839 !important",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#FF9839",
              },
              mb: { xs: 2, sm: 3 },
            }}
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          <Box sx={{ mt: { xs: 1, sm: 2 } }}>
            {formState === 1 && (
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.4)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#FF9839" },
                  },
                  "& .MuiInputLabel-root": { color: "#aaa" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#FF9839" },
                }}
              />
            )}

            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
                  "&.Mui-focused fieldset": { borderColor: "#FF9839" },
                },
                "& .MuiInputLabel-root": { color: "#aaa" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#FF9839" },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
                  "&.Mui-focused fieldset": { borderColor: "#FF9839" },
                },
                "& .MuiInputLabel-root": { color: "#aaa" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#FF9839" },
              }}
            />

            {formState === 0 && (
              <Typography
                variant="body2"
                align="right"
                sx={{
                  color: "#FF9839",
                  cursor: "pointer",
                  mt: 1,
                  fontWeight: 500,
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                py: { xs: 1.2, sm: 1.4 },
                borderRadius: 3,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                fontWeight: 800,
                textTransform: "none",
                background: "linear-gradient(135deg, #FF9839 0%, #ff6b39 100%)",
                boxShadow: "0 4px 15px rgba(255,152,57,0.3)",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(255,152,57,0.4)",
                },
              }}
              onClick={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : formState === 0 ? (
                "Login"
              ) : (
                "Register"
              )}
            </Button>
          </Box>

          <Divider
            sx={{ my: { xs: 2, sm: 3 }, borderColor: "rgba(255,255,255,0.1)" }}
          >
            <Typography
              sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" }, color: "#888" }}
            >
              Or continue with
            </Typography>
          </Divider>

          {/* 3. REPLACED CUSTOM BUTTON WITH OFFICIAL GOOGLE COMPONENT */}
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              shape="pill"
              size="large"
              width="300" // Approximate width to match inputs
            />
          </Box>
        </Paper>

        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity={error ? "error" : "success"}
            variant="filled"
            sx={{ borderRadius: 2 }}
          >
            {error || message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
