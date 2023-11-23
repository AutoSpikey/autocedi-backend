const app = require("./app");
const mongoose = require('mongoose');
const PORT = 3000

// Connect to MongoDB
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.p5etw.mongodb.net/your_database?retryWrites=true&w=majority`)
    .then(res => {
        app.listen(PORT, () => {
            console.log('listening on port ' + PORT);
        })
    }).catch(err => {
        console.error('Error connecting to MongoDB:', err.message);
    });