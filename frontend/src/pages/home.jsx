import React, { useContext, useEffect, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "../styles/home.css";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import BackspaceIcon from "@mui/icons-material/Backspace";

import {
  Avatar,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import RestoreIcon from "@mui/icons-material/Restore";
import LogoutIcon from "@mui/icons-material/Logout";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

function HomeComponent() {
  const navigate = useNavigate();
  const { addToUserHistory } = useContext(AuthContext);

  // form / state
  const [meetingCode, setMeetingCode] = useState("");
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createdCode, setCreatedCode] = useState("");

  const [accentMode, setAccentMode] = useState(() => {
    const saved =
      typeof window !== "undefined" && localStorage.getItem("qm-accent-mode");
    return saved || "gold";
  });

  // snackbar
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", accentMode);
    try {
      localStorage.setItem("qm-accent-mode", accentMode);
    } catch {}
  }, [accentMode]);

  const showSnack = (message, severity = "info") =>
    setSnack({ open: true, message, severity });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  // join meeting
  const handleJoinVideoCall = async () => {
    const code = meetingCode?.trim();
    if (!code) {
      showSnack("Please enter a meeting code", "error");
      return;
    }
    setLoadingJoin(true);
    try {
      await new Promise((r) => setTimeout(r, 650)); // simulate
      await addToUserHistory(code);
      showSnack("Joining meeting...", "success");
      setTimeout(() => navigate(`/${code}`), 450);
    } catch (err) {
      console.error(err);
      showSnack("Failed to join meeting", "error");
    } finally {
      setLoadingJoin(false);
    }
  };

  // create meeting
  const generateCode = () =>
    Array.from({ length: 6 })
      .map(
        () =>
          "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]
      )
      .join("");

  const handleCreateMeeting = async () => {
    setCreateLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      const code = generateCode();
      await addToUserHistory(code);
      setCreatedCode(code);
      try {
        await navigator.clipboard.writeText(code);
        showSnack("Meeting created and copied to clipboard", "success");
      } catch {
        showSnack("Meeting created (copy to clipboard failed)", "warning");
      }
    } catch (err) {
      console.error(err);
      showSnack("Failed to create meeting", "error");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCreateAndJoin = async () => {
    setCreateLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 650));
      const code = generateCode();
      await addToUserHistory(code);
      try {
        await navigator.clipboard.writeText(code);
      } catch {}
      showSnack("Created meeting — joining now", "success");
      setCreateOpen(false);
      setTimeout(() => navigate(`/${code}`), 450);
    } catch (err) {
      console.error(err);
      showSnack("Create & join failed", "error");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="qm-root">
      {/* NAVBAR */}
      <header className="qm-navbar">
        <div className="qm-left-nav-left">
          <IconButton
            size="small"
            className="qm-back"
            onClick={() => navigate("/")}
            aria-label="Back"
          >
            <ArrowBackIosNewIcon
              fontSize="small"
              sx={{ color: "var(--text)" }}
            />
          </IconButton>

          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="qm-brand">
              <Avatar
                sx={{ bgcolor: "transparent", width: 34, height: 34, mr: 1 }}
                alt="QM"
              >
                {/* <img src="" alt="qm" style={{ width: 24, height: 24 }} /> */}
              </Avatar>
              <span className="qm-title">QuickMeet</span>
            </div>
          </motion.div>
        </div>

        <div className="qm-right">
          <Tooltip title="History">
            <IconButton
              onClick={() => navigate("/history")}
              className="qm-icon"
            >
              <RestoreIcon sx={{ color: "var(--muted)" }} />
            </IconButton>
          </Tooltip>

          {/* <Tooltip title="Toggle accent (gold/soft)">
            <IconButton
              onClick={() => setAccentMode((s) => (s === "gold" ? "gold" : "gold"))}
              className="qm-icon"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.2" /></svg>
            </IconButton>
          </Tooltip> */}

          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            className="qm-logout"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
          >
            Logout
          </Button>
        </div>
      </header>

      {/* MAIN */}
      <main className="qm-main">
        {/* LEFT */}
        <motion.section
          className="qm-left-main"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.55 }}
        >
          <h1 className="qm-head">
            Providing <span className="qm-accent">Quality</span> Video Call
          </h1>
          <p className="qm-lead">
            Fast, secure, and crystal clear — meet anyone, anywhere.
          </p>

          <div className="qm-controls">
            <TextField
              label="Meeting Code"
              variant="outlined"
              size="small"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoinVideoCall()}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.02)",
                  "& fieldset": { borderColor: "transparent" },
                },
                input: { color: "var(--text)", padding: "12px 14px" },
                label: { color: "var(--muted)" },
                minWidth: { xs: "100%", sm: 320 },
              }}
            />

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <button
                className="qm-joinBtn"
                onClick={handleJoinVideoCall}
                disabled={loadingJoin}
              >
                {loadingJoin ? (
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                ) : (
                  "Join"
                )}
              </button>
            </motion.div>
          </div>

          {/* <div className="qm-actionsRow">
            <button className="qm-ghost" onClick={() => setCreateOpen(true)}>Create Meeting</button>
            <button className="qm-clear" onClick={() => setMeetingCode("")}>Clear</button>
          </div> */}

          <div className="qm-actionsRow">
            <button className="qm-ghost" onClick={() => setCreateOpen(true)}>
              <VideoCallIcon sx={{ fontSize: 22, color: "var(--accent)" }} />
              Create Meeting
            </button>

            <button className="qm-clear" onClick={() => setMeetingCode("")}>
              <BackspaceIcon sx={{ fontSize: 18 }} />
              Clear
            </button>
          </div>

          <small className="qm-tip">
            Tip: paste meeting code or create a new one from the dashboard.
          </small>
        </motion.section>

        {/* RIGHT */}
        <motion.aside
          className="qm-right"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.55 }}
        >
          <div className="qm-panel">
            <motion.img
              src="/logo3.png"
              alt="illustration"
              className="qm-hero"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.45 }}
            />
          </div>
        </motion.aside>
      </main>

      {/* FOOTER */}
      <footer className="qm-footer">
        <span>© QuickMeet</span>
      </footer>

      <Dialog
        open={createOpen}
        onClose={() => !createLoading && setCreateOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Create Meeting</DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          {!createdCode ? (
            <>
              <TextField
                fullWidth
                placeholder="Optional title"
                label="Optional title"
                size="small"
                sx={{
                  mt: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    "& fieldset": { border: "none" },
                    "&:hover": { background: "rgba(255,255,255,0.05)" },
                    "&.Mui-focused": {
                      border: "1px solid var(--accent)",
                      boxShadow: "0 0 0 3px rgba(255, 140, 60, 0.1)",
                    },
                  },
                  "& .MuiInputBase-input": { color: "var(--text)" },
                  "& .MuiInputLabel-root": { color: "var(--muted)" },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "var(--accent)",
                  },
                }}
              />
              <div
                style={{
                  color: "var(--muted)",
                  marginTop: 16,
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                A short meeting code will be generated and copied to your
                clipboard.
              </div>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                alignItems: "center",
                padding: "16px 0",
              }}
            >
              <div style={{ color: "var(--muted)", fontSize: 13 }}>
                Meeting code
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    flexGrow: 1,
                    textAlign: "center",
                    padding: "12px 12px",
                    borderRadius: 12,
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    color: "var(--text)",
                    fontWeight: 800,
                    letterSpacing: 2,
                    fontSize: "1.2rem",
                  }}
                >
                  {createdCode}
                </div>
                <IconButton
                  size="small"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(createdCode);
                      showSnack("Copied", "success");
                    } catch {
                      showSnack("Copy failed", "error");
                    }
                  }}
                  sx={{
                    color: "var(--accent)",
                    background: "rgba(255,140,60,0.1)",
                    padding: "10px",
                    borderRadius: "12px",
                  }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </div>
              <div
                style={{
                  color: "var(--muted)",
                  fontSize: 13,
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                Share this code with participants to let them join.
              </div>
            </div>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2, display: "flex", gap: 1 }}>
          {!createdCode ? (
            <>
              <Button
                onClick={() => setCreateOpen(false)}
                disabled={createLoading}
                className="qm-dialog-btn-secondary"
              >
                Cancel
              </Button>

              <Button
                onClick={handleCreateMeeting}
                variant="contained"
                disabled={createLoading}
                className="qm-dialog-btn-primary"
              >
                {createLoading ? (
                  <CircularProgress size={20} sx={{ color: "#111" }} />
                ) : (
                  "Create"
                )}
              </Button>

              <Button
                onClick={handleCreateAndJoin}
                disabled={createLoading}
                className="qm-dialog-btn-secondary"
              >
                {createLoading ? (
                  <CircularProgress size={20} sx={{ color: "var(--muted)" }} />
                ) : (
                  "Create & Join"
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  setCreatedCode("");
                  setCreateOpen(false);
                }}
                className="qm-dialog-btn-secondary"
              >
                Done
              </Button>
              <Button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(createdCode);
                    showSnack("Copied to clipboard", "success");
                  } catch {
                    showSnack("Copy failed", "error");
                  }
                }}
                variant="contained"
                startIcon={<ContentCopyIcon />}
                className="qm-dialog-btn-primary"
              >
                Copy Code
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3600}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnack}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default withAuth(HomeComponent);
