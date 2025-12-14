// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import all required components
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute'; // <-- NEW IMPORT for security

function App() {
  // NOTE: In a future step, you would wrap this return block
  // with an an <AuthProvider> component to manage user state globally.

  return (
    <Router>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        
        {/* === Header and Navigation === */}
        <header style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <h1 style={{ margin: 0, color: '#007bff' }}>🎓 Help Desk</h1>
          
          <nav>
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/signup" style={linkStyle}>Signup</Link>
            {/* These links will attempt to route the user, but ProtectedRoute will intercept */}
            <Link to="/student/dashboard" style={linkStyle}>Student Area</Link>
            <Link to="/admin/dashboard" style={linkStyle}>Admin Area</Link>
          </nav>
        </header>

        {/* === Route Definitions === */}
        <Routes>
          {/* Public Routes: Accessible by anyone */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* === PROTECTED ROUTES GROUP === */}
          
          {/* 1. Student Route: Requires login AND role='student' */}
          <Route element={<ProtectedRoute allowedRole="student" />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
          </Route>
          
          {/* 2. Admin Route: Requires login AND role='admin' */}
          <Route element={<ProtectedRoute allowedRole="admin" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
          
          {/* Fallback Route */}
          <Route path="*" element={<h1 style={{color: 'red'}}>404: Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

// Simple style object for navigation links
const linkStyle = { 
    margin: '0 15px', 
    textDecoration: 'none', 
    color: '#333',
    fontWeight: 'bold'
};

export default App;