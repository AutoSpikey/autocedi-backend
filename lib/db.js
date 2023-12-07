const mongoose = require('mongoose');


async function connect() {
    console.log("trying to connect to db")
    await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.p5etw.mongodb.net/autocedi?retryWrites=true&w=majority`)
    console.log("connected to db")
}

module.exports = { connect }