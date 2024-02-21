const Product = require("../models/products");



exports.handleGetAllProducts = async (req,res) => {
    try {
        const products = await Product.find({});
        // console.log(products);
        res.status(200).send(products);
    } catch (err) {
        res.send(err)
    }
}

exports.handleGetProductById = async(req,res) => {
    try {
        // console.log(req.params);
        const product = await Product.findById(req.params.id)
        return res.send(product);
    } catch (err) {
       return  res.send(err);
    }
}


exports.handleAddProduct = async(req,res) => {
    if(req.role === 'user')
    {
        return res.status(403).send({message : "You do not have permission to perform this action."});
    }
    try {
        const product = new Product(req.body);
        // console.log(product);
        await product.save();
        return res.status(201).send({message : "Successfully added product."})
    } catch (err) {
        console.log(err);
        return res.send(err);
    }
}

exports.handleProductUpdate = async(req,res) => {
    if(req.role === 'user')
    {
        return res.status(403).send({message : "You do not have permission to perform this action."});
    }
    try {
        const updates = req.body ;
        // console.log(updates);
        await Product.findByIdAndUpdate(req.params.id,updates);
        return res.send("updated fields successfully");
    } catch (err) {
        return res.send(err);
    }
}



exports.handleProductDelete = async(req,res) => {
    if(req.role === 'user')
    {
        return res.status(403).send({message : "You do not have permission to perform this action."});
    }
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.send("product deleted successfully");
    } catch (err) {
        return res.send(err);
    }
}


