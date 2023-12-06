const mongoose = require('mongoose');
const { Schema } = mongoose;

const automationSchema = new Schema({
    oid: {
        type: String, 
        unique: true,
    },
    userId: String,
    label: String,
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
        amount: {
            type: Number,
        },
        cron: {
            type: String,
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
            field: String,
            value: Number,
            destination: String,
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
