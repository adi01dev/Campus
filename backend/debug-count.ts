
import mongoose from 'mongoose';
import User from './src/models/User';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        const log = (msg: any) => fs.appendFileSync('debug-log.txt', JSON.stringify(msg, null, 2) + '\n');

        log('Connected to DB');

        const count = await User.countDocuments({ role: 'Student', department: 'CSE' });
        log({ countCSE: count });

        const countAllStudents = await User.countDocuments({ role: 'Student' });
        log({ totalStudents: countAllStudents });

    } catch (err) {
        fs.appendFileSync('debug-log.txt', 'Error: ' + err + '\n');
    } finally {
        await mongoose.disconnect();
    }
};

run();
