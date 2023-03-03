require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// export one function that gets called once as the server is being initialized
module.exports = function (app, server) {

    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Connected to MongoDB'))
        .catch(error => console.log(error));

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', '*');
        next();
    });

    
    app.use(express.json());
    
    const io = require('socket.io')(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })
    
    require('./socket/chat')(io);

    app.use(function (req, res, next) { req.io = io; next(); });
    
    
    app.use('/messages' , require('./routes/messages'));
}