const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  // Connect the ticket to the User who created it
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: String,
  issue: { type: String, required: true },
  status: { type: String, default: 'Open' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', TicketSchema);


// const mongoose = require('mongoose');

// const TicketSchema = new mongoose.Schema({
//     studentName: String,
//     issue: String,
//     status: { type: String, default: 'Open' },
//     date: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Ticket', TicketSchema);