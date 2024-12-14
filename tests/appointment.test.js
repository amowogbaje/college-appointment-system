const mongoose = require('mongoose');
const request = require('supertest');  
const app = require('../server'); 
const { authStudent, authProfessor } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

describe('Appointment System', () => {
  let studentToken, studentId, professorToken, professorId, appointmentId;

  beforeAll(async () => {
    const studentData = {
      name: 'Student User',
      email: 'student@example.com',
      password: 'studentpassword',
      role: 'student',
    };

    await request(app)
      .post('/api/users/register')
      .send(studentData);

    const studentLoginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: studentData.email,
        password: studentData.password,
      });

    studentToken = studentLoginResponse.body.token;
    studentId = studentLoginResponse.body.user._id;

    const professorData = {
      name: 'Professor User',
      email: 'professor@example.com',
      password: 'professorpassword',
      role: 'professor',
    };

    await request(app)
      .post('/api/users/register')
      .send(professorData);

    const professorLoginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: professorData.email,
        password: professorData.password,
      });

    professorToken = professorLoginResponse.body.token;
    professorId = professorLoginResponse.body.user._id;

    const appointment = await Appointment.create({
      professor: professorId, 
      timeSlot: new Date(Date.now() + 3600000),
      status: 'available',
    });
    appointmentId = appointment._id;
  });

  test('should allow student to view available time slots', async () => {
    const response = await request(app)
      .get(`/api/appointments/available/${professorId}`) 
      .set('Authorization', `Bearer ${studentToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([ 
      expect.objectContaining({
        professor: expect.any(String),
        timeSlot: expect.any(String),
        status: 'available',
      }),
    ]));
  });

  test('should allow student to book an appointment', async () => {
    const response = await request(app)
      .post(`/api/appointments/book/${appointmentId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('booked');
    expect(response.body.student).toBeTruthy();
  });

  test('should allow professor to cancel an appointment', async () => {
    const response = await request(app)
      .delete(`/api/appointments/cancel/${appointmentId}`)
      .set('Authorization', `Bearer ${professorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('available');
    expect(response.body.student).toBeNull();
  });

  test('should show no appointments for student after cancellation', async () => {
    const response = await request(app)
      .get('/api/appointments/student')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
