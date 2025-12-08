import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  Avatar,
  CircularProgress,
  Alert,
  CssBaseline,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockResetIcon from "@mui/icons-material/LockReset";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Dark Theme Setup
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#FF9839" },
    background: { default: "#050511" },
  },
  typography: { fontFamily: "Inter, sans-serif" },
});

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMsg("");
    setError(false);

    try {
      const backendUrl =
        process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
      const res = await axios.post(
        `${backendUrl}/api/v1/users/forgot-password`,
        { email }
      );
      setMsg(res.data.msg);
      setError(false);
    } catch (err) {
      setMsg(
        err.response?.data?.msg || "Something went wrong. Please try again."
      );
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Background Wrapper */}
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
          px: 2,
          position: "relative",
        }}
      >
        {/* Back Button */}
        <IconButton
          onClick={() => navigate("/auth")}
          sx={{
            position: "absolute",
            top: { xs: 20, md: 30 },
            left: { xs: 20, md: 30 },
            color: "white",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 2,
            transition: "all 0.2s",
            "&:hover": {
              background: "rgba(255,255,255,0.15)",
              transform: "translateY(-2px)",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Glass Card */}
        <Paper
          elevation={24}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: 4,
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Icon Header */}
          <Avatar
            sx={{
              bgcolor: "transparent",
              border: "2px solid #FF9839",
              width: 56,
              height: 56,
              color: "#FF9839",
              mb: 2,
              boxShadow: "0 0 15px rgba(255, 152, 57, 0.3)",
            }}
          >
            <LockResetIcon fontSize="large" />
          </Avatar>

          <Typography
            variant="h5"
            align="center"
            sx={{
              fontWeight: 800,
              mb: 1,
              color: "white",
            }}
          >
            Forgot Password?
          </Typography>

          <Typography
            variant="body2"
            align="center"
            sx={{ color: "#aaa", mb: 4 }}
          >
            No worries! Enter your registered email address and we will send you
            a link to reset your password.
          </Typography>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.02)",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&.Mui-focused fieldset": { borderColor: "#FF9839" },
                },
                "& .MuiInputLabel-root": { color: "#888" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#FF9839" },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !email}
              sx={{
                py: 1.5,
                borderRadius: 3,
                fontSize: "1rem",
                fontWeight: 700,
                textTransform: "none",
                background: "linear-gradient(135deg, #FF9839 0%, #ff6b39 100%)",
                boxShadow: "0 4px 15px rgba(255,152,57,0.3)",
                color: "white",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(255,152,57,0.4)",
                },
                "&.Mui-disabled": {
                  background: "rgba(255,255,255,0.1)",
                  color: "#666",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>

          {msg && (
            <Alert
              severity={error ? "error" : "success"}
              variant="filled"
              sx={{
                mt: 3,
                width: "100%",
                borderRadius: 2,
                background: error
                  ? "rgba(211, 47, 47, 0.9)"
                  : "rgba(46, 125, 50, 0.9)",
              }}
            >
              {msg}
            </Alert>
          )}

          <Button
            onClick={() => navigate("/auth")}
            sx={{
              mt: 3,
              color: "#aaa",
              textTransform: "none",
              "&:hover": { color: "white" },
            }}
          >
            Back to Login
          </Button>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
