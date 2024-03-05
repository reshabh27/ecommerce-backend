const express = require('express')
// const User = require('../models/user')
const auth = require('../middlewares/auth')
// const rateLimit = require('express-rate-limit');
const { handleLogIn, handleSignUp, handleLogOut, handleLogOutAll, handleGetMyProfile, handleUpdateMyProfile, handleDeleteMyProfile, forgotPassword, resetPassword, handleVerifyEmail } = require('../controllers/user')
const router = new express.Router()

// for limiting based on userid
// let limiter = rateLimit({
//     max: 3,
//     windowMs: 60 * 60 * 1000,
//     keyGenerator: function (req) {
//         return req.user.id; // use user ID as the key
//     },
//     message: `we have recevied too many request in last hour from your ip.Please try after an hour.`
// });


router.post('/', handleSignUp)

router.get('/verifyAccount/:userId/:uniqueString', handleVerifyEmail)

router.post('/login', handleLogIn)


router.post('/logout', auth, handleLogOut)

router.post('/logoutAll', auth, handleLogOutAll)

// for limiting based on userid
// router.get('/me', auth, limiter, handleGetMyProfile)

router.get('/me', auth, handleGetMyProfile)

router.patch('/me', auth, handleUpdateMyProfile)

router.delete('/me', auth, handleDeleteMyProfile)

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)


module.exports = router