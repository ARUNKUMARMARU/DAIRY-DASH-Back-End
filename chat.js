const Server = require('socket.io');
const http = require('http'); 
require('dotenv').config();
const config = require('./utils/config');
const mongoose = require('mongoose');

const chat = (app) => {
    
    const server = http.createServer(app);
    const io = Server(server, {
        path: "/milk",
        transports: ["websocket", "polling"],
        allowEIO3: true,
    });

    io.on('connection', (socket) => {
        if (socket) {
            console.log(`User connected: ${socket.id}`);
        }

        socket.on('disconnect', () => {
            console.log("User Disconnected");
        });

        socket.on('send_message', (message) => {
            console.log(message);
            socket.broadcast.emit('send_message', message);
        });

        socket.on('number', (message) => {
            console.log(message);
            socket.broadcast.emit('number', message);
        });
    });

    const port = process.env.PORT; 
    server.listen(port, async () => {
        console.log(`Server connected on port ${port}`);

        try {
            await mongoose.connect(config.MONGODB_URI);
            console.log('Server connected to database');
        } catch (error) {
            console.log('Error while connecting to database', error.message);
        }
    });
};

module.exports = chat;
