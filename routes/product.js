
const express = require('express');
const { handleAddProduct, handleGetAllProducts } = require('../controllers/product');

const router = express.Router();

router.get('/',handleGetAllProducts)

router.post('/add',auth , handleAddProduct);