import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";

const MotionPaper = motion(Paper);

function Form() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    "Personal Information",
    "Financial Status",
    "Assets & Liabilities",
    "Goals & Risk",
    "Debt & Insurance",
  ];

  const [formData, setFormData] = useState({
    // Assets
    primaryResidence: "",
    vehicles: "",
    investments: "",
    cashSavings: "",
    // Liabilities
    mortgage: "",
    carLoans: "",
    creditCardDebt: "",
    studentLoans: "",
    // Financial Information
    monthlyIncome: "",
    monthlyExpenses: "",
    annualIncome: "",
    extraIncome: "",
    // Personal Information
    age: "",
    maritalStatus: "",
    dependents: "",
    employmentStatus: "",
    // Goals & Risk
    financialGoals: "",
    shortTermGoals: "",
    financialGoal: "",
    savings: "",
    contribution: "",
    riskTolerance: "",
    experience: "",
    // Debt & Insurance
    debtLiabilities: "",
    currentDebts: "",
    outstandingDebts: "",
    totalOutstandingDebts: "",
    insurance: "",
    insuranceCoverage: "",
    insurancePolicies: "",
  });

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Please log in to access this page");
      navigate("/login");
    }

    // Fetch existing form data if available
    const fetchFormData = async () => {
      try {
        const response = await fetch("http://localhost:5000/user-form-data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.formData) {
            setFormData((prevData) => ({
              ...prevData,
              ...data.formData,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchFormData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("authToken");

    try {
      // Submit form data
      const formResponse = await fetch("http://localhost:5000/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!formResponse.ok) {
        const data = await formResponse.json();
        throw new Error(data.msg || "Error submitting form");
      }

      // Call goal analysis API
      const goalResponse = await fetch(
        "http://localhost:5000/api/goal-analysis",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!goalResponse.ok) {
        console.error("Error getting goal analysis");
      } else {
        const goalData = await goalResponse.json();
        console.log(goalData);
        // Store goal analysis in localStorage for dashboard use
        localStorage.setItem("goalAnalysis", JSON.stringify(goalData.analysis));
      }

      console.log("Form submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Marital Status</InputLabel>
                <Select
                  label="Marital Status"
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Married">Married</MenuItem>
                  <MenuItem value="Divorced">Divorced</MenuItem>
                  <MenuItem value="Widowed">Widowed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Number of Dependents"
                name="dependents"
                type="number"
                value={formData.dependents}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Employment Status</InputLabel>
                <Select
                  label="Employment Status"
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Employed">Employed</MenuItem>
                  <MenuItem value="Self-Employed">Self-Employed</MenuItem>
                  <MenuItem value="Unemployed">Unemployed</MenuItem>
                  <MenuItem value="Retired">Retired</MenuItem>
                  <MenuItem value="Student">Student</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monthly Income ($)"
                name="monthlyIncome"
                type="number"
                value={formData.monthlyIncome}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monthly Expenses ($)"
                name="monthlyExpenses"
                type="number"
                value={formData.monthlyExpenses}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Annual Income ($)"
                name="annualIncome"
                type="number"
                value={formData.annualIncome}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Additional Income Sources ($)"
                name="extraIncome"
                type="number"
                value={formData.extraIncome}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Assets
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Primary Residence Value ($)"
                name="primaryResidence"
                type="number"
                value={formData.primaryResidence}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vehicles Value ($)"
                name="vehicles"
                type="number"
                value={formData.vehicles}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Investments Value ($)"
                name="investments"
                type="number"
                value={formData.investments}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cash & Savings ($)"
                name="cashSavings"
                type="number"
                value={formData.cashSavings}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Liabilities
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mortgage Balance ($)"
                name="mortgage"
                type="number"
                value={formData.mortgage}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Car Loans ($)"
                name="carLoans"
                type="number"
                value={formData.carLoans}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Credit Card Debt ($)"
                name="creditCardDebt"
                type="number"
                value={formData.creditCardDebt}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student Loans ($)"
                name="studentLoans"
                type="number"
                value={formData.studentLoans}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Financial Goals"
                name="financialGoals"
                multiline
                rows={3}
                value={formData.financialGoals}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="Describe your long-term financial goals"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short-Term Goals"
                name="shortTermGoals"
                multiline
                rows={3}
                value={formData.shortTermGoals}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="Describe your short-term financial goals (1-3 years)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Target Savings Amount ($)"
                name="savings"
                type="number"
                value={formData.savings}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monthly Contribution ($)"
                name="contribution"
                type="number"
                value={formData.contribution}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Risk Tolerance</InputLabel>
                <Select
                  label="Risk Tolerance"
                  name="riskTolerance"
                  value={formData.riskTolerance}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Conservative">Conservative</MenuItem>
                  <MenuItem value="Moderate">Moderate</MenuItem>
                  <MenuItem value="Aggressive">Aggressive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Investment Experience</InputLabel>
                <Select
                  label="Investment Experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                >
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Debts"
                name="currentDebts"
                multiline
                rows={3}
                value={formData.currentDebts}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="List your current debts"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Outstanding Debts ($)"
                name="totalOutstandingDebts"
                type="number"
                value={formData.totalOutstandingDebts}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Insurance Coverage"
                name="insuranceCoverage"
                multiline
                rows={3}
                value={formData.insuranceCoverage}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="Describe your current insurance coverage"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Insurance Types</InputLabel>
                <Select
                  multiple
                  label="Insurance Types"
                  name="insurancePolicies"
                  value={
                    formData.insurancePolicies
                      ? formData.insurancePolicies.split(",")
                      : []
                  }
                  onChange={(e) => {
                    const value = e.target.value.join(",");
                    handleInputChange({
                      target: { name: "insurancePolicies", value },
                    });
                  }}
                  renderValue={(selected) => selected.join(", ")}
                >
                  <MenuItem value="Health">Health</MenuItem>
                  <MenuItem value="Life">Life</MenuItem>
                  <MenuItem value="Auto">Auto</MenuItem>
                  <MenuItem value="Home">Home</MenuItem>
                  <MenuItem value="Disability">Disability</MenuItem>
                  <MenuItem value="Long-term Care">Long-term Care</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        elevation={3}
        sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          color="primary"
          sx={{ mb: 4 }}
        >
          Financial Assessment Form
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form
          onSubmit={activeStep === steps.length - 1 ? handleSubmit : handleNext}
        >
          <Box sx={{ mb: 4 }}>{renderStepContent(activeStep)}</Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              ) : (
                <Button variant="contained" color="primary" type="submit">
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </MotionPaper>
    </Container>
  );
}

export default Form;
