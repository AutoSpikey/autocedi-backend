const mongoose = require('mongoose');
const { Schema } = mongoose;

const automationSchema = new Schema({
    label: String,
    trigger: {
        type: {
            type: String,
            enum: ['time', 'receive'],
            required: true,
        },
        value: {
            cron: {
                type: String,
            },
            receiveType: {
                type: String,
            },
            receiveValue: {
                type: Number,
            },
        },
    },
    conditions: [
        {
            field: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
            value: {
                type: [Number, String],
                required: true,
            },
        },
    ],
    actions: [
        {
            type: {
                type: String,
                required: true,
            },
            value: {
                type: Number,
            },
            destination: {
                accountType: {
                    type: String,
                },
                accountInfo: {
                    type: String,
                },
            },
        },
    ],
}, { timestamps: true });

const Automation = mongoose.model('Automation', automationSchema);

module.exports = Automation;
