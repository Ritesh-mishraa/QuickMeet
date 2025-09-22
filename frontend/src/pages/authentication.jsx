// import * as React from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import {GoogleLogin} from '@react-oauth/google'; 
// import { useNavigate } from "react-router-dom";
// import Avatar from "@mui/material/Avatar";
// import Button from "@mui/material/Button";
// import CssBaseline from "@mui/material/CssBaseline";
// import TextField from "@mui/material/TextField";
// import Box from "@mui/material/Box";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import Typography from "@mui/material/Typography";
// import Container from "@mui/material/Container";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { AuthContext } from "../context/AuthContext";
// import Snackbar from "@mui/material/Snackbar";
// import servers from "../environment";

// const theme = createTheme();

// export default function Authentication() {
//   const navigate = useNavigate();

//   const [username, setUsername] = React.useState("");
//   const [password, setPassword] = React.useState("");
//   const [name, setName] = React.useState("");
//   const [email, setEmail] = React.useState("");
//   const [error, setError] = React.useState("");
//   const [message, setMessage] = React.useState("");
//   const [formState, setFormState] = React.useState(0); // 0 = Login, 1 = Register
//   const [open, setOpen] = React.useState(false);

   


//   const { handleRegister, handleLogin } = React.useContext(AuthContext);

//   const handleAuth = async () => {
//     try {
//       if (formState === 0) {
//         // Login - add validation
//         if (!username.trim() || !password.trim()) {
//           throw new Error("Username and password are required");
//         }
//         const result = await handleLogin(username, password);
//         console.log("Login success:", result);
//         setMessage("Login successful!");
//       } else {
//         // Register - add validation
//         if (
//           !name.trim() ||
//           !username.trim() ||
//           !password.trim() ||
//           !email.trim()
//         ) {
//           throw new Error("All fields are required");
//         }
//         const result = await handleRegister(name, username, password, email);
//         console.log("Register success:", result);
//         setMessage(result || "User registered successfully!");
//         setFormState(0);
//         // Clear form with empty strings
//         setUsername("");
//         setPassword("");
//         setEmail("");
//         setName("");
//       }
//       setError("");
//       setOpen(true);
//     } catch (err) {
//       console.error("Error caught in frontend:", err);
//       const msg =
//         err?.response?.data?.message || err.message || "Something went wrong";
//       setError(msg);
//       setOpen(true);
//     }
//   };


//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       const token = credentialResponse.credential;
//       const decoded = jwtDecode(token);

//       // Send token to backend
//      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/google-login`, { token });

//       localStorage.setItem("token", res.data.token);
//       setMessage("Google Login successful!");
//       setOpen(true);

//       navigate("/home"); // redirect after login
//     } catch (err) {
//       console.error("Google login failed:", err);
//       setError("Google login failed");
//       setOpen(true);
//     }
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Container component="main" maxWidth="xs">
//         <CssBaseline />
//         <Box
//           sx={{
//             marginTop: 8,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
//             <LockOutlinedIcon />
//           </Avatar>
//           <Typography component="h1" variant="h5">
//             {formState === 0 ? "Sign In" : "Sign Up"}
//           </Typography>

//           <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
//             <Button
//               variant={formState === 0 ? "contained" : "outlined"}
//               color="primary"
//               onClick={() => setFormState(0)}
//             >
//               Sign In
//             </Button>
//             <Button
//               variant={formState === 1 ? "contained" : "outlined"}
//               color="primary"
//               onClick={() => setFormState(1)}
//             >
//               Sign Up
//             </Button>
//           </Box>

//           <Box component="form" noValidate sx={{ mt: 3 }}>
//             {formState === 1 && (
//               <>
//                 <TextField
//                   margin="normal"
//                   required
//                   fullWidth
//                   label="Full Name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//                 <TextField
//                   margin="normal"
//                   required
//                   fullWidth
//                   label="Email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </>
//             )}

//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               label="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               label="Password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />

//             {formState === 0 ? (
//               <Typography
//                 variant="body2"
//                 sx={{ mt: 1, cursor: "pointer", color: "primary.main" }}
//                 onClick={() => navigate("/forgot-password")}
//               >
//                 Forgot Password?
//               </Typography>
//             ) : null}

//             {error && <Typography color="error">{error}</Typography>}

//             <Button
//               type="button"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//               onClick={handleAuth}
//             >
//               {formState === 0 ? "Login" : "Register"}
//             </Button>
//           </Box>

//           {formState === 1 && (
//              <Typography variant="body2" sx={{ mt: 2 }}>
//               Or continue with
//             </Typography>
//           )}
//           <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google Login Failed")} />
//         </Box>

//         <Snackbar
//           open={open}
//           autoHideDuration={4000}
//           message={message}
//           onClose={() => setOpen(false)}
//         />
//       </Container>
//     </ThemeProvider>
//   );
// }




import * as React from "react";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../context/AuthContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Navbar from "./navbar.jsx";

const theme = createTheme();

export default function Authentication() {
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [formState, setFormState] = React.useState(0); // 0 = Login, 1 = Register
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  // Email validation helper
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (formState === 0) {
        // Login validation
        if (!username.trim() || !password.trim()) {
          throw new Error("Username and password are required");
        }
        const result = await handleLogin(username, password);
        console.log("Login success:", result);
        setMessage("Login successful!");
        setError("");
      } else {
        // Register validation
        if (!name.trim() || !username.trim() || !password.trim() || !email.trim()) {
          throw new Error("All fields are required");
        }
        
        if (!isValidEmail(email)) {
          throw new Error("Please enter a valid email address");
        }
        
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }

        const result = await handleRegister(name, username, password, email);
        console.log("Register success:", result);
        setMessage(result || "User registered successfully!");
        setError("");
        setFormState(0);
        
        // Clear form
        setUsername("");
        setPassword("");
        setEmail("");
        setName("");
      }
      setOpen(true);
    } catch (err) {
      console.error("Error caught in frontend:", err);
      const msg = err?.response?.data?.message || err.message || "Something went wrong";
      setError(msg);
      setMessage("");
      setOpen(true);
    } finally {
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

      // Backend URL with fallback
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      
      const response = await axios.post(
        `${backendUrl}/api/v1/users/google-login`, 
        { token },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      // Validate response structure
      if (!response.data || !response.data.token) {
        throw new Error("Invalid response from server");
      }

      // Store token and user data
      localStorage.setItem("token", response.data.token);
      
      // Store user data if available
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      setMessage("Google Login successful!");
      setError("");
      setOpen(true);

      // Redirect after a brief delay to show success message
      setTimeout(() => {
        navigate("/home");
      }, 1500);

    } catch (err) {
      console.error("Google login failed:", err);
      
      let errorMessage = "Google login failed";
      
      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data?.error || err.response.data?.message || errorMessage;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "Network error. Please check your connection.";
      } else if (err.code === 'ECONNABORTED') {
        // Request timeout
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

  const handleFormStateChange = (newState) => {
    setFormState(newState);
    setError("");
    setMessage("");
  };

  return (
    
    <ThemeProvider theme={theme}>
      {/* <Navbar /> */}
      <Container component="main" maxWidth="xs" style={{ marginTop: '10px' } }>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {formState === 0 ? "Sign In" : "Sign Up"}
          </Typography>

          {/* Form State Toggle */}
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant={formState === 0 ? "contained" : "outlined"}
              color="primary"
              onClick={() => handleFormStateChange(0)}
              disabled={loading}
            >
              Sign In
            </Button>
            <Button
              variant={formState === 1 ? "contained" : "outlined"}
              color="primary"
              onClick={() => handleFormStateChange(1)}
              disabled={loading}
            >
              Sign Up
            </Button>
          </Box>

          {/* Traditional Login/Register Form */}
          <Box component="form" noValidate sx={{ mt: 3, width: '100%' }}>
            {formState === 1 && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            {formState === 0 && (
              <Typography
                variant="body2"
                sx={{ mt: 1, cursor: "pointer", color: "primary.main" }}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </Typography>
            )}

            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleAuth}
              disabled={loading}
            >
              {loading ? "Processing..." : (formState === 0 ? "Login" : "Register")}
            </Button>
          </Box>

          {/* Divider */}
          <Box sx={{ width: '100%', marginBottom: 2 }}>
            <Divider>
              <Typography variant="body2" color="text.secondary">
                Or continue with
              </Typography>
            </Divider>
          </Box>

          {/* Google Login Button */}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', paddingBottom: 2, marginBottom: 2 }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              disabled={loading}
              width="100%"
            />
          </Box>
        </Box>

        {/* Snackbar for messages */}
        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setOpen(false)} 
            severity={error ? "error" : "success"}
            sx={{ width: '100%' }}
          >
            {error || message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

