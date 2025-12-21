// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShieldCheck, Home as HomeIcon, LogIn, UserPlus } from 'lucide-react';

import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation Bar */}
        <header className="navbar">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={32} color="#2563eb" />
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>HelpDesk</span>
            </div>
          </Link>

          <nav className="nav-links">
            <Link to="/" className="nav-item">Home</Link>
            <Link to="/login" className="nav-item">Login</Link>
            <Link to="/signup" className="nav-item">Signup</Link>
            <Link to="/student/dashboard" className="nav-item" style={{ color: '#2563eb' }}>Dashboard</Link>
          </nav>
        </header>

        {/* Content Wrapper */}
        <main style={{ padding: '40px 5%' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Student Route */}
            <Route element={<ProtectedRoute allowedRole="student" />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
            </Route>

            {/* Protected Admin Route */}
            <Route element={<ProtectedRoute allowedRole="admin" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;