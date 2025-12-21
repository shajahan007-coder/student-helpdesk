import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, Shield } from 'lucide-react';

const API_URL = "https://student-help-desk-api.vercel.app"; 

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post(`${API_URL}/auth/register`, { email, password, role });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            alert(`Welcome aboard! Registered as ${response.data.user.role}`);
            navigate(response.data.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed.');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}
        >
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <UserPlus size={40} color="#2563eb" />
                    <h2>Create Account</h2>
                    <p style={{ color: '#64748b' }}>Join the Help Desk community</p>
                </div>

                {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <label style={{ fontWeight: '600', fontSize: '14px' }}>I am a...</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="nav-item" style={{ width: '100%', padding: '10px', margin: '8px 0 20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <option value="student">Student</option>
                        <option value="admin">Admin / Faculty</option>
                    </select>

                    <label style={{ fontWeight: '600', fontSize: '14px' }}>Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@university.edu" required />

                    <label style={{ fontWeight: '600', fontSize: '14px' }}>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Register Now</button>
                </form>
            </div>
        </motion.div>
    );
}

export default Signup;