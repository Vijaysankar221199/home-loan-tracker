import React, { useState } from 'react';
import { ThemeProvider } from './themes/themeContext';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import SettingsModal from './components/SettingsModal';
import PaymentForm from './components/PaymentForm';
import Charts from './components/Charts';
import { useLoanTracker } from './hooks/useLoanTracker';

const Dashboard: React.FC = () => {
  const { data, loading, error, saveSettings, addMonthlyPayment, forecast } = useLoanTracker();
  const [showSettings, setShowSettings] = useState(false);
  const settings = data ? data.loanSettings : null;

  if(loading) return <div className="card">Loading...</div>;
  if(error) return <div className="card">Error: {String(error)}</div>;

  const summary = data.summary;

  return (
    <div className="app-container">
      <Header onOpenSettings={()=>setShowSettings(true)} />
      <div className="row">
        <div className="col">
          <div className="stats-grid">
            <StatsCard title="Total Paid" value={`₹ ${summary.totalPaid||0}`} subtitle="Amount paid till date" accent="var(--accent)" />
            <StatsCard title="Interest Paid" value={`₹ ${summary.totalInterestPaid||0}`} subtitle="Total interest" accent="var(--danger)" />
            <StatsCard title="Remaining" value={`₹ ${summary.remainingPrincipal||0}`} subtitle="Outstanding principal" accent="var(--success)" />
            <StatsCard title="Progress" value={`${Math.round(((settings.principalAmount - (summary.remainingPrincipal||settings.principalAmount))/settings.principalAmount)*100)||0}%`} subtitle={`${summary.monthsCompleted||0} months completed`} accent="var(--accent)" />
          </div>
          <div style={{marginTop:12}}>
            <Charts payments={data.monthlyPayments} forecast={forecast} />
          </div>
        </div>
        <div style={{width:360}}>
          <PaymentForm defaultEmi={settings.calculatedEmi} onSubmit={async (entry:any)=>{
            try{
              await addMonthlyPayment(entry);
            }catch(e:any){alert(e.message)}
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
      <div className="footer">Built with care · Mock JSON backend · No external storage</div>
    </div>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <Dashboard />
  </ThemeProvider>
);

export default App;
