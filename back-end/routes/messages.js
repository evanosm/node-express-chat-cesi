require('dotenv').config();
// const mongoose = require('mongoose');
const express = require('express');
const messageSchema = require('../models/messages');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
});

// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//         .then(() => console.log('Connected to MongoDB'))
//         .catch(error => console.log(error));

app.get('/', async (req, res) => { 

    const messages = await messageSchema.find();
    
    if (messages) {
        res.status(200).json(messages);
    } else {
        res.status(400).json({ error });
    }
});

app.post('/', async (req, res) => { 
    const { text, date, userId, username } = req.body;
    
    const message = new messageSchema({
        text,
        date,
        userId: userId,
        username: username,
    });

    const savedMessage = await message.save();

    if (savedMessage) {
        res.status(201).json(savedMessage);
    } else { 
        res.status(400).json({ error });
    }
});

module.exports = app;