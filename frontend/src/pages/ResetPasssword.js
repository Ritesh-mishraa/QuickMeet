import { useState } from "react";
import { useParams } from "react-router-dom";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

      const res = await axios.post(`${backendUrl}/api/v1/users/reset-password/${token}`, { password });
      setMsg(res.data.msg);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h5">Reset Password</Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: "20px" }}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Reset Password
          </Button>
        </form>
        {msg && <Typography sx={{ mt: 2 }}>{msg}</Typography>}
      </Box>
    </Container>
  );
}
