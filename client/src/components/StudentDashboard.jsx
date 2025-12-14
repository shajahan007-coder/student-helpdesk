// client/src/components/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// IMPORTANT: Change this to your deployed backend API URL
const API_URL = "https://student-help-desk-api.vercel.app"; 

function StudentDashboard() {
    // We would normally get the studentName from the authenticated user object,
    // but we use state here to maintain the existing functionality structure.
    const [tickets, setTickets] = useState([]);
    const [name, setName] = useState("");
    const [issue, setIssue] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch tickets
    // NOTE: In a real app, this should only fetch tickets submitted by the logged-in student.
    const fetchTickets = () => {
        setLoading(true);
        setError(null);
        axios.get(`${API_URL}/tickets`)
            .then(res => {
                setTickets(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching tickets:", err);
                setError("Failed to load tickets. Please check the backend connection (CORS/API URL).");
                setLoading(false);
            });
    };

    // Fetch tickets on component mount
    useEffect(() => {
        fetchTickets();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!name || !issue) {
            alert("Please enter both your name and the issue description.");
            return;
        }

        axios.post(`${API_URL}/createTicket`, { studentName: name, issue })
            .then(res => {
                // Prepend the new ticket to the list so it appears instantly
                setTickets([res.data, ...tickets]); 
                setName(""); // Clear name input
                setIssue(""); // Clear issue input
                alert("Ticket submitted successfully!");
            })
            .catch(err => {
                console.error("Error creating ticket:", err);
                alert("Failed to submit ticket. Check browser console for errors (CORS issue is common).");
            });
    };

    const handleDelete = async (ticketId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this ticket? This action cannot be undone.");
    
    if (isConfirmed) {
        try {
            await axios.delete(`${API_URL}/tickets/${ticketId}`);
            
            // On successful deletion, update the state to remove the ticket instantly
            setTickets(tickets.filter(ticket => ticket._id !== ticketId));
            alert("Ticket deleted successfully!");
            
        } catch (error) {
            console.error('Error deleting ticket:', error);
            alert("Failed to delete ticket. Please try again.");
        }
    }
};

   // client/src/components/StudentDashboard.jsx

// ... (previous code remains the same until the return statement)

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            {/* ... (Submit Ticket form remains the same) */}

            <h2>📋 Your Recent Tickets</h2>
            {loading && <p>Loading tickets...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            
            {!loading && tickets.length === 0 && <p>No tickets have been submitted yet.</p>}

            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {tickets.map(ticket => (
                    <li 
                        key={ticket._id} 
                        style={{ 
                            border: '1px solid #eee', 
                            padding: '10px', 
                            marginBottom: '10px', 
                            borderRadius: '4px',
                            backgroundColor: ticket.status === 'Open' ? '#fff3cd' : '#d4edda' // Visual status
                        }}
                    >
                        {/* Container for title/status/button layout */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                            <strong style={{ fontWeight: 'bold' }}>{ticket.studentName}</strong> 
                            
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <span style={{ color: ticket.status === 'Open' ? 'red' : 'green' }}>[{ticket.status}]</span>
                                
                                {/* *** NEW DELETE BUTTON INTEGRATION *** Disabled if the ticket is resolved, to prevent deleting closed records.
                                */}
                                <button 
                                    onClick={() => handleDelete(ticket._id)}
                                    disabled={ticket.status === 'Resolved'}
                                    style={{ 
                                        padding: '5px 10px', 
                                        backgroundColor: ticket.status === 'Resolved' ? '#ccc' : '#dc3545', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '3px', 
                                        cursor: ticket.status === 'Resolved' ? 'not-allowed' : 'pointer',
                                        fontSize: '0.9em'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <p style={{ margin: '5px 0 0 0' }}>{ticket.issue}</p>
                        <small style={{ color: '#666' }}>Submitted on: {new Date(ticket.date).toLocaleDateString()}</small>
                    </li>
                ))}
            </ul>
        </div>
        
    );
}


export default StudentDashboard;
