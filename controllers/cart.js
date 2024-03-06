const Cart = require("../models/carts");
const Product = require("../models/products");
const User = require("../models/user");
const asyncErrorHandler = require("../utils/asyncErrorHandler");


exports.handleGetCartOfUser = asyncErrorHandler(async (req, res, next) => {
    let cart = await User.findById(req.user._id).populate({
        path: 'mycart',
        populate: {
            path: 'productId',
            model: 'Product'
        }
    });
    return res.status(200).send(cart.mycart);
})


exports.handleAddProductInCart = asyncErrorHandler(async (req, res, next) => {
    const oldEntry = await Cart.findOne({ productId: req.params.productId, userId: req.user._id });
    // console.log(oldEntry);
    if (oldEntry) {
        oldEntry.quantity = req.body.quantity,
            await oldEntry.save();
    }
    else {
        const cart = new Cart({
            productId: req.params.productId,
            userId: req.user._id,
            quantity: req.body.quantity
        });
        await cart.save();
    }
    return res.send("succesfully added product in cart");
})

exports.handleDeleteProductInCart = asyncErrorHandler(async (req, res, next) => {
    const productId = req.params.productId;
    // console.log(productId);
    const oldCart = await Cart.findOne({ owner: req.user._id });
    if (!oldCart) {
        return res.status(404).send({ error: 'Cart not found' });
    }

    // Use $pull to remove the specified productId from the products array
    await Cart.findByIdAndUpdate(oldCart._id, { $pull: { products: productId } });
    res.send(`successfully deleted product ${productId}`);
})