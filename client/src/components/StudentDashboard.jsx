import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Send, LogOut, Loader2 } from 'lucide-react';

const API_URL = "https://student-help-desk-api.vercel.app"; 

function StudentDashboard() {
    const [tickets, setTickets] = useState([]);
    const [name, setName] = useState("");
    const [issue, setIssue] = useState("");
    const [loading, setLoading] = useState(true);
    
    // Get Token and User details safely
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    // 1. Fetch "My Tickets"
    const fetchTickets = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/tickets`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(res.data);
        } catch (err) {
            console.error("Fetch Error:", err.response?.data);
            if (err.response?.status === 401) handleLogout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            window.location.href = '/login';
        } else {
            fetchTickets();
        }
    }, [token]);

    // 2. Submit Ticket
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Critical Debug: Check if token exists in console
        console.log("Submitting with token:", token ? "Token Found" : "MISSING TOKEN");

        if (!token) {
            alert("Session missing. Please login again.");
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/createTicket`, 
                { studentName: name, issue },
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            
            setTickets([res.data, ...tickets]); 
            setName("");
            setIssue("");
            alert("Ticket created successfully!");
        } catch (err) {
            console.error("Submission Error Details:", err.response?.data);
            const msg = err.response?.data?.msg || "Failed to submit ticket.";
            alert(`Error: ${msg}`);
        }
    };

    // 3. Delete Ticket
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;

        try {
            await axios.delete(`${API_URL}/tickets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(tickets.filter(t => t._id !== id));
        } catch (err) {
            alert(err.response?.data?.msg || "Delete failed.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div className="dashboard-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ margin: 0 }}>Student Dashboard</h2>
                    <p style={{ color: '#64748b', margin: 0 }}>Logged in as: {userData?.email}</p>
                </div>
                <button onClick={handleLogout} className="nav-item highlight" style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <LogOut size={18} /> Logout
                </button>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
                <h3 style={{ marginTop: 0 }}><Send size={20} /> New Support Request</h3>
                <form onSubmit={handleSubmit}>
                    <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Your Name</label>
                    <input 
                        type="text" placeholder="e.g. John Doe" value={name}
                        onChange={(e) => setName(e.target.value)} required 
                    />
                    <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Issue Details</label>
                    <textarea 
                        placeholder="Describe your problem..." value={issue}
                        onChange={(e) => setIssue(e.target.value)} required 
                        style={{ minHeight: '100px' }}
                    />
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Submit Ticket</button>
                </form>
            </motion.div>

            <h3 style={{ marginTop: '40px' }}>Your Ticket History</h3>
            
            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}><Loader2 className="animate-spin" /></div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <AnimatePresence>
                        {tickets.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#64748b' }}>No tickets found.</p>
                        ) : (
                            tickets.map(ticket => (
                                <motion.div 
                                    key={ticket._id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="card"
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `5px solid ${ticket.status === 'Open' ? '#f59e0b' : '#10b981'}` }}
                                >
                                    <div>
                                        <span className={`badge ${ticket.status === 'Open' ? 'badge-open' : 'badge-resolved'}`}>
                                            {ticket.status}
                                        </span>
                                        <p style={{ margin: '10px 0', fontWeight: '600' }}>{ticket.issue}</p>
                                        <small style={{ color: '#94a3b8' }}>{new Date(ticket.date).toLocaleDateString()}</small>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(ticket._id)}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

export default StudentDashboard;