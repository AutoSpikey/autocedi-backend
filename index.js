require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const automationRoutes = require('./automation.routes');
const callbackRoutes = require('./callback.routes');

const audit = require("express-requests-logger")
const cors = require('cors')

const app = express();
const PORT = 3000

app.use(express.json());
app.use(audit())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "localhost"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to the autocedi backend');
});

// Use the automation routes
app.use('/automations', automationRoutes);
app.use('/callback', callbackRoutes);


// Connect to MongoDB
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.p5etw.mongodb.net/your_database?retryWrites=true&w=majority`)
    .then(res => {
        app.listen(PORT, () => {
            console.log('listening on port ' + PORT);
        })
    }).catch(err => {
        console.error('Error connecting to MongoDB:', err.message);
    });
