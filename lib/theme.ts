"use client";
import { createTheme } from "@mui/material/styles";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#1A2027",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      color: "#1A2027",
    },
    h4: {
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
      color: "#3E5060",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#2962FF", // Bright Blue from screenshot
      light: "#768FFF",
      dark: "#0039CB",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#F50057",
    },
    background: {
      default: "#F0F4FA", // Light blue/grey background
      paper: "#ffffff",
    },
    text: {
      primary: "#1A2027",
      secondary: "#3E5060",
    },
    success: {
      main: "#10B981", // Green for checks
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "10px 24px",
          fontSize: "1rem",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(45deg, #2962FF 30%, #448AFF 90%)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: "16px",
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          "&.Mui-active": {
            color: "#2962FF",
          },
          "&.Mui-completed": {
            color: "#2962FF",
          },
        },
      },
    },
  },
});

export default theme;
