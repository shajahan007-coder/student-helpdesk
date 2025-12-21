// server/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth'); 
const Ticket = require('./models/Ticket'); 

const app = express();

// --- CONFIGURATION ---
const FRONTEND_URL = 'https://student-help-desk-nine.vercel.app'; 

// --- MIDDLEWARE ---
app.use(express.json());

const corsOptions = {
    origin: FRONTEND_URL, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204 
};
app.use(cors(corsOptions));

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- ROUTES ---

// Health Check
app.get('/', (req, res) => {
    res.json({ message: "Student Help Desk API Operational" });
});

// Auth Routes (Register/Login)
app.use('/auth', authRoutes);

// --- TICKET ROUTES ---

// 1. GET all tickets
app.get('/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ date: -1 });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. POST new ticket
app.post('/createTicket', async (req, res) => {
    try {
        const newTicket = await Ticket.create(req.body);
        res.json(newTicket);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. DELETE a ticket (NEW ADDITION)
app.delete('/tickets/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the ID is a valid MongoDB format to prevent crashes
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'Invalid ID format' });
        }

        const result = await Ticket.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        res.json({ msg: 'Ticket deleted successfully', id });
    } catch (err) {
        console.error("Deletion Error:", err.message);
        res.status(500).json({ error: 'Server error during deletion' });
    }
});

// 4. PUT resolve ticket
app.put('/tickets/:id/resolve', async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { status: 'Resolved' },
            { new: true }
        );

        if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });
        res.json(ticket);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// server/index.js
// ... other imports
const { protect, adminOnly } = require('./middleware/authMiddleware'); // Import the new guards

// --- PROTECTED TICKET ROUTES ---

// 1. GET all tickets (Admin only)
// Only Admins should see the full list of everyone's problems
app.get('/tickets', protect, adminOnly, async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ date: -1 });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. DELETE a ticket (Protected)
// We use 'protect' so only logged-in users can delete. 
app.delete('/tickets/:id', protect, async (req, res) => {
    try {
        const result = await Ticket.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Ticket deleted successfully' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// 3. RESOLVE a ticket (Admin only)
// Only an Admin should be allowed to mark a ticket as "Resolved"
app.put('/tickets/:id/resolve', protect, adminOnly, async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { status: 'Resolved' },
            { new: true }
        );
        res.json(ticket);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// --- VERCEL EXPORT ---
if (require.main === module) {
    const PORT = 5000;
    app.listen(PORT, () => console.log(`🚀 Server ready on port ${PORT}.`));
}

module.exports = app;