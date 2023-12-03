const mongoose = require('mongoose');
const { Schema } = mongoose;

const walletSchema = new Schema({
    walletId: {
        type: String,
        unique: true 
    },
    userId: String,
    category: String,
    level: String,
    owner: String,
    status: String,
    userId: String,
}, { versionKey: false });

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;