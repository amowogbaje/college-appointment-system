const express = require('express');
const {
    createTimeSlot,
    getAvailableTimeSlots,
    bookAppointment,
    cancelAppointment,
    getStudentAppointments
} = require('../controllers/appointmentController');
const { authProfessor, authStudent } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', authProfessor, createTimeSlot);
router.get('/available/:professorId', authStudent, getAvailableTimeSlots);
router.post('/book/:appointmentId', authStudent, bookAppointment);
router.delete('/cancel/:appointmentId', authProfessor, cancelAppointment);
router.get('/student', authStudent, getStudentAppointments);

module.exports = router;
