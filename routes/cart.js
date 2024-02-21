const express = require('express');
const { handleGetCartOfUser, handleAddProductInCart, handleDeleteProductInCart } = require('../controllers/cart');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth, handleGetCartOfUser)
router.patch('/addproductincart/:productId', auth, handleAddProductInCart);
router.delete('/deleteproductincart/:productId', auth, handleDeleteProductInCart);

module.exports = router;