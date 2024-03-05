const User = require("../models/user");
const CustomError = require("../utils/CustomError");
const asyncErrorHandler = require("../utils/asyncErrorHandler")
const sendEmail = require("../utils/email")
const crypto = require('crypto');
const UserVerification = require('../models/userVerification');
const bcrypt = require('bcryptjs')


// unique string 
const { v4: uuidv4 } = require('uuid');



// to prevent jwt leak in cross site scripting attack

// cookie has been sent only from here but browser automatically remember
// for every request backend is not sending every time just remember.
const createSendResponse = async (user, statusCode, res) => {
    const token = await user.generateAuthToken()

    const options = {
        maxAge: process.env.LOGIN_EXPIRES,
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production')
        options.secure = true;

    res.cookie('jwt', token, options);

    res.status(statusCode).send({ user, token })
}

exports.handleVerifyEmail = asyncErrorHandler(async (req, res, next) => {
    const { userId, uniqueString } = req.params;
    const toVerifyEmail = await UserVerification.findOne({ userId });

    if (!toVerifyEmail) {
        return next(new CustomError('This verification link is expired', 404))
    }

    const isMatch = await (bcrypt.compare(uniqueString, toVerifyEmail.uniqueString));
    if (!isMatch) {
        return next(new CustomError('incorrect unique string', 404));
    }

    const user = await User.findById(userId);
    user.isVerified = true;
    user.save();
    await UserVerification.findByIdAndDelete(toVerifyEmail._id)
    res.status(200).send({ message: `${user.email} : this email is now verified you can login with this mail.` })
})


exports.handleSignUp = asyncErrorHandler(async (req, res, next) => {
    const user = new User(req.body)
    user.isVerified = false;
    await user.save()
    // console.log(user);
    // sendWelcomeEmail(user.email, user.name)
    const uniqueString = uuidv4() + user.id;
    // console.log(user);
    const verficationURL = `${req.protocol}://${req.get('host')}/api/v1/user/verifyAccount/${user.id}/${uniqueString}`;
    const message = `We have recevied the account signup request. please use below link to verify account \n\n${verficationURL}\n\n this reset link is valid for 30 mins.`
    try {

        const newVerification = new UserVerification({
            userId: user.id,
            uniqueString: await bcrypt.hash(uniqueString, 8),
            createdAt: Date.now(),
            expiresAt: Date.now() + 30 * 60 * 1000
        })

        await newVerification.save();

        await sendEmail({
            email: user.email,
            subject: "Email verification request",
            message: message
        });

        res.status(200).json({
            status: 'pendig verification',
            message: 'The verification link has been sent to the user'
        })
        // await user.save()
    } catch (error) {
        // newUser.save();
        console.log(error);
        await User.findByIdAndDelete(req.user._id)
        return next(new CustomError('There was an error while sending verification email. Please try again', 500))
    }
    // createSendResponse(user, 201, res);

    // const token = await user.generateAuthToken()
    // res.status(201).send({ user, token })
})



exports.handleLogIn = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    // console.log(user);
    createSendResponse(user, 200, res);
    // const token = await user.generateAuthToken()
    // res.send({ user, token })
})



exports.handleLogOut = asyncErrorHandler(async (req, res, next) => {
    // console.log(req.user.token);
    req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token
    })
    // console.log("lol", req.user.token);
    await req.user.save()
    res.send("successfully loged out")
})



exports.handleLogOutAll = asyncErrorHandler(async (req, res, next) => {
    req.user.tokens = []
    await req.user.save()
    res.send({ message: `${req.user.email} logged out from all session` })
})


exports.handleGetMyProfile = async (req, res) => {
    res.send(req.user)
}


exports.handleUpdateMyProfile = asyncErrorHandler(async (req, res, next) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    updates.forEach((update) => req.user[update] = req.body[update])
    await req.user.save()
    res.send(req.user)
})

exports.handleDeleteMyProfile = asyncErrorHandler(async (req, res, next) => {
    // console.log(req.user._id);
    await User.findByIdAndDelete(req.user._id)
    // await req.user.remove()
    // sendCancelationEmail(req.user.email, req.user.name)
    res.send(req.user);
})



exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
    const newUser = await User.findOne({ email: req.body.email });
    if (!newUser) {
        const err = new CustomError("The user with the given email is not present", 404);
        return next(err);
    }
    // console.log(newUser);
    const resetToken = newUser.createResetPasswordToken();
    await newUser.save();
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`;
    const message = `We have recevied the password reset request. please use below link to reset password \n\n${resetURL}\n\n this reset link is valid for 30 mins.`

    try {
        await sendEmail({
            email: newUser.email,
            subject: "Password change request",
            message: message
        });

        res.status(200).json({
            status: 'success',
            message: 'The reset link has been sent to the user'
        })
    } catch (error) {
        newUser.resetPasswordHash = undefined,
            newUser.resetTokenExpire = undefined
        newUser.save();
        return next(new CustomError('There was an error while sending reset email', 500))
    }

    return resetToken;
})


exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
    // console.log("req.params.token", req.params.token);
    const resetPasswordHash = crypto.createHash('sha256').update(req.params.token).digest('hex')
    // console.log("resetPasswordHash", resetPasswordHash);
    const user = await User.findOne({ resetPasswordHash, resetTokenExpire: { $gte: Date.now() } });
    // console.log("user", user);

    if (!user) {
        return next(new CustomError('Password reset token expired or invalid', 404));
    }

    user.password = req.body.password
    user.resetPasswordHash = undefined
    user.resetTokenExpire = undefined
    // user.save();

    createSendResponse(user, 200, res);
    // const token = await user.generateAuthToken()
    // return res.send({ user, token })
})