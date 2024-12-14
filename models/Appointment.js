const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timeSlot: { type: Date, required: true },
    status: { type: String, enum: ['booked', 'available'], default: 'available' },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
