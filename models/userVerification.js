const mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const userVerificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    uniqueString: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date
    },
    expiresAt: {
        type: Date,
        required: true
    }
})



const UserVerification = mongoose.model('UserVerification', userVerificationSchema);

module.exports = UserVerificationSchema;