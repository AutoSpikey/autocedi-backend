const mongoose = require('mongoose');
const { Schema } = mongoose;

const walletSchema = new Schema({
    walletId: String,
    userId: String,
    category: String,
    level: String,
    owner: String,
    status: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const User = mongoose.model('Schema', walletSchema);

module.exports = User;