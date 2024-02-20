const Product = require("../models/products");



exports.handleGetAllProducts = async (req,res) => {
    try {
        const products = Product.find({});
        console.log(products);
        await products.save();
        return res.status(200).send(products);
    } catch (err) {
        res.send(err)
    }
}


exports.handleAddProduct = async(req,res) => {
    if(req.role === 'user')
    {
        return res.status(403).send({message : "You do not have permission to perform this."});
    }
    try {
        const product = new Product(req.body);
        console.log(product);
        await product.save();
        return res.status(201).send({message : "Successfully added product."})
    } catch (err) {
        console.log(err);
        return res.send(err);
    }
}

