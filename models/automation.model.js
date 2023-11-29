const mongoose = require('mongoose');
const { Schema } = mongoose;

const automationSchema = new Schema({
    label: {
        type: String,
        unique: true 
    },
    trigger: {
        field: {
            type: String,
            enum: ['time','receive'],
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
}, { timestamps: true, versionKey: false });

const Automation = mongoose.model('Automation', automationSchema);

module.exports = Automation;
