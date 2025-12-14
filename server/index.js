// server/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// --- 1. NEW IMPORTS ---
const authRoutes = require('./routes/auth'); // Import the Authentication routes
const Ticket = require require('./models/Ticket'); // Import the Ticket Model

const app = express();

// --- 2. CONFIGURATION VARIABLES ---
// IMPORTANT: Use your exact frontend URL to fix the CORS error.
const FRONTEND_URL = 'https://student-help-desk-nine.vercel.app'; 


// --- 3. MIDDLEWARE ---

// Enable JSON body parsing
app.use(express.json());

// CORS Configuration: Allows only your specific frontend domain to access the API.
const corsOptions = {
    // Set the specific allowed origin (your frontend URL)
    origin: FRONTEND_URL, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Include all necessary HTTP methods
    credentials: true,
    optionsSuccessStatus: 204 // Essential for handling preflight requests on Vercel
};

app.use(cors(corsOptions));


// --- 4. DATABASE CONNECTION ---
// Ensure MONGO_URI is set correctly in Vercel environment variables
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected successfully'))
    .catch(err => console.error('MongoDB Connection Error:', err));


// --- 5. ROUTES ---

// Root check (useful for Vercel health check)
app.get('/', (req, res) => {
    res.json({ message: "Student Help Desk API Operational" });
});

// INTEGRATE AUTH ROUTES
// All authentication (register/login) will be accessed via the /auth endpoint
app.use('/auth', authRoutes);


// TICKET ROUTES 
// GET all tickets (Admin functionality)
app.get('/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ date: -1 }); // Sort by newest first
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new ticket (Student functionality)
app.post('/createTicket', async (req, res) => {
    try {
        const newTicket = await Ticket.create(req.body);
        res.json(newTicket);
    } catch (err) {
        console.error("Error creating ticket:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// PUT /tickets/:id/resolve (Admin functionality)
app.put('/tickets/:id/resolve', async (req, res) => {
    try {
        const ticketId = req.params.id;
        
        // Find the ticket and update its status
        const ticket = await Ticket.findByIdAndUpdate(
            ticketId,
            { status: 'Resolved' },
            { new: true } // Return the updated document
        );

        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }
        
        res.json(ticket);
    } catch (err) {
        console.error("Resolution Error:", err.message);
        res.status(500).send('Server error');
    }
});


// --- 6. VERCEL EXPORT ---
// Vercel Requirement: Export the app for serverless use
if (require.main === module) {
    const PORT = 5000; // Use a standard port locally
    app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));
}

module.exports = app;