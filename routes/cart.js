const express = require('express');
const {handleGetCartOfUser, handleAddProductInCart} = require('../controllers/cart');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/',auth,handleGetCartOfUser)
router.patch('/addproductincart/:productId',auth,handleAddProductInCart);


module.exports = router ;