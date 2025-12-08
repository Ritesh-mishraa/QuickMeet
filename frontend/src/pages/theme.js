// theme.js
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff8c3a",
    },
    background: {
      default: "#000000",
      paper: "rgba(255,255,255,0.08)",
    },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
});
