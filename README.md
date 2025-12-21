# Home Loan Tracker

A comprehensive personal home loan tracker web application built with React, TypeScript, Chart.js, and Node.js backend with MongoDB. Track your mortgage payments, analyze interest savings, and forecast loan payoff scenarios with an intuitive, responsive interface.

## 🚀 Features

### Core Functionality
- **Loan Settings Management**: Configure principal amount, annual interest rate, and loan tenure
- **Monthly Payment Tracking**: Record regular EMI payments and extra principal payments
- **Real-time Calculations**: Automatic EMI calculation using standard loan formulas
- **Payment History**: View and edit past payment entries

### Analytics & Insights
- **Summary Statistics**: Track total paid, interest paid, remaining principal, and loan progress
- **Principal Breakdown**: Separate tracking of principal paid from EMI vs extra payments
- **Visual Charts**: Bar charts comparing EMI vs extra payments over time
- **Forecast Analysis**: Predict loan payoff scenarios with extra payments
- **Interest Savings Calculator**: See potential months saved and interest saved

### User Experience
- **Light/Dark Theme**: Seamless theme switching with smooth transitions
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern UI**: Clean, card-based interface with hover effects
- **Form Validation**: Input validation with user-friendly error messages

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Backend API**: RESTful API with MongoDB for data persistence
- **Database**: MongoDB for storing loan data (replaces local storage)
- **ESLint**: Code quality and consistency enforcement

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Backend**: Node.js, Express, MongoDB with Mongoose
- **Styling**: CSS with CSS Variables for theming
- **Charts**: Chart.js with react-chartjs-2
- **Build Tool**: Vite
- **Code Quality**: ESLint with React and TypeScript plugins
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Community Edition (installed locally) or MongoDB Atlas account

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ome-laon-tracker
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
npm run backend:install
```

### 4. Set Up MongoDB

#### Option A: Local MongoDB Installation
1. **Download and Install MongoDB Community Edition** from [mongodb.com](https://www.mongodb.com/try/download/community).
2. **Create Data Directory** (inside the project):
   ```bash
   mkdir data
   ```
3. **Start MongoDB** (replace `<path>` with your MongoDB bin directory, e.g., `C:\Program Files\MongoDB\Server\8.2\bin`):
   ```bash
   "<path>\mongod.exe" --dbpath .\data
   ```
   - Keep this terminal running (MongoDB will listen on `localhost:27017`).

#### Option B: MongoDB Atlas (Cloud)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a free cluster and get the connection string.
3. Update `backend/.env`:
   ```
   MONGO_URI=your-atlas-connection-string
   PORT=5000
   ```

### 5. Start the Backend Server
```bash
npm run backend
```
- The server runs on `http://localhost:5000`.

### 6. Start the Frontend Development Server
In a new terminal:
```bash
npm run dev
```
- Open [http://localhost:5173](http://localhost:5173) in your browser.

### 7. Verify Database Connection
- Open MongoDB Compass.
- Connect to `mongodb://localhost:27017` (or your Atlas URI).
- You should see the `loantracker` database with the `loanstores` collection.

## 📖 Usage

### Setting Up Your Loan
1. Click the "Settings" button in the header
2. Enter your loan details:
   - Principal amount
   - Annual interest rate (%)
   - Loan tenure (years)
3. The EMI will be automatically calculated

### Recording Payments
1. Use the "Record Monthly Payment" form
2. Select the month (YYYY-MM format)
3. Enter the EMI amount paid
4. Optionally add extra principal payment
5. Click "Submit Payment"

### Managing Payment History
1. Click the "Payment History" button in the header to open the detailed modal.
2. View all payments in a table format with full details (EMI, Extra, Interest, Principal, Remaining).
3. Edit payments inline by clicking "Edit" on any row.
4. Delete payments by clicking "Delete" (with confirmation prompt).
5. All changes automatically update the summary statistics.

### Viewing Analytics
- **Stats Cards**: Overview of total paid, interest paid, remaining principal, and progress
- **Charts**: Visual representation of EMI vs extra payments
- **Forecast**: See potential savings with current extra payment patterns

### Data Persistence
- All loan data is stored in MongoDB, ensuring persistence across sessions and devices.
- Use MongoDB Compass to view/edit data directly in the database.

### Theme Switching
- Click the theme toggle button in the header to switch between light and dark modes

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── App.tsx             # Main app component
│   ├── Header.tsx          # App header with navigation
│   ├── StatsCard.tsx       # Statistics display cards
│   ├── PaymentForm.tsx     # Payment entry form
│   ├── PaymentHistoryModal.tsx # Modal for detailed payment history
│   ├── Charts.tsx          # Chart visualization
│   └── SettingsModal.tsx   # Loan settings modal
├── hooks/              # Custom React hooks
│   └── useLoanTracker.tsx # Main data management hook
├── services/           # Data services
│   └── apiService.ts   # API calls to backend
├── themes/             # Theme management
│   └── themeContext.tsx # Theme context provider
├── types/              # TypeScript type definitions
│   └── index.ts        # All interface definitions
├── utils/              # Utility functions
│   └── loanUtils.ts    # Loan calculation utilities
└── styles.css          # Global styles

backend/
├── models/             # Mongoose models
│   └── LoanStore.js    # Loan data schema
├── routes/             # API routes
│   └── loan.js         # Loan CRUD operations
├── server.js           # Express server setup
├── package.json        # Backend dependencies
└── .env                # Environment variables
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern React patterns and TypeScript
- Chart visualization powered by Chart.js
- Inspired by the need for better personal finance tools
