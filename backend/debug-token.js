
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';

const userId = '6984b75a68c23866e0f0b603'; // amit
const payload = {
    id: userId,
    role: 'Faculty',
    email: 'amit@gmail.com',
    name: 'amit',
    department: 'CSE',
    profileImage: ''
};

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
console.log(token);
