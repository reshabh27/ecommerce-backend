const User = require("../models/user")



exports.handleSignUp = async(req,res) => {
    const user = new User(req.body)

    try {
        await user.save()
        // console.log(user);
        // sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
}



exports.handleLogIn = async(req,res) => {
     try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        // console.log(user);
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
}



exports.handleLogOut = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
}



exports.handleLogOutAll = async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
}


exports.handleGetMyProfile = async (req, res) => {
    res.send(req.user)
}


exports.handleUpdateMyProfile = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
}

exports.handleDeleteMyProfile = async (req, res) => {
    try {
        // console.log(req.user._id);
        await User.findByIdAndDelete(req.user._id)
        // await req.user.remove()
        // sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
}



