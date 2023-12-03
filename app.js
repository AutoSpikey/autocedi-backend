const express = require('express');
const automationRoutes = require('./routes/automation.routes');
const callbackRoutes = require('./routes/callback.routes');
const authRoutes = require('./routes/auth.routes');
const walletRoutes = require('./routes/wallet.routes');
const validateRoutes = require('./routes/validate.routes');
const cors = require('cors');
const { authenticateToken } = require('./lib/security');

const app = express();

app.use(express.json());
app.use(authenticateToken)

// app.use(audit())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "localhost"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors());

app.get('/', (req, res) => {
    return res.send('Welcome to the autocedi backend');
});

// Use the automation routes
app.use('/automations', automationRoutes);
app.use('/wallets', walletRoutes);
app.use('/callback', callbackRoutes);
app.use('/auth', authRoutes);
app.use('/validate', validateRoutes);

module.exports = app;
