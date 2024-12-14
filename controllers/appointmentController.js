const { check, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');

const validateTimeSlot = [
    check('timeSlot')
        .notEmpty().withMessage('Time slot is required.')
        .isISO8601().withMessage('Invalid date format. Please use the format YYYY-MM-DDTHH:mm:ss.sssZ.')
        .custom((value) => {
            const date = new Date(value);
            if (date < new Date()) {
                throw new Error('Time slot cannot be in the past.');
            }
            return true;
        }),
];

exports.createTimeSlot = [
    validateTimeSlot,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { timeSlot } = req.body;
        const professorId = req.user.id;

        try {
            const existingAppointment = await Appointment.findOne({ professor: professorId, timeSlot });
            if (existingAppointment) {
                return res.status(400).json({ error: 'Time slot already exists for this professor.' });
            }

            const appointment = await Appointment.create({ professor: professorId, timeSlot });
            res.status(201).json(appointment);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
];


exports.getAvailableTimeSlots = async (req, res) => {
    const { professorId } = req.params;

    try {
        const slots = await Appointment.find({ professor: professorId, status: 'available' });
        res.json(slots);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.bookAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const studentId = req.user.id;

    try {
        const appointment = await Appointment.findById(appointmentId);
        if (appointment && appointment.status === 'available') {
            appointment.student = studentId;
            appointment.status = 'booked';
            await appointment.save();
            res.json(appointment);
        } else {
            res.status(400).json({ message: 'Appointment not available' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.cancelAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const userId = req.user.id; 
    
    try {
        const appointment = await Appointment.findById(appointmentId);
        
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (appointment.professor.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to cancel this appointment' });
        }

        if (appointment.status === 'booked') {
            appointment.student = null;
            appointment.status = 'available';
            await appointment.save();
            res.json(appointment);
        } else {
            res.status(400).json({ message: 'Appointment is not booked or already available' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getStudentAppointments = async (req, res) => {
    const studentId = req.user.id;

    try {
        const appointments = await Appointment.find({ student: studentId, status: 'booked' });
        res.json(appointments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
