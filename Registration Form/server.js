const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser'); 
const app = express();
const port = 3000;

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/bharatIntern1')
    .then(() => {
        console.log(`Connected to MongoDB`);
    })
    .catch((error) => {
        console.log(error);
    });

//Object creation for storing the input which will be taken from HTML file
const studDataSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    city: 
    {
        type:String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirm_Password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true,
    },
    course: {
        type: String,
        enum: ['Android', 'Web', 'AI', 'AWS'],
        required: true,
    }
});

// Creating the mongoose model
const StudData = mongoose.model('StudData', studDataSchema);

app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit', async (req, res) => {
    try {
        if (req.body.password !== req.body.confirm_Password) {
            return res.status(400).send('Password and confirm password do not match');
        }
        const newData = new StudData({
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            city: req.body.city,
            email: req.body.email,
            password: req.body.password,
            confirm_Password: req.body.confirm_Password,
            gender: req.body.gender,
            course: req.body.course
        });

        await newData.save();
        res.redirect('/');
        // res.redirect('/?message=Data%20inserted%20successfully');
        // res.status(201).send('Data saved successfully');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Gracefully close MongoDB connection when the application exits
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed');
        server.close();
    });
});


