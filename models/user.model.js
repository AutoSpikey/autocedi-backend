const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    oid: { type: String, unique: true },
    firstName: String,
    lastName: String,
    otherNames: String,
    email: {
        type: String, unique: true
    },
    password: String,
    phone: {
        type: String, unique: true
    },
    automations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Automation' }],
    walletId: { type: String, unique: true },
}, { versionKey: false });

const User = mongoose.model('User', userSchema);

module.exports = User;