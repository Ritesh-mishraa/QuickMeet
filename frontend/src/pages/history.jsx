import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CodeIcon from "@mui/icons-material/Code";
import { IconButton, Box, Grid, Divider, Paper } from "@mui/material";

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(history);
      } catch {
        alert("Could not fetch history");
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0b0c1e",
        color: "white",
        p: 3,
        pt: 5,
      }}
    >
      {/* HEADER SECTION */}
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton
          onClick={() => routeTo("/home")}
          sx={{
            color: "white",
            mr: 2,
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ fontFamily: "inherit" }}
        >
          Meeting History
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", mb: 4 }} />

      {/* CARDS GRID */}
      {meetings.length !== 0 ? (
        <Grid container spacing={3}>
          {meetings.map((e, i) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Card
                  variant="outlined"
                  sx={{
                    bgcolor: "#1c1d2e",
                    color: "white",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      border: "1px solid #ff742e",
                    },
                  }}
                >
                  <CardContent>
                    {/* Meeting Code Section */}
                    <Box display="flex" alignItems="center" mb={2}>
                      <CodeIcon sx={{ color: "#ff742e", mr: 1 }} />
                      <Typography
                        sx={{ fontSize: 14, fontWeight: "bold", opacity: 0.7 }}
                        gutterBottom
                        mb={0}
                      >
                        MEETING CODE
                      </Typography>
                    </Box>

                    <Typography variant="h5" fontWeight="bold" mb={3}>
                      {e.meetingCode}
                    </Typography>

                    <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", mb: 2 }} />

                    {/* Date Section */}
                    <Box display="flex" alignItems="center">
                      <CalendarTodayIcon
                        fontSize="small"
                        sx={{ color: "#888", mr: 1 }}
                      />
                      <Typography sx={{ color: "#aaa", fontSize: "0.9rem" }}>
                        {formatDate(e.date)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="50vh"
          opacity={0.5}
        >
          <Typography variant="h6" color="inherit">
            No meeting history found
          </Typography>
        </Box>
      )}
    </Box>
  );
}
