const request = require('supertest');
const app = require('../server');  // Your Express app
const User = require('../models/User');  // Your User model

// Test User Registration
describe('POST /api/users/register', () => {
    it('should register a new user with valid input', async () => {
        const newUser = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'student',
        };

        const response = await request(app)
            .post('/api/users/register')
            .send(newUser);

        expect(response.status).toBe(201);  // Status code for created
        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toBe(newUser.name);
        expect(response.body.email).toBe(newUser.email);
    });

    it('should return 400 for invalid input', async () => {
        const invalidUser = {
            name: '',
            email: 'invalid-email',
            password: '123',
            role: '',
        };

        const response = await request(app)
            .post('/api/users/register')
            .send(invalidUser);

        expect(response.status).toBe(400);  // Bad request due to validation errors
        expect(response.body.errors).toHaveLength(4);  // We have 4 validation checks
    });
});

// Test User Login
describe('POST /api/users/login', () => {
    it('should login the user with correct credentials', async () => {
        const userCredentials = {
            email: 'johndoe@example.com',
            password: 'password123',
        };

        // Pre-create the user to login
        await User.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'password123',
            role: 'student',
        });

        const response = await request(app)
            .post('/api/users/login')
            .send(userCredentials);

        expect(response.status).toBe(200);  // OK
        expect(response.body).toHaveProperty('token');  // Expect token to be returned
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe(userCredentials.email);
    });

    it('should return 400 for invalid email or password', async () => {
        const invalidCredentials = {
            email: 'john@example.com',
            password: 'wrongpassword',
        };

        const response = await request(app)
            .post('/api/users/login')
            .send(invalidCredentials);

        expect(response.status).toBe(401);  // Unauthorized
        expect(response.body.message).toBe('Invalid email or password');
    });

    it('should return 400 for missing credentials', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({ email: '', password: '' });

        expect(response.status).toBe(400);  // Bad request due to missing input
        expect(response.body.errors).toHaveLength(2);  // Both email and password are missing
    });
});
