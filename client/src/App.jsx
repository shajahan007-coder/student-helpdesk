import { useState, useEffect } from 'react';
import axios from 'axios';

// 1. Define the live API URL here.
// Since you are hardcoding the Vercel URL, we will skip the .env lookup for simplicity.
const API_URL = "https://student-help-desk-api.vercel.app"; 

function App() {
    const [tickets, setTickets] = useState([]);
    const [name, setName] = useState("");
    const [issue, setIssue] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch tickets
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

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>🎓 Student Help Desk</h1>
            
            <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "5px", marginBottom: "20px" }}>
                <h3>Submit a New Ticket</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                    <input 
                        type="text" 
                        placeholder="Student Name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '3px' }}
                        required
                    />
                    <textarea 
                        placeholder="Describe your issue in detail..." 
                        value={issue}
                        onChange={(e) => setIssue(e.target.value)}
                        rows="4"
                        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '3px', resize: 'vertical' }}
                        required
                    />
                    <button 
                        type="submit" 
                        style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                    >
                        Submit Ticket
                    </button>
                </form>
            </div>

            <h2>📚 Recent Tickets</h2>
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
                        <strong style={{ fontWeight: 'bold' }}>{ticket.studentName}</strong> 
                        <span style={{ float: 'right', color: ticket.status === 'Open' ? 'red' : 'green' }}>[{ticket.status}]</span>
                        <p style={{ margin: '5px 0 0 0' }}>{ticket.issue}</p>
                        <small style={{ color: '#666' }}>Submitted on: {new Date(ticket.date).toLocaleDateString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;