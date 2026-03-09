import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Menu, Briefcase, Calendar } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import AddEmployee from './pages/AddEmployee';
import Attendance from './pages/Attendance';

const pageMeta = {
  '/': {
    title: 'Dashboard',
    eyebrow: 'Workforce Overview',
    description: 'Monitor headcount, attendance coverage, and the next people-ops actions from one control surface.',
  },
  '/employees': {
    title: 'Employees',
    eyebrow: 'Directory',
    description: 'Search the active roster, review department coverage, and maintain employee records.',
  },
  '/employees/add': {
    title: 'Add Employee',
    eyebrow: 'Create Record',
    description: 'Capture the core employee details once and make them available across the roster and attendance views.',
  },
  '/attendance': {
    title: 'Attendance',
    eyebrow: 'Daily Register',
    description: 'Review attendance status for any date and update records without leaving the register.',
  },
};

function AppInner() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const page = pageMeta[location.pathname] || pageMeta['/'];
  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="app-main">
        <div className="mobile-topbar">
          <button className="hamburger-btn" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="mobile-topbar-copy">
            <span className="mobile-topbar-label">{page.eyebrow}</span>
            <h2>{page.title}</h2>
          </div>
        </div>

        <header className="app-header">
          <div className="app-header-copy">
            <span className="app-eyebrow">{page.eyebrow}</span>
            <div>
              <h1>{page.title}</h1>
              <p className="app-description">{page.description}</p>
            </div>
          </div>

          <div className="app-header-actions">
            <div className="header-badge">
              <Calendar size={16} />
              <span>{todayLabel}</span>
            </div>

            {location.pathname === '/employees/add' ? (
              <Link to="/employees" className="btn btn-secondary">
                View Directory
              </Link>
            ) : (
              <Link to="/employees/add" className="btn btn-primary">
                <Briefcase size={16} />
                New Employee
              </Link>
            )}
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employees/add" element={<AddEmployee />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

export default App;
