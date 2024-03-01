const Cart = require("../models/carts");
const asyncErrorHandler = require("../utils/asyncErrorHandler");


exports.handleGetCartOfUser = asyncErrorHandler(async (req, res, next) => {
    let cart = await Cart.findOne({ owner: req.user._id }).populate('products').exec();
    // console.log(cart);
    if (!cart)
        return res.send([]);
    return res.send(cart?.products);
})


exports.handleAddProductInCart = asyncErrorHandler(async (req, res, next) => {
    const oldProducts = await Cart.findOne({ owner: req.user._id });
    // console.log(oldProducts);
    if (oldProducts?.products?.includes(req.params.productId)) {
        return res.status(400).send({ error: 'Product is already in the cart' });
    }
    if (!oldProducts) {
        const cart = new Cart({
            products: [req.params.productId],
            owner: req.user._id
        });
        await cart.save();
    }
    else
        await Cart.findByIdAndUpdate(oldProducts._id, { products: [...oldProducts.products, req.params.productId] })
    // console.log(test);
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