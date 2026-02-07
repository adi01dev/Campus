
const jwt = require('jsonwebtoken');
require('dotenv').config();
const http = require('http');
const fs = require('fs');

const log = (msg) => fs.appendFileSync('test-stats.log', msg + '\n');

log('Starting script...');

try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';

    log(`JWT_SECRET present: ${!!JWT_SECRET}`);

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
    log(`Token generated. Length: ${token.length}`);

    const options = {
        hostname: 'localhost',
        port: 4000,
        path: '/api/dashboard/stats',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            log(`Status: ${res.statusCode}`);
            log(`Response: ${data}`);
        });
    });

    req.on('error', (e) => {
        log(`Problem with request: ${e.message}`);
    });

    req.end();
    log('Request sent.');

} catch (err) {
    log(`Error: ${err.message}`);
}
