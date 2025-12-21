// client/src/components/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Send, Ticket as TicketIcon, LogOut, Loader2 } from 'lucide-react';

const API_URL = "https://student-help-desk-api.vercel.app"; 

function StudentDashboard() {
    const [tickets, setTickets] = useState([]);
    const [name, setName] = useState("");
    const [issue, setIssue] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get Token and User details from localStorage
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));

    // 1. Fetch "My Tickets" Only
    const fetchTickets = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/tickets`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(res.data);
            setLoading(false);
        } catch (err) {
            setError("Session expired. Please login again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            window.location.href = '/login';
        } else {
            fetchTickets();
        }
    }, []);

    // 2. Submit Ticket (Server attaches User ID automatically)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/createTicket`, 
                { studentName: name, issue },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTickets([res.data, ...tickets]); 
            setName("");
            setIssue("");
            alert("Ticket created!");
        } catch (err) {
            alert("Failed to submit ticket.");
        }
    };

    // 3. Secure Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete your ticket?")) return;

        try {
            await axios.delete(`${API_URL}/tickets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update UI by removing the deleted ticket
            setTickets(tickets.filter(t => t._id !== id));
        } catch (err) {
            alert(err.response?.data?.msg || "You are not authorized to delete this.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div className="dashboard-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2>Welcome, {userData?.email.split('@')[0]} 👋</h2>
                <button onClick={handleLogout} className="nav-item highlight" style={{ border: 'none', cursor: 'pointer' }}>
                    <LogOut size={18} /> Logout
                </button>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
                <h3><Send size={20} /> New Support Request</h3>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" placeholder="Preferred Name" value={name}
                        onChange={(e) => setName(e.target.value)} required 
                    />
                    <textarea 
                        placeholder="What can we help you with?" value={issue}
                        onChange={(e) => setIssue(e.target.value)} required 
                    />
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Submit Ticket</button>
                </form>
            </motion.div>

            <h3 style={{ marginTop: '40px' }}>Your Ticket History</h3>
            
            {loading ? <div style={{ textAlign: 'center' }}><Loader2 className="animate-spin" /></div> : null}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <AnimatePresence>
                    {tickets.length === 0 && !loading && <p>You haven't submitted any tickets yet.</p>}
                    {tickets.map(ticket => (
                        <motion.div 
                            key={ticket._id}
                            layout
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            className="card"
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `5px solid ${ticket.status === 'Open' ? '#f59e0b' : '#10b981'}` }}
                        >
                            <div>
                                <span className={`badge ${ticket.status === 'Open' ? 'badge-open' : 'badge-resolved'}`}>
                                    {ticket.status}
                                </span>
                                <p style={{ margin: '10px 0', fontWeight: '500' }}>{ticket.issue}</p>
                                <small style={{ color: '#94a3b8' }}>{new Date(ticket.date).toLocaleDateString()}</small>
                            </div>
                            <button 
                                onClick={() => handleDelete(ticket._id)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                            >
                                <Trash2 size={20} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default StudentDashboard;