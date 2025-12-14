// client/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Protects routes based on user login status and role.
 * @param {string} allowedRole - The required role to access the route ('student' or 'admin').
 * @returns {JSX.Element} The child component (Dashboard) or a redirect to the login page.
 */
function ProtectedRoute({ allowedRole }) {
    // 1. Get user data and token from storage
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    let user = null;

    try {
        user = userString ? JSON.parse(userString) : null;
    } catch (e) {
        console.error("Error parsing user data:", e);
        user = null;
    }

    // --- Authentication Check ---
    if (!token || !user) {
        // Not logged in: Redirect to login page
        alert("You must be logged in to access this page.");
        return <Navigate to="/login" replace />;
    }

    // --- Authorization Check (Role Check) ---
    if (user.role !== allowedRole) {
        // Logged in, but wrong role: Redirect to Home or appropriate dashboard
        alert(`Access Denied. You must be a ${allowedRole} to view this page.`);
        
        // Redirect to the dashboard corresponding to their current role, if it exists
        if (user.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        } else if (user.role === 'student') {
            return <Navigate to="/student/dashboard" replace />;
        }
        
        // Default redirect if role is unknown or not set
        return <Navigate to="/" replace />;
    }

    // --- Access Granted ---
    // User is logged in and has the correct role, render the nested component (Dashboard)
    return <Outlet />;
}

export default ProtectedRoute;