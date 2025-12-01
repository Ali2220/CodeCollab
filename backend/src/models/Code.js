const mongoose = require('mongoose')

const codeSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: 'javascript'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    version: {
        type: Number,
        default: 1
    },
    changeDescription: {
        type: String,
        default: 'Code Updated'
    }
}, {timestamps: true})

codeSchema.index({room: 1, createdAt: -1})

module.exports = mongoose.model('Code', codeSchema)