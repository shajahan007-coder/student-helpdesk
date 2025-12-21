// client/src/components/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion'; // For animations
import { LogOut, Trash2, Send, Ticket as TicketIcon } from 'lucide-react'; // For modern icons

const API_URL = "https://student-help-desk-api.vercel.app"; 

function StudentDashboard() {
    const [tickets, setTickets] = useState([]);
    const [name, setName] = useState("");
    const [issue, setIssue] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get the token for authorized requests
    const token = localStorage.getItem('token');

    // 1. Fetch Tickets (Authorized)
    const fetchTickets = () => {
        setLoading(true);
        axios.get(`${API_URL}/tickets`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            setTickets(res.data);
            setLoading(false);
        })
        .catch(err => {
            setError("Session expired or server error. Please login again.");
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    // 2. Submit Ticket (Authorized)
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${API_URL}/createTicket`, 
            { studentName: name, issue },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(res => {
            setTickets([res.data, ...tickets]); 
            setName("");
            setIssue("");
        })
        .catch(err => alert("Failed to submit ticket."));
    };

    // 3. Delete Ticket Function
    const handleDelete = (id) => {
        if (!window.confirm("Permanently delete this ticket?")) return;

        axios.delete(`${API_URL}/tickets/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            setTickets(tickets.filter(t => t._id !== id));
        })
        .catch(err => alert("Delete failed. You may not have permission."));
    };

    // 4. Logout (Delete Token)
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
    };

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", fontFamily: "'Inter', sans-serif" }}>
            
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}
            >
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <TicketIcon size={32} color="#007bff" /> Student Dashboard
                </h1>
                <button 
                    onClick={handleLogout}
                    style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}
                >
                    <LogOut size={18} /> Logout
                </button>
            </motion.div>

            {/* Input Form Card */}
            <motion.div 
                className="card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '40px' }}
            >
                <h3 style={{ marginTop: 0 }}>Create a Support Request</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="text" placeholder="Your Name" value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                        required
                    />
                    <textarea
                        placeholder="Describe your problem..." value={issue}
                        onChange={(e) => setIssue(e.target.value)}
                        style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', minHeight: '100px' }}
                        required
                    />
                    <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                        <Send size={18} /> Send Ticket
                    </button>
                </form>
            </motion.div>

            <h2>📋 Active Tickets</h2>
            {loading && <p>Loading your requests...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <AnimatePresence>
                    {tickets.map((ticket) => (
                        <motion.div
                            key={ticket._id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '20px', borderRadius: '12px', background: 'white',
                                borderLeft: `6px solid ${ticket.status === 'Open' ? '#fbbf24' : '#10b981'}`,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                            }}
                        >
                            <div>
                                <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: ticket.status === 'Open' ? '#b45309' : '#047857' }}>
                                    {ticket.status}
                                </span>
                                <p style={{ margin: '8px 0', fontSize: '16px', fontWeight: '500' }}>{ticket.issue}</p>
                                <small style={{ color: '#94a3b8' }}>{new Date(ticket.date).toLocaleDateString()}</small>
                            </div>
                            
                            {/* Delete Button */}
                            <button 
                                onClick={() => handleDelete(ticket._id)}
                                style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', transition: '0.2s' }}
                                onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                                onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
                            >
                                <Trash2 size={22} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default StudentDashboard;