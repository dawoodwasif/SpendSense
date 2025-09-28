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
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import AppleIcon from "@mui/icons-material/Apple";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();

  const steps = ["Personal Information", "Account Security"];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info in localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userEmail", email);

        console.log("Registration successful! Redirecting to form...");
        navigate("/form"); // Redirect to form page instead of login
      } else {
        alert(data.msg || "Registration failed");
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
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
        {/* Left side - Image and text */}
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
            initial={{ opacity: 0, x: -20 }}
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
                src="https://images.unsplash.com/photo-1593672715438-d88a70629abe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                alt="SpendSense"
                sx={{
                  width: "100%",
                  maxWidth: 400,
                  height: "50vh",
                  borderRadius: 4,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  mb: 4,
                }}
              />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Start Your Financial Journey Today
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Join thousands of users who are already benefiting from
                personalized financial advice.
              </Typography>
            </Box>
          </MotionBox>
        </Grid>

        {/* Right side - Signup form */}
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
                Create Account
              </Typography>

              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <form onSubmit={handleSignUp}>
                {activeStep === 0 ? (
                  <Box>
                    <Box mb={3}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
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
                      />
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      onClick={handleNext}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                      }}
                    >
                      Continue
                    </Button>
                  </Box>
                ) : (
                  <Box>
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
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Box mb={3}>
                      <TextField
                        fullWidth
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        variant="outlined"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                                aria-label="toggle confirm password visibility"
                                onClick={handleClickShowConfirmPassword}
                                edge="end"
                              >
                                {showConfirmPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          size="large"
                          onClick={handleBack}
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                          }}
                        >
                          Back
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          fullWidth
                          size="large"
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                          }}
                        >
                          Sign Up
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </form>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR SIGN UP WITH
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
                  Already have an account?{" "}
                  <Link
                    component="button"
                    onClick={() => navigate("/login")}
                    sx={{ fontWeight: 600, textDecoration: "none" }}
                  >
                    Login
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </Container>
  );
}
