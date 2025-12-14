// client/src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// IMPORTANT: Change this to your deployed backend API URL
const API_URL = "https://student-help-desk-api.vercel.app";

function AdminDashboard() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Open', 'Resolved'

    // --- Fetching Logic ---
    const fetchTickets = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch ALL tickets for the Admin
            const response = await axios.get(`${API_URL}/tickets`);
            setTickets(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching tickets for admin:", err);
            setError("Failed to load tickets. Check CORS or API endpoint.");
            setLoading(false);
        }
    };

    useEffect(() => {
        // NOTE: In a production app, we would include the JWT token in this request header
        // to ensure only authenticated admins can access this data.
        fetchTickets();
    }, []);

    // --- Ticket Resolution Logic ---
    const handleResolve = async (ticketId) => {
        if (!window.confirm("Are you sure you want to mark this ticket as RESOLVED?")) {
            return;
        }

        try {
            // Call the new backend route
            const response = await axios.put(`${API_URL}/tickets/${ticketId}/resolve`);
            
            // Update the local state to reflect the change immediately
            setTickets(tickets.map(ticket => 
                ticket._id === ticketId ? { ...ticket, status: 'Resolved' } : ticket
            ));
            
            alert(`Ticket ${ticketId} resolved successfully.`);
        } catch (err) {
            console.error("Resolution Error:", err);
            alert("Failed to resolve ticket. Check API access.");
        }
    };

    // --- Filtering Logic ---
    const filteredTickets = tickets.filter(ticket => {
        if (filterStatus === 'All') return true;
        return ticket.status === filterStatus;
    });

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>🛡️ Admin Dashboard: Manage Tickets</h1>
            
            {/* Filter Controls */}
            <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Filter by Status:</label>
                <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="All">All Tickets ({tickets.length})</option>
                    <option value="Open">Open Only</option>
                    <option value="Resolved">Resolved Only</option>
                </select>
                <button 
                    onClick={fetchTickets}
                    style={{ marginLeft: '15px', padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Refresh
                </button>
            </div>

            {loading && <p>Loading all tickets...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            
            {!loading && filteredTickets.length === 0 && <p>No tickets match the current filter criteria.</p>}

            {/* Ticket List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {filteredTickets.map(ticket => (
                    <div 
                        key={ticket._id} 
                        style={{ 
                            border: '1px solid #ddd', 
                            padding: '15px', 
                            borderRadius: '8px',
                            backgroundColor: ticket.status === 'Open' ? '#f8d7da' : '#d4edda', // Red for open, green for resolved
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                    >
                        <h4 style={{ margin: '0 0 10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {ticket.studentName}
                            <span 
                                style={{ fontSize: '14px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '12px', color: '#fff', backgroundColor: ticket.status === 'Open' ? '#dc3545' : '#28a745' }}
                            >
                                {ticket.status}
                            </span>
                        </h4>
                        <p style={{ margin: '0 0 10px 0', color: '#555' }}>Issue: {ticket.issue}</p>
                        <small style={{ color: '#666' }}>ID: {ticket._id}</small><br/>
                        <small style={{ color: '#666' }}>Submitted: {new Date(ticket.date).toLocaleDateString()}</small>

                        {ticket.status === 'Open' && (
                            <button 
                                onClick={() => handleResolve(ticket._id)}
                                style={{ 
                                    marginTop: '15px', 
                                    padding: '8px 12px', 
                                    backgroundColor: '#ffc107', 
                                    color: '#212529', 
                                    border: 'none', 
                                    borderRadius: '4px', 
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Mark as Resolved
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard;