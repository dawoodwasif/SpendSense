import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Link,
  Grid,
  InputAdornment,
  IconButton,
  useTheme,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import AppleIcon from "@mui/icons-material/Apple";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info in localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userEmail", email);

        // Store user name in localStorage
        // If data contains a name property, use it, otherwise extract from email
        const userName = data.name || data.userName || email.split('@')[0];
        localStorage.setItem("userName", userName);

        console.log("Login successful!");
        navigate("/dashboard"); // Redirect to dashboard page
      } else {
        console.error(data.msg || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 4, md: 8 },
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        {/* Left side - Login form */}
        <Grid item xs={12} md={6} lg={5}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            elevation={3}
            sx={{ borderRadius: 2 }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  mb: 3,
                  textAlign: "center",
                }}
              >
                Welcome Back
              </Typography>

              <form onSubmit={handleLogin}>
                <Box mb={3}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && email && password) {
                        e.preventDefault();
                        handleLogin(e);
                      }
                    }}
                  />
                </Box>
                <Box mb={3}>
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && email && password) {
                        e.preventDefault();
                        handleLogin(e);
                      }
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: 3,
                  }}
                >
                  <Link
                    component="button"
                    onClick={handleForgotPassword}
                    variant="body2"
                    color="primary"
                    sx={{ textDecoration: "none" }}
                  >
                    Forgot Password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.5,
                    mb: 3,
                    borderRadius: 2,
                  }}
                >
                  Login
                </Button>
              </form>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR CONTINUE WITH
                </Typography>
              </Divider>

              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <IconButton
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    p: 1,
                  }}
                >
                  <GoogleIcon />
                </IconButton>
                <IconButton
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    p: 1,
                  }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    p: 1,
                  }}
                >
                  <AppleIcon />
                </IconButton>
              </Box>

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{" "}
                  <Link
                    component="button"
                    onClick={() => navigate("/signup")}
                    sx={{ fontWeight: 600, textDecoration: "none" }}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Right side - Image and text */}
        <Grid
          item
          xs={12}
          md={6}
          lg={5}
          sx={{
            display: { xs: "none", md: "block" },
          }}
        >
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                p: 4,
              }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                alt="SpendSense"
                sx={{
                  width: "100%",
                  maxWidth: 400,
                  height: "auto",
                  borderRadius: 4,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  mb: 4,
                }}
              />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Take Control of Your Financial Future
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Access personalized financial advice and investment strategies
                tailored to your goals.
              </Typography>
            </Box>
          </MotionBox>
        </Grid>
      </Grid>
    </Container>
  );
}
