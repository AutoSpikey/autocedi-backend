const mongoose = require('mongoose');
const { Schema } = mongoose;

const automationSchema = new Schema({
    oid: {
        type: String, 
        unique: true,
    },
    label: {
        type: String,
        unique: true 
    },
    trigger: {
        field: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['time','receive'],
            required: true,
        },
        value: {
            type: String,
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
                type: String,
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
    history:[
        {
            startTime: String,
            finishTime: String,
            success: Boolean,
            logs: String
        }
    ],
    lastRan: String
}, { timestamps: true, versionKey: false });

const Automation = mongoose.model('Automation', automationSchema);

module.exports = Automation;
