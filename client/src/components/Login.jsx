import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Key } from 'lucide-react';

const API_URL = "https://student-help-desk-api.vercel.app"; 

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            navigate(response.data.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Invalid email or password.');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}
        >
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                    <div style={{ background: '#dcfce7', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                        <Key size={30} color="#166534" />
                    </div>
                    <h2>Welcome Back</h2>
                    <p style={{ color: '#64748b' }}>Please enter your details</p>
                </div>

                {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <label style={{ fontWeight: '600' }}>Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                    <label style={{ fontWeight: '600' }}>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                    <button type="submit" className="btn-primary" style={{ width: '100%', backgroundColor: '#28a745', marginTop: '10px' }}>
                       <LogIn size={18} style={{ marginRight: '8px' }} /> Login to Dashboard
                    </button>
                </form>
                
                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
                    Don't have an account? <a href="/signup" style={{ color: '#2563eb', fontWeight: 'bold' }}>Register</a>
                </p>
            </div>
        </motion.div>
    );
}

export default Login;