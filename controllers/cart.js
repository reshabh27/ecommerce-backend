const Cart = require("../models/carts");


exports.handleGetCartOfUser = async (req, res) => {
    try {
        let cart = await Cart.findOne({ owner: req.user._id }).populate('products').exec();
        // console.log(cart);
        if (!cart)
            return res.send([]);
        return res.send(cart?.products);
    } catch (err) {
        console.log(err);
        return res.status(400).send();
    }
}


exports.handleAddProductInCart = async (req, res) => {
    const oldProducts = await Cart.findOne({ owner: req.user._id });
    // console.log(oldProducts);
    if (oldProducts?.products?.includes(req.params.productId)) {
        return res.status(400).send({ error: 'Product is already in the cart' });
    }
    try {
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
    } catch (err) {
        return res.send(err);
    }
}

exports.handleDeleteProductInCart = async (req, res) => {
    const productId = req.params.productId;
    // console.log(productId);
    try {
        const oldCart = await Cart.findOne({ owner: req.user._id });
        if (!oldCart) {
            return res.status(404).send({ error: 'Cart not found' });
        }

        // Use $pull to remove the specified productId from the products array
        await Cart.findByIdAndUpdate(oldCart._id, { $pull: { products: productId } });
        res.send(`successfully deleted product ${productId}`);
    } catch (err) {
        return res.send(err);
    }
}