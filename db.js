const mongoose = require('mongoose');


async function connect() {
    await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.p5etw.mongodb.net/autocedi?retryWrites=true&w=majority`)
}

module.exports = connect