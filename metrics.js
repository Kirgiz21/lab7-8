import express from 'express';
import {collectDefaultMetrics, Counter, Registry} from 'prom-client';
import process from 'node:process';


const SERVER_PORT = process.env.SERVER_PORT;


const server = express();
const register = new Registry();
collectDefaultMetrics({register});


server.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (error) {
        res.status(500).end('Something went wrong');
    }
});

server.listen(SERVER_PORT, async (error) => {
    if (error) process.exit(1);
    else console.log(`Web server is started on port: ${SERVER_PORT}`);

});

const messageCounter = new Counter({
    name: 'messages',
    help: 'number_of_messages',
    registers: [register]
});

export {messageCounter};
