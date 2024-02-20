const express = require('express')
// const User = require('../models/user')
const auth = require('../middlewares/auth')
const { handleLogIn, handleSignUp, handleLogOut, handleLogOutAll, handleGetMyProfile, handleUpdateMyProfile, handleDeleteMyProfile } = require('../controllers/user')
const router = new express.Router()

router.post('/', handleSignUp)

router.post('/login', handleLogIn)


router.post('/logout', auth, handleLogOut)

router.post('/logoutAll', auth, handleLogOutAll)

router.get('/me', auth, handleGetMyProfile)

router.patch('/me', auth, handleUpdateMyProfile)

router.delete('/me', auth, handleDeleteMyProfile )


module.exports = router