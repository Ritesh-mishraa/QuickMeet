import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import {
  Badge,
  IconButton,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Avatar,
  Divider,
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import servers from "../environment";

const server_url = servers;

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeetComponent() {
  const { url } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef();
  const socketIdRef = useRef();
  const localVideoref = useRef();
  const videoRef = useRef([]);

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(true);
  const [screen, setScreen] = useState(false);
  const [screenAvailable, setScreenAvailable] = useState(false);
  const [showModal, setModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [newMessages, setNewMessages] = useState(0);
  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState("");
  const [videos, setVideos] = useState([]);
  const connections = useRef({});

  useEffect(() => {
    getPermissions();
  }, []);

  useEffect(() => {
    if (localVideoref.current && window.localStream) {
      localVideoref.current.srcObject = window.localStream;
    }
  }, [showModal, askForUsername]);

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setVideoAvailable(!!videoPermission);
      setVideo(!!videoPermission);

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setAudioAvailable(!!audioPermission);
      setAudio(!!audioPermission);

      setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

      if (videoPermission || audioPermission) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: !!videoPermission,
          audio: !!audioPermission,
        });
        window.localStream = userMediaStream;
        if (localVideoref.current) {
          localVideoref.current.srcObject = userMediaStream;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoref.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.error(e);
    }
    window.localStream = stream;
    if (localVideoref.current) localVideoref.current.srcObject = stream;

    for (let id in connections.current) {
      if (id === socketIdRef.current) continue;
      connections.current[id].addStream(window.localStream);
      connections.current[id].createOffer().then((description) => {
        connections.current[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections.current[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }
  };

  const getDislayMedia = () => {
    if (screen && navigator.mediaDevices.getDisplayMedia) {
      navigator.mediaDevices
        .getDisplayMedia({ video: true, audio: true })
        .then(getDislayMediaSuccess)
        .catch((e) => console.log(e));
    }
  };

  const getDislayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.error(e);
    }

    window.localStream = stream;
    if (localVideoref.current) localVideoref.current.srcObject = stream;

    for (let id in connections.current) {
      if (id === socketIdRef.current) continue;
      connections.current[id].addStream(window.localStream);
      connections.current[id].createOffer().then((description) => {
        connections.current[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections.current[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
      (track.onended = () => {
        setScreen(false);
        try {
          let tracks = localVideoref.current.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
        } catch (e) {
          console.error(e);
        }
        getUserMedia();
      })
    );
  };

  const connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on("signal", gotMessageFromServer);
    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", url);
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);
      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });

      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections.current[socketListId] = new RTCPeerConnection(
            peerConfigConnections
          );

          connections.current[socketListId].onicecandidate = (event) => {
            if (event.candidate)
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
          };

          connections.current[socketListId].onaddstream = (event) => {
            let videoExists = videoRef.current.find(
              (v) => v.socketId === socketListId
            );
            if (videoExists) {
              setVideos((videos) =>
                videos.map((v) =>
                  v.socketId === socketListId
                    ? { ...v, stream: event.stream }
                    : v
                )
              );
            } else {
              const newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoplay: true,
                playsinline: true,
              };
              setVideos((videos) => {
                const updated = [...videos, newVideo];
                videoRef.current = updated;
                return updated;
              });
            }
          };

          if (window.localStream) {
            connections.current[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections.current) {
            if (id2 === socketIdRef.current) continue;
            connections.current[id2].createOffer().then((description) => {
              connections.current[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({
                      sdp: connections.current[id2].localDescription,
                    })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };

  const gotMessageFromServer = (fromId, message) => {
    const signal = JSON.parse(message);
    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections.current[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections.current[fromId].createAnswer().then((description) => {
                connections.current[fromId]
                  .setLocalDescription(description)
                  .then(() => {
                    socketRef.current.emit(
                      "signal",
                      fromId,
                      JSON.stringify({
                        sdp: connections.current[fromId].localDescription,
                      })
                    );
                  })
                  .catch((e) => console.log(e));
              });
            }
          })
          .catch((e) => console.log(e));
      }
      if (signal.ice) {
        connections.current[fromId].addIceCandidate(
          new RTCIceCandidate(signal.ice)
        );
      }
    }
  };

  const handleVideo = () => {
    setVideo((prev) => !prev);
    if (window.localStream) {
      const videoTrack = window.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !video;
      }
    }
  };

  const handleAudio = () => {
    setAudio((prev) => !prev);
    if (window.localStream) {
      const audioTrack = window.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audio;
      }
    }
  };

  useEffect(() => {
    if (screen !== undefined) getDislayMedia();
  }, [screen]);

  const handleScreen = () => setScreen(!screen);

  const handleEndCall = () => {
    try {
      let tracks = localVideoref.current?.srcObject?.getTracks();
      tracks?.forEach((track) => track.stop());
    } catch (e) {
      console.error(e);
    }
    setAskForUsername(true);
    setUsername("");
    setVideos([]);
    setModal(false);
    navigate("/home");
  };

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prev) => [...prev, { sender, data }]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prev) => prev + 1);
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };

  const connect = () => {
    setAskForUsername(false);
    getMedia();
  };

  const getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  // ==================== UI RENDERING =====================

  if (askForUsername) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0c1e",
          p: 2,
        }}
      >
        <Paper
          elevation={24}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 500,
            borderRadius: 4,
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: "white", mb: 3 }}
          >
            Join the Lobby
          </Typography>

          <Box
            sx={{
              width: "100%",
              height: 280,
              borderRadius: 3,
              overflow: "hidden",
              background: "#000",
              mb: 3,
              position: "relative",
              border: "2px solid rgba(255,255,255,0.1)",
            }}
          >
            <video
              ref={localVideoref}
              autoPlay
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {!videoAvailable && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Avatar sx={{ width: 80, height: 80, bgcolor: "#333" }}>
                  <VideocamOffIcon sx={{ fontSize: 40, color: "#666" }} />
                </Avatar>
              </Box>
            )}
          </Box>

          <Typography variant="h5" sx={{ color: "white", textAlign: "center" }}>
            Code: {url}
          </Typography>


          <TextField
            fullWidth
            placeholder="Enter your name"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                color: "white",
                borderRadius: 3,
                backgroundColor: "rgba(255,255,255,0.05)",
                "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                "&.Mui-focused fieldset": { borderColor: "#ff8f3c" },
              },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={connect}
            disabled={!username.trim()}
            sx={{
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: "bold",
              borderRadius: 3,
              background: "linear-gradient(180deg, #ff8f3c, #ffbf6b)",
              color: "#000",
              textTransform: "none",
              boxShadow: "0 8px 20px rgba(255,140,60,0.25)",
              "&:hover": {
                background: "linear-gradient(180deg, #ff9f55, #ffcd85)",
              },
            }}
          >
            Connect
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        bgcolor: "#0b0c1e",
        overflow: "hidden",
        position: "relative",
        display: "flex",
      }}
    >
      {/* MAIN VIDEO AREA */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
          position: "relative",
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns:
              videos.length === 0
                ? "1fr"
                : videos.length <= 1
                  ? "1fr"
                  : videos.length <= 4
                    ? "1fr 1fr"
                    : "repeat(3, 1fr)",
            gap: 2,
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          {videos.length === 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              <Typography variant="h5">
                Waiting for others to join...
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Share the meeting code to invite people.
              </Typography>
            </Box>
          )}

          {videos.map((video) => (
            <Box
              key={video.socketId}
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                maxHeight: videos.length > 2 ? "45vh" : "80vh",
                borderRadius: 4,
                overflow: "hidden",
                bgcolor: "#1c1d2e",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <video
                data-socket={video.socketId}
                ref={(ref) =>
                  ref && video.stream && (ref.srcObject = video.stream)
                }
                autoPlay
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          ))}
        </Box>

        {/* CONTROL BAR */}
        <Box
          sx={{
            height: 80,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            mt: 2,
          }}
        >
          <Paper
            elevation={10}
            sx={{
              display: "flex",
              gap: 2,
              px: 4,
              py: 1.5,
              borderRadius: "50px",
              bgcolor: "rgba(28, 29, 46, 0.9)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <IconButton
              onClick={handleVideo}
              sx={{
                bgcolor: video ? "rgba(255,255,255,0.1)" : "#ff4d4d",
                color: "white",
                "&:hover": {
                  bgcolor: video ? "rgba(255,255,255,0.2)" : "#ff3333",
                },
              }}
            >
              {video ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>

            <IconButton
              onClick={handleAudio}
              sx={{
                bgcolor: audio ? "rgba(255,255,255,0.1)" : "#ff4d4d",
                color: "white",
                "&:hover": {
                  bgcolor: audio ? "rgba(255,255,255,0.2)" : "#ff3333",
                },
              }}
            >
              {audio ? <MicIcon /> : <MicOffIcon />}
            </IconButton>

            {screenAvailable && (
              <IconButton
                onClick={handleScreen}
                sx={{
                  bgcolor: screen ? "#ff8f3c" : "rgba(255,255,255,0.1)",
                  color: "white",
                  "&:hover": {
                    bgcolor: screen ? "#ff9f55" : "rgba(255,255,255,0.2)",
                  },
                }}
              >
                {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
              </IconButton>
            )}

            <IconButton
              onClick={() => {
                setNewMessages(0);
                setModal(!showModal);
              }}
              sx={{
                bgcolor: showModal ? "#ff8f3c" : "rgba(255,255,255,0.1)",
                color: "white",
                "&:hover": {
                  bgcolor: showModal ? "#ff9f55" : "rgba(255,255,255,0.2)",
                },
              }}
            >
              <Badge badgeContent={newMessages} color="error">
                <ChatIcon />
              </Badge>
            </IconButton>

            <IconButton
              onClick={handleEndCall}
              sx={{
                bgcolor: "#ff4d4d",
                color: "white",
                width: 50,
                height: 50,
                "&:hover": { bgcolor: "#ff3333" },
              }}
            >
              <CallEndIcon />
            </IconButton>
          </Paper>
        </Box>
      </Box>

      {/* RIGHT SIDEBAR (Chat + Local Video) */}
      <Box
        sx={{
          width: showModal ? 380 : 0,
          transition: "width 0.3s ease",
          bgcolor: "#121326",
          borderLeft: showModal ? "1px solid rgba(255,255,255,0.1)" : "none",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 2, width: "100%", height: 240, flexShrink: 0 }}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: 3,
              overflow: "hidden",
              border: "2px solid rgba(255,140,60,0.3)",
              bgcolor: "black",
              position: "relative",
            }}
          >
            <video
              ref={localVideoref}
              autoPlay
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <Typography
              sx={{
                position: "absolute",
                bottom: 8,
                left: 8,
                color: "white",
                bgcolor: "rgba(0,0,0,0.6)",
                px: 1,
                borderRadius: 1,
                fontSize: "0.8rem",
              }}
            >
              You
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />

        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
            Messages
          </Typography>
          <IconButton onClick={() => setModal(false)} sx={{ color: "gray" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {messages.length === 0 && (
            <Typography sx={{ color: "gray", textAlign: "center", mt: 4 }}>
              No messages yet.
            </Typography>
          )}
          {messages.map((item, index) => {
            const isMe = item.sender === username;
            return (
              <Box
                key={index}
                sx={{
                  alignSelf: isMe ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                }}
              >
                <Typography
                  sx={{
                    color: "gray",
                    fontSize: "0.75rem",
                    mb: 0.5,
                    textAlign: isMe ? "right" : "left",
                  }}
                >
                  {item.sender}
                </Typography>
                <Box
                  sx={{
                    bgcolor: isMe ? "#ff8f3c" : "rgba(255,255,255,0.1)",
                    color: isMe ? "black" : "white",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2">{item.data}</Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ p: 2, mt: "auto" }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.05)",
                  borderRadius: 2,
                },
              }}
            />
            <IconButton
              onClick={sendMessage}
              disabled={!message.trim()}
              sx={{
                bgcolor: "#ff8f3c",
                color: "black",
                borderRadius: 2,
                "&:hover": { bgcolor: "#ff9f55" },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Floating Local Video */}
      {!showModal && (
        <Paper
          sx={{
            position: "absolute",
            bottom: 100,
            right: 20,
            width: 200,
            height: 150,
            bgcolor: "black",
            borderRadius: 3,
            border: "2px solid rgba(255,140,60,0.5)",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            zIndex: 10,
          }}
        >
          <video
            ref={localVideoref}
            autoPlay
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <IconButton
            size="small"
            onClick={() => setModal(true)}
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "white",
            }}
          >
            <ChatIcon fontSize="small" />
          </IconButton>
        </Paper>
      )}
    </Box>
  );
}
