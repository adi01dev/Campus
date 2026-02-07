
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

        const facultyDepts = await User.distinct('department', { role: 'Faculty' });
        log({ facultyDepts });

        const studentDepts = await User.distinct('department', { role: 'Student' });
        log({ studentDepts });

        const faculty = await User.find({ role: 'Faculty' }).select('name department email');
        log({ faculty });

    } catch (err) {
        fs.appendFileSync('debug-log.txt', 'Error: ' + err + '\n');
    } finally {
        await mongoose.disconnect();
    }
};

run();
