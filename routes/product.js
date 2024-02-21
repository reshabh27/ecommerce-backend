
const express = require('express');
const { handleAddProduct, handleGetAllProducts, handleProductUpdate, handleProductDelete, handleGetProductById } = require('../controllers/product');
const auth = require('../middlewares/auth');

const router = new express.Router();

router.get('/',handleGetAllProducts)

router.post('/add',auth , handleAddProduct);

router.get('/:id',handleGetProductById);

router.patch('/:id', auth, handleProductUpdate)
router.delete('/:id', auth, handleProductDelete)


module.exports = router;