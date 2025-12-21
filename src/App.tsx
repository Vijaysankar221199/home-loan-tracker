import React, { useState } from 'react';
import { ThemeProvider } from './themes/themeContext';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import SettingsModal from './components/SettingsModal';
import PaymentForm from './components/PaymentForm';
import Charts from './components/Charts';
import { PaymentHistoryModal } from './components';
import { useLoanTracker } from './hooks/useLoanTracker';

/**
 * Main dashboard component.
 */
const Dashboard: React.FC = () => {
  const { data, loading, error, saveSettings, addMonthlyPayment, editMonthlyPayment, deleteMonthlyPayment, forecast } = useLoanTracker();
  const [showSettings, setShowSettings] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);

  if(loading) return <div className="card">Loading...</div>;
  if(error) return <div className="card">Error: {String(error)}</div>;
  if(!data) return <div className="card">No data</div>;

  const summary = data.summary;
  const settings = data.loanSettings;

  return (
    <div className="app-container">
      <Header onOpenSettings={()=>setShowSettings(true)} onOpenPaymentHistory={()=>setShowPaymentHistory(true)} />
      <div className="row">
        <div className="col">
          <div className="stats-grid">
            <StatsCard title="Total Paid" value={`₹ ${summary.totalPaid||0}`} subtitle="Amount paid till date" accent="var(--accent)" />
            <StatsCard title="Interest Paid" value={`₹ ${summary.totalInterestPaid||0}`} subtitle="Total interest" accent="var(--danger)" />
            <StatsCard title="Remaining" value={`₹ ${summary.remainingPrincipal||0}`} subtitle="Outstanding principal" accent="var(--success)" />
            <StatsCard title="Progress" value={`${Math.round(((settings.principalAmount - (summary.remainingPrincipal||settings.principalAmount))/settings.principalAmount)*100)||0}%`} subtitle={`${summary.monthsCompleted||0} months completed`} accent="var(--accent)" />
            <StatsCard title="Principal from EMI" value={`₹ ${summary.principalPaidFromEmi||0}`} subtitle="Principal paid via EMI" accent="var(--primary)" />
            <StatsCard title="Principal from Extra" value={`₹ ${summary.principalPaidFromExtra||0}`} subtitle="Principal paid via extra" accent="var(--info)" />
          </div>
          <div style={{marginTop:12}}>
            <Charts payments={data.monthlyPayments} />
          </div>
        </div>
        <div style={{width:360}}>
          <PaymentForm defaultEmi={settings.calculatedEmi || 0} onSubmit={async (entry)=>{
            try{
              await addMonthlyPayment(entry);
            }catch(e){alert((e as Error).message)}
          }} />
          <div style={{height:12}} />
          <div className="card">
            <div style={{fontWeight:700}}>Forecast</div>
            {forecast ? (
              <div style={{marginTop:8}}>
                <div className="small">Months Saved: <strong>{forecast.monthsSaved}</strong></div>
                <div className="small">Interest Saved: <strong>₹ {forecast.interestSaved}</strong></div>
              </div>
            ) : <div className="small">No forecast</div>}
          </div>
        </div>
      </div>
      <SettingsModal visible={showSettings} settings={settings} onClose={()=>setShowSettings(false)} onSave={saveSettings} />
      <PaymentHistoryModal
        visible={showPaymentHistory}
        onClose={()=>setShowPaymentHistory(false)}
        payments={data.monthlyPayments}
        onEdit={async (editData)=>{
          try{
            await editMonthlyPayment(editData);
          }catch(e){alert((e as Error).message)}
        }}
        onDelete={async (month)=>{
          try{
            await deleteMonthlyPayment(month);
          }catch(e){alert((e as Error).message)}
        }}
      />
      <div className="footer">Built with care</div>
    </div>
  );
};

/**
 * Root App component.
 */
const App: React.FC = () => (
  <ThemeProvider>
    <Dashboard />
  </ThemeProvider>
);

export default App;
