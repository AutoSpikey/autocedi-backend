const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    otherNames: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    phone: {
        type: String,
        unique: true
    },
    automations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Automation' }],
    wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
}, { versionKey: false });

const User = mongoose.model('User', userSchema);

module.exports = User;