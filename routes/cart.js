const express = require('express');
const {handleGetCartById} = require('../controllers/cart');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/:id',auth,handleGetCartById)


module.exports = router ;