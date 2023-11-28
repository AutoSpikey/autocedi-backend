const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: String, 
    lastName: String,
    otherNames: String,
    email: String,
    password: String,
    phone: String,
    automations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Automation' }],
    wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet'},
});

const User = mongoose.model('Schema', userSchema);

module.exports = User;