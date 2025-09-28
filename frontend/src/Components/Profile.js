import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import SavingsIcon from "@mui/icons-material/Savings";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import WorkIcon from "@mui/icons-material/Work";
import PeopleIcon from "@mui/icons-material/People";

const MotionPaper = motion(Paper);
const MotionCard = motion(Card);
const MotionContainer = motion(Container);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    "aria-controls": `profile-tabpanel-${index}`,
  };
}

function Profile() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUserName = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");
    
    setUserName(storedUserName || "");
    
    if (!token) {
      alert("Please log in to access this page");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user profile
        const userResponse = await fetch("http://localhost:5000/user-profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const userData = await userResponse.json();

        // Fetch form data
        const formResponse = await fetch(
          "http://localhost:5000/user-form-data",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (formResponse.ok) {
          const formData = await formResponse.json();
          setFormData(formData.formData);
        }

        setUserData({
          ...userData.user,
          // Add email from localStorage if not available from API
          email: userData.user?.email || email
        });
        
        // If we got a name from the API, update the userName in localStorage
        if (userData.user && userData.user.name) {
          localStorage.setItem("userName", userData.user.name);
          setUserName(userData.user.name);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleEditForm = () => {
    navigate("/form");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Get the first letter of user's name for the avatar
  const getInitial = () => {
    if (userName && userName.length > 0) {
      return userName.charAt(0).toUpperCase();
    }
    if (userData?.email && userData.email.length > 0) {
      return userData.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" color="error" gutterBottom>
            Error: {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            User not found
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <MotionContainer 
      maxWidth="lg" 
      sx={{ py: 6 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Profile Header */}
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        elevation={3}
        sx={{ 
          p: { xs: 3, md: 5 }, 
          borderRadius: 2, 
          mb: 4, 
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
          color: "white"
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-start" } }}>
            <Avatar
              sx={{
                width: { xs: 100, md: 120 },
                height: { xs: 100, md: 120 },
                bgcolor: theme.palette.background.paper,
                color: theme.palette.primary.main,
                fontSize: { xs: 40, md: 50 },
                fontWeight: "bold",
                border: `4px solid ${theme.palette.background.paper}`
              }}
            >
              {getInitial()}
            </Avatar>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Typography variant="h3" sx={{ mb: 1, fontWeight: "bold" }}>
                {userData?.name || userName || "User"}
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, opacity: 0.8 }}>
                {userData?.email || "No email available"}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: { xs: "center", md: "flex-start" } }}>
                <Chip 
                  label="Financial Advisory Client" 
                  sx={{ 
                    bgcolor: "rgba(255, 255, 255, 0.2)", 
                    color: "white",
                    '& .MuiChip-label': { fontWeight: 500 }
                  }} 
                />
                {formData && (
                  <Chip 
                    label="Assessment Completed" 
                    color="success"
                    sx={{ 
                      bgcolor: "rgba(0, 200, 83, 0.8)", 
                      color: "white",
                      '& .MuiChip-label': { fontWeight: 500 }
                    }} 
                  />
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-end" } }}>
            <Button 
              variant="outlined" 
              onClick={handleLogout}
              sx={{ 
                borderColor: "rgba(255,255,255,0.7)",
                color: "white",
                '&:hover': {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)"
                }
              }}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </MotionPaper>

      {/* Profile Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="profile tabs"
          variant={isMobile ? "fullWidth" : "standard"}
          centered={!isMobile}
        >
          <Tab label="Personal Info" {...a11yProps(0)} />
          {formData && <Tab label="Financial Summary" {...a11yProps(1)} />}
        </Tabs>
      </Box>

      {/* Personal Info Tab */}
      <TabPanel value={tabValue} index={0}>
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          elevation={2}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary" sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <AccountCircleIcon sx={{ mr: 1 }} /> Personal Details
            </Typography>
            
            <Grid container spacing={2}>
              {/* Left Column */}
              <Grid item xs={12} md={6}>
                <List>
                  {(userData?.name || userName) && (
                    <ListItem>
                      <ListItemIcon>
                        <BadgeIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Full Name" 
                        secondary={userData?.name || userName} 
                      />
                    </ListItem>
                  )}
                  
                  {userData?.email && (
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Email" 
                        secondary={userData?.email} 
                      />
                    </ListItem>
                  )}
                  
                  {(formData?.phone || userData?.phone) && (
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Phone" 
                        secondary={formData?.phone || userData?.phone} 
                      />
                    </ListItem>
                  )}
                  
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Age" 
                      secondary={formData?.age || userData?.age || "35"} 
                    />
                  </ListItem>
                </List>
              </Grid>
              
              {/* Right Column */}
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <FamilyRestroomIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Marital Status" 
                      secondary={formData?.maritalStatus || userData?.maritalStatus || "Married"} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <WorkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Employment Status" 
                      secondary={formData?.employmentStatus || userData?.employmentStatus || "Employed"} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <PeopleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Number of Dependents" 
                      secondary={formData?.dependents || userData?.dependents || "2"} 
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </MotionCard>
      </TabPanel>

      {/* Financial Summary Tab */}
      {formData && (
        <TabPanel value={tabValue} index={1}>
          {!formData ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" gutterBottom>
                You haven't submitted your financial assessment form yet.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditForm}
                sx={{ mt: 2 }}
              >
                Complete Your Assessment
              </Button>
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 4, textAlign: "center" }}>
                <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: "medium" }}>
                  Your Financial Summary
                </Typography>
                <Typography variant="body1" paragraph>
                  Based on the information you provided, here's a summary of your financial situation.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditForm}
                  sx={{ mt: 1 }}
                >
                  Update Financial Information
                </Button>
              </Box>

              <Grid container spacing={4}>
                {/* Assets Section */}
                <Grid item xs={12} md={6}>
                  <MotionCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    elevation={2}
                    sx={{ height: "100%" }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ color: theme.palette.success.main, display: "flex", alignItems: "center" }}>
                        <SavingsIcon sx={{ mr: 1 }} /> Assets
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <HomeIcon sx={{ color: theme.palette.success.main }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Primary Residence" 
                            secondary={`$${formData.primaryResidence || "0"}`}
                            primaryTypographyProps={{ variant: "body2" }}
                            secondaryTypographyProps={{ variant: "body1", fontWeight: "medium" }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <HomeIcon sx={{ color: theme.palette.success.main }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Other Real Estate" 
                            secondary={`$${formData.otherRealEstate || "0"}`}
                            primaryTypographyProps={{ variant: "body2" }}
                            secondaryTypographyProps={{ variant: "body1", fontWeight: "medium" }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <SavingsIcon sx={{ color: theme.palette.success.main }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Retirement Accounts" 
                            secondary={`$${formData.retirementAccounts || "0"}`}
                            primaryTypographyProps={{ variant: "body2" }}
                            secondaryTypographyProps={{ variant: "body1", fontWeight: "medium" }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <AccountBalanceIcon sx={{ color: theme.palette.success.main }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Investment Accounts" 
                            secondary={`$${formData.investmentAccounts || "0"}`}
                            primaryTypographyProps={{ variant: "body2" }}
                            secondaryTypographyProps={{ variant: "body1", fontWeight: "medium" }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <AccountBalanceIcon sx={{ color: theme.palette.success.main }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Cash Accounts" 
                            secondary={`$${formData.cashAccounts || "0"}`}
                            primaryTypographyProps={{ variant: "body2" }}
                            secondaryTypographyProps={{ variant: "body1", fontWeight: "medium" }}
                          />
                        </ListItem>
                        <Divider sx={{ my: 1 }} />
                        <ListItem sx={{ bgcolor: `${theme.palette.success.light}20` }}>
                          <ListItemText 
                            primary="Total Assets" 
                            secondary={`$${calculateTotalAssets(formData)}`}
                            primaryTypographyProps={{ variant: "body1", fontWeight: "bold" }}
                            secondaryTypographyProps={{ 
                              variant: "h6", 
                              fontWeight: "bold", 
                              color: theme.palette.success.main 
                            }}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </MotionCard>
                </Grid>

                {/* Liabilities Section */}
                <Grid item xs={12} md={6}>
                  <MotionCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    elevation={2}
                    sx={{ height: "100%" }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ color: theme.palette.error.main, display: "flex", alignItems: "center" }}>
                        <CreditCardIcon sx={{ mr: 1 }} /> Liabilities
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <HomeIcon sx={{ color: theme.palette.error.main }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Mortgage" 
                            secondary={`$${formData.mortgage || "0"}`}
                            primaryTypographyProps={{ variant: "body2" }}
                            secondaryTypographyProps={{ variant: "body1", fontWeight: "medium" }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <DirectionsCarIcon sx={{ color: theme.palette.error.main }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Car Loans" 
                            secondary={`$${formData.carLoans || "0"}`}
                            primaryTypographyProps={{ variant: "body2" }}
                            secondaryTypographyProps={{ variant: "body1", fontWeight: "medium" }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CreditCardIcon sx={{ color: theme.palette.error.main }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Credit Card Debt" 
                            secondary={`$${formData.creditCardDebt || "0"}`}
                            primaryTypographyProps={{ variant: "body2" }}
                            secondaryTypographyProps={{ variant: "body1", fontWeight: "medium" }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <SchoolIcon sx={{ color: theme.palette.error.main }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Student Loans" 
                            secondary={`$${formData.studentLoans || "0"}`}
                            primaryTypographyProps={{ variant: "body2" }}
                            secondaryTypographyProps={{ variant: "body1", fontWeight: "medium" }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <AccountBalanceIcon sx={{ color: theme.palette.error.main }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Other Debts" 
                            secondary={`$${formData.otherDebts || "0"}`}
                            primaryTypographyProps={{ variant: "body2" }}
                            secondaryTypographyProps={{ variant: "body1", fontWeight: "medium" }}
                          />
                        </ListItem>
                        <Divider sx={{ my: 1 }} />
                        <ListItem sx={{ bgcolor: `${theme.palette.error.light}20` }}>
                          <ListItemText 
                            primary="Total Liabilities" 
                            secondary={`$${calculateTotalLiabilities(formData)}`}
                            primaryTypographyProps={{ variant: "body1", fontWeight: "bold" }}
                            secondaryTypographyProps={{ 
                              variant: "h6", 
                              fontWeight: "bold", 
                              color: theme.palette.error.main 
                            }}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </MotionCard>
                </Grid>

                {/* Net Worth Section */}
                <Grid item xs={12}>
                  <MotionCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    elevation={3}
                    sx={{ 
                      p: 2, 
                      bgcolor: theme.palette.primary.main, 
                      color: "white" 
                    }}
                  >
                    <CardContent>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} md={8}>
                          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            Your Net Worth
                          </Typography>
                          <Typography variant="body1" sx={{ opacity: 0.8 }}>
                            Net Worth = Total Assets - Total Liabilities
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ textAlign: "right" }}>
                          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                            ${calculateNetWorth(formData)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </MotionCard>
                </Grid>
              </Grid>
            </>
          )}
        </TabPanel>
      )}
    </MotionContainer>
  );
}

// Helper functions to calculate financial totals
function calculateTotalAssets(formData) {
  if (!formData) return "0";
  
  const assetFields = [
    'primaryResidence',
    'otherRealEstate',
    'retirementAccounts',
    'investmentAccounts',
    'cashAccounts'
  ];
  
  const total = assetFields.reduce((sum, field) => {
    const value = parseFloat(formData[field]) || 0;
    return sum + value;
  }, 0);
  
  return total.toLocaleString();
}

function calculateTotalLiabilities(formData) {
  if (!formData) return "0";
  
  const liabilityFields = [
    'mortgage',
    'carLoans',
    'creditCardDebt',
    'studentLoans',
    'otherDebts'
  ];
  
  const total = liabilityFields.reduce((sum, field) => {
    const value = parseFloat(formData[field]) || 0;
    return sum + value;
  }, 0);
  
  return total.toLocaleString();
}

function calculateNetWorth(formData) {
  if (!formData) return "0";
  
  const totalAssets = calculateTotalAssets(formData).replace(/,/g, '');
  const totalLiabilities = calculateTotalLiabilities(formData).replace(/,/g, '');
  
  const netWorth = parseFloat(totalAssets) - parseFloat(totalLiabilities);
  
  return netWorth.toLocaleString();
}

export default Profile; 