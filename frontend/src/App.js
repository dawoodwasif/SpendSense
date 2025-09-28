import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { createTheme, ThemeProvider, CssBaseline, Box } from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ScrollToTop from "./Components/ScrollToTop";
import SignUp from "./Components/SignUp";
import Home from "./Components/Home";
import LogIn from "./Components/LogIn";
import ForgotPass from "./Components/ForgotPass";
import ForgotUserID from "./Components/ForgotId";
import Form from "./Components/Form";
import Dashboard from "./Components/Dashboard";
import Profile from "./Components/Profile";

function App() {
  const [mode, setMode] = useState("light");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Set document title
  useEffect(() => {
    document.title = "SpendSense";

    // Check if user is authenticated
    const authToken = localStorage.getItem("authToken");
    setIsAuthenticated(!!authToken);
  }, []);

  // Listen for auth changes (login/logout)
  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem("authToken");
      setIsAuthenticated(!!authToken);
    };

    // Check auth on storage changes (for logout events)
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "light" ? "#1E88E5" : "#6366F1", // Light: Modern blue, Dark: Indigo
            light: mode === "light" ? "#64B5F6" : "#818CF8",
            dark: mode === "light" ? "#0D47A1" : "#4F46E5",
            contrastText: "#FFFFFF",
          },
          secondary: {
            main: mode === "light" ? "#FF8F00" : "#EC4899", // Light: Warm orange, Dark: Pink
            light: mode === "light" ? "#FFB74D" : "#F472B6",
            dark: mode === "light" ? "#EF6C00" : "#DB2777",
            contrastText: "#FFFFFF",
          },
          background: {
            default: mode === "light" ? "#F5F5F5" : "#0F172A", // Dark: Slate 900
            paper: mode === "light" ? "#FFFFFF" : "#1E293B", // Dark: Slate 800
          },
          text: {
            primary: mode === "light" ? "#212121" : "#F1F5F9", // Dark: Slate 100
            secondary: mode === "light" ? "#757575" : "#94A3B8", // Dark: Slate 400
          },
          error: {
            main: "#EF4444", // Red
          },
          warning: {
            main: "#F59E0B", // Amber
          },
          info: {
            main: mode === "light" ? "#03A9F4" : "#38BDF8", // Light: Light Blue, Dark: Sky
          },
          success: {
            main: "#10B981", // Emerald
          },
        },
        typography: {
          fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 600,
          },
          h2: {
            fontWeight: 600,
          },
          h3: {
            fontWeight: 500,
          },
          button: {
            fontWeight: 500,
            textTransform: "none",
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                boxShadow: "none",
                "&:hover": {
                  boxShadow: mode === "light"
                    ? "0px 2px 4px rgba(0, 0, 0, 0.1)"
                    : "0px 4px 8px rgba(0, 0, 0, 0.3)",
                  transform: "translateY(-2px)",
                  transition: "all 0.2s ease-in-out",
                },
              },
              containedPrimary: {
                background: mode === "light"
                  ? "linear-gradient(90deg, #1E88E5, #42A5F5)"
                  : "linear-gradient(90deg, #6366F1, #818CF8)",
                "&:hover": {
                  background: mode === "light"
                    ? "linear-gradient(90deg, #1976D2, #1E88E5)"
                    : "linear-gradient(90deg, #4F46E5, #6366F1)",
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: mode === "light"
                  ? "0px 4px 12px rgba(0, 0, 0, 0.05)"
                  : "0px 8px 16px rgba(0, 0, 0, 0.4)",
                borderRadius: 12,
                transition: "all 0.3s ease",
                border: mode === "dark" ? "1px solid rgba(255, 255, 255, 0.05)" : "none",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: mode === "light"
                    ? "0px 8px 24px rgba(0, 0, 0, 0.1)"
                    : "0px 12px 28px rgba(0, 0, 0, 0.5)",
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: mode === "light"
                  ? "0px 2px 4px rgba(0, 0, 0, 0.05)"
                  : "0px 2px 8px rgba(0, 0, 0, 0.3)",
                backgroundImage: mode === "dark"
                  ? "linear-gradient(to right, #0F172A, #1E293B)"
                  : "none",
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              switchBase: {
                color: mode === "dark" ? "#6366F1" : "#1E88E5",
              },
              track: {
                opacity: 0.2,
                backgroundColor: mode === "dark" ? "#6366F1" : "#1E88E5",
              },
            },
          },
        },
      }),
    [mode]
  );

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ScrollToTop />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Navbar toggleColorMode={toggleColorMode} mode={mode} />
          <Box sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />} />
              <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUp />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LogIn />} />
              <Route path="/form" element={<Form />} />
              <Route path="/forgot-password" element={<ForgotPass />} />
              <Route path="/forgot-user-id" element={<ForgotUserID />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
