// client/src/components/Home.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

function Home() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            {/* Hero Section */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', background: 'linear-gradient(90deg, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Support made simple.
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '600px', margin: '0 auto 30px' }}>
                    The Student Help Desk is your one-stop platform for resolving technical issues, academic queries, and campus support requests instantly.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                    {isLoggedIn ? (
                        <button 
                            onClick={() => navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard')}
                            className="btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            Go to Dashboard <ArrowRight size={18} />
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>Get Started</Link>
                            <Link to="/signup" className="nav-item highlight" style={{ textDecoration: 'none', padding: '12px 24px' }}>Create Account</Link>
                        </>
                    )}
                </div>
            </motion.div>

            {/* Features Section */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '30px', 
                    marginTop: '80px',
                    padding: '0 5%'
                }}
            >
                <div className="card">
                    <Zap size={40} color="#2563eb" style={{ marginBottom: '15px' }} />
                    <h3>Fast Response</h3>
                    <p style={{ color: '#64748b' }}>Submit tickets in seconds and get notified the moment they are resolved.</p>
                </div>

                <div className="card">
                    <ShieldCheck size={40} color="#10b981" style={{ marginBottom: '15px' }} />
                    <h3>Secure Access</h3>
                    <p style={{ color: '#64748b' }}>Your data is protected with JWT authentication and role-based security.</p>
                </div>

                <div className="card">
                    <MessageSquare size={40} color="#f59e0b" style={{ marginBottom: '15px' }} />
                    <h3>Real-time Tracking</h3>
                    <p style={{ color: '#64748b' }}>Monitor the status of your requests from "Open" to "Resolved" in real-time.</p>
                </div>
            </motion.div>

            <footer style={{ marginTop: '100px', color: '#94a3b8', fontSize: '0.9rem' }}>
                © 2025 Student Help Desk Portal. All rights reserved.
            </footer>
        </div>
    );
}

export default Home;