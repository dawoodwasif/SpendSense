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
  LinearProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper as MuiPaper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

// Global variable to store investment advice data
let data = null;

// Helper functions to calculate financial totals
function calculateTotalAssets(formData) {
  if (!formData) return "0";

  const assetFields = [
    "primaryResidence",
    "otherRealEstate",
    "retirementAccounts",
    "investmentAccounts",
    "cashAccounts",
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
    "mortgage",
    "carLoans",
    "creditCardDebt",
    "studentLoans",
    "otherDebts",
  ];

  const total = liabilityFields.reduce((sum, field) => {
    const value = parseFloat(formData[field]) || 0;
    return sum + value;
  }, 0);

  return total.toLocaleString();
}

function calculateNetWorth(formData) {
  if (!formData) return "0";

  const totalAssets = calculateTotalAssets(formData).replace(/,/g, "");
  const totalLiabilities = calculateTotalLiabilities(formData).replace(
    /,/g,
    ""
  );

  const netWorth = parseFloat(totalAssets) - parseFloat(totalLiabilities);

  return netWorth.toLocaleString();
}

function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");
  const [investmentAdvice, setInvestmentAdvice] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [chartCaption, setChartCaption] = useState("");
  const [spendingAnalysis, setSpendingAnalysis] = useState(null);
  const [analysisCaption, setAnalysisCaption] = useState("");
  const [openManualEntry, setOpenManualEntry] = useState(false);
  const [manualTransaction, setManualTransaction] = useState({
    date: new Date().toISOString().slice(0, 10),
    description: "",
    amount: "",
    type: "debit",
    category: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUserName = localStorage.getItem("userName");

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

        setUserData(userData.user);

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

  const fetchTransactions = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const r = await fetch("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await r.json();
      if (r.ok) setTransactions(j.transactions || []);
    } catch (e) {
      console.error(e);
    }
  };

  const importFromBank = async () => {
    setLoadingTx(true);
    const token = localStorage.getItem("authToken");
    try {
      await fetch("http://localhost:5000/api/transactions/import", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchTransactions();
    } finally {
      setLoadingTx(false);
    }
  };

  const uploadCsv = async (file) => {
    if (!file) return;
    setLoadingTx(true);
    const text = await file.text();
    // naive CSV parse
    const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
    const headers = headerLine.split(",").map((h) => h.trim().toLowerCase());
    const rows = lines.map((l) => {
      const cols = l.split(",");
      const obj = {};
      headers.forEach((h, i) => (obj[h] = cols[i]));
      return {
        date: obj.date || obj.transaction_date,
        description: obj.description || obj.desc || obj.merchant || "",
        amount: obj.amount,
        type: obj.type || "debit",
      };
    });
    const token = localStorage.getItem("authToken");
    try {
      await fetch("http://localhost:5000/api/transactions/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transactions: rows }),
      });
      await fetchTransactions();
    } finally {
      setLoadingTx(false);
    }
  };

  const analyzeSpending = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const r = await fetch("http://localhost:5000/api/transactions/spending-analysis", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await r.json();
      if (r.ok) {
        setSpendingAnalysis(j.analysis);
        setAnalysisCaption("AI-powered spending analysis and recommendations");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleInvestmentOptionClick = async (optionName) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:5000/api/investment-advice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...userData,
            investmentPreference: optionName,
            formData: formData,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get investment advice");
      }

      // Store the response in the global data variable
      data = await response.json();

      // Parse data.advice as JSON and extract fields
      const myObj = JSON.parse(data.advice);
      console.log("Parsed advice data:", myObj);

      // Extract data into separate variables in the specified sequence
      const personalizedAdvice = myObj["Personalized Advice"] || "";
      const understandingSituation = myObj["Understanding Your Situation"] || [];
      const prosAndCons = myObj["Pros & Cons for You"] || {};
      const isItRightForYou = myObj["Is it right for you?"] || [];
      const stepByStepStrategy = myObj["Step by step strategy"] || [];
      const nextSteps = myObj["Next steps"] || [];
      const importantConsiderations = myObj["Important Considerations"] || [];

      // Log each extracted field for debugging
      console.log("Personalized Advice:", personalizedAdvice);
      console.log("Understanding Your Situation:", understandingSituation);
      console.log("Pros & Cons for You:", prosAndCons);
      console.log("Is it right for you?:", isItRightForYou);
      console.log("Step by step strategy:", stepByStepStrategy);
      console.log("Next steps:", nextSteps);
      console.log("Important Considerations:", importantConsiderations);

      // Create adviceData object with extracted fields in the specified sequence
      const adviceData = {
        investmentType: optionName,
        "Personalized Advice": personalizedAdvice,
        "Understanding Your Situation": understandingSituation,
        "Pros & Cons for You": prosAndCons,
        "Is it right for you?": isItRightForYou,
        "Step by step strategy": stepByStepStrategy,
        "Next steps": nextSteps,
        "Important Considerations": importantConsiderations
      };

      setLoading(false);
      setInvestmentAdvice(adviceData);
    } catch (error) {
      console.error("Error getting investment advice:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const addManualTransaction = async () => {
    if (!manualTransaction.description || !manualTransaction.amount) {
      alert("Please fill in description and amount");
      return;
    }

    setLoadingTx(true);
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch("http://localhost:5000/api/transactions/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(manualTransaction),
      });

      if (response.ok) {
        await fetchTransactions();
        setOpenManualEntry(false);
        setManualTransaction({
          date: new Date().toISOString().slice(0, 10),
          description: "",
          amount: "",
          type: "debit",
          category: ""
        });
      } else {
        const error = await response.json();
        alert(error.error || "Failed to add transaction");
      }
    } catch (e) {
      console.error("Error adding manual transaction:", e);
      alert("Failed to add transaction");
    } finally {
      setLoadingTx(false);
    }
  };

  const handleManualTransactionChange = (field, value) => {
    setManualTransaction(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Content for left column
  const LeftColumn = () => (
    <MotionCard
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      elevation={2}
      sx={{ borderRadius: 2, height: "100%" }}
    >
      <CardContent
        sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h6" color="primary" gutterBottom>
          Financial Dashboard
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* Net Worth Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            fontWeight="medium"
            color="textSecondary"
            gutterBottom
          >
            Net Worth
          </Typography>
          <Typography variant="h5" color="primary">
            ${formData ? calculateNetWorth(formData) : "0.00"}
          </Typography>
        </Box>

        {/* Goals Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            fontWeight="medium"
            color="textSecondary"
            gutterBottom
          >
            Financial Goals
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="medium">
              Short Term
            </Typography>
            <LinearProgress
              variant="determinate"
              value={65}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: `${theme.palette.primary.main}15`,
                "& .MuiLinearProgress-bar": {
                  bgcolor: theme.palette.primary.main,
                },
              }}
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}
            >
              <Typography variant="caption" color="textSecondary">
                Goal: $10,000
              </Typography>
              <Typography variant="caption" color="textSecondary">
                65%
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" fontWeight="medium">
              Long Term
            </Typography>
            <LinearProgress
              variant="determinate"
              value={35}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: `${theme.palette.secondary.main}15`,
                "& .MuiLinearProgress-bar": {
                  bgcolor: theme.palette.secondary.main,
                },
              }}
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}
            >
              <Typography variant="caption" color="textSecondary">
                Goal: $100,000
              </Typography>
              <Typography variant="caption" color="textSecondary">
                35%
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Navigation Options */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ justifyContent: "center", textTransform: "none" }}
          >
            Download Investment Report
          </Button>

          <Button
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ justifyContent: "center", textTransform: "none" }}
            onClick={() => navigate("/profile")}
          >
            View Profile
          </Button>

          <Button
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ justifyContent: "center", textTransform: "none" }}
            onClick={handleEditForm}
          >
            Update Financial Info
          </Button>
        </Box>

        {/* Spacer to push logout to bottom */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Logout Button */}
        <Button
          startIcon={<Box component="span" className="material-icons"></Box>}
          variant="contained"
          color="primary"
          onClick={handleLogout}
          fullWidth
          sx={{ justifyContent: "center" }}
        >
          Logout
        </Button>
      </CardContent>
    </MotionCard>
  );

  // Content for top right section
  const TopRightSection = () => {
    return (
      <MotionCard
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        elevation={2}
        sx={{ borderRadius: 2, height: "100%" }}
      >
        <CardContent>
          {error && (
            <Box sx={{ mb: 2, p: 2, bgcolor: "error.light", borderRadius: 1 }}>
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </Box>
          )}

          {loading && (
            <Box sx={{ width: "100%", mb: 2 }}>
              <LinearProgress />
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              color="primary"
              sx={{ mb: 0 }}
            >
              Welcome, {userData?.name || userName || "User"}!
            </Typography>
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* Investment Options Circles */}
          <Box sx={{ mb: 2, overflowX: "auto" }}>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 2,
                fontWeight: "medium",
                color: theme.palette.mode === "light" ? "black" : "white",
              }}
            >
              Investment Options
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                pb: 1,
                minWidth: "max-content",
              }}
            >
              {[
                {
                  name: "Stocks",
                  icon: "https://cdn-icons-png.flaticon.com/512/4222/4222019.png",
                },
                {
                  name: "Bonds",
                  icon: "https://cdn-icons-png.flaticon.com/512/3310/3310624.png",
                },
                {
                  name: "Mutual Funds",
                  icon: "https://cdn-icons-png.flaticon.com/512/3347/3347835.png",
                },
                {
                  name: "ETFs",
                  icon: "https://cdn-icons-png.flaticon.com/512/1006/1006555.png",
                },
                {
                  name: "Real Estate",
                  icon: "https://cdn-icons-png.flaticon.com/512/1670/1670080.png",
                },
                {
                  name: "Commodities",
                  icon: "https://cdn-icons-png.flaticon.com/512/2933/2933116.png",
                },
                {
                  name: "Cryptocurrency",
                  icon: "https://cdn-icons-png.flaticon.com/512/5968/5968260.png",
                },
                {
                  name: "Index Funds",
                  icon: "https://cdn-icons-png.flaticon.com/512/4256/4256900.png",
                },
                {
                  name: "Fixed Deposits",
                  icon: "https://cdn-icons-png.flaticon.com/512/2830/2830284.png",
                },
                {
                  name: "Private Equity",
                  icon: "https://cdn-icons-png.flaticon.com/512/3135/3135679.png",
                },
              ].map((option) => (
                <Box
                  key={option.name}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                  onClick={() => handleInvestmentOptionClick(option.name)}
                >
                  <Avatar
                    src={option.icon}
                    sx={{
                      bgcolor: "white",
                      width: 70,
                      height: 70,
                      cursor: "pointer",
                      p: 1.5,
                      "&:hover": {
                        transform: "scale(1.05)",
                        transition: "all 0.2s",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    fontWeight="medium"
                    align="center"
                  >
                    {option.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* <Typography variant="body1" paragraph>
            Here's a summary of your account status and recent activities.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: `${theme.palette.primary.main}20`,
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" color="primary" gutterBottom>
                  {formData ? "Assessment Complete" : "Pending Assessment"}
                </Typography>
                <Typography variant="body2">
                  {formData
                    ? "Your financial profile is up to date."
                    : "Please complete your financial assessment."}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: `${theme.palette.secondary.main}20`,
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" color="secondary" gutterBottom>
                  Next Review
                </Typography>
                <Typography variant="body2">
                  Scheduled for {formData ? "June 2023" : "After assessment"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: `${theme.palette.success.main}20`,
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: theme.palette.success.main }}
                  gutterBottom
                >
                  Financial Health
                </Typography>
                <Typography variant="body2">
                  {formData ? "Good standing" : "Needs assessment"}
                </Typography>
              </Box>
            </Grid>
          </Grid> */}
        </CardContent>
      </MotionCard>
    );
  };

  // Content for bottom right section
  const BottomRightSection = () => {
    if (!formData) {
      return (
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          elevation={2}
          sx={{ borderRadius: 2, height: "100%" }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              textAlign: "center",
            }}
          >
            <Typography variant="h5" gutterBottom>
              You haven't submitted your financial assessment form yet.
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ maxWidth: "600px", mx: "auto", mb: 4 }}
            >
              To receive personalized financial advice and recommendations,
              please complete your financial assessment form.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditForm}
            >
              Complete Assessment
            </Button>
          </CardContent>
        </MotionCard>
      );
    }

    return (
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        elevation={2}
        sx={{ borderRadius: 2, height: "100%" }}
      >
        <CardContent>
          {investmentAdvice ? (
            <>
              <Typography
                variant="h5"
                color="primary"
                gutterBottom
                sx={{
                  fontWeight: 500,
                  mb: 2,
                  borderBottom: `1px solid ${theme.palette.primary.light}`,
                  pb: 1
                }}
              >
                Investment Recommendations for {investmentAdvice.investmentType}
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.05)' : 'rgba(99, 102, 241, 0.05)',
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.2)' : 'rgba(99, 102, 241, 0.2)'}`,
                }}
              >

                {/* Personalized Advice Section */}
                {investmentAdvice["Personalized Advice"] && (
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      gutterBottom
                    >
                      Personalized Advice
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {investmentAdvice["Personalized Advice"]}
                    </Typography>
                  </Box>
                )}

                {/* Understanding Your Situation Section */}
                {investmentAdvice["Understanding Your Situation"] && investmentAdvice["Understanding Your Situation"].length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      gutterBottom
                    >
                      Understanding Your Situation
                    </Typography>
                    <Box component="ul" sx={{ pl: 4 }}>
                      {Array.isArray(investmentAdvice["Understanding Your Situation"]) ? (
                        investmentAdvice["Understanding Your Situation"].map((situation, index) => (
                          <Box component="li" key={index} sx={{ mb: 0.5 }}>
                            <Typography variant="body1">{situation}</Typography>
                          </Box>
                        ))
                      ) : (
                        <Box component="li" sx={{ mb: 0.5 }}>
                          <Typography variant="body1">{investmentAdvice["Understanding Your Situation"]}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Pros & Cons Section */}
                {investmentAdvice["Pros & Cons for You"] && (
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      gutterBottom
                    >
                      Pros & Cons for You
                    </Typography>

                    {/* Check if Pros & Cons is an object with Pros and Cons properties */}
                    {investmentAdvice["Pros & Cons for You"].Pros && (
                      <>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                          Pros:
                        </Typography>
                        <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                          {Array.isArray(investmentAdvice["Pros & Cons for You"].Pros) ? (
                            investmentAdvice["Pros & Cons for You"].Pros.map((pro, index) => (
                              <Box component="li" key={index} sx={{ mb: 0.5 }}>
                                <Typography variant="body1">{pro}</Typography>
                              </Box>
                            ))
                          ) : (
                            <Box component="li" sx={{ mb: 0.5 }}>
                              <Typography variant="body1">{investmentAdvice["Pros & Cons for You"].Pros}</Typography>
                            </Box>
                          )}
                        </Box>
                      </>
                    )}

                    {investmentAdvice["Pros & Cons for You"].Cons && (
                      <>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                          Cons:
                        </Typography>
                        <Box component="ul" sx={{ pl: 4 }}>
                          {Array.isArray(investmentAdvice["Pros & Cons for You"].Cons) ? (
                            investmentAdvice["Pros & Cons for You"].Cons.map((con, index) => (
                              <Box component="li" key={index} sx={{ mb: 0.5 }}>
                                <Typography variant="body1">{con}</Typography>
                              </Box>
                            ))
                          ) : (
                            <Box component="li" sx={{ mb: 0.5 }}>
                              <Typography variant="body1">{investmentAdvice["Pros & Cons for You"].Cons}</Typography>
                            </Box>
                          )}
                        </Box>
                      </>
                    )}

                    {/* If Pros & Cons is not an object with Pros and Cons properties, display it as is */}
                    {!investmentAdvice["Pros & Cons for You"].Pros && !investmentAdvice["Pros & Cons for You"].Cons && (
                      <Typography variant="body1" paragraph>
                        {typeof investmentAdvice["Pros & Cons for You"] === 'string'
                          ? investmentAdvice["Pros & Cons for You"]
                          : JSON.stringify(investmentAdvice["Pros & Cons for You"], null, 2)}
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Is it Right for You Section */}
                {investmentAdvice["Is it right for you?"] && (
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      gutterBottom
                    >
                      Is it Right for You?
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {Array.isArray(investmentAdvice["Is it right for you?"])
                        ? investmentAdvice["Is it right for you?"][0]
                        : investmentAdvice["Is it right for you?"]}
                    </Typography>
                  </Box>
                )}

                {/* Step by Step Strategy Section */}
                {investmentAdvice["Step by step strategy"] && investmentAdvice["Step by step strategy"].length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      gutterBottom
                    >
                      Step by Step Strategy
                    </Typography>
                    <Box component="ol" sx={{ pl: 4 }}>
                      {Array.isArray(investmentAdvice["Step by step strategy"]) ? (
                        investmentAdvice["Step by step strategy"].map((step, index) => (
                          <Box component="li" key={index} sx={{ mb: 0.5 }}>
                            <Typography variant="body1">{step}</Typography>
                          </Box>
                        ))
                      ) : (
                        <Box component="li" sx={{ mb: 0.5 }}>
                          <Typography variant="body1">{investmentAdvice["Step by step strategy"]}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Next Steps Section */}
                {investmentAdvice["Next steps"] && investmentAdvice["Next steps"].length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      gutterBottom
                    >
                      Next Steps
                    </Typography>
                    <Box component="ol" sx={{ pl: 4 }}>
                      {Array.isArray(investmentAdvice["Next steps"]) ? (
                        investmentAdvice["Next steps"].map((step, index) => (
                          <Box component="li" key={index} sx={{ mb: 0.5 }}>
                            <Typography variant="body1">{step}</Typography>
                          </Box>
                        ))
                      ) : (
                        <Box component="li" sx={{ mb: 0.5 }}>
                          <Typography variant="body1">{investmentAdvice["Next steps"]}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Important Considerations Section */}
                {investmentAdvice["Important Considerations"] && investmentAdvice["Important Considerations"].length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      gutterBottom
                    >
                      Important Considerations
                    </Typography>
                    <Box component="ul" sx={{ pl: 4 }}>
                      {Array.isArray(investmentAdvice["Important Considerations"]) ? (
                        investmentAdvice["Important Considerations"].map((consideration, index) => (
                          <Box component="li" key={index} sx={{ mb: 0.5 }}>
                            <Typography variant="body1">{consideration}</Typography>
                          </Box>
                        ))
                      ) : (
                        <Box component="li" sx={{ mb: 0.5 }}>
                          <Typography variant="body1">{investmentAdvice["Important Considerations"]}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}

                {/* If no structured data is available, display raw data */}
                {!investmentAdvice["Personalized Advice"] &&
                  !investmentAdvice["Understanding Your Situation"] &&
                  !investmentAdvice["Pros & Cons for You"] &&
                  !investmentAdvice["Is it right for you?"] &&
                  !investmentAdvice["Step by step strategy"] &&
                  !investmentAdvice["Next steps"] &&
                  !investmentAdvice["Important Considerations"] &&
                  data && data.advice && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                        {typeof data.advice === 'string'
                          ? data.advice
                          : JSON.stringify(data.advice, null, 2)}
                      </Typography>
                    </Box>
                  )}
              </Paper>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => setInvestmentAdvice(null)}
                >
                  New Recommendation
                </Button>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                textAlign: "center",
                py: 4,
              }}
            >
              <Typography variant="h5" gutterBottom>
                Get Investment Advice
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ maxWidth: "600px", mx: "auto", mb: 2 }}
              >
                Select any investment option from the icons above to receive personalized
                investment advice and recommendations based on your financial profile.
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ maxWidth: "500px" }}
              >
                Our system will analyze your financial data and provide tailored advice
                for your selected investment type.
              </Typography>
            </Box>
          )}
          {/* --- New Transactions Manager Section --- */}
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom color="primary">
            Transactions
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            <Button size="small" variant="outlined" onClick={importFromBank} disabled={loadingTx}>
              Import from Bank
            </Button>
            <Button size="small" variant="outlined" onClick={fetchTransactions} disabled={loadingTx}>
              Refresh
            </Button>
            <Button size="small" variant="outlined" onClick={analyzeSpending} disabled={!transactions.length}>
              AI Spending Analysis
            </Button>
            <Button
              component="label"
              size="small"
              variant="outlined"
              disabled={loadingTx}
            >
              Upload CSV
              <input
                type="file"
                hidden
                accept=".csv,text/csv"
                onChange={(e) => uploadCsv(e.target.files[0])}
              />
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setOpenManualEntry(true)}
              disabled={loadingTx}
            >
              Add Manually
            </Button>
          </Box>

          {/* Manual Transaction Entry Dialog */}
          <Dialog
            open={openManualEntry}
            onClose={() => setOpenManualEntry(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Add Transaction Manually</DialogTitle>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                <TextField
                  label="Date"
                  type="date"
                  value={manualTransaction.date}
                  onChange={(e) => handleManualTransactionChange("date", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="Description"
                  value={manualTransaction.description}
                  onChange={(e) => handleManualTransactionChange("description", e.target.value)}
                  placeholder="e.g., Grocery Shopping, Coffee, Salary"
                  fullWidth
                />
                <TextField
                  label="Amount"
                  type="number"
                  value={manualTransaction.amount}
                  onChange={(e) => handleManualTransactionChange("amount", e.target.value)}
                  placeholder="0.00"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                  }}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Transaction Type</InputLabel>
                  <Select
                    value={manualTransaction.type}
                    onChange={(e) => handleManualTransactionChange("type", e.target.value)}
                    label="Transaction Type"
                  >
                    <MenuItem value="debit">Expense (Debit)</MenuItem>
                    <MenuItem value="credit">Income (Credit)</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Category (Optional)</InputLabel>
                  <Select
                    value={manualTransaction.category}
                    onChange={(e) => handleManualTransactionChange("category", e.target.value)}
                    label="Category (Optional)"
                  >
                    <MenuItem value="">Auto-categorize with AI</MenuItem>
                    <MenuItem value="Groceries">Groceries</MenuItem>
                    <MenuItem value="Housing">Housing</MenuItem>
                    <MenuItem value="Transport">Transport</MenuItem>
                    <MenuItem value="Food & Beverage">Food & Beverage</MenuItem>
                    <MenuItem value="Health & Fitness">Health & Fitness</MenuItem>
                    <MenuItem value="Insurance">Insurance</MenuItem>
                    <MenuItem value="Income">Income</MenuItem>
                    <MenuItem value="Utilities">Utilities</MenuItem>
                    <MenuItem value="Shopping">Shopping</MenuItem>
                    <MenuItem value="Entertainment">Entertainment</MenuItem>
                    <MenuItem value="Education">Education</MenuItem>
                    <MenuItem value="Travel">Travel</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenManualEntry(false)}>Cancel</Button>
              <Button
                onClick={addManualTransaction}
                variant="contained"
                disabled={loadingTx || !manualTransaction.description || !manualTransaction.amount}
              >
                {loadingTx ? "Adding..." : "Add Transaction"}
              </Button>
            </DialogActions>
          </Dialog>

          {loadingTx && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress />
            </Box>
          )}
          <MuiPaper variant="outlined" sx={{ maxHeight: 300, overflow: "auto", mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Source</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.slice(0, 50).map((t) => (
                  <TableRow key={t._id}>
                    <TableCell>{new Date(t.date).toISOString().slice(0, 10)}</TableCell>
                    <TableCell>{t.description}</TableCell>
                    <TableCell align="right">
                      {t.type === "debit" ? "-" : "+"}${t.amount?.toFixed?.(2) || t.amount}
                    </TableCell>
                    <TableCell>{t.type}</TableCell>
                    <TableCell>{t.category}</TableCell>
                    <TableCell>{t.reason}</TableCell>
                    <TableCell>{t.source}</TableCell>
                  </TableRow>
                ))}
                {!transactions.length && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No transactions imported yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </MuiPaper>
          {spendingAnalysis && (
            <Box sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, bgcolor: theme.palette.background.paper }}>
              <Typography variant="h6" fontWeight="600" gutterBottom color="primary">
                💡 AI Spending Analysis & Recommendations
              </Typography>

              {/* Overview */}
              <Box sx={{ mb: 3, p: 2, bgcolor: theme.palette.primary.main + '10', borderRadius: 1 }}>
                <Typography variant="body1" fontWeight="500">
                  {typeof spendingAnalysis.overview === 'string' ? spendingAnalysis.overview : 'Financial analysis completed.'}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {/* Financial Summary */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    📊 Financial Summary
                  </Typography>
                  <Box sx={{ pl: 1 }}>
                    <Typography variant="body2">Total Income: <strong>${spendingAnalysis.data?.totalIncome || 0}</strong></Typography>
                    <Typography variant="body2">Total Expenses: <strong>${spendingAnalysis.data?.totalExpenses || 0}</strong></Typography>
                    <Typography variant="body2" color={spendingAnalysis.data?.netBalance >= 0 ? "success.main" : "error.main"}>
                      Net Balance: <strong>${spendingAnalysis.data?.netBalance || 0}</strong>
                    </Typography>
                    <Typography variant="body2">Avg Monthly Spending: <strong>${spendingAnalysis.data?.averageMonthlySpending || 0}</strong></Typography>
                  </Box>
                </Grid>

                {/* Top Categories */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    🏷️ Top Spending Categories
                  </Typography>
                  <Box sx={{ pl: 1 }}>
                    {Array.isArray(spendingAnalysis.data?.topSpendingCategories) ?
                      spendingAnalysis.data.topSpendingCategories.slice(0, 3).map((cat, idx) => (
                        <Typography key={idx} variant="body2">
                          {idx + 1}. {cat.category}: <strong>${cat.amount}</strong>
                        </Typography>
                      )) :
                      <Typography variant="body2">No category data available</Typography>
                    }
                  </Box>
                </Grid>

                {/* Strengths */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom color="success.main">
                    ✅ Financial Strengths
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, m: 0 }}>
                    {Array.isArray(spendingAnalysis.strengths) ?
                      spendingAnalysis.strengths.map((strength, idx) => (
                        <Typography component="li" variant="body2" key={idx} sx={{ mb: 0.5 }}>
                          {typeof strength === 'string' ? strength : 'Financial strength identified'}
                        </Typography>
                      )) :
                      <Typography component="li" variant="body2">Regular financial tracking</Typography>
                    }
                  </Box>
                </Grid>

                {/* Concerns */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom color="warning.main">
                    ⚠️ Areas for Improvement
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, m: 0 }}>
                    {Array.isArray(spendingAnalysis.concerns) ?
                      spendingAnalysis.concerns.map((concern, idx) => (
                        <Typography component="li" variant="body2" key={idx} sx={{ mb: 0.5 }}>
                          {typeof concern === 'string' ? concern : 'Area for improvement identified'}
                        </Typography>
                      )) :
                      <Typography component="li" variant="body2">Monitor spending patterns</Typography>
                    }
                  </Box>
                </Grid>

                {/* Insights */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    📈 Spending Insights
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {typeof spendingAnalysis.topSpendingInsights === 'string' ?
                      spendingAnalysis.topSpendingInsights :
                      'Analysis of your spending patterns shows various categories.'}
                  </Typography>
                </Grid>

                {/* Recommendations */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom color="info.main">
                    🎯 Personalized Recommendations
                  </Typography>
                  <Box component="ol" sx={{ pl: 3, m: 0 }}>
                    {Array.isArray(spendingAnalysis.recommendations) ?
                      spendingAnalysis.recommendations.map((rec, idx) => (
                        <Typography component="li" variant="body2" key={idx} sx={{ mb: 0.5 }}>
                          {typeof rec === 'string' ? rec : 'Financial recommendation provided'}
                        </Typography>
                      )) :
                      <Typography component="li" variant="body2">Review and optimize spending habits</Typography>
                    }
                  </Box>
                </Grid>

                {/* Future Guidance */}
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: theme.palette.info.main + '10', borderRadius: 1, border: `1px solid ${theme.palette.info.main}30` }}>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                      🚀 Future Financial Guidance
                    </Typography>
                    <Typography variant="body2">
                      {typeof spendingAnalysis.futureGuidance === 'string' ?
                        spendingAnalysis.futureGuidance :
                        'Continue building positive financial habits for future success.'}
                    </Typography>
                  </Box>
                </Grid>

                {/* Budget Suggestion */}
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: theme.palette.success.main + '10', borderRadius: 1, border: `1px solid ${theme.palette.success.main}30` }}>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                      💰 Budget Recommendation
                    </Typography>
                    <Typography variant="body2">
                      {typeof spendingAnalysis.budgetSuggestion === 'string' ?
                        spendingAnalysis.budgetSuggestion :
                        'Consider creating a monthly budget based on your spending patterns.'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => setSpendingAnalysis(null)}
                >
                  New Analysis
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </MotionCard>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8, minHeight: "80vh" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <LeftColumn />
        </Grid>
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TopRightSection />
            </Grid>
            <Grid item xs={12}>
              <BottomRightSection />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
