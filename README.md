# Home Loan Tracker

A comprehensive personal home loan tracker web application built with React, TypeScript, and Chart.js. Track your mortgage payments, analyze interest savings, and forecast loan payoff scenarios with an intuitive, responsive interface.

## 🚀 Features

### Core Functionality
- **Loan Settings Management**: Configure principal amount, annual interest rate, and loan tenure
- **Monthly Payment Tracking**: Record regular EMI payments and extra principal payments
- **Real-time Calculations**: Automatic EMI calculation using standard loan formulas
- **Payment History**: View and edit past payment entries

### Analytics & Insights
- **Summary Statistics**: Track total paid, interest paid, remaining principal, and loan progress
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
- **Local Storage**: Persistent data storage using browser localStorage
- **ESLint**: Code quality and consistency enforcement
- **Mock Backend**: Simulated async operations for realistic UX

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: CSS with CSS Variables for theming
- **Charts**: Chart.js with react-chartjs-2
- **Build Tool**: Vite
- **Code Quality**: ESLint with React and TypeScript plugins
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ome-laon-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to [http://localhost:5173](http://localhost:5173)

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

### Editing Payments
- Use the "Edit Payments" section to modify existing entries
- Click "Edit" on any payment to update EMI or extra amounts

### Viewing Analytics
- **Stats Cards**: Overview of total paid, interest paid, remaining principal, and progress
- **Charts**: Visual representation of EMI vs extra payments
- **Forecast**: See potential savings with current extra payment patterns

### Theme Switching
- Click the theme toggle button in the header to switch between light and dark modes

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── App.tsx         # Main app component
│   ├── Header.tsx      # App header with navigation
│   ├── StatsCard.tsx   # Statistics display cards
│   ├── PaymentForm.tsx # Payment entry form
│   ├── EditPayments.tsx # Payment editing interface
│   ├── Charts.tsx      # Chart visualization
│   └── SettingsModal.tsx # Loan settings modal
├── hooks/              # Custom React hooks
│   └── useLoanTracker.tsx # Main data management hook
├── services/           # Data services
│   └── mockBackend.ts  # Local storage operations
├── themes/             # Theme management
│   └── themeContext.tsx # Theme context provider
├── types/              # TypeScript type definitions
│   └── index.ts        # All interface definitions
├── utils/              # Utility functions
│   └── loanUtils.ts    # Loan calculation utilities
└── styles.css          # Global styles
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
