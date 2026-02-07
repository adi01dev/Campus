
import { signAccessToken } from './src/utils/jwt';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const userId = '6984b75a68c23866e0f0b603'; // amit
const payload = {
    id: userId,
    role: 'Faculty',
    email: 'amit@gmail.com',
    name: 'amit',
    department: 'CSE',
    profileImage: ''
};

const token = signAccessToken(payload);
console.log(token);
