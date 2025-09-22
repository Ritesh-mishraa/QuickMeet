import { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

      const res = await axios.post(`${backendUrl}/api/v1/users/forgot-password`, { email });
      setMsg(res.data.msg);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h5">Forgot Password</Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: "20px" }}>
          <TextField
            fullWidth
            label="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Send Reset Link
          </Button>
        </form>
        {msg && <Typography sx={{ mt: 2 }}>{msg}</Typography>}
      </Box>
    </Container>
  );
}
