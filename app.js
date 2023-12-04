const express = require('express');
const automationRoutes = require('./routes/automation.routes');
const callbackRoutes = require('./routes/callback.routes');
const authRoutes = require('./routes/auth.routes');
const selfRoutes = require('./routes/self.routes');
const validateRoutes = require('./routes/validate.routes');
const cors = require('cors');
const { authenticateToken } = require('./lib/security');

const app = express();

app.use(cors());

app.use(express.json());
app.use(authenticateToken)

app.get('/', (req, res) => {
    return res.send('Welcome to the autocedi backend');
});

// Use the automation routes
app.use('/automations', automationRoutes);
app.use('/callback', callbackRoutes);
app.use('/auth', authRoutes);
app.use('/validate', validateRoutes);
app.use('/self', selfRoutes);

module.exports = app;
