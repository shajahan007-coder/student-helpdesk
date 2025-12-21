const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth'); 
const Ticket = require('./models/Ticket'); 
const { protect, adminOnly } = require('./middleware/authMiddleware');

const app = express();

// --- CONFIGURATION ---
const FRONTEND_URL = 'https://student-help-desk-nine.vercel.app'; 

// --- MIDDLEWARE ---
app.use(express.json());

// FIXED: Explicitly allowing Authorization headers to fix the 401 error
const corsOptions = {
    origin: FRONTEND_URL, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'], // CRITICAL: Tell browser Auth header is allowed
    credentials: true,
    optionsSuccessStatus: 204 
};
app.use(cors(corsOptions));

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- ROUTES ---

app.get('/', (req, res) => {
    res.json({ message: "Student Help Desk API Operational" });
});

app.use('/auth', authRoutes);

// --- TICKET ROUTES (SECURED) ---

// 1. GET Tickets (Filtered by Role)
app.get('/tickets', protect, async (req, res) => {
    try {
        // req.user.id comes from decoded.user in your middleware
        const query = req.user.role === 'admin' ? {} : { user: req.user.id };
        const tickets = await Ticket.find(query).sort({ date: -1 });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. POST new ticket (Attached to User)
app.post('/createTicket', protect, async (req, res) => {
    try {
        const { studentName, issue } = req.body;
        
        if (!studentName || !issue) {
            return res.status(400).json({ msg: "Missing required fields" });
        }

        const newTicket = await Ticket.create({
            studentName,
            issue,
            user: req.user.id // Ownership stamping
        });
        
        res.json(newTicket);
    } catch (err) {
        console.error("POST Ticket Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 3. DELETE a ticket (Ownership Check)
app.delete('/tickets/:id', protect, async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'Invalid ID format' });
        }

        const ticket = await Ticket.findById(id);
        if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });

        // Security check: Only owner or admin
        if (ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Forbidden: You do not own this ticket' });
        }

        await Ticket.findByIdAndDelete(id);
        res.json({ msg: 'Ticket deleted successfully', id });
    } catch (err) {
        res.status(500).json({ error: 'Server error during deletion' });
    }
});

// 4. PUT resolve ticket (Admin Only)
app.put('/tickets/:id/resolve', protect, adminOnly, async (req, res) => {
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

// --- VERCEL EXPORT ---
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server ready on port ${PORT}.`));
}

module.exports = app;