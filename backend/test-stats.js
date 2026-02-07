
const fs = require('fs');
const http = require('http');

const token = fs.readFileSync('token.txt', 'utf8').trim();
// Remove any surrounding quotes if present
const cleanToken = token.replace(/^"|"$/g, '');

const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/dashboard/stats',
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${cleanToken}`,
        'Content-Type': 'application/json'
    }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log('Response:', data);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
