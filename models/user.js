const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required: true,
        trim: true
    },
    email : {
        type : String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password : {
        type : String,
        required : true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    role : {
        type : String ,
        enum : ["user","admin"],

    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
})


const User = mongoose.model('User', userSchema);

module.exports = User;