const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Validation middleware
const validateRegisterUser = [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Please provide a valid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('role').notEmpty().withMessage('Role is required'),
];

const validateLoginUser = [
    check('email').isEmail().withMessage('Please provide a valid email'),
    check('password').notEmpty().withMessage('Password is required'),
];

// Register user with validations
exports.registerUser = [
    validateRegisterUser,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, role } = req.body;

        try {
            const user = await User.create({ name, email, password, role });
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
];

// Login user with validations
exports.loginUser = [
    validateLoginUser,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (user && (await user.matchPassword(password))) {
                const token = jwt.sign({ id: user._id, role: user.role }, 'secret', { expiresIn: '1h' });
                res.json({ token, user });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
];
