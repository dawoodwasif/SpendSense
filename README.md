# SpendSense Financial Advisory Platform

A modern web application that provides personalized financial advice and investment recommendations using AI-powered insights with real-time transaction analysis and bank data integration.


## Features

- 📊 Comprehensive financial assessment form
- 💰 Investment options analysis across 10+ asset classes
- 🤖 AI-powered investment advice using Google's Gemini AI
- 📈 Real-time financial summaries and net worth calculation
- 🎯 Personalized investment recommendations
- 📱 Responsive design for all devices
- 🎨 Modern, intuitive user interface with dark/light themes
- 🔄 Dynamic goal analysis with progress tracking
- 📋 Comprehensive investment reports
- 💡 Smart financial insights with AI reasoning
- 🛣️ Step-by-step investment strategies
- 🏦 Bank transaction import via Nessie API integration
- 📊 Auto-categorized transactions with AI reasoning
- 🧠 AI-powered spending analysis and personalized recommendations
- 📂 CSV transaction upload and processing
- ✏️ Manual transaction entry with smart categorization
- 📈 Intelligent financial pattern recognition
- 🔒 Secure user authentication with JWT


## Core Financial Management Features

### 🏦 Bank Data Integration (Nessie API)

SpendSense integrates with Capital One's Nessie API to provide:

- **Demo Bank Accounts**: Access to sandbox banking data for testing and demonstration
- **Transaction History**: Comprehensive transaction records with detailed metadata
- **Account Information**: Multiple account types (checking, savings, credit cards)
- **Real-time Data**: Live transaction feeds and account balances
- **Secure API Access**: Protected endpoints with proper authentication

### 📊 Advanced Transaction Analysis

Our platform provides sophisticated transaction management:

- **Unified Data Schema**: Seamless integration of bank data and CSV uploads
- **Smart Categorization**:
  - Rule-based categorization for common transaction patterns
  - AI-powered categorization using Gemini for complex transactions
  - Custom categories with reasoning explanations
- **Multi-source Support**:
  - Bank API integration (Nessie)
  - CSV file uploads with flexible format support
  - Manual transaction entry with intuitive dialog form
- **Data Normalization**: Automatic formatting and standardization of transaction data

### ✏️ Manual Transaction Entry

Easy-to-use transaction input system:

- **Intuitive Form Interface**: Clean dialog with date picker, amount input, and category selection
- **Smart Categorization**: Option to auto-categorize using AI or select from predefined categories
- **Real-time Validation**: Input validation to ensure data integrity
- **Immediate Integration**: Manually added transactions instantly appear in analysis and reports
- **Flexible Categories**: Support for 13+ predefined categories plus custom "Other" option

### 🧠 AI-Powered Spending Analysis

Advanced financial intelligence powered by Google's Gemini AI:

- **Financial Health Overview**: Comprehensive income vs expense analysis
- **Spending Pattern Recognition**: Identification of recurring transactions and habits
- **Category Insights**: Deep analysis of spending distribution across categories
- **Behavioral Analysis**: Recognition of financial strengths and areas for improvement
- **Predictive Recommendations**: AI-generated suggestions for budget optimization
- **Future Planning**: Strategic advice for upcoming financial decisions
- **Budget Optimization**: Personalized monthly budget recommendations

### 📈 Mock Data & Demo Environment

When live API data is unavailable, the system provides:

- **30+ Realistic Transactions**: Diverse transaction types across all major categories
- **Authentic Patterns**: Realistic spending behaviors and frequencies
- **Complete Categories**:
  - Income (salary, freelance, investments)
  - Housing (rent, mortgage, utilities)
  - Transportation (fuel, rideshare, public transport)
  - Food & Dining (groceries, restaurants, coffee)
  - Shopping (retail, online, electronics)
  - Entertainment (streaming, movies, subscriptions)
  - Health & Fitness (gym, medical, wellness)
  - Utilities (electric, water, internet, phone)

## Investment Analysis Capabilities

The platform provides detailed analysis and recommendations for various investment types:

### Traditional Investments

- **Stocks**: Individual equity analysis with risk assessment
- **Bonds**: Fixed-income securities evaluation
- **Mutual Funds**: Diversified portfolio recommendations
- **ETFs**: Exchange-traded fund analysis
- **Index Funds**: Passive investment strategies

### Alternative Investments

- **Real Estate**: Property investment guidance
- **Commodities**: Physical asset allocation advice
- **Cryptocurrency**: Digital asset risk analysis
- **Private Equity**: High-net-worth investment options
- **Fixed Deposits**: Conservative investment planning

## AI-Powered Financial Intelligence

SpendSense leverages Google's Gemini AI to provide:

### Investment Guidance

- Personalized investment advice based on financial profile
- Risk tolerance assessment and matching
- Investment suitability analysis
- Step-by-step investment strategies
- Portfolio diversification recommendations
- Market timing guidance

### Financial Planning

- Goal-based financial planning with timelines
- Retirement planning calculations
- Emergency fund recommendations
- Debt management strategies
- Tax optimization advice
- Insurance needs analysis

### Transaction Intelligence

- Automatic transaction categorization with reasoning
- Spending pattern analysis and insights
- Budget variance detection
- Fraud pattern recognition
- Subscription management recommendations
- Cash flow optimization

## Tech Stack

### Frontend Technologies

- **React.js** (v18+) - Modern component-based UI
- **Material-UI (MUI)** - Professional design system
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing and navigation
- **LocalStorage** - Client-side data persistence
- **Responsive Design** - Mobile-first approach

### Backend Technologies

- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Secure token-based authentication
- **Google Generative AI (Gemini)** - Advanced AI processing
- **Capital One Nessie API** - Banking data integration
- **bcrypt** - Password hashing and security

### External APIs

- **Google Gemini AI**: Advanced language model for financial analysis
- **Nessie API**: Capital One's banking sandbox for transaction data
- **MongoDB Atlas**: Cloud database hosting

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or Atlas account)
- **npm** or **yarn** package manager
- **Git** for version control

## API Keys Required

### Gemini AI API Key (Required)

- Provider: Google AI Studio
- Purpose: AI-powered financial analysis and recommendations
- Free tier available with usage limits

### Nessie API Key (Optional but recommended)

- Provider: Capital One DevExchange
- Purpose: Demo banking data and transactions
- Fallback: 30+ mock transactions if unavailable

### MongoDB URI (Required)

- Provider: MongoDB Atlas (recommended) or local MongoDB
- Purpose: User data, transactions, and financial records storage

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/dawoodwasif/SpendSense.git
cd SpendSense-Financial-Advisory
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
NESSIE_API_KEY=your_nessie_api_key
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication Endpoints

- `POST /signup` - User registration with validation
- `POST /login` - User authentication with JWT token generation

### User Management Endpoints

- `GET /user-profile` - Retrieve user profile information
- `GET /user-form-data` - Get user's financial assessment data
- `POST /submit-form` - Submit comprehensive financial assessment

### AI-Powered Analysis Endpoints

- `POST /api/investment-advice` - Generate personalized investment recommendations
- `POST /api/goal-analysis` - Analyze financial goals and create action plans

### Transaction Management Endpoints

- `POST /api/transactions/import` - Import transactions from Nessie API
- `POST /api/transactions/upload` - Process CSV transaction uploads
- `POST /api/transactions/manual` - Add individual transactions manually
- `GET /api/transactions` - Retrieve user transaction history
- `POST /api/transactions/spending-analysis` - Generate comprehensive spending analysis

## Security & Privacy

### Data Protection

- **JWT Authentication**: Secure token-based user sessions
- **Password Hashing**: bcrypt encryption for user passwords
- **Protected Routes**: Middleware-based API endpoint protection
- **CORS Configuration**: Controlled cross-origin resource sharing
- **Environment Variables**: Sensitive data protection

### Privacy Measures

- **No Real Banking Data**: Uses sandbox/demo data only
- **Local Data Storage**: User data stored securely in MongoDB
- **API Key Protection**: Environment variable encryption
- **Session Management**: Secure token expiration and refresh

## Getting API Keys

### Google Gemini AI API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new project or select existing
4. Generate API key
5. Copy key to `.env` file as `GEMINI_API_KEY`

### Capital One Nessie API Key

1. Go to [Capital One DevExchange](https://developer.capitalone.com/)
2. Create a developer account
3. Navigate to Nessie API documentation
4. Register for API access
5. Copy API key to `.env` file as `NESSIE_API_KEY`

### MongoDB Atlas Setup

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account and cluster
3. Configure database access and network settings
4. Copy connection string to `.env` file as `MONGODB_URI`

## Data Flow Architecture

### Transaction Processing Pipeline

1. **Data Ingestion**: Nessie API or CSV upload
2. **Data Normalization**: Unified schema conversion
3. **Categorization**: Rule-based + AI classification
4. **Storage**: MongoDB document insertion
5. **Analysis**: AI-powered pattern recognition
6. **Presentation**: Dashboard visualization

### Financial Analysis Workflow

1. **Form Submission**: Comprehensive financial assessment
2. **Goal Analysis**: AI-powered goal evaluation and recommendations
3. **Investment Matching**: Profile-based investment suggestions
4. **Progress Tracking**: Real-time goal progress monitoring
5. **Recommendation Updates**: Dynamic advice based on new data

## CSV Upload Format

For transaction CSV uploads, use this format:

```csv
date,description,amount,type
2024-01-15,Grocery Shopping,85.43,debit
2024-01-15,Salary Deposit,3500.00,credit
2024-01-14,Coffee Shop,5.75,debit
```

**Supported Columns:**

- `date` (YYYY-MM-DD format)
- `description` (transaction description)
- `amount` (decimal number)
- `type` (credit/debit)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@spendsense.com or join our Slack channel.

## Roadmap

### Upcoming Features

- [ ] Real bank integration (Plaid API)
- [ ] Advanced portfolio tracking
- [ ] Cryptocurrency portfolio management
- [ ] Bill reminder system
- [ ] Tax optimization tools
- [ ] Financial goal automation
- [ ] Social features for family financial planning

---

**SpendSense** - Accelerating your journey to financial independence with intelligent insights and personalized recommendations.
