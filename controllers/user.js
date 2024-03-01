const User = require("../models/user")
const asyncErrorHandler = require("../utils/asyncErrorHandler")



exports.handleSignUp = asyncErrorHandler(async (req, res, next) => {
    const user = new User(req.body)
    await user.save()
    // console.log(user);
    // sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
})



exports.handleLogIn = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    // console.log(user);
    const token = await user.generateAuthToken()
    res.send({ user, token })
})



exports.handleLogOut = asyncErrorHandler(async (req, res, next) => {
    req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token
    })
    await req.user.save()
    res.send()
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



