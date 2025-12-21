import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, LogOut, ShieldCheck, Clock } from 'lucide-react';

const API_URL = "https://student-help-desk-api.vercel.app";

function AdminDashboard() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchAdminTickets();
    }, []);

    const fetchAdminTickets = async () => {
        try {
            const res = await axios.get(`${API_URL}/tickets`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Admin fetch error", err);
            setLoading(false);
        }
    };

    // --- The Resolve Logic ---
    const handleResolve = async (id) => {
        try {
            const res = await axios.put(`${API_URL}/tickets/${id}/resolve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Update the UI state locally
            setTickets(tickets.map(t => t._id === id ? res.data : t));
        } catch (err) {
            alert("Error resolving ticket. Are you an Admin?");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}
            >
                <h1><ShieldCheck size={30} color="#10b981" /> Admin Control Panel</h1>
                <button onClick={handleLogout} className="btn-logout" style={{ background: '#f1f5f9', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>
                    <LogOut size={20} />
                </button>
            </motion.div>

            <div style={{ display: 'grid', gap: '20px' }}>
                <AnimatePresence>
                    {tickets.map((ticket) => (
                        <motion.div
                            key={ticket._id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                background: 'white', padding: '20px', borderRadius: '12px',
                                border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between'
                            }}
                        >
                            <div>
                                <h4 style={{ margin: '0 0 5px 0' }}>{ticket.studentName}</h4>
                                <p style={{ color: '#475569', margin: '0 0 10px 0' }}>{ticket.issue}</p>
                                <span style={{ 
                                    fontSize: '12px', padding: '4px 8px', borderRadius: '4px',
                                    background: ticket.status === 'Open' ? '#fef3c7' : '#dcfce7',
                                    color: ticket.status === 'Open' ? '#92400e' : '#166534'
                                }}>
                                    {ticket.status}
                                </span>
                            </div>

                            {ticket.status === 'Open' && (
                                <button 
                                    onClick={() => handleResolve(ticket._id)}
                                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                                >
                                    <CheckCircle size={18} /> Resolve
                                </button>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default AdminDashboard;