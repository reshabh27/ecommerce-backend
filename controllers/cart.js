const Cart = require("../models/carts");
const User = require("../models/user");


exports.handleGetCartOfUser = async (req, res) => {
    try {
        let cart = await Cart.findOne({ owner: req.user._id }).populate('products').exec();
        // console.log(cart);

        return res.send(cart);
    } catch (err) {
        console.log(err);
        return res.status(400).send();
    }
}


exports.handleAddProductInCart = async (req, res) => {
    const cart = new Cart({ owner: req.user._id, products: [req.params.productId] });
    try {
        // const oldProducts = await Cart.findOne({owner:req.user._id});
        // console.log(oldProducts);
        await cart.save();
        console.log(cart);

        return res.send("succesfully added product in cart");
    } catch (err) {
        return res.send(err);
    }
}