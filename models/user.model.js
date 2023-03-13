const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    token: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: 'customer'
    },
    isActive: {
        type: Boolean,
        default: false
    },
    confirmationToken: {
        type: String,
        default: null
    }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)